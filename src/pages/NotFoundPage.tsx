import { Compass } from 'lucide-react'
import { EmptyState } from '@/components/ui/EmptyState'
import { ButtonLink } from '@/components/ui/Button'

export function NotFoundPage() {
  return (
    <div className="container py-20">
      <EmptyState
        icon={<Compass className="h-6 w-6" />}
        title="Không tìm thấy trang"
        description="Đường dẫn bạn truy cập không tồn tại trong bản demo này."
        action={
          <ButtonLink to="/" variant="primary">
            Về trang chủ
          </ButtonLink>
        }
      />
    </div>
  )
}
