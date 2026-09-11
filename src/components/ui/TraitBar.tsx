import { cn } from '@/utils/cn'
import { BAND_BAR, bandOf } from '@/utils/score'

/**
 * `tone` matters more than it looks:
 *  - "band" colours by score and belongs on *match* numbers, where higher is
 *    genuinely better (skills fit, experience fit, career fit).
 *  - "neutral" is a single flat colour and belongs on *personality* traits,
 *    where there is no good or bad value. Colouring a low "risk taking" score
 *    amber would read as a deficiency, which is exactly the judgement VHuman
 *    is not making.
 */
export function TraitBar({
  label,
  value,
  className,
  compact,
  tone = 'band',
}: {
  label: string
  value: number
  className?: string
  compact?: boolean
  tone?: 'band' | 'neutral'
}) {
  const pct = Math.max(0, Math.min(100, value))
  return (
    <div className={cn('w-full', className)}>
      <div className="mb-1.5 flex items-baseline justify-between gap-3">
        <span className={cn('text-ink-soft', compact ? 'text-xs' : 'text-sm')}>{label}</span>
        <span className={cn('font-semibold tabular-nums text-ink', compact ? 'text-xs' : 'text-sm')}>
          {Math.round(pct)}
        </span>
      </div>
      <div className={cn('w-full overflow-hidden rounded-full bg-surface-sunken', compact ? 'h-1.5' : 'h-2')}>
        <div
          className={cn(
            'h-full rounded-full transition-[width] duration-1000 ease-out',
            tone === 'neutral' ? 'bg-primary' : BAND_BAR[bandOf(pct)],
          )}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}
