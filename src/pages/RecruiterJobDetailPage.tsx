import { useMemo } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Briefcase, MapPin, Users } from 'lucide-react'
import { Card, CardBody, CardHeader } from '@/components/ui/Card'
import { Badge, BandBadge } from '@/components/ui/Badge'
import { Button, ButtonLink } from '@/components/ui/Button'
import { EmptyState } from '@/components/ui/EmptyState'
import { Avatar } from '@/components/ui/Avatar'
import { SkillTag } from '@/components/ui/SkillTag'
import { JOB_BY_ID } from '@/data/jobs'
import { skillName } from '@/data/skills'
import { matchCandidateToJob } from '@/services/matching'
import { useCandidatePool } from '@/hooks/useCandidates'
import { useDemoSession } from '@/hooks/demoSessionContext'
import {
  APPLICATION_STAGE_LABEL, CAREER_FIELD_LABEL, JOB_STATUS_LABEL,
  SENIORITY_LABEL, WORK_MODE_LABEL, formatDateVi, formatSalary, formatYears,
} from '@/utils/format'

/** Chi tiết tin tuyển dụng phía nhà tuyển dụng, kèm ứng viên phù hợp và đơn đã nộp. */
export function RecruiterJobDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const pool = useCandidatePool()
  const { applications, setApplicationStage } = useDemoSession()

  const job = id ? JOB_BY_ID[id] : undefined

  const ranked = useMemo(() => {
    if (!job) return []
    return pool
      .map((candidate) => ({ candidate, match: matchCandidateToJob(candidate, job) }))
      .sort((a, b) => b.match.overall - a.match.overall)
      .slice(0, 8)
  }, [pool, job])

  const jobApplications = useMemo(
    () => applications.filter((a) => a.jobId === id),
    [applications, id],
  )

  if (!job) {
    return (
      <EmptyState
        icon={<Briefcase className="h-6 w-6" />}
        title="Không tìm thấy tin tuyển dụng"
        action={<ButtonLink to="/recruiter/jobs" variant="primary">Về danh sách tin</ButtonLink>}
      />
    )
  }

  return (
    <div className="space-y-6">
      <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="-ml-2">
        <ArrowLeft className="h-4 w-4" />
        Quay lại
      </Button>

      <Card>
        <CardBody>
          <div className="flex flex-wrap items-center gap-2">
            <Badge tone="outline">{CAREER_FIELD_LABEL[job.field]}</Badge>
            <Badge tone={job.status === 'open' ? 'success' : job.status === 'draft' ? 'warn' : 'neutral'}>
              {JOB_STATUS_LABEL[job.status]}
            </Badge>
          </div>
          <h1 className="mt-3 text-2xl font-bold text-ink">{job.title}</h1>
          <p className="mt-1 text-sm text-ink-soft">{job.company}</p>
          <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-ink-muted">
            <span className="inline-flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5" />{job.location}</span>
            <span>{SENIORITY_LABEL[job.seniority]} · {WORK_MODE_LABEL[job.workMode]}</span>
            <span className="font-medium text-ink">{formatSalary(job.salaryMin, job.salaryMax)}/tháng</span>
            <span>{job.openings} vị trí</span>
            <span>Đăng {formatDateVi(job.postedAt)}</span>
          </div>
          <p className="mt-4 border-t border-line pt-4 text-sm leading-relaxed text-ink-soft">{job.summary}</p>
          <div className="mt-4 flex flex-wrap gap-1.5">
            {job.skills.map((s) => <SkillTag key={s} name={skillName(s)} />)}
          </div>
        </CardBody>
      </Card>

      {/* Đơn đã nộp */}
      <Card>
        <CardHeader
          icon={<Users className="h-4 w-4" />}
          title={`Đơn ứng tuyển (${jobApplications.length})`}
          description="Đổi trạng thái để theo dõi tiến trình."
        />
        <CardBody className="space-y-3">
          {jobApplications.length === 0 ? (
            <p className="text-sm text-ink-muted">Chưa có ai nộp đơn cho vị trí này.</p>
          ) : (
            jobApplications.map((app) => {
              const candidate = pool.find((c) => c.id === app.candidateId)
              return (
                <div key={app.id} className="rounded-lg border border-line p-4">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="flex min-w-0 items-center gap-3">
                      <Avatar name={candidate?.personal.fullName ?? 'Ứng viên'} size="sm" />
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-ink">
                          {candidate?.personal.fullName ?? 'Ứng viên'}
                        </p>
                        <p className="truncate text-xs text-ink-muted">
                          Nộp ngày {formatDateVi(app.appliedAt.slice(0, 10))}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {(['applied', 'reviewing', 'interview', 'offer', 'rejected'] as const).map((stage) => (
                        <button
                          key={stage}
                          type="button"
                          onClick={() => setApplicationStage(app.id, stage)}
                          aria-pressed={app.stage === stage}
                          className={
                            app.stage === stage
                              ? 'rounded-md border border-primary bg-primary px-2.5 py-1 text-xs font-medium text-on-primary'
                              : 'rounded-md border border-line bg-card px-2.5 py-1 text-xs font-medium text-ink-soft transition-colors hover:border-primary hover:text-primary'
                          }
                        >
                          {APPLICATION_STAGE_LABEL[stage]}
                        </button>
                      ))}
                    </div>
                  </div>
                  {app.coverNote ? (
                    <p className="mt-3 rounded-lg bg-surface-sunken p-3 text-sm leading-relaxed text-ink-soft">
                      {app.coverNote}
                    </p>
                  ) : null}
                </div>
              )
            })
          )}
        </CardBody>
      </Card>

      {/* Ứng viên phù hợp trong nguồn */}
      <Card>
        <CardHeader
          title="Ứng viên phù hợp trong nguồn"
          description="Xếp theo mức khớp với chính tin này, kể cả người chưa nộp đơn."
        />
        <CardBody className="space-y-3">
          {ranked.map(({ candidate, match }) => (
            <Link
              key={candidate.id}
              to={`/recruiter/candidate/${candidate.id}`}
              className="flex items-center gap-3 rounded-lg border border-line p-3 transition-colors hover:bg-surface-sunken"
            >
              <Avatar name={candidate.personal.fullName} size="sm" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-ink">{candidate.personal.fullName}</p>
                <p className="truncate text-xs text-ink-muted">
                  {candidate.headline} · {formatYears(candidate.yearsOfExperience)}
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                <BandBadge band={match.band} />
                <span className="text-sm font-bold tabular-nums text-ink">{match.overall}%</span>
              </div>
            </Link>
          ))}
        </CardBody>
      </Card>
    </div>
  )
}
