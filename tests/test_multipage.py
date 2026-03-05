"""Tests for multi-page CV layout with extensive content.

Each template is tested with a large amount of CV data that exceeds a single
A4 page, to verify that content overflows correctly and looks reasonable.
"""

import json
from pathlib import Path

import pytest
from playwright.sync_api import Browser

BASE_URL = "http://localhost:5173"
SCREENSHOTS_DIR = Path(__file__).resolve().parent / "__screenshots__"

TEMPLATES = ["classic", "modern", "minimal", "executive", "professional", "creative"]


def _extensive_cv() -> dict:
    """Return a CV with enough content to overflow a single A4 page."""
    return {
        "personal": {
            "name": "Maximilian von Mustermann",
            "title": "Principal Software Architect & Engineering Manager",
            "photo": "",
            "email": "maximilian.mustermann@example.com",
            "phone": "+41 79 123 45 67",
            "address": "Bahnhofstrasse 42",
            "zip": "8001",
            "city": "Zürich",
            "country": "Switzerland",
            "website": "https://maximilian.dev",
            "linkedin": "https://linkedin.com/in/maxmustermann",
            "github": "https://github.com/maxmustermann",
            "birthday": "1985-03-12",
            "nationality": "Swiss / German",
            "driversLicense": "B",
            "summary": (
                "Accomplished software architect and engineering leader with over "
                "15 years of experience designing and delivering large-scale distributed "
                "systems. Proven track record in leading cross-functional teams of 20+ "
                "engineers across multiple time zones. Deep expertise in cloud-native "
                "architectures, microservices, event-driven systems, and DevOps practices. "
                "Passionate about mentoring engineers, fostering inclusive engineering "
                "cultures, and driving technical excellence through pragmatic solutions. "
                "Experienced in financial services, healthcare, and e-commerce domains."
            ),
        },
        "experience": [
            {
                "id": "exp-1",
                "company": "Swiss Finance Corp AG",
                "role": "Principal Software Architect",
                "location": "Zürich, Switzerland",
                "startDate": "2021-01",
                "endDate": "",
                "current": True,
                "bullets": [
                    "Designed and implemented a new event-driven architecture processing 50M+ transactions daily with sub-100ms latency",
                    "Led a team of 22 engineers across 3 squads, driving adoption of domain-driven design and CQRS patterns",
                    "Reduced infrastructure costs by 40% through migration from on-premise to hybrid cloud (AWS + on-prem)",
                    "Established architecture decision records (ADRs) process adopted company-wide across 8 engineering teams",
                    "Spearheaded introduction of chaos engineering practices, improving system resilience by 60%",
                ],
            },
            {
                "id": "exp-2",
                "company": "HealthTech Solutions GmbH",
                "role": "Senior Engineering Manager",
                "location": "Basel, Switzerland",
                "startDate": "2018-03",
                "endDate": "2020-12",
                "current": False,
                "bullets": [
                    "Managed 3 engineering teams (15 engineers total) building a HIPAA-compliant healthcare platform",
                    "Delivered patient data management system serving 2M+ patients across 50 hospitals",
                    "Implemented CI/CD pipeline reducing release cycles from monthly to daily deployments",
                    "Drove adoption of TypeScript and React, migrating 200k+ lines of legacy jQuery code",
                ],
            },
            {
                "id": "exp-3",
                "company": "E-Commerce International AG",
                "role": "Senior Software Engineer",
                "location": "Bern, Switzerland",
                "startDate": "2014-06",
                "endDate": "2018-02",
                "current": False,
                "bullets": [
                    "Built real-time recommendation engine serving 10M+ product suggestions per day",
                    "Designed microservices architecture handling 500k concurrent users during peak sales",
                    "Implemented A/B testing framework used across all product teams",
                    "Mentored 8 junior developers through structured pair programming program",
                ],
            },
            {
                "id": "exp-4",
                "company": "StartupHub Zürich",
                "role": "Full Stack Developer",
                "location": "Zürich, Switzerland",
                "startDate": "2011-01",
                "endDate": "2014-05",
                "current": False,
                "bullets": [
                    "Co-founded and built MVP for a SaaS project management tool reaching 10k users",
                    "Developed RESTful APIs using Node.js and Python serving mobile and web clients",
                    "Managed PostgreSQL databases with complex reporting queries across multi-tenant architecture",
                ],
            },
            {
                "id": "exp-5",
                "company": "Digital Agency Berlin",
                "role": "Junior Developer",
                "location": "Berlin, Germany",
                "startDate": "2008-09",
                "endDate": "2010-12",
                "current": False,
                "bullets": [
                    "Developed responsive web applications for clients in media and publishing industries",
                    "Built custom CMS solutions using PHP and MySQL for 20+ client websites",
                ],
            },
        ],
        "education": [
            {
                "id": "edu-1",
                "institution": "ETH Zürich",
                "degree": "Master of Science",
                "field": "Computer Science — Distributed Systems",
                "startDate": "2006-09",
                "endDate": "2008-07",
                "grade": "5.7 / 6.0",
            },
            {
                "id": "edu-2",
                "institution": "Technische Universität München",
                "degree": "Bachelor of Science",
                "field": "Computer Science",
                "startDate": "2003-10",
                "endDate": "2006-07",
                "grade": "1.3 (German scale)",
            },
            {
                "id": "edu-3",
                "institution": "Gymnasium Schaffhausen",
                "degree": "Matura",
                "field": "Mathematics and Natural Sciences",
                "startDate": "1997-08",
                "endDate": "2003-06",
                "grade": "",
            },
        ],
        "skills": [
            {
                "id": "skill-1",
                "category": "Programming Languages",
                "items": ["TypeScript", "Python", "Go", "Rust", "Java", "Kotlin", "C#"],
            },
            {
                "id": "skill-2",
                "category": "Frameworks & Libraries",
                "items": ["React", "Next.js", "Node.js", "FastAPI", "Spring Boot", "Django"],
            },
            {
                "id": "skill-3",
                "category": "Cloud & Infrastructure",
                "items": ["AWS", "Azure", "Kubernetes", "Docker", "Terraform", "Ansible"],
            },
            {
                "id": "skill-4",
                "category": "Data & Messaging",
                "items": ["PostgreSQL", "MongoDB", "Redis", "Kafka", "RabbitMQ", "Elasticsearch"],
            },
        ],
        "languages": [
            {"id": "lang-1", "language": "German", "level": "Native"},
            {"id": "lang-2", "language": "English", "level": "C2 (Proficient)"},
            {"id": "lang-3", "language": "French", "level": "B2 (Upper Intermediate)"},
            {"id": "lang-4", "language": "Italian", "level": "A2 (Elementary)"},
        ],
        "projects": [
            {
                "id": "proj-1",
                "title": "Open Source Event Sourcing Library",
                "description": "Created and maintain a popular event sourcing library for Go with 2k+ GitHub stars",
                "url": "https://github.com/maxmustermann/eventsource-go",
            },
            {
                "id": "proj-2",
                "title": "Swiss Tech Meetup Organizer",
                "description": "Co-organize monthly Zürich Software Architecture meetup with 500+ members",
                "url": "",
            },
        ],
        "certifications": [
            {
                "id": "cert-1",
                "title": "AWS Solutions Architect Professional",
                "institution": "Amazon Web Services",
                "date": "2023-06",
                "description": "Advanced cloud architecture design and implementation",
            },
            {
                "id": "cert-2",
                "title": "Certified Kubernetes Administrator (CKA)",
                "institution": "Cloud Native Computing Foundation",
                "date": "2022-03",
                "description": "Kubernetes cluster administration and operations",
            },
            {
                "id": "cert-3",
                "title": "Professional Scrum Master I",
                "institution": "Scrum.org",
                "date": "2019-11",
                "description": "Agile project management and scrum methodology",
            },
        ],
        "interests": [
            "Alpine Hiking",
            "Open Source Contributing",
            "Photography",
            "Chess",
            "Skiing",
            "Reading (Science Fiction)",
        ],
    }


