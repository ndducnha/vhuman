import type { Candidate, JobMatchResult, JobPosting, TraitKey } from '@/types'
import { skillName } from '@/data/skills'
import { bandOf, clamp, round, weighted } from '@/utils/score'
import { SENIORITY_YEARS, SKILL_LEVEL_WEIGHT } from '@/utils/format'
import { matchingConfig } from './config'

/**
 * Khớp ứng viên với một tin tuyển dụng.
 *
 * Dùng lại đúng bộ trọng số của phần gợi ý nghề nghiệp, nên điểm hiển thị cho
 * ứng viên và điểm nhà tuyển dụng nhìn thấy luôn là cùng một con số. Nếu hai
 * bên thấy hai điểm khác nhau thì sản phẩm mất tin cậy ngay.
 */
export function matchCandidateToJob(candidate: Candidate, job: JobPosting): JobMatchResult {
  const owned = new Map(candidate.skills.map((s) => [s.skillId, s.level]))

  /* ── Kỹ năng ──────────────────────────────────────────────────── */
  let earned = 0
  let possible = 0
  job.skills.forEach((skillId, index) => {
    const importance = 1 - index * 0.08
    possible += importance
    const level = owned.get(skillId)
    if (level) earned += importance * SKILL_LEVEL_WEIGHT[level]
  })
  job.bonusSkills.forEach((skillId) => {
    possible += matchingConfig.bonusSkillWeight
    const level = owned.get(skillId)
    if (level) earned += matchingConfig.bonusSkillWeight * SKILL_LEVEL_WEIGHT[level]
  })
  const skillMatch = possible > 0 ? round(clamp((earned / possible) * 100)) : 0

  /* ── Kinh nghiệm ──────────────────────────────────────────────── */
  const target = SENIORITY_YEARS[job.seniority]
  const years = candidate.yearsOfExperience
  let experienceMatch: number
  if (target === 0) {
    experienceMatch = round(clamp(100 - years * 4))
  } else {
    const ratio = years / target
    // Thừa kinh nghiệm bị trừ nhẹ, thiếu kinh nghiệm bị trừ theo tỉ lệ.
    experienceMatch = ratio >= 1 ? round(clamp(100 - (ratio - 1) * 14)) : round(clamp(ratio * 100))
  }

  /* ── Hồ sơ cá nhân, chỉ khi tin có mô tả mẫu mong muốn ───────── */
  let profileMatch: number | null = null
  const traits = candidate.astrology?.traits
  const desired = job.desiredTraits
  if (traits && desired) {
    const keys = Object.keys(desired) as TraitKey[]
    if (keys.length > 0) {
      let total = 0
      for (const key of keys) {
        const want = desired[key] as number
        const actual = traits[key]
        const gap = actual >= want ? (actual - want) * 0.25 : want - actual
        total += clamp(100 - gap * 1.15)
      }
      profileMatch = round(total / keys.length)
    }
  }

  const w = matchingConfig.careerMatch
  const overall = round(
    weighted(
      profileMatch === null
        ? [
            [skillMatch, w.skills],
            [experienceMatch, w.experience],
          ]
        : [
            [skillMatch, w.skills],
            [experienceMatch, w.experience],
            [profileMatch, w.profile],
          ],
    ),
  )

  const relevant = [...job.skills, ...job.bonusSkills]
  return {
    job,
    overall,
    skillMatch,
    experienceMatch,
    profileMatch,
    band: bandOf(overall),
    matchedSkills: relevant.filter((id) => owned.has(id)).map(skillName),
    missingSkills: relevant.filter((id) => !owned.has(id)).map(skillName),
  }
}

/** Xếp hạng danh sách tin theo mức phù hợp với một ứng viên. */
export function rankJobsForCandidate(
  candidate: Candidate,
  jobs: JobPosting[],
): JobMatchResult[] {
  return jobs
    .map((job) => matchCandidateToJob(candidate, job))
    .sort((a, b) => b.overall - a.overall)
}

/** Xếp hạng ứng viên theo mức phù hợp với một tin. */
export function rankCandidatesForJob(
  candidates: Candidate[],
  job: JobPosting,
): JobMatchResult[] {
  return candidates
    .map((candidate) => ({ candidate, ...matchCandidateToJob(candidate, job) }))
    .sort((a, b) => b.overall - a.overall)
}
