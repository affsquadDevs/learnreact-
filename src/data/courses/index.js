// Course registry. Every course on the platform is built here from a content
// document via the shared factory, then exposed through `courses`, `getCourse`,
// and `DEFAULT_COURSE_ID`. Adding a new technology = add one content file + one
// descriptor entry below.

import { createCourse } from './factory';
import reactContent from '../courseContent.json';
import awsContent from './awsCloudPractitioner.content';
import nestContent from './nestjs.content';
import awsAiContent from './aiPractitioner.content';
import awsSaaContent from './solutionsArchitectAssociate.content';
import awsDvaContent from './developerAssociate.content';
import awsSoaContent from './cloudOpsAssociate.content';
import awsDeaContent from './dataEngineerAssociate.content';
import awsMlaContent from './machineLearningEngineerAssociate.content';
import awsSapContent from './solutionsArchitectProfessional.content';
import awsDopContent from './devOpsEngineerProfessional.content';
import awsAnsContent from './advancedNetworkingSpecialty.content';
import awsScsContent from './securitySpecialty.content';

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

const awsAiCourse = createCourse(
  {
    id: 'aws-ai-practitioner',
    slug: 'aws-ai-practitioner',
    title: 'AWS Certified AI Practitioner',
    shortTitle: 'AWS AI Practitioner',
    subtitle:
      'Everything you need for the AWS Certified AI Practitioner (AIF-C01) exam, by domain.',
    tech: 'AWS',
    category: 'Cloud / DevOps',
    icon: 'aws',
    accent: '#7c4ddb',
    soft: '#f1ebfd',
    level: 'Foundational',
    duration: '~20 hours',
    status: 'available',
    summary:
      'Complete AIF-C01 coverage: AI & ML fundamentals, generative AI, foundation models (Bedrock, SageMaker), prompt engineering & RAG, responsible AI, and AI security & governance — with diagrams, quizzes and tasks.',
    courseKey: 'learnweb.aws-aif.progress.v1',
    roadmapKey: 'learnweb.aws-aif.roadmap.v1',
    eventName: 'learnweb:progress:aws-aif',
    roadmapTitle: 'AWS AI Practitioner Roadmap',
    roadmapDescription:
      'The five AWS Certified AI Practitioner (AIF-C01) exam domains: AI & ML fundamentals, generative AI fundamentals, applications of foundation models, responsible AI, and security, compliance & governance for AI.',
  },
  awsAiContent
);

const awsSaaCourse = createCourse(
  {
    id: 'aws-solutions-architect-associate',
    slug: 'aws-solutions-architect-associate',
    title: 'AWS Certified Solutions Architect – Associate',
    shortTitle: 'AWS Solutions Architect',
    subtitle:
      'Everything you need for the AWS Certified Solutions Architect – Associate (SAA-C03) exam, by domain.',
    tech: 'AWS',
    category: 'Cloud / DevOps',
    icon: 'aws',
    accent: '#ec7211',
    soft: '#fff1e2',
    level: 'Associate',
    duration: '~45 hours',
    status: 'available',
    summary:
      'Complete SAA-C03 coverage: designing secure, resilient, high-performing and cost-optimized architectures — IAM, VPC, encryption, HA/DR, decoupling, data stores, performance and cost — with diagrams, quizzes and tasks.',
    courseKey: 'learnweb.aws-saa.progress.v1',
    roadmapKey: 'learnweb.aws-saa.roadmap.v1',
    eventName: 'learnweb:progress:aws-saa',
    roadmapTitle: 'AWS Solutions Architect – Associate Roadmap',
    roadmapDescription:
      'The four AWS Certified Solutions Architect – Associate (SAA-C03) exam domains: design secure, resilient, high-performing and cost-optimized architectures.',
  },
  awsSaaContent
);

