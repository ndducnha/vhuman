import type { MatchingConfig } from './types'

/**
 * Single source of truth for every scoring weight in VHuman.
 *
 * Tuning the product's point of view = editing this object. Nothing else.
 * Weights within each group are expressed as fractions that sum to 1.
 */
export const matchingConfig: MatchingConfig = {
  careerMatch: {
    skills: 0.4,
    experience: 0.25,
    profile: 0.35,
  },
  compatibilitySearch: {
    skills: 0.35,
    career: 0.25,
    compatibility: 0.4,
  },
  profileSearch: {
    skills: 0.4,
    experience: 0.2,
    profile: 0.4,
  },
  bonusSkillWeight: 0.45,
  experienceSaturationYears: 8,
  minimumResultScore: 0,
  /**
   * Bonus applied to a career whose field the star archetype leans toward.
   * Deliberately small: the reflection layer nudges the ranking, it never
   * overrides evidence.
   */
  starAffinityBonus: 4,

  /**
   * Công thức ba lớp cho gợi ý nghề nghiệp.
   *
   * Bằng chứng thật giữ tỉ trọng lớn nhất một cách có chủ ý: lớp Tử Vi soi
   * thiên hướng, nhưng cái người ta đã làm được vẫn là căn cứ chính. Mục tiêu
   * cá nhân đứng thứ ba vì nó cho biết người dùng muốn đi đâu.
   */
  careerFit: {
    /** Lớp A: phản chiếu từ lá số, gồm vector đặc tính và chế độ vận hiện tại. */
    reflection: 0.30,
    /** Lớp B: bằng chứng thật, gồm kỹ năng, kinh nghiệm, học vấn. */
    evidence: 0.50,
    /** Lớp C: mong muốn của người dùng, gồm ngành, vị trí, hình thức, lương. */
    intent: 0.20,
  },
}
