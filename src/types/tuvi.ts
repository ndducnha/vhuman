/**
 * Tử Vi Career Classification: mô hình dữ liệu.
 *
 * Lá số được quy về một vector đặc tính nghề nghiệp máy đọc được, rồi khớp với
 * vector của từng nhóm nghề. Nhờ vậy thêm nghề mới không cần đụng tới logic Tử
 * Vi, và ngược lại đổi engine Tử Vi không cần sửa danh mục nghề.
 *
 * Toàn bộ số liệu ở đây là heuristic nội bộ của VHuman, không phải xác suất
 * khoa học và không phải quy tắc cổ điển.
 */

/* ── Level 1: bốn nhóm chính tinh ──────────────────────────────── */

export type CareerFamilyId =
  | 'tu_phu_vu_tuong_liem'
  | 'sat_pha_tham'
  | 'co_nguyet_dong_luong'
  | 'cu_nhat'

export interface CareerFamily {
  id: CareerFamilyId
  /** Tên theo cách gọi Tử Vi. */
  name: string
  /** Cách VHuman diễn đạt sang ngôn ngữ nghề nghiệp. */
  archetype: string
  description: string
  stars: StarId[]
  coreTraits: CareerTraitKey[]
  careerDirections: string[]
}

/* ── Level 2: mười bốn chính tinh ──────────────────────────────── */

export type StarId =
  | 'tu_vi' | 'thien_phu' | 'vu_khuc' | 'thien_tuong' | 'liem_trinh'
  | 'that_sat' | 'pha_quan' | 'tham_lang'
  | 'thien_co' | 'thai_am' | 'thien_dong' | 'thien_luong'
  | 'cu_mon' | 'thai_duong'

export interface StarArchetype {
  id: StarId
  name: string
  family: CareerFamilyId
  /** Đặc tính nghề nghiệp sao này đóng góp, kèm trọng số 0 tới 1. */
  traits: Partial<Record<CareerTraitKey, number>>
  summary: string
}

/* ── Level 3: tổ hợp sao ───────────────────────────────────────── */

export interface HybridArchetype {
  id: string
  /** Tên tổ hợp, ví dụ "Tử Sát". */
  name: string
  /** Cách VHuman gọi, ví dụ "Chỉ huy chiến lược". */
  archetype: string
  stars: [StarId, StarId]
  direction: string
  /** Điều chỉnh thêm lên vector đặc tính, tính theo điểm cộng trừ. */
  traitBias: Partial<Record<CareerTraitKey, number>>
}

/* ── Level 4: cung và modifier ─────────────────────────────────── */

export type PalaceId = 'menh' | 'quan_loc' | 'than' | 'tai_bach' | 'thien_di' | 'phuc_no'

export interface Palace {
  id: PalaceId
  name: string
  /** Trọng số khi tổng hợp vector, cộng lại bằng 1. */
  weight: number
  meaning: string
}

/** Tứ Hóa, chỉ đóng vai trò điều chỉnh chứ không đổi archetype. */
export type TransformId = 'hoa_loc' | 'hoa_quyen' | 'hoa_khoa' | 'hoa_ky'

export interface Transform {
  id: TransformId
  name: string
  effect: string
  traitBias: Partial<Record<CareerTraitKey, number>>
}

/**
 * Miếu, Vượng, Đắc, Hãm.
 * Không phải tốt xấu, mà là độ rõ khi biểu hiện và mức ma sát gặp phải.
 */
export type Brightness = 'mieu' | 'vuong' | 'dac' | 'ham'

/* ── Vector đặc tính nghề nghiệp ───────────────────────────────── */

export type CareerTraitKey =
  | 'leadership' | 'governance' | 'resource_management' | 'execution'
  | 'entrepreneurship' | 'transformation' | 'risk_tolerance'
  | 'analysis' | 'research' | 'technical'
  | 'communication' | 'public_visibility'
  | 'service' | 'creativity' | 'autonomy' | 'structure'

/** Giá trị 0 tới 1 cho từng chiều. */
export type CareerTraitVector = Record<CareerTraitKey, number>

/* ── Level 5: chế độ nghề nghiệp theo vận ──────────────────────── */

export type CareerMode =
  | 'LEARN' | 'BUILD' | 'EXPAND' | 'LEAD' | 'TRANSFORM' | 'CONSOLIDATE' | 'CAUTION'

export interface CareerCycleState {
  mode: CareerMode
  confidence: Confidence
  /** Đại vận đang diễn ra. */
  majorLabel: string
  majorFrom: number
  majorTo: number
  /** Lưu niên đang xét. */
  yearLabel: string
  year: number
  canChi: string
  summary: string
  actions: string[]
}

export type Confidence = 'low' | 'medium' | 'high'

/* ── Kết quả phân loại ─────────────────────────────────────────── */

export interface FamilyScore {
  family: CareerFamilyId
  /** Phần trăm đóng góp, cả bốn cộng lại bằng 100. */
  percent: number
}

export interface StarPlacement {
  star: StarId
  palace: PalaceId
  brightness: Brightness
  transform?: TransformId
}

export interface TuViCareerProfile {
  /** Chữ ký ổn định, cùng dữ liệu sinh luôn cho cùng chữ ký. */
  signature: string
  /** Phân bố bốn nhóm, đã sắp giảm dần. */
  families: FamilyScore[]
  dominantFamily: CareerFamilyId
  secondaryFamily: CareerFamilyId
  /** Sao nổi bật, sắp theo mức đóng góp. */
  dominantStars: StarPlacement[]
  hybrid?: HybridArchetype
  traits: CareerTraitVector
  cycle: CareerCycleState
  confidence: Confidence
  /** Vì sao ra kết quả này, viết cho người đọc. */
  explanations: string[]
  /** Điểm cần lưu ý, không phải điềm xấu. */
  cautions: string[]
}

/* ── Hợp đồng với engine ───────────────────────────────────────── */

export interface TuViChart {
  birthDate: string
  birthTime: string
  birthPlace: string
  gender: 'male' | 'female' | 'other'
}

/**
 * Điểm thay thế engine thật.
 *
 * Bản MVP dùng engine mô phỏng tất định. Khi có engine Tử Vi đầy đủ, chỉ cần
 * một lớp mới thoả interface này, không đụng tới giao diện.
 */
export interface AstrologyCareerProvider {
  readonly name: string
  readonly version: string
  classifyCareerProfile(chart: TuViChart): TuViCareerProfile
  calculateCareerCycle(chart: TuViChart, date: Date): CareerCycleState
}
