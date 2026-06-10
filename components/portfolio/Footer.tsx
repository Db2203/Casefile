import { profile } from "@/lib/content";
import BatMark from "@/components/atmosphere/BatMark";
import LiveClock from "./LiveClock";

export default function Footer() {
  return (
    <footer className="border-t border-slate/40 py-10">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 px-6 font-mono text-[10px] tracking-[0.25em] text-ash sm:flex-row sm:justify-between sm:px-10">
        <span className="flex items-center gap-3">
          <BatMark className="w-6 text-slate" />© {profile.name.toUpperCase()} —
          BUILT AFTER DARK
        </span>
        <LiveClock />
        <span className="text-ash/60">
          PRESS <span className="text-signal">D</span> TO SCAN · THE REST IS
          CLASSIFIED
        </span>
      </div>
    </footer>
  );
}
