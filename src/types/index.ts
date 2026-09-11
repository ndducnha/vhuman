/**
 * VHuman core domain model.
 *
 * These types are the contract between the UI and the engines
 * (astrology / matching / storage). Swapping a mock engine for a real
 * backend implementation must not require changing anything here.
 */

/* ------------------------------------------------------------------ */
/* Shared primitives                                                    */
/* ------------------------------------------------------------------ */

export type Gender = 'male' | 'female' | 'other'

export type SkillLevel = 'basic' | 'intermediate' | 'proficient' | 'expert'

export type SeniorityLevel =
  | 'fresher'
  | 'junior'
  | 'middle'
  | 'senior'
  | 'lead'
  | 'manager'

export type WorkMode = 'onsite' | 'hybrid' | 'remote'

export type ScoreBand = 'low' | 'moderate' | 'good' | 'strong'

/** The eight personal-profile dimensions used across the whole product. */
export interface TraitScores {
  analytical: number
  creative: number
  leadership: number
  communication: number
  independence: number
  teamwork: number
  riskTaking: number
  stability: number
}

export type TraitKey = keyof TraitScores

/* ------------------------------------------------------------------ */
/* Candidate profile                                                    */
/* ------------------------------------------------------------------ */

/** Personal data used to derive the reflection layer. Never leaves the browser in the MVP. */
export interface BirthProfile {
  /** ISO date, e.g. "1996-04-12" */
  birthDate: string
  /** 24h time, e.g. "07:30". Empty string when unknown. */
  birthTime: string
  birthPlace: string
  gender: Gender
}

export interface PersonalInfo extends BirthProfile {
  fullName: string
  currentCity: string
  email: string
  phone: string
  /** Data-URL or empty; avatars fall back to generated initials. */
  avatar: string
}

export interface Education {
  id: string
  school: string
  degree: string
  major: string
  startYear: string
  endYear: string
}

export interface Experience {
  id: string
  company: string
  title: string
  startDate: string
  endDate: string
  current: boolean
  description: string
}

export interface CandidateSkill {
  skillId: string
  name: string
  category: SkillCategory
  level: SkillLevel
}

export interface CareerPreference {
  industries: string[]
  desiredTitle: string
  seniority: SeniorityLevel
  workModes: WorkMode[]
  preferredLocations: string[]
  /** Monthly gross, in millions of VND. */
  salaryMin: number
  salaryMax: number
}

/** The full candidate record: both seeded demo people and the user's own profile. */
export interface Candidate {
  id: string
  personal: PersonalInfo
  education: Education[]
  experience: Experience[]
  skills: CandidateSkill[]
  preference: CareerPreference
  headline: string
  summary: string
  yearsOfExperience: number
  /** Derived, cached at profile-generation time. */
  astrology?: AstrologyProfile
  /** True for the pre-loaded demo profile, false/absent once the visitor builds their own. */
  isSample?: boolean
  createdAt: string
  updatedAt: string
}

/** Partially filled candidate used by the onboarding wizard. */
export interface CandidateDraft {
  step: number
  personal: Partial<PersonalInfo>
  education: Education[]
  experience: Experience[]
  skills: CandidateSkill[]
  preference: Partial<CareerPreference>
  updatedAt: string
}

/* ------------------------------------------------------------------ */
/* Skills & careers taxonomy                                            */
/* ------------------------------------------------------------------ */

export type SkillCategory = 'technology' | 'business' | 'soft' | 'design' | 'other'

export interface Skill {
  id: string
  name: string
  category: SkillCategory
  aliases?: string[]
}

/**
 * Top-level fields the Vietnamese job taxonomy rolls up into.
 * Kept deliberately small so the recruiter filter stays scannable.
 */
export type CareerField =
  | 'cong_nghe'
  | 'kinh_doanh'
  | 'tai_chinh'
  | 'san_xuat'
  | 'chuoi_cung_ung'
  | 'con_nguoi'
  | 'sang_tao'
  | 'dich_vu'
  | 'quan_tri'

/** @deprecated Retained as an alias while call sites migrate. */
export type CareerGroup = CareerField

