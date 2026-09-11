import type { ScoreBand } from '@/types'

export function clamp(value: number, min = 0, max = 100): number {
  return Math.min(max, Math.max(min, value))
}

export function round(value: number): number {
  return Math.round(value)
}

export function bandOf(score: number): ScoreBand {
  if (score >= 85) return 'strong'
  if (score >= 70) return 'good'
  if (score >= 50) return 'moderate'
  return 'low'
}

export const BAND_LABEL: Record<ScoreBand, string> = {
  low: 'Thấp',
  moderate: 'Trung bình',
  good: 'Phù hợp',
  strong: 'Rất phù hợp',
}

/** Muted, professional band styling: no neon, no "fortune-teller" reds/golds. */
export const BAND_CLASS: Record<ScoreBand, string> = {
  low: 'bg-neutral-subtle text-neutral-fg border-neutral-border',
  moderate: 'bg-warning-subtle text-warning-fg border-warning-border',
  good: 'bg-info-subtle text-info-fg border-info-border',
  strong: 'bg-success-subtle text-success-fg border-success-border',
}

export const BAND_BAR: Record<ScoreBand, string> = {
  low: 'bg-neutral-solid',
  moderate: 'bg-warning-solid',
  good: 'bg-info-solid',
  strong: 'bg-success-solid',
}

/** Weighted average helper used by every engine formula. */
export function weighted(parts: Array<[value: number, weight: number]>): number {
  const totalWeight = parts.reduce((sum, [, w]) => sum + w, 0)
  if (totalWeight === 0) return 0
  const total = parts.reduce((sum, [v, w]) => sum + v * w, 0)
  return clamp(total / totalWeight)
}
