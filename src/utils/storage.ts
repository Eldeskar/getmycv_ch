import { AppState, EMPTY_CV, TemplateId, DEFAULT_STYLE } from '../types/cv'

const STORAGE_KEY = 'getmycv_state'
const BANNER_DISMISSED_KEY = 'getmycv_banner_dismissed'

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
    const parsed = JSON.parse(raw) as AppState
    // Merge with defaults to handle schema additions gracefully
    const cv = { ...EMPTY_CV, ...parsed.cv, personal: { ...EMPTY_CV.personal, ...parsed.cv?.personal } }
    // Migrate skills without levels field
    if (cv.skills) {
      cv.skills = cv.skills.map((g) => ({ ...g, levels: g.levels ?? {} }))
    }
    return {
      cv,
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
    const parsed = JSON.parse(raw) as AppState
    return parsed.cv?.personal?.name?.trim().length > 0
  } catch {
    return false
  }
}

function defaultState(): AppState {
  return {
    cv: EMPTY_CV,
    selectedTemplate: 'modern' as TemplateId,
    styleSettings: DEFAULT_STYLE,
    lastSaved: null,
  }
}
