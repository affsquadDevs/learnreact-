// Kubernetes — course content. Original explanations written for self-study; same schema as the other courses.
const content = {
  meta: {
    title: 'Kubernetes: Orchestration from Fundamentals to Production',
    description:
      'A complete, hands-on path through Kubernetes: the orchestration problem and declarative model, cluster architecture, workloads, networking, configuration, storage, scaling, security and production operations. Every concept comes with diagrams, manifests, kubectl commands and exercises.',
    schemaVersion: '1.0',
    status: 'complete',
  },
  levels: [
    /* ───────────────────── LEVEL 1 — FUNDAMENTALS ───────────────────── */
    {
      level: 1,
      name: 'Fundamentals',
      focus: 'Why orchestration exists, how a cluster is built, and how to talk to it with kubectl',
      accent: '#326ce5',
      soft: '#e7eefc',
      topics: [
        {
          id: 'k81-t0',
          name: 'Why Kubernetes',
          concepts: [
            {
              id: 'k81-t0-c0',
              title: 'The orchestration problem',
              summary:
                'Running one container is easy; running hundreds across many machines, surviving crashes and traffic spikes, is not. Kubernetes is the system that automates that operational work.',
              explanation:
                'Containers solved packaging — your app and its dependencies travel together as an image. But production needs far more than running a single container: you must place containers across a fleet of machines, restart them when they die, replace machines that fail, roll out new versions without downtime, scale up under load and scale down to save money, and let containers find and talk to each other. Doing all of that by hand with scripts is fragile and does not survive a machine dying at 3am. An orchestrator is software that continuously manages a pool of machines and the containers running on them on your behalf. Kubernetes is the de facto standard orchestrator, originally built at Google and now governed by the Cloud Native Computing Foundation. You declare what you want and Kubernetes does the placement, healing and scaling.',
              analogy:
                'Containers are shipping containers; Kubernetes is the port authority that decides which ship each container goes on, reloads cargo when a ship sinks, and adds ships when the docks get busy.',
              keyPoints: [
                'Containers package an app; orchestration runs them reliably at scale.',
                'Kubernetes automates placement, restarts, rollouts, scaling and service discovery.',
                'Manual scripts do not survive node failures or 3am incidents; an orchestrator does.',
                'Kubernetes is the CNCF-governed industry standard, born from Google internal systems.',
              ],
              diagram: {
                type: 'mermaid',
                lines: [
                  'flowchart LR',
                  '  Dev[You declare desired state] --> K8s[Kubernetes]',
                  '  K8s --> Place[Place containers]',
                  '  K8s --> Heal[Restart on failure]',
                  '  K8s --> Scale[Scale up and down]',
                ],
                caption: 'Kubernetes turns a declared desired state into ongoing placement, healing and scaling.',
              },
              exercises: [
                {
                  type: 'quiz',
                  prompt: 'Name three operational tasks an orchestrator automates that a plain container runtime does not.',
                  hint: 'Think about what happens after a container starts.',
                  solution: {
                    explanation:
                      'Examples: restarting containers that crash, replacing failed machines, placing containers across nodes, rolling out new versions without downtime, scaling up and down, and service discovery.',
                  },
                },
                {
                  type: 'quiz',
                  prompt: 'Which organisation governs Kubernetes today, and where did it originate?',
                  solution: {
                    explanation:
                      'It is governed by the Cloud Native Computing Foundation (CNCF) and originated from Google internal cluster-management systems.',
                  },
                },
                {
                  type: 'predict',
                  prompt: 'A team runs containers with shell scripts on three VMs. One VM dies overnight. What is likely to happen, and how does an orchestrator change it?',
                  solution: {
                    explanation:
                      'With scripts, the containers on the dead VM are simply gone until a human notices and intervenes. An orchestrator detects the lost node and reschedules those containers onto the surviving VMs automatically.',
                  },
                },
              ],
              docs: 'https://kubernetes.io/docs/concepts/overview/',
            },
            {
              id: 'k81-t0-c1',
              title: 'The declarative desired-state model',
              summary:
                'You tell Kubernetes the end state you want, not the steps to get there. Controllers continuously reconcile reality toward that desired state.',
              explanation:
                'The central idea in Kubernetes is declarative configuration. Instead of issuing imperative commands like start this container, then start another, you submit an object that describes the desired state — for example, I want three replicas of this app running. Kubernetes stores that desired state and runs a control loop: it observes the current state, compares it to the desired state, and takes action to close any gap. This loop never stops. If you asked for three replicas and one crashes, the observed count becomes two, which no longer matches the desired three, so a new replica is created. You do not script the recovery; you only declare the target. This reconciliation model is what makes Kubernetes resilient and is why the same manifest applied twice is safe — it converges to the same state rather than doing the action twice.',
              analogy:
                'A thermostat is declarative: you set 21 degrees (desired state) and it keeps heating or cooling to stay there. You never tell it when to switch the furnace on — it reconciles against the target on its own.',
              keyPoints: [
                'Declarative means you describe the end state, not the steps.',
                'A control loop observes current state, compares to desired, and acts to converge.',
                'Reconciliation is continuous, which is the source of self-healing.',
                'Applying the same manifest repeatedly is idempotent — it converges, not repeats.',
              ],
              diagram: {
                type: 'mermaid',
                lines: [
                  'flowchart LR',
                  '  Desired[Desired state] --> Compare[Compare]',
                  '  Observed[Observed state] --> Compare',
                  '  Compare --> Act[Take action]',
                  '  Act --> Observed',
                ],
                caption: 'The reconciliation loop: observe, compare to desired, act, repeat forever.',
              },
              code: {
                language: 'yaml',
                lines: [
                  '# desired state: I want three replicas, not the steps to start them',
                  'apiVersion: apps/v1',
                  'kind: Deployment',
                  'metadata:',
                  '  name: web',
                  'spec:',
                  '  replicas: 3',
                  '  selector:',
                  '    matchLabels:',
                  '      app: web',
                  '  template:',
                  '    metadata:',
                  '      labels:',
                  '        app: web',
                  '    spec:',
                  '      containers:',
                  '        - name: web',
                  '          image: nginx:1.27',
                ],
                explanation:
                  'This manifest declares the desired state (three replicas of nginx). You never tell Kubernetes how or when to start them; it reconciles toward this target continuously.',
              },
              commonMistakes: [
                'Thinking in imperative steps (do X, then Y) instead of describing the target state.',
                'Assuming applying a manifest twice runs an action twice — it is idempotent and converges.',
              ],
              exercises: [
                {
                  type: 'quiz',
                  prompt: 'What is the difference between declarative and imperative configuration?',
                  hint: 'Steps versus outcome.',
                  solution: {
                    explanation:
                      'Imperative specifies the sequence of steps to perform; declarative specifies the desired end state and lets the system figure out the steps to reach it.',
                  },
                },
                {
                  type: 'predict',
                  prompt: 'You set replicas: 3 and then manually delete one of the running pods. What does Kubernetes do?',
                  solution: {
                    explanation:
                      'The observed replica count drops to two, which no longer matches the desired three, so the controller creates a replacement pod to converge back to three.',
                  },
                },
                {
                  type: 'task',
                  prompt: 'Write a kubectl command to apply a manifest file named web.yaml declaratively.',
                  solution: {
                    lines: ['kubectl apply -f web.yaml'],
                    explanation:
                      'apply submits the desired state from the file; running it again is safe because reconciliation is idempotent.',
                  },
                },
              ],
              docs: 'https://kubernetes.io/docs/concepts/architecture/controller/',
            },
            {
              id: 'k81-t0-c2',
              title: 'Self-healing and scaling',
              summary:
                'Because controllers reconcile continuously, Kubernetes recovers from failures automatically and can scale workloads up or down on demand.',
              explanation:
                'Self-healing falls naturally out of the reconciliation model. When a container crashes, the kubelet restarts it; when a whole pod is lost, its controller creates a replacement; when a node fails, its pods are rescheduled onto healthy nodes. You do not write any of this recovery logic — it is the consequence of Kubernetes constantly driving the cluster toward the declared desired state. Scaling works the same way: changing the replica count is just changing the desired state, and the controller adds or removes pods to match. Beyond manual scaling, the Horizontal Pod Autoscaler can change the replica count automatically based on metrics such as CPU usage, and the Cluster Autoscaler can add or remove nodes. The key insight is that healing and scaling are not special features bolted on — they are both expressions of the same observe-compare-act loop.',
              analogy:
                'Like a self-driving cruise control that both holds your set speed when you hit a hill (healing against disturbance) and adjusts when you change the target speed (scaling) — same control loop, two effects.',
              keyPoints: [
                'Self-healing: crashed containers restart, lost pods are recreated, node failures trigger rescheduling.',
                'Scaling = changing the desired replica count; the controller adds or removes pods.',
                'HorizontalPodAutoscaler scales replicas on metrics; Cluster Autoscaler scales nodes.',
                'Healing and scaling are both just the reconciliation loop in action.',
              ],
              exercises: [
                {
                  type: 'quiz',
                  prompt: 'Why does Kubernetes not need separate, hand-written recovery logic for crashes?',
                  solution: {
                    explanation:
                      'Recovery is a side effect of reconciliation: a crash makes observed state diverge from desired state, so the control loop automatically takes corrective action.',
                  },
                },
                {
                  type: 'task',
                  prompt: 'Write a command to scale a Deployment named web to five replicas imperatively.',
                  solution: {
                    lines: ['kubectl scale deployment web --replicas=5'],
                    explanation:
                      'This changes the desired replica count to five; the controller reconciles by creating two more pods (if it had three).',
                  },
                },
                {
                  type: 'predict',
                  prompt: 'A node hosting four pods is abruptly powered off. What happens to those four pods?',
                  solution: {
                    explanation:
                      'After the node is marked NotReady and its grace period passes, the controllers managing those pods recreate equivalent pods on healthy nodes to restore the desired replica counts.',
                  },
                },
              ],
              docs: 'https://kubernetes.io/docs/concepts/workloads/autoscaling/',
            },
          ],
        },
        {
          id: 'k81-t1',
          name: 'Cluster architecture',
          concepts: [
            {
              id: 'k81-t1-c0',
              title: 'Control plane overview',
              summary:
                'The control plane is the brain of the cluster: it stores cluster state and makes all the global decisions. It is made of the API server, etcd, scheduler and controller manager.',
              explanation:
                'A Kubernetes cluster is split into a control plane and a set of worker nodes. The control plane is responsible for the global view: it accepts your declared desired state, stores it, decides where work should run, and drives the cluster toward that state. Its core components are the kube-apiserver (the single front door for all reads and writes), etcd (the database of record), the kube-scheduler (decides which node each new pod runs on), and the kube-controller-manager (runs the reconciliation loops). On managed services like EKS, GKE or AKS the control plane is operated by the cloud provider so you never SSH into it. The defining property of the control plane is that everything goes through the API server — components do not talk to each other directly or to etcd directly; they all read and write through the API server, which keeps the system consistent and auditable.',
              analogy:
                'The control plane is an airport control tower: it holds the master picture of all flights (state), assigns gates (scheduling), and keeps issuing instructions to keep everything on plan (controllers) — but it does not fly the planes itself.',
              keyPoints: [
                'A cluster = control plane (decisions) + worker nodes (run workloads).',
                'Control plane components: kube-apiserver, etcd, kube-scheduler, kube-controller-manager.',
                'All communication funnels through the API server; nothing else touches etcd directly.',
                'Managed Kubernetes (EKS/GKE/AKS) runs the control plane for you.',
              ],
              diagram: {
                type: 'mermaid',
                lines: [
                  'flowchart TD',
                  '  API[kube-apiserver] --> ETCD[etcd]',
                  '  Scheduler[kube-scheduler] --> API',
                  '  CM[controller-manager] --> API',
                  '  Kubelet[node kubelet] --> API',
                ],
                caption: 'Every control-plane and node component reads and writes through the API server.',
              },
              exercises: [
                {
                  type: 'quiz',
                  prompt: 'List the four core control-plane components and one job of each.',
                  hint: 'Front door, database, placement, loops.',
                  solution: {
                    explanation:
                      'kube-apiserver (front door for all API calls), etcd (stores cluster state), kube-scheduler (assigns pods to nodes), kube-controller-manager (runs reconciliation loops).',
                  },
                },
                {
                  type: 'quiz',
                  prompt: 'Why is it significant that all components communicate through the API server?',
                  solution: {
                    explanation:
                      'It centralises access control, validation, auditing and consistency — no component bypasses it to touch etcd or another component directly.',
                  },
                },
                {
                  type: 'predict',
                  prompt: 'On a managed cluster (EKS/GKE/AKS), can you SSH into the kube-apiserver host to edit a config file?',
                  solution: {
                    explanation:
                      'No. On managed services the cloud provider operates the control plane; you interact only through the Kubernetes API, not by logging into control-plane machines.',
                  },
                },
              ],
              docs: 'https://kubernetes.io/docs/concepts/overview/components/',
            },
            {
              id: 'k81-t1-c1',
              title: 'API server and etcd',
              summary:
                'The kube-apiserver is the single entry point that validates and serves every request; etcd is the consistent key-value store that holds all cluster state.',
              explanation:
                'The kube-apiserver exposes the Kubernetes REST API. Every kubectl command, every controller, and every kubelet talks to it. It handles authentication (who are you), authorization (are you allowed), admission control (should this request be modified or rejected), and validation, before persisting accepted objects. Behind it sits etcd, a distributed, strongly consistent key-value store based on the Raft consensus algorithm. etcd is the single source of truth: if etcd is healthy and backed up, the cluster state survives; if etcd is lost without a backup, the cluster state is gone. Because etcd is so critical, production clusters run it as an odd-numbered cluster (commonly three or five members) for quorum, and you back it up regularly. Importantly, only the API server talks to etcd — this isolation means you can secure and back up one well-defined component rather than exposing the datastore widely.',
              analogy:
                'The API server is a strict receptionist who checks your ID, your permissions, and your paperwork before filing anything; etcd is the locked records room that only the receptionist can enter.',
              keyPoints: [
                'kube-apiserver does auth, authz, admission control and validation for every request.',
                'etcd is a strongly consistent (Raft) key-value store — the single source of truth.',
                'Only the API server reads and writes etcd; nothing else touches it directly.',
                'Run etcd with an odd member count for quorum and back it up regularly.',
              ],
              code: {
                language: 'bash',
                lines: [
                  '# the API server is reachable as the kubernetes service inside the cluster',
                  'kubectl get --raw /healthz',
                  '',
                  '# back up etcd (run on a control-plane node with etcdctl)',
                  'ETCDCTL_API=3 etcdctl snapshot save /backup/etcd-snapshot.db',
                ],
                explanation:
                  'The /healthz endpoint reports API-server health. The etcd snapshot creates a point-in-time backup of all cluster state — essential before upgrades or recovery.',
              },
              commonMistakes: [
                'Forgetting to back up etcd — losing it without a snapshot means losing the entire cluster state.',
                'Running an even number of etcd members, which weakens quorum behaviour.',
              ],
              exercises: [
                {
                  type: 'quiz',
                  prompt: 'What four checks does the API server perform on an incoming request before persisting an object?',
                  solution: {
                    explanation:
                      'Authentication (identity), authorization (permission), admission control (mutate/validate/reject), and schema validation.',
                  },
                },
                {
                  type: 'quiz',
                  prompt: 'Why should etcd be backed up regularly?',
                  hint: 'What is stored there?',
                  solution: {
                    explanation:
                      'etcd holds all cluster state. Losing it without a backup destroys the cluster definition; a snapshot lets you restore everything.',
                  },
                },
                {
                  type: 'task',
                  prompt: 'Write the etcdctl command to take a snapshot of etcd to /backup/snap.db using API version 3.',
                  solution: {
                    lines: ['ETCDCTL_API=3 etcdctl snapshot save /backup/snap.db'],
                    explanation:
                      'This writes a consistent point-in-time backup of etcd that can later be restored.',
                  },
                },
              ],
              docs: 'https://kubernetes.io/docs/concepts/overview/components/#etcd',
            },
            {
              id: 'k81-t1-c2',
              title: 'Scheduler and controller manager',
              summary:
                'The scheduler decides which node each new pod lands on; the controller manager runs the reconciliation loops that keep objects in their desired state.',
              explanation:
                'When you create a pod it starts out unscheduled — it has no node assigned. The kube-scheduler watches for these pending pods and, for each one, picks the best node using a two-phase process: filtering (which nodes are even feasible, considering resource requests, taints, node selectors and affinity) and scoring (ranking the feasible nodes to find the best fit). It then binds the pod to the chosen node by writing that assignment back through the API server. The kube-controller-manager is a single process that runs many controllers — the Deployment controller, ReplicaSet controller, Node controller, Job controller and others. Each controller watches a kind of object and reconciles it: the ReplicaSet controller, for example, makes sure the right number of pods exist. Together these two components turn declared intent into placed, running, continuously corrected workloads.',
              analogy:
                'The scheduler is a host at a restaurant deciding which table each party gets based on size and availability; the controller manager is the floor manager who keeps checking that every table has the right number of chairs and refills them when one is taken away.',
              keyPoints: [
                'Scheduler assigns pending pods to nodes via filtering then scoring.',
                'Scheduling respects resource requests, taints/tolerations, node selectors and affinity.',
                'The controller manager runs many reconciliation loops in one process.',
                'Example controllers: Deployment, ReplicaSet, Node, Job — each keeps its objects at desired state.',
              ],
              diagram: {
                type: 'mermaid',
                lines: [
                  'flowchart LR',
                  '  Pending[Pending pod] --> Filter[Filter feasible nodes]',
                  '  Filter --> Score[Score nodes]',
                  '  Score --> Bind[Bind to best node]',
                ],
                caption: 'The scheduler filters feasible nodes, scores them, then binds the pod to the winner.',
              },
              exercises: [
                {
                  type: 'quiz',
                  prompt: 'What are the two phases the scheduler uses to choose a node, and what does each do?',
                  hint: 'Narrow down, then rank.',
                  solution: {
                    explanation:
                      'Filtering eliminates nodes that cannot run the pod (insufficient resources, taints, selectors); scoring ranks the remaining feasible nodes to pick the best.',
                  },
                },
                {
                  type: 'quiz',
                  prompt: 'The controller manager runs many controllers. Name two and what they reconcile.',
                  solution: {
                    explanation:
                      'For example the ReplicaSet controller keeps the desired number of pods running, and the Node controller reacts to nodes going unhealthy by triggering rescheduling.',
                  },
                },
                {
                  type: 'predict',
                  prompt: 'You create a pod that requests 64Gi of memory but every node has only 32Gi. What state does the pod stay in and why?',
                  solution: {
                    explanation:
                      'It stays Pending: the filtering phase finds no feasible node with enough memory, so the scheduler cannot bind it anywhere.',
                  },
                },
              ],
              docs: 'https://kubernetes.io/docs/concepts/scheduling-eviction/kube-scheduler/',
            },
            {
              id: 'k81-t1-c3',
              title: 'Worker nodes: kubelet, kube-proxy and the runtime',
              summary:
                'Worker nodes actually run your containers. Each node runs a kubelet (the node agent), a container runtime (runs containers), and kube-proxy (networking for Services).',
              explanation:
                'A worker node is any machine that runs application workloads. Three components run on every node. The kubelet is the node agent: it registers the node with the API server, watches for pods assigned to its node, and instructs the container runtime to start and stop containers so the actual state matches the assigned pod specs. It also reports node and pod health back to the control plane and runs the liveness and readiness probes. The container runtime is the software that actually runs containers — commonly containerd or CRI-O, accessed through the Container Runtime Interface (CRI); Docker is no longer used directly as a runtime by Kubernetes. kube-proxy programs the node networking rules (using iptables or IPVS) so that traffic sent to a Service virtual IP is forwarded to one of the backing pods. Together they make a node a place where pods can run and be reached.',
              analogy:
                'If the control plane is the head office, a worker node is a branch: the kubelet is the branch manager carrying out head-office instructions, the runtime is the staff doing the work, and kube-proxy is the front desk routing visitors to the right person.',
              keyPoints: [
                'kubelet is the per-node agent: starts/stops pods, runs probes, reports health.',
                'The container runtime (containerd, CRI-O) runs containers via the CRI; Docker is not used directly.',
                'kube-proxy programs iptables/IPVS rules so Service IPs route to backing pods.',
                'Worker nodes are where application pods actually execute.',
              ],
              diagram: {
                type: 'mermaid',
                lines: [
                  'flowchart TD',
                  '  API[API server] --> Kubelet[kubelet]',
                  '  Kubelet --> Runtime[container runtime]',
                  '  Runtime --> Pod[Pods]',
                  '  Proxy[kube-proxy] --> Pod',
                ],
                caption: 'On a node the kubelet drives the runtime to run pods; kube-proxy wires Service traffic to them.',
              },
              commonMistakes: [
                'Assuming Kubernetes still uses Docker as its runtime — it uses CRI runtimes like containerd.',
                'Confusing the kubelet (node agent) with kube-proxy (Service networking).',
              ],
              exercises: [
                {
                  type: 'quiz',
                  prompt: 'What is the kubelet responsible for on a node?',
                  solution: {
                    explanation:
                      'Registering the node, watching for pods assigned to it, driving the container runtime to match pod specs, running probes, and reporting node/pod health to the API server.',
                  },
                },
                {
                  type: 'quiz',
                  prompt: 'Which component makes a Service virtual IP actually route to the right pods, and how?',
                  solution: {
                    explanation:
                      'kube-proxy, by programming the node\'s iptables or IPVS rules to forward Service traffic to one of the backing pod IPs.',
                  },
                },
                {
                  type: 'task',
                  prompt: 'Write a kubectl command to list all nodes in the cluster with extra details like internal IP and OS image.',
                  solution: {
                    lines: ['kubectl get nodes -o wide'],
                    explanation:
                      '-o wide adds columns such as internal/external IP, OS image, kernel version and container runtime.',
                  },
                },
              ],
              docs: 'https://kubernetes.io/docs/concepts/architecture/nodes/',
            },
          ],
        },
        {
          id: 'k81-t2',
          name: 'kubectl and objects',
          concepts: [
            {
              id: 'k81-t2-c0',
              title: 'kubectl: get, describe, apply',
              summary:
                'kubectl is the command-line client for the Kubernetes API. get lists objects, describe shows rich detail and events, and apply submits desired state from files.',
              explanation:
                'Almost everything you do interactively goes through kubectl, which is just a friendly client for the API server. The three commands you will use most are get, describe and apply. kubectl get lists resources of a type (get pods, get deployments) and supports output formats with -o (wide, yaml, json). kubectl describe shows a detailed, human-readable view of a single object including its spec, status and, crucially, the recent Events associated with it — which is your first stop when something is wrong. kubectl apply -f sends a manifest file to the cluster as desired state; it is declarative and idempotent, and it tracks the fields you manage so it can compute updates. There are also imperative commands like create, delete, scale and edit, but for anything you want under version control, apply with files is the recommended workflow. Add --dry-run=client -o yaml to generate manifests without touching the cluster.',
              analogy:
                'kubectl is the remote control for the cluster: get is checking what is on, describe is opening the detailed settings menu, and apply is loading a saved configuration profile.',
              keyPoints: [
                'kubectl is a client for the API server; it does not contain cluster logic itself.',
                'get lists resources; -o wide/yaml/json change the output.',
                'describe shows full object detail plus the Events list — start debugging here.',
                'apply -f submits desired state declaratively and idempotently.',
              ],
              code: {
                language: 'bash',
                lines: [
                  'kubectl get pods                 # list pods in the current namespace',
                  'kubectl get pods -o wide         # add node and IP columns',
                  'kubectl describe pod web-abc123  # full detail plus recent Events',
                  'kubectl apply -f deployment.yaml # submit desired state from a file',
                  'kubectl get deploy web -o yaml   # dump the live object as YAML',
                ],
                explanation:
                  'These four verbs cover most day-to-day work: list, inspect, declare, and export. describe is especially useful because it surfaces Events.',
              },
              commonMistakes: [
                'Reaching for imperative create/edit for things that should live in version-controlled apply manifests.',
                'Forgetting that describe shows Events — the fastest clue when a pod will not start.',
              ],
              exercises: [
                {
                  type: 'task',
                  prompt: 'Write a command to show full detail and recent events for a pod named api-7d8f.',
                  solution: {
                    lines: ['kubectl describe pod api-7d8f'],
                    explanation:
                      'describe prints the spec, status and the Events section, which is where scheduling and image-pull problems appear.',
                  },
                },
                {
                  type: 'quiz',
                  prompt: 'Why is kubectl apply -f preferred over imperative commands for production?',
                  solution: {
                    explanation:
                      'It is declarative and idempotent, the manifests can be version-controlled and reviewed, and apply tracks managed fields so it can compute correct updates.',
                  },
                },
                {
                  type: 'task',
                  prompt: 'Generate a Deployment manifest for image nginx without creating it, as YAML.',
                  hint: 'Use create with a dry run.',
                  solution: {
                    lines: ['kubectl create deployment web --image=nginx --dry-run=client -o yaml'],
                    explanation:
                      '--dry-run=client builds the object locally and -o yaml prints it, giving you a starting manifest to edit and later apply.',
                  },
                },
              ],
              docs: 'https://kubernetes.io/docs/reference/kubectl/',
            },
            {
              id: 'k81-t2-c1',
              title: 'YAML manifests and object structure',
              summary:
                'Kubernetes objects are described in YAML with four top-level fields: apiVersion, kind, metadata and spec. The cluster reports status separately.',
              explanation:
                'Every Kubernetes object you create has the same skeleton. apiVersion names the API group and version (for example apps/v1 for Deployments, or v1 for core objects like Pods and Services). kind is the object type (Pod, Deployment, Service). metadata carries identifying data: the name, the namespace, labels and annotations. spec is where you declare the desired state — the part you write. After the object is created, Kubernetes maintains a status field describing the observed state; you read it but never write it. Understanding this spec versus status split is essential: spec is your intent, status is reality, and controllers work to make status match spec. Getting apiVersion and kind right matters because using the wrong version (for example the long-removed extensions/v1beta1 for Deployments) causes errors; current Deployments, ReplicaSets, StatefulSets and DaemonSets all live under apps/v1.',
              analogy:
                'A manifest is like a building permit: apiVersion and kind say what kind of structure, metadata is the address and labels, spec is the architect\'s plan (what you want built), and status is the inspector\'s report on what actually exists.',
              keyPoints: [
                'Four top-level fields: apiVersion, kind, metadata, spec.',
                'spec is your declared desired state; status is the observed state Kubernetes maintains.',
                'Core objects use v1; workload controllers (Deployment, StatefulSet, DaemonSet) use apps/v1.',
                'You write spec and read status; you never set status yourself.',
              ],
              code: {
                language: 'yaml',
                lines: [
                  'apiVersion: v1        # API group/version',
                  'kind: Pod             # object type',
                  'metadata:             # identity: name, labels, namespace',
                  '  name: hello',
                  '  labels:',
                  '    app: hello',
                  'spec:                 # desired state (you write this)',
                  '  containers:',
                  '    - name: hello',
                  '      image: nginx:1.27',
                  '      ports:',
                  '        - containerPort: 80',
                ],
                explanation:
                  'A minimal Pod manifest showing the four fields. Note there is no status block — Kubernetes adds and maintains status after creation.',
              },
              commonMistakes: [
                'Using an outdated apiVersion such as extensions/v1beta1 for Deployments instead of apps/v1.',
                'Trying to set or edit the status field manually — it is owned by the system.',
              ],
              exercises: [
                {
                  type: 'quiz',
                  prompt: 'What are the four top-level fields of a Kubernetes object, and which one do you write?',
                  solution: {
                    explanation:
                      'apiVersion, kind, metadata and spec. You write spec (and metadata); status is maintained by Kubernetes.',
                  },
                },
                {
                  type: 'quiz',
                  prompt: 'Which apiVersion do Deployments use today?',
                  hint: 'Workload controllers share a group.',
                  solution: {
                    explanation:
                      'apps/v1 — the same group used by ReplicaSet, StatefulSet and DaemonSet.',
                  },
                },
                {
                  type: 'predict',
                  prompt: 'You set spec.replicas: 3 in a Deployment. Where do you look to confirm three are actually ready?',
                  solution: {
                    explanation:
                      'In the status (for example status.readyReplicas, visible via kubectl get deploy showing READY 3/3) — status reflects observed reality, spec only your intent.',
                  },
                },
              ],
              docs: 'https://kubernetes.io/docs/concepts/overview/working-with-objects/kubernetes-objects/',
            },
            {
              id: 'k81-t2-c2',
              title: 'Namespaces, labels and selectors',
              summary:
                'Namespaces partition a cluster into virtual sub-clusters; labels are key-value tags on objects, and selectors query objects by those labels — the glue that connects controllers to pods.',
              explanation:
                'Namespaces let you divide a single physical cluster into isolated logical groups — for example dev, staging and prod, or one per team. Names must be unique within a namespace but can repeat across namespaces, and you can apply resource quotas and access controls per namespace. Some objects (nodes, persistent volumes) are cluster-scoped and live outside any namespace. Labels are arbitrary key-value pairs attached to objects (app: web, tier: frontend, env: prod). They carry no built-in meaning; their power comes from selectors, which query objects by label. This is how Kubernetes wires things together loosely: a Deployment selects the pods it owns by label, and a Service routes to pods by label rather than by hard-coded IP. Annotations look similar but are for non-identifying metadata (tooling hints, change-cause) and cannot be used as selectors. Mastering labels and selectors is essential because almost every relationship in Kubernetes is expressed through them.',
              analogy:
                'Namespaces are floors in an office building (the same room number can exist on each floor); labels are sticky notes on people\'s desks, and a selector is calling out everyone whose note says tier=frontend.',
              keyPoints: [
                'Namespaces partition a cluster; names are unique per namespace, not cluster-wide.',
                'Some resources are cluster-scoped (nodes, PersistentVolumes) and not namespaced.',
                'Labels are key-value tags; selectors query objects by label.',
                'Services and controllers find their pods via label selectors, not fixed IPs.',
                'Annotations hold non-identifying metadata and cannot be selected on.',
              ],
              code: {
                language: 'bash',
                lines: [
                  'kubectl get pods -n kube-system          # list pods in a specific namespace',
                  'kubectl get pods -A                      # all namespaces',
                  'kubectl get pods -l app=web,env=prod     # filter by labels (AND)',
                  'kubectl label pod hello tier=frontend    # add a label to an existing pod',
                  'kubectl create namespace staging         # create a namespace',
                ],
                explanation:
                  '-n targets a namespace, -A spans all of them, and -l filters by a label selector (comma-separated labels are ANDed together).',
              },
              commonMistakes: [
                'Forgetting -n and running commands against the wrong (default) namespace.',
                'Changing a Deployment\'s spec.selector after creation — the selector is immutable and mismatches break ownership.',
                'Using labels for non-identifying data that belongs in annotations.',
              ],
              exercises: [
                {
                  type: 'task',
                  prompt: 'Write a command to list all pods across every namespace that have the label app=api.',
                  solution: {
                    lines: ['kubectl get pods -A -l app=api'],
                    explanation:
                      '-A spans all namespaces and -l app=api filters to pods carrying that label.',
                  },
                },
                {
                  type: 'quiz',
                  prompt: 'How does a Service know which pods to send traffic to?',
                  hint: 'Not by IP.',
                  solution: {
                    explanation:
                      'Through a label selector: the Service matches pods whose labels satisfy its selector, and traffic is load-balanced across those pods.',
                  },
                },
                {
                  type: 'predict',
                  prompt: 'Two namespaces, dev and prod, each contain a Service named api. Do they conflict?',
                  solution: {
                    explanation:
                      'No. Names only need to be unique within a namespace, so dev/api and prod/api coexist as distinct objects.',
                  },
                },
              ],
              docs: 'https://kubernetes.io/docs/concepts/overview/working-with-objects/labels/',
            },
          ],
        },
      ],
    },
    /* ───────────────────── LEVEL 2 — WORKLOADS ───────────────────── */
    {
      level: 2,
      name: 'Workloads',
      focus: 'Pods, the controllers that manage them, and the right controller for each job',
      accent: '#326ce5',
      soft: '#e7eefc',
      topics: [
        {
          id: 'k82-t0',
          name: 'Pods',
          concepts: [
            {
              id: 'k82-t0-c0',
              title: 'The pod: smallest deployable unit',
              summary:
                'A pod is the smallest thing Kubernetes runs. It wraps one or more tightly coupled containers that share a network identity and storage.',
              explanation:
                'You do not deploy containers directly in Kubernetes — you deploy pods, and a pod holds one or more containers. The containers in a single pod always run on the same node, share a single IP address and port space, and can share volumes, so they can communicate over localhost and via shared files. Almost always a pod contains exactly one main application container; multiple containers in a pod are reserved for helpers that must live and die together with the main app. Pods are intentionally ephemeral and disposable: they are never repaired in place, only replaced. When a pod dies it is gone forever, and a new pod (with a new name and IP) takes its place. This is why you rarely create bare pods directly — instead you use a controller like a Deployment that creates and replaces pods for you. A bare pod that crashes and is not managed by a controller will not be recreated.',
              analogy:
                'A pod is like a single apartment shared by roommates (containers): they share the same address (IP) and kitchen (volumes), and if the building is demolished they all move out together — you do not renovate; you rebuild a new apartment elsewhere.',
              keyPoints: [
                'The pod, not the container, is the smallest deployable unit.',
                'Containers in a pod share an IP, port space and can share volumes; they run on the same node.',
                'Pods are ephemeral and replaced, never repaired in place; a replacement gets a new name and IP.',
                'Use controllers (Deployments) rather than bare pods so failed pods are recreated.',
              ],
              diagram: {
                type: 'mermaid',
                lines: [
                  'flowchart TD',
                  '  Pod[Pod shared IP and volumes] --> Main[Main container]',
                  '  Pod --> Helper[Helper container]',
                  '  Pod --> Vol[Shared volume]',
                ],
                caption: 'A pod groups co-located containers that share network and storage.',
              },
              code: {
                language: 'yaml',
                lines: [
                  'apiVersion: v1',
                  'kind: Pod',
                  'metadata:',
                  '  name: hello',
                  'spec:',
                  '  containers:',
                  '    - name: app',
                  '      image: nginx:1.27',
                  '      ports:',
                  '        - containerPort: 80',
                ],
                explanation:
                  'A single-container pod. In practice you would wrap this in a Deployment so it is recreated if it dies.',
              },
              commonMistakes: [
                'Creating bare pods for real workloads — they are not recreated when they die.',
                'Putting unrelated containers in one pod; only co-dependent helpers belong together.',
              ],
              exercises: [
                {
                  type: 'quiz',
                  prompt: 'Why is a bare pod a poor choice for a long-running service?',
                  solution: {
                    explanation:
                      'A bare pod has no controller watching it, so if it crashes or its node fails nothing recreates it. A Deployment ensures replacements are created.',
                  },
                },
                {
                  type: 'quiz',
                  prompt: 'What do containers in the same pod share?',
                  hint: 'Network and storage.',
                  solution: {
                    explanation:
                      'They share the same network namespace (one IP and port space, so localhost works) and can share volumes; they always run on the same node.',
                  },
                },
                {
                  type: 'predict',
                  prompt: 'A bare pod named cache is deleted. Does Kubernetes bring it back?',
                  solution: {
                    explanation:
                      'No. With no owning controller, a deleted bare pod stays gone. Only a controller-managed pod would be recreated.',
                  },
                },
              ],
              docs: 'https://kubernetes.io/docs/concepts/workloads/pods/',
            },
            {
              id: 'k82-t0-c1',
              title: 'Pod lifecycle and phases',
              summary:
                'A pod moves through phases: Pending, Running, Succeeded or Failed, with Unknown as a fallback. Container restart behaviour is governed by restartPolicy.',
              explanation:
                'A pod has a top-level phase that summarises where it is in its life. Pending means the pod is accepted but not all containers are running yet — often it is waiting to be scheduled or to pull images. Running means it is bound to a node and at least one container is running. Succeeded means all containers exited successfully and will not restart; Failed means all terminated and at least one failed. Unknown means the node\'s state could not be obtained. Within a pod, the restartPolicy (Always, OnFailure, or Never) controls whether the kubelet restarts containers that exit; Always is the default and is what long-running services use, while Jobs use OnFailure or Never. When a container keeps crashing and restarting, the kubelet applies an exponential back-off, and the visible symptom is the CrashLoopBackOff status. Understanding phases and restart policy is the foundation for reading pod status and diagnosing why something is not Running.',
              analogy:
                'Pod phases are like a flight status board: Pending is boarding, Running is in the air, Succeeded is landed safely, Failed is a cancelled flight, and Unknown is when the tower loses radio contact.',
              keyPoints: [
                'Phases: Pending, Running, Succeeded, Failed, Unknown.',
                'restartPolicy (Always default, OnFailure, Never) decides if exited containers restart.',
                'Long-running services use Always; Jobs use OnFailure or Never.',
                'Repeated crashes trigger exponential back-off, surfaced as CrashLoopBackOff.',
              ],
              diagram: {
                type: 'mermaid',
                lines: [
                  'flowchart LR',
                  '  Pending --> Running',
                  '  Running --> Succeeded',
                  '  Running --> Failed',
                ],
                caption: 'A pod typically moves Pending then Running, then ends in Succeeded or Failed.',
              },
              commonMistakes: [
                'Confusing the pod phase with container state; a Running pod can still have a crashing container.',
                'Setting restartPolicy: Always on a one-shot Job, which prevents it from ever completing.',
              ],
              exercises: [
                {
                  type: 'quiz',
                  prompt: 'What does the Pending phase usually indicate?',
                  solution: {
                    explanation:
                      'The pod is accepted but not yet running everywhere — typically it is unscheduled (no feasible node) or still pulling its container images.',
                  },
                },
                {
                  type: 'predict',
                  prompt: 'A container in a pod exits with a non-zero code and restartPolicy is the default. What happens, and what status might you see if it keeps failing?',
                  solution: {
                    explanation:
                      'With restartPolicy Always the kubelet restarts it. If it keeps crashing, back-off grows and the pod shows CrashLoopBackOff.',
                  },
                },
                {
                  type: 'task',
                  prompt: 'Write a command to watch a pod\'s status change over time.',
                  solution: {
                    lines: ['kubectl get pod hello -w'],
                    explanation:
                      '-w (watch) streams status changes so you can see the pod move through phases live.',
                  },
                },
              ],
              docs: 'https://kubernetes.io/docs/concepts/workloads/pods/pod-lifecycle/',
            },
            {
              id: 'k82-t0-c2',
              title: 'Multi-container patterns: sidecars and init containers',
              summary:
                'Some pods include helper containers: init containers run to completion before the app starts, while sidecars run alongside it to add capabilities like logging or proxying.',
              explanation:
                'Multi-container pods exist for helpers that are tightly coupled to the main app. Init containers run one after another to completion before any app container starts — perfect for setup work like waiting for a dependency, running a database migration, or fetching config. If an init container fails it is retried (subject to restartPolicy) and the app never starts until all init containers succeed. Sidecar containers, by contrast, run for the whole life of the pod alongside the main container, adding cross-cutting capabilities: shipping logs, providing a service-mesh proxy, or syncing files. Kubernetes now has first-class sidecar support by declaring an init container with restartPolicy: Always, which makes it start before the main container and keep running. The common thread is that all of these share the pod\'s network and volumes, so a sidecar can read the app\'s log files or proxy its localhost traffic without any network configuration.',
              analogy:
                'Init containers are the stage crew that must finish setting up the set before the actors come on; sidecars are the sound engineer who stays in the booth running alongside the whole performance.',
              keyPoints: [
                'Init containers run sequentially to completion before app containers start.',
                'Use init containers for migrations, waiting on dependencies, or fetching config.',
                'Sidecars run for the pod\'s lifetime to add logging, proxying or syncing.',
                'Native sidecars are init containers with restartPolicy: Always.',
                'All containers in the pod share network and volumes, enabling tight cooperation.',
              ],
              code: {
                language: 'yaml',
                lines: [
                  'apiVersion: v1',
                  'kind: Pod',
                  'metadata:',
                  '  name: web',
                  'spec:',
                  '  initContainers:',
                  '    - name: wait-for-db',
                  '      image: busybox:1.36',
                  '      command: [sh, -c, until nc -z db 5432; do sleep 1; done]',
                  '  containers:',
                  '    - name: app',
                  '      image: myapp:1.0',
                ],
                explanation:
                  'The init container blocks until the db host accepts connections on port 5432; only then does the app container start.',
              },
              commonMistakes: [
                'Using a plain sidecar in spec.containers for setup work that should be an init container.',
                'Expecting init containers to run in parallel — they run one at a time, in order.',
              ],
              exercises: [
                {
                  type: 'quiz',
                  prompt: 'What is the key behavioural difference between an init container and a sidecar?',
                  solution: {
                    explanation:
                      'Init containers run to completion before the app starts and then exit; sidecars run alongside the app for the pod\'s entire lifetime.',
                  },
                },
                {
                  type: 'predict',
                  prompt: 'An init container that runs a migration exits with an error. Does the main app container start?',
                  solution: {
                    explanation:
                      'No. The app container only starts after all init containers succeed; a failing init container blocks startup (and may be retried).',
                  },
                },
                {
                  type: 'quiz',
                  prompt: 'How do you declare a native sidecar in modern Kubernetes?',
                  hint: 'It lives among the init containers.',
                  solution: {
                    explanation:
                      'Declare it as an init container with restartPolicy: Always, which starts it before the main container and keeps it running for the pod\'s life.',
                  },
                },
              ],
              docs: 'https://kubernetes.io/docs/concepts/workloads/pods/sidecar-containers/',
            },
            {
              id: 'k82-t0-c3',
              title: 'Health probes: liveness, readiness and startup',
              summary:
                'Probes let the kubelet check container health. Liveness restarts stuck containers, readiness gates traffic, and startup protects slow-starting apps.',
              explanation:
                'Kubernetes does not assume a running process is healthy — it actively probes containers. A liveness probe answers is this container still working; if it fails repeatedly the kubelet kills and restarts the container, recovering from deadlocks that the process itself cannot detect. A readiness probe answers is this container ready to serve traffic; while it fails, the pod is removed from Service endpoints so no requests are routed to it, but the container is not restarted. A startup probe answers has the application finished starting up; it disables the liveness and readiness checks until it first succeeds, which protects apps with long initialisation from being killed prematurely. Each probe can be an HTTP GET, a TCP socket check, an exec command, or a gRPC check, and you tune them with initialDelaySeconds, periodSeconds, failureThreshold and timeoutSeconds. The classic mistake is pointing liveness at a check that depends on a downstream service — then an outage of that service causes endless restarts. Liveness should test only the container itself; readiness can include dependencies.',
              analogy:
                'Liveness is a pulse check (no pulse, resuscitate); readiness is asking are you ready to take customers (if not, hold them in the waiting room); startup is a do not disturb sign while the shop is still opening.',
              keyPoints: [
                'Liveness: restart the container if it fails — recovers from hangs/deadlocks.',
                'Readiness: remove the pod from Service endpoints while failing — no restart.',
                'Startup: gate liveness/readiness until the app has finished initialising.',
                'Probe types: httpGet, tcpSocket, exec, grpc; tune with delays and thresholds.',
                'Keep liveness independent of downstream dependencies to avoid restart loops.',
              ],
              code: {
                language: 'yaml',
                lines: [
                  'containers:',
                  '  - name: app',
                  '    image: myapp:1.0',
                  '    livenessProbe:',
                  '      httpGet:',
                  '        path: /healthz',
                  '        port: 8080',
                  '      initialDelaySeconds: 10',
                  '      periodSeconds: 10',
                  '    readinessProbe:',
                  '      httpGet:',
                  '        path: /ready',
                  '        port: 8080',
                  '      periodSeconds: 5',
                ],
                explanation:
                  'Liveness hits /healthz to detect a hung process; readiness hits /ready to gate traffic. They use different endpoints so a busy-but-alive app is not killed.',
              },
              commonMistakes: [
                'Pointing the liveness probe at a check that includes a database — a DB outage then restart-loops the app.',
                'Setting initialDelaySeconds too low so a slow app is killed before it can start (use a startup probe instead).',
              ],
              exercises: [
                {
                  type: 'quiz',
                  prompt: 'A readiness probe is failing. What happens to traffic and to the container?',
                  solution: {
                    explanation:
                      'The pod is removed from the Service\'s endpoints so it receives no traffic, but the container is not restarted — readiness only gates traffic.',
                  },
                },
                {
                  type: 'predict',
                  prompt: 'An app takes 60 seconds to start, and a liveness probe with initialDelaySeconds 10 and failureThreshold 3 is configured. What likely happens?',
                  solution: {
                    explanation:
                      'The liveness probe starts failing at ~10s and after three failures the kubelet kills and restarts the container, never letting it finish starting — a startup probe would prevent this.',
                  },
                },
                {
                  type: 'quiz',
                  prompt: 'Why should a liveness probe avoid checking downstream dependencies?',
                  solution: {
                    explanation:
                      'If liveness depends on a downstream service, an outage there makes liveness fail and the container is restarted repeatedly even though it is fine — turning a dependency blip into a self-inflicted restart loop.',
                  },
                },
              ],
              docs: 'https://kubernetes.io/docs/tasks/configure-pod-container/configure-liveness-readiness-startup-probes/',
            },
          ],
        },
        {
          id: 'k82-t1',
          name: 'Deployments and ReplicaSets',
          concepts: [
            {
              id: 'k82-t1-c0',
              title: 'ReplicaSets and Deployments',
              summary:
                'A ReplicaSet keeps a fixed number of identical pods running. A Deployment manages ReplicaSets to give you declarative updates and rollbacks on top.',
              explanation:
                'A ReplicaSet has one job: ensure a specified number of pod replicas matching its selector are running at all times, creating or deleting pods to converge on the desired count. You rarely create ReplicaSets directly, though, because they have no concept of versioned updates. Instead you create a Deployment, which is the standard way to run stateless apps. A Deployment owns ReplicaSets: when you change the pod template (say, a new image tag), the Deployment creates a new ReplicaSet for the new version and gradually scales it up while scaling the old one down, giving you a controlled rollout. The old ReplicaSet is kept around (scaled to zero) so you can roll back. This layering — Deployment manages ReplicaSet manages Pods — is fundamental: you talk to the Deployment, and the rest happens automatically through reconciliation.',
              analogy:
                'A ReplicaSet is a photocopier set to always keep N copies in the tray. A Deployment is the office manager who, when the document changes, gradually swaps the old copies for new ones and keeps the old version in a drawer in case you need to revert.',
              keyPoints: [
                'ReplicaSet keeps a fixed number of identical pods running.',
                'Deployment manages ReplicaSets to add versioned, rolling updates and rollback.',
                'Hierarchy: Deployment owns ReplicaSets, which own Pods.',
                'You interact with the Deployment; ReplicaSets are an implementation detail.',
              ],
              diagram: {
                type: 'mermaid',
                lines: [
                  'flowchart TD',
                  '  Deploy[Deployment] --> RSnew[ReplicaSet v2]',
                  '  Deploy --> RSold[ReplicaSet v1 scaled to zero]',
                  '  RSnew --> Pods[Pods]',
                ],
                caption: 'A Deployment manages multiple ReplicaSets; the old one is kept at zero for rollback.',
              },
              exercises: [
                {
                  type: 'quiz',
                  prompt: 'Why use a Deployment instead of a ReplicaSet directly?',
                  solution: {
                    explanation:
                      'A ReplicaSet only maintains a count; a Deployment adds versioned rolling updates, rollout history and rollback by managing ReplicaSets for you.',
                  },
                },
                {
                  type: 'task',
                  prompt: 'Write a command to list the ReplicaSets owned by a Deployment to see old and new versions.',
                  solution: {
                    lines: ['kubectl get rs'],
                    explanation:
                      'Each Deployment revision corresponds to a ReplicaSet; the old ones sit at 0 replicas, ready for rollback.',
                  },
                },
                {
                  type: 'predict',
                  prompt: 'You change a Deployment\'s image tag. What does the Deployment create, and what happens to the old pods?',
                  solution: {
                    explanation:
                      'It creates a new ReplicaSet for the new image and scales it up while scaling the old ReplicaSet down, so old pods are gradually replaced by new ones.',
                  },
                },
              ],
              docs: 'https://kubernetes.io/docs/concepts/workloads/controllers/deployment/',
            },
            {
              id: 'k82-t1-c1',
              title: 'Rolling updates and strategy',
              summary:
                'The default RollingUpdate strategy replaces pods gradually with zero downtime, controlled by maxSurge and maxUnavailable. Recreate is the all-at-once alternative.',
              explanation:
                'When a Deployment\'s pod template changes, it rolls out the change using a strategy. The default is RollingUpdate, which incrementally replaces old pods with new ones so the app stays available throughout. Two knobs control the pace: maxUnavailable is how many pods below the desired count you tolerate during the rollout, and maxSurge is how many extra pods above the desired count may be created temporarily. With sensible values (and good readiness probes) you get zero-downtime deploys, because new pods only receive traffic once they pass readiness and old pods are removed only as new ones become ready. The alternative strategy, Recreate, kills all old pods before starting new ones — causing downtime but useful when two versions cannot run simultaneously (for example incompatible schema). You watch a rollout with kubectl rollout status, and you can pause and resume it. Readiness probes are essential here: without them the rollout cannot tell whether new pods are actually serving and may declare success prematurely.',
              analogy:
                'RollingUpdate is renovating a hotel one floor at a time so guests always have rooms; Recreate is closing the whole hotel, gutting it, then reopening — faster but everyone is locked out meanwhile.',
              keyPoints: [
                'RollingUpdate (default) replaces pods gradually for zero downtime.',
                'maxUnavailable caps how many pods can be missing; maxSurge caps extra pods during rollout.',
                'Recreate terminates all old pods first — causes downtime, used for incompatible versions.',
                'Readiness probes gate traffic so only ready new pods serve during the rollout.',
                'Use kubectl rollout status to watch, and pause/resume to control rollouts.',
              ],
              code: {
                language: 'yaml',
                lines: [
                  'spec:',
                  '  strategy:',
                  '    type: RollingUpdate',
                  '    rollingUpdate:',
                  '      maxUnavailable: 1',
                  '      maxSurge: 1',
                ],
                explanation:
                  'During the rollout at most one pod is unavailable and at most one extra is created, replacing pods one at a time while keeping capacity.',
              },
              commonMistakes: [
                'Rolling out without readiness probes, so traffic hits pods that are not actually ready.',
                'Using RollingUpdate when two app versions cannot coexist (use Recreate or a migration plan).',
              ],
              exercises: [
                {
                  type: 'quiz',
                  prompt: 'What do maxSurge and maxUnavailable control during a rolling update?',
                  solution: {
                    explanation:
                      'maxSurge is how many pods above the desired count may exist temporarily; maxUnavailable is how many below the desired count are tolerated while updating.',
                  },
                },
                {
                  type: 'task',
                  prompt: 'Write a command to watch the progress of a Deployment rollout named web.',
                  solution: {
                    lines: ['kubectl rollout status deployment/web'],
                    explanation:
                      'rollout status blocks and reports progress until the rollout completes or fails.',
                  },
                },
                {
                  type: 'predict',
                  prompt: 'You deploy a new version that crashes on startup, with a readiness probe configured and maxUnavailable 0. What happens to the old pods and traffic?',
                  solution: {
                    explanation:
                      'New pods never become ready, so the rollout stalls; with maxUnavailable 0 the old pods are kept running and continue serving traffic, avoiding an outage.',
                  },
                },
              ],
              docs: 'https://kubernetes.io/docs/concepts/workloads/controllers/deployment/#updating-a-deployment',
            },
            {
              id: 'k82-t1-c2',
              title: 'Rollback and scaling Deployments',
              summary:
                'Deployments keep a revision history so you can undo a bad rollout, and scaling is just changing the replica count — manually or automatically.',
              explanation:
                'Because a Deployment keeps the previous ReplicaSets (scaled to zero), it records a rollout history that you can inspect and revert. kubectl rollout history shows the revisions, and kubectl rollout undo rolls back to the previous one (or a specific revision), which is invaluable when a deploy goes wrong. Adding --record or, in modern kubectl, annotating with a change-cause helps you remember what each revision was. Scaling a Deployment is simply changing spec.replicas: kubectl scale or editing the manifest changes the desired count and the ReplicaSet converges. You can also let the HorizontalPodAutoscaler manage replicas based on load. A key operational habit is to keep deploys small and reversible: pin specific image tags (never latest), watch the rollout, and be ready to undo. The revisionHistoryLimit field controls how many old ReplicaSets are retained for rollback.',
              analogy:
                'Rollout history is the undo stack in a document editor: each save is a revision, and undo restores the previous one. Scaling is just dragging the quantity slider up or down.',
              keyPoints: [
                'rollout history lists revisions; rollout undo reverts to the previous (or a chosen) revision.',
                'Old ReplicaSets retained (up to revisionHistoryLimit) make rollback possible.',
                'Scaling = changing spec.replicas via kubectl scale, edit, or apply.',
                'Pin explicit image tags and avoid latest so rollbacks are deterministic.',
                'A HorizontalPodAutoscaler can manage replicas automatically.',
              ],
              code: {
                language: 'bash',
                lines: [
                  'kubectl rollout history deployment/web   # list revisions',
                  'kubectl rollout undo deployment/web      # revert to previous revision',
                  'kubectl rollout undo deployment/web --to-revision=3',
                  'kubectl scale deployment web --replicas=6 # change desired count',
                ],
                explanation:
                  'undo restores a previous ReplicaSet (rolling back the image/template), and scale changes the desired replica count, which the controller reconciles.',
              },
              commonMistakes: [
                'Using the latest tag, which makes rollbacks ambiguous and rollouts non-reproducible.',
                'Setting revisionHistoryLimit to 0, which removes the ability to roll back.',
              ],
              exercises: [
                {
                  type: 'task',
                  prompt: 'A new deploy of web is broken. Write the command to roll it back to the previous version.',
                  solution: {
                    lines: ['kubectl rollout undo deployment/web'],
                    explanation:
                      'undo scales the previous ReplicaSet back up and the bad one down, reverting the change.',
                  },
                },
                {
                  type: 'quiz',
                  prompt: 'Why should you avoid the image tag latest in Deployments?',
                  solution: {
                    explanation:
                      'latest is mutable, so different pulls can get different images and a rollback to latest does not reliably restore the old code. Pin explicit, immutable tags.',
                  },
                },
                {
                  type: 'predict',
                  prompt: 'revisionHistoryLimit is set to 2 and you have done five deploys. How many revisions can you roll back to?',
                  solution: {
                    explanation:
                      'Only the two most recent old ReplicaSets are retained, so you can roll back across roughly the last two revisions; older history is garbage-collected.',
                  },
                },
              ],
              docs: 'https://kubernetes.io/docs/concepts/workloads/controllers/deployment/#rolling-back-a-deployment',
            },
          ],
        },
        {
          id: 'k82-t2',
          name: 'Other controllers',
          concepts: [
            {
              id: 'k82-t2-c0',
              title: 'StatefulSets',
              summary:
                'StatefulSets run stateful apps that need stable network identities, ordered startup, and stable per-pod storage — things Deployments do not provide.',
              explanation:
                'Deployments treat pods as interchangeable cattle, which is wrong for databases and clustered systems that need stable identity. A StatefulSet gives each pod a stable, ordinal name (web-0, web-1, web-2) that persists across rescheduling, a stable network identity via a headless Service (each pod gets a predictable DNS name), and stable storage through a volumeClaimTemplate that creates a dedicated PersistentVolumeClaim per pod which is reattached to the same ordinal even after a restart. Pods are created, scaled and updated in order (web-0 before web-1) and deleted in reverse, which matters for systems that elect a leader or join members one at a time. This makes StatefulSets the right choice for databases, message brokers and other clustered stateful software. The trade-off is more complexity and slower operations; if your app is stateless, a Deployment is simpler and better.',
              analogy:
                'A Deployment is a pool of identical temp workers; a StatefulSet is a team with assigned desks and name badges — person 0 always sits at desk 0 with their own locker, and they are onboarded and dismissed in a defined order.',
              keyPoints: [
                'StatefulSets give pods stable ordinal names that survive rescheduling.',
                'A headless Service provides stable per-pod DNS identities.',
                'volumeClaimTemplate gives each pod its own persistent storage, reattached by ordinal.',
                'Pods are created/updated in order and deleted in reverse order.',
                'Use for databases and clustered systems; use Deployments for stateless apps.',
              ],
              code: {
                language: 'yaml',
                lines: [
                  'apiVersion: apps/v1',
                  'kind: StatefulSet',
                  'metadata:',
                  '  name: db',
                  'spec:',
                  '  serviceName: db          # the headless Service',
                  '  replicas: 3',
                  '  selector:',
                  '    matchLabels:',
                  '      app: db',
                  '  template:',
                  '    metadata:',
                  '      labels:',
                  '        app: db',
                  '    spec:',
                  '      containers:',
                  '        - name: db',
                  '          image: postgres:16',
                  '  volumeClaimTemplates:',
                  '    - metadata:',
                  '        name: data',
                  '      spec:',
                  '        accessModes: [ReadWriteOnce]',
                  '        resources:',
                  '          requests:',
                  '            storage: 10Gi',
                ],
                explanation:
                  'Each replica gets a stable name (db-0..db-2) and its own 10Gi PVC from the template, reattached to the same ordinal across restarts.',
              },
              commonMistakes: [
                'Using a StatefulSet for a stateless app, adding needless ordering complexity.',
                'Forgetting the required headless Service named in serviceName, breaking stable DNS.',
              ],
              exercises: [
                {
                  type: 'quiz',
                  prompt: 'Name three guarantees a StatefulSet provides that a Deployment does not.',
                  solution: {
                    explanation:
                      'Stable, ordinal pod names; stable per-pod network identity via a headless Service; and stable, dedicated per-pod storage via volumeClaimTemplates (plus ordered creation/deletion).',
                  },
                },
                {
                  type: 'predict',
                  prompt: 'Pod db-1 of a StatefulSet is deleted and rescheduled to another node. What name and storage does it get?',
                  solution: {
                    explanation:
                      'It comes back as db-1 (same ordinal name) and its existing PersistentVolumeClaim (data-db-1) is reattached, so it keeps its data and identity.',
                  },
                },
                {
                  type: 'quiz',
                  prompt: 'In what order are StatefulSet pods created and deleted?',
                  hint: 'Forward up, reverse down.',
                  solution: {
                    explanation:
                      'Created and scaled up in ascending ordinal order (0, 1, 2...) and deleted/scaled down in reverse order (highest ordinal first).',
                  },
                },
              ],
              docs: 'https://kubernetes.io/docs/concepts/workloads/controllers/statefulset/',
            },
            {
              id: 'k82-t2-c1',
              title: 'DaemonSets',
              summary:
                'A DaemonSet ensures a copy of a pod runs on every node (or a selected subset) — ideal for per-node agents like log collectors and monitoring.',
              explanation:
                'Some workloads must run once per node rather than as a pool of replicas: a log shipper that reads each node\'s logs, a monitoring agent collecting node metrics, a CNI networking plugin, or a storage daemon. A DaemonSet handles this by automatically scheduling one pod on every node that matches its node selector, and crucially it reacts to the cluster topology: when a new node joins, the DaemonSet adds a pod there automatically, and when a node leaves, its pod is removed. You do not set a replica count — the count is implicitly the number of matching nodes. You can target a subset of nodes with nodeSelector or affinity (for example only GPU nodes), and DaemonSet pods often need tolerations so they can run even on control-plane or tainted nodes. Because they are infrastructure-level, DaemonSet pods frequently run with elevated permissions and host mounts, so they warrant extra security scrutiny.',
              analogy:
                'A DaemonSet is like assigning one security guard to every floor of a building automatically — open a new floor and a guard is posted there; close a floor and the guard leaves. You never specify a guard count, just the rule one per floor.',
              keyPoints: [
                'Runs exactly one pod per matching node; no replica count is set.',
                'Automatically adds/removes pods as nodes join or leave the cluster.',
                'Ideal for log collectors, monitoring agents, CNI plugins, node storage daemons.',
                'Use nodeSelector/affinity to target a subset, and tolerations to run on tainted nodes.',
              ],
              diagram: {
                type: 'mermaid',
                lines: [
                  'flowchart LR',
                  '  DS[DaemonSet] --> N1[Node 1 agent pod]',
                  '  DS --> N2[Node 2 agent pod]',
                  '  DS --> N3[Node 3 agent pod]',
                ],
                caption: 'A DaemonSet places one pod on every matching node and tracks node membership.',
              },
              exercises: [
                {
                  type: 'quiz',
                  prompt: 'Why does a DaemonSet not have a replicas field?',
                  solution: {
                    explanation:
                      'Its replica count is implicit — exactly one pod per matching node — so it scales automatically with the number of nodes rather than a fixed number you set.',
                  },
                },
                {
                  type: 'predict',
                  prompt: 'A DaemonSet runs a log agent on all nodes. A new worker node is added to the cluster. What happens?',
                  solution: {
                    explanation:
                      'The DaemonSet controller automatically schedules a log-agent pod onto the new node so coverage stays at one-per-node.',
                  },
                },
                {
                  type: 'quiz',
                  prompt: 'What feature lets a DaemonSet run on tainted control-plane nodes?',
                  hint: 'It is the counterpart to a taint.',
                  solution: {
                    explanation:
                      'Tolerations — the DaemonSet pod tolerates the node\'s taints so the scheduler is allowed to place it there.',
                  },
                },
              ],
              docs: 'https://kubernetes.io/docs/concepts/workloads/controllers/daemonset/',
            },
            {
              id: 'k82-t2-c2',
              title: 'Jobs and CronJobs',
              summary:
                'A Job runs pods to successful completion for batch or one-off tasks; a CronJob runs a Job on a schedule, like cron.',
              explanation:
                'Not every workload runs forever. A Job runs one or more pods until a specified number complete successfully, then stops — perfect for batch processing, migrations, or one-off tasks. Jobs use restartPolicy OnFailure or Never (never Always, which would prevent completion) and support completions (how many successful runs are needed) and parallelism (how many run at once), so you can fan out work across many pods. backoffLimit caps retries on failure, and activeDeadlineSeconds bounds total runtime. A CronJob is a higher-level object that creates Jobs on a schedule defined with standard cron syntax, useful for nightly reports, backups or cleanup. CronJobs add scheduling controls: concurrencyPolicy decides whether overlapping runs are allowed, and startingDeadlineSeconds handles missed schedules. Together, Jobs and CronJobs cover batch and scheduled work that Deployments (built for always-on services) are unsuited for.',
              analogy:
                'A Job is a task on a to-do list you cross off once it is done; a CronJob is a recurring calendar reminder that creates that task automatically every night at 2am.',
              keyPoints: [
                'Job runs pods until a target number complete successfully, then stops.',
                'restartPolicy must be OnFailure or Never; completions and parallelism control fan-out.',
                'backoffLimit caps retries; activeDeadlineSeconds bounds runtime.',
                'CronJob creates Jobs on a cron schedule for recurring work.',
                'concurrencyPolicy controls overlapping CronJob runs.',
              ],
              code: {
                language: 'yaml',
                lines: [
                  'apiVersion: batch/v1',
                  'kind: CronJob',
                  'metadata:',
                  '  name: nightly-backup',
                  'spec:',
                  '  schedule: 0 2 * * *        # every day at 02:00',
                  '  concurrencyPolicy: Forbid',
                  '  jobTemplate:',
                  '    spec:',
                  '      backoffLimit: 3',
                  '      template:',
                  '        spec:',
                  '          restartPolicy: OnFailure',
                  '          containers:',
                  '            - name: backup',
                  '              image: backup-tool:1.2',
                ],
                explanation:
                  'This CronJob runs a backup Job nightly at 02:00; Forbid prevents a new run if the previous one is still going, and backoffLimit retries up to three times on failure.',
              },
              commonMistakes: [
                'Setting restartPolicy: Always on a Job, which is invalid and prevents completion.',
                'Ignoring concurrencyPolicy so long-running CronJobs pile up overlapping executions.',
              ],
              exercises: [
                {
                  type: 'quiz',
                  prompt: 'Why can a Job not use restartPolicy: Always?',
                  solution: {
                    explanation:
                      'Always would keep restarting the container even after success, so the Job could never reach the completed state. Jobs use OnFailure or Never.',
                  },
                },
                {
                  type: 'task',
                  prompt: 'Write the cron schedule string for a CronJob that runs every day at 02:00.',
                  solution: {
                    lines: ['0 2 * * *'],
                    explanation:
                      'The fields are minute hour day-of-month month day-of-week; 0 2 * * * means minute 0 of hour 2, every day.',
                  },
                },
                {
                  type: 'predict',
                  prompt: 'A CronJob with concurrencyPolicy Forbid is scheduled hourly, but one run takes 90 minutes. What happens to the next scheduled run?',
                  solution: {
                    explanation:
                      'Forbid skips the new run because the previous Job is still active, so the overlapping execution is not started.',
                  },
                },
              ],
              docs: 'https://kubernetes.io/docs/concepts/workloads/controllers/cron-jobs/',
            },
          ],
        },
      ],
    },
    /* ───────────────────── LEVEL 3 — NETWORKING & EXPOSURE ───────────────────── */
    {
      level: 3,
      name: 'Networking and exposure',
      focus: 'How pods are reached: Services, Ingress, DNS, and the cluster network model',
      accent: '#326ce5',
      soft: '#e7eefc',
      topics: [
        {
          id: 'k83-t0',
          name: 'Services',
          concepts: [
            {
              id: 'k83-t0-c0',
              title: 'Why Services exist and ClusterIP',
              summary:
                'Pods are ephemeral with changing IPs, so you never talk to them directly. A Service gives a stable virtual IP and DNS name that load-balances across a set of pods.',
              explanation:
                'Pod IPs are not stable — pods come and go and each gets a fresh IP, so hard-coding a pod IP is hopeless. A Service solves this by providing a stable virtual IP (the ClusterIP) and a stable DNS name that front a dynamic set of pods chosen by a label selector. Traffic to the Service is load-balanced across the healthy, ready pods behind it, and as pods are created or destroyed the Service\'s backend set updates automatically through an object called Endpoints (or EndpointSlices). ClusterIP is the default Service type and is only reachable from inside the cluster, which is exactly what you want for internal communication between microservices. The Service decouples callers from the churn of individual pods: callers address the stable Service, and Kubernetes handles the mapping to whatever pods currently exist and pass readiness.',
              analogy:
                'A Service is like a company\'s main phone number with an automatic call distributor: you always dial the same number (stable IP/DNS) and it routes you to whichever available agent (pod) is free, even as agents come and go.',
              keyPoints: [
                'Pod IPs are ephemeral; a Service provides a stable virtual IP and DNS name.',
                'A Service selects pods by label and load-balances across the ready ones.',
                'The backend set is tracked automatically via Endpoints/EndpointSlices.',
                'ClusterIP (the default) is reachable only inside the cluster — for internal traffic.',
              ],
              diagram: {
                type: 'mermaid',
                lines: [
                  'flowchart LR',
                  '  Caller[Caller pod] --> Svc[Service ClusterIP]',
                  '  Svc --> P1[Pod 1]',
                  '  Svc --> P2[Pod 2]',
                  '  Svc --> P3[Pod 3]',
                ],
                caption: 'A ClusterIP Service load-balances internal traffic across the pods it selects.',
              },
              code: {
                language: 'yaml',
                lines: [
                  'apiVersion: v1',
                  'kind: Service',
                  'metadata:',
                  '  name: web',
                  'spec:',
                  '  selector:',
                  '    app: web',
                  '  ports:',
                  '    - port: 80          # the Service port',
                  '      targetPort: 8080  # the container port',
                ],
                explanation:
                  'This ClusterIP Service exposes port 80 and forwards to container port 8080 on any pod labelled app: web.',
              },
              commonMistakes: [
                'Hard-coding pod IPs instead of using the Service name — pod IPs change constantly.',
                'Mismatching targetPort with the actual containerPort, so traffic reaches nothing.',
              ],
              exercises: [
                {
                  type: 'quiz',
                  prompt: 'Why can you not just connect to a pod\'s IP directly for a long-lived service?',
                  solution: {
                    explanation:
                      'Pod IPs are ephemeral — pods are recreated with new IPs — so a direct pod IP becomes stale. A Service gives a stable address that tracks the live pods.',
                  },
                },
                {
                  type: 'quiz',
                  prompt: 'What is the scope of a ClusterIP Service?',
                  hint: 'Inside or outside?',
                  solution: {
                    explanation:
                      'It is reachable only from within the cluster; it is the default type, used for internal pod-to-pod communication.',
                  },
                },
                {
                  type: 'predict',
                  prompt: 'A Service selects app: web, and you delete one of three web pods. What does the Service do?',
                  solution: {
                    explanation:
                      'The Service\'s endpoints update to remove the deleted pod and a controller-created replacement is added once ready, so traffic keeps flowing to the remaining/ new healthy pods automatically.',
                  },
                },
              ],
              docs: 'https://kubernetes.io/docs/concepts/services-networking/service/',
            },
            {
              id: 'k83-t0-c1',
              title: 'NodePort and LoadBalancer',
              summary:
                'NodePort exposes a Service on a port on every node; LoadBalancer provisions an external cloud load balancer in front. Both build on ClusterIP.',
              explanation:
                'ClusterIP is internal-only, so to let traffic in from outside the cluster you use NodePort or LoadBalancer. A NodePort Service opens the same high port (default range 30000 to 32767) on every node and forwards it to the Service, so you can reach the app at any node\'s IP on that port. It is simple but exposes raw node IPs and odd ports, so it is mostly used for development or as a building block. A LoadBalancer Service goes further: on a cloud provider it provisions an external load balancer (an AWS NLB/ELB, GCP load balancer, etc.) with a stable external IP or hostname that distributes traffic to the nodes. Crucially these types are layered — a LoadBalancer Service is also a NodePort, which is also a ClusterIP — each adds a layer of exposure on top of the previous. For HTTP traffic with many services, though, a single Ingress in front is usually cheaper and more flexible than one LoadBalancer per service.',
              analogy:
                'ClusterIP is an internal office extension; NodePort is opening a side door with a numbered key on every building; LoadBalancer is hiring a professional receptionist out front with a public street address who directs visitors inside.',
              keyPoints: [
                'NodePort opens a port (30000-32767) on every node, forwarding to the Service.',
                'LoadBalancer provisions an external cloud load balancer with a stable external address.',
                'Service types are layered: LoadBalancer includes NodePort includes ClusterIP.',
                'For many HTTP services, one Ingress is usually better than many LoadBalancers.',
              ],
              diagram: {
                type: 'mermaid',
                lines: [
                  'flowchart LR',
                  '  Internet --> LB[Cloud load balancer]',
                  '  LB --> NodePort[NodePort on nodes]',
                  '  NodePort --> Svc[ClusterIP Service]',
                  '  Svc --> Pods[Pods]',
                ],
                caption: 'LoadBalancer builds on NodePort which builds on ClusterIP to bring external traffic to pods.',
              },
              commonMistakes: [
                'Creating one LoadBalancer per HTTP service, which multiplies cloud cost — use an Ingress instead.',
                'Expecting NodePort to give a friendly URL; it exposes raw node IPs on high ports.',
              ],
              exercises: [
                {
                  type: 'quiz',
                  prompt: 'How are the Service types ClusterIP, NodePort and LoadBalancer related?',
                  solution: {
                    explanation:
                      'They are layered: a NodePort Service also has a ClusterIP, and a LoadBalancer Service also has a NodePort and ClusterIP — each type adds an outer layer of exposure.',
                  },
                },
                {
                  type: 'task',
                  prompt: 'Write a command to expose an existing Deployment named web as a LoadBalancer on port 80.',
                  solution: {
                    lines: ['kubectl expose deployment web --type=LoadBalancer --port=80 --target-port=8080'],
                    explanation:
                      'This creates a LoadBalancer Service; on a cloud provider it provisions an external load balancer routing port 80 to container port 8080.',
                  },
                },
                {
                  type: 'predict',
                  prompt: 'You create a LoadBalancer Service on a bare-metal cluster with no cloud integration. What happens to the external IP?',
                  solution: {
                    explanation:
                      'It stays in Pending because there is no cloud controller to provision a load balancer; you would need something like MetalLB to fulfil LoadBalancer Services on bare metal.',
                  },
                },
              ],
              docs: 'https://kubernetes.io/docs/concepts/services-networking/service/#publishing-services-service-types',
            },
            {
              id: 'k83-t0-c2',
              title: 'Headless Services and kube-proxy',
              summary:
                'A headless Service (clusterIP: None) returns pod IPs directly via DNS instead of load-balancing through a virtual IP. kube-proxy implements normal Service routing on each node.',
              explanation:
                'Sometimes you do not want a single virtual IP and load balancing — you want to discover the individual pods. A headless Service, declared with clusterIP: None, has no virtual IP; instead a DNS lookup of the Service returns the IP addresses of all the matching pods (and, with a StatefulSet, stable per-pod DNS names like db-0.db). This is essential for stateful clustered apps where a client needs to address specific members, such as a database leader. For ordinary (non-headless) Services, the routing is implemented by kube-proxy, which runs on every node and programs the kernel\'s networking rules — using iptables (the common default) or IPVS for higher performance at scale — so that packets to the ClusterIP are rewritten to one of the backend pod IPs. kube-proxy watches the API server for Service and Endpoint changes and keeps these rules current. Understanding that kube-proxy does data-plane routing at the node level, while DNS does name resolution, clarifies how a Service request actually reaches a pod.',
              analogy:
                'A normal Service is a single hotline that connects you to any available agent; a headless Service is a printed staff directory listing every agent\'s direct line so you can call a specific person. kube-proxy is the switchboard wiring that makes the hotline actually connect.',
              keyPoints: [
                'Headless Service (clusterIP: None) returns pod IPs via DNS instead of one virtual IP.',
                'Headless + StatefulSet gives stable per-pod DNS names (db-0.db).',
                'kube-proxy programs node iptables/IPVS rules to route ClusterIP traffic to pods.',
                'kube-proxy watches the API server and updates rules as endpoints change.',
              ],
              code: {
                language: 'yaml',
                lines: [
                  'apiVersion: v1',
                  'kind: Service',
                  'metadata:',
                  '  name: db',
                  'spec:',
                  '  clusterIP: None      # headless',
                  '  selector:',
                  '    app: db',
                  '  ports:',
                  '    - port: 5432',
                ],
                explanation:
                  'With clusterIP: None there is no virtual IP; DNS for db resolves to the individual pod IPs, and with a StatefulSet each pod also gets a stable name like db-0.db.',
              },
              exercises: [
                {
                  type: 'quiz',
                  prompt: 'What does a DNS lookup of a headless Service return, compared with a normal ClusterIP Service?',
                  solution: {
                    explanation:
                      'A headless Service returns the IPs of all matching pods directly; a normal ClusterIP Service returns the single virtual IP that load-balances across pods.',
                  },
                },
                {
                  type: 'quiz',
                  prompt: 'What is kube-proxy\'s role in Service networking?',
                  hint: 'Data plane on each node.',
                  solution: {
                    explanation:
                      'It runs on each node and programs iptables or IPVS rules so traffic to a Service ClusterIP is forwarded to one of the backing pod IPs, updating as endpoints change.',
                  },
                },
                {
                  type: 'predict',
                  prompt: 'Why might a StatefulSet need a headless Service rather than a normal one?',
                  solution: {
                    explanation:
                      'Stateful members often must address each other individually (e.g. a specific replica). A headless Service gives stable per-pod DNS names, which a load-balancing virtual IP cannot.',
                  },
                },
              ],
              docs: 'https://kubernetes.io/docs/concepts/services-networking/service/#headless-services',
            },
          ],
        },
        {
          id: 'k83-t1',
          name: 'Ingress and DNS',
          concepts: [
            {
              id: 'k83-t1-c0',
              title: 'Ingress and Ingress controllers',
              summary:
                'Ingress is an object describing HTTP/HTTPS routing rules; an Ingress controller is the running proxy that implements them. The rules do nothing without a controller.',
              explanation:
                'An Ingress lets you expose many HTTP services through a single external entry point with smart routing — by hostname (shop.example.com versus api.example.com) and by path (/api versus /web) — plus TLS termination. The Ingress object is just a set of rules; it has no effect on its own. You must run an Ingress controller, a pod (or pods) running a reverse proxy such as the NGINX Ingress controller, Traefik, or a cloud controller, that watches Ingress objects and configures itself to route accordingly. This is a common gotcha: people apply an Ingress and wonder why nothing works, when in fact no controller is installed. With a controller in place you typically need only one external LoadBalancer (in front of the controller) to serve dozens of services, which is far cheaper than one LoadBalancer each. The newer Gateway API is the evolving successor that addresses Ingress\'s limitations with a more expressive, role-oriented model, but Ingress remains very widely used.',
              analogy:
                'The Ingress object is a building directory listing which suite each company occupies; the Ingress controller is the actual receptionist who reads the directory and walks each visitor to the right suite. A directory with no receptionist guides no one.',
              keyPoints: [
                'Ingress defines HTTP/HTTPS routing rules by host and path, plus TLS termination.',
                'An Ingress controller (NGINX, Traefik, cloud) must be running to enforce the rules.',
                'Applying an Ingress with no controller installed does nothing — a classic gotcha.',
                'One controller behind a single LoadBalancer can serve many services cheaply.',
                'The Gateway API is the more expressive successor, but Ingress is still common.',
              ],
              diagram: {
                type: 'mermaid',
                lines: [
                  'flowchart LR',
                  '  Internet --> Ctrl[Ingress controller]',
                  '  Ctrl --> ApiSvc[api Service]',
                  '  Ctrl --> WebSvc[web Service]',
                ],
                caption: 'One Ingress controller routes by host/path to multiple backend Services.',
              },
              code: {
                language: 'yaml',
                lines: [
                  'apiVersion: networking.k8s.io/v1',
                  'kind: Ingress',
                  'metadata:',
                  '  name: site',
                  'spec:',
                  '  ingressClassName: nginx',
                  '  rules:',
                  '    - host: shop.example.com',
                  '      http:',
                  '        paths:',
                  '          - path: /',
                  '            pathType: Prefix',
                  '            backend:',
                  '              service:',
                  '                name: web',
                  '                port:',
                  '                  number: 80',
                ],
                explanation:
                  'This routes shop.example.com to the web Service. ingressClassName selects which installed controller handles it; without that controller the rule is inert.',
              },
              commonMistakes: [
                'Creating an Ingress without installing an Ingress controller, so nothing routes.',
                'Forgetting ingressClassName, so no controller claims the Ingress.',
              ],
              exercises: [
                {
                  type: 'quiz',
                  prompt: 'What is the difference between an Ingress object and an Ingress controller?',
                  solution: {
                    explanation:
                      'The Ingress object is a declarative set of routing rules; the Ingress controller is the running proxy that reads those rules and actually routes traffic. Rules without a controller do nothing.',
                  },
                },
                {
                  type: 'quiz',
                  prompt: 'Why is an Ingress usually cheaper than many LoadBalancer Services for HTTP apps?',
                  solution: {
                    explanation:
                      'One Ingress controller behind a single external load balancer can route to many services by host/path, instead of provisioning (and paying for) a separate cloud load balancer per service.',
                  },
                },
                {
                  type: 'predict',
                  prompt: 'You apply a valid Ingress but no controller is installed in the cluster. What happens to traffic?',
                  solution: {
                    explanation:
                      'Nothing routes — the Ingress is just stored rules with no proxy to enforce them. You must install an Ingress controller for it to take effect.',
                  },
                },
              ],
              docs: 'https://kubernetes.io/docs/concepts/services-networking/ingress/',
            },
            {
              id: 'k83-t1-c1',
              title: 'Cluster DNS and service discovery',
              summary:
                'CoreDNS gives every Service a DNS name so pods discover each other by name. The pattern is service.namespace.svc.cluster.local.',
              explanation:
                'Service discovery in Kubernetes is done through DNS, served by CoreDNS running in the cluster. Every Service automatically gets a DNS record, so a pod can reach another service simply by name rather than by IP. Within the same namespace you can use the short name (http://web), and across namespaces you use service.namespace (http://web.shop). The fully qualified form is service.namespace.svc.cluster.local. Pods are configured (via their /etc/resolv.conf search domains) so the short name resolves correctly in the local namespace. This name-based discovery is what makes microservices loosely coupled: code refers to stable names, and the names resolve to whatever Service virtual IP currently fronts the live pods. CoreDNS is itself a Deployment fronted by a Service, and it is a frequent troubleshooting target — if name resolution breaks across the cluster, CoreDNS is the first place to look.',
              analogy:
                'CoreDNS is the cluster\'s internal phone book: instead of memorising everyone\'s ever-changing number (IP), you look people up by name and always get connected.',
              keyPoints: [
                'CoreDNS provides in-cluster DNS so pods find Services by name.',
                'Same namespace: short name (web); cross-namespace: web.namespace.',
                'Full form: service.namespace.svc.cluster.local.',
                'Name-based discovery keeps microservices loosely coupled.',
                'If cluster-wide name resolution fails, check CoreDNS first.',
              ],
              code: {
                language: 'bash',
                lines: [
                  '# from inside a pod, reach a Service in the same namespace',
                  'curl http://web',
                  '# reach a Service in another namespace',
                  'curl http://web.shop.svc.cluster.local',
                  '# inspect CoreDNS pods',
                  'kubectl get pods -n kube-system -l k8s-app=kube-dns',
                ],
                explanation:
                  'Pods resolve short names within their namespace; the FQDN works from anywhere. CoreDNS runs in kube-system and answers these lookups.',
              },
              commonMistakes: [
                'Using a short Service name across namespaces, which does not resolve — include the namespace.',
                'Overlooking CoreDNS when debugging intermittent name-resolution failures.',
              ],
              exercises: [
                {
                  type: 'quiz',
                  prompt: 'What is the fully qualified DNS name of a Service named api in namespace prod?',
                  hint: 'service.namespace.svc.cluster.local.',
                  solution: {
                    explanation:
                      'api.prod.svc.cluster.local — service name, namespace, then the cluster DNS suffix svc.cluster.local.',
                  },
                },
                {
                  type: 'predict',
                  prompt: 'A pod in namespace web tries to reach a Service named cache that lives in namespace data using just http://cache. Does it work?',
                  solution: {
                    explanation:
                      'No — the short name resolves only within the pod\'s own namespace. It must use cache.data (or the FQDN cache.data.svc.cluster.local).',
                  },
                },
                {
                  type: 'quiz',
                  prompt: 'Which component answers in-cluster DNS queries, and where does it run?',
                  solution: {
                    explanation:
                      'CoreDNS, running as a Deployment in the kube-system namespace and fronted by a Service (typically labelled k8s-app=kube-dns).',
                  },
                },
              ],
              docs: 'https://kubernetes.io/docs/concepts/services-networking/dns-pod-service/',
            },
            {
              id: 'k83-t1-c2',
              title: 'ExternalName and external endpoints',
              summary:
                'An ExternalName Service maps an in-cluster name to an external DNS name via a CNAME, letting pods reach external systems through a stable internal name.',
              explanation:
                'Not everything you call lives in the cluster — you may need to reach a managed database or a third-party API. An ExternalName Service does no proxying and has no selector or pods; instead it creates a DNS CNAME that maps an internal Service name to an external DNS name. So a pod can connect to db.prod.svc.cluster.local and DNS redirects it to, say, mydb.rds.amazonaws.com. The value is indirection: your application code uses a stable internal name, and if the external host changes you update one Service rather than every app. Because it is purely a DNS alias, ExternalName does not load-balance, does not terminate TLS, and only works for things addressable by hostname. If instead you need to point a Service at fixed external IPs, you create a Service without a selector and define its Endpoints/EndpointSlice manually. Both techniques let cluster-native discovery extend to systems outside the cluster.',
              analogy:
                'ExternalName is a mail-forwarding address: you keep handing out one internal address, and the post office (DNS) quietly forwards everything to whatever external address you have set, which you can change without telling anyone.',
              keyPoints: [
                'ExternalName maps an internal Service name to an external DNS name via a CNAME.',
                'It has no selector, pods, or proxying — it is pure DNS indirection.',
                'Apps use a stable internal name; you change one Service if the external host moves.',
                'For fixed external IPs, use a selector-less Service with manual Endpoints instead.',
              ],
              code: {
                language: 'yaml',
                lines: [
                  'apiVersion: v1',
                  'kind: Service',
                  'metadata:',
                  '  name: db',
                  '  namespace: prod',
                  'spec:',
                  '  type: ExternalName',
                  '  externalName: mydb.rds.amazonaws.com',
                ],
                explanation:
                  'Pods that connect to db.prod.svc.cluster.local are CNAME-redirected to mydb.rds.amazonaws.com; the app code never sees the external hostname.',
              },
              commonMistakes: [
                'Expecting ExternalName to load-balance or terminate TLS — it only aliases DNS.',
                'Using ExternalName when the target has only IPs, not a hostname (use manual Endpoints instead).',
              ],
              exercises: [
                {
                  type: 'quiz',
                  prompt: 'How does an ExternalName Service route traffic?',
                  solution: {
                    explanation:
                      'It does not route or proxy — it returns a DNS CNAME pointing the internal Service name at an external DNS name, and the client connects directly to that external host.',
                  },
                },
                {
                  type: 'predict',
                  prompt: 'You want a Service that fronts an on-prem database reachable only by IP (no DNS name). Will ExternalName work?',
                  solution: {
                    explanation:
                      'No — ExternalName needs a hostname for the CNAME. For raw IPs, create a Service without a selector and define the Endpoints/EndpointSlice with those IPs manually.',
                  },
                },
                {
                  type: 'quiz',
                  prompt: 'What is the main benefit of pointing apps at an ExternalName Service instead of the external host directly?',
                  solution: {
                    explanation:
                      'Indirection: apps use one stable internal name, and if the external endpoint changes you update a single Service rather than reconfiguring every application.',
                  },
                },
              ],
              docs: 'https://kubernetes.io/docs/concepts/services-networking/service/#externalname',
            },
          ],
        },
        {
          id: 'k83-t2',
          name: 'Network model and policies',
          concepts: [
            {
              id: 'k83-t2-c0',
              title: 'The flat network model and CNI',
              summary:
                'Kubernetes mandates a flat network where every pod gets its own IP and can reach every other pod without NAT. A CNI plugin implements this network.',
              explanation:
                'Kubernetes defines a simple networking model with strict rules: every pod gets its own unique IP address, every pod can communicate with every other pod across nodes without network address translation, and agents on a node (like the kubelet) can reach pods on that node. This flat, NAT-free model means pods see each other by their real IPs, which keeps the mental model simple. Kubernetes itself does not implement this network, though — it delegates to a plugin conforming to the Container Network Interface (CNI). Popular CNI plugins include Calico, Cilium, Flannel and the cloud providers\' own plugins; they handle assigning pod IPs and wiring up cross-node connectivity (via overlays, routing, or eBPF). The choice of CNI matters because it determines performance characteristics and which advanced features, such as NetworkPolicy enforcement, are available. Understanding that the flat model is a contract fulfilled by a pluggable CNI explains why two clusters can behave differently at the network layer.',
              analogy:
                'The flat network is like a city where every house has a unique street address and any house can send mail to any other directly — no PO boxes or forwarding. The CNI is the postal service company you hire to actually build and run that delivery system.',
              keyPoints: [
                'Every pod gets a unique IP; all pods can reach each other without NAT.',
                'Kubernetes specifies the model but delegates implementation to a CNI plugin.',
                'CNI plugins: Calico, Cilium, Flannel, cloud-native plugins — each with trade-offs.',
                'The CNI determines performance and feature support such as NetworkPolicy.',
              ],
              diagram: {
                type: 'mermaid',
                lines: [
                  'flowchart LR',
                  '  PodA[Pod A on node1] --> PodB[Pod B on node2]',
                  '  CNI[CNI plugin] --> PodA',
                  '  CNI --> PodB',
                ],
                caption: 'A CNI plugin gives each pod an IP and enables direct, NAT-free pod-to-pod traffic across nodes.',
              },
              exercises: [
                {
                  type: 'quiz',
                  prompt: 'State two rules of the Kubernetes network model.',
                  solution: {
                    explanation:
                      'Every pod has its own unique IP, and every pod can communicate with every other pod (across nodes) without NAT.',
                  },
                },
                {
                  type: 'quiz',
                  prompt: 'What does CNI stand for and why does the choice of CNI plugin matter?',
                  hint: 'It is a pluggable interface.',
                  solution: {
                    explanation:
                      'Container Network Interface. The plugin implements the pod network, so it determines performance, the networking approach (overlay/routing/eBPF), and which features like NetworkPolicy are enforced.',
                  },
                },
                {
                  type: 'predict',
                  prompt: 'Pod A on node 1 wants to reach pod B on node 2 by pod B\'s IP. Under the standard model, does this require NAT?',
                  solution: {
                    explanation:
                      'No. The model guarantees pods reach each other across nodes without NAT, so pod A connects to pod B\'s real IP directly (assuming no NetworkPolicy blocks it).',
                  },
                },
              ],
              docs: 'https://kubernetes.io/docs/concepts/cluster-administration/networking/',
            },
            {
              id: 'k83-t2-c1',
              title: 'NetworkPolicy',
              summary:
                'By default all pods can talk to all pods. NetworkPolicy lets you restrict that — selecting pods and allowing only specified ingress/egress, enforced by the CNI.',
              explanation:
                'The flat network is open by default: any pod can reach any other, which is convenient but insecure for multi-tenant or sensitive workloads. A NetworkPolicy is a firewall expressed in Kubernetes terms. It selects a set of pods with a podSelector and then defines allowed ingress (incoming) and/or egress (outgoing) traffic by source/destination pods, namespaces, or IP blocks, and by port. The crucial behaviour is the default-deny flip: as soon as any NetworkPolicy selects a pod for a direction, that pod becomes deny-by-default for that direction, and only the explicitly listed traffic is permitted. So a policy that selects a pod with an empty ingress rule blocks all incoming traffic to it. Policies are additive (allow rules combine; there is no deny rule). Critically, NetworkPolicies are only enforced if your CNI supports them — applying a policy on a CNI that ignores them gives a false sense of security. A common production pattern is to apply a default-deny policy per namespace and then add explicit allow rules.',
              analogy:
                'The default network is an open-plan office where anyone can walk to anyone. A NetworkPolicy is installing keycard doors around a team: once a door exists, you can only enter if your card is on the allow list — and a door with an empty list lets no one in.',
              keyPoints: [
                'Default: all pods can communicate; NetworkPolicy restricts this.',
                'A policy selects pods and lists allowed ingress/egress by pod, namespace, IP and port.',
                'Selecting a pod flips it to default-deny for that direction; only listed traffic is allowed.',
                'Policies are additive allow-lists; there is no explicit deny rule.',
                'Only enforced if the CNI supports NetworkPolicy — otherwise it is silently ignored.',
              ],
              code: {
                language: 'yaml',
                lines: [
                  'apiVersion: networking.k8s.io/v1',
                  'kind: NetworkPolicy',
                  'metadata:',
                  '  name: api-allow-web',
                  '  namespace: prod',
                  'spec:',
                  '  podSelector:',
                  '    matchLabels:',
                  '      app: api',
                  '  policyTypes: [Ingress]',
                  '  ingress:',
                  '    - from:',
                  '        - podSelector:',
                  '            matchLabels:',
                  '              app: web',
                  '      ports:',
                  '        - port: 8080',
                ],
                explanation:
                  'This makes api pods deny-by-default for ingress, then allows only pods labelled app: web to reach them on port 8080.',
              },
              commonMistakes: [
                'Assuming a NetworkPolicy is enforced when the CNI does not support it.',
                'Forgetting that selecting a pod with no matching allow rule blocks all that-direction traffic to it.',
              ],
              exercises: [
                {
                  type: 'quiz',
                  prompt: 'What happens to a pod\'s ingress traffic the moment a NetworkPolicy selects it for Ingress?',
                  solution: {
                    explanation:
                      'It becomes default-deny for ingress: only traffic explicitly allowed by the policy\'s ingress rules is permitted; everything else is blocked.',
                  },
                },
                {
                  type: 'predict',
                  prompt: 'You apply a default-deny ingress policy in namespace prod, but pods can still talk freely. What is the most likely cause?',
                  solution: {
                    explanation:
                      'The CNI in use does not enforce NetworkPolicy. The policy is accepted by the API but silently has no effect; switch to a policy-capable CNI like Calico or Cilium.',
                  },
                },
                {
                  type: 'quiz',
                  prompt: 'Can a NetworkPolicy contain a deny rule to block a specific source?',
                  hint: 'Think allow-list.',
                  solution: {
                    explanation:
                      'No. NetworkPolicies are additive allow-lists. You achieve blocking by selecting the pod (default-deny) and only allowing the sources you want; there is no explicit deny.',
                  },
                },
              ],
              docs: 'https://kubernetes.io/docs/concepts/services-networking/network-policies/',
            },
          ],
        },
      ],
    },
    /* ───────────────────── LEVEL 4 — CONFIG, STORAGE & SCALING ───────────────────── */
    {
      level: 4,
      name: 'Configuration, storage and scaling',
      focus: 'Externalising config and secrets, persisting data, and managing and autoscaling resources',
      accent: '#326ce5',
      soft: '#e7eefc',
      topics: [
        {
          id: 'k84-t0',
          name: 'ConfigMaps and Secrets',
          concepts: [
            {
              id: 'k84-t0-c0',
              title: 'ConfigMaps: externalising configuration',
              summary:
                'A ConfigMap stores non-sensitive configuration as key-value pairs, decoupling config from the container image so the same image runs in any environment.',
              explanation:
                'You should never bake environment-specific config (URLs, feature flags, tuning values) into a container image, because then dev, staging and prod need different images. A ConfigMap holds that configuration as key-value pairs in the cluster, separate from the image. You consume it in two main ways: inject values as environment variables into the container, or mount it as files in a volume where each key becomes a file. Environment variables are simple but are read only at container start, so changing the ConfigMap does not update them until the pod restarts. Mounted files, by contrast, are updated in place over time (with a short delay), so apps that re-read config files can pick up changes without a restart. ConfigMaps are namespaced and have a size limit (around 1MiB), so they suit configuration, not large blobs. This separation is the foundation of build once, run anywhere — the same image plus a different ConfigMap per environment.',
              analogy:
                'A ConfigMap is like the settings menu of an app, kept separate from the app\'s code. You ship one app and flip settings per device rather than compiling a new app for every preference.',
              keyPoints: [
                'ConfigMaps store non-sensitive config as key-value pairs outside the image.',
                'Consume as environment variables (read at start) or mounted files (updated live).',
                'Env-var values do not change until the pod restarts; mounted files refresh in place.',
                'Namespaced, with about a 1MiB size limit — for config, not large data.',
                'Enables one image to run across all environments with different ConfigMaps.',
              ],
              code: {
                language: 'yaml',
                lines: [
                  'apiVersion: v1',
                  'kind: ConfigMap',
                  'metadata:',
                  '  name: app-config',
                  'data:',
                  '  LOG_LEVEL: info',
                  '  FEATURE_FLAG: enabled',
                  '---',
                  'apiVersion: v1',
                  'kind: Pod',
                  'metadata:',
                  '  name: app',
                  'spec:',
                  '  containers:',
                  '    - name: app',
                  '      image: myapp:1.0',
                  '      envFrom:',
                  '        - configMapRef:',
                  '            name: app-config',
                ],
                explanation:
                  'envFrom injects every key in the ConfigMap as an environment variable. Because these are read at start, editing the ConfigMap requires a pod restart to take effect.',
              },
              commonMistakes: [
                'Expecting env-var-injected ConfigMap values to update without restarting the pod.',
                'Storing secrets in a ConfigMap — use a Secret for sensitive data.',
              ],
              exercises: [
                {
                  type: 'quiz',
                  prompt: 'What are the two main ways to consume a ConfigMap in a pod, and how do they differ on live updates?',
                  solution: {
                    explanation:
                      'As environment variables (read once at container start, so a change needs a restart) or as mounted files in a volume (updated in place over time, so apps re-reading files can pick up changes without a restart).',
                  },
                },
                {
                  type: 'predict',
                  prompt: 'You edit a ConfigMap injected via env vars while the pod is running. Does the running container see the new value?',
                  solution: {
                    explanation:
                      'No. Environment variables are set at start, so the running container keeps the old value until the pod is restarted (e.g. by a rollout).',
                  },
                },
                {
                  type: 'task',
                  prompt: 'Write a command to create a ConfigMap named app-config with LOG_LEVEL=debug from the CLI.',
                  solution: {
                    lines: ['kubectl create configmap app-config --from-literal=LOG_LEVEL=debug'],
                    explanation:
                      '--from-literal sets a key directly; you can also use --from-file to load files as keys.',
                  },
                },
              ],
              docs: 'https://kubernetes.io/docs/concepts/configuration/configmap/',
            },
            {
              id: 'k84-t0-c1',
              title: 'Secrets and the base64 caveat',
              summary:
                'Secrets hold sensitive data like passwords and tokens. They look like ConfigMaps but are base64-encoded, not encrypted — real protection needs encryption at rest and RBAC.',
              explanation:
                'A Secret is the object for sensitive configuration — passwords, API keys, TLS certificates, registry credentials. Its API shape mirrors a ConfigMap and you consume it the same way (env vars or mounted files), but the values are base64-encoded. The single most important thing to understand is that base64 is encoding, not encryption — anyone who can read the Secret can trivially decode it, so a Secret is not secure by itself. Real protection comes from layers: enabling encryption at rest so etcd stores Secrets encrypted, locking down who can read Secrets with RBAC, and avoiding leaking them into logs. There are typed Secrets (kubernetes.io/tls for certs, kubernetes.io/dockerconfigjson for pull credentials) that integrate with specific features. Many teams go further and integrate an external secrets manager (AWS Secrets Manager, Vault) via tools like the External Secrets Operator so the source of truth lives outside the cluster. Treating base64 as security is the classic beginner mistake.',
              analogy:
                'Base64-encoding a Secret is like writing a password in mirror writing: it looks scrambled but anyone can read it in a mirror. Real security is putting it in a locked safe (encryption at rest) and controlling who has the key (RBAC).',
              keyPoints: [
                'Secrets store sensitive data; consumed like ConfigMaps (env or files).',
                'Values are base64-encoded, which is encoding, NOT encryption.',
                'Protect with encryption at rest in etcd, tight RBAC, and no logging of values.',
                'Typed Secrets exist for TLS and image-pull credentials.',
                'For stronger control, integrate an external secrets manager.',
              ],
              code: {
                language: 'bash',
                lines: [
                  '# create a Secret from literals (values get base64-encoded by the API)',
                  'kubectl create secret generic db-cred --from-literal=password=s3cr3t',
                  '',
                  '# anyone with read access can decode it — base64 is not encryption',
                  'kubectl get secret db-cred -o jsonpath=\'{.data.password}\' | base64 -d',
                ],
                explanation:
                  'The second command shows how trivially a base64 Secret is decoded, underscoring why encryption at rest and RBAC are the real protections.',
              },
              commonMistakes: [
                'Believing base64-encoded Secrets are encrypted or secure on their own.',
                'Granting broad read access to Secrets instead of scoping it tightly with RBAC.',
                'Committing Secret manifests with real values into git.',
              ],
              exercises: [
                {
                  type: 'quiz',
                  prompt: 'Why is base64 encoding not a security measure for Secrets?',
                  solution: {
                    explanation:
                      'Base64 is a reversible encoding with no key — anyone who can read the Secret object can decode the original value instantly. Security requires encryption at rest and RBAC.',
                  },
                },
                {
                  type: 'quiz',
                  prompt: 'Name two real protections for Secrets in a cluster.',
                  hint: 'One in etcd, one on access.',
                  solution: {
                    explanation:
                      'Encryption at rest so etcd stores Secrets encrypted, and tight RBAC limiting who can read Secrets (plus optionally an external secrets manager).',
                  },
                },
                {
                  type: 'predict',
                  prompt: 'A developer has get permission on Secrets in a namespace. Can they obtain the plaintext password stored in a Secret there?',
                  solution: {
                    explanation:
                      'Yes — with read access they can fetch the Secret and base64-decode it. This is why Secret read access must be tightly controlled.',
                  },
                },
              ],
              docs: 'https://kubernetes.io/docs/concepts/configuration/secret/',
            },
            {
              id: 'k84-t0-c2',
              title: 'Immutability and config best practices',
              summary:
                'Marking ConfigMaps and Secrets immutable prevents accidental changes and improves performance. Versioning config names forces safe, explicit rollouts.',
              explanation:
                'ConfigMaps and Secrets can be marked immutable: true, which means their data can never be changed after creation — to alter config you create a new object instead. This has two benefits: it protects against accidental edits that could break running apps, and it improves cluster performance because the kubelet no longer needs to watch immutable objects for changes (reducing API server load at scale). Combined with this, a strong practice is to version the names of your config objects (app-config-v2 rather than editing app-config in place) and reference the new name in the Deployment. Because changing the pod template triggers a rollout, this turns a config change into a controlled, observable, rollback-able deployment rather than a silent live edit. Without versioning, editing a ConfigMap consumed as env vars does not even restart pods, so the change may not take effect until some unrelated future restart — a confusing failure mode. Treat config like code: version it, review it, and roll it out deliberately.',
              analogy:
                'Immutable config is like publishing a numbered edition of a document instead of editing the original: you cannot accidentally change a copy in someone\'s hands, and to update you issue edition 2 and tell everyone to switch.',
              keyPoints: [
                'immutable: true freezes a ConfigMap/Secret; to change it, create a new one.',
                'Immutability prevents accidental edits and reduces kubelet/API watch overhead at scale.',
                'Version config object names and reference the new name to trigger a rollout.',
                'Versioned config makes changes controlled, observable and reversible.',
                'Editing env-var ConfigMaps in place may not restart pods, so changes can silently lag.',
              ],
              code: {
                language: 'yaml',
                lines: [
                  'apiVersion: v1',
                  'kind: ConfigMap',
                  'metadata:',
                  '  name: app-config-v2',
                  'immutable: true',
                  'data:',
                  '  LOG_LEVEL: warn',
                ],
                explanation:
                  'This ConfigMap cannot be edited. To change config you create app-config-v3 and update the Deployment to reference it, which triggers a clean rollout.',
              },
              commonMistakes: [
                'Editing a ConfigMap in place and assuming all pods immediately pick up the change.',
                'Reusing the same config name forever, so config changes are silent and unreviewed.',
              ],
              exercises: [
                {
                  type: 'quiz',
                  prompt: 'What are two benefits of marking a ConfigMap immutable?',
                  solution: {
                    explanation:
                      'It prevents accidental changes to data relied on by running apps, and it improves performance/scalability because the kubelet no longer watches it for updates.',
                  },
                },
                {
                  type: 'predict',
                  prompt: 'Instead of editing app-config in place, you create app-config-v2 and point the Deployment at it. What happens?',
                  solution: {
                    explanation:
                      'Changing the pod template (the ConfigMap reference) triggers a rolling update, so the new config rolls out in a controlled, observable way that can be rolled back.',
                  },
                },
                {
                  type: 'quiz',
                  prompt: 'How do you change the data of an immutable ConfigMap?',
                  hint: 'You do not edit it.',
                  solution: {
                    explanation:
                      'You cannot edit it. You create a new ConfigMap (typically with a new versioned name) and update references to point at it.',
                  },
                },
              ],
              docs: 'https://kubernetes.io/docs/concepts/configuration/configmap/#configmap-immutable',
            },
          ],
        },
        {
          id: 'k84-t1',
          name: 'Storage',
          concepts: [
            {
              id: 'k84-t1-c0',
              title: 'Volumes and ephemeral storage',
              summary:
                'A container\'s filesystem is wiped on restart. Volumes attach storage to a pod that survives container restarts; emptyDir is a common pod-scoped scratch volume.',
              explanation:
                'A container\'s writable layer is ephemeral: when the container restarts, anything written there is lost. A Volume is storage mounted into a pod that outlives individual container restarts within that pod. The simplest is emptyDir, an empty directory created when the pod is assigned to a node and deleted when the pod is removed — useful as scratch space or for sharing files between containers in the same pod (since they all mount the same volume). Other volume types project data in: a configMap or secret volume mounts that object\'s keys as files, and a downwardAPI volume exposes pod metadata. The key limitation of these pod-scoped volumes is lifetime — emptyDir dies with the pod, so it is not for data you must keep. For durable storage that survives the pod entirely, you need PersistentVolumes, covered next. Understanding that a Volume\'s lifetime is tied to the pod (not the container) is the bridge to understanding why persistence needs something more.',
              analogy:
                'A container filesystem is a whiteboard wiped each time the presenter leaves; an emptyDir volume is a shared notepad in the meeting room that lasts the whole meeting (the pod) but is thrown out when the meeting ends.',
              keyPoints: [
                'Container writable layers are lost on restart.',
                'A Volume is mounted into the pod and survives container restarts within the pod.',
                'emptyDir is pod-scoped scratch/shared space, deleted when the pod is removed.',
                'configMap, secret and downwardAPI volumes project data into the pod as files.',
                'For data that outlives the pod, use PersistentVolumes (next concept).',
              ],
              code: {
                language: 'yaml',
                lines: [
                  'apiVersion: v1',
                  'kind: Pod',
                  'metadata:',
                  '  name: shared',
                  'spec:',
                  '  containers:',
                  '    - name: writer',
                  '      image: busybox:1.36',
                  '      command: [sh, -c, echo hi > /data/msg; sleep 3600]',
                  '      volumeMounts:',
                  '        - name: scratch',
                  '          mountPath: /data',
                  '    - name: reader',
                  '      image: busybox:1.36',
                  '      command: [sh, -c, cat /data/msg; sleep 3600]',
                  '      volumeMounts:',
                  '        - name: scratch',
                  '          mountPath: /data',
                  '  volumes:',
                  '    - name: scratch',
                  '      emptyDir: {}',
                ],
                explanation:
                  'Both containers mount the same emptyDir at /data, so the writer and reader share files. The volume lives as long as the pod and is then deleted.',
              },
              commonMistakes: [
                'Using emptyDir for data that must survive the pod — it is deleted when the pod is removed.',
                'Confusing a Volume\'s lifetime (pod) with the container\'s (restarts).',
              ],
              exercises: [
                {
                  type: 'quiz',
                  prompt: 'What is the lifetime of an emptyDir volume?',
                  solution: {
                    explanation:
                      'It lives as long as the pod: created when the pod is scheduled to a node and deleted when the pod is removed. It survives container restarts but not pod deletion.',
                  },
                },
                {
                  type: 'predict',
                  prompt: 'A single container in a pod restarts (crash). Does data written to its emptyDir volume survive?',
                  solution: {
                    explanation:
                      'Yes — the volume is tied to the pod, not the container, so a container restart keeps the emptyDir contents. Only removing the pod deletes them.',
                  },
                },
                {
                  type: 'quiz',
                  prompt: 'Why can two containers in one pod easily share files via emptyDir?',
                  hint: 'Same volume, same pod.',
                  solution: {
                    explanation:
                      'Both containers mount the same emptyDir volume, and pod containers share storage, so files one writes are visible to the other.',
                  },
                },
              ],
              docs: 'https://kubernetes.io/docs/concepts/storage/volumes/',
            },
            {
              id: 'k84-t1-c1',
              title: 'PersistentVolumes and PersistentVolumeClaims',
              summary:
                'A PersistentVolume is a piece of durable storage in the cluster; a PersistentVolumeClaim is a pod\'s request for storage. The two bind, decoupling apps from storage details.',
              explanation:
                'Durable storage in Kubernetes uses a request-and-supply model with two objects. A PersistentVolume (PV) represents an actual piece of storage — an EBS volume, an NFS share, a cloud disk — with a capacity and access mode. A PersistentVolumeClaim (PVC) is a request made by a workload: I need 10Gi of ReadWriteOnce storage. Kubernetes binds a suitable PV to the PVC, and the pod mounts the PVC. This decoupling means application authors ask for storage abstractly (via a PVC) without knowing the underlying infrastructure, while cluster admins (or dynamic provisioning) supply the PVs. Access modes matter: ReadWriteOnce (RWO) means the volume is mounted read-write by a single node, ReadOnlyMany (ROX) by many nodes read-only, and ReadWriteMany (RWX) by many nodes read-write (only some storage supports RWX). The reclaim policy (Delete or Retain) decides what happens to the underlying storage when the PVC is deleted — Retain keeps the data for safety, Delete cleans it up. A PVC bound to a PV keeps a pod\'s data across pod restarts and rescheduling.',
              analogy:
                'A PersistentVolumeClaim is like a hotel booking request (I need a room with two beds), and a PersistentVolume is an actual room. The front desk (Kubernetes) matches your request to a room; you never need to know the room number in advance.',
              keyPoints: [
                'PV = a real piece of durable storage; PVC = a pod\'s request for storage.',
                'Kubernetes binds a matching PV to a PVC; the pod mounts the PVC.',
                'This decouples app authors (ask abstractly) from storage admins (supply PVs).',
                'Access modes: ReadWriteOnce, ReadOnlyMany, ReadWriteMany (RWX needs supporting storage).',
                'Reclaim policy Retain keeps data after PVC deletion; Delete removes it.',
              ],
              code: {
                language: 'yaml',
                lines: [
                  'apiVersion: v1',
                  'kind: PersistentVolumeClaim',
                  'metadata:',
                  '  name: data',
                  'spec:',
                  '  accessModes: [ReadWriteOnce]',
                  '  resources:',
                  '    requests:',
                  '      storage: 10Gi',
                  '  storageClassName: standard',
                ],
                explanation:
                  'This PVC asks for 10Gi of RWO storage from the standard StorageClass; Kubernetes binds or dynamically provisions a matching PV, which the pod then mounts.',
              },
              commonMistakes: [
                'Requesting ReadWriteMany on storage that only supports ReadWriteOnce, so the claim cannot satisfy multi-node mounts.',
                'Leaving reclaim policy as Delete on production data, losing the volume when the PVC is removed.',
              ],
              exercises: [
                {
                  type: 'quiz',
                  prompt: 'What is the difference between a PersistentVolume and a PersistentVolumeClaim?',
                  solution: {
                    explanation:
                      'A PV is the actual storage resource available in the cluster; a PVC is a workload\'s request for storage. Kubernetes binds a matching PV to the PVC, which the pod then mounts.',
                  },
                },
                {
                  type: 'quiz',
                  prompt: 'What does the access mode ReadWriteOnce mean?',
                  hint: 'How many nodes, what access?',
                  solution: {
                    explanation:
                      'The volume can be mounted as read-write by a single node at a time (multiple pods on that same node may share it, depending on specifics).',
                  },
                },
                {
                  type: 'predict',
                  prompt: 'A PVC has reclaim policy Retain. You delete the PVC. What happens to the underlying data?',
                  solution: {
                    explanation:
                      'With Retain, the underlying storage and its data are kept (the PV moves to Released state) rather than deleted, so data can be recovered manually.',
                  },
                },
              ],
              docs: 'https://kubernetes.io/docs/concepts/storage/persistent-volumes/',
            },
            {
              id: 'k84-t1-c2',
              title: 'StorageClasses and dynamic provisioning',
              summary:
                'A StorageClass defines a type of storage and a provisioner. With dynamic provisioning, a PVC automatically triggers creation of a matching PV — no pre-provisioning by admins.',
              explanation:
                'Manually creating a PV for every PVC does not scale. A StorageClass solves this by describing a class of storage (its provisioner, parameters like disk type, and reclaim policy) and enabling dynamic provisioning. When a PVC references a StorageClass (or uses the cluster\'s default StorageClass), Kubernetes calls the class\'s provisioner — typically a CSI (Container Storage Interface) driver for the cloud or storage system — to create a brand-new PV on demand that exactly matches the claim, then binds it. This means developers just create PVCs and get storage automatically. StorageClasses can also set volumeBindingMode: WaitForFirstConsumer, which delays provisioning until a pod is scheduled so the volume is created in the right zone (important in multi-zone clusters where a disk in zone A cannot attach to a pod in zone B). The CSI standard is how all modern storage integrations work, replacing the older in-tree volume plugins. A cluster usually has one default StorageClass so PVCs without an explicit class still get provisioned.',
              analogy:
                'A StorageClass is like choosing a shipping tier (standard, express, refrigerated) when ordering: you pick the tier and the warehouse automatically produces and dispatches exactly what you need, instead of someone pre-stocking every possible package by hand.',
              keyPoints: [
                'A StorageClass defines a storage type, its provisioner (CSI driver) and parameters.',
                'Dynamic provisioning auto-creates a matching PV when a PVC references the class.',
                'CSI is the standard interface for storage drivers, replacing in-tree plugins.',
                'WaitForFirstConsumer delays provisioning until scheduling for correct zone placement.',
                'A default StorageClass serves PVCs that do not name a class explicitly.',
              ],
              diagram: {
                type: 'mermaid',
                lines: [
                  'flowchart LR',
                  '  PVC[PVC requests storage] --> SC[StorageClass]',
                  '  SC --> Prov[CSI provisioner]',
                  '  Prov --> PV[New PV created]',
                  '  PV --> Bound[Bound to PVC]',
                ],
                caption: 'Dynamic provisioning: a PVC triggers the StorageClass provisioner to create and bind a PV automatically.',
              },
              code: {
                language: 'yaml',
                lines: [
                  'apiVersion: storage.k8s.io/v1',
                  'kind: StorageClass',
                  'metadata:',
                  '  name: fast',
                  'provisioner: ebs.csi.aws.com',
                  'parameters:',
                  '  type: gp3',
                  'volumeBindingMode: WaitForFirstConsumer',
                  'reclaimPolicy: Delete',
                ],
                explanation:
                  'A PVC naming this class triggers the EBS CSI driver to create a gp3 volume, provisioned only once a pod is scheduled so it lands in the right zone.',
              },
              commonMistakes: [
                'Having no default StorageClass, so PVCs without an explicit class stay Pending forever.',
                'Using Immediate binding in multi-zone clusters, risking a volume in the wrong zone.',
              ],
              exercises: [
                {
                  type: 'quiz',
                  prompt: 'What does dynamic provisioning do when a PVC references a StorageClass?',
                  solution: {
                    explanation:
                      'It invokes the class\'s provisioner (a CSI driver) to create a new PV that matches the PVC\'s request and binds it automatically, so no admin pre-creates the PV.',
                  },
                },
                {
                  type: 'predict',
                  prompt: 'A PVC is created with no storageClassName and the cluster has no default StorageClass. What happens?',
                  solution: {
                    explanation:
                      'The PVC stays Pending because there is no class to provision a PV and no matching pre-created PV — nothing satisfies the claim.',
                  },
                },
                {
                  type: 'quiz',
                  prompt: 'Why use volumeBindingMode WaitForFirstConsumer in a multi-zone cluster?',
                  hint: 'Disks are zonal.',
                  solution: {
                    explanation:
                      'It delays creating the volume until a pod is scheduled, so the volume is provisioned in the same zone as the pod — avoiding a disk that cannot attach because it is in another zone.',
                  },
                },
              ],
              docs: 'https://kubernetes.io/docs/concepts/storage/storage-classes/',
            },
          ],
        },
        {
          id: 'k84-t2',
          name: 'Resources and autoscaling',
          concepts: [
            {
              id: 'k84-t2-c0',
              title: 'Resource requests and limits',
              summary:
                'Requests tell the scheduler how much CPU/memory a container needs (used for placement); limits cap how much it may use. They behave very differently for CPU and memory.',
              explanation:
                'Every container can declare resource requests and limits for CPU and memory. The request is what the scheduler reserves: it places the pod on a node with at least that much free capacity, and it is the basis for bin-packing the cluster. The limit is the hard ceiling enforced at runtime. The two resources behave differently when a limit is hit. CPU is compressible: a container exceeding its CPU limit is throttled (slowed) but not killed. Memory is incompressible: a container exceeding its memory limit is killed with an OOMKilled status, because you cannot throttle memory. CPU is measured in cores or millicores (500m = half a core); memory in bytes with suffixes like Mi and Gi. Setting requests too low causes overcommit and contention; too high wastes capacity. Crucially, requests and limits also determine a pod\'s Quality of Service class, which affects who gets evicted first under node pressure. Getting these numbers right is core to both reliability and cost.',
              analogy:
                'A request is the seat you reserve on a flight (guaranteed to you); a limit is the maximum carry-on you are allowed. Go over your CPU baggage and they make you repack slowly (throttle); go over your memory baggage and they remove you from the flight (OOMKill).',
              keyPoints: [
                'Request = reserved amount the scheduler uses for placement; limit = runtime ceiling.',
                'CPU is compressible: over the limit means throttling, not death.',
                'Memory is incompressible: over the limit means OOMKilled.',
                'CPU in cores/millicores (500m = 0.5 core); memory in Mi/Gi.',
                'Requests and limits together set the pod\'s QoS class.',
              ],
              code: {
                language: 'yaml',
                lines: [
                  'containers:',
                  '  - name: app',
                  '    image: myapp:1.0',
                  '    resources:',
                  '      requests:',
                  '        cpu: 250m',
                  '        memory: 256Mi',
                  '      limits:',
                  '        cpu: 500m',
                  '        memory: 512Mi',
                ],
                explanation:
                  'The scheduler reserves 250m CPU and 256Mi memory; at runtime the container is throttled above 500m CPU and OOMKilled if it exceeds 512Mi memory.',
              },
              commonMistakes: [
                'Setting no requests, so the scheduler cannot place pods sensibly and nodes get overcommitted.',
                'Setting a memory limit too low, causing OOMKilled crashes under normal load.',
              ],
              exercises: [
                {
                  type: 'quiz',
                  prompt: 'What happens when a container exceeds its CPU limit versus its memory limit?',
                  solution: {
                    explanation:
                      'Exceeding the CPU limit throttles the container (CPU is compressible). Exceeding the memory limit kills it with OOMKilled (memory is incompressible).',
                  },
                },
                {
                  type: 'quiz',
                  prompt: 'What does the resource request influence that the limit does not?',
                  hint: 'Think placement.',
                  solution: {
                    explanation:
                      'The request drives scheduling — the scheduler reserves it and places the pod on a node with that much free capacity. The limit is only a runtime ceiling, not used for placement.',
                  },
                },
                {
                  type: 'predict',
                  prompt: 'A container has memory limit 256Mi and a memory leak slowly grows usage to 300Mi. What status will you see?',
                  solution: {
                    explanation:
                      'The container is OOMKilled when it exceeds 256Mi; if managed by a controller it restarts, and a recurring leak shows up as repeated OOMKilled restarts.',
                  },
                },
              ],
              docs: 'https://kubernetes.io/docs/concepts/configuration/manage-resources-containers/',
            },
            {
              id: 'k84-t2-c1',
              title: 'QoS classes and resource quotas',
              summary:
                'Kubernetes assigns each pod a QoS class (Guaranteed, Burstable, BestEffort) from its requests/limits, used during eviction. ResourceQuotas cap aggregate usage per namespace.',
              explanation:
                'From a pod\'s requests and limits, Kubernetes derives a Quality of Service class that decides eviction order when a node runs low on resources. Guaranteed pods (every container has equal requests and limits for both CPU and memory) are the most protected and evicted last. Burstable pods (at least one request set, but not equal to limits) are in the middle. BestEffort pods (no requests or limits at all) are evicted first under memory pressure. So setting requests and limits is not just about a single pod — it affects survival priority. Separately, ResourceQuotas constrain aggregate consumption within a namespace: total CPU/memory requested, total limits, or counts of objects like pods and services. This lets platform teams give each team a budget so one namespace cannot starve the cluster. LimitRanges complement quotas by setting per-pod/container defaults and min/max bounds, which also helps ensure pods have requests so they get a sensible QoS class rather than BestEffort.',
              analogy:
                'QoS classes are like airline fare tiers during an oversold flight: first class (Guaranteed) is bumped last, economy with a seat assignment (Burstable) next, and standby passengers with no reservation (BestEffort) are bumped first. A ResourceQuota is the airline capping how many seats each travel agency can book.',
              keyPoints: [
                'QoS classes: Guaranteed (requests == limits), Burstable (some requests), BestEffort (none).',
                'Under node pressure, BestEffort is evicted first, Guaranteed last.',
                'ResourceQuota caps aggregate CPU/memory and object counts per namespace.',
                'LimitRange sets default and min/max requests/limits per container.',
                'Setting requests/limits controls both placement and eviction priority.',
              ],
              diagram: {
                type: 'mermaid',
                lines: [
                  'flowchart LR',
                  '  Pressure[Node memory pressure] --> Best[Evict BestEffort first]',
                  '  Best --> Burst[Then Burstable]',
                  '  Burst --> Guar[Guaranteed evicted last]',
                ],
                caption: 'Eviction order under node pressure follows the QoS class, from BestEffort to Guaranteed.',
              },
              code: {
                language: 'yaml',
                lines: [
                  'apiVersion: v1',
                  'kind: ResourceQuota',
                  'metadata:',
                  '  name: team-quota',
                  '  namespace: team-a',
                  'spec:',
                  '  hard:',
                  '    requests.cpu: \'4\'',
                  '    requests.memory: 8Gi',
                  '    limits.cpu: \'8\'',
                  '    pods: \'20\'',
                ],
                explanation:
                  'This quota caps namespace team-a to 4 CPU and 8Gi of requested resources, 8 CPU of limits, and at most 20 pods, preventing it from monopolising the cluster.',
              },
              commonMistakes: [
                'Running important pods as BestEffort (no requests), so they are evicted first under pressure.',
                'Adding a ResourceQuota without a LimitRange, so pods with no requests are rejected by the quota.',
              ],
              exercises: [
                {
                  type: 'quiz',
                  prompt: 'How is a pod classified as Guaranteed QoS?',
                  solution: {
                    explanation:
                      'Every container in the pod must have CPU and memory requests set equal to its limits. Then the pod is Guaranteed and is evicted last under pressure.',
                  },
                },
                {
                  type: 'predict',
                  prompt: 'A node is under memory pressure. There are BestEffort, Burstable and Guaranteed pods. Which is evicted first?',
                  solution: {
                    explanation:
                      'The BestEffort pod (no requests/limits) is evicted first; Guaranteed pods are protected the longest.',
                  },
                },
                {
                  type: 'task',
                  prompt: 'Write a command to view the resource quota usage in namespace team-a.',
                  solution: {
                    lines: ['kubectl get resourcequota -n team-a -o yaml'],
                    explanation:
                      'The status section shows hard limits versus used, so you can see how much of the namespace budget is consumed.',
                  },
                },
              ],
              docs: 'https://kubernetes.io/docs/concepts/policy/resource-quotas/',
            },
            {
              id: 'k84-t2-c2',
              title: 'HorizontalPodAutoscaler',
              summary:
                'The HorizontalPodAutoscaler automatically scales a Deployment\'s replica count up or down based on observed metrics like CPU utilisation, keeping load within a target.',
              explanation:
                'The HorizontalPodAutoscaler (HPA) adjusts the number of pod replicas to match demand. You give it a target — for example keep average CPU utilisation at 50% — and it periodically compares observed metrics from the metrics-server (or custom/external metrics) to that target, then computes the replica count needed and updates the workload, within minReplicas and maxReplicas bounds. The classic formula is roughly desiredReplicas = ceil(currentReplicas * currentMetric / targetMetric). For HPA to read CPU/memory metrics the metrics-server must be installed, and the pods must have resource requests set (utilisation is measured relative to the request). HPA scales horizontally (more pods), as distinct from the VerticalPodAutoscaler which resizes a pod\'s requests/limits, and the Cluster Autoscaler which adds/removes nodes. HPA includes stabilisation and scaling-behaviour controls to avoid thrashing — scaling up quickly but down more cautiously. Combining HPA (right number of pods) with the Cluster Autoscaler (right number of nodes) is the standard pattern for elastic workloads.',
              analogy:
                'An HPA is like a restaurant manager watching how full the tables are: when the dining room hits the target busyness they call in more waiters (pods), and when it quiets down they send some home — always between a minimum and maximum staff level.',
              keyPoints: [
                'HPA scales replica count to hold a metric (e.g. CPU) at a target, within min/max.',
                'Requires the metrics-server and pods with resource requests for utilisation metrics.',
                'Formula: desired = ceil(current * currentMetric / targetMetric).',
                'Distinct from VerticalPodAutoscaler (resize pods) and Cluster Autoscaler (add nodes).',
                'Scaling behaviour/stabilisation settings prevent thrashing.',
              ],
              code: {
                language: 'yaml',
                lines: [
                  'apiVersion: autoscaling/v2',
                  'kind: HorizontalPodAutoscaler',
                  'metadata:',
                  '  name: web',
                  'spec:',
                  '  scaleTargetRef:',
                  '    apiVersion: apps/v1',
                  '    kind: Deployment',
                  '    name: web',
                  '  minReplicas: 2',
                  '  maxReplicas: 10',
                  '  metrics:',
                  '    - type: Resource',
                  '      resource:',
                  '        name: cpu',
                  '        target:',
                  '          type: Utilization',
                  '          averageUtilization: 50',
                ],
                explanation:
                  'This HPA keeps average CPU utilisation near 50% by scaling the web Deployment between 2 and 10 replicas. It needs the metrics-server and CPU requests on the pods.',
              },
              commonMistakes: [
                'Configuring CPU-based HPA without resource requests, so utilisation cannot be computed.',
                'Forgetting to install the metrics-server, leaving the HPA unable to read metrics.',
              ],
              exercises: [
                {
                  type: 'quiz',
                  prompt: 'What two prerequisites must be in place for a CPU-utilisation HPA to work?',
                  solution: {
                    explanation:
                      'The metrics-server must be installed to supply metrics, and the target pods must have CPU resource requests set (utilisation is measured relative to the request).',
                  },
                },
                {
                  type: 'predict',
                  prompt: 'An HPA targets 50% CPU. Average utilisation across 4 replicas rises to 100%. Roughly how many replicas will it want?',
                  solution: {
                    explanation:
                      'About 8: desired = ceil(4 * 100 / 50) = 8 (capped at maxReplicas). It doubles the replicas to bring utilisation back toward 50%.',
                  },
                },
                {
                  type: 'quiz',
                  prompt: 'How does HPA differ from the Cluster Autoscaler?',
                  hint: 'Pods versus nodes.',
                  solution: {
                    explanation:
                      'HPA changes the number of pod replicas based on metrics; the Cluster Autoscaler changes the number of nodes when pods cannot be scheduled or nodes are underused. They complement each other.',
                  },
                },
              ],
              docs: 'https://kubernetes.io/docs/tasks/run-application/horizontal-pod-autoscale/',
            },
          ],
        },
      ],
    },
    /* ───────────────────── LEVEL 5 — OPERATIONS & PRODUCTION ───────────────────── */
    {
      level: 5,
      name: 'Operations and production',
      focus: 'Security, observability and troubleshooting, and packaging and delivery for real clusters',
      accent: '#326ce5',
      soft: '#e7eefc',
      topics: [
        {
          id: 'k85-t0',
          name: 'Security',
          concepts: [
            {
              id: 'k85-t0-c0',
              title: 'ServiceAccounts and pod identity',
              summary:
                'A ServiceAccount is the identity a pod uses to talk to the Kubernetes API. Every pod gets one, and you should scope it tightly rather than relying on the default.',
              explanation:
                'When a pod needs to call the Kubernetes API (for example an operator or a controller), it authenticates as a ServiceAccount — the in-cluster identity for workloads, as opposed to user accounts for humans. Every pod is assigned a ServiceAccount; if you do not specify one it uses the namespace\'s default ServiceAccount. Kubernetes mounts a short-lived, automatically rotated token (a projected token bound to the pod) into the pod so it can authenticate. The security principle is least privilege: create a dedicated ServiceAccount per workload and grant it only the API permissions it needs via RBAC, rather than giving the default account broad rights. If a pod does not need the API at all, you can disable token mounting with automountServiceAccountToken: false to shrink its attack surface. On cloud platforms, ServiceAccounts also integrate with cloud IAM (such as IRSA on EKS or Workload Identity on GKE) so pods can assume cloud roles without static credentials. The identity is the foundation everything else (RBAC) builds on.',
              analogy:
                'A ServiceAccount is an employee badge for a robot worker (the pod). The badge proves who it is; what doors it opens is decided separately by RBAC. You give each robot its own badge with only the access it needs, not a master key.',
              keyPoints: [
                'ServiceAccounts are workload identities for calling the Kubernetes API.',
                'Every pod has one; unspecified means the namespace default ServiceAccount.',
                'A short-lived, auto-rotated projected token is mounted into the pod.',
                'Least privilege: one dedicated ServiceAccount per workload, scoped via RBAC.',
                'Disable token mounting if the pod does not need API access; integrate with cloud IAM.',
              ],
              code: {
                language: 'yaml',
                lines: [
                  'apiVersion: v1',
                  'kind: ServiceAccount',
                  'metadata:',
                  '  name: web-sa',
                  '  namespace: prod',
                  '---',
                  'apiVersion: apps/v1',
                  'kind: Deployment',
                  'metadata:',
                  '  name: web',
                  'spec:',
                  '  template:',
                  '    spec:',
                  '      serviceAccountName: web-sa',
                  '      automountServiceAccountToken: false',
                ],
                explanation:
                  'The pod runs as web-sa rather than the default account, and token automounting is off because this app does not call the API — both reduce risk.',
              },
              commonMistakes: [
                'Leaving workloads on the default ServiceAccount and granting it broad permissions.',
                'Mounting API tokens into pods that never call the API.',
              ],
              exercises: [
                {
                  type: 'quiz',
                  prompt: 'What is the difference between a ServiceAccount and a user account in Kubernetes?',
                  solution: {
                    explanation:
                      'A ServiceAccount is the identity used by workloads (pods) to authenticate to the API; user accounts are for humans. ServiceAccounts are managed in-cluster as objects, users typically come from external identity systems.',
                  },
                },
                {
                  type: 'quiz',
                  prompt: 'Why create a dedicated ServiceAccount per workload?',
                  hint: 'Least privilege.',
                  solution: {
                    explanation:
                      'So each workload can be granted only the specific RBAC permissions it needs, limiting blast radius if it is compromised, instead of sharing a broadly-permissioned default account.',
                  },
                },
                {
                  type: 'predict',
                  prompt: 'A pod has automountServiceAccountToken: false but tries to call the Kubernetes API. What happens?',
                  solution: {
                    explanation:
                      'No token is mounted, so the pod has no credentials to authenticate; API calls fail as unauthenticated. That is intended for workloads that should not touch the API.',
                  },
                },
              ],
              docs: 'https://kubernetes.io/docs/tasks/configure-pod-container/configure-service-account/',
            },
            {
              id: 'k85-t0-c1',
              title: 'RBAC: roles and bindings',
              summary:
                'Role-Based Access Control governs who can do what. Roles grant verbs on resources; bindings attach roles to subjects (users, groups, ServiceAccounts).',
              explanation:
                'RBAC is how Kubernetes decides whether an authenticated request is allowed. It has four object types in two pairs. A Role lists permissions — combinations of verbs (get, list, create, delete) on resources (pods, secrets) — within a single namespace; a ClusterRole does the same but cluster-wide or for cluster-scoped resources. A RoleBinding grants a Role (or ClusterRole) to subjects within a namespace; a ClusterRoleBinding grants a ClusterRole across the whole cluster. Subjects are users, groups, or ServiceAccounts. RBAC is purely additive and default-deny: there are no deny rules, and any action not explicitly granted is forbidden. The standard practice is least privilege — grant the narrowest Role in the narrowest scope that gets the job done, and prefer namespaced RoleBindings over cluster-wide ones. A very common pattern is a ClusterRole (reusable definition of a permission set) bound with a RoleBinding in a specific namespace, which combines reusability with tight scope. Avoid binding the powerful built-in cluster-admin ClusterRole except to true administrators.',
              analogy:
                'RBAC is a building access system: a Role is a keycard profile (which doors, which actions), and a binding is the act of assigning that profile to a specific person or robot badge. No profile assigned means no access — there is no need for an explicit do not enter sign.',
              keyPoints: [
                'Role/ClusterRole define permitted verbs on resources (namespaced vs cluster-wide).',
                'RoleBinding/ClusterRoleBinding attach roles to subjects (users, groups, ServiceAccounts).',
                'RBAC is additive and default-deny — anything not granted is denied.',
                'Least privilege: narrowest role in narrowest scope; prefer namespaced bindings.',
                'A common pattern: reusable ClusterRole bound via a namespaced RoleBinding.',
              ],
              code: {
                language: 'yaml',
                lines: [
                  'apiVersion: rbac.authorization.k8s.io/v1',
                  'kind: Role',
                  'metadata:',
                  '  namespace: prod',
                  '  name: pod-reader',
                  'rules:',
                  '  - apiGroups: [\'\']',
                  '    resources: [pods]',
                  '    verbs: [get, list, watch]',
                  '---',
                  'apiVersion: rbac.authorization.k8s.io/v1',
                  'kind: RoleBinding',
                  'metadata:',
                  '  namespace: prod',
                  '  name: web-sa-pod-reader',
                  'subjects:',
                  '  - kind: ServiceAccount',
                  '    name: web-sa',
                  'roleRef:',
                  '  kind: Role',
                  '  name: pod-reader',
                  '  apiGroup: rbac.authorization.k8s.io',
                ],
                explanation:
                  'The Role allows reading pods in prod; the RoleBinding grants that Role to the web-sa ServiceAccount, so it can list pods but nothing else.',
              },
              commonMistakes: [
                'Binding cluster-admin to ordinary workloads or users instead of a scoped role.',
                'Using ClusterRoleBindings when a namespaced RoleBinding would suffice, over-granting scope.',
              ],
              exercises: [
                {
                  type: 'quiz',
                  prompt: 'What is the difference between a Role and a RoleBinding?',
                  solution: {
                    explanation:
                      'A Role defines a set of permissions (verbs on resources); a RoleBinding grants that Role to specific subjects. The Role is the what; the binding is the who.',
                  },
                },
                {
                  type: 'quiz',
                  prompt: 'Can RBAC contain a rule that denies a specific action?',
                  hint: 'Additive model.',
                  solution: {
                    explanation:
                      'No. RBAC is additive and default-deny — it only has allow rules. You restrict by simply not granting; anything not explicitly allowed is denied.',
                  },
                },
                {
                  type: 'task',
                  prompt: 'Write a kubectl command to check whether ServiceAccount web-sa in namespace prod can list pods.',
                  solution: {
                    lines: ['kubectl auth can-i list pods --as=system:serviceaccount:prod:web-sa -n prod'],
                    explanation:
                      'auth can-i with --as impersonates the ServiceAccount to test its effective permissions, returning yes or no.',
                  },
                },
              ],
              docs: 'https://kubernetes.io/docs/reference/access-authn-authz/rbac/',
            },
            {
              id: 'k85-t0-c2',
              title: 'securityContext and Pod Security Standards',
              summary:
                'A securityContext hardens how containers run (non-root, read-only filesystem, dropped capabilities). Pod Security Standards define baseline and restricted policy levels enforced by the cluster.',
              explanation:
                'By default containers can run with more privilege than they need, which is dangerous if one is compromised. A securityContext (set on the pod or container) tightens this: runAsNonRoot and runAsUser prevent running as root, readOnlyRootFilesystem stops writes to the image filesystem, allowPrivilegeEscalation: false blocks gaining more privileges, and you can drop all Linux capabilities and add back only what is required. Avoid privileged: true unless absolutely necessary, as it effectively gives the container root on the node. To enforce these standards across many workloads, Kubernetes defines the Pod Security Standards: three levels — Privileged (unrestricted), Baseline (blocks known privilege escalations), and Restricted (heavily hardened, the recommended target). These are enforced by the built-in Pod Security Admission controller, which you enable per namespace with labels that set a mode (enforce, audit, warn) and a level. So you label a namespace to require the Restricted standard, and pods that violate it are rejected. Together, securityContext (per workload) and Pod Security Standards (per namespace policy) form the core of pod hardening.',
              analogy:
                'A securityContext is the safety gear each worker wears (no admin keys, gloves on, limited tools); Pod Security Standards are the site-wide safety regulations that refuse entry to anyone not properly geared up.',
              keyPoints: [
                'securityContext hardens containers: non-root, read-only FS, no privilege escalation, dropped caps.',
                'Avoid privileged: true — it is effectively root on the node.',
                'Pod Security Standards define three levels: Privileged, Baseline, Restricted.',
                'Pod Security Admission enforces a level per namespace via labels (enforce/audit/warn).',
                'Combine per-workload securityContext with per-namespace standards for defence in depth.',
              ],
              code: {
                language: 'yaml',
                lines: [
                  'spec:',
                  '  securityContext:',
                  '    runAsNonRoot: true',
                  '    runAsUser: 1000',
                  '  containers:',
                  '    - name: app',
                  '      image: myapp:1.0',
                  '      securityContext:',
                  '        allowPrivilegeEscalation: false',
                  '        readOnlyRootFilesystem: true',
                  '        capabilities:',
                  '          drop: [ALL]',
                ],
                explanation:
                  'The pod runs as non-root user 1000, the container cannot escalate privileges, its root filesystem is read-only, and all Linux capabilities are dropped.',
              },
              commonMistakes: [
                'Running containers as root with a writable filesystem and full capabilities by default.',
                'Using privileged: true for convenience, granting node-level root access.',
              ],
              exercises: [
                {
                  type: 'quiz',
                  prompt: 'Name three settings in a securityContext that harden a container.',
                  solution: {
                    explanation:
                      'For example runAsNonRoot/runAsUser (do not run as root), readOnlyRootFilesystem (no writes to image FS), allowPrivilegeEscalation: false, and dropping all capabilities.',
                  },
                },
                {
                  type: 'quiz',
                  prompt: 'What are the three Pod Security Standards levels, from least to most restrictive?',
                  hint: 'Recommended target is the strictest.',
                  solution: {
                    explanation:
                      'Privileged (unrestricted), Baseline (blocks known escalations), and Restricted (heavily hardened, the recommended default).',
                  },
                },
                {
                  type: 'predict',
                  prompt: 'A namespace is labelled to enforce the Restricted standard. You apply a pod that runs as root. What happens?',
                  solution: {
                    explanation:
                      'Pod Security Admission rejects the pod at creation because running as root violates the Restricted level enforced on that namespace.',
                  },
                },
              ],
              docs: 'https://kubernetes.io/docs/concepts/security/pod-security-standards/',
            },
          ],
        },
        {
          id: 'k85-t1',
          name: 'Observability and troubleshooting',
          concepts: [
            {
              id: 'k85-t1-c0',
              title: 'Logs, exec and debug',
              summary:
                'kubectl logs reads container output, exec runs commands inside a container, and debug attaches an ephemeral container — the core trio for diagnosing live pods.',
              explanation:
                'When something is wrong inside a running workload, three kubectl commands do most of the work. kubectl logs streams a container\'s stdout/stderr; add -f to follow, --previous to read the logs of a crashed previous container instance (essential for CrashLoopBackOff), and -c to pick a container in a multi-container pod. kubectl exec runs a command in a running container — kubectl exec -it pod -- sh gives you an interactive shell to inspect the environment, network and files. But many production images are minimal (distroless) and have no shell, which is where kubectl debug shines: it attaches an ephemeral debug container (with your chosen tooling image) into a running pod sharing its namespaces, or creates a copy of the pod for debugging, without modifying the original. The golden rule is to gather evidence from the live system before restarting, because a restart often erases the very state that explains the failure. These commands, plus events and metrics, are your primary troubleshooting toolkit.',
              analogy:
                'logs is reading the flight recorder, exec is climbing into the cockpit while the plane is flying to look around, and debug is sending in an inspector with their own toolkit when the cockpit has no instruments to use.',
              keyPoints: [
                'kubectl logs reads container output; -f follows, --previous reads a crashed instance, -c selects a container.',
                'kubectl exec -it runs commands/opens a shell inside a running container.',
                'kubectl debug attaches an ephemeral container, ideal for minimal/distroless images with no shell.',
                'Gather evidence before restarting — a restart can erase the failure state.',
              ],
              code: {
                language: 'bash',
                lines: [
                  'kubectl logs web-abc -f                 # follow logs',
                  'kubectl logs web-abc --previous        # logs of the crashed previous container',
                  'kubectl exec -it web-abc -- sh         # interactive shell in the container',
                  'kubectl debug -it web-abc --image=busybox:1.36 --target=app',
                ],
                explanation:
                  '--previous is key for CrashLoopBackOff. debug injects a busybox ephemeral container sharing the app container\'s process namespace so you can troubleshoot even a shell-less image.',
              },
              commonMistakes: [
                'Forgetting --previous, so you read the fresh restart\'s empty logs instead of the crash that mattered.',
                'Trying to exec a shell into a distroless image that has none — use kubectl debug instead.',
              ],
              exercises: [
                {
                  type: 'task',
                  prompt: 'A pod is in CrashLoopBackOff. Write the command to see the logs from the container instance that crashed.',
                  solution: {
                    lines: ['kubectl logs web-abc --previous'],
                    explanation:
                      '--previous reads the logs of the prior, crashed container instance, which contain the error; the current instance may have just started.',
                  },
                },
                {
                  type: 'quiz',
                  prompt: 'Why is kubectl debug useful for distroless images?',
                  solution: {
                    explanation:
                      'Distroless images have no shell or debugging tools, so exec cannot give you a shell. debug attaches an ephemeral container with your own tooling image into the pod\'s namespaces so you can investigate.',
                  },
                },
                {
                  type: 'predict',
                  prompt: 'You restart a crashing pod before checking anything. What troubleshooting risk does this create?',
                  solution: {
                    explanation:
                      'Restarting can erase the failed container\'s state and logs (unless you use --previous), removing the evidence needed to understand why it crashed.',
                  },
                },
              ],
              docs: 'https://kubernetes.io/docs/tasks/debug/debug-application/',
            },
            {
              id: 'k85-t1-c1',
              title: 'Events and metrics',
              summary:
                'Events record what the cluster did to your objects (scheduling, pulls, failures) and are your first diagnostic. Metrics from the metrics-server show live resource usage.',
              explanation:
                'Kubernetes emits Events as it works — a pod was scheduled, an image pull failed, a probe failed, a pod was evicted. They are the cluster\'s narration of what happened and are usually the fastest way to understand why an object is misbehaving. kubectl describe pod shows the Events for that pod at the bottom, and kubectl get events (or --sort-by=.lastTimestamp) shows them across a namespace. A caveat: Events are retained only for about an hour by default, so for historical analysis you ship them to a logging system. For live resource usage, the metrics-server provides current CPU and memory per pod and node, surfaced by kubectl top pods and kubectl top nodes; this is what HPA also consumes. metrics-server gives point-in-time data only, so for trends and alerting you use a full monitoring stack such as Prometheus plus Grafana. The practical workflow is: describe the object to read its Events, check kubectl top for resource pressure, then dig into logs — events and metrics narrow down where to look before you read a single log line.',
              analogy:
                'Events are the ship\'s log narrating every action and incident; metrics are the live gauges on the dashboard showing current speed and fuel. You read the log to learn what happened and watch the gauges to see the current state.',
              keyPoints: [
                'Events narrate cluster actions: scheduling, image pulls, probe failures, evictions.',
                'See them via kubectl describe (per object) or kubectl get events (per namespace).',
                'Events are short-lived (about an hour) — ship them out for history.',
                'metrics-server gives live CPU/memory via kubectl top pods/nodes; it also feeds HPA.',
                'For trends and alerting use Prometheus/Grafana, not just metrics-server.',
              ],
              code: {
                language: 'bash',
                lines: [
                  'kubectl get events --sort-by=.lastTimestamp   # recent events in a namespace',
                  'kubectl describe pod web-abc                  # object detail plus its Events',
                  'kubectl top pods                              # live CPU/memory per pod',
                  'kubectl top nodes                            # live CPU/memory per node',
                ],
                explanation:
                  'Sorting events by timestamp surfaces the latest activity; top requires the metrics-server to be installed.',
              },
              commonMistakes: [
                'Expecting Events to persist for long — they expire in about an hour by default.',
                'Running kubectl top without the metrics-server installed and being confused by the error.',
              ],
              exercises: [
                {
                  type: 'task',
                  prompt: 'Write a command to list a namespace\'s events sorted by when they last occurred.',
                  solution: {
                    lines: ['kubectl get events --sort-by=.lastTimestamp'],
                    explanation:
                      'Sorting by lastTimestamp puts the most recent events at the bottom so you can read the latest cluster activity in order.',
                  },
                },
                {
                  type: 'quiz',
                  prompt: 'What does the metrics-server provide, and what tool consumes it besides kubectl top?',
                  solution: {
                    explanation:
                      'It provides live (point-in-time) CPU and memory usage for pods and nodes. The HorizontalPodAutoscaler also consumes these metrics to make scaling decisions.',
                  },
                },
                {
                  type: 'predict',
                  prompt: 'A pod has been Pending for ten minutes. Where do you look first, and what kind of message might explain it?',
                  solution: {
                    explanation:
                      'Look at the pod\'s Events (kubectl describe pod). A message like FailedScheduling with insufficient cpu/memory or unschedulable due to taints explains why no node could take it.',
                  },
                },
              ],
              docs: 'https://kubernetes.io/docs/tasks/debug/debug-cluster/',
            },
            {
              id: 'k85-t1-c2',
              title: 'Common pod failures',
              summary:
                'A handful of statuses cover most failures: CrashLoopBackOff (app keeps crashing), ImagePullBackOff (cannot fetch the image), Pending (cannot schedule), and OOMKilled (out of memory).',
              explanation:
                'Most day-to-day failures show up as one of a few recognisable statuses, and knowing the cause of each makes diagnosis fast. CrashLoopBackOff means the container starts and exits repeatedly; the kubelet backs off between restarts. The fix is to read --previous logs and find why the process exits — bad config, missing dependency, a failing migration, or a liveness probe killing it. ImagePullBackOff (and ErrImagePull) means the image cannot be fetched: a typo in the image name or tag, a private registry without imagePullSecrets, or a non-existent tag; the Events show the registry error. Pending means the pod cannot be scheduled — usually insufficient CPU/memory on any node, an unsatisfiable nodeSelector/affinity, taints with no matching tolerations, or an unbound PVC; describe shows FailedScheduling with the reason. OOMKilled means the container exceeded its memory limit and was killed; raise the limit or fix the leak. There are others (CreateContainerConfigError for a missing ConfigMap/Secret, Evicted under node pressure), but recognising these four and going straight to events then logs resolves the majority of incidents.',
              analogy:
                'These statuses are like dashboard warning lights: each one points you to a specific subsystem. CrashLoopBackOff is engine misfiring, ImagePullBackOff is no fuel delivered, Pending is no parking space available, OOMKilled is overheating shutdown.',
              keyPoints: [
                'CrashLoopBackOff: container keeps crashing — read --previous logs for the cause.',
                'ImagePullBackOff/ErrImagePull: cannot fetch image — wrong name/tag or missing pull secret.',
                'Pending: cannot schedule — insufficient resources, taints, affinity, or unbound PVC.',
                'OOMKilled: exceeded memory limit — raise the limit or fix the leak.',
                'Workflow: read Events first, then logs; the status names the subsystem to check.',
              ],
              diagram: {
                type: 'mermaid',
                lines: [
                  'flowchart TD',
                  '  Status[Pod not Running] --> Crash[CrashLoopBackOff check previous logs]',
                  '  Status --> Pull[ImagePullBackOff check image and secret]',
                  '  Status --> Pend[Pending check scheduling and PVC]',
                  '  Status --> OOM[OOMKilled check memory limit]',
                ],
                caption: 'Map each failure status to its likely cause and the next thing to inspect.',
              },
              commonMistakes: [
                'Treating ImagePullBackOff as an app bug when it is a wrong tag or a missing imagePullSecret.',
                'Repeatedly deleting a CrashLoopBackOff pod instead of reading its --previous logs.',
              ],
              exercises: [
                {
                  type: 'quiz',
                  prompt: 'What does ImagePullBackOff indicate and what are two common causes?',
                  solution: {
                    explanation:
                      'The kubelet cannot pull the container image. Common causes: a wrong image name or tag (including a non-existent tag), or a private registry without the required imagePullSecret.',
                  },
                },
                {
                  type: 'predict',
                  prompt: 'A pod shows OOMKilled and then restarts, repeatedly. What are your two main remediation options?',
                  solution: {
                    explanation:
                      'Either increase the container\'s memory limit (if the workload genuinely needs more) or fix the application\'s excessive memory use / leak so it stays under the limit.',
                  },
                },
                {
                  type: 'task',
                  prompt: 'A pod is stuck Pending. Write the command that will most likely reveal why.',
                  solution: {
                    lines: ['kubectl describe pod <pod-name>'],
                    explanation:
                      'The Events section shows a FailedScheduling message explaining the reason — insufficient resources, taints, affinity rules, or an unbound PVC.',
                  },
                },
              ],
              docs: 'https://kubernetes.io/docs/tasks/debug/debug-application/debug-pods/',
            },
          ],
        },
        {
          id: 'k85-t2',
          name: 'Packaging and delivery',
          concepts: [
            {
              id: 'k85-t2-c0',
              title: 'Helm: charts and values',
              summary:
                'Helm is the package manager for Kubernetes. A chart is a templated, versioned bundle of manifests, and values.yaml parameterises it so one chart serves many environments.',
              explanation:
                'Maintaining dozens of nearly-identical YAML files across environments is painful; Helm solves this with packaging and templating. A chart is a versioned package containing templated manifests plus default configuration in values.yaml. The templates use placeholders that are filled from values, so the same chart produces dev, staging and prod deployments by supplying different values (via -f a values file or --set on the command line). Installing a chart creates a release — a named, tracked instance in the cluster — and Helm records the history so you can helm upgrade to a new version and helm rollback to a previous one, much like Deployment rollbacks but for the whole application. Charts can declare dependencies on other charts (a subchart for a database, say), and public/private chart repositories let you share them. Helm is widely used both to package your own apps and to install third-party software (ingress controllers, databases, monitoring stacks) with a single command. Use helm template to render a chart to plain YAML for inspection or to feed a GitOps pipeline.',
              analogy:
                'Helm is like an app store installer with a settings screen: a chart is the installable package, values.yaml is the settings you tweak before install, and a release is the installed app you can later upgrade or uninstall as a unit.',
              keyPoints: [
                'Helm is the Kubernetes package manager; a chart is a templated, versioned manifest bundle.',
                'values.yaml parameterises a chart; override with -f files or --set per environment.',
                'Installing creates a tracked release; helm upgrade and helm rollback manage versions.',
                'Charts support dependencies (subcharts) and shareable repositories.',
                'helm template renders a chart to plain YAML for inspection or GitOps.',
              ],
              code: {
                language: 'bash',
                lines: [
                  'helm install web ./web-chart -f prod-values.yaml   # create a release',
                  'helm upgrade web ./web-chart -f prod-values.yaml   # update it',
                  'helm rollback web 1                                # revert to revision 1',
                  'helm template web ./web-chart -f prod-values.yaml  # render to YAML',
                ],
                explanation:
                  'install creates the release web from the chart with prod values; upgrade/rollback manage its versions; template renders the manifests without applying them.',
              },
              commonMistakes: [
                'Editing rendered manifests in the cluster instead of the chart/values, so changes are lost on the next upgrade.',
                'Not pinning chart versions, making installs non-reproducible.',
              ],
              exercises: [
                {
                  type: 'quiz',
                  prompt: 'What is the role of values.yaml in a Helm chart?',
                  solution: {
                    explanation:
                      'It holds the configurable parameters with defaults that fill the chart\'s templates, so one chart can be customised per environment by overriding values instead of duplicating manifests.',
                  },
                },
                {
                  type: 'task',
                  prompt: 'Write the command to roll a Helm release named web back to revision 2.',
                  solution: {
                    lines: ['helm rollback web 2'],
                    explanation:
                      'Helm tracks release revision history, so rollback restores the manifests from the named revision as a single operation.',
                  },
                },
                {
                  type: 'predict',
                  prompt: 'You run helm template instead of helm install. What is produced and what is not?',
                  solution: {
                    explanation:
                      'helm template renders the chart to plain YAML on stdout but does not contact the cluster or create a release — useful for inspection or piping into a GitOps workflow.',
                  },
                },
              ],
              docs: 'https://helm.sh/docs/',
            },
            {
              id: 'k85-t2-c1',
              title: 'GitOps with Argo CD and Flux',
              summary:
                'GitOps makes a git repository the single source of truth for cluster state. A controller continuously reconciles the cluster to match git, so deploys are git commits.',
              explanation:
                'GitOps applies the declarative model to delivery itself: the desired state of the cluster lives in a git repository (as manifests, Helm charts or Kustomize), and an in-cluster agent continuously compares the live cluster to git and reconciles any drift. To deploy you commit and merge — no one runs kubectl apply manually against production. The two leading tools are Argo CD (which adds a rich UI showing sync status and diffs, with a pull-based model) and Flux (a set of controllers focused on automation and tight git/Helm integration). The benefits are significant: git history is a complete, auditable record of every change; rollback is reverting a commit; the cluster self-heals back to the declared state if someone makes a manual change; and access control shifts to who can merge to the repo. This is the standard modern delivery pattern because it is pull-based (the cluster pulls from git rather than CI pushing credentials in) and turns the whole platform into reviewable, version-controlled configuration. The key mental shift is that git, not the cluster, is authoritative.',
              analogy:
                'GitOps is like a thermostat whose target temperature is written on a shared, version-controlled noticeboard: to change the temperature you edit the noticeboard (commit), and the thermostat (the controller) constantly adjusts the room to match whatever the board says.',
              keyPoints: [
                'Git is the single source of truth for desired cluster state.',
                'An in-cluster controller continuously reconciles the live cluster to match git.',
                'Deploys are commits/merges; rollback is reverting a commit.',
                'Argo CD (UI-rich, pull-based) and Flux (controller set) are the leading tools.',
                'Pull-based and auditable: history, self-healing drift correction, and merge-based access control.',
              ],
              diagram: {
                type: 'mermaid',
                lines: [
                  'flowchart LR',
                  '  Dev[Commit to git] --> Repo[Git repository]',
                  '  Repo --> Agent[GitOps controller]',
                  '  Agent --> Cluster[Cluster reconciled to git]',
                ],
                caption: 'In GitOps the controller pulls desired state from git and reconciles the cluster to match.',
              },
              commonMistakes: [
                'Making manual kubectl changes in a GitOps-managed cluster — the controller reverts them as drift.',
                'Putting plaintext secrets in the git repo instead of using sealed/encrypted secrets.',
              ],
              exercises: [
                {
                  type: 'quiz',
                  prompt: 'In GitOps, what is the source of truth and how do you perform a deployment?',
                  solution: {
                    explanation:
                      'A git repository is the source of truth for desired state; you deploy by committing/merging changes to it, and the in-cluster controller reconciles the cluster to match.',
                  },
                },
                {
                  type: 'predict',
                  prompt: 'On a GitOps-managed cluster, someone manually edits a Deployment with kubectl. What happens?',
                  solution: {
                    explanation:
                      'The GitOps controller detects drift from git and reconciles the Deployment back to the state declared in the repository, undoing the manual change.',
                  },
                },
                {
                  type: 'quiz',
                  prompt: 'Why is the pull-based GitOps model often considered more secure than CI pushing to the cluster?',
                  hint: 'Where do credentials live?',
                  solution: {
                    explanation:
                      'The cluster\'s agent pulls from git, so cluster credentials stay inside the cluster rather than being handed to an external CI system that pushes changes in.',
                  },
                },
              ],
              docs: 'https://argo-cd.readthedocs.io/en/stable/',
            },
            {
              id: 'k85-t2-c2',
              title: 'Cluster upgrades and managed Kubernetes',
              summary:
                'Clusters must be upgraded regularly, in version order, control plane first. Managed services (EKS, GKE, AKS) run the control plane and simplify upgrades and operations.',
              explanation:
                'Kubernetes releases frequently and supports only the recent minor versions, so clusters need periodic upgrades to stay supported and secure. Upgrades follow rules: you upgrade one minor version at a time (no skipping), the control plane is upgraded before the worker nodes, and the kubelet may trail the API server by a limited number of versions (the version skew policy) but never lead it. Worker nodes are upgraded gracefully by cordoning a node (marking it unschedulable) and draining it (evicting its pods so they reschedule elsewhere) before replacing or updating it, which keeps the application available throughout. PodDisruptionBudgets protect availability during drains by limiting how many pods of an app can be down at once. Running all of this yourself is significant work, which is why most teams use a managed service: Amazon EKS, Google GKE and Azure AKS operate the control plane (you never patch the API server or etcd), handle its high availability, and provide tooling to upgrade node groups. You still own your workloads, RBAC and node configuration, but the heavy control-plane operations are taken care of. This is the practical default for running Kubernetes in production.',
              analogy:
                'Upgrading a cluster is like renovating a busy hotel floor by floor: you stop sending new guests to a floor (cordon), move current guests out (drain), renovate it, then reopen — never closing the whole hotel. A managed service is hiring a property-management company to handle the building\'s core systems for you.',
              keyPoints: [
                'Upgrade one minor version at a time; control plane before worker nodes.',
                'Version skew: kubelet may trail the API server but never lead it.',
                'Drain nodes (cordon then evict pods) for graceful, available upgrades.',
                'PodDisruptionBudgets limit how many pods go down during a drain.',
                'EKS/GKE/AKS run the control plane and ease upgrades; you keep owning workloads.',
              ],
              code: {
                language: 'bash',
                lines: [
                  'kubectl cordon node-1                       # stop scheduling new pods here',
                  'kubectl drain node-1 --ignore-daemonsets   # evict pods so they reschedule',
                  '# upgrade or replace the node, then:',
                  'kubectl uncordon node-1                     # allow scheduling again',
                ],
                explanation:
                  'cordon plus drain move workloads off a node before upgrading it (DaemonSet pods are ignored since they belong on every node); uncordon returns it to service. PodDisruptionBudgets keep enough replicas up during the drain.',
              },
              commonMistakes: [
                'Skipping minor versions during an upgrade, which is unsupported and risky.',
                'Draining nodes without PodDisruptionBudgets, causing too many replicas down at once.',
              ],
              exercises: [
                {
                  type: 'quiz',
                  prompt: 'In what order do you upgrade the control plane and worker nodes, and why?',
                  solution: {
                    explanation:
                      'Control plane first, then worker nodes. The version skew policy allows the kubelet to trail the API server but not lead it, so the API server must be upgraded before the nodes.',
                  },
                },
                {
                  type: 'task',
                  prompt: 'Write the commands to gracefully take node-1 out of service for an upgrade (ignoring DaemonSet pods).',
                  solution: {
                    lines: ['kubectl cordon node-1', 'kubectl drain node-1 --ignore-daemonsets'],
                    explanation:
                      'cordon stops new scheduling, and drain evicts existing pods (except DaemonSet pods) so they reschedule onto other nodes before you upgrade node-1.',
                  },
                },
                {
                  type: 'quiz',
                  prompt: 'What does a managed Kubernetes service like EKS, GKE or AKS take responsibility for?',
                  hint: 'The part you do not SSH into.',
                  solution: {
                    explanation:
                      'It operates the control plane — the API server, etcd, scheduler and controller manager — including its high availability and patching, while you still manage your workloads, RBAC and node configuration.',
                  },
                },
              ],
              docs: 'https://kubernetes.io/docs/tasks/administer-cluster/cluster-upgrade/',
            },
          ],
        },
      ],
    },
  ],
};

export default content;