def _extensive_app_state(template: str) -> dict:
    """Return an AppState with extensive CV data for overflow testing."""
    return {
        "cv": _extensive_cv(),
        "selectedTemplate": template,
        "lastSaved": None,
    }


@pytest.mark.parametrize("template", TEMPLATES)
def test_multipage_content_overflows(browser: Browser, template: str):
    """Template with extensive content should overflow beyond single A4 height."""
    context = browser.new_context(
        viewport={"width": 794, "height": 1123},
        device_scale_factor=2,
    )
    page = context.new_page()

    state = _extensive_app_state(template)
    page.goto(BASE_URL)
    page.evaluate(
        "state => localStorage.setItem('getmycv_state', JSON.stringify(state))",
        state,
    )
    page.evaluate("() => localStorage.setItem('getmycv_banner_dismissed', 'true')")
    page.reload()
    page.wait_for_selector(".preview-paper", timeout=5000)

    # The paper should have content taller than a single A4 page (297mm ≈ 1123px at 96dpi)
    paper = page.locator(".preview-paper")
    box = paper.bounding_box()
    assert box is not None, f"Could not get bounding box for {template}"
    # At 2x device scale the bounding box is still in CSS pixels
    assert box["height"] > 1123, (
        f"{template}: paper height {box['height']:.0f}px should exceed single A4 (1123px)"
    )

    # Hide app chrome for clean screenshot
    page.evaluate("""() => {
        document.querySelectorAll('.app-header, .app-sidebar, .template-picker, .export-bar')
          .forEach(el => el.style.display = 'none');
        const main = document.querySelector('.app-main');
        if (main) { main.style.padding = '0'; main.style.overflow = 'visible'; }
        const paper = document.querySelector('.preview-paper');
        if (paper) { paper.style.width = '100%'; paper.style.overflow = 'visible';
          paper.style.boxShadow = 'none'; paper.style.borderRadius = '0'; paper.style.margin = '0'; }
    }""")

    paper.screenshot(path=str(SCREENSHOTS_DIR / f"{template}_multipage.png"))

    context.close()


