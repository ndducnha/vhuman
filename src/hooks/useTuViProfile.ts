import { useMemo } from 'react'
import type { Candidate } from '@/types'
import type { TuViCareerProfile } from '@/types/tuvi'
import { tuviCareerEngine } from '@/services/astrology'
import { calculateCareerFit, type CareerFitResult } from '@/services/matching'
import { CAREERS } from '@/data/careers'

/** Hồ sơ nghề nghiệp suy từ lá số. Trả về undefined khi chưa đủ dữ liệu sinh. */
export function useTuViProfile(candidate: Candidate | null): TuViCareerProfile | undefined {
  return useMemo(() => {
    if (!candidate?.personal.birthDate) return undefined
    return tuviCareerEngine.classifyCareerProfile({
      birthDate: candidate.personal.birthDate,
      birthTime: candidate.personal.birthTime,
      birthPlace: candidate.personal.birthPlace,
      gender: candidate.personal.gender,
    })
  }, [candidate])
}

/** Gợi ý nghề nghiệp theo công thức ba lớp, đã sắp giảm dần. */
export function useCareerFits(
  candidate: Candidate | null,
  tuvi: TuViCareerProfile | undefined,
  limit = CAREERS.length,
): CareerFitResult[] {
  return useMemo(() => {
    if (!candidate) return []
    return CAREERS.map((career) => calculateCareerFit(candidate, career, tuvi))
      .sort((a, b) => b.overall - a.overall)
      .slice(0, limit)
  }, [candidate, tuvi, limit])
}
