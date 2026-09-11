import type {
  CareerFamily, CareerFamilyId, CareerMode, HybridArchetype,
  Palace, PalaceId, StarArchetype, StarId, Transform,
} from '@/types/tuvi'

/* ── Level 1: bốn nhóm chính tinh ──────────────────────────────── */

export const CAREER_FAMILIES: CareerFamily[] = [
  {
    id: 'tu_phu_vu_tuong_liem',
    name: 'Tử Phủ Vũ Tướng Liêm',
    archetype: 'Quản trị và điều hành',
    description:
      'Nhóm thiên về tổ chức, giữ kỷ cương và chịu trách nhiệm về nguồn lực. Thường hợp với công việc có cấu trúc rõ và phạm vi quản lý.',
    stars: ['tu_vi', 'thien_phu', 'vu_khuc', 'thien_tuong', 'liem_trinh'],
    coreTraits: ['leadership', 'governance', 'resource_management', 'execution', 'structure'],
    careerDirections: ['Quản lý', 'Vận hành', 'Tài chính', 'Quản lý dự án', 'Tuân thủ', 'Quản trị doanh nghiệp'],
  },
  {
    id: 'sat_pha_tham',
    name: 'Sát Phá Tham',
    archetype: 'Kiến tạo và chuyển đổi',
    description:
      'Nhóm thiên về hành động, chấp nhận rủi ro và làm cái mới. Thường hợp với giai đoạn xây mới hoặc tái cấu trúc.',
    stars: ['that_sat', 'pha_quan', 'tham_lang'],
    coreTraits: ['transformation', 'entrepreneurship', 'risk_tolerance', 'autonomy', 'execution'],
    careerDirections: ['Khởi nghiệp', 'Phát triển sản phẩm', 'Phát triển kinh doanh', 'Đổi mới', 'Tái cấu trúc'],
  },
  {
    id: 'co_nguyet_dong_luong',
    name: 'Cơ Nguyệt Đồng Lương',
    archetype: 'Tri thức và tư vấn',
    description:
      'Nhóm thiên về phân tích, tích luỹ chuyên môn và hỗ trợ người khác. Thường hợp với môi trường học thuật hoặc chuyên gia.',
    stars: ['thien_co', 'thai_am', 'thien_dong', 'thien_luong'],
    coreTraits: ['analysis', 'research', 'service', 'structure', 'technical'],
    careerDirections: ['Nghiên cứu', 'Dữ liệu', 'Tư vấn', 'Chiến lược', 'Giáo dục', 'Y tế', 'Chuyên gia'],
  },
  {
    id: 'cu_nhat',
    name: 'Cự Nhật',
    archetype: 'Truyền đạt và ảnh hưởng',
    description:
      'Nhóm thiên về ngôn từ, lập luận và tạo ảnh hưởng ra bên ngoài. Thường hợp với công việc cần thuyết phục và xuất hiện trước đám đông.',
    stars: ['cu_mon', 'thai_duong'],
    coreTraits: ['communication', 'public_visibility', 'analysis', 'leadership'],
    careerDirections: ['Luật', 'Tư vấn', 'Kinh doanh', 'Marketing', 'Truyền thông', 'Giảng dạy', 'Chính sách'],
  },
]

export const FAMILY_BY_ID: Record<CareerFamilyId, CareerFamily> = Object.fromEntries(
  CAREER_FAMILIES.map((f) => [f.id, f]),
) as Record<CareerFamilyId, CareerFamily>

/* ── Level 2: mười bốn chính tinh ──────────────────────────────── */

