import { Link } from 'react-router-dom'
import { Bookmark, BookmarkCheck, MapPin } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Avatar } from '@/components/ui/Avatar'
import { Badge, BandBadge } from '@/components/ui/Badge'
import { Button, ButtonLink } from '@/components/ui/Button'
import { SkillTag } from '@/components/ui/SkillTag'
import { formatYears } from '@/utils/format'
import type { CandidateMatchResult } from '@/types'

export function CandidateCard({
  result,
  saved,
  onToggleSave,
  showCompatibility,
}: {
  result: CandidateMatchResult
  saved: boolean
  onToggleSave: () => void
  showCompatibility?: boolean
}) {
  const { candidate } = result

  return (
    <Card interactive className="flex flex-col p-5">
      <div className="flex items-start gap-4">
        <Avatar name={candidate.personal.fullName} src={candidate.personal.avatar} size="lg" />

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <Link
                to={`/recruiter/candidate/${candidate.id}`}
                className="block truncate py-2 -my-2 text-base font-semibold text-ink transition-colors duration-150 hover:text-accent-700"
              >
                {candidate.personal.fullName}
              </Link>
              <p className="truncate text-sm text-ink-soft">{candidate.headline}</p>
            </div>
            <BandBadge band={result.band} className="shrink-0" />
          </div>

          <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-ink-muted">
            <span className="inline-flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              {candidate.personal.currentCity}
            </span>
            <span>{formatYears(candidate.yearsOfExperience)}</span>
          </div>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-1.5">
        {candidate.skills.slice(0, 5).map((skill) => (
          <SkillTag key={skill.skillId} name={skill.name} />
        ))}
        {candidate.skills.length > 5 ? (
          <Badge tone="neutral">+{candidate.skills.length - 5}</Badge>
        ) : null}
      </div>

      <div className="mt-4 grid grid-cols-3 gap-3 border-t border-line pt-4">
        <ScoreCell label="Khớp kỹ năng" value={result.skillMatch} />
        {showCompatibility ? (
          <ScoreCell label="Mức tương hợp" value={result.compatibility?.score ?? null} />
        ) : (
          <ScoreCell label="Khớp hồ sơ cá nhân" value={result.profileMatch} hint="Đặt mẫu hồ sơ mong muốn ở bộ lọc để tính điểm này" />
        )}
        <ScoreCell label="Phù hợp tổng thể" value={result.overall} emphasis />
      </div>

      <div className="mt-4 flex gap-2">
        <ButtonLink
          to={`/recruiter/candidate/${candidate.id}`}
          variant="secondary"
          size="sm"
          className="flex-1"
        >
          Xem hồ sơ
        </ButtonLink>
        <Button
          variant={saved ? 'primary' : 'secondary'}
          size="sm"
          onClick={onToggleSave}
          aria-label={saved ? 'Bỏ lưu ứng viên' : 'Lưu ứng viên'}
        >
          {saved ? <BookmarkCheck className="h-4 w-4" /> : <Bookmark className="h-4 w-4" />}
          {saved ? 'Đã lưu' : 'Lưu'}
        </Button>
      </div>
    </Card>
  )
}

function ScoreCell({
  label,
  value,
  emphasis,
  hint,
}: {
  label: string
  value: number | null
  emphasis?: boolean
  hint?: string
}) {
  return (
    <div title={value === null ? hint : undefined}>
      <p className="text-[11px] leading-tight text-ink-muted">{label}</p>
      {value === null ? (
        <p className="mt-0.5 text-sm font-medium text-ink-faint" aria-label="Chưa có dữ liệu">
          Chưa tính
        </p>
      ) : (
        <p
          className={
            emphasis
              ? 'mt-0.5 text-lg font-bold tabular-nums text-ink'
              : 'mt-0.5 text-lg font-semibold tabular-nums text-ink-soft'
          }
        >
          {Math.round(value)}%
        </p>
      )}
    </div>
  )
}
