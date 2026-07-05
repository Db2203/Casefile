"use client";

import { useRef, type PointerEvent } from "react";
import { useRafLoop } from "@/lib/useRafLoop";

const WORD = "KINETIC";
const RADIUS = 110; // px of influence
const BASE_W = 340; // font weight range (Space Grotesk variable: 300–700)
const MAX_W = 700;

/**
 * Glyphs gain weight and rise toward the pointer. One rAF (IO/visibility
 * gated), zero React state per frame — targets lerp in the tick.
 */
export default function KineticType() {
  const wrap = useRef<HTMLDivElement>(null);
  const spans = useRef<(HTMLSpanElement | null)[]>([]);
  const pointer = useRef<{ x: number; y: number } | null>(null);
  const rect = useRef<DOMRect | null>(null);
  const weights = useRef<number[]>(Array(WORD.length).fill(BASE_W));
  const clock = useRef(0);

  const onEnter = (e: PointerEvent<HTMLDivElement>) => {
    rect.current = e.currentTarget.getBoundingClientRect();
  };
  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    const r = rect.current;
    if (!r) return;
    pointer.current = { x: e.clientX - r.left, y: e.clientY - r.top };
  };
  const onLeave = () => {
    pointer.current = null;
    rect.current = null;
  };

  useRafLoop(wrap, (dt) => {
    const r = rect.current;
    const p = pointer.current;
    clock.current += dt;
    // frame-rate-independent lerp (0.18 per frame at 60Hz)
    const ease = 1 - Math.pow(1 - 0.18, dt * 60);
    for (let i = 0; i < WORD.length; i++) {
      const el = spans.current[i];
      if (!el) continue;
      let target = BASE_W;
      if (p && r) {
        // glyph centers are evenly spaced across the wrap width
        const cx = ((i + 0.5) / WORD.length) * r.width;
        const cy = r.height / 2;
        const d = Math.hypot(p.x - cx, p.y - cy);
        const t = Math.max(0, 1 - d / RADIUS);
        target = BASE_W + (MAX_W - BASE_W) * t;
      } else {
        // autonomous: a weight wave travels through the glyphs (touch/idle)
        const wave = Math.max(0, Math.sin(clock.current * 1.8 - i * 0.85));
        target = BASE_W + (MAX_W - BASE_W) * wave * 0.7;
      }
      const w = (weights.current[i] += (target - weights.current[i]) * ease);
      const lift = ((w - BASE_W) / (MAX_W - BASE_W)) * -9;
      el.style.fontVariationSettings = `"wght" ${Math.round(w)}`;
      el.style.transform = `translateY(${lift.toFixed(1)}px)`;
    }
  });

  return (
    <div
      ref={wrap}
      className="flex h-full w-full items-center justify-center select-none"
      onPointerEnter={onEnter}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      role="img"
      aria-label="Kinetic typography demo — move your pointer over the word"
    >
      <span aria-hidden className="flex text-3xl tracking-[0.15em] text-bone">
        {WORD.split("").map((ch, i) => (
          <span
            key={i}
            ref={(el) => {
              spans.current[i] = el;
            }}
            className="inline-block will-change-transform"
          >
            {ch}
          </span>
        ))}
      </span>
    </div>
  );
}
