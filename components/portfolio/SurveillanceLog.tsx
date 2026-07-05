import { getSurveillance, type ContributionDay } from "@/lib/github";
import Reveal from "@/components/primitives/Reveal";
import Annotation from "@/components/detective/Annotation";

/**
 * The stakeout calendar: real GitHub activity, fetched at build time from
 * public endpoints and revalidated daily. Evidence, not claims — nobody can
 * fake a year of commit history. Renders nothing if GitHub is unreachable.
 */

const LEVEL_CLASS = [
  "bg-slate/25", // 0 — quiet night
  "bg-signal/25",
  "bg-signal/45",
  "bg-signal/70",
  "bg-signal shadow-[0_0_4px_rgba(245,178,26,0.7)]", // 4 — city on fire
];

function HeatMap({ days }: { days: ContributionDay[] }) {
  // grid position: column = week index from the first Sunday, row = weekday
  const first = new Date(days[0].date + "T00:00:00Z");
  const offset = first.getUTCDay(); // shift so weeks align on Sundays

  return (
    <div
      role="img"
      aria-label={`GitHub contribution calendar, ${days.length} days of activity`}
      className="overflow-x-auto pb-2"
    >
      <div
        className="grid w-max grid-flow-col gap-[3px]"
        style={{ gridTemplateRows: "repeat(7, 10px)", gridAutoColumns: "10px" }}
        aria-hidden
      >
        {/* pad the first partial week so weekdays line up */}
        {Array.from({ length: offset }, (_, i) => (
          <span key={`pad-${i}`} />
        ))}
        {days.map((d) => (
          <span
            key={d.date}
            title={d.date}
            className={`h-[10px] w-[10px] rounded-[2px] ${LEVEL_CLASS[d.level] ?? LEVEL_CLASS[0]}`}
          />
        ))}
      </div>
    </div>
  );
}

export default async function SurveillanceLog() {
  const data = await getSurveillance();
  if (!data) return null; // GitHub down at build time — no broken section

  return (
    <section id="log" className="relative border-t border-slate/40 py-16 sm:py-28">
      <div className="relative mx-auto max-w-6xl px-6 sm:px-10">
        <Reveal>
          <p className="mb-2 font-mono text-[11px] tracking-[0.35em] text-signal">
            04 — SURVEILLANCE LOG
          </p>
          <h2 className="display mb-4 text-5xl text-bone sm:text-7xl">
            The
            <br />
            Stakeout
          </h2>
          <p className="mb-12 max-w-md leading-relaxed text-bone/80">
            Twelve months of activity, on the record. Straight from the public
            GitHub feed — evidence doesn&apos;t take nights off.
          </p>
        </Reveal>

        <Annotation id="log" className="absolute right-6 top-0 sm:right-10" />

        {/* the stakeout calendar */}
        <Reveal delay={0.1}>
          <div className="border border-slate/70 bg-coal/50 p-5 sm:p-7">
            <HeatMap days={data.days} />
            <div className="mt-4 flex flex-wrap items-center justify-between gap-3 font-mono text-[10px] tracking-[0.25em] text-ash">
              <span>
                {data.totalContributions !== null && (
                  <>
                    <span className="text-signal">
                      {data.totalContributions.toLocaleString()}
                    </span>{" "}
                    CONTRIBUTIONS — LAST 12 MONTHS
                  </>
                )}
              </span>
              <span className="flex items-center gap-2" aria-hidden>
                QUIET
                {LEVEL_CLASS.map((c, i) => (
                  <span key={i} className={`h-[9px] w-[9px] rounded-[2px] ${c}`} />
                ))}
                ON THE CASE
              </span>
            </div>
          </div>
        </Reveal>

        {/* recent activity + stats */}
        <div className="mt-6 grid gap-6 md:grid-cols-[1.5fr_1fr]">
          <Reveal delay={0.15}>
            <div className="border border-slate/70 bg-coal/50 p-5 font-mono text-[11px] leading-loose tracking-wide sm:p-7">
              <p className="mb-3 text-[10px] tracking-[0.3em] text-ash">
                RECENT MOVEMENTS
              </p>
              {data.activity.length > 0 ? (
                <ul>
                  {data.activity.map((a, i) => (
                    <li key={i} className="flex flex-wrap gap-x-3 text-bone/80">
                      <span className="text-ash">{a.date}</span>
                      <span className="text-signal">{a.text}</span>
                      <span className="truncate">→ {a.repo.split("/")[1]}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-ash">SUBJECT CURRENTLY DARK. STAY ON THEM.</p>
              )}
            </div>
          </Reveal>

          <Reveal delay={0.2}>
            <div className="flex h-full flex-col justify-between gap-4 border border-slate/70 bg-coal/50 p-5 sm:p-7">
              <div>
                <p className="mb-1 font-mono text-[10px] tracking-[0.3em] text-ash">
                  OPEN FILES
                </p>
                <p className="display text-4xl text-signal">
                  {data.publicRepos ?? "—"}
                </p>
                <p className="font-mono text-[10px] tracking-[0.25em] text-ash">
                  PUBLIC REPOSITORIES
                </p>
              </div>
              <a
                href="https://github.com/Db2203"
                target="_blank"
                rel="noopener noreferrer"
                className="link-wipe self-start font-mono text-xs tracking-[0.2em] text-bone"
              >
                FULL RECORD ↗
              </a>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
