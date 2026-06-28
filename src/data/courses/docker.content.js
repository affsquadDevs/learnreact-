// Docker — course content. Original explanations written for self-study; same schema as the other courses.
const content = {
  meta: {
    title: 'Docker: Containers from Zero to Production',
    description:
      'A comprehensive, hands-on Docker course that takes you from the fundamentals of containers and images through writing efficient Dockerfiles, running and operating containers, managing data and networking, and finally to Compose, security and CI/CD. Every concept is explained from first principles with diagrams, real commands and exercises so you can go from zero to production with confidence.',
    schemaVersion: '1.0',
    status: 'complete',
  },
  levels: [
    /* ───────────────────── LEVEL 1 — FUNDAMENTALS ───────────────────── */
    {
      level: 1,
      name: 'Fundamentals',
      focus: 'What containers are, how Docker is built, and the difference between images and containers',
      accent: '#2496ed',
      soft: '#e6f4fd',
      topics: [
        {
          id: 'dk1-t0',
          name: 'Why containers',
          concepts: [
            {
              id: 'dk1-t0-c0',
              title: 'The problem containers solve',
              summary:
                'Software that runs on one machine often breaks on another because of differing dependencies, libraries and configuration. Containers package an application together with everything it needs so it runs the same way everywhere.',
              explanation:
                'The classic pain of deploying software is the \'it works on my machine\' problem: an app depends on a specific runtime, system libraries, environment variables and file layout, and any drift between developer laptop, test server and production breaks it. Before containers, teams tried to fix this with lengthy setup documents, configuration management tools, or by shipping whole virtual machines. Containers take a different approach: they bundle the application and its dependencies into a single, portable unit that shares the host operating system kernel but runs in an isolated user space. Because the unit is built once and run unchanged, the environment travels with the code. This makes builds reproducible, deployments predictable, and scaling a matter of starting more identical copies. The result is faster, more reliable delivery across every stage of the pipeline.',
              analogy:
                'A shipping container revolutionised freight because any container fits any ship, crane or truck regardless of what is inside. A software container does the same for code: the same box runs on any machine that speaks the container standard.',
              keyPoints: [
                'Containers eliminate environment drift by packaging the app with its dependencies.',
                'They share the host kernel but isolate the application\'s user space.',
                'Build once, run the same way on laptop, CI and production.',
                'Scaling becomes starting more identical copies of the same image.',
              ],
              diagram: {
                type: 'mermaid',
                lines: [
                  'flowchart LR',
                  '  Code[App plus deps] --> Image[Container image]',
                  '  Image --> Laptop',
                  '  Image --> CI',
                  '  Image --> Prod',
                ],
                caption: 'One image is built once and runs identically across every environment.',
              },
              exercises: [
                {
                  type: 'quiz',
                  prompt: 'In one sentence, what core problem do containers address?',
                  hint: 'Think about why code breaks when it moves between machines.',
                  solution: {
                    explanation:
                      'They package an application with all of its dependencies into a portable unit so it runs the same way on any host, removing environment drift and the \'works on my machine\' problem.',
                  },
                },
                {
                  type: 'predict',
                  prompt: 'You hand a colleague a zip of your source code but not your installed system libraries. Will it run reliably on their machine? Why might a container have helped?',
                  solution: {
                    explanation:
                      'Probably not — they may have different library versions, missing runtimes or different OS configuration. A container would bundle those dependencies with the code so the runtime environment is identical regardless of their machine.',
                  },
                },
              ],
              docs: 'https://docs.docker.com/get-started/docker-overview/',
            },
            {
              id: 'dk1-t0-c1',
              title: 'Containers vs virtual machines',
              summary:
                'Virtual machines virtualise hardware and run a full guest operating system; containers virtualise the operating system and share the host kernel. Containers are far lighter and start in milliseconds.',
              explanation:
                'A virtual machine runs on a hypervisor that emulates hardware, so each VM carries an entire guest operating system including its own kernel. That gives strong isolation but is heavy: gigabytes of disk, slow boot times, and significant memory overhead per instance. A container, by contrast, does not boot an OS — it is just a set of isolated processes running on the host kernel, with their own filesystem, network and process view. This means containers are typically megabytes rather than gigabytes, start in a fraction of a second, and pack many more instances onto the same hardware. The trade-off is that containers share the host kernel, so isolation is at the process level rather than the hardware level. In practice teams often combine both: containers running inside VMs in the cloud to get density plus a strong security boundary.',
              analogy:
                'A virtual machine is a separate house with its own foundations, plumbing and walls. A container is an apartment in a shared building — it has its own locked door and rooms, but it shares the building\'s foundations and utilities.',
              keyPoints: [
                'VMs virtualise hardware and include a full guest OS and kernel.',
                'Containers virtualise the OS and share the host kernel.',
                'Containers are lighter, faster to start and higher density.',
                'VMs offer stronger hardware-level isolation; the two are often combined.',
              ],
              diagram: {
                type: 'mermaid',
                lines: [
                  'flowchart TD',
                  '  subgraph VMs',
                  '    HW1[Hardware] --> HV[Hypervisor]',
                  '    HV --> G1[Guest OS plus App]',
                  '    HV --> G2[Guest OS plus App]',
                  '  end',
                  '  subgraph Containers',
                  '    HW2[Hardware] --> Host[Host OS kernel]',
                  '    Host --> C1[App container]',
                  '    Host --> C2[App container]',
                  '  end',
                ],
                caption: 'VMs each carry a guest OS on a hypervisor; containers share one host kernel.',
              },
              commonMistakes: [
                'Assuming a container is a lightweight VM — it has no separate kernel and does not boot an OS.',
                'Expecting VM-grade isolation by default; container isolation is process-level and depends on configuration.',
              ],
              exercises: [
                {
                  type: 'quiz',
                  prompt: 'What is the single most important architectural difference between a container and a virtual machine?',
                  hint: 'Where does the kernel come from?',
                  solution: {
                    explanation:
                      'A VM includes its own guest OS kernel on top of a hypervisor, while a container shares the host\'s kernel and is just isolated processes. That is why containers are so much lighter.',
                  },
                },
                {
                  type: 'predict',
                  prompt: 'You start 50 small web services. Which approach uses less RAM and boots faster, 50 VMs or 50 containers, and why?',
                  solution: {
                    explanation:
                      'Containers — each VM duplicates a full OS and kernel costing hundreds of MB and seconds to boot, while containers share the host kernel and start in milliseconds with far less overhead.',
                  },
                },
                {
                  type: 'quiz',
                  prompt: 'Why might a cloud provider run containers inside VMs rather than directly on bare metal?',
                  solution: {
                    explanation:
                      'To combine container density and speed with the stronger hardware-level isolation a VM gives between different tenants, improving the security boundary.',
                  },
                },
              ],
              docs: 'https://docs.docker.com/get-started/docker-overview/',
            },
            {
              id: 'dk1-t0-c2',
              title: 'Namespaces and cgroups: how isolation works',
              summary:
                'Linux namespaces give each container its own view of system resources such as processes, network and mounts, while control groups (cgroups) limit how much CPU, memory and I/O a container can consume.',
              explanation:
                'Containers are not magic — they are built from two long-standing Linux kernel features. Namespaces partition kernel resources so that a process inside one namespace sees only its own slice: the PID namespace gives a container its own process tree where its main process is PID 1, the network namespace gives it its own interfaces and ports, the mount namespace gives it its own filesystem view, and there are namespaces for users, hostnames and inter-process communication too. Control groups, or cgroups, handle the other half of the job: they account for and constrain resource usage, letting you cap a container to, say, half a CPU and 256 MB of memory so one workload cannot starve the others. Together namespaces provide the \'what can I see\' isolation and cgroups provide the \'how much can I use\' limits. Docker simply orchestrates these primitives for you so you never have to call the kernel APIs directly.',
              analogy:
                'Namespaces are like giving each tenant a private, soundproofed room so they cannot see into anyone else\'s; cgroups are the building rules that cap how much water and electricity each room may draw.',
              keyPoints: [
                'Namespaces isolate what a container can see: processes, network, mounts, users and more.',
                'In its PID namespace a container\'s main process appears as PID 1.',
                'cgroups limit and account for CPU, memory and I/O consumption.',
                'Docker orchestrates these kernel features rather than inventing isolation itself.',
              ],
              exercises: [
                {
                  type: 'quiz',
                  prompt: 'Which kernel feature isolates what a container sees, and which one limits what it can consume?',
                  hint: 'Two different mechanisms with two different jobs.',
                  solution: {
                    explanation:
                      'Namespaces isolate the view (processes, network, mounts, etc.), while cgroups limit and meter resource consumption such as CPU and memory.',
                  },
                },
                {
                  type: 'predict',
                  prompt: 'Inside a container you run `ps` and see your app as PID 1 with almost nothing else. Why does the process tree look so empty?',
                  solution: {
                    explanation:
                      'The PID namespace gives the container its own isolated process tree, so it only sees its own processes starting at PID 1 — host processes are invisible.',
                  },
                },
                {
                  type: 'task',
                  prompt: 'Run a container limited to half a CPU and 256 MB of memory using busybox to print a message.',
                  solution: {
                    lines: ['docker run --cpus=0.5 --memory=256m busybox echo hello'],
                    explanation:
                      'The --cpus and --memory flags configure cgroup limits so the container cannot exceed half a CPU core or 256 MB of RAM.',
                  },
                },
              ],
              docs: 'https://docs.docker.com/engine/containers/resource_constraints/',
            },
            {
              id: 'dk1-t0-c3',
              title: 'The OCI standard and the wider ecosystem',
              summary:
                'The Open Container Initiative defines vendor-neutral standards for image format and runtime, so images built with Docker run on any compliant tool. Docker is one implementation among many.',
              explanation:
                'Early on, Docker\'s image and runtime formats were proprietary, which risked locking the industry into a single vendor. To prevent that, the Open Container Initiative (OCI) was created to publish open specifications: the image-spec describes how an image and its layers are structured and addressed, the runtime-spec describes how a runtime unpacks and runs a container, and the distribution-spec describes how images are pushed and pulled from registries. Because of these standards, an image you build with Docker can be run by other runtimes like containerd or CRI-O, and pulled from any compliant registry. This is why Kubernetes does not depend on Docker specifically — it talks to any OCI-compliant runtime. Understanding that Docker is an implementation of open standards, not the standard itself, helps you reason about the ecosystem and avoid lock-in.',
              analogy:
                'OCI is like the standard for shipping container dimensions and corner fittings. Many manufacturers build the containers and many companies build the cranes, but because everyone follows the same spec, any crane can lift any container.',
              keyPoints: [
                'OCI publishes open specs for image format, runtime and distribution.',
                'OCI images are portable across compliant runtimes and registries.',
                'Docker is one OCI implementation; containerd and CRI-O are others.',
                'Standards prevent vendor lock-in and let Kubernetes stay runtime-agnostic.',
              ],
              exercises: [
                {
                  type: 'quiz',
                  prompt: 'What does the OCI define and why does it matter?',
                  hint: 'Think portability and avoiding lock-in.',
                  solution: {
                    explanation:
                      'It defines open standards for the container image format, runtime behaviour and registry distribution, so images are portable across tools and you are not locked into a single vendor.',
                  },
                },
                {
                  type: 'quiz',
                  prompt: 'True or false: Kubernetes requires Docker specifically to run containers.',
                  solution: {
                    explanation:
                      'False — Kubernetes works with any OCI-compliant runtime such as containerd or CRI-O. Docker is just one compliant implementation.',
                  },
                },
              ],
              docs: 'https://opencontainers.org/',
            },
          ],
        },
        {
          id: 'dk1-t1',
          name: 'Docker architecture',
          concepts: [
            {
              id: 'dk1-t1-c0',
              title: 'Client, daemon and the client-server model',
              summary:
                'Docker uses a client-server architecture: the docker CLI sends commands over an API to the Docker daemon (dockerd), which does the heavy lifting of building, running and managing containers.',
              explanation:
                'When you type a docker command you are using the Docker client, a thin program whose only job is to translate your command into a REST API call. That call goes to the Docker daemon, dockerd, usually over a local Unix socket but optionally over the network. The daemon is the long-running background process that actually builds images, creates and runs containers, manages networks and volumes, and talks to registries. Because the client and daemon are separate, the client can be on a different machine from the daemon, which is how remote Docker hosts work. Most of the time both run on the same machine and the separation is invisible, but knowing the model explains error messages like \'cannot connect to the Docker daemon\' — that means the client could reach you fine but the daemon was not running or not reachable.',
              analogy:
                'The CLI is a waiter taking your order; the daemon is the kitchen that actually cooks. You talk to the waiter, but nothing happens until the order reaches the kitchen.',
              keyPoints: [
                'The docker CLI is just a client that calls the daemon\'s REST API.',
                'dockerd is the daemon that builds, runs and manages everything.',
                'Client and daemon communicate over a Unix socket or a network socket.',
                'They can run on different machines, enabling remote Docker hosts.',
              ],
              diagram: {
                type: 'mermaid',
                lines: [
                  'flowchart LR',
                  '  CLI[docker CLI] -->|REST API| Daemon[dockerd]',
                  '  Daemon --> Containers',
                  '  Daemon --> Images',
                  '  Daemon --> Registry',
                ],
                caption: 'The CLI sends API calls to the daemon, which manages containers, images and talks to registries.',
              },
              commonMistakes: [
                'Thinking the docker command itself runs containers — it only sends requests to the daemon.',
                'Seeing \'cannot connect to the Docker daemon\' and editing the CLI instead of starting or fixing dockerd.',
              ],
              exercises: [
                {
                  type: 'quiz',
                  prompt: 'When you run `docker run`, which component actually creates and runs the container?',
                  hint: 'Not the thing you typed into.',
                  solution: {
                    explanation:
                      'The Docker daemon (dockerd) does the work. The CLI merely translates your command into an API call that the daemon executes.',
                  },
                },
                {
                  type: 'predict',
                  prompt: 'You run a docker command and get \'cannot connect to the Docker daemon\'. What is most likely wrong?',
                  solution: {
                    explanation:
                      'The CLI is working but cannot reach dockerd — usually the daemon is not running, or your user lacks permission to access its socket.',
                  },
                },
                {
                  type: 'task',
                  prompt: 'Print the Docker client and daemon versions to confirm both are present and talking.',
                  solution: {
                    lines: ['docker version'],
                    explanation:
                      '`docker version` shows both the Client and Server (daemon) sections; if the Server section is missing the client cannot reach the daemon.',
                  },
                },
              ],
              docs: 'https://docs.docker.com/get-started/docker-overview/',
            },
            {
              id: 'dk1-t1-c1',
              title: 'Under the daemon: containerd, runc and shims',
              summary:
                'The Docker daemon delegates low-level work to containerd, which in turn uses a runtime such as runc to actually spawn containers. This layered design keeps each component focused and replaceable.',
              explanation:
                'The Docker daemon does not start containers directly at the lowest level. Instead it hands off to containerd, a high-level container runtime that manages the complete container lifecycle: pulling images, managing storage, and supervising containers. When containerd needs to actually create a container it calls a low-level OCI runtime, by default runc, which uses the Linux namespaces and cgroups primitives to spin up the isolated process. A small shim process sits between containerd and each running container so that containers keep running even if the daemon is restarted, and so their output and exit codes can still be collected. This separation is why the same containerd is used by Kubernetes too. As a learner you rarely touch these pieces directly, but knowing the stack explains how Docker fits into the broader runtime ecosystem and why upgrading dockerd does not necessarily kill your running containers.',
              analogy:
                'Think of a restaurant chain: dockerd is head office setting policy, containerd is the branch manager running day-to-day operations, and runc is the line cook who actually makes each dish. The shim is the supervisor on the floor who keeps things running even when head office is on a call.',
              keyPoints: [
                'dockerd delegates lifecycle management to containerd.',
                'containerd calls a low-level OCI runtime, by default runc, to create containers.',
                'A shim keeps containers alive across daemon restarts and collects their I/O and exit codes.',
                'containerd is shared with the wider ecosystem, including Kubernetes.',
              ],
              diagram: {
                type: 'mermaid',
                lines: [
                  'flowchart LR',
                  '  Daemon[dockerd] --> Ctrd[containerd]',
                  '  Ctrd --> Shim[shim]',
                  '  Shim --> Runc[runc]',
                  '  Runc --> Container',
                ],
                caption: 'A layered runtime stack: dockerd to containerd to a shim to runc, which finally creates the container.',
              },
              exercises: [
                {
                  type: 'quiz',
                  prompt: 'Which low-level component actually uses namespaces and cgroups to create the container process?',
                  hint: 'It is the OCI runtime at the bottom of the stack.',
                  solution: {
                    explanation:
                      'runc, the default low-level OCI runtime. containerd calls it to spawn the isolated container process using kernel primitives.',
                  },
                },
                {
                  type: 'predict',
                  prompt: 'Why can a running container survive a restart of the Docker daemon?',
                  solution: {
                    explanation:
                      'Because a shim process supervises each container independently of dockerd, the container keeps running and its I/O and exit status remain collectable even while the daemon restarts.',
                  },
                },
              ],
              docs: 'https://docs.docker.com/engine/',
            },
            {
              id: 'dk1-t1-c2',
              title: 'Registries: where images live',
              summary:
                'A registry is a storage and distribution service for container images. The client pulls images from registries to run them and pushes images to registries to share them.',
              explanation:
                'Images do not appear from nowhere — they are stored in registries and downloaded on demand. A registry is a server that holds repositories, and each repository holds tagged versions of an image. Docker Hub is the default public registry, but there are many others such as GitHub Container Registry, Amazon ECR, Google Artifact Registry and self-hosted private registries. When you run an image that is not present locally, the daemon contacts the registry, authenticates if needed, and pulls the required layers; conversely `docker push` uploads your built image so others or your servers can pull it. Registries are central to the workflow because they are the hand-off point between building and running: you build once, push to a registry, and any machine can pull and run the exact same image. Knowing this clarifies where images come from and why image names often include a registry host and repository path.',
              analogy:
                'A registry is like an app store for images: developers publish (push) apps, and devices download (pull) them on demand by name and version.',
              keyPoints: [
                'A registry stores and distributes images organised into repositories and tags.',
                'Docker Hub is the default; many public and private registries exist.',
                'docker pull downloads images; docker push uploads them.',
                'Registries are the hand-off between building and running an image.',
              ],
              diagram: {
                type: 'mermaid',
                lines: [
                  'flowchart LR',
                  '  Build[Build image] -->|push| Registry',
                  '  Registry -->|pull| Server1',
                  '  Registry -->|pull| Server2',
                ],
                caption: 'Build once, push to a registry, then pull the identical image anywhere.',
              },
              exercises: [
                {
                  type: 'quiz',
                  prompt: 'What is the role of a registry in the Docker workflow?',
                  hint: 'Think storage and the build-to-run hand-off.',
                  solution: {
                    explanation:
                      'It stores and distributes images; you push built images to it and pull them on any machine, so the same image runs everywhere.',
                  },
                },
                {
                  type: 'task',
                  prompt: 'Pull the official hello-world image from the default registry.',
                  solution: {
                    lines: ['docker pull hello-world'],
                    explanation:
                      'With no registry host in the name, Docker pulls from Docker Hub by default, downloading the hello-world image layers locally.',
                  },
                },
                {
                  type: 'quiz',
                  prompt: 'Name two registries other than Docker Hub.',
                  solution: {
                    explanation:
                      'Examples include GitHub Container Registry (ghcr.io), Amazon ECR, Google Artifact Registry, Azure Container Registry, and self-hosted private registries.',
                  },
                },
              ],
              docs: 'https://docs.docker.com/get-started/docker-concepts/the-basics/what-is-a-registry/',
            },
          ],
        },
        {
          id: 'dk1-t2',
          name: 'Images vs containers',
          concepts: [
            {
              id: 'dk1-t2-c0',
              title: 'Image as template, container as instance',
              summary:
                'An image is a read-only template that bundles your application, dependencies and metadata. A container is a running (or stopped) instance created from that image with a writable layer on top.',
              explanation:
                'The single most important mental model in Docker is the relationship between images and containers. An image is an immutable, read-only package: it contains a filesystem snapshot plus configuration like the default command, environment variables and exposed ports. A container is what you get when you run an image — the daemon takes the read-only image, adds a thin writable layer on top, and starts the configured process. You can create many containers from the same image, just as you can instantiate many objects from one class, and each container has its own writable layer so changes in one do not affect the others or the underlying image. When a container writes a file it lands in that writable layer, not in the image, which is why deleting a container without a volume loses its changes. Internalising image-as-template and container-as-instance makes nearly every other Docker behaviour intuitive.',
              analogy:
                'An image is like a class in programming and a container is an object created from it. One class, many independent instances, each with its own state.',
              keyPoints: [
                'An image is an immutable, read-only template with filesystem plus config.',
                'A container is a running instance of an image with a writable layer on top.',
                'Many containers can be created from one image, each independent.',
                'Changes a container makes live in its writable layer, not the image.',
              ],
              diagram: {
                type: 'mermaid',
                lines: [
                  'flowchart LR',
                  '  Image[Read only image] --> C1[Container 1 writable layer]',
                  '  Image --> C2[Container 2 writable layer]',
                  '  Image --> C3[Container 3 writable layer]',
                ],
                caption: 'One read-only image backs many containers, each with its own writable layer.',
              },
              commonMistakes: [
                'Expecting files written inside a container to persist after the container is removed — they do not without a volume.',
                'Confusing rebuilding an image with restarting a container; they are different operations.',
              ],
              exercises: [
                {
                  type: 'quiz',
                  prompt: 'What is the relationship between an image and a container?',
                  hint: 'Think class versus object.',
                  solution: {
                    explanation:
                      'An image is a read-only template; a container is a runnable instance of that image with its own writable layer. Many containers can come from one image.',
                  },
                },
                {
                  type: 'predict',
                  prompt: 'You start a container, create a file inside it, then remove the container. Is the file still there next time you run the image?',
                  solution: {
                    explanation:
                      'No — the file lived in that container\'s writable layer, which is discarded when the container is removed. To persist data you would mount a volume.',
                  },
                },
              ],
              docs: 'https://docs.docker.com/get-started/docker-concepts/the-basics/what-is-an-image/',
            },
            {
              id: 'dk1-t2-c1',
              title: 'Image layers and the union filesystem',
              summary:
                'Images are built from stacked, read-only layers. Layers are cached and shared between images, which makes builds fast and storage efficient.',
              explanation:
                'An image is not a single monolithic blob — it is a stack of read-only layers, each representing a set of filesystem changes. Every instruction in a Dockerfile that modifies the filesystem produces a new layer on top of the previous one, and the final image is the union of all these layers presented as one coherent filesystem by a storage driver such as overlay2. Two crucial properties follow. First, layers are content-addressed and cached, so if a layer has not changed it is reused rather than rebuilt or re-downloaded, dramatically speeding up builds and pulls. Second, layers are shared across images: if ten images all start from the same base, that base is stored once on disk and downloaded once. When a container runs, a thin writable layer is added on top of the shared read-only layers using copy-on-write, meaning files are only copied up when modified. Understanding layering is the key to writing fast, small images later in the course.',
              analogy:
                'Layers are like transparent sheets stacked on an overhead projector. Each sheet adds or changes some marks, and looking down through the stack you see one combined picture, even though each sheet is reused independently.',
              keyPoints: [
                'Images are stacks of read-only layers; each filesystem-changing instruction adds one.',
                'A storage driver such as overlay2 merges layers into one filesystem view.',
                'Layers are content-addressed, cached and shared across images.',
                'Containers add a writable copy-on-write layer on top of the shared layers.',
              ],
              diagram: {
                type: 'mermaid',
                lines: [
                  'flowchart TD',
                  '  Base[Base layer] --> L1[Dependencies layer]',
                  '  L1 --> L2[App code layer]',
                  '  L2 --> W[Writable container layer]',
                ],
                caption: 'Read-only layers stack from base to app, with a writable layer added when a container runs.',
              },
              exercises: [
                {
                  type: 'quiz',
                  prompt: 'Why are image layers cached and shared, and what benefit does that bring?',
                  hint: 'Think about build speed and disk usage.',
                  solution: {
                    explanation:
                      'Layers are content-addressed so unchanged layers are reused across builds and pulls, and identical layers are stored once on disk. This makes builds and downloads faster and saves storage.',
                  },
                },
                {
                  type: 'task',
                  prompt: 'Show the layer-by-layer history of the hello-world image.',
                  solution: {
                    lines: ['docker history hello-world'],
                    explanation:
                      '`docker history` lists each layer of an image along with the instruction that created it and its size, revealing how the image was built up.',
                  },
                },
                {
                  type: 'predict',
                  prompt: 'You pull two large images that share the same base. Will the base be downloaded twice?',
                  solution: {
                    explanation:
                      'No — shared layers are downloaded and stored only once. The second image reuses the already-present base layers.',
                  },
                },
              ],
              docs: 'https://docs.docker.com/get-started/docker-concepts/building-images/understanding-image-layers/',
            },
            {
              id: 'dk1-t2-c2',
              title: 'Your first commands: run, ps and images',
              summary:
                'docker run creates and starts a container from an image, docker ps lists running containers, and docker images lists images stored locally. These three commands cover the core daily loop.',
              explanation:
                'With the concepts in place, the practical loop is short. `docker run <image>` pulls the image if needed, creates a container, and starts its default command; adding a command after the image name overrides that default. `docker ps` shows currently running containers along with their IDs, names, status and published ports, and `docker ps -a` adds stopped ones so you can see history. `docker images` (or `docker image ls`) lists the images cached locally with their repository, tag, ID and size. Every container gets a unique ID and a human-friendly auto-generated name unless you pass --name, and you refer to containers by either when stopping, inspecting or removing them. These commands are the muscle memory of working with Docker; the rest of the course builds on this loop of run, inspect, and clean up.',
              analogy:
                'Think of docker images as your installed-apps list, docker run as launching one, and docker ps as the task manager showing what is currently running.',
              keyPoints: [
                'docker run pulls if needed, creates and starts a container.',
                'A command after the image name overrides the image\'s default command.',
                'docker ps lists running containers; add -a to include stopped ones.',
                'docker images lists locally cached images with tag, ID and size.',
              ],
              code: {
                language: 'bash',
                lines: [
                  '# Run a container that prints a message and exits',
                  'docker run hello-world',
                  '',
                  '# Run nginx in the background, naming it web',
                  'docker run -d --name web nginx',
                  '',
                  '# See running containers, then all containers',
                  'docker ps',
                  'docker ps -a',
                  '',
                  '# List images stored locally',
                  'docker images',
                ],
                explanation:
                  'These commands form the basic loop: run an image, list what is running, and inspect the local image cache.',
              },
              commonMistakes: [
                'Running a server container without -d so the terminal is blocked by the foreground process.',
                'Using docker ps and wondering where a finished container went — use docker ps -a to see stopped containers.',
              ],
              exercises: [
                {
                  type: 'quiz',
                  prompt: 'What is the difference between docker ps and docker ps -a?',
                  hint: 'One shows a subset of the other.',
                  solution: {
                    explanation:
                      'docker ps shows only currently running containers; docker ps -a also includes stopped and exited containers.',
                  },
                },
                {
                  type: 'task',
                  prompt: 'Start an nginx container in the background named myweb, then verify it is running.',
                  solution: {
                    lines: ['docker run -d --name myweb nginx', 'docker ps'],
                    explanation:
                      'The -d flag detaches so it runs in the background, --name gives it a fixed name, and docker ps confirms it is up.',
                  },
                },
                {
                  type: 'predict',
                  prompt: 'You run `docker run ubuntu echo hi`. What happens and what state is the container in afterwards?',
                  solution: {
                    explanation:
                      'It runs echo hi, prints hi, then the main process exits, so the container stops immediately. It will appear only under docker ps -a as an exited container.',
                  },
                },
              ],
              docs: 'https://docs.docker.com/engine/reference/commandline/run/',
            },
          ],
        },
      ],
    },
    /* ───────────────────── LEVEL 2 — BUILDING IMAGES ───────────────────── */
    {
      level: 2,
      name: 'Building images',
      focus: 'Writing Dockerfiles, mastering the build cache, and producing small, efficient images',
      accent: '#2496ed',
      soft: '#e6f4fd',
      topics: [
        {
          id: 'dk2-t0',
          name: 'Dockerfile basics',
          concepts: [
            {
              id: 'dk2-t0-c0',
              title: 'FROM and the base image',
              summary:
                'Every Dockerfile starts with FROM, which sets the base image your build extends. Choosing the right base shapes the size, security and contents of everything you build.',
              explanation:
                'A Dockerfile is a recipe that the daemon executes to build an image, and the first instruction is almost always FROM, which declares the starting point. The base image provides a filesystem and often a runtime — for example node:20 gives you a Linux userland with Node installed, while scratch is a completely empty base for building from nothing. Your choice of base matters enormously: it determines the operating system flavour, which package manager is available, the default user, the attack surface and the baseline image size. Pinning a specific tag, ideally with a digest, makes builds reproducible because the floating latest tag can change underneath you. A good habit is to start from an official, minimal image that matches your language and only add what you need. Everything later in the Dockerfile is layered on top of whatever FROM provides.',
              analogy:
                'FROM is like choosing the prepared base of a meal kit. Start from a fully stocked pantry and the kit is large but convenient; start from bare ingredients and it is lean but you assemble more yourself.',
              keyPoints: [
                'FROM sets the base image and is normally the first instruction.',
                'The base provides the OS userland, runtime, default user and baseline size.',
                'Pin a specific tag or digest for reproducible builds rather than latest.',
                'scratch is an empty base for building minimal images from nothing.',
              ],
              code: {
                language: 'dockerfile',
                lines: [
                  '# Start from an official, version-pinned Node image',
                  'FROM node:20-slim',
                ],
                explanation:
                  'Using a pinned, slim official image gives a reproducible, smaller starting point than node:latest.',
              },
              commonMistakes: [
                'Relying on the latest tag, which can change and break reproducibility.',
                'Choosing a heavy full-distribution base when a slim or alpine variant would do.',
              ],
              exercises: [
                {
                  type: 'quiz',
                  prompt: 'Why should you avoid using the latest tag for a base image in production builds?',
                  hint: 'Think reproducibility.',
                  solution: {
                    explanation:
                      'latest is a moving target — it can point to a new image over time, so your builds are not reproducible and may suddenly change behaviour. Pin a specific version or digest instead.',
                  },
                },
                {
                  type: 'quiz',
                  prompt: 'What does the FROM instruction provide to the rest of the Dockerfile?',
                  solution: {
                    explanation:
                      'It provides the base filesystem and often a runtime, plus defaults like the OS userland, package manager and user, that all subsequent instructions build upon.',
                  },
                },
              ],
              docs: 'https://docs.docker.com/reference/dockerfile/',
            },
            {
              id: 'dk2-t0-c1',
              title: 'WORKDIR, COPY and ADD',
              summary:
                'WORKDIR sets the working directory for following instructions, COPY brings files from the build context into the image, and ADD does the same with a couple of extra behaviours that are usually best avoided.',
              explanation:
                'WORKDIR sets the directory that subsequent RUN, COPY, CMD and ENTRYPOINT instructions operate in, creating it if necessary; it is cleaner and safer than chaining cd commands. COPY takes files or directories from the build context — the set of files sent to the daemon when you build — and places them into the image at a path you specify. ADD looks similar but has two extra powers: it can fetch from a URL and it automatically extracts local tar archives. Those magic behaviours make builds harder to reason about, so the widely recommended default is to use COPY for plain file copying and reach for ADD only when you specifically want tar auto-extraction. A common, cache-friendly pattern is to copy dependency manifests first, install dependencies, then copy the rest of the source, so that source changes do not invalidate the dependency layer.',
              analogy:
                'COPY is a plain pair of hands moving boxes into the right room. ADD is the same but it will also unwrap parcels and run to the post office for you — handy occasionally, but surprising if you forget it does that.',
              keyPoints: [
                'WORKDIR sets and creates the working directory for later instructions.',
                'COPY moves files from the build context into the image.',
                'ADD additionally fetches URLs and auto-extracts local tar archives.',
                'Prefer COPY by default; use ADD only when you want tar extraction.',
              ],
              code: {
                language: 'dockerfile',
                lines: [
                  'WORKDIR /app',
                  '# Copy manifests first for better caching',
                  'COPY package.json package-lock.json ./',
                  'RUN npm ci',
                  '# Then copy the rest of the source',
                  'COPY . .',
                ],
                explanation:
                  'Copying manifests before the rest of the source keeps the dependency install layer cached when only application code changes.',
              },
              commonMistakes: [
                'Using ADD for ordinary file copies, inheriting surprising URL-fetch and tar-extract behaviour.',
                'Copying all source before installing dependencies, which busts the dependency cache on every code change.',
              ],
              exercises: [
                {
                  type: 'quiz',
                  prompt: 'When should you prefer COPY over ADD?',
                  hint: 'Which one is the predictable, no-surprises choice?',
                  solution: {
                    explanation:
                      'Almost always — COPY does exactly one predictable thing. Use ADD only when you specifically want its automatic local tar extraction.',
                  },
                },
                {
                  type: 'task',
                  prompt: 'Write Dockerfile lines that set the working directory to /app and copy package.json into it.',
                  solution: {
                    lines: ['WORKDIR /app', 'COPY package.json ./'],
                    explanation:
                      'WORKDIR /app makes /app the working directory, and COPY places package.json there relative to it.',
                  },
                },
                {
                  type: 'predict',
                  prompt: 'Why does copying package.json before the rest of the code improve caching?',
                  solution: {
                    explanation:
                      'The npm install layer only depends on package.json, so as long as it is unchanged Docker reuses the cached install layer even when application source changes.',
                  },
                },
              ],
              docs: 'https://docs.docker.com/reference/dockerfile/',
            },
            {
              id: 'dk2-t0-c2',
              title: 'RUN, ENV and EXPOSE',
              summary:
                'RUN executes commands at build time to install software or modify the filesystem, ENV sets environment variables baked into the image, and EXPOSE documents which ports the container listens on.',
              explanation:
                'RUN runs a command in a new layer during the build, which is how you install packages, compile code or create directories; each RUN adds a layer, so related commands are often combined with && to keep layers few and clean. ENV defines environment variables that persist into the running container and are visible to your process, useful for defaults like NODE_ENV or a config path. EXPOSE is purely documentation: it records which ports the application inside is expected to listen on, but it does not actually publish them to the host — that requires the -p flag at run time. Confusing EXPOSE with publishing is a very common beginner mistake. Together these instructions configure how the image is built and what its runtime defaults look like, without yet deciding what command runs when the container starts.',
              analogy:
                'RUN is the construction work done while building the house; ENV is the set of default settings left on the thermostat; EXPOSE is a label on the door saying which utilities are inside, not an actual connection to the street.',
              keyPoints: [
                'RUN executes build-time commands and creates a new layer each time.',
                'Combine related RUN commands with && to reduce layer count.',
                'ENV sets environment variables that persist into running containers.',
                'EXPOSE only documents ports; it does not publish them to the host.',
              ],
              code: {
                language: 'dockerfile',
                lines: [
                  'ENV NODE_ENV=production',
                  'RUN apt-get update && apt-get install -y --no-install-recommends curl \\',
                  '    && rm -rf /var/lib/apt/lists/*',
                  'EXPOSE 3000',
                ],
                explanation:
                  'One combined RUN keeps a single clean layer, ENV sets a runtime default, and EXPOSE documents the listening port.',
              },
              commonMistakes: [
                'Believing EXPOSE publishes a port to the host — it only documents intent; you still need -p.',
                'Using many separate RUN instructions, creating extra layers and leaving package caches behind.',
              ],
              exercises: [
                {
                  type: 'quiz',
                  prompt: 'Does EXPOSE make a container port reachable from your host machine?',
                  hint: 'Documentation versus actual publishing.',
                  solution: {
                    explanation:
                      'No. EXPOSE only documents which port the app listens on. To reach it from the host you must publish it at run time with -p, for example -p 8080:3000.',
                  },
                },
                {
                  type: 'predict',
                  prompt: 'You write three separate RUN apt-get commands. How many layers do they create and what is the downside?',
                  solution: {
                    explanation:
                      'Three layers. Beyond extra layers, intermediate caches may linger in earlier layers, bloating the image; combining them with && and cleaning caches in one RUN is leaner.',
                  },
                },
                {
                  type: 'task',
                  prompt: 'Write a Dockerfile line that sets an environment variable APP_PORT to 8080.',
                  solution: {
                    lines: ['ENV APP_PORT=8080'],
                    explanation:
                      'ENV defines APP_PORT so the running container and its process see it as an environment variable.',
                  },
                },
              ],
              docs: 'https://docs.docker.com/reference/dockerfile/',
            },
            {
              id: 'dk2-t0-c3',
              title: 'CMD vs ENTRYPOINT',
              summary:
                'CMD and ENTRYPOINT both define what runs when a container starts, but they behave differently: ENTRYPOINT sets the fixed executable while CMD provides default arguments that are easy to override.',
              explanation:
                'When a container starts it runs one process, and CMD and ENTRYPOINT control what that is. CMD specifies a default command or default arguments, and crucially anything you append after the image name on docker run replaces the CMD entirely. ENTRYPOINT defines the executable that always runs; arguments on docker run are passed to it rather than replacing it. The two combine powerfully: set ENTRYPOINT to your program and CMD to its default arguments, so the container behaves like a command-line tool that has sensible defaults yet accepts overrides. Always prefer the exec form, the JSON-array syntax, because the shell form wraps your process in a shell that can swallow termination signals, preventing graceful shutdown. Choosing between them comes down to whether you want a fully overridable default command (CMD alone) or a fixed program with overridable arguments (ENTRYPOINT plus CMD).',
              analogy:
                'ENTRYPOINT is the appliance itself, say a coffee machine, that always does one job; CMD is the default setting it boots with, which you can change by pressing a different button when you start it.',
              keyPoints: [
                'CMD sets a default command or arguments that docker run can fully override.',
                'ENTRYPOINT sets the fixed executable; run-time arguments are passed to it.',
                'Combine ENTRYPOINT plus CMD for a fixed program with overridable defaults.',
                'Prefer the exec (JSON array) form so signals reach your process for graceful shutdown.',
              ],
              code: {
                language: 'dockerfile',
                lines: [
                  '# Fixed program with a default argument',
                  'ENTRYPOINT ["python", "app.py"]',
                  'CMD ["--port", "8080"]',
                ],
                explanation:
                  'docker run image runs python app.py --port 8080, but docker run image --port 9000 overrides only the CMD arguments while keeping the ENTRYPOINT.',
              },
              commonMistakes: [
                'Using the shell form so a wrapping shell becomes PID 1 and intercepts SIGTERM, breaking graceful shutdown.',
                'Expecting run-time arguments to extend CMD when in fact they replace it entirely.',
              ],
              exercises: [
                {
                  type: 'quiz',
                  prompt: 'How does docker run treat arguments differently for CMD versus ENTRYPOINT?',
                  hint: 'Replace versus append.',
                  solution: {
                    explanation:
                      'Arguments after the image name replace CMD entirely, but they are appended as arguments to an ENTRYPOINT rather than replacing it.',
                  },
                },
                {
                  type: 'predict',
                  prompt: 'A Dockerfile has ENTRYPOINT ["echo"] and CMD ["hello"]. What does docker run image world print?',
                  solution: {
                    explanation:
                      'It prints world. The argument world replaces the CMD default hello and is passed to the echo ENTRYPOINT, so it runs echo world.',
                  },
                },
                {
                  type: 'quiz',
                  prompt: 'Why is the exec (JSON array) form preferred over the shell form?',
                  solution: {
                    explanation:
                      'The exec form runs your process directly as PID 1 so it receives signals like SIGTERM and can shut down gracefully; the shell form wraps it in a shell that may swallow those signals.',
                  },
                },
              ],
              docs: 'https://docs.docker.com/reference/dockerfile/',
            },
          ],
        },
        {
          id: 'dk2-t1',
          name: 'Layers and build cache',
          concepts: [
            {
              id: 'dk2-t1-c0',
              title: 'How the build cache works',
              summary:
                'Docker caches each built layer and reuses it on the next build if the instruction and its inputs are unchanged. Once a layer changes, every layer after it must be rebuilt.',
              explanation:
                'During a build, Docker processes the Dockerfile instruction by instruction, and for each one it checks whether it can reuse a previously cached layer. A layer is reused only if the instruction is identical and its inputs are unchanged — for a COPY, that means the copied files have the same contents. The cache is sequential: the moment one instruction produces a cache miss, every subsequent instruction is rebuilt too, because each layer depends on the one below it. This is why instruction ordering is so important for build speed. Place instructions that change rarely, such as installing system packages and dependencies, near the top, and instructions that change often, such as copying your source code, near the bottom. With BuildKit you can also use cache mounts to persist things like package-manager caches across builds. Mastering the cache is the difference between a build that takes seconds and one that reinstalls everything every time.',
              analogy:
                'It is like a recipe where you have pre-prepped ingredients in the fridge. As long as a step and its ingredients are unchanged you skip it, but the instant one early step differs you have to redo it and every step that follows.',
              keyPoints: [
                'Each instruction can reuse a cached layer if it and its inputs are unchanged.',
                'A COPY cache hit depends on the copied files being byte-identical.',
                'A single cache miss invalidates all subsequent layers.',
                'Order instructions from least- to most-frequently changing for speed.',
              ],
              diagram: {
                type: 'mermaid',
                lines: [
                  'flowchart TD',
                  '  A[FROM base] --> B[Install deps]',
                  '  B --> C[Copy source]',
                  '  C --> D[Build]',
                  '  C -->|source changed| Rebuild[Rebuild C and D only]',
                ],
                caption: 'Stable steps stay cached; a change to the source layer rebuilds only it and everything after.',
              },
              commonMistakes: [
                'Putting COPY . . before dependency installation, so every code change reinstalls all dependencies.',
                'Assuming the cache is keyed only by the instruction text, forgetting that COPY also hashes file contents.',
              ],
              exercises: [
                {
                  type: 'quiz',
                  prompt: 'What happens to the layers after an instruction that produces a cache miss?',
                  hint: 'The cache is sequential.',
                  solution: {
                    explanation:
                      'They all get rebuilt. Because each layer depends on the previous one, once one is invalidated none of the later cached layers can be reused.',
                  },
                },
                {
                  type: 'predict',
                  prompt: 'Your Dockerfile copies all source, then runs npm ci. You change one line of code. What gets rebuilt?',
                  solution: {
                    explanation:
                      'The COPY layer changes, so it and the npm ci layer after it both rebuild, reinstalling all dependencies. Copying manifests and installing before copying the rest would avoid this.',
                  },
                },
                {
                  type: 'quiz',
                  prompt: 'For a COPY instruction, what determines a cache hit?',
                  solution: {
                    explanation:
                      'Whether the contents of the copied files are unchanged. If any copied file differs, the COPY produces a new layer and the cache is missed.',
                  },
                },
              ],
              docs: 'https://docs.docker.com/build/cache/',
            },
            {
              id: 'dk2-t1-c1',
              title: 'Build context and .dockerignore',
              summary:
                'The build context is the set of files sent to the builder when you run docker build. A .dockerignore file excludes files from that context to speed builds and avoid leaking secrets.',
              explanation:
                'When you run docker build with a path, that directory becomes the build context, and its contents are packaged and sent to the builder so instructions like COPY can access them. If the context is large — say it includes node_modules, a .git folder, build artifacts or log files — sending it is slow and can accidentally bake unwanted or sensitive files into the image. A .dockerignore file, placed at the root of the context, lists patterns to exclude, working much like .gitignore. Excluding node_modules, .git, local environment files and temporary directories keeps the context small, speeds up the build, improves cache reliability, and prevents secrets from being copied in by a broad COPY . . instruction. A well-tuned .dockerignore is one of the simplest, highest-impact improvements you can make to a build.',
              analogy:
                'The build context is everything you pack into a suitcase before a trip; .dockerignore is the packing list that says leave the junk drawer and the secret diary at home so the bag is light and safe.',
              keyPoints: [
                'The build context is the files sent to the builder for a docker build.',
                'A large context slows builds and risks copying unwanted files in.',
                '.dockerignore at the context root excludes patterns, like .gitignore.',
                'Exclude node_modules, .git, env files and artifacts to stay lean and safe.',
              ],
              code: {
                language: 'bash',
                lines: [
                  '# A typical .dockerignore',
                  'node_modules',
                  '.git',
                  '*.log',
                  '.env',
                  'dist',
                ],
                explanation:
                  'These patterns keep heavy and sensitive files out of the build context so builds are faster and images cleaner.',
              },
              commonMistakes: [
                'Forgetting .dockerignore and shipping node_modules or .git inside the image.',
                'Leaving .env files in the context where COPY . . can bake secrets into a layer.',
              ],
              exercises: [
                {
                  type: 'quiz',
                  prompt: 'What is the build context and why does its size matter?',
                  hint: 'It is sent somewhere before the build runs.',
                  solution: {
                    explanation:
                      'It is the set of files packaged and sent to the builder for the build. A large context slows the build and risks copying unwanted or sensitive files into the image.',
                  },
                },
                {
                  type: 'task',
                  prompt: 'Write .dockerignore entries to exclude the git folder and all log files.',
                  solution: {
                    lines: ['.git', '*.log'],
                    explanation:
                      'Listing .git and *.log keeps the version-control directory and log files out of the build context.',
                  },
                },
                {
                  type: 'predict',
                  prompt: 'You have a .env file with secrets and a COPY . . in your Dockerfile but no .dockerignore. What is the risk?',
                  solution: {
                    explanation:
                      'COPY . . will copy .env into an image layer, baking the secrets into the image where anyone who pulls it can read them. Add .env to .dockerignore.',
                  },
                },
              ],
              docs: 'https://docs.docker.com/build/concepts/context/',
            },
          ],
        },
        {
          id: 'dk2-t2',
          name: 'Multi-stage builds and optimization',
          concepts: [
            {
              id: 'dk2-t2-c0',
              title: 'Multi-stage builds',
              summary:
                'Multi-stage builds let you use one stage with full build tools to compile your app and a second, minimal stage that contains only the finished artifact, producing a small, clean final image.',
              explanation:
                'A naive image often ends up bloated because the tools needed to build the app — compilers, dev dependencies, build caches — are baked into the final image even though they are useless at run time. Multi-stage builds solve this by allowing multiple FROM instructions in one Dockerfile, each starting a new stage. You do the heavy work in a build stage that has all the tooling, then start a fresh, minimal runtime stage and COPY only the produced artifacts from the earlier stage using COPY --from. Because the final image is based on the minimal stage, none of the build tooling comes along, dramatically shrinking size and attack surface. You can name stages with AS for clarity and even copy from external images. This pattern is the standard way to ship lean production images for compiled languages and for Node, Python or front-end builds alike.',
              analogy:
                'It is like cooking in a messy industrial kitchen but then plating only the finished dish onto a clean plate to serve. The diners get the meal, not the pots, peelings and dirty utensils.',
              keyPoints: [
                'Multiple FROM instructions create multiple build stages in one Dockerfile.',
                'Do heavy building in a tooling-rich stage, then start a minimal runtime stage.',
                'COPY --from brings only the needed artifacts into the final image.',
                'The result is a much smaller image with a reduced attack surface.',
              ],
              code: {
                language: 'dockerfile',
                lines: [
                  '# Build stage with full tooling',
                  'FROM node:20 AS build',
                  'WORKDIR /app',
                  'COPY package*.json ./',
                  'RUN npm ci',
                  'COPY . .',
                  'RUN npm run build',
                  '',
                  '# Minimal runtime stage',
                  'FROM nginx:alpine',
                  'COPY --from=build /app/dist /usr/share/nginx/html',
                ],
                explanation:
                  'The build stage compiles the app; the final image is a small nginx that contains only the built static files copied from the build stage.',
              },
              commonMistakes: [
                'Shipping the build stage as the final image, carrying compilers and dev dependencies into production.',
                'Forgetting COPY --from and accidentally referencing files that do not exist in the final stage.',
              ],
              exercises: [
                {
                  type: 'quiz',
                  prompt: 'What problem do multi-stage builds solve?',
                  hint: 'Think about what build tools do to image size.',
                  solution: {
                    explanation:
                      'They keep build-time tooling and dev dependencies out of the final image by building in one stage and copying only the finished artifacts into a minimal runtime stage, shrinking size and attack surface.',
                  },
                },
                {
                  type: 'task',
                  prompt: 'Write the instruction that copies a built dist folder from a stage named build into the current stage.',
                  solution: {
                    lines: ['COPY --from=build /app/dist /usr/share/nginx/html'],
                    explanation:
                      'COPY --from=build pulls the /app/dist artifacts produced in the earlier build stage into the final image.',
                  },
                },
                {
                  type: 'predict',
                  prompt: 'Without multi-stage builds, why might a compiled Go app produce a much larger image than necessary?',
                  solution: {
                    explanation:
                      'Because the Go toolchain and source remain in the image. With multi-stage you build in a Go image and copy only the static binary into a scratch or minimal base, yielding a tiny image.',
                  },
                },
              ],
              docs: 'https://docs.docker.com/build/building/multi-stage/',
            },
            {
              id: 'dk2-t2-c1',
              title: 'Base image choices: alpine, slim and distroless',
              summary:
                'Smaller base images reduce size, attack surface and pull time. Common minimal choices are alpine, the slim variants of official images, and distroless images that contain only your app and its runtime.',
              explanation:
                'Once you build cleanly, the next lever is the base image. Full distribution bases like debian or the default language images are convenient but large because they include shells, package managers and many utilities you may not need. Alpine is a tiny Linux distribution that produces very small images, though it uses musl libc instead of glibc, which occasionally causes compatibility issues with certain binaries. The slim variants of official images, like python:slim or node:slim, strip out optional extras while keeping the familiar Debian base, often a good balance. Distroless images go furthest: they contain only your application and its language runtime, with no shell or package manager at all, which minimises attack surface and image size at the cost of harder debugging. The right choice trades convenience and debuggability against size and security; many teams use slim or distroless for production and a richer base only for development.',
              analogy:
                'Choosing a base is like choosing a vehicle. A full distro is a fully loaded RV with a kitchen and beds; alpine is a compact hatchback; distroless is a stripped racing kart with only the engine and a seat — fast and light but no comforts for roadside repairs.',
              keyPoints: [
                'Smaller bases cut image size, pull time and attack surface.',
                'Alpine is tiny but uses musl libc, which can cause rare compatibility issues.',
                'slim variants strip extras while keeping a familiar Debian base.',
                'Distroless ships only app plus runtime, with no shell or package manager.',
              ],
              commonMistakes: [
                'Switching to alpine and hitting native-module or glibc compatibility failures without testing.',
                'Using distroless then being unable to exec a shell to debug, with no fallback plan.',
              ],
              exercises: [
                {
                  type: 'quiz',
                  prompt: 'What is the main trade-off of using a distroless base image?',
                  hint: 'Security and size versus what?',
                  solution: {
                    explanation:
                      'You gain minimal size and a small attack surface, but you lose a shell and package manager, which makes interactive debugging inside the container much harder.',
                  },
                },
                {
                  type: 'predict',
                  prompt: 'You move a Node app with native dependencies from node:20 to node:20-alpine and it crashes. What is a likely cause?',
                  solution: {
                    explanation:
                      'Alpine uses musl libc rather than glibc, so native modules compiled against glibc may not work. You may need to rebuild them for musl or use a slim Debian-based image instead.',
                  },
                },
                {
                  type: 'quiz',
                  prompt: 'Why does a smaller base image improve security as well as size?',
                  solution: {
                    explanation:
                      'Fewer packages and binaries mean a smaller attack surface and fewer components that could contain vulnerabilities, in addition to faster pulls and less storage.',
                  },
                },
              ],
              docs: 'https://docs.docker.com/build/building/best-practices/',
            },
            {
              id: 'dk2-t2-c2',
              title: 'BuildKit and buildx',
              summary:
                'BuildKit is Docker\'s modern build engine offering faster, parallel, cache-efficient builds and features like build secrets and cache mounts. buildx is the CLI front end that adds multi-platform builds.',
              explanation:
                'Modern Docker builds run on BuildKit, a rewritten build engine that is now the default. BuildKit parallelises independent build steps, has a smarter and more granular cache, and adds features that the old builder lacked: cache mounts that persist package caches across builds, build-time secrets via --secret so credentials never end up in a layer, and SSH forwarding for private dependency fetches. The buildx CLI is the user-facing tool that drives BuildKit and unlocks multi-platform builds, so you can produce a single image manifest that runs on both amd64 and arm64 from one command using --platform. To use the newer Dockerfile features you opt in with a syntax directive at the top of the file. In day-to-day terms, BuildKit means faster builds, safer secret handling, and the ability to ship images that run across CPU architectures, which matters as arm64 machines and Apple Silicon become common.',
              analogy:
                'If the old builder was a single worker doing steps one at a time, BuildKit is a coordinated crew working parallel tasks with a shared, well-organised tool shed, and buildx is the foreman who can also produce the same product for different markets at once.',
              keyPoints: [
                'BuildKit is the default modern build engine: parallel, cache-efficient, faster.',
                'It adds cache mounts, build secrets via --secret, and SSH forwarding.',
                'buildx drives BuildKit and enables multi-platform builds with --platform.',
                'Opt into newer Dockerfile features with a syntax directive at the top of the file.',
              ],
              code: {
                language: 'bash',
                lines: [
                  '# Build a multi-platform image with buildx',
                  'docker buildx build --platform linux/amd64,linux/arm64 -t myapp:1.0 --push .',
                  '',
                  '# Pass a build secret without baking it into a layer',
                  'docker build --secret id=npmrc,src=$HOME/.npmrc -t myapp .',
                ],
                explanation:
                  'buildx produces one image for two architectures and pushes it; --secret exposes a credential only during the build, never in the final image.',
              },
              commonMistakes: [
                'Passing secrets via ARG or ENV, which leaves them visible in image history; use --secret instead.',
                'Expecting multi-platform output without buildx, or forgetting --push since multi-platform builds cannot stay in the local daemon image store.',
              ],
              exercises: [
                {
                  type: 'quiz',
                  prompt: 'How should you pass a secret needed only during the build so it does not end up in the image?',
                  hint: 'A BuildKit feature, not ARG or ENV.',
                  solution: {
                    explanation:
                      'Use BuildKit build secrets with --secret. The secret is mounted only during the relevant build step and is never written into a layer or image history.',
                  },
                },
                {
                  type: 'task',
                  prompt: 'Build and push an image for both amd64 and arm64 in one command.',
                  solution: {
                    lines: ['docker buildx build --platform linux/amd64,linux/arm64 -t myorg/myapp:1.0 --push .'],
                    explanation:
                      'buildx with --platform produces a multi-architecture manifest, and --push uploads it to the registry in one step.',
                  },
                },
                {
                  type: 'predict',
                  prompt: 'Why might a teammate on Apple Silicon get a slow or non-running image you built on an amd64 CI server without multi-platform support?',
                  solution: {
                    explanation:
                      'Your single-arch amd64 image must run under emulation on their arm64 machine, which is slow or may fail. A multi-platform build with buildx would provide a native arm64 variant too.',
                  },
                },
              ],
              docs: 'https://docs.docker.com/build/buildkit/',
            },
          ],
        },
      ],
    },
    /* ───────────────────── LEVEL 3 — RUNNING AND OPERATING ───────────────────── */
    {
      level: 3,
      name: 'Running and operating containers',
      focus: 'The container lifecycle, runtime configuration, and debugging and observability',
      accent: '#2496ed',
      soft: '#e6f4fd',
      topics: [
        {
          id: 'dk3-t0',
          name: 'Container lifecycle',
          concepts: [
            {
              id: 'dk3-t0-c0',
              title: 'run, start, stop and rm',
              summary:
                'A container moves through states: created, running, stopped and removed. docker run creates and starts one, stop and start pause and resume it, and rm deletes a stopped container.',
              explanation:
                'Containers have a clear lifecycle and the core commands map onto it. docker run is really two steps fused together: it creates a container from an image and then starts it. docker stop sends the main process a graceful termination signal (SIGTERM) and, after a grace period, a forceful SIGKILL, leaving a stopped container that still exists on disk. docker start runs a stopped container again, reusing its writable layer and configuration, while docker restart stops and starts in one go. docker rm permanently deletes a stopped container and its writable layer; you cannot remove a running container without -f. Stopped containers linger and accumulate, so part of operating Docker is cleaning them up. Understanding that stopped is distinct from removed explains why docker ps -a still lists exited containers and why their data survives a stop but not a rm.',
              analogy:
                'A container is like a virtual appliance you can power off and on. Stopping is unplugging it but leaving it on the shelf; removing is throwing the whole appliance, and whatever was inside it, into the bin.',
              keyPoints: [
                'docker run creates and starts a container in one step.',
                'docker stop sends SIGTERM then SIGKILL after a grace period.',
                'A stopped container still exists; docker start resumes it with its data intact.',
                'docker rm permanently deletes a stopped container and its writable layer.',
              ],
              diagram: {
                type: 'mermaid',
                lines: [
                  'flowchart LR',
                  '  Created -->|run| Running',
                  '  Running -->|stop| Stopped',
                  '  Stopped -->|start| Running',
                  '  Stopped -->|rm| Removed',
                ],
                caption: 'The container lifecycle: created, running, stopped, and finally removed.',
              },
              commonMistakes: [
                'Thinking docker stop deletes the container — it only stops it; it remains until rm.',
                'Trying to docker rm a running container without -f and being confused by the error.',
              ],
              exercises: [
                {
                  type: 'quiz',
                  prompt: 'What is the difference between stopping and removing a container?',
                  hint: 'One keeps it on disk.',
                  solution: {
                    explanation:
                      'Stopping ends the running process but the container and its writable layer still exist and can be restarted; removing permanently deletes the container and its writable layer.',
                  },
                },
                {
                  type: 'task',
                  prompt: 'Stop a container named web and then permanently remove it.',
                  solution: {
                    lines: ['docker stop web', 'docker rm web'],
                    explanation:
                      'docker stop ends the process gracefully, then docker rm deletes the now-stopped container.',
                  },
                },
                {
                  type: 'predict',
                  prompt: 'What signal sequence does docker stop send, and why does it matter for your app?',
                  solution: {
                    explanation:
                      'It sends SIGTERM first, giving the app a chance to shut down gracefully, then SIGKILL after a grace period if it has not exited. Handling SIGTERM lets your app finish requests and close resources cleanly.',
                  },
                },
              ],
              docs: 'https://docs.docker.com/engine/containers/run/',
            },
            {
              id: 'dk3-t0-c1',
              title: 'Detached mode and interactive sessions',
              summary:
                'The -d flag runs a container in the background, while -it attaches an interactive terminal. Choosing the right combination shapes how you run servers versus interactive tools.',
              explanation:
                'How you attach to a container depends on what it is. For long-running services like a web server or database you use -d (detached) so the container runs in the background and returns your prompt, printing only the container ID. To work interactively inside a container — for example to explore a shell or run a one-off command that needs input — you combine -i (keep stdin open) and -t (allocate a pseudo-TTY), commonly written -it, which gives you a usable interactive terminal. Running a container in the foreground without -d streams its output to your terminal and ties up your shell until it exits, which is fine for short tasks but awkward for servers. You can also attach to or detach from a running container later. Picking the right mode is a small thing that makes the daily workflow far smoother.',
              analogy:
                'Detached mode is like starting a background music player and getting back to work; interactive -it mode is like sitting down at the container\'s own keyboard and screen to type commands directly.',
              keyPoints: [
                '-d runs the container in the background and returns your prompt.',
                '-it (combine -i and -t) gives an interactive terminal session.',
                'Foreground mode streams output and blocks your shell until exit.',
                'Use -d for services and -it for shells and interactive tools.',
              ],
              code: {
                language: 'bash',
                lines: [
                  '# Run a server detached in the background',
                  'docker run -d --name api myapi',
                  '',
                  '# Open an interactive shell in a new ubuntu container',
                  'docker run -it ubuntu bash',
                ],
                explanation:
                  'The first command backgrounds a service; the second drops you into an interactive bash shell inside a fresh Ubuntu container.',
              },
              exercises: [
                {
                  type: 'quiz',
                  prompt: 'What do the -i and -t flags each do, and why are they usually combined?',
                  hint: 'One keeps input open, the other allocates a terminal.',
                  solution: {
                    explanation:
                      '-i keeps stdin open so you can type, and -t allocates a pseudo-TTY so the session behaves like a real terminal. Combined as -it they give a proper interactive shell.',
                  },
                },
                {
                  type: 'task',
                  prompt: 'Open an interactive shell inside a new alpine container.',
                  solution: {
                    lines: ['docker run -it alpine sh'],
                    explanation:
                      '-it gives an interactive terminal and sh is alpine\'s default shell, dropping you into a prompt inside the container.',
                  },
                },
                {
                  type: 'predict',
                  prompt: 'You run a web server without -d. What happens to your terminal?',
                  solution: {
                    explanation:
                      'The server runs in the foreground, streaming its logs to your terminal and blocking it until you stop the container, for example with Ctrl-C.',
                  },
                },
              ],
              docs: 'https://docs.docker.com/engine/containers/run/',
            },
            {
              id: 'dk3-t0-c2',
              title: 'Restart policies and --rm',
              summary:
                'Restart policies tell the daemon to automatically restart containers after a crash or reboot, while --rm automatically deletes a container as soon as it exits, keeping the system tidy.',
              explanation:
                'For services you usually want resilience: if the container crashes or the host reboots, it should come back automatically. The --restart flag configures this with policies such as no (never), on-failure (restart only on a non-zero exit, optionally limited to N attempts), always (always restart, even after a daemon restart), and unless-stopped (like always but respects a manual stop). These policies are the simplest form of self-healing on a single host. At the other end of the lifecycle, for short-lived or one-off containers you often do not want a stopped container lingering afterwards, so --rm tells Docker to delete the container automatically the instant it exits. The two flags address opposite needs: keep services running no matter what, and clean up throwaway containers without manual rm. Choosing the right policy is a key operational decision.',
              analogy:
                'A restart policy is like a circuit breaker that flips itself back on after a fault; --rm is like a self-cleaning oven that disposes of the mess automatically once the job is done.',
              keyPoints: [
                '--restart sets policies: no, on-failure, always, unless-stopped.',
                'always restarts even after a daemon or host reboot; unless-stopped respects manual stops.',
                'on-failure restarts only on a non-zero exit and can cap retry attempts.',
                '--rm auto-removes the container as soon as it exits, avoiding clutter.',
              ],
              code: {
                language: 'bash',
                lines: [
                  '# A resilient service that restarts unless you stop it',
                  'docker run -d --restart unless-stopped --name web nginx',
                  '',
                  '# A throwaway task that cleans itself up on exit',
                  'docker run --rm alpine echo done',
                ],
                explanation:
                  'The nginx container self-heals and survives reboots; the alpine task removes itself the moment it finishes.',
              },
              commonMistakes: [
                'Using --restart always on a one-off task so it loops endlessly after each exit.',
                'Forgetting --rm on frequent throwaway runs, leaving dozens of exited containers behind.',
              ],
              exercises: [
                {
                  type: 'quiz',
                  prompt: 'What is the difference between the always and unless-stopped restart policies?',
                  hint: 'What happens after you manually stop the container and the daemon restarts?',
                  solution: {
                    explanation:
                      'Both restart on crashes and daemon start, but unless-stopped will not restart a container you stopped manually, whereas always will bring it back even after a manual stop once the daemon restarts.',
                  },
                },
                {
                  type: 'task',
                  prompt: 'Run a redis container that automatically restarts on failure but is not deleted.',
                  solution: {
                    lines: ['docker run -d --restart on-failure --name cache redis'],
                    explanation:
                      'on-failure restarts the container only when it exits with an error, providing self-healing without auto-removal.',
                  },
                },
                {
                  type: 'predict',
                  prompt: 'You run a quick database migration with --rm. After it finishes, will it appear in docker ps -a?',
                  solution: {
                    explanation:
                      'No. With --rm the container is removed automatically as soon as it exits, so it will not show up even in docker ps -a.',
                  },
                },
              ],
              docs: 'https://docs.docker.com/engine/containers/start-containers-automatically/',
            },
          ],
        },
        {
          id: 'dk3-t1',
          name: 'Configuration',
          concepts: [
            {
              id: 'dk3-t1-c0',
              title: 'Environment variables and --env-file',
              summary:
                'Containers are configured at run time mainly through environment variables, set individually with -e or in bulk from a file with --env-file, following the twelve-factor approach.',
              explanation:
                'The standard way to configure a containerised app without rebuilding the image is environment variables, in line with the twelve-factor methodology that stores configuration in the environment. You set a single variable with -e KEY=value, and you can pass several by repeating the flag. For many variables, an --env-file points at a file of KEY=value lines, which keeps long commands manageable and lets you keep configuration out of your shell history. Variables set this way override any defaults baked in with ENV in the Dockerfile, so the same image can be configured differently per environment — development, staging, production — purely at run time. This separation of code from configuration is what lets you build one image and deploy it everywhere, only changing the environment. It is the everyday mechanism for things like database URLs, feature flags and log levels.',
              analogy:
                'Environment variables are like the dial settings on an appliance. The appliance (image) is the same everywhere; you just turn the dials differently for each kitchen.',
              keyPoints: [
                '-e KEY=value sets a single environment variable at run time.',
                '--env-file loads many KEY=value pairs from a file.',
                'Run-time variables override Dockerfile ENV defaults.',
                'This separates configuration from the image, enabling one image for all environments.',
              ],
              code: {
                language: 'bash',
                lines: [
                  '# Set variables individually',
                  'docker run -e LOG_LEVEL=debug -e PORT=8080 myapp',
                  '',
                  '# Or load them from a file',
                  'docker run --env-file ./prod.env myapp',
                ],
                explanation:
                  'Both forms configure the same image differently at run time without rebuilding, the second keeping many variables in one tidy file.',
              },
              exercises: [
                {
                  type: 'quiz',
                  prompt: 'Why configure containers with environment variables rather than baking config into the image?',
                  hint: 'Think one image, many environments.',
                  solution: {
                    explanation:
                      'It separates configuration from code so the same image can be deployed to every environment with different settings supplied at run time, following the twelve-factor approach.',
                  },
                },
                {
                  type: 'task',
                  prompt: 'Run an image myapp with two environment variables: NODE_ENV set to production and PORT set to 3000.',
                  solution: {
                    lines: ['docker run -e NODE_ENV=production -e PORT=3000 myapp'],
                    explanation:
                      'Repeating the -e flag sets multiple environment variables for the container at run time.',
                  },
                },
                {
                  type: 'predict',
                  prompt: 'Your Dockerfile has ENV LOG_LEVEL=info but you run with -e LOG_LEVEL=debug. Which value wins?',
                  solution: {
                    explanation:
                      'debug wins. A run-time -e value overrides the ENV default defined in the Dockerfile.',
                  },
                },
              ],
              docs: 'https://docs.docker.com/engine/containers/run/',
            },
            {
              id: 'dk3-t1-c1',
              title: 'ARG vs ENV',
              summary:
                'ARG defines build-time variables available only while the image is being built, whereas ENV defines variables that persist into the running container. Mixing them up causes subtle bugs and leaks.',
              explanation:
                'ARG and ENV both define variables but at different phases. ARG values exist only during the build and are not present in the running container; you supply them with --build-arg and use them to parameterise the build, such as choosing a version to install. ENV values are written into the image and remain available to the process at run time. A critical security point follows: build arguments are visible in the image history, so they must never carry secrets — anyone who pulls the image can read them with docker history. Likewise, do not copy a secret from an ARG into an ENV expecting it to be hidden. When you need a value at build time that also influences run time you can reference an ARG to set an ENV, but be deliberate about it. The rule of thumb is ARG for non-sensitive build parameters and ENV for run-time configuration, with true secrets handled separately.',
              analogy:
                'ARG is like a note you use while assembling furniture and then throw away; ENV is a label you stick on the finished furniture that stays with it. Never write a password on either, because both can be read later.',
              keyPoints: [
                'ARG variables exist only during the build, supplied via --build-arg.',
                'ENV variables persist into the running container at run time.',
                'ARG values appear in docker history, so they must not contain secrets.',
                'Use ARG for build parameters and ENV for run-time configuration.',
              ],
              code: {
                language: 'dockerfile',
                lines: [
                  '# Build-time parameter with a default',
                  'ARG NODE_VERSION=20',
                  'FROM node:${NODE_VERSION}',
                  '# Run-time configuration baked into the image',
                  'ENV APP_HOME=/app',
                ],
                explanation:
                  'ARG NODE_VERSION parameterises the build and disappears afterwards, while ENV APP_HOME stays available to the running container.',
              },
              commonMistakes: [
                'Passing secrets via --build-arg, exposing them in image history.',
                'Expecting an ARG to be available at run time inside the container — it is not unless promoted to ENV.',
              ],
              exercises: [
                {
                  type: 'quiz',
                  prompt: 'At which phase is each available: ARG and ENV?',
                  hint: 'Build time versus run time.',
                  solution: {
                    explanation:
                      'ARG is available only during the build, while ENV persists into and is available at run time inside the container.',
                  },
                },
                {
                  type: 'predict',
                  prompt: 'A developer passes an API token with --build-arg TOKEN=secret. Why is this dangerous?',
                  solution: {
                    explanation:
                      'Build args are recorded in the image history, so anyone with the image can run docker history and read the token. Secrets must use BuildKit --secret or run-time injection, never --build-arg.',
                  },
                },
                {
                  type: 'quiz',
                  prompt: 'How do you make a build-time value also available at run time?',
                  solution: {
                    explanation:
                      'Reference the ARG when setting an ENV (for example ENV FOO=${FOO}), which copies the build-time value into a persistent environment variable — but never do this with secrets.',
                  },
                },
              ],
              docs: 'https://docs.docker.com/reference/dockerfile/',
            },
            {
              id: 'dk3-t1-c2',
              title: 'Passing secrets at run time',
              summary:
                'Secrets like passwords and API keys should never be baked into images. At run time, inject them through environment variables from a secret store, mounted files, or orchestrator secret mechanisms.',
              explanation:
                'Secrets need extra care because images are often shared and stored in registries. The wrong approaches are baking secrets into image layers with ENV or --build-arg, since both leave the secret recoverable from the image. The better run-time options are to inject secrets as environment variables sourced from a secure store, or to mount them as files into the container so the application reads them from a known path, which avoids exposing them in the process environment listing. In Compose and Swarm there is a dedicated secrets mechanism that mounts secret files into the container filesystem with tight permissions, and orchestrators like Kubernetes have their own Secret objects. Even with environment variables, you should source them from a vault or secrets manager rather than committing them to files in version control. The guiding principle is that the image stays generic and free of secrets, and the sensitive values are supplied only when and where the container actually runs.',
              analogy:
                'The image is a hotel room that anyone might be assigned; you would never tape the safe combination to the wall. Instead the guest is handed the code at check-in (run time) and it is theirs only for the stay.',
              keyPoints: [
                'Never bake secrets into images via ENV or --build-arg.',
                'Inject secrets at run time as env vars from a vault, or as mounted files.',
                'Mounted secret files avoid exposing values in the process environment.',
                'Compose, Swarm and Kubernetes provide dedicated secret mechanisms.',
              ],
              commonMistakes: [
                'Committing .env files with real secrets and copying them into the image.',
                'Assuming environment variables are private — they can be read via inspect or the process environment by anyone with access.',
              ],
              exercises: [
                {
                  type: 'quiz',
                  prompt: 'Why must secrets not be set with ENV or --build-arg in a Dockerfile?',
                  hint: 'Where do those values end up?',
                  solution: {
                    explanation:
                      'Both persist into the image — ENV into a layer and --build-arg into the build history — so anyone who pulls the image can recover the secret. Secrets must be supplied at run time instead.',
                  },
                },
                {
                  type: 'predict',
                  prompt: 'Two ways to give a running container a database password are an environment variable and a mounted secret file. Which keeps it out of the process environment listing?',
                  solution: {
                    explanation:
                      'The mounted file. An environment variable can be read via docker inspect or by listing the process environment, whereas a mounted secret file is read only by the app from a path.',
                  },
                },
                {
                  type: 'quiz',
                  prompt: 'Where should the actual secret values come from rather than being committed to the repo?',
                  solution: {
                    explanation:
                      'From a secrets manager or vault, or the orchestrator\'s secret mechanism, so they are never stored in version control and are injected only at run time.',
                  },
                },
              ],
              docs: 'https://docs.docker.com/engine/swarm/secrets/',
            },
            {
              id: 'dk3-t1-c3',
              title: 'Resource limits',
              summary:
                'By default a container can use all the host\'s CPU and memory. Flags like --memory and --cpus apply cgroup limits so one container cannot starve the others or the host.',
              explanation:
                'Without limits a container can consume as much CPU and memory as the host allows, which on a shared host means a single misbehaving container can degrade everything else. Docker exposes the underlying cgroup controls through run-time flags. --memory sets a hard memory ceiling; if the process exceeds it the kernel\'s out-of-memory killer terminates it, which is why you often see exit code 137. --cpus limits CPU as a fraction of cores, so --cpus=1.5 allows up to one and a half cores of compute, and there are finer controls like --cpu-shares for relative weighting under contention. Setting sensible limits is essential for predictable, fair multi-tenant operation and for protecting the host. You can confirm what a running container is actually using with docker stats. In production, limits also help schedulers place workloads and prevent noisy-neighbour problems.',
              analogy:
                'Resource limits are like giving each tenant a metered allowance of water and electricity. Without meters, one wasteful tenant could drain the building; with them, everyone gets a fair, capped share.',
              keyPoints: [
                'By default containers can use all host CPU and memory.',
                '--memory sets a hard memory cap; breaching it triggers an OOM kill (often exit 137).',
                '--cpus limits CPU as a fraction of cores; --cpu-shares sets relative weight.',
                'Limits enforce fairness and protect the host from noisy neighbours.',
              ],
              code: {
                language: 'bash',
                lines: [
                  '# Cap a container at 1.5 CPUs and 512 MB of memory',
                  'docker run -d --cpus=1.5 --memory=512m --name worker myworker',
                ],
                explanation:
                  'These flags translate into cgroup limits so the worker cannot exceed 1.5 cores or 512 MB regardless of demand.',
              },
              commonMistakes: [
                'Running everything unlimited, letting one container exhaust host memory and trigger cascading OOM kills.',
                'Seeing exit code 137 and not realising it usually means the container was OOM killed for exceeding --memory.',
              ],
              exercises: [
                {
                  type: 'quiz',
                  prompt: 'What typically happens when a container exceeds its --memory limit?',
                  hint: 'A kernel mechanism steps in.',
                  solution: {
                    explanation:
                      'The kernel\'s out-of-memory killer terminates the container\'s process, commonly surfacing as exit code 137. The container does not get more memory than its cap.',
                  },
                },
                {
                  type: 'task',
                  prompt: 'Run an image myapp limited to half a CPU and 256 MB of memory.',
                  solution: {
                    lines: ['docker run -d --cpus=0.5 --memory=256m myapp'],
                    explanation:
                      '--cpus=0.5 caps CPU at half a core and --memory=256m caps memory at 256 MB via cgroups.',
                  },
                },
                {
                  type: 'predict',
                  prompt: 'On a shared host one container has no limits and runs a memory leak. What can happen to the other containers?',
                  solution: {
                    explanation:
                      'The leaking container can consume the host\'s memory, causing the kernel to OOM kill processes, potentially including other containers, degrading or crashing them. Limits would have contained the damage.',
                  },
                },
              ],
              docs: 'https://docs.docker.com/engine/containers/resource_constraints/',
            },
          ],
        },
        {
          id: 'dk3-t2',
          name: 'Debugging and observability',
          concepts: [
            {
              id: 'dk3-t2-c0',
              title: 'Reading logs',
              summary:
                'docker logs streams a container\'s stdout and stderr, which is where containerised apps should write their output. Flags like -f and --tail make it practical for live debugging.',
              explanation:
                'The container convention is that applications log to standard output and standard error rather than to files inside the container, and Docker captures those streams. docker logs <container> prints what the main process has written, -f follows the stream live like tail -f, and --tail N limits the output to the last N lines so you are not flooded by history. Timestamps can be added with -t, and --since narrows to a time window. Because logs are tied to the container, they are available even after the process exits, which is invaluable when a container crashed and you need to see why. Behind the scenes a logging driver decides where output goes; the default keeps it locally as JSON files, but in production you often configure a driver that ships logs to a central system. Knowing docker logs well is usually the first step in diagnosing any container problem.',
              analogy:
                'docker logs is the flight recorder of a container. Even after it has crashed, you can play back exactly what it was saying right up to the moment things went wrong.',
              keyPoints: [
                'Containerised apps should log to stdout and stderr, which Docker captures.',
                'docker logs prints captured output; -f follows it live.',
                '--tail limits lines, -t adds timestamps, --since narrows the window.',
                'Logs remain available after the container exits, aiding crash diagnosis.',
              ],
              code: {
                language: 'bash',
                lines: [
                  '# Follow the last 100 lines live, with timestamps',
                  'docker logs -f --tail 100 -t web',
                ],
                explanation:
                  'This streams the web container\'s recent output live so you can watch behaviour in real time while reproducing an issue.',
              },
              commonMistakes: [
                'Writing logs to a file inside the container, where docker logs cannot see them and they vanish on removal.',
                'Running docker logs without --tail on a noisy container and being overwhelmed by history.',
              ],
              exercises: [
                {
                  type: 'quiz',
                  prompt: 'Where should a containerised application send its logs, and why?',
                  hint: 'Think about what Docker captures.',
                  solution: {
                    explanation:
                      'To stdout and stderr, because Docker captures those streams and exposes them through docker logs and logging drivers, keeping logs accessible and shippable rather than trapped in files inside the container.',
                  },
                },
                {
                  type: 'task',
                  prompt: 'Follow the live logs of a container named api, showing only the last 50 lines first.',
                  solution: {
                    lines: ['docker logs -f --tail 50 api'],
                    explanation:
                      '--tail 50 starts from the last 50 lines and -f keeps streaming new output as it arrives.',
                  },
                },
                {
                  type: 'predict',
                  prompt: 'A container exited unexpectedly. Can you still see why with docker logs?',
                  solution: {
                    explanation:
                      'Yes, as long as the container has not been removed. Its captured stdout and stderr remain available, so you can inspect the final output that preceded the exit.',
                  },
                },
              ],
              docs: 'https://docs.docker.com/engine/logging/',
            },
            {
              id: 'dk3-t2-c1',
              title: 'exec and inspect',
              summary:
                'docker exec runs a new command inside a running container, typically a shell for debugging, while docker inspect dumps the full low-level configuration and state of a container or image as JSON.',
              explanation:
                'When logs are not enough you go inside. docker exec runs an additional process in an already-running container, and exec -it <container> sh or bash drops you into an interactive shell so you can list files, check processes or test connectivity from the container\'s point of view. It is important that exec does not start a new container; it joins the existing one, sharing its namespaces. docker inspect, on the other hand, returns a detailed JSON document describing a container or image: its configuration, environment variables, mounts, network settings, restart policy and current state. You can pull out a single field with a Go-template format string, which is handy in scripts — for instance extracting a container\'s IP address. Together exec gives you an interactive view from inside, and inspect gives you the authoritative configuration from outside, and most debugging sessions use both.',
              analogy:
                'docker exec is like stepping inside a running machine to look around while it operates; docker inspect is like reading the machine\'s full spec sheet and current dashboard readings from the outside.',
              keyPoints: [
                'docker exec runs a command in an already-running container, often a shell.',
                'exec joins the existing container; it does not start a new one.',
                'docker inspect returns full JSON config and state for a container or image.',
                'Use a --format Go template to extract a single field from inspect output.',
              ],
              code: {
                language: 'bash',
                lines: [
                  '# Open an interactive shell inside a running container',
                  'docker exec -it web sh',
                  '',
                  '# Extract just the container IP address',
                  'docker inspect --format \'{{range .NetworkSettings.Networks}}{{.IPAddress}}{{end}}\' web',
                ],
                explanation:
                  'exec lets you poke around inside the live container, while inspect with a format template pulls one precise value out of the full configuration.',
              },
              commonMistakes: [
                'Confusing docker exec with docker run — exec needs a running container and does not create one.',
                'Trying to bash into a distroless or minimal image that has no shell, then being puzzled by the error.',
              ],
              exercises: [
                {
                  type: 'quiz',
                  prompt: 'What is the key difference between docker exec and docker run?',
                  hint: 'New versus existing container.',
                  solution: {
                    explanation:
                      'docker run creates and starts a new container from an image, while docker exec runs an additional command inside a container that is already running.',
                  },
                },
                {
                  type: 'task',
                  prompt: 'Open a bash shell inside a running container named db.',
                  solution: {
                    lines: ['docker exec -it db bash'],
                    explanation:
                      'exec -it joins the running db container with an interactive terminal and starts bash inside it.',
                  },
                },
                {
                  type: 'predict',
                  prompt: 'You run docker exec -it app sh on a distroless container and get an error that sh is not found. Why?',
                  solution: {
                    explanation:
                      'Distroless images contain no shell, so there is no sh to execute. You would need a debug image variant or a different technique to inspect it.',
                  },
                },
              ],
              docs: 'https://docs.docker.com/reference/cli/docker/container/exec/',
            },
            {
              id: 'dk3-t2-c2',
              title: 'stats and healthchecks',
              summary:
                'docker stats shows live resource usage for running containers, and a HEALTHCHECK defines a command Docker runs periodically to report whether a container is healthy, which orchestrators can act on.',
              explanation:
                'Observability has two complementary pieces here. docker stats streams a live table of CPU, memory, network and block I/O per container, letting you spot a container that is pegging a CPU or leaking memory in real time. For deeper health signals you define a HEALTHCHECK, either in the Dockerfile or at run time, which is a command Docker executes on an interval — for a web app this is typically a request to a health endpoint. Based on the command\'s exit code, the container\'s status becomes healthy or unhealthy, visible in docker ps. This matters because a container can be running yet not actually serving traffic; a healthcheck distinguishes the two. Orchestrators and Compose use health status to decide whether to route traffic, restart, or hold back dependent services until a dependency is truly ready. Together stats and healthchecks turn opaque containers into observable, self-reporting components.',
              analogy:
                'docker stats is the vital-signs monitor showing heart rate and blood pressure in real time; a healthcheck is the periodic doctor asking are you actually OK, and recording a clear healthy or unhealthy verdict.',
              keyPoints: [
                'docker stats streams live CPU, memory, network and I/O per container.',
                'A HEALTHCHECK runs a command on an interval to judge container health.',
                'The exit code sets the status to healthy or unhealthy, shown in docker ps.',
                'A running container is not necessarily serving; healthchecks reveal the difference.',
              ],
              code: {
                language: 'dockerfile',
                lines: [
                  'HEALTHCHECK --interval=30s --timeout=3s --retries=3 \\',
                  '  CMD curl -f http://localhost:3000/health || exit 1',
                ],
                explanation:
                  'Every 30 seconds Docker requests the health endpoint; if it fails three times in a row the container is marked unhealthy.',
              },
              commonMistakes: [
                'Treating a running status as proof the app works, when only a healthcheck confirms it is serving.',
                'Writing a healthcheck command that the image cannot run, for example using curl in an image without it.',
              ],
              exercises: [
                {
                  type: 'quiz',
                  prompt: 'Why is a HEALTHCHECK more informative than simply knowing a container is running?',
                  hint: 'Running versus actually serving.',
                  solution: {
                    explanation:
                      'A container can be running yet unable to serve requests. A healthcheck actively probes the app and reports healthy or unhealthy, so you and orchestrators know whether it is truly working.',
                  },
                },
                {
                  type: 'task',
                  prompt: 'Show a live, streaming view of resource usage for all running containers.',
                  solution: {
                    lines: ['docker stats'],
                    explanation:
                      'docker stats with no arguments streams CPU, memory, network and I/O usage for every running container.',
                  },
                },
                {
                  type: 'predict',
                  prompt: 'A healthcheck uses curl but the base image is alpine without curl installed. What status will the container report?',
                  solution: {
                    explanation:
                      'The healthcheck command will fail because curl is missing, so the container will be marked unhealthy even if the app is fine. You must install curl or use a tool that exists in the image.',
                  },
                },
              ],
              docs: 'https://docs.docker.com/reference/dockerfile/',
            },
          ],
        },
      ],
    },
    /* ───────────────────── LEVEL 4 — DATA AND NETWORKING ───────────────────── */
    {
      level: 4,
      name: 'Data and networking',
      focus: 'Persisting data with volumes, connecting containers with networks, and distributing images',
      accent: '#2496ed',
      soft: '#e6f4fd',
      topics: [
        {
          id: 'dk4-t0',
          name: 'Volumes and mounts',
          concepts: [
            {
              id: 'dk4-t0-c0',
              title: 'Why container storage is ephemeral',
              summary:
                'A container\'s writable layer is deleted when the container is removed, so anything written there is lost. Persistent data must live outside the container, in a volume or mount.',
              explanation:
                'Recall that a running container adds a thin writable layer on top of the read-only image layers. Any file the application creates or changes lands in that writable layer, and crucially that layer is destroyed when the container is removed. This is by design — containers are meant to be disposable and replaceable — but it means that databases, uploaded files and any state would vanish on every redeploy if left in the container. The solution is to store persistent data outside the container\'s lifecycle, which Docker provides through mounts. The two main kinds are volumes, managed by Docker in a dedicated area, and bind mounts, which map a path on the host directly into the container. Either way the data outlives the container, so you can stop, remove and recreate the container while keeping its state. Recognising what is ephemeral and what must be persisted is fundamental to running stateful services safely.',
              analogy:
                'A container is like a hotel room: it gets cleaned out completely when you check out. Anything you want to keep, you put in the hotel safe or take home with you — that is your volume or mount.',
              keyPoints: [
                'The container writable layer is deleted when the container is removed.',
                'Containers are intentionally disposable, so in-container data is ephemeral.',
                'Persistent data must live outside the container in a volume or mount.',
                'Mounts let data outlive container stop, remove and recreate cycles.',
              ],
              commonMistakes: [
                'Storing a database\'s data files in the container\'s writable layer and losing them on every recreate.',
                'Assuming a docker stop preserves nothing — stop keeps data, but a subsequent rm without a volume loses it.',
              ],
              exercises: [
                {
                  type: 'quiz',
                  prompt: 'Why is data written inside a container considered ephemeral?',
                  hint: 'Think about the writable layer.',
                  solution: {
                    explanation:
                      'It lives in the container\'s writable layer, which is destroyed when the container is removed. Persistent data must be kept outside the container in a volume or mount.',
                  },
                },
                {
                  type: 'predict',
                  prompt: 'You run a Postgres container with no volume, write data, then docker rm it and recreate it. Is the data still there?',
                  solution: {
                    explanation:
                      'No. Without a volume the data was in the writable layer, which was deleted by docker rm. The recreated container starts empty.',
                  },
                },
              ],
              docs: 'https://docs.docker.com/engine/storage/',
            },
            {
              id: 'dk4-t0-c1',
              title: 'Named volumes vs bind mounts vs tmpfs',
              summary:
                'Docker offers three mount types: named volumes managed by Docker, bind mounts that map a host path, and tmpfs mounts that keep data in memory only. Each suits different needs.',
              explanation:
                'There are three ways to attach storage to a container. A named volume is managed entirely by Docker in its own storage area; you refer to it by name, Docker handles where it lives on disk, and it is the recommended choice for persistent application data like databases because it is portable and decoupled from the host layout. A bind mount maps a specific directory on the host into the container, which is ideal during development for editing source on the host and seeing changes live inside the container, but it ties you to the host\'s filesystem and paths. A tmpfs mount stores data in the host\'s memory only, so it is fast and never touches disk, suiting sensitive scratch data or caches you want gone when the container stops. The modern --mount syntax expresses all three explicitly with type=volume, type=bind or type=tmpfs, and is clearer than the older -v shorthand. Choosing the right type is mostly about persistence needs and whether you want host coupling.',
              analogy:
                'A named volume is a storage unit the warehouse manages for you; a bind mount is a door cut straight into your own house; a tmpfs mount is a whiteboard that is wiped clean the moment you leave the room.',
              keyPoints: [
                'Named volumes are Docker-managed, portable, and best for persistent app data.',
                'Bind mounts map a host path in, great for live-editing source in development.',
                'tmpfs mounts keep data in memory only, never on disk, and vanish on stop.',
                'The --mount syntax states type=volume, type=bind or type=tmpfs explicitly.',
              ],
              code: {
                language: 'bash',
                lines: [
                  '# Named volume for persistent database data',
                  'docker run -d --name db -v pgdata:/var/lib/postgresql/data postgres',
                  '',
                  '# Bind mount host source into the container for development',
                  'docker run -it -v $(pwd):/app node:20 sh',
                ],
                explanation:
                  'The named volume pgdata persists the database across recreations, while the bind mount maps your current directory into /app for live development.',
              },
              commonMistakes: [
                'Using a bind mount in production and coupling the deployment to a specific host path layout.',
                'Expecting tmpfs data to survive a restart — it is in memory and is lost when the container stops.',
              ],
              exercises: [
                {
                  type: 'quiz',
                  prompt: 'Which mount type is recommended for persistent database data, and why?',
                  hint: 'Docker manages it for you.',
                  solution: {
                    explanation:
                      'A named volume, because Docker manages its storage and it is decoupled from the host filesystem layout, making it portable and well-suited to persistent application data.',
                  },
                },
                {
                  type: 'task',
                  prompt: 'Run a redis container that stores its data in a named volume called redisdata mounted at /data.',
                  solution: {
                    lines: ['docker run -d --name cache -v redisdata:/data redis'],
                    explanation:
                      '-v redisdata:/data creates or reuses the named volume redisdata and mounts it at /data inside the container.',
                  },
                },
                {
                  type: 'predict',
                  prompt: 'A container uses a tmpfs mount for a cache. After the container stops and restarts, is the cache still there?',
                  solution: {
                    explanation:
                      'No. tmpfs data lives only in memory and is discarded when the container stops, so the restarted container starts with an empty cache.',
                  },
                },
              ],
              docs: 'https://docs.docker.com/engine/storage/volumes/',
            },
            {
              id: 'dk4-t0-c2',
              title: 'Managing and backing up volumes',
              summary:
                'You create, list, inspect and remove volumes with docker volume commands. Backing up a volume usually means running a throwaway container that mounts it and writes its contents to an archive.',
              explanation:
                'Volumes are first-class objects you manage with the docker volume command family: create makes one, ls lists them, inspect shows details including the on-disk location, and rm deletes one that is no longer in use. Over time unused volumes accumulate, so docker volume prune removes dangling ones to reclaim space — used carefully, since it deletes data. Because a volume is just storage, there is no single backup command; the idiomatic approach is to launch a temporary helper container that mounts both the target volume and a host directory, then tar the volume\'s contents into an archive on the host. Restoring reverses the process, extracting the archive back into a volume. This pattern works for any volume regardless of which application owns it. Treating volumes as managed, backable assets rather than mysterious magic is essential once you run stateful services in production.',
              analogy:
                'Backing up a volume is like hiring a temporary mover who walks into the storage unit, boxes everything up, and carries the box out to your car — the helper container exists only for the duration of the move.',
              keyPoints: [
                'docker volume create, ls, inspect and rm manage volumes as objects.',
                'docker volume prune reclaims space from unused volumes — it deletes data.',
                'Back up by mounting the volume in a temporary container and tarring its contents.',
                'Restore by extracting the archive back into a volume the same way.',
              ],
              code: {
                language: 'bash',
                lines: [
                  '# Back up the pgdata volume to a tar archive on the host',
                  'docker run --rm -v pgdata:/data -v $(pwd):/backup alpine \\',
                  '  tar czf /backup/pgdata-backup.tar.gz -C /data .',
                ],
                explanation:
                  'A throwaway alpine container mounts the volume at /data and the host directory at /backup, then archives the volume contents into the host file.',
              },
              commonMistakes: [
                'Running docker volume prune carelessly and deleting volumes that held important data.',
                'Forgetting that there is no backup of a volume unless you create one yourself.',
              ],
              exercises: [
                {
                  type: 'quiz',
                  prompt: 'Why is there no single docker command to back up a volume\'s data?',
                  hint: 'A volume is just storage.',
                  solution: {
                    explanation:
                      'A volume is generic storage with no knowledge of its contents, so backup is done by mounting it in a helper container and archiving the files yourself, typically with tar.',
                  },
                },
                {
                  type: 'task',
                  prompt: 'List all Docker volumes on the host.',
                  solution: {
                    lines: ['docker volume ls'],
                    explanation:
                      'docker volume ls prints every volume Docker manages, by name and driver.',
                  },
                },
                {
                  type: 'predict',
                  prompt: 'You run docker volume prune on a host where a stopped database container still relies on its volume. What is the risk?',
                  solution: {
                    explanation:
                      'prune removes volumes not currently referenced by any container; if the volume is dangling it will be deleted along with the database data. Always confirm a volume is truly unused before pruning.',
                  },
                },
              ],
              docs: 'https://docs.docker.com/engine/storage/volumes/',
            },
          ],
        },
        {
          id: 'dk4-t1',
          name: 'Networking',
          concepts: [
            {
              id: 'dk4-t1-c0',
              title: 'Network drivers: bridge, host and none',
              summary:
                'Docker provides several network drivers. bridge is the default isolated network on a host, host shares the host\'s network stack directly, and none gives a container no networking at all.',
              explanation:
                'Every container is attached to a network, and the driver determines how it connects. The default bridge driver creates a private virtual network on the host; containers on it get their own IP addresses and can reach the outside world through network address translation, while remaining isolated from the host network. The host driver removes that isolation by letting the container share the host\'s network stack directly, so it uses the host\'s IP and ports with no translation — faster but with no port-level separation, and it bypasses the usual published-port mechanism. The none driver gives a container no network interfaces beyond loopback, useful for completely isolated batch jobs. Most workloads use bridge, host is reserved for performance-sensitive cases that genuinely need the host stack, and none for deliberate isolation. Understanding the drivers clarifies why some containers can be reached one way and not another, and why host mode changes how ports behave.',
              analogy:
                'bridge is like an office on its own internal phone system that reaches outside through a switchboard; host is like plugging a phone straight into the building\'s main line; none is like an office with no phone at all.',
              keyPoints: [
                'bridge is the default: a private network with NAT to the outside, isolated from the host.',
                'host shares the host network stack directly, with no isolation or port mapping.',
                'none gives the container no networking beyond loopback.',
                'Choose by isolation and performance needs; bridge fits most workloads.',
              ],
              diagram: {
                type: 'mermaid',
                lines: [
                  'flowchart TD',
                  '  Host[Host network] --> Bridge[bridge network]',
                  '  Bridge --> C1[Container A]',
                  '  Bridge --> C2[Container B]',
                  '  Host --> HostMode[Container in host mode]',
                ],
                caption: 'Bridge containers sit behind a private network with NAT; a host-mode container shares the host stack directly.',
              },
              exercises: [
                {
                  type: 'quiz',
                  prompt: 'What does the host network driver change compared with the default bridge?',
                  hint: 'Think isolation and port mapping.',
                  solution: {
                    explanation:
                      'host removes network isolation: the container shares the host\'s network stack and IP, uses host ports directly, and bypasses published-port mapping, trading isolation for performance.',
                  },
                },
                {
                  type: 'predict',
                  prompt: 'A container is attached to the none network. Can it make an outbound HTTP request?',
                  solution: {
                    explanation:
                      'No. The none driver provides no external network interfaces beyond loopback, so the container cannot reach the network at all.',
                  },
                },
                {
                  type: 'quiz',
                  prompt: 'Which driver is the default and suits most workloads?',
                  solution: {
                    explanation:
                      'The bridge driver, which gives containers a private isolated network with outbound access via NAT and supports publishing ports to the host.',
                  },
                },
              ],
              docs: 'https://docs.docker.com/engine/network/',
            },
            {
              id: 'dk4-t1-c1',
              title: 'User-defined bridges and DNS',
              summary:
                'Creating your own user-defined bridge network lets containers on it find each other by name through Docker\'s built-in DNS, which the default bridge does not provide.',
              explanation:
                'The default bridge works but has a notable limitation: containers on it can only reach each other by IP address, which is fragile because IPs change. The recommended approach is to create a user-defined bridge network with docker network create and attach your related containers to it. On a user-defined network Docker runs an embedded DNS server, so a container can reach another simply by its container name as a hostname — connect to db rather than to a numeric IP. This automatic service discovery is what makes multi-container applications manageable, and it is exactly how Docker Compose wires services together under the hood. User-defined networks also provide better isolation, since only containers you attach can communicate, and you can create several networks to segment an application into tiers. In short, prefer user-defined bridges over the default bridge whenever containers need to talk to each other.',
              analogy:
                'The default bridge is like a neighbourhood where you must know everyone\'s exact street number. A user-defined network adds a phone book that maps names to addresses, so you just ask for db by name.',
              keyPoints: [
                'On the default bridge, containers can reach each other only by IP.',
                'A user-defined bridge adds embedded DNS so containers resolve each other by name.',
                'Name-based discovery is how Compose connects services automatically.',
                'User-defined networks improve isolation and let you segment app tiers.',
              ],
              code: {
                language: 'bash',
                lines: [
                  '# Create a network and attach two containers to it',
                  'docker network create appnet',
                  'docker run -d --name db --network appnet postgres',
                  'docker run -d --name api --network appnet myapi',
                ],
                explanation:
                  'On appnet the api container can connect to the database simply using the hostname db, resolved by Docker\'s built-in DNS.',
              },
              commonMistakes: [
                'Relying on the default bridge for inter-container communication and hardcoding fragile IP addresses.',
                'Forgetting to attach both containers to the same user-defined network, so name resolution fails.',
              ],
              exercises: [
                {
                  type: 'quiz',
                  prompt: 'What capability does a user-defined bridge add that the default bridge lacks?',
                  hint: 'Think names instead of numbers.',
                  solution: {
                    explanation:
                      'Built-in DNS-based service discovery: containers on a user-defined bridge can reach each other by container name, whereas on the default bridge they must use IP addresses.',
                  },
                },
                {
                  type: 'task',
                  prompt: 'Create a network named backend and run a container named cache on it using the redis image.',
                  solution: {
                    lines: ['docker network create backend', 'docker run -d --name cache --network backend redis'],
                    explanation:
                      'Other containers attached to backend can then reach this one by the hostname cache.',
                  },
                },
                {
                  type: 'predict',
                  prompt: 'Two containers are on the same user-defined network. The app connects to a host named db. What resolves that name?',
                  solution: {
                    explanation:
                      'Docker\'s embedded DNS on the user-defined network resolves db to the IP of the container named db, so the connection reaches it without hardcoded addresses.',
                  },
                },
              ],
              docs: 'https://docs.docker.com/engine/network/drivers/bridge/',
            },
            {
              id: 'dk4-t1-c2',
              title: 'Publishing ports',
              summary:
                'By default a container\'s ports are reachable only within its network. The -p flag publishes a container port to a host port so clients outside Docker can connect.',
              explanation:
                'A service listening inside a container is, by default, only reachable from within its Docker network, not from the host or the outside world. To expose it you publish a port with -p hostPort:containerPort, which tells Docker to forward connections arriving on the host port to the container\'s port. For example -p 8080:80 makes a web server listening on container port 80 reachable at the host\'s port 8080. You can bind to a specific host interface, such as -p 127.0.0.1:8080:80 to expose it only on localhost, which is a useful security control. Remember that EXPOSE in a Dockerfile only documents intent and does not publish anything; actual publishing happens with -p at run time (or the equivalent in Compose). Getting port publishing right is essential for making your services accessible while keeping unwanted exposure to a minimum.',
              analogy:
                'Publishing a port is like installing a mailbox slot in the building\'s front door that drops mail into a specific apartment. Without the slot, the apartment exists but the outside world has no way to deliver to it.',
              keyPoints: [
                'Container ports are reachable only within the Docker network by default.',
                '-p hostPort:containerPort forwards a host port to the container port.',
                'Bind to a specific interface, e.g. 127.0.0.1, to limit exposure.',
                'EXPOSE only documents ports; -p actually publishes them.',
              ],
              code: {
                language: 'bash',
                lines: [
                  '# Make an internal port 80 reachable at host port 8080',
                  'docker run -d -p 8080:80 --name web nginx',
                  '',
                  '# Expose only on localhost for safety',
                  'docker run -d -p 127.0.0.1:5432:5432 --name db postgres',
                ],
                explanation:
                  'The first publishes nginx to all host interfaces on port 8080; the second restricts the database to localhost only.',
              },
              commonMistakes: [
                'Believing EXPOSE alone makes a service reachable from the host — you still need -p.',
                'Publishing a database to all interfaces with -p 5432:5432 and unintentionally exposing it to the network.',
              ],
              exercises: [
                {
                  type: 'quiz',
                  prompt: 'What does -p 8080:80 mean?',
                  hint: 'Which side is the host?',
                  solution: {
                    explanation:
                      'It publishes the container\'s port 80 to the host\'s port 8080, forwarding connections arriving on host 8080 to the service inside the container on port 80.',
                  },
                },
                {
                  type: 'task',
                  prompt: 'Run an nginx container reachable at host port 3000.',
                  solution: {
                    lines: ['docker run -d -p 3000:80 --name web nginx'],
                    explanation:
                      '-p 3000:80 maps host port 3000 to nginx\'s container port 80, making the site available at the host on port 3000.',
                  },
                },
                {
                  type: 'predict',
                  prompt: 'You start a database with no -p flag and try to connect from your host machine\'s tools. What happens?',
                  solution: {
                    explanation:
                      'The connection fails because the database port is not published to the host; it is only reachable from other containers on the same Docker network. You would add -p to expose it.',
                  },
                },
              ],
              docs: 'https://docs.docker.com/engine/network/',
            },
          ],
        },
        {
          id: 'dk4-t2',
          name: 'Registries and distribution',
          concepts: [
            {
              id: 'dk4-t2-c0',
              title: 'Tags and image naming',
              summary:
                'An image reference has the form registry/repository:tag. Tags are mutable labels for versions; a missing tag defaults to latest, which is a common source of confusion.',
              explanation:
                'Every image is identified by a reference that, in full, looks like registry-host/namespace/repository:tag. When the registry host is omitted, Docker Hub is assumed, and when the tag is omitted, Docker assumes latest. Tags are human-friendly, mutable labels — myapp:1.2.0 or myapp:staging — and the same tag can be moved to point at a different image over time, which is exactly why latest is unreliable for reproducibility: it is just a conventional default tag, not a guarantee of the newest or any particular build. Good tagging practice is to use explicit, meaningful version tags, often aligned with your release versioning, so deployments are predictable and rollbacks are possible. You apply or change tags with docker tag, which adds another reference to an existing image without copying it. Understanding the reference format and the mutability of tags prevents a whole category of deployment surprises.',
              analogy:
                'A tag is like a sticky note on a box that says current version. Anyone can peel it off and stick it on a different box, so trusting the note alone is risky — better to label boxes with permanent serial numbers.',
              keyPoints: [
                'Image references are registry/repository:tag; missing registry means Docker Hub.',
                'A missing tag defaults to latest, which is just a conventional default.',
                'Tags are mutable and can be repointed, so latest is not reproducible.',
                'Use explicit version tags; docker tag adds references without copying data.',
              ],
              code: {
                language: 'bash',
                lines: [
                  '# Tag an existing image with a version and a registry path',
                  'docker tag myapp:latest registry.example.com/team/myapp:1.2.0',
                ],
                explanation:
                  'docker tag creates an additional reference to the same image, here adding a registry path and an explicit version tag for pushing.',
              },
              commonMistakes: [
                'Deploying with the latest tag and being unable to tell or reproduce which build is actually running.',
                'Assuming latest always means the newest image — it only means the tag literally named latest.',
              ],
              exercises: [
                {
                  type: 'quiz',
                  prompt: 'Why is the latest tag a poor choice for reproducible deployments?',
                  hint: 'Tags are mutable.',
                  solution: {
                    explanation:
                      'latest is just a conventional, mutable tag that can be repointed to any image at any time, so it does not pin a specific build. Explicit version tags make deployments reproducible.',
                  },
                },
                {
                  type: 'task',
                  prompt: 'Add the tag 2.0.0 to an existing image called myapp:latest.',
                  solution: {
                    lines: ['docker tag myapp:latest myapp:2.0.0'],
                    explanation:
                      'docker tag creates a new reference myapp:2.0.0 pointing at the same image, without duplicating any data.',
                  },
                },
                {
                  type: 'predict',
                  prompt: 'You pull nginx with no tag specified. Which tag do you actually get?',
                  solution: {
                    explanation:
                      'You get nginx:latest, because Docker defaults to the latest tag when none is given.',
                  },
                },
              ],
              docs: 'https://docs.docker.com/get-started/docker-concepts/the-basics/what-is-a-registry/',
            },
            {
              id: 'dk4-t2-c1',
              title: 'Pushing and pulling, and image digests',
              summary:
                'docker push uploads an image to a registry and docker pull downloads it. A digest is an immutable content hash that identifies an exact image, unlike a movable tag.',
              explanation:
                'Distributing an image follows a simple loop: log in to the registry with docker login, push the tagged image with docker push, and on another machine pull it with docker pull. The registry transfers only the layers it does not already have, so pushes and pulls are efficient. Beyond tags, every image also has a digest — a SHA-256 hash of its content — which is immutable: the same digest always refers to the exact same bytes. You can reference an image by digest using the @sha256: form, which guarantees you run precisely the image you intend, regardless of how tags may have moved. This is the gold standard for reproducible and secure deployments, because a digest cannot be silently repointed the way a tag can. In practice teams tag images for humans and pin to digests in deployment manifests for machines, getting both readability and exactness.',
              analogy:
                'A tag is a name like \'the red car\', which someone could reassign; a digest is the car\'s unique VIN that can never refer to a different vehicle. For certainty, you reference the VIN.',
              keyPoints: [
                'docker login, push and pull move images between you and a registry.',
                'Only missing layers are transferred, making transfers efficient.',
                'A digest is an immutable SHA-256 hash of the exact image content.',
                'Reference by @sha256: digest for guaranteed, reproducible image identity.',
              ],
              code: {
                language: 'bash',
                lines: [
                  '# Authenticate, then push a tagged image',
                  'docker login registry.example.com',
                  'docker push registry.example.com/team/myapp:1.2.0',
                  '',
                  '# Pull by immutable digest for an exact, reproducible image',
                  'docker pull myapp@sha256:abc123def456',
                ],
                explanation:
                  'Pushing distributes the tagged image, while pulling by digest pins the deployment to exactly the bytes you tested.',
              },
              commonMistakes: [
                'Forgetting docker login and getting authorization errors when pushing to a private registry.',
                'Trusting a tag in production when a digest would guarantee the exact image actually runs.',
              ],
              exercises: [
                {
                  type: 'quiz',
                  prompt: 'How does referencing an image by digest differ from referencing it by tag?',
                  hint: 'Mutable versus immutable.',
                  solution: {
                    explanation:
                      'A tag is mutable and can be repointed to a different image, while a digest is an immutable content hash that always refers to exactly the same image bytes, guaranteeing reproducibility.',
                  },
                },
                {
                  type: 'task',
                  prompt: 'Push an image tagged myorg/api:1.0 to its registry after logging in to Docker Hub.',
                  solution: {
                    lines: ['docker login', 'docker push myorg/api:1.0'],
                    explanation:
                      'docker login authenticates to Docker Hub, then docker push uploads the tagged image to the myorg/api repository.',
                  },
                },
                {
                  type: 'predict',
                  prompt: 'Why might two pulls of the same tag on different days give you different images, and how does a digest prevent that?',
                  solution: {
                    explanation:
                      'The tag could be repointed to a newer image between pulls, so you get different content. Pulling by digest pins to specific bytes that never change, eliminating the drift.',
                  },
                },
              ],
              docs: 'https://docs.docker.com/reference/cli/docker/image/push/',
            },
            {
              id: 'dk4-t2-c2',
              title: 'Private and self-hosted registries',
              summary:
                'Beyond Docker Hub, organisations use private registries for proprietary images, whether managed services like ECR or a self-hosted registry, controlling access, retention and proximity.',
              explanation:
                'Public registries are great for open images, but companies need private storage for proprietary software, with access control and often compliance requirements. Options range from managed cloud registries such as Amazon ECR, Google Artifact Registry, Azure Container Registry and GitHub Container Registry, to running the open-source registry image yourself for a fully self-hosted solution. Working with a private registry simply means including its host in the image reference and authenticating with docker login before pushing or pulling. Private registries let you enforce who can read and write images, set retention and cleanup policies to manage storage, scan images for vulnerabilities, and place the registry close to your build and deploy infrastructure to speed transfers. For self-hosted registries you are responsible for storage, TLS and authentication. Choosing and configuring the right registry is part of building a reliable, secure delivery pipeline.',
              analogy:
                'Docker Hub is like a public library anyone can browse; a private registry is your company\'s secured archive with badge access, retention rules and a librarian who controls who checks things in and out.',
              keyPoints: [
                'Private registries hold proprietary images with access control.',
                'Options include managed services (ECR, GAR, ACR, GHCR) or self-hosting.',
                'Reference a private registry by including its host and docker login to authenticate.',
                'Private registries add retention policies, scanning and proximity to your infra.',
              ],
              exercises: [
                {
                  type: 'quiz',
                  prompt: 'Why would an organisation use a private registry instead of Docker Hub for its applications?',
                  hint: 'Think proprietary code and control.',
                  solution: {
                    explanation:
                      'To keep proprietary images private, enforce access control, apply retention and scanning policies, meet compliance needs, and keep the registry close to their build and deploy systems.',
                  },
                },
                {
                  type: 'task',
                  prompt: 'Pull an image named app:1.0 from a private registry at registry.example.com after authenticating.',
                  solution: {
                    lines: ['docker login registry.example.com', 'docker pull registry.example.com/app:1.0'],
                    explanation:
                      'Including the registry host in the reference targets the private registry, and docker login provides the required credentials.',
                  },
                },
                {
                  type: 'predict',
                  prompt: 'What extra responsibilities come with self-hosting the open-source registry compared with a managed one?',
                  solution: {
                    explanation:
                      'You must manage the storage backend, TLS certificates, authentication, availability and upgrades yourself, whereas a managed registry handles that infrastructure for you.',
                  },
                },
              ],
              docs: 'https://docs.docker.com/engine/security/certificates/',
            },
          ],
        },
      ],
    },
    /* ───────────────────── LEVEL 5 — COMPOSE AND PRODUCTION ───────────────────── */
    {
      level: 5,
      name: 'Compose and production',
      focus: 'Multi-container apps with Compose, hardening for security, and Docker in CI/CD and orchestration',
      accent: '#2496ed',
      soft: '#e6f4fd',
      topics: [
        {
          id: 'dk5-t0',
          name: 'Docker Compose',
          concepts: [
            {
              id: 'dk5-t0-c0',
              title: 'What Compose is and the compose file',
              summary:
                'Docker Compose defines and runs multi-container applications from a single declarative compose.yaml file, replacing long, error-prone sequences of docker run commands.',
              explanation:
                'Real applications are rarely a single container — a typical app might have a web service, a database and a cache, each needing its own image, ports, volumes and environment. Running and wiring those by hand with many docker run commands is tedious and fragile. Docker Compose lets you describe the whole stack declaratively in a compose.yaml file: you list services, and for each one its image or build context, ports, environment, volumes and networks. Then docker compose up brings the entire application up with one command, creating a dedicated network so the services can reach each other by name, and docker compose down tears it all back down. Compose is now a v2 plugin invoked as docker compose (a space, not a hyphen). It is ideal for local development and for simpler single-host deployments, and the file becomes living documentation of how your application fits together.',
              analogy:
                'If docker run is hand-assembling a band one musician at a time, Compose is the sheet music: one document describes every part and a single downbeat starts the whole ensemble together.',
              keyPoints: [
                'Compose describes a multi-container app declaratively in compose.yaml.',
                'Each service specifies image or build, ports, environment, volumes and networks.',
                'docker compose up starts the whole stack; down tears it down.',
                'Compose v2 is invoked as docker compose with a space, not docker-compose.',
              ],
              code: {
                language: 'yaml',
                lines: [
                  'services:',
                  '  web:',
                  '    build: .',
                  '    ports:',
                  '      - 8080:3000',
                  '    environment:',
                  '      - NODE_ENV=production',
                  '  db:',
                  '    image: postgres:16',
                  '    volumes:',
                  '      - pgdata:/var/lib/postgresql/data',
                  'volumes:',
                  '  pgdata:',
                ],
                explanation:
                  'This compose file defines a web service built from the local Dockerfile plus a Postgres database with a named volume; docker compose up starts both on a shared network.',
              },
              commonMistakes: [
                'Using the old docker-compose (hyphen) v1 syntax and habits instead of the v2 docker compose plugin.',
                'Duplicating configuration across many docker run scripts instead of capturing it once in compose.yaml.',
              ],
              exercises: [
                {
                  type: 'quiz',
                  prompt: 'What problem does Docker Compose solve compared with using docker run directly?',
                  hint: 'Think multiple containers.',
                  solution: {
                    explanation:
                      'It lets you define and run a whole multi-container application declaratively from one file, instead of manually orchestrating many docker run commands and their wiring.',
                  },
                },
                {
                  type: 'task',
                  prompt: 'Start a Compose application in the background from a compose.yaml in the current directory.',
                  solution: {
                    lines: ['docker compose up -d'],
                    explanation:
                      'docker compose up reads compose.yaml and starts all services; -d runs them detached in the background.',
                  },
                },
                {
                  type: 'predict',
                  prompt: 'In a Compose file the web service needs the database. By what hostname can web reach the db service?',
                  solution: {
                    explanation:
                      'By the service name db, because Compose puts services on a shared network with DNS, so they resolve each other by service name automatically.',
                  },
                },
              ],
              docs: 'https://docs.docker.com/compose/',
            },
            {
              id: 'dk5-t0-c1',
              title: 'Services, networks and volumes in Compose',
              summary:
                'A compose file has top-level sections for services, networks and volumes. Services are containers; networks connect them; named volumes persist their data, all wired automatically.',
              explanation:
                'A compose file is organised into top-level keys. The services section is the heart of it, where each entry becomes a container with its image, ports, environment, volumes and dependencies. The volumes section declares named volumes that services can mount, so data such as a database survives recreation. The networks section lets you define custom networks and assign services to them, which is how you segment an application into tiers — for example keeping a database on a backend network not reachable from outside. If you do not define networks explicitly, Compose still creates a default one and attaches all services to it, giving automatic name-based discovery out of the box. This mirrors everything you learned about volumes and user-defined networks, but expresses it declaratively and consistently. Understanding these three sections lets you read and write almost any compose file.',
              analogy:
                'Think of the compose file as a building blueprint: services are the rooms, networks are the hallways connecting them, and volumes are the built-in storage closets that stay put even when you renovate a room.',
              keyPoints: [
                'services defines each container and its configuration.',
                'volumes declares named volumes for persistent data across recreations.',
                'networks defines custom networks to segment services into tiers.',
                'Without explicit networks, Compose creates a default one with DNS discovery.',
              ],
              code: {
                language: 'yaml',
                lines: [
                  'services:',
                  '  api:',
                  '    image: myapi:1.0',
                  '    networks:',
                  '      - frontend',
                  '      - backend',
                  '  db:',
                  '    image: postgres:16',
                  '    networks:',
                  '      - backend',
                  '    volumes:',
                  '      - dbdata:/var/lib/postgresql/data',
                  'networks:',
                  '  frontend:',
                  '  backend:',
                  'volumes:',
                  '  dbdata:',
                ],
                explanation:
                  'The db is only on the backend network so it is not exposed to the frontend tier, and dbdata persists its data across recreations.',
              },
              exercises: [
                {
                  type: 'quiz',
                  prompt: 'What are the three main top-level sections of a compose file and what does each do?',
                  hint: 'Containers, connectivity, persistence.',
                  solution: {
                    explanation:
                      'services define the containers, networks connect and segment them, and volumes provide persistent named storage that survives container recreation.',
                  },
                },
                {
                  type: 'predict',
                  prompt: 'In the example, can a service on only the frontend network reach the db? Why or why not?',
                  solution: {
                    explanation:
                      'No. The db is attached only to the backend network, so a service that is not on backend cannot reach it, which is how Compose enforces tier isolation.',
                  },
                },
                {
                  type: 'quiz',
                  prompt: 'If you define no networks at all, can your services still talk to each other by name?',
                  solution: {
                    explanation:
                      'Yes. Compose creates a default network and attaches all services to it, providing automatic DNS-based name resolution between them.',
                  },
                },
              ],
              docs: 'https://docs.docker.com/reference/compose-file/',
            },
            {
              id: 'dk5-t0-c2',
              title: 'depends_on, healthchecks and profiles',
              summary:
                'depends_on controls startup order, combining with healthchecks to wait until a dependency is truly ready, while profiles let you include or exclude groups of services per scenario.',
              explanation:
                'Compose offers controls for orchestrating how services come up. depends_on sets startup order so, for example, the database starts before the API, but by itself it only waits for the container to start, not for the app inside to be ready. To wait for actual readiness you combine depends_on with a condition of service_healthy plus a healthcheck on the dependency, so the API does not start until the database reports healthy. This avoids the classic race where an app crashes because it connected before its database finished initialising. Profiles solve a different problem: they let you tag services so they only start under named profiles, which is perfect for optional components like a debugging tool, a seed job, or services you want only in development. You activate a profile with --profile or an environment setting. Together these features make a single compose file flexibly serve multiple scenarios while starting things up in the right order.',
              analogy:
                'depends_on with a healthcheck is like a relay race where a runner only starts once the previous one has actually passed the baton, not merely left the blocks. Profiles are like optional add-ons you switch on only when a particular event calls for them.',
              keyPoints: [
                'depends_on sets startup order but waits only for the container to start by default.',
                'Add condition service_healthy plus a healthcheck to wait for real readiness.',
                'This prevents races where an app connects before its dependency is ready.',
                'Profiles include or exclude groups of services per scenario, activated on demand.',
              ],
              code: {
                language: 'yaml',
                lines: [
                  'services:',
                  '  db:',
                  '    image: postgres:16',
                  '    healthcheck:',
                  '      test: ["CMD-SHELL", "pg_isready -U postgres"]',
                  '      interval: 5s',
                  '      retries: 5',
                  '  api:',
                  '    image: myapi:1.0',
                  '    depends_on:',
                  '      db:',
                  '        condition: service_healthy',
                  '  seed:',
                  '    image: myseed:1.0',
                  '    profiles: ["tools"]',
                ],
                explanation:
                  'The api waits until db reports healthy before starting, and the seed service runs only when the tools profile is activated.',
              },
              commonMistakes: [
                'Using plain depends_on and assuming the dependency is fully ready when it has only started.',
                'Forgetting to activate a profile and being confused that a profiled service never starts.',
              ],
              exercises: [
                {
                  type: 'quiz',
                  prompt: 'Why is depends_on alone often not enough to prevent startup race conditions?',
                  hint: 'Started versus ready.',
                  solution: {
                    explanation:
                      'depends_on by default waits only for the dependency container to start, not for the application inside to be ready to accept connections. Combine it with a healthcheck and condition service_healthy to wait for real readiness.',
                  },
                },
                {
                  type: 'task',
                  prompt: 'Start a Compose app activating the profile named tools.',
                  solution: {
                    lines: ['docker compose --profile tools up'],
                    explanation:
                      'The --profile flag activates services tagged with that profile in addition to the always-on services.',
                  },
                },
                {
                  type: 'predict',
                  prompt: 'A service has profiles set to debug and you run docker compose up without any profile. Does it start?',
                  solution: {
                    explanation:
                      'No. A service assigned to a profile only starts when that profile is activated, so it stays off during a plain docker compose up.',
                  },
                },
              ],
              docs: 'https://docs.docker.com/compose/how-tos/startup-order/',
            },
          ],
        },
        {
          id: 'dk5-t1',
          name: 'Security',
          concepts: [
            {
              id: 'dk5-t1-c0',
              title: 'Run as a non-root user',
              summary:
                'By default containers run as root, which is risky if the container is compromised. Adding a USER instruction to run as an unprivileged user is one of the highest-impact hardening steps.',
              explanation:
                'Unless told otherwise, the process inside a container runs as root, and although container isolation limits what that means, root inside a container is still more dangerous than it needs to be — a vulnerability in the app or a container escape is far worse with root privileges. The fix is to create or use an unprivileged user in your Dockerfile and switch to it with the USER instruction before the application runs, so the process operates with the least privilege it needs. Many official images already provide a suitable non-root user. You must ensure the application\'s files and any writable directories are owned appropriately so the non-root user can read and write what it needs. Running as non-root follows the principle of least privilege and is one of the simplest, most effective container security improvements you can make. Combined with dropping Linux capabilities and a read-only filesystem, it dramatically shrinks the blast radius of a compromise.',
              analogy:
                'Running as root is like giving every employee a master key to the whole building. Running as a non-root user is giving them a key only to the rooms they actually need, so a lost key does far less damage.',
              keyPoints: [
                'Containers run as root by default, which is unnecessarily risky.',
                'Use the USER instruction to run the app as an unprivileged user.',
                'Ensure app files and writable paths are owned by that user.',
                'Non-root follows least privilege and shrinks the impact of a compromise.',
              ],
              code: {
                language: 'dockerfile',
                lines: [
                  'RUN addgroup --system app && adduser --system --ingroup app app',
                  'WORKDIR /app',
                  'COPY --chown=app:app . .',
                  'USER app',
                  'CMD ["node", "server.js"]',
                ],
                explanation:
                  'A dedicated app user is created and owns the files, and USER app ensures the application runs unprivileged rather than as root.',
              },
              commonMistakes: [
                'Leaving the default root user, so a compromised app has root inside the container.',
                'Switching to a non-root user without fixing file ownership, causing permission-denied errors at run time.',
              ],
              exercises: [
                {
                  type: 'quiz',
                  prompt: 'Why is running a container as root considered a security risk?',
                  hint: 'Think about what happens if the app is compromised.',
                  solution: {
                    explanation:
                      'If the application is exploited or a container escape occurs, root privileges make the damage far worse. Running as an unprivileged user follows least privilege and limits the blast radius.',
                  },
                },
                {
                  type: 'task',
                  prompt: 'Add Dockerfile lines that create a non-root user named app and switch to it.',
                  solution: {
                    lines: ['RUN adduser --system app', 'USER app'],
                    explanation:
                      'Creating a system user and then USER app ensures the container process runs unprivileged.',
                  },
                },
                {
                  type: 'predict',
                  prompt: 'You add USER app but the app crashes trying to write to /app. What is the likely cause and fix?',
                  solution: {
                    explanation:
                      'The app user probably does not own the directory it writes to. Fix the ownership, for example with COPY --chown or a chown in a RUN step, so the non-root user can write there.',
                  },
                },
              ],
              docs: 'https://docs.docker.com/build/building/best-practices/',
            },
            {
              id: 'dk5-t1-c1',
              title: 'Least privilege: capabilities and read-only filesystem',
              summary:
                'Beyond non-root, you can drop Linux capabilities, prevent privilege escalation, and run with a read-only root filesystem so a compromised container can do as little as possible.',
              explanation:
                'Hardening a container is about removing everything it does not need. Linux capabilities split root\'s powers into fine-grained pieces, and Docker grants a default subset; with --cap-drop you can remove capabilities, ideally dropping all and adding back only what is essential with --cap-add. The --security-opt no-new-privileges flag stops a process from gaining more privileges than it started with, neutralising certain escalation tricks. Running with --read-only makes the container\'s root filesystem immutable, so an attacker cannot modify binaries or drop files; for the few paths that genuinely need to be writable, you mount a tmpfs or a volume just there. You should also avoid the --privileged flag, which disables most isolation and is rarely justified. Layering these controls — non-root user, dropped capabilities, no new privileges, and a read-only filesystem — embodies defence in depth, so even if one barrier fails the attacker is still tightly constrained.',
              analogy:
                'It is like securing a bank vault: not just locking the door (non-root) but also removing tools an intruder could use (drop capabilities), welding the shelves in place (read-only filesystem), and ensuring no one can pick up extra keys once inside (no new privileges).',
              keyPoints: [
                '--cap-drop removes Linux capabilities; drop all and add back only what is needed.',
                '--security-opt no-new-privileges blocks privilege escalation.',
                '--read-only makes the root filesystem immutable, with tmpfs or volumes for writable paths.',
                'Avoid --privileged, which disables most isolation; combine controls for defence in depth.',
              ],
              code: {
                language: 'bash',
                lines: [
                  'docker run -d \\',
                  '  --read-only \\',
                  '  --cap-drop ALL \\',
                  '  --security-opt no-new-privileges \\',
                  '  --tmpfs /tmp \\',
                  '  myapp',
                ],
                explanation:
                  'This run drops all capabilities, forbids privilege escalation, and makes the filesystem read-only except for an in-memory /tmp the app can use.',
              },
              commonMistakes: [
                'Using --privileged as a quick fix, which removes most of the isolation that makes containers safe.',
                'Adding --read-only without providing a writable tmpfs or volume for paths the app legitimately writes to.',
              ],
              exercises: [
                {
                  type: 'quiz',
                  prompt: 'What does running a container with --read-only achieve, and how do you handle paths that must be writable?',
                  hint: 'Immutable filesystem plus an exception mechanism.',
                  solution: {
                    explanation:
                      'It makes the root filesystem immutable so an attacker cannot alter binaries or drop files. For genuinely writable paths you mount a tmpfs or a volume at just those locations.',
                  },
                },
                {
                  type: 'predict',
                  prompt: 'Why is using --privileged generally discouraged for application containers?',
                  solution: {
                    explanation:
                      'It disables most of the security isolation, granting the container near-full access to the host, which makes a compromise extremely dangerous. It is rarely needed for normal apps.',
                  },
                },
                {
                  type: 'task',
                  prompt: 'Run myapp dropping all Linux capabilities and forbidding privilege escalation.',
                  solution: {
                    lines: ['docker run -d --cap-drop ALL --security-opt no-new-privileges myapp'],
                    explanation:
                      '--cap-drop ALL removes all capabilities and no-new-privileges prevents the process from gaining more, tightly constraining it.',
                  },
                },
              ],
              docs: 'https://docs.docker.com/engine/containers/run/',
            },
            {
              id: 'dk5-t1-c2',
              title: 'Image scanning, SBOMs and supply-chain security',
              summary:
                'Images can contain vulnerable packages, so scan them for known CVEs, generate a software bill of materials to know what is inside, and verify provenance to protect the supply chain.',
              explanation:
                'An image is only as secure as everything inside it, including the base image and all transitive dependencies, which may carry known vulnerabilities. Image scanning tools, such as docker scout or third-party scanners, compare the packages in an image against vulnerability databases and report CVEs by severity so you can patch or rebuild. A software bill of materials, or SBOM, is a machine-readable inventory of every component in an image, which is increasingly required for compliance and makes it possible to answer quickly whether you are affected when a new vulnerability is announced. Supply-chain security goes further: pinning base images by digest, building from trusted sources, and signing images so consumers can verify they have not been tampered with and came from you. Integrating scanning into your build pipeline, failing builds on high-severity findings, and keeping base images updated turns security from an afterthought into a continuous, automated practice.',
              analogy:
                'An SBOM is the ingredient list on a food package and scanning is the safety inspection checking those ingredients against recall notices. Signing is the tamper-evident seal proving no one opened the package between factory and shelf.',
              keyPoints: [
                'Scanning compares image packages against vulnerability databases and reports CVEs.',
                'An SBOM is a machine-readable inventory of everything inside the image.',
                'Pin base images by digest and rebuild regularly to absorb security fixes.',
                'Sign images and verify provenance to defend the software supply chain.',
              ],
              code: {
                language: 'bash',
                lines: [
                  '# Scan an image for known vulnerabilities',
                  'docker scout cves myapp:1.0',
                  '',
                  '# Generate a software bill of materials',
                  'docker scout sbom myapp:1.0',
                ],
                explanation:
                  'docker scout reports known CVEs in the image and can emit an SBOM listing every component, both useful gates in a pipeline.',
              },
              commonMistakes: [
                'Treating a passing build as secure while never scanning images for known vulnerabilities.',
                'Never rebuilding, so a once-clean image slowly accumulates newly disclosed vulnerabilities in its base.',
              ],
              exercises: [
                {
                  type: 'quiz',
                  prompt: 'What is an SBOM and why is it valuable for security?',
                  hint: 'An inventory of contents.',
                  solution: {
                    explanation:
                      'A software bill of materials is a machine-readable list of every component in an image. It lets you quickly determine whether you are affected when a new vulnerability is disclosed and supports compliance.',
                  },
                },
                {
                  type: 'predict',
                  prompt: 'An image scanned clean six months ago has not been rebuilt since. Is it still guaranteed free of known vulnerabilities?',
                  solution: {
                    explanation:
                      'No. New vulnerabilities are disclosed over time against packages already in the image, so a previously clean image can become vulnerable. Regular rescanning and rebuilding are needed.',
                  },
                },
                {
                  type: 'quiz',
                  prompt: 'Name two supply-chain practices beyond scanning that help ensure you run the image you intend.',
                  solution: {
                    explanation:
                      'Pinning base and deployed images by immutable digest, and signing images so consumers can verify provenance and detect tampering.',
                  },
                },
              ],
              docs: 'https://docs.docker.com/scout/',
            },
          ],
        },
        {
          id: 'dk5-t2',
          name: 'CI/CD and orchestration',
          concepts: [
            {
              id: 'dk5-t2-c0',
              title: 'Building and tagging images in CI/CD',
              summary:
                'A CI/CD pipeline builds the image once, tags it meaningfully, pushes it to a registry, and promotes that exact image through environments rather than rebuilding at each stage.',
              explanation:
                'Containers shine in continuous delivery because the artifact you test is the exact artifact you ship. A solid pipeline builds the image once on a commit, runs tests against it, then pushes it to a registry with informative tags. A common tagging strategy is to tag with the commit SHA for an immutable, traceable reference, plus a moving tag like a branch name or a semantic version for human convenience; the immutable tag or digest is what you promote between staging and production so you never rebuild and risk drift. Build performance matters in CI, where caches are cold by default, so pipelines use registry-based cache import and export or BuildKit cache backends to reuse layers across runs. Building images in CI also centralises security gates like scanning and SBOM generation. The key principle is build once, promote the same image, which gives reproducibility and fast, confident rollbacks by simply redeploying a previous tag or digest.',
              analogy:
                'It is like printing one master copy of a document, getting it approved, and photocopying that same approved master for every office, rather than re-typing it at each location and hoping every copy matches.',
              keyPoints: [
                'Build the image once, test it, then push it to a registry.',
                'Tag with an immutable commit SHA plus a human-friendly tag.',
                'Promote the same image (by tag or digest) across environments, never rebuild.',
                'Use registry or BuildKit cache to speed up cold CI builds.',
              ],
              code: {
                language: 'yaml',
                lines: [
                  '# Sketch of a CI job building and pushing an image',
                  'steps:',
                  '  - run: docker build -t myorg/app:$GIT_SHA -t myorg/app:latest .',
                  '  - run: docker push myorg/app:$GIT_SHA',
                  '  - run: docker push myorg/app:latest',
                ],
                explanation:
                  'The build tags the image with both the immutable commit SHA and a moving latest tag, then pushes both so the SHA can be promoted reliably.',
              },
              commonMistakes: [
                'Rebuilding the image separately for each environment, risking subtle drift between what was tested and what ships.',
                'Promoting only by a mutable tag like latest, losing traceability of exactly which build is deployed.',
              ],
              exercises: [
                {
                  type: 'quiz',
                  prompt: 'Why should a pipeline build an image once and promote that same image rather than rebuilding per environment?',
                  hint: 'Reproducibility and drift.',
                  solution: {
                    explanation:
                      'Rebuilding can produce subtly different images due to changed dependencies or context, so the thing you ship may differ from what you tested. Promoting one immutable image guarantees you deploy exactly what passed the pipeline.',
                  },
                },
                {
                  type: 'task',
                  prompt: 'Build an image tagged with the commit SHA stored in the variable GIT_SHA for the repo myorg/app.',
                  solution: {
                    lines: ['docker build -t myorg/app:$GIT_SHA .'],
                    explanation:
                      'Tagging with the commit SHA gives an immutable, traceable reference tying the image to the exact source it was built from.',
                  },
                },
                {
                  type: 'predict',
                  prompt: 'Why are CI builds often slower than local ones, and what helps?',
                  solution: {
                    explanation:
                      'CI runners usually start with a cold cache, so layers are rebuilt from scratch. Importing and exporting a build cache to a registry or using a BuildKit cache backend lets runs reuse layers and speed up.',
                  },
                },
              ],
              docs: 'https://docs.docker.com/build/ci/',
            },
            {
              id: 'dk5-t2-c1',
              title: 'Beyond a single host: why orchestration',
              summary:
                'Running containers on one machine has limits. Orchestrators schedule containers across many hosts and add self-healing, scaling, rolling updates and service discovery at scale.',
              explanation:
                'Docker on a single host is excellent for development and small deployments, but production at scale needs more: spreading workloads across many machines, restarting failed containers automatically, scaling services up and down with demand, rolling out new versions without downtime, and balancing traffic across replicas. These are the jobs of a container orchestrator. You declare the desired state — say, five replicas of a service — and the orchestrator continuously works to make reality match, rescheduling containers when a host dies and updating them gradually. Orchestration also handles cross-host networking and service discovery so containers on different machines can find each other. Without it, you would have to script all of this fragile coordination yourself. Recognising when you have outgrown single-host Docker, and what an orchestrator provides, is the bridge from learning Docker to running real production systems.',
              analogy:
                'A single host is one chef cooking alone; an orchestrator is the head chef coordinating a whole kitchen brigade, reassigning tasks when someone steps away and scaling stations up when orders surge.',
              keyPoints: [
                'Single-host Docker cannot span machines, self-heal across hosts, or auto-scale.',
                'Orchestrators schedule containers across a cluster of hosts.',
                'You declare desired state; the orchestrator reconciles reality to match.',
                'They add rolling updates, load balancing and cross-host service discovery.',
              ],
              diagram: {
                type: 'mermaid',
                lines: [
                  'flowchart TD',
                  '  Orch[Orchestrator] --> N1[Node 1]',
                  '  Orch --> N2[Node 2]',
                  '  Orch --> N3[Node 3]',
                  '  N1 --> C1[Container]',
                  '  N2 --> C2[Container]',
                  '  N3 --> C3[Container]',
                ],
                caption: 'An orchestrator schedules and supervises containers across many nodes to meet a declared desired state.',
              },
              exercises: [
                {
                  type: 'quiz',
                  prompt: 'Name two things an orchestrator does that single-host Docker cannot.',
                  hint: 'Think across machines and self-healing.',
                  solution: {
                    explanation:
                      'It schedules containers across many hosts and reschedules them when a host fails, and it provides auto-scaling, rolling updates and cross-host service discovery — none of which single-host Docker offers.',
                  },
                },
                {
                  type: 'predict',
                  prompt: 'You declare a service should run five replicas and one host crashes, taking two replicas down. What does an orchestrator do?',
                  solution: {
                    explanation:
                      'It notices reality (three running) no longer matches the desired state (five) and schedules two new replicas on healthy nodes to restore the count automatically.',
                  },
                },
                {
                  type: 'quiz',
                  prompt: 'What is meant by declarative desired state in orchestration?',
                  solution: {
                    explanation:
                      'You describe the end result you want, such as five replicas of a service, rather than the steps to get there, and the orchestrator continuously reconciles the actual state to match that declaration.',
                  },
                },
              ],
              docs: 'https://docs.docker.com/get-started/docker-concepts/the-basics/what-is-docker/',
            },
            {
              id: 'dk5-t2-c2',
              title: 'Docker Swarm and Kubernetes as next steps',
              summary:
                'Docker Swarm is a simple orchestrator built into Docker, ideal for small clusters, while Kubernetes is the powerful, complex industry standard for large-scale, portable orchestration.',
              explanation:
                'There are two orchestrators you are most likely to meet. Docker Swarm is built into the Docker engine and is the gentle on-ramp: you initialise a swarm, join nodes, and deploy a stack using a familiar Compose-style file, getting replicas, rolling updates and an internal load balancer with minimal new concepts. It is well suited to smaller deployments and teams that want orchestration without a steep learning curve. Kubernetes is the dominant industry standard: far more powerful and extensible, with rich primitives for deployments, services, configuration, storage, autoscaling and more, plus a huge ecosystem. That power comes with significant complexity and operational overhead, which is why managed Kubernetes services exist. Because your images are OCI-compliant, the same image runs on either, so the orchestrator is a deployment choice layered on top of the Docker skills you have built. A sensible path is to be fluent in Docker and Compose first, try Swarm to grasp orchestration concepts, then learn Kubernetes when scale or organisational standards require it.',
              analogy:
                'Swarm is like an automatic car — easy to drive and great for everyday trips. Kubernetes is like a fully configurable race car — vastly more capable, but you need real training to handle everything it offers.',
              keyPoints: [
                'Swarm is built into Docker and uses a Compose-style stack file; easy for small clusters.',
                'Kubernetes is the powerful, extensible industry standard, with more complexity.',
                'OCI images run on either, so the orchestrator is a layer above your Docker skills.',
                'Suggested path: master Docker and Compose, then Swarm, then Kubernetes as needed.',
              ],
              code: {
                language: 'bash',
                lines: [
                  '# Initialise a swarm and deploy a Compose-style stack',
                  'docker swarm init',
                  'docker stack deploy -c compose.yaml myapp',
                ],
                explanation:
                  'Swarm reuses Compose-style files via docker stack deploy, making it a low-friction first orchestrator built right into Docker.',
              },
              commonMistakes: [
                'Reaching for Kubernetes for a tiny deployment where its complexity far outweighs the benefit.',
                'Assuming switching orchestrators requires rebuilding images — the same OCI image runs on both.',
              ],
              exercises: [
                {
                  type: 'quiz',
                  prompt: 'What is the main trade-off between Docker Swarm and Kubernetes?',
                  hint: 'Simplicity versus power.',
                  solution: {
                    explanation:
                      'Swarm is simple and built into Docker, ideal for smaller clusters with a gentle learning curve, while Kubernetes is far more powerful and extensible but significantly more complex to operate.',
                  },
                },
                {
                  type: 'task',
                  prompt: 'Initialise a Docker Swarm on the current machine.',
                  solution: {
                    lines: ['docker swarm init'],
                    explanation:
                      'docker swarm init turns the current Docker engine into a swarm manager, after which other nodes can join and stacks can be deployed.',
                  },
                },
                {
                  type: 'predict',
                  prompt: 'You built an image for single-host Docker and now want to run it on Kubernetes. Do you need to rebuild it?',
                  solution: {
                    explanation:
                      'No. The image is OCI-compliant, so the same image runs on Kubernetes, Swarm or plain Docker; only the deployment configuration changes.',
                  },
                },
              ],
              docs: 'https://docs.docker.com/engine/swarm/',
            },
          ],
        },
      ],
    },
  ],
};

export default content;
