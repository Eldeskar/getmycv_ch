"""Tests for all templates with a CV photo — screenshots and PDFs for visual verification."""

from pathlib import Path

import pytest
from playwright.sync_api import Browser

BASE_URL = "http://localhost:5173"
SCREENSHOTS_DIR = Path(__file__).resolve().parent / "__screenshots__"

TEMPLATES = ["classic", "modern", "minimal", "executive", "professional", "creative"]


def _load_photo_b64() -> str:
    b64_file = Path(__file__).resolve().parent / "fixtures" / "sample_photo_b64.txt"
    return b64_file.read_text().strip()


def _sample_cv_with_photo() -> dict:
    from sample_data import build_full_cv
    return build_full_cv(with_photo=True)


def _extensive_cv_with_photo() -> dict:
    from test_multipage import _extensive_cv
    cv = _extensive_cv()
    cv["personal"]["photo"] = _load_photo_b64()
    return cv


def _app_state(template: str, cv: dict) -> dict:
    return {
        "cv": cv,
        "selectedTemplate": template,
        "lastSaved": None,
    }


def _inject_and_wait(page, state: dict):
    page.goto(BASE_URL)
    page.evaluate(
        "state => localStorage.setItem('getmycv_state', JSON.stringify(state))",
        state,
    )
    page.evaluate("() => localStorage.setItem('getmycv_banner_dismissed', 'true')")
    page.reload()
    page.wait_for_selector(".preview-paper", timeout=5000)


def _prepare_for_capture(page):
    """Hide app chrome and cleanup for clean screenshot/PDF."""
    page.evaluate("""() => {
        document.querySelectorAll('.app-header, .app-sidebar, .template-picker, .export-bar')
          .forEach(el => el.style.display = 'none');
        const main = document.querySelector('.app-main');
        if (main) { main.style.padding = '0'; main.style.overflow = 'visible'; }
        const paper = document.querySelector('.preview-paper');
        if (paper) {
          paper.style.boxShadow = 'none';
          paper.style.borderRadius = '0';
          paper.style.margin = '0';
        }
        const tmpl = document.querySelector('.cv-template');
        if (tmpl) tmpl.style.backgroundImage = 'none';
        document.querySelectorAll('.cv-placeholder').forEach(el => el.style.display = 'none');
    }""")


@pytest.mark.parametrize("template", TEMPLATES)
def test_photo_renders_in_preview(browser: Browser, template: str):
    """Photo should be visible in the preview for each template."""
    context = browser.new_context(
        viewport={"width": 794, "height": 1123},
        device_scale_factor=2,
    )
    page = context.new_page()

    state = _app_state(template, _sample_cv_with_photo())
    _inject_and_wait(page, state)

    # The photo should render as an <img> element within the preview
    photos = page.locator(".preview-paper img[src^='data:image']")
    assert photos.count() > 0, f"{template}: no photo <img> found in preview"

    # Take screenshot for visual verification
    _prepare_for_capture(page)
    paper = page.locator(".preview-paper")
    paper.screenshot(path=str(SCREENSHOTS_DIR / f"{template}_with_photo.png"))

    context.close()


@pytest.mark.parametrize("template", TEMPLATES)
def test_photo_in_pdf(browser: Browser, template: str):
    """Generate PDF with photo and verify it has reasonable size."""
    context = browser.new_context(
        viewport={"width": 794, "height": 1123},
        device_scale_factor=2,
    )
    page = context.new_page()

    state = _app_state(template, _sample_cv_with_photo())
    _inject_and_wait(page, state)
    _prepare_for_capture(page)

    pdf_path = SCREENSHOTS_DIR / f"{template}_with_photo.pdf"
    page.pdf(
        path=str(pdf_path),
        format="A4",
        margin={"top": "0", "right": "0", "bottom": "0", "left": "0"},
        print_background=True,
    )

    assert pdf_path.exists(), f"PDF not created for {template}"
    size = pdf_path.stat().st_size
    # PDF with embedded photo should be larger than without
    assert size > 15_000, f"{template} PDF with photo too small ({size} bytes)"

    context.close()


@pytest.mark.parametrize("template", TEMPLATES)
def test_photo_multipage_preview(browser: Browser, template: str):
    """Extensive CV with photo should render correctly across multiple pages."""
    context = browser.new_context(
        viewport={"width": 794, "height": 1123},
        device_scale_factor=2,
    )
    page = context.new_page()

    state = _app_state(template, _extensive_cv_with_photo())
    _inject_and_wait(page, state)

    # Photo should be visible
    photos = page.locator(".preview-paper img[src^='data:image']")
    assert photos.count() > 0, f"{template}: no photo in multipage preview"

    # Content should overflow
    paper = page.locator(".preview-paper")
    box = paper.bounding_box()
    assert box is not None
    assert box["height"] > 1123, f"{template}: multipage with photo should overflow"

    # Screenshot
    _prepare_for_capture(page)
    paper.screenshot(path=str(SCREENSHOTS_DIR / f"{template}_multipage_with_photo.png"))

    context.close()
