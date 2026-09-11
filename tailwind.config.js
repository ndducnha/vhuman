/**
 * VHuman design system — Swiss / minimalist, token-driven.
 *
 * Every colour resolves to a CSS custom property holding an "R G B" triplet,
 * so a single `[data-theme]` switch retheme the whole app and Tailwind's
 * `/opacity` modifiers keep working (`bg-primary/10`).
 * Palette: warm cream ground (#FFFBF0), deep teal primary (#0F766E), crimson
 * reserved for display headings and the hero CTA, gold for ornament only.
 */

/** `bg-primary` → rgb(var(--primary) / <alpha>) */
const token = (name) => `rgb(var(--${name}) / <alpha-value>)`

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['class', '[data-theme="dark"]'],
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    container: {
      center: true,
      padding: { DEFAULT: '1.25rem', sm: '1.5rem', lg: '2rem' },
      screens: { '2xl': '1240px' },
    },
    extend: {
      colors: {
        /* ── Surfaces ─────────────────────────────────────────────── */
        bg: token('bg'),
        card: token('card'),
        raised: token('raised'),

        surface: {
          DEFAULT: token('card'),
          muted: token('bg'),
          sunken: token('muted'),
        },

        /* ── Text ─────────────────────────────────────────────────── */
        ink: {
          DEFAULT: token('fg'),
          soft: token('fg-soft'),
          muted: token('fg-muted'),
          faint: token('fg-faint'),
        },

        /* ── Lines ────────────────────────────────────────────────── */
        line: {
          DEFAULT: token('border'),
          soft: token('border-soft'),
          strong: token('border-strong'),
        },

        /* ── Primary (interactive: buttons, active nav, selected) ──── */
        primary: {
          DEFAULT: token('primary'),
          hover: token('primary-hover'),
          active: token('primary-active'),
        },
        'on-primary': {
          DEFAULT: token('on-primary'),
          muted: token('on-primary-muted'),
        },

        /* ── Brand band (stays dark in both themes, by design) ─────── */
        brand: {
          DEFAULT: token('brand'),
          soft: token('brand-soft'),
        },
        'on-brand': {
          DEFAULT: token('on-brand'),
          muted: token('on-brand-muted'),
        },

        /* ── Accent scale (professional blue, contrast-tuned) ──────── */
        accent: {
          50: token('accent-50'),
          100: token('accent-100'),
          200: token('accent-200'),
          300: token('accent-300'),
          400: token('accent-400'),
          500: token('accent-500'),
          600: token('accent-600'),
          700: token('accent-700'),
          800: token('accent-800'),
          900: token('accent-900'),
          DEFAULT: token('accent-600'),
        },
        'on-accent': token('on-accent'),

        /* ── Crimson: display headings + hero CTA, used sparingly ──── */
        crimson: {
          DEFAULT: token('crimson'),
          hover: token('crimson-hover'),
          active: token('crimson-active'),
        },
        'on-crimson': token('on-crimson'),

        /* ── Gold: ornament only, never a text/background pair ─────── */
        gold: { DEFAULT: token('gold'), deep: token('gold-deep') },

        /* ── Status / score bands ─────────────────────────────────── */
        neutral: { subtle: token('neutral-subtle'), border: token('neutral-border'), fg: token('neutral-fg'), solid: token('neutral-solid') },
        warning: { subtle: token('warning-subtle'), border: token('warning-border'), fg: token('warning-fg'), solid: token('warning-solid') },
        info:    { subtle: token('info-subtle'),    border: token('info-border'),    fg: token('info-fg'),    solid: token('info-solid') },
        success: { subtle: token('success-subtle'), border: token('success-border'), fg: token('success-fg'), solid: token('success-solid') },
        danger:  { subtle: token('danger-subtle'),  border: token('danger-border'),  fg: token('danger-fg'),  solid: token('danger-solid') },

        /* ── Utility ──────────────────────────────────────────────── */
        scrim: token('scrim'),
        tooltip: token('tooltip'),
        'on-tooltip': token('on-tooltip'),
        ring: token('ring'),
      },

      fontFamily: {
        sans: ['"Space Grotesk"', 'ui-sans-serif', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif'],
        display: ['"Bricolage Grotesque"', '"Space Grotesk"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },

      /* Swiss type scale — deliberate steps, tight tracking on display sizes. */
      fontSize: {
        '2xs': ['0.6875rem', { lineHeight: '1rem' }],
        xs:    ['0.75rem',   { lineHeight: '1.125rem' }],
        sm:    ['0.875rem',  { lineHeight: '1.375rem' }],
        base:  ['1rem',      { lineHeight: '1.625rem' }],
        lg:    ['1.125rem',  { lineHeight: '1.75rem' }],
        xl:    ['1.25rem',   { lineHeight: '1.75rem',  letterSpacing: '-0.011em' }],
        '2xl': ['1.5rem',    { lineHeight: '2rem',     letterSpacing: '-0.017em' }],
        '3xl': ['1.875rem',  { lineHeight: '2.25rem',  letterSpacing: '-0.021em' }],
        '4xl': ['2.25rem',   { lineHeight: '2.5rem',   letterSpacing: '-0.026em' }],
        '5xl': ['3rem',      { lineHeight: '1.08',     letterSpacing: '-0.032em' }],
        '6xl': ['3.75rem',   { lineHeight: '1.04',     letterSpacing: '-0.036em' }],
      },

      borderRadius: { lg: '0.625rem', xl: '0.875rem', '2xl': '1.25rem', pill: '9999px' },

      /* Sharp, low-spread shadows — Swiss style prefers edges over glow. */
      boxShadow: {
        card: 'none',
        lift: '0 1px 2px 0 rgb(var(--shadow) / 0.06)',
        pop:  '0 16px 40px -12px rgb(var(--shadow) / 0.26), 0 4px 12px -6px rgb(var(--shadow) / 0.14)',
        focus: '0 0 0 3px rgb(var(--ring) / 0.28)',
      },

      transitionTimingFunction: {
        out: 'cubic-bezier(0.16, 1, 0.3, 1)',
        spring: 'cubic-bezier(0.34, 1.4, 0.64, 1)',
      },

      keyframes: {
        'fade-up': { '0%': { opacity: '0', transform: 'translateY(6px)' }, '100%': { opacity: '1', transform: 'none' } },
        'fade-in': { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
        'scale-in': { '0%': { opacity: '0', transform: 'scale(0.97)' }, '100%': { opacity: '1', transform: 'none' } },
        'slide-left': { '0%': { opacity: '0', transform: 'translateX(12px)' }, '100%': { opacity: '1', transform: 'none' } },
      },
      animation: {
        'fade-up': 'fade-up 0.32s cubic-bezier(0.16,1,0.3,1) both',
        'fade-in': 'fade-in 0.22s ease-out both',
        'scale-in': 'scale-in 0.2s cubic-bezier(0.16,1,0.3,1) both',
        'slide-left': 'slide-left 0.26s cubic-bezier(0.16,1,0.3,1) both',
      },
    },
  },
  plugins: [],
}
