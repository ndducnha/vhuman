import { useEffect, useState } from 'react'
import { Check, Loader2 } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Logo } from '@/components/Logo'
import { cn } from '@/utils/cn'

const STEPS = [
  'Phân tích thông tin cá nhân',
  'Phân tích kỹ năng',
  'Phân tích kinh nghiệm',
  'Xây dựng Hồ sơ cá nhân',
  'Đánh giá nhóm nghề nghiệp',
]

const STEP_DELAY = 280

/**
 * Simulated analysis screen. No network calls: the profile is already computed
 * synchronously; this only paces the transition so the user can see what the
 * product is doing on their behalf.
 */
export function AnalyzingScreen({ onDone }: { onDone: () => void }) {
  const [completed, setCompleted] = useState(0)

  useEffect(() => {
    if (completed >= STEPS.length) {
      const timer = window.setTimeout(onDone, 420)
      return () => window.clearTimeout(timer)
    }
    const timer = window.setTimeout(() => setCompleted((value) => value + 1), STEP_DELAY)
    return () => window.clearTimeout(timer)
  }, [completed, onDone])

  const progress = (completed / STEPS.length) * 100

  return (
    <div className="flex min-h-screen items-center justify-center bg-surface-muted px-4 py-12">
      <Card className="w-full max-w-md p-7 sm:p-8">
        <Logo />

        <h1 className="mt-7 text-xl font-semibold text-ink">Đang dựng hồ sơ nghề nghiệp của bạn</h1>
        <p className="mt-2 text-sm text-ink-soft">
          Chúng tôi đang tổng hợp thông tin bạn vừa nhập. Toàn bộ quá trình diễn ra trên trình duyệt
          của bạn.
        </p>

        <div className="mt-6 h-1.5 w-full overflow-hidden rounded-full bg-surface-sunken">
          <div
            className="h-full rounded-full bg-primary transition-[width] duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>

        <ul className="mt-6 space-y-3">
          {STEPS.map((step, index) => {
            const done = index < completed
            const active = index === completed
            return (
              <li
                key={step}
                className={cn(
                  'flex items-center gap-3 text-sm transition-colors',
                  done ? 'text-ink' : active ? 'text-ink-soft' : 'text-ink-faint',
                )}
              >
                <span
                  className={cn(
                    'flex h-5 w-5 shrink-0 items-center justify-center rounded-full border transition-colors',
                    done
                      ? 'border-success-solid bg-success-solid text-white'
                      : active
                        ? 'border-accent-400 text-accent-600'
                        : 'border-line text-transparent',
                  )}
                >
                  {done ? (
                    <Check className="h-3 w-3" />
                  ) : active ? (
                    <Loader2 className="h-3 w-3 animate-spin" />
                  ) : null}
                </span>
                {step}
              </li>
            )
          })}
        </ul>
      </Card>
    </div>
  )
}
