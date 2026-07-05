"use client";

import { create } from "zustand";

/**
 * Slim UI state for the noir shell.
 *
 * One-shot events (fire the signal, replay the boot) use the NONCE pattern:
 * a counter that consumers watch for increments — no consume/reset handshake,
 * no race with auto-dismiss timers.
 */
interface NoirState {
  /** Arkham-style scan overlay revealing build annotations (key: D). */
  detectiveMode: boolean;
  /** Boot/ignition sequence finished (or skipped) — gates hero entrance. */
  bootDone: boolean;
  /** Hero flashlight opt-out ("LIGHTS ON"). Lifted so the palette can toggle it. */
  lightsOn: boolean;
  /** Ambient rain/thunder audio (opt-in; persistence lives in the toggle). */
  soundOn: boolean;
  /** WAYNE TERMINAL command palette. */
  paletteOpen: boolean;
  /** Increments fire the bat-signal easter egg. */
  signalNonce: number;
  /** Increments replay the boot ignition. */
  bootNonce: number;

  toggleDetective: () => void;
  setBootDone: (done: boolean) => void;
  toggleLights: () => void;
  setSound: (on: boolean) => void;
  setPaletteOpen: (open: boolean) => void;
  fireSignal: () => void;
  replayBoot: () => void;
}

export const useNoir = create<NoirState>((set) => ({
  detectiveMode: false,
  bootDone: false,
  lightsOn: false,
  soundOn: false,
  paletteOpen: false,
  signalNonce: 0,
  bootNonce: 0,

  toggleDetective: () => set((s) => ({ detectiveMode: !s.detectiveMode })),
  setBootDone: (bootDone) => set({ bootDone }),
  toggleLights: () => set((s) => ({ lightsOn: !s.lightsOn })),
  setSound: (soundOn) => set({ soundOn }),
  setPaletteOpen: (paletteOpen) => set({ paletteOpen }),
  fireSignal: () =>
    set((s) => ({ signalNonce: s.signalNonce + 1, paletteOpen: false })),
  replayBoot: () =>
    set((s) => ({ bootNonce: s.bootNonce + 1, paletteOpen: false })),
}));
