"use client";

import type { ReactNode } from "react";
import { useMediaPreferences } from "@/lib/useMediaPreferences";
import { CursorProvider } from "@/components/cursor/CursorProvider";
import CustomCursor from "@/components/cursor/CustomCursor";
import SmoothScroll from "@/components/providers/SmoothScroll";
import RainCanvas from "@/components/atmosphere/RainCanvas";
import SheetLightning from "@/components/atmosphere/SheetLightning";
import BootSequence from "@/components/atmosphere/BootSequence";
import DescentMeter from "@/components/atmosphere/DescentMeter";
import DetectiveMode from "@/components/detective/DetectiveMode";
import HudDock from "@/components/shell/HudDock";
import CommandPalette from "@/components/palette/CommandPalette";
import KonamiEgg from "@/components/easter/KonamiEgg";

/**
 * Client enhancement shell. The server-rendered content arrives via
 * `children` untouched (SEO intact); everything atmospheric mounts around it.
 * Weather (rain/lightning/grain) gates on !prefersReducedMotion only —
 * phones get the storm; pointer-dependent features gate on canEnhance.
 *
 * Lenis gotcha: every `fixed` overlay lives HERE as a root-level sibling of
 * the scrolled content — never nested inside it.
 *
 * z ledger: lightning 39 < rain 40 < meter 55 < vignette 60 < detective 65 <
 * grain 70 < dock 80 < konami 85 < palette 88 < boot 90 < skip-link 110 < cursor.
 */
export default function SiteShell({ children }: { children: ReactNode }) {
  const { canEnhance, prefersReducedMotion } = useMediaPreferences();

  return (
    <CursorProvider>
      <SmoothScroll enabled={canEnhance}>{children}</SmoothScroll>

      {/* atmosphere — fixed, root-level siblings */}
      {!prefersReducedMotion && <SheetLightning />}
      {!prefersReducedMotion && <RainCanvas />}
      {canEnhance && <DescentMeter />}
      {!prefersReducedMotion && <div className="grain-layer" aria-hidden />}
      <div className="vignette-layer" aria-hidden />

      {/* systems */}
      <DetectiveMode />
      <HudDock />
      <CommandPalette />
      <KonamiEgg />
      <BootSequence />

      {/* the cursor mounts last (highest z) */}
      {canEnhance && <CustomCursor />}
    </CursorProvider>
  );
}
