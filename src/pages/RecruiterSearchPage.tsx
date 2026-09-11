import { useEffect, useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Search, SlidersHorizontal, Sparkles, UserSearch, Users, X } from 'lucide-react'
import { PageHeader } from '@/components/ui/PageHeader'
import { Card, CardBody, CardHeader } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Select } from '@/components/ui/Field'
import { Badge } from '@/components/ui/Badge'
import { EmptyState } from '@/components/ui/EmptyState'
import { Avatar } from '@/components/ui/Avatar'
import { CandidateCard } from '@/components/CandidateCard'
import { SearchFilters } from '@/components/SearchFilters'
import { EMPTY_FILTERS, countActiveFilters } from '@/utils/filters'
import { ManagerProfileForm } from '@/components/ManagerProfileForm'
import { TraitRadar } from '@/components/TraitRadar'
import { useCandidatePool } from '@/hooks/useCandidates'
import { useDemoSession } from '@/hooks/demoSessionContext'
import { matchingEngine, matchingConfig } from '@/services/matching'
import { DEMO_RECRUITER } from '@/data/recruiters'
import { MANAGER_ROLE_LABEL } from '@/utils/format'
import { cn } from '@/utils/cn'
import type { CandidateSearchFilters, SortKey } from '@/types'

type Tab = 'profile' | 'compatibility'

const SORT_OPTIONS: Array<{ value: SortKey; label: string }> = [
  { value: 'overall', label: 'Phù hợp tổng thể' },
  { value: 'skills', label: 'Kỹ năng tốt nhất' },
  { value: 'compatibility', label: 'Mức tương hợp cao nhất' },
  { value: 'experience', label: 'Kinh nghiệm nhiều nhất' },
]

/**
 * Both recruiter search modes live here.
 * `/recruiter/search` opens the profile tab, `/recruiter/compatibility` the
 * compatibility tab: switching tabs updates the URL so links stay shareable.
 */
