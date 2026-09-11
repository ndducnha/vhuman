import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { FileText, XCircle } from 'lucide-react'
import { PageHeader } from '@/components/ui/PageHeader'
import { Card, CardBody } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button, ButtonLink } from '@/components/ui/Button'
import { EmptyState } from '@/components/ui/EmptyState'
import { JOB_BY_ID } from '@/data/jobs'
import { useDemoSession } from '@/hooks/demoSessionContext'
import {
  APPLICATION_STAGE_LABEL, APPLICATION_STAGE_ORDER,
  formatDateVi, formatSalary, SENIORITY_LABEL,
} from '@/utils/format'
import type { ApplicationStage } from '@/types'

const STAGE_TONE: Record<ApplicationStage, 'neutral' | 'accent' | 'warn' | 'success' | 'danger'> = {
  applied: 'neutral',
  reviewing: 'accent',
  interview: 'warn',
  offer: 'success',
  hired: 'success',
  rejected: 'danger',
}

/** Ứng viên theo dõi các đơn đã nộp và trạng thái từng đơn. */
export function MyApplicationsPage() {
  const { applications, withdrawApplication } = useDemoSession()

  const rows = useMemo(
    () =>
      applications
        .map((a) => ({ app: a, job: JOB_BY_ID[a.jobId] }))
        .filter((r) => r.job)
        .sort((a, b) => b.app.appliedAt.localeCompare(a.app.appliedAt)),
    [applications],
  )

  const counts = useMemo(() => {
    const map = new Map<ApplicationStage, number>()
    for (const a of applications) map.set(a.stage, (map.get(a.stage) ?? 0) + 1)
    return map
  }, [applications])

  return (
    <div className="container space-y-6">
      <PageHeader
        eyebrow="Ứng viên"
        title="Đơn ứng tuyển của tôi"
        description="Theo dõi các vị trí bạn đã nộp hồ sơ và trạng thái hiện tại."
        action={<ButtonLink to="/viec-lam" variant="secondary">Tìm việc làm</ButtonLink>}
      />

      {rows.length === 0 ? (
        <EmptyState
          icon={<FileText className="h-6 w-6" />}
          title="Bạn chưa nộp đơn nào"
          description="Xem danh sách việc làm và ứng tuyển vị trí phù hợp với hồ sơ của bạn."
          action={<ButtonLink to="/viec-lam" variant="crimson">Xem việc làm</ButtonLink>}
        />
      ) : (
        <>
          <div className="flex flex-wrap gap-2">
            {APPLICATION_STAGE_ORDER.filter((s) => counts.get(s)).map((s) => (
              <Badge key={s} tone={STAGE_TONE[s]}>
                {APPLICATION_STAGE_LABEL[s]}: {counts.get(s)}
              </Badge>
            ))}
          </div>

          <div className="space-y-4">
            {rows.map(({ app, job }) => (
              <Card key={app.id}>
                <CardBody className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <Link
                        to={`/viec-lam/${job.id}`}
                        className="text-base font-semibold text-ink transition-colors hover:text-accent-700"
                      >
                        {job.title}
                      </Link>
                      <Badge tone={STAGE_TONE[app.stage]}>{APPLICATION_STAGE_LABEL[app.stage]}</Badge>
                    </div>
                    <p className="mt-1 text-sm text-ink-soft">
                      {job.company} · {job.location} · {SENIORITY_LABEL[job.seniority]}
                    </p>
                    <p className="mt-1 text-xs text-ink-muted">
                      Nộp ngày {formatDateVi(app.appliedAt.slice(0, 10))} ·{' '}
                      {formatSalary(job.salaryMin, job.salaryMax)}/tháng
                    </p>

                    {app.coverNote ? (
                      <p className="mt-3 rounded-lg border border-line bg-surface-sunken p-3 text-sm leading-relaxed text-ink-soft">
                        {app.coverNote}
                      </p>
                    ) : null}
                  </div>

                  <div className="flex shrink-0 gap-2">
                    <ButtonLink to={`/viec-lam/${job.id}`} variant="secondary" size="sm">
                      Xem tin
                    </ButtonLink>
                    {app.stage !== 'hired' ? (
                      <Button variant="danger" size="sm" onClick={() => withdrawApplication(app.id)}>
                        <XCircle className="h-4 w-4" />
                        Rút đơn
                      </Button>
                    ) : null}
                  </div>
                </CardBody>
              </Card>
            ))}
          </div>

          <p className="rounded-xl border border-line bg-card p-4 text-xs leading-relaxed text-ink-muted">
            Trạng thái đơn trong bản thử nghiệm này do bạn tự đổi ở chế độ nhà tuyển dụng. Không có
            máy chủ nào xử lý hồ sơ.
          </p>
        </>
      )}
    </div>
  )
}
