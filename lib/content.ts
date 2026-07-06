/**
 * SINGLE SOURCE OF TRUTH for all portfolio content.
 * Consumed by every section, the case-study pages, and the SEO layer.
 *
 * 👉 Fields marked [PLACEHOLDER] are personal info the owner will set.
 *    Project data below is REAL — sourced from github.com/Db2203 READMEs.
 *    Anything marked [VERIFY] should be double-checked/filled by the owner.
 *
 * Tone note: the site is themed as a noir "case archive" — copy leans on
 * the night / the city / the detective. Keep that voice when editing.
 */

export const siteUrl = "https://casefile-bay.vercel.app";

/**
 * Personal info comes from ENVIRONMENT VARIABLES so this public repo never
 * contains it — the values below are the neutral fallback persona.
 * Set the real values in Vercel (Project → Settings → Environment Variables)
 * and locally in .env.local (gitignored). See .env.local.example.
 * NEXT_PUBLIC_ prefix = inlined at build time (the site displays them anyway;
 * this keeps them out of the SOURCE, not off the page).
 */
export const profile = {
  name: process.env.NEXT_PUBLIC_OWNER_NAME || "Alex Rivera",
  role: "Full-Stack Developer",
  tagline: "I build products that work the night shift.",
  location: process.env.NEXT_PUBLIC_OWNER_LOCATION || "The City",
  email: process.env.NEXT_PUBLIC_OWNER_EMAIL || "hello@example.com",
  status: "OPEN TO WORK", // shown as a dossier stamp
  socials: [
    { label: "GitHub", href: "https://github.com/Db2203" },
    {
      label: "LinkedIn",
      href: process.env.NEXT_PUBLIC_LINKEDIN_URL || "https://linkedin.com",
    },
    // CV hosted OUTSIDE the repo (Vercel Blob / Drive) — appears when set
    ...(process.env.NEXT_PUBLIC_DOSSIER_URL
      ? [{ label: "Dossier (PDF)", href: process.env.NEXT_PUBLIC_DOSSIER_URL }]
      : []),
  ],
};

export const hero = {
  kicker: "CASE ARCHIVE — CLASSIFIED",
  lines: ["EVERY GREAT", "BUILD STARTS", "IN THE DARK."],
  sub: "Full-stack developer and data wrangler. Hand me a messy real-world problem and I'll dig into the data behind it, then ship something I can defend line by line.",
  hint: "move the light to read · scroll to descend",
};

export const about = {
  heading: "SUBJECT DOSSIER",
  intro:
    "Engineer with a detective's habits. I'll comb half a million collision records looking for one pattern, then lose an afternoon on the spring curve of a single animation until it feels right.",
  fields: [
    { label: "SUBJECT", value: profile.name }, // follows the env-configured name
    { label: "KNOWN ALIASES", value: "The Data Wrangler. The Full-Stack Builder." },
    { label: "COMMENDATIONS", value: "3× first place — competitive hackathons" },
    { label: "LAST SEEN", value: "Shipping at 2:47 AM" },
    { label: "MOTIVE", value: "Real problems, and proof they got solved" },
  ],
  paragraphs: [
    "Most of what I build starts with a question I couldn't find a straight answer to. How dangerous is the fast route home? Can a product drop stay fair with bots in the room? Chasing those has pulled me across the whole stack — ML pipelines on public datasets, FastAPI backends with auth built for the open internet, distributed SQL under stampede load, and the React front ends that tie it all together.",
    "The frontend gets the same attention as everything behind it. This site is the example: the textures are CSS or generated SVG, the motion runs on one frame loop I keep on a strict budget, and under all the noir it's server-rendered HTML a crawler can read start to finish.",
  ],
  skills: [
    "Python",
    "TypeScript / JavaScript",
    "Java · C/C++",
    "React / Next.js",
    "Node · FastAPI · Flask",
    "Tailwind & Motion Craft",
    "PostgreSQL · PostGIS · pgvector",
    "DuckDB · SQLite · MySQL",
    "scikit-learn · PyTorch",
    "OpenCV · Transformers",
    "LLM APIs — Gemini · Groq · Ollama",
    "ML & Data Pipelines",
    "Docker & Self-Hosting",
    "AWS — S3 · Lambda · EC2",
    "GitHub Actions · CI",
    "Data Structures · Algorithms · System Design",
  ],
};

/* ── Case files ───────────────────────────────────────────────── */

export type EvidenceKind = "ui" | "skyline" | "blueprint" | "graph";

export type CaseStudy = {
  context: string;
  problem: string;
  investigation: { label: string; title: string; detail: string }[];
  resolution: string;
  evidence: { id: string; kind: EvidenceKind; caption: string }[];
  impact: { value: string; label: string }[];
};

