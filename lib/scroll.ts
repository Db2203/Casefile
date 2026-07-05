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

/**
 * Pause/resume user scrolling (palette, lightbox). Keyed + idempotent so
 * overlapping consumers can't unlock each other, and it works WITHOUT Lenis
 * too (mobile / reduced motion) via an overflow fallback.
 */
const locks = new Set<string>();

export function setScrollLocked(key: string, locked: boolean) {
  if (locked) locks.add(key);
  else locks.delete(key);
  const should = locks.size > 0;
  if (lenis) {
    if (should) lenis.stop();
    else lenis.start();
  }
  document.documentElement.style.overflow = should ? "hidden" : "";
}
