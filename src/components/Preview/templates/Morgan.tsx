import React from 'react'
import { CVSectionId } from '../../../types/cv'
import { ResolvedCV } from '../../../utils/resolveCV'
import { formatDate } from '../../../utils/formatDate'
import { formatPhone } from '../../../utils/formatPhone'
import { PlaceholderMap } from '../../../utils/placeholderCV'
import { CVLabels } from '../../../utils/cvLabels'

interface Props { cv: ResolvedCV; placeholders?: PlaceholderMap; sectionOrder: CVSectionId[]; labels: CVLabels; locale: string }

export function MorganTemplate({ cv, placeholders: p, sectionOrder, labels, locale }: Props) {
  const { personal, experience, education, skills, languages, certifications, interests, references } = cv

  /* ── Icon helpers (inline SVG, outline style) ── */
  const icon = (d: string, vb = '0 0 24 24') => (
    <svg className="cv-morgan__icon" viewBox={vb} fill="currentColor"><path d={d} /></svg>
  )

  const iconPhone = icon('M6.62 10.79a15.053 15.053 0 006.59 6.59l2.2-2.2a1.003 1.003 0 011.01-.24c1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1C10.07 21 3 13.93 3 4c0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.1.31.03.66-.25 1.02l-2.2 2.2z')
  const iconMail = icon('M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z')
  const iconPin = icon('M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 010-5 2.5 2.5 0 010 5z')

  /* ── Language level → bar width ── */
  const langWidth = (level: string): string => {
    const l = level.toLowerCase()
    if (l.includes('native') || l.includes('c2') || l.includes('mutter')) return '100%'
    if (l.includes('fluent') || l.includes('c1') || l.includes('fliessend') || l.includes('courant')) return '85%'
    if (l.includes('advanced') || l.includes('b2') || l.includes('fortgeschritten') || l.includes('avancé')) return '70%'
    if (l.includes('intermediate') || l.includes('b1') || l.includes('mittelstufe') || l.includes('intermédiaire')) return '55%'
    if (l.includes('elementary') || l.includes('a2') || l.includes('grundkenntnisse') || l.includes('élémentaire')) return '40%'
    if (l.includes('beginner') || l.includes('a1') || l.includes('anfänger') || l.includes('débutant')) return '25%'
    return '60%'
  }

  /* ── Body sections (label on left, content on right) ── */
  const bodySections: Record<string, () => React.ReactNode> = {
    summary: () => personal.summary ? (
      <div className={`cv-morgan__row${p?.summary ? ' cv-placeholder' : ''}`} data-cv-section="summary">
        <div className="cv-morgan__row-label">{labels.profile}</div>
        <div className="cv-morgan__row-content">
          <p className="cv-morgan__summary">{personal.summary}</p>
        </div>
      </div>
    ) : null,

    experience: () => experience.length > 0 ? (
      <div className={`cv-morgan__row${p?.experience ? ' cv-placeholder' : ''}`} data-cv-section="experience">
        <div className="cv-morgan__row-label">{labels.experience}</div>
        <div className="cv-morgan__row-content">
          {experience.map((exp) => (
            <div key={exp.id} className="cv-morgan__entry">
              <div className="cv-morgan__entry-header">
                <span className="cv-morgan__entry-company">{exp.company}</span>{' '}
                <span className="cv-morgan__entry-date">
                  {formatDate(exp.startDate, locale)} - {exp.current ? labels.present : formatDate(exp.endDate, locale)}
                </span>
              </div>
              <div className="cv-morgan__entry-role">{exp.role}</div>
              {exp.bullets.filter(Boolean).length > 0 && (
                <p className="cv-morgan__entry-desc">{exp.bullets.filter(Boolean).join('. ')}.</p>
              )}
            </div>
          ))}
        </div>
      </div>
    ) : null,

    education: () => education.length > 0 ? (
      <div className={`cv-morgan__row${p?.education ? ' cv-placeholder' : ''}`} data-cv-section="education">
        <div className="cv-morgan__row-label">{labels.education}</div>
        <div className="cv-morgan__row-content">
          {education.map((edu) => (
            <div key={edu.id} className="cv-morgan__edu-entry">
              <div className="cv-morgan__edu-left">
                <div className="cv-morgan__edu-year">{edu.endDate ? formatDate(edu.endDate, locale) : ''}</div>
                <div className="cv-morgan__edu-inst">{edu.institution}</div>
                <div className="cv-morgan__edu-degree">
                  {edu.degree}{edu.field ? ` in ${edu.field}` : ''}
                </div>
              </div>
              {edu.grade && (
                <div className="cv-morgan__edu-right">
                  {edu.grade}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    ) : null,

    projects: () => cv.projects.length > 0 ? (
      <div className="cv-morgan__row" data-cv-section="projects">
        <div className="cv-morgan__row-label">{labels.portfolio}</div>
        <div className="cv-morgan__row-content">
          {cv.projects.map((proj) => (
            <div key={proj.id} className="cv-morgan__entry">
              <div className="cv-morgan__entry-header">
                <span className="cv-morgan__entry-company">{proj.name}</span>
              </div>
              {proj.description && <p className="cv-morgan__entry-desc">{proj.description}</p>}
            </div>
          ))}
        </div>
      </div>
    ) : null,

    certifications: () => certifications.length > 0 ? (
      <div className={`cv-morgan__row${p?.certifications ? ' cv-placeholder' : ''}`} data-cv-section="certifications">
        <div className="cv-morgan__row-label">{labels.certifications}</div>
        <div className="cv-morgan__row-content">
          {certifications.map((cert) => (
            <div key={cert.id} className="cv-morgan__entry">
              <div className="cv-morgan__entry-header">
                <span className="cv-morgan__entry-company">{cert.title}</span>
                {cert.date && <span className="cv-morgan__entry-date">{formatDate(cert.date, locale)}</span>}
              </div>
              {cert.institution && <div className="cv-morgan__entry-role">{cert.institution}</div>}
            </div>
          ))}
        </div>
      </div>
    ) : null,

    interests: () => interests.length > 0 ? (
      <div className={`cv-morgan__row${p?.interests ? ' cv-placeholder' : ''}`} data-cv-section="interests">
        <div className="cv-morgan__row-label">{labels.interests}</div>
        <div className="cv-morgan__row-content">
          <p className="cv-morgan__summary">{interests.join(', ')}</p>
        </div>
      </div>
    ) : null,
  }

  /* ── Footer sections (3-column bar at bottom) ── */
  const hasLanguages = languages.length > 0
  const hasSkills = skills.length > 0
  const hasReferences = references.length > 0
  const showFooter = hasLanguages || hasSkills || hasReferences

  /* Section IDs that go in the footer (fixed order: languages, skills, references) */
  const footerIds = new Set(['skills', 'languages', 'references'])
  const footerOrder: CVSectionId[] = ['languages', 'skills', 'references']

  return (
    <div className="cv-template cv-morgan">
      {/* ── Header ── */}
      <div className="cv-morgan__header" data-cv-section="personal">
        <div className="cv-morgan__header-left">
          <h1 className={p?.name ? 'cv-placeholder' : ''}>{personal.name}</h1>
          {personal.title && <div className={`cv-morgan__subtitle${p?.title ? ' cv-placeholder' : ''}`}>{personal.title}</div>}
        </div>
        <div className={`cv-morgan__header-right${p?.contact ? ' cv-placeholder' : ''}`}>
          {personal.phone && (
            <div className="cv-morgan__contact-item">
              <span className="cv-morgan__contact-icon">{iconPhone}</span>
              <span>{formatPhone(personal.phone)}</span>
            </div>
          )}
          {personal.email && (
            <div className="cv-morgan__contact-item">
              <span className="cv-morgan__contact-icon">{iconMail}</span>
              <span>{personal.email}</span>
            </div>
          )}
          {(personal.city || personal.country || personal.address) && (
            <div className="cv-morgan__contact-item">
              <span className="cv-morgan__contact-icon">{iconPin}</span>
              <span>{[personal.address, personal.zip, personal.city, personal.country].filter(Boolean).join(', ')}</span>
            </div>
          )}
        </div>
      </div>

      {/* ── Body rows ── */}
      <div className="cv-morgan__body">
        {sectionOrder.filter((id) => !footerIds.has(id)).map((id) => {
          const render = bodySections[id]
          return render ? <React.Fragment key={id}>{render()}</React.Fragment> : null
        })}
      </div>

      {/* ── Footer (Language / Skills / Interests) ── */}
      {showFooter && (
        <div className="cv-morgan__footer">
          {footerOrder.map((id) => {
            if (id === 'languages' && hasLanguages) return (
              <div key={id} className={`cv-morgan__footer-col${p?.languages ? ' cv-placeholder' : ''}`} data-cv-section="languages">
                <div className="cv-morgan__footer-title">{labels.languages}</div>
                <div className="cv-morgan__footer-body">
                  {languages.map((lang) => (
                    <div key={lang.id} className="cv-morgan__lang-item">
                      <span className="cv-morgan__lang-name">{lang.language}</span>
                      <div className="cv-morgan__lang-bar">
                        <div className="cv-morgan__lang-fill" style={{ width: langWidth(lang.level) }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )
            if (id === 'skills' && hasSkills) return (
              <div key={id} className={`cv-morgan__footer-col${p?.skills ? ' cv-placeholder' : ''}`} data-cv-section="skills">
                <div className="cv-morgan__footer-title">{labels.skillsAndExpertise}</div>
                <div className="cv-morgan__footer-body">
                  <ul className="cv-morgan__skill-list">
                    {skills.flatMap((group) => group.items).map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )
            if (id === 'references' && hasReferences) return (
              <div key={id} className={`cv-morgan__footer-col${p?.references ? ' cv-placeholder' : ''}`} data-cv-section="references">
                <div className="cv-morgan__footer-title">{labels.references}</div>
                <div className="cv-morgan__footer-body">
                  {references.map((ref) => (
                    <div key={ref.id} className="cv-morgan__ref-item">
                      <div className="cv-morgan__ref-name">{ref.name}</div>
                      {(ref.company || ref.position) && (
                        <div className="cv-morgan__ref-role">{[ref.company, ref.position].filter(Boolean).join('/')}</div>
                      )}
                      {ref.phone && (
                        <>
                          <div className="cv-morgan__ref-label">{labels.contact}</div>
                          <div className="cv-morgan__ref-contact">{formatPhone(ref.phone)}</div>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )
            return null
          })}
        </div>
      )}
    </div>
  )
}