export function RecruiterSearchPage() {
  const location = useLocation()
  const navigate = useNavigate()

  // Both /recruiter/search and /recruiter/compatibility render this component,
  // so the active tab is derived from the URL rather than held in state 
  // otherwise navigating between the two sidebar links would leave the
  // already-mounted component showing the wrong tab.
  const tab: Tab = location.pathname.includes('compatibility') ? 'compatibility' : 'profile'

  // A job posting can hand over its requirements via router state
  // ("Xem ứng viên" on the jobs page): seed the filters from it.
  const prefill = location.state as Partial<CandidateSearchFilters> | null

  const [filters, setFilters] = useState<CandidateSearchFilters>({
    ...EMPTY_FILTERS,
    ...(prefill ?? {}),
  })

  // The component may already be mounted when the jobs page navigates here,
  // in which case the initial state above has already run: apply the incoming
  // requirements on each new navigation that carries them.
  useEffect(() => {
    if (!prefill) return
    setFilters({ ...EMPTY_FILTERS, ...prefill })
    // location.key changes on every navigation, including repeat visits.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.key])
  const [sort, setSort] = useState<SortKey>('overall')
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [showManagerForm, setShowManagerForm] = useState(false)

  const pool = useCandidatePool()
  const { isSaved, toggleSaved, managers, activeManager, setActiveManagerId, addManager } =
    useDemoSession()

  const results = useMemo(() => {
    if (tab === 'compatibility') {
      if (!activeManager) return []
      return matchingEngine.searchByCompatibility(pool, activeManager, filters, sort)
    }
    return matchingEngine.searchByProfile(pool, filters, sort)
  }, [tab, pool, filters, sort, activeManager])

  const switchTab = (next: Tab) => {
    navigate(next === 'compatibility' ? '/recruiter/compatibility' : '/recruiter/search', {
      replace: true,
    })
  }

  const activeFilterCount = countActiveFilters(filters)

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Nhà tuyển dụng"
        title="Tìm ứng viên"
        description="Kết hợp lọc chuyên môn với mẫu hồ sơ cá nhân hoặc mức độ tương thích với người quản lý."
      />

      {/* Tabs */}
      <div className="flex gap-1 rounded-xl border border-line bg-card p-1">
        <TabButton
          active={tab === 'profile'}
          onClick={() => switchTab('profile')}
          icon={<UserSearch className="h-4 w-4" />}
          label="Theo mẫu hồ sơ"
        />
        <TabButton
          active={tab === 'compatibility'}
          onClick={() => switchTab('compatibility')}
          icon={<Sparkles className="h-4 w-4" />}
          label="Theo mức tương hợp"
        />
      </div>

      {tab === 'compatibility' ? (
        <CompatibilityPanel
          managers={managers}
          activeManagerId={activeManager?.id ?? null}
          onSelect={setActiveManagerId}
          showForm={showManagerForm}
          onToggleForm={() => setShowManagerForm((value) => !value)}
          onCreate={(profile) => {
            addManager(profile)
            setShowManagerForm(false)
          }}
        />
      ) : null}

      <div className="flex gap-6">
        {/* Desktop filter sidebar */}
        <aside className="hidden w-72 shrink-0 lg:block">
          <Card className="sticky top-24 max-h-[calc(100vh-8rem)] overflow-y-auto p-5">
            <SearchFilters
              filters={filters}
              onChange={setFilters}
              showTraits={tab === 'profile'}
            />
          </Card>
        </aside>

        {/* Results */}
        <div className="min-w-0 flex-1 space-y-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-ink-soft">
              <span className="text-lg font-bold text-ink">{results.length}</span> ứng viên phù hợp
            </p>

            <div className="flex items-center gap-2">
              <Button
                variant="secondary"
                size="sm"
                className="lg:hidden"
                onClick={() => setDrawerOpen(true)}
              >
                <SlidersHorizontal className="h-4 w-4" />
                Bộ lọc
                {activeFilterCount > 0 ? <Badge tone="accent">{activeFilterCount}</Badge> : null}
              </Button>

              <Select
                value={sort}
                onChange={(event) => setSort(event.target.value as SortKey)}
                className="w-auto min-w-[180px] py-2 text-sm"
                aria-label="Sắp xếp kết quả"
              >
                {SORT_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </Select>
            </div>
          </div>

          {tab === 'compatibility' && !activeManager ? (
            <EmptyState
              icon={<Sparkles className="h-6 w-6" />}
              title="Chưa chọn người quản lý"
              description="Tạo hoặc chọn một hồ sơ người quản lý để so sánh mức độ tương thích về phong cách làm việc."
              action={
                <Button variant="primary" onClick={() => setShowManagerForm(true)}>
                  Tạo hồ sơ người quản lý
                </Button>
              }
            />
          ) : results.length === 0 ? (
            <EmptyState
              icon={<Users className="h-6 w-6" />}
              title="Không có ứng viên phù hợp"
              description="Thử nới lỏng bộ lọc hoặc bỏ bớt yêu cầu về kỹ năng và kinh nghiệm."
              action={
                <Button variant="secondary" onClick={() => setFilters({ ...EMPTY_FILTERS })}>
                  Xoá bộ lọc
                </Button>
              }
            />
          ) : (
            <div className="grid gap-4 xl:grid-cols-2">
              {results.map((result) => (
                <CandidateCard
                  key={result.candidate.id}
                  result={result}
                  saved={isSaved(result.candidate.id)}
                  onToggleSave={() => toggleSaved(result.candidate.id)}
                  showCompatibility={tab === 'compatibility'}
                />
              ))}
            </div>
          )}

          <FormulaNote tab={tab} />
        </div>
      </div>

      {/* Mobile filter drawer */}
      {drawerOpen ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-scrim/50 backdrop-blur-sm"
            onClick={() => setDrawerOpen(false)}
            aria-hidden
          />
          <div className="absolute inset-y-0 right-0 flex w-[88vw] max-w-sm flex-col bg-card shadow-pop">
            <div className="flex h-16 shrink-0 items-center justify-between border-b border-line px-4">
              <p className="text-sm font-semibold text-ink">Bộ lọc</p>
              <Button variant="ghost" size="icon" aria-label="Đóng" onClick={() => setDrawerOpen(false)}>
                <X className="h-5 w-5" />
              </Button>
            </div>
            <div className="flex-1 overflow-y-auto p-4">
              <SearchFilters filters={filters} onChange={setFilters} showTraits={tab === 'profile'} />
            </div>
            <div className="shrink-0 border-t border-line p-4">
              <Button variant="primary" block onClick={() => setDrawerOpen(false)}>
                Xem {results.length} kết quả
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}

/* ------------------------------------------------------------------ */

function TabButton({
  active,
  onClick,
  icon,
  label,
}: {
  active: boolean
  onClick: () => void
  icon: React.ReactNode
  label: string
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        'flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors',
        active ? 'bg-primary text-on-primary' : 'text-ink-soft hover:bg-surface-muted',
      )}
    >
      {icon}
      <span className="truncate">{label}</span>
    </button>
  )
}

function CompatibilityPanel({
  managers,
  activeManagerId,
  onSelect,
  showForm,
  onToggleForm,
  onCreate,
}: {
  managers: import('@/types').ManagerProfile[]
  activeManagerId: string | null
  onSelect: (id: string) => void
  showForm: boolean
  onToggleForm: () => void
  onCreate: (profile: import('@/types').ManagerProfile) => void
}) {
  const active = managers.find((m) => m.id === activeManagerId)

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader
          title="Tìm theo mức tương hợp"
          description="Tìm ứng viên có phong cách cá nhân phù hợp với người quản lý hoặc môi trường lãnh đạo."
          action={
            <Button variant="secondary" size="sm" onClick={onToggleForm}>
              {showForm ? 'Đóng' : 'Tạo hồ sơ mới'}
            </Button>
          }
        />
        <CardBody>
          <div className="flex flex-wrap gap-2">
            {managers.map((manager) => (
              <button
                key={manager.id}
                type="button"
                onClick={() => onSelect(manager.id)}
                className={cn(
                  'flex items-center gap-3 rounded-xl border px-3.5 py-2.5 text-left transition-all',
                  manager.id === activeManagerId
                    ? 'border-primary bg-primary text-on-primary'
                    : 'border-line bg-card hover:border-ink-faint/50 hover:bg-surface-muted',
                )}
              >
                <Avatar name={manager.fullName} size="xs" />
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{manager.fullName}</p>
                  <p
                    className={cn(
                      'truncate text-xs',
                      manager.id === activeManagerId ? 'text-on-primary-muted' : 'text-ink-muted',
                    )}
                  >
                    {MANAGER_ROLE_LABEL[manager.role]} · {manager.company}
                  </p>
                </div>
              </button>
            ))}
          </div>

          {active?.astrology ? (
            <div className="mt-5 grid gap-5 border-t border-line pt-5 lg:grid-cols-[1fr_auto]">
              <div>
                <p className="text-sm font-semibold text-ink">
                  Phong cách của {active.fullName}
                </p>
                <p className="mt-1 text-sm leading-relaxed text-ink-soft">{active.astrology.narrative}</p>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {active.astrology.workingStyle.map((item) => (
                    <Badge key={item} tone="neutral">
                      {item}
                    </Badge>
                  ))}
                </div>
              </div>
              <div className="w-full lg:w-64">
                <TraitRadar traits={active.astrology.traits} height={200} />
              </div>
            </div>
          ) : null}
        </CardBody>
      </Card>

      {showForm ? (
        <ManagerProfileForm onSubmit={onCreate} defaultCompany={DEMO_RECRUITER.company} />
      ) : null}
    </div>
  )
}

function FormulaNote({ tab }: { tab: Tab }) {
  const weights =
    tab === 'compatibility'
      ? [
          ['Khớp kỹ năng', matchingConfig.compatibilitySearch.skills],
          ['Khớp nhóm nghề', matchingConfig.compatibilitySearch.career],
          ['Mức tương hợp', matchingConfig.compatibilitySearch.compatibility],
        ]
      : [
          ['Khớp kỹ năng', matchingConfig.profileSearch.skills],
          ['Khớp kinh nghiệm', matchingConfig.profileSearch.experience],
          ['Hồ sơ cá nhân', matchingConfig.profileSearch.profile],
        ]

  return (
    <div className="rounded-xl border border-line bg-card p-4">
      <p className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-ink-muted">
        <Search className="h-3.5 w-3.5" />
        Cách tính điểm phù hợp tổng thể
      </p>
      <p className="text-sm text-ink-soft">
        {(weights as Array<[string, number]>)
          .map(([label, weight]) => `${label} × ${Math.round(weight * 100)}%`)
          .join('  +  ')}
      </p>
      <p className="mt-2 text-xs leading-relaxed text-ink-muted">
        Đây là chỉ số tham khảo trong bản demo. Kết quả không nên được dùng như căn cứ duy nhất cho
        quyết định tuyển dụng.
      </p>
    </div>
  )
}
