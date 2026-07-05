"use client";

import { useEffect, useRef, type PointerEvent } from "react";
import { useRafLoop } from "@/lib/useRafLoop";

const COUNT = 80;

type P = { x: number; y: number; vx: number; vy: number };

/**
 * Amber particle field with pointer gravity; drifts on its own when idle.
 * One canvas, one rAF (IO/visibility gated), full-rect fade for trails.
 */
export default function FluidCursor() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pointer = useRef<{ x: number; y: number } | null>(null);
  const parts = useRef<P[]>([]);
  const t = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    canvas.getContext("2d")?.setTransform(dpr, 0, 0, dpr, 0, 0);
    parts.current = Array.from({ length: COUNT }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: 0,
      vy: 0,
    }));
  }, []);

  const onMove = (e: PointerEvent<HTMLCanvasElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    pointer.current = { x: e.clientX - r.left, y: e.clientY - r.top };
  };
  const onLeave = () => {
    pointer.current = null;
  };

  useRafLoop(canvasRef, (dt) => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    t.current += dt;

    // fade previous frame (trails)
    ctx.fillStyle = "rgba(5,5,7,0.2)";
    ctx.fillRect(0, 0, w, h);

    const p = pointer.current;
    // idle attractor wanders on a lissajous path
    const ax = p ? p.x : w / 2 + Math.sin(t.current * 0.7) * w * 0.3;
    const ay = p ? p.y : h / 2 + Math.cos(t.current * 1.1) * h * 0.28;
    const G = p ? 900 : 320;

    for (const pt of parts.current) {
      const dx = ax - pt.x;
      const dy = ay - pt.y;
      const d2 = Math.max(180, dx * dx + dy * dy);
      const f = (G / d2) * 60 * dt;
      pt.vx = (pt.vx + dx * f) * 0.94;
      pt.vy = (pt.vy + dy * f) * 0.94;
      pt.x += pt.vx * 60 * dt;
      pt.y += pt.vy * 60 * dt;
      // soft wrap
      if (pt.x < -5) pt.x = w + 5;
      if (pt.x > w + 5) pt.x = -5;
      if (pt.y < -5) pt.y = h + 5;
      if (pt.y > h + 5) pt.y = -5;

      const speed = Math.min(1, Math.hypot(pt.vx, pt.vy) / 4);
      ctx.fillStyle = `rgba(245,178,26,${0.25 + speed * 0.6})`;
      ctx.fillRect(pt.x, pt.y, 1.6, 1.6);
    }
  });

  return (
    <canvas
      ref={canvasRef}
      className="h-full w-full"
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      aria-label="Particle field demo — move your pointer to attract the swarm"
    />
  );
}
