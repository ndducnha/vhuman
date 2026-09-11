import { useMemo, useState } from 'react'
import { RotateCcw, Search, SlidersHorizontal } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { TextInput } from '@/components/ui/Field'
import { Badge } from '@/components/ui/Badge'
import { searchSkills, skillName } from '@/data/skills'
import { CANDIDATE_DEGREES, CANDIDATE_LOCATIONS } from '@/data/candidates'
import {
  CAREER_FIELD_LABEL,
  CAREER_FIELD_ORDER,
  SENIORITY_LABEL,
  SENIORITY_ORDER,
  TRAIT_LABEL,
  TRAIT_ORDER,
  WORK_MODE_LABEL,
} from '@/utils/format'
import { cn } from '@/utils/cn'
import { EMPTY_FILTERS, countActiveFilters } from '@/utils/filters'
import type {
  CandidateSearchFilters,
  CareerField,
  SeniorityLevel,
  TraitKey,
  WorkMode,
} from '@/types'

export function SearchFilters({
  filters,
  onChange,
  showTraits,
}: {
  filters: CandidateSearchFilters
  onChange: (filters: CandidateSearchFilters) => void
  showTraits?: boolean
}) {
  const [skillQuery, setSkillQuery] = useState('')

  const patch = (next: Partial<CandidateSearchFilters>) => onChange({ ...filters, ...next })

  const toggle = <T,>(list: T[], value: T): T[] =>
    list.includes(value) ? list.filter((item) => item !== value) : [...list, value]

  const skillOptions = useMemo(
    () => (skillQuery.trim() ? searchSkills(skillQuery, 12) : []),
    [skillQuery],
  )

  const activeCount = countActiveFilters(filters)

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <p className="flex items-center gap-2 text-sm font-semibold text-ink">
          <SlidersHorizontal className="h-4 w-4" />
          Bộ lọc
          {activeCount > 0 ? <Badge tone="accent">{activeCount}</Badge> : null}
        </p>
        {activeCount > 0 ? (
          <Button variant="ghost" size="sm" onClick={() => onChange({ ...EMPTY_FILTERS })}>
            <RotateCcw className="h-3.5 w-3.5" />
            Xoá
          </Button>
        ) : null}
      </div>

      {/* Free-text search */}
      <FilterBlock title="Từ khoá">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-faint" />
          <TextInput
            value={filters.query}
            onChange={(event) => patch({ query: event.target.value })}
            placeholder="Tên, vị trí, công ty..."
            className="pl-9"
            aria-label="Tìm kiếm ứng viên"
          />
        </div>
      </FilterBlock>

      {/* Skills */}
      <FilterBlock title="Kỹ năng">
        <TextInput
          value={skillQuery}
          onChange={(event) => setSkillQuery(event.target.value)}
          placeholder="Tìm kỹ năng để thêm..."
          aria-label="Tìm kỹ năng"
        />
        {skillOptions.length > 0 ? (
          <div className="mt-2 flex flex-wrap gap-1.5">
            {skillOptions.map((skill) => (
              <button
                key={skill.id}
                type="button"
                onClick={() => {
                  patch({ skills: toggle(filters.skills, skill.id) })
                  setSkillQuery('')
                }}
                className={cn(
                  'rounded-lg border px-2.5 py-1 text-xs font-medium transition-colors',
                  filters.skills.includes(skill.id)
                    ? 'border-primary bg-primary text-on-primary'
                    : 'border-line bg-card text-ink-soft hover:bg-surface-muted',
                )}
              >
                {skill.name}
              </button>
            ))}
          </div>
        ) : null}

        {filters.skills.length > 0 ? (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {filters.skills.map((skillId) => (
              <button
                key={skillId}
                type="button"
                onClick={() => patch({ skills: toggle(filters.skills, skillId) })}
                className="rounded-lg border border-primary bg-primary px-2.5 py-1 text-xs font-medium text-on-primary"
              >
                {skillName(skillId)} ×
              </button>
            ))}
          </div>
        ) : null}
      </FilterBlock>

      {/* Experience */}
      <FilterBlock title="Kinh nghiệm">
        <div className="flex items-center gap-3">
          <div className="flex-1">
            <label className="mb-1 block text-xs text-ink-muted">Tối thiểu</label>
            <TextInput
              type="number"
              min={0}
              max={20}
              value={filters.minYears}
              onChange={(event) => patch({ minYears: Math.max(0, Number(event.target.value) || 0) })}
            />
          </div>
          <div className="flex-1">
            <label className="mb-1 block text-xs text-ink-muted">Tối đa</label>
            <TextInput
              type="number"
              min={0}
              max={20}
              value={filters.maxYears}
              onChange={(event) => patch({ maxYears: Math.min(20, Number(event.target.value) || 20) })}
            />
          </div>
        </div>
        <p className="field-hint">Số năm kinh nghiệm. Tối đa 20 nghĩa là không giới hạn.</p>
      </FilterBlock>

      {/* Seniority */}
      <FilterBlock title="Cấp bậc">
        <ChipList
          options={SENIORITY_ORDER.map((value) => ({ value, label: SENIORITY_LABEL[value] }))}
          selected={filters.seniority}
          onToggle={(value) => patch({ seniority: toggle(filters.seniority, value as SeniorityLevel) })}
        />
      </FilterBlock>

      {/* Career group */}
      <FilterBlock title="Ngành nghề">
        <ChipList
          options={CAREER_FIELD_ORDER.map((value) => ({ value, label: CAREER_FIELD_LABEL[value] }))}
          selected={filters.careerGroups}
          onToggle={(value) =>
            patch({ careerGroups: toggle(filters.careerGroups, value as CareerField) })
          }
        />
      </FilterBlock>

      {/* Location */}
      <FilterBlock title="Địa điểm">
        <ChipList
          options={CANDIDATE_LOCATIONS.map((value) => ({ value, label: value }))}
          selected={filters.locations}
          onToggle={(value) => patch({ locations: toggle(filters.locations, value) })}
        />
      </FilterBlock>

      {/* Education */}
      <FilterBlock title="Học vấn">
        <ChipList
          options={CANDIDATE_DEGREES.map((value) => ({ value, label: value }))}
          selected={filters.degrees}
          onToggle={(value) => patch({ degrees: toggle(filters.degrees, value) })}
        />
      </FilterBlock>

      {/* Work mode */}
      <FilterBlock title="Hình thức làm việc">
        <ChipList
          options={(['onsite', 'hybrid', 'remote'] as WorkMode[]).map((value) => ({
            value,
            label: WORK_MODE_LABEL[value],
          }))}
          selected={filters.workModes}
          onToggle={(value) => patch({ workModes: toggle(filters.workModes, value as WorkMode) })}
        />
      </FilterBlock>

      {/* Salary */}
      <FilterBlock title="Ngân sách lương">
        <div className="mb-2 flex items-baseline justify-between">
          <span className="text-xs text-ink-muted">Tối đa</span>
          <span className="text-xs font-semibold tabular-nums text-ink">
            {filters.salaryMax > 0 ? `${filters.salaryMax} triệu` : 'Không giới hạn'}
          </span>
        </div>
        <input
          type="range"
          min={0}
          max={150}
          step={5}
          value={filters.salaryMax}
          onChange={(event) => patch({ salaryMax: Number(event.target.value) })}
          aria-label="Ngân sách lương tối đa"
          style={{ backgroundSize: `${(filters.salaryMax / 150) * 100}% 100%` }}
        />
        <p className="field-hint">Loại bỏ ứng viên có mức lương mong muốn tối thiểu vượt ngân sách.</p>
      </FilterBlock>

      {/* Trait sliders */}
      {showTraits ? (
        <FilterBlock
          title="Mẫu hồ sơ mong muốn"
          hint="Chỉ những chiều đo bạn điều chỉnh mới được tính vào điểm khớp hồ sơ cá nhân."
        >
          <div className="space-y-4">
            {TRAIT_ORDER.map((trait) => (
              <TraitSlider
                key={trait}
                trait={trait}
                value={filters.traits[trait]}
                onChange={(value) => {
                  const next = { ...filters.traits }
                  if (value === undefined) delete next[trait]
                  else next[trait] = value
                  patch({ traits: next })
                }}
              />
            ))}
          </div>
        </FilterBlock>
      ) : null}
    </div>
  )
}

