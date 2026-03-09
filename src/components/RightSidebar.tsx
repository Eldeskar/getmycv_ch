import { useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { CV, TemplateId, StyleSettings, CVSectionId, CVLanguage, CV_LANGUAGES } from '../types/cv'
import { exportJSON, importJSON, printCV } from '../utils/export'
import { TemplatePicker } from './TemplatePicker'

const FONT_OPTIONS = [
  { value: 'system-ui, -apple-system, sans-serif', label: 'System' },
  { value: 'Georgia, "Times New Roman", serif', label: 'Georgia' },
  { value: '"Helvetica Neue", Arial, sans-serif', label: 'Helvetica' },
  { value: 'Garamond, "EB Garamond", serif', label: 'Garamond' },
  { value: 'Verdana, Geneva, sans-serif', label: 'Verdana' },
]

// Color schemes sourced from popular Coolors palettes
const COLOR_SCHEMES: { name: string; primary: string; secondary: string }[] = [
  // Nina default (screenshot reference)
  { name: 'Navy & Gold',        primary: '#1e2a3a', secondary: '#e8a825' },
  // coolors.co/palette/264653-2a9d8f-e9c46a-f4a261-e76f51
  { name: 'Teal & Sand',        primary: '#264653', secondary: '#e9c46a' },
  // coolors.co/palette/003049-d62828-f77f00-fcbf49-eae2b7
  { name: 'Navy & Amber',       primary: '#003049', secondary: '#fcbf49' },
  // coolors.co/palette/0b132b-1c2541-3a506b-5bc0be-6fffe9
  { name: 'Midnight & Aqua',    primary: '#1c2541', secondary: '#5bc0be' },
  // coolors.co/palette/001219-005f73-0a9396-94d2bd-e9d8a6
  { name: 'Ocean & Sage',       primary: '#001219', secondary: '#94d2bd' },
  // coolors.co/palette/606c38-283618-fefae0-dda15e-bc6c25
  { name: 'Olive & Wheat',      primary: '#283618', secondary: '#dda15e' },
  // coolors.co/palette/582f0e-7f4f24-936639-a68a64-b6ad90
  { name: 'Espresso & Tan',     primary: '#582f0e', secondary: '#a68a64' },
  // coolors.co/palette/d9f0ff-a3d5ff-83c9f4-6f73d2-7681b3
  { name: 'Indigo & Sky',       primary: '#6f73d2', secondary: '#a3d5ff' },
  // coolors.co/palette/2b2d42-8d99ae-edf2f4-ef233c-d90429
  { name: 'Steel & Coral',      primary: '#2b2d42', secondary: '#ef233c' },
  // coolors.co/palette/780000-c1121f-fdf0d5-003049-669bbc
  { name: 'Bordeaux & Blue',    primary: '#780000', secondary: '#669bbc' },
  // coolors.co/palette/353535-3c6e71-ffffff-d9d9d9-284b63
  { name: 'Slate & Mint',       primary: '#284b63', secondary: '#3c6e71' },
  // coolors.co/palette/0d1b2a-1b2838-415a77-778da9-e0e1dd
  { name: 'Navy Classic',       primary: '#1b2838', secondary: '#778da9' },
  // coolors.co/palette/f8f9fa-e9ecef-dee2e6-ced4da-adb5bd
  { name: 'Silver & Slate',     primary: '#495057', secondary: '#adb5bd' },
  // coolors.co/palette/03045e-0077b6-00b4d8-90e0ef-caf0f8
  { name: 'Deep Blue & Cyan',   primary: '#03045e', secondary: '#00b4d8' },
  // coolors.co/palette/132a13-31572c-4f772d-90a955-ecf39e
  { name: 'Forest & Lime',      primary: '#31572c', secondary: '#90a955' },
  // coolors.co/palette/3d405b-e07a5f-f4f1de-81b29a-f2cc8f
  { name: 'Mauve & Peach',      primary: '#3d405b', secondary: '#e07a5f' },
  // coolors.co/palette/6b705c-a5a58d-b7b7a4-ffe8d6-ddbea9
  { name: 'Earthy & Warm',      primary: '#6b705c', secondary: '#ddbea9' },
  // coolors.co/palette/10002b-240046-3c096c-5a189a-9d4edd
  { name: 'Plum & Lavender',    primary: '#240046', secondary: '#9d4edd' },
  // coolors.co/palette/540b0e-9e2a2b-335c67-fff3b0-e09f3e
  { name: 'Burgundy & Gold',    primary: '#540b0e', secondary: '#e09f3e' },
  // coolors.co/palette/1d3557-457b9d-a8dadc-f1faee-e63946
  { name: 'French Blue & Rose', primary: '#1d3557', secondary: '#e63946' },
  // coolors.co/palette/2d6a4f-40916c-52b788-74c69d-b7e4c7
  { name: 'Emerald & Mint',     primary: '#2d6a4f', secondary: '#74c69d' },
]

// Two-column templates only allow reordering main-column sections
const SIDEBAR_SECTIONS: CVSectionId[] = ['skills', 'languages', 'interests']
const TWO_COLUMN_TEMPLATES: TemplateId[] = ['modern', 'professional', 'creative', 'sharp', 'elegant', 'nina']

interface Props {
  selectedTemplate: TemplateId
  onTemplateChange: (id: TemplateId) => void
  styleSettings: StyleSettings
  onStyleChange: (s: StyleSettings) => void
  cv: CV
  cvLanguage: CVLanguage
  onCVLanguageChange: (lang: CVLanguage) => void
  className?: string
}

export function OptionsBar({ selectedTemplate, onTemplateChange, styleSettings, onStyleChange, cv, cvLanguage, onCVLanguageChange, className }: Props) {
  const { t } = useTranslation()
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
    <aside className={`options-bar${className ? ` ${className}` : ''}`}>
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
          accentColor2={styleSettings.accentColor2}
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

      {/* Color Scheme */}
      <div className="controls-section">
        <div className="controls-section__title">{t('sidebar.colorScheme')}</div>
        <div className="color-schemes">
          {COLOR_SCHEMES.map((scheme) => (
            <button
              key={scheme.name}
              className={`color-scheme${styleSettings.accentColor === scheme.primary && styleSettings.accentColor2 === scheme.secondary ? ' color-scheme--active' : ''}`}
              onClick={() => updateStyle({ accentColor: scheme.primary, accentColor2: scheme.secondary })}
              title={scheme.name}
            >
              <span className="color-scheme__swatch" style={{ background: scheme.primary }} />
              <span className="color-scheme__swatch" style={{ background: scheme.secondary }} />
            </button>
          ))}
        </div>
      </div>

      {/* Layout */}
      <div className="controls-section">
        <div className="controls-section__title">{t('sidebar.layout')}</div>
        <label className="controls-label">{t('sidebar.font')}</label>
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
            onClick={() => printCV(cv.personal.name)}
            title={t('export.downloadPDFTitle')}
          >
            {t('export.downloadPDF')}
          </button>
          <button
            className="btn-upload"
            onClick={() => exportJSON({ cv, selectedTemplate, styleSettings, cvLanguage })}
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
