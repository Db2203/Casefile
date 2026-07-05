import { playground } from "@/lib/content";
import Reveal from "@/components/primitives/Reveal";
import CursorZone from "@/components/cursor/CursorZone";
import Annotation from "@/components/detective/Annotation";

/** R&D — the workshop. Prototypes on blueprint-grid cards. */
export default function Playground() {
  return (
    <section
      id="playground"
      className="relative border-t border-slate/40 py-28"
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
              <CursorZone variant="link">
                <div
                  className="group relative h-full overflow-hidden border border-slate/70 p-6 transition-all duration-300 hover:-translate-y-1 hover:border-signal/60 hover:shadow-[0_8px_40px_-12px_rgba(245,178,26,0.25)]"
                  style={{
                    backgroundImage:
                      "linear-gradient(rgba(42,45,54,0.22) 1px, transparent 1px), linear-gradient(90deg, rgba(42,45,54,0.22) 1px, transparent 1px)",
                    backgroundSize: "22px 22px",
                    backgroundColor: "rgba(20,20,26,0.6)",
                  }}
                >
                  <p className="mb-1 font-mono text-[10px] tracking-[0.3em] text-signal/70">
                    PROTO-{String(i + 1).padStart(2, "0")}
                  </p>
                  <p className="font-semibold text-bone transition-colors group-hover:text-signal-hot">
                    {item.title}
                  </p>
                  <p className="mt-2 font-mono text-[11px] leading-relaxed tracking-wide text-ash">
                    {item.note}
                  </p>
                </div>
              </CursorZone>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
