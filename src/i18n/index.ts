import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import en from './locales/en'
import de from './locales/de'
import fr from './locales/fr'
import it from './locales/it'

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      de: { translation: de },
      fr: { translation: fr },
      it: { translation: it },
    },
    fallbackLng: 'en',
    supportedLngs: ['en', 'de', 'fr', 'it'],
    detection: {
      // Check localStorage first, then browser language
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
      lookupLocalStorage: 'getmycv_lang',
    },
    interpolation: {
      escapeValue: false, // React handles XSS
    },
  })

export default i18n
