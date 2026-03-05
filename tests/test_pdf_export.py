"""Tests for PDF export — generates PDFs and preview screenshots for visual comparison.

Each template is tested with both standard and extensive (multi-page) CV data.
The test generates:
  - A browser-native PDF via Playwright's page.pdf() (ground truth)
  - A screenshot of the A4 preview for visual comparison
Both artifacts are saved to tests/__screenshots__/ for manual inspection.
"""

import json
from pathlib import Path

import pytest
from playwright.sync_api import Browser

BASE_URL = "http://localhost:5173"
SCREENSHOTS_DIR = Path(__file__).resolve().parent / "__screenshots__"

TEMPLATES = ["classic", "modern", "minimal", "executive", "professional", "creative"]


# ─── Sample data ────────────────────────────────────────────────────────────

def _standard_cv() -> dict:
    """Standard CV that fits on one page."""
    from sample_data import build_full_cv
    return build_full_cv()


def _extensive_cv() -> dict:
    """Extensive CV that overflows to multiple pages."""
    from test_multipage import _extensive_cv
    return _extensive_cv()


def _app_state(template: str, cv: dict) -> dict:
    return {
        "cv": cv,
        "selectedTemplate": template,
        "lastSaved": None,
    }


def _inject_and_prepare(page, state: dict):
    """Inject state, reload, and prepare the page for PDF/screenshot capture."""
    page.goto(BASE_URL)
    page.evaluate(
        "state => localStorage.setItem('getmycv_state', JSON.stringify(state))",
        state,
    )
    page.evaluate("() => localStorage.setItem('getmycv_banner_dismissed', 'true')")
    page.reload()
    page.wait_for_selector(".preview-paper", timeout=5000)

    # Hide app chrome, isolate the CV preview
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
        // Hide page-break guidelines (same as cv-exporting)
        const tmpl = document.querySelector('.cv-template');
        if (tmpl) tmpl.style.backgroundImage = 'none';
        // Hide placeholders
        document.querySelectorAll('.cv-placeholder').forEach(el => el.style.display = 'none');
    }""")


@pytest.mark.parametrize("template", TEMPLATES)
def test_pdf_export_standard(browser: Browser, template: str):
    """Generate PDF and preview screenshot for standard (single-page) CV."""
    context = browser.new_context(
        viewport={"width": 794, "height": 1123},
        device_scale_factor=2,
    )
    page = context.new_page()

    state = _app_state(template, _standard_cv())
    _inject_and_prepare(page, state)

    paper = page.locator(".preview-paper")

    # 1. Screenshot of preview (reference image)
    paper.screenshot(path=str(SCREENSHOTS_DIR / f"{template}_pdf_preview.png"))

    # 2. Generate browser-native PDF
    pdf_path = SCREENSHOTS_DIR / f"{template}_standard.pdf"
    page.pdf(
        path=str(pdf_path),
        format="A4",
        margin={"top": "0", "right": "0", "bottom": "0", "left": "0"},
        print_background=True,
    )

    # Verify PDF was created and has reasonable size
    assert pdf_path.exists(), f"PDF was not created for {template}"
    size = pdf_path.stat().st_size
    assert size > 10_000, f"{template} PDF too small ({size} bytes) — likely blank"

    context.close()


@pytest.mark.parametrize("template", TEMPLATES)
def test_pdf_export_multipage(browser: Browser, template: str):
    """Generate PDF and preview screenshot for extensive (multi-page) CV."""
    context = browser.new_context(
        viewport={"width": 794, "height": 1123},
        device_scale_factor=2,
    )
    page = context.new_page()

    state = _app_state(template, _extensive_cv())
    _inject_and_prepare(page, state)

    paper = page.locator(".preview-paper")

    # 1. Screenshot of preview (reference image)
    paper.screenshot(path=str(SCREENSHOTS_DIR / f"{template}_multipage_pdf_preview.png"))

    # 2. Generate browser-native PDF
    pdf_path = SCREENSHOTS_DIR / f"{template}_multipage.pdf"
    page.pdf(
        path=str(pdf_path),
        format="A4",
        margin={"top": "0", "right": "0", "bottom": "0", "left": "0"},
        print_background=True,
    )

    # Verify PDF was created and has reasonable size (multi-page should be larger)
    assert pdf_path.exists(), f"PDF was not created for {template}"
    size = pdf_path.stat().st_size
    assert size > 20_000, f"{template} multipage PDF too small ({size} bytes) — likely blank or single-page"

    context.close()
