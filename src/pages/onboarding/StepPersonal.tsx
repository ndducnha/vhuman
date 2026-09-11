import { Info, ShieldCheck } from 'lucide-react'
import { Checkbox, Field, TextInput, Select, ChoiceGroup } from '@/components/ui/Field'
import { Avatar } from '@/components/ui/Avatar'
import type { CandidateDraft, Gender } from '@/types'
import { GENDER_LABEL } from '@/utils/format'

const CITIES = [
  'Hà Nội',
  'TP. Hồ Chí Minh',
  'Đà Nẵng',
  'Hải Phòng',
  'Cần Thơ',
  'Huế',
  'Nha Trang',
  'Bình Dương',
  'Đồng Nai',
  'Quảng Ninh',
  'Bắc Ninh',
  'Nghệ An',
  'Thanh Hoá',
  'Nam Định',
  'Lạng Sơn',
  'Khác',
]

export function StepPersonal({
  draft,
  onChange,
  errors,
  consent,
  onConsentChange,
}: {
  draft: CandidateDraft
  onChange: (patch: Partial<CandidateDraft['personal']>) => void
  errors: Record<string, string>
  consent: boolean
  onConsentChange: (value: boolean) => void
}) {
  const personal = draft.personal

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4 rounded-xl border border-line bg-surface-muted p-4">
        <Avatar name={personal.fullName || 'VHuman'} size="lg" />
        <div className="min-w-0">
          <p className="text-sm font-medium text-ink">Ảnh đại diện</p>
          <p className="mt-0.5 text-xs leading-relaxed text-ink-muted">
            Ảnh đại diện được tạo tự động từ tên của bạn. Bạn không cần tải ảnh lên.
          </p>
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Họ và tên" required error={errors.fullName} className="sm:col-span-2">
          <TextInput
            value={personal.fullName ?? ''}
            onChange={(event) => onChange({ fullName: event.target.value })}
            placeholder="Ví dụ: Nguyễn Văn A"
            autoComplete="name"
          />
        </Field>

        <Field label="Giới tính" className="sm:col-span-2">
          <ChoiceGroup<Gender>
            options={(['female', 'male', 'other'] as Gender[]).map((value) => ({
              value,
              label: GENDER_LABEL[value],
            }))}
            value={personal.gender ?? 'female'}
            onChange={(value) => onChange({ gender: value })}
          />
        </Field>

        <Field label="Ngày sinh" required error={errors.birthDate}>
          <TextInput
            type="date"
            value={personal.birthDate ?? ''}
            max="2010-12-31"
            min="1950-01-01"
            onChange={(event) => onChange({ birthDate: event.target.value })}
          />
        </Field>

        <Field
          label="Giờ sinh"
          hint="Nếu không nhớ chính xác, bạn để trống cũng được. Chúng tôi sẽ dùng mốc mặc định."
        >
          <TextInput
            type="time"
            value={personal.birthTime ?? ''}
            onChange={(event) => onChange({ birthTime: event.target.value })}
          />
        </Field>

        <Field label="Nơi sinh" required error={errors.birthPlace}>
          <TextInput
            list="birthplace-options"
            value={personal.birthPlace ?? ''}
            onChange={(event) => onChange({ birthPlace: event.target.value })}
            placeholder="Nhập hoặc chọn tỉnh/thành"
          />
          <datalist id="birthplace-options">
            {CITIES.map((city) => (
              <option key={city} value={city} />
            ))}
          </datalist>
        </Field>

        <Field label="Thành phố hiện tại" required error={errors.currentCity}>
          <Select
            value={personal.currentCity ?? ''}
            onChange={(event) => onChange({ currentCity: event.target.value })}
          >
            <option value="">Chọn thành phố</option>
            {CITIES.map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </Select>
        </Field>

        <Field label="Email" error={errors.email}>
          <TextInput
            type="email"
            value={personal.email ?? ''}
            onChange={(event) => onChange({ email: event.target.value })}
            placeholder="ban@email.com"
            autoComplete="email"
          />
        </Field>

        <Field label="Điện thoại">
          <TextInput
            type="tel"
            value={personal.phone ?? ''}
            onChange={(event) => onChange({ phone: event.target.value })}
            placeholder="09xx xxx xxx"
            autoComplete="tel"
          />
        </Field>
      </div>

      <div className="flex gap-3 rounded-xl border border-accent-200 bg-accent-50/60 p-4">
        <Info className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
        <p className="text-xs leading-relaxed text-ink-soft">
          Ngày giờ sinh dùng để dựng hồ sơ cá nhân của bạn. Ở bản thử nghiệm này, dữ liệu chỉ nằm
          trên trình duyệt của bạn.
        </p>
      </div>

      {/* PDPA consent: the wizard cannot advance without it. */}
      <div
        className={
          errors.consent
            ? 'rounded-xl border border-danger-border bg-danger-subtle/50 p-4'
            : 'rounded-xl border border-line bg-surface-sunken p-4'
        }
      >
        <div className="flex gap-3">
          <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
          <div className="min-w-0">
            <p className="text-sm font-semibold text-ink">Đồng ý sử dụng dữ liệu</p>
            <p className="mt-1 text-xs leading-relaxed text-ink-muted">
              Ngày giờ sinh là dữ liệu cá nhân nhạy cảm theo quy định bảo vệ dữ liệu cá nhân tại Việt
              Nam. Chúng tôi chỉ dùng thông tin này để dựng hồ sơ vận trình riêng tư của bạn. Không
              hiển thị cho nhà tuyển dụng. Không chia sẻ với bên thứ ba. Bản xuất hồ sơ cũng không
              kèm ngày giờ sinh.
            </p>
            <Checkbox
              className="mt-3"
              checked={consent}
              onChange={onConsentChange}
              label="Tôi đồng ý dùng dữ liệu ngày giờ sinh để cá nhân hoá gợi ý nghề nghiệp."
            />
            {errors.consent ? (
              <p className="mt-2 text-xs text-danger-fg">{errors.consent}</p>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  )
}
