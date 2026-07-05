import { existsSync } from "fs";
import path from "path";

/**
 * Build-time asset detection (SERVER ONLY — uses fs; never import from a
 * "use client" file). Pages are statically generated, so these checks run
 * at build time and cost nothing at runtime.
 *
 * Drop-in upgrades for the owner:
 *  - Real evidence screenshot:  public/evidence/{projectId}-{evidenceId}.png
 *    (also .jpg/.jpeg/.webp) — that exhibit automatically shows the real
 *    image instead of the procedural placeholder art.
 *  - Resume:  public/dossier.pdf — the "FULL DOSSIER (PDF)" button appears.
 */

const EXTS = ["png", "jpg", "jpeg", "webp"] as const;

export function evidenceImage(
  projectId: string,
  evidenceId: string,
): string | null {
  for (const ext of EXTS) {
    const rel = `evidence/${projectId}-${evidenceId}.${ext}`;
    if (existsSync(path.join(process.cwd(), "public", rel))) {
      return `/${rel}`;
    }
  }
  return null;
}

export function dossierPdfUrl(): string | null {
  // Preferred: an externally-hosted CV (Vercel Blob / Drive) via env var —
  // the PDF never enters the public repo. Fallback: a local public/dossier.pdf.
  return (
    process.env.NEXT_PUBLIC_DOSSIER_URL ??
    (existsSync(path.join(process.cwd(), "public", "dossier.pdf"))
      ? "/dossier.pdf"
      : null)
  );
}
