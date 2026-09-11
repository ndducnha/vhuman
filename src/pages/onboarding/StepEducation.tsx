import { GraduationCap, Plus, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { EmptyState } from '@/components/ui/EmptyState'
import { Field, TextInput, Select } from '@/components/ui/Field'
import type { Education } from '@/types'

const DEGREES = ['Trung cấp', 'Cao đẳng', 'Cử nhân', 'Kỹ sư', 'Thạc sĩ', 'Tiến sĩ', 'Chứng chỉ']

const CURRENT_YEAR = new Date().getFullYear()
const YEARS = Array.from({ length: 45 }, (_, index) => String(CURRENT_YEAR + 5 - index))

export function StepEducation({
  items,
  onChange,
}: {
  items: Education[]
  onChange: (items: Education[]) => void
}) {
  const add = () => {
    onChange([
      ...items,
      {
        id: `edu-${Date.now()}`,
        school: '',
        degree: 'Cử nhân',
        major: '',
        startYear: String(CURRENT_YEAR - 4),
        endYear: String(CURRENT_YEAR),
      },
    ])
  }

  const update = (id: string, patch: Partial<Education>) => {
    onChange(items.map((item) => (item.id === id ? { ...item, ...patch } : item)))
  }

  const remove = (id: string) => {
    onChange(items.filter((item) => item.id !== id))
  }

  return (
    <div className="space-y-4">
      {items.length === 0 ? (
        <EmptyState
          icon={<GraduationCap className="h-6 w-6" />}
          title="Chưa có thông tin học vấn"
          description="Thêm bằng cấp hoặc chương trình đào tạo bạn đã hoàn thành. Bạn có thể bỏ qua bước này."
          action={
            <Button variant="primary" onClick={add}>
              <Plus className="h-4 w-4" />
              Thêm học vấn
            </Button>
          }
        />
      ) : (
        <>
          {items.map((item, index) => (
            <Card key={item.id} className="p-5">
              <div className="mb-4 flex items-center justify-between">
                <p className="text-sm font-semibold text-ink">Học vấn {index + 1}</p>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => remove(item.id)}
                  aria-label={`Xoá học vấn ${index + 1}`}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Trường" className="sm:col-span-2">
                  <TextInput
                    value={item.school}
                    onChange={(event) => update(item.id, { school: event.target.value })}
                    placeholder="Ví dụ: Đại học Bách khoa Hà Nội"
                  />
                </Field>

                <Field label="Bằng cấp">
                  <Select
                    value={item.degree}
                    onChange={(event) => update(item.id, { degree: event.target.value })}
                  >
                    {DEGREES.map((degree) => (
                      <option key={degree} value={degree}>
                        {degree}
                      </option>
                    ))}
                  </Select>
                </Field>

                <Field label="Chuyên ngành">
                  <TextInput
                    value={item.major}
                    onChange={(event) => update(item.id, { major: event.target.value })}
                    placeholder="Ví dụ: Khoa học máy tính"
                  />
                </Field>

                <Field label="Năm bắt đầu">
                  <Select
                    value={item.startYear}
                    onChange={(event) => update(item.id, { startYear: event.target.value })}
                  >
                    {YEARS.map((year) => (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    ))}
                  </Select>
                </Field>

                <Field label="Năm kết thúc">
                  <Select
                    value={item.endYear}
                    onChange={(event) => update(item.id, { endYear: event.target.value })}
                  >
                    {YEARS.map((year) => (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    ))}
                  </Select>
                </Field>
              </div>
            </Card>
          ))}

          <Button variant="secondary" block onClick={add}>
            <Plus className="h-4 w-4" />
            Thêm học vấn
          </Button>
        </>
      )}
    </div>
  )
}
