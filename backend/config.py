"""Configuration module for CV Pro backend.

Loads environment variables from .env file using pydantic-settings.
All settings are centralized here — import `settings` from this module.
"""

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Application settings loaded from environment variables.

    Attributes:
        ANTHROPIC_API_KEY: Secret key for Anthropic API. Never log this.
        CLAUDE_MODEL: Which Claude model to use for all AI calls.
        BACKEND_HOST: Host address for the FastAPI server.
        BACKEND_PORT: Port number for the FastAPI server.
    """

    ANTHROPIC_API_KEY: str
    CLAUDE_MODEL: str = "claude-opus-4-20250514"
    BACKEND_HOST: str = "0.0.0.0"
    BACKEND_PORT: int = 8000

    # Load from .env file in the backend directory
    model_config = SettingsConfigDict(env_file=".env")


# Module-level singleton — import this everywhere
settings = Settings()
