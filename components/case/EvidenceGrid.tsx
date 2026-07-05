import type { Project } from "@/lib/content";
import EvidencePlaceholder from "./EvidencePlaceholder";
import Reveal from "@/components/primitives/Reveal";

/** EVIDENCE — exhibit grid (placeholder art until real screenshots exist). */
export default function EvidenceGrid({ project }: { project: Project }) {
  const letters = ["A", "B", "C", "D", "E"];
  return (
    <div id="evidence" className="grid gap-6 sm:grid-cols-2">
      {project.caseStudy.evidence.map((ev, i) => (
        <Reveal key={ev.id} delay={i * 0.06}>
          <figure className="group border border-slate/70 bg-coal/60 p-2 pb-3 transition-colors hover:border-signal/50">
            <EvidencePlaceholder
              seed={`${project.id}-${ev.id}`}
              kind={ev.kind}
              className="h-auto w-full"
            />
            <figcaption className="mt-3 flex items-baseline justify-between px-1 font-mono text-[10px] tracking-[0.25em] text-ash">
              <span className="text-signal">EXHIBIT {letters[i] ?? i + 1}</span>
              <span className="truncate pl-4">{ev.caption.toUpperCase()}</span>
            </figcaption>
          </figure>
        </Reveal>
      ))}
    </div>
  );
}
