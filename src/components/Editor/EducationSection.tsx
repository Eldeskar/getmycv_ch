import { useTranslation } from 'react-i18next'
import { EducationEntry, CertificationEntry } from '../../types/cv'
import { nanoid } from '../../utils/nanoid'
import { useDragReorder } from '../../hooks/useDragReorder'

interface Props {
  data: EducationEntry[]
  certifications: CertificationEntry[]
  onChange: (data: EducationEntry[]) => void
  onCertificationsChange: (data: CertificationEntry[]) => void
}

function emptyEntry(): EducationEntry {
  return {
    id: nanoid(),
    institution: '',
    degree: '',
    field: '',
    startDate: '',
    endDate: '',
    grade: '',
  }
}

function emptyCert(): CertificationEntry {
  return {
    id: nanoid(),
    title: '',
    institution: '',
    date: '',
    description: '',
  }
}

export function EducationSection({ data, certifications, onChange, onCertificationsChange }: Props) {
  const { t } = useTranslation()
  const { dragHandlers: eduDragHandlers, handleProps: eduHandleProps } = useDragReorder(data, onChange)
  const { dragHandlers: certDragHandlers, handleProps: certHandleProps } = useDragReorder(certifications, onCertificationsChange)

  function update(id: string, patch: Partial<EducationEntry>) {
    onChange(data.map((e) => (e.id === id ? { ...e, ...patch } : e)))
  }

  function remove(id: string) {
    onChange(data.filter((e) => e.id !== id))
  }

  function updateCert(id: string, patch: Partial<CertificationEntry>) {
    onCertificationsChange(certifications.map((c) => (c.id === id ? { ...c, ...patch } : c)))
  }

  function removeCert(id: string) {
    onCertificationsChange(certifications.filter((c) => c.id !== id))
  }

  return (
    <section className="editor-section">
      <h3 className="editor-section__title">{t('editor.education.sectionTitle')}</h3>

      {data.map((entry, i) => (
        <div key={entry.id} className="editor-card" {...eduDragHandlers(i)}>
          <div className="editor-card__header">
            <span className="drag-handle" title="Drag to reorder" {...eduHandleProps()}>⠿</span>
            <span className="editor-card__index">#{i + 1}</span>
            <button className="btn-icon btn-danger" onClick={() => remove(entry.id)}>
              {t('editor.education.remove')}
            </button>
          </div>

          <div className="field">
            <label>{t('editor.education.institution')}</label>
            <input
              type="text"
              placeholder={t('editor.education.institutionPlaceholder')}
              value={entry.institution}
              onChange={(e) => update(entry.id, { institution: e.target.value })}
            />
          </div>

          <div className="field-row">
            <div className="field">
              <label>{t('editor.education.degree')}</label>
              <input
                type="text"
                placeholder={t('editor.education.degreePlaceholder')}
                value={entry.degree}
                onChange={(e) => update(entry.id, { degree: e.target.value })}
              />
            </div>
            <div className="field">
              <label>{t('editor.education.field')}</label>
              <input
                type="text"
                placeholder={t('editor.education.fieldPlaceholder')}
                value={entry.field}
                onChange={(e) => update(entry.id, { field: e.target.value })}
              />
            </div>
          </div>

          <div className="field-row">
            <div className="field">
              <label>{t('editor.education.startDate')}</label>
              <input
                type="month"
                value={entry.startDate}
                onChange={(e) => update(entry.id, { startDate: e.target.value })}
              />
            </div>
            <div className="field">
              <label>{t('editor.education.endDate')}</label>
              <input
                type="month"
                value={entry.endDate}
                onChange={(e) => update(entry.id, { endDate: e.target.value })}
              />
            </div>
          </div>

          <div className="field">
            <label>{t('editor.education.grade')}</label>
            <input
              type="text"
              placeholder={t('editor.education.gradePlaceholder')}
              value={entry.grade}
              onChange={(e) => update(entry.id, { grade: e.target.value })}
            />
          </div>
        </div>
      ))}

      <button className="btn-add-entry" onClick={() => onChange([...data, emptyEntry()])}>
        {t('editor.education.addEntry')}
      </button>

      <h3 className="editor-section__title" style={{ marginTop: '2rem' }}>
        {t('editor.education.certificationsTitle')}
      </h3>

      {certifications.map((cert, i) => (
        <div key={cert.id} className="editor-card" {...certDragHandlers(i)}>
          <div className="editor-card__header">
            <span className="drag-handle" title="Drag to reorder" {...certHandleProps()}>⠿</span>
            <span className="editor-card__index">#{i + 1}</span>
            <button className="btn-icon btn-danger" onClick={() => removeCert(cert.id)}>
              {t('editor.education.remove')}
            </button>
          </div>

          <div className="field">
            <label>{t('editor.education.certTitle')}</label>
            <input
              type="text"
              placeholder={t('editor.education.certTitlePlaceholder')}
              value={cert.title}
              onChange={(e) => updateCert(cert.id, { title: e.target.value })}
            />
          </div>

          <div className="field-row">
            <div className="field">
              <label>{t('editor.education.certInstitution')}</label>
              <input
                type="text"
                placeholder={t('editor.education.certInstitutionPlaceholder')}
                value={cert.institution}
                onChange={(e) => updateCert(cert.id, { institution: e.target.value })}
              />
            </div>
            <div className="field">
              <label>{t('editor.education.certDate')}</label>
              <input
                type="month"
                value={cert.date}
                onChange={(e) => updateCert(cert.id, { date: e.target.value })}
              />
            </div>
          </div>

          <div className="field">
            <label>{t('editor.education.certDescription')}</label>
            <input
              type="text"
              placeholder={t('editor.education.certDescriptionPlaceholder')}
              value={cert.description}
              onChange={(e) => updateCert(cert.id, { description: e.target.value })}
            />
          </div>
        </div>
      ))}

      <button className="btn-add-entry" onClick={() => onCertificationsChange([...certifications, emptyCert()])}>
        {t('editor.education.addCertification')}
      </button>
    </section>
  )
}
