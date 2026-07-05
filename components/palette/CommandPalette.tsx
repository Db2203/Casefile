"use client";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
} from "react";
import { usePathname, useRouter } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { useNoir } from "@/lib/store";
import { useMediaPreferences } from "@/lib/useMediaPreferences";
import { profile } from "@/lib/content";
import { fuzzyFilter } from "@/lib/fuzzy";
import { scrollToSection, setScrollLocked } from "@/lib/scroll";
import {
  buildActions,
  type PaletteAction,
  type PaletteGroup,
} from "./actions";

const GROUP_ORDER: PaletteGroup[] = ["NAVIGATE", "CASE FILES", "SYSTEMS"];

/**
 * WAYNE TERMINAL — zero-dep command palette. Ctrl/Cmd+K or "/" to open.
 * Combobox pattern: focus stays on the input; arrow keys move
 * aria-activedescendant through the option list.
 */
export default function CommandPalette() {
  const open = useNoir((s) => s.paletteOpen);
  const setOpen = useNoir((s) => s.setPaletteOpen);
  const detectiveOn = useNoir((s) => s.detectiveMode);
  const toggleDetective = useNoir((s) => s.toggleDetective);
  const lightsOn = useNoir((s) => s.lightsOn);
  const toggleLights = useNoir((s) => s.toggleLights);
  const soundOn = useNoir((s) => s.soundOn);
  const setSound = useNoir((s) => s.setSound);
  const fireSignal = useNoir((s) => s.fireSignal);
  const replayBoot = useNoir((s) => s.replayBoot);
  const { canEnhance } = useMediaPreferences();

  const router = useRouter();
  const pathname = usePathname();
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const [status, setStatus] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const prevFocus = useRef<HTMLElement | null>(null);
  const statusTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  /* ── global hotkeys ─────────────────────────────────────────── */
  useEffect(() => {
    const onKey = (e: globalThis.KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen(!useNoir.getState().paletteOpen);
        return;
      }
      if (e.key === "/" && !useNoir.getState().paletteOpen) {
        const t = e.target as HTMLElement | null;
        if (
          t &&
          (t.tagName === "INPUT" ||
            t.tagName === "TEXTAREA" ||
            t.isContentEditable)
        )
          return;
        e.preventDefault();
        setOpen(true);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [setOpen]);

  /* ── open/close side effects ────────────────────────────────── */
  useEffect(() => {
    if (open) {
      prevFocus.current = document.activeElement as HTMLElement | null;
      setScrollLocked(true);
      requestAnimationFrame(() => inputRef.current?.focus());
    } else {
      setScrollLocked(false);
      setQuery("");
      setActive(0);
      setStatus("");
      prevFocus.current?.focus?.();
    }
    return () => setScrollLocked(false);
  }, [open]);

  useEffect(
    () => () => {
      if (statusTimer.current) clearTimeout(statusTimer.current);
    },
    [],
  );

  /* ── actions ────────────────────────────────────────────────── */
  const actions = useMemo(
    () =>
      buildActions({
        goToSection: (id) => {
          if (pathname !== "/") router.push(`/#${id}`);
          else scrollToSection(id);
        },
        openCase: (id) => router.push(`/case/${id}`),
        toggleDetective,
        detectiveOn,
        toggleLights,
        lightsOn,
        canEnhance,
        copyEmail: async () => {
          try {
            await navigator.clipboard.writeText(profile.email);
            setStatus("EMAIL COPIED TO CLIPBOARD");
          } catch {
            setStatus(`EMAIL: ${profile.email.toUpperCase()}`);
          }
          if (statusTimer.current) clearTimeout(statusTimer.current);
          statusTimer.current = setTimeout(() => setStatus(""), 2200);
        },
        fireSignal,
        replayBoot,
        toggleSound: () => setSound(!soundOn),
        soundOn,
      }),
    [
      pathname,
      router,
      toggleDetective,
      detectiveOn,
      toggleLights,
      lightsOn,
      canEnhance,
      fireSignal,
      replayBoot,
      setSound,
      soundOn,
    ],
  );

  const filtered = useMemo(
    () => fuzzyFilter(query, actions, (a) => a.label),
    [query, actions],
  );
  const flat = useMemo(
    () =>
      GROUP_ORDER.flatMap((g) => filtered.filter((a) => a.group === g)),
    [filtered],
  );
  const clampedActive = Math.min(active, Math.max(0, flat.length - 1));

  useEffect(() => {
    const el = document.getElementById(
      `palette-opt-${flat[clampedActive]?.id}`,
    );
    el?.scrollIntoView({ block: "nearest" });
  }, [clampedActive, flat]);

  const execute = (action: PaletteAction) => {
    if (action.keepOpen) {
      action.run();
      return;
    }
    setOpen(false);
    // run after the close effect unlocks scrolling
    requestAnimationFrame(() => action.run());
  };

  const onInputKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Escape") {
      e.preventDefault();
      setOpen(false);
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((a) => (flat.length ? (a + 1) % flat.length : 0));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((a) => (flat.length ? (a - 1 + flat.length) % flat.length : 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      const action = flat[clampedActive];
      if (action) execute(action);
    } else if (e.key === "Tab") {
      e.preventDefault(); // single tab stop — trap on the input
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[88] flex items-start justify-center px-4 pt-[8vh] sm:pt-[14vh]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
        >
          {/* backdrop */}
          <button
            aria-label="Close terminal"
            onClick={() => setOpen(false)}
            className="absolute inset-0 cursor-default bg-void/80 backdrop-blur-sm"
          />

          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Command terminal"
            initial={{ y: -14, scale: 0.99 }}
            animate={{ y: 0, scale: 1 }}
            exit={{ y: -10, scale: 0.99 }}
            transition={{ duration: 0.18 }}
            className="relative z-10 w-full max-w-xl overflow-hidden border border-signal/40 bg-ink shadow-[0_0_80px_-20px_rgba(245,178,26,0.35)]"
            style={{
              backgroundImage:
                "repeating-linear-gradient(0deg, rgba(245,178,26,0.02) 0 1px, transparent 1px 4px)",
            }}
          >
            {/* title bar */}
            <div className="flex items-center justify-between border-b border-slate/60 bg-void/60 px-4 py-2 font-mono text-[9px] tracking-[0.3em] text-ash">
              <span>
                WAYNE TERMINAL v3.7 —{" "}
                <span className="text-signal">AUTHORIZED</span>
              </span>
              <span className="flex items-center gap-3">
                <span aria-hidden className="animate-pulse text-signal">█</span>
                {/* visible tap target for touch users */}
                <button
                  onClick={() => setOpen(false)}
                  aria-label="Close terminal"
                  className="-my-1 px-2 py-1 text-xs text-ash transition-colors hover:text-signal"
                >
                  ✕
                </button>
              </span>
            </div>

            {/* input */}
            <div className="flex items-center gap-3 border-b border-slate/60 px-4 py-3">
              <span aria-hidden className="font-mono text-sm text-signal">
                &gt;
              </span>
              <input
                ref={inputRef}
                role="combobox"
                aria-expanded="true"
                aria-controls="palette-list"
                aria-activedescendant={
                  flat[clampedActive]
                    ? `palette-opt-${flat[clampedActive].id}`
                    : undefined
                }
                aria-autocomplete="list"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setActive(0);
                }}
                onKeyDown={onInputKey}
                placeholder="TYPE A COMMAND…"
                className="w-full bg-transparent font-mono text-base tracking-[0.15em] text-bone placeholder:text-ash/50 focus:outline-none sm:text-sm"
                autoComplete="off"
                spellCheck={false}
              />
            </div>

            {/* results */}
            <div
              id="palette-list"
              role="listbox"
              aria-label="Commands"
              className="panel-scroll max-h-[46vh] overflow-y-auto py-2"
            >
              {flat.length === 0 && (
                <p className="px-4 py-6 text-center font-mono text-xs tracking-[0.25em] text-ash">
                  NO RECORDS MATCH — THE TRAIL WENT COLD
                </p>
              )}
              {GROUP_ORDER.map((group) => {
                const items = filtered.filter((a) => a.group === group);
                if (items.length === 0) return null;
                return (
                  <div key={group}>
                    <p className="px-4 pb-1 pt-3 font-mono text-[9px] tracking-[0.35em] text-ash/60">
                      {group}
                    </p>
                    {items.map((action) => {
                      const idx = flat.indexOf(action);
                      const isActive = idx === clampedActive;
                      return (
                        <div
                          key={action.id}
                          id={`palette-opt-${action.id}`}
                          role="option"
                          aria-selected={isActive}
                          onPointerEnter={() => setActive(idx)}
                          onClick={() => execute(action)}
                          className={`flex cursor-pointer items-baseline justify-between gap-4 px-4 py-2 font-mono text-xs tracking-[0.15em] ${
                            isActive
                              ? "border-l-2 border-signal bg-signal/10 text-bone"
                              : "border-l-2 border-transparent text-bone/70"
                          }`}
                        >
                          <span className="truncate">{action.label}</span>
                          {action.hint && (
                            <span className="shrink-0 text-[9px] text-ash/70">
                              {action.hint}
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </div>

            {/* footer */}
            <div className="flex items-center justify-between border-t border-slate/60 bg-void/60 px-4 py-2 font-mono text-[9px] tracking-[0.25em] text-ash">
              <span aria-live="polite" className="text-signal">
                {status}
              </span>
              <span className="[@media(hover:none)]:hidden">
                ↑↓ NAVIGATE · ↵ EXECUTE · ESC ABORT
              </span>
              <span className="hidden [@media(hover:none)]:inline">
                TAP TO EXECUTE · ✕ ABORT
              </span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
