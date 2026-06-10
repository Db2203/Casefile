import { about } from "@/lib/content";
import Reveal from "@/components/primitives/Reveal";
import Annotation from "@/components/detective/Annotation";

/** The subject dossier — classified personnel file. */
export default function About() {
  const marquee = [...about.skills, ...about.skills];

  return (
    <section id="about" className="relative border-t border-slate/40 py-28">
      <div className="relative mx-auto max-w-6xl px-6 sm:px-10">
        <Reveal>
          <p className="mb-2 font-mono text-[11px] tracking-[0.35em] text-signal">
            02 — {about.heading}
          </p>
          <h2 className="display mb-14 text-5xl text-bone sm:text-7xl">
            Know Your
            <br />
            Suspect
          </h2>
        </Reveal>

        <Annotation id="about" className="absolute right-6 top-0 sm:right-10" />

        <div className="grid gap-12 md:grid-cols-[1fr_1.3fr]">
          {/* dossier fields */}
          <Reveal delay={0.1}>
            <dl className="space-y-5 border-l-2 border-signal/60 pl-6">
              {about.fields.map((f) => (
                <div key={f.label}>
                  <dt className="font-mono text-[10px] tracking-[0.3em] text-ash">
                    {f.label}
                  </dt>
                  <dd className="mt-1 text-lg text-bone">{f.value}</dd>
                </div>
              ))}
            </dl>
          </Reveal>

          {/* statement */}
          <Reveal delay={0.2}>
            <p className="mb-6 text-xl leading-relaxed text-bone/90">
              {about.intro}
            </p>
            {about.paragraphs.map((para, i) => (
              <p key={i} className="mb-5 leading-relaxed text-bone/80">
                {para}
              </p>
            ))}
          </Reveal>
        </div>
      </div>

      {/* skills ticker — evidence tags on a wire */}
      <div className="mt-20 overflow-hidden border-y border-slate/40 py-4">
        <div className="marquee-track gap-10 font-mono text-xs uppercase tracking-[0.3em] text-ash">
          {marquee.map((s, i) => (
            <span key={i} className="flex items-center gap-10">
              {s} <span className="text-signal">✦</span>
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
