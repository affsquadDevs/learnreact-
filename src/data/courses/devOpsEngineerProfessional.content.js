// AWS Certified DevOps Engineer – Professional — course content.
// Professional-level coverage of the AWS Certified DevOps Engineer – Professional (DOP-C02)
// exam, organised into the six official exam domains. The factual material (service names
// and what they do) is rewritten in our own words for self-study; diagrams and snippets are
// our own creations. Not affiliated with or endorsed by AWS.
//
// Exam domains & weightings (DOP-C02):
//   1. SDLC Automation ......................................... 22%
//   2. Configuration Management and Infrastructure as Code ..... 17%
//   3. Resilient Cloud Solutions ............................... 15%
//   4. Monitoring and Logging .................................. 15%
//   5. Incident and Event Response ............................. 14%
//   6. Security and Compliance ................................. 17%

const content = {
  meta: {
    title: 'AWS Certified DevOps Engineer – Professional (DOP-C02)',
    description:
      'A deep, professional-level path to the AWS Certified DevOps Engineer – Professional (DOP-C02) exam: building CI/CD pipelines with the AWS developer tools, infrastructure as code with CloudFormation and the CDK, resilient and self-healing multi-Region architectures, end-to-end monitoring and centralised logging, automated incident and event response, and security/compliance as code — with Mermaid diagrams, CloudFormation and pipeline snippets, scenario quizzes and hands-on tasks.',
    schemaVersion: '1.0',
    status: 'complete',
  },
  levels: [
    /* ───────────────────────── DOMAIN 1 — SDLC AUTOMATION (22%) ───────────────────────── */
    {
      level: 1,
      name: 'SDLC Automation',
      focus: 'Designing and managing CI/CD pipelines, build and test automation, artifacts, and advanced deployment strategies (Domain 1 · 22%)',
      accent: '#2d6bff',
      soft: '#eaf0ff',
      topics: [
        {
          id: 'dop1-t0',
          name: 'CI/CD pipeline orchestration',
          concepts: [
            {
              id: 'dop1-t0-c0',
              services: [
                { icon: 'management', label: 'AWS CodePipeline' },
                { icon: 'eventbridge', label: 'Amazon EventBridge' },
              ],
              title: 'CodePipeline: stages, actions, and pipeline types',
              summary:
                'AWS CodePipeline models your release process as ordered stages of actions, moving an artifact from source through build, test and deploy. The professional exam focuses on how transitions, action types and triggers shape the release flow.',
              explanation:
                "AWS CodePipeline is a fully managed continuous-delivery service that automates the steps needed to release software. A pipeline is a sequence of stages, and each stage contains one or more actions. Action categories are Source, Build, Test, Deploy, Approval and Invoke. Actions within a stage can run in parallel (same runOrder) or in sequence (different runOrder values), and a stage only advances when all its actions succeed. Between stages there are transitions you can disable to hold a release. Each run carries artifacts — zipped sets of files stored in an S3 artifact bucket — that one action produces (outputArtifacts) and the next consumes (inputArtifacts). Modern pipelines come in two execution modes: V1 runs one execution per stage at a time and supersedes queued runs; V2 adds parallel and queued execution modes, plus pipeline-level variables, triggers with git-tag and branch filters, and stage-level conditions. Pipelines are triggered by source changes (CodeCommit, GitHub via a connection, S3, ECR) detected through Amazon EventBridge, or started manually or on a schedule.",
              analogy:
                'Think of a pipeline like an assembly line in a factory: each station (stage) performs work on the product (artifact) and passes it to the next; if a station fails its quality check, the line halts before the defect ships.',
              keyPoints: [
                'A pipeline = ordered stages; a stage = one or more actions (Source, Build, Test, Deploy, Approval, Invoke).',
                'runOrder controls parallel vs sequential actions within a stage; a stage advances only when all actions succeed.',
                'Artifacts flow between actions via an S3 artifact bucket (outputArtifacts → inputArtifacts).',
                'V2 pipelines add parallel/queued execution modes, pipeline variables, git triggers (tags/branches) and stage conditions.',
                'Source changes are detected via EventBridge rules, not slow polling — faster and avoids API throttling.',
                'Disable a transition to hold releases without deleting pipeline structure.',
              ],
              commonMistakes: [
                'Relying on periodic source polling instead of EventBridge change detection — polling is slower and can be throttled.',
                'Assuming actions in the same stage always run sequentially — same runOrder means they run in parallel.',
                'Forgetting that the artifact bucket needs encryption and cross-account access configured for multi-account pipelines.',
              ],
              code: {
                language: 'yaml',
                lines: [
                  'Resources:',
                  '  Pipeline:',
                  '    Type: AWS::CodePipeline::Pipeline',
                  '    Properties:',
                  '      RoleArn: !GetAtt PipelineRole.Arn',
                  '      ArtifactStore:',
                  '        Type: S3',
                  '        Location: !Ref ArtifactBucket',
                  '      Stages:',
                  '        - Name: Source',
                  '          Actions:',
                  '            - Name: Source',
                  '              ActionTypeId:',
                  '                Category: Source',
                  '                Owner: AWS',
                  '                Provider: CodeStarSourceConnection',
                  '                Version: \'1\'',
                  '              OutputArtifacts: [ { Name: SourceOut } ]',
                  '        - Name: Build',
                  '          Actions:',
                  '            - Name: Build',
                  '              RunOrder: 1',
                  '              ActionTypeId:',
                  '                Category: Build',
                  '                Owner: AWS',
                  '                Provider: CodeBuild',
                  '                Version: \'1\'',
                  '              InputArtifacts: [ { Name: SourceOut } ]',
                  '              OutputArtifacts: [ { Name: BuildOut } ]',
                ],
                explanation:
                  'A minimal CloudFormation pipeline: a Source stage pulls from a Git connection and emits SourceOut, which the Build stage consumes via CodeBuild and emits BuildOut for later stages.',
              },
              diagram: {
                type: 'mermaid',
                lines: [
                  'flowchart LR',
                  '  S[Source<br/>CodeCommit / GitHub] --> B[Build<br/>CodeBuild]',
                  '  B --> T[Test<br/>CodeBuild / 3rd party]',
                  '  T --> A[Manual approval]',
                  '  A --> D[Deploy<br/>CodeDeploy / CFN]',
                ],
                caption: 'A typical CodePipeline flow: a source change drives build, test, an approval gate, then deployment.',
              },
              exercises: [
                {
                  type: 'quiz',
                  prompt:
                    'A pipeline must run unit tests and a security scan at the same time before deploying. How do you configure the test actions so they execute concurrently?',
                  hint: 'Think about runOrder values.',
                  solution: {
                    explanation:
                      'Place both actions in the same stage with the same runOrder value. Actions sharing a runOrder run in parallel; the stage only proceeds once both succeed.',
                  },
                },
                {
                  type: 'quiz',
                  prompt:
                    'Releases are taking minutes to start after a commit lands in CodeCommit. The pipeline uses default settings. What change reduces this delay?',
                  solution: {
                    explanation:
                      'Use EventBridge-based change detection (an EventBridge rule on the CodeCommit repository) instead of periodic polling. Event-driven triggering starts the pipeline almost immediately.',
                  },
                },
                {
                  type: 'task',
                  prompt:
                    'You must temporarily prevent any deployment to production while keeping the pipeline intact and continuing to build/test commits. What do you change?',
                  solution: {
                    explanation:
                      'Disable the transition into the production deploy stage. Builds and tests still run; runs queue at the disabled transition until you re-enable it.',
                  },
                },
              ],
              docs: 'https://docs.aws.amazon.com/codepipeline/latest/userguide/welcome.html',
            },
            {
              id: 'dop1-t0-c1',
              services: [
                { icon: 'management', label: 'AWS CodePipeline' },
                { icon: 'sns', label: 'Amazon SNS' },
                { icon: 'lambda', label: 'AWS Lambda' },
              ],
              title: 'Approvals, gates, and cross-account pipelines',
              summary:
                'Professional pipelines add manual approval gates, automated quality gates via Lambda invoke actions, and span multiple accounts using cross-account roles and a shared, KMS-encrypted artifact store.',
              explanation:
                "Manual approval actions pause a pipeline until an authorised principal approves or rejects, optionally notifying an SNS topic and capturing a review URL and comments. For automated gates, a Lambda invoke action can call out to run a synthetic check, query a metric, or verify an external system, then report success or failure back to the pipeline using PutJobSuccessResult or PutJobFailureResult. A common professional pattern is the multi-account pipeline: a central tooling account hosts the pipeline, while deploy actions assume roles in separate dev, staging and production accounts. This requires three things working together — a cross-account IAM role in each target account that the pipeline role can assume, a customer-managed KMS key on the artifact bucket whose key policy grants the target accounts decrypt rights, and an S3 bucket policy allowing the target accounts to read artifacts. The CodePipeline service role must be allowed to assume the target roles. This isolates blast radius and enforces least privilege per environment.",
              keyPoints: [
                'Manual approval actions gate a pipeline and can notify via SNS, with approve/reject and comments.',
                'Lambda invoke actions implement automated gates; report back with PutJobSuccessResult / PutJobFailureResult.',
                'Cross-account deploys need: a role to assume in each target account, a customer-managed KMS key with a cross-account key policy, and an S3 bucket policy granting access.',
                'Use a separate account per environment to limit blast radius and enforce least-privilege.',
                'The pipeline service role must have sts:AssumeRole on the target-account deploy roles.',
              ],
              commonMistakes: [
                'Using the default (AWS-managed) artifact key in a cross-account pipeline — you must use a customer-managed KMS key so other accounts can be granted decrypt.',
                'Granting the approval to a broad group instead of using IAM permissions on the codepipeline:PutApprovalResult action.',
                'Forgetting that a Lambda gate that never calls Put*Result leaves the action running until it times out.',
              ],
              diagram: {
                type: 'mermaid',
                lines: [
                  'flowchart LR',
                  '  subgraph Tooling[Tooling account]',
                  '    P[CodePipeline] --> K[(KMS key)]',
                  '    P --> Bkt[(Artifact bucket)]',
                  '  end',
                  '  P -->|assume role| Dev[Dev account deploy]',
                  '  P -->|assume role| Prod[Prod account deploy]',
                ],
                caption: 'A central tooling account drives deployments into isolated environment accounts via assumed roles and a shared KMS-encrypted artifact bucket.',
              },
              exercises: [
                {
                  type: 'quiz',
                  prompt:
                    'A cross-account pipeline in the tooling account fails when the production account tries to read the build artifact, with an access-denied/KMS error. What two configuration items are most likely missing?',
                  solution: {
                    explanation:
                      'A customer-managed KMS key whose key policy grants the production account kms:Decrypt, and an S3 artifact-bucket policy allowing the production account to read objects. The AWS-managed default key cannot be shared cross-account.',
                  },
                },
                {
                  type: 'predict',
                  prompt:
                    'A Lambda invoke action runs a smoke test but the function returns normally without calling PutJobSuccessResult. What happens to the pipeline action?',
                  solution: {
                    explanation:
                      'The action stays In Progress until the configured timeout, then fails. CodePipeline relies on the explicit PutJobSuccessResult/PutJobFailureResult callback, not the function return value.',
                  },
                },
                {
                  type: 'quiz',
                  prompt:
                    'How can you restrict which engineers are allowed to approve the production manual-approval action?',
                  solution: {
                    explanation:
                      'Grant codepipeline:PutApprovalResult on that specific pipeline/stage/action only to the approved IAM principals; everyone else is implicitly denied.',
                  },
                },
              ],
              docs: 'https://docs.aws.amazon.com/codepipeline/latest/userguide/approvals.html',
            },
          ],
        },
        {
          id: 'dop1-t1',
          name: 'Build & test automation',
          concepts: [
            {
              id: 'dop1-t1-c0',
              services: [
                { icon: 'management', label: 'AWS CodeBuild' },
                { icon: 's3', label: 'Amazon S3' },
              ],
              title: 'CodeBuild: buildspec, caching, and reports',
              summary:
                'AWS CodeBuild compiles source, runs tests and produces artifacts in ephemeral, fully managed containers driven by a buildspec.yml. Professional topics include caching, batch builds, test/coverage reports and build environments.',
              explanation:
                "AWS CodeBuild is a fully managed build service: it spins up a fresh container per build, runs the phases you define, then tears the container down — so you pay per build minute with no servers to manage. The build is driven by a buildspec.yml (in the source root, or inline) with phases install, pre_build, build and post_build, plus artifacts, cache, env and reports sections. Caching speeds repeat builds: local caching (source, Docker layer, custom paths) lives on the build host between builds on the same fleet, while S3 caching persists across hosts. For test automation, CodeBuild can ingest JUnit/Cucumber-style test reports and code-coverage reports through the reports section and surface pass/fail trends. Build environments offer Amazon Linux/Ubuntu images at various compute sizes (and ARM, GPU, and Lambda-backed compute for very fast small builds), and privileged mode is required to build Docker images. Environment variables can come from plaintext, SSM Parameter Store, or Secrets Manager. Batch builds run multiple build configurations (e.g. across runtimes) in one action.",
              keyPoints: [
                'CodeBuild builds run in ephemeral containers; you pay per build-minute, no servers to manage.',
                'buildspec.yml phases: install, pre_build, build, post_build, plus artifacts, cache, env, reports.',
                'Caching: local cache (same host, fast) and S3 cache (cross-host, persistent) cut dependency download time.',
                'Reports section ingests test results (JUnit, etc.) and code-coverage for trend visibility.',
                'Privileged mode is required to build/push Docker images; use ECR for image pulls.',
                'Pull secrets from Secrets Manager / SSM Parameter Store rather than hard-coding them.',
              ],
              commonMistakes: [
                'Building Docker images without enabling privileged mode in the build environment.',
                'Expecting CodeBuild state to persist between builds — each build is a clean container; use caching/artifacts.',
                'Putting secrets as plaintext env vars instead of referencing Secrets Manager or Parameter Store.',
              ],
              code: {
                language: 'yaml',
                lines: [
                  'version: 0.2',
                  'env:',
                  '  secrets-manager:',
                  '    DB_PASSWORD: prod/db:password',
                  'phases:',
                  '  install:',
                  '    runtime-versions:',
                  '      nodejs: 20',
                  '    commands:',
                  '      - npm ci',
                  '  build:',
                  '    commands:',
                  '      - npm run build',
                  '      - npm test -- --reporters=jest-junit',
                  'reports:',
                  '  unit-tests:',
                  '    files: [ \'junit.xml\' ]',
                  '    file-format: JUNITXML',
                  'cache:',
                  '  paths: [ \'node_modules/**/*\' ]',
                  'artifacts:',
                  '  files: [ \'**/*\' ]',
                  '  base-directory: dist',
                ],
                explanation:
                  'A buildspec that pulls a secret from Secrets Manager, installs deps, builds, runs tests with a JUnit reporter ingested as a CodeBuild report, caches node_modules, and outputs the dist directory as the artifact.',
              },
              exercises: [
                {
                  type: 'quiz',
                  prompt:
                    'A CodeBuild project re-downloads the entire dependency tree on every build, making builds slow. What is the simplest fix without changing the build host fleet behaviour?',
                  solution: {
                    explanation:
                      'Configure caching for the dependency directory (e.g. S3 cache of node_modules / local cache). The cache section in buildspec plus a cache config persists dependencies between builds.',
                  },
                },
                {
                  type: 'quiz',
                  prompt:
                    'CodeBuild fails with a "Cannot connect to the Docker daemon" error while building a container image. What setting is missing?',
                  solution: {
                    explanation:
                      'Privileged mode must be enabled in the build environment so the build can run the Docker daemon to build/push images.',
                  },
                },
                {
                  type: 'task',
                  prompt:
                    'You want unit-test pass/fail trends visible in the CodeBuild console over time. What do you add to the build?',
                  solution: {
                    explanation:
                      'Emit results in a supported format (e.g. JUnit XML) and declare a reports group in buildspec pointing at the result files. CodeBuild then tracks test reports and coverage trends.',
                  },
                },
              ],
              docs: 'https://docs.aws.amazon.com/codebuild/latest/userguide/welcome.html',
            },
            {
              id: 'dop1-t1-c1',
              services: [
                { icon: 'management', label: 'AWS CodeArtifact' },
                { icon: 'management', label: 'AWS CodeCommit' },
              ],
              title: 'Source and artifacts: CodeCommit and CodeArtifact',
              summary:
                'CodeCommit is managed private Git; CodeArtifact is a managed package repository for npm, pip, Maven, NuGet and more, with upstream proxying to public registries.',
              explanation:
                "AWS CodeCommit hosts private Git repositories with IAM-based access control, encryption at rest with KMS, and EventBridge/CloudWatch Events integration to trigger pipelines on push. Access uses IAM credentials (HTTPS Git credentials, SSH keys, or the credential helper) rather than separate accounts. AWS CodeArtifact is a managed artifact (package) repository supporting common package managers — npm, PyPI/pip, Maven/Gradle, NuGet, Swift, Ruby, and generic packages. It is organised into domains (which dedupe storage and centralise the KMS encryption key across repositories) containing repositories. An upstream repository or external connection lets CodeArtifact proxy and cache packages from public registries (npmjs, PyPI, Maven Central), so builds get reproducible, cached, and policy-controlled dependencies; you can also publish your own internal packages. Authentication uses a short-lived token obtained via aws codeartifact get-authorization-token, and access is governed by IAM plus optional resource policies. This combination removes a major supply-chain risk: builds no longer depend directly on the public internet and you can scan and approve what enters your domain.",
              keyPoints: [
                'CodeCommit: managed private Git; access via IAM; triggers pipelines through EventBridge on push.',
                'CodeArtifact: managed package repo for npm, pip, Maven, NuGet, etc.',
                'CodeArtifact domains group repositories, dedupe storage, and centralise the KMS key; repositories hold packages.',
                'External connections / upstreams proxy and cache public registries for reproducible builds.',
                'Authenticate to CodeArtifact with a short-lived token (get-authorization-token); govern with IAM + resource policies.',
              ],
              commonMistakes: [
                'Pointing builds straight at public registries instead of through CodeArtifact, losing caching and supply-chain control.',
                'Treating a CodeArtifact repository as the unit of encryption — the KMS key is set at the domain level.',
                'Hard-coding a CodeArtifact auth token; it is short-lived and must be regenerated per build.',
              ],
              exercises: [
                {
                  type: 'quiz',
                  prompt:
                    'A team wants reproducible builds that do not break when a public npm package version disappears, plus the ability to scan/approve dependencies. Which service and feature?',
                  solution: {
                    explanation:
                      'AWS CodeArtifact with an external connection (upstream) to npmjs. It caches fetched packages in your repository, so builds keep working and you control what enters the domain.',
                  },
                },
                {
                  type: 'quiz',
                  prompt:
                    'How does an application in a pipeline authenticate to CodeArtifact to pull packages?',
                  solution: {
                    explanation:
                      'It obtains a short-lived authorization token via aws codeartifact get-authorization-token and configures the package manager to use it; access is governed by IAM permissions.',
                  },
                },
              ],
              docs: 'https://docs.aws.amazon.com/codeartifact/latest/ug/welcome.html',
            },
          ],
        },
        {
          id: 'dop1-t2',
          name: 'Deployment strategies',
          concepts: [
            {
              id: 'dop1-t2-c0',
              services: [
                { icon: 'management', label: 'AWS CodeDeploy' },
                { icon: 'ec2', label: 'Amazon EC2' },
                { icon: 'lambda', label: 'AWS Lambda' },
              ],
              title: 'CodeDeploy: in-place, blue/green, and deployment configs',
              summary:
                'AWS CodeDeploy automates deployments to EC2/on-prem, Lambda and ECS, controlled by an appspec file and a deployment configuration that defines how fast traffic shifts and when to halt.',
              explanation:
                "AWS CodeDeploy coordinates application deployments to three compute platforms: EC2/on-premises (using a host agent), AWS Lambda (alias traffic shifting), and Amazon ECS (task set traffic shifting). The appspec file (appspec.yml for EC2/ECS, appspec for Lambda) declares what to deploy and which lifecycle event hooks to run — for EC2 these include BeforeInstall, AfterInstall, ApplicationStart and ValidateService; for Lambda/ECS they include BeforeAllowTraffic and AfterAllowTraffic validation hooks (small Lambda functions). For EC2 there are two deployment types: in-place (the agent stops, updates and restarts the app on existing instances — cheaper but causes per-instance downtime) and blue/green (a fresh replacement fleet is provisioned, validated, then the load balancer shifts traffic and the old fleet is later terminated — zero-downtime, easy rollback). Deployment configurations set the pace: predefined ones like AllAtOnce, HalfAtATime, OneAtATime for EC2, and Canary (a percentage now, the rest after N minutes), Linear (equal increments every N minutes) and AllAtOnce for Lambda/ECS. Automatic rollback can trigger on a failed deployment or a CloudWatch alarm, reverting to the last known-good revision.",
              analogy:
                'Blue/green is like opening a brand-new identical restaurant next door, checking everything works, then redirecting all diners over and only later closing the old one — nobody eats during a kitchen rebuild.',
              keyPoints: [
                'Three platforms: EC2/on-prem (agent + lifecycle hooks), Lambda (alias shifting), ECS (task set shifting).',
                'In-place = update existing instances (downtime per instance); blue/green = new fleet + traffic shift (zero downtime, easy rollback).',
                'appspec defines files/permissions (EC2) and lifecycle hooks for validation scripts.',
                'Deployment configs: AllAtOnce / HalfAtATime / OneAtATime (EC2); Canary / Linear / AllAtOnce (Lambda & ECS).',
                'Automatic rollback on deployment failure or a tripped CloudWatch alarm reverts to last good revision.',
                'Lambda/ECS validation hooks (BeforeAllowTraffic, AfterAllowTraffic) gate the traffic shift.',
              ],
              commonMistakes: [
                'Choosing in-place when zero downtime is required — use blue/green.',
                'Expecting EC2 lifecycle hook names to apply to Lambda — Lambda/ECS use BeforeAllowTraffic/AfterAllowTraffic.',
                'Not wiring a CloudWatch alarm to the deployment group, so a bad release is not auto-rolled-back.',
              ],
              code: {
                language: 'yaml',
                lines: [
                  '# appspec.yml for an ECS blue/green deployment',
                  'version: 0.0',
                  'Resources:',
                  '  - TargetService:',
                  '      Type: AWS::ECS::Service',
                  '      Properties:',
                  '        TaskDefinition: <TASK_DEFINITION>',
                  '        LoadBalancerInfo:',
                  '          ContainerName: app',
                  '          ContainerPort: 8080',
                  'Hooks:',
                  '  - BeforeAllowTraffic: validateBeforeFn',
                  '  - AfterAllowTraffic: validateAfterFn',
                ],
                explanation:
                  'An ECS appspec for blue/green: CodeDeploy registers the new task definition behind the green target group, runs the BeforeAllowTraffic Lambda to validate, shifts traffic per the deployment config, then runs AfterAllowTraffic.',
              },
              diagram: {
                type: 'mermaid',
                lines: [
                  'flowchart LR',
                  '  ALB[Load balancer] --> Blue[Blue fleet<br/>current]',
                  '  ALB -.shift traffic.-> Green[Green fleet<br/>new]',
                  '  Green --> V{Validate +<br/>alarm OK?}',
                  '  V -->|yes| Done[Keep green<br/>terminate blue]',
                  '  V -->|no| RB[Rollback<br/>to blue]',
                ],
                caption: 'Blue/green: a new green fleet is validated, traffic shifts to it, and a failed validation or alarm rolls back to blue.',
              },
              exercises: [
                {
                  type: 'quiz',
                  prompt:
                    'A Lambda deployment must send 10% of traffic to the new version, watch a CloudWatch alarm for 5 minutes, then send the remaining 90%, rolling back automatically on alarm. Which deployment configuration?',
                  solution: {
                    explanation:
                      'A Canary configuration (e.g. Canary10Percent5Minutes) on the Lambda alias, with the deployment group wired to the CloudWatch alarm for automatic rollback.',
                  },
                },
                {
                  type: 'quiz',
                  prompt:
                    'Stakeholders require zero downtime and instant rollback for an EC2 web tier behind an ALB. Which CodeDeploy deployment type and why?',
                  solution: {
                    explanation:
                      'Blue/green. A new fleet is provisioned and validated before the ALB shifts traffic; rollback is just shifting traffic back to the still-running old fleet, so there is no downtime.',
                  },
                },
                {
                  type: 'predict',
                  prompt:
                    'During an ECS Linear deployment, the BeforeAllowTraffic hook function returns failure. What does CodeDeploy do?',
                  solution: {
                    explanation:
                      'The deployment fails before any traffic shifts and rolls back, because the validation lifecycle hook reported failure prior to traffic being allowed to the new task set.',
                  },
                },
              ],
              docs: 'https://docs.aws.amazon.com/codedeploy/latest/userguide/welcome.html',
            },
            {
              id: 'dop1-t2-c1',
              services: [
                { icon: 'ecs', label: 'Amazon ECS' },
                { icon: 'route53', label: 'Amazon Route 53' },
                { icon: 'elb', label: 'Elastic Load Balancing' },
              ],
              title: 'Choosing rolling, canary, blue/green and feature flags',
              summary:
                'Each deployment strategy trades speed, cost, blast radius and rollback. The professional exam expects you to match a strategy to constraints across EC2, ECS, EKS, Lambda and Beanstalk.',
              explanation:
                "Rolling deployments replace instances/tasks in batches — cheaper (no duplicate fleet) but a bad release affects a growing share of traffic and rollback means rolling forward again. Canary deployments expose a small percentage of users to the new version first, watch metrics, then ramp up — minimising blast radius and great for catching regressions early. Blue/green stands up a full parallel environment, validates it, then shifts all traffic — fastest, cleanest rollback, but doubles capacity briefly and costs more. The right choice depends on platform and constraints: ECS and Lambda support native canary/linear via CodeDeploy; Auto Scaling/EC2 can do rolling (via ASG instance refresh) or blue/green (via CodeDeploy or swapping ASGs behind an ALB). Elastic Beanstalk offers All-at-once, Rolling, Rolling with additional batch, and Immutable (a separate temporary ASG, like blue/green) plus URL-swap blue/green between environments. Route 53 weighted records can split traffic across whole stacks for a manual canary. Independently of deployment mechanics, feature flags (e.g. via AWS AppConfig) let you ship code dark and turn features on/off without redeploying — decoupling release from deploy and enabling instant kill-switches.",
              keyPoints: [
                'Rolling: batch replacement, no extra fleet, cheaper, but growing blast radius and slower rollback.',
                'Canary: tiny first slice + metric watch then ramp — smallest blast radius, best early regression detection.',
                'Blue/green: full parallel env, instant cutover and rollback, but doubles capacity briefly.',
                'Beanstalk modes: All-at-once, Rolling, Rolling+additional batch, Immutable; plus URL-swap blue/green.',
                'Route 53 weighted records can canary whole stacks; ASG instance refresh does rolling EC2 replacement.',
                'Feature flags (AppConfig) separate release from deploy and provide instant kill-switches without redeploying.',
              ],
              commonMistakes: [
                'Calling Beanstalk Immutable a "rolling" strategy — it provisions a separate temporary ASG, behaving like blue/green.',
                'Assuming rolling gives instant rollback — you must redeploy the previous version across batches.',
                'Conflating feature flags with deployment strategy — flags toggle behaviour at runtime regardless of how code shipped.',
              ],
              diagram: {
                type: 'mermaid',
                lines: [
                  'flowchart TB',
                  '  Q{Constraint?} --> Z[Zero downtime + instant rollback] --> BG[Blue/green]',
                  '  Q --> R[Lowest blast radius first] --> C[Canary]',
                  '  Q --> Cost[Lowest cost, tolerate slow rollback] --> Roll[Rolling]',
                  '  Q --> Toggle[Decouple release from deploy] --> FF[Feature flags / AppConfig]',
                ],
                caption: 'Map the dominant constraint to a deployment strategy; feature flags complement any of them.',
              },
              exercises: [
                {
                  type: 'quiz',
                  prompt:
                    'A Beanstalk environment must update with zero capacity reduction and the ability to discard the new version cleanly if it is bad, without affecting the running instances. Which deployment policy?',
                  solution: {
                    explanation:
                      'Immutable. It launches a fresh temporary Auto Scaling group with the new version, validates it, then moves those instances into the main group; if it fails, the temporary group is simply terminated.',
                  },
                },
                {
                  type: 'quiz',
                  prompt:
                    'The business wants to ship a risky feature to production now but enable it for only internal users, then everyone, with an instant off-switch and no redeploys. What do you use?',
                  solution: {
                    explanation:
                      'Feature flags via AWS AppConfig. The code deploys with the feature behind a flag; you toggle and target it at runtime and can disable it instantly without a new deployment.',
                  },
                },
                {
                  type: 'task',
                  prompt:
                    'You must canary an entire new stack (new ALB + ASG) for 5% of users before promoting. The app is not on ECS/Lambda. Suggest a mechanism.',
                  solution: {
                    explanation:
                      'Use Route 53 weighted routing records: 95% weight to the current stack endpoint and 5% to the new stack, then gradually shift weights as metrics stay healthy.',
                  },
                },
              ],
              docs: 'https://docs.aws.amazon.com/elasticbeanstalk/latest/dg/using-features.deploy-existing-version.html',
            },
          ],
        },
      ],
    },

    /* ─────── DOMAIN 2 — CONFIGURATION MANAGEMENT & INFRASTRUCTURE AS CODE (17%) ─────── */
    {
      level: 2,
      name: 'IaC & Config Management',
      focus: 'Defining infrastructure as code and managing configuration with CloudFormation, CDK, SAM, Systems Manager and AppConfig (Domain 2 · 17%)',
      accent: '#7c4ddb',
      soft: '#f1ebfd',
      topics: [
        {
          id: 'dop2-t0',
          name: 'CloudFormation in depth',
          concepts: [
            {
              id: 'dop2-t0-c0',
              services: [
                { icon: 'cloudformation', label: 'AWS CloudFormation' },
              ],
              title: 'Templates, change sets, and drift detection',
              summary:
                'CloudFormation provisions infrastructure from declarative templates. Change sets preview modifications safely, and drift detection finds resources that were altered outside the stack.',
              explanation:
                "AWS CloudFormation creates and manages a stack of resources from a JSON/YAML template. A template has sections including Parameters (inputs), Mappings (lookup tables), Conditions (boolean logic to include resources), Resources (the only required section), Outputs (exported values), and intrinsic functions like Ref, Fn::GetAtt, Fn::Sub, Fn::ImportValue and Fn::If. When updating a stack you should create a change set first — it computes and lists exactly which resources will be added, modified or deleted, and crucially whether a modification causes a Replacement (a new physical resource and possible data loss). Update behaviour per property is one of: no interruption, some interruption (e.g. a brief reboot), or replacement. DeletionPolicy and UpdateReplacePolicy (Retain / Snapshot / Delete) protect data on stateful resources during deletes/replacements. Drift detection compares the actual configuration of live resources against the template's expected state and flags drifted resources and properties — essential for catching out-of-band manual changes. Stack policies can block updates to specific protected resources, and termination protection prevents accidental stack deletion.",
              keyPoints: [
                'Template sections: Parameters, Mappings, Conditions, Resources (required), Outputs; functions like Ref, GetAtt, Sub, ImportValue.',
                'Change sets preview adds/modifies/deletes and flag Replacement (possible data loss) before you execute.',
                'Update behaviour: no interruption, some interruption, or replacement — know which properties force replacement.',
                'DeletionPolicy / UpdateReplacePolicy (Retain | Snapshot | Delete) protect stateful data on delete/replace.',
                'Drift detection finds resources changed outside CloudFormation; reconcile by updating the template.',
                'Stack policies protect resources from updates; termination protection blocks accidental deletes.',
              ],
              commonMistakes: [
                'Updating a stack directly without a change set and accidentally replacing (and wiping) a database.',
                'Omitting DeletionPolicy: Retain/Snapshot on stateful resources, so stack deletion destroys data.',
                'Assuming drift is auto-corrected — drift detection only reports; you must reconcile.',
              ],
              code: {
                language: 'yaml',
                lines: [
                  'Parameters:',
                  '  Env:',
                  '    Type: String',
                  '    AllowedValues: [ dev, prod ]',
                  'Conditions:',
                  '  IsProd: !Equals [ !Ref Env, prod ]',
                  'Resources:',
                  '  Data:',
                  '    Type: AWS::RDS::DBInstance',
                  '    DeletionPolicy: Snapshot',
                  '    UpdateReplacePolicy: Snapshot',
                  '    Properties:',
                  '      Engine: postgres',
                  '      MultiAZ: !If [ IsProd, true, false ]',
                  '      DBInstanceClass: !If [ IsProd, db.r6g.large, db.t3.micro ]',
                  'Outputs:',
                  '  Endpoint:',
                  '    Value: !GetAtt Data.Endpoint.Address',
                  '    Export:',
                  '      Name: !Sub \'${Env}-db-endpoint\'',
                ],
                explanation:
                  'A parameterised template: a Condition toggles Multi-AZ and instance size by environment, Snapshot policies protect the database on delete/replace, and the endpoint is exported for cross-stack import.',
              },
              exercises: [
                {
                  type: 'quiz',
                  prompt:
                    'Before applying a stack update that changes an RDS property, how do you confirm the change will not replace (and destroy) the database?',
                  solution: {
                    explanation:
                      'Create a change set and inspect it. It shows each resource action and whether the change requires Replacement. If RDS shows Replacement, adjust the change or ensure a Snapshot policy protects the data.',
                  },
                },
                {
                  type: 'quiz',
                  prompt:
                    'An engineer changed a security group rule directly in the console on a CloudFormation-managed resource. How do you detect this discrepancy across the stack?',
                  solution: {
                    explanation:
                      'Run drift detection on the stack. It compares live resource configuration to the template and reports the security group as drifted with the modified property.',
                  },
                },
                {
                  type: 'task',
                  prompt:
                    'You must guarantee that deleting a stack never deletes its S3 data bucket. What do you set on the bucket resource?',
                  solution: {
                    explanation:
                      'Set DeletionPolicy: Retain on the S3 bucket resource so CloudFormation leaves it in place when the stack is deleted.',
                  },
                },
              ],
              docs: 'https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/Welcome.html',
            },
            {
              id: 'dop2-t0-c1',
              services: [
                { icon: 'cloudformation', label: 'AWS CloudFormation' },
                { icon: 'organizations', label: 'AWS Organizations' },
              ],
              title: 'Nested stacks, cross-stack refs, and StackSets',
              summary:
                'Large estates compose templates: nested stacks for reuse, exports/imports for cross-stack references, and StackSets to deploy the same template across many accounts and Regions.',
              explanation:
                "As infrastructure grows, monolithic templates become unmanageable. Nested stacks let a parent template reference child stacks (AWS::CloudFormation::Stack resources pointing at template URLs), so you build reusable components (a VPC module, a logging module) and compose them — updates to the parent cascade to children. Cross-stack references instead link independent stacks: one stack declares an Output with Export, another consumes it with Fn::ImportValue. An exported value cannot be changed or deleted while another stack imports it — this protects shared dependencies but can make refactoring awkward, so prefer nested stacks for tightly coupled lifecycles and exports for loosely coupled, separately deployed stacks. StackSets extend CloudFormation across accounts and Regions: from an administrator account (or via Organizations service-managed permissions with automatic deployment to new accounts in target OUs), one operation deploys, updates or deletes stack instances everywhere at once, with controls for max concurrent accounts and failure tolerance. StackSets are the standard way to roll out baseline guardrails, IAM roles, Config rules and security tooling org-wide.",
              keyPoints: [
                'Nested stacks: parent references child templates as AWS::CloudFormation::Stack — reusable, lifecycle-coupled modules.',
                'Cross-stack: Output + Export in one stack, Fn::ImportValue in another — for independently deployed stacks.',
                'An exported value cannot be modified/deleted while another stack imports it.',
                'StackSets deploy one template across many accounts and Regions in a single operation.',
                'Service-managed StackSets (via Organizations) auto-deploy to new accounts added to target OUs.',
                'StackSets controls: max concurrent accounts, failure tolerance, and Region order for safe rollouts.',
              ],
              commonMistakes: [
                'Using cross-stack exports for tightly coupled resources, then being unable to update the export because of the import lock.',
                'Forgetting StackSet trust roles/permissions (self-managed admin/execution roles vs service-managed).',
                'Deploying org-wide changes without setting failure tolerance, so one bad account aborts everything.',
              ],
              diagram: {
                type: 'mermaid',
                lines: [
                  'flowchart TB',
                  '  Admin[StackSet admin] --> A1[Account A<br/>us-east-1]',
                  '  Admin --> A2[Account A<br/>eu-west-1]',
                  '  Admin --> B1[Account B<br/>us-east-1]',
                  '  Admin --> B2[Account B<br/>eu-west-1]',
                ],
                caption: 'A single StackSet operation fans the same template out to multiple accounts and Regions as stack instances.',
              },
              exercises: [
                {
                  type: 'quiz',
                  prompt:
                    'A security team must ensure a baseline IAM role and a set of Config rules exist in every account in the organisation, including accounts created in the future. What do you use?',
                  solution: {
                    explanation:
                      'A service-managed CloudFormation StackSet targeting the organisation/OUs with automatic deployment enabled, so new accounts in the target OUs automatically receive the baseline stack.',
                  },
                },
                {
                  type: 'predict',
                  prompt:
                    'Stack A exports a VPC ID that Stack B imports. You try to update Stack A to remove or rename that export. What happens?',
                  solution: {
                    explanation:
                      'The update fails. CloudFormation will not let you modify or delete an exported value while another stack imports it; you must first remove the import in Stack B.',
                  },
                },
                {
                  type: 'quiz',
                  prompt:
                    'You want a reusable VPC component whose updates cascade automatically when the parent application stack updates. Nested stack or cross-stack export?',
                  solution: {
                    explanation:
                      'Nested stack — the VPC is a child of the parent template, so it shares the lifecycle and updates cascade. Exports are better for independently deployed, loosely coupled stacks.',
                  },
                },
              ],
              docs: 'https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/what-is-cfnstacksets.html',
            },
          ],
        },
        {
          id: 'dop2-t1',
          name: 'Higher-level IaC: CDK & SAM',
          concepts: [
            {
              id: 'dop2-t1-c0',
              services: [
                { icon: 'cloudformation', label: 'AWS CDK' },
                { icon: 'lambda', label: 'AWS SAM' },
              ],
              title: 'CDK and SAM: programmatic and serverless IaC',
              summary:
                'The CDK lets you define infrastructure in a general-purpose language that synthesises to CloudFormation; SAM is a CloudFormation extension that simplifies serverless apps and provides local testing.',
              explanation:
                "The AWS Cloud Development Kit (CDK) lets you define infrastructure in TypeScript, Python, Java, Go or C#. You compose constructs (L1 = raw CloudFormation resources, L2 = sensible-default wrappers, L3 = patterns combining several resources), then cdk synth produces a CloudFormation template and cdk deploy provisions it — so under the hood it is still CloudFormation stacks, changesets and drift apply. The CDK shines for loops, conditionals, reusable libraries and unit-testable infrastructure. The AWS Serverless Application Model (SAM) is a transform/macro on top of CloudFormation: a template with Transform: AWS::Serverless-2016-10-31 unlocks shorthand resource types like AWS::Serverless::Function, ::Api, ::StateMachine and ::SimpleTable that expand into full CloudFormation. SAM CLI adds local development: sam build, sam local invoke / start-api (run functions in a Docker container locally), sam deploy (guided, builds a CloudFormation change set), and built-in support for gradual Lambda deployments via CodeDeploy (AutoPublishAlias + DeploymentPreference: Canary/Linear). Both tools ultimately rely on CloudFormation, so everything you know about change sets, rollback and stack policies still applies.",
              keyPoints: [
                'CDK: define infra in code (TS/Python/Java/Go/C#); cdk synth → CloudFormation, cdk deploy → stack.',
                'CDK construct levels: L1 (raw CFN), L2 (defaults), L3 (patterns).',
                'SAM: a CloudFormation transform adding Serverless::Function/Api/StateMachine/SimpleTable shorthand.',
                'SAM CLI: sam build, sam local invoke/start-api for local testing, sam deploy for change-set deploys.',
                'SAM DeploymentPreference (Canary/Linear) wires gradual Lambda deploys via CodeDeploy automatically.',
                'Both compile to CloudFormation — change sets, rollback, drift and stack policies all still apply.',
              ],
              commonMistakes: [
                'Thinking CDK/SAM bypass CloudFormation — they synthesise to it, with the same constraints.',
                'Forgetting AutoPublishAlias on a SAM function, so DeploymentPreference canary shifting cannot work.',
                'Editing the synthesised template by hand instead of changing the CDK/SAM source.',
              ],
              code: {
                language: 'yaml',
                lines: [
                  'Transform: AWS::Serverless-2016-10-31',
                  'Resources:',
                  '  Api:',
                  '    Type: AWS::Serverless::Function',
                  '    Properties:',
                  '      Handler: app.handler',
                  '      Runtime: python3.12',
                  '      AutoPublishAlias: live',
                  '      DeploymentPreference:',
                  '        Type: Canary10Percent5Minutes',
                  '        Alarms: [ !Ref ErrorAlarm ]',
                  '      Events:',
                  '        Http:',
                  '          Type: Api',
                  '          Properties: { Path: /, Method: get }',
                ],
                explanation:
                  'A SAM function with an API event; AutoPublishAlias plus a Canary DeploymentPreference makes CodeDeploy shift traffic gradually and roll back if the ErrorAlarm fires.',
              },
              exercises: [
                {
                  type: 'quiz',
                  prompt:
                    'A team prefers writing infrastructure with loops and shared libraries in TypeScript but the org standard is CloudFormation governance (change sets, drift). What tool fits?',
                  solution: {
                    explanation:
                      'The AWS CDK. It is authored in TypeScript yet synthesises to CloudFormation, so it deploys as standard stacks with full change-set and drift support.',
                  },
                },
                {
                  type: 'quiz',
                  prompt:
                    'You want to run and debug a Lambda function locally before deploying, using the same template. Which tool and command?',
                  solution: {
                    explanation:
                      'AWS SAM with the SAM CLI: sam local invoke (or sam local start-api) runs the function in a local Docker container against the same SAM template.',
                  },
                },
                {
                  type: 'task',
                  prompt:
                    'Explain how a SAM template achieves a canary Lambda deployment with automatic rollback in two lines of configuration.',
                  solution: {
                    explanation:
                      'Set AutoPublishAlias (to publish versions and point an alias at them) and a DeploymentPreference with Type: CanaryXPercentYMinutes plus an Alarms list. SAM provisions CodeDeploy to shift alias traffic gradually and roll back if an alarm fires.',
                  },
                },
              ],
              docs: 'https://docs.aws.amazon.com/cdk/v2/guide/home.html',
            },
          ],
        },
        {
          id: 'dop2-t2',
          name: 'Configuration & fleet management',
          concepts: [
            {
              id: 'dop2-t2-c0',
              services: [
                { icon: 'systemsmanager', label: 'AWS Systems Manager' },
              ],
              title: 'Systems Manager: State Manager, Patch Manager, Parameter Store',
              summary:
                'AWS Systems Manager operates and configures fleets at scale: enforcing desired state, patching, running commands, secure sessions, and storing configuration/secrets.',
              explanation:
                "AWS Systems Manager (SSM) is the operations hub for managed nodes (EC2, on-prem, edge) that run the SSM Agent and have an instance profile/role granting SSM access. Key capabilities for the exam: Documents (SSM documents define commands and automations in JSON/YAML). Run Command executes a document across selected nodes (by tags or resource groups) for ad-hoc operations like installing software. State Manager continuously enforces a desired configuration on a schedule (e.g. ensure the agent is running, apply a baseline) — drift on the host, not the stack. Patch Manager defines patch baselines and patch groups and applies OS patches on a maintenance window, with compliance reporting. Session Manager provides secure, auditable shell access with no open SSH ports, no bastion and no keys — sessions are logged to S3/CloudWatch. Parameter Store holds hierarchical configuration and secrets (Standard or Advanced tiers, optional KMS-encrypted SecureString) and integrates everywhere. Inventory collects software/config metadata; Maintenance Windows schedule disruptive tasks; Compliance aggregates patch/association status. Together these let you manage configuration as code and keep fleets in a known, compliant state.",
              keyPoints: [
                'Managed nodes need the SSM Agent plus an instance role granting SSM permissions.',
                'Run Command: ad-hoc execution of an SSM document across tagged nodes.',
                'State Manager: continuously enforce desired host configuration on a schedule (fixes host-level drift).',
                'Patch Manager: patch baselines + patch groups + maintenance windows, with compliance reporting.',
                'Session Manager: keyless, portless, audited shell access — no SSH/bastion needed.',
                'Parameter Store: hierarchical config & secrets (SecureString via KMS); Standard vs Advanced tiers.',
              ],
              commonMistakes: [
                'Opening SSH/bastion access when Session Manager would give auditable, keyless access with no inbound ports.',
                'Confusing State Manager (host configuration drift) with CloudFormation drift (stack resource drift).',
                'Using Parameter Store for high-rotation secrets that really need Secrets Manager rotation.',
              ],
              diagram: {
                type: 'mermaid',
                lines: [
                  'flowchart LR',
                  '  SSM[Systems Manager] --> RC[Run Command<br/>ad-hoc]',
                  '  SSM --> SM[State Manager<br/>enforce desired state]',
                  '  SSM --> PM[Patch Manager<br/>baselines + windows]',
                  '  SSM --> Sess[Session Manager<br/>keyless shell]',
                  '  SSM --> PS[Parameter Store<br/>config + secrets]',
                ],
                caption: 'Systems Manager unifies ad-hoc commands, desired-state enforcement, patching, secure access and configuration storage.',
              },
              exercises: [
                {
                  type: 'quiz',
                  prompt:
                    'Auditors require shell access to production EC2 with full session logging and no inbound SSH ports or bastion hosts. Which capability?',
                  solution: {
                    explanation:
                      'Systems Manager Session Manager. It provides keyless, portless shell access over the SSM channel with session logs to S3/CloudWatch and IAM-based authorisation.',
                  },
                },
                {
                  type: 'quiz',
                  prompt:
                    'You must guarantee the monitoring agent is always installed and running on every instance, automatically reapplying if someone removes it. Which feature?',
                  solution: {
                    explanation:
                      'State Manager. It associates an SSM document with the fleet and continuously enforces that desired state on a schedule, remediating drift.',
                  },
                },
                {
                  type: 'task',
                  prompt:
                    'Describe how to patch a fleet on a Sunday 02:00 maintenance window with compliance reporting.',
                  solution: {
                    explanation:
                      'Define a Patch Manager patch baseline, assign instances to a patch group via tags, create a Maintenance Window scheduled for Sunday 02:00 that runs the patch task, and review Patch Compliance afterwards.',
                  },
                },
              ],
              docs: 'https://docs.aws.amazon.com/systems-manager/latest/userguide/what-is-systems-manager.html',
            },
            {
              id: 'dop2-t2-c1',
              services: [
                { icon: 'systemsmanager', label: 'AWS AppConfig' },
                { icon: 'beanstalk', label: 'AWS Elastic Beanstalk' },
              ],
              title: 'AppConfig, OpsWorks and Elastic Beanstalk',
              summary:
                'AppConfig safely rolls out dynamic configuration and feature flags with validation and automatic rollback; Beanstalk and OpsWorks are higher-level application/configuration platforms.',
              explanation:
                "AWS AppConfig (part of Systems Manager) manages dynamic application configuration and feature flags separately from code. You define an application, environments and configuration profiles, then deploy configuration with a deployment strategy (bake time, growth rate) and validators (a JSON Schema or a Lambda) that block bad config; a CloudWatch alarm monitor triggers automatic rollback during the bake period. This lets you change behaviour or flip feature flags in production without redeploying code, and roll back instantly if errors spike. AWS Elastic Beanstalk is a PaaS that deploys and scales web apps from your code, managing the EC2/ASG/ELB/CloudWatch underneath; its configuration is defined via .ebextensions and environment options, and it offers the deployment policies covered earlier (rolling, immutable, blue/green via URL swap). AWS OpsWorks is a configuration-management service using Chef/Puppet (OpsWorks for Chef Automate, Puppet Enterprise, and Stacks) for teams standardised on those tools; note that OpsWorks is being deprecated, so new designs generally prefer Systems Manager, CloudFormation/CDK and AppConfig. The exam expects you to pick the lightest-weight managed option that meets the requirement.",
              keyPoints: [
                'AppConfig: deploy dynamic config and feature flags with validators and bake-time automatic rollback on a CloudWatch alarm.',
                'AppConfig separates configuration changes from code deployments — flip behaviour without redeploying.',
                'Elastic Beanstalk: PaaS for web apps; configure via .ebextensions; supports rolling/immutable/blue-green.',
                'OpsWorks: managed Chef/Puppet config management (being deprecated; prefer SSM/CDK/AppConfig for new work).',
                'AppConfig validators can be a JSON Schema or a Lambda that rejects invalid configuration before rollout.',
              ],
              commonMistakes: [
                'Redeploying application code just to change a config value or toggle a feature — use AppConfig.',
                'Choosing OpsWorks for greenfield work given its deprecation; prefer Systems Manager + IaC.',
                'Skipping AppConfig validators, allowing malformed configuration to reach production.',
              ],
              exercises: [
                {
                  type: 'quiz',
                  prompt:
                    'Operators must change a rate-limit threshold in production frequently, with validation and automatic rollback if error rates rise, and without deploying new code. Which service?',
                  solution: {
                    explanation:
                      'AWS AppConfig. It deploys the configuration with a strategy and bake time, runs validators on it, and rolls back automatically if a monitored CloudWatch alarm fires — no code deploy required.',
                  },
                },
                {
                  type: 'quiz',
                  prompt:
                    'A small team wants to deploy a web app and have AWS manage the load balancer, Auto Scaling and capacity from their source bundle, with minimal config. Which service?',
                  solution: {
                    explanation:
                      'AWS Elastic Beanstalk — a PaaS that provisions and manages the underlying EC2/ASG/ELB and scaling from the uploaded application.',
                  },
                },
              ],
              docs: 'https://docs.aws.amazon.com/appconfig/latest/userguide/what-is-appconfig.html',
            },
          ],
        },
      ],
    },

    /* ─────────────────── DOMAIN 3 — RESILIENT CLOUD SOLUTIONS (15%) ─────────────────── */
    {
      level: 3,
      name: 'Resilient Cloud Solutions',
      focus: 'Designing highly available, fault-tolerant, self-healing and disaster-recoverable architectures across AZs and Regions (Domain 3 · 15%)',
      accent: '#e8862a',
      soft: '#fff1e2',
      topics: [
        {
          id: 'dop3-t0',
          name: 'High availability & scaling',
          concepts: [
            {
              id: 'dop3-t0-c0',
              services: [
                { icon: 'autoscaling', label: 'EC2 Auto Scaling' },
                { icon: 'elb', label: 'Elastic Load Balancing' },
              ],
              title: 'Multi-AZ, Auto Scaling and self-healing',
              summary:
                'High availability comes from spreading capacity across AZs behind a load balancer and letting Auto Scaling replace failed instances and adjust to demand automatically.',
              explanation:
                "A resilient tier runs across at least two (preferably three) Availability Zones behind an Elastic Load Balancer that health-checks targets and routes only to healthy ones. EC2 Auto Scaling provides both elasticity and self-healing: an Auto Scaling Group launches instances from a launch template across multiple subnets/AZs, maintains a desired count between min and max, replaces instances that fail EC2 or ELB health checks, and balances capacity across AZs. Scaling policies include target tracking (keep a metric like average CPU or ALB request count per target at a setpoint), step scaling (different adjustments for different alarm breach sizes), scheduled scaling (known peaks), and predictive scaling (forecasts demand from history and provisions ahead of it). Health-check grace periods prevent killing instances during bootstrap, and connection draining/deregistration delay lets in-flight requests finish before an instance is removed. ASG instance refresh rolls out a new launch-template/AMI version gradually across the fleet. For stateful needs, keep instances stateless and externalise session/state to DynamoDB, ElastiCache or S3 so any instance can be replaced freely.",
              keyPoints: [
                'Run across ≥2 AZs behind an ELB that health-checks and routes only to healthy targets.',
                'Auto Scaling self-heals: replaces instances failing EC2/ELB health checks and rebalances across AZs.',
                'Scaling policies: target tracking, step, scheduled, and predictive (forecast-based).',
                'Health-check grace period avoids killing booting instances; deregistration delay drains in-flight requests.',
                'ASG instance refresh rolls a new AMI/launch-template across the fleet gradually.',
                'Keep instances stateless; externalise state to DynamoDB/ElastiCache/S3 so replacement is seamless.',
              ],
              commonMistakes: [
                'Deploying in a single AZ and calling it highly available — a single AZ failure takes you down.',
                'No health-check grace period, so Auto Scaling terminates instances that are still bootstrapping.',
                'Storing session state on the instance, breaking self-healing and scale-in.',
              ],
              diagram: {
                type: 'mermaid',
                lines: [
                  'flowchart TB',
                  '  U[Users] --> ALB[Application Load Balancer]',
                  '  ALB --> A[EC2 - AZ a]',
                  '  ALB --> B[EC2 - AZ b]',
                  '  ALB --> C[EC2 - AZ c]',
                  '  ASG[Auto Scaling Group] -.replaces unhealthy.-> A',
                  '  ASG -.target tracking.-> B',
                ],
                caption: 'Multi-AZ fleet behind an ALB; Auto Scaling replaces unhealthy instances and tracks a target metric for elasticity.',
              },
              exercises: [
                {
                  type: 'quiz',
                  prompt:
                    'Traffic is predictable, ramping up every weekday at 08:00. You want capacity ready before the surge, learned from history. Which scaling policy?',
                  solution: {
                    explanation:
                      'Predictive scaling — it forecasts the recurring demand pattern from historical metrics and provisions capacity ahead of the surge (optionally combined with target tracking for reactive adjustments).',
                  },
                },
                {
                  type: 'predict',
                  prompt:
                    'An instance passes EC2 status checks but its application returns 500s. The ASG uses ELB health checks. What happens?',
                  solution: {
                    explanation:
                      'The ELB health check fails, the ASG marks the instance unhealthy and terminates it, then launches a replacement — self-healing based on application-level health, not just hardware status.',
                  },
                },
                {
                  type: 'quiz',
                  prompt:
                    'You need to roll out a new hardened AMI across an ASG gradually without manual instance replacement. What feature do you use?',
                  solution: {
                    explanation:
                      'ASG instance refresh with a new launch-template version referencing the new AMI; it replaces instances in batches honouring a minimum healthy percentage.',
                  },
                },
              ],
              docs: 'https://docs.aws.amazon.com/autoscaling/ec2/userguide/what-is-amazon-ec2-auto-scaling.html',
            },
            {
              id: 'dop3-t0-c1',
              services: [
                { icon: 'rds', label: 'Amazon RDS' },
                { icon: 'aurora', label: 'Amazon Aurora' },
                { icon: 'dynamodb', label: 'Amazon DynamoDB' },
              ],
              title: 'Resilient data tiers: Multi-AZ, replicas and global tables',
              summary:
                'Make the data layer resilient with synchronous Multi-AZ failover, read replicas for scale, and Region-spanning options like Aurora Global Database and DynamoDB global tables.',
              explanation:
                "Stateless compute is easy to replace; data needs deliberate resilience. RDS Multi-AZ keeps a synchronous standby in another AZ and fails over automatically (DNS endpoint flips) on AZ or instance failure — this is availability, not read scaling. RDS read replicas use asynchronous replication to scale reads and can be promoted for some DR scenarios, including cross-Region replicas. Aurora stores six copies of data across three AZs, supports up to fifteen low-latency read replicas, and offers Aurora Global Database for cross-Region replication with typically sub-second lag and fast Region promotion (often under a minute) for DR. DynamoDB replicates across three AZs by default and global tables provide active-active multi-Region replication, so writes can happen in any Region. For backups, RDS/Aurora support automated backups with point-in-time recovery and snapshots; DynamoDB offers point-in-time recovery (PITR) and on-demand backups; AWS Backup centralises policies across services. Match the mechanism to the requirement: Multi-AZ for in-Region availability, cross-Region replicas/global database/global tables for low RTO/RPO disaster recovery.",
              keyPoints: [
                'RDS Multi-AZ = synchronous standby + automatic failover (availability, not read scaling).',
                'RDS read replicas = async read scaling; cross-Region replicas aid DR; can be promoted.',
                'Aurora: 6 copies across 3 AZs, up to 15 replicas; Global Database = cross-Region DR with sub-second lag.',
                'DynamoDB: 3-AZ replication by default; global tables = active-active multi-Region writes.',
                'PITR/automated backups (RDS, Aurora, DynamoDB) and AWS Backup centralise data protection.',
                'Pick by requirement: Multi-AZ for HA, cross-Region replication for low-RTO/RPO DR.',
              ],
              commonMistakes: [
                'Believing RDS Multi-AZ scales reads — it does not; use read replicas for that.',
                'Using a single-Region database for a requirement that needs cross-Region DR.',
                'Forgetting to enable PITR/backups, leaving no recovery point after accidental data loss.',
              ],
              exercises: [
                {
                  type: 'quiz',
                  prompt:
                    'A global app needs writes accepted in both us-east-1 and eu-west-1 with low latency in each, on a NoSQL store. Which feature?',
                  solution: {
                    explanation:
                      'DynamoDB global tables — active-active multi-Region replication that accepts writes in any participating Region and replicates them automatically.',
                  },
                },
                {
                  type: 'quiz',
                  prompt:
                    'A relational workload must survive a full Region outage with an RTO of about a minute and minimal data loss. Which option?',
                  solution: {
                    explanation:
                      'Aurora Global Database — it replicates to a secondary Region with sub-second lag and supports promoting the secondary Region typically in under a minute.',
                  },
                },
                {
                  type: 'task',
                  prompt:
                    'Distinguish what RDS Multi-AZ and RDS read replicas each solve.',
                  solution: {
                    explanation:
                      'Multi-AZ provides high availability via a synchronous standby with automatic failover. Read replicas provide read scaling (and some DR/cross-Region use) via asynchronous replication.',
                  },
                },
              ],
              docs: 'https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/Concepts.MultiAZ.html',
            },
          ],
        },
        {
          id: 'dop3-t1',
          name: 'Multi-Region & disaster recovery',
          concepts: [
            {
              id: 'dop3-t1-c0',
              services: [
                { icon: 'route53', label: 'Amazon Route 53' },
                { icon: 'backup', label: 'AWS Backup' },
              ],
              title: 'DR strategies and Route 53 failover',
              summary:
                'Disaster recovery is chosen by target RTO/RPO across four strategies — backup & restore, pilot light, warm standby, and multi-site active-active — with Route 53 health checks driving failover.',
              explanation:
                "Disaster recovery is governed by two targets: RPO (how much data loss is acceptable, i.e. how recent the recovery point must be) and RTO (how fast you must be back up). AWS frames four strategies along a cost/complexity spectrum. Backup & restore is cheapest: back data up (often cross-Region) and rebuild infrastructure on disaster — highest RTO/RPO, suitable for non-critical workloads. Pilot light keeps core data replicated and minimal critical services running (e.g. a replicated database) in the second Region, scaling the rest up on failover — lower RTO. Warm standby runs a scaled-down but fully functional copy in the second Region that you scale up on failover — lower still. Multi-site active-active runs full production in multiple Regions simultaneously, serving live traffic from each — near-zero RTO/RPO but highest cost and complexity. Route 53 ties it together: failover routing with health checks sends traffic to the secondary when the primary fails its health check; latency or geolocation routing distributes active-active traffic; and Route 53 Application Recovery Controller adds routing controls and readiness checks for deliberate, audited failover. AWS Backup and cross-Region snapshot/replication implement the data side; CloudFormation/CDK rebuilds infrastructure in the recovery Region.",
              analogy:
                'DR strategies are like fire preparedness: backup & restore is having insurance papers in a safe (you rebuild later); pilot light keeps the pilot flame lit; warm standby keeps a smaller spare house heated; active-active means you actually live in two houses at once.',
              keyPoints: [
                'RPO = acceptable data loss; RTO = acceptable downtime. Lower targets cost more.',
                'Backup & restore: cheapest, highest RTO/RPO — rebuild on disaster from cross-Region backups.',
                'Pilot light: core data + minimal services warm in second Region; scale up on failover.',
                'Warm standby: scaled-down full stack always running; scale up on failover.',
                'Multi-site active-active: full production in multiple Regions; near-zero RTO/RPO, highest cost.',
                'Route 53 failover routing + health checks (and Application Recovery Controller) drive Region failover.',
              ],
              commonMistakes: [
                'Picking active-active for a tight budget when warm standby or pilot light meets the RTO/RPO.',
                'Forgetting to replicate data cross-Region, so the recovery Region has nothing to restore from.',
                'Relying only on DNS failover without lowering record TTLs, slowing the cutover due to cached DNS.',
              ],
              diagram: {
                type: 'mermaid',
                lines: [
                  'flowchart LR',
                  '  BR[Backup & restore<br/>high RTO/RPO, low cost] --> PL[Pilot light]',
                  '  PL --> WS[Warm standby]',
                  '  WS --> AA[Active-active<br/>low RTO/RPO, high cost]',
                ],
                caption: 'The four DR strategies along the cost vs RTO/RPO spectrum.',
              },
              exercises: [
                {
                  type: 'quiz',
                  prompt:
                    'A business needs RTO of a few minutes but wants to avoid running full production capacity in a second Region. A scaled-down full copy runs there continuously and is scaled up on failover. Which strategy?',
                  solution: {
                    explanation:
                      'Warm standby — a smaller but fully functional copy runs continuously in the second Region and is scaled up when failover occurs.',
                  },
                },
                {
                  type: 'quiz',
                  prompt:
                    'How does Route 53 automatically send users to a healthy secondary Region when the primary endpoint fails?',
                  solution: {
                    explanation:
                      'Failover routing with health checks: a primary record with an associated health check and a secondary record. When the health check marks the primary unhealthy, Route 53 answers with the secondary.',
                  },
                },
                {
                  type: 'task',
                  prompt:
                    'For a non-critical internal tool with a 24-hour RTO and tight budget, which DR strategy and why?',
                  solution: {
                    explanation:
                      'Backup & restore. The generous RTO/RPO allows rebuilding from cross-Region backups on demand, which is the lowest-cost approach.',
                  },
                },
              ],
              docs: 'https://docs.aws.amazon.com/whitepapers/latest/disaster-recovery-workloads-on-aws/disaster-recovery-options-in-the-cloud.html',
            },
          ],
        },
        {
          id: 'dop3-t1b',
          name: 'Decoupling for resilience',
          concepts: [
            {
              id: 'dop3-t1b-c0',
              services: [
                { icon: 'sqs', label: 'Amazon SQS' },
                { icon: 'sns', label: 'Amazon SNS' },
                { icon: 'lambda', label: 'AWS Lambda' },
              ],
              title: 'Decoupling, retries, DLQs and idempotency',
              summary:
                'Asynchronous decoupling with queues and topics absorbs load and isolates failures; retries with backoff, dead-letter queues and idempotency make the system tolerant of transient errors.',
              explanation:
                "Tightly coupled synchronous calls cascade failures: if a downstream slows or fails, the upstream backs up and the outage spreads. Decoupling with Amazon SQS (a buffer between producers and consumers) absorbs spikes and lets components fail independently — consumers process at their own pace and the queue retains messages. Amazon SNS fans a single event out to many subscribers; the SNS+SQS fan-out pattern (SNS topic delivering to multiple SQS queues) combines pub/sub with durable per-consumer buffering. Resilience requires more than a queue: configure visibility timeouts so a message is hidden while being processed, set a redrive policy to a dead-letter queue (DLQ) after maxReceiveCount failures so poison messages do not block the queue, and design consumers to be idempotent (processing the same message twice has no harmful effect) because at-least-once delivery can re-deliver messages. Lambda event source mappings and asynchronous invocations also support retries and DLQs/on-failure destinations. Use exponential backoff with jitter for retries to avoid retry storms, and circuit-breaker style handling for repeatedly failing dependencies.",
              keyPoints: [
                'Decouple with SQS to buffer load and isolate failures so they do not cascade.',
                'SNS+SQS fan-out gives pub/sub plus durable per-subscriber buffering.',
                'Visibility timeout hides an in-flight message; tune it to processing time to avoid duplicates.',
                'Redrive policy sends repeatedly failing messages to a dead-letter queue after maxReceiveCount.',
                'Design idempotent consumers — at-least-once delivery can re-deliver messages.',
                'Retry with exponential backoff and jitter; add DLQs/on-failure destinations for async Lambda.',
              ],
              commonMistakes: [
                'No dead-letter queue, so a single poison message is retried forever and blocks throughput.',
                'Assuming exactly-once delivery on standard queues — design for at-least-once and be idempotent.',
                'Visibility timeout shorter than processing time, causing duplicate concurrent processing.',
              ],
              diagram: {
                type: 'mermaid',
                lines: [
                  'flowchart LR',
                  '  P[Producer] --> SNS[(SNS topic)]',
                  '  SNS --> Q1[[SQS queue A]]',
                  '  SNS --> Q2[[SQS queue B]]',
                  '  Q1 --> C1[Consumer A]',
                  '  Q1 -.maxReceiveCount.-> DLQ[[Dead-letter queue]]',
                ],
                caption: 'SNS fan-out to per-consumer SQS queues, with a DLQ catching messages that repeatedly fail processing.',
              },
              exercises: [
                {
                  type: 'quiz',
                  prompt:
                    'A consumer occasionally crashes on a malformed message and the whole queue stops draining as that message is retried endlessly. What do you configure?',
                  solution: {
                    explanation:
                      'A redrive policy with a dead-letter queue and a maxReceiveCount. After that many failed receives the poison message moves to the DLQ, unblocking the main queue for healthy messages.',
                  },
                },
                {
                  type: 'predict',
                  prompt:
                    'A standard SQS consumer occasionally receives the same message twice. The processing creates a database row each time. What is the design flaw and fix?',
                  solution: {
                    explanation:
                      'Standard queues are at-least-once, so duplicates are expected. The consumer must be idempotent — e.g. use a deduplication/idempotency key (or a FIFO queue with content-based dedup) so reprocessing has no harmful effect.',
                  },
                },
                {
                  type: 'quiz',
                  prompt:
                    'How do you deliver one event to several independent processing pipelines, each with its own durable buffer?',
                  solution: {
                    explanation:
                      'SNS+SQS fan-out: publish to an SNS topic that delivers to multiple SQS queues, one per pipeline, so each consumer gets its own durable, independently processed copy.',
                  },
                },
              ],
              docs: 'https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/sqs-dead-letter-queues.html',
            },
          ],
        },
      ],
    },

    /* ─────────────────────── DOMAIN 4 — MONITORING & LOGGING (15%) ─────────────────────── */
    {
      level: 4,
      name: 'Monitoring & Logging',
      focus: 'Collecting metrics, logs, traces and events; centralising logging; alarming, dashboards and synthetic monitoring (Domain 4 · 15%)',
      accent: '#1ba85a',
      soft: '#e6f7ee',
      topics: [
        {
          id: 'dop4-t0',
          name: 'CloudWatch metrics, alarms & logs',
          concepts: [
            {
              id: 'dop4-t0-c0',
              services: [
                { icon: 'cloudwatch', label: 'Amazon CloudWatch' },
              ],
              title: 'Metrics, alarms, composite alarms and dashboards',
              summary:
                'CloudWatch collects metrics (including custom and high-resolution), evaluates alarms (including composite and anomaly-detection), and visualises everything on dashboards.',
              explanation:
                "Amazon CloudWatch ingests metrics — built-in service metrics, plus custom metrics you publish with PutMetricData (and high-resolution metrics down to 1-second granularity). EC2 has no built-in memory or disk-space metric; the CloudWatch agent collects those from inside the instance. Alarms evaluate a metric (or a metric math expression) against a threshold over a number of evaluation periods and enter OK, ALARM or INSUFFICIENT_DATA, triggering actions: notify an SNS topic, run an Auto Scaling action, recover/stop/terminate an EC2 instance, or hand off to EventBridge/Systems Manager. Anomaly-detection alarms learn a band of expected values and alarm on deviation rather than a fixed threshold — good for metrics with daily/weekly patterns. Composite alarms combine several alarms with AND/OR logic to cut alert noise (alarm only when multiple conditions hold). Metric filters turn matching log patterns into metrics so you can alarm on log content (e.g. count of ERROR lines). Dashboards present metrics, alarms and logs together; metric math derives values like error rate = errors/requests. Detailed monitoring gives 1-minute EC2 metrics versus the default 5-minute.",
              keyPoints: [
                'Custom metrics via PutMetricData; high-resolution metrics down to 1 second.',
                'EC2 memory/disk metrics require the CloudWatch agent (not built in).',
                'Alarms: threshold over N periods → OK/ALARM/INSUFFICIENT_DATA; actions to SNS, ASG, EC2 recovery, EventBridge.',
                'Anomaly-detection alarms learn expected bands; composite alarms combine alarms with AND/OR to reduce noise.',
                'Metric filters convert log patterns into metrics so you can alarm on log content.',
                'Metric math derives values (e.g. error rate); dashboards unify metrics, alarms and logs.',
              ],
              commonMistakes: [
                'Expecting EC2 memory utilisation out of the box — you must install the CloudWatch agent.',
                'Alerting on each raw alarm instead of a composite alarm, drowning the team in noise.',
                'Setting a single evaluation period for a noisy metric, causing alarm flapping (tune periods/datapoints).',
              ],
              code: {
                language: 'yaml',
                lines: [
                  'HighErrorRate:',
                  '  Type: AWS::CloudWatch::Alarm',
                  '  Properties:',
                  '    AlarmName: api-5xx-rate',
                  '    Metrics:',
                  '      - Id: e',
                  '        Expression: errors / requests * 100',
                  '        Label: ErrorRatePct',
                  '      - Id: errors',
                  '        MetricStat: { Metric: { Namespace: AWS/ApplicationELB, MetricName: HTTPCode_Target_5XX_Count }, Period: 60, Stat: Sum }',
                  '        ReturnData: false',
                  '      - Id: requests',
                  '        MetricStat: { Metric: { Namespace: AWS/ApplicationELB, MetricName: RequestCount }, Period: 60, Stat: Sum }',
                  '        ReturnData: false',
                  '    Threshold: 5',
                  '    EvaluationPeriods: 3',
                  '    ComparisonOperator: GreaterThanThreshold',
                  '    AlarmActions: [ !Ref AlertTopic ]',
                ],
                explanation:
                  'A metric-math alarm computing 5xx error rate as a percentage and alarming (to an SNS topic) when it exceeds 5% for three consecutive minutes.',
              },
              exercises: [
                {
                  type: 'quiz',
                  prompt:
                    'You must alarm on the number of times the word "OutOfMemory" appears in an application log and notify the team. Which CloudWatch feature creates the metric to alarm on?',
                  solution: {
                    explanation:
                      'A metric filter on the CloudWatch Logs log group matching "OutOfMemory", which emits a custom metric; then a CloudWatch alarm on that metric notifies via SNS.',
                  },
                },
                {
                  type: 'quiz',
                  prompt:
                    'On-call is flooded because each of three related alarms pages independently, though only the combination matters. What reduces the noise?',
                  solution: {
                    explanation:
                      'A composite alarm combining the three with AND logic, so a single notification fires only when all conditions are simultaneously true.',
                  },
                },
                {
                  type: 'task',
                  prompt:
                    'A metric has strong daily seasonality; a fixed threshold either false-alarms at night or misses daytime spikes. What alarm type fits?',
                  solution: {
                    explanation:
                      'An anomaly-detection alarm. It learns the expected band over time and alarms on deviation from the seasonal pattern rather than a static threshold.',
                  },
                },
              ],
              docs: 'https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/WhatIsCloudWatch.html',
            },
            {
              id: 'dop4-t0-c1',
              services: [
                { icon: 'cloudwatch', label: 'CloudWatch Logs' },
                { icon: 'kinesis', label: 'Amazon Kinesis' },
                { icon: 's3', label: 'Amazon S3' },
              ],
              title: 'Centralised logging, Logs Insights and subscriptions',
              summary:
                'CloudWatch Logs collects logs from agents and services; subscription filters stream them in real time to Kinesis, Firehose, Lambda or a central account, and Logs Insights queries them.',
              explanation:
                "CloudWatch Logs stores logs in log groups (with retention settings and KMS encryption) made up of log streams. The unified CloudWatch agent ships OS and application logs from EC2/on-prem; many AWS services (Lambda, API Gateway, ECS, VPC Flow Logs, Route 53) log directly. CloudWatch Logs Insights is a purpose-built query language for ad-hoc analysis — filter, parse, stats, sort — over log groups, ideal for incident investigation. To move logs in real time, subscription filters match a pattern and stream matching events to a destination: AWS Lambda (transform/route), Amazon Kinesis Data Streams, or Amazon Data Firehose (which can land logs in S3, Amazon OpenSearch Service, or Redshift). For multi-account/centralised logging, a common architecture sends every account's logs via subscription filters to a Firehose/Kinesis stream owned by a central logging account, which writes to a central S3 bucket (and optionally OpenSearch for search/dashboards); Firehose handles buffering, compression and partitioning. Logs can also be exported to S3 in bulk for archival and queried with Athena. Set retention per log group so logs do not accrue cost forever, and protect them with resource policies and KMS.",
              keyPoints: [
                'Log groups (retention + KMS) contain log streams; the unified CloudWatch agent ships OS/app logs.',
                'Logs Insights: query language (filter/parse/stats) for fast ad-hoc log analysis during incidents.',
                'Subscription filters stream matching events in real time to Lambda, Kinesis Data Streams, or Firehose.',
                'Centralised logging: each account → subscription filter → Firehose/Kinesis in a central account → S3/OpenSearch.',
                'Firehose buffers, compresses and partitions to S3/OpenSearch/Redshift with no servers.',
                'Set per-log-group retention; export to S3 + Athena for cheap long-term archival/queries.',
              ],
              commonMistakes: [
                'Leaving log retention at "never expire", accumulating unbounded storage cost.',
                'Polling logs for analysis instead of using subscription filters for real-time streaming.',
                'Centralising logs without cross-account permissions on the destination, so delivery fails.',
              ],
              diagram: {
                type: 'mermaid',
                lines: [
                  'flowchart LR',
                  '  L1[Account A logs] --> SF1[Subscription filter]',
                  '  L2[Account B logs] --> SF2[Subscription filter]',
                  '  SF1 --> FH[(Firehose<br/>central account)]',
                  '  SF2 --> FH',
                  '  FH --> S3[(Central S3)]',
                  '  FH --> OS[OpenSearch]',
                ],
                caption: 'Centralised logging: subscription filters in each account stream logs to a Firehose in a central account that lands them in S3 and OpenSearch.',
              },
              exercises: [
                {
                  type: 'quiz',
                  prompt:
                    'During an incident you need to find all 5xx responses for a given request ID across a noisy log group, fast, without exporting to another tool. What do you use?',
                  solution: {
                    explanation:
                      'CloudWatch Logs Insights — run a query to filter by the request ID and status code and aggregate, directly over the log group.',
                  },
                },
                {
                  type: 'task',
                  prompt:
                    'Design real-time delivery of all production logs from 20 accounts into one searchable place with minimal servers.',
                  solution: {
                    explanation:
                      'In each account add subscription filters that stream matching log events to an Amazon Data Firehose (or Kinesis stream) in a central logging account; Firehose delivers to a central S3 bucket and/or Amazon OpenSearch Service for search and dashboards.',
                  },
                },
                {
                  type: 'quiz',
                  prompt:
                    'Logging costs are climbing because old logs are never removed. What is the simplest control?',
                  solution: {
                    explanation:
                      'Set a retention period on each log group so CloudWatch Logs automatically expires old events; archive to S3 first if long-term retention is needed.',
                  },
                },
              ],
              docs: 'https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/WhatIsCloudWatchLogs.html',
            },
          ],
        },
        {
          id: 'dop4-t1',
          name: 'Tracing, events & synthetics',
          concepts: [
            {
              id: 'dop4-t1-c0',
              services: [
                { icon: 'management', label: 'AWS X-Ray' },
                { icon: 'eventbridge', label: 'Amazon EventBridge' },
                { icon: 'cloudwatch', label: 'CloudWatch Synthetics' },
              ],
              title: 'X-Ray tracing, EventBridge and synthetic canaries',
              summary:
                'X-Ray traces requests across distributed services to find bottlenecks; EventBridge routes events for observability-driven automation; CloudWatch Synthetics runs canaries that probe endpoints like a user.',
              explanation:
                "AWS X-Ray provides distributed tracing: instrumented services emit segments and subsegments that X-Ray assembles into a service map and traces, revealing latency, errors and faults per hop across microservices, Lambda, API Gateway and more. Sampling controls trace volume/cost; annotations and metadata let you filter traces; X-Ray Insights surfaces anomalies. It answers 'which downstream call is slow?' where CloudWatch metrics only show that something is slow. Amazon EventBridge is the event bus that routes events from AWS services, custom apps and SaaS partners to targets (Lambda, SNS, SQS, Step Functions, etc.) via rules with event patterns; the default bus carries AWS service events (e.g. an EC2 state change, a CodePipeline stage change), and scheduled rules act like cron. EventBridge is the backbone of event-driven monitoring and automation. CloudWatch Synthetics runs canaries — scripted Node.js/Python scripts (often Puppeteer/Selenium-based) on a schedule that load a URL, click through a flow or hit an API and assert correctness — so you detect broken endpoints, expired certificates or latency from the user's perspective before customers do, complementing passive metrics with active probing. CloudWatch RUM captures real user monitoring from browsers, and ServiceLens correlates traces, metrics and logs.",
              keyPoints: [
                'X-Ray: distributed tracing + service map; finds the slow/erroring hop across services and Lambda.',
                'X-Ray sampling controls volume/cost; annotations/metadata enable trace filtering; Insights flags anomalies.',
                'EventBridge: event bus routing AWS/custom/SaaS events to targets via pattern-matching rules; scheduled rules = cron.',
                'Synthetics canaries actively probe URLs/flows/APIs on a schedule and assert correctness from the user view.',
                'Canaries catch broken endpoints, expired TLS certs and latency before users do.',
                'RUM = real-user browser monitoring; ServiceLens correlates traces, metrics and logs.',
              ],
              commonMistakes: [
                'Trying to locate a microservice bottleneck with CloudWatch metrics alone — use X-Ray tracing.',
                'Relying only on passive metrics and learning about an outage from customers — add Synthetics canaries.',
                'Polling for AWS state changes instead of subscribing to them via EventBridge rules.',
              ],
              diagram: {
                type: 'mermaid',
                lines: [
                  'flowchart LR',
                  '  Canary[Synthetics canary] --> API[API Gateway]',
                  '  API --> Fn[Lambda]',
                  '  Fn --> DB[(DynamoDB)]',
                  '  API -.X-Ray trace.-> XR[X-Ray service map]',
                  '  Fn -.segment.-> XR',
                ],
                caption: 'A synthetic canary probes the API while X-Ray traces each hop, pinpointing where latency or errors arise.',
              },
              exercises: [
                {
                  type: 'quiz',
                  prompt:
                    'A request is intermittently slow across a chain of five microservices and you must find which call is responsible. Which service?',
                  solution: {
                    explanation:
                      'AWS X-Ray. Its distributed traces and service map break latency down per hop, exposing the slow service or downstream dependency.',
                  },
                },
                {
                  type: 'quiz',
                  prompt:
                    'You want to be alerted within minutes if a critical login flow breaks, even when no real users are active overnight. What do you set up?',
                  solution: {
                    explanation:
                      'A CloudWatch Synthetics canary that scripts the login flow on a schedule and alarms (via SNS) when its assertions fail or latency exceeds a threshold.',
                  },
                },
                {
                  type: 'task',
                  prompt:
                    'You need to run a Lambda automatically whenever any EC2 instance enters the stopped state, account-wide. How?',
                  solution: {
                    explanation:
                      'Create an EventBridge rule on the default bus with an event pattern matching EC2 Instance State-change Notification (state stopped) and target the Lambda function.',
                  },
                },
              ],
              docs: 'https://docs.aws.amazon.com/xray/latest/devguide/aws-xray.html',
            },
          ],
        },
      ],
    },

    /* ─────────────────── DOMAIN 5 — INCIDENT & EVENT RESPONSE (14%) ─────────────────── */
    {
      level: 5,
      name: 'Incident & Event Response',
      focus: 'Event-driven automation, automated remediation runbooks, lifecycle hooks, alerting and on-call response (Domain 5 · 14%)',
      accent: '#dd344c',
      soft: '#fde8ed',
      topics: [
        {
          id: 'dop5-t0',
          name: 'Event-driven automation',
          concepts: [
            {
              id: 'dop5-t0-c0',
              services: [
                { icon: 'eventbridge', label: 'Amazon EventBridge' },
                { icon: 'lambda', label: 'AWS Lambda' },
                { icon: 'stepfunctions', label: 'AWS Step Functions' },
              ],
              title: 'EventBridge-driven response and orchestration',
              summary:
                'EventBridge rules detect operational events and trigger automated responses — a Lambda for a single action, or a Step Functions state machine for multi-step, error-handling workflows.',
              explanation:
                "Incident response should be automated wherever possible. Amazon EventBridge detects events the moment they happen — a GuardDuty finding, a Config compliance change, an EC2 or RDS state change, a Health event, a failed CodePipeline stage, a CloudTrail-captured API call — and routes them via rules with event patterns to targets. For a single corrective action, the target is often a Lambda function (e.g. isolate a compromised instance by swapping its security group). For complex responses you need ordering, branching, retries and human approval, so the target is an AWS Step Functions state machine that orchestrates many steps with built-in error handling (Retry/Catch), parallelism (Parallel/Map), waits and choice branching; Step Functions can call Lambda, Systems Manager Automation, SNS, and more, and Standard workflows can run long (up to a year) for processes that include waiting on approvals. EventBridge also supports input transformers (reshape the event before delivery), dead-letter queues on targets (capture failed deliveries), archive and replay (re-process past events), and Pipes (point-to-point source-to-target with filtering/enrichment). Together they turn detection into deterministic, auditable, hands-off remediation.",
              keyPoints: [
                'EventBridge detects operational events instantly and routes them via pattern-matched rules to targets.',
                'Single action → Lambda target; multi-step workflow with error handling → Step Functions target.',
                'Step Functions adds Retry/Catch, Parallel/Map, Choice, Wait, and human-approval steps; Standard runs up to a year.',
                'Input transformers reshape events; target DLQs capture failed deliveries.',
                'Archive & replay lets you re-process historical events; Pipes connect a source to a target with filtering/enrichment.',
                'Common triggers: GuardDuty findings, Config changes, Health events, pipeline failures, CloudTrail API calls.',
              ],
              commonMistakes: [
                'Cramming a multi-step, error-prone remediation into one Lambda instead of a Step Functions workflow.',
                'No DLQ on the EventBridge target, so failed deliveries are silently lost.',
                'Building polling loops to detect changes EventBridge already emits as events.',
              ],
              diagram: {
                type: 'mermaid',
                lines: [
                  'flowchart LR',
                  '  GD[GuardDuty finding] --> EB[EventBridge rule]',
                  '  EB --> SF[Step Functions]',
                  '  SF --> Iso[Isolate instance]',
                  '  SF --> Snap[Snapshot volumes]',
                  '  SF --> Notify[Notify SNS]',
                ],
                caption: 'A GuardDuty finding triggers an EventBridge rule that runs a Step Functions workflow to isolate, capture evidence and notify.',
              },
              exercises: [
                {
                  type: 'quiz',
                  prompt:
                    'An automated response must, in order: isolate an instance, snapshot its volumes, wait for a human approval, then terminate it, with retries and branching. Which target should the EventBridge rule invoke?',
                  solution: {
                    explanation:
                      'An AWS Step Functions state machine. It orchestrates the ordered steps with Retry/Catch, a wait-for-approval step, and choice branching — far better than a single Lambda for multi-step, long-running, error-handling workflows.',
                  },
                },
                {
                  type: 'predict',
                  prompt:
                    'An EventBridge rule targets a Lambda that is throttled and the invocation fails. There is no DLQ. What happens to that event?',
                  solution: {
                    explanation:
                      'After EventBridge exhausts its retries the event is dropped and lost, because no dead-letter queue was configured on the target to capture failed deliveries.',
                  },
                },
                {
                  type: 'task',
                  prompt:
                    'A bug caused several events to be mis-handled yesterday. How can you re-process exactly those events after fixing the handler?',
                  solution: {
                    explanation:
                      'Use EventBridge archive and replay: if the event bus archives events, you replay the archived events for the affected time window to the rules/targets after deploying the fix.',
                  },
                },
              ],
              docs: 'https://docs.aws.amazon.com/eventbridge/latest/userguide/eb-what-is.html',
            },
            {
              id: 'dop5-t0-c1',
              services: [
                { icon: 'systemsmanager', label: 'SSM Automation' },
                { icon: 'sns', label: 'Amazon SNS' },
              ],
              title: 'Automation runbooks and notification fan-out',
              summary:
                'Systems Manager Automation runbooks codify operational procedures as reusable, auditable documents that EventBridge or alarms can invoke; SNS fans alerts out to people and systems.',
              explanation:
                "AWS Systems Manager Automation lets you define a runbook (an SSM Automation document) as a sequence of steps — call AWS APIs, run scripts, invoke Lambda, branch and loop, pause for approval — to perform operational tasks safely and repeatably (restart a service, rotate a credential, rebuild an instance, restore from snapshot). AWS provides many managed runbooks (AWS-* documents) for common fixes, and you can write your own. Runbooks are invoked manually, on a schedule, by an EventBridge rule, by a CloudWatch alarm action, or as a remediation target for an AWS Config rule — and every execution is logged for audit, giving you deterministic, reviewable remediation instead of ad-hoc console clicks. Amazon SNS handles notification fan-out: an alarm or event publishes to a topic and all subscribers receive it — email/SMS for humans, an SQS queue for durable handling, an HTTPS endpoint for a chat/incident tool (or AWS Chatbot to post to Slack/Chime), and Lambda for further automation. The pattern is: detect (EventBridge/alarm) → remediate (Automation/Lambda/Step Functions) → notify (SNS) → track (incident tooling). Incident Manager (within Systems Manager) adds on-call schedules, escalation paths, response plans and runbooks for coordinated human response when automation is not enough.",
              keyPoints: [
                'Automation runbooks (SSM documents) codify operational procedures as auditable, repeatable steps.',
                'Invoke runbooks manually, on schedule, from EventBridge, from a CloudWatch alarm, or as a Config remediation.',
                'Many AWS-managed runbooks exist for common fixes; you can author custom ones with approvals and branching.',
                'SNS fan-out: one publish reaches email/SMS, SQS, HTTPS endpoints, Lambda, and chat via AWS Chatbot.',
                'Pattern: detect → remediate → notify → track; every Automation run is logged for audit.',
                'Incident Manager adds on-call rotations, escalation, response plans and engagement for human-led incidents.',
              ],
              commonMistakes: [
                'Performing recurring fixes by hand in the console instead of codifying them as an Automation runbook.',
                'Wiring an alarm directly to a fragile one-off script rather than a reusable, auditable runbook.',
                'Sending alerts to a single email instead of an SNS topic with redundant, role-appropriate subscribers.',
              ],
              diagram: {
                type: 'mermaid',
                lines: [
                  'flowchart LR',
                  '  Alarm[CloudWatch alarm] --> EB[EventBridge]',
                  '  EB --> Auto[SSM Automation runbook]',
                  '  Auto --> Fix[Remediate resource]',
                  '  Auto --> SNS[(SNS topic)]',
                  '  SNS --> Chat[Chatbot / Slack]',
                  '  SNS --> Pager[On-call / Incident Manager]',
                ],
                caption: 'An alarm triggers an Automation runbook that remediates and publishes to SNS, fanning out to chat and on-call.',
              },
              exercises: [
                {
                  type: 'quiz',
                  prompt:
                    'A recurring fix (restart a stuck service and capture a log bundle) is done manually each time it alarms. How do you make it automatic, repeatable and auditable?',
                  solution: {
                    explanation:
                      'Codify it as a Systems Manager Automation runbook and invoke the runbook from the CloudWatch alarm (or an EventBridge rule). Each execution is logged for audit and behaves identically every time.',
                  },
                },
                {
                  type: 'quiz',
                  prompt:
                    'A single alarm must notify on-call by SMS, post to a Slack channel, and trigger a Lambda — all at once. What is the simplest design?',
                  solution: {
                    explanation:
                      'Have the alarm publish to one SNS topic with multiple subscribers: SMS for on-call, AWS Chatbot for Slack, and the Lambda function — SNS fans the single message out to all of them.',
                  },
                },
                {
                  type: 'task',
                  prompt:
                    'The org needs on-call rotations, escalation if the first responder does not acknowledge, and a coordinated response plan tied to runbooks. Which service?',
                  solution: {
                    explanation:
                      'AWS Systems Manager Incident Manager — it provides on-call schedules, escalation paths, response plans, engagement (paging) and links to runbooks for coordinated human response.',
                  },
                },
              ],
              docs: 'https://docs.aws.amazon.com/systems-manager/latest/userguide/systems-manager-automation.html',
            },
          ],
        },
        {
          id: 'dop5-t1',
          name: 'Lifecycle & capacity events',
          concepts: [
            {
              id: 'dop5-t1-c0',
              services: [
                { icon: 'autoscaling', label: 'EC2 Auto Scaling' },
                { icon: 'sns', label: 'Amazon SNS' },
              ],
              title: 'Auto Scaling lifecycle hooks and warm pools',
              summary:
                'Lifecycle hooks pause an instance entering or leaving an Auto Scaling Group so you can run custom actions; warm pools pre-initialise instances for faster scale-out.',
              explanation:
                "Auto Scaling lifecycle hooks let you insert custom work at two transitions: when an instance is launching (Pending:Wait, before it enters service) and when it is terminating (Terminating:Wait, before it is removed). The instance pauses in the wait state for up to a configurable timeout while your automation runs — for example, on launch: register the instance, pull config, warm caches, run validation; on terminate: drain connections, flush logs to S3, deregister from external systems. Hooks emit notifications (via EventBridge, or SNS/SQS) that trigger your handler, which must call CompleteLifecycleAction (or RecordLifecycleActionHeartbeat to extend the pause) to let the transition proceed; if the timeout elapses, the default result (CONTINUE or ABANDON) is applied. This is the supported way to guarantee graceful startup/shutdown rather than racing Auto Scaling. Warm pools keep a pool of pre-initialised, stopped (or running/hibernated) instances ready, so scale-out events promote them in seconds instead of waiting for a full boot+bootstrap — valuable for spiky demand with long initialisation. Termination policies and instance scale-in protection control which instances are removed first.",
              keyPoints: [
                'Lifecycle hooks pause instances at launch (Pending:Wait) and terminate (Terminating:Wait) for custom actions.',
                'Hook notifications go to EventBridge/SNS/SQS; your handler must call CompleteLifecycleAction to proceed.',
                'On launch: register, configure, warm caches; on terminate: drain, flush logs, deregister.',
                'Timeouts apply the default result (CONTINUE/ABANDON); heartbeat extends the pause if work runs long.',
                'Warm pools keep pre-initialised instances ready for fast scale-out when boot/bootstrap is slow.',
                'Termination policies and scale-in protection govern which instances are removed.',
              ],
              commonMistakes: [
                'Bootstrapping critical setup without a launch hook, so the instance serves traffic before it is ready.',
                'Forgetting to call CompleteLifecycleAction, leaving instances stuck in the wait state until timeout.',
                'Long initialisation causing slow scale-out — use a warm pool to pre-bake instances.',
              ],
              diagram: {
                type: 'mermaid',
                lines: [
                  'flowchart LR',
                  '  Scale[Scale-out] --> Pend[Pending:Wait]',
                  '  Pend --> Hook[Hook → Lambda<br/>configure + validate]',
                  '  Hook --> CLA[CompleteLifecycleAction]',
                  '  CLA --> InSvc[InService]',
                ],
                caption: 'A launch lifecycle hook holds the instance in Pending:Wait while it is configured and validated, then completes the action to put it in service.',
              },
              exercises: [
                {
                  type: 'quiz',
                  prompt:
                    'On scale-in, instances are terminated while still holding in-flight work and before their logs are uploaded. How do you guarantee graceful shutdown?',
                  solution: {
                    explanation:
                      'Add a terminate lifecycle hook (Terminating:Wait). The instance pauses while your handler drains connections and flushes logs to S3, then calls CompleteLifecycleAction to allow termination.',
                  },
                },
                {
                  type: 'predict',
                  prompt:
                    'A launch lifecycle hook handler never calls CompleteLifecycleAction and there is no heartbeat. What happens after the hook timeout?',
                  solution: {
                    explanation:
                      'The hook times out and the configured default result is applied — typically CONTINUE (instance proceeds) or ABANDON (instance is terminated and replaced), depending on the hook configuration.',
                  },
                },
                {
                  type: 'quiz',
                  prompt:
                    'Instances take several minutes to boot and bootstrap, making scale-out too slow for sudden spikes. What feature helps?',
                  solution: {
                    explanation:
                      'An Auto Scaling warm pool of pre-initialised instances, so scale-out promotes ready instances in seconds instead of performing a full boot and bootstrap.',
                  },
                },
              ],
              docs: 'https://docs.aws.amazon.com/autoscaling/ec2/userguide/lifecycle-hooks.html',
            },
          ],
        },
      ],
    },

    /* ─────────────────── DOMAIN 6 — SECURITY & COMPLIANCE (17%) ─────────────────── */
    {
      level: 6,
      name: 'Security & Compliance',
      focus: 'Identity and access automation, compliance as code, threat detection, secrets management and automated remediation (Domain 6 · 17%)',
      accent: '#2e73b8',
      soft: '#e7f0fa',
      topics: [
        {
          id: 'dop6-t0',
          name: 'Identity & access automation',
          concepts: [
            {
              id: 'dop6-t0-c0',
              services: [
                { icon: 'iam', label: 'AWS IAM' },
                { icon: 'organizations', label: 'AWS Organizations' },
              ],
              title: 'IAM policies, roles, SCPs and permission boundaries',
              summary:
                'Least-privilege access combines identity and resource policies, assumed roles for workloads, Organizations SCP guardrails, and permission boundaries that cap delegated permissions.',
              explanation:
                "Effective permissions are the intersection of several controls, and an explicit Deny anywhere always wins. Identity-based policies attach to users/groups/roles; resource-based policies attach to resources (S3 bucket policies, KMS key policies, Lambda resource policies) and enable cross-account access without role assumption. Workloads should assume IAM roles for temporary credentials (EC2 instance profiles, ECS task roles, Lambda execution roles, IRSA for EKS) rather than long-lived keys. At the organisation level, Service Control Policies (SCPs) set the maximum permissions any account/OU can have — they never grant, only constrain, so even an account admin cannot exceed them (e.g. deny disabling CloudTrail, deny use outside approved Regions). Permission boundaries cap the maximum permissions an IAM principal can be granted, which is the safe way to delegate admin: you let a team create roles but a boundary ensures those roles can never exceed a ceiling. The order of evaluation for an action is roughly: explicit Deny → SCP (org boundary) → resource policy / identity policy / permission boundary all must allow → otherwise implicit deny. For the exam, recognise when to reach for an SCP (org-wide guardrail), a permission boundary (delegated creation cap), a resource policy (cross-account/grant on the resource), and a role (workload/temporary access). IAM Access Analyzer finds resources shared externally and validates/generates least-privilege policies.",
              keyPoints: [
                'Explicit Deny always wins; effective access is the intersection of applicable policies.',
                'Use roles (instance profiles, task roles, Lambda execution roles, IRSA) — not long-lived keys — for workloads.',
                'SCPs (Organizations) set the max permissions for accounts/OUs; they constrain, never grant.',
                'Permission boundaries cap what a principal can be granted — the safe way to delegate role creation.',
                'Resource-based policies (S3/KMS/Lambda) enable cross-account access without assuming a role.',
                'IAM Access Analyzer finds external exposure and helps generate least-privilege policies.',
              ],
              commonMistakes: [
                'Thinking an SCP grants access — it only sets an upper bound; you still need identity/resource policies.',
                'Delegating role creation without a permission boundary, allowing privilege escalation.',
                'Embedding long-lived access keys in code/instances instead of using roles.',
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
                  '      "NotAction": [ "iam:*", "organizations:*", "route53:*" ],',
                  '      "Resource": "*",',
                  '      "Condition": {',
                  '        "StringNotEquals": { "aws:RequestedRegion": [ "eu-west-1", "us-east-1" ] }',
                  '      }',
                  '    }',
                  '  ]',
                  '}',
                ],
                explanation:
                  'An SCP guardrail denying actions outside the approved Regions (exempting global services like IAM). Applied at the org/OU level, no account can bypass it even with admin rights.',
              },
              exercises: [
                {
                  type: 'quiz',
                  prompt:
                    'Security must guarantee that no account in the organisation can ever disable AWS CloudTrail, even by an account administrator. Which control?',
                  solution: {
                    explanation:
                      'A Service Control Policy (SCP) attached to the organisation/OU that denies cloudtrail:StopLogging and related actions. SCPs cap permissions org-wide, so even an account admin is blocked.',
                  },
                },
                {
                  type: 'quiz',
                  prompt:
                    'You let a platform team create IAM roles for their workloads but must ensure those roles can never grant more than a defined set of permissions. What do you apply?',
                  solution: {
                    explanation:
                      'A permission boundary on the roles/users the team can create — it caps the maximum effective permissions of any principal they provision, preventing privilege escalation.',
                  },
                },
                {
                  type: 'task',
                  prompt:
                    'A Lambda in account A must read an S3 bucket in account B. Give two valid approaches.',
                  solution: {
                    explanation:
                      'Either a resource-based bucket policy in B granting the role in A read access (no role assumption needed), or a cross-account role in B that the Lambda assumes via STS. Both require matching identity-policy permissions in A.',
                  },
                },
              ],
              docs: 'https://docs.aws.amazon.com/IAM/latest/UserGuide/access_policies.html',
            },
          ],
        },
        {
          id: 'dop6-t1',
          name: 'Compliance as code & remediation',
          concepts: [
            {
              id: 'dop6-t1-c0',
              services: [
                { icon: 'config', label: 'AWS Config' },
                { icon: 'systemsmanager', label: 'SSM Automation' },
              ],
              title: 'AWS Config rules, conformance packs and auto-remediation',
              summary:
                'AWS Config records resource configuration, evaluates it against managed or custom rules and conformance packs, and can automatically remediate non-compliant resources via SSM Automation.',
              explanation:
                "AWS Config continuously records the configuration of resources and their relationships over time. Config rules evaluate whether resources comply with desired settings — there are AWS-managed rules (e.g. s3-bucket-public-read-prohibited, encrypted-volumes, restricted-ssh) and custom rules backed by Lambda or Guard policies, evaluated on configuration change and/or periodically. Conformance packs bundle many rules (and remediation actions) into a single deployable compliance template, and can be deployed org-wide via Config's Organizations integration so every account is governed by the same baseline — this is compliance as code. When a rule finds a non-compliant resource, you can attach a remediation action that runs a Systems Manager Automation runbook automatically (or on demand) to fix it — for example, a rule detecting an unencrypted volume or a public bucket triggers a runbook that encrypts/blocks public access; an EventBridge rule on the Config compliance-change event can drive richer responses. Config aggregators roll compliance status across accounts/Regions into a single view for auditors. The professional pattern is: define the compliance baseline as Config rules/conformance packs in code, deploy via StackSets/Organizations, detect drift from compliance, and auto-remediate with auditable runbooks — keeping the estate continuously compliant without manual checks.",
              keyPoints: [
                'Config records resource configuration history; rules evaluate compliance on change and/or periodically.',
                'Managed rules cover common checks; custom rules use Lambda or Guard policies.',
                'Conformance packs bundle rules + remediations into one deployable template, org-wide via Organizations.',
                'Attach SSM Automation remediation to a rule for automatic (or on-demand) fixing of non-compliant resources.',
                'EventBridge on Config compliance-change events enables richer automated responses.',
                'Aggregators give a single cross-account/Region compliance view for audit.',
              ],
              commonMistakes: [
                'Treating Config as monitoring only — it can auto-remediate via attached SSM Automation runbooks.',
                'Defining rules per account by hand instead of deploying conformance packs org-wide as code.',
                'Confusing Config (resource configuration & compliance) with CloudTrail (API activity audit).',
              ],
              diagram: {
                type: 'mermaid',
                lines: [
                  'flowchart LR',
                  '  R[Resource change] --> Cfg[AWS Config rule]',
                  '  Cfg -->|non-compliant| Rem[SSM Automation remediation]',
                  '  Rem --> Fixed[Resource fixed]',
                  '  Cfg --> EB[EventBridge → notify/escalate]',
                ],
                caption: 'A Config rule detects a non-compliant resource and triggers an SSM Automation runbook to remediate, while EventBridge notifies.',
              },
              exercises: [
                {
                  type: 'quiz',
                  prompt:
                    'Whenever an S3 bucket is made public, it must be automatically locked back down and the security team notified, with an audit record. Which combination?',
                  solution: {
                    explanation:
                      'An AWS Config managed rule (s3-bucket-public-read-prohibited) with an attached SSM Automation remediation runbook to re-block public access, plus an EventBridge rule on the compliance change to notify via SNS — all auditable.',
                  },
                },
                {
                  type: 'quiz',
                  prompt:
                    'A security baseline of 30 Config rules with remediations must apply identically to every account, including new ones. What do you deploy?',
                  solution: {
                    explanation:
                      'A conformance pack deployed organisation-wide through AWS Config\'s Organizations integration, so all current and future accounts get the same rules and remediations as code.',
                  },
                },
                {
                  type: 'task',
                  prompt:
                    'Contrast what AWS Config and AWS CloudTrail each tell you about an incident.',
                  solution: {
                    explanation:
                      'CloudTrail tells you who made which API call and when (the action). AWS Config tells you the configuration state of a resource over time and whether it complies (the result/state).',
                  },
                },
              ],
              docs: 'https://docs.aws.amazon.com/config/latest/developerguide/WhatIsConfig.html',
            },
          ],
        },
        {
          id: 'dop6-t2',
          name: 'Threat detection & posture',
          concepts: [
            {
              id: 'dop6-t2-c0',
              services: [
                { icon: 'guardduty', label: 'Amazon GuardDuty' },
                { icon: 'inspector', label: 'Amazon Inspector' },
                { icon: 'security', label: 'AWS Security Hub' },
              ],
              title: 'Security Hub, GuardDuty and Inspector',
              summary:
                'GuardDuty detects threats from logs, Inspector scans for vulnerabilities, and Security Hub aggregates findings and posture across accounts with standards-based checks.',
              explanation:
                "Amazon GuardDuty is continuous threat detection that analyses CloudTrail management/data events, VPC Flow Logs, DNS logs, and (with protections) EKS, S3, RDS, Lambda and runtime activity, surfacing findings like cryptomining, credential exfiltration, port scans and anomalous API calls — no agents, just turn it on. Amazon Inspector performs automated vulnerability management: it continuously scans EC2 instances, container images in ECR, and Lambda functions for CVEs and produces risk-scored findings. AWS Security Hub is the aggregation and posture layer: it ingests findings from GuardDuty, Inspector, Macie, IAM Access Analyzer, Config and partners into a normalised format (ASFF), runs automated best-practice security standards (AWS Foundational Security Best Practices, CIS, PCI DSS) to score your posture, and supports cross-account aggregation via Organizations with a delegated administrator. Security Hub can route findings to EventBridge to drive automated remediation, and its automation rules can suppress or update findings. The professional design enables GuardDuty and Inspector across the org, aggregates everything in Security Hub in a central security account, and wires Security Hub/EventBridge to automated runbooks — turning detection into response. Macie additionally discovers sensitive data (PII) in S3.",
              keyPoints: [
                'GuardDuty: agentless threat detection from CloudTrail, VPC Flow, DNS (and EKS/S3/RDS/Lambda/runtime protections).',
                'Inspector: continuous vulnerability scanning of EC2, ECR images and Lambda for CVEs, with risk scores.',
                'Security Hub: aggregates findings (ASFF) and runs standards (AWS FSBP, CIS, PCI DSS) to score posture.',
                'Security Hub supports cross-account aggregation via Organizations and a delegated administrator.',
                'Route Security Hub/GuardDuty findings to EventBridge for automated remediation.',
                'Macie discovers sensitive data (PII) in S3 to complement the posture picture.',
              ],
              commonMistakes: [
                'Expecting GuardDuty to scan for software vulnerabilities — that is Inspector; GuardDuty detects active threats.',
                'Treating Security Hub as a detector — it aggregates and scores; detectors are GuardDuty/Inspector/etc.',
                'Enabling tools per account manually instead of org-wide with a delegated administrator.',
              ],
              diagram: {
                type: 'mermaid',
                lines: [
                  'flowchart LR',
                  '  GD[GuardDuty] --> SH[Security Hub]',
                  '  Insp[Inspector] --> SH',
                  '  Macie[Macie] --> SH',
                  '  Cfg[Config] --> SH',
                  '  SH --> EB[EventBridge → auto-remediate / notify]',
                ],
                caption: 'Detectors feed normalised findings into Security Hub, which scores posture and routes findings to EventBridge for response.',
              },
              exercises: [
                {
                  type: 'quiz',
                  prompt:
                    'You need a single pane that aggregates findings from GuardDuty, Inspector and Config across all accounts and scores you against the AWS Foundational Security Best Practices standard. Which service?',
                  solution: {
                    explanation:
                      'AWS Security Hub — it normalises and aggregates findings across accounts (via Organizations/delegated admin) and runs security standards to produce a posture score.',
                  },
                },
                {
                  type: 'quiz',
                  prompt:
                    'Which service tells you that an EC2 instance is running software with a known CVE, versus which detects that the instance is calling a known malware domain?',
                  solution: {
                    explanation:
                      'Amazon Inspector reports the CVE (vulnerability scanning); Amazon GuardDuty detects the malicious domain callout (active-threat detection from DNS/flow logs).',
                  },
                },
                {
                  type: 'task',
                  prompt:
                    'Outline an automated response when GuardDuty reports a likely compromised instance.',
                  solution: {
                    explanation:
                      'GuardDuty finding → Security Hub/EventBridge rule → automated runbook (Step Functions/SSM Automation) that isolates the instance (restrictive security group), snapshots its volumes for forensics, and notifies the security team via SNS.',
                  },
                },
              ],
              docs: 'https://docs.aws.amazon.com/securityhub/latest/userguide/what-is-securityhub.html',
            },
            {
              id: 'dop6-t2-c1',
              services: [
                { icon: 'secretsmanager', label: 'AWS Secrets Manager' },
                { icon: 'kms', label: 'AWS KMS' },
                { icon: 'systemsmanager', label: 'SSM Parameter Store' },
              ],
              title: 'Secrets management, rotation and encryption',
              summary:
                'Secrets Manager stores and automatically rotates secrets via Lambda; Parameter Store offers simpler config/secret storage; KMS underpins encryption and key policies govern access.',
              explanation:
                "Hard-coded credentials are a top source of breaches. AWS Secrets Manager stores secrets encrypted with KMS, controls access with IAM and resource policies, and crucially supports automatic rotation: a rotation Lambda (built-in for RDS/Redshift/DocumentDB, or custom for anything else) periodically creates a new secret value and updates the source system, so applications fetch the current value at runtime and never embed long-lived credentials. Systems Manager Parameter Store is a lighter, lower-cost option for configuration and SecureString secrets (KMS-encrypted), without built-in rotation — good when you do not need managed rotation. AWS KMS manages the encryption keys behind both, and across the platform (S3, EBS, RDS, etc.): customer-managed keys give you control over rotation (annual automatic rotation), key policies and grants, while the key policy is the primary access control on a key (IAM alone is not enough for KMS). Envelope encryption (KMS encrypts a data key, the data key encrypts the data) lets large data be encrypted efficiently, and all key usage is logged in CloudTrail for audit. For DevOps pipelines, fetch secrets at build/deploy time from Secrets Manager/Parameter Store rather than storing them in source or plaintext environment variables, and reference them via CodeBuild env, CloudFormation dynamic references, or SDK calls.",
              keyPoints: [
                'Secrets Manager: KMS-encrypted secrets with automatic rotation via a Lambda (managed for RDS/Redshift/DocumentDB).',
                'Parameter Store: cheaper config/secret store (SecureString via KMS) without built-in rotation.',
                'KMS key policy is the primary access control on a key; customer-managed keys allow rotation and grants.',
                'Envelope encryption: KMS encrypts a data key that encrypts the data; efficient for large data.',
                'All KMS key usage is logged in CloudTrail for audit.',
                'In pipelines, fetch secrets at runtime (CodeBuild env, CFN dynamic references) — never commit them.',
              ],
              commonMistakes: [
                'Storing secrets as plaintext in source, CI variables, or CloudFormation parameters.',
                'Granting KMS access via IAM only and forgetting that the key policy must also allow the principal.',
                'Using Parameter Store where managed automatic rotation is required — that is Secrets Manager.',
              ],
              code: {
                language: 'yaml',
                lines: [
                  '# CloudFormation dynamic reference pulls the secret at deploy time',
                  'Resources:',
                  '  Db:',
                  '    Type: AWS::RDS::DBInstance',
                  '    Properties:',
                  '      Engine: mysql',
                  '      MasterUsername: admin',
                  '      MasterUserPassword: \'{{resolve:secretsmanager:prod/db:SecretString:password}}\'',
                ],
                explanation:
                  'A CloudFormation dynamic reference resolves the database password from Secrets Manager at deploy time, so the plaintext password never appears in the template or parameters.',
              },
              exercises: [
                {
                  type: 'quiz',
                  prompt:
                    'A database password must be changed automatically every 30 days and the application must always pick up the current value without a redeploy. Which service and feature?',
                  solution: {
                    explanation:
                      'AWS Secrets Manager with automatic rotation enabled (a rotation Lambda updates the database and the secret). The app fetches the current secret at runtime, so no redeploy is needed.',
                  },
                },
                {
                  type: 'predict',
                  prompt:
                    'A principal has full IAM permissions for kms:Decrypt but the key policy does not mention it, and there is no grant. Can it decrypt with that KMS key?',
                  solution: {
                    explanation:
                      'No. For KMS, the key policy must allow the principal (directly, via a grant, or by delegating to IAM). IAM permissions alone are insufficient if the key policy does not enable IAM-based access.',
                  },
                },
                {
                  type: 'task',
                  prompt:
                    'How do you keep a database password out of a CloudFormation template while still creating the DB with it?',
                  solution: {
                    explanation:
                      'Store the password in Secrets Manager and use a CloudFormation dynamic reference ({{resolve:secretsmanager:...}}) so it is resolved at deploy time and never appears as plaintext in the template or parameters.',
                  },
                },
              ],
              docs: 'https://docs.aws.amazon.com/secretsmanager/latest/userguide/intro.html',
            },
          ],
        },
      ],
    },
  ],
};

export default content;
