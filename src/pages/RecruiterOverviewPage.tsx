import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowRight,
  Bookmark,
  Search,
  Sparkles,
  TrendingUp,
  Users,
} from 'lucide-react'
import { PageHeader } from '@/components/ui/PageHeader'
import { Card, CardBody, CardHeader } from '@/components/ui/Card'
import { ButtonLink } from '@/components/ui/Button'
import { Avatar } from '@/components/ui/Avatar'
import { Badge, BandBadge } from '@/components/ui/Badge'
import { EmptyState } from '@/components/ui/EmptyState'
import { useCandidatePool } from '@/hooks/useCandidates'
import { useDemoSession } from '@/hooks/demoSessionContext'
import { matchingEngine } from '@/services/matching'
import { EMPTY_FILTERS } from '@/utils/filters'
import { CAREER_FIELD_LABEL, MANAGER_ROLE_LABEL, formatYears } from '@/utils/format'
import { DEMO_RECRUITER } from '@/data/recruiters'
import type { CareerField } from '@/types'

export function RecruiterOverviewPage() {
  const pool = useCandidatePool()
  const { savedIds, activeManager } = useDemoSession()

  // Top candidates with no filters applied: a useful "what's in the pool" view.
  const top = useMemo(
    () => matchingEngine.searchByProfile(pool, { ...EMPTY_FILTERS }, 'overall').slice(0, 5),
    [pool],
  )

  const groupCounts = useMemo(() => {
    const counts = new Map<CareerField, number>()
    for (const candidate of pool) {
      const best = matchingEngine.recommendCareers(candidate, 1)[0]
      if (!best) continue
      counts.set(best.career.field, (counts.get(best.career.field) ?? 0) + 1)
    }
    return [...counts.entries()].sort((a, b) => b[1] - a[1])
  }, [pool])

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow={DEMO_RECRUITER.company}
        title={`Xin chào, ${DEMO_RECRUITER.fullName}`}
        description="Tổng quan nguồn ứng viên và các công cụ tìm kiếm của VHuman."
        action={
          <ButtonLink to="/recruiter/search" variant="primary">
            <Search className="h-4 w-4" />
            Tìm ứng viên
          </ButtonLink>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={<Users className="h-4 w-4" />} label="Ứng viên trong nguồn" value={pool.length} />
        <StatCard icon={<Bookmark className="h-4 w-4" />} label="Đã lưu" value={savedIds.length} />
        <StatCard
          icon={<TrendingUp className="h-4 w-4" />}
          label="Phù hợp cao (≥85%)"
          value={top.filter((r) => r.overall >= 85).length}
        />
        <StatCard
          icon={<Sparkles className="h-4 w-4" />}
          label="Hồ sơ quản lý"
          value={activeManager ? 1 : 0}
          hint={activeManager ? activeManager.fullName : 'Chưa tạo'}
        />
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <Card interactive className="flex flex-col p-6">
          <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-on-primary">
            <Search className="h-5 w-5" />
          </span>
          <h3 className="mt-4 text-base font-semibold text-ink">Tìm theo Hồ sơ cá nhân</h3>
          <p className="mt-2 flex-1 text-sm leading-relaxed text-ink-soft">
            Mô tả mẫu hồ sơ mong muốn bằng tám thanh trượt đặc điểm, kết hợp với bộ lọc kỹ năng, kinh
            nghiệm và địa điểm.
          </p>
          <Link
            to="/recruiter/search"
            className="mt-4 link-cta"
          >
            Mở công cụ tìm kiếm
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Card>

        <Card interactive className="flex flex-col p-6">
          <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent-600 text-on-accent">
            <Sparkles className="h-5 w-5" />
          </span>
          <h3 className="mt-4 text-base font-semibold text-ink">Tìm theo mức tương hợp</h3>
          <p className="mt-2 flex-1 text-sm leading-relaxed text-ink-soft">
            Tìm ứng viên có phong cách cá nhân phù hợp với người quản lý hoặc môi trường lãnh đạo.
          </p>
          {activeManager ? (
            <p className="mt-3 text-xs text-ink-muted">
              Đang so sánh với{' '}
              <span className="font-medium text-ink">{activeManager.fullName}</span> ·{' '}
              {MANAGER_ROLE_LABEL[activeManager.role]}
            </p>
          ) : null}
          <Link
            to="/recruiter/compatibility"
            className="mt-4 link-cta"
          >
            Mở Tìm theo mức tương hợp
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Card>
      </div>

      <div className="grid gap-5 lg:grid-cols-[1.5fr_1fr]">
        <Card>
          <CardHeader
            title="Ứng viên nổi bật"
            description="Xếp hạng khi chưa áp dụng bộ lọc nào."
            action={
              <Link
                to="/recruiter/search"
                className="text-sm font-medium text-accent-700 hover:text-accent-800"
              >
                Xem tất cả
              </Link>
            }
          />
          <CardBody className="space-y-3">
            {top.length === 0 ? (
              <EmptyState title="Chưa có ứng viên" />
            ) : (
              top.map((result) => (
                <Link
                  key={result.candidate.id}
                  to={`/recruiter/candidate/${result.candidate.id}`}
                  className="flex items-center gap-3 rounded-lg border border-line p-3 transition-colors hover:bg-surface-muted"
                >
                  <Avatar name={result.candidate.personal.fullName} size="sm" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-ink">
                      {result.candidate.personal.fullName}
                    </p>
                    <p className="truncate text-xs text-ink-muted">
                      {result.candidate.headline} · {formatYears(result.candidate.yearsOfExperience)}
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    <BandBadge band={result.band} />
                    <span className="text-sm font-bold tabular-nums text-ink">
                      {Math.round(result.overall)}%
                    </span>
                  </div>
                </Link>
              ))
            )}
          </CardBody>
        </Card>

        <Card>
          <CardHeader
            title="Phân bố theo nhóm nghề"
            description="Dựa trên nhóm nghề phù hợp nhất của mỗi ứng viên."
          />
          <CardBody className="space-y-3">
            {groupCounts.map(([group, count]) => {
              const pct = (count / pool.length) * 100
              return (
                <div key={group}>
                  <div className="mb-1.5 flex items-baseline justify-between text-sm">
                    <span className="text-ink-soft">{CAREER_FIELD_LABEL[group]}</span>
                    <span className="font-semibold tabular-nums text-ink">{count}</span>
                  </div>
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-surface-sunken">
                    <div className="h-full rounded-full bg-primary" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              )
            })}
          </CardBody>
        </Card>
      </div>

      <Card className="flex flex-col items-start justify-between gap-4 border-accent-100 bg-accent-50/50 p-5 sm:flex-row sm:items-center">
        <div>
          <Badge tone="accent" className="mb-2">
            Gợi ý demo
          </Badge>
          <p className="text-sm font-semibold text-ink">
            Thử tạo hồ sơ ứng viên của chính bạn trước, rồi quay lại đây
          </p>
          <p className="mt-0.5 text-sm text-ink-soft">
            Hồ sơ của bạn sẽ xuất hiện ngay trong kết quả tìm kiếm ở chế độ nhà tuyển dụng.
          </p>
        </div>
        <ButtonLink to="/candidate/onboarding" variant="primary" size="sm">
          Tạo hồ sơ ứng viên
        </ButtonLink>
      </Card>
    </div>
  )
}

function StatCard({
  icon,
  label,
  value,
  hint,
}: {
  icon: React.ReactNode
  label: string
  value: number
  hint?: string
}) {
  return (
    <Card className="p-5">
      <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-surface-sunken text-ink-soft">
        {icon}
      </span>
      <p className="mt-3 text-2xl font-bold tabular-nums text-ink">{value}</p>
      <p className="mt-0.5 text-sm text-ink-muted">{label}</p>
      {hint ? <p className="mt-1 truncate text-xs text-ink-faint">{hint}</p> : null}
    </Card>
  )
}