const awsDvaCourse = createCourse(
  {
    id: 'aws-developer-associate',
    slug: 'aws-developer-associate',
    title: 'AWS Certified Developer – Associate',
    shortTitle: 'AWS Developer',
    subtitle:
      'Everything you need for the AWS Certified Developer – Associate (DVA-C02) exam, by domain.',
    tech: 'AWS',
    category: 'Cloud / DevOps',
    icon: 'aws',
    accent: '#2e73b8',
    soft: '#e7f0fa',
    level: 'Associate',
    duration: '~40 hours',
    status: 'available',
    summary:
      'Complete DVA-C02 coverage: developing with AWS services (Lambda, API Gateway, DynamoDB, S3, messaging), application security, deployment with CI/CD and IaC, and troubleshooting & optimization — with code, diagrams, quizzes and tasks.',
    courseKey: 'learnweb.aws-dva.progress.v1',
    roadmapKey: 'learnweb.aws-dva.roadmap.v1',
    eventName: 'learnweb:progress:aws-dva',
    roadmapTitle: 'AWS Developer – Associate Roadmap',
    roadmapDescription:
      'The four AWS Certified Developer – Associate (DVA-C02) exam domains: development with AWS services, security, deployment, and troubleshooting & optimization.',
  },
  awsDvaContent
);

const awsSoaCourse = createCourse(
  {
    id: 'aws-cloudops-associate',
    slug: 'aws-cloudops-associate',
    title: 'AWS Certified CloudOps Engineer – Associate',
    shortTitle: 'AWS CloudOps Engineer',
    subtitle:
      'Everything you need for the AWS Certified CloudOps Engineer – Associate (SOA-C02) exam, by domain.',
    tech: 'AWS',
    category: 'Cloud / DevOps',
    icon: 'aws',
    accent: '#1ba85a',
    soft: '#e6f7ee',
    level: 'Associate',
    duration: '~40 hours',
    status: 'available',
    summary:
      'Complete coverage of the AWS CloudOps Engineer – Associate (SOA-C02) exam: monitoring, logging & remediation, reliability & business continuity, deployment & automation, security & compliance, networking, and cost & performance — with diagrams, quizzes and tasks.',
    courseKey: 'learnweb.aws-soa.progress.v1',
    roadmapKey: 'learnweb.aws-soa.roadmap.v1',
    eventName: 'learnweb:progress:aws-soa',
    roadmapTitle: 'AWS CloudOps Engineer – Associate Roadmap',
    roadmapDescription:
      'The six AWS Certified CloudOps Engineer – Associate (SOA-C02) exam domains: monitoring & remediation, reliability & business continuity, deployment & automation, security & compliance, networking & content delivery, and cost & performance optimization.',
  },
  awsSoaContent
);

const awsDeaCourse = createCourse(
  {
    id: 'aws-data-engineer-associate',
    slug: 'aws-data-engineer-associate',
    title: 'AWS Certified Data Engineer – Associate',
    shortTitle: 'AWS Data Engineer',
    subtitle:
      'Everything you need for the AWS Certified Data Engineer – Associate (DEA-C01) exam, by domain.',
    tech: 'AWS',
    category: 'Cloud / DevOps',
    icon: 'aws',
    accent: '#7c4dff',
    soft: '#f0ebff',
    level: 'Associate',
    duration: '~40 hours',
    status: 'available',
    summary:
      'Complete DEA-C01 coverage: data ingestion & transformation (Kinesis, Glue, EMR, Athena), data store management (S3 data lakes, Redshift, DynamoDB), data operations & support, and data security & governance — with code, diagrams, quizzes and tasks.',
    courseKey: 'learnweb.aws-dea.progress.v1',
    roadmapKey: 'learnweb.aws-dea.roadmap.v1',
    eventName: 'learnweb:progress:aws-dea',
    roadmapTitle: 'AWS Data Engineer – Associate Roadmap',
    roadmapDescription:
      'The four AWS Certified Data Engineer – Associate (DEA-C01) exam domains: data ingestion & transformation, data store management, data operations & support, and data security & governance.',
  },
  awsDeaContent
);