export const STAR_ARCHETYPES: StarArchetype[] = [
  { id: 'tu_vi', name: 'Tử Vi', family: 'tu_phu_vu_tuong_liem', summary: 'Đứng đầu, định hướng, giữ vai trò trung tâm.',
    traits: { leadership: 0.95, governance: 0.85, structure: 0.7, execution: 0.65, public_visibility: 0.55 } },
  { id: 'thien_phu', name: 'Thiên Phủ', family: 'tu_phu_vu_tuong_liem', summary: 'Giữ của, tổ chức nguồn lực, ưa ổn định.',
    traits: { resource_management: 0.95, governance: 0.75, structure: 0.85, execution: 0.6, analysis: 0.5 } },
  { id: 'vu_khuc', name: 'Vũ Khúc', family: 'tu_phu_vu_tuong_liem', summary: 'Quyết đoán với con số, kỷ luật, làm tới cùng.',
    traits: { execution: 0.95, resource_management: 0.85, analysis: 0.7, structure: 0.75, autonomy: 0.6 } },
  { id: 'thien_tuong', name: 'Thiên Tướng', family: 'tu_phu_vu_tuong_liem', summary: 'Điều phối, hoà giải, hỗ trợ người đứng đầu.',
    traits: { governance: 0.7, communication: 0.75, service: 0.7, structure: 0.65, leadership: 0.55 } },
  { id: 'liem_trinh', name: 'Liêm Trinh', family: 'tu_phu_vu_tuong_liem', summary: 'Nguyên tắc, kiểm soát, giữ chuẩn mực.',
    traits: { governance: 0.9, structure: 0.85, analysis: 0.7, technical: 0.6, execution: 0.65 } },

  { id: 'that_sat', name: 'Thất Sát', family: 'sat_pha_tham', summary: 'Quyết định nhanh, chịu áp lực, tự mình gánh việc.',
    traits: { execution: 0.9, autonomy: 0.9, risk_tolerance: 0.85, leadership: 0.6, transformation: 0.6 } },
  { id: 'pha_quan', name: 'Phá Quân', family: 'sat_pha_tham', summary: 'Phá cái cũ dựng cái mới, không ngại xáo trộn.',
    traits: { transformation: 0.95, entrepreneurship: 0.8, risk_tolerance: 0.85, creativity: 0.7, autonomy: 0.75 } },
  { id: 'tham_lang', name: 'Tham Lang', family: 'sat_pha_tham', summary: 'Quan hệ rộng, nhạy cơ hội, thích mở rộng.',
    traits: { entrepreneurship: 0.9, communication: 0.8, creativity: 0.75, public_visibility: 0.7, risk_tolerance: 0.7 } },

  { id: 'thien_co', name: 'Thiên Cơ', family: 'co_nguyet_dong_luong', summary: 'Nghĩ nhiều phương án, giỏi gỡ vấn đề.',
    traits: { analysis: 0.95, technical: 0.8, research: 0.7, creativity: 0.65, structure: 0.6 } },
  { id: 'thai_am', name: 'Thái Âm', family: 'co_nguyet_dong_luong', summary: 'Tỉ mỉ, làm sâu, thiên về nội dung và tài sản.',
    traits: { research: 0.9, analysis: 0.8, resource_management: 0.7, creativity: 0.6, autonomy: 0.6 } },
  { id: 'thien_dong', name: 'Thiên Đồng', family: 'co_nguyet_dong_luong', summary: 'Ôn hoà, dễ gần, hợp việc chăm sóc con người.',
    traits: { service: 0.95, communication: 0.7, structure: 0.5, creativity: 0.5, analysis: 0.45 } },
  { id: 'thien_luong', name: 'Thiên Lương', family: 'co_nguyet_dong_luong', summary: 'Che chở, chỉ dẫn, coi trọng đạo lý nghề.',
    traits: { service: 0.85, governance: 0.65, communication: 0.7, research: 0.65, public_visibility: 0.5 } },

  { id: 'cu_mon', name: 'Cự Môn', family: 'cu_nhat', summary: 'Lập luận sắc, tranh biện, đi tới tận cùng vấn đề.',
    traits: { communication: 0.95, analysis: 0.85, public_visibility: 0.6, research: 0.6, autonomy: 0.6 } },
  { id: 'thai_duong', name: 'Thái Dương', family: 'cu_nhat', summary: 'Toả sáng ra ngoài, dẫn dắt đám đông, truyền cảm hứng.',
    traits: { public_visibility: 0.95, communication: 0.85, leadership: 0.75, service: 0.6, creativity: 0.55 } },
]

