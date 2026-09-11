import { useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowRight, CalendarClock, CheckCircle2, FileText, Loader2,
  RotateCcw, Sparkles, Upload, X,
} from 'lucide-react'
import { Button, ButtonLink } from '@/components/ui/Button'
import { Card, CardBody, CardHeader } from '@/components/ui/Card'
import { Field, Select, TextArea, TextInput } from '@/components/ui/Field'
import { PageHeader } from '@/components/ui/PageHeader'
import { SkillTag } from '@/components/ui/SkillTag'
import { ScoreCircle } from '@/components/ui/ScoreCircle'
import { tuviCareerEngine } from '@/services/astrology'
import { calculateCareerFit } from '@/services/matching'
import { CAREERS } from '@/data/careers'
import { CAREER_FAMILIES, CAREER_MODES, TRAIT_LABEL_VI } from '@/data/tuvi'
import { isReadableFile, parseCvText, type ParsedCv } from '@/utils/cvParser'
import { cn } from '@/utils/cn'
import type { Candidate, CandidateSkill, Gender } from '@/types'
import type { CareerTraitKey } from '@/types/tuvi'

/**
 * Demo một màn hình: dán CV, nhập ngày giờ sinh, bấm một nút là ra ngay
 * hướng nghề nghiệp và cách làm việc phù hợp.
 *
 * Trang này không ghi vào localStorage và không đụng hồ sơ thật. Nó dựng một
 * Candidate tạm trong bộ nhớ rồi chạy đúng engine mà trang hồ sơ đang dùng,
 * nên con số ở đây khớp với con số trong sản phẩm.
 */

const SAMPLE_CV = `Nguyễn Minh Quân
Kỹ sư phần mềm

KINH NGHIỆM
Công ty Công nghệ FPT, Kỹ sư phần mềm  (03/2019 - 08/2023)
- Xây dựng dịch vụ backend bằng Node.js và TypeScript, thành thạo PostgreSQL
- Thiết kế API cho ứng dụng có 200.000 người dùng, triển khai trên AWS với Docker
- Dẫn dắt nhóm 4 người, trực tiếp review code và quản lý dự án

Công ty Tiki, Lập trình viên  (06/2017 - 02/2019)
- Phát triển giao diện bằng React, thành thạo JavaScript
- Phân tích dữ liệu bán hàng bằng SQL và Python

KỸ NĂNG
JavaScript, TypeScript, React, Node.js, PostgreSQL, Docker, AWS, Python, SQL,
Git, giao tiếp tốt, làm việc nhóm, giải quyết vấn đề, tiếng Anh

HỌC VẤN
Đại học Bách Khoa Hà Nội, Kỹ thuật phần mềm (2013 - 2017)`

/** Candidate tối thiểu để engine chạy được, mọi thứ khác để mặc định trung tính. */
function buildCandidate(
  parsed: ParsedCv | null,
  birthDate: string,
  birthTime: string,
  gender: Gender,
): Candidate {
  const skills: CandidateSkill[] = parsed?.skills ?? []
  const years = parsed?.yearsOfExperience ?? 0
  const now = new Date().toISOString()
  return {
    id: 'quick-demo',
    personal: {
      fullName: 'Người dùng thử',
      email: '', phone: '', avatar: '', currentCity: 'Hà Nội',
      birthDate, birthTime, birthPlace: 'Hà Nội', gender,
    },
    education: [],
    experience: [],
    skills,
    preference: {
      industries: [], desiredTitle: parsed?.titles[0] ?? '',
      seniority: years >= 8 ? 'lead' : years >= 5 ? 'senior' : years >= 2 ? 'middle' : 'junior',
      workModes: [], preferredLocations: [], salaryMin: 0, salaryMax: 0,
    },
    headline: parsed?.titles[0] ?? '',
    summary: '',
    yearsOfExperience: years,
    createdAt: now, updatedAt: now,
  }
}

