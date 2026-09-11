import type { ReactNode } from 'react'
import { cn } from '@/utils/cn'

/**
 * CSS-only tooltip: no positioning library, no portal.
 * Also exposed via `title` so it works for touch and screen readers.
 */
export function Tooltip({
  label,
  children,
  className,
  align = 'center',
}: {
  label: string
  children: ReactNode
  className?: string
  align?: 'center' | 'left' | 'right'
}) {
  return (
    <span className={cn('group/tt relative inline-flex', className)} title={label}>
      {children}
      <span
        role="tooltip"
        className={cn(
          'pointer-events-none absolute bottom-full z-40 mb-2 w-max max-w-[260px] rounded-lg bg-tooltip px-3 py-2',
          'text-xs font-normal leading-relaxed text-on-tooltip opacity-0 shadow-pop transition-opacity',
          'group-hover/tt:opacity-100 group-focus-within/tt:opacity-100',
          align === 'center' && 'left-1/2 -translate-x-1/2',
          align === 'left' && 'left-0',
          align === 'right' && 'right-0',
        )}
      >
        {label}
      </span>
    </span>
  )
}
