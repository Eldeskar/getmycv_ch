"""Template switching tests."""

TEMPLATES = ["classic", "modern", "minimal", "executive", "professional", "creative"]


def test_default_template_is_modern(fresh_page):
    """The default template on a fresh visit shows placeholder content in modern template."""
    page = fresh_page
    page.wait_for_selector(".preview-paper", timeout=5000)
    # With no data, placeholder example content is shown with reduced opacity
    assert page.locator(".cv-modern").is_visible()
    assert page.locator(".cv-placeholder").first.is_visible()


def test_switch_to_each_template(inject_sample_cv):
    """Clicking each template button switches the preview template."""
    page = inject_sample_cv("modern")

    for template in TEMPLATES:
        page.locator(".template-btn", has_text=template.capitalize()).click()
        page.wait_for_selector(f".cv-{template}", timeout=3000)
        assert page.locator(f".cv-{template}").is_visible()


def test_template_button_active_state(inject_sample_cv):
    """The active template button has the --active modifier class."""
    page = inject_sample_cv("classic")
    active = page.locator(".template-btn--active")
    assert active.count() == 1
    assert "Classic" in active.inner_text()


def test_template_persists_in_localstorage(inject_sample_cv):
    """Switching template updates the localStorage state."""
    page = inject_sample_cv("modern")
    page.locator(".template-btn", has_text="Minimal").click()
    page.wait_for_timeout(1500)  # wait for debounced auto-save

    stored = page.evaluate(
        "() => JSON.parse(localStorage.getItem('getmycv_state')).selectedTemplate"
    )
    assert stored == "minimal"


def test_only_one_template_visible(inject_sample_cv):
    """Only one cv-template div is visible at a time."""
    page = inject_sample_cv("classic")
    visible = page.locator(".cv-template:visible")
    assert visible.count() == 1
