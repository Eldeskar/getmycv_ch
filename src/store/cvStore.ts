import { useState, useEffect, useCallback, useRef } from 'react'
import { AppState, CV, TemplateId, StyleSettings, CVLanguage } from '../types/cv'
import { loadState, saveState } from '../utils/storage'

const AUTOSAVE_DELAY_MS = 1000

export function useCVStore() {
  const [state, setState] = useState<AppState>(loadState)
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Debounced auto-save on every state change
  useEffect(() => {
    if (saveTimer.current) clearTimeout(saveTimer.current)
    saveTimer.current = setTimeout(() => {
      saveState({ ...state, lastSaved: Date.now() })
      setState((prev) => ({ ...prev, lastSaved: Date.now() }))
    }, AUTOSAVE_DELAY_MS)

    return () => {
      if (saveTimer.current) clearTimeout(saveTimer.current)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.cv, state.selectedTemplate, state.styleSettings, state.cvLanguage])

  const updateCV = useCallback((cv: CV) => {
    setState((prev) => ({ ...prev, cv }))
  }, [])

  const updateTemplate = useCallback((selectedTemplate: TemplateId) => {
    setState((prev) => ({ ...prev, selectedTemplate }))
  }, [])

  const updateStyleSettings = useCallback((styleSettings: StyleSettings) => {
    setState((prev) => ({ ...prev, styleSettings }))
  }, [])

  const switchCVLanguage = useCallback((newLang: CVLanguage) => {
    setState((prev) => ({ ...prev, cvLanguage: newLang }))
  }, [])

  const resetCV = useCallback(() => {
    setState(loadState())
  }, [])

  return {
    cv: state.cv,
    cvLanguage: state.cvLanguage,
    selectedTemplate: state.selectedTemplate,
    styleSettings: state.styleSettings,
    lastSaved: state.lastSaved,
    updateCV,
    updateTemplate,
    updateStyleSettings,
    switchCVLanguage,
    resetCV,
  }
}
