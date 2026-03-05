import { useCallback, useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { CV } from '../../types/cv'
import { PersonalSection } from './PersonalSection'
import { ExperienceSection } from './ExperienceSection'
import { EducationSection } from './EducationSection'
import { SkillsSection } from './SkillsSection'

type Tab = 'personal' | 'experience' | 'education' | 'skills'
const TAB_IDS: Tab[] = ['personal', 'experience', 'education', 'skills']

const SECTION_TO_TAB: Record<string, Tab> = {
  summary: 'personal',
  experience: 'experience',
  education: 'education',
  certifications: 'education',
  skills: 'skills',
  languages: 'skills',
  interests: 'skills',
  projects: 'skills',
}

interface Props {
  cv: CV
  onChange: (cv: CV) => void
}

export function Editor({ cv, onChange }: Props) {
  const { t } = useTranslation()
  const [activeTab, setActiveTab] = useState<Tab>('personal')
  const contentRef = useRef<HTMLDivElement>(null)
  const [fade, setFade] = useState({ top: false, bottom: false })

  const updateFade = useCallback(() => {
    const el = contentRef.current
    if (!el) return
    setFade({
      top: el.scrollTop > 8,
      bottom: el.scrollTop + el.clientHeight < el.scrollHeight - 8,
    })
  }, [])

  useEffect(() => {
    const el = contentRef.current
    if (!el) return
    el.addEventListener('scroll', updateFade, { passive: true })
    const ro = new ResizeObserver(updateFade)
    ro.observe(el)
    updateFade()
    return () => {
      el.removeEventListener('scroll', updateFade)
      ro.disconnect()
    }
  }, [updateFade, activeTab])

  // Listen for inline-edit clicks from the preview
  useEffect(() => {
    function onEditSection(e: Event) {
      const section = (e as CustomEvent<string>).detail
      const tab = SECTION_TO_TAB[section]
      if (tab) setActiveTab(tab)
    }
    window.addEventListener('cv:edit-section', onEditSection)
    return () => window.removeEventListener('cv:edit-section', onEditSection)
  }, [])

  const fadeClass = fade.top && fade.bottom
    ? ' fade-both'
    : fade.top
      ? ' fade-top'
      : fade.bottom
        ? ' fade-bottom'
        : ''

  return (
    <div className="editor">
      <nav className="editor-tabs">
        {TAB_IDS.map((id) => (
          <button
            key={id}
            className={`editor-tab ${activeTab === id ? 'editor-tab--active' : ''}`}
            onClick={() => setActiveTab(id)}
          >
            {t(`editor.tabs.${id}`)}
          </button>
        ))}
      </nav>

      <div className={`editor-content${fadeClass}`} ref={contentRef}>
        {activeTab === 'personal' && (
          <PersonalSection
            data={cv.personal}
            onChange={(personal) => onChange({ ...cv, personal })}
          />
        )}
        {activeTab === 'experience' && (
          <ExperienceSection
            data={cv.experience}
            onChange={(experience) => onChange({ ...cv, experience })}
          />
        )}
        {activeTab === 'education' && (
          <EducationSection
            data={cv.education}
            certifications={cv.certifications}
            onChange={(education) => onChange({ ...cv, education })}
            onCertificationsChange={(certifications) => onChange({ ...cv, certifications })}
          />
        )}
        {activeTab === 'skills' && (
          <SkillsSection
            skills={cv.skills}
            languages={cv.languages}
            interests={cv.interests}
            onSkillsChange={(skills) => onChange({ ...cv, skills })}
            onLanguagesChange={(languages) => onChange({ ...cv, languages })}
            onInterestsChange={(interests) => onChange({ ...cv, interests })}
          />
        )}
      </div>
    </div>
  )
}
