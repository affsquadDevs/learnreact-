// AWS Certified CloudOps Engineer – Associate — course content.
// A complete, structured study path for the AWS Certified CloudOps Engineer – Associate
// exam (exam code SOA-C02; formerly the SysOps Administrator – Associate certification,
// recently rebranded). The factual material (service names and what they do) is rewritten
// in our own words for self-study; diagrams are our own Mermaid creations.
// Not affiliated with or endorsed by AWS.
//
// Exam domains & weightings (SOA-C02):
//   1. Monitoring, Logging, and Remediation ........ 20%
//   2. Reliability and Business Continuity .......... 16%
//   3. Deployment, Provisioning, and Automation ..... 18%
//   4. Security and Compliance ...................... 16%
//   5. Networking and Content Delivery .............. 18%
//   6. Cost and Performance Optimization ............ 12%

const content = {
  meta: {
    title: 'AWS Certified CloudOps Engineer – Associate',
    description:
      'A complete, operations-focused path to the AWS Certified CloudOps Engineer – Associate exam (SOA-C02, formerly SysOps Administrator – Associate). Covers monitoring and remediation with CloudWatch, CloudTrail and Config; reliability and business continuity with Auto Scaling, ELB, AWS Backup and Route 53 failover; deployment and automation with CloudFormation and Systems Manager; security and compliance auditing; networking and content delivery; and cost and performance optimization — with diagrams, JSON/CLI snippets, quizzes and hands-on tasks.',
    schemaVersion: '1.0',
    status: 'complete',
  },
  levels: [
    /* ───────────── DOMAIN 1 — MONITORING, LOGGING, AND REMEDIATION (20%) ───────────── */
    {
      level: 1,
      name: 'Monitoring & Remediation',
      focus: 'Collect metrics and logs, alarm on them, audit activity, and remediate automatically (Domain 1 · 20%)',
      accent: '#2d6bff',
      soft: '#eaf0ff',
      topics: [
        {
          id: 'soa1-t0',
          name: 'CloudWatch metrics & alarms',
          concepts: [
            {
              id: 'soa1-t0-c0',
              services: [{ icon: 'cloudwatch', label: 'Amazon CloudWatch' }],
              title: 'CloudWatch metrics, namespaces, and dimensions',
              summary:
                'CloudWatch is the central metrics store for AWS. Metrics live in namespaces, are identified by dimensions, and arrive at standard or detailed resolution.',
              explanation:
                'Amazon CloudWatch collects numeric time-series data called metrics. Every metric belongs to a namespace (a container such as AWS/EC2 or AWS/RDS) and is uniquely identified by its name plus a set of dimensions — name/value pairs like InstanceId=i-123 that scope the data. AWS services publish many metrics for free. For EC2, basic monitoring delivers data points every 5 minutes; detailed monitoring delivers them every 1 minute for an extra charge. CloudWatch retains data with decreasing granularity: 1-minute points for 15 days, 5-minute points for 63 days, and 1-hour points for 455 days. Two crucial gaps to remember: CloudWatch has no built-in memory-utilization or disk-space metric for EC2, because those live inside the guest OS — you must install the CloudWatch agent to publish them. You can also push your own application data as custom metrics (standard 1-minute resolution, or high-resolution down to 1 second).',
              analogy:
                'Think of CloudWatch as the dashboard of your car. The factory gauges (speed, fuel, temperature) are the built-in metrics; if you want tyre pressure too, you bolt on an extra sensor — that sensor is the CloudWatch agent.',
              keyPoints: [
                'Metric = a time series; lives in a namespace (e.g. AWS/EC2) and is scoped by dimensions (e.g. InstanceId).',
                'EC2 basic monitoring = 5-minute data points (free); detailed monitoring = 1-minute (paid).',
                'No built-in EC2 memory or disk-space metric — install the CloudWatch agent to get them.',
                'Custom metrics: standard (1-minute) or high-resolution (down to 1-second).',
                'Retention shrinks granularity over time: 1-min for 15 days, up to 1-hour for 455 days.',
              ],
              commonMistakes: [
                'Looking for a "MemoryUtilization" metric in the AWS/EC2 namespace — it does not exist without the CloudWatch agent.',
                'Assuming every metric is 1-minute by default; without detailed monitoring, EC2 is 5-minute.',
              ],
              exercises: [
                {
                  type: 'quiz',
                  prompt:
                    'An engineer needs to alarm on EC2 memory usage but cannot find a memory metric in CloudWatch. What must be done first?',
                  hint: 'The metric source lives inside the OS.',
                  solution: {
                    explanation:
                      'Install and configure the CloudWatch agent on the instance to publish memory (and disk) metrics as custom metrics — AWS/EC2 provides no built-in memory metric.',
                  },
                },
                {
                  type: 'quiz',
                  prompt: 'What is the data-point interval for EC2 basic monitoring versus detailed monitoring?',
                  solution: {
                    explanation: 'Basic = 5-minute intervals (free); detailed = 1-minute intervals (additional charge).',
                  },
                },
                {
                  type: 'task',
                  prompt: 'Describe what uniquely identifies a single CloudWatch metric.',
                  solution: {
                    explanation:
                      'A namespace, a metric name, and a set of dimensions (name/value pairs). Change any dimension and you are referring to a different metric.',
                  },
                },
              ],
              docs: 'https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/cloudwatch_concepts.html',
            },
            {
              id: 'soa1-t0-c1',
              services: [{ icon: 'cloudwatch', label: 'Amazon CloudWatch' }, { icon: 'sns', label: 'Amazon SNS' }],
              title: 'CloudWatch alarms, states, and actions',
              summary:
                'A CloudWatch alarm watches a single metric (or a metric math expression) and changes state — OK, ALARM, or INSUFFICIENT_DATA — to trigger notifications or automated actions.',
              explanation:
                'A CloudWatch alarm evaluates a metric against a threshold over a number of periods. You define the statistic (Average, Sum, Maximum, etc.), the period, the comparison operator, the threshold, and how many evaluation periods must breach before the alarm fires (the "M out of N" datapoints-to-alarm setting smooths out spikes). Alarms have three states: OK (within threshold), ALARM (threshold breached), and INSUFFICIENT_DATA (not enough data yet, e.g. just created or the resource is stopped). Each state change can trigger actions: send a notification to an Amazon SNS topic, perform an EC2 action (stop, terminate, reboot, recover), or trigger an Auto Scaling policy. You can control how missing data is treated (missing, notBreaching, breaching, or ignore). A composite alarm combines several alarms with AND/OR logic to cut alarm noise.',
              keyPoints: [
                'Alarm states: OK, ALARM, INSUFFICIENT_DATA.',
                'Tune sensitivity with evaluation periods and "M out of N" datapoints-to-alarm.',
                'Actions: notify an SNS topic, run an EC2 action (recover/stop/terminate/reboot), or scale via Auto Scaling.',
                'Missing-data treatment options: missing, notBreaching, breaching, ignore.',
                'Composite alarms combine alarms with AND/OR to reduce noise; EC2 recovery needs the StatusCheckFailed_System alarm.',
              ],
              code: {
                language: 'bash',
                lines: [
                  'aws cloudwatch put-metric-alarm \\',
                  '  --alarm-name high-cpu \\',
                  '  --namespace AWS/EC2 \\',
                  '  --metric-name CPUUtilization \\',
                  '  --dimensions Name=InstanceId,Value=i-0abc123 \\',
                  '  --statistic Average --period 300 \\',
                  '  --evaluation-periods 2 --threshold 80 \\',
                  '  --comparison-operator GreaterThanThreshold \\',
                  '  --alarm-actions arn:aws:sns:eu-west-1:111122223333:ops-alerts',
                ],
                explanation:
                  'Creates an alarm that fires when average CPU stays above 80% for two consecutive 5-minute periods, notifying an SNS topic.',
              },
              commonMistakes: [
                'Treating INSUFFICIENT_DATA as a failure — it usually means the metric has no recent data, not that something is broken.',
                'Setting evaluation-periods to 1 on a noisy metric, causing alarm flapping; use M out of N instead.',
              ],
              exercises: [
                {
                  type: 'quiz',
                  prompt:
                    'You want to be alerted only when CPU is above 80% for three out of the last five minutes, not on a single spike. Which alarm setting helps?',
                  solution: {
                    explanation:
                      'Use the "M out of N" datapoints-to-alarm setting (3 datapoints out of 5 evaluation periods) so transient spikes do not trip the alarm.',
                  },
                },
                {
                  type: 'predict',
                  prompt:
                    'A newly created alarm immediately shows INSUFFICIENT_DATA. Is the workload broken?',
                  solution: {
                    explanation:
                      'No — the alarm has not yet collected enough data points to evaluate. Once metrics arrive it will move to OK or ALARM.',
                  },
                },
                {
                  type: 'task',
                  prompt: 'Name two automated EC2 actions a CloudWatch alarm can perform directly.',
                  solution: {
                    explanation:
                      'Any two of: stop, terminate, reboot, or recover the instance. Recovery requires an alarm on StatusCheckFailed_System.',
                  },
                },
              ],
              docs: 'https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/AlarmThatSendsEmail.html',
            },
            {
              id: 'soa1-t0-c2',
              services: [{ icon: 'ec2', label: 'Amazon EC2' }, { icon: 'cloudwatch', label: 'Amazon CloudWatch' }],
              title: 'EC2 status checks and automatic recovery',
              summary:
                'EC2 runs two status checks every minute — system status and instance status — and CloudWatch alarms can auto-recover or restart an instance when they fail.',
              explanation:
                'Every EC2 instance is automatically tested by two status checks. The system status check verifies the underlying AWS infrastructure: host hardware, network reachability to the host, and power — when it fails, the fix is on the AWS side, and recovery (moving the instance to healthy hardware while keeping the same instance ID, private IP, and EBS volumes) resolves it. The instance status check verifies the instance itself: OS misconfiguration, exhausted memory, a corrupt file system, or failed network/boot — these you fix by rebooting or repairing the OS. You create CloudWatch alarms on the StatusCheckFailed_System metric to trigger an automatic recover action, and on StatusCheckFailed_Instance to reboot. Auto recovery preserves the instance identity, so it is well suited to stateful workloads that cannot easily be replaced.',
              keyPoints: [
                'System status check = AWS infrastructure problem → recover the instance.',
                'Instance status check = OS/software problem on the instance → reboot or repair.',
                'Alarm on StatusCheckFailed_System with a recover action; on StatusCheckFailed_Instance with a reboot action.',
                'Recovery keeps the same instance ID, private IP, Elastic IP, and EBS volumes.',
                'Checks run every minute and are free.',
              ],
              diagram: {
                type: 'mermaid',
                lines: [
                  'flowchart TB',
                  '  C[Status checks every minute] --> S{Which check failed}',
                  '  S -->|System| R[Alarm recovers instance<br/>same ID and volumes]',
                  '  S -->|Instance| B[Alarm reboots instance<br/>fix OS issue]',
                ],
                caption: 'System-check failures are AWS-side and trigger recovery; instance-check failures are OS-side and trigger a reboot.',
              },
              exercises: [
                {
                  type: 'quiz',
                  prompt:
                    'An instance fails its system status check because of underlying host hardware issues. Which automated action restores it while keeping the same instance ID and volumes?',
                  solution: {
                    explanation:
                      'A CloudWatch alarm on StatusCheckFailed_System with the EC2 recover action — it migrates the instance to healthy hardware, preserving identity and EBS volumes.',
                  },
                },
                {
                  type: 'quiz',
                  prompt: 'Which status check failure points to a problem inside the guest OS rather than AWS infrastructure?',
                  solution: { explanation: 'The instance status check (StatusCheckFailed_Instance).' },
                },
              ],
              docs: 'https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/monitoring-system-instance-status-check.html',
            },
          ],
        },
        {
          id: 'soa1-t1',
          name: 'CloudWatch Logs & dashboards',
          concepts: [
            {
              id: 'soa1-t1-c0',
              services: [{ icon: 'cloudwatch', label: 'Amazon CloudWatch Logs' }],
              title: 'CloudWatch Logs, the agent, and metric filters',
              summary:
                'CloudWatch Logs centralises log data into log groups and streams; the unified CloudWatch agent ships OS and application logs, and metric filters turn log patterns into metrics you can alarm on.',
              explanation:
                'CloudWatch Logs stores log events in log streams, which are grouped into log groups (typically one group per application or resource type). A retention policy is set per log group — by default logs are kept forever, which can be costly, so configure retention deliberately. To get logs and OS-level metrics off an EC2 instance or on-premises server, install the unified CloudWatch agent, which both publishes metrics (CPU detail, memory, disk) and tails files into CloudWatch Logs. The most exam-relevant feature is the metric filter: it scans incoming log events for a pattern (for example the literal string ERROR or a JSON field condition) and increments a custom CloudWatch metric, which you then alarm on. CloudWatch Logs Insights lets you query logs interactively with a purpose-built query language. You can also subscribe a log group to stream events in near-real-time to Lambda, Kinesis, or Data Firehose.',
              keyPoints: [
                'Hierarchy: log event → log stream → log group; retention is set per log group (default: never expire).',
                'The unified CloudWatch agent ships both custom metrics and log files; older CloudWatch Logs agent is legacy.',
                'Metric filters convert log patterns (e.g. "ERROR") into metrics you can alarm on — logs alone cannot trigger an alarm.',
                'CloudWatch Logs Insights runs ad-hoc queries over log data.',
                'Subscription filters stream logs to Lambda, Kinesis, or Firehose in near-real-time.',
              ],
              code: {
                language: 'bash',
                lines: [
                  'aws logs put-metric-filter \\',
                  '  --log-group-name /app/payments \\',
                  '  --filter-name ErrorCount \\',
                  '  --filter-pattern ERROR \\',
                  '  --metric-transformations \\',
                  '    metricName=AppErrors,metricNamespace=PaymentsApp,metricValue=1',
                ],
                explanation:
                  'A metric filter that increments the custom metric PaymentsApp/AppErrors by 1 for every log line containing "ERROR". You then create an alarm on that metric.',
              },
              commonMistakes: [
                'Trying to create an alarm directly on raw log text — you must first build a metric filter to expose a metric.',
                'Leaving the default "never expire" retention, which silently grows storage cost.',
              ],
              exercises: [
                {
                  type: 'quiz',
                  prompt:
                    'You must be alerted when an application log records more than 10 "ERROR" lines in five minutes. What two CloudWatch features do you combine?',
                  solution: {
                    explanation:
                      'A metric filter (to turn "ERROR" log lines into a custom metric) plus a CloudWatch alarm on that metric with a threshold of 10 over a 5-minute period.',
                  },
                },
                {
                  type: 'task',
                  prompt: 'How do you collect logs and memory metrics from an on-premises server into CloudWatch?',
                  solution: {
                    explanation:
                      'Install the unified CloudWatch agent, which publishes OS metrics (including memory) and ships log files to CloudWatch Logs.',
                  },
                },
                {
                  type: 'quiz',
                  prompt: 'Which feature lets you run interactive ad-hoc queries against log data?',
                  solution: { explanation: 'CloudWatch Logs Insights.' },
                },
              ],
              docs: 'https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/WhatIsCloudWatchLogs.html',
            },
            {
              id: 'soa1-t1-c1',
              services: [{ icon: 'cloudwatch', label: 'Amazon CloudWatch' }],
              title: 'Dashboards and cross-account/cross-Region observability',
              summary:
                'CloudWatch dashboards are customisable, shareable home pages of widgets that visualise metrics and logs, including across multiple accounts and Regions.',
              explanation:
                'A CloudWatch dashboard is a collection of widgets (line graphs, stacked area, numbers, text, log tables, alarm status) that gives operators a single pane of glass. Dashboards are global — not tied to a Region — so a single dashboard can display metrics from us-east-1 and eu-west-1 side by side. With cross-account observability you can configure a monitoring account that aggregates metrics, logs, traces, and alarms from many source accounts, ideal for an organisation managed under AWS Organizations. You can also use metric math to combine metrics into computed series (for example, requests-per-instance or an error rate) and add an alarm-status widget so a single screen shows both the trend and whether any alarm is firing. Dashboards can be shared publicly or with specific users without granting full console access.',
              keyPoints: [
                'Dashboards are global and can show metrics from multiple Regions and accounts at once.',
                'Cross-account observability designates a monitoring account that aggregates source-account telemetry.',
                'Metric math builds computed series (rates, sums across instances) for display and alarming.',
                'Widgets include graphs, single-value numbers, text, logs tables, and alarm status.',
                'Dashboards can be shared without granting broad console permissions.',
              ],
              diagram: {
                type: 'mermaid',
                lines: [
                  'flowchart LR',
                  '  A1[Account A metrics] --> M[Monitoring account]',
                  '  A2[Account B metrics] --> M',
                  '  A3[Account C metrics] --> M',
                  '  M --> D[Single dashboard<br/>cross-account view]',
                ],
                caption: 'Cross-account observability funnels telemetry from many source accounts into one monitoring account and dashboard.',
              },
              exercises: [
                {
                  type: 'quiz',
                  prompt:
                    'An operations team manages 20 accounts and wants one dashboard showing metrics and alarms from all of them. What CloudWatch capability enables this?',
                  solution: {
                    explanation:
                      'CloudWatch cross-account observability — designate a monitoring account that aggregates metrics, logs, traces, and alarms from the source accounts.',
                  },
                },
                {
                  type: 'predict',
                  prompt: 'Can a single CloudWatch dashboard display metrics from both us-east-1 and ap-southeast-2?',
                  solution: {
                    explanation: 'Yes — dashboards are global, so widgets can pull from multiple Regions on the same dashboard.',
                  },
                },
              ],
              docs: 'https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch_Dashboards.html',
            },
          ],
        },
        {
          id: 'soa1-t2',
          name: 'CloudTrail & API auditing',
          concepts: [
            {
              id: 'soa1-t2-c0',
              services: [{ icon: 'cloudtrail', label: 'AWS CloudTrail' }],
              title: 'CloudTrail trails, event types, and log integrity',
              summary:
                'CloudTrail records who did what, when, and from where, by capturing API activity. Management events are logged by default; data events and Insights are opt-in.',
              explanation:
                'AWS CloudTrail is the audit log of your account. It records API calls and account activity as events, capturing the identity that made the call, the time, the source IP, the parameters, and the response. The last 90 days of management-event history is always available for free in Event history. To retain events longer or analyse them, you create a trail that delivers logs to an S3 bucket (and optionally CloudWatch Logs). Management events (control-plane operations like RunInstances or CreateBucket) are logged by default. Data events (high-volume data-plane operations like S3 object-level GetObject or Lambda Invoke) are not logged by default because of their volume and must be enabled explicitly. CloudTrail Insights detects unusual API activity patterns. For tamper evidence, enable log file validation, which produces signed digest files so you can prove logs were not altered. An organization trail can capture activity across every account in an AWS Organization.',
              keyPoints: [
                'CloudTrail = audit of API activity (who/what/when/where); not a performance monitor.',
                'Event history keeps 90 days of management events for free; a trail to S3 keeps them longer.',
                'Management events log by default; data events (S3 object-level, Lambda Invoke) are opt-in.',
                'Log file validation produces signed digests to prove integrity; an organization trail spans all accounts.',
                'CloudTrail Insights flags unusual API call-rate or error patterns.',
              ],
              commonMistakes: [
                'Expecting S3 GetObject calls in CloudTrail by default — object-level data events must be enabled.',
                'Confusing CloudTrail (who did what) with CloudWatch (how the resource is performing) and with Config (what the configuration is).',
              ],
              exercises: [
                {
                  type: 'quiz',
                  prompt:
                    'A security team needs to know which IAM principal deleted an RDS instance last week and from which IP. Which service answers this?',
                  hint: 'Audit trail, not metrics.',
                  solution: {
                    explanation:
                      'AWS CloudTrail — it records the API call (DeleteDBInstance), the principal, the timestamp, and the source IP.',
                  },
                },
                {
                  type: 'quiz',
                  prompt: 'You need to capture object-level S3 read/write activity. What must you enable on the trail?',
                  solution: { explanation: 'Data events for S3 — they are not logged by default.' },
                },
                {
                  type: 'task',
                  prompt: 'How do you prove to an auditor that CloudTrail logs have not been tampered with?',
                  solution: {
                    explanation:
                      'Enable log file validation, which delivers signed digest files; you can then cryptographically verify the logs are unchanged.',
                  },
                },
              ],
              docs: 'https://docs.aws.amazon.com/awscloudtrail/latest/userguide/cloudtrail-user-guide.html',
            },
          ],
        },
        {
          id: 'soa1-t3',
          name: 'EventBridge & automated remediation',
          concepts: [
            {
              id: 'soa1-t3-c0',
              services: [{ icon: 'eventbridge', label: 'Amazon EventBridge' }, { icon: 'config', label: 'AWS Config' }, { icon: 'systemsmanager', label: 'AWS Systems Manager' }, { icon: 'lambda', label: 'AWS Lambda' }],
              title: 'Event-driven remediation with EventBridge, Config rules, and SSM Automation',
              summary:
                'EventBridge routes events to targets; AWS Config rules evaluate resource compliance and can trigger automatic remediation; Systems Manager Automation runs the fixes.',
              explanation:
                'Automated remediation is the heart of Domain 1. Amazon EventBridge is an event bus: AWS services and CloudTrail emit events (e.g. an EC2 state change, a Config compliance change), and you write rules that match an event pattern or run on a schedule, then route to targets such as Lambda, SNS, SQS, Step Functions, or a Systems Manager Automation document. AWS Config continuously records resource configurations and evaluates them against Config rules (AWS-managed or custom Lambda-backed). When a resource drifts to NON_COMPLIANT, Config can invoke an automatic remediation action — implemented as a Systems Manager Automation runbook — to fix it (for example, re-enabling S3 bucket encryption, removing an over-permissive security-group rule, or re-attaching a required tag). The common operations pattern is: detect (Config rule or EventBridge event) → decide (event pattern / rule) → act (SSM Automation runbook or Lambda). This closes the loop without a human in the path.',
              keyPoints: [
                'EventBridge matches events (pattern or schedule) and routes to targets like Lambda, SNS, Step Functions, or SSM Automation.',
                'AWS Config detects drift via rules and flags resources COMPLIANT / NON_COMPLIANT.',
                'Config remediation actions are Systems Manager Automation runbooks that fix non-compliant resources.',
                'Typical loop: detect (Config/EventBridge) → decide (rule) → act (SSM Automation or Lambda).',
                'Scheduled EventBridge rules replace cron for periodic operational tasks.',
              ],
              diagram: {
                type: 'mermaid',
                lines: [
                  'flowchart LR',
                  '  R[Resource changes] --> C[AWS Config rule]',
                  '  C -->|NON_COMPLIANT| RA[SSM Automation runbook]',
                  '  R2[Service event] --> EB[EventBridge rule]',
                  '  EB --> L[Lambda or SSM Automation]',
                  '  L --> Fix[Resource remediated]',
                  '  RA --> Fix',
                ],
                caption: 'Detect with Config or EventBridge, then remediate with a Systems Manager Automation runbook or Lambda.',
              },
              commonMistakes: [
                'Thinking AWS Config fixes problems on its own — it detects and reports; the remediation runs as an SSM Automation runbook.',
                'Using a Lambda-based cron when a scheduled EventBridge rule is simpler and serverless.',
              ],
              exercises: [
                {
                  type: 'quiz',
                  prompt:
                    'A Config rule flags any S3 bucket that is not encrypted. You want it fixed automatically without human action. What carries out the fix?',
                  solution: {
                    explanation:
                      'A Config remediation action backed by a Systems Manager Automation runbook (for example, AWS-EnableS3BucketEncryption) that runs when the bucket is NON_COMPLIANT.',
                  },
                },
                {
                  type: 'predict',
                  prompt:
                    'An EС2 instance enters the "stopped" state. You want a Lambda to run automatically when that happens. Which service routes the event?',
                  solution: {
                    explanation:
                      'Amazon EventBridge — create a rule matching the EC2 instance state-change event with state "stopped" and target the Lambda function.',
                  },
                },
                {
                  type: 'task',
                  prompt: 'Outline the detect-decide-act loop for automated remediation on AWS.',
                  solution: {
                    explanation:
                      'Detect drift or an event with AWS Config or EventBridge, decide with a rule or event pattern, then act with a Systems Manager Automation runbook or a Lambda function to correct the resource.',
                  },
                },
              ],
              docs: 'https://docs.aws.amazon.com/config/latest/developerguide/remediation.html',
            },
          ],
        },
      ],
    },

    /* ───────────── DOMAIN 2 — RELIABILITY AND BUSINESS CONTINUITY (16%) ───────────── */
    {
      level: 2,
      name: 'Reliability & Continuity',
      focus: 'Scale to demand, balance load across healthy targets, and recover from failures and disasters (Domain 2 · 16%)',
      accent: '#7c4ddb',
      soft: '#f1ebfd',
      topics: [
        {
          id: 'soa2-t0',
          name: 'Auto Scaling',
          concepts: [
            {
              id: 'soa2-t0-c0',
              services: [{ icon: 'autoscaling', label: 'Amazon EC2 Auto Scaling' }],
              title: 'Auto Scaling groups, scaling policies, and lifecycle hooks',
              summary:
                'An Auto Scaling group keeps a fleet between min, desired, and max capacity, scales on metrics or schedules, replaces unhealthy instances, and can pause instances mid-lifecycle for setup or cleanup.',
              explanation:
                'An EC2 Auto Scaling group (ASG) manages a fleet using a launch template that defines the AMI, instance type, security groups, and user data. You set minimum (floor), desired (the target it maintains), and maximum (ceiling). Scaling policies decide when capacity changes: target tracking keeps a metric near a value (e.g. average CPU at 50%) and is the simplest and recommended choice; step scaling adds or removes a count based on the size of the breach; simple scaling makes a single adjustment then waits out a cooldown; scheduled scaling changes capacity at known times. Predictive scaling forecasts demand from history and pre-scales. Health checks (EC2 status checks and, optionally, ELB health checks) let the ASG terminate and replace unhealthy instances automatically. Lifecycle hooks pause an instance in Pending:Wait (before it serves traffic) or Terminating:Wait (before it is removed) so you can install software or drain connections; the default heartbeat timeout is 3600 seconds. Cooldowns prevent rapid, repeated scaling.',
              keyPoints: [
                'ASG holds the fleet between min / desired / max; launch template defines the instance configuration.',
                'Target tracking (recommended) holds a metric at a target; step and simple scaling react to thresholds.',
                'Scheduled scaling acts at set times; predictive scaling pre-scales from forecasted demand.',
                'Enable ELB health checks so the ASG replaces instances the load balancer marks unhealthy.',
                'Lifecycle hooks pause instances at launch or termination for setup/cleanup (default timeout 3600s).',
              ],
              diagram: {
                type: 'mermaid',
                lines: [
                  'flowchart LR',
                  '  M[CloudWatch metric] --> P[Target tracking policy]',
                  '  P --> ASG[Auto Scaling group]',
                  '  ASG -->|scale out| Add[Launch instances]',
                  '  ASG -->|scale in| Rem[Terminate instances]',
                  '  HC[Health check fails] --> ASG',
                ],
                caption: 'A target-tracking policy keeps a metric near target while health checks drive replacement of unhealthy instances.',
              },
              commonMistakes: [
                'Leaving only EC2 health checks enabled — the ASG will not replace an instance that the load balancer sees as unhealthy unless ELB health checks are turned on.',
                'Setting cooldowns too short, causing the ASG to scale repeatedly before the previous change takes effect.',
              ],
              exercises: [
                {
                  type: 'quiz',
                  prompt:
                    'You want the simplest policy that keeps average CPU across the group near 50%, scaling automatically in both directions. Which policy type?',
                  solution: {
                    explanation: 'Target tracking scaling with a target of 50% on the average CPU metric.',
                  },
                },
                {
                  type: 'task',
                  prompt:
                    'Instances must finish installing software before they receive traffic and must drain connections before termination. What ASG feature provides these pauses?',
                  solution: {
                    explanation:
                      'Lifecycle hooks — a Pending:Wait hook before serving traffic and a Terminating:Wait hook before removal.',
                  },
                },
                {
                  type: 'predict',
                  prompt:
                    'An instance passes EC2 status checks but the ALB marks it unhealthy. The ASG never replaces it. Why?',
                  solution: {
                    explanation:
                      'ELB health checks are not enabled on the ASG, so it only considers EC2 status checks. Enable ELB health checks to replace it.',
                  },
                },
              ],
              docs: 'https://docs.aws.amazon.com/autoscaling/ec2/userguide/what-is-amazon-ec2-auto-scaling.html',
            },
          ],
        },
        {
          id: 'soa2-t1',
          name: 'Load balancing & health checks',
          concepts: [
            {
              id: 'soa2-t1-c0',
              services: [{ icon: 'elb', label: 'Elastic Load Balancing' }],
              title: 'ELB types, health checks, and connection draining',
              summary:
                'Elastic Load Balancing spreads traffic across healthy targets in multiple AZs; health checks route traffic only to healthy targets, and connection draining lets in-flight requests finish.',
              explanation:
                'Elastic Load Balancing distributes incoming traffic across registered targets (instances, IPs, Lambda) in one or more Availability Zones. The Application Load Balancer (ALB) works at Layer 7 (HTTP/HTTPS) with content-based routing on host, path, header, or query string, and integrates with WAF. The Network Load Balancer (NLB) works at Layer 4 (TCP/UDP) for ultra-low latency, very high throughput, static IPs, and preserving the client source IP. The Gateway Load Balancer fronts third-party appliances. Each load balancer continuously runs health checks against its targets; only targets passing the check receive traffic, so an unhealthy instance is removed from rotation. Cross-zone load balancing spreads requests evenly across targets in all AZs (always on and free for ALB; off by default for NLB). Connection draining (deregistration delay) lets in-flight requests complete before a target is removed during scale-in or deployment. For an exam scenario where an instance is healthy in EC2 but the LB sends no traffic, check the target group health-check path, port, and the instance security group.',
              keyPoints: [
                'ALB = Layer 7 (HTTP/HTTPS), content-based routing; NLB = Layer 4 (TCP/UDP), ultra-low latency, static IPs.',
                'Health checks gate traffic — only healthy targets receive requests.',
                'Cross-zone load balancing: always on/free for ALB; off by default and chargeable per-AZ traffic for NLB.',
                'Connection draining / deregistration delay lets in-flight requests finish during scale-in or deploys.',
                'No-traffic troubleshooting: verify health-check path/port, target registration, and security groups.',
              ],
              diagram: {
                type: 'mermaid',
                lines: [
                  'flowchart LR',
                  '  U[Clients] --> LB[Load balancer]',
                  '  LB -->|healthy| T1[Target AZ a]',
                  '  LB -->|healthy| T2[Target AZ b]',
                  '  LB -.unhealthy: no traffic.-> T3[Target AZ c]',
                ],
                caption: 'The load balancer routes only to targets that pass health checks, removing unhealthy targets from rotation.',
              },
              commonMistakes: [
                'Setting the health-check path to a URL the app does not serve, so all targets show unhealthy and receive no traffic.',
                'Forgetting that NLB cross-zone balancing is off by default and incurs inter-AZ data charges when enabled.',
              ],
              exercises: [
                {
                  type: 'quiz',
                  prompt:
                    'A web app needs routing based on the URL path (for example /api versus /images) to different target groups. Which load balancer?',
                  solution: { explanation: 'An Application Load Balancer (Layer 7, content-based routing).' },
                },
                {
                  type: 'task',
                  prompt:
                    'EC2 instances are running fine but the ALB target group shows them all unhealthy and serves 503 errors. List the first things to check.',
                  solution: {
                    explanation:
                      'The health-check path and port (does the app respond there with a 200?), the target security group (does it allow the health-check port from the load balancer?), and target registration in the correct subnets/AZs.',
                  },
                },
                {
                  type: 'quiz',
                  prompt: 'What feature lets active requests finish before an instance is removed during a deployment or scale-in?',
                  solution: { explanation: 'Connection draining (deregistration delay).' },
                },
              ],
              docs: 'https://docs.aws.amazon.com/elasticloadbalancing/latest/userguide/what-is-load-balancing.html',
            },
          ],
        },
        {
          id: 'soa2-t2',
          name: 'High availability & failover',
          concepts: [
            {
              id: 'soa2-t2-c0',
              services: [{ icon: 'rds', label: 'Amazon RDS' }, { icon: 'aurora', label: 'Amazon Aurora' }],
              title: 'Multi-AZ, read replicas, and database failover',
              summary:
                'Multi-AZ gives high availability through a synchronous standby with automatic failover; read replicas scale reads asynchronously. They solve different problems.',
              explanation:
                'For Amazon RDS, a Multi-AZ deployment maintains a synchronous standby replica in a second Availability Zone. The standby is not readable; it exists for availability. If the primary fails (hardware, AZ outage, or during patching), RDS fails over automatically by updating the database endpoint DNS to point to the promoted standby, typically within a minute or two — your application keeps using the same endpoint name. Read replicas, by contrast, use asynchronous replication and exist to scale read traffic; they have their own endpoints, can be promoted manually, and can be cross-Region (useful for disaster recovery and lower-latency reads abroad). Amazon Aurora goes further: it stores data across three AZs with six copies and supports up to 15 low-latency read replicas, with fast automatic failover to a replica. The exam tests the distinction: Multi-AZ = availability/failover; read replicas = read scaling (and optionally a DR/promotion path).',
              keyPoints: [
                'Multi-AZ = synchronous standby for high availability; failover is automatic via endpoint DNS change.',
                'The Multi-AZ standby is NOT readable — it is for availability, not scaling.',
                'Read replicas = asynchronous, readable, scale read traffic; can be cross-Region and promoted manually.',
                'Aurora keeps six data copies across three AZs and supports up to 15 read replicas with fast failover.',
                'Use the cluster/instance endpoint name; do not hard-code the underlying IP.',
              ],
              commonMistakes: [
                'Believing the Multi-AZ standby can serve read queries — it cannot; use read replicas for that.',
                'Hard-coding the database IP instead of the endpoint, breaking automatic Multi-AZ failover.',
              ],
              exercises: [
                {
                  type: 'quiz',
                  prompt:
                    'A production RDS database must automatically survive the loss of an Availability Zone with minimal downtime. Which feature provides this?',
                  solution: {
                    explanation:
                      'An RDS Multi-AZ deployment — a synchronous standby in another AZ with automatic failover by DNS endpoint change.',
                  },
                },
                {
                  type: 'quiz',
                  prompt: 'Reads are overwhelming a single RDS instance. What scales read capacity?',
                  solution: { explanation: 'Add read replicas (asynchronous replicas that serve read traffic).' },
                },
                {
                  type: 'predict',
                  prompt:
                    'A team points read queries at the Multi-AZ standby to offload the primary and gets connection errors. Why?',
                  solution: {
                    explanation:
                      'The Multi-AZ standby is not accessible for reads; it only takes over on failover. They must create read replicas for read scaling.',
                  },
                },
              ],
              docs: 'https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/Concepts.MultiAZ.html',
            },
            {
              id: 'soa2-t2-c1',
              services: [{ icon: 'route53', label: 'Amazon Route 53' }],
              title: 'Route 53 health checks and DNS failover',
              summary:
                'Route 53 health checks monitor endpoints and, combined with failover routing, automatically direct DNS away from an unhealthy primary to a standby.',
              explanation:
                'Route 53 provides DNS-level resilience. Health checks monitor an endpoint (an IP or domain), the status of other health checks (calculated), or a CloudWatch alarm. With failover routing, you create a primary record and a secondary record, each associated with a health check: while the primary is healthy, Route 53 answers with it; if its health check fails, Route 53 automatically answers with the secondary (for example, a static S3 website or a standby Region). Because DNS results are cached for the TTL, set a low TTL on failover records so clients pick up the change quickly. Other policies serve different goals: latency-based routing sends users to the lowest-latency Region, geolocation routes by user location (useful for compliance), weighted routing splits traffic by percentage (canary/blue-green), and multivalue answer returns several healthy records as basic load balancing. For a full-Region active-passive disaster-recovery setup, failover routing plus health checks is the classic pattern.',
              keyPoints: [
                'Health checks watch an endpoint, another health check (calculated), or a CloudWatch alarm.',
                'Failover routing = active-passive: serve secondary when the primary health check fails.',
                'Set a low TTL on failover records so clients honour failover quickly (DNS is cached for the TTL).',
                'Latency routing = lowest-latency Region; geolocation = by location; weighted = canary/blue-green.',
                'Multivalue answer returns several healthy records for simple DNS-level load balancing.',
              ],
              diagram: {
                type: 'mermaid',
                lines: [
                  'flowchart LR',
                  '  U[User DNS query] --> R53[Route 53]',
                  '  R53 -->|primary healthy| P[Primary Region]',
                  '  R53 -.primary unhealthy.-> S[Secondary / standby]',
                  '  HC[Health check] --> R53',
                ],
                caption: 'Failover routing answers with the primary while healthy and switches to the secondary when the health check fails.',
              },
              exercises: [
                {
                  type: 'quiz',
                  prompt:
                    'You want users routed to a standby Region automatically if the primary Region endpoint becomes unhealthy. Which Route 53 routing policy?',
                  solution: { explanation: 'Failover routing combined with health checks (active-passive).' },
                },
                {
                  type: 'task',
                  prompt: 'Failover is configured but users keep hitting the dead primary for several minutes. What setting should you reduce?',
                  solution: {
                    explanation:
                      'The record TTL — DNS responses are cached for the TTL, so lower it so clients re-resolve and pick up the secondary sooner.',
                  },
                },
              ],
              docs: 'https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/dns-failover.html',
            },
          ],
        },
        {
          id: 'soa2-t3',
          name: 'Backup & disaster recovery',
          concepts: [
            {
              id: 'soa2-t3-c0',
              services: [{ icon: 'backup', label: 'AWS Backup' }, { icon: 'ebs', label: 'Amazon EBS' }],
              title: 'AWS Backup, snapshots, and centralized backup policies',
              summary:
                'AWS Backup centralises and automates backups across many services using backup plans and vaults; EBS snapshots are incremental and stored in S3.',
              explanation:
                'AWS Backup lets you manage and automate backups from one place across services such as EBS, EFS, RDS, Aurora, DynamoDB, FSx, and Storage Gateway. You define a backup plan with rules that set the schedule, the backup window, lifecycle transitions to cold storage, and a retention period, and you assign resources by tags or resource ID. Backups are stored in a backup vault, which you can lock (AWS Backup Vault Lock) to enforce a write-once-read-many retention that even administrators cannot shorten — useful for compliance and ransomware resilience. AWS Backup also supports cross-Region and cross-account copy for disaster recovery. EBS snapshots are point-in-time, incremental backups stored durably in S3: the first snapshot is full and each later one only stores changed blocks, but every snapshot still restores a complete volume. Snapshots can be copied across Regions and used to create AMIs. The Data Lifecycle Manager (DLM) can automate EBS snapshot and AMI creation and retention on a schedule.',
              keyPoints: [
                'AWS Backup centralises backups across EBS, EFS, RDS, DynamoDB, FSx, Storage Gateway, and more.',
                'A backup plan defines schedule, lifecycle to cold storage, and retention; resources are assigned by tag or ID.',
                'Vault Lock enforces immutable WORM retention for compliance and ransomware protection.',
                'EBS snapshots are incremental (only changed blocks) but each restores a full volume; stored in S3.',
                'Cross-Region/cross-account copy supports DR; Data Lifecycle Manager automates EBS snapshots/AMIs.',
              ],
              commonMistakes: [
                'Assuming an incremental snapshot only restores partial data — every snapshot restores the entire volume.',
                'Relying on backups in a single Region for DR; copy them cross-Region (and ideally cross-account).',
              ],
              exercises: [
                {
                  type: 'quiz',
                  prompt:
                    'A compliance team needs centralized, policy-driven backups across EBS, RDS, and DynamoDB, with immutable retention. Which service and feature?',
                  solution: {
                    explanation:
                      'AWS Backup with a backup plan, storing recovery points in a backup vault protected by Vault Lock for immutable WORM retention.',
                  },
                },
                {
                  type: 'predict',
                  prompt:
                    'You delete the first (oldest) EBS snapshot of a volume that has several later incremental snapshots. Can you still restore from the newer ones?',
                  solution: {
                    explanation:
                      'Yes — AWS manages the block references so deleting an older snapshot does not invalidate later ones; each remaining snapshot still restores a full volume.',
                  },
                },
                {
                  type: 'task',
                  prompt: 'How do you automate daily EBS snapshots with 30-day retention without writing code?',
                  solution: {
                    explanation:
                      'Use Amazon Data Lifecycle Manager (DLM) or an AWS Backup plan with a daily schedule and a 30-day retention rule.',
                  },
                },
              ],
              docs: 'https://docs.aws.amazon.com/aws-backup/latest/devguide/whatisbackup.html',
            },
            {
              id: 'soa2-t3-c1',
              services: [{ icon: 's3', label: 'Amazon S3' }],
              title: 'RTO/RPO, DR strategies, and S3 versioning & replication',
              summary:
                'RTO and RPO quantify recovery goals; four DR strategies trade cost for speed; S3 versioning and replication protect and distribute data.',
              explanation:
                'Disaster recovery planning is driven by two numbers. RPO (Recovery Point Objective) is how much data loss you can tolerate — the age of the last good backup, so a 1-hour RPO means backups at least hourly. RTO (Recovery Time Objective) is how long you can be down before recovery completes. Lower RTO/RPO costs more. The four classic strategies, from cheapest/slowest to most expensive/fastest, are: Backup and Restore (restore from backups after a disaster — high RTO/RPO), Pilot Light (a minimal core, like a replicated database, kept running and scaled up on failover), Warm Standby (a scaled-down but fully functional copy always running, scaled up on failover), and Multi-Site Active-Active (full capacity running in multiple Regions for near-zero RTO/RPO). On the data side, S3 Versioning keeps every version of an object so you can recover from accidental overwrites or deletes (a delete adds a delete marker rather than destroying data), and it is required for replication. S3 Replication copies objects to another bucket — Cross-Region Replication (CRR) for DR/lower latency and compliance, or Same-Region Replication (SRR) for log aggregation or account separation; replication is asynchronous and applies to new objects after it is enabled.',
              keyPoints: [
                'RPO = tolerable data loss (backup frequency); RTO = tolerable downtime (recovery speed).',
                'DR strategies (cheap/slow → costly/fast): Backup & Restore, Pilot Light, Warm Standby, Multi-Site Active-Active.',
                'S3 Versioning protects against overwrite/delete; deletes add a delete marker, not true deletion.',
                'S3 Replication (CRR cross-Region for DR; SRR same-Region) requires versioning and is asynchronous.',
                'Replication applies to objects created after it is enabled (existing objects need batch replication).',
              ],
              diagram: {
                type: 'mermaid',
                lines: [
                  'flowchart LR',
                  '  BR[Backup and Restore<br/>highest RTO] --> PL[Pilot Light]',
                  '  PL --> WS[Warm Standby]',
                  '  WS --> AA[Active-Active<br/>lowest RTO]',
                ],
                caption: 'DR strategies trade cost against recovery speed — from Backup & Restore up to Multi-Site Active-Active.',
              },
              commonMistakes: [
                'Swapping the meaning of RTO and RPO — RPO is data loss, RTO is downtime.',
                'Enabling S3 replication and expecting existing objects to copy automatically — only new objects replicate (use S3 Batch Replication for existing ones).',
              ],
              exercises: [
                {
                  type: 'quiz',
                  prompt:
                    'A business can lose at most 15 minutes of data and must be back online within 5 minutes. Which strategy best fits these tight RTO/RPO targets?',
                  solution: {
                    explanation:
                      'Multi-Site Active-Active (or at least Warm Standby) — only an always-running, near-full second site can meet such low RTO/RPO; Backup & Restore would be far too slow.',
                  },
                },
                {
                  type: 'quiz',
                  prompt: 'What S3 feature lets you recover an object after it was accidentally overwritten?',
                  solution: { explanation: 'S3 Versioning — previous versions are retained and can be restored.' },
                },
                {
                  type: 'task',
                  prompt: 'Define RPO and RTO in one sentence each.',
                  solution: {
                    explanation:
                      'RPO is the maximum acceptable amount of data loss measured in time (how far back your last recoverable point is); RTO is the maximum acceptable time to restore service after an outage.',
                  },
                },
              ],
              docs: 'https://docs.aws.amazon.com/whitepapers/latest/disaster-recovery-workloads-on-aws/disaster-recovery-options-in-the-cloud.html',
            },
          ],
        },
      ],
    },

    /* ──────── DOMAIN 3 — DEPLOYMENT, PROVISIONING, AND AUTOMATION (18%) ──────── */
    {
      level: 3,
      name: 'Deployment & Automation',
      focus: 'Provision infrastructure as code, automate operations at fleet scale, and manage configuration (Domain 3 · 18%)',
      accent: '#e8862a',
      soft: '#fff1e2',
      topics: [
        {
          id: 'soa3-t0',
          name: 'CloudFormation',
          concepts: [
            {
              id: 'soa3-t0-c0',
              services: [{ icon: 'cloudformation', label: 'AWS CloudFormation' }],
              title: 'CloudFormation templates, stacks, and change sets',
              summary:
                'CloudFormation provisions and updates AWS resources from declarative JSON/YAML templates. A template creates a stack; change sets preview updates; stacks roll back on failure.',
              explanation:
                'AWS CloudFormation is infrastructure as code: you describe resources in a JSON or YAML template, and CloudFormation creates, updates, and deletes them as a single unit called a stack. Templates have sections including Parameters (inputs supplied at deploy time), Mappings (lookup tables, e.g. AMI per Region), Conditions (create resources only when criteria hold), Resources (the only required section), and Outputs (values to export and reference). When you update a stack, a change set shows exactly what will be added, modified, or replaced before you execute it — essential for safe operational changes, because some property updates cause resource replacement (and thus possible downtime or data loss). If a create or update fails, CloudFormation automatically rolls back to the last known good state by default. Drift detection reports when a stack\'s real resources have been changed outside CloudFormation. You can protect stacks with termination protection and limit risky updates with a stack policy.',
              keyPoints: [
                'Template (JSON/YAML) → stack; only the Resources section is required.',
                'Sections: Parameters (inputs), Mappings (lookups), Conditions, Resources, Outputs (exports).',
                'Change sets preview adds/modifies/replacements before you apply an update.',
                'Failed create/update rolls back automatically by default; drift detection finds out-of-band changes.',
                'Protect with termination protection and stack policies; some updates replace resources (watch for downtime).',
              ],
              code: {
                language: 'yaml',
                lines: [
                  'Parameters:',
                  '  InstanceType:',
                  '    Type: String',
                  '    Default: t3.micro',
                  'Resources:',
                  '  WebServer:',
                  '    Type: AWS::EC2::Instance',
                  '    Properties:',
                  '      InstanceType: !Ref InstanceType',
                  '      ImageId: ami-0abc12345',
                  'Outputs:',
                  '  InstanceId:',
                  '    Value: !Ref WebServer',
                ],
                explanation:
                  'A minimal template with a parameter for instance type, one EC2 resource, and an output exposing the instance ID.',
              },
              commonMistakes: [
                'Applying an update without a change set, then being surprised when a property change replaces a resource and causes downtime.',
                'Editing stack-managed resources by hand, which causes drift that future stack updates may overwrite or conflict with.',
              ],
              exercises: [
                {
                  type: 'quiz',
                  prompt:
                    'Before applying a risky CloudFormation update, you want to see which resources will be replaced versus modified in place. What do you create?',
                  solution: {
                    explanation:
                      'A change set — it previews the additions, modifications, and replacements for the update before you execute it.',
                  },
                },
                {
                  type: 'predict',
                  prompt: 'A CloudFormation update fails halfway through creating new resources. What happens by default?',
                  solution: {
                    explanation:
                      'CloudFormation automatically rolls back the stack to its previous good state, removing the partially created resources.',
                  },
                },
                {
                  type: 'task',
                  prompt: 'Which section of a template is mandatory, and which exposes values for other stacks to import?',
                  solution: {
                    explanation: 'Resources is the only required section; Outputs (with Export) exposes values that other stacks can import.',
                  },
                },
              ],
              docs: 'https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/Welcome.html',
            },
            {
              id: 'soa3-t0-c1',
              services: [{ icon: 'cloudformation', label: 'AWS CloudFormation' }, { icon: 'organizations', label: 'AWS Organizations' }],
              title: 'Nested stacks, StackSets, and reuse',
              summary:
                'Nested stacks break large templates into reusable components; StackSets deploy a single template across many accounts and Regions in one operation.',
              explanation:
                'As infrastructure grows, you avoid one giant template. Nested stacks let a parent template reference child templates (via the AWS::CloudFormation::Stack resource), so common building blocks — a standard VPC, a security baseline, a logging configuration — are written once and reused. Cross-stack references (Outputs with Export plus Fn::ImportValue) let independent stacks share values like a VPC ID. CloudFormation StackSets extend this across boundaries: from a single administrator action, a StackSet deploys and updates the same template across multiple AWS accounts and multiple Regions, which is the standard way to roll out guardrails, IAM roles, or Config rules organisation-wide. With AWS Organizations integration, StackSets can target whole organisational units and automatically deploy to new accounts as they join. This is core operations tooling: consistent, repeatable, governed provisioning at scale.',
              keyPoints: [
                'Nested stacks reuse child templates from a parent (AWS::CloudFormation::Stack) to avoid duplication.',
                'Cross-stack references share values via Export and Fn::ImportValue.',
                'StackSets deploy one template across many accounts and Regions from a single operation.',
                'Organizations integration targets OUs and auto-deploys to newly added accounts.',
                'Use StackSets for org-wide baselines: IAM roles, Config rules, logging, guardrails.',
              ],
              diagram: {
                type: 'mermaid',
                lines: [
                  'flowchart TB',
                  '  T[One template] --> SS[StackSet]',
                  '  SS --> A1[Account A · eu-west-1]',
                  '  SS --> A2[Account B · us-east-1]',
                  '  SS --> A3[Account C · ap-south-1]',
                ],
                caption: 'A StackSet deploys a single template consistently across multiple accounts and Regions.',
              },
              exercises: [
                {
                  type: 'quiz',
                  prompt:
                    'You must deploy the same baseline IAM roles and Config rules to 30 AWS accounts across 3 Regions from one place. Which CloudFormation feature?',
                  solution: { explanation: 'CloudFormation StackSets (ideally integrated with AWS Organizations to target OUs).' },
                },
                {
                  type: 'quiz',
                  prompt: 'How do you let one stack consume the VPC ID created by another stack?',
                  solution: { explanation: 'Export the value in the producing stack\'s Outputs and use Fn::ImportValue in the consuming stack.' },
                },
              ],
              docs: 'https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/what-is-cfnstacksets.html',
            },
          ],
        },
        {
          id: 'soa3-t1',
          name: 'Systems Manager operations',
          concepts: [
            {
              id: 'soa3-t1-c0',
              services: [{ icon: 'systemsmanager', label: 'AWS Systems Manager' }],
              title: 'Run Command, Session Manager, and Automation',
              summary:
                'Systems Manager operates fleets without SSH: Run Command executes commands at scale, Session Manager gives auditable shell access with no open ports, and Automation runbooks orchestrate multi-step tasks.',
              explanation:
                'AWS Systems Manager (SSM) is the operations control plane for your fleet. Managed instances run the SSM Agent and assume an instance profile granting SSM permissions. Run Command executes commands (using documents) across many instances at once — for example, run a script, install a package, or restart a service on every tagged instance — with no SSH and full logging. Session Manager opens an interactive, browser- or CLI-based shell to an instance without opening inbound port 22, without bastion hosts, and without SSH keys; every session can be logged to S3 or CloudWatch Logs for audit, which is a frequent exam answer for secure, auditable access. Automation runs runbooks (Automation documents) that orchestrate multi-step operational workflows — patching, AMI creation, instance recovery, or the remediation actions invoked by AWS Config — with branching, approvals, and error handling. State Manager keeps instances in a defined configuration on a schedule.',
              keyPoints: [
                'SSM-managed instances run the SSM Agent with an instance profile granting SSM access.',
                'Run Command executes documents across many instances at once — no SSH, fully logged.',
                'Session Manager = auditable shell access with no open inbound ports, no bastion, no keys.',
                'Automation runbooks orchestrate multi-step operations (patching, AMI builds, remediation).',
                'State Manager enforces a desired configuration on a schedule.',
              ],
              diagram: {
                type: 'mermaid',
                lines: [
                  'flowchart LR',
                  '  Op[Operator] --> SSM[Systems Manager]',
                  '  SSM --> RC[Run Command<br/>commands at scale]',
                  '  SSM --> SM[Session Manager<br/>no open ports]',
                  '  SSM --> AU[Automation<br/>runbooks]',
                  '  RC --> F[Managed instances]',
                  '  SM --> F',
                  '  AU --> F',
                ],
                caption: 'Systems Manager operates the fleet through Run Command, Session Manager, and Automation runbooks.',
              },
              commonMistakes: [
                'Opening port 22 and managing bastion hosts when Session Manager would give auditable access with no inbound ports.',
                'Forgetting the instance needs the SSM Agent and an IAM instance profile, or it will not appear as a managed instance.',
              ],
              exercises: [
                {
                  type: 'quiz',
                  prompt:
                    'Security requires shell access to private instances with no inbound ports open, no SSH keys, and full session logging. Which Systems Manager capability?',
                  solution: {
                    explanation:
                      'Session Manager — auditable browser/CLI shell access with no open inbound ports or keys, with session logs to S3/CloudWatch Logs.',
                  },
                },
                {
                  type: 'task',
                  prompt: 'You need to run the same patch script on 500 tagged instances at once with logging. Which feature?',
                  solution: { explanation: 'Run Command, targeting instances by tag and logging output to S3 or CloudWatch Logs.' },
                },
                {
                  type: 'predict',
                  prompt: 'An instance does not show up under Fleet Manager / managed instances. What two things are most likely missing?',
                  solution: {
                    explanation:
                      'The SSM Agent is not installed/running, or the instance lacks an IAM instance profile granting SSM permissions (and network reachability to the SSM endpoints).',
                  },
                },
              ],
              docs: 'https://docs.aws.amazon.com/systems-manager/latest/userguide/what-is-systems-manager.html',
            },
            {
              id: 'soa3-t1-c1',
              services: [{ icon: 'systemsmanager', label: 'AWS Systems Manager' }],
              title: 'Patch Manager and maintenance windows',
              summary:
                'Patch Manager automates OS and application patching across your fleet using patch baselines and patch groups, scheduled inside maintenance windows.',
              explanation:
                'Patch Manager (part of Systems Manager) automates patching at scale. A patch baseline defines which patches are approved — by classification, severity, and an auto-approval delay (for example, automatically approve security patches seven days after release) — with explicit approve/reject lists for exceptions. You organise instances into patch groups using the tag key "Patch Group", and associate each group with a baseline, so production and development can follow different baselines and schedules. Patching runs as a Scan (report compliance only) or Install operation, and you schedule it inside a maintenance window — a recurring time window that limits when disruptive operations (patching, reboots, deployments) may run, optionally with concurrency and error-rate limits so you do not take the whole fleet down at once. Patch compliance is reported centrally, and non-compliant instances surface for remediation. This is the standard answer for keeping a fleet patched consistently and on a controlled schedule.',
              keyPoints: [
                'Patch baseline = which patches are approved (classification, severity, auto-approval delay, approve/reject lists).',
                'Patch groups tag instances (key "Patch Group") to apply different baselines/schedules per group.',
                'Operations: Scan (report compliance) or Install (apply patches).',
                'Maintenance windows confine disruptive work to scheduled times with concurrency/error limits.',
                'Patch compliance is reported centrally so you can find and remediate non-compliant instances.',
              ],
              commonMistakes: [
                'Patching the entire fleet at once instead of using maintenance-window concurrency and error thresholds to protect availability.',
                'Forgetting that the patch-group tag key must literally be "Patch Group".',
              ],
              exercises: [
                {
                  type: 'quiz',
                  prompt:
                    'You must patch production servers only during a Sunday 02:00–04:00 window, a maximum of 25% at a time. What two Systems Manager features do you use?',
                  solution: {
                    explanation:
                      'A maintenance window scheduled for that time with a 25% concurrency limit, running a Patch Manager Install task against the production patch group.',
                  },
                },
                {
                  type: 'quiz',
                  prompt: 'How do you make development and production follow different patch approval rules?',
                  solution: {
                    explanation:
                      'Place them in separate patch groups (via the "Patch Group" tag) and associate each group with its own patch baseline.',
                  },
                },
              ],
              docs: 'https://docs.aws.amazon.com/systems-manager/latest/userguide/systems-manager-patch.html',
            },
            {
              id: 'soa3-t1-c2',
              services: [{ icon: 'systemsmanager', label: 'AWS Systems Manager' }, { icon: 'secretsmanager', label: 'AWS Secrets Manager' }],
              title: 'Parameter Store vs Secrets Manager',
              summary:
                'Parameter Store holds configuration and secrets hierarchically and is free at the standard tier; Secrets Manager adds automatic rotation and is purpose-built for secrets.',
              explanation:
                'Systems Manager Parameter Store stores configuration data and secrets as named parameters in a hierarchy (for example /app/prod/db/url). Parameters are String, StringList, or SecureString (encrypted with KMS). The standard tier is free and supports up to 10,000 parameters; an advanced tier adds higher limits, larger values, and parameter policies (such as expiration). Applications and SSM documents reference parameters by name, decoupling configuration from code. AWS Secrets Manager is purpose-built for secrets and adds the key differentiator: built-in automatic rotation (for example, rotating an RDS database password on a schedule using a Lambda rotation function), plus cross-Region replication of secrets. The exam framing: choose Parameter Store for general configuration and simple secrets at no cost, and Secrets Manager when you need automatic rotation or tight integration with database credentials. Both encrypt with KMS and integrate with IAM for fine-grained access.',
              keyPoints: [
                'Parameter Store: hierarchical config/secrets; String, StringList, SecureString (KMS-encrypted); standard tier is free.',
                'Secrets Manager: purpose-built for secrets with built-in automatic rotation (e.g. RDS passwords).',
                'Pick Parameter Store for general config and simple secrets at no cost.',
                'Pick Secrets Manager when you need automatic rotation or managed DB-credential integration.',
                'Both use KMS encryption and IAM access control; reference by name to decouple config from code.',
              ],
              diagram: {
                type: 'mermaid',
                lines: [
                  'flowchart LR',
                  '  Q{Need automatic rotation?} -->|No| PS[Parameter Store<br/>free standard tier]',
                  '  Q -->|Yes| SM[Secrets Manager<br/>auto-rotation]',
                ],
                caption: 'Need automatic secret rotation? Use Secrets Manager; otherwise Parameter Store covers config and simple secrets for free.',
              },
              exercises: [
                {
                  type: 'quiz',
                  prompt:
                    'You need a database password to rotate automatically every 30 days with minimal custom code. Which service?',
                  solution: { explanation: 'AWS Secrets Manager — it provides built-in automatic rotation.' },
                },
                {
                  type: 'quiz',
                  prompt:
                    'You want to store dozens of non-sensitive configuration values referenced by EC2 instances at no extra cost. Which service?',
                  solution: { explanation: 'Systems Manager Parameter Store (standard tier, free).' },
                },
              ],
              docs: 'https://docs.aws.amazon.com/systems-manager/latest/userguide/systems-manager-parameter-store.html',
            },
          ],
        },
        {
          id: 'soa3-t2',
          name: 'Deployment strategies',
          concepts: [
            {
              id: 'soa3-t2-c0',
              services: [{ icon: 'beanstalk', label: 'AWS Elastic Beanstalk' }, { icon: 'route53', label: 'Amazon Route 53' }],
              title: 'Blue/green, rolling, and immutable deployments',
              summary:
                'Deployment strategies trade speed, cost, and risk: in-place rolling updates reuse instances; immutable and blue/green deploys spin up fresh capacity to reduce risk and ease rollback.',
              explanation:
                'Operationally, how you ship new versions matters as much as what you ship. All at once replaces everything simultaneously — fastest and cheapest but with downtime and a hard rollback. Rolling updates batch the fleet, updating a few instances at a time, so capacity dips during the deploy and a failed batch leaves a mix of versions. Rolling with additional batch launches extra instances first so full capacity is maintained throughout. Immutable deployments launch a brand-new set of instances with the new version alongside the old, then switch over — nothing is changed in place, so rollback is simply discarding the new instances. Blue/green keeps the current environment (blue) running while you deploy the new one (green) in parallel, then shift traffic — often by swapping a load balancer target or repointing Route 53 (or, in Elastic Beanstalk, swapping environment URLs/CNAMEs) — giving near-instant rollback by switching back. Choose based on tolerance for downtime, cost of extra capacity, and how fast you need to roll back.',
              keyPoints: [
                'All at once: fastest/cheapest but causes downtime and a hard rollback.',
                'Rolling: updates in batches (capacity dips); rolling with additional batch keeps full capacity.',
                'Immutable: launch fresh instances with the new version, then swap — easy rollback by discarding them.',
                'Blue/green: run new environment in parallel and shift traffic (LB target or Route 53/CNAME swap) for near-instant rollback.',
                'Choose by downtime tolerance, extra-capacity cost, and required rollback speed.',
              ],
              diagram: {
                type: 'mermaid',
                lines: [
                  'flowchart LR',
                  '  Blue[Blue · v1 live] --- LB[Traffic switch]',
                  '  Green[Green · v2 ready] --- LB',
                  '  LB -->|cutover| Green',
                  '  LB -.rollback.-> Blue',
                ],
                caption: 'Blue/green keeps the old version live until traffic is switched to the new one, enabling instant rollback.',
              },
              commonMistakes: [
                'Choosing all-at-once for a production app that cannot tolerate downtime.',
                'Forgetting that rolling (without an additional batch) reduces available capacity during the deployment.',
              ],
              exercises: [
                {
                  type: 'quiz',
                  prompt:
                    'You need a deployment with near-instant rollback and zero capacity reduction, and you can afford to run two full environments briefly. Which strategy?',
                  solution: {
                    explanation:
                      'Blue/green — run the new (green) environment in parallel, switch traffic to it, and roll back instantly by switching back to blue if needed.',
                  },
                },
                {
                  type: 'predict',
                  prompt: 'A rolling deployment (no extra batch) fails on batch two of five. What is the state of the fleet?',
                  solution: {
                    explanation:
                      'A mix of old and new versions is running and capacity is reduced, since the fleet was updated in place batch by batch and the failed batch left instances partly updated.',
                  },
                },
              ],
              docs: 'https://docs.aws.amazon.com/elasticbeanstalk/latest/dg/using-features.deploy-existing-version.html',
            },
          ],
        },
      ],
    },

    /* ──────────────── DOMAIN 4 — SECURITY AND COMPLIANCE (16%) ──────────────── */
    {
      level: 4,
      name: 'Security & Compliance',
      focus: 'Manage identity and access, protect data, and audit configuration and compliance (Domain 4 · 16%)',
      accent: '#1ba85a',
      soft: '#e6f7ee',
      topics: [
        {
          id: 'soa4-t0',
          name: 'IAM & access management',
          concepts: [
            {
              id: 'soa4-t0-c0',
              services: [{ icon: 'iam', label: 'AWS IAM' }],
              title: 'IAM policy evaluation, roles, and least privilege',
              summary:
                'IAM authorises requests by evaluating policies; an explicit Deny always wins, roles provide temporary credentials, and least privilege keeps blast radius small.',
              explanation:
                'IAM controls who can do what. Identity-based policies attach to users, groups, and roles; resource-based policies attach to resources such as S3 buckets and SQS queues. When a request is made, IAM evaluates all applicable policies: by default everything is implicitly denied, an Allow grants access, and an explicit Deny overrides any Allow. In a multi-account setup, Service Control Policies (SCPs) from AWS Organizations and permission boundaries set the maximum permissions an identity can ever have, even if a policy grants more. The operationally critical pattern is the IAM role: an identity with no long-term credentials that is assumed to receive temporary credentials from STS — used by EC2 instances (via an instance profile), Lambda functions, and for cross-account access, so you never store long-term keys on a server. To debug "access denied" problems, use the IAM Policy Simulator and check whether an explicit Deny, an SCP, or a permission boundary is blocking the action. Always grant least privilege and prefer roles over long-lived access keys.',
              keyPoints: [
                'Evaluation: implicit deny by default; explicit Deny beats any Allow.',
                'SCPs (Organizations) and permission boundaries cap the maximum permissions an identity can have.',
                'Roles give temporary STS credentials — use them for EC2 (instance profile), Lambda, and cross-account.',
                'Debug access denials with the IAM Policy Simulator; look for a Deny, SCP, or boundary.',
                'Grant least privilege; avoid long-term access keys on servers.',
              ],
              code: {
                language: 'json',
                lines: [
                  '{',
                  '  "Version": "2012-10-17",',
                  '  "Statement": [',
                  '    {',
                  '      "Effect": "Deny",',
                  '      "Action": "s3:DeleteObject",',
                  '      "Resource": "arn:aws:s3:::audit-logs/*"',
                  '    }',
                  '  ]',
                  '}',
                ],
                explanation:
                  'An explicit Deny on DeleteObject for the audit-logs bucket. Even if another policy allows deletes, this Deny wins and the objects cannot be deleted.',
              },
              commonMistakes: [
                'Granting an Allow and expecting it to override a Deny — an explicit Deny always wins.',
                'Overlooking an SCP or permission boundary as the real cause of an unexplained access denial.',
              ],
              exercises: [
                {
                  type: 'quiz',
                  prompt:
                    'A user has an Allow for s3:PutObject from a group policy but an explicit Deny in an SCP. Can they upload?',
                  solution: {
                    explanation:
                      'No — the SCP Deny caps permissions and an explicit Deny overrides any Allow, so the action is blocked.',
                  },
                },
                {
                  type: 'task',
                  prompt: 'An application on EC2 needs to read S3 without stored keys. What is the recommended approach?',
                  solution: {
                    explanation:
                      'Attach an IAM role to the instance via an instance profile; the app receives temporary credentials from STS automatically.',
                  },
                },
                {
                  type: 'predict',
                  prompt: 'An action keeps returning AccessDenied even though the user policy allows it. What three things should you check?',
                  solution: {
                    explanation:
                      'An explicit Deny in any attached policy, a Service Control Policy in Organizations, and a permission boundary on the identity — any of these can block an otherwise-allowed action.',
                  },
                },
              ],
              docs: 'https://docs.aws.amazon.com/IAM/latest/UserGuide/reference_policies_evaluation-logic.html',
            },
          ],
        },
        {
          id: 'soa4-t1',
          name: 'Data protection & encryption',
          concepts: [
            {
              id: 'soa4-t1-c0',
              services: [{ icon: 'kms', label: 'AWS KMS' }, { icon: 's3', label: 'Amazon S3' }, { icon: 'ebs', label: 'Amazon EBS' }],
              title: 'KMS keys, encryption at rest and in transit',
              summary:
                'KMS manages encryption keys and integrates with most services for at-rest encryption; key usage is audited via CloudTrail; encryption in transit uses TLS.',
              explanation:
                'AWS KMS (Key Management Service) creates and controls KMS keys used to encrypt data across AWS. AWS-managed keys are created and rotated for you per service; customer-managed keys give you control over rotation, key policies, and grants, and let you audit every use through CloudTrail. Most storage encrypts at rest with one click: S3 server-side encryption (SSE-S3, SSE-KMS, or SSE-C), EBS volume encryption, RDS encryption, and EFS encryption all use KMS. Note operational specifics the exam likes: you enable EBS encryption at volume creation (you cannot directly toggle an existing unencrypted volume — you snapshot, copy with encryption, and restore), and a snapshot of an encrypted volume is itself encrypted. S3 can also enforce encryption with a bucket policy that denies unencrypted PUTs. Encryption in transit is achieved with TLS/HTTPS, often using certificates from AWS Certificate Manager (ACM), which provisions and auto-renews them. KMS automatic key rotation (annual for customer-managed keys) reduces operational burden.',
              keyPoints: [
                'KMS keys encrypt data across services; customer-managed keys give control and CloudTrail-audited usage.',
                'At rest: S3 (SSE-S3/SSE-KMS/SSE-C), EBS, RDS, EFS all encrypt via KMS.',
                'Encrypt EBS at creation; to encrypt an existing volume, snapshot → copy with encryption → restore.',
                'A snapshot of an encrypted volume is also encrypted; enforce S3 encryption with a bucket policy.',
                'In transit: TLS/HTTPS with ACM-managed certificates; KMS supports automatic annual key rotation.',
              ],
              commonMistakes: [
                'Thinking you can flip an existing unencrypted EBS volume to encrypted in place — you must snapshot, copy with encryption, then create a new volume.',
                'Confusing encryption at rest (KMS) with encryption in transit (TLS) — the exam may ask for one specifically.',
              ],
              exercises: [
                {
                  type: 'quiz',
                  prompt:
                    'You have an unencrypted EBS volume with important data and must make it encrypted. What is the supported process?',
                  solution: {
                    explanation:
                      'Take a snapshot, copy the snapshot with encryption enabled (choosing a KMS key), then create a new volume from the encrypted snapshot and attach it.',
                  },
                },
                {
                  type: 'quiz',
                  prompt: 'Which service audits every use of a customer-managed encryption key?',
                  solution: { explanation: 'AWS CloudTrail records KMS key usage (encrypt/decrypt/generate) for audit.' },
                },
                {
                  type: 'task',
                  prompt: 'How do you enforce that all objects uploaded to an S3 bucket are encrypted?',
                  solution: {
                    explanation:
                      'Attach a bucket policy that denies PutObject requests lacking the required server-side encryption header (e.g. requiring aws:kms or AES256).',
                  },
                },
              ],
              docs: 'https://docs.aws.amazon.com/kms/latest/developerguide/overview.html',
            },
          ],
        },
        {
          id: 'soa4-t2',
          name: 'Compliance auditing',
          concepts: [
            {
              id: 'soa4-t2-c0',
              services: [{ icon: 'config', label: 'AWS Config' }, { icon: 'cloudtrail', label: 'AWS CloudTrail' }, { icon: 'trustedadvisor', label: 'AWS Trusted Advisor' }],
              title: 'AWS Config, conformance packs, and continuous compliance',
              summary:
                'AWS Config records configuration state and history, evaluates rules continuously, and bundles rules into conformance packs; together with CloudTrail and Trusted Advisor it gives a full compliance picture.',
              explanation:
                'AWS Config is the configuration auditor. It continuously records the configuration of supported resources, keeps a configuration timeline (what a resource looked like and when it changed), and evaluates resources against Config rules — AWS-managed rules (for example, encrypted-volumes, restricted-ssh, s3-bucket-public-read-prohibited) or custom rules backed by Lambda — marking each COMPLIANT or NON_COMPLIANT. A conformance pack groups many rules (and remediation actions) into a single deployable unit, often mapped to a compliance framework, and can be deployed organisation-wide via StackSets. Distinguish the three governance services: CloudTrail answers who made an API call and when; Config answers what a resource\'s configuration is now and how it changed over time, and whether it is compliant; Trusted Advisor gives best-practice recommendations across cost, performance, security, fault tolerance, and service limits. The operational pattern is continuous compliance: Config detects drift, conformance packs define the desired posture, and remediation (SSM Automation) brings resources back in line.',
              keyPoints: [
                'Config records configuration history and evaluates resources against rules (COMPLIANT / NON_COMPLIANT).',
                'Conformance packs bundle rules plus remediation into one deployable unit, deployable org-wide.',
                'CloudTrail = who did what (API audit); Config = what the config is and how it changed; Trusted Advisor = best-practice checks.',
                'Config integrates with SSM Automation for automatic remediation of non-compliant resources.',
                'Together they deliver continuous compliance: detect, define posture, remediate.',
              ],
              diagram: {
                type: 'mermaid',
                lines: [
                  'flowchart LR',
                  '  CT[CloudTrail<br/>who did what] --- View[Governance view]',
                  '  CFG[Config<br/>what changed and compliance] --- View',
                  '  TA[Trusted Advisor<br/>best-practice checks] --- View',
                ],
                caption: 'CloudTrail, Config, and Trusted Advisor answer different governance questions; together they form a full compliance picture.',
              },
              commonMistakes: [
                'Confusing Config (resource configuration and compliance) with CloudTrail (API call audit).',
                'Expecting Trusted Advisor to track configuration change history — that is AWS Config\'s job.',
              ],
              exercises: [
                {
                  type: 'quiz',
                  prompt:
                    'Auditors require continuous evaluation that no S3 bucket is publicly readable and a record of when any bucket\'s configuration changed. Which service?',
                  solution: {
                    explanation:
                      'AWS Config — use the s3-bucket-public-read-prohibited rule for continuous evaluation, and its configuration timeline for change history.',
                  },
                },
                {
                  type: 'quiz',
                  prompt: 'You want to deploy a whole set of compliance rules mapped to a framework across the organisation in one action. What do you use?',
                  solution: { explanation: 'A Config conformance pack (deployed org-wide, e.g. via StackSets).' },
                },
                {
                  type: 'task',
                  prompt: 'Match the question to the service: (a) who deleted this bucket, (b) is this bucket encrypted right now, (c) am I close to a service limit.',
                  solution: { explanation: '(a) CloudTrail, (b) AWS Config, (c) Trusted Advisor.' },
                },
              ],
              docs: 'https://docs.aws.amazon.com/config/latest/developerguide/WhatIsConfig.html',
            },
          ],
        },
      ],
    },

    /* ──────────────── DOMAIN 5 — NETWORKING AND CONTENT DELIVERY (18%) ──────────────── */
    {
      level: 5,
      name: 'Networking & Delivery',
      focus: 'Build and secure VPCs, connect hybrid and global networks, and deliver content fast (Domain 5 · 18%)',
      accent: '#dd344c',
      soft: '#fde8ed',
      topics: [
        {
          id: 'soa5-t0',
          name: 'VPC fundamentals',
          concepts: [
            {
              id: 'soa5-t0-c0',
              services: [{ icon: 'vpc', label: 'Amazon VPC' }],
              title: 'Subnets, route tables, gateways, and NAT',
              summary:
                'A VPC is your isolated network, split into subnets per AZ. Route tables, an internet gateway, and NAT gateways control how subnets reach the internet.',
              explanation:
                'Amazon VPC is a logically isolated virtual network where you choose the IPv4 CIDR block (e.g. 10.0.0.0/16). You divide it into subnets, each pinned to one Availability Zone. Whether a subnet is public or private is determined by its route table: a public subnet has a route to an internet gateway (IGW); a private subnet does not. Instances in a private subnet that need outbound internet access (for example, to download updates) route through a NAT gateway placed in a public subnet — the NAT gateway allows outbound connections but blocks unsolicited inbound, and is a managed, highly available, AZ-scoped resource (deploy one per AZ for resilience). The main route table applies to subnets without an explicit association. For operations, common tasks include troubleshooting why a private instance cannot reach the internet (missing NAT route, NAT in a private subnet, or a missing default route) and enabling VPC Flow Logs to capture accepted/rejected traffic for diagnosis. A bring-your-own design also uses multiple subnets across AZs for high availability.',
              keyPoints: [
                'VPC has a CIDR you choose; subnets are each tied to a single AZ.',
                'Public vs private is decided by the route table: a route to the IGW makes a subnet public.',
                'NAT gateway gives private subnets outbound-only internet; place it in a public subnet, one per AZ for HA.',
                'The main route table applies to unassociated subnets.',
                'VPC Flow Logs capture accepted/rejected IP traffic for troubleshooting.',
              ],
              diagram: {
                type: 'mermaid',
                lines: [
                  'flowchart TB',
                  '  IGW[Internet gateway] --> PUB[Public subnet]',
                  '  PUB --> NAT[NAT gateway]',
                  '  NAT --> PRIV[Private subnet]',
                  '  PUB --> WEB[Web tier]',
                  '  PRIV --> APP[App / DB tier]',
                ],
                caption: 'Public subnets reach the internet via the IGW; private subnets use a NAT gateway for outbound-only access.',
              },
              commonMistakes: [
                'Placing a NAT gateway in a private subnet — it must sit in a public subnet with a route to the IGW.',
                'Expecting one subnet to span multiple AZs — a subnet lives in exactly one AZ.',
              ],
              exercises: [
                {
                  type: 'quiz',
                  prompt:
                    'Instances in a private subnet cannot download OS updates from the internet, although they must stay unreachable from outside. What component do you add and where?',
                  solution: {
                    explanation:
                      'A NAT gateway in a public subnet, plus a route in the private subnet\'s route table sending 0.0.0.0/0 to that NAT gateway — outbound only.',
                  },
                },
                {
                  type: 'task',
                  prompt: 'How do you tell whether a subnet is public or private?',
                  solution: {
                    explanation: 'Check its route table — if it has a route to an internet gateway it is public; otherwise it is private.',
                  },
                },
                {
                  type: 'quiz',
                  prompt: 'Which feature captures accepted and rejected IP traffic in a VPC for troubleshooting?',
                  solution: { explanation: 'VPC Flow Logs.' },
                },
              ],
              docs: 'https://docs.aws.amazon.com/vpc/latest/userguide/what-is-amazon-vpc.html',
            },
            {
              id: 'soa5-t0-c1',
              services: [{ icon: 'vpc', label: 'Amazon VPC' }],
              title: 'Security groups vs network ACLs',
              summary:
                'Two firewall layers: stateful security groups at the instance level (allow rules only) and stateless network ACLs at the subnet level (allow and deny rules).',
              explanation:
                'A VPC offers two complementary firewalls. A security group operates at the instance (ENI) level, is stateful (if you allow inbound traffic, the matching response is automatically allowed back out), supports allow rules only, and evaluates all rules together. A network ACL operates at the subnet level, is stateless (you must explicitly allow both the inbound traffic and the corresponding outbound return traffic, including ephemeral ports), supports both allow and deny rules, and processes them in numbered order (lowest rule number first, stopping at the first match). Security groups are the primary control; NACLs add a coarse, subnet-wide layer — for example, to block a specific malicious IP range, which security groups cannot do because they only allow. A frequent operations bug is forgetting that NACLs need an outbound rule for the ephemeral port range so return traffic is permitted.',
              keyPoints: [
                'Security group: instance-level, stateful, allow-only, all rules evaluated.',
                'Network ACL: subnet-level, stateless, allow and deny, evaluated in numbered order until first match.',
                'Stateful = return traffic auto-allowed; stateless = must allow both directions, including ephemeral ports.',
                'Use a NACL to explicitly deny an IP range — security groups cannot deny.',
                'Common bug: missing NACL outbound rule for ephemeral ports blocks return traffic.',
              ],
              diagram: {
                type: 'mermaid',
                lines: [
                  'flowchart LR',
                  '  T[Inbound traffic] --> NACL[Network ACL<br/>subnet · stateless]',
                  '  NACL --> SG[Security group<br/>instance · stateful]',
                  '  SG --> I[Instance]',
                ],
                caption: 'Traffic crosses the subnet-level network ACL, then the instance-level security group, before reaching the instance.',
              },
              commonMistakes: [
                'Trying to add a deny rule to a security group — security groups only support allow rules.',
                'Forgetting that NACLs are stateless and omitting the ephemeral-port outbound rule, breaking responses.',
              ],
              exercises: [
                {
                  type: 'quiz',
                  prompt: 'You must block one specific IP address from reaching every instance in a subnet. Which control supports an explicit deny?',
                  solution: { explanation: 'A network ACL (NACLs support deny rules; security groups do not).' },
                },
                {
                  type: 'predict',
                  prompt:
                    'A subnet\'s NACL allows inbound HTTP but users get no response. The outbound rules allow only port 80. Why does it fail?',
                  solution: {
                    explanation:
                      'NACLs are stateless — the response leaves on an ephemeral port (e.g. 1024–65535), so the outbound rules must allow that ephemeral port range, not just port 80.',
                  },
                },
              ],
              docs: 'https://docs.aws.amazon.com/vpc/latest/userguide/vpc-security-groups.html',
            },
          ],
        },
        {
          id: 'soa5-t1',
          name: 'Hybrid & VPC connectivity',
          concepts: [
            {
              id: 'soa5-t1-c0',
              services: [{ icon: 'directconnect', label: 'AWS Direct Connect' }, { icon: 'vpc', label: 'Amazon VPC' }],
              title: 'VPN, Direct Connect, peering, and Transit Gateway',
              summary:
                'Connect on-premises networks to AWS over an encrypted VPN or a dedicated Direct Connect link, and connect VPCs with peering or a Transit Gateway hub.',
              explanation:
                'A Site-to-Site VPN creates an encrypted IPsec tunnel over the public internet between your on-premises gateway and a virtual private gateway or transit gateway — quick to set up but subject to internet variability. AWS Direct Connect provides a dedicated, private physical link from your data centre to AWS, delivering consistent low latency and high, predictable bandwidth and reducing data-transfer costs at volume; it takes longer to provision. A common resilient design uses Direct Connect as the primary path with a Site-to-Site VPN as encrypted backup. For VPC-to-VPC connectivity, VPC peering creates a one-to-one private connection (it is non-transitive — peered VPCs cannot route through each other to a third). When you must connect many VPCs and on-premises networks, AWS Transit Gateway acts as a central hub, simplifying a mesh of peerings into a hub-and-spoke topology that scales. VPC endpoints (interface or gateway) let resources reach AWS services privately without an internet gateway.',
              keyPoints: [
                'Site-to-Site VPN = encrypted IPsec tunnel over the internet, fast to set up.',
                'Direct Connect = dedicated private link, consistent latency/bandwidth, lower transfer cost; slow to provision.',
                'Resilient pattern: Direct Connect primary + VPN backup.',
                'VPC peering = one-to-one and non-transitive; Transit Gateway = scalable hub for many VPCs/on-prem.',
                'VPC endpoints reach AWS services privately without traversing the internet.',
              ],
              diagram: {
                type: 'mermaid',
                lines: [
                  'flowchart LR',
                  '  V1[VPC A] --- TGW[Transit Gateway]',
                  '  V2[VPC B] --- TGW',
                  '  V3[VPC C] --- TGW',
                  '  DC[On-premises] --- TGW',
                ],
                caption: 'Transit Gateway connects many VPCs and on-premises networks through a single scalable hub.',
              },
              commonMistakes: [
                'Expecting VPC peering to be transitive — a VPC cannot route through a peer to reach a third VPC.',
                'Choosing a VPN when the requirement is consistent, dedicated bandwidth (that is Direct Connect).',
              ],
              exercises: [
                {
                  type: 'quiz',
                  prompt:
                    'A company needs a private, dedicated connection to AWS with consistent latency and high bandwidth, not over the public internet. Which service?',
                  solution: { explanation: 'AWS Direct Connect.' },
                },
                {
                  type: 'quiz',
                  prompt: 'You must interconnect 15 VPCs plus on-premises without managing a full mesh of peerings. What do you use?',
                  solution: { explanation: 'AWS Transit Gateway (hub-and-spoke).' },
                },
                {
                  type: 'predict',
                  prompt: 'VPC A peers with B, and B peers with C. Can A reach C through B?',
                  solution: {
                    explanation:
                      'No — VPC peering is non-transitive. A and C need their own peering (or a Transit Gateway) to communicate.',
                  },
                },
              ],
              docs: 'https://docs.aws.amazon.com/directconnect/latest/UserGuide/Welcome.html',
            },
          ],
        },
        {
          id: 'soa5-t1b',
          name: 'DNS with Route 53',
          concepts: [
            {
              id: 'soa5-t1b-c0',
              services: [{ icon: 'route53', label: 'Amazon Route 53' }],
              title: 'Route 53 record types and routing policies',
              summary:
                'Route 53 is managed DNS with record types like A, AAAA, CNAME, and alias, plus routing policies that decide how queries are answered for performance, geography, and traffic splitting.',
              explanation:
                'Amazon Route 53 resolves domain names to endpoints and registers domains. Standard record types include A (IPv4), AAAA (IPv6), CNAME (alias one name to another, but not at the zone apex), MX, TXT, and the AWS-specific alias record, which maps a name directly to an AWS resource (ELB, CloudFront, S3 website, API Gateway) at no query cost and, unlike a CNAME, works at the zone apex (the bare domain). Routing policies decide which answer to return: Simple (one record), Weighted (split by assigned weights for canary or A/B testing), Latency (lowest-latency Region), Failover (active-passive with health checks), Geolocation (by the user\'s location, useful for compliance or localised content), Geoproximity (by distance with a bias), and Multivalue answer (return several healthy records as basic load balancing). Operationally, remember that DNS responses are cached for the record TTL, so changes (including failover) take effect only after the TTL expires on resolvers and clients.',
              keyPoints: [
                'Records: A, AAAA, CNAME (not at zone apex), MX, TXT; alias maps to AWS resources at no cost and works at the apex.',
                'Weighted = split traffic by percentage (canary/A-B); Latency = lowest-latency Region.',
                'Failover = active-passive with health checks; Geolocation = by user location; Geoproximity = by distance with bias.',
                'Multivalue answer returns several healthy records for simple load balancing.',
                'TTL governs DNS caching — lower it where you need fast changes or failover.',
              ],
              commonMistakes: [
                'Using a CNAME at the zone apex (bare domain) — use an alias record instead.',
                'Setting a high TTL on records that must fail over quickly, delaying the switch.',
              ],
              exercises: [
                {
                  type: 'quiz',
                  prompt:
                    'You want the bare domain example.com to point to an Application Load Balancer. Which record type works at the zone apex?',
                  solution: { explanation: 'An alias record (a CNAME cannot be used at the zone apex).' },
                },
                {
                  type: 'quiz',
                  prompt: 'Which routing policy directs users to the Region that gives them the lowest latency?',
                  solution: { explanation: 'Latency-based routing.' },
                },
                {
                  type: 'task',
                  prompt: 'You must serve users in Germany content from an EU endpoint for data-residency reasons. Which routing policy?',
                  solution: { explanation: 'Geolocation routing (route by the user\'s location).' },
                },
              ],
              docs: 'https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/routing-policy.html',
            },
          ],
        },
        {
          id: 'soa5-t2',
          name: 'Content delivery & edge',
          concepts: [
            {
              id: 'soa5-t2-c0',
              services: [{ icon: 'cloudfront', label: 'Amazon CloudFront' }, { icon: 's3', label: 'Amazon S3' }, { icon: 'waf', label: 'AWS WAF' }],
              title: 'CloudFront caching, origins, and edge security',
              summary:
                'CloudFront caches content at edge locations near users, supports multiple origins with cache behaviours, and integrates with WAF and OAC to secure delivery.',
              explanation:
                'Amazon CloudFront is a global content delivery network that caches data, media, and API responses at hundreds of edge locations, routing each user to the nearest one to cut latency and offload the origin. An origin can be an S3 bucket, an ALB, an EC2 instance, or a custom HTTP server; cache behaviours map URL path patterns to origins and control caching (TTLs, query-string/header/cookie forwarding). To secure delivery, use Origin Access Control (OAC) so an S3 origin only accepts requests from your distribution, keeping the bucket private; attach AWS WAF to filter Layer-7 attacks (SQL injection, cross-site scripting) at the edge; and serve over HTTPS with an ACM certificate (ACM certs for CloudFront must be in us-east-1). CloudFront includes built-in network/transport-layer DDoS protection and works with AWS Shield. To push updated content immediately, create an invalidation; to control caching well, set appropriate TTLs and use cache policies. The exam contrasts CloudFront (caching/CDN) with Global Accelerator (static anycast IPs over the AWS backbone for non-cacheable, latency-sensitive TCP/UDP).',
              keyPoints: [
                'CloudFront caches at edge locations near users; cache behaviours map path patterns to origins.',
                'Secure an S3 origin with Origin Access Control (OAC) so the bucket stays private.',
                'Attach AWS WAF for Layer-7 filtering; serve HTTPS with an ACM cert (in us-east-1 for CloudFront).',
                'Invalidations push fresh content immediately; TTLs and cache policies control caching.',
                'CloudFront = caching CDN; Global Accelerator = static anycast IPs over the backbone for non-cacheable traffic.',
              ],
              diagram: {
                type: 'mermaid',
                lines: [
                  'flowchart LR',
                  '  U[User] --> E[CloudFront edge cache]',
                  '  E -->|cache miss| O[Origin S3 or ALB]',
                  '  WAF[AWS WAF] --- E',
                  '  E -->|cache hit| U',
                ],
                caption: 'CloudFront serves cached content from the nearest edge, fetching from the origin only on a cache miss, with WAF filtering at the edge.',
              },
              commonMistakes: [
                'Making the S3 origin bucket public instead of using Origin Access Control to keep it private.',
                'Placing the ACM certificate for a CloudFront distribution in the wrong Region — it must be in us-east-1.',
              ],
              exercises: [
                {
                  type: 'quiz',
                  prompt:
                    'A global audience experiences high latency loading images served from a single Region. Which service caches them near users?',
                  solution: { explanation: 'Amazon CloudFront (CDN) caching at edge locations.' },
                },
                {
                  type: 'quiz',
                  prompt: 'How do you let CloudFront serve from a private S3 bucket without making the bucket public?',
                  solution: { explanation: 'Use Origin Access Control (OAC) so only the distribution can read the bucket, keeping it private.' },
                },
                {
                  type: 'task',
                  prompt: 'You deployed new site content but users still see the old version cached at the edge. What do you do?',
                  solution: {
                    explanation:
                      'Create a CloudFront invalidation for the changed paths (or version the object names) so the edge fetches the new content.',
                  },
                },
              ],
              docs: 'https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/Introduction.html',
            },
          ],
        },
      ],
    },

    /* ──────────────── DOMAIN 6 — COST AND PERFORMANCE OPTIMIZATION (12%) ──────────────── */
    {
      level: 6,
      name: 'Cost & Performance',
      focus: 'Track and control spend, right-size resources, and tune performance across the stack (Domain 6 · 12%)',
      accent: '#2e73b8',
      soft: '#e7f0fa',
      topics: [
        {
          id: 'soa6-t0',
          name: 'Cost management',
          concepts: [
            {
              id: 'soa6-t0-c0',
              services: [{ icon: 'costexplorer', label: 'AWS Cost Explorer' }, { icon: 'budgets', label: 'AWS Budgets' }],
              title: 'Cost Explorer, Budgets, and cost allocation tags',
              summary:
                'Cost Explorer analyses and forecasts spend, AWS Budgets alerts you before you overspend, and cost allocation tags let you attribute spend to teams and projects.',
              explanation:
                'Cost control is mostly visibility plus guardrails. AWS Cost Explorer visualises past and current spend with about 13 months of history and a forecast, letting you filter and group by service, account, Region, and tag, and it surfaces rightsizing and Savings Plans recommendations. AWS Budgets lets you define cost, usage, Reserved Instance/Savings Plans coverage, or utilisation budgets and trigger alerts (via SNS/email) when actual or forecasted values cross a threshold; budget actions can even apply an IAM policy or stop resources automatically when a budget is exceeded. To attribute spend, you activate cost allocation tags (user-defined or AWS-generated) so charges can be grouped by project, team, environment, or cost centre — tags only appear in cost reports after activation, and only affect data going forward. The AWS Cost and Usage Report (CUR) delivers the most granular line-item data to S3 for deep analysis (e.g. with Athena). For multi-account organisations, consolidated billing in AWS Organizations aggregates usage for one bill and shared volume discounts.',
              keyPoints: [
                'Cost Explorer: analyse/forecast spend (~13 months history) with rightsizing and Savings Plans recommendations.',
                'AWS Budgets: alert on cost/usage/coverage thresholds; budget actions can stop resources or apply IAM policies.',
                'Cost allocation tags attribute spend by project/team/environment — must be activated and apply going forward.',
                'Cost and Usage Report (CUR): most granular line-item data to S3 for analysis (e.g. Athena).',
                'Consolidated billing (Organizations) aggregates usage for one bill and shared discounts.',
              ],
              commonMistakes: [
                'Confusing the Pricing Calculator (estimate before building) with Cost Explorer (analyse actual spend after).',
                'Expecting newly activated cost allocation tags to retroactively categorise past spend — they apply only going forward.',
              ],
              exercises: [
                {
                  type: 'quiz',
                  prompt:
                    'Finance wants an email when monthly spend is forecast to exceed $5,000, and to automatically stop non-production instances if the budget is breached. Which service?',
                  solution: {
                    explanation:
                      'AWS Budgets — a cost budget with an alert on the forecasted threshold and a budget action to stop the tagged non-production instances.',
                  },
                },
                {
                  type: 'quiz',
                  prompt: 'You need to attribute spend to specific teams and projects in cost reports. What do you set up?',
                  solution: { explanation: 'Activate cost allocation tags and apply consistent tag keys/values to resources.' },
                },
                {
                  type: 'task',
                  prompt: 'Where do you go to analyse the last several months of spend and see a forecast and rightsizing recommendations?',
                  solution: { explanation: 'AWS Cost Explorer.' },
                },
              ],
              docs: 'https://docs.aws.amazon.com/cost-management/latest/userguide/what-is-costmanagement.html',
            },
          ],
        },
        {
          id: 'soa6-t1',
          name: 'Right-sizing & recommendations',
          concepts: [
            {
              id: 'soa6-t1-c0',
              services: [{ icon: 'trustedadvisor', label: 'AWS Trusted Advisor' }, { icon: 'costexplorer', label: 'AWS Compute Optimizer' }],
              title: 'Trusted Advisor, Compute Optimizer, and right-sizing',
              summary:
                'Trusted Advisor checks your account across five categories; Compute Optimizer uses machine learning to recommend right-sized resources; both cut waste and improve performance.',
              explanation:
                'Two services drive optimisation recommendations. AWS Trusted Advisor inspects your account and recommends improvements across five categories: cost optimisation (e.g. idle load balancers, underused EC2 instances, unattached EBS volumes), performance, security, fault tolerance, and service limits/quotas; the full set of checks requires Business or Enterprise Support. AWS Compute Optimizer goes deeper, analysing CloudWatch utilisation history with machine learning to recommend optimal EC2 instance types and sizes, Auto Scaling group configurations, EBS volume types, and Lambda memory settings — flagging over-provisioned (waste) and under-provisioned (performance risk) resources. Right-sizing is the practical outcome: match instance family and size to real CPU, memory, and network usage rather than guesses, and prefer Graviton (Arm) or newer generations for better price-performance. Combined with purchasing options (Savings Plans/Reserved Instances for steady workloads, Spot for fault-tolerant batch) and turning off idle resources (e.g. scheduled stop of dev/test), these tools systematically remove waste while protecting performance.',
              keyPoints: [
                'Trusted Advisor checks: cost, performance, security, fault tolerance, service limits (full set on Business/Enterprise).',
                'Compute Optimizer: ML-based right-sizing for EC2, ASGs, EBS, and Lambda from utilisation history.',
                'Right-sizing matches instance family/size to real usage; over-provisioned = waste, under-provisioned = risk.',
                'Prefer newer generations / Graviton for better price-performance.',
                'Pair with Savings Plans/RIs (steady), Spot (fault-tolerant batch), and scheduled stop of idle resources.',
              ],
              diagram: {
                type: 'mermaid',
                lines: [
                  'flowchart LR',
                  '  CW[CloudWatch utilisation] --> CO[Compute Optimizer]',
                  '  CO --> Rec[Right-size recommendations]',
                  '  TA[Trusted Advisor] --> Waste[Find idle / underused resources]',
                  '  Rec --> Save[Lower cost · right performance]',
                  '  Waste --> Save',
                ],
                caption: 'Compute Optimizer recommends right-sized resources from utilisation data; Trusted Advisor flags idle and underused resources.',
              },
              commonMistakes: [
                'Expecting the full Trusted Advisor check set on Basic/Developer Support — most checks require Business or Enterprise.',
                'Right-sizing on a guess instead of using Compute Optimizer / CloudWatch utilisation data.',
              ],
              exercises: [
                {
                  type: 'quiz',
                  prompt:
                    'You want machine-learning-based recommendations for optimal EC2 instance types and Lambda memory based on real utilisation. Which service?',
                  solution: { explanation: 'AWS Compute Optimizer.' },
                },
                {
                  type: 'quiz',
                  prompt: 'Which service flags idle load balancers, underused instances, and unattached EBS volumes as part of cost checks?',
                  solution: { explanation: 'AWS Trusted Advisor (cost optimisation category).' },
                },
                {
                  type: 'task',
                  prompt: 'A 24/7 instance runs at 8% CPU and 20% memory all month. What is the optimisation action?',
                  solution: {
                    explanation:
                      'Right-size to a smaller instance (per Compute Optimizer), and if steady, cover it with a Savings Plan or Reserved Instance to cut cost further.',
                  },
                },
              ],
              docs: 'https://docs.aws.amazon.com/compute-optimizer/latest/ug/what-is-compute-optimizer.html',
            },
          ],
        },
        {
          id: 'soa6-t2',
          name: 'Performance optimization',
          concepts: [
            {
              id: 'soa6-t2-c0',
              services: [{ icon: 'elasticache', label: 'Amazon ElastiCache' }, { icon: 'ebs', label: 'Amazon EBS' }, { icon: 'cloudfront', label: 'Amazon CloudFront' }],
              title: 'Caching, EBS performance, and scaling for performance',
              summary:
                'Improve performance by caching (ElastiCache, CloudFront, DAX), choosing the right EBS volume type and tuning IOPS/throughput, and scaling horizontally to spread load.',
              explanation:
                'Performance optimisation across the stack draws on a few repeatable levers. Caching reduces load and latency: Amazon ElastiCache (Redis/Memcached) caches database query results and session data for sub-millisecond reads; CloudFront caches static and dynamic content at the edge; and DynamoDB Accelerator (DAX) caches DynamoDB reads. On storage, pick the right EBS volume type — gp3 (general-purpose SSD) lets you provision IOPS and throughput independently of size, io1/io2 (provisioned IOPS SSD) serve latency-sensitive, high-IOPS databases, while st1/sc1 (HDD) suit large sequential throughput workloads; you can also use EBS-optimised instances to dedicate bandwidth to volumes. For compute, scaling horizontally behind a load balancer with Auto Scaling spreads load and removes single bottlenecks, and read replicas offload read-heavy databases. Always measure first with CloudWatch (and the CloudWatch agent for memory) and X-Ray for request tracing to find the true bottleneck before changing anything. The exam favours caching and right volume-type choices as cost-effective ways to raise performance.',
              keyPoints: [
                'Caching layers: ElastiCache (DB/session), CloudFront (edge content), DAX (DynamoDB reads) cut latency and load.',
                'EBS: gp3 lets you set IOPS/throughput independent of size; io1/io2 for high-IOPS databases; st1/sc1 for throughput HDD.',
                'EBS-optimised instances dedicate bandwidth to storage; match volume type to the workload.',
                'Scale horizontally with Auto Scaling + ELB; use read replicas to offload read-heavy databases.',
                'Measure first with CloudWatch and X-Ray to find the real bottleneck before optimising.',
              ],
              diagram: {
                type: 'mermaid',
                lines: [
                  'flowchart LR',
                  '  App[Application] --> Cache[ElastiCache]',
                  '  Cache -->|hit| App',
                  '  Cache -.miss.-> DB[Database]',
                  '  DB --> Cache',
                ],
                caption: 'A cache-aside pattern with ElastiCache returns hot data in sub-milliseconds and only reaches the database on a cache miss.',
              },
              commonMistakes: [
                'Scaling up the database instead of adding a cache or read replicas for a read-heavy workload.',
                'Optimising blindly without first using CloudWatch/X-Ray to identify the actual bottleneck.',
              ],
              exercises: [
                {
                  type: 'quiz',
                  prompt:
                    'A read-heavy application repeatedly runs the same expensive database queries. What is the most cost-effective way to cut latency and database load?',
                  solution: {
                    explanation:
                      'Add an in-memory cache such as Amazon ElastiCache to serve repeated query results, reducing latency to sub-milliseconds and offloading the database.',
                  },
                },
                {
                  type: 'quiz',
                  prompt: 'Which EBS volume type lets you provision IOPS and throughput independently of the volume size at lower cost than io2?',
                  solution: { explanation: 'gp3 (general-purpose SSD).' },
                },
                {
                  type: 'predict',
                  prompt:
                    'A team plans to buy a much bigger instance to fix slowness but has no metrics. What should they do first?',
                  solution: {
                    explanation:
                      'Measure with CloudWatch (and X-Ray) to locate the real bottleneck — it may be I/O, a missing cache, or a single-threaded section — before resizing, to avoid spending more without fixing the cause.',
                  },
                },
              ],
              docs: 'https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ebs-volume-types.html',
            },
          ],
        },
      ],
    },
  ],
};

export default content;
