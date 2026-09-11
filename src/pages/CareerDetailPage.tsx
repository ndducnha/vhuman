import { useMemo } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import {
  ArrowLeft,
  BadgeCheck,
  BookOpen,
  CheckCircle2,
  CircleDashed,
  Compass,
  TrendingUp,
  Users,
} from 'lucide-react'
import { Card, CardBody, CardHeader } from '@/components/ui/Card'
import { Badge, BandBadge } from '@/components/ui/Badge'
import { Button, ButtonLink } from '@/components/ui/Button'
import { ScoreCircle } from '@/components/ui/ScoreCircle'
import { TraitBar } from '@/components/ui/TraitBar'
import { SkillTag } from '@/components/ui/SkillTag'
import { EmptyState } from '@/components/ui/EmptyState'
import { TraitRadar } from '@/components/TraitRadar'
import { CAREER_BY_ID } from '@/data/careers'
import { skillName } from '@/data/skills'
import { matchingEngine } from '@/services/matching'
import { useDemoSession } from '@/hooks/demoSessionContext'
import { CAREER_FIELD_LABEL, TRAIT_LABEL, TRAIT_ORDER } from '@/utils/format'

export function CareerDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { candidate } = useDemoSession()
  const career = id ? CAREER_BY_ID[id] : undefined

  const recommendation = useMemo(() => {
    if (!candidate || !career) return null
    return (
      matchingEngine
        .recommendCareers(candidate, 100)
        .find((rec) => rec.career.id === career.id) ?? null
    )
  }, [candidate, career])

  if (!career) {
    return (
      <div className="container">
        <EmptyState
          icon={<Compass className="h-6 w-6" />}
          title="Không tìm thấy nhóm nghề"
          description="Nhóm nghề này không tồn tại trong dữ liệu demo."
          action={
            <ButtonLink to="/candidate/careers" variant="primary">
              Về danh sách nghề nghiệp
            </ButtonLink>
          }
        />
      </div>
    )
  }

  const owned = new Set(candidate?.skills.map((s) => s.skillId) ?? [])
  const allRelevant = [...career.coreSkills, ...career.bonusSkills]
  const matched = allRelevant.filter((skillId) => owned.has(skillId))
  const missing = allRelevant.filter((skillId) => !owned.has(skillId))

  return (
    <div className="container space-y-6">
      <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="-ml-2">
        <ArrowLeft className="h-4 w-4" />
        Quay lại
      </Button>

      {/* Header */}
      <Card className="p-6">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            <Badge tone="outline" className="mb-3">
              {CAREER_FIELD_LABEL[career.field]}
            </Badge>
            <h1 className="text-2xl font-bold text-ink sm:text-3xl">{career.name}</h1>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-ink-soft sm:text-base">
              {career.summary}
            </p>
          </div>

          {recommendation ? (
            <div className="flex shrink-0 flex-col items-center gap-3 rounded-xl border border-line bg-surface-muted p-5">
              <p className="text-xs font-medium text-ink-muted">Mức độ phù hợp</p>
              <ScoreCircle value={recommendation.overall} size="lg" />
              <BandBadge band={recommendation.band} />
            </div>
          ) : (
            <div className="shrink-0 rounded-xl border border-dashed border-line bg-surface-muted p-5 text-center">
              <p className="text-sm text-ink-muted">Tạo hồ sơ để xem mức độ phù hợp</p>
              <ButtonLink to="/candidate/onboarding" variant="primary" size="sm" className="mt-3">
                Tạo hồ sơ
              </ButtonLink>
            </div>
          )}
        </div>

        {recommendation ? (
          <div className="mt-6 grid gap-4 border-t border-line pt-6 sm:grid-cols-3">
            <TraitBar label="Kỹ năng" value={recommendation.breakdown.skills} />
            <TraitBar label="Hồ sơ cá nhân" value={recommendation.breakdown.profile} />
            <TraitBar label="Kinh nghiệm" value={recommendation.breakdown.experience} />
          </div>
        ) : null}
      </Card>

      <div className="grid gap-5 lg:grid-cols-[1.4fr_1fr]">
        <div className="space-y-5">
          {/* Why it fits */}
          {recommendation ? (
            <Card>
              <CardHeader
                icon={<BadgeCheck className="h-4 w-4" />}
                title="Vì sao nghề này phù hợp?"
                description="Dựa trên hồ sơ hiện tại của bạn."
              />
              <CardBody>
                <ul className="space-y-3">
                  {recommendation.reasons.map((reason) => (
                    <li key={reason} className="flex gap-3 text-sm leading-relaxed text-ink-soft">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-success-solid" />
                      {reason}
                    </li>
                  ))}
                </ul>
              </CardBody>
            </Card>
          ) : null}

          {/* Skills */}
          <Card>
            <CardHeader
              icon={<BookOpen className="h-4 w-4" />}
              title="Kỹ năng cho nhóm nghề này"
              description="Kỹ năng cốt lõi và bổ trợ thường được yêu cầu."
            />
            <CardBody className="space-y-5">
              {candidate ? (
                <>
                  <div>
                    <p className="mb-2.5 text-sm font-medium text-ink">
                      Kỹ năng đã có{' '}
                      <span className="font-normal text-ink-muted">({matched.length})</span>
                    </p>
                    {matched.length === 0 ? (
                      <p className="text-sm text-ink-muted">
                        Hồ sơ của bạn chưa có kỹ năng nào trong nhóm này.
                      </p>
                    ) : (
                      <div className="flex flex-wrap gap-2">
                        {matched.map((skillId) => (
                          <SkillTag key={skillId} name={skillName(skillId)} matched />
                        ))}
                      </div>
                    )}
                  </div>

                  <div>
                    <p className="mb-2.5 text-sm font-medium text-ink">
                      Kỹ năng nên bổ sung{' '}
                      <span className="font-normal text-ink-muted">({missing.length})</span>
                    </p>
                    {missing.length === 0 ? (
                      <p className="text-sm text-ink-muted">
                        Bạn đã có đủ các kỹ năng chính của nhóm nghề này.
                      </p>
                    ) : (
                      <div className="flex flex-wrap gap-2">
                        {missing.map((skillId) => (
                          <SkillTag key={skillId} name={skillName(skillId)} />
                        ))}
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <p className="mb-2.5 text-sm font-medium text-ink">Kỹ năng cốt lõi</p>
                    <div className="flex flex-wrap gap-2">
                      {career.coreSkills.map((skillId) => (
                        <SkillTag key={skillId} name={skillName(skillId)} />
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="mb-2.5 text-sm font-medium text-ink">Kỹ năng bổ trợ</p>
                    <div className="flex flex-wrap gap-2">
                      {career.bonusSkills.map((skillId) => (
                        <SkillTag key={skillId} name={skillName(skillId)} />
                      ))}
                    </div>
                  </div>
                </>
              )}
            </CardBody>
          </Card>

          {/* Roles */}
          <Card>
            <CardHeader icon={<Users className="h-4 w-4" />} title="Vị trí gợi ý" />
            <CardBody>
              <div className="grid gap-2 sm:grid-cols-2">
                {career.roles.map((role) => (
                  <div
                    key={role}
                    className="flex items-center gap-2.5 rounded-lg border border-line bg-surface-muted px-3.5 py-2.5 text-sm text-ink"
                  >
                    <CircleDashed className="h-3.5 w-3.5 shrink-0 text-ink-faint" />
                    {role}
                  </div>
                ))}
              </div>
            </CardBody>
          </Card>
        </div>

        <div className="space-y-5">
          {/* Trait profile of the career */}
          <Card>
            <CardHeader
              icon={<TrendingUp className="h-4 w-4" />}
              title="Đặc điểm nhóm nghề đề cao"
              description={candidate ? 'So sánh với hồ sơ của bạn.' : undefined}
            />
            <CardBody>
              <TraitRadar
                traits={career.traitProfile}
                compare={
                  candidate?.astrology
                    ? { label: 'Hồ sơ của bạn', traits: candidate.astrology.traits }
                    : undefined
                }
                height={280}
              />

              {candidate?.astrology ? (
                <div className="mt-4 flex flex-wrap items-center gap-4 border-t border-line pt-4 text-xs text-ink-muted">
                  <span className="flex items-center gap-1.5">
                    <span className="h-2 w-4 rounded-full bg-accent-600" /> Nhóm nghề
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="h-2 w-4 rounded-full bg-neutral-solid" /> Hồ sơ của bạn
                  </span>
                </div>
              ) : null}

              <div className="mt-5 space-y-2.5 border-t border-line pt-5">
                {TRAIT_ORDER.filter((trait) => career.traitProfile[trait] >= 75).map((trait) => (
                  <TraitBar
                    key={trait}
                    compact
                    tone="neutral"
                    label={TRAIT_LABEL[trait]}
                    value={career.traitProfile[trait]}
                  />
                ))}
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardHeader icon={<Compass className="h-4 w-4" />} title="Về môi trường làm việc" />
            <CardBody className="space-y-3 text-sm leading-relaxed text-ink-soft">
              <p>{career.environment}</p>
              <p className="rounded-lg bg-surface-muted p-3 text-xs text-ink-muted">
                {career.demandNote}
              </p>
            </CardBody>
          </Card>

          {recommendation ? (
            <Card className="p-5">
              <p className="text-sm font-semibold text-ink">So sánh với nhóm nghề khác</p>
              <p className="mt-1 text-sm text-ink-muted">
                Xem toàn bộ {Object.keys(CAREER_BY_ID).length} nhóm nghề được xếp hạng theo hồ sơ của bạn.
              </p>
              <Link
                to="/candidate/careers"
                className="mt-3 link-cta"
              >
                Xem tất cả
              </Link>
            </Card>
          ) : null}
        </div>
      </div>

      <p className="rounded-xl border border-line bg-card p-4 text-xs leading-relaxed text-ink-muted">
        Mức độ phù hợp là chỉ số tham khảo được tính từ kỹ năng, kinh nghiệm và hồ sơ cá nhân bạn cung
        cấp. Kết quả không phải là dự đoán về thành công nghề nghiệp và không nên là căn cứ duy nhất
        cho quyết định của bạn.
      </p>
    </div>
  )
}
