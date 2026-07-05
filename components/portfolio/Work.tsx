import { projects } from "@/lib/content";
import Reveal from "@/components/primitives/Reveal";
import Parallax from "@/components/primitives/Parallax";
import { SkylineFar, SkylineMid } from "@/components/atmosphere/Skyline";
import Annotation from "@/components/detective/Annotation";
import CaseCard from "./CaseCard";

/** Selected work as a descent through the city — parallax skylines behind case files. */
export default function Work() {
  return (
    <section
      id="work"
      className="relative overflow-hidden border-t border-slate/40 py-16 sm:py-28"
    >
      {/* parallax skyline layers — the descent */}
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-full">
        <Parallax speed={-40} className="absolute inset-x-0 top-10">
          <SkylineFar className="h-52 w-full text-[#0a0a10] opacity-80" />
        </Parallax>
        <Parallax speed={30} className="absolute inset-x-0 top-40">
          <SkylineMid className="h-64 w-full text-[#0d0d13] opacity-60" />
        </Parallax>
      </div>

      <div className="relative mx-auto max-w-6xl px-6 sm:px-10">
        <Reveal>
          <p className="mb-2 font-mono text-[11px] tracking-[0.35em] text-signal">
            01 — SELECTED WORK
          </p>
          <h2 className="display mb-4 text-5xl text-bone sm:text-7xl">
            Case Files
          </h2>
          <p className="mb-14 max-w-md font-mono text-xs leading-relaxed tracking-wide text-ash">
            FOUR CASES, DECLASSIFIED. HOVER TO REMOVE THE REDACTIONS.
          </p>
        </Reveal>

        <Annotation id="work" className="absolute -top-2 right-6 sm:right-10" />

        <div className="grid gap-6 md:grid-cols-2">
          {projects.map((p, i) => (
            <Reveal key={p.id} delay={i * 0.08}>
              <CaseCard project={p} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
