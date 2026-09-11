import { useMemo } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  ArrowLeft,
  Bookmark,
  BookmarkCheck,
  Briefcase,
  GraduationCap,
  Mail,
  MapPin,
  Phone,
  Sparkles,
  Target,
  UserRound,
} from 'lucide-react'
import { Card, CardBody, CardHeader } from '@/components/ui/Card'
import { Button, ButtonLink } from '@/components/ui/Button'
import { Avatar } from '@/components/ui/Avatar'
import { Badge, BandBadge } from '@/components/ui/Badge'
import { EmptyState } from '@/components/ui/EmptyState'
import { SkillTag } from '@/components/ui/SkillTag'
import { ScoreCircle } from '@/components/ui/ScoreCircle'
import { TraitBar } from '@/components/ui/TraitBar'
import { TraitRadar } from '@/components/TraitRadar'
import { Modal } from '@/components/ui/Modal'
import { useCandidateById } from '@/hooks/useCandidates'
import { useDemoSession } from '@/hooks/demoSessionContext'
import { matchingEngine } from '@/services/matching'
import {
  CAREER_FIELD_LABEL,
  MANAGER_ROLE_LABEL,
  TRAIT_LABEL,
  TRAIT_ORDER,
  formatPeriod,
  formatSalary,
  formatYears,
  SENIORITY_LABEL,
  WORK_MODE_LABEL,
} from '@/utils/format'
import { useState } from 'react'
import { Link } from 'react-router-dom'

