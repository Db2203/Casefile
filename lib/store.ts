"use client";

import { create } from "zustand";

/** Slim UI state for the noir shell. */
interface NoirState {
  /** Arkham-style scan overlay revealing build annotations (key: D). */
  detectiveMode: boolean;
  /** Boot/ignition sequence finished (or skipped) — gates hero entrance. */
  bootDone: boolean;

  toggleDetective: () => void;
  setBootDone: (done: boolean) => void;
}

export const useNoir = create<NoirState>((set, get) => ({
  detectiveMode: false,
  bootDone: false,

  toggleDetective: () => set({ detectiveMode: !get().detectiveMode }),
  setBootDone: (bootDone) => set({ bootDone }),
}));
