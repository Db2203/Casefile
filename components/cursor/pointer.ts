"use client";

import { motionValue } from "motion/react";

/**
 * Module-scope pointer motion values — the single source of pointer truth.
 * One passive listener feeds these; the cursor, flashlight, and any other
 * pointer-bound effect spring off them. Never React state per mousemove.
 */
export const pointerX = motionValue(-200);
export const pointerY = motionValue(-200);

let bound = 0;

/** Attach the global pointermove listener (ref-counted). */
export function bindPointer(): () => void {
  if (bound++ === 0) {
    window.addEventListener("pointermove", onMove, { passive: true });
  }
  return () => {
    if (--bound === 0) {
      window.removeEventListener("pointermove", onMove);
    }
  };
}

function onMove(e: globalThis.PointerEvent) {
  pointerX.set(e.clientX);
  pointerY.set(e.clientY);
}
