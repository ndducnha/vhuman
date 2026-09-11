import type { CareerTraitKey, CareerTraitVector } from '@/types/tuvi'
import type { Career, CareerField } from '@/types'

/**
 * Vector đặc tính cho từng nhóm nghề.
 *
 * Danh mục nghề không cần biết gì về Tử Vi. Hai bên gặp nhau ở đúng một chỗ:
 * vector 16 chiều. Nhờ vậy thêm nghề mới chỉ là thêm một vector, và đổi engine
 * Tử Vi không đụng gì tới danh mục nghề.
 */

const K: CareerTraitKey[] = [
  'leadership', 'governance', 'resource_management', 'execution',
  'entrepreneurship', 'transformation', 'risk_tolerance',
  'analysis', 'research', 'technical',
  'communication', 'public_visibility',
  'service', 'creativity', 'autonomy', 'structure',
]

/** Viết gọn: chỉ nêu chiều nào đáng kể, còn lại lấy mức nền. */
function v(base: number, overrides: Partial<Record<CareerTraitKey, number>>): CareerTraitVector {
  return K.reduce((acc, key) => {
    acc[key] = overrides[key] ?? base
    return acc
  }, {} as CareerTraitVector)
}

export const CAREER_TRAIT_VECTORS: Record<string, CareerTraitVector> = {
  it_phan_mem: v(0.3, { technical: 0.95, analysis: 0.8, execution: 0.75, autonomy: 0.7, structure: 0.6, creativity: 0.55 }),
  it_phan_cung_mang: v(0.3, { technical: 0.9, structure: 0.75, execution: 0.7, service: 0.55, analysis: 0.6 }),
  phan_tich_du_lieu: v(0.3, { analysis: 0.95, research: 0.8, technical: 0.75, communication: 0.6, structure: 0.6 }),
  khoa_hoc_ky_thuat: v(0.3, { research: 0.95, analysis: 0.9, technical: 0.8, autonomy: 0.75, creativity: 0.65 }),

  ban_hang_kinh_doanh: v(0.3, { communication: 0.9, entrepreneurship: 0.8, risk_tolerance: 0.7, public_visibility: 0.65, execution: 0.6 }),
  marketing_truyen_thong: v(0.3, { communication: 0.85, creativity: 0.85, public_visibility: 0.75, analysis: 0.6, entrepreneurship: 0.6 }),
  ban_si_ban_le: v(0.3, { service: 0.8, communication: 0.75, execution: 0.7, structure: 0.6, leadership: 0.5 }),
  bat_dong_san: v(0.3, { communication: 0.85, entrepreneurship: 0.85, risk_tolerance: 0.8, public_visibility: 0.65, autonomy: 0.7 }),
  cham_soc_khach_hang: v(0.3, { service: 0.95, communication: 0.85, structure: 0.6, analysis: 0.45 }),

  ke_toan: v(0.3, { structure: 0.95, resource_management: 0.85, analysis: 0.75, governance: 0.7, execution: 0.6 }),
  tai_chinh_dau_tu: v(0.3, { analysis: 0.9, resource_management: 0.9, risk_tolerance: 0.8, autonomy: 0.7, execution: 0.65 }),
  ngan_hang: v(0.3, { resource_management: 0.8, structure: 0.8, communication: 0.75, governance: 0.7, service: 0.6 }),
  bao_hiem: v(0.3, { communication: 0.8, resource_management: 0.7, structure: 0.75, service: 0.7, analysis: 0.65 }),
  kiem_toan: v(0.3, { governance: 0.95, analysis: 0.85, structure: 0.9, autonomy: 0.65, communication: 0.6 }),

  san_xuat_lap_rap: v(0.3, { execution: 0.9, structure: 0.85, technical: 0.7, leadership: 0.6, governance: 0.55 }),
  van_hanh_bao_tri: v(0.3, { execution: 0.9, technical: 0.85, structure: 0.8, autonomy: 0.6, analysis: 0.6 }),
  quan_ly_chat_luong: v(0.3, { governance: 0.9, structure: 0.9, analysis: 0.8, technical: 0.65, execution: 0.6 }),
  xay_dung: v(0.3, { execution: 0.85, leadership: 0.7, technical: 0.75, structure: 0.8, resource_management: 0.65 }),
  khai_thac_khoang_san: v(0.3, { technical: 0.85, analysis: 0.8, execution: 0.75, autonomy: 0.7, risk_tolerance: 0.6 }),
  nong_lam_ngu_nghiep: v(0.3, { technical: 0.7, execution: 0.75, autonomy: 0.7, structure: 0.7, research: 0.55 }),

  thu_mua_kho_van: v(0.3, { execution: 0.85, resource_management: 0.8, structure: 0.85, communication: 0.65, analysis: 0.6 }),
  xuat_nhap_khau: v(0.3, { structure: 0.9, communication: 0.7, resource_management: 0.7, analysis: 0.6, governance: 0.6 }),
  van_tai_giao_nhan: v(0.3, { execution: 0.8, autonomy: 0.85, structure: 0.75, service: 0.6 }),

  nhan_su: v(0.3, { service: 0.85, communication: 0.9, governance: 0.7, structure: 0.65, leadership: 0.6 }),
  giao_duc_dao_tao: v(0.3, { communication: 0.9, service: 0.85, public_visibility: 0.7, research: 0.6, creativity: 0.6 }),
  y_te_suc_khoe: v(0.3, { service: 0.95, analysis: 0.8, structure: 0.8, research: 0.6, communication: 0.7 }),

  thiet_ke_sang_tao: v(0.3, { creativity: 0.95, autonomy: 0.75, communication: 0.6, technical: 0.55, public_visibility: 0.5 }),
  kien_truc_noi_that: v(0.3, { creativity: 0.9, technical: 0.75, structure: 0.7, communication: 0.65, execution: 0.6 }),

  hanh_chinh_thu_ky: v(0.3, { structure: 0.9, service: 0.75, communication: 0.7, resource_management: 0.55 }),
  an_ninh_bao_ve: v(0.3, { structure: 0.85, execution: 0.75, autonomy: 0.7, governance: 0.6, service: 0.55 }),
  khach_san_nha_hang: v(0.3, { service: 0.95, communication: 0.85, execution: 0.7, structure: 0.6 }),

  quan_ly_du_an: v(0.3, { leadership: 0.85, governance: 0.8, communication: 0.85, execution: 0.75, structure: 0.8 }),
  phap_ly: v(0.3, { governance: 0.9, analysis: 0.9, communication: 0.85, structure: 0.85, research: 0.7 }),
  nghe_nghiep_khac: v(0.4, { service: 0.55, structure: 0.55, execution: 0.55 }),
}

