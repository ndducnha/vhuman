import type {
  Candidate,
  CandidateSkill,
  Education,
  Experience,
  Gender,
  SeniorityLevel,
  SkillLevel,
  WorkMode,
} from '@/types'
import { SKILL_BY_ID } from '@/data/skills'
import { astrologyEngine } from '@/services/astrology'

/**
 * Fictional demo candidates.
 *
 * All names, companies and histories are invented for demonstration purposes.
 * Records are written in a compact seed form and expanded by `buildCandidate`
 * so the dataset stays readable and internally consistent.
 */

interface SeedExperience {
  company: string
  title: string
  from: string
  to: string
  current?: boolean
  description: string
}

interface CandidateSeed {
  id: string
  name: string
  gender: Gender
  birthDate: string
  birthTime: string
  birthPlace: string
  city: string
  headline: string
  summary: string
  years: number
  seniority: SeniorityLevel
  workModes: WorkMode[]
  salary: [number, number]
  desiredTitle: string
  industries: string[]
  /** `skillId:level`: level defaults to proficient when omitted. */
  skills: string[]
  education: Array<{ school: string; degree: string; major: string; from: string; to: string }>
  experience: SeedExperience[]
}

const LEVEL_ALIAS: Record<string, SkillLevel> = {
  b: 'basic',
  i: 'intermediate',
  p: 'proficient',
  e: 'expert',
}

