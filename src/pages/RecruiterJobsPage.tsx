import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Briefcase, MapPin, Search, Users } from 'lucide-react'
import { PageHeader } from '@/components/ui/PageHeader'
import { Card, CardBody } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button, ButtonLink } from '@/components/ui/Button'
import { SkillTag } from '@/components/ui/SkillTag'
import { JOB_POSTINGS } from '@/data/jobs'
import { skillName } from '@/data/skills'
import { useCandidatePool } from '@/hooks/useCandidates'
import { matchingEngine } from '@/services/matching'
import { EMPTY_FILTERS } from '@/utils/filters'
import { SENIORITY_LABEL, WORK_MODE_LABEL, formatSalary, formatDateVi } from '@/utils/format'
import { cn } from '@/utils/cn'
import type { JobPosting } from '@/types'

const STATUS_LABEL: Record<JobPosting['status'], string> = {
  open: 'Đang tuyển',
  draft: 'Bản nháp',
  closed: 'Đã đóng',
}

export function RecruiterJobsPage() {
  const pool = useCandidatePool()
  const navigate = useNavigate()
  const [status, setStatus] = useState<JobPosting['status'] | 'all'>('all')

  // Each posting shows how many candidates in the pool clear a 70% match 
  // this makes the page a real, working view rather than a static list.
  const jobsWithMatches = useMemo(
    () =>
      JOB_POSTINGS.map((job) => {
        const results = matchingEngine.searchByProfile(
          pool,
          {
            ...EMPTY_FILTERS,
            skills: job.skills,
            seniority: [job.seniority],
          },
          'overall',
        )
        return { job, strongMatches: results.filter((r) => r.overall >= 70).length }
      }),
    [pool],
  )

  const visible = jobsWithMatches.filter(
    ({ job }) => status === 'all' || job.status === status,
  )

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Nhà tuyển dụng"
        title="Tin tuyển dụng"
        description="Các vị trí đang mở trong bản demo, kèm số ứng viên đạt mức phù hợp từ 70% trở lên."
      />

      <div className="flex flex-wrap gap-2">
        {(['all', 'open', 'draft', 'closed'] as const).map((value) => (
          <button
            key={value}
            type="button"
            onClick={() => setStatus(value)}
            className={cn(
              'rounded-lg border px-3 py-1.5 text-sm font-medium transition-colors',
              status === value
                ? 'border-primary bg-primary text-on-primary'
                : 'border-line bg-card text-ink-soft hover:bg-surface-muted',
            )}
          >
            {value === 'all' ? 'Tất cả' : STATUS_LABEL[value]}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {visible.map(({ job, strongMatches }) => (
          <Card key={job.id}>
            <CardBody className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <Link
                    to={`/recruiter/jobs/${job.id}`}
                    className="text-base font-semibold text-ink transition-colors hover:text-accent-700"
                  >
                    {job.title}
                  </Link>
                  <Badge tone={job.status === 'open' ? 'success' : job.status === 'draft' ? 'warn' : 'neutral'}>
                    {STATUS_LABEL[job.status]}
                  </Badge>
                </div>

                <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-sm text-ink-muted">
                  <span className="inline-flex items-center gap-1.5">
                    <MapPin className="h-3.5 w-3.5" />
                    {job.location}
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <Briefcase className="h-3.5 w-3.5" />
                    {SENIORITY_LABEL[job.seniority]} · {WORK_MODE_LABEL[job.workMode]}
                  </span>
                  <span>{formatSalary(job.salaryMin, job.salaryMax)}/tháng</span>
                  <span>{job.openings} vị trí</span>
                </div>

                <div className="mt-3 flex flex-wrap gap-1.5">
                  {job.skills.map((skillId) => (
                    <SkillTag key={skillId} name={skillName(skillId)} />
                  ))}
                </div>

                <p className="mt-3 text-xs text-ink-faint">Đăng ngày {formatDateVi(job.postedAt)}</p>
              </div>

              <div className="flex shrink-0 items-center gap-5">
                <div className="text-center">
                  <p className="flex items-center justify-center gap-1.5 text-2xl font-bold tabular-nums text-ink">
                    <Users className="h-4 w-4 text-ink-faint" />
                    {strongMatches}
                  </p>
                  <p className="mt-0.5 text-xs text-ink-muted">ứng viên phù hợp</p>
                </div>

                <div className="flex flex-col gap-2 sm:flex-row">
                  <ButtonLink to={`/recruiter/jobs/${job.id}`} variant="primary" size="sm">
                    Mở tin
                  </ButtonLink>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() =>
                      navigate('/recruiter/search', {
                        state: { skills: job.skills, seniority: [job.seniority] },
                      })
                    }
                  >
                    <Search className="h-4 w-4" />
                    Tìm ứng viên
                  </Button>
                </div>
              </div>
            </CardBody>
          </Card>
        ))}
      </div>
    </div>
  )
}
