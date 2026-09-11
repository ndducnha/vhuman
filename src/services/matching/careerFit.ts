import type { Candidate, Career } from '@/types'
import type { TuViCareerProfile } from '@/types/tuvi'
import { CAREER_MODES } from '@/data/tuvi'
import { CAREERS } from '@/data/careers'
import { skillName } from '@/data/skills'
import { clamp, round, weighted } from '@/utils/score'
import { SENIORITY_YEARS, SKILL_LEVEL_WEIGHT } from '@/utils/format'
import { normalize } from '@/data/skills'
import { matchingConfig } from './config'
import { vectorForCareer, vectorMatch } from './careerVectors'

/**
 * Gợi ý nghề nghiệp theo ba lớp: phản chiếu, bằng chứng, mong muốn.
 *
 * Mỗi lớp được tính riêng và hiển thị riêng, để người dùng thấy rõ điểm đến từ
 * đâu. Nếu gộp thành một con số duy nhất thì không ai kiểm chứng được, và lớp
 * Tử Vi rất dễ bị hiểu nhầm là yếu tố quyết định.
 */
export interface CareerFitResult {
  career: Career
  /** Điểm tổng, 0 tới 100. */
  overall: number
  breakdown: {
    /** Lớp A: khớp giữa vector lá số và vector nghề. */
    reflection: number
    /** Lớp B: kỹ năng, kinh nghiệm, học vấn. */
    evidence: number
    /** Lớp C: khớp với mong muốn đã khai. */
    intent: number
  }
  /** Chi tiết bên trong lớp bằng chứng, để hiển thị thanh đo. */
  evidenceDetail: { skills: number; experience: number; education: number }
  /** Chế độ vận hiện tại có ủng hộ hướng này không. */
  cycleFit: number
  whyFit: string[]
  cautions: string[]
  skillGaps: string[]
  matchedSkills: string[]
  /** Hành động nên làm ngay, lấy theo chế độ vận. */
  recommendedAction: string
}

/**
 * Trọng số độ hiếm của một kỹ năng trong toàn bộ danh mục nghề.
 *
 * Không có nó thì khớp "Giao tiếp" đáng giá ngang khớp "Node.js", nên một hồ
 * sơ kỹ thuật sâu lại được đẩy sang các nghề chung chung chỉ vì nghề đó đòi
 * toàn kỹ năng mềm mà ai cũng có. Kỹ năng xuất hiện ở càng ít nghề thì càng
 * nói lên nhiều điều, và được nhân trọng số cao hơn.
 */
const SKILL_RARITY: Record<string, number> = (() => {
  const df = new Map<string, number>()
  for (const c of CAREERS) {
    for (const id of new Set([...c.coreSkills, ...c.bonusSkills])) {
      df.set(id, (df.get(id) ?? 0) + 1)
    }
  }
  const total = CAREERS.length
  const out: Record<string, number> = {}
  for (const [id, count] of df) {
    // ln(N/df) rơi vào khoảng 0 tới ~3.5; ép về 0.55 tới 1.6 để nó điều chỉnh
    // chứ không lấn át thứ tự quan trọng đã khai trong coreSkills.
    const raw = Math.log(total / count)
    out[id] = clamp(0.55 + (raw / 3.5) * 1.05, 0.55, 1.6)
  }
  return out
})()

const rarity = (id: string) => SKILL_RARITY[id] ?? 1

/** Từ quá phổ biến trong chức danh tiếng Việt, gần như không phân biệt được nghề. */
const TITLE_STOPWORDS = new Set([
  'nhan', 'vien', 'chuyen', 'nghe', 'nghiep', 'va', 'cac', 'nguoi', 'cong', 'viec',
])

const titleTokens = (value: string) =>
  new Set(normalize(value).split(/\s+/).filter((w) => w.length >= 3 && !TITLE_STOPWORDS.has(w)))

/**
 * Chức danh tiếng Việt hiếm khi trùng nhau theo chuỗi con: "Kỹ sư phần mềm" và
 * "Lập trình viên phần mềm" là cùng một nghề nhưng không chuỗi nào chứa chuỗi
 * nào. So theo từ chung thì bắt được, mà vẫn không nhận nhầm các nghề chỉ
 * dùng chung từ đệm.
 */
function titleMatches(title: string, term: string): boolean {
  const a = normalize(title)
  const b = normalize(term)
  if (a.includes(b) || b.includes(a)) return true
  const ta = titleTokens(title)
  const tb = titleTokens(term)
  const shared = [...tb].filter((w) => ta.has(w))
  if (shared.length >= 2) return true
  // Một từ chung chỉ đủ khi nó là gần như toàn bộ tên nghề và đủ dài để mang
  // nghĩa riêng, tránh kiểu "Kỹ sư" khớp "Nhân sự" chỉ vì chung một âm tiết.
  return shared.length === 1 && tb.size === 1 && shared[0].length >= 4
}

