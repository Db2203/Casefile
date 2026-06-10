"use client";

import { useState } from "react";
import {
  motion,
  useMotionValueEvent,
  useScroll,
  useSpring,
} from "motion/react";

const ZONES = ["ROOFTOP", "STREET", "THE CAVE"];

/**
 * Slim scroll wayfinder on the left edge: an amber fill tracks your descent
 * through the city, with the current "elevation" lit. Desktop only.
 */
export default function DescentMeter() {
  const { scrollYProgress } = useScroll();
  const fill = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });
  const [zone, setZone] = useState(0);

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    const z = v < 0.3 ? 0 : v < 0.78 ? 1 : 2;
    setZone((prev) => (prev === z ? prev : z));
  });

  return (
    <div
      aria-hidden
      className="fixed left-5 top-1/2 z-[55] hidden -translate-y-1/2 flex-col items-center gap-4 lg:flex"
    >
      {ZONES.map((label, i) => (
        <div key={label} className="flex flex-col items-center gap-4">
          {i > 0 && (
            <div className="relative h-24 w-px overflow-hidden bg-slate/60">
              {/* fill segment: lit once progress passes this leg */}
              <motion.div
                className="absolute inset-x-0 top-0 origin-top bg-signal"
                style={{
                  height: "100%",
                  scaleY: fill,
                }}
              />
            </div>
          )}
          <span
            className={`font-mono text-[9px] tracking-[0.3em] transition-colors duration-500 ${
              zone === i ? "text-signal" : "text-ash/40"
            }`}
            style={{ writingMode: "vertical-rl" }}
          >
            {label}
          </span>
        </div>
      ))}
    </div>
  );
}