const SEEDS: CandidateSeed[] = [
  {
    id: 'c-001',
    name: 'Nguyễn Minh Anh',
    gender: 'female',
    birthDate: '1995-04-12',
    birthTime: '07:30',
    birthPlace: 'Hà Nội',
    city: 'Hà Nội',
    headline: 'Kỹ sư AI cao cấp',
    summary:
      'Kỹ sư AI với 6 năm kinh nghiệm xây dựng và triển khai mô hình học máy cho sản phẩm thực tế. Quan tâm tới hệ thống AI có thể vận hành ổn định ở quy mô lớn.',
    years: 6,
    seniority: 'senior',
    workModes: ['hybrid', 'remote'],
    salary: [45, 65],
    desiredTitle: 'Kỹ sư AI cao cấp',
    industries: ['Công nghệ', 'Fintech'],
    skills: ['python:e', 'machine-learning:e', 'deep-learning:p', 'pytorch:p', 'aws:p', 'mlops:i', 'sql:p', 'problem-solving:e', 'communication:i'],
    education: [
      { school: 'Đại học Bách khoa Hà Nội', degree: 'Kỹ sư', major: 'Khoa học máy tính', from: '2013', to: '2018' },
    ],
    experience: [
      { company: 'Zentra Technology', title: 'Kỹ sư AI cao cấp', from: '2022-03', to: '', current: true, description: 'Dẫn dắt nhóm 4 người xây dựng hệ thống gợi ý sản phẩm phục vụ 2 triệu người dùng.' },
      { company: 'DataNest', title: 'Kỹ sư học máy', from: '2019-06', to: '2022-02', description: 'Xây dựng pipeline huấn luyện và triển khai mô hình dự đoán rủi ro tín dụng.' },
    ],
  },
  {
    id: 'c-002',
    name: 'Trần Hoàng Nam',
    gender: 'male',
    birthDate: '1992-09-03',
    birthTime: '14:15',
    birthPlace: 'Hải Phòng',
    city: 'Hà Nội',
    headline: 'Kỹ sư an ninh mạng',
    summary:
      'Chuyên gia an ninh mạng tập trung vào kiểm thử xâm nhập và kiến trúc bảo mật cho hệ thống tài chính.',
    years: 8,
    seniority: 'senior',
    workModes: ['onsite', 'hybrid'],
    salary: [50, 70],
    desiredTitle: 'Kiến trúc sư an ninh mạng',
    industries: ['Công nghệ', 'Ngân hàng'],
    skills: ['cybersecurity:e', 'penetration-testing:e', 'network:p', 'linux:p', 'python:p', 'siem:i', 'cloud-security:i', 'critical-thinking:e'],
    education: [
      { school: 'Học viện Kỹ thuật Mật mã', degree: 'Kỹ sư', major: 'An toàn thông tin', from: '2010', to: '2015' },
    ],
    experience: [
      { company: 'SecureVault', title: 'Kỹ sư an ninh mạng', from: '2020-01', to: '', current: true, description: 'Thiết kế chương trình kiểm thử xâm nhập định kỳ cho 12 hệ thống nội bộ.' },
      { company: 'FPT Information System', title: 'Chuyên viên phân tích an ninh', from: '2016-05', to: '2019-12', description: 'Giám sát và xử lý sự cố an ninh trên nền tảng SIEM.' },
    ],
  },
  {
    id: 'c-003',
    name: 'Lê Thanh Hà',
    gender: 'female',
    birthDate: '1997-12-21',
    birthTime: '03:45',
    birthPlace: 'Đà Nẵng',
    city: 'Đà Nẵng',
    headline: 'Chuyên viên thiết kế sản phẩm',
    summary:
      'Nhà thiết kế sản phẩm quan tâm tới nghiên cứu người dùng và hệ thống thiết kế có thể mở rộng.',
    years: 4,
    seniority: 'middle',
    workModes: ['remote', 'hybrid'],
    salary: [25, 38],
    desiredTitle: 'Chuyên viên thiết kế sản phẩm cao cấp',
    industries: ['Công nghệ', 'Giáo dục'],
    skills: ['ux-ui:e', 'figma:e', 'user-research:p', 'creativity:e', 'graphic-design:i', 'communication:p', 'presentation:i'],
    education: [
      { school: 'Đại học Kiến trúc Đà Nẵng', degree: 'Cử nhân', major: 'Thiết kế đồ hoạ', from: '2015', to: '2019' },
    ],
    experience: [
      { company: 'Lumen Studio', title: 'Chuyên viên thiết kế sản phẩm', from: '2021-04', to: '', current: true, description: 'Chủ trì thiết kế lại luồng onboarding, giảm 27% tỉ lệ bỏ giữa chừng.' },
      { company: 'Vietnam Digital', title: 'Chuyên viên thiết kế giao diện', from: '2019-08', to: '2021-03', description: 'Thiết kế giao diện cho các dự án web và ứng dụng di động của khách hàng doanh nghiệp.' },
    ],
  },
  {
    id: 'c-004',
    name: 'Phạm Gia Huy',
    gender: 'male',
    birthDate: '1990-06-18',
    birthTime: '21:10',
    birthPlace: 'TP. Hồ Chí Minh',
    city: 'TP. Hồ Chí Minh',
    headline: 'Trưởng phòng kỹ thuật',
    summary:
      'Quản lý kỹ thuật với 11 năm kinh nghiệm, từng dẫn dắt đội ngũ 20 kỹ sư trong giai đoạn tăng trưởng nhanh.',
    years: 11,
    seniority: 'manager',
    workModes: ['onsite', 'hybrid'],
    salary: [70, 100],
    desiredTitle: 'Giám đốc kỹ thuật',
    industries: ['Công nghệ', 'Thương mại điện tử'],
    skills: ['leadership:e', 'system-design:e', 'project-management:p', 'java:p', 'mentoring:e', 'strategy:i', 'stakeholder-management:p', 'agile:p'],
    education: [
      { school: 'Đại học Khoa học Tự nhiên TP.HCM', degree: 'Cử nhân', major: 'Công nghệ thông tin', from: '2008', to: '2012' },
    ],
    experience: [
      { company: 'Orbit Commerce', title: 'Trưởng phòng kỹ thuật', from: '2019-09', to: '', current: true, description: 'Xây dựng tổ chức kỹ thuật từ 6 lên 20 người, thiết lập quy trình release hằng tuần.' },
      { company: 'Nimbus Software', title: 'Trưởng nhóm kỹ thuật', from: '2015-02', to: '2019-08', description: 'Dẫn dắt nhóm backend cho nền tảng thanh toán.' },
    ],
  },
  {
    id: 'c-005',
    name: 'Đỗ Khánh Linh',
    gender: 'female',
    birthDate: '1999-02-08',
    birthTime: '10:20',
    birthPlace: 'Nam Định',
    city: 'Hà Nội',
    headline: 'Chuyên viên phân tích dữ liệu',
    summary:
      'Chuyên viên phân tích dữ liệu, mạnh về SQL và trực quan hoá, thích biến số liệu thành quyết định cụ thể.',
    years: 2.5,
    seniority: 'junior',
    workModes: ['hybrid', 'onsite'],
    salary: [18, 26],
    desiredTitle: 'Chuyên viên phân tích dữ liệu',
    industries: ['Thương mại điện tử', 'Tài chính'],
    skills: ['sql:e', 'data-analysis:p', 'power-bi:p', 'python:i', 'statistics:i', 'presentation:p', 'critical-thinking:p'],
    education: [
      { school: 'Đại học Kinh tế Quốc dân', degree: 'Cử nhân', major: 'Toán kinh tế', from: '2017', to: '2021' },
    ],
    experience: [
      { company: 'Shopline Vietnam', title: 'Chuyên viên phân tích dữ liệu', from: '2022-01', to: '', current: true, description: 'Xây dựng bộ dashboard vận hành cho 5 nhóm kinh doanh.' },
    ],
  },
  {
    id: 'c-006',
    name: 'Vũ Đình Khoa',
    gender: 'male',
    birthDate: '1994-11-30',
    birthTime: '05:55',
    birthPlace: 'Thanh Hoá',
    city: 'Hà Nội',
    headline: 'Kỹ sư DevOps',
    summary:
      'Kỹ sư DevOps tập trung vào tự động hoá hạ tầng và độ tin cậy hệ thống trên nền tảng cloud.',
    years: 5,
    seniority: 'senior',
    workModes: ['remote', 'hybrid'],
    salary: [40, 55],
    desiredTitle: 'Kỹ sư DevOps cao cấp',
    industries: ['Công nghệ'],
    skills: ['devops:e', 'kubernetes:p', 'docker:e', 'terraform:p', 'aws:p', 'ci-cd:e', 'linux:p', 'python:i'],
    education: [
      { school: 'Đại học Công nghệ - ĐHQGHN', degree: 'Kỹ sư', major: 'Công nghệ thông tin', from: '2012', to: '2017' },
    ],
    experience: [
      { company: 'CloudPeak', title: 'Kỹ sư DevOps', from: '2020-06', to: '', current: true, description: 'Chuyển đổi hạ tầng sang Kubernetes, giảm 40% thời gian triển khai.' },
      { company: 'Techbase JSC', title: 'Kỹ sư hệ thống', from: '2018-01', to: '2020-05', description: 'Vận hành hệ thống máy chủ và giám sát dịch vụ nội bộ.' },
    ],
  },
  {
    id: 'c-007',
    name: 'Bùi Thu Trang',
    gender: 'female',
    birthDate: '1993-07-14',
    birthTime: '16:40',
    birthPlace: 'Huế',
    city: 'TP. Hồ Chí Minh',
    headline: 'Trưởng phòng marketing',
    summary:
      'Quản lý marketing với thế mạnh về marketing hiệu suất và xây dựng thương hiệu cho sản phẩm số.',
    years: 7,
    seniority: 'manager',
    workModes: ['onsite', 'hybrid'],
    salary: [40, 58],
    desiredTitle: 'Giám đốc marketing',
    industries: ['Thương mại điện tử', 'Tiêu dùng'],
    skills: ['marketing:e', 'digital-marketing:e', 'branding:p', 'data-analysis:i', 'content-writing:p', 'leadership:p', 'seo:i', 'presentation:p'],
    education: [
      { school: 'Đại học Ngoại thương', degree: 'Cử nhân', major: 'Kinh tế đối ngoại', from: '2011', to: '2015' },
    ],
    experience: [
      { company: 'Nova Retail', title: 'Trưởng phòng marketing', from: '2020-02', to: '', current: true, description: 'Quản lý ngân sách marketing 12 tỷ/năm và đội ngũ 8 người.' },
      { company: 'Adline Agency', title: 'Trưởng nhóm marketing số', from: '2016-03', to: '2020-01', description: 'Triển khai chiến dịch đa kênh cho khách hàng ngành bán lẻ.' },
    ],
  },
  {
    id: 'c-008',
    name: 'Hoàng Tuấn Kiệt',
    gender: 'male',
    birthDate: '1996-01-25',
    birthTime: '23:05',
    birthPlace: 'Cần Thơ',
    city: 'TP. Hồ Chí Minh',
    headline: 'Kỹ sư backend',
    summary:
      'Kỹ sư backend yêu thích thiết kế hệ thống và tối ưu hiệu năng dịch vụ có lưu lượng lớn.',
    years: 4.5,
    seniority: 'middle',
    workModes: ['hybrid', 'remote'],
    salary: [30, 45],
    desiredTitle: 'Kỹ sư backend cao cấp',
    industries: ['Công nghệ', 'Fintech'],
    skills: ['golang:p', 'nodejs:p', 'system-design:p', 'sql:p', 'docker:i', 'api-design:e', 'problem-solving:p', 'typescript:i'],
    education: [
      { school: 'Đại học Cần Thơ', degree: 'Kỹ sư', major: 'Kỹ thuật phần mềm', from: '2014', to: '2018' },
    ],
    experience: [
      { company: 'Paylink', title: 'Kỹ sư backend', from: '2021-05', to: '', current: true, description: 'Thiết kế lại dịch vụ đối soát giao dịch, giảm 60% độ trễ xử lý.' },
      { company: 'Mekong Soft', title: 'Kỹ sư phần mềm', from: '2018-09', to: '2021-04', description: 'Phát triển API cho hệ thống quản lý kho.' },
    ],
  },
  {
    id: 'c-009',
    name: 'Ngô Phương Uyên',
    gender: 'female',
    birthDate: '1998-05-09',
    birthTime: '08:00',
    birthPlace: 'Nha Trang',
    city: 'Đà Nẵng',
    headline: 'Chuyên viên phân tích nghiệp vụ',
    summary:
      'Chuyên viên phân tích nghiệp vụ trong lĩnh vực ngân hàng số, mạnh về mô tả yêu cầu và làm việc với nhiều bên.',
    years: 3,
    seniority: 'middle',
    workModes: ['onsite', 'hybrid'],
    salary: [22, 32],
    desiredTitle: 'Chuyên viên phân tích nghiệp vụ cao cấp',
    industries: ['Ngân hàng', 'Công nghệ'],
    skills: ['business-analysis:e', 'sql:p', 'communication:e', 'agile:p', 'presentation:p', 'critical-thinking:p', 'stakeholder-management:i'],
    education: [
      { school: 'Đại học Kinh tế Đà Nẵng', degree: 'Cử nhân', major: 'Hệ thống thông tin quản lý', from: '2016', to: '2020' },
    ],
    experience: [
      { company: 'BankOne Digital', title: 'Chuyên viên phân tích nghiệp vụ', from: '2021-07', to: '', current: true, description: 'Phân tích yêu cầu cho 3 sản phẩm ngân hàng số từ giai đoạn ý tưởng.' },
    ],
  },
  {
    id: 'c-010',
    name: 'Đinh Quốc Bảo',
    gender: 'male',
    birthDate: '1988-03-17',
    birthTime: '11:30',
    birthPlace: 'Hà Nội',
    city: 'Hà Nội',
    headline: 'Giám đốc sản phẩm',
    summary:
      'Lãnh đạo sản phẩm với 13 năm kinh nghiệm xây dựng sản phẩm B2B SaaS từ 0 đến quy mô thị trường.',
    years: 13,
    seniority: 'manager',
    workModes: ['hybrid'],
    salary: [80, 120],
    desiredTitle: 'Giám đốc sản phẩm',
    industries: ['SaaS', 'Công nghệ'],
    skills: ['product-management:e', 'strategy:e', 'leadership:e', 'business-analysis:p', 'data-analysis:p', 'stakeholder-management:e', 'presentation:e'],
    education: [
      { school: 'Đại học Bách khoa Hà Nội', degree: 'Kỹ sư', major: 'Điện tử viễn thông', from: '2006', to: '2011' },
      { school: 'Đại học Quốc gia Hà Nội', degree: 'Thạc sĩ', major: 'Quản trị kinh doanh', from: '2014', to: '2016' },
    ],
    experience: [
      { company: 'Fluent Systems', title: 'Giám đốc sản phẩm', from: '2018-04', to: '', current: true, description: 'Đưa sản phẩm từ giai đoạn tìm kiếm thị trường tới 400 khách hàng doanh nghiệp.' },
      { company: 'Metrix Vietnam', title: 'Quản lý sản phẩm', from: '2013-01', to: '2018-03', description: 'Quản lý dòng sản phẩm phân tích dữ liệu cho doanh nghiệp.' },
    ],
  },
  {
    id: 'c-011',
    name: 'Trịnh Bảo Ngọc',
    gender: 'female',
    birthDate: '2000-10-02',
    birthTime: '06:15',
    birthPlace: 'Bắc Ninh',
    city: 'Hà Nội',
    headline: 'Lập trình viên giao diện',
    summary:
      'Lập trình viên frontend mới ra trường, tập trung vào React và trải nghiệm giao diện mượt mà.',
    years: 1.5,
    seniority: 'junior',
    workModes: ['hybrid', 'remote'],
    salary: [15, 22],
    desiredTitle: 'Lập trình viên giao diện',
    industries: ['Công nghệ'],
    skills: ['javascript:p', 'react:p', 'typescript:i', 'ux-ui:b', 'teamwork:p', 'problem-solving:i'],
    education: [
      { school: 'Đại học FPT', degree: 'Kỹ sư', major: 'Kỹ thuật phần mềm', from: '2018', to: '2022' },
    ],
    experience: [
      { company: 'Webflow Vietnam', title: 'Lập trình viên giao diện', from: '2022-09', to: '', current: true, description: 'Phát triển giao diện cho hệ thống quản trị nội bộ.' },
    ],
  },
  {
    id: 'c-012',
    name: 'Lý Hoàng Phúc',
    gender: 'male',
    birthDate: '1991-08-27',
    birthTime: '19:45',
    birthPlace: 'Bình Dương',
    city: 'TP. Hồ Chí Minh',
    headline: 'Chuyên viên phân tích tài chính',
    summary:
      'Chuyên viên phân tích tài chính có kinh nghiệm lập mô hình và hỗ trợ quyết định đầu tư.',
    years: 8,
    seniority: 'senior',
    workModes: ['onsite'],
    salary: [38, 52],
    desiredTitle: 'Trưởng phòng tài chính',
    industries: ['Tài chính', 'Bất động sản'],
    skills: ['financial-modeling:e', 'finance:e', 'data-analysis:p', 'sql:i', 'risk-management:p', 'presentation:p', 'accounting:i'],
    education: [
      { school: 'Đại học Kinh tế TP.HCM', degree: 'Cử nhân', major: 'Tài chính doanh nghiệp', from: '2009', to: '2013' },
    ],
    experience: [
      { company: 'Southgate Capital', title: 'Chuyên viên phân tích tài chính cao cấp', from: '2019-03', to: '', current: true, description: 'Xây dựng mô hình định giá cho các thương vụ đầu tư quy mô trung bình.' },
      { company: 'An Phú Group', title: 'Chuyên viên phân tích tài chính', from: '2015-06', to: '2019-02', description: 'Lập kế hoạch tài chính và báo cáo quản trị hằng tháng.' },
    ],
  },
  {
    id: 'c-013',
    name: 'Cao Mỹ Duyên',
    gender: 'female',
    birthDate: '1994-04-05',
    birthTime: '13:25',
    birthPlace: 'Quảng Ninh',
    city: 'Hà Nội',
    headline: 'Đối tác nhân sự',
    summary:
      'Chuyên gia nhân sự đồng hành cùng đội ngũ kỹ thuật, mạnh về phát triển tổ chức và giữ chân nhân tài.',
    years: 6,
    seniority: 'senior',
    workModes: ['onsite', 'hybrid'],
    salary: [28, 40],
    desiredTitle: 'Trưởng phòng nhân sự',
    industries: ['Công nghệ', 'Dịch vụ'],
    skills: ['hr:e', 'recruitment:p', 'communication:e', 'training:p', 'stakeholder-management:p', 'negotiation:i', 'data-analysis:b'],
    education: [
      { school: 'Đại học Lao động - Xã hội', degree: 'Cử nhân', major: 'Quản trị nhân lực', from: '2012', to: '2016' },
    ],
    experience: [
      { company: 'Zentra Technology', title: 'Đối tác nhân sự', from: '2020-08', to: '', current: true, description: 'Phụ trách nhân sự cho khối kỹ thuật 120 người.' },
      { company: 'VietTalent', title: 'Chuyên viên tuyển dụng', from: '2017-01', to: '2020-07', description: 'Tuyển dụng vị trí kỹ thuật cho khách hàng doanh nghiệp.' },
    ],
  },
  {
    id: 'c-014',
    name: 'Dương Anh Tú',
    gender: 'male',
    birthDate: '1997-11-11',
    birthTime: '02:30',
    birthPlace: 'Nghệ An',
    city: 'Hà Nội',
    headline: 'Kỹ sư dữ liệu',
    summary:
      'Kỹ sư dữ liệu xây dựng pipeline và kho dữ liệu phục vụ phân tích và mô hình học máy.',
    years: 3.5,
    seniority: 'middle',
    workModes: ['remote', 'hybrid'],
    salary: [28, 42],
    desiredTitle: 'Kỹ sư dữ liệu cao cấp',
    industries: ['Công nghệ', 'Thương mại điện tử'],
    skills: ['sql:e', 'python:p', 'etl:p', 'spark:i', 'data-warehouse:p', 'cloud:i', 'docker:i'],
    education: [
      { school: 'Đại học Bách khoa Hà Nội', degree: 'Kỹ sư', major: 'Khoa học dữ liệu', from: '2015', to: '2020' },
    ],
    experience: [
      { company: 'DataNest', title: 'Kỹ sư dữ liệu', from: '2021-02', to: '', current: true, description: 'Thiết kế kho dữ liệu tập trung phục vụ 6 nhóm phân tích.' },
    ],
  },
  {
    id: 'c-015',
    name: 'Phan Thảo Vy',
    gender: 'female',
    birthDate: '1996-06-30',
    birthTime: '17:50',
    birthPlace: 'TP. Hồ Chí Minh',
    city: 'TP. Hồ Chí Minh',
    headline: 'Chuyên viên chiến lược nội dung',
    summary:
      'Chiến lược gia nội dung với thế mạnh xây dựng hệ thống nội dung dài hạn cho thương hiệu công nghệ.',
    years: 5,
    seniority: 'senior',
    workModes: ['remote', 'hybrid'],
    salary: [25, 36],
    desiredTitle: 'Trưởng nhóm nội dung',
    industries: ['Truyền thông', 'Công nghệ'],
    skills: ['content-writing:e', 'copywriting:e', 'seo:p', 'marketing:p', 'creativity:e', 'research:i', 'branding:i'],
    education: [
      { school: 'Đại học Khoa học Xã hội và Nhân văn TP.HCM', degree: 'Cử nhân', major: 'Báo chí', from: '2014', to: '2018' },
    ],
    experience: [
      { company: 'Bright Media', title: 'Chuyên viên chiến lược nội dung', from: '2020-05', to: '', current: true, description: 'Xây dựng chiến lược nội dung giúp tăng 3 lần lưu lượng tự nhiên trong 18 tháng.' },
      { company: 'Storyline Agency', title: 'Chuyên viên viết nội dung', from: '2018-07', to: '2020-04', description: 'Sản xuất nội dung cho khách hàng ngành công nghệ và giáo dục.' },
    ],
  },
  {
    id: 'c-016',
    name: 'Tạ Minh Quân',
    gender: 'male',
    birthDate: '1989-12-04',
    birthTime: '09:10',
    birthPlace: 'Hà Nội',
    city: 'Hà Nội',
    headline: 'Kiến trúc sư hệ thống đám mây',
    summary:
      'Kiến trúc sư hệ thống cloud với kinh nghiệm thiết kế hạ tầng cho các hệ thống nhiều triệu người dùng.',
    years: 12,
    seniority: 'lead',
    workModes: ['hybrid', 'remote'],
    salary: [65, 90],
    desiredTitle: 'Kiến trúc sư hệ thống đám mây trưởng',
    industries: ['Công nghệ', 'Viễn thông'],
    skills: ['cloud:e', 'aws:e', 'azure:p', 'terraform:p', 'kubernetes:p', 'system-design:e', 'cloud-security:i', 'leadership:i'],
    education: [
      { school: 'Đại học Công nghệ - ĐHQGHN', degree: 'Kỹ sư', major: 'Công nghệ thông tin', from: '2007', to: '2012' },
    ],
    experience: [
      { company: 'CloudPeak', title: 'Kiến trúc sư hệ thống đám mây', from: '2017-10', to: '', current: true, description: 'Thiết kế kiến trúc đa vùng cho nền tảng phát video trực tuyến.' },
      { company: 'VNTelecom', title: 'Kiến trúc sư hệ thống', from: '2012-08', to: '2017-09', description: 'Thiết kế hạ tầng cho dịch vụ viễn thông nội địa.' },
    ],
  },
  {
    id: 'c-017',
    name: 'Chu Ngọc Diệp',
    gender: 'female',
    birthDate: '1999-09-19',
    birthTime: '20:35',
    birthPlace: 'Hải Dương',
    city: 'Hà Nội',
    headline: 'Kỹ sư kiểm thử',
    summary:
      'Kỹ sư kiểm thử chuyển dịch mạnh sang tự động hoá, chú trọng chất lượng ngay từ giai đoạn thiết kế.',
    years: 2,
    seniority: 'junior',
    workModes: ['onsite', 'hybrid'],
    salary: [15, 24],
    desiredTitle: 'Kỹ sư kiểm thử tự động',
    industries: ['Công nghệ'],
    skills: ['testing:p', 'automation-testing:i', 'javascript:i', 'critical-thinking:p', 'teamwork:p', 'ci-cd:b'],
    education: [
      { school: 'Đại học Thăng Long', degree: 'Cử nhân', major: 'Công nghệ thông tin', from: '2017', to: '2021' },
    ],
    experience: [
      { company: 'Nimbus Software', title: 'Kỹ sư kiểm thử', from: '2022-03', to: '', current: true, description: 'Xây dựng bộ kiểm thử hồi quy tự động cho sản phẩm web.' },
    ],
  },
  {
    id: 'c-018',
    name: 'Mai Trọng Nghĩa',
    gender: 'male',
    birthDate: '1993-02-14',
    birthTime: '12:00',
    birthPlace: 'Vũng Tàu',
    city: 'TP. Hồ Chí Minh',
    headline: 'Trưởng phòng kinh doanh',
    summary:
      'Quản lý kinh doanh khối doanh nghiệp, có kinh nghiệm xây dựng đội ngũ bán hàng từ đầu.',
    years: 9,
    seniority: 'manager',
    workModes: ['onsite'],
    salary: [45, 70],
    desiredTitle: 'Giám đốc kinh doanh',
    industries: ['Công nghệ', 'Dịch vụ'],
    skills: ['sales:e', 'negotiation:e', 'communication:e', 'crm:p', 'leadership:p', 'business-development:p', 'presentation:p'],
    education: [
      { school: 'Đại học Kinh tế TP.HCM', degree: 'Cử nhân', major: 'Quản trị kinh doanh', from: '2011', to: '2015' },
    ],
    experience: [
      { company: 'Fluent Systems', title: 'Trưởng phòng kinh doanh', from: '2019-01', to: '', current: true, description: 'Xây dựng đội ngũ 12 người, tăng doanh thu khối doanh nghiệp 2,4 lần.' },
      { company: 'Orbit Commerce', title: 'Chuyên viên khách hàng doanh nghiệp', from: '2015-04', to: '2018-12', description: 'Phụ trách khách hàng doanh nghiệp vừa và nhỏ khu vực phía Nam.' },
    ],
  },
  {
    id: 'c-019',
    name: 'Hồ Nhật Minh',
    gender: 'male',
    birthDate: '2001-07-07',
    birthTime: '04:20',
    birthPlace: 'Quảng Nam',
    city: 'Đà Nẵng',
    headline: 'Kỹ sư phần mềm mới vào nghề',
    summary:
      'Lập trình viên trẻ, học nhanh, đang xây nền tảng vững về backend và cơ sở dữ liệu.',
    years: 1,
    seniority: 'fresher',
    workModes: ['onsite', 'hybrid'],
    salary: [12, 18],
    desiredTitle: 'Kỹ sư phần mềm',
    industries: ['Công nghệ'],
    skills: ['java:i', 'sql:i', 'python:b', 'problem-solving:i', 'teamwork:p', 'adaptability:p'],
    education: [
      { school: 'Đại học Duy Tân', degree: 'Kỹ sư', major: 'Công nghệ phần mềm', from: '2019', to: '2023' },
    ],
    experience: [
      { company: 'Danang Tech Hub', title: 'Lập trình viên mới vào nghề', from: '2023-06', to: '', current: true, description: 'Tham gia phát triển tính năng cho hệ thống quản lý học tập.' },
    ],
  },
  {
    id: 'c-020',
    name: 'Nguyễn Hải Yến',
    gender: 'female',
    birthDate: '1992-05-23',
    birthTime: '15:15',
    birthPlace: 'Hà Nội',
    city: 'Hà Nội',
    headline: 'Quản lý dự án',
    summary:
      'Quản lý dự án công nghệ, quen với các dự án nhiều bên liên quan và ràng buộc tiến độ chặt.',
    years: 8,
    seniority: 'manager',
    workModes: ['hybrid', 'onsite'],
    salary: [40, 58],
    desiredTitle: 'Quản lý chương trình',
    industries: ['Công nghệ', 'Ngân hàng'],
    skills: ['project-management:e', 'agile:e', 'communication:e', 'stakeholder-management:e', 'time-management:p', 'leadership:p', 'business-analysis:i'],
    education: [
      { school: 'Đại học Hà Nội', degree: 'Cử nhân', major: 'Quản trị kinh doanh', from: '2010', to: '2014' },
    ],
    experience: [
      { company: 'BankOne Digital', title: 'Quản lý dự án', from: '2018-06', to: '', current: true, description: 'Điều phối chương trình chuyển đổi số gồm 5 dự án song song.' },
      { company: 'FPT Information System', title: 'Điều phối viên dự án', from: '2015-02', to: '2018-05', description: 'Hỗ trợ quản lý tiến độ và tài liệu cho các dự án triển khai.' },
    ],
  },
  {
    id: 'c-021',
    name: 'Lâm Tuệ Nhi',
    gender: 'female',
    birthDate: '1995-01-16',
    birthTime: '22:45',
    birthPlace: 'TP. Hồ Chí Minh',
    city: 'TP. Hồ Chí Minh',
    headline: 'Chuyên viên khoa học dữ liệu',
    summary:
      'Nhà khoa học dữ liệu quan tâm tới bài toán dự báo nhu cầu và tối ưu vận hành trong bán lẻ.',
    years: 5.5,
    seniority: 'senior',
    workModes: ['hybrid', 'remote'],
    salary: [40, 58],
    desiredTitle: 'Trưởng nhóm khoa học dữ liệu',
    industries: ['Bán lẻ', 'Công nghệ'],
    skills: ['python:e', 'statistics:e', 'machine-learning:p', 'sql:p', 'data-analysis:e', 'tableau:i', 'presentation:p', 'critical-thinking:e'],
    education: [
      { school: 'Đại học Khoa học Tự nhiên TP.HCM', degree: 'Cử nhân', major: 'Toán ứng dụng', from: '2013', to: '2017' },
      { school: 'Đại học Quốc gia Singapore', degree: 'Thạc sĩ', major: 'Khoa học dữ liệu', from: '2017', to: '2019' },
    ],
    experience: [
      { company: 'Nova Retail', title: 'Chuyên viên khoa học dữ liệu', from: '2019-09', to: '', current: true, description: 'Xây dựng mô hình dự báo nhu cầu cho 300 cửa hàng.' },
    ],
  },
  {
    id: 'c-022',
    name: 'Võ Đức Thắng',
    gender: 'male',
    birthDate: '1987-10-08',
    birthTime: '01:05',
    birthPlace: 'Bình Định',
    city: 'TP. Hồ Chí Minh',
    headline: 'Giám đốc vận hành',
    summary:
      'Giám đốc vận hành với 15 năm kinh nghiệm tối ưu chuỗi cung ứng và mở rộng quy mô hoạt động.',
    years: 15,
    seniority: 'manager',
    workModes: ['onsite'],
    salary: [85, 130],
    desiredTitle: 'Giám đốc vận hành',
    industries: ['Sản xuất', 'Logistics'],
    skills: ['operations:e', 'supply-chain:e', 'leadership:e', 'project-management:p', 'data-analysis:i', 'negotiation:p', 'strategy:p'],
    education: [
      { school: 'Đại học Bách khoa TP.HCM', degree: 'Kỹ sư', major: 'Kỹ thuật hệ thống công nghiệp', from: '2005', to: '2010' },
    ],
    experience: [
      { company: 'Trường Sơn Logistics', title: 'Giám đốc vận hành', from: '2017-01', to: '', current: true, description: 'Tối ưu mạng lưới kho vận toàn quốc, giảm 18% chi phí trên đơn hàng.' },
      { company: 'An Phú Group', title: 'Trưởng phòng vận hành', from: '2011-03', to: '2016-12', description: 'Quản lý vận hành nhà máy và điều phối sản xuất.' },
    ],
  },
  {
    id: 'c-023',
    name: 'Đặng Kim Chi',
    gender: 'female',
    birthDate: '1998-03-28',
    birthTime: '18:20',
    birthPlace: 'Thái Bình',
    city: 'Hà Nội',
    headline: 'Chuyên viên tuyển dụng',
    summary:
      'Chuyên viên tuyển dụng mảng công nghệ, có mạng lưới ứng viên rộng và khả năng đánh giá nhanh.',
    years: 3,
    seniority: 'middle',
    workModes: ['hybrid', 'remote'],
    salary: [18, 28],
    desiredTitle: 'Trưởng nhóm tuyển dụng',
    industries: ['Công nghệ', 'Nhân sự'],
    skills: ['recruitment:e', 'communication:e', 'hr:p', 'negotiation:p', 'crm:i', 'adaptability:p', 'presentation:i'],
    education: [
      { school: 'Đại học Công đoàn', degree: 'Cử nhân', major: 'Quản trị nhân lực', from: '2016', to: '2020' },
    ],
    experience: [
      { company: 'VietTalent', title: 'Chuyên viên tuyển dụng', from: '2021-01', to: '', current: true, description: 'Tuyển thành công 60+ vị trí kỹ thuật trong 2 năm.' },
    ],
  },
  {
    id: 'c-024',
    name: 'Trương Việt Anh',
    gender: 'male',
    birthDate: '1994-08-02',
    birthTime: '10:55',
    birthPlace: 'Hà Nội',
    city: 'Hà Nội',
    headline: 'Kỹ sư blockchain',
    summary:
      'Kỹ sư blockchain tập trung vào hợp đồng thông minh và bảo mật giao thức phi tập trung.',
    years: 5,
    seniority: 'senior',
    workModes: ['remote'],
    salary: [45, 70],
    desiredTitle: 'Kỹ sư giao thức blockchain',
    industries: ['Blockchain', 'Fintech'],
    skills: ['blockchain:e', 'smart-contract:e', 'javascript:p', 'golang:i', 'cybersecurity:i', 'system-design:p', 'critical-thinking:p'],
    education: [
      { school: 'Đại học Bách khoa Hà Nội', degree: 'Kỹ sư', major: 'Khoa học máy tính', from: '2012', to: '2017' },
    ],
    experience: [
      { company: 'ChainLabs Asia', title: 'Kỹ sư blockchain', from: '2020-03', to: '', current: true, description: 'Phát triển và kiểm định hợp đồng thông minh cho giao thức cho vay.' },
      { company: 'Paylink', title: 'Kỹ sư phần mềm', from: '2017-09', to: '2020-02', description: 'Phát triển dịch vụ thanh toán và tích hợp ví điện tử.' },
    ],
  },
  {
    id: 'c-025',
    name: 'Kiều Anh Thư',
    gender: 'female',
    birthDate: '2000-04-21',
    birthTime: '07:05',
    birthPlace: 'Hưng Yên',
    city: 'Hà Nội',
    headline: 'Chuyên viên marketing số',
    summary:
      'Chuyên viên marketing số, mạnh về quảng cáo hiệu suất và tối ưu chuyển đổi.',
    years: 2,
    seniority: 'junior',
    workModes: ['hybrid', 'onsite'],
    salary: [13, 20],
    desiredTitle: 'Chuyên viên marketing hiệu suất',
    industries: ['Thương mại điện tử', 'Tiêu dùng'],
    skills: ['digital-marketing:p', 'marketing:i', 'seo:i', 'data-analysis:i', 'content-writing:i', 'creativity:p', 'adaptability:p'],
    education: [
      { school: 'Đại học Thương mại', degree: 'Cử nhân', major: 'Marketing', from: '2018', to: '2022' },
    ],
    experience: [
      { company: 'Shopline Vietnam', title: 'Chuyên viên marketing số', from: '2022-08', to: '', current: true, description: 'Quản lý chiến dịch quảng cáo đa kênh với ngân sách 500 triệu/tháng.' },
    ],
  },
  {
    id: 'c-026',
    name: 'Bạch Trung Hiếu',
    gender: 'male',
    birthDate: '1990-11-15',
    birthTime: '13:40',
    birthPlace: 'Hà Tĩnh',
    city: 'Hà Nội',
    headline: 'Kỹ sư nghiên cứu',
    summary:
      'Kỹ sư nghiên cứu trong lĩnh vực xử lý ngôn ngữ tự nhiên tiếng Việt, có công bố khoa học quốc tế.',
    years: 9,
    seniority: 'lead',
    workModes: ['hybrid', 'remote'],
    salary: [55, 80],
    desiredTitle: 'Kỹ sư nghiên cứu trưởng',
    industries: ['Nghiên cứu', 'Công nghệ'],
    skills: ['research:e', 'nlp:e', 'deep-learning:e', 'python:e', 'pytorch:p', 'statistics:p', 'critical-thinking:e', 'mentoring:i'],
    education: [
      { school: 'Đại học Công nghệ - ĐHQGHN', degree: 'Kỹ sư', major: 'Khoa học máy tính', from: '2008', to: '2013' },
      { school: 'Đại học Tokyo', degree: 'Tiến sĩ', major: 'Trí tuệ nhân tạo', from: '2014', to: '2019' },
    ],
    experience: [
      { company: 'Zentra Technology', title: 'Kỹ sư nghiên cứu', from: '2019-11', to: '', current: true, description: 'Dẫn dắt hướng nghiên cứu mô hình ngôn ngữ cho tiếng Việt.' },
    ],
  },
  {
    id: 'c-027',
    name: 'Tô Gia Hân',
    gender: 'female',
    birthDate: '1997-02-03',
    birthTime: '23:50',
    birthPlace: 'Đồng Nai',
    city: 'TP. Hồ Chí Minh',
    headline: 'Chuyên viên nghiên cứu người dùng',
    summary:
      'Nghiên cứu viên trải nghiệm người dùng, kết hợp phỏng vấn định tính và phân tích hành vi định lượng.',
    years: 4,
    seniority: 'middle',
    workModes: ['hybrid', 'remote'],
    salary: [25, 36],
    desiredTitle: 'Chuyên viên nghiên cứu người dùng cao cấp',
    industries: ['Công nghệ', 'Giáo dục'],
    skills: ['user-research:e', 'ux-ui:p', 'research:p', 'communication:e', 'data-analysis:i', 'presentation:p', 'critical-thinking:p'],
    education: [
      { school: 'Đại học Khoa học Xã hội và Nhân văn TP.HCM', degree: 'Cử nhân', major: 'Tâm lý học', from: '2015', to: '2019' },
    ],
    experience: [
      { company: 'Lumen Studio', title: 'Chuyên viên nghiên cứu người dùng', from: '2021-06', to: '', current: true, description: 'Thiết lập quy trình nghiên cứu người dùng định kỳ cho 4 dòng sản phẩm.' },
    ],
  },
  {
    id: 'c-028',
    name: 'Huỳnh Bá Lộc',
    gender: 'male',
    birthDate: '1986-06-11',
    birthTime: '05:30',
    birthPlace: 'Tiền Giang',
    city: 'TP. Hồ Chí Minh',
    headline: 'Chuyên gia tư vấn quản trị',
    summary:
      'Tư vấn quản trị với kinh nghiệm tái cấu trúc vận hành cho doanh nghiệp sản xuất và bán lẻ.',
    years: 14,
    seniority: 'manager',
    workModes: ['onsite', 'hybrid'],
    salary: [75, 110],
    desiredTitle: 'Quản lý dự án tư vấn',
    industries: ['Tư vấn', 'Sản xuất'],
    skills: ['consulting:e', 'strategy:e', 'presentation:e', 'financial-modeling:p', 'critical-thinking:e', 'stakeholder-management:e', 'market-research:p'],
    education: [
      { school: 'Đại học Ngoại thương', degree: 'Cử nhân', major: 'Kinh tế đối ngoại', from: '2004', to: '2008' },
      { school: 'INSEAD', degree: 'Thạc sĩ', major: 'Quản trị kinh doanh', from: '2012', to: '2013' },
    ],
    experience: [
      { company: 'Meridian Advisory', title: 'Chuyên gia tư vấn quản trị', from: '2014-02', to: '', current: true, description: 'Dẫn dắt các dự án tái cấu trúc vận hành cho khách hàng doanh nghiệp lớn.' },
      { company: 'An Phú Group', title: 'Chuyên viên phân tích nghiệp vụ', from: '2009-01', to: '2012-06', description: 'Phân tích hiệu quả kinh doanh của các đơn vị thành viên.' },
    ],
  },
  {
    id: 'c-029',
    name: 'Nông Thị Sao Mai',
    gender: 'female',
    birthDate: '1996-12-09',
    birthTime: '16:10',
    birthPlace: 'Lạng Sơn',
    city: 'Hà Nội',
    headline: 'Kỹ sư ứng dụng di động',
    summary:
      'Kỹ sư di động với thế mạnh React Native, chú trọng hiệu năng và trải nghiệm người dùng cuối.',
    years: 4.5,
    seniority: 'middle',
    workModes: ['remote', 'hybrid'],
    salary: [30, 44],
    desiredTitle: 'Kỹ sư ứng dụng di động cao cấp',
    industries: ['Công nghệ', 'Fintech'],
    skills: ['mobile-dev:e', 'javascript:p', 'typescript:p', 'react:p', 'api-design:i', 'ux-ui:i', 'problem-solving:p'],
    education: [
      { school: 'Đại học Công nghiệp Hà Nội', degree: 'Kỹ sư', major: 'Công nghệ thông tin', from: '2014', to: '2018' },
    ],
    experience: [
      { company: 'Paylink', title: 'Kỹ sư ứng dụng di động', from: '2020-10', to: '', current: true, description: 'Phát triển ứng dụng ví điện tử với hơn 500 nghìn người dùng.' },
      { company: 'Webflow Vietnam', title: 'Lập trình viên giao diện', from: '2018-09', to: '2020-09', description: 'Phát triển giao diện web cho các dự án khách hàng.' },
    ],
  },
  {
    id: 'c-030',
    name: 'Quách Đăng Khôi',
    gender: 'male',
    birthDate: '1991-03-06',
    birthTime: '08:45',
    birthPlace: 'Hà Nội',
    city: 'Hà Nội',
    headline: 'Trưởng phòng phát triển kinh doanh',
    summary:
      'Phát triển kinh doanh khu vực, mạnh về xây dựng quan hệ đối tác chiến lược và mở thị trường mới.',
    years: 9,
    seniority: 'manager',
    workModes: ['onsite', 'hybrid'],
    salary: [50, 75],
    desiredTitle: 'Giám đốc phát triển kinh doanh',
    industries: ['Công nghệ', 'Dịch vụ'],
    skills: ['business-development:e', 'negotiation:e', 'strategy:p', 'communication:e', 'market-research:p', 'sales:p', 'leadership:i'],
    education: [
      { school: 'Đại học Kinh tế Quốc dân', degree: 'Cử nhân', major: 'Quản trị kinh doanh', from: '2009', to: '2013' },
    ],
    experience: [
      { company: 'Fluent Systems', title: 'Trưởng phòng phát triển kinh doanh', from: '2018-08', to: '', current: true, description: 'Mở rộng mạng lưới đối tác lên 40 doanh nghiệp trong 3 năm.' },
      { company: 'Metrix Vietnam', title: 'Chuyên viên phát triển kinh doanh', from: '2014-01', to: '2018-07', description: 'Phát triển khách hàng doanh nghiệp khu vực miền Bắc.' },
    ],
  },
  {
    id: 'c-031',
    name: 'Thái Bảo Trâm',
    gender: 'female',
    birthDate: '1993-10-27',
    birthTime: '11:15',
    birthPlace: 'Cần Thơ',
    city: 'TP. Hồ Chí Minh',
    headline: 'Kế toán trưởng',
    summary:
      'Kế toán trưởng với kinh nghiệm kiểm soát tài chính cho doanh nghiệp quy mô vừa.',
    years: 8,
    seniority: 'manager',
    workModes: ['onsite'],
    salary: [35, 50],
    desiredTitle: 'Kiểm soát viên tài chính',
    industries: ['Sản xuất', 'Dịch vụ'],
    skills: ['accounting:e', 'finance:p', 'risk-management:i', 'sql:b', 'time-management:p', 'critical-thinking:p', 'leadership:i'],
    education: [
      { school: 'Đại học Kinh tế TP.HCM', degree: 'Cử nhân', major: 'Kế toán - Kiểm toán', from: '2011', to: '2015' },
    ],
    experience: [
      { company: 'Trường Sơn Logistics', title: 'Kế toán trưởng', from: '2019-04', to: '', current: true, description: 'Quản lý đội kế toán 6 người và toàn bộ báo cáo tài chính.' },
      { company: 'An Phú Group', title: 'Kế toán tổng hợp', from: '2015-08', to: '2019-03', description: 'Phụ trách kế toán tổng hợp và báo cáo thuế.' },
    ],
  },
  {
    id: 'c-032',
    name: 'Lưu Hoàng Long',
    gender: 'male',
    birthDate: '1998-08-13',
    birthTime: '19:25',
    birthPlace: 'Bắc Giang',
    city: 'Hà Nội',
    headline: 'Chuyên viên hỗ trợ kỹ thuật',
    summary:
      'Chuyên viên hỗ trợ CNTT, quen xử lý sự cố nhanh và duy trì vận hành hệ thống nội bộ ổn định.',
    years: 3,
    seniority: 'junior',
    workModes: ['onsite'],
    salary: [12, 18],
    desiredTitle: 'Quản trị viên hệ thống',
    industries: ['Công nghệ', 'Dịch vụ'],
    skills: ['it-support:e', 'system-administration:p', 'network:p', 'linux:i', 'communication:p', 'time-management:p'],
    education: [
      { school: 'Cao đẳng FPT Polytechnic', degree: 'Cao đẳng', major: 'Quản trị mạng', from: '2016', to: '2019' },
    ],
    experience: [
      { company: 'Techbase JSC', title: 'Chuyên viên hỗ trợ kỹ thuật', from: '2021-02', to: '', current: true, description: 'Hỗ trợ 200 người dùng nội bộ và quản trị hệ thống mạng văn phòng.' },
    ],
  },
  {
    id: 'c-033',
    name: 'Ninh Thuỳ Dương',
    gender: 'female',
    birthDate: '1995-05-31',
    birthTime: '02:55',
    birthPlace: 'Ninh Bình',
    city: 'Hà Nội',
    headline: 'Trưởng nhóm đào tạo & phát triển',
    summary:
      'Phụ trách đào tạo nội bộ, thiết kế chương trình phát triển năng lực cho đội ngũ quản lý cấp trung.',
    years: 6,
    seniority: 'senior',
    workModes: ['hybrid', 'onsite'],
    salary: [30, 42],
    desiredTitle: 'Trưởng phòng đào tạo & phát triển',
    industries: ['Nhân sự', 'Giáo dục'],
    skills: ['training:e', 'presentation:e', 'communication:e', 'mentoring:p', 'hr:p', 'content-writing:i', 'project-management:i'],
    education: [
      { school: 'Đại học Sư phạm Hà Nội', degree: 'Cử nhân', major: 'Tâm lý giáo dục', from: '2013', to: '2017' },
    ],
    experience: [
      { company: 'Nova Retail', title: 'Trưởng nhóm đào tạo', from: '2020-03', to: '', current: true, description: 'Thiết kế chương trình đào tạo quản lý cửa hàng cho 300 nhân sự.' },
      { company: 'VietTalent', title: 'Chuyên viên đào tạo', from: '2017-09', to: '2020-02', description: 'Tổ chức các khoá đào tạo kỹ năng mềm cho khách hàng doanh nghiệp.' },
    ],
  },
  {
    id: 'c-034',
    name: 'Ưng Chí Thành',
    gender: 'male',
    birthDate: '1992-01-19',
    birthTime: '21:35',
    birthPlace: 'Huế',
    city: 'Đà Nẵng',
    headline: 'Kỹ sư full-stack',
    summary:
      'Kỹ sư full-stack làm được từ giao diện tới hạ tầng, phù hợp với đội ngũ sản phẩm quy mô nhỏ.',
    years: 7,
    seniority: 'senior',
    workModes: ['remote', 'hybrid'],
    salary: [38, 55],
    desiredTitle: 'Trưởng nhóm kỹ thuật',
    industries: ['Công nghệ', 'SaaS'],
    skills: ['typescript:e', 'react:e', 'nodejs:p', 'sql:p', 'docker:i', 'system-design:p', 'api-design:p', 'problem-solving:e'],
    education: [
      { school: 'Đại học Bách khoa Đà Nẵng', degree: 'Kỹ sư', major: 'Công nghệ thông tin', from: '2010', to: '2015' },
    ],
    experience: [
      { company: 'Lumen Studio', title: 'Kỹ sư full-stack', from: '2019-05', to: '', current: true, description: 'Xây dựng nền tảng sản phẩm nội bộ từ giai đoạn đầu.' },
      { company: 'Danang Tech Hub', title: 'Kỹ sư phần mềm', from: '2016-01', to: '2019-04', description: 'Phát triển ứng dụng web cho khách hàng nước ngoài.' },
    ],
  },
]

