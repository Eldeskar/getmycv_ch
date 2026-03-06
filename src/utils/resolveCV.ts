import { CV, CVLanguage, LocalizedString, LocalizedStringArray } from '../types/cv'

/** Resolves a LocalizedString to a plain string for the given language. */
export function ls(value: LocalizedString, lang: CVLanguage): string {
  return value[lang] ?? value.en ?? Object.values(value).find((v) => v !== undefined) ?? ''
}

/** Resolves a LocalizedStringArray to a plain string[] for the given language. */
export function lsa(value: LocalizedStringArray, lang: CVLanguage): string[] {
  return value[lang] ?? value.en ?? Object.values(value).find((v) => v !== undefined) ?? []
}

/** Sets a language slot in a LocalizedString. */
export function setLs(value: LocalizedString, lang: CVLanguage, text: string): LocalizedString {
  return { ...value, [lang]: text }
}

/** Sets a language slot in a LocalizedStringArray. */
export function setLsa(value: LocalizedStringArray, lang: CVLanguage, items: string[]): LocalizedStringArray {
  return { ...value, [lang]: items }
}

/** A CV with all localized fields resolved to plain strings. Used by templates. */
export interface ResolvedCV {
  personal: {
    name: string
    title: string
    photo: string
    photoZoom: number
    photoOffsetX: number
    photoOffsetY: number
    photoGrayscale: boolean
    email: string
    phone: string
    address: string
    zip: string
    city: string
    country: string
    website: string
    linkedin: string
    github: string
    birthday: string
    nationality: string
    driversLicense: string
    summary: string
  }
  experience: {
    id: string
    company: string
    role: string
    location: string
    startDate: string
    endDate: string
    current: boolean
    bullets: string[]
  }[]
  education: {
    id: string
    institution: string
    degree: string
    field: string
    startDate: string
    endDate: string
    grade: string
  }[]
  skills: {
    id: string
    category: string
    items: string[]
    levels: Record<string, number>
  }[]
  languages: {
    id: string
    language: string
    level: string
  }[]
  projects: {
    id: string
    name: string
    description: string
    url: string
    technologies: string[]
  }[]
  certifications: {
    id: string
    title: string
    institution: string
    date: string
    description: string
  }[]
  interests: string[]
}

/** Resolves all localized fields in a CV for the given language. */
export function resolveCV(cv: CV, lang: CVLanguage): ResolvedCV {
  return {
    personal: {
      ...cv.personal,
      title: ls(cv.personal.title, lang),
      summary: ls(cv.personal.summary, lang),
    },
    experience: cv.experience.map((exp) => ({
      ...exp,
      role: ls(exp.role, lang),
      bullets: lsa(exp.bullets, lang),
    })),
    education: cv.education.map((edu) => ({
      ...edu,
      degree: ls(edu.degree, lang),
      field: ls(edu.field, lang),
    })),
    skills: cv.skills.map((group) => ({
      ...group,
      category: ls(group.category, lang),
    })),
    languages: cv.languages,
    projects: cv.projects,
    certifications: cv.certifications.map((cert) => ({
      ...cert,
      title: ls(cert.title, lang),
      description: ls(cert.description, lang),
    })),
    interests: lsa(cv.interests, lang),
  }
}
