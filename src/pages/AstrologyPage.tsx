import { Link } from 'react-router-dom'
import {
  ArrowRight,
  CalendarRange,
  Compass,
  Lock,
  Sparkles,
  Target,
} from 'lucide-react'
import { Card, CardBody, CardHeader } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { ButtonLink } from '@/components/ui/Button'
import { SkillTag } from '@/components/ui/SkillTag'
import { CornerMark, RuleMark, WaveMark } from '@/components/ui/Ornament'
import { STAR_GROUPS } from '@/data/starGroups'
import { CAREER_FIELD_LABEL } from '@/utils/format'
import { canChiOfYear } from '@/utils/canChi'

/**
 * The Tử Vi layer, explained.
 *
 * Everything the engine derives is shown here in the open: the four star
 * groupings, what a đại vận and a lưu niên are, and what the layer does not
 * claim. Naming the method plainly is more honest than hiding it behind a
 * neutral label, and it is the part of VHuman that has no substitute.
 */
export function AstrologyPage() {
  const year = new Date().getFullYear()

  return (
    <div className="container max-w-5xl space-y-12 py-12">
      {/* Intro */}
      <header>
        <Badge tone="outline" className="mb-5">
          <Sparkles className="h-3 w-3 text-primary" />
          Lớp Tử Vi
        </Badge>
        <h1 className="display text-3xl sm:text-4xl">Tử Vi trong VHuman là gì</h1>
        <RuleMark className="mt-4 text-primary" />
        <div className="mt-6 max-w-3xl space-y-4 text-base leading-relaxed text-ink-soft">
          <p>
            Từ ngày giờ tháng năm sinh, VHuman lập một lá số riêng cho bạn. Từ lá số đó, chúng tôi
            rút ra ba thứ dùng được cho nghề nghiệp: <strong className="text-ink">nhóm sao chủ đạo</strong>,{' '}
            <strong className="text-ink">đại vận</strong> đang diễn ra, và{' '}
            <strong className="text-ink">lưu niên</strong> của năm nay.
          </p>
          <p>
            Đây không phải phần thay thế cho CV và kỹ năng. Đây là lớp thứ ba, đặt cạnh hai lớp kia
            để bạn nhìn mình đầy đủ hơn.
          </p>
        </div>
      </header>

      {/* Three outputs */}
      <section>
        <h2 className="display text-2xl">Lá số cho ra những gì</h2>
        <RuleMark className="mt-3 text-primary" />
        <div className="mt-6 grid gap-5 md:grid-cols-3">
          <OutputCard
            icon={<Sparkles className="h-5 w-5" />}
            title="Nhóm sao chủ đạo"
            body="Một trong bốn bộ sao. Mỗi bộ gắn với một kiểu phong cách làm việc và một nhóm nghề thường hợp."
            example="Ví dụ: Sát - Phá - Tham"
          />
          <OutputCard
            icon={<CalendarRange className="h-5 w-5" />}
            title="Đại vận 10 năm"
            body="Chu kỳ lớn bạn đang ở trong. Dùng để lên kế hoạch dài hạn: khi nào nên mở rộng, khi nào nên đi sâu."
            example={`Ví dụ: Đại Vận ${year - 1}-${year + 8}`}
          />
          <OutputCard
            icon={<Target className="h-5 w-5" />}
            title="Lưu niên từng năm"
            body="Năm đang xét, kèm can chi. Dùng để lên kế hoạch ngắn hạn cho 12 tháng tới."
            example={`Ví dụ: Lưu Niên ${year}, năm ${canChiOfYear(year)}`}
          />
        </div>
      </section>

      {/* The four star groups */}
      <section>
        <h2 className="display text-2xl">Bốn nhóm sao</h2>
        <RuleMark className="mt-3 text-primary" />
        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-ink-soft">
          Mỗi lá số rơi vào một trong bốn bộ dưới đây. Bộ sao không quyết định bạn làm nghề gì. Nó
          mô tả xu hướng, để bạn tự đối chiếu với trải nghiệm thật của mình.
        </p>

        <div className="mt-6 grid gap-5 md:grid-cols-2">
          {STAR_GROUPS.map((group) => (
            <Card key={group.id} className="relative overflow-hidden border-primary/25">
              <CornerMark corner="tl" className="absolute left-3 top-3 text-primary/40" />
              <WaveMark className="absolute -right-3 -top-2 text-primary/20" size={78} />
              <CardBody className="pt-6">
                <h3 className="font-display text-xl font-extrabold uppercase text-crimson">
                  {group.name}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-ink-soft">{group.description}</p>

                <div className="mt-5 space-y-3 border-t border-line pt-4">
                  <Row label="Thiên hướng" items={group.careerArchetypes} />
                  <Row label="Kỹ năng nên làm nổi bật" items={group.skillsToHighlight} />
                </div>

                <div className="mt-4 flex flex-wrap gap-1.5">
                  {group.affinityFields.map((field) => (
                    <Badge key={field} tone="accent">
                      {CAREER_FIELD_LABEL[field]}
                    </Badge>
                  ))}
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      </section>

      {/* How it enters the scoring */}
      <section>
        <h2 className="display text-2xl">Lá số ảnh hưởng tới gợi ý nghề ra sao</h2>
        <RuleMark className="mt-3 text-primary" />
        <div className="mt-6 grid gap-5 lg:grid-cols-[1.3fr_1fr]">
          <Card>
            <CardHeader icon={<Compass className="h-4 w-4" />} title="Ảnh hưởng có giới hạn, cố ý" />
            <CardBody className="space-y-4 text-sm leading-relaxed text-ink-soft">
              <p>
                Điểm phù hợp nghề nghiệp được tính từ ba phần: kỹ năng, kinh nghiệm, và hồ sơ cá
                nhân. Lá số nằm trong phần thứ ba.
              </p>
              <p>
                Ngoài ra, khi lĩnh vực của một nhóm nghề trùng với thiên hướng của bộ sao, nghề đó
                được cộng thêm <strong className="text-ink">4 điểm</strong>. Con số này nhỏ, và nhỏ
                có chủ đích. Bằng chứng từ CV và kỹ năng vẫn là phần quyết định.
              </p>
              <p className="rounded-lg border border-line bg-surface-sunken p-3.5">
                Cùng một ngày giờ sinh luôn cho cùng một lá số. Kết quả không đổi giữa các lần xem,
                cũng không đổi giữa các thiết bị.
              </p>
            </CardBody>
          </Card>

          <Card className="border-warning-border bg-warning-subtle/40">
            <CardHeader title="Những điều lớp này không làm" />
            <CardBody>
              <ul className="space-y-3 text-sm leading-relaxed text-ink-soft">
                {[
                  'Không khẳng định bạn chắc chắn hợp hay không hợp một nghề nào.',
                  'Không dự báo thu nhập, thành công hay kết quả công việc.',
                  'Không dùng để loại ứng viên. Nhà tuyển dụng không nhìn thấy ngày giờ sinh của bạn.',
                  'Không có giá trị khẳng định khoa học.',
                ].map((item) => (
                  <li key={item} className="flex gap-2.5">
                    <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-warning-solid" />
                    {item}
                  </li>
                ))}
              </ul>
            </CardBody>
          </Card>
        </div>
      </section>

      {/* Privacy */}
      <section>
        <Card className="border-primary/25">
          <CardHeader
            icon={<Lock className="h-4 w-4" />}
            title="Ngày giờ sinh của bạn đi tới đâu"
            description="Câu trả lời ngắn: không đi đâu cả."
          />
          <CardBody className="grid gap-4 sm:grid-cols-3">
            {[
              ['Lưu ở đâu', 'Trên trình duyệt của bạn. Không có máy chủ nào nhận dữ liệu này.'],
              ['Ai nhìn thấy', 'Chỉ mình bạn. Màn hình nhà tuyển dụng không hiển thị ngày giờ sinh.'],
              ['Khi xuất hồ sơ', 'Bản xuất chỉ mang kết quả đã suy ra, không kèm ngày giờ sinh.'],
            ].map(([title, body]) => (
              <div key={title} className="rounded-lg border border-line bg-surface-sunken p-4">
                <p className="text-sm font-semibold text-ink">{title}</p>
                <p className="mt-1.5 text-sm leading-relaxed text-ink-soft">{body}</p>
              </div>
            ))}
          </CardBody>
        </Card>
      </section>

      {/* Closing + CTA */}
      <section className="rounded-2xl border border-line bg-brand px-6 py-10 text-center text-on-brand sm:px-10">
        <p className="mx-auto max-w-2xl text-lg font-medium leading-relaxed sm:text-xl">
          Lá số cho bạn biết bối cảnh và nhịp thời gian. Cách bạn phản ứng và thích nghi mới là phần
          quan trọng nhất.
        </p>
        <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
          <ButtonLink to="/candidate/onboarding" variant="crimson" size="lg">
            Lập lá số của tôi
            <ArrowRight className="h-4 w-4" />
          </ButtonLink>
          <ButtonLink to="/about" variant="secondary" size="lg" className="!border-on-brand/35 !text-on-brand">
            Về VHuman
          </ButtonLink>
        </div>
        <p className="mt-5 text-xs text-on-brand-muted">
          Không cần đăng ký.{' '}
          <Link to="/candidate/careers" className="underline">
            Hoặc xem trước 34 nhóm nghề
          </Link>
          .
        </p>
      </section>
    </div>
  )
}

function OutputCard({
  icon,
  title,
  body,
  example,
}: {
  icon: React.ReactNode
  title: string
  body: string
  example: string
}) {
  return (
    <Card ornament className="relative flex flex-col overflow-hidden p-6">
      <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-on-primary">
        {icon}
      </span>
      <h3 className="mt-4 text-base font-semibold text-ink">{title}</h3>
      <p className="mt-2 flex-1 text-sm leading-relaxed text-ink-soft">{body}</p>
      <p className="mt-4 border-t border-line pt-3 text-xs font-medium text-primary">{example}</p>
    </Card>
  )
}

function Row({ label, items }: { label: string; items: string[] }) {
  return (
    <div>
      <p className="mb-2 text-xs font-medium text-ink-muted">{label}</p>
      <div className="flex flex-wrap gap-1.5">
        {items.map((item) => (
          <SkillTag key={item} name={item} />
        ))}
      </div>
    </div>
  )
}
