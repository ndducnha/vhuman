import { cn } from '@/utils/cn'
import { avatarGradient, initialsOf } from '@/utils/format'

const SIZE_CLASS = {
  xs: 'h-8 w-8 text-xs',
  sm: 'h-10 w-10 text-sm',
  md: 'h-12 w-12 text-base',
  lg: 'h-16 w-16 text-lg',
  xl: 'h-20 w-20 text-2xl sm:h-24 sm:w-24',
} as const

/**
 * Initials avatar with a deterministic gradient.
 * No external avatar service: the demo works fully offline.
 */
export function Avatar({
  name,
  src,
  size = 'md',
  className,
}: {
  name: string
  src?: string
  size?: keyof typeof SIZE_CLASS
  className?: string
}) {
  if (src) {
    return (
      <img
        src={src}
        alt={name}
        className={cn('shrink-0 rounded-full object-cover ring-2 ring-card', SIZE_CLASS[size], className)}
      />
    )
  }

  return (
    <span
      aria-hidden
      className={cn(
        'flex shrink-0 select-none items-center justify-center rounded-full bg-gradient-to-br font-semibold text-white',
        avatarGradient(name),
        SIZE_CLASS[size],
        className,
      )}
    >
      {initialsOf(name)}
    </span>
  )
}
