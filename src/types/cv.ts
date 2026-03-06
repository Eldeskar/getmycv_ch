export type CVLanguage = 'en' | 'de' | 'fr' | 'it'

export const CV_LANGUAGES: { code: CVLanguage; label: string }[] = [
  { code: 'en', label: 'English' },
  { code: 'de', label: 'Deutsch' },
  { code: 'fr', label: 'Français' },
  { code: 'it', label: 'Italiano' },
]

/** A string that can have different values per language. */
export type LocalizedString = Partial<Record<CVLanguage, string>>

/** An array of strings that can differ per language. */
export type LocalizedStringArray = Partial<Record<CVLanguage, string[]>>

export interface PersonalInfo {
  // Identity
  name: string
  title: LocalizedString    // desired job title / role shown below name
  photo: string             // base64 data URL (compressed in browser)
  photoZoom: number         // 1 = no zoom, 1.5 = 150%, etc.
  photoOffsetX: number      // horizontal offset in % (-50 to 50)
  photoOffsetY: number      // vertical offset in % (-50 to 50)
  photoGrayscale: boolean   // render photo in black & white

  // Contact
  email: string
  phone: string

  // Address
  address: string           // street + number
  zip: string
  city: string
  country: string

  // Online
  website: string
  linkedin: string
  github: string

  // Personal details
  birthday: string          // YYYY-MM-DD
  nationality: string
  driversLicense: string    // e.g. "B", "A, B"

  // Summary
  summary: LocalizedString
}

export interface ExperienceEntry {
  id: string
  company: string
  role: LocalizedString
  location: string
  startDate: string
  endDate: string
  current: boolean
  bullets: LocalizedStringArray
}

export interface EducationEntry {
  id: string
  institution: string
  degree: LocalizedString
  field: LocalizedString
  startDate: string
  endDate: string
  grade: string
}

export interface SkillGroup {
  id: string
  category: LocalizedString
  items: string[]
  levels: Record<string, number>  // skill name → 1-10 rating (optional per skill)
}

export interface LanguageEntry {
  id: string
  language: string
  level: string
}

export interface ProjectEntry {
  id: string
  name: string
  description: string
  url: string
  technologies: string[]
}

export interface CertificationEntry {
  id: string
  title: LocalizedString
  institution: string
  date: string
  description: LocalizedString
}

export interface CV {
  personal: PersonalInfo
  experience: ExperienceEntry[]
  education: EducationEntry[]
  skills: SkillGroup[]
  languages: LanguageEntry[]
  projects: ProjectEntry[]
  certifications: CertificationEntry[]
  interests: LocalizedStringArray
}

export type TemplateId = 'classic' | 'modern' | 'minimal' | 'executive' | 'professional' | 'creative' | 'original' | 'sharp' | 'elegant'

export type CVSectionId = 'summary' | 'experience' | 'education' | 'skills' | 'languages' | 'certifications' | 'projects' | 'interests'

export interface StyleSettings {
  fontFamily: string
  accentColor: string
  fontSize: number
  sectionOrder: CVSectionId[]
  spacedLayout: boolean
}

export const DEFAULT_STYLE: StyleSettings = {
  fontFamily: 'system-ui, -apple-system, sans-serif',
  accentColor: '#1e2a3a',
  fontSize: 100,
  sectionOrder: ['summary', 'experience', 'education', 'skills', 'languages', 'certifications', 'projects', 'interests'],
  spacedLayout: false,
}

export interface AppState {
  cv: CV
  cvLanguage: CVLanguage
  selectedTemplate: TemplateId
  styleSettings: StyleSettings
  lastSaved: number | null
}

export const EMPTY_CV: CV = {
  personal: {
    name: '',
    title: {},
    photo: '',
    photoZoom: 1,
    photoOffsetX: 0,
    photoOffsetY: 0,
    photoGrayscale: false,
    email: '',
    phone: '',
    address: '',
    zip: '',
    city: '',
    country: '',
    website: '',
    linkedin: '',
    github: '',
    birthday: '',
    nationality: '',
    driversLicense: '',
    summary: {},
  },
  experience: [],
  education: [],
  skills: [],
  languages: [],
  projects: [],
  certifications: [],
  interests: {},
}
