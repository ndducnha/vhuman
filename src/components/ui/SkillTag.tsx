import { X } from 'lucide-react'
import { cn } from '@/utils/cn'
import { SKILL_LEVEL_LABEL } from '@/utils/format'
import type { SkillLevel } from '@/types'

export function SkillTag({
  name,
  level,
  onRemove,
  matched,
  className,
}: {
  name: string
  level?: SkillLevel
  onRemove?: () => void
  matched?: boolean
  className?: string
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-xs font-medium',
        matched
          ? 'border-success-border bg-success-subtle text-success-fg'
          : 'border-line bg-surface-muted text-ink-soft',
        className,
      )}
    >
      {name}
      {level ? (
        <span className="rounded bg-card/70 px-1 text-[10px] font-normal text-ink-muted">
          {SKILL_LEVEL_LABEL[level]}
        </span>
      ) : null}
      {onRemove ? (
        <button
          type="button"
          onClick={onRemove}
          aria-label={`Bỏ kỹ năng ${name}`}
          className="-mr-0.5 rounded p-0.5 text-ink-faint transition-colors hover:bg-card hover:text-danger-fg"
        >
          <X className="h-3 w-3" />
        </button>
      ) : null}
    </span>
  )
}
