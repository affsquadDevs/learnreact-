// Course registry. Every course on the platform is built here from a content
// document via the shared factory, then exposed through `courses`, `getCourse`,
// and `DEFAULT_COURSE_ID`. Adding a new technology = add one content file + one
// descriptor entry below.

import { createCourse } from './factory';
import reactContent from '../courseContent.json';
import awsContent from './awsCloudPractitioner.content';
import nestContent from './nestjs.content';
import devopsContent from './devops.content';
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
import kubernetesContent from './kubernetes.content';
import dockerContent from './docker.content';
import networkingContent from './networking.content';
import linuxContent from './linux.content';
import gitContent from './git.content';
import javascriptContent from './javascript.content';
import typescriptContent from './typescript.content';
import nodejsContent from './nodejs.content';
import expressContent from './express.content';

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

const devopsCourse = createCourse(
  {
    id: 'devops',
    slug: 'devops',
    title: 'DevOps: Culture, CI/CD, Infrastructure and Reliability',
    shortTitle: 'DevOps',
    subtitle:
      'A comprehensive DevOps path — from culture and collaboration to CI/CD, infrastructure as code, containers, cloud delivery, observability and reliability.',
    tech: 'DevOps',
    category: 'Cloud / DevOps',
    icon: 'devops',
    accent: '#f97316',
    soft: '#fff0e6',
    level: 'Beginner → Advanced',
    duration: '~30 hours',
    status: 'available',
    summary:
      'Learn DevOps end to end: culture and DORA metrics, continuous integration and delivery, infrastructure as code with Terraform and Ansible, containers and Kubernetes, and observability, SRE and DevSecOps — with diagrams, code and hands-on tasks.',
    courseKey: 'learnweb.devops.progress.v1',
    roadmapKey: 'learnweb.devops.roadmap.v1',
    eventName: 'learnweb:progress:devops',
    roadmapTitle: 'DevOps Roadmap',
    roadmapDescription:
      'A step-by-step path through DevOps: foundations and culture, CI/CD pipelines, infrastructure as code, containers and cloud delivery, and observability, reliability and security.',
  },
  devopsContent
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

const kubernetesCourse = createCourse(
  {
    id: 'kubernetes',
    slug: 'kubernetes',
    title: 'Kubernetes: Orchestration from Fundamentals to Production',
    shortTitle: 'Kubernetes',
    subtitle:
      'Learn Kubernetes end to end — from the orchestration problem and cluster architecture to workloads, networking, storage, scaling, security and production operations.',
    tech: 'Kubernetes',
    category: 'Cloud / DevOps',
    icon: 'kubernetes',
    accent: '#326ce5',
    soft: '#e7eefc',
    level: 'Beginner → Advanced',
    duration: '~35 hours',
    status: 'available',
    summary:
      'A complete Kubernetes path: the declarative desired-state model and architecture, pods and controllers, Services/Ingress/DNS and the network model, ConfigMaps/Secrets, storage and PVs, resource management and autoscaling, and production operations (RBAC, observability, Helm and GitOps) — with manifests, diagrams, quizzes and tasks.',
    courseKey: 'learnweb.k8s.progress.v1',
    roadmapKey: 'learnweb.k8s.roadmap.v1',
    eventName: 'learnweb:progress:k8s',
    roadmapTitle: 'Kubernetes Roadmap',
    roadmapDescription:
      'A step-by-step path through Kubernetes: fundamentals and architecture, workloads, networking and exposure, configuration/storage/scaling, and operations and production.',
  },
  kubernetesContent
);

const dockerCourse = createCourse(
  {
    id: 'docker',
    slug: 'docker',
    title: 'Docker: Containers from Zero to Production',
    shortTitle: 'Docker',
    subtitle:
      'Master Docker end to end — from containers vs VMs and the Docker architecture to building images, volumes, networking, Compose and production-grade security.',
    tech: 'Docker',
    category: 'Cloud / DevOps',
    icon: 'docker',
    accent: '#2496ed',
    soft: '#e6f4fd',
    level: 'Beginner → Advanced',
    duration: '~25 hours',
    status: 'available',
    summary:
      'A complete Docker path: containers vs VMs and the client/daemon/registry architecture, writing Dockerfiles, layers and build cache, multi-stage builds, the container lifecycle, volumes and networking, registries, Docker Compose, and production security and CI/CD — with Dockerfiles, diagrams, quizzes and tasks.',
    courseKey: 'learnweb.docker.progress.v1',
    roadmapKey: 'learnweb.docker.roadmap.v1',
    eventName: 'learnweb:progress:docker',
    roadmapTitle: 'Docker Roadmap',
    roadmapDescription:
      'A step-by-step path through Docker: fundamentals, building images, running and operating containers, data and networking, and Compose and production.',
  },
  dockerContent
);

const networkingCourse = createCourse(
  {
    id: 'networking',
    slug: 'networking',
    title: 'Computer Networking: From Cables to the Cloud',
    shortTitle: 'Networking',
    subtitle:
      'Understand how networks really work — the OSI and TCP/IP models, IP addressing and routing, TCP/UDP, DNS, HTTP/HTTPS and TLS, plus tooling, troubleshooting and security.',
    tech: 'Networking',
    category: 'Fundamentals',
    icon: 'network',
    accent: '#0ea5e9',
    soft: '#e3f5fd',
    level: 'Beginner → Advanced',
    duration: '~30 hours',
    status: 'available',
    summary:
      'A complete networking path: what a network is, the OSI and TCP/IP models, Ethernet/MAC/ARP, IPv4/IPv6, subnets/CIDR/NAT, routing, TCP vs UDP, DNS and DHCP, HTTP/2 and HTTP/3, TLS and PKI, email/SSH protocols, CLI troubleshooting tools, firewalls/VPNs, and load balancers/CDNs — with diagrams, quizzes and tasks.',
    courseKey: 'learnweb.networking.progress.v1',
    roadmapKey: 'learnweb.networking.roadmap.v1',
    eventName: 'learnweb:progress:networking',
    roadmapTitle: 'Computer Networking Roadmap',
    roadmapDescription:
      'A step-by-step path through networking: foundations and models, the lower layers (Ethernet, IP, routing), transport and core services (TCP/UDP, DNS, DHCP), the application layer and the web (HTTP, TLS), and operations and security.',
  },
  networkingContent
);

const linuxCourse = createCourse(
  {
    id: 'linux',
    slug: 'linux',
    title: 'Linux and the Command Line: From Shell to Server',
    shortTitle: 'Linux',
    subtitle:
      'Become fluent on the Linux command line — the filesystem, files and text, pipes, permissions, processes, packages, systemd, networking and shell scripting.',
    tech: 'Linux',
    category: 'Fundamentals',
    icon: 'linux',
    accent: '#f59e0b',
    soft: '#fff4e0',
    level: 'Beginner → Advanced',
    duration: '~30 hours',
    status: 'available',
    summary:
      'A complete Linux path: the kernel and distributions, the shell and filesystem, managing files and text with grep/sed/awk, pipes and redirection, permissions and ownership, processes and packages, services and systemd, networking, disks, and Bash scripting, automation and hardening — with realistic commands, diagrams, quizzes and tasks.',
    courseKey: 'learnweb.linux.progress.v1',
    roadmapKey: 'learnweb.linux.roadmap.v1',
    eventName: 'learnweb:progress:linux',
    roadmapTitle: 'Linux Roadmap',
    roadmapDescription:
      'A step-by-step path through Linux: fundamentals, files and text, permissions/processes/packages, system administration, and scripting and hardening.',
  },
  linuxContent
);

const gitCourse = createCourse(
  {
    id: 'git',
    slug: 'git',
    title: 'Git and GitHub: Version Control for Professionals',
    shortTitle: 'Git & GitHub',
    subtitle:
      'Go from first commit to advanced workflows — staging and history, branching, merging and rebasing, remotes and pull requests, undoing changes, and professional best practices.',
    tech: 'Git',
    category: 'Fundamentals',
    icon: 'git',
    accent: '#f05133',
    soft: '#fdeae6',
    level: 'Beginner → Advanced',
    duration: '~18 hours',
    status: 'available',
    summary:
      'A complete Git and GitHub path: the distributed model and the three areas, reading history, branching and merging, rebase, remotes and pull requests, team workflows, undoing and rewriting history (reset/revert/stash/cherry-pick/reflog), tags and releases, and advanced topics (bisect, hooks, conventional commits, submodules, LFS) — with heavy command examples, diagrams, quizzes and tasks.',
    courseKey: 'learnweb.git.progress.v1',
    roadmapKey: 'learnweb.git.roadmap.v1',
    eventName: 'learnweb:progress:git',
    roadmapTitle: 'Git and GitHub Roadmap',
    roadmapDescription:
      'A step-by-step path through Git: fundamentals, branching and integrating, remotes and collaboration, fixing and rewriting history, and advanced professional topics.',
  },
  gitContent
);

const javascriptCourse = createCourse(
  {
    id: 'javascript',
    slug: 'javascript',
    title: 'JavaScript: The Language from Fundamentals to Mastery',
    shortTitle: 'JavaScript',
    subtitle:
      'Learn JavaScript properly — types and control flow, functions, scope and closures, objects and arrays, modern ES syntax, asynchronous code, the DOM and OOP.',
    tech: 'JavaScript',
    category: 'Languages',
    icon: 'javascript',
    accent: '#eab308',
    soft: '#fef9c3',
    level: 'Beginner → Advanced',
    duration: '~35 hours',
    status: 'available',
    summary:
      'A complete JavaScript path: how JS runs, variables and types, operators and control flow, functions, scope, hoisting and closures, the this keyword, objects and arrays, modern ES features, the event loop, Promises and async/await, fetch, the DOM and events, errors, and prototypes and classes — with code, diagrams, quizzes and tasks.',
    courseKey: 'learnweb.javascript.progress.v1',
    roadmapKey: 'learnweb.javascript.roadmap.v1',
    eventName: 'learnweb:progress:javascript',
    roadmapTitle: 'JavaScript Roadmap',
    roadmapDescription:
      'A step-by-step path through JavaScript: fundamentals, functions and scope, data and built-ins, modern and asynchronous JS, and the browser and OOP.',
  },
  javascriptContent
);

const typescriptCourse = createCourse(
  {
    id: 'typescript',
    slug: 'typescript',
    title: 'TypeScript: Typed JavaScript at Scale',
    shortTitle: 'TypeScript',
    subtitle:
      'Add static types to JavaScript — basic and composite types, interfaces, unions and narrowing, generics, utility and advanced types, classes, and real-world tooling.',
    tech: 'TypeScript',
    category: 'Languages',
    icon: 'typescript',
    accent: '#3178c6',
    soft: '#e6effa',
    level: 'Beginner → Advanced',
    duration: '~30 hours',
    status: 'available',
    summary:
      'A complete TypeScript path: why TS and the compile step, basic types, functions, objects and interfaces, unions/literals/narrowing, enums and intersections, generics and constraints, utility types, advanced type tools (keyof, conditional and mapped types), classes and OOP, type guards, tsconfig and strict mode, declaration files and @types, and TS with Node and React — with code, diagrams, quizzes and tasks.',
    courseKey: 'learnweb.typescript.progress.v1',
    roadmapKey: 'learnweb.typescript.roadmap.v1',
    eventName: 'learnweb:progress:typescript',
    roadmapTitle: 'TypeScript Roadmap',
    roadmapDescription:
      'A step-by-step path through TypeScript: fundamentals, object and composite types, generics and advanced types, classes and OOP, and tooling and real-world TypeScript.',
  },
  typescriptContent
);

const nodejsCourse = createCourse(
  {
    id: 'nodejs',
    slug: 'nodejs',
    title: 'Node.js: Server-Side JavaScript from Fundamentals to Production',
    shortTitle: 'Node.js',
    subtitle:
      'Run JavaScript on the server — the runtime and event loop, modules, core modules, building HTTP servers, async patterns, npm and the ecosystem, and production.',
    tech: 'Node.js',
    category: 'Backend',
    icon: 'node',
    accent: '#3c873a',
    soft: '#e7f3e7',
    level: 'Beginner → Advanced',
    duration: '~30 hours',
    status: 'available',
    summary:
      'A complete Node.js path: the V8 + libuv runtime, modules (CommonJS and ESM), the event loop and non-blocking I/O, the file system, events and streams, process and globals, the http module, asynchronous patterns and error handling, npm and package.json, configuration and environment, databases and APIs, performance and scaling, and debugging, testing and deployment — with code, diagrams, quizzes and tasks.',
    courseKey: 'learnweb.nodejs.progress.v1',
    roadmapKey: 'learnweb.nodejs.roadmap.v1',
    eventName: 'learnweb:progress:nodejs',
    roadmapTitle: 'Node.js Roadmap',
    roadmapDescription:
      'A step-by-step path through Node.js: fundamentals, core modules, building servers and async, npm and the ecosystem, and production Node.',
  },
  nodejsContent
);

const expressCourse = createCourse(
  {
    id: 'express',
    slug: 'express',
    title: 'Express: Building Web APIs and Apps with Node.js',
    shortTitle: 'Express',
    subtitle:
      'Build web servers and REST APIs with Express — routing, the request/response cycle, middleware, REST design, auth, templating and uploads, and production concerns.',
    tech: 'Express',
    category: 'Backend',
    icon: 'express',
    accent: '#1f2937',
    soft: '#eef1f5',
    level: 'Beginner → Advanced',
    duration: '~22 hours',
    status: 'available',
    summary:
      'A complete Express path: a minimal server over Node http, routing and route parameters, the request and response objects, the middleware pipeline, built-in and third-party middleware, error-handling middleware, RESTful API design, working with data and databases, structuring an app, authentication and sessions, templating and static files, file uploads and cookies, and production security, performance, testing and deployment — with code, diagrams, quizzes and tasks.',
    courseKey: 'learnweb.express.progress.v1',
    roadmapKey: 'learnweb.express.roadmap.v1',
    eventName: 'learnweb:progress:express',
    roadmapTitle: 'Express Roadmap',
    roadmapDescription:
      'A step-by-step path through Express: fundamentals, middleware, building REST APIs, auth/views/uploads, and production Express.',
  },
  expressContent
);

export const courses = [
  reactCourse,
  nestCourse,
  devopsCourse,
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
  dockerCourse,
  kubernetesCourse,
  networkingCourse,
  linuxCourse,
  gitCourse,
  javascriptCourse,
  typescriptCourse,
  nodejsCourse,
  expressCourse,
];

export const DEFAULT_COURSE_ID = 'react';

const byId = Object.fromEntries(courses.map((c) => [c.id, c]));

export function getCourse(id) {
  return byId[id] ?? byId[DEFAULT_COURSE_ID];
}

export function hasCourse(id) {
  return Boolean(byId[id]);
}
