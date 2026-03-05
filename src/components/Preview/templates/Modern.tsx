import React from 'react'
import { CV, CVSectionId } from '../../../types/cv'
import { formatDate } from '../../../utils/formatDate'
import { formatPhone } from '../../../utils/formatPhone'
import { PlaceholderMap } from '../../../utils/placeholderCV'
import { CvPhoto } from '../CvPhoto'

interface Props { cv: CV; placeholders?: PlaceholderMap; sectionOrder: CVSectionId[] }

function cityCountry(city: string, country: string): string {
  return [city, country].filter(Boolean).join(', ')
}

function formatBirthday(value: string): string {
  if (!value) return ''
  try {
    return new Date(value).toLocaleDateString('en', { day: 'numeric', month: 'long', year: 'numeric' })
  } catch {
    return value
  }
}

export function ModernTemplate({ cv, placeholders: p, sectionOrder }: Props) {
  const { personal, experience, education, skills, languages, certifications, interests } = cv
  const location = cityCountry(personal.city, personal.country)

  const mainSections: Record<string, () => React.ReactNode> = {
    summary: () =>
      personal.summary ? (
        <div className={`cv-section${p?.summary ? ' cv-placeholder' : ''}`}>
          <h2>Profile</h2>
          <p>{personal.summary}</p>
        </div>
      ) : null,

    experience: () =>
      experience.length > 0 ? (
        <div className={`cv-section${p?.experience ? ' cv-placeholder' : ''}`}>
          <h2>Experience</h2>
          {experience.map((exp) => (
            <div key={exp.id} className="cv-entry">
              <div className="cv-entry__header">
                <div>
                  <strong>{exp.role}</strong>
                  <span className="cv-entry__company"> · {exp.company}</span>
                  {exp.location && <span className="cv-entry__location"> — {exp.location}</span>}
                </div>
                <span className="cv-entry__dates">
                  {formatDate(exp.startDate)} – {exp.current ? 'Present' : formatDate(exp.endDate)}
                </span>
              </div>
              {exp.bullets.filter(Boolean).length > 0 && (
                <ul className="cv-bullets">
                  {exp.bullets.filter(Boolean).map((b, i) => <li key={i}>{b}</li>)}
                </ul>
              )}
            </div>
          ))}
        </div>
      ) : null,

    education: () =>
      education.length > 0 ? (
        <div className={`cv-section${p?.education ? ' cv-placeholder' : ''}`}>
          <h2>Education</h2>
          {education.map((edu) => (
            <div key={edu.id} className="cv-entry">
              <div className="cv-entry__header">
                <div>
                  <strong>{edu.degree}{edu.field ? ` in ${edu.field}` : ''}</strong>
                  <span className="cv-entry__company"> · {edu.institution}</span>
                </div>
                <span className="cv-entry__dates">{formatDate(edu.endDate)}</span>
              </div>
              {edu.grade && <p className="cv-entry__grade">Grade: {edu.grade}</p>}
            </div>
          ))}
        </div>
      ) : null,

    certifications: () =>
      certifications.length > 0 ? (
        <div className={`cv-section${p?.certifications ? ' cv-placeholder' : ''}`}>
          <h2>Certifications</h2>
          {certifications.map((cert) => (
            <div key={cert.id} className="cv-entry">
              <div className="cv-entry__header">
                <div>
                  <strong>{cert.title}</strong>
                  {cert.institution && <span className="cv-entry__company"> · {cert.institution}</span>}
                </div>
                <span className="cv-entry__dates">{formatDate(cert.date)}</span>
              </div>
              {cert.description && <p className="cv-entry__grade">{cert.description}</p>}
            </div>
          ))}
        </div>
      ) : null,
  }

  return (
    <div className="cv-template cv-modern">
      <div className="cv-modern__sidebar" data-cv-section="personal">
        {personal.photo && (
          <CvPhoto personal={personal} className="cv-photo cv-modern__photo" />
        )}

        <div className="cv-modern__name-block">
          {personal.name && <h1 className={p?.name ? 'cv-placeholder' : ''}>{personal.name}</h1>}
          {personal.title && <div className={`cv-modern__job-title${p?.title ? ' cv-placeholder' : ''}`}>{personal.title}</div>}
        </div>

        <div className={`cv-modern__contact${p?.contact ? ' cv-placeholder' : ''}`}>
          {personal.email && <a href={`mailto:${personal.email}`}>{personal.email}</a>}
          {personal.phone && <span>{formatPhone(personal.phone)}</span>}
          {location && <span>{location}</span>}
          {personal.website && (
            <a href={personal.website} target="_blank" rel="noreferrer">
              {personal.website.replace(/^https?:\/\//, '')}
            </a>
          )}
          {personal.linkedin && (
            <a href={personal.linkedin} target="_blank" rel="noreferrer">LinkedIn</a>
          )}
          {personal.github && (
            <a href={personal.github} target="_blank" rel="noreferrer">GitHub</a>
          )}
        </div>

        {(personal.birthday || personal.nationality || personal.driversLicense) && (
          <div className="cv-section">
            <h2>Details</h2>
            {personal.birthday && (
              <div className="cv-modern__detail-row">
                <span className="cv-modern__detail-label">Born</span>
                <span>{formatBirthday(personal.birthday)}</span>
              </div>
            )}
            {personal.nationality && (
              <div className="cv-modern__detail-row">
                <span className="cv-modern__detail-label">Nationality</span>
                <span>{personal.nationality}</span>
              </div>
            )}
            {personal.driversLicense && (
              <div className="cv-modern__detail-row">
                <span className="cv-modern__detail-label">Licence</span>
                <span>{personal.driversLicense}</span>
              </div>
            )}
          </div>
        )}

        {skills.length > 0 && (
          <div className={`cv-section${p?.skills ? ' cv-placeholder' : ''}`}>
            <h2>Skills</h2>
            {skills.map((group) => (
              <div key={group.id} className="cv-skill-group">
                {group.category && <h4>{group.category}</h4>}
                <div className="cv-skill-tags">
                  {group.items.map((item) => (
                    <span key={item} className="cv-skill-tag">{item}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {languages.length > 0 && (
          <div className={`cv-section${p?.languages ? ' cv-placeholder' : ''}`}>
            <h2>Languages</h2>
            {languages.map((lang) => (
              <div key={lang.id} className="cv-language-row">
                <span>{lang.language}</span>
                <span className="cv-language-level">{lang.level}</span>
              </div>
            ))}
          </div>
        )}

        {interests.length > 0 && (
          <div className={`cv-section${p?.interests ? ' cv-placeholder' : ''}`}>
            <h2>Interests</h2>
            <div className="cv-skill-tags">
              {interests.map((item) => (
                <span key={item} className="cv-skill-tag">{item}</span>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="cv-modern__main">
        {sectionOrder.map((id) => {
          const render = mainSections[id]
          return render ? <div key={id} data-cv-section={id}>{render()}</div> : null
        })}
      </div>
    </div>
  )
}
