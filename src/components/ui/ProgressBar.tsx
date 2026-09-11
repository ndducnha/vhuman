import { cn } from '@/utils/cn'

export function ProgressBar({
  value,
  className,
  barClassName,
  size = 'md',
}: {
  value: number
  className?: string
  barClassName?: string
  size?: 'sm' | 'md'
}) {
  const pct = Math.max(0, Math.min(100, value))
  return (
    <div
      className={cn(
        'w-full overflow-hidden rounded-full bg-surface-sunken',
        size === 'sm' ? 'h-1.5' : 'h-2',
        className,
      )}
      role="progressbar"
      aria-valuenow={Math.round(pct)}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div
        className={cn('h-full rounded-full bg-primary transition-[width] duration-700 ease-out', barClassName)}
        style={{ width: `${pct}%` }}
      />
    </div>
  )
}