export type Project = {
  id: string;
  caseNo: string;
  title: string;
  year: string;
  category: string;
  /** Problem → outcome, one line. Hidden behind a redaction bar until hover. */
  summary: string;
  description: string;
  tags: string[];
  /** GitHub repository (VIEW CODE ↗). */
  repo: string;
  /** Optional LIVE deployment URL (LIVE ↗). */
  link?: string;
  status: string; // dossier stamp
  caseStudy: CaseStudy;
};

export const projects: Project[] = [
  {
    id: "saferoute",
    caseNo: "001",
    title: "SAFEROUTE",
    year: "2026",
    category: "Geospatial ML + Full-Stack",
    summary:
      "The fastest route home is usually the most dangerous one, and across 510k collision records in London and Dubai that trade-off finally has a number. London: 62% less risk for 19 extra minutes. Dubai: the same idea didn't survive contact with the data.",
    description:
      "Safety-aware navigation, tried in two cities. One pipeline turns five years of UK STATS19 data into London's fastest-vs-safest routing. Pointed at eight years of Dubai Police data, the routing idea came apart — so the Dubai build became a road-safety analytics dashboard instead.",
    tags: ["Python / scikit-learn", "PostGIS", "Next.js + Leaflet"],
    repo: "https://github.com/Db2203/saferoute",
    status: "CASE CLOSED",
    caseStudy: {
      context:
        "Every navigation app optimizes for time. None of them mention that the ten-minutes-faster route cuts through the city's worst streets for crashes. The data to prove it is public — both the UK and Dubai release police-recorded collisions — it just was never wired into a router. The question I didn't see coming showed up later: does this even work in every city?",
      problem:
        "Turn years of raw collision records into something a router can use: which roads are dangerous, under what conditions, and what a driver trades away to avoid them. Then take the whole idea to a city with a completely different road network, and be willing to admit if it falls apart.",
      investigation: [
        {
          label: "EVIDENCE",
          title: "Profiled half a million collisions",
          detail:
            "Started with 503k UK records, narrowed to 123,576 geocoded London incidents, then added 386,796 more from eight years of Dubai Police data. London became a road graph through OSMnx: 165,716 nodes and 381,109 edges.",
        },
        {
          label: "ANALYSIS",
          title: "Found where the city bites",
          detail:
            "DBSCAN surfaced 1,863 London hotspots. A 200-tree Random Forest learned severity from context — weather, light, road type — and 64,652 road segments each ended up with their own risk score.",
        },
        {
          label: "THE ROUTE",
          title: "Made risk a routing cost",
          detail:
            "A modified Dijkstra weighs risk against time (α·time + (1−α)·risk), served by FastAPI over PostGIS. The Next.js and Leaflet frontend draws the fastest and safest routes side by side: 62% less risk for 19 extra minutes.",
        },
        {
          label: "THE PIVOT",
          title: "Knew when to stop",
          detail:
            "The same idea flopped in Dubai, and the data explained why: collisions cover roughly 48% of segments, so the fastest and safest routes land within 0–1% of each other. No sense shipping a feature that changes nothing, so Dubai became an analytics dashboard — 2,113 blackspots, severity broken out by crash type, and a route check that flags the danger you'll actually cross.",
        },
      ],
      resolution:
        "Two cities, two products from one codebase. London got routing — a hard number on the gamble every map app stays quiet about, 62% less risk for 19 extra minutes. Dubai got analytics, because that's what its data could honestly support. Reading the data well enough to tell those two apart was the real work.",
      evidence: [
        { id: "map", kind: "skyline", caption: "London: fastest vs safest route" },
        { id: "risk", kind: "graph", caption: "Dubai: collision-risk analytics" },
        { id: "pipeline", kind: "blueprint", caption: "One pipeline, two cities" },
      ],
      impact: [
        { value: "510K", label: "COLLISIONS, 2 CITIES" },
        { value: "-62%", label: "RISK, FOR +19 MIN" },
        { value: "2 CITIES", label: "ROUTING + ANALYTICS" },
      ],
    },
  },
  {
    id: "noscalp",
    caseNo: "002",
    title: "NOSCALP",
    year: "2026",
    category: "Distributed Systems + Web",
    summary:
      "Bots win hyped drops; scalpers flip them for profit. NoScalp reframes the whole thing as a lottery and pushes fairness down into the database itself — allocation held at exactly 100 of 100 through a 50,000-request stampede.",
    description:
      "A provably-fair limited-drops platform, built at a hackathon and running on Vercel. Rather than bolt a rate-limiter on top, the fairness lives in multi-region Amazon Aurora DSQL: one entry per verified human, exactly-once allocation, and no path to overselling.",
    tags: ["TypeScript", "Aurora DSQL", "Multi-Region"],
    repo: "https://github.com/Db2203/NoScalp",
    link: "https://no-scalp.vercel.app",
    status: "LIVE — HACKATHON BUILD",
    caseStudy: {
      context:
        "Built for the 'H0: Hack the Zero Stack' hackathon. Limited drops — concert tickets, sneakers — go to whoever runs the fastest bots, and first-come-first-served rewards exactly the behavior everyone hates. So the premise flipped: stop racing the bots, and change what it takes to win.",
      problem:
        "Make a drop that's fair by design: a random draw instead of a speed contest, one entry per real person even against duplicate accounts, and inventory that can't oversell — even with the whole internet showing up at once, across regions.",
      investigation: [
        {
          label: "DESIGN",
          title: "Fairness lives in the schema",
          detail:
            "Every unit is its own row, so there's no hot counter to race on. Entries dedupe through uuidv5 primary keys and an HMAC identity index — a duplicate doesn't get caught after the fact, the key simply won't let it exist.",
        },
        {
          label: "INFRA",
          title: "Multi-region, active-active",
          detail:
            "Amazon Aurora DSQL spanning us-east-1 and us-east-2 with a us-west-2 witness — both regions accept writes, and optimistic-concurrency retries settle the conflicts.",
        },
        {
          label: "THE STAMPEDE",
          title: "Proved it under fire",
          detail:
            "A live demo fires a 50,000-request stampede at both designs. A conventional store oversells to 127/100. NoScalp lands on exactly 100 of 100 — every run, by construction.",
        },
      ],
      resolution:
        "Live and public. Overselling isn't a bug the system defends against; it's a state the schema can't represent in the first place. The demo settles the argument on a single screen: 127/100 next to 100/100.",
      evidence: [
        { id: "drop", kind: "ui", caption: "The drop lobby" },
        { id: "stampede", kind: "graph", caption: "50k-request stampede test" },
        { id: "schema", kind: "blueprint", caption: "Invariant-first schema" },
      ],
      impact: [
        { value: "100/100", label: "EXACT ALLOCATION HELD" },
        { value: "50K", label: "REQUEST STAMPEDE SURVIVED" },
        { value: "127/100", label: "WHAT THE BASELINE SOLD" },
      ],
    },
  },
  {
    id: "photonest",
    caseNo: "003",
    title: "PHOTONEST",
    year: "2026",
    category: "Systems + Applied ML",
    summary:
      "Cloud photo services quietly own your memories. This is the self-hosted answer — CLIP natural-language search and on-device face grouping, with every byte staying on hardware you control.",
    description:
      "A Google Photos alternative you host yourself. FastAPI and background workers index the library, CLIP embeddings in pgvector power natural-language search, InsightFace handles face grouping on your own machine, and an Expo app backs up your camera roll. No third-party cloud ever touches the photos.",
    tags: ["FastAPI", "CLIP + pgvector", "Docker"],
    repo: "https://github.com/Db2203/selfhost",
    status: "ONGOING",
    caseStudy: {
      context:
        "Your photo library is probably the most personal dataset you own, and the usual deal is handing it to a company that scans and monetizes it. Self-hosting is the obvious fix — but only if it can match the two things that keep people on the big services: search that understands plain language, and faces.",
      problem:
        "Build the real product, not a proof of concept: index tens of thousands of photos, search them with plain sentences like 'beach at sunset', group people on-device, sync a phone's camera roll — and lock it down tightly enough to expose to the open internet from a homelab.",
      investigation: [
        {
          label: "PIPELINE",
          title: "Stateless core, background workers",
          detail:
            "Stateless FastAPI with arq workers over Redis; Postgres with pgvector holds the CLIP embeddings behind semantic search; InsightFace runs face recognition entirely on the box. Storage stays an abstraction — local disk, S3, or MinIO.",
        },
        {
          label: "HARDENING",
          title: "Auth like it's production",
          detail:
            "Argon2 hashing, short-lived JWTs with rotating single-use refresh tokens, per-device revocation, and HMAC-signed image URLs — with Caddy for TLS and Tailscale for remote access that never opens a port.",
        },
        {
          label: "PROOF",
          title: "Tested against real services",
          detail:
            "CI runs 47 tests against a real Postgres and a real MinIO, not mocks, so the storage abstraction and auth flows get hit the way production would. An Expo app handles camera-roll backup on iOS and Android.",
        },
      ],
      resolution:
        "A photo library that answers to one person — you. Still in progress: sharing, dedup, and more of the indexing pipeline are on the list, which is why this case stays open.",
      evidence: [
        { id: "library", kind: "ui", caption: "Library + semantic search" },
        { id: "arch", kind: "blueprint", caption: "Workers, storage, auth architecture" },
        { id: "auth", kind: "graph", caption: "Token rotation flow" },
      ],
      impact: [
        { value: "0", label: "THIRD-PARTY CLOUDS" },
        { value: "47", label: "CI TESTS VS REAL SERVICES" },
        { value: "3", label: "STORAGE BACKENDS" },
      ],
    },
  },
  {
    id: "redditrecbuds",
    caseNo: "004",
    title: "REDDITRECBUDS",
    year: "2026",
    category: "LLM Data Pipeline",
    summary:
      "The good earbud advice on Reddit is real; it's just buried under thousands of comments. This pipeline reads them with LLMs and ranks the results with a Wilson-bound score, turning r/Earbuds into something you can browse.",
    description:
      "A wireless-earbud recommender built out of r/Earbuds. Two LLMs — Llama 3.1 via Groq and Gemini 2.5 Flash — pull product mentions and sentiment from raw comments; user-level dedup and a volume-plus-confidence blend decide what the community really stands behind. Live on Streamlit.",
    tags: ["Python", "Groq / Gemini", "DuckDB"],
    repo: "https://github.com/Db2203/redditrecbuds",
    link: "https://redditrecbuds.streamlit.app",
    status: "LIVE — DEPLOYED",
    caseStudy: {
      context:
        "The most useful earbud reviews never reach review sites; they sit in thousands of r/Earbuds comments, unstructured and unranked. And when Reddit closed its API in late 2025, even reading them at scale turned into its own problem.",
      problem:
        "Pull honest product opinions out of freeform Reddit text: get the data despite the API shutdown, work out which products people mean and how they feel about them, stop one enthusiast from voting fifty times, and rank so a product with 8 glowing mentions doesn't beat one with 300 solid ones.",
      investigation: [
        {
          label: "INGEST",
          title: "Routed around the shutdown",
          detail:
            "When Reddit's API closed in late 2025, the pipeline switched to Arctic Shift for access — with checkpointed, resumable ingestion into DuckDB, so a failed run never restarts from zero.",
        },
        {
          label: "EXTRACT",
          title: "LLMs as structured readers",
          detail:
            "Llama 3.1 (via Groq) and Gemini 2.5 Flash read product mentions and sentiment straight out of raw comment text, deduplicated per user so one superfan counts once.",
        },
        {
          label: "RANK",
          title: "Statistics over vibes",
          detail:
            "The score blends 0.75 · log-volume with 0.25 · Wilson lower bound — popularity kept in check by statistical confidence, so a small burst of hype can't beat sustained agreement. Streamlit and Plotly render the results.",
        },
      ],
      resolution:
        "Live and public. Scattered opinion becomes something you can rank and trust, and it shows its work: mention volume, sentiment, and confidence are all on screen instead of hidden behind one mystery number.",
      evidence: [
        { id: "ranking", kind: "graph", caption: "Volume × confidence ranking" },
        { id: "app", kind: "ui", caption: "The live recommender" },
        { id: "pipeline", kind: "blueprint", caption: "Ingest → extract → rank pipeline" },
      ],
      impact: [
        { value: "2", label: "LLMS IN THE PIPELINE" },
        { value: "75/25", label: "VOLUME / CONFIDENCE BLEND" },
        { value: "LIVE", label: "ON STREAMLIT CLOUD" },
      ],
    },
  },
];

