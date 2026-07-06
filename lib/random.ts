/**
 * Seeded, deterministic RNG — same seed produces the same sequence on server
 * and client, so procedural SVG art can be server-rendered with zero
 * hydration mismatch. Used by evidence placeholder art and skyline generation.
 */

/** Hash a string into a 32-bit seed. */
export function xmur3(str: string): () => number {
  let h = 1779033703 ^ str.length;
  for (let i = 0; i < str.length; i++) {
    h = Math.imul(h ^ str.charCodeAt(i), 3432918353);
    h = (h << 13) | (h >>> 19);
  }
  return () => {
    h = Math.imul(h ^ (h >>> 16), 2246822507);
    h = Math.imul(h ^ (h >>> 13), 3266489909);
    return (h ^= h >>> 16) >>> 0;
  };
}

/** Fast 32-bit PRNG. Returns () => float in [0, 1). */
export function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Convenience: seed a PRNG directly from a string. */
export function rngFrom(key: string): () => number {
  return mulberry32(xmur3(key)());
}

export const range = (rng: () => number, min: number, max: number) =>
  min + rng() * (max - min);

export const int = (rng: () => number, min: number, max: number) =>
  Math.floor(range(rng, min, max + 1));

export const pick = <T,>(rng: () => number, arr: readonly T[]): T =>
  arr[Math.floor(rng() * arr.length)];
