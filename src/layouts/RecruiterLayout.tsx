import { useState } from 'react'
import { NavLink, Outlet, useLocation } from 'react-router-dom'
import {
  Bookmark,
  Inbox,
  Building2,
  LayoutDashboard,
  Menu,
  Search,
  Settings,
  Sparkles,
  Users,
  X,
} from 'lucide-react'
import { Logo } from '@/components/Logo'
import { DemoBadge } from '@/components/DemoBadge'
import { ThemeToggle } from '@/components/ThemeToggle'
import { Button, ButtonLink } from '@/components/ui/Button'
import { Avatar } from '@/components/ui/Avatar'
import { cn } from '@/utils/cn'
import { DEMO_RECRUITER } from '@/data/recruiters'
import { useDemoSession } from '@/hooks/demoSessionContext'

const NAV = [
  { to: '/recruiter', label: 'Tổng quan', icon: LayoutDashboard, end: true },
  { to: '/recruiter/search', label: 'Tìm ứng viên', icon: Search },
  { to: '/recruiter/compatibility', label: 'Hồ sơ tương hợp', icon: Sparkles },
  { to: '/recruiter/saved', label: 'Ứng viên đã lưu', icon: Bookmark },
  { to: '/recruiter/applications', label: 'Đơn ứng tuyển', icon: Inbox },
  { to: '/recruiter/jobs', label: 'Tin tuyển dụng', icon: Users },
  { to: '/recruiter/company', label: 'Công ty', icon: Building2 },
  { to: '/recruiter/settings', label: 'Cài đặt', icon: Settings },
]

export function RecruiterLayout() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const location = useLocation()
  const { savedIds } = useDemoSession()

  return (
    <div className="flex min-h-screen bg-surface-muted">
      {/* Desktop sidebar */}
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r border-line bg-card lg:flex">
        <div className="flex h-16 items-center gap-2 border-b border-line px-5">
          <Logo to="/recruiter" />
        </div>
        <SidebarNav savedCount={savedIds.length} />
        <SidebarFooter />
      </aside>

      {/* Mobile drawer */}
      {mobileOpen ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-scrim/50 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
            aria-hidden
          />
          <aside className="relative flex h-full w-72 max-w-[85vw] flex-col bg-card shadow-pop animate-fade-in">
            <div className="flex h-16 items-center justify-between border-b border-line px-4">
              <Logo to="/recruiter" />
              <Button variant="ghost" size="icon" aria-label="Đóng" onClick={() => setMobileOpen(false)}>
                <X className="h-5 w-5" />
              </Button>
            </div>
            <div onClick={() => setMobileOpen(false)}>
              <SidebarNav savedCount={savedIds.length} />
            </div>
            <SidebarFooter />
          </aside>
        </div>
      ) : null}

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-3 border-b border-line bg-card/90 px-4 backdrop-blur-md sm:px-6">
          <div className="flex min-w-0 items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              aria-label="Mở menu"
              onClick={() => setMobileOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </Button>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-ink">
                {NAV.find((item) => (item.end ? location.pathname === item.to : location.pathname.startsWith(item.to)))
                  ?.label ?? 'Nhà tuyển dụng'}
              </p>
              <p className="truncate text-xs text-ink-muted">{DEMO_RECRUITER.company}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <DemoBadge className="hidden sm:inline-flex" />
            <ThemeToggle />
            <ButtonLink to="/choose-role" variant="secondary" size="sm" className="hidden sm:inline-flex">
              Đổi vai trò
            </ButtonLink>
            <Avatar name={DEMO_RECRUITER.fullName} size="sm" />
          </div>
        </header>

        <main className="min-w-0 flex-1 px-4 py-6 sm:px-6 lg:px-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

function SidebarNav({ savedCount }: { savedCount: number }) {
  return (
    <nav className="flex-1 space-y-1 overflow-y-auto p-3">
      {NAV.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          end={item.end}
          className={({ isActive }) =>
            cn(
              'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
              isActive ? 'bg-primary text-on-primary' : 'text-ink-soft hover:bg-surface-muted hover:text-ink',
            )
          }
        >
          <item.icon className="h-4 w-4 shrink-0" />
          <span className="flex-1 truncate">{item.label}</span>
          {item.to === '/recruiter/saved' && savedCount > 0 ? (
            <span className="rounded-full bg-accent-100 px-1.5 py-0.5 text-[10px] font-semibold text-accent-700">
              {savedCount}
            </span>
          ) : null}
        </NavLink>
      ))}
    </nav>
  )
}

function SidebarFooter() {
  return (
    <div className="border-t border-line p-3">
      <div className="flex items-center gap-3 rounded-lg bg-surface-muted p-3">
        <Avatar name={DEMO_RECRUITER.fullName} size="sm" />
        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-ink">{DEMO_RECRUITER.fullName}</p>
          <p className="truncate text-xs text-ink-muted">{DEMO_RECRUITER.title}</p>
        </div>
      </div>
    </div>
  )
}
