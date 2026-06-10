"use client";

import { useEffect, useState } from "react";
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from "motion/react";
import { bindPointer, pointerX, pointerY } from "@/components/cursor/pointer";
import { useMediaPreferences } from "@/lib/useMediaPreferences";
import { useNoir } from "@/lib/store";
import { hero, profile } from "@/lib/content";
import BatMark from "@/components/atmosphere/BatMark";
import { SkylineFar, SkylineNear } from "@/components/atmosphere/Skyline";
import Annotation from "@/components/detective/Annotation";

/**
 * THE SIGNATURE — "detective in the dark."
 * The hero renders fully lit, then (on capable devices) a near-black shroud
 * with a flashlight hole bound to the cursor's motion values covers it.
 * Move the light to read. Hold the mouse down to widen the beam.
 * Mobile / reduced-motion / SSR / crawlers: no shroud — fully lit, real HTML.
 */
export default function Hero() {
  const { canEnhance } = useMediaPreferences();
  const reduced = useReducedMotion();
  const bootDone = useNoir((s) => s.bootDone);
  const [lightsOn, setLightsOn] = useState(false);

  // Flashlight position: looser spring than the cursor dot → the light lags
  // like a real handheld beam.
  const lx = useSpring(pointerX, { stiffness: 140, damping: 22, mass: 0.8 });
  const ly = useSpring(pointerY, { stiffness: 140, damping: 22, mass: 0.8 });
  // Beam radius widens while the pointer is held down.
  const radius = useMotionValue(260);
  const r = useSpring(radius, { stiffness: 180, damping: 24 });

  // Outside the beam stays moody but READABLE — never pitch black.
  const shroud = useMotionTemplate`radial-gradient(circle ${r}px at ${lx}px ${ly}px, transparent 0%, rgba(5,5,7,0.55) 45%, rgba(5,5,7,0.8) 80%)`;

  const flashlightActive = canEnhance && !lightsOn;

  useEffect(() => {
    if (!flashlightActive) return;
    const unbind = bindPointer();
    const down = () => radius.set(400);
    const up = () => radius.set(260);
    window.addEventListener("pointerdown", down);
    window.addEventListener("pointerup", up);
    return () => {
      unbind();
      window.removeEventListener("pointerdown", down);
      window.removeEventListener("pointerup", up);
    };
  }, [flashlightActive, radius]);

  const show = bootDone || reduced;

  return (
    <header
      id="top"
      className="relative flex min-h-screen flex-col justify-between overflow-hidden"
    >
      {/* ── lit scene (under the shroud) ─────────────────────────── */}

      {/* faint watermark mark behind the headline — upper-right, balanced against the headline block */}
      <BatMark className="pointer-events-none absolute right-[5%] top-[20%] w-[42vw] max-w-xl text-coal" />

      {/* skyline at the bottom edge */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0">
        <SkylineFar className="absolute bottom-0 h-44 w-full text-[#0d0d13]" />
        <SkylineNear className="relative h-36 w-full text-[#101016]" />
      </div>

      {/* fog */}
      <div
        aria-hidden
        className="fog-band bottom-10 left-[-10%] h-44 w-[70%] bg-[#1a1b26]/50"
      />
      <div
        aria-hidden
        className="fog-band bottom-24 right-[-15%] h-36 w-[60%] bg-[#15161f]/60"
        style={{ animationDelay: "-14s" }}
      />

      {/* top bar — above the shroud so it's always readable */}
      <div className="relative z-40 flex items-center justify-between px-6 pt-6 font-mono text-[10px] tracking-[0.3em] text-ash sm:px-10">
        <span className="text-bone">{profile.name.toUpperCase()}</span>
        <nav className="hidden gap-7 md:flex" aria-label="Sections">
          <a href="#work" className="link-wipe">CASES</a>
          <a href="#about" className="link-wipe">DOSSIER</a>
          <a href="#playground" className="link-wipe">WORKSHOP</a>
          <a href="#contact" className="link-wipe">SIGNAL</a>
        </nav>
        <span className="stamp text-signal">{profile.status}</span>
      </div>

      {/* headline block */}
      <div className="relative z-10 px-6 pb-40 pt-10 sm:px-10">
        <motion.p
          initial={reduced ? false : { opacity: 0, y: 14 }}
          animate={show ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-6 font-mono text-[11px] tracking-[0.35em] text-signal"
        >
          {hero.kicker}
        </motion.p>

        <h1 className="display text-[clamp(3.2rem,12.5vw,11rem)] text-bone">
          {hero.lines.map((line, i) => (
            <motion.span
              key={line}
              className="block"
              initial={reduced ? false : { opacity: 0, y: 40 }}
              animate={show ? { opacity: 1, y: 0 } : {}}
              transition={{
                duration: 0.8,
                delay: 0.15 + i * 0.12,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              {i === hero.lines.length - 1 ? (
                <span className="text-signal">{line}</span>
              ) : (
                line
              )}
            </motion.span>
          ))}
        </h1>

        <motion.p
          initial={reduced ? false : { opacity: 0, y: 18 }}
          animate={show ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.55 }}
          className="mt-8 max-w-md text-base leading-relaxed text-bone/90 sm:text-lg"
        >
          {hero.sub}
        </motion.p>
      </div>

      <Annotation id="hero" className="absolute left-6 top-24 sm:left-10" />

      {/* ── the shroud (flashlight mask) ─────────────────────────── */}
      {flashlightActive && (
        <motion.div
          aria-hidden
          className="absolute inset-0 z-30"
          style={{ backgroundImage: shroud, willChange: "background-image" }}
          initial={{ opacity: 0 }}
          animate={{ opacity: show ? 1 : 0 }}
          transition={{ duration: 1.4, delay: 0.9 }}
        />
      )}

      {/* ── always-above-the-dark UI ─────────────────────────────── */}
      <div className="absolute inset-x-0 bottom-6 z-40 flex items-end justify-between px-6 sm:px-10">
        <p className="font-mono text-[10px] tracking-[0.3em] text-ash">
          {flashlightActive ? hero.hint.toUpperCase() : "SCROLL TO DESCEND ↓"}
        </p>
        {canEnhance && (
          <button
            onClick={() => setLightsOn((v) => !v)}
            className="rounded-sm border border-slate bg-void/60 px-3 py-2 font-mono text-[10px] tracking-[0.25em] text-ash backdrop-blur transition-colors hover:border-signal hover:text-signal"
          >
            {lightsOn ? "LIGHTS OFF" : "LIGHTS ON"}
          </button>
        )}
      </div>
    </header>
  );
}