export const STAR_BY_ID: Record<StarId, StarArchetype> = Object.fromEntries(
  STAR_ARCHETYPES.map((s) => [s.id, s]),
) as Record<StarId, StarArchetype>

/* ── Level 3: tổ hợp ───────────────────────────────────────────── */

export const HYBRID_ARCHETYPES: HybridArchetype[] = [
  { id: 'tu_sat', name: 'Tử Sát', archetype: 'Chỉ huy chiến lược', stars: ['tu_vi', 'that_sat'],
    direction: 'Điều hành, vận hành, dẫn dắt trong môi trường áp lực cao',
    traitBias: { leadership: 0.1, execution: 0.1, autonomy: 0.05 } },
  { id: 'tu_pha', name: 'Tử Phá', archetype: 'Người dẫn dắt chuyển đổi', stars: ['tu_vi', 'pha_quan'],
    direction: 'Đổi mới, khởi nghiệp, tái cấu trúc tổ chức',
    traitBias: { transformation: 0.12, leadership: 0.08, risk_tolerance: 0.06 } },
  { id: 'tu_tham', name: 'Tử Tham', archetype: 'Người dẫn dắt thương mại', stars: ['tu_vi', 'tham_lang'],
    direction: 'Lãnh đạo kinh doanh, tăng trưởng, phát triển thị trường',
    traitBias: { entrepreneurship: 0.1, leadership: 0.08, communication: 0.06 } },
  { id: 'vu_sat', name: 'Vũ Sát', archetype: 'Thực thi và kiểm soát rủi ro', stars: ['vu_khuc', 'that_sat'],
    direction: 'Tài chính, quản trị rủi ro, vận hành kỹ thuật',
    traitBias: { execution: 0.12, resource_management: 0.08, risk_tolerance: 0.05 } },
  { id: 'vu_pha', name: 'Vũ Phá', archetype: 'Chuyển đổi vận hành', stars: ['vu_khuc', 'pha_quan'],
    direction: 'Tái cấu trúc, fintech, vận hành sản phẩm',
    traitBias: { transformation: 0.1, execution: 0.08, technical: 0.06 } },
  { id: 'vu_tham', name: 'Vũ Tham', archetype: 'Thương mại và tài chính', stars: ['vu_khuc', 'tham_lang'],
    direction: 'Đầu tư, kinh doanh, khởi nghiệp',
    traitBias: { entrepreneurship: 0.1, resource_management: 0.08, communication: 0.05 } },
  { id: 'liem_sat', name: 'Liêm Sát', archetype: 'Kỷ luật dưới áp lực', stars: ['liem_trinh', 'that_sat'],
    direction: 'An ninh mạng, quản trị rủi ro, tuân thủ, vận hành',
    traitBias: { governance: 0.1, technical: 0.08, autonomy: 0.06 } },
  { id: 'liem_pha', name: 'Liêm Phá', archetype: 'Chuyển đổi khuôn khổ', stars: ['liem_trinh', 'pha_quan'],
    direction: 'Chuyển đổi quản trị, kiểm toán công nghệ',
    traitBias: { governance: 0.08, transformation: 0.1, analysis: 0.06 } },
  { id: 'liem_tham', name: 'Liêm Tham', archetype: 'Thương mại có khuôn khổ', stars: ['liem_trinh', 'tham_lang'],
    direction: 'Quản lý khách hàng lớn, vận hành kinh doanh',
    traitBias: { structure: 0.08, entrepreneurship: 0.08, communication: 0.06 } },
  { id: 'co_cu', name: 'Cơ Cự', archetype: 'Phân tích và truyền đạt', stars: ['thien_co', 'cu_mon'],
    direction: 'Tư vấn, phân tích nghiệp vụ, sản phẩm, chính sách',
    traitBias: { analysis: 0.12, communication: 0.1 } },
  { id: 'co_luong', name: 'Cơ Lương', archetype: 'Chuyên gia cố vấn', stars: ['thien_co', 'thien_luong'],
    direction: 'Nghiên cứu, giáo dục, cố vấn chuyên môn',
    traitBias: { research: 0.12, analysis: 0.08, service: 0.06 } },
  { id: 'dong_cu', name: 'Đồng Cự', archetype: 'Kết nối con người', stars: ['thien_dong', 'cu_mon'],
    direction: 'Nhân sự, chăm sóc khách hàng, truyền thông nội bộ',
    traitBias: { service: 0.1, communication: 0.1 } },
  { id: 'duong_luong', name: 'Dương Lương', archetype: 'Người dẫn dắt cộng đồng', stars: ['thai_duong', 'thien_luong'],
    direction: 'Giáo dục, dịch vụ công, dẫn dắt tổ chức xã hội',
    traitBias: { public_visibility: 0.1, service: 0.08, leadership: 0.06 } },
  { id: 'cu_nhat_hybrid', name: 'Cự Nhật', archetype: 'Tiếng nói trước công chúng', stars: ['cu_mon', 'thai_duong'],
    direction: 'Luật, truyền thông, tư vấn, kinh doanh',
    traitBias: { communication: 0.12, public_visibility: 0.1 } },
]

