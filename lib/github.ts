/**
 * Build-time GitHub surveillance data (SERVER ONLY). All endpoints are
 * public — no tokens. Fetches are cached with daily revalidation (ISR on
 * Vercel), and every failure degrades to null so a GitHub outage can never
 * break a build or a page.
 */

const USER = "Db2203";
const REVALIDATE = { next: { revalidate: 86400 } } as const;
const HEADERS = { headers: { "User-Agent": "casefile-portfolio" } };

export interface ContributionDay {
  date: string; // YYYY-MM-DD
  level: number; // 0–4 (GitHub's own intensity buckets)
}

export interface ActivityEntry {
  date: string; // YYYY-MM-DD
  text: string; // "PUSHED 3 COMMITS", "OPENED PR", ...
  repo: string; // "Db2203/saferoute"
}

export interface Surveillance {
  days: ContributionDay[];
  totalContributions: number | null;
  publicRepos: number | null;
  activity: ActivityEntry[];
}

export async function getSurveillance(): Promise<Surveillance | null> {
  try {
    const [calRes, eventsRes, userRes] = await Promise.all([
      fetch(`https://github.com/users/${USER}/contributions`, {
        ...REVALIDATE,
        ...HEADERS,
      }),
      fetch(`https://api.github.com/users/${USER}/events/public?per_page=30`, {
        ...REVALIDATE,
        ...HEADERS,
      }),
      fetch(`https://api.github.com/users/${USER}`, {
        ...REVALIDATE,
        ...HEADERS,
      }),
    ]);
    if (!calRes.ok) return null;

    /* ── contribution calendar (parse GitHub's public HTML) ────── */
    const html = await calRes.text();
    const days: ContributionDay[] = [];
    const cellRe = /<td[^>]*ContributionCalendar-day[^>]*>/g;
    for (const match of html.match(cellRe) ?? []) {
      const date = /data-date="([\d-]+)"/.exec(match)?.[1];
      const level = /data-level="(\d)"/.exec(match)?.[1];
      if (date && level !== undefined) {
        days.push({ date, level: Number(level) });
      }
    }
    if (days.length === 0) return null;
    days.sort((a, b) => a.date.localeCompare(b.date));

    const totalMatch = /([\d,]+)\s+contributions?\s+in the last year/.exec(
      html,
    );
    const totalContributions = totalMatch
      ? Number(totalMatch[1].replace(/,/g, ""))
      : null;

    /* ── recent public activity ────────────────────────────────── */
    // The UNAUTHENTICATED events API strips payload details (no commit
    // counts, no ref types) — so we report what's reliably present: the
    // number of PUSHES per repo per day, plus PR activity.
    const activity: ActivityEntry[] = [];
    if (eventsRes.ok) {
      type GhEvent = {
        type: string;
        created_at: string;
        repo?: { name?: string };
      };
      const events = (await eventsRes.json()) as GhEvent[];
      const pushTotals = new Map<string, ActivityEntry & { n: number }>();

      for (const ev of events) {
        const repo = ev.repo?.name ?? "";
        const date = ev.created_at?.slice(0, 10) ?? "";
        if (!repo || !date) continue;

        if (ev.type === "PushEvent") {
          const key = `${date}|${repo}`;
          const existing = pushTotals.get(key);
          if (existing) existing.n += 1;
          else pushTotals.set(key, { date, text: "", repo, n: 1 });
        } else if (ev.type === "PullRequestEvent") {
          activity.push({ date, text: "PULL REQUEST ACTIVITY", repo });
        }
      }

      for (const p of pushTotals.values()) {
        activity.push({
          date: p.date,
          text: p.n === 1 ? "PUSHED WORK" : `PUSHED ×${p.n}`,
          repo: p.repo,
        });
      }
      activity.sort((a, b) => b.date.localeCompare(a.date));
      activity.splice(4);
    }

    /* ── repo count ────────────────────────────────────────────── */
    let publicRepos: number | null = null;
    if (userRes.ok) {
      const user = (await userRes.json()) as { public_repos?: number };
      publicRepos = user.public_repos ?? null;
    }

    return { days, totalContributions, publicRepos, activity };
  } catch {
    return null; // GitHub unreachable — section simply won't render
  }
}
