import type { CaseStudy } from "@/lib/content";
import Reveal from "@/components/primitives/Reveal";
import TextScramble from "@/components/primitives/TextScramble";

/** IMPACT — the numbers, in towering Anton with decrypt-in values. */
export default function ImpactStats({
  stats,
}: {
  stats: CaseStudy["impact"];
}) {
  return (
    <dl className="grid gap-10 sm:grid-cols-3">
      {stats.map((stat, i) => (
        <Reveal key={stat.label} delay={i * 0.08}>
          <div className="border-l-2 border-signal/60 pl-5">
            <dd className="display text-[clamp(2.6rem,6vw,4.5rem)] text-signal">
              <TextScramble text={stat.value} speed={4} />
            </dd>
            <dt className="mt-2 font-mono text-[10px] tracking-[0.3em] text-ash">
              {stat.label}
            </dt>
          </div>
        </Reveal>
      ))}
    </dl>
  );
}
