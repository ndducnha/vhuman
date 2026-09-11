import { useNavigate } from 'react-router-dom'
import { ArrowRight, BriefcaseBusiness, UserRound } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { useDemoSession } from '@/hooks/demoSessionContext'
import type { DemoRole } from '@/types'

/**
 * Mock "login". No credentials: picking a role stores it in localStorage and
 * routes to the matching dashboard.
 */
export function ChooseRolePage() {
  const { setRole, candidate } = useDemoSession()
  const navigate = useNavigate()

  const choose = (role: DemoRole) => {
    setRole(role)
    if (role === 'recruiter') {
      navigate('/recruiter')
      return
    }
    navigate(candidate ? '/candidate/profile' : '/candidate/onboarding')
  }

  return (
    <div className="container py-16 sm:py-24">
      <div className="mx-auto max-w-3xl text-center">
        <h1 className="text-3xl font-bold tracking-tight text-ink sm:text-4xl">
          Bạn muốn trải nghiệm VHuman với vai trò nào?
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-base text-ink-soft">
          Đây là bản thử nghiệm. Không cần tài khoản hay mật khẩu. Bạn đổi vai trò bất cứ lúc nào.
        </p>
      </div>

      <div className="mx-auto mt-12 grid max-w-3xl gap-5 md:grid-cols-2">
        <RoleCard
          icon={<UserRound className="h-6 w-6" />}
          tone="primary"
          title="Tôi là ứng viên"
          description="Tạo hồ sơ để biết nghề nào hợp với mình."
          onClick={() => choose('candidate')}
        />
        <RoleCard
          icon={<BriefcaseBusiness className="h-6 w-6" />}
          tone="accent"
          title="Tôi là nhà tuyển dụng"
          description="Tìm người hợp với công việc và hợp với đội ngũ."
          onClick={() => choose('recruiter')}
        />
      </div>
    </div>
  )
}

function RoleCard({
  icon,
  title,
  description,
  onClick,
  tone,
}: {
  icon: React.ReactNode
  title: string
  description: string
  onClick: () => void
  tone: 'primary' | 'accent'
}) {
  return (
    <Card interactive className="flex flex-col p-7">
      <span
        className={
          tone === 'primary'
            ? 'flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-on-primary'
            : 'flex h-12 w-12 items-center justify-center rounded-xl bg-accent-600 text-on-accent'
        }
      >
        {icon}
      </span>
      <h2 className="mt-5 text-lg font-semibold text-ink">{title}</h2>
      <p className="mt-2 flex-1 text-sm leading-relaxed text-ink-soft">{description}</p>
      <Button variant="primary" className="mt-6" block onClick={onClick}>
        Tiếp tục
        <ArrowRight className="h-4 w-4" />
      </Button>
    </Card>
  )
}
