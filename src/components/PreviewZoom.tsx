import { useState, useCallback, useRef, useEffect } from 'react'
import { useTranslation } from 'react-i18next'

const ZOOM_STEP = 0.1
const ZOOM_MIN = 0.3
const ZOOM_MAX = 2.0

interface Props {
  children: React.ReactNode
  style?: React.CSSProperties
  id?: string
  className?: string
}

export function PreviewZoom({ children, style, id, className }: Props) {
  const { t } = useTranslation()
  const [zoom, setZoom] = useState<number | null>(null) // null = fit-to-screen
  const containerRef = useRef<HTMLDivElement>(null)
  const paperRef = useRef<HTMLDivElement>(null)
  const [paperHeight, setPaperHeight] = useState(1122)

  const computeFitZoom = useCallback(() => {
    const container = containerRef.current
    if (!container) return 0.5
    const gap = 32 // 16px top + 16px bottom
    const availH = container.clientHeight - gap
    const availW = container.clientWidth - gap
    // A4 in px at 96dpi: 210mm ≈ 793.7px, 297mm ≈ 1122.5px
    const paperW = 793.7
    const paper = paperRef.current
    const paperH = paper ? paper.scrollHeight : 1122.5
    return Math.min(availW / paperW, availH / paperH, 1)
  }, [])

  // On mount and resize, recompute fit zoom if in fit mode
  useEffect(() => {
    if (zoom !== null) return
    const ro = new ResizeObserver(() => {
      // Force re-render so the fit zoom recalculates
      setZoom(null)
    })
    if (containerRef.current) ro.observe(containerRef.current)
    return () => ro.disconnect()
  }, [zoom])

  // Track paper height so we can size the wrapper to match scaled dimensions
  useEffect(() => {
    const paper = paperRef.current
    if (!paper) return
    const ro = new ResizeObserver(([entry]) => {
      setPaperHeight(entry.borderBoxSize?.[0]?.blockSize ?? entry.contentRect.height)
    })
    ro.observe(paper)
    return () => ro.disconnect()
  }, [])

  const effectiveZoom = zoom ?? computeFitZoom()

  const zoomIn = () => setZoom(Math.min(Math.round((effectiveZoom + ZOOM_STEP) * 100) / 100, ZOOM_MAX))
  const zoomOut = () => setZoom(Math.max(Math.round((effectiveZoom - ZOOM_STEP) * 100) / 100, ZOOM_MIN))
  const fitToScreen = () => setZoom(null)

  const onPreviewClick = useCallback((e: React.MouseEvent) => {
    let el = e.target as HTMLElement | null
    while (el && !el.dataset.cvSection) {
      if (el.classList.contains('preview-paper')) break
      el = el.parentElement
    }
    if (el?.dataset.cvSection) {
      window.dispatchEvent(new CustomEvent('cv:edit-section', { detail: el.dataset.cvSection }))
    }
  }, [])

  return (
    <div className="preview-zoom-container" ref={containerRef}>
      <div
        className="preview-zoom-scroller"
        style={{ '--preview-zoom': effectiveZoom } as React.CSSProperties}
      >
        <div
          className="preview-zoom-sizer"
          style={{
            width: Math.ceil(793.7 * effectiveZoom),
            height: Math.ceil(paperHeight * effectiveZoom),
          }}
        >
          <div ref={paperRef} id={id} style={style} className={`preview-paper preview-interactive${className ? ` ${className}` : ''}`} onClick={onPreviewClick}>
            {children}
          </div>
        </div>
      </div>

      <div className="preview-zoom-controls">
        <button onClick={zoomOut} disabled={effectiveZoom <= ZOOM_MIN} title={t('preview.zoomOut')}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M4 7h8v2H4z"/></svg>
        </button>
        <button onClick={fitToScreen} title={t('preview.fitToScreen')} className={zoom === null ? 'active' : ''}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M2 2h4v1.5H3.5V6H2V2zm8 0h4v4h-1.5V3.5H10V2zM2 10h1.5v2.5H6V14H2v-4zm10 2.5V10h1.5v4h-4v-1.5H12z"/></svg>
        </button>
        <button onClick={zoomIn} disabled={effectiveZoom >= ZOOM_MAX} title={t('preview.zoomIn')}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M7 4h2v3h3v2H9v3H7V9H4V7h3z"/></svg>
        </button>
        <span className="preview-zoom-controls__level">{Math.round(effectiveZoom * 100)}%</span>
      </div>
    </div>
  )
}
