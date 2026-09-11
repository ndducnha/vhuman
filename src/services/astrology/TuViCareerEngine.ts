import type {
  AstrologyCareerProvider, Brightness, CareerCycleState, CareerFamilyId,
  CareerMode, CareerTraitKey, CareerTraitVector, Confidence, FamilyScore,
  StarId, StarPlacement, TransformId, TuViCareerProfile, TuViChart,
} from '@/types/tuvi'
import {
  BRIGHTNESS_FACTOR, BRIGHTNESS_LABEL, CAREER_FAMILIES, CAREER_MODES,
  FAMILY_BY_ID, HYBRID_ARCHETYPES, PALACES, STAR_BY_ID,
  TRANSFORMS, TRAIT_LABEL_VI,
} from '@/data/tuvi'
import { createRng, hashString, signatureOf } from '@/utils/hash'
import { canChiOfYear } from '@/utils/canChi'

const TRAIT_KEYS: CareerTraitKey[] = [
  'leadership', 'governance', 'resource_management', 'execution',
  'entrepreneurship', 'transformation', 'risk_tolerance',
  'analysis', 'research', 'technical',
  'communication', 'public_visibility',
  'service', 'creativity', 'autonomy', 'structure',
]

const BRIGHTNESS_POOL: Brightness[] = ['mieu', 'vuong', 'dac', 'ham']

/**
 * Engine phân loại nghề nghiệp từ lá số Tử Vi, bản mô phỏng tất định.
 *
 * Đây chưa phải engine an sao thật. Nó nhận dữ liệu sinh, sinh ra một cách an
 * sao ổn định, rồi chạy đúng chuỗi phân loại mà engine thật cũng sẽ chạy:
 * cung có sao gì, sao đóng góp đặc tính nào, Tứ Hóa điều chỉnh ra sao, miếu
 * hãm ảnh hưởng độ rõ tới đâu, và vận hiện tại đang ở chế độ nào.
 *
 * Nhờ giữ đúng chuỗi đó, thay engine thật sau này chỉ là thay bước an sao,
 * toàn bộ phần dưới và giao diện giữ nguyên.
 *
 * Không dùng Math.random ở bất kỳ đâu: cùng dữ liệu sinh luôn cho cùng kết quả.
 */
export class TuViCareerEngine implements AstrologyCareerProvider {
  readonly name = 'TuViCareerEngine'
  readonly version = '0.1.0'

  private cache = new Map<string, TuViCareerProfile>()

  constructor(private readonly now: () => Date = () => new Date()) {}

  private keyOf(chart: TuViChart): string {
    return [
      chart.birthDate.trim(),
      chart.birthTime.trim() || '12:00',
      chart.gender,
      chart.birthPlace.trim().toLowerCase(),
    ].join('|')
  }

  /**
   * An sao mô phỏng: mỗi cung nhận một tới hai chính tinh, kèm độ sáng và có
   * thể kèm một Tứ Hóa. Engine thật sẽ thay đúng hàm này.
   */
  private placeStars(key: string): StarPlacement[] {
    const placements: StarPlacement[] = []
    const used = new Set<StarId>()

    PALACES.forEach((palace, index) => {
      const rng = createRng(hashString(`${key}::palace::${palace.id}::${index}`))
      // Cung trọng số cao thì có khả năng nhận hai chính tinh.
      const count = palace.weight >= 0.25 ? 2 : rng() > 0.55 ? 2 : 1

      for (let i = 0; i < count; i += 1) {
        const pick = createRng(hashString(`${key}::${palace.id}::star::${i}`))

        /*
         * Bốc nhóm trước, rồi mới bốc sao trong nhóm.
         *
         * Nếu bốc thẳng trên cả 14 sao thì nhóm đông sao luôn thắng: Tử Phủ có
         * 5 sao còn Cự Nhật chỉ có 2, nên Cự Nhật gần như không bao giờ nổi
         * trội. Đó là sai lệch do cách bốc, không phải đặc điểm của lá số.
         */
        const familyIndex = Math.floor(pick() * CAREER_FAMILIES.length)
        const family = CAREER_FAMILIES[familyIndex] ?? CAREER_FAMILIES[0]
        const inFamily = family.stars.map((id) => STAR_BY_ID[id]).filter(Boolean)
        const fresh = inFamily.filter((s) => !used.has(s.id))
        const source = fresh.length > 0 ? fresh : inFamily
        const star = source[Math.floor(pick() * source.length)]
        if (!star) continue
        used.add(star.id)

        const brightness = BRIGHTNESS_POOL[Math.floor(pick() * BRIGHTNESS_POOL.length)] as Brightness
        // Khoảng một phần ba số sao mang Tứ Hóa.
        const hasTransform = pick() > 0.66
        const transform = hasTransform
          ? (TRANSFORMS[Math.floor(pick() * TRANSFORMS.length)]?.id as TransformId)
          : undefined

        placements.push({ star: star.id, palace: palace.id, brightness, transform })
      }
    })

    return placements
  }

