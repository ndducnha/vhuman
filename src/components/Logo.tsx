import { Link } from 'react-router-dom'
import { cn } from '@/utils/cn'
import markLight from '@/assets/logo-mark.png'
import markDark from '@/assets/logo-mark-dark.png'

/**
 * Brand lockup: the V mark plus the VHuman wordmark.
 *
 * Two versions of the mark ship. The original artwork is built for a light
 * ground; its darkest green sits at 1.7:1 against the dark theme's near-black,
 * so the left half of the V disappears there. The dark variant lifts the
 * shadows to 3.6:1 while leaving the highlights intact. Both are always in the
 * DOM and swapped with CSS, so the theme toggle never causes a fetch or a flash.
 *
 * Imported from src/assets rather than /public so Vite rewrites the URL for the
 * repository sub-path on GitHub Pages. Width and height are declared so the
 * header never reflows while the image loads.
 */
export function Logo({
  className,
  to = '/',
  showWordmark = true,
}: {
  className?: string
  to?: string
  /** Hide the text when the surrounding layout already names the product. */
  showWordmark?: boolean
}) {
  return (
    <Link
      to={to}
      aria-label="VHuman, về trang chủ"
      className={cn('group inline-flex min-h-[44px] items-center gap-2.5', className)}
    >
      <span className="relative block h-8 w-[34px] shrink-0">
        <img
          src={markLight}
          alt=""
          aria-hidden
          width={34}
          height={32}
          draggable={false}
          className="absolute inset-0 h-full w-full select-none object-contain dark:hidden"
        />
        <img
          src={markDark}
          alt=""
          aria-hidden
          width={34}
          height={32}
          draggable={false}
          className="absolute inset-0 hidden h-full w-full select-none object-contain dark:block"
        />
      </span>
      {showWordmark ? (
        <span className="text-lg font-bold tracking-tight text-ink">VHuman</span>
      ) : null}
    </Link>
  )
}
