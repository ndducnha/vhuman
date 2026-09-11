import { CalendarRange, Compass, Sparkles, Target } from 'lucide-react'
import { Card, CardBody, CardHeader } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { SkillTag } from '@/components/ui/SkillTag'
import { CornerMark } from '@/components/ui/Ornament'
import { TraitRadar } from '@/components/TraitRadar'
import { CAREER_FIELD_LABEL } from '@/utils/format'
import type { AstrologyProfile } from '@/types'

/**
 * chế độ Vận trình: the Tử Vi archetype and destiny cycles.
 *
 * Everything here is framed as tendency and option, never prediction. The
 * disclaimer at the bottom is part of the component, not an optional extra,
 * so this panel can never ship without it.
 */
export function PersonalBlueprint({ profile }: { profile: AstrologyProfile }) {
  const { starGroup, cycles } = profile

  return (
    <div className="space-y-5">
      <Card className="relative overflow-hidden border-primary/30">
        <CornerMark corner="tl" className="absolute left-3 top-3 text-primary/45" />
        <CornerMark corner="br" className="absolute bottom-3 right-3 text-primary/45" />

        <CardHeader
          icon={<Sparkles className="h-4 w-4" />}
          title="Lá số của bạn"
          description="Nhóm sao chủ đạo và xu hướng phong cách làm việc."
          action={
            <Badge tone="neutral" className="font-mono text-2xs">
              {profile.signature}
            </Badge>
          }
        />

        <CardBody>
          <div className="grid gap-6 lg:grid-cols-[1.15fr_1fr]">
            <div>
              <p className="eyebrow mb-2">Nhóm sao</p>
              <h3 className="font-display text-2xl font-extrabold uppercase text-crimson">
                {starGroup.name}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-ink-soft">{starGroup.description}</p>

              <div className="mt-5 space-y-4 border-t border-line pt-5">
                <BlueprintRow
                  icon={<Target className="h-3.5 w-3.5" />}
                  label="Thiên hướng nghề nghiệp"
                  items={starGroup.careerArchetypes}
                />
                <BlueprintRow
                  icon={<Sparkles className="h-3.5 w-3.5" />}
                  label="Kỹ năng nên làm nổi bật"
                  items={starGroup.skillsToHighlight}
                />
                <BlueprintRow
                  icon={<Compass className="h-3.5 w-3.5" />}
                  label="Vị trí có thể tham khảo"
                  items={starGroup.suggestedRoles}
                />
              </div>

              <div className="mt-5 border-t border-line pt-5">
                <p className="mb-2 text-xs font-medium text-ink-muted">Lĩnh vực có xu hướng gần</p>
                <div className="flex flex-wrap gap-1.5">
                  {starGroup.affinityFields.map((field) => (
                    <Badge key={field} tone="accent">
                      {CAREER_FIELD_LABEL[field]}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-center">
              <TraitRadar traits={profile.traits} height={300} label="Bản đồ cá nhân" />
            </div>
          </div>
        </CardBody>
      </Card>

      <div className="grid gap-5 lg:grid-cols-2">
        <CycleCard cycle={cycles.major} />
        <CycleCard cycle={cycles.year} />
      </div>

      <p className="rounded-xl border border-line bg-card p-4 text-xs leading-relaxed text-ink-muted">
        Các luận giải ở đây mang tính tham khảo về phong cách làm việc. Đây không phải dự báo chắc
        chắn, và không có giá trị khẳng định khoa học. Thông tin ngày giờ sinh chỉ dùng để dựng hồ sơ
        riêng tư này. Dữ liệu lưu trên trình duyệt của bạn, không hiển thị cho nhà tuyển dụng.
      </p>
    </div>
  )
}

function CycleCard({ cycle }: { cycle: AstrologyProfile['cycles']['major'] }) {
  return (
    <Card ornament className="relative overflow-hidden">
      <CardHeader
        icon={<CalendarRange className="h-4 w-4" />}
        title={cycle.name}
        description={cycle.kind === 'dai_van' ? 'Chu kỳ lớn đang diễn ra' : 'Năm đang xét'}
        action={cycle.canChi ? <Badge tone="warn">{cycle.canChi}</Badge> : null}
      />
      <CardBody className="space-y-3">
        <p className="text-sm leading-relaxed text-ink-soft">{cycle.description}</p>
        <p className="rounded-lg border border-line bg-surface-sunken p-3 text-sm leading-relaxed text-ink-soft">
          {cycle.advice}
        </p>
        <div>
          <p className="mb-2 text-xs font-medium text-ink-muted">Gợi ý hành động</p>
          <ul className="space-y-2">
            {cycle.actions.map((action) => (
              <li key={action} className="flex gap-2.5 text-sm text-ink-soft">
                <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-primary" />
                {action}
              </li>
            ))}
          </ul>
        </div>
      </CardBody>
    </Card>
  )
}

function BlueprintRow({
  icon,
  label,
  items,
}: {
  icon: React.ReactNode
  label: string
  items: string[]
}) {
  return (
    <div>
      <p className="mb-2 flex items-center gap-1.5 text-xs font-medium text-ink-muted">
        <span className="text-primary">{icon}</span>
        {label}
      </p>
      <div className="flex flex-wrap gap-1.5">
        {items.map((item) => (
          <SkillTag key={item} name={item} />
        ))}
      </div>
    </div>
  )
}
