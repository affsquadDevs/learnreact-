// DevOps — course content. Original explanations written for self-study; same schema as the other courses.
const content = {
  meta: {
    title: 'DevOps: Culture, CI/CD, Infrastructure and Reliability',
    description:
      'A comprehensive, hands-on DevOps course that takes you from culture and collaboration through continuous integration and delivery, infrastructure as code, containers and cloud delivery, and finally observability, reliability and security. Every concept is explained from first principles with diagrams, real tooling examples and practice exercises.',
    schemaVersion: '1.0',
    status: 'complete',
  },
  levels: [
    /* ───────────────────── LEVEL 1 — FOUNDATIONS ───────────────────── */
    {
      level: 1,
      name: 'Foundations',
      focus: 'What DevOps really is: culture, version control and the flow of work',
      accent: '#f97316',
      soft: '#fff0e6',
      topics: [
        {
          id: 'do1-t0',
          name: 'What DevOps is',
          concepts: [
            {
              id: 'do1-t0-c0',
              title: 'DevOps is a culture, not a tool',
              summary:
                'DevOps is a way of working that unites software development and IT operations to deliver value faster and more reliably. It is primarily about culture and collaboration, with tools as enablers rather than the point.',
              explanation:
                'People new to the field often think DevOps means a specific tool like Jenkins or Kubernetes, or a job title. In reality it is a set of cultural values and practices aimed at shortening the time between writing code and running it safely in production. It grew out of the frustration that developers were rewarded for shipping changes while operations was rewarded for keeping systems stable, creating a tug-of-war. DevOps replaces that with shared ownership: the people who build a service also help run it. Automation, measurement and fast feedback are the mechanisms, but the goal is a culture where teams collaborate end to end. Buying a CI server does not make you a DevOps organisation any more than buying running shoes makes you a marathoner.',
              analogy:
                'DevOps is like a restaurant kitchen where the chefs and the waiters share one goal — a happy diner — instead of blaming each other when a dish is late.',
              keyPoints: [
                'DevOps is a cultural and operational philosophy, not a product you can buy.',
                'Its aim is to shorten the lead time from idea to running, valuable software.',
                'It replaces dev-versus-ops conflict with shared ownership and accountability.',
                'Tools and automation support the culture; they do not replace it.',
              ],
              exercises: [
                {
                  type: 'quiz',
                  prompt: 'A manager says "we are now doing DevOps because we installed Jenkins." Why is this statement incomplete?',
                  hint: 'Think about what the actual goal of DevOps is.',
                  solution: {
                    explanation:
                      'Installing a CI tool is only adopting a tool. DevOps is a culture of shared ownership, collaboration and fast feedback aimed at delivering value reliably; tools merely enable those practices.',
                  },
                },
                {
                  type: 'quiz',
                  prompt: 'What underlying conflict did DevOps emerge to resolve?',
                  solution: {
                    explanation:
                      'The misaligned incentives between developers (rewarded for change and speed) and operations (rewarded for stability), which created a tug-of-war. DevOps aligns them around shared goals.',
                  },
                },
                {
                  type: 'predict',
                  prompt: 'A team adopts every popular DevOps tool but keeps separate dev and ops departments that only talk through tickets. Predict the likely outcome.',
                  solution: {
                    explanation:
                      'Improvement will be limited. Without cultural change and shared ownership, the ticket-based handoffs remain a bottleneck, so lead times and friction stay high despite the tooling.',
                  },
                },
              ],
              docs: 'https://aws.amazon.com/devops/what-is-devops/',
            },
            {
              id: 'do1-t0-c1',
              title: 'The CALMS framework',
              summary:
                'CALMS is a popular lens for assessing DevOps maturity: Culture, Automation, Lean, Measurement and Sharing. It captures the dimensions that matter beyond just tooling.',
              explanation:
                'CALMS, coined by Jez Humble and others, gives a memorable checklist for what a healthy DevOps practice looks like. Culture means collaboration and shared responsibility across teams. Automation means removing repetitive manual toil from builds, tests, deployments and infrastructure. Lean borrows from lean manufacturing: minimise work in progress, eliminate waste and optimise the whole flow rather than local silos. Measurement means using data and metrics to guide decisions and prove improvement, not gut feel. Sharing means spreading knowledge, tools and responsibility so that successes and failures are learned from collectively. A team can use CALMS as a self-assessment: weak in one letter usually explains why the others underperform.',
              analogy:
                'CALMS is like a five-legged stool — remove any one leg (say Measurement) and the whole thing wobbles no matter how strong the others are.',
              keyPoints: [
                'C — Culture: collaboration and shared responsibility.',
                'A — Automation: remove manual toil from build, test, deploy and infra.',
                'L — Lean: reduce waste and work in progress, optimise the whole flow.',
                'M — Measurement: decisions driven by metrics and data.',
                'S — Sharing: spread knowledge, tooling and ownership across teams.',
              ],
              diagram: {
                type: 'mermaid',
                lines: [
                  'flowchart LR',
                  '  C[Culture] --> A[Automation]',
                  '  A --> L[Lean]',
                  '  L --> M[Measurement]',
                  '  M --> S[Sharing]',
                  '  S --> C',
                ],
                caption: 'The five CALMS dimensions reinforce one another in a continuous cycle.',
              },
              exercises: [
                {
                  type: 'quiz',
                  prompt: 'Which CALMS dimension is concerned with reducing work in progress and eliminating waste?',
                  hint: 'It comes from manufacturing.',
                  solution: { explanation: 'Lean — it borrows from lean manufacturing to optimise the whole flow and cut waste.' },
                },
                {
                  type: 'task',
                  prompt: 'List the five words that make up the CALMS acronym in order.',
                  solution: {
                    lines: ['Culture', 'Automation', 'Lean', 'Measurement', 'Sharing'],
                    explanation: 'CALMS provides a balanced view of DevOps maturity across people, process and tooling.',
                  },
                },
                {
                  type: 'predict',
                  prompt: 'A team automates heavily but never shares knowledge and has no metrics. Which CALMS letters are weak and what risk follows?',
                  solution: {
                    explanation:
                      'Measurement and Sharing are weak. The team cannot prove improvement or learn collectively, so automation may optimise the wrong things and knowledge stays siloed with a few individuals.',
                  },
                },
              ],
              docs: 'https://www.atlassian.com/devops/frameworks/calms-framework',
            },
            {
              id: 'do1-t0-c2',
              title: 'Breaking down dev and ops silos',
              summary:
                'Traditional silos hand work over a wall between teams, creating delays and blame. DevOps dissolves these boundaries with shared goals, cross-functional teams and a "you build it, you run it" mindset.',
              explanation:
                'In a siloed organisation, developers throw finished code "over the wall" to a separate operations team that must deploy and support it, often with little context. This handoff is slow, error-prone and breeds blame when something breaks. DevOps breaks silos by forming cross-functional teams whose members collectively own a service from commit to production. Amazon famously popularised the phrase "you build it, you run it," meaning developers carry pagers for the systems they write, which sharpens their incentive to make those systems reliable and observable. Breaking silos does not mean everyone does everything; it means shared goals, shared visibility and removing the handoff barriers that slow value delivery. Platform teams often help by providing self-service tooling so product teams can operate independently.',
              analogy:
                'Silos are like a relay race where each runner drops the baton and walks away; DevOps is a small boat crew rowing together, all feeling every wave.',
              keyPoints: [
                'Silos create slow, error-prone handoffs and a culture of blame.',
                'Cross-functional teams own a service end to end.',
                '"You build it, you run it" aligns developers with operational reality.',
                'Platform teams provide self-service tooling to reduce friction, not new silos.',
              ],
              diagram: {
                type: 'mermaid',
                lines: [
                  'flowchart LR',
                  '  subgraph Silos',
                  '    D1[Dev] --> Wall[Handoff] --> O1[Ops]',
                  '  end',
                  '  subgraph DevOps',
                  '    T[Cross functional team] --> Run[Build and run]',
                  '  end',
                ],
                caption: 'Silos pass work over a wall; DevOps teams own the whole lifecycle.',
              },
              exercises: [
                {
                  type: 'quiz',
                  prompt: 'What does the phrase "you build it, you run it" encourage?',
                  hint: 'Think about who is responsible when the service breaks at 3am.',
                  solution: {
                    explanation:
                      'Developers take operational responsibility for the services they create, which motivates them to build reliable, observable systems instead of throwing code over the wall.',
                  },
                },
                {
                  type: 'quiz',
                  prompt: 'Does breaking silos mean every engineer must do every job?',
                  solution: {
                    explanation:
                      'No. It means shared goals, shared visibility and removing handoff barriers. Specialisation can remain, but the team collectively owns the outcome.',
                  },
                },
                {
                  type: 'predict',
                  prompt: 'A company keeps a separate deploy team that only acts on tickets. Predict the effect on lead time when a critical bug is found.',
                  solution: {
                    explanation:
                      'Lead time to fix will be long because the fix must queue behind the deploy team ticket process, adding handoff delay exactly when speed matters most.',
                  },
                },
              ],
              docs: 'https://learn.microsoft.com/en-us/devops/what-is-devops',
            },
            {
              id: 'do1-t0-c3',
              title: 'The DevOps lifecycle and infinity loop',
              summary:
                'The DevOps lifecycle is often drawn as an infinity loop of continuous phases: plan, code, build, test, release, deploy, operate and monitor. The loop emphasises that delivery never stops and feedback flows back to planning.',
              explanation:
                'The familiar infinity-loop diagram captures DevOps as a never-ending cycle rather than a one-way pipeline. The development side covers plan, code, build and test; the operations side covers release, deploy, operate and monitor. The loop shape stresses that the two halves are connected and continuous: insights from monitoring production feed straight back into planning the next change. Each phase has its own tooling and practices, but the value comes from the smooth, automated flow between them. The point is not to memorise eight boxes but to internalise that software delivery is a continuous, feedback-driven cycle where you learn from running systems and improve constantly. Optimising one phase in isolation rarely helps if the handoffs between phases are slow.',
              analogy:
                'It is like a Formula 1 pit cycle — the car races, returns, gets tuned from telemetry, and goes out faster; the loop never ends, each lap informed by the last.',
              keyPoints: [
                'Drawn as an infinity loop to show delivery is continuous, not one-and-done.',
                'Dev half: plan, code, build, test. Ops half: release, deploy, operate, monitor.',
                'Monitoring feedback flows back into planning the next iteration.',
                'Value comes from smooth flow between phases, not optimising one in isolation.',
              ],
              diagram: {
                type: 'mermaid',
                lines: [
                  'flowchart LR',
                  '  Plan --> Code --> Build --> Test --> Release --> Deploy --> Operate --> Monitor',
                  '  Monitor --> Plan',
                ],
                caption: 'The eight phases of the DevOps lifecycle form a continuous feedback loop.',
              },
              exercises: [
                {
                  type: 'quiz',
                  prompt: 'Why is the DevOps lifecycle drawn as an infinity loop rather than a straight line?',
                  hint: 'Where does monitoring data go?',
                  solution: {
                    explanation:
                      'Because delivery is continuous and feedback-driven: insights from operating and monitoring production flow back into planning, so the cycle never truly ends.',
                  },
                },
                {
                  type: 'task',
                  prompt: 'Name the eight phases of the DevOps lifecycle in order, starting from plan.',
                  solution: {
                    lines: ['Plan', 'Code', 'Build', 'Test', 'Release', 'Deploy', 'Operate', 'Monitor'],
                    explanation: 'The first four sit on the development side and the last four on the operations side of the loop.',
                  },
                },
                {
                  type: 'predict',
                  prompt: 'A team has excellent build and test phases but ignores the monitor phase. Predict what they will struggle with.',
                  solution: {
                    explanation:
                      'They will lack feedback from production, so planning is based on guesswork. Reliability issues and user pain go unnoticed, breaking the loop that should drive continuous improvement.',
                  },
                },
              ],
              docs: 'https://www.atlassian.com/devops',
            },
          ],
        },
        {
          id: 'do1-t1',
          name: 'Version control foundations',
          concepts: [
            {
              id: 'do1-t1-c0',
              title: 'Git for teams',
              summary:
                'Git is the distributed version control system at the heart of modern DevOps. It tracks every change, enables parallel work through branches and is the trigger for most automated pipelines.',
              explanation:
                'Git records the history of a codebase as a series of commits, each a snapshot identified by a hash and linked to its parent. Because Git is distributed, every clone holds the full history, so developers can work offline and the central remote is just a convention. Teams use branches to develop features in isolation and then merge them back, while remotes such as GitHub or GitLab host the shared copy that pipelines watch. In a DevOps context Git is more than storage: a push or merge is the event that kicks off continuous integration, so the repository becomes the single source of truth not only for code but increasingly for configuration and infrastructure too. Good commit hygiene — small, descriptive, logically scoped commits — makes history a useful tool for review, debugging and rollback.',
              analogy:
                'Git is like a time machine with infinite save points for your project, plus parallel universes (branches) you can merge back together.',
              keyPoints: [
                'Distributed: every clone has the full history; you can work offline.',
                'A commit is an immutable snapshot identified by a hash, linked to its parent.',
                'Branches let teams work in parallel and merge changes safely.',
                'A push or merge typically triggers the CI pipeline.',
                'Small, well-described commits make history useful for review and rollback.',
              ],
              code: {
                language: 'bash',
                lines: [
                  '# A typical team workflow',
                  'git checkout -b feature/add-login   # start a branch',
                  'git add .                           # stage changes',
                  'git commit -m "Add login form"      # snapshot them',
                  'git push -u origin feature/add-login # share and trigger CI',
                ],
                explanation:
                  'The push to the remote both shares the branch with teammates and, in most setups, triggers the continuous integration pipeline.',
              },
              exercises: [
                {
                  type: 'quiz',
                  prompt: 'What does it mean that Git is a "distributed" version control system?',
                  hint: 'Where does the full history live?',
                  solution: {
                    explanation:
                      'Every clone contains the complete history, so developers can commit and inspect history offline. The central remote is a convention for sharing, not a single point of truth that holds the only copy.',
                  },
                },
                {
                  type: 'quiz',
                  prompt: 'In a DevOps pipeline, what event usually triggers continuous integration?',
                  solution: { explanation: 'A push to the remote or a merge into a watched branch typically triggers the CI pipeline.' },
                },
                {
                  type: 'task',
                  prompt: 'Write the Git commands to create a branch called feature/cart, commit staged changes with a message, and push it.',
                  solution: {
                    lines: ['git checkout -b feature/cart', 'git commit -m "Add cart"', 'git push -u origin feature/cart'],
                    explanation: 'Branching isolates the work; pushing shares it and triggers automation.',
                  },
                },
              ],
              docs: 'https://git-scm.com/doc',
            },
            {
              id: 'do1-t1-c1',
              title: 'Trunk-based development vs Gitflow',
              summary:
                'Branching strategy shapes how fast and safely you integrate. Trunk-based development favours small, frequent merges to one main branch, while Gitflow uses long-lived branches for features and releases.',
              explanation:
                'Gitflow defines several long-lived branches — main, develop, feature, release and hotfix — with formal rules for how changes flow between them. It suited slower, versioned release cycles but tends to create large, divergent branches that are painful to merge and slow to integrate. Trunk-based development takes the opposite stance: everyone commits small changes to a single shared trunk (main) at least daily, using short-lived branches that live for hours, not weeks. To keep trunk releasable, incomplete work is hidden behind feature flags rather than parked on a long branch. Research from the DORA program consistently links trunk-based development to higher performance because it keeps integration continuous and merge conflicts tiny. Gitflow can still fit products with discrete, supported versions, but for fast continuous delivery trunk-based is the modern default.',
              analogy:
                'Gitflow is like everyone cooking separate dishes for a week then trying to combine them into one meal; trunk-based is a shared pot everyone adds a pinch to constantly, tasting as they go.',
              keyPoints: [
                'Gitflow uses long-lived branches (main, develop, feature, release, hotfix).',
                'Trunk-based development merges small changes to one main branch daily.',
                'Short-lived branches and feature flags keep trunk always releasable.',
                'DORA research links trunk-based development to higher delivery performance.',
                'Gitflow still fits products with discrete, separately supported versions.',
              ],
              diagram: {
                type: 'mermaid',
                lines: [
                  'flowchart LR',
                  '  subgraph Trunk',
                  '    Dev1[Small change] --> Main[main]',
                  '    Dev2[Small change] --> Main',
                  '  end',
                  '  subgraph Gitflow',
                  '    Feat[Long feature branch] --> DevB[develop] --> Rel[release] --> MainB[main]',
                  '  end',
                ],
                caption: 'Trunk-based keeps one short-lived flow into main; Gitflow layers several long-lived branches.',
              },
              commonMistakes: [
                'Calling a workflow "trunk-based" while keeping branches alive for weeks — that is the opposite of the idea.',
                'Adopting full Gitflow for a continuously deployed web app, inviting painful merges and slow integration.',
              ],
              exercises: [
                {
                  type: 'quiz',
                  prompt: 'How does trunk-based development keep the main branch releasable when a feature is unfinished?',
                  hint: 'The work is merged but not yet visible to users.',
                  solution: {
                    explanation:
                      'Incomplete work is merged behind feature flags so it is disabled in production, allowing frequent integration without exposing half-built features.',
                  },
                },
                {
                  type: 'quiz',
                  prompt: 'Which branching strategy does DORA research associate with higher delivery performance?',
                  solution: { explanation: 'Trunk-based development, because it keeps integration continuous and merge conflicts small.' },
                },
                {
                  type: 'predict',
                  prompt: 'A team uses Gitflow with feature branches that live for a month. Predict the integration experience.',
                  solution: {
                    explanation:
                      'Branches diverge heavily, so merges become large and conflict-prone. Integration is delayed and risky, slowing the whole delivery flow.',
                  },
                },
              ],
              docs: 'https://trunkbaseddevelopment.com/',
            },
            {
              id: 'do1-t1-c2',
              title: 'Code review and pull requests',
              summary:
                'Pull (or merge) requests propose changes for review before they enter the main branch. Review improves quality, spreads knowledge and is a key place to enforce automated checks.',
              explanation:
                'A pull request (GitHub) or merge request (GitLab) is a proposal to merge a branch, packaged with a diff, a description and a discussion thread. Reviewers read the change, leave comments, request modifications and ultimately approve it. Beyond catching bugs, review spreads understanding of the codebase across the team and acts as a gate where automated quality checks run — tests, linting and security scans must pass before merge. To keep review effective, changes should be small and focused; giant pull requests get rubber-stamped because nobody can meaningfully read them. Branch protection rules can require a passing pipeline and a minimum number of approvals, making the gate enforceable rather than optional. The combination of human review and automated checks is a core DevOps quality practice.',
              analogy:
                'A pull request is like a manuscript sent to editors before publication — fresh eyes catch mistakes the author cannot see, and nothing goes to print until it passes review.',
              keyPoints: [
                'A pull/merge request proposes a branch merge with a diff and discussion.',
                'Review catches bugs and spreads codebase knowledge across the team.',
                'It is a natural gate for automated tests, linting and security scans.',
                'Keep changes small so reviews stay meaningful instead of rubber-stamped.',
                'Branch protection can require passing checks and minimum approvals.',
              ],
              exercises: [
                {
                  type: 'quiz',
                  prompt: 'Name two benefits of code review beyond simply catching bugs.',
                  hint: 'Think people and process.',
                  solution: {
                    explanation:
                      'It spreads knowledge of the codebase across the team and provides a gate where automated checks (tests, linting, security scans) are enforced before merge.',
                  },
                },
                {
                  type: 'quiz',
                  prompt: 'Why are very large pull requests harmful to review quality?',
                  solution: {
                    explanation:
                      'Reviewers cannot meaningfully read huge diffs, so they tend to approve without real scrutiny, defeating the purpose of review.',
                  },
                },
                {
                  type: 'task',
                  prompt: 'Describe two branch protection rules that make a pull request gate enforceable.',
                  solution: {
                    lines: ['Require the CI pipeline to pass before merge', 'Require at least one approving review'],
                    explanation: 'These rules turn review and testing from optional habits into mandatory gates.',
                  },
                },
              ],
              docs: 'https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/proposing-changes-to-your-work-with-pull-requests/about-pull-requests',
            },
            {
              id: 'do1-t1-c3',
              title: 'Shift-left: finding problems early',
              summary:
                'Shift-left means moving quality and security activities earlier in the lifecycle, closer to when code is written. Catching issues early is far cheaper than catching them in production.',
              explanation:
                'Imagine the delivery timeline as a line running left (planning and coding) to right (production). Historically, testing and security checks happened on the far right, just before or after release, where defects are expensive and slow to fix. Shift-left moves those activities leftward so feedback reaches developers while the change is fresh — running unit tests on every commit, linting in the editor, scanning dependencies in the pull request and validating infrastructure before it is applied. The economic argument is strong: a bug caught by a unit test costs minutes, while the same bug found in production can cost hours of incident response plus customer impact. Shift-left applies to security too (often called DevSecOps), embedding scans early rather than as a final gate. The practice depends on fast, automated checks so early feedback does not slow developers down.',
              analogy:
                'Shift-left is like proofreading each paragraph as you write rather than discovering typos after the book is printed and shipped.',
              keyPoints: [
                'Shift-left moves testing and security earlier in the timeline.',
                'Early feedback reaches developers while the change is still fresh.',
                'Defects are dramatically cheaper to fix the earlier they are caught.',
                'It relies on fast, automated checks so it does not slow people down.',
                'Applied to security, it is a foundation of DevSecOps.',
              ],
              diagram: {
                type: 'mermaid',
                lines: [
                  'flowchart LR',
                  '  Code --> Commit --> PR[Pull request] --> Prod[Production]',
                  '  Code -. cheap fix .- Early[Shift left checks]',
                  '  Prod -. costly fix .- Late[Late discovery]',
                ],
                caption: 'Catching issues to the left (early) is far cheaper than to the right (in production).',
              },
              exercises: [
                {
                  type: 'quiz',
                  prompt: 'What is the core economic argument for shift-left?',
                  hint: 'Compare the cost of a bug caught by a unit test versus one found in production.',
                  solution: {
                    explanation:
                      'Defects get exponentially more expensive to fix the later they are found. A unit test catches a bug in minutes; the same bug in production can cost hours of incident response and customer impact.',
                  },
                },
                {
                  type: 'quiz',
                  prompt: 'Give two concrete examples of shift-left practices.',
                  solution: {
                    explanation:
                      'Examples include running unit tests on every commit, linting in the editor, scanning dependencies in the pull request, and validating infrastructure before it is applied.',
                  },
                },
                {
                  type: 'predict',
                  prompt: 'A team adds heavy security scans but only runs them in a slow nightly job after merge. Predict whether this achieves shift-left.',
                  solution: {
                    explanation:
                      'No. The feedback arrives after merge and slowly, so developers learn of issues long after writing the code. True shift-left needs fast checks during coding and pull request, not a late nightly gate.',
                  },
                },
              ],
              docs: 'https://about.gitlab.com/topics/devsecops/shift-left-testing/',
            },
          ],
        },
        {
          id: 'do1-t2',
          name: 'Collaboration and flow',
          concepts: [
            {
              id: 'do1-t2-c0',
              title: 'Agile and lean thinking',
              summary:
                'DevOps builds on Agile and lean ideas: deliver value in small increments, limit work in progress and optimise the whole flow rather than individual steps.',
              explanation:
                'Agile shifted software from big upfront plans to short iterations that deliver working software frequently and adapt to feedback. DevOps extends Agile beyond development into operations, so the fast feedback loop reaches all the way to running production. Lean, originally from manufacturing, contributes the idea of flow: visualise work, limit how much is in progress at once, and reduce the waste of waiting, handoffs and rework. A central lean insight is to optimise the whole system rather than local efficiency — a team that codes fast but waits weeks for a release has not improved delivery. Practices like small batch sizes and limiting work in progress reduce the time work spends queued, which is often the biggest hidden delay. Together these mindsets explain why DevOps prizes small, frequent, end-to-end delivery over large, infrequent releases.',
              analogy:
                'Lean flow is like a single-file checkout line that moves steadily versus ten half-staffed lines where carts pile up and nobody is sure which queue is fastest.',
              keyPoints: [
                'Agile delivers value in small, frequent, feedback-driven increments.',
                'DevOps extends Agile feedback loops into operations and production.',
                'Lean emphasises flow: visualise work and limit work in progress.',
                'Optimise the whole system, not the local efficiency of one step.',
                'Smaller batches reduce queue time, often the biggest hidden delay.',
              ],
              exercises: [
                {
                  type: 'quiz',
                  prompt: 'What does it mean to "optimise the whole" rather than local efficiency?',
                  hint: 'Think of a fast coding team that still waits weeks to release.',
                  solution: {
                    explanation:
                      'It means improving end-to-end delivery time, not just one step. Coding faster does not help if the work then sits in a release queue for weeks; the bottleneck for the whole system must be addressed.',
                  },
                },
                {
                  type: 'quiz',
                  prompt: 'Why does limiting work in progress speed up delivery?',
                  solution: {
                    explanation:
                      'With less work started at once, items spend less time queued and waiting, so each finishes sooner. Reducing queue time is often the largest available improvement.',
                  },
                },
                {
                  type: 'predict',
                  prompt: 'A team starts twenty tasks at once to "stay busy." Predict the effect on how quickly any single task finishes.',
                  solution: {
                    explanation:
                      'Each task finishes more slowly because attention and context-switching are spread thin and items pile up waiting. Throughput of completed work drops despite everyone being busy.',
                  },
                },
              ],
              docs: 'https://www.atlassian.com/agile',
            },
            {
              id: 'do1-t2-c1',
              title: 'Value stream mapping',
              summary:
                'A value stream is every step a change passes through from idea to delivered value. Mapping it reveals where time is actually spent, which is usually waiting, not working.',
              explanation:
                'Value stream mapping is a lean technique for drawing out each step a piece of work goes through and measuring how long it takes. The crucial distinction is between process time (active work) and lead time (total elapsed time including waiting). When teams map their value stream they are usually shocked to find that work spends most of its life waiting in queues, blocked on approvals or sitting between handoffs, while the actual touch time is small. This makes the real bottlenecks visible and prevents the common mistake of optimising a step that is already fast. In DevOps, value stream mapping guides where automation and process changes will have the biggest payoff — typically by removing waits, approvals and handoffs rather than by making coding marginally faster.',
              analogy:
                'It is like tracking a parcel and discovering it spent five days in a sorting warehouse and only two hours actually moving — you fix the warehouse, not the truck.',
              keyPoints: [
                'A value stream is every step from idea to delivered value.',
                'Process time is active work; lead time is total elapsed time including waiting.',
                'Mapping reveals that most lead time is usually waiting, not working.',
                'It exposes real bottlenecks so you optimise the right step.',
                'In DevOps it targets waits, approvals and handoffs for the biggest payoff.',
              ],
              diagram: {
                type: 'mermaid',
                lines: [
                  'flowchart LR',
                  '  Idea --> Wait1[Backlog wait] --> Dev[Develop] --> Wait2[Review wait] --> Deploy --> Value',
                ],
                caption: 'Mapping the stream shows the waits between steps, which usually dominate lead time.',
              },
              exercises: [
                {
                  type: 'quiz',
                  prompt: 'What is the difference between process time and lead time?',
                  hint: 'One includes waiting.',
                  solution: {
                    explanation:
                      'Process time is the time spent actively working on an item; lead time is the total elapsed time from start to finish, including all waiting and queuing.',
                  },
                },
                {
                  type: 'quiz',
                  prompt: 'Why is value stream mapping useful before investing in automation?',
                  solution: {
                    explanation:
                      'It reveals where time is actually lost — usually in waits and handoffs — so automation is applied to the real bottleneck rather than to a step that is already fast.',
                  },
                },
                {
                  type: 'predict',
                  prompt: 'A map shows coding takes 2 hours but waiting for a weekly release window takes 5 days. Predict the highest-impact improvement.',
                  solution: {
                    explanation:
                      'Moving to more frequent (ideally on-demand) releases. Removing the multi-day release wait dwarfs any gain from speeding up the already-short coding step.',
                  },
                },
              ],
              docs: 'https://www.atlassian.com/continuous-delivery/principles/value-stream-mapping',
            },
            {
              id: 'do1-t2-c2',
              title: 'DORA metrics',
              summary:
                'The DORA research identifies four key metrics that distinguish high-performing teams: deployment frequency, lead time for changes, change failure rate and time to restore service.',
              explanation:
                'The DevOps Research and Assessment (DORA) program studied thousands of teams and found four metrics that reliably correlate with software delivery and operational performance. Two measure throughput: deployment frequency (how often you ship to production) and lead time for changes (how long from code committed to running in production). Two measure stability: change failure rate (the percentage of deployments that cause a failure needing remediation) and time to restore service, sometimes called mean time to recovery (how quickly you recover from an incident). A key finding is that throughput and stability are not a trade-off — elite teams excel at both, because the same practices (small batches, automation, fast feedback) improve speed and safety together. Tracking these four gives an honest, balanced picture of delivery health, far better than vanity metrics like lines of code. A fifth, reliability, was later added to reflect operational performance.',
              analogy:
                'DORA metrics are like a fitness tracker for delivery: two readings for speed and two for resilience, and the fittest teams score well on both at once.',
              keyPoints: [
                'Deployment frequency and lead time for changes measure throughput (speed).',
                'Change failure rate and time to restore service measure stability (safety).',
                'Speed and stability are not a trade-off — elite teams achieve both.',
                'The four metrics give a balanced, honest view of delivery health.',
                'Reliability was later added as a fifth operational metric.',
              ],
              diagram: {
                type: 'mermaid',
                lines: [
                  'flowchart TB',
                  '  Throughput --> DF[Deployment frequency]',
                  '  Throughput --> LT[Lead time for changes]',
                  '  Stability --> CFR[Change failure rate]',
                  '  Stability --> MTTR[Time to restore service]',
                ],
                caption: 'The four DORA metrics split into throughput and stability.',
              },
              commonMistakes: [
                'Treating speed and stability as opposites and slowing down to be safe — DORA shows they improve together.',
                'Gaming a single metric (for example deploying tiny no-op changes to raise deployment frequency) instead of improving real flow.',
              ],
              exercises: [
                {
                  type: 'quiz',
                  prompt: 'Which two DORA metrics measure throughput and which two measure stability?',
                  hint: 'Two are about speed, two about recovery and failures.',
                  solution: {
                    explanation:
                      'Throughput: deployment frequency and lead time for changes. Stability: change failure rate and time to restore service (MTTR).',
                  },
                },
                {
                  type: 'quiz',
                  prompt: 'A key DORA finding contradicts a common assumption. What is it?',
                  solution: {
                    explanation:
                      'That speed and stability are not a trade-off. Elite teams achieve both because the same practices (small batches, automation, fast feedback) improve speed and safety together.',
                  },
                },
                {
                  type: 'task',
                  prompt: 'Team A deploys 50 times a week with a 5% change failure rate and recovers in 10 minutes. Team B deploys once a month, fails 30% of the time and takes a day to recover. State which team is higher performing on the DORA metrics.',
                  solution: {
                    lines: ['Team A is higher performing on all four metrics'],
                    explanation:
                      'Team A is better on both throughput metrics (more frequent, shorter lead time) and both stability metrics (lower failure rate, faster recovery), demonstrating that speed and stability go together.',
                  },
                },
              ],
              docs: 'https://dora.dev/guides/dora-metrics-four-keys/',
            },
          ],
        },
      ],
    },
    /* ───────────────────── LEVEL 2 — CI/CD ───────────────────── */
    {
      level: 2,
      name: 'Continuous Integration and Delivery',
      focus: 'Automating build, test and release with reliable pipelines',
      accent: '#f97316',
      soft: '#fff0e6',
      topics: [
        {
          id: 'do2-t0',
          name: 'Continuous Integration',
          concepts: [
            {
              id: 'do2-t0-c0',
              title: 'What continuous integration is',
              summary:
                'Continuous integration (CI) means every developer merges their work into a shared mainline frequently, and each merge is automatically built and tested. It keeps the codebase always integrated and working.',
              explanation:
                'Before CI, teams worked in isolation for weeks and then suffered a painful "integration phase" where everyone\'s changes collided. Continuous integration flips this: developers integrate small changes into the shared branch many times a day, and an automated system builds and tests every change immediately. The practice has two parts that must go together — frequent integration by people, and automated verification by machines. The automated build compiles the code and runs the test suite so that within minutes the team knows whether the latest change broke anything. Because changes are small and integrated constantly, problems are tiny and easy to locate, instead of a tangled mess discovered weeks later. CI is the foundation everything else in delivery builds on; without it, continuous delivery is impossible.',
              analogy:
                'CI is like merging onto a highway continuously at low speed rather than waiting in a side street and then forcing the whole queue on at once.',
              keyPoints: [
                'Developers integrate small changes into the shared branch many times a day.',
                'Every integration is automatically built and tested.',
                'Fast verification means problems are tiny and easy to locate.',
                'It avoids the painful big-bang integration phase of older workflows.',
                'CI is the prerequisite for continuous delivery.',
              ],
              diagram: {
                type: 'mermaid',
                lines: [
                  'flowchart LR',
                  '  Commit --> Trigger[CI triggered]',
                  '  Trigger --> Build',
                  '  Build --> Test',
                  '  Test --> Feedback[Pass or fail feedback]',
                ],
                caption: 'Each commit triggers an automated build and test, returning fast feedback.',
              },
              exercises: [
                {
                  type: 'quiz',
                  prompt: 'What are the two essential parts of continuous integration that must go together?',
                  hint: 'One is a human habit, one is a machine action.',
                  solution: {
                    explanation:
                      'Frequent integration of small changes by developers, and automated build-and-test verification of every change. Either alone is not CI.',
                  },
                },
                {
                  type: 'quiz',
                  prompt: 'Why does integrating small changes frequently make problems easier to fix?',
                  solution: {
                    explanation:
                      'Each change is small, so when a build fails the culprit is obvious and recent, instead of a large tangled set of changes discovered weeks later.',
                  },
                },
                {
                  type: 'predict',
                  prompt: 'A team commits daily but has no automated tests in CI. Predict whether they truly have continuous integration.',
                  solution: {
                    explanation:
                      'No. They integrate frequently but without automated verification they cannot know if integrations work. CI requires both frequent integration and automated build-and-test.',
                  },
                },
              ],
              docs: 'https://martinfowler.com/articles/continuousIntegration.html',
            },
            {
              id: 'do2-t0-c1',
              title: 'Fast feedback and keeping the build green',
              summary:
                'CI is only valuable if feedback is fast and a broken build is treated as a top priority to fix. A perpetually red build trains everyone to ignore it.',
              explanation:
                'The whole point of CI is rapid feedback, so the pipeline must be fast — ideally minutes. Slow pipelines tempt developers to skip them or batch up changes, which defeats CI. Teams keep pipelines fast by running the quickest, most informative tests first, parallelising work and caching dependencies. Equally important is the social rule that a broken (red) build is everyone\'s problem and stopping to fix it takes priority over new work. If the build stays red, people start committing on top of breakage and the signal becomes worthless — a phenomenon sometimes called build blindness. A reliable pipeline also means low flakiness: tests that randomly fail erode trust just as much as real failures. The discipline of keeping the build green at all times is what makes CI a dependable safety net rather than noise.',
              analogy:
                'A flaky or always-red build is like a smoke alarm that beeps randomly — people pull the battery, and then it cannot warn them of a real fire.',
              keyPoints: [
                'Feedback must be fast (minutes) or developers will route around it.',
                'Run fast, informative tests first; parallelise and cache to stay quick.',
                'A red build is everyone\'s problem and takes priority to fix.',
                'Flaky tests erode trust as much as genuine failures do.',
                'A reliable green build is a dependable safety net.',
              ],
              commonMistakes: [
                'Tolerating flaky tests and re-running until green, which hides real failures.',
                'Letting the build stay red for days so the team learns to ignore CI results.',
              ],
              exercises: [
                {
                  type: 'quiz',
                  prompt: 'Why is a perpetually red build dangerous for a team?',
                  hint: 'Think about what people start doing once red is normal.',
                  solution: {
                    explanation:
                      'People begin committing on top of breakage and ignore the failing signal, so CI no longer warns them of real problems — it becomes noise rather than a safety net.',
                  },
                },
                {
                  type: 'task',
                  prompt: 'List three techniques for keeping a CI pipeline fast.',
                  solution: {
                    lines: ['Run the fastest, most informative tests first', 'Parallelise jobs across runners', 'Cache dependencies between runs'],
                    explanation: 'Speed keeps feedback useful so developers actually rely on the pipeline.',
                  },
                },
                {
                  type: 'predict',
                  prompt: 'A pipeline takes 45 minutes. Predict how developers are likely to adapt their behaviour.',
                  solution: {
                    explanation:
                      'They will batch changes to avoid waiting, push less often, or context-switch and lose focus. The slow feedback undermines the frequent-integration habit that CI depends on.',
                  },
                },
              ],
              docs: 'https://docs.github.com/en/actions/concepts/overview/continuous-integration',
            },
          ],
        },
        {
          id: 'do2-t1',
          name: 'Continuous Delivery vs Deployment',
          concepts: [
            {
              id: 'do2-t1-c0',
              title: 'Delivery vs deployment',
              summary:
                'Continuous delivery means every change is always in a releasable state, with a human deciding when to push the button. Continuous deployment goes further and releases every passing change to production automatically.',
              explanation:
                'These two terms are often confused. Continuous delivery (CD) is the practice of keeping your software always ready to release: every change that passes the pipeline produces a deployable artifact and could go to production at any moment, but the actual release is a deliberate, usually one-click human decision. Continuous deployment removes that manual gate entirely — if a change passes all automated checks, it is deployed to production automatically with no human in the loop. Both rely on a robust CI foundation and a fully automated path to production; the only difference is whether a person presses the final button. Continuous delivery suits organisations that want release control for business or compliance reasons, while continuous deployment suits mature teams with strong automated testing and safe rollout strategies. The shared goal is that releasing is a routine, low-risk, automated event rather than a rare, stressful one.',
              analogy:
                'Continuous delivery is a loaded dishwasher ready to run whenever you press start; continuous deployment is one that starts itself the moment it is full.',
              keyPoints: [
                'Continuous delivery keeps every change releasable; a human triggers the release.',
                'Continuous deployment releases every passing change automatically.',
                'Both require strong CI and a fully automated path to production.',
                'The only difference is the final manual gate.',
                'The goal is that releasing is routine and low risk.',
              ],
              diagram: {
                type: 'mermaid',
                lines: [
                  'flowchart LR',
                  '  CI[CI passes] --> Artifact[Releasable artifact]',
                  '  Artifact --> Manual[Human approves] --> Prod[Production]',
                  '  Artifact --> Auto[Auto release] --> Prod',
                ],
                caption: 'Continuous delivery adds a human approval gate; continuous deployment skips it.',
              },
              exercises: [
                {
                  type: 'quiz',
                  prompt: 'What is the single difference between continuous delivery and continuous deployment?',
                  hint: 'Who presses the final button?',
                  solution: {
                    explanation:
                      'Continuous delivery keeps every change releasable but a human decides when to release; continuous deployment releases every passing change automatically with no manual gate.',
                  },
                },
                {
                  type: 'quiz',
                  prompt: 'Why might a regulated company choose continuous delivery over continuous deployment?',
                  solution: {
                    explanation:
                      'They may need a deliberate human approval (for compliance, change windows or business timing) before releasing, which continuous delivery preserves while still automating everything else.',
                  },
                },
                {
                  type: 'predict',
                  prompt: 'A team enables continuous deployment but has weak automated tests. Predict the likely consequence.',
                  solution: {
                    explanation:
                      'Bugs will reach production automatically because there is no human gate and the tests do not catch them. Continuous deployment demands strong automated verification and safe rollout strategies.',
                  },
                },
              ],
              docs: 'https://continuousdelivery.com/',
            },
            {
              id: 'do2-t1-c1',
              title: 'Artifacts, environments and promotion',
              summary:
                'Build an artifact once, then promote that same immutable artifact through environments (such as dev, staging, production). Building per environment risks inconsistency.',
              explanation:
                'A core delivery principle is build once, deploy many. The pipeline produces a single immutable artifact — a compiled binary, a container image, a versioned package — and that exact artifact is then promoted unchanged through a series of environments. Typical environments include development, staging (a production-like rehearsal) and production, each progressively closer to real conditions. Promotion means taking the artifact that passed in one environment and deploying it to the next, gaining confidence at each step. The reason you must not rebuild per environment is that a fresh build could pull different dependency versions or pick up different configuration, so what you tested is no longer what you ship. Configuration that differs between environments (database URLs, feature toggles) is injected at deploy time rather than baked into the artifact, keeping the artifact identical everywhere. This gives a strong guarantee: the thing tested in staging is byte-for-byte the thing released to production.',
              analogy:
                'It is like printing one master document and photocopying it for each office, rather than retyping it at each location and hoping every copy matches.',
              keyPoints: [
                'Build the artifact once and promote that same immutable artifact onward.',
                'Environments (dev, staging, prod) get progressively closer to production.',
                'Promotion = deploying the artifact that passed to the next environment.',
                'Rebuilding per environment risks different dependencies or config.',
                'Environment-specific config is injected at deploy time, not baked in.',
              ],
              diagram: {
                type: 'mermaid',
                lines: [
                  'flowchart LR',
                  '  Build[Build once] --> Dev',
                  '  Dev --> Staging',
                  '  Staging --> Prod[Production]',
                ],
                caption: 'One immutable artifact is promoted through successive environments.',
              },
              commonMistakes: [
                'Rebuilding the application separately for each environment, so staging and production differ subtly.',
                'Baking environment-specific configuration into the artifact instead of injecting it at deploy.',
              ],
              exercises: [
                {
                  type: 'quiz',
                  prompt: 'What does "build once, deploy many" protect against?',
                  hint: 'What could change if you rebuild per environment?',
                  solution: {
                    explanation:
                      'It protects against inconsistency. A rebuild could pull different dependency versions or configuration, so what you tested would differ from what you ship. Promoting one immutable artifact guarantees they are identical.',
                  },
                },
                {
                  type: 'quiz',
                  prompt: 'Where should environment-specific configuration live so the artifact stays identical everywhere?',
                  solution: {
                    explanation:
                      'It should be injected at deploy time (environment variables or config services), not baked into the artifact, so the same artifact runs in every environment.',
                  },
                },
                {
                  type: 'predict',
                  prompt: 'A team rebuilds the app in each environment and staging passes but production fails on startup. Predict a likely cause.',
                  solution: {
                    explanation:
                      'The production rebuild likely pulled a different dependency version or picked up different config than staging, so the artifacts were not identical. Building once and promoting would have prevented this.',
                  },
                },
              ],
              docs: 'https://docs.gitlab.com/ci/environments/',
            },
          ],
        },
        {
          id: 'do2-t2',
          name: 'Pipelines in practice',
          concepts: [
            {
              id: 'do2-t2-c0',
              title: 'Stages, jobs and runners',
              summary:
                'A pipeline is organised into stages that run in sequence, each containing jobs that can run in parallel. Jobs execute on runners — the machines or containers that do the work.',
              explanation:
                'Most CI/CD systems share a common structure. A pipeline is broken into stages such as build, test and deploy, and stages run one after another so that a later stage only starts if the previous one succeeded. Within a stage you define jobs, and jobs in the same stage typically run in parallel to save time — for example, running unit tests and linting simultaneously. Each job runs on a runner (called a runner in GitLab, a runner in GitHub Actions too), which is an agent process on a machine or container that checks out the code and executes the job\'s commands in a clean environment. Runners can be hosted by the platform or self-hosted for special hardware or network access. Understanding this stage/job/runner model lets you reason about ordering, parallelism and where things execute, which is the foundation for designing any pipeline.',
              analogy:
                'Stages are the courses of a meal served in order; jobs are dishes within a course cooked in parallel; runners are the cooks at their stations.',
              keyPoints: [
                'Pipelines are divided into stages that run sequentially.',
                'A stage contains jobs, which usually run in parallel.',
                'A later stage only runs if the previous stage succeeded.',
                'Runners are the agents (machines or containers) that execute jobs.',
                'Runners can be platform-hosted or self-hosted.',
              ],
              diagram: {
                type: 'mermaid',
                lines: [
                  'flowchart LR',
                  '  subgraph BuildStage',
                  '    B[Build job]',
                  '  end',
                  '  subgraph TestStage',
                  '    U[Unit tests]',
                  '    L[Lint]',
                  '  end',
                  '  B --> U',
                  '  B --> L',
                  '  U --> Deploy',
                  '  L --> Deploy',
                ],
                caption: 'Stages run in sequence; jobs within a stage run in parallel on runners.',
              },
              exercises: [
                {
                  type: 'quiz',
                  prompt: 'How do stages and jobs differ in their execution order?',
                  hint: 'One is sequential, one is parallel.',
                  solution: {
                    explanation:
                      'Stages run sequentially, each starting only if the previous succeeded. Jobs within a stage typically run in parallel to save time.',
                  },
                },
                {
                  type: 'quiz',
                  prompt: 'What is a runner and why might you self-host one?',
                  solution: {
                    explanation:
                      'A runner is the agent (machine or container) that executes pipeline jobs. You might self-host to access special hardware, internal networks, or to control the build environment.',
                  },
                },
                {
                  type: 'predict',
                  prompt: 'A pipeline puts deploy in the same stage as unit tests. Predict the risk.',
                  solution: {
                    explanation:
                      'Because jobs in a stage run in parallel, deploy could start before (or alongside) the tests finishing, potentially shipping untested code. Deploy should be in a later stage that depends on tests passing.',
                  },
                },
              ],
              docs: 'https://docs.gitlab.com/ci/pipelines/',
            },
            {
              id: 'do2-t2-c1',
              title: 'A GitHub Actions pipeline example',
              summary:
                'GitHub Actions defines pipelines as YAML workflows triggered by events. A workflow contains jobs, and jobs contain steps that run actions or shell commands.',
              explanation:
                'GitHub Actions is a widely used CI/CD platform built into GitHub. You describe a workflow in a YAML file under .github/workflows, declaring which events trigger it (such as push or pull_request), the jobs it contains, and the runner each job uses via runs-on. Each job is a sequence of steps; a step either runs a reusable action (with uses) or a shell command (with run). Reusable actions like actions/checkout and actions/setup-node handle common tasks so you do not script everything by hand. The example below checks out the code, sets up Node, installs dependencies and runs tests on every push and pull request. Reading a workflow top to bottom — trigger, job, runner, steps — is the mental model for almost every modern pipeline, and the same concepts translate directly to GitLab CI and other tools with different syntax.',
              keyPoints: [
                'Workflows are YAML files under .github/workflows triggered by events.',
                'A workflow has jobs; each job runs on a runner via runs-on.',
                'Jobs contain steps that either use an action or run a shell command.',
                'Reusable actions handle common tasks like checkout and setup.',
                'The trigger/job/runner/steps model generalises across CI tools.',
              ],
              code: {
                language: 'yaml',
                lines: [
                  'name: CI',
                  'on:',
                  '  push:',
                  '  pull_request:',
                  'jobs:',
                  '  test:',
                  '    runs-on: ubuntu-latest',
                  '    steps:',
                  '      - uses: actions/checkout@v4',
                  '      - uses: actions/setup-node@v4',
                  '        with:',
                  "          node-version: '20'",
                  '      - run: npm ci',
                  '      - run: npm test',
                ],
                explanation:
                  'On every push or pull request, a job runs on an Ubuntu runner: it checks out the code, sets up Node 20, installs dependencies with npm ci, and runs the test suite.',
              },
              exercises: [
                {
                  type: 'quiz',
                  prompt: 'In a GitHub Actions step, what is the difference between uses and run?',
                  hint: 'One pulls in a reusable component.',
                  solution: {
                    explanation:
                      'uses runs a reusable action (a packaged unit like actions/checkout); run executes a shell command directly on the runner.',
                  },
                },
                {
                  type: 'task',
                  prompt: 'Write the on: section that triggers a workflow on both push and pull_request events.',
                  solution: {
                    lines: ['on:', '  push:', '  pull_request:'],
                    explanation: 'Listing both events under on makes the workflow run for direct pushes and for pull requests.',
                  },
                },
                {
                  type: 'predict',
                  prompt: 'A workflow omits the actions/checkout step. Predict what happens when a later step runs npm ci.',
                  solution: {
                    explanation:
                      'The repository code is never checked out onto the runner, so npm ci fails (no package files present). Checkout is required before any step that needs the source.',
                  },
                },
              ],
              docs: 'https://docs.github.com/en/actions/writing-workflows/quickstart',
            },
            {
              id: 'do2-t2-c2',
              title: 'Caching, secrets and artifacts',
              summary:
                'Pipelines speed up by caching dependencies, pass build outputs along as artifacts, and handle credentials through a secrets store rather than plain text.',
              explanation:
                'Three practical features make pipelines fast, connected and secure. Caching stores expensive-to-recreate data — typically downloaded dependencies — between runs so jobs do not redownload everything each time; a good cache key invalidates only when the lockfile changes. Artifacts are files a job produces (a built binary, a coverage report, a container image reference) that need to be passed to later jobs or stored for download; the platform uploads and re-downloads them between jobs. Secrets are sensitive values like API tokens and deploy keys that must never be committed to the repository or printed in logs; CI platforms provide an encrypted secrets store, and you reference secrets by name so they are injected as masked environment variables at runtime. Confusing caches with artifacts is a common error: a cache is a performance optimisation that can be rebuilt, while an artifact is a deliberate output you depend on. Treating secrets carelessly — echoing them or hardcoding them — is a serious security risk.',
              analogy:
                'Caching is keeping pantry staples so you do not shop every meal; artifacts are the finished dishes you hand to the next cook; secrets are the safe combination you never write on a sticky note.',
              keyPoints: [
                'Caching reuses dependencies between runs; key on the lockfile to invalidate correctly.',
                'Artifacts are job outputs passed to later jobs or stored for download.',
                'A cache is a rebuildable optimisation; an artifact is a depended-on output.',
                'Secrets live in an encrypted store and are injected as masked variables.',
                'Never commit, echo or hardcode secrets.',
              ],
              code: {
                language: 'yaml',
                lines: [
                  'steps:',
                  '  - uses: actions/checkout@v4',
                  '  - uses: actions/setup-node@v4',
                  '    with:',
                  "      node-version: '20'",
                  "      cache: 'npm'",
                  '  - run: npm ci',
                  '  - run: npm run build',
                  '  - uses: actions/upload-artifact@v4',
                  '    with:',
                  '      name: build-output',
                  '      path: dist',
                  '  - run: ./deploy.sh',
                  '    env:',
                  '      DEPLOY_TOKEN: ${{ secrets.DEPLOY_TOKEN }}',
                ],
                explanation:
                  'The setup step caches npm downloads, the build output is uploaded as an artifact named build-output, and the deploy step reads a token from the encrypted secrets store rather than from plain text.',
              },
              commonMistakes: [
                'Hardcoding API tokens in the workflow file or echoing secrets to logs.',
                'Confusing a cache (rebuildable) with an artifact (a deliberate, depended-on output).',
              ],
              exercises: [
                {
                  type: 'quiz',
                  prompt: 'What is the key difference between a cache and an artifact in a pipeline?',
                  hint: 'One can always be regenerated.',
                  solution: {
                    explanation:
                      'A cache is a performance optimisation that can be rebuilt from scratch if missing; an artifact is a deliberate output that later jobs depend on or that you store for download.',
                  },
                },
                {
                  type: 'quiz',
                  prompt: 'How should a deploy token be provided to a pipeline step?',
                  solution: {
                    explanation:
                      'Through the platform\'s encrypted secrets store, referenced by name and injected as a masked environment variable at runtime — never hardcoded or printed.',
                  },
                },
                {
                  type: 'predict',
                  prompt: 'A cache key is set to a constant string instead of the lockfile hash. Predict the problem.',
                  solution: {
                    explanation:
                      'The cache never invalidates when dependencies change, so jobs may reuse stale dependencies. Keying on the lockfile ensures the cache refreshes exactly when the dependency set changes.',
                  },
                },
              ],
              docs: 'https://docs.github.com/en/actions/security-for-github-actions/security-guides/using-secrets-in-github-actions',
            },
          ],
        },
        {
          id: 'do2-t3',
          name: 'Deployment strategies',
          concepts: [
            {
              id: 'do2-t3-c0',
              title: 'Rolling, blue-green and canary',
              summary:
                'Different strategies control how a new version replaces the old. Rolling updates instances gradually, blue-green switches between two full environments, and canary exposes the new version to a small slice of traffic first.',
              explanation:
                'The way you roll out a new version trades off speed, resource cost and risk. A rolling deployment replaces instances of the old version with the new one a few at a time, so capacity stays roughly constant and there is no big switch, but during the rollout both versions run together. Blue-green keeps two complete environments — blue (current) and green (new) — deploys to the idle one, tests it, then flips all traffic over at once; rollback is instant because you just flip back, at the cost of running two environments. Canary deployment releases the new version to a small percentage of users first, watches metrics, and gradually increases the share if it stays healthy, limiting the blast radius of a bad release. Choosing among them depends on your tolerance for risk, your infrastructure cost budget and whether your application can run two versions simultaneously. All three aim to make releases safer than a single all-at-once cutover.',
              analogy:
                'Rolling is repainting a fence plank by plank; blue-green is building a whole second fence and swapping which one faces the street; canary is showing a new flavour to a few customers before stocking the whole shelf.',
              keyPoints: [
                'Rolling: replace instances gradually; both versions run during rollout.',
                'Blue-green: two full environments; flip all traffic at once with instant rollback.',
                'Canary: send a small traffic slice to the new version, watch metrics, then expand.',
                'The choice trades off risk, cost and whether two versions can coexist.',
                'All reduce risk compared with an all-at-once cutover.',
              ],
              diagram: {
                type: 'mermaid',
                lines: [
                  'flowchart LR',
                  '  LB[Load balancer] --> Old[Old version 95 percent]',
                  '  LB --> Canary[New version 5 percent]',
                  '  Canary --> Watch[Watch metrics] --> Expand[Increase share]',
                ],
                caption: 'A canary release sends a small slice of traffic to the new version and expands only if metrics stay healthy.',
              },
              exercises: [
                {
                  type: 'quiz',
                  prompt: 'What makes rollback in a blue-green deployment so fast?',
                  hint: 'Both environments still exist.',
                  solution: {
                    explanation:
                      'The previous environment is still running untouched, so rolling back is just flipping traffic back to it — no rebuild or redeploy needed.',
                  },
                },
                {
                  type: 'quiz',
                  prompt: 'What is the main benefit of a canary deployment?',
                  solution: {
                    explanation:
                      'It limits the blast radius: only a small percentage of users see the new version first, so a bad release affects few people and can be caught from metrics before full rollout.',
                  },
                },
                {
                  type: 'predict',
                  prompt: 'An app cannot tolerate two versions writing to the same database schema at once. Predict which strategy is risky and why.',
                  solution: {
                    explanation:
                      'Rolling and canary are risky because both versions run simultaneously and may write incompatible data. A blue-green flip (with a compatible schema) or careful backward-compatible changes are safer.',
                  },
                },
              ],
              docs: 'https://kubernetes.io/docs/concepts/workloads/controllers/deployment/#strategy',
            },
            {
              id: 'do2-t3-c1',
              title: 'Feature flags and rollbacks',
              summary:
                'Feature flags decouple deploying code from releasing functionality, letting you turn features on or off at runtime. A reliable rollback path lets you recover quickly when a release goes wrong.',
              explanation:
                'A feature flag is a runtime switch that gates a piece of functionality, so you can deploy code to production with the feature turned off and enable it later — for everyone, for a percentage of users, or for an internal group. This separation of deploy from release is powerful: it enables trunk-based development (merge unfinished work safely), gradual rollouts, A/B experiments and instant disabling of a misbehaving feature without redeploying. Rollback is the complementary safety net for when something does break. The cleanest rollbacks redeploy a previous known-good artifact, which is reliable precisely because you built once and kept the old immutable artifact available. Flags add a faster, finer option: just toggle the bad feature off in milliseconds. Teams should decide rollback strategy in advance and practise it, because the middle of an incident is the worst time to discover that rolling back is hard. The combination of flags and a rehearsed rollback path turns scary releases into reversible, low-stress events.',
              analogy:
                'A feature flag is a light switch wired but turned off until you are ready; a rollback is the spare key that lets you undo a mistake without rebuilding the whole lock.',
              keyPoints: [
                'A feature flag gates functionality with a runtime on/off switch.',
                'Flags decouple deploying code from releasing the feature.',
                'They enable gradual rollouts, experiments and instant kill-switches.',
                'Cleanest rollback redeploys a previous known-good immutable artifact.',
                'Decide and rehearse rollback before an incident, not during one.',
              ],
              diagram: {
                type: 'mermaid',
                lines: [
                  'flowchart LR',
                  '  Deploy[Deploy code with flag off] --> Enable[Enable for ten percent]',
                  '  Enable --> Healthy[Metrics healthy]',
                  '  Healthy --> Full[Enable for everyone]',
                  '  Enable --> Bad[Problem detected] --> Off[Toggle flag off]',
                ],
                caption: 'A flag lets you enable a feature gradually and instantly disable it if something goes wrong.',
              },
              commonMistakes: [
                'Letting old feature flags accumulate forever, creating tangled conditional code (flag debt).',
                'Having no tested rollback plan, so recovery is improvised during an incident.',
              ],
              exercises: [
                {
                  type: 'quiz',
                  prompt: 'What does "decoupling deploy from release" mean with feature flags?',
                  hint: 'Code can be in production but not active.',
                  solution: {
                    explanation:
                      'Code can be deployed to production with the feature turned off, then released by flipping the flag later — independently of the deployment itself.',
                  },
                },
                {
                  type: 'quiz',
                  prompt: 'Why is redeploying a previous immutable artifact a reliable rollback method?',
                  solution: {
                    explanation:
                      'Because the old artifact is the exact, tested version that worked before. Since you built once and kept it, redeploying it restores a known-good state without rebuilding.',
                  },
                },
                {
                  type: 'predict',
                  prompt: 'A team never removes old feature flags. Predict the long-term effect on the codebase.',
                  solution: {
                    explanation:
                      'Conditional flag logic accumulates into "flag debt" — tangled branches that are hard to reason about and test, increasing complexity and bug risk over time.',
                  },
                },
              ],
              docs: 'https://launchdarkly.com/blog/what-are-feature-flags/',
            },
          ],
        },
      ],
    },
    /* ───────────────────── LEVEL 3 — INFRASTRUCTURE AS CODE ───────────────────── */
    {
      level: 3,
      name: 'Infrastructure as Code',
      focus: 'Defining infrastructure declaratively, reproducibly and at scale',
      accent: '#f97316',
      soft: '#fff0e6',
      topics: [
        {
          id: 'do3-t0',
          name: 'IaC concepts',
          concepts: [
            {
              id: 'do3-t0-c0',
              title: 'Declarative vs imperative infrastructure',
              summary:
                'Infrastructure as code defines your servers, networks and services in version-controlled files. Declarative tools describe the desired end state, while imperative ones list the steps to get there.',
              explanation:
                'Infrastructure as code (IaC) means managing infrastructure through machine-readable definition files instead of manual console clicks or ad-hoc scripts. Those files live in version control, so infrastructure gets the same review, history and reproducibility as application code. Within IaC there are two styles. The imperative style describes the steps to reach a result — create this server, then attach this disk, then open this port — much like a shell script. The declarative style describes the desired final state — there should be three servers with this disk and this port open — and lets the tool figure out the actions needed to reach it. Declarative is generally preferred for infrastructure because the same definition produces the same result no matter the current state, and the tool can compute the difference and only change what is needed. Tools like Terraform and Kubernetes manifests are declarative; a provisioning bash script is imperative.',
              analogy:
                'Imperative is turn-by-turn driving directions; declarative is giving the destination address and letting the GPS work out the route from wherever you are.',
              keyPoints: [
                'IaC manages infrastructure through version-controlled definition files.',
                'Imperative describes the steps; declarative describes the desired end state.',
                'Declarative tools compute the diff and change only what is needed.',
                'Declarative is preferred because the same file yields the same result.',
                'Terraform and Kubernetes manifests are declarative; a setup script is imperative.',
              ],
              diagram: {
                type: 'mermaid',
                lines: [
                  'flowchart LR',
                  '  Desired[Desired state file] --> Tool[IaC tool]',
                  '  Current[Current state] --> Tool',
                  '  Tool --> Diff[Compute difference]',
                  '  Diff --> Apply[Apply only changes]',
                ],
                caption: 'A declarative tool compares desired state to current state and applies only the difference.',
              },
              exercises: [
                {
                  type: 'quiz',
                  prompt: 'How does declarative IaC differ from imperative IaC?',
                  hint: 'One says what, the other says how.',
                  solution: {
                    explanation:
                      'Declarative describes the desired end state and lets the tool decide the actions; imperative lists the explicit steps to perform, like a script.',
                  },
                },
                {
                  type: 'quiz',
                  prompt: 'Why does putting infrastructure definitions in version control matter?',
                  solution: {
                    explanation:
                      'It gives infrastructure the same review, history, reproducibility and rollback ability as application code, instead of relying on manual, untracked changes.',
                  },
                },
                {
                  type: 'predict',
                  prompt: 'Two engineers run the same declarative definition against environments in different starting states. Predict the resulting end states.',
                  solution: {
                    explanation:
                      'Both converge to the same desired end state. The tool computes whatever changes each environment needs to match the declaration, regardless of starting point.',
                  },
                },
              ],
              docs: 'https://www.terraform.io/use-cases/infrastructure-as-code',
            },
            {
              id: 'do3-t0-c1',
              title: 'Idempotency, state and drift',
              summary:
                'Idempotency means running the same definition repeatedly yields the same result. State tracks what the tool has created, and drift is when reality diverges from the recorded state.',
              explanation:
                'Three concepts are essential to using IaC safely. Idempotency means applying a definition any number of times produces the same outcome — the first run creates resources and later runs make no changes because the desired state already matches. This is what makes IaC safe to run repeatedly. To know what already exists, a tool keeps state: a record mapping your definitions to the real resources it created, so it can tell what to add, change or destroy. Terraform, for example, stores this in a state file. Drift happens when the real infrastructure changes outside the tool — someone edits a setting in the cloud console — so reality no longer matches the recorded state. Drift is dangerous because the next apply may try to revert the manual change or behave unexpectedly. The disciplined approach is to make all changes through the IaC tool, detect drift with a plan or refresh, and avoid out-of-band edits. Understanding state and drift is what separates reliable IaC from surprising, destructive runs.',
              analogy:
                'State is the inventory list of what you have built; drift is someone secretly moving furniture so the list no longer matches the room; idempotency is being able to re-run the blueprint without rebuilding what is already correct.',
              keyPoints: [
                'Idempotency: repeated applies produce the same result, no needless changes.',
                'State records which real resources correspond to your definitions.',
                'Drift is when real infrastructure diverges from the recorded state.',
                'Drift usually comes from manual, out-of-band changes.',
                'Make all changes through the tool and detect drift before applying.',
              ],
              commonMistakes: [
                'Making manual console changes to IaC-managed resources, causing drift.',
                'Storing state insecurely or letting two people apply at once, corrupting it.',
              ],
              exercises: [
                {
                  type: 'quiz',
                  prompt: 'What does idempotency guarantee about running an IaC definition multiple times?',
                  hint: 'Think about the second and third runs.',
                  solution: {
                    explanation:
                      'It guarantees the same end result each time. After the first run creates resources, later runs make no changes because the desired state already matches reality.',
                  },
                },
                {
                  type: 'quiz',
                  prompt: 'What causes drift and why is it dangerous?',
                  solution: {
                    explanation:
                      'Drift is caused by changing real infrastructure outside the IaC tool (for example, editing in the console). It is dangerous because the next apply may revert the change or behave unexpectedly, since reality no longer matches the recorded state.',
                  },
                },
                {
                  type: 'predict',
                  prompt: 'Someone manually opens a firewall port on a Terraform-managed resource. Predict what happens on the next terraform apply.',
                  solution: {
                    explanation:
                      'Terraform sees drift between the state and reality and, since the definition does not include that port, plans to remove it — reverting the manual change unless the definition is updated.',
                  },
                },
              ],
              docs: 'https://developer.hashicorp.com/terraform/language/state',
            },
          ],
        },
        {
          id: 'do3-t1',
          name: 'Terraform',
          concepts: [
            {
              id: 'do3-t1-c0',
              title: 'Providers, resources and variables',
              summary:
                'Terraform uses providers to talk to platforms, resources to declare infrastructure objects, and variables to parameterise configurations for reuse across environments.',
              explanation:
                'Terraform is a popular declarative IaC tool that works across many platforms through plugins called providers. A provider (such as aws, google or azurerm) knows how to create and manage resources on a specific platform and exposes them to your configuration. A resource block declares one piece of infrastructure — a virtual machine, a bucket, a DNS record — with a type and a set of arguments describing its desired settings. Variables let you parameterise a configuration so the same code can serve dev and prod by changing inputs like region or instance size, rather than duplicating files. Outputs expose useful values (like an IP address) after apply. Written in HashiCorp Configuration Language (HCL), a Terraform configuration reads as a set of declarations: which providers to use, which resources to create, and which variables tune them. This composition of providers, resources and variables is the heart of every Terraform project.',
              keyPoints: [
                'Providers are plugins that let Terraform manage a specific platform.',
                'A resource block declares one infrastructure object and its settings.',
                'Variables parameterise configs so one codebase serves many environments.',
                'Outputs expose computed values after an apply.',
                'Configurations are written in HCL as a set of declarations.',
              ],
              code: {
                language: 'hcl',
                lines: [
                  'provider "aws" {',
                  '  region = var.region',
                  '}',
                  '',
                  'variable "region" {',
                  '  type    = string',
                  '  default = "eu-west-1"',
                  '}',
                  '',
                  'resource "aws_s3_bucket" "assets" {',
                  '  bucket = "my-app-assets"',
                  '}',
                  '',
                  'output "bucket_name" {',
                  '  value = aws_s3_bucket.assets.bucket',
                  '}',
                ],
                explanation:
                  'The aws provider is configured with a region variable, a resource declares an S3 bucket, and an output exposes the resulting bucket name after apply.',
              },
              exercises: [
                {
                  type: 'quiz',
                  prompt: 'What is the role of a Terraform provider?',
                  hint: 'It connects Terraform to a platform.',
                  solution: {
                    explanation:
                      'A provider is a plugin that knows how to create and manage resources on a specific platform (such as AWS or Google Cloud) and exposes those resource types to your configuration.',
                  },
                },
                {
                  type: 'task',
                  prompt: 'Write a Terraform variable block named instance_size of type string with a default of t3.micro.',
                  solution: {
                    lines: ['variable "instance_size" {', '  type    = string', '  default = "t3.micro"', '}'],
                    explanation: 'Variables parameterise the configuration so the same code can be reused with different inputs per environment.',
                  },
                },
                {
                  type: 'predict',
                  prompt: 'You reference var.region but never declare a variable block or pass a value, and there is no default. Predict what Terraform does.',
                  solution: {
                    explanation:
                      'Terraform will prompt for the value (or fail in non-interactive mode) because the variable has no value or default. Declaring it with a default or passing a value avoids this.',
                  },
                },
              ],
              docs: 'https://developer.hashicorp.com/terraform/language/resources/syntax',
            },
            {
              id: 'do3-t1-c1',
              title: 'Plan, apply and state management',
              summary:
                'The Terraform workflow is init, plan then apply. Plan shows the changes before they happen, and the state file must be stored and locked carefully, especially in teams.',
              explanation:
                'The core Terraform workflow has three commands. terraform init downloads the providers and prepares the working directory. terraform plan compares your configuration to the recorded state and the real world, then prints exactly what it would create, change or destroy — a crucial dry run that lets you review changes before they happen. terraform apply executes that plan, making the actual changes and updating the state. The state file is sensitive and central: it maps your config to real resources and can contain secrets, so it should never be committed to git. In teams, state is kept in a remote backend (such as an S3 bucket with locking via DynamoDB, or Terraform Cloud) so everyone shares one source of truth, and locking prevents two people from applying simultaneously and corrupting it. Always reading the plan before applying, and protecting and locking remote state, are the habits that keep Terraform safe in practice. Skipping the plan or sharing state via a local file are classic ways to cause outages.',
              analogy:
                'Plan is the contractor showing you the renovation drawings and a list of what gets torn down before any wall is touched; apply is the demolition and building crew acting on the approved plan.',
              keyPoints: [
                'Workflow: init (prepare), plan (preview changes), apply (make them).',
                'Plan is a dry run showing exactly what will be created, changed or destroyed.',
                'State maps config to real resources and may contain secrets — never commit it.',
                'Teams use a remote backend with locking for shared, safe state.',
                'Always review the plan before applying.',
              ],
              code: {
                language: 'bash',
                lines: [
                  'terraform init      # download providers and set up the backend',
                  'terraform plan      # preview the changes without applying',
                  'terraform apply     # apply the reviewed plan and update state',
                ],
                explanation:
                  'Run init once per setup, then plan to review changes, then apply to enact them. The plan step is your safety check before anything real changes.',
              },
              commonMistakes: [
                'Committing the state file to git, exposing secrets and risking corruption.',
                'Running apply without reading the plan, then being surprised by destroyed resources.',
              ],
              exercises: [
                {
                  type: 'quiz',
                  prompt: 'Why is terraform plan an important step before apply?',
                  hint: 'It is a dry run.',
                  solution: {
                    explanation:
                      'Plan previews exactly what will be created, changed or destroyed without making any real changes, so you can catch unintended or destructive actions before they happen.',
                  },
                },
                {
                  type: 'quiz',
                  prompt: 'Why should the Terraform state file not be committed to git and how is it shared in teams?',
                  solution: {
                    explanation:
                      'State can contain secrets and is easily corrupted. Teams use a remote backend with locking (such as S3 with DynamoDB or Terraform Cloud) so everyone shares one locked source of truth.',
                  },
                },
                {
                  type: 'predict',
                  prompt: 'Two engineers run terraform apply at the same time against the same local state file. Predict the risk.',
                  solution: {
                    explanation:
                      'Without locking, simultaneous applies can corrupt the state file or create conflicting changes, leaving Terraform unable to reconcile reality with state. Remote state with locking prevents this.',
                  },
                },
              ],
              docs: 'https://developer.hashicorp.com/terraform/cli/commands/plan',
            },
            {
              id: 'do3-t1-c2',
              title: 'Modules for reuse',
              summary:
                'A Terraform module is a reusable package of configuration with inputs and outputs. Modules let you define a pattern once and instantiate it many times.',
              explanation:
                'As infrastructure grows, copying and pasting resource blocks becomes unmanageable. A module is a container for a set of resources that you can call repeatedly, much like a function in programming: it takes input variables, creates resources, and exposes outputs. The configuration in your root directory is itself the root module, and it can call child modules — your own, or shared ones from the Terraform Registry. For example, a "web service" module might bundle a load balancer, instances and security rules, and you instantiate it for each environment or service by passing different inputs. Modules promote consistency (everyone uses the same vetted pattern), reduce duplication and make large codebases comprehensible. Good modules have a clear, minimal interface of inputs and outputs and hide internal complexity. Overusing tiny modules or building overly clever ones can backfire, so apply them where a pattern genuinely repeats.',
              analogy:
                'A module is a cookie cutter: define the shape once, then stamp out as many consistent cookies as you need by varying the dough (inputs).',
              keyPoints: [
                'A module is a reusable package of resources with inputs and outputs.',
                'It works like a function: inputs in, resources created, outputs out.',
                'The root directory is the root module; it can call child modules.',
                'Modules reduce duplication and enforce consistent patterns.',
                'Use modules where a pattern genuinely repeats, not everywhere.',
              ],
              code: {
                language: 'hcl',
                lines: [
                  'module "web" {',
                  '  source        = "./modules/web-service"',
                  '  instance_size = "t3.small"',
                  '  desired_count = 3',
                  '}',
                  '',
                  'output "web_url" {',
                  '  value = module.web.url',
                  '}',
                ],
                explanation:
                  'The root configuration calls a reusable web-service module with specific inputs and reads its output, so the same pattern can be reused with different values elsewhere.',
              },
              exercises: [
                {
                  type: 'quiz',
                  prompt: 'A Terraform module is analogous to what programming construct, and why?',
                  hint: 'Inputs, work, outputs.',
                  solution: {
                    explanation:
                      'A function. It takes input variables, performs work (creates resources) and returns outputs, so it can be reused with different inputs while hiding internal detail.',
                  },
                },
                {
                  type: 'quiz',
                  prompt: 'Name two benefits of using modules in a large Terraform codebase.',
                  solution: {
                    explanation:
                      'They reduce duplication by defining a pattern once, and they enforce consistency because everyone instantiates the same vetted module rather than copying resource blocks.',
                  },
                },
                {
                  type: 'task',
                  prompt: 'Write a module block that uses a local module at ./modules/db and passes an input named engine set to postgres.',
                  solution: {
                    lines: ['module "db" {', '  source = "./modules/db"', '  engine = "postgres"', '}'],
                    explanation: 'The source points at the module directory and inputs are passed as arguments inside the block.',
                  },
                },
              ],
              docs: 'https://developer.hashicorp.com/terraform/language/modules',
            },
          ],
        },
        {
          id: 'do3-t2',
          name: 'Configuration management and immutable infra',
          concepts: [
            {
              id: 'do3-t2-c0',
              title: 'Ansible playbooks',
              summary:
                'Ansible configures existing servers by running tasks defined in YAML playbooks over SSH. It is agentless and aims to be idempotent.',
              explanation:
                'Where Terraform typically provisions the infrastructure itself, configuration management tools like Ansible install software and configure the operating system on servers that already exist. Ansible is agentless: it connects to target machines over SSH and runs modules, so there is nothing to install on the hosts beyond Python. You describe the desired configuration in a playbook — a YAML file listing plays that target groups of hosts and contain tasks, each invoking a module like apt, copy or service. Crucially, well-written Ansible tasks are idempotent: a module checks the current state and only acts if a change is needed, so running a playbook twice is safe and the second run reports no changes. An inventory file lists the hosts and groups the playbook targets. Ansible is widely used for installing packages, managing config files and orchestrating multi-step rollouts in a readable, repeatable way. The mental model is desired state expressed as ordered tasks applied to inventory.',
              analogy:
                'Ansible is like a checklist a butler runs through each room: it checks each item and only fixes what is out of place, so re-running the checklist changes nothing already correct.',
              keyPoints: [
                'Ansible configures existing servers, complementing infra provisioning tools.',
                'It is agentless, connecting over SSH and running modules.',
                'Playbooks are YAML files of plays containing tasks that call modules.',
                'Well-written tasks are idempotent: re-running makes no needless changes.',
                'An inventory file lists the hosts and groups to target.',
              ],
              code: {
                language: 'yaml',
                lines: [
                  '- name: Configure web servers',
                  '  hosts: webservers',
                  '  become: true',
                  '  tasks:',
                  '    - name: Ensure nginx is installed',
                  '      apt:',
                  '        name: nginx',
                  '        state: present',
                  '    - name: Ensure nginx is running',
                  '      service:',
                  '        name: nginx',
                  '        state: started',
                  '        enabled: true',
                ],
                explanation:
                  'This play targets the webservers group, installs nginx if absent and ensures the service is running and enabled — and re-running it changes nothing once the state matches.',
              },
              commonMistakes: [
                'Using the shell or command module for everything, losing idempotency.',
                'Hardcoding host addresses in playbooks instead of using an inventory.',
              ],
              exercises: [
                {
                  type: 'quiz',
                  prompt: 'What does it mean that Ansible is "agentless"?',
                  hint: 'How does it reach the target machines?',
                  solution: {
                    explanation:
                      'It connects to target hosts over SSH and runs modules without requiring a permanent agent installed on them (beyond Python), so there is no extra daemon to manage on the hosts.',
                  },
                },
                {
                  type: 'quiz',
                  prompt: 'Why is idempotency important for an Ansible playbook?',
                  solution: {
                    explanation:
                      'Because it makes re-running the playbook safe. Each task checks current state and only changes what is needed, so a second run reports no changes rather than re-doing work or breaking things.',
                  },
                },
                {
                  type: 'predict',
                  prompt: 'You replace the apt module with a raw shell command that always runs "apt-get install nginx". Predict the effect on idempotency.',
                  solution: {
                    explanation:
                      'Idempotency is lost (or at least obscured): the shell command runs every time and Ansible cannot reliably report whether a change occurred, unlike the apt module which only acts when needed.',
                  },
                },
              ],
              docs: 'https://docs.ansible.com/ansible/latest/playbook_guide/playbooks_intro.html',
            },
            {
              id: 'do3-t2-c1',
              title: 'Immutable infrastructure and golden images',
              summary:
                'Immutable infrastructure means you never modify a running server; instead you build a new image and replace the old instance. Tools like Packer bake golden images for this.',
              explanation:
                'There are two philosophies for managing servers. The mutable approach keeps long-lived servers and changes them in place over time, which leads to "snowflake" servers that each drift into a unique, undocumented state. The immutable approach treats servers as disposable: to make a change you build a brand-new machine image with the change baked in, deploy fresh instances from it, and discard the old ones — you never patch a running server. A golden image is that pre-built, fully configured image, and Packer is a common tool for building golden images automatically from a definition. Immutable infrastructure dramatically improves consistency and reliability because every instance is identical and reproducible from code, drift is eliminated, and rollback is simply redeploying the previous image. It pairs naturally with autoscaling and containers. The trade-off is that every change requires building and rolling out a new image, so fast image builds and good pipelines matter. This is often summarised as treating servers like cattle, not pets.',
              analogy:
                'Mutable servers are like an old car you keep patching until only you understand its quirks; immutable infrastructure is leasing identical new cars and swapping the whole vehicle when you need a change.',
              keyPoints: [
                'Immutable infra never modifies a running server; it replaces it with a new image.',
                'A golden image is a pre-built, fully configured machine image.',
                'Packer builds golden images automatically from a definition.',
                'Benefits: consistency, no drift, simple rollback by redeploying the old image.',
                'Summed up as treating servers like cattle, not pets.',
              ],
              diagram: {
                type: 'mermaid',
                lines: [
                  'flowchart LR',
                  '  Def[Image definition] --> Packer',
                  '  Packer --> Image[Golden image]',
                  '  Image --> New[Launch new instances]',
                  '  New --> Old[Terminate old instances]',
                ],
                caption: 'Changes produce a new golden image; fresh instances replace old ones rather than being patched.',
              },
              exercises: [
                {
                  type: 'quiz',
                  prompt: 'In immutable infrastructure, how do you apply a change to a server?',
                  hint: 'You do not patch the running one.',
                  solution: {
                    explanation:
                      'You build a new image with the change baked in, launch fresh instances from it, and discard the old ones — running servers are never modified in place.',
                  },
                },
                {
                  type: 'quiz',
                  prompt: 'What is a "snowflake" server and why is it a problem?',
                  solution: {
                    explanation:
                      'A snowflake is a long-lived, manually-modified server that has drifted into a unique, undocumented state. It is hard to reproduce, debug or replace, undermining reliability.',
                  },
                },
                {
                  type: 'predict',
                  prompt: 'A team adopts immutable infrastructure but image builds take an hour. Predict the operational impact.',
                  solution: {
                    explanation:
                      'Every change becomes slow to roll out because each one requires a fresh image build, hurting deployment frequency. Fast image builds and good pipelines are needed to make immutable infra practical.',
                  },
                },
              ],
              docs: 'https://developer.hashicorp.com/packer/docs/intro',
            },
            {
              id: 'do3-t2-c2',
              title: 'Push vs pull configuration models',
              summary:
                'Configuration can be pushed from a central controller to nodes, or pulled by agents on each node from a central source. Each model has trade-offs in scale and control.',
              explanation:
                'Configuration management systems distribute desired state in one of two directions. In the push model, a central machine connects out to the target nodes and applies the configuration on demand — Ansible is the classic example, pushing over SSH when you run a playbook. In the pull model, each node runs an agent that periodically fetches the latest desired state from a central server and applies it itself — tools like Puppet and Chef traditionally work this way. Push gives precise, on-demand control and is simple to start with, but the controller must reach every node and orchestration can strain at very large fleets. Pull scales well because thousands of nodes independently pull on their own schedule and self-heal toward desired state, but you give up some immediacy and must run agents. Many modern setups blend ideas, and the GitOps pattern is a pull-based variant where agents in a cluster continuously reconcile to a desired state stored in Git. Choosing a model depends on fleet size, how immediate you need changes to be and your tolerance for running agents.',
              analogy:
                'Push is a manager walking to each desk to hand out instructions; pull is each employee checking the company noticeboard regularly and updating themselves.',
              keyPoints: [
                'Push: a central controller connects to nodes and applies config on demand.',
                'Pull: agents on each node periodically fetch and apply desired state.',
                'Push gives on-demand control but can strain at very large scale.',
                'Pull scales well and self-heals but needs agents and is less immediate.',
                'GitOps is a pull-based pattern reconciling to state stored in Git.',
              ],
              diagram: {
                type: 'mermaid',
                lines: [
                  'flowchart LR',
                  '  subgraph Push',
                  '    Ctrl[Controller] --> N1[Node]',
                  '    Ctrl --> N2[Node]',
                  '  end',
                  '  subgraph Pull',
                  '    Src[Central source] --> A1[Agent pulls]',
                  '    Src --> A2[Agent pulls]',
                  '  end',
                ],
                caption: 'Push sends config out from a controller; pull has agents fetch config themselves.',
              },
              exercises: [
                {
                  type: 'quiz',
                  prompt: 'Describe the difference between push and pull configuration models.',
                  hint: 'Who initiates the change?',
                  solution: {
                    explanation:
                      'In push, a central controller initiates and sends configuration to nodes on demand. In pull, agents on each node initiate by periodically fetching and applying the latest desired state themselves.',
                  },
                },
                {
                  type: 'quiz',
                  prompt: 'Why does the pull model tend to scale better to very large fleets?',
                  solution: {
                    explanation:
                      'Each node independently pulls and applies on its own schedule and self-heals toward desired state, so there is no central controller needing to reach every node at once.',
                  },
                },
                {
                  type: 'predict',
                  prompt: 'A push-based tool must reconfigure 50,000 nodes within minutes from one controller. Predict the likely bottleneck.',
                  solution: {
                    explanation:
                      'The single controller becomes a bottleneck trying to connect to and orchestrate tens of thousands of nodes at once. A pull model, where nodes fetch independently, would scale more gracefully.',
                  },
                },
              ],
              docs: 'https://www.redhat.com/en/topics/automation/what-is-configuration-management',
            },
          ],
        },
      ],
    },
    /* ───────────────────── LEVEL 4 — CONTAINERS AND CLOUD DELIVERY ───────────────────── */
    {
      level: 4,
      name: 'Containers and Cloud Delivery',
      focus: 'Packaging, orchestrating and architecting applications for modern delivery',
      accent: '#f97316',
      soft: '#fff0e6',
      topics: [
        {
          id: 'do4-t0',
          name: 'Containers in DevOps',
          concepts: [
            {
              id: 'do4-t0-c0',
              title: 'Container images as artifacts',
              summary:
                'A container packages an application with its dependencies into a portable image that runs the same everywhere. The image is a perfect build-once artifact for CI/CD.',
              explanation:
                'A container bundles your application together with its runtime, libraries and dependencies into a single image, isolated from the host using operating-system features. Because everything the app needs is inside the image, it runs identically on a laptop, a CI runner and production — eliminating the classic "works on my machine" problem. You define the image in a Dockerfile, build it once, and that immutable image becomes the artifact you promote through every environment, which fits the build-once-deploy-many principle perfectly. Images are layered: each instruction adds a layer, and layers are cached and shared, making builds and transfers efficient. Crucially, containers are lightweight compared with virtual machines because they share the host kernel rather than running a full guest OS, so they start in seconds and pack densely onto a host. For DevOps this means fast, reproducible builds and a uniform unit of deployment across the whole pipeline.',
              analogy:
                'A container image is like a shipping container: pack your goods once and any ship, train or truck can carry it identically, regardless of what is inside.',
              keyPoints: [
                'A container bundles an app with all its dependencies into one image.',
                'Images run identically across laptop, CI and production.',
                'The immutable image is the build-once artifact promoted through environments.',
                'Images are layered, so builds and transfers are cached and efficient.',
                'Containers share the host kernel, so they are lighter than full VMs.',
              ],
              code: {
                language: 'bash',
                lines: [
                  '# A minimal Dockerfile-style build and run',
                  'docker build -t myapp:1.0 .   # build the image once',
                  'docker run -p 8080:8080 myapp:1.0  # run it anywhere',
                ],
                explanation:
                  'docker build produces an immutable image tagged myapp:1.0 from the Dockerfile; docker run starts a container from that exact image, which behaves the same on any host.',
              },
              exercises: [
                {
                  type: 'quiz',
                  prompt: 'Why does a container image help solve the "works on my machine" problem?',
                  hint: 'What is packaged inside it?',
                  solution: {
                    explanation:
                      'The image bundles the app with all its dependencies and runtime, so it runs identically everywhere — laptop, CI and production — removing environment differences.',
                  },
                },
                {
                  type: 'quiz',
                  prompt: 'Why are containers lighter than virtual machines?',
                  solution: {
                    explanation:
                      'Containers share the host operating-system kernel rather than running a full guest OS, so they use less resource, start in seconds and pack more densely onto a host.',
                  },
                },
                {
                  type: 'predict',
                  prompt: 'A team rebuilds the container image separately for staging and production. Predict the risk relative to build-once principles.',
                  solution: {
                    explanation:
                      'The two builds could differ (different base layers or dependency versions), so staging and production would not be identical — defeating the build-once advantage. Building one image and promoting it avoids this.',
                  },
                },
              ],
              docs: 'https://docs.docker.com/get-started/docker-overview/',
            },
            {
              id: 'do4-t0-c1',
              title: 'Registries and why containers fit CI/CD',
              summary:
                'A container registry stores and distributes images by tag and digest. Containers fit CI/CD because they are immutable, portable, fast to start and trivially versioned.',
              explanation:
                'Once CI builds an image, it pushes it to a container registry — a service like Docker Hub, GitHub Container Registry or a cloud provider\'s registry — which stores images and serves them to whoever needs to run them. Images are referenced by a tag (a human-friendly label like 1.0 or latest) and, more reliably, by a content digest (a hash that pins the exact bytes). Pinning by digest guarantees you run precisely the tested image, since tags can be moved. Containers fit CI/CD beautifully for several reasons: the image is immutable so the artifact tested is the artifact deployed; it is portable so every stage uses the same unit; it starts fast so rollouts and rollbacks are quick; and tagging gives natural, cheap versioning and instant rollback by deploying a previous tag or digest. The registry becomes the hub between build and run, the place where artifacts live between the CI pipeline that produces them and the orchestrator that runs them.',
              analogy:
                'A registry is like an app store for your images: CI publishes a versioned build, and any environment installs the exact version it needs by name and version.',
              keyPoints: [
                'A registry stores and distributes container images.',
                'Images are referenced by tag (movable) and by digest (an exact hash).',
                'Pinning by digest guarantees you run the exact tested image.',
                'Containers are immutable, portable and fast to start — ideal for pipelines.',
                'Rollback is deploying a previous tag or digest.',
              ],
              diagram: {
                type: 'mermaid',
                lines: [
                  'flowchart LR',
                  '  CI[CI builds image] --> Push[Push to registry]',
                  '  Push --> Registry[(Container registry)]',
                  '  Registry --> Pull[Orchestrator pulls image]',
                  '  Pull --> Run[Run container]',
                ],
                caption: 'The registry sits between the CI pipeline that builds images and the platform that runs them.',
              },
              commonMistakes: [
                'Deploying by the latest tag, so different environments silently run different images.',
                'Never cleaning old images, letting registry storage and costs balloon.',
              ],
              exercises: [
                {
                  type: 'quiz',
                  prompt: 'What is the difference between referencing an image by tag versus by digest?',
                  hint: 'One can be moved to point elsewhere.',
                  solution: {
                    explanation:
                      'A tag is a movable label (like 1.0 or latest) that can be repointed to a different image; a digest is a content hash that always identifies the exact same image bytes. Digests give reproducibility.',
                  },
                },
                {
                  type: 'quiz',
                  prompt: 'Give two reasons containers fit continuous delivery well.',
                  solution: {
                    explanation:
                      'They are immutable (the tested artifact is exactly what deploys) and portable (the same unit runs in every stage); they also start fast and version cheaply via tags, enabling quick rollouts and rollbacks.',
                  },
                },
                {
                  type: 'predict',
                  prompt: 'Production is pinned to the latest tag, and someone pushes a new latest. Predict what happens on the next deploy or restart.',
                  solution: {
                    explanation:
                      'The environment may pull the newly-pushed latest image, silently running untested code. Pinning by an immutable digest or specific version tag prevents this surprise.',
                  },
                },
              ],
              docs: 'https://docs.docker.com/get-started/docker-concepts/the-basics/what-is-a-registry/',
            },
          ],
        },
        {
          id: 'do4-t1',
          name: 'Orchestration and cloud',
          concepts: [
            {
              id: 'do4-t1-c0',
              title: 'The role of Kubernetes',
              summary:
                'Kubernetes orchestrates containers across a cluster of machines, handling scheduling, scaling, self-healing and networking. It declaratively maintains your desired state.',
              explanation:
                'Running a few containers by hand is easy; running hundreds across many machines, keeping them healthy and updated, is not. Kubernetes is an orchestrator that manages containerised workloads across a cluster. You declare the desired state — for example, run five replicas of this image with this configuration — and Kubernetes continuously works to make reality match: it schedules containers onto nodes, restarts ones that crash (self-healing), scales replicas up or down, and routes traffic to healthy instances. Its core unit is the pod (one or more containers sharing a network namespace), managed by higher-level objects like Deployments, and exposed through Services. The control plane holds the desired state and a set of controllers reconcile toward it, embodying the declarative, idempotent model from earlier. Kubernetes is powerful but complex, so teams weigh whether they need it; for many, a managed Kubernetes service or a simpler platform is the right call. Its value in DevOps is automating the operational toil of running containers reliably at scale.',
              analogy:
                'Kubernetes is like an air-traffic controller for containers: you say how many planes should be in the air and where, and it constantly schedules, reroutes and replaces them to keep that true.',
              keyPoints: [
                'Kubernetes orchestrates containers across a cluster of machines.',
                'You declare desired state; it continuously reconciles reality to match.',
                'It handles scheduling, scaling, self-healing and traffic routing.',
                'Core objects: pods, Deployments and Services managed by the control plane.',
                'It is powerful but complex; managed services reduce the operational burden.',
              ],
              diagram: {
                type: 'mermaid',
                lines: [
                  'flowchart LR',
                  '  Desired[Desired state] --> CP[Control plane]',
                  '  CP --> Sched[Schedule pods]',
                  '  Sched --> Nodes[Worker nodes]',
                  '  Nodes --> Heal[Restart failed pods]',
                  '  Heal --> CP',
                ],
                caption: 'Kubernetes continuously reconciles the cluster toward the declared desired state.',
              },
              exercises: [
                {
                  type: 'quiz',
                  prompt: 'What does it mean that Kubernetes is declarative and self-healing?',
                  hint: 'What happens when a container crashes?',
                  solution: {
                    explanation:
                      'You declare the desired state (such as five replicas) and Kubernetes continuously reconciles toward it — if a container crashes, it automatically restarts or reschedules one to maintain the declared count.',
                  },
                },
                {
                  type: 'quiz',
                  prompt: 'What is the smallest deployable unit in Kubernetes?',
                  solution: {
                    explanation:
                      'The pod — one or more containers that share a network namespace and are scheduled together as a single unit.',
                  },
                },
                {
                  type: 'predict',
                  prompt: 'A small team with one simple app insists on self-managing a large Kubernetes cluster. Predict a likely outcome.',
                  solution: {
                    explanation:
                      'They will spend disproportionate effort operating Kubernetes relative to their needs. For a single simple app, a managed service or simpler platform would deliver more value with far less operational overhead.',
                  },
                },
              ],
              docs: 'https://kubernetes.io/docs/concepts/overview/',
            },
            {
              id: 'do4-t1-c1',
              title: 'Managed cloud services and cost awareness',
              summary:
                'Cloud providers offer managed services that remove operational toil, and the cloud\'s pay-as-you-go model makes cost a first-class engineering concern.',
              explanation:
                'A major lever in DevOps is choosing how much you operate yourself versus letting the cloud manage it. Managed services — a managed database, a managed Kubernetes control plane, a serverless function platform — handle patching, scaling and availability for you, trading some control and flexibility for far less operational burden. The general principle is to avoid running undifferentiated heavy lifting yourself when a managed service does it more reliably. The flip side of cloud elasticity is cost: because you pay for what you provision and use, architectural and operational decisions directly affect the bill, and waste (oversized instances, idle resources, forgotten environments) accumulates quietly. This is why cost awareness, sometimes formalised as FinOps, is now part of the DevOps remit: tagging resources, setting budgets and alerts, right-sizing, and tearing down ephemeral environments. Treating cost as a metric to monitor — like latency or error rate — keeps spending aligned with value rather than discovering a shocking invoice at month end.',
              analogy:
                'Managed services are like renting a fully serviced apartment instead of owning and maintaining a house; pay-as-you-go is a utility meter — leave the lights on and the bill climbs.',
              keyPoints: [
                'Managed services remove patching, scaling and availability toil.',
                'They trade some control and flexibility for less operational burden.',
                'Cloud pay-as-you-go makes cost a direct result of design and operations.',
                'Waste (oversized, idle, forgotten resources) accumulates quietly.',
                'Cost awareness (FinOps) means tagging, budgets, right-sizing and teardown.',
              ],
              commonMistakes: [
                'Leaving non-production environments running 24/7 instead of shutting them down off-hours.',
                'Provisioning oversized instances by default and never right-sizing them.',
              ],
              exercises: [
                {
                  type: 'quiz',
                  prompt: 'What is the main trade-off when choosing a managed service over self-hosting?',
                  hint: 'You gain something and give up something.',
                  solution: {
                    explanation:
                      'You gain reduced operational burden (the provider handles patching, scaling, availability) but give up some control and flexibility over the underlying system.',
                  },
                },
                {
                  type: 'quiz',
                  prompt: 'Why has cost become a DevOps concern in the cloud?',
                  solution: {
                    explanation:
                      'Because pay-as-you-go billing means design and operational decisions directly drive spending, and waste accumulates silently. Treating cost as a monitored metric keeps spend aligned with value.',
                  },
                },
                {
                  type: 'predict',
                  prompt: 'A team spins up large staging environments per pull request but never tears them down. Predict the effect on the cloud bill.',
                  solution: {
                    explanation:
                      'Costs climb steadily as idle environments accumulate and keep billing. Automatically tearing down ephemeral environments when no longer needed would prevent the waste.',
                  },
                },
              ],
              docs: 'https://aws.amazon.com/what-is/finops/',
            },
          ],
        },
        {
          id: 'do4-t2',
          name: 'Architecture for delivery',
          concepts: [
            {
              id: 'do4-t2-c0',
              title: 'The twelve-factor app',
              summary:
                'The twelve-factor methodology is a set of principles for building applications that are easy to deploy, scale and operate in the cloud. Several factors are directly DevOps-enabling.',
              explanation:
                'The twelve-factor app is a well-known set of guidelines for cloud-native applications, born from running many apps as a service. Rather than memorising all twelve, focus on the ones that make delivery smooth. Codebase: one codebase tracked in version control, many deploys. Dependencies: declared explicitly so builds are reproducible. Config: stored in the environment, not in code, so the same artifact runs everywhere with injected config. Backing services: treated as attached resources you can swap by config. Build, release, run: keep these stages strictly separate. Processes: run the app as stateless processes so any instance can handle any request and you can scale horizontally. Disposability: start fast and shut down gracefully for quick, safe scaling and deploys. Logs: treat them as event streams written to stdout, not files. These principles align tightly with everything in this course — immutable artifacts, externalised config, statelessness and horizontal scaling — which is why twelve-factor remains a useful checklist for delivery-friendly architecture.',
              analogy:
                'The twelve factors are like building codes for a house: follow them and the house is safe to extend, move into and maintain; ignore them and every renovation becomes a fight.',
              keyPoints: [
                'Twelve-factor is a checklist for deployable, scalable cloud-native apps.',
                'Config lives in the environment, so one artifact runs everywhere.',
                'Build, release and run stages are kept strictly separate.',
                'Apps run as stateless, disposable processes for easy horizontal scaling.',
                'Logs are event streams to stdout, not files the app manages.',
              ],
              exercises: [
                {
                  type: 'quiz',
                  prompt: 'Why does twelve-factor recommend storing config in the environment rather than in code?',
                  hint: 'Think about running the same build everywhere.',
                  solution: {
                    explanation:
                      'So the exact same artifact can run in every environment with config injected at runtime, supporting build-once-deploy-many and keeping secrets out of the codebase.',
                  },
                },
                {
                  type: 'quiz',
                  prompt: 'Why does making processes stateless help with scaling?',
                  solution: {
                    explanation:
                      'If processes hold no local state, any instance can handle any request, so you can add or remove instances freely (horizontal scaling) without losing session or data continuity.',
                  },
                },
                {
                  type: 'predict',
                  prompt: 'An app stores user sessions in local memory on each instance. Predict what happens when it scales to multiple instances behind a load balancer.',
                  solution: {
                    explanation:
                      'Users may hit different instances that do not have their session, causing logouts or inconsistent behaviour. Externalising session state (a shared store) restores statelessness and reliable scaling.',
                  },
                },
              ],
              docs: 'https://12factor.net/',
            },
            {
              id: 'do4-t2-c1',
              title: 'Microservices vs monolith trade-offs',
              summary:
                'A monolith is one deployable unit; microservices split an application into many independently deployable services. Each approach trades off simplicity against independence.',
              explanation:
                'In a monolith, the whole application is built, tested and deployed as a single unit. This is simple to develop, test and reason about, and is often the right starting point, but as it grows a single change requires redeploying everything and teams contend over one codebase. Microservices break the application into many small services, each owned by a team and deployed independently, which allows teams to ship on their own schedule, scale services separately and choose appropriate technologies. The cost is significant operational complexity: you now run a distributed system with network calls, partial failures, distributed data, and a much greater need for automation, observability and CI/CD maturity. The common guidance is that microservices are an organisational scaling tool, not a default — they pay off when many teams need to work and deploy independently, and they punish teams that adopt them prematurely without the platform and observability to manage the complexity. Choose based on team size, domain complexity and operational maturity, not hype.',
              analogy:
                'A monolith is one big bus everyone rides together; microservices are a fleet of taxis that go independently — more flexible, but you now have to coordinate a whole fleet.',
              keyPoints: [
                'A monolith is one deployable unit; microservices are many independent ones.',
                'Monoliths are simpler to develop, test and reason about — a fine start.',
                'Microservices enable independent deployment, scaling and tech choices.',
                'They add distributed-system complexity needing strong automation and observability.',
                'Microservices are an organisational scaling tool, not a default choice.',
              ],
              diagram: {
                type: 'mermaid',
                lines: [
                  'flowchart LR',
                  '  subgraph Monolith',
                  '    M[Single deployable app]',
                  '  end',
                  '  subgraph Microservices',
                  '    S1[Service A] --> S2[Service B]',
                  '    S1 --> S3[Service C]',
                  '  end',
                ],
                caption: 'A monolith ships as one unit; microservices are many independently deployed services that call one another.',
              },
              commonMistakes: [
                'Adopting microservices for a small team without the observability and automation to run a distributed system.',
                'Treating "monolith" as a dirty word rather than a sensible default for many projects.',
              ],
              exercises: [
                {
                  type: 'quiz',
                  prompt: 'What is the main benefit of microservices, and what is the main cost?',
                  hint: 'Independence versus complexity.',
                  solution: {
                    explanation:
                      'The main benefit is independent deployment, scaling and technology choice per service (enabling teams to move independently). The main cost is the operational complexity of running a distributed system.',
                  },
                },
                {
                  type: 'quiz',
                  prompt: 'Why is starting with a monolith often sensible?',
                  solution: {
                    explanation:
                      'It is simpler to develop, test, deploy and reason about, with no distributed-system overhead. You can split out services later once team size or domain complexity justifies it.',
                  },
                },
                {
                  type: 'predict',
                  prompt: 'A five-person startup splits its app into 20 microservices on day one. Predict the likely struggle.',
                  solution: {
                    explanation:
                      'They will drown in operational complexity — network calls, deployments, monitoring and debugging across 20 services — far exceeding what five people can manage, slowing them down rather than speeding them up.',
                  },
                },
              ],
              docs: 'https://martinfowler.com/articles/microservices.html',
            },
            {
              id: 'do4-t2-c2',
              title: 'Configuration and secrets management',
              summary:
                'Config should be externalised from code and varied per environment, while secrets need dedicated, encrypted storage with controlled access and rotation.',
              explanation:
                'Configuration and secrets are related but must be handled differently. Non-sensitive configuration — feature toggles, log levels, service URLs — should be externalised from the artifact and supplied per environment, typically through environment variables or a configuration service, so the same build behaves correctly in dev, staging and production. Secrets — database passwords, API keys, certificates — are sensitive config that demand stronger handling: they must never be committed to source control or baked into images, and instead live in a dedicated secrets manager such as HashiCorp Vault, AWS Secrets Manager or a cloud key vault. A good secrets system provides encryption at rest, fine-grained access control, audit logging and the ability to rotate secrets without redeploying code. Applications fetch secrets at runtime, often injected as environment variables or mounted files, so the secret never appears in the codebase or build logs. The recurring mistake — hardcoding credentials in a repo — is one of the most common sources of breaches, which is why externalised config and managed secrets are a baseline DevOps practice.',
              analogy:
                'Config is the dial settings you adjust per room; secrets are the keys to the building, which belong in a guarded key cabinet with a sign-out log, never taped to the door.',
              keyPoints: [
                'Externalise config from the artifact and vary it per environment.',
                'Secrets are sensitive config needing dedicated, encrypted storage.',
                'Never commit secrets to source control or bake them into images.',
                'Use a secrets manager with access control, audit logs and rotation.',
                'Apps fetch secrets at runtime so they never appear in code or logs.',
              ],
              diagram: {
                type: 'mermaid',
                lines: [
                  'flowchart LR',
                  '  App[Application] --> Vault[Secrets manager]',
                  '  Vault --> Secret[Encrypted secret]',
                  '  Secret --> Inject[Injected at runtime]',
                  '  Inject --> App',
                ],
                caption: 'The app fetches secrets from a manager at runtime; secrets never live in code or images.',
              },
              commonMistakes: [
                'Hardcoding database passwords or API keys directly in the repository.',
                'Treating secrets like ordinary config in plain environment files committed to git.',
              ],
              exercises: [
                {
                  type: 'quiz',
                  prompt: 'How should secrets be handled differently from ordinary configuration?',
                  hint: 'One needs encryption and access control.',
                  solution: {
                    explanation:
                      'Secrets must be stored in a dedicated, encrypted secrets manager with access control, audit logging and rotation, and fetched at runtime — never committed to source control or baked into images like ordinary config might be.',
                  },
                },
                {
                  type: 'quiz',
                  prompt: 'Name two capabilities a good secrets manager provides beyond just storing the value.',
                  solution: {
                    explanation:
                      'Encryption at rest, fine-grained access control, audit logging and secret rotation without redeploying code — any two of these are correct.',
                  },
                },
                {
                  type: 'predict',
                  prompt: 'A developer commits an API key to a public repository and removes it in the next commit. Predict the security implication.',
                  solution: {
                    explanation:
                      'The key remains in git history and was likely already scraped by bots, so it must be considered compromised and rotated immediately. Deleting it later does not undo the exposure.',
                  },
                },
              ],
              docs: 'https://developer.hashicorp.com/vault/docs/what-is-vault',
            },
          ],
        },
      ],
    },
    /* ───────────────────── LEVEL 5 — OBSERVABILITY AND RELIABILITY ───────────────────── */
    {
      level: 5,
      name: 'Observability and Reliability',
      focus: 'Understanding running systems, keeping them reliable and securing the pipeline',
      accent: '#f97316',
      soft: '#fff0e6',
      topics: [
        {
          id: 'do5-t0',
          name: 'Observability',
          concepts: [
            {
              id: 'do5-t0-c0',
              title: 'The three pillars: metrics, logs and traces',
              summary:
                'Observability is the ability to understand a system\'s internal state from its outputs. Its three classic pillars are metrics, logs and traces, each answering different questions.',
              explanation:
                'Monitoring tells you whether known things are working; observability is the broader ability to ask new questions about a system\'s behaviour from the data it emits, including problems you did not anticipate. The three pillars provide complementary views. Metrics are numeric measurements over time — request rate, error rate, latency, CPU — cheap to store and ideal for dashboards, trends and alerting on aggregate health. Logs are timestamped, often structured records of discrete events, giving rich detail about what happened in a specific moment, useful for debugging the particulars of an error. Traces follow a single request as it travels across services, showing the path and timing of each step, which is essential for finding bottlenecks and failures in distributed systems. Used together they answer different questions: metrics tell you something is wrong and where roughly, traces show which service and call, and logs reveal the precise detail. Strong observability is what makes the operate-and-monitor phase of DevOps actionable rather than guesswork.',
              analogy:
                'Metrics are the car dashboard gauges, logs are the detailed maintenance journal, and traces are the GPS breadcrumb trail of one whole trip — you need all three to fully diagnose a problem.',
              keyPoints: [
                'Observability is understanding internal state from external outputs.',
                'Metrics: numeric time-series, ideal for dashboards, trends and alerting.',
                'Logs: timestamped event records with rich per-event detail for debugging.',
                'Traces: follow one request across services to find bottlenecks and failures.',
                'Together they pinpoint that, where and why something went wrong.',
              ],
              diagram: {
                type: 'mermaid',
                lines: [
                  'flowchart TB',
                  '  Obs[Observability] --> Metrics[Metrics what is the trend]',
                  '  Obs --> Logs[Logs what happened in detail]',
                  '  Obs --> Traces[Traces where in the request]',
                ],
                caption: 'The three pillars answer different but complementary questions about a running system.',
              },
              exercises: [
                {
                  type: 'quiz',
                  prompt: 'What is the difference between monitoring and observability?',
                  hint: 'Known questions versus new questions.',
                  solution: {
                    explanation:
                      'Monitoring checks whether known, predefined things are working; observability is the broader ability to ask new, unanticipated questions about behaviour from the data the system emits.',
                  },
                },
                {
                  type: 'quiz',
                  prompt: 'Which pillar is best suited to finding a bottleneck across multiple services for a single request?',
                  solution: {
                    explanation:
                      'Traces — they follow one request through every service, showing the path and timing of each step, which exposes where the slowdown or failure occurs.',
                  },
                },
                {
                  type: 'predict',
                  prompt: 'A team only collects metrics, no logs or traces. Predict the difficulty when debugging why a specific user request failed.',
                  solution: {
                    explanation:
                      'Metrics show that errors rose but not the detail of the specific request. Without logs (the exact error detail) and traces (the request path), pinpointing the cause is slow and largely guesswork.',
                  },
                },
              ],
              docs: 'https://opentelemetry.io/docs/concepts/observability-primer/',
            },
            {
              id: 'do5-t0-c1',
              title: 'Prometheus, Grafana, dashboards and alerting',
              summary:
                'Prometheus is a popular metrics system that scrapes and stores time-series data and evaluates alerting rules. Grafana visualises that data in dashboards.',
              explanation:
                'A common open-source observability stack pairs Prometheus and Grafana. Prometheus collects metrics by scraping HTTP endpoints that applications expose, storing them as time-series labelled with dimensions (like instance or route). You query it with PromQL to compute rates, percentiles and aggregates, and you define alerting rules that fire when an expression crosses a threshold — for example, error rate above a level for several minutes — handing alerts to an Alertmanager that routes notifications. Grafana connects to Prometheus (and many other sources) to build dashboards: visual panels that show the health of a system at a glance. The art of alerting is to page humans only for things that are urgent and actionable; alerting on symptoms users feel (high latency, elevated errors) rather than on every internal fluctuation avoids alert fatigue, where too many noisy alerts train people to ignore the pager. Good dashboards and disciplined alerting turn raw metrics into operational awareness and timely response, closing the monitor-to-plan feedback loop.',
              analogy:
                'Prometheus is the sensor network recording everything; Grafana is the control-room wall of screens; alerting is the alarm that should only sound when someone truly needs to act.',
              keyPoints: [
                'Prometheus scrapes and stores time-series metrics, queried with PromQL.',
                'Alerting rules fire when an expression crosses a threshold.',
                'Grafana builds dashboards visualising metrics for at-a-glance health.',
                'Alert on symptoms users feel, not every internal fluctuation.',
                'Too many noisy alerts cause alert fatigue and ignored pages.',
              ],
              code: {
                language: 'yaml',
                lines: [
                  'groups:',
                  '  - name: availability',
                  '    rules:',
                  '      - alert: HighErrorRate',
                  '        expr: rate(http_requests_total{status="500"}[5m]) > 1',
                  '        for: 10m',
                  '        labels:',
                  '          severity: page',
                  '        annotations:',
                  '          summary: High 500 error rate detected',
                ],
                explanation:
                  'This Prometheus rule fires the HighErrorRate alert when the rate of HTTP 500 responses exceeds one per second sustained for ten minutes, marking it as page-worthy.',
              },
              commonMistakes: [
                'Alerting on causes and internal noise rather than user-facing symptoms, causing fatigue.',
                'Building dashboards full of vanity metrics that do not reflect user experience.',
              ],
              exercises: [
                {
                  type: 'quiz',
                  prompt: 'How does Prometheus typically collect metrics from applications?',
                  hint: 'Pull, not push.',
                  solution: {
                    explanation:
                      'It scrapes (pulls) metrics from HTTP endpoints that applications expose, storing them as labelled time-series that you can query with PromQL.',
                  },
                },
                {
                  type: 'quiz',
                  prompt: 'Why should you alert on symptoms users feel rather than on every internal metric?',
                  solution: {
                    explanation:
                      'Alerting on user-facing symptoms (latency, errors) keeps pages urgent and actionable. Alerting on every internal fluctuation creates noise and alert fatigue, training responders to ignore the pager.',
                  },
                },
                {
                  type: 'predict',
                  prompt: 'A team sets dozens of alerts on minor CPU spikes. Predict the effect on the on-call engineer over time.',
                  solution: {
                    explanation:
                      'Frequent non-actionable pages cause alert fatigue; the engineer starts ignoring or muting alerts, so a genuinely important page may be missed. Fewer, symptom-based alerts work better.',
                  },
                },
              ],
              docs: 'https://prometheus.io/docs/introduction/overview/',
            },
          ],
        },
        {
          id: 'do5-t1',
          name: 'Reliability and SRE',
          concepts: [
            {
              id: 'do5-t1-c0',
              title: 'SLI, SLO, SLA and error budgets',
              summary:
                'SLIs measure service health, SLOs are internal targets for those measures, SLAs are external promises, and the error budget is the allowed amount of unreliability.',
              explanation:
                'Site Reliability Engineering provides a precise vocabulary for reliability. A Service Level Indicator (SLI) is a quantitative measure of some aspect of service health, such as the percentage of requests served successfully or under a latency threshold. A Service Level Objective (SLO) is the target you set for an SLI — for example, 99.9% of requests succeed over 30 days — representing the reliability you aim to deliver. A Service Level Agreement (SLA) is a formal external promise to customers, usually with consequences (like refunds) if breached, and is typically set looser than the internal SLO so you have margin. The error budget is the genius idea that follows: if your SLO is 99.9%, then 0.1% unreliability is acceptable, and that allowance is a budget you can spend. When the budget is healthy you can ship faster and take more risk; when it is exhausted you slow down and prioritise reliability work. This reframes the dev-versus-ops tension as a shared, data-driven decision rather than an argument, which is why error budgets are central to SRE culture.',
              analogy:
                'An error budget is like a monthly data allowance: as long as you have budget left you can stream freely, but once it runs out you throttle back until it refills.',
              keyPoints: [
                'SLI: a measured indicator of service health (success rate, latency).',
                'SLO: the internal target for an SLI (for example 99.9% success).',
                'SLA: a formal external promise, usually looser than the SLO, with consequences.',
                'Error budget: the allowed unreliability implied by the SLO.',
                'A healthy budget allows faster shipping; an exhausted one prioritises reliability.',
              ],
              diagram: {
                type: 'mermaid',
                lines: [
                  'flowchart LR',
                  '  SLI[SLI measured health] --> SLO[SLO internal target]',
                  '  SLO --> Budget[Error budget]',
                  '  SLO --> SLA[SLA external promise]',
                  '  Budget --> Decide[Ship fast or slow down]',
                ],
                caption: 'SLIs feed SLOs, which define both the error budget and the looser external SLA.',
              },
              exercises: [
                {
                  type: 'quiz',
                  prompt: 'Distinguish between an SLO and an SLA.',
                  hint: 'One is internal, one is a customer promise.',
                  solution: {
                    explanation:
                      'An SLO is an internal reliability target for an SLI; an SLA is a formal external promise to customers with consequences if breached. The SLA is usually set looser than the SLO to leave margin.',
                  },
                },
                {
                  type: 'quiz',
                  prompt: 'If an SLO is 99.9% success over 30 days, what is the error budget?',
                  solution: {
                    explanation:
                      'The 0.1% of requests that may fail. That allowance is the error budget you can "spend" on risk before needing to slow down and focus on reliability.',
                  },
                },
                {
                  type: 'predict',
                  prompt: 'A service has burned through its entire error budget mid-month. Predict what an SRE-driven team should do next.',
                  solution: {
                    explanation:
                      'They should slow or freeze risky feature releases and prioritise reliability work until the budget recovers, since further unreliability would breach the SLO.',
                  },
                },
              ],
              docs: 'https://sre.google/sre-book/service-level-objectives/',
            },
            {
              id: 'do5-t1-c1',
              title: 'On-call, incident response and blameless postmortems',
              summary:
                'On-call engineers respond to incidents using a defined process, and afterwards a blameless postmortem extracts lessons by focusing on systems, not individuals.',
              explanation:
                'No system is perfectly reliable, so teams need a humane, effective way to handle failures. On-call means designated engineers are available to respond when alerts fire, ideally on a sustainable rotation that does not burn people out. Incident response is the structured process for handling an outage: detect, declare an incident, assign clear roles (such as an incident commander coordinating the response), communicate status, mitigate to restore service first, and only then dig into root cause. The goal during an incident is to reduce time to restore (one of the DORA stability metrics), so restoring service takes priority over understanding everything. After resolution comes the postmortem, and crucially it should be blameless: it examines what in the system, process or tooling allowed the failure, rather than punishing the person who pushed the change. The premise is that humans operating under pressure will make mistakes, so resilient systems and good processes — not blame — prevent recurrence. Blameless postmortems create the psychological safety needed for honest analysis, which is how organisations actually learn from failure.',
              analogy:
                'A blameless postmortem is like an aviation crash investigation: the goal is to find why the system let the error happen and fix it for everyone, not to pillory the pilot.',
              keyPoints: [
                'On-call provides responders on a sustainable rotation.',
                'Incident response: detect, declare, assign roles, communicate, mitigate, then analyse.',
                'Restoring service (lowering time to restore) takes priority over root cause.',
                'Postmortems are blameless: they examine systems and processes, not people.',
                'Blamelessness creates the safety needed for honest learning.',
              ],
              commonMistakes: [
                'Treating postmortems as a search for someone to blame, which kills honesty and learning.',
                'Running on-call as a punishing rotation that burns engineers out.',
              ],
              exercises: [
                {
                  type: 'quiz',
                  prompt: 'During an incident, why is restoring service usually prioritised over finding the root cause?',
                  hint: 'Think about the user impact and a DORA metric.',
                  solution: {
                    explanation:
                      'Because users are being harmed while the service is down. Restoring service reduces time to restore (a DORA stability metric) and limits impact; the deeper root-cause analysis can follow once service is back.',
                  },
                },
                {
                  type: 'quiz',
                  prompt: 'What is the purpose of a blameless postmortem?',
                  solution: {
                    explanation:
                      'To learn from failure by examining what in the system, process or tooling allowed it, rather than punishing individuals — creating the psychological safety needed for honest analysis and real prevention.',
                  },
                },
                {
                  type: 'predict',
                  prompt: 'An organisation publicly blames the engineer who triggered an outage. Predict the effect on future incident reporting.',
                  solution: {
                    explanation:
                      'People will hide mistakes and avoid reporting near-misses to escape blame, so the organisation loses the information it needs to fix systemic weaknesses and incidents recur.',
                  },
                },
              ],
              docs: 'https://sre.google/sre-book/postmortem-culture/',
            },
          ],
        },
        {
          id: 'do5-t2',
          name: 'DevSecOps',
          concepts: [
            {
              id: 'do5-t2-c0',
              title: 'Shift-left security',
              summary:
                'DevSecOps integrates security throughout the lifecycle rather than as a final gate, making it a shared responsibility embedded early and automated in pipelines.',
              explanation:
                'Traditionally, security was a separate team that reviewed software just before release, creating a bottleneck and finding issues late when they were expensive to fix. DevSecOps applies the shift-left idea to security: integrate security practices throughout the lifecycle and make them a shared responsibility of the whole team, not a final checkpoint. In practice this means embedding automated security checks into the CI/CD pipeline so that vulnerabilities are caught as code is written and merged — scanning code, dependencies and container images on every change, validating infrastructure definitions, and managing secrets properly. The cultural shift is that developers consider security as part of doing their job, supported by security engineers who provide tooling, guardrails and expertise rather than acting solely as gatekeepers. The payoff mirrors shift-left for quality: catching a vulnerability in a pull request costs minutes, while a breach in production can be catastrophic. Automation is essential because manual security review cannot keep pace with continuous delivery; the security checks must be fast and built into the same pipeline as everything else.',
              analogy:
                'DevSecOps is like building fire safety into a building\'s design and every floor as it is constructed, rather than bolting on extinguishers after the building is finished and occupied.',
              keyPoints: [
                'DevSecOps integrates security throughout the lifecycle, not as a final gate.',
                'Security becomes a shared responsibility of the whole team.',
                'Automated security checks are embedded in the CI/CD pipeline.',
                'Catching vulnerabilities early is far cheaper than a production breach.',
                'Security engineers provide tooling and guardrails, not just gatekeeping.',
              ],
              diagram: {
                type: 'mermaid',
                lines: [
                  'flowchart LR',
                  '  Code --> Scan[Automated security checks]',
                  '  Scan --> PR[Pull request]',
                  '  PR --> Build',
                  '  Build --> Deploy',
                ],
                caption: 'Security checks are built into the pipeline so issues surface early, alongside normal CI.',
              },
              exercises: [
                {
                  type: 'quiz',
                  prompt: 'What does shift-left security change about when and by whom security is handled?',
                  hint: 'Earlier and by everyone.',
                  solution: {
                    explanation:
                      'It moves security earlier in the lifecycle (embedded in the pipeline as code is written) and makes it a shared responsibility of the whole team, rather than a final gate owned only by a separate security team.',
                  },
                },
                {
                  type: 'quiz',
                  prompt: 'Why is automation essential to DevSecOps?',
                  solution: {
                    explanation:
                      'Manual security review cannot keep pace with continuous delivery. Automated, fast checks built into the pipeline catch issues on every change without becoming a bottleneck.',
                  },
                },
                {
                  type: 'predict',
                  prompt: 'A team keeps security as a single manual review the day before each release. Predict the effect on release speed and on issue cost.',
                  solution: {
                    explanation:
                      'Releases bottleneck on the manual review, and issues found that late are expensive and disruptive to fix. Shifting security left into automated pipeline checks would reduce both problems.',
                  },
                },
              ],
              docs: 'https://www.redhat.com/en/topics/devops/what-is-devsecops',
            },
            {
              id: 'do5-t2-c1',
              title: 'SAST, DAST and dependency and image scanning',
              summary:
                'Automated security scanning includes SAST (analysing source code), DAST (testing the running app), and scanning dependencies and container images for known vulnerabilities.',
              explanation:
                'Several complementary scanning techniques fit into a DevSecOps pipeline, each catching different problems. Static Application Security Testing (SAST) analyses source code without running it, flagging insecure patterns like SQL injection risks or unsafe functions early, directly in the pull request. Dynamic Application Security Testing (DAST) tests the running application from the outside, like an attacker would, finding issues only visible at runtime such as misconfigurations or authentication flaws. Software Composition Analysis, often called dependency scanning, checks your third-party libraries against databases of known vulnerabilities (CVEs) — vital because most applications are mostly other people\'s code, and a vulnerable dependency is a common attack vector. Container image scanning inspects the layers of a built image for known-vulnerable packages and misconfigurations before it ships. No single technique is sufficient: SAST sees the code, DAST sees the running behaviour, dependency scanning sees your supply chain, and image scanning sees what is actually packaged. Wiring these into CI gives layered, automated coverage so security keeps pace with delivery.',
              analogy:
                'SAST reads the blueprints for flaws, DAST rattles the doors and windows of the finished house, dependency scanning checks the safety recalls on the parts you bought, and image scanning inspects the fully furnished house before move-in.',
              keyPoints: [
                'SAST analyses source code statically to flag insecure patterns early.',
                'DAST tests the running application from the outside for runtime issues.',
                'Dependency scanning checks third-party libraries against known CVEs.',
                'Image scanning inspects container layers for vulnerable packages.',
                'The techniques are complementary; use them together for layered coverage.',
              ],
              code: {
                language: 'yaml',
                lines: [
                  'security-scan:',
                  '  stage: test',
                  '  script:',
                  '    - sast-tool analyze ./src        # static code analysis',
                  '    - dependency-check --scan ./       # known CVE check',
                  '    - image-scan myapp:1.0             # scan the built image',
                  '  allow_failure: false',
                ],
                explanation:
                  'A pipeline job runs static analysis, dependency CVE checking and image scanning, and is not allowed to fail silently, so vulnerabilities block the change.',
              },
              exercises: [
                {
                  type: 'quiz',
                  prompt: 'What is the key difference between SAST and DAST?',
                  hint: 'One reads code, one exercises the running app.',
                  solution: {
                    explanation:
                      'SAST analyses source code statically without running it; DAST tests the running application from the outside, like an attacker, finding runtime-only issues. They catch different classes of problems.',
                  },
                },
                {
                  type: 'quiz',
                  prompt: 'Why is dependency (software composition) scanning especially important?',
                  solution: {
                    explanation:
                      'Most applications are largely third-party code, and a vulnerable dependency is a common attack vector. Scanning libraries against known CVEs catches these supply-chain risks that your own code review would miss.',
                  },
                },
                {
                  type: 'predict',
                  prompt: 'A team runs only SAST and ignores dependency scanning. Predict a category of vulnerability they may miss.',
                  solution: {
                    explanation:
                      'They may miss known vulnerabilities in their third-party libraries (CVEs), since SAST focuses on their own code, not the security advisories for dependencies they pulled in.',
                  },
                },
              ],
              docs: 'https://owasp.org/www-community/Source_Code_Analysis_Tools',
            },
            {
              id: 'do5-t2-c2',
              title: 'Secrets management and policy as code',
              summary:
                'Secure pipelines manage secrets centrally and never expose them, and encode security and compliance rules as policy as code so they are enforced automatically.',
              explanation:
                'Two practices round out a mature DevSecOps approach. First, secrets management within the pipeline: build and deploy processes need credentials, and these must come from a secrets manager and be injected as masked variables, never hardcoded in pipeline files, printed in logs, or stored in the repository. Scanning the codebase and commit history for accidentally committed secrets is a common safeguard. Second, policy as code captures security, compliance and governance rules as machine-readable definitions that are evaluated automatically, rather than relying on manual review or written guidelines people may ignore. For example, a policy might forbid deploying a container that runs as root, require all storage to be encrypted, or block infrastructure that opens a database to the public internet. Tools such as Open Policy Agent (OPA) evaluate these policies in the pipeline and fail the build if a rule is violated, turning compliance into an automated gate that scales with continuous delivery. Together, centralised secrets and policy as code make security consistent, auditable and enforced by machines rather than dependent on everyone remembering the rules.',
              analogy:
                'Policy as code is like automated building inspections written into the construction robots themselves, so a non-compliant wall simply cannot be built, rather than relying on an inspector who might miss it.',
              keyPoints: [
                'Pipeline secrets come from a secrets manager as masked variables, never hardcoded.',
                'Scan code and history for accidentally committed secrets.',
                'Policy as code encodes security and compliance rules as machine-readable definitions.',
                'Tools like Open Policy Agent evaluate policies and fail violating builds.',
                'This makes compliance automated, consistent and auditable at delivery speed.',
              ],
              code: {
                language: 'bash',
                lines: [
                  '# Example policy-as-code checks run in the pipeline',
                  'opa eval --data policy.rego --input plan.json "data.deny"',
                  'gitleaks detect --source . --no-banner   # scan for committed secrets',
                ],
                explanation:
                  'Open Policy Agent evaluates a Terraform plan against rules in policy.rego and reports denials, while a secret scanner checks the repository for leaked credentials — both as automated gates.',
              },
              commonMistakes: [
                'Putting deploy credentials directly in the pipeline file or echoing them to logs.',
                'Relying on written security guidelines instead of automated, enforced policy as code.',
              ],
              exercises: [
                {
                  type: 'quiz',
                  prompt: 'What is policy as code and what advantage does it give over written guidelines?',
                  hint: 'Machines enforce it.',
                  solution: {
                    explanation:
                      'Policy as code expresses security and compliance rules as machine-readable definitions evaluated automatically in the pipeline. Unlike written guidelines that people may ignore, it is enforced consistently and can fail a violating build.',
                  },
                },
                {
                  type: 'quiz',
                  prompt: 'How should deploy credentials be supplied to a pipeline securely?',
                  solution: {
                    explanation:
                      'From a secrets manager, injected as masked environment variables at runtime — never hardcoded in the pipeline file, printed in logs, or committed to the repository.',
                  },
                },
                {
                  type: 'predict',
                  prompt: 'A policy-as-code rule denies any infrastructure plan that exposes a database to the public internet. Predict what happens when an engineer submits such a plan.',
                  solution: {
                    explanation:
                      'The policy evaluation fails the build and blocks the change, so the insecure configuration never reaches production — compliance is enforced automatically rather than depending on a reviewer noticing.',
                  },
                },
              ],
              docs: 'https://www.openpolicyagent.org/docs/latest/',
            },
          ],
        },
      ],
    },
  ],
};

export default content;
