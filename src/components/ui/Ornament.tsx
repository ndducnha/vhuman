import { cn } from '@/utils/cn'

/**
 * Traditional line ornaments, drawn from scratch as inline SVG.
 *
 * They are decorative only: every one is `aria-hidden` and carries no meaning
 * that is not already in the text beside it.
 */

/** Geometric corner mark (góc triện): anchors a card's corner. */
export function CornerMark({
  className,
  corner = 'bl',
  size = 18,
}: {
  className?: string
  corner?: 'tl' | 'tr' | 'bl' | 'br'
  size?: number
}) {
  const rotation = { tl: 0, tr: 90, br: 180, bl: 270 }[corner]
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
      className={cn('pointer-events-none select-none', className)}
      style={{ transform: `rotate(${rotation}deg)` }}
    >
      <g stroke="currentColor" strokeWidth="1.4" strokeLinecap="square">
        <path d="M1 23V1h22" />
        <path d="M5 23V5h18" />
        <path d="M9 14V9h5" />
      </g>
    </svg>
  )
}

/** Stylised cloud-and-wave motif (vân/sóng) used in card corners. */
export function WaveMark({ className, size = 56 }: { className?: string; size?: number }) {
  return (
    <svg
      width={size}
      height={size * 0.56}
      viewBox="0 0 100 56"
      fill="none"
      aria-hidden
      className={cn('pointer-events-none select-none', className)}
    >
      <g stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" fill="none">
        <path d="M2 44c8 0 8-9 16-9s8 9 16 9 8-9 16-9 8 9 16 9 8-9 16-9 8 9 16 9" />
        <path d="M14 30c0-7 6-12 13-12 4 0 8 2 10 6 2-5 7-8 12-8 8 0 14 6 14 14" />
        <circle cx="70" cy="14" r="4" />
        <circle cx="82" cy="22" r="2.5" />
        <path d="M30 24c3-2 7-2 10 0" />
      </g>
    </svg>
  )
}

/** Short double rule used under display headings. */
export function RuleMark({ className }: { className?: string }) {
  return (
    <svg
      width="72"
      height="8"
      viewBox="0 0 72 8"
      fill="none"
      aria-hidden
      className={cn('pointer-events-none select-none', className)}
    >
      <g stroke="currentColor" strokeLinecap="round">
        <path d="M1 2h48" strokeWidth="2" />
        <path d="M1 6.5h30" strokeWidth="1" opacity="0.55" />
        <circle cx="57" cy="2" r="2" strokeWidth="1.3" />
        <path d="M64 2h7" strokeWidth="1.3" />
      </g>
    </svg>
  )
}

/**
 * Ornamental double-line frame, as used around the reference site's hero.
 * Renders as an absolutely-positioned overlay so it never affects layout.
 */
export function FrameOrnament({ className }: { className?: string }) {
  return (
    <span
      aria-hidden
      className={cn(
        'pointer-events-none absolute inset-0 rounded-[inherit] border border-current opacity-40',
        'after:absolute after:inset-[5px] after:rounded-[inherit] after:border after:border-current after:opacity-60',
        className,
      )}
    />
  )
}
