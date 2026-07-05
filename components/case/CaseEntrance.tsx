"use client";

import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

/**
 * "Declassify" entrance: staggered redaction bars slide off the page on
 * mount — extends the site's redaction motif, compositor-only (scaleX),
 * and fires on direct loads too (unlike view transitions). The content
 * beneath is server-rendered; the bars are only an overlay.
 */
export default function CaseEntrance({ children }: { children: ReactNode }) {
  const reduced = useReducedMotion();
  if (reduced) return <>{children}</>;

  return (
    <div className="relative">
      {children}
      <div className="pointer-events-none absolute inset-0 z-40 flex flex-col">
        {Array.from({ length: 5 }, (_, i) => (
          <motion.div
            key={i}
            className="w-full flex-1 origin-right bg-coal"
            initial={{ scaleX: 1 }}
            animate={{ scaleX: 0 }}
            transition={{
              duration: 0.55,
              delay: 0.08 * i,
              ease: [0.76, 0, 0.24, 1],
            }}
          />
        ))}
      </div>
    </div>
  );
}