/** Mức nền theo lĩnh vực, dùng khi một nghề chưa có vector riêng. */
const FIELD_FALLBACK: Record<CareerField, Partial<Record<CareerTraitKey, number>>> = {
  cong_nghe: { technical: 0.8, analysis: 0.75 },
  kinh_doanh: { communication: 0.8, entrepreneurship: 0.7 },
  tai_chinh: { resource_management: 0.8, structure: 0.8 },
  san_xuat: { execution: 0.8, structure: 0.8 },
  chuoi_cung_ung: { execution: 0.8, structure: 0.8 },
  con_nguoi: { service: 0.85, communication: 0.8 },
  sang_tao: { creativity: 0.9, autonomy: 0.7 },
  dich_vu: { service: 0.85, structure: 0.65 },
  quan_tri: { governance: 0.8, leadership: 0.75 },
}

export function vectorForCareer(career: Career): CareerTraitVector {
  return CAREER_TRAIT_VECTORS[career.id] ?? v(0.35, FIELD_FALLBACK[career.field])
}

/**
 * Độ khớp giữa hai vector, trả về 0 tới 100.
 *
 * Gồm hai phần, vì chỉ một phần thôi thì không đủ:
 *
 * HÌNH DẠNG, 65%. Trừ đi trung bình của chính mỗi vector rồi mới so. Cách này
 * trả lời đúng câu hỏi cần hỏi: người này nổi trội ở đúng những chiều mà nghề
 * kia đòi hỏi nhất hay không. Nếu chỉ so giá trị tuyệt đối thì mọi nghề đều
 * chấm gần giống nhau, vì hai vector nằm ở hai dải khác nhau.
 *
 * MỨC ĐỘ, 35%. Hình dạng đúng nhưng cường độ quá thấp so với đòi hỏi của nghề
 * thì vẫn là chưa đủ, nên phần này giữ lại tín hiệu về độ mạnh.
 */
export function vectorMatch(person: CareerTraitVector, job: CareerTraitVector): number {
  const personMean = K.reduce((sum, k) => sum + person[k], 0) / K.length
  const jobMean = K.reduce((sum, k) => sum + job[k], 0) / K.length

  let dot = 0
  let normP = 0
  let normJ = 0
  let weightedGap = 0
  let totalWeight = 0

  for (const key of K) {
    const p = person[key] - personMean
    const j = job[key] - jobMean
    dot += p * j
    normP += p * p
    normJ += j * j

    const want = job[key]
    const have = person[key]
    const weight = 0.25 + want
    // Vượt yêu cầu không bị phạt nặng như thiếu.
    const gap = have >= want ? (have - want) * 0.3 : want - have
    weightedGap += gap * weight
    totalWeight += weight
  }

  // Tương quan nằm trong khoảng -1 tới 1, đổi về 0 tới 100.
  const denom = Math.sqrt(normP * normJ) || 1
  const shape = ((dot / denom) + 1) / 2

  const avgGap = weightedGap / (totalWeight || 1)
  const level = Math.max(0, 1 - avgGap * 1.35)

  return Math.round(Math.max(0, Math.min(100, (shape * 0.65 + level * 0.35) * 100)))
}

export const TRAIT_KEYS = K
