import type {
  Application,
  ApplicationStage,
  Candidate,
  CandidateDraft,
  DemoRole,
  ManagerProfile,
  Milestone,
  Recruiter,
  ShortlistEntry,
  ShortlistStage,
} from '@/types'

/**
 * Namespaced localStorage wrapper.
 *
 * All demo state lives here so that "reset demo" is a single, reliable
 * operation, and so that swapping in a real API later means reimplementing
 * one module rather than hunting `localStorage` calls across components.
 */

const PREFIX = 'vhuman:v1:'

const KEYS = {
  candidate: `${PREFIX}candidate`,
  draft: `${PREFIX}draft`,
  savedCandidates: `${PREFIX}saved-candidates`,
  recruiter: `${PREFIX}recruiter`,
  managerProfiles: `${PREFIX}manager-profiles`,
  activeManager: `${PREFIX}active-manager`,
  role: `${PREFIX}role`,
  /** Set once the demo dataset has been planted, so it is not re-planted
   *  every load after the visitor deliberately cleared it. */
  seeded: `${PREFIX}seeded`,
  applications: `${PREFIX}applications`,
  shortlist: `${PREFIX}shortlist`,
  milestones: `${PREFIX}milestones`,
} as const

function read<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback
  try {
    const raw = window.localStorage.getItem(key)
    if (!raw) return fallback
    return JSON.parse(raw) as T
  } catch {
    // Corrupted or unavailable storage must never break the demo.
    return fallback
  }
}

function write(key: string, value: unknown): void {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(key, JSON.stringify(value))
  } catch {
    /* quota exceeded or storage disabled: the demo continues in memory */
  }
}

function remove(key: string): void {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.removeItem(key)
  } catch {
    /* ignore */
  }
}

class StorageService {
  /* ── Candidate profile ─────────────────────────────────────────── */

  saveCandidate(candidate: Candidate): void {
    write(KEYS.candidate, candidate)
  }

  loadCandidate(): Candidate | null {
    return read<Candidate | null>(KEYS.candidate, null)
  }

  clearCandidate(): void {
    remove(KEYS.candidate)
  }

  /* ── CV draft (onboarding wizard) ──────────────────────────────── */

  saveDraft(draft: CandidateDraft): void {
    write(KEYS.draft, draft)
  }

  loadDraft(): CandidateDraft | null {
    return read<CandidateDraft | null>(KEYS.draft, null)
  }

  clearDraft(): void {
    remove(KEYS.draft)
  }

  /* ── Recruiter: saved candidates ───────────────────────────────── */

  loadSavedCandidateIds(): string[] {
    return read<string[]>(KEYS.savedCandidates, [])
  }

  saveCandidateForRecruiter(candidateId: string): string[] {
    const current = this.loadSavedCandidateIds()
    if (current.includes(candidateId)) return current
    const next = [...current, candidateId]
    write(KEYS.savedCandidates, next)
    return next
  }

  removeSavedCandidate(candidateId: string): string[] {
    const next = this.loadSavedCandidateIds().filter((id) => id !== candidateId)
    write(KEYS.savedCandidates, next)
    return next
  }

  isCandidateSaved(candidateId: string): boolean {
    return this.loadSavedCandidateIds().includes(candidateId)
  }

  /* ── Ứng tuyển ─────────────────────────────────────────────────── */

  loadApplications(): Application[] {
    return read<Application[]>(KEYS.applications, [])
  }

  saveApplication(application: Application): Application[] {
    const current = this.loadApplications()
    const index = current.findIndex((a) => a.id === application.id)
    const next =
      index >= 0
        ? current.map((a) => (a.id === application.id ? application : a))
        : [application, ...current]
    write(KEYS.applications, next)
    return next
  }

  updateApplicationStage(id: string, stage: ApplicationStage, recruiterNote?: string): Application[] {
    const next = this.loadApplications().map((a) =>
      a.id === id
        ? { ...a, stage, recruiterNote: recruiterNote ?? a.recruiterNote, updatedAt: new Date().toISOString() }
        : a,
    )
    write(KEYS.applications, next)
    return next
  }

  withdrawApplication(id: string): Application[] {
    const next = this.loadApplications().filter((a) => a.id !== id)
    write(KEYS.applications, next)
    return next
  }

  /* ── Shortlist có trạng thái ───────────────────────────────────── */

  loadShortlist(): ShortlistEntry[] {
    return read<ShortlistEntry[]>(KEYS.shortlist, [])
  }

