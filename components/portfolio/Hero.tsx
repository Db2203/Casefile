"use client";

import { useEffect } from "react";
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
import { hero } from "@/lib/content";
import BatMark from "@/components/atmosphere/BatMark";
import { SkylineFar, SkylineNear } from "@/components/atmosphere/Skyline";
import Annotation from "@/components/detective/Annotation";

/**
 * THE SIGNATURE — "detective in the dark."
 * The hero renders fully lit; on capable devices a near-black shroud with a
 * flashlight hole covers it. After the boot, the beam runs ONE slow sweep
 * across the headline (so it's guaranteed to be read), then hands control to
 * the cursor. Hold the mouse down to widen the beam. "LIGHTS ON" opts out
 * (state lives in the store so the command palette can toggle it too).
 *
 * Perf: the shroud is a large gradient layer moved with transform only
 * (composite-only — no per-frame gradient repaint); hole radius animates by
 * scaling the layer. Mobile / reduced-motion / SSR: no shroud, fully lit.
 */

// Gradient hole radius in px at scale=1; effective radius = scale * R.
const HOLE_R = 200;
const REST_SCALE = 1.0; // ~200px beam
const WIDE_SCALE = 2.1; // while pointer held
const SWEEP_SCALE = 1.36; // during the intro sweep

// Module-scope session flags: survive re-mounts, and act as the fallback when
// sessionStorage is unavailable (privacy modes must still get the sweep once).
let sweptFallback = false;
let shroudShownOnce = false;

function readSwept(): boolean {
  try {
    // storage is the source of truth (lets "replay boot" reset the sweep)
    return sessionStorage.getItem("noir-sweep") === "1";
  } catch {
    return sweptFallback;
  }
}
function markSwept() {
  try {
    sessionStorage.setItem("noir-sweep", "1");
  } catch {
    sweptFallback = true;
  }
}