export function QuickDemoPage() {
  const [text, setText] = useState('')
  const [fileName, setFileName] = useState('')
  const [birthDate, setBirthDate] = useState('')
  const [birthTime, setBirthTime] = useState('')
  const [gender, setGender] = useState<Gender>('male')
  const [error, setError] = useState('')
  const [running, setRunning] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const resultRef = useRef<HTMLDivElement>(null)

  const parsed = useMemo(() => (text.trim() ? parseCvText(text) : null), [text])
  const ready = Boolean(parsed && parsed.skills.length > 0 && birthDate)

  const result = useMemo(() => {
    if (!submitted || !birthDate) return null
    const candidate = buildCandidate(parsed, birthDate, birthTime || '12:00', gender)
    const tuvi = tuviCareerEngine.classifyCareerProfile({
      birthDate, birthTime: birthTime || '12:00', birthPlace: 'Hà Nội', gender,
    })
    const fits = CAREERS.map((c) => calculateCareerFit(candidate, c, tuvi))
      .sort((a, b) => b.overall - a.overall)
      .slice(0, 4)
    return { tuvi, fits, candidate }
  }, [submitted, parsed, birthDate, birthTime, gender])

  const readFile = async (file: File) => {
    setError('')
    if (!isReadableFile(file)) {
      setFileName('')
      setError(
        `Không đọc được “${file.name}”. Trình duyệt chỉ đọc trực tiếp .txt, .md, .csv. ` +
          'Với PDF hoặc Word, bạn mở file rồi dán nội dung vào ô bên dưới.',
      )
      return
    }
    setFileName(file.name)
    setText(await file.text())
    setSubmitted(false)
  }

  const run = () => {
    if (!ready) return
    setRunning(true)
    setSubmitted(false)
    window.setTimeout(() => {
      setRunning(false)
      setSubmitted(true)
      window.setTimeout(
        () => resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }),
        60,
      )
    }, 550)
  }

  const reset = () => {
    setText(''); setFileName(''); setBirthDate(''); setBirthTime('')
    setGender('male'); setError(''); setSubmitted(false)
  }

  const fillSample = () => {
    setText(SAMPLE_CV); setFileName('cv-mau.txt')
    setBirthDate('1994-08-17'); setBirthTime('07:30'); setGender('male')
    setError(''); setSubmitted(false)
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <PageHeader
        eyebrow="Dùng thử nhanh"
        title="Thử ngay trong một phút"
        description="Dán CV và nhập ngày giờ sinh. Bấm một nút là ra hướng nghề nghiệp phù hợp và cách làm việc hợp với bạn. Không cần đăng ký, dữ liệu không rời khỏi trình duyệt."
      />

      <div className="mt-6 grid gap-5 lg:grid-cols-[1.15fr_1fr]">
        {/* ── Bước 1: CV ───────────────────────────────────────── */}
        <Card>
          <CardHeader
            title="Bước 1. CV của bạn"
            description="Kéo thả file .txt hoặc dán nội dung CV vào đây."
            icon={<FileText className="h-5 w-5" />}
          />
          <CardBody className="space-y-3">
            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault()
                const f = e.dataTransfer.files[0]
                if (f) void readFile(f)
              }}
              onClick={() => inputRef.current?.click()}
              className="flex cursor-pointer flex-col items-center gap-2 rounded-xl border-2 border-dashed border-line bg-surface-sunken px-4 py-6 text-center transition hover:border-primary hover:bg-primary/5"
            >
              <Upload className="h-6 w-6 text-ink-soft" />
              <p className="text-sm font-medium text-ink">Kéo file CV vào đây hoặc bấm để chọn</p>
              <p className="text-xs text-ink-soft">Nhận .txt, .md, .csv</p>
              <input
                ref={inputRef} type="file" className="hidden"
                accept=".txt,.md,.csv,.json,.rtf"
                onChange={(e) => {
                  const f = e.target.files?.[0]
                  if (f) void readFile(f)
                }}
              />
            </div>

            {fileName && (
              <div className="flex items-center justify-between rounded-lg bg-primary/10 px-3 py-2 text-sm">
                <span className="flex items-center gap-2 font-medium text-primary">
                  <CheckCircle2 className="h-4 w-4" /> {fileName}
                </span>
                <button
                  type="button" aria-label="Bỏ file"
                  onClick={() => { setFileName(''); setText(''); setSubmitted(false) }}
                  className="rounded p-1 text-ink-soft hover:bg-surface-sunken hover:text-ink"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            )}

            <TextArea
              rows={7}
              placeholder="Hoặc dán nội dung CV vào đây."
              value={text}
              onChange={(e) => { setText(e.target.value); setSubmitted(false) }}
            />

            {error && <p className="text-sm text-danger-fg">{error}</p>}

            {parsed && (
              <div className="rounded-lg border border-line bg-surface-sunken p-3">
                <p className="text-xs font-medium uppercase tracking-wide text-ink-soft">
                  Đọc được {parsed.skills.length} kỹ năng
                  {parsed.yearsOfExperience !== null && ` · khoảng ${parsed.yearsOfExperience} năm kinh nghiệm`}
                </p>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {parsed.skills.slice(0, 12).map((s) => (
                    <SkillTag key={s.skillId} name={s.name} level={s.level} />
                  ))}
                  {parsed.skills.length > 12 && (
                    <span className="self-center text-xs text-ink-soft">
                      và {parsed.skills.length - 12} kỹ năng nữa
                    </span>
                  )}
                </div>
              </div>
            )}
          </CardBody>
        </Card>

        {/* ── Bước 2: ngày giờ sinh ───────────────────────────── */}
        <div className="space-y-5">
          <Card>
            <CardHeader
              title="Bước 2. Ngày giờ sinh"
              description="Giờ sinh càng chính xác thì phân tích càng rõ. Không biết giờ thì để trống, hệ thống lấy chính Ngọ."
              icon={<CalendarClock className="h-5 w-5" />}
            />
            <CardBody className="space-y-3">
              <Field label="Ngày sinh" required>
                <TextInput
                  type="date" value={birthDate}
                  onChange={(e) => { setBirthDate(e.target.value); setSubmitted(false) }}
                />
              </Field>
              <Field label="Giờ sinh" hint="Để trống nếu không nhớ.">
                <TextInput
                  type="time" value={birthTime}
                  onChange={(e) => { setBirthTime(e.target.value); setSubmitted(false) }}
                />
              </Field>
              <Field label="Giới tính">
                <Select
                  value={gender}
                  onChange={(e) => { setGender(e.target.value as Gender); setSubmitted(false) }}
                >
                  <option value="male">Nam</option>
                  <option value="female">Nữ</option>
                  <option value="other">Khác</option>
                </Select>
              </Field>
              <p className="text-xs text-ink-soft">
                Ngày giờ sinh chỉ nằm trong trình duyệt của bạn. Trang này không lưu và không gửi đi đâu.
              </p>
            </CardBody>
          </Card>

          <div className="space-y-2">
            <Button
              className="w-full" size="lg" onClick={run}
              disabled={!ready || running}
            >
              {running ? (
                <><Loader2 className="h-4 w-4 animate-spin" /> Đang phân tích</>
              ) : (
                <><Sparkles className="h-4 w-4" /> Xem nghề phù hợp</>
              )}
            </Button>
            <div className="flex gap-2">
              <Button variant="ghost" className="flex-1" onClick={fillSample}>
                Điền dữ liệu mẫu
              </Button>
              <Button variant="ghost" className="flex-1" onClick={reset}>
                <RotateCcw className="h-4 w-4" /> Làm lại
              </Button>
            </div>
            {!ready && (
              <p className="text-center text-xs text-ink-soft">
                {!parsed || parsed.skills.length === 0
                  ? 'Cần nội dung CV có ít nhất một kỹ năng nhận diện được.'
                  : 'Cần thêm ngày sinh.'}
              </p>
            )}
          </div>
        </div>
      </div>

      <div ref={resultRef}>{result && <QuickResult result={result} />}</div>
    </div>
  )
}

