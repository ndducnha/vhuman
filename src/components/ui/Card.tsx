import type { HTMLAttributes, ReactNode } from 'react'
import { cn } from '@/utils/cn'
import { CornerMark } from '@/components/ui/Ornament'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  interactive?: boolean
  /** Removes the border for cards sitting directly on a sectioned background. */
  flush?: boolean
  /** Adds the ornamental teal corner mark used across the reference design. */
  ornament?: boolean
}

export function Card({ className, interactive, flush, ornament, children, ...props }: CardProps) {
  return (
    <div
      className={cn(
        'relative rounded-xl bg-card',
        !flush && 'border border-line',
        // Flat by default: hierarchy comes from the cream/ink contrast and the
        // rule work, not from elevation.
        interactive &&
          'transition-colors duration-200 ease-out hover:border-primary/45 hover:bg-surface-sunken/60',
        className,
      )}
      {...props}
    >
      {children}
      {ornament ? (
        <CornerMark corner="bl" className="absolute bottom-2 left-2 text-primary/45" />
      ) : null}
    </div>
  )
}

export function CardHeader({
  title,
  description,
  action,
  className,
  icon,
}: {
  title: ReactNode
  description?: ReactNode
  action?: ReactNode
  className?: string
  icon?: ReactNode
}) {
  return (
    <div
      className={cn(
        'flex items-start justify-between gap-4 border-b border-line px-5 py-4',
        className,
      )}
    >
      <div className="flex min-w-0 items-start gap-3">
        {icon ? (
          <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-surface-sunken text-ink-soft">
            {icon}
          </span>
        ) : null}
        <div className="min-w-0">
          <h3 className="section-title truncate">{title}</h3>
          {description ? (
            <p className="mt-0.5 text-sm leading-relaxed text-ink-muted">{description}</p>
          ) : null}
        </div>
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  )
}

export function CardBody({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('px-5 py-4', className)} {...props} />
}
