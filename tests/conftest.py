"""Shared Playwright fixtures for GetMyCV tests."""

import json
import subprocess
import sys
import time
import urllib.request
from pathlib import Path

import pytest
from playwright.sync_api import Page

sys.path.insert(0, str(Path(__file__).resolve().parent))
from sample_data import build_app_state, SAMPLE_PERSONAL

BASE_URL = "http://localhost:5173"
PROJECT_ROOT = Path(__file__).resolve().parent.parent
SCREENSHOTS_DIR = Path(__file__).resolve().parent / "__screenshots__"


def _server_is_running():
    try:
        urllib.request.urlopen(BASE_URL, timeout=2)
        return True
    except Exception:
        return False


@pytest.fixture(scope="session", autouse=True)
def ensure_dev_server():
    """Start the Vite dev server if it isn't already running."""
    if _server_is_running():
        yield
        return

    proc = subprocess.Popen(
        ["npm", "run", "dev"],
        cwd=str(PROJECT_ROOT),
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
    )
    for _ in range(30):
        if _server_is_running():
            break
        time.sleep(0.5)
    else:
        proc.terminate()
        raise RuntimeError("Vite dev server did not start within 15 seconds")

    yield
    proc.terminate()
    proc.wait(timeout=5)


@pytest.fixture(scope="session", autouse=True)
def screenshots_dir():
    """Ensure the screenshots directory exists."""
    SCREENSHOTS_DIR.mkdir(parents=True, exist_ok=True)
    return SCREENSHOTS_DIR


@pytest.fixture
def inject_sample_cv(page: Page):
    """
    Returns a callable that loads the app with sample CV data
    pre-injected into localStorage.

    Usage:
        def test_something(inject_sample_cv):
            page = inject_sample_cv("classic")
    """
    def _inject(template: str = "modern"):
        state = build_app_state(template)
        page.goto(BASE_URL)
        page.evaluate(
            "state => localStorage.setItem('getmycv_state', JSON.stringify(state))",
            state,
        )
        page.evaluate(
            "() => localStorage.setItem('getmycv_banner_dismissed', 'true')"
        )
        page.reload()
        page.wait_for_selector(".preview-paper", timeout=5000)
        return page

    return _inject


@pytest.fixture
def fresh_page(page: Page):
    """Navigate to the app with a completely clean localStorage."""
    page.goto(BASE_URL)
    page.evaluate("() => localStorage.clear()")
    page.reload()
    page.wait_for_selector(".app-header", timeout=5000)
    return page
