"""Bullet regeneration endpoint for CV Pro.

Regenerates a single bullet with a specific angle (tech, impact, problem, any).
Uses the bullet_regen.md prompt with extra context about the bullet's position.
"""

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from services.claude_client import call_claude
from services.prompt_engine import load_regen_prompt
from services.response_parser import parse_bullet_regen_response


# --- Pydantic models ---


class RegenerateBulletRequest(BaseModel):
    """Request body for single bullet regeneration.

    Attributes:
        section: CV section name (e.g. "projects").
        project: Project key (e.g. "thinkroom").
        bullet_index: Zero-based index of the bullet to regenerate.
        current_bullet: The current bullet text to replace.
        other_bullets: Other bullets in the same project (to avoid duplication).
        angle: Requested angle — "tech", "impact", "problem", or "any".
        cv_data: Full structured CV data for context.
        jd_data: Job description data with raw_text and keywords.
    """

    section: str
    project: str
    bullet_index: int
    current_bullet: str
    other_bullets: list[str]
    angle: str
    cv_data: dict
    jd_data: dict


class RegenerateBulletResponse(BaseModel):
    """Response with the regenerated bullet.

    Attributes:
        new_bullet: The newly generated bullet text.
    """

    new_bullet: str


# --- Router ---

router = APIRouter(prefix="/api", tags=["regenerate"])


@router.post("/regenerate-bullet", response_model=RegenerateBulletResponse)
async def regenerate_bullet(
    request: RegenerateBulletRequest,
) -> RegenerateBulletResponse:
    """Regenerate a single bullet with a specific angle.

    Loads the bullet_regen.md prompt with extra context about the bullet's
    position, sibling bullets, and requested angle, then returns a new bullet.

    Args:
        request: RegenerateBulletRequest with bullet context and angle.

    Returns:
        RegenerateBulletResponse with the new bullet text.

    Raises:
        HTTPException: On prompt loading errors (404) or Claude API errors.
    """
    try:
        system_prompt, user_message = await load_regen_prompt(
            section=request.section,
            project=request.project,
            bullet_index=request.bullet_index,
            current_bullet=request.current_bullet,
            other_bullets=request.other_bullets,
            angle=request.angle,
            cv_data=request.cv_data,
            jd_data=request.jd_data,
        )
    except FileNotFoundError as e:
        raise HTTPException(status_code=404, detail=str(e))

    # Call Claude — errors are raised as HTTPException by claude_client
    raw_response = await call_claude(system_prompt, user_message)

    parsed = parse_bullet_regen_response(raw_response)

    return RegenerateBulletResponse(**parsed)
