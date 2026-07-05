import Link from "next/link";
import BatMark from "@/components/atmosphere/BatMark";
import { SkylineFar, SkylineNear } from "@/components/atmosphere/Skyline";

/** Lost in the city — themed 404, pure CSS atmosphere (server-renderable). */
export default function NotFound() {
  return (
    <main className="relative flex min-h-[100svh] flex-col items-center justify-center overflow-hidden bg-void px-6 text-center">
      <BatMark className="pointer-events-none absolute left-1/2 top-[12%] w-64 -translate-x-1/2 text-coal" />

      <div className="pointer-events-none absolute inset-x-0 bottom-0">
        <SkylineFar className="absolute bottom-0 h-44 w-full text-[#0d0d13]" />
        <SkylineNear className="relative h-36 w-full text-[#101016]" />
      </div>

      <p className="mb-3 font-mono text-[11px] tracking-[0.4em] text-signal">
        CASE NOT FOUND
      </p>
      <h1 className="display text-[clamp(5rem,22vw,16rem)] leading-none text-bone">
        404
      </h1>
      <p className="mt-4 max-w-sm font-mono text-xs leading-relaxed tracking-wide text-ash">
        THIS PART OF THE CITY DOESN&apos;T EXIST. THE TRAIL WENT COLD.
      </p>
      <Link
        href="/"
        className="link-wipe mt-10 font-mono text-sm tracking-[0.25em] text-signal"
      >
        ← RETURN TO THE ROOFTOPS
      </Link>

      <div className="vignette-layer" aria-hidden />
      <div className="grain-layer" aria-hidden />
    </main>
  );
}
