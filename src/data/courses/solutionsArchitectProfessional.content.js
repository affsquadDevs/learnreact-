// AWS Certified Solutions Architect - Professional (SAP-C02) - course content.
// Advanced, scenario-driven preparation for the SAP-C02 exam, organised into the
// four official exam domains. Factual material (service names and what they do) is
// rewritten in our own words for self-study; diagrams are our own Mermaid creations.
// Not affiliated with or endorsed by AWS.
//
// Exam domains & weightings (SAP-C02):
//   1. Design Solutions for Organizational Complexity ........ 26%
//   2. Design for New Solutions .............................. 29%
//   3. Continuous Improvement for Existing Solutions ......... 25%
//   4. Accelerate Workload Migration and Modernization ....... 20%

const content = {
  meta: {
    title: 'AWS Certified Solutions Architect - Professional (SAP-C02)',
    description:
      'A deep, professional-level path to the AWS Certified Solutions Architect - Professional (SAP-C02) exam. Covers multi-account governance and cross-account/hybrid networking, designing new solutions at scale (compute, storage, data, event-driven and serverless, multi-Region HA/DR), continuous improvement of existing workloads (Well-Architected reviews, observability, performance, cost and resiliency), and large-scale migration and modernization (the 6 Rs, MGN, DMS, DataSync, Snow Family, and refactoring to containers and serverless). Emphasis throughout is on trade-off analysis and choosing the best answer for a given scenario.',
    schemaVersion: '1.0',
    status: 'complete',
  },
  levels: [
    /* ───────── DOMAIN 1 — DESIGN SOLUTIONS FOR ORGANIZATIONAL COMPLEXITY (26%) ───────── */
    {
      level: 1,
      name: 'Organizational Complexity',
      focus:
        'Multi-account strategy, governance and guardrails, cross-account and hybrid networking, and centralised identity and security at scale (Domain 1 · 26%)',
      accent: '#2d6bff',
      soft: '#eaf0ff',
      topics: [
        {
          id: 'sap1-t0',
          name: 'Multi-account strategy & AWS Organizations',
          concepts: [
            {
              id: 'sap1-t0-c0',
              services: [{ icon: 'organizations', label: 'AWS Organizations' }],
              title: 'AWS Organizations, OUs, and consolidated billing at scale',
              summary:
                'AWS Organizations is the foundation of an enterprise landing zone: it groups accounts into organisational units (OUs), applies organisation-wide policies, and consolidates billing so commitments and volume tiers are shared.',
              explanation:
                "At Professional level you are expected to design the account topology, not just describe it. AWS Organizations links many AWS accounts under one management (payer) account. Accounts are arranged in a tree of organisational units (OUs) that mirror how you want to govern, not necessarily your org chart: a Security OU (log archive and audit accounts), an Infrastructure OU (shared networking, shared services), a Workloads OU (split into Prod and Non-Prod), a Sandbox OU, and a Suspended OU for accounts being decommissioned. The account itself is the strongest isolation boundary in AWS - a hard blast-radius and billing boundary - so the standard pattern is one account per workload per environment rather than separating with VPCs in a single account. Consolidated billing rolls all member usage into one invoice and, crucially, aggregates usage so Reserved Instances and Savings Plans purchased anywhere can apply across the organisation, and volume pricing tiers (for example S3 storage) are reached faster. You can disable RI/Savings Plan sharing per account if a team must keep its own discounts. Organizations has two feature sets: 'consolidated billing only' and 'all features' - you need all features to use Service Control Policies and most governance integrations.",
              analogy:
                'Think of Organizations as a holding company: each subsidiary (account) keeps its own books and walls, the parent issues group-wide rules (SCPs) and negotiates one combined contract (consolidated billing) that gets everyone better rates.',
              keyPoints: [
                'The account is the primary isolation and billing boundary; prefer many small accounts over one large shared account.',
                'Design OUs around governance intent (Security, Infrastructure, Workloads/Prod, Workloads/Non-Prod, Sandbox), not the company hierarchy.',
                'Consolidated billing shares RIs/Savings Plans across accounts and reaches volume tiers faster; sharing can be turned off per account.',
                'Enable "all features" (not just consolidated billing) to use SCPs, delegated administration and tag policies.',
                'The management/payer account should hold almost no workloads - keep it minimal and tightly locked down.',
              ],
              commonMistakes: [
                'Putting production workloads in the management account - it cannot be restricted by SCPs and is a single point of compromise.',
                'Mirroring the company org chart in OUs instead of grouping by the policies you want to enforce.',
                'Assuming SCPs grant permissions - they only set the maximum boundary; IAM still has to allow the action.',
              ],
              diagram: {
                type: 'mermaid',
                lines: [
                  'flowchart TB',
                  '  Root[Organization Root] --> SecOU[Security OU]',
                  '  Root --> InfraOU[Infrastructure OU]',
                  '  Root --> WLOU[Workloads OU]',
                  '  SecOU --> LogA[Log Archive acct]',
                  '  SecOU --> AuditA[Audit acct]',
                  '  WLOU --> Prod[Prod OU]',
                  '  WLOU --> NonProd[Non-Prod OU]',
                ],
                caption: 'A typical multi-account landing zone: a flat management account plus OUs grouped by governance intent.',
              },
              exercises: [
                {
                  type: 'quiz',
                  prompt:
                    'A company wants the strongest possible blast-radius isolation between its production and development workloads, plus a single combined bill. What should the architect recommend?',
                  hint: 'What is the strongest isolation boundary in AWS?',
                  solution: {
                    explanation:
                      'Separate AWS accounts (e.g. prod and dev in different OUs) under one AWS Organization with consolidated billing. The account boundary gives hard isolation, while consolidated billing keeps a single invoice and shares discounts.',
                  },
                },
                {
                  type: 'quiz',
                  prompt:
                    'A team negotiated its own Savings Plan and does not want other accounts consuming its commitment. How do you accommodate this within an organization?',
                  solution: {
                    explanation:
                      'Turn off Reserved Instance / Savings Plan discount sharing for that member account in the billing console, so its commitment stays exclusive to it.',
                  },
                },
                {
                  type: 'task',
                  prompt:
                    'Explain why the management (payer) account should hold no production workloads.',
                  solution: {
                    explanation:
                      'SCPs do not apply to the management account, so you cannot enforce guardrails on it; it also controls the whole organization. Compromise or misconfiguration there has the largest possible blast radius, so it should stay minimal.',
                  },
                },
              ],
              docs: 'https://docs.aws.amazon.com/organizations/latest/userguide/orgs_introduction.html',
            },
            {
              id: 'sap1-t0-c1',
              services: [{ icon: 'organizations', label: 'Service Control Policies' }],
              title: 'Service Control Policies (SCPs) and permission boundaries',
              summary:
                'SCPs are organisation guardrails that cap the maximum permissions available to accounts and OUs; they never grant access, and an explicit deny in an SCP overrides any IAM allow.',
              explanation:
                "An effective permission in an organisation is the intersection of what IAM allows and what every SCP in the path (root → OU → account) permits. SCPs filter; they never grant. Two strategies exist. A deny list (the default, since accounts start with an implicit FullAWSAccess attached) lets you keep broad access and carve out specific prohibitions - for example deny leaving the organisation, deny disabling CloudTrail/GuardDuty/Config, deny actions outside approved Regions, or deny use of the root user. An allow list removes FullAWSAccess and explicitly permits only sanctioned services - tighter but high-maintenance. SCPs do not affect the management account, service-linked roles, or resource-based policy grants from outside the org boundary in the same way; and they apply to IAM users and roles in member accounts, not to the root user's ability to be the account owner (though you can deny most root actions). For per-developer self-service with safety, combine SCPs (org guardrail) with IAM permission boundaries (a per-principal cap a delegating admin sets so developers can create roles but never exceed the boundary).",
              analogy:
                'An SCP is the building\'s master keycard policy: it decides which doors could ever open for anyone on a floor. IAM is the individual keycard. You need both the floor policy to permit the door and your own card to be allowed through it.',
              keyPoints: [
                'Effective access = IAM allow ∩ SCP allow at every level; an explicit Deny anywhere wins.',
                'Deny-list SCPs keep FullAWSAccess and subtract prohibited actions (common for guardrails like Region restriction, protecting CloudTrail/Config).',
                'Allow-list SCPs remove FullAWSAccess and only permit named services (tight, but maintenance-heavy).',
                'SCPs never apply to the management account - govern it by keeping it empty and locked down.',
                'IAM permission boundaries cap an individual principal; pair them with SCPs to enable safe developer self-service.',
              ],
              commonMistakes: [
                'Thinking an SCP can grant a permission - it can only allow or deny within what IAM already grants.',
                'Expecting SCPs to restrict the management account.',
                'Forgetting that an allow-list SCP silently breaks any action you forgot to list.',
              ],
              code: {
                language: 'json',
                lines: [
                  '{',
                  '  "Version": "2012-10-17",',
                  '  "Statement": [',
                  '    {',
                  '      "Sid": "DenyOutsideApprovedRegions",',
                  '      "Effect": "Deny",',
                  '      "NotAction": ["iam:*", "organizations:*", "cloudfront:*"],',
                  '      "Resource": "*",',
                  '      "Condition": {',
                  '        "StringNotEquals": {',
                  '          "aws:RequestedRegion": ["eu-west-1", "eu-central-1"]',
                  '        }',
                  '      }',
                  '    }',
                  '  ]',
                  '}',
                ],
                explanation:
                  'A deny-list SCP restricting member accounts to two Regions, while excepting global services (IAM, Organizations, CloudFront) that operate outside a Region.',
              },
              exercises: [
                {
                  type: 'predict',
                  prompt:
                    'An IAM role in a member account has a policy allowing s3:* on all buckets. The OU has an SCP that denies s3:DeleteBucket. Can the role delete a bucket?',
                  solution: {
                    explanation:
                      'No. The effective permission is the intersection; the SCP explicit deny on s3:DeleteBucket overrides the IAM allow. Other S3 actions still work.',
                  },
                },
                {
                  type: 'quiz',
                  prompt:
                    'Security wants to guarantee no member account can ever disable CloudTrail or detach itself from the organization, while leaving teams otherwise free. Which SCP approach fits best?',
                  solution: {
                    explanation:
                      'A deny-list SCP attached high in the tree (root or top OU) that denies cloudtrail:StopLogging, cloudtrail:DeleteTrail, organizations:LeaveOrganization, etc., while leaving FullAWSAccess in place for everything else.',
                  },
                },
                {
                  type: 'task',
                  prompt:
                    'A platform team wants developers to create IAM roles for their apps but never grant a role more than read access to one S3 prefix. Which two controls combine to achieve this?',
                  solution: {
                    explanation:
                      'An SCP for the org-wide guardrail plus an IAM permission boundary required on any role developers create (enforced via a condition like iam:PermissionsBoundary), capping each role at the allowed actions.',
                  },
                },
              ],
              docs: 'https://docs.aws.amazon.com/organizations/latest/userguide/orgs_manage_policies_scps.html',
            },
          ],
        },
        {
          id: 'sap1-t1',
          name: 'Landing zones: Control Tower & governance',
          concepts: [
            {
              id: 'sap1-t1-c0',
              services: [{ icon: 'controltower', label: 'AWS Control Tower' }],
              title: 'AWS Control Tower and the landing zone',
              summary:
                'Control Tower provisions and continuously governs a multi-account landing zone with a baseline of OUs, accounts, guardrails and centralised logging - an opinionated, managed way to stand up best practice.',
              explanation:
                "Building a landing zone by hand (Organizations + SCPs + CloudTrail + Config + log archive + SSO) is the older 'AWS Landing Zone' solution; Control Tower is the managed, evolving replacement. It sets up a Security OU with a Log Archive account (centralised CloudTrail and Config logs) and an Audit account (cross-account security tooling), enables AWS IAM Identity Center for SSO, and applies guardrails. Guardrails come in three flavours: preventive (implemented as SCPs - they stop disallowed actions), detective (implemented as AWS Config rules - they flag drift after the fact), and proactive (implemented via CloudFormation hooks - they block non-compliant resources before deployment). Guardrails are also rated mandatory, strongly recommended, or elective. Account Factory (backed by AWS Service Catalog, or the IaC-driven Account Factory for Terraform) lets teams vend new accounts that automatically inherit the baseline. Choose Control Tower when you want a governed starting point fast; choose a custom Organizations build when you need topology or guardrails Control Tower does not express, or you already have a mature landing zone.",
              analogy:
                'Control Tower is a serviced-office provider: walk in and the floors, security desk, CCTV (logging) and badge system (SSO) are already wired up to a standard, and any new room you request (Account Factory) comes pre-fitted to the same code.',
              keyPoints: [
                'Control Tower automates a landing zone: baseline OUs, Log Archive + Audit accounts, IAM Identity Center and guardrails.',
                'Preventive guardrails = SCPs (block), detective = Config rules (flag), proactive = CloudFormation hooks (block before create).',
                'Account Factory (Service Catalog) vends new accounts that inherit the governance baseline automatically.',
                'Centralised CloudTrail and Config logs land in the Log Archive account; security tooling runs from the Audit account.',
                'Use Control Tower for a fast, opinionated start; build on raw Organizations when you need custom topology or guardrails it cannot express.',
              ],
              commonMistakes: [
                'Manually editing the Organizations resources Control Tower manages, causing drift it then reports or overwrites.',
                'Expecting Control Tower to cover every Region/service - it has a managed footprint and you extend it for the rest.',
                'Believing detective guardrails prevent bad config - they only detect and report it; preventive/proactive ones block.',
              ],
              diagram: {
                type: 'mermaid',
                lines: [
                  'flowchart TB',
                  '  CT[Control Tower] --> Mgmt[Management acct]',
                  '  CT --> SecOU[Security OU]',
                  '  SecOU --> Log[Log Archive acct]',
                  '  SecOU --> Audit[Audit acct]',
                  '  CT --> AF[Account Factory]',
                  '  AF --> New[New vended acct<br/>baseline applied]',
                ],
                caption: 'Control Tower bootstraps the management, log archive and audit accounts and vends new governed accounts via Account Factory.',
              },
              exercises: [
                {
                  type: 'quiz',
                  prompt:
                    'A regulated enterprise wants to roll out a governed multi-account environment in days, with centralised logging and SSO, and standard accounts that teams can self-request. What is the fastest fit?',
                  solution: {
                    explanation:
                      'AWS Control Tower - it provisions the landing zone (Log Archive, Audit accounts, IAM Identity Center, guardrails) and Account Factory lets teams vend pre-baselined accounts.',
                  },
                },
                {
                  type: 'predict',
                  prompt:
                    'You apply a detective guardrail for "S3 buckets must not be public." A developer makes a bucket public. What happens?',
                  solution: {
                    explanation:
                      'The action succeeds, but the detective guardrail (an AWS Config rule) flags the bucket as non-compliant. To actually block it you would need a preventive (SCP) or proactive (CloudFormation hook) guardrail.',
                  },
                },
                {
                  type: 'task',
                  prompt:
                    'Name the three guardrail types in Control Tower and the underlying AWS mechanism for each.',
                  solution: {
                    explanation:
                      'Preventive = Service Control Policies; detective = AWS Config rules; proactive = CloudFormation hooks.',
                  },
                },
              ],
              docs: 'https://docs.aws.amazon.com/controltower/latest/userguide/what-is-control-tower.html',
            },
            {
              id: 'sap1-t1-c1',
              services: [
                { icon: 'config', label: 'AWS Config' },
                { icon: 'cloudtrail', label: 'AWS CloudTrail' },
                { icon: 'guardduty', label: 'Amazon GuardDuty' },
                { icon: 'security', label: 'AWS Security Hub' },
              ],
              title: 'Organisation-wide audit, detection and config compliance',
              summary:
                'At scale you aggregate audit (CloudTrail organization trail), configuration history and rules (Config aggregator + conformance packs), threat detection (GuardDuty) and findings (Security Hub) into a delegated administrator account.',
              explanation:
                "Professional scenarios usually centre on doing security and compliance across the whole organisation, not one account. An organization trail in CloudTrail captures management and (optionally) data events for every current and future member account into a single S3 bucket in the Log Archive account, with log-file integrity validation. AWS Config records resource configuration over time; an organization aggregator pulls Config data from all accounts and Regions into one view, and conformance packs deploy collections of Config rules (with optional auto-remediation through SSM Automation) organisation-wide. Amazon GuardDuty analyses CloudTrail, VPC Flow Logs, DNS and (with extensions) EKS/S3/RDS/Lambda activity for threats; you delegate a member account as its administrator and auto-enable it for all accounts. AWS Security Hub aggregates and normalises findings (from GuardDuty, Inspector, Macie, Config, third parties) against standards like the AWS Foundational Security Best Practices and CIS, again via a delegated admin. The pattern across all of these is: delegate administration to a dedicated security/audit account rather than running tools from the management account, and auto-enable for new accounts.",
              keyPoints: [
                'CloudTrail organization trail: one immutable audit log for all accounts → central S3 bucket; enable log-file integrity validation.',
                'AWS Config aggregator gives an org-wide configuration view; conformance packs deploy rule sets with optional auto-remediation.',
                'GuardDuty: delegate an admin account, auto-enable org-wide threat detection across CloudTrail, VPC Flow Logs, DNS, EKS, S3, etc.',
                'Security Hub aggregates and scores findings against standards (FSBP, CIS) across the organisation.',
                'Delegate administration to a dedicated security/audit account; never run org-wide tooling from the management account.',
              ],
              commonMistakes: [
                'Confusing CloudTrail (who did what - API audit) with Config (what a resource looks like and how it changed over time).',
                'Running GuardDuty/Security Hub from the management account instead of a delegated administrator account.',
                'Forgetting to enable "auto-enable for new accounts," so newly vended accounts silently fall outside detection.',
              ],
              exercises: [
                {
                  type: 'quiz',
                  prompt:
                    'Security wants a single, tamper-evident record of every API call in all 60 accounts, including accounts created next year, delivered to one bucket. What do you configure?',
                  solution: {
                    explanation:
                      'A CloudTrail organization trail (created from the management or delegated admin account) writing to a central S3 bucket in the Log Archive account, with log-file integrity validation enabled. It automatically includes future accounts.',
                  },
                },
                {
                  type: 'quiz',
                  prompt:
                    'You need a continuously updated, organisation-wide answer to "which EBS volumes are unencrypted and in which account/Region?" Which service answers this best?',
                  solution: {
                    explanation:
                      'AWS Config with an organization aggregator (and a Config rule like encrypted-volumes), giving a single cross-account, cross-Region compliance view.',
                  },
                },
                {
                  type: 'task',
                  prompt:
                    'Explain why GuardDuty and Security Hub should both run from a delegated administrator account rather than the management account.',
                  solution: {
                    explanation:
                      'It keeps the management account minimal and reduces its blast radius, follows least privilege, and lets the security team operate without needing access to the payer account. Delegated admin still gives org-wide visibility and auto-enablement.',
                  },
                },
              ],
              docs: 'https://docs.aws.amazon.com/awscloudtrail/latest/userguide/creating-trail-organization.html',
            },
          ],
        },
        {
          id: 'sap1-t2',
          name: 'Centralised identity & access',
          concepts: [
            {
              id: 'sap1-t2-c0',
              services: [{ icon: 'iam', label: 'IAM Identity Center' }],
              title: 'IAM Identity Center, federation and cross-account roles',
              summary:
                'IAM Identity Center provides single sign-on across all org accounts using permission sets, while cross-account IAM roles (sts:AssumeRole) give services and pipelines temporary, least-privilege access between accounts.',
              explanation:
                "Workforce access in a multi-account org should not mean an IAM user per account. AWS IAM Identity Center (successor to AWS SSO) connects to an identity source - its built-in directory, Active Directory, or an external IdP via SAML 2.0/SCIM (Okta, Entra ID/Azure AD, Ping) - and grants users access to accounts through permission sets. A permission set is a reusable template of IAM policies; assigning a group to an account with a permission set provisions a role behind the scenes, so users get short-lived credentials, never long-term keys, and can switch accounts from one portal. For service-to-service and CI/CD access between accounts, use IAM roles with a trust policy naming the trusted account/principal; the caller uses sts:AssumeRole to get temporary credentials. Harden cross-account trust with an ExternalId (defeats the confused-deputy problem for third parties) and tight conditions. For workloads outside AWS or in CI systems like GitHub Actions, prefer IAM Roles Anywhere or OIDC federation over stored access keys, so no long-term secret ever leaves AWS. AWS RAM (covered next) shares resources rather than access.",
              analogy:
                'Identity Center is the corporate badge office: one identity, and the badge opens whichever buildings (accounts) your role allows for a limited time. Cross-account roles are visitor passes one building issues to a named guest from another, valid only briefly.',
              keyPoints: [
                'IAM Identity Center = workforce SSO across all org accounts via permission sets; users get temporary credentials, no per-account IAM users.',
                'Connect to AD or an external IdP through SAML 2.0 + SCIM for provisioning; assign access by group + permission set + account.',
                'Cross-account access uses IAM roles + sts:AssumeRole; the role trust policy names who may assume it.',
                'Use an ExternalId for third-party cross-account roles to prevent the confused-deputy problem.',
                'For CI/CD and external workloads, use OIDC federation or IAM Roles Anywhere instead of long-term access keys.',
              ],
              commonMistakes: [
                'Creating duplicate IAM users in every account instead of using Identity Center permission sets.',
                'Distributing long-term access keys to pipelines rather than federating with OIDC/role assumption.',
                'Omitting ExternalId on roles assumed by third-party SaaS, leaving a confused-deputy risk.',
              ],
              code: {
                language: 'json',
                lines: [
                  '{',
                  '  "Version": "2012-10-17",',
                  '  "Statement": [{',
                  '    "Effect": "Allow",',
                  '    "Principal": { "AWS": "arn:aws:iam::111122223333:root" },',
                  '    "Action": "sts:AssumeRole",',
                  '    "Condition": {',
                  '      "StringEquals": { "sts:ExternalId": "vendor-7f3a9" }',
                  '    }',
                  '  }]',
                  '}',
                ],
                explanation:
                  'A cross-account role trust policy: only principals in account 111122223333 supplying the agreed ExternalId may assume this role - mitigating the confused-deputy problem.',
              },
              diagram: {
                type: 'mermaid',
                lines: [
                  'flowchart LR',
                  '  IdP[External IdP / AD] --> IC[IAM Identity Center]',
                  '  IC -->|permission set| A1[Account A role]',
                  '  IC -->|permission set| A2[Account B role]',
                  '  User[Employee] --> IC',
                ],
                caption: 'One identity signs in to Identity Center and assumes a role in any assigned account via a permission set.',
              },
              exercises: [
                {
                  type: 'quiz',
                  prompt:
                    'An enterprise uses Okta and has 40 AWS accounts. Engineers need to sign in once and access only the accounts and permissions their team allows, with no long-term credentials. What do you design?',
                  solution: {
                    explanation:
                      'IAM Identity Center federated to Okta via SAML 2.0 (with SCIM for user/group provisioning). Map Okta groups to permission sets and assign them per account; users get temporary credentials through the SSO portal.',
                  },
                },
                {
                  type: 'quiz',
                  prompt:
                    'A SaaS monitoring vendor needs read access to your account. How do you grant it most securely?',
                  solution: {
                    explanation:
                      'Create a cross-account IAM role with a trust policy naming the vendor account and requiring a unique ExternalId; grant least-privilege read permissions. Avoid creating an IAM user with access keys.',
                  },
                },
                {
                  type: 'predict',
                  prompt:
                    'A GitHub Actions pipeline currently uses stored IAM access keys to deploy. What is the recommended hardening, and why?',
                  solution: {
                    explanation:
                      'Replace the keys with GitHub OIDC federation: configure GitHub as an OIDC identity provider in IAM and let the workflow assume a role scoped by repo/branch claims. No long-term secret is stored, and access is short-lived and auditable.',
                  },
                },
              ],
              docs: 'https://docs.aws.amazon.com/singlesignon/latest/userguide/what-is.html',
            },
            {
              id: 'sap1-t2-c1',
              services: [{ icon: 'organizations', label: 'AWS RAM' }],
              title: 'AWS Resource Access Manager (RAM) for shared infrastructure',
              summary:
                'RAM shares specific resources - subnets, Transit Gateways, Route 53 Resolver rules, License Manager configs - across accounts without duplicating them or exposing access via cross-account roles.',
              explanation:
                "Sharing access (a role) is different from sharing a resource. AWS RAM lets a resource owner share supported resources with other accounts or with an entire OU/organisation, so consumers use them as if local, while the owner keeps lifecycle control. The headline pattern is centralised VPC networking: a network account owns a VPC and shares its subnets via RAM so workload accounts launch ENIs/instances directly into those shared subnets (shared VPC). This collapses per-account VPC and NAT sprawl, centralises IP management and inspection, and means there is no VPC peering needed between the sharing and consuming accounts. RAM also shares a Transit Gateway (so many accounts attach to one hub), Route 53 Resolver rules (so all accounts resolve on-prem names the same way), Aurora Limitless/aurora resources, Outposts, Image Builder components, and License Manager license configurations. Sharing within the organisation can skip the invitation/acceptance step if you enable RAM sharing with Organizations. Use RAM when accounts must share infrastructure; use cross-account IAM roles when accounts must call each other's APIs.",
              analogy:
                'RAM is like a shared office floor plan: the facilities account owns the floor (VPC/subnets) and lets several teams (accounts) place their desks (ENIs) on it. Everyone uses the same wiring without each team building their own floor.',
              keyPoints: [
                'RAM shares resources (subnets, Transit Gateway, Resolver rules, License Manager) - not API access; use IAM roles for that.',
                'Shared VPC: a network account owns subnets and shares them, so workload accounts launch resources into them - no peering, central IP/inspection control.',
                'Sharing a Transit Gateway via RAM lets many accounts attach to one routing hub.',
                'Within an organisation you can auto-accept shares (no invitation) by enabling RAM sharing with Organizations.',
                'The owner retains lifecycle control; consumers cannot modify the shared resource.',
              ],
              commonMistakes: [
                'Reaching for VPC peering between accounts when a shared VPC (via RAM) or Transit Gateway would be simpler and more scalable.',
                'Confusing RAM (share a resource) with cross-account IAM roles (grant API access).',
                'Forgetting that in a shared VPC the participant account does not own the subnet, so it cannot modify route tables or the VPC itself.',
              ],
              exercises: [
                {
                  type: 'quiz',
                  prompt:
                    'A platform team wants every workload account to launch into centrally managed, pre-inspected subnets with no per-account NAT gateways or VPC peering. What enables this?',
                  solution: {
                    explanation:
                      'A shared VPC: the network account owns the VPC and shares its subnets through AWS RAM, letting workload accounts deploy ENIs/instances directly into them while networking, NAT and inspection stay central.',
                  },
                },
                {
                  type: 'quiz',
                  prompt:
                    'Twenty accounts each need to attach to the same Transit Gateway hub. How do you avoid recreating a TGW per account?',
                  solution: {
                    explanation:
                      'The owning account shares the Transit Gateway via AWS RAM with the organisation/OU; the other accounts then create TGW attachments to the shared gateway.',
                  },
                },
                {
                  type: 'task',
                  prompt:
                    'In a shared VPC, why can a participant account not edit the subnet route tables?',
                  solution: {
                    explanation:
                      'RAM shares the resource but the owner account retains lifecycle and configuration control. Participants can place resources in the subnets but cannot alter the VPC, subnets or route tables, keeping networking centrally governed.',
                  },
                },
              ],
              docs: 'https://docs.aws.amazon.com/ram/latest/userguide/what-is.html',
            },
          ],
        },
        {
          id: 'sap1-t3',
          name: 'Cross-account & hybrid networking',
          concepts: [
            {
              id: 'sap1-t3-c0',
              services: [
                { icon: 'vpc', label: 'Transit Gateway' },
                { icon: 'vpc', label: 'VPC Peering' },
              ],
              title: 'Connecting VPCs: peering vs Transit Gateway vs PrivateLink',
              summary:
                'VPC peering is simple point-to-point and non-transitive; Transit Gateway is a regional hub that connects hundreds of VPCs and on-prem with transitive routing; PrivateLink exposes a single service privately without sharing networks.',
              explanation:
                "The three options solve different scales of problem. VPC peering creates a 1:1 private link between two VPCs (same or cross-Region, cross-account); it is cheap and low-latency but non-transitive - if A peers B and B peers C, A still cannot reach C - so a fully meshed N-VPC topology needs N(N-1)/2 connections and becomes unmanageable past a handful. AWS Transit Gateway is a regional cloud router: every VPC, VPN, and Direct Connect gateway attaches once to the hub and routing is transitive, with route tables and propagation letting you segment traffic (e.g. keep prod and dev isolated, or force traffic through an inspection VPC). Transit Gateways can peer across Regions for a global backbone, and one can be shared via RAM. AWS PrivateLink (interface VPC endpoints powered by ENIs, fronted by a Network Load Balancer on the provider side) is different again: it exposes one specific service - an AWS service, a SaaS, or your own app - into a consumer VPC privately, without joining the networks, without overlapping-CIDR concerns, and with one-directional, service-only access. Decision rule: a couple of VPCs that must talk fully → peering; many VPCs/hybrid needing transitive, segmented routing → Transit Gateway; expose one service to others without merging networks → PrivateLink.",
              analogy:
                'Peering is a private hallway between two offices. A Transit Gateway is the building\'s central lift lobby every floor connects to. PrivateLink is a service window in one wall - you can be served through it without anyone getting access to the rest of the room.',
              keyPoints: [
                'VPC peering: 1:1, non-transitive, no overlapping CIDRs; great for a few VPCs, unmanageable as a full mesh at scale.',
                'Transit Gateway: regional hub with transitive routing, route-table segmentation, cross-Region peering, RAM sharing - the default for many-VPC/hybrid.',
                'PrivateLink/interface endpoints: expose a single service privately via NLB+ENI; networks stay separate and CIDRs may overlap.',
                'Use route tables on the TGW to isolate domains (prod vs dev) or steer traffic through a central inspection VPC.',
                'None of peering/TGW allow overlapping CIDRs for routed traffic; PrivateLink sidesteps overlap because it is service-scoped.',
              ],
              commonMistakes: [
                'Trying to route transitively over VPC peering - it does not work; you need a Transit Gateway.',
                'Building a full peering mesh for dozens of VPCs instead of a hub-and-spoke Transit Gateway.',
                'Using peering/TGW when only one service needs exposure and the consumer should not reach the whole VPC - PrivateLink is tighter.',
              ],
              diagram: {
                type: 'mermaid',
                lines: [
                  'flowchart TB',
                  '  TGW[Transit Gateway hub]',
                  '  V1[VPC Prod] --> TGW',
                  '  V2[VPC Dev] --> TGW',
                  '  V3[Shared Svcs VPC] --> TGW',
                  '  DXGW[Direct Connect GW] --> TGW',
                  '  VPN[Site-to-Site VPN] --> TGW',
                ],
                caption: 'Transit Gateway hub-and-spoke: each VPC and hybrid link attaches once, with transitive, segmentable routing.',
              },
              exercises: [
                {
                  type: 'quiz',
                  prompt:
                    'An organisation has 50 VPCs across accounts plus two Direct Connect links and needs any-to-any routing with the ability to keep prod and non-prod traffic separated. What should the architect choose?',
                  solution: {
                    explanation:
                      'AWS Transit Gateway (shared via RAM). All VPCs and the Direct Connect gateway attach to the hub; multiple TGW route tables segment prod from non-prod. A peering mesh of 50 VPCs would need ~1,225 connections and cannot route transitively.',
                  },
                },
                {
                  type: 'quiz',
                  prompt:
                    'A vendor wants to consume your internal pricing API from their own VPC, but you must not give them access to anything else in your network, and their VPC uses an overlapping CIDR with yours. What fits?',
                  solution: {
                    explanation:
                      'AWS PrivateLink: front your API with a Network Load Balancer, publish it as an endpoint service, and let the vendor create an interface endpoint. Only that service is reachable, the networks are not joined, and overlapping CIDRs are irrelevant.',
                  },
                },
                {
                  type: 'predict',
                  prompt:
                    'VPC A is peered to VPC B, and VPC B is peered to VPC C. Will instances in A reach instances in C through B?',
                  solution: {
                    explanation:
                      'No. VPC peering is non-transitive. A and C would need their own peering connection, or all three should attach to a Transit Gateway.',
                  },
                },
              ],
              docs: 'https://docs.aws.amazon.com/vpc/latest/tgw/what-is-transit-gateway.html',
            },
            {
              id: 'sap1-t3-c1',
              services: [
                { icon: 'directconnect', label: 'AWS Direct Connect' },
                { icon: 'vpc', label: 'Site-to-Site VPN' },
              ],
              title: 'Hybrid connectivity: Direct Connect, VPN, and resilient designs',
              summary:
                'Direct Connect is a dedicated private link with consistent latency and lower egress cost but weeks to provision; Site-to-Site VPN is fast, encrypted internet transport; the resilient pattern combines them with a Direct Connect Gateway and Transit Gateway.',
              explanation:
                "Choosing and making hybrid links resilient is core Domain 1 material. AWS Direct Connect (DX) is a physical, dedicated connection from your data centre to an AWS Direct Connect location, giving consistent bandwidth and latency, lower data-transfer-out rates, and a private path that never touches the internet - but it takes weeks to provision and a single connection is not redundant. It carries virtual interfaces (VIFs): private VIF to reach VPCs, transit VIF to reach a Transit Gateway via a Direct Connect Gateway, and public VIF to reach AWS public endpoints. A Direct Connect Gateway lets one DX connection reach VPCs/TGWs in many Regions and accounts. Direct Connect is not encrypted by default - layer an IPsec VPN over it for encryption (or use MACsec on supported ports). Site-to-Site VPN runs IPsec tunnels over the public internet: quick to set up, encrypted, but subject to internet variability; each connection has two tunnels for redundancy. Resilient patterns, in increasing order: VPN as a cheap backup to a single DX; two DX connections at two locations; and for the highest resilience, DX with a VPN failover so that if the dedicated link drops, traffic shifts to the encrypted internet path. Accelerate VPN throughput/latency with AWS Global Accelerator-backed Accelerated Site-to-Site VPN.",
              analogy:
                'Direct Connect is a leased private rail line - reliable and cheap per tonne, but laying the track takes months. A VPN is sending the same cargo by road over public motorways - available today, encrypted in armoured trucks, but traffic varies. Serious operations run both and reroute when one is blocked.',
              keyPoints: [
                'Direct Connect: dedicated, consistent latency, lower egress cost, private - but weeks to provision and a single link is not HA.',
                'DX VIFs: private (to VPCs), transit (to a TGW via DX Gateway), public (to AWS public services); DX Gateway spans Regions/accounts.',
                'DX is unencrypted by default; add an IPsec VPN over it or use MACsec for encryption.',
                'Site-to-Site VPN: fast to deploy, encrypted, internet-based, two tunnels per connection for redundancy.',
                'Resilience tiers: VPN backup to DX < dual DX at two sites < DX primary with VPN failover; Accelerated VPN uses the AWS global network.',
              ],
              commonMistakes: [
                'Assuming Direct Connect traffic is encrypted - it is private but not encrypted; add VPN/MACsec where compliance requires it.',
                'Deploying a single Direct Connect and calling it highly available - one link is a single point of failure.',
                'Forgetting that a transit VIF + Direct Connect Gateway is what connects DX to a Transit Gateway (a private VIF goes to a single VPC/VGW).',
              ],
              diagram: {
                type: 'mermaid',
                lines: [
                  'flowchart LR',
                  '  DC[On-prem DC] --> DX[Direct Connect<br/>primary]',
                  '  DC --> VPN[Site-to-Site VPN<br/>backup]',
                  '  DX --> DXGW[DX Gateway]',
                  '  VPN --> TGW[Transit Gateway]',
                  '  DXGW --> TGW',
                  '  TGW --> VPCs[VPCs]',
                ],
                caption: 'A resilient hybrid design: Direct Connect as primary with a VPN backup, both reaching VPCs via a Transit Gateway.',
              },
              exercises: [
                {
                  type: 'quiz',
                  prompt:
                    'A bank needs predictable low latency and reduced egress cost for steady, high-volume data flowing from on-prem to AWS, plus a fallback path if the dedicated link fails, all while meeting an encryption-in-transit mandate. Design the connectivity.',
                  solution: {
                    explanation:
                      'Direct Connect as the primary path (consistent latency, lower egress), with a Site-to-Site VPN as automatic failover, both attached to a Transit Gateway via a Direct Connect Gateway / VPN attachment. Run an IPsec VPN over the DX (or use MACsec) to satisfy the encryption requirement, since DX is not encrypted by itself.',
                  },
                },
                {
                  type: 'quiz',
                  prompt:
                    'A startup needs hybrid connectivity working this week for a pilot; cost and consistent latency are not yet concerns. What is appropriate?',
                  solution: {
                    explanation:
                      'A Site-to-Site VPN - it is encrypted, set up in minutes/hours, and uses the existing internet connection. Move to Direct Connect later if steady-state volume and latency consistency justify it.',
                  },
                },
                {
                  type: 'predict',
                  prompt:
                    'Which Direct Connect virtual interface connects to a Transit Gateway, and via what?',
                  solution: {
                    explanation:
                      'A transit VIF, attached through a Direct Connect Gateway. A private VIF connects to a single VPC/virtual private gateway; a public VIF reaches AWS public endpoints.',
                  },
                },
              ],
              docs: 'https://docs.aws.amazon.com/directconnect/latest/UserGuide/Welcome.html',
            },
            {
              id: 'sap1-t3-c2',
              services: [{ icon: 'route53', label: 'Route 53 Resolver' }],
              title: 'Hybrid DNS with Route 53 Resolver and private hosted zones',
              summary:
                'Route 53 Resolver inbound and outbound endpoints bridge DNS between on-premises and VPCs, while private hosted zones and Resolver rules (shared via RAM) give consistent name resolution across a hybrid, multi-account estate.',
              explanation:
                "DNS is the quiet failure point in hybrid designs. Inside a VPC, the Route 53 Resolver (the .2 address, VPC+2) resolves public names and any private hosted zones associated with that VPC. To make hybrid DNS work both ways you add Resolver endpoints: an inbound endpoint gives on-premises systems a target IP to forward queries to so they can resolve AWS private names; an outbound endpoint, paired with Resolver rules, forwards queries for your on-prem domains (e.g. corp.example.internal) from the VPC to your on-prem DNS. Private hosted zones hold private DNS records and can be associated with many VPCs, including across accounts. At organisation scale you centralise this: a networking account hosts the Resolver endpoints and rules and shares the forwarding rules via AWS RAM so every account resolves the same way; combined with a shared VPC or Transit Gateway, all workloads get coherent split-horizon DNS. Resolver DNS Firewall can additionally block queries to malicious or disallowed domains. The exam tests recognising that 'on-prem cannot resolve AWS private names' needs an inbound endpoint, while 'AWS cannot resolve on-prem names' needs an outbound endpoint plus rules.",
              analogy:
                'Route 53 Resolver endpoints are the reception desks between two buildings: the inbound desk answers questions visitors from the other building ask about yours; the outbound desk forwards your staff\'s questions about the other building to their reception.',
              keyPoints: [
                'In-VPC resolution uses the Route 53 Resolver at VPC base +2; it resolves public names and associated private hosted zones.',
                'Inbound Resolver endpoint: lets on-premises DNS forward to and resolve AWS private names.',
                'Outbound Resolver endpoint + Resolver rules: forward queries for on-prem domains from the VPC to on-prem DNS.',
                'Private hosted zones can associate with many VPCs/accounts; share Resolver rules org-wide via AWS RAM for consistency.',
                'Resolver DNS Firewall blocks queries to disallowed/malicious domains for egress control.',
              ],
              commonMistakes: [
                'Swapping the endpoints: inbound is for queries coming INTO AWS, outbound is for queries leaving AWS to on-prem.',
                'Forgetting to associate a private hosted zone with every VPC that needs it (or to share Resolver rules via RAM).',
                'Assuming the default VPC resolver can reach on-prem names without an outbound endpoint and forwarding rules.',
              ],
              diagram: {
                type: 'mermaid',
                lines: [
                  'flowchart LR',
                  '  OnPrem[On-prem DNS] -->|queries AWS names| IN[Inbound endpoint]',
                  '  IN --> R53[Route 53 Resolver]',
                  '  VPC[VPC workloads] --> R53',
                  '  R53 --> OUT[Outbound endpoint]',
                  '  OUT -->|queries on-prem names| OnPrem',
                ],
                caption: 'Two-way hybrid DNS: inbound endpoint resolves AWS names for on-prem; outbound endpoint forwards on-prem names from the VPC.',
              },
              exercises: [
                {
                  type: 'quiz',
                  prompt:
                    'On-premises servers cannot resolve the private DNS names of resources in an AWS private hosted zone. What do you add?',
                  solution: {
                    explanation:
                      'A Route 53 Resolver inbound endpoint in the VPC; point on-prem DNS conditional forwarders for the AWS private domain at the endpoint IPs.',
                  },
                },
                {
                  type: 'quiz',
                  prompt:
                    'EC2 instances must resolve names in your on-prem corp.example.internal domain via your data-centre DNS. What do you configure?',
                  solution: {
                    explanation:
                      'A Route 53 Resolver outbound endpoint plus a Resolver rule that forwards corp.example.internal queries to the on-prem DNS servers (over the Direct Connect/VPN link).',
                  },
                },
                {
                  type: 'task',
                  prompt:
                    'How do you ensure all 30 accounts in an organisation forward on-prem DNS queries identically without configuring each one?',
                  solution: {
                    explanation:
                      'Create the Resolver rules once in a central networking account and share them with the organisation via AWS RAM; associate them with each VPC. Every account then uses the same forwarding behaviour.',
                  },
                },
              ],
              docs: 'https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/resolver.html',
            },
          ],
        },
      ],
    },

    /* ───────────────── DOMAIN 2 — DESIGN FOR NEW SOLUTIONS (29%) ───────────────── */
    {
      level: 2,
      name: 'Design for New Solutions',
      focus:
        'Selecting compute, storage and databases at scale, event-driven and serverless architectures, decoupling, multi-Region high availability and disaster recovery with RTO/RPO targets (Domain 2 · 29%)',
      accent: '#7c4ddb',
      soft: '#f1ebfd',
      topics: [
        {
          id: 'sap2-t0',
          name: 'Compute & data store selection at scale',
          concepts: [
            {
              id: 'sap2-t0-c0',
              services: [
                { icon: 'ec2', label: 'Amazon EC2' },
                { icon: 'fargate', label: 'AWS Fargate' },
                { icon: 'lambda', label: 'AWS Lambda' },
              ],
              title: 'Choosing compute: EC2 vs containers vs serverless, and purchasing',
              summary:
                'Match compute to operational ownership and traffic shape: EC2 for full control or licensing, ECS/EKS for containerised services (Fargate to drop instance management), Lambda for event-driven and spiky workloads - then optimise spend with Spot, Savings Plans and Graviton.',
              explanation:
                "A Professional answer weighs control, operational burden, scaling behaviour and cost together. EC2 gives total control of the OS and is the home for legacy software, specialised licensing, GPU/HPC, or anything needing persistent local state - but you own patching and capacity. Containers (ECS or EKS) suit portable microservices; choosing the Fargate launch type removes instance management (serverless containers), while the EC2 launch type keeps it when you need GPUs, special instance types, or per-instance cost control with Spot. Lambda excels for event-driven, bursty, or unpredictable workloads where you want zero idle cost and automatic scaling; its constraints (15-minute max, memory-coupled CPU, package limits, cold starts) push very long or steady-heavy workloads toward containers or EC2. On cost: Savings Plans (Compute Savings Plans cover EC2, Fargate and Lambda; EC2 Instance Savings Plans are cheaper but lock you to a family/Region) reward steady usage with up to ~66-72% off; Spot delivers up to ~90% off for fault-tolerant, interruptible work (batch, CI, stateless web behind an ASG with mixed instances); and AWS Graviton (Arm) instances typically cut price-performance 20-40% for compatible workloads. The art is mixing them: e.g. an ASG with a Savings-Plan-covered On-Demand base plus Spot for the variable top, on Graviton where possible.",
              analogy:
                'Compute choice is like transport for a delivery business: own a fleet (EC2) for full control and special vehicles; lease standardised vans through a service (Fargate) to skip the garage; hail rides per trip (Lambda) when trips are rare and unpredictable. Savings Plans are a volume contract; Spot is grabbing cheap last-minute seats you must vacate on demand.',
              keyPoints: [
                'EC2 for full OS control, licensing, GPU/HPC, persistent state; you own patching and capacity.',
                'ECS/EKS for containers; Fargate removes instance management, EC2 launch type keeps it for GPUs/Spot/cost control.',
                'Lambda for event-driven/spiky workloads with zero idle cost; watch the 15-min limit, cold starts and package size.',
                'Compute Savings Plans cover EC2+Fargate+Lambda; EC2 Instance Savings Plans are cheaper but family/Region-locked.',
                'Spot (up to ~90% off) for interruptible work; Graviton (Arm) typically 20-40% better price-performance - mix them in one ASG.',
              ],
              commonMistakes: [
                'Forcing a long-running (>15 min) or steady high-throughput job onto Lambda where a container/EC2 is cheaper and simpler.',
                'Running stateless, fault-tolerant fleets on full-price On-Demand instead of Spot + Savings Plans.',
                'Choosing EKS for a small team when ECS/Fargate would carry far less operational overhead.',
              ],
              diagram: {
                type: 'mermaid',
                lines: [
                  'flowchart TB',
                  '  Q{Workload shape?}',
                  '  Q -->|event-driven, spiky| L[Lambda]',
                  '  Q -->|containerised service| C{Manage instances?}',
                  '  C -->|no| F[ECS/EKS on Fargate]',
                  '  C -->|yes - GPU/Spot| E2[ECS/EKS on EC2]',
                  '  Q -->|legacy/licensed/HPC| E[EC2]',
                ],
                caption: 'A decision path for compute selection by workload shape and operational ownership.',
              },
              exercises: [
                {
                  type: 'quiz',
                  prompt:
                    'An image-processing job fires whenever a file lands in S3, runs ~10 seconds, and traffic is wildly unpredictable. Idle cost must be zero. Best compute?',
                  solution: {
                    explanation:
                      'AWS Lambda triggered by S3 events - it scales automatically, costs nothing when idle, and 10 seconds is well within the 15-minute limit.',
                  },
                },
                {
                  type: 'quiz',
                  prompt:
                    'A stateless web tier runs behind an ALB with steady baseline traffic and large daytime spikes; the team wants the lowest cost without sacrificing availability. Outline a purchasing strategy.',
                  solution: {
                    explanation:
                      'Use an Auto Scaling group with a mixed-instances policy: cover the steady baseline with On-Demand backed by a Compute Savings Plan, and serve the spiky top with Spot Instances across several instance types/AZs. Prefer Graviton instances for better price-performance.',
                  },
                },
                {
                  type: 'predict',
                  prompt:
                    'A team picks an EC2 Instance Savings Plan to save money, then six months later wants to switch families from m6i to c7g for a new workload. What is the trade-off they hit?',
                  solution: {
                    explanation:
                      'EC2 Instance Savings Plans lock the discount to a specific instance family and Region, so the commitment will not automatically cover the new family. A Compute Savings Plan would have been more flexible (covering any family, Region, EC2/Fargate/Lambda) at a slightly smaller discount.',
                  },
                },
              ],
              docs: 'https://docs.aws.amazon.com/whitepapers/latest/cost-optimization-reservation-models/cost-optimization-reservation-models.html',
            },
            {
              id: 'sap2-t0-c1',
              services: [
                { icon: 'rds', label: 'Amazon RDS' },
                { icon: 'aurora', label: 'Amazon Aurora' },
                { icon: 'dynamodb', label: 'Amazon DynamoDB' },
              ],
              title: 'Selecting the right database: relational, NoSQL, and purpose-built',
              summary:
                'Pick by access pattern and scale: Aurora/RDS for relational OLTP with joins and transactions, DynamoDB for predictable single-digit-ms key access at unbounded scale, and purpose-built engines (Redshift, ElastiCache, OpenSearch, Neptune, Timestream, DocumentDB) for everything in between.',
              explanation:
                "AWS's stance is purpose-built databases - match the data model and access pattern, do not force everything into one engine. Relational (Amazon RDS for MySQL/PostgreSQL/etc., or Amazon Aurora) is right when you need joins, complex queries, strong transactional consistency and a rigid schema; Aurora adds storage that auto-grows to 128 TiB, six-way replication across three AZs, up to 15 low-lag read replicas, and serverless v2 autoscaling - choose Aurora Global Database when you need cross-Region reads and sub-second-lag DR. Amazon DynamoDB is the choice for massive scale with known access patterns: single-digit-millisecond (or microsecond with DAX) latency, on-demand or provisioned capacity, global tables for active-active multi-Region, and streams for event-driven processing - but you must design keys around your queries because it has no ad-hoc joins. Beyond these: Amazon Redshift for OLAP/data-warehouse analytics; Amazon ElastiCache (Redis/Memcached) for caching and sub-millisecond reads; Amazon OpenSearch Service for search and log analytics; Amazon Neptune for graph relationships; Amazon Timestream for time-series; Amazon DocumentDB for MongoDB-compatible documents; Amazon Keyspaces for Cassandra; Amazon QLDB for an immutable ledger. The decision flow: relational model with transactions → Aurora/RDS; key/value at huge scale with known patterns → DynamoDB; analytics → Redshift; then map any specialised shape (graph, search, time-series, ledger) to its purpose-built service.",
              analogy:
                'Databases are tools in a workshop: a relational DB is an adjustable wrench (versatile, handles joins), DynamoDB is a nail gun (blazing fast at one repetitive job at huge volume), and the purpose-built engines are specialised tools - using a wrench to drive nails works until the volume makes the nail gun obviously right.',
              keyPoints: [
                'Relational (RDS/Aurora): joins, transactions, complex queries, fixed schema; Aurora auto-scales storage, 15 read replicas, Global Database for cross-Region DR.',
                'DynamoDB: single-digit-ms at any scale, on-demand/provisioned, global tables (active-active), streams - but design keys to your access patterns.',
                'Redshift for OLAP/warehouse; ElastiCache for caching/sub-ms; OpenSearch for search/log analytics.',
                'Neptune (graph), Timestream (time-series), DocumentDB (Mongo-compatible), Keyspaces (Cassandra), QLDB (ledger).',
                'Decision: transactions+joins → Aurora/RDS; key/value at scale → DynamoDB; analytics → Redshift; specialised shape → its purpose-built engine.',
              ],
              commonMistakes: [
                'Using DynamoDB for workloads needing ad-hoc joins and flexible queries - it forces you to predesign access patterns.',
                'Running analytics (OLAP) on an RDS instance instead of Redshift, throttling the transactional database.',
                'Reaching for a relational DB for graph traversals where Neptune is far more efficient.',
              ],
              exercises: [
                {
                  type: 'quiz',
                  prompt:
                    'A global shopping cart needs single-digit-ms reads/writes, must survive a Region failure with active-active writes in two Regions, and has a simple key-based access pattern. Which database?',
                  solution: {
                    explanation:
                      'Amazon DynamoDB with global tables - multi-Region, multi-active replication, predictable low latency, and the access pattern is key-based, which suits DynamoDB.',
                  },
                },
                {
                  type: 'quiz',
                  prompt:
                    'A finance app needs ACID transactions, complex joins, and a read-heavy reporting workload, plus the ability to serve low-lag reads in a second Region for DR. Which database and feature?',
                  solution: {
                    explanation:
                      'Amazon Aurora (PostgreSQL/MySQL compatible) with read replicas for the read-heavy load and an Aurora Global Database for cross-Region, sub-second-lag reads and fast DR failover.',
                  },
                },
                {
                  type: 'predict',
                  prompt:
                    'A team stores billions of IoT sensor readings and mostly queries them by time window for dashboards. They start with RDS. What is the better purpose-built choice and why?',
                  solution: {
                    explanation:
                      'Amazon Timestream - a managed time-series database optimised for time-ordered ingestion and time-window queries at scale, with built-in retention tiering. RDS would struggle with the ingest rate and time-range query patterns.',
                  },
                },
              ],
              docs: 'https://docs.aws.amazon.com/whitepapers/latest/aws-overview/database.html',
            },
            {
              id: 'sap2-t0-c2',
              services: [
                { icon: 's3', label: 'Amazon S3' },
                { icon: 'efs', label: 'Amazon EFS' },
                { icon: 'storagegateway', label: 'Amazon FSx' },
              ],
              title: 'Storage selection: object, file, and block at scale',
              summary:
                'Choose object (S3) for unbounded, durable, internet-scale data and data lakes; file (EFS for Linux/NFS, FSx for Windows/Lustre/NetApp) for shared POSIX/SMB access; block (EBS, io2 Block Express) for low-latency single-instance volumes - and use lifecycle/tiering for cost.',
              explanation:
                "Storage decisions hinge on access protocol, sharing, latency and durability. Amazon S3 is the default for large-scale, durable (eleven nines), internet-accessible object data - data lakes, backups, media, static content - with classes from Standard through Intelligent-Tiering to Glacier Deep Archive, lifecycle rules, versioning, Object Lock (WORM compliance), replication (same- and cross-Region), and event notifications that make it a natural event source. For shared file systems: Amazon EFS is elastic NFS for many Linux instances across AZs (regional, with Standard and One Zone classes and IA tiering); Amazon FSx for Windows File Server provides SMB/Active Directory file shares; FSx for Lustre delivers HPC-grade throughput and integrates with S3; FSx for NetApp ONTAP and FSx for OpenZFS suit lift-and-shift of those filesystems. Block storage (Amazon EBS) attaches to one instance: gp3 for general purpose with independently provisioned IOPS/throughput, io2 Block Express for the highest IOPS and sub-millisecond latency (databases), st1/sc1 HDD for throughput/cold. The cost lever across S3 is matching class to access frequency (Intelligent-Tiering when patterns are unknown) and using lifecycle transitions; across file/block it is right-sizing and choosing the elastic option (EFS, gp3) over over-provisioned fixed capacity. Recognise the trap: needing shared access from many instances rules out a single EBS volume - use EFS (Linux) or FSx (Windows).",
              keyPoints: [
                'S3: durable object store for data lakes/backups/media; classes + lifecycle + Object Lock + replication + event notifications.',
                'EFS: elastic shared NFS for many Linux instances across AZs; FSx for Windows (SMB/AD), Lustre (HPC + S3), NetApp/OpenZFS (lift-and-shift).',
                'EBS: single-instance block; gp3 general purpose (decoupled IOPS/throughput), io2 Block Express for highest IOPS/databases.',
                'Many instances sharing files → EFS (Linux) or FSx (Windows); never try to share one standard EBS volume.',
                'Cost: match S3 class to access frequency (Intelligent-Tiering when unknown) and use lifecycle/IA tiering.',
              ],
              commonMistakes: [
                'Trying to give many instances a shared writable disk with one EBS volume instead of EFS/FSx.',
                'Leaving rarely accessed data in S3 Standard rather than Intelligent-Tiering or Glacier classes.',
                'Picking io2 Block Express for a workload that gp3 serves fine, overpaying for IOPS you do not need.',
              ],
              exercises: [
                {
                  type: 'quiz',
                  prompt:
                    'A fleet of Linux app servers across three AZs must read and write the same content directory concurrently, scaling elastically. Which storage service?',
                  solution: {
                    explanation:
                      'Amazon EFS - a regional, elastic NFS file system mountable by many Linux instances across AZs at once. EBS is single-instance; FSx for Windows is for SMB/Windows.',
                  },
                },
                {
                  type: 'quiz',
                  prompt:
                    'A compliance team must store records that cannot be deleted or altered for seven years. Which S3 feature satisfies this?',
                  solution: {
                    explanation:
                      'S3 Object Lock in compliance mode (WORM), often combined with a retention period and versioning, prevents deletion or overwriting for the retention term.',
                  },
                },
                {
                  type: 'predict',
                  prompt:
                    'An HPC simulation needs hundreds of GB/s of throughput from a shared filesystem and reads its input from S3. Which file service fits, and what is the S3 advantage?',
                  solution: {
                    explanation:
                      'Amazon FSx for Lustre - it provides massive parallel throughput for HPC and integrates natively with S3, so it can lazily load input objects and write results back to the bucket.',
                  },
                },
              ],
              docs: 'https://docs.aws.amazon.com/whitepapers/latest/aws-overview/storage-services.html',
            },
          ],
        },
        {
          id: 'sap2-t1',
          name: 'Event-driven, serverless & decoupling',
          concepts: [
            {
              id: 'sap2-t1-c0',
              services: [
                { icon: 'sqs', label: 'Amazon SQS' },
                { icon: 'sns', label: 'Amazon SNS' },
                { icon: 'eventbridge', label: 'Amazon EventBridge' },
                { icon: 'kinesis', label: 'Amazon Kinesis' },
              ],
              title: 'Decoupling and event routing: SQS, SNS, EventBridge, Kinesis',
              summary:
                'Decouple producers from consumers with queues (SQS), fan out with pub/sub (SNS), route and filter events across services and SaaS (EventBridge), and process ordered high-throughput streams with replay (Kinesis) - choosing by ordering, fan-out, filtering and replay needs.',
              explanation:
                "Choosing the right integration primitive is a recurring Professional question. Amazon SQS is a durable pull-based queue that buffers work so a slow or failed consumer never blocks the producer; Standard queues give best-effort ordering and at-least-once delivery at near-unlimited throughput, FIFO queues give strict ordering and exactly-once processing within a message group. A dead-letter queue captures messages that repeatedly fail. Amazon SNS is push-based pub/sub: one publish fans out to many subscribers (SQS queues, Lambda, HTTP, email/SMS), and message filtering routes by attributes; the SNS-fronts-many-SQS-queues 'fan-out' pattern is canonical for parallel, independent processing. Amazon EventBridge is the event bus for routing: it matches event patterns to targets, decouples by content, integrates AWS services and dozens of SaaS sources, supports schema discovery, archives and replays events, and a scheduler - choose it when routing logic, filtering and many heterogeneous sources/targets matter. Amazon Kinesis Data Streams handles ordered, high-throughput streaming where multiple consumers need the same data and you may need to replay a retention window (up to 365 days) - clickstreams, telemetry, real-time analytics - whereas Firehose is for buffered delivery to stores. Rule of thumb: buffer/decouple → SQS; fan-out notification → SNS; route/filter heterogeneous events → EventBridge; ordered high-volume stream with replay/multiple readers → Kinesis.",
              analogy:
                'SQS is an inbox you process at your own pace; SNS is a broadcast to a mailing list; EventBridge is a smart mailroom that reads each letter and routes it to the right department by rules; Kinesis is a conveyor belt many stations read from and you can rewind.',
              keyPoints: [
                'SQS: durable pull queue that decouples and buffers; Standard (high throughput, at-least-once) vs FIFO (ordered, exactly-once); use DLQs for poison messages.',
                'SNS: push pub/sub fan-out to many subscribers with attribute-based message filtering.',
                'SNS-to-many-SQS fan-out: one event, multiple independent parallel consumers, each with its own backlog.',
                'EventBridge: content-based routing/filtering across AWS + SaaS, schema registry, archive/replay, scheduler - the choice when routing logic matters.',
                'Kinesis Data Streams: ordered, high-throughput, multi-consumer streaming with replay (retention up to 365 days); Firehose buffers and delivers to stores.',
              ],
              commonMistakes: [
                'Using SNS when you actually need durable buffering and retry isolation - that is SQS (often SNS+SQS together).',
                'Choosing SQS for an ordered, replayable, multi-reader stream where Kinesis is the right tool.',
                'Building custom routing logic in code instead of letting EventBridge rules filter and fan events out.',
              ],
              diagram: {
                type: 'mermaid',
                lines: [
                  'flowchart LR',
                  '  P[Producer] --> SNS[(SNS topic)]',
                  '  SNS --> Q1[[SQS: billing]]',
                  '  SNS --> Q2[[SQS: analytics]]',
                  '  SNS --> Q3[[SQS: search index]]',
                  '  Q1 --> C1[Worker]',
                  '  Q2 --> C2[Worker]',
                ],
                caption: 'SNS fan-out to multiple SQS queues: one event drives several independent, individually buffered consumers.',
              },
              exercises: [
                {
                  type: 'quiz',
                  prompt:
                    'An order event must trigger three independent subsystems (billing, fulfilment, analytics), each able to fail and retry without affecting the others. What pattern fits?',
                  solution: {
                    explanation:
                      'SNS fan-out to three SQS queues (one per subsystem). Each subsystem consumes its own queue with isolated retries and a dead-letter queue; failure in one does not block the others.',
                  },
                },
                {
                  type: 'quiz',
                  prompt:
                    'A payments pipeline requires strict per-customer ordering and that each message is processed exactly once. Which SQS option?',
                  solution: {
                    explanation:
                      'A FIFO queue, using the customer ID as the message group ID so ordering is preserved per customer with exactly-once processing.',
                  },
                },
                {
                  type: 'predict',
                  prompt:
                    'A clickstream feeds three analytics consumers, and the team occasionally needs to reprocess the last 24 hours after a bug fix. SQS or Kinesis?',
                  solution: {
                    explanation:
                      'Kinesis Data Streams - multiple consumers can read the same ordered records, and the retention window lets you replay the last 24 hours. SQS deletes messages after consumption and is not built for replay or multiple independent readers of the same data.',
                  },
                },
              ],
              docs: 'https://docs.aws.amazon.com/eventbridge/latest/userguide/eb-what-is.html',
            },
            {
              id: 'sap2-t1-c1',
              services: [
                { icon: 'lambda', label: 'AWS Lambda' },
                { icon: 'apigateway', label: 'Amazon API Gateway' },
                { icon: 'stepfunctions', label: 'AWS Step Functions' },
              ],
              title: 'Serverless application patterns and orchestration',
              summary:
                'Compose serverless apps from API Gateway (or HTTP API/AppSync) at the front, Lambda for logic, DynamoDB for state, and Step Functions for durable multi-step orchestration - applying concurrency controls, idempotency and saga patterns for reliability at scale.',
              explanation:
                "Serverless is not just Lambda; it is an architecture. A common shape: Amazon API Gateway (REST or the cheaper HTTP API, or AppSync for GraphQL) authenticates and throttles requests, invokes Lambda functions, which read/write DynamoDB and emit events. For workflows that span many steps, have branches, retries, human-approval waits, or long durations, AWS Step Functions is the orchestrator: it runs a state machine (Standard for long-running/durable, Express for high-volume short workflows), handles retries/catch, and avoids the anti-pattern of one giant Lambda calling another and another. At scale you must manage Lambda concurrency: account concurrency is shared, so set reserved concurrency to protect critical functions and provisioned concurrency to eliminate cold starts for latency-sensitive paths; pair with SQS to throttle a downstream that cannot keep up. Reliability patterns matter: design idempotent handlers (use idempotency keys) because at-least-once delivery means retries; use the saga pattern (a Step Functions workflow with compensating actions) for distributed transactions instead of trying to span a transaction across services; and put dead-letter queues / on-failure destinations on async invocations. AppConfig and parameter/secret integration externalise config. The exam rewards picking Step Functions for orchestration over chained Lambdas, and recognising when to insert a queue to smooth load.",
              keyPoints: [
                'Typical stack: API Gateway/AppSync → Lambda → DynamoDB, with events to SNS/SQS/EventBridge.',
                'Step Functions for multi-step, branching, retrying, long-running or human-in-the-loop workflows (Standard) and high-volume short flows (Express).',
                'Avoid Lambda-calling-Lambda chains; orchestrate with Step Functions instead.',
                'Concurrency: reserved concurrency protects/limits a function; provisioned concurrency removes cold starts for latency-critical paths.',
                'Design idempotent handlers (retries are expected); use the saga pattern with compensations for distributed transactions; add DLQs/on-failure destinations.',
              ],
              commonMistakes: [
                'Chaining Lambdas directly for a workflow instead of using Step Functions, losing visibility, retries and error handling.',
                'Ignoring shared account concurrency, so one runaway function starves critical functions of capacity.',
                'Assuming exactly-once delivery and writing non-idempotent handlers that double-process on retry.',
              ],
              diagram: {
                type: 'mermaid',
                lines: [
                  'flowchart LR',
                  '  API[API Gateway] --> Fn[Lambda: validate]',
                  '  Fn --> SF[Step Functions]',
                  '  SF --> Pay[Lambda: charge]',
                  '  SF --> Ship[Lambda: ship]',
                  '  SF --> Comp[Lambda: compensate on failure]',
                  '  Pay --> DDB[(DynamoDB)]',
                ],
                caption: 'A serverless order flow orchestrated by Step Functions, with a compensating step implementing the saga pattern.',
              },
              exercises: [
                {
                  type: 'quiz',
                  prompt:
                    'A serverless order process has five steps with conditional branches, retries, and a step that waits up to two days for manual approval. How should it be built?',
                  solution: {
                    explanation:
                      'A Step Functions Standard workflow orchestrating the Lambda steps, using built-in retry/catch, a Choice state for branching and a wait-for-task-token/callback pattern for the human approval. Chaining Lambdas directly would be fragile and could not wait two days.',
                  },
                },
                {
                  type: 'quiz',
                  prompt:
                    'A latency-critical API backed by Lambda suffers occasional 1-second cold starts that violate the SLA. What is the targeted fix?',
                  solution: {
                    explanation:
                      'Configure provisioned concurrency on the function (often with Application Auto Scaling) so a pool of initialised execution environments is always warm, eliminating cold starts on the critical path.',
                  },
                },
                {
                  type: 'predict',
                  prompt:
                    'A Lambda triggered by SQS occasionally processes the same payment twice after a retry. What design change prevents double charging?',
                  solution: {
                    explanation:
                      'Make the handler idempotent: derive an idempotency key (e.g. order ID) and record processed keys (e.g. in DynamoDB with a conditional write) so a repeated message is recognised and skipped. At-least-once delivery makes retries inevitable.',
                  },
                },
              ],
              docs: 'https://docs.aws.amazon.com/step-functions/latest/dg/welcome.html',
            },
          ],
        },
        {
          id: 'sap2-t2',
          name: 'Multi-Region HA & disaster recovery',
          concepts: [
            {
              id: 'sap2-t2-c0',
              services: [
                { icon: 'route53', label: 'Amazon Route 53' },
                { icon: 's3', label: 'Amazon S3' },
                { icon: 'aurora', label: 'Amazon Aurora' },
              ],
              title: 'DR strategies and matching them to RTO/RPO',
              summary:
                'Four DR strategies trade cost against recovery speed: Backup & Restore (cheapest, hours), Pilot Light (core running, fast scale-up), Warm Standby (scaled-down live copy), and Multi-Site Active/Active (highest cost, near-zero RTO/RPO) - choose by the required RTO and RPO.',
              explanation:
                "Two metrics drive every DR decision. RPO (recovery point objective) is how much data loss is tolerable - it dictates replication frequency. RTO (recovery time objective) is how long recovery may take - it dictates how much standby infrastructure runs. AWS frames four strategies along this cost/speed curve. Backup & Restore: take cross-Region backups (AWS Backup, snapshots, S3 cross-Region replication) and rebuild via infrastructure-as-code on disaster - cheapest, RPO hours, RTO hours; fine for non-critical or tolerant workloads. Pilot Light: keep the minimal core always replicating in the recovery Region (e.g. a replicated database and switched-off/AMI-ready app tier) and scale it up on failover - lower RTO, moderate cost. Warm Standby: run a fully functional but scaled-down copy continuously, then scale it to full size on failover - faster RTO, higher cost. Multi-Site Active/Active (hot standby): run full capacity in two or more Regions serving traffic simultaneously - near-zero RTO/RPO and the highest cost/complexity. Route 53 health checks and failover/latency/geo routing (or Global Accelerator) shift traffic; data layers use Aurora Global Database (sub-second cross-Region replication, fast promote), DynamoDB global tables (active-active), and S3 Cross-Region Replication. The Professional skill is reading the RTO/RPO in the scenario and picking the cheapest strategy that meets both - and remembering to test failover regularly.",
              analogy:
                'DR strategies are spare-tyre choices: Backup & Restore is a repair kit in the boot (cheap, slow). Pilot Light is a compact spare you must inflate. Warm Standby is a part-worn spare already on a rim. Active/Active is driving a second identical car alongside - instant but you pay for two cars.',
              keyPoints: [
                'RPO = tolerable data loss (drives replication frequency); RTO = tolerable downtime (drives how much standby runs).',
                'Backup & Restore: cheapest, RTO/RPO in hours - cross-Region backups + IaC rebuild.',
                'Pilot Light: core (DB) always on/replicating, app tier dormant; scale up on failover.',
                'Warm Standby: scaled-down full copy running continuously; scale to full on failover.',
                'Active/Active: full multi-Region capacity, near-zero RTO/RPO, highest cost; data via Aurora Global DB, DynamoDB global tables, S3 CRR; Route 53/Global Accelerator steer traffic. Test failover regularly.',
              ],
              commonMistakes: [
                'Designing active/active (and its cost) when the stated RTO/RPO of hours only needs Backup & Restore or Pilot Light.',
                'Confusing RPO (data loss) with RTO (downtime) and sizing the wrong dimension.',
                'Never testing failover, so the DR plan silently breaks (DNS TTLs, IAM, quotas in the second Region).',
              ],
              diagram: {
                type: 'mermaid',
                lines: [
                  'flowchart LR',
                  '  BR[Backup & Restore<br/>hours] --> PL[Pilot Light<br/>core warm]',
                  '  PL --> WS[Warm Standby<br/>scaled-down live]',
                  '  WS --> AA[Active/Active<br/>near-zero RTO/RPO]',
                  '  BR -.cost up, RTO down.-> AA',
                ],
                caption: 'The four DR strategies along the cost-versus-recovery-speed continuum.',
              },
              exercises: [
                {
                  type: 'quiz',
                  prompt:
                    'A workload must recover within 5 minutes with at most seconds of data loss across a Region outage, and budget is available. Which DR strategy and data services?',
                  solution: {
                    explanation:
                      'Multi-Site Active/Active (or hot warm standby) using Aurora Global Database / DynamoDB global tables for sub-second-lag, multi-Region data and Route 53 (or Global Accelerator) for fast traffic failover. Only active/active reliably meets a ~5-minute RTO with near-zero RPO.',
                  },
                },
                {
                  type: 'quiz',
                  prompt:
                    'An internal reporting app can tolerate several hours of downtime and a day of data loss after a disaster, and cost must be minimal. Which strategy?',
                  solution: {
                    explanation:
                      'Backup & Restore - cross-Region backups via AWS Backup plus infrastructure-as-code to rebuild in the recovery Region. It is the cheapest option and meets the relaxed RTO/RPO.',
                  },
                },
                {
                  type: 'task',
                  prompt:
                    'Explain the difference between Pilot Light and Warm Standby.',
                  solution: {
                    explanation:
                      'In Pilot Light only the core (e.g. the replicated database) runs continuously while the application tier is dormant and must be launched/scaled on failover. In Warm Standby a complete but scaled-down copy of the whole stack runs all the time and is simply scaled up, giving a faster RTO at higher steady-state cost.',
                  },
                },
              ],
              docs: 'https://docs.aws.amazon.com/whitepapers/latest/disaster-recovery-workloads-on-aws/disaster-recovery-options-in-the-cloud.html',
            },
            {
              id: 'sap2-t2-c1',
              services: [
                { icon: 'elb', label: 'Elastic Load Balancing' },
                { icon: 'autoscaling', label: 'EC2 Auto Scaling' },
                { icon: 'globalaccelerator', label: 'AWS Global Accelerator' },
              ],
              title: 'High availability, fault isolation and caching for scale',
              summary:
                'Build HA from multi-AZ redundancy behind load balancers and Auto Scaling, contain failures with cells/bulkheads and shuffle sharding, smooth global latency with CloudFront and Global Accelerator, and protect data stores with caching layers.',
              explanation:
                "High availability inside a Region means removing single points of failure: spread stateless tiers across at least two (ideally three) AZs behind an ALB/NLB with health checks, let Auto Scaling replace failed instances and follow demand, and use multi-AZ for stateful services (RDS Multi-AZ, ElastiCache replication, EFS). For graceful failure under partial outage, apply fault-isolation patterns: bulkheads/cell-based architecture partition users into independent cells so one cell's failure cannot take down everyone, and shuffle sharding assigns each customer a random subset of workers so a poison request degrades only a fraction. For global users, Amazon CloudFront caches content and terminates TLS at the edge while AWS Global Accelerator provides static anycast IPs and routes over the AWS backbone to the nearest healthy Regional endpoint (great for non-HTTP/TCP/UDP and fast regional failover without DNS TTL delays). To protect and scale data tiers, add caching: ElastiCache or DAX in front of databases for read-heavy workloads, CloudFront for static/edge content, and API Gateway caching for responses. Combine these with throttling, exponential backoff with jitter on retries, and circuit breakers so back-pressure does not cascade. The design instinct at Professional level: assume any component will fail, contain the blast radius, and make scaling and recovery automatic.",
              keyPoints: [
                'HA in-Region: stateless tiers across 2-3 AZs behind ALB/NLB + Auto Scaling; Multi-AZ for stateful (RDS/ElastiCache/EFS).',
                'Fault isolation: cell-based architecture/bulkheads and shuffle sharding limit blast radius from a bad request or noisy tenant.',
                'CloudFront caches/terminates at the edge; Global Accelerator gives anycast IPs + backbone routing and fast regional failover without DNS TTLs.',
                'Caching: ElastiCache/DAX in front of databases, CloudFront for content, API Gateway caching for responses - to scale reads and cut latency.',
                'Resilience hygiene: throttling, exponential backoff with jitter, and circuit breakers to stop cascading failure.',
              ],
              commonMistakes: [
                'Deploying across a single AZ and calling it highly available - HA needs at least two AZs.',
                'Relying solely on Route 53 DNS failover where TTL caching delays cutover; Global Accelerator failover is near-instant for many cases.',
                'Adding retries without backoff and jitter, amplifying load and causing retry storms during partial outages.',
              ],
              exercises: [
                {
                  type: 'quiz',
                  prompt:
                    'A read-heavy product catalogue causes high load on an Aurora cluster, and read latency spikes. What is a targeted scaling fix that also lowers cost?',
                  solution: {
                    explanation:
                      'Introduce a caching layer (Amazon ElastiCache for Redis) in front of the database for the hot reads, and/or add Aurora read replicas. Caching absorbs repeated reads, cutting database load and latency.',
                  },
                },
                {
                  type: 'quiz',
                  prompt:
                    'A global TCP-based game backend needs static entry-point IPs and the fastest possible failover between Regions, independent of client DNS caching. Which service?',
                  solution: {
                    explanation:
                      'AWS Global Accelerator - static anycast IPs, routing over the AWS backbone to the nearest healthy endpoint, with near-instant regional failover that does not depend on DNS TTLs.',
                  },
                },
                {
                  type: 'predict',
                  prompt:
                    'One misbehaving tenant repeatedly sends a request that crashes a worker, and it keeps landing on different workers until the whole fleet is unhealthy. What architectural pattern would have contained this?',
                  solution: {
                    explanation:
                      'Shuffle sharding (a form of cell-based isolation): assigning each tenant a fixed random subset of workers means the poison request only affects that tenant\'s small shard, leaving the rest of the fleet healthy.',
                  },
                },
              ],
              docs: 'https://docs.aws.amazon.com/wellarchitected/latest/reliability-pillar/welcome.html',
            },
          ],
        },
      ],
    },

    /* ──────────── DOMAIN 3 — CONTINUOUS IMPROVEMENT FOR EXISTING SOLUTIONS (25%) ──────────── */
    {
      level: 3,
      name: 'Continuous Improvement',
      focus:
        'Well-Architected reviews, observability and operational excellence, performance and cost optimisation, and improving the reliability and security of running workloads (Domain 3 · 25%)',
      accent: '#e8862a',
      soft: '#fff1e2',
      topics: [
        {
          id: 'sap3-t0',
          name: 'Well-Architected & operational excellence',
          concepts: [
            {
              id: 'sap3-t0-c0',
              services: [
                { icon: 'trustedadvisor', label: 'AWS Trusted Advisor' },
                { icon: 'management', label: 'Well-Architected Tool' },
              ],
              title: 'Well-Architected reviews and driving continuous improvement',
              summary:
                'Use the six-pillar Well-Architected Framework and the Well-Architected Tool to review workloads against best practice, then prioritise and track remediation - alongside Trusted Advisor and Compute Optimizer for ongoing, data-driven improvement.',
              explanation:
                "Domain 3 is about making an existing system better, methodically. The AWS Well-Architected Framework gives a structured review across six pillars - Operational Excellence, Security, Reliability, Performance Efficiency, Cost Optimization, and Sustainability - with pillar-specific questions and best practices, plus industry/technology Lenses (Serverless, SaaS, ML, etc.). The Well-Architected Tool records a workload review, surfaces high- and medium-risk issues, and lets you track improvements over time and re-review after changes. Continuous improvement also leans on data services: AWS Trusted Advisor continuously checks an account across cost, performance, security, fault tolerance and service limits (full checks need Business/Enterprise support); AWS Compute Optimizer analyses CloudWatch metrics to recommend right-sized EC2/EBS/Lambda/Auto Scaling configurations; Cost Optimization Hub and Cost Explorer rightsizing recommendations surface savings. The professional practice is a loop: review (Well-Architected), measure (CloudWatch/Trusted Advisor/Compute Optimizer), prioritise by risk and value, remediate (often via automation and IaC), then re-review - and prefer mechanisms (guardrails, automated remediation, runbooks) over one-off fixes so improvements stick.",
              analogy:
                'A Well-Architected review is an aircraft maintenance checklist: you do not wait for a crash, you systematically inspect each system (pillar), log the squawks (risks), fix by priority, and sign off - then repeat on schedule rather than once.',
              keyPoints: [
                'Six pillars: Operational Excellence, Security, Reliability, Performance Efficiency, Cost Optimization, Sustainability; Lenses add domain-specific guidance.',
                'Well-Architected Tool: record reviews, surface high/medium risks, track remediation and re-review after changes.',
                'Trusted Advisor: ongoing checks across cost, performance, security, fault tolerance, service limits (full set on Business/Enterprise).',
                'Compute Optimizer: ML-driven right-sizing for EC2, EBS, Lambda and ASGs from real metrics.',
                'Run a loop - review, measure, prioritise by risk/value, remediate via automation/IaC, re-review; favour durable mechanisms over one-off fixes.',
              ],
              commonMistakes: [
                'Treating Well-Architected as a one-time audit instead of a repeating, tracked improvement loop.',
                'Right-sizing by guesswork rather than Compute Optimizer/CloudWatch evidence.',
                'Fixing issues manually instead of building guardrails/automation so they cannot recur.',
              ],
              exercises: [
                {
                  type: 'quiz',
                  prompt:
                    'Leadership wants a structured, repeatable way to assess workloads against AWS best practices, identify high-risk gaps and track their remediation over time. What do you use?',
                  solution: {
                    explanation:
                      'The AWS Well-Architected Tool, running reviews against the six-pillar framework (plus relevant Lenses). It records risks, lets you prioritise, and supports re-reviews to track improvement.',
                  },
                },
                {
                  type: 'quiz',
                  prompt:
                    'A fleet of EC2 instances looks over-provisioned. Which service gives evidence-based right-sizing recommendations from actual utilisation?',
                  solution: {
                    explanation:
                      'AWS Compute Optimizer, which analyses CloudWatch utilisation metrics to recommend better instance types/sizes (and covers EBS, Lambda and Auto Scaling groups).',
                  },
                },
                {
                  type: 'task',
                  prompt:
                    'Name the six Well-Architected pillars.',
                  solution: {
                    explanation:
                      'Operational Excellence, Security, Reliability, Performance Efficiency, Cost Optimization, and Sustainability.',
                  },
                },
              ],
              docs: 'https://docs.aws.amazon.com/wellarchitected/latest/framework/welcome.html',
            },
            {
              id: 'sap3-t0-c1',
              services: [
                { icon: 'cloudformation', label: 'AWS CloudFormation' },
                { icon: 'systemsmanager', label: 'AWS Systems Manager' },
              ],
              title: 'Operational excellence: IaC, automation and safe deployments',
              summary:
                'Operate at scale with infrastructure as code (CloudFormation/CDK), fleet operations and automated remediation (Systems Manager), and safe deployment strategies (blue/green, canary) that reduce change risk and enable fast rollback.',
              explanation:
                "Operational excellence means making change cheap, safe and repeatable. Infrastructure as code (AWS CloudFormation, or the CDK that synthesises to it) defines environments declaratively so they are versioned, reviewable and reproducible; StackSets deploy the same stack across many accounts/Regions, and drift detection flags out-of-band changes. AWS Systems Manager operationalises the running fleet: Patch Manager for compliant patching, State Manager and Automation runbooks for self-healing remediation (often triggered by CloudWatch alarms or Config rules via EventBridge), Session Manager for keyless shell access (no bastion, fully logged), and Parameter Store for config. Safe deployment patterns cut the blast radius of change: blue/green keeps an idle parallel environment and flips traffic (instant rollback by flipping back), canary/linear release shifts a small percentage first and watches metrics before proceeding (native in CodeDeploy, Lambda aliases with weighted routing, and API Gateway/ALB), and feature flags (AppConfig) decouple release from deploy. Tie it together with CloudWatch alarms that auto-rollback a bad deployment. The Professional instinct: any fix or change should be codified and automated, and every deployment should have a tested, fast rollback path.",
              keyPoints: [
                'IaC (CloudFormation/CDK): versioned, repeatable environments; StackSets for multi-account/Region; drift detection catches manual changes.',
                'Systems Manager: Patch Manager, Automation runbooks for self-healing, Session Manager (keyless, logged access), Parameter Store config.',
                'Safe deploys: blue/green (instant rollback by traffic flip), canary/linear (shift a slice, watch metrics), feature flags via AppConfig.',
                'Auto-rollback deployments on CloudWatch alarm breaches; trigger remediation runbooks from alarms/Config via EventBridge.',
                'Codify and automate every change; always have a tested, fast rollback path.',
              ],
              commonMistakes: [
                'Making manual console changes that cause drift from the IaC source of truth.',
                'Using SSH bastions instead of Session Manager, adding attack surface and losing auditability.',
                'Deploying all-at-once with no canary/blue-green and no automated rollback, so a bad release takes everything down.',
              ],
              diagram: {
                type: 'mermaid',
                lines: [
                  'flowchart LR',
                  '  Code[IaC + app commit] --> Pipe[CI/CD pipeline]',
                  '  Pipe --> Canary[Canary 10%]',
                  '  Canary -->|metrics OK| Full[Shift 100%]',
                  '  Canary -->|alarm| RB[Auto rollback]',
                ],
                caption: 'A canary deployment shifts a small slice first and auto-rolls-back on alarm before promoting to 100%.',
              },
              exercises: [
                {
                  type: 'quiz',
                  prompt:
                    'A team needs keyless, fully audited shell access to private EC2 instances without opening SSH or running bastions. What do you use?',
                  solution: {
                    explanation:
                      'AWS Systems Manager Session Manager - it provides browser/CLI shell access via the SSM agent and IAM, with full session logging to CloudWatch/S3, and no inbound ports or bastion hosts.',
                  },
                },
                {
                  type: 'quiz',
                  prompt:
                    'The platform team must deploy an identical baseline stack to 40 accounts across two Regions and keep them consistent. Which capability?',
                  solution: {
                    explanation:
                      'CloudFormation StackSets, which deploy and manage the same stack across multiple accounts and Regions from a single operation, integrated with AWS Organizations.',
                  },
                },
                {
                  type: 'predict',
                  prompt:
                    'A new release causes a spike in 5xx errors two minutes after going live. With a canary deployment and CloudWatch alarms configured, what happens?',
                  solution: {
                    explanation:
                      'Only the small canary slice received traffic; the alarm on 5xx errors fires and CodeDeploy (or the pipeline) automatically rolls back to the previous version before the bad release reaches all users.',
                  },
                },
              ],
              docs: 'https://docs.aws.amazon.com/systems-manager/latest/userguide/what-is-systems-manager.html',
            },
          ],
        },
        {
          id: 'sap3-t1',
          name: 'Observability & monitoring',
          concepts: [
            {
              id: 'sap3-t1-c0',
              services: [
                { icon: 'cloudwatch', label: 'Amazon CloudWatch' },
                { icon: 'management', label: 'AWS X-Ray' },
              ],
              title: 'Observability: metrics, logs, traces and proactive alerting',
              summary:
                'Build observability from CloudWatch metrics/alarms/dashboards, centralised and queryable logs (Logs Insights, cross-account observability), distributed tracing (X-Ray/Application Signals), and synthetic + real-user monitoring to find and fix issues before users do.',
              explanation:
                "You cannot improve what you cannot see. Amazon CloudWatch is the backbone: standard and custom metrics (including high-resolution and the embedded metric format), alarms (static or anomaly-detection based) that notify via SNS or trigger Auto Scaling/automation, composite alarms to reduce noise, and dashboards. CloudWatch Logs centralises application/system logs; Logs Insights queries them at scale, metric filters turn log patterns into metrics, and subscription filters stream logs to Kinesis/Lambda/OpenSearch for analysis. At organisation scale, CloudWatch cross-account observability gives a single monitoring account a unified view of metrics, logs and traces across many source accounts. For distributed systems, AWS X-Ray (and CloudWatch Application Signals/ServiceLens) traces a request across services to expose latency and error hot-spots, and a service map visualises dependencies. Proactive monitoring adds CloudWatch Synthetics canaries (scripted checks that catch outages before customers report them) and RUM for real-user experience. Tie everything to actionable alerts (with runbooks) and avoid alert fatigue using composite and anomaly-detection alarms. The Professional answer often distinguishes the three pillars - metrics (what/how much), logs (detail/why), traces (where in the call graph) - and recognises that CloudTrail is the audit/who-did-what layer that complements them.",
              keyPoints: [
                'CloudWatch: standard/custom metrics, static and anomaly-detection alarms, composite alarms, dashboards; alarms can drive SNS, scaling and automation.',
                'Logs: centralise to CloudWatch Logs, query with Logs Insights, metric filters → alarms, subscription filters → Kinesis/OpenSearch.',
                'Cross-account observability: one monitoring account aggregates metrics/logs/traces from many source accounts.',
                'X-Ray / Application Signals: distributed tracing and service maps to locate latency and error hot-spots.',
                'Synthetics canaries and RUM catch issues proactively; CloudTrail provides the complementary API-audit layer.',
              ],
              commonMistakes: [
                'Confusing CloudWatch (performance/operational telemetry) with CloudTrail (API audit, who did what).',
                'Relying on basic metrics only and missing memory/disk on EC2, which need the CloudWatch agent.',
                'Drowning in noisy single-metric alarms instead of using composite/anomaly-detection alarms and tying alerts to runbooks.',
              ],
              exercises: [
                {
                  type: 'quiz',
                  prompt:
                    'A microservices app intermittently returns slow responses, and the team cannot tell which downstream service is the bottleneck. What gives them the answer?',
                  solution: {
                    explanation:
                      'AWS X-Ray (or CloudWatch Application Signals/ServiceLens) distributed tracing - it traces each request across services and produces a service map showing where latency and errors accumulate.',
                  },
                },
                {
                  type: 'quiz',
                  prompt:
                    'Security wants one account to see CloudWatch metrics, logs and traces from all 30 member accounts without logging into each. What feature delivers this?',
                  solution: {
                    explanation:
                      'CloudWatch cross-account observability - configure source accounts to share telemetry with a central monitoring account for a unified view.',
                  },
                },
                {
                  type: 'predict',
                  prompt:
                    'A public checkout page sometimes fails for users, but nothing fires in monitoring because backend metrics look fine. What proactive tool would have caught it first?',
                  solution: {
                    explanation:
                      'A CloudWatch Synthetics canary scripting the checkout flow on a schedule would have exercised the end-to-end path and alarmed on failure, catching the user-facing breakage before customers reported it.',
                  },
                },
              ],
              docs: 'https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/WhatIsCloudWatch.html',
            },
          ],
        },
        {
          id: 'sap3-t2',
          name: 'Performance & cost optimisation',
          concepts: [
            {
              id: 'sap3-t2-c0',
              services: [
                { icon: 'cloudfront', label: 'Amazon CloudFront' },
                { icon: 'elasticache', label: 'Amazon ElastiCache' },
                { icon: 'autoscaling', label: 'Auto Scaling' },
              ],
              title: 'Improving performance efficiency of running workloads',
              summary:
                'Raise performance by right-sizing and modernising instances (Graviton, gp3), caching at every layer (CloudFront, ElastiCache/DAX, API Gateway), scaling on the right signal (target tracking, predictive), and removing bottlenecks with read replicas, sharding and async processing.',
              explanation:
                "Performance improvement on an existing system is a sequence of targeted moves. First, measure with CloudWatch/X-Ray/Compute Optimizer to find the actual bottleneck rather than guessing. Right-size and modernise: move to current-generation and Graviton instances, gp3 EBS (independently tuned IOPS/throughput), and managed engines that scale (Aurora, DynamoDB). Add caching where reads repeat - CloudFront for static/edge content and even dynamic API responses, ElastiCache/DAX in front of databases, and API Gateway response caching - which simultaneously cuts latency and load. Scale on the correct signal: target-tracking scaling holds a metric (CPU, request count per target, custom) at a set point, step scaling for graduated response, scheduled scaling for known patterns, and predictive scaling for recurring daily/weekly cycles so capacity is ready before demand. Remove database bottlenecks with read replicas, connection pooling (RDS Proxy), partitioning/sharding, and offloading heavy work to asynchronous queues. For data movement, choose the right transport (S3 Transfer Acceleration, multipart upload) and place data near compute. Always weigh the change against cost - the goal is performance efficiency, not raw performance at any price.",
              keyPoints: [
                'Measure first (CloudWatch/X-Ray/Compute Optimizer); fix the real bottleneck, not a guessed one.',
                'Modernise: current-gen/Graviton instances, gp3 EBS, managed auto-scaling engines (Aurora, DynamoDB).',
                'Cache everywhere reads repeat: CloudFront (edge/content/dynamic), ElastiCache/DAX (DB), API Gateway response cache.',
                'Scale on the right signal: target-tracking, step, scheduled, and predictive scaling for recurring patterns.',
                'Relieve DB pressure with read replicas, RDS Proxy connection pooling, sharding, and async/queue offload.',
              ],
              commonMistakes: [
                'Scaling out the compute tier when the real bottleneck is the database or a missing cache.',
                'Using reactive scaling alone for predictable daily spikes where predictive/scheduled scaling avoids cold lag.',
                'Optimising raw performance while ignoring the cost impact - the pillar is performance efficiency.',
              ],
              exercises: [
                {
                  type: 'quiz',
                  prompt:
                    'A daily 9am traffic surge causes 10 minutes of degraded performance while Auto Scaling catches up. The pattern is highly predictable. What scaling improvement helps most?',
                  solution: {
                    explanation:
                      'Predictive scaling (or scheduled scaling) so capacity is provisioned ahead of the known 9am surge, eliminating the lag inherent in purely reactive target-tracking scaling.',
                  },
                },
                {
                  type: 'quiz',
                  prompt:
                    'A Lambda-heavy app exhausts RDS connections during spikes. What targeted fix addresses the connection bottleneck?',
                  solution: {
                    explanation:
                      'Amazon RDS Proxy - it pools and reuses database connections, smoothing the many short-lived Lambda connections and protecting the database from connection exhaustion during bursts.',
                  },
                },
                {
                  type: 'predict',
                  prompt:
                    'A globally accessed REST API has high latency for distant users even though the backend is fast. What change improves perceived performance?',
                  solution: {
                    explanation:
                      'Put Amazon CloudFront in front of the API (with appropriate caching of cacheable responses), terminating TLS and serving from edge locations near users; for non-cacheable dynamic calls, CloudFront still improves routing over the AWS backbone.',
                  },
                },
              ],
              docs: 'https://docs.aws.amazon.com/wellarchitected/latest/performance-efficiency-pillar/welcome.html',
            },
            {
              id: 'sap3-t2-c1',
              services: [
                { icon: 'costexplorer', label: 'AWS Cost Explorer' },
                { icon: 'budgets', label: 'AWS Budgets' },
                { icon: 's3', label: 'S3 Storage Lens' },
              ],
              title: 'Cost optimisation of existing workloads',
              summary:
                'Cut cost without harming the workload: right-size and use Graviton/Spot, commit with Savings Plans/RIs for steady usage, tier and lifecycle storage, eliminate idle/orphaned resources, and govern with tagging, budgets, anomaly detection and chargeback.',
              explanation:
                "Cost optimisation for a live workload follows pillars: right-size, choose the right pricing model, increase elasticity, match storage to access, and measure/attribute. Right-sizing (Compute Optimizer, Cost Explorer rightsizing) removes over-provisioned capacity; Graviton and current-gen instances improve price-performance; Spot serves interruptible work cheaply. For steady usage, commit with Compute Savings Plans (flexible across EC2/Fargate/Lambda) or Reserved Instances (RDS, ElastiCache, Redshift, OpenSearch) - the Savings Plan recommendations in Cost Explorer size the commitment. Increase elasticity by scaling in aggressively off-hours and stopping non-prod at night/weekends (Instance Scheduler). Storage: apply S3 lifecycle rules and Intelligent-Tiering, delete incomplete multipart uploads and old snapshots, move EBS to gp3, and use S3 Storage Lens for visibility. Eliminate waste: idle load balancers, unattached EIPs/EBS, idle RDS, orphaned snapshots, and over-retained logs - Trusted Advisor flags many of these. Govern with cost allocation tags, AWS Budgets (alerts on actual/forecast), Cost Anomaly Detection (ML alerts on unusual spend), and consolidated billing/chargeback so teams own their costs. The key Professional judgement: optimise without breaking SLAs - e.g. do not Spot a workload that cannot tolerate interruption, and size commitments to true steady-state baseline.",
              keyPoints: [
                'Right-size (Compute Optimizer), modernise to Graviton/current-gen, and use Spot for interruptible work.',
                'Commit for steady usage: Compute Savings Plans (EC2/Fargate/Lambda) and RIs (RDS/ElastiCache/Redshift/OpenSearch); size via Cost Explorer recommendations.',
                'Storage: S3 lifecycle + Intelligent-Tiering, gp3, delete orphaned snapshots/incomplete multipart uploads; use S3 Storage Lens.',
                'Eliminate idle/orphaned resources (EIPs, unattached EBS, idle LBs/RDS); Trusted Advisor surfaces many.',
                'Govern: cost allocation tags, Budgets (actual/forecast alerts), Cost Anomaly Detection, and chargeback via consolidated billing.',
              ],
              commonMistakes: [
                'Over-committing Savings Plans/RIs beyond true baseline, wasting the commitment on capacity you stop using.',
                'Putting interruption-sensitive workloads on Spot to save money and suffering outages.',
                'Leaving non-production environments running 24/7 instead of scheduling them off out-of-hours.',
              ],
              exercises: [
                {
                  type: 'quiz',
                  prompt:
                    'A finance team wants to be alerted automatically when daily spend deviates unusually from normal patterns, without setting fixed thresholds. Which tool?',
                  solution: {
                    explanation:
                      'AWS Cost Anomaly Detection - it uses machine learning to learn normal spend patterns and alerts on anomalous deviations, complementing fixed-threshold AWS Budgets.',
                  },
                },
                {
                  type: 'quiz',
                  prompt:
                    'A workload runs 24/7 at a steady baseline plus modest variable bursts. How do you minimise cost while keeping flexibility across EC2, Fargate and Lambda?',
                  solution: {
                    explanation:
                      'Cover the steady baseline with a Compute Savings Plan (flexible across EC2/Fargate/Lambda and Regions/families) and serve the variable burst with On-Demand or Spot. Size the commitment to the true baseline using Cost Explorer recommendations.',
                  },
                },
                {
                  type: 'task',
                  prompt:
                    'List four common sources of wasted spend an architect should hunt for in an existing account.',
                  solution: {
                    explanation:
                      'Unattached EBS volumes and old snapshots, idle/unused load balancers, unassociated Elastic IPs, idle or oversized RDS/EC2 instances, non-prod running out-of-hours, and rarely accessed data left in S3 Standard. Trusted Advisor flags many of these.',
                  },
                },
              ],
              docs: 'https://docs.aws.amazon.com/wellarchitected/latest/cost-optimization-pillar/welcome.html',
            },
          ],
        },
        {
          id: 'sap3-t3',
          name: 'Improving reliability & security',
          concepts: [
            {
              id: 'sap3-t3-c0',
              services: [
                { icon: 'backup', label: 'AWS Backup' },
                { icon: 'autoscaling', label: 'Auto Scaling' },
                { icon: 'management', label: 'AWS Resilience Hub' },
              ],
              title: 'Increasing resiliency of existing workloads',
              summary:
                'Improve reliability by removing single points of failure (multi-AZ, Auto Scaling self-healing), protecting data (centralised cross-Region backups, point-in-time recovery), validating recovery with Resilience Hub and fault injection, and adding graceful degradation.',
              explanation:
                "Hardening a running system is a Domain 3 staple. Start by removing single points of failure: convert single-AZ databases to RDS/Aurora Multi-AZ, spread stateless tiers across AZs behind a load balancer with Auto Scaling configured to replace unhealthy instances automatically (health-check driven self-healing), and replace any single NAT/instance chokepoints with redundant, multi-AZ equivalents. Protect data with a backup strategy: AWS Backup centralises policy-driven, cross-account and cross-Region backups across EBS, EFS, RDS, DynamoDB, S3 and more, with Backup Vault Lock for immutable, ransomware-resistant copies; enable point-in-time recovery (PITR) on DynamoDB and continuous backups on Aurora/RDS. Validate that recovery actually works: AWS Resilience Hub assesses a workload against defined RTO/RPO targets, identifies gaps, and recommends fixes; AWS Fault Injection Service runs controlled chaos experiments (kill instances, inject latency, fail an AZ) to prove resilience and exercise runbooks. Add graceful degradation - serve cached/stale data, shed non-critical load, and use circuit breakers so the system bends rather than breaks. The Professional mindset: assume failure, automate recovery, prove it with testing, and continuously close the gap to the stated RTO/RPO.",
              keyPoints: [
                'Remove SPOFs: Multi-AZ databases, multi-AZ stateless tiers behind LBs, Auto Scaling self-healing on health checks, redundant NAT.',
                'Protect data: AWS Backup for centralised cross-account/Region backups, Backup Vault Lock for immutability, PITR/continuous backups.',
                'Validate recovery: AWS Resilience Hub assesses against RTO/RPO; AWS Fault Injection Service runs controlled chaos experiments.',
                'Add graceful degradation: cached/stale responses, load shedding, circuit breakers so the system bends not breaks.',
                'Treat resilience as a tested, measured property - assume failure and automate recovery.',
              ],
              commonMistakes: [
                'Having backups but never testing restores, so RTO/RPO are unverified assumptions.',
                'Leaving a single-AZ database or single NAT gateway as a hidden single point of failure.',
                'Equating redundancy with resilience without chaos testing the actual failure and recovery paths.',
              ],
              exercises: [
                {
                  type: 'quiz',
                  prompt:
                    'An organisation needs centralised, policy-driven backups across EBS, RDS, DynamoDB and EFS in many accounts, copied to a second Region and protected against deletion by ransomware. What design?',
                  solution: {
                    explanation:
                      'AWS Backup with organisation-wide backup policies, cross-Region (and cross-account) copy, and Backup Vault Lock to make the backups immutable and ransomware-resistant.',
                  },
                },
                {
                  type: 'quiz',
                  prompt:
                    'A team claims their workload meets a 30-minute RTO but has never proven it. Which AWS services help assess and test this?',
                  solution: {
                    explanation:
                      'AWS Resilience Hub to assess the architecture against the 30-minute RTO/RPO target and flag gaps, and AWS Fault Injection Service to run controlled experiments (e.g. simulate an AZ failure) and confirm recovery within target.',
                  },
                },
                {
                  type: 'predict',
                  prompt:
                    'During an AZ outage, an application using RDS single-AZ goes completely down for an hour while a new instance is restored. What single change would have most reduced the outage?',
                  solution: {
                    explanation:
                      'Converting the database to RDS Multi-AZ, which keeps a synchronous standby in another AZ and fails over automatically in 1-2 minutes, instead of relying on a manual restore in a single AZ.',
                  },
                },
              ],
              docs: 'https://docs.aws.amazon.com/aws-backup/latest/devguide/whatisbackup.html',
            },
            {
              id: 'sap3-t3-c1',
              services: [
                { icon: 'kms', label: 'AWS KMS' },
                { icon: 'waf', label: 'AWS WAF' },
                { icon: 'secretsmanager', label: 'AWS Secrets Manager' },
              ],
              title: 'Strengthening security and data protection over time',
              summary:
                'Continuously raise the security baseline: enforce encryption (KMS, TLS), protect the edge (WAF, Shield Advanced, CloudFront), automate secret rotation (Secrets Manager), and tighten access with least-privilege analysis (IAM Access Analyzer) and automated remediation.',
              explanation:
                "Security improvement is ongoing, not a launch gate. Encryption: enforce at rest with AWS KMS (customer-managed keys for control and rotation, with grants and key policies), and require it via SCPs/Config rules; encrypt in transit with TLS everywhere (ACM-issued certificates on ALB/CloudFront/API Gateway). Edge protection: AWS WAF filters Layer-7 attacks (SQLi, XSS, bots) with managed rule groups and rate-based rules, AWS Shield Advanced adds DDoS protection with cost-protection and a response team, and CloudFront/Global Accelerator absorb and distribute attack traffic. Secrets and credentials: store and automatically rotate database and API credentials in AWS Secrets Manager (or Parameter Store for plain config), and eliminate long-lived IAM keys in favour of roles and short-lived credentials. Least privilege over time: IAM Access Analyzer identifies resources shared externally and generates least-privilege policies from CloudTrail usage; periodically review with access advisor and remove unused permissions. Automate response: Config rules + SSM Automation, EventBridge + Lambda, and GuardDuty findings can trigger automatic remediation (e.g. isolate a compromised instance, revoke a leaked key). The improvement loop mirrors operations: detect (GuardDuty/Security Hub/Config), prioritise, remediate automatically, and prevent recurrence with guardrails.",
              keyPoints: [
                'Encryption: KMS customer-managed keys at rest (rotation, key policies, grants); enforce with SCP/Config; TLS in transit via ACM everywhere.',
                'Edge: WAF (managed + rate-based rules) for Layer-7, Shield Advanced for DDoS + cost protection, CloudFront to absorb/distribute.',
                'Secrets Manager for stored credentials with automatic rotation; replace long-lived IAM keys with roles/short-lived credentials.',
                'IAM Access Analyzer finds external exposure and generates least-privilege policies from real usage; prune unused permissions.',
                'Automate remediation from GuardDuty/Config/Security Hub findings (EventBridge + SSM Automation/Lambda); prevent recurrence with guardrails.',
              ],
              commonMistakes: [
                'Hard-coding or storing static credentials instead of using Secrets Manager rotation and IAM roles.',
                'Relying on WAF alone against large volumetric DDoS where Shield Advanced and edge distribution are needed.',
                'Granting broad permissions and never pruning - use Access Analyzer and access advisor to right-size over time.',
              ],
              exercises: [
                {
                  type: 'quiz',
                  prompt:
                    'A public API behind an ALB is being hit with SQL-injection attempts and credential-stuffing bursts from many IPs. Which combination hardens it?',
                  solution: {
                    explanation:
                      'AWS WAF on the ALB/CloudFront with managed rule groups (for SQLi/XSS) and rate-based rules to throttle abusive sources, plus AWS Shield Advanced if large DDoS protection and cost protection are required.',
                  },
                },
                {
                  type: 'quiz',
                  prompt:
                    'Auditors require database passwords to rotate automatically every 30 days with no human handling the secret. What service?',
                  solution: {
                    explanation:
                      'AWS Secrets Manager, which stores the credential and rotates it on a schedule via a rotation Lambda, with applications retrieving it at runtime through IAM-controlled access.',
                  },
                },
                {
                  type: 'predict',
                  prompt:
                    'GuardDuty raises a finding that an EC2 instance is communicating with a known malicious host. How can the environment respond automatically?',
                  solution: {
                    explanation:
                      'An EventBridge rule on the GuardDuty finding triggers an SSM Automation runbook or Lambda that isolates the instance (e.g. swaps it to a quarantine security group, snapshots it for forensics, and notifies the security team) - automated remediation without waiting for a human.',
                  },
                },
              ],
              docs: 'https://docs.aws.amazon.com/wellarchitected/latest/security-pillar/welcome.html',
            },
          ],
        },
      ],
    },

    /* ──────── DOMAIN 4 — ACCELERATE WORKLOAD MIGRATION AND MODERNIZATION (20%) ──────── */
    {
      level: 4,
      name: 'Migration & Modernization',
      focus:
        'Planning migrations, the 6 Rs, migration and data-transfer tooling (MGN, DMS, DataSync, Snow Family, Migration Hub), and modernising monoliths to containers and serverless (Domain 4 · 20%)',
      accent: '#1ba85a',
      soft: '#e6f7ee',
      topics: [
        {
          id: 'sap4-t0',
          name: 'Migration planning & the 6 Rs',
          concepts: [
            {
              id: 'sap4-t0-c0',
              services: [{ icon: 'management', label: 'AWS Migration Hub' }],
              title: 'Migration strategy: the 6 Rs and portfolio planning',
              summary:
                'Plan a migration by assessing the portfolio (discovery), then assigning each application one of the 6 Rs - Rehost, Replatform, Repurchase, Refactor, Retain, Retire - balancing effort, risk, cost and the value of modernisation.',
              explanation:
                "Large migrations succeed or fail on planning. The accepted approach has phases: assess (business case, readiness), mobilise (build a landing zone, pilot, refine), and migrate & modernise (execute in waves). Discovery feeds this: AWS Application Discovery Service (agent-based or agentless) and Migration Evaluator gather inventory, dependencies and utilisation, surfaced in AWS Migration Hub, which tracks progress across tools and accounts in one place. Each application is then assigned a strategy - the 6 Rs. Rehost ('lift and shift') moves the app as-is, usually with AWS Application Migration Service (MGN) - fastest, lowest risk, least cloud benefit. Replatform ('lift, tinker and shift') makes a few optimisations without changing core architecture, e.g. moving a self-managed database to RDS or containers without code rewrites. Repurchase ('drop and shop') replaces the app with a SaaS/marketplace product (e.g. moving to a hosted CRM). Refactor/re-architect rewrites the app to be cloud-native (microservices, serverless) - highest effort and cost but greatest long-term agility. Retain ('revisit') keeps an app on-prem for now (compliance, recent investment, soon-to-retire). Retire decommissions what is no longer needed (often 10-20% of a portfolio). The Professional judgement is choosing the right R per app: default to Rehost for speed when modernisation value is low, and reserve Refactor for high-value apps where the cloud-native payoff justifies the cost.",
              analogy:
                'Moving house with a mixed inventory: some furniture you move as-is (rehost), some you tweak to fit the new place (replatform), some you replace by buying new (repurchase), some you rebuild bespoke (refactor), some you leave at the old place for now (retain), and some you throw away (retire).',
              keyPoints: [
                'Phases: Assess → Mobilise → Migrate & Modernise, executed in waves; discovery via Application Discovery Service / Migration Evaluator, tracked in Migration Hub.',
                'Rehost (lift-and-shift, via MGN): fastest/lowest risk, least cloud benefit.',
                'Replatform: small optimisations (e.g. DB → RDS) without rearchitecting; Repurchase: replace with SaaS.',
                'Refactor: rewrite cloud-native (microservices/serverless) - highest effort, greatest long-term value.',
                'Retain: keep on-prem for now; Retire: decommission unused apps (commonly 10-20% of a portfolio).',
              ],
              commonMistakes: [
                'Refactoring everything up front - it is slow and costly; rehost first for speed, modernise high-value apps later.',
                'Skipping discovery, so dependencies are missed and migration waves break.',
                'Forgetting to identify Retire candidates, paying to migrate apps nobody uses.',
              ],
              diagram: {
                type: 'mermaid',
                lines: [
                  'flowchart TB',
                  '  App{App assessment} --> Re[Rehost - lift & shift]',
                  '  App --> Rp[Replatform - tweak]',
                  '  App --> Pu[Repurchase - SaaS]',
                  '  App --> Rf[Refactor - cloud-native]',
                  '  App --> Rt[Retain - keep on-prem]',
                  '  App --> Rd[Retire - decommission]',
                ],
                caption: 'The 6 Rs: each application in the portfolio is assigned one migration strategy.',
              },
              exercises: [
                {
                  type: 'quiz',
                  prompt:
                    'A company must exit its data centre in four months and has 300 mostly standard apps. Leadership wants speed and low risk first, modernisation later. Which strategy dominates the first wave, and with which tool?',
                  solution: {
                    explanation:
                      'Rehost (lift-and-shift) for the bulk of standard apps, using AWS Application Migration Service (MGN) to replicate and cut over quickly. Modernisation (replatform/refactor) is deferred to later phases once they are running on AWS.',
                  },
                },
                {
                  type: 'quiz',
                  prompt:
                    'An on-prem app runs on a self-managed MySQL database. The team wants AWS to manage the database during migration but does not want to rewrite the application. Which R?',
                  solution: {
                    explanation:
                      'Replatform - move the database to Amazon RDS (or Aurora) for managed operations while leaving the application code essentially unchanged.',
                  },
                },
                {
                  type: 'task',
                  prompt:
                    'Which AWS service gives a single view of migration progress across discovery and migration tools?',
                  solution: {
                    explanation:
                      'AWS Migration Hub, which centralises discovery data and migration status across tools and accounts.',
                  },
                },
              ],
              docs: 'https://docs.aws.amazon.com/prescriptive-guidance/latest/migration-retiring-applications/apg-6-rs.html',
            },
          ],
        },
        {
          id: 'sap4-t1',
          name: 'Server & database migration tooling',
          concepts: [
            {
              id: 'sap4-t1-c0',
              services: [{ icon: 'management', label: 'AWS Application Migration Service' }],
              title: 'Rehosting with AWS Application Migration Service (MGN)',
              summary:
                'AWS Application Migration Service (MGN) is the primary lift-and-shift tool: it continuously block-level replicates source servers into a staging area, then launches them as EC2 instances with minimal cutover downtime.',
              explanation:
                "MGN (the successor to CloudEndure Migration and SMS) is how you rehost physical, virtual or cloud servers at scale. You install a lightweight replication agent on each source server; MGN continuously replicates the server's disks block-by-block into a low-cost staging subnet in AWS, keeping it in sync with near-zero impact. When you are ready, you launch a test instance to validate without touching the source, then perform the final cutover - because data is already synchronised, cutover downtime is short (minutes). MGN handles the machine conversion (drivers, boot) so the workload boots natively on EC2, and post-launch automation (and integration with SSM) can run modernisation actions during launch. It supports large waves and is the recommended default for rehosting; it preserves the existing OS and application, which is exactly why rehost is fast but yields limited cloud-native benefit until you modernise later. For migrating specific workloads with their own tools, alternatives exist (e.g. VMware HCX, native database tools), but for general server rehosting at scale, MGN is the exam's expected answer.",
              analogy:
                'MGN is like continuously mirroring your running laptop to a spare in another city: the spare stays up to date in the background, and when you are ready you just power it on and switch over - barely any interruption.',
              keyPoints: [
                'MGN = primary rehost/lift-and-shift tool (successor to CloudEndure/SMS) for physical, virtual and cloud servers.',
                'Lightweight agent does continuous block-level replication into a low-cost staging area, kept in sync.',
                'Test launches validate without disrupting the source; final cutover downtime is minutes because data is pre-synced.',
                'Performs machine conversion so workloads boot natively on EC2; supports large migration waves.',
                'Preserves OS/app (limited immediate cloud-native benefit) - modernise after landing.',
              ],
              commonMistakes: [
                'Reaching for DMS to migrate whole servers - DMS migrates databases; MGN migrates servers.',
                'Expecting cloud-native benefits from a rehost alone before any modernisation.',
                'Skipping the test launch and going straight to cutover, missing boot/driver issues.',
              ],
              exercises: [
                {
                  type: 'quiz',
                  prompt:
                    'A company must migrate 200 on-prem VMs to EC2 with minimal cutover downtime and the least re-engineering. Which service and approach?',
                  solution: {
                    explanation:
                      'AWS Application Migration Service (MGN): install agents, let it continuously replicate the VMs into a staging area, test-launch to validate, then cut over with only minutes of downtime since the data is already synchronised. This is a rehost (lift-and-shift).',
                  },
                },
                {
                  type: 'predict',
                  prompt:
                    'After a successful MGN rehost, the team is disappointed that costs and architecture are similar to on-prem. Why, and what is the next step?',
                  solution: {
                    explanation:
                      'Rehosting preserves the existing OS and architecture, so it delivers speed and risk reduction but limited cloud-native benefit. The next step is modernisation - replatform (e.g. databases to RDS) or refactor high-value apps to containers/serverless - now that they run on AWS.',
                  },
                },
                {
                  type: 'task',
                  prompt:
                    'Why is MGN cutover downtime so short compared with a one-time copy migration?',
                  solution: {
                    explanation:
                      'Because MGN replicates continuously and keeps the staging copy in near-real-time sync, the final cutover only has to apply the last small delta and boot the converted instance - minutes, rather than the hours/days a full copy would take.',
                  },
                },
              ],
              docs: 'https://docs.aws.amazon.com/mgn/latest/ug/what-is-application-migration-service.html',
            },
            {
              id: 'sap4-t1-c1',
              services: [{ icon: 'database', label: 'AWS DMS' }],
              title: 'Database migration with DMS and the Schema Conversion Tool',
              summary:
                'AWS Database Migration Service migrates databases with minimal downtime via full load plus continuous change data capture (CDC); the Schema Conversion Tool (SCT) converts schemas and code for heterogeneous (engine-changing) migrations.',
              explanation:
                "Databases need their own tooling. AWS DMS replicates data from a source to a target database while the source stays operational: it performs an initial full load and then uses change data capture (CDC) to replicate ongoing changes, so you can keep replicating until you are ready to cut over with minimal downtime. DMS supports homogeneous migrations (same engine, e.g. Oracle → Oracle, or on-prem MySQL → RDS MySQL) and heterogeneous migrations (different engines, e.g. Oracle → Aurora PostgreSQL). For heterogeneous moves, the schema, stored procedures and application SQL differ, so you first run the AWS Schema Conversion Tool (SCT) - now part of DMS Schema Conversion - to convert the schema and code, flag what cannot be converted automatically for manual fixes, then use DMS to move the data. DMS can also continuously replicate into analytics targets (S3, Redshift, Kinesis) for ongoing feeds, not just one-off migrations. It runs on replication instances you size to the load. The exam distinguishes: same-engine move → DMS alone; engine change → SCT (schema/code) + DMS (data); whole-server move → MGN, not DMS.",
              analogy:
                'DMS is a removal service that keeps copying your belongings to the new house while you still live in the old one (full load + CDC), so moving day is quick. SCT is the translator you hire first when the new house uses a different electrical standard - it rewires plugs (schema/code) before the furniture arrives.',
              keyPoints: [
                'DMS migrates data with minimal downtime: initial full load + ongoing change data capture (CDC) until cutover.',
                'Homogeneous (same engine) → DMS alone; heterogeneous (engine change) → SCT to convert schema/code, then DMS for data.',
                'SCT (DMS Schema Conversion) flags objects it cannot auto-convert for manual remediation.',
                'DMS can also feed analytics targets continuously (S3, Redshift, Kinesis), not only migrations.',
                'DMS migrates databases; use MGN for whole-server migrations.',
              ],
              commonMistakes: [
                'Trying a heterogeneous migration with DMS alone and ignoring schema/stored-procedure conversion (that needs SCT).',
                'Assuming DMS migrates the server/OS - it only moves data between databases.',
                'Cutting over before CDC has caught up, losing in-flight changes.',
              ],
              diagram: {
                type: 'mermaid',
                lines: [
                  'flowchart LR',
                  '  Src[(Source Oracle)] --> SCT[SCT: convert schema/code]',
                  '  SCT --> Tgt[(Aurora PostgreSQL)]',
                  '  Src --> DMS[DMS full load + CDC]',
                  '  DMS --> Tgt',
                ],
                caption: 'Heterogeneous migration: SCT converts the schema/code while DMS moves and continuously replicates the data.',
              },
              exercises: [
                {
                  type: 'quiz',
                  prompt:
                    'A company wants to migrate an on-prem Oracle database to Amazon Aurora PostgreSQL with minimal downtime. Which tools and in what order?',
                  solution: {
                    explanation:
                      'First use the AWS Schema Conversion Tool (SCT/DMS Schema Conversion) to convert the Oracle schema and stored procedures to PostgreSQL, fixing flagged items manually; then use AWS DMS (full load + CDC) to migrate and continuously replicate the data until a low-downtime cutover.',
                  },
                },
                {
                  type: 'quiz',
                  prompt:
                    'An on-prem MySQL database must move to Amazon RDS for MySQL with near-zero downtime, same engine. Which service is sufficient on its own?',
                  solution: {
                    explanation:
                      'AWS DMS alone - it is a homogeneous migration, so no schema conversion is needed; DMS does a full load then CDC to keep the target in sync until cutover.',
                  },
                },
                {
                  type: 'predict',
                  prompt:
                    'A team uses DMS to keep an analytics copy of their production database in S3 long after the initial migration. Is this a supported use?',
                  solution: {
                    explanation:
                      'Yes. DMS supports ongoing replication via CDC into targets like S3, Redshift and Kinesis, so it can continuously feed an analytics store, not just perform a one-time migration.',
                  },
                },
              ],
              docs: 'https://docs.aws.amazon.com/dms/latest/userguide/Welcome.html',
            },
          ],
        },
        {
          id: 'sap4-t2',
          name: 'Large-scale data transfer',
          concepts: [
            {
              id: 'sap4-t2-c0',
              services: [
                { icon: 'storagegateway', label: 'AWS DataSync' },
                { icon: 'snowball', label: 'AWS Snow Family' },
                { icon: 'storagegateway', label: 'Storage Gateway' },
              ],
              title: 'Moving data at scale: DataSync, Snow Family, Storage Gateway',
              summary:
                'Choose the transfer mechanism by data size and link speed: DataSync for fast, scheduled online transfer over the network; Snow Family for offline physical transfer when the network is too slow; Storage Gateway for ongoing hybrid access during and after migration.',
              explanation:
                "Getting terabytes-to-petabytes of data into AWS is a recurring scenario, and the right answer depends on volume versus available bandwidth and whether the need is one-off or ongoing. AWS DataSync is a managed, accelerated online transfer service that moves data between on-prem (NFS, SMB, HDFS, object stores) and AWS storage (S3, EFS, FSx) up to ~10x faster than open-source tools, with encryption, integrity checks, scheduling and incremental transfers - ideal when you have adequate bandwidth and want repeatable, automated movement. The AWS Snow Family ships physical, encrypted, rugged devices when transferring over the network would take too long or is impractical: Snowball Edge (Storage Optimized and Compute Optimized, tens of TB to ~80 TB usable, with optional edge compute) for large datasets and edge processing, and Snowcone for small/edge cases (Snowmobile, the exabyte truck, has been retired from new use - for very large volumes you order multiple Snowball devices). A practical rule of thumb: if transferring online would take more than about a week, evaluate Snow. AWS Storage Gateway provides ongoing hybrid access - File Gateway (S3-backed NFS/SMB), Volume Gateway, and Tape Gateway - useful when on-prem systems must keep reading/writing AWS-backed storage during a phased migration or permanently. Decision: enough bandwidth and online/recurring → DataSync; too much data for the link → Snow Family; continued hybrid file/tape access → Storage Gateway.",
              analogy:
                'Sending a huge dataset is like shipping a library: DataSync is express courier over the network (fast if the roads are clear); Snow Family is loading it into a truck when there are simply too many books for any courier; Storage Gateway is a permanent shuttle that keeps the branch library and the central one in sync.',
              keyPoints: [
                'DataSync: managed, accelerated, scheduled online transfer (NFS/SMB/HDFS/object → S3/EFS/FSx) with encryption and integrity checks; best with adequate bandwidth.',
                'Snow Family: offline physical transfer when the network is too slow/impractical; Snowball Edge (with optional edge compute), Snowcone for small/edge.',
                'Rule of thumb: if online transfer would take more than ~a week, evaluate Snow.',
                'Storage Gateway: ongoing hybrid access (File/Volume/Tape) during and after migration.',
                'Decide by data size vs link speed and one-off vs ongoing need.',
              ],
              commonMistakes: [
                'Ordering a Snow device when DataSync over the existing link would finish in hours - or vice versa for petabytes on a thin pipe.',
                'Confusing DataSync (bulk migration/transfer) with Storage Gateway (ongoing hybrid access).',
                'Forgetting Snowball Edge can also do local compute/processing at the edge, not just transfer.',
              ],
              diagram: {
                type: 'mermaid',
                lines: [
                  'flowchart TB',
                  '  Q{Data vs bandwidth?}',
                  '  Q -->|fits over network| DS[DataSync online]',
                  '  Q -->|too big for link| SN[Snow Family offline]',
                  '  Q -->|ongoing hybrid access| SG[Storage Gateway]',
                  '  DS --> S3[(S3 / EFS / FSx)]',
                  '  SN --> S3',
                ],
                caption: 'Selecting a data-transfer mechanism by data volume, link speed and whether access must continue.',
              },
              exercises: [
                {
                  type: 'quiz',
                  prompt:
                    'A media company must move 500 TB to S3, but its internet link would take roughly five months to transfer that volume. What should the architect recommend?',
                  solution: {
                    explanation:
                      'The AWS Snow Family (multiple Snowball Edge devices) for offline physical transfer - the network would take far too long, which is exactly the case Snow is designed for.',
                  },
                },
                {
                  type: 'quiz',
                  prompt:
                    'A company needs to copy 20 TB nightly from an on-prem NFS share to S3 over a fast, underused 10 Gbps link, automatically and incrementally. Which service?',
                  solution: {
                    explanation:
                      'AWS DataSync - it provides accelerated, scheduled, incremental online transfers from NFS to S3 with integrity verification, which suits a recurring nightly job over ample bandwidth.',
                  },
                },
                {
                  type: 'predict',
                  prompt:
                    'During a phased migration, on-prem applications must keep reading and writing files that are actually stored in S3, with a local cache for low latency. Which service fits?',
                  solution: {
                    explanation:
                      'AWS Storage Gateway (File Gateway) - it presents an NFS/SMB interface locally, caches hot data, and backs the files with S3, letting on-prem apps keep working against AWS-backed storage during the migration.',
                  },
                },
              ],
              docs: 'https://docs.aws.amazon.com/datasync/latest/userguide/what-is-datasync.html',
            },
          ],
        },
        {
          id: 'sap4-t3',
          name: 'Modernization & refactoring',
          concepts: [
            {
              id: 'sap4-t3-c0',
              services: [
                { icon: 'ecs', label: 'Amazon ECS' },
                { icon: 'fargate', label: 'AWS Fargate' },
                { icon: 'lambda', label: 'AWS Lambda' },
              ],
              title: 'Refactoring monoliths to microservices, containers and serverless',
              summary:
                'Decompose monoliths incrementally with the strangler-fig pattern, routing slices of traffic to new microservices on containers (ECS/EKS/Fargate) or serverless (Lambda/API Gateway/Step Functions), while decoupling data and using events to integrate.',
              explanation:
                "Modernisation turns a migrated monolith into something cloud-native, but the Professional skill is doing it safely and incrementally, not in a risky big-bang rewrite. The strangler-fig pattern is the standard approach: put a routing layer (API Gateway, ALB, or a proxy) in front of the monolith and progressively carve out functionality into new services, redirecting just those routes to the new implementation while the rest stays on the monolith - over time the new system strangles the old one until it can be retired. Target platforms depend on the workload: containers (ECS or EKS, with Fargate to avoid managing instances) suit services that need long-running processes, custom runtimes, or portability; serverless (Lambda + API Gateway + Step Functions + DynamoDB) suits event-driven, spiky, or low-ops services and gives the best scale-to-zero economics. Decouple the data layer too - move each service toward owning its own data store (database-per-service) and integrate through events (EventBridge/SQS/SNS) rather than shared databases, applying patterns like CQRS and event sourcing where they fit. Use AWS App2Container to containerise existing Java/.NET apps, and AWS App Runner for the simplest path to run a container service. Throughout, keep deployments safe (canary/blue-green) and observable (X-Ray) so each extracted service can be validated before more traffic shifts. The trade-off: refactoring costs the most effort but unlocks elasticity, independent deployment, and lower long-term operations - reserve it for high-value workloads.",
              analogy:
                'The strangler fig grows around a host tree, gradually replacing it until the original is gone. You wrap the monolith in a router and grow new microservices around it one branch at a time, so the system keeps running and you can stop any time without a risky overnight rewrite.',
              keyPoints: [
                'Strangler-fig pattern: front the monolith with a router and incrementally redirect slices of functionality to new services - no big-bang rewrite.',
                'Containers (ECS/EKS, Fargate to skip instances) for long-running/portable services; serverless (Lambda/API Gateway/Step Functions) for event-driven, spiky, low-ops.',
                'Decouple data: database-per-service, integrate via events (EventBridge/SQS/SNS); apply CQRS/event sourcing where useful.',
                'Tools: App2Container to containerise existing Java/.NET apps; App Runner for the simplest container service.',
                'Refactor is the highest-effort R - reserve it for high-value workloads; keep deployments safe (canary/blue-green) and observable.',
              ],
              commonMistakes: [
                'Attempting a big-bang monolith rewrite instead of incremental strangler-fig extraction, incurring huge risk.',
                'Splitting services but keeping one shared database, recreating tight coupling and a single point of failure.',
                'Refactoring low-value apps where a rehost/replatform would have been cheaper and sufficient.',
              ],
              diagram: {
                type: 'mermaid',
                lines: [
                  'flowchart LR',
                  '  U[Users] --> R[Router / API Gateway]',
                  '  R -->|legacy routes| Mono[Monolith]',
                  '  R -->|/orders| Svc1[Orders svc on Fargate]',
                  '  R -->|/pricing| Svc2[Pricing on Lambda]',
                  '  Svc1 --> EB[(EventBridge)]',
                  '  Svc2 --> EB',
                ],
                caption: 'Strangler-fig: a router sends new routes to extracted microservices while remaining traffic still hits the monolith.',
              },
              exercises: [
                {
                  type: 'quiz',
                  prompt:
                    'A team must modernise a large monolith into microservices but cannot risk a long outage or a failed big-bang cutover. What pattern and front-door do you recommend?',
                  solution: {
                    explanation:
                      'The strangler-fig pattern: place API Gateway (or an ALB/proxy) in front of the monolith and incrementally route individual capabilities to new microservices (on Fargate or Lambda), validating each before shifting more traffic, until the monolith can be retired.',
                  },
                },
                {
                  type: 'quiz',
                  prompt:
                    'An extracted service is event-driven, runs in short bursts, and the team wants no servers to manage and scale-to-zero economics. Which target platform?',
                  solution: {
                    explanation:
                      'Serverless - AWS Lambda (fronted by API Gateway, orchestrated with Step Functions where needed, with DynamoDB for state). It scales automatically, costs nothing when idle, and removes server management.',
                  },
                },
                {
                  type: 'predict',
                  prompt:
                    'After breaking a monolith into five microservices that all still read and write one shared relational database, the team finds deployments are still coupled and the DB is a bottleneck. What modernisation step was missed?',
                  solution: {
                    explanation:
                      'Decoupling the data layer. Each service should own its data (database-per-service) and integrate through events (EventBridge/SQS/SNS) instead of sharing one database, which otherwise recreates tight coupling and a single point of failure.',
                  },
                },
              ],
              docs: 'https://docs.aws.amazon.com/prescriptive-guidance/latest/modernization-decomposing-monoliths/strangler-fig.html',
            },
          ],
        },
      ],
    },
  ],
};

export default content;
