// AWS Certified Solutions Architect – Associate (SAA-C03) — course content.
// A complete, structured path to the Solutions Architect – Associate exam, organised
// into the four official exam domains. The factual material (service names and what they
// do) is rewritten in our own words for self-study; diagrams are our own Mermaid
// creations. Not affiliated with or endorsed by AWS.
//
// Exam domains & weightings (SAA-C03):
//   1. Design Secure Architectures ............ 30%
//   2. Design Resilient Architectures ......... 26%
//   3. Design High-Performing Architectures ... 24%
//   4. Design Cost-Optimized Architectures .... 20%

const content = {
  meta: {
    title: 'AWS Solutions Architect – Associate (SAA-C03)',
    description:
      'A deep, exam-focused path to the AWS Certified Solutions Architect – Associate (SAA-C03): designing secure, resilient, high-performing and cost-optimized architectures on AWS. Covers IAM and federation, VPC networking, encryption with KMS, multi-tier and decoupled designs, high availability and disaster recovery, data stores, performance and caching, and cost optimization — with diagrams, JSON/CLI snippets, quizzes and hands-on tasks.',
    schemaVersion: '1.0',
    status: 'complete',
  },
  levels: [
    /* ───────────────────── DOMAIN 1 — DESIGN SECURE ARCHITECTURES (30%) ───────────────────── */
    {
      level: 1,
      name: 'Design Secure Architectures',
      focus: 'Securing access with IAM and federation, designing secure VPC networks, and protecting data with encryption and secure access controls (Domain 1 · 30%)',
      accent: '#2d6bff',
      soft: '#eaf0ff',
      topics: [
        {
          id: 'saa1-t0',
          name: 'Identity & access management',
          concepts: [
            {
              id: 'saa1-t0-c0',
              services: [{ icon: 'iam', label: 'AWS IAM' }],
              title: 'IAM policies: identity-based, resource-based, and the evaluation logic',
              summary:
                'IAM decides who can do what to which resource. Permissions come from identity-based policies, resource-based policies, permissions boundaries, SCPs and session policies, and the architect must know how a request is evaluated.',
              explanation:
                'Every AWS API call is authorised against a set of JSON policies. Identity-based policies attach to a user, group or role and say what that principal may do. Resource-based policies attach to the resource itself (an S3 bucket policy, an SQS queue policy, a KMS key policy) and say which principals may use it — they also enable cross-account access without assuming a role. The effective permission is the result of a defined evaluation order: an explicit Deny anywhere always wins; otherwise the request must be allowed by at least one applicable policy. When several policy types apply, the request must be permitted by each relevant type — an Organizations Service Control Policy (SCP) and a permissions boundary set the maximum possible permissions (they grant nothing on their own, they only cap), while identity- and resource-based policies grant the actual access. As an architect you reason about least privilege: grant the narrowest set of actions and resources, scope with conditions (source IP, MFA present, tag values), and prefer managed policies for common patterns.',
              analogy:
                'Think of a nightclub. The guest list (identity policy) says you are allowed in; the bouncer\'s blacklist (explicit Deny) overrides any list; the building fire code (SCP / permissions boundary) caps the maximum number who can ever be inside no matter what the guest list says.',
              keyPoints: [
                'Identity-based policy: attached to a user/group/role; says what that principal can do.',
                'Resource-based policy: attached to the resource (bucket, queue, KMS key); enables cross-account access without role assumption.',
                'Explicit Deny always overrides any Allow; absence of an Allow is an implicit deny.',
                'SCPs and permissions boundaries only cap maximum permissions — they never grant access.',
                'Use Condition keys (aws:SourceIp, aws:MultiFactorAuthPresent, tag conditions) to tighten policies.',
                'Apply least privilege; validate with IAM Access Analyzer.',
              ],
              code: {
                language: 'json',
                lines: [
                  '{',
                  '  "Version": "2012-10-17",',
                  '  "Statement": [{',
                  '    "Effect": "Allow",',
                  '    "Action": ["s3:GetObject", "s3:PutObject"],',
                  '    "Resource": "arn:aws:s3:::reports-bucket/team-a/*",',
                  '    "Condition": {',
                  '      "Bool": { "aws:MultiFactorAuthPresent": "true" }',
                  '    }',
                  '  }]',
                  '}',
                ],
                explanation:
                  'An identity-based policy that allows reading and writing only objects under team-a/ in one bucket, and only when the caller authenticated with MFA. The Condition narrows an otherwise broad grant.',
              },
              diagram: {
                type: 'mermaid',
                lines: [
                  'flowchart TB',
                  '  Req[API request] --> Deny{Explicit Deny<br/>anywhere?}',
                  '  Deny -->|yes| Block[Denied]',
                  '  Deny -->|no| Cap{Within SCP and<br/>boundary cap?}',
                  '  Cap -->|no| Block',
                  '  Cap -->|yes| Allow{Allowed by an<br/>identity or resource policy?}',
                  '  Allow -->|yes| Ok[Allowed]',
                  '  Allow -->|no| Block',
                ],
                caption: 'Simplified IAM evaluation: an explicit Deny wins, the request must fit within the SCP/boundary cap, and it must be allowed by at least one applicable policy.',
              },
              commonMistakes: [
                'Believing an SCP or permissions boundary grants access — they only set the ceiling.',
                'Using a wildcard Resource and Action ("*") when least privilege would do.',
                'Forgetting that a resource-based policy can grant cross-account access without the other account assuming a role.',
              ],
              exercises: [
                {
                  type: 'quiz',
                  prompt:
                    'A user has an identity policy allowing s3:GetObject, and the bucket has no bucket policy, but the account\'s SCP denies all S3 actions. Can the user read the object?',
                  hint: 'Where does an explicit Deny sit in the evaluation order?',
                  solution: {
                    explanation:
                      'No. The SCP\'s explicit Deny applies to everyone in the account (including this user) and an explicit Deny always overrides any Allow.',
                  },
                },
                {
                  type: 'predict',
                  prompt:
                    'Account A wants account B to read objects from A\'s bucket without A creating IAM users for B\'s staff. What is the cleanest mechanism?',
                  solution: {
                    explanation:
                      'A resource-based policy (an S3 bucket policy) granting the s3:GetObject action to B\'s account or a role in B. Resource-based policies enable cross-account access directly.',
                  },
                },
                {
                  type: 'task',
                  prompt: 'Name two Condition keys you could use to require that a sensitive action only succeeds from the corporate network and only with MFA.',
                  solution: {
                    explanation:
                      'aws:SourceIp (restrict to the corporate CIDR range) and aws:MultiFactorAuthPresent set to true.',
                  },
                },
              ],
              docs: 'https://docs.aws.amazon.com/IAM/latest/UserGuide/reference_policies_evaluation-logic.html',
            },
            {
              id: 'saa1-t0-c1',
              services: [{ icon: 'iam', label: 'AWS IAM' }],
              title: 'IAM roles and temporary credentials with STS',
              summary:
                'Roles are identities with no long-term credentials that principals assume to receive temporary credentials from STS. They are the preferred way to grant access to AWS services, cross-account principals and federated users.',
              explanation:
                'An IAM role has two parts: a trust policy (a resource-based policy that says who may assume the role) and one or more permission policies (what the role can do once assumed). When a principal assumes a role, AWS STS (Security Token Service) issues temporary credentials valid for a configurable session (typically 15 minutes to 12 hours, or up to a role\'s maximum). Because the credentials expire and are never stored on disk, roles are far safer than embedding access keys. As an architect you use roles in three classic situations: (1) an AWS service needs to act on your behalf — an EC2 instance profile lets code on the instance call S3, or a Lambda execution role lets a function write to DynamoDB; (2) cross-account access — a role in the target account trusts a principal in the source account; (3) federation — external identities assume a role after authenticating with an identity provider. EC2 instances retrieve role credentials from the Instance Metadata Service; always require IMDSv2 (token-based) to defend against SSRF attacks.',
              analogy:
                'A role is like a hotel keycard. You do not own it permanently — you present ID (your trust relationship), the front desk (STS) hands you a card that opens specific doors and expires at checkout. Lose it and it is worthless tomorrow.',
              keyPoints: [
                'Role = trust policy (who can assume) + permission policy (what it can do).',
                'STS issues temporary, expiring credentials when a role is assumed — nothing long-lived stored.',
                'EC2 instance profile / Lambda execution role: let AWS services act for you without static keys.',
                'Cross-account: a role in account B trusts a principal in account A; A calls sts:AssumeRole.',
                'Require IMDSv2 on EC2 to prevent metadata credential theft via SSRF.',
                'Roles are the recommended alternative to IAM users with access keys for applications.',
              ],
              code: {
                language: 'json',
                lines: [
                  '{',
                  '  "Version": "2012-10-17",',
                  '  "Statement": [{',
                  '    "Effect": "Allow",',
                  '    "Principal": { "Service": "ec2.amazonaws.com" },',
                  '    "Action": "sts:AssumeRole"',
                  '  }]',
                  '}',
                ],
                explanation:
                  'A role trust policy that lets the EC2 service assume the role. Attached as an instance profile, code on the instance receives temporary credentials automatically — no access keys to manage.',
              },
              diagram: {
                type: 'mermaid',
                lines: [
                  'flowchart LR',
                  '  App[App on EC2] -->|uses instance profile| Role[IAM role]',
                  '  Role -->|sts AssumeRole| STS[AWS STS]',
                  '  STS -->|temp credentials| App',
                  '  App -->|temp creds| S3[(Amazon S3)]',
                ],
                caption: 'An EC2 instance assumes a role through STS and uses short-lived credentials to call S3 — no long-term keys live on the instance.',
              },
              commonMistakes: [
                'Baking access keys into application code or AMIs instead of attaching a role.',
                'Leaving IMDSv1 enabled, which lets an SSRF flaw exfiltrate role credentials.',
                'Confusing the trust policy (who may assume) with the permission policy (what the role can do).',
              ],
              exercises: [
                {
                  type: 'quiz',
                  prompt:
                    'A containerised app on ECS Fargate must read from DynamoDB. How should it obtain credentials?',
                  solution: {
                    explanation:
                      'Assign an IAM task role to the ECS task. The task receives temporary credentials via STS to call DynamoDB — no keys stored in the container.',
                  },
                },
                {
                  type: 'quiz',
                  prompt:
                    'What protects EC2 role credentials from being stolen through a server-side request forgery (SSRF) vulnerability?',
                  hint: 'It changes how the metadata endpoint is accessed.',
                  solution: {
                    explanation:
                      'Enforcing IMDSv2, which requires a session token (a PUT then GET) and blocks the simple unauthenticated GET that SSRF attacks abuse.',
                  },
                },
              ],
              docs: 'https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles.html',
            },
            {
              id: 'saa1-t0-c2',
              services: [{ icon: 'iam', label: 'IAM Identity Center' }, { icon: 'cognito', label: 'Amazon Cognito' }, { icon: 'organizations', label: 'AWS Organizations' }],
              title: 'Federation, Identity Center, and multi-account governance',
              summary:
                'Workforce users sign in once through IAM Identity Center and federation; customer-facing apps use Cognito; and AWS Organizations with SCPs governs many accounts centrally.',
              explanation:
                'Real architectures rarely use stand-alone IAM users. For employees, AWS IAM Identity Center (the successor to AWS SSO) provides single sign-on across all accounts in an organization and to SaaS apps; it connects to an external identity source (Active Directory, Okta, Entra ID) via SAML 2.0 and maps groups to permission sets that become roles in each account. For application end-users, Amazon Cognito user pools provide sign-up/sign-in and token issuance (OIDC/OAuth2), while identity pools exchange those tokens for temporary AWS credentials so a mobile or web app can call AWS directly with least privilege. At the organisation level, AWS Organizations groups accounts into Organizational Units (OUs) and applies Service Control Policies (SCPs) — guardrails that cap what any principal (even the root user) in those accounts can do, for example denying use of disallowed Regions or preventing anyone from disabling CloudTrail. AWS Control Tower automates a well-architected multi-account landing zone on top of Organizations with built-in guardrails.',
              keyPoints: [
                'IAM Identity Center: workforce SSO across accounts and SaaS, sourced from AD/Okta/Entra via SAML; permission sets become roles per account.',
                'Cognito user pools = app sign-in/token issuance; identity pools = exchange tokens for temporary AWS credentials.',
                'Organizations: group accounts into OUs; SCPs cap permissions org-wide (guardrails, not grants).',
                'SCPs apply even to the root user of member accounts — useful for mandatory controls.',
                'Control Tower automates a multi-account landing zone with baseline guardrails.',
                'Federation means no per-user IAM users to manage — credentials stay in the corporate directory.',
              ],
              diagram: {
                type: 'mermaid',
                lines: [
                  'flowchart TB',
                  '  IdP[Corporate directory<br/>AD / Okta / Entra] -->|SAML| IC[IAM Identity Center]',
                  '  IC --> A1[Account Dev]',
                  '  IC --> A2[Account Prod]',
                  '  Org[AWS Organizations] -->|SCP guardrails| A1',
                  '  Org -->|SCP guardrails| A2',
                ],
                caption: 'Workforce identities federate through IAM Identity Center into each account, while Organizations SCPs set guardrails across all accounts.',
              },
              commonMistakes: [
                'Confusing Cognito (customer-facing app identity) with IAM Identity Center (workforce SSO).',
                'Expecting an SCP to grant permissions — it only limits the maximum.',
                'Creating one IAM user per employee instead of federating through a directory.',
              ],
              exercises: [
                {
                  type: 'quiz',
                  prompt:
                    'A company with 40 AWS accounts wants employees to log in once with their existing Active Directory credentials and get the right role in each account. Which service?',
                  solution: {
                    explanation:
                      'AWS IAM Identity Center, federated to Active Directory, with permission sets mapped to AD groups giving each user a role in the appropriate accounts.',
                  },
                },
                {
                  type: 'quiz',
                  prompt:
                    'Management wants to guarantee that no team in any member account can launch resources outside eu-west-1 and us-east-1, regardless of their IAM permissions. What enforces this?',
                  solution: {
                    explanation:
                      'A Service Control Policy in AWS Organizations that denies actions in all Regions except the two allowed ones. SCPs cap permissions for every principal in the targeted accounts.',
                  },
                },
                {
                  type: 'predict',
                  prompt:
                    'A mobile game needs players to sign in with Google and then upload save files to a private S3 prefix unique to each player. Which AWS identity service handles this end-to-end?',
                  solution: {
                    explanation:
                      'Amazon Cognito — a user pool (or direct social federation) for sign-in, and an identity pool to issue temporary AWS credentials scoped (via the role and policy variables) to each player\'s own S3 prefix.',
                  },
                },
              ],
              docs: 'https://docs.aws.amazon.com/singlesignon/latest/userguide/what-is.html',
            },
          ],
        },
        {
          id: 'saa1-t1',
          name: 'Secure VPC networking',
          concepts: [
            {
              id: 'saa1-t1-c0',
              services: [{ icon: 'vpc', label: 'Amazon VPC' }],
              title: 'VPC design: subnets, route tables, gateways',
              summary:
                'A VPC is your private virtual network in a Region. You carve it into public and private subnets across AZs, control routing with route tables, and reach the internet through internet and NAT gateways.',
              explanation:
                'A Virtual Private Cloud (VPC) is a logically isolated network you define with a CIDR block (for example 10.0.0.0/16). You divide it into subnets, each living in exactly one Availability Zone — so spreading subnets across AZs is the foundation of high availability. A subnet is public if its route table sends 0.0.0.0/0 to an Internet Gateway (IGW); it is private if it has no such route. Resources in a public subnet that need inbound access from the internet also need a public IP or Elastic IP. Private subnets that must reach the internet outbound only (for patches or API calls) route 0.0.0.0/0 to a NAT Gateway that sits in a public subnet — the NAT translates the private addresses and prevents inbound connections. The standard secure pattern places load balancers in public subnets and application servers and databases in private subnets, so nothing in the data tier is directly reachable from the internet. A VPC is Regional; subnets are AZ-scoped; route tables and gateways stitch the topology together.',
              analogy:
                'A VPC is a private office building. Public subnets are the lobby with a street door (the Internet Gateway). Private subnets are the back offices with no street access — staff there can still send mail out through the mailroom (NAT Gateway) but no stranger can walk in.',
              keyPoints: [
                'VPC = isolated virtual network with a CIDR; Regional. Subnets are AZ-scoped — spread them across AZs for HA.',
                'Public subnet = route to an Internet Gateway; private subnet = no such route.',
                'Internet Gateway: bidirectional internet access for public subnets.',
                'NAT Gateway: outbound-only internet for private subnets; lives in a public subnet, is managed and AZ-resilient (deploy one per AZ).',
                'Best practice: ALBs in public subnets, app servers and databases in private subnets.',
                'A NAT Gateway is a billed, managed resource; egress-only internet gateways serve the same role for IPv6.',
              ],
              diagram: {
                type: 'mermaid',
                lines: [
                  'flowchart TB',
                  '  IGW[Internet Gateway] --> PubA[Public subnet AZ a<br/>ALB and NAT]',
                  '  IGW --> PubB[Public subnet AZ b<br/>ALB and NAT]',
                  '  PubA --> PrivA[Private subnet AZ a<br/>App servers]',
                  '  PubB --> PrivB[Private subnet AZ b<br/>App servers]',
                  '  PrivA --> DBA[Private subnet AZ a<br/>Database]',
                  '  PrivB --> DBB[Private subnet AZ b<br/>Database]',
                ],
                caption: 'A multi-AZ VPC with public subnets for the load balancer and NAT, and private subnets for the app and database tiers.',
              },
              commonMistakes: [
                'Putting databases in a public subnet — keep data tiers private.',
                'Deploying a single NAT Gateway and assuming it is multi-AZ — it lives in one AZ; deploy one per AZ for resilience.',
                'Forgetting that a subnet cannot span Availability Zones.',
              ],
              exercises: [
                {
                  type: 'quiz',
                  prompt:
                    'Application servers in a private subnet must download OS patches from the internet but must never accept inbound connections from it. What do you add?',
                  solution: {
                    explanation:
                      'A NAT Gateway in a public subnet, with the private subnet\'s route table sending 0.0.0.0/0 to it. The NAT allows outbound-initiated traffic only and blocks inbound connections.',
                  },
                },
                {
                  type: 'quiz',
                  prompt: 'What single piece of configuration makes a subnet "public"?',
                  hint: 'It is about routing, not naming.',
                  solution: {
                    explanation:
                      'A route in its route table sending 0.0.0.0/0 (and ::/0 for IPv6) to an Internet Gateway.',
                  },
                },
                {
                  type: 'task',
                  prompt: 'Why should you deploy a NAT Gateway in each AZ rather than relying on one shared across the VPC?',
                  solution: {
                    explanation:
                      'A NAT Gateway lives in a single AZ. If that AZ fails, private subnets in other AZs lose internet egress. One NAT per AZ (with AZ-local routing) removes that single point of failure.',
                  },
                },
              ],
              docs: 'https://docs.aws.amazon.com/vpc/latest/userguide/how-it-works.html',
            },
            {
              id: 'saa1-t1-c1',
              services: [{ icon: 'vpc', label: 'Amazon VPC' }],
              title: 'Security groups vs network ACLs',
              summary:
                'Security groups are stateful firewalls attached to elastic network interfaces; network ACLs are stateless firewalls at the subnet boundary. Knowing the difference is a guaranteed exam topic.',
              explanation:
                'Two layers of packet filtering protect a VPC. A security group (SG) acts at the instance (network interface) level. It is stateful: if you allow an inbound request, the response is automatically allowed back out regardless of outbound rules, and vice versa. Security groups support only Allow rules — there is no explicit deny; anything not allowed is denied. You can reference another security group as a source, which is powerful: "allow the web tier SG to reach the database tier SG on 3306" works without naming IP ranges. A network ACL (NACL) operates at the subnet boundary and is stateless: you must write both inbound and outbound rules, because return traffic is not tracked (so you typically open the ephemeral port range outbound for responses). NACLs support ordered numbered rules with both Allow and Deny, evaluated lowest-number-first, which makes them the right tool for explicitly blocking a malicious IP range across an entire subnet. In practice security groups carry most of the work; NACLs add a coarse subnet-level guard and explicit denies.',
              keyPoints: [
                'Security group: instance-level, stateful (return traffic auto-allowed), Allow-only, can reference other SGs.',
                'Network ACL: subnet-level, stateless (must allow return traffic explicitly), supports Allow and Deny, numbered rules evaluated in order.',
                'Use a NACL Deny rule to block a specific malicious IP/CIDR for a whole subnet.',
                'Stateless NACLs usually need outbound ephemeral ports (1024-65535) open for responses.',
                'Default SG denies all inbound, allows all outbound; default NACL allows all both ways.',
                'Defense in depth: SGs for fine-grained instance rules, NACLs for broad subnet guardrails.',
              ],
              diagram: {
                type: 'mermaid',
                lines: [
                  'flowchart LR',
                  '  Net[Internet] --> NACL[Subnet NACL<br/>stateless Allow/Deny]',
                  '  NACL --> SG[Security group<br/>stateful Allow-only]',
                  '  SG --> EC2[EC2 instance]',
                ],
                caption: 'Traffic crosses the stateless subnet NACL first, then the stateful instance security group, before reaching the instance.',
              },
              commonMistakes: [
                'Thinking security groups can have explicit Deny rules — they cannot; they are Allow-only.',
                'Forgetting that NACLs are stateless, so leaving out the outbound ephemeral-port rule breaks responses.',
                'Trying to block a single bad IP with a security group — use a NACL Deny instead.',
              ],
              exercises: [
                {
                  type: 'quiz',
                  prompt:
                    'You allow inbound HTTPS (443) on a security group but write no outbound rule for the response. Does the client receive the reply?',
                  solution: {
                    explanation:
                      'Yes. Security groups are stateful — the response to an allowed inbound request is automatically permitted outbound regardless of outbound rules.',
                  },
                },
                {
                  type: 'quiz',
                  prompt:
                    'You must block all traffic from one abusive /24 IP range across every instance in a subnet. Which control and rule type?',
                  solution: {
                    explanation:
                      'A network ACL with an explicit Deny rule for that CIDR. Security groups cannot deny, and a NACL applies subnet-wide.',
                  },
                },
                {
                  type: 'predict',
                  prompt:
                    'The database SG allows inbound 3306 from the web-tier SG. A new web instance launches into the web-tier SG. Do you need to update the database SG?',
                  solution: {
                    explanation:
                      'No. Because the rule references the web-tier security group rather than IP addresses, any instance in that group is automatically allowed.',
                  },
                },
              ],
              docs: 'https://docs.aws.amazon.com/vpc/latest/userguide/vpc-security-groups.html',
            },
            {
              id: 'saa1-t1-c2',
              services: [{ icon: 'vpc', label: 'VPC Endpoints' }, { icon: 'networking', label: 'AWS PrivateLink' }],
              title: 'Private connectivity: VPC endpoints, peering, Transit Gateway',
              summary:
                'Reach AWS services and other networks privately: gateway and interface VPC endpoints keep traffic off the internet, peering links two VPCs, and Transit Gateway is a hub for many VPCs and on-premises networks.',
              explanation:
                'Several constructs connect a VPC privately. A gateway VPC endpoint provides a route-table entry to reach Amazon S3 and DynamoDB without traversing the internet or a NAT — it is free and the obvious choice for those two services. An interface VPC endpoint (powered by AWS PrivateLink) places an elastic network interface with a private IP in your subnet that fronts a supported AWS service (or a partner/your own service) so calls stay inside AWS; it is billed hourly plus per-GB. VPC peering creates a one-to-one private connection between two VPCs (same or different account/Region); routing is non-transitive, so A-B and B-C do not give A-C — peering does not scale well to many VPCs. AWS Transit Gateway is a regional hub-and-spoke router that connects many VPCs and on-premises networks (via VPN or Direct Connect) through a single attachment each, replacing a mesh of peerings. For hybrid connectivity, a Site-to-Site VPN runs encrypted over the internet, while AWS Direct Connect is a dedicated private physical link for consistent low latency and higher bandwidth.',
              keyPoints: [
                'Gateway endpoint: route-table entry for S3 and DynamoDB only; free; keeps traffic private.',
                'Interface endpoint (PrivateLink): ENI with a private IP fronting a service; billed; works for most AWS and custom services.',
                'VPC peering: 1:1 private link, non-transitive routing; fine for a few VPCs.',
                'Transit Gateway: regional hub connecting many VPCs and on-prem; replaces the peering mesh.',
                'Site-to-Site VPN = encrypted over internet; Direct Connect = dedicated private line (consistent, faster).',
                'Use endpoints to let private subnets reach AWS services without a NAT Gateway or internet egress.',
              ],
              diagram: {
                type: 'mermaid',
                lines: [
                  'flowchart TB',
                  '  TGW[Transit Gateway] --- V1[VPC 1]',
                  '  TGW --- V2[VPC 2]',
                  '  TGW --- V3[VPC 3]',
                  '  TGW --- DC[On-prem via<br/>VPN or Direct Connect]',
                ],
                caption: 'Transit Gateway acts as a central hub so each VPC and the on-premises network attaches once, instead of a full mesh of peerings.',
              },
              commonMistakes: [
                'Assuming VPC peering is transitive — it is not; A-B and B-C never grant A-C.',
                'Using an interface endpoint for S3/DynamoDB when the free gateway endpoint is the right (and cheaper) choice.',
                'Choosing Direct Connect when encryption is the requirement — Direct Connect is private but not encrypted by itself; add a VPN over it for encryption.',
              ],
              exercises: [
                {
                  type: 'quiz',
                  prompt:
                    'EC2 instances in a private subnet must read from S3 without any internet path and at no extra cost. What do you configure?',
                  solution: {
                    explanation:
                      'A gateway VPC endpoint for S3, added to the private subnet\'s route table. Traffic stays on the AWS network with no NAT and no endpoint hourly charge.',
                  },
                },
                {
                  type: 'quiz',
                  prompt:
                    'A company has 12 VPCs that all need to talk to each other and to an on-premises data centre. Peering is becoming unmanageable. What is the recommended design?',
                  solution: {
                    explanation:
                      'Connect every VPC and the on-premises network to a single AWS Transit Gateway. Each network attaches once to the hub instead of maintaining a mesh of peerings.',
                  },
                },
                {
                  type: 'predict',
                  prompt:
                    'You need a consistent, low-latency private 10 Gbps link from your data centre to AWS that does not ride the public internet. VPN or Direct Connect?',
                  solution: {
                    explanation:
                      'Direct Connect — a dedicated physical connection giving predictable latency and high bandwidth. A VPN over the internet cannot guarantee consistent latency.',
                  },
                },
              ],
              docs: 'https://docs.aws.amazon.com/vpc/latest/privatelink/concepts.html',
            },
          ],
        },
        {
          id: 'saa1-t2',
          name: 'Data protection & encryption',
          concepts: [
            {
              id: 'saa1-t2-c0',
              services: [{ icon: 'kms', label: 'AWS KMS' }],
              title: 'Encryption with KMS: keys, envelope encryption, and key policies',
              summary:
                'AWS KMS manages encryption keys and integrates with nearly every storage and database service. Understand customer-managed vs AWS-managed keys, envelope encryption, and that the key policy is the root of access control.',
              explanation:
                'AWS Key Management Service (KMS) creates and controls symmetric and asymmetric keys used to encrypt data at rest across AWS. The KMS key (formerly CMK) never leaves the service unencrypted; instead AWS uses envelope encryption: KMS generates a unique data key, the service encrypts your data with that data key, and KMS encrypts the data key with the KMS key. Only the encrypted data key is stored alongside the data, and decryption requires a call to KMS — so revoking access in KMS instantly cuts the ability to decrypt. There are AWS-managed keys (created automatically per service, easy but less control), customer-managed keys (you set the key policy, rotation and grants — choose these when you need control, auditing, or cross-account sharing), and AWS-owned keys (invisible, used internally). Crucially, access to a KMS key is governed primarily by its key policy (a resource-based policy); IAM policies alone are not enough unless the key policy delegates to IAM. Every use of a key is logged in CloudTrail, and customer-managed keys support automatic annual rotation. For dedicated single-tenant FIPS 140-2 Level 3 hardware, AWS CloudHSM is the alternative.',
              analogy:
                'Envelope encryption is like locking your documents in a box with a unique padlock (the data key), then locking that padlock\'s key inside a master safe (the KMS key) that only the bank can open. You carry the locked box and the locked padlock-key together, but you can never open anything without the bank unlocking the safe first.',
              keyPoints: [
                'KMS keys never leave the service in plaintext; data is protected with envelope encryption.',
                'Customer-managed keys: you control key policy, rotation, grants — pick for control, audit, cross-account.',
                'AWS-managed keys: automatic per service, simpler, less control.',
                'The key policy (resource-based) is the primary authority over a key; IAM must be granted access through it.',
                'Every encrypt/decrypt is logged to CloudTrail; customer-managed keys can auto-rotate yearly.',
                'CloudHSM = dedicated single-tenant FIPS 140-2 Level 3 hardware when you need exclusive key custody.',
              ],
              diagram: {
                type: 'mermaid',
                lines: [
                  'flowchart LR',
                  '  KMS[KMS key] -->|generates| DK[Plaintext data key]',
                  '  DK -->|encrypts| Data[Your data]',
                  '  KMS -->|encrypts data key| EDK[Encrypted data key]',
                  '  Data --- EDK',
                  '  EDK -->|stored with data| Store[(Storage)]',
                ],
                caption: 'Envelope encryption: a unique data key encrypts the data, KMS encrypts the data key, and only the encrypted data key is stored alongside the ciphertext.',
              },
              commonMistakes: [
                'Assuming IAM permissions alone grant KMS key use — the key policy must also allow it.',
                'Choosing AWS-managed keys when cross-account sharing or custom rotation is required (use customer-managed).',
                'Believing the plaintext key is stored with the data — only the encrypted data key is.',
              ],
              exercises: [
                {
                  type: 'quiz',
                  prompt:
                    'An auditor must see every time a specific encryption key is used and you must be able to rotate it on your own schedule and share it with a second account. Which key type?',
                  solution: {
                    explanation:
                      'A customer-managed KMS key. It gives you control of the key policy (for cross-account sharing), rotation settings, and its usage is recorded in CloudTrail.',
                  },
                },
                {
                  type: 'quiz',
                  prompt: 'Why can a single API call to KMS effectively revoke the ability to read terabytes of already-encrypted S3 data?',
                  hint: 'Think about what is needed to decrypt.',
                  solution: {
                    explanation:
                      'Because decrypting the data requires KMS to decrypt the data key first. Removing access to the KMS key means the data keys can no longer be unwrapped, so the data cannot be read.',
                  },
                },
                {
                  type: 'predict',
                  prompt:
                    'A regulated workload requires single-tenant, FIPS 140-2 Level 3 hardware key storage that AWS staff can never access. KMS or CloudHSM?',
                  solution: {
                    explanation:
                      'AWS CloudHSM — dedicated single-tenant hardware security modules you control. KMS is multi-tenant (FIPS 140-2 validated but shared).',
                  },
                },
              ],
              docs: 'https://docs.aws.amazon.com/kms/latest/developerguide/concepts.html',
            },
            {
              id: 'saa1-t2-c1',
              services: [{ icon: 's3', label: 'Amazon S3' }, { icon: 'kms', label: 'AWS KMS' }],
              title: 'Protecting data in transit and at rest, and securing S3',
              summary:
                'Encrypt data in transit with TLS and at rest with service-integrated encryption. For S3 specifically, master Block Public Access, bucket policies, encryption options and access points.',
              explanation:
                'A secure architecture encrypts everywhere. In transit, enforce TLS — terminate HTTPS at an Application Load Balancer or CloudFront using an ACM certificate, and use bucket/endpoint policies with aws:SecureTransport to reject plaintext requests. At rest, almost every service offers KMS-backed encryption (EBS volumes and snapshots, RDS, Aurora, DynamoDB, EFS, SQS, SNS). Amazon S3 deserves special attention because misconfiguration is a top cause of breaches. S3 now encrypts every new object by default (SSE-S3), and you can choose SSE-KMS for audited, controllable keys or SSE-C for customer-provided keys. Access is controlled by a layered model: Block Public Access (an account- and bucket-level master switch that should stay on unless you truly host a public website), bucket policies (resource-based), IAM policies, and optional S3 Access Points that give different applications their own named, scoped access path to a shared bucket. For sharing without making data public, use presigned URLs (time-limited) or CloudFront with Origin Access Control. Enable versioning and, for ransomware/regulatory protection, S3 Object Lock (WORM) to make objects immutable for a retention period.',
              keyPoints: [
                'In transit: enforce TLS (ACM certs on ALB/CloudFront); deny non-TLS with aws:SecureTransport.',
                'At rest: KMS-backed encryption on EBS, RDS, Aurora, DynamoDB, EFS, SQS, SNS, and S3.',
                'S3 encrypts new objects by default (SSE-S3); use SSE-KMS for audit/control, SSE-C for your own keys.',
                'Keep S3 Block Public Access ON; share via presigned URLs or CloudFront OAC, not public ACLs.',
                'Layered S3 access: Block Public Access > bucket policy > IAM > Access Points.',
                'Use versioning + S3 Object Lock (WORM) for immutability against deletion or ransomware.',
              ],
              code: {
                language: 'json',
                lines: [
                  '{',
                  '  "Version": "2012-10-17",',
                  '  "Statement": [{',
                  '    "Sid": "DenyInsecureTransport",',
                  '    "Effect": "Deny",',
                  '    "Principal": "*",',
                  '    "Action": "s3:*",',
                  '    "Resource": "arn:aws:s3:::secure-bucket/*",',
                  '    "Condition": { "Bool": { "aws:SecureTransport": "false" } }',
                  '  }]',
                  '}',
                ],
                explanation:
                  'A bucket policy that denies any S3 request not sent over TLS, enforcing encryption in transit for the whole bucket.',
              },
              commonMistakes: [
                'Disabling Block Public Access to share a few files, exposing the entire bucket — use presigned URLs instead.',
                'Assuming Direct Connect or a VPC keeps data private but encrypted — encryption in transit still needs TLS.',
                'Relying on bucket ACLs for access control instead of bucket/IAM policies (ACLs are legacy).',
              ],
              exercises: [
                {
                  type: 'quiz',
                  prompt:
                    'You must let a partner download a single object for the next 15 minutes without making the bucket public. What do you use?',
                  solution: {
                    explanation:
                      'A presigned URL — a time-limited URL signed with your credentials that grants temporary access to that specific object while Block Public Access stays on.',
                  },
                },
                {
                  type: 'quiz',
                  prompt:
                    'A compliance rule requires that backup objects cannot be deleted or overwritten for seven years. Which S3 feature?',
                  solution: {
                    explanation:
                      'S3 Object Lock in compliance mode (WORM), with a seven-year retention period, typically combined with versioning.',
                  },
                },
                {
                  type: 'task',
                  prompt:
                    'Name the difference between SSE-S3, SSE-KMS and SSE-C for S3 encryption.',
                  solution: {
                    explanation:
                      'SSE-S3: keys fully managed by S3 (simplest). SSE-KMS: KMS keys you can audit, control and rotate, with CloudTrail logging. SSE-C: you supply and manage the encryption keys yourself and send them with each request.',
                  },
                },
              ],
              docs: 'https://docs.aws.amazon.com/AmazonS3/latest/userguide/security.html',
            },
          ],
        },
      ],
    },

    /* ──────────────────── DOMAIN 2 — DESIGN RESILIENT ARCHITECTURES (26%) ──────────────────── */
    {
      level: 2,
      name: 'Design Resilient Architectures',
      focus: 'Building loosely coupled, scalable, highly available and fault-tolerant systems, and designing disaster recovery to meet RTO and RPO targets (Domain 2 · 26%)',
      accent: '#7c4ddb',
      soft: '#f1ebfd',
      topics: [
        {
          id: 'saa2-t0',
          name: 'Highly available compute',
          concepts: [
            {
              id: 'saa2-t0-c0',
              services: [{ icon: 'elb', label: 'Elastic Load Balancing' }, { icon: 'autoscaling', label: 'EC2 Auto Scaling' }],
              title: 'Load balancing and Auto Scaling across Availability Zones',
              summary:
                'Elastic Load Balancing spreads traffic across healthy targets in multiple AZs, and EC2 Auto Scaling adds or removes instances to match demand and replace failures — together they deliver high availability and elasticity.',
              explanation:
                'High availability on AWS starts with running redundant capacity in at least two Availability Zones behind a load balancer. Elastic Load Balancing (ELB) distributes incoming requests across registered targets and performs health checks, routing only to healthy ones; an unhealthy instance is bypassed automatically. The Application Load Balancer (ALB) operates at Layer 7 (HTTP/HTTPS) with content-based routing on paths, hosts and headers — ideal for web and microservice/container traffic. The Network Load Balancer (NLB) operates at Layer 4 (TCP/UDP) for ultra-high throughput, low latency and static IPs. The Gateway Load Balancer fronts third-party virtual appliances (firewalls, IDS). EC2 Auto Scaling maintains a target number of instances across AZs: it replaces instances that fail health checks (self-healing), scales out when demand rises and in when it falls. Scaling policies can be target tracking (keep average CPU at, say, 50%), step/simple, or scheduled. A launch template defines what new instances look like. Combining ELB health checks with Auto Scaling gives both fault tolerance (failures replaced) and elasticity (capacity matches load).',
              analogy:
                'A load balancer is the host at a restaurant seating guests only at staffed, ready tables (healthy targets). Auto Scaling is the manager who calls in more waiters when the queue grows and sends them home when it is quiet — and instantly replaces any waiter who walks off shift.',
              keyPoints: [
                'Run across two or more AZs behind a load balancer for high availability.',
                'ALB: Layer 7 HTTP/HTTPS, path/host/header routing — web apps, containers, microservices.',
                'NLB: Layer 4 TCP/UDP, very high throughput, low latency, static IPs.',
                'ELB health checks route only to healthy targets and bypass failures.',
                'Auto Scaling replaces failed instances (self-healing) and scales out/in to match demand.',
                'Target-tracking policy keeps a metric (e.g. CPU 50%) steady; scheduled scaling handles known patterns.',
              ],
              diagram: {
                type: 'mermaid',
                lines: [
                  'flowchart TB',
                  '  Users[Users] --> ALB[Application Load Balancer]',
                  '  ALB --> A1[EC2 AZ a]',
                  '  ALB --> A2[EC2 AZ a]',
                  '  ALB --> B1[EC2 AZ b]',
                  '  ASG[Auto Scaling group] -.maintains/replaces.-> A1',
                  '  ASG -.maintains/replaces.-> B1',
                ],
                caption: 'Traffic is balanced across healthy instances in multiple AZs, while the Auto Scaling group keeps the right number of instances and replaces failures.',
              },
              commonMistakes: [
                'Running in a single AZ behind a load balancer and calling it highly available — HA needs at least two AZs.',
                'Choosing an NLB for content-based HTTP routing — that is the ALB\'s job at Layer 7.',
                'Setting Auto Scaling min and max equal, removing the ability to scale.',
              ],
              exercises: [
                {
                  type: 'quiz',
                  prompt:
                    'You need to route /api/* to one target group and /images/* to another, both over HTTPS. Which load balancer?',
                  solution: {
                    explanation:
                      'An Application Load Balancer — it performs Layer-7 content-based routing on URL paths.',
                  },
                },
                {
                  type: 'quiz',
                  prompt:
                    'A workload needs millions of requests per second at the lowest latency with a static IP per AZ. Which load balancer?',
                  solution: {
                    explanation:
                      'A Network Load Balancer — Layer 4, designed for extreme throughput, low latency and static IPs.',
                  },
                },
                {
                  type: 'predict',
                  prompt:
                    'An instance behind an ALB stops responding to health checks. What happens to traffic and to the instance, assuming it is in an Auto Scaling group?',
                  solution: {
                    explanation:
                      'The ALB stops routing to it immediately. Auto Scaling marks it unhealthy, terminates it and launches a replacement, restoring capacity automatically.',
                  },
                },
              ],
              docs: 'https://docs.aws.amazon.com/autoscaling/ec2/userguide/what-is-amazon-ec2-auto-scaling.html',
            },
          ],
        },
        {
          id: 'saa2-t1',
          name: 'Decoupling & event-driven design',
          concepts: [
            {
              id: 'saa2-t1-c0',
              services: [{ icon: 'sqs', label: 'Amazon SQS' }, { icon: 'sns', label: 'Amazon SNS' }],
              title: 'Decoupling with SQS queues and SNS topics',
              summary:
                'SQS buffers work in a queue for one consumer group to process at its own pace; SNS fans a message out to many subscribers at once. Both let components fail or scale independently.',
              explanation:
                'Loose coupling is the core of resilient design: components communicate through a durable intermediary so a slow or failed component never blocks the rest. Amazon SQS (Simple Queue Service) is a managed message queue. Producers send messages and consumers poll and process them, deleting each after success; if a consumer dies mid-work the message reappears after its visibility timeout and another consumer retries it — no work is lost. Standard queues offer near-unlimited throughput with at-least-once delivery and best-effort ordering; FIFO queues guarantee exactly-once processing and strict ordering at lower throughput. A dead-letter queue captures messages that repeatedly fail so they do not block the pipeline. Amazon SNS (Simple Notification Service) is publish/subscribe: a publisher sends to a topic and SNS pushes a copy to every subscriber — Lambda functions, SQS queues, HTTP endpoints, email or SMS. The classic fan-out pattern publishes once to an SNS topic that delivers to several SQS queues, so multiple independent pipelines each get their own durable copy. Queues smooth spikes (buffering) and let consumers scale on queue depth.',
              analogy:
                'SQS is a ticket spike at a busy kitchen — orders pile up and cooks take them one at a time as they free up, so a momentary rush never overwhelms anyone. SNS is a fire alarm — pull it once and every speaker in the building sounds at the same time.',
              keyPoints: [
                'SQS: durable queue, one logical consumer group; visibility timeout + retry mean no lost work.',
                'Standard queue: high throughput, at-least-once, best-effort order. FIFO: exactly-once, strict order, lower throughput.',
                'Dead-letter queue isolates poison messages that keep failing.',
                'SNS: pub/sub fan-out — one publish, many subscribers (Lambda, SQS, HTTP, email, SMS).',
                'Fan-out pattern: SNS topic to multiple SQS queues for parallel independent processing.',
                'Queues buffer spikes and let consumers Auto Scale on queue depth.',
              ],
              diagram: {
                type: 'mermaid',
                lines: [
                  'flowchart LR',
                  '  Pub[Publisher] --> Topic[(SNS topic)]',
                  '  Topic --> Q1[[SQS queue billing]]',
                  '  Topic --> Q2[[SQS queue analytics]]',
                  '  Q1 --> W1[Billing workers]',
                  '  Q2 --> W2[Analytics workers]',
                ],
                caption: 'Fan-out: one SNS publish delivers a durable copy to each SQS queue, and each downstream pipeline scales and fails independently.',
              },
              commonMistakes: [
                'Using SNS when you need durable buffering and retry — SNS pushes once and does not store for later polling like SQS does.',
                'Choosing a FIFO queue for maximum throughput — Standard queues scale much higher.',
                'Setting the SQS visibility timeout shorter than processing time, causing duplicate processing.',
              ],
              exercises: [
                {
                  type: 'quiz',
                  prompt:
                    'A web tier receives order spikes far faster than the processing tier can handle. How do you decouple them so no orders are dropped?',
                  solution: {
                    explanation:
                      'Put an SQS queue between them. The web tier enqueues orders instantly; workers consume at their own pace and Auto Scale on queue depth, buffering the spike.',
                  },
                },
                {
                  type: 'quiz',
                  prompt:
                    'When a new order is placed, billing, inventory and analytics must each process it independently and durably. Which pattern?',
                  solution: {
                    explanation:
                      'SNS fan-out to multiple SQS queues — publish the order once to an SNS topic that delivers a copy to each team\'s SQS queue.',
                  },
                },
                {
                  type: 'predict',
                  prompt:
                    'A consumer crashes after reading an SQS message but before deleting it. What happens to that message?',
                  solution: {
                    explanation:
                      'After the visibility timeout expires the message becomes visible again and another consumer processes it. Nothing is lost because the message is only deleted on success.',
                  },
                },
              ],
              docs: 'https://docs.aws.amazon.com/sqs/latest/dg/welcome.html',
            },
            {
              id: 'saa2-t1-c1',
              services: [{ icon: 'eventbridge', label: 'Amazon EventBridge' }, { icon: 'stepfunctions', label: 'AWS Step Functions' }],
              title: 'Event-driven orchestration: EventBridge and Step Functions',
              summary:
                'EventBridge routes events from AWS services and apps to targets using rules; Step Functions coordinates multi-step workflows with built-in retries and state. Both decouple components and add resilience.',
              explanation:
                'Beyond simple queues and topics, two services build sophisticated event-driven systems. Amazon EventBridge is a serverless event bus: AWS services, your applications and SaaS partners emit events, and rules match events by their content (event pattern) and route them to targets such as Lambda, SQS, Step Functions or another bus. It supports scheduled rules (replacing CloudWatch Events cron), schema discovery, and an archive/replay capability — making it the backbone of loosely coupled, reactive architectures. AWS Step Functions orchestrates a sequence of steps as a state machine: each step can invoke a Lambda function, call a service, wait, branch on a choice, run tasks in parallel, or retry with backoff on failure. Because the workflow state is managed by the service, long-running and error-prone processes (order fulfilment, ETL, approval flows) become reliable and observable without you writing orchestration glue or storing state yourself. Use EventBridge to decide what should happen when an event occurs, and Step Functions to reliably run a multi-step process to completion.',
              keyPoints: [
                'EventBridge: serverless event bus; rules match event patterns and route to many targets.',
                'Sources include AWS services, custom apps and SaaS partners; supports scheduled (cron) rules.',
                'Archive and replay events for recovery and testing.',
                'Step Functions: state machine orchestrating steps with retries, branching, parallelism and waits.',
                'Step Functions holds workflow state, making long-running processes reliable and observable.',
                'Use EventBridge for routing/reaction; Step Functions for coordinating a multi-step workflow.',
              ],
              diagram: {
                type: 'mermaid',
                lines: [
                  'flowchart LR',
                  '  Src[Service or app event] --> Bus[(EventBridge bus)]',
                  '  Bus -->|rule match| L[Lambda]',
                  '  Bus -->|rule match| SF[Step Functions workflow]',
                  '  SF --> Step1[Validate] --> Step2[Charge] --> Step3[Ship]',
                ],
                caption: 'EventBridge routes matching events to targets; a Step Functions state machine then runs an ordered, retryable workflow.',
              },
              commonMistakes: [
                'Hand-coding retry, branching and state into Lambda instead of using Step Functions.',
                'Using SQS when content-based routing to many different target types is needed — EventBridge fits better.',
                'Forgetting EventBridge can replace cron-style CloudWatch Events scheduled rules.',
              ],
              exercises: [
                {
                  type: 'quiz',
                  prompt:
                    'When an object is uploaded to S3 you want different actions depending on the file type, routed to several different services. Which service decides and routes?',
                  solution: {
                    explanation:
                      'Amazon EventBridge — rules match the event pattern (e.g. file type) and route to the appropriate targets.',
                  },
                },
                {
                  type: 'quiz',
                  prompt:
                    'An order process has five sequential steps, some of which can fail and must retry with backoff, and you need to see where each order is. What coordinates this?',
                  solution: {
                    explanation:
                      'AWS Step Functions — a state machine that sequences the steps, retries failures with backoff, and tracks each execution\'s state visibly.',
                  },
                },
              ],
              docs: 'https://docs.aws.amazon.com/eventbridge/latest/userguide/eb-what-is.html',
            },
          ],
        },
        {
          id: 'saa2-t2',
          name: 'Resilient data stores',
          concepts: [
            {
              id: 'saa2-t2-c0',
              services: [{ icon: 'rds', label: 'Amazon RDS' }, { icon: 'aurora', label: 'Amazon Aurora' }],
              title: 'Database high availability: Multi-AZ, read replicas, and Aurora',
              summary:
                'RDS Multi-AZ gives automatic failover for availability; read replicas scale reads; Aurora replicates across three AZs with self-healing storage and fast failover. Distinguish HA from read scaling.',
              explanation:
                'Database resilience hinges on knowing two different mechanisms. RDS Multi-AZ maintains a synchronous standby replica in a second Availability Zone; if the primary fails (or during patching), RDS automatically fails over to the standby and the DNS endpoint is repointed — this is purely for high availability, not for scaling, because the standby does not serve traffic. RDS read replicas use asynchronous replication to create up to several read-only copies (even in other Regions) that offload read-heavy workloads; they are for scaling reads and can be promoted to standalone databases for some DR scenarios, but they are not automatic failover. Amazon Aurora goes further: it stores six copies of your data across three AZs with self-healing storage, supports up to 15 low-latency replicas that double as failover targets (typically failing over in under 30 seconds), and offers Aurora Global Database for cross-Region replication with very low replication lag for disaster recovery. Aurora Serverless v2 scales capacity automatically for variable workloads. As an architect, reach for Multi-AZ when the requirement is availability/failover and read replicas when it is read throughput.',
              keyPoints: [
                'RDS Multi-AZ: synchronous standby in another AZ, automatic failover — availability, not scaling.',
                'RDS read replicas: asynchronous, read-only, scale reads; can be cross-Region; not automatic failover.',
                'Aurora: 6 copies across 3 AZs, self-healing storage, up to 15 replicas that are also failover targets.',
                'Aurora Global Database: cross-Region replication with low lag for DR and global reads.',
                'Aurora Serverless v2 auto-scales capacity for spiky/variable workloads.',
                'Match the tool to the need: failover (Multi-AZ) vs read throughput (read replicas).',
              ],
              diagram: {
                type: 'mermaid',
                lines: [
                  'flowchart TB',
                  '  App[Application] --> Pri[(RDS primary AZ a)]',
                  '  Pri -. synchronous .-> Std[(Standby AZ b)]',
                  '  Pri -. asynchronous .-> RR[(Read replica)]',
                  '  App -->|read traffic| RR',
                ],
                caption: 'Multi-AZ keeps a synchronous standby for automatic failover, while an asynchronous read replica offloads read queries.',
              },
              commonMistakes: [
                'Thinking a Multi-AZ standby serves read traffic — it does not; use read replicas for that.',
                'Expecting read replicas to fail over automatically — promotion is manual (or via Aurora\'s own mechanism).',
                'Choosing single-AZ RDS for a production workload that needs to survive an AZ outage.',
              ],
              exercises: [
                {
                  type: 'quiz',
                  prompt:
                    'A production PostgreSQL database must continue running with minimal interruption if its Availability Zone fails. Which feature?',
                  solution: {
                    explanation:
                      'RDS Multi-AZ — a synchronous standby in another AZ to which RDS fails over automatically.',
                  },
                },
                {
                  type: 'quiz',
                  prompt:
                    'A reporting workload is overwhelming the database with read queries while writes are light. How do you scale without affecting writes?',
                  solution: {
                    explanation:
                      'Add one or more RDS read replicas and direct the reporting reads to them, offloading the primary.',
                  },
                },
                {
                  type: 'predict',
                  prompt:
                    'A global app needs a relational database with reads served close to users in three continents and cross-Region disaster recovery. Which option fits best?',
                  solution: {
                    explanation:
                      'Aurora Global Database — one primary Region with low-lag read replicas in other Regions for local reads and fast cross-Region failover.',
                  },
                },
              ],
              docs: 'https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/Concepts.MultiAZ.html',
            },
            {
              id: 'saa2-t2-c1',
              services: [{ icon: 's3', label: 'Amazon S3' }, { icon: 'dynamodb', label: 'Amazon DynamoDB' }],
              title: 'Durable, multi-AZ storage: S3 durability, versioning and replication',
              summary:
                'Some AWS data stores are resilient by design. S3 stores objects redundantly across AZs for 11 nines of durability, and DynamoDB replicates across AZs automatically — features like versioning, replication and global tables add further protection.',
              explanation:
                'A resilient architecture leans on services that are highly durable out of the box. Amazon S3 stores every object redundantly across at least three Availability Zones in a Region, giving 99.999999999% (11 nines) durability — you do not configure this, it is inherent (except the One Zone-IA class, which deliberately uses a single AZ for lower cost and lower resilience). Layer on versioning to keep every version of an object so accidental overwrites or deletes are recoverable, and S3 Replication (Same-Region SRR or Cross-Region CRR) to copy objects to another bucket or Region for compliance and disaster recovery. Amazon DynamoDB is a fully managed NoSQL key-value/document database that automatically replicates data across three AZs in a Region for high availability with single-digit-millisecond latency; point-in-time recovery (PITR) protects against accidental writes, and DynamoDB global tables provide active-active multi-Region replication. Because these services handle replication and failover internally, the architect\'s job is mostly to enable the right durability features (versioning, PITR, replication) rather than build redundancy by hand.',
              keyPoints: [
                'S3: 11 nines durability via redundancy across 3+ AZs automatically (One Zone-IA is the single-AZ exception).',
                'Versioning protects against accidental overwrite/delete; combine with MFA Delete for extra safety.',
                'S3 Replication: CRR (cross-Region) for DR/compliance, SRR (same-Region) for log aggregation.',
                'DynamoDB: managed NoSQL, auto-replicated across 3 AZs, single-digit-ms latency.',
                'DynamoDB PITR recovers to any second in the last 35 days; global tables give multi-Region active-active.',
                'Architect enables durability features rather than hand-building redundancy.',
              ],
              commonMistakes: [
                'Using S3 One Zone-IA for data that cannot tolerate the loss of a single AZ.',
                'Assuming S3 versioning is on by default — you must enable it per bucket.',
                'Believing you must build cross-AZ replication for DynamoDB — it is automatic within a Region.',
              ],
              exercises: [
                {
                  type: 'quiz',
                  prompt:
                    'Compliance requires that production objects in eu-west-1 are automatically copied to a bucket in us-east-1 for disaster recovery. Which S3 feature?',
                  solution: {
                    explanation:
                      'S3 Cross-Region Replication (CRR), which asynchronously copies objects to a bucket in another Region.',
                  },
                },
                {
                  type: 'quiz',
                  prompt:
                    'A team is worried about accidentally overwriting important S3 objects and wants to recover prior content. What do you enable?',
                  solution: {
                    explanation:
                      'S3 versioning, which retains every version so an overwritten or deleted object can be restored.',
                  },
                },
                {
                  type: 'predict',
                  prompt:
                    'A global app writes user sessions to DynamoDB and needs low-latency reads and writes in three Regions with conflict-free replication. Which feature?',
                  solution: {
                    explanation:
                      'DynamoDB global tables — multi-Region, active-active replication with each Region serving local low-latency reads and writes.',
                  },
                },
              ],
              docs: 'https://docs.aws.amazon.com/AmazonS3/latest/userguide/DataDurability.html',
            },
          ],
        },
        {
          id: 'saa2-t3',
          name: 'Disaster recovery & DNS resilience',
          concepts: [
            {
              id: 'saa2-t3-c0',
              services: [{ icon: 'backup', label: 'AWS Backup' }],
              title: 'Disaster recovery strategies: RTO, RPO, and the four patterns',
              summary:
                'DR design is driven by RTO (how fast you must recover) and RPO (how much data you can afford to lose). The four patterns — backup & restore, pilot light, warm standby, multi-site active-active — trade cost against speed.',
              explanation:
                'Two objectives frame every disaster recovery design. RTO (Recovery Time Objective) is the maximum acceptable time to restore service after an outage; RPO (Recovery Point Objective) is the maximum acceptable amount of data loss, measured as a point in time before the failure. Tighter RTO/RPO costs more. AWS describes four strategies along that cost-versus-speed spectrum. Backup & restore is cheapest and slowest: take regular backups (snapshots, AWS Backup) and, if disaster strikes, provision infrastructure and restore — RTO/RPO in hours. Pilot light keeps a minimal core always running in the recovery Region (for example a replicated database) with the rest switched off; on failover you start and scale the remaining components — RTO in tens of minutes. Warm standby runs a scaled-down but fully functional copy of the whole stack in the second Region; you scale it up on failover — RTO in minutes. Multi-site active-active runs full capacity in two or more Regions serving live traffic, giving near-zero RTO/RPO at the highest cost. AWS Backup centralises backup policies across services, and Route 53 plus health checks typically performs the failover.',
              analogy:
                'Think of a backup generator. Backup & restore is keeping fuel and a generator in storage — cheap, but it takes hours to wheel out and wire up. Pilot light is the generator installed with a pilot flame lit, ready to start. Warm standby is the generator idling at low power. Active-active is two power stations both feeding the grid — instant, but you pay to run both.',
              keyPoints: [
                'RTO = max acceptable downtime; RPO = max acceptable data loss (time before failure).',
                'Backup & restore: cheapest, slowest; RTO/RPO in hours; just back up and rebuild on demand.',
                'Pilot light: minimal core (e.g. replicated DB) always on; start the rest on failover (tens of minutes).',
                'Warm standby: scaled-down full stack always running; scale up on failover (minutes).',
                'Multi-site active-active: full capacity in 2+ Regions serving traffic; near-zero RTO/RPO, highest cost.',
                'Route 53 health checks + failover routing usually triggers the cutover; AWS Backup centralises backups.',
              ],
              diagram: {
                type: 'mermaid',
                lines: [
                  'flowchart LR',
                  '  BR[Backup and restore<br/>hours, cheapest] --> PL[Pilot light<br/>tens of minutes]',
                  '  PL --> WS[Warm standby<br/>minutes]',
                  '  WS --> AA[Active-active<br/>near zero, costliest]',
                ],
                caption: 'The four DR strategies trade increasing cost for shorter RTO and RPO, from backup & restore to multi-site active-active.',
              },
              commonMistakes: [
                'Confusing RTO (time to recover) with RPO (data loss tolerance).',
                'Choosing active-active for a workload whose budget and RTO only justify pilot light.',
                'Assuming backups alone meet a minutes-level RTO — restoring and provisioning takes far longer.',
              ],
              exercises: [
                {
                  type: 'quiz',
                  prompt:
                    'A business can tolerate losing at most five minutes of data and being down for at most a few minutes, but cannot justify running full duplicate capacity. Which DR strategy fits best?',
                  solution: {
                    explanation:
                      'Warm standby — a scaled-down but complete copy of the stack runs continuously and is scaled up on failover, meeting a minutes-level RTO/RPO without paying for full active-active capacity.',
                  },
                },
                {
                  type: 'quiz',
                  prompt:
                    'An internal tool can be offline for several hours and lose a few hours of data during a regional disaster, and cost must be minimal. Which strategy?',
                  solution: {
                    explanation:
                      'Backup & restore — periodic backups and rebuilding on demand, the cheapest option matching the relaxed RTO/RPO.',
                  },
                },
                {
                  type: 'task',
                  prompt: 'Order the four DR strategies from lowest cost/slowest recovery to highest cost/fastest recovery.',
                  solution: {
                    explanation:
                      'Backup & restore, pilot light, warm standby, multi-site active-active.',
                  },
                },
              ],
              docs: 'https://docs.aws.amazon.com/whitepapers/latest/disaster-recovery-workloads-on-aws/disaster-recovery-options-in-the-cloud.html',
            },
            {
              id: 'saa2-t3-c1',
              services: [{ icon: 'route53', label: 'Amazon Route 53' }],
              title: 'Route 53 routing policies and health-check failover',
              summary:
                'Route 53 is a highly available DNS service whose routing policies — failover, latency, weighted, geolocation, multivalue — combined with health checks let you steer traffic for resilience and performance.',
              explanation:
                'Amazon Route 53 is AWS\'s managed DNS and a key resilience tool because it can route users away from unhealthy endpoints. Its routing policies serve different goals. Simple routing returns one record. Failover routing sends traffic to a primary and, when a health check marks it unhealthy, automatically to a secondary — the backbone of DR cutover. Weighted routing splits traffic by assigned weights, useful for blue/green and canary releases. Latency-based routing sends each user to the Region giving them the lowest latency. Geolocation and geoproximity route by the user\'s location for compliance or localisation. Multivalue answer routing returns several healthy records for simple client-side load spreading. Route 53 health checks monitor endpoints (and can monitor CloudWatch alarms or other health checks) and remove unhealthy targets from DNS responses. Alias records are a Route 53 feature that points a name directly at AWS resources such as an ALB, CloudFront distribution or S3 website at no query cost and works for the zone apex, unlike a CNAME. Combining failover routing with health checks gives automatic, DNS-level regional failover.',
              keyPoints: [
                'Failover routing + health checks: automatic primary-to-secondary cutover for DR.',
                'Latency-based routing: send users to the lowest-latency Region.',
                'Weighted routing: split traffic by weight for blue/green and canary releases.',
                'Geolocation/geoproximity: route by user location for compliance or localisation.',
                'Multivalue answer: return several healthy records for basic client-side spreading.',
                'Alias records point at AWS resources (ALB, CloudFront, S3) free and at the zone apex, unlike CNAMEs.',
              ],
              diagram: {
                type: 'mermaid',
                lines: [
                  'flowchart TB',
                  '  User[User DNS query] --> R53[Route 53]',
                  '  R53 -->|health check OK| Pri[Primary Region]',
                  '  R53 -.health check fails.-> Sec[Secondary Region]',
                ],
                caption: 'With failover routing, Route 53 returns the primary while it is healthy and switches DNS to the secondary Region when health checks fail.',
              },
              commonMistakes: [
                'Using a CNAME at the zone apex (example.com) — only an Alias record works there.',
                'Expecting instant failover from DNS — clients cache records until the TTL expires, so set a low TTL for failover records.',
                'Forgetting that failover routing needs an associated health check to detect the outage.',
              ],
              exercises: [
                {
                  type: 'quiz',
                  prompt:
                    'A global service must automatically send users to a standby Region if the primary becomes unreachable. Which Route 53 routing policy and what else?',
                  solution: {
                    explanation:
                      'Failover routing combined with a Route 53 health check on the primary endpoint, so DNS switches to the secondary when the primary is unhealthy.',
                  },
                },
                {
                  type: 'quiz',
                  prompt:
                    'You want to roll out a new version to 10% of traffic and the old version to 90%. Which routing policy?',
                  solution: {
                    explanation:
                      'Weighted routing — assign weights of 10 and 90 to the two record sets.',
                  },
                },
                {
                  type: 'predict',
                  prompt:
                    'Why can you point example.com (the zone apex) at an Application Load Balancer with an Alias record but not with a CNAME?',
                  solution: {
                    explanation:
                      'DNS does not permit a CNAME at the zone apex. Route 53 Alias records are a special record type that resolves directly to AWS resources, including at the apex, and incur no query charge.',
                  },
                },
              ],
              docs: 'https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/routing-policy.html',
            },
          ],
        },
      ],
    },

    /* ─────────────────── DOMAIN 3 — DESIGN HIGH-PERFORMING ARCHITECTURES (24%) ─────────────────── */
    {
      level: 3,
      name: 'Design High-Performing Architectures',
      focus: 'Selecting performant compute, storage and databases, and using caching and content delivery to deliver low latency and high throughput at scale (Domain 3 · 24%)',
      accent: '#e8862a',
      soft: '#fff1e2',
      topics: [
        {
          id: 'saa3-t0',
          name: 'High-performing compute',
          concepts: [
            {
              id: 'saa3-t0-c0',
              services: [{ icon: 'ec2', label: 'Amazon EC2' }, { icon: 'lambda', label: 'AWS Lambda' }, { icon: 'fargate', label: 'AWS Fargate' }],
              title: 'Choosing performant compute: instance families, serverless, and right-sizing',
              summary:
                'Pick the compute model and size that match the workload: the right EC2 instance family, Lambda for event-driven and spiky work, Fargate for containers without server management. Right-sizing keeps performance high and cost in check.',
              explanation:
                'High performance starts with matching compute to the workload\'s actual demands. On EC2, instance families are tuned for different bottlenecks: general purpose (M, T) balance CPU and memory; compute-optimised (C) suit CPU-bound work like batch and gaming servers; memory-optimised (R, X) suit in-memory databases and analytics; storage-optimised (I, D) suit high-IOPS local storage; accelerated (P, G, Inf) provide GPUs/accelerators for ML and graphics. AWS Graviton (Arm) instances often give better price-performance. For elasticity, AWS Lambda runs code with no servers and scales automatically per request — ideal for spiky, event-driven and unpredictable workloads, with performance tuned by allocating more memory (which also raises CPU) and reducing cold starts via provisioned concurrency. AWS Fargate runs containers serverlessly so you size tasks (vCPU/memory) without managing instances, good for steady or bursty container workloads. The discipline of right-sizing — using CloudWatch metrics and Compute Optimizer to pick the smallest resource that meets performance targets — and scaling horizontally with Auto Scaling keeps a system fast under load without over-provisioning. Placement groups (cluster) can boost network performance for tightly coupled HPC workloads.',
              keyPoints: [
                'EC2 families: general (M/T), compute (C), memory (R/X), storage (I/D), accelerated (P/G/Inf); Graviton for price-performance.',
                'Lambda: serverless, auto-scales per request; tune by raising memory (raises CPU too); provisioned concurrency cuts cold starts.',
                'Fargate: serverless containers; size tasks without managing EC2 instances.',
                'Right-size with CloudWatch + AWS Compute Optimizer; scale horizontally with Auto Scaling.',
                'Match the family to the bottleneck (CPU, memory, I/O, GPU) rather than guessing.',
                'Cluster placement groups improve low-latency, high-throughput networking for HPC.',
              ],
              diagram: {
                type: 'mermaid',
                lines: [
                  'flowchart TB',
                  '  Q{Workload shape} --> Spiky[Spiky / event-driven] --> Lam[Lambda]',
                  '  Q --> Cont[Containerised] --> Far[Fargate]',
                  '  Q --> Steady[Steady, needs OS control] --> EC2[EC2 right-sized family]',
                ],
                caption: 'Choose the compute model by workload shape, then right-size the specific resource to the performance target.',
              },
              commonMistakes: [
                'Over-provisioning a large instance "to be safe" instead of right-sizing and scaling horizontally.',
                'Using a general-purpose instance for a memory-bound workload that needs an R family.',
                'Increasing only Lambda timeout when the function is CPU-bound — raise memory to also raise CPU.',
              ],
              exercises: [
                {
                  type: 'quiz',
                  prompt:
                    'An in-memory analytics engine needs a very large RAM-to-CPU ratio. Which EC2 family category?',
                  solution: {
                    explanation:
                      'Memory-optimised (R, or X for extreme memory).',
                  },
                },
                {
                  type: 'quiz',
                  prompt:
                    'A Lambda function processing images is slow and CPU-bound. What is the simplest performance lever?',
                  hint: 'CPU is tied to one setting.',
                  solution: {
                    explanation:
                      'Increase the function\'s allocated memory — Lambda scales CPU in proportion to memory, so more memory gives more CPU.',
                  },
                },
                {
                  type: 'predict',
                  prompt:
                    'A team runs containers and wants no EC2 instances to patch or scale, paying only for the vCPU/memory each task uses. Which compute option?',
                  solution: {
                    explanation:
                      'AWS Fargate — serverless containers where you size tasks and AWS runs the underlying infrastructure.',
                  },
                },
              ],
              docs: 'https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/instance-types.html',
            },
          ],
        },
        {
          id: 'saa3-t1',
          name: 'Caching & content delivery',
          concepts: [
            {
              id: 'saa3-t1-c0',
              services: [{ icon: 'cloudfront', label: 'Amazon CloudFront' }, { icon: 'globalaccelerator', label: 'AWS Global Accelerator' }],
              title: 'Edge performance: CloudFront and Global Accelerator',
              summary:
                'CloudFront caches content at edge locations close to users for low-latency delivery of web and media; Global Accelerator uses the AWS backbone to speed up and fail over TCP/UDP traffic to regional endpoints. Know when each applies.',
              explanation:
                'Two services accelerate traffic at the AWS edge, and the exam tests which to choose. Amazon CloudFront is a content delivery network: it caches your content (static files, media, even dynamic responses) at 400+ edge locations worldwide so users are served from the nearest point of presence, slashing latency and offloading the origin (S3, an ALB, or any HTTP origin). It integrates TLS, AWS WAF and Shield for security, supports Origin Access Control to keep S3 buckets private, and can run lightweight logic at the edge via CloudFront Functions or Lambda@Edge. CloudFront is the answer for caching HTTP/HTTPS web and media content. AWS Global Accelerator, by contrast, does not cache; it provides two static anycast IP addresses and routes traffic over the AWS global network to the optimal healthy regional endpoint (ALB, NLB, EC2), improving performance for non-cacheable, latency-sensitive TCP/UDP applications (gaming, VoIP, IoT, APIs) and giving fast regional failover. Rule of thumb: cacheable web/media content → CloudFront; whole-application acceleration and failover for TCP/UDP with static IPs → Global Accelerator.',
              analogy:
                'CloudFront is a chain of local warehouses stocking popular goods near every city, so deliveries are quick. Global Accelerator is a private express motorway network — it does not store anything, but it gets your traffic to the right regional door faster and reroutes around closures.',
              keyPoints: [
                'CloudFront: CDN caching content at 400+ edge locations; cuts latency, offloads origin.',
                'CloudFront integrates TLS, WAF, Shield, Origin Access Control, and edge compute (CloudFront Functions / Lambda@Edge).',
                'Global Accelerator: two static anycast IPs, routes over the AWS backbone to optimal healthy endpoint.',
                'Global Accelerator does not cache; it accelerates TCP/UDP apps and gives fast regional failover.',
                'Cacheable web/media → CloudFront; non-cacheable TCP/UDP app acceleration + static IPs → Global Accelerator.',
                'Both reduce latency by leveraging the global edge, but for different traffic types.',
              ],
              diagram: {
                type: 'mermaid',
                lines: [
                  'flowchart LR',
                  '  U[User] --> Edge[CloudFront edge cache]',
                  '  Edge -->|cache miss| Origin[(S3 or ALB origin)]',
                  '  Edge -->|cache hit| U',
                ],
                caption: 'CloudFront serves cached content from the nearest edge location and only reaches back to the origin on a cache miss.',
              },
              commonMistakes: [
                'Choosing Global Accelerator to cache static web content — that is CloudFront\'s role.',
                'Choosing CloudFront for a UDP gaming workload needing static IPs — that calls for Global Accelerator.',
                'Leaving an S3 origin public instead of using Origin Access Control with CloudFront.',
              ],
              exercises: [
                {
                  type: 'quiz',
                  prompt:
                    'A media site serves the same large video files to users worldwide and wants to cut latency and origin load. Which service?',
                  solution: {
                    explanation:
                      'Amazon CloudFront — it caches the videos at edge locations near users and offloads the origin.',
                  },
                },
                {
                  type: 'quiz',
                  prompt:
                    'A real-time multiplayer game uses UDP, needs two fixed entry IP addresses, and must fail over quickly between Regions. Which service?',
                  solution: {
                    explanation:
                      'AWS Global Accelerator — static anycast IPs, backbone routing for UDP, and fast regional failover.',
                  },
                },
                {
                  type: 'predict',
                  prompt:
                    'How does CloudFront let you keep an S3 origin bucket completely private while still serving its objects to the public?',
                  solution: {
                    explanation:
                      'Origin Access Control: only the CloudFront distribution is granted access to the bucket via a bucket policy, so users reach objects through CloudFront and never directly from S3.',
                  },
                },
              ],
              docs: 'https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/Introduction.html',
            },
            {
              id: 'saa3-t1-c1',
              services: [{ icon: 'elasticache', label: 'Amazon ElastiCache' }, { icon: 'dynamodb', label: 'DynamoDB Accelerator' }],
              title: 'Caching data: ElastiCache and DynamoDB Accelerator (DAX)',
              summary:
                'Put a cache in front of databases to cut latency and offload reads. ElastiCache (Redis/Memcached) caches arbitrary data and supports sessions and leaderboards; DAX is an in-memory cache purpose-built for DynamoDB.',
              explanation:
                'Database caching is a core performance pattern. Amazon ElastiCache provides managed in-memory data stores in two engines. ElastiCache for Redis is feature-rich: replication, Multi-AZ with automatic failover, persistence, pub/sub, sorted sets (great for leaderboards) and transactions — use it for session stores, leaderboards, rate limiting and as a read cache. ElastiCache for Memcached is a simpler, multi-threaded cache for straightforward key/value caching with horizontal sharding, but no replication or persistence. The classic pattern is cache-aside (lazy loading): the app checks the cache, and on a miss reads the database and populates the cache; a TTL controls staleness, and write-through can keep the cache fresh on writes. For DynamoDB specifically, DynamoDB Accelerator (DAX) is a fully managed in-memory cache that sits in front of a table and turns single-digit-millisecond reads into microsecond reads for read-heavy or bursty workloads, requiring almost no application change. As an architect, add a cache when reads dominate and the same data is requested repeatedly, reducing both latency and load on the backing store.',
              keyPoints: [
                'ElastiCache Redis: replication, Multi-AZ failover, persistence, pub/sub, sorted sets — sessions, leaderboards, caching.',
                'ElastiCache Memcached: simple, multi-threaded, sharded key/value cache; no replication or persistence.',
                'Cache-aside (lazy loading): app reads cache, falls back to DB on miss, populates cache; TTL limits staleness.',
                'Write-through keeps the cache fresh on every write at the cost of write latency.',
                'DAX: in-memory cache for DynamoDB turning millisecond reads into microsecond reads, minimal code change.',
                'Cache when reads dominate and the same items are requested repeatedly.',
              ],
              diagram: {
                type: 'mermaid',
                lines: [
                  'flowchart LR',
                  '  App[Application] -->|1 read| Cache[(ElastiCache)]',
                  '  Cache -->|hit| App',
                  '  Cache -.miss.-> DB[(Database)]',
                  '  DB -.populate.-> Cache',
                ],
                caption: 'Cache-aside pattern: the app reads from the cache first and only queries the database on a miss, then populates the cache.',
              },
              commonMistakes: [
                'Choosing Memcached when you need replication, failover or persistence — use Redis.',
                'Caching write-heavy data with rapidly changing values, where a cache adds little benefit.',
                'Forgetting to set a TTL, letting cached data go stale indefinitely.',
              ],
              exercises: [
                {
                  type: 'quiz',
                  prompt:
                    'A read-heavy DynamoDB workload needs microsecond response times with minimal code changes. What do you add?',
                  solution: {
                    explanation:
                      'DynamoDB Accelerator (DAX) — a managed in-memory cache in front of the table that serves repeated reads in microseconds.',
                  },
                },
                {
                  type: 'quiz',
                  prompt:
                    'You need a session store and a gaming leaderboard requiring sorted sets, with Multi-AZ failover. Which ElastiCache engine?',
                  solution: {
                    explanation:
                      'ElastiCache for Redis — it supports sorted sets, replication and Multi-AZ automatic failover; Memcached does not.',
                  },
                },
                {
                  type: 'predict',
                  prompt:
                    'Describe what happens on a cache miss under the cache-aside pattern.',
                  solution: {
                    explanation:
                      'The application does not find the item in the cache, reads it from the database, writes it into the cache (often with a TTL), and returns it — so subsequent requests are served from the cache.',
                  },
                },
              ],
              docs: 'https://docs.aws.amazon.com/AmazonElastiCache/latest/red-ug/WhatIs.html',
            },
          ],
        },
        {
          id: 'saa3-t2',
          name: 'Performant storage & databases',
          concepts: [
            {
              id: 'saa3-t2-c0',
              services: [{ icon: 'ebs', label: 'Amazon EBS' }, { icon: 'efs', label: 'Amazon EFS' }, { icon: 's3', label: 'Amazon S3' }],
              title: 'Choosing storage for performance: EBS volume types, EFS, and S3 throughput',
              summary:
                'Match storage to the access pattern: EBS volume types for single-instance block IOPS or throughput, EFS for shared elastic file access, and S3 for massively parallel object throughput.',
              explanation:
                'Storage performance is about choosing the right type and tuning it. Amazon EBS offers block volumes for one instance: gp3 (general-purpose SSD, the default, with independently provisionable IOPS and throughput), io2 Block Express (highest IOPS and lowest latency for critical databases, with multi-attach support), st1 (throughput-optimised HDD for big sequential workloads like log processing) and sc1 (cold HDD for infrequent access). You raise EBS performance by selecting the right type and provisioning IOPS/throughput, or by using a Nitro-based instance for full EBS bandwidth. Amazon EFS is an elastic, shared NFS file system many instances mount at once; it scales throughput automatically (with Bursting or Elastic/Provisioned modes) and offers Standard and One Zone classes plus Infrequent Access tiers. Amazon S3 delivers very high aggregate throughput and scales to thousands of requests per second per prefix automatically; you boost effective throughput by parallelising requests across many objects/prefixes, using multipart uploads for large objects, S3 Transfer Acceleration for long-distance uploads, and byte-range fetches for large reads. The key skill is reading the requirement — single-instance low-latency block, shared file, or object scale — and selecting accordingly.',
              keyPoints: [
                'EBS gp3: default SSD, IOPS and throughput provisioned independently; io2 Block Express: highest IOPS/lowest latency, multi-attach.',
                'EBS st1: throughput HDD for big sequential I/O; sc1: cold HDD for infrequent access.',
                'EFS: shared elastic NFS for many instances; auto-scaling throughput modes; Standard vs One Zone.',
                'S3: very high aggregate throughput; scales per prefix; parallelise across objects/prefixes.',
                'S3 boosters: multipart upload, Transfer Acceleration (long-distance), byte-range fetches.',
                'Match access pattern: single-instance block (EBS) vs shared file (EFS) vs object scale (S3).',
              ],
              commonMistakes: [
                'Using a single EBS volume for shared access by many instances — use EFS for shared file access.',
                'Choosing an HDD (st1/sc1) for random small-block, latency-sensitive I/O instead of SSD.',
                'Uploading a multi-GB object as one PUT instead of using multipart upload for speed and resilience.',
              ],
              exercises: [
                {
                  type: 'quiz',
                  prompt:
                    'A mission-critical database needs the highest possible IOPS and the lowest latency from its block storage. Which EBS volume type?',
                  solution: {
                    explanation:
                      'io2 Block Express — the highest-performance provisioned-IOPS SSD with the lowest latency.',
                  },
                },
                {
                  type: 'quiz',
                  prompt:
                    'A fleet of Linux instances across AZs must read and write the same files concurrently with elastic throughput. Which storage?',
                  solution: {
                    explanation:
                      'Amazon EFS — a shared, elastic NFS file system multiple instances mount simultaneously across AZs.',
                  },
                },
                {
                  type: 'predict',
                  prompt:
                    'Uploads of large files from another continent to S3 are slow. Name two ways to improve upload performance.',
                  solution: {
                    explanation:
                      'Use multipart upload to send parts in parallel, and enable S3 Transfer Acceleration to route uploads over the AWS edge/backbone for long distances.',
                  },
                },
              ],
              docs: 'https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ebs-volume-types.html',
            },
            {
              id: 'saa3-t2-c1',
              services: [{ icon: 'dynamodb', label: 'Amazon DynamoDB' }, { icon: 'aurora', label: 'Amazon Aurora' }, { icon: 'redshift', label: 'Amazon Redshift' }],
              title: 'Picking the right database for performance and scale',
              summary:
                'Choose the database that matches the data model and access pattern: DynamoDB for massive-scale key/value, Aurora/RDS for relational transactions, Redshift for analytics, and read replicas/sharding to scale further.',
              explanation:
                'Performance comes from picking the right database engine, not forcing one tool to do everything. Amazon DynamoDB is a serverless NoSQL key-value/document store delivering single-digit-millisecond latency at virtually any scale; it shines for high-throughput, well-defined access patterns (user profiles, sessions, IoT, gaming state) and offers on-demand or provisioned capacity with auto scaling, global tables, and DAX caching. Amazon RDS/Aurora handle relational, transactional (OLTP) workloads with joins, complex queries and ACID guarantees; scale reads with read replicas and writes with larger instances or Aurora\'s distributed storage, and use Aurora Serverless for variable load. Amazon Redshift is a columnar, massively-parallel data warehouse for analytics (OLAP) over large datasets — do not run analytics on your OLTP database. Amazon ElastiCache fronts any of these as a read cache. Amazon Athena queries data in S3 directly with SQL for serverless ad-hoc analytics. The architect maps the requirement — key/value at scale, relational transactions, or large-scale analytics — to DynamoDB, RDS/Aurora, or Redshift respectively, then layers caching and replicas for additional performance.',
              keyPoints: [
                'DynamoDB: serverless NoSQL key/value at any scale, single-digit-ms latency; great for known access patterns.',
                'RDS/Aurora: relational OLTP with joins and ACID; scale reads with replicas, use Aurora for higher performance.',
                'Redshift: columnar MPP data warehouse for analytics (OLAP) over large datasets.',
                'Do not run heavy analytics on an OLTP database — use Redshift (or Athena over S3).',
                'Layer ElastiCache/DAX and read replicas for extra read performance.',
                'Match data model and access pattern to the engine, then tune.',
              ],
              diagram: {
                type: 'mermaid',
                lines: [
                  'flowchart TB',
                  '  Q{Workload} --> KV[Key/value at scale] --> DDB[DynamoDB]',
                  '  Q --> TX[Relational transactions] --> AUR[Aurora / RDS]',
                  '  Q --> AN[Large-scale analytics] --> RS[Redshift]',
                ],
                caption: 'Map the workload to the purpose-built database rather than forcing one engine to serve every pattern.',
              },
              commonMistakes: [
                'Running analytical queries on an RDS OLTP database and seeing it slow down — move analytics to Redshift or Athena.',
                'Choosing DynamoDB for ad-hoc relational queries with joins — it is built for known key-based access patterns.',
                'Scaling writes by only adding read replicas — replicas scale reads, not writes.',
              ],
              exercises: [
                {
                  type: 'quiz',
                  prompt:
                    'An IoT platform ingests millions of writes per second of sensor readings retrieved by device ID, needing single-digit-ms latency at huge scale. Which database?',
                  solution: {
                    explanation:
                      'Amazon DynamoDB — serverless NoSQL designed for very high throughput and low-latency key-based access at scale.',
                  },
                },
                {
                  type: 'quiz',
                  prompt:
                    'Analysts run complex aggregations across billions of rows for business intelligence. Which AWS database service fits?',
                  solution: {
                    explanation:
                      'Amazon Redshift — a columnar, massively-parallel data warehouse built for large-scale analytical (OLAP) queries.',
                  },
                },
                {
                  type: 'predict',
                  prompt:
                    'A relational app\'s read traffic has tripled while writes are flat and queries are slowing. What is the first performance move?',
                  solution: {
                    explanation:
                      'Add RDS/Aurora read replicas and route read queries to them, offloading the primary so writes and reads both stay fast.',
                  },
                },
              ],
              docs: 'https://docs.aws.amazon.com/whitepapers/latest/aws-overview/database.html',
            },
          ],
        },
      ],
    },

    /* ─────────────────── DOMAIN 4 — DESIGN COST-OPTIMIZED ARCHITECTURES (20%) ─────────────────── */
    {
      level: 4,
      name: 'Design Cost-Optimized Architectures',
      focus: 'Choosing the right pricing models, storage classes and resource sizes, and using cost-tracking tools to design and run economical architectures (Domain 4 · 20%)',
      accent: '#1ba85a',
      soft: '#e6f7ee',
      topics: [
        {
          id: 'saa4-t0',
          name: 'Cost-optimized compute',
          concepts: [
            {
              id: 'saa4-t0-c0',
              services: [{ icon: 'ec2', label: 'Amazon EC2' }, { icon: 'autoscaling', label: 'EC2 Auto Scaling' }],
              title: 'EC2 pricing models: On-Demand, Savings Plans, Reserved, and Spot',
              summary:
                'Match the purchasing model to the workload pattern: On-Demand for unpredictable, Savings Plans/Reserved for steady commitments, and Spot for interruptible work — and scale to demand so you never pay for idle capacity.',
              explanation:
                'Compute is often the biggest bill, and the right pricing model can cut it dramatically. On-Demand charges per second/hour with no commitment — best for short-lived, spiky or unpredictable workloads and for development. For steady, predictable usage, commit for one or three years: Savings Plans offer a flexible hourly-spend commitment that saves up to about 72% and applies across instance families, Regions, and even Fargate and Lambda (Compute Savings Plans), while Reserved Instances commit to a specific configuration for similar savings (with standard vs convertible options). Spot Instances tap spare capacity for up to about 90% off but can be reclaimed with a two-minute warning — perfect for fault-tolerant, flexible or stateless work such as batch processing, CI/CD, big-data jobs and stateless web tiers (often mixed with On-Demand in an Auto Scaling group). The other half of cost optimisation is elasticity: use Auto Scaling so capacity follows demand, scheduled scaling to switch off non-production environments out of hours, and serverless (Lambda/Fargate) so you pay nothing when idle. A common winning design blends a Savings Plan baseline with Spot for variable load.',
              keyPoints: [
                'On-Demand: no commitment, pay-as-you-go; spiky, short or unpredictable workloads and dev.',
                'Savings Plans: 1- or 3-year hourly-spend commitment, up to ~72% off, flexible across families/Regions and Fargate/Lambda.',
                'Reserved Instances: commit to a configuration for similar savings; standard vs convertible.',
                'Spot: up to ~90% off spare capacity, 2-minute reclaim warning; for fault-tolerant/flexible work.',
                'Scale to demand with Auto Scaling; schedule non-prod environments off out of hours.',
                'Common pattern: Savings Plan baseline + Spot for variable load; serverless pays nothing when idle.',
              ],
              diagram: {
                type: 'mermaid',
                lines: [
                  'flowchart LR',
                  '  Q{Workload pattern} --> St[Steady 24x7] --> SP[Savings Plan / Reserved]',
                  '  Q --> Sp[Spiky / short] --> OD[On-Demand]',
                  '  Q --> Ft[Fault-tolerant batch] --> Spot[Spot Instances]',
                ],
                caption: 'Match each workload pattern to the cheapest suitable purchasing model.',
              },
              commonMistakes: [
                'Running steady 24/7 production on On-Demand when a Savings Plan would cut the cost by most of the bill.',
                'Putting a stateful, interruption-intolerant workload on Spot.',
                'Leaving development and test environments running overnight and at weekends.',
              ],
              exercises: [
                {
                  type: 'quiz',
                  prompt:
                    'A fault-tolerant batch job runs at unpredictable times and can resume after interruption. You want the lowest possible compute cost. Which model?',
                  solution: {
                    explanation:
                      'Spot Instances — up to about 90% cheaper, suitable because the job tolerates the two-minute interruption.',
                  },
                },
                {
                  type: 'quiz',
                  prompt:
                    'A company runs a stable set of production services 24/7 for the next three years and wants maximum savings with flexibility to change instance families. Which model?',
                  solution: {
                    explanation:
                      'A Compute Savings Plan (3-year) — large discount with flexibility across instance families and Regions, and it even covers Fargate and Lambda.',
                  },
                },
                {
                  type: 'task',
                  prompt: 'Name two ways to avoid paying for idle EC2 capacity besides choosing a pricing model.',
                  solution: {
                    explanation:
                      'Use Auto Scaling so capacity tracks demand, and use scheduled scaling (or stop/start automation) to switch off non-production environments outside working hours.',
                  },
                },
              ],
              docs: 'https://docs.aws.amazon.com/whitepapers/latest/cost-optimization-reservation-models/cost-optimization-reservation-models.html',
            },
          ],
        },
        {
          id: 'saa4-t1',
          name: 'Cost-optimized storage & data transfer',
          concepts: [
            {
              id: 'saa4-t1-c0',
              services: [{ icon: 's3', label: 'Amazon S3' }, { icon: 'backup', label: 'AWS Backup' }],
              title: 'S3 storage classes, lifecycle policies, and Intelligent-Tiering',
              summary:
                'Store each object in the cheapest class that meets its access and durability needs, and use lifecycle rules to move data to colder tiers automatically. Intelligent-Tiering automates this when patterns are unknown.',
              explanation:
                'Storage cost optimisation on S3 is about matching the storage class to how often data is accessed and how fast it must be retrieved. S3 Standard suits frequently accessed data. Standard-IA (infrequent access) and One Zone-IA cost less per GB but add a retrieval fee and a 30-day minimum — One Zone-IA is cheaper still but lives in a single AZ (use only for reproducible data). The Glacier tiers archive data cheaply: Glacier Instant Retrieval for rarely accessed data needing millisecond access, Glacier Flexible Retrieval for archives retrievable in minutes to hours, and Glacier Deep Archive for the cheapest long-term storage with retrieval in hours and a 180-day minimum. Rather than guess, S3 Intelligent-Tiering automatically moves objects between access tiers based on usage for a small monitoring fee, ideal when access patterns are unknown or changing. Lifecycle policies automate transitions (for example Standard to Standard-IA after 30 days, to Glacier after 90, then expire after seven years) and clean up incomplete multipart uploads and old versions. The same principle applies to backups: AWS Backup and EBS snapshot lifecycle policies tier and expire backups to control cost.',
              keyPoints: [
                'Standard: frequent access. Standard-IA / One Zone-IA: cheaper per GB, retrieval fee, 30-day minimum (One Zone = single AZ).',
                'Glacier Instant (ms access), Flexible (minutes-hours), Deep Archive (hours, cheapest, 180-day min).',
                'Intelligent-Tiering: auto-moves objects between tiers for a small fee — use when access is unpredictable.',
                'Lifecycle policies automate transitions and expiration, and clean up old versions / incomplete uploads.',
                'Match retrieval speed and access frequency to the class to minimise cost.',
                'Apply the same tiering/expiry discipline to backups and snapshots.',
              ],
              diagram: {
                type: 'mermaid',
                lines: [
                  'flowchart LR',
                  '  New[New object] --> Std[S3 Standard]',
                  '  Std -->|30 days| IA[Standard-IA]',
                  '  IA -->|90 days| GF[Glacier Flexible]',
                  '  GF -->|2555 days| Exp[Expire / delete]',
                ],
                caption: 'A lifecycle policy automatically transitions objects to colder, cheaper classes as they age and finally expires them.',
              },
              commonMistakes: [
                'Keeping archival data in S3 Standard, paying premium rates for data accessed once a year.',
                'Using One Zone-IA for data that is not reproducible — losing the AZ means losing the data.',
                'Forgetting that IA and Glacier classes add retrieval fees and minimum storage durations.',
              ],
              exercises: [
                {
                  type: 'quiz',
                  prompt:
                    'Logs must be kept for seven years, are almost never read, and slow retrieval is fine. Which storage class minimises cost?',
                  solution: {
                    explanation:
                      'S3 Glacier Deep Archive — the lowest-cost class for long-term archives with retrieval measured in hours.',
                  },
                },
                {
                  type: 'quiz',
                  prompt:
                    'A dataset has unpredictable and changing access patterns and you do not want to manage transitions manually. Which class?',
                  solution: {
                    explanation:
                      'S3 Intelligent-Tiering — it automatically moves objects between access tiers based on usage for a small monitoring fee.',
                  },
                },
                {
                  type: 'task',
                  prompt: 'Write a lifecycle plan that keeps objects hot for a month, cheap for three months, then archives them for seven years.',
                  solution: {
                    explanation:
                      'Standard for the first 30 days, transition to Standard-IA at 30 days, transition to a Glacier class at ~120 days, then expire after about 2,555 days (seven years).',
                  },
                },
              ],
              docs: 'https://docs.aws.amazon.com/AmazonS3/latest/userguide/storage-class-intro.html',
            },
            {
              id: 'saa4-t1-c1',
              services: [{ icon: 'cloudfront', label: 'Amazon CloudFront' }, { icon: 'vpc', label: 'VPC Endpoints' }],
              title: 'Reducing data transfer and right-sizing storage',
              summary:
                'Data transfer is an often-overlooked cost. Cut it by serving from CloudFront, keeping traffic within a Region and AZ, using VPC endpoints, and right-sizing over-provisioned storage and databases.',
              explanation:
                'Beyond storage at rest, data transfer charges quietly add up, and good architecture reduces them. Data transferred out of AWS to the internet is billed, as is traffic between Regions and even between AZs — but inbound data transfer is free, and traffic to many AWS services within the same Region is cheaper or free. Practical levers: serve content through Amazon CloudFront so cached responses are delivered from the edge (often cheaper than serving every byte from the origin and far less origin load); keep chatty components in the same AZ to avoid inter-AZ charges where resilience allows; use VPC gateway endpoints for S3 and DynamoDB so that traffic avoids a NAT Gateway (which charges per GB processed) and the internet entirely; and avoid unnecessary cross-Region replication. Right-sizing is the other big lever: delete unattached EBS volumes and old snapshots, downsize over-provisioned gp3 IOPS, switch to Graviton, choose Aurora Serverless for spiky databases, and use AWS Compute Optimizer and Trusted Advisor to find waste. The architect designs data flows that minimise billable transfer and keeps every resource sized to what it actually needs.',
              keyPoints: [
                'Inbound data transfer is free; outbound to internet and cross-Region/cross-AZ traffic is billed.',
                'CloudFront edge caching reduces both origin load and data-transfer cost.',
                'VPC gateway endpoints for S3/DynamoDB avoid per-GB NAT Gateway charges and the internet path.',
                'Keep chatty traffic within an AZ where resilience permits to avoid inter-AZ charges.',
                'Right-size: delete unattached EBS/old snapshots, tune gp3 IOPS, consider Graviton and Aurora Serverless.',
                'Use Compute Optimizer and Trusted Advisor to surface waste.',
              ],
              commonMistakes: [
                'Routing private-subnet S3 traffic through a NAT Gateway (per-GB cost) instead of a free gateway endpoint.',
                'Leaving unattached EBS volumes and stale snapshots accruing charges.',
                'Replicating data cross-Region when business needs do not require it, paying transfer for nothing.',
              ],
              exercises: [
                {
                  type: 'quiz',
                  prompt:
                    'Instances in a private subnet pull large amounts of data from S3 through a NAT Gateway, and the NAT processing charges are high. What cheaper design removes those charges?',
                  solution: {
                    explanation:
                      'Add an S3 gateway VPC endpoint so the traffic goes directly to S3 over the AWS network, bypassing the NAT Gateway and its per-GB processing fee.',
                  },
                },
                {
                  type: 'quiz',
                  prompt:
                    'A global website serves the same images from an origin in one Region, with high data-transfer-out costs. What reduces both cost and origin load?',
                  solution: {
                    explanation:
                      'Serve through Amazon CloudFront, caching the images at edge locations so repeated requests are delivered from the edge instead of the origin.',
                  },
                },
                {
                  type: 'task',
                  prompt: 'List three quick right-sizing actions that reduce ongoing storage and compute cost.',
                  solution: {
                    explanation:
                      'Delete unattached EBS volumes and stale snapshots, downsize over-provisioned instances or gp3 IOPS, and move suitable workloads to Graviton or serverless. Use Compute Optimizer/Trusted Advisor to find candidates.',
                  },
                },
              ],
              docs: 'https://docs.aws.amazon.com/whitepapers/latest/cost-optimization-storage-optimization/cost-optimization-storage-optimization.html',
            },
          ],
        },
        {
          id: 'saa4-t2',
          name: 'Cost monitoring & governance',
          concepts: [
            {
              id: 'saa4-t2-c0',
              services: [{ icon: 'costexplorer', label: 'AWS Cost Explorer' }, { icon: 'budgets', label: 'AWS Budgets' }, { icon: 'organizations', label: 'AWS Organizations' }],
              title: 'Tracking and controlling cost: Cost Explorer, Budgets, and allocation tags',
              summary:
                'You cannot optimise what you cannot see. Cost Explorer analyses and forecasts spend, Budgets alerts on thresholds, cost allocation tags attribute spend to teams, and consolidated billing pools discounts across accounts.',
              explanation:
                'Cost governance closes the loop on a cost-optimised architecture. AWS Cost Explorer visualises and forecasts spending, breaking it down by service, account, Region or tag, and recommends Savings Plans and right-sizing — the tool for understanding where money goes. AWS Budgets lets you set thresholds (cost, usage, Reserved Instance/Savings Plan coverage) and triggers alerts or automated actions when you approach or exceed them, so surprises are caught early. Cost allocation tags (for example tags for team, project or environment) let you attribute spend to owners in Cost Explorer and detailed billing reports — activate them in the billing console so each cost is traceable to a team. For organisations, consolidated billing through AWS Organizations combines all member accounts into one bill, pooling usage so volume discounts and Savings Plans/Reserved Instances apply across the whole organisation while still isolating workloads per account. The AWS Cost and Usage Report (CUR) provides the most granular line-item data for deep analysis, and the Pricing Calculator estimates costs before you build. Together these give visibility, accountability and proactive control over spend.',
              keyPoints: [
                'Cost Explorer: analyse and forecast spend by service/account/Region/tag; get Savings Plan and right-sizing recommendations.',
                'AWS Budgets: set cost/usage thresholds and get alerts or automated actions before overspending.',
                'Cost allocation tags attribute spend to teams/projects (activate them in the billing console).',
                'Consolidated billing via Organizations: one bill, pooled volume discounts and Savings Plans/RIs across accounts.',
                'Cost and Usage Report (CUR): most granular line-item data for analysis.',
                'Pricing Calculator estimates costs before building.',
              ],
              diagram: {
                type: 'mermaid',
                lines: [
                  'flowchart TB',
                  '  Tags[Cost allocation tags] --> CE[Cost Explorer<br/>analyse and forecast]',
                  '  CE --> Bud[AWS Budgets<br/>thresholds and alerts]',
                  '  Org[Organizations<br/>consolidated billing] --> CE',
                ],
                caption: 'Tags attribute spend, Cost Explorer analyses and forecasts it, Budgets alerts on thresholds, and consolidated billing pools discounts across accounts.',
              },
              commonMistakes: [
                'Confusing Cost Explorer (analyse/forecast) with Budgets (alert on thresholds).',
                'Expecting untagged resources to show ownership in cost reports — tags must be created and activated.',
                'Forgetting that consolidated billing pools usage so discounts apply organisation-wide.',
              ],
              exercises: [
                {
                  type: 'quiz',
                  prompt:
                    'A finance team wants an email alert as soon as monthly spend is forecast to exceed a set amount. Which service?',
                  solution: {
                    explanation:
                      'AWS Budgets — define a cost budget with a threshold and configure alerts when actual or forecasted spend crosses it.',
                  },
                },
                {
                  type: 'quiz',
                  prompt:
                    'Management wants to know how much each project spends across many AWS accounts and to pool volume discounts. Which two features?',
                  solution: {
                    explanation:
                      'Cost allocation tags (to attribute spend per project, viewed in Cost Explorer) and consolidated billing through AWS Organizations (to combine accounts into one bill and pool discounts).',
                  },
                },
                {
                  type: 'predict',
                  prompt:
                    'Before building, a team needs an estimate of the monthly cost of a proposed EC2 + RDS + S3 architecture. Which tool?',
                  solution: {
                    explanation:
                      'The AWS Pricing Calculator — it estimates costs for a planned configuration before you deploy anything.',
                  },
                },
              ],
              docs: 'https://docs.aws.amazon.com/cost-management/latest/userguide/what-is-costmanagement.html',
            },
          ],
        },
      ],
    },
  ],
};

export default content;
