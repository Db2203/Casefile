/**
 * Art-deco stepped skyline silhouettes — three deterministic layers for
 * parallax. Pure SVG, server-safe, no randomness (hydration-stable).
 * Each building is [x, width, height] on a 1200×200 viewBox (y grows up).
 */

type B = [x: number, w: number, h: number];

const FAR: B[] = [
  [0, 70, 70], [80, 50, 110], [140, 64, 88], [215, 40, 130], [265, 80, 75],
  [355, 56, 118], [420, 70, 92], [500, 44, 142], [555, 90, 80], [655, 60, 105],
  [725, 50, 128], [785, 86, 72], [880, 56, 115], [945, 70, 95], [1025, 48, 135],
  [1082, 70, 85], [1160, 40, 108],
];

const MID: B[] = [
  [20, 90, 55], [125, 70, 95], [210, 100, 65], [325, 60, 115], [400, 90, 70],
  [505, 76, 100], [595, 110, 58], [720, 66, 108], [800, 96, 75], [910, 70, 92],
  [995, 90, 62], [1100, 80, 100],
];

const NEAR: B[] = [
  [0, 130, 45], [150, 100, 78], [270, 140, 52], [430, 90, 88], [540, 130, 60],
  [690, 110, 82], [820, 150, 48], [990, 110, 72], [1115, 85, 58],
];

function Layer({ data, lit = false }: { data: B[]; lit?: boolean }) {
  return (
    <g>
      {data.map(([x, w, h], i) => (
        <g key={i}>
          {/* stepped art-deco crown */}
          <rect x={x + w * 0.3} y={200 - h - 10} width={w * 0.4} height={10} />
          <rect x={x + w * 0.42} y={200 - h - 18} width={w * 0.16} height={8} />
          <rect x={x} y={200 - h} width={w} height={h} />
          {/* a few lit windows on the near layer */}
          {lit &&
            i % 2 === 0 && (
              <>
                <rect
                  x={x + w * 0.2}
                  y={200 - h + 12}
                  width={3}
                  height={5}
                  fill="rgba(245,178,26,0.5)"
                />
                <rect
                  x={x + w * 0.65}
                  y={200 - h + 26}
                  width={3}
                  height={5}
                  fill="rgba(245,178,26,0.35)"
                />
              </>
            )}
        </g>
      ))}
    </g>
  );
}

export function SkylineFar({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 1200 200" preserveAspectRatio="none" className={className} aria-hidden>
      <Layer data={FAR} />
    </svg>
  );
}

export function SkylineMid({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 1200 200" preserveAspectRatio="none" className={className} aria-hidden>
      <Layer data={MID} />
    </svg>
  );
}

export function SkylineNear({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 1200 200" preserveAspectRatio="none" className={className} aria-hidden>
      <Layer data={NEAR} lit />
    </svg>
  );
}
