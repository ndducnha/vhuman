import type { ManagerProfile, Recruiter } from '@/types'
import { astrologyEngine } from '@/services/astrology'

/** The demo recruiter identity used when entering recruiter mode. */
export const DEMO_RECRUITER: Recruiter = {
  id: 'r-001',
  fullName: 'Phạm Thu Hằng',
  company: 'Zentra Technology',
  title: 'Trưởng nhóm tuyển dụng',
  email: 'recruiter@demo.vhuman.app',
  location: 'Hà Nội',
}

interface ManagerSeed {
  id: string
  fullName: string
  role: ManagerProfile['role']
  company: string
  birthDate: string
  birthTime: string
  birthPlace: string
  gender: ManagerProfile['gender']
}

const MANAGER_SEEDS: ManagerSeed[] = [
  {
    id: 'm-001',
    fullName: 'Nguyễn Văn Bảo',
    role: 'ceo',
    company: 'Zentra Technology',
    birthDate: '1981-07-22',
    birthTime: '09:40',
    birthPlace: 'Hà Nội',
    gender: 'male',
  },
  {
    id: 'm-002',
    fullName: 'Lê Thị Hồng Vân',
    role: 'owner',
    company: 'Nova Retail',
    birthDate: '1978-11-05',
    birthTime: '15:20',
    birthPlace: 'TP. Hồ Chí Minh',
    gender: 'female',
  },
  {
    id: 'm-003',
    fullName: 'Trần Quốc Cường',
    role: 'direct_manager',
    company: 'CloudPeak',
    birthDate: '1986-02-28',
    birthTime: '06:10',
    birthPlace: 'Đà Nẵng',
    gender: 'male',
  },
]

/** Demo manager profiles, ready for the compatibility tab out of the box. */
export const SEED_MANAGERS: ManagerProfile[] = MANAGER_SEEDS.map((seed) => ({
  ...seed,
  astrology: astrologyEngine.analyze({
    birthDate: seed.birthDate,
    birthTime: seed.birthTime,
    birthPlace: seed.birthPlace,
    gender: seed.gender,
  }),
  createdAt: '2024-01-01T00:00:00.000Z',
}))
