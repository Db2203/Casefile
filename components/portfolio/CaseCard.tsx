"use client";

import { useRef, type PointerEvent } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";
import type { Project } from "@/lib/content";
import { useMediaPreferences } from "@/lib/useMediaPreferences";
import CursorZone from "@/components/cursor/CursorZone";
import TextScramble from "@/components/primitives/TextScramble";
import BatMark from "@/components/atmosphere/BatMark";

/**
 * A project as a noir case file: pointer-tilt dossier, redaction bar that
 * wipes off the summary on hover, decrypting title, flickering watermark.
 * Rect cached on enter; tilt driven by springs (no re-renders per move).
 */
export default function CaseCard({ project }: { project: Project }) {
  const { canEnhance } = useMediaPreferences();
  const rect = useRef<DOMRect | null>(null);

  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const rotateX = useSpring(rx, { stiffness: 180, damping: 20 });
  const rotateY = useSpring(ry, { stiffness: 180, damping: 20 });

  const onEnter = (e: PointerEvent<HTMLElement>) => {
    rect.current = e.currentTarget.getBoundingClientRect();
  };
  const onMove = (e: PointerEvent<HTMLElement>) => {
    if (!canEnhance) return;
    const r = rect.current;
    if (!r) return;
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    ry.set(px * 7);
    rx.set(py * -7);
  };
  const onLeave = () => {
    rect.current = null;
    rx.set(0);
    ry.set(0);
  };

  return (
    <CursorZone variant="case" label="OPEN CASE">
      <div style={{ perspective: 1100 }}>
        <motion.article
          className="case-card group relative overflow-hidden border border-slate/70 bg-coal/60 p-6 backdrop-blur-[2px] transition-colors duration-300 hover:border-signal/50 sm:p-8"
          style={{
            rotateX,
            rotateY,
            transformStyle: "preserve-3d",
          }}
          onPointerEnter={onEnter}
          onPointerMove={onMove}
          onPointerLeave={onLeave}
        >
          {/* flickering watermark */}
          <BatMark className="emblem-flicker pointer-events-none absolute -right-4 -top-2 w-28 text-ink opacity-85" />

          {/* dossier header row */}
          <div className="mb-5 flex items-baseline justify-between gap-4 font-mono text-[10px] tracking-[0.3em] text-ash">
            <span className="text-signal">CASE #{project.caseNo}</span>
            <span>{project.year}</span>
          </div>

          <h3 className="display mb-1 text-4xl text-bone transition-colors duration-300 group-hover:text-signal-hot sm:text-5xl">
            <TextScramble text={project.title} />
          </h3>
          <p className="mb-5 font-mono text-[10px] uppercase tracking-[0.25em] text-ash">
            {project.category}
          </p>

          {/* the redacted finding — declassified on hover */}
          <p className="mb-5 max-w-md leading-relaxed text-bone/90">
            <span className="redacted">{project.summary}</span>
          </p>

          <p className="mb-6 max-w-md text-sm leading-relaxed text-bone/70">
            {project.description}
          </p>

          <div className="flex flex-wrap items-center gap-2">
            {project.tags.map((tag) => (
              <span
                key={tag}
                className="border border-slate/80 px-2.5 py-1 font-mono text-[10px] tracking-widest text-bone/75"
              >
                {tag}
              </span>
            ))}
            <span className="stamp ml-auto text-signal/80">
              {project.status}
            </span>
          </div>

          {project.link && (
            <a
              href={project.link}
              className="link-wipe mt-6 inline-block font-mono text-xs tracking-[0.2em] text-bone"
            >
              OPEN CASE FILE ↗
              <span className="sr-only"> — {project.title}</span>
            </a>
          )}
        </motion.article>
      </div>
    </CursorZone>
  );
}
