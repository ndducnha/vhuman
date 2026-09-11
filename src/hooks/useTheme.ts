import { useCallback, useEffect, useState } from 'react'

export type Theme = 'light' | 'dark'

const STORAGE_KEY = 'vhuman:v1:theme'

function systemTheme(): Theme {
  if (typeof window === 'undefined') return 'light'
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

function storedTheme(): Theme | null {
  try {
    const value = window.localStorage.getItem(STORAGE_KEY)
    return value === 'light' || value === 'dark' ? value : null
  } catch {
    return null
  }
}

/**
 * Light/dark theme with a manual override on top of the system preference.
 *
 * The initial value is already applied to <html> by the inline bootstrap in
 * index.html, so this hook reads that attribute rather than re-deriving it 
 * which keeps SSR-less first paint flash-free.
 */
export function useTheme() {
  const [theme, setThemeState] = useState<Theme>(() => {
    if (typeof document === 'undefined') return 'light'
    const attr = document.documentElement.getAttribute('data-theme')
    return attr === 'dark' ? 'dark' : attr === 'light' ? 'light' : systemTheme()
  })

  const apply = useCallback((next: Theme, persist: boolean) => {
    document.documentElement.setAttribute('data-theme', next)
    setThemeState(next)
    if (!persist) return
    try {
      window.localStorage.setItem(STORAGE_KEY, next)
    } catch {
      /* storage unavailable: the theme still applies for this session */
    }
  }, [])

  // Follow the OS only while the user has not made an explicit choice.
  useEffect(() => {
    const media = window.matchMedia('(prefers-color-scheme: dark)')
    const onChange = (event: MediaQueryListEvent) => {
      if (storedTheme() !== null) return
      apply(event.matches ? 'dark' : 'light', false)
    }
    media.addEventListener('change', onChange)
    return () => media.removeEventListener('change', onChange)
  }, [apply])

  const toggleTheme = useCallback(() => {
    apply(theme === 'dark' ? 'light' : 'dark', true)
  }, [theme, apply])

  return { theme, toggleTheme }
}
