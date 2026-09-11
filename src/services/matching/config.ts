import type { MatchingConfig } from './types'

/**
 * Single source of truth for every scoring weight in VHuman.
 *
 * Tuning the product's point of view = editing this object. Nothing else.
 * Weights within each group are expressed as fractions that sum to 1.
 */
export const matchingConfig: MatchingConfig = {
  careerMatch: {
    skills: 0.4,
    experience: 0.25,
    profile: 0.35,
  },
  compatibilitySearch: {
    skills: 0.35,
    career: 0.25,
    compatibility: 0.4,
  },
  profileSearch: {
    skills: 0.4,
    experience: 0.2,
    profile: 0.4,
  },
  bonusSkillWeight: 0.45,
  experienceSaturationYears: 8,
  minimumResultScore: 0,
  /**
   * Bonus applied to a career whose field the star archetype leans toward.
   * Deliberately small: the reflection layer nudges the ranking, it never
   * overrides evidence.
   */
  starAffinityBonus: 4,
}
