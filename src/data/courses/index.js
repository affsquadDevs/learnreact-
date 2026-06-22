// Course registry. Every course on the platform is built here from a content
// document via the shared factory, then exposed through `courses`, `getCourse`,
// and `DEFAULT_COURSE_ID`. Adding a new technology = add one content file + one
// descriptor entry below.

import { createCourse } from './factory';
import reactContent from '../courseContent.json';
import awsContent from './awsCloudPractitioner.content';
import nestContent from './nestjs.content';

// React keeps its original localStorage keys so existing learner progress is
// preserved. New courses use namespaced keys derived from their id.
const reactCourse = createCourse(
  {
    id: 'react',
    slug: 'react',
    title: 'The Right Way to Learn React',
    shortTitle: 'React',
    subtitle:
      'A structured map of core React concepts, from fundamentals to modern internals.',
    tech: 'React',
    category: 'Frontend',
    icon: 'react',
    accent: '#2d6bff',
    soft: '#eaf0ff',
    level: 'Beginner → Advanced',
    duration: '~40 hours',
    status: 'available',
    summary:
      'Core React only (react + react-dom): components, hooks, rendering, performance, internals, and React 19.',
    courseKey: 'reactway.progress.v1',
    roadmapKey: 'reactway.roadmap.v1',
    eventName: 'reactway:progress',
    roadmapTitle: 'React Library Concepts Roadmap',
    roadmapDescription:
      'Core React only (react + react-dom). Excludes ecosystem tooling such as React Router, Redux/Zustand, TanStack Query, TypeScript, testing libraries, Tailwind, Next.js, and bundlers. These surround React but are not React itself.',
  },
  reactContent
);

const awsCourse = createCourse(
  {
    id: 'aws-cloud-practitioner',
    slug: 'aws-cloud-practitioner',
    title: 'AWS Cloud Practitioner Essentials',
    shortTitle: 'AWS Cloud Practitioner',
    subtitle:
      'Everything you need for the AWS Certified Cloud Practitioner (CLF-C02) exam, by domain.',
    tech: 'AWS',
    category: 'Cloud / DevOps',
    icon: 'aws',
    accent: '#e8862a',
    soft: '#fff1e2',
    level: 'Beginner',
    duration: '~30 hours',
    status: 'available',
    summary:
      'Complete CLF-C02 coverage: cloud concepts, security & compliance, the core AWS services (compute, storage, databases, networking, delivery, scaling, monitoring, integration, analytics) and billing, pricing & support — with diagrams, quizzes and tasks.',
    courseKey: 'learnweb.aws-clf.progress.v1',
    roadmapKey: 'learnweb.aws-clf.roadmap.v1',
    eventName: 'learnweb:progress:aws-clf',
    roadmapTitle: 'AWS Cloud Practitioner Roadmap',
    roadmapDescription:
      'The four AWS Certified Cloud Practitioner (CLF-C02) exam domains, in order: cloud concepts, security & compliance, cloud technology & services, and billing, pricing & support.',
  },
  awsContent
);

const nestCourse = createCourse(
  {
    id: 'nestjs',
    slug: 'nestjs',
    title: 'NestJS Essentials',
    shortTitle: 'NestJS',
    subtitle:
      'Build robust, scalable Node.js back ends with NestJS — from modules and DI to auth, testing and production.',
    tech: 'NestJS',
    category: 'Backend',
    icon: 'nestjs',
    accent: '#e0234e',
    soft: '#fde8ec',
    level: 'Beginner → Advanced',
    duration: '~25 hours',
    status: 'available',
    summary:
      'A full backend path: modules, controllers, providers, dependency injection, the request lifecycle, validation, databases, authentication, testing, and going beyond REST — with TypeScript code and tasks.',
    courseKey: 'learnweb.nestjs.progress.v1',
    roadmapKey: 'learnweb.nestjs.roadmap.v1',
    eventName: 'learnweb:progress:nestjs',
    roadmapTitle: 'NestJS Roadmap',
    roadmapDescription:
      'A step-by-step path through NestJS: fundamentals (modules, controllers, providers, DI), building HTTP APIs and the request lifecycle, data & architecture, and advanced production topics.',
  },
  nestContent
);

export const courses = [reactCourse, nestCourse, awsCourse];

export const DEFAULT_COURSE_ID = 'react';

const byId = Object.fromEntries(courses.map((c) => [c.id, c]));

export function getCourse(id) {
  return byId[id] ?? byId[DEFAULT_COURSE_ID];
}

export function hasCourse(id) {
  return Boolean(byId[id]);
}
