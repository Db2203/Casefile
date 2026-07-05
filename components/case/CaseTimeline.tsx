import type { CaseStudy } from "@/lib/content";
import Reveal from "@/components/primitives/Reveal";

/** INVESTIGATION — vertical evidence-trail timeline. */
export default function CaseTimeline({
  steps,
}: {
  steps: CaseStudy["investigation"];
}) {
  return (
    <ol className="relative ml-2 border-l border-slate/60">
      {steps.map((step, i) => (
        <li key={i} className="relative pb-10 pl-8 last:pb-0">
          {/* amber node */}
          <span
            aria-hidden
            className="absolute -left-[5px] top-1.5 h-2.5 w-2.5 rotate-45 bg-signal shadow-[0_0_12px_rgba(245,178,26,0.6)]"
          />
          <Reveal delay={i * 0.05}>
            <p className="mb-1 font-mono text-[10px] tracking-[0.3em] text-signal">
              {step.label}
            </p>
            <h3 className="mb-2 text-xl font-semibold text-bone">
              {step.title}
            </h3>
            <p className="max-w-xl leading-relaxed text-bone/75">
              {step.detail}
            </p>
          </Reveal>
        </li>
      ))}
    </ol>
  );
}
