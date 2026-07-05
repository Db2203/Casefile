"use client";

import { useEffect, useRef } from "react";
import { useNoir } from "@/lib/store";
import { audioEngine } from "@/lib/audio/AudioEngine";

/**
 * Rare sheet lightning behind the city: JS-scheduled (random 20–45s, skipped
 * while the tab is hidden), animating OPACITY ONLY on a statically-painted
 * cold-flash gradient — zero work between strikes. Sits just below the rain
 * so drops glint over the flash. Light-then-sound: thunder follows ~2s later
 * when ambient audio is on.
 */
export default function SheetLightning() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let timer: ReturnType<typeof setTimeout>;

    const schedule = () => {
      timer = setTimeout(fire, 20_000 + Math.random() * 25_000);
    };
    const fire = () => {
      if (document.hidden) {
        schedule();
        return;
      }
      el.classList.remove("lightning-strike");
      // restart the animation reliably
      void el.offsetWidth;
      el.classList.add("lightning-strike");
      if (useNoir.getState().soundOn) {
        audioEngine.thunder(1.5 + Math.random() * 1.5);
      }
      schedule();
    };
    const onEnd = () => el.classList.remove("lightning-strike");

    el.addEventListener("animationend", onEnd);
    schedule();
    return () => {
      clearTimeout(timer);
      el.removeEventListener("animationend", onEnd);
    };
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden
      className="lightning-layer pointer-events-none fixed inset-0 z-[39]"
    />
  );
}
