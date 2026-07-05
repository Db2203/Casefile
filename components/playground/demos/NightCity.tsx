"use client";

import { useState } from "react";
import { mulberry32 } from "@/lib/random";
import { generateBuildings } from "@/lib/skyline-gen";
import { SkylineLayer } from "@/components/atmosphere/Skyline";

/**
 * Procedural skyline — click (or Enter) to rebuild the city from a new seed.
 * Pure SVG, zero rAF; initial seed is fixed so SSR/client markup match.
 */
export default function NightCity() {
  const [seed, setSeed] = useState(1337);

  const rng = mulberry32(seed);
  const far = generateBuildings(rng, { count: 12, minH: 70, maxH: 150 });
  const near = generateBuildings(rng, { count: 9, minH: 40, maxH: 95, minW: 60, maxW: 130 });

  return (
    <button
      type="button"
      onClick={() => setSeed((s) => (s * 16807 + 17) % 2147483647)}
      className="relative block h-full w-full cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-signal"
      aria-label="Procedural skyline generator — activate to rebuild the city"
    >
      <svg
        viewBox="0 0 1200 200"
        preserveAspectRatio="none"
        className="h-full w-full"
        aria-hidden
      >
        <g fill="#0d0d13">
          <SkylineLayer data={far} />
        </g>
        <g fill="#15161f">
          <SkylineLayer data={near} lit />
        </g>
      </svg>
      <span className="pointer-events-none absolute bottom-2 left-1/2 -translate-x-1/2 whitespace-nowrap border border-slate/60 bg-void/70 px-2 py-1 font-mono text-[8px] tracking-[0.25em] text-ash backdrop-blur-[2px]">
        SEED 0x{seed.toString(16).toUpperCase().slice(0, 6)} · CLICK TO REBUILD
      </span>
    </button>
  );
}
