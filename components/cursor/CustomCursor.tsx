"use client";

import { useEffect } from "react";
import { AnimatePresence, motion, useSpring } from "motion/react";
import { bindPointer, pointerX, pointerY } from "./pointer";
import { useCursorState } from "./CursorProvider";

/**
 * Two fixed elements driven entirely by springs off the shared pointer
 * motion values: a tight amber dot and a loose trailing ring. The stiffness
 * gap between the two springs IS the trail effect.
 *
 * Mount this ONLY when `canEnhance` is true (SiteShell gates it).
 */
export default function CustomCursor() {
  const { variant, label } = useCursorState();

  // Tight spring — the dot.
  const dotX = useSpring(pointerX, { stiffness: 900, damping: 55, mass: 0.3 });
  const dotY = useSpring(pointerY, { stiffness: 900, damping: 55, mass: 0.3 });
  // Loose spring — the afterimage ring.
  const ringX = useSpring(pointerX, { stiffness: 160, damping: 20, mass: 0.7 });
  const ringY = useSpring(pointerY, { stiffness: 160, damping: 20, mass: 0.7 });

  useEffect(() => {
    const unbind = bindPointer();
    document.body.classList.add("cursor-none");
    return () => {
      unbind();
      document.body.classList.remove("cursor-none");
    };
  }, []);

  const ringVariants = {
    default: { width: 36, height: 36, opacity: 0.55 },
    link: { width: 56, height: 56, opacity: 0.9 },
    case: { width: 92, height: 92, opacity: 1 },
    hidden: { width: 0, height: 0, opacity: 0 },
  } as const;

  return (
    <>
      {/* dot */}
      <motion.div
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[100] h-1.5 w-1.5 rounded-full bg-signal"
        style={{
          x: dotX,
          y: dotY,
          translateX: "-50%",
          translateY: "-50%",
          willChange: "transform",
          boxShadow: "0 0 10px 2px rgba(245,178,26,0.55)",
          opacity: variant === "hidden" ? 0 : 1,
        }}
      />
      {/* trailing ring / label disc */}
      <motion.div
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[99] flex items-center justify-center rounded-full"
        style={{
          x: ringX,
          y: ringY,
          translateX: "-50%",
          translateY: "-50%",
          willChange: "transform",
          border: "1px solid rgba(245,178,26,0.7)",
          background:
            variant === "case"
              ? "rgba(5,5,7,0.78)"
              : "rgba(245,178,26,0.04)",
          backdropFilter: variant === "case" ? "blur(2px)" : undefined,
        }}
        animate={ringVariants[variant]}
        transition={{ type: "spring", stiffness: 320, damping: 26 }}
      >
        <AnimatePresence>
          {label && (
            <motion.span
              key={label}
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.6 }}
              className="whitespace-nowrap font-mono text-[9px] tracking-[0.25em] text-signal"
            >
              {label}
            </motion.span>
          )}
        </AnimatePresence>
      </motion.div>
    </>
  );
}
