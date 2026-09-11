import { useMemo, useState } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import {
  ArrowLeft, Briefcase, CheckCircle2, Gift, ListChecks,
  MapPin, Send, Target, XCircle,
} from 'lucide-react'
import { Card, CardBody, CardHeader } from '@/components/ui/Card'
import { Badge, BandBadge } from '@/components/ui/Badge'
import { Button, ButtonLink } from '@/components/ui/Button'
import { EmptyState } from '@/components/ui/EmptyState'
import { SkillTag } from '@/components/ui/SkillTag'
import { ScoreCircle } from '@/components/ui/ScoreCircle'
import { TraitBar } from '@/components/ui/TraitBar'
import { Modal } from '@/components/ui/Modal'
import { TextArea } from '@/components/ui/Field'
import { CornerMark } from '@/components/ui/Ornament'
import { JOB_BY_ID } from '@/data/jobs'
import { skillName } from '@/data/skills'
import { matchCandidateToJob } from '@/services/matching'
import { useDemoSession } from '@/hooks/demoSessionContext'
import {
  APPLICATION_STAGE_LABEL, CAREER_FIELD_LABEL, JOB_STATUS_LABEL,
  SENIORITY_LABEL, WORK_MODE_LABEL, formatDateVi, formatSalary,
} from '@/utils/format'

