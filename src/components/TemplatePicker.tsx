import { useEffect, useCallback, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { useTranslation } from 'react-i18next'
import { CV, TemplateId, DEFAULT_STYLE } from '../types/cv'
import { Preview } from './Preview'

const TEMPLATE_IDS: TemplateId[] = ['modern', 'classic', 'minimal', 'executive', 'professional', 'creative', 'original', 'sharp', 'elegant']
const A4_WIDTH = 794 // 210mm at 96dpi

interface Props {
  selected: TemplateId
  accentColor: string
  cv: CV
  onSelect: (id: TemplateId) => void
  onClose: () => void
}

/** Measures its own width and scales inner 794px content to fit. */
function Thumbnail({ id, accentColor, cv }: { id: TemplateId; accentColor: string; cv: CV }) {
  const ref = useRef<HTMLDivElement>(null)
  const [scale, setScale] = useState(0)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const ro = new ResizeObserver(([entry]) => {
      setScale(entry.contentRect.width / A4_WIDTH)
    })
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  return (
    <div ref={ref} className="tpl-picker__preview">
      <div
        className="tpl-picker__paper"
        style={{
          '--cv-font': DEFAULT_STYLE.fontFamily,
          '--cv-accent': accentColor,
          '--cv-font-size': '100%',
          transform: `scale(${scale})`,
        } as React.CSSProperties}
      >
        <Preview cv={cv} template={id} sectionOrder={DEFAULT_STYLE.sectionOrder} cvLanguage="en" />
      </div>
    </div>
  )
}

export function TemplatePicker({ selected, accentColor, cv, onSelect, onClose }: Props) {
  const { t } = useTranslation()

  const onKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') onClose()
  }, [onClose])

  useEffect(() => {
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [onKeyDown])

  function handleSelect(id: TemplateId) {
    onSelect(id)
    onClose()
  }

  return createPortal(
    <div className="tpl-picker-overlay" onClick={onClose}>
      <div className="tpl-picker" onClick={(e) => e.stopPropagation()}>
        <div className="tpl-picker__header">
          <h2 className="tpl-picker__title">{t('sidebar.chooseTemplate')}</h2>
          <button className="tpl-picker__close" onClick={onClose}>&#x2715;</button>
        </div>
        <div className="tpl-picker__grid">
          {TEMPLATE_IDS.map((id) => (
            <button
              key={id}
              className={`tpl-picker__card${selected === id ? ' tpl-picker__card--active' : ''}`}
              onClick={() => handleSelect(id)}
            >
              <Thumbnail id={id} accentColor={accentColor} cv={cv} />
              <div className="tpl-picker__label">{t(`templates.${id}.name`)}</div>
            </button>
          ))}
        </div>
      </div>
    </div>,
    document.body
  )
}
