import { useTranslation } from 'react-i18next'

const LANGUAGES = [
  { code: 'en', label: 'EN' },
  { code: 'de', label: 'DE' },
  { code: 'fr', label: 'FR' },
  { code: 'it', label: 'IT' },
]

export function LanguageSwitcher() {
  const { i18n } = useTranslation()
  const current = i18n.language.slice(0, 2) // normalise e.g. "de-CH" → "de"

  return (
    <div className="lang-switcher">
      {LANGUAGES.map((lang) => (
        <button
          key={lang.code}
          className={`lang-btn ${current === lang.code ? 'lang-btn--active' : ''}`}
          onClick={() => i18n.changeLanguage(lang.code)}
          aria-label={lang.code}
        >
          {lang.label}
        </button>
      ))}
    </div>
  )
}
