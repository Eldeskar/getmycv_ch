"""Language switcher tests."""


def test_language_switcher_visible(fresh_page):
    """The language switcher with 4 buttons is visible."""
    switcher = fresh_page.locator(".lang-switcher")
    assert switcher.is_visible()
    assert switcher.locator(".lang-btn").count() == 4


def test_default_language_button_active(fresh_page):
    """One language button has the active class on load."""
    active = fresh_page.locator(".lang-btn--active")
    assert active.count() == 1


def test_switch_to_german(fresh_page):
    """Switching to German changes the UI language."""
    page = fresh_page
    page.locator(".lang-btn", has_text="DE").click()
    page.wait_for_timeout(300)

    active = page.locator(".lang-btn--active")
    assert "DE" in active.inner_text()

    # The first tab should no longer be "Personal" (English)
    first_tab = page.locator(".editor-tab").first.inner_text()
    assert first_tab != "Personal"


def test_switch_to_french(fresh_page):
    """Switching to French changes the active button to FR."""
    page = fresh_page
    page.locator(".lang-btn", has_text="FR").click()
    page.wait_for_timeout(300)

    active = page.locator(".lang-btn--active")
    assert "FR" in active.inner_text()


def test_switch_to_italian(fresh_page):
    """Switching to Italian changes the active button to IT."""
    page = fresh_page
    page.locator(".lang-btn", has_text="IT").click()
    page.wait_for_timeout(300)

    active = page.locator(".lang-btn--active")
    assert "IT" in active.inner_text()


def test_language_round_trip(fresh_page):
    """Switching away and back to English restores English labels."""
    page = fresh_page

    # Force English first
    page.locator(".lang-btn", has_text="EN").click()
    page.wait_for_timeout(300)
    original = page.locator(".editor-tab").first.inner_text()

    # Switch to German
    page.locator(".lang-btn", has_text="DE").click()
    page.wait_for_timeout(300)

    # Switch back to English
    page.locator(".lang-btn", has_text="EN").click()
    page.wait_for_timeout(300)

    restored = page.locator(".editor-tab").first.inner_text()
    assert restored == original