/** Chi tiết tin tuyển dụng, kèm phân tích mức phù hợp và luồng ứng tuyển. */
export function JobDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { candidate, applicationFor, applyToJob, withdrawApplication } = useDemoSession()
  const [open, setOpen] = useState(false)
  const [note, setNote] = useState('')

  const job = id ? JOB_BY_ID[id] : undefined
  const match = useMemo(
    () => (candidate && job ? matchCandidateToJob(candidate, job) : null),
    [candidate, job],
  )
  const application = job ? applicationFor(job.id) : undefined

  if (!job) {
    return (
      <div className="container">
        <EmptyState
          icon={<Briefcase className="h-6 w-6" />}
          title="Không tìm thấy tin tuyển dụng"
          description="Tin này không có trong dữ liệu demo."
          action={<ButtonLink to="/viec-lam" variant="primary">Về danh sách việc làm</ButtonLink>}
        />
      </div>
    )
  }

  return (
    <div className="container space-y-6">
      <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="-ml-2">
        <ArrowLeft className="h-4 w-4" />
        Quay lại
      </Button>

      {/* Đầu trang */}
      <Card className="relative overflow-hidden p-6">
        <CornerMark corner="tl" className="absolute left-3 top-3 text-primary/35" />
        <div className="flex flex-col gap-6 pl-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <Badge tone="outline">{CAREER_FIELD_LABEL[job.field]}</Badge>
              <Badge tone={job.status === 'open' ? 'success' : 'neutral'}>
                {JOB_STATUS_LABEL[job.status]}
              </Badge>
            </div>
            <h1 className="mt-3 text-2xl font-bold text-ink sm:text-3xl">{job.title}</h1>
            <p className="mt-1 text-base text-ink-soft">{job.company}</p>
            <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-ink-muted">
              <span className="inline-flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5" />{job.location}</span>
              <span className="inline-flex items-center gap-1.5"><Briefcase className="h-3.5 w-3.5" />{SENIORITY_LABEL[job.seniority]}</span>
              <span>{WORK_MODE_LABEL[job.workMode]}</span>
              <span className="font-medium text-ink">{formatSalary(job.salaryMin, job.salaryMax)}/tháng</span>
              <span>{job.openings} vị trí</span>
              <span>Đăng {formatDateVi(job.postedAt)}</span>
            </div>
          </div>

          {match ? (
            <div className="flex shrink-0 flex-col items-center gap-3 rounded-xl border border-line bg-surface-sunken p-5">
              <p className="text-xs font-medium text-ink-muted">Mức phù hợp</p>
              <ScoreCircle value={match.overall} size="lg" />
              <BandBadge band={match.band} />
            </div>
          ) : null}
        </div>

        {/* Ứng tuyển */}
        <div className="mt-6 flex flex-wrap items-center gap-3 border-t border-line pt-5 pl-3">
          {!candidate ? (
            <>
              <ButtonLink to="/candidate/onboarding" variant="crimson">Tạo hồ sơ để ứng tuyển</ButtonLink>
              <p className="text-sm text-ink-muted">Cần có hồ sơ trước khi nộp đơn.</p>
            </>
          ) : application ? (
            <>
              <Badge tone="success">
                <CheckCircle2 className="h-3 w-3" />
                {APPLICATION_STAGE_LABEL[application.stage]}
              </Badge>
              <p className="text-sm text-ink-muted">
                Bạn đã nộp đơn ngày {formatDateVi(application.appliedAt.slice(0, 10))}.
              </p>
              <Button variant="danger" size="sm" onClick={() => withdrawApplication(application.id)}>
                <XCircle className="h-4 w-4" />
                Rút đơn
              </Button>
              <Link to="/candidate/don-ung-tuyen" className="link-cta">Xem đơn của tôi</Link>
            </>
          ) : job.status !== 'open' ? (
            <p className="text-sm text-ink-muted">Tin này đã đóng, không nhận thêm hồ sơ.</p>
          ) : (
            <Button variant="crimson" onClick={() => setOpen(true)}>
              <Send className="h-4 w-4" />
              Ứng tuyển
            </Button>
          )}
        </div>
      </Card>

      <div className="grid gap-5 lg:grid-cols-[1.5fr_1fr]">
        <div className="space-y-5">
          <Card>
            <CardHeader icon={<Target className="h-4 w-4" />} title="Về công việc" />
            <CardBody className="space-y-5">
              <p className="text-sm leading-relaxed text-ink-soft">{job.summary}</p>
              <Section title="Công việc chính" items={job.responsibilities} />
              <Section title="Yêu cầu" items={job.requirements} />
              <Section title="Quyền lợi" items={job.benefits} icon={<Gift className="h-3.5 w-3.5" />} />
            </CardBody>
          </Card>
        </div>

        <div className="space-y-5">
          {match ? (
            <Card>
              <CardHeader icon={<ListChecks className="h-4 w-4" />} title="Bạn khớp tới đâu" />
              <CardBody className="space-y-4">
                <TraitBar label="Khớp kỹ năng" value={match.skillMatch} />
                <TraitBar label="Khớp kinh nghiệm" value={match.experienceMatch} />
                {match.profileMatch !== null ? (
                  <TraitBar label="Khớp hồ sơ cá nhân" value={match.profileMatch} />
                ) : (
                  <p className="text-xs text-ink-muted">
                    Tin này không mô tả mẫu hồ sơ mong muốn, nên phần hồ sơ cá nhân không được tính.
                  </p>
                )}

                <div className="border-t border-line pt-4">
                  <p className="mb-2 text-sm font-medium text-ink">
                    Kỹ năng bạn đã có <span className="font-normal text-ink-muted">({match.matchedSkills.length})</span>
                  </p>
                  {match.matchedSkills.length === 0 ? (
                    <p className="text-sm text-ink-muted">Chưa khớp kỹ năng nào trong tin này.</p>
                  ) : (
                    <div className="flex flex-wrap gap-1.5">
                      {match.matchedSkills.map((n) => <SkillTag key={n} name={n} matched />)}
                    </div>
                  )}
                </div>

                {match.missingSkills.length > 0 ? (
                  <div className="border-t border-line pt-4">
                    <p className="mb-2 text-sm font-medium text-ink">
                      Kỹ năng còn thiếu <span className="font-normal text-ink-muted">({match.missingSkills.length})</span>
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {match.missingSkills.map((n) => <SkillTag key={n} name={n} />)}
                    </div>
                  </div>
                ) : null}
              </CardBody>
            </Card>
          ) : (
            <Card>
              <CardBody>
                <p className="text-sm leading-relaxed text-ink-soft">
                  Tạo hồ sơ để xem bạn khớp tới đâu với tin này, và còn thiếu kỹ năng gì.
                </p>
                <ButtonLink to="/candidate/onboarding" variant="secondary" size="sm" className="mt-4">
                  Tạo hồ sơ
                </ButtonLink>
              </CardBody>
            </Card>
          )}

          <Card>
            <CardHeader title="Kỹ năng tin này cần" />
            <CardBody className="space-y-4">
              <div>
                <p className="mb-2 text-xs font-medium text-ink-muted">Bắt buộc</p>
                <div className="flex flex-wrap gap-1.5">
                  {job.skills.map((s) => <SkillTag key={s} name={skillName(s)} />)}
                </div>
              </div>
              <div>
                <p className="mb-2 text-xs font-medium text-ink-muted">Ưu tiên</p>
                <div className="flex flex-wrap gap-1.5">
                  {job.bonusSkills.map((s) => <SkillTag key={s} name={skillName(s)} />)}
                </div>
              </div>
            </CardBody>
          </Card>
        </div>
      </div>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title={`Ứng tuyển: ${job.title}`}
        footer={
          <div className="flex justify-end gap-2">
            <Button variant="ghost" onClick={() => setOpen(false)}>Huỷ</Button>
            <Button
              variant="crimson"
              onClick={() => {
                applyToJob(job.id, note.trim())
                setNote('')
                setOpen(false)
              }}
            >
              <Send className="h-4 w-4" />
              Nộp đơn
            </Button>
          </div>
        }
      >
        <div className="space-y-3">
          <p className="text-sm leading-relaxed text-ink-soft">
            Hồ sơ của bạn sẽ được gửi kèm. Bạn có thể thêm vài dòng giới thiệu.
          </p>
          <TextArea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Vì sao bạn quan tâm tới vị trí này..."
            aria-label="Lời giới thiệu"
          />
          <p className="text-xs leading-relaxed text-ink-muted">
            Đây là bản thử nghiệm. Đơn ứng tuyển chỉ lưu trên trình duyệt của bạn, không gửi đi đâu cả.
          </p>
        </div>
      </Modal>
    </div>
  )
}

function Section({ title, items, icon }: { title: string; items: string[]; icon?: React.ReactNode }) {
  return (
    <div className="border-t border-line pt-4">
      <p className="mb-2.5 flex items-center gap-1.5 text-sm font-semibold text-ink">
        {icon ? <span className="text-primary">{icon}</span> : null}
        {title}
      </p>
      <ul className="space-y-2">
        {items.map((item) => (
          <li key={item} className="flex gap-2.5 text-sm leading-relaxed text-ink-soft">
            <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-primary" />
            {item}
          </li>
        ))}
      </ul>
    </div>
  )
}
