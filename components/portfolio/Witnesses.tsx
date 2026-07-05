import { testimonials } from "@/lib/content";
import Reveal from "@/components/primitives/Reveal";
import Annotation from "@/components/detective/Annotation";

/** Testimonials as case-file witness statements. Server-rendered. */
export default function Witnesses() {
  return (
    <section
      id="witnesses"
      className="relative border-t border-slate/40 py-28"
    >
      <div className="relative mx-auto max-w-6xl px-6 sm:px-10">
        <Reveal>
          <p className="mb-2 font-mono text-[11px] tracking-[0.35em] text-signal">
            04 — WITNESS STATEMENTS
          </p>
          <h2 className="display mb-14 text-5xl text-bone sm:text-7xl">
            On The
            <br />
            Record
          </h2>
        </Reveal>

        <Annotation
          id="witnesses"
          className="absolute right-6 top-0 sm:right-10"
        />

        <div className="grid gap-6 md:grid-cols-3">
          {testimonials.map((t, i) => (
            <Reveal key={t.id} delay={i * 0.08}>
              <article
                className={`flex h-full flex-col border border-slate/70 bg-coal/50 transition-colors hover:border-signal/40 ${
                  i % 2 === 0 ? "md:rotate-[0.4deg]" : "md:-rotate-[0.4deg]"
                }`}
              >
                {/* report header strip */}
                <div className="grid grid-cols-3 gap-px border-b border-slate/60 bg-slate/40 font-mono text-[9px] tracking-[0.2em]">
                  <span className="bg-coal px-3 py-2 text-signal">
                    WITNESS #{t.witnessNo}
                  </span>
                  <span className="bg-coal px-3 py-2 text-ash">{t.date}</span>
                  <span className="truncate bg-coal px-3 py-2 text-ash">
                    {t.relation}
                  </span>
                </div>

                {/* statement over ruled lines */}
                <blockquote
                  className="flex-1 px-5 py-6 leading-[28px] text-bone/85"
                  style={{
                    backgroundImage:
                      "repeating-linear-gradient(transparent 0 27px, rgba(42,45,54,0.5) 27px 28px)",
                  }}
                >
                  “{t.quote}”
                </blockquote>

                {/* signature */}
                <footer className="flex items-end justify-between gap-3 border-t border-slate/60 px-5 py-4">
                  <div>
                    <p className="mb-1 font-mono text-[9px] tracking-[0.25em] text-ash">
                      SIGNED: <span aria-hidden>✗</span>
                    </p>
                    <p className="display text-lg text-bone">{t.name}</p>
                    <p className="font-mono text-[10px] tracking-wide text-ash">
                      {t.role}
                    </p>
                  </div>
                  <span className="stamp shrink-0 text-signal/70">VERIFIED</span>
                </footer>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
