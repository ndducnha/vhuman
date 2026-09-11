import { useEffect, useState } from 'react'
import { useTheme } from '@/hooks/useTheme'

/** Design tokens that non-CSS consumers (SVG charts) need as real colours. */
const TOKENS = [
  'accent-600',
  'fg',
  'fg-muted',
  'fg-faint',
  'border',
  'muted',
  'card',
  'neutral-solid',
] as const

export type ThemeColorToken = (typeof TOKENS)[number]

/**
 * Resolves CSS custom properties to concrete `rgb()` strings.
 *
 * Recharts renders colours as SVG presentation attributes, where `var()` is not
 * resolved: so charts cannot inherit the theme through CSS alone. Reading the
 * computed values and re-reading them on theme change keeps charts in sync.
 */
export function useThemeColors(): Record<ThemeColorToken, string> {
  const { theme } = useTheme()

  const read = (): Record<ThemeColorToken, string> => {
    const styles = getComputedStyle(document.documentElement)
    return TOKENS.reduce(
      (acc, token) => {
        const raw = styles.getPropertyValue(`--${token}`).trim()
        acc[token] = raw ? `rgb(${raw})` : 'currentColor'
        return acc
      },
      {} as Record<ThemeColorToken, string>,
    )
  }

  const [colors, setColors] = useState<Record<ThemeColorToken, string>>(read)

  useEffect(() => {
    setColors(read())
  }, [theme])

  return colors
}
