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
  isMobile: boolean;
  pointerFine: boolean;
  prefersReducedMotion: boolean;
  /**
   * THE single gate for every enhancement layer: custom cursor, flashlight,
   * magnetic buttons, rain, smooth scroll. False on SSR/first paint, so the
   * page always renders fully-lit, native-cursor, crawlable HTML first.
   */
  canEnhance: boolean;
}

export function useMediaPreferences(): MediaPreferences {
  const isSmall = useMediaQuery("(max-width: 820px)");
  const pointerFine = useMediaQuery("(pointer: fine)");
  const prefersReducedMotion = useMediaQuery(
    "(prefers-reduced-motion: reduce)",
  );

  const isMobile = isSmall || !pointerFine;
  const canEnhance = pointerFine && !isSmall && !prefersReducedMotion;

  return { isMobile, pointerFine, prefersReducedMotion, canEnhance };
}
