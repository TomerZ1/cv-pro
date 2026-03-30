# PROJECT_SPEC.md — CV Pro Full Build Specification

> In Claude Code: "Read PROJECT_SPEC.md. Enter plan mode. Build plan for Tool 1."

---

## Step 0 — Project Scaffolding (Do This First)

The project currently has all files in the root. Before building anything, reorganize into the correct structure:

1. Create the directory tree:
   ```
   mkdir -p backend/prompts backend/routers backend/services backend/templates backend/tests
   mkdir -p frontend/src/api frontend/src/hooks frontend/src/components frontend/src/pages frontend/src/styles
   mkdir -p docs .claude/commands
   ```

2. Move prompt files to their correct location:
   ```
   mv projects.md backend/prompts/
   mv skills.md backend/prompts/
   mv profile.md backend/prompts/
   mv achievements.md backend/prompts/
   mv bullet_regen.md backend/prompts/
   ```

3. Create missing files:
   - `.env.example` with: ANTHROPIC_API_KEY, CLAUDE_MODEL=claude-opus-4-20250514, BACKEND_HOST, BACKEND_PORT, VITE_API_BASE_URL
   - `.gitignore` with: .env, __pycache__/, node_modules/, frontend/dist/, .vscode/, .DS_Store, uploads/
   - `backend/prompts/ats.md` with a Phase 2 placeholder
   - `docs/ARCHITECTURE.md`, `docs/PROMPTS.md`, `docs/API.md` — generate from the information in this spec
   - `.claude/commands/generate-prompt.md` — slash command to create a new prompt file
   - `.claude/commands/test-section.md` — slash command to test a section end-to-end
   - `.claude/commands/research-ats.md` — slash command to research ATS scoring

4. After reorganization, the tree should look like:
   ```
   cv-pro/
   ├── CLAUDE.md
   ├── MEMORY.md
   ├── PROJECT_SPEC.md
   ├── .env.example
   ├── .gitignore
   ├── docker-compose.yml
   ├── backend/
   │   ├── Dockerfile
   │   ├── requirements.txt
   │   ├── main.py
   │   ├── config.py
   │   ├── routers/
   │   ├── services/
   │   ├── prompts/
   │   │   ├── projects.md
   │   │   ├── skills.md
   │   │   ├── profile.md
   │   │   ├── achievements.md
   │   │   ├── bullet_regen.md
   │   │   └── ats.md
   │   ├── templates/
   │   └── tests/
   ├── frontend/
   │   ├── Dockerfile
   │   ├── package.json
   │   ├── vite.config.js
   │   ├── src/
   │   │   ├── App.jsx
   │   │   ├── main.jsx
   │   │   ├── api/
   │   │   ├── hooks/
   │   │   ├── components/
   │   │   ├── pages/
   │   │   └── styles/
   │   └── index.html
   ├── docs/
   │   ├── ARCHITECTURE.md
   │   ├── PROMPTS.md
   │   └── API.md
   └── .claude/
       └── commands/
           ├── generate-prompt.md
           ├── test-section.md
           └── research-ats.md
   ```

After Step 0 is done, commit: `git add . && git commit -m "Scaffold project structure"`

---

## Architecture

```
┌─────────────────────────────────────────┐
│            React Frontend               │
│  (Vite + TailwindCSS, port 3000)       │
│                                         │
│  ┌──────────────┐  ┌────────────────┐  │
│  │ Input Panel   │  │ Tool Tabs      │  │
│  │ Upload PDF    │  │ 1. Projects    │  │
│  │  or paste     │  │ 2. Skills      │  │
│  │ Paste JD      │  │ 3. Profile     │  │
│  └──────────────┘  │ 4. Achievements │  │
│                     └────────────────┘  │
│  📋 Copy buttons on every bullet/section│
└──────────────────┬──────────────────────┘
                   │ REST
┌──────────────────▼──────────────────────┐
│        FastAPI Backend (port 8000)      │
│                                         │
│  /api/parse-cv         PDF/text → data  │
│  /api/parse-jd         text → parsed    │
│  /api/tools/projects   Tool 1           │
│  /api/tools/skills     Tool 2           │
│  /api/tools/profile    Tool 3           │
│  /api/tools/achievements Tool 4         │
│  /api/regenerate-bullet                 │
│  /api/ats/analyze      Tool 5 (Phase 2)│
│                                         │
│  Prompt Engine → Claude Client (SDK)    │
└─────────────────────────────────────────┘
```

---

## CV Sections