  upsertShortlist(entry: ShortlistEntry): ShortlistEntry[] {
    const current = this.loadShortlist()
    const index = current.findIndex((e) => e.candidateId === entry.candidateId)
    const next =
      index >= 0
        ? current.map((e) => (e.candidateId === entry.candidateId ? entry : e))
        : [entry, ...current]
    write(KEYS.shortlist, next)
    return next
  }

  setShortlistStage(candidateId: string, stage: ShortlistStage): ShortlistEntry[] {
    const now = new Date().toISOString()
    const current = this.loadShortlist()
    const found = current.find((e) => e.candidateId === candidateId)
    return this.upsertShortlist(
      found
        ? { ...found, stage, updatedAt: now }
        : { candidateId, stage, note: '', savedAt: now, updatedAt: now },
    )
  }

  setShortlistNote(candidateId: string, note: string): ShortlistEntry[] {
    const now = new Date().toISOString()
    const current = this.loadShortlist()
    const found = current.find((e) => e.candidateId === candidateId)
    return this.upsertShortlist(
      found
        ? { ...found, note, updatedAt: now }
        : { candidateId, stage: 'saved', note, savedAt: now, updatedAt: now },
    )
  }

  removeShortlist(candidateId: string): ShortlistEntry[] {
    const next = this.loadShortlist().filter((e) => e.candidateId !== candidateId)
    write(KEYS.shortlist, next)
    return next
  }

  /* ── Lộ trình ──────────────────────────────────────────────────── */

  loadMilestones(): Milestone[] {
    return read<Milestone[]>(KEYS.milestones, [])
  }

  saveMilestones(milestones: Milestone[]): void {
    write(KEYS.milestones, milestones)
  }

  /* ── Recruiter identity ────────────────────────────────────────── */

  saveRecruiter(recruiter: Recruiter): void {
    write(KEYS.recruiter, recruiter)
  }

  loadRecruiter(): Recruiter | null {
    return read<Recruiter | null>(KEYS.recruiter, null)
  }

  /* ── Manager / compatibility profiles ──────────────────────────── */

  loadManagerProfiles(): ManagerProfile[] {
    return read<ManagerProfile[]>(KEYS.managerProfiles, [])
  }

  saveManagerProfile(profile: ManagerProfile): ManagerProfile[] {
    const existing = this.loadManagerProfiles()
    const index = existing.findIndex((p) => p.id === profile.id)
    const next = index >= 0
      ? existing.map((p) => (p.id === profile.id ? profile : p))
      : [profile, ...existing]
    write(KEYS.managerProfiles, next)
    this.setActiveManagerId(profile.id)
    return next
  }

  removeManagerProfile(id: string): ManagerProfile[] {
    const next = this.loadManagerProfiles().filter((p) => p.id !== id)
    write(KEYS.managerProfiles, next)
    if (this.getActiveManagerId() === id) {
      this.setActiveManagerId(next[0]?.id ?? null)
    }
    return next
  }

  getActiveManagerId(): string | null {
    return read<string | null>(KEYS.activeManager, null)
  }

  setActiveManagerId(id: string | null): void {
    if (id === null) remove(KEYS.activeManager)
    else write(KEYS.activeManager, id)
  }

  /* ── First-run seeding ─────────────────────────────────────────── */

  hasSeeded(): boolean {
    return read<boolean>(KEYS.seeded, false)
  }

  markSeeded(): void {
    write(KEYS.seeded, true)
  }

  /* ── Demo session role ─────────────────────────────────────────── */

  saveRole(role: DemoRole | null): void {
    if (role === null) remove(KEYS.role)
    else write(KEYS.role, role)
  }

  loadRole(): DemoRole | null {
    return read<DemoRole | null>(KEYS.role, null)
  }

  /* ── Demo reset ────────────────────────────────────────────────── */

  /** Wipes every VHuman key. Seed data is static and reloads automatically. */
  resetDemo(): void {
    Object.values(KEYS).forEach(remove)
    if (typeof window === 'undefined') return
    // Defensive sweep in case an older schema version left keys behind.
    try {
      const stale: string[] = []
      for (let i = 0; i < window.localStorage.length; i += 1) {
        const key = window.localStorage.key(i)
        if (key && key.startsWith('vhuman:')) stale.push(key)
      }
      stale.forEach((key) => window.localStorage.removeItem(key))
    } catch {
      /* ignore */
    }
  }
}

export const storageService = new StorageService()
export { KEYS as STORAGE_KEYS }
