import { useMemo, useState } from 'react'
import { Check, Plus, Search, Sparkles, X } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { TextInput } from '@/components/ui/Field'
import { SKILLS, searchSkills } from '@/data/skills'
import { CvIntake } from '@/components/CvIntake'
import { SKILL_CATEGORY_LABEL, SKILL_LEVEL_LABEL, SKILL_LEVEL_ORDER } from '@/utils/format'
import { cn } from '@/utils/cn'
import type { CandidateSkill, SkillCategory, SkillLevel } from '@/types'

const CATEGORIES: SkillCategory[] = ['technology', 'business', 'design', 'soft']

export function StepSkills({
  skills,
  onChange,
  onYearsDetected,
}: {
  skills: CandidateSkill[]
  onChange: (skills: CandidateSkill[]) => void
  onYearsDetected?: (years: number) => void
}) {
  const [query, setQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState<SkillCategory | 'all'>('all')
  const [customName, setCustomName] = useState('')

  const selectedIds = useMemo(() => new Set(skills.map((s) => s.skillId)), [skills])

  const visible = useMemo(() => {
    const base = query.trim() ? searchSkills(query, 200) : SKILLS
    if (activeCategory === 'all') return base
    return base.filter((skill) => skill.category === activeCategory)
  }, [query, activeCategory])

  const toggle = (skillId: string) => {
    if (selectedIds.has(skillId)) {
      onChange(skills.filter((s) => s.skillId !== skillId))
      return
    }
    const skill = SKILLS.find((s) => s.id === skillId)
    if (!skill) return
    onChange([
      ...skills,
      { skillId: skill.id, name: skill.name, category: skill.category, level: 'intermediate' },
    ])
  }

  const setLevel = (skillId: string, level: SkillLevel) => {
    onChange(skills.map((s) => (s.skillId === skillId ? { ...s, level } : s)))
  }

  const addCustom = () => {
    const name = customName.trim()
    if (!name) return
    const id = `custom-${name.toLowerCase().replace(/\s+/g, '-')}`
    if (selectedIds.has(id)) {
      setCustomName('')
      return
    }
    onChange([...skills, { skillId: id, name, category: 'other', level: 'intermediate' }])
    setCustomName('')
  }

  /** Merge parsed skills in, keeping anything already chosen by hand. */
  const applyFromCv = (parsed: CandidateSkill[], years: number | null) => {
    const existing = new Map(skills.map((s) => [s.skillId, s]))
    for (const skill of parsed) if (!existing.has(skill.skillId)) existing.set(skill.skillId, skill)
    onChange([...existing.values()])
    if (years !== null && onYearsDetected) onYearsDetected(years)
  }

  return (
    <div className="space-y-6">
      <CvIntake onApply={({ skills: parsed, yearsOfExperience }) => applyFromCv(parsed, yearsOfExperience)} />

      {/* Selected skills with level control */}
      <Card className="p-5">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div>
            <p className="text-sm font-semibold text-ink">Kỹ năng đã chọn</p>
            <p className="mt-0.5 text-xs text-ink-muted">
              Chọn mức độ cho từng kỹ năng để kết quả gợi ý sát hơn.
            </p>
          </div>
          <span className="rounded-full bg-surface-sunken px-2.5 py-1 text-xs font-semibold tabular-nums text-ink-soft">
            {skills.length}
          </span>
        </div>

        {skills.length === 0 ? (
          <div className="rounded-lg border border-dashed border-line bg-surface-muted px-4 py-8 text-center">
            <Sparkles className="mx-auto mb-2 h-5 w-5 text-ink-faint" />
            <p className="text-sm text-ink-muted">
              Chưa chọn kỹ năng nào. Tìm và chọn từ danh sách bên dưới.
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {skills.map((skill) => (
              <div
                key={skill.skillId}
                className="flex flex-col gap-2.5 rounded-lg border border-line bg-surface-muted px-3.5 py-3 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex min-w-0 items-center gap-2">
                  <span className="truncate text-sm font-medium text-ink">{skill.name}</span>
                  <span className="shrink-0 rounded bg-card px-1.5 py-0.5 text-[10px] text-ink-muted">
                    {SKILL_CATEGORY_LABEL[skill.category]}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex overflow-hidden rounded-lg border border-line bg-card">
                    {SKILL_LEVEL_ORDER.map((level) => (
                      <button
                        key={level}
                        type="button"
                        onClick={() => setLevel(skill.skillId, level)}
                        className={cn(
                          'px-2.5 py-1.5 text-xs font-medium transition-colors',
                          skill.level === level
                            ? 'bg-primary text-on-primary'
                            : 'text-ink-muted hover:bg-surface-sunken',
                        )}
                      >
                        {SKILL_LEVEL_LABEL[level]}
                      </button>
                    ))}
                  </div>
                  <button
                    type="button"
                    onClick={() => toggle(skill.skillId)}
                    aria-label={`Bỏ kỹ năng ${skill.name}`}
                    className="rounded-lg p-1.5 text-ink-faint transition-colors hover:bg-card hover:text-danger-fg"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Search + browse */}
      <Card className="p-5">
        <div className="relative mb-4">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-faint" />
          <TextInput
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Tìm kỹ năng..."
            className="pl-9"
            aria-label="Tìm kỹ năng"
          />
        </div>

        <div className="mb-4 flex flex-wrap gap-2">
          <CategoryChip
            label="Tất cả"
            active={activeCategory === 'all'}
            onClick={() => setActiveCategory('all')}
          />
          {CATEGORIES.map((category) => (
            <CategoryChip
              key={category}
              label={SKILL_CATEGORY_LABEL[category]}
              active={activeCategory === category}
              onClick={() => setActiveCategory(category)}
            />
          ))}
        </div>

        <div className="max-h-72 overflow-y-auto pr-1">
          {visible.length === 0 ? (
            <p className="py-8 text-center text-sm text-ink-muted">
              Không tìm thấy kỹ năng phù hợp. Bạn có thể thêm kỹ năng khác bên dưới.
            </p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {visible.map((skill) => {
                const selected = selectedIds.has(skill.id)
                return (
                  <button
                    key={skill.id}
                    type="button"
                    onClick={() => toggle(skill.id)}
                    aria-pressed={selected}
                    className={cn(
                      'inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-sm font-medium transition-all',
                      selected
                        ? 'border-primary bg-primary text-on-primary'
                        : 'border-line bg-card text-ink-soft hover:border-ink-faint/60 hover:bg-surface-muted',
                    )}
                  >
                    {selected ? <Check className="h-3.5 w-3.5" /> : null}
                    {skill.name}
                  </button>
                )
              })}
            </div>
          )}
        </div>

        <div className="mt-5 flex flex-col gap-2 border-t border-line pt-4 sm:flex-row">
          <TextInput
            value={customName}
            onChange={(event) => setCustomName(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                event.preventDefault()
                addCustom()
              }
            }}
            placeholder="Kỹ năng khác không có trong danh sách..."
            aria-label="Thêm kỹ năng khác"
          />
          <Button variant="secondary" onClick={addCustom} disabled={!customName.trim()}>
            <Plus className="h-4 w-4" />
            Thêm kỹ năng khác
          </Button>
        </div>
      </Card>
    </div>
  )
}

function CategoryChip({
  label,
  active,
  onClick,
}: {
  label: string
  active: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'rounded-full border px-3 py-1.5 text-xs font-medium transition-colors',
        active
          ? 'border-primary bg-primary text-on-primary'
          : 'border-line bg-card text-ink-soft hover:bg-surface-muted',
      )}
    >
      {label}
    </button>
  )
}