  classifyCareerProfile(chart: TuViChart): TuViCareerProfile {
    const key = this.keyOf(chart)
    const cached = this.cache.get(key)
    if (cached) return cached

    const placements = this.placeStars(key)

    /* ── Vector đặc tính, cộng theo trọng số cung và độ sáng ─────── */
    const traits = TRAIT_KEYS.reduce((acc, k) => {
      acc[k] = 0
      return acc
    }, {} as CareerTraitVector)
    const familyRaw: Record<CareerFamilyId, number> = {
      tu_phu_vu_tuong_liem: 0, sat_pha_tham: 0, co_nguyet_dong_luong: 0, cu_nhat: 0,
    }
    let totalWeight = 0

    for (const placement of placements) {
      const star = STAR_BY_ID[placement.star]
      const palace = PALACES.find((p) => p.id === placement.palace)
      if (!star || !palace) continue

      const weight = palace.weight * BRIGHTNESS_FACTOR[placement.brightness]
      totalWeight += weight
      familyRaw[star.family] += weight

      for (const [trait, value] of Object.entries(star.traits)) {
        traits[trait as CareerTraitKey] += (value ?? 0) * weight
      }
      // Tứ Hóa điều chỉnh, không thay archetype.
      if (placement.transform) {
        const tf = TRANSFORMS.find((t) => t.id === placement.transform)
        for (const [trait, bias] of Object.entries(tf?.traitBias ?? {})) {
          traits[trait as CareerTraitKey] += (bias ?? 0) * weight
        }
      }
    }

    /*
     * Chuẩn hoá về 0 tới 1.
     *
     * Mỗi sao chỉ đóng góp cho khoảng 5 trong 16 chiều, nên nếu chỉ chia cho
     * tổng trọng số thì mọi chiều đều bị pha loãng xuống dưới 0.4, trong khi
     * vector nghề lên tới 0.95. Hậu quả là chiều nào cũng bị chấm là thiếu và
     * điểm phản chiếu dồn cục lại, không phân biệt được nghề nào hợp hơn.
     *
     * BASE giữ cho chiều không có sao nào đóng góp vẫn khác 0, vì không ai
     * hoàn toàn không có một đặc tính nào. GAIN kéo dải giá trị trở lại mức so
     * sánh được với vector nghề.
     */
    const divisor = totalWeight || 1
    const BASE = 0.08
    const GAIN = 2.0
    for (const k of TRAIT_KEYS) {
      traits[k] = clamp01(BASE + (traits[k] / divisor) * GAIN)
    }

    /* ── Phân bố bốn nhóm ───────────────────────────────────────── */
    const familySum = Object.values(familyRaw).reduce((a, b) => a + b, 0) || 1
    const families: FamilyScore[] = CAREER_FAMILIES.map((f) => ({
      family: f.id,
      percent: Math.round((familyRaw[f.id] / familySum) * 100),
    })).sort((a, b) => b.percent - a.percent)
    // Bù sai số làm tròn vào nhóm đứng đầu.
    const drift = 100 - families.reduce((sum, f) => sum + f.percent, 0)
    if (families[0]) families[0].percent += drift

    const dominantFamily = families[0]?.family ?? 'tu_phu_vu_tuong_liem'
    const secondaryFamily = families[1]?.family ?? 'co_nguyet_dong_luong'

    /* ── Sao nổi bật: ưu tiên cung nặng và sao sáng ─────────────── */
    const dominantStars = [...placements]
      .sort((a, b) => starWeight(b) - starWeight(a))
      .slice(0, 4)

    /* ── Tổ hợp ─────────────────────────────────────────────────── */
    const present = new Set(dominantStars.map((p) => p.star))
    const hybrid = HYBRID_ARCHETYPES.find(
      (h) => present.has(h.stars[0]) && present.has(h.stars[1]),
    )
    if (hybrid) {
      for (const [trait, bias] of Object.entries(hybrid.traitBias)) {
        traits[trait as CareerTraitKey] = clamp01(traits[trait as CareerTraitKey] + (bias ?? 0))
      }
    }

    /* ── Độ tin cậy ─────────────────────────────────────────────── */
    const topPercent = families[0]?.percent ?? 0
    const hamCount = placements.filter((p) => p.brightness === 'ham').length
    const confidence: Confidence =
      topPercent >= 45 && hamCount <= 2 ? 'high' : topPercent >= 32 ? 'medium' : 'low'

    const cycle = this.calculateCareerCycle(chart, this.now())

    const profile: TuViCareerProfile = {
      signature: signatureOf(key),
      families,
      dominantFamily,
      secondaryFamily,
      dominantStars,
      hybrid,
      traits,
      cycle,
      confidence,
      explanations: buildExplanations(families, dominantStars, hybrid, traits),
      cautions: buildCautions(placements, confidence, traits),
    }

    this.cache.set(key, profile)
    return profile
  }

