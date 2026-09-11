import type {
  Gender,
  ManagerRole,
  SeniorityLevel,
  SkillCategory,
  SkillLevel,
  TraitKey,
  WorkMode,
  CareerField,
} from '@/types'

export const TRAIT_LABEL: Record<TraitKey, string> = {
  analytical: 'Tư duy phân tích',
  creative: 'Sáng tạo',
  leadership: 'Lãnh đạo',
  communication: 'Giao tiếp',
  independence: 'Độc lập',
  teamwork: 'Làm việc nhóm',
  riskTaking: 'Chấp nhận rủi ro',
  stability: 'Ổn định',
}

export const TRAIT_ORDER: TraitKey[] = [
  'analytical',
  'creative',
  'leadership',
  'communication',
  'independence',
  'teamwork',
  'riskTaking',
  'stability',
]

export const SKILL_LEVEL_LABEL: Record<SkillLevel, string> = {
  basic: 'Cơ bản',
  intermediate: 'Trung bình',
  proficient: 'Thành thạo',
  expert: 'Chuyên gia',
}

export const SKILL_LEVEL_ORDER: SkillLevel[] = ['basic', 'intermediate', 'proficient', 'expert']

/** Numeric weight of a self-reported skill level, used by the matching engine. */
export const SKILL_LEVEL_WEIGHT: Record<SkillLevel, number> = {
  basic: 0.55,
  intermediate: 0.75,
  proficient: 0.9,
  expert: 1,
}

export const SENIORITY_LABEL: Record<SeniorityLevel, string> = {
  fresher: 'Mới ra trường',
  junior: 'Nhân viên',
  middle: 'Chuyên viên',
  senior: 'Chuyên viên chính',
  lead: 'Trưởng nhóm',
  manager: 'Quản lý',
}

export const SENIORITY_ORDER: SeniorityLevel[] = [
  'fresher',
  'junior',
  'middle',
  'senior',
  'lead',
  'manager',
]

/** Typical years of experience associated with each seniority step. */
export const SENIORITY_YEARS: Record<SeniorityLevel, number> = {
  fresher: 0,
  junior: 1.5,
  middle: 3.5,
  senior: 6,
  lead: 8,
  manager: 10,
}

export const WORK_MODE_LABEL: Record<WorkMode, string> = {
  onsite: 'Tại văn phòng',
  hybrid: 'Kết hợp',
  remote: 'Từ xa',
}

export const GENDER_LABEL: Record<Gender, string> = {
  male: 'Nam',
  female: 'Nữ',
  other: 'Khác',
}

export const MANAGER_ROLE_LABEL: Record<ManagerRole, string> = {
  owner: 'Chủ doanh nghiệp',
  ceo: 'CEO',
  direct_manager: 'Quản lý trực tiếp',
  team_lead: 'Trưởng nhóm',
}

export const SKILL_CATEGORY_LABEL: Record<SkillCategory, string> = {
  technology: 'Công nghệ',
  business: 'Kinh doanh',
  soft: 'Kỹ năng mềm',
  design: 'Thiết kế',
  other: 'Khác',
}

export const CAREER_FIELD_LABEL: Record<CareerField, string> = {
  cong_nghe: 'Công nghệ',
  kinh_doanh: 'Kinh doanh',
  tai_chinh: 'Tài chính',
  san_xuat: 'Sản xuất - Kỹ thuật',
  chuoi_cung_ung: 'Chuỗi cung ứng',
  con_nguoi: 'Con người',
  sang_tao: 'Sáng tạo',
  dich_vu: 'Dịch vụ',
  quan_tri: 'Quản trị',
}

export const CAREER_FIELD_ORDER: CareerField[] = [
  'cong_nghe',
  'kinh_doanh',
  'tai_chinh',
  'san_xuat',
  'chuoi_cung_ung',
  'con_nguoi',
  'sang_tao',
  'dich_vu',
  'quan_tri',
]

/** "Nguyễn Minh Anh" → "NMA" (max 3 letters). */
export function initialsOf(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return 'VH'
  const letters = parts.map((p) => p.charAt(0).toUpperCase())
  if (letters.length <= 3) return letters.join('')
  return [letters[0], letters[letters.length - 2], letters[letters.length - 1]].join('')
}

export function formatYears(years: number): string {
  if (years <= 0) return 'Mới bắt đầu'
  if (years < 1) return 'Dưới 1 năm'
  return `${Math.round(years * 10) / 10} năm kinh nghiệm`
}

/** Salary is stored in millions of VND per month. */
export function formatSalary(min: number, max: number): string {
  if (!min && !max) return 'Thoả thuận'
  if (!max) return `Từ ${min} triệu`
  if (!min) return `Đến ${max} triệu`
  return `${min}-${max} triệu`
}

export function formatMonth(value: string): string {
  if (!value) return 'Chưa có'
  const [year, month] = value.split('-')
  if (!month) return year ?? value
  return `${month}/${year}`
}

export function formatDateVi(value: string): string {
  if (!value) return 'Chưa có'
  const [year, month, day] = value.split('-')
  if (!day) return value
  return `${day}/${month}/${year}`
}

export function formatPeriod(start: string, end: string, current: boolean): string {
  const from = formatMonth(start)
  const to = current ? 'Hiện tại' : formatMonth(end) || 'Hiện tại'
  return from ? `${from} - ${to}` : to
}

/** Deterministic gradient for initials avatars: no external image service. */
export function avatarGradient(seed: string): string {
  // Warm, earthy pairs that sit with the cream/teal/crimson identity 
  // cool blues and violets read as foreign against the paper ground.
  const palettes = [
    'from-teal-800 to-teal-600',
    'from-rose-900 to-rose-700',
    'from-amber-800 to-amber-600',
    'from-emerald-900 to-emerald-700',
    'from-stone-700 to-stone-500',
    'from-orange-900 to-orange-700',
    'from-cyan-900 to-cyan-700',
    'from-lime-900 to-lime-700',
  ]
  let sum = 0
  for (let i = 0; i < seed.length; i += 1) sum += seed.charCodeAt(i)
  return palettes[sum % palettes.length] as string
}
