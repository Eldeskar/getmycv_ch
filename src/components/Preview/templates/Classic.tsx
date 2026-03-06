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

export function ClassicTemplate({ cv, placeholders: p, sectionOrder, labels, locale }: Props) {
  const { personal, experience, education, skills, languages, certifications, interests } = cv
  const location = cityCountry(personal.city, personal.country)
  const details = [
    personal.birthday && `${labels.born} ${formatBirthday(personal.birthday, locale)}`,
    personal.nationality && `${labels.nationality}: ${personal.nationality}`,
    personal.driversLicense && `${labels.licence}: ${personal.driversLicense}`,
  ].filter(Boolean)

  const sections: Record<string, () => React.ReactNode> = {
    summary: () => personal.summary ? (
      <div className={`cv-classic__section${p?.summary ? ' cv-placeholder' : ''}`}>
        <h2>{labels.profile}</h2>
        <p>{personal.summary}</p>
      </div>
    ) : <></>,
    experience: () => experience.length > 0 ? (
      <div className={`cv-classic__section${p?.experience ? ' cv-placeholder' : ''}`}>
        <h2>{labels.experience}</h2>
        {experience.map((exp) => (
          <div key={exp.id} className="cv-entry">
            <div className="cv-entry__header">
              <div>
                <strong>{exp.role}</strong>, {exp.company}
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
    ) : <></>,
    education: () => education.length > 0 ? (
      <div className={`cv-classic__section${p?.education ? ' cv-placeholder' : ''}`}>
        <h2>{labels.education}</h2>
        {education.map((edu) => (
          <div key={edu.id} className="cv-entry">
            <div className="cv-entry__header">
              <div>
                <strong>{edu.degree}{edu.field ? ` in ${edu.field}` : ''}</strong>, {edu.institution}
              </div>
              <span className="cv-entry__dates">{formatDate(edu.endDate, locale)}</span>
            </div>
            {edu.grade && <p className="cv-entry__grade">{labels.grade}: {edu.grade}</p>}
          </div>
        ))}
      </div>
    ) : <></>,
    skills: () => (skills.length > 0 || languages.length > 0) ? (
      <div className={`cv-classic__section${p?.skills && p?.languages ? ' cv-placeholder' : ''}`}>
        <h2>{labels.skillsAndLanguages}</h2>
        {skills.map((group) => (
          <div key={group.id} className="cv-classic__skill-row">
            {group.category && <strong>{group.category}: </strong>}
            <span>{group.items.join(', ')}</span>
          </div>
        ))}
        {languages.length > 0 && (
          <div className="cv-classic__skill-row">
            <strong>{labels.languages}: </strong>
            <span>{languages.map((l) => `${l.language} (${l.level})`).join(', ')}</span>
          </div>
        )}
      </div>
    ) : <></>,
    languages: () => null,
    certifications: () => certifications.length > 0 ? (
      <div className={`cv-classic__section${p?.certifications ? ' cv-placeholder' : ''}`}>
        <h2>{labels.certifications}</h2>
        {certifications.map((cert) => (
          <div key={cert.id} className="cv-entry">
            <div className="cv-entry__header">
              <div>
                <strong>{cert.title}</strong>
                {cert.institution && <span>, {cert.institution}</span>}
              </div>
              <span className="cv-entry__dates">{formatDate(cert.date, locale)}</span>
            </div>
            {cert.description && <p className="cv-entry__grade">{cert.description}</p>}
          </div>
        ))}
      </div>
    ) : <></>,
    interests: () => interests.length > 0 ? (
      <div className={`cv-classic__section${p?.interests ? ' cv-placeholder' : ''}`}>
        <h2>{labels.interests}</h2>
        <div className="cv-classic__skill-row">{interests.join(', ')}</div>
      </div>
    ) : <></>,
  }

  return (
    <div className="cv-template cv-classic">
      <div className="cv-classic__header" data-cv-section="personal">
        <div className="cv-classic__header-main">
          <div className="cv-classic__header-text">
            {personal.name && <h1 className={p?.name ? 'cv-placeholder' : ''}>{personal.name}</h1>}
            {personal.title && <div className={`cv-classic__subtitle${p?.title ? ' cv-placeholder' : ''}`}>{personal.title}</div>}
            <div className={`cv-classic__contact${p?.contact ? ' cv-placeholder' : ''}`}>
              {[personal.email, formatPhone(personal.phone), location].filter(Boolean).join(' · ')}
            </div>
            {(personal.website || personal.linkedin || personal.github) && (
              <div className="cv-classic__links">
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
            )}
          </div>
          <CvPhoto personal={personal} className="cv-photo cv-classic__photo" />
        </div>
      </div>

      <hr className="cv-classic__rule" />

      {details.length > 0 && (
        <div className="cv-classic__details-bar">
          {details.join(' · ')}
        </div>
      )}

      {sectionOrder.map((id) => {
        const render = sections[id]
        return render ? <div key={id} data-cv-section={id}>{render()}</div> : null
      })}
    </div>
  )
}
