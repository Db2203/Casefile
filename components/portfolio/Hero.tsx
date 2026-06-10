"use client";

import { useEffect, useState } from "react";
import {
  animate,
  motion,
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
 * The hero renders fully lit; on capable devices a near-black shroud with a
 * flashlight hole covers it. After the boot, the beam runs ONE slow sweep
 * across the headline (so it's guaranteed to be read), then hands control to
 * the cursor. Hold the mouse down to widen the beam. "LIGHTS ON" opts out.
 *
 * Perf: the shroud is a huge gradient layer moved with transform only
 * (composite-only — no per-frame gradient repaint). The hole radius is
 * animated by scaling the layer.
 *
 * Mobile / reduced-motion / SSR / crawlers: no shroud — fully lit, real HTML.
 */

// Gradient hole base radius in px at scale=1; effective radius = scale * R.
const HOLE_R = 400;
const REST_SCALE = 0.5; // ~200px beam
const WIDE_SCALE = 1.05; // while pointer held
const SWEEP_SCALE = 0.68; // during the intro sweep

export default function Hero() {
  const { canEnhance } = useMediaPreferences();
  const reduced = useReducedMotion();
  const bootDone = useNoir((s) => s.bootDone);
  const [lightsOn, setLightsOn] = useState(false);

  // Light target (set by sweep choreography, then by the pointer).
  const tx = useMotionValue(-600);
  const ty = useMotionValue(-600);
  const lx = useSpring(tx, { stiffness: 140, damping: 22, mass: 0.8 });
  const ly = useSpring(ty, { stiffness: 140, damping: 22, mass: 0.8 });
  const tScale = useMotionValue(REST_SCALE);
  const s = useSpring(tScale, { stiffness: 160, damping: 26 });

  const flashlightActive = canEnhance && !lightsOn;

  useEffect(() => {
    if (!flashlightActive) return;

    const unbindPointer = bindPointer();
    const subs: (() => void)[] = [() => unbindPointer()];
    let handedOver = false;

    const handOverToPointer = () => {
      if (handedOver) return;
      handedOver = true;
      tScale.set(REST_SCALE);
      tx.set(pointerX.get());
      ty.set(pointerY.get());
      subs.push(pointerX.on("change", (v) => tx.set(v)));
      subs.push(pointerY.on("change", (v) => ty.set(v)));
    };

    // Beam widens while pointer is held (only once the user has control).
    const down = () => {
      if (handedOver) tScale.set(WIDE_SCALE);
    };
    const up = () => {
      if (handedOver) tScale.set(REST_SCALE);
    };
    window.addEventListener("pointerdown", down);
    window.addEventListener("pointerup", up);
    subs.push(() => {
      window.removeEventListener("pointerdown", down);
      window.removeEventListener("pointerup", up);
    });

    // One cinematic sweep across the headline per session; any pointer
    // movement cancels it and gives the visitor the light immediately.
    let swept = true;
    try {
      swept = sessionStorage.getItem("noir-sweep") === "1";
    } catch {
      /* ignore */
    }

    if (swept || !bootDone) {
      if (bootDone) handOverToPointer();
      return () => subs.forEach((fn) => fn());
    }

    const w = window.innerWidth;
    const h = window.innerHeight;
    const markSwept = () => {
      try {
        sessionStorage.setItem("noir-sweep", "1");
      } catch {
        /* ignore */
      }
    };

    tx.set(w * 0.04);
    ty.set(h * 0.34);
    tScale.set(SWEEP_SCALE);
    const sweepX = animate(tx, [w * 0.04, w * 0.66], {
      duration: 2.4,
      ease: "easeInOut",
    });
    const sweepY = animate(ty, [h * 0.34, h * 0.62], {
      duration: 2.4,
      ease: "easeInOut",
    });
    sweepX.then(() => {
      markSwept();
      handOverToPointer();
    });

    const cancelSweep = () => {
      sweepX.stop();
      sweepY.stop();
      markSwept();
      handOverToPointer();
    };
    window.addEventListener("pointermove", cancelSweep, { once: true });
    subs.push(() => {
      window.removeEventListener("pointermove", cancelSweep);
      sweepX.stop();
      sweepY.stop();
    });

    return () => subs.forEach((fn) => fn());
  }, [flashlightActive, bootDone, tx, ty, tScale]);

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
      <div className="relative z-40 flex flex-wrap items-center justify-between gap-y-3 px-6 pt-6 font-mono text-[10px] tracking-[0.3em] text-ash sm:px-10">
        <span className="text-bone">{profile.name.toUpperCase()}</span>
        <span className="stamp order-2 text-signal md:order-3">
          {profile.status}
        </span>
        <nav
          className="order-3 flex w-full justify-center gap-5 md:order-2 md:w-auto md:gap-7"
          aria-label="Sections"
        >
          <a href="#work" className="link-wipe">CASES</a>
          <a href="#about" className="link-wipe">DOSSIER</a>
          <a href="#playground" className="link-wipe">WORKSHOP</a>
          <a href="#contact" className="link-wipe">SIGNAL</a>
        </nav>
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
          className="absolute inset-0 z-30 overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: show ? 1 : 0 }}
          transition={{ duration: 1.2, delay: 0.7 }}
        >
          {/* huge gradient layer moved with transform only (composite-only) */}
          <motion.div
            className="absolute left-0 top-0"
            style={{
              x: lx,
              y: ly,
              scale: s,
              translateX: "-50%",
              translateY: "-50%",
              // big enough that even at REST_SCALE (0.5) the layer covers the
              // viewport diagonal with the hole at any corner, incl. 4K
              width: "500vmax",
              height: "500vmax",
              willChange: "transform",
              backgroundImage: `radial-gradient(circle ${HOLE_R}px at center, transparent 0%, rgba(5,5,7,0.55) 45%, rgba(5,5,7,0.8) 80%, rgba(5,5,7,0.8) 100%)`,
            }}
          />
        </motion.div>
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
