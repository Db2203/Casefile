import Link from "next/link";
import { projects } from "@/lib/content";

/** Prev/next dossier tabs (wrapping). */
export default function CaseNav({ currentId }: { currentId: string }) {
  const idx = projects.findIndex((p) => p.id === currentId);
  const prev = projects[(idx - 1 + projects.length) % projects.length];
  const next = projects[(idx + 1) % projects.length];

  return (
    <nav
      aria-label="Adjacent cases"
      className="mt-24 grid gap-4 border-t border-slate/40 pt-10 sm:grid-cols-2"
    >
      <Link
        href={`/case/${prev.id}`}
        className="group border border-slate/70 bg-coal/40 p-5 transition-colors hover:border-signal/60"
      >
        <p className="mb-1 font-mono text-[10px] tracking-[0.3em] text-ash">
          ← PREVIOUS CASE
        </p>
        <p className="display text-2xl text-bone transition-colors group-hover:text-signal-hot">
          #{prev.caseNo} {prev.title}
        </p>
      </Link>
      <Link
        href={`/case/${next.id}`}
        className="group border border-slate/70 bg-coal/40 p-5 text-right transition-colors hover:border-signal/60"
      >
        <p className="mb-1 font-mono text-[10px] tracking-[0.3em] text-ash">
          NEXT CASE →
        </p>
        <p className="display text-2xl text-bone transition-colors group-hover:text-signal-hot">
          #{next.caseNo} {next.title}
        </p>
      </Link>
    </nav>
  );
}
