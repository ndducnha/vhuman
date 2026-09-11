/**
 * Single place where the reflection-layer implementation is chosen.
 *
 * ────────────────────────────────────────────────────────────────────
 *  TO INTEGRATE THE REAL TỬ VI ALGORITHM:
 *  1. Add `RealAstrologyEngine.ts` implementing the `AstrologyEngine`
 *     interface from `./types`.
 *  2. Change the single line below.
 *  No page, component, or hook needs to be touched.
 * ────────────────────────────────────────────────────────────────────
 */
import { MockAstrologyEngine } from './MockAstrologyEngine'
import type { AstrologyEngine } from './types'

export const astrologyEngine: AstrologyEngine = new MockAstrologyEngine()

export type { AstrologyEngine } from './types'
export { MockAstrologyEngine } from './MockAstrologyEngine'
