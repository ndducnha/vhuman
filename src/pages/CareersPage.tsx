import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Search, Target } from 'lucide-react'
import { PageHeader } from '@/components/ui/PageHeader'
import { Card } from '@/components/ui/Card'
import { TextInput } from '@/components/ui/Field'
import { Badge, BandBadge } from '@/components/ui/Badge'
import { ButtonLink } from '@/components/ui/Button'
import { ScoreCircle } from '@/components/ui/ScoreCircle'
import { CAREERS } from '@/data/careers'
import { normalize } from '@/data/skills'
import { CAREER_FIELD_LABEL, CAREER_FIELD_ORDER } from '@/utils/format'
import { bandOf } from '@/utils/score'
import { matchingEngine } from '@/services/matching'
import { useDemoSession } from '@/hooks/demoSessionContext'
import { cn } from '@/utils/cn'
import type { CareerField } from '@/types'

export function CareersPage() {
  const { candidate } = useDemoSession()
  const [query, setQuery] = useState('')
  const [group, setGroup] = useState<CareerField | 'all'>('all')

  // When a profile exists, every career gets a personal fit score and the list
  // is ranked; otherwise it's a plain browsable catalogue.
  const scored = useMemo(() => {
    if (!candidate) {
      return CAREERS.map((career) => ({ career, score: null as number | null }))
    }
    return matchingEngine
      .recommendCareers(candidate, CAREERS.length)
      .map((rec) => ({ career: rec.career, score: rec.overall }))
  }, [candidate])

  const visible = useMemo(() => {
    const q = normalize(query)
    return scored.filter(({ career }) => {
      if (group !== 'all' && career.field !== group) return false
      if (!q) return true
      const haystack = normalize(
        [career.name, career.summary, ...career.roles].join(' '),
      )
      return haystack.includes(q)
    })
  }, [scored, query, group])

  return (
    <div className="container space-y-6">
      <PageHeader
        eyebrow="Khám phá nghề nghiệp"
        title={candidate ? 'Nghề nghiệp phù hợp với bạn' : 'Thư viện nhóm nghề'}
        description={
          candidate
            ? `${CAREERS.length} nhóm nghề, xếp hạng theo mức độ phù hợp với hồ sơ của bạn.`
            : `${CAREERS.length} nhóm nghề được chuẩn hoá theo kỹ năng cốt lõi và đặc điểm môi trường làm việc.`
        }
        action={
          !candidate ? (
            <ButtonLink to="/candidate/onboarding" variant="primary">
              Tạo hồ sơ để xem mức độ phù hợp
              <ArrowRight className="h-4 w-4" />
            </ButtonLink>
          ) : null
        }
      />

      <Card className="p-4">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-faint" />
          <TextInput
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Tìm nhóm nghề hoặc vị trí..."
            className="pl-9"
            aria-label="Tìm nhóm nghề"
          />
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          <GroupChip label="Tất cả" active={group === 'all'} onClick={() => setGroup('all')} />
          {CAREER_FIELD_ORDER.map((item) => (
            <GroupChip
              key={item}
              label={CAREER_FIELD_LABEL[item]}
              active={group === item}
              onClick={() => setGroup(item)}
            />
          ))}
        </div>
      </Card>

      <p className="text-sm text-ink-muted">
        <span className="font-semibold text-ink">{visible.length}</span> nhóm nghề
      </p>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {visible.map(({ career, score }) => (
          <Link key={career.id} to={`/candidate/careers/${career.id}`} className="block">
            <Card interactive className="flex h-full flex-col p-5">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <h3 className="truncate text-base font-semibold text-ink">{career.name}</h3>
                  <p className="mt-0.5 text-xs text-ink-muted">{CAREER_FIELD_LABEL[career.field]}</p>
                </div>
                {score !== null ? <ScoreCircle value={score} size="sm" /> : null}
              </div>

              {score !== null ? (
                <div className="mt-3">
                  <BandBadge band={bandOf(score)} />
                </div>
              ) : null}

              <p className="mt-3 line-clamp-3 flex-1 text-sm leading-relaxed text-ink-soft">
                {career.summary}
              </p>

              <div className="mt-4 flex flex-wrap gap-1.5 border-t border-line pt-4">
                {career.roles.slice(0, 3).map((role) => (
                  <Badge key={role} tone="neutral">
                    {role}
                  </Badge>
                ))}
              </div>
            </Card>
          </Link>
        ))}
      </div>

      {visible.length === 0 ? (
        <Card className="flex flex-col items-center gap-3 p-12 text-center">
          <Target className="h-6 w-6 text-ink-faint" />
          <p className="text-sm text-ink-muted">Không tìm thấy nhóm nghề phù hợp với bộ lọc hiện tại.</p>
        </Card>
      ) : null}
    </div>
  )
}

function GroupChip({
  label,
  active,
  onClick,
}: {
  label: string
  active: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'rounded-full border px-3 py-1.5 text-xs font-medium transition-colors',
        active
          ? 'border-primary bg-primary text-on-primary'
          : 'border-line bg-card text-ink-soft hover:bg-surface-muted',
      )}
    >
      {label}
    </button>
  )
}
