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
  name: process.env.NEXT_PUBLIC_OWNER_NAME ?? "Alex Rivera",
  role: "Full-Stack Developer",
  tagline: "I build products that work the night shift.",
  location: process.env.NEXT_PUBLIC_OWNER_LOCATION ?? "The City",
  email: process.env.NEXT_PUBLIC_OWNER_EMAIL ?? "hello@example.com",
  status: "OPEN TO WORK", // shown as a dossier stamp
  socials: [
    { label: "GitHub", href: "https://github.com/Db2203" },
    {
      label: "LinkedIn",
      href: process.env.NEXT_PUBLIC_LINKEDIN_URL ?? "https://linkedin.com",
    },
    {
      label: "Read.cv",
      href: process.env.NEXT_PUBLIC_READCV_URL ?? "https://read.cv",
    },
  ],
};

export const hero = {
  kicker: "CASE ARCHIVE — CLASSIFIED",
  lines: ["EVERY GREAT", "BUILD STARTS", "IN THE DARK."],
  sub: "Full-stack developer and data wrangler. I take messy real-world problems, interrogate the data, and ship products with an alibi for every decision.",
  hint: "move the light to read · scroll to descend",
};

export const about = {
  heading: "SUBJECT DOSSIER",
  intro:
    "Equal parts engineer and investigator — the kind of suspect who profiles half a million collision records in the morning and obsesses over a spring curve at night.",
  fields: [
    { label: "SUBJECT", value: profile.name }, // follows the env-configured name
    { label: "KNOWN ALIASES", value: "The Data Wrangler. The Full-Stack Builder." },
    { label: "LAST SEEN", value: "Shipping at 2:47 AM" },
    { label: "MOTIVE", value: "Real problems, measurable outcomes" },
  ],
  paragraphs: [
    "My work runs the stack top to bottom: ML pipelines over public datasets, FastAPI backends with real auth stories, distributed SQL under stampede load, and the React frontends that make it all usable. Most of it starts with a question nobody had a good answer for — how unsafe is the fast route home? can a drop be provably fair?",
    "I also treat the frontend as a craft, not an afterthought. Exhibit A: this site — every texture is CSS or seeded SVG, every animation runs on one budgeted frame loop, and the whole case archive is server-rendered underneath the noir.",
  ],
  skills: [
    "Python & ML Pipelines",
    "React / Next.js / TypeScript",
    "FastAPI & Flask",
    "PostgreSQL · PostGIS · pgvector",
    "Distributed SQL",
    "LLM Integration",
    "Docker & Self-Hosting",
    "Motion & Interaction Craft",
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
      "The fast route home hides its danger — an ML pipeline over 123,576 London collisions puts a number on it: 62% less risk for 19 extra minutes.",
    description:
      "Safety-aware navigation for London. Five years of UK STATS19 collision data become per-segment risk scores, and a modified Dijkstra offers the fastest and the safest route side by side — with the trade-off quantified.",
    tags: ["Python / scikit-learn", "PostGIS", "Next.js + Leaflet"],
    repo: "https://github.com/Db2203/saferoute",
    status: "CASE CLOSED",
    caseStudy: {
      context:
        "Every navigation app optimizes for time. None of them will tell you that the ten-minutes-faster route runs through some of the most collision-dense streets in London. The data to answer that question exists — the UK publishes every police-recorded collision as open STATS19 data — it just wasn't wired into routing.",
      problem:
        "Turn five years of raw collision records into something a router can reason about: which road segments are actually dangerous, in what conditions, and what does a rider give up by avoiding them? The answer has to be a route, not a heat map.",
      investigation: [
        {
          label: "EVIDENCE",
          title: "Profiled half a million collisions",
          detail:
            "Ingested 503k UK collision records and cut them down to 123,576 geocoded London incidents. Built the city as a graph with OSMnx: 165,716 nodes, 381,109 edges.",
        },
        {
          label: "ANALYSIS",
          title: "Found where the city bites",
          detail:
            "DBSCAN clustering surfaced 1,863 collision hotspots. A 200-tree Random Forest learned severity from context — weather, light, road type — and 64,652 road segments got individual risk scores.",
        },
        {
          label: "THE ROUTE",
          title: "Made risk a routing cost",
          detail:
            "Modified Dijkstra with a tunable risk/time weight, served by FastAPI over PostGIS. A Next.js + Leaflet frontend draws the fastest and safest routes side by side with the trade-off stated plainly.",
        },
      ],
      resolution:
        "The system answers the question no map app would: 'how much safety does speed cost?' A typical result — 62% lower collision-risk exposure for 19 extra minutes — turns an invisible gamble into an informed choice.",
      evidence: [
        { id: "map", kind: "skyline", caption: "Fastest vs safest, side by side" },
        { id: "risk", kind: "graph", caption: "Per-segment risk scoring" },
        { id: "pipeline", kind: "blueprint", caption: "STATS19 → PostGIS pipeline" },
      ],
      impact: [
        { value: "123,576", label: "COLLISIONS ANALYZED" },
        { value: "1,863", label: "HOTSPOTS MAPPED" },
        { value: "-62%", label: "RISK, FOR +19 MIN" },
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
      "Bots win hyped drops and scalpers resell them — a lottery backed by database invariants held allocation at exactly 100/100 under a 50,000-request stampede.",
    description:
      "A provably-fair limited-drops platform (hackathon build, live on Vercel). Fairness isn't a rate-limiter bolted on top — it's enforced as invariants in multi-region Amazon Aurora DSQL: one entry per verified human, exactly-once allocation, overselling structurally impossible.",
    tags: ["TypeScript", "Aurora DSQL", "Multi-Region"],
    repo: "https://github.com/Db2203/NoScalp",
    link: "https://no-scalp.vercel.app",
    status: "LIVE — HACKATHON BUILD",
    caseStudy: {
      context:
        "Built for the 'H0: Hack the Zero Stack' hackathon. Limited drops — concert tickets, sneakers — are decided by whoever has the fastest bots, and first-come-first-served rewards exactly the behavior everyone hates. The premise: stop trying to out-race the bots and change the game itself.",
      problem:
        "Design a drop where fairness is a guarantee, not a promise: a random lottery instead of a race, one entry per verified human even against duplicate accounts, and inventory that cannot oversell — even when the whole internet shows up at once, across regions.",
      investigation: [
        {
          label: "DESIGN",
          title: "Fairness as schema, not middleware",
          detail:
            "Inventory modeled as one row per unit — no hot counter to corrupt. Entry dedup via uuidv5-derived primary keys and an HMAC identity index, so a duplicate entry isn't rejected by logic, it's impossible by key.",
        },
        {
          label: "INFRA",
          title: "Multi-region, active-active",
          detail:
            "Amazon Aurora DSQL across us-east-1 and us-east-2 with a us-west-2 witness — both regions take writes, with optimistic-concurrency retries handling conflicts.",
        },
        {
          label: "THE STAMPEDE",
          title: "Proved it under fire",
          detail:
            "A live demo throws a 50,000-request stampede at both architectures: a conventional store oversells to 127/100. NoScalp allocates exactly 100 of 100 — every time, by construction.",
        },
      ],
      resolution:
        "Deployed and public. The oversell class of bugs isn't handled — it's unrepresentable. The demo makes the argument in one screen: 127/100 versus 100/100.",
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
      "Cloud photo services own your memories — a self-hosted library with CLIP natural-language search and face grouping keeps every byte on your own hardware.",
    description:
      "A privacy-first Google Photos alternative you run yourself: FastAPI + workers index your library, CLIP embeddings in pgvector power natural-language search, InsightFace groups faces locally, and an Expo mobile app backs up your camera roll — with zero third-party clouds.",
    tags: ["FastAPI", "CLIP + pgvector", "Docker"],
    repo: "https://github.com/Db2203/selfhost",
    status: "ONGOING",
    caseStudy: {
      context:
        "Photo libraries are the most personal dataset most people have, and the standard deal is handing them to a cloud that scans, mines, and meters them. Self-hosting is the obvious answer — if it can match the two features that keep people locked in: search that understands language, and faces.",
      problem:
        "Build the whole product, not a demo: index tens of thousands of local photos, search them with sentences ('beach at sunset'), group people locally, sync a phone's camera roll — and secure all of it well enough to expose to the open internet from a homelab.",
      investigation: [
        {
          label: "PIPELINE",
          title: "Stateless core, honest workers",
          detail:
            "Stateless FastAPI with arq background workers over Redis; Postgres with pgvector stores CLIP embeddings for semantic search; InsightFace runs face recognition entirely locally. Storage is an abstraction — local filesystem, S3, or MinIO.",
        },
        {
          label: "HARDENING",
          title: "Auth like it's production",
          detail:
            "Argon2 password hashing, short-lived JWTs with rotating single-use refresh tokens, per-device revocation, and HMAC-signed image URLs — plus Caddy TLS and Tailscale for remote access without exposure.",
        },
        {
          label: "PROOF",
          title: "Tested against real services",
          detail:
            "CI runs 47 tests against a real Postgres and a real MinIO — not mocks — so the storage abstraction and auth flows are exercised the way production would hit them. An Expo app handles iOS/Android camera-roll backup.",
        },
      ],
      resolution:
        "A photo library that answers to exactly one person. Ongoing build — the case stays open, and the roadmap (sharing, dedup, more of the index) keeps it that way.",
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
      "Earbud advice on Reddit is scattered across thousands of comments — an LLM extraction pipeline with Wilson-bound ranking turns r/Earbuds into a trustworthy recommender.",
    description:
      "A wireless-earbud recommender mined from r/Earbuds. LLMs (Llama 3.1 via Groq, Gemini 2.5 Flash) extract product mentions and sentiment from raw comments; user-level dedup and a volume-plus-confidence blend rank what the community actually trusts. Live on Streamlit.",
    tags: ["Python", "Groq / Gemini", "DuckDB"],
    repo: "https://github.com/Db2203/redditrecbuds",
    // link: "" — [VERIFY] add the live Streamlit URL
    status: "LIVE — DEPLOYED",
    caseStudy: {
      context:
        "The best earbud reviews aren't on review sites — they're buried in thousands of r/Earbuds comments, unstructured and unranked. And in late 2025, Reddit closing its API made even reading them at scale a problem to solve.",
      problem:
        "Mine honest product opinions out of freeform Reddit text: get the data despite the API shutdown, extract which products people mean and how they feel, stop one enthusiastic user from voting fifty times, and rank so a product with 8 glowing mentions doesn't outrank one with 300 solid ones.",
      investigation: [
        {
          label: "INGEST",
          title: "Routed around the shutdown",
          detail:
            "When the Reddit API closed in late 2025, the pipeline moved to Arctic Shift for data access — with checkpointed, resumable ingestion into DuckDB so a failed run never starts from zero.",
        },
        {
          label: "EXTRACT",
          title: "LLMs as structured readers",
          detail:
            "Llama 3.1 (via Groq) and Gemini 2.5 Flash pull product mentions and sentiment out of raw comment text, deduplicated at the user level so one superfan counts once.",
        },
        {
          label: "RANK",
          title: "Statistics over vibes",
          detail:
            "Scores blend 0.75 · log-volume with 0.25 · Wilson lower bound — popularity tempered by statistical confidence, so small hype clusters can't beat sustained consensus. Streamlit + Plotly serve the results.",
        },
      ],
      resolution:
        "Deployed and public: community wisdom, made rankable — with the receipts (mention volume, sentiment, confidence) shown instead of a black-box score.",
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

/* ── Playground ───────────────────────────────────────────────── */

export type DemoKind = "kinetic" | "fluid" | "city" | "static";

export const playground = {
  heading: "R&D — THE WORKSHOP",
  intro:
    "Off-hours prototypes and half-built gadgets — and these ones actually run. Touch them.",
  items: [
    {
      title: "Kinetic Type Engine",
      note: "Glyphs bend toward the pointer",
      demo: "kinetic" as DemoKind,
    },
    {
      title: "Fluid Cursor",
      note: "Particle field with pointer gravity",
      demo: "fluid" as DemoKind,
    },
    {
      title: "Night-City Generator",
      note: "Seeded skyline — click to rebuild",
      demo: "city" as DemoKind,
    },
    {
      title: "Signal Static",
      note: "Pointer velocity → noise field",
      demo: "static" as DemoKind,
    },
  ],
};

export const contact = {
  heading: "SEND THE SIGNAL",
  blurb:
    "Have a project, a role, or a wild idea? I answer the signal — freelance work and full-time roles alike.",
  email: profile.email,
  socials: profile.socials,
};

/** Detective Mode annotations — revealed by the D-key overlay. */
export const annotations = {
  hero: "Flashlight: a 260vmax gradient layer moved with transform only — composite-only, zero re-renders per mousemove. The intro sweep is a one-shot motion animation.",
  work: "Card tilt: pointer offset → rotateX/Y springs. Rect cached on enter, never read per-move. Titles decrypt via a single rAF writing textContent.",
  about:
    "Server-rendered semantic HTML. Everything you see is crawlable — the atmosphere is a client-side enhancement layer.",
  playground:
    "Each demo runs ONE rAF, gated by IntersectionObserver + visibilitychange — scrolled away or tab hidden, everything pauses.",
  log: "Real data: GitHub's public contribution calendar and events API, fetched at build time and revalidated daily. No tokens, no tracking — just the public record.",
  contact:
    "Magnetic button: spring toward pointer, snap home on leave. The beam is one shared conic-gradient utility.",
  case: "Statically generated at build time. The entrance is an overlay — the content underneath is server-rendered and crawlable.",
};
