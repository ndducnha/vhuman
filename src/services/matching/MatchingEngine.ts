import type {
  Candidate,
  CandidateMatchResult,
  CandidateSearchFilters,
  Career,
  CareerRecommendation,
  CompatibilityResult,
  ManagerProfile,
  SortKey,
  TraitKey,
} from '@/types'
import { CAREERS } from '@/data/careers'
import { skillName } from '@/data/skills'
import { astrologyEngine } from '@/services/astrology'
import { bandOf, clamp, round, weighted } from '@/utils/score'
import {
  SENIORITY_YEARS,
  SKILL_LEVEL_WEIGHT,
  TRAIT_LABEL,
  TRAIT_ORDER,
} from '@/utils/format'
import { normalize } from '@/data/skills'
import { matchingConfig } from './config'
import type { MatchingEngineApi } from './types'

/**
 * VHuman's scoring engine.
 *
 * Every formula is deterministic and reads its weights from `matchingConfig`.
 * When a real backend takes over scoring, this class becomes the client-side
 * fallback (or is replaced wholesale): the UI only depends on its shape.
 */
class MatchingEngine implements MatchingEngineApi {
  /* ---------------------------------------------------------------- */
  /* Component scores                                                  */
  /* ---------------------------------------------------------------- */

  /**
   * Coverage of a career's core + bonus skills, weighted by self-reported level.
   * Core skills carry full weight; bonus skills carry `bonusSkillWeight`.
   */
  calculateSkillMatch(candidate: Candidate, career: Career): number {
    const owned = new Map(candidate.skills.map((s) => [s.skillId, s.level]))

    let earned = 0
    let possible = 0

    career.coreSkills.forEach((skillId, index) => {
      // Earlier skills in the list matter more.
      const importance = 1 - index * 0.06
      possible += importance
      const level = owned.get(skillId)
      if (level) earned += importance * SKILL_LEVEL_WEIGHT[level]
    })

    career.bonusSkills.forEach((skillId) => {
      possible += matchingConfig.bonusSkillWeight
      const level = owned.get(skillId)
      if (level) earned += matchingConfig.bonusSkillWeight * SKILL_LEVEL_WEIGHT[level]
    })

    if (possible === 0) return 0

    // A small floor keeps "adjacent but transferable" profiles from reading 0%.
    const raw = (earned / possible) * 100
    const breadthBonus = Math.min(candidate.skills.length, 14) * 0.6
    return round(clamp(raw * 0.9 + breadthBonus))
  }

  /**
   * Experience is judged against the seniority the career step implies, and
   * against how relevant the candidate's actual job titles are.
   */
  calculateExperienceMatch(candidate: Candidate, career: Career): number {
    const years = candidate.yearsOfExperience
    const saturation = matchingConfig.experienceSaturationYears
    const depth = clamp((years / saturation) * 100)

    // Title relevance: has the candidate held a role this career recognises?
    const titles = [
      candidate.headline,
      candidate.preference.desiredTitle,
      ...candidate.experience.map((e) => e.title),
    ]
      .filter(Boolean)
      .map(normalize)

    const careerTerms = [career.name, ...career.roles].map(normalize)
    const relevanceHits = careerTerms.filter((term) =>
      titles.some((title) => title.includes(term) || term.includes(title)),
    ).length
    const relevance = clamp(relevanceHits > 0 ? 62 + relevanceHits * 14 : 34)

    // Education adds a little signal, mostly for early-career candidates.
    const educationBoost = candidate.education.length > 0 ? 8 : 0

    return round(weighted([[depth, 0.5], [relevance, 0.5]]) + educationBoost * (years < 3 ? 1 : 0.3))
  }

  /** How closely the personal profile's trait shape fits the career's. */
  calculateCareerProfileMatch(candidate: Candidate, career: Career): number {
    const profile = candidate.astrology
    if (!profile) return 50

    const fit = astrologyEngine.calculateCareerFit(profile, career)
    // A small, bounded nudge when the star archetype leans toward this field.
    const affinity = profile.starGroup.affinityFields.includes(career.field)
      ? matchingConfig.starAffinityBonus
      : 0
    return round(clamp(fit + affinity))
  }

