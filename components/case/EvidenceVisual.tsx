import type { EvidenceKind } from "@/lib/content";
import EvidencePlaceholder from "./EvidencePlaceholder";

/**
 * One evidence visual: the real screenshot when it exists (resolved
 * server-side by lib/assets.ts and passed down), otherwise the seeded
 * procedural placeholder art. Consistent 4:3 crop either way.
 */
export default function EvidenceVisual({
  seed,
  kind,
  image,
  alt,
  className,
}: {
  seed: string;
  kind: EvidenceKind;
  image?: string | null;
  alt?: string;
  className?: string;
}) {
  if (image) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={image}
        alt={alt ?? ""}
        loading="lazy"
        className={`aspect-[4/3] w-full object-cover ${className ?? ""}`}
      />
    );
  }
  return (
    <EvidencePlaceholder seed={seed} kind={kind} className={className} />
  );
}
