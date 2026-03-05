"""Editor interaction tests: form filling, tabs, adding/removing entries."""


def _dismiss_banner(page):
    if page.locator(".storage-banner").is_visible():
        page.locator(".storage-banner__close").click()


def test_tab_switching(fresh_page):
    """Clicking each editor tab shows the corresponding section."""
    page = fresh_page
    tabs = page.locator(".editor-tab")
    for i in range(4):
        tabs.nth(i).click()
        assert page.locator(".editor-section__title").first.is_visible()


def test_personal_form_reflects_in_preview(fresh_page):
    """Typing in the Personal tab updates the CV preview."""
    page = fresh_page
    _dismiss_banner(page)

    page.fill("#personal-name", "John Doe")
    page.fill("#personal-title", "Product Manager")
    page.wait_for_timeout(500)

    text = page.locator(".preview-paper").inner_text()
    assert "John Doe" in text
    assert "Product Manager" in text


def test_experience_add_entry(fresh_page):
    """Clicking 'Add Experience' creates a new entry card."""
    page = fresh_page
    page.locator(".editor-tab").nth(1).click()

    before = page.locator(".editor-card").count()
    page.locator(".btn-add-entry").first.click()
    assert page.locator(".editor-card").count() == before + 1


def test_experience_fill_shows_in_preview(fresh_page):
    """Filling an experience entry shows it in the preview."""
    page = fresh_page
    _dismiss_banner(page)
    page.locator(".editor-tab").nth(1).click()
    page.locator(".btn-add-entry").first.click()

    card = page.locator(".editor-card").first
    inputs = card.locator("input[type='text']")
    inputs.nth(0).fill("Senior Engineer")
    inputs.nth(1).fill("Acme AG")
    page.wait_for_timeout(500)

    text = page.locator(".preview-paper").inner_text()
    assert "Senior Engineer" in text
    assert "Acme AG" in text


def test_experience_remove_entry(fresh_page):
    """Removing an experience entry removes its card."""
    page = fresh_page
    page.locator(".editor-tab").nth(1).click()

    page.locator(".btn-add-entry").first.click()
    page.locator(".btn-add-entry").first.click()
    assert page.locator(".editor-card").count() == 2

    page.locator(".editor-card").first.locator(".btn-danger").click()
    assert page.locator(".editor-card").count() == 1


def test_experience_add_bullet(fresh_page):
    """Adding a bullet point to an experience entry works."""
    page = fresh_page
    page.locator(".editor-tab").nth(1).click()
    page.locator(".btn-add-entry").first.click()

    card = page.locator(".editor-card").first
    before = card.locator(".bullet-row").count()
    card.locator(".btn-add-bullet").click()
    assert card.locator(".bullet-row").count() == before + 1


def test_experience_current_disables_enddate(fresh_page):
    """Checking 'I currently work here' disables the end date field."""
    page = fresh_page
    page.locator(".editor-tab").nth(1).click()
    page.locator(".btn-add-entry").first.click()

    card = page.locator(".editor-card").first
    checkbox = card.locator("input[type='checkbox']")
    end_date = card.locator("input[type='month']").nth(1)

    assert not end_date.is_disabled()
    checkbox.check()
    assert end_date.is_disabled()


def test_education_add_and_fill(fresh_page):
    """Adding and filling an education entry reflects in preview."""
    page = fresh_page
    _dismiss_banner(page)
    page.locator(".editor-tab").nth(2).click()
    page.locator(".btn-add-entry").first.click()

    card = page.locator(".editor-card").first
    inputs = card.locator("input[type='text']")
    inputs.nth(0).fill("ETH Zurich")
    inputs.nth(1).fill("Bachelor of Science")
    inputs.nth(2).fill("Computer Science")
    page.wait_for_timeout(500)

    text = page.locator(".preview-paper").inner_text()
    assert "ETH Zurich" in text


def test_skills_add_group(fresh_page):
    """Adding a skill group and typing skills shows them in preview."""
    page = fresh_page
    _dismiss_banner(page)
    page.locator(".editor-tab").nth(3).click()

    # Click the first "Add" button (skill groups come before languages)
    page.locator(".btn-add-entry").first.click()

    card = page.locator(".editor-card").first
    inputs = card.locator("input[type='text']")
    inputs.nth(0).fill("Programming")
    inputs.nth(1).fill("Python, TypeScript, Go")
    page.wait_for_timeout(500)

    text = page.locator(".preview-paper").inner_text()
    assert "Programming" in text
    assert "Python" in text


def test_skills_add_language(fresh_page):
    """Adding a language entry with a level works."""
    page = fresh_page
    _dismiss_banner(page)
    page.locator(".editor-tab").nth(3).click()

    # The "Add Language" button is the last btn-add-entry on the page
    page.locator(".btn-add-entry").last.click()

    # The language card is the last editor-card
    card = page.locator(".editor-card").last
    card.locator("input[type='text']").fill("German")
    card.locator("select").select_option("C1")
    page.wait_for_timeout(500)

    text = page.locator(".preview-paper").inner_text()
    assert "German" in text
    assert "C1" in text
