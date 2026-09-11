import type { InputHTMLAttributes, ReactNode, SelectHTMLAttributes, TextareaHTMLAttributes } from 'react'
import { cn } from '@/utils/cn'

export function Field({
  label,
  hint,
  required,
  error,
  children,
  className,
}: {
  label?: string
  hint?: ReactNode
  required?: boolean
  error?: string
  children: ReactNode
  className?: string
}) {
  return (
    <div className={className}>
      {label ? (
        <label className="field-label">
          {label}
          {required ? <span className="ml-0.5 text-danger-solid">*</span> : null}
        </label>
      ) : null}
      {children}
      {error ? <p className="mt-1.5 text-xs text-danger-fg">{error}</p> : null}
      {!error && hint ? <p className="field-hint">{hint}</p> : null}
    </div>
  )
}

export function TextInput({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return <input className={cn('field-input', className)} {...props} />
}

export function TextArea({ className, ...props }: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea className={cn('field-input min-h-[96px] resize-y', className)} {...props} />
}

export function Select({ className, children, ...props }: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select className={cn('field-input appearance-none bg-card pr-9', className)} {...props}>
      {children}
    </select>
  )
}

/** Pill-style single/multi choice: used for gender, work mode, seniority. */
export function ChoiceGroup<T extends string>({
  options,
  value,
  onChange,
  multiple,
  className,
}: {
  options: Array<{ value: T; label: string }>
  value: T[] | T
  onChange: (value: T) => void
  multiple?: boolean
  className?: string
}) {
  const selected = Array.isArray(value) ? value : [value]
  return (
    <div className={cn('flex flex-wrap gap-2', className)} role={multiple ? 'group' : 'radiogroup'}>
      {options.map((option) => {
        const active = selected.includes(option.value)
        return (
          <button
            key={option.value}
            type="button"
            role={multiple ? 'checkbox' : 'radio'}
            aria-checked={active}
            onClick={() => onChange(option.value)}
            className={cn(
              'rounded-lg border px-3.5 py-2 text-sm font-medium transition-all',
              active
                ? 'border-primary bg-primary text-on-primary shadow-card'
                : 'border-line bg-card text-ink-soft hover:border-ink-faint/60 hover:bg-surface-muted',
            )}
          >
            {option.label}
          </button>
        )
      })}
    </div>
  )
}

export function Checkbox({
  checked,
  onChange,
  label,
  className,
}: {
  checked: boolean
  onChange: (checked: boolean) => void
  label: ReactNode
  className?: string
}) {
  return (
    <label className={cn('flex cursor-pointer select-none items-center gap-2.5 text-sm text-ink-soft', className)}>
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        className="h-4 w-4 rounded border-line text-primary accent-primary focus:ring-accent-200"
      />
      {label}
    </label>
  )
}
