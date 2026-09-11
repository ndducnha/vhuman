import { forwardRef } from 'react'
import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/utils/cn'

/**
 * Pill buttons on flat fills, following the reference design.
 * Press feedback is colour + a slight scale that never alters layout bounds,
 * so nothing around the button shifts.
 */
const buttonVariants = cva(
  [
    'inline-flex items-center justify-center gap-2 rounded-pill font-medium whitespace-nowrap',
    'transition-[background-color,border-color,color,box-shadow,transform] duration-150 ease-out',
    'active:scale-[0.98]',
    'disabled:pointer-events-none disabled:opacity-50',
    'select-none cursor-pointer',
  ].join(' '),
  {
    variants: {
      variant: {
        primary:
          'bg-primary text-on-primary shadow-card hover:bg-primary-hover active:bg-primary-active',
        accent:
          'bg-accent-600 text-on-accent shadow-card hover:bg-accent-700 active:bg-accent-800',
        secondary:
          'border border-line-strong bg-transparent text-ink hover:border-primary hover:text-primary',
        crimson:
          'bg-crimson text-on-crimson hover:bg-crimson-hover active:bg-crimson-active',
        ghost: 'text-ink-soft hover:bg-surface-sunken hover:text-ink',
        subtle: 'bg-surface-sunken text-ink-soft hover:bg-line hover:text-ink',
        danger:
          'border border-danger-border bg-card text-danger-fg hover:bg-danger-subtle',
      },
      size: {
        // Touch widths get the full 44px target; desktop keeps toolbar density.
        sm: 'h-11 px-3 text-sm sm:h-9',
        md: 'h-11 px-4 text-sm',
        lg: 'h-12 px-6 text-base',
        icon: 'h-11 w-11 sm:h-10 sm:w-10',
      },
      block: { true: 'w-full' },
    },
    defaultVariants: { variant: 'primary', size: 'md' },
  },
)

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, block, type = 'button', ...props }, ref) => (
    <button
      ref={ref}
      type={type}
      className={cn(buttonVariants({ variant, size, block }), className)}
      {...props}
    />
  ),
)
Button.displayName = 'Button'

interface ButtonLinkProps extends VariantProps<typeof buttonVariants> {
  to: string
  className?: string
  children: ReactNode
  onClick?: () => void
  'aria-label'?: string
}

/** Router-aware button: keeps navigation working under HashRouter. */
export function ButtonLink({
  to,
  className,
  variant,
  size,
  block,
  children,
  onClick,
  ...rest
}: ButtonLinkProps) {
  return (
    <Link
      to={to}
      onClick={onClick}
      className={cn(buttonVariants({ variant, size, block }), className)}
      {...rest}
    >
      {children}
    </Link>
  )
}
