import type { Skill, SkillCategory } from '@/types'

/** Canonical skill taxonomy. Ids are stable and referenced by careers + candidates. */
export const SKILLS: Skill[] = [
  // ── Technology ───────────────────────────────────────────────────
  { id: 'python', name: 'Python', category: 'technology' },
  { id: 'java', name: 'Java', category: 'technology' },
  { id: 'javascript', name: 'JavaScript', category: 'technology', aliases: ['js'] },
  { id: 'typescript', name: 'TypeScript', category: 'technology', aliases: ['ts'] },
  { id: 'react', name: 'React', category: 'technology' },
  { id: 'nodejs', name: 'Node.js', category: 'technology', aliases: ['node'] },
  { id: 'golang', name: 'Go', category: 'technology', aliases: ['golang'] },
  { id: 'csharp', name: 'C#', category: 'technology' },
  { id: 'ai', name: 'AI', category: 'technology', aliases: ['trí tuệ nhân tạo'] },
  { id: 'machine-learning', name: 'Machine Learning', category: 'technology', aliases: ['ml'] },
  { id: 'deep-learning', name: 'Deep Learning', category: 'technology' },
  { id: 'nlp', name: 'NLP', category: 'technology' },
  { id: 'computer-vision', name: 'Computer Vision', category: 'technology' },
  { id: 'tensorflow', name: 'TensorFlow', category: 'technology' },
  { id: 'pytorch', name: 'PyTorch', category: 'technology' },
  { id: 'mlops', name: 'MLOps', category: 'technology' },
  { id: 'cybersecurity', name: 'An ninh mạng', category: 'technology', aliases: ['cybersecurity'] },
  { id: 'network', name: 'Mạng máy tính', category: 'technology', aliases: ['network'] },
  { id: 'penetration-testing', name: 'Kiểm thử xâm nhập', category: 'technology', aliases: ['penetration testing', 'pentest'] },
  { id: 'siem', name: 'SIEM', category: 'technology' },
  { id: 'cloud-security', name: 'Cloud Security', category: 'technology' },
  { id: 'security-architecture', name: 'Security Architecture', category: 'technology' },
  { id: 'cloud', name: 'Cloud', category: 'technology' },
  { id: 'aws', name: 'AWS', category: 'technology' },
  { id: 'azure', name: 'Azure', category: 'technology' },
  { id: 'devops', name: 'DevOps', category: 'technology' },
  { id: 'kubernetes', name: 'Kubernetes', category: 'technology', aliases: ['k8s'] },
  { id: 'docker', name: 'Docker', category: 'technology' },
  { id: 'terraform', name: 'Terraform', category: 'technology' },
  { id: 'ci-cd', name: 'CI/CD', category: 'technology' },
  { id: 'linux', name: 'Linux', category: 'technology' },
  { id: 'blockchain', name: 'Blockchain', category: 'technology' },
  { id: 'smart-contract', name: 'Smart Contract', category: 'technology' },
  { id: 'data-analysis', name: 'Phân tích dữ liệu', category: 'technology', aliases: ['data analysis'] },
  { id: 'sql', name: 'SQL', category: 'technology' },
  { id: 'spark', name: 'Spark', category: 'technology' },
  { id: 'etl', name: 'ETL', category: 'technology' },
  { id: 'data-warehouse', name: 'Data Warehouse', category: 'technology' },
  { id: 'statistics', name: 'Thống kê', category: 'technology', aliases: ['statistics'] },
  { id: 'power-bi', name: 'Power BI', category: 'technology' },
  { id: 'tableau', name: 'Tableau', category: 'technology' },
  { id: 'testing', name: 'Kiểm thử', category: 'technology', aliases: ['testing', 'qa'] },
  { id: 'automation-testing', name: 'Automation Testing', category: 'technology' },
  { id: 'system-design', name: 'Thiết kế hệ thống', category: 'technology', aliases: ['system design'] },
  { id: 'api-design', name: 'API Design', category: 'technology' },
  { id: 'mobile-dev', name: 'Lập trình di động', category: 'technology', aliases: ['mobile development'] },
  { id: 'it-support', name: 'Hỗ trợ kỹ thuật', category: 'technology', aliases: ['it support'] },
  { id: 'system-administration', name: 'Quản trị hệ thống', category: 'technology', aliases: ['system administration'] },

  // ── Business ─────────────────────────────────────────────────────
  { id: 'sales', name: 'Bán hàng', category: 'business', aliases: ['sales'] },
  { id: 'marketing', name: 'Marketing', category: 'business', aliases: ['tiếp thị'] },
  { id: 'digital-marketing', name: 'Digital Marketing', category: 'business' },
  { id: 'seo', name: 'SEO', category: 'business' },
  { id: 'business-development', name: 'Phát triển kinh doanh', category: 'business', aliases: ['business development', 'bd'] },
  { id: 'strategy', name: 'Chiến lược', category: 'business', aliases: ['strategy'] },
  { id: 'product-management', name: 'Product Management', category: 'business' },
  { id: 'project-management', name: 'Quản lý dự án', category: 'business', aliases: ['project management'] },
  { id: 'agile', name: 'Agile / Scrum', category: 'business' },
  { id: 'operations', name: 'Vận hành', category: 'business', aliases: ['operations'] },
  { id: 'supply-chain', name: 'Chuỗi cung ứng', category: 'business', aliases: ['supply chain'] },
  { id: 'ecommerce', name: 'E-commerce', category: 'business' },
  { id: 'finance', name: 'Tài chính', category: 'business', aliases: ['finance'] },
  { id: 'accounting', name: 'Kế toán', category: 'business', aliases: ['accounting'] },
  { id: 'financial-modeling', name: 'Mô hình tài chính', category: 'business', aliases: ['financial modeling'] },
  { id: 'investment', name: 'Đầu tư', category: 'business', aliases: ['investment'] },
  { id: 'risk-management', name: 'Quản trị rủi ro', category: 'business', aliases: ['risk management'] },
  { id: 'banking', name: 'Ngân hàng', category: 'business', aliases: ['banking'] },
  { id: 'insurance', name: 'Bảo hiểm', category: 'business', aliases: ['insurance'] },
  { id: 'hr', name: 'Nhân sự', category: 'business', aliases: ['human resources', 'hr'] },
  { id: 'recruitment', name: 'Tuyển dụng', category: 'business', aliases: ['recruitment'] },
  { id: 'training', name: 'Đào tạo', category: 'business', aliases: ['training'] },
  { id: 'consulting', name: 'Tư vấn', category: 'business', aliases: ['consulting'] },
  { id: 'market-research', name: 'Nghiên cứu thị trường', category: 'business', aliases: ['market research'] },
  { id: 'business-analysis', name: 'Phân tích nghiệp vụ', category: 'business', aliases: ['business analysis', 'ba'] },
  { id: 'crm', name: 'CRM', category: 'business' },
  { id: 'teaching', name: 'Giảng dạy', category: 'business', aliases: ['teaching'] },
  { id: 'research', name: 'Nghiên cứu', category: 'business', aliases: ['research'] },

  // ── Design & creative ────────────────────────────────────────────
  { id: 'ux-ui', name: 'UX/UI', category: 'design' },
  { id: 'user-research', name: 'Nghiên cứu người dùng', category: 'design', aliases: ['user research'] },
  { id: 'figma', name: 'Figma', category: 'design' },
  { id: 'graphic-design', name: 'Thiết kế đồ hoạ', category: 'design', aliases: ['graphic design'] },
  { id: 'motion-design', name: 'Thiết kế chuyển động', category: 'design', aliases: ['motion design'] },
  { id: 'content-writing', name: 'Viết nội dung', category: 'design', aliases: ['content writing'] },
  { id: 'copywriting', name: 'Copywriting', category: 'design' },
  { id: 'video-production', name: 'Sản xuất video', category: 'design', aliases: ['video production'] },
  { id: 'branding', name: 'Xây dựng thương hiệu', category: 'design', aliases: ['branding'] },

  // ── Soft skills ──────────────────────────────────────────────────
  { id: 'communication', name: 'Giao tiếp', category: 'soft', aliases: ['communication'] },
  { id: 'leadership', name: 'Lãnh đạo', category: 'soft', aliases: ['leadership'] },
  { id: 'teamwork', name: 'Làm việc nhóm', category: 'soft', aliases: ['teamwork'] },
  { id: 'problem-solving', name: 'Giải quyết vấn đề', category: 'soft', aliases: ['problem solving'] },
  { id: 'critical-thinking', name: 'Tư duy phản biện', category: 'soft', aliases: ['critical thinking'] },
  { id: 'creativity', name: 'Sáng tạo', category: 'soft', aliases: ['creativity'] },
  { id: 'negotiation', name: 'Đàm phán', category: 'soft', aliases: ['negotiation'] },
  { id: 'presentation', name: 'Thuyết trình', category: 'soft', aliases: ['presentation'] },
  { id: 'time-management', name: 'Quản lý thời gian', category: 'soft', aliases: ['time management'] },
  { id: 'adaptability', name: 'Khả năng thích ứng', category: 'soft', aliases: ['adaptability'] },
  { id: 'mentoring', name: 'Kèm cặp - hướng dẫn', category: 'soft', aliases: ['mentoring'] },
  { id: 'stakeholder-management', name: 'Quản lý bên liên quan', category: 'soft', aliases: ['stakeholder management'] },

  // ── Ngành nghề thực địa & dịch vụ (mở rộng theo taxonomy nghề VN) ──
  { id: 'office-admin', name: 'Hành chính văn phòng', category: 'business', aliases: ['admin'] },
  { id: 'document-management', name: 'Quản lý hồ sơ', category: 'business', aliases: ['văn thư'] },
  { id: 'security-ops', name: 'Nghiệp vụ an ninh', category: 'other', aliases: ['bảo vệ'] },
  { id: 'emergency-response', name: 'Xử lý sự cố khẩn cấp', category: 'other' },
  { id: 'interior-design', name: 'Thiết kế nội thất', category: 'design' },
  { id: 'autocad', name: 'AutoCAD', category: 'design' },
  { id: 'revit-bim', name: 'Revit / BIM', category: 'design' },
  { id: 'illustration', name: 'Minh hoạ', category: 'design', aliases: ['vẽ'] },
  { id: 'hospitality', name: 'Nghiệp vụ khách sạn', category: 'other', aliases: ['lễ tân'] },
  { id: 'culinary', name: 'Bếp & ẩm thực', category: 'other', aliases: ['nấu ăn'] },
  { id: 'tour-guiding', name: 'Hướng dẫn du lịch', category: 'other' },
  { id: 'retail-ops', name: 'Vận hành cửa hàng', category: 'business' },
  { id: 'merchandising', name: 'Trưng bày hàng hoá', category: 'business' },
  { id: 'network-admin', name: 'Quản trị mạng', category: 'technology' },
  { id: 'hardware-repair', name: 'Sửa chữa phần cứng', category: 'technology' },
  { id: 'manufacturing', name: 'Kỹ thuật sản xuất', category: 'other' },
  { id: 'lean-six-sigma', name: 'Lean / Six Sigma', category: 'other' },
  { id: 'machine-maintenance', name: 'Bảo trì máy móc', category: 'other' },
  { id: 'agriculture', name: 'Kỹ thuật nông nghiệp', category: 'other' },
  { id: 'aquaculture', name: 'Nuôi trồng thuỷ sản', category: 'other' },
  { id: 'public-relations', name: 'Quan hệ công chúng', category: 'business', aliases: ['pr'] },
  { id: 'logistics', name: 'Logistics', category: 'business', aliases: ['kho vận'] },
  { id: 'warehouse-ops', name: 'Vận hành kho', category: 'business' },
  { id: 'import-export', name: 'Xuất nhập khẩu', category: 'business' },
  { id: 'customs', name: 'Thủ tục hải quan', category: 'business' },
  { id: 'driving', name: 'Lái xe', category: 'other' },
  { id: 'route-planning', name: 'Điều phối tuyến', category: 'other' },
  { id: 'tax-accounting', name: 'Kế toán thuế', category: 'business' },
  { id: 'securities', name: 'Chứng khoán', category: 'business' },
  { id: 'credit-appraisal', name: 'Thẩm định tín dụng', category: 'business' },
  { id: 'geology', name: 'Địa chất', category: 'other' },
  { id: 'clinical-care', name: 'Chuyên môn lâm sàng', category: 'other', aliases: ['y khoa'] },
  { id: 'nursing', name: 'Điều dưỡng', category: 'other' },
  { id: 'public-health', name: 'Y tế cộng đồng', category: 'other' },
  { id: 'compensation-benefits', name: 'C&B', category: 'business', aliases: ['lương thưởng'] },
  { id: 'insurance-advisory', name: 'Tư vấn bảo hiểm', category: 'business' },
  { id: 'legal-advisory', name: 'Tư vấn pháp lý', category: 'business', aliases: ['luật'] },
  { id: 'compliance', name: 'Tuân thủ', category: 'business' },
  { id: 'internal-audit', name: 'Kiểm toán nội bộ', category: 'business' },
  { id: 'quality-management', name: 'Quản lý chất lượng', category: 'other', aliases: ['qc', 'iso'] },
  { id: 'real-estate', name: 'Bất động sản', category: 'business' },
  { id: 'customer-service', name: 'Chăm sóc khách hàng', category: 'business' },
  { id: 'civil-engineering', name: 'Kỹ thuật xây dựng', category: 'other' },
  { id: 'site-supervision', name: 'Giám sát công trường', category: 'other' },
  { id: 'curriculum-design', name: 'Thiết kế chương trình học', category: 'business' },
  { id: 'risk-assessment', name: 'Đánh giá rủi ro', category: 'business' },
]

export const SKILL_BY_ID: Record<string, Skill> = Object.fromEntries(
  SKILLS.map((skill) => [skill.id, skill]),
)

export function skillName(id: string): string {
  return SKILL_BY_ID[id]?.name ?? id
}

export function skillsByCategory(category: SkillCategory): Skill[] {
  return SKILLS.filter((skill) => skill.category === category)
}

/** Fuzzy-ish search over name + aliases, accent-insensitive. */
export function searchSkills(query: string, limit = 40): Skill[] {
  const q = normalize(query)
  if (!q) return SKILLS.slice(0, limit)
  const scored = SKILLS.map((skill) => {
    const name = normalize(skill.name)
    const aliasHit = (skill.aliases ?? []).some((a) => normalize(a).includes(q))
    let score = -1
    if (name === q) score = 100
    else if (name.startsWith(q)) score = 80
    else if (name.includes(q)) score = 60
    else if (aliasHit) score = 50
    return { skill, score }
  })
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score)
  return scored.slice(0, limit).map((entry) => entry.skill)
}

export function normalize(value: string): string {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .trim()
}
