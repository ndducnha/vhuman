import { Link } from 'react-router-dom'
import {
  ArrowRight,
  BriefcaseBusiness,
  CalendarClock,
  CalendarRange,
  FileText,
  Layers,
  Search,
  Sparkles,
  Target,
  UserRound,
  Users,
  Wrench,
} from 'lucide-react'
import { Button, ButtonLink } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { CornerMark, RuleMark, WaveMark } from '@/components/ui/Ornament'
import { CAREERS } from '@/data/careers'
import { SEED_CANDIDATES } from '@/data/candidates'
import { SKILLS } from '@/data/skills'
import { useDemoSession } from '@/hooks/demoSessionContext'
import { useNavigate } from 'react-router-dom'
import type { DemoRole } from '@/types'

export function LandingPage() {
  const { setRole } = useDemoSession()
  const navigate = useNavigate()

  const enterAs = (role: DemoRole) => {
    setRole(role)
    navigate(role === 'candidate' ? '/candidate/onboarding' : '/recruiter')
  }

  return (
    <>
      <Hero onEnter={enterAs} />
      <FlowSection />
      <HowItWorks />
      <AstrologySection />
      <ProductMessage />
      <RecruiterSection />
      <Stats />
      <FinalCta onEnter={enterAs} />
    </>
  )
}

/* ------------------------------------------------------------------ */

function Hero({ onEnter }: { onEnter: (role: DemoRole) => void }) {
  return (
    <section className="relative overflow-hidden border-b border-line bg-card">
      <div className="pointer-events-none absolute inset-0 grid-bg opacity-70" />
      <div className="pointer-events-none absolute -right-32 -top-32 h-[420px] w-[420px] rounded-full bg-accent-100/40 blur-3xl" />

      <div className="container relative py-16 sm:py-20 lg:py-24">
        <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_1fr]">
          <div className="animate-fade-up">
            <Badge tone="outline" className="mb-5">
              <Sparkles className="h-3 w-3 text-accent-600" />
              Nền tảng hiểu năng lực con người
            </Badge>

            <h1 className="font-display text-4xl font-extrabold uppercase leading-[1.06] tracking-[-0.015em] text-ink sm:text-5xl lg:text-[3.4rem]">
              Hiểu con người.
              <br />
              <span className="text-crimson">Tìm đúng hướng đi.</span>
            </h1>
            <RuleMark className="mt-5 text-primary" />

            <p className="mt-5 max-w-xl text-base leading-relaxed text-ink-soft sm:text-lg">
              Bạn tải CV lên và nhập ngày giờ sinh. VHuman lập lá số, rồi chỉ ra{' '}
              <strong className="font-semibold text-ink">nghề nghiệp phù hợp với bạn</strong>, và{' '}
              <strong className="font-semibold text-ink">giai đoạn nào nên làm gì</strong>. Dùng để lên
              kế hoạch cho chặng đường sắp tới.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <ButtonLink to="/dung-thu" variant="crimson" size="lg">
                Thử ngay trong một phút
                <ArrowRight className="h-4 w-4" />
              </ButtonLink>
              <ButtonLink to="/recruiter/search" variant="secondary" size="lg">
                <Search className="h-4 w-4" />
                Tìm ứng viên
              </ButtonLink>
            </div>
            <p className="mt-3 text-sm text-ink-soft">
              Dán CV, nhập ngày giờ sinh, ra ngay nghề phù hợp và cách làm việc hợp với bạn. Không
              cần đăng ký.{' '}
              <Link to="/candidate/onboarding" className="font-medium text-primary hover:underline">
                Hoặc tạo hồ sơ đầy đủ
              </Link>
            </p>

            <div className="mt-10 rounded-xl border border-line bg-surface-muted p-4">
              <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-ink-muted">
                Trải nghiệm với tư cách
              </p>
              <div className="flex flex-col gap-2 sm:flex-row">
                <Button variant="secondary" size="md" block onClick={() => onEnter('candidate')}>
                  <UserRound className="h-4 w-4" />
                  Ứng viên
                </Button>
                <Button variant="secondary" size="md" block onClick={() => onEnter('recruiter')}>
                  <BriefcaseBusiness className="h-4 w-4" />
                  Nhà tuyển dụng
                </Button>
              </div>
            </div>
          </div>

          <HeroDiagram />
        </div>
      </div>
    </section>
  )
}

