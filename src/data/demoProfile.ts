import type { Candidate, CandidateSkill } from '@/types'
import { SKILL_BY_ID } from '@/data/skills'
import { astrologyEngine } from '@/services/astrology'

/**
 * Pre-filled candidate profile loaded on a visitor's first run.
 *
 * Without it the candidate dashboard starts empty and the 5-step wizard has to
 * be completed before anything can be shown: too slow for a live demo. This
 * profile is flagged `isSample` so the UI can offer to replace it with the
 * visitor's own, and the onboarding flow stays fully demonstrable.
 *
 * The person is fictional.
 */

const SKILLS: Array<[string, CandidateSkill['level']]> = [
  ['sql', 'expert'],
  ['data-analysis', 'expert'],
  ['python', 'proficient'],
  ['statistics', 'proficient'],
  ['power-bi', 'proficient'],
  ['machine-learning', 'intermediate'],
  ['critical-thinking', 'proficient'],
  ['presentation', 'proficient'],
  ['communication', 'intermediate'],
  ['problem-solving', 'proficient'],
  ['business-analysis', 'intermediate'],
  ['project-management', 'basic'],
]

/**
 * The birth inputs were chosen so the derived reflection profile (analytical 93,
 * independence 79) reads coherently next to a data-analysis CV: the same
 * curation applied to every other demo persona. The engine itself is untouched
 * and still purely deterministic on these inputs.
 */
const BIRTH = {
  birthDate: '1991-09-13',
  birthTime: '10:45',
  birthPlace: 'Hà Nội',
  gender: 'male' as const,
}

function skills(): CandidateSkill[] {
  return SKILLS.flatMap(([id, level]) => {
    const skill = SKILL_BY_ID[id]
    if (!skill) return []
    return [{ skillId: skill.id, name: skill.name, category: skill.category, level }]
  })
}

export const DEMO_CANDIDATE: Candidate = {
  id: 'me',
  isSample: true,
  personal: {
    ...BIRTH,
    fullName: 'Nguyễn Văn An',
    currentCity: 'Hà Nội',
    email: 'an.nguyen@demo.vhuman.app',
    phone: '09xx xxx xxx',
    avatar: '',
  },
  education: [
    {
      id: 'me-edu-0',
      school: 'Đại học Kinh tế Quốc dân',
      degree: 'Cử nhân',
      major: 'Toán kinh tế',
      startYear: '2010',
      endYear: '2014',
    },
    {
      id: 'me-edu-1',
      school: 'Đại học Bách khoa Hà Nội',
      degree: 'Thạc sĩ',
      major: 'Khoa học dữ liệu',
      startYear: '2017',
      endYear: '2019',
    },
  ],
  experience: [
    {
      id: 'me-exp-0',
      company: 'Zentra Technology',
      title: 'Chuyên viên phân tích dữ liệu cao cấp',
      startDate: '2023-01',
      endDate: '',
      current: true,
      description:
        'Dẫn dắt nhóm phân tích 3 người, xây dựng hệ thống báo cáo vận hành cho 5 khối kinh doanh và mô hình dự báo nhu cầu theo tuần.',
    },
    {
      id: 'me-exp-1',
      company: 'Shopline Vietnam',
      title: 'Chuyên viên phân tích dữ liệu',
      startDate: '2020-03',
      endDate: '2022-12',
      description:
        'Phân tích hành vi người dùng trên nền tảng thương mại điện tử, xây dựng bộ dashboard theo dõi hiệu quả chiến dịch.',
      current: false,
    },
  ],
  skills: skills(),
  preference: {
    industries: ['Công nghệ', 'Thương mại điện tử', 'Fintech'],
    desiredTitle: 'Trưởng nhóm phân tích dữ liệu',
    seniority: 'senior',
    workModes: ['hybrid', 'remote'],
    preferredLocations: ['Hà Nội', 'Remote'],
    salaryMin: 35,
    salaryMax: 55,
  },
  headline: 'Chuyên viên phân tích dữ liệu cao cấp',
  summary:
    'Chuyên viên phân tích dữ liệu với hơn 6 năm kinh nghiệm biến số liệu vận hành thành quyết định kinh doanh. Quan tâm tới việc xây dựng nền tảng dữ liệu dùng chung và mở rộng sang mảng mô hình dự báo.',
  yearsOfExperience: 6.5,
  astrology: astrologyEngine.analyze(BIRTH),
  createdAt: '2024-01-01T00:00:00.000Z',
  updatedAt: '2024-01-01T00:00:00.000Z',
}

/** Candidates the demo recruiter already has in their shortlist. */
export const DEMO_SAVED_CANDIDATE_IDS = ['c-001', 'c-006', 'c-021']