  /**
   * Chế độ nghề nghiệp hiện tại.
   * Không dùng để dự đoán sự kiện, chỉ để phân loại nên ưu tiên việc gì lúc này.
   */
  calculateCareerCycle(chart: TuViChart, date: Date): CareerCycleState {
    const key = this.keyOf(chart)
    const birthYear = Number(chart.birthDate.slice(0, 4)) || date.getFullYear() - 30
    const currentYear = date.getFullYear()
    const age = Math.max(0, currentYear - birthYear)

    const startAge = 2 + (hashString(`${key}::cycle-start`) % 8)
    const elapsed = Math.max(0, age - startAge)
    const cycleIndex = Math.floor(elapsed / 10)
    const fromYear = birthYear + startAge + cycleIndex * 10
    const toYear = fromYear + 9

    // Chế độ đổi theo cả đại vận lẫn năm, nên năm nào cũng có sắc thái riêng.
    const modes: CareerMode[] = ['LEARN', 'BUILD', 'EXPAND', 'LEAD', 'TRANSFORM', 'CONSOLIDATE', 'CAUTION']
    const modeIndex = hashString(`${key}::mode::${fromYear}::${currentYear}`) % modes.length
    const mode = modes[modeIndex] as CareerMode
    const meta = CAREER_MODES[mode]

    // Càng gần đầu đại vận thì tín hiệu càng chưa rõ.
    const yearsIn = currentYear - fromYear
    const confidence: Confidence = yearsIn >= 3 && yearsIn <= 8 ? 'high' : yearsIn >= 1 ? 'medium' : 'low'

    return {
      mode,
      confidence,
      majorLabel: `Đại Vận ${fromYear}-${toYear}`,
      majorFrom: fromYear,
      majorTo: toYear,
      yearLabel: `Lưu Niên ${currentYear}`,
      year: currentYear,
      canChi: canChiOfYear(currentYear),
      summary: meta.summary,
      actions: [...meta.actions],
    }
  }
}

/* ── Phụ trợ ───────────────────────────────────────────────────── */

function clamp01(v: number): number {
  return Math.max(0, Math.min(1, v))
}

function starWeight(p: StarPlacement): number {
  const palace = PALACES.find((x) => x.id === p.palace)
  return (palace?.weight ?? 0) * BRIGHTNESS_FACTOR[p.brightness]
}

function buildExplanations(
  families: FamilyScore[],
  stars: StarPlacement[],
  hybrid: ReturnType<typeof HYBRID_ARCHETYPES.find>,
  traits: CareerTraitVector,
): string[] {
  const out: string[] = []
  const top = families[0]
  const second = families[1]

  if (top) {
    const f = FAMILY_BY_ID[top.family]
    out.push(`Nhóm nổi trội là ${f.name} ở mức ${top.percent}%, ứng với kiểu ${f.archetype.toLowerCase()}.`)
  }
  if (second && second.percent >= 15) {
    const f = FAMILY_BY_ID[second.family]
    out.push(`Nhóm phụ là ${f.name} ở mức ${second.percent}%, thường bổ trợ cho nhóm chính.`)
  }
  const lead = stars[0]
  if (lead) {
    const s = STAR_BY_ID[lead.star]
    const palace = PALACES.find((p) => p.id === lead.palace)
    out.push(
      `${s.name} nằm ở cung ${palace?.name} trạng thái ${BRIGHTNESS_LABEL[lead.brightness]}. ${s.summary}`,
    )
  }
  if (hybrid) {
    out.push(`Tổ hợp ${hybrid.name} cho kiểu ${hybrid.archetype.toLowerCase()}: ${hybrid.direction.toLowerCase()}.`)
  }

  const strongest = [...Object.entries(traits)]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([k]) => TRAIT_LABEL_VI[k]?.toLowerCase() ?? k)
  out.push(`Ba đặc tính nổi nhất trong hồ sơ: ${strongest.join(', ')}.`)

  return out
}

function buildCautions(
  placements: StarPlacement[],
  confidence: Confidence,
  traits: CareerTraitVector,
): string[] {
  const out: string[] = []

  const ham = placements.filter((p) => p.brightness === 'ham')
  if (ham.length >= 3) {
    out.push(
      'Nhiều sao ở trạng thái Hãm, nghĩa là các đặc tính này khó biểu hiện trọn vẹn, không phải là điềm xấu. Nên chọn môi trường ít ma sát để phát huy.',
    )
  }
  const ky = placements.find((p) => p.transform === 'hoa_ky')
  if (ky) {
    const s = STAR_BY_ID[ky.star]
    out.push(`${s.name} mang Hoá Kỵ, mảng liên quan thường cần kiểm soát kỹ hơn và ra quyết định chậm lại.`)
  }
  if (confidence === 'low') {
    out.push('Phân bố giữa các nhóm khá đều nên tín hiệu chưa rõ. Hãy coi trọng bằng chứng từ CV và kỹ năng hơn lớp này.')
  }
  if (traits.structure < 0.35 && traits.risk_tolerance > 0.6) {
    out.push('Thiên hướng chấp nhận rủi ro cao trong khi tính kỷ luật thấp. Nên có người hoặc quy trình giữ nhịp.')
  }
  if (out.length === 0) {
    out.push('Không có điểm nào đặc biệt cần lưu ý trong lớp này.')
  }
  return out
}
