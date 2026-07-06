"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import type { Project } from "@/lib/content";
import { setScrollLocked } from "@/lib/scroll";
import EvidenceVisual from "./EvidenceVisual";
import Reveal from "@/components/primitives/Reveal";
import CursorZone from "@/components/cursor/CursorZone";

const LETTERS = ["A", "B", "C", "D", "E"];

/**
 * EVIDENCE — exhibit grid. Click an exhibit to examine it in a lightbox
 * (Escape / backdrop closes; focus is trapped on the close button and
 * restored on close). Shows real screenshots when present, procedural art otherwise.
 */
export default function EvidenceGrid({
  project,
  images = [],
}: {
  project: Project;
  /** Real screenshot URLs (resolved server-side), aligned with evidence[]. */
  images?: (string | null)[];
}) {
  const [openIdx, setOpenIdx] = useState<number | null>(null);
  const reduced = useReducedMotion();
  const closeRef = useRef<HTMLButtonElement>(null);
  const prevFocus = useRef<HTMLElement | null>(null);

  const open = (i: number) => {
    prevFocus.current = document.activeElement as HTMLElement | null;
    setOpenIdx(i);
  };
  const close = () => setOpenIdx(null);

  useEffect(() => {
    if (openIdx === null) {
      setScrollLocked("lightbox", false);
      prevFocus.current?.focus?.();
      return;
    }
    setScrollLocked("lightbox", true);
    requestAnimationFrame(() => closeRef.current?.focus());
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "Tab") e.preventDefault(); // single tab stop
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      setScrollLocked("lightbox", false);
    };
  }, [openIdx]);

  const current = openIdx !== null ? project.caseStudy.evidence[openIdx] : null;

  return (
    <>
      <div id="evidence" className="grid gap-6 sm:grid-cols-2">
        {project.caseStudy.evidence.map((ev, i) => (
          <Reveal key={ev.id} delay={i * 0.06}>
            <CursorZone variant="case" label="EXAMINE">
              <button
                type="button"
                onClick={() => open(i)}
                aria-haspopup="dialog"
                aria-label={`Examine exhibit ${LETTERS[i] ?? i + 1}: ${ev.caption}`}
                className="group block w-full border border-slate/70 bg-coal/60 p-2 pb-3 text-left transition-colors hover:border-signal/50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-signal"
              >
                <EvidenceVisual
                  seed={`${project.id}-${ev.id}`}
                  kind={ev.kind}
                  image={images[i]}
                  alt={ev.caption}
                  className="h-auto w-full"
                />
                <span className="mt-3 flex items-baseline justify-between px-1 font-mono text-[10px] tracking-[0.25em] text-ash">
                  <span className="text-signal">
                    EXHIBIT {LETTERS[i] ?? i + 1}
                  </span>
                  <span className="truncate pl-4">
                    {ev.caption.toUpperCase()}
                  </span>
                </span>
              </button>
            </CursorZone>
          </Reveal>
        ))}
      </div>

      {/* lightbox */}
      <AnimatePresence>
        {current && openIdx !== null && (
          <motion.div
            className="fixed inset-0 z-[86] flex items-center justify-center p-4 sm:p-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduced ? 0 : 0.2 }}
          >
            <button
              aria-label="Close exhibit"
              onClick={close}
              className="absolute inset-0 cursor-default bg-void/90 backdrop-blur-sm"
            />
            <motion.figure
              role="dialog"
              aria-modal="true"
              aria-label={`Exhibit ${LETTERS[openIdx] ?? openIdx + 1}: ${current.caption}`}
              initial={reduced ? false : { scale: 0.94, y: 10 }}
              animate={{ scale: 1, y: 0 }}
              exit={reduced ? undefined : { scale: 0.97, y: 6 }}
              transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
              className="relative z-10 w-full max-w-3xl border border-signal/40 bg-ink p-3 pb-4 shadow-[0_0_90px_-25px_rgba(245,178,26,0.4)]"
            >
              <EvidenceVisual
                seed={`${project.id}-${current.id}`}
                kind={current.kind}
                image={images[openIdx]}
                alt={current.caption}
                className="h-auto w-full"
              />
              <figcaption className="mt-4 flex items-center justify-between gap-4 px-1 font-mono text-[11px] tracking-[0.25em] text-ash">
                <span>
                  <span className="text-signal">
                    EXHIBIT {LETTERS[openIdx] ?? openIdx + 1}
                  </span>{" "}
                  — {current.caption.toUpperCase()}
                </span>
                <button
                  ref={closeRef}
                  onClick={close}
                  className="shrink-0 border border-slate px-3 py-1.5 text-[10px] tracking-[0.25em] text-bone transition-colors hover:border-signal hover:text-signal"
                >
                  CLOSE [ESC]
                </button>
              </figcaption>
            </motion.figure>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
