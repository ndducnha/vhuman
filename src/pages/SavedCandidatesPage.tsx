import { useMemo, useState } from 'react'
import { Bookmark } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { TextArea } from '@/components/ui/Field'
import { SHORTLIST_STAGE_LABEL, SHORTLIST_STAGE_ORDER } from '@/utils/format'
import { cn } from '@/utils/cn'
import type { ShortlistStage } from '@/types'
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

function StageChip({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'rounded-pill border px-3.5 py-1.5 text-sm font-medium transition-colors',
        active ? 'border-primary bg-primary text-on-primary' : 'border-line bg-card text-ink-soft hover:border-primary',
      )}
    >
      {label}
    </button>
  )
}

export function SavedCandidatesPage() {
  const pool = useCandidatePool()
  const { savedIds, isSaved, toggleSaved, shortlistOf, setShortlistStage, setShortlistNote } =
    useDemoSession()
  const [sort, setSort] = useState<SortKey>('overall')
  const [stageFilter, setStageFilter] = useState<ShortlistStage | 'all'>('all')

  const results = useMemo(() => {
    const saved = pool.filter((candidate) => savedIds.includes(candidate.id))
    const ranked = matchingEngine.searchByProfile(saved, { ...EMPTY_FILTERS }, sort)
    if (stageFilter === 'all') return ranked
    return ranked.filter((r) => (shortlistOf(r.candidate.id)?.stage ?? 'saved') === stageFilter)
  }, [pool, savedIds, sort, stageFilter, shortlistOf])

  const stageCounts = useMemo(() => {
    const map = new Map<ShortlistStage, number>()
    for (const id of savedIds) {
      const stage = shortlistOf(id)?.stage ?? 'saved'
      map.set(stage, (map.get(stage) ?? 0) + 1)
    }
    return map
  }, [savedIds, shortlistOf])

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
        <>
          {/* Lọc theo giai đoạn theo dõi */}
          <div className="flex flex-wrap gap-2">
            <StageChip
              label={`Tất cả (${savedIds.length})`}
              active={stageFilter === 'all'}
              onClick={() => setStageFilter('all')}
            />
            {SHORTLIST_STAGE_ORDER.filter((s) => stageCounts.get(s)).map((s) => (
              <StageChip
                key={s}
                label={`${SHORTLIST_STAGE_LABEL[s]} (${stageCounts.get(s)})`}
                active={stageFilter === s}
                onClick={() => setStageFilter(s)}
              />
            ))}
          </div>

          <div className="space-y-4">
            {results.map((result) => {
              const entry = shortlistOf(result.candidate.id)
              const stage = entry?.stage ?? 'saved'
              return (
                <div key={result.candidate.id} className="grid gap-4 xl:grid-cols-[1.2fr_1fr]">
                  <CandidateCard
                    result={result}
                    saved={isSaved(result.candidate.id)}
                    onToggleSave={() => toggleSaved(result.candidate.id)}
                  />

                  <Card className="p-5">
                    <p className="mb-2 text-xs font-medium text-ink-muted">Giai đoạn theo dõi</p>
                    <div className="flex flex-wrap gap-1.5">
                      {SHORTLIST_STAGE_ORDER.map((s) => (
                        <button
                          key={s}
                          type="button"
                          onClick={() => setShortlistStage(result.candidate.id, s)}
                          aria-pressed={stage === s}
                          className={cn(
                            'rounded-md border px-2.5 py-1 text-xs font-medium transition-colors',
                            stage === s
                              ? 'border-primary bg-primary text-on-primary'
                              : 'border-line bg-card text-ink-soft hover:border-primary hover:text-primary',
                          )}
                        >
                          {SHORTLIST_STAGE_LABEL[s]}
                        </button>
                      ))}
                    </div>

                    <div className="mt-4">
                      <label className="field-label" htmlFor={`note-${result.candidate.id}`}>
                        Ghi chú
                      </label>
                      <TextArea
                        id={`note-${result.candidate.id}`}
                        defaultValue={entry?.note ?? ''}
                        placeholder="Ghi chú của bạn về ứng viên này..."
                        className="min-h-[80px]"
                        onBlur={(e) => setShortlistNote(result.candidate.id, e.target.value)}
                      />
                      <p className="field-hint">Lưu khi bạn rời khỏi ô.</p>
                    </div>

                    {entry ? (
                      <Badge tone="neutral" className="mt-3">
                        Lưu ngày {new Date(entry.savedAt).toLocaleDateString('vi-VN')}
                      </Badge>
                    ) : null}
                  </Card>
                </div>
              )
            })}
          </div>
        </>
      )}
    </div>
  )
}
