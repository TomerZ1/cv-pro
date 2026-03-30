# API Reference — CV Pro

Base URL: `http://localhost:8000`

---

## CV Parsing

### `POST /api/parse-cv`

Parse a CV from PDF upload or pasted text into structured sections.

**Request**: `multipart/form-data` with `file` (PDF) OR `application/json` with `{ "text": "..." }`

**Response**:
```json
{
  "header": { "name": "...", "title": "...", "contact": "..." },
  "education": { "degree": "...", "university": "...", "gpa": "...", "courses": [...] },
  "projects": {
    "thinkroom": { "title": "ThinkRoom | Full Stack", "bullets": ["..."] },
    "symnmf": { "title": "SymNMF Clustering | Tel-Aviv University", "bullets": ["..."] },
    "os": { "title": "Operating Systems Course Projects | Tel-Aviv University", "bullets": ["..."] }
  },
  "skills": { "languages_frameworks": "...", "tools": "..." },
  "military": { "role": "...", "unit": "...", "years": "..." },
  "languages": ["English (Native)", "Hebrew (Fluent)", "Russian (Fluent)"]
}
```

### `POST /api/parse-jd`

Parse a job description into structured data.

**Request**: `{ "text": "..." }`

**Response**: `{ "raw_text": "...", "keywords": ["..."] }`

---

## Tools

### `POST /api/tools/projects` — Tool 1

Rewrite project bullets with 2-3 angle variations.

**Request**: `{ "cv_data": { "projects": {...} }, "jd_data": { "raw_text": "...", "keywords": [...] } }`

**Response**:
```json
{
  "projects": {
    "thinkroom": {
      "title": "ThinkRoom | Full Stack",
      "bullets": [{
        "original": "...",
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

### `POST /api/tools/skills` — Tool 2

Reorganize skills section for the JD.

**Request**: `{ "cv_data": { "skills": {...} }, "jd_data": { "raw_text": "...", "keywords": [...] } }`

**Response**:
```json
{
  "original": { "languages_frameworks": "...", ... },
  "rewritten": {
    "categories": [
      { "name": "Backend & Infrastructure", "items": ["Python", "FastAPI", ...] }
    ]
  }
}
```

### `POST /api/tools/profile` — Tool 3

Generate profile/summary section with two versions.

**Request**: `{ "cv_data": {...}, "jd_data": { "raw_text": "...", "keywords": [...] } }`

**Response**:
```json
{
  "version_1": { "label": "Experience-Led", "bullets": ["..."] },
  "version_2": { "label": "Highlight Reel", "bullets": ["..."] }
}
```

### `POST /api/tools/achievements` — Tool 4

Cross-section achievement analysis.

**Request**: `{ "cv_data": {...}, "jd_data": { "raw_text": "...", "keywords": [...] } }`

**Response**:
```json
{
  "suggestions": [{
    "section": "projects",
    "project": "thinkroom",
    "bullet_index": 2,
    "original": "...",
    "suggested": "...",
    "reasoning": "..."
  }]
}
```

---

## Bullet Regeneration

### `POST /api/regenerate-bullet`

Regenerate a single bullet with a specific angle.

**Request**:
```json
{
  "section": "projects",
  "project": "thinkroom",
  "bullet_index": 2,
  "current_bullet": "...",
  "other_bullets": ["...", "..."],
  "angle": "tech",
  "cv_data": {},
  "jd_data": {}
}
```

**Response**: `{ "new_bullet": "..." }`

---

## ATS (Phase 2)

### `POST /api/ats/analyze`

Deep ATS scoring. Spec TBD.
