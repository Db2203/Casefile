import { playground } from "@/lib/content";
import Reveal from "@/components/primitives/Reveal";
import Annotation from "@/components/detective/Annotation";
import DemoCard from "@/components/playground/DemoCard";

/** R&D — the workshop. The gadgets on these cards actually run. */
export default function Playground() {
  return (
    <section
      id="playground"
      className="relative border-t border-slate/40 py-16 sm:py-28"
    >
      <div className="relative mx-auto max-w-6xl px-6 sm:px-10">
        <Reveal>
          <p className="mb-2 font-mono text-[11px] tracking-[0.35em] text-signal">
            03 — {playground.heading}
          </p>
          <h2 className="display mb-4 text-5xl text-bone sm:text-7xl">
            Gadgets &<br />
            Prototypes
          </h2>
          <p className="mb-14 max-w-md leading-relaxed text-bone/80">
            {playground.intro}
          </p>
        </Reveal>

        <Annotation
          id="playground"
          className="absolute right-6 top-0 sm:right-10"
        />

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {playground.items.map((item, i) => (
            <Reveal key={item.title} delay={i * 0.07}>
              <DemoCard
                title={item.title}
                note={item.note}
                demo={item.demo}
                index={i}
              />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