/* ── Kết quả ──────────────────────────────────────────────────── */

function QuickResult({
  result,
}: {
  result: {
    tuvi: ReturnType<typeof tuviCareerEngine.classifyCareerProfile>
    fits: ReturnType<typeof calculateCareerFit>[]
  }
}) {
  const { tuvi, fits } = result
  const mode = CAREER_MODES[tuvi.cycle.mode]
  const family = CAREER_FAMILIES.find((f) => f.id === tuvi.dominantFamily)

  const topTraits = (Object.entries(tuvi.traits) as [CareerTraitKey, number][])
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)

  return (
    <div className="mt-10 scroll-mt-24 space-y-5">
      <div className="flex items-center gap-3">
        <div className="h-px flex-1 bg-border" />
        <span className="text-xs font-semibold uppercase tracking-widest text-ink-soft">Kết quả</span>
        <div className="h-px flex-1 bg-border" />
      </div>

      {/* Nghề phù hợp */}
      <Card>
        <CardHeader
          title="Hướng nghề nghiệp phù hợp"
          description="Bốn hướng khớp nhất, tính từ bằng chứng trong CV, lá số và mong muốn của bạn."
        />
        <CardBody>
          <div className="grid gap-3 sm:grid-cols-2">
            {fits.map((fit, i) => (
              <div
                key={fit.career.id}
                className={cn(
                  'rounded-xl border p-4',
                  i === 0 ? 'border-primary bg-primary/5' : 'border-line bg-surface-sunken',
                )}
              >
                <div className="flex items-start gap-3">
                  <ScoreCircle value={fit.overall} size="sm" />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-medium uppercase tracking-wide text-ink-soft">
                      {i === 0 ? 'Phù hợp nhất' : `Lựa chọn ${i + 1}`}
                    </p>
                    <h3 className="truncate font-semibold text-ink">{fit.career.name}</h3>
                    <p className="mt-1 line-clamp-2 text-sm text-ink-soft">{fit.career.summary}</p>
                  </div>
                </div>
                <div className="mt-3 grid grid-cols-3 gap-2 text-center">
                  {([
                    ['Lá số', fit.breakdown.reflection],
                    ['Bằng chứng', fit.breakdown.evidence],
                    ['Mong muốn', fit.breakdown.intent],
                  ] as const).map(([label, v]) => (
                    <div key={label} className="rounded-lg bg-card px-2 py-1.5">
                      <p className="text-[11px] text-ink-soft">{label}</p>
                      <p className="text-sm font-semibold text-ink">{v}</p>
                    </div>
                  ))}
                </div>
                {fit.whyFit[0] && (
                  <p className="mt-3 text-sm text-ink-soft">{fit.whyFit[0]}</p>
                )}
                <Link
                  to={`/candidate/careers/${fit.career.id}`}
                  className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
                >
                  Xem lộ trình nghề này <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            ))}
          </div>
        </CardBody>
      </Card>

      {/* Cách làm việc phù hợp */}
      <div className="grid gap-5 lg:grid-cols-2">
        <Card>
          <CardHeader
            title="Cách làm việc hợp với bạn"
            description="Suy từ nhóm chính tinh nổi trội trong lá số."
          />
          <CardBody className="space-y-4">
            {family && (
              <div className="rounded-xl border border-line bg-surface-sunken p-4">
                <p className="text-xs font-medium uppercase tracking-wide text-ink-soft">
                  Nhóm nổi trội · {tuvi.families[0]?.percent ?? 0}%
                </p>
                <h3 className="mt-0.5 font-semibold text-ink">{family.name}</h3>
                <p className="text-sm font-medium text-primary">{family.archetype}</p>
                <p className="mt-1 text-sm text-ink-soft">{family.description}</p>
              </div>
            )}
            <div>
              <p className="mb-2 text-xs font-medium uppercase tracking-wide text-ink-soft">
                Sáu chiều nổi bật nhất
              </p>
              <div className="space-y-2">
                {topTraits.map(([key, value]) => (
                  <div key={key}>
                    <div className="flex items-baseline justify-between text-sm">
                      <span className="text-ink">{TRAIT_LABEL_VI[key]}</span>
                      <span className="tabular-nums text-ink-soft">{Math.round(value * 100)}</span>
                    </div>
                    <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-surface-sunken">
                      <div
                        className="h-full rounded-full bg-primary"
                        style={{ width: `${Math.round(value * 100)}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardHeader
            title="Giai đoạn hiện tại"
            description={`Đại vận ${tuvi.cycle.majorFrom} tới ${tuvi.cycle.majorTo} · lưu niên ${tuvi.cycle.year} năm ${tuvi.cycle.canChi}.`}
          />
          <CardBody className="space-y-4">
            <div className="rounded-xl border border-primary bg-primary/5 p-4">
              <h3 className="font-semibold text-ink">{mode.label}</h3>
              <p className="mt-1 text-sm text-ink-soft">{tuvi.cycle.summary}</p>
            </div>
            <div>
              <p className="mb-2 text-xs font-medium uppercase tracking-wide text-ink-soft">
                Nên làm trong giai đoạn này
              </p>
              <ul className="space-y-1.5">
                {tuvi.cycle.actions.map((a) => (
                  <li key={a} className="flex gap-2 text-sm text-ink">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    <span>{a}</span>
                  </li>
                ))}
              </ul>
            </div>
            {tuvi.cautions[0] && (
              <div className="rounded-lg border border-line bg-surface-sunken p-3">
                <p className="text-xs font-medium uppercase tracking-wide text-ink-soft">Lưu ý</p>
                <p className="mt-1 text-sm text-ink">{tuvi.cautions[0]}</p>
              </div>
            )}
          </CardBody>
        </Card>
      </div>

      <Card>
        <CardBody className="flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="font-semibold text-ink">Muốn xem đầy đủ?</h3>
            <p className="text-sm text-ink-soft">
              Hồ sơ đầy đủ có lá số chi tiết, mười sáu chiều năng lực, lộ trình từng bước và việc làm đang tuyển.
            </p>
          </div>
          <ButtonLink to="/candidate/onboarding">
            Tạo hồ sơ đầy đủ <ArrowRight className="h-4 w-4" />
          </ButtonLink>
        </CardBody>
      </Card>

      <p className="px-1 text-xs leading-relaxed text-ink-soft">
        Kết quả trên là một góc nhìn tham khảo dựa trên Tử Vi và dữ liệu bạn cung cấp, không phải phương pháp
        khoa học và không phải dự báo chắc chắn. VHuman không dùng lá số để tự động loại ứng viên, và không
        hiển thị ngày giờ sinh cho nhà tuyển dụng.
      </p>
    </div>
  )
}
