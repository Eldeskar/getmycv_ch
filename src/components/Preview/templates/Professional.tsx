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

/** Map CEFR level to a number of filled dots (out of 6) */
function levelToDots(level: string): number {
  const map: Record<string, number> = { Native: 6, C2: 6, C1: 5, B2: 4, B1: 3, A2: 2, A1: 1 }
  return map[level] ?? 3
}

function DotRating({ filled, total = 6 }: { filled: number; total?: number }) {
  return (
    <span className="cv-prof__dots">
      {Array.from({ length: total }, (_, i) => (
        <span key={i} className={`cv-prof__dot${i < filled ? ' cv-prof__dot--filled' : ''}`} />
      ))}
    </span>
  )
}

export function ProfessionalTemplate({ cv, placeholders: p, sectionOrder, labels, locale }: Props) {
  const { personal, experience, education, skills, languages, certifications, interests } = cv
  const addr = fullAddress(personal)

  const mainSections: Record<string, () => React.ReactNode> = {
    summary: () =>
      personal.summary ? (
        <div className={`cv-prof__section${p?.summary ? ' cv-placeholder' : ''}`}>
          <h2>{labels.profile}</h2>
          <p>{personal.summary}</p>
        </div>
      ) : null,

    experience: () =>
      experience.length > 0 ? (
        <div className={`cv-prof__section${p?.experience ? ' cv-placeholder' : ''}`}>
          <h2>{labels.experience}</h2>
          {experience.map((exp) => (
            <div key={exp.id} className="cv-entry">
              <div className="cv-entry__header">
                <div>
                  <strong>{exp.role}</strong>
                  <span className="cv-entry__company"> · {exp.company}</span>
                  {exp.location && <span className="cv-entry__location"> — {exp.location}</span>}
                </div>
                <span className="cv-entry__dates">
                  {formatDate(exp.startDate, locale)} – {exp.current ? labels.present : formatDate(exp.endDate, locale)}
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
        <div className={`cv-prof__section${p?.education ? ' cv-placeholder' : ''}`}>
          <h2>{labels.education}</h2>
          {education.map((edu) => (
            <div key={edu.id} className="cv-entry">
              <div className="cv-entry__header">
                <div>
                  <strong>{edu.degree}{edu.field ? ` in ${edu.field}` : ''}</strong>
                  <span className="cv-entry__company"> · {edu.institution}</span>
                </div>
                <span className="cv-entry__dates">
                  {formatDate(edu.startDate, locale)} – {formatDate(edu.endDate, locale)}
                </span>
              </div>
              {edu.grade && <p className="cv-entry__grade">{labels.grade}: {edu.grade}</p>}
            </div>
          ))}
        </div>
      ) : null,

    certifications: () =>
      certifications.length > 0 ? (
        <div className={`cv-prof__section${p?.certifications ? ' cv-placeholder' : ''}`}>
          <h2>{labels.certifications}</h2>
          {certifications.map((cert) => (
            <div key={cert.id} className="cv-entry">
              <div className="cv-entry__header">
                <div>
                  <strong>{cert.title}</strong>
                  {cert.institution && <span className="cv-entry__company"> · {cert.institution}</span>}
                </div>
                <span className="cv-entry__dates">{formatDate(cert.date, locale)}</span>
              </div>
              {cert.description && <p className="cv-entry__grade">{cert.description}</p>}
            </div>
          ))}
        </div>
      ) : null,

    projects: () => null,
  }

  return (
    <div className="cv-template cv-professional">
      {/* ── Sidebar ── */}
      <div className="cv-prof__sidebar" data-cv-section="personal">
        {personal.name && (
          <h1 className={`cv-prof__name${p?.name ? ' cv-placeholder' : ''}`}>{personal.name}</h1>
        )}
        {personal.title && <div className={`cv-prof__title${p?.title ? ' cv-placeholder' : ''}`}>{personal.title}</div>}

        <CvPhoto personal={personal} className="cv-prof__photo" />

        {/* Personal details */}
        <div className={`cv-prof__block${p?.contact ? ' cv-placeholder' : ''}`}>
          <h2>{labels.details}</h2>
          {personal.birthday && (
            <div className="cv-prof__detail">{formatBirthday(personal.birthday, locale)}</div>
          )}
          {addr && <div className="cv-prof__detail">{addr}</div>}
          {personal.phone && <div className="cv-prof__detail">{formatPhone(personal.phone)}</div>}
          {personal.email && (
            <div className="cv-prof__detail">
              <a href={`mailto:${personal.email}`}>{personal.email}</a>
            </div>
          )}
          {personal.nationality && (
            <div className="cv-prof__detail">{labels.nationality}: {personal.nationality}</div>
          )}
          {personal.driversLicense && (
            <div className="cv-prof__detail">{labels.licence}: {personal.driversLicense}</div>
          )}
          {personal.website && (
            <div className="cv-prof__detail">
              <a href={personal.website} target="_blank" rel="noreferrer">
                {personal.website.replace(/^https?:\/\//, '')}
              </a>
            </div>
          )}
          {personal.linkedin && (
            <div className="cv-prof__detail">
              <a href={personal.linkedin} target="_blank" rel="noreferrer">LinkedIn</a>
            </div>
          )}
          {personal.github && (
            <div className="cv-prof__detail">
              <a href={personal.github} target="_blank" rel="noreferrer">GitHub</a>
            </div>
          )}
        </div>

        {/* Skills */}
        {skills.length > 0 && (
          <div className={`cv-prof__block${p?.skills ? ' cv-placeholder' : ''}`}>
            <h2>{labels.skills}</h2>
            {skills.map((group) => (
              <div key={group.id} className="cv-prof__skill-group">
                {group.category && <h4>{group.category}</h4>}
                <div className="cv-prof__skill-items">
                  {group.items.map((item) => (
                    <span key={item} className="cv-prof__skill-item">{item}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Languages */}
        {languages.length > 0 && (
          <div className={`cv-prof__block${p?.languages ? ' cv-placeholder' : ''}`}>
            <h2>{labels.languages}</h2>
            {languages.map((lang) => (
              <div key={lang.id} className="cv-prof__lang-row">
                <span>{lang.language}</span>
                <DotRating filled={levelToDots(lang.level)} />
              </div>
            ))}
          </div>
        )}

        {/* Interests */}
        {interests.length > 0 && (
          <div className={`cv-prof__block${p?.interests ? ' cv-placeholder' : ''}`}>
            <h2>{labels.interests}</h2>
            <div className="cv-prof__interests">
              {interests.map((item) => (
                <span key={item} className="cv-prof__interest-tag">{item}</span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ── Main ── */}
      <div className="cv-prof__main">
        {sectionOrder.map((id) => {
          const render = mainSections[id]
          return render ? <div key={id} data-cv-section={id}>{render()}</div> : null
        })}
      </div>
    </div>
  )
}
