"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useNoir } from "@/lib/store";
import { profile } from "@/lib/content";
import BatMark from "./BatMark";

/**
 * One-shot ignition: a beam of amber light sweeps up and "lights" the night
 * mark in fog, then dissolves into the hero. Session-gated, skippable by
 * click or any key. SiteShell skips mounting it entirely for reduced motion.
 */
export default function BootSequence() {
  const setBootDone = useNoir((s) => s.setBootDone);
  const [show, setShow] = useState(false);

  useEffect(() => {
    let seen = false;
    try {
      seen = sessionStorage.getItem("noir-boot") === "1";
    } catch {
      /* ignore */
    }
    // Reduced motion: no ignition — straight to the (fully lit) site.
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (seen || reduced) {
      setBootDone(true);
      return;
    }
    setShow(true);

    const finish = () => {
      try {
        sessionStorage.setItem("noir-boot", "1");
      } catch {
        /* ignore */
      }
      setShow(false);
      setBootDone(true);
    };

    // Shorter ignition on touch devices.
    const coarse = window.matchMedia("(pointer: coarse)").matches;
    const timer = setTimeout(finish, coarse ? 1500 : 2400);
    const skip = () => {
      clearTimeout(timer);
      finish();
    };
    window.addEventListener("pointerdown", skip);
    window.addEventListener("keydown", skip);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("pointerdown", skip);
      window.removeEventListener("keydown", skip);
    };
  }, [setBootDone]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 z-[90] flex items-center justify-center overflow-hidden bg-void"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.7, ease: "easeInOut" }}
          aria-hidden
        >
          {/* rising beam */}
          <motion.div
            className="absolute bottom-0 left-1/2 h-[140vh] w-[46vw] -translate-x-1/2 origin-bottom"
            style={{
              background:
                "conic-gradient(from 180deg at 50% 100%, transparent 41%, rgba(245,178,26,0.16) 48%, rgba(255,210,74,0.28) 50%, rgba(245,178,26,0.16) 52%, transparent 59%)",
            }}
            initial={{ opacity: 0, scaleY: 0.2 }}
            animate={{ opacity: 1, scaleY: 1 }}
            transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
          />
          {/* the mark, ignited by the beam */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92, filter: "blur(8px)" }}
            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            transition={{ delay: 0.7, duration: 0.9, ease: "easeOut" }}
            className="relative"
          >
            <BatMark className="w-40 text-signal drop-shadow-[0_0_28px_rgba(245,178,26,0.5)] sm:w-56" />
          </motion.div>
          {/* boot text */}
          <motion.p
            className="absolute bottom-10 font-mono text-[10px] tracking-[0.4em] text-ash"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
          >
            {profile.name.toUpperCase()} — CASE ARCHIVE · CLICK TO SKIP
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
