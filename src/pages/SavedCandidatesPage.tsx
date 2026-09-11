import { useMemo, useState } from 'react'
import { Bookmark } from 'lucide-react'
import { PageHeader } from '@/components/ui/PageHeader'
import { EmptyState } from '@/components/ui/EmptyState'
import { ButtonLink } from '@/components/ui/Button'
import { Select } from '@/components/ui/Field'
import { CandidateCard } from '@/components/CandidateCard'
import { EMPTY_FILTERS } from '@/utils/filters'
import { useCandidatePool } from '@/hooks/useCandidates'
import { useDemoSession } from '@/hooks/demoSessionContext'
import { matchingEngine } from '@/services/matching'
import type { SortKey } from '@/types'

const SORT_OPTIONS: Array<{ value: SortKey; label: string }> = [
  { value: 'overall', label: 'Phù hợp tổng thể' },
  { value: 'skills', label: 'Kỹ năng tốt nhất' },
  { value: 'experience', label: 'Kinh nghiệm nhiều nhất' },
]

export function SavedCandidatesPage() {
  const pool = useCandidatePool()
  const { savedIds, isSaved, toggleSaved } = useDemoSession()
  const [sort, setSort] = useState<SortKey>('overall')

  const results = useMemo(() => {
    const saved = pool.filter((candidate) => savedIds.includes(candidate.id))
    return matchingEngine.searchByProfile(saved, { ...EMPTY_FILTERS }, sort)
  }, [pool, savedIds, sort])

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Nhà tuyển dụng"
        title="Ứng viên đã lưu"
        description="Danh sách này được lưu trên trình duyệt của bạn và giữ nguyên sau khi tải lại trang."
        action={
          results.length > 0 ? (
            <Select
              value={sort}
              onChange={(event) => setSort(event.target.value as SortKey)}
              className="w-auto min-w-[180px] py-2 text-sm"
              aria-label="Sắp xếp"
            >
              {SORT_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Select>
          ) : null
        }
      />

      {results.length === 0 ? (
        <EmptyState
          icon={<Bookmark className="h-6 w-6" />}
          title="Chưa lưu ứng viên nào"
          description="Nhấn “Lưu” trên thẻ ứng viên trong trang tìm kiếm để thêm vào danh sách này."
          action={
            <ButtonLink to="/recruiter/search" variant="primary">
              Tìm ứng viên
            </ButtonLink>
          }
        />
      ) : (
        <div className="grid gap-4 xl:grid-cols-2">
          {results.map((result) => (
            <CandidateCard
              key={result.candidate.id}
              result={result}
              saved={isSaved(result.candidate.id)}
              onToggleSave={() => toggleSaved(result.candidate.id)}
            />
          ))}
        </div>
      )}
    </div>
  )
}
