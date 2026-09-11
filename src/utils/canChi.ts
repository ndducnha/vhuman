/**
 * Can Chi (Thiên Can / Địa Chi) for a solar year.
 *
 * Computed rather than tabulated: 1984 is Giáp Tý, and both cycles advance one
 * step per year, so `year - 4` indexes straight into each list.
 */

export const THIEN_CAN = [
  'Giáp', 'Ất', 'Bính', 'Đinh', 'Mậu',
  'Kỷ', 'Canh', 'Tân', 'Nhâm', 'Quý',
] as const

export const DIA_CHI = [
  'Tý', 'Sửu', 'Dần', 'Mão', 'Thìn', 'Tỵ',
  'Ngọ', 'Mùi', 'Thân', 'Dậu', 'Tuất', 'Hợi',
] as const

/** e.g. canChiOfYear(2026) → "Bính Ngọ" */
export function canChiOfYear(year: number): string {
  const offset = year - 4
  const can = THIEN_CAN[((offset % 10) + 10) % 10]
  const chi = DIA_CHI[((offset % 12) + 12) % 12]
  return `${can} ${chi}`
}
