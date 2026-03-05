"""General website functionality: page load, header, footer, banner."""

import re


def test_page_loads(fresh_page):
    """App loads and shows the header brand name."""
    assert fresh_page.locator(".app-header__logo").inner_text() == "GetMyCV"


def test_tagline_displayed(fresh_page):
    """The tagline is visible in the header."""
    tagline = fresh_page.locator(".app-header__tagline")
    assert tagline.is_visible()
    assert len(tagline.inner_text()) > 0


def test_storage_banner_shown_on_first_visit(fresh_page):
    """First-time visitors see the storage warning banner."""
    assert fresh_page.locator(".storage-banner").is_visible()


def test_storage_banner_dismiss(fresh_page):
    """Clicking close dismisses the banner and sets localStorage flag."""
    page = fresh_page
    page.locator(".storage-banner__close").click()
    page.wait_for_selector(".storage-banner", state="hidden", timeout=3000)
    dismissed = page.evaluate(
        "() => localStorage.getItem('getmycv_banner_dismissed')"
    )
    assert dismissed == "true"


def test_storage_banner_stays_dismissed_after_reload(fresh_page):
    """After dismissing, the banner stays hidden on reload."""
    page = fresh_page
    page.locator(".storage-banner__close").click()
    page.reload()
    page.wait_for_selector(".app-header", timeout=5000)
    assert not page.locator(".storage-banner").is_visible()


def test_footer_contains_contact_email(fresh_page):
    """Footer shows the contact email link."""
    footer = fresh_page.locator(".app-footer")
    assert "eli@eldeskar.com" in footer.inner_text()


def test_footer_github_link(fresh_page):
    """Footer contains a link to the GitHub repo."""
    link = fresh_page.locator(
        'a[href="https://github.com/Eldeskar/getmycv_ch"]'
    )
    assert link.is_visible()


def test_footer_privacy_note(fresh_page):
    """Footer includes the privacy statement about browser-only storage."""
    text = fresh_page.locator(".app-footer").inner_text().lower()
    assert "browser" in text


def test_footer_copyright(fresh_page):
    """Footer contains the copyright symbol and year."""
    text = fresh_page.locator(".app-footer__copyright").inner_text()
    assert re.search(r"©\s*\d{4}", text)


def test_preview_container_exists(fresh_page):
    """The preview root and paper element are rendered."""
    assert fresh_page.locator("#cv-preview-root").is_visible()
    assert fresh_page.locator(".preview-paper").is_visible()


def test_editor_has_four_tabs(fresh_page):
    """The editor sidebar has exactly 4 tabs."""
    tabs = fresh_page.locator(".editor-tab")
    assert tabs.count() == 4
