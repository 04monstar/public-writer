# Storybound

Storybound is a premium, browser-based reading experience designed to feel like opening a physical book. The app combines a curated library home screen with an animated reading room, rich page layouts, and deeply customizable reading controls.

## What the app offers

- A library-style home experience with book covers, reading estimates, and resume indicators
- A cinematic book-opening flow with animated cover turns and a tactile reading-room atmosphere
- A full reading interface with:
  - page turning and navigation controls
  - a table of contents modal
  - bookmarks for important pages
  - saved reading progress across sessions
- A settings panel for tuning the reading experience with:
  - theme selection
  - font family, size, and line height
  - page margins and text styling options
  - paragraph indents, drop caps, and justification
  - paper brightness, page-turn speed, and optional page sounds
  - reading pace estimates and scroll-to-turn behavior
- Accessibility-aware behavior including reduced-motion handling and high-contrast support

## Core product experience

Storybound is organized around a simple loop:

1. Browse the library of stories from the home page.
2. Open a volume into the immersive reading room.
3. Read through type-set pages, jump to chapters, and bookmark pages.
4. Leave the reader with progress and bookmarks preserved for the next visit.

## Tech stack

- React 19 with TypeScript
- React Router for client-side navigation
- TanStack Query for asynchronous story loading
- Zustand for persistent reader state such as settings, bookmarks, and progress
- Framer Motion and GSAP for animated book interactions
- RSBuild for development, building, and preview workflows

## Getting started

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Open the local RSBuild URL shown in the terminal to view the app.

## Available scripts

- `npm run dev` — start the development server
- `npm run build` — create a production build
- `npm run preview` — preview the production build locally
- `npm run typecheck` — run the TypeScript type checker

## Project structure

- `src/pages/Home` — the library/home page experience
- `src/pages/Reader` — the animated reading experience and its UI components
- `src/components` and `src/pages/Reader/components` — reusable UI for the book, controls, TOC, and spine
- `src/stores` — state for settings, bookmarks, and reading progress
- `src/data` — story content and data-loading helpers
- `src/animations` — book open/close and page-turn animation logic
- `src/hooks` — reader interaction, motion, sizing, keyboard, and layout helpers
- `src/types` — story, reader, and theme models
- `src/utils` — text layout, art generation, pagination, and audio helpers

## Notes

The app uses simulated content loading to preserve the feeling of a real reading experience, and it stores reader preferences locally in the browser so that themes and progress remain available between visits.
