import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { BandBadge } from '@/components/ui/Badge'
import { ScoreCircle } from '@/components/ui/ScoreCircle'
import { TraitBar } from '@/components/ui/TraitBar'
import { CAREER_FIELD_LABEL } from '@/utils/format'
import type { CareerRecommendation } from '@/types'

export function CareerCard({
  recommendation,
  rank,
}: {
  recommendation: CareerRecommendation
  rank?: number
}) {
  const { career, overall, breakdown, band } = recommendation

  return (
    <Card interactive className="flex flex-col p-5">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          {rank ? (
            <span className="mb-2 inline-block rounded bg-surface-sunken px-1.5 py-0.5 text-[10px] font-semibold tabular-nums text-ink-muted">
              #{rank}
            </span>
          ) : null}
          <h3 className="truncate text-base font-semibold text-ink">{career.name}</h3>
          <p className="mt-0.5 text-xs text-ink-muted">{CAREER_FIELD_LABEL[career.field]}</p>
        </div>
        <ScoreCircle value={overall} size="sm" />
      </div>

      <div className="mt-3">
        <BandBadge band={band} />
      </div>

      <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-ink-soft">{career.summary}</p>

      <div className="mt-4 space-y-2.5 border-t border-line pt-4">
        <TraitBar compact label="Kỹ năng" value={breakdown.skills} />
        <TraitBar compact label="Hồ sơ cá nhân" value={breakdown.profile} />
        <TraitBar compact label="Kinh nghiệm" value={breakdown.experience} />
      </div>

      <Link
        to={`/candidate/careers/${career.id}`}
        className="mt-4 link-cta"
      >
        Xem chi tiết
        <ArrowRight className="h-4 w-4" />
      </Link>
    </Card>
  )
}