  /**
   * Match a candidate's trait shape against a recruiter's desired shape.
   * Only the traits the recruiter actually set are considered.
   */
  calculateAstrologyPatternMatch(
    candidate: Candidate,
    desired: Partial<Record<string, number>>,
  ): number {
    const traits = candidate.astrology?.traits
    const keys = Object.keys(desired).filter(
      (key) => typeof desired[key] === 'number',
    ) as TraitKey[]
    // Nothing requested → nothing to score. Callers decide what to do with this;
    // the search paths drop the profile term entirely rather than award a
    // meaningless 100% to every candidate.
    if (!traits || keys.length === 0) return 100

    let total = 0
    for (const key of keys) {
      const target = desired[key] as number
      const actual = traits[key]
      // Exceeding a desired trait level is mostly fine; falling short is not.
      const gap = actual >= target ? (actual - target) * 0.25 : target - actual
      total += clamp(100 - gap * 1.15)
    }
    return round(total / keys.length)
  }

  calculateCompatibility(candidate: Candidate, manager: ManagerProfile): number {
    if (!candidate.astrology || !manager.astrology) return 50
    return astrologyEngine.calculateCompatibility(candidate.astrology, manager.astrology)
  }

  describeCompatibility(
    candidate: Candidate,
    manager: ManagerProfile,
  ): CompatibilityResult | undefined {
    if (!candidate.astrology || !manager.astrology) return undefined
    return astrologyEngine.describeCompatibility(candidate.astrology, manager.astrology)
  }

  /* ---------------------------------------------------------------- */
  /* Composite scores                                                  */
  /* ---------------------------------------------------------------- */

  calculateOverallMatch(candidate: Candidate, career: Career): number {
    const { skills, experience, profile } = matchingConfig.careerMatch
    return round(
      weighted([
        [this.calculateSkillMatch(candidate, career), skills],
        [this.calculateExperienceMatch(candidate, career), experience],
        [this.calculateCareerProfileMatch(candidate, career), profile],
      ]),
    )
  }

  recommendCareers(candidate: Candidate, limit = 5): CareerRecommendation[] {
    const scored = CAREERS.map((career) => {
      const skills = this.calculateSkillMatch(candidate, career)
      const experience = this.calculateExperienceMatch(candidate, career)
      const profile = this.calculateCareerProfileMatch(candidate, career)
      const weights = matchingConfig.careerMatch
      const overall = round(
        weighted([
          [skills, weights.skills],
          [experience, weights.experience],
          [profile, weights.profile],
        ]),
      )

      const owned = new Set(candidate.skills.map((s) => s.skillId))
      const relevant = [...career.coreSkills, ...career.bonusSkills]
      const matchedSkills = relevant.filter((id) => owned.has(id)).map(skillName)
      const missingSkills = relevant.filter((id) => !owned.has(id)).map(skillName).slice(0, 6)

      return {
        career,
        overall,
        breakdown: { skills, experience, profile },
        band: bandOf(overall),
        reasons: buildReasons(candidate, career, { skills, experience, profile }),
        matchedSkills,
        missingSkills,
      } satisfies CareerRecommendation
    })

    return scored.sort((a, b) => b.overall - a.overall).slice(0, limit)
  }

  /* ---------------------------------------------------------------- */
  /* Recruiter search                                                  */
  /* ---------------------------------------------------------------- */

  searchByProfile(
    candidates: Candidate[],
    filters: CandidateSearchFilters,
    sort: SortKey = 'overall',
  ): CandidateMatchResult[] {
    const pool = candidates.filter((candidate) => passesFilters(candidate, filters))
    const weights = matchingConfig.profileSearch

    // Only score the profile term when the recruiter actually described one.
    // Otherwise every candidate would score a flat 100% on it, inflating and
    // flattening the overall ranking.
    const hasDesiredProfile = Object.keys(filters.traits).length > 0

    const results = pool.map((candidate) => {
      const skillMatch = skillFilterMatch(candidate, filters)
      const experienceMatch = experienceFilterMatch(candidate, filters)
      const profileMatch = hasDesiredProfile
        ? this.calculateAstrologyPatternMatch(candidate, filters.traits)
        : null
      const best = this.recommendCareers(candidate, 1)[0]
      const careerMatch = best?.overall ?? 0

      const overall = round(
        weighted(
          profileMatch === null
            ? [
                [skillMatch, weights.skills],
                [experienceMatch, weights.experience],
              ]
            : [
                [skillMatch, weights.skills],
                [experienceMatch, weights.experience],
                [profileMatch, weights.profile],
              ],
        ),
      )

      return {
        candidate,
        overall,
        skillMatch,
        experienceMatch,
        profileMatch,
        careerMatch,
        band: bandOf(overall),
      } satisfies CandidateMatchResult
    })

    return sortResults(
      results.filter((r) => r.overall >= matchingConfig.minimumResultScore),
      sort,
    )
  }

