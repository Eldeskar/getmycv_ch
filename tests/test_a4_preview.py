"""Full A4 page preview: render each template in an isolated page at 2x scale.

Opens a dedicated browser context sized to A4 width, injects sample data,
hides everything except the CV paper, removes overflow clipping, and
captures the full template at 2x device-pixel-ratio for crisp output.
"""

import json
import sys
from pathlib import Path

import pytest

sys.path.insert(0, str(Path(__file__).resolve().parent))
from sample_data import build_app_state

SCREENSHOTS_DIR = Path(__file__).resolve().parent / "__screenshots__"
TEMPLATES = ["classic", "modern", "minimal", "executive", "professional", "creative"]
BASE_URL = "http://localhost:5173"

# A4 at 96 CSS-px/inch ≈ 794 × 1123.  We use 2× scale → 1588 × 2246 image.
A4_WIDTH = 794
A4_HEIGHT = 1123


@pytest.mark.parametrize("template", TEMPLATES)
def test_a4_preview(browser, template):
    """Render the CV template full-page at 2× scale for print-like preview."""
    context = browser.new_context(
        viewport={"width": A4_WIDTH, "height": A4_HEIGHT},
        device_scale_factor=2,
    )
    page = context.new_page()

    # Inject sample data into localStorage
    state = build_app_state(template)
    page.goto(BASE_URL)
    page.evaluate(
        "state => localStorage.setItem('getmycv_state', JSON.stringify(state))",
        state,
    )
    page.evaluate("() => localStorage.setItem('getmycv_banner_dismissed', 'true')")
    page.reload()
    page.wait_for_selector(f".cv-{template}", timeout=5000)

    # Hide everything except the paper and remove clipping so full content shows
    page.evaluate("""() => {
        // Hide app chrome
        document.querySelectorAll(
            '.app-header, .app-sidebar, .template-picker, .export-bar'
        ).forEach(el => el.style.display = 'none');

        // Make the main area fill the viewport with no padding
        const main = document.querySelector('.app-main');
        if (main) {
            main.style.padding = '0';
            main.style.overflow = 'visible';
        }

        // Make the paper element fill viewport width, remove shadow/overflow
        const paper = document.querySelector('.preview-paper');
        if (paper) {
            paper.style.width = '100%';
            paper.style.overflow = 'visible';
            paper.style.boxShadow = 'none';
            paper.style.borderRadius = '0';
            paper.style.margin = '0';
        }
    }""")

    # Screenshot the paper element — captures full height even if > viewport
    paper = page.locator(".preview-paper")
    paper.screenshot(path=str(SCREENSHOTS_DIR / f"{template}_a4.png"))

    context.close()
