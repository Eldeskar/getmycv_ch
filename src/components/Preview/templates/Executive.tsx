import React from 'react'
import { CVSectionId } from '../../../types/cv'
import { ResolvedCV } from '../../../utils/resolveCV'
import { formatDate } from '../../../utils/formatDate'
import { formatPhone } from '../../../utils/formatPhone'
import { PlaceholderMap } from '../../../utils/placeholderCV'
import { CVLabels } from '../../../utils/cvLabels'
import { CvPhoto } from '../CvPhoto'

interface Props { cv: ResolvedCV; placeholders?: PlaceholderMap; sectionOrder: CVSectionId[]; labels: CVLabels; locale: string }

function formatBirthday(value: string, locale: string): string {
  if (!value) return ''
  try {
    return new Date(value).toLocaleDateString(locale, { day: 'numeric', month: 'long', year: 'numeric' })
  } catch {
    return value
  }
}

function fullAddress(cv: ResolvedCV['personal']): string {
  const parts = [cv.address, [cv.zip, cv.city].filter(Boolean).join(' '), cv.country].filter(Boolean)
  return parts.join(', ')
}

export function ExecutiveTemplate({ cv, placeholders: p, sectionOrder, labels, locale }: Props) {
  const { personal, experience, education, skills, languages, certifications, interests } = cv

  const sections: Record<string, () => React.ReactNode> = {
    summary: () =>
      personal.summary ? (
        <div className={`cv-executive__section${p?.summary ? ' cv-placeholder' : ''}`}>
          <h2>{labels.profile}</h2>
          <p className="cv-executive__summary">{personal.summary}</p>
        </div>
      ) : null,

    experience: () =>
      experience.length > 0 ? (
        <div className={`cv-executive__section${p?.experience ? ' cv-placeholder' : ''}`}>
          <h2>{labels.experience}</h2>
          {experience.map((exp) => (
            <div key={exp.id} className="cv-executive__entry">
              <div className="cv-executive__entry-dates">
                {formatDate(exp.startDate, locale)} –<br />
                {exp.current ? labels.present : formatDate(exp.endDate, locale)}
              </div>
              <div className="cv-executive__entry-content">
                <div className="cv-executive__entry-title">
                  <strong>{exp.role}</strong>
                  <span className="cv-executive__at"> · {exp.company}</span>
                  {exp.location && <span className="cv-executive__location">, {exp.location}</span>}
                </div>
                {exp.bullets.filter(Boolean).length > 0 && (
                  <ul className="cv-executive__bullets">
                    {exp.bullets.filter(Boolean).map((b, i) => <li key={i}>{b}</li>)}
                  </ul>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : null,

    education: () =>
      education.length > 0 ? (
        <div className={`cv-executive__section${p?.education ? ' cv-placeholder' : ''}`}>
          <h2>{labels.education}</h2>
          {education.map((edu) => (
            <div key={edu.id} className="cv-executive__entry">
              <div className="cv-executive__entry-dates">
                {formatDate(edu.endDate, locale)}
              </div>
              <div className="cv-executive__entry-content">
                <div className="cv-executive__entry-title">
                  <strong>{edu.degree}{edu.field ? ` in ${edu.field}` : ''}</strong>
                  <span className="cv-executive__at"> · {edu.institution}</span>
                </div>
                {edu.grade && <p className="cv-executive__desc">{labels.grade}: {edu.grade}</p>}
              </div>
            </div>
          ))}
        </div>
      ) : null,

    certifications: () =>
      certifications.length > 0 ? (
        <div className={`cv-executive__section${p?.certifications ? ' cv-placeholder' : ''}`}>
          <h2>{labels.certifications}</h2>
          {certifications.map((cert) => (
            <div key={cert.id} className="cv-executive__entry">
              <div className="cv-executive__entry-dates">
                {formatDate(cert.date, locale)}
              </div>
              <div className="cv-executive__entry-content">
                <div className="cv-executive__entry-title">
                  <strong>{cert.title}</strong>
                  {cert.institution && <span className="cv-executive__at"> · {cert.institution}</span>}
                </div>
                {cert.description && <p className="cv-executive__desc">{cert.description}</p>}
              </div>
            </div>
          ))}
        </div>
      ) : null,

    skills: () =>
      (skills.length > 0 || languages.length > 0) ? (
        <div className={`cv-executive__section${p?.skills && p?.languages ? ' cv-placeholder' : ''}`}>
          <h2>{labels.skillsAndLanguages}</h2>
          <div className="cv-executive__skills-grid">
            {skills.map((group) => (
              <div key={group.id} className="cv-executive__skill-row">
                {group.category && <strong>{group.category}: </strong>}
                <span>{group.items.join(', ')}</span>
              </div>
            ))}
            {languages.length > 0 && (
              <div className="cv-executive__skill-row">
                <strong>{labels.languages}: </strong>
                <span>{languages.map((l) => `${l.language} (${l.level})`).join(', ')}</span>
              </div>
            )}
          </div>
        </div>
      ) : null,

    languages: () => null,

    interests: () =>
      interests.length > 0 ? (
        <div className={`cv-executive__section${p?.interests ? ' cv-placeholder' : ''}`}>
          <h2>{labels.interests}</h2>
          <p className="cv-executive__desc">{interests.join(', ')}</p>
        </div>
      ) : null,

    projects: () => null,
  }

  return (
    <div className="cv-template cv-executive">
      {/* Header: photo + name/contact */}
      <div className="cv-executive__header" data-cv-section="personal">
        <CvPhoto personal={personal} className="cv-photo cv-executive__photo" />
        <div className="cv-executive__header-text">
          {personal.name && <h1 className={p?.name ? 'cv-placeholder' : ''}>{personal.name}</h1>}
          {personal.title && <div className={`cv-executive__subtitle${p?.title ? ' cv-placeholder' : ''}`}>{personal.title}</div>}
          <div className={`cv-executive__contact${p?.contact ? ' cv-placeholder' : ''}`}>
            {personal.email && <span>{personal.email}</span>}
            {personal.phone && <span>{formatPhone(personal.phone)}</span>}
            {fullAddress(personal) && <span>{fullAddress(personal)}</span>}
            {personal.website && (
              <a href={personal.website} target="_blank" rel="noreferrer">
                {personal.website.replace(/^https?:\/\//, '')}
              </a>
            )}
            {personal.linkedin && (
              <a href={personal.linkedin} target="_blank" rel="noreferrer">LinkedIn</a>
            )}
          </div>
        </div>
      </div>

      <hr className="cv-executive__rule" />

      {/* Details bar */}
      {(personal.birthday || personal.nationality || personal.driversLicense) && (
        <div className="cv-executive__details">
          {personal.birthday && <span>{labels.born}: {formatBirthday(personal.birthday, locale)}</span>}
          {personal.nationality && <span>{labels.nationality}: {personal.nationality}</span>}
          {personal.driversLicense && <span>{labels.licence}: {personal.driversLicense}</span>}
        </div>
      )}

      {sectionOrder.map((id) => {
        const render = sections[id]
        return render ? <div key={id} data-cv-section={id}>{render()}</div> : null
      })}
    </div>
  )
}
