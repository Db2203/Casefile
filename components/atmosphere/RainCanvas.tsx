"use client";

import { useEffect, useRef } from "react";

/**
 * Noir rain: ONE fixed <canvas>, one cancellable rAF, DPR clamped to 2,
 * particle count scaled to viewport, paused when the tab is hidden.
 * Mounted only when `canEnhance` (SiteShell gates it).
 */
export default function RainCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    let running = true;
    let drops: { x: number; y: number; len: number; speed: number; o: number }[] =
      [];

    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const resize = () => {
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      // ~1 drop per 9000 px², capped — sparse rain reads better than a storm
      const count = Math.min(
        160,
        Math.floor((window.innerWidth * window.innerHeight) / 9000),
      );
      drops = Array.from({ length: count }, () => spawn(true));
    };

    const spawn = (anywhere = false) => ({
      x: Math.random() * window.innerWidth,
      y: anywhere ? Math.random() * window.innerHeight : -30,
      len: 9 + Math.random() * 16,
      speed: 7 + Math.random() * 9,
      o: 0.06 + Math.random() * 0.16,
    });

    const tick = () => {
      if (!running) return;
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      ctx.lineWidth = 1;
      ctx.lineCap = "round";
      for (let i = 0; i < drops.length; i++) {
        const d = drops[i];
        ctx.strokeStyle = `rgba(180, 195, 215, ${d.o})`;
        ctx.beginPath();
        ctx.moveTo(d.x, d.y);
        ctx.lineTo(d.x - 1.5, d.y + d.len); // slight wind slant
        ctx.stroke();
        d.y += d.speed;
        d.x -= 0.35;
        if (d.y > window.innerHeight + 30) drops[i] = spawn();
      }
      raf = requestAnimationFrame(tick);
    };

    const onVisibility = () => {
      running = !document.hidden;
      if (running) {
        cancelAnimationFrame(raf);
        raf = requestAnimationFrame(tick);
      } else {
        cancelAnimationFrame(raf);
      }
    };

    resize();
    raf = requestAnimationFrame(tick);
    window.addEventListener("resize", resize);
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="pointer-events-none fixed inset-0 z-40"
      style={{ willChange: "transform" }}
    />
  );
}
