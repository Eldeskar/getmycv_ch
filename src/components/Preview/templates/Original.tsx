import React from 'react'
import { CVSectionId } from '../../../types/cv'
import { ResolvedCV } from '../../../utils/resolveCV'
import { formatDate } from '../../../utils/formatDate'
import { formatPhone } from '../../../utils/formatPhone'
import { PlaceholderMap } from '../../../utils/placeholderCV'
import { CVLabels } from '../../../utils/cvLabels'
import { CvPhoto } from '../CvPhoto'

interface Props { cv: ResolvedCV; placeholders?: PlaceholderMap; sectionOrder: CVSectionId[]; labels: CVLabels; locale: string }

function cityCountry(city: string, country: string): string {
  return [city, country].filter(Boolean).join(', ')
}

function formatBirthday(value: string, locale: string): string {
  if (!value) return ''
  try {
    return new Date(value).toLocaleDateString(locale, { day: 'numeric', month: 'long', year: 'numeric' })
  } catch {
    return value
  }
}

export function OriginalTemplate({ cv, placeholders: p, sectionOrder, labels, locale }: Props) {
  const { personal, experience, education, skills, languages, certifications, interests } = cv
  const location = cityCountry(personal.city, personal.country)

  const sections: Record<string, () => React.ReactNode> = {
    summary: () => personal.summary ? (
      <div className={`cv-original__section${p?.summary ? ' cv-placeholder' : ''}`}>
        <div className="cv-original__section-title">{labels.profile}</div>
        <p className="cv-original__summary">{personal.summary}</p>
      </div>
    ) : <></>,
    experience: () => experience.length > 0 ? (
      <div className={`cv-original__section${p?.experience ? ' cv-placeholder' : ''}`}>
        <div className="cv-original__section-title">{labels.experience}</div>
        {experience.map((exp) => (
          <div key={exp.id} className="cv-original__entry">
            <div className="cv-original__entry-header">
              <div className="cv-original__entry-title">{exp.role}</div>
              <div className="cv-original__entry-dates">
                {formatDate(exp.startDate, locale)} – {exp.current ? labels.present : formatDate(exp.endDate, locale)}
              </div>
            </div>
            <div className="cv-original__entry-where">
              {exp.company}{exp.location ? `, ${exp.location}` : ''}
            </div>
            {exp.bullets.filter(Boolean).length > 0 && (
              <ul className="cv-original__bullets">
                {exp.bullets.filter(Boolean).map((b, i) => <li key={i}>{b}</li>)}
              </ul>
            )}
          </div>
        ))}
      </div>
    ) : <></>,
    education: () => education.length > 0 ? (
      <div className={`cv-original__section${p?.education ? ' cv-placeholder' : ''}`}>
        <div className="cv-original__section-title">{labels.education}</div>
        {education.map((edu) => (
          <div key={edu.id} className="cv-original__entry">
            <div className="cv-original__entry-header">
              <div className="cv-original__entry-title">
                {edu.degree}{edu.field ? ` in ${edu.field}` : ''}
              </div>
              <div className="cv-original__entry-dates">
                {formatDate(edu.startDate, locale)} – {formatDate(edu.endDate, locale)}
              </div>
            </div>
            <div className="cv-original__entry-where">{edu.institution}</div>
            {edu.grade && <div className="cv-original__grade">{labels.grade}: {edu.grade}</div>}
          </div>
        ))}
      </div>
    ) : <></>,
    skills: () => skills.length > 0 ? (
      <div className={`cv-original__section${p?.skills ? ' cv-placeholder' : ''}`}>
        <div className="cv-original__section-title">{labels.skills}</div>
        {skills.map((group) => (
          <div key={group.id} className="cv-original__skill-row">
            {group.category && <strong>{group.category}: </strong>}
            <span>{group.items.join(', ')}</span>
          </div>
        ))}
      </div>
    ) : <></>,
    languages: () => languages.length > 0 ? (
      <div className={`cv-original__section${p?.languages ? ' cv-placeholder' : ''}`}>
        <div className="cv-original__section-title">{labels.languages}</div>
        <div className="cv-original__skill-row">
          {languages.map((l) => `${l.language} (${l.level})`).join(', ')}
        </div>
      </div>
    ) : <></>,
    certifications: () => certifications.length > 0 ? (
      <div className={`cv-original__section${p?.certifications ? ' cv-placeholder' : ''}`}>
        <div className="cv-original__section-title">{labels.certifications}</div>
        {certifications.map((cert) => (
          <div key={cert.id} className="cv-original__entry">
            <div className="cv-original__entry-header">
              <div className="cv-original__entry-title">{cert.title}</div>
              <div className="cv-original__entry-dates">{formatDate(cert.date, locale)}</div>
            </div>
            {cert.institution && <div className="cv-original__entry-where">{cert.institution}</div>}
            {cert.description && <p className="cv-original__desc">{cert.description}</p>}
          </div>
        ))}
      </div>
    ) : <></>,
    projects: () => null,
    interests: () => interests.length > 0 ? (
      <div className={`cv-original__section${p?.interests ? ' cv-placeholder' : ''}`}>
        <div className="cv-original__section-title">{labels.interests}</div>
        <div className="cv-original__skill-row">{interests.join(', ')}</div>
      </div>
    ) : <></>,
  }

  return (
    <div className="cv-template cv-original">
      {/* Header */}
      <div className="cv-original__header" data-cv-section="personal">
        <CvPhoto personal={personal} className="cv-photo cv-original__photo" />
        <div className="cv-original__header-text">
          {personal.name && <h1 className={p?.name ? 'cv-placeholder' : ''}>{personal.name}</h1>}
          {personal.title && <div className={`cv-original__subtitle${p?.title ? ' cv-placeholder' : ''}`}>{personal.title}</div>}
          <div className={`cv-original__contact${p?.contact ? ' cv-placeholder' : ''}`}>
            {[personal.email, formatPhone(personal.phone)].filter(Boolean).join(' · ')}
            {location && <span> · {location}</span>}
          </div>
          {(personal.website || personal.linkedin || personal.github) && (
            <div className="cv-original__links">
              {personal.website && <a href={personal.website} target="_blank" rel="noreferrer">{personal.website.replace(/^https?:\/\//, '')}</a>}
              {personal.linkedin && <a href={personal.linkedin} target="_blank" rel="noreferrer">LinkedIn</a>}
              {personal.github && <a href={personal.github} target="_blank" rel="noreferrer">GitHub</a>}
            </div>
          )}
          {(personal.birthday || personal.nationality || personal.driversLicense) && (
            <div className="cv-original__details">
              {[
                personal.birthday && `${labels.born} ${formatBirthday(personal.birthday, locale)}`,
                personal.nationality && `${labels.nationality}: ${personal.nationality}`,
                personal.driversLicense && `${labels.licence}: ${personal.driversLicense}`,
              ].filter(Boolean).join(' · ')}
            </div>
          )}
        </div>
      </div>

      {/* Sections */}
      {sectionOrder.map((id) => {
        const render = sections[id]
        return render ? <div key={id} data-cv-section={id}>{render()}</div> : null
      })}
    </div>
  )
}
