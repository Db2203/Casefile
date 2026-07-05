"use client";

import type Lenis from "lenis";

/**
 * Lenis-safe programmatic scrolling. The command palette (and any other
 * root-level overlay) has no Lenis context, so SmoothScroll registers its
 * instance here and everyone else calls scrollToSection().
 */

let lenis: Lenis | null = null;

export function registerLenis(instance: Lenis | null) {
  lenis = instance;
}

export function scrollToSection(id: string) {
  if (lenis) {
    lenis.scrollTo(`#${id}`, { offset: 0 });
  } else {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  }
}

/** Pause/resume user scrolling (used while the palette is open). */
export function setScrollLocked(locked: boolean) {
  if (!lenis) return;
  if (locked) lenis.stop();
  else lenis.start();
}
