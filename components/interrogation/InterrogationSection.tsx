import { SUGGESTED_QUESTIONS } from "@/lib/interrogation";
import Reveal from "@/components/primitives/Reveal";
import Annotation from "@/components/detective/Annotation";
import InterrogationChat from "./InterrogationChat";

/**
 * 03 — THE INTERROGATION ROOM. A live, grounded Q&A against the archive:
 * visitors question the record instead of reading a bio. Powered by a
 * Groq-backed API route; the model only knows what content.ts puts on record.
 */
export default function InterrogationSection() {
  return (
    <section
      id="interrogate"
      className="relative border-t border-slate/40 py-16 sm:py-28"
    >
      <div className="relative mx-auto max-w-6xl px-6 sm:px-10">
        <Reveal>
          <p className="mb-2 font-mono text-[11px] tracking-[0.35em] text-signal">
            03 · THE INTERROGATION ROOM
          </p>
          <h2 className="display mb-4 text-5xl text-bone sm:text-7xl">
            Question
            <br />
            The Record
          </h2>
          <p className="mb-12 max-w-md leading-relaxed text-bone/80">
            Don&apos;t take the archive&apos;s word for it. Cross-examine it.
            Ask about the cases, the skills, the numbers. It answers only from
            what&apos;s on record.
          </p>
        </Reveal>

        <Annotation
          id="interrogate"
          className="absolute right-6 top-0 sm:right-10"
        />

        <Reveal delay={0.1}>
          <div className="mx-auto max-w-3xl">
            <InterrogationChat suggestions={SUGGESTED_QUESTIONS} />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