@pytest.mark.parametrize("template", TEMPLATES)
def test_multipage_all_sections_visible(browser: Browser, template: str):
    """All sections should be visible (not clipped) in multi-page mode."""
    context = browser.new_context(
        viewport={"width": 794, "height": 1123},
        device_scale_factor=2,
    )
    page = context.new_page()

    state = _extensive_app_state(template)
    page.goto(BASE_URL)
    page.evaluate(
        "state => localStorage.setItem('getmycv_state', JSON.stringify(state))",
        state,
    )
    page.evaluate("() => localStorage.setItem('getmycv_banner_dismissed', 'true')")
    page.reload()
    page.wait_for_selector(".preview-paper", timeout=5000)

    paper_text = page.locator(".preview-paper").inner_text().lower()

    # Verify key content from each section is visible
    assert "maximilian" in paper_text, f"{template}: name not visible"
    assert "swiss finance corp" in paper_text, f"{template}: latest experience not visible"
    assert "digital agency berlin" in paper_text, f"{template}: oldest experience not visible"
    assert "eth" in paper_text, f"{template}: education not visible"
    assert "typescript" in paper_text, f"{template}: skills not visible"
    assert "german" in paper_text, f"{template}: languages not visible"
    assert "aws solutions architect" in paper_text, f"{template}: certifications not visible"
    assert "hiking" in paper_text or "alpine" in paper_text, f"{template}: interests not visible"

    context.close()
