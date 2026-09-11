import { SKILLS, normalize } from '@/data/skills'
import type { CandidateSkill, SkillLevel } from '@/types'

/**
 * Client-side CV reader.
 *
 * Deliberately a keyword matcher, not an AI parser: it runs entirely in the
 * browser, needs no API key, and its behaviour is inspectable. It proposes 
 * the wizard always shows the result for the person to correct.
 */

export interface ParsedCv {
  /** Skills recognised from the taxonomy, most confident first. */
  skills: CandidateSkill[]
  /** Years of experience inferred from date ranges, if any were found. */
  yearsOfExperience: number | null
  /** Job titles spotted near the top of the document. */
  titles: string[]
  /** Characters of text actually read: surfaced so the user can sanity-check. */
  charCount: number
}

/** Level implied by how a skill is described around its mention. */
function inferLevel(haystack: string, term: string): SkillLevel {
  const idx = haystack.indexOf(term)
  if (idx < 0) return 'intermediate'
  const around = haystack.slice(Math.max(0, idx - 60), idx + term.length + 60)
  if (/(chuyen gia|expert|thanh thao cao|advanced|nang cao|chuyen sau)/.test(around)) return 'expert'
  if (/(thanh thao|proficient|tot|strong|vung)/.test(around)) return 'proficient'
  if (/(co ban|basic|beginner|lam quen|nhap mon)/.test(around)) return 'basic'
  return 'intermediate'
}

const TITLE_HINTS = [
  'kỹ sư', 'chuyên viên', 'nhân viên', 'trưởng nhóm', 'trưởng phòng', 'quản lý',
  'giám đốc', 'thực tập', 'kế toán', 'giáo viên', 'bác sĩ', 'y tá', 'lập trình viên',
  'engineer', 'developer', 'manager', 'analyst', 'designer', 'specialist', 'lead',
]

export function parseCvText(raw: string): ParsedCv {
  const text = raw.trim()
  const hay = normalize(text)

  /* ── Skills ──────────────────────────────────────────────────── */
  const seen = new Set<string>()
  const skills: CandidateSkill[] = []

  for (const skill of SKILLS) {
    const terms = [skill.name, ...(skill.aliases ?? [])].map(normalize).filter((t) => t.length >= 2)
    const hit = terms.find((term) => {
      // Word-boundary match so "go" doesn't fire inside "google".
      const pattern = new RegExp(`(^|[^a-z0-9])${escapeRegExp(term)}([^a-z0-9]|$)`)
      return pattern.test(hay)
    })
    if (!hit || seen.has(skill.id)) continue
    seen.add(skill.id)
    skills.push({
      skillId: skill.id,
      name: skill.name,
      category: skill.category,
      level: inferLevel(hay, hit),
    })
  }

  /* ── Years of experience ─────────────────────────────────────── */
  const years = inferYears(text)

  /* ── Titles ──────────────────────────────────────────────────── */
  const titles: string[] = []
  for (const line of text.split(/\r?\n/).slice(0, 40)) {
    const trimmed = line.trim()
    if (trimmed.length < 3 || trimmed.length > 70) continue
    const lower = normalize(trimmed)
    if (TITLE_HINTS.some((hint) => lower.includes(normalize(hint)))) {
      if (!titles.includes(trimmed)) titles.push(trimmed)
    }
    if (titles.length >= 4) break
  }

  return { skills, yearsOfExperience: years, titles, charCount: text.length }
}

/**
 * Sums date ranges like "2019 - 2022", "03/2020 - hiện tại", "2018-nay".
 * Overlapping ranges are merged so concurrent roles are not double counted.
 *
 * Khoảng thời gian đi học bị loại. Trước đây "Đại học ... (2013 - 2017)" được
 * cộng thẳng vào, nên một CV chín năm đi làm lại báo mười ba năm kinh nghiệm.
 */
function inferYears(text: string): number | null {
  const now = new Date().getFullYear()
  const ranges: Array<[number, number]> = []
  const pattern =
    /(\d{1,2}\/)?(\d{4})\s*[-–—]\s*((\d{1,2}\/)?(\d{4})|hi[eệ]n t[aạ]i|nay|present|now)/gi

  const EDU_HEADING = /^(hoc van|education|bang cap|qua trinh hoc tap|trinh do hoc van)\b/
  const WORK_HEADING = /^(kinh nghiem|experience|qua trinh cong tac|lich su lam viec|du an)\b/
  const EDU_LINE =
    /(dai hoc|cao dang|trung cap|truong |tot nghiep|cu nhan|thac si|tien si|bachelor|master|university|college|gpa)/

  let inEducation = false
  for (const rawLine of text.split(/\r?\n/)) {
    const flat = normalize(rawLine).trim()
    if (flat && rawLine.trim().length <= 60) {
      if (EDU_HEADING.test(flat)) { inEducation = true; continue }
      if (WORK_HEADING.test(flat)) { inEducation = false }
    }
    if (inEducation || EDU_LINE.test(flat)) continue

    for (const match of rawLine.matchAll(pattern)) {
      const from = Number(match[2])
      const toRaw = match[3]
      const to = /^\d/.test(toRaw) ? Number(match[5]) : now
      if (!from || from < 1970 || from > now || to < from || to > now + 1) continue
      ranges.push([from, Math.min(to, now)])
    }
  }
  if (ranges.length === 0) return null

  ranges.sort((a, b) => a[0] - b[0])
  const merged: Array<[number, number]> = []
  for (const range of ranges) {
    const last = merged[merged.length - 1]
    if (last && range[0] <= last[1]) last[1] = Math.max(last[1], range[1])
    else merged.push([...range] as [number, number])
  }

  const total = merged.reduce((sum, [from, to]) => sum + (to - from), 0)
  return total > 0 ? Math.min(total, 45) : null
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

/** File types the browser can read as text without any extra library. */
export const READABLE_EXTENSIONS = ['.txt', '.md', '.csv', '.json', '.rtf'] as const

/** Thêm PDF: đọc được nhưng phải nạp pdf.js, nên tách riêng khỏi nhóm trên. */
export const SUPPORTED_EXTENSIONS = [...READABLE_EXTENSIONS, '.pdf'] as const

export function isReadableFile(file: File): boolean {
  const name = file.name.toLowerCase()
  return READABLE_EXTENSIONS.some((ext) => name.endsWith(ext)) || file.type.startsWith('text/')
}

/** Mọi định dạng luồng tải CV nhận, kể cả loại cần thư viện phụ. */
export function isSupportedCvFile(file: File): boolean {
  const name = file.name.toLowerCase()
  return (
    isReadableFile(file) || name.endsWith('.pdf') || file.type === 'application/pdf'
  )
}
