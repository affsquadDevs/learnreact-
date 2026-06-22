// AWS Cloud Practitioner Essentials — course content.
// Comprehensive coverage of the AWS Certified Cloud Practitioner (CLF-C02) exam,
// organised into the four exam domains. The factual material (service names and
// what they do) is rewritten in our own words for self-study; diagrams are our
// own Mermaid creations. Not affiliated with or endorsed by AWS.
//
// Exam domains & weightings (CLF-C02):
//   1. Cloud Concepts ............ 24%
//   2. Security & Compliance ..... 30%
//   3. Cloud Technology & Services 34%
//   4. Billing, Pricing & Support  12%

const content = {
  meta: {
    title: 'AWS Cloud Practitioner Essentials',
    description:
      'A complete, structured path to the AWS Certified Cloud Practitioner (CLF-C02) exam: cloud concepts, security & compliance, the core AWS services (compute, storage, databases, networking, analytics, integration), and billing, pricing & support — with diagrams, quizzes and hands-on tasks.',
    schemaVersion: '1.0',
    status: 'complete',
  },
  levels: [
    /* ───────────────────────── DOMAIN 1 — CLOUD CONCEPTS (24%) ───────────────────────── */
    {
      level: 1,
      name: 'Cloud Concepts',
      focus: 'What the cloud is, why it wins, how AWS is laid out, and how to architect on it (Domain 1 · 24%)',
      accent: '#2d6bff',
      soft: '#eaf0ff',
      topics: [
        {
          id: 'a1-t0',
          name: 'What cloud computing is',
          concepts: [
            {
              id: 'a1-t0-c0',
              title: 'Cloud computing and the pay-as-you-go model',
              summary:
                'Cloud computing is the on-demand delivery of IT resources — compute power, database storage, applications and other resources — over the internet with pay-as-you-go pricing, instead of buying and running your own data centres.',
              explanation:
                "Rather than owning physical servers, you rent capacity from a provider like AWS and access it over the internet. You provision exactly what you need in minutes, scale up or down as demand changes, and pay only for what you use — much like electricity from the grid. This converts large upfront capital expenditure (CapEx) on hardware into smaller, variable operating expense (OpEx). AWS owns and maintains the hardware and facilities; you focus on building applications.",
              analogy:
                'Owning a data centre is like buying a diesel generator sized for the worst-case load you might ever hit. Cloud is the electricity grid — flip a switch, use what you need, and the bill matches your usage.',
              keyPoints: [
                'On-demand: provision resources in minutes, not weeks.',
                'Pay-as-you-go: pay only for what you consume; no long-term hardware commitment.',
                'Turns CapEx (buying servers) into OpEx (renting capacity).',
                'AWS manages the physical infrastructure; you manage your workloads.',
              ],
              commonMistakes: [
                'Thinking "the cloud" is one giant computer — it is many data centres of commodity hardware exposed as services.',
                'Assuming cloud is always cheaper. It is cost-effective when you right-size and turn off idle resources.',
              ],
              exercises: [
                {
                  type: 'quiz',
                  prompt:
                    'A startup wants to launch a web app without buying servers and pay only for the capacity it actually uses. Which cloud characteristic does this describe?',
                  hint: 'Think about how the bill is calculated.',
                  solution: {
                    explanation:
                      'Pay-as-you-go (consumption-based) pricing — you provision on demand and pay only for what you use, avoiding upfront hardware purchases.',
                  },
                },
                {
                  type: 'quiz',
                  prompt: 'Moving from buying servers to renting cloud capacity changes spending from ___ to ___.',
                  solution: {
                    explanation:
                      'From capital expenditure (CapEx) to operational expenditure (OpEx).',
                  },
                },
              ],
              docs: 'https://aws.amazon.com/what-is-cloud-computing/',
            },
            {
              id: 'a1-t0-c1',
              title: 'Six advantages of cloud computing',
              summary:
                'AWS frames the value of cloud in six benefits. The exam expects you to recognise each one by name and by example.',
              explanation:
                'The six advantages are: (1) Trade capital expense for variable expense — pay only when you consume. (2) Benefit from massive economies of scale — AWS aggregates usage from hundreds of thousands of customers, driving prices down. (3) Stop guessing capacity — scale up or down within minutes instead of over- or under-provisioning. (4) Increase speed and agility — new resources are minutes away, shortening development cycles. (5) Stop spending money running and maintaining data centres — focus on your customers, not racking and cooling servers. (6) Go global in minutes — deploy across multiple Regions worldwide to reduce latency.',
              keyPoints: [
                'Trade capital expense (CapEx) for variable expense (OpEx).',
                'Massive economies of scale → lower pay-as-you-go prices.',
                'Stop guessing capacity — scale elastically.',
                'Increase speed and agility — resources in minutes.',
                'Stop spending on running data centres — focus on the business.',
                'Go global in minutes by deploying across Regions.',
              ],
              diagram: {
                type: 'mermaid',
                lines: [
                  'flowchart LR',
                  '  CapEx[Fixed CapEx<br/>buy servers] -->|cloud| OpEx[Variable OpEx<br/>pay per use]',
                  '  OpEx --> S[Scale on demand]',
                  '  OpEx --> G[Go global in minutes]',
                ],
                caption: 'Cloud converts fixed upfront spend into elastic, pay-per-use capacity that can scale and go global quickly.',
              },
              exercises: [
                {
                  type: 'quiz',
                  prompt:
                    'AWS serves huge numbers of customers, so per-unit costs keep dropping and savings are passed on. Which advantage is this?',
                  solution: {
                    explanation: '"Benefit from massive economies of scale."',
                  },
                },
                {
                  type: 'task',
                  prompt: 'Which advantage applies when a company deletes its on-prem data centre and stops paying staff to rack and cool servers?',
                  solution: {
                    explanation: '"Stop spending money running and maintaining data centres" — the undifferentiated heavy lifting moves to AWS.',
                  },
                },
              ],
              docs: 'https://docs.aws.amazon.com/whitepapers/latest/aws-overview/six-advantages-of-cloud-computing.html',
            },
          ],
        },
        {
          id: 'a1-t1',
          name: 'Deployment & service models',
          concepts: [
            {
              id: 'a1-t1-c0',
              title: 'Deployment models: cloud, hybrid, on-premises',
              summary:
                'Where your infrastructure lives: fully in the cloud (public), on-premises/private, or a hybrid mix of both.',
              explanation:
                'A cloud-based (all-in / public cloud) deployment runs everything on a provider like AWS — either by migrating existing apps or building cloud-native ones. An on-premises / private cloud deployment uses virtualisation and resource management in your own data centre; it gives you control but only limited cloud benefits. A hybrid deployment connects cloud resources to on-premises infrastructure — common when regulations, latency, or legacy systems keep some workloads on-prem while others move to AWS.',
              keyPoints: [
                'Public cloud (all-in): everything runs on AWS.',
                'On-premises / private cloud: in your own data centre, often via virtualisation; limited cloud benefits.',
                'Hybrid: AWS connected to on-premises systems (e.g. via VPN or Direct Connect).',
                'Choice is driven by compliance, latency, legacy investment and migration strategy.',
              ],
              exercises: [
                {
                  type: 'quiz',
                  prompt:
                    'A bank keeps its core ledger in its own data centre for compliance but runs its mobile app and analytics on AWS, connected over a private link. Which deployment model is this?',
                  solution: {
                    explanation: 'Hybrid — some workloads run on-premises while others run in the cloud, with connectivity between them.',
                  },
                },
              ],
              docs: 'https://docs.aws.amazon.com/whitepapers/latest/aws-overview/types-of-cloud-computing.html',
            },
            {
              id: 'a1-t1-c1',
              title: 'Service models: IaaS, PaaS, SaaS',
              summary:
                'How much of the stack you manage versus the provider: Infrastructure, Platform, or Software as a Service.',
              explanation:
                'IaaS (Infrastructure as a Service) gives you the building blocks — networking, virtual machines, storage — and you manage the OS and everything above it (e.g. Amazon EC2). It offers the highest flexibility. PaaS (Platform as a Service) removes the need to manage the underlying OS and patching so you focus on code and data (e.g. AWS Elastic Beanstalk, Amazon RDS). SaaS (Software as a Service) is a finished product the provider runs and manages; you simply consume it (e.g. web-based email). The more managed the service, the less control but also less operational burden.',
              analogy:
                'Pizza as a service: IaaS = you get the kitchen and ingredients; PaaS = a ready oven and dough, you add toppings; SaaS = the pizza is delivered hot.',
              keyPoints: [
                'IaaS: you manage OS, runtime, apps (e.g. EC2). Highest flexibility.',
                'PaaS: provider manages OS/patching; you manage app + data (e.g. Elastic Beanstalk, RDS).',
                'SaaS: provider manages everything; you just consume (e.g. email).',
                'More managed = less control, less maintenance.',
              ],
              diagram: {
                type: 'mermaid',
                lines: [
                  'flowchart LR',
                  '  A[IaaS<br/>EC2] --> B[PaaS<br/>Elastic Beanstalk]',
                  '  B --> C[SaaS<br/>finished app]',
                  '  A -.you manage more.-> C',
                ],
                caption: 'Moving from IaaS to SaaS hands more of the stack to AWS and leaves you less to manage.',
              },
              exercises: [
                {
                  type: 'quiz',
                  prompt:
                    'You launch an EC2 instance and install your own OS patches, runtime and application. Which service model is EC2?',
                  hint: 'Who patches the OS — you or AWS?',
                  solution: {
                    explanation: 'IaaS — with EC2 you control the OS and everything above it; AWS only provides the virtualised infrastructure.',
                  },
                },
                {
                  type: 'quiz',
                  prompt: 'Which model describes a fully managed email product where the user manages nothing technical?',
                  solution: { explanation: 'SaaS.' },
                },
              ],
              docs: 'https://docs.aws.amazon.com/whitepapers/latest/aws-overview/types-of-cloud-computing.html',
            },
          ],
        },
        {
          id: 'a1-t2',
          name: 'AWS Global Infrastructure',
          concepts: [
            {
              id: 'a1-t2-c0',
              title: 'Regions, Availability Zones, and Edge Locations',
              summary:
                'AWS is built from Regions (independent geographic areas), each containing multiple isolated Availability Zones (AZs), plus a much larger global network of Edge Locations for content delivery.',
              explanation:
                'A Region is a physical location in the world (e.g. eu-west-1 Ireland, us-east-1 N. Virginia) and is completely independent from other Regions. Each Region contains three or more Availability Zones — one or more discrete data centres with redundant power, networking and connectivity, physically separated (often in different flood plains) yet linked by low-latency, high-throughput networks. Deploying across multiple AZs makes an application highly available and fault-tolerant: if one AZ fails, the others keep running. Edge Locations are far more numerous than Regions (200+) and are used by Amazon CloudFront and Route 53 to cache content and answer DNS close to users; Regional Edge Caches sit between origins and Edge Locations with larger capacity.',
              keyPoints: [
                'Region = independent geographic area (data sovereignty + fault isolation); data transfer between Regions is charged.',
                'Availability Zone = one or more discrete, isolated data centres within a Region; named like us-east-1a.',
                'Multi-AZ design = high availability and fault tolerance.',
                'Edge Locations (200+) = global caching/DNS points for CloudFront & Route 53 (low latency).',
                'Choose a Region by latency to users, cost, compliance, and service availability.',
              ],
              diagram: {
                type: 'mermaid',
                lines: [
                  'flowchart TB',
                  '  R[Region: eu-west-1] --> AZ1[AZ a]',
                  '  R --> AZ2[AZ b]',
                  '  R --> AZ3[AZ c]',
                  '  AZ1 --> D1[(Data centre)]',
                  '  AZ2 --> D2[(Data centre)]',
                ],
                caption: 'A Region contains multiple Availability Zones; each AZ is one or more isolated data centres.',
              },
              commonMistakes: [
                'Confusing Availability Zones with Edge Locations — AZs run your workloads; Edge Locations cache content.',
                'Assuming a single AZ is highly available. High availability needs at least two AZs.',
              ],
              exercises: [
                {
                  type: 'quiz',
                  prompt:
                    'To survive the failure of a single data centre, across how many Availability Zones should you deploy your application?',
                  solution: {
                    explanation: 'At least two AZs — if one fails, the others continue serving traffic.',
                  },
                },
                {
                  type: 'quiz',
                  prompt: 'Which AWS infrastructure component does CloudFront use to cache content close to end users?',
                  solution: { explanation: 'Edge Locations.' },
                },
                {
                  type: 'task',
                  prompt: 'Name three factors that should influence which Region you deploy in.',
                  solution: {
                    explanation: 'Latency/proximity to users, compliance/data residency, pricing (varies by Region), and service availability (not all services exist in every Region).',
                  },
                },
              ],
              docs: 'https://aws.amazon.com/about-aws/global-infrastructure/',
            },
            {
              id: 'a1-t2-c1',
              title: 'Edge extensions: Local Zones, Wavelength, and Outposts',
              summary:
                'AWS extends its infrastructure closer to users and on-premises with Local Zones, Wavelength (5G), and Outposts.',
              explanation:
                'Beyond Regions and AZs, AWS offers extensions for low-latency and data-residency needs. Local Zones place compute, storage and select services in large metro areas, closer to end users, for single-digit-millisecond latency while connecting back to a parent Region via the same APIs. AWS Wavelength embeds AWS infrastructure inside telecom providers\' 5G networks at the network edge, for ultra-low-latency mobile applications. AWS Outposts brings native AWS services, APIs and tooling to your own data centre or co-location facility — a physical rack you operate locally — ideal for low-latency local processing and data residency requirements.',
              keyPoints: [
                'Local Zones: AWS services in metro areas for single-digit-ms latency, tied to a parent Region.',
                'Wavelength: AWS at the 5G network edge for ultra-low-latency mobile apps.',
                'Outposts: native AWS services on a rack in your own/co-location data centre (hybrid, data residency).',
              ],
              exercises: [
                {
                  type: 'quiz',
                  prompt:
                    'A factory needs to run AWS services on-premises with the same APIs as the cloud, for low-latency local data processing. Which option fits?',
                  solution: { explanation: 'AWS Outposts.' },
                },
                {
                  type: 'quiz',
                  prompt: 'Which AWS extension targets ultra-low latency for applications served to mobile devices over 5G?',
                  solution: { explanation: 'AWS Wavelength.' },
                },
              ],
              docs: 'https://aws.amazon.com/about-aws/global-infrastructure/',
            },
          ],
        },
        {
          id: 'a1-t3',
          name: 'Architecting for the cloud',
          concepts: [
            {
              id: 'a1-t3-c0',
              title: 'Cloud design principles: elasticity, decoupling, design for failure',
              summary:
                'Well-architected cloud systems scale horizontally, treat servers as disposable, decouple components, and assume any component can fail.',
              explanation:
                'Cloud-native design rests on a few principles. Scalability: prefer horizontal scaling (add more instances — no downtime, near-unlimited) over vertical scaling (a bigger instance — requires a restart, has a ceiling); design applications to be stateless so any instance can handle any request, keeping session state in DynamoDB or S3. Disposable resources: treat servers as programmable and replaceable — rebuild from golden images (AMIs) or bootstrap scripts (infrastructure as code) rather than patching pets by hand. Loose coupling / decoupling: connect components through well-defined interfaces and asynchronous integration (SQS queues, SNS topics) so one component failing or slowing does not cascade. Design for failure: remove single points of failure with redundancy across multiple AZs, automatic failover (ELB, Route 53, Auto Scaling) and durable, replicated data storage.',
              keyPoints: [
                'Horizontal scaling (more instances) beats vertical scaling (bigger instance) for elasticity and availability.',
                'Make applications stateless; store session state in DynamoDB/S3.',
                'Treat servers as disposable — rebuild via AMIs / infrastructure as code, don\'t hand-patch.',
                'Decouple components with SQS/SNS so failures don\'t cascade.',
                'Design for failure: multi-AZ redundancy + automatic failover; remove single points of failure.',
              ],
              diagram: {
                type: 'mermaid',
                lines: [
                  'flowchart LR',
                  '  P[Producer] --> Q[[SQS queue]]',
                  '  Q --> C1[Worker 1]',
                  '  Q --> C2[Worker 2]',
                  '  C1 -.scale out.-> C3[Worker N]',
                ],
                caption: 'Decoupling with a queue: producers and workers scale independently, and a slow or failed worker does not block the producer.',
              },
              exercises: [
                {
                  type: 'quiz',
                  prompt:
                    'To handle more traffic without downtime and without a maximum instance size, should you scale vertically or horizontally?',
                  solution: {
                    explanation: 'Horizontally — add more instances. Vertical scaling (bigger instance) requires a restart and has an upper limit.',
                  },
                },
                {
                  type: 'task',
                  prompt: 'Why is a stateless application easier to scale and make highly available?',
                  solution: {
                    explanation: 'Any instance can handle any request (session state lives in a shared store like DynamoDB/S3), so instances can be added, removed or replaced freely behind a load balancer.',
                  },
                },
              ],
              docs: 'https://docs.aws.amazon.com/wellarchitected/latest/framework/welcome.html',
            },
            {
              id: 'a1-t3-c1',
              title: 'The six pillars of the Well-Architected Framework',
              summary:
                'AWS best-practice guidance for building cloud workloads, organised into six pillars.',
              explanation:
                'The AWS Well-Architected Framework helps you design and review systems against proven best practices. The six pillars are: Operational Excellence (run, monitor and continuously improve systems), Security (protect data and systems), Reliability (recover from failure, scale to meet demand), Performance Efficiency (use resources efficiently as demand changes), Cost Optimization (avoid unnecessary cost), and Sustainability (minimise environmental impact). The exam expects you to map a scenario to the right pillar.',
              keyPoints: [
                'Operational Excellence — monitor, automate, improve.',
                'Security — protect information, systems and assets.',
                'Reliability — recover from disruptions, scale to demand.',
                'Performance Efficiency — use resources efficiently.',
                'Cost Optimization — eliminate unneeded spend.',
                'Sustainability — reduce environmental impact.',
              ],
              exercises: [
                {
                  type: 'quiz',
                  prompt:
                    'A team reviews its design to ensure the workload can automatically recover from an AZ failure. Which pillar is this?',
                  solution: { explanation: 'Reliability.' },
                },
                {
                  type: 'quiz',
                  prompt: 'Choosing right-sized instances and deleting idle resources aligns with which pillar?',
                  solution: { explanation: 'Cost Optimization.' },
                },
              ],
              docs: 'https://aws.amazon.com/architecture/well-architected/',
            },
          ],
        },
      ],
    },

    /* ─────────────────── DOMAIN 2 — SECURITY & COMPLIANCE (30%) ─────────────────── */
    {
      level: 2,
      name: 'Security & Compliance',
      focus: 'Who secures what, identity, security services, and how AWS proves compliance (Domain 2 · 30%)',
      accent: '#7c4ddb',
      soft: '#f1ebfd',
      topics: [
        {
          id: 'a2-t0',
          name: 'Shared Responsibility Model',
          concepts: [
            {
              id: 'a2-t0-c0',
              title: 'Security OF the cloud vs security IN the cloud',
              summary:
                'AWS is responsible for the security OF the cloud (the infrastructure); the customer is responsible for security IN the cloud (their data, configuration and access).',
              explanation:
                'AWS secures the physical hardware, the global infrastructure (Regions, AZs, Edge Locations), the host operating system and virtualisation layer, and the underlying software of managed services. The customer secures what they put in the cloud: their data, identity and access management, guest OS patches (for IaaS like EC2), security-group/firewall configuration, and encryption settings. The boundary shifts with the service: for EC2 (IaaS) the customer patches the guest OS; for a managed service like Amazon S3 or RDS, AWS handles more, but the customer still controls access policies and their data. AWS also describes shared controls (e.g. patch and configuration management — AWS does the infrastructure, you do your systems) and inherited controls (physical/environmental, fully AWS).',
              analogy:
                'Renting an apartment: the landlord (AWS) secures the building structure, locks and foundations; the tenant (you) decides who gets a key and whether to lock the door.',
              keyPoints: [
                'AWS: security OF the cloud — hardware, facilities, host OS, virtualisation, managed-service software.',
                'Customer: security IN the cloud — data, IAM, guest OS patching (IaaS), firewall rules, encryption.',
                'Shared controls: patch & configuration management, awareness/training.',
                'Inherited controls: physical & environmental security (fully AWS).',
                'The customer ALWAYS owns their data and who can access it.',
              ],
              diagram: {
                type: 'mermaid',
                lines: [
                  'flowchart TB',
                  '  subgraph Customer [Customer: security IN the cloud]',
                  '    C1[Customer data]',
                  '    C2[IAM & access]',
                  '    C3[Guest OS patching / firewall config]',
                  '  end',
                  '  subgraph AWS [AWS: security OF the cloud]',
                  '    A1[Compute / Storage / Database / Network]',
                  '    A2[Host OS, virtualisation, facilities]',
                  '  end',
                  '  Customer --> AWS',
                ],
                caption: 'The customer secures what is IN the cloud; AWS secures the cloud itself.',
              },
              commonMistakes: [
                'Believing AWS patches your EC2 guest operating system — that is the customer\'s job for IaaS.',
                'Assuming AWS is responsible for a misconfigured S3 bucket — access control is always the customer\'s responsibility.',
              ],
              exercises: [
                {
                  type: 'quiz',
                  prompt: 'Who patches the guest operating system on an Amazon EC2 instance?',
                  hint: 'EC2 is IaaS.',
                  solution: {
                    explanation: 'The customer — AWS secures the hypervisor and hardware, the customer manages and patches the guest OS.',
                  },
                },
                {
                  type: 'task',
                  prompt:
                    'Classify each as AWS or Customer: (a) physical data centre security, (b) encrypting your data, (c) maintaining the hypervisor, (d) managing IAM users.',
                  solution: {
                    explanation: '(a) AWS, (b) Customer, (c) AWS, (d) Customer.',
                  },
                },
              ],
              docs: 'https://aws.amazon.com/compliance/shared-responsibility-model/',
            },
          ],
        },
        {
          id: 'a2-t1',
          name: 'Identity & Access Management (IAM)',
          concepts: [
            {
              id: 'a2-t1-c0',
              services: [{ icon: 'iam', label: 'AWS IAM' }],
              title: 'IAM users, groups, roles, and policies',
              summary:
                'IAM controls who (authentication) can do what (authorization) in your AWS account. It is a global, free service, and everything is implicitly denied by default.',
              explanation:
                'An IAM user represents a person or application with long-term credentials (a console password and/or access keys). Groups are collections of users that share permissions (e.g. "Developers") — a group is not an identity you can reference as a principal, and groups cannot be nested. Policies are JSON documents that allow or deny specific actions on specific resources; you attach them to users, groups or roles, and the most restrictive policy wins (an explicit Deny always overrides any Allow). An IAM role is an identity with no long-term credentials that is assumed to get temporary credentials (via AWS STS) — used by users, federated identities or AWS services (e.g. letting an EC2 instance read from S3 without stored keys). Best practice: grant least privilege.',
              keyPoints: [
                'User = person/app with long-term credentials; Group = users sharing permissions (not a principal, no nesting).',
                'Policy = JSON allowing/denying actions on resources; explicit Deny always wins.',
                'Role = temporary credentials (via STS) assumed by users or services — preferred for EC2/Lambda.',
                'IAM is global (not Region-specific) and free; permissions are implicitly denied by default.',
                'Apply least privilege; use AWS-managed policies where possible.',
              ],
              code: {
                language: 'json',
                lines: [
                  '{',
                  '  "Version": "2012-10-17",',
                  '  "Statement": [',
                  '    {',
                  '      "Effect": "Allow",',
                  '      "Action": ["s3:GetObject"],',
                  '      "Resource": "arn:aws:s3:::my-bucket/*"',
                  '    }',
                  '  ]',
                  '}',
                ],
                explanation:
                  'An IAM policy allowing read access (s3:GetObject) to all objects in "my-bucket". Effect is Allow or Deny; an explicit Deny always overrides an Allow.',
              },
              commonMistakes: [
                'Embedding access keys in code on EC2 instead of attaching an IAM role.',
                'Granting broad "*" permissions instead of least privilege.',
              ],
              exercises: [
                {
                  type: 'quiz',
                  prompt:
                    'An app on EC2 needs to read from S3 without storing long-term credentials on the instance. What is recommended?',
                  solution: {
                    explanation: 'Attach an IAM role to the EC2 instance — it receives temporary credentials automatically via STS.',
                  },
                },
                {
                  type: 'predict',
                  prompt:
                    'A user inherits an Allow for s3:GetObject from a group, but also has a directly attached policy with an explicit Deny for it. Can the user read the object?',
                  solution: { explanation: 'No — an explicit Deny always overrides any Allow.' },
                },
              ],
              docs: 'https://docs.aws.amazon.com/IAM/latest/UserGuide/introduction.html',
            },
            {
              id: 'a2-t1-c1',
              title: 'Root user, MFA, and credential best practices',
              summary:
                'The account root user has unrestricted access and should be protected and rarely used; enable MFA on it and on privileged users.',
              explanation:
                'When you create an AWS account, the root user (the email login) has full, unrestrictable access, including billing. Best practice: do not use the root user for everyday tasks; create individual IAM users/roles instead; enable Multi-Factor Authentication (MFA) on the root user and on privileged identities; delete or avoid creating root access keys; set a strong password policy; rotate credentials; and remove unused credentials. MFA adds a second factor (a one-time six-digit code from a device) on top of the password, dramatically reducing the risk of compromised credentials.',
              keyPoints: [
                'Root user = unlimited power; lock it down and use it only for the few tasks that require it.',
                'Enable MFA on the root user and all privileged identities.',
                'Create individual IAM users/roles for daily work — never share the root login.',
                'Apply least privilege, rotate credentials, remove unused ones, enforce a strong password policy.',
              ],
              exercises: [
                {
                  type: 'quiz',
                  prompt: 'Beyond a strong password, what is the single most important step to protect the root user?',
                  solution: { explanation: 'Enable Multi-Factor Authentication (MFA).' },
                },
                {
                  type: 'quiz',
                  prompt: 'Should you use the root user for day-to-day administration?',
                  solution: {
                    explanation: 'No — create IAM users/roles for daily work and reserve root for the few tasks that strictly require it.',
                  },
                },
              ],
              docs: 'https://docs.aws.amazon.com/IAM/latest/UserGuide/best-practices.html',
            },
            {
              id: 'a2-t1-c2',
              title: 'Temporary credentials & federation: STS, Identity Center, Cognito',
              summary:
                'AWS Security Token Service issues temporary credentials; federation lets external identities access AWS without creating IAM users.',
              explanation:
                'AWS STS (Security Token Service) issues temporary, limited-privilege credentials (valid minutes to hours) that cannot be reused once expired — this is how roles are assumed. Federation lets identities from outside IAM sign in: enterprise directories via SAML 2.0 / Active Directory (workforce single sign-on), web/social identity providers (OpenID Connect — Google, Amazon, Facebook), and cross-account access (one AWS account assuming a role in another). AWS IAM Identity Center (successor to AWS SSO) centrally manages workforce single sign-on across multiple AWS accounts and SaaS apps. Amazon Cognito provides sign-up/sign-in for your applications\' end users, with user pools (a user directory) and identity pools (granting those users access to AWS services).',
              keyPoints: [
                'STS: temporary, expiring credentials; the mechanism behind assuming roles.',
                'Federation: SAML/AD (workforce SSO), OpenID/social (web identity), cross-account access.',
                'IAM Identity Center: central workforce SSO across AWS accounts + SaaS.',
                'Amazon Cognito: customer-facing app identity — user pools (directory) + identity pools (AWS access).',
              ],
              exercises: [
                {
                  type: 'quiz',
                  prompt:
                    'A mobile app needs end-user sign-up/sign-in and then limited access to AWS resources. Which service provides this?',
                  solution: { explanation: 'Amazon Cognito (user pools for sign-in, identity pools for AWS access).' },
                },
                {
                  type: 'quiz',
                  prompt: 'Which service issues the temporary credentials you receive when you assume an IAM role?',
                  solution: { explanation: 'AWS STS (Security Token Service).' },
                },
              ],
              docs: 'https://docs.aws.amazon.com/IAM/latest/UserGuide/id_credentials_temp.html',
            },
          ],
        },
        {
          id: 'a2-t2',
          name: 'Security services',
          concepts: [
            {
              id: 'a2-t2-c0',
              services: [{ icon: 'waf', label: 'AWS WAF' }, { icon: 'shield', label: 'AWS Shield' }, { icon: 'guardduty', label: 'GuardDuty' }, { icon: 'inspector', label: 'Inspector' }, { icon: 'macie', label: 'Amazon Macie' }],
              title: 'Threat protection: WAF, Shield, GuardDuty, Inspector, Macie',
              summary:
                'A toolbox for filtering web traffic, blocking DDoS, detecting threats, scanning for vulnerabilities, and finding sensitive data.',
              explanation:
                'Know what each service is FOR — the exam tests recognition. AWS WAF (Web Application Firewall) filters Layer-7 web traffic using Web ACLs, blocking common exploits like SQL injection and cross-site scripting based on IPs, headers, body or URIs. AWS Shield provides DDoS protection — Standard is automatic and free for all customers; Advanced is a paid tier with enhanced protection and support. Amazon GuardDuty is intelligent threat detection that analyses CloudTrail, VPC Flow Logs and DNS logs for malicious activity. Amazon Inspector runs automated vulnerability assessments of workloads (e.g. EC2, container images). Amazon Macie uses ML to discover and protect sensitive data such as PII in Amazon S3.',
              keyPoints: [
                'WAF: filters malicious web (Layer-7) requests — SQLi, XSS — via Web ACLs.',
                'Shield: DDoS protection — Standard free/automatic, Advanced paid.',
                'GuardDuty: continuous threat detection from logs.',
                'Inspector: automated vulnerability assessment.',
                'Macie: discover sensitive data (PII) in S3.',
              ],
              exercises: [
                {
                  type: 'quiz',
                  prompt:
                    'Your public website is hit with SQL-injection attempts in HTTP requests. Which service filters these?',
                  solution: { explanation: 'AWS WAF.' },
                },
                {
                  type: 'quiz',
                  prompt: 'Which service provides automatic, no-cost DDoS protection for all AWS customers?',
                  solution: { explanation: 'AWS Shield Standard.' },
                },
                {
                  type: 'quiz',
                  prompt: 'Which service discovers PII stored in Amazon S3?',
                  solution: { explanation: 'Amazon Macie.' },
                },
              ],
              docs: 'https://aws.amazon.com/products/security/',
            },
            {
              id: 'a2-t2-c1',
              services: [{ icon: 'kms', label: 'AWS KMS' }, { icon: 'secretsmanager', label: 'Secrets Manager' }],
              title: 'Encryption & secrets: KMS, CloudHSM, Secrets Manager, ACM',
              summary:
                'Services for managing encryption keys, secrets, and certificates.',
              explanation:
                'AWS KMS (Key Management Service) centrally creates and controls encryption keys and integrates with most AWS services for one-click encryption; key usage is logged via CloudTrail. AWS CloudHSM provides dedicated, FIPS 140-2 Level 3 validated hardware security modules when you need single-tenant key storage and standard crypto APIs (PKCS#11, JCE, CNG). AWS Secrets Manager stores and automatically rotates secrets such as database passwords and API keys, with fine-grained access control (Systems Manager Parameter Store is a simpler alternative for configuration/secrets). AWS Certificate Manager (ACM) provisions and manages public and private SSL/TLS certificates, automating renewal.',
              keyPoints: [
                'KMS: managed encryption keys, integrated across AWS, audited via CloudTrail.',
                'CloudHSM: dedicated FIPS 140-2 Level 3 hardware security modules (single-tenant).',
                'Secrets Manager: store & automatically rotate secrets (e.g. DB passwords).',
                'Parameter Store (Systems Manager): hierarchical config/secret storage, simpler alternative.',
                'ACM: provision and auto-renew SSL/TLS certificates.',
              ],
              exercises: [
                {
                  type: 'quiz',
                  prompt: 'Which service stores a database password and rotates it automatically?',
                  solution: { explanation: 'AWS Secrets Manager.' },
                },
                {
                  type: 'quiz',
                  prompt: 'Which service centrally manages encryption keys used across AWS services?',
                  solution: { explanation: 'AWS KMS (Key Management Service).' },
                },
              ],
              docs: 'https://aws.amazon.com/kms/',
            },
          ],
        },
        {
          id: 'a2-t3',
          name: 'Compliance & governance',
          concepts: [
            {
              id: 'a2-t3-c0',
              services: [{ icon: 'artifact', label: 'AWS Artifact' }, { icon: 'cloudtrail', label: 'CloudTrail' }, { icon: 'config', label: 'AWS Config' }],
              title: 'Artifact, CloudTrail, and AWS Config',
              summary:
                'How AWS demonstrates compliance and how you audit activity and track resource configuration.',
              explanation:
                'AWS Artifact is a self-service portal for on-demand access to AWS compliance reports and certifications (e.g. SOC, ISO, PCI DSS). Compliance is shared: AWS certifies the infrastructure, but you must configure your workloads to meet your own obligations. AWS CloudTrail records API calls and account activity — who did what, when, and from which IP — for auditing and governance, delivering logs to S3 (and optionally CloudWatch Logs). AWS Config records the configuration of your resources over time, tracks changes, and can evaluate them against rules to flag non-compliant settings.',
              keyPoints: [
                'AWS Artifact: download compliance reports/certifications on demand.',
                'Compliance is shared: AWS certifies infrastructure; you configure your part.',
                'CloudTrail: audit log of API activity (who/what/when) → S3.',
                'AWS Config: records resource configuration history and evaluates compliance.',
              ],
              commonMistakes: [
                'Confusing CloudTrail (audit of API calls) with CloudWatch (performance metrics/monitoring).',
                'Confusing CloudTrail (who did what) with AWS Config (what a resource\'s configuration is and how it changed).',
              ],
              exercises: [
                {
                  type: 'quiz',
                  prompt: 'An auditor asks for AWS\'s SOC 2 and ISO 27001 reports. Which service provides these on demand?',
                  solution: { explanation: 'AWS Artifact.' },
                },
                {
                  type: 'quiz',
                  prompt: 'You need to know which user deleted a resource and when. Which service records that API activity?',
                  hint: 'Audit trail, not metrics.',
                  solution: { explanation: 'AWS CloudTrail.' },
                },
              ],
              docs: 'https://aws.amazon.com/artifact/',
            },
          ],
        },
      ],
    },

    /* ───────────────── DOMAIN 3 — CLOUD TECHNOLOGY & SERVICES (34%) ───────────────── */
    {
      level: 3,
      name: 'Technology & Services',
      focus: 'The core AWS services: compute, storage, databases, networking, delivery, scaling, monitoring, integration & analytics (Domain 3 · 34%)',
      accent: '#e8862a',
      soft: '#fff1e2',
      topics: [
        {
          id: 'a3-t0',
          name: 'Compute',
          concepts: [
            {
              id: 'a3-t0-c0',
              services: [{ icon: 'ec2', label: 'Amazon EC2' }],
              title: 'Amazon EC2 and instance families',
              summary:
                'EC2 provides resizable virtual servers (instances). Instance families are optimised for different workloads, and AMIs define what an instance launches with.',
              explanation:
                'Amazon EC2 (Elastic Compute Cloud) lets you launch virtual machines running Windows, Linux or macOS, paying only for capacity you use, with elastic scaling in minutes. Instance families are tuned for different needs: T (low-cost, burstable, general purpose), M (balanced general purpose), C (compute-optimised), R and X (memory-optimised / extreme memory), I and D (storage / dense storage I/O), P and G (GPU for ML and graphics). An AMI (Amazon Machine Image) is a template (OS + configuration) used to launch an instance — from AWS, the Marketplace, the community, or your own custom image. Instance metadata is available from http://169.254.169.254 and user data (limited to 16 KB) can bootstrap configuration at launch.',
              keyPoints: [
                'EC2 = resizable virtual servers; pay for capacity used; integrates with S3, RDS, VPC.',
                'Instance families: T/M general purpose, C compute, R/X memory, I/D storage, P/G GPU.',
                'AMI = launch template (OS + config); can be AWS, Marketplace, community or custom.',
                'User data bootstraps config at launch; instance metadata at 169.254.169.254.',
              ],
              exercises: [
                {
                  type: 'quiz',
                  prompt: 'A workload needs a very large amount of RAM. Which EC2 instance family category fits?',
                  solution: { explanation: 'Memory-optimised (R, or X for extreme memory).' },
                },
                {
                  type: 'task',
                  prompt: 'What is an AMI and what does it define?',
                  solution: {
                    explanation: 'An Amazon Machine Image — a template containing the operating system and configuration used to launch an EC2 instance.',
                  },
                },
              ],
              docs: 'https://docs.aws.amazon.com/ec2/',
            },
            {
              id: 'a3-t0-c1',
              title: 'EC2 pricing options',
              summary:
                'On-Demand, Reserved Instances / Savings Plans, Spot, and Dedicated Hosts trade commitment and flexibility for cost.',
              explanation:
                'On-Demand: pay per second/hour with no commitment — best for short or unpredictable workloads. Reserved Instances: commit to a 1- or 3-year term for up to ~72–75% off steady-state workloads (with no/partial/all upfront options; standard vs convertible). Savings Plans: a flexible $/hour commitment (1 or 3 years) that also covers Fargate and Lambda. Spot Instances: use spare capacity at up to ~90% off, but AWS can reclaim them with a 2-minute warning — ideal for fault-tolerant, flexible jobs (batch, CI, big data). Dedicated Hosts / Dedicated Instances: single-tenant physical hardware, often for licensing or compliance.',
              keyPoints: [
                'On-Demand: no commitment, pay-as-you-go; spiky/short workloads.',
                'Reserved Instances / Savings Plans: 1- or 3-year commitment → big discount on steady workloads (Savings Plans also cover Fargate/Lambda).',
                'Spot: up to ~90% off spare capacity, 2-minute interruption warning → fault-tolerant batch work.',
                'Dedicated Hosts/Instances: single-tenant hardware for licensing/compliance.',
              ],
              diagram: {
                type: 'mermaid',
                lines: [
                  'flowchart LR',
                  '  Q{Workload?} --> S[Steady / predictable] --> R[Reserved / Savings Plan]',
                  '  Q --> U[Spiky / short] --> O[On-Demand]',
                  '  Q --> F[Fault-tolerant batch] --> SP[Spot]',
                ],
                caption: 'Match the EC2 purchasing option to the workload to optimise cost.',
              },
              commonMistakes: [
                'Using Spot for a workload that cannot tolerate interruption.',
                'Paying On-Demand for a 24/7 steady workload that should use a Savings Plan / Reserved Instances.',
              ],
              exercises: [
                {
                  type: 'quiz',
                  prompt: 'A nightly batch job can be restarted if interrupted and you want the lowest cost. Which option?',
                  solution: { explanation: 'Spot Instances.' },
                },
                {
                  type: 'quiz',
                  prompt: 'A production database runs 24/7 for years. Which option minimises cost?',
                  solution: { explanation: 'Reserved Instances or a Savings Plan (1- or 3-year commitment).' },
                },
              ],
              docs: 'https://aws.amazon.com/ec2/pricing/',
            },
            {
              id: 'a3-t0-c2',
              services: [{ icon: 'lambda', label: 'AWS Lambda' }, { icon: 'ecs', label: 'Amazon ECS' }, { icon: 'fargate', label: 'AWS Fargate' }, { icon: 'beanstalk', label: 'Elastic Beanstalk' }],
              title: 'Serverless & containers: Lambda, ECS, EKS, Fargate, Beanstalk, more',
              summary:
                'Run code without managing servers (Lambda), run containers with or without managing instances (ECS/EKS/Fargate), or let AWS handle deployment (Elastic Beanstalk, Lightsail, Batch).',
              explanation:
                'AWS Lambda runs your code in response to events (an upload, an API call, a schedule) with no servers to manage — you pay per request and per millisecond of execution; it scales automatically. For containers, Amazon ECS (Elastic Container Service) and Amazon EKS (managed Kubernetes) orchestrate Docker containers; AWS Fargate is a serverless engine that runs those containers without you managing EC2 instances (the alternative ECS launch type is EC2, where you manage the instances). AWS Elastic Beanstalk is a PaaS that deploys and auto-scales web apps from your code (handling provisioning, load balancing and scaling). Amazon Lightsail offers simple pre-configured virtual servers for smaller projects. AWS Batch runs large-scale batch computing jobs, provisioning the optimal compute automatically.',
              keyPoints: [
                'Lambda: serverless functions, event-driven, pay per request + duration, no servers.',
                'ECS / EKS: orchestrate containers (EKS = managed Kubernetes).',
                'Fargate: run containers serverless — no EC2 instances to manage.',
                'Elastic Beanstalk: PaaS that deploys and scales web apps for you.',
                'Lightsail: simple pre-configured servers; Batch: large-scale batch jobs.',
              ],
              exercises: [
                {
                  type: 'quiz',
                  prompt: 'Run a small function whenever a file lands in S3, paying only when it runs, with zero server management. Which service?',
                  solution: { explanation: 'AWS Lambda.' },
                },
                {
                  type: 'quiz',
                  prompt: 'Which service runs containers without you provisioning or managing EC2 instances?',
                  solution: { explanation: 'AWS Fargate (with ECS or EKS).' },
                },
              ],
              docs: 'https://aws.amazon.com/lambda/',
            },
          ],
        },
        {
          id: 'a3-t1',
          name: 'Storage',
          concepts: [
            {
              id: 'a3-t1-c0',
              services: [{ icon: 's3', label: 'Amazon S3' }],
              title: 'Amazon S3 and its storage classes',
              summary:
                'S3 is object storage: virtually unlimited, internet-accessible, and extremely durable (11 nines). Storage classes match cost to how often data is accessed.',
              explanation:
                'Amazon S3 (Simple Storage Service) stores objects (0 bytes to 5 TB each, unlimited total) in buckets with globally unique names, accessed over HTTP(S). It is designed for 99.999999999% (11 nines) durability and is ideal for backups, static website hosting, media, software delivery and data lakes. Storage classes match cost to access pattern: S3 Standard (frequent access), S3 Intelligent-Tiering (auto-moves objects between tiers based on usage), Standard-IA and One Zone-IA (infrequent access, 30-day minimum), and the Glacier tiers — Glacier Instant Retrieval, Glacier Flexible Retrieval and Glacier Deep Archive (archival, cheapest, slower retrieval, longer minimums).',
              keyPoints: [
                'S3 = object storage; 11 nines durability; objects up to 5 TB; globally unique bucket names.',
                'Use cases: backups, static sites, media, software delivery, data lakes.',
                'Classes: Standard → Intelligent-Tiering → Standard-IA / One Zone-IA → Glacier (Instant / Flexible / Deep Archive).',
                'Intelligent-Tiering auto-moves data between tiers to save cost.',
                'Glacier Deep Archive = lowest cost, longest retrieval (hours), 180-day minimum.',
              ],
              diagram: {
                type: 'mermaid',
                lines: [
                  'flowchart LR',
                  '  H[Hot / frequent] --> Std[S3 Standard]',
                  '  W[Warm / infrequent] --> IA[Standard-IA / One Zone-IA]',
                  '  C[Cold / archive] --> G[Glacier / Deep Archive]',
                  '  Std -.lifecycle.-> IA -.lifecycle.-> G',
                ],
                caption: 'Lifecycle rules move objects from hot to cold tiers as they age, cutting cost.',
              },
              commonMistakes: [
                'Keeping rarely accessed archives in S3 Standard instead of a Glacier class, wasting money.',
              ],
              exercises: [
                {
                  type: 'quiz',
                  prompt: 'Archive compliance data accessed maybe once a year, at the lowest cost, tolerating slow retrieval. Which class?',
                  solution: { explanation: 'S3 Glacier Deep Archive.' },
                },
                {
                  type: 'quiz',
                  prompt: 'You are unsure of access patterns and want AWS to optimise tiering automatically. Which class?',
                  solution: { explanation: 'S3 Intelligent-Tiering.' },
                },
              ],
              docs: 'https://aws.amazon.com/s3/storage-classes/',
            },
            {
              id: 'a3-t1-c1',
              services: [{ icon: 'ebs', label: 'Amazon EBS' }, { icon: 'efs', label: 'Amazon EFS' }],
              title: 'Block & file storage: EBS, EFS, FSx, instance store',
              summary:
                'EBS is a virtual disk for one instance; EFS and FSx are shared file systems; instance store is fast but ephemeral.',
              explanation:
                'Amazon EBS (Elastic Block Store) provides block volumes attached to a single EC2 instance (like a virtual hard disk), is AZ-specific, persists beyond instance termination, and supports snapshots to S3. Volume types include gp2/gp3 (general-purpose SSD), io1/io2 (high-IOPS, latency-sensitive, multi-attach capable), st1 (throughput HDD) and sc1 (cold HDD). Amazon EFS is a managed NFS shared file system that many Linux instances across AZs can mount at once and scales elastically. Amazon FSx provides managed third-party file systems — FSx for Windows File Server (SMB, Active Directory) and FSx for Lustre (high-performance computing, S3-integrated). Instance store is high-speed local disk physically attached to the host but ephemeral — data is lost when the instance stops.',
              keyPoints: [
                'EBS = block storage for ONE instance (a virtual disk); AZ-scoped; snapshots to S3.',
                'EFS = shared NFS file storage mountable by MANY Linux instances across AZs.',
                'FSx = managed Windows (SMB/AD) or Lustre (HPC) file systems.',
                'Instance store = fast local disk, but ephemeral (lost on stop).',
              ],
              commonMistakes: [
                'Trying to attach one standard EBS volume to many instances — use EFS for shared access.',
                'Storing data you need to keep on instance store — it is ephemeral.',
              ],
              exercises: [
                {
                  type: 'quiz',
                  prompt: 'Several EC2 instances must read and write the same files at the same time. Which service?',
                  solution: { explanation: 'Amazon EFS (shared file system); EBS attaches to a single instance.' },
                },
                {
                  type: 'task',
                  prompt: 'Match: (a) virtual disk for one EC2 instance, (b) shared file system for many Linux instances, (c) fast but ephemeral local disk.',
                  solution: { explanation: '(a) EBS, (b) EFS, (c) instance store.' },
                },
              ],
              docs: 'https://aws.amazon.com/products/storage/',
            },
            {
              id: 'a3-t1-c2',
              services: [{ icon: 'storagegateway', label: 'Storage Gateway' }, { icon: 'snowball', label: 'Snow Family' }, { icon: 'backup', label: 'AWS Backup' }],
              title: 'Hybrid & migration: Storage Gateway, Snow Family, AWS Backup',
              summary:
                'Bridge on-premises storage to AWS (Storage Gateway), move large data sets physically (Snow Family), and centrally manage backups (AWS Backup).',
              explanation:
                'AWS Storage Gateway connects on-premises environments to AWS storage with three types: File Gateway (NFS/SMB file interface backed by S3), Volume Gateway (block storage backed up to AWS) and Tape Gateway (a virtual tape library for existing backup software). The AWS Snow Family physically ships rugged, encrypted devices to transfer large data sets when network transfer is impractical: Snowcone (smallest, TBs), Snowball (PB-scale, with edge compute) and Snowmobile (a shipping container for up to ~100 PB). AWS Backup centrally automates and manages backups across services such as EBS, EFS, RDS, DynamoDB, S3 and Storage Gateway, with unified policies and compliance reporting.',
              keyPoints: [
                'Storage Gateway: hybrid storage — File, Volume, and Tape gateways.',
                'Snow Family: physical data transfer — Snowcone (TB), Snowball (PB + edge compute), Snowmobile (~100 PB).',
                'AWS Backup: centralised, policy-driven backups across many AWS services.',
              ],
              exercises: [
                {
                  type: 'quiz',
                  prompt: 'A company must move 80 PB to AWS but its network would take years. Which option fits?',
                  solution: { explanation: 'AWS Snowmobile (a Snow Family option for exabyte/100 PB-scale physical transfer).' },
                },
                {
                  type: 'quiz',
                  prompt: 'Which service centrally manages backups across EBS, RDS, DynamoDB and EFS from one place?',
                  solution: { explanation: 'AWS Backup.' },
                },
              ],
              docs: 'https://aws.amazon.com/storagegateway/',
            },
          ],
        },
        {
          id: 'a3-t2',
          name: 'Databases',
          concepts: [
            {
              id: 'a3-t2-c0',
              services: [{ icon: 'rds', label: 'Amazon RDS' }, { icon: 'aurora', label: 'Amazon Aurora' }],
              title: 'Relational databases: RDS and Aurora',
              summary:
                'Managed relational (SQL) databases for structured data and transactions, with high availability and read scaling built in.',
              explanation:
                'Amazon RDS (Relational Database Service) is a managed service for relational engines — MySQL, PostgreSQL, MariaDB, Oracle and SQL Server — handling provisioning, patching, backups and failover so you do not manage the OS. Multi-AZ deployments keep a synchronous standby in another AZ for automatic failover (high availability), while read replicas use asynchronous replication to scale read-heavy workloads. RDS suits traditional OLTP (online transaction processing) on well-structured data. Amazon Aurora is AWS\'s own MySQL- and PostgreSQL-compatible engine, built for higher performance and availability, replicating data across multiple AZs automatically. Encryption at rest is available via KMS.',
              keyPoints: [
                'RDS: managed relational DB (MySQL, PostgreSQL, MariaDB, Oracle, SQL Server); good for OLTP.',
                'Multi-AZ = synchronous standby for automatic failover (HA); read replicas = async read scaling.',
                'Aurora: AWS\'s high-performance MySQL/PostgreSQL-compatible engine, multi-AZ by design.',
                'Encryption at rest via KMS; AWS manages patching/backups (no OS access).',
              ],
              exercises: [
                {
                  type: 'quiz',
                  prompt: 'A company wants a managed PostgreSQL database with automatic backups and automatic failover to another AZ. What provides the failover?',
                  solution: { explanation: 'An RDS Multi-AZ deployment (synchronous standby with automatic failover).' },
                },
                {
                  type: 'quiz',
                  prompt: 'How do you scale a read-heavy RDS workload?',
                  solution: { explanation: 'Add read replicas (asynchronous replication for read traffic).' },
                },
              ],
              docs: 'https://aws.amazon.com/rds/',
            },
            {
              id: 'a3-t2-c1',
              services: [{ icon: 'dynamodb', label: 'DynamoDB' }, { icon: 'elasticache', label: 'ElastiCache' }, { icon: 'redshift', label: 'Amazon Redshift' }],
              title: 'Non-relational & analytics: DynamoDB, ElastiCache, Redshift, more',
              summary:
                'Purpose-built databases beyond relational: NoSQL (DynamoDB), in-memory cache (ElastiCache), data warehouse (Redshift), graph (Neptune).',
              explanation:
                'Amazon DynamoDB is a fully managed, serverless NoSQL key-value/document database with single-digit-millisecond latency at any scale, automatic replication across three AZs, and optional global tables (multi-region, multi-master); DAX adds an in-memory cache. It suits flexible/changing schemas and very high request rates. Amazon ElastiCache is a managed in-memory cache (Redis or Memcached) for sub-millisecond access — session stores, query caching, leaderboards. Amazon Redshift is a columnar, massively parallel data warehouse for OLAP analytics over large datasets (very different from transactional RDS). Other purpose-built options include Amazon Neptune (graph) and Amazon DocumentDB (document). Rule of thumb: relational (RDS/Aurora) for structured, related data and transactions; DynamoDB for massive-scale, flexible-schema, low-latency; Redshift for analytics.',
              keyPoints: [
                'DynamoDB: serverless NoSQL, single-digit-ms latency, 3-AZ replication, global tables, DAX cache.',
                'ElastiCache: in-memory cache (Redis/Memcached) for sub-ms reads.',
                'Redshift: columnar MPP data warehouse for OLAP analytics.',
                'Neptune (graph), DocumentDB (document) for specialised needs.',
                'OLTP → RDS/Aurora; high-scale flexible → DynamoDB; OLAP analytics → Redshift.',
              ],
              commonMistakes: [
                'Confusing Redshift (analytics / data warehouse / OLAP) with RDS (transactional / OLTP).',
                'Assuming DynamoDB is relational — it is NoSQL (key-value/document).',
              ],
              exercises: [
                {
                  type: 'quiz',
                  prompt: 'Fully managed NoSQL database scaling to millions of requests at single-digit-ms latency, no servers. Which service?',
                  solution: { explanation: 'Amazon DynamoDB.' },
                },
                {
                  type: 'quiz',
                  prompt: 'Which service is a managed data warehouse for analytics over large datasets?',
                  solution: { explanation: 'Amazon Redshift.' },
                },
                {
                  type: 'quiz',
                  prompt: 'You want sub-millisecond reads by caching frequent query results in memory. Which service?',
                  solution: { explanation: 'Amazon ElastiCache.' },
                },
              ],
              docs: 'https://aws.amazon.com/products/databases/',
            },
          ],
        },
        {
          id: 'a3-t3',
          name: 'Networking',
          concepts: [
            {
              id: 'a3-t3-c0',
              services: [{ icon: 'vpc', label: 'Amazon VPC' }],
              title: 'VPC, subnets, gateways and routing',
              summary:
                'A VPC is your own isolated virtual network in AWS, divided into subnets per AZ, with gateways and route tables controlling traffic.',
              explanation:
                'Amazon VPC (Virtual Private Cloud) is a logically isolated virtual network dedicated to your account; it spans all AZs in a Region and you define its IPv4 CIDR block (e.g. 10.0.0.0/16). Subnets carve the VPC into ranges, each mapped to a single AZ (a subnet cannot span AZs). A public subnet has a route to an Internet Gateway (a highly available component that allows internet access); a private subnet does not. A NAT Gateway lets instances in private subnets reach the internet outbound (e.g. for updates) without being reachable inbound. Route tables direct traffic between subnets and gateways. Elastic Network Interfaces (ENIs) are virtual NICs, and VPC Flow Logs capture IP traffic for analysis.',
              keyPoints: [
                'VPC = isolated virtual network; spans all AZs in a Region; you set the CIDR block.',
                'Subnet = range within the VPC tied to ONE AZ; public (has IGW route) vs private.',
                'Internet Gateway = internet access for public subnets; NAT Gateway = outbound-only for private subnets.',
                'Route tables direct traffic; Flow Logs capture IP traffic.',
              ],
              diagram: {
                type: 'mermaid',
                lines: [
                  'flowchart TB',
                  '  IGW[Internet Gateway] --> PUB[Public subnet<br/>AZ a]',
                  '  PUB --> NAT[NAT Gateway]',
                  '  NAT --> PRIV[Private subnet<br/>AZ b]',
                  '  PUB --> EC2A[Web server]',
                  '  PRIV --> EC2B[App / DB server]',
                ],
                caption: 'A typical VPC: public subnet reaches the internet via the IGW; private-subnet instances use a NAT Gateway for outbound only.',
              },
              exercises: [
                {
                  type: 'quiz',
                  prompt: 'Can a single subnet span two Availability Zones?',
                  solution: { explanation: 'No — a subnet maps to exactly one AZ. Use multiple subnets (one per AZ) for multi-AZ designs.' },
                },
                {
                  type: 'quiz',
                  prompt: 'Instances in a private subnet need outbound internet access for updates but must not be reachable from the internet. What do you use?',
                  solution: { explanation: 'A NAT Gateway (outbound only).' },
                },
              ],
              docs: 'https://docs.aws.amazon.com/vpc/',
            },
            {
              id: 'a3-t3-c1',
              title: 'Security Groups vs Network ACLs',
              summary:
                'Two firewall layers: stateful Security Groups at the instance level, and stateless Network ACLs at the subnet level.',
              explanation:
                'Security Groups act at the instance (ENI) level. They are stateful — if you allow inbound traffic, the response is automatically allowed out — and they support allow rules only (everything not allowed is denied); all rules are evaluated. Network ACLs act at the subnet level. They are stateless — you must allow both inbound and the corresponding outbound traffic explicitly — and they support both allow and deny rules, processed in numbered order, applying automatically to every instance in the subnet. Security Groups are the primary, simplest control; NACLs add an optional coarse, subnet-wide layer (e.g. to block a specific IP range).',
              keyPoints: [
                'Security Group: instance-level, stateful, allow rules only, all rules evaluated.',
                'Network ACL: subnet-level, stateless, allow AND deny rules, evaluated in order.',
                'Stateful = return traffic auto-allowed; stateless = must allow both directions.',
              ],
              diagram: {
                type: 'mermaid',
                lines: [
                  'flowchart LR',
                  '  Net[Traffic] --> NACL[Network ACL<br/>subnet · stateless]',
                  '  NACL --> SG[Security Group<br/>instance · stateful]',
                  '  SG --> I[EC2 instance]',
                ],
                caption: 'Traffic passes the subnet-level NACL, then the instance-level Security Group, before reaching the instance.',
              },
              commonMistakes: [
                'Forgetting that NACLs are stateless — you must add a return/outbound rule, unlike Security Groups.',
                'Trying to add a "deny" rule to a Security Group — Security Groups only support allow rules.',
              ],
              exercises: [
                {
                  type: 'quiz',
                  prompt: 'Which firewall is stateful and operates at the instance level?',
                  solution: { explanation: 'A Security Group.' },
                },
                {
                  type: 'quiz',
                  prompt: 'You must explicitly DENY a specific IP range for an entire subnet. Which control supports deny rules?',
                  solution: { explanation: 'A Network ACL (NACLs support allow and deny; Security Groups support allow only).' },
                },
              ],
              docs: 'https://docs.aws.amazon.com/vpc/latest/userguide/VPC_Security.html',
            },
            {
              id: 'a3-t3-c2',
              services: [{ icon: 'directconnect', label: 'Direct Connect' }, { icon: 'globalaccelerator', label: 'Global Accelerator' }],
              title: 'Hybrid & global connectivity: Direct Connect, VPN, peering, Global Accelerator',
              summary:
                'Connect on-premises networks and VPCs privately, and route global users to the nearest healthy endpoint.',
              explanation:
                'AWS Direct Connect provides a dedicated, private physical network link from your data centre to AWS — consistent low latency and high bandwidth, and reduced data-transfer cost for large volumes (setup takes weeks). A Site-to-Site VPN gives an encrypted tunnel over the public internet — quick to set up. VPC Peering connects two VPCs so they communicate over private IPs (including cross-region); AWS Transit Gateway is a hub that connects many VPCs and on-premises networks at scale. AWS Global Accelerator provides static anycast IP addresses advertised from edge locations, routing users over the AWS backbone to the nearest healthy endpoint (EC2, ALB, NLB) and rerouting away from failures in under a minute — without DNS changes.',
              keyPoints: [
                'Direct Connect: dedicated private link to AWS (consistent, high bandwidth, lower transfer cost; slow to provision).',
                'Site-to-Site VPN: encrypted tunnel over the internet (fast to set up).',
                'VPC Peering: private connectivity between two VPCs; Transit Gateway scales many networks via a hub.',
                'Global Accelerator: static anycast IPs + AWS backbone routing to the nearest healthy endpoint.',
              ],
              exercises: [
                {
                  type: 'quiz',
                  prompt: 'You need a dedicated, private, consistent connection between on-premises and AWS (not over the public internet). Which service?',
                  solution: { explanation: 'AWS Direct Connect.' },
                },
                {
                  type: 'quiz',
                  prompt: 'Which service routes global users to the nearest healthy endpoint using static anycast IPs and the AWS backbone?',
                  solution: { explanation: 'AWS Global Accelerator.' },
                },
              ],
              docs: 'https://aws.amazon.com/directconnect/',
            },
          ],
        },
        {
          id: 'a3-t4',
          name: 'Content delivery & DNS',
          concepts: [
            {
              id: 'a3-t4-c0',
              services: [{ icon: 'cloudfront', label: 'Amazon CloudFront' }],
              title: 'Amazon CloudFront (CDN)',
              summary:
                'CloudFront is a content delivery network that caches content at Edge Locations close to users for low latency, with built-in DDoS protection.',
              explanation:
                'Amazon CloudFront is a global CDN that caches data, videos, applications and APIs at 200+ Edge Locations, automatically routing each user to the nearest one to cut latency. Regional Edge Caches sit between your origin and the Edge Locations to improve cache hit rates. Origins can be an S3 bucket, an EC2 instance, an Elastic Load Balancer, or an external server. CloudFront integrates with Route 53, S3, EC2, ELB and Lambda@Edge, and includes built-in protection against network/transport-layer DDoS attacks (and works with AWS Shield and WAF).',
              keyPoints: [
                'CloudFront = global CDN caching content at 200+ Edge Locations near users.',
                'Regional Edge Caches improve hit rates between origin and edge.',
                'Origins: S3, EC2, ELB, or custom/external servers.',
                'Built-in DDoS protection; integrates with Shield, WAF, Route 53, Lambda@Edge.',
              ],
              exercises: [
                {
                  type: 'quiz',
                  prompt: 'A global audience streams videos with high latency from a single Region. Which service caches content near users?',
                  solution: { explanation: 'Amazon CloudFront (CDN).' },
                },
              ],
              docs: 'https://aws.amazon.com/cloudfront/',
            },
            {
              id: 'a3-t4-c1',
              services: [{ icon: 'route53', label: 'Amazon Route 53' }],
              title: 'Amazon Route 53 (DNS) and routing policies',
              summary:
                'Route 53 is a scalable DNS and domain registration service with health checks and several routing policies.',
              explanation:
                'Amazon Route 53 registers domains, resolves DNS names to endpoints, performs health checks, and provides DNS failover. Its routing policies decide how queries are answered: Simple (one record), Failover (to a standby when the primary is unhealthy), Geolocation (by the user\'s location), Geoproximity (by distance to resources), Latency (lowest-latency Region), Weighted (split traffic by assigned weights — useful for A/B tests or canary releases) and Multivalue answer (returns several healthy IPs, a basic load-balancing behaviour). It integrates with ELB, S3 and CloudFront as endpoints.',
              keyPoints: [
                'Route 53: managed DNS + domain registration + health checks + DNS failover.',
                'Routing policies: Simple, Failover, Geolocation, Geoproximity, Latency, Weighted, Multivalue.',
                'Weighted = split traffic by percentage (A/B, canary); Latency = send to lowest-latency Region.',
                'Integrates with ELB, S3 and CloudFront endpoints.',
              ],
              exercises: [
                {
                  type: 'quiz',
                  prompt: 'You want to send 90% of users to the current version and 10% to a new version for a canary test. Which routing policy?',
                  solution: { explanation: 'Weighted routing.' },
                },
                {
                  type: 'quiz',
                  prompt: 'Which routing policy directs users to the Region that gives them the lowest latency?',
                  solution: { explanation: 'Latency-based routing.' },
                },
              ],
              docs: 'https://aws.amazon.com/route53/',
            },
          ],
        },
        {
          id: 'a3-t5',
          name: 'Scaling & load balancing',
          concepts: [
            {
              id: 'a3-t5-c0',
              services: [{ icon: 'autoscaling', label: 'EC2 Auto Scaling' }],
              title: 'EC2 Auto Scaling',
              summary:
                'Auto Scaling automatically launches and terminates EC2 instances to match demand, between a minimum, desired and maximum capacity.',
              explanation:
                'Amazon EC2 Auto Scaling keeps the right number of instances running in an Auto Scaling Group (ASG). A launch template (or launch configuration) defines what each instance looks like (AMI, type, key pair, security groups). You set minimum (the floor), desired (the target it maintains) and maximum (the ceiling) capacity. Scaling policies decide when to add (scale out) or remove (scale in) instances: dynamic/target-tracking scaling responds to live metrics (e.g. keep average CPU at 50%), and scheduled scaling changes capacity at known times. Auto Scaling also replaces unhealthy instances automatically, improving availability.',
              keyPoints: [
                'Auto Scaling Group manages a fleet between min / desired / max capacity.',
                'Launch template defines instance configuration (AMI, type, etc.).',
                'Dynamic/target-tracking scaling reacts to metrics; scheduled scaling acts at set times.',
                'Automatically replaces unhealthy instances → higher availability.',
              ],
              exercises: [
                {
                  type: 'quiz',
                  prompt: 'Which service automatically adds and removes EC2 instances so capacity matches demand?',
                  solution: { explanation: 'Amazon EC2 Auto Scaling.' },
                },
                {
                  type: 'task',
                  prompt: 'What do the minimum, desired and maximum settings of an Auto Scaling Group control?',
                  solution: {
                    explanation: 'The floor it never drops below (min), the target count it maintains (desired), and the ceiling it never exceeds (max).',
                  },
                },
              ],
              docs: 'https://docs.aws.amazon.com/autoscaling/',
            },
            {
              id: 'a3-t5-c1',
              services: [{ icon: 'elb', label: 'Elastic Load Balancing' }],
              title: 'Elastic Load Balancing (ALB, NLB, GLB, Classic)',
              summary:
                'ELB distributes incoming traffic across multiple targets in one or more AZs; there are four load balancer types.',
              explanation:
                'Elastic Load Balancing automatically spreads incoming traffic across targets (EC2 instances, containers, IPs) in one or more AZs, performing health checks and routing only to healthy targets. The Application Load Balancer (ALB) works at Layer 7 (HTTP/HTTPS) with content-based routing — ideal for web apps and microservices. The Network Load Balancer (NLB) works at Layer 4 (TCP/UDP) for ultra-high performance and millions of requests per second with very low latency. The Gateway Load Balancer (GLB) deploys and scales third-party virtual appliances (firewalls, IDS). The Classic Load Balancer is the legacy option. Together with Auto Scaling across multiple AZs, ELB delivers both high availability and elasticity.',
              keyPoints: [
                'ALB: Layer 7 (HTTP/HTTPS), content-based routing — web apps, microservices.',
                'NLB: Layer 4 (TCP/UDP), ultra-high performance, very low latency.',
                'GLB: scales third-party virtual appliances; Classic = legacy.',
                'ELB health-checks targets and routes only to healthy ones; ELB + Auto Scaling = HA + elasticity.',
              ],
              diagram: {
                type: 'mermaid',
                lines: [
                  'flowchart LR',
                  '  U[Users] --> ELB[Load Balancer]',
                  '  ELB --> E1[EC2 - AZ a]',
                  '  ELB --> E2[EC2 - AZ b]',
                  '  ASG[Auto Scaling] -.adjusts.-> E1',
                  '  ASG -.adjusts.-> E2',
                ],
                caption: 'ELB spreads traffic across healthy instances in multiple AZs while Auto Scaling adjusts how many there are.',
              },
              exercises: [
                {
                  type: 'quiz',
                  prompt: 'You need Layer-7 routing based on the URL path for a microservices web app. Which load balancer?',
                  solution: { explanation: 'Application Load Balancer (ALB).' },
                },
                {
                  type: 'task',
                  prompt: 'Explain how ELB and Auto Scaling together provide both high availability and elasticity.',
                  solution: {
                    explanation: 'Auto Scaling adds/removes instances to match demand (elasticity), while ELB spreads traffic across healthy instances in multiple AZs and routes around failures (high availability).',
                  },
                },
              ],
              docs: 'https://aws.amazon.com/elasticloadbalancing/',
            },
          ],
        },
        {
          id: 'a3-t6',
          name: 'Monitoring & management',
          concepts: [
            {
              id: 'a3-t6-c0',
              services: [{ icon: 'cloudwatch', label: 'CloudWatch' }, { icon: 'cloudtrail', label: 'CloudTrail' }, { icon: 'config', label: 'AWS Config' }],
              title: 'CloudWatch, CloudTrail, Config and X-Ray',
              summary:
                'Observe performance (CloudWatch), audit API activity (CloudTrail), track configuration (Config), and trace requests (X-Ray).',
              explanation:
                'Amazon CloudWatch is the monitoring service: it collects metrics, logs and events, shows dashboards, and triggers alarms and automated actions (e.g. alarm when average CPU > 80%). Basic monitoring is 5-minute intervals; detailed monitoring is 1-minute (chargeable). Note there is no built-in memory metric for EC2 — that needs the CloudWatch agent. AWS CloudTrail is the audit service: it records API calls and account activity (who, what, when, from where) to S3 for governance — distinct from CloudWatch\'s performance focus. AWS Config records resource configurations and changes over time and checks them against rules. AWS X-Ray traces requests across distributed/microservice applications to find bottlenecks.',
              keyPoints: [
                'CloudWatch: metrics, logs, dashboards, alarms — performance/operational monitoring.',
                'CloudTrail: records API activity for auditing → S3 (who/what/when).',
                'Config: tracks resource configuration history and compliance.',
                'X-Ray: distributed request tracing for microservices.',
                'Remember: CloudWatch = what is happening (performance); CloudTrail = who did what (audit).',
              ],
              commonMistakes: [
                'Mixing up CloudWatch (monitoring/metrics) and CloudTrail (API audit log).',
              ],
              exercises: [
                {
                  type: 'quiz',
                  prompt: 'You want an alarm when average CPU across instances exceeds 80%. Which service?',
                  solution: { explanation: 'Amazon CloudWatch.' },
                },
                {
                  type: 'quiz',
                  prompt: 'Which service answers "which IAM user terminated this instance, and when?"',
                  solution: { explanation: 'AWS CloudTrail.' },
                },
              ],
              docs: 'https://aws.amazon.com/cloudwatch/',
            },
            {
              id: 'a3-t6-c1',
              services: [{ icon: 'organizations', label: 'Organizations' }, { icon: 'cloudformation', label: 'CloudFormation' }, { icon: 'systemsmanager', label: 'Systems Manager' }, { icon: 'trustedadvisor', label: 'Trusted Advisor' }],
              title: 'Management & governance: Organizations, Control Tower, CloudFormation, Systems Manager, Trusted Advisor',
              summary:
                'Manage many accounts, automate infrastructure, operate fleets, and get best-practice recommendations.',
              explanation:
                'AWS Organizations centrally manages multiple AWS accounts with organisational units (OUs), Service Control Policies (SCP guardrails) and consolidated billing. AWS Control Tower sets up and governs a secure multi-account "landing zone" with pre-configured guardrails. AWS CloudFormation is infrastructure as code — JSON/YAML templates that provision resources repeatably across accounts and Regions. AWS Systems Manager operates and configures fleets (Run Command, Patch Manager, Session Manager, Parameter Store). AWS Service Catalog lets organisations publish approved products users can self-serve. AWS Trusted Advisor inspects your account and recommends improvements across five categories: cost optimisation, performance, security, fault tolerance and service limits (full checks on Business/Enterprise support). The AWS Personal Health Dashboard alerts you to events affecting your resources.',
              keyPoints: [
                'Organizations: multi-account management, OUs, SCP guardrails, consolidated billing.',
                'Control Tower: governed multi-account landing zone with guardrails.',
                'CloudFormation: infrastructure as code (JSON/YAML templates).',
                'Systems Manager: operate/patch/configure fleets; Service Catalog: approved self-service products.',
                'Trusted Advisor: checks across cost, performance, security, fault tolerance, service limits.',
              ],
              exercises: [
                {
                  type: 'quiz',
                  prompt: 'Which service provisions AWS resources repeatably from a JSON or YAML template (infrastructure as code)?',
                  solution: { explanation: 'AWS CloudFormation.' },
                },
                {
                  type: 'quiz',
                  prompt: 'Which service inspects your account and recommends improvements across cost, performance, security, fault tolerance and service limits?',
                  solution: { explanation: 'AWS Trusted Advisor.' },
                },
              ],
              docs: 'https://aws.amazon.com/organizations/',
            },
          ],
        },
        {
          id: 'a3-t7',
          name: 'Application integration & analytics',
          concepts: [
            {
              id: 'a3-t7-c0',
              services: [{ icon: 'sqs', label: 'Amazon SQS' }, { icon: 'sns', label: 'Amazon SNS' }, { icon: 'stepfunctions', label: 'Step Functions' }, { icon: 'eventbridge', label: 'EventBridge' }],
              title: 'Integration: SQS, SNS, Step Functions, EventBridge, MQ',
              summary:
                'Decouple components with queues (SQS), pub/sub notifications (SNS), workflows (Step Functions), event routing (EventBridge) and managed brokers (MQ).',
              explanation:
                'Amazon SQS (Simple Queue Service) is a pull-based message queue: a producer puts messages in, consumers poll and process them, buffering load and decoupling components so a slow/failed consumer does not block the producer (Standard vs FIFO queues). Amazon SNS (Simple Notification Service) is push-based pub/sub: publishers send to a topic and all subscribers (Lambda, SQS, HTTP/S, email, SMS) receive it — good for fan-out. AWS Step Functions orchestrates multi-step workflows as a visual state machine (Amazon States Language). Amazon EventBridge routes events between AWS services and SaaS apps. Amazon MQ is a managed message broker for ActiveMQ/RabbitMQ when you need standard protocols (e.g. migrating existing apps). Decoupling improves resilience and scalability.',
              keyPoints: [
                'SQS: pull-based queue, buffers and decouples producers/consumers (Standard & FIFO).',
                'SNS: push-based pub/sub topic with fan-out to many subscribers.',
                'Step Functions: orchestrate multi-step workflows (state machine).',
                'EventBridge: event bus routing events between services/SaaS; MQ: managed ActiveMQ/RabbitMQ.',
              ],
              diagram: {
                type: 'mermaid',
                lines: [
                  'flowchart LR',
                  '  Pub[Publisher] --> SNS[(SNS topic)]',
                  '  SNS --> L[Lambda]',
                  '  SNS --> Q[[SQS queue]]',
                  '  SNS --> E[Email / SMS]',
                ],
                caption: 'SNS fan-out: one published message is pushed to many subscribers (Lambda, an SQS queue, email/SMS).',
              },
              commonMistakes: [
                'Mixing up SQS (pull-based queue) and SNS (push-based pub/sub).',
              ],
              exercises: [
                {
                  type: 'quiz',
                  prompt: 'To buffer a backlog of orders reliably between a producer and a consumer, which service?',
                  solution: { explanation: 'Amazon SQS (a managed message queue).' },
                },
                {
                  type: 'quiz',
                  prompt: 'Which service pushes one message to many subscribers (Lambda, email, SQS) at once?',
                  solution: { explanation: 'Amazon SNS (pub/sub fan-out).' },
                },
              ],
              docs: 'https://aws.amazon.com/sqs/',
            },
            {
              id: 'a3-t7-c1',
              services: [{ icon: 'athena', label: 'Amazon Athena' }, { icon: 'glue', label: 'AWS Glue' }, { icon: 'emr', label: 'Amazon EMR' }, { icon: 'kinesis', label: 'Amazon Kinesis' }, { icon: 'quicksight', label: 'QuickSight' }],
              title: 'Analytics: Athena, Glue, EMR, Kinesis, QuickSight',
              summary:
                'Query data in S3 with SQL (Athena), run ETL (Glue), process big data (EMR), handle streaming (Kinesis), and build dashboards (QuickSight).',
              explanation:
                'Amazon Athena is a serverless service that runs standard SQL directly against data in S3, paying per query (no servers, using a managed data catalog). AWS Glue is serverless ETL (extract, transform, load) that discovers and catalogs data and runs transformation jobs. Amazon EMR (Elastic MapReduce) runs big-data frameworks like Apache Spark and Hadoop on managed clusters for log analysis, ETL and ML. Amazon Kinesis handles real-time streaming data: Data Streams (ingest/store for custom processing), Data Firehose (load streams into S3/Redshift/etc.), Data Analytics (SQL on streams) and Video Streams. Amazon QuickSight is a managed business-intelligence service for interactive dashboards. (Amazon Redshift, covered under databases, is the data warehouse these often feed.)',
              keyPoints: [
                'Athena: serverless SQL over S3, pay per query.',
                'Glue: serverless ETL + data catalog.',
                'EMR: managed big-data clusters (Spark/Hadoop).',
                'Kinesis: real-time streaming (Data Streams, Firehose, Analytics, Video).',
                'QuickSight: BI dashboards.',
              ],
              exercises: [
                {
                  type: 'quiz',
                  prompt: 'Which service runs standard SQL queries directly against data stored in Amazon S3, serverless?',
                  solution: { explanation: 'Amazon Athena.' },
                },
                {
                  type: 'quiz',
                  prompt: 'Which service is used to ingest and process real-time streaming data?',
                  solution: { explanation: 'Amazon Kinesis.' },
                },
              ],
              docs: 'https://aws.amazon.com/athena/',
            },
          ],
        },
      ],
    },

    /* ──────────────── DOMAIN 4 — BILLING, PRICING & SUPPORT (12%) ──────────────── */
    {
      level: 4,
      name: 'Billing & Support',
      focus: 'Pricing models, cost management tools, consolidated billing, and support plans (Domain 4 · 12%)',
      accent: '#1ba85a',
      soft: '#e4f7ec',
      topics: [
        {
          id: 'a4-t0',
          name: 'Pricing fundamentals',
          concepts: [
            {
              id: 'a4-t0-c0',
              title: 'How AWS pricing works and the Free Tier',
              summary:
                'Three fundamental cost drivers — compute, storage, and data transfer out — plus the AWS Free Tier and pay-less-as-you-grow principles.',
              explanation:
                'AWS has three fundamental cost drivers: compute (time/capacity used), storage (data stored) and data transfer OUT of AWS. Inbound data transfer is generally free, and transfer between many services in the same Region is often free. There are no upfront charges and no termination fees on pay-as-you-go usage, and volume discounts apply. Several services have no charge themselves (you pay only for the resources they create) — e.g. VPC, IAM, Auto Scaling, CloudFormation, Elastic Beanstalk and consolidated billing. The AWS Free Tier has three types: Always Free (e.g. 1M Lambda requests/month), 12-months Free (limited EC2/S3 etc. for the first year), and short-term Trials. Three pricing principles: pay-as-you-go, pay less when you reserve, and pay less the more you use.',
              keyPoints: [
                'Three cost drivers: compute, storage, and data transfer OUT.',
                'Data transfer IN is generally free; OUT to the internet is charged.',
                'Free Tier types: Always Free, 12-months Free, Trials.',
                'Principles: pay-as-you-go, pay less when you reserve, pay less as you use more.',
                'Some services are free; you pay only for resources they provision (VPC, IAM, CloudFormation, etc.).',
              ],
              commonMistakes: [
                'Assuming all data transfer is free — outbound transfer to the internet is billed.',
                'Forgetting the 12-month Free Tier expires, after which resources incur charges.',
              ],
              exercises: [
                {
                  type: 'quiz',
                  prompt: 'Is data transferred INTO AWS or OUT of AWS to the internet generally the one that is charged?',
                  solution: { explanation: 'Data transfer OUT is charged; data transfer IN is generally free.' },
                },
                {
                  type: 'quiz',
                  prompt: 'Name the three fundamental drivers of cost on AWS.',
                  solution: { explanation: 'Compute, storage, and data transfer (out).' },
                },
              ],
              docs: 'https://aws.amazon.com/pricing/',
            },
          ],
        },
        {
          id: 'a4-t1',
          name: 'Cost management tools',
          concepts: [
            {
              id: 'a4-t1-c0',
              services: [{ icon: 'budgets', label: 'AWS Budgets' }, { icon: 'costexplorer', label: 'Cost Explorer' }, { icon: 'pricingcalculator', label: 'Pricing Calculator' }],
              title: 'Budgets, Cost Explorer, Pricing Calculator, Cost & Usage Report',
              summary:
                'Estimate before you build, analyse what you spent, and get alerted before you overspend.',
              explanation:
                'AWS Pricing Calculator estimates costs BEFORE you build, by modelling a proposed architecture. AWS Cost Explorer visualises and analyses past and current spend (about 13 months of history with a 3-month forecast), with filters by service, account and tag. AWS Budgets lets you set custom cost/usage/coverage budgets and alerts (via SNS/email) when actual or forecast spend crosses a threshold. The Cost & Usage Report (CUR) delivers the most detailed line-item breakdown to S3. Cost allocation tags (key/value metadata) let you group and track spend by project, team or environment.',
              keyPoints: [
                'Pricing Calculator: estimate costs BEFORE deploying.',
                'Cost Explorer: analyse & forecast past/current spend (~13 months history).',
                'AWS Budgets: set budgets and get alerts on cost/usage thresholds.',
                'Cost & Usage Report: most detailed line-item breakdown to S3.',
                'Cost allocation tags: group/track spend by project, team, environment.',
              ],
              commonMistakes: [
                'Confusing the Pricing Calculator (estimate before) with Cost Explorer (analyse actual spend after).',
              ],
              exercises: [
                {
                  type: 'quiz',
                  prompt: 'You want an email alert when monthly spend is forecast to exceed $500. Which service?',
                  solution: { explanation: 'AWS Budgets.' },
                },
                {
                  type: 'quiz',
                  prompt: 'Before launching, you want to estimate the monthly cost of a proposed architecture. Which tool?',
                  solution: { explanation: 'AWS Pricing Calculator.' },
                },
              ],
              docs: 'https://aws.amazon.com/aws-cost-management/',
            },
            {
              id: 'a4-t1-c1',
              services: [{ icon: 'organizations', label: 'Organizations' }],
              title: 'AWS Organizations & consolidated billing',
              summary:
                'Manage many accounts centrally, get one bill, and benefit from combined volume discounts.',
              explanation:
                'AWS Organizations lets you group multiple AWS accounts under a management (paying) account, with organisational units (OUs) and Service Control Policies (SCPs) as permission guardrails. Consolidated billing combines usage across all member accounts into a single bill, and aggregated usage can unlock volume (tiered) discounts and share Reserved Instance / Savings Plan benefits across accounts — at no additional cost. Member accounts stay independent and cannot access each other\'s resources. A common best practice is to use the management account for billing only and apply MFA and strong passwords on root.',
              keyPoints: [
                'Organizations: central multi-account management with OUs and SCP guardrails.',
                'Consolidated billing: one bill across accounts; aggregated usage → volume discounts.',
                'Reserved Instance / Savings Plan benefits shared across accounts.',
                'Member accounts remain isolated; use the management account for billing only.',
              ],
              exercises: [
                {
                  type: 'quiz',
                  prompt: 'A company with 12 AWS accounts wants one combined bill and aggregated volume discounts. Which service?',
                  solution: { explanation: 'AWS Organizations (consolidated billing).' },
                },
                {
                  type: 'quiz',
                  prompt: 'What org-wide feature sets permission guardrails on what member accounts can do?',
                  solution: { explanation: 'Service Control Policies (SCPs) in AWS Organizations.' },
                },
              ],
              docs: 'https://docs.aws.amazon.com/organizations/latest/userguide/orgs_manage_accounts_consolidated-billing.html',
            },
          ],
        },
        {
          id: 'a4-t2',
          name: 'Support plans',
          concepts: [
            {
              id: 'a4-t2-c0',
              services: [{ icon: 'support', label: 'AWS Support' }, { icon: 'trustedadvisor', label: 'Trusted Advisor' }],
              title: 'AWS Support plans and Trusted Advisor',
              summary:
                'Four support tiers — Basic, Developer, Business, Enterprise — with increasing capability, faster response, and fuller Trusted Advisor checks.',
              explanation:
                'AWS offers four support plans. Basic (free): account/billing support, documentation, and a core set of Trusted Advisor checks. Developer: business-hours email guidance — for experimentation/dev. Business: 24/7 phone, chat and email, the full set of Trusted Advisor checks, and a ~1-hour response for production-down issues — for production workloads. Enterprise: everything in Business plus a dedicated Technical Account Manager (TAM), Concierge support and the fastest (~15-minute) response for business-critical issues. AWS Trusted Advisor inspects your account and recommends improvements across five categories — cost optimisation, performance, security, fault tolerance and service limits — with the full set of checks available on Business and Enterprise.',
              keyPoints: [
                'Basic: free — billing/account support, docs, core Trusted Advisor checks.',
                'Developer: business-hours email; for testing/experimentation.',
                'Business: 24/7 support + full Trusted Advisor; production workloads (~1h critical response).',
                'Enterprise: adds a dedicated Technical Account Manager (TAM) + Concierge (~15min critical response).',
                'Trusted Advisor categories: cost, performance, security, fault tolerance, service limits.',
              ],
              diagram: {
                type: 'mermaid',
                lines: [
                  'flowchart LR',
                  '  B[Basic<br/>free] --> D[Developer<br/>biz-hours email]',
                  '  D --> Bu[Business<br/>24/7 + full TA]',
                  '  Bu --> E[Enterprise<br/>+ TAM + Concierge]',
                ],
                caption: 'Support plans increase in capability, response speed and cost from Basic to Enterprise.',
              },
              exercises: [
                {
                  type: 'quiz',
                  prompt: 'Which support plan includes a dedicated Technical Account Manager (TAM)?',
                  solution: { explanation: 'Enterprise Support.' },
                },
                {
                  type: 'quiz',
                  prompt: 'A company running production workloads needs 24/7 phone/chat support and full Trusted Advisor checks at the lowest such tier. Which plan?',
                  solution: { explanation: 'Business Support.' },
                },
                {
                  type: 'task',
                  prompt: 'List the five categories of checks AWS Trusted Advisor provides.',
                  solution: { explanation: 'Cost optimisation, performance, security, fault tolerance, and service limits.' },
                },
              ],
              docs: 'https://aws.amazon.com/premiumsupport/plans/',
            },
          ],
        },
      ],
    },
  ],
};

export default content;
