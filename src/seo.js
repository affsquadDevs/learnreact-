// Single source of truth for per-route SEO metadata.
// Used by the prerender step (prerender.mjs) to bake static <head> tags into each
// route's HTML, and by ScrollToTop (src/App.jsx) to update document.title on SPA nav.
export const SITE = 'https://YOUR_DOMAIN';

export const routeMeta = {
  '/': {
    title: 'Learn React the Right Way — ReactWay Course & Roadmap',
    description:
      'ReactWay teaches modern React with a structured, hands-on course and a step-by-step roadmap. Track your progress and build real projects from day one.',
  },
  '/course': {
    title: 'React Course — Hands-On Lessons with Progress Tracking | ReactWay',
    description:
      "Work through ReactWay's structured React course: components, hooks, state and routing with hands-on exercises and built-in progress tracking.",
  },
  '/roadmap': {
    title: 'React Learning Roadmap — Step-by-Step Path | ReactWay',
    description:
      'Follow the ReactWay roadmap: a clear, ordered path from React fundamentals to advanced topics. Know exactly what to learn next.',
  },
  404: {
    title: 'Page not found · ReactWay',
    description: 'The page you’re looking for doesn’t exist or has moved.',
    noindex: true,
  },
};