export function CandidateDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const candidate = useCandidateById(id)
  const { isSaved, toggleSaved, activeManager } = useDemoSession()
  const [contactOpen, setContactOpen] = useState(false)

  const recommendations = useMemo(
    () => (candidate ? matchingEngine.recommendCareers(candidate, 5) : []),
    [candidate],
  )

  const compatibility = useMemo(() => {
    if (!candidate || !activeManager) return undefined
    return matchingEngine.describeCompatibility(candidate, activeManager)
  }, [candidate, activeManager])

  if (!candidate) {
    return (
      <EmptyState
        icon={<UserRound className="h-6 w-6" />}
        title="Không tìm thấy ứng viên"
        description="Hồ sơ này không tồn tại trong dữ liệu demo."
        action={
          <ButtonLink to="/recruiter/search" variant="primary">
            Về trang tìm ứng viên
          </ButtonLink>
        }
      />
    )
  }

  const profile = candidate.astrology
  const saved = isSaved(candidate.id)

  return (
    <div className="space-y-6">
      <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="-ml-2">
        <ArrowLeft className="h-4 w-4" />
        Quay lại
      </Button>

      {/* Header */}
      <Card className="p-6">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-start gap-4">
            <Avatar name={candidate.personal.fullName} src={candidate.personal.avatar} size="xl" />
            <div className="min-w-0">
              <h1 className="text-2xl font-bold text-ink sm:text-3xl">
                {candidate.personal.fullName}
              </h1>
              <p className="mt-1 text-base text-ink-soft">{candidate.headline}</p>
              <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-sm text-ink-muted">
                <span className="inline-flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5" />
                  {candidate.personal.currentCity}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Briefcase className="h-3.5 w-3.5" />
                  {formatYears(candidate.yearsOfExperience)}
                </span>
                <span>{SENIORITY_LABEL[candidate.preference.seniority]}</span>
              </div>
            </div>
          </div>

          <div className="flex shrink-0 gap-2">
            <Button
              variant={saved ? 'primary' : 'secondary'}
              onClick={() => toggleSaved(candidate.id)}
            >
              {saved ? <BookmarkCheck className="h-4 w-4" /> : <Bookmark className="h-4 w-4" />}
              {saved ? 'Đã lưu' : 'Lưu ứng viên'}
            </Button>
            <Button variant="primary" onClick={() => setContactOpen(true)}>
              <Mail className="h-4 w-4" />
              Liên hệ
            </Button>
          </div>
        </div>
      </Card>

      <div className="grid gap-5 lg:grid-cols-[1.5fr_1fr]">
        <div className="space-y-5">
          {/* Summary */}
          <Card>
            <CardHeader icon={<UserRound className="h-4 w-4" />} title="Giới thiệu" />
            <CardBody>
              <p className="text-sm leading-relaxed text-ink-soft">{candidate.summary}</p>

              <div className="mt-5 grid gap-3 border-t border-line pt-5 sm:grid-cols-2">
                <InfoRow label="Vị trí mong muốn" value={candidate.preference.desiredTitle || 'Chưa có'} />
                <InfoRow
                  label="Hình thức"
                  value={
                    candidate.preference.workModes.map((mode) => WORK_MODE_LABEL[mode]).join(', ') ||
                    'Chưa có'
                  }
                />
                <InfoRow
                  label="Mức lương mong muốn"
                  value={`${formatSalary(candidate.preference.salaryMin, candidate.preference.salaryMax)}/tháng`}
                />
                <InfoRow
                  label="Ngành quan tâm"
                  value={candidate.preference.industries.join(', ') || 'Chưa có'}
                />
              </div>
            </CardBody>
          </Card>

          {/* Experience */}
          <Card>
            <CardHeader icon={<Briefcase className="h-4 w-4" />} title="Kinh nghiệm" />
            <CardBody>
              {candidate.experience.length === 0 ? (
                <p className="text-sm text-ink-muted">Chưa có thông tin kinh nghiệm.</p>
              ) : (
                <ul className="space-y-5">
                  {candidate.experience.map((item) => (
                    <li key={item.id} className="border-l-2 border-line pl-4">
                      <p className="text-sm font-semibold text-ink">{item.title}</p>
                      <p className="text-sm text-ink-soft">{item.company}</p>
                      <p className="mt-0.5 text-xs text-ink-muted">
                        {formatPeriod(item.startDate, item.endDate, item.current)}
                      </p>
                      {item.description ? (
                        <p className="mt-2 text-sm leading-relaxed text-ink-soft">
                          {item.description}
                        </p>
                      ) : null}
                    </li>
                  ))}
                </ul>
              )}
            </CardBody>
          </Card>

          {/* Education */}
          <Card>
            <CardHeader icon={<GraduationCap className="h-4 w-4" />} title="Học vấn" />
            <CardBody>
              {candidate.education.length === 0 ? (
                <p className="text-sm text-ink-muted">Chưa có thông tin học vấn.</p>
              ) : (
                <ul className="space-y-4">
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

          {/* Skills */}
          <Card>
            <CardHeader icon={<Sparkles className="h-4 w-4" />} title="Kỹ năng" />
            <CardBody>
              <div className="flex flex-wrap gap-2">
                {candidate.skills.map((skill) => (
                  <SkillTag key={skill.skillId} name={skill.name} level={skill.level} />
                ))}
              </div>
            </CardBody>
          </Card>
        </div>

        <div className="space-y-5">
          {/* Compatibility with the active manager */}
          {compatibility && activeManager ? (
            <Card className="border-accent-200">
              <CardHeader
                icon={<Sparkles className="h-4 w-4" />}
                title="Mức độ tương thích với"
                description={`${activeManager.fullName} · ${MANAGER_ROLE_LABEL[activeManager.role]}`}
              />
              <CardBody>
                <div className="flex flex-col items-center gap-3">
                  <ScoreCircle value={compatibility.score} size="lg" />
                  <BandBadge band={compatibility.band} />
                </div>

                <p className="mt-5 rounded-lg border border-line bg-surface-muted p-4 text-sm leading-relaxed text-ink-soft">
                  {compatibility.summary}
                </p>

                <div className="mt-4 space-y-2.5">
                  {compatibility.highlights.map((item) => (
                    <p key={item} className="flex gap-2.5 text-sm text-ink-soft">
                      <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-success-solid" />
                      {item}
                    </p>
                  ))}
                  {compatibility.considerations.map((item) => (
                    <p key={item} className="flex gap-2.5 text-sm text-ink-soft">
                      <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-warning-solid" />
                      {item}
                    </p>
                  ))}
                </div>

                {profile && activeManager.astrology ? (
                  <div className="mt-5 border-t border-line pt-5">
                    <TraitRadar
                      traits={profile.traits}
                      compare={{ label: activeManager.fullName, traits: activeManager.astrology.traits }}
                      height={240}
                    />
                    <div className="mt-3 flex flex-wrap items-center justify-center gap-4 text-xs text-ink-muted">
                      <span className="flex items-center gap-1.5">
                        <span className="h-2 w-4 rounded-full bg-accent-600" /> Ứng viên
                      </span>
                      <span className="flex items-center gap-1.5">
                        <span className="h-2 w-4 rounded-full bg-neutral-solid" /> {activeManager.fullName}
                      </span>
                    </div>
                  </div>
                ) : null}

                <p className="mt-4 text-xs leading-relaxed text-ink-muted">
                  Chỉ số tương thích mô tả mức độ bổ trợ về phong cách làm việc, mang tính tham khảo và
                  không phải kết luận về mối quan hệ giữa hai người.
                </p>
              </CardBody>
            </Card>
          ) : null}

          {/* Personal profile */}
          {profile ? (
            <Card>
              <CardHeader
                title="Hồ sơ cá nhân"
                description="Xu hướng cá nhân theo tám chiều đo."
                action={
                  <Badge tone="neutral" className="font-mono text-[10px]">
                    {profile.signature}
                  </Badge>
                }
              />
              <CardBody>
                <div className="space-y-3">
                  {TRAIT_ORDER.map((trait) => (
                    <TraitBar key={trait} label={TRAIT_LABEL[trait]} value={profile.traits[trait]} tone="neutral" />
                  ))}
                </div>

                <div className="mt-5 border-t border-line pt-5">
                  <p className="mb-2.5 text-sm font-medium text-ink">Phong cách làm việc</p>
                  <div className="flex flex-wrap gap-1.5">
                    {profile.workingStyle.map((item) => (
                      <Badge key={item} tone="neutral">
                        {item}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardBody>
            </Card>
          ) : null}

          {/* Career fit */}
          <Card>
            <CardHeader
              icon={<Target className="h-4 w-4" />}
              title="Nhóm nghề phù hợp"
              description="Nhóm nghề phù hợp nhất với hồ sơ này."
            />
            <CardBody className="space-y-3">
              {recommendations.map((rec) => (
                <Link
                  key={rec.career.id}
                  to={`/candidate/careers/${rec.career.id}`}
                  className="flex items-center justify-between gap-3 rounded-lg border border-line p-3 transition-colors hover:bg-surface-muted"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-ink">{rec.career.name}</p>
                    <p className="truncate text-xs text-ink-muted">
                      {CAREER_FIELD_LABEL[rec.career.field]}
                    </p>
                  </div>
                  <span className="shrink-0 text-sm font-bold tabular-nums text-ink">
                    {Math.round(rec.overall)}%
                  </span>
                </Link>
              ))}
            </CardBody>
          </Card>
        </div>
      </div>

      <Modal
        open={contactOpen}
        onClose={() => setContactOpen(false)}
        title={`Liên hệ ${candidate.personal.fullName}`}
        footer={
          <Button variant="primary" block onClick={() => setContactOpen(false)}>
            Đã hiểu
          </Button>
        }
      >
        <div className="space-y-3">
          <div className="flex items-center gap-3 rounded-lg border border-line bg-surface-muted p-3.5">
            <Mail className="h-4 w-4 shrink-0 text-ink-faint" />
            <span className="truncate text-sm text-ink">{candidate.personal.email || 'Chưa có'}</span>
          </div>
          <div className="flex items-center gap-3 rounded-lg border border-line bg-surface-muted p-3.5">
            <Phone className="h-4 w-4 shrink-0 text-ink-faint" />
            <span className="text-sm text-ink">{candidate.personal.phone || 'Chưa có'}</span>
          </div>
          <p className="text-xs leading-relaxed text-ink-muted">
            Đây là hồ sơ minh hoạ trong bản demo. Thông tin liên hệ không có thật và không có email
            hay tin nhắn nào được gửi đi.
          </p>
        </div>
      </Modal>
    </div>
  )
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs text-ink-muted">{label}</p>
      <p className="mt-0.5 text-sm font-medium text-ink">{value}</p>
    </div>
  )
}