/**
 * The core concept diagram: two inputs converge into one profile, which yields
 * two distinct outputs: which work, and when. The second output is the part
 * people miss when they only read "career matching", so it is spelled out.
 */
function HeroDiagram() {
  const inputs = [
    {
      icon: FileText,
      label: 'CV & kinh nghiệm',
      hint: 'Tải tệp lên, hoặc dán nội dung',
      step: '01',
    },
    {
      icon: CalendarClock,
      label: 'Ngày giờ tháng năm sinh',
      hint: 'Để lập lá số Tử Vi riêng tư',
      step: '02',
    },
  ]

  const outputs = [
    {
      icon: Target,
      title: 'Nghề nghiệp phù hợp',
      body: 'Nhóm nghề hợp với bạn nhất. Kèm mức độ phù hợp và lý do cụ thể.',
    },
    {
      icon: CalendarRange,
      title: 'Giai đoạn phù hợp',
      body: 'Đại vận 10 năm và lưu niên năm nay. Nên tập trung việc gì, nên chờ việc gì.',
    },
  ]

  return (
    <Card className="relative animate-fade-up border-primary/30 p-6 sm:p-8" style={{ animationDelay: '120ms' }}>
      <CornerMark corner="tl" className="absolute left-3 top-3 text-primary/50" />
      <CornerMark corner="br" className="absolute bottom-3 right-3 text-primary/50" />

      <p className="eyebrow mb-3">Bạn cung cấp</p>
      <div className="space-y-2.5">
        {inputs.map((input) => (
          <div
            key={input.label}
            className="flex items-center gap-3 rounded-lg border border-line bg-surface-sunken/70 px-4 py-3"
          >
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-card text-primary">
              <input.icon className="h-4 w-4" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-ink">{input.label}</p>
              <p className="truncate text-xs text-ink-muted">{input.hint}</p>
            </div>
            <span className="shrink-0 font-mono text-2xs text-ink-faint">{input.step}</span>
          </div>
        ))}
      </div>

      <Arrow />

      <div className="rounded-lg border border-brand bg-brand px-4 py-3.5 text-on-brand">
        <p className="text-sm font-semibold">Lá số và hồ sơ cá nhân</p>
        <p className="mt-0.5 text-xs text-on-brand-muted">
          Nhóm sao chủ đạo, cùng tám chiều đo về phong cách làm việc
        </p>
      </div>

      <Arrow />

      <p className="eyebrow mb-3">VHuman trả lời</p>
      <div className="grid gap-2.5 sm:grid-cols-2">
        {outputs.map((output) => (
          <div
            key={output.title}
            className="rounded-lg border border-primary/30 bg-accent-50/60 px-4 py-3.5"
          >
            <span className="mb-2 flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-on-primary">
              <output.icon className="h-4 w-4" />
            </span>
            <p className="text-sm font-semibold text-ink">{output.title}</p>
            <p className="mt-1 text-xs leading-relaxed text-ink-soft">{output.body}</p>
          </div>
        ))}
      </div>
    </Card>
  )
}

function Arrow() {
  return (
    <div className="flex justify-center py-3" aria-hidden>
      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-surface-sunken text-ink-faint">
        <ArrowRight className="h-3.5 w-3.5 rotate-90" />
      </span>
    </div>
  )
}

/* ------------------------------------------------------------------ */

function FlowSection() {
  return (
    <section className="border-b border-line bg-surface-muted py-16 sm:py-20">
      <div className="container">
        <SectionHeading
          eyebrow="Ý tưởng"
          title="Ba nguồn tín hiệu, một bức tranh"
          description="CV cho biết một người đã làm gì. Kỹ năng cho biết họ có thể làm gì. VHuman bổ sung lớp thứ ba: họ có xu hướng hợp với cách làm việc và môi trường nào."
        />

        <div className="mt-12 grid gap-5 md:grid-cols-3">
          <SignalCard
            index="01"
            icon={FileText}
            title="Đã làm gì"
            body="CV, kinh nghiệm và học vấn. Đây là phần lịch sử có thể kiểm chứng."
          />
          <SignalCard
            index="02"
            icon={Wrench}
            title="Có thể làm gì"
            body="Kỹ năng tự đánh giá theo bốn mức: cơ bản, trung bình, thành thạo, chuyên gia."
          />
          <SignalCard
            index="03"
            icon={Layers}
            title="Hợp với cách làm việc nào"
            body="Lá số Tử Vi cho biết nhóm sao chủ đạo và nhịp thời gian của bạn. Riêng tư, chỉ bạn nhìn thấy."
            highlight
          />
        </div>
      </div>
    </section>
  )
}

