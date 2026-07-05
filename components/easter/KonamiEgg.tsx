"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useNoir } from "@/lib/store";
import BatMark from "@/components/atmosphere/BatMark";

const KONAMI = [
  "arrowup", "arrowup", "arrowdown", "arrowdown",
  "arrowleft", "arrowright", "arrowleft", "arrowright", "b", "a",
];
const WORD = "batman";

/**
 * The signal fires when: you type "batman", enter the Konami code, or any
 * surface calls store.fireSignal() (single firing path via signalNonce).
 */
export default function KonamiEgg() {
  const [fired, setFired] = useState(false);
  const nonce = useNoir((s) => s.signalNonce);
  const fireSignal = useNoir((s) => s.fireSignal);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // one-shot event: react to nonce increments
  useEffect(() => {
    if (nonce === 0) return;
    setFired(true);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setFired(false), 4200);
  }, [nonce]);

  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    [],
  );

  useEffect(() => {
    let wordBuf = "";
    let codeIdx = 0;

    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null;
      if (t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.isContentEditable))
        return;
      const k = e.key.toLowerCase();

      codeIdx = k === KONAMI[codeIdx] ? codeIdx + 1 : k === KONAMI[0] ? 1 : 0;
      if (k.length === 1) {
        wordBuf = (wordBuf + k).slice(-WORD.length);
      }

      if (codeIdx === KONAMI.length || wordBuf === WORD) {
        codeIdx = 0;
        wordBuf = "";
        fireSignal();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [fireSignal]);

  return (
    <AnimatePresence>
      {fired && (
        <motion.div
          className="pointer-events-none fixed inset-0 z-[85] flex items-center justify-center overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.8 } }}
          aria-hidden
        >
          {/* sky wash */}
          <div className="absolute inset-0 bg-[radial-gradient(60%_60%_at_50%_38%,rgba(245,178,26,0.16),transparent_70%)]" />
          {/* sweeping beam */}
          <motion.div
            className="signal-beam absolute bottom-[-20vh] left-1/2 h-[150vh] w-[40vw] -translate-x-1/2 origin-bottom opacity-80"
            initial={{ rotate: -24 }}
            animate={{ rotate: [-24, 14, -6, 0] }}
            transition={{ duration: 2.2, ease: "easeInOut" }}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.9, duration: 0.7 }}
            className="relative flex flex-col items-center gap-6"
          >
            <BatMark className="w-44 text-signal drop-shadow-[0_0_36px_rgba(245,178,26,0.6)]" />
            <p className="font-mono text-[11px] tracking-[0.4em] text-signal">
              YOU FOUND THE SIGNAL — WE&apos;LL BE IN TOUCH.
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
