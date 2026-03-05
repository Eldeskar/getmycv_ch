export interface PersonalInfo {
  // Identity
  name: string
  title: string           // desired job title / role shown below name
  photo: string           // base64 data URL (compressed in browser)
  photoZoom: number       // 1 = no zoom, 1.5 = 150%, etc.
  photoOffsetX: number    // horizontal offset in % (-50 to 50)
  photoOffsetY: number    // vertical offset in % (-50 to 50)
  photoGrayscale: boolean // render photo in black & white

  // Contact
  email: string
  phone: string

  // Address
  address: string         // street + number
  zip: string
  city: string
  country: string

  // Online
  website: string
  linkedin: string
  github: string

  // Personal details
  birthday: string        // YYYY-MM-DD
  nationality: string
  driversLicense: string  // e.g. "B", "A, B"

  // Summary
  summary: string
}

export interface ExperienceEntry {
  id: string
  company: string
  role: string
  location: string
  startDate: string
  endDate: string
  current: boolean
  bullets: string[]
}

export interface EducationEntry {
  id: string
  institution: string
  degree: string
  field: string
  startDate: string
  endDate: string
  grade: string
}

export interface SkillGroup {
  id: string
  category: string
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
  title: string
  institution: string
  date: string
  description: string
}

export interface CV {
  personal: PersonalInfo
  experience: ExperienceEntry[]
  education: EducationEntry[]
  skills: SkillGroup[]
  languages: LanguageEntry[]
  projects: ProjectEntry[]
  certifications: CertificationEntry[]
  interests: string[]
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
  selectedTemplate: TemplateId
  styleSettings: StyleSettings
  lastSaved: number | null
}

export const EMPTY_CV: CV = {
  personal: {
    name: '',
    title: '',
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
    summary: '',
  },
  experience: [],
  education: [],
  skills: [],
  languages: [],
  projects: [],
  certifications: [],
  interests: [],
}
