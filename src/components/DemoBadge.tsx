import { FlaskConical } from 'lucide-react'
import { Tooltip } from '@/components/ui/Tooltip'
import { cn } from '@/utils/cn'

export function DemoBadge({ className }: { className?: string }) {
  return (
    <Tooltip label="Dữ liệu và kết quả ở đây chỉ phục vụ mục đích thử nghiệm.">
      <span
        className={cn(
          'inline-flex cursor-help items-center gap-1.5 rounded-full border border-warning-border bg-warning-subtle px-2.5 py-0.5',
          'text-[11px] font-medium text-warning-fg',
          className,
        )}
      >
        <FlaskConical className="h-3 w-3" />
        Bản thử nghiệm
      </span>
    </Tooltip>
  )
}