const awsMlaCourse = createCourse(
  {
    id: 'aws-ml-engineer-associate',
    slug: 'aws-ml-engineer-associate',
    title: 'AWS Certified Machine Learning Engineer – Associate',
    shortTitle: 'AWS ML Engineer',
    subtitle:
      'Everything you need for the AWS Certified Machine Learning Engineer – Associate (MLA-C01) exam, by domain.',
    tech: 'AWS',
    category: 'Cloud / DevOps',
    icon: 'aws',
    accent: '#d4458a',
    soft: '#fbe8f1',
    level: 'Associate',
    duration: '~40 hours',
    status: 'available',
    summary:
      'Complete MLA-C01 coverage: data preparation for ML, model development (SageMaker training, tuning, evaluation), deployment & orchestration of ML workflows (endpoints, pipelines, MLOps), and ML monitoring, maintenance & security — with diagrams, quizzes and tasks.',
    courseKey: 'learnweb.aws-mla.progress.v1',
    roadmapKey: 'learnweb.aws-mla.roadmap.v1',
    eventName: 'learnweb:progress:aws-mla',
    roadmapTitle: 'AWS Machine Learning Engineer – Associate Roadmap',
    roadmapDescription:
      'The four AWS Certified Machine Learning Engineer – Associate (MLA-C01) exam domains: data preparation, ML model development, deployment & orchestration of ML workflows, and ML solution monitoring, maintenance & security.',
  },
  awsMlaContent
);

const awsSapCourse = createCourse(
  {
    id: 'aws-solutions-architect-professional',
    slug: 'aws-solutions-architect-professional',
    title: 'AWS Certified Solutions Architect – Professional',
    shortTitle: 'AWS Solutions Architect Pro',
    subtitle:
      'Everything you need for the AWS Certified Solutions Architect – Professional (SAP-C02) exam, by domain.',
    tech: 'AWS',
    category: 'Cloud / DevOps',
    icon: 'aws',
    accent: '#c2410c',
    soft: '#ffe9dd',
    level: 'Professional',
    duration: '~55 hours',
    status: 'available',
    summary:
      'Complete SAP-C02 coverage: designing for organizational complexity (multi-account, networking, governance), designing new solutions at scale, continuous improvement of existing solutions, and accelerating migration & modernization — with trade-off-focused scenarios, diagrams and quizzes.',
    courseKey: 'learnweb.aws-sap.progress.v1',
    roadmapKey: 'learnweb.aws-sap.roadmap.v1',
    eventName: 'learnweb:progress:aws-sap',
    roadmapTitle: 'AWS Solutions Architect – Professional Roadmap',
    roadmapDescription:
      'The four AWS Certified Solutions Architect – Professional (SAP-C02) exam domains: design solutions for organizational complexity, design for new solutions, continuous improvement for existing solutions, and accelerate workload migration & modernization.',
  },
  awsSapContent
);

const awsDopCourse = createCourse(
  {
    id: 'aws-devops-engineer-professional',
    slug: 'aws-devops-engineer-professional',
    title: 'AWS Certified DevOps Engineer – Professional',
    shortTitle: 'AWS DevOps Engineer Pro',
    subtitle:
      'Everything you need for the AWS Certified DevOps Engineer – Professional (DOP-C02) exam, by domain.',
    tech: 'AWS',
    category: 'Cloud / DevOps',
    icon: 'aws',
    accent: '#0e7490',
    soft: '#def0f3',
    level: 'Professional',
    duration: '~55 hours',
    status: 'available',
    summary:
      'Complete DOP-C02 coverage: SDLC automation & CI/CD, configuration management & IaC, resilient cloud solutions, monitoring & logging, incident & event response, and security & compliance — with CloudFormation/pipeline code, diagrams and quizzes.',
    courseKey: 'learnweb.aws-dop.progress.v1',
    roadmapKey: 'learnweb.aws-dop.roadmap.v1',
    eventName: 'learnweb:progress:aws-dop',
    roadmapTitle: 'AWS DevOps Engineer – Professional Roadmap',
    roadmapDescription:
      'The six AWS Certified DevOps Engineer – Professional (DOP-C02) exam domains: SDLC automation, configuration management & IaC, resilient cloud solutions, monitoring & logging, incident & event response, and security & compliance.',
  },
  awsDopContent
);

