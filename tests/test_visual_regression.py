"""Visual regression tests: screenshot each template with sample CV data."""

import pytest
from pathlib import Path

SCREENSHOTS_DIR = Path(__file__).resolve().parent / "__screenshots__"
TEMPLATES = ["classic", "modern", "minimal", "executive", "professional", "creative"]


@pytest.mark.parametrize("template", TEMPLATES)
def test_template_preview_screenshot(inject_sample_cv, template):
    """Screenshot the preview area for each template with sample data."""
    page = inject_sample_cv(template)
    page.wait_for_selector(f".cv-{template}", timeout=5000)

    preview = page.locator("#cv-preview-root")
    preview.screenshot(path=str(SCREENSHOTS_DIR / f"{template}_filled.png"))


@pytest.mark.parametrize("template", TEMPLATES)
def test_template_fullpage_screenshot(inject_sample_cv, template):
    """Full-page screenshot capturing editor + preview together."""
    page = inject_sample_cv(template)
    page.wait_for_selector(f".cv-{template}", timeout=5000)

    page.screenshot(
        path=str(SCREENSHOTS_DIR / f"{template}_fullpage.png"),
        full_page=True,
    )


def test_empty_state_screenshot(fresh_page):
    """Screenshot the app in empty state (first visit, with banner)."""
    page = fresh_page
    page.wait_for_selector(".preview-paper", timeout=5000)

    page.screenshot(
        path=str(SCREENSHOTS_DIR / "empty_state.png"),
        full_page=True,
    )
