"use client";

import type { DemoKind, EvidenceKind } from "@/lib/content";
import { useMediaPreferences } from "@/lib/useMediaPreferences";
import CursorZone from "@/components/cursor/CursorZone";
import EvidencePlaceholder from "@/components/case/EvidencePlaceholder";
import KineticType from "./demos/KineticType";
import FluidCursor from "./demos/FluidCursor";
import NightCity from "./demos/NightCity";
import SignalStatic from "./demos/SignalStatic";

const FALLBACK_ART: Record<DemoKind, EvidenceKind> = {
  kinetic: "blueprint",
  fluid: "graph",
  city: "skyline",
  static: "ui",
};

/**
 * R&D gadget card — the demo area is LIVE on capable devices (each demo runs
 * one rAF, paused off-screen/hidden via useRafLoop) and a designed static
 * fallback everywhere else. NightCity is interactive on touch too (tap).
 */
export default function DemoCard({
  title,
  note,
  demo,
  index,
}: {
  title: string;
  note: string;
  demo: DemoKind;
  index: number;
}) {
  const { prefersReducedMotion } = useMediaPreferences();
  // Every demo has an autonomous mode now (wave/wander/breathe/tap) — live
  // everywhere except reduced motion, which gets the designed static art.
  const live = !prefersReducedMotion;

  return (
    <CursorZone variant="link" className="h-full">
      <div
        className="group relative flex h-full flex-col overflow-hidden border border-slate/70 transition-all duration-300 hover:-translate-y-1 hover:border-signal/60 hover:shadow-[0_8px_40px_-12px_rgba(245,178,26,0.25)]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(42,45,54,0.22) 1px, transparent 1px), linear-gradient(90deg, rgba(42,45,54,0.22) 1px, transparent 1px)",
          backgroundSize: "22px 22px",
          backgroundColor: "rgba(20,20,26,0.6)",
        }}
      >
        {/* live demo area */}
        <div className="relative h-36 border-b border-slate/60 bg-void/60">
          {live ? (
            <>
              {demo === "kinetic" && <KineticType />}
              {demo === "fluid" && <FluidCursor />}
              {demo === "city" && <NightCity />}
              {demo === "static" && <SignalStatic />}
            </>
          ) : (
            <EvidencePlaceholder
              seed={`demo-${demo}`}
              kind={FALLBACK_ART[demo]}
              className="h-full w-full"
            />
          )}
        </div>

        <div className="p-5">
          <p className="mb-1 font-mono text-[10px] tracking-[0.3em] text-signal/70">
            PROTO-{String(index + 1).padStart(2, "0")}
            {live && <span className="ml-2 text-signal">● LIVE</span>}
          </p>
          <p className="font-semibold text-bone transition-colors group-hover:text-signal-hot">
            {title}
          </p>
          <p className="mt-2 font-mono text-[11px] leading-relaxed tracking-wide text-ash">
            {note}
          </p>
        </div>
      </div>
    </CursorZone>
  );
}
