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
import { TuViCareerEngine } from './TuViCareerEngine'
import type { AstrologyEngine } from './types'
import type { AstrologyCareerProvider } from '@/types/tuvi'

export const astrologyEngine: AstrologyEngine = new MockAstrologyEngine()

/**
 * Engine phân loại nghề nghiệp từ lá số.
 *
 * Đây là phần nặng ký của lớp Tử Vi: nó biến lá số thành vector đặc tính máy
 * đọc được. Thay engine thật vào chỉ cần đổi đúng dòng dưới đây.
 */
export const tuviCareerEngine: AstrologyCareerProvider = new TuViCareerEngine()

export type { AstrologyEngine } from './types'
export { MockAstrologyEngine } from './MockAstrologyEngine'
