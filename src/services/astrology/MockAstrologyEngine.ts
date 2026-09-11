import type {
  AstrologyProfile,
  BirthProfile,
  Career,
  CompatibilityResult,
  DestinyCycle,
  StarGroup,
  TraitKey,
  TraitScores,
} from '@/types'
import { STAR_GROUPS } from '@/data/starGroups'
import { canChiOfYear } from '@/utils/canChi'
import { createRng, hashString, rngPick, signatureOf } from '@/utils/hash'
import { bandOf, clamp, round } from '@/utils/score'
import { TRAIT_LABEL, TRAIT_ORDER } from '@/utils/format'
import type { AstrologyEngine } from './types'

/* ------------------------------------------------------------------ */
/* Descriptor vocabulary                                               */
/* ------------------------------------------------------------------ */

/**
 * Phrasing is deliberately about *tendency*, never destiny. Nothing here
 * asserts that a person will or must be anything.
 */
const PERSONALITY_BY_TRAIT: Record<TraitKey, string[]> = {
  analytical: ['Tư duy phân tích', 'Thích chi tiết và dữ kiện', 'Suy nghĩ có hệ thống'],
  creative: ['Sáng tạo', 'Thích thử cách làm mới', 'Giàu ý tưởng'],
  leadership: ['Chủ động dẫn dắt', 'Định hướng kết quả', 'Sẵn sàng nhận trách nhiệm'],
  communication: ['Giao tiếp cởi mở', 'Thuyết phục tự nhiên', 'Kết nối tốt với người khác'],
  independence: ['Độc lập', 'Tự chủ trong công việc', 'Thoải mái khi tự ra quyết định'],
  teamwork: ['Hợp tác tốt', 'Coi trọng tinh thần nhóm', 'Dễ hoà nhập'],
  riskTaking: ['Sẵn sàng thử nghiệm', 'Thoải mái với thay đổi', 'Ưa môi trường năng động'],
  stability: ['Kiên trì', 'Coi trọng sự ổn định', 'Làm việc đều đặn và bền bỉ'],
}

const WORKING_STYLE_BY_TRAIT: Record<TraitKey, string[]> = {
  analytical: ['Ưa giải quyết vấn đề', 'Có xu hướng nghiên cứu sâu', 'Ra quyết định dựa trên dữ liệu'],
  creative: ['Thích không gian thử nghiệm', 'Làm việc tốt với bài toán mở', 'Hay đề xuất hướng tiếp cận khác'],
  leadership: ['Thích vai trò điều phối', 'Chủ động đặt mục tiêu cho nhóm', 'Quen với việc ra quyết định'],
  communication: ['Làm việc tốt với nhiều bên liên quan', 'Thoải mái khi trình bày', 'Giải thích vấn đề dễ hiểu'],
  independence: ['Thích môi trường có quyền tự chủ', 'Hiệu quả khi làm việc sâu một mình', 'Tự quản lý tiến độ tốt'],
  teamwork: ['Phát huy tốt trong nhóm gắn kết', 'Sẵn sàng hỗ trợ đồng đội', 'Ưu tiên kết quả chung'],
  riskTaking: ['Thích môi trường thay đổi nhanh', 'Chấp nhận thử, sai, rồi sửa', 'Phù hợp giai đoạn xây mới'],
  stability: ['Làm tốt với quy trình rõ ràng', 'Duy trì chất lượng ổn định', 'Phù hợp công việc dài hạn'],
}

const STRENGTH_BY_TRAIT: Record<TraitKey, string[]> = {
  analytical: ['Tư duy logic', 'Khả năng phân tích vấn đề', 'Xử lý thông tin phức tạp'],
  creative: ['Khả năng sáng tạo giải pháp', 'Tư duy linh hoạt', 'Nhìn vấn đề từ góc mới'],
  leadership: ['Khả năng lãnh đạo', 'Định hướng và tổ chức công việc', 'Truyền động lực cho nhóm'],
  communication: ['Khả năng trình bày', 'Xây dựng quan hệ', 'Thương lượng và thuyết phục'],
  independence: ['Khả năng tự học nhanh', 'Tự chủ và chủ động', 'Tập trung sâu'],
  teamwork: ['Phối hợp nhóm hiệu quả', 'Lắng nghe và tiếp thu', 'Xây dựng niềm tin'],
  riskTaking: ['Ra quyết định trong điều kiện chưa đủ dữ kiện', 'Thích ứng nhanh', 'Dám thử hướng mới'],
  stability: ['Kỷ luật và bền bỉ', 'Đảm bảo chất lượng ổn định', 'Đáng tin cậy trong dài hạn'],
}

