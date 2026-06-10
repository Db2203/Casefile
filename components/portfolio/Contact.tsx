import { contact } from "@/lib/content";
import Reveal from "@/components/primitives/Reveal";
import MagneticButton from "@/components/primitives/MagneticButton";
import CursorZone from "@/components/cursor/CursorZone";
import Annotation from "@/components/detective/Annotation";

/** The signal — magnetic CTA projecting an amber beam into the night. */
export default function Contact() {
  return (
    <section
      id="contact"
      className="relative overflow-hidden border-t border-slate/40 py-32"
    >
      {/* the beam behind the CTA */}
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-0 left-1/2 h-[80vh] w-[44vw] -translate-x-1/2"
        style={{
          background:
            "conic-gradient(from 180deg at 50% 100%, transparent 43%, rgba(245,178,26,0.07) 48%, rgba(255,210,74,0.13) 50%, rgba(245,178,26,0.07) 52%, transparent 57%)",
        }}
      />

      <div className="relative mx-auto max-w-6xl px-6 text-center sm:px-10">
        <Reveal>
          <p className="mb-2 font-mono text-[11px] tracking-[0.35em] text-signal">
            04 — {contact.heading}
          </p>
          <h2 className="display mx-auto max-w-4xl text-[clamp(2.6rem,8vw,6.5rem)] text-bone">
            The City Needs
            <br />
            <span className="text-signal">Better Interfaces.</span>
          </h2>
          <p className="mx-auto mt-8 max-w-lg leading-relaxed text-bone/85">
            {contact.blurb}
          </p>
        </Reveal>

        <Annotation
          id="contact"
          className="absolute left-6 top-0 text-left sm:left-10"
        />

        <Reveal delay={0.15}>
          <div className="mt-12">
            <MagneticButton>
              <CursorZone variant="link">
                <a
                  href={`mailto:${contact.email}`}
                  className="inline-block border-2 border-signal bg-signal/5 px-10 py-5 font-mono text-sm tracking-[0.25em] text-signal shadow-[0_0_50px_-10px_rgba(245,178,26,0.45)] transition-colors duration-300 hover:bg-signal hover:text-void"
                >
                  {contact.email.toUpperCase()}
                </a>
              </CursorZone>
            </MagneticButton>
          </div>
        </Reveal>

        <Reveal delay={0.25}>
          <ul className="mt-14 flex flex-wrap justify-center gap-x-10 gap-y-4 font-mono text-xs tracking-[0.25em]">
            {contact.socials.map((s) => (
              <li key={s.label}>
                <a
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link-wipe text-ash hover:text-bone"
                >
                  {s.label.toUpperCase()} ↗
                </a>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
