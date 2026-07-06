# 🦇 Case Archive — a Batman-noir portfolio

My portfolio, built as a detective's case file: the city's dark, there's one
amber light, and every project is a case on record. Next.js 16 + React 19 +
TypeScript underneath, with a lot of time spent on how the thing actually
*feels* to move through.

**Live:** https://casefile-bay.vercel.app

## What's worth a look

- **The flashlight.** The page loads in the dark and your cursor is the only
  light — drag it around to read. It's one gradient layer moved with `transform`
  (so nothing re-renders while the mouse moves), and on phones the beam roams on
  its own.
- **Case files, not a project list.** Each project is a redacted dossier that
  declassifies as you read it, with its own case-study page — real numbers, no
  filler.
- **The Interrogation Room.** Rather than read a bio, you can question the
  archive: a streaming chat that only knows what's on record, grounded strictly
  on the site's own data and built to refuse anything off-topic. Zero
  client-side dependencies, with a provider fallback so it stays up.
- **Wayne Terminal.** A command palette (Ctrl/Cmd+K) I wrote from scratch —
  fuzzy search, full keyboard navigation, and the proper combobox ARIA with
  focus trap and restore.
- **No image or audio files.** Every texture is CSS, the evidence art is seeded
  SVG that stays identical across server and client renders, and the ambient
  rain and thunder are synthesized live with the Web Audio API.
- **Detective Mode.** Press `D` and the page annotates how each section is
  actually put together.
- **Surveillance Log.** A live read of my public GitHub activity, pulled at
  build time — the real record, not a screenshot.

Under all the atmosphere it's plain server-rendered HTML: static case-study
pages, JSON-LD, a sitemap, and complete reduced-motion fallbacks, so it still
works (and still ranks) with every effect turned off. Lighthouse lands around
90 / 100 / 100 / 100.

## Built with

Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS v4 · Motion 12 ·
Lenis · Zustand. No UI kit — the components, the palette, and the audio are all
hand-rolled.

## Running it locally

```bash
npm install
npm run dev
```

Identity (name, email, links, site URL) and the Interrogation Room's key come
from environment variables — copy `.env.local.example` to `.env.local` and fill
in what you like. Everything falls back to a placeholder persona, so it runs out
of the box with nothing set.

## Easter eggs

A couple. One of them answers to a certain vigilante's name.
