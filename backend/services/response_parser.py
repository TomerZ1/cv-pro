"""Response parsers for Claude's raw text output.

Each tool produces a DIFFERENT output format. This module has a dedicated
parser for each one, converting raw text into structured JSON that the
frontend can consume directly.
"""

import json
import re


def parse_projects_response(raw: str) -> dict:
    """Parse Tool 1 (Projects) response — markdown with ### headings and Version A/B blocks.

    Claude outputs:
        ### ProjectTitle | Org | Period
        Version A — Tasks & Process:
        - bullet1
        - bullet2
        Version B — Impact & Outcomes:
        - bullet1
        - bullet2
        ---
        ### Suggestions for improvement
        - suggestion1

    Args:
        raw: Raw text response from Claude.

    Returns:
        Dict with {projects: [{title, version_a: [...], version_b: [...]}], suggestions: []}.

    Raises:
        ValueError: If no projects could be parsed from the response.
    """
    result = {"projects": [], "suggestions": []}

    # Split into sections by ### headers
    sections = re.split(r"^###\s+", raw, flags=re.MULTILINE)

    for section in sections:
        if not section.strip():
            continue

        # Check if this is the suggestions section
        first_line = section.split("\n")[0].strip().lower()
        if "suggestion" in first_line:
            suggestion_bullets = _extract_bullets(section)
            result["suggestions"] = suggestion_bullets
            continue

        # Extract project title from first line
        title_line = section.split("\n")[0].strip()

        # Find Version A and Version B markers
        version_a_match = re.search(
            r"Version A[^:]*:(.*?)(?=Version B|$)", section, re.DOTALL | re.IGNORECASE
        )
        version_b_match = re.search(
            r"Version B[^:]*:(.*?)(?=---|###|$)", section, re.DOTALL | re.IGNORECASE
        )

        version_a_bullets = []
        version_b_bullets = []

        if version_a_match:
            version_a_bullets = _extract_bullets(version_a_match.group(1))
        if version_b_match:
            version_b_bullets = _extract_bullets(version_b_match.group(1))

        # Only add if we found at least some bullets
        if version_a_bullets or version_b_bullets:
            result["projects"].append({
                "title": title_line,
                "version_a": version_a_bullets,
                "version_b": version_b_bullets,
            })

    if not result["projects"]:
        raise ValueError("No projects could be parsed from Claude response")

    return result


def parse_skills_response(raw: str) -> dict:
    """Parse Tool 2 (Skills) response — category lines + recommendations.

    Claude outputs:
        Category Name: item1, item2, item3
        Another Category: item1, item2
        ...
        Recommendations for the Resume:
        - recommendation1
        - recommendation2

    Args:
        raw: Raw text response from Claude.

    Returns:
        Dict with {categories: [{name, items}], recommendations: []}.

    Raises:
        ValueError: If no categories could be extracted.
    """
    categories = []
    recommendations = []
    in_recommendations = False

    for line in raw.strip().split("\n"):
        line = line.strip()
        if not line:
            continue

        # Detect recommendations section (always in English per prompt rules)
        if re.match(r"^recommendations?\s", line, re.IGNORECASE):
            in_recommendations = True
            continue

        if in_recommendations:
            # Extract recommendation bullets
            bullet = _clean_bullet_prefix(line)
            if bullet:
                recommendations.append(bullet)
        elif ":" in line:
            # Category line — split on first colon
            name, items_str = line.split(":", 1)
            name = name.strip()
            # Split items by comma, clean whitespace
            items = [item.strip() for item in items_str.split(",") if item.strip()]
            if name and items:
                categories.append({"name": name, "items": items})

    if not categories:
        raise ValueError("No skill categories found in Claude response")

    return {"categories": categories, "recommendations": recommendations}


