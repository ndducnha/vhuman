import type { StarGroup, StarGroupId } from '@/types'

/**
 * Tử Vi star groupings, treated as working-style archetypes.
 *
 * Reference data only: the engine picks one from birth inputs, it does not
 * invent them. Wording stays at the level of tendency; nothing here asserts
 * that a person will or must be anything.
 */
export const STAR_GROUPS: StarGroup[] = [
  {
    id: 'tu_phu_vu_tuong',
    name: 'Tử - Phủ - Vũ - Tướng',
    description:
      'Nhóm sao trung tâm của bản mệnh. Thường gắn với xu hướng đứng ra tổ chức, quyết đoán và nhận trách nhiệm về mình.',
    careerArchetypes: ['Lãnh đạo cấp cao', 'Quản lý dự án', 'Nhà quản trị'],
    skillsToHighlight: ['Kỹ năng lãnh đạo', 'Quản lý đội nhóm', 'Ra quyết định'],
    suggestedRoles: ['Giám đốc điều hành', 'Quản lý nhân sự', 'Quản lý sản xuất'],
    affinityFields: ['quan_tri', 'san_xuat', 'con_nguoi'],
    traitBias: { leadership: 10, stability: 5, analytical: 3 },
  },
  {
    id: 'sat_pha_tham',
    name: 'Sát - Phá - Tham',
    description:
      'Bộ sao của sự bứt phá và thích ứng nhanh. Thường gắn với xu hướng thử nghiệm, làm cái mới, không ngại thay đổi.',
    careerArchetypes: ['Nhà sáng tạo', 'Khởi nghiệp', 'Chuyên gia R&D'],
    skillsToHighlight: ['Tư duy sáng tạo', 'Khả năng thích nghi', 'Giải quyết vấn đề'],
    suggestedRoles: ['Nhà phát triển sản phẩm', 'Chuyên viên nghiên cứu thị trường', 'Kỹ sư đổi mới'],
    affinityFields: ['cong_nghe', 'kinh_doanh', 'sang_tao'],
    traitBias: { riskTaking: 12, creative: 8, stability: -6 },
  },
  {
    id: 'co_nguyet_dong_luong',
    name: 'Cơ - Nguyệt - Đồng - Lương',
    description:
      'Nhóm sao thiên về cân bằng, kiến thức và kết nối. Thường hợp với môi trường học thuật, hoặc công việc dẫn dắt người khác học.',
    careerArchetypes: ['Giáo viên / giảng viên', 'Chuyên viên phát triển nhân sự', 'Chuyên gia tư vấn'],
    skillsToHighlight: ['Giao tiếp', 'Kỹ năng giảng dạy', 'Tư duy logic'],
    suggestedRoles: ['Giảng viên đại học', 'Huấn luyện viên kỹ năng', 'Chuyên viên phát triển đào tạo'],
    affinityFields: ['con_nguoi', 'dich_vu', 'tai_chinh'],
    traitBias: { teamwork: 9, communication: 7, stability: 6, riskTaking: -5 },
  },
  {
    id: 'cu_mon_nhat_hoa',
    name: 'Cự Môn - Nhật - Hoả',
    description:
      'Bộ sao gắn với ngôn từ và lập luận. Thường hợp với công việc cần diễn đạt, thuyết phục và phân tích.',
    careerArchetypes: ['Chuyên gia truyền thông', 'Nhà văn / nghệ thuật', 'Chuyên viên tư vấn'],
    skillsToHighlight: ['Viết lách', 'Truyền cảm hứng', 'Tư duy phân tích'],
    suggestedRoles: ['Biên tập viên', 'Nhân viên PR', 'Chuyên viên chăm sóc khách hàng'],
    affinityFields: ['sang_tao', 'kinh_doanh', 'quan_tri'],
    traitBias: { communication: 10, analytical: 7, independence: 4 },
  },
]

export const STAR_GROUP_BY_ID: Record<StarGroupId, StarGroup> = Object.fromEntries(
  STAR_GROUPS.map((group) => [group.id, group]),
) as Record<StarGroupId, StarGroup>
