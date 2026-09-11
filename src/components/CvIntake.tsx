import { useRef, useState } from 'react'
import { CheckCircle2, FileText, Loader2, Upload, X } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card, CardBody, CardHeader } from '@/components/ui/Card'
import { TextArea } from '@/components/ui/Field'
import { SkillTag } from '@/components/ui/SkillTag'
import { cn } from '@/utils/cn'
import { isSupportedCvFile, parseCvText, type ParsedCv } from '@/utils/cvParser'
import { readCvFile } from '@/utils/pdfText'
import type { CandidateSkill } from '@/types'

/**
 * CV intake. Reads a text file (or pasted text) in the browser and proposes
 * skills and years of experience for the wizard to pre-fill.
 *
 * PDF and Word are not parsed: doing it properly needs a heavy dependency, and
 * a half-working parser that silently finds nothing is worse than telling the
 * person to paste the text. The UI says so plainly rather than failing quietly.
 */
export function CvIntake({
  onApply,
}: {
  onApply: (result: { skills: CandidateSkill[]; yearsOfExperience: number | null }) => void
}) {
  const [text, setText] = useState('')
  const [fileName, setFileName] = useState('')
  const [result, setResult] = useState<ParsedCv | null>(null)
  const [error, setError] = useState('')
  const [dragging, setDragging] = useState(false)
  const [reading, setReading] = useState(false)
  const [note, setNote] = useState('')
  const [applied, setApplied] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const readFile = async (file: File) => {
    setError('')
    setNote('')
    setApplied(false)
    if (!isSupportedCvFile(file)) {
      setFileName('')
      setError(
        `Không đọc được “${file.name}”. Luồng này nhận .pdf, .txt, .md, .csv. ` +
          'Với Word, bạn hãy mở file rồi dán nội dung vào ô bên dưới.',
      )
      return
    }
    setReading(true)
    setFileName(file.name)
    try {
      const { text: content, note: hint } = await readCvFile(file)
      setText(content)
      if (hint) setNote(hint)
      analyse(content)
    } catch (e) {
      setFileName('')
      setText('')
      setResult(null)
      setError(e instanceof Error ? e.message : 'Không đọc được file này.')
    } finally {
      setReading(false)
    }
  }

  const analyse = (content: string) => {
    const trimmed = content.trim()
    if (trimmed.length < 30) {
      setResult(null)
      setError('Nội dung quá ngắn để phân tích. Hãy dán đầy đủ phần kỹ năng và kinh nghiệm.')
      return
    }
    setError('')
    setResult(parseCvText(trimmed))
  }

  const reset = () => {
    setText('')
    setFileName('')
    setResult(null)
    setError('')
    setNote('')
    setApplied(false)
    if (inputRef.current) inputRef.current.value = ''
  }

  return (
    <Card>
      <CardHeader
        icon={<FileText className="h-4 w-4" />}
        title="Tải CV lên"
        description="Không bắt buộc. Dùng để điền sẵn kỹ năng và số năm kinh nghiệm."
        action={
          result || text ? (
            <Button variant="ghost" size="sm" onClick={reset}>
              <X className="h-4 w-4" />
              Xoá
            </Button>
          ) : null
        }
      />
      <CardBody className="space-y-4">
        {/* Drop zone */}
        <div
          onDragOver={(event) => {
            event.preventDefault()
            setDragging(true)
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={(event) => {
            event.preventDefault()
            setDragging(false)
            const file = event.dataTransfer.files[0]
            if (file) void readFile(file)
          }}
          className={cn(
            'rounded-xl border border-dashed p-6 text-center transition-colors',
            dragging ? 'border-primary bg-accent-50/60' : 'border-line-strong bg-surface-sunken/50',
          )}
        >
          {reading ? (
            <Loader2 className="mx-auto mb-3 h-5 w-5 animate-spin text-primary" />
          ) : (
            <Upload className="mx-auto mb-3 h-5 w-5 text-ink-faint" />
          )}
          <p className="text-sm font-medium text-ink">
            {reading ? 'Đang đọc file' : 'Kéo thả CV vào đây'}
          </p>
          <p className="mx-auto mt-1 max-w-sm text-xs leading-relaxed text-ink-muted">
            Đọc được .pdf, .txt, .md, .csv. Với Word, bạn mở file rồi dán nội dung vào ô bên dưới.
          </p>
          <input
            ref={inputRef}
            type="file"
            accept=".pdf,.txt,.md,.csv,.json,.rtf,text/*"
            className="sr-only"
            id="cv-file"
            onChange={(event) => {
              const file = event.target.files?.[0]
              if (file) void readFile(file)
            }}
          />
          <Button variant="secondary" size="sm" className="mt-4" onClick={() => inputRef.current?.click()}>
            Chọn tệp
          </Button>
          {fileName ? (
            <p className="mt-3 truncate text-xs text-ink-soft">Đã đọc: {fileName}</p>
          ) : null}
        </div>

        {/* Paste fallback */}
        <div>
          <label className="field-label" htmlFor="cv-text">
            Hoặc dán nội dung CV
          </label>
          <TextArea
            id="cv-text"
            value={text}
            onChange={(event) => {
              setText(event.target.value)
              setApplied(false)
            }}
            placeholder="Dán phần kinh nghiệm, kỹ năng, học vấn từ CV của bạn..."
            className="min-h-[120px]"
          />
          <Button
            variant="secondary"
            size="sm"
            className="mt-2"
            disabled={text.trim().length < 30}
            onClick={() => analyse(text)}
          >
            Phân tích nội dung
          </Button>
        </div>

        {error ? (
          <p className="rounded-lg border border-warning-border bg-warning-subtle/60 p-3 text-xs leading-relaxed text-ink-soft">
            {error}
          </p>
        ) : null}

        {note && !error ? <p className="text-xs text-ink-muted">{note}</p> : null}

        {/* Result */}
        {result ? (
          <div className="rounded-xl border border-line bg-surface-sunken/60 p-4">
            <p className="text-sm font-semibold text-ink">
              Nhận diện được {result.skills.length} kỹ năng
              {result.yearsOfExperience !== null
                ? ` và khoảng ${result.yearsOfExperience} năm kinh nghiệm`
                : ''}
            </p>
            <p className="mt-1 text-xs text-ink-muted">
              Đã đọc {result.charCount.toLocaleString('vi-VN')} ký tự. Bạn sửa lại được ở các bước sau.
            </p>

            {result.skills.length > 0 ? (
              <div className="mt-3 flex flex-wrap gap-1.5">
                {result.skills.slice(0, 18).map((skill) => (
                  <SkillTag key={skill.skillId} name={skill.name} matched />
                ))}
                {result.skills.length > 18 ? (
                  <span className="self-center text-xs text-ink-muted">
                    +{result.skills.length - 18} kỹ năng khác
                  </span>
                ) : null}
              </div>
            ) : (
              <p className="mt-3 text-sm text-ink-muted">
                Chưa nhận ra kỹ năng nào trong danh mục. Bạn vẫn chọn tay được ở phần bên dưới.
              </p>
            )}

            <Button
              variant={applied ? 'secondary' : 'primary'}
              size="sm"
              className="mt-4"
              disabled={applied || result.skills.length === 0}
              onClick={() => {
                onApply({ skills: result.skills, yearsOfExperience: result.yearsOfExperience })
                setApplied(true)
              }}
            >
              {applied ? (
                <>
                  <CheckCircle2 className="h-4 w-4" />
                  Đã điền vào hồ sơ
                </>
              ) : (
                'Điền vào hồ sơ'
              )}
            </Button>
          </div>
        ) : null}

        <p className="text-xs leading-relaxed text-ink-muted">
          Nội dung CV được xử lý ngay trên trình duyệt của bạn. Không tải lên máy chủ nào.
        </p>
      </CardBody>
    </Card>
  )
}
