"""Anthropic SDK wrapper for CV Pro.

ALL Claude API calls MUST go through this module. No other file should
import or instantiate the Anthropic client directly.
"""

import anthropic
from fastapi import HTTPException

from config import settings


# Async client initialized once at module level
_client = anthropic.AsyncAnthropic(api_key=settings.ANTHROPIC_API_KEY)


async def call_claude(
    system_prompt: str,
    user_message: str,
    max_tokens: int = 4096,
) -> str:
    """Send a prompt to Claude and return the text response.

    Args:
        system_prompt: The system-level instruction (loaded from .md prompt file).
        user_message: The user-level message with CV/JD data injected.
        max_tokens: Maximum tokens in Claude's response.

    Returns:
        Raw text string from Claude's response.

    Raises:
        HTTPException: On authentication (401), rate limit (429), or API error (502).
    """
    try:
        response = await _client.messages.create(
            model=settings.CLAUDE_MODEL,
            max_tokens=max_tokens,
            system=system_prompt,
            messages=[{"role": "user", "content": user_message}],
        )
        return response.content[0].text

    except anthropic.AuthenticationError:
        raise HTTPException(
            status_code=401,
            detail="Invalid Anthropic API key. Check your .env file.",
        )
    except anthropic.RateLimitError:
        raise HTTPException(
            status_code=429,
            detail="Anthropic rate limit reached. Please wait and try again.",
        )
    except anthropic.APIError as e:
        # Log error type but NEVER the API key
        raise HTTPException(
            status_code=502,
            detail=f"Claude API error: {e.message}",
        )
