"use client";

import { useEffect, useRef, useState } from "react";
import CursorZone from "@/components/cursor/CursorZone";

/**
 * Clipboard fallback beside the mailto CTA — many visitors (esp. on work
 * machines) have no mail client configured, so mailto alone is a dead end.
 */
export default function CopyEmail({ email }: { email: string }) {
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    [],
  );

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard unavailable — the mailto CTA still works */
    }
  };

  return (
    <CursorZone variant="link" className="inline-block">
      <button
        onClick={copy}
        aria-live="polite"
        className={`border px-5 py-5 font-mono text-xs tracking-[0.25em] transition-colors duration-300 ${
          copied
            ? "border-signal text-signal"
            : "border-slate text-ash hover:border-signal hover:text-signal"
        }`}
      >
        {copied ? "COPIED ✓" : "COPY EMAIL"}
      </button>
    </CursorZone>
  );
}
