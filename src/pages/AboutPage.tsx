import { Link } from 'react-router-dom'
import { ArrowRight, Code2, Layers, Lock, ShieldCheck, Sparkles } from 'lucide-react'
import { Card, CardBody, CardHeader } from '@/components/ui/Card'
import { ButtonLink } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { matchingConfig } from '@/services/matching'
import { astrologyEngine } from '@/services/astrology'
import { CAREERS } from '@/data/careers'
import { SKILLS } from '@/data/skills'
import { SEED_CANDIDATES } from '@/data/candidates'

export function AboutPage() {
  return (
    <div className="container max-w-4xl py-14">
      <Badge tone="outline" className="mb-5">
        Về VHuman
      </Badge>
      <h1 className="text-3xl font-bold tracking-tight text-ink sm:text-4xl">
        Một lớp hiểu con người, đặt cạnh CV và kỹ năng
      </h1>
      <p className="mt-5 text-base leading-relaxed text-ink-soft">
        VHuman là nền tảng định hướng nghề nghiệp và hỗ trợ tuyển dụng. Sản phẩm kết hợp ba nguồn tín
        hiệu: hồ sơ nghề nghiệp, kỹ năng, và một lớp phản chiếu cá nhân. Mục đích là giúp bạn tìm
        đúng hướng đi, và giúp doanh nghiệp nhìn ứng viên ở nhiều chiều hơn một danh sách từ khoá.
      </p>

      <div className="mt-10 space-y-5">
        <Card>
          <CardHeader
            icon={<Layers className="h-4 w-4" />}
            title="Hồ sơ cá nhân là gì?"
            description="Lớp phản chiếu cá nhân riêng tư"
          />
          <CardBody className="space-y-3 text-sm leading-relaxed text-ink-soft">
            <p>
              Hồ sơ cá nhân là một mô tả xu hướng cá nhân theo tám chiều đo: tư duy phân tích, sáng
              tạo, lãnh đạo, giao tiếp, độc lập, làm việc nhóm, chấp nhận rủi ro và ổn định.
            </p>
            <p>
              Đây là công cụ để bạn tự đối chiếu với trải nghiệm thật của mình. Không phải kết luận
              về con người, và không dự đoán kết quả công việc. Mọi diễn đạt trong sản phẩm đều ở
              dạng <em>xu hướng</em> và <em>mức độ phù hợp</em>.
            </p>
          </CardBody>
        </Card>

        <Card className="border-primary/25">
          <CardHeader
            icon={<Sparkles className="h-4 w-4" />}
            title="Lớp Tử Vi"
            description="Phần khác biệt của VHuman"
          />
          <CardBody className="space-y-3 text-sm leading-relaxed text-ink-soft">
            <p>
              Từ ngày giờ tháng năm sinh, VHuman lập một lá số riêng. Từ lá số đó chúng tôi rút ra
              nhóm sao chủ đạo, đại vận 10 năm đang diễn ra, và lưu niên của năm nay.
            </p>
            <p>
              Chúng tôi không luận giải toàn bộ lá số, chỉ lấy phần dùng được cho hướng nghiệp. Lá
              số cho biết bối cảnh và nhịp thời gian. Cách bạn phản ứng và thích nghi mới là phần
              quan trọng nhất.
            </p>
            <Link to="/tu-vi" className="link-cta">
              Xem lớp Tử Vi hoạt động ra sao
              <ArrowRight className="h-4 w-4" />
            </Link>
          </CardBody>
        </Card>

        <Card>
          <CardHeader
            icon={<Code2 className="h-4 w-4" />}
            title="Cách tính điểm trong bản demo"
            description="Toàn bộ trọng số nằm trong matchingConfig"
          />
          <CardBody className="space-y-4">
            <FormulaBlock
              title="Khớp nhóm nghề"
              parts={[
                ['Khớp kỹ năng', matchingConfig.careerMatch.skills],
                ['Khớp kinh nghiệm', matchingConfig.careerMatch.experience],
                ['Hồ sơ cá nhân', matchingConfig.careerMatch.profile],
              ]}
            />
            <FormulaBlock
              title="Tìm theo mức tương hợp"
              parts={[
                ['Khớp kỹ năng', matchingConfig.compatibilitySearch.skills],
                ['Khớp nhóm nghề', matchingConfig.compatibilitySearch.career],
                ['Mức tương hợp', matchingConfig.compatibilitySearch.compatibility],
              ]}
            />
            <p className="text-xs leading-relaxed text-ink-muted">
              Engine hiện tại: <code className="rounded bg-surface-sunken px-1.5 py-0.5">{astrologyEngine.name}</code>{' '}
              v{astrologyEngine.version}. Kết quả mang tính tất định: cùng một ngày giờ sinh luôn cho
              cùng một hồ sơ.
            </p>
          </CardBody>
        </Card>

        <Card>
          <CardHeader
            icon={<Lock className="h-4 w-4" />}
            title="Quyền riêng tư"
            description="Dữ liệu không rời khỏi trình duyệt"
          />
          <CardBody className="space-y-3 text-sm leading-relaxed text-ink-soft">
            <p>
              Ngày giờ sinh là dữ liệu cá nhân. Trong phiên bản demo này, toàn bộ thông tin bạn nhập
              được lưu bằng <code className="rounded bg-surface-sunken px-1.5 py-0.5">localStorage</code> trên chính
              trình duyệt của bạn. Không có máy chủ, không có cơ sở dữ liệu, không có lệnh gọi API nào
              được thực hiện.
            </p>
            <p>
              Bạn có thể xoá toàn bộ dữ liệu bất cứ lúc nào bằng nút “Đặt lại dữ liệu demo” trong phần
              Cài đặt.
            </p>
          </CardBody>
        </Card>

        <Card>
          <CardHeader
            icon={<ShieldCheck className="h-4 w-4" />}
            title="Phạm vi của bản demo"
            description="Những gì đang là dữ liệu mẫu"
          />
          <CardBody>
            <ul className="space-y-2.5 text-sm text-ink-soft">
              <li className="flex gap-2.5">
                <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-accent-500" />
                {SEED_CANDIDATES.length} hồ sơ ứng viên là nhân vật hư cấu, được tạo cho mục đích minh hoạ.
              </li>
              <li className="flex gap-2.5">
                <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-accent-500" />
                {CAREERS.length} nhóm nghề và {SKILLS.length} kỹ năng là dữ liệu tham chiếu tĩnh.
              </li>
              <li className="flex gap-2.5">
                <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-accent-500" />
                Lớp phản chiếu cá nhân hiện dùng engine mô phỏng tất định, chưa phải thuật toán đầy đủ.
              </li>
            </ul>
          </CardBody>
        </Card>
      </div>

      <div className="mt-10 rounded-xl border border-line bg-card p-6 text-center">
        <p className="text-sm text-ink-soft">Sẵn sàng thử?</p>
        <div className="mt-4 flex flex-col justify-center gap-3 sm:flex-row">
          <ButtonLink to="/candidate/onboarding" variant="primary">
            Tạo hồ sơ của tôi
            <ArrowRight className="h-4 w-4" />
          </ButtonLink>
          <ButtonLink to="/recruiter/search" variant="secondary">
            Tìm ứng viên
          </ButtonLink>
        </div>
        <p className="mt-4 text-xs text-ink-muted">
          Hoặc quay lại{' '}
          <Link to="/" className="font-medium text-accent-700 hover:underline">
            trang chủ
          </Link>
          .
        </p>
      </div>
    </div>
  )
}

function FormulaBlock({ title, parts }: { title: string; parts: Array<[string, number]> }) {
  return (
    <div className="rounded-lg border border-line bg-surface-muted p-4">
      <p className="mb-3 text-sm font-semibold text-ink">{title}</p>
      <div className="space-y-1.5">
        {parts.map(([label, weight], index) => (
          <div key={label} className="flex items-center gap-2 text-sm text-ink-soft">
            <span className="w-4 text-ink-faint">{index === 0 ? '' : '+'}</span>
            <span className="flex-1">{label}</span>
            <span className="font-semibold tabular-nums text-ink">× {Math.round(weight * 100)}%</span>
          </div>
        ))}
      </div>
    </div>
  )
}
