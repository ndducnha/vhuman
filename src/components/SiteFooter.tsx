import { Link } from 'react-router-dom'
import { Logo } from '@/components/Logo'
import { ShieldCheck } from 'lucide-react'

export function SiteFooter() {
  return (
    <footer className="border-t border-line bg-card">
      <div className="container py-10">
        <div className="flex flex-col gap-8 md:flex-row md:justify-between">
          <div className="max-w-sm">
            <Logo />
            <p className="mt-3 text-sm leading-relaxed text-ink-muted">
              Nền tảng hiểu năng lực con người, kết hợp CV, kỹ năng và hồ sơ cá nhân để hỗ trợ khám phá
              nghề nghiệp và tuyển dụng phù hợp hơn.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
            <FooterColumn
              title="Sản phẩm"
              links={[
                { to: '/candidate/onboarding', label: 'Tạo hồ sơ' },
                { to: '/viec-lam', label: 'Việc làm' },
                { to: '/candidate/lo-trinh', label: 'Lộ trình' },
                { to: '/candidate/careers', label: 'Khám phá nghề nghiệp' },
                { to: '/tu-vi', label: 'Lớp Tử Vi' },
                { to: '/dung-thu', label: 'Dùng thử nhanh' },
                { to: '/recruiter/search', label: 'Tìm ứng viên' },
                { to: '/recruiter/compatibility', label: 'Mức tương hợp' },
              ]}
            />
            <FooterColumn
              title="Công ty"
              links={[
                { to: '/about', label: 'Về VHuman' },
                { to: '/choose-role', label: 'Trải nghiệm demo' },
              ]}
            />
            <FooterColumn
              title="Dành cho nhà tuyển dụng"
              links={[
                { to: '/recruiter', label: 'Tổng quan' },
                { to: '/recruiter/saved', label: 'Ứng viên đã lưu' },
                { to: '/recruiter/applications', label: 'Đơn ứng tuyển' },
                { to: '/recruiter/settings', label: 'Cài đặt' },
              ]}
            />
          </div>
        </div>

        <div className="mt-9 rounded-xl border border-line bg-surface-muted p-4">
          <div className="flex gap-3">
            <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-ink-faint" />
            <p className="text-xs leading-relaxed text-ink-muted">
              VHuman là công cụ tham khảo, dùng để hỗ trợ bạn khám phá bản thân và định hướng nghề
              nghiệp. Kết quả ở đây không nên là căn cứ duy nhất cho một quyết định tuyển dụng, giáo
              dục hay nghề nghiệp.
            </p>
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-2 text-xs text-ink-faint sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} VHuman. Phiên bản demo MVP.</p>
          <p>Toàn bộ dữ liệu trong bản demo được lưu trên trình duyệt của bạn.</p>
        </div>
      </div>
    </footer>
  )
}

function FooterColumn({ title, links }: { title: string; links: Array<{ to: string; label: string }> }) {
  return (
    <div>
      <h4 className="mb-3 text-sm font-semibold text-ink">{title}</h4>
      <ul className="space-y-2">
        {links.map((link) => (
          <li key={link.to}>
            <Link to={link.to} className="inline-flex min-h-[40px] items-center text-sm link-quiet sm:min-h-0">
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
