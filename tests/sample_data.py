"""Sample CV data matching the AppState shape from src/types/cv.ts."""

from pathlib import Path

FIXTURES_DIR = Path(__file__).resolve().parent / "fixtures"


def _load_photo_b64() -> str:
    """Load the sample photo as a base64 data URL."""
    b64_file = FIXTURES_DIR / "sample_photo_b64.txt"
    if b64_file.exists():
        return b64_file.read_text().strip()
    return ""


SAMPLE_PHOTO_B64 = _load_photo_b64()

SAMPLE_PERSONAL = {
    "name": "Jane Smith",
    "title": "Senior Software Engineer",
    "photo": "",
    "email": "jane@example.com",
    "phone": "+41 79 000 00 00",
    "address": "Bahnhofstrasse 1",
    "zip": "8001",
    "city": "Zurich",
    "country": "Switzerland",
    "website": "https://jane.dev",
    "linkedin": "https://linkedin.com/in/janesmith",
    "github": "https://github.com/janesmith",
    "birthday": "1990-05-15",
    "nationality": "Swiss",
    "driversLicense": "B",
    "summary": (
        "Experienced software engineer with 10+ years in web development, "
        "specializing in React, TypeScript, and cloud infrastructure."
    ),
}

SAMPLE_EXPERIENCE = [
    {
        "id": "exp-1",
        "company": "Acme AG",
        "role": "Senior Software Engineer",
        "location": "Zurich, Switzerland",
        "startDate": "2020-01",
        "endDate": "",
        "current": True,
        "bullets": [
            "Led migration of monolithic application to microservices architecture",
            "Mentored team of 5 junior developers",
            "Reduced deployment time by 60% through CI/CD improvements",
        ],
    },
    {
        "id": "exp-2",
        "company": "Tech Corp",
        "role": "Software Engineer",
        "location": "Bern, Switzerland",
        "startDate": "2016-03",
        "endDate": "2019-12",
        "current": False,
        "bullets": [
            "Built real-time data pipeline processing 1M events/day",
            "Implemented automated testing reducing bug rate by 40%",
        ],
    },
]

SAMPLE_EDUCATION = [
    {
        "id": "edu-1",
        "institution": "ETH Zurich",
        "degree": "Master of Science",
        "field": "Computer Science",
        "startDate": "2012-09",
        "endDate": "2015-07",
        "grade": "5.6 / 6.0",
    }
]

SAMPLE_SKILLS = [
    {
        "id": "skill-1",
        "category": "Programming Languages",
        "items": ["TypeScript", "Python", "Go", "Rust"],
    },
    {
        "id": "skill-2",
        "category": "Frameworks",
        "items": ["React", "Node.js", "FastAPI", "Django"],
    },
]

SAMPLE_LANGUAGES = [
    {"id": "lang-1", "language": "German", "level": "Native"},
    {"id": "lang-2", "language": "English", "level": "C2"},
    {"id": "lang-3", "language": "French", "level": "B1"},
]

SAMPLE_PROJECTS = []

SAMPLE_CERTIFICATIONS = [
    {
        "id": "cert-1",
        "title": "AWS Solutions Architect",
        "institution": "Amazon Web Services",
        "date": "2023-06",
        "description": "Professional-level cloud architecture certification",
    },
]

SAMPLE_INTERESTS = ["Hiking", "Open Source", "Photography", "Chess"]


def build_full_cv(with_photo=False):
    """Return a complete CV dict matching the AppState.cv shape."""
    personal = dict(SAMPLE_PERSONAL)
    if with_photo:
        personal["photo"] = SAMPLE_PHOTO_B64
    return {
        "personal": personal,
        "experience": SAMPLE_EXPERIENCE,
        "education": SAMPLE_EDUCATION,
        "skills": SAMPLE_SKILLS,
        "languages": SAMPLE_LANGUAGES,
        "projects": SAMPLE_PROJECTS,
        "certifications": SAMPLE_CERTIFICATIONS,
        "interests": SAMPLE_INTERESTS,
    }


def build_app_state(template="modern", with_photo=False):
    """Return a full AppState dict ready for localStorage injection."""
    return {
        "cv": build_full_cv(with_photo=with_photo),
        "selectedTemplate": template,
        "lastSaved": None,
    }