/* ------------------------------------------------------------------ */
/* Expansion                                                           */
/* ------------------------------------------------------------------ */

function parseSkills(entries: string[]): CandidateSkill[] {
  return entries.flatMap((entry) => {
    const [skillId, levelCode] = entry.split(':')
    const skill = SKILL_BY_ID[skillId as string]
    if (!skill) return []
    const level = LEVEL_ALIAS[levelCode ?? 'p'] ?? 'proficient'
    return [{ skillId: skill.id, name: skill.name, category: skill.category, level }]
  })
}

function buildCandidate(seed: CandidateSeed): Candidate {
  const education: Education[] = seed.education.map((e, index) => ({
    id: `${seed.id}-edu-${index}`,
    school: e.school,
    degree: e.degree,
    major: e.major,
    startYear: e.from,
    endYear: e.to,
  }))

  const experience: Experience[] = seed.experience.map((e, index) => ({
    id: `${seed.id}-exp-${index}`,
    company: e.company,
    title: e.title,
    startDate: e.from,
    endDate: e.to,
    current: Boolean(e.current),
    description: e.description,
  }))

  const birth = {
    birthDate: seed.birthDate,
    birthTime: seed.birthTime,
    birthPlace: seed.birthPlace,
    gender: seed.gender,
  }

  return {
    id: seed.id,
    personal: {
      ...birth,
      fullName: seed.name,
      currentCity: seed.city,
      email: `${seed.id}@demo.vhuman.app`,
      phone: '09xx xxx xxx',
      avatar: '',
    },
    education,
    experience,
    skills: parseSkills(seed.skills),
    preference: {
      industries: seed.industries,
      desiredTitle: seed.desiredTitle,
      seniority: seed.seniority,
      workModes: seed.workModes,
      preferredLocations: [seed.city],
      salaryMin: seed.salary[0],
      salaryMax: seed.salary[1],
    },
    headline: seed.headline,
    summary: seed.summary,
    yearsOfExperience: seed.years,
    // Profiles are derived deterministically at module load: identical every run.
    astrology: astrologyEngine.analyze(birth),
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
  }
}

export const SEED_CANDIDATES: Candidate[] = SEEDS.map(buildCandidate)

export const CANDIDATE_BY_ID: Record<string, Candidate> = Object.fromEntries(
  SEED_CANDIDATES.map((candidate) => [candidate.id, candidate]),
)

/** Distinct cities present in the demo dataset: powers the location filter. */
export const CANDIDATE_LOCATIONS: string[] = Array.from(
  new Set(SEED_CANDIDATES.map((c) => c.personal.currentCity)),
).sort()

/** Distinct degrees present in the demo dataset: powers the education filter. */
export const CANDIDATE_DEGREES: string[] = Array.from(
  new Set(SEED_CANDIDATES.flatMap((c) => c.education.map((e) => e.degree))),
).sort()