/** Growth areas are phrased as opportunities, not deficiencies. */
const GROWTH_BY_TRAIT: Record<TraitKey, string> = {
  analytical: 'Có thể luyện thêm việc ra quyết định nhanh khi dữ liệu chưa đầy đủ',
  creative: 'Có thể bổ sung thói quen chuẩn hoá và tài liệu hoá quy trình',
  leadership: 'Có thể phát triển thêm kỹ năng dẫn dắt và giao việc',
  communication: 'Có thể luyện thêm kỹ năng trình bày trước nhóm lớn',
  independence: 'Có thể chủ động chia sẻ tiến độ với đồng đội thường xuyên hơn',
  teamwork: 'Có thể tăng thời gian làm việc phối hợp liên bộ phận',
  riskTaking: 'Có thể thử nghiệm nhiều hơn với các bài toán chưa có tiền lệ',
  stability: 'Có thể xây dựng thêm nhịp làm việc ổn định và kế hoạch dài hạn',
}

const ENVIRONMENTS: Array<{ trait: TraitKey; high: string; low: string }> = [
  {
    trait: 'independence',
    high: 'Môi trường trao quyền tự chủ, ít vi mô quản lý',
    low: 'Môi trường có hướng dẫn rõ ràng và phản hồi thường xuyên',
  },
  {
    trait: 'riskTaking',
    high: 'Tổ chức đang tăng trưởng nhanh hoặc xây sản phẩm mới',
    low: 'Tổ chức có quy trình ổn định và mục tiêu rõ ràng',
  },
  {
    trait: 'teamwork',
    high: 'Đội nhóm gắn kết, cộng tác chặt chẽ',
    low: 'Vai trò có phạm vi trách nhiệm cá nhân rõ ràng',
  },
  {
    trait: 'analytical',
    high: 'Công việc dựa nhiều trên dữ liệu và phân tích',
    low: 'Công việc thiên về tương tác và triển khai thực tế',
  },
  {
    trait: 'leadership',
    high: 'Có lộ trình phát triển lên vai trò dẫn dắt',
    low: 'Vai trò chuyên môn sâu với hướng phát triển chuyên gia',
  },
]

/* ------------------------------------------------------------------ */
/* Destiny derivation                                                  */
/* ------------------------------------------------------------------ */

/** Length of a đại vận window, in years. */
const MAJOR_CYCLE_YEARS = 10

/**
 * Picks the star archetype from the birth seed. A real engine would derive this
 * from the actual chart; the contract it has to honour is only that the same
 * birth inputs always yield the same group.
 */
function deriveStarGroup(key: string): StarGroup {
  const index = hashString(`${key}::star-group`) % STAR_GROUPS.length
  return STAR_GROUPS[index] as StarGroup
}

/**
 * Đại vận: ten-year windows starting at an age between 2 and 9, and the lưu
 * niên for the year in view. `now` is injected so results stay testable and do
 * not silently change with the clock inside a render.
 */
function deriveCycles(
  key: string,
  birthDate: string,
  now: Date,
): { major: DestinyCycle; year: DestinyCycle } {
  const birthYear = Number(birthDate.slice(0, 4)) || now.getFullYear() - 30
  const currentYear = now.getFullYear()
  const age = Math.max(0, currentYear - birthYear)

  const startAge = 2 + (hashString(`${key}::cycle-start`) % 8)
  const elapsed = Math.max(0, age - startAge)
  const cycleIndex = Math.floor(elapsed / MAJOR_CYCLE_YEARS)
  const fromYear = birthYear + startAge + cycleIndex * MAJOR_CYCLE_YEARS
  const toYear = fromYear + MAJOR_CYCLE_YEARS - 1

  const rng = createRng(hashString(`${key}::cycle-copy`))
  const majorTheme = rngPick(rng, MAJOR_CYCLE_THEMES, 1)[0] as (typeof MAJOR_CYCLE_THEMES)[number]
  const yearTheme = rngPick(rng, YEAR_THEMES, 1)[0] as (typeof YEAR_THEMES)[number]

  return {
    major: {
      id: `dai_van_${fromYear}_${toYear}`,
      kind: 'dai_van',
      name: `Đại Vận ${fromYear}-${toYear}`,
      fromYear,
      toYear,
      canChi: '',
      description: majorTheme.description,
      advice: majorTheme.advice,
      actions: [...majorTheme.actions],
    },
    year: {
      id: `luu_nien_${currentYear}`,
      kind: 'luu_nien',
      name: `Lưu Niên ${currentYear}`,
      fromYear: currentYear,
      toYear: currentYear,
      canChi: canChiOfYear(currentYear),
      description: yearTheme.description,
      advice: yearTheme.advice,
      actions: [...yearTheme.actions],
    },
  }
}

