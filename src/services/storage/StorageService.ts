import type {
  Candidate,
  CandidateDraft,
  DemoRole,
  ManagerProfile,
  Recruiter,
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