def parse_profile_response(raw: str) -> dict:
    """Parse Tool 3 (Profile) response — two versions separated by ---.

    Claude outputs:
        • bullet1
        • bullet2
        ---
        • bullet1
        • bullet2

    Args:
        raw: Raw text response from Claude.

    Returns:
        Dict with {version_1: {label, bullets}, version_2: {label, bullets}}.

    Raises:
        ValueError: If the response doesn't contain two versions.
    """
    # Split on --- separator (standalone line of 3+ dashes)
    parts = re.split(r"\n\s*-{3,}\s*\n", raw)

    if len(parts) < 2:
        raise ValueError(
            "Profile response missing '---' separator between versions"
        )

    version_1_bullets = _extract_bullets(parts[0])
    version_2_bullets = _extract_bullets(parts[1])

    if not version_1_bullets:
        raise ValueError("No bullets found in Profile version 1")
    if not version_2_bullets:
        raise ValueError("No bullets found in Profile version 2")

    return {
        "version_1": {"label": "Experience-Led", "bullets": version_1_bullets},
        "version_2": {"label": "Highlight Reel", "bullets": version_2_bullets},
    }


def parse_achievements_response(raw: str) -> dict:
    """Parse Tool 4 (Achievements) response — raw JSON.

    Claude returns raw JSON with a transformations array. We validate
    the structure and map field names to match the frontend API shape.

    Args:
        raw: Raw JSON string from Claude.

    Returns:
        Dict with {suggestions: [{section, project, bullet_index, original,
        suggested, reasoning, impact_score, impact_reason, coach_question,
        coach_field_label}]}.

    Raises:
        ValueError: If JSON is invalid or missing required fields.
    """
    # Strip potential markdown code fences that Claude sometimes adds
    cleaned = raw.strip()
    if cleaned.startswith("```"):
        # Remove opening fence (with optional language tag) and closing fence
        cleaned = re.sub(r"^```\w*\n?", "", cleaned)
        cleaned = re.sub(r"\n?```$", "", cleaned)
        cleaned = cleaned.strip()

    try:
        data = json.loads(cleaned)
    except json.JSONDecodeError as e:
        raise ValueError(f"Achievements response is not valid JSON: {e}")

    if "transformations" not in data:
        raise ValueError("Achievements response missing 'transformations' key")

    # Map 'transformed' → 'suggested' for frontend consistency
    suggestions = []
    required_fields = [
        "section", "original", "transformed", "impact_score",
        "impact_reason", "coach_question", "coach_field_label",
    ]

    for item in data["transformations"]:
        # Validate required fields exist
        missing = [f for f in required_fields if f not in item]
        if missing:
            raise ValueError(f"Achievement item missing fields: {missing}")

        suggestions.append({
            "section": item["section"],
            "project": item.get("project", ""),
            "bullet_index": item.get("bullet_index", 0),
            "original": item["original"],
            "suggested": item["transformed"],  # Rename for frontend
            "reasoning": item.get("impact_reason", ""),
            "impact_score": item["impact_score"],
            "impact_reason": item["impact_reason"],
            "coach_question": item["coach_question"],
            "coach_field_label": item["coach_field_label"],
        })

    return {"suggestions": suggestions}


def parse_bullet_regen_response(raw: str) -> dict:
    """Parse bullet regeneration response — single line of text.

    Args:
        raw: Raw text from Claude (just one bullet).

    Returns:
        Dict with {new_bullet: str}.
    """
    return {"new_bullet": raw.strip()}


# --- Private helpers ---


def _extract_bullets(text: str) -> list[str]:
    """Extract bullet lines from a block of text.

    Handles bullets prefixed with -, *, •, or numbered lists.

    Args:
        text: Block of text potentially containing bullet lines.

    Returns:
        List of cleaned bullet strings.
    """
    bullets = []
    for line in text.strip().split("\n"):
        cleaned = _clean_bullet_prefix(line)
        if cleaned:
            bullets.append(cleaned)
    return bullets


def _clean_bullet_prefix(line: str) -> str:
    """Remove bullet prefixes (-, *, •, numbers) from a line.

    Args:
        line: A single line of text.

    Returns:
        Cleaned text without bullet prefix, or empty string if line is not a bullet.
    """
    line = line.strip()
    if not line:
        return ""

    # Match common bullet prefixes: -, *, •, or numbered (1. 2. etc.)
    match = re.match(r"^(?:[-*•]|\d+\.)\s+(.*)", line)
    if match:
        return match.group(1).strip()

    return ""


