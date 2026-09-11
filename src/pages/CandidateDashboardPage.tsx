import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  ArrowRight,
  Briefcase,
  GraduationCap,
  Download,
  Info,
  Route,
  ScrollText,
  Lightbulb,
  MapPin,
  Sparkles,
  Target,
  TrendingUp,
  UserRound,
} from 'lucide-react'
import { Card, CardBody, CardHeader } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Avatar } from '@/components/ui/Avatar'
import { Button, ButtonLink } from '@/components/ui/Button'
import { EmptyState } from '@/components/ui/EmptyState'
import { SkillTag } from '@/components/ui/SkillTag'
import { ProfileCard } from '@/components/ProfileCard'
import { PersonalBlueprint } from '@/components/PersonalBlueprint'
import { buildProfileExport, downloadProfileExport } from '@/utils/exportProfile'
import { CareerCard } from '@/components/CareerCard'
import { ResetDemoButton } from '@/components/ResetDemoButton'
import { useDemoSession } from '@/hooks/demoSessionContext'
import { matchingEngine } from '@/services/matching'
import { formatPeriod, formatYears } from '@/utils/format'

export function CandidateDashboardPage() {
  const { candidate, isSampleProfile, startBlankProfile } = useDemoSession()
  const navigate = useNavigate()

  const [mode, setMode] = useState<'evidence' | 'destiny'>('evidence')

  const recommendations = useMemo(
    () => (candidate ? matchingEngine.recommendCareers(candidate, 5) : []),
    [candidate],
  )

  if (!candidate) {
    return (
      <div className="container">
        <EmptyState
          icon={<UserRound className="h-6 w-6" />}
          title="Bạn chưa có hồ sơ"
          description="Tạo hồ sơ để nhận Hồ sơ cá nhân và gợi ý các hướng nghề nghiệp phù hợp."
          action={
            <ButtonLink to="/candidate/onboarding" variant="primary">
              Tạo hồ sơ của tôi
              <ArrowRight className="h-4 w-4" />
            </ButtonLink>
          }
        />
      </div>
    )
  }

  const profile = candidate.astrology

  return (
    <div className="container space-y-6">
      {/* Header */}
      <Card className="p-6">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <Avatar name={candidate.personal.fullName} src={candidate.personal.avatar} size="xl" />
            <div className="min-w-0">
              <p className="text-sm text-ink-muted">Xin chào,</p>
              <h1 className="truncate text-2xl font-bold text-ink sm:text-3xl">
                {candidate.personal.fullName}
              </h1>
              <p className="mt-1 text-sm text-ink-soft">
                Đây là hồ sơ định hướng nghề nghiệp của bạn.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <ButtonLink to="/candidate/lo-trinh" variant="primary" size="sm">
              <Route className="h-4 w-4" />
              Lộ trình của tôi
            </ButtonLink>
            <ButtonLink to="/viec-lam" variant="secondary" size="sm">
              <Briefcase className="h-4 w-4" />
              Việc làm phù hợp
            </ButtonLink>
            <ButtonLink to="/candidate/careers" variant="secondary" size="sm">
              <Target className="h-4 w-4" />
              Nghề nghiệp
            </ButtonLink>
            <ButtonLink to="/candidate/onboarding" variant="secondary" size="sm">
              Chỉnh sửa hồ sơ
            </ButtonLink>
          </div>
        </div>

        <div className="mt-5 flex flex-wrap items-center gap-2 border-t border-line pt-5">
          {isSampleProfile ? <Badge tone="warn">Hồ sơ mẫu</Badge> : null}
          <Badge tone="primary">{candidate.headline}</Badge>
          {candidate.personal.currentCity ? (
            <Badge tone="outline">
              <MapPin className="h-3 w-3" />
              {candidate.personal.currentCity}
            </Badge>
          ) : null}
          <Badge tone="outline">
            <Briefcase className="h-3 w-3" />
            {formatYears(candidate.yearsOfExperience)}
          </Badge>
          <Badge tone="outline">{candidate.skills.length} kỹ năng</Badge>
        </div>
      </Card>

      {/* Evidence ⇄ Destiny */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div
          className="flex w-full gap-1 rounded-pill border border-line bg-card p-1 sm:w-auto"
          role="tablist"
          aria-label="Chế độ xem hồ sơ"
        >
          <ModeTab
            active={mode === 'evidence'}
            onClick={() => setMode('evidence')}
            icon={<ScrollText className="h-4 w-4" />}
            label="Bằng chứng"
            hint="Bằng chứng: CV, kỹ năng, kinh nghiệm"
          />
          <ModeTab
            active={mode === 'destiny'}
            onClick={() => setMode('destiny')}
            icon={<Sparkles className="h-4 w-4" />}
            label="Tử Vi"
            hint="Lá số: nhóm sao, đại vận, lưu niên. Chỉ hiển thị cho bạn"
          />
        </div>

        <Button
          variant="secondary"
          size="sm"
          onClick={() => downloadProfileExport(buildProfileExport(candidate, recommendations))}
        >
          <Download className="h-4 w-4" />
          Xuất hồ sơ
        </Button>
      </div>

      {isSampleProfile ? (
        <Card className="flex flex-col gap-4 border-warning-border bg-warning-subtle/50 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex gap-3">
            <Info className="mt-0.5 h-4 w-4 shrink-0 text-warning-fg" />
            <div>
              <p className="text-sm font-semibold text-ink">Bạn đang xem hồ sơ mẫu</p>
              <p className="mt-0.5 text-sm text-ink-soft">
                Dữ liệu này được nạp sẵn để bạn xem ngay kết quả. Tạo hồ sơ của riêng bạn để nhận
                Hồ sơ cá nhân và gợi ý nghề nghiệp dựa trên thông tin thật.
              </p>
            </div>
          </div>
          <Button
            variant="primary"
            size="sm"
            className="shrink-0"
            onClick={() => {
              startBlankProfile()
              navigate('/candidate/onboarding')
            }}
          >
            Tạo hồ sơ của tôi
            <ArrowRight className="h-4 w-4" />
          </Button>
        </Card>
      ) : null}

      {mode === 'destiny' && profile ? <PersonalBlueprint profile={profile} /> : null}

      {/* Personal profile */}
      {mode === 'evidence' && profile ? <ProfileCard profile={profile} /> : null}

      {/* Strengths & style */}
      {mode === 'evidence' && profile ? (
        <div className="grid gap-5 lg:grid-cols-3">
          <InsightCard
            icon={<Sparkles className="h-4 w-4" />}
            title="Đặc điểm nổi bật"
            items={profile.personality}
          />
          <InsightCard
            icon={<Briefcase className="h-4 w-4" />}
            title="Phong cách làm việc"
            items={profile.workingStyle}
          />
          <InsightCard
            icon={<TrendingUp className="h-4 w-4" />}
            title="Điểm mạnh"
            items={profile.strengths}
          />
        </div>
      ) : null}

      {/* Career recommendations */}
      {mode === 'evidence' ? (
      <div>
        <div className="mb-4 flex items-end justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-ink">Những hướng nghề nghiệp phù hợp với bạn</h2>
            <p className="mt-1 text-sm text-ink-muted">
              Xếp hạng theo mức độ phù hợp tổng thể giữa kỹ năng, kinh nghiệm và hồ sơ cá nhân.
            </p>
          </div>
          <Link
            to="/candidate/careers"
            className="hidden shrink-0 items-center gap-1.5 text-sm font-medium text-accent-700 hover:text-accent-800 sm:inline-flex"
          >
            Xem tất cả
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {recommendations.map((recommendation, index) => (
            <CareerCard
              key={recommendation.career.id}
              recommendation={recommendation}
              rank={index + 1}
            />
          ))}
        </div>
      </div>
      ) : null}

      {/* Growth + environment */}
      {mode === 'evidence' && profile ? (
        <div className="grid gap-5 lg:grid-cols-2">
          <Card>
            <CardHeader
              icon={<Lightbulb className="h-4 w-4" />}
              title="Hướng phát triển gợi ý"
              description="Những điểm bạn có thể cân nhắc rèn luyện thêm."
            />
            <CardBody>
              <ul className="space-y-3">
                {profile.growthAreas.map((item) => (
                  <li key={item} className="flex gap-2.5 text-sm leading-relaxed text-ink-soft">
                    <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-warning-solid" />
                    {item}
                  </li>
                ))}
              </ul>
            </CardBody>
          </Card>

          <Card>
            <CardHeader
              icon={<MapPin className="h-4 w-4" />}
              title="Môi trường có xu hướng phù hợp"
              description="Dựa trên hồ sơ cá nhân của bạn."
            />
            <CardBody>
              <ul className="space-y-3">
                {profile.preferredEnvironments.map((item) => (
                  <li key={item} className="flex gap-2.5 text-sm leading-relaxed text-ink-soft">
                    <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-accent-500" />
                    {item}
                  </li>
                ))}
              </ul>
            </CardBody>
          </Card>
        </div>
      ) : null}

      {/* CV summary */}
      {mode === 'evidence' ? (
      <div className="grid gap-5 lg:grid-cols-2">
        <Card>
          <CardHeader icon={<Briefcase className="h-4 w-4" />} title="Kinh nghiệm" />
          <CardBody>
            {candidate.experience.length === 0 ? (
              <p className="text-sm text-ink-muted">Chưa có thông tin kinh nghiệm.</p>
            ) : (
              <ul className="space-y-4">
                {candidate.experience.map((item) => (
                  <li key={item.id} className="border-l-2 border-line pl-4">
                    <p className="text-sm font-semibold text-ink">{item.title || 'Vị trí'}</p>
                    <p className="text-sm text-ink-soft">{item.company}</p>
                    <p className="mt-0.5 text-xs text-ink-muted">
                      {formatPeriod(item.startDate, item.endDate, item.current)}
                    </p>
                    {item.description ? (
                      <p className="mt-1.5 text-sm leading-relaxed text-ink-soft">{item.description}</p>
                    ) : null}
                  </li>
                ))}
              </ul>
            )}
          </CardBody>
        </Card>

        <div className="space-y-5">
          <Card>
            <CardHeader icon={<GraduationCap className="h-4 w-4" />} title="Học vấn" />
            <CardBody>
              {candidate.education.length === 0 ? (
                <p className="text-sm text-ink-muted">Chưa có thông tin học vấn.</p>
              ) : (
                <ul className="space-y-3">
                  {candidate.education.map((item) => (
                    <li key={item.id}>
                      <p className="text-sm font-semibold text-ink">{item.school}</p>
                      <p className="text-sm text-ink-soft">
                        {item.degree}
                        {item.major ? ` · ${item.major}` : ''}
                      </p>
                      <p className="mt-0.5 text-xs text-ink-muted">
                        {item.startYear} - {item.endYear}
                      </p>
                    </li>
                  ))}
                </ul>
              )}
            </CardBody>
          </Card>

          <Card>
            <CardHeader icon={<Sparkles className="h-4 w-4" />} title="Kỹ năng" />
            <CardBody>
              {candidate.skills.length === 0 ? (
                <p className="text-sm text-ink-muted">Chưa chọn kỹ năng nào.</p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {candidate.skills.map((skill) => (
                    <SkillTag key={skill.skillId} name={skill.name} level={skill.level} />
                  ))}
                </div>
              )}
            </CardBody>
          </Card>
        </div>
      </div>

      ) : null}

      <Card className="flex flex-col items-start justify-between gap-4 p-5 sm:flex-row sm:items-center">
        <div>
          <p className="text-sm font-semibold text-ink">Muốn thử ở vai trò nhà tuyển dụng?</p>
          <p className="mt-0.5 text-sm text-ink-muted">
            Hồ sơ của bạn cũng xuất hiện trong kết quả tìm kiếm của nhà tuyển dụng.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <ButtonLink to="/recruiter/search" variant="secondary" size="sm">
            Mở chế độ nhà tuyển dụng
          </ButtonLink>
          <ResetDemoButton variant="ghost" />
        </div>
      </Card>
    </div>
  )
}

function ModeTab({
  active,
  onClick,
  icon,
  label,
  hint,
}: {
  active: boolean
  onClick: () => void
  icon: React.ReactNode
  label: string
  hint: string
}) {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={active}
      title={hint}
      onClick={onClick}
      className={
        active
          ? 'flex min-h-[44px] flex-1 items-center justify-center gap-2 rounded-pill bg-primary px-5 text-sm font-medium text-on-primary sm:flex-none'
          : 'flex min-h-[44px] flex-1 items-center justify-center gap-2 rounded-pill px-5 text-sm font-medium text-ink-soft transition-colors hover:text-ink sm:flex-none'
      }
    >
      {icon}
      {label}
    </button>
  )
}

function InsightCard({
  icon,
  title,
  items,
}: {
  icon: React.ReactNode
  title: string
  items: string[]
}) {
  return (
    <Card>
      <CardHeader icon={icon} title={title} />
      <CardBody>
        <ul className="space-y-2.5">
          {items.map((item) => (
            <li key={item} className="flex gap-2.5 text-sm text-ink-soft">
              <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-accent-500" />
              {item}
            </li>
          ))}
        </ul>
      </CardBody>
    </Card>
  )
}
