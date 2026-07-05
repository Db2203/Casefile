/**
 * SINGLE SOURCE OF TRUTH for all portfolio content.
 * Consumed by every section, the case-study pages, and the SEO layer.
 *
 * 👉 To make this your own, edit the values below. Everything else updates
 *    automatically. Placeholder content is clearly marked with `[PLACEHOLDER]`.
 *
 * Tone note: the site is themed as a noir "case archive" — copy leans on
 * the night / the city / the detective. Keep that voice when editing.
 */

export const siteUrl = "https://example.com"; // [PLACEHOLDER] set your deployed URL

export const profile = {
  name: "Alex Rivera", // [PLACEHOLDER]
  role: "Designer & Developer",
  tagline: "I build interfaces that work the night shift.",
  location: "The City", // [PLACEHOLDER]
  email: "hello@example.com", // [PLACEHOLDER]
  status: "OPEN TO WORK", // shown as a dossier stamp
  socials: [
    { label: "GitHub", href: "https://github.com" },
    { label: "LinkedIn", href: "https://linkedin.com" },
    { label: "Dribbble", href: "https://dribbble.com" },
    { label: "Read.cv", href: "https://read.cv" },
  ],
};

export const hero = {
  kicker: "CASE ARCHIVE — CLASSIFIED",
  lines: ["EVERY GREAT", "BUILD STARTS", "IN THE DARK."],
  sub: "Multidisciplinary designer–developer. I take fuzzy ideas, interrogate them, and ship interfaces with an alibi for every pixel.",
  hint: "move the light to read · scroll to descend",
};

