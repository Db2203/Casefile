"use client";

import Link from "next/link";
import BatMark from "@/components/atmosphere/BatMark";
import { SkylineFar, SkylineNear } from "@/components/atmosphere/Skyline";

/**
 * Route-level error boundary — if a component throws at runtime, the visitor
 * gets this in-character page instead of Next's default screen. `reset` retries
 * the segment; the home link is the escape hatch.
 */
export default function Error({ reset }: { error: Error; reset: () => void }) {
  return (
    <main className="relative flex min-h-[100svh] flex-col items-center justify-center overflow-hidden bg-void px-6 text-center">
      <BatMark className="pointer-events-none absolute left-1/2 top-[12%] w-64 -translate-x-1/2 text-coal" />

      <div className="pointer-events-none absolute inset-x-0 bottom-0">
        <SkylineFar className="absolute bottom-0 h-44 w-full text-[#0d0d13]" />
        <SkylineNear className="relative h-36 w-full text-[#101016]" />
      </div>

      <p className="mb-3 font-mono text-[11px] tracking-[0.4em] text-signal">
        EVIDENCE TAMPERED
      </p>
      <h1 className="display text-[clamp(2.5rem,10vw,5.5rem)] leading-none text-bone">
        CASE
        <br />
        CORRUPTED
      </h1>
      <p className="mt-5 max-w-sm font-mono text-xs leading-relaxed tracking-wide text-ash">
        SOMETHING BROKE ON THE WAY OUT OF THE DARK. THE FILE COULDN&apos;T BE
        READ.
      </p>
      <div className="mt-10 flex flex-wrap items-center justify-center gap-x-10 gap-y-4">
        <button
          onClick={reset}
          className="link-wipe font-mono text-sm tracking-[0.25em] text-signal"
        >
          ↺ REOPEN THE CASE
        </button>
        <Link
          href="/"
          className="link-wipe font-mono text-sm tracking-[0.25em] text-signal"
        >
          ← RETURN TO THE ROOFTOPS
        </Link>
      </div>

      <div className="vignette-layer" aria-hidden />
      <div className="grain-layer" aria-hidden />
    </main>
  );
}
