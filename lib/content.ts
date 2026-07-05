/**
 * SINGLE SOURCE OF TRUTH for all portfolio content.
 * Consumed by every section component — the visible site AND the SEO layer.
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
  // The flashlight-hero headline. Short lines read best in Anton.
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
  link?: string;
  status: string; // dossier stamp, e.g. "CLOSED — SHIPPED"
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
    link: "#",
    status: "CLOSED — SHIPPED",
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
    link: "#",
    status: "CLOSED — AWARDED",
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
    link: "#",
    status: "CLOSED — SHIPPED",
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
    link: "#",
    status: "ONGOING",
  },
];

export const playground = {
  heading: "R&D — THE WORKSHOP",
  intro:
    "Off-hours prototypes and half-built gadgets. This is where techniques get stress-tested before they're trusted in the field.",
  items: [
    { title: "Kinetic Type Engine", note: "Variable-font choreography" },
    { title: "Fluid Cursor", note: "GPU fluid sim on pointer" },
    { title: "Night-City Generator", note: "Procedural skyline sketches" },
    { title: "Sound-Reactive Shaders", note: "FFT → fragment uniforms" },
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
export const annotations: Record<string, string> = {
  hero: "Flashlight mask: one radial-gradient bound to the cursor's spring motion values via useMotionTemplate. Zero re-renders per mousemove.",
  work: "Card tilt: pointer offset → rotateX/Y springs. Rect cached on enter, never read per-move. Titles decrypt via a single rAF writing textContent.",
  about: "Server-rendered semantic HTML. Everything you see is crawlable — the atmosphere is a client-side enhancement layer.",
  playground: "Rain: one <canvas>, one rAF, DPR clamped to 2, pauses on document.hidden.",
  contact: "Magnetic button: spring toward pointer, snap home on leave. The beam is a CSS conic-gradient, not an asset.",
};
