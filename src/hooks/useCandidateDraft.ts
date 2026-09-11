import { useCallback, useEffect, useRef, useState } from 'react'
import type { CandidateDraft } from '@/types'
import { storageService } from '@/services/storage'

export const EMPTY_DRAFT: CandidateDraft = {
  step: 0,
  personal: {
    fullName: '',
    gender: 'female',
    birthDate: '',
    birthTime: '',
    birthPlace: '',
    currentCity: '',
    email: '',
    phone: '',
    avatar: '',
  },
  education: [],
  experience: [],
  skills: [],
  preference: {
    industries: [],
    desiredTitle: '',
    seniority: 'middle',
    workModes: ['hybrid'],
    preferredLocations: [],
    salaryMin: 20,
    salaryMax: 35,
  },
  updatedAt: '',
}

/**
 * Wizard state with automatic localStorage persistence.
 * Refreshing the page mid-onboarding keeps everything already entered.
 */
export function useCandidateDraft() {
  const [draft, setDraft] = useState<CandidateDraft>(() => {
    const stored = storageService.loadDraft()
    if (!stored) return EMPTY_DRAFT
    return {
      ...EMPTY_DRAFT,
      ...stored,
      personal: { ...EMPTY_DRAFT.personal, ...stored.personal },
      preference: { ...EMPTY_DRAFT.preference, ...stored.preference },
    }
  })

  const [savedAt, setSavedAt] = useState<string | null>(null)
  const first = useRef(true)

  // Persist on every change, but skip the initial mount so an untouched
  // wizard doesn't write an empty draft.
  useEffect(() => {
    if (first.current) {
      first.current = false
      return
    }
    const next = { ...draft, updatedAt: new Date().toISOString() }
    storageService.saveDraft(next)
  }, [draft])

  const update = useCallback((patch: Partial<CandidateDraft>) => {
    setDraft((current) => ({ ...current, ...patch }))
  }, [])

  const saveNow = useCallback(() => {
    const stamp = new Date().toISOString()
    storageService.saveDraft({ ...draft, updatedAt: stamp })
    setSavedAt(stamp)
  }, [draft])

  const reset = useCallback(() => {
    storageService.clearDraft()
    setDraft(EMPTY_DRAFT)
    setSavedAt(null)
  }, [])

  return { draft, setDraft, update, saveNow, savedAt, reset }
}
