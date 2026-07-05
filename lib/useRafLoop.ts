"use client";

import { useEffect, type RefObject } from "react";

/**
 * The playground-demo discipline, enforced structurally: one cancellable rAF
 * that only runs while (a) `active`, (b) the element intersects the viewport,
 * and (c) the tab is visible. `tick` receives dt in seconds (clamped).
 */
export function useRafLoop(
  ref: RefObject<Element | null>,
  tick: (dt: number) => void,
  active = true,
) {
  useEffect(() => {
    const el = ref.current;
    if (!el || !active) return;

    let raf = 0;
    let running = false;
    let inView = false;
    let last = 0;

    const loop = (t: number) => {
      if (!running) return;
      const dt = Math.min((t - last) / 1000, 0.05);
      last = t;
      tick(dt);
      raf = requestAnimationFrame(loop);
    };

    const sync = () => {
      const should = inView && !document.hidden;
      if (should && !running) {
        running = true;
        last = performance.now();
        raf = requestAnimationFrame(loop);
      } else if (!should && running) {
        running = false;
        cancelAnimationFrame(raf);
      }
    };

    const io = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
      sync();
    });
    io.observe(el);
    const onVis = () => sync();
    document.addEventListener("visibilitychange", onVis);

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      io.disconnect();
      document.removeEventListener("visibilitychange", onVis);
    };
    // tick is intentionally captured once per (ref, active) lifecycle —
    // callers keep mutable state in refs, not new closures.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ref, active]);
}
