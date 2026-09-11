import { useCallback, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import type {
  Application, ApplicationStage, Candidate, DemoRole,
  ManagerProfile, ShortlistEntry, ShortlistStage,
} from '@/types'
import { storageService } from '@/services/storage'
import { SEED_MANAGERS } from '@/data/recruiters'
import { DEMO_APPLICATIONS, DEMO_CANDIDATE, DEMO_SAVED_CANDIDATE_IDS } from '@/data/demoProfile'
import { DemoSessionContext, type DemoSessionValue } from '@/hooks/demoSessionContext'

/**
 * Single source of truth for demo state.
 *
 * Everything is mirrored into localStorage through `storageService`, so a page
 * refresh restores the exact same session.
 *
 * On a visitor's very first run the full demo dataset is planted: a sample
 * candidate profile, a recruiter shortlist and the manager profiles: so every
 * screen has content immediately and the product can be demonstrated without
 * filling in the onboarding wizard first. The planting happens once (guarded by
 * a `seeded` flag), so clearing the sample profile makes it stay cleared.
 */

/** Writes the whole demo dataset to storage. Safe to call repeatedly. */
function plantDemoData(): void {
  storageService.saveCandidate(DEMO_CANDIDATE)
  DEMO_SAVED_CANDIDATE_IDS.forEach((id, index) => {
    storageService.saveCandidateForRecruiter(id)
    // Trải sẵn vài trạng thái để bảng theo dõi không trống trơn khi demo.
    storageService.setShortlistStage(id, (['contacted', 'interview', 'saved'] as const)[index] ?? 'saved')
  })
  DEMO_APPLICATIONS.forEach((app) => storageService.saveApplication(app))
  SEED_MANAGERS.forEach((profile) => storageService.saveManagerProfile(profile))
  storageService.setActiveManagerId(SEED_MANAGERS[0]?.id ?? null)
  storageService.markSeeded()
}

/** Plants the dataset on first run only, then reports the resulting state. */
function ensureSeeded(): void {
  if (storageService.hasSeeded()) return
  plantDemoData()
}
export function DemoSessionProvider({ children }: { children: ReactNode }) {
  // Runs before any useState initialiser below, so the first paint already has data.
  ensureSeeded()

  const [role, setRoleState] = useState<DemoRole | null>(() => storageService.loadRole())
  const [candidate, setCandidateState] = useState<Candidate | null>(() => storageService.loadCandidate())
  const [savedIds, setSavedIds] = useState<string[]>(() => storageService.loadSavedCandidateIds())
  const [shortlist, setShortlist] = useState<ShortlistEntry[]>(() => storageService.loadShortlist())
  const [applications, setApplications] = useState<Application[]>(() => storageService.loadApplications())
  const [managers, setManagers] = useState<ManagerProfile[]>(() => {
    const stored = storageService.loadManagerProfiles()
    return stored.length > 0 ? stored : SEED_MANAGERS
  })
  const [activeManagerId, setActiveManagerIdState] = useState<string | null>(() => {
    const stored = storageService.getActiveManagerId()
    if (stored) return stored
    const profiles = storageService.loadManagerProfiles()
    return (profiles[0] ?? SEED_MANAGERS[0])?.id ?? null
  })

  const setRole = useCallback((next: DemoRole | null) => {
    setRoleState(next)
    storageService.saveRole(next)
  }, [])

  const saveCandidate = useCallback((next: Candidate) => {
    setCandidateState(next)
    storageService.saveCandidate(next)
  }, [])

  const clearCandidate = useCallback(() => {
    setCandidateState(null)
    storageService.clearCandidate()
    storageService.clearDraft()
    // Keep the seeded flag set: an explicit clear must not be undone on reload.
    storageService.markSeeded()
  }, [])

  /** Same as clearing, but named for the intent: demo the wizard from scratch. */
  const startBlankProfile = useCallback(() => {
    setCandidateState(null)
    storageService.clearCandidate()
    storageService.clearDraft()
    storageService.markSeeded()
  }, [])

  const loadDemoData = useCallback(() => {
    plantDemoData()
    setCandidateState(DEMO_CANDIDATE)
    setSavedIds(storageService.loadSavedCandidateIds())
    setManagers(storageService.loadManagerProfiles())
    setActiveManagerIdState(storageService.getActiveManagerId())
  }, [])

  const toggleSaved = useCallback((candidateId: string) => {
    setSavedIds((current) => {
      if (current.includes(candidateId)) {
        setShortlist(storageService.removeShortlist(candidateId))
        return storageService.removeSavedCandidate(candidateId)
      }
      setShortlist(storageService.setShortlistStage(candidateId, 'saved'))
      return storageService.saveCandidateForRecruiter(candidateId)
    })
  }, [])

  const shortlistOf = useCallback(
    (candidateId: string) => shortlist.find((e) => e.candidateId === candidateId),
    [shortlist],
  )

  const setShortlistStage = useCallback((candidateId: string, stage: ShortlistStage) => {
    setShortlist(storageService.setShortlistStage(candidateId, stage))
    setSavedIds(storageService.saveCandidateForRecruiter(candidateId))
  }, [])

  const setShortlistNote = useCallback((candidateId: string, note: string) => {
    setShortlist(storageService.setShortlistNote(candidateId, note))
  }, [])

  const applicationFor = useCallback(
    (jobId: string) => applications.find((a) => a.jobId === jobId),
    [applications],
  )

  const applyToJob = useCallback((jobId: string, coverNote: string) => {
    const now = new Date().toISOString()
    setApplications(
      storageService.saveApplication({
        id: `app-${jobId}-${Date.now()}`,
        jobId,
        candidateId: 'me',
        stage: 'applied',
        appliedAt: now,
        coverNote,
        recruiterNote: '',
        updatedAt: now,
      }),
    )
  }, [])

  const withdrawApplication = useCallback((id: string) => {
    setApplications(storageService.withdrawApplication(id))
  }, [])

  const setApplicationStage = useCallback(
    (id: string, stage: ApplicationStage, note?: string) => {
      setApplications(storageService.updateApplicationStage(id, stage, note))
    },
    [],
  )

  const isSaved = useCallback(
    (candidateId: string) => savedIds.includes(candidateId),
    [savedIds],
  )

  const addManager = useCallback((profile: ManagerProfile) => {
    setManagers(storageService.saveManagerProfile(profile))
    setActiveManagerIdState(profile.id)
  }, [])

  const removeManager = useCallback((id: string) => {
    const next = storageService.removeManagerProfile(id)
    setManagers(next)
    setActiveManagerIdState(storageService.getActiveManagerId())
  }, [])

  const setActiveManagerId = useCallback((id: string | null) => {
    setActiveManagerIdState(id)
    storageService.setActiveManagerId(id)
  }, [])

  const resetDemo = useCallback(() => {
    storageService.resetDemo()
    plantDemoData()
    setRoleState(null)
    setCandidateState(DEMO_CANDIDATE)
    setSavedIds(storageService.loadSavedCandidateIds())
    setShortlist(storageService.loadShortlist())
    setApplications(storageService.loadApplications())
    setManagers(storageService.loadManagerProfiles())
    setActiveManagerIdState(storageService.getActiveManagerId())
  }, [])

  const value = useMemo<DemoSessionValue>(
    () => ({
      role,
      setRole,
      candidate,
      saveCandidate,
      clearCandidate,
      isSampleProfile: candidate?.isSample === true,
      startBlankProfile,
      loadDemoData,
      savedIds,
      toggleSaved,
      isSaved,
      shortlist,
      shortlistOf,
      setShortlistStage,
      setShortlistNote,
      applications,
      applicationFor,
      applyToJob,
      withdrawApplication,
      setApplicationStage,
      managers,
      activeManagerId,
      activeManager: managers.find((m) => m.id === activeManagerId) ?? managers[0] ?? null,
      addManager,
      removeManager,
      setActiveManagerId,
      resetDemo,
    }),
    [
      role,
      setRole,
      candidate,
      saveCandidate,
      clearCandidate,
      startBlankProfile,
      loadDemoData,
      savedIds,
      toggleSaved,
      isSaved,
      shortlist,
      shortlistOf,
      setShortlistStage,
      setShortlistNote,
      applications,
      applicationFor,
      applyToJob,
      withdrawApplication,
      setApplicationStage,
      managers,
      activeManagerId,
      addManager,
      removeManager,
      setActiveManagerId,
      resetDemo,
    ],
  )

  return <DemoSessionContext.Provider value={value}>{children}</DemoSessionContext.Provider>
}
