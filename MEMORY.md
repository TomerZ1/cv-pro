# Memory — CV Pro

> **Instructions for Claude Code**: Update this file whenever you:
> - Make an architectural decision and WHY (e.g., "Used X instead of Y because...")
> - Hit a bug and fix it (e.g., "pdfplumber failed on scanned PDFs → added fallback")
> - Learn a preference from the user (e.g., "User prefers X over Y")
> - Discover something about the Claude API response format that needs handling
> - Find that a prompt produces bad output and needs adjusting
>
> Keep entries short. Date them. Most recent at top.
> This file persists across sessions — it's how you remember what happened before.

---

## Decisions

(none yet — Claude Code will add entries here as the project progresses)

## Bugs & Fixes

(none yet)

## User Preferences

- User copies generated text into Canva — no PDF export needed
- User already has prompt files written — don't generate new prompts unless asked
- User wants every file heavily commented so they can learn from the code
- User prefers Python backend, not Node
- User wants the strongest model (Opus 4.6) — doesn't care about token costs
- User's CV has no work experience section — projects are the main focus

## Prompt Learnings

- Tool 1 (projects.md): Outputs markdown with ### headings and Version A/B blocks. Parser needs to handle this structured markdown format.
- Tool 2 (skills.md): Outputs plain text lines with category: items format. Has a fixed "Tools:" line that's always added. Recommendations section is separate and always in English.
- Tool 3 (profile.md): Outputs two versions separated by `---`. Strict word count rules (10-12 words per bullet). Both versions must have equal bold density.
- Tool 4 (achievements.md): Outputs raw JSON. Has coach_question and coach_field_label fields — the UI needs input fields where the user can type answers to coaching questions.
- All prompts: NEVER use dashes/hyphens anywhere. This is a consistent rule across all tools.
- All prompts: Language matching — Hebrew CV → Hebrew output, English CV → English output. Tool names always stay in English.
- All prompts: Bold at least 2 terms per bullet with **markdown bold**.
