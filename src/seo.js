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

// Standalone tech courses (added in bulk). Both the course and roadmap pages are
// indexable — each is unique, original content. Keep this list in sync with the
// registry in src/data/courses/index.js and the routes in prerender.mjs.
const techCourses = [
  {
    id: 'docker',
    title: 'Docker Course — Containers from Zero to Production | DevWay',
    course:
      'Learn Docker end to end: containers vs VMs, the Docker architecture, writing Dockerfiles, image layers and the build cache, multi-stage builds, the container lifecycle, volumes and networking, registries, Docker Compose, and production security and CI/CD — with Dockerfiles, diagrams, quizzes and tasks.',
    roadmapTitle: 'Docker Roadmap — From Containers to Production | DevWay',
    roadmap:
      'fundamentals, building images, running and operating containers, data and networking, and Compose and production',
  },
  {
    id: 'kubernetes',
    title: 'Kubernetes Course — Orchestration to Production | DevWay',
    course:
      'Learn Kubernetes end to end: the declarative desired-state model and cluster architecture, pods and controllers, Services, Ingress and DNS, ConfigMaps and Secrets, storage and persistent volumes, resource management and autoscaling, and production operations with RBAC, observability, Helm and GitOps — with manifests, diagrams, quizzes and tasks.',
    roadmapTitle: 'Kubernetes Roadmap — Fundamentals to Production | DevWay',
    roadmap:
      'fundamentals and architecture, workloads, networking and exposure, configuration/storage/scaling, and operations and production',
  },
  {
    id: 'devops',
    title: 'DevOps Course — CI/CD, IaC and Reliability | DevWay',
    course:
      'Learn DevOps end to end: culture and DORA metrics, continuous integration and delivery, infrastructure as code with Terraform and Ansible, containers and Kubernetes, and observability, SRE and DevSecOps — with diagrams, code and hands-on tasks.',
    roadmapTitle: 'DevOps Roadmap — Culture to Reliability | DevWay',
    roadmap:
      'foundations and culture, CI/CD pipelines, infrastructure as code, containers and cloud delivery, and observability, reliability and security',
  },
  {
    id: 'networking',
    title: 'Computer Networking Course — Cables to the Cloud | DevWay',
    course:
      'Learn how networks really work: the OSI and TCP/IP models, Ethernet/MAC/ARP, IPv4/IPv6, subnets, CIDR and NAT, routing, TCP vs UDP, DNS and DHCP, HTTP/2 and HTTP/3, TLS and PKI, email and SSH protocols, CLI troubleshooting, firewalls and VPNs, and load balancers and CDNs — with diagrams, quizzes and tasks.',
    roadmapTitle: 'Computer Networking Roadmap — Step by Step | DevWay',
    roadmap:
      'foundations and models, the lower layers, transport and core services, the application layer and the web, and operations and security',
  },
  {
    id: 'linux',
    title: 'Linux & Command Line Course — Shell to Server | DevWay',
    course:
      'Become fluent on the Linux command line: the kernel and distributions, the shell and filesystem, files and text with grep/sed/awk, pipes and redirection, permissions and ownership, processes and packages, services and systemd, networking, disks, and Bash scripting, automation and hardening — with realistic commands, diagrams, quizzes and tasks.',
    roadmapTitle: 'Linux Roadmap — From Shell to Server | DevWay',
    roadmap:
      'fundamentals, files and text, permissions/processes/packages, system administration, and scripting and hardening',
  },
  {
    id: 'git',
    title: 'Git & GitHub Course — Version Control for Pros | DevWay',
    course:
      'Master Git and GitHub: the distributed model and the three areas, reading history, branching, merging and rebasing, remotes and pull requests, team workflows, undoing and rewriting history, tags and releases, and advanced topics like bisect, hooks, conventional commits, submodules and LFS — with command examples, diagrams, quizzes and tasks.',
    roadmapTitle: 'Git & GitHub Roadmap — Step by Step | DevWay',
    roadmap:
      'fundamentals, branching and integrating, remotes and collaboration, fixing and rewriting history, and advanced professional topics',
  },
  {
    id: 'javascript',
    title: 'JavaScript Course — Fundamentals to Mastery | DevWay',
    course:
      'Learn JavaScript properly: how JS runs, variables and types, operators and control flow, functions, scope, hoisting and closures, the this keyword, objects and arrays, modern ES syntax, the event loop, Promises and async/await, fetch, the DOM and events, error handling, and prototypes and classes — with code, diagrams, quizzes and tasks.',
    roadmapTitle: 'JavaScript Roadmap — Step by Step | DevWay',
    roadmap:
      'fundamentals, functions and scope, data and built-ins, modern and asynchronous JavaScript, and the browser and OOP',
  },
  {
    id: 'typescript',
    title: 'TypeScript Course — Typed JavaScript at Scale | DevWay',
    course:
      'Learn TypeScript: why TS and the compile step, basic and composite types, interfaces, unions/literals/narrowing, enums, generics and constraints, utility types, advanced type tools like keyof and conditional and mapped types, classes and OOP, type guards, tsconfig and strict mode, declaration files and @types, and TS with Node and React — with code, diagrams, quizzes and tasks.',
    roadmapTitle: 'TypeScript Roadmap — Step by Step | DevWay',
    roadmap:
      'fundamentals, object and composite types, generics and advanced types, classes and OOP, and tooling and real-world TypeScript',
  },
  {
    id: 'nodejs',
    title: 'Node.js Course — Server-Side JavaScript | DevWay',
    course:
      'Learn Node.js end to end: the V8 and libuv runtime, modules (CommonJS and ESM), the event loop and non-blocking I/O, the file system, events and streams, process and globals, the http module, async patterns and error handling, npm and package.json, configuration and environment, databases and APIs, performance and scaling, and debugging, testing and deployment — with code, diagrams, quizzes and tasks.',
    roadmapTitle: 'Node.js Roadmap — Fundamentals to Production | DevWay',
    roadmap:
      'fundamentals, core modules, building servers and async, npm and the ecosystem, and production Node.js',
  },
  {
    id: 'express',
    title: 'Express Course — Build Web APIs with Node.js | DevWay',
    course:
      'Learn Express: a minimal server over Node http, routing and route parameters, the request and response objects, the middleware pipeline, built-in and third-party middleware, error-handling middleware, RESTful API design, working with data and databases, structuring an app, authentication and sessions, templating and uploads, and production security, performance, testing and deployment — with code, diagrams, quizzes and tasks.',
    roadmapTitle: 'Express Roadmap — Fundamentals to Production | DevWay',
    roadmap:
      'fundamentals, middleware, building REST APIs, auth/views/uploads, and production Express',
  },
];
for (const c of techCourses) {
  routeMeta[`/course/${c.id}`] = {
    title: c.title,
    description: c.course,
  };
  routeMeta[`/roadmap/${c.id}`] = {
    title: c.roadmapTitle,
    description: `A step-by-step roadmap covering ${c.roadmap}.`,
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
