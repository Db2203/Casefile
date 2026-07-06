import Link from "next/link";
import type { Project } from "@/lib/content";

/** Sticky dossier header (sticky, not fixed — Lenis-safe inside content). */
export default function CaseHeader({ project }: { project: Project }) {
  return (
    <header className="sticky top-0 z-30 border-b border-slate/40 bg-void/85 backdrop-blur">
      <div className="mx-auto flex max-w-4xl items-center justify-between gap-4 px-6 py-4 font-mono text-[10px] tracking-[0.25em] text-ash sm:px-10">
        <Link href="/#work" className="link-wipe shrink-0 text-bone">
          ← ALL CASES
        </Link>
        <span className="hidden truncate sm:block">
          CASE #{project.caseNo} · {project.title}
        </span>
        <span className="stamp shrink-0 text-signal">{project.status}</span>
      </div>
    </header>
  );
}
