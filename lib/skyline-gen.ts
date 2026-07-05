/**
 * Procedural art-deco skyline data — shared by the static Skyline layers,
 * the Night-City playground demo, and evidence placeholder art.
 * Pure data (no JSX); pair with <SkylineLayer> from atmosphere/Skyline.
 */
import { range } from "./random";

/** [x, width, height] on a 1200×200-style viewBox (height grows up). */
export type Building = [x: number, w: number, h: number];

export function generateBuildings(
  rng: () => number,
  opts: {
    width?: number;
    count?: number;
    minW?: number;
    maxW?: number;
    minH?: number;
    maxH?: number;
  } = {},
): Building[] {
  const {
    width = 1200,
    count = 13,
    minW = 40,
    maxW = 110,
    minH = 45,
    maxH = 140,
  } = opts;

  const buildings: Building[] = [];
  let x = range(rng, 0, 20);
  for (let i = 0; i < count && x < width; i++) {
    const w = range(rng, minW, maxW);
    const h = range(rng, minH, maxH);
    buildings.push([Math.round(x), Math.round(w), Math.round(h)]);
    x += w + range(rng, 4, 34);
  }
  return buildings;
}
