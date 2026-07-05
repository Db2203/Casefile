# 🦇 Case Archive — a Batman-noir portfolio

A noir, interaction-heavy portfolio built with **Next.js 16 + React 19 +
TypeScript**, styled as a detective's case archive: near-black city, one amber
signal, and a file for every project.

**Live demo:** _deploying soon_

## The interesting parts

- **Flashlight hero** — the page opens in the dark; your cursor is the light.
  A 260vmax gradient layer moved with `transform` only (composite-only, zero
  React re-renders per mousemove). Touch devices get an auto-roaming beam.
- **One-rAF discipline** — Lenis smooth scroll rides Framer Motion's frame
  loop; every playground demo runs a single rAF gated by IntersectionObserver
  + `visibilitychange` (scroll away and everything pauses).
- **WAYNE TERMINAL** — a zero-dependency command palette (Ctrl/Cmd+K) with the
  full combobox ARIA pattern: fuzzy search, keyboard nav, focus trap/restore.
- **Procedural everything** — no image or audio assets: textures are CSS,
  evidence art is seeded deterministic SVG (hydration-stable), and the ambient
  rain + thunder are synthesized with the Web Audio API (filtered noise +
  brown-noise bursts).
- **Live playground gadgets** — variable-font kinetic type, a pointer-gravity
  particle field, a click-to-rebuild procedural skyline, velocity-reactive
  static.
- **Detective Mode** — press `D`: a scan overlay annotates how each section is
  engineered.
- **Progressive enhancement, properly** — all content is server-rendered
  semantic HTML (SSG case-study pages, JSON-LD, sitemap); the atmosphere is a
  client layer gated on pointer/motion capability, with full reduced-motion
  fallbacks. Lighthouse: 90+ across the board.

## Stack

Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS v4 ·
Motion (Framer Motion 12) · Lenis · Zustand

## Run it

```bash
npm install
npm run dev
```

## Easter eggs

Classified. (Try typing something a certain vigilante would answer to.)
