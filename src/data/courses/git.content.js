// Git and GitHub — course content. Original explanations written for self-study; same schema as the other courses.
const content = {
  meta: {
    title: 'Git and GitHub: Version Control for Professionals',
    description:
      'A complete, hands-on path through Git and GitHub: from why version control exists and the three areas, through branching, merging, rebasing and remotes, to fixing history, tags and releases, and advanced professional workflows. Every concept comes with real commands, diagrams, common mistakes and exercises.',
    schemaVersion: '1.0',
    status: 'complete',
  },
  levels: [
    /* ───────────────────── LEVEL 1 — FUNDAMENTALS ───────────────────── */
    {
      level: 1,
      name: 'Fundamentals',
      focus: 'What version control is, how Git stores your work, and the everyday commit cycle',
      accent: '#f05133',
      soft: '#fdeae6',
      topics: [
        {
          id: 'gt1-t0',
          name: 'Why version control',
          concepts: [
            {
              id: 'gt1-t0-c0',
              title: 'What a version control system is and why it matters',
              summary:
                'A version control system (VCS) records changes to files over time so you can recall any earlier version, see who changed what, and work in parallel without overwriting each other.',
              explanation:
                'Without version control, teams resort to copying folders named final, final2 and final-REALLY-final, emailing zip files, and losing work when two people edit the same file. A VCS solves all of that by keeping a complete, timestamped history of every change, attributing each one to an author with a message explaining why. Because the history is structured, you can compare any two versions, jump back to a known-good state after a mistake, and merge contributions from many people. Git is the dominant VCS today because it is fast, free, and works offline. Crucially, version control is not just for code — any text-based project (configuration, documentation, infrastructure definitions) benefits from a reliable timeline of who changed what and when.',
              analogy:
                'A VCS is like the unlimited undo history of a video game with named save points: you can reload any earlier save, branch off to try a risky path, and never lose your progress.',
              keyPoints: [
                'A VCS records every change with an author, timestamp and message.',
                'It lets you recover any earlier version and see exactly what changed.',
                'It enables many people to work in parallel and merge their work.',
                'Git is the de facto standard: fast, free, open source and works offline.',
              ],
              exercises: [
                {
                  type: 'quiz',
                  prompt: 'Name two concrete problems a version control system solves that manual file-copying does not.',
                  hint: 'Think about history and about teamwork.',
                  solution: {
                    explanation:
                      'It keeps a complete, attributed history so you can recover any earlier version and see who changed what; and it lets multiple people edit in parallel and merge their changes instead of overwriting each other.',
                  },
                },
                {
                  type: 'quiz',
                  prompt: 'True or false: version control is only useful for source code.',
                  solution: {
                    explanation:
                      'False. Any text-based project — docs, configuration, infrastructure-as-code — benefits from a tracked history of changes.',
                  },
                },
              ],
              docs: 'https://git-scm.com/book/en/v2/Getting-Started-About-Version-Control',
            },
            {
              id: 'gt1-t0-c1',
              title: 'Centralized vs distributed version control',
              summary:
                'Older systems kept the one true history on a central server; Git is distributed — every clone is a full copy of the entire history.',
              explanation:
                'In a centralized VCS such as Subversion (SVN), there is a single server that holds the complete history, and clients check out only a working snapshot. That model is simple but fragile: if the server is down you cannot commit or view history, and if its disk fails you can lose everything. Git is distributed: when you clone a repository you receive the full history, not just the latest snapshot. This means you can commit, branch, diff and view the entire log offline, and any clone can serve as a backup or become the new authority. There is no technical central server in Git — teams simply agree by convention that one remote (often on GitHub) is the shared point of truth. The trade-off is that distributed history is more powerful but conceptually heavier to learn.',
              analogy:
                'Centralized VCS is a single library where you must visit the front desk for every book. Distributed VCS gives everyone a complete copy of the whole library at home; one copy is just agreed to be the official one.',
              keyPoints: [
                'Centralized (e.g. SVN): one server owns the history; clients hold only a snapshot.',
                'Distributed (Git): every clone contains the full history.',
                'You can commit, branch and view history offline with Git.',
                'There is no built-in central server — a shared remote is a team convention.',
              ],
              diagram: {
                type: 'mermaid',
                lines: [
                  'flowchart LR',
                  '  subgraph Distributed',
                  '    O[Origin remote] --- A[Clone A full history]',
                  '    O --- B[Clone B full history]',
                  '    O --- C[Clone C full history]',
                  '  end',
                ],
                caption: 'In Git every clone holds the full history; one remote is the agreed shared point of truth.',
              },
              exercises: [
                {
                  type: 'quiz',
                  prompt: 'Why can you keep committing to a Git repository while your internet connection is down?',
                  hint: 'What does a clone actually contain?',
                  solution: {
                    explanation:
                      'A clone contains the entire repository history locally, so committing, branching and viewing the log are all local operations. You only need the network to share with a remote.',
                  },
                },
                {
                  type: 'quiz',
                  prompt: 'In Git, what makes one remote the central authority?',
                  solution: {
                    explanation:
                      'Nothing technical — it is a team convention. Any clone is technically a full repository; teams simply agree that a particular remote (often called origin) is the shared source of truth.',
                  },
                },
              ],
              docs: 'https://git-scm.com/book/en/v2/Getting-Started-What-is-Git%3F',
            },
            {
              id: 'gt1-t0-c2',
              title: 'Snapshots, not differences',
              summary:
                'Many VCSs store a list of file-by-file changes; Git instead stores a snapshot of all your files at each commit, which makes branching and switching fast.',
              explanation:
                'Conceptually, every time you commit, Git takes a picture of what all your tracked files look like at that moment and stores a reference to that snapshot. If a file has not changed since the previous commit, Git does not store it again — it just links to the identical content it already has, identified by a hash of the content. This content-addressable design is why Git is so fast and so reliable: identical content is stored once, and the hash guarantees integrity because any corruption changes the hash. It is true that Git can compute and show diffs between snapshots when you ask, but internally it thinks in snapshots, not in stored deltas. Understanding this is the key mental model for why creating a branch or switching between commits is nearly instant.',
              analogy:
                'A diff-based VCS keeps a stack of edit instructions you must replay. Git keeps a photo album: each commit is a full photo, but unchanged photos are reused rather than reprinted.',
              keyPoints: [
                'Each commit is a snapshot of all tracked files at that moment.',
                'Unchanged files are not duplicated — Git links to the existing content.',
                'Content is identified by a SHA hash, which also guarantees integrity.',
                'Git computes diffs on demand but stores snapshots, making branching fast.',
              ],
              exercises: [
                {
                  type: 'quiz',
                  prompt: 'If a commit changes only one file out of a hundred, how much file content does Git store for the unchanged files?',
                  hint: 'Think about reuse by content hash.',
                  solution: {
                    explanation:
                      'None of the unchanged content is re-stored. Git references the existing identical content by its hash, so only the changed file produces new stored content.',
                  },
                },
                {
                  type: 'quiz',
                  prompt: 'How does content-addressing (hashing) help guarantee your history has not been silently corrupted?',
                  solution: {
                    explanation:
                      'Every object is named by a hash of its content. If even one byte changes, the hash changes, so corruption cannot go unnoticed — Git would detect the mismatch.',
                  },
                },
              ],
              docs: 'https://git-scm.com/book/en/v2/Getting-Started-What-is-Git%3F',
            },
            {
              id: 'gt1-t0-c3',
              title: 'The .git folder',
              summary:
                'Everything that makes a directory a Git repository lives in the hidden .git folder: the object database, refs, HEAD and configuration.',
              explanation:
                'When you run git init, Git creates a single hidden subdirectory named .git at the root of your project. That folder is the repository — your actual files are just a working copy. Inside it Git keeps the object database (all your snapshots, commits and file contents addressed by hash), the refs (pointers such as branches and tags), the HEAD file (which records the branch or commit you currently have checked out), the staging area or index, and configuration and hooks. If you delete .git, the directory becomes ordinary files with no history; if you copy .git elsewhere with the files, you copy the whole repository. You almost never edit anything in .git by hand — Git commands manage it for you — but knowing it exists demystifies what Git is actually doing.',
              analogy:
                'The .git folder is the engine and the flight recorder of your project; the files you see in the folder are just the car body. Remove the engine and you are left with a shell that does not remember anything.',
              keyPoints: [
                'git init creates the hidden .git folder, which IS the repository.',
                'It holds the object database (snapshots), refs (branches/tags), HEAD and the index.',
                'Deleting .git removes all history and leaves plain files.',
                'You manage it through Git commands, not by editing it by hand.',
              ],
              diagram: {
                type: 'mermaid',
                lines: [
                  'flowchart TD',
                  '  G[.git folder] --> OBJ[objects - snapshots and content]',
                  '  G --> REF[refs - branches and tags]',
                  '  G --> HEAD[HEAD - current checkout]',
                  '  G --> IDX[index - staging area]',
                ],
                caption: 'The .git folder contains the object database, refs, HEAD and the staging index.',
              },
              exercises: [
                {
                  type: 'predict',
                  prompt: 'You copy a project folder to a USB stick but accidentally exclude hidden files, so .git is left behind. What does the copy contain?',
                  solution: {
                    explanation:
                      'Only the plain working files with no history at all — no commits, branches or log. Without .git it is not a Git repository.',
                  },
                },
                {
                  type: 'quiz',
                  prompt: 'Which file inside .git records which branch or commit you currently have checked out?',
                  solution: { explanation: 'The HEAD file. It points at the current branch (or directly at a commit in detached HEAD state).' },
                },
              ],
              docs: 'https://git-scm.com/book/en/v2/Git-Internals-Plumbing-and-Porcelain',
            },
          ],
        },
        {
          id: 'gt1-t1',
          name: 'Getting started',
          concepts: [
            {
              id: 'gt1-t1-c0',
              title: 'Installing and configuring Git',
              summary:
                'After installing Git you set your identity once with git config so every commit is correctly attributed.',
              explanation:
                'Git is available for Windows, macOS and Linux from git-scm.com, and most package managers can install it. The first thing to do after installing is to tell Git who you are, because every commit records an author name and email. You set these globally — once per machine — with git config --global user.name and user.email; the values appear in your commit history and, on GitHub, link commits to your account. The --global flag writes to your per-user config file; omitting it writes to the current repository only, which is handy when one project needs a different email. You can inspect any setting with git config --get and list everything with git config --list. Modern Git also lets you set the default branch name for new repositories, commonly main.',
              keyPoints: [
                'Set identity once: user.name and user.email, used on every commit.',
                '--global writes per-user config; no flag writes per-repository config.',
                'On GitHub, the commit email links commits to your account.',
                'git config --list shows the effective configuration.',
              ],
              code: {
                language: 'bash',
                lines: [
                  'git config --global user.name \'Ada Lovelace\'',
                  'git config --global user.email \'ada@example.com\'',
                  'git config --global init.defaultBranch main',
                  'git config --list',
                ],
                explanation: 'Set your identity and default branch name globally, then list the effective configuration to confirm.',
              },
              commonMistakes: [
                'Forgetting to set user.email, so commits show an unexpected author or do not link to your GitHub account.',
                'Using --global when a single project actually needs a different identity — drop --global to scope it to that repo.',
              ],
              exercises: [
                {
                  type: 'task',
                  prompt: 'Configure Git so all your future commits use the name Sam Carter and the email sam@team.dev across this machine.',
                  solution: {
                    lines: [
                      'git config --global user.name \'Sam Carter\'',
                      'git config --global user.email \'sam@team.dev\'',
                    ],
                    explanation: 'The --global flag stores these in your per-user config so every repository on the machine uses them.',
                  },
                },
                {
                  type: 'quiz',
                  prompt: 'You need one specific project to commit under a work email while everything else uses your personal email. How?',
                  solution: {
                    explanation:
                      'Inside that project run git config user.email work@company.com without --global. Repository-level config overrides the global value for that repo only.',
                  },
                },
              ],
              docs: 'https://git-scm.com/book/en/v2/Getting-Started-First-Time-Git-Setup',
            },
            {
              id: 'gt1-t1-c1',
              title: 'init vs clone: creating a repository',
              summary:
                'Start a brand-new repository with git init; copy an existing one (with all its history and a remote already set) with git clone.',
              explanation:
                'There are two ways to get a Git repository on your machine. git init turns the current directory into a new, empty repository by creating the .git folder — use it when you are starting a project from scratch. git clone <url> copies an existing repository from a remote: it downloads the entire history, checks out the default branch into a new working directory, and automatically configures the remote it came from as origin. Cloning is what you do to start working on an existing project. After init you typically create a first commit and later add a remote yourself; after clone the remote is already wired up so you can push and pull immediately. Both produce a fully functional local repository because Git is distributed.',
              analogy:
                'git init is laying the foundation for a new house on an empty lot. git clone is receiving a complete, furnished copy of an existing house, with the address of the original already written down.',
              keyPoints: [
                'git init: create a new empty repository in the current directory.',
                'git clone <url>: copy an existing repo with full history into a new folder.',
                'Clone automatically sets the source remote as origin.',
                'After init you add a remote manually; after clone it is already configured.',
              ],
              code: {
                language: 'bash',
                lines: [
                  '# Start a new project from scratch',
                  'mkdir my-app && cd my-app',
                  'git init',
                  '',
                  '# Or copy an existing project',
                  'git clone https://github.com/octocat/Hello-World.git',
                ],
                explanation: 'init creates an empty repo in place; clone downloads an existing repo and wires up origin automatically.',
              },
              exercises: [
                {
                  type: 'quiz',
                  prompt: 'After git clone, what is the name of the remote that points back to where you cloned from?',
                  hint: 'It is the conventional default name.',
                  solution: { explanation: 'origin. Git sets it automatically so you can git push and git pull without extra setup.' },
                },
                {
                  type: 'predict',
                  prompt: 'You run git init in a folder that already contains files. Are those files automatically committed?',
                  solution: {
                    explanation:
                      'No. git init only creates the repository; the existing files are untracked until you git add and git commit them.',
                  },
                },
              ],
              docs: 'https://git-scm.com/docs/git-init',
            },
            {
              id: 'gt1-t1-c2',
              title: 'The three areas: working tree, staging area and repository',
              summary:
                'Git separates your edits into three places: the working tree where you change files, the staging area where you assemble the next commit, and the repository where commits are stored permanently.',
              explanation:
                'This three-area model is the heart of using Git day to day. The working tree (or working directory) is the actual files you see and edit. The staging area (also called the index) is a holding zone where you choose exactly which changes go into the next commit. The repository is the .git database where committed snapshots live forever. The flow is: you edit files in the working tree, run git add to move selected changes into staging, then git commit to record everything that is staged as a new snapshot in the repository. The staging area is what makes Git different from simpler tools — it lets you craft a clean, focused commit out of a messy working tree, for example committing a bug fix while leaving an unrelated experiment unstaged.',
              analogy:
                'Think of preparing a package: the working tree is your desk covered in items, the staging area is the box you carefully place chosen items into, and the commit is sealing and labelling that box and adding it to the permanent archive.',
              keyPoints: [
                'Working tree: the real files you edit.',
                'Staging area (index): where you assemble the next commit.',
                'Repository (.git): where committed snapshots are stored.',
                'git add stages changes; git commit records the staged snapshot.',
                'Staging lets you split a messy working tree into clean, focused commits.',
              ],
              diagram: {
                type: 'mermaid',
                lines: [
                  'flowchart LR',
                  '  W[Working tree] -->|git add| S[Staging area]',
                  '  S -->|git commit| R[Repository .git]',
                  '  R -->|git checkout / restore| W',
                ],
                caption: 'Edits flow from the working tree to staging with git add, then into the repository with git commit.',
              },
              exercises: [
                {
                  type: 'quiz',
                  prompt: 'Which command moves changes from the working tree into the staging area?',
                  solution: { explanation: 'git add. It stages the chosen changes so the next git commit includes exactly them.' },
                },
                {
                  type: 'predict',
                  prompt: 'You edit two files, run git add on only one, then commit. What is in the commit, and what is the state of the other file?',
                  solution: {
                    explanation:
                      'Only the staged file is in the commit. The other file remains modified in the working tree, unstaged, ready for a later commit.',
                  },
                },
              ],
              docs: 'https://git-scm.com/book/en/v2/Getting-Started-What-is-Git%3F',
            },
            {
              id: 'gt1-t1-c3',
              title: 'add, commit and status: the core cycle',
              summary:
                'The everyday rhythm of Git is: check status, stage changes with add, and record them with commit and a clear message.',
              explanation:
                'These three commands cover the vast majority of your daily Git use. git status is your dashboard: it shows which files are modified, which are staged, which are untracked, and which branch you are on — run it constantly. git add stages changes; git add <file> stages one file, git add . stages everything under the current directory, and git add -p lets you stage selected chunks interactively. git commit records the staged snapshot; always pass -m with a meaningful message describing why the change was made. A good loop is: edit, git status to see what changed, git add to stage exactly what belongs together, git status again to confirm, then git commit -m with a clear message. Each commit should ideally represent one logical change so the history reads like a story.',
              keyPoints: [
                'git status shows modified, staged, untracked files and current branch.',
                'git add <file> stages one file; git add . stages the directory; git add -p stages chunks.',
                'git commit -m records the staged snapshot with a message.',
                'Aim for one logical change per commit.',
              ],
              code: {
                language: 'bash',
                lines: [
                  'git status',
                  'git add index.html styles.css',
                  'git status',
                  'git commit -m \'Add landing page markup and styles\'',
                ],
                explanation: 'Check what changed, stage the related files, confirm, then commit them with a descriptive message.',
              },
              commonMistakes: [
                'Running git commit -m without staging first — only already-staged changes are committed (or none, if nothing is staged).',
                'Using git add . blindly and accidentally committing temporary or secret files that should be ignored.',
              ],
              exercises: [
                {
                  type: 'task',
                  prompt: 'Stage all changes in the current directory and commit them with the message Fix login redirect.',
                  solution: {
                    lines: [
                      'git add .',
                      'git commit -m \'Fix login redirect\'',
                    ],
                    explanation: 'git add . stages everything under the directory; git commit -m records it with the message.',
                  },
                },
                {
                  type: 'predict',
                  prompt: 'You modify a file, then run git commit -m \'update\' without running git add. What happens?',
                  solution: {
                    explanation:
                      'Because the change was never staged, the commit excludes it (Git reports nothing to commit for that file, or commits only other staged changes). Use git add first, or git commit -a to auto-stage tracked files.',
                  },
                },
              ],
              docs: 'https://git-scm.com/docs/git-commit',
            },
          ],
        },
        {
          id: 'gt1-t2',
          name: 'Reading history',
          concepts: [
            {
              id: 'gt1-t2-c0',
              title: 'Exploring history with git log',
              summary:
                'git log shows the commit history; its options let you make it compact, graphical, filtered or formatted to taste.',
              explanation:
                'git log lists commits from newest to oldest, showing each commit hash, author, date and message. The raw output is verbose, so people lean on options: --oneline condenses each commit to a single line, --graph draws the branch and merge structure as ASCII art, --all includes every branch, and -n limits the count. You can filter by author with --author, by message with --grep, by date with --since and --until, and by file by adding a path. A popular combination is git log --oneline --graph --all --decorate, which gives a compact, annotated picture of the whole repository. Because reading history well is most of debugging and code archaeology, it pays to learn these flags.',
              keyPoints: [
                'git log lists commits newest first with hash, author, date and message.',
                '--oneline condenses; --graph draws branch structure; --all shows all branches.',
                'Filter with --author, --grep, --since/--until, or a file path.',
                'git log --oneline --graph --all --decorate is a great overview.',
              ],
              code: {
                language: 'bash',
                lines: [
                  'git log',
                  'git log --oneline --graph --all --decorate',
                  'git log --author=\'Sam\' --since=\'2 weeks ago\'',
                  'git log --oneline -- src/auth.js',
                ],
                explanation: 'Plain log, a compact annotated graph of all branches, an author/date filter, and the history of a single file.',
              },
              exercises: [
                {
                  type: 'task',
                  prompt: 'Show a compact one-line-per-commit history with the branch graph for all branches.',
                  solution: {
                    lines: ['git log --oneline --graph --all'],
                    explanation: '--oneline condenses each commit, --graph draws structure, --all includes every branch.',
                  },
                },
                {
                  type: 'quiz',
                  prompt: 'How would you list only commits whose message mentions the word cache?',
                  hint: 'There is a flag that searches messages.',
                  solution: { explanation: 'git log --grep=cache searches commit messages for the pattern.' },
                },
              ],
              docs: 'https://git-scm.com/docs/git-log',
            },
            {
              id: 'gt1-t2-c1',
              title: 'Seeing changes with diff and show',
              summary:
                'git diff shows changes that are not yet committed; git show displays the full contents and changes of a specific commit.',
              explanation:
                'git diff answers what have I changed. With no arguments it shows changes in the working tree that are not yet staged. git diff --staged (or --cached) shows what is staged and would go into the next commit — a great habit before committing. You can also diff two commits or branches, for example git diff main..feature, to see how they differ. git show, by contrast, focuses on a single object: git show <commit> prints that commit metadata and the diff it introduced, and git show <commit>:<path> prints a file as it was at that commit. Together these let you review exactly what changed before committing and inspect any historical change afterwards.',
              keyPoints: [
                'git diff: unstaged working-tree changes.',
                'git diff --staged: changes already staged for the next commit.',
                'git diff A..B: differences between two commits or branches.',
                'git show <commit>: that commit metadata plus the diff it introduced.',
              ],
              code: {
                language: 'bash',
                lines: [
                  'git diff',
                  'git diff --staged',
                  'git diff main..feature-login',
                  'git show HEAD',
                ],
                explanation: 'Unstaged changes, staged changes, the difference between two branches, and the most recent commit in full.',
              },
              commonMistakes: [
                'Expecting git diff to show staged changes — it does not; use git diff --staged for that.',
              ],
              exercises: [
                {
                  type: 'quiz',
                  prompt: 'You staged some changes and want to review exactly what will be committed. Which command?',
                  solution: { explanation: 'git diff --staged (or git diff --cached) shows the staged changes destined for the next commit.' },
                },
                {
                  type: 'task',
                  prompt: 'Display the full details and code changes of the commit with hash a1b2c3d.',
                  solution: {
                    lines: ['git show a1b2c3d'],
                    explanation: 'git show prints the commit metadata and the diff that commit introduced.',
                  },
                },
              ],
              docs: 'https://git-scm.com/docs/git-diff',
            },
            {
              id: 'gt1-t2-c2',
              title: 'What a commit is, and what HEAD points to',
              summary:
                'A commit is a snapshot plus metadata and a link to its parent; HEAD is the pointer to whatever you currently have checked out.',
              explanation:
                'Every commit object bundles a snapshot of your tracked files, author and committer information, a message, and a reference to one or more parent commits. The parent links chain commits together into the history, and the commit hash is computed from all of this content, which is why no two distinct commits share a hash. HEAD is a special pointer that almost always points to the latest commit of your current branch — it tells Git where the next commit will attach and what your working tree is based on. When HEAD points at a branch name, committing moves the branch forward. If you check out a specific commit instead of a branch, HEAD points directly at that commit, a situation called detached HEAD, where new commits are not on any branch and can be lost if you are not careful. You can refer to commits relative to HEAD: HEAD~1 is its parent, HEAD~2 its grandparent.',
              analogy:
                'Commits are beads on a string, each tied to the one before it. HEAD is your finger marking the bead you are currently standing on.',
              keyPoints: [
                'A commit = snapshot + author/message + parent link(s) + a content hash.',
                'Parent links chain commits into history.',
                'HEAD points to your current location, usually the tip of the current branch.',
                'HEAD~1 is the parent, HEAD~2 the grandparent, and so on.',
                'Checking out a commit directly gives a detached HEAD.',
              ],
              diagram: {
                type: 'mermaid',
                lines: [
                  'gitGraph',
                  '  commit id: \'A\'',
                  '  commit id: \'B\'',
                  '  commit id: \'C HEAD\'',
                ],
                caption: 'Commits chain from parent to child; HEAD marks the current tip (here commit C).',
              },
              exercises: [
                {
                  type: 'quiz',
                  prompt: 'What does HEAD~2 refer to?',
                  hint: 'Count parents back from HEAD.',
                  solution: { explanation: 'The commit two steps before HEAD — HEAD parent (HEAD~1) and then its parent (HEAD~2), i.e. the grandparent.' },
                },
                {
                  type: 'quiz',
                  prompt: 'What is a detached HEAD?',
                  solution: {
                    explanation:
                      'A state where HEAD points directly at a specific commit rather than at a branch. New commits made there are not on any branch and can be lost unless you create a branch.',
                  },
                },
              ],
              docs: 'https://git-scm.com/book/en/v2/Git-Internals-Git-References',
            },
            {
              id: 'gt1-t2-c3',
              title: 'Ignoring files with .gitignore',
              summary:
                'A .gitignore file tells Git which files and folders to leave untracked, keeping build artifacts, dependencies and secrets out of your repository.',
              explanation:
                'Not everything in a project belongs in version control: compiled output, downloaded dependencies like node_modules, log files, editor settings and — critically — secrets such as .env files should stay out. You list patterns in a .gitignore file (usually at the repository root), and Git will not show or stage those matching paths. Patterns support wildcards (*.log), directory matches (build/), negation to re-include something (!keep.log), and comments (lines starting with #). An important subtlety: .gitignore only affects untracked files. If a file is already tracked, adding it to .gitignore does nothing until you stop tracking it with git rm --cached. GitHub provides ready-made .gitignore templates for most languages, which is the easiest way to start.',
              analogy:
                'A .gitignore is the bouncer at the door of your repository: it has a list of who is not allowed in, but anyone already inside stays until you escort them out.',
              keyPoints: [
                'List patterns of files/folders Git should not track.',
                'Supports wildcards (*.log), directories (build/), negation (!keep.log) and comments.',
                'It only affects untracked files; already-tracked files need git rm --cached to stop tracking.',
                'Always ignore secrets like .env and large generated folders like node_modules.',
              ],
              code: {
                language: 'bash',
                lines: [
                  '# .gitignore example',
                  'node_modules/',
                  'dist/',
                  '*.log',
                  '.env',
                  '!.env.example',
                ],
                explanation: 'Ignore dependencies, build output, logs and the real env file, but keep a committed example env template.',
              },
              commonMistakes: [
                'Adding a file to .gitignore after it is already committed and expecting it to disappear — you must git rm --cached it first.',
                'Committing a .env or credentials file before ignoring it, leaking secrets into history.',
              ],
              exercises: [
                {
                  type: 'task',
                  prompt: 'A secret file config/secrets.json was committed earlier. Stop tracking it (keeping it on disk) and add it to .gitignore.',
                  solution: {
                    lines: [
                      'git rm --cached config/secrets.json',
                      'echo \'config/secrets.json\' >> .gitignore',
                      'git commit -m \'Stop tracking secrets file\'',
                    ],
                    explanation: 'git rm --cached untracks it without deleting it; adding the path to .gitignore prevents re-adding; then commit the change.',
                  },
                },
                {
                  type: 'predict',
                  prompt: 'You add *.log to .gitignore, but debug.log keeps showing as tracked changes. Why?',
                  solution: {
                    explanation:
                      'debug.log was already tracked before you ignored it. .gitignore only affects untracked files; run git rm --cached debug.log to stop tracking it.',
                  },
                },
              ],
              docs: 'https://git-scm.com/docs/gitignore',
            },
          ],
        },
      ],
    },
    /* ───────────────────── LEVEL 2 — BRANCHING & INTEGRATING ───────────────────── */
    {
      level: 2,
      name: 'Branching and integrating',
      focus: 'Branches as pointers, merging and conflicts, and rebasing for a clean history',
      accent: '#f05133',
      soft: '#fdeae6',
      topics: [
        {
          id: 'gt2-t0',
          name: 'Branches',
          concepts: [
            {
              id: 'gt2-t0-c0',
              title: 'A branch is just a pointer',
              summary:
                'In Git a branch is nothing more than a lightweight, movable pointer to a commit — which is why creating branches is instant and cheap.',
              explanation:
                'Many people imagine a branch as a heavy copy of the project, but in Git a branch is just a tiny file containing the hash of one commit. When you commit on a branch, Git creates the new commit and simply moves the branch pointer forward to it. Because a branch is only a 40-character reference, creating, deleting and switching branches is essentially free, which encourages making a branch for every feature or fix. The default branch in modern Git and GitHub is main. HEAD usually points at a branch, and that branch points at a commit; together they tell Git where you are and where new commits attach. This pointer model is the foundation that makes Git branching fast and merging tractable.',
              analogy:
                'A branch is a sticky note with a commit number written on it, not a photocopy of the whole book. Moving the note forward is instant; you never duplicate the pages.',
              keyPoints: [
                'A branch is a movable pointer to a single commit, stored as a tiny ref.',
                'Committing moves the current branch pointer forward.',
                'Creating and deleting branches is nearly free.',
                'main is the modern default branch; HEAD points at your current branch.',
              ],
              diagram: {
                type: 'mermaid',
                lines: [
                  'gitGraph',
                  '  commit',
                  '  commit',
                  '  branch feature',
                  '  checkout feature',
                  '  commit',
                ],
                caption: 'A new branch is just another pointer; committing on it moves only that pointer forward.',
              },
              exercises: [
                {
                  type: 'quiz',
                  prompt: 'Why is creating a branch in Git so fast compared with older tools?',
                  hint: 'What does a branch physically consist of?',
                  solution: {
                    explanation:
                      'A branch is only a small reference (a pointer) to one commit hash, not a copy of the project. Creating it just writes that pointer, which is instant.',
                  },
                },
                {
                  type: 'predict',
                  prompt: 'You are on branch feature and make a commit. Which pointer moves, main or feature?',
                  solution: { explanation: 'Only feature moves forward to the new commit. main stays where it was, because HEAD points at feature.' },
                },
              ],
              docs: 'https://git-scm.com/book/en/v2/Git-Branching-Branches-in-a-Nutshell',
            },
            {
              id: 'gt2-t0-c1',
              title: 'Creating, switching and deleting branches',
              summary:
                'Modern Git uses git switch to move between branches and git branch to list or delete them, replacing the older multipurpose git checkout.',
              explanation:
                'To list branches, run git branch; the current one is marked. To create and move onto a new branch in one step, use git switch -c <name> (the modern, clearer command); git checkout -b <name> does the same thing and still works. To move to an existing branch, git switch <name>. When a branch is fully merged and no longer needed, delete it with git branch -d <name>; Git refuses if it has unmerged commits, and git branch -D forces deletion. The reason git switch and git restore were introduced is that the old git checkout did too many unrelated things — switching branches, restoring files, and detaching HEAD — which confused beginners. Using switch for branches and restore for files keeps each command focused.',
              keyPoints: [
                'git branch lists branches; the current one is highlighted.',
                'git switch -c <name> creates and switches in one step (or git checkout -b).',
                'git switch <name> moves to an existing branch.',
                'git branch -d deletes a merged branch; -D forces deletion.',
              ],
              code: {
                language: 'bash',
                lines: [
                  'git branch',
                  'git switch -c feature-search',
                  'git switch main',
                  'git branch -d feature-search',
                ],
                explanation: 'List branches, create and switch to a new one, switch back to main, then delete the merged feature branch.',
              },
              commonMistakes: [
                'Forgetting to switch branches before starting work, so commits land on the wrong branch.',
                'Using git branch -D to force-delete a branch with unmerged work and losing those commits.',
              ],
              exercises: [
                {
                  type: 'task',
                  prompt: 'Create a new branch called bugfix-cart and start working on it, in a single command.',
                  solution: {
                    lines: ['git switch -c bugfix-cart'],
                    explanation: 'git switch -c creates the branch and moves HEAD onto it at once. git checkout -b bugfix-cart is the older equivalent.',
                  },
                },
                {
                  type: 'predict',
                  prompt: 'You run git branch -d feature, but Git refuses. What is the likely reason?',
                  solution: {
                    explanation:
                      'feature has commits that are not yet merged into your current branch. Git protects you from losing them; use -D to force deletion only if you truly want to discard them.',
                  },
                },
              ],
              docs: 'https://git-scm.com/docs/git-switch',
            },
            {
              id: 'gt2-t0-c2',
              title: 'Fast-forward: the simplest integration',
              summary:
                'When a branch has not diverged, Git can integrate it by simply sliding the pointer forward — a fast-forward, with no new merge commit.',
              explanation:
                'A fast-forward happens when the branch you are merging into has not changed since the other branch split off. In that case there is no real merging to do: the target branch is a direct ancestor of the source, so Git just moves the target pointer forward to the source tip. The result is a perfectly linear history with no merge commit. Fast-forwards are common when you create a feature branch, do some commits, and main has not moved in the meantime — merging main into it (or it into main) just advances the pointer. If you want to record that a feature existed even when a fast-forward is possible, you can force a merge commit with git merge --no-ff. Understanding fast-forward versus a true merge is key to predicting what your history will look like.',
              analogy:
                'A fast-forward is like catching up to a friend who walked ahead on a straight path: you do not need to chart a new route, you just walk to where they are.',
              keyPoints: [
                'Fast-forward applies when the target branch has not diverged from the source.',
                'Git simply moves the pointer forward — no merge commit is created.',
                'It produces a clean, linear history.',
                'git merge --no-ff forces a merge commit even when a fast-forward is possible.',
              ],
              diagram: {
                type: 'mermaid',
                lines: [
                  'gitGraph',
                  '  commit id: \'A\'',
                  '  branch feature',
                  '  checkout feature',
                  '  commit id: \'B\'',
                  '  commit id: \'C\'',
                  '  checkout main',
                  '  merge feature',
                ],
                caption: 'Since main did not move, merging feature just fast-forwards main to commit C.',
              },
              exercises: [
                {
                  type: 'quiz',
                  prompt: 'Under what condition can Git fast-forward a merge?',
                  solution: {
                    explanation:
                      'When the target branch has not advanced since the source branch split off — the target is a direct ancestor of the source — so Git can just move the pointer forward.',
                  },
                },
                {
                  type: 'quiz',
                  prompt: 'How do you force a merge commit even when a fast-forward would be possible, and why might you?',
                  solution: {
                    explanation:
                      'git merge --no-ff. It preserves an explicit record that a feature branch was merged, which some teams prefer for traceable history.',
                  },
                },
              ],
              docs: 'https://git-scm.com/book/en/v2/Git-Branching-Basic-Branching-and-Merging',
            },
          ],
        },
        {
          id: 'gt2-t1',
          name: 'Merging and conflicts',
          concepts: [
            {
              id: 'gt2-t1-c0',
              title: 'Merge types: fast-forward vs three-way',
              summary:
                'When two branches have both advanced, Git performs a three-way merge that combines them into a new merge commit with two parents.',
              explanation:
                'There are two outcomes when you merge. If the target has not moved, Git fast-forwards (covered earlier). If both branches have new commits since they diverged, Git performs a three-way merge: it looks at the two branch tips and their common ancestor (the merge base), works out the changes each side made, and combines them. The result is a special merge commit that has two parents, recording that two lines of history came together. Most of the time Git merges automatically because the two sides touched different lines or different files. Only when both sides changed the same lines does it stop and ask you to resolve a conflict. You start a merge with git merge <branch> while on the branch you want to merge into.',
              analogy:
                'A three-way merge is like two editors marking up separate paragraphs of the same document: the publisher combines both sets of edits automatically, and only calls a meeting when both edited the same sentence.',
              keyPoints: [
                'Fast-forward when the target has not diverged; three-way merge when both sides advanced.',
                'A three-way merge uses the two tips and their common ancestor (merge base).',
                'It produces a merge commit with two parents.',
                'Git merges automatically unless both sides changed the same lines.',
              ],
              diagram: {
                type: 'mermaid',
                lines: [
                  'gitGraph',
                  '  commit id: \'A\'',
                  '  branch feature',
                  '  checkout feature',
                  '  commit id: \'F1\'',
                  '  checkout main',
                  '  commit id: \'M1\'',
                  '  merge feature',
                ],
                caption: 'Both branches advanced after A, so merging produces a merge commit combining M1 and F1.',
              },
              code: {
                language: 'bash',
                lines: [
                  'git switch main',
                  'git merge feature-login',
                ],
                explanation: 'Switch to the receiving branch, then merge the feature branch into it.',
              },
              exercises: [
                {
                  type: 'quiz',
                  prompt: 'How many parents does a three-way merge commit have, and what does that record?',
                  solution: { explanation: 'Two parents — one from each branch — recording that two lines of history were joined at that point.' },
                },
                {
                  type: 'predict',
                  prompt: 'Two branches each added a brand-new, different file. Will merging them cause a conflict?',
                  solution: {
                    explanation:
                      'No. They touched different files, so Git combines them automatically. Conflicts only arise when both sides change the same lines of the same file.',
                  },
                },
              ],
              docs: 'https://git-scm.com/docs/git-merge',
            },
            {
              id: 'gt2-t1-c1',
              title: 'Anatomy of a merge conflict',
              summary:
                'A conflict occurs when both branches changed the same lines; Git marks the spot with conflict markers and waits for you to decide.',
              explanation:
                'When Git cannot automatically reconcile two sets of changes to the same lines, it pauses the merge and rewrites the affected file with conflict markers. The section between <<<<<<< and ======= is your current branch version (labelled HEAD), and the section between ======= and >>>>>>> is the incoming branch version. Git also updates the index to a conflicted state and git status will list the unmerged paths. Your job is to edit the file to the correct final result — keeping one side, the other, or a combination — and then remove all three marker lines. Nothing is broken at this point; Git is simply asking a human to make the editorial decision it cannot make safely. You can always abort the whole merge with git merge --abort to return to the state before you started.',
              keyPoints: [
                'Conflicts arise when both branches edited the same lines.',
                'Markers: <<<<<<< HEAD is your side, ======= separates, >>>>>>> is the incoming side.',
                'git status lists unmerged paths during a conflict.',
                'git merge --abort safely cancels the in-progress merge.',
              ],
              code: {
                language: 'bash',
                lines: [
                  '<<<<<<< HEAD',
                  'const timeout = 30;',
                  '=======',
                  'const timeout = 60;',
                  '>>>>>>> feature-config',
                ],
                explanation: 'The current branch wants 30, the incoming feature-config branch wants 60; you edit to the correct value and delete the markers.',
              },
              commonMistakes: [
                'Committing a file that still contains <<<<<<<, ======= or >>>>>>> markers, breaking the code.',
                'Panicking and force-pushing instead of using git merge --abort to start over cleanly.',
              ],
              exercises: [
                {
                  type: 'quiz',
                  prompt: 'In conflict markers, which side is your current branch and which is the incoming branch?',
                  hint: 'Look at the labels next to the markers.',
                  solution: {
                    explanation:
                      'The block under <<<<<<< HEAD (down to =======) is your current branch; the block from ======= to >>>>>>> <name> is the incoming branch.',
                  },
                },
                {
                  type: 'task',
                  prompt: 'You started a merge, but it got messy and you want to bail out and return to the pre-merge state. What command?',
                  solution: {
                    lines: ['git merge --abort'],
                    explanation: 'git merge --abort discards the in-progress merge and restores the branch to exactly where it was before.',
                  },
                },
              ],
              docs: 'https://git-scm.com/book/en/v2/Git-Branching-Basic-Branching-and-Merging',
            },
            {
              id: 'gt2-t1-c2',
              title: 'Resolving a conflict end to end',
              summary:
                'To resolve a conflict you edit the files to the desired result, stage them with git add, and complete the merge with a commit.',
              explanation:
                'The resolution workflow is consistent. First, run git status to see which files are unmerged. Open each conflicted file, decide on the final content, and remove all conflict markers — many editors and tools (including git mergetool) help here. Once a file looks correct, stage it with git add, which is how you tell Git this conflict is resolved. When every conflicted file is staged, finish the merge with git commit; Git pre-fills a sensible merge message. The key insight is that git add doubles as the way to mark a conflict resolved. If at any point you change your mind, git merge --abort backs everything out. After resolving, build and run your tests, because a clean text merge can still produce broken behaviour if both sides made logically incompatible changes.',
              keyPoints: [
                'git status shows the unmerged files to fix.',
                'Edit each file to the final content and remove all markers.',
                'git add a resolved file marks the conflict resolved.',
                'git commit completes the merge once everything is staged.',
                'Always re-run tests — a clean text merge can still be logically wrong.',
              ],
              code: {
                language: 'bash',
                lines: [
                  'git status',
                  '# edit conflicted files, remove markers',
                  'git add src/config.js',
                  'git commit',
                ],
                explanation: 'Inspect, edit and remove markers, stage the resolved file to mark it done, then commit to finish the merge.',
              },
              exercises: [
                {
                  type: 'quiz',
                  prompt: 'After editing a conflicted file to its final form, what command tells Git the conflict is resolved?',
                  solution: { explanation: 'git add on that file. Staging it marks the conflict as resolved; once all are staged you commit.' },
                },
                {
                  type: 'predict',
                  prompt: 'You resolved all conflicts textually and committed, but the app now crashes. Is the merge wrong?',
                  solution: {
                    explanation:
                      'The text merge succeeded, but the two sides may have made logically incompatible changes. A clean merge does not guarantee correct behaviour — that is why you run the tests after resolving.',
                  },
                },
              ],
              docs: 'https://git-scm.com/docs/git-merge',
            },
          ],
        },
        {
          id: 'gt2-t2',
          name: 'Rebase',
          concepts: [
            {
              id: 'gt2-t2-c0',
              title: 'Rebase vs merge',
              summary:
                'Rebase rewrites your commits onto a new base to produce a linear history, whereas merge preserves the branch structure with a merge commit.',
              explanation:
                'Both merge and rebase integrate changes from one branch into another, but they shape history differently. git merge keeps the true history: it joins the branches with a merge commit, so you can see exactly when and how they came together. git rebase instead takes the commits unique to your branch and reapplies them one by one on top of the latest target, as if you had started your work from there. The result is a clean, linear history with no merge commit, which many teams prefer for readability. The crucial difference is that rebase rewrites commits — they get new hashes because their parent changed — while merge never alters existing commits. A common workflow is to rebase your feature branch onto the latest main to keep it current, then do a fast-forward merge.',
              analogy:
                'Merge stitches two roads together at a junction you can always see. Rebase picks up your road and lays it down again as a seamless extension of the main road, hiding the original junction.',
              keyPoints: [
                'Merge preserves history with a merge commit; rebase produces a linear history.',
                'Rebase reapplies your commits on a new base, giving them new hashes.',
                'Merge never rewrites existing commits; rebase does.',
                'Common pattern: rebase a feature onto main, then fast-forward merge.',
              ],
              diagram: {
                type: 'mermaid',
                lines: [
                  'flowchart LR',
                  '  subgraph After rebase',
                  '    M1[main A] --> M2[main B] --> F1[feature commit] --> F2[feature commit]',
                  '  end',
                ],
                caption: 'Rebasing replays the feature commits on top of the latest main, yielding a straight line.',
              },
              code: {
                language: 'bash',
                lines: [
                  'git switch feature',
                  'git rebase main',
                ],
                explanation: 'While on the feature branch, replay its commits on top of the current main for a linear history.',
              },
              exercises: [
                {
                  type: 'quiz',
                  prompt: 'Why do commits get new hashes after a rebase?',
                  hint: 'What input to a commit hash changes?',
                  solution: {
                    explanation:
                      'Rebase reapplies the commits onto a new parent. Because the parent (and thus the commit content used to compute the hash) changes, each rewritten commit gets a new hash.',
                  },
                },
                {
                  type: 'quiz',
                  prompt: 'Which integration method preserves an explicit record of when two branches joined?',
                  solution: { explanation: 'Merge — it creates a merge commit with two parents recording the join. Rebase hides that by producing a linear history.' },
                },
              ],
              docs: 'https://git-scm.com/book/en/v2/Git-Branching-Rebasing',
            },
            {
              id: 'gt2-t2-c1',
              title: 'Interactive rebase: squash and reword',
              summary:
                'git rebase -i lets you rewrite a series of your own commits — squashing several into one, rewording messages, reordering or dropping them.',
              explanation:
                'Interactive rebase is the power tool for tidying history before sharing it. Running git rebase -i <base> opens an editor listing the commits from base to HEAD, each with a command you can change. pick keeps a commit as is; squash (or s) folds a commit into the previous one and lets you combine messages; fixup (f) does the same but discards the squashed commit message; reword (r) keeps the commit but lets you edit its message; drop removes a commit; and reordering the lines reorders the commits. A typical use is collapsing five messy work-in-progress commits into one clean commit before opening a pull request. Because it rewrites commits, only do this on commits you have not yet shared. If you make a mistake, the reflog (covered later) can rescue the previous state.',
              keyPoints: [
                'git rebase -i <base> opens an editable list of your recent commits.',
                'squash/fixup combine commits; reword edits a message; drop removes one.',
                'Reordering the lines reorders the commits.',
                'Use it to clean up local history before sharing — never on shared commits.',
              ],
              code: {
                language: 'bash',
                lines: [
                  'git rebase -i HEAD~3',
                  '# in the editor:',
                  '# pick 1a2b3c Add feature',
                  '# squash 4d5e6f WIP',
                  '# squash 7g8h9i fix typo',
                ],
                explanation: 'Open the last three commits and squash the two follow-up commits into the first, producing one clean commit.',
              },
              commonMistakes: [
                'Interactively rebasing commits that have already been pushed and shared, forcing painful history rewrites for teammates.',
                'Choosing squash when you meant fixup (or vice versa), then being surprised by the combined commit message.',
              ],
              exercises: [
                {
                  type: 'task',
                  prompt: 'Open an interactive rebase to clean up your last four commits.',
                  solution: {
                    lines: ['git rebase -i HEAD~4'],
                    explanation: 'HEAD~4 selects the four most recent commits so you can squash, reword, reorder or drop them.',
                  },
                },
                {
                  type: 'quiz',
                  prompt: 'What is the difference between squash and fixup in an interactive rebase?',
                  solution: {
                    explanation:
                      'Both combine a commit into the previous one, but squash lets you edit and keep the combined commit messages, while fixup silently discards the squashed commit message.',
                  },
                },
              ],
              docs: 'https://git-scm.com/docs/git-rebase',
            },
            {
              id: 'gt2-t2-c2',
              title: 'The golden rule of rebasing',
              summary:
                'Never rebase commits that other people have already based work on — rewriting shared history forces everyone into painful conflicts.',
              explanation:
                'The golden rule is simple: do not rebase (or otherwise rewrite) commits that have been pushed to a shared branch and that others may have pulled. Because rebase replaces commits with new ones that have different hashes, anyone who already has the originals will see divergent history; when they try to integrate, Git treats the rewritten commits as new and duplicates work, producing confusing conflicts. Rebasing is perfectly safe on your own local, unshared commits — that is exactly where interactive rebase shines for cleanup. If you absolutely must rewrite shared history (rare, and usually a mistake), coordinate with the whole team and use git push --force-with-lease, which is safer than --force because it refuses to overwrite if the remote has moved unexpectedly. The practical guideline: rebase before you share, merge after.',
              analogy:
                'Rewriting shared history is like quietly renumbering all the pages of a book everyone is already reading — their bookmarks and notes suddenly point to the wrong places.',
              keyPoints: [
                'Safe to rebase: local commits you have not shared.',
                'Unsafe: commits already pushed and pulled by others.',
                'Rewritten commits get new hashes, causing divergence and duplicate work for teammates.',
                'If you must force-push, prefer --force-with-lease over --force.',
              ],
              commonMistakes: [
                'Rebasing a shared main or release branch and force-pushing, breaking everyone else clones.',
                'Using --force instead of --force-with-lease and clobbering a teammate newly pushed commits.',
              ],
              exercises: [
                {
                  type: 'quiz',
                  prompt: 'State the golden rule of rebasing in one sentence.',
                  solution: { explanation: 'Do not rebase commits that have been pushed to a shared branch and that others may already have based work on.' },
                },
                {
                  type: 'predict',
                  prompt: 'You rebase the shared main branch and force-push. What do your teammates experience on their next pull?',
                  solution: {
                    explanation:
                      'Their local main diverges from the rewritten remote. Git sees the old and new commits as different, producing confusing conflicts and duplicated commits — exactly what the golden rule prevents.',
                  },
                },
              ],
              docs: 'https://git-scm.com/book/en/v2/Git-Branching-Rebasing',
            },
          ],
        },
      ],
    },
    /* ───────────────────── LEVEL 3 — REMOTES & COLLABORATION ───────────────────── */
    {
      level: 3,
      name: 'Remotes and collaboration',
      focus: 'Sharing work through remotes, GitHub pull requests, and team workflows',
      accent: '#f05133',
      soft: '#fdeae6',
      topics: [
        {
          id: 'gt3-t0',
          name: 'Working with remotes',
          concepts: [
            {
              id: 'gt3-t0-c0',
              title: 'Remotes and origin',
              summary:
                'A remote is a named reference to another copy of your repository, usually hosted online; by convention the main one is called origin.',
              explanation:
                'Because Git is distributed, you synchronize with other copies of the repository called remotes. A remote is just a name mapped to a URL, so you do not have to type the full address every time. When you clone, Git automatically adds a remote named origin pointing at the source. You can list remotes with git remote -v, add one with git remote add <name> <url>, and rename or remove them. Teams commonly use origin for their own copy and, in a fork-based workflow, add a second remote named upstream pointing at the original project. Remotes by themselves do not move data — they are addresses. The fetch, pull and push commands are what actually transfer commits between your local repository and a remote.',
              analogy:
                'A remote is a saved contact in your phone: origin is the name, and the URL is the phone number. Saving the contact does not call anyone — you still have to dial (fetch, pull or push).',
              keyPoints: [
                'A remote is a named alias for another repository URL.',
                'Cloning auto-creates the origin remote.',
                'git remote -v lists remotes; git remote add adds one.',
                'Fork workflows often add an upstream remote for the original project.',
              ],
              code: {
                language: 'bash',
                lines: [
                  'git remote -v',
                  'git remote add upstream https://github.com/original/project.git',
                  'git remote -v',
                ],
                explanation: 'List existing remotes, add an upstream pointing at the original project, then confirm both are configured.',
              },
              exercises: [
                {
                  type: 'quiz',
                  prompt: 'What is the conventional name of the remote that git clone creates automatically?',
                  solution: { explanation: 'origin. It points at the URL you cloned from and is used by default for push and pull.' },
                },
                {
                  type: 'task',
                  prompt: 'Add a remote named upstream pointing at https://github.com/acme/widgets.git.',
                  solution: {
                    lines: ['git remote add upstream https://github.com/acme/widgets.git'],
                    explanation: 'git remote add maps the name upstream to that URL so you can fetch from the original project later.',
                  },
                },
              ],
              docs: 'https://git-scm.com/docs/git-remote',
            },
            {
              id: 'gt3-t0-c1',
              title: 'fetch vs pull',
              summary:
                'git fetch downloads new commits from a remote without changing your branches; git pull fetches and then merges (or rebases) into your current branch.',
              explanation:
                'These two commands are often confused. git fetch contacts a remote and downloads any new commits and refs, updating your remote-tracking branches (like origin/main) but leaving your own working branch untouched. It is completely safe — you can fetch any time to see what is new, then review before integrating. git pull is a convenience that does git fetch followed immediately by a merge of the upstream branch into your current branch (or a rebase if you configure pull.rebase). Because pull changes your working branch automatically, it can surprise you with merge commits or conflicts. Many professionals prefer to fetch, inspect with git log or git diff against origin/main, and then merge or rebase deliberately. Configuring git pull --rebase (or pull.rebase true) keeps history linear when you do pull.',
              analogy:
                'fetch is checking your mailbox and bringing the letters inside without opening them. pull is checking the mailbox and immediately acting on every letter — efficient, but you might not like a surprise inside.',
              keyPoints: [
                'git fetch downloads commits and updates remote-tracking branches only — safe, non-destructive.',
                'git pull = git fetch + merge (or rebase) into your current branch.',
                'Pull can introduce unexpected merge commits or conflicts.',
                'Fetch-then-review is safer; git pull --rebase keeps history linear.',
              ],
              diagram: {
                type: 'mermaid',
                lines: [
                  'flowchart LR',
                  '  R[Remote origin] -->|git fetch| T[Remote-tracking origin/main]',
                  '  T -->|merge or rebase| L[Local main]',
                  '  R -->|git pull does both| L',
                ],
                caption: 'Fetch updates origin/main only; pull fetches and then integrates into your local branch.',
              },
              code: {
                language: 'bash',
                lines: [
                  'git fetch origin',
                  'git log --oneline main..origin/main',
                  'git merge origin/main',
                ],
                explanation: 'Fetch new commits, review what arrived compared to your branch, then merge them in deliberately.',
              },
              commonMistakes: [
                'Assuming git fetch changes your working branch — it does not; you still need to merge or rebase.',
                'Blindly running git pull on a branch with local work and getting an unexpected merge commit.',
              ],
              exercises: [
                {
                  type: 'quiz',
                  prompt: 'After git fetch, why does your current branch show no new commits even though the remote has them?',
                  hint: 'Where do fetched commits land?',
                  solution: {
                    explanation:
                      'Fetch only updates remote-tracking branches like origin/main; it never moves your own branch. You must merge or rebase origin/main into it to bring the commits in.',
                  },
                },
                {
                  type: 'quiz',
                  prompt: 'What two operations does git pull combine?',
                  solution: { explanation: 'A git fetch followed by a merge of the upstream branch into your current branch (or a rebase if configured).' },
                },
              ],
              docs: 'https://git-scm.com/docs/git-fetch',
            },
            {
              id: 'gt3-t0-c2',
              title: 'Pushing and tracking branches',
              summary:
                'git push uploads your commits to a remote; setting an upstream with -u links your local branch to a remote branch so future pushes and pulls need no arguments.',
              explanation:
                'When you have committed locally, git push sends those commits to a remote branch. The first time you push a new branch, you set its upstream (tracking) relationship with git push -u origin <branch>; this records which remote branch yours corresponds to, so afterwards a bare git push and git pull just work. A tracking branch is what lets git status tell you things like ahead 2, behind 1 — it compares your branch with its upstream. Pushes are rejected if the remote has commits you do not have, because Git refuses to overwrite others work; the fix is to fetch and integrate first, then push. You should almost never need --force; when you genuinely must, use --force-with-lease so you do not clobber commits a teammate pushed after your last fetch.',
              keyPoints: [
                'git push uploads local commits to a remote branch.',
                'git push -u origin <branch> sets the upstream so later push/pull need no arguments.',
                'Tracking lets git status report ahead/behind counts.',
                'A rejected push means fetch and integrate first; avoid --force, prefer --force-with-lease.',
              ],
              code: {
                language: 'bash',
                lines: [
                  'git switch -c feature-export',
                  'git commit -am \'Add CSV export\'',
                  'git push -u origin feature-export',
                  'git push',
                ],
                explanation: 'Create a branch, commit, push it for the first time while setting upstream, then later push with no arguments.',
              },
              commonMistakes: [
                'Forgetting -u on the first push, then being told there is no upstream configured.',
                'Reacting to a rejected push with --force and overwriting a teammate work.',
              ],
              exercises: [
                {
                  type: 'task',
                  prompt: 'Push a new local branch called feature-api to origin for the first time and set it to track.',
                  solution: {
                    lines: ['git push -u origin feature-api'],
                    explanation: 'The -u (or --set-upstream) flag links the local branch to origin/feature-api so future push and pull need no arguments.',
                  },
                },
                {
                  type: 'predict',
                  prompt: 'Your git push is rejected with a message that the remote contains work you do not have locally. What should you do?',
                  solution: {
                    explanation:
                      'Fetch and integrate the remote commits first (git pull or git fetch then merge/rebase), resolve any conflicts, then push again. Do not force-push, which would discard their work.',
                  },
                },
              ],
              docs: 'https://git-scm.com/docs/git-push',
            },
          ],
        },
        {
          id: 'gt3-t1',
          name: 'GitHub and pull requests',
          concepts: [
            {
              id: 'gt3-t1-c0',
              title: 'Fork vs clone',
              summary:
                'Cloning copies a repository to your machine; forking creates your own server-side copy on GitHub, used when you lack write access to the original.',
              explanation:
                'A clone is a local copy of a repository on your computer; you clone any project you want to work with locally. A fork is a copy of a repository under your own GitHub account, created on the server with one click. The distinction matters for contributing to projects you do not own: if you have write access (you are a collaborator), you can clone, branch and push directly. If you do not — as with most open-source projects — you fork the repo to your account, clone your fork, push your branch to the fork, and then open a pull request from your fork back to the original. In that setup you typically configure two remotes: origin (your fork) and upstream (the original) so you can keep your fork in sync. Forking is therefore the permission-friendly path; direct cloning and pushing is for collaborators.',
              analogy:
                'Cloning is photocopying a document to read and mark up at your desk. Forking is getting your own official copy filed under your name in the shared archive, which you can later propose merging back.',
              keyPoints: [
                'Clone = local copy on your machine; fork = your own copy on GitHub.',
                'Collaborators with write access can clone and push directly.',
                'Without write access, fork, clone your fork, push there, and open a pull request.',
                'Fork workflows use origin (your fork) plus upstream (the original).',
              ],
              diagram: {
                type: 'mermaid',
                lines: [
                  'flowchart LR',
                  '  U[Upstream original repo] -->|fork| F[Your fork on GitHub]',
                  '  F -->|clone| L[Your local clone]',
                  '  L -->|push| F',
                  '  F -->|pull request| U',
                ],
                caption: 'Fork the original, clone your fork, push to it, then open a pull request back to upstream.',
              },
              exercises: [
                {
                  type: 'quiz',
                  prompt: 'You want to contribute to a popular open-source project where you are not a collaborator. Do you fork or clone first?',
                  solution: {
                    explanation:
                      'Fork first, to get your own GitHub copy you can push to. Then clone your fork locally and open a pull request from it back to the original.',
                  },
                },
                {
                  type: 'quiz',
                  prompt: 'In a fork workflow, what do the remotes origin and upstream typically point to?',
                  solution: { explanation: 'origin points to your fork (where you push); upstream points to the original project (where you fetch updates and send pull requests).' },
                },
              ],
              docs: 'https://docs.github.com/en/get-started/quickstart/fork-a-repo',
            },
            {
              id: 'gt3-t1-c1',
              title: 'The pull request lifecycle and code review',
              summary:
                'A pull request proposes merging one branch into another and is the place where teammates review, discuss and approve changes before they land.',
              explanation:
                'A pull request (PR) is GitHub central collaboration feature. You push a branch, open a PR targeting the branch you want to merge into (usually main), and describe what changed and why. The PR shows the diff, runs any automated checks (CI), and lets reviewers comment on specific lines, request changes, or approve. You respond by pushing more commits to the same branch, which automatically update the PR. Once it is approved and checks pass, you merge it — GitHub offers a normal merge commit, squash merge (combining all commits into one), or rebase merge (replaying commits linearly). After merging you delete the branch. Good PRs are small and focused, have a clear description, and link the issue they address. Code review through PRs is how teams catch bugs, share knowledge and keep quality high.',
              keyPoints: [
                'A PR proposes merging a branch and hosts review and discussion.',
                'It shows the diff, runs CI checks, and supports line-level comments and approvals.',
                'Pushing more commits to the branch updates the PR automatically.',
                'Merge options: merge commit, squash merge, or rebase merge; delete the branch after.',
              ],
              diagram: {
                type: 'mermaid',
                lines: [
                  'flowchart LR',
                  '  A[Push branch] --> B[Open pull request]',
                  '  B --> C[CI checks and review]',
                  '  C --> D[Address feedback]',
                  '  D --> E[Approve and merge]',
                  '  E --> F[Delete branch]',
                ],
                caption: 'The PR lifecycle: push, open, review and check, address feedback, approve, merge and clean up.',
              },
              commonMistakes: [
                'Opening huge PRs with many unrelated changes, making review slow and error-prone.',
                'Force-pushing a rebased branch mid-review, which can scramble reviewers comment threads.',
              ],
              exercises: [
                {
                  type: 'quiz',
                  prompt: 'A reviewer requests changes on your PR. How do you update it?',
                  hint: 'You do not open a new PR.',
                  solution: {
                    explanation:
                      'Make the changes locally, commit, and push to the same branch. The existing PR updates automatically with the new commits and re-runs checks.',
                  },
                },
                {
                  type: 'quiz',
                  prompt: 'What does the squash merge option do when merging a PR?',
                  solution: {
                    explanation:
                      'It combines all the commits on the branch into a single commit on the target branch, keeping the main history compact and linear.',
                  },
                },
              ],
              docs: 'https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/proposing-changes-to-your-work-with-pull-requests/about-pull-requests',
            },
            {
              id: 'gt3-t1-c2',
              title: 'Issues and protected branches',
              summary:
                'Issues track work and bugs as discussion threads; branch protection rules enforce review, passing checks and other gates before code can merge into important branches.',
              explanation:
                'GitHub Issues are a lightweight tracker for bugs, features and tasks; each issue is a discussion thread with labels, assignees and milestones, and you can link a PR to an issue so merging the PR closes it automatically (for example with Closes #42 in the PR description). Branch protection rules guard important branches like main: you can require pull requests before merging, require a minimum number of approving reviews, require status checks (CI) to pass, require branches to be up to date, prevent force-pushes, and even require signed commits. Together, issues organize what needs doing and protection rules guarantee how it gets in — no one can push broken or unreviewed code straight to main. These features turn Git from a personal tool into a controlled team process.',
              keyPoints: [
                'Issues track bugs, features and tasks as labelled, assignable threads.',
                'Linking a PR with Closes #N auto-closes the issue on merge.',
                'Branch protection can require PRs, approvals, passing checks and up-to-date branches.',
                'Protection rules can block force-pushes and direct pushes to main.',
              ],
              code: {
                language: 'bash',
                lines: [
                  '# In a PR description, link and auto-close an issue',
                  'Closes #128',
                ],
                explanation: 'Adding a closing keyword like Closes #128 to the PR links the issue and closes it when the PR merges.',
              },
              exercises: [
                {
                  type: 'quiz',
                  prompt: 'How can you make merging a PR automatically close the related issue?',
                  solution: { explanation: 'Use a closing keyword such as Closes #N, Fixes #N or Resolves #N in the PR description or a commit message; merging then closes issue N.' },
                },
                {
                  type: 'quiz',
                  prompt: 'Name two things a branch protection rule on main can require before code merges.',
                  solution: {
                    explanation:
                      'Any two of: a pull request, a number of approving reviews, passing status checks, the branch being up to date, signed commits, or blocking force-pushes.',
                  },
                },
              ],
              docs: 'https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/about-protected-branches',
            },
          ],
        },
        {
          id: 'gt3-t2',
          name: 'Team workflows',
          concepts: [
            {
              id: 'gt3-t2-c0',
              title: 'GitHub flow and trunk-based development',
              summary:
                'GitHub flow uses short-lived feature branches merged into main via pull requests; trunk-based development takes that further with tiny, frequently integrated changes.',
              explanation:
                'GitHub flow is a lightweight, popular model: main is always deployable, you create a short-lived branch for each change, open a pull request, review and merge it, then deploy. It suits teams that release continuously and rely on CI to keep main healthy. Trunk-based development pushes the same idea to its limit: developers integrate small changes into the trunk (main) at least daily, keeping branches very short-lived or working directly on main behind feature flags. The goal is to avoid long-lived branches that drift and cause big, painful merges. Both models favour continuous integration and fast feedback, and both keep main releasable. They differ mainly in branch lifetime and integration frequency — trunk-based is stricter about merging often and keeping changes small.',
              keyPoints: [
                'GitHub flow: short-lived feature branches, PR review, merge to a deployable main.',
                'Trunk-based: integrate tiny changes into main very frequently, often daily.',
                'Both rely on strong CI and keep main releasable.',
                'Short-lived branches avoid the drift and big merges of long-lived ones.',
              ],
              diagram: {
                type: 'mermaid',
                lines: [
                  'gitGraph',
                  '  commit',
                  '  branch feature',
                  '  checkout feature',
                  '  commit',
                  '  checkout main',
                  '  merge feature',
                  '  commit',
                ],
                caption: 'GitHub flow: branch off a deployable main, do focused work, merge back via a pull request.',
              },
              exercises: [
                {
                  type: 'quiz',
                  prompt: 'What invariant does GitHub flow keep true about the main branch?',
                  solution: { explanation: 'main is always deployable. Work happens on short-lived branches merged in via reviewed pull requests.' },
                },
                {
                  type: 'quiz',
                  prompt: 'What core practice distinguishes trunk-based development?',
                  solution: {
                    explanation:
                      'Integrating small changes into the trunk (main) very frequently — at least daily — with very short-lived or no branches, often using feature flags to hide unfinished work.',
                  },
                },
              ],
              docs: 'https://docs.github.com/en/get-started/using-github/github-flow',
            },
            {
              id: 'gt3-t2-c1',
              title: 'Gitflow and the forking workflow',
              summary:
                'Gitflow is a structured branching model with long-lived develop and release branches; the forking workflow centres on per-contributor forks and is the norm for open source.',
              explanation:
                'Gitflow defines named branches for each purpose: main holds production releases, develop is the integration branch, feature branches branch off develop, release branches stabilize a version, and hotfix branches patch production directly. It brings order to projects with scheduled, versioned releases, but its multiple long-lived branches add overhead and can slow continuous delivery, so many modern teams have moved to simpler flows. The forking workflow, by contrast, gives every contributor their own server-side fork; they push to their fork and propose changes via pull requests to the canonical repository. No one needs write access to the main repo, which is why it is the standard for large open-source projects with untrusted contributors. Choosing a workflow is about matching ceremony to your release cadence and trust model.',
              analogy:
                'Gitflow is a formal assembly line with dedicated stations for development, staging and shipping. The forking workflow is a suggestion box where anyone can draft a proposal in their own copy and submit it for approval.',
              keyPoints: [
                'Gitflow: main, develop, plus feature, release and hotfix branches for versioned releases.',
                'Gitflow adds structure but also overhead from long-lived branches.',
                'Forking workflow: each contributor works in their own fork and sends PRs.',
                'Forking is the norm for open source because it needs no write access.',
              ],
              exercises: [
                {
                  type: 'quiz',
                  prompt: 'In Gitflow, which branch is the ongoing integration branch that feature branches start from?',
                  hint: 'It is not main.',
                  solution: { explanation: 'develop. Feature branches branch off develop and merge back into it; main holds only released, production versions.' },
                },
                {
                  type: 'quiz',
                  prompt: 'Why is the forking workflow the standard for large open-source projects?',
                  solution: {
                    explanation:
                      'It requires no write access to the main repository — contributors work in their own forks and propose changes via pull requests, so maintainers stay in control of what merges.',
                  },
                },
              ],
              docs: 'https://docs.github.com/en/get-started/using-github/github-flow',
            },
            {
              id: 'gt3-t2-c2',
              title: 'Choosing the right workflow',
              summary:
                'Match the workflow to your team size, release cadence and trust model: simpler flows for fast continuous delivery, more structure for scheduled releases or untrusted contributors.',
              explanation:
                'There is no single best workflow — the right choice depends on context. Small teams shipping continuously usually thrive with GitHub flow or trunk-based development, because minimal ceremony and frequent integration give the fastest feedback and the fewest painful merges. Projects with scheduled, versioned releases and multiple maintained versions may benefit from Gitflow structure, accepting its overhead for clearer release management. Open-source or any setting with untrusted external contributors needs the forking workflow so no one gains write access by default. Key questions to ask: How often do we release? Do we maintain several versions at once? How much do we trust contributors? Do we have solid CI? Whatever you pick, keep branches short-lived, integrate often, and protect important branches — those principles matter more than the label.',
              keyPoints: [
                'Continuous delivery, small team: GitHub flow or trunk-based.',
                'Scheduled, versioned releases: Gitflow structure may pay off.',
                'Untrusted external contributors: forking workflow.',
                'Regardless of model: short-lived branches, frequent integration, protected branches.',
              ],
              exercises: [
                {
                  type: 'predict',
                  prompt: 'A small startup deploys several times a day with strong CI. Which workflow fits best, and why?',
                  solution: {
                    explanation:
                      'GitHub flow or trunk-based development. They minimize ceremony, keep main deployable, and integrate small changes frequently, which suits fast continuous delivery with good CI.',
                  },
                },
                {
                  type: 'quiz',
                  prompt: 'Which workflow consideration matters most when accepting contributions from strangers?',
                  solution: { explanation: 'Trust and access. The forking workflow lets strangers contribute via pull requests without any write access to the canonical repository.' },
                },
              ],
              docs: 'https://docs.github.com/en/get-started/using-github/github-flow',
            },
          ],
        },
      ],
    },
    /* ───────────────────── LEVEL 4 — FIXING & REWRITING HISTORY ───────────────────── */
    {
      level: 4,
      name: 'Fixing and rewriting history',
      focus: 'Undoing changes safely, rescuing lost work, and managing tags and releases',
      accent: '#f05133',
      soft: '#fdeae6',
      topics: [
        {
          id: 'gt4-t0',
          name: 'Undoing changes',
          concepts: [
            {
              id: 'gt4-t0-c0',
              title: 'restore: discarding working-tree and staged changes',
              summary:
                'git restore is the modern, focused command for throwing away uncommitted changes in the working tree or unstaging files.',
              explanation:
                'git restore was introduced to take over the file-restoring jobs that git checkout used to do confusingly. git restore <file> discards uncommitted changes in the working tree, reverting the file to its last committed state — this is destructive for those edits, so use it deliberately. git restore --staged <file> does the opposite kind of undo: it unstages a file, moving it back from the staging area to merely modified, without changing its contents. You can combine them, and you can restore a file as it was at a specific commit with git restore --source=<commit> <file>. Because restore only touches files (never branches or commits), it is safer and clearer than the old overloaded checkout. Remember: discarding working-tree changes with restore cannot be undone, since those edits were never committed.',
              keyPoints: [
                'git restore <file> discards uncommitted working-tree changes (destructive).',
                'git restore --staged <file> unstages without changing file contents.',
                'git restore --source=<commit> <file> recovers a file as it was at that commit.',
                'restore only affects files, making it safer than the old git checkout.',
              ],
              code: {
                language: 'bash',
                lines: [
                  'git restore src/app.js',
                  'git restore --staged config.json',
                  'git restore --source=HEAD~2 README.md',
                ],
                explanation: 'Discard edits to a file, unstage another, and recover a third as it existed two commits ago.',
              },
              commonMistakes: [
                'Running git restore <file> on changes you actually wanted — they are gone for good because they were never committed.',
              ],
              exercises: [
                {
                  type: 'task',
                  prompt: 'You staged styles.css by mistake. Unstage it without losing your edits.',
                  solution: {
                    lines: ['git restore --staged styles.css'],
                    explanation: '--staged moves the file out of the staging area back to modified; the file contents are untouched.',
                  },
                },
                {
                  type: 'predict',
                  prompt: 'You run git restore notes.txt on a file with uncommitted edits. Can you get those edits back?',
                  solution: {
                    explanation:
                      'No. The edits were never committed or stashed, so restoring the file to its last committed state discards them permanently.',
                  },
                },
              ],
              docs: 'https://git-scm.com/docs/git-restore',
            },
            {
              id: 'gt4-t0-c1',
              title: 'reset: soft, mixed and hard',
              summary:
                'git reset moves the current branch pointer to another commit; the --soft, --mixed and --hard modes decide what happens to the staging area and working tree.',
              explanation:
                'git reset rewinds (or moves) your branch to a chosen commit and comes in three flavours that differ in how much they also reset. --soft moves only the branch pointer, leaving the staging area and working tree intact — so the changes from the discarded commits become staged, ready to recommit. --mixed (the default) moves the pointer and resets the staging area but keeps the working tree, so changes become unstaged modifications. --hard moves the pointer and resets both staging and working tree to match the target commit, discarding all those changes — this is the destructive one. A classic use of git reset --soft HEAD~1 is to undo the last commit but keep its changes staged so you can redo it cleanly. Because reset can rewrite which commits a branch points to, avoid using it on shared branches, just like rebase.',
              analogy:
                'reset is a time machine for your branch pointer. --soft brings your work with you fully prepared, --mixed brings it loose in your hands, and --hard leaves it all behind in the timeline you abandoned.',
              keyPoints: [
                '--soft: move pointer only; changes stay staged.',
                '--mixed (default): move pointer and unstage; changes stay in working tree.',
                '--hard: move pointer and discard staged and working-tree changes (destructive).',
                'git reset --soft HEAD~1 undoes the last commit but keeps its changes staged.',
                'Do not reset shared branches — it rewrites history.',
              ],
              diagram: {
                type: 'mermaid',
                lines: [
                  'flowchart TD',
                  '  R[git reset target] --> S{Which mode}',
                  '  S -->|soft| K[Pointer moves, changes staged]',
                  '  S -->|mixed| M[Pointer moves, changes unstaged]',
                  '  S -->|hard| H[Pointer moves, changes discarded]',
                ],
                caption: 'The three reset modes differ only in what they do to staging and the working tree.',
              },
              code: {
                language: 'bash',
                lines: [
                  'git reset --soft HEAD~1',
                  'git reset HEAD~1',
                  'git reset --hard HEAD~1',
                ],
                explanation: 'Undo the last commit keeping changes staged, then the default keeping them unstaged, then discarding them entirely.',
              },
              commonMistakes: [
                'Using git reset --hard and losing uncommitted work you needed — there is no undo for the working tree.',
                'Resetting a branch others have pulled, rewriting shared history.',
              ],
              exercises: [
                {
                  type: 'quiz',
                  prompt: 'Which reset mode keeps the discarded commit changes in the staging area, ready to recommit?',
                  solution: { explanation: '--soft. It moves the branch pointer but leaves the staging area and working tree intact, so the changes remain staged.' },
                },
                {
                  type: 'predict',
                  prompt: 'You run git reset --hard HEAD~3 with uncommitted edits in your working tree. What happens to those edits?',
                  solution: {
                    explanation:
                      'They are discarded. --hard resets the working tree to the target commit, wiping uncommitted changes along with the last three commits from this branch.',
                  },
                },
              ],
              docs: 'https://git-scm.com/docs/git-reset',
            },
            {
              id: 'gt4-t0-c2',
              title: 'revert: the safe undo for shared history',
              summary:
                'git revert creates a new commit that undoes the changes of an earlier commit, making it the safe way to undo work that has already been shared.',
              explanation:
                'Unlike reset, which rewrites history by moving the branch pointer, git revert undoes a commit by adding a new commit that applies the inverse of its changes. The original commit stays in history; a fresh commit on top cancels its effect. This is exactly what you want on shared branches like main, because it does not rewrite anything others have based work on — everyone simply pulls the new revert commit. You can revert a single commit (git revert <hash>) or a range. If the revert touches lines that have since changed, you may need to resolve conflicts just like a merge. The rule of thumb: use reset to undo local, unshared mistakes, and use revert to undo commits that are already public.',
              analogy:
                'reset erases pages from the book; revert leaves the original page in place and adds a new page saying ignore the previous instruction. Public readers stay in sync because nothing was removed.',
              keyPoints: [
                'git revert adds a new commit that inverts an earlier commit changes.',
                'It does not rewrite history, so it is safe on shared branches.',
                'The original commit remains in the log.',
                'Use revert for public commits; use reset for local, unshared ones.',
              ],
              diagram: {
                type: 'mermaid',
                lines: [
                  'gitGraph',
                  '  commit id: \'A\'',
                  '  commit id: \'B bug\'',
                  '  commit id: \'C\'',
                  '  commit id: \'Revert B\'',
                ],
                caption: 'Reverting commit B adds a new commit that cancels its changes, leaving the original history intact.',
              },
              code: {
                language: 'bash',
                lines: [
                  'git revert a1b2c3d',
                  'git log --oneline',
                ],
                explanation: 'Create a new commit undoing the changes of a1b2c3d, then view the history showing both the original and the revert.',
              },
              exercises: [
                {
                  type: 'quiz',
                  prompt: 'Why is git revert preferred over git reset for undoing a commit that is already on the shared main branch?',
                  hint: 'Think about what each does to history.',
                  solution: {
                    explanation:
                      'revert adds a new inverse commit without rewriting history, so teammates just pull it. reset would rewrite the branch pointer, breaking everyone who already has the commit.',
                  },
                },
                {
                  type: 'task',
                  prompt: 'Safely undo the changes introduced by commit f00ba12 on a branch others have pulled.',
                  solution: {
                    lines: ['git revert f00ba12'],
                    explanation: 'This creates a new commit that reverses f00ba12 changes without altering existing history.',
                  },
                },
              ],
              docs: 'https://git-scm.com/docs/git-revert',
            },
            {
              id: 'gt4-t0-c3',
              title: 'amend: fixing the last commit',
              summary:
                'git commit --amend replaces the most recent commit, letting you fix its message or include forgotten changes — but it rewrites that commit.',
              explanation:
                'Sometimes you commit and immediately notice a typo in the message or a file you forgot to include. git commit --amend lets you redo the last commit: with nothing staged you can just edit the message, and with new changes staged those get folded into the previous commit. Crucially, amend does not edit the commit in place — it creates a brand-new commit with a new hash that replaces the old one. That means the same golden rule applies: amending a commit you have already pushed and shared rewrites history, so only amend commits that are still local. To amend just the message use git commit --amend -m, and to keep the existing message while adding staged changes use --no-edit. Amend is the cleanest fix for last-second mistakes on unshared commits.',
              keyPoints: [
                'git commit --amend replaces the most recent commit.',
                'With staged changes, it folds them into that commit; otherwise it edits the message.',
                'It produces a new hash — it rewrites the commit, not edits it in place.',
                'Only amend commits you have not yet pushed/shared.',
              ],
              code: {
                language: 'bash',
                lines: [
                  'git commit --amend -m \'Fix typo in error message\'',
                  'git add forgotten-file.js',
                  'git commit --amend --no-edit',
                ],
                explanation: 'First reword the last commit, then stage a forgotten file and fold it into the last commit while keeping the message.',
              },
              commonMistakes: [
                'Amending a commit that was already pushed, then needing a force-push that disrupts teammates.',
              ],
              exercises: [
                {
                  type: 'task',
                  prompt: 'You forgot to include utils.js in your last (unpushed) commit. Add it to that commit without changing the message.',
                  solution: {
                    lines: [
                      'git add utils.js',
                      'git commit --amend --no-edit',
                    ],
                    explanation: 'Stage the file, then amend with --no-edit so it joins the previous commit while keeping the original message.',
                  },
                },
                {
                  type: 'quiz',
                  prompt: 'Does git commit --amend edit the existing commit in place?',
                  solution: { explanation: 'No. It creates a new commit with a new hash that replaces the old one, which is why amending shared commits rewrites history.' },
                },
              ],
              docs: 'https://git-scm.com/docs/git-commit',
            },
          ],
        },
        {
          id: 'gt4-t1',
          name: 'Rescue and transplant',
          concepts: [
            {
              id: 'gt4-t1-c0',
              title: 'stash: shelving work in progress',
              summary:
                'git stash temporarily saves uncommitted changes and reverts your working tree to clean, so you can switch tasks and restore the changes later.',
              explanation:
                'You are mid-change when an urgent fix on another branch comes in, but your work is not ready to commit. git stash takes your uncommitted changes (staged and unstaged), records them on a stack, and resets your working tree to the last commit so it is clean to switch branches. Later you reapply them with git stash pop (which applies and removes the top stash) or git stash apply (which applies but keeps it). You can stash multiple times, list them with git stash list, and label one with git stash push -m \'message\'. By default stash ignores untracked files; add -u to include them. Stash is perfect for short context switches, but it is not a substitute for committing — long-lived stashes are easy to forget and lose. Reapplying can produce conflicts, which you resolve like any merge.',
              analogy:
                'A stash is like sweeping your half-finished work into a labelled drawer so the desk is clear for an urgent job, then pulling the drawer open again to resume exactly where you left off.',
              keyPoints: [
                'git stash shelves uncommitted changes and cleans the working tree.',
                'git stash pop reapplies and removes the top stash; apply keeps it.',
                'git stash list shows the stack; -m names an entry.',
                'Add -u to include untracked files; stash is for short context switches, not storage.',
              ],
              code: {
                language: 'bash',
                lines: [
                  'git stash push -m \'wip dashboard layout\'',
                  'git switch hotfix',
                  '# fix and commit the urgent issue',
                  'git switch feature',
                  'git stash pop',
                ],
                explanation: 'Shelve work with a label, switch to handle a hotfix, then return and pop the stash to resume.',
              },
              commonMistakes: [
                'Forgetting about old stashes — they are easy to lose track of and are not pushed to remotes.',
                'Expecting git stash to include untracked files by default; you need git stash -u for that.',
              ],
              exercises: [
                {
                  type: 'task',
                  prompt: 'Shelve all your current uncommitted changes with the label refactor and clean your working tree.',
                  solution: {
                    lines: ['git stash push -m \'refactor\''],
                    explanation: 'git stash push saves staged and unstaged changes under the given message and resets the working tree to clean.',
                  },
                },
                {
                  type: 'quiz',
                  prompt: 'What is the difference between git stash pop and git stash apply?',
                  solution: { explanation: 'pop reapplies the top stash and then removes it from the stack; apply reapplies it but leaves it on the stack.' },
                },
              ],
              docs: 'https://git-scm.com/docs/git-stash',
            },
            {
              id: 'gt4-t1-c1',
              title: 'cherry-pick: transplanting a single commit',
              summary:
                'git cherry-pick copies the changes of one specific commit and applies them as a new commit on your current branch.',
              explanation:
                'Sometimes you want just one commit from another branch — a bug fix that needs to go into a release branch, for example — without merging the whole branch. git cherry-pick <hash> takes the changes that commit introduced and reapplies them on top of your current branch as a new commit (with a new hash). You can cherry-pick several commits at once by listing them or giving a range. Because it reapplies changes, a cherry-pick can hit conflicts if the surrounding code differs, which you resolve as usual and then continue with git cherry-pick --continue. It is a precise, surgical tool, but overusing it leads to duplicated commits across branches that can complicate later merges, so prefer normal merging when you actually want the whole branch. Cherry-pick shines for hotfix backports and pulling a single useful change out of a larger branch.',
              analogy:
                'Cherry-picking is like copying one paragraph from one document into another, rather than merging the two documents wholesale.',
              keyPoints: [
                'git cherry-pick <hash> reapplies one commit changes onto the current branch.',
                'The new commit has a new hash; the original stays where it is.',
                'Conflicts are possible; resolve and run git cherry-pick --continue.',
                'Great for backporting a single fix; avoid overuse to prevent duplicate commits.',
              ],
              code: {
                language: 'bash',
                lines: [
                  'git switch release-1.2',
                  'git cherry-pick 9f8e7d6',
                ],
                explanation: 'Switch to the release branch and apply just the fix commit 9f8e7d6 there as a new commit.',
              },
              commonMistakes: [
                'Cherry-picking many commits across branches, creating duplicate-looking commits that complicate future merges.',
              ],
              exercises: [
                {
                  type: 'task',
                  prompt: 'Apply just the commit abc1234 from another branch onto your current branch.',
                  solution: {
                    lines: ['git cherry-pick abc1234'],
                    explanation: 'cherry-pick reapplies that single commit changes as a new commit on your current branch.',
                  },
                },
                {
                  type: 'predict',
                  prompt: 'You cherry-pick a commit, and the same logical fix now appears on two branches with different hashes. Why different hashes?',
                  solution: {
                    explanation:
                      'cherry-pick creates a new commit with a new parent and timestamp, so even though the change is the same, the hash differs from the original.',
                  },
                },
              ],
              docs: 'https://git-scm.com/docs/git-cherry-pick',
            },
            {
              id: 'gt4-t1-c2',
              title: 'reflog: recovering lost commits',
              summary:
                'git reflog records where HEAD has been, letting you find and recover commits that seem lost after a reset, rebase or branch deletion.',
              explanation:
                'The reflog is your safety net. Every time HEAD moves — a commit, checkout, reset, rebase or merge — Git logs the previous position in the reflog, which is local to your repository. So even when a commit appears lost (you ran git reset --hard, botched a rebase, or deleted a branch), the old commit usually still exists and the reflog still references it. Run git reflog to see a list like HEAD@{0}, HEAD@{1} with the actions that moved HEAD; find the hash of the state you want, then recover it with git checkout, git reset --hard <hash>, or by creating a branch at that hash. Reflog entries are kept for a while (typically 90 days for reachable, 30 for unreachable) before garbage collection. Knowing reflog exists turns many scary mistakes into a one-line recovery.',
              analogy:
                'The reflog is the security camera footage of your repository: even after something disappears from the shelves, the recording shows exactly where it was, so you can go fetch it.',
              keyPoints: [
                'reflog records every move of HEAD locally.',
                'It lets you recover commits lost to reset --hard, bad rebases or deleted branches.',
                'Find the hash in git reflog, then reset/checkout or branch to it.',
                'Entries persist for weeks before garbage collection, giving a recovery window.',
              ],
              code: {
                language: 'bash',
                lines: [
                  'git reflog',
                  'git reset --hard HEAD@{2}',
                  '# or recover into a new branch',
                  'git branch recovered 9f8e7d6',
                ],
                explanation: 'Inspect where HEAD has been, jump back to a previous state, or save a lost commit onto a new branch.',
              },
              exercises: [
                {
                  type: 'predict',
                  prompt: 'You ran git reset --hard and lost a commit you needed. Is it really gone?',
                  solution: {
                    explanation:
                      'Almost certainly not yet. The commit still exists and the reflog still references its previous HEAD position; find it with git reflog and recover it with reset or a new branch.',
                  },
                },
                {
                  type: 'task',
                  prompt: 'You deleted a branch and now want its last commit back. You see its hash 1a2b3c4 in the reflog. Recover it onto a new branch called rescue.',
                  solution: {
                    lines: ['git branch rescue 1a2b3c4'],
                    explanation: 'Creating a branch at the lost commit hash makes it reachable again, recovering the work.',
                  },
                },
              ],
              docs: 'https://git-scm.com/docs/git-reflog',
            },
          ],
        },
        {
          id: 'gt4-t2',
          name: 'Tags and releases',
          concepts: [
            {
              id: 'gt4-t2-c0',
              title: 'Lightweight vs annotated tags',
              summary:
                'Tags mark specific commits, typically releases; annotated tags store metadata and are recommended, while lightweight tags are just a name on a commit.',
              explanation:
                'A tag is a fixed label pointing at a particular commit, most often used to mark a release like v1.4.0. There are two kinds. A lightweight tag is simply a name pointing at a commit — no extra information. An annotated tag is a full Git object that stores the tagger name, email, date, a message, and can be GPG-signed; it is the recommended kind for releases because it carries provenance. You create an annotated tag with git tag -a v1.0.0 -m \'message\' and a lightweight one with just git tag v1.0.0. Tags are not pushed automatically — you push a specific tag with git push origin v1.0.0 or all of them with git push --tags. Unlike branches, tags do not move; they permanently mark a point in history, which is exactly what you want for releases.',
              keyPoints: [
                'A tag marks a specific commit, usually a release.',
                'Lightweight tag: just a name on a commit, no metadata.',
                'Annotated tag (-a): stores tagger, date, message and can be signed — recommended for releases.',
                'Tags are not pushed by default; use git push origin <tag> or --tags.',
              ],
              code: {
                language: 'bash',
                lines: [
                  'git tag -a v1.0.0 -m \'First stable release\'',
                  'git tag',
                  'git push origin v1.0.0',
                ],
                explanation: 'Create an annotated release tag, list tags, then push that tag to the remote since tags do not push automatically.',
              },
              commonMistakes: [
                'Creating a tag and forgetting to push it, so the release tag never appears on the remote.',
                'Using lightweight tags for releases and losing the author/date/message metadata.',
              ],
              exercises: [
                {
                  type: 'task',
                  prompt: 'Create an annotated tag v2.3.0 with the message Release 2.3.0 and push it to origin.',
                  solution: {
                    lines: [
                      'git tag -a v2.3.0 -m \'Release 2.3.0\'',
                      'git push origin v2.3.0',
                    ],
                    explanation: '-a makes it annotated with metadata; the separate push is required because tags are not pushed automatically.',
                  },
                },
                {
                  type: 'quiz',
                  prompt: 'Why are annotated tags recommended over lightweight tags for releases?',
                  solution: {
                    explanation:
                      'Annotated tags are full objects storing the tagger, date and a message (and can be signed), giving releases proper provenance, whereas lightweight tags carry no metadata.',
                  },
                },
              ],
              docs: 'https://git-scm.com/book/en/v2/Git-Basics-Tagging',
            },
            {
              id: 'gt4-t2-c1',
              title: 'Semantic versioning',
              summary:
                'Semantic versioning (SemVer) gives version numbers meaning: MAJOR.MINOR.PATCH, where each part signals the kind of change.',
              explanation:
                'Semantic versioning is the widely adopted convention for naming releases as MAJOR.MINOR.PATCH (for example 2.4.1). You increment MAJOR for incompatible, breaking changes; MINOR for new, backward-compatible functionality; and PATCH for backward-compatible bug fixes. This lets consumers of your software reason about upgrades at a glance: a patch bump should be safe, a minor bump adds features without breaking them, and a major bump may require code changes. Pre-release and build metadata can be appended (like 2.4.1-rc.1). In Git, you typically tag the release commit with the version, prefixed by v by convention (v2.4.1). Pairing SemVer tags with a changelog and GitHub releases makes your project history easy to navigate and your upgrades predictable for users and tooling alike.',
              analogy:
                'SemVer is like a nutrition label for a release: at a glance you know whether upgrading is a harmless tweak (patch), a helpful addition (minor), or something that changes the recipe and may upset your kitchen (major).',
              keyPoints: [
                'Format MAJOR.MINOR.PATCH, e.g. 2.4.1.',
                'MAJOR = breaking change; MINOR = backward-compatible feature; PATCH = backward-compatible fix.',
                'Pre-release/build metadata can be appended (e.g. -rc.1).',
                'Tag releases with the version, conventionally prefixed v (v2.4.1).',
              ],
              exercises: [
                {
                  type: 'quiz',
                  prompt: 'You add a new, fully backward-compatible feature. Which part of the version do you bump?',
                  hint: 'Backward-compatible new functionality.',
                  solution: { explanation: 'The MINOR version. For example 1.4.2 becomes 1.5.0 (and PATCH resets to 0).' },
                },
                {
                  type: 'predict',
                  prompt: 'A library jumps from 3.7.2 to 4.0.0. What should you assume before upgrading?',
                  solution: {
                    explanation:
                      'A MAJOR bump signals breaking changes, so you should expect incompatibilities and review the changelog/migration notes before upgrading.',
                  },
                },
              ],
              docs: 'https://docs.github.com/en/repositories/releasing-projects-on-github/about-releases',
            },
            {
              id: 'gt4-t2-c2',
              title: 'GitHub releases',
              summary:
                'GitHub releases turn a tag into a published release page with notes and downloadable assets, giving users a clear, versioned distribution point.',
              explanation:
                'A GitHub release is built on top of a Git tag but adds a user-facing page: a title, release notes (which GitHub can auto-generate from merged PRs), and optional attached binaries or build artifacts. You create one from the Releases section of the repository or with the GitHub CLI, choosing or creating the tag for the release commit. Releases give consumers a stable place to download a specific version and read what changed, and they integrate with automation — many CI pipelines build artifacts and attach them to the release when a version tag is pushed. Marking a release as a pre-release signals it is not production-ready. Combined with SemVer tags and a changelog, GitHub releases are how teams ship versioned software clearly. They complement, rather than replace, the underlying Git tag.',
              keyPoints: [
                'A release is a published page built on a Git tag.',
                'It includes a title, release notes (auto-generatable) and optional binary assets.',
                'Create one via the Releases UI or the gh CLI.',
                'CI often builds and attaches assets when a version tag is pushed.',
              ],
              code: {
                language: 'bash',
                lines: [
                  'gh release create v1.0.0 --title \'v1.0.0\' --notes \'First stable release\'',
                  'gh release upload v1.0.0 ./dist/app.zip',
                ],
                explanation: 'Use the GitHub CLI to create a release from a tag with notes, then attach a build artifact to it.',
              },
              exercises: [
                {
                  type: 'quiz',
                  prompt: 'What does a GitHub release add on top of a plain Git tag?',
                  solution: {
                    explanation:
                      'A published page with a title, release notes and optional downloadable assets, plus automation hooks — a user-facing distribution point that the bare tag does not provide.',
                  },
                },
                {
                  type: 'quiz',
                  prompt: 'How would you signal that a release is not yet production-ready?',
                  solution: { explanation: 'Mark it as a pre-release (and typically use a pre-release version like v2.0.0-rc.1) so users know it is for testing, not production.' },
                },
              ],
              docs: 'https://docs.github.com/en/repositories/releasing-projects-on-github/managing-releases-in-a-repository',
            },
          ],
        },
      ],
    },
    /* ───────────────────── LEVEL 5 — ADVANCED & PROFESSIONAL ───────────────────── */
    {
      level: 5,
      name: 'Advanced and professional',
      focus: 'Inspecting and debugging history, automation and configuration, and scaling best practices',
      accent: '#f05133',
      soft: '#fdeae6',
      topics: [
        {
          id: 'gt5-t0',
          name: 'Inspecting and debugging',
          concepts: [
            {
              id: 'gt5-t0-c0',
              title: 'blame: who changed this line',
              summary:
                'git blame annotates each line of a file with the commit, author and date that last changed it, helping you understand why code is the way it is.',
              explanation:
                'When you need to know why a line exists or who to ask about it, git blame <file> shows, for every line, the last commit that touched it along with the author and date. It is invaluable for archaeology — tracing a puzzling line back to the commit and message that introduced it. You can limit blame to a range of lines with -L, and follow code that moved within or between files using -M and -C so renames and copies do not break the trail. Despite the name, blame is about understanding, not assigning fault: the goal is context. On platforms like GitHub the same information appears in a friendly blame view in the browser. Combined with git show on the revealed commit, blame quickly answers what change introduced this behaviour and why.',
              analogy:
                'git blame is the margin notes in a shared manuscript: each line tells you which editor wrote it and when, so you know whom to ask about it.',
              keyPoints: [
                'git blame shows the last commit, author and date for each line.',
                '-L limits to specific lines; -M and -C follow moved or copied code.',
                'It is for understanding context, not assigning fault.',
                'Pair it with git show to read the full introducing commit.',
              ],
              code: {
                language: 'bash',
                lines: [
                  'git blame src/payment.js',
                  'git blame -L 40,60 src/payment.js',
                ],
                explanation: 'Annotate every line with its last change, then narrow the view to lines 40 through 60.',
              },
              exercises: [
                {
                  type: 'task',
                  prompt: 'Find out which commit last modified lines 10 to 20 of config.js.',
                  solution: {
                    lines: ['git blame -L 10,20 config.js'],
                    explanation: '-L restricts blame to the given line range, showing the responsible commit for each.',
                  },
                },
                {
                  type: 'quiz',
                  prompt: 'After git blame reveals a commit hash for a confusing line, how do you read the full reasoning behind that change?',
                  solution: { explanation: 'Run git show <hash> to see that commit message and the complete diff it introduced.' },
                },
              ],
              docs: 'https://git-scm.com/docs/git-blame',
            },
            {
              id: 'gt5-t0-c1',
              title: 'bisect: binary search for a bad commit',
              summary:
                'git bisect performs a binary search through history to pinpoint the exact commit that introduced a bug, testing far fewer commits than checking each one.',
              explanation:
                'When a bug appeared sometime in the last hundreds of commits but you do not know where, git bisect finds it efficiently. You start with git bisect start, mark a known-bad commit (often HEAD) with git bisect bad, and a known-good earlier commit with git bisect good <hash>. Git then checks out a commit halfway between them and asks you to test it; you tell it git bisect good or git bisect bad, and it halves the remaining range each time. In about log2(N) steps it identifies the first bad commit. When done, run git bisect reset to return to where you started. You can even automate it: git bisect run <test-command> lets Git run your test script at each step and decide good or bad itself, finding the culprit with no manual testing. It turns a needle-in-a-haystack search into a handful of checks.',
              analogy:
                'Bisect is the guess-the-number game played optimally: instead of trying every value, you always split the range in half, so a thousand possibilities collapse to about ten questions.',
              keyPoints: [
                'git bisect binary-searches history for the first bad commit.',
                'Mark endpoints: git bisect bad and git bisect good <hash>.',
                'Test each midpoint and answer good/bad until Git finds the culprit.',
                'git bisect run <cmd> automates testing; git bisect reset ends the session.',
              ],
              code: {
                language: 'bash',
                lines: [
                  'git bisect start',
                  'git bisect bad',
                  'git bisect good v1.2.0',
                  'git bisect run npm test',
                  'git bisect reset',
                ],
                explanation: 'Start a bisect, mark current as bad and v1.2.0 as good, let the test suite decide at each step, then reset.',
              },
              exercises: [
                {
                  type: 'quiz',
                  prompt: 'Roughly how many commits must you test with bisect to find a bad commit among 1000?',
                  hint: 'It is a binary search.',
                  solution: { explanation: 'About 10 (log2 of 1000), because each test halves the remaining range.' },
                },
                {
                  type: 'task',
                  prompt: 'Begin a bisect marking the current commit as bad and the tag v3.0 as the last known good one.',
                  solution: {
                    lines: [
                      'git bisect start',
                      'git bisect bad',
                      'git bisect good v3.0',
                    ],
                    explanation: 'This brackets the search; Git then checks out midpoints for you to test until it isolates the first bad commit.',
                  },
                },
              ],
              docs: 'https://git-scm.com/docs/git-bisect',
            },
            {
              id: 'gt5-t0-c2',
              title: 'Searching history and advanced log filtering',
              summary:
                'Beyond basic log, Git can search the actual content changes across history (git log -S and -G) and grep the working tree, making code archaeology powerful.',
              explanation:
                'To find when a piece of code or a string entered or left the codebase, use the pickaxe: git log -S\'someString\' lists commits where the number of occurrences of that string changed, which is perfect for tracking down when a function or constant was added or removed. git log -G\'regex\' is similar but matches the diff text against a regular expression. Combine these with --oneline and a path to focus the search. For searching the current files (not history) use git grep <pattern>, which is fast and respects your repository. You can also filter the log richly: by author, date range, message (--grep), and merges only (--merges) or non-merges (--no-merges). Mastering these turns Git history into a searchable knowledge base rather than an opaque list of commits.',
              keyPoints: [
                'git log -S\'text\' (pickaxe) finds commits where that text count changed.',
                'git log -G\'regex\' matches the diff against a regular expression.',
                'git grep searches the current working tree quickly.',
                'Filter logs with --grep, --author, --since, --merges/--no-merges.',
              ],
              code: {
                language: 'bash',
                lines: [
                  'git log -S\'calculateTax\' --oneline',
                  'git log -G\'TODO|FIXME\' --oneline',
                  'git grep -n \'apiKey\'',
                ],
                explanation: 'Find commits that added or removed a function, find diffs matching a pattern, and locate a string in current files with line numbers.',
              },
              exercises: [
                {
                  type: 'task',
                  prompt: 'Find every commit where the string getUserToken was added or removed.',
                  solution: {
                    lines: ['git log -S\'getUserToken\' --oneline'],
                    explanation: 'The -S pickaxe lists commits where the occurrence count of that string changed — i.e. where it was introduced or deleted.',
                  },
                },
                {
                  type: 'quiz',
                  prompt: 'What is the difference between git grep and git log -S?',
                  solution: {
                    explanation:
                      'git grep searches the current working tree for a pattern; git log -S searches history for commits where the count of that text changed.',
                  },
                },
              ],
              docs: 'https://git-scm.com/docs/git-log',
            },
          ],
        },
        {
          id: 'gt5-t1',
          name: 'Automation and configuration',
          concepts: [
            {
              id: 'gt5-t1-c0',
              title: 'Git hooks',
              summary:
                'Git hooks are scripts Git runs automatically at certain points — like before a commit or push — letting you enforce checks and automate tasks.',
              explanation:
                'Hooks are executable scripts in the .git/hooks directory that Git triggers at lifecycle events. Client-side hooks include pre-commit (runs before a commit is created — ideal for linting or running fast tests), commit-msg (validates the commit message format), and pre-push (runs before pushing — good for running the test suite). Server-side hooks like pre-receive can enforce policies on a central repo. Because hooks in .git are local and not committed, teams use tools such as Husky (for Node projects) or pre-commit to share and install hooks via the repository. A pre-commit hook that aborts on lint errors is one of the most effective ways to keep bad code out of history. Hooks exit non-zero to abort the action, so they act as gates as well as automation.',
              analogy:
                'Hooks are like automatic quality-control stations on an assembly line: at each checkpoint a robot inspects the work and can halt the line if something is wrong, with no human having to remember to check.',
              keyPoints: [
                'Hooks are scripts run at events like pre-commit, commit-msg and pre-push.',
                'A non-zero exit aborts the action, so hooks act as gates.',
                'They live in .git/hooks and are local — not committed by default.',
                'Tools like Husky or pre-commit share and install hooks across a team.',
              ],
              code: {
                language: 'bash',
                lines: [
                  '#!/bin/sh',
                  '# .git/hooks/pre-commit',
                  'npm run lint || exit 1',
                ],
                explanation: 'A pre-commit hook that runs the linter and aborts the commit (exit 1) if it fails.',
              },
              commonMistakes: [
                'Assuming hooks are shared automatically — they live under .git and need a tool like Husky to distribute to the team.',
                'Forgetting to make the hook script executable, so Git silently skips it.',
              ],
              exercises: [
                {
                  type: 'quiz',
                  prompt: 'Which hook would you use to run a linter and block the commit if it fails?',
                  solution: { explanation: 'The pre-commit hook. If the script exits non-zero, Git aborts the commit.' },
                },
                {
                  type: 'quiz',
                  prompt: 'Why do teams use a tool like Husky instead of relying on .git/hooks directly?',
                  solution: {
                    explanation:
                      'Hooks under .git are not committed, so they are not shared. Husky stores hook configuration in the repo and installs the hooks for everyone, keeping the team consistent.',
                  },
                },
              ],
              docs: 'https://git-scm.com/docs/githooks',
            },
            {
              id: 'gt5-t1-c1',
              title: 'gitattributes and aliases',
              summary:
                'A .gitattributes file controls per-path behaviour like line endings and diff handling, while aliases give you short custom shortcuts for long Git commands.',
              explanation:
                'Two configuration tools make Git smoother. The .gitattributes file (committed to the repo) sets per-file rules: the most common is text=auto to normalize line endings so Windows and Unix collaborators stop generating spurious diffs, plus marking files binary or setting diff and merge drivers for specific types. Because it is committed, everyone gets consistent behaviour. Aliases, set with git config --global alias.<name>, turn long incantations into short commands — for example git config --global alias.lg \'log --oneline --graph --all\' lets you type git lg. You can alias anything, including shell commands by prefixing with an exclamation mark. Together, gitattributes ensures the repository behaves consistently for everyone, and aliases tailor the command line to your habits and reduce typos on the commands you run constantly.',
              keyPoints: [
                '.gitattributes is committed and sets per-path rules (line endings, binary, diff/merge drivers).',
                'text=auto normalizes line endings across platforms.',
                'Aliases shorten long commands: git config --global alias.<name>.',
                'Prefix an alias with ! to run a shell command.',
              ],
              code: {
                language: 'bash',
                lines: [
                  '# .gitattributes',
                  '* text=auto',
                  '*.png binary',
                  '# create an alias',
                  'git config --global alias.lg \'log --oneline --graph --all\'',
                ],
                explanation: 'Normalize text line endings, mark PNGs as binary, and add a handy lg alias for a graphical log.',
              },
              exercises: [
                {
                  type: 'task',
                  prompt: 'Create a global alias st for git status.',
                  solution: {
                    lines: ['git config --global alias.st status'],
                    explanation: 'Now git st runs git status. Aliases are stored in your global config.',
                  },
                },
                {
                  type: 'quiz',
                  prompt: 'Which .gitattributes setting helps stop line-ending diffs between Windows and Unix contributors?',
                  solution: { explanation: 'text=auto (often * text=auto), which normalizes line endings so cross-platform edits do not create spurious whole-file diffs.' },
                },
              ],
              docs: 'https://git-scm.com/docs/gitattributes',
            },
            {
              id: 'gt5-t1-c2',
              title: 'Conventional commits and CI integration',
              summary:
                'Conventional Commits standardize commit messages so they can drive changelogs and version bumps, and Git events trigger CI pipelines that test and ship your code.',
              explanation:
                'Conventional Commits is a lightweight convention for commit messages: a type, optional scope, and description, like feat(auth): add OAuth login or fix: handle null user. Types such as feat, fix, docs, refactor and chore make history scannable, and tools can parse them to generate changelogs and decide the next semantic version automatically — a breaking change is flagged with a ! or a BREAKING CHANGE footer to trigger a major bump. On the automation side, pushing commits or opening a pull request triggers Continuous Integration: a service like GitHub Actions checks out your code, installs dependencies, runs linters and tests, and reports status back on the PR, blocking merges when checks fail (via branch protection). Together, structured commits plus CI turn your Git activity into an automated quality-and-release pipeline.',
              keyPoints: [
                'Conventional Commits: type(scope): description, e.g. feat(api): add pagination.',
                'Common types: feat, fix, docs, refactor, test, chore.',
                'Tools parse them to auto-generate changelogs and pick the next SemVer.',
                'Pushes and PRs trigger CI (e.g. GitHub Actions) that lints, tests and gates merges.',
              ],
              code: {
                language: 'bash',
                lines: [
                  'git commit -m \'feat(cart): add quantity selector\'',
                  'git commit -m \'fix: prevent crash on empty input\'',
                  'git commit -m \'refactor!: drop deprecated config option\'',
                ],
                explanation: 'A feature, a fix, and a breaking change (marked with !) written as conventional commit messages.',
              },
              exercises: [
                {
                  type: 'quiz',
                  prompt: 'In Conventional Commits, how do you signal a breaking change that should trigger a major version bump?',
                  hint: 'There is a symbol and a footer option.',
                  solution: { explanation: 'Add a ! after the type/scope (e.g. feat!: ...) or include a BREAKING CHANGE: footer in the message.' },
                },
                {
                  type: 'predict',
                  prompt: 'Your PR cannot be merged because a required check is red. What does that tell you about the repository setup?',
                  solution: {
                    explanation:
                      'CI runs on the PR and branch protection requires those status checks to pass before merging. You must fix the failing check (e.g. tests or lint) and push again.',
                  },
                },
              ],
              docs: 'https://docs.github.com/en/actions/learn-github-actions/understanding-github-actions',
            },
          ],
        },
        {
          id: 'gt5-t2',
          name: 'Scaling and best practices',
          concepts: [
            {
              id: 'gt5-t2-c0',
              title: 'Writing good commit messages and keeping history clean',
              summary:
                'A clear commit message explains why a change was made; clean history with small, focused commits makes a project far easier to maintain.',
              explanation:
                'Good commit messages are a gift to your future self and your teammates. The widely followed format is a short imperative subject line (about 50 characters, like Add retry logic to upload), a blank line, then a body that explains the why and any context the diff cannot show. Write the subject as a command (Fix, Add, Remove), not past tense. Beyond messages, keep history clean by making each commit one logical, self-contained change, avoiding noisy work-in-progress commits in shared history (squash them before merging), and not mixing unrelated changes. Clean history pays off when you read git log, run git bisect to find a bug, or git revert a single change — all of which assume commits are coherent. The diff shows what changed; a good message and clean history explain why and make the change reversible and understandable.',
              analogy:
                'A commit message is the caption under a photo: the photo (diff) shows what is there, but the caption tells you why it matters and what was happening — without it, future viewers are left guessing.',
              keyPoints: [
                'Subject: short, imperative, ~50 chars (Add..., Fix...); blank line; body explains why.',
                'One logical change per commit; do not mix unrelated work.',
                'Squash noisy WIP commits before merging to keep shared history clean.',
                'Clean, coherent commits make log, bisect and revert far more useful.',
              ],
              code: {
                language: 'bash',
                lines: [
                  'git commit -m \'Add retry with backoff to S3 uploads\' -m \'Network blips caused failed uploads; retry three times with exponential backoff.\'',
                ],
                explanation: 'Two -m flags create a concise imperative subject plus a body paragraph explaining the why behind the change.',
              },
              commonMistakes: [
                'Vague messages like update or fix stuff that tell future readers nothing.',
                'Bundling unrelated changes into one commit, which makes reverting or bisecting hard.',
              ],
              exercises: [
                {
                  type: 'quiz',
                  prompt: 'What should the body of a commit message focus on that the diff itself cannot convey?',
                  solution: { explanation: 'The why — the reasoning, context and intent behind the change. The diff already shows the what.' },
                },
                {
                  type: 'quiz',
                  prompt: 'Why is one logical change per commit valuable for tools like git bisect and git revert?',
                  solution: {
                    explanation:
                      'Both work at commit granularity: bisect can isolate a single coherent change, and revert can cleanly undo one logical change without dragging in unrelated edits.',
                  },
                },
              ],
              docs: 'https://git-scm.com/book/en/v2/Distributed-Git-Contributing-to-a-Project',
            },
            {
              id: 'gt5-t2-c1',
              title: 'Monorepos vs polyrepos and submodules',
              summary:
                'A monorepo keeps many projects in one repository; polyrepos split them across many; submodules embed one repository inside another at a pinned commit.',
              explanation:
                'How you split code across repositories is an architectural decision. A monorepo holds many projects or packages in a single repository, making cross-project changes atomic and shared code easy to refactor, at the cost of needing tooling to manage scale (build caching, sparse checkouts). Polyrepos give each project its own repository with clear ownership and independent release cycles, but coordinating changes that span several repos is harder. When you genuinely need one repository to include another — say a shared library at a specific version — Git submodules let you embed a repo inside a parent at a pinned commit; the parent records which commit of the submodule it uses, and you run git submodule update --init to fetch them. Submodules are powerful but notoriously fiddly (people forget to init or update them), so consider package managers or subtree merges as alternatives before reaching for them.',
              keyPoints: [
                'Monorepo: many projects in one repo — atomic cross-project changes, needs scaling tooling.',
                'Polyrepo: one repo per project — clear ownership, harder cross-repo coordination.',
                'Submodules embed a repo inside another at a pinned commit.',
                'Run git submodule update --init to fetch submodules; they are powerful but error-prone.',
              ],
              code: {
                language: 'bash',
                lines: [
                  'git submodule add https://github.com/acme/shared-lib.git libs/shared',
                  'git submodule update --init --recursive',
                ],
                explanation: 'Add a submodule pinned to a commit, then initialize and fetch all submodules recursively.',
              },
              commonMistakes: [
                'Cloning a repo with submodules and forgetting git submodule update --init, leaving empty submodule folders.',
                'Treating submodules like normal subfolders and committing in the parent without updating the submodule pointer.',
              ],
              exercises: [
                {
                  type: 'quiz',
                  prompt: 'What does the parent repository record about a submodule?',
                  hint: 'Not the files themselves.',
                  solution: { explanation: 'It records the specific commit of the submodule it points to (a pinned reference), not a copy of the submodule files.' },
                },
                {
                  type: 'predict',
                  prompt: 'A teammate clones the project but the libs/shared folder is empty. What did they likely forget?',
                  solution: {
                    explanation:
                      'To initialize and fetch submodules. Running git submodule update --init --recursive populates the submodule contents.',
                  },
                },
              ],
              docs: 'https://git-scm.com/book/en/v2/Git-Tools-Submodules',
            },
            {
              id: 'gt5-t2-c2',
              title: 'Git LFS for large files',
              summary:
                'Git Large File Storage (LFS) stores big binary files outside the normal Git history, keeping the repository fast while still versioning large assets.',
              explanation:
                'Git is optimized for text and struggles with large binary files: because every clone holds the full history, committing big assets (videos, datasets, design files, compiled binaries) bloats the repo permanently, even after deletion, since old versions remain in history. Git LFS solves this by replacing those files in your Git history with small text pointers while storing the actual file contents on a separate LFS server, downloaded on demand. You install it, then tell it which paths to track with git lfs track \'*.psd\', which writes a rule into .gitattributes; from then on matching files are handled by LFS transparently as you add, commit and push. The result is a lean repository that clones quickly while still versioning large assets. The trade-off is an extra dependency and that LFS storage/bandwidth on hosts like GitHub may have quotas.',
              analogy:
                'Git LFS is like a coat check: instead of carrying bulky coats (big files) into every room, you leave a numbered ticket (a pointer) in the repo and pick up the actual coat from the cloakroom only when you need it.',
              keyPoints: [
                'Plain Git bloats permanently with large binaries because all history is kept everywhere.',
                'LFS stores big files externally and keeps small pointer files in Git.',
                'git lfs track \'*.ext\' records the rule in .gitattributes.',
                'Repos stay lean and clone fast; watch host LFS storage/bandwidth quotas.',
              ],
              code: {
                language: 'bash',
                lines: [
                  'git lfs install',
                  'git lfs track \'*.psd\'',
                  'git add .gitattributes design/banner.psd',
                  'git commit -m \'Track PSD assets with Git LFS\'',
                ],
                explanation: 'Enable LFS, track a file type (recorded in .gitattributes), then commit the attributes plus the large asset.',
              },
              commonMistakes: [
                'Committing large binaries before setting up LFS — they stay in history forever and must be purged with history-rewriting tools.',
                'Forgetting to commit the .gitattributes change, so teammates do not get the LFS tracking rules.',
              ],
              exercises: [
                {
                  type: 'task',
                  prompt: 'Start tracking all .mp4 files with Git LFS and record the rule.',
                  solution: {
                    lines: [
                      'git lfs track \'*.mp4\'',
                      'git add .gitattributes',
                      'git commit -m \'Track mp4 files with LFS\'',
                    ],
                    explanation: 'git lfs track writes the rule into .gitattributes, which you commit so the whole team uses LFS for those files.',
                  },
                },
                {
                  type: 'quiz',
                  prompt: 'What does Git actually store in history for an LFS-tracked file?',
                  solution: {
                    explanation:
                      'A small text pointer referencing the content stored on the LFS server, rather than the large file contents themselves.',
                  },
                },
              ],
              docs: 'https://docs.github.com/en/repositories/working-with-files/managing-large-files/about-git-large-file-storage',
            },
          ],
        },
      ],
    },
  ],
};

export default content;
