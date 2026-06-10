"use client";

import type { ReactNode } from "react";
import { useCursor, type CursorVariant } from "./CursorProvider";

/**
 * Declarative cursor-variant region: wrap any element and the custom cursor
 * morphs while the pointer is inside. No per-element boilerplate.
 */
export default function CursorZone({
  variant,
  label,
  className,
  children,
}: {
  variant: CursorVariant;
  label?: string;
  className?: string;
  children: ReactNode;
}) {
  const { set, reset } = useCursor();
  return (
    <div
      className={className}
      onPointerEnter={() => set(variant, label)}
      onPointerLeave={reset}
    >
      {children}
    </div>
  );
}