function SignalCard({
  index,
  icon: Icon,
  title,
  body,
  highlight,
}: {
  index: string
  icon: typeof FileText
  title: string
  body: string
  highlight?: boolean
}) {
  return (
    <Card
      ornament
      className={highlight ? 'relative overflow-hidden border-primary/35 bg-accent-50/50 p-6' : 'relative overflow-hidden p-6'}
    >
      <WaveMark className="absolute -right-2 -top-1 text-primary/25" size={72} />
      <div className="mb-4 flex items-center justify-between">
        <span
          className={
            highlight
              ? 'flex h-10 w-10 items-center justify-center rounded-lg bg-accent-600 text-on-accent'
              : 'flex h-10 w-10 items-center justify-center rounded-lg bg-surface-sunken text-ink-soft'
          }
        >
          <Icon className="h-5 w-5" />
        </span>
        <span className="text-xs font-semibold tabular-nums text-ink-faint">{index}</span>
      </div>
      <h3 className="text-base font-semibold text-ink">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-ink-soft">{body}</p>
    </Card>
  )
}

/* ------------------------------------------------------------------ */

function HowItWorks() {
  const cards = [
    {
      icon: UserRound,
      title: '1. Hiểu ứng viên',
      body: 'CV, kỹ năng và hồ sơ cá nhân được gộp thành một bức tranh nhiều chiều. Không phải một danh sách từ khoá.',
      items: ['Hồ sơ nghề nghiệp', 'Kỹ năng theo mức độ', '8 chiều đo cá nhân'],
    },
    {
      icon: Target,
      title: '2. Hiểu công việc',
      body: 'Mỗi nhóm nghề được mô tả bằng kỹ năng cốt lõi và phong cách làm việc mà nó thường đề cao.',
      items: [`${CAREERS.length} nhóm nghề`, 'Kỹ năng cốt lõi & bổ trợ', 'Đặc điểm môi trường'],
    },
    {
      icon: Sparkles,
      title: '3. Tìm sự phù hợp',
      body: 'Ba chỉ số được tính riêng rồi cộng lại theo trọng số. Trọng số này bạn điều chỉnh được.',
      items: ['Hợp nghề', 'Hợp cá nhân', 'Mức tương hợp'],
    },
  ]

  return (
    <section className="border-b border-line bg-card py-16 sm:py-20">
      <div className="container">
        <SectionHeading eyebrow="Cách hoạt động" title="VHuman hoạt động như thế nào?" />

        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {cards.map((card) => (
            <Card key={card.title} ornament className="relative flex flex-col overflow-hidden p-6">
              <WaveMark className="absolute -right-2 -top-1 text-primary/20" size={72} />
              <span className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-on-primary">
                <card.icon className="h-5 w-5" />
              </span>
              <h3 className="text-base font-semibold text-ink">{card.title}</h3>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-ink-soft">{card.body}</p>
              <ul className="mt-4 space-y-1.5 border-t border-line pt-4">
                {card.items.map((item) => (
                  <li key={item} className="flex items-center gap-2 text-sm text-ink-soft">
                    <span className="h-1 w-1 rounded-full bg-accent-500" />
                    {item}
                  </li>
                ))}
              </ul>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */

/**
 * The Tử Vi layer, given its own section on the landing page.
 *
 * It is the part of VHuman with no substitute, so leaving it inside a tab meant
 * a first-time visitor had no idea it existed. The honest framing travels with
 * it: what it gives, and what it does not claim.
 */
function AstrologySection() {
  const outputs = [
    { icon: Sparkles, title: 'Nhóm sao chủ đạo', body: 'Một trong bốn bộ sao, gắn với một kiểu phong cách làm việc.' },
    { icon: CalendarRange, title: 'Đại vận 10 năm', body: 'Chu kỳ lớn đang diễn ra. Dùng để lên kế hoạch dài hạn.' },
    { icon: Target, title: 'Lưu niên từng năm', body: 'Năm đang xét kèm can chi. Dùng cho kế hoạch 12 tháng.' },
  ]

  return (
    <section className="border-b border-line bg-surface-muted py-16 sm:py-20">
      <div className="container">
        <div className="grid items-start gap-12 lg:grid-cols-[1fr_1.05fr]">
          <div>
            <Badge tone="outline" className="mb-5">
              <Sparkles className="h-3 w-3 text-primary" />
              Lớp Tử Vi
            </Badge>
            <h2 className="display text-3xl sm:text-4xl">Lá số, đọc theo hướng nghề nghiệp</h2>
            <RuleMark className="mt-4 text-primary" />
            <p className="mt-5 text-base leading-relaxed text-ink-soft">
              Từ ngày giờ tháng năm sinh, VHuman lập một lá số riêng cho bạn. Chúng tôi không luận
              giải toàn bộ lá số. Chỉ rút ra ba thứ dùng được cho công việc.
            </p>
            <p className="mt-4 text-sm leading-relaxed text-ink-muted">
              Lá số cho bạn biết bối cảnh và nhịp thời gian. Cách bạn phản ứng và thích nghi mới là
              phần quan trọng nhất.
            </p>
            <ButtonLink to="/tu-vi" variant="secondary" size="lg" className="mt-7">
              Xem lớp Tử Vi hoạt động ra sao
              <ArrowRight className="h-4 w-4" />
            </ButtonLink>
          </div>

          <div className="space-y-3">
            {outputs.map((item) => (
              <Card key={item.title} className="relative overflow-hidden border-primary/25 p-5">
                <CornerMark corner="tl" className="absolute left-2.5 top-2.5 text-primary/40" />
                <div className="flex items-start gap-4 pl-4">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary text-on-primary">
                    <item.icon className="h-5 w-5" />
                  </span>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-ink">{item.title}</p>
                    <p className="mt-1 text-sm leading-relaxed text-ink-soft">{item.body}</p>
                  </div>
                </div>
              </Card>
            ))}

            <p className="rounded-xl border border-warning-border bg-warning-subtle/50 p-4 text-xs leading-relaxed text-ink-soft">
              Đây là chỉ số tham khảo về phong cách làm việc, không phải dự báo chắc chắn và không có
              giá trị khẳng định khoa học. Ngày giờ sinh chỉ lưu trên trình duyệt của bạn, nhà tuyển
              dụng không nhìn thấy.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

function ProductMessage() {
  return (
    <section className="border-b border-line bg-brand py-16 text-on-brand sm:py-20">
      <div className="container">
        <div className="mx-auto max-w-3xl text-center">
          <p className="mb-6 text-xs font-semibold uppercase tracking-[0.16em] text-gold">
            Thông điệp sản phẩm
          </p>
          <div className="space-y-4 text-xl font-medium leading-relaxed sm:text-2xl">
            <p className="text-on-brand-muted">CV cho biết một người đã làm gì.</p>
            <p className="text-on-brand-muted">Kỹ năng cho biết họ có thể làm gì.</p>
            <p className="text-on-brand">
              VHuman bổ sung lớp thứ ba: họ có xu hướng hợp với cách làm việc và môi trường nào.
            </p>
          </div>
          <p className="mx-auto mt-8 max-w-xl text-sm leading-relaxed text-on-brand-muted">
            Đây là lớp tham khảo. Không phải kết luận về con người, và không thay thế đánh giá thực tế
            trong tuyển dụng. Cách mỗi người phản ứng và thích nghi mới là điều quan trọng nhất.
          </p>
        </div>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */

function RecruiterSection() {
  const steps = ['Kỹ năng', 'Kinh nghiệm', 'Hồ sơ cá nhân', 'Mức tương hợp']

  return (
    <section className="border-b border-line bg-surface-muted py-16 sm:py-20">
      <div className="container">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div>
            <Badge tone="outline" className="mb-5">
              <BriefcaseBusiness className="h-3 w-3" />
              Dành cho nhà tuyển dụng
            </Badge>
            <h2 className="display text-3xl sm:text-4xl">
              Tìm ứng viên hợp với công việc, và hợp với đội ngũ
            </h2>
            <RuleMark className="mt-4 text-primary" />
            <p className="mt-4 text-base leading-relaxed text-ink-soft">
              Ngoài lọc theo kỹ năng và kinh nghiệm, bạn có thể mô tả mẫu hồ sơ mong muốn. Hoặc so
              sánh trực tiếp với phong cách làm việc của người quản lý.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <ButtonLink to="/recruiter/search" variant="primary" size="lg">
                <Search className="h-4 w-4" />
                Tìm theo Hồ sơ cá nhân
              </ButtonLink>
              <ButtonLink to="/recruiter/compatibility" variant="secondary" size="lg">
                <Sparkles className="h-4 w-4" />
                Tìm theo mức tương hợp
              </ButtonLink>
            </div>
          </div>

          <Card className="p-6 sm:p-8">
            <div className="space-y-2.5">
              {steps.map((step, index) => (
                <div key={step} className="flex items-center gap-3">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-surface-sunken text-xs font-semibold text-ink-soft">
                    {index + 1}
                  </span>
                  <div className="flex-1 rounded-lg border border-line bg-surface-muted px-4 py-2.5 text-sm font-medium text-ink">
                    {step}
                  </div>
                </div>
              ))}
            </div>

            <Arrow />

            <div className="rounded-lg border border-accent-200 bg-accent-50 px-4 py-4 text-center">
              <p className="text-sm font-semibold text-accent-800">Tìm đúng người hơn</p>
              <p className="mt-1 text-xs text-accent-700/80">
                Xếp hạng ứng viên theo mức độ phù hợp tổng thể
              </p>
            </div>
          </Card>
        </div>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */

function Stats() {
  const stats = [
    { value: `${CAREERS.length}`, label: 'Nhóm nghề trong taxonomy' },
    { value: `${SKILLS.length}+`, label: 'Kỹ năng được chuẩn hoá' },
    { value: `${SEED_CANDIDATES.length}`, label: 'Hồ sơ ứng viên mẫu' },
    { value: '8', label: 'Chiều đo Hồ sơ cá nhân' },
  ]

  return (
    <section className="border-b border-line bg-card py-14">
      <div className="container">
        <div className="grid grid-cols-2 gap-6 lg:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label}>
              <p className="text-3xl font-bold tabular-nums text-ink sm:text-4xl">{stat.value}</p>
              <p className="mt-1.5 text-sm text-ink-muted">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */

function FinalCta({ onEnter }: { onEnter: (role: DemoRole) => void }) {
  return (
    <section className="bg-surface-muted py-16 sm:py-20">
      <div className="container">
        <Card className="overflow-hidden">
          <div className="grid md:grid-cols-2">
            <button
              type="button"
              onClick={() => onEnter('candidate')}
              className="group border-b border-line p-8 text-left transition-colors hover:bg-surface-muted md:border-b-0 md:border-r"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary text-on-primary">
                <UserRound className="h-5 w-5" />
              </span>
              <h3 className="mt-5 text-lg font-semibold text-ink">Tôi là ứng viên</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-soft">
                Tạo hồ sơ để biết nghề nào hợp với mình.
              </p>
              <span className="mt-4 link-cta">
                Tiếp tục
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </span>
            </button>

            <button
              type="button"
              onClick={() => onEnter('recruiter')}
              className="group p-8 text-left transition-colors hover:bg-surface-muted"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-accent-600 text-on-accent">
                <Users className="h-5 w-5" />
              </span>
              <h3 className="mt-5 text-lg font-semibold text-ink">Tôi là nhà tuyển dụng</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-soft">
                Tìm người hợp với công việc và hợp với đội ngũ.
              </p>
              <span className="mt-4 link-cta">
                Tiếp tục
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </span>
            </button>
          </div>
        </Card>

        <p className="mt-6 text-center text-sm text-ink-muted">
          Không cần đăng ký.{' '}
          <Link to="/about" className="font-medium text-accent-700 hover:underline">
            Tìm hiểu thêm về VHuman
          </Link>
        </p>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */

function SectionHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string
  title: string
  description?: string
}) {
  return (
    <div className="mx-auto flex max-w-2xl flex-col items-center text-center">
      <p className="eyebrow mb-3">{eyebrow}</p>
      <h2 className="display text-3xl sm:text-4xl">{title}</h2>
      <RuleMark className="mt-4 text-primary" />
      {description ? (
        <p className="mt-4 text-base leading-relaxed text-ink-soft">{description}</p>
      ) : null}
    </div>
  )
}
