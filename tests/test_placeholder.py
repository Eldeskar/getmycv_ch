"""Tests for placeholder/example CV data in empty state."""

import json
from pathlib import Path

import pytest
from playwright.sync_api import Browser

BASE_URL = "http://localhost:5173"
SCREENSHOTS_DIR = Path(__file__).resolve().parent / "__screenshots__"

TEMPLATES = ["classic", "modern", "minimal", "executive", "professional", "creative"]


def _empty_app_state(template: str) -> dict:
    """Return an AppState with completely empty CV data."""
    return {
        "cv": {
            "personal": {
                "name": "", "title": "", "photo": "",
                "email": "", "phone": "",
                "address": "", "zip": "", "city": "", "country": "",
                "website": "", "linkedin": "", "github": "",
                "birthday": "", "nationality": "", "driversLicense": "",
                "summary": "",
            },
            "experience": [],
            "education": [],
            "skills": [],
            "languages": [],
            "projects": [],
            "certifications": [],
            "interests": [],
        },
        "selectedTemplate": template,
        "lastSaved": None,
    }


def _partial_app_state(template: str) -> dict:
    """Return an AppState with only name and email filled in."""
    state = _empty_app_state(template)
    state["cv"]["personal"]["name"] = "Real Name"
    state["cv"]["personal"]["email"] = "real@example.com"
    return state


@pytest.mark.parametrize("template", TEMPLATES)
def test_empty_state_shows_placeholder_content(browser: Browser, template: str):
    """Empty CV should show placeholder content (not blank) with reduced opacity."""
    context = browser.new_context(
        viewport={"width": 794, "height": 1123},
        device_scale_factor=2,
    )
    page = context.new_page()

    state = _empty_app_state(template)
    page.goto(BASE_URL)
    page.evaluate(
        "state => localStorage.setItem('getmycv_state', JSON.stringify(state))",
        state,
    )
    page.evaluate("() => localStorage.setItem('getmycv_banner_dismissed', 'true')")
    page.reload()
    page.wait_for_selector(".preview-paper", timeout=5000)

    # Verify placeholder elements exist
    placeholders = page.locator(".cv-placeholder")
    count = placeholders.count()
    assert count > 0, f"Expected placeholder elements in {template} template with empty CV"

    # Verify the paper is not blank — it should contain text
    paper_text = page.locator(".preview-paper").inner_text()
    assert len(paper_text.strip()) > 50, f"Expected substantial content in {template} placeholder preview"

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

    paper = page.locator(".preview-paper")
    paper.screenshot(path=str(SCREENSHOTS_DIR / f"{template}_empty_placeholder.png"))

    context.close()


@pytest.mark.parametrize("template", TEMPLATES)
def test_placeholder_hidden_during_export(browser: Browser, template: str):
    """When cv-exporting class is added, placeholder elements should be hidden."""
    context = browser.new_context(viewport={"width": 794, "height": 1123})
    page = context.new_page()

    state = _empty_app_state(template)
    page.goto(BASE_URL)
    page.evaluate(
        "state => localStorage.setItem('getmycv_state', JSON.stringify(state))",
        state,
    )
    page.evaluate("() => localStorage.setItem('getmycv_banner_dismissed', 'true')")
    page.reload()
    page.wait_for_selector(".preview-paper", timeout=5000)

    # Add cv-exporting class to simulate export
    page.evaluate("() => document.querySelector('.preview-paper').classList.add('cv-exporting')")

    # All placeholder elements should now be hidden
    placeholders = page.locator(".cv-placeholder")
    for i in range(placeholders.count()):
        visible = placeholders.nth(i).is_visible()
        assert not visible, (
            f"Placeholder element {i} should be hidden during export in {template}"
        )

    context.close()


@pytest.mark.parametrize("template", TEMPLATES)
def test_partial_data_mixes_real_and_placeholder(browser: Browser, template: str):
    """When user has partial data, filled sections should NOT be placeholders."""
    context = browser.new_context(viewport={"width": 794, "height": 1123})
    page = context.new_page()

    state = _partial_app_state(template)
    page.goto(BASE_URL)
    page.evaluate(
        "state => localStorage.setItem('getmycv_state', JSON.stringify(state))",
        state,
    )
    page.evaluate("() => localStorage.setItem('getmycv_banner_dismissed', 'true')")
    page.reload()
    page.wait_for_selector(".preview-paper", timeout=5000)

    # The name should be "Real Name" and NOT have cv-placeholder class
    # (Professional template renders name in uppercase via CSS)
    paper_text = page.locator(".preview-paper").inner_text()
    assert "real name" in paper_text.lower(), f"Real name not shown in {template}"

    # Name heading should not be a placeholder
    name_heading = page.locator("h1:has-text('Real Name')")
    assert name_heading.count() > 0, f"Real name heading not found in {template}"
    name_classes = name_heading.first.get_attribute("class") or ""
    assert "cv-placeholder" not in name_classes, (
        f"Name should not be placeholder when user provided it in {template}"
    )

    # But experience section should still be placeholder (user didn't add any)
    placeholders = page.locator(".cv-placeholder")
    assert placeholders.count() > 0, (
        f"Expected some placeholder sections in {template} with partial data"
    )

    context.close()
