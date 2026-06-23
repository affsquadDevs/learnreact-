// AWS Certified Security - Specialty - course content.
// Deep, exam-aligned coverage of the AWS Certified Security - Specialty (SCS-C02)
// certification, organised into the six official exam domains. The factual material
// (service names and what they do) is rewritten in our own words for self-study;
// diagrams and policy snippets are our own creations. Not affiliated with or endorsed by AWS.
//
// Exam domains & weightings (SCS-C02):
//   1. Threat Detection and Incident Response ... 14%
//   2. Security Logging and Monitoring .......... 18%
//   3. Infrastructure Security .................. 20%
//   4. Identity and Access Management ........... 16%
//   5. Data Protection .......................... 18%
//   6. Management and Security Governance ....... 14%

const content = {
  meta: {
    title: 'AWS Certified Security - Specialty (SCS-C02)',
    description:
      'A complete, specialty-depth path to the AWS Certified Security - Specialty (SCS-C02) exam: threat detection and incident response, security logging and monitoring, infrastructure security, identity and access management, data protection, and management and security governance. Emphasis on IAM policy evaluation, KMS and envelope encryption, detective controls, and automated remediation - with diagrams, JSON policy snippets, quizzes and scenario tasks.',
    schemaVersion: '1.0',
    status: 'complete',
  },
  levels: [
    /* ─────────── DOMAIN 1 — THREAT DETECTION AND INCIDENT RESPONSE (14%) ─────────── */
    {
      level: 1,
      name: 'Threat Detection & IR',
      focus: 'Detecting threats with GuardDuty, Security Hub, Detective and Inspector, then responding with automated remediation, forensics and isolation (Domain 1 · 14%)',
      accent: '#2d6bff',
      soft: '#eaf0ff',
      topics: [
        {
          id: 'scs1-t0',
          name: 'Threat detection services',
          concepts: [
            {
              id: 'scs1-t0-c0',
              services: [{ icon: 'guardduty', label: 'Amazon GuardDuty' }],
              title: 'Amazon GuardDuty: continuous threat detection',
              summary:
                'GuardDuty is a managed threat-detection service that continuously analyses account and network telemetry using machine learning, anomaly detection and threat intelligence to surface findings - without you deploying any agents.',
              explanation:
                'GuardDuty ingests three foundational data sources automatically: VPC Flow Logs, DNS query logs (from the AWS-provided resolver), and CloudTrail management and S3 data events. It does not require you to enable or store those logs separately - GuardDuty consumes an internal copy. On top of the foundational sources you can enable additional protection plans: S3 Protection (analyses S3 data-event activity), EKS Protection (Kubernetes audit logs), Malware Protection (agentless scans of EBS volumes attached to suspicious instances), RDS Protection (login activity for Aurora), and Lambda Protection (network activity from functions). GuardDuty produces findings with a severity (low/medium/high) and a finding type such as Recon, UnauthorizedAccess, CryptoCurrency, Trojan, Backdoor or Exfiltration. Findings flow to the GuardDuty console, to EventBridge (every finding is an event you can match and act on), and to Security Hub. In a multi-account setup you designate a delegated administrator account through AWS Organizations to aggregate findings centrally. Suppression rules let you auto-archive expected, benign findings to cut noise.',
              analogy:
                'GuardDuty is a smoke detector wired into your whole house: it listens to the air (network), the doorbells (DNS) and the activity log (CloudTrail) and raises an alarm when the pattern looks like fire - you do not have to install or read sensors yourself.',
              keyPoints: [
                'Foundational sources: VPC Flow Logs, DNS logs, CloudTrail (management + S3 data events) - consumed internally, no setup required.',
                'Protection plans extend coverage: S3, EKS, Malware (agentless EBS scan), RDS, Lambda.',
                'Every finding is emitted to EventBridge and Security Hub - the basis for automated response.',
                'Agentless: no software to deploy on instances; enabling it is account- and Region-scoped.',
                'Multi-account: a delegated administrator aggregates member-account findings via Organizations.',
                'Suppression rules archive expected findings; they do not delete the underlying data.',
              ],
              commonMistakes: [
                'Thinking you must enable VPC Flow Logs or DNS logging for GuardDuty to work - it reads its own internal copy.',
                'Assuming GuardDuty is global; it is Region-scoped, so enable it in every Region you use.',
                'Confusing GuardDuty (detection of active threats) with Inspector (vulnerability assessment of software).',
              ],
              diagram: {
                type: 'mermaid',
                lines: [
                  'flowchart LR',
                  '  VFL[VPC Flow Logs] --> GD[GuardDuty]',
                  '  DNS[DNS query logs] --> GD',
                  '  CT[CloudTrail events] --> GD',
                  '  GD --> F[Findings]',
                  '  F --> EB[EventBridge]',
                  '  F --> SH[Security Hub]',
                ],
                caption: 'GuardDuty consumes telemetry internally and emits findings to EventBridge and Security Hub for response.',
              },
              exercises: [
                {
                  type: 'quiz',
                  prompt:
                    'A security team wants continuous threat detection without enabling VPC Flow Logs or installing agents on EC2 instances. Which service meets this and where does it get its data?',
                  hint: 'Think about which logs it reads on its own.',
                  solution: {
                    explanation:
                      'Amazon GuardDuty. It internally consumes VPC Flow Logs, DNS query logs and CloudTrail events without you enabling or storing those logs, and it is agentless.',
                  },
                },
                {
                  type: 'quiz',
                  prompt:
                    'GuardDuty repeatedly flags a known vulnerability scanner you run on a schedule. You want to stop these benign findings showing in the console without losing other findings. What do you configure?',
                  solution: {
                    explanation:
                      'A suppression rule matching that finding type/source, which auto-archives the expected findings while leaving other detections intact.',
                  },
                },
                {
                  type: 'predict',
                  prompt:
                    'You enable GuardDuty in us-east-1 only, but an attacker compromises credentials and operates in eu-west-1. Will GuardDuty detect the activity?',
                  solution: {
                    explanation:
                      'Not the network/Region-specific activity in eu-west-1, because GuardDuty is Region-scoped. Enable it in all Regions (and aggregate via a delegated admin) to get full coverage.',
                  },
                },
              ],
              docs: 'https://docs.aws.amazon.com/guardduty/latest/ug/what-is-guardduty.html',
            },
            {
              id: 'scs1-t0-c1',
              services: [{ icon: 'security', label: 'AWS Security Hub' }],
              title: 'AWS Security Hub: aggregation and posture management',
              summary:
                'Security Hub aggregates findings from GuardDuty, Inspector, Macie, IAM Access Analyzer and partner tools into one normalised format, and runs automated best-practice checks against standards like the CIS Benchmark and AWS Foundational Security Best Practices.',
              explanation:
                'Security Hub solves the fragmentation problem: each detective service produces its own findings, and Security Hub ingests them all using the AWS Security Finding Format (ASFF), a common JSON schema. This lets you triage everything in one place and build EventBridge rules against a single, predictable structure. Beyond aggregation, Security Hub runs continuous compliance checks based on enabled security standards - the AWS Foundational Security Best Practices (FSBP), CIS AWS Foundations Benchmark, PCI DSS, and NIST. Each control produces pass/fail findings and a security score. It supports cross-account, cross-Region aggregation: a delegated administrator account (via Organizations) collects findings, and you can designate an aggregation Region so findings from all Regions roll up to one. Automation rules let Security Hub update finding fields (for example, raise severity or set workflow status) automatically, and you can send findings to EventBridge to trigger remediation. Security Hub is the recommended single pane of glass; it does not itself detect threats - it consolidates and scores them.',
              keyPoints: [
                'Normalises findings into the AWS Security Finding Format (ASFF) - one schema for all sources.',
                'Runs standards-based checks: AWS Foundational Security Best Practices, CIS, PCI DSS, NIST.',
                'Cross-account/cross-Region aggregation via an Organizations delegated administrator + an aggregation Region.',
                'Automation rules modify findings automatically; EventBridge integration drives remediation.',
                'Aggregates, scores and prioritises - it does not generate primary threat detections itself.',
              ],
              commonMistakes: [
                'Expecting Security Hub to detect threats - detection comes from GuardDuty/Inspector/Macie; Security Hub aggregates and scores.',
                'Forgetting to set a finding aggregation Region, so findings stay siloed per Region.',
              ],
              diagram: {
                type: 'mermaid',
                lines: [
                  'flowchart LR',
                  '  GD[GuardDuty] --> SH[Security Hub]',
                  '  IN[Inspector] --> SH',
                  '  MA[Macie] --> SH',
                  '  AA[IAM Access Analyzer] --> SH',
                  '  SH --> EB[EventBridge]',
                  '  SH --> SC[Security score + standards]',
                ],
                caption: 'Security Hub is the aggregation hub: many sources in, normalised findings and a posture score out.',
              },
              exercises: [
                {
                  type: 'quiz',
                  prompt:
                    'An organisation runs GuardDuty, Inspector and Macie across 8 accounts and wants one normalised view plus a CIS-benchmark compliance score. Which service and what schema does it use?',
                  solution: {
                    explanation:
                      'AWS Security Hub, which normalises everything into the AWS Security Finding Format (ASFF) and runs standards checks such as CIS to produce a security score.',
                  },
                },
                {
                  type: 'predict',
                  prompt:
                    'You enable Security Hub but no GuardDuty/Inspector. Will it still show any findings?',
                  solution: {
                    explanation:
                      'Yes - its own security-standard controls still produce pass/fail findings (e.g. FSBP), but you will see no GuardDuty/Inspector threat or vulnerability findings until those services are enabled.',
                  },
                },
              ],
              docs: 'https://docs.aws.amazon.com/securityhub/latest/userguide/what-is-securityhub.html',
            },
            {
              id: 'scs1-t0-c2',
              services: [{ icon: 'inspector', label: 'Amazon Inspector' }, { icon: 'security', label: 'Amazon Detective' }],
              title: 'Inspector for vulnerabilities and Detective for investigation',
              summary:
                'Inspector continuously scans EC2 instances, container images in ECR and Lambda functions for software vulnerabilities (CVEs) and unintended network exposure; Detective builds a behavioural graph to investigate the root cause of a finding.',
              explanation:
                'Amazon Inspector (v2) automatically and continuously assesses workloads for known software vulnerabilities. It scans EC2 instances (via the Systems Manager agent), container images pushed to Amazon ECR, and Lambda functions/layers. Each finding maps to a CVE and produces an Inspector risk score that factors in CVSS, exploitability and network reachability - so an internet-reachable vulnerable instance scores higher than an isolated one. Inspector runs without scheduled scan windows; it re-evaluates as new CVEs are published or as software changes. Amazon Detective is the investigation tool: after GuardDuty raises a finding, Detective ingests VPC Flow Logs, CloudTrail and GuardDuty findings and automatically builds a linked behaviour graph across resources and time, so an analyst can answer "what did this principal do, from where, and what else was affected?" without manually correlating logs. The mental model: Inspector tells you what is vulnerable; GuardDuty tells you what is being attacked; Detective helps you understand the scope and root cause once something fires.',
              keyPoints: [
                'Inspector: continuous vulnerability (CVE) scanning of EC2, ECR container images and Lambda - uses the SSM agent for EC2.',
                'Inspector risk score weights network reachability and exploitability, not just raw CVSS.',
                'Detective: builds a behaviour graph from VPC Flow Logs, CloudTrail and GuardDuty findings for root-cause investigation.',
                'Inspector = what is vulnerable; GuardDuty = active threats; Detective = scope and root cause.',
                'Both integrate with Security Hub for centralised triage.',
              ],
              commonMistakes: [
                'Confusing Inspector (software vulnerability scanning) with GuardDuty (active threat detection).',
                'Thinking Detective detects threats - it visualises and correlates them for investigation after a finding.',
                'Forgetting that Inspector EC2 scanning depends on the SSM agent being installed and managed.',
              ],
              exercises: [
                {
                  type: 'quiz',
                  prompt:
                    'A team needs to know which running EC2 instances and ECR images contain known CVEs, prioritised by how exposed they are to the internet. Which service?',
                  solution: {
                    explanation:
                      'Amazon Inspector - continuous CVE scanning with a risk score that weights network reachability and exploitability.',
                  },
                },
                {
                  type: 'quiz',
                  prompt:
                    'After GuardDuty flags credential misuse, an analyst needs to quickly see everything that IAM principal touched over the last two weeks without hand-joining logs. Which service helps?',
                  solution: {
                    explanation:
                      'Amazon Detective, which builds a behaviour graph from CloudTrail, VPC Flow Logs and GuardDuty findings to investigate scope and root cause.',
                  },
                },
              ],
              docs: 'https://docs.aws.amazon.com/inspector/latest/user/what-is-inspector.html',
            },
          ],
        },
        {
          id: 'scs1-t1',
          name: 'Incident response & automated remediation',
          concepts: [
            {
              id: 'scs1-t1-c0',
              services: [{ icon: 'eventbridge', label: 'Amazon EventBridge' }, { icon: 'lambda', label: 'AWS Lambda' }, { icon: 'systemsmanager', label: 'Systems Manager' }],
              title: 'Automated remediation with EventBridge + Lambda/SSM',
              summary:
                'The core IR automation pattern: a finding emits an event, an EventBridge rule matches it, and a target (Lambda function or Systems Manager Automation runbook) performs the remediation - all within seconds and without human intervention.',
              explanation:
                'Detective services (GuardDuty, Security Hub, Config, Macie) publish findings as EventBridge events. You write an EventBridge rule whose event pattern matches the finding type and severity you care about, and route it to a target. Two common targets: a Lambda function for custom logic (call APIs to quarantine a resource, revoke a session, notify via SNS), or a Systems Manager Automation document (a runbook) that executes a predefined sequence of steps with built-in error handling and approvals. SSM Automation is often preferred for repeatable, auditable remediation because the runbook is versioned and its execution is logged. The pattern scales: rules can fan out to SNS for human notification and to a remediation target simultaneously. Critically, design remediations to be idempotent and least-privilege - the Lambda/Automation role should only hold the permissions required for that one action (for example, modifying a security group), so a flawed automation cannot become its own attack path.',
              keyPoints: [
                'Findings -> EventBridge rule (event pattern) -> target (Lambda or SSM Automation runbook).',
                'Lambda = custom code remediation; SSM Automation = versioned, auditable, multi-step runbooks.',
                'Fan-out: one rule can trigger remediation AND notify a human via SNS.',
                'Give the remediation role least privilege and make actions idempotent.',
                'Security Hub custom actions let analysts trigger the same automation manually from the console.',
              ],
              commonMistakes: [
                'Granting the remediation Lambda/Automation role broad admin permissions - it should hold only the actions it performs.',
                'Matching too broadly in the event pattern, causing remediation to fire on benign findings.',
                'Forgetting EventBridge rules are Region-scoped - replicate them across the Regions you use.',
              ],
              code: {
                language: 'json',
                lines: [
                  '{',
                  '  "source": ["aws.guardduty"],',
                  '  "detail-type": ["GuardDuty Finding"],',
                  '  "detail": {',
                  '    "severity": [{ "numeric": [">=", 7] }],',
                  '    "type": [{ "prefix": "UnauthorizedAccess:EC2" }]',
                  '  }',
                  '}',
                ],
                explanation:
                  'An EventBridge event pattern that matches high-severity (>= 7) GuardDuty findings of unauthorized EC2 access. A matching rule can route to a Lambda or SSM Automation runbook that isolates the instance.',
              },
              diagram: {
                type: 'mermaid',
                lines: [
                  'flowchart LR',
                  '  GD[GuardDuty finding] --> EB[EventBridge rule]',
                  '  EB --> L[Lambda remediation]',
                  '  EB --> A[SSM Automation runbook]',
                  '  EB --> SNS[SNS notify analyst]',
                ],
                caption: 'A single EventBridge rule can remediate automatically and notify a human at the same time.',
              },
              exercises: [
                {
                  type: 'quiz',
                  prompt:
                    'You want high-severity GuardDuty findings to automatically run a versioned, auditable multi-step remediation with approval gates. Which target should the EventBridge rule invoke?',
                  solution: {
                    explanation:
                      'A Systems Manager Automation document (runbook) - it is versioned, logs each step, and supports approvals and error handling, unlike ad-hoc Lambda code.',
                  },
                },
                {
                  type: 'task',
                  prompt:
                    'Why should the IAM role attached to a remediation Lambda be tightly scoped, and what is the risk if it is not?',
                  solution: {
                    explanation:
                      'Least privilege limits blast radius: the role should only hold the specific actions it performs (e.g. ec2:ModifyInstanceAttribute). A broadly privileged remediation role is itself a high-value target - a bug or compromise turns the automation into an attack path.',
                  },
                },
              ],
              docs: 'https://docs.aws.amazon.com/guardduty/latest/ug/guardduty_findings_cloudwatch.html',
            },
            {
              id: 'scs1-t1-c1',
              services: [{ icon: 'ec2', label: 'Amazon EC2' }, { icon: 'vpc', label: 'Amazon VPC' }, { icon: 's3', label: 'Amazon S3' }],
              title: 'Forensics and instance isolation',
              summary:
                'When an EC2 instance is compromised you isolate it to stop lateral movement and exfiltration while preserving evidence: detach it from normal access, snapshot its volumes, and capture memory before changing state.',
              explanation:
                'The forensic IR playbook for a compromised EC2 instance follows a deliberate order. First, isolate without destroying evidence: replace the instance\'s security group with a quarantine security group that denies all inbound and outbound traffic (or allows only the forensic tooling), and remove it from any Auto Scaling group so it is not terminated. Do NOT stop the instance immediately if you need volatile data - stopping clears memory; if memory forensics is required, capture RAM first using a tool while the instance is still running. Then take EBS snapshots of every attached volume to preserve disk state immutably; copy snapshots to a dedicated, locked-down forensics account and analyse from there. Detach the IAM instance profile or rotate/revoke its role credentials so any stolen temporary credentials are useless (revoke active sessions via an IAM policy with an aws:TokenIssueTime condition, or by editing the role to add a deny). Tag the instance as quarantined. Throughout, every action is logged via CloudTrail. The key principle: isolation and evidence preservation come before remediation, and analysis happens in a separate, isolated account so the investigation cannot disturb production or be tampered with by the attacker.',
              analogy:
                'It is a crime scene: you cordon it off (quarantine SG), photograph everything before touching it (snapshots, memory capture), and move evidence to a secure locker (forensics account) - you do not start cleaning up before the photos are taken.',
              keyPoints: [
                'Isolate by swapping in a quarantine security group (deny all) and removing the instance from its Auto Scaling group.',
                'Preserve evidence before changing state: capture memory while running if needed, then snapshot all EBS volumes.',
                'Revoke the instance role\'s active sessions (e.g. aws:TokenIssueTime deny condition) so stolen temporary credentials fail.',
                'Analyse in a dedicated, locked-down forensics account - copy snapshots there, never investigate in production.',
                'CloudTrail records every IR action for the post-incident audit.',
              ],
              commonMistakes: [
                'Stopping or terminating the instance immediately, destroying volatile memory evidence and (on terminate) instance-store data.',
                'Investigating in the production account, risking contamination and tipping off the attacker.',
                'Forgetting that detaching the instance role does not invalidate already-issued temporary credentials - you must revoke active sessions too.',
              ],
              code: {
                language: 'json',
                lines: [
                  '{',
                  '  "Version": "2012-10-17",',
                  '  "Statement": [',
                  '    {',
                  '      "Effect": "Deny",',
                  '      "Action": "*",',
                  '      "Resource": "*",',
                  '      "Condition": {',
                  '        "DateLessThan": { "aws:TokenIssueTime": "2026-06-23T00:00:00Z" }',
                  '      }',
                  '    }',
                  '  ]',
                  '}',
                ],
                explanation:
                  'An inline policy added to the compromised role: it denies every action for credentials issued before the cut-off time, instantly invalidating any leaked temporary credentials without affecting newly issued ones.',
              },
              diagram: {
                type: 'mermaid',
                lines: [
                  'flowchart TB',
                  '  D[Detect compromise] --> I[Isolate: quarantine SG + remove from ASG]',
                  '  I --> M[Capture memory if running]',
                  '  M --> S[Snapshot EBS volumes]',
                  '  S --> R[Revoke role sessions]',
                  '  R --> F[Copy snapshots to forensics account]',
                  '  F --> A[Analyse + report]',
                ],
                caption: 'IR playbook order: isolate, preserve evidence, revoke credentials, then analyse in a separate account.',
              },
              exercises: [
                {
                  type: 'quiz',
                  prompt:
                    'A GuardDuty finding indicates an EC2 instance is communicating with a command-and-control server. You must stop lateral movement but preserve memory for forensics. What is the correct first action?',
                  hint: 'Stopping the instance loses what?',
                  solution: {
                    explanation:
                      'Isolate the instance with a quarantine security group (deny all) and remove it from any Auto Scaling group, while leaving it running so volatile memory can be captured. Do not stop it yet - stopping clears RAM.',
                  },
                },
                {
                  type: 'predict',
                  prompt:
                    'You detach the IAM instance profile from a compromised instance. The attacker had already exported the temporary credentials. Can they still use them?',
                  solution: {
                    explanation:
                      'Yes, until those temporary credentials expire - detaching the profile only stops new credentials. You must revoke active sessions, e.g. an inline deny with an aws:TokenIssueTime condition on the role.',
                  },
                },
                {
                  type: 'task',
                  prompt:
                    'Why copy EBS snapshots to a separate forensics account before analysis?',
                  solution: {
                    explanation:
                      'It isolates evidence in a locked-down environment so analysis cannot disturb production, the attacker (if still present) cannot tamper with it, and access to the evidence is tightly controlled and audited.',
                  },
                },
              ],
              docs: 'https://docs.aws.amazon.com/whitepapers/latest/aws-security-incident-response-guide/welcome.html',
            },
          ],
        },
      ],
    },

    /* ─────────── DOMAIN 2 — SECURITY LOGGING AND MONITORING (18%) ─────────── */
    {
      level: 2,
      name: 'Logging & Monitoring',
      focus: 'Capturing, centralising, validating and analysing logs - CloudTrail, CloudWatch Logs, VPC Flow Logs, Config and Athena (Domain 2 · 18%)',
      accent: '#7c4ddb',
      soft: '#f1ebfd',
      topics: [
        {
          id: 'scs2-t0',
          name: 'AWS CloudTrail',
          concepts: [
            {
              id: 'scs2-t0-c0',
              services: [{ icon: 'cloudtrail', label: 'AWS CloudTrail' }],
              title: 'CloudTrail event types, organization trails and log file validation',
              summary:
                'CloudTrail records who did what, when and from where as API activity. The exam tests the difference between management, data and Insights events, how organization trails centralise logging, and how log file validation proves logs were not tampered with.',
              explanation:
                'CloudTrail captures three event categories. Management events record control-plane operations (creating a bucket, launching an instance, attaching a policy) and are logged free by default in the 90-day Event history. Data events record data-plane, high-volume operations such as S3 object-level GetObject/PutObject and Lambda Invoke - these are NOT logged by default and incur cost; you must explicitly enable them on a trail. Insights events automatically detect unusual API call-rate or error-rate patterns. To retain logs beyond 90 days you create a trail that delivers events to an S3 bucket (and optionally CloudWatch Logs). An organization trail, created in the Organizations management or delegated administrator account, automatically logs all member accounts into one central bucket - a member account cannot disable or alter it, which is why it is the recommended pattern for tamper-resistant, account-wide auditing. Log file validation adds a SHA-256 hash of each delivered log file plus a digest file signed with a private key; the AWS CLI validate-logs command verifies the chain, so you can prove logs were not modified or deleted after delivery. Lock down the destination bucket with a restrictive bucket policy, enable MFA Delete / Object Lock, and encrypt with SSE-KMS.',
              keyPoints: [
                'Management events (control plane) are on by default and free; data events (S3/Lambda data plane) are off by default and cost extra.',
                'Insights events surface anomalous API call/error rates.',
                'Organization trail (from the management/delegated-admin account) logs all members centrally and cannot be turned off by members.',
                'Log file validation = SHA-256 hashes + a signed digest file; verify integrity to prove no tampering.',
                'Protect the log bucket: restrictive bucket policy, SSE-KMS, Object Lock/MFA Delete, ideally in a dedicated log-archive account.',
              ],
              commonMistakes: [
                'Expecting S3 object-level access (data events) in CloudTrail by default - they must be explicitly enabled.',
                'Relying on the 90-day Event history for long-term audit - you need a trail delivering to S3.',
                'Storing the trail bucket in the same account that is being audited, letting an attacker delete evidence - use a separate log-archive account.',
              ],
              code: {
                language: 'bash',
                lines: [
                  '# Verify CloudTrail log integrity for a time range',
                  'aws cloudtrail validate-logs \\',
                  '  --trail-arn arn:aws:cloudtrail:us-east-1:111122223333:trail/org-trail \\',
                  '  --start-time 2026-06-01T00:00:00Z \\',
                  '  --end-time 2026-06-23T00:00:00Z',
                ],
                explanation:
                  'The validate-logs command recomputes hashes and checks the signed digest chain, confirming no log files were added, changed or deleted since delivery.',
              },
              diagram: {
                type: 'mermaid',
                lines: [
                  'flowchart TB',
                  '  M[Member account A] --> OT[Organization trail]',
                  '  N[Member account B] --> OT',
                  '  OT --> B[(Central S3 log bucket<br/>log-archive account)]',
                  '  B --> V[Log file validation digest]',
                ],
                caption: 'An organization trail funnels every member account into one tamper-resistant central bucket with validation digests.',
              },
              exercises: [
                {
                  type: 'quiz',
                  prompt:
                    'Auditors need proof that nobody altered or deleted CloudTrail logs after delivery. Which CloudTrail feature provides this and how?',
                  solution: {
                    explanation:
                      'Log file validation - CloudTrail writes SHA-256 hashes of each log file and a digest file signed with a private key; aws cloudtrail validate-logs verifies the chain to prove integrity.',
                  },
                },
                {
                  type: 'quiz',
                  prompt:
                    'You enabled a CloudTrail trail but S3 object-level GetObject calls are not appearing. Why?',
                  solution: {
                    explanation:
                      'Object-level S3 operations are data events, which are not logged by default. You must explicitly enable S3 data events on the trail (they also incur additional cost).',
                  },
                },
                {
                  type: 'task',
                  prompt:
                    'Why is an organization trail delivering to a dedicated log-archive account considered more tamper-resistant than a per-account trail?',
                  solution: {
                    explanation:
                      'Member accounts cannot disable or modify an organization trail, and the central bucket lives in a separate account they cannot access - so a compromised member account cannot delete the evidence of its own activity.',
                  },
                },
              ],
              docs: 'https://docs.aws.amazon.com/awscloudtrail/latest/userguide/cloudtrail-concepts.html',
            },
          ],
        },
        {
          id: 'scs2-t1',
          name: 'CloudWatch Logs & VPC Flow Logs',
          concepts: [
            {
              id: 'scs2-t1-c0',
              services: [{ icon: 'cloudwatch', label: 'CloudWatch Logs' }],
              title: 'CloudWatch Logs, metric filters and alarms',
              summary:
                'CloudWatch Logs ingests application and service logs; metric filters turn log patterns into metrics, and alarms fire when those metrics cross a threshold - the standard way to alert on security-relevant log events.',
              explanation:
                'CloudWatch Logs stores log events in log groups (a retention boundary) made of log streams. You can stream CloudTrail into a log group so API activity becomes searchable in near real time. The security pattern that the exam loves is metric filter + alarm: a metric filter scans incoming log events for a pattern (for example, root-account console logins, unauthorized API calls, or changes to security groups) and increments a CloudWatch metric each time it matches; a CloudWatch alarm watches that metric and, when it exceeds a threshold, sends to an SNS topic to notify the security team or trigger remediation. This is exactly how the CIS Benchmark recommends detecting events like root usage or IAM policy changes. CloudWatch Logs supports subscription filters to stream logs in real time to Lambda, Kinesis or OpenSearch for richer processing, and Logs Insights provides an interactive query language for ad-hoc analysis. Set retention explicitly (logs are kept forever by default, which costs money) and encrypt log groups with KMS for sensitive data.',
              keyPoints: [
                'Metric filter detects a log pattern and increments a metric; an alarm on that metric notifies via SNS or triggers action.',
                'Classic security alarms: root login, unauthorized API calls, security-group/IAM/NACL changes (CIS controls).',
                'Subscription filters stream logs in real time to Lambda/Kinesis/OpenSearch.',
                'Logs Insights runs ad-hoc queries over log groups.',
                'Set log-group retention (default is never-expire) and encrypt with KMS where needed.',
              ],
              commonMistakes: [
                'Leaving log retention at the default (never expire), accumulating cost.',
                'Confusing CloudWatch Logs (log storage/alarms) with CloudWatch metrics-only monitoring or with CloudTrail (the audit source).',
              ],
              diagram: {
                type: 'mermaid',
                lines: [
                  'flowchart LR',
                  '  CT[CloudTrail logs] --> LG[CloudWatch Log group]',
                  '  LG --> MF[Metric filter<br/>root login pattern]',
                  '  MF --> AL[Alarm]',
                  '  AL --> SNS[SNS notify]',
                ],
                caption: 'Metric filter + alarm: turn a log pattern (e.g. root login) into a real-time security alert.',
              },
              exercises: [
                {
                  type: 'quiz',
                  prompt:
                    'The CIS benchmark requires an alert whenever the root user signs in. CloudTrail is streamed to CloudWatch Logs. How do you implement the alert?',
                  solution: {
                    explanation:
                      'Create a metric filter on the log group matching the root console-login pattern, then a CloudWatch alarm on the resulting metric that publishes to an SNS topic when the count exceeds zero.',
                  },
                },
                {
                  type: 'predict',
                  prompt:
                    'You create a log group and never set retention. After two years, what happened to the logs and the bill?',
                  solution: {
                    explanation:
                      'The logs are still there - the default retention is never expire - and you have been paying storage for two years of logs you may not need. Set an explicit retention period.',
                  },
                },
              ],
              docs: 'https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/MonitoringLogData.html',
            },
            {
              id: 'scs2-t1-c1',
              services: [{ icon: 'vpc', label: 'VPC Flow Logs' }],
              title: 'VPC Flow Logs',
              summary:
                'VPC Flow Logs capture metadata about IP traffic going to and from network interfaces - source/destination, ports, protocol, bytes and an ACCEPT/REJECT action - for network forensics and troubleshooting. They do not capture packet contents.',
              explanation:
                'Flow Logs can be enabled at three scopes: a whole VPC, a subnet, or an individual ENI. Each record is metadata only: it tells you that traffic flowed (5-tuple of src/dst IP, src/dst port, protocol), how much (packets/bytes), over what window, and whether the security group/NACL ACCEPTed or REJECTed it - but never the payload. This makes Flow Logs ideal for spotting unexpected connections (data exfiltration to an unknown IP, port scans appearing as many REJECTs), confirming whether a security group is blocking traffic, and feeding network-forensics tools. Logs are delivered to CloudWatch Logs, an S3 bucket, or Kinesis Data Firehose; the S3 destination is common for cost-effective long-term storage and Athena querying. You can customise the record format to add fields like the VPC ID, instance ID, TCP flags and the AWS service. Note that some traffic is not captured (for example, traffic to the Amazon DNS server, instance-metadata 169.254.169.254, and DHCP). For the exam, remember Flow Logs are the go-to for the question "did this traffic reach the instance and was it allowed or denied?"',
              keyPoints: [
                'Scopes: VPC, subnet, or single ENI.',
                'Records metadata (5-tuple, bytes, ACCEPT/REJECT) - never packet payload.',
                'Destinations: CloudWatch Logs, S3, or Kinesis Data Firehose.',
                'Used to detect exfiltration, port scans, and to confirm whether SG/NACL allowed or denied traffic.',
                'Some traffic is excluded (Amazon DNS, instance metadata, DHCP, license activation).',
              ],
              commonMistakes: [
                'Expecting Flow Logs to show packet contents - use a packet-capture/mirroring tool (VPC Traffic Mirroring) for payloads.',
                'Assuming all traffic is logged - DNS-to-Amazon-resolver and 169.254.169.254 are not captured.',
              ],
              diagram: {
                type: 'mermaid',
                lines: [
                  'flowchart LR',
                  '  ENI[ENI / Subnet / VPC] --> FL[Flow Logs]',
                  '  FL --> CW[CloudWatch Logs]',
                  '  FL --> S3[(S3 bucket)]',
                  '  S3 --> AT[Athena query]',
                ],
                caption: 'Flow Logs record connection metadata and ACCEPT/REJECT, often to S3 for Athena analysis.',
              },
              exercises: [
                {
                  type: 'quiz',
                  prompt:
                    'An EC2 instance cannot reach a database and you need to know whether the traffic is being denied by a security group or NACL. Which log shows the ACCEPT/REJECT decision?',
                  solution: {
                    explanation:
                      'VPC Flow Logs - each record includes the action (ACCEPT or REJECT) for the flow, revealing whether the SG/NACL allowed or blocked it.',
                  },
                },
                {
                  type: 'predict',
                  prompt:
                    'Investigators want the actual data exchanged in a suspicious connection. Will VPC Flow Logs provide it?',
                  solution: {
                    explanation:
                      'No - Flow Logs are metadata only. To capture payloads you need packet capture, e.g. VPC Traffic Mirroring to an inspection appliance.',
                  },
                },
              ],
              docs: 'https://docs.aws.amazon.com/vpc/latest/userguide/flow-logs.html',
            },
          ],
        },
        {
          id: 'scs2-t2',
          name: 'AWS Config & log analysis',
          concepts: [
            {
              id: 'scs2-t2-c0',
              services: [{ icon: 'config', label: 'AWS Config' }],
              title: 'AWS Config: configuration history and rules',
              summary:
                'AWS Config continuously records the configuration of your resources, keeps a timeline of every change, and evaluates resources against rules to flag and (optionally) auto-remediate non-compliant settings.',
              explanation:
                'Where CloudTrail answers "who made an API call?", AWS Config answers "what is this resource\'s configuration now, and how did it change over time?". Config records configuration items - point-in-time snapshots of each resource\'s state and relationships - and stores a full history, so you can see, for example, that a security group had port 22 opened to 0.0.0.0/0 at a specific time and by which change. Config rules evaluate resources for compliance: AWS-managed rules cover common checks (e.g. s3-bucket-public-read-prohibited, encrypted-volumes, restricted-ssh), and you can write custom rules backed by Lambda or Guard. Rules can trigger automatic remediation through Systems Manager Automation documents - so a publicly exposed S3 bucket can be made private within moments of the misconfiguration. Config also supports conformance packs (collections of rules + remediations as a single deployable package) and aggregators that roll multiple accounts/Regions into one view. The exam contrasts Config (resource state and compliance over time) with CloudTrail (API activity audit) - they are complementary.',
              keyPoints: [
                'Records configuration items and a full change history per resource - the "what changed and when" service.',
                'Config rules (AWS-managed or custom Lambda/Guard) evaluate compliance continuously.',
                'Auto-remediation via Systems Manager Automation documents fixes non-compliant resources.',
                'Conformance packs bundle rules + remediations; aggregators roll up multi-account/Region.',
                'Config = resource configuration/compliance; CloudTrail = API call audit - complementary, not interchangeable.',
              ],
              commonMistakes: [
                'Using CloudTrail when the question is about a resource\'s configuration history - that is Config.',
                'Forgetting Config must have a configuration recorder enabled per Region and a delivery channel to S3.',
              ],
              diagram: {
                type: 'mermaid',
                lines: [
                  'flowchart LR',
                  '  R[Resource change] --> CI[Config records item]',
                  '  CI --> RU[Config rule evaluates]',
                  '  RU -->|non-compliant| REM[SSM Automation remediation]',
                  '  RU --> H[Configuration history]',
                ],
                caption: 'Config records state, evaluates compliance, and can auto-remediate non-compliant resources.',
              },
              exercises: [
                {
                  type: 'quiz',
                  prompt:
                    'You need to ensure every S3 bucket is never publicly readable, and any bucket that becomes public is automatically made private. Which service and feature?',
                  solution: {
                    explanation:
                      'AWS Config with the s3-bucket-public-read-prohibited managed rule, wired to a Systems Manager Automation remediation that removes public access automatically.',
                  },
                },
                {
                  type: 'quiz',
                  prompt:
                    'A security group was open to the world last Tuesday but is fine now. Which service reconstructs that historical configuration?',
                  solution: {
                    explanation:
                      'AWS Config - its configuration history shows the resource\'s state at any point in time, including when port 22 was open to 0.0.0.0/0.',
                  },
                },
              ],
              docs: 'https://docs.aws.amazon.com/config/latest/developerguide/WhatIsConfig.html',
            },
            {
              id: 'scs2-t2-c1',
              services: [{ icon: 'athena', label: 'Amazon Athena' }, { icon: 's3', label: 'Amazon S3' }],
              title: 'Centralised logging and Athena analysis',
              summary:
                'The reference pattern is a dedicated log-archive account whose S3 buckets receive CloudTrail, Flow Logs and other logs from all accounts; Athena then runs serverless SQL directly over those logs for investigation and reporting.',
              explanation:
                'A mature logging architecture centralises everything in a separate log-archive account, isolated from the workloads that generate the logs so an attacker who compromises a workload account cannot reach the evidence. CloudTrail organization trails, VPC Flow Logs, Config, ELB access logs and application logs all land in S3 buckets there, protected by restrictive bucket policies, SSE-KMS encryption and often S3 Object Lock for write-once-read-many immutability. Amazon Athena then queries those logs in place: it is serverless, you define a table over the log format (CloudTrail has a documented schema), and you pay per data scanned. Athena is the answer for ad-hoc forensic questions like "show every AssumeRole call from this IP in March" without standing up a database. To keep Athena cheap and fast, partition the data by date/account/Region and store logs in a columnar format where possible. For long retention and analytics you can transform logs with Glue. The exam pattern: many accounts -> central S3 log-archive (locked down + Object Lock) -> Athena for SQL analysis, with QuickSight or OpenSearch for visualisation.',
              keyPoints: [
                'Centralise logs in a dedicated, isolated log-archive account so workload compromise cannot reach the evidence.',
                'Protect log buckets: restrictive policy, SSE-KMS, S3 Object Lock (WORM) for immutability.',
                'Athena runs serverless SQL directly over logs in S3 - pay per data scanned.',
                'Partition logs (date/account/Region) to cut Athena cost and latency.',
                'Pattern: organization trail + Flow Logs + Config -> central S3 -> Athena (+ QuickSight/OpenSearch).',
              ],
              commonMistakes: [
                'Querying unpartitioned logs in Athena, scanning huge volumes and running up cost.',
                'Keeping logs in the same account that produces them, so a breach can delete the audit trail.',
              ],
              code: {
                language: 'sql',
                lines: [
                  'SELECT useridentity.arn, sourceipaddress, eventtime',
                  'FROM cloudtrail_logs',
                  "WHERE eventname = 'AssumeRole'",
                  "  AND sourceipaddress = '203.0.113.10'",
                  "  AND year = '2026' AND month = '03'",
                  'ORDER BY eventtime;',
                ],
                explanation:
                  'An Athena query over centralised CloudTrail logs: it finds every AssumeRole call from a suspicious IP in March, using partition columns (year/month) to limit the data scanned.',
              },
              exercises: [
                {
                  type: 'quiz',
                  prompt:
                    'A team must run ad-hoc SQL over years of CloudTrail logs stored in S3 without provisioning a database, paying only for queries run. Which service?',
                  solution: {
                    explanation:
                      'Amazon Athena - serverless SQL over data in S3, billed per data scanned. Partition the logs to keep scans small.',
                  },
                },
                {
                  type: 'task',
                  prompt:
                    'Give two protections you would apply to the central log bucket so a compromised workload account cannot delete the audit trail.',
                  solution: {
                    explanation:
                      'Store it in a separate log-archive account with a restrictive bucket policy denying cross-account delete, and enable S3 Object Lock (WORM) plus SSE-KMS so logs are immutable and encrypted.',
                  },
                },
              ],
              docs: 'https://docs.aws.amazon.com/athena/latest/ug/cloudtrail-logs.html',
            },
          ],
        },
      ],
    },

    /* ─────────── DOMAIN 3 — INFRASTRUCTURE SECURITY (20%) ─────────── */
    {
      level: 3,
      name: 'Infrastructure Security',
      focus: 'Securing the network and edge - security groups, NACLs, Network Firewall, WAF, Shield, plus hardening, bastion-free access and patching (Domain 3 · 20%)',
      accent: '#e8862a',
      soft: '#fff1e2',
      topics: [
        {
          id: 'scs3-t0',
          name: 'VPC network security',
          concepts: [
            {
              id: 'scs3-t0-c0',
              services: [{ icon: 'vpc', label: 'Amazon VPC' }],
              title: 'Security groups, NACLs and layered network defence',
              summary:
                'Security groups (stateful, instance-level, allow-only) and network ACLs (stateless, subnet-level, allow and deny) are the two native VPC firewalls. Understanding stateful vs stateless behaviour and evaluation order is essential.',
              explanation:
                'A security group operates at the ENI/instance level and is stateful: if you allow inbound traffic on a port, the return traffic is automatically permitted regardless of outbound rules, and vice versa. Security groups support allow rules only - there is no explicit deny; anything not allowed is implicitly denied, and all rules across all attached groups are evaluated together (most permissive union). A network ACL operates at the subnet level and is stateless: it evaluates inbound and outbound independently, so for a TCP connection you must allow both the inbound request and the outbound response (typically on ephemeral ports 1024-65535). NACL rules are numbered and processed in order from lowest to highest until a match, and they support both allow and deny - making them the place to block a specific malicious IP range across an entire subnet. Layered defence uses both: NACLs as a coarse subnet guardrail (and the only native way to deny by IP) and security groups as the precise, stateful per-instance control. A common best practice is referencing security groups by ID in other security groups (for tiered apps) rather than CIDR ranges.',
              keyPoints: [
                'Security group: instance-level, stateful (return traffic auto-allowed), allow-only, all rules evaluated as a union.',
                'Network ACL: subnet-level, stateless (must allow both directions, incl. ephemeral ports), numbered, supports allow AND deny.',
                'Stateless NACLs need explicit ephemeral-port (1024-65535) return rules.',
                'NACLs are the native way to deny a specific IP/CIDR; security groups cannot deny.',
                'Reference security groups by ID between tiers instead of hard-coding CIDRs.',
              ],
              commonMistakes: [
                'Forgetting NACLs are stateless - omitting the ephemeral-port outbound/inbound return rule and breaking connections.',
                'Trying to add a deny rule to a security group - they support allow only; use a NACL to deny.',
                'Assuming a single deny in one security group blocks traffic - SGs have no deny, and rules are a permissive union.',
              ],
              diagram: {
                type: 'mermaid',
                lines: [
                  'flowchart LR',
                  '  T[Inbound traffic] --> NACL[NACL<br/>subnet · stateless · allow+deny]',
                  '  NACL --> SG[Security group<br/>instance · stateful · allow only]',
                  '  SG --> I[EC2 instance]',
                ],
                caption: 'Traffic crosses the stateless subnet NACL, then the stateful instance security group.',
              },
              exercises: [
                {
                  type: 'quiz',
                  prompt:
                    'You must block one specific malicious /32 IP from reaching an entire subnet. Security group or NACL, and why?',
                  solution: {
                    explanation:
                      'A network ACL - it supports explicit deny rules and applies at the subnet level. Security groups only support allow rules, so they cannot deny a specific IP.',
                  },
                },
                {
                  type: 'predict',
                  prompt:
                    'A NACL allows inbound port 443 but you forgot the outbound ephemeral-port range. Does an HTTPS request to an instance succeed?',
                  solution: {
                    explanation:
                      'No. NACLs are stateless, so the server\'s response on an ephemeral port (1024-65535) must be explicitly allowed outbound; without it the response is dropped and the connection fails.',
                  },
                },
              ],
              docs: 'https://docs.aws.amazon.com/vpc/latest/userguide/vpc-security-groups.html',
            },
            {
              id: 'scs3-t0-c1',
              services: [{ icon: 'vpc', label: 'AWS Network Firewall' }, { icon: 'vpc', label: 'VPC Endpoints' }],
              title: 'Network Firewall, VPC endpoints and private connectivity',
              summary:
                'AWS Network Firewall is a managed stateful firewall and IPS for VPC traffic at scale; VPC endpoints (Gateway and Interface/PrivateLink) let resources reach AWS services privately without traversing the internet.',
              explanation:
                'AWS Network Firewall provides centralised, managed network protection at the VPC level: stateful and stateless rule groups, Suricata-compatible signatures for intrusion prevention, domain-name allow/deny lists, and deep packet inspection. It is deployed into dedicated firewall subnets and traffic is routed through it, often in a centralised inspection VPC with Transit Gateway so all spoke VPC traffic is inspected in one place - far more scalable than per-instance controls. For private access to AWS services, VPC endpoints remove the need for an internet gateway or NAT: a Gateway endpoint (for S3 and DynamoDB) adds a route-table entry so traffic stays on the AWS network; an Interface endpoint (powered by AWS PrivateLink) creates an ENI with a private IP for most other services and can be locked down with an endpoint policy and security group. Endpoint policies are resource policies that restrict which actions/resources can be reached through the endpoint - useful to ensure traffic to S3 only goes to your own buckets. PrivateLink also lets you expose your own services privately to other VPCs/accounts. Use VPC endpoints to keep sensitive service traffic off the public internet and to enforce that, for example, only specific S3 buckets are reachable.',
              keyPoints: [
                'Network Firewall: managed stateful firewall + IPS (Suricata rules), domain filtering, DPI - deployed in firewall subnets, often centralised via Transit Gateway.',
                'Gateway endpoint (S3, DynamoDB): route-table based, no ENI, no cost.',
                'Interface endpoint (PrivateLink): an ENI with a private IP for most services; supports endpoint policy + security group.',
                'Endpoint policies restrict which resources/actions are reachable through the endpoint (e.g. only your buckets).',
                'Endpoints keep service traffic private - no IGW/NAT, no public internet exposure.',
              ],
              commonMistakes: [
                'Confusing Gateway endpoints (S3/DynamoDB, route-table) with Interface endpoints (PrivateLink ENI for other services).',
                'Forgetting an endpoint policy - by default an interface/gateway endpoint allows broad access unless restricted.',
                'Using Network Firewall where a security group/NACL suffices - it is for centralised, advanced inspection at scale.',
              ],
              diagram: {
                type: 'mermaid',
                lines: [
                  'flowchart LR',
                  '  EC2[EC2 in private subnet] --> IE[Interface endpoint<br/>PrivateLink]',
                  '  IE --> SVC[AWS service API]',
                  '  EC2 --> GE[Gateway endpoint]',
                  '  GE --> S3[(Amazon S3)]',
                ],
                caption: 'VPC endpoints reach AWS services privately - interface endpoints via PrivateLink ENIs, gateway endpoints via route tables.',
              },
              exercises: [
                {
                  type: 'quiz',
                  prompt:
                    'Instances in a private subnet must call the S3 and DynamoDB APIs without any internet gateway or NAT. Which endpoint type, and what does it cost?',
                  solution: {
                    explanation:
                      'A Gateway VPC endpoint (the only type supporting S3 and DynamoDB), which works via route-table entries and incurs no hourly charge.',
                  },
                },
                {
                  type: 'task',
                  prompt:
                    'How do you ensure traffic through an S3 gateway endpoint can only reach your own buckets and nothing else?',
                  solution: {
                    explanation:
                      'Attach an endpoint policy that allows S3 actions only on your specific bucket ARNs, denying access to any other bucket through that endpoint.',
                  },
                },
                {
                  type: 'quiz',
                  prompt:
                    'A company wants centralised intrusion prevention with Suricata rules and domain allow-listing across many VPCs. Which service?',
                  solution: {
                    explanation:
                      'AWS Network Firewall, typically deployed in a central inspection VPC with Transit Gateway so all spoke traffic is inspected.',
                  },
                },
              ],
              docs: 'https://docs.aws.amazon.com/network-firewall/latest/developerguide/what-is-aws-network-firewall.html',
            },
          ],
        },
        {
          id: 'scs3-t1',
          name: 'Edge protection',
          concepts: [
            {
              id: 'scs3-t1-c0',
              services: [{ icon: 'waf', label: 'AWS WAF' }, { icon: 'shield', label: 'AWS Shield' }, { icon: 'cloudfront', label: 'Amazon CloudFront' }],
              title: 'WAF, Shield and edge DDoS protection',
              summary:
                'AWS WAF filters Layer-7 web requests with managed and custom rules; AWS Shield protects against DDoS (Standard free for all, Advanced paid with the DDoS Response Team); both are most effective deployed at the edge on CloudFront.',
              explanation:
                'AWS WAF inspects HTTP(S) requests against a Web ACL of rules and can allow, block, count or CAPTCHA them based on conditions: IP sets, geographic origin, request rate (rate-based rules to throttle floods), string/regex matches in headers, body, URI or query string, and SQLi/XSS match statements. AWS Managed Rule groups provide curated protections (Core rule set, known bad inputs, SQL database, IP reputation). WAF attaches to CloudFront, Application Load Balancer, API Gateway, AppSync and Cognito. AWS Shield defends against DDoS: Shield Standard is automatic and free, protecting against common Layer-3/4 attacks on CloudFront, Route 53 and ELB. Shield Advanced is a paid subscription that adds enhanced Layer-3/4 and Layer-7 protection, near-real-time attack visibility, cost protection (credits for scaling during an attack), and 24/7 access to the AWS Shield Response Team (SRT). Best practice for web apps is defence-in-depth at the edge: CloudFront in front of the origin, WAF on CloudFront to filter Layer-7, and Shield (Advanced for critical apps) for DDoS - pushing mitigation to the edge before traffic reaches your infrastructure.',
              keyPoints: [
                'WAF: Layer-7 Web ACL filtering - IP sets, geo, rate-based, SQLi/XSS, managed rule groups; allow/block/count/CAPTCHA.',
                'WAF attaches to CloudFront, ALB, API Gateway, AppSync, Cognito.',
                'Shield Standard: free, automatic L3/L4 DDoS protection for all customers.',
                'Shield Advanced: paid - enhanced L3/L4/L7, cost protection, and the Shield Response Team (SRT).',
                'Edge defence-in-depth: CloudFront + WAF + Shield filters threats before they reach the origin.',
              ],
              commonMistakes: [
                'Expecting WAF to stop Layer-3/4 volumetric DDoS - that is Shield; WAF handles Layer-7.',
                'Thinking Shield Advanced is automatic - it is a paid subscription you must enable and configure.',
                'Putting WAF only on the ALB when the origin is also directly reachable - lock the origin to CloudFront.',
              ],
              diagram: {
                type: 'mermaid',
                lines: [
                  'flowchart LR',
                  '  U[Users] --> CF[CloudFront + Shield]',
                  '  CF --> W[WAF Web ACL]',
                  '  W --> O[Origin: ALB / S3]',
                ],
                caption: 'Edge defence: Shield absorbs DDoS, WAF filters Layer-7, before traffic ever reaches the origin.',
              },
              exercises: [
                {
                  type: 'quiz',
                  prompt:
                    'A public API is hit with a flood of HTTP requests from many IPs (Layer-7 application DDoS) plus SQL-injection attempts. Which service filters the malicious requests and which feature throttles the flood?',
                  solution: {
                    explanation:
                      'AWS WAF filters the requests; a rate-based rule throttles IPs exceeding a request threshold, and SQLi match statements/managed rules block the injection attempts.',
                  },
                },
                {
                  type: 'quiz',
                  prompt:
                    'A business-critical app needs 24/7 access to AWS DDoS experts and billing credits for scaling during an attack. Which offering?',
                  solution: {
                    explanation:
                      'AWS Shield Advanced - it provides the Shield Response Team (SRT) and DDoS cost protection, beyond the free Shield Standard.',
                  },
                },
              ],
              docs: 'https://docs.aws.amazon.com/waf/latest/developerguide/what-is-aws-waf.html',
            },
          ],
        },
        {
          id: 'scs3-t2',
          name: 'Host security & patching',
          concepts: [
            {
              id: 'scs3-t2-c0',
              services: [{ icon: 'systemsmanager', label: 'Systems Manager' }],
              title: 'Session Manager and bastion-free access',
              summary:
                'Systems Manager Session Manager gives secure, audited shell and port-forwarding access to instances without SSH keys, open inbound ports or bastion hosts - eliminating a major attack surface.',
              explanation:
                'The traditional pattern of a bastion host with port 22 open and SSH keys is a liability: open ports get scanned, keys leak, and sessions are hard to audit. Session Manager replaces it. The SSM agent on the instance opens an outbound connection to the Systems Manager service (no inbound ports needed); authorised users start a session through IAM permissions, and every command and its output can be logged to CloudWatch Logs or S3 and audited via CloudTrail. Because access is controlled by IAM policies (and can be scoped by tags), you grant least-privilege shell access per instance and revoke it instantly by changing the policy - no key rotation. Session Manager also supports port forwarding and SSH-over-Session-Manager for cases that need a tunnel, and it works for instances in fully private subnets via VPC interface endpoints, keeping traffic off the internet entirely. For the exam, Session Manager is the recommended answer whenever the scenario wants secure, auditable, keyless administrative access without opening inbound ports or running bastions.',
              analogy:
                'Instead of leaving a door (port 22) with a physical key under the mat, the room calls out to a guarded reception (SSM service); reception checks your ID (IAM) and records the whole visit (CloudTrail + session logs).',
              keyPoints: [
                'No inbound ports, no SSH keys, no bastion - the SSM agent connects outbound to Systems Manager.',
                'Access is governed by IAM (scoped by tags) and fully audited via CloudTrail; commands logged to CloudWatch Logs/S3.',
                'Supports port forwarding and SSH tunnelling through the session.',
                'Works for fully private instances via interface VPC endpoints - traffic stays off the internet.',
                'Recommended over bastion hosts for secure, keyless, auditable access.',
              ],
              commonMistakes: [
                'Keeping port 22 and a bastion when Session Manager would remove the inbound attack surface entirely.',
                'Forgetting the instance needs the SSM agent, an instance role with SSM permissions, and (for private subnets) interface endpoints.',
              ],
              diagram: {
                type: 'mermaid',
                lines: [
                  'flowchart LR',
                  '  Admin[Admin] --> SSM[Systems Manager]',
                  '  EC2[EC2 + SSM agent] -->|outbound| SSM',
                  '  SSM --> CT[CloudTrail + session logs]',
                ],
                caption: 'Session Manager: the agent dials out, IAM authorises, and the whole session is logged - no inbound ports.',
              },
              exercises: [
                {
                  type: 'quiz',
                  prompt:
                    'Security wants to administer EC2 instances with no inbound SSH, no key pairs, no bastion, and a full audit trail of who ran what. Which service?',
                  solution: {
                    explanation:
                      'AWS Systems Manager Session Manager - keyless, no open ports, IAM-controlled, with session logging to CloudWatch/S3 and CloudTrail auditing.',
                  },
                },
                {
                  type: 'task',
                  prompt:
                    'What three prerequisites does an instance in a fully private subnet need for Session Manager?',
                  solution: {
                    explanation:
                      'The SSM agent installed, an instance profile/role granting SSM permissions, and connectivity to the Systems Manager service - typically interface VPC endpoints so traffic stays private.',
                  },
                },
              ],
              docs: 'https://docs.aws.amazon.com/systems-manager/latest/userguide/session-manager.html',
            },
            {
              id: 'scs3-t2-c1',
              services: [{ icon: 'systemsmanager', label: 'Systems Manager Patch Manager' }, { icon: 'inspector', label: 'Amazon Inspector' }],
              title: 'Patch management and hardening',
              summary:
                'Systems Manager Patch Manager automates OS and application patching on a schedule using patch baselines and maintenance windows; combined with hardened golden AMIs and Inspector scanning it closes the vulnerability lifecycle.',
              explanation:
                'Unpatched software is a leading cause of compromise, and in the shared responsibility model patching the guest OS of EC2 is the customer\'s job. Patch Manager automates it: a patch baseline defines which patches are approved (by severity, classification, and an auto-approval delay), patch groups (tagged sets of instances) get different baselines, and maintenance windows schedule patching during safe times. It reports compliance so you can see which instances are missing critical patches. Hardening complements patching: build golden AMIs from a hardened baseline (CIS benchmarks), bake in only the needed packages, disable unused services, and use EC2 Image Builder to produce and test these images on a pipeline so every launch starts secure and consistent. Amazon Inspector then continuously scans running instances and images for new CVEs, feeding findings to Security Hub. The lifecycle: harden the image (Image Builder + CIS) -> deploy -> scan continuously (Inspector) -> patch on schedule (Patch Manager) -> verify compliance. For containers and Lambda the same idea applies - scan images in ECR and rebuild rather than patch in place.',
              keyPoints: [
                'Customer patches the EC2 guest OS (shared responsibility); Patch Manager automates it with baselines, patch groups and maintenance windows.',
                'Patch baselines auto-approve patches by severity/classification with a delay; compliance reporting shows gaps.',
                'Golden AMIs hardened to CIS benchmarks via EC2 Image Builder ensure consistent, secure launches.',
                'Inspector continuously scans for new CVEs and reports to Security Hub.',
                'Lifecycle: harden image -> deploy -> scan (Inspector) -> patch (Patch Manager) -> verify compliance.',
              ],
              commonMistakes: [
                'Assuming AWS patches the EC2 guest OS - it does not for IaaS; that is the customer\'s responsibility.',
                'Patching instances in place ad-hoc instead of rebuilding from a hardened, version-controlled golden AMI.',
              ],
              exercises: [
                {
                  type: 'quiz',
                  prompt:
                    'A fleet of EC2 instances must be patched automatically each weekend, approving only critical/important updates after a 3-day soak, with compliance reporting. Which service and constructs?',
                  solution: {
                    explanation:
                      'Systems Manager Patch Manager - define a patch baseline (approve critical/important with a 3-day auto-approval delay), assign patch groups, and schedule via a maintenance window; Patch Manager reports compliance.',
                  },
                },
                {
                  type: 'quiz',
                  prompt:
                    'How do you ensure every new EC2 launch starts from a consistent, CIS-hardened image built and tested on a pipeline?',
                  solution: {
                    explanation:
                      'Use EC2 Image Builder to produce golden AMIs from a hardened baseline, test them, and distribute them; launch templates then reference the approved AMI.',
                  },
                },
              ],
              docs: 'https://docs.aws.amazon.com/systems-manager/latest/userguide/systems-manager-patch.html',
            },
          ],
        },
      ],
    },

    /* ─────────── DOMAIN 4 — IDENTITY AND ACCESS MANAGEMENT (16%) ─────────── */
    {
      level: 4,
      name: 'Identity & Access Management',
      focus: 'Advanced IAM - policy evaluation logic, permission boundaries, SCPs, resource and cross-account policies, federation, Identity Center and ABAC (Domain 4 · 16%)',
      accent: '#1ba85a',
      soft: '#e6f7ee',
      topics: [
        {
          id: 'scs4-t0',
          name: 'Policy evaluation logic',
          concepts: [
            {
              id: 'scs4-t0-c0',
              services: [{ icon: 'iam', label: 'AWS IAM' }, { icon: 'organizations', label: 'AWS Organizations' }],
              title: 'How a request is evaluated: SCPs, boundaries, identity and resource policies',
              summary:
                'An IAM request is allowed only if it survives every policy type that applies. An explicit Deny anywhere wins; otherwise the request must be allowed by the relevant combination of SCPs, permission boundaries, identity policies and (for cross-account) resource policies.',
              explanation:
                'This is the single most tested concept on the exam. When a principal makes a request, AWS evaluates several policy types and combines them with a strict rule: an explicit Deny in ANY applicable policy always overrides any Allow, and by default everything is implicitly denied unless explicitly allowed. The types are: (1) Service Control Policies (SCPs) - Organizations guardrails that set the maximum permissions for an account; they never grant access, they only cap it. (2) Permission boundaries - a managed policy attached to an IAM user/role that sets the maximum the identity policy can grant. (3) Identity-based policies - attached to the user/role/group. (4) Resource-based policies - attached to the resource (e.g. an S3 bucket policy or KMS key policy). (5) Session policies passed when assuming a role. For a request within one account, the effective permissions are the intersection of SCP AND boundary AND (identity OR resource) - all must allow, none may deny. The crucial cross-account nuance: when a principal in account A accesses a resource in account B, BOTH the identity policy in A AND the resource policy in B must allow it (it is an AND, not an OR), and the SCPs/boundaries of A still apply to the principal. Memorise the order: explicit Deny -> Organizations SCP -> resource policy -> identity policy -> permission boundary -> session policy, all reduced to a final allow/deny.',
              keyPoints: [
                'Default deny: anything not explicitly allowed is denied.',
                'Explicit Deny always wins, in any applicable policy type.',
                'SCPs and permission boundaries only limit (cap) permissions - they never grant.',
                'Same-account: effective = SCP AND boundary AND (identity OR resource policy), with no deny.',
                'Cross-account: BOTH the caller\'s identity policy AND the resource policy must allow (an AND).',
              ],
              commonMistakes: [
                'Thinking an SCP or permission boundary grants access - they only restrict the maximum.',
                'For cross-account access, allowing only the resource policy or only the identity policy - cross-account requires both.',
                'Forgetting that an explicit Deny in an SCP overrides an Allow in the account\'s identity policy.',
              ],
              diagram: {
                type: 'mermaid',
                lines: [
                  'flowchart TB',
                  '  R[Request] --> D{Explicit Deny anywhere?}',
                  '  D -->|Yes| DENY[Denied]',
                  '  D -->|No| S{Allowed by SCP?}',
                  '  S -->|No| DENY',
                  '  S -->|Yes| B{Within boundary?}',
                  '  B -->|No| DENY',
                  '  B -->|Yes| P{Identity or resource policy allows?}',
                  '  P -->|No| DENY',
                  '  P -->|Yes| ALLOW[Allowed]',
                ],
                caption: 'Policy evaluation: an explicit deny wins; otherwise SCP, boundary and an allow (identity or resource) must all pass.',
              },
              exercises: [
                {
                  type: 'predict',
                  prompt:
                    'A role\'s identity policy allows s3:* but an SCP on the account explicitly denies s3:DeleteObject. Can the role delete objects?',
                  solution: {
                    explanation:
                      'No. An explicit Deny in the SCP overrides the Allow in the identity policy. SCPs cap the maximum; a deny there cannot be overridden by any account-level grant.',
                  },
                },
                {
                  type: 'predict',
                  prompt:
                    'A user in account A has an identity policy allowing s3:GetObject on a bucket in account B, but the bucket policy in B says nothing about that user. Can the user read the object?',
                  solution: {
                    explanation:
                      'No. Cross-account access requires BOTH the identity policy in A and the resource (bucket) policy in B to allow it. The missing allow in B blocks the request.',
                  },
                },
                {
                  type: 'task',
                  prompt:
                    'State the relationship between a permission boundary and the identity policy on the same role.',
                  solution: {
                    explanation:
                      'The effective permissions are the intersection: an action is allowed only if BOTH the identity policy allows it AND it is within the permission boundary. The boundary never grants - it only caps what the identity policy can grant.',
                  },
                },
              ],
              docs: 'https://docs.aws.amazon.com/IAM/latest/UserGuide/reference_policies_evaluation-logic.html',
            },
            {
              id: 'scs4-t0-c1',
              services: [{ icon: 'iam', label: 'AWS IAM' }],
              title: 'Policy conditions, wildcards and least-privilege patterns',
              summary:
                'Condition keys (like aws:SourceIp, aws:PrincipalOrgID, aws:MultiFactorAuthPresent and aws:SecureTransport) let you write precise, context-aware policies that enforce least privilege and guardrails such as MFA-only or TLS-only access.',
              explanation:
                'Beyond Effect/Action/Resource, the Condition block is where security policies get sharp. Global condition keys apply to any service: aws:SourceIp restricts by caller IP/CIDR; aws:PrincipalOrgID limits access to principals within your Organization (a clean way to scope resource policies); aws:MultiFactorAuthPresent requires the session was authenticated with MFA; aws:SecureTransport requires TLS (combine with a Deny when false to forbid plaintext); aws:PrincipalTag/aws:ResourceTag enable attribute-based access control; aws:RequestedRegion confines actions to allowed Regions. Operators (StringEquals, StringLike, IpAddress, Bool, ArnLike, DateLessThan) plus the IfExists and ForAllValues/ForAnyValue set qualifiers control matching. A frequent exam pattern is a Deny statement with a negated condition - for example, deny all S3 actions when aws:SecureTransport is false (forces HTTPS), or deny sensitive actions when aws:MultiFactorAuthPresent is false (forces MFA). For least privilege, prefer specific actions and resource ARNs over wildcards, use NotAction sparingly (it is broad and easy to get wrong), and use IAM Access Analyzer to generate least-privilege policies from CloudTrail activity and to validate policies. Avoid Resource: * with Action: * except where unavoidable, and never embed long-term keys when a role will do.',
              keyPoints: [
                'Key global conditions: aws:SourceIp, aws:PrincipalOrgID, aws:MultiFactorAuthPresent, aws:SecureTransport, aws:RequestedRegion.',
                'Enforce TLS: Deny when aws:SecureTransport is false. Enforce MFA: Deny when aws:MultiFactorAuthPresent is false.',
                'aws:PrincipalOrgID scopes resource policies to your whole Organization cleanly.',
                'Prefer specific actions/ARNs over wildcards; be cautious with NotAction.',
                'IAM Access Analyzer validates policies and can generate least-privilege policies from CloudTrail.',
              ],
              commonMistakes: [
                'Using Allow with a condition to "require" MFA - the robust pattern is an explicit Deny when the condition is false.',
                'Granting Action: "*" on Resource: "*" out of convenience, violating least privilege.',
                'Misusing ForAllValues vs ForAnyValue with multi-valued condition keys.',
              ],
              code: {
                language: 'json',
                lines: [
                  '{',
                  '  "Version": "2012-10-17",',
                  '  "Statement": [',
                  '    {',
                  '      "Sid": "DenyInsecureTransport",',
                  '      "Effect": "Deny",',
                  '      "Action": "s3:*",',
                  '      "Resource": ["arn:aws:s3:::secure-bucket", "arn:aws:s3:::secure-bucket/*"],',
                  '      "Condition": { "Bool": { "aws:SecureTransport": "false" } }',
                  '    }',
                  '  ]',
                  '}',
                ],
                explanation:
                  'A bucket-policy statement that denies any S3 request not made over TLS, forcing all access to use HTTPS. The negated-condition Deny is the canonical enforcement pattern.',
              },
              exercises: [
                {
                  type: 'task',
                  prompt:
                    'Write the condition logic to ensure a sensitive IAM action can only be performed by a session authenticated with MFA.',
                  solution: {
                    explanation:
                      'Add an explicit Deny on the action with Condition BoolIfExists aws:MultiFactorAuthPresent = false. The Deny applies whenever MFA is absent, which is more robust than relying on an Allow condition.',
                  },
                },
                {
                  type: 'quiz',
                  prompt:
                    'You want an S3 bucket policy that allows access only to principals in your AWS Organization, regardless of account. Which condition key?',
                  solution: {
                    explanation:
                      'aws:PrincipalOrgID, matched against your organization id - it scopes the resource policy to all accounts in the Organization without listing each account.',
                  },
                },
              ],
              docs: 'https://docs.aws.amazon.com/IAM/latest/UserGuide/reference_policies_condition-keys.html',
            },
          ],
        },
        {
          id: 'scs4-t1',
          name: 'Roles, federation & cross-account',
          concepts: [
            {
              id: 'scs4-t1-c0',
              services: [{ icon: 'iam', label: 'AWS STS' }],
              title: 'STS, AssumeRole and cross-account access',
              summary:
                'AWS STS issues temporary, expiring credentials when a role is assumed. Cross-account access works by a trust policy in the target account naming the trusted principal, plus an identity policy in the source account permitting sts:AssumeRole.',
              explanation:
                'A role has two policies that work together: a trust policy (who may assume it - the assume-role policy document defining trusted principals) and a permissions policy (what the role can do once assumed). When account A\'s principal calls sts:AssumeRole on a role in account B, STS checks that B\'s trust policy trusts A\'s principal AND that A\'s identity policy allows sts:AssumeRole on that role ARN - both sides must agree, which is why cross-account roles are the secure pattern (no long-term keys shared). STS then returns temporary credentials (access key, secret, session token) valid for a bounded duration. To harden cross-account roles you can require an ExternalId (prevents the confused-deputy problem when a third party assumes the role on your behalf) and require MFA in the trust policy. Other STS operations: AssumeRoleWithSAML (enterprise federation), AssumeRoleWithWebIdentity (OIDC/social or workloads with web identity), and GetSessionToken/GetFederationToken. Roles are preferred everywhere - for EC2 (instance profiles), Lambda (execution roles), and service-to-service access - because the credentials are temporary and rotate automatically. The exam tests: trust policy vs permissions policy, the two-sided AND for cross-account, ExternalId for third parties, and the temporary nature of STS credentials.',
              keyPoints: [
                'Role = trust policy (who can assume) + permissions policy (what it can do).',
                'Cross-account assume requires BOTH the target trust policy and the source identity policy to allow it.',
                'STS returns temporary, auto-expiring credentials (no shared long-term keys).',
                'ExternalId prevents the confused-deputy problem for third-party access; require MFA for sensitive roles.',
                'AssumeRoleWithSAML (enterprise SSO) and AssumeRoleWithWebIdentity (OIDC) federate external identities.',
              ],
              commonMistakes: [
                'Configuring only one side of cross-account trust - both the trust policy and the caller\'s identity policy must allow it.',
                'Omitting ExternalId when a third-party vendor assumes your role, leaving a confused-deputy risk.',
                'Sharing IAM user access keys across accounts instead of using AssumeRole.',
              ],
              diagram: {
                type: 'mermaid',
                lines: [
                  'sequenceDiagram',
                  '  participant A as Principal in Account A',
                  '  participant STS as AWS STS',
                  '  participant B as Role in Account B',
                  '  A->>STS: AssumeRole RoleB',
                  '  STS->>B: Trust policy trusts A?',
                  '  B-->>STS: Yes',
                  '  STS-->>A: Temporary credentials',
                ],
                caption: 'Cross-account AssumeRole: B trusts A and A is allowed to assume; STS returns short-lived credentials.',
              },
              exercises: [
                {
                  type: 'quiz',
                  prompt:
                    'A SaaS vendor in another account needs to assume a role in yours. What do you add to the role\'s trust policy to prevent the confused-deputy problem?',
                  solution: {
                    explanation:
                      'A condition requiring a specific sts:ExternalId that you share with the vendor. The vendor must pass that ExternalId when assuming the role, so a different customer cannot trick the vendor into accessing your account.',
                  },
                },
                {
                  type: 'predict',
                  prompt:
                    'Account B\'s role trust policy trusts account A, but A\'s users have no policy permitting sts:AssumeRole. Can they assume it?',
                  solution: {
                    explanation:
                      'No. Both sides must allow it - the trust policy in B and an identity policy in A granting sts:AssumeRole on the role ARN. Trust alone is insufficient.',
                  },
                },
              ],
              docs: 'https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles_terms-and-concepts.html',
            },
            {
              id: 'scs4-t1-c1',
              services: [{ icon: 'iam', label: 'IAM Identity Center' }, { icon: 'cognito', label: 'Amazon Cognito' }],
              title: 'Federation, Identity Center and ABAC',
              summary:
                'IAM Identity Center centralises workforce SSO across many AWS accounts and SaaS apps; Cognito handles customer/app identities; attribute-based access control (ABAC) grants access by matching tags instead of writing per-resource policies.',
              explanation:
                'For workforce access at scale you should not create IAM users per person per account. IAM Identity Center (successor to AWS SSO) connects to an external identity source (its built-in directory, Active Directory, or an external IdP via SAML/SCIM) and lets users sign in once to reach assigned permission sets across all Organization accounts - eliminating long-term credentials and per-account user sprawl. Permission sets map to IAM roles provisioned into each account. For application end-users (not employees), Amazon Cognito provides user pools (a sign-up/sign-in directory supporting social and SAML/OIDC federation) and identity pools (exchange a token for temporary AWS credentials scoped by role). Attribute-based access control (ABAC) is a scaling strategy: instead of one policy per project, you tag principals and resources with attributes (e.g. project=alpha) and write a single policy that allows access only when aws:PrincipalTag/project equals aws:ResourceTag/project. ABAC means new projects need no new policies - just consistent tags - and it pairs naturally with Identity Center, which can pass directory attributes as session tags. The exam contrasts: Identity Center for workforce SSO, Cognito for app users, ABAC for tag-driven scalable authorization, and reminds you that federation avoids long-term IAM credentials entirely.',
              keyPoints: [
                'IAM Identity Center: workforce SSO across all Organization accounts + SaaS; permission sets become roles per account.',
                'Identity source can be the built-in directory, AD, or an external IdP via SAML/SCIM.',
                'Cognito: user pools (app sign-in directory + federation) and identity pools (token -> temporary AWS credentials).',
                'ABAC: grant access by matching aws:PrincipalTag to aws:ResourceTag - scales without per-resource policies.',
                'Federation and Identity Center eliminate long-term IAM user credentials.',
              ],
              commonMistakes: [
                'Using Cognito for employee/workforce SSO - that is Identity Center; Cognito is for application end-users.',
                'Writing one policy per project (RBAC sprawl) where ABAC with tags would scale cleanly.',
                'Creating IAM users per person per account instead of centralising with Identity Center.',
              ],
              diagram: {
                type: 'mermaid',
                lines: [
                  'flowchart LR',
                  '  IdP[Corporate IdP / AD] --> IC[IAM Identity Center]',
                  '  IC --> A1[Account 1 role]',
                  '  IC --> A2[Account 2 role]',
                  '  IC --> SaaS[SaaS apps]',
                ],
                caption: 'Identity Center federates one workforce identity to roles across many accounts and SaaS apps.',
              },
              exercises: [
                {
                  type: 'quiz',
                  prompt:
                    'A company has 30 AWS accounts and wants employees to sign in once via their corporate Active Directory and reach assigned roles in each account. Which service?',
                  solution: {
                    explanation:
                      'AWS IAM Identity Center, connected to Active Directory as the identity source, with permission sets mapped to roles in each Organization account.',
                  },
                },
                {
                  type: 'task',
                  prompt:
                    'Explain how ABAC lets a new project team get access without writing a new IAM policy.',
                  solution: {
                    explanation:
                      'A single policy allows actions only when aws:PrincipalTag/project equals aws:ResourceTag/project. Tagging the new team\'s principals and resources with the same project value grants access automatically - no new policy required.',
                  },
                },
              ],
              docs: 'https://docs.aws.amazon.com/singlesignon/latest/userguide/what-is.html',
            },
          ],
        },
      ],
    },

    /* ─────────── DOMAIN 5 — DATA PROTECTION (18%) ─────────── */
    {
      level: 5,
      name: 'Data Protection',
      focus: 'Protecting data with KMS key policies and grants, envelope encryption, rotation, CloudHSM, ACM, S3 encryption, Secrets Manager and Macie (Domain 5 · 18%)',
      accent: '#dd344c',
      soft: '#fde8ed',
      topics: [
        {
          id: 'scs5-t0',
          name: 'AWS KMS deep dive',
          concepts: [
            {
              id: 'scs5-t0-c0',
              services: [{ icon: 'kms', label: 'AWS KMS' }],
              title: 'KMS keys, key policies and access control',
              summary:
                'KMS keys are protected by a key policy - the primary, always-present access control for the key. Unlike most resources, a KMS key\'s permissions are not governed by IAM alone: the key policy must grant access, optionally delegating to IAM.',
              explanation:
                'A KMS key (formerly CMK) can be customer-managed (you control policy, rotation, deletion), AWS-managed (created by a service, policy fixed), or an AWS-owned key (invisible, shared). The critical and heavily tested point: access to a KMS key is governed by its key policy. Every key has exactly one key policy, and if the key policy does not grant access - directly or by delegating to IAM - then IAM policies alone cannot grant it. The common pattern is a key-policy statement granting the account root principal access (Principal AWS = arn:aws:iam::ACCOUNT:root), which delegates control to IAM so that IAM policies in that account can then allow kms actions. Without that delegation statement, even an admin\'s IAM policy with kms:* is ineffective for that key. Key policies also commonly separate duties: key administrators (manage the key, cannot use it to encrypt/decrypt) versus key users (can encrypt/decrypt, cannot manage). Cross-account key use requires both the key policy in the key\'s account to allow the external principal AND that principal\'s IAM policy to allow it - the same two-sided rule as other resource policies. For a deletion safeguard, scheduling key deletion enforces a 7-30 day waiting period; disabling is reversible. Multi-Region keys replicate key material so the same key id can encrypt in one Region and decrypt in another.',
              keyPoints: [
                'Every KMS key has exactly one key policy - the primary access control; IAM alone cannot grant key access.',
                'Delegate to IAM with a key-policy statement granting the account root principal, then IAM policies apply.',
                'Separate key administrators (manage) from key users (encrypt/decrypt) for separation of duties.',
                'Cross-account use needs both the key policy and the caller\'s IAM policy to allow it.',
                'Key deletion has a mandatory 7-30 day waiting period; disabling is instant and reversible.',
              ],
              commonMistakes: [
                'Assuming an IAM policy with kms:* grants key access without the key policy delegating to IAM - it does not.',
                'Confusing customer-managed keys (you control rotation/policy) with AWS-managed keys (service-controlled).',
                'Forgetting the deletion waiting period - you cannot immediately and permanently delete a key.',
              ],
              code: {
                language: 'json',
                lines: [
                  '{',
                  '  "Version": "2012-10-17",',
                  '  "Statement": [',
                  '    {',
                  '      "Sid": "DelegateToIAM",',
                  '      "Effect": "Allow",',
                  '      "Principal": { "AWS": "arn:aws:iam::111122223333:root" },',
                  '      "Action": "kms:*",',
                  '      "Resource": "*"',
                  '    },',
                  '    {',
                  '      "Sid": "KeyUsers",',
                  '      "Effect": "Allow",',
                  '      "Principal": { "AWS": "arn:aws:iam::111122223333:role/app-role" },',
                  '      "Action": ["kms:Encrypt", "kms:Decrypt", "kms:GenerateDataKey"],',
                  '      "Resource": "*"',
                  '    }',
                  '  ]',
                  '}',
                ],
                explanation:
                  'A key policy that delegates management to IAM (root principal) and separately grants an application role the use actions (encrypt/decrypt/generate data key) but not management.',
              },
              diagram: {
                type: 'mermaid',
                lines: [
                  'flowchart TB',
                  '  KP[Key policy] --> DEL{Delegates to IAM?}',
                  '  DEL -->|Yes root principal| IAM[IAM policies apply]',
                  '  DEL -->|No| ONLY[Only key policy grants access]',
                  '  IAM --> USE[Principal can use key]',
                ],
                caption: 'KMS access starts at the key policy; only if it delegates to IAM do IAM policies take effect.',
              },
              exercises: [
                {
                  type: 'predict',
                  prompt:
                    'An IAM role has a policy allowing kms:Decrypt on a key, but the key policy contains no statement referencing the account or the role. Can the role decrypt?',
                  solution: {
                    explanation:
                      'No. KMS access is governed by the key policy. If the key policy neither grants the role directly nor delegates to IAM (via the root principal), the IAM allow has no effect.',
                  },
                },
                {
                  type: 'task',
                  prompt:
                    'Describe how to separate key administration from key usage on a single KMS key.',
                  solution: {
                    explanation:
                      'In the key policy, grant administrators management actions (e.g. kms:Create*, kms:Put*, kms:ScheduleKeyDeletion) without usage actions, and grant users usage actions (kms:Encrypt, kms:Decrypt, kms:GenerateDataKey) without management - enforcing separation of duties.',
                  },
                },
              ],
              docs: 'https://docs.aws.amazon.com/kms/latest/developerguide/key-policies.html',
            },
            {
              id: 'scs5-t0-c1',
              services: [{ icon: 'kms', label: 'AWS KMS' }],
              title: 'Envelope encryption, data keys and grants',
              summary:
                'KMS does not encrypt large data directly; it uses envelope encryption - a data key encrypts the data, and KMS encrypts the data key. Grants provide temporary, granular delegation of key use, often by AWS services.',
              explanation:
                'KMS keys never leave the service unencrypted and can only directly encrypt small payloads (up to 4 KB). For real data you use envelope encryption: you call GenerateDataKey, which returns both a plaintext data key and an encrypted (wrapped) copy of it. You encrypt your data locally with the plaintext data key, then discard the plaintext from memory and store the encrypted data key alongside the ciphertext. To decrypt, you send the encrypted data key to KMS (Decrypt), get the plaintext data key back, decrypt the data, and discard the plaintext again. This keeps the master key in KMS, limits KMS calls (you can reuse a data key for many objects), and scales to large data - it is exactly how S3 SSE-KMS, EBS and most services encrypt. Grants are a second delegation mechanism alongside key policies: a grant gives a principal temporary, specific permissions to use a key (often with grant constraints like an encryption context), and AWS services create grants on your behalf to use your key transiently (e.g. EBS attaching an encrypted volume). Grants are ideal when you need short-lived, programmatic, least-privilege key access that you can revoke (RetireGrant/RevokeGrant) without editing the key policy. Encryption context is additional authenticated data (AAD) - key/value pairs bound to the ciphertext that must match on decrypt, giving an integrity check and finer access conditions.',
              analogy:
                'Envelope encryption is like locking your documents in a box with a cheap padlock (the data key), then locking that padlock\'s spare key inside a bank vault (KMS). You carry the box freely; only the vault can release the key to reopen it.',
              keyPoints: [
                'KMS encrypts directly only up to 4 KB; for larger data use envelope encryption.',
                'GenerateDataKey returns a plaintext data key (encrypt locally, then discard) and an encrypted data key (store with the ciphertext).',
                'Decrypt sends the encrypted data key back to KMS to recover the plaintext data key.',
                'Grants delegate temporary, granular key use - used by AWS services on your behalf; revocable without editing the key policy.',
                'Encryption context = authenticated key/value data bound to the ciphertext; must match on decrypt.',
              ],
              commonMistakes: [
                'Trying to encrypt large objects directly with KMS - it is limited to 4 KB; use envelope encryption.',
                'Keeping the plaintext data key in memory or storage instead of discarding it after use.',
                'Forgetting that a wrong/missing encryption context causes decryption to fail.',
              ],
              diagram: {
                type: 'mermaid',
                lines: [
                  'sequenceDiagram',
                  '  participant App',
                  '  participant KMS',
                  '  App->>KMS: GenerateDataKey',
                  '  KMS-->>App: plaintext key + encrypted key',
                  '  App->>App: encrypt data with plaintext key, discard plaintext',
                  '  App->>App: store ciphertext + encrypted key',
                ],
                caption: 'Envelope encryption: the data key encrypts the data; KMS holds the master key and wraps the data key.',
              },
              exercises: [
                {
                  type: 'quiz',
                  prompt:
                    'You must encrypt a 2 GB file with KMS protection. Why can you not pass the file directly to kms:Encrypt, and what do you do instead?',
                  solution: {
                    explanation:
                      'kms:Encrypt is limited to 4 KB. Use envelope encryption: call GenerateDataKey, encrypt the file locally with the returned plaintext data key, discard the plaintext, and store the encrypted data key with the ciphertext.',
                  },
                },
                {
                  type: 'quiz',
                  prompt:
                    'An AWS service needs temporary permission to use your KMS key to attach an encrypted volume, and you want to revoke it later without editing the key policy. What mechanism is used?',
                  solution: {
                    explanation:
                      'A KMS grant - it delegates temporary, constrained key usage and can be retired/revoked independently of the key policy.',
                  },
                },
              ],
              docs: 'https://docs.aws.amazon.com/kms/latest/developerguide/concepts.html',
            },
            {
              id: 'scs5-t0-c2',
              services: [{ icon: 'kms', label: 'AWS KMS' }, { icon: 'security', label: 'AWS CloudHSM' }],
              title: 'Key rotation, key material and CloudHSM',
              summary:
                'KMS supports automatic annual rotation of key material for customer-managed keys (transparently, keeping old versions for decryption); CloudHSM gives you single-tenant, FIPS 140-2 Level 3 hardware where you alone control the keys.',
              explanation:
                'For customer-managed symmetric keys, KMS offers automatic key rotation: enable it and KMS generates new cryptographic material every year (configurable down to a minimum), while retaining all previous versions so older ciphertext still decrypts - the key id and ARN never change, so applications are unaffected. Rotation is transparent and a common compliance requirement. You can also import your own key material (BYOK) or use a custom key store backed by CloudHSM. AWS CloudHSM provides dedicated, single-tenant Hardware Security Modules validated to FIPS 140-2 Level 3, where AWS cannot access your keys at all - used when regulations demand sole control of key material, custom cryptographic operations via standard APIs (PKCS#11, JCE, CNG/KSP), or offloading SSL/TLS. You can connect CloudHSM to KMS via a custom key store so KMS operations are backed by your HSM. The exam distinctions: KMS for managed, integrated, easy encryption with automatic rotation; CloudHSM when you need single-tenant FIPS 140-2 Level 3 control and standard crypto APIs; imported key material when you must generate keys outside AWS; and remember that AWS-managed keys rotate automatically on AWS\'s schedule while you control rotation for customer-managed keys.',
              keyPoints: [
                'Customer-managed key rotation: enable automatic ~annual rotation; old material is kept so existing ciphertext still decrypts; key id/ARN unchanged.',
                'You can import your own key material (BYOK) for keys that must originate outside AWS.',
                'CloudHSM: single-tenant, FIPS 140-2 Level 3 HSMs; AWS cannot access the keys; standard APIs (PKCS#11/JCE/CNG).',
                'A KMS custom key store can be backed by CloudHSM for sole control with KMS integration.',
                'KMS = managed/integrated/auto-rotation; CloudHSM = sole control + standard crypto APIs.',
              ],
              commonMistakes: [
                'Thinking automatic rotation re-encrypts existing data - it does not; old key versions are retained to decrypt old ciphertext.',
                'Choosing CloudHSM for ordinary managed encryption where KMS suffices - CloudHSM is for single-tenant/FIPS L3/standard-API needs.',
                'Believing AWS can recover keys in CloudHSM - it cannot; lose them and the data is unrecoverable.',
              ],
              exercises: [
                {
                  type: 'quiz',
                  prompt:
                    'A compliance rule requires encryption keys to rotate yearly without breaking access to data encrypted under older keys. What do you enable on a customer-managed KMS key?',
                  solution: {
                    explanation:
                      'Automatic key rotation - KMS generates new material annually and retains previous versions so old ciphertext still decrypts; the key id/ARN stays the same so apps are unaffected.',
                  },
                },
                {
                  type: 'quiz',
                  prompt:
                    'Regulations require single-tenant, FIPS 140-2 Level 3 hardware where AWS has no access to the key material, with PKCS#11 support. Which service?',
                  solution: {
                    explanation:
                      'AWS CloudHSM - dedicated single-tenant HSMs at FIPS 140-2 Level 3 with standard crypto APIs; AWS cannot access your keys.',
                  },
                },
              ],
              docs: 'https://docs.aws.amazon.com/kms/latest/developerguide/rotate-keys.html',
            },
          ],
        },
        {
          id: 'scs5-t1',
          name: 'Data encryption in services',
          concepts: [
            {
              id: 'scs5-t1-c0',
              services: [{ icon: 's3', label: 'Amazon S3' }, { icon: 'kms', label: 'AWS KMS' }],
              title: 'S3 encryption options and bucket policies',
              summary:
                'S3 encrypts every object at rest by default (SSE-S3); you can choose SSE-KMS for audited, policy-controlled keys, SSE-C for customer-provided keys, or client-side encryption. Bucket policies and Block Public Access enforce access and TLS.',
              explanation:
                'S3 now applies server-side encryption to all new objects by default with SSE-S3 (S3-managed keys, AES-256). For more control you choose SSE-KMS, where a KMS key encrypts each object\'s data key - giving you CloudTrail audit of every encrypt/decrypt, key policies, and rotation; SSE-KMS with S3 Bucket Keys reduces KMS request volume and cost by deriving a bucket-level data key. SSE-C lets you supply the encryption key on each request (AWS uses it and discards it - you manage the key entirely). Client-side encryption means you encrypt before upload so S3 only ever sees ciphertext. On the access-control side, S3 layers several protections: the bucket policy (resource policy) is the central control, S3 Block Public Access overrides any policy/ACL that would make data public (enable it at the account and bucket level as a guardrail), and ACLs are now largely discouraged in favour of policies. Common policy patterns enforce encryption-in-transit (Deny when aws:SecureTransport is false) and require a specific KMS key or that uploads specify SSE-KMS (Deny PutObject lacking the right s3:x-amz-server-side-encryption header). For compliance, S3 Object Lock provides WORM immutability. Versioning plus MFA Delete protects against accidental or malicious deletion.',
              keyPoints: [
                'Default at-rest encryption is SSE-S3; choose SSE-KMS for audit/policy/rotation (use S3 Bucket Keys to cut KMS cost).',
                'SSE-C = you provide the key per request; client-side = encrypt before upload so S3 sees only ciphertext.',
                'Bucket policy is the central access control; S3 Block Public Access is a guardrail that overrides public grants.',
                'Enforce TLS with a Deny on aws:SecureTransport=false; enforce SSE-KMS uploads with a header condition.',
                'Object Lock = WORM immutability; Versioning + MFA Delete protects against deletion.',
              ],
              commonMistakes: [
                'Relying on ACLs instead of bucket policies and Block Public Access for access control.',
                'Forgetting that SSE-KMS without S3 Bucket Keys can generate high KMS request costs and throttling at scale.',
                'Assuming default encryption protects in transit - encryption at rest and a TLS-enforcing policy are separate concerns.',
              ],
              code: {
                language: 'json',
                lines: [
                  '{',
                  '  "Effect": "Deny",',
                  '  "Principal": "*",',
                  '  "Action": "s3:PutObject",',
                  '  "Resource": "arn:aws:s3:::data-bucket/*",',
                  '  "Condition": {',
                  '    "StringNotEquals": {',
                  '      "s3:x-amz-server-side-encryption": "aws:kms"',
                  '    }',
                  '  }',
                  '}',
                ],
                explanation:
                  'A bucket-policy statement that denies any upload not using SSE-KMS, forcing all objects to be encrypted with a KMS key.',
              },
              exercises: [
                {
                  type: 'quiz',
                  prompt:
                    'You need an audit trail of every decrypt of objects in an S3 bucket and control over the key via a policy. Which encryption option and which service provides the audit?',
                  solution: {
                    explanation:
                      'SSE-KMS - the KMS key controls access and every encrypt/decrypt is logged in CloudTrail, giving the audit trail and policy control SSE-S3 cannot.',
                  },
                },
                {
                  type: 'task',
                  prompt:
                    'How do you guarantee no object can ever be uploaded to a bucket unencrypted with KMS?',
                  solution: {
                    explanation:
                      'Add a bucket policy that denies s3:PutObject when the s3:x-amz-server-side-encryption header is not aws:kms (and optionally pin the specific key id), rejecting any non-SSE-KMS upload.',
                  },
                },
                {
                  type: 'quiz',
                  prompt:
                    'Despite a bucket policy granting public read, you want a guardrail that guarantees the bucket can never be made public. What do you enable?',
                  solution: {
                    explanation:
                      'S3 Block Public Access at the bucket (and account) level - it overrides any policy or ACL that would grant public access.',
                  },
                },
              ],
              docs: 'https://docs.aws.amazon.com/AmazonS3/latest/userguide/UsingKMSEncryption.html',
            },
            {
              id: 'scs5-t1-c1',
              services: [{ icon: 'secretsmanager', label: 'Secrets Manager' }, { icon: 'systemsmanager', label: 'Parameter Store' }],
              title: 'Secrets Manager, Parameter Store and certificate management',
              summary:
                'Secrets Manager stores and automatically rotates secrets like database credentials with fine-grained access and KMS encryption; SSM Parameter Store is a cheaper option for config and simple secrets; ACM provisions and auto-renews TLS certificates.',
              explanation:
                'Hard-coded credentials are a top breach cause. AWS Secrets Manager stores secrets encrypted with KMS, controls access with resource policies and IAM, logs retrieval via CloudTrail, and - its differentiator - rotates secrets automatically using a Lambda rotation function (with native integration for RDS, Redshift, DocumentDB and more) so credentials change on a schedule without code changes. Applications fetch the current secret at runtime via the API. SSM Parameter Store offers a hierarchical store for configuration and secrets: standard parameters are free, SecureString parameters are KMS-encrypted, and it integrates broadly - it is the cost-effective choice when you do not need built-in rotation (you can still rotate with your own automation). The exam rule of thumb: choose Secrets Manager when you need automatic rotation and managed secret lifecycle; choose Parameter Store for plain configuration and simple, lower-cost secrets. AWS Certificate Manager (ACM) provisions public and private TLS/SSL certificates, deploys them to integrated services (CloudFront, ALB, API Gateway), and auto-renews public certs so they never silently expire - keys are managed by ACM and never exposed. For private PKI, ACM Private CA issues internal certificates. Together these eliminate plaintext secrets and manual certificate handling.',
              keyPoints: [
                'Secrets Manager: KMS-encrypted secrets with automatic rotation via Lambda; native rotation for RDS/Redshift/DocumentDB.',
                'Parameter Store: hierarchical config + SecureString secrets; cheaper, no built-in rotation.',
                'Rule of thumb: rotation/managed lifecycle -> Secrets Manager; plain config/simple secrets -> Parameter Store.',
                'ACM: provisions and auto-renews public TLS certs, deploys to CloudFront/ALB/API Gateway; keys never exposed.',
                'ACM Private CA issues internal certificates for private PKI.',
              ],
              commonMistakes: [
                'Hard-coding credentials in code/AMIs instead of fetching from Secrets Manager/Parameter Store at runtime.',
                'Choosing Secrets Manager for static config where Parameter Store is cheaper, or Parameter Store where you actually need rotation.',
                'Manually managing TLS certs that then expire - use ACM for automatic renewal on integrated services.',
              ],
              diagram: {
                type: 'mermaid',
                lines: [
                  'flowchart LR',
                  '  SM[Secrets Manager] -->|rotates| RDS[(RDS credentials)]',
                  '  App[Application] -->|GetSecretValue| SM',
                  '  SM --> KMS[KMS encrypts secret]',
                ],
                caption: 'Secrets Manager stores KMS-encrypted credentials and rotates them automatically; apps fetch at runtime.',
              },
              exercises: [
                {
                  type: 'quiz',
                  prompt:
                    'A database password must rotate every 30 days automatically without redeploying the application. Which service and feature?',
                  solution: {
                    explanation:
                      'AWS Secrets Manager with automatic rotation (a Lambda rotation function, natively integrated for RDS) - the app always fetches the current secret at runtime, so rotation needs no code change.',
                  },
                },
                {
                  type: 'quiz',
                  prompt:
                    'You need TLS certificates on an Application Load Balancer that renew automatically and whose private keys are never exposed. Which service?',
                  solution: {
                    explanation:
                      'AWS Certificate Manager (ACM) - it provisions, deploys to the ALB, and auto-renews public certificates while managing the private keys internally.',
                  },
                },
              ],
              docs: 'https://docs.aws.amazon.com/secretsmanager/latest/userguide/intro.html',
            },
            {
              id: 'scs5-t1-c2',
              services: [{ icon: 'macie', label: 'Amazon Macie' }],
              title: 'Amazon Macie: discovering sensitive data',
              summary:
                'Amazon Macie uses machine learning and pattern matching to discover, classify and report on sensitive data such as PII and credentials stored in Amazon S3, helping you find where regulated data lives and whether it is exposed.',
              explanation:
                'You cannot protect what you do not know you have. Amazon Macie continuously evaluates your S3 estate: it inventories buckets and flags risk posture (public buckets, unencrypted buckets, buckets shared outside the Organization), and it runs sensitive-data discovery jobs that sample and inspect object contents using managed identifiers (credit card numbers, names, addresses, government IDs, AWS secret keys) and your own custom data identifiers (regex). Findings - for example, "this bucket contains credit-card data and is publicly readable" - flow to Security Hub and EventBridge so you can alert or remediate automatically. Macie is the answer whenever a scenario asks how to locate PII/regulated data in S3, prove which buckets hold sensitive content for a compliance audit, or detect that sensitive data has been left in a public bucket. It complements, rather than replaces, encryption and access controls: Macie tells you where the sensitive data is and how exposed it is, so you can apply KMS encryption, tighten bucket policies, and enable Block Public Access where needed.',
              keyPoints: [
                'Macie discovers and classifies sensitive data (PII, financial, credentials) in Amazon S3 using ML + pattern matching.',
                'Managed data identifiers cover common sensitive types; custom identifiers (regex) cover your own.',
                'Also reports bucket risk posture: public, unencrypted, or externally shared buckets.',
                'Findings integrate with Security Hub and EventBridge for alerting/auto-remediation.',
                'It finds and reports - you still apply encryption, bucket policies and Block Public Access to protect.',
              ],
              commonMistakes: [
                'Expecting Macie to scan databases or EBS - it focuses on Amazon S3.',
                'Thinking Macie encrypts or protects data - it discovers/classifies; remediation uses KMS, policies and Block Public Access.',
              ],
              exercises: [
                {
                  type: 'quiz',
                  prompt:
                    'A compliance audit requires identifying every S3 bucket that contains credit-card numbers or other PII, and flagging any that are publicly accessible. Which service?',
                  solution: {
                    explanation:
                      'Amazon Macie - it classifies sensitive data in S3 via managed/custom identifiers and reports buckets that are public, unencrypted, or externally shared.',
                  },
                },
                {
                  type: 'task',
                  prompt:
                    'How would you turn a Macie finding of "PII in a public bucket" into automatic remediation?',
                  solution: {
                    explanation:
                      'Route the Macie finding through EventBridge (or Security Hub) to a Lambda/SSM Automation that enables Block Public Access and tightens the bucket policy, then notifies the security team.',
                  },
                },
              ],
              docs: 'https://docs.aws.amazon.com/macie/latest/user/what-is-macie.html',
            },
          ],
        },
      ],
    },

    /* ─────────── DOMAIN 6 — MANAGEMENT AND SECURITY GOVERNANCE (14%) ─────────── */
    {
      level: 6,
      name: 'Governance',
      focus: 'Governing many accounts at scale - Organizations and SCPs, Control Tower, Config conformance packs, Audit Manager, Artifact and the economics of security (Domain 6 · 14%)',
      accent: '#2e73b8',
      soft: '#e7f0fa',
      topics: [
        {
          id: 'scs6-t0',
          name: 'Multi-account governance',
          concepts: [
            {
              id: 'scs6-t0-c0',
              services: [{ icon: 'organizations', label: 'AWS Organizations' }],
              title: 'Organizations and Service Control Policies',
              summary:
                'AWS Organizations groups accounts under organizational units (OUs) and applies Service Control Policies (SCPs) - guardrails that define the maximum permissions any principal in an account can have, including the root user.',
              explanation:
                'Organizations is the foundation of multi-account security. You arrange accounts into OUs (e.g. Production, Sandbox, Security) and attach SCPs at the root, OU or account level; an SCP applies to every principal in the affected accounts - even the account root user, which no other control can restrict. The vital point that the exam stresses: SCPs are filters, not grants. An action is permitted only if it is allowed by BOTH the SCP (the ceiling) AND an IAM policy in the account (the actual grant); an SCP can never give permissions, only take them away. There are two SCP strategies: deny lists (start from the default FullAWSAccess and add explicit Deny statements to block specific actions - the common approach) and allow lists (remove FullAWSAccess and explicitly allow only what is permitted - more restrictive and harder to maintain). Typical guardrails: deny disabling CloudTrail/GuardDuty/Config, deny leaving the Organization, deny use of unapproved Regions (with a condition on aws:RequestedRegion), and prevent root user actions. The management account is special - SCPs do not restrict it, so keep workloads out of it. Combined with consolidated billing and delegated administration, Organizations lets a central security team enforce non-negotiable boundaries across the whole estate.',
              keyPoints: [
                'OUs group accounts; SCPs attach at root/OU/account and apply to every principal, including root.',
                'SCPs are guardrails that CAP permissions - they never grant; the effective permission is SCP AND IAM.',
                'Deny-list strategy (keep FullAWSAccess, add Denies) is the common, maintainable approach.',
                'Common SCP guardrails: prevent disabling CloudTrail/Config/GuardDuty, block unapproved Regions, deny leaving the org.',
                'SCPs do not restrict the management account - keep workloads out of it.',
              ],
              commonMistakes: [
                'Believing an SCP grants access - it only sets the maximum; you still need an IAM allow.',
                'Putting workloads in the management account, where SCPs do not apply.',
                'Forgetting that an SCP deny overrides everything in the member account, including admin IAM policies.',
              ],
              code: {
                language: 'json',
                lines: [
                  '{',
                  '  "Version": "2012-10-17",',
                  '  "Statement": [',
                  '    {',
                  '      "Sid": "DenyDisablingGuardrails",',
                  '      "Effect": "Deny",',
                  '      "Action": [',
                  '        "cloudtrail:StopLogging",',
                  '        "guardduty:DeleteDetector",',
                  '        "config:DeleteConfigurationRecorder"',
                  '      ],',
                  '      "Resource": "*"',
                  '    }',
                  '  ]',
                  '}',
                ],
                explanation:
                  'An SCP guardrail that prevents any principal in the affected accounts (including admins and root) from disabling CloudTrail, GuardDuty or Config.',
              },
              diagram: {
                type: 'mermaid',
                lines: [
                  'flowchart TB',
                  '  Root[Org root] --> Prod[OU: Production + SCP]',
                  '  Root --> Sand[OU: Sandbox + SCP]',
                  '  Prod --> A1[Account]',
                  '  Sand --> A2[Account]',
                ],
                caption: 'SCPs attached to OUs cap what every account beneath them can do, regardless of their IAM policies.',
              },
              exercises: [
                {
                  type: 'quiz',
                  prompt:
                    'Security must ensure no one - not even an account admin or the root user - can stop CloudTrail logging in any production account. Which control?',
                  solution: {
                    explanation:
                      'A Service Control Policy attached to the Production OU that denies cloudtrail:StopLogging. SCPs apply to all principals including root and cannot be overridden by member-account IAM policies.',
                  },
                },
                {
                  type: 'predict',
                  prompt:
                    'An account\'s IAM policy allows ec2:RunInstances, but the OU\'s SCP does not include it in an allow list (and FullAWSAccess was removed). Can the user launch instances?',
                  solution: {
                    explanation:
                      'No. With an allow-list SCP that omits ec2:RunInstances, the action is outside the permitted ceiling, so it is denied regardless of the IAM allow.',
                  },
                },
              ],
              docs: 'https://docs.aws.amazon.com/organizations/latest/userguide/orgs_manage_policies_scps.html',
            },
            {
              id: 'scs6-t0-c1',
              services: [{ icon: 'controltower', label: 'AWS Control Tower' }],
              title: 'Control Tower landing zones and guardrails',
              summary:
                'AWS Control Tower automates the setup of a secure, multi-account landing zone with preconfigured guardrails, a central log archive and audit account, and ongoing governance built on Organizations, Config and SCPs.',
              explanation:
                'Building a well-governed multi-account environment by hand is error-prone; Control Tower automates it. It sets up a landing zone - a baseline multi-account structure with a management account, a dedicated Log Archive account (centralised CloudTrail/Config logs) and an Audit (security) account for cross-account access by security tooling - and applies guardrails. Guardrails come in two enforcement types: preventive guardrails are implemented as SCPs that stop disallowed actions outright (e.g. disallow disabling encryption), and detective guardrails are implemented as AWS Config rules that detect and flag non-compliant resources (e.g. detect unencrypted EBS volumes). Guardrails are also categorised as mandatory, strongly recommended, or elective. Account Factory provisions new accounts that automatically inherit the baseline guardrails and configuration, so every new account starts compliant. Control Tower gives a dashboard of compliance status across accounts. The exam framing: Control Tower is the fast path to a secure, governed landing zone; it does not replace Organizations/Config/SCPs but orchestrates them. Use it when a scenario wants standardised, auto-governed account provisioning with built-in security baselines, rather than wiring everything manually.',
              keyPoints: [
                'Sets up a landing zone: management + Log Archive + Audit accounts with centralised logging.',
                'Preventive guardrails = SCPs (block actions); detective guardrails = Config rules (flag non-compliance).',
                'Guardrails are mandatory, strongly recommended, or elective.',
                'Account Factory provisions new accounts that inherit the security baseline automatically.',
                'Orchestrates Organizations, Config and SCPs - the fast path to a governed multi-account setup.',
              ],
              commonMistakes: [
                'Confusing preventive guardrails (SCPs, block) with detective guardrails (Config rules, detect).',
                'Thinking Control Tower replaces Organizations/Config - it builds on and automates them.',
              ],
              exercises: [
                {
                  type: 'quiz',
                  prompt:
                    'A company wants every newly created AWS account to start with centralised logging, a dedicated audit account, and a set of security guardrails - without configuring it all manually each time. Which service?',
                  solution: {
                    explanation:
                      'AWS Control Tower - its landing zone and Account Factory provision new accounts with the Log Archive/Audit accounts and inherited guardrails automatically.',
                  },
                },
                {
                  type: 'quiz',
                  prompt:
                    'In Control Tower, which guardrail type is implemented with Config rules to detect (not block) non-compliant resources?',
                  solution: {
                    explanation:
                      'Detective guardrails - they use AWS Config rules to flag non-compliance, whereas preventive guardrails use SCPs to block actions.',
                  },
                },
              ],
              docs: 'https://docs.aws.amazon.com/controltower/latest/userguide/what-is-control-tower.html',
            },
          ],
        },
        {
          id: 'scs6-t1',
          name: 'Compliance & audit',
          concepts: [
            {
              id: 'scs6-t1-c0',
              services: [{ icon: 'config', label: 'AWS Config' }, { icon: 'security', label: 'AWS Audit Manager' }],
              title: 'Config conformance packs and Audit Manager',
              summary:
                'Config conformance packs bundle Config rules and remediations as a single deployable unit you can roll out across the Organization; AWS Audit Manager continuously collects evidence and maps it to compliance frameworks to streamline audits.',
              explanation:
                'At scale you do not want to manage Config rules one at a time. A conformance pack is a packaged collection of Config rules plus their remediation actions, defined in a YAML template, that you deploy as one immutable unit to an account or - via the delegated administrator - across the whole Organization. AWS publishes sample conformance packs mapped to frameworks (PCI DSS, HIPAA, CIS, operational best practices), so you can apply a curated compliance baseline and track an aggregated compliance score. Where Config measures technical compliance continuously, AWS Audit Manager addresses the audit workflow: it continuously collects evidence (from CloudTrail, Config, Security Hub and other sources), maps that evidence to the controls of prebuilt frameworks (such as SOC 2, PCI DSS, GDPR, HIPAA), and assembles assessment reports - turning the manual scramble of gathering screenshots and logs at audit time into a continuous, automated process. The exam distinction: Config rules/conformance packs enforce and measure resource compliance; Audit Manager gathers and organises the evidence and maps it to frameworks for auditors; Security Hub scores security posture. They are complementary layers of the compliance story.',
              keyPoints: [
                'Conformance pack = a deployable bundle of Config rules + remediations (YAML), rolled out account-wide or Organization-wide.',
                'AWS provides sample packs mapped to PCI DSS, HIPAA, CIS, operational best practices.',
                'Audit Manager continuously collects evidence (CloudTrail, Config, Security Hub) and maps it to framework controls.',
                'Audit Manager prebuilt frameworks: SOC 2, PCI DSS, GDPR, HIPAA, and custom frameworks.',
                'Config/conformance packs measure compliance; Audit Manager organises evidence for auditors; Security Hub scores posture.',
              ],
              commonMistakes: [
                'Confusing Config conformance packs (measure/enforce technical compliance) with Audit Manager (collect/organise evidence for audits).',
                'Managing Config rules individually across many accounts instead of deploying a conformance pack via the delegated admin.',
              ],
              exercises: [
                {
                  type: 'quiz',
                  prompt:
                    'You want to deploy a curated set of Config rules mapped to PCI DSS, as one package, across all accounts in your Organization. What do you use?',
                  solution: {
                    explanation:
                      'An AWS Config conformance pack (a bundle of rules + remediations) deployed Organization-wide via the Config delegated administrator.',
                  },
                },
                {
                  type: 'quiz',
                  prompt:
                    'An auditor needs continuously collected evidence mapped to SOC 2 controls so the audit does not require manually gathering logs and screenshots. Which service?',
                  solution: {
                    explanation:
                      'AWS Audit Manager - it continuously collects evidence and maps it to framework controls like SOC 2, producing assessment reports.',
                  },
                },
              ],
              docs: 'https://docs.aws.amazon.com/config/latest/developerguide/conformance-packs.html',
            },
            {
              id: 'scs6-t1-c1',
              services: [{ icon: 'artifact', label: 'AWS Artifact' }, { icon: 'security', label: 'AWS Security Hub' }],
              title: 'AWS Artifact, compliance frameworks and posture standards',
              summary:
                'AWS Artifact is the self-service portal for AWS\'s own compliance reports (SOC, ISO, PCI) and agreements; under the shared responsibility model, AWS certifies the infrastructure while you must configure and prove your own compliance, often measured by Security Hub standards.',
              explanation:
                'Compliance on AWS is shared. AWS Artifact provides on-demand access to AWS\'s third-party audit reports and certifications - SOC 1/2/3, ISO 27001/27017/27018, PCI DSS Attestation of Compliance, FedRAMP packages - and to legal agreements such as the AWS Business Associate Addendum (BAA) for HIPAA and GDPR-related terms. You download these to show auditors that the underlying AWS infrastructure is certified. But Artifact only covers AWS\'s side: you remain responsible for configuring your workloads to meet the same standards and for proving it - that is where Security Hub standards (AWS Foundational Security Best Practices, CIS, PCI DSS, NIST), Config conformance packs and Audit Manager come in to measure and evidence your portion. The exam pattern: when asked where to get AWS\'s SOC or PCI reports, the answer is Artifact; when asked how to continuously measure and score your own resources against a benchmark, the answer is Security Hub security standards. Knowing which compliance frameworks map to which services - and that responsibility is split between AWS (infrastructure, via Artifact reports) and the customer (configuration, via detective/posture tooling) - is what these governance questions test.',
              keyPoints: [
                'AWS Artifact: self-service download of AWS audit reports/certifications (SOC, ISO, PCI, FedRAMP) and agreements (BAA, GDPR).',
                'Artifact proves AWS\'s side; you must still configure and evidence your own compliance.',
                'Security Hub standards (FSBP, CIS, PCI DSS, NIST) continuously score your resources against benchmarks.',
                'Config conformance packs + Audit Manager evidence your portion of compliance.',
                'Shared responsibility for compliance: AWS certifies infrastructure (Artifact), customer configures workloads (posture tooling).',
              ],
              commonMistakes: [
                'Thinking an AWS SOC 2 report from Artifact proves your application is compliant - it only covers AWS infrastructure.',
                'Confusing Artifact (download AWS\'s reports) with Audit Manager (collect your own evidence) or Security Hub (score your posture).',
              ],
              exercises: [
                {
                  type: 'quiz',
                  prompt:
                    'An external auditor asks for AWS\'s SOC 2 Type II report and PCI DSS Attestation of Compliance. Where do you obtain these on demand?',
                  solution: {
                    explanation:
                      'AWS Artifact - the self-service portal for AWS\'s third-party audit reports and certifications.',
                  },
                },
                {
                  type: 'predict',
                  prompt:
                    'You downloaded AWS\'s ISO 27001 certificate from Artifact. Does that make your S3 buckets and IAM configuration compliant?',
                  solution: {
                    explanation:
                      'No. Artifact certifies the AWS infrastructure only. Your own configuration must still be hardened and evidenced - use Security Hub standards, Config conformance packs and Audit Manager for your portion.',
                  },
                },
              ],
              docs: 'https://docs.aws.amazon.com/artifact/latest/ug/what-is-aws-artifact.html',
            },
          ],
        },
        {
          id: 'scs6-t2',
          name: 'Cost & operational governance',
          concepts: [
            {
              id: 'scs6-t2-c0',
              services: [{ icon: 'budgets', label: 'AWS Budgets' }, { icon: 'guardduty', label: 'Amazon GuardDuty' }, { icon: 'config', label: 'AWS Config' }],
              title: 'The cost of security and operational trade-offs',
              summary:
                'Security services are not free, and the exam expects you to balance protection against cost - choosing the right scope, sampling and feature set, and using budgets and alerts so security controls do not produce runaway bills or get disabled.',
              explanation:
                'Security has a price, and well-architected security weighs control strength against cost and operational burden. Several services bill on usage: GuardDuty charges by analysed event/log volume; Config charges per configuration item recorded and per rule evaluation; CloudTrail data events and S3 storage of logs add up; Inspector and Macie charge by what they scan; SSE-KMS bills per request (mitigated by S3 Bucket Keys); and centralised logging incurs S3 storage and Athena scan costs. Cost-aware decisions include: enable Config recording only for the resource types you need, scope Macie discovery jobs and sample rather than scanning everything, use S3 Bucket Keys to cut KMS request charges, set log retention so logs expire, and partition logs to limit Athena scans. Use AWS Budgets to alert when security-service spend crosses thresholds (and Cost Explorer to attribute spend with cost-allocation tags), so security controls remain enabled rather than being switched off to save money - which would be the worst outcome. The governance principle: security must be sustainable. Right-size the detective controls, automate to reduce human cost, and treat the spend on logging, detection and encryption as a deliberate, monitored investment - not an afterthought that surprises the bill and tempts teams to disable protections.',
              keyPoints: [
                'Usage-billed security services: GuardDuty (events), Config (items/evaluations), CloudTrail data events, Inspector/Macie (scanned data), SSE-KMS (requests).',
                'Cut cost without losing protection: scope Config to needed resources, sample Macie jobs, use S3 Bucket Keys, set log retention, partition logs for Athena.',
                'Use AWS Budgets to alert on security-service spend and Cost Explorer + cost-allocation tags to attribute it.',
                'Never disable detective controls to save money - automate and right-size instead.',
                'Treat logging, detection and encryption spend as a deliberate, monitored investment.',
              ],
              commonMistakes: [
                'Enabling Config to record all resource types globally and being surprised by configuration-item costs.',
                'Running SSE-KMS at high request volume without S3 Bucket Keys, triggering high KMS charges and throttling.',
                'Disabling GuardDuty/Config to cut cost - removing visibility is far more expensive after a breach.',
              ],
              diagram: {
                type: 'mermaid',
                lines: [
                  'flowchart LR',
                  '  Sec[Security services] --> Cost[Usage-based cost]',
                  '  Cost --> B[AWS Budgets alert]',
                  '  Cost --> Opt[Scope + sample + Bucket Keys + retention]',
                  '  Opt --> Sus[Sustainable protection]',
                ],
                caption: 'Balance detective control coverage against cost: scope, sample and alert so protections stay on.',
              },
              exercises: [
                {
                  type: 'quiz',
                  prompt:
                    'SSE-KMS on a high-traffic S3 bucket is generating large KMS request charges and occasional throttling. What feature reduces this without abandoning KMS encryption?',
                  solution: {
                    explanation:
                      'Enable S3 Bucket Keys - S3 derives a bucket-level data key, drastically reducing the number of KMS requests (and cost/throttling) while keeping SSE-KMS protection.',
                  },
                },
                {
                  type: 'task',
                  prompt:
                    'Give two ways to control AWS Config cost while keeping the compliance checks that matter.',
                  solution: {
                    explanation:
                      'Record only the resource types you need (rather than all), and limit the number/frequency of rules; you can also use an aggregator instead of duplicating rules per account. Set log/S3 retention to avoid indefinite storage.',
                  },
                },
                {
                  type: 'predict',
                  prompt:
                    'A team proposes turning off GuardDuty in non-production accounts to save money. What is the governance risk?',
                  solution: {
                    explanation:
                      'Loss of threat visibility in those accounts - attackers often pivot through less-watched environments. The cost of an undetected breach typically far exceeds GuardDuty\'s usage charge; right-size or use suppression rules instead of disabling it.',
                  },
                },
              ],
              docs: 'https://docs.aws.amazon.com/whitepapers/latest/aws-overview/security-and-compliance.html',
            },
          ],
        },
      ],
    },
  ],
};

export default content;
