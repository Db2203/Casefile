# Case Archive

My portfolio, built as a detective's case file. The city is dark, there's one
amber light, and every project shows up as a case on record. It runs on
Next.js 16, React 19 and TypeScript, and I spent most of the time on how it
feels to actually move around.

Live: linked in the About panel at the top of this repo.

## What's worth a look

- **The flashlight.** The page loads dark and your cursor is the only light, so
  you drag it around to read. It's one gradient layer moved with `transform`,
  which means nothing re-renders while the mouse moves. On phones the beam roams
  by itself.
- **Case files instead of a plain project list.** Every project is a redacted
  dossier that declassifies as you read it, and each one has its own case-study
  page with real numbers.
- **The Interrogation Room.** Instead of reading a bio you can question the
  archive. It's a streaming chat that only knows what's on record, grounded
  strictly on the site's own data and set up to refuse anything off topic. It
  has no client-side dependencies and falls back to a second provider if the
  first is down.
- **Wayne Terminal.** A command palette (Ctrl/Cmd+K) I wrote from scratch, with
  fuzzy search, full keyboard navigation, and a proper combobox ARIA setup
  including focus trap and restore.
- **No image or audio files.** The textures are CSS, the evidence art is seeded
  SVG that renders identically on the server and client, and the ambient rain
  and thunder are synthesized live with the Web Audio API.
- **Detective Mode.** Press `D` and the page annotates how each section is put
  together.
- **Surveillance Log.** A live read of my public GitHub activity, pulled at
  build time straight from the public feed.

Under all the atmosphere it's plain server-rendered HTML: static case-study
pages, JSON-LD, a sitemap, and full reduced-motion fallbacks, so it still works
and still ranks with every effect switched off. Lighthouse sits around
90 / 100 / 100 / 100.

## Built with

Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS v4, Motion 12,
Lenis and Zustand. There's no UI kit; the components, the palette and the audio
are all hand-rolled.

## Running it locally

```bash
npm install
npm run dev
```

Identity (name, email, links, site URL) and the Interrogation Room's key come
from environment variables. Copy `.env.local.example` to `.env.local` and fill
in what you want. Everything falls back to a placeholder persona, so it runs
with nothing set.

## Easter eggs

A couple of them. One answers to a certain vigilante's name.
