"""localStorage persistence tests."""


def test_data_persists_after_reload(fresh_page):
    """Data entered in the editor survives a page reload."""
    page = fresh_page
    if page.locator(".storage-banner").is_visible():
        page.locator(".storage-banner__close").click()

    page.fill("#personal-name", "Persistence Test")
    page.wait_for_timeout(1500)  # wait for debounced auto-save

    page.reload()
    page.wait_for_selector("#personal-name", timeout=5000)
    assert page.input_value("#personal-name") == "Persistence Test"


def test_template_persists_after_reload(inject_sample_cv):
    """The selected template persists across page reloads."""
    page = inject_sample_cv("classic")
    assert page.locator(".cv-classic").is_visible()

    page.reload()
    page.wait_for_selector(".cv-classic", timeout=5000)
    assert page.locator(".cv-classic").is_visible()


def test_clear_localstorage_resets_state(inject_sample_cv):
    """Clearing localStorage resets the app to empty state."""
    page = inject_sample_cv("classic")
    page.evaluate("() => localStorage.clear()")
    page.reload()
    page.wait_for_selector(".preview-paper", timeout=5000)

    # Should be back to empty state — placeholder content shown instead
    assert page.locator(".cv-placeholder").first.is_visible()
    assert page.input_value("#personal-name") == ""


def test_storage_indicator_renders(inject_sample_cv):
    """The storage indicator element is present in the header."""
    page = inject_sample_cv("modern")
    assert page.locator(".storage-indicator").is_visible()
