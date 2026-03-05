import { useTranslation } from 'react-i18next'
import { SkillGroup, LanguageEntry } from '../../types/cv'
import { nanoid } from '../../utils/nanoid'
import { useDragReorder } from '../../hooks/useDragReorder'

interface Props {
  skills: SkillGroup[]
  languages: LanguageEntry[]
  interests: string[]
  onSkillsChange: (skills: SkillGroup[]) => void
  onLanguagesChange: (languages: LanguageEntry[]) => void
  onInterestsChange: (interests: string[]) => void
}

const LANGUAGE_LEVELS = ['Native', 'C2', 'C1', 'B2', 'B1', 'A2', 'A1']

export function SkillsSection({ skills, languages, interests, onSkillsChange, onLanguagesChange, onInterestsChange }: Props) {
  const { t } = useTranslation()
  const { dragHandlers: skillDragHandlers, handleProps: skillHandleProps } = useDragReorder(skills, onSkillsChange)
  const { dragHandlers: langDragHandlers, handleProps: langHandleProps } = useDragReorder(languages, onLanguagesChange)

  function addSkillGroup() {
    onSkillsChange([...skills, { id: nanoid(), category: '', items: [], levels: {} }])
  }

  function updateGroup(id: string, patch: Partial<SkillGroup>) {
    onSkillsChange(skills.map((g) => (g.id === id ? { ...g, ...patch } : g)))
  }

  function removeGroup(id: string) {
    onSkillsChange(skills.filter((g) => g.id !== id))
  }

  function updateItems(group: SkillGroup, raw: string) {
    updateGroup(group.id, { items: raw.split(',').map((s) => s.trim()) })
  }

  function cleanItems(group: SkillGroup) {
    updateGroup(group.id, { items: group.items.filter(Boolean) })
  }

  function updateSkillLevel(group: SkillGroup, skill: string, level: number) {
    updateGroup(group.id, { levels: { ...group.levels, [skill]: level } })
  }

  function addLanguage() {
    onLanguagesChange([...languages, { id: nanoid(), language: '', level: 'B2' }])
  }

  function updateLanguage(id: string, patch: Partial<LanguageEntry>) {
    onLanguagesChange(languages.map((l) => (l.id === id ? { ...l, ...patch } : l)))
  }

  function removeLanguage(id: string) {
    onLanguagesChange(languages.filter((l) => l.id !== id))
  }

  function updateInterests(raw: string) {
    onInterestsChange(raw.split(',').map((s) => s.trim()))
  }

  function cleanInterests() {
    onInterestsChange(interests.filter(Boolean))
  }

  return (
    <section className="editor-section">
      <h3 className="editor-section__title">{t('editor.skills.sectionTitle')}</h3>

      {skills.map((group, i) => (
        <div key={group.id} className="editor-card editor-card--compact" {...skillDragHandlers(i)}>
          <div className="editor-card__header">
            <span className="drag-handle" title="Drag to reorder" {...skillHandleProps()}>⠿</span>
            <div className="field" style={{ flex: 1 }}>
              <label>{t('editor.skills.category')}</label>
              <input
                type="text"
                placeholder={t('editor.skills.categoryPlaceholder')}
                value={group.category}
                onChange={(e) => updateGroup(group.id, { category: e.target.value })}
              />
            </div>
            <button className="btn-icon btn-danger" onClick={() => removeGroup(group.id)}>
              {t('editor.skills.remove')}
            </button>
          </div>
          <div className="field">
            <label>
              {t('editor.skills.items')}{' '}
              <span className="field__hint">{t('editor.skills.itemsHint')}</span>
            </label>
            <input
              type="text"
              placeholder={t('editor.skills.itemsPlaceholder')}
              value={group.items.join(', ')}
              onChange={(e) => updateItems(group, e.target.value)}
              onBlur={() => cleanItems(group)}
            />
          </div>
          {group.items.filter(Boolean).length > 0 && (
            <div className="skill-levels">
              <label className="skill-levels__label">
                {t('editor.skills.rating')} <span className="field__hint">(1-10)</span>
              </label>
              {group.items.filter(Boolean).map((skill) => (
                <div key={skill} className="skill-levels__row">
                  <span className="skill-levels__name">{skill}</span>
                  <input
                    type="range"
                    min={1}
                    max={10}
                    value={group.levels?.[skill] ?? 5}
                    onChange={(e) => updateSkillLevel(group, skill, Number(e.target.value))}
                  />
                  <span className="skill-levels__value">{group.levels?.[skill] ?? 5}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}

      <button className="btn-add-entry" onClick={addSkillGroup}>
        {t('editor.skills.addSkillGroup')}
      </button>

      <h3 className="editor-section__title" style={{ marginTop: '2rem' }}>
        {t('editor.skills.languagesTitle')}
      </h3>

      {languages.map((lang, i) => (
        <div key={lang.id} className="editor-card editor-card--compact" {...langDragHandlers(i)}>
          <div className="editor-card__header">
            <span className="drag-handle" title="Drag to reorder" {...langHandleProps()}>⠿</span>
            <span className="editor-card__index">{lang.language || t('editor.skills.language')}</span>
            <button className="btn-icon btn-danger" onClick={() => removeLanguage(lang.id)}>
              {t('editor.skills.remove')}
            </button>
          </div>
          <div className="field-row">
            <div className="field">
              <label>{t('editor.skills.language')}</label>
              <input
                type="text"
                placeholder={t('editor.skills.languagePlaceholder')}
                value={lang.language}
                onChange={(e) => updateLanguage(lang.id, { language: e.target.value })}
              />
            </div>
            <div className="field">
              <label>{t('editor.skills.level')}</label>
              <select
                value={lang.level}
                onChange={(e) => updateLanguage(lang.id, { level: e.target.value })}
              >
                {LANGUAGE_LEVELS.map((l) => (
                  <option key={l} value={l}>{l}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      ))}

      <button className="btn-add-entry" onClick={addLanguage}>
        {t('editor.skills.addLanguage')}
      </button>

      <h3 className="editor-section__title" style={{ marginTop: '2rem' }}>
        {t('editor.skills.interestsTitle')}
      </h3>

      <div className="field">
        <label>
          {t('editor.skills.interestsTitle')}{' '}
          <span className="field__hint">{t('editor.skills.itemsHint')}</span>
        </label>
        <input
          type="text"
          placeholder={t('editor.skills.interestsPlaceholder')}
          value={interests.join(', ')}
          onChange={(e) => updateInterests(e.target.value)}
          onBlur={cleanInterests}
        />
      </div>
    </section>
  )
}
