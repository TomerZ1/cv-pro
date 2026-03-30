# Prompt System — CV Pro

## How It Works

1. Prompt templates live as `.md` files in `backend/prompts/`.
2. `prompt_engine.py` loads the file, injects CV data and JD text into placeholders.
3. The assembled prompt is sent to Claude via `claude_client.py`.
4. Claude's raw text response is parsed by `response_parser.py` into structured JSON.

## Prompt Files

| File | Tool | Output Format |
|------|------|---------------|
| `projects.md` | Tool 1 — Project Bullet Rewriter | Markdown with `###` headings, Version A/B blocks |
| `skills.md` | Tool 2 — Skills Rewriter | Plain text `Category: item, item` lines + Recommendations |
| `profile.md` | Tool 3 — Profile Generator | Two bullet lists separated by `---` |
| `achievements.md` | Tool 4 — Achievement Transformer | Raw JSON with `transformations` array |
| `bullet_regen.md` | Bullet Regeneration | Single line of text |
| `ats.md` | Tool 5 — ATS Analyzer (Phase 2) | TBD |

## Rules Across All Prompts

- **No dashes/hyphens** — bullets use `•` not `-`.
- **Language matching** — Hebrew CV → Hebrew output, English CV → English output. Tool names stay English.
- **Bold density** — at least 2 terms per bullet with `**markdown bold**`.
- **Hot-editable** — prompts are volume-mounted in Docker, so changes take effect without rebuilding.

## Editing Prompts

Edit the `.md` file directly. The prompt engine re-reads from disk on every request (no caching). Changes are live immediately.
