import type { AstrologyProfile, BirthProfile, Career, CompatibilityResult } from '@/types'

/**
 * The contract between VHuman's UI and whatever produces the personal
 * reflection layer.
 *
 * The MVP ships `MockAstrologyEngine` (deterministic, offline). A production
 * implementation: a real Tử Vi / Bát Tự calculator, local or behind an API 
 * only has to satisfy this interface; no UI code changes.
 *
 * Implementations MUST be deterministic: identical `BirthProfile` input has to
 * yield an identical `AstrologyProfile`, because scores are shown side by side
 * and compared across sessions and devices.
 */
export interface AstrologyEngine {
  /** Human-readable engine id, surfaced in the UI as provenance. */
  readonly name: string
  readonly version: string

  /** Build the personal reflection profile from birth data. */
  analyze(profile: BirthProfile): AstrologyProfile

  /** How well a personal profile aligns with a career's trait shape. 0-100. */
  calculateCareerFit(profile: AstrologyProfile, career: Career): number

  /** Working-style compatibility between two people. 0-100. */
  calculateCompatibility(personA: AstrologyProfile, personB: AstrologyProfile): number

  /** Narrative explanation of a compatibility score: tendencies, never certainty. */
  describeCompatibility(personA: AstrologyProfile, personB: AstrologyProfile): CompatibilityResult
}

/** Async-capable variant for a future HTTP-backed engine. */
export interface AsyncAstrologyEngine {
  readonly name: string
  readonly version: string
  analyze(profile: BirthProfile): Promise<AstrologyProfile>
  calculateCareerFit(profile: AstrologyProfile, career: Career): Promise<number>
  calculateCompatibility(a: AstrologyProfile, b: AstrologyProfile): Promise<number>
  describeCompatibility(a: AstrologyProfile, b: AstrologyProfile): Promise<CompatibilityResult>
}