export function calculateCareerFit(
  candidate: Candidate,
  career: Career,
  tuvi: TuViCareerProfile | undefined,
): CareerFitResult {
  const owned = new Map(candidate.skills.map((s) => [s.skillId, s.level]))

  /* ── Lớp A: phản chiếu ──────────────────────────────────────── */
  const jobVector = vectorForCareer(career)
  const reflection = tuvi ? vectorMatch(tuvi.traits, jobVector) : 50
  const cycleFit = tuvi ? cycleAlignment(tuvi, career) : 50

  /* ── Lớp B: bằng chứng ──────────────────────────────────────── */
  const relevant = [...career.coreSkills, ...career.bonusSkills]
  let earned = 0
  let possible = 0
  career.coreSkills.forEach((id, i) => {
    const importance = (1 - i * 0.06) * rarity(id)
    possible += importance
    const level = owned.get(id)
    if (level) earned += importance * SKILL_LEVEL_WEIGHT[level]
  })
  career.bonusSkills.forEach((id) => {
    const importance = matchingConfig.bonusSkillWeight * rarity(id)
    possible += importance
    const level = owned.get(id)
    if (level) earned += importance * SKILL_LEVEL_WEIGHT[level]
  })
  const skills = possible > 0 ? round(clamp((earned / possible) * 100)) : 0

  const years = candidate.yearsOfExperience
  const target = SENIORITY_YEARS[candidate.preference.seniority] || 3
  const ratio = years / target
  const depth = ratio >= 1 ? clamp(100 - (ratio - 1) * 12) : clamp(ratio * 100)
  // Lọc chuỗi rỗng trước khi so khớp: '' nằm trong mọi chuỗi, nên một hồ sơ
  // chưa khai chức danh sẽ khớp với toàn bộ nghề và nhận điểm tối đa.
  const titles = [candidate.headline, ...candidate.experience.map((e) => e.title)]
    .map(normalize)
    .filter((x) => x.length >= 3)
  const terms = [career.name, ...career.roles].map(normalize).filter((t) => t.length >= 3)
  const hits = terms.filter((t) => titles.some((x) => titleMatches(x, t))).length
  const relevance = clamp(hits > 0 ? 62 + hits * 14 : 34)
  const experience = round(weighted([[depth, 0.5], [relevance, 0.5]]))

  const education = round(
    clamp(candidate.education.length === 0 ? 40 : 60 + candidate.education.length * 15),
  )

  const evidence = round(
    weighted([[skills, 0.55], [experience, 0.3], [education, 0.15]]),
  )

  /* ── Lớp C: mong muốn ───────────────────────────────────────── */
  const intent = calculateIntent(candidate, career)

  /* ── Tổng hợp ───────────────────────────────────────────────── */
  const w = matchingConfig.careerFit
  // Chế độ vận điều chỉnh nhẹ lớp phản chiếu, không tính thành lớp riêng.
  const reflectionCombined = round(weighted([[reflection, 0.75], [cycleFit, 0.25]]))
  const overall = round(
    weighted([
      [reflectionCombined, w.reflection],
      [evidence, w.evidence],
      [intent, w.intent],
    ]),
  )

  const matchedSkills = relevant.filter((id) => owned.has(id)).map(skillName)
  const skillGaps = relevant.filter((id) => !owned.has(id)).map(skillName).slice(0, 6)

  return {
    career,
    overall,
    breakdown: { reflection: reflectionCombined, evidence, intent },
    evidenceDetail: { skills, experience, education },
    cycleFit,
    whyFit: buildWhy(candidate, career, tuvi, { skills, experience, reflection, intent }),
    cautions: buildCautions(career, tuvi, { skills, experience }),
    skillGaps,
    matchedSkills,
    recommendedAction: tuvi ? CAREER_MODES[tuvi.cycle.mode].label : 'Xây năng lực',
  }
}

/** Chế độ vận hiện tại có hợp với tính chất nghề này không. */
function cycleAlignment(tuvi: TuViCareerProfile, career: Career): number {
  const v = vectorForCareer(career)
  switch (tuvi.cycle.mode) {
    case 'LEARN':       return round(clamp(45 + v.research * 40 + v.analysis * 15))
    case 'BUILD':       return round(clamp(45 + v.technical * 30 + v.execution * 25))
    case 'EXPAND':      return round(clamp(45 + v.communication * 30 + v.entrepreneurship * 25))
    case 'LEAD':        return round(clamp(45 + v.leadership * 40 + v.governance * 15))
    case 'TRANSFORM':   return round(clamp(45 + v.transformation * 35 + v.risk_tolerance * 20))
    case 'CONSOLIDATE': return round(clamp(45 + v.structure * 35 + v.resource_management * 20))
    case 'CAUTION':     return round(clamp(50 + v.structure * 30 - v.risk_tolerance * 20))
    default:            return 50
  }
}

