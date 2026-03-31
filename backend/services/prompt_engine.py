"""Prompt loading and message building for CV Pro.

Loads .md prompt templates from backend/prompts/ and builds the
system prompt + user message pairs sent to Claude. Re-reads from
disk on every call so prompts are hot-editable without restart.
"""

import json
from pathlib import Path


# Resolve prompts directory relative to this file
# Works both locally (backend/services/../prompts) and in Docker (/app/prompts)
PROMPTS_DIR = Path(__file__).parent.parent / "prompts"


async def load_prompt(
    tool_name: str,
    cv_data: dict,
    jd_data: dict,
) -> tuple[str, str]:
    """Load a prompt template and build the system/user message pair.

    Args:
        tool_name: Name of the tool (maps to filename, e.g. "projects" → projects.md).
        cv_data: Structured CV data from the frontend input boxes.
        jd_data: Job description data with raw_text and keywords.

    Returns:
        Tuple of (system_prompt, user_message).

    Raises:
        FileNotFoundError: If the prompt .md file doesn't exist.
    """
    prompt_path = PROMPTS_DIR / f"{tool_name}.md"

    if not prompt_path.exists():
        raise FileNotFoundError(f"Prompt file not found: {prompt_path}")

    # Re-read from disk every time — no caching, enables hot-editing
    system_prompt = prompt_path.read_text(encoding="utf-8")

    # Build user message with CV and JD data
    user_message = (
        f"## CV Data\n"
        f"{json.dumps(cv_data, ensure_ascii=False, indent=2)}\n\n"
        f"## Job Description\n"
        f"{jd_data.get('raw_text', '')}\n\n"
        f"## JD Keywords\n"
        f"{', '.join(jd_data.get('keywords', []))}"
    )

    return system_prompt, user_message


async def load_regen_prompt(
    section: str,
    project: str,
    bullet_index: int,
    current_bullet: str,
    other_bullets: list[str],
    angle: str,
    cv_data: dict,
    jd_data: dict,
) -> tuple[str, str]:
    """Load the bullet regeneration prompt with extra context.

    The bullet_regen prompt needs more context than standard tool prompts:
    which section, which project, the current bullet to replace, sibling
    bullets to avoid duplication, and the requested angle.

    Args:
        section: CV section name (e.g. "projects").
        project: Project key (e.g. "thinkroom").
        bullet_index: Zero-based index of the bullet being regenerated.
        current_bullet: The current bullet text to replace.
        other_bullets: Other bullets in the same project (avoid duplication).
        angle: Requested angle — "tech", "impact", "problem", or "any".
        cv_data: Full structured CV data.
        jd_data: Job description data with raw_text and keywords.

    Returns:
        Tuple of (system_prompt, user_message).

    Raises:
        FileNotFoundError: If bullet_regen.md doesn't exist.
    """
    prompt_path = PROMPTS_DIR / "bullet_regen.md"

    if not prompt_path.exists():
        raise FileNotFoundError(f"Prompt file not found: {prompt_path}")

    system_prompt = prompt_path.read_text(encoding="utf-8")

    # Build user message with bullet-specific context
    user_message = (
        f"## Section\n{section}\n\n"
        f"## Project\n{project}\n\n"
        f"## Bullet Index\n{bullet_index}\n\n"
        f"## Current Bullet (replace this)\n{current_bullet}\n\n"
        f"## Other Bullets in This Project (avoid duplication)\n"
        f"{chr(10).join(f'- {b}' for b in other_bullets)}\n\n"
        f"## Requested Angle\n{angle}\n\n"
        f"## CV Data\n"
        f"{json.dumps(cv_data, ensure_ascii=False, indent=2)}\n\n"
        f"## Job Description\n"
        f"{jd_data.get('raw_text', '')}\n\n"
        f"## JD Keywords\n"
        f"{', '.join(jd_data.get('keywords', []))}"
    )

    return system_prompt, user_message