**Static** (pass through, not generated):
- Header: "Tomer Zalberg / Student Software Developer / Tel-Aviv University" + contact
- Education: B.Sc. CS, TAU, 2023-2027, GPA 83.5, key courses
- Military Service: Station Manager, Meitav Unit, 2020-2022
- Languages: English (Native), Hebrew (Fluent), Russian (Fluent)

**AI-Generated**:
- Profile → Tool 3 (4-5 bullets, two version angles)
- Projects → Tool 1 (rewrite bullets per project, 2-3 angle variations each)
  - ThinkRoom | Full Stack
  - SymNMF Clustering | Tel-Aviv University
  - Operating Systems Course Projects | Tel-Aviv University
- Skills & Tools → Tool 2 (reorganize categories for JD)

---

## Tool 1 — Project Bullet Rewriter

**Core behavior**: For each bullet in each project, generate 2-3 variations:
- **Tech angle**: bold technologies and tools
- **Impact angle**: emphasize what was achieved/delivered
- **Problem angle**: emphasize what challenge was solved

**User flow**:
1. CV parsed + JD pasted → click "Rewrite Projects"
2. Each project: original bullets on left, variations on right
3. Per bullet: pick a variation or 🔄 regenerate
4. 📋 copy individual bullets, per-project, or all projects

**API**: `POST /api/tools/projects`
```json
{
    "cv_data": { "projects": { "thinkroom": { "title": "...", "bullets": [...] }, ... } },
    "jd_data": { "raw_text": "...", "keywords": [...] }
}
→
{
    "projects": {
        "thinkroom": {
            "title": "ThinkRoom | Full Stack",
            "bullets": [{
                "original": "Built a real time tutoring platform...",
                "variations": [
                    { "angle": "tech", "text": "..." },
                    { "angle": "impact", "text": "..." },
                    { "angle": "problem", "text": "..." }
                ]
            }]
        }
    }
}
```

**Prompt**: `backend/prompts/projects.md` (user-provided)

**Bullet regen**: `POST /api/regenerate-bullet`
```json
{
    "section": "projects", "project": "thinkroom", "bullet_index": 2,
    "current_bullet": "...", "other_bullets": ["...", "..."],
    "angle": "tech", "cv_data": {}, "jd_data": {}
}
→ { "new_bullet": "..." }
```

---

## Tool 2 — Skills Section Rewriter

Reorganizes skill categories to match JD. May create new groupings.

**API**: `POST /api/tools/skills`
```json
→ {
    "original": { "languages_frameworks": "...", ... },
    "rewritten": {
        "categories": [
            { "name": "Backend & Infrastructure", "items": ["Python", "FastAPI", ...] },
            ...
        ]
    }
}
```

**Prompt**: `backend/prompts/skills.md` (user-provided)

---

## Tool 3 — Profile/Summary Generator

Creates Profile section. Two versions with different angles.

**API**: `POST /api/tools/profile`
```json
→ {
    "version_1": { "label": "Experience-Led", "bullets": [...] },
    "version_2": { "label": "Highlight Reel", "bullets": [...] }
}
```

**Prompt**: `backend/prompts/profile.md` (user-provided, already written)

---

## Tool 4 — Achievement Transformer

Cross-section. Reads entire CV + JD. Returns suggestions with locations.

**API**: `POST /api/tools/achievements`
```json
→ {
    "suggestions": [{
        "section": "projects", "project": "thinkroom", "bullet_index": 2,
        "original": "...", "suggested": "...", "reasoning": "..."
    }]
}
```

**Prompt**: `backend/prompts/achievements.md` (user-provided, already written)

---

## Tool 5 — ATS Analyzer (Phase 2)

Separate page. Built after Tools 1-4 are solid. Will be spec'd separately.

---

## Prompt Output Formats — What response_parser.py Must Handle

Each prompt produces a DIFFERENT output format. The response parser must handle each one.

### Tool 1 (projects.md) → Markdown with headings
```
### ThinkRoom | Full Stack
Version A — Tasks & Process:
- Built a **real-time** tutoring platform using **React** and **Python** for CS education.
- ...
Version B — Impact & Outcomes:
- Delivered **real-time collaboration** enabling live CS tutoring sessions for students.
- ...
---
### SymNMF Clustering | Tel-Aviv University
...
---
### Suggestions for improvement
- [suggestion]
```
Parser must: split by `###` headers, then split Version A / Version B, extract bullets, and extract the Suggestions section separately.

### Tool 2 (skills.md) → Plain categorized text
```
Languages & Frameworks: Python, TypeScript, C, Java, FastAPI, React
AI & Data Science: LLM, AI Agents, NumPy, scikit-learn
Tools: Office 365, PowerPoint, Word, Excel, Google Tools, Gemini, ChatGPT, Claude

Recommendations for the Resume:
- Docker
- Kubernetes
```
Parser must: split into category lines and a separate recommendations block.

