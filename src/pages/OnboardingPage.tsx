import { useCallback, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, ArrowRight, Check, Save } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { PageHeader } from '@/components/ui/PageHeader'
import { StepPersonal } from '@/pages/onboarding/StepPersonal'
import { StepEducation } from '@/pages/onboarding/StepEducation'
import { StepExperience } from '@/pages/onboarding/StepExperience'
import { StepSkills } from '@/pages/onboarding/StepSkills'
import { StepPreference } from '@/pages/onboarding/StepPreference'
import { AnalyzingScreen } from '@/pages/onboarding/AnalyzingScreen'
import { useCandidateDraft } from '@/hooks/useCandidateDraft'
import { useDemoSession } from '@/hooks/demoSessionContext'
import { astrologyEngine } from '@/services/astrology'
import { cn } from '@/utils/cn'
import type { Candidate, CandidateDraft, Experience } from '@/types'

const STEPS = [
  { key: 'personal', label: 'Thông tin cá nhân' },
  { key: 'education', label: 'Học vấn' },
  { key: 'experience', label: 'Kinh nghiệm' },
  { key: 'skills', label: 'Kỹ năng' },
  { key: 'preference', label: 'Mong muốn nghề nghiệp' },
]

export function OnboardingPage() {
  const { draft, update, saveNow, savedAt, reset } = useCandidateDraft()
  const { saveCandidate, setRole } = useDemoSession()
  const navigate = useNavigate()

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [consent, setConsent] = useState(false)
  // Years read from an uploaded CV, used when the wizard has no dated roles.
  const [detectedYears, setDetectedYears] = useState<number | null>(null)
  const [analyzing, setAnalyzing] = useState(false)
  const [pending, setPending] = useState<Candidate | null>(null)

  const step = Math.min(Math.max(draft.step, 0), STEPS.length - 1)

  const validateStep = useCallback((): boolean => {
    if (step !== 0) return true
    const next: Record<string, string> = {}
    const personal = draft.personal

    if (!personal.fullName?.trim()) next.fullName = 'Vui lòng nhập họ và tên.'
    if (!personal.birthDate) next.birthDate = 'Vui lòng chọn ngày sinh.'
    if (!personal.birthPlace?.trim()) next.birthPlace = 'Vui lòng nhập nơi sinh.'
    if (!personal.currentCity?.trim()) next.currentCity = 'Vui lòng chọn thành phố hiện tại.'
    if (personal.email && !/^\S+@\S+\.\S+$/.test(personal.email)) {
      next.email = 'Email chưa đúng định dạng.'
    }
    if (!consent) {
      next.consent = 'Vui lòng đồng ý trước khi tiếp tục.'
    }

    setErrors(next)
    return Object.keys(next).length === 0
  }, [step, draft.personal, consent])

  const goNext = () => {
    if (!validateStep()) return
    if (step < STEPS.length - 1) {
      update({ step: step + 1 })
      window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }
    finish()
  }

  const goBack = () => {
    if (step === 0) {
      navigate('/')
      return
    }
    update({ step: step - 1 })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const finish = () => {
    const candidate = buildCandidate(draft, detectedYears)
    setPending(candidate)
    setAnalyzing(true)
  }

  const onAnalysisDone = useCallback(() => {
    if (!pending) return
    saveCandidate(pending)
    setRole('candidate')
    reset()
    navigate('/candidate/profile')
  }, [pending, saveCandidate, setRole, reset, navigate])

  const progress = useMemo(() => ((step + 1) / STEPS.length) * 100, [step])

  if (analyzing) {
    return <AnalyzingScreen onDone={onAnalysisDone} />
  }

  return (
    <div className="container max-w-3xl">
      <PageHeader
        eyebrow={`Bước ${step + 1} / ${STEPS.length}`}
        title="Tạo hồ sơ của bạn"
        description="Mỗi bước được lưu tự động. Bạn đóng trang rồi quay lại sau vẫn còn nguyên."
      />

      {/* Progress */}
      <div className="mt-7">
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-surface-sunken">
          <div
            className="h-full rounded-full bg-primary transition-[width] duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>

        <ol className="mt-4 flex gap-1 overflow-x-auto pb-1 no-scrollbar">
          {STEPS.map((item, index) => {
            const done = index < step
            const active = index === step
            return (
              <li key={item.key} className="shrink-0">
                <button
                  type="button"
                  // Only completed steps are navigable: jumping ahead would
                  // skip required-field validation.
                  disabled={index > step}
                  onClick={() => update({ step: index })}
                  className={cn(
                    'flex min-h-[44px] items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs font-medium transition-colors duration-150 sm:min-h-0',
                    active && 'bg-primary text-on-primary',
                    done && 'text-ink-soft hover:bg-surface-sunken',
                    !active && !done && 'cursor-not-allowed text-ink-faint',
                  )}
                >
                  <span
                    className={cn(
                      'flex h-4 w-4 items-center justify-center rounded-full text-[10px]',
                      active ? 'bg-on-primary text-primary' : done ? 'bg-success-solid text-white' : 'bg-surface-sunken',
                    )}
                  >
                    {done ? <Check className="h-2.5 w-2.5" /> : index + 1}
                  </span>
                  <span className="whitespace-nowrap">{item.label}</span>
                </button>
              </li>
            )
          })}
        </ol>
      </div>

      {/* Step body */}
      <div className="mt-7">
        {step === 0 ? (
          <StepPersonal
            draft={draft}
            errors={errors}
            consent={consent}
            onConsentChange={setConsent}
            onChange={(patch) => update({ personal: { ...draft.personal, ...patch } })}
          />
        ) : null}

        {step === 1 ? (
          <StepEducation items={draft.education} onChange={(education) => update({ education })} />
        ) : null}

        {step === 2 ? (
          <StepExperience items={draft.experience} onChange={(experience) => update({ experience })} />
        ) : null}

        {step === 3 ? (
          <StepSkills
            skills={draft.skills}
            onChange={(skills) => update({ skills })}
            onYearsDetected={(years) => setDetectedYears(years)}
          />
        ) : null}

        {step === 4 ? (
          <StepPreference
            preference={draft.preference}
            onChange={(patch) => update({ preference: { ...draft.preference, ...patch } })}
          />
        ) : null}
      </div>

      {/* Navigation */}
      <Card className="sticky bottom-4 mt-7 flex flex-col gap-3 p-4 shadow-lift sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <Button variant="ghost" onClick={goBack}>
            <ArrowLeft className="h-4 w-4" />
            {step === 0 ? 'Thoát' : 'Quay lại'}
          </Button>
          <Button variant="subtle" onClick={saveNow}>
            <Save className="h-4 w-4" />
            Lưu nháp
          </Button>
        </div>

        <div className="flex items-center gap-3">
          {savedAt ? (
            <span className="hidden text-xs text-success-fg sm:inline">Đã lưu nháp</span>
          ) : null}
          <Button variant="primary" onClick={goNext} className="flex-1 sm:flex-none">
            {step === STEPS.length - 1 ? 'Phân tích hồ sơ' : 'Tiếp tục'}
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </Card>
    </div>
  )
}

/* ------------------------------------------------------------------ */

/** Turn the wizard draft into a complete `Candidate`, deriving what's implied. */
function buildCandidate(draft: CandidateDraft, detectedYears: number | null): Candidate {
  const personal = draft.personal
  const now = new Date().toISOString()

  const birth = {
    birthDate: personal.birthDate ?? '',
    birthTime: personal.birthTime ?? '',
    birthPlace: personal.birthPlace ?? '',
    gender: personal.gender ?? 'other',
  }

  // Dated roles win; a CV-derived figure fills in when none were entered.
  const enteredYears = totalYears(draft.experience)
  const yearsOfExperience = enteredYears > 0 ? enteredYears : (detectedYears ?? 0)
  const latest = draft.experience.find((item) => item.current) ?? draft.experience[0]

  return {
    id: 'me',
    personal: {
      ...birth,
      fullName: personal.fullName?.trim() || 'Người dùng VHuman',
      currentCity: personal.currentCity ?? '',
      email: personal.email ?? '',
      phone: personal.phone ?? '',
      avatar: personal.avatar ?? '',
    },
    education: draft.education,
    experience: draft.experience,
    skills: draft.skills,
    preference: {
      industries: draft.preference.industries ?? [],
      desiredTitle: draft.preference.desiredTitle ?? '',
      seniority: draft.preference.seniority ?? 'middle',
      workModes: draft.preference.workModes ?? ['hybrid'],
      preferredLocations: draft.preference.preferredLocations ?? [],
      salaryMin: draft.preference.salaryMin ?? 0,
      salaryMax: draft.preference.salaryMax ?? 0,
    },
    headline: latest?.title || draft.preference.desiredTitle || 'Đang tìm hướng đi phù hợp',
    summary:
      latest?.description ||
      'Hồ sơ được tạo trong phiên demo VHuman để khám phá các hướng nghề nghiệp phù hợp.',
    yearsOfExperience,
    astrology: astrologyEngine.analyze(birth),
    createdAt: now,
    updatedAt: now,
  }
}

/** Sum of all experience spans, in years, rounded to one decimal. */
function totalYears(items: Experience[]): number {
  let months = 0
  for (const item of items) {
    if (!item.startDate) continue
    const start = new Date(`${item.startDate}-01`)
    const end = item.current || !item.endDate ? new Date() : new Date(`${item.endDate}-01`)
    const diff =
      (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth())
    if (diff > 0) months += diff
  }
  return Math.round((months / 12) * 10) / 10
}
