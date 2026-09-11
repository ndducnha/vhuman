import { useState } from 'react'
import { Search, UserCog } from 'lucide-react'
import { Card, CardBody, CardHeader } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { ChoiceGroup, Field, TextInput, Select } from '@/components/ui/Field'
import { astrologyEngine } from '@/services/astrology'
import { MANAGER_ROLE_LABEL, GENDER_LABEL } from '@/utils/format'
import type { Gender, ManagerProfile, ManagerRole } from '@/types'

const ROLES: ManagerRole[] = ['owner', 'ceo', 'direct_manager', 'team_lead']

const CITIES = [
  'Hà Nội',
  'TP. Hồ Chí Minh',
  'Đà Nẵng',
  'Hải Phòng',
  'Cần Thơ',
  'Huế',
  'Nha Trang',
  'Khác',
]

/**
 * Creates the "reference person" whose working style candidates are compared
 * against. The profile is derived by the same engine that builds candidate
 * profiles, so the two are directly comparable.
 */
export function ManagerProfileForm({
  onSubmit,
  defaultCompany,
}: {
  onSubmit: (profile: ManagerProfile) => void
  defaultCompany: string
}) {
  const [fullName, setFullName] = useState('')
  const [role, setRole] = useState<ManagerRole>('ceo')
  const [company, setCompany] = useState(defaultCompany)
  const [birthDate, setBirthDate] = useState('')
  const [birthTime, setBirthTime] = useState('')
  const [birthPlace, setBirthPlace] = useState('Hà Nội')
  const [gender, setGender] = useState<Gender>('male')
  const [error, setError] = useState('')

  const submit = () => {
    if (!fullName.trim()) {
      setError('Vui lòng nhập họ tên.')
      return
    }
    if (!birthDate) {
      setError('Vui lòng chọn ngày sinh.')
      return
    }
    setError('')

    const birth = { birthDate, birthTime, birthPlace, gender }
    onSubmit({
      id: `m-${Date.now()}`,
      fullName: fullName.trim(),
      role,
      company: company.trim() || defaultCompany,
      ...birth,
      astrology: astrologyEngine.analyze(birth),
      createdAt: new Date().toISOString(),
    })

    setFullName('')
    setBirthDate('')
    setBirthTime('')
  }

  return (
    <Card>
      <CardHeader
        icon={<UserCog className="h-4 w-4" />}
        title="Tạo hồ sơ người quản lý"
        description="Hồ sơ này dùng làm mốc so sánh phong cách làm việc."
      />
      <CardBody className="space-y-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Họ tên" required>
            <TextInput
              value={fullName}
              onChange={(event) => setFullName(event.target.value)}
              placeholder="Ví dụ: Nguyễn Văn B"
            />
          </Field>

          <Field label="Công ty">
            <TextInput value={company} onChange={(event) => setCompany(event.target.value)} />
          </Field>
        </div>

        <Field label="Vai trò">
          <ChoiceGroup<ManagerRole>
            options={ROLES.map((value) => ({ value, label: MANAGER_ROLE_LABEL[value] }))}
            value={role}
            onChange={setRole}
          />
        </Field>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Ngày sinh" required>
            <TextInput
              type="date"
              value={birthDate}
              onChange={(event) => setBirthDate(event.target.value)}
            />
          </Field>

          <Field label="Giờ sinh" hint="Có thể để trống nếu không rõ.">
            <TextInput
              type="time"
              value={birthTime}
              onChange={(event) => setBirthTime(event.target.value)}
            />
          </Field>

          <Field label="Giới tính">
            <ChoiceGroup<Gender>
              options={(['male', 'female', 'other'] as Gender[]).map((value) => ({
                value,
                label: GENDER_LABEL[value],
              }))}
              value={gender}
              onChange={setGender}
            />
          </Field>

          <Field label="Nơi sinh">
            <Select value={birthPlace} onChange={(event) => setBirthPlace(event.target.value)}>
              {CITIES.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </Select>
          </Field>
        </div>

        {error ? <p className="text-sm text-danger-fg">{error}</p> : null}

        <p className="rounded-lg border border-line bg-surface-muted p-3 text-xs leading-relaxed text-ink-muted">
          Thông tin ngày giờ sinh được sử dụng để tạo Hồ sơ cá nhân. Trong phiên bản demo này, dữ
          liệu chỉ được lưu trên trình duyệt của bạn.
        </p>

        <Button variant="primary" block onClick={submit}>
          <Search className="h-4 w-4" />
          Tìm ứng viên phù hợp
        </Button>
      </CardBody>
    </Card>
  )
}
