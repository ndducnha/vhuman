/**
 * Deterministic hashing + pseudo-random generation.
 *
 * The reflection layer must be reproducible: the same birth inputs must always
 * produce the same profile, on every device, forever. `Math.random()` cannot be
 * used anywhere in the engines: these helpers replace it.
 */

/** FNV-1a 32-bit. Fast, dependency-free, good enough for seeding. */
export function hashString(input: string): number {
  let hash = 0x811c9dc5
  for (let i = 0; i < input.length; i += 1) {
    hash ^= input.charCodeAt(i)
    hash = Math.imul(hash, 0x01000193)
  }
  return hash >>> 0
}

/** Hex signature: used as a stable, human-inspectable profile id. */
export function signatureOf(input: string): string {
  const a = hashString(input)
  const b = hashString(`${input}::salt`)
  return (a.toString(16).padStart(8, '0') + b.toString(16).padStart(8, '0')).slice(0, 12)
}

/**
 * Mulberry32: a small, well-distributed seeded PRNG.
 * Returns a function producing floats in [0, 1).
 */
export function createRng(seed: number): () => number {
  let state = seed >>> 0
  return () => {
    state = (state + 0x6d2b79f5) >>> 0
    let t = state
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

/** Seeded integer in [min, max]. */
export function rngInt(rng: () => number, min: number, max: number): number {
  return Math.floor(rng() * (max - min + 1)) + min
}

/** Deterministically pick `count` distinct items from `items`. */
export function rngPick<T>(rng: () => number, items: readonly T[], count: number): T[] {
  const pool = [...items]
  const out: T[] = []
  const n = Math.min(count, pool.length)
  for (let i = 0; i < n; i += 1) {
    const idx = Math.floor(rng() * pool.length)
    out.push(pool.splice(idx, 1)[0] as T)
  }
  return out
}
