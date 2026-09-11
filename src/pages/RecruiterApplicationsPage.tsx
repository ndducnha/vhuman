import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Inbox } from 'lucide-react'
import { PageHeader } from '@/components/ui/PageHeader'
import { Card, CardBody } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { ButtonLink } from '@/components/ui/Button'
import { EmptyState } from '@/components/ui/EmptyState'
import { Avatar } from '@/components/ui/Avatar'
import { TextArea } from '@/components/ui/Field'
import { JOB_BY_ID } from '@/data/jobs'
import { useCandidatePool } from '@/hooks/useCandidates'
import { useDemoSession } from '@/hooks/demoSessionContext'
import { APPLICATION_STAGE_LABEL, APPLICATION_STAGE_ORDER, formatDateVi } from '@/utils/format'
import { cn } from '@/utils/cn'
import type { ApplicationStage } from '@/types'

/** Toàn bộ đơn ứng tuyển, gộp theo trạng thái, đổi trạng thái và ghi chú tại chỗ. */
export function RecruiterApplicationsPage() {
  const pool = useCandidatePool()
  const { applications, setApplicationStage } = useDemoSession()
  const [filter, setFilter] = useState<ApplicationStage | 'all'>('all')

  const counts = useMemo(() => {
    const map = new Map<ApplicationStage, number>()
    for (const a of applications) map.set(a.stage, (map.get(a.stage) ?? 0) + 1)
    return map
  }, [applications])

  const rows = useMemo(
    () =>
      applications
        .filter((a) => filter === 'all' || a.stage === filter)
        .map((a) => ({ app: a, job: JOB_BY_ID[a.jobId], candidate: pool.find((c) => c.id === a.candidateId) }))
        .filter((r) => r.job)
        .sort((a, b) => b.app.appliedAt.localeCompare(a.app.appliedAt)),
    [applications, filter, pool],
  )

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Nhà tuyển dụng"
        title="Đơn ứng tuyển"
        description="Toàn bộ hồ sơ ứng viên đã nộp qua các tin tuyển dụng."
      />

      {applications.length === 0 ? (
        <EmptyState
          icon={<Inbox className="h-6 w-6" />}
          title="Chưa có đơn ứng tuyển nào"
          description="Khi ứng viên nộp hồ sơ qua tin tuyển dụng, đơn sẽ xuất hiện ở đây."
          action={<ButtonLink to="/recruiter/jobs" variant="primary">Xem tin tuyển dụng</ButtonLink>}
        />
      ) : (
        <>
          <div className="flex flex-wrap gap-2">
            <FilterChip label={`Tất cả (${applications.length})`} active={filter === 'all'} onClick={() => setFilter('all')} />
            {APPLICATION_STAGE_ORDER.filter((s) => counts.get(s)).map((s) => (
              <FilterChip
                key={s}
                label={`${APPLICATION_STAGE_LABEL[s]} (${counts.get(s)})`}
                active={filter === s}
                onClick={() => setFilter(s)}
              />
            ))}
          </div>

          <div className="space-y-4">
            {rows.map(({ app, job, candidate }) => (
              <Card key={app.id}>
                <CardBody className="space-y-4">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div className="flex min-w-0 items-center gap-3">
                      <Avatar name={candidate?.personal.fullName ?? 'Ứng viên'} size="md" />
                      <div className="min-w-0">
                        {candidate ? (
                          <Link
                            to={`/recruiter/candidate/${candidate.id}`}
                            className="text-base font-semibold text-ink transition-colors hover:text-accent-700"
                          >
                            {candidate.personal.fullName}
                          </Link>
                        ) : (
                          <p className="text-base font-semibold text-ink">Ứng viên</p>
                        )}
                        <p className="text-sm text-ink-soft">
                          Ứng tuyển{' '}
                          <Link to={`/recruiter/jobs/${job.id}`} className="font-medium text-accent-700 hover:underline">
                            {job.title}
                          </Link>
                        </p>
                        <p className="mt-0.5 text-xs text-ink-muted">
                          Nộp ngày {formatDateVi(app.appliedAt.slice(0, 10))}
                        </p>
                      </div>
                    </div>
                    <Badge tone="accent">{APPLICATION_STAGE_LABEL[app.stage]}</Badge>
                  </div>

                  {app.coverNote ? (
                    <p className="rounded-lg border border-line bg-surface-sunken p-3 text-sm leading-relaxed text-ink-soft">
                      {app.coverNote}
                    </p>
                  ) : null}

                  <div>
                    <p className="mb-2 text-xs font-medium text-ink-muted">Đổi trạng thái</p>
                    <div className="flex flex-wrap gap-1.5">
                      {APPLICATION_STAGE_ORDER.map((stage) => (
                        <button
                          key={stage}
                          type="button"
                          onClick={() => setApplicationStage(app.id, stage)}
                          aria-pressed={app.stage === stage}
                          className={cn(
                            'rounded-md border px-2.5 py-1 text-xs font-medium transition-colors',
                            app.stage === stage
                              ? 'border-primary bg-primary text-on-primary'
                              : 'border-line bg-card text-ink-soft hover:border-primary hover:text-primary',
                          )}
                        >
                          {APPLICATION_STAGE_LABEL[stage]}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="field-label" htmlFor={`note-${app.id}`}>Ghi chú nội bộ</label>
                    <TextArea
                      id={`note-${app.id}`}
                      defaultValue={app.recruiterNote}
                      placeholder="Ghi chú của bạn về ứng viên này..."
                      className="min-h-[70px]"
                      onBlur={(e) => setApplicationStage(app.id, app.stage, e.target.value)}
                    />
                    <p className="field-hint">Ghi chú lưu khi bạn rời khỏi ô. Ứng viên không nhìn thấy.</p>
                  </div>
                </CardBody>
              </Card>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

function FilterChip({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'rounded-pill border px-3.5 py-1.5 text-sm font-medium transition-colors',
        active ? 'border-primary bg-primary text-on-primary' : 'border-line bg-card text-ink-soft hover:border-primary',
      )}
    >
      {label}
    </button>
  )
}
