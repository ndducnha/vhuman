import { Briefcase, Plus, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { EmptyState } from '@/components/ui/EmptyState'
import { Checkbox, Field, TextArea, TextInput } from '@/components/ui/Field'
import type { Experience } from '@/types'

export function StepExperience({
  items,
  onChange,
}: {
  items: Experience[]
  onChange: (items: Experience[]) => void
}) {
  const add = () => {
    onChange([
      ...items,
      {
        id: `exp-${Date.now()}`,
        company: '',
        title: '',
        startDate: '',
        endDate: '',
        current: false,
        description: '',
      },
    ])
  }

  const update = (id: string, patch: Partial<Experience>) => {
    onChange(items.map((item) => (item.id === id ? { ...item, ...patch } : item)))
  }

  const remove = (id: string) => {
    onChange(items.filter((item) => item.id !== id))
  }

  return (
    <div className="space-y-4">
      {items.length === 0 ? (
        <EmptyState
          icon={<Briefcase className="h-6 w-6" />}
          title="Chưa có kinh nghiệm làm việc"
          description="Thêm các công việc bạn đã hoặc đang làm. Nếu bạn mới bắt đầu sự nghiệp, có thể bỏ qua bước này."
          action={
            <Button variant="primary" onClick={add}>
              <Plus className="h-4 w-4" />
              Thêm kinh nghiệm
            </Button>
          }
        />
      ) : (
        <>
          {items.map((item, index) => (
            <Card key={item.id} className="p-5">
              <div className="mb-4 flex items-center justify-between">
                <p className="text-sm font-semibold text-ink">Kinh nghiệm {index + 1}</p>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => remove(item.id)}
                  aria-label={`Xoá kinh nghiệm ${index + 1}`}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Công ty">
                  <TextInput
                    value={item.company}
                    onChange={(event) => update(item.id, { company: event.target.value })}
                    placeholder="Ví dụ: Zentra Technology"
                  />
                </Field>

                <Field label="Vị trí">
                  <TextInput
                    value={item.title}
                    onChange={(event) => update(item.id, { title: event.target.value })}
                    placeholder="Ví dụ: Software Engineer"
                  />
                </Field>

                <Field label="Ngày bắt đầu">
                  <TextInput
                    type="month"
                    value={item.startDate}
                    onChange={(event) => update(item.id, { startDate: event.target.value })}
                  />
                </Field>

                <Field label="Ngày kết thúc">
                  <TextInput
                    type="month"
                    value={item.endDate}
                    disabled={item.current}
                    onChange={(event) => update(item.id, { endDate: event.target.value })}
                  />
                </Field>

                <div className="sm:col-span-2">
                  <Checkbox
                    checked={item.current}
                    onChange={(checked) =>
                      update(item.id, { current: checked, endDate: checked ? '' : item.endDate })
                    }
                    label="Tôi đang làm việc tại đây"
                  />
                </div>

                <Field label="Mô tả công việc" className="sm:col-span-2">
                  <TextArea
                    value={item.description}
                    onChange={(event) => update(item.id, { description: event.target.value })}
                    placeholder="Mô tả ngắn gọn phạm vi công việc và kết quả nổi bật."
                  />
                </Field>
              </div>
            </Card>
          ))}

          <Button variant="secondary" block onClick={add}>
            <Plus className="h-4 w-4" />
            Thêm kinh nghiệm
          </Button>
        </>
      )}
    </div>
  )
}
