import { Outlet } from 'react-router-dom'
import { SiteHeader } from '@/components/SiteHeader'
import { SiteFooter } from '@/components/SiteFooter'

export function CandidateLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-surface-muted">
      <SiteHeader />
      <main className="flex-1 py-8">
        <Outlet />
      </main>
      <SiteFooter />
    </div>
  )
}
