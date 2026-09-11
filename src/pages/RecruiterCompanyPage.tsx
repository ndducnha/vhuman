import { useMemo } from 'react'
import { Building2, Globe, MapPin, Sparkles, Users } from 'lucide-react'
import { PageHeader } from '@/components/ui/PageHeader'
import { Card, CardBody, CardHeader } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { TraitBar } from '@/components/ui/TraitBar'
import { TraitRadar } from '@/components/TraitRadar'
import { EmptyState } from '@/components/ui/EmptyState'
import { ButtonLink } from '@/components/ui/Button'
import { DEMO_RECRUITER } from '@/data/recruiters'
import { useDemoSession } from '@/hooks/demoSessionContext'
import { JOB_POSTINGS } from '@/data/jobs'
import { TRAIT_LABEL, TRAIT_ORDER, MANAGER_ROLE_LABEL } from '@/utils/format'
import type { TraitScores } from '@/types'

const COMPANY = {
  name: DEMO_RECRUITER.company,
  industry: 'Công nghệ · AI & Dữ liệu',
  size: '120-250 nhân sự',
  location: 'Hà Nội, Việt Nam',
  website: 'zentra.demo',
  about:
    'Zentra Technology là công ty công nghệ hư cấu được dựng lên cho bản demo VHuman. Đội ngũ tập trung vào các sản phẩm dữ liệu và AI cho doanh nghiệp tại Việt Nam.',
  values: ['Tự chủ trong công việc', 'Ưu tiên dữ liệu', 'Học liên tục', 'Trao đổi thẳng thắn'],
}

/**
 * Company profile. The "team culture profile" is derived by averaging the
 * personal profiles of the manager records the recruiter has created: the same
 * engine, applied at team level.
 */
export function RecruiterCompanyPage() {
  const { managers } = useDemoSession()

  const teamProfile = useMemo<TraitScores | null>(() => {
    const withProfiles = managers.filter((manager) => manager.astrology)
    if (withProfiles.length === 0) return null

    const sum = TRAIT_ORDER.reduce((acc, trait) => {
      acc[trait] = 0
      return acc
    }, {} as TraitScores)

    for (const manager of withProfiles) {
      for (const trait of TRAIT_ORDER) {
        sum[trait] += manager.astrology!.traits[trait]
      }
    }
    for (const trait of TRAIT_ORDER) {
      sum[trait] = Math.round(sum[trait] / withProfiles.length)
    }
    return sum
  }, [managers])

  const openJobs = JOB_POSTINGS.filter((job) => job.status === 'open').length

  return (
    <div className="max-w-4xl space-y-6">
      <PageHeader eyebrow="Nhà tuyển dụng" title="Công ty" description="Hồ sơ doanh nghiệp trong bản demo." />

      <Card>
        <CardBody>
          <div className="flex items-start gap-4">
            <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-primary text-xl font-bold text-on-primary">
              Z
            </span>
            <div className="min-w-0">
              <h2 className="text-xl font-bold text-ink">{COMPANY.name}</h2>
              <p className="mt-0.5 text-sm text-ink-soft">{COMPANY.industry}</p>
              <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-sm text-ink-muted">
                <span className="inline-flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5" />
                  {COMPANY.location}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Users className="h-3.5 w-3.5" />
                  {COMPANY.size}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Globe className="h-3.5 w-3.5" />
                  {COMPANY.website}
                </span>
              </div>
            </div>
          </div>

          <p className="mt-5 border-t border-line pt-5 text-sm leading-relaxed text-ink-soft">
            {COMPANY.about}
          </p>

          <div className="mt-4 flex flex-wrap gap-2">
            {COMPANY.values.map((value) => (
              <Badge key={value} tone="neutral">
                {value}
              </Badge>
            ))}
          </div>

          <div className="mt-5 grid gap-3 border-t border-line pt-5 sm:grid-cols-3">
            <Metric icon={<Building2 className="h-4 w-4" />} label="Vị trí đang tuyển" value={openJobs} />
            <Metric icon={<Users className="h-4 w-4" />} label="Hồ sơ quản lý" value={managers.length} />
            <Metric icon={<Sparkles className="h-4 w-4" />} label="Chiều đo văn hoá" value={8} />
          </div>
        </CardBody>
      </Card>

      <Card>
        <CardHeader
          icon={<Sparkles className="h-4 w-4" />}
          title="Hồ sơ phong cách đội ngũ"
          description="Trung bình các hồ sơ người quản lý đã tạo. Dùng làm mốc tham khảo khi đánh giá mức độ phù hợp về môi trường."
        />
        <CardBody>
          {!teamProfile ? (
            <EmptyState
              title="Chưa có hồ sơ quản lý"
              description="Tạo ít nhất một hồ sơ người quản lý để xem hồ sơ phong cách đội ngũ."
              action={
                <ButtonLink to="/recruiter/compatibility" variant="primary">
                  Tạo hồ sơ người quản lý
                </ButtonLink>
              }
            />
          ) : (
            <div className="grid gap-6 lg:grid-cols-2">
              <div className="space-y-3">
                {TRAIT_ORDER.map((trait) => (
                  <TraitBar key={trait} label={TRAIT_LABEL[trait]} value={teamProfile[trait]} tone="neutral" />
                ))}
              </div>
              <div className="flex items-center justify-center">
                <TraitRadar traits={teamProfile} height={300} />
              </div>
            </div>
          )}

          {teamProfile ? (
            <div className="mt-5 border-t border-line pt-5">
              <p className="mb-2.5 text-sm font-medium text-ink">Hồ sơ được tính từ</p>
              <div className="flex flex-wrap gap-1.5">
                {managers.map((manager) => (
                  <Badge key={manager.id} tone="outline">
                    {manager.fullName} · {MANAGER_ROLE_LABEL[manager.role]}
                  </Badge>
                ))}
              </div>
            </div>
          ) : null}
        </CardBody>
      </Card>
    </div>
  )
}

function Metric({ icon, label, value }: { icon: React.ReactNode; label: string; value: number }) {
  return (
    <div className="rounded-lg border border-line bg-surface-muted p-3.5">
      <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-card text-ink-soft">
        {icon}
      </span>
      <p className="mt-2.5 text-xl font-bold tabular-nums text-ink">{value}</p>
      <p className="text-xs text-ink-muted">{label}</p>
    </div>
  )
}
