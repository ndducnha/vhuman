import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { RotateCcw } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import { useDemoSession } from '@/hooks/demoSessionContext'

/**
 * Clears every VHuman key from localStorage and returns to the landing page.
 * Seed data is static, so it reloads automatically.
 */
export function ResetDemoButton({
  variant = 'secondary',
  block,
  label = 'Đặt lại dữ liệu demo',
}: {
  variant?: 'secondary' | 'ghost' | 'danger'
  block?: boolean
  label?: string
}) {
  const [open, setOpen] = useState(false)
  const { resetDemo } = useDemoSession()
  const navigate = useNavigate()

  const confirm = () => {
    resetDemo()
    setOpen(false)
    navigate('/')
  }

  return (
    <>
      <Button variant={variant} size="sm" block={block} onClick={() => setOpen(true)}>
        <RotateCcw className="h-4 w-4" />
        {label}
      </Button>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Đặt lại dữ liệu demo?"
        footer={
          <div className="flex justify-end gap-2">
            <Button variant="ghost" onClick={() => setOpen(false)}>
              Huỷ
            </Button>
            <Button variant="primary" onClick={confirm}>
              Đặt lại
            </Button>
          </div>
        }
      >
        <p className="text-sm leading-relaxed text-ink-soft">
          Mọi thay đổi bạn thực hiện trong phiên này sẽ bị xoá khỏi trình duyệt: hồ sơ tự tạo, bản
          nháp CV, ứng viên đã lưu, hồ sơ người quản lý. Sau đó bộ dữ liệu mẫu được nạp lại từ đầu.
        </p>
      </Modal>
    </>
  )
}
