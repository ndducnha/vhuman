import { useEffect, useMemo, useState } from 'react'
import { CalendarRange, Check, GraduationCap, Route, Target } from 'lucide-react'
import { PageHeader } from '@/components/ui/PageHeader'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { ButtonLink } from '@/components/ui/Button'
import { EmptyState } from '@/components/ui/EmptyState'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { CornerMark, RuleMark } from '@/components/ui/Ornament'
import { matchingEngine } from '@/services/matching'
import { storageService } from '@/services/storage'
import { useDemoSession } from '@/hooks/demoSessionContext'
import { cn } from '@/utils/cn'
import type { Candidate, Milestone, MilestoneKind } from '@/types'

const KIND_META: Record<MilestoneKind, { label: string; icon: typeof Target }> = {
  skill: { label: 'Kỹ năng', icon: GraduationCap },
  cycle: { label: 'Vận trình', icon: CalendarRange },
  career: { label: 'Hướng nghề', icon: Target },
  application: { label: 'Ứng tuyển', icon: Route },
}

/**
 * Lộ trình 24 tháng.
 *
 * Gộp ba nguồn lại thành một dòng thời gian: kỹ năng còn thiếu của nhóm nghề
 * phù hợp nhất, gợi ý hành động từ đại vận và lưu niên, và bước ứng tuyển.
 * Trạng thái hoàn thành do người dùng tự đánh dấu, lưu trên trình duyệt.
 */
export function RoadmapPage() {
  const { candidate } = useDemoSession()
  const [milestones, setMilestones] = useState<Milestone[]>([])

  const generated = useMemo(() => (candidate ? buildMilestones(candidate) : []), [candidate])

  // Giữ lại trạng thái đã đánh dấu khi danh sách được dựng lại.
  useEffect(() => {
    const saved = storageService.loadMilestones()
    const doneIds = new Set(saved.filter((m) => m.done).map((m) => m.id))
    setMilestones(generated.map((m) => ({ ...m, done: doneIds.has(m.id) })))
  }, [generated])

  const toggle = (id: string) => {
    setMilestones((current) => {
      const next = current.map((m) => (m.id === id ? { ...m, done: !m.done } : m))
      storageService.saveMilestones(next)
      return next
    })
  }

  if (!candidate) {
    return (
      <div className="container">
        <EmptyState
          icon={<Route className="h-6 w-6" />}
          title="Chưa có hồ sơ nên chưa dựng được lộ trình"
          description="Lộ trình được dựng từ kỹ năng còn thiếu và vận trình của bạn."
          action={<ButtonLink to="/candidate/onboarding" variant="crimson">Tạo hồ sơ</ButtonLink>}
        />
      </div>
    )
  }

  const done = milestones.filter((m) => m.done).length
  const pct = milestones.length ? (done / milestones.length) * 100 : 0

  const groups: Array<{ title: string; range: string; items: Milestone[] }> = [
    { title: 'Ba tháng tới', range: '0 tới 3 tháng', items: milestones.filter((m) => m.monthOffset <= 3) },
    { title: 'Nửa năm tới', range: '3 tới 6 tháng', items: milestones.filter((m) => m.monthOffset > 3 && m.monthOffset <= 6) },
    { title: 'Trong năm nay', range: '6 tới 12 tháng', items: milestones.filter((m) => m.monthOffset > 6 && m.monthOffset <= 12) },
    { title: 'Xa hơn', range: '12 tới 24 tháng', items: milestones.filter((m) => m.monthOffset > 12) },
  ].filter((g) => g.items.length > 0)

  return (
    <div className="container space-y-6">
      <PageHeader
        eyebrow="Ứng viên"
        title="Lộ trình của bạn"
        description="Gộp kỹ năng còn thiếu và gợi ý theo vận trình thành một dòng thời gian 24 tháng."
      />

      <Card className="relative overflow-hidden p-5">
        <CornerMark corner="tl" className="absolute left-2.5 top-2.5 text-primary/35" />
        <div className="flex flex-col gap-4 pl-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-ink">
              Đã hoàn thành {done} trên {milestones.length} việc
            </p>
            <p className="mt-0.5 text-sm text-ink-muted">
              Tự đánh dấu khi xong. Trạng thái lưu trên trình duyệt của bạn.
            </p>
          </div>
          <div className="w-full sm:w-64">
            <ProgressBar value={pct} />
          </div>
        </div>
      </Card>

      {groups.map((group) => (
        <section key={group.title}>
          <div className="mb-4">
            <h2 className="display text-xl">{group.title}</h2>
            <RuleMark className="mt-2 text-primary" />
            <p className="mt-2 text-sm text-ink-muted">{group.range}</p>
          </div>

          <div className="space-y-3">
            {group.items.map((m) => {
              const meta = KIND_META[m.kind]
              return (
                <Card key={m.id} className={cn('p-4 transition-opacity', m.done && 'opacity-60')}>
                  <div className="flex items-start gap-3">
                    <button
                      type="button"
                      onClick={() => toggle(m.id)}
                      aria-pressed={m.done}
                      aria-label={m.done ? `Bỏ đánh dấu: ${m.title}` : `Đánh dấu đã xong: ${m.title}`}
                      className={cn(
                        'mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md border transition-colors',
                        m.done
                          ? 'border-success-solid bg-success-solid text-white'
                          : 'border-line-strong hover:border-primary',
                      )}
                    >
                      {m.done ? <Check className="h-3.5 w-3.5" /> : null}
                    </button>

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className={cn('text-sm font-semibold text-ink', m.done && 'line-through')}>
                          {m.title}
                        </p>
                        <Badge tone="neutral">
                          <meta.icon className="h-3 w-3" />
                          {meta.label}
                        </Badge>
                      </div>
                      <p className="mt-1 text-sm leading-relaxed text-ink-soft">{m.detail}</p>
                    </div>
                  </div>
                </Card>
              )
            })}
          </div>
        </section>
      ))}

      <p className="rounded-xl border border-line bg-card p-4 text-xs leading-relaxed text-ink-muted">
        Lộ trình này là gợi ý tham khảo, dựng từ hồ sơ và lá số của bạn. Mốc thời gian mang tính định
        hướng, không phải cam kết.
      </p>
    </div>
  )
}

