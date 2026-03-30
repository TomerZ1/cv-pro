# Architecture — CV Pro

## System Overview

CV Pro is a single-user CV tailoring tool. The frontend collects a CV (PDF or pasted text) and a job description, sends them to the backend, which uses Claude to generate tailored CV sections.

## Request Flow

```
User uploads CV + pastes JD
        │
        ▼
React Frontend (port 3000)
        │ REST (fetch)
        ▼
FastAPI Backend (port 8000)
        │
        ├─► parser.py          — PDF/text → structured CV sections
        ├─► prompt_engine.py   — loads .md prompt + injects CV/JD data
        ├─► claude_client.py   — sends prompt to Anthropic SDK
        └─► response_parser.py — Claude's raw text → structured JSON
        │
        ▼
JSON response → frontend renders variations with copy buttons
```

## Key Design Decisions

- **No database** — state lives in React useReducer. Single user, no persistence needed.
- **No PDF export** — user copies text to Canva via clipboard.
- **Prompts are .md files** — stored in `backend/prompts/`, Docker-volume-mounted so they can be hot-edited without rebuilding.
- **All Claude calls go through `claude_client.py`** — single point of control for API key, model, error handling.
- **No AI frameworks** — direct Anthropic SDK only.

## Component Diagram

```
frontend/
  InputPanel       — CV upload/paste + JD textarea
  ProjectCard      — one project with its bullet variations
  BulletVariations — angle picker per bullet
  BulletItem       — single bullet with copy button
  SkillsEditor     — skills categories display
  ProfileEditor    — two profile versions
  AchievementList  — cross-section suggestions
  CopyButton       — reusable clipboard button

backend/
  routers/cv.py         — /api/parse-cv, /api/parse-jd
  routers/tools.py      — /api/tools/projects, skills, profile, achievements
  routers/regenerate.py  — /api/regenerate-bullet
  routers/ats.py         — /api/ats/analyze (Phase 2)
  services/parser.py         — PDF and text parsing
  services/claude_client.py  — Anthropic SDK wrapper
  services/prompt_engine.py  — prompt file loading and variable injection
  services/response_parser.py — raw Claude output → JSON
```
