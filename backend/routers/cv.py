"""CV and JD parsing routes for CV Pro.

Defines shared Pydantic models for CV/JD data used across all routers,
and the /api/parse-jd endpoint for keyword extraction from job descriptions.
"""

import re

from fastapi import APIRouter
from pydantic import BaseModel


# --- Pydantic models (shared across routers) ---


class HeaderData(BaseModel):
    """CV header section — name, title, contact info."""

    name: str = ""
    title: str = ""
    contact: str = ""


class EducationData(BaseModel):
    """CV education section."""

    degree: str = ""
    university: str = ""
    gpa: str = ""
    courses: list[str] = []


class ProjectData(BaseModel):
    """A single project with its title and bullet points."""

    title: str
    bullets: list[str]


class SkillsData(BaseModel):
    """CV skills section — split into categories."""

    languages_frameworks: str = ""
    tools: str = ""


class MilitaryData(BaseModel):
    """CV military service section."""

    role: str = ""
    unit: str = ""
    years: str = ""


class CvData(BaseModel):
    """Complete structured CV data from the frontend input boxes."""

    header: HeaderData = HeaderData()
    education: EducationData = EducationData()
    projects: dict[str, ProjectData] = {}
    skills: SkillsData = SkillsData()
    military: MilitaryData = MilitaryData()
    languages: list[str] = []


class JdRequest(BaseModel):
    """Request body for job description parsing."""

    text: str


class JdData(BaseModel):
    """Parsed job description with raw text and extracted keywords."""

    raw_text: str
    keywords: list[str]


# --- Common English stopwords to filter from JD keywords ---

_STOPWORDS = {
    "a", "an", "the", "and", "or", "but", "in", "on", "at", "to", "for",
    "of", "with", "by", "from", "is", "are", "was", "were", "be", "been",
    "being", "have", "has", "had", "do", "does", "did", "will", "would",
    "could", "should", "may", "might", "shall", "can", "must", "need",
    "not", "no", "nor", "so", "if", "then", "than", "that", "this",
    "these", "those", "it", "its", "we", "you", "your", "our", "they",
    "their", "he", "she", "his", "her", "as", "up", "out", "about",
    "into", "over", "after", "before", "between", "under", "above",
    "such", "each", "every", "all", "any", "both", "few", "more",
    "most", "other", "some", "only", "own", "same", "very", "just",
    "also", "well", "how", "what", "when", "where", "which", "who",
    "why", "able", "across", "already", "among", "become", "etc",
}


# --- Router ---

router = APIRouter(prefix="/api", tags=["parsing"])


@router.post("/parse-jd", response_model=JdData)
async def parse_jd(request: JdRequest) -> JdData:
    """Parse a job description and extract keywords.

    Takes raw JD text, tokenizes it, filters stopwords, and returns
    deduplicated keywords alongside the original text.

    Args:
        request: JdRequest with the raw job description text.

    Returns:
        JdData with raw_text and extracted keywords list.
    """
    raw_text = request.text.strip()

    # Tokenize: split on non-alphanumeric chars, lowercase, filter short/stopwords
    words = re.findall(r"[a-zA-Z0-9#+.]+", raw_text.lower())
    keywords = []
    seen = set()

    for word in words:
        # Skip stopwords and very short tokens
        if word in _STOPWORDS or len(word) < 2:
            continue
        if word not in seen:
            seen.add(word)
            keywords.append(word)

    return JdData(raw_text=raw_text, keywords=keywords)
