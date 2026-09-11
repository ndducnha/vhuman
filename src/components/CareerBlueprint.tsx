import { AlertTriangle, CalendarRange, Compass, Info, Sparkles, Star } from 'lucide-react'
import { Card, CardBody, CardHeader } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { SkillTag } from '@/components/ui/SkillTag'
import { CornerMark } from '@/components/ui/Ornament'
import {
  BRIGHTNESS_LABEL, CAREER_MODES, CONFIDENCE_LABEL,
  FAMILY_BY_ID, PALACE_BY_ID, STAR_BY_ID, TRANSFORMS, TRAIT_LABEL_VI,
} from '@/data/tuvi'
import { TRAIT_KEYS } from '@/services/matching'
import { cn } from '@/utils/cn'
import type { TuViCareerProfile } from '@/types/tuvi'

/**
 * Career Blueprint.
 *
 * Trình bày theo tỉ lệ chứ không gán nhãn: nói "Sát Phá Tham 52%" thay vì "bạn
 * thuộc Sát Phá Tham". Lá số hiếm khi thuần một nhóm, và cách nói tuyệt đối dễ
 * khiến người đọc tin đây là kết luận chắc chắn.
 */
export function CareerBlueprint({ profile }: { profile: TuViCareerProfile }) {
  const dominant = FAMILY_BY_ID[profile.dominantFamily]
  const secondary = FAMILY_BY_ID[profile.secondaryFamily]
  const mode = CAREER_MODES[profile.cycle.mode]

  return (
    <div className="space-y-5">
      {/* Phân bố bốn nhóm */}
      <Card className="relative overflow-hidden border-primary/30">
        <CornerMark corner="tl" className="absolute left-3 top-3 text-primary/45" />
        <CornerMark corner="br" className="absolute bottom-3 right-3 text-primary/45" />
        <CardHeader
          icon={<Compass className="h-4 w-4" />}
          title="Career Blueprint"
          description="Phân bố thiên hướng nghề nghiệp theo bốn nhóm chính tinh."
          action={
            <Badge tone={profile.confidence === 'high' ? 'success' : profile.confidence === 'medium' ? 'accent' : 'warn'}>
              Độ tin cậy: {CONFIDENCE_LABEL[profile.confidence]}
            </Badge>
          }
        />
        <CardBody className="space-y-5">
          <div className="space-y-3">
            {profile.families.map((f, index) => {
              const fam = FAMILY_BY_ID[f.family]
              return (
                <div key={f.family}>
                  <div className="mb-1.5 flex items-baseline justify-between gap-3">
                    <span className={cn('text-sm', index === 0 ? 'font-semibold text-ink' : 'text-ink-soft')}>
                      {fam.name}
                      <span className="ml-2 text-xs text-ink-muted">{fam.archetype}</span>
                    </span>
                    <span className="text-sm font-semibold tabular-nums text-ink">{f.percent}%</span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-surface-sunken">
                    <div
                      className={cn('h-full rounded-full transition-[width] duration-700',
                        index === 0 ? 'bg-primary' : index === 1 ? 'bg-accent-500' : 'bg-neutral-solid')}
                      style={{ width: `${f.percent}%` }}
                    />
                  </div>
                </div>
              )
            })}
          </div>

          <div className="grid gap-4 border-t border-line pt-5 sm:grid-cols-2">
            <div>
              <p className="eyebrow mb-1.5">Thiên hướng chính</p>
              <p className="font-display text-xl font-extrabold uppercase text-crimson">{dominant.archetype}</p>
              <p className="mt-2 text-sm leading-relaxed text-ink-soft">{dominant.description}</p>
            </div>
            <div>
              <p className="eyebrow mb-1.5">Thiên hướng phụ</p>
              <p className="text-lg font-semibold text-ink">{secondary.archetype}</p>
              <p className="mt-2 text-sm leading-relaxed text-ink-soft">{secondary.description}</p>
            </div>
          </div>

          {profile.hybrid ? (
            <div className="rounded-lg border border-primary/30 bg-accent-50/50 p-4">
              <p className="eyebrow mb-1.5">Tổ hợp</p>
              <p className="text-base font-semibold text-ink">
                {profile.hybrid.name}: {profile.hybrid.archetype}
              </p>
              <p className="mt-1.5 text-sm leading-relaxed text-ink-soft">{profile.hybrid.direction}</p>
            </div>
          ) : null}

          <p className="flex gap-2.5 rounded-lg bg-surface-sunken p-3 text-xs leading-relaxed text-ink-muted">
            <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" />
            Các tỉ lệ là điểm heuristic nội bộ của VHuman, không phải xác suất khoa học.
          </p>
        </CardBody>
      </Card>

      {/* Sao nổi bật */}
      <Card>
        <CardHeader
          icon={<Star className="h-4 w-4" />}
          title="Chính tinh nổi bật"
          description="Sao nào đóng ở cung nào, và trạng thái biểu hiện."
        />
        <CardBody className="space-y-3">
          {profile.dominantStars.map((p) => {
            const star = STAR_BY_ID[p.star]
            const palace = PALACE_BY_ID[p.palace]
            const tf = p.transform ? TRANSFORMS.find((t) => t.id === p.transform) : undefined
            return (
              <div key={`${p.star}-${p.palace}`} className="rounded-lg border border-line p-3.5">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-sm font-semibold text-ink">{star.name}</span>
                  <Badge tone="neutral">{palace.name}</Badge>
                  <Badge tone={p.brightness === 'ham' ? 'warn' : 'accent'}>
                    {BRIGHTNESS_LABEL[p.brightness]}
                  </Badge>
                  {tf ? <Badge tone="success">{tf.name}</Badge> : null}
                </div>
                <p className="mt-1.5 text-sm leading-relaxed text-ink-soft">{star.summary}</p>
                <p className="mt-1 text-xs text-ink-muted">{palace.meaning}</p>
                {tf ? <p className="mt-1 text-xs text-ink-muted">{tf.effect}</p> : null}
              </div>
            )
          })}
          <p className="text-xs leading-relaxed text-ink-muted">
            Miếu, Vượng, Đắc, Hãm không phải tốt xấu. Đây là độ rõ khi đặc tính biểu hiện ra ngoài và
            mức ma sát có thể gặp.
          </p>
        </CardBody>
      </Card>

      {/* Vector đặc tính */}
      <Card>
        <CardHeader
          icon={<Sparkles className="h-4 w-4" />}
          title="Đặc tính nghề nghiệp"
          description="Mười sáu chiều dùng để khớp với yêu cầu của từng nhóm nghề."
        />
        <CardBody>
          <div className="grid gap-x-8 gap-y-3 sm:grid-cols-2">
            {[...TRAIT_KEYS]
              .sort((a, b) => profile.traits[b] - profile.traits[a])
              .map((key) => {
                const pct = Math.round(profile.traits[key] * 100)
                return (
                  <div key={key}>
                    <div className="mb-1 flex items-baseline justify-between gap-3">
                      <span className="text-sm text-ink-soft">{TRAIT_LABEL_VI[key] ?? key}</span>
                      <span className="text-sm font-semibold tabular-nums text-ink">{pct}</span>
                    </div>
                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-surface-sunken">
                      <div className="h-full rounded-full bg-primary" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                )
              })}
          </div>
        </CardBody>
      </Card>

      {/* Chế độ vận */}
      <Card className="border-primary/30">
        <CardHeader
          icon={<CalendarRange className="h-4 w-4" />}
          title={`Chế độ hiện tại: ${mode.label}`}
          description={`${profile.cycle.majorLabel} · ${profile.cycle.yearLabel}, năm ${profile.cycle.canChi}`}
          action={<Badge tone="neutral">Tin cậy: {CONFIDENCE_LABEL[profile.cycle.confidence]}</Badge>}
        />
        <CardBody className="space-y-4">
          <p className="text-sm leading-relaxed text-ink-soft">{mode.summary}</p>
          <div>
            <p className="mb-2 text-xs font-medium text-ink-muted">Nên ưu tiên lúc này</p>
            <ul className="space-y-2">
              {profile.cycle.actions.map((a) => (
                <li key={a} className="flex gap-2.5 text-sm text-ink-soft">
                  <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-primary" />
                  {a}
                </li>
              ))}
            </ul>
          </div>
          <p className="text-xs leading-relaxed text-ink-muted">
            Chế độ vận không dùng để dự đoán sự kiện. Nó chỉ phân loại xem giai đoạn này nên ưu tiên
            kiểu việc nào.
          </p>
        </CardBody>
      </Card>

      {/* Giải thích và lưu ý */}
      <div className="grid gap-5 lg:grid-cols-2">
        <Card>
          <CardHeader title="Vì sao ra kết quả này" />
          <CardBody>
            <ul className="space-y-2.5">
              {profile.explanations.map((e) => (
                <li key={e} className="flex gap-2.5 text-sm leading-relaxed text-ink-soft">
                  <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-primary" />
                  {e}
                </li>
              ))}
            </ul>
          </CardBody>
        </Card>

        <Card className="border-warning-border bg-warning-subtle/30">
          <CardHeader icon={<AlertTriangle className="h-4 w-4" />} title="Điểm cần lưu ý" />
          <CardBody>
            <ul className="space-y-2.5">
              {profile.cautions.map((c) => (
                <li key={c} className="flex gap-2.5 text-sm leading-relaxed text-ink-soft">
                  <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-warning-solid" />
                  {c}
                </li>
              ))}
            </ul>
          </CardBody>
        </Card>
      </div>

      <div className="rounded-xl border border-line bg-card p-4">
        <p className="text-xs leading-relaxed text-ink-muted">
          Lớp Tử Vi trong VHuman là khung tham chiếu văn hoá và tự phản chiếu, không phải phương pháp
          khoa học đã được chứng minh. Nó không dùng để tự động loại ứng viên, không hiển thị cho nhà
          tuyển dụng, và không dự đoán chắc chắn tương lai. Mọi gợi ý nghề nghiệp đều đặt cạnh kỹ
          năng, kinh nghiệm và mong muốn thật của bạn trước khi đưa ra.
        </p>
      </div>
    </div>
  )
}

/** Danh sách kỹ năng nên làm nổi bật, lấy theo nhóm thiên hướng. */
export function BlueprintSkillHighlights({ profile }: { profile: TuViCareerProfile }) {
  const fam = FAMILY_BY_ID[profile.dominantFamily]
  return (
    <div className="flex flex-wrap gap-1.5">
      {fam.coreTraits.map((t) => (
        <SkillTag key={t} name={TRAIT_LABEL_VI[t] ?? t} />
      ))}
    </div>
  )
}
