import type { Candidate } from '@/types'
import type { CareerRecommendation } from '@/types'

/**
 * Shareable profile export.
 *
 * Birth date, time and place are deliberately omitted: they are the most
 * sensitive inputs in the product and nothing downstream needs them. What the
 * reflection layer *derived* travels instead, alongside a non-reversible
 * signature, so a recipient can verify two exports describe the same profile
 * without ever learning when the person was born.
 */
export interface ProfileExport {
  schema: 'vhuman.profile/v1'
  exportedAt: string
  personal: { fullName: string; currentCity: string; headline: string }
  evidence_profile: {
    education: string[]
    experience: Array<{ role: string; company: string; period: string }>
    experience_years: number
    skills: Array<{ name: string; level: string }>
    preference: {
      desiredTitle: string
      seniority: string
      workModes: string[]
      industries: string[]
    }
  }
  destiny_profile: {
    signature: string
    star_group: { id: string; name: string; career_archetypes: string[] }
    cycles: { dai_van: string; luu_nien: string; can_chi: string }
    traits: Record<string, number>
    /** Birth inputs are intentionally excluded: see the note above. */
    birth_data_included: false
  }
  recommendations: Array<{
    career: string
    field: string
    overall: number
    breakdown: { skills: number; experience: number; profile: number }
    missing_skills: string[]
  }>
  disclaimer: string
}

const DISCLAIMER =
  'Kết quả trong hồ sơ này mang tính tham khảo nhằm hỗ trợ khám phá bản thân và định hướng nghề ' +
  'nghiệp, không nên được dùng như căn cứ duy nhất cho quyết định tuyển dụng, giáo dục hoặc nghề nghiệp.'

export function buildProfileExport(
  candidate: Candidate,
  recommendations: CareerRecommendation[],
): ProfileExport {
  const astro = candidate.astrology

  return {
    schema: 'vhuman.profile/v1',
    exportedAt: new Date().toISOString(),
    personal: {
      fullName: candidate.personal.fullName,
      currentCity: candidate.personal.currentCity,
      headline: candidate.headline,
    },
    evidence_profile: {
      education: candidate.education.map(
        (e) => `${e.school}${e.degree ? `, ${e.degree}` : ''}${e.major ? ` ${e.major}` : ''} (${e.startYear}-${e.endYear})`,
      ),
      experience: candidate.experience.map((e) => ({
        role: e.title,
        company: e.company,
        period: `${e.startDate}-${e.current ? 'hiện tại' : e.endDate}`,
      })),
      experience_years: candidate.yearsOfExperience,
      skills: candidate.skills.map((s) => ({ name: s.name, level: s.level })),
      preference: {
        desiredTitle: candidate.preference.desiredTitle,
        seniority: candidate.preference.seniority,
        workModes: candidate.preference.workModes,
        industries: candidate.preference.industries,
      },
    },
    destiny_profile: {
      signature: astro?.signature ?? '',
      star_group: astro
        ? {
            id: astro.starGroup.id,
            name: astro.starGroup.name,
            career_archetypes: astro.starGroup.careerArchetypes,
          }
        : { id: '', name: '', career_archetypes: [] },
      cycles: {
        dai_van: astro?.cycles.major.name ?? '',
        luu_nien: astro?.cycles.year.name ?? '',
        can_chi: astro?.cycles.year.canChi ?? '',
      },
      traits: astro ? { ...astro.traits } : {},
      birth_data_included: false,
    },
    recommendations: recommendations.map((rec) => ({
      career: rec.career.name,
      field: rec.career.field,
      overall: rec.overall,
      breakdown: rec.breakdown,
      missing_skills: rec.missingSkills,
    })),
    disclaimer: DISCLAIMER,
  }
}

/** Triggers a client-side download of the export as pretty-printed JSON. */
export function downloadProfileExport(data: ProfileExport): void {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `vhuman-profile-${data.destiny_profile.signature || 'export'}.json`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}
