import type {
  Candidate,
  CandidateMatchResult,
  CandidateSearchFilters,
  Career,
  CareerRecommendation,
  ManagerProfile,
  SortKey,
} from '@/types'

/** All tunable weights live here: never inline in a component or engine body. */
export interface MatchingConfig {
  /** Candidate → career recommendation. */
  careerMatch: {
    skills: number
    experience: number
    profile: number
  }
  /** Recruiter compatibility search (manager ↔ candidate). */
  compatibilitySearch: {
    skills: number
    career: number
    compatibility: number
  }
  /** Recruiter profile search (desired trait shape ↔ candidate). */
  profileSearch: {
    skills: number
    experience: number
    profile: number
  }
  /** How much a bonus (nice-to-have) skill counts vs a core skill. */
  bonusSkillWeight: number
  /** Years of experience considered "fully experienced" for a senior role. */
  experienceSaturationYears: number
  /** Minimum overall score for a candidate to appear in recruiter results. */
  minimumResultScore: number
  /** Points added when a career's field matches the star archetype's affinity. */
  starAffinityBonus: number
}

export interface MatchingEngineApi {
  calculateSkillMatch(candidate: Candidate, career: Career): number
  calculateExperienceMatch(candidate: Candidate, career: Career): number
  calculateCareerProfileMatch(candidate: Candidate, career: Career): number
  calculateAstrologyPatternMatch(candidate: Candidate, desired: Partial<Record<string, number>>): number
  calculateCompatibility(candidate: Candidate, manager: ManagerProfile): number
  calculateOverallMatch(candidate: Candidate, career: Career): number
  recommendCareers(candidate: Candidate, limit?: number): CareerRecommendation[]
  searchByProfile(
    candidates: Candidate[],
    filters: CandidateSearchFilters,
    sort: SortKey,
  ): CandidateMatchResult[]
  searchByCompatibility(
    candidates: Candidate[],
    manager: ManagerProfile,
    filters: CandidateSearchFilters,
    sort: SortKey,
  ): CandidateMatchResult[]
}
