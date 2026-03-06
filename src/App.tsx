import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useCVStore } from './store/cvStore'
import { Editor } from './components/Editor'
import { Preview } from './components/Preview'
import { PreviewZoom } from './components/PreviewZoom'
import { StorageBanner } from './components/StorageBanner'
import { StorageIndicator } from './components/StorageIndicator'
import { OptionsBar } from './components/RightSidebar'
import { LanguageSwitcher } from './components/LanguageSwitcher'
import { isBannerDismissed } from './utils/storage'

declare const __APP_VERSION__: string
const APP_VERSION = __APP_VERSION__

export default function App() {
  const { t } = useTranslation()
  const { cv, cvLanguage, selectedTemplate, styleSettings, updateCV, updateTemplate, updateStyleSettings, switchCVLanguage } = useCVStore()
  const [showBanner, setShowBanner] = useState(!isBannerDismissed())
  const [panelOpen, setPanelOpen] = useState<'editor' | 'settings' | null>(null)

  function togglePanel(panel: 'editor' | 'settings') {
    setPanelOpen((prev) => (prev === panel ? null : panel))
  }

  // Ctrl+S → JSON backup download
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault()
        import('./utils/export').then(({ exportJSON }) => exportJSON(cv))
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [cv])

  // Listen for imported CV from ExportBar
  useEffect(() => {
    function onImport(e: Event) {
      const imported = (e as CustomEvent).detail
      updateCV(imported)
    }
    window.addEventListener('cv:import', onImport)
    return () => window.removeEventListener('cv:import', onImport)
  }, [updateCV])

  return (
    <div className="app">
      {showBanner && <StorageBanner onDismiss={() => setShowBanner(false)} />}

      <header className="app-header">
        <button className="panel-toggle panel-toggle--editor" onClick={() => togglePanel('editor')} aria-label={t('app.editCV')}>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor"><path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zm-2.207 2.207L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"/></svg>
        </button>
        <div className="app-header__brand">
          <span className="app-header__logo">GetMyCV</span>
        </div>
        <div className="app-header__right">
          <StorageIndicator />
          <LanguageSwitcher />
          <button className="panel-toggle panel-toggle--settings" onClick={() => togglePanel('settings')} aria-label={t('app.settings')}>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd"/></svg>
          </button>
        </div>
      </header>

      <div className="app-body">
        {panelOpen && <div className="panel-overlay" onClick={() => setPanelOpen(null)} />}
        <aside className={`app-sidebar${panelOpen === 'editor' ? ' app-sidebar--open' : ''}`}>
          <Editor cv={cv} cvLanguage={cvLanguage} onChange={updateCV} />
        </aside>

        <main className="app-main">
          <PreviewZoom
            id="cv-preview-root"
            className={styleSettings.spacedLayout ? 'cv-spaced' : undefined}
            style={{
              '--cv-font': styleSettings.fontFamily,
              '--cv-accent': styleSettings.accentColor,
            } as React.CSSProperties}
          >
            <Preview cv={cv} template={selectedTemplate} sectionOrder={styleSettings.sectionOrder} cvLanguage={cvLanguage} />
          </PreviewZoom>
        </main>

        <OptionsBar
          className={panelOpen === 'settings' ? 'options-bar--open' : ''}
          selectedTemplate={selectedTemplate}
          onTemplateChange={updateTemplate}
          styleSettings={styleSettings}
          onStyleChange={updateStyleSettings}
          cv={cv}
          cvLanguage={cvLanguage}
          onCVLanguageChange={switchCVLanguage}
          previewId="cv-preview-root"
        />
      </div>

      <footer className="app-footer">
        <div className="app-footer__center">
          <span className="app-footer__copyright">{t('footer.copyright', { year: new Date().getFullYear() })} <span className="app-footer__copyright-name">{t('footer.copyrightName')}</span></span>
          <span className="app-footer__sep">·</span>
          <span className="app-footer__privacy">{t('footer.privacy')}</span>
          <span className="app-footer__sep">·</span>
          <span className="app-footer__links">
            <a href="mailto:eli@eldeskar.com" className="app-footer__link">
              <svg viewBox="0 0 20 20" fill="currentColor" className="app-footer__icon"><path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"/><path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"/></svg>
              <span className="app-footer__link-text">eli@eldeskar.com</span>
            </a>
            <span className="app-footer__sep">·</span>
            <a href="https://github.com/Eldeskar/getmycv_ch" target="_blank" rel="noopener noreferrer" className="app-footer__link">
              <svg viewBox="0 0 16 16" fill="currentColor" className="app-footer__icon"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/></svg>
              <span className="app-footer__link-text">Eldeskar/getmycv_ch</span>
            </a>
          </span>
        </div>
        <span className="app-footer__version">v{APP_VERSION}</span>
      </footer>
    </div>
  )
}
