// Single source of truth for per-route SEO metadata.
// Used by the prerender step (prerender.mjs) to bake static <head> tags into each
// route's HTML, and by ScrollToTop (src/App.jsx) to update document.title on SPA nav.
import { articles } from './content/articles/manifest.js';

export const SITE = 'https://learn-react.com';

export const routeMeta = {
  '/': {
    title: 'Learn Web Development the Right Way — DevWay Courses & Roadmaps',
    description:
      'DevWay teaches web development — frontend, backend and the cloud — with structured, hands-on courses, step-by-step roadmaps, and built-in progress tracking. Start with React or the AWS Cloud Practitioner course.',
  },
  '/courses': {
    title: 'Web Technology Courses — React, AWS & More | DevWay',
    description:
      'Structured, hands-on courses across web technologies — from core React to the AWS Cloud Practitioner certification — with quizzes, tasks, and built-in progress tracking.',
  },
  '/course': {
    title: 'React Course — Hands-On Lessons with Progress Tracking | DevWay',
    description:
      "Work through DevWay's structured React course: components, hooks, state and routing with hands-on exercises and built-in progress tracking.",
    noindex: true,
  },
  '/course/react': {
    title: 'React Course — Hands-On Lessons with Progress Tracking | DevWay',
    description:
      'A structured, hands-on React course: components, hooks, rendering, performance, internals and React 19 — with exercises and progress tracking.',
    noindex: true,
  },
  '/course/aws-cloud-practitioner': {
    title: 'AWS Cloud Practitioner Essentials Course (CLF-C02) | DevWay',
    description:
      'Prepare for the AWS Certified Cloud Practitioner (CLF-C02) exam: cloud concepts, security & compliance, core AWS services, and billing — with quizzes and tasks.',
    noindex: true,
  },
  '/course/nestjs': {
    title: 'NestJS Essentials Course — Build Node.js Back Ends | DevWay',
    description:
      'A hands-on NestJS course: modules, controllers, providers, dependency injection, the request lifecycle, validation, databases, authentication, testing and more.',
    noindex: true,
  },
  '/roadmap': {
    title: 'Learning Roadmaps | DevWay',
    description:
      'Each DevWay course has its own step-by-step roadmap. Browse the courses to choose a learning path.',
    // Bare /roadmap redirects to the catalogue; per-course roadmaps are the real pages.
    noindex: true,
  },
  '/roadmap/react': {
    title: 'React Learning Roadmap — Step-by-Step Path | DevWay',
    description:
      'Follow the DevWay roadmap: a clear, ordered path from React fundamentals to advanced topics. Know exactly what to learn next.',
  },
  '/roadmap/aws-cloud-practitioner': {
    title: 'AWS Cloud Practitioner Roadmap — CLF-C02 Exam Domains | DevWay',
    description:
      'A step-by-step roadmap to the AWS Cloud Practitioner exam, ordered by the four CLF-C02 domains: cloud concepts, security, services, and billing.',
  },
  '/roadmap/nestjs': {
    title: 'NestJS Roadmap — From Fundamentals to Production | DevWay',
    description:
      'A clear, ordered NestJS learning path: fundamentals and dependency injection, building APIs and the request lifecycle, data & architecture, and advanced production topics.',
  },
  '/about': {
    title: 'About DevWay — Learn Web Development the Right Way',
    description:
      'DevWay organises web development into deliberate learning paths: structured courses, concept roadmaps, and built-in progress tracking — from React to AWS.',
  },
  '/contact': {
    title: 'Contact DevWay',
    description:
      'Get in touch with the DevWay team about the course, the roadmap, feedback, privacy requests, or advertising enquiries.',
  },
  '/privacy': {
    title: 'Privacy Policy | DevWay',
    description:
      'How DevWay handles your information, including cookies, Google AdSense and third-party advertising, analytics, and your privacy choices.',
  },
  '/terms': {
    title: 'Terms of Service | DevWay',
    description:
      'The terms that govern your use of the DevWay website: acceptable use, intellectual property, disclaimers, and liability.',
  },
  404: {
    title: 'Page not found · DevWay',
    description: 'The page you’re looking for doesn’t exist or has moved.',
    noindex: true,
  },
};

// Blog index + one entry per article (keeps client titles and prerendered <head> in sync).
routeMeta['/blog'] = {
  title: 'React Articles & Guides | DevWay',
  description:
    'In-depth, practical guides to core React concepts: hooks, rendering, components, forms, and performance.',
};
for (const a of articles) {
  routeMeta[`/blog/${a.slug}`] = {
    title: `${a.title} | DevWay`,
    description: a.description,
  };
}
