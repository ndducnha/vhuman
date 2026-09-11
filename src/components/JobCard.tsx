import { Link } from 'react-router-dom'
import { Briefcase, CheckCircle2, MapPin } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Badge, BandBadge } from '@/components/ui/Badge'
import { SkillTag } from '@/components/ui/SkillTag'
import { ScoreCircle } from '@/components/ui/ScoreCircle'
import { CornerMark } from '@/components/ui/Ornament'
import { SENIORITY_LABEL, WORK_MODE_LABEL, formatSalary } from '@/utils/format'
import type { ApplicationStage, JobMatchResult, JobPosting } from '@/types'
import { APPLICATION_STAGE_LABEL } from '@/utils/format'
import { skillName } from '@/data/skills'

/**
 * Thẻ tin tuyển dụng phía ứng viên.
 * Khi đã có hồ sơ thì hiển thị luôn mức phù hợp, nên người xem biết ngay
 * tin nào đáng đọc tiếp thay vì phải mở từng tin.
 */
export function JobCard({
  job,
  match,
  appliedStage,
}: {
  job: JobPosting
  match?: JobMatchResult
  appliedStage?: ApplicationStage
}) {
  return (
    <Link to={`/viec-lam/${job.id}`} className="block">
      <Card interactive ornament className="relative h-full overflow-hidden p-5">
        <CornerMark corner="tl" className="absolute left-2.5 top-2.5 text-primary/35" />

        <div className="flex items-start justify-between gap-4 pl-3">
          <div className="min-w-0">
            <h3 className="truncate text-base font-semibold text-ink">{job.title}</h3>
            <p className="mt-0.5 truncate text-sm text-ink-soft">{job.company}</p>
          </div>
          {match ? <ScoreCircle value={match.overall} size="sm" /> : null}
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1.5 pl-3 text-xs text-ink-muted">
          <span className="inline-flex items-center gap-1">
            <MapPin className="h-3 w-3" />
            {job.location}
          </span>
          <span className="inline-flex items-center gap-1">
            <Briefcase className="h-3 w-3" />
            {SENIORITY_LABEL[job.seniority]}
          </span>
          <span>{WORK_MODE_LABEL[job.workMode]}</span>
          <span className="font-medium text-ink-soft">
            {formatSalary(job.salaryMin, job.salaryMax)}
          </span>
        </div>

        <div className="mt-3 flex flex-wrap gap-1.5 pl-3">
          {job.skills.slice(0, 4).map((id) => (
            <SkillTag
              key={id}
              name={skillName(id)}
              matched={match?.matchedSkills.includes(skillName(id))}
            />
          ))}
          {job.skills.length > 4 ? <Badge tone="neutral">+{job.skills.length - 4}</Badge> : null}
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-line pt-3 pl-3">
          {match ? <BandBadge band={match.band} /> : null}
          {appliedStage ? (
            <Badge tone="success">
              <CheckCircle2 className="h-3 w-3" />
              {APPLICATION_STAGE_LABEL[appliedStage]}
            </Badge>
          ) : null}
          {job.openings > 1 ? <Badge tone="neutral">{job.openings} vị trí</Badge> : null}
        </div>
      </Card>
    </Link>
  )
}
