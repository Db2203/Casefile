"use client";

import type { ReactNode } from "react";
import { useMediaPreferences } from "@/lib/useMediaPreferences";
import { CursorProvider } from "@/components/cursor/CursorProvider";
import CustomCursor from "@/components/cursor/CustomCursor";
import SmoothScroll from "@/components/providers/SmoothScroll";
import RainCanvas from "@/components/atmosphere/RainCanvas";
import BootSequence from "@/components/atmosphere/BootSequence";
import DescentMeter from "@/components/atmosphere/DescentMeter";
import DetectiveMode from "@/components/detective/DetectiveMode";
import KonamiEgg from "@/components/easter/KonamiEgg";

/**
 * Client enhancement shell. The server-rendered content arrives via
 * `children` untouched (SEO intact); everything atmospheric mounts around it,
 * gated on `canEnhance` (false on SSR + first paint → progressive enhancement).
 *
 * Lenis gotcha: every `fixed` overlay lives HERE as a root-level sibling of
 * the scrolled content — never nested inside it.
 */
export default function SiteShell({ children }: { children: ReactNode }) {
  const { canEnhance, prefersReducedMotion } = useMediaPreferences();

  return (
    <CursorProvider>
      <SmoothScroll enabled={canEnhance}>{children}</SmoothScroll>

      {/* atmosphere — fixed, root-level siblings. Weather is NOT pointer-
          dependent: phones get rain too (only reduced-motion opts out). */}
      {!prefersReducedMotion && <RainCanvas />}
      {canEnhance && <DescentMeter />}
      {!prefersReducedMotion && <div className="grain-layer" aria-hidden />}
      <div className="vignette-layer" aria-hidden />

      {/* delight */}
      <DetectiveMode />
      <KonamiEgg />
      <BootSequence />

      {/* the cursor mounts last (highest z) */}
      {canEnhance && <CustomCursor />}
    </CursorProvider>
  );
}
