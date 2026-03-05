"""Export bar tests: button presence and basic interaction."""


def test_export_bar_visible(inject_sample_cv):
    """The export controls are rendered in the right sidebar."""
    page = inject_sample_cv("modern")
    assert page.locator(".sidebar-export").is_visible()


def test_print_button_exists(inject_sample_cv):
    """The Print button is present."""
    page = inject_sample_cv("modern")
    assert page.locator(".export-btn--print").is_visible()


def test_pdf_button_exists(inject_sample_cv):
    """The PDF download button is present."""
    page = inject_sample_cv("modern")
    assert page.locator(".export-btn--pdf").is_visible()


def test_docx_button_exists(inject_sample_cv):
    """The Word download button is present."""
    page = inject_sample_cv("modern")
    assert page.locator(".export-btn--docx").is_visible()


def test_json_backup_button_exists(inject_sample_cv):
    """The JSON backup button is present."""
    page = inject_sample_cv("modern")
    assert page.locator(".export-btn--json").is_visible()


def test_import_button_exists(inject_sample_cv):
    """The import backup button is present."""
    page = inject_sample_cv("modern")
    assert page.locator(".export-btn--import").is_visible()


def test_json_backup_shows_toast(inject_sample_cv):
    """Clicking the backup button triggers a toast notification."""
    page = inject_sample_cv("modern")
    page.locator(".export-btn--json").click()

    toast = page.locator(".export-bar__toast")
    toast.wait_for(state="visible", timeout=3000)
    assert toast.is_visible()
