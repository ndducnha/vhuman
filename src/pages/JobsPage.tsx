import { useMemo, useState } from 'react'
import { Briefcase, Search } from 'lucide-react'
import { PageHeader } from '@/components/ui/PageHeader'
import { Card } from '@/components/ui/Card'
import { TextInput, Select } from '@/components/ui/Field'
import { EmptyState } from '@/components/ui/EmptyState'
import { ButtonLink } from '@/components/ui/Button'
import { JobCard } from '@/components/JobCard'
import { OPEN_JOBS, JOB_LOCATIONS } from '@/data/jobs'
import { normalize } from '@/data/skills'
import { rankJobsForCandidate } from '@/services/matching'
import { useDemoSession } from '@/hooks/demoSessionContext'
import { CAREER_FIELD_LABEL, CAREER_FIELD_ORDER, SENIORITY_LABEL, SENIORITY_ORDER } from '@/utils/format'
import { cn } from '@/utils/cn'
import type { CareerField, SeniorityLevel } from '@/types'

/** Danh sách việc làm phía ứng viên, xếp theo mức phù hợp khi đã có hồ sơ. */
export function JobsPage() {
  const { candidate, applicationFor } = useDemoSession()
  const [query, setQuery] = useState('')
  const [field, setField] = useState<CareerField | 'all'>('all')
  const [location, setLocation] = useState('all')
  const [seniority, setSeniority] = useState<SeniorityLevel | 'all'>('all')

  const ranked = useMemo(() => {
    if (!candidate) return OPEN_JOBS.map((job) => ({ job, match: undefined }))
    return rankJobsForCandidate(candidate, OPEN_JOBS).map((m) => ({ job: m.job, match: m }))
  }, [candidate])

  const visible = useMemo(() => {
    const q = normalize(query)
    return ranked.filter(({ job }) => {
      if (field !== 'all' && job.field !== field) return false
      if (location !== 'all' && job.location !== location) return false
      if (seniority !== 'all' && job.seniority !== seniority) return false
      if (!q) return true
      return normalize([job.title, job.company, job.summary, job.location].join(' ')).includes(q)
    })
  }, [ranked, query, field, location, seniority])

  return (
    <div className="container space-y-6">
      <PageHeader
        eyebrow="Việc làm"
        title="Tin tuyển dụng"
        description={
          candidate
            ? 'Xếp theo mức độ phù hợp với hồ sơ của bạn.'
            : 'Tạo hồ sơ để biết tin nào hợp với bạn nhất.'
        }
        action={
          !candidate ? (
            <ButtonLink to="/candidate/onboarding" variant="crimson">
              Tạo hồ sơ
            </ButtonLink>
          ) : null
        }
      />

      <Card className="space-y-4 p-4">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-faint" />
          <TextInput
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Tìm theo vị trí, công ty, địa điểm..."
            className="pl-9"
            aria-label="Tìm việc làm"
          />
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          <Select value={field} onChange={(e) => setField(e.target.value as CareerField | 'all')} aria-label="Lĩnh vực">
            <option value="all">Tất cả lĩnh vực</option>
            {CAREER_FIELD_ORDER.map((f) => (
              <option key={f} value={f}>{CAREER_FIELD_LABEL[f]}</option>
            ))}
          </Select>
          <Select value={location} onChange={(e) => setLocation(e.target.value)} aria-label="Địa điểm">
            <option value="all">Tất cả địa điểm</option>
            {JOB_LOCATIONS.map((l) => <option key={l} value={l}>{l}</option>)}
          </Select>
          <Select value={seniority} onChange={(e) => setSeniority(e.target.value as SeniorityLevel | 'all')} aria-label="Cấp bậc">
            <option value="all">Tất cả cấp bậc</option>
            {SENIORITY_ORDER.map((s) => (
              <option key={s} value={s}>{SENIORITY_LABEL[s]}</option>
            ))}
          </Select>
        </div>
      </Card>

      <p className={cn('text-sm text-ink-soft')}>
        <span className="text-lg font-bold text-ink">{visible.length}</span> tin tuyển dụng
      </p>

      {visible.length === 0 ? (
        <EmptyState
          icon={<Briefcase className="h-6 w-6" />}
          title="Không có tin nào khớp bộ lọc"
          description="Thử bỏ bớt điều kiện lọc hoặc đổi từ khoá."
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map(({ job, match }) => (
            <JobCard key={job.id} job={job} match={match} appliedStage={applicationFor(job.id)?.stage} />
          ))}
        </div>
      )}
    </div>
  )
}