export const about = {
  heading: "SUBJECT DOSSIER",
  intro:
    "Equal parts designer and engineer — the kind of suspect who sketches the interface and then writes the code that ships it.",
  fields: [
    { label: "SUBJECT", value: "Alex Rivera" }, // [PLACEHOLDER]
    { label: "KNOWN ALIASES", value: "The Designer. The Developer. Both." },
    { label: "LAST SEEN", value: "Shipping at 2:47 AM" },
    { label: "MOTIVE", value: "Interfaces that feel alive" },
  ],
  paragraphs: [
    "Over the last few years I've helped startups and studios turn fuzzy ideas into products people actually enjoy using — brand systems, design languages, and the production React code that brings them to life.",
    "I work the seams: the transitions, the micro-interactions, the performance budget that decides whether something feels premium or janky. Most of it happens after dark.",
  ],
  skills: [
    "Product & UI Design",
    "Design Systems",
    "React / Next.js",
    "TypeScript",
    "WebGL / Canvas",
    "Motion & Interaction",
    "Brand & Art Direction",
    "Prototyping",
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
  /** Optional EXTERNAL link (live site) — internal case page is /case/[id]. */
  link?: string;
  status: string; // dossier stamp, e.g. "CLOSED — SHIPPED"
  caseStudy: CaseStudy;
};

export const projects: Project[] = [
  {
    id: "aurora",
    caseNo: "001",
    title: "AURORA", // [PLACEHOLDER]
    year: "2026",
    category: "Product Design + Build",
    summary:
      "A scheduling tool felt slow and confusing — redesigned the core flow and cut time-to-book by 40%.",
    description:
      "Led design and front-end for Aurora's booking experience. Rebuilt the calendar interaction model, introduced an optimistic-UI booking flow, and shipped a design system the team now reuses across the product.",
    tags: ["Next.js", "Design System", "UX"],
    status: "CLOSED — SHIPPED",
    caseStudy: {
      // [PLACEHOLDER] — replace with the real story
      context:
        "Aurora is a scheduling platform used by service businesses to manage thousands of bookings a week. Their team came to me after churn interviews kept surfacing the same phrase: 'booking feels like paperwork.'",
      problem:
        "The booking flow took nine screens and forty seconds on a good day. Every interaction round-tripped to the server before the UI responded, and the calendar hid availability behind three taps. Users weren't leaving because of missing features — they were leaving because the product felt slow.",
      investigation: [
        {
          label: "WEEK 01",
          title: "Shadowed real bookings",
          detail:
            "Watched 14 session recordings and sat with 5 users. Mapped every hesitation to a screen. The calendar was the crime scene: 60% of abandonments happened there.",
        },
        {
          label: "WEEK 02",
          title: "Prototyped three suspects",
          detail:
            "Built three interaction models as working prototypes — inline week view, drag-to-book, and a two-panel availability map. Tested with 8 users; the two-panel model won on every metric.",
        },
        {
          label: "WEEK 03-05",
          title: "Rebuilt the flow",
          detail:
            "Shipped the new calendar with optimistic UI — bookings confirm instantly and reconcile in the background. Cut the flow from nine screens to three.",
        },
        {
          label: "WEEK 06",
          title: "Systemized it",
          detail:
            "Extracted the components into a documented design system the team now uses across the product — tokens, primitives, and motion rules.",
        },
      ],
      resolution:
        "The redesigned flow shipped behind a feature flag, beat the old flow in a two-week A/B, and rolled out to 100% of users. The design system became the team's default vocabulary.",
      evidence: [
        { id: "flow", kind: "ui", caption: "The three-screen booking flow" },
        { id: "system", kind: "blueprint", caption: "Design system tokens & primitives" },
        { id: "metrics", kind: "graph", caption: "A/B test — time-to-book curve" },
      ],
      impact: [
        { value: "-40%", label: "TIME TO BOOK" },
        { value: "3", label: "SCREENS (WAS 9)" },
        { value: "+18%", label: "COMPLETED BOOKINGS" },
      ],
    },
  },
  {
    id: "monolith",
    caseNo: "002",
    title: "MONOLITH", // [PLACEHOLDER]
    year: "2025",
    category: "Brand + Web",
    summary:
      "A studio needed a site that proved its craft — built an award-style interactive showcase.",
    description:
      "End-to-end identity and an interactive, scroll-driven site for a design studio. Custom shaders, choreographed page transitions, and a CMS the team can actually maintain.",
    tags: ["Three.js", "Brand", "Motion"],
    status: "CLOSED — AWARDED",
    caseStudy: {
      context:
        "Monolith, a five-person design studio, had a portfolio that undersold them — a template site showing custom work. They needed the site itself to be the proof.",
      problem:
        "Every studio site claims craft; almost none demonstrate it. The brief was a site that IS the case study: real-time graphics, choreographed motion, and zero jank — while staying maintainable by non-engineers after handoff.",
      investigation: [
        {
          label: "PHASE 01",
          title: "Identity first",
          detail:
            "Built the brand system — a brutalist grid, a two-face type pairing, and a signature ink-displacement motif that would drive the shader work.",
        },
        {
          label: "PHASE 02",
          title: "Shader R&D",
          detail:
            "Prototyped the displacement effect in isolation: a fragment shader driven by scroll velocity, budgeted to 3ms a frame on mid-tier hardware.",
        },
        {
          label: "PHASE 03",
          title: "The build",
          detail:
            "Scroll-driven scenes with choreographed transitions between case studies, content wired to a headless CMS with live preview.",
        },
      ],
      resolution:
        "Launched to front-page features on two design galleries. The studio reports the site now opens their sales calls for them.",
      evidence: [
        { id: "identity", kind: "blueprint", caption: "Identity system & grid" },
        { id: "scenes", kind: "skyline", caption: "Scroll-scene storyboard" },
        { id: "perf", kind: "graph", caption: "Frame-time budget audit" },
      ],
      impact: [
        { value: "2×", label: "GALLERY FEATURES" },
        { value: "60fps", label: "MID-TIER HARDWARE" },
        { value: "+35%", label: "INBOUND LEADS" },
      ],
    },
  },
  {
    id: "pulse",
    caseNo: "003",
    title: "PULSE", // [PLACEHOLDER]
    year: "2025",
    category: "Data Visualization",
    summary:
      "Turned a dense analytics dashboard into a glanceable, real-time story.",
    description:
      "Designed and engineered a real-time data-viz layer for a fintech dashboard — streaming charts, smart empty states, and an accessibility pass that took it from WCAG fails to AA.",
    tags: ["D3", "React", "A11y"],
    status: "CLOSED — SHIPPED",
    caseStudy: {
      context:
        "Pulse is a fintech ops dashboard watched by analysts for hours a day. It technically had all the data — in eleven tables and a wall of numbers that updated every second.",
      problem:
        "Analysts were exporting to spreadsheets to understand their own dashboard. Real-time updates caused constant reflow, nothing indicated WHAT changed, and the whole surface failed WCAG contrast checks.",
      investigation: [
        {
          label: "AUDIT",
          title: "Instrumented the pain",
          detail:
            "Heat-mapped attention with the analysts: 80% of glances hit 4 of the 11 tables. Everything else was noise they'd learned to ignore.",
        },
        {
          label: "DESIGN",
          title: "Glanceable hierarchy",
          detail:
            "Led with deltas, not values — sparklines and change-chips that answer 'what moved?' before 'what is it?'. Reserved motion strictly for meaning.",
        },
        {
          label: "BUILD",
          title: "Streaming without reflow",
          detail:
            "Canvas-rendered chart layer over a stable DOM grid; updates batch on animation frames. An accessibility pass rebuilt the palette and added full keyboard + SR narration for live regions.",
        },
      ],
      resolution:
        "Shipped incrementally table-by-table. Spreadsheet exports — the workaround metric — dropped by two-thirds within a month.",
      evidence: [
        { id: "before", kind: "ui", caption: "Delta-first dashboard layout" },
        { id: "stream", kind: "graph", caption: "Streaming update batching" },
        { id: "a11y", kind: "blueprint", caption: "Accessible palette system" },
      ],
      impact: [
        { value: "-66%", label: "SPREADSHEET EXPORTS" },
        { value: "AA", label: "WCAG (WAS FAILING)" },
        { value: "1s → 60ms", label: "UPDATE JANK" },
      ],
    },
  },
  {
    id: "field-notes",
    caseNo: "004",
    title: "FIELD NOTES", // [PLACEHOLDER]
    year: "2024",
    category: "Experiment",
    summary:
      "A self-initiated generative-art playground exploring type + physics.",
    description:
      "An ongoing series of creative-coding experiments: kinetic typography, particle systems, and shader sketches. A sandbox for the techniques that later make it into client work.",
    tags: ["Creative Coding", "GLSL", "Canvas"],
    status: "ONGOING",
    caseStudy: {
      context:
        "Field Notes is the lab: a standing commitment to ship one small interactive experiment a month, in public, with the source open.",
      problem:
        "Client work rarely leaves room to learn risky techniques on the clock. Without a sandbox, every 'can we do X?' becomes a guess instead of an answer.",
      investigation: [
        {
          label: "RULE 01",
          title: "One month, one toy",
          detail:
            "Each experiment must be interactive, run at 60fps on a laptop, and fit in a single file small enough to read in one sitting.",
        },
        {
          label: "RULE 02",
          title: "Steal from physics",
          detail:
            "Springs, fields, and noise beat keyframes. Most experiments start as a force system and end as typography.",
        },
        {
          label: "RULE 03",
          title: "Graduate the winners",
          detail:
            "Techniques that survive the lab get promoted into client work — the kinetic type and particle systems on this very site started here.",
        },
      ],
      resolution:
        "The lab is why the answer to 'can we do X?' is usually a working demo by Thursday. Several experiments live on in production projects — including this portfolio.",
      evidence: [
        { id: "kinetic", kind: "blueprint", caption: "Kinetic type force system" },
        { id: "particles", kind: "graph", caption: "Particle field tuning" },
        { id: "city", kind: "skyline", caption: "Procedural city sketches" },
      ],
      impact: [
        { value: "12+", label: "EXPERIMENTS SHIPPED" },
        { value: "4", label: "PROMOTED TO CLIENT WORK" },
        { value: "60fps", label: "HOUSE RULE" },
      ],
    },
  },
];

/* ── Witness statements (testimonials) ────────────────────────── */

export type Testimonial = {
  id: string;
  witnessNo: string;
  date: string;
  relation: string;
  quote: string;
  name: string;
  role: string;
};

export const testimonials: Testimonial[] = [
  {
    // [PLACEHOLDER] — swap for a real quote
    id: "w1",
    witnessNo: "01",
    date: "2026-03-14",
    relation: "CLIENT — AURORA",
    quote:
      "We asked for a redesign and got back a faster company. The booking flow paid for the engagement in the first quarter.",
    name: "J. Doe", // [PLACEHOLDER]
    role: "Head of Product, Aurora",
  },
  {
    id: "w2",
    witnessNo: "02",
    date: "2025-11-02",
    relation: "CLIENT — MONOLITH",
    quote:
      "Every agency promised us 'award-worthy.' This is the only one whose site actually got us featured. Twice.",
    name: "R. Smith", // [PLACEHOLDER]
    role: "Founder, Monolith Studio",
  },
  {
    id: "w3",
    witnessNo: "03",
    date: "2025-06-21",
    relation: "COLLEAGUE — PULSE",
    quote:
      "Rare combination: argues about kerning in the morning and profiles frame times in the afternoon. Ship-ready in both.",
    name: "A. Kumar", // [PLACEHOLDER]
    role: "Engineering Lead, Pulse",
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
  witnesses:
    "Ruled paper is a repeating-linear-gradient. No images anywhere on this site — every texture is CSS or seeded SVG.",
  contact:
    "Magnetic button: spring toward pointer, snap home on leave. The beam is one shared conic-gradient utility.",
  case: "Statically generated at build time. The entrance is an overlay — the content underneath is server-rendered and crawlable.",
};
