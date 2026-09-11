import { PageHeader } from '@/components/ui/PageHeader'
import { Card, CardBody, CardHeader } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { ResetDemoButton } from '@/components/ResetDemoButton'
import { Avatar } from '@/components/ui/Avatar'
import { DEMO_RECRUITER } from '@/data/recruiters'
import { useDemoSession } from '@/hooks/demoSessionContext'
import { astrologyEngine } from '@/services/astrology'
import { matchingConfig } from '@/services/matching'
import { MANAGER_ROLE_LABEL, formatDateVi } from '@/utils/format'
import { Building2, Database, FileUser, Trash2, UserCog, Wand2 } from 'lucide-react'

export function RecruiterSettingsPage() {
  const {
    managers,
    removeManager,
    activeManagerId,
    setActiveManagerId,
    savedIds,
    candidate,
    isSampleProfile,
    startBlankProfile,
    loadDemoData,
  } = useDemoSession()

  return (
    <div className="max-w-3xl space-y-6">
      <PageHeader
        eyebrow="Nhà tuyển dụng"
        title="Cài đặt"
        description="Quản lý hồ sơ demo, dữ liệu cục bộ và thông tin về engine đang sử dụng."
      />

      <Card>
        <CardHeader icon={<Building2 className="h-4 w-4" />} title="Tài khoản demo" />
        <CardBody>
          <div className="flex items-center gap-4">
            <Avatar name={DEMO_RECRUITER.fullName} size="lg" />
            <div className="min-w-0">
              <p className="text-sm font-semibold text-ink">{DEMO_RECRUITER.fullName}</p>
              <p className="text-sm text-ink-soft">
                {DEMO_RECRUITER.title} · {DEMO_RECRUITER.company}
              </p>
              <p className="mt-0.5 text-xs text-ink-muted">{DEMO_RECRUITER.email}</p>
            </div>
          </div>
          <p className="mt-4 rounded-lg border border-line bg-surface-muted p-3 text-xs leading-relaxed text-ink-muted">
            Bản demo không có xác thực thật. Tài khoản này là dữ liệu mẫu cố định.
          </p>
        </CardBody>
      </Card>

      <Card>
        <CardHeader
          icon={<UserCog className="h-4 w-4" />}
          title="Hồ sơ người quản lý"
          description="Dùng cho Tìm theo mức tương hợp."
        />
        <CardBody className="space-y-3">
          {managers.length === 0 ? (
            <p className="text-sm text-ink-muted">Chưa có hồ sơ nào.</p>
          ) : (
            managers.map((manager) => (
              <div
                key={manager.id}
                className="flex items-center gap-3 rounded-lg border border-line p-3"
              >
                <Avatar name={manager.fullName} size="sm" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-ink">{manager.fullName}</p>
                  <p className="truncate text-xs text-ink-muted">
                    {MANAGER_ROLE_LABEL[manager.role]} · {manager.company} ·{' '}
                    {formatDateVi(manager.birthDate)}
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  {manager.id === activeManagerId ? (
                    <Badge tone="accent">Đang dùng</Badge>
                  ) : (
                    <Button variant="ghost" size="sm" onClick={() => setActiveManagerId(manager.id)}>
                      Chọn
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    aria-label={`Xoá hồ sơ ${manager.fullName}`}
                    onClick={() => removeManager(manager.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))
          )}
        </CardBody>
      </Card>

      <Card>
        <CardHeader
          icon={<Wand2 className="h-4 w-4" />}
          title="Chế độ demo"
          description="Chuyển nhanh giữa trạng thái đầy dữ liệu và trạng thái trống."
        />
        <CardBody className="space-y-4">
          <div className="flex items-start gap-3 rounded-lg border border-line bg-surface-muted p-3.5">
            <FileUser className="mt-0.5 h-4 w-4 shrink-0 text-ink-faint" />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-ink">
                {candidate
                  ? `Hồ sơ ứng viên: ${candidate.personal.fullName}`
                  : 'Chưa có hồ sơ ứng viên'}
              </p>
              <p className="mt-0.5 text-sm text-ink-muted">
                {candidate
                  ? isSampleProfile
                    ? 'Đang dùng hồ sơ mẫu được nạp sẵn.'
                    : 'Hồ sơ do bạn tự tạo.'
                  : 'Trạng thái trống. Phù hợp để demo luồng tạo hồ sơ từ đầu.'}
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row">
            <Button variant="secondary" size="sm" block onClick={loadDemoData}>
              <Wand2 className="h-4 w-4" />
              Nạp lại dữ liệu demo đầy đủ
            </Button>
            <Button variant="secondary" size="sm" block onClick={startBlankProfile} disabled={!candidate}>
              <FileUser className="h-4 w-4" />
              Bắt đầu với hồ sơ trống
            </Button>
          </div>
          <p className="text-xs leading-relaxed text-ink-muted">
            “Nạp lại dữ liệu demo” khôi phục hồ sơ ứng viên mẫu, danh sách ứng viên đã lưu và hồ sơ
            người quản lý. “Bắt đầu với hồ sơ trống” xoá hồ sơ ứng viên để bạn demo luồng onboarding
            5 bước.
          </p>
        </CardBody>
      </Card>

      <Card>
        <CardHeader
          icon={<Database className="h-4 w-4" />}
          title="Dữ liệu demo"
          description="Toàn bộ dữ liệu được lưu bằng localStorage trên trình duyệt này."
        />
        <CardBody className="space-y-4">
          <dl className="grid gap-3 sm:grid-cols-2">
            <DataRow label="Ứng viên đã lưu" value={String(savedIds.length)} />
            <DataRow label="Hồ sơ người quản lý" value={String(managers.length)} />
            <DataRow label="Engine hồ sơ cá nhân" value={`${astrologyEngine.name} v${astrologyEngine.version}`} />
            <DataRow
              label="Trọng số khớp nhóm nghề"
              value={`${Math.round(matchingConfig.careerMatch.skills * 100)}/${Math.round(
                matchingConfig.careerMatch.experience * 100,
              )}/${Math.round(matchingConfig.careerMatch.profile * 100)}`}
            />
          </dl>

          <div className="border-t border-line pt-4">
            <p className="mb-3 text-sm text-ink-soft">
              Xoá toàn bộ dữ liệu demo và nạp lại dữ liệu mẫu ban đầu.
            </p>
            <ResetDemoButton variant="danger" />
          </div>
        </CardBody>
      </Card>
    </div>
  )
}

function DataRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-line bg-surface-muted p-3">
      <dt className="text-xs text-ink-muted">{label}</dt>
      <dd className="mt-0.5 truncate text-sm font-medium text-ink">{value}</dd>
    </div>
  )
}
