import type { CandidateSearchFilters } from '@/types'

/** Neutral filter state: nothing constrained, nothing scored. */
export const EMPTY_FILTERS: CandidateSearchFilters = {
  query: '',
  skills: [],
  careerGroups: [],
  seniority: [],
  locations: [],
  minYears: 0,
  maxYears: 20,
  degrees: [],
  salaryMax: 0,
  workModes: [],
  traits: {},
}

/** Count of active constraints: shown on the mobile "Bộ lọc" button. */
export function countActiveFilters(filters: CandidateSearchFilters): number {
  return (
    (filters.query ? 1 : 0) +
    filters.skills.length +
    filters.careerGroups.length +
    filters.seniority.length +
    filters.locations.length +
    filters.degrees.length +
    filters.workModes.length +
    (filters.minYears > 0 ? 1 : 0) +
    (filters.maxYears < 20 ? 1 : 0) +
    (filters.salaryMax > 0 ? 1 : 0) +
    Object.keys(filters.traits).length
  )
}
