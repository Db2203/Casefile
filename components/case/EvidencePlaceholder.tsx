import { rngFrom, range, int } from "@/lib/random";
import { generateBuildings } from "@/lib/skyline-gen";
import { SkylineLayer } from "@/components/atmosphere/Skyline";
import { BAT_PATH } from "@/components/atmosphere/BatMark";
import type { EvidenceKind } from "@/lib/content";

/**
 * Stylized placeholder "evidence photos" — deterministic seeded SVG art
 * (identical on server and client → no hydration mismatch). Swap for real
 * screenshots later by replacing usages with <img>/<Image>.
 * Server-safe: no "use client".
 */
export default function EvidencePlaceholder({
  seed,
  kind,
  className,
}: {
  seed: string;
  kind: EvidenceKind;
  className?: string;
}) {
  const rng = rngFrom(seed);

  return (
    <svg
      viewBox="0 0 160 120"
      className={className}
      aria-hidden
      preserveAspectRatio="xMidYMid slice"
    >
      {/* photo base */}
      <rect width="160" height="120" fill="#0b0b0f" />
      {/* blueprint grid */}
      <g stroke="rgba(42,45,54,0.5)" strokeWidth="0.5">
        {Array.from({ length: 9 }, (_, i) => (
          <line key={`v${i}`} x1={i * 20} y1="0" x2={i * 20} y2="120" />
        ))}
        {Array.from({ length: 7 }, (_, i) => (
          <line key={`h${i}`} x1="0" y1={i * 20} x2="160" y2={i * 20} />
        ))}
      </g>
      {kind === "ui" && <UiArt rng={rng} />}
      {kind === "skyline" && <SkylineArt rng={rng} />}
      {kind === "blueprint" && <BlueprintArt rng={rng} />}
      {kind === "graph" && <GraphArt rng={rng} />}
      {/* vignette + scan strip */}
      <rect width="160" height="120" fill="url(#none)" opacity="0" />
      <rect
        x="0"
        y="108"
        width="160"
        height="12"
        fill="rgba(5,5,7,0.65)"
      />
      <text
        x="6"
        y="116"
        fontSize="6"
        fill="rgba(153,161,176,0.8)"
        fontFamily="monospace"
        letterSpacing="1.5"
      >
        EVIDENCE — {seed.toUpperCase().slice(0, 14)}
      </text>
    </svg>
  );
}

/* fake app frame: header, sidebar, seeded content blocks */
function UiArt({ rng }: { rng: () => number }) {
  const blocks = Array.from({ length: 5 }, () => ({
    x: range(rng, 48, 100),
    y: range(rng, 26, 84),
    w: range(rng, 20, 48),
    h: range(rng, 6, 16),
  }));
  return (
    <g>
      <rect x="8" y="8" width="144" height="12" fill="#14141a" stroke="#2a2d36" strokeWidth="0.75" />
      <circle cx="16" cy="14" r="2.5" fill="rgba(245,178,26,0.8)" />
      <rect x="8" y="24" width="32" height="84" fill="#14141a" stroke="#2a2d36" strokeWidth="0.75" />
      {Array.from({ length: 4 }, (_, i) => (
        <rect key={i} x="13" y={32 + i * 12} width="22" height="4" fill="rgba(153,161,176,0.35)" />
      ))}
      {blocks.map((b, i) => (
        <rect
          key={i}
          x={b.x}
          y={b.y}
          width={b.w}
          height={b.h}
          fill={i === 0 ? "rgba(245,178,26,0.35)" : "rgba(153,161,176,0.18)"}
          stroke="#2a2d36"
          strokeWidth="0.5"
        />
      ))}
    </g>
  );
}

function SkylineArt({ rng }: { rng: () => number }) {
  const data = generateBuildings(rng, {
    width: 1200,
    count: 11,
    minH: 60,
    maxH: 150,
  });
  return (
    <g transform="translate(0,20) scale(0.1333, 0.5)">
      <g fill="#15161f">
        <SkylineLayer data={data} lit />
      </g>
    </g>
  );
}

/* the mark as a schematic: stroked path + dimension ticks */
function BlueprintArt({ rng }: { rng: () => number }) {
  const ticks = Array.from({ length: 5 }, () => range(rng, 20, 140));
  return (
    <g>
      <g transform="translate(20,25) scale(0.6)">
        <path
          d={BAT_PATH}
          fill="none"
          stroke="rgba(245,178,26,0.55)"
          strokeWidth="1.2"
        />
      </g>
      <g stroke="rgba(153,161,176,0.4)" strokeWidth="0.5">
        {ticks.map((x, i) => (
          <g key={i}>
            <line x1={x} y1="96" x2={x} y2="102" />
            <line x1={x} y1="99" x2={x + 8} y2="99" />
          </g>
        ))}
        <line x1="20" y1="99" x2="146" y2="99" strokeDasharray="2 3" />
      </g>
    </g>
  );
}

/* surveillance readout: seeded polyline + scan rows */
function GraphArt({ rng }: { rng: () => number }) {
  let y = range(rng, 55, 80);
  const pts: string[] = [`8,${y.toFixed(1)}`];
  for (let x = 24; x <= 152; x += 16) {
    y = Math.min(95, Math.max(18, y + range(rng, -22, 18)));
    pts.push(`${x},${y.toFixed(1)}`);
  }
  return (
    <g>
      {Array.from({ length: 4 }, (_, i) => (
        <rect key={i} x="8" y={20 + i * 22} width={int(rng, 30, 70)} height="3" fill="rgba(153,161,176,0.25)" />
      ))}
      <polyline
        points={pts.join(" ")}
        fill="none"
        stroke="rgba(245,178,26,0.7)"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <circle cx="152" cy={y} r="2.5" fill="#f5b21a" />
    </g>
  );
}
