import { useTranslation } from 'react-i18next'
import { ExperienceEntry, CVLanguage } from '../../types/cv'
import { ls, setLs, lsa, setLsa } from '../../utils/resolveCV'
import { nanoid } from '../../utils/nanoid'
import { useDragReorder } from '../../hooks/useDragReorder'

interface Props {
  data: ExperienceEntry[]
  lang: CVLanguage
  onChange: (data: ExperienceEntry[]) => void
}

function emptyEntry(): ExperienceEntry {
  return {
    id: nanoid(),
    company: '',
    role: {},
    location: '',
    startDate: '',
    endDate: '',
    current: false,
    bullets: {},
  }
}

export function ExperienceSection({ data, lang, onChange }: Props) {
  const { t } = useTranslation()
  const { dragHandlers, handleProps } = useDragReorder(data, onChange)

  function update(id: string, patch: Partial<ExperienceEntry>) {
    onChange(data.map((e) => (e.id === id ? { ...e, ...patch } : e)))
  }

  function remove(id: string) {
    onChange(data.filter((e) => e.id !== id))
  }

  function addEntry() {
    onChange([...data, emptyEntry()])
  }

  function getBullets(entry: ExperienceEntry): string[] {
    const b = lsa(entry.bullets, lang)
    return b.length > 0 ? b : ['']
  }

  function updateBullet(entry: ExperienceEntry, index: number, value: string) {
    const bullets = [...getBullets(entry)]
    bullets[index] = value
    update(entry.id, { bullets: setLsa(entry.bullets, lang, bullets) })
  }

  function addBullet(entry: ExperienceEntry) {
    update(entry.id, { bullets: setLsa(entry.bullets, lang, [...getBullets(entry), '']) })
  }

  function removeBullet(entry: ExperienceEntry, index: number) {
    const bullets = getBullets(entry).filter((_, i) => i !== index)
    update(entry.id, { bullets: setLsa(entry.bullets, lang, bullets.length ? bullets : ['']) })
  }

  return (
    <section className="editor-section">
      <h3 className="editor-section__title">{t('editor.experience.sectionTitle')}</h3>

      {data.map((entry, i) => (
        <div key={entry.id} className="editor-card" {...dragHandlers(i)}>
          <div className="editor-card__header">
            <span className="drag-handle" title="Drag to reorder" {...handleProps()}>⠿</span>
            <span className="editor-card__index">#{i + 1}</span>
            <button className="btn-icon btn-danger" onClick={() => remove(entry.id)}>
              {t('editor.experience.remove')}
            </button>
          </div>

          <div className="field-row">
            <div className="field">
              <label>{t('editor.experience.jobTitle')}</label>
              <input
                type="text"
                placeholder={t('editor.experience.jobTitlePlaceholder')}
                value={ls(entry.role, lang)}
                onChange={(e) => update(entry.id, { role: setLs(entry.role, lang, e.target.value) })}
              />
            </div>
            <div className="field">
              <label>{t('editor.experience.company')}</label>
              <input
                type="text"
                placeholder={t('editor.experience.companyPlaceholder')}
                value={entry.company}
                onChange={(e) => update(entry.id, { company: e.target.value })}
              />
            </div>
          </div>

          <div className="field">
            <label>{t('editor.experience.location')}</label>
            <input
              type="text"
              placeholder={t('editor.experience.locationPlaceholder')}
              value={entry.location}
              onChange={(e) => update(entry.id, { location: e.target.value })}
            />
          </div>

          <div className="field-row">
            <div className="field">
              <label>{t('editor.experience.startDate')}</label>
              <input
                type="month"
                value={entry.startDate}
                onChange={(e) => update(entry.id, { startDate: e.target.value })}
              />
            </div>
            <div className="field">
              <label>{t('editor.experience.endDate')}</label>
              <input
                type="month"
                value={entry.endDate}
                disabled={entry.current}
                onChange={(e) => update(entry.id, { endDate: e.target.value })}
              />
            </div>
          </div>

          <div className="field field--checkbox">
            <label>
              <input
                type="checkbox"
                checked={entry.current}
                onChange={(e) => update(entry.id, { current: e.target.checked, endDate: '' })}
              />
              {t('editor.experience.current')}
            </label>
          </div>

          <div className="field">
            <label>{t('editor.experience.bullets')}</label>
            {getBullets(entry).map((bullet, bi) => (
              <div key={bi} className="bullet-row">
                <span className="bullet-dot">•</span>
                <input
                  type="text"
                  placeholder={t('editor.experience.bulletPlaceholder')}
                  value={bullet}
                  onChange={(e) => updateBullet(entry, bi, e.target.value)}
                />
                {getBullets(entry).length > 1 && (
                  <button
                    className="btn-icon btn-danger"
                    onClick={() => removeBullet(entry, bi)}
                  >
                    {t('editor.experience.remove')}
                  </button>
                )}
              </div>
            ))}
            <button className="btn-add-bullet" onClick={() => addBullet(entry)}>
              {t('editor.experience.addBullet')}
            </button>
          </div>
        </div>
      ))}

      <button className="btn-add-entry" onClick={addEntry}>
        {t('editor.experience.addEntry')}
      </button>
    </section>
  )
}