export default function Hero() {
  const { canEnhance, isCoarseTouch } = useMediaPreferences();
  const reduced = useReducedMotion();
  const bootDone = useNoir((s) => s.bootDone);
  const lightsOn = useNoir((s) => s.lightsOn);
  const toggleLights = useNoir((s) => s.toggleLights);

  // Light target (set by sweep choreography, the pointer, or the auto-roam).
  const tx = useMotionValue(-600);
  const ty = useMotionValue(-600);
  const lx = useSpring(tx, { stiffness: 140, damping: 22, mass: 0.8 });
  const ly = useSpring(ty, { stiffness: 140, damping: 22, mass: 0.8 });
  const tScale = useMotionValue(REST_SCALE);
  const s = useSpring(tScale, { stiffness: 160, damping: 26 });

  // pointer → desktop (sweep, then cursor control)
  // auto    → touch devices: the beam roams on its own; hold to widen
  // off     → reduced motion / LIGHTS ON
  const flashlightMode: "pointer" | "auto" | "off" = lightsOn
    ? "off"
    : canEnhance
      ? "pointer"
      : isCoarseTouch
        ? "auto"
        : "off";
  const flashlightActive = flashlightMode !== "off";
  // Captured at render: first-ever shroud mount gets the slow cinematic fade,
  // re-mounts (LIGHTS toggling) get a quick one.
  const quickFade = shroudShownOnce;

  // AUTO mode: slow lissajous drift across the headline area.
  useEffect(() => {
    if (flashlightMode !== "auto" || !bootDone) return;
    shroudShownOnce = true;
    const w = window.innerWidth;
    const h = window.innerHeight;
    tx.set(w * 0.25);
    ty.set(h * 0.35);
    tScale.set(SWEEP_SCALE);
    const driftX = animate(tx, [w * 0.12, w * 0.85], {
      duration: 11,
      repeat: Infinity,
      repeatType: "mirror",
      ease: "easeInOut",
    });
    const driftY = animate(ty, [h * 0.22, h * 0.72], {
      duration: 7.3,
      repeat: Infinity,
      repeatType: "mirror",
      ease: "easeInOut",
    });
    // tap-and-hold widens the beam
    const down = () => tScale.set(WIDE_SCALE);
    const up = () => tScale.set(SWEEP_SCALE);
    window.addEventListener("pointerdown", down);
    window.addEventListener("pointerup", up);
    window.addEventListener("pointercancel", up);
    return () => {
      driftX.stop();
      driftY.stop();
      window.removeEventListener("pointerdown", down);
      window.removeEventListener("pointerup", up);
      window.removeEventListener("pointercancel", up);
    };
  }, [flashlightMode, bootDone, tx, ty, tScale]);

  // POINTER mode: one-shot sweep, then the cursor takes the light.
  useEffect(() => {
    if (flashlightMode !== "pointer") return;
    shroudShownOnce = true;

    const unbindPointer = bindPointer();
    const subs: (() => void)[] = [() => unbindPointer()];
    let handedOver = false;
    let sweepStarted = false;
    let cancelled = false; // teardown guard: stopped animations resolve their
    // promise, so .then() callbacks can fire AFTER cleanup — never hand over then

    const handOverToPointer = () => {
      if (handedOver || cancelled) return;
      handedOver = true;
      tScale.set(REST_SCALE);
      // pointer hasn't moved yet (returning visitor)? light the headline
      if (pointerX.get() < 0) {
        tx.set(window.innerWidth * 0.32);
        ty.set(window.innerHeight * 0.45);
      } else {
        tx.set(pointerX.get());
        ty.set(pointerY.get());
      }
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
    window.addEventListener("pointercancel", up);
    subs.push(() => {
      cancelled = true;
      window.removeEventListener("pointerdown", down);
      window.removeEventListener("pointerup", up);
      window.removeEventListener("pointercancel", up);
    });

    // One cinematic sweep across the headline per session; any pointer
    // movement cancels it and gives the visitor the light immediately.
    if (readSwept() || !bootDone) {
      if (bootDone) handOverToPointer();
      return () => subs.forEach((fn) => fn());
    }

    const w = window.innerWidth;
    const h = window.innerHeight;
    sweepStarted = true;

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
      // LIGHTS ON (or unmount) mid-sweep counts as seen — never restart it.
      // EXCEPT during a boot replay (bootDone was just reset), where the
      // whole point is to re-run the choreography.
      if (sweepStarted && useNoir.getState().bootDone) markSwept();
    });

    return () => subs.forEach((fn) => fn());
  }, [flashlightMode, bootDone, tx, ty, tScale]);

  const show = bootDone || reduced;

  return (
    <section
      id="top"
      aria-label="Intro"
      className="relative flex min-h-[100svh] flex-col justify-center overflow-hidden"
    >
      {/* ── lit scene (under the shroud) ─────────────────────────── */}

      {/* faint watermark mark behind the headline — upper-right, balanced against the headline block */}
      <BatMark className="pointer-events-none absolute right-[5%] top-[14%] w-[60vw] max-w-xl text-coal sm:top-[20%] sm:w-[42vw]" />

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

      {/* headline block */}
      <div className="relative z-10 px-6 pb-24 pt-28 sm:px-10">
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
          transition={
            quickFade
              ? { duration: 0.35 }
              : { duration: 1.2, delay: 0.7 }
          }
        >
          {/* large gradient layer moved with transform only (composite-only);
              at REST_SCALE=1 the 260vmax layer still covers the viewport
              diagonal (≈1.15·vmax) with the hole at any corner */}
          <motion.div
            className="absolute left-0 top-0"
            style={{
              x: lx,
              y: ly,
              scale: s,
              translateX: "-50%",
              translateY: "-50%",
              width: "260vmax",
              height: "260vmax",
              willChange: "transform",
              backgroundImage: `radial-gradient(circle ${HOLE_R}px at center, transparent 0%, rgba(5,5,7,0.55) 45%, rgba(5,5,7,0.8) 80%, rgba(5,5,7,0.8) 100%)`,
            }}
          />
        </motion.div>
      )}

      {/* ── always-above-the-dark UI ─────────────────────────────── */}
      <div
        className="absolute inset-x-0 z-40 flex items-end justify-between gap-4 px-6 sm:px-10"
        style={{ bottom: "max(1.5rem, env(safe-area-inset-bottom))" }}
      >
        <p className="font-mono text-[10px] tracking-[0.3em] text-ash">
          {flashlightMode === "pointer"
            ? hero.hint.toUpperCase()
            : flashlightMode === "auto"
              ? "THE LIGHT ROAMS · HOLD TO WIDEN"
              : "SCROLL TO DESCEND ↓"}
        </p>
        {(canEnhance || isCoarseTouch) && (
          <button
            onClick={toggleLights}
            className="shrink-0 rounded-sm border border-slate bg-void/60 px-3 py-2 font-mono text-[10px] tracking-[0.25em] text-ash backdrop-blur transition-colors hover:border-signal hover:text-signal"
          >
            {lightsOn ? "LIGHTS OFF" : "LIGHTS ON"}
          </button>
        )}
      </div>
    </section>
  );
}
