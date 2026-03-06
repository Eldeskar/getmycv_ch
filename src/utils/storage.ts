import { AppState, CV, EMPTY_CV, TemplateId, DEFAULT_STYLE, LocalizedString, LocalizedStringArray } from '../types/cv'

const STORAGE_KEY = 'getmycv_state'
const BANNER_DISMISSED_KEY = 'getmycv_banner_dismissed'

/** Wraps a plain string into a LocalizedString if it's not already one. */
function migrateString(value: unknown): LocalizedString {
  if (typeof value === 'string') return value ? { en: value } : {}
  if (value && typeof value === 'object') return value as LocalizedString
  return {}
}

/** Wraps a plain string[] into a LocalizedStringArray if it's not already one. */
function migrateStringArray(value: unknown): LocalizedStringArray {
  if (Array.isArray(value)) return value.length > 0 ? { en: value } : {}
  if (value && typeof value === 'object') return value as LocalizedStringArray
  return {}
}

/** Migrates a CV from old plain-string format to localized format. */
export function migrateCV(raw: Record<string, unknown>): CV {
  const personal = (raw.personal ?? {}) as Record<string, unknown>
  const cv: CV = {
    ...EMPTY_CV,
    personal: {
      ...EMPTY_CV.personal,
      ...(raw.personal as object),
      title: migrateString(personal.title),
      summary: migrateString(personal.summary),
    },
    experience: Array.isArray(raw.experience)
      ? raw.experience.map((exp: Record<string, unknown>) => ({
          ...exp,
          role: migrateString(exp.role),
          bullets: migrateStringArray(exp.bullets),
        })) as CV['experience']
      : [],
    education: Array.isArray(raw.education)
      ? raw.education.map((edu: Record<string, unknown>) => ({
          ...edu,
          degree: migrateString(edu.degree),
          field: migrateString(edu.field),
        })) as CV['education']
      : [],
    skills: Array.isArray(raw.skills)
      ? raw.skills.map((g: Record<string, unknown>) => ({
          ...g,
          category: migrateString(g.category),
          levels: g.levels ?? {},
        })) as CV['skills']
      : [],
    languages: (raw.languages ?? []) as CV['languages'],
    projects: (raw.projects ?? []) as CV['projects'],
    certifications: Array.isArray(raw.certifications)
      ? raw.certifications.map((cert: Record<string, unknown>) => ({
          ...cert,
          title: migrateString(cert.title),
          description: migrateString(cert.description),
        })) as CV['certifications']
      : [],
    interests: migrateStringArray(raw.interests),
  }
  return cv
}

export function saveState(state: AppState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch (e) {
    console.error('Failed to save to localStorage:', e)
  }
}

export function loadState(): AppState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return defaultState()
    const parsed = JSON.parse(raw)
    const cv = migrateCV(parsed.cv ?? {})
    return {
      cv,
      cvLanguage: parsed.cvLanguage ?? 'en',
      selectedTemplate: parsed.selectedTemplate ?? 'modern',
      styleSettings: { ...DEFAULT_STYLE, ...parsed.styleSettings },
      lastSaved: parsed.lastSaved ?? null,
    }
  } catch {
    return defaultState()
  }
}

export function clearState(): void {
  localStorage.removeItem(STORAGE_KEY)
}

export function isBannerDismissed(): boolean {
  return localStorage.getItem(BANNER_DISMISSED_KEY) === 'true'
}

export function dismissBanner(): void {
  localStorage.setItem(BANNER_DISMISSED_KEY, 'true')
}

export function hasExistingCV(): boolean {
  const raw = localStorage.getItem(STORAGE_KEY)
  if (!raw) return false
  try {
    const parsed = JSON.parse(raw)
    return parsed.cv?.personal?.name?.trim().length > 0
  } catch {
    return false
  }
}

function defaultState(): AppState {
  return {
    cv: EMPTY_CV,
    cvLanguage: 'en',
    selectedTemplate: 'modern' as TemplateId,
    styleSettings: DEFAULT_STYLE,
    lastSaved: null,
  }
}
