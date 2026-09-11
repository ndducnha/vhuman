import { createContext, useContext } from 'react'
import type {
  Application, ApplicationStage, Candidate, DemoRole,
  ManagerProfile, ShortlistEntry, ShortlistStage,
} from '@/types'

export interface DemoSessionValue {
  role: DemoRole | null
  setRole: (role: DemoRole | null) => void

  candidate: Candidate | null
  saveCandidate: (candidate: Candidate) => void
  clearCandidate: () => void
  /** True while the visitor is still looking at the pre-loaded sample profile. */
  isSampleProfile: boolean
  /** Drops the sample profile so the onboarding wizard can be demonstrated. */
  startBlankProfile: () => void
  /** Re-plants the full demo dataset without touching anything else. */
  loadDemoData: () => void

  savedIds: string[]
  toggleSaved: (candidateId: string) => void
  isSaved: (candidateId: string) => boolean

  /** Shortlist với trạng thái theo dõi, thay cho danh sách id đơn thuần. */
  shortlist: ShortlistEntry[]
  shortlistOf: (candidateId: string) => ShortlistEntry | undefined
  setShortlistStage: (candidateId: string, stage: ShortlistStage) => void
  setShortlistNote: (candidateId: string, note: string) => void

  applications: Application[]
  applicationFor: (jobId: string) => Application | undefined
  applyToJob: (jobId: string, coverNote: string) => void
  withdrawApplication: (id: string) => void
  setApplicationStage: (id: string, stage: ApplicationStage, note?: string) => void

  managers: ManagerProfile[]
  activeManagerId: string | null
  activeManager: ManagerProfile | null
  addManager: (profile: ManagerProfile) => void
  removeManager: (id: string) => void
  setActiveManagerId: (id: string | null) => void

  resetDemo: () => void
}

export const DemoSessionContext = createContext<DemoSessionValue | null>(null)

export function useDemoSession(): DemoSessionValue {
  const context = useContext(DemoSessionContext)
  if (!context) {
    throw new Error('useDemoSession must be used inside <DemoSessionProvider>')
  }
  return context
}
