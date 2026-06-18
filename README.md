# ReactWay — The Right Way to Learn React

A production-ready, **React-only** marketing site + course interface for a fictional React course.
Built with Vite, React Router and Framer Motion. Course progress persists in `localStorage`.

## Features

- **Polished landing page** — animated hero with floating cards, product showcase
  dashboard, feature grid, live curriculum preview, testimonials and CTA.
- **Course interface** (`/course`) — module/lesson sidebar, lesson template content,
  "mark as complete" toggles, prev/next navigation and an overall progress bar.
- **Progress saved to `localStorage`** — completion state and the last opened lesson
  survive refreshes and sync across browser tabs.
- **Motion everywhere** — scroll-reveal sections, animated progress bars/rings and
  continuous floating elements (respects `prefers-reduced-motion`).
- **Fully responsive** and accessible-friendly markup.

## Tech stack

- React 19 + Vite
- React Router (landing ↔ course navigation)
- Framer Motion (animations)
- CSS Modules + a design-token system in `src/index.css`

## Getting started

```bash
npm install
npm run dev      # start dev server
npm run build    # production build
npm run preview  # preview the production build
npm run lint     # lint
```

## Project structure

```
src/
  components/        UI sections (Header, Hero, Showcase, Features, ...)
  pages/             Landing.jsx, Course.jsx
  data/course.js     Curriculum data (modules + lessons template)
  hooks/useProgress.js   localStorage-backed progress state
  lib/motion.js      Shared Framer Motion variants
  index.css          Global styles + design tokens
```

## Notes

Lesson bodies are intentionally left as a reusable **template** — drop real content
into `src/pages/Course.jsx` / `src/data/course.js` when ready. Progress tracking,
navigation and persistence already work end-to-end.