export interface Career {
  id: string
  name: string
  field: CareerField
  summary: string
  /** Skill ids that matter most for this career, most important first. */
  coreSkills: string[]
  /** Skill ids that differentiate strong candidates. */
  bonusSkills: string[]
  /** The trait shape this career tends to reward, 0-100 per dimension. */
  traitProfile: TraitScores
  roles: string[]
  /** Short, non-deterministic phrasing used in the "why this fits" section. */
  environment: string
  demandNote: string

  /**
   * Khoảng lương tham khảo ở cấp "Chuyên viên", đơn vị triệu VND mỗi tháng.
   * Các cấp khác suy ra từ đây bằng hệ số chuẩn, xem `salaryForLevel`.
   */
  salaryBase: [number, number]
  /** Lộ trình thăng tiến điển hình, từ mới vào nghề tới cấp cao nhất. */
  progression: string[]
  /** Học vấn thường được yêu cầu. */
  education: string
  /** Id các nhóm nghề gần, dùng cho gợi ý "có thể bạn cũng hợp". */
  relatedCareers: string[]
  /** Mức nhu cầu trên thị trường. */
  outlook: CareerOutlook
}

export type CareerOutlook = 'high' | 'steady' | 'niche'

/* ------------------------------------------------------------------ */
/* Lớp phản chiếu cá nhân (astrology)                                */
/* ------------------------------------------------------------------ */

export type StarGroupId =
  | 'tu_phu_vu_tuong'
  | 'sat_pha_tham'
  | 'co_nguyet_dong_luong'
  | 'cu_mon_nhat_hoa'

/**
 * A Tử Vi star grouping, expressed as a working-style archetype.
 * Reference data: the engine selects one, it does not invent them.
 */
export interface StarGroup {
  id: StarGroupId
  name: string
  /** Short, non-deterministic description of the tendency. */
  description: string
  careerArchetypes: string[]
  skillsToHighlight: string[]
  suggestedRoles: string[]
  /** Career-field ids this archetype leans toward, used as a matching nudge. */
  affinityFields: CareerField[]
  /** How the archetype shifts the eight trait dimensions, in points. */
  traitBias: Partial<TraitScores>
}

export type CycleKind = 'dai_van' | 'luu_nien'

/** A destiny period: a decade window (đại vận) or a single year (lưu niên). */
export interface DestinyCycle {
  id: string
  kind: CycleKind
  name: string
  fromYear: number
  toYear: number
  /** Can Chi label for a lưu niên, e.g. "Bính Ngọ". Empty for đại vận. */
  canChi: string
  description: string
  advice: string
  /** Suggested next steps, phrased as options rather than instructions. */
  actions: string[]
}

/**
 * The output of the reflection layer. Deliberately expressed as tendencies 
 * never as destiny, certainty, or prescription.
 */
export interface AstrologyProfile {
  /** Stable id derived from the birth inputs; identical inputs → identical id. */
  signature: string
  personality: string[]
  workingStyle: string[]
  strengths: string[]
  /** Areas worth developing: framed constructively. */
  growthAreas: string[]
  traits: TraitScores
  /** Environments in which this profile tends to do well. */
  preferredEnvironments: string[]
  /** One-paragraph, plain-language summary for the dashboard header. */
  narrative: string
  /** Tử Vi star archetype this profile maps to. */
  starGroup: StarGroup
  /** Current decade window and the year in view. */
  cycles: { major: DestinyCycle; year: DestinyCycle }
  /** Which engine produced this: surfaced in the UI as a provenance badge. */
  engine: string
  engineVersion: string
}

/* ------------------------------------------------------------------ */
/* Matching results                                                     */
/* ------------------------------------------------------------------ */

export interface ScoreBreakdown {
  skills: number
  experience: number
  profile: number
}

export interface CareerRecommendation {
  career: Career
  overall: number
  breakdown: ScoreBreakdown
  band: ScoreBand
  reasons: string[]
  matchedSkills: string[]
  missingSkills: string[]
}

