import React from 'react'
import { CVSectionId } from '../../../types/cv'
import { ResolvedCV } from '../../../utils/resolveCV'
import { formatDate } from '../../../utils/formatDate'
import { formatPhone } from '../../../utils/formatPhone'
import { PlaceholderMap } from '../../../utils/placeholderCV'
import { CVLabels } from '../../../utils/cvLabels'
import { CvPhoto } from '../CvPhoto'

interface Props { cv: ResolvedCV; placeholders?: PlaceholderMap; sectionOrder: CVSectionId[]; labels: CVLabels; locale: string }

/** Map CEFR / "Native" to a 0–1 ratio for bars. */
function langLevelRatio(level: string): number {
  const map: Record<string, number> = {
    'Native': 1, 'C2': 0.95, 'C1': 0.8, 'B2': 0.65,
    'B1': 0.5, 'A2': 0.35, 'A1': 0.2,
  }
  return map[level] ?? 0.5
}

/* Inline SVG icons */
const PhoneIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="cv-elegant__icon">
    <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6A19.79 19.79 0 012.12 4.18 2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/>
  </svg>
)
const MailIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="cv-elegant__icon">
    <rect x="2" y="4" width="20" height="16" rx="2"/><path d="M22 7l-10 7L2 7"/>
  </svg>
)
const MapPinIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="cv-elegant__icon">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/>
  </svg>
)
const GlobeIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="cv-elegant__icon">
    <circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10A15.3 15.3 0 0112 2z"/>
  </svg>
)
const LinkedInIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="cv-elegant__icon">
    <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-4 0v7h-4v-7a6 6 0 016-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/>
  </svg>
)

