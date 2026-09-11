import { useState } from 'react'
import { Plus, X } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { ChoiceGroup, Field, TextInput } from '@/components/ui/Field'
import type { CareerPreference, SeniorityLevel, WorkMode } from '@/types'
import { SENIORITY_LABEL, SENIORITY_ORDER, WORK_MODE_LABEL, formatSalary } from '@/utils/format'

const INDUSTRY_OPTIONS = [
  'Công nghệ',
  'Fintech',
  'Ngân hàng',
  'Thương mại điện tử',
  'Giáo dục',
  'Y tế',
  'Sản xuất',
  'Logistics',
  'Bất động sản',
  'Truyền thông',
  'Tư vấn',
  'Nhân sự',
  'Bán lẻ',
  'Viễn thông',
  'Blockchain',
  'SaaS',
]

const LOCATION_OPTIONS = ['Hà Nội', 'TP. Hồ Chí Minh', 'Đà Nẵng', 'Hải Phòng', 'Cần Thơ', 'Remote']

export function StepPreference({
  preference,
  onChange,
}: {
  preference: Partial<CareerPreference>
  onChange: (patch: Partial<CareerPreference>) => void
}) {
  const [customIndustry, setCustomIndustry] = useState('')
  const industries = preference.industries ?? []
  const locations = preference.preferredLocations ?? []
  const workModes = preference.workModes ?? []

  const toggleIndustry = (value: string) => {
    onChange({
      industries: industries.includes(value)
        ? industries.filter((item) => item !== value)
        : [...industries, value],
    })
  }

  const toggleLocation = (value: string) => {
    onChange({
      preferredLocations: locations.includes(value)
        ? locations.filter((item) => item !== value)
        : [...locations, value],
    })
  }

  const toggleWorkMode = (value: WorkMode) => {
    onChange({
      workModes: workModes.includes(value)
        ? workModes.filter((item) => item !== value)
        : [...workModes, value],
    })
  }

  const addCustomIndustry = () => {
    const value = customIndustry.trim()
    if (!value || industries.includes(value)) {
      setCustomIndustry('')
      return
    }
    onChange({ industries: [...industries, value] })
    setCustomIndustry('')
  }

  const salaryMin = preference.salaryMin ?? 20
  const salaryMax = preference.salaryMax ?? 35

  return (
    <div className="space-y-5">
      <Card className="p-5">
        <Field
          label="Ngành quan tâm"
          hint="Chọn một hoặc nhiều ngành bạn muốn làm việc."
        >
          <div className="flex flex-wrap gap-2">
            {INDUSTRY_OPTIONS.map((industry) => (
              <Chip
                key={industry}
                label={industry}
                active={industries.includes(industry)}
                onClick={() => toggleIndustry(industry)}
              />
            ))}
            {industries
              .filter((item) => !INDUSTRY_OPTIONS.includes(item))
              .map((item) => (
                <Chip key={item} label={item} active onClick={() => toggleIndustry(item)} removable />
              ))}
          </div>
        </Field>

        <div className="mt-3 flex gap-2">
          <TextInput
            value={customIndustry}
            onChange={(event) => setCustomIndustry(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                event.preventDefault()
                addCustomIndustry()
              }
            }}
            placeholder="Ngành khác..."
            aria-label="Thêm ngành khác"
          />
          <Button variant="secondary" onClick={addCustomIndustry} disabled={!customIndustry.trim()}>
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </Card>

      <Card className="space-y-5 p-5">
        <Field label="Vị trí mong muốn">
          <TextInput
            value={preference.desiredTitle ?? ''}
            onChange={(event) => onChange({ desiredTitle: event.target.value })}
            placeholder="Ví dụ: Senior Data Analyst"
          />
        </Field>

        <Field label="Mức kinh nghiệm">
          <ChoiceGroup<SeniorityLevel>
            options={SENIORITY_ORDER.map((value) => ({ value, label: SENIORITY_LABEL[value] }))}
            value={preference.seniority ?? 'middle'}
            onChange={(value) => onChange({ seniority: value })}
          />
        </Field>

        <Field label="Hình thức làm việc" hint="Có thể chọn nhiều hình thức.">
          <ChoiceGroup<WorkMode>
            multiple
            options={(['onsite', 'hybrid', 'remote'] as WorkMode[]).map((value) => ({
              value,
              label: WORK_MODE_LABEL[value],
            }))}
            value={workModes}
            onChange={toggleWorkMode}
          />
        </Field>

        <Field label="Địa điểm mong muốn">
          <div className="flex flex-wrap gap-2">
            {LOCATION_OPTIONS.map((location) => (
              <Chip
                key={location}
                label={location}
                active={locations.includes(location)}
                onClick={() => toggleLocation(location)}
              />
            ))}
          </div>
        </Field>
      </Card>

      <Card className="p-5">
        <div className="mb-4 flex items-baseline justify-between">
          <p className="text-sm font-medium text-ink-soft">Mức lương mong muốn</p>
          <p className="text-sm font-semibold text-ink">{formatSalary(salaryMin, salaryMax)}/tháng</p>
        </div>

        <div className="space-y-4">
          <RangeRow
            label="Tối thiểu"
            value={salaryMin}
            onChange={(value) => onChange({ salaryMin: Math.min(value, salaryMax) })}
          />
          <RangeRow
            label="Tối đa"
            value={salaryMax}
            onChange={(value) => onChange({ salaryMax: Math.max(value, salaryMin) })}
          />
        </div>
        <p className="field-hint">Đơn vị: triệu VND / tháng (gross).</p>
      </Card>
    </div>
  )
}

function RangeRow({
  label,
  value,
  onChange,
}: {
  label: string
  value: number
  onChange: (value: number) => void
}) {
  return (
    <div>
      <div className="mb-2 flex items-baseline justify-between">
        <span className="text-xs text-ink-muted">{label}</span>
        <span className="text-xs font-semibold tabular-nums text-ink">{value} triệu</span>
      </div>
      <input
        type="range"
        min={5}
        max={200}
        step={5}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        aria-label={`Mức lương ${label.toLowerCase()}`}
        style={{ backgroundSize: `${((value - 5) / 195) * 100}% 100%` }}
      />
    </div>
  )
}

function Chip({
  label,
  active,
  onClick,
  removable,
}: {
  label: string
  active: boolean
  onClick: () => void
  removable?: boolean
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={
        active
          ? 'inline-flex items-center gap-1.5 rounded-lg border border-primary bg-primary px-3 py-1.5 text-sm font-medium text-on-primary'
          : 'inline-flex items-center gap-1.5 rounded-lg border border-line bg-card px-3 py-1.5 text-sm font-medium text-ink-soft transition-colors hover:border-ink-faint/60 hover:bg-surface-muted'
      }
    >
      {label}
      {removable ? <X className="h-3 w-3" /> : null}
    </button>
  )
}
