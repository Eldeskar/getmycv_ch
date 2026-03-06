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

export function MinimalTemplate({ cv, placeholders: p, sectionOrder, labels, locale }: Props) {
  const { personal, experience, education, skills, languages, certifications, interests } = cv
  const location = cityCountry(personal.city, personal.country)
  const details = [
    personal.birthday && formatBirthday(personal.birthday, locale),
    personal.nationality,
    personal.driversLicense && `Licence ${personal.driversLicense}`,
  ].filter(Boolean)

  const sections: Record<string, () => React.ReactNode> = {
    summary: () =>
      personal.summary ? (
        <div className={p?.summary ? 'cv-placeholder' : ''}>
          <div className="cv-minimal__divider" />
          <p className="cv-minimal__summary">{personal.summary}</p>
        </div>
      ) : null,

    experience: () =>
      experience.length > 0 ? (
        <div className={p?.experience ? 'cv-placeholder' : ''}>
          <div className="cv-minimal__divider" />
          <h2 className="cv-minimal__section-title">{labels.experience}</h2>
          {experience.map((exp) => (
            <div key={exp.id} className="cv-minimal__entry">
              <div className="cv-minimal__entry-meta">
                <span className="cv-minimal__entry-dates">
                  {formatDate(exp.startDate, locale)} – {exp.current ? labels.present : formatDate(exp.endDate, locale)}
                </span>
              </div>
              <div className="cv-minimal__entry-body">
                <div className="cv-minimal__entry-title">
                  {exp.role} <span className="cv-minimal__at">at</span> {exp.company}
                </div>
                {exp.bullets.filter(Boolean).length > 0 && (
                  <ul className="cv-bullets cv-bullets--minimal">
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
        <div className={p?.education ? 'cv-placeholder' : ''}>
          <div className="cv-minimal__divider" />
          <h2 className="cv-minimal__section-title">{labels.education}</h2>
          {education.map((edu) => (
            <div key={edu.id} className="cv-minimal__entry">
              <div className="cv-minimal__entry-meta">
                <span className="cv-minimal__entry-dates">{formatDate(edu.endDate, locale)}</span>
              </div>
              <div className="cv-minimal__entry-body">
                <div className="cv-minimal__entry-title">
                  {edu.degree}{edu.field ? ` · ${edu.field}` : ''} <span className="cv-minimal__at">—</span> {edu.institution}
                </div>
                {edu.grade && <div className="cv-entry__grade">{edu.grade}</div>}
              </div>
            </div>
          ))}
        </div>
      ) : null,

    skills: () =>
      (skills.length > 0 || languages.length > 0) ? (
        <div className={p?.skills && p?.languages ? 'cv-placeholder' : ''}>
          <div className="cv-minimal__divider" />
          <h2 className="cv-minimal__section-title">{labels.skills}</h2>
          <div className="cv-minimal__skills">
            {skills.map((group) => (
              <div key={group.id}>
                {group.category && <span className="cv-minimal__skill-cat">{group.category}: </span>}
                {group.items.join(', ')}
              </div>
            ))}
            {languages.length > 0 && (
              <div>
                <span className="cv-minimal__skill-cat">{labels.languages}: </span>
                {languages.map((l) => `${l.language} (${l.level})`).join(' · ')}
              </div>
            )}
          </div>
        </div>
      ) : null,

    languages: () => null,

    certifications: () =>
      certifications.length > 0 ? (
        <div className={p?.certifications ? 'cv-placeholder' : ''}>
          <div className="cv-minimal__divider" />
          <h2 className="cv-minimal__section-title">{labels.certifications}</h2>
          {certifications.map((cert) => (
            <div key={cert.id} className="cv-minimal__entry">
              <div className="cv-minimal__entry-meta">
                <span className="cv-minimal__entry-dates">{formatDate(cert.date, locale)}</span>
              </div>
              <div className="cv-minimal__entry-body">
                <div className="cv-minimal__entry-title">
                  {cert.title}
                  {cert.institution && <> <span className="cv-minimal__at">·</span> {cert.institution}</>}
                </div>
                {cert.description && <div className="cv-entry__grade">{cert.description}</div>}
              </div>
            </div>
          ))}
        </div>
      ) : null,

    interests: () =>
      interests.length > 0 ? (
        <div className={p?.interests ? 'cv-placeholder' : ''}>
          <div className="cv-minimal__divider" />
          <h2 className="cv-minimal__section-title">{labels.interests}</h2>
          <div className="cv-minimal__skills">{interests.join(' · ')}</div>
        </div>
      ) : null,

    projects: () => null,
  }

  return (
    <div className="cv-template cv-minimal">
      <div className="cv-minimal__header" data-cv-section="personal">
        <div className="cv-minimal__header-text">
          {personal.name && <h1 className={p?.name ? 'cv-placeholder' : ''}>{personal.name}</h1>}
          {personal.title && <div className={`cv-minimal__job-title${p?.title ? ' cv-placeholder' : ''}`}>{personal.title}</div>}
          <div className={`cv-minimal__meta${p?.contact ? ' cv-placeholder' : ''}`}>
            {[location, personal.email, formatPhone(personal.phone)].filter(Boolean).join(' / ')}
          </div>
          {(personal.website || personal.linkedin || personal.github) && (
            <div className="cv-minimal__links">
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
          {details.length > 0 && (
            <div className="cv-minimal__details">{details.join(' · ')}</div>
          )}
        </div>
        <CvPhoto personal={personal} className="cv-photo cv-minimal__photo" />
      </div>

      {sectionOrder.map((id) => {
        const render = sections[id]
        return render ? <div key={id} data-cv-section={id}>{render()}</div> : null
      })}
    </div>
  )
}