function TraitSlider({
  trait,
  value,
  onChange,
}: {
  trait: TraitKey
  value: number | undefined
  onChange: (value: number | undefined) => void
}) {
  const active = value !== undefined
  const display = value ?? 50

  return (
    <div>
      <div className="mb-1.5 flex items-baseline justify-between gap-2">
        <span className={cn('text-xs', active ? 'font-medium text-ink' : 'text-ink-muted')}>
          {TRAIT_LABEL[trait]}
        </span>
        {active ? (
          <button
            type="button"
            onClick={() => onChange(undefined)}
            className="text-[11px] font-medium text-accent-700 hover:underline"
          >
            {display} · bỏ chọn
          </button>
        ) : (
          <span className="text-[11px] text-ink-faint">Chưa đặt</span>
        )}
      </div>
      <input
        type="range"
        min={0}
        max={100}
        step={5}
        value={display}
        onChange={(event) => onChange(Number(event.target.value))}
        aria-label={TRAIT_LABEL[trait]}
        style={{
          backgroundSize: active ? `${display}% 100%` : '0% 100%',
        }}
        className={cn(!active && 'opacity-60')}
      />
    </div>
  )
}

function FilterBlock({
  title,
  hint,
  children,
}: {
  title: string
  hint?: string
  children: React.ReactNode
}) {
  return (
    <div className="border-t border-line pt-5 first:border-t-0 first:pt-0">
      <p className="mb-2.5 text-xs font-semibold uppercase tracking-wide text-ink-muted">{title}</p>
      {hint ? <p className="mb-3 text-xs leading-relaxed text-ink-faint">{hint}</p> : null}
      {children}
    </div>
  )
}

function ChipList({
  options,
  selected,
  onToggle,
}: {
  options: Array<{ value: string; label: string }>
  selected: string[]
  onToggle: (value: string) => void
}) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          onClick={() => onToggle(option.value)}
          aria-pressed={selected.includes(option.value)}
          className={cn(
            'rounded-lg border px-2.5 py-1 text-xs font-medium transition-colors',
            selected.includes(option.value)
              ? 'border-primary bg-primary text-on-primary'
              : 'border-line bg-card text-ink-soft hover:bg-surface-muted',
          )}
        >
          {option.label}
        </button>
      ))}
    </div>
  )
}
