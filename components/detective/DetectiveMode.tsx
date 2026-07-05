"use client";

import { useEffect } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useNoir } from "@/lib/store";

/**
 * Arkham-wink scan mode: press D (or the HUD dock button) → cold-cyan
 * scanline overlay; <Annotation> chips across the site fade in revealing how
 * each section is engineered. Overlay + key handling only — the toggle
 * button lives in <HudDock/>.
 */
export default function DetectiveMode() {
  const detectiveMode = useNoir((s) => s.detectiveMode);
  const toggleDetective = useNoir((s) => s.toggleDetective);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() !== "d") return;
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      const t = e.target as HTMLElement | null;
      if (t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.isContentEditable))
        return;
      toggleDetective();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [toggleDetective]);

  return (
    <>
      {/* announce toggles to assistive tech */}
      <span className="sr-only" role="status" aria-live="polite">
        {detectiveMode ? "Detective mode on" : "Detective mode off"}
      </span>
      <AnimatePresence>
        {detectiveMode && (
          <motion.div
            className="detective-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            aria-hidden
          />
        )}
      </AnimatePresence>
    </>
  );
}

/** The dock button (rendered by HudDock). */
export function DetectiveButton() {
  const detectiveMode = useNoir((s) => s.detectiveMode);
  const toggleDetective = useNoir((s) => s.toggleDetective);
  return (
    <button
      onClick={toggleDetective}
      aria-pressed={detectiveMode}
      className={`rounded-sm border px-3 py-2 font-mono text-[10px] tracking-[0.25em] backdrop-blur transition-colors ${
        detectiveMode
          ? "border-scan/70 bg-scan/10 text-scan"
          : "border-slate bg-void/60 text-ash hover:border-ash hover:text-bone"
      }`}
    >
      [D] DETECTIVE{detectiveMode ? ": ON" : ""}
    </button>
  );
}