  searchByCompatibility(
    candidates: Candidate[],
    manager: ManagerProfile,
    filters: CandidateSearchFilters,
    sort: SortKey = 'overall',
  ): CandidateMatchResult[] {
    const pool = candidates.filter((candidate) => passesFilters(candidate, filters))
    const weights = matchingConfig.compatibilitySearch

    const results = pool.map((candidate) => {
      const skillMatch = skillFilterMatch(candidate, filters)
      const experienceMatch = experienceFilterMatch(candidate, filters)
      const best = this.recommendCareers(candidate, 1)[0]
      const careerMatch = best?.overall ?? 0
      const compatibility = this.describeCompatibility(candidate, manager)
      const compatibilityScore = compatibility?.score ?? this.calculateCompatibility(candidate, manager)
      const profileMatch =
        Object.keys(filters.traits).length > 0
          ? this.calculateAstrologyPatternMatch(candidate, filters.traits)
          : null

      const overall = round(
        weighted([
          [skillMatch, weights.skills],
          [careerMatch, weights.career],
          [compatibilityScore, weights.compatibility],
        ]),
      )

      return {
        candidate,
        overall,
        skillMatch,
        experienceMatch,
        profileMatch,
        careerMatch,
        compatibility,
        band: bandOf(overall),
      } satisfies CandidateMatchResult
    })

    return sortResults(
      results.filter((r) => r.overall >= matchingConfig.minimumResultScore),
      sort,
    )
  }
}

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

function sortResults(results: CandidateMatchResult[], sort: SortKey): CandidateMatchResult[] {
  const sorted = [...results]
  switch (sort) {
    case 'skills':
      sorted.sort((a, b) => b.skillMatch - a.skillMatch || b.overall - a.overall)
      break
    case 'compatibility':
      sorted.sort(
        (a, b) =>
          (b.compatibility?.score ?? b.profileMatch ?? b.overall) -
            (a.compatibility?.score ?? a.profileMatch ?? a.overall) || b.overall - a.overall,
      )
      break
    case 'experience':
      sorted.sort(
        (a, b) =>
          b.candidate.yearsOfExperience - a.candidate.yearsOfExperience || b.overall - a.overall,
      )
      break
    default:
      sorted.sort((a, b) => b.overall - a.overall)
  }
  return sorted
}

/** Hard filters: a candidate either qualifies or is excluded entirely. */
function passesFilters(candidate: Candidate, filters: CandidateSearchFilters): boolean {
  if (filters.query.trim()) {
    const q = normalize(filters.query)
    const haystack = normalize(
      [
        candidate.personal.fullName,
        candidate.headline,
        candidate.summary,
        candidate.personal.currentCity,
        ...candidate.skills.map((s) => s.name),
        ...candidate.experience.map((e) => `${e.title} ${e.company}`),
      ].join(' '),
    )
    if (!haystack.includes(q)) return false
  }

  // Skills act as an OR requirement: a candidate must have at least one of the
  // requested skills to appear at all. How *many* they have, and at what level,
  // is what `skillFilterMatch` turns into the ranking score.
  if (filters.skills.length > 0) {
    const owned = new Set(candidate.skills.map((s) => s.skillId))
    if (!filters.skills.some((skillId) => owned.has(skillId))) return false
  }

  if (filters.seniority.length > 0 && !filters.seniority.includes(candidate.preference.seniority)) {
    return false
  }

  if (
    filters.locations.length > 0 &&
    !filters.locations.some((loc) => normalize(candidate.personal.currentCity).includes(normalize(loc)))
  ) {
    return false
  }

  if (candidate.yearsOfExperience < filters.minYears) return false
  if (filters.maxYears < 20 && candidate.yearsOfExperience > filters.maxYears) return false

  if (filters.degrees.length > 0) {
    const degrees = candidate.education.map((e) => normalize(e.degree))
    if (!filters.degrees.some((d) => degrees.some((deg) => deg.includes(normalize(d))))) return false
  }

  if (filters.workModes.length > 0) {
    if (!filters.workModes.some((mode) => candidate.preference.workModes.includes(mode))) return false
  }

  if (filters.salaryMax > 0 && candidate.preference.salaryMin > filters.salaryMax) return false

  if (filters.careerGroups.length > 0) {
    const groups = new Set(
      matchingEngine
        .recommendCareers(candidate, 5)
        .map((rec) => rec.career.field),
    )
    if (!filters.careerGroups.some((group) => groups.has(group))) return false
  }

  return true
}

