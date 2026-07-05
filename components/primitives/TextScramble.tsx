"use client";

import { useEffect, useRef } from "react";
import { useInView, useReducedMotion } from "motion/react";

const GLYPHS = "!<>-_\\/[]{}—=+*^?#█▓▒░";

/**
 * Decrypt effect: text resolves out of glyph noise, letter by letter, when it
 * scrolls into view. One rAF writing textContent — no per-frame React state.
 * Screen readers get the real string via aria-label; the scramble is hidden.
 */
export default function TextScramble({
  text,
  className,
  speed = 2.2,
}: {
  text: string;
  className?: string;
  /** Frames per resolved character — higher = slower decode. */
  speed?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10% 0px" });
  const reduced = useReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!inView) return;
    if (reduced) {
      el.textContent = text;
      return;
    }

    let raf = 0;
    let frameCount = 0;
    const tick = () => {
      frameCount++;
      const resolved = Math.floor(frameCount / speed);
      if (resolved >= text.length) {
        el.textContent = text;
        return;
      }
      let out = text.slice(0, resolved);
      for (let i = resolved; i < text.length; i++) {
        out +=
          text[i] === " "
            ? " "
            : GLYPHS[(frameCount * 7 + i * 13) % GLYPHS.length];
      }
      el.textContent = out;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, reduced, text, speed]);

  return (
    <span className={className}>
      {/* real text for AT/SEO (aria-label is prohibited on generic spans) */}
      <span className="sr-only">{text}</span>
      {/* the visual scramble, hidden from assistive tech */}
      <span aria-hidden ref={ref}>
        {text}
      </span>
    </span>
  );
}