### Tool 3 (profile.md) → Two versions separated by `---`
```
• **Computer Science** student with **2 years** building full stack web platforms.
• Academic excellence with **90+** in ML, C, and **Object Oriented** Programming.
• ...
---
• **Student Developer** with **2 years** in web development, delivering through **React** and **Python**.
• ...
```
Parser must: split on `---`, extract bullets from each version.

### Tool 4 (achievements.md) → JSON
Returns raw JSON (no markdown fencing). Parser must: JSON.parse the response, validate the structure has `transformations` array with required fields.

### Bullet Regen (bullet_regen.md) → Single line of text
Returns just one bullet. No parsing needed beyond trimming whitespace.

---

## Project Structure

```
cv-pro/
├── CLAUDE.md                    # Rules + vibe (auto-read, <200 lines)
├── MEMORY.md                    # Lessons + decisions (Claude Code updates)
├── PROJECT_SPEC.md              # This file (plan mode)
├── docker-compose.yml
├── .env.example
├── .env                         # Gitignored
├── backend/
│   ├── Dockerfile
│   ├── requirements.txt
│   ├── main.py                  # FastAPI entry + CORS
│   ├── config.py                # Settings
│   ├── routers/
│   │   ├── __init__.py
│   │   ├── cv.py                # parse-cv, parse-jd
│   │   ├── tools.py             # tools/projects, tools/skills, etc.
│   │   ├── regenerate.py        # regenerate-bullet
│   │   └── ats.py               # Phase 2
│   ├── services/
│   │   ├── __init__.py
│   │   ├── parser.py            # PDF → text → sections
│   │   ├── claude_client.py     # Anthropic SDK wrapper
│   │   ├── prompt_engine.py     # Load .md, build user prompts
│   │   └── response_parser.py   # Claude text → structured JSON
│   ├── prompts/                 # USER-PROVIDED prompt files
│   │   ├── projects.md
│   │   ├── skills.md
│   │   ├── profile.md
│   │   ├── achievements.md
│   │   ├── bullet_regen.md
│   │   └── ats.md               # Phase 2
│   └── tests/
│       └── test_parser.py
├── frontend/
│   ├── Dockerfile
│   ├── package.json
│   ├── vite.config.js
│   ├── src/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   ├── api/
│   │   │   └── client.js        # fetch wrapper
│   │   ├── hooks/
│   │   │   └── useCopyToClipboard.js
│   │   ├── components/
│   │   │   ├── InputPanel.jsx
│   │   │   ├── CopyButton.jsx
│   │   │   ├── ProjectCard.jsx
│   │   │   ├── BulletVariations.jsx
│   │   │   ├── BulletItem.jsx
│   │   │   ├── SkillsEditor.jsx
│   │   │   ├── ProfileEditor.jsx
│   │   │   └── AchievementList.jsx
│   │   ├── pages/
│   │   │   ├── TailorPage.jsx
│   │   │   └── ATSPage.jsx     # Phase 2
│   │   └── styles/
│   │       └── globals.css
│   └── index.html
├── docs/
│   ├── ARCHITECTURE.md
│   ├── PROMPTS.md
│   └── API.md
└── .claude/
    └── commands/
        ├── generate-prompt.md
        ├── test-section.md
        └── research-ats.md
```

---

## Implementation Order

### Phase 1A — Foundation
1. Backend skeleton: FastAPI, Dockerfile, health check, CORS
2. CV parser: PDF upload + text paste → section splitting
3. JD parser: text → keyword extraction
4. Prompt engine: load `.md`, build user prompts
5. Claude client: Anthropic SDK wrapper
6. Response parser: raw text → structured JSON

### Phase 1B — Tool 1 (Projects)
7. Projects endpoint
8. Bullet regen endpoint
9. Frontend skeleton: React + Vite + Tailwind
10. Input panel: CV upload/paste + JD
11. ProjectCard + BulletVariations components
12. CopyButton + useCopyToClipboard hook
13. Per-bullet regen UI

### Phase 1C — Tools 2, 3, 4
14. Skills endpoint + SkillsEditor
15. Profile endpoint + ProfileEditor
16. Achievements endpoint + AchievementList

### Phase 1D — Polish
17. Docker compose
18. Error handling + loading states
19. Test with real JDs

### Phase 2 — ATS
20. Separate spec + research

---

## Env Vars

```env
ANTHROPIC_API_KEY=sk-ant-...
CLAUDE_MODEL=claude-opus-4-20250514
BACKEND_HOST=0.0.0.0
BACKEND_PORT=8000
VITE_API_BASE_URL=http://localhost:8000
```
