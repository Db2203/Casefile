"use client";

import { AnimatePresence, motion } from "motion/react";
import { useNoir } from "@/lib/store";
import { annotations } from "@/lib/content";

/**
 * A scan-mode annotation chip. Sections (server components) drop one in;
 * it renders only while Detective Mode is active.
 */
export default function Annotation({
  id,
  className,
}: {
  id: keyof typeof annotations | string;
  className?: string;
}) {
  const detectiveMode = useNoir((s) => s.detectiveMode);
  const text = annotations[id];
  if (!text) return null;

  return (
    <AnimatePresence>
      {detectiveMode && (
        <motion.aside
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 8 }}
          transition={{ duration: 0.3 }}
          className={`pointer-events-none z-30 max-w-xs border-l-2 border-scan bg-void/85 p-3 font-mono text-[10px] leading-relaxed tracking-wide text-scan backdrop-blur ${className ?? ""}`}
        >
          <span className="mb-1 block text-[9px] tracking-[0.3em] opacity-70">
            ▸ SCAN — HOW IT&apos;S BUILT
          </span>
          {text}
        </motion.aside>
      )}
    </AnimatePresence>
  );
}