const MAJOR_CYCLE_THEMES = [
  {
    description: 'Giai đoạn mở rộng phạm vi trách nhiệm và tầm ảnh hưởng trong công việc.',
    advice: 'Đây là quãng phù hợp để nâng chuyên môn lên mức dẫn dắt được người khác.',
    actions: ['Nhận thêm phạm vi công việc có tính dẫn dắt', 'Xây dựng hồ sơ năng lực có thể kiểm chứng'],
  },
  {
    description: 'Giai đoạn thiên về tích luỹ chiều sâu chuyên môn hơn là mở rộng chiều rộng.',
    advice: 'Cân nhắc đi sâu vào một mảng hẹp, để trở thành người được tìm đến trong mảng đó.',
    actions: ['Chọn một mảng chuyên môn hẹp để đi sâu', 'Tìm cơ hội làm việc với người giỏi hơn mình'],
  },
  {
    description: 'Giai đoạn nhiều thay đổi về môi trường và cách làm việc.',
    advice: 'Giữ sự linh hoạt. Chuẩn bị sẵn phương án cho lúc cơ hội mới xuất hiện.',
    actions: ['Cập nhật hồ sơ và mạng lưới quan hệ đều đặn', 'Thử nghiệm một hướng đi mới ở quy mô nhỏ'],
  },
  {
    description: 'Giai đoạn phù hợp để củng cố nền tảng và xây dựng sự ổn định dài hạn.',
    advice: 'Ưu tiên lựa chọn bền vững, thay vì thay đổi liên tục.',
    actions: ['Củng cố kỹ năng nền tảng còn thiếu', 'Xây dựng thói quen làm việc dài hạn'],
  },
] as const

const YEAR_THEMES = [
  {
    description: 'Năm thiên về học hỏi và mở rộng kiến thức, kỹ năng mới.',
    advice: 'Tận dụng để học thêm, dự hội thảo và mở rộng quan hệ nghề nghiệp.',
    actions: ['Hoàn thành một khoá học có chứng chỉ', 'Tham gia ít nhất một cộng đồng nghề nghiệp'],
  },
  {
    description: 'Năm thiên về củng cố những gì đã có hơn là bắt đầu điều hoàn toàn mới.',
    advice: 'Tập trung hoàn thiện việc đang dở, trước khi mở thêm hướng mới.',
    actions: ['Hoàn thành các việc còn tồn đọng', 'Rà soát lại mục tiêu nghề nghiệp 12 tháng'],
  },
  {
    description: 'Năm có xu hướng xuất hiện nhiều lựa chọn và lời mời khác nhau.',
    advice: 'Cân nhắc kỹ trước khi nhận thêm việc. Ưu tiên thứ hợp với hướng dài hạn.',
    actions: ['Lập tiêu chí đánh giá cơ hội trước khi quyết định', 'Trao đổi với người đi trước trong ngành'],
  },
  {
    description: 'Năm phù hợp để thể hiện năng lực ra bên ngoài nhiều hơn.',
    advice: 'Chủ động trình bày kết quả công việc, để xây uy tín chuyên môn.',
    actions: ['Trình bày kết quả công việc trước nhóm lớn hơn', 'Viết lại hồ sơ năng lực theo kết quả đo được'],
  },
] as const

/* ------------------------------------------------------------------ */
/* Engine                                                              */
/* ------------------------------------------------------------------ */