export function ElegantTemplate({ cv, placeholders: p, sectionOrder, labels, locale }: Props) {
  const { personal, experience, education, skills, languages, certifications, interests } = cv

  const sidebarSections: Record<string, () => React.ReactNode> = {
    education: () =>
      education.length > 0 ? (
        <div className={`cv-elegant__side-section${p?.education ? ' cv-placeholder' : ''}`} data-cv-section="education">
          <h3 className="cv-elegant__side-title">{labels.education}</h3>
          {education.map((edu) => (
            <div key={edu.id} className="cv-elegant__side-entry">
              <div className="cv-elegant__side-dates">{formatDate(edu.startDate, locale)} – {formatDate(edu.endDate, locale)}</div>
              <div className="cv-elegant__side-role">{edu.degree}{edu.field ? ` in ${edu.field}` : ''}</div>
              <div className="cv-elegant__side-where">{edu.institution}</div>
              {edu.grade && <div className="cv-elegant__side-detail">{labels.grade}: {edu.grade}</div>}
            </div>
          ))}
        </div>
      ) : null,

    languages: () =>
      languages.length > 0 ? (
        <div className={`cv-elegant__side-section${p?.languages ? ' cv-placeholder' : ''}`} data-cv-section="languages">
          <h3 className="cv-elegant__side-title">{labels.languages}</h3>
          {languages.map((lang) => (
            <div key={lang.id} className="cv-elegant__lang-row">
              <div className="cv-elegant__lang-info">
                <span className="cv-elegant__lang-name">{lang.language}</span>
                <span className="cv-elegant__lang-level">{lang.level}</span>
              </div>
              <div className="cv-elegant__bar">
                <div className="cv-elegant__bar-fill" style={{ width: `${langLevelRatio(lang.level) * 100}%` }} />
              </div>
            </div>
          ))}
        </div>
      ) : null,

    skills: () => null, // skills shown in main column with bars
    interests: () =>
      interests.length > 0 ? (
        <div className={`cv-elegant__side-section${p?.interests ? ' cv-placeholder' : ''}`} data-cv-section="interests">
          <h3 className="cv-elegant__side-title">{labels.interests}</h3>
          <ul className="cv-elegant__side-list">
            {interests.map((item) => <li key={item}>{item}</li>)}
          </ul>
        </div>
      ) : null,
  }

  const mainSections: Record<string, () => React.ReactNode> = {
    summary: () =>
      personal.summary ? (
        <div className={`cv-elegant__main-section${p?.summary ? ' cv-placeholder' : ''}`} data-cv-section="summary">
          <h2 className="cv-elegant__main-title">{labels.profile}</h2>
          <p className="cv-elegant__text">{personal.summary}</p>
        </div>
      ) : null,

    experience: () =>
      experience.length > 0 ? (
        <div className={`cv-elegant__main-section${p?.experience ? ' cv-placeholder' : ''}`} data-cv-section="experience">
          <h2 className="cv-elegant__main-title">{labels.experience}</h2>
          {experience.map((exp) => (
            <div key={exp.id} className="cv-elegant__entry">
              <div className="cv-elegant__entry-header">
                <strong className="cv-elegant__entry-role">{exp.role}</strong>
                <span className="cv-elegant__entry-dates">
                  {formatDate(exp.startDate, locale)} – {exp.current ? labels.present : formatDate(exp.endDate, locale)}
                </span>
              </div>
              <div className="cv-elegant__entry-where">
                {exp.company}{exp.location ? `, ${exp.location}` : ''}
              </div>
              {exp.bullets.filter(Boolean).length > 0 && (
                <ul className="cv-elegant__bullets">
                  {exp.bullets.filter(Boolean).map((b, i) => <li key={i}>{b}</li>)}
                </ul>
              )}
            </div>
          ))}
        </div>
      ) : null,

    education: () => null, // shown in sidebar

    skills: () =>
      skills.length > 0 ? (
        <div className={`cv-elegant__main-section${p?.skills ? ' cv-placeholder' : ''}`} data-cv-section="skills">
          <h2 className="cv-elegant__main-title">{labels.skillsAndExpertise}</h2>
          <div className="cv-elegant__skills-grid">
            {skills.flatMap((group) =>
              group.items.filter(Boolean).map((skill) => (
                <div key={skill} className="cv-elegant__skill-item">
                  <span className="cv-elegant__skill-name">{skill}</span>
                  <div className="cv-elegant__bar">
                    <div
                      className="cv-elegant__bar-fill"
                      style={{ width: `${((group.levels?.[skill] ?? 5) / 10) * 100}%` }}
                    />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      ) : null,

    certifications: () =>
      certifications.length > 0 ? (
        <div className={`cv-elegant__main-section${p?.certifications ? ' cv-placeholder' : ''}`} data-cv-section="certifications">
          <h2 className="cv-elegant__main-title">{labels.certifications}</h2>
          {certifications.map((cert) => (
            <div key={cert.id} className="cv-elegant__entry">
              <div className="cv-elegant__entry-header">
                <strong className="cv-elegant__entry-role">{cert.title}</strong>
                <span className="cv-elegant__entry-dates">{formatDate(cert.date, locale)}</span>
              </div>
              {cert.institution && <div className="cv-elegant__entry-where">{cert.institution}</div>}
              {cert.description && <p className="cv-elegant__text" style={{ marginTop: '0.15rem' }}>{cert.description}</p>}
            </div>
          ))}
        </div>
      ) : null,

    projects: () => null,
    languages: () => null, // shown in sidebar
    interests: () => null, // shown in sidebar
  }

  return (
    <div className="cv-template cv-elegant">
      {/* ── Header Banner ── */}
      <div className="cv-elegant__header" data-cv-section="personal">
        <CvPhoto personal={personal} className="cv-photo cv-elegant__photo" />
        <div className="cv-elegant__header-text">
          {personal.name && <h1 className={p?.name ? 'cv-placeholder' : ''}>{personal.name}</h1>}
          {personal.title && <div className={`cv-elegant__subtitle${p?.title ? ' cv-placeholder' : ''}`}>{personal.title}</div>}
        </div>
      </div>

      {/* ── Body: Sidebar + Main ── */}
      <div className="cv-elegant__body">
        {/* Sidebar */}
        <div className="cv-elegant__sidebar">
          {/* Contact */}
          <div className={`cv-elegant__side-section${p?.contact ? ' cv-placeholder' : ''}`} data-cv-section="personal">
            <h3 className="cv-elegant__side-title">{labels.contact}</h3>
            <div className="cv-elegant__contact-list">
              {personal.phone && (
                <div className="cv-elegant__contact-row">
                  <PhoneIcon />
                  <span>{formatPhone(personal.phone)}</span>
                </div>
              )}
              {personal.email && (
                <div className="cv-elegant__contact-row">
                  <MailIcon />
                  <span>{personal.email}</span>
                </div>
              )}
              {(personal.address || personal.city || personal.country) && (
                <div className="cv-elegant__contact-row">
                  <MapPinIcon />
                  <span>
                    {personal.address && <>{personal.address}<br /></>}
                    {(personal.zip || personal.city) && <>{[personal.zip, personal.city].filter(Boolean).join(' ')}<br /></>}
                    {personal.country}
                  </span>
                </div>
              )}
              {personal.website && (
                <div className="cv-elegant__contact-row">
                  <GlobeIcon />
                  <span>{personal.website.replace(/^https?:\/\//, '')}</span>
                </div>
              )}
              {personal.linkedin && (
                <div className="cv-elegant__contact-row">
                  <LinkedInIcon />
                  <span>{personal.linkedin.replace(/^https?:\/\//, '')}</span>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar sections from order */}
          {sectionOrder.map((id) => {
            const render = sidebarSections[id]
            return render ? <React.Fragment key={id}>{render()}</React.Fragment> : null
          })}
        </div>

        {/* Main */}
        <div className="cv-elegant__main">
          {sectionOrder.map((id) => {
            const render = mainSections[id]
            return render ? <React.Fragment key={id}>{render()}</React.Fragment> : null
          })}
        </div>
      </div>
    </div>
  )
}
