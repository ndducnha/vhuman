import { useEffect } from 'react'
import { HashRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { DemoSessionProvider } from '@/hooks/useDemoSession'
import { ErrorBoundary } from '@/components/ErrorBoundary'
import { PublicLayout } from '@/layouts/PublicLayout'
import { CandidateLayout } from '@/layouts/CandidateLayout'
import { RecruiterLayout } from '@/layouts/RecruiterLayout'
import { LandingPage } from '@/pages/LandingPage'
import { ChooseRolePage } from '@/pages/ChooseRolePage'
import { AboutPage } from '@/pages/AboutPage'
import { AstrologyPage } from '@/pages/AstrologyPage'
import { JobsPage } from '@/pages/JobsPage'
import { JobDetailPage } from '@/pages/JobDetailPage'
import { MyApplicationsPage } from '@/pages/MyApplicationsPage'
import { RoadmapPage } from '@/pages/RoadmapPage'
import { RecruiterJobDetailPage } from '@/pages/RecruiterJobDetailPage'
import { RecruiterApplicationsPage } from '@/pages/RecruiterApplicationsPage'
import { OnboardingPage } from '@/pages/OnboardingPage'
import { CandidateDashboardPage } from '@/pages/CandidateDashboardPage'
import { CareersPage } from '@/pages/CareersPage'
import { CareerDetailPage } from '@/pages/CareerDetailPage'
import { RecruiterOverviewPage } from '@/pages/RecruiterOverviewPage'
import { RecruiterSearchPage } from '@/pages/RecruiterSearchPage'
import { CandidateDetailPage } from '@/pages/CandidateDetailPage'
import { SavedCandidatesPage } from '@/pages/SavedCandidatesPage'
import { RecruiterJobsPage } from '@/pages/RecruiterJobsPage'
import { RecruiterCompanyPage } from '@/pages/RecruiterCompanyPage'
import { RecruiterSettingsPage } from '@/pages/RecruiterSettingsPage'
import { NotFoundPage } from '@/pages/NotFoundPage'

/**
 * HashRouter is deliberate: GitHub Pages serves static files only and has no
 * SPA rewrite, so `/candidate/profile` would 404 on refresh. Hash routes
 * (`/#/candidate/profile`) work on Pages, on any sub-path, and from `file://`.
 */
export function App() {
  return (
    <ErrorBoundary>
      <DemoSessionProvider>
        <HashRouter>
        <ScrollToTop />
        <Routes>
          {/* Public */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<LandingPage />} />
            <Route path="/choose-role" element={<ChooseRolePage />} />
            <Route path="/tu-vi" element={<AstrologyPage />} />
            <Route path="/about" element={<AboutPage />} />
          </Route>

          {/* Candidate */}
          <Route element={<CandidateLayout />}>
            <Route path="/candidate/onboarding" element={<OnboardingPage />} />
            <Route path="/candidate/profile" element={<CandidateDashboardPage />} />
            <Route path="/candidate/careers" element={<CareersPage />} />
            <Route path="/candidate/careers/:id" element={<CareerDetailPage />} />
            <Route path="/candidate/lo-trinh" element={<RoadmapPage />} />
            <Route path="/candidate/don-ung-tuyen" element={<MyApplicationsPage />} />
            <Route path="/viec-lam" element={<JobsPage />} />
            <Route path="/viec-lam/:id" element={<JobDetailPage />} />
            <Route path="/candidate" element={<Navigate to="/candidate/profile" replace />} />
          </Route>

          {/* Recruiter */}
          <Route element={<RecruiterLayout />}>
            <Route path="/recruiter" element={<RecruiterOverviewPage />} />
            <Route path="/recruiter/search" element={<RecruiterSearchPage />} />
            <Route path="/recruiter/compatibility" element={<RecruiterSearchPage />} />
            <Route path="/recruiter/candidate/:id" element={<CandidateDetailPage />} />
            <Route path="/recruiter/saved" element={<SavedCandidatesPage />} />
            <Route path="/recruiter/jobs" element={<RecruiterJobsPage />} />
            <Route path="/recruiter/jobs/:id" element={<RecruiterJobDetailPage />} />
            <Route path="/recruiter/applications" element={<RecruiterApplicationsPage />} />
            <Route path="/recruiter/company" element={<RecruiterCompanyPage />} />
            <Route path="/recruiter/settings" element={<RecruiterSettingsPage />} />
          </Route>

          <Route element={<PublicLayout />}>
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
        </HashRouter>
      </DemoSessionProvider>
    </ErrorBoundary>
  )
}

/** Restore scroll position on navigation: hash routing does not do this. */
function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return null
}
