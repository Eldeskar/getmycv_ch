import React from 'react'
import { CVSectionId } from '../../../types/cv'
import { ResolvedCV } from '../../../utils/resolveCV'
import { formatDate } from '../../../utils/formatDate'
import { formatPhone } from '../../../utils/formatPhone'
import { PlaceholderMap } from '../../../utils/placeholderCV'
import { CVLabels } from '../../../utils/cvLabels'
import { CvPhoto } from '../CvPhoto'

interface Props { cv: ResolvedCV; placeholders?: PlaceholderMap; sectionOrder: CVSectionId[]; labels: CVLabels; locale: string }

export function NinaTemplate({ cv, placeholders: p, sectionOrder, labels, locale }: Props) {
  const { personal, experience, education, skills, languages, certifications, interests } = cv

  /* ── Icon helpers (inline SVG) ── */
  const icon = (d: string, vb = '0 0 24 24') => (
    <svg className="cv-nina__icon" viewBox={vb} fill="currentColor"><path d={d} /></svg>
  )

  const iconPhone = icon('M6.62 10.79a15.053 15.053 0 006.59 6.59l2.2-2.2a1.003 1.003 0 011.01-.24c1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1C10.07 21 3 13.93 3 4c0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.1.31.03.66-.25 1.02l-2.2 2.2z')
  const iconPin = icon('M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 010-5 2.5 2.5 0 010 5z')
  const iconHeart = icon('M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z')
  const iconProfile = icon('M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z')
  const iconExp = icon('M20 6h-4V4c0-1.11-.89-2-2-2h-4c-1.11 0-2 .89-2 2v2H4c-1.11 0-2 .89-2 2v11c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-6 0h-4V4h4v2z')
  const iconEdu = icon('M5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82zM12 3L1 9l11 6 9-4.91V17h2V9L12 3z')
  const iconPortfolio = icon('M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zm4 18H6V4h7v5h5v11z')

  /* ── Sidebar sections ── */
  const sidebarSections: Record<string, () => React.ReactNode> = {
    skills: () => skills.length > 0 ? (
      <div className={`cv-nina__sidebar-section${p?.skills ? ' cv-placeholder' : ''}`}>
        <h3>{iconPin} {labels.skills}</h3>
        {skills.map((group) => (
          <div key={group.id} className="cv-nina__skill-group">
            {group.category && <div className="cv-nina__skill-cat">{group.category}</div>}
            {group.items.map((item) => {
              const level = group.levels[item] ?? 5
              const filled = Math.round(level / 2) // 1-10 → 1-5 segments
              return (
                <div key={item} className="cv-nina__skill-item">
                  <span className="cv-nina__skill-name">{item}</span>
                  <div className="cv-nina__skill-bar">
                    {[1, 2, 3, 4, 5].map((seg) => (
                      <div key={seg} className={`cv-nina__skill-seg${seg <= filled ? ' cv-nina__skill-seg--filled' : ''}`} />
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        ))}
      </div>
    ) : null,

    languages: () => languages.length > 0 ? (
      <div className={`cv-nina__sidebar-section${p?.languages ? ' cv-placeholder' : ''}`}>
        <h3>{labels.languages}</h3>
        {languages.map((lang) => (
          <div key={lang.id} className="cv-nina__lang-item">
            <span>{lang.language}</span>
            <span className="cv-nina__lang-level">{lang.level}</span>
          </div>
        ))}
      </div>
    ) : null,

    interests: () => interests.length > 0 ? (
      <div className={`cv-nina__sidebar-section${p?.interests ? ' cv-placeholder' : ''}`}>
        <h3>{iconHeart} {labels.interests}</h3>
        <ul className="cv-nina__interest-list">
          {interests.map((item) => <li key={item}>{item}</li>)}
        </ul>
      </div>
    ) : null,

    certifications: () => certifications.length > 0 ? (
      <div className={`cv-nina__sidebar-section${p?.certifications ? ' cv-placeholder' : ''}`}>
        <h3>{labels.certifications}</h3>
        {certifications.map((cert) => (
          <div key={cert.id} className="cv-nina__cert-item">
            <strong>{cert.title}</strong>
            {cert.institution && <div className="cv-nina__cert-inst">{cert.institution}</div>}
            {cert.date && <div className="cv-nina__cert-date">{formatDate(cert.date, locale)}</div>}
          </div>
        ))}
      </div>
    ) : null,
  }

  /* ── Main sections ── */
  const mainSections: Record<string, () => React.ReactNode> = {
    summary: () => personal.summary ? (
      <div className={`cv-nina__main-section${p?.summary ? ' cv-placeholder' : ''}`}>
        <h2>{iconProfile} {labels.profile}</h2>
        <p className="cv-nina__summary">{personal.summary}</p>
      </div>
    ) : null,

    experience: () => experience.length > 0 ? (
      <div className={`cv-nina__main-section${p?.experience ? ' cv-placeholder' : ''}`}>
        <h2>{iconExp} {labels.experience}</h2>
        <div className="cv-nina__timeline">
          {experience.map((exp) => (
            <div key={exp.id} className="cv-nina__timeline-item">
              <div className="cv-nina__timeline-dot" />
              <div className="cv-nina__timeline-content">
                <div className="cv-nina__exp-role">{exp.role}</div>
                <div className="cv-nina__exp-meta">
                  {exp.company}{exp.location ? ` | ${exp.location}` : ''}
                </div>
                <div className="cv-nina__exp-date">
                  {formatDate(exp.startDate, locale)} – {exp.current ? labels.present : formatDate(exp.endDate, locale)}
                </div>
                {exp.bullets.filter(Boolean).length > 0 && (
                  <p className="cv-nina__exp-desc">{exp.bullets.filter(Boolean).join('. ')}.</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    ) : null,

    education: () => education.length > 0 ? (
      <div className={`cv-nina__main-section${p?.education ? ' cv-placeholder' : ''}`}>
        <h2>{iconEdu} {labels.education}</h2>
        {education.map((edu) => (
          <div key={edu.id} className="cv-nina__edu-item">
            <div className="cv-nina__edu-degree">
              {edu.degree}{edu.field ? ` in ${edu.field}` : ''}
            </div>
            <div className="cv-nina__edu-inst">
              {edu.institution}{edu.startDate ? ` | ${[edu.startDate, edu.endDate].filter(Boolean).map(d => formatDate(d, locale)).join(' – ')}` : ''}
            </div>
            {edu.grade && <div className="cv-nina__edu-grade">{labels.grade}: {edu.grade}</div>}
          </div>
        ))}
      </div>
    ) : null,

    projects: () => cv.projects.length > 0 ? (
      <div className="cv-nina__main-section">
        <h2>{iconPortfolio} {labels.portfolio}</h2>
        {cv.projects.map((proj) => (
          <div key={proj.id} className="cv-nina__project-item">
            <span className="cv-nina__project-name">{proj.name}</span>
            {proj.description && (
              <span className="cv-nina__project-desc">: <em>{proj.description}</em></span>
            )}
          </div>
        ))}
      </div>
    ) : null,
  }

  /* Sidebar section IDs — rendered in sectionOrder but in the sidebar column */
  const sidebarIds = new Set(['skills', 'languages', 'interests', 'certifications'])

  return (
    <div className="cv-template cv-nina">
      {/* ── Left sidebar ── */}
      <div className="cv-nina__sidebar">
        {/* Photo + name header */}
        <div className="cv-nina__header" data-cv-section="personal">
          <CvPhoto personal={personal} className="cv-photo cv-nina__photo" />
          <h1 className={p?.name ? 'cv-placeholder' : ''}>{personal.name}</h1>
          {personal.title && <div className={`cv-nina__title${p?.title ? ' cv-placeholder' : ''}`}>{personal.title}</div>}
        </div>

        {/* Contact */}
        <div className={`cv-nina__sidebar-section cv-nina__contact${p?.contact ? ' cv-placeholder' : ''}`} data-cv-section="personal">
          <h3>{iconPhone} {labels.contact}</h3>
          {personal.email && (
            <div className="cv-nina__contact-group">
              <div className="cv-nina__contact-label">Email</div>
              <div className="cv-nina__contact-value">{personal.email}</div>
            </div>
          )}
          {personal.phone && (
            <div className="cv-nina__contact-group">
              <div className="cv-nina__contact-label">Phone</div>
              <div className="cv-nina__contact-value">{formatPhone(personal.phone)}</div>
            </div>
          )}
          {personal.website && (
            <div className="cv-nina__contact-group">
              <div className="cv-nina__contact-label">Website</div>
              <div className="cv-nina__contact-value">{personal.website}</div>
            </div>
          )}
          {(personal.city || personal.country) && (
            <div className="cv-nina__contact-group">
              <div className="cv-nina__contact-value">{[personal.address, personal.zip, personal.city, personal.country].filter(Boolean).join(', ')}</div>
            </div>
          )}
        </div>

        {/* Sidebar sections in order */}
        {sectionOrder.filter((id) => sidebarIds.has(id)).map((id) => {
          const render = sidebarSections[id]
          return render ? <div key={id} data-cv-section={id}>{render()}</div> : null
        })}
      </div>

      {/* ── Right main ── */}
      <div className="cv-nina__main">
        {sectionOrder.filter((id) => !sidebarIds.has(id)).map((id) => {
          const render = mainSections[id]
          return render ? <div key={id} data-cv-section={id}>{render()}</div> : null
        })}
      </div>
    </div>
  )
}
