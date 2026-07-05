"use client";

import { useRef, type PointerEvent } from "react";
import { useRafLoop } from "@/lib/useRafLoop";

const BW = 80; // offscreen buffer size — upscaled pixelated
const BH = 54;

/**
 * TV static that feeds on pointer velocity: move fast and the signal degrades
 * into amber-tinted noise with tear lines. ~30fps (frame-skipped), one rAF.
 */
export default function SignalStatic() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const energy = useRef(0.15);
  const last = useRef<{ x: number; y: number } | null>(null);
  const skip = useRef(false);

  const onMove = (e: PointerEvent<HTMLCanvasElement>) => {
    const prev = last.current;
    last.current = { x: e.clientX, y: e.clientY };
    if (!prev) return;
    const v = Math.hypot(e.clientX - prev.x, e.clientY - prev.y);
    energy.current = Math.min(1, energy.current + v * 0.006);
  };

  useRafLoop(canvasRef, () => {
    skip.current = !skip.current;
    if (skip.current) return; // ~30fps is plenty for noise

    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    if (canvas.width !== BW) {
      canvas.width = BW;
      canvas.height = BH;
      ctx.imageSmoothingEnabled = false;
    }

    energy.current = Math.max(0.12, energy.current * 0.96);
    const e = energy.current;

    const img = ctx.createImageData(BW, BH);
    const d = img.data;
    for (let i = 0; i < d.length; i += 4) {
      const n = Math.random();
      const on = n < e;
      const v = on ? 40 + Math.random() * 190 : 8;
      // amber-tint the hot pixels as energy rises
      d[i] = v * (1 + e * 0.55);
      d[i + 1] = v * (1 + e * 0.18);
      d[i + 2] = v * (1 - e * 0.5);
      d[i + 3] = 255;
    }
    // occasional horizontal tear
    if (Math.random() < e * 0.5) {
      const row = Math.floor(Math.random() * BH) * BW * 4;
      for (let x = 0; x < BW * 4; x += 4) {
        d[row + x] = 245;
        d[row + x + 1] = 178;
        d[row + x + 2] = 26;
      }
    }
    ctx.putImageData(img, 0, 0);
  });

  return (
    <canvas
      ref={canvasRef}
      className="h-full w-full [image-rendering:pixelated]"
      onPointerMove={onMove}
      onPointerLeave={() => (last.current = null)}
      aria-label="Signal static demo — pointer speed drives the noise"
    />
  );
}
