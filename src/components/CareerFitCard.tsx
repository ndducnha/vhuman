import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Badge, BandBadge } from '@/components/ui/Badge'
import { ScoreCircle } from '@/components/ui/ScoreCircle'
import { CornerMark } from '@/components/ui/Ornament'
import { CAREER_FIELD_LABEL } from '@/utils/format'
import { bandOf } from '@/utils/score'
import { matchingConfig } from '@/services/matching'
import type { CareerFitResult } from '@/services/matching'

/**
 * Thẻ gợi ý nghề, hiện rõ ba lớp thay vì gộp thành một con số.
 *
 * Người đọc cần thấy được điểm đến từ đâu. Gộp lại thì lớp Tử Vi rất dễ bị hiểu
 * nhầm là yếu tố quyết định, trong khi thực tế bằng chứng chiếm tỉ trọng lớn nhất.
 */
export function CareerFitCard({ fit, rank }: { fit: CareerFitResult; rank?: number }) {
  const w = matchingConfig.careerFit
  const layers = [
    { label: 'Phản chiếu từ lá số', value: fit.breakdown.reflection, weight: w.reflection, tone: 'bg-accent-500' },
    { label: 'Bằng chứng thực tế', value: fit.breakdown.evidence, weight: w.evidence, tone: 'bg-primary' },
    { label: 'Mong muốn của bạn', value: fit.breakdown.intent, weight: w.intent, tone: 'bg-neutral-solid' },
  ]

  return (
    <Card interactive className="relative flex h-full flex-col overflow-hidden p-5">
      <CornerMark corner="tl" className="absolute left-2.5 top-2.5 text-primary/35" />

      <div className="flex items-start justify-between gap-4 pl-3">
        <div className="min-w-0">
          {rank ? (
            <span className="mb-2 inline-block rounded bg-surface-sunken px-1.5 py-0.5 text-2xs font-semibold tabular-nums text-ink-muted">
              #{rank}
            </span>
          ) : null}
          <h3 className="truncate text-base font-semibold text-ink">{fit.career.name}</h3>
          <p className="mt-0.5 text-xs text-ink-muted">{CAREER_FIELD_LABEL[fit.career.field]}</p>
        </div>
        <ScoreCircle value={fit.overall} size="sm" />
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2 pl-3">
        <BandBadge band={bandOf(fit.overall)} />
        <Badge tone="neutral">Nên: {fit.recommendedAction}</Badge>
      </div>

      <p className="mt-3 line-clamp-2 flex-1 pl-3 text-sm leading-relaxed text-ink-soft">
        {fit.career.summary}
      </p>

      {/* Ba lớp */}
      <div className="mt-4 space-y-2.5 border-t border-line pt-4 pl-3">
        {layers.map((l) => (
          <div key={l.label}>
            <div className="mb-1 flex items-baseline justify-between gap-2">
              <span className="text-xs text-ink-soft">
                {l.label}
                <span className="ml-1 text-ink-faint">×{Math.round(l.weight * 100)}%</span>
              </span>
              <span className="text-xs font-semibold tabular-nums text-ink">{l.value}</span>
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-surface-sunken">
              <div className={`h-full rounded-full ${l.tone}`} style={{ width: `${l.value}%` }} />
            </div>
          </div>
        ))}
      </div>

      <Link to={`/candidate/careers/${fit.career.id}`} className="mt-4 link-cta pl-3">
        Xem chi tiết
        <ArrowRight className="h-4 w-4" />
      </Link>
    </Card>
  )
}