const awsAnsCourse = createCourse(
  {
    id: 'aws-advanced-networking-specialty',
    slug: 'aws-advanced-networking-specialty',
    title: 'AWS Certified Advanced Networking – Specialty',
    shortTitle: 'AWS Advanced Networking',
    subtitle:
      'Everything you need for the AWS Certified Advanced Networking – Specialty (ANS-C01) exam, by domain.',
    tech: 'AWS',
    category: 'Cloud / DevOps',
    icon: 'aws',
    accent: '#8c4fff',
    soft: '#f0e9ff',
    level: 'Specialty',
    duration: '~45 hours',
    status: 'available',
    summary:
      'Complete ANS-C01 coverage: network design (VPC, hybrid connectivity, DNS), network implementation (Transit Gateway, Direct Connect, VPN, load balancing), network management & operation, and network security, compliance & governance — with diagrams, quizzes and tasks.',
    courseKey: 'learnweb.aws-ans.progress.v1',
    roadmapKey: 'learnweb.aws-ans.roadmap.v1',
    eventName: 'learnweb:progress:aws-ans',
    roadmapTitle: 'AWS Advanced Networking – Specialty Roadmap',
    roadmapDescription:
      'The four AWS Certified Advanced Networking – Specialty (ANS-C01) exam domains: network design, network implementation, network management & operation, and network security, compliance & governance.',
  },
  awsAnsContent
);

const awsScsCourse = createCourse(
  {
    id: 'aws-security-specialty',
    slug: 'aws-security-specialty',
    title: 'AWS Certified Security – Specialty',
    shortTitle: 'AWS Security',
    subtitle:
      'Everything you need for the AWS Certified Security – Specialty (SCS-C02) exam, by domain.',
    tech: 'AWS',
    category: 'Cloud / DevOps',
    icon: 'aws',
    accent: '#dd344c',
    soft: '#fde8ed',
    level: 'Specialty',
    duration: '~45 hours',
    status: 'available',
    summary:
      'Complete SCS-C02 coverage: threat detection & incident response, security logging & monitoring, infrastructure security, identity & access management, data protection (KMS), and management & security governance — with policy code, diagrams, quizzes and tasks.',
    courseKey: 'learnweb.aws-scs.progress.v1',
    roadmapKey: 'learnweb.aws-scs.roadmap.v1',
    eventName: 'learnweb:progress:aws-scs',
    roadmapTitle: 'AWS Security – Specialty Roadmap',
    roadmapDescription:
      'The six AWS Certified Security – Specialty (SCS-C02) exam domains: threat detection & incident response, security logging & monitoring, infrastructure security, identity & access management, data protection, and management & security governance.',
  },
  awsScsContent
);

export const courses = [
  reactCourse,
  nestCourse,
  awsCourse,
  awsAiCourse,
  awsSaaCourse,
  awsDvaCourse,
  awsSoaCourse,
  awsDeaCourse,
  awsMlaCourse,
  awsSapCourse,
  awsDopCourse,
  awsAnsCourse,
  awsScsCourse,
];

export const DEFAULT_COURSE_ID = 'react';

const byId = Object.fromEntries(courses.map((c) => [c.id, c]));

export function getCourse(id) {
  return byId[id] ?? byId[DEFAULT_COURSE_ID];
}

export function hasCourse(id) {
  return Boolean(byId[id]);
}