/** Soft score: how well the candidate covers the recruiter's requested skills. */
function skillFilterMatch(candidate: Candidate, filters: CandidateSearchFilters): number {
  if (filters.skills.length === 0) {
    // No explicit requirement → score on the breadth/depth of the profile.
    const depth =
      candidate.skills.reduce((sum, s) => sum + SKILL_LEVEL_WEIGHT[s.level], 0) /
      Math.max(candidate.skills.length, 1)
    return round(clamp(55 + depth * 30 + Math.min(candidate.skills.length, 12) * 1.2))
  }

  const owned = new Map(candidate.skills.map((s) => [s.skillId, s.level]))
  let earned = 0
  for (const skillId of filters.skills) {
    const level = owned.get(skillId)
    if (level) earned += SKILL_LEVEL_WEIGHT[level]
  }
  return round(clamp((earned / filters.skills.length) * 100))
}

function experienceFilterMatch(candidate: Candidate, filters: CandidateSearchFilters): number {
  const target =
    filters.seniority.length > 0
      ? Math.max(...filters.seniority.map((s) => SENIORITY_YEARS[s]))
      : matchingConfig.experienceSaturationYears / 2

  const years = candidate.yearsOfExperience
  if (target === 0) return round(clamp(100 - years * 4))
  const ratio = years / target
  if (ratio >= 1) return round(clamp(100 - (ratio - 1) * 12))
  return round(clamp(ratio * 100))
}

function buildReasons(
  candidate: Candidate,
  career: Career,
  breakdown: { skills: number; experience: number; profile: number },
): string[] {
  const reasons: string[] = []
  const traits = candidate.astrology?.traits

  if (traits) {
    // Name the traits where the candidate meets or exceeds what the career rewards.
    const aligned = TRAIT_ORDER.filter(
      (trait) => career.traitProfile[trait] >= 70 && traits[trait] >= career.traitProfile[trait] - 8,
    )
      .sort((a, b) => traits[b] - traits[a])
      .slice(0, 3)

    for (const trait of aligned) {
      reasons.push(`${TRAIT_LABEL[trait]} ở mức ${traits[trait]}/100, phù hợp với yêu cầu của nhóm nghề này`)
    }
  }

  if (breakdown.skills >= 70) {
    const owned = new Set(candidate.skills.map((s) => s.skillId))
    const matched = career.coreSkills.filter((id) => owned.has(id)).slice(0, 3).map(skillName)
    if (matched.length > 0) {
      reasons.push(`Đã có nền tảng kỹ năng cốt lõi: ${matched.join(', ')}`)
    }
  }

  if (breakdown.experience >= 65 && candidate.yearsOfExperience >= 1) {
    reasons.push(
      `Kinh nghiệm ${Math.round(candidate.yearsOfExperience)} năm tương thích với yêu cầu thường gặp của vị trí`,
    )
  }

  reasons.push(career.environment)

  return reasons.slice(0, 5)
}

export const matchingEngine = new MatchingEngine()
export { matchingConfig } from './config'
export type { MatchingConfig, MatchingEngineApi } from './types'
