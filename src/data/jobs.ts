import type { CareerField, SeniorityLevel, WorkMode } from '@/types'

/** Demo job postings used by the recruiter's "Tin tuyển dụng" page. */
export interface JobPosting {
  id: string
  title: string
  careerId: string
  field: CareerField
  seniority: SeniorityLevel
  location: string
  workMode: WorkMode
  salaryMin: number
  salaryMax: number
  skills: string[]
  openings: number
  status: 'open' | 'draft' | 'closed'
  postedAt: string
}

export const JOB_POSTINGS: JobPosting[] = [
  {
    id: 'j-001',
    title: 'Kỹ sư AI cao cấp',
    careerId: 'phan_tich_du_lieu',
    field: 'cong_nghe',
    seniority: 'senior',
    location: 'Hà Nội',
    workMode: 'hybrid',
    salaryMin: 45,
    salaryMax: 70,
    skills: ['python', 'machine-learning', 'deep-learning', 'mlops'],
    openings: 2,
    status: 'open',
    postedAt: '2024-11-02',
  },
  {
    id: 'j-002',
    title: 'Kỹ sư an ninh mạng',
    careerId: 'it_phan_cung_mang',
    field: 'cong_nghe',
    seniority: 'middle',
    location: 'Hà Nội',
    workMode: 'onsite',
    salaryMin: 35,
    salaryMax: 55,
    skills: ['cybersecurity', 'network', 'penetration-testing', 'linux'],
    openings: 1,
    status: 'open',
    postedAt: '2024-11-14',
  },
  {
    id: 'j-003',
    title: 'Chuyên viên thiết kế sản phẩm',
    careerId: 'thiet_ke_sang_tao',
    field: 'cong_nghe',
    seniority: 'middle',
    location: 'Đà Nẵng',
    workMode: 'remote',
    salaryMin: 25,
    salaryMax: 40,
    skills: ['ux-ui', 'figma', 'user-research'],
    openings: 1,
    status: 'open',
    postedAt: '2024-12-01',
  },
  {
    id: 'j-004',
    title: 'Kỹ sư dữ liệu',
    careerId: 'phan_tich_du_lieu',
    field: 'cong_nghe',
    seniority: 'senior',
    location: 'TP. Hồ Chí Minh',
    workMode: 'hybrid',
    salaryMin: 35,
    salaryMax: 55,
    skills: ['sql', 'python', 'etl', 'data-warehouse'],
    openings: 3,
    status: 'open',
    postedAt: '2024-12-09',
  },
  {
    id: 'j-005',
    title: 'Trưởng phòng kỹ thuật',
    careerId: 'quan_ly_du_an',
    field: 'quan_tri',
    seniority: 'manager',
    location: 'TP. Hồ Chí Minh',
    workMode: 'onsite',
    salaryMin: 70,
    salaryMax: 110,
    skills: ['leadership', 'system-design', 'project-management', 'mentoring'],
    openings: 1,
    status: 'draft',
    postedAt: '2024-12-18',
  },
  {
    id: 'j-006',
    title: 'Trưởng phòng marketing tăng trưởng',
    careerId: 'marketing_truyen_thong',
    field: 'kinh_doanh',
    seniority: 'senior',
    location: 'Hà Nội',
    workMode: 'hybrid',
    salaryMin: 35,
    salaryMax: 55,
    skills: ['marketing', 'digital-marketing', 'data-analysis', 'seo'],
    openings: 1,
    status: 'closed',
    postedAt: '2024-09-21',
  },
]