/**
 * Deterministic placeholder for the real Tử Vi / Bát Tự engine.
 *
 * How it works:
 *   1. birthDate + birthTime + gender + birthPlace  →  FNV-1a hash  →  seed
 *   2. seed  →  Mulberry32 PRNG  →  eight trait scores in 0-100
 *   3. trait scores  →  descriptor selection (also seeded)
 *
 * There is no `Math.random()` anywhere: the same person always gets the same
 * profile. Replacing this class with a real implementation is a one-line change
 * in `services/astrology/index.ts`.
 */
export class MockAstrologyEngine implements AstrologyEngine {
  readonly name = 'MockAstrologyEngine'
  readonly version = '0.1.0'

  private cache = new Map<string, AstrologyProfile>()

  /** Injectable so tests can pin the year the cycles are computed against. */
  constructor(private readonly now: () => Date = () => new Date()) {}

  private seedFor(profile: BirthProfile): string {
    // Normalised so trivial formatting differences don't change the result.
    return [
      profile.birthDate.trim(),
      profile.birthTime.trim() || '12:00',
      profile.gender,
      profile.birthPlace.trim().toLowerCase(),
    ].join('|')
  }

  analyze(profile: BirthProfile): AstrologyProfile {
    const key = this.seedFor(profile)
    const cached = this.cache.get(key)
    if (cached) return cached

    const rng = createRng(hashString(key))

    // Each trait gets its own sub-seed so that changing one input field shifts
    // the whole shape rather than nudging a single number.
    const traits = {} as TraitScores
    TRAIT_ORDER.forEach((trait, index) => {
      const traitRng = createRng(hashString(`${key}::${trait}::${index}`))
      // Bias towards the 55-95 range: a demo profile should read as a real
      // person's strengths chart, not as a flat random cloud.
      const base = 52 + traitRng() * 43
      const jitter = (traitRng() - 0.5) * 10
      traits[trait] = round(clamp(base + jitter, 38, 97))
    })

    const starGroup = deriveStarGroup(key)

    // Let the archetype tilt the trait shape, so the numbers and the narrative
    // describe the same person rather than two unrelated readings.
    for (const [trait, delta] of Object.entries(starGroup.traitBias)) {
      const dimension = trait as TraitKey
      traits[dimension] = round(clamp(traits[dimension] + (delta ?? 0), 38, 97))
    }

    const ranked = [...TRAIT_ORDER].sort((a, b) => traits[b] - traits[a])
    const top = ranked.slice(0, 3)
    const bottom = ranked.slice(-2)

    const personality = top.flatMap((trait) =>
      rngPick(rng, PERSONALITY_BY_TRAIT[trait], 1),
    )
    const workingStyle = top.flatMap((trait) =>
      rngPick(rng, WORKING_STYLE_BY_TRAIT[trait], 1),
    )
    const strengths = top.flatMap((trait) => rngPick(rng, STRENGTH_BY_TRAIT[trait], 1))
    const growthAreas = bottom.map((trait) => GROWTH_BY_TRAIT[trait])

    const preferredEnvironments = ENVIRONMENTS.map((entry) =>
      traits[entry.trait] >= 70 ? entry.high : entry.low,
    ).slice(0, 4)

    const result: AstrologyProfile = {
      signature: signatureOf(key),
      personality,
      workingStyle,
      strengths,
      growthAreas,
      traits,
      preferredEnvironments,
      narrative: buildNarrative(top, traits),
      starGroup,
      cycles: deriveCycles(key, profile.birthDate, this.now()),
      engine: this.name,
      engineVersion: this.version,
    }

    this.cache.set(key, result)
    return result
  }

  /**
   * Distance between the person's trait shape and the career's ideal shape,
   * weighted so that the career's *defining* traits count more.
   */
  calculateCareerFit(profile: AstrologyProfile, career: Career): number {
    let weightedGap = 0
    let totalWeight = 0

    for (const trait of TRAIT_ORDER) {
      const target = career.traitProfile[trait]
      const actual = profile.traits[trait]
      // Traits the career cares about most (target far from neutral 50) weigh more.
      const weight = 0.5 + Math.abs(target - 50) / 50
      // Exceeding the target is not penalised as hard as falling short of it.
      const gap = actual >= target ? (actual - target) * 0.35 : target - actual
      weightedGap += gap * weight
      totalWeight += weight
    }

    const averageGap = weightedGap / totalWeight
    return round(clamp(100 - averageGap * 1.25))
  }

