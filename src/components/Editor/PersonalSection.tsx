import { useRef, useState, useCallback } from 'react'
import { createPortal } from 'react-dom'
import { useTranslation } from 'react-i18next'
import { PersonalInfo, CVLanguage } from '../../types/cv'
import { ls, setLs } from '../../utils/resolveCV'
import { compressImage } from '../../utils/imageUtils'

interface Props {
  data: PersonalInfo
  lang: CVLanguage
  onChange: (data: PersonalInfo) => void
}

export function PersonalSection({ data, lang, onChange }: Props) {
  const { t } = useTranslation()
  const [photoError, setPhotoError] = useState('')
  const [photoLoading, setPhotoLoading] = useState(false)
  const [editing, setEditing] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Temp state while editing in the overlay — only committed on "Done"
  const [tempZoom, setTempZoom] = useState(1)
  const [tempOffX, setTempOffX] = useState(0)
  const [tempOffY, setTempOffY] = useState(0)
  const [tempGrayscale, setTempGrayscale] = useState(false)

  const dragging = useRef(false)
  const dragStart = useRef({ x: 0, y: 0, ox: 0, oy: 0 })

  function set<K extends keyof PersonalInfo>(key: K, value: PersonalInfo[K]) {
    onChange({ ...data, [key]: value })
  }

  function setMulti(patch: Partial<PersonalInfo>) {
    onChange({ ...data, ...patch })
  }

  async function handlePhotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setPhotoError('')
    setPhotoLoading(true)
    try {
      const compressed = await compressImage(file)
      setMulti({ photo: compressed, photoZoom: 1, photoOffsetX: 0, photoOffsetY: 0 })
    } catch {
      setPhotoError(t('editor.personal.photoError'))
    } finally {
      setPhotoLoading(false)
      e.target.value = ''
    }
  }

  function removePhoto() {
    setMulti({ photo: '', photoZoom: 1, photoOffsetX: 0, photoOffsetY: 0 })
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  function openEditor() {
    setTempZoom(data.photoZoom)
    setTempOffX(data.photoOffsetX)
    setTempOffY(data.photoOffsetY)
    setTempGrayscale(data.photoGrayscale)
    setEditing(true)
  }

  function saveEditor() {
    setMulti({ photoZoom: tempZoom, photoOffsetX: tempOffX, photoOffsetY: tempOffY, photoGrayscale: tempGrayscale })
    setEditing(false)
  }

  function cancelEditor() {
    setEditing(false)
  }

  // Drag to reposition using object-position
  const onPointerDown = useCallback((e: React.PointerEvent) => {
    e.preventDefault()
    dragging.current = true
    dragStart.current = { x: e.clientX, y: e.clientY, ox: tempOffX, oy: tempOffY }
    ;(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId)
  }, [tempOffX, tempOffY])

  const onPointerMove = useCallback((e: React.PointerEvent) => {
    if (!dragging.current) return
    const dx = e.clientX - dragStart.current.x
    const dy = e.clientY - dragStart.current.y
    const cropSize = 200
    const pxToPct = 100 / (cropSize * tempZoom)
    // Clamp so the image edge never enters the visible circle
    const maxOff = tempZoom > 1 ? 50 : 0
    setTempOffX(clamp(dragStart.current.ox + dx * pxToPct, -maxOff, maxOff))
    setTempOffY(clamp(dragStart.current.oy + dy * pxToPct, -maxOff, maxOff))
  }, [tempZoom])

  const onPointerUp = useCallback(() => {
    dragging.current = false
  }, [])

  // The image is sized to zoom*100% of the container and centered via margins.
  // object-position then shifts which part of the source image is visible.
  const imgStyle = (ox: number, oy: number, zoom: number, grayscale: boolean): React.CSSProperties => ({
    width: `${zoom * 100}%`,
    height: `${zoom * 100}%`,
    marginLeft: `${(1 - zoom) * 50 + ox * (zoom - 1)}%`,
    marginTop: `${(1 - zoom) * 50 + oy * (zoom - 1)}%`,
    objectFit: 'cover' as const,
    filter: grayscale ? 'grayscale(100%)' : undefined,
  })

  return (
    <section className="editor-section">
      <h3 className="editor-section__title">{t('editor.personal.sectionTitle')}</h3>

      {/* ── Photo ── */}
      {data.photo ? (
        <div className="photo-inline">
          <div className="photo-inline__preview" onClick={openEditor}>
            <img
              src={data.photo}
              alt=""
              style={imgStyle(data.photoOffsetX, data.photoOffsetY, data.photoZoom, data.photoGrayscale)}
            />
          </div>
          <div className="photo-inline__actions">
            <button className="btn-upload" type="button" onClick={openEditor}>
              {t('editor.personal.editPhoto')}
            </button>
            <label className="btn-upload">
              {photoLoading ? t('editor.personal.photoLoading') : t('editor.personal.changePhoto')}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handlePhotoChange}
                style={{ display: 'none' }}
              />
            </label>
            <button className="btn-icon btn-danger" onClick={removePhoto}>
              {t('editor.personal.removePhoto')}
            </button>
          </div>
        </div>
      ) : (
        <div className="photo-upload">
          <label className="photo-upload__dropzone">
            <span className="photo-upload__icon">+</span>
            <span>{photoLoading ? t('editor.personal.photoLoading') : t('editor.personal.uploadPhoto')}</span>
            <span className="photo-upload__hint">{t('editor.personal.photoHint')}</span>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handlePhotoChange}
              style={{ display: 'none' }}
            />
          </label>
        </div>
      )}
      {photoError && <span className="field-error">{photoError}</span>}

      {/* ── Photo editor overlay (portaled to body) ── */}
      {editing && createPortal(
        <div className="photo-overlay" onClick={cancelEditor}>
          <div className="photo-overlay__panel" onClick={(e) => e.stopPropagation()}>
            <div
              className="photo-overlay__crop"
              onPointerDown={onPointerDown}
              onPointerMove={onPointerMove}
              onPointerUp={onPointerUp}
            >
              <img
                src={data.photo}
                alt=""
                draggable={false}
                style={imgStyle(tempOffX, tempOffY, tempZoom, tempGrayscale)}
              />
            </div>
            <div className="photo-overlay__hint">{t('editor.personal.dragToReposition')}</div>
            <div className="photo-zoom">
              <input
                type="range"
                min={1}
                max={2.5}
                step={0.05}
                value={tempZoom}
                onChange={(e) => setTempZoom(Number(e.target.value))}
              />
              <span className="photo-zoom__value">{Math.round(tempZoom * 100)}%</span>
            </div>
            <label className="photo-overlay__toggle">
              <input
                type="checkbox"
                checked={tempGrayscale}
                onChange={(e) => setTempGrayscale(e.target.checked)}
              />
              {t('editor.personal.blackAndWhite')}
            </label>
            <div className="photo-overlay__buttons">
              <button className="btn-upload" onClick={saveEditor}>{t('editor.personal.photoDone')}</button>
              <button className="btn-icon" onClick={cancelEditor}>{t('editor.personal.photoCancel')}</button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* ── Identity ── */}
      <div className="field">
        <label htmlFor="personal-name">{t('editor.personal.name')}</label>
        <input
          id="personal-name"
          type="text"
          placeholder={t('editor.personal.namePlaceholder')}
          value={data.name}
          onChange={(e) => set('name', e.target.value)}
        />
      </div>

      <div className="field">
        <label htmlFor="personal-title">{t('editor.personal.title')}</label>
        <input
          id="personal-title"
          type="text"
          placeholder={t('editor.personal.titlePlaceholder')}
          value={ls(data.title, lang)}
          onChange={(e) => set('title', setLs(data.title, lang, e.target.value))}
        />
      </div>

      {/* ── Contact ── */}
      <div className="field-group">
        <div className="field-group__label">{t('editor.personal.groupContact')}</div>
        <div className="field-row">
          <div className="field">
            <label htmlFor="personal-email">{t('editor.personal.email')}</label>
            <input
              id="personal-email"
              type="email"
              placeholder={t('editor.personal.emailPlaceholder')}
              value={data.email}
              onChange={(e) => set('email', e.target.value)}
            />
          </div>
          <div className="field">
            <label htmlFor="personal-phone">{t('editor.personal.phone')}</label>
            <input
              id="personal-phone"
              type="tel"
              placeholder={t('editor.personal.phonePlaceholder')}
              value={data.phone}
              onChange={(e) => set('phone', e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* ── Address ── */}
      <div className="field-group">
        <div className="field-group__label">{t('editor.personal.groupAddress')}</div>
        <div className="field">
          <label htmlFor="personal-address">{t('editor.personal.address')}</label>
          <input
            id="personal-address"
            type="text"
            placeholder={t('editor.personal.addressPlaceholder')}
            value={data.address}
            onChange={(e) => set('address', e.target.value)}
          />
        </div>

        <div className="field-row">
          <div className="field field--zip">
            <label htmlFor="personal-zip">{t('editor.personal.zip')}</label>
            <input
              id="personal-zip"
              type="text"
              placeholder={t('editor.personal.zipPlaceholder')}
              value={data.zip}
              onChange={(e) => set('zip', e.target.value)}
            />
          </div>
          <div className="field">
            <label htmlFor="personal-city">{t('editor.personal.city')}</label>
            <input
              id="personal-city"
              type="text"
              placeholder={t('editor.personal.cityPlaceholder')}
              value={data.city}
              onChange={(e) => set('city', e.target.value)}
            />
          </div>
        </div>

        <div className="field">
          <label htmlFor="personal-country">{t('editor.personal.country')}</label>
          <input
            id="personal-country"
            type="text"
            placeholder={t('editor.personal.countryPlaceholder')}
            value={data.country}
            onChange={(e) => set('country', e.target.value)}
          />
        </div>
      </div>

      {/* ── Online ── */}
      <div className="field-group">
        <div className="field-group__label">{t('editor.personal.groupOnline')}</div>
        <div className="field-row">
          <div className="field">
            <label htmlFor="personal-website">{t('editor.personal.website')}</label>
            <input
              id="personal-website"
              type="url"
              placeholder={t('editor.personal.websitePlaceholder')}
              value={data.website}
              onChange={(e) => set('website', e.target.value)}
            />
          </div>
          <div className="field">
            <label htmlFor="personal-linkedin">{t('editor.personal.linkedin')}</label>
            <input
              id="personal-linkedin"
              type="url"
              placeholder={t('editor.personal.linkedinPlaceholder')}
              value={data.linkedin}
              onChange={(e) => set('linkedin', e.target.value)}
            />
          </div>
        </div>

        <div className="field">
          <label htmlFor="personal-github">{t('editor.personal.github')}</label>
          <input
            id="personal-github"
            type="url"
            placeholder={t('editor.personal.githubPlaceholder')}
            value={data.github}
            onChange={(e) => set('github', e.target.value)}
          />
        </div>
      </div>

      {/* ── Personal details ── */}
      <div className="field-group">
        <div className="field-group__label">{t('editor.personal.groupDetails')}</div>
        <div className="field-row">
          <div className="field">
            <label htmlFor="personal-birthday">{t('editor.personal.birthday')}</label>
            <input
              id="personal-birthday"
              type="date"
              value={data.birthday}
              onChange={(e) => set('birthday', e.target.value)}
            />
          </div>
          <div className="field">
            <label htmlFor="personal-nationality">{t('editor.personal.nationality')}</label>
            <input
              id="personal-nationality"
              type="text"
              placeholder={t('editor.personal.nationalityPlaceholder')}
              value={data.nationality}
              onChange={(e) => set('nationality', e.target.value)}
            />
          </div>
        </div>

        <div className="field">
          <label htmlFor="personal-license">{t('editor.personal.driversLicense')}</label>
          <input
            id="personal-license"
            type="text"
            placeholder={t('editor.personal.driversLicensePlaceholder')}
            value={data.driversLicense}
            onChange={(e) => set('driversLicense', e.target.value)}
          />
        </div>
      </div>

      {/* ── Summary ── */}
      <div className="field">
        <label htmlFor="personal-summary">{t('editor.personal.summary')}</label>
        <textarea
          id="personal-summary"
          rows={4}
          placeholder={t('editor.personal.summaryPlaceholder')}
          value={ls(data.summary, lang)}
          onChange={(e) => set('summary', setLs(data.summary, lang, e.target.value))}
        />
      </div>
    </section>
  )
}

function clamp(v: number, min: number, max: number) {
  return Math.max(min, Math.min(max, v))
}
