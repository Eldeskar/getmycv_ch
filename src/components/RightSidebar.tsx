import { useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { CV, TemplateId, StyleSettings, CVSectionId, DEFAULT_STYLE } from '../types/cv'
import { exportPDF, exportJSON, importJSON } from '../utils/export'
import { TemplatePicker } from './TemplatePicker'

const FONT_OPTIONS = [
  { value: 'system-ui, -apple-system, sans-serif', label: 'System' },
  { value: 'Georgia, "Times New Roman", serif', label: 'Georgia' },
  { value: '"Helvetica Neue", Arial, sans-serif', label: 'Helvetica' },
  { value: 'Garamond, "EB Garamond", serif', label: 'Garamond' },
  { value: 'Verdana, Geneva, sans-serif', label: 'Verdana' },
]

const COLOR_PRESETS = [
  '#1e2a3a', '#0072b1', '#0f766e', '#7c3aed',
  '#dc2626', '#ea580c', '#16a34a', '#525252',
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
  previewId: string
}

export function RightSidebar({ selectedTemplate, onTemplateChange, styleSettings, onStyleChange, cv, previewId }: Props) {
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

  function resetStyles() {
    onStyleChange({ ...DEFAULT_STYLE })
  }

  return (
    <aside className="app-controls">
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

      {/* Font */}
      <div className="controls-section">
        <div className="controls-section__title">{t('sidebar.font')}</div>
        <select
          className="controls-select"
          value={styleSettings.fontFamily}
          onChange={(e) => updateStyle({ fontFamily: e.target.value })}
        >
          {FONT_OPTIONS.map((f) => (
            <option key={f.value} value={f.value}>{f.label}</option>
          ))}
        </select>
      </div>

      {/* Accent Color */}
      <div className="controls-section">
        <div className="controls-section__title">{t('sidebar.accentColor')}</div>
        <div className="color-swatches">
          {COLOR_PRESETS.map((color) => (
            <button
              key={color}
              className={`color-swatch${styleSettings.accentColor === color ? ' color-swatch--active' : ''}`}
              style={{ background: color }}
              onClick={() => updateStyle({ accentColor: color })}
            />
          ))}
          <label className="color-swatch--custom" title={t('sidebar.customColor')}>
            <input
              type="color"
              value={styleSettings.accentColor}
              onChange={(e) => updateStyle({ accentColor: e.target.value })}
            />
          </label>
        </div>
      </div>

      {/* Font Size */}
      <div className="controls-section">
        <div className="controls-section__title">{t('sidebar.fontSize')}</div>
        <div className="font-size-control">
          <input
            type="range"
            min={80}
            max={120}
            step={5}
            value={styleSettings.fontSize}
            onChange={(e) => updateStyle({ fontSize: Number(e.target.value) })}
          />
          <span className="font-size-control__value">{styleSettings.fontSize}%</span>
        </div>
      </div>

      {/* Spaced Layout */}
      <div className="controls-section">
        <label className="controls-toggle">
          <input
            type="checkbox"
            checked={styleSettings.spacedLayout}
            onChange={(e) => updateStyle({ spacedLayout: e.target.checked })}
          />
          <span>{t('sidebar.spacedLayout')}</span>
        </label>
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

      {/* Reset */}
      <button className="btn-reset" onClick={resetStyles}>
        {t('sidebar.reset')}
      </button>

    </aside>
  )
}