/* ── Level 4: cung và Tứ Hóa ───────────────────────────────────── */

export const PALACES: Palace[] = [
  { id: 'quan_loc', name: 'Quan Lộc', weight: 0.30, meaning: 'Cách làm việc và vai trò nghề nghiệp' },
  { id: 'menh', name: 'Mệnh', weight: 0.25, meaning: 'Thiên hướng gốc và phong cách tự nhiên' },
  { id: 'than', name: 'Thân', weight: 0.15, meaning: 'Biểu hiện khi đã trưởng thành' },
  { id: 'tai_bach', name: 'Tài Bạch', weight: 0.15, meaning: 'Cách tạo ra và quản lý giá trị' },
  { id: 'thien_di', name: 'Thiên Di', weight: 0.10, meaning: 'Cách tương tác với môi trường bên ngoài' },
  { id: 'phuc_no', name: 'Phúc Đức và Nô Bộc', weight: 0.05, meaning: 'Bối cảnh, mạng lưới và chỗ dựa dài hạn' },
]

export const PALACE_BY_ID: Record<PalaceId, Palace> = Object.fromEntries(
  PALACES.map((p) => [p.id, p]),
) as Record<PalaceId, Palace>

export const TRANSFORMS: Transform[] = [
  { id: 'hoa_loc', name: 'Hoá Lộc', effect: 'Thuận về nguồn lực và cơ hội',
    traitBias: { entrepreneurship: 0.08, resource_management: 0.06, communication: 0.04 } },
  { id: 'hoa_quyen', name: 'Hoá Quyền', effect: 'Thuận về quyền hạn và khả năng quyết định',
    traitBias: { leadership: 0.1, execution: 0.06, autonomy: 0.05 } },
  { id: 'hoa_khoa', name: 'Hoá Khoa', effect: 'Thuận về chuyên môn, bằng cấp và uy tín',
    traitBias: { research: 0.09, analysis: 0.06, public_visibility: 0.05 } },
  { id: 'hoa_ky', name: 'Hoá Kỵ', effect: 'Có vướng mắc cần để ý, thường đòi kiểm soát kỹ hơn',
    traitBias: { structure: 0.06, risk_tolerance: -0.08, public_visibility: -0.05 } },
]

/** Miếu Vượng Đắc Hãm chỉ đổi độ rõ khi biểu hiện, không phải tốt xấu. */
export const BRIGHTNESS_FACTOR = {
  mieu: 1.15,
  vuong: 1.08,
  dac: 1.0,
  ham: 0.82,
} as const