/** Dựng các mốc từ nhóm nghề phù hợp nhất và từ vận trình. */
function buildMilestones(candidate: Candidate): Milestone[] {
  const out: Milestone[] = []
  const [top, second] = matchingEngine.recommendCareers(candidate, 2)

  if (top) {
    out.push({
      id: 'career-top',
      kind: 'career',
      title: `Tìm hiểu sâu nhóm nghề ${top.career.name}`,
      detail: `Đây là nhóm nghề hợp với bạn nhất, ở mức ${top.overall}%. Đọc kỹ yêu cầu và vị trí gợi ý của nhóm này.`,
      monthOffset: 1,
      done: false,
    })
    top.missingSkills.slice(0, 4).forEach((skill, index) => {
      out.push({
        id: `skill-top-${index}`,
        kind: 'skill',
        title: `Bổ sung kỹ năng ${skill}`,
        detail: `${skill} nằm trong nhóm kỹ năng mà ${top.career.name} thường yêu cầu, hồ sơ của bạn chưa có.`,
        monthOffset: 3 + index * 2,
        done: false,
      })
    })
  }

  if (second) {
    out.push({
      id: 'career-second',
      kind: 'career',
      title: `Cân nhắc hướng thứ hai: ${second.career.name}`,
      detail: `Mức phù hợp ${second.overall}%. Giữ đây làm phương án nếu hướng chính không thuận.`,
      monthOffset: 6,
      done: false,
    })
  }

  out.push({
    id: 'application-first',
    kind: 'application',
    title: 'Ứng tuyển ít nhất ba vị trí phù hợp',
    detail: 'Nộp hồ sơ cho các tin có mức phù hợp từ 70% trở lên để thử phản hồi thị trường.',
    monthOffset: 2,
    done: false,
  })

  const cycles = candidate.astrology?.cycles
  if (cycles) {
    cycles.year.actions.forEach((action, index) => {
      out.push({
        id: `cycle-year-${index}`,
        kind: 'cycle',
        title: action,
        detail: `Gợi ý theo ${cycles.year.name}${cycles.year.canChi ? `, năm ${cycles.year.canChi}` : ''}. ${cycles.year.advice}`,
        monthOffset: 4 + index * 3,
        done: false,
      })
    })
    cycles.major.actions.forEach((action, index) => {
      out.push({
        id: `cycle-major-${index}`,
        kind: 'cycle',
        title: action,
        detail: `Gợi ý theo ${cycles.major.name}. ${cycles.major.advice}`,
        monthOffset: 14 + index * 5,
        done: false,
      })
    })
  }

  return out.sort((a, b) => a.monthOffset - b.monthOffset)
}
