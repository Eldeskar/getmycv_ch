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

/* Inline SVG icons for the contact section */
const PhoneIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="cv-sharp__icon">
    <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6A19.79 19.79 0 012.12 4.18 2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/>
  </svg>
)
const MailIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="cv-sharp__icon">
    <rect x="2" y="4" width="20" height="16" rx="2"/><path d="M22 7l-10 7L2 7"/>
  </svg>
)
const MapPinIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="cv-sharp__icon">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/>
  </svg>
)
const GlobeIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="cv-sharp__icon">
    <circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10A15.3 15.3 0 0112 2z"/>
  </svg>
)

export function SharpTemplate({ cv, placeholders: p, sectionOrder }: Props) {
  const { personal, experience, education, skills, languages, certifications, interests } = cv
  const mainSections: Record<string, () => React.ReactNode> = {
    summary: () =>
      personal.summary ? (
        <div className={`cv-sharp__section${p?.summary ? ' cv-placeholder' : ''}`}>
          <h2 className="cv-sharp__section-title">Profile</h2>
          <p className="cv-sharp__text">{personal.summary}</p>
        </div>
      ) : null,

    experience: () =>
      experience.length > 0 ? (
        <div className={`cv-sharp__section${p?.experience ? ' cv-placeholder' : ''}`}>
          <h2 className="cv-sharp__section-title">Work Experience</h2>
          {experience.map((exp) => (
            <div key={exp.id} className="cv-sharp__entry">
              <div className="cv-sharp__entry-header">
                <strong className="cv-sharp__entry-role">{exp.role}</strong>
                <span className="cv-sharp__entry-dates">
                  {formatDate(exp.startDate)} – {exp.current ? 'Present' : formatDate(exp.endDate)}
                </span>
              </div>
              <div className="cv-sharp__entry-where">
                {exp.company}{exp.location ? ` – ${exp.location}` : ''}
              </div>
              {exp.bullets.filter(Boolean).length > 0 && (
                <ul className="cv-sharp__bullets">
                  {exp.bullets.filter(Boolean).map((b, i) => <li key={i}>{b}</li>)}
                </ul>
              )}
            </div>
          ))}
        </div>
      ) : null,

    education: () =>
      education.length > 0 ? (
        <div className={`cv-sharp__section${p?.education ? ' cv-placeholder' : ''}`}>
          <h2 className="cv-sharp__section-title">Education</h2>
          {education.map((edu) => (
            <div key={edu.id} className="cv-sharp__entry">
              <div className="cv-sharp__entry-role">
                {edu.degree}{edu.field ? ` in ${edu.field}` : ''}
              </div>
              <div className="cv-sharp__entry-dates-block">
                {formatDate(edu.startDate)} – {formatDate(edu.endDate)}
              </div>
              <div className="cv-sharp__entry-where">{edu.institution}</div>
              {edu.grade && <div className="cv-sharp__entry-grade">Grade: {edu.grade}</div>}
            </div>
          ))}
        </div>
      ) : null,

    certifications: () =>
      certifications.length > 0 ? (
        <div className={`cv-sharp__section${p?.certifications ? ' cv-placeholder' : ''}`}>
          <h2 className="cv-sharp__section-title">Certifications</h2>
          {certifications.map((cert) => (
            <div key={cert.id} className="cv-sharp__entry">
              <div className="cv-sharp__entry-header">
                <strong className="cv-sharp__entry-role">{cert.title}</strong>
                <span className="cv-sharp__entry-dates">{formatDate(cert.date)}</span>
              </div>
              {cert.institution && <div className="cv-sharp__entry-where">{cert.institution}</div>}
              {cert.description && <p className="cv-sharp__text" style={{ marginTop: '0.2rem' }}>{cert.description}</p>}
            </div>
          ))}
        </div>
      ) : null,

    projects: () => null,
  }

  return (
    <div className="cv-template cv-sharp">
      {/* ── Sidebar ── */}
      <div className="cv-sharp__sidebar" data-cv-section="personal">
        {personal.photo && (
          <CvPhoto personal={personal} className="cv-photo cv-sharp__photo" />
        )}

        <div className="cv-sharp__name-block">
          {personal.name && <h1 className={p?.name ? 'cv-placeholder' : ''}>{personal.name}</h1>}
          {personal.title && <div className={`cv-sharp__job-title${p?.title ? ' cv-placeholder' : ''}`}>{personal.title}</div>}
        </div>

        {/* Contact */}
        <div className={`cv-sharp__sidebar-section${p?.contact ? ' cv-placeholder' : ''}`}>
          <h3 className="cv-sharp__sidebar-title">Contact Details</h3>
          <div className="cv-sharp__contact-list">
            {personal.phone && (
              <div className="cv-sharp__contact-row">
                <PhoneIcon />
                <span>{formatPhone(personal.phone)}</span>
              </div>
            )}
            {personal.email && (
              <div className="cv-sharp__contact-row">
                <MailIcon />
                <span>{personal.email}</span>
              </div>
            )}
            {(personal.address || personal.city || personal.country) && (
              <div className="cv-sharp__contact-row">
                <MapPinIcon />
                <span>
                  {personal.address && <>{personal.address}<br /></>}
                  {(personal.zip || personal.city) && <>{[personal.zip, personal.city].filter(Boolean).join(' ')}<br /></>}
                  {personal.country}
                </span>
              </div>
            )}
            {personal.website && (
              <div className="cv-sharp__contact-row">
                <GlobeIcon />
                <a href={personal.website} target="_blank" rel="noreferrer">
                  {personal.website.replace(/^https?:\/\//, '')}
                </a>
              </div>
            )}
          </div>
        </div>

        {/* Skills */}
        {skills.length > 0 && (
          <div className={`cv-sharp__sidebar-section${p?.skills ? ' cv-placeholder' : ''}`}>
            <h3 className="cv-sharp__sidebar-title">Skills</h3>
            <ul className="cv-sharp__sidebar-list">
              {skills.flatMap((group) => group.items).map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Languages */}
        {languages.length > 0 && (
          <div className={`cv-sharp__sidebar-section${p?.languages ? ' cv-placeholder' : ''}`}>
            <h3 className="cv-sharp__sidebar-title">Languages</h3>
            <ul className="cv-sharp__sidebar-list">
              {languages.map((lang) => (
                <li key={lang.id}>{lang.language}: {lang.level}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Interests */}
        {interests.length > 0 && (
          <div className={`cv-sharp__sidebar-section${p?.interests ? ' cv-placeholder' : ''}`}>
            <h3 className="cv-sharp__sidebar-title">Interests</h3>
            <ul className="cv-sharp__sidebar-list">
              {interests.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Personal details */}
        {(personal.birthday || personal.nationality || personal.driversLicense) && (
          <div className="cv-sharp__sidebar-section">
            <h3 className="cv-sharp__sidebar-title">Details</h3>
            <div className="cv-sharp__contact-list">
              {personal.birthday && <div className="cv-sharp__detail-row">{formatBirthday(personal.birthday)}</div>}
              {personal.nationality && <div className="cv-sharp__detail-row">{personal.nationality}</div>}
              {personal.driversLicense && <div className="cv-sharp__detail-row">Licence: {personal.driversLicense}</div>}
            </div>
          </div>
        )}
      </div>

      {/* ── Main ── */}
      <div className="cv-sharp__main">
        {sectionOrder.map((id) => {
          const render = mainSections[id]
          return render ? <div key={id} data-cv-section={id}>{render()}</div> : null
        })}
      </div>
    </div>
  )
}
