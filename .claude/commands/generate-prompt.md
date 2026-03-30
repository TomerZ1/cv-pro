Create a new prompt file for $ARGUMENTS.

1. Read the existing prompts in `backend/prompts/` to understand the format and conventions.
2. Read `docs/PROMPTS.md` for the prompt system rules.
3. Create a new `.md` file in `backend/prompts/` following the same patterns:
   - No dashes/hyphens in output bullets
   - Language matching (Hebrew CV → Hebrew output)
   - Bold at least 2 terms per bullet
4. Update `docs/PROMPTS.md` to include the new prompt.
