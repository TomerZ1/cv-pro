# CV Pro

## What Is This
Personal CV tailoring tool for a CS student (Tel-Aviv University) applying to dev roles. Single user. No auth. No database.

## Tech Stack
- Frontend: React (Vite) + TailwindCSS
- Backend: Python 3.11+ (FastAPI, async)
- AI: Anthropic Python SDK → `claude-opus-4-20250514`
- PDF parsing: pdfplumber (read-only — no PDF generation)
- Deploy: Docker + docker-compose

## The 5 Tools
1. **Project Bullet Rewriter** — rewrites every project bullet with 2-3 angle variations. MAIN TOOL.
2. **Skills Rewriter** — reorganizes Skills & Tools section for the JD.
3. **Profile Generator** — creates Profile/Summary section. Two versions.
4. **Achievement Transformer** — cross-section analysis, finds achievement opportunities across entire CV.
5. **ATS Analyzer** — Phase 2. Deep scoring. Separate page.

## CV Structure
Static: Header, Education, Military Service, Languages — pass through, don't touch.
Generated: Profile (Tool 3), Projects (Tool 1), Skills & Tools (Tool 2).
No work experience section — this is a student CV. Projects carry all the weight.

## Architecture Rules
- API key in backend `.env` ONLY. Never frontend, never logged, never hardcoded.
- ALL Claude calls go through `services/claude_client.py`. Nowhere else.
- Prompts are `.md` files in `backend/prompts/`. Docker-volume-mounted. Hot-editable.
- No database. State lives in React useReducer.
- No PDF export. User copies text to Canva. Every bullet/section needs a 📋 copy button.
- Copied text = plain text, `**bold**` markers stripped, bullets prefixed with `• `.

## Code Style

### Python
- Async endpoints. Pydantic models for all request/response schemas.
- Routers in `routers/`, logic in `services/`.
- Module docstring on every file. Docstring on every function (what, args, returns, raises).
- Inline comments on non-obvious logic explaining WHY.

### React
- Functional components + hooks only. JSDoc comment on every component (purpose, props).
- TailwindCSS only. `fetch` only. useState/useReducer only.
- Inline comments on complex state logic and effects.

### Both
- Comments are mandatory. Every file, every function, every component. No exceptions.
- Prefer early returns. Keep functions short. Name things clearly.

## NEVER Do These
- NEVER use LangChain, LlamaIndex, or any AI framework. Direct Anthropic SDK only.
- NEVER use axios, Redux, Zustand, styled-components, CSS modules, or Next.js.
- NEVER add a database, ORM, or auth library.
- NEVER use `any` type in TypeScript/JSDoc. Be explicit.
- NEVER leave a function without a docstring or a component without JSDoc.
- NEVER send the API key to the frontend or log it.
- NEVER generate or export PDFs. User copies text to Canva.
- NEVER invent features not in PROJECT_SPEC.md. Ask first.
- NEVER skip error handling. Catch Claude API errors gracefully, return useful messages.

## File Map
- `PROJECT_SPEC.md` — Full build spec, architecture, API design, implementation order. Read in plan mode.
- `MEMORY.md` — Lessons learned, decisions made, bugs hit. Claude Code updates this file.
- `docs/ARCHITECTURE.md` — System flow diagrams and request flows.
- `docs/PROMPTS.md` — How the prompt loading system works mechanically.
- `docs/API.md` — Backend endpoint reference with request/response shapes.

## How to Run
```bash
cp .env.example .env   # Set ANTHROPIC_API_KEY
docker-compose up --build
# Frontend: localhost:3000 | Backend: localhost:8000 | Docs: localhost:8000/docs
```
