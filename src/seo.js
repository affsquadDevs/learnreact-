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

// AWS certification courses (added in bulk). Course pages are noindex (thin/duplicate
// intent across many certs); per-course roadmap pages are indexable. Keep this list in
// sync with the registry in src/data/courses/index.js and the routes in prerender.mjs.
const awsCerts = [
  {
    id: 'aws-ai-practitioner', code: 'AIF-C01', name: 'AWS Certified AI Practitioner',
    course: 'AI & ML fundamentals, generative AI, foundation models, prompt engineering & RAG, responsible AI, and AI security & governance',
    roadmap: 'the five AIF-C01 domains: AI & ML fundamentals, generative AI, applications of foundation models, responsible AI, and security & governance',
  },
  {
    id: 'aws-solutions-architect-associate', code: 'SAA-C03', name: 'AWS Certified Solutions Architect – Associate',
    course: 'designing secure, resilient, high-performing and cost-optimized architectures — IAM, VPC, encryption, HA/DR, decoupling, data stores, performance and cost',
    roadmap: 'the four SAA-C03 domains: secure, resilient, high-performing and cost-optimized architectures',
  },
  {
    id: 'aws-developer-associate', code: 'DVA-C02', name: 'AWS Certified Developer – Associate',
    course: 'developing with AWS services (Lambda, API Gateway, DynamoDB, S3, messaging), application security, deployment with CI/CD and IaC, and troubleshooting & optimization',
    roadmap: 'the four DVA-C02 domains: development with AWS services, security, deployment, and troubleshooting & optimization',
  },
  {
    id: 'aws-cloudops-associate', code: 'SOA-C02', name: 'AWS Certified CloudOps Engineer – Associate',
    course: 'monitoring, logging & remediation, reliability & business continuity, deployment & automation, security & compliance, networking, and cost & performance optimization',
    roadmap: 'the six SOA-C02 domains spanning monitoring, reliability, automation, security, networking, and cost & performance',
  },
  {
    id: 'aws-data-engineer-associate', code: 'DEA-C01', name: 'AWS Certified Data Engineer – Associate',
    course: 'data ingestion & transformation (Kinesis, Glue, EMR, Athena), data store management (S3 data lakes, Redshift, DynamoDB), data operations, and data security & governance',
    roadmap: 'the four DEA-C01 domains: ingestion & transformation, data store management, data operations & support, and data security & governance',
  },
  {
    id: 'aws-ml-engineer-associate', code: 'MLA-C01', name: 'AWS Certified Machine Learning Engineer – Associate',
    course: 'data preparation for ML, model development with SageMaker, deployment & orchestration of ML workflows, and ML monitoring, maintenance & security',
    roadmap: 'the four MLA-C01 domains: data preparation, model development, deployment & orchestration, and monitoring, maintenance & security',
  },
  {
    id: 'aws-solutions-architect-professional', code: 'SAP-C02', name: 'AWS Certified Solutions Architect – Professional',
    course: 'designing for organizational complexity, designing new solutions at scale, continuous improvement of existing solutions, and accelerating migration & modernization',
    roadmap: 'the four SAP-C02 domains: organizational complexity, new solutions, continuous improvement, and migration & modernization',
  },
  {
    id: 'aws-devops-engineer-professional', code: 'DOP-C02', name: 'AWS Certified DevOps Engineer – Professional',
    course: 'SDLC automation & CI/CD, configuration management & IaC, resilient cloud solutions, monitoring & logging, incident & event response, and security & compliance',
    roadmap: 'the six DOP-C02 domains spanning SDLC automation, IaC, resilient solutions, monitoring, incident response, and security',
  },
  {
    id: 'aws-advanced-networking-specialty', code: 'ANS-C01', name: 'AWS Certified Advanced Networking – Specialty',
    course: 'network design (VPC, hybrid connectivity, DNS), implementation (Transit Gateway, Direct Connect, VPN, load balancing), management & operation, and network security',
    roadmap: 'the four ANS-C01 domains: network design, implementation, management & operation, and security, compliance & governance',
  },
  {
    id: 'aws-security-specialty', code: 'SCS-C02', name: 'AWS Certified Security – Specialty',
    course: 'threat detection & incident response, security logging & monitoring, infrastructure security, identity & access management, data protection (KMS), and security governance',
    roadmap: 'the six SCS-C02 domains spanning threat detection, logging & monitoring, infrastructure security, IAM, data protection, and governance',
  },
];
for (const c of awsCerts) {
  routeMeta[`/course/${c.id}`] = {
    title: `${c.name} Course (${c.code}) | DevWay`,
    description: `Prepare for the ${c.name} (${c.code}) exam: ${c.course} — with diagrams, quizzes and hands-on tasks.`,
    noindex: true,
  };
  routeMeta[`/roadmap/${c.id}`] = {
    title: `${c.name} Roadmap (${c.code}) | DevWay`,
    description: `A step-by-step roadmap to the ${c.name} exam, ordered by ${c.roadmap}.`,
  };
}

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
