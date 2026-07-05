"use client";

import { useNoir } from "@/lib/store";
import { DetectiveButton } from "@/components/detective/DetectiveMode";
import AmbientSoundToggle from "@/components/atmosphere/AmbientSoundToggle";

/** Bottom-right control dock: sound · terminal · detective. */
export default function HudDock() {
  const setPaletteOpen = useNoir((s) => s.setPaletteOpen);

  return (
    <div
      className="fixed z-[80] flex flex-wrap justify-end gap-2"
      style={{
        bottom: "max(1rem, env(safe-area-inset-bottom))",
        right: "max(1rem, env(safe-area-inset-right))",
      }}
    >
      <AmbientSoundToggle />
      <button
        onClick={() => setPaletteOpen(true)}
        className="rounded-sm border border-slate bg-void/60 px-3 py-2 font-mono text-[10px] tracking-[0.25em] text-ash backdrop-blur transition-colors hover:border-signal hover:text-signal"
      >
        <span className="hidden sm:inline">CTRL+K — </span>TERMINAL
      </button>
      <DetectiveButton />
    </div>
  );
}
