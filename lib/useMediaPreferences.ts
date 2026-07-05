"use client";

import { useSyncExternalStore } from "react";

/**
 * SSR-safe media-query hook. Returns `serverValue` during SSR and the first
 * client render (avoids hydration mismatch), then updates after mount.
 */
function useMediaQuery(query: string, serverValue = false): boolean {
  return useSyncExternalStore(
    (onChange) => {
      const mql = window.matchMedia(query);
      mql.addEventListener("change", onChange);
      return () => mql.removeEventListener("change", onChange);
    },
    () => window.matchMedia(query).matches,
    () => serverValue,
  );
}

export interface MediaPreferences {
  prefersReducedMotion: boolean;
  /**
   * Gate for POINTER-dependent enhancement: custom cursor, flashlight,
   * magnetic buttons, tilt, smooth scroll. False on SSR/first paint, so the
   * page always renders fully-lit, native-cursor, crawlable HTML first.
   *
   * Pure atmosphere (rain, lightning, grain) gates on !prefersReducedMotion
   * only — phones get the weather too.
   */
  canEnhance: boolean;
}

export function useMediaPreferences(): MediaPreferences {
  const isSmall = useMediaQuery("(max-width: 820px)");
  const pointerFine = useMediaQuery("(pointer: fine)");
  const prefersReducedMotion = useMediaQuery(
    "(prefers-reduced-motion: reduce)",
  );

  const canEnhance = pointerFine && !isSmall && !prefersReducedMotion;

  return { prefersReducedMotion, canEnhance };
}
