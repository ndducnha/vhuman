import { useMemo } from 'react'
import type { Candidate } from '@/types'
import { SEED_CANDIDATES } from '@/data/candidates'
import { useDemoSession } from '@/hooks/demoSessionContext'

/**
 * The candidate pool a recruiter searches over: the seeded demo people plus,
 * when the visitor has built their own profile, that profile too: which makes
 * the "switch role and find yourself" demo moment work.
 */
export function useCandidatePool(): Candidate[] {
  const { candidate } = useDemoSession()
  return useMemo(() => {
    if (!candidate) return SEED_CANDIDATES
    return [candidate, ...SEED_CANDIDATES]
  }, [candidate])
}

export function useCandidateById(id: string | undefined): Candidate | undefined {
  const pool = useCandidatePool()
  return useMemo(() => pool.find((c) => c.id === id), [pool, id])
}
