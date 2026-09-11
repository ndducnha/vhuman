import { cn } from '@/utils/cn'
import { bandOf } from '@/utils/score'
import type { ScoreBand } from '@/types'

const STROKE: Record<ScoreBand, string> = {
  low: 'stroke-neutral-solid',
  moderate: 'stroke-warning-solid',
  good: 'stroke-info-solid',
  strong: 'stroke-success-solid',
}

const SIZES = {
  sm: { box: 48, stroke: 4, text: 'text-sm' },
  md: { box: 72, stroke: 6, text: 'text-lg' },
  lg: { box: 112, stroke: 8, text: 'text-3xl' },
} as const

export function ScoreCircle({
  value,
  size = 'md',
  label,
  className,
}: {
  value: number
  size?: keyof typeof SIZES
  label?: string
  className?: string
}) {
  const config = SIZES[size]
  const radius = (config.box - config.stroke) / 2
  const circumference = 2 * Math.PI * radius
  const pct = Math.max(0, Math.min(100, value))
  const offset = circumference - (pct / 100) * circumference
  const band = bandOf(pct)

  return (
    <div className={cn('inline-flex flex-col items-center gap-1', className)}>
      <div className="relative" style={{ width: config.box, height: config.box }}>
        <svg width={config.box} height={config.box} className="-rotate-90">
          <circle
            cx={config.box / 2}
            cy={config.box / 2}
            r={radius}
            fill="none"
            strokeWidth={config.stroke}
            className="stroke-surface-sunken"
          />
          <circle
            cx={config.box / 2}
            cy={config.box / 2}
            r={radius}
            fill="none"
            strokeWidth={config.stroke}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            className={cn(STROKE[band], 'transition-[stroke-dashoffset] duration-1000 ease-out')}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={cn('font-semibold tabular-nums text-ink', config.text)}>{Math.round(pct)}%</span>
        </div>
      </div>
      {label ? <span className="text-xs text-ink-muted">{label}</span> : null}
    </div>
  )
}
