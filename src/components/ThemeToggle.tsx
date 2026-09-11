import { Moon, Sun } from 'lucide-react'
import { useTheme } from '@/hooks/useTheme'
import { cn } from '@/utils/cn'

export function ThemeToggle({ className }: { className?: string }) {
  const { theme, toggleTheme } = useTheme()
  const isDark = theme === 'dark'

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? 'Chuyển sang giao diện sáng' : 'Chuyển sang giao diện tối'}
      title={isDark ? 'Giao diện sáng' : 'Giao diện tối'}
      className={cn(
        'relative inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg',
        'text-ink-muted transition-colors duration-200 ease-out hover:bg-surface-sunken hover:text-ink',
        className,
      )}
    >
      {/* Both icons stay mounted and cross-fade, so the button never reflows. */}
      <Sun
        className={cn(
          'absolute h-[18px] w-[18px] transition-all duration-200 ease-out',
          isDark ? 'scale-75 opacity-0' : 'scale-100 opacity-100',
        )}
        aria-hidden
      />
      <Moon
        className={cn(
          'absolute h-[18px] w-[18px] transition-all duration-200 ease-out',
          isDark ? 'scale-100 opacity-100' : 'scale-75 opacity-0',
        )}
        aria-hidden
      />
    </button>
  )
}
