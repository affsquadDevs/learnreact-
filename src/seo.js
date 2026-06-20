// Single source of truth for per-route SEO metadata.
// Used by the prerender step (prerender.mjs) to bake static <head> tags into each
// route's HTML, and by ScrollToTop (src/App.jsx) to update document.title on SPA nav.
import { articles } from './content/articles/manifest.js';

export const SITE = 'https://learn-react.com';

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
    // Course lessons are still placeholder content — keep out of the index until real
    // lessons are published (also removed from sitemap.xml). Remove `noindex` when ready.
    noindex: true,
  },
  '/roadmap': {
    title: 'React Learning Roadmap — Step-by-Step Path | ReactWay',
    description:
      'Follow the ReactWay roadmap: a clear, ordered path from React fundamentals to advanced topics. Know exactly what to learn next.',
  },
  '/about': {
    title: 'About ReactWay — Learn React the Right Way',
    description:
      'ReactWay organises modern React into one deliberate learning path: a structured course, a concept roadmap, and built-in progress tracking.',
  },
  '/contact': {
    title: 'Contact ReactWay',
    description:
      'Get in touch with the ReactWay team about the course, the roadmap, feedback, privacy requests, or advertising enquiries.',
  },
  '/privacy': {
    title: 'Privacy Policy | ReactWay',
    description:
      'How ReactWay handles your information, including cookies, Google AdSense and third-party advertising, analytics, and your privacy choices.',
  },
  '/terms': {
    title: 'Terms of Service | ReactWay',
    description:
      'The terms that govern your use of the ReactWay website: acceptable use, intellectual property, disclaimers, and liability.',
  },
  404: {
    title: 'Page not found · ReactWay',
    description: 'The page you’re looking for doesn’t exist or has moved.',
    noindex: true,
  },
};

// Blog index + one entry per article (keeps client titles and prerendered <head> in sync).
routeMeta['/blog'] = {
  title: 'React Articles & Guides | ReactWay',
  description:
    'In-depth, practical guides to core React concepts: hooks, rendering, components, forms, and performance.',
};
for (const a of articles) {
  routeMeta[`/blog/${a.slug}`] = {
    title: `${a.title} | ReactWay`,
    description: a.description,
  };
}