  /**
   * Working-style compatibility. Not "these two people will get along":
   * it is a complementarity score over eight observable working dimensions.
   *
   * Some traits reward similarity (shared pace, shared appetite for risk);
   * others reward complementarity (one leads, one executes deeply).
   */
  calculateCompatibility(personA: AstrologyProfile, personB: AstrologyProfile): number {
    const similarityTraits: TraitKey[] = ['riskTaking', 'stability', 'communication', 'teamwork']
    const complementTraits: TraitKey[] = ['leadership', 'independence', 'analytical', 'creative']

    let similarityScore = 0
    for (const trait of similarityTraits) {
      const gap = Math.abs(personA.traits[trait] - personB.traits[trait])
      similarityScore += 100 - gap
    }
    similarityScore /= similarityTraits.length

    let complementScore = 0
    for (const trait of complementTraits) {
      const gap = Math.abs(personA.traits[trait] - personB.traits[trait])
      // Ideal complementary gap sits around 20 points: different enough to add
      // something, close enough to still understand each other.
      complementScore += 100 - Math.abs(gap - 20) * 1.15
    }
    complementScore /= complementTraits.length

    // A stable signature-derived nudge keeps results varied between pairs
    // without ever being random.
    const pairRng = createRng(hashString(`${personA.signature}~${personB.signature}`))
    const nudge = (pairRng() - 0.5) * 8

    return round(clamp(similarityScore * 0.45 + complementScore * 0.55 + nudge))
  }

  describeCompatibility(
    personA: AstrologyProfile,
    personB: AstrologyProfile,
  ): CompatibilityResult {
    const score = this.calculateCompatibility(personA, personB)
    const rng = createRng(hashString(`${personA.signature}=${personB.signature}`))

    const gaps = TRAIT_ORDER.map((trait) => ({
      trait,
      gap: Math.abs(personA.traits[trait] - personB.traits[trait]),
      avg: (personA.traits[trait] + personB.traits[trait]) / 2,
    }))

    const aligned = [...gaps].sort((a, b) => a.gap - b.gap).slice(0, 3)
    const divergent = [...gaps].sort((a, b) => b.gap - a.gap).slice(0, 2)

    const highlights = aligned.map(
      (item) =>
        `Tương đồng về ${TRAIT_LABEL[item.trait].toLowerCase()} (chênh lệch ${round(item.gap)} điểm)`,
    )
    const complementary = divergent.map(
      (item) =>
        `Khác biệt về ${TRAIT_LABEL[item.trait].toLowerCase()}. Có thể bổ trợ cho nhau nếu phân vai rõ ràng`,
    )

    const openings = [
      'Hai hồ sơ có mức độ bổ trợ đáng chú ý về',
      'Hai hồ sơ cho thấy điểm chung ở',
      'Phong cách làm việc của hai người có xu hướng gặp nhau ở',
    ]
    const opening = rngPick(rng, openings, 1)[0] as string
    const alignedNames = aligned.map((a) => TRAIT_LABEL[a.trait].toLowerCase()).join(', ')

    const summary =
      score >= 70
        ? `${opening} ${alignedNames}. Đây là chỉ số tham khảo về phong cách làm việc, không phải kết luận về con người.`
        : `${opening} ${alignedNames}, đồng thời có một số khác biệt về cách tiếp cận công việc. Sự khác biệt này có thể là lợi thế nếu vai trò được phân định rõ.`

    return {
      score,
      band: bandOf(score),
      summary,
      highlights,
      considerations: complementary,
    }
  }
}

function buildNarrative(top: TraitKey[], traits: TraitScores): string {
  const names = top.map((t) => TRAIT_LABEL[t].toLowerCase())
  const leadTrait = top[0] as TraitKey
  const leadScore = traits[leadTrait]
  return (
    `Hồ sơ này nổi bật ở ${names[0]} (${leadScore}/100), bên cạnh ${names[1]} và ${names[2]}. ` +
    'Đây là mô tả xu hướng, dựa trên thông tin bạn cung cấp. Bạn hãy tự đối chiếu với trải nghiệm ' +
    'thật của mình.'
  )
}
