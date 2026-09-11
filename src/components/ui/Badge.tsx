import type { ReactNode } from 'react'
import { cn } from '@/utils/cn'
import { BAND_CLASS, BAND_LABEL } from '@/utils/score'
import type { ScoreBand } from '@/types'

type Tone = 'neutral' | 'accent' | 'primary' | 'success' | 'warn' | 'danger' | 'outline'

const TONE_CLASS: Record<Tone, string> = {
  neutral: 'bg-surface-sunken text-ink-soft border-line',
  accent: 'bg-accent-600/10 text-accent-700 border-accent-600/20',
  primary: 'bg-primary text-on-primary border-primary',
  success: 'bg-success-subtle text-success-fg border-success-border',
  warn: 'bg-warning-subtle text-warning-fg border-warning-border',
  danger: 'bg-danger-subtle text-danger-fg border-danger-border',
  outline: 'bg-transparent text-ink-soft border-line',
}

export function Badge({
  children,
  tone = 'neutral',
  className,
}: {
  children: ReactNode
  tone?: Tone
  className?: string
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-md border px-2 py-0.5 text-xs font-medium',
        TONE_CLASS[tone],
        className,
      )}
    >
      {children}
    </span>
  )
}

/**
 * Score band badge. A coloured dot carries the same information as the colour
 * itself, so the band is still readable without colour perception.
 */
export function BandBadge({ band, className }: { band: ScoreBand; className?: string }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-md border px-2 py-0.5 text-xs font-medium',
        BAND_CLASS[band],
        className,
      )}
    >
      <span
        aria-hidden
        className={cn(
          'h-1.5 w-1.5 rounded-full',
          band === 'strong' && 'bg-success-solid',
          band === 'good' && 'bg-info-solid',
          band === 'moderate' && 'bg-warning-solid',
          band === 'low' && 'bg-neutral-solid',
        )}
      />
      {BAND_LABEL[band]}
    </span>
  )
}
