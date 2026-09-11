import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import { Logo } from '@/components/Logo'
import { DemoBadge } from '@/components/DemoBadge'
import { ThemeToggle } from '@/components/ThemeToggle'
import { Button, ButtonLink } from '@/components/ui/Button'
import { cn } from '@/utils/cn'
import { useDemoSession } from '@/hooks/demoSessionContext'

// Kept short so five items fit on one line at 1280px without wrapping.
const NAV_ITEMS = [
  { to: '/viec-lam', label: 'Việc làm' },
  { to: '/candidate/careers', label: 'Nghề nghiệp' },
  { to: '/tu-vi', label: 'Tử Vi' },
  { to: '/dung-thu', label: 'Dùng thử' },
  { to: '/candidate/profile', label: 'Hồ sơ' },
  { to: '/recruiter', label: 'Nhà tuyển dụng' },
  { to: '/about', label: 'Về VHuman' },
]

export function SiteHeader() {
  const [open, setOpen] = useState(false)
  const location = useLocation()
  const { role } = useDemoSession()

  // Close the mobile drawer whenever the route changes.
  useEffect(() => {
    setOpen(false)
  }, [location.pathname])

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-card/85 backdrop-blur-md">
      <div className="container flex h-16 items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Logo />
          <DemoBadge className="hidden sm:inline-flex" />
        </div>

        <nav className="hidden items-center gap-0.5 lg:flex xl:gap-1">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                cn(
                  'rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                  isActive ? 'bg-surface-sunken text-ink' : 'text-ink-soft hover:bg-surface-muted hover:text-ink',
                )
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden items-center gap-1.5 lg:flex">
          <ThemeToggle />
          <ButtonLink to="/choose-role" variant="ghost" size="sm">
            {role ? 'Đổi vai trò' : 'Đăng nhập'}
          </ButtonLink>
          <ButtonLink to="/candidate/onboarding" variant="primary" size="sm">
            Tạo hồ sơ
          </ButtonLink>
        </div>

        <div className="flex items-center gap-1 lg:hidden">
        <ThemeToggle />
        <Button
          variant="ghost"
          size="icon"
          aria-label={open ? 'Đóng menu' : 'Mở menu'}
          aria-expanded={open}
          onClick={() => setOpen((value) => !value)}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
        </div>
      </div>

      {open ? (
        <div className="border-t border-line bg-card lg:hidden">
          <nav className="container flex flex-col gap-1 py-3">
            {NAV_ITEMS.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  cn(
                    'rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                    isActive ? 'bg-surface-sunken text-ink' : 'text-ink-soft hover:bg-surface-muted',
                  )
                }
              >
                {item.label}
              </NavLink>
            ))}
            <div className="mt-2 flex flex-col gap-2 border-t border-line pt-3">
              <Link
                to="/choose-role"
                className="rounded-lg border border-line px-3 py-2.5 text-center text-sm font-medium text-ink-soft"
              >
                {role ? 'Đổi vai trò' : 'Đăng nhập'}
              </Link>
              <ButtonLink to="/candidate/onboarding" variant="primary" block>
                Tạo hồ sơ
              </ButtonLink>
            </div>
          </nav>
        </div>
      ) : null}
    </header>
  )
}
