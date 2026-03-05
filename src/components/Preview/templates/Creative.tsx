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

export function CreativeTemplate({ cv, placeholders: p, sectionOrder }: Props) {
  const { personal, experience, education, skills, languages, certifications, interests } = cv

  const sections: Record<string, () => React.ReactNode> = {
    summary: () => personal.summary ? (
      <div className={`cv-creative__section${p?.summary ? ' cv-placeholder' : ''}`}>
        <h2>Profile</h2>
        <p className="cv-creative__summary">{personal.summary}</p>
      </div>
    ) : null,

    education: () => education.length > 0 ? (
      <div className={`cv-creative__section${p?.education ? ' cv-placeholder' : ''}`}>
        <h2>Education</h2>
        <div className="cv-creative__edu-timeline">
          {education.map((edu) => (
            <div key={edu.id} className="cv-creative__edu-item">
              <div className="cv-creative__edu-dot" />
              <div className="cv-creative__edu-date">
                {formatDate(edu.startDate)} – {formatDate(edu.endDate)}
              </div>
              <div className="cv-creative__edu-title">
                {edu.degree}{edu.field ? ` in ${edu.field}` : ''}
              </div>
              <div className="cv-creative__edu-inst">{edu.institution}</div>
              {edu.grade && <div className="cv-creative__edu-grade">Grade: {edu.grade}</div>}
            </div>
          ))}
        </div>
      </div>
    ) : null,

    experience: () => experience.length > 0 ? (
      <div className={`cv-creative__section${p?.experience ? ' cv-placeholder' : ''}`}>
        <h2>Experience</h2>
        <div className="cv-creative__exp-timeline">
          {experience.map((exp) => (
            <div key={exp.id} className="cv-creative__exp-item">
              <div className="cv-creative__exp-card">
                <div className="cv-creative__exp-dates">
                  {formatDate(exp.startDate)} – {exp.current ? 'Present' : formatDate(exp.endDate)}
                </div>
                <div className="cv-creative__exp-role">{exp.role}</div>
                <div className="cv-creative__exp-company">
                  {exp.company}
                  {exp.location && <span> · {exp.location}</span>}
                </div>
                {exp.bullets.filter(Boolean).length > 0 && (
                  <ul className="cv-creative__exp-bullets">
                    {exp.bullets.filter(Boolean).map((b, j) => <li key={j}>{b}</li>)}
                  </ul>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    ) : null,

    skills: () => skills.length > 0 ? (
      <div className={`cv-creative__section${p?.skills ? ' cv-placeholder' : ''}`}>
        <h2>Skills</h2>
        <div className="cv-creative__skills">
          {skills.map((group) => (
            <div key={group.id} className="cv-creative__skill-group">
              {group.category && <h4>{group.category}</h4>}
              <div className="cv-creative__skill-tags">
                {group.items.map((item) => (
                  <span key={item} className="cv-creative__skill-tag">{item}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    ) : null,

    languages: () => languages.length > 0 ? (
      <div className={`cv-creative__section${p?.languages ? ' cv-placeholder' : ''}`}>
        <h2>Languages</h2>
        <div className="cv-creative__langs">
          {languages.map((lang) => (
            <div key={lang.id} className="cv-creative__lang-item">
              <span className="cv-creative__lang-name">{lang.language}</span>
              <span className="cv-creative__lang-level">{lang.level}</span>
            </div>
          ))}
        </div>
      </div>
    ) : null,

    certifications: () => certifications.length > 0 ? (
      <div className={`cv-creative__section${p?.certifications ? ' cv-placeholder' : ''}`}>
        <h2>Certifications</h2>
        <div className="cv-creative__certs">
          {certifications.map((cert) => (
            <div key={cert.id} className="cv-creative__cert-item">
              <strong>{cert.title}</strong>
              {cert.institution && <span> · {cert.institution}</span>}
              {cert.date && <span className="cv-creative__cert-date"> ({formatDate(cert.date)})</span>}
              {cert.description && <p>{cert.description}</p>}
            </div>
          ))}
        </div>
      </div>
    ) : null,

    interests: () => interests.length > 0 ? (
      <div className={`cv-creative__section${p?.interests ? ' cv-placeholder' : ''}`}>
        <h2>Interests</h2>
        <div className="cv-creative__interests">
          {interests.map((item) => (
            <span key={item} className="cv-creative__interest-pill">{item}</span>
          ))}
        </div>
      </div>
    ) : null,

    projects: () => null,
  }

  return (
    <div className="cv-template cv-creative">
      {/* ── Header ── */}
      <div className="cv-creative__header" data-cv-section="personal">
        <div className="cv-creative__header-left">
          {personal.name && <h1 className={p?.name ? 'cv-placeholder' : ''}>{personal.name}</h1>}
          {personal.title && <div className={`cv-creative__title${p?.title ? ' cv-placeholder' : ''}`}>{personal.title}</div>}
        </div>
        {personal.photo && (
          <CvPhoto personal={personal} className="cv-photo cv-creative__photo" />
        )}
        <div className={`cv-creative__header-right${p?.contact ? ' cv-placeholder' : ''}`}>
          {personal.email && <div>{personal.email}</div>}
          {personal.phone && <div>{formatPhone(personal.phone)}</div>}
          {[personal.city, personal.country].filter(Boolean).join(', ') && (
            <div>{[personal.city, personal.country].filter(Boolean).join(', ')}</div>
          )}
          {personal.birthday && <div>{formatBirthday(personal.birthday)}</div>}
        </div>
      </div>

      {sectionOrder.map((id) => {
        const render = sections[id]
        return render ? <div key={id} data-cv-section={id}>{render()}</div> : null
      })}
    </div>
  )
}
