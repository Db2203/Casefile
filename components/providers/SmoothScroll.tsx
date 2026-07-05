"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { ReactLenis, type LenisRef } from "lenis/react";
import { cancelFrame, frame } from "motion/react";
import { registerLenis } from "@/lib/scroll";

/**
 * Lenis inertial scroll, driven by Framer Motion's frame loop so the page
 * has exactly ONE rAF for scroll + choreography. Renders children untouched
 * when disabled (reduced motion / touch — native scroll is already good).
 */
export default function SmoothScroll({
  enabled,
  children,
}: {
  enabled: boolean;
  children: ReactNode;
}) {
  const lenisRef = useRef<LenisRef>(null);

  useEffect(() => {
    if (!enabled) return;
    function update(data: { timestamp: number }) {
      lenisRef.current?.lenis?.raf(data.timestamp);
    }
    frame.update(update, true);
    // expose the instance to root-level overlays (palette) via lib/scroll
    registerLenis(lenisRef.current?.lenis ?? null);
    return () => {
      cancelFrame(update);
      registerLenis(null);
    };
  }, [enabled]);

  if (!enabled) return <>{children}</>;

  return (
    <ReactLenis
      root
      ref={lenisRef}
      options={{ autoRaf: false, lerp: 0.1, wheelMultiplier: 1 }}
    >
      {children}
    </ReactLenis>
  );
}