export const contact = {
  heading: "SEND THE SIGNAL",
  blurb:
    "Got a project, a role, or a half-formed idea? Send it over — I'm open to full-time and freelance both.",
  email: profile.email,
  socials: profile.socials,
};

/** Detective Mode annotations — revealed by the D-key overlay. */
export const annotations = {
  hero: "The flashlight is one 260vmax gradient layer, moved with transform alone — composite-only, no re-render on mousemove. The opening sweep is a single motion animation that fires once.",
  work: "Card tilt: pointer offset feeds rotateX/Y springs. The rect is cached on enter, never read mid-move. Titles decrypt from one rAF loop writing textContent.",
  about:
    "Plain server-rendered semantic HTML — all of it crawlable. The atmosphere on top is a client-side layer you could strip away and still read the page.",
  interrogate:
    "A streaming chat with zero client dependencies, served by Groq and falling back to Gemini. It only knows this site's own content, and it won't talk off the record.",
  log: "Real data — GitHub's public contribution calendar and events API, pulled at build time and refreshed daily. No tokens, no tracking, just the public record.",
  contact:
    "Magnetic button: springs toward the pointer, snaps home on leave. The glow is one shared conic-gradient utility.",
  case: "Generated as static HTML at build time. The declassify animation is just an overlay; the file underneath is server-rendered and fully crawlable.",
};
