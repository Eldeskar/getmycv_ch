import React from 'react'
import { CV, CVSectionId } from '../../../types/cv'
import { formatDate } from '../../../utils/formatDate'
import { formatPhone } from '../../../utils/formatPhone'
import { PlaceholderMap } from '../../../utils/placeholderCV'
import { CvPhoto } from '../CvPhoto'

interface Props { cv: CV; placeholders?: PlaceholderMap; sectionOrder: CVSectionId[] }

function formatBirthday(value: string): string {
  if (!value) return ''
  try {
    return new Date(value).toLocaleDateString('en', { day: 'numeric', month: 'long', year: 'numeric' })
  } catch {
    return value
  }
}

function fullAddress(cv: CV['personal']): string {
  const parts = [cv.address, [cv.zip, cv.city].filter(Boolean).join(' '), cv.country].filter(Boolean)
  return parts.join(', ')
}

export function ExecutiveTemplate({ cv, placeholders: p, sectionOrder }: Props) {
  const { personal, experience, education, skills, languages, certifications, interests } = cv

  const sections: Record<string, () => React.ReactNode> = {
    summary: () =>
      personal.summary ? (
        <div className={`cv-executive__section${p?.summary ? ' cv-placeholder' : ''}`}>
          <h2>Profile</h2>
          <p className="cv-executive__summary">{personal.summary}</p>
        </div>
      ) : null,

    experience: () =>
      experience.length > 0 ? (
        <div className={`cv-executive__section${p?.experience ? ' cv-placeholder' : ''}`}>
          <h2>Experience</h2>
          {experience.map((exp) => (
            <div key={exp.id} className="cv-executive__entry">
              <div className="cv-executive__entry-dates">
                {formatDate(exp.startDate)} –<br />
                {exp.current ? 'Present' : formatDate(exp.endDate)}
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
          <h2>Education</h2>
          {education.map((edu) => (
            <div key={edu.id} className="cv-executive__entry">
              <div className="cv-executive__entry-dates">
                {formatDate(edu.endDate)}
              </div>
              <div className="cv-executive__entry-content">
                <div className="cv-executive__entry-title">
                  <strong>{edu.degree}{edu.field ? ` in ${edu.field}` : ''}</strong>
                  <span className="cv-executive__at"> · {edu.institution}</span>
                </div>
                {edu.grade && <p className="cv-executive__desc">Grade: {edu.grade}</p>}
              </div>
            </div>
          ))}
        </div>
      ) : null,

    certifications: () =>
      certifications.length > 0 ? (
        <div className={`cv-executive__section${p?.certifications ? ' cv-placeholder' : ''}`}>
          <h2>Certifications</h2>
          {certifications.map((cert) => (
            <div key={cert.id} className="cv-executive__entry">
              <div className="cv-executive__entry-dates">
                {formatDate(cert.date)}
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
          <h2>Skills & Languages</h2>
          <div className="cv-executive__skills-grid">
            {skills.map((group) => (
              <div key={group.id} className="cv-executive__skill-row">
                {group.category && <strong>{group.category}: </strong>}
                <span>{group.items.join(', ')}</span>
              </div>
            ))}
            {languages.length > 0 && (
              <div className="cv-executive__skill-row">
                <strong>Languages: </strong>
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
          <h2>Interests</h2>
          <p className="cv-executive__desc">{interests.join(', ')}</p>
        </div>
      ) : null,

    projects: () => null,
  }

  return (
    <div className="cv-template cv-executive">
      {/* Header: photo + name/contact */}
      <div className="cv-executive__header" data-cv-section="personal">
        {personal.photo && (
          <CvPhoto personal={personal} className="cv-photo cv-executive__photo" />
        )}
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
          {personal.birthday && <span>Born: {formatBirthday(personal.birthday)}</span>}
          {personal.nationality && <span>Nationality: {personal.nationality}</span>}
          {personal.driversLicense && <span>Licence: {personal.driversLicense}</span>}
        </div>
      )}

      {sectionOrder.map((id) => {
        const render = sections[id]
        return render ? <div key={id} data-cv-section={id}>{render()}</div> : null
      })}
    </div>
  )
}