function calculateIntent(candidate: Candidate, career: Career): number {
  const pref = candidate.preference
  let score = 50
  let signals = 0

  if (pref.industries.length > 0) {
    signals += 1
    const wanted = pref.industries.map(normalize)
    const careerText = normalize([career.name, career.summary, ...career.roles].join(' '))
    if (wanted.some((w) => careerText.includes(w) || w.includes(normalize(career.name)))) score += 25
    else score -= 8
  }

  if (pref.desiredTitle) {
    signals += 1
    const want = normalize(pref.desiredTitle)
    const roles = career.roles.map(normalize)
    if (roles.some((r) => r.includes(want) || want.includes(r))) score += 25
    else score -= 5
  }

  // Lương mong muốn so với khoảng của nghề ở cấp tương ứng.
  if (pref.salaryMin > 0) {
    signals += 1
    const [, hi] = career.salaryBase
    const mult = SALARY_MULTIPLIER[pref.seniority] ?? 1
    const careerHigh = hi * mult
    if (pref.salaryMin <= careerHigh) score += 15
    else score -= Math.min(25, (pref.salaryMin - careerHigh) * 0.8)
  }

  if (signals === 0) return 50
  return round(clamp(score))
}

/** Hệ số lương theo cấp bậc, áp lên khoảng lương gốc của nghề. */
export const SALARY_MULTIPLIER: Record<string, number> = {
  fresher: 0.5, junior: 0.7, middle: 1, senior: 1.45, lead: 1.9, manager: 2.4,
}

function buildWhy(
  candidate: Candidate,
  career: Career,
  tuvi: TuViCareerProfile | undefined,
  s: { skills: number; experience: number; reflection: number; intent: number },
): string[] {
  const out: string[] = []

  if (tuvi && s.reflection >= 65) {
    const v = vectorForCareer(career)
    const top = Object.entries(v).sort((a, b) => b[1] - a[1]).slice(0, 2).map(([k]) => k)
    const strong = top.filter((k) => tuvi.traits[k as keyof typeof tuvi.traits] >= 0.55)
    if (strong.length > 0) {
      out.push(
        `Lớp phản chiếu cho thấy hồ sơ của bạn mạnh đúng ở những chiều nghề này đòi hỏi nhất.`,
      )
    }
  }
  if (s.skills >= 65) {
    const owned = new Set(candidate.skills.map((x) => x.skillId))
    const matched = career.coreSkills.filter((id) => owned.has(id)).slice(0, 3).map(skillName)
    if (matched.length) out.push(`Đã có nền tảng kỹ năng cốt lõi: ${matched.join(', ')}.`)
  }
  if (s.experience >= 65 && candidate.yearsOfExperience >= 1) {
    out.push(`Kinh nghiệm ${Math.round(candidate.yearsOfExperience)} năm tương thích với yêu cầu thường gặp.`)
  }
  if (s.intent >= 65) out.push('Khớp với ngành và vị trí bạn đã khai trong mong muốn nghề nghiệp.')
  if (tuvi) {
    const meta = CAREER_MODES[tuvi.cycle.mode]
    out.push(`Giai đoạn hiện tại đang ở chế độ ${meta.label.toLowerCase()}. ${meta.summary}`)
  }
  if (out.length === 0) out.push(career.environment)

  return out.slice(0, 5)
}

function buildCautions(
  career: Career,
  tuvi: TuViCareerProfile | undefined,
  s: { skills: number; experience: number },
): string[] {
  const out: string[] = []
  if (s.skills < 45) out.push('Nền tảng kỹ năng cho nhóm nghề này còn mỏng, cần bổ sung trước khi chuyển hướng.')
  if (s.experience < 45) out.push('Kinh nghiệm hiện tại chưa sát với yêu cầu thường gặp của nhóm nghề này.')
  if (tuvi?.confidence === 'low') {
    out.push('Tín hiệu từ lá số chưa rõ, nên dựa nhiều hơn vào bằng chứng thực tế.')
  }
  if (tuvi?.cycle.mode === 'CAUTION') {
    out.push('Giai đoạn này nên hạn chế thay đổi lớn, cân nhắc kỹ trước khi chuyển hướng.')
  }
  if (out.length === 0) out.push(career.demandNote)
  return out.slice(0, 3)
}