export interface CompatibilityResult {
  score: number
  band: ScoreBand
  summary: string
  highlights: string[]
  considerations: string[]
}

export interface CandidateMatchResult {
  candidate: Candidate
  overall: number
  skillMatch: number
  experienceMatch: number
  /** null when the recruiter has not described a desired profile: nothing to score against. */
  profileMatch: number | null
  careerMatch: number
  compatibility?: CompatibilityResult
  band: ScoreBand
}

/* ------------------------------------------------------------------ */
/* Recruiter side                                                       */
/* ------------------------------------------------------------------ */

export type ManagerRole = 'owner' | 'ceo' | 'direct_manager' | 'team_lead'

export interface ManagerProfile {
  id: string
  fullName: string
  role: ManagerRole
  company: string
  birthDate: string
  birthTime: string
  birthPlace: string
  gender: Gender
  astrology?: AstrologyProfile
  createdAt: string
}

export interface Recruiter {
  id: string
  fullName: string
  company: string
  title: string
  email: string
  location: string
}

/** Everything the "search by personal profile" tab can constrain. */
export interface CandidateSearchFilters {
  query: string
  skills: string[]
  careerGroups: CareerField[]
  seniority: SeniorityLevel[]
  locations: string[]
  minYears: number
  maxYears: number
  degrees: string[]
  salaryMax: number
  workModes: WorkMode[]
  /** Only the traits the recruiter actually touched are scored. */
  traits: Partial<TraitScores>
}

export type SortKey = 'overall' | 'skills' | 'compatibility' | 'experience'

/* ------------------------------------------------------------------ */
/* Tin tuyển dụng & ứng tuyển                                           */
/* ------------------------------------------------------------------ */

export type JobStatus = 'open' | 'draft' | 'closed'

export interface JobPosting {
  id: string
  title: string
  /** Career category this posting belongs to, from the VN taxonomy. */
  careerId: string
  field: CareerField
  company: string
  seniority: SeniorityLevel
  location: string
  workMode: WorkMode
  salaryMin: number
  salaryMax: number
  /** Skill ids the posting asks for, most important first. */
  skills: string[]
  /** Nice-to-have skill ids. */
  bonusSkills: string[]
  openings: number
  status: JobStatus
  postedAt: string
  summary: string
  responsibilities: string[]
  requirements: string[]
  benefits: string[]
  /** Trait shape the hiring manager is looking for, when they specified one. */
  desiredTraits?: Partial<TraitScores>
}

/** How well a candidate fits a posting, mirrored on both sides of the product. */
export interface JobMatchResult {
  job: JobPosting
  overall: number
  skillMatch: number
  experienceMatch: number
  profileMatch: number | null
  band: ScoreBand
  matchedSkills: string[]
  missingSkills: string[]
}

export type ApplicationStage =
  | 'applied'
  | 'reviewing'
  | 'interview'
  | 'offer'
  | 'hired'
  | 'rejected'

export interface Application {
  id: string
  jobId: string
  candidateId: string
  stage: ApplicationStage
  appliedAt: string
  /** Free-text note the candidate attached when applying. */
  coverNote: string
  /** Recruiter-side note, never shown to the candidate in this demo. */
  recruiterNote: string
  updatedAt: string
}

/** Pipeline state a recruiter keeps against a saved candidate. */
export type ShortlistStage = 'saved' | 'contacted' | 'interview' | 'offer' | 'passed'

export interface ShortlistEntry {
  candidateId: string
  stage: ShortlistStage
  note: string
  savedAt: string
  updatedAt: string
}

/* ------------------------------------------------------------------ */
/* Milestone roadmap                                                    */
/* ------------------------------------------------------------------ */

export type MilestoneKind = 'skill' | 'cycle' | 'career' | 'application'

export interface Milestone {
  id: string
  kind: MilestoneKind
  title: string
  detail: string
  /** Months from now when this is suggested to happen. */
  monthOffset: number
  done: boolean
}

/* ------------------------------------------------------------------ */
/* Demo session                                                         */
/* ------------------------------------------------------------------ */

export type DemoRole = 'candidate' | 'recruiter'
