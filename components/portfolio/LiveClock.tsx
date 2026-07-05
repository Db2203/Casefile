"use client";

import { useEffect, useState } from "react";

/**
 * Living footer clock — the visitor's local time with a night-watch status
 * line. Renders empty until mounted (clock can't be server-rendered without
 * a hydration mismatch), so SSR output stays stable.
 */
export default function LiveClock() {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date());
    // Align updates to the minute boundary — accurate and cheapest.
    let interval: ReturnType<typeof setInterval> | undefined;
    const untilNextMinute = 60_000 - (Date.now() % 60_000) + 50;
    const timeout = setTimeout(() => {
      setNow(new Date());
      interval = setInterval(() => setNow(new Date()), 60_000);
    }, untilNextMinute);
    return () => {
      clearTimeout(timeout);
      if (interval) clearInterval(interval);
    };
  }, []);

  if (!now) return <span aria-hidden className="inline-block w-44" />;

  const hh = String(now.getHours()).padStart(2, "0");
  const mm = String(now.getMinutes()).padStart(2, "0");
  const h = now.getHours();
  const status =
    h >= 22 || h < 5
      ? "THE CITY STILL AWAKE"
      : h < 8
        ? "THE NIGHT SHIFT ENDS"
        : h < 18
          ? "WAITING FOR NIGHTFALL"
          : "THE LIGHTS COME ON";

  return (
    <span className="tabular-nums">
      <span className="text-signal">{hh}:{mm}</span> — {status}
    </span>
  );
}