export const BRIGHTNESS_LABEL = {
  mieu: 'Miếu',
  vuong: 'Vượng',
  dac: 'Đắc',
  ham: 'Hãm',
} as const

/* ── Level 5: chế độ nghề nghiệp ───────────────────────────────── */

export const CAREER_MODES: Record<CareerMode, { label: string; summary: string; actions: string[] }> = {
  LEARN: { label: 'Học và tích luỹ',
    summary: 'Giai đoạn nạp vào. Ưu tiên học, lấy chứng chỉ và tích luỹ nền tảng hơn là đổi vai trò.',
    actions: ['Hoàn thành một chương trình học có chứng chỉ', 'Chọn một mảng hẹp để đi sâu', 'Tìm người đi trước để học nghề'] },
  BUILD: { label: 'Xây năng lực',
    summary: 'Giai đoạn làm dày hồ sơ. Ưu tiên tạo thành tích đo được và tăng chiều sâu chuyên môn.',
    actions: ['Nhận một dự án có kết quả đo được', 'Dựng hồ sơ năng lực bằng sản phẩm thật', 'Chuẩn hoá cách làm việc của mình'] },
  EXPAND: { label: 'Mở rộng phạm vi',
    summary: 'Giai đoạn mở ra. Ưu tiên tăng phạm vi trách nhiệm và mở rộng quan hệ nghề nghiệp.',
    actions: ['Nhận thêm phạm vi ngoài chuyên môn hẹp', 'Tham gia cộng đồng nghề nghiệp', 'Trình bày kết quả trước nhóm lớn hơn'] },
  LEAD: { label: 'Dẫn dắt',
    summary: 'Giai đoạn nhận quyền. Ưu tiên chuyển từ tự làm sang giúp người khác làm tốt hơn.',
    actions: ['Nhận vai trò dẫn dắt dù nhóm nhỏ', 'Học cách giao việc và theo dõi', 'Xây tiêu chuẩn cho nhóm'] },
  TRANSFORM: { label: 'Chuyển hướng',
    summary: 'Giai đoạn dễ xáo trộn. Đây là lúc đổi vai trò, đổi ngành hoặc làm cái mới có khả năng thuận hơn.',
    actions: ['Thử hướng mới ở quy mô nhỏ trước', 'Lập tiêu chí đánh giá cơ hội', 'Chuẩn bị phương án lui'] },
  CONSOLIDATE: { label: 'Củng cố',
    summary: 'Giai đoạn ổn định. Ưu tiên tối ưu cái đang có hơn là mở thêm mặt trận.',
    actions: ['Hoàn thành việc còn dở', 'Chuẩn hoá quy trình đang làm', 'Tích luỹ dự phòng'] },
  CAUTION: { label: 'Thận trọng',
    summary: 'Giai đoạn nên giữ nhịp. Hạn chế thay đổi lớn không cần thiết, tập trung làm chắc nền.',
    actions: ['Rà soát rủi ro trước khi quyết định lớn', 'Củng cố kỹ năng nền tảng', 'Giữ quan hệ nghề nghiệp hiện có'] },
}

export const CONFIDENCE_LABEL = { low: 'Thấp', medium: 'Trung bình', high: 'Cao' } as const

export const TRAIT_LABEL_VI: Record<string, string> = {
  leadership: 'Dẫn dắt',
  governance: 'Quản trị',
  resource_management: 'Quản lý nguồn lực',
  execution: 'Thực thi',
  entrepreneurship: 'Khởi tạo',
  transformation: 'Chuyển đổi',
  risk_tolerance: 'Chịu rủi ro',
  analysis: 'Phân tích',
  research: 'Nghiên cứu',
  technical: 'Kỹ thuật',
  communication: 'Truyền đạt',
  public_visibility: 'Xuất hiện trước công chúng',
  service: 'Phục vụ',
  creativity: 'Sáng tạo',
  autonomy: 'Tự chủ',
  structure: 'Kỷ luật',
}
