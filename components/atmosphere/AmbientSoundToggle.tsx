"use client";

import { useEffect, useRef, useState } from "react";
import { useNoir } from "@/lib/store";
import { audioEngine } from "@/lib/audio/AudioEngine";

/**
 * Opt-in ambient rain/thunder. The engine reacts to the store's `soundOn`
 * (so the palette can toggle it too — zustand notifies synchronously, which
 * keeps AudioContext creation inside the user-gesture call stack).
 *
 * Autoplay honesty: a persisted "on" preference cannot auto-start audio —
 * it shows as ARMED and engages on the visitor's first interaction.
 */
export default function AmbientSoundToggle() {
  const soundOn = useNoir((s) => s.soundOn);
  const setSound = useNoir((s) => s.setSound);
  const [armed, setArmed] = useState(false);
  const hydrated = useRef(false);

  // engine follows the store (from ANY toggle surface)
  useEffect(() => {
    if (soundOn) {
      void audioEngine.start();
      setArmed(false);
    } else if (audioEngine.running) {
      audioEngine.stop();
    }
    if (hydrated.current) {
      try {
        localStorage.setItem("noir-sound", soundOn ? "1" : "0");
      } catch {
        /* ignore */
      }
    }
  }, [soundOn]);

  // restore preference: can't auto-start (autoplay policy) — arm instead
  useEffect(() => {
    hydrated.current = true;
    let pref = false;
    try {
      pref = localStorage.getItem("noir-sound") === "1";
    } catch {
      /* ignore */
    }
    if (!pref) return;
    setArmed(true);
    const engage = () => {
      setArmed(false);
      setSound(true); // gesture-blessed: listener runs inside the event
    };
    window.addEventListener("pointerdown", engage, { once: true });
    window.addEventListener("keydown", engage, { once: true });
    return () => {
      window.removeEventListener("pointerdown", engage);
      window.removeEventListener("keydown", engage);
    };
  }, [setSound]);

  const label = soundOn ? "◉ SND: RAIN" : armed ? "◎ SND: ARMED" : "○ SND: OFF";

  return (
    <button
      onClick={() => {
        setArmed(false);
        setSound(!soundOn);
      }}
      aria-pressed={soundOn}
      className={`rounded-sm border px-3 py-2 font-mono text-[10px] tracking-[0.25em] backdrop-blur transition-colors ${
        soundOn
          ? "border-signal/70 bg-signal/10 text-signal"
          : "border-slate bg-void/60 text-ash hover:border-ash hover:text-bone"
      }`}
    >
      {label}
    </button>
  );
}
