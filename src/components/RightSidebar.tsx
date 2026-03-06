import { useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { CV, TemplateId, StyleSettings, CVSectionId, CVLanguage, CV_LANGUAGES } from '../types/cv'
import { exportPDF, exportJSON, importJSON } from '../utils/export'
import { TemplatePicker } from './TemplatePicker'

const FONT_OPTIONS = [
  { value: 'system-ui, -apple-system, sans-serif', label: 'System' },
  { value: 'Georgia, "Times New Roman", serif', label: 'Georgia' },
  { value: '"Helvetica Neue", Arial, sans-serif', label: 'Helvetica' },
  { value: 'Garamond, "EB Garamond", serif', label: 'Garamond' },
  { value: 'Verdana, Geneva, sans-serif', label: 'Verdana' },
]

// Two-column templates only allow reordering main-column sections
const SIDEBAR_SECTIONS: CVSectionId[] = ['skills', 'languages', 'interests']
const TWO_COLUMN_TEMPLATES: TemplateId[] = ['modern', 'professional', 'creative', 'sharp', 'elegant']

interface Props {
  selectedTemplate: TemplateId
  onTemplateChange: (id: TemplateId) => void
  styleSettings: StyleSettings
  onStyleChange: (s: StyleSettings) => void
  cv: CV
  cvLanguage: CVLanguage
  onCVLanguageChange: (lang: CVLanguage) => void
  previewId: string
}

export function OptionsBar({ selectedTemplate, onTemplateChange, styleSettings, onStyleChange, cv, cvLanguage, onCVLanguageChange, previewId }: Props) {
  const { t } = useTranslation()
  const [exporting, setExporting] = useState(false)
  const [showPicker, setShowPicker] = useState(false)
  const importRef = useRef<HTMLInputElement>(null)

  const isTwoColumn = TWO_COLUMN_TEMPLATES.includes(selectedTemplate)
  const reorderableSections = isTwoColumn
    ? styleSettings.sectionOrder.filter((s) => !SIDEBAR_SECTIONS.includes(s))
    : styleSettings.sectionOrder

  function updateStyle(patch: Partial<StyleSettings>) {
    onStyleChange({ ...styleSettings, ...patch })
  }

  function moveSection(id: CVSectionId, direction: -1 | 1) {
    const order = [...styleSettings.sectionOrder]
    const idx = order.indexOf(id)
    const targetIdx = idx + direction
    if (targetIdx < 0 || targetIdx >= order.length) return
    ;[order[idx], order[targetIdx]] = [order[targetIdx], order[idx]]
    updateStyle({ sectionOrder: order })
  }

  return (
    <aside className="options-bar">
      {/* Template */}
      <div className="controls-section">
        <div className="controls-section__title">{t('sidebar.template')}</div>
        <button className="template-select-btn" onClick={() => setShowPicker(true)}>
          <span>{t(`templates.${selectedTemplate}.name`)}</span>
          <span className="template-select-btn__arrow">&#x25BC;</span>
        </button>
      </div>

      {showPicker && (
        <TemplatePicker
          selected={selectedTemplate}
          accentColor={styleSettings.accentColor}
          cv={cv}
          onSelect={onTemplateChange}
          onClose={() => setShowPicker(false)}
        />
      )}

      {/* CV Language */}
      <div className="controls-section">
        <div className="controls-section__title">{t('sidebar.cvLanguage')}</div>
        <div className="cv-lang-switcher">
          {CV_LANGUAGES.map((lang) => (
            <button
              key={lang.code}
              className={`cv-lang-btn${cvLanguage === lang.code ? ' cv-lang-btn--active' : ''}`}
              onClick={() => onCVLanguageChange(lang.code)}
            >
              {lang.code.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Section Order */}
      <div className="controls-section">
        <div className="controls-section__title">{t('sidebar.sectionOrder')}</div>
        <div className="section-order">
          {reorderableSections.map((id, idx) => (
            <div key={id} className="section-order__item">
              <span className="section-order__label">{t(`sidebar.sections.${id}`)}</span>
              <button
                className="section-order__btn"
                disabled={idx === 0}
                onClick={() => moveSection(id, -1)}
              >
                &#x25B2;
              </button>
              <button
                className="section-order__btn"
                disabled={idx === reorderableSections.length - 1}
                onClick={() => moveSection(id, 1)}
              >
                &#x25BC;
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Layout */}
      <div className="controls-section">
        <div className="controls-section__title">{t('sidebar.layout')}</div>
        <select
          className="controls-select"
          value={styleSettings.fontFamily}
          onChange={(e) => updateStyle({ fontFamily: e.target.value })}
        >
          {FONT_OPTIONS.map((f) => (
            <option key={f.value} value={f.value}>{f.label}</option>
          ))}
        </select>
        <label className="controls-toggle">
          <input
            type="checkbox"
            checked={styleSettings.spacedLayout}
            onChange={(e) => updateStyle({ spacedLayout: e.target.checked })}
          />
          <span>{t('sidebar.spacedLayout')}</span>
        </label>
      </div>

      {/* Export */}
      <div className="controls-section">
        <div className="controls-section__title">{t('sidebar.export')}</div>
        <div className="export-buttons">
          <button
            className="btn-upload"
            disabled={exporting}
            onClick={async () => {
              setExporting(true)
              try { await exportPDF(previewId, cv.personal.name) } finally { setExporting(false) }
            }}
            title={t('export.downloadPDFTitle')}
          >
            {exporting ? '...' : t('export.downloadPDF')}
          </button>
          <button
            className="btn-upload"
            onClick={() => exportJSON(cv)}
            title={t('export.saveBackupTitle')}
          >
            {t('export.saveBackup')}
          </button>
          <button
            className="btn-upload"
            onClick={() => importRef.current?.click()}
            title={t('export.importBackupTitle')}
          >
            {t('export.importBackup')}
          </button>
          <input
            ref={importRef}
            type="file"
            accept=".json"
            style={{ display: 'none' }}
            onChange={async (e) => {
              const file = e.target.files?.[0]
              if (!file) return
              try {
                const imported = await importJSON(file)
                window.dispatchEvent(new CustomEvent('cv:import', { detail: imported }))
              } catch {
                alert('Invalid backup file')
              }
              e.target.value = ''
            }}
          />
        </div>
      </div>
    </aside>
  )
}
