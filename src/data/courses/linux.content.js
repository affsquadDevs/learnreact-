// Linux — course content. Original explanations written for self-study; same schema as the other courses.
const content = {
  meta: {
    title: 'Linux and the Command Line: From Shell to Server',
    description:
      'A complete, hands-on path through Linux and the command line: what Linux is, how the shell and filesystem work, managing files and text, permissions, processes and packages, system administration with systemd and networking, and finally bash scripting, automation and hardening. Every concept comes with realistic commands and exercises.',
    schemaVersion: '1.0',
    status: 'complete',
  },
  levels: [
    /* ───────────────────── LEVEL 1 — FUNDAMENTALS ───────────────────── */
    {
      level: 1,
      name: 'Fundamentals',
      focus: 'What Linux is, the shell and terminal, and finding your way around the filesystem',
      accent: '#f59e0b',
      soft: '#fff4e0',
      topics: [
        {
          id: 'lx1-t0',
          name: 'What Linux is',
          concepts: [
            {
              id: 'lx1-t0-c0',
              title: 'The kernel versus the distribution',
              summary:
                'Strictly speaking, Linux is just the kernel — the core program that talks to hardware. A distribution bundles that kernel with everything else needed to make a usable operating system.',
              explanation:
                'The Linux kernel, started by Linus Torvalds in 1991, is the low-level software that manages the CPU, memory, devices and processes. On its own the kernel does nothing a user can interact with: it needs a shell, system utilities, libraries and applications. A distribution (or distro) packages the kernel together with the GNU userland tools, a package manager, an init system and default applications into a coherent product you can install. This is why many people call the whole system GNU/Linux — the GNU project supplies much of the userland. Different distros make different choices about defaults, release cadence and packaging, but they all share the same kernel lineage. When you run a command like ls or cp, you are usually using a GNU coreutils program, not the kernel directly.',
              analogy:
                'The kernel is the engine of a car. A distribution is the whole car built around that engine — wheels, seats, dashboard and paint — so you can actually drive somewhere.',
              keyPoints: [
                'Linux proper is only the kernel: it manages hardware, memory and processes.',
                'A distribution adds the userland (GNU tools), package manager, init system and apps.',
                'The combination is often called GNU/Linux because GNU supplies much of the userland.',
                'All distros share the same kernel but differ in defaults and packaging.',
              ],
              diagram: {
                type: 'mermaid',
                lines: [
                  'flowchart TD',
                  '  H[Hardware] --> K[Linux kernel]',
                  '  K --> U[GNU userland and libraries]',
                  '  U --> A[Applications]',
                  '  A --> User',
                ],
                caption: 'The kernel sits between hardware and the userland; a distribution bundles all the layers above the hardware.',
              },
              exercises: [
                {
                  type: 'quiz',
                  prompt: 'Is the program /bin/ls part of the Linux kernel?',
                  hint: 'Think about which project supplies everyday command-line tools.',
                  solution: {
                    explanation:
                      'No. ls is a userland utility from GNU coreutils. The kernel manages hardware and processes; ls is an ordinary program that asks the kernel to read a directory.',
                  },
                },
                {
                  type: 'quiz',
                  prompt: 'Why do many people say GNU/Linux instead of just Linux?',
                  solution: {
                    explanation:
                      'Because the kernel is Linux, but most of the surrounding userland tools (the shell utilities, compilers, libraries) come from the GNU project. The usable system is the combination of both.',
                  },
                },
                {
                  type: 'predict',
                  prompt: 'Two distros both ship kernel 6.x. Will the same C program compiled for one generally run on the other?',
                  solution: {
                    explanation:
                      'Usually yes for the same architecture, because they share the kernel ABI and similar libc. Differences arise from library versions and packaging, not the kernel interface itself.',
                  },
                },
              ],
              docs: 'https://www.kernel.org/',
            },
            {
              id: 'lx1-t0-c1',
              title: 'Open source and the freedom to study and change',
              summary:
                'Linux is free and open-source software, licensed under the GPL. Anyone can read, modify and redistribute the source, which is why it powers so much of the world.',
              explanation:
                'The Linux kernel is released under the GNU General Public License version 2 (GPLv2), a copyleft license. Copyleft means you may use, study, modify and redistribute the software, but if you distribute a modified version you must release your changes under the same license. This guarantees the code stays open for everyone downstream. Open development also means contributions come from individuals, universities and companies worldwide, reviewed in public. The practical effects are huge: there is no licensing fee, you can audit the code for security, and you are never locked into a single vendor. Most distributions are likewise built from open-source components, though some include optional proprietary drivers or firmware.',
              analogy:
                'A copyleft license is like a community recipe that everyone may improve, on one condition: if you share your improved dish, you must also share the updated recipe.',
              keyPoints: [
                'The kernel uses GPLv2, a copyleft open-source license.',
                'Copyleft requires distributed modifications to remain under the same license.',
                'Anyone can read, audit, modify and redistribute the source.',
                'No license fees and no single-vendor lock-in.',
              ],
              exercises: [
                {
                  type: 'quiz',
                  prompt: 'What obligation does GPLv2 place on someone who distributes a modified kernel?',
                  hint: 'It is the defining property of copyleft.',
                  solution: {
                    explanation:
                      'They must make their modified source available under the same GPLv2 license, so recipients have the same freedoms.',
                  },
                },
                {
                  type: 'quiz',
                  prompt: 'Does open source mean the software must be free of charge?',
                  solution: {
                    explanation:
                      'No. Open source is about the freedom to use, study and share the source code. You may charge money; what you cannot do is restrict those freedoms for downstream users.',
                  },
                },
              ],
              docs: 'https://www.gnu.org/licenses/old-licenses/gpl-2.0.html',
            },
            {
              id: 'lx1-t0-c2',
              title: 'Where Linux runs and popular distributions',
              summary:
                'Linux runs nearly everywhere: servers, the cloud, phones, routers, supercomputers and embedded devices. A handful of distribution families dominate.',
              explanation:
                'Linux is the most widely deployed operating system kernel on Earth. It powers the vast majority of web servers and cloud instances, every one of the world\'s fastest supercomputers, Android phones (Android is built on the Linux kernel), and countless embedded systems like routers, smart TVs and cars. For people learning the command line, the most relevant environments are servers and developer workstations. Distributions cluster into families. The Debian family (Debian, Ubuntu, Linux Mint) uses the apt package manager and .deb packages. The Red Hat family (RHEL, Fedora, CentOS Stream, Rocky, AlmaLinux) uses dnf and .rpm packages. Arch Linux uses pacman and a rolling-release model. SUSE uses zypper. Knowing your distro family tells you which package commands and conventions to expect.',
              keyPoints: [
                'Linux dominates servers, the cloud, supercomputers and embedded devices; Android is built on it.',
                'Debian family (Debian, Ubuntu, Mint) uses apt and .deb packages.',
                'Red Hat family (RHEL, Fedora, Rocky, Alma) uses dnf and .rpm packages.',
                'Arch uses pacman with rolling releases; SUSE uses zypper.',
                'Your distro family determines package commands and default conventions.',
              ],
              code: {
                language: 'bash',
                lines: [
                  '# Identify the distribution you are on',
                  'cat /etc/os-release',
                  '# Check the running kernel version',
                  'uname -r',
                  '# Full system and kernel summary',
                  'uname -a',
                ],
                explanation:
                  '/etc/os-release names the distro and version; uname reports the kernel. These are the first commands to run on an unfamiliar machine.',
              },
              exercises: [
                {
                  type: 'task',
                  prompt: 'Show the distribution name and version on the current machine.',
                  solution: {
                    lines: ['cat /etc/os-release'],
                    explanation:
                      'The file contains fields like NAME, VERSION and ID that identify the distribution in a machine-readable way.',
                  },
                },
                {
                  type: 'quiz',
                  prompt: 'A tutorial tells you to run apt install. Which distribution family is it written for?',
                  hint: 'apt is the package tool for one specific family.',
                  solution: {
                    explanation:
                      'The Debian family (Debian, Ubuntu, Mint). On a Red Hat system you would use dnf instead; on Arch, pacman.',
                  },
                },
                {
                  type: 'predict',
                  prompt: 'What will uname -r print on a typical modern server?',
                  solution: {
                    explanation:
                      'A kernel version string such as 6.8.0-31-generic. The exact numbers vary, but it identifies the running kernel release, not the distro version.',
                  },
                },
              ],
              docs: 'https://www.freedesktop.org/software/systemd/man/latest/os-release.html',
            },
          ],
        },
        {
          id: 'lx1-t1',
          name: 'The shell and terminal',
          concepts: [
            {
              id: 'lx1-t1-c0',
              title: 'What a shell is, and bash versus zsh',
              summary:
                'A shell is a program that reads the commands you type and asks the kernel to run them. The terminal is the window; the shell is the interpreter running inside it.',
              explanation:
                'People often blur terminal and shell, but they are different things. A terminal (or terminal emulator) is the application that draws text and captures your keystrokes. The shell is the command interpreter running inside it: it reads a line, parses it, expands wildcards and variables, finds the program, and asks the kernel to execute it. Bash (the Bourne Again SHell) is the long-standing default on most Linux distributions and the standard for scripts. Zsh is a popular interactive alternative with richer completion and theming, and it is the default on macOS. For everyday work the two feel similar; for portable scripting, bash is the safer target. You can see which shell you are running by inspecting the SHELL variable or the running process.',
              analogy:
                'The terminal is the telephone handset; the shell is the operator on the line who actually understands your requests and connects the calls.',
              keyPoints: [
                'A terminal draws text and reads keys; the shell interprets and runs commands.',
                'The shell expands variables and wildcards before launching programs.',
                'Bash is the common Linux default and the standard for scripting.',
                'Zsh is a feature-rich interactive shell, default on macOS.',
              ],
              diagram: {
                type: 'mermaid',
                lines: [
                  'flowchart LR',
                  '  You -->|keystrokes| T[Terminal emulator]',
                  '  T --> S[Shell such as bash]',
                  '  S -->|exec| K[Kernel]',
                  '  K -->|output| T',
                ],
                caption: 'You type into the terminal, the shell interprets, and the kernel runs the program; output flows back to the terminal.',
              },
              code: {
                language: 'bash',
                lines: [
                  '# Which shell is your login shell?',
                  'echo $SHELL',
                  '# Which shell is running right now?',
                  'ps -p $$ -o comm=',
                  '# List installed shells',
                  'cat /etc/shells',
                ],
                explanation:
                  '$SHELL holds your configured login shell; $$ is the current shell\'s process id, so ps -p $$ shows the shell actually running.',
              },
              commonMistakes: [
                'Assuming $SHELL always equals the shell you are typing into — it shows your login shell, which may differ if you started another shell manually.',
              ],
              exercises: [
                {
                  type: 'task',
                  prompt: 'Print the name of the shell process you are currently using.',
                  solution: {
                    lines: ['ps -p $$ -o comm='],
                    explanation:
                      '$$ expands to the PID of the current shell, and ps with comm= prints just the command name, e.g. bash or zsh.',
                  },
                },
                {
                  type: 'quiz',
                  prompt: 'What is the difference between a terminal and a shell?',
                  hint: 'One is a window, one is a program reading your commands.',
                  solution: {
                    explanation:
                      'The terminal is the application that displays text and captures input. The shell is the interpreter running inside it that parses and executes your commands.',
                  },
                },
                {
                  type: 'predict',
                  prompt: 'If you type echo $SHELL and get /bin/bash but you manually ran zsh earlier, which shell is interpreting the echo?',
                  solution: {
                    explanation:
                      'Zsh is interpreting it, because that is the running shell. $SHELL still shows /bin/bash because it reports your configured login shell, not the current process.',
                  },
                },
              ],
              docs: 'https://www.gnu.org/software/bash/manual/bash.html#What-is-a-shell_003f',
            },
            {
              id: 'lx1-t1-c1',
              title: 'Reading the prompt and the structure of a command',
              summary:
                'The prompt tells you who you are and where you are. A command is a program name followed by options and arguments, separated by spaces.',
              explanation:
                'A typical bash prompt looks like user@host:~$ — your username, the hostname, the current directory (~ means your home), and a final symbol. A $ usually means a regular user; a # means you are root (the superuser), a strong signal to be careful. After the prompt you type a command line, which the shell splits on whitespace into words. The first word is the command (a program or a shell builtin). The remaining words are options, which modify behaviour and usually start with a dash, and arguments, which are the things the command acts on. Short options are single letters like -l and can often be bundled (-la), while long options use two dashes like --all. Getting comfortable reading this structure makes every command predictable.',
              analogy:
                'A command line is a sentence: the command is the verb, options are adverbs that change how it acts, and arguments are the objects it acts upon.',
              keyPoints: [
                'The prompt shows user, host and current directory; $ is a normal user, # is root.',
                'The first word is the command; the rest are options and arguments.',
                'Options modify behaviour and usually begin with - or --.',
                'Short options can be combined, e.g. -la is the same as -l -a.',
              ],
              code: {
                language: 'bash',
                lines: [
                  '# command   options   argument',
                  'ls         -l -a     /var/log',
                  '# the same, with short options bundled',
                  'ls -la /var/log',
                  '# a long option spelled out',
                  'ls --all --human-readable /var/log',
                ],
                explanation:
                  'ls is the command, -l and -a are options (long forms --all etc.), and /var/log is the argument it lists.',
              },
              commonMistakes: [
                'Forgetting that arguments are separated by spaces, so a path containing a space must be quoted or escaped.',
              ],
              exercises: [
                {
                  type: 'quiz',
                  prompt: 'In the line cp -r src dest, which part is the command, which is the option, and which are arguments?',
                  solution: {
                    explanation:
                      'cp is the command, -r is the option (recursive), and src and dest are the arguments (source and destination).',
                  },
                },
                {
                  type: 'quiz',
                  prompt: 'Your prompt ends with # instead of $. What does that tell you?',
                  hint: 'It is about which user you are.',
                  solution: {
                    explanation:
                      'You are operating as root, the superuser. Commands run unrestricted, so take extra care.',
                  },
                },
                {
                  type: 'predict',
                  prompt: 'Is ls -la equivalent to ls -l -a?',
                  solution: {
                    explanation:
                      'Yes. Bundled short options are split into individual flags, so -la means the same as -l -a.',
                  },
                },
              ],
              docs: 'https://www.gnu.org/software/bash/manual/bash.html#Shell-Syntax',
            },
            {
              id: 'lx1-t1-c2',
              title: 'Getting help with --help, man and apropos',
              summary:
                'You never need to memorise every option. Built-in help, manual pages and keyword search let you look things up instantly.',
              explanation:
                'Linux is self-documenting if you know where to look. Most commands accept --help (or -h) to print a quick summary of usage and options. For full documentation, man opens the manual page, which has standard sections: NAME, SYNOPSIS, DESCRIPTION, OPTIONS, EXAMPLES and SEE ALSO. Inside man you scroll with the arrow keys or space, search with /word, and quit with q (it uses the less pager). Manual pages are organised in numbered sections, so man 5 crontab shows the file format while man 1 crontab shows the command; you specify the section number when names collide. If you do not know the command name, apropos searches manual descriptions by keyword, and many systems also ship tldr or info for friendlier or longer documentation.',
              analogy:
                'man pages are the reference manual that comes with an appliance, and apropos is the index in the back: you search the index when you do not yet know which page you need.',
              keyPoints: [
                'Add --help or -h for a quick option summary on most commands.',
                'man opens the full manual; navigate with arrows or space and quit with q.',
                'Inside man, search with /word and jump matches with n.',
                'Manual sections are numbered; man 5 name shows file formats, man 1 name shows commands.',
                'apropos keyword finds commands when you do not know the name.',
              ],
              code: {
                language: 'bash',
                lines: [
                  '# Quick usage summary',
                  'ls --help',
                  '# Full manual page',
                  'man ls',
                  '# A specific section when names collide',
                  'man 5 crontab',
                  '# Search manuals by keyword',
                  'apropos "list directory"',
                ],
                explanation:
                  '--help is fastest, man is complete, and apropos searches descriptions so you can discover commands you do not yet know by name.',
              },
              commonMistakes: [
                'Pressing Ctrl+C to leave a man page — it does nothing useful; press q to quit the pager.',
              ],
              exercises: [
                {
                  type: 'task',
                  prompt: 'Open the manual page that documents the format of the crontab file, not the crontab command.',
                  solution: {
                    lines: ['man 5 crontab'],
                    explanation:
                      'Section 5 of the manual covers file formats; section 1 covers user commands. The number disambiguates the two crontab pages.',
                  },
                },
                {
                  type: 'task',
                  prompt: 'Find any commands whose manual descriptions mention "compress".',
                  solution: {
                    lines: ['apropos compress'],
                    explanation:
                      'apropos searches the short descriptions in the manual database and lists matching commands with their sections.',
                  },
                },
                {
                  type: 'quiz',
                  prompt: 'You are inside a man page. How do you search forward for the word "size" and then quit?',
                  hint: 'man uses the less pager.',
                  solution: {
                    explanation:
                      'Type /size and press Enter to search, n to jump to the next match, and q to quit the pager.',
                  },
                },
              ],
              docs: 'https://man7.org/linux/man-pages/man1/man.1.html',
            },
          ],
        },
        {
          id: 'lx1-t2',
          name: 'Filesystem and navigation',
          concepts: [
            {
              id: 'lx1-t2-c0',
              title: 'The root tree and the Filesystem Hierarchy Standard',
              summary:
                'Linux has a single tree starting at / (root). The Filesystem Hierarchy Standard defines what lives in each top-level directory.',
              explanation:
                'Unlike Windows with its C: and D: drives, Linux presents one unified tree rooted at / (the root directory). Everything — every disk, every device, every file — hangs somewhere off that single root. The Filesystem Hierarchy Standard (FHS) gives the top-level directories consistent meanings across distributions. Key ones: /bin and /usr/bin hold programs; /etc holds system configuration files; /home holds users\' personal directories; /var holds variable data like logs and caches; /tmp holds temporary files; /dev holds device files; /proc and /sys expose kernel and process information as virtual files; /root is the superuser\'s home; and /boot holds the kernel and bootloader. Knowing this map means you can guess where something lives instead of searching blindly.',
              analogy:
                'The filesystem is a single filing cabinet, and the FHS is the agreed labelling scheme for its drawers, so anyone can find the configuration drawer or the logs drawer without asking.',
              keyPoints: [
                'There is one tree rooted at /, not separate drive letters.',
                '/etc is configuration, /home is user data, /var is logs and changing data.',
                '/bin and /usr/bin hold executables; /tmp holds temporary files.',
                '/dev, /proc and /sys are virtual filesystems exposing devices and kernel state.',
                'The FHS keeps these meanings consistent across distributions.',
              ],
              diagram: {
                type: 'mermaid',
                lines: [
                  'flowchart TD',
                  '  R[root] --> etc[etc config]',
                  '  R --> home[home users]',
                  '  R --> var[var logs and data]',
                  '  R --> usr[usr programs]',
                  '  R --> tmp[tmp temporary]',
                  '  R --> dev[dev devices]',
                ],
                caption: 'A simplified view of the Linux root tree and the role of common top-level directories.',
              },
              code: {
                language: 'bash',
                lines: [
                  '# List the top of the tree',
                  'ls /',
                  '# Configuration files live here',
                  'ls /etc',
                  '# System logs live here',
                  'ls /var/log',
                ],
                explanation:
                  'Listing / shows the standard top-level directories; /etc and /var/log are two of the most consulted as you administer a system.',
              },
              exercises: [
                {
                  type: 'quiz',
                  prompt: 'Where would you expect to find a service\'s configuration file and its log file?',
                  solution: {
                    explanation:
                      'Configuration under /etc (e.g. /etc/ssh/sshd_config) and logs under /var/log (e.g. /var/log/auth.log).',
                  },
                },
                {
                  type: 'quiz',
                  prompt: 'Why is there no C: drive on Linux?',
                  hint: 'Think about how many roots the tree has.',
                  solution: {
                    explanation:
                      'Linux uses a single unified tree rooted at /. Additional disks are mounted into directories within that tree rather than given separate drive letters.',
                  },
                },
                {
                  type: 'predict',
                  prompt: 'Files under /proc — are they ordinary files stored on a disk?',
                  solution: {
                    explanation:
                      'No. /proc is a virtual filesystem generated by the kernel in memory. Reading those files returns live process and kernel information, not data saved on disk.',
                  },
                },
              ],
              docs: 'https://refspecs.linuxfoundation.org/FHS_3.0/fhs/index.html',
            },
            {
              id: 'lx1-t2-c1',
              title: 'Absolute versus relative paths',
              summary:
                'An absolute path starts at / and is unambiguous from anywhere. A relative path is interpreted from your current directory.',
              explanation:
                'Every file is identified by a path. An absolute path begins with / and describes the full route from the root, so /var/log/syslog means the same thing no matter where you are. A relative path does not start with / and is resolved against your current working directory; if you are in /var, then log/syslog refers to /var/log/syslog. Two special names help: . refers to the current directory and .. refers to the parent directory, so ../config goes up one level then into config. The tilde ~ is expanded by the shell to your home directory, and ~user expands to another user\'s home. Choosing the right kind of path matters: absolute paths are safe in scripts and cron jobs where the working directory is uncertain, while relative paths are convenient for quick interactive work.',
              analogy:
                'An absolute path is a full postal address; a relative path is directions like two doors down on the left, which only make sense if you know where you are standing.',
              keyPoints: [
                'Absolute paths start with / and are the same from anywhere.',
                'Relative paths are resolved from the current working directory.',
                '. is the current directory and .. is the parent.',
                '~ expands to your home directory; ~user to another user\'s home.',
                'Prefer absolute paths in scripts and cron jobs.',
              ],
              code: {
                language: 'bash',
                lines: [
                  '# Absolute: works from anywhere',
                  'cat /etc/hostname',
                  '# Relative: depends on where you are',
                  'cd /var',
                  'cat log/syslog',
                  '# Go up one level then into another directory',
                  'cd ../tmp',
                  '# Jump to your home directory',
                  'cd ~',
                ],
                explanation:
                  'The same target /var/log/syslog can be reached absolutely or relatively; .. moves up and ~ jumps home.',
              },
              commonMistakes: [
                'Using a relative path in a cron job or script and being surprised it fails — the working directory there is often not what you expect.',
              ],
              exercises: [
                {
                  type: 'predict',
                  prompt: 'You are in /home/ana. What absolute path does the relative path ../bob/notes.txt refer to?',
                  solution: {
                    explanation:
                      '/home/bob/notes.txt. The .. goes up from /home/ana to /home, then into bob/notes.txt.',
                  },
                },
                {
                  type: 'task',
                  prompt: 'From any directory, display the contents of your home directory\'s .bashrc file using the tilde.',
                  solution: {
                    lines: ['cat ~/.bashrc'],
                    explanation:
                      'The shell expands ~ to your home directory, so this works regardless of your current location.',
                  },
                },
                {
                  type: 'quiz',
                  prompt: 'Why are absolute paths recommended inside scripts?',
                  hint: 'What can you not assume about the environment a script runs in?',
                  solution: {
                    explanation:
                      'You cannot assume the working directory. A relative path may resolve differently depending on where the script is invoked, while an absolute path is unambiguous.',
                  },
                },
              ],
              docs: 'https://www.gnu.org/software/coreutils/manual/html_node/Trailing-slashes.html',
            },
            {
              id: 'lx1-t2-c2',
              title: 'pwd, ls and cd, plus hidden files',
              summary:
                'Three commands cover most navigation: pwd shows where you are, ls lists contents, and cd moves you. Files beginning with a dot are hidden by default.',
              explanation:
                'pwd (print working directory) tells you your current location in the tree. ls lists the contents of a directory; common options are -l for a long, detailed listing, -a to include hidden entries, -h for human-readable sizes and -t to sort by modification time. cd (change directory) moves you around: cd /etc goes to an absolute path, cd .. goes up, cd with no argument returns home, and cd - returns to the previous directory. Files and directories whose names start with a dot, such as .bashrc or .config, are hidden: ordinary ls skips them, and you must pass -a to see them. This convention is not security; it simply keeps configuration clutter out of everyday listings. The long format from ls -l also reveals permissions, owner, size and timestamps, which you will rely on constantly.',
              analogy:
                'pwd is checking your current location on a map, ls is looking around the room you are in, and cd is walking to another room.',
              keyPoints: [
                'pwd prints your current working directory.',
                'ls -la gives a detailed listing including hidden dot-files.',
                'cd .. goes up, cd alone goes home, cd - returns to the previous directory.',
                'Names starting with a dot are hidden by convention, shown only with ls -a.',
                'ls -lh shows sizes in human-readable units like K, M and G.',
              ],
              code: {
                language: 'bash',
                lines: [
                  '# Where am I?',
                  'pwd',
                  '# Detailed listing including hidden files, human sizes',
                  'ls -lah',
                  '# Move around',
                  'cd /var/log',
                  'cd ..',
                  'cd -',
                ],
                explanation:
                  'pwd anchors you, ls -lah shows everything with sizes, and the cd variants move down, up, and back to where you were.',
              },
              commonMistakes: [
                'Thinking a directory is empty because ls shows nothing — it may contain only hidden dot-files; check with ls -a.',
              ],
              exercises: [
                {
                  type: 'task',
                  prompt: 'List every entry in the current directory, including hidden ones, with human-readable sizes.',
                  solution: {
                    lines: ['ls -lah'],
                    explanation:
                      '-l gives the long format, -a includes hidden dot-files, and -h prints sizes as K/M/G.',
                  },
                },
                {
                  type: 'predict',
                  prompt: 'You run cd /tmp, then cd /var, then cd -. Where do you end up?',
                  solution: {
                    explanation:
                      'Back in /tmp. cd - returns you to the previous working directory, which was /tmp before you moved to /var.',
                  },
                },
                {
                  type: 'quiz',
                  prompt: 'Why does plain ls not show your .bashrc file?',
                  hint: 'Look at the first character of the name.',
                  solution: {
                    explanation:
                      'Its name starts with a dot, so it is hidden by convention. Use ls -a to include hidden entries.',
                  },
                },
              ],
              docs: 'https://www.gnu.org/software/coreutils/manual/html_node/ls-invocation.html',
            },
          ],
        },
      ],
    },
    /* ───────────────────── LEVEL 2 — FILES & TEXT ───────────────────── */
    {
      level: 2,
      name: 'Files and text',
      focus: 'Creating and managing files, viewing and editing text, and chaining tools with pipes',
      accent: '#f59e0b',
      soft: '#fff4e0',
      topics: [
        {
          id: 'lx2-t0',
          name: 'Managing files and directories',
          concepts: [
            {
              id: 'lx2-t0-c0',
              title: 'Creating, copying, moving and removing',
              summary:
                'A small set of commands creates and rearranges files: mkdir, touch, cp, mv and rm. Understanding their options prevents costly mistakes.',
              explanation:
                'mkdir makes directories, and mkdir -p makes a whole chain of nested directories at once without complaining if they already exist. touch creates an empty file or, if it exists, updates its timestamp. cp copies files; copying a directory needs cp -r (recursive), and cp -i prompts before overwriting. mv both moves and renames — there is no separate rename command — so mv old.txt new.txt renames in place while mv file.txt /tmp/ moves it. rm deletes, rm -r deletes directories recursively, and rm -f forces deletion without prompts. Linux has no recycle bin: rm is permanent. The combination rm -rf is powerful and dangerous, so always double-check the target before running it, especially when paths involve variables or wildcards.',
              analogy:
                'These commands are your moving crew: mkdir builds rooms, touch lays down empty boxes, cp duplicates boxes, mv carries them elsewhere, and rm throws them out — with no chance to fish them back out of the bin.',
              keyPoints: [
                'mkdir -p creates nested directories and ignores existing ones.',
                'cp -r copies directories; cp -i prompts before overwriting.',
                'mv both moves and renames; there is no separate rename command.',
                'rm is permanent — there is no recycle bin; rm -r removes directories.',
                'rm -rf is irreversible; verify the target carefully first.',
              ],
              code: {
                language: 'bash',
                lines: [
                  '# Create a nested directory tree',
                  'mkdir -p project/src/utils',
                  '# Create an empty file',
                  'touch project/README.md',
                  '# Copy a directory and its contents',
                  'cp -r project project-backup',
                  '# Rename a file',
                  'mv project/README.md project/README.txt',
                  '# Remove a directory tree (be careful)',
                  'rm -r project-backup',
                ],
                explanation:
                  'mkdir -p builds the whole path, touch makes the file, cp -r duplicates the tree, mv renames, and rm -r deletes recursively.',
              },
              commonMistakes: [
                'Running rm -rf with an unquoted variable or trailing wildcard that expands to something unexpected, deleting far more than intended.',
              ],
              exercises: [
                {
                  type: 'task',
                  prompt: 'Create the directory path logs/2026/06 in one command, even though none of those directories exist yet.',
                  solution: {
                    lines: ['mkdir -p logs/2026/06'],
                    explanation:
                      'The -p flag creates each missing parent directory in the path and does not error if any already exist.',
                  },
                },
                {
                  type: 'predict',
                  prompt: 'What happens if you run cp myfolder backup without any options, where myfolder is a directory?',
                  solution: {
                    explanation:
                      'cp refuses and reports that it omitted the directory because -r was not given. Copying a directory requires cp -r.',
                  },
                },
                {
                  type: 'quiz',
                  prompt: 'You accidentally ran rm important.txt. How do you recover it from the recycle bin?',
                  hint: 'Consider whether Linux has one.',
                  solution: {
                    explanation:
                      'There is no recycle bin for rm. The file is gone unless you have a backup or use specialised recovery tools. This is why caution and backups matter.',
                  },
                },
              ],
              docs: 'https://www.gnu.org/software/coreutils/manual/html_node/index.html',
            },
            {
              id: 'lx2-t0-c1',
              title: 'Hard links and symbolic links',
              summary:
                'A link lets a file appear in more than one place. A hard link is another name for the same data; a symbolic link is a pointer to a path.',
              explanation:
                'On Linux a filename is just a directory entry pointing to an inode, the structure that actually holds a file\'s data and metadata. A hard link (ln target name) creates a second directory entry pointing to the same inode, so both names are equal peers; the data survives until the last hard link is removed. Hard links cannot span filesystems and cannot point to directories. A symbolic link, or symlink (ln -s target name), is a small special file that simply stores a path to another location. Symlinks can cross filesystems and point to directories, which makes them far more common in practice. The trade-off: if you delete or move the target, a symlink becomes dangling and broken, whereas a hard link keeps working because it references the data directly. Use ls -l to spot symlinks, shown with an arrow to their target.',
              analogy:
                'A hard link is two house keys cut for the same lock — either opens the same door. A symbolic link is a sticky note that says the spare key is next door; if the neighbour moves, the note points nowhere.',
              keyPoints: [
                'A filename points to an inode, which holds the actual data.',
                'A hard link is an equal second name for the same inode; data lives until the last link is gone.',
                'A symbolic link stores a path and can cross filesystems and point to directories.',
                'Deleting a symlink target leaves a broken, dangling link.',
                'ls -l shows symlinks with an arrow to their target.',
              ],
              code: {
                language: 'bash',
                lines: [
                  'echo hello > original.txt',
                  '# Hard link: a second name for the same data',
                  'ln original.txt hardlink.txt',
                  '# Symbolic link: a pointer to the path',
                  'ln -s original.txt softlink.txt',
                  '# See the symlink and its target',
                  'ls -l softlink.txt',
                ],
                explanation:
                  'The hard link shares the inode with original.txt, while the symbolic link is a separate file that records the path original.txt.',
              },
              commonMistakes: [
                'Creating a symlink with a relative target and then moving the symlink elsewhere, which breaks it because the relative path no longer resolves.',
              ],
              exercises: [
                {
                  type: 'task',
                  prompt: 'Create a symbolic link named latest.log that points to /var/log/app/2026-06-28.log.',
                  solution: {
                    lines: ['ln -s /var/log/app/2026-06-28.log latest.log'],
                    explanation:
                      'ln -s makes a symbolic link; latest.log will resolve to the dated log file until you repoint it.',
                  },
                },
                {
                  type: 'predict',
                  prompt: 'You hard-link data.bin to copy.bin, then delete data.bin. Can you still read copy.bin?',
                  solution: {
                    explanation:
                      'Yes. A hard link points to the same inode. The data persists until the last hard link is removed, and copy.bin is still a link to it.',
                  },
                },
                {
                  type: 'quiz',
                  prompt: 'Why might you choose a symbolic link over a hard link?',
                  hint: 'Think about directories and separate disks.',
                  solution: {
                    explanation:
                      'Symbolic links can point to directories and can cross filesystem boundaries, neither of which hard links allow.',
                  },
                },
              ],
              docs: 'https://man7.org/linux/man-pages/man1/ln.1.html',
            },
            {
              id: 'lx2-t0-c2',
              title: 'Wildcards and globbing',
              summary:
                'The shell expands wildcard patterns into matching filenames before the command runs. This is called globbing.',
              explanation:
                'Globbing is pattern matching that the shell performs on filenames. The asterisk * matches any number of characters (including none), so *.txt matches every file ending in .txt. The question mark ? matches exactly one character, so file?.log matches file1.log but not file10.log. Square brackets match a set or range of characters: [abc] matches one of a, b or c, and [0-9] matches a single digit. Brace expansion is related but different: {jpg,png} expands to the literal words, so img.{jpg,png} becomes img.jpg img.png even if those files do not exist. The crucial point is that the shell expands these before the command sees them — by the time ls or rm runs, it receives the already-expanded list of real filenames. If a pattern matches nothing, bash by default passes the literal pattern through unchanged.',
              analogy:
                'Globbing is like telling a librarian bring me every book on the shelf starting with M — you describe a pattern and they hand you all the matching items at once.',
              keyPoints: [
                '* matches any run of characters; ? matches exactly one.',
                '[set] matches one character from a set or range like [0-9].',
                'Brace expansion {a,b} produces literal alternatives, not file matches.',
                'The shell expands globs before the command runs.',
                'A pattern matching nothing is, by default, passed through literally in bash.',
              ],
              code: {
                language: 'bash',
                lines: [
                  '# All text files',
                  'ls *.txt',
                  '# Single-character wildcard',
                  'ls report?.csv',
                  '# A character range',
                  'ls log_[0-9].txt',
                  '# Brace expansion creates literal words',
                  'touch image.{jpg,png,gif}',
                ],
                explanation:
                  '* and ? and [..] match existing filenames, while {..} generates the listed alternatives whether or not they exist yet.',
              },
              commonMistakes: [
                'Assuming an empty match becomes nothing — in default bash a non-matching * is passed literally, which can confuse a loop or command.',
              ],
              exercises: [
                {
                  type: 'task',
                  prompt: 'List all files in the current directory whose names end in .log and start with the word app.',
                  solution: {
                    lines: ['ls app*.log'],
                    explanation:
                      'app matches the literal prefix, * matches any middle characters, and .log matches the suffix.',
                  },
                },
                {
                  type: 'predict',
                  prompt: 'You have files a1.txt, a2.txt and ab.txt. What does ls a?.txt list?',
                  solution: {
                    explanation:
                      'a1.txt, a2.txt and ab.txt all match, because ? matches exactly one character and each name has a single character between a and .txt.',
                  },
                },
                {
                  type: 'quiz',
                  prompt: 'Will touch file{1,2,3}.txt create three files even though none exist yet?',
                  hint: 'Brace expansion is not file matching.',
                  solution: {
                    explanation:
                      'Yes. Brace expansion produces the literal words file1.txt file2.txt file3.txt, and touch then creates all three.',
                  },
                },
              ],
              docs: 'https://www.gnu.org/software/bash/manual/bash.html#Filename-Expansion',
            },
            {
              id: 'lx2-t0-c3',
              title: 'Finding files with find, file and stat',
              summary:
                'find searches the directory tree by name, type, size, time and more, and can act on results. file and stat tell you about an individual file.',
              explanation:
                'find walks a directory tree and tests each entry against criteria you give it. The first argument is where to start, followed by tests: -name matches a filename pattern (quote it so the shell does not expand it), -type f or -type d restricts to files or directories, -size and -mtime filter by size and modification age, and -iname is a case-insensitive name match. Most powerfully, -exec runs a command on each match, with {} standing in for the filename and \\; ending the command. While ls and globbing work on one directory, find recurses through everything beneath the start point. Two companions describe a single file: file inspects content and reports the type (text, ELF binary, image) regardless of extension, and stat prints detailed metadata including size, permissions and the access, modify and change timestamps.',
              analogy:
                'find is a search party that fans out through every room of a building looking for anything matching your description, and can be told to do something with each thing it finds.',
              keyPoints: [
                'find START tests recurses the tree from START applying tests.',
                '-name (quoted), -type, -size and -mtime are the common filters.',
                '-exec cmd {} \\; runs a command on each match.',
                'file reports content type regardless of the extension.',
                'stat shows size, permissions and access/modify/change times.',
              ],
              code: {
                language: 'bash',
                lines: [
                  '# All .log files under /var/log',
                  'find /var/log -type f -name "*.log"',
                  '# Files larger than 100 MB under home',
                  'find ~ -type f -size +100M',
                  '# Delete .tmp files modified over 7 days ago',
                  'find /tmp -name "*.tmp" -mtime +7 -delete',
                  '# What kind of file is this, and its metadata',
                  'file /bin/ls',
                  'stat /etc/hostname',
                ],
                explanation:
                  'find filters by type, name, size and age and can act with -delete or -exec; file and stat describe a single target.',
              },
              commonMistakes: [
                'Leaving -name "*.log" unquoted, so the shell glob-expands it in the current directory before find ever runs.',
              ],
              exercises: [
                {
                  type: 'task',
                  prompt: 'Find all directories named node_modules anywhere under the current directory.',
                  solution: {
                    lines: ['find . -type d -name node_modules'],
                    explanation:
                      'Starting at . and using -type d limits results to directories, while -name matches the exact name.',
                  },
                },
                {
                  type: 'task',
                  prompt: 'Determine the true type of a file called data even though it has no extension.',
                  solution: {
                    lines: ['file data'],
                    explanation:
                      'file inspects the contents (magic bytes) rather than the name, so it reports the actual type.',
                  },
                },
                {
                  type: 'predict',
                  prompt: 'What does find . -name "*.bak" -mtime +30 match?',
                  solution: {
                    explanation:
                      'All .bak files under the current directory that were last modified more than 30 days ago. -mtime +30 means older than 30 days.',
                  },
                },
              ],
              docs: 'https://man7.org/linux/man-pages/man1/find.1.html',
            },
          ],
        },
        {
          id: 'lx2-t1',
          name: 'Viewing and editing text',
          concepts: [
            {
              id: 'lx2-t1-c0',
              title: 'Viewing files with cat, less, head and tail',
              summary:
                'Different tools suit different sizes: cat dumps a whole file, less pages through it interactively, and head and tail show the ends.',
              explanation:
                'cat prints an entire file to the terminal and is fine for short files or for combining several into one stream. For anything large, less is the right tool: it opens the file in a scrollable pager so you can move with the arrows or space, search forward with /word, jump to the end with G and the start with g, and quit with q — all without loading the whole file into memory. head shows the first lines (10 by default, or -n N for a specific count) and tail shows the last lines. The standout feature is tail -f, which follows a file and prints new lines as they are appended, which is exactly what you want when watching a live log. Combining these — for example tail -f /var/log/syslog while a service runs — is a core debugging habit.',
              analogy:
                'cat tips the whole bucket out at once, less lets you sip the file a page at a time, and tail -f is a tap left running so you see each new drop as it falls.',
              keyPoints: [
                'cat prints a whole file or concatenates several.',
                'less pages large files; search with /word, quit with q.',
                'head shows the first lines; tail shows the last lines.',
                '-n N sets how many lines head or tail prints.',
                'tail -f follows a growing file live, ideal for logs.',
              ],
              code: {
                language: 'bash',
                lines: [
                  '# Dump a short file',
                  'cat /etc/hostname',
                  '# Page through a large file',
                  'less /var/log/syslog',
                  '# First and last 20 lines',
                  'head -n 20 access.log',
                  'tail -n 20 access.log',
                  '# Watch a log live',
                  'tail -f /var/log/syslog',
                ],
                explanation:
                  'cat for small files, less for large ones, head/tail for the ends, and tail -f to follow new log lines in real time.',
              },
              commonMistakes: [
                'Running cat on a huge or binary file, which floods the terminal with garbage; use less or file first.',
              ],
              exercises: [
                {
                  type: 'task',
                  prompt: 'Continuously watch new lines being written to /var/log/nginx/access.log.',
                  solution: {
                    lines: ['tail -f /var/log/nginx/access.log'],
                    explanation:
                      'tail -f keeps the file open and prints each new line as it is appended; press Ctrl+C to stop.',
                  },
                },
                {
                  type: 'predict',
                  prompt: 'What does head -n 5 file.txt output?',
                  solution: {
                    explanation:
                      'The first five lines of file.txt. -n 5 overrides the default of 10 lines.',
                  },
                },
                {
                  type: 'quiz',
                  prompt: 'You are inside less. How do you search for the word "error" and quit afterwards?',
                  hint: 'less shares its keys with man.',
                  solution: {
                    explanation:
                      'Type /error and Enter to search, press n for the next match, and q to quit.',
                  },
                },
              ],
              docs: 'https://www.gnu.org/software/coreutils/manual/html_node/Output-of-entire-files.html',
            },
            {
              id: 'lx2-t1-c1',
              title: 'Editing in the terminal with nano and vim',
              summary:
                'nano is a beginner-friendly editor with on-screen shortcuts. vim is powerful and ubiquitous but modal, so it pays to learn the basics.',
              explanation:
                'You will often need to edit configuration files directly on a server. nano is the gentle option: it shows its key commands along the bottom, where ^ means the Ctrl key. You type normally, save with Ctrl+O (write out), and exit with Ctrl+X. vim (or its predecessor vi) is installed almost everywhere and is worth a minimal command of even if you prefer nano. Its key idea is modes. You start in Normal mode, where keys are commands, not text; press i to enter Insert mode and actually type. Press Esc to return to Normal mode. From Normal mode, commands beginning with a colon control the file: :w writes, :q quits, :wq writes and quits, and :q! quits discarding changes. Knowing just i, Esc and :wq is enough to escape vim, which is famously the first hurdle for newcomers.',
              analogy:
                'nano is an automatic car — get in and drive. vim is a manual: you must know which mode (gear) you are in, but once you do you have far more control.',
              keyPoints: [
                'nano shows shortcuts on screen; ^ means Ctrl, save with Ctrl+O, exit with Ctrl+X.',
                'vim is modal: Normal mode for commands, Insert mode for typing.',
                'Press i to insert and Esc to return to Normal mode.',
                ':w writes, :q quits, :wq writes and quits, :q! quits without saving.',
                'Learning i, Esc and :wq is enough to use vim safely.',
              ],
              code: {
                language: 'bash',
                lines: [
                  '# Open a file in nano',
                  'nano /etc/hosts',
                  '# In nano: Ctrl+O saves, Ctrl+X exits',
                  '# Open a file in vim',
                  'vim notes.txt',
                  '# In vim: i to insert, Esc, then :wq to save and quit',
                ],
                explanation:
                  'nano is immediate; in vim remember to leave Insert mode with Esc before typing the :wq command in Normal mode.',
              },
              commonMistakes: [
                'In vim, trying to type :wq while still in Insert mode — press Esc first, or the colon command is just inserted as text.',
              ],
              exercises: [
                {
                  type: 'quiz',
                  prompt: 'You opened a file in vim, made no changes, and want to leave. Which command quits?',
                  hint: 'No changes means you do not need to save.',
                  solution: {
                    explanation:
                      'Press Esc to ensure Normal mode, then type :q and Enter. If you made changes you wanted to discard, use :q! instead.',
                  },
                },
                {
                  type: 'task',
                  prompt: 'In vim, save the current file and quit in a single command from Normal mode.',
                  solution: {
                    lines: [':wq'],
                    explanation:
                      ':wq writes the buffer to disk and then quits. Make sure you are in Normal mode (press Esc) before typing it.',
                  },
                },
                {
                  type: 'predict',
                  prompt: 'In nano, what does the bottom-bar label ^X mean, and what does it do?',
                  solution: {
                    explanation:
                      'The caret stands for Ctrl, so ^X means press Ctrl+X, which exits nano (prompting to save if there are unsaved changes).',
                  },
                },
              ],
              docs: 'https://www.nano-editor.org/dist/latest/cheatsheet.html',
            },
            {
              id: 'lx2-t1-c2',
              title: 'Searching text with grep and regular expressions',
              summary:
                'grep searches input for lines matching a pattern. Regular expressions make those patterns expressive and precise.',
              explanation:
                'grep prints the lines of a file (or its input) that match a pattern. Common options make it far more useful: -i ignores case, -n prefixes each match with its line number, -r searches recursively through a directory tree, -v inverts the match to show non-matching lines, and -c counts matches. The pattern can be a plain string or a regular expression. In a regex, . matches any single character, ^ anchors to the start of a line and $ to the end, * means zero or more of the preceding item, and [abc] matches a character class. Basic grep uses Basic Regular Expressions where +, ? and | need backslashes; passing -E (or using egrep) switches to Extended Regular Expressions where those work plainly. grep is the workhorse of log analysis and is constantly used on the right-hand side of a pipe to filter another command\'s output.',
              analogy:
                'grep is a highlighter that scans every line and marks only the ones matching your description, and regular expressions let you describe that pattern as loosely or as exactly as you need.',
              keyPoints: [
                'grep prints lines matching a pattern; -i, -n, -r, -v and -c are the staples.',
                '^ anchors the start, $ the end, . any character, * zero-or-more.',
                '[abc] is a character class; [^abc] negates it.',
                '-E enables Extended regex so +, ? and | work without backslashes.',
                'grep is most often used on the right side of a pipe to filter output.',
              ],
              code: {
                language: 'bash',
                lines: [
                  '# Case-insensitive search with line numbers',
                  'grep -in error /var/log/syslog',
                  '# Recursively search a project for a string',
                  'grep -rn "TODO" src/',
                  '# Lines that do NOT contain debug',
                  'grep -v debug app.log',
                  '# Extended regex: lines starting with a digit',
                  'grep -E "^[0-9]+" data.txt',
                ],
                explanation:
                  '-i ignores case, -n shows line numbers, -r recurses, -v inverts, and -E enables extended regular expressions.',
              },
              commonMistakes: [
                'Forgetting to quote a pattern containing spaces or shell metacharacters, so the shell mangles it before grep sees it.',
              ],
              exercises: [
                {
                  type: 'task',
                  prompt: 'Search every file under the logs directory for the word timeout, showing file names and line numbers, ignoring case.',
                  solution: {
                    lines: ['grep -rin timeout logs/'],
                    explanation:
                      '-r recurses into the directory, -i ignores case, and -n adds line numbers; grep prints the file name automatically when searching multiple files.',
                  },
                },
                {
                  type: 'predict',
                  prompt: 'What lines does grep -E "^#" config.conf match?',
                  solution: {
                    explanation:
                      'Lines that start with a # character, because ^ anchors to the beginning of the line. This is a common way to find comments.',
                  },
                },
                {
                  type: 'quiz',
                  prompt: 'How do you show only the lines of a file that do NOT contain the word success?',
                  hint: 'There is a flag that inverts the match.',
                  solution: {
                    explanation:
                      'Use grep -v success file. The -v flag inverts the match, printing every line that does not match.',
                  },
                },
              ],
              docs: 'https://www.gnu.org/software/grep/manual/grep.html',
            },
          ],
        },
        {
          id: 'lx2-t2',
          name: 'Pipes, redirection and filters',
          concepts: [
            {
              id: 'lx2-t2-c0',
              title: 'Standard input, output and error',
              summary:
                'Every program has three default streams: stdin for input, stdout for normal output and stderr for errors. They are the foundation of redirection.',
              explanation:
                'When a program runs, the shell connects it to three streams identified by file descriptors. Standard input (stdin, descriptor 0) is where it reads input, by default the keyboard. Standard output (stdout, descriptor 1) is where normal results go, by default the terminal. Standard error (stderr, descriptor 2) is a separate channel for diagnostics and error messages, also shown on the terminal by default but kept distinct so errors do not pollute piped data. This separation is deliberate and powerful: you can send stdout to a file while letting errors still appear on screen, or capture errors separately. Understanding that errors travel on descriptor 2, not 1, explains why a command\'s error message can appear even after you redirect its output to a file — you redirected stdout but not stderr.',
              analogy:
                'Think of a machine with two output chutes and one input hopper: good products come out one chute (stdout), reject notices out another (stderr), and raw material goes in the hopper (stdin). Keeping the two chutes separate lets you route products and rejects to different bins.',
              keyPoints: [
                'stdin is descriptor 0, stdout is 1, stderr is 2.',
                'Normal results go to stdout; errors and diagnostics go to stderr.',
                'Both stdout and stderr default to the terminal but are separate streams.',
                'Keeping errors on a separate channel stops them polluting piped data.',
                'You can redirect each stream independently.',
              ],
              diagram: {
                type: 'mermaid',
                lines: [
                  'flowchart LR',
                  '  In[stdin 0] --> P[Program]',
                  '  P --> Out[stdout 1]',
                  '  P --> Err[stderr 2]',
                ],
                caption: 'A program reads from stdin and writes results to stdout and diagnostics to stderr.',
              },
              code: {
                language: 'bash',
                lines: [
                  '# stdout goes to the file, but the error still shows on screen',
                  'ls /etc /nope > out.txt',
                  '# Redirect only errors to a file',
                  'ls /etc /nope 2> errors.txt',
                  '# Send both streams to the same file',
                  'ls /etc /nope > all.txt 2>&1',
                ],
                explanation:
                  '> captures stdout (descriptor 1); 2> captures stderr (descriptor 2); 2>&1 makes stderr follow wherever stdout currently goes.',
              },
              commonMistakes: [
                'Redirecting only stdout with > and being surprised that error messages still appear — those are on stderr and need 2> or 2>&1.',
              ],
              exercises: [
                {
                  type: 'quiz',
                  prompt: 'Which file descriptor number is standard error?',
                  hint: 'They count 0, 1, 2.',
                  solution: {
                    explanation:
                      'Standard error is descriptor 2. stdin is 0 and stdout is 1.',
                  },
                },
                {
                  type: 'predict',
                  prompt: 'You run somecmd > out.txt and still see an error on the terminal. Why?',
                  solution: {
                    explanation:
                      'Because > only redirects stdout (descriptor 1). The error was written to stderr (descriptor 2), which still points at the terminal.',
                  },
                },
                {
                  type: 'task',
                  prompt: 'Run a command and send both its normal output and its errors into a single file called log.txt.',
                  solution: {
                    lines: ['somecmd > log.txt 2>&1'],
                    explanation:
                      'First stdout is redirected to log.txt, then 2>&1 redirects stderr to the same destination as stdout. Order matters.',
                  },
                },
              ],
              docs: 'https://www.gnu.org/software/bash/manual/bash.html#Redirections',
            },
            {
              id: 'lx2-t2-c1',
              title: 'Redirection and pipes: pipe, greater-than and less-than',
              summary:
                'Redirection sends streams to and from files; the pipe connects one program\'s stdout to the next program\'s stdin. Together they compose tools.',
              explanation:
                'Redirection operators reroute streams. > sends stdout to a file, overwriting it, while >> appends instead of overwriting — a vital distinction that saves you from clobbering data. < feeds a file into a program\'s stdin. 2> redirects stderr to a file, and the combination > file 2>&1 sends both streams to one place. The pipe | is different: it connects the stdout of the command on its left directly to the stdin of the command on its right, with no temporary file, so data flows through a chain. This is the heart of the Unix philosophy: small programs that each do one thing, joined into pipelines that do something larger. A pipeline like cat access.log | grep 404 | wc -l reads a log, keeps only the 404 lines, and counts them, all in one streaming pass.',
              analogy:
                'Redirection is plumbing that connects a tap to a bucket (a file). A pipe is plumbing that connects one machine\'s output pipe straight into the next machine\'s input, forming an assembly line.',
              keyPoints: [
                '> overwrites a file with stdout; >> appends to it.',
                '< reads a file as stdin.',
                '2> redirects stderr; > file 2>&1 sends both streams to one file.',
                '| connects one command\'s stdout to the next command\'s stdin.',
                'Pipelines embody small tools combined to do bigger jobs.',
              ],
              diagram: {
                type: 'mermaid',
                lines: [
                  'flowchart LR',
                  '  A[cat access.log] -->|stdout| B[grep 404]',
                  '  B -->|stdout| C[wc -l]',
                  '  C --> N[count]',
                ],
                caption: 'A pipeline streams output from one command into the next without temporary files.',
              },
              code: {
                language: 'bash',
                lines: [
                  '# Overwrite versus append',
                  'echo first > notes.txt',
                  'echo second >> notes.txt',
                  '# Feed a file into a program as input',
                  'sort < names.txt',
                  '# Classic pipeline: count 404 lines in a log',
                  'cat access.log | grep 404 | wc -l',
                ],
                explanation:
                  '> overwrites and >> appends; < provides stdin; the pipe chains cat into grep into wc to count matching lines.',
              },
              commonMistakes: [
                'Using > when you meant >>, which silently overwrites the entire file instead of adding to it.',
              ],
              exercises: [
                {
                  type: 'predict',
                  prompt: 'You run echo a > f.txt then echo b > f.txt. What does f.txt contain?',
                  solution: {
                    explanation:
                      'Just b. The second > overwrote the file. To keep both lines you would use >> for the second command.',
                  },
                },
                {
                  type: 'task',
                  prompt: 'Count how many lines in app.log contain the word ERROR, using a pipeline.',
                  solution: {
                    lines: ['grep ERROR app.log | wc -l'],
                    explanation:
                      'grep filters to matching lines and pipes them to wc -l, which counts the lines.',
                  },
                },
                {
                  type: 'quiz',
                  prompt: 'What is the difference between cmd > out.txt and cmd >> out.txt?',
                  hint: 'One destroys existing content.',
                  solution: {
                    explanation:
                      '> truncates and overwrites out.txt with the new output, while >> appends the output to the end, preserving what was already there.',
                  },
                },
              ],
              docs: 'https://www.gnu.org/software/bash/manual/bash.html#Pipelines',
            },
            {
              id: 'lx2-t2-c2',
              title: 'Filters: sort, uniq, wc, cut and an intro to sed and awk',
              summary:
                'Filters transform a stream as it passes through. sort, uniq, wc and cut are everyday tools, while sed and awk handle richer text manipulation.',
              explanation:
                'A filter reads stdin, transforms it and writes stdout, making it perfect for the middle of a pipeline. sort orders lines (sort -n for numeric, -r to reverse), and uniq collapses adjacent duplicate lines — so the idiom sort | uniq -c counts occurrences, because uniq only sees duplicates if they are already adjacent. wc counts lines, words and bytes (wc -l for just lines). cut extracts columns: cut -d, -f1 takes the first comma-delimited field, useful for CSV-like data. For more power, sed is a stream editor that performs find-and-replace and line operations non-interactively, classically sed s/old/new/g to substitute globally. awk is a small programming language for columnar text; awk \'{print $2}\' prints the second whitespace-separated field of every line, and it can filter, compute and format. Together these turn the shell into a fast data-processing toolkit.',
              analogy:
                'Filters are stations on a conveyor belt: each one reshapes the items passing through — sorting them, removing duplicates, snipping out a column, or rewriting their labels — before passing them to the next station.',
              keyPoints: [
                'sort orders lines; -n sorts numerically and -r reverses.',
                'uniq removes adjacent duplicates; sort | uniq -c counts occurrences.',
                'wc counts lines, words and bytes; wc -l counts lines.',
                'cut -d DELIM -f N extracts a field from delimited data.',
                'sed does stream find-and-replace; awk processes columns programmatically.',
              ],
              code: {
                language: 'bash',
                lines: [
                  '# Count how often each value appears, most frequent last',
                  'sort access.log | uniq -c | sort -n',
                  '# Extract the first comma-separated field',
                  'cut -d, -f1 users.csv',
                  '# Replace every foo with bar in a stream',
                  'sed "s/foo/bar/g" config.txt',
                  '# Print the second whitespace field of each line',
                  'awk "{print \\$2}" access.log',
                ],
                explanation:
                  'sort then uniq -c tallies values; cut pulls a column; sed substitutes text; awk prints a chosen field. Note the column count idiom relies on sorting first so duplicates are adjacent.',
              },
              commonMistakes: [
                'Running uniq without sorting first and missing duplicates, because uniq only collapses lines that are already adjacent.',
              ],
              exercises: [
                {
                  type: 'task',
                  prompt: 'From access.log, produce a list of unique IP addresses (assume the IP is the first whitespace field) and how many times each appears.',
                  solution: {
                    lines: ['awk \'{print $1}\' access.log | sort | uniq -c'],
                    explanation:
                      'awk extracts the first field, sort makes identical IPs adjacent, and uniq -c counts each one.',
                  },
                },
                {
                  type: 'predict',
                  prompt: 'Given a file with lines a, b, a, a, what does uniq print without sorting first?',
                  solution: {
                    explanation:
                      'a, b, a — it only collapses the two adjacent a lines at the end into one, leaving the first a and the b separate because uniq compares neighbours only.',
                  },
                },
                {
                  type: 'quiz',
                  prompt: 'Which single command counts the number of lines in a file?',
                  hint: 'A counting filter with a line flag.',
                  solution: {
                    explanation:
                      'wc -l file prints the line count. You can also pipe into it, e.g. grep x file | wc -l.',
                  },
                },
              ],
              docs: 'https://www.gnu.org/software/coreutils/manual/html_node/index.html',
            },
          ],
        },
      ],
    },
    /* ─────────────── LEVEL 3 — PERMISSIONS, PROCESSES & PACKAGES ─────────────── */
    {
      level: 3,
      name: 'Permissions, processes and packages',
      focus: 'Controlling who can do what, managing running programs, and installing software',
      accent: '#f59e0b',
      soft: '#fff4e0',
      topics: [
        {
          id: 'lx3-t0',
          name: 'Users, permissions and ownership',
          concepts: [
            {
              id: 'lx3-t0-c0',
              title: 'Reading rwx permissions for user, group and other',
              summary:
                'Every file has permission bits for three classes — owner, group and others — each able to read, write or execute. ls -l shows them as a ten-character string.',
              explanation:
                'Linux permissions answer a simple question: who may do what to this file. There are three permission types — read (r), write (w) and execute (x) — and three classes of user — the file\'s owner (user), the file\'s group, and everyone else (other). In ls -l output the first character is the file type (- for a regular file, d for a directory, l for a symlink), and the next nine characters are three groups of rwx for owner, group and other respectively. So -rwxr-xr-- means the owner can read, write and execute, the group can read and execute, and others can only read. For directories the meanings shift slightly: read lets you list names, write lets you create or delete entries, and execute lets you enter the directory and access files inside it. Reading these ten characters fluently is the basis of all Linux access control.',
              analogy:
                'Permissions are like a building with three keycards — one for the owner, one for the team, one for visitors — and each card can be set to allow reading the noticeboard, writing on it, or entering the room.',
              keyPoints: [
                'Three permission types: read (r), write (w), execute (x).',
                'Three classes: owner (user), group, and other.',
                'ls -l shows type plus three rwx triples for user, group, other.',
                'On directories, x means you may enter it and access its contents.',
                'On directories, w lets you create and delete entries inside.',
              ],
              diagram: {
                type: 'mermaid',
                lines: [
                  'flowchart LR',
                  '  T[type d or dash] --> U[user rwx]',
                  '  U --> G[group rwx]',
                  '  G --> O[other rwx]',
                ],
                caption: 'The ten characters of ls -l: one type character followed by user, group and other permission triples.',
              },
              code: {
                language: 'bash',
                lines: [
                  '# Show permissions, owner and group',
                  'ls -l report.txt',
                  '# Example output explained below',
                  '# -rw-r--r-- 1 ana staff 1024 Jun 28 10:00 report.txt',
                ],
                explanation:
                  'The string -rw-r--r-- means a regular file where owner ana can read and write, group staff can read, and others can read.',
              },
              commonMistakes: [
                'Forgetting that execute on a directory is needed just to cd into it or read files within, even if read is set.',
              ],
              exercises: [
                {
                  type: 'predict',
                  prompt: 'What does the permission string -rwxr-x--- mean for owner, group and other?',
                  solution: {
                    explanation:
                      'Owner: read, write, execute. Group: read and execute. Other: no access at all. It is a regular file (leading -).',
                  },
                },
                {
                  type: 'quiz',
                  prompt: 'A directory has r but not x for your user. Can you cd into it?',
                  hint: 'Entering a directory needs a specific bit.',
                  solution: {
                    explanation:
                      'No. Entering a directory requires the execute (x) bit. Without it you cannot cd in or access files inside, even with read set.',
                  },
                },
                {
                  type: 'task',
                  prompt: 'Show the detailed permissions and ownership of every file in the current directory.',
                  solution: {
                    lines: ['ls -l'],
                    explanation:
                      'ls -l prints the permission string, link count, owner, group, size and time for each entry.',
                  },
                },
              ],
              docs: 'https://www.gnu.org/software/coreutils/manual/html_node/Permissions.html',
            },
            {
              id: 'lx3-t0-c1',
              title: 'Changing permissions with chmod, numeric and symbolic',
              summary:
                'chmod sets permission bits. You can use symbolic notation like u+x or numeric octal like 755, whichever is clearer for the change.',
              explanation:
                'chmod (change mode) edits permission bits. Symbolic notation reads like an instruction: a class (u for user, g for group, o for other, a for all), an operator (+ to add, - to remove, = to set exactly), and the permissions, so chmod u+x script.sh adds execute for the owner and chmod go-w file removes write for group and other. Numeric (octal) notation expresses all nine bits at once: each digit is the sum of read 4, write 2 and execute 1 for one class, in the order owner, group, other. Thus 755 means rwx for owner (4+2+1) and r-x for group and other (4+1), which is typical for executables and directories, while 644 means rw for owner and read-only for the rest, typical for ordinary files. Add -R to apply changes recursively through a directory tree. The most common single use is making a script executable.',
              analogy:
                'Symbolic mode is editing one setting on a control panel — flip this switch on. Numeric mode is dialling in all the switch positions at once with a single three-digit code.',
              keyPoints: [
                'Symbolic: class (ugoa) + operator (+ - =) + bits (rwx).',
                'Numeric octal: read 4, write 2, execute 1, summed per class.',
                '755 is rwx/r-x/r-x; 644 is rw-/r--/r--.',
                'chmod -R applies recursively to a whole tree.',
                'chmod +x is the classic way to make a script runnable.',
              ],
              code: {
                language: 'bash',
                lines: [
                  '# Make a script executable (symbolic)',
                  'chmod u+x deploy.sh',
                  '# Set rwxr-xr-x exactly (numeric)',
                  'chmod 755 deploy.sh',
                  '# Read-write owner, read-only others',
                  'chmod 644 notes.txt',
                  '# Remove all access for others, recursively',
                  'chmod -R o-rwx private/',
                ],
                explanation:
                  'u+x adds owner execute; 755 and 644 set common executable and file modes; -R o-rwx strips other access through the whole tree.',
              },
              commonMistakes: [
                'Running chmod -R 777 on a directory to fix a permission problem — it makes everything world-writable, a serious security hole, and rarely the real fix.',
              ],
              exercises: [
                {
                  type: 'task',
                  prompt: 'Make backup.sh executable for everyone while keeping it readable, using numeric notation for 755.',
                  solution: {
                    lines: ['chmod 755 backup.sh'],
                    explanation:
                      '7 (rwx) for owner, 5 (r-x) for group and other gives execute and read to all and write only to the owner.',
                  },
                },
                {
                  type: 'predict',
                  prompt: 'What permission string results from chmod 640 secret.txt?',
                  solution: {
                    explanation:
                      '-rw-r-----. Owner has read+write (6), group has read only (4), and other has nothing (0).',
                  },
                },
                {
                  type: 'quiz',
                  prompt: 'Why is chmod 777 generally a bad idea?',
                  hint: 'Think about who can then modify the file.',
                  solution: {
                    explanation:
                      'It grants read, write and execute to everyone, including other users on the system. Anyone can modify or replace the file, which is a security risk. Grant the least permission needed instead.',
                  },
                },
              ],
              docs: 'https://www.gnu.org/software/coreutils/manual/html_node/chmod-invocation.html',
            },
            {
              id: 'lx3-t0-c2',
              title: 'Ownership with chown, and the passwd and group files',
              summary:
                'chown changes which user and group own a file. /etc/passwd and /etc/group define the accounts and groups those names map to.',
              explanation:
                'Permissions only mean something relative to ownership, so you also need to control who owns a file. chown sets the owner, and optionally the group, of a file: chown ana file makes ana the owner, and chown ana:devs file sets both owner and group in one step. To change only the group you can use chgrp, or chown :devs file. Changing ownership normally requires root because it can grant access to another user. Accounts are recorded in /etc/passwd, one line per user with colon-separated fields: username, an x placeholder (the real hashed password lives in the shadowed /etc/shadow), the numeric user id (UID), the primary group id (GID), a comment, the home directory, and the login shell. Groups live in /etc/group with the group name, GID and member list. Reading these files tells you exactly which users and groups exist and what shell and home each account has.',
              analogy:
                'chown is reassigning the deed to a property; /etc/passwd is the registry of every resident, listing their ID, address (home) and preferred door (shell).',
              keyPoints: [
                'chown user file sets the owner; chown user:group file sets both.',
                'chgrp or chown :group changes only the group.',
                'Changing ownership generally requires root.',
                '/etc/passwd lists accounts: name, UID, GID, home and shell.',
                'Hashed passwords live in /etc/shadow, not /etc/passwd; /etc/group lists groups.',
              ],
              code: {
                language: 'bash',
                lines: [
                  '# Give a file to user ana and group devs',
                  'sudo chown ana:devs project.txt',
                  '# Change only the group',
                  'sudo chgrp devs project.txt',
                  '# Inspect the account database',
                  'cat /etc/passwd',
                  '# Find your own UID and groups',
                  'id',
                ],
                explanation:
                  'chown reassigns ownership (needs sudo), /etc/passwd lists every account, and id shows your own UID, GID and group memberships.',
              },
              commonMistakes: [
                'Editing /etc/passwd by hand and introducing a syntax error, which can lock accounts out; prefer tools like usermod where possible.',
              ],
              exercises: [
                {
                  type: 'task',
                  prompt: 'Change the owner of app.log to the user www-data and the group to adm.',
                  solution: {
                    lines: ['sudo chown www-data:adm app.log'],
                    explanation:
                      'The user:group syntax sets both at once, and sudo provides the root privilege chown requires.',
                  },
                },
                {
                  type: 'predict',
                  prompt: 'In /etc/passwd a line ends with /usr/sbin/nologin. What does that tell you about the account?',
                  solution: {
                    explanation:
                      'Its login shell is nologin, so the account cannot get an interactive shell. This is typical of system or service accounts.',
                  },
                },
                {
                  type: 'quiz',
                  prompt: 'Where are user password hashes actually stored?',
                  hint: 'Not in the world-readable passwd file.',
                  solution: {
                    explanation:
                      'In /etc/shadow, which is readable only by root. /etc/passwd shows just an x placeholder in the password field.',
                  },
                },
              ],
              docs: 'https://man7.org/linux/man-pages/man5/passwd.5.html',
            },
            {
              id: 'lx3-t0-c3',
              title: 'Running commands as root with sudo',
              summary:
                'sudo runs a single command with elevated privileges, granting controlled, audited access to administrative actions without logging in as root.',
              explanation:
                'Most administrative tasks — installing packages, editing system files, managing services — require root privileges. Rather than logging in as root, which is risky and untracked, you prefix a command with sudo to run just that command as the superuser, after authenticating with your own password. This is safer because it limits how long you hold privilege, logs who did what, and lets administrators grant fine-grained rights. Who may use sudo is controlled by the /etc/sudoers file (and drop-in files in /etc/sudoers.d), which you should edit only with visudo so syntax errors are caught before they lock you out. On many distributions membership in the sudo group (Debian/Ubuntu) or wheel group (Red Hat/Arch) confers sudo access. sudo caches your authentication for a few minutes so repeated commands do not re-prompt, and sudo -i or sudo su starts an interactive root shell when you truly need one.',
              analogy:
                'sudo is a visitor badge that, after you sign in, lets you into restricted areas for one specific errand — far safer than being handed the master key and roaming freely as root.',
              keyPoints: [
                'sudo runs one command as root after you enter your own password.',
                'It is safer than a root login: limited duration and full audit logging.',
                '/etc/sudoers controls who may use sudo; edit it only with visudo.',
                'The sudo group (Debian) or wheel group (Red Hat) typically grants access.',
                'sudo -i starts a root shell when sustained privilege is needed.',
              ],
              code: {
                language: 'bash',
                lines: [
                  '# Update package lists as root',
                  'sudo apt update',
                  '# Edit a protected file with elevated rights',
                  'sudo nano /etc/hosts',
                  '# Safely edit the sudoers file',
                  'sudo visudo',
                  '# Open an interactive root shell',
                  'sudo -i',
                ],
                explanation:
                  'sudo elevates a single command; visudo is the safe way to change sudo rules; sudo -i drops you into a root shell.',
              },
              commonMistakes: [
                'Editing /etc/sudoers directly with a normal editor instead of visudo, risking a syntax error that disables sudo entirely.',
              ],
              exercises: [
                {
                  type: 'quiz',
                  prompt: 'Why is using sudo preferable to logging in directly as root?',
                  hint: 'Think about scope, time and accountability.',
                  solution: {
                    explanation:
                      'sudo limits elevation to a single command for a short time and logs who ran what, providing accountability and reducing the window in which a mistake runs as root.',
                  },
                },
                {
                  type: 'task',
                  prompt: 'Edit the sudoers configuration safely.',
                  solution: {
                    lines: ['sudo visudo'],
                    explanation:
                      'visudo locks the file, opens it in an editor, and validates the syntax before saving, preventing a broken sudoers that could lock you out.',
                  },
                },
                {
                  type: 'predict',
                  prompt: 'You run sudo apt install nginx, then immediately sudo systemctl status nginx. Will the second command prompt for a password?',
                  solution: {
                    explanation:
                      'Usually not. sudo caches successful authentication for a few minutes, so the second command within that window runs without re-prompting.',
                  },
                },
              ],
              docs: 'https://www.sudo.ws/docs/man/sudo.man/',
            },
          ],
        },
        {
          id: 'lx3-t1',
          name: 'Processes and job control',
          concepts: [
            {
              id: 'lx3-t1-c0',
              title: 'Inspecting processes with ps, top and htop',
              summary:
                'A process is a running program. ps gives a snapshot, while top and htop show a live, updating view of what is consuming the system.',
              explanation:
                'Every running program is a process with a unique process id (PID), a parent process (PPID), an owner, and resource usage. ps reports a one-time snapshot; the widely used form ps aux lists every process with its user, PID, CPU and memory percentages, and command, and is commonly piped into grep to find a specific program. For a live view, top continuously refreshes a sorted list of processes by CPU or memory use, showing load averages and totals at the top; press q to quit. htop is a friendlier, colourful alternative (often installed separately) with scrolling, mouse support and easy sorting and killing. Each process descends from another, forming a tree rooted at PID 1, the init system (systemd on modern distros). Understanding this lineage helps you see which service spawned a runaway worker and where to intervene.',
              analogy:
                'ps is a still photograph of everyone in the building right now; top and htop are the live security-camera feed, updating every second to show who is busiest.',
              keyPoints: [
                'A process has a PID, a parent PID, an owner and resource usage.',
                'ps aux gives a full one-time snapshot of all processes.',
                'top shows a live, sorted view; press q to quit.',
                'htop is an interactive, colourful alternative, often installed separately.',
                'All processes form a tree rooted at PID 1, the init system.',
              ],
              code: {
                language: 'bash',
                lines: [
                  '# Snapshot of all processes',
                  'ps aux',
                  '# Find a specific process',
                  'ps aux | grep nginx',
                  '# Live, updating view',
                  'top',
                  '# Friendlier interactive monitor',
                  'htop',
                ],
                explanation:
                  'ps aux is the snapshot; piping into grep isolates a program; top and htop give live, sortable views of resource use.',
              },
              commonMistakes: [
                'Reading the grep line itself in ps aux | grep name output and thinking it is a second instance of the process.',
              ],
              exercises: [
                {
                  type: 'task',
                  prompt: 'Find the PID of any running process named sshd.',
                  solution: {
                    lines: ['ps aux | grep sshd'],
                    explanation:
                      'ps aux lists all processes and grep filters to those mentioning sshd; the second column is the PID. pgrep sshd is a cleaner alternative.',
                  },
                },
                {
                  type: 'quiz',
                  prompt: 'Which PID is the init system, the ancestor of all other processes?',
                  hint: 'It is the lowest possible.',
                  solution: {
                    explanation:
                      'PID 1. On modern distributions that is systemd, the first process the kernel starts and the parent of the process tree.',
                  },
                },
                {
                  type: 'predict',
                  prompt: 'What does the third and fourth column of ps aux typically represent?',
                  solution: {
                    explanation:
                      'CPU percentage and memory percentage. ps aux columns are USER, PID, %CPU, %MEM, then VSZ, RSS and the command.',
                  },
                },
              ],
              docs: 'https://man7.org/linux/man-pages/man1/ps.1.html',
            },
            {
              id: 'lx3-t1-c1',
              title: 'Foreground, background and job control',
              summary:
                'The shell can run commands in the foreground or background and manage them as jobs, letting you keep working while a task runs.',
              explanation:
                'When you run a command normally it runs in the foreground, occupying your terminal until it finishes. Appending & launches it in the background instead, so the prompt returns immediately and the command keeps running. If a foreground command is already running, pressing Ctrl+Z suspends it and gives you the prompt back. The shell tracks these as jobs, listed by jobs with a job number. You resume a suspended job in the background with bg, bring a background job back to the foreground with fg, and refer to a specific one with %1 for job 1. This is distinct from killing: suspending merely pauses, while bg lets it continue without the terminal. Note that background jobs are still tied to your shell session, so closing the terminal can end them unless you take extra steps.',
              analogy:
                'Foreground is a phone call that ties up the line; backgrounding with & is putting the call on speaker so you can do other things; Ctrl+Z is hitting hold; fg and bg pick the call back up or let it keep going hands-free.',
              keyPoints: [
                'A foreground command holds the terminal until it finishes.',
                'Appending & runs a command in the background and frees the prompt.',
                'Ctrl+Z suspends the current foreground job.',
                'jobs lists jobs; bg resumes one in the background, fg brings it forward.',
                'Refer to a job by number with %N, e.g. fg %1.',
              ],
              code: {
                language: 'bash',
                lines: [
                  '# Run in the background from the start',
                  'sleep 300 &',
                  '# Suspend a running foreground job with Ctrl+Z, then',
                  'jobs',
                  '# Resume it in the background',
                  'bg %1',
                  '# Bring it back to the foreground',
                  'fg %1',
                ],
                explanation:
                  '& backgrounds at launch, Ctrl+Z suspends, jobs lists them, and bg/fg move a job between background and foreground by its number.',
              },
              commonMistakes: [
                'Assuming a background job survives logout — by default closing the shell can terminate it; use nohup or a terminal multiplexer to keep it alive.',
              ],
              exercises: [
                {
                  type: 'task',
                  prompt: 'Start a long-running command, say a backup script, so that it runs in the background and returns your prompt immediately.',
                  solution: {
                    lines: ['./backup.sh &'],
                    explanation:
                      'The trailing & detaches the command from the foreground, so the shell prints a job number and returns the prompt while it runs.',
                  },
                },
                {
                  type: 'predict',
                  prompt: 'You press Ctrl+Z on a running program. Is it killed?',
                  solution: {
                    explanation:
                      'No, it is suspended (stopped), not killed. It pauses and gives back the prompt; you can resume it with fg or bg, or terminate it with kill.',
                  },
                },
                {
                  type: 'quiz',
                  prompt: 'After suspending a job with Ctrl+Z, which command lets it keep running without occupying the terminal?',
                  hint: 'Two letters.',
                  solution: {
                    explanation:
                      'bg resumes the suspended job in the background, so it continues running while you regain the prompt.',
                  },
                },
              ],
              docs: 'https://www.gnu.org/software/bash/manual/bash.html#Job-Control',
            },
            {
              id: 'lx3-t1-c2',
              title: 'Signals, kill and keeping processes alive with nohup',
              summary:
                'Signals are messages sent to processes. kill sends them, most often to ask a process to terminate; nohup shields a process from the hangup signal.',
              explanation:
                'The kernel communicates with processes through signals, small numbered messages. kill sends a signal to a PID despite its name; the default is SIGTERM (15), a polite request to shut down that a program can catch to clean up. If a process ignores SIGTERM, SIGKILL (9) forces immediate termination by the kernel and cannot be caught or ignored, but it gives the process no chance to tidy up, so reach for it only when SIGTERM fails. SIGHUP (1) is sent when a terminal closes and traditionally tells a process to terminate or reload. pkill and killall let you signal processes by name instead of PID. When the terminal hangs up, dependent background jobs may receive SIGHUP and die; running a command with nohup makes it ignore SIGHUP so it survives logout, with output redirected to nohup.out by default. Together these tools give you control over starting, stopping and persisting work.',
              analogy:
                'Signals are knocks on a process\'s door. SIGTERM is a polite please wrap up and leave; SIGKILL is the locksmith removing the door entirely; nohup is soundproofing so the hang-up knock that comes when you leave the building is never heard.',
              keyPoints: [
                'Signals are numbered messages; kill sends them to a PID.',
                'SIGTERM (15) politely asks a process to stop and can be handled.',
                'SIGKILL (9) forcibly terminates and cannot be caught; use it as a last resort.',
                'pkill and killall signal processes by name rather than PID.',
                'nohup makes a command ignore SIGHUP so it survives terminal logout.',
              ],
              diagram: {
                type: 'mermaid',
                lines: [
                  'flowchart TD',
                  '  A[kill PID] --> B{Process handles SIGTERM}',
                  '  B -->|yes| C[Clean shutdown]',
                  '  B -->|no| D[kill -9 PID]',
                  '  D --> E[Forced termination]',
                ],
                caption: 'Prefer SIGTERM for a clean exit; escalate to SIGKILL only if the process will not stop.',
              },
              code: {
                language: 'bash',
                lines: [
                  '# Politely ask a process to stop',
                  'kill 4242',
                  '# Force termination if it ignores SIGTERM',
                  'kill -9 4242',
                  '# Signal by name instead of PID',
                  'pkill nginx',
                  '# Keep a command running after logout',
                  'nohup ./long-task.sh &',
                ],
                explanation:
                  'kill sends SIGTERM by default; -9 sends SIGKILL; pkill targets by name; nohup plus & detaches a task so it ignores hangup and survives logout.',
              },
              commonMistakes: [
                'Reaching for kill -9 immediately, which prevents a clean shutdown and can leave corrupt files or stale locks; try plain kill first.',
              ],
              exercises: [
                {
                  type: 'task',
                  prompt: 'Forcibly terminate a stuck process with PID 9001 that ignored a normal kill.',
                  solution: {
                    lines: ['kill -9 9001'],
                    explanation:
                      '-9 sends SIGKILL, which the kernel enforces immediately and the process cannot catch. Use it only after a plain kill fails.',
                  },
                },
                {
                  type: 'quiz',
                  prompt: 'What is the difference between SIGTERM and SIGKILL?',
                  hint: 'One can be caught, one cannot.',
                  solution: {
                    explanation:
                      'SIGTERM (15) is a request to terminate that a process can catch to clean up. SIGKILL (9) cannot be caught or ignored and forces an immediate, unclean stop.',
                  },
                },
                {
                  type: 'predict',
                  prompt: 'You run nohup ./worker.sh & then close your SSH session. Does worker.sh keep running?',
                  solution: {
                    explanation:
                      'Yes. nohup makes it ignore the SIGHUP sent when the session closes, so it continues running, with output going to nohup.out.',
                  },
                },
              ],
              docs: 'https://man7.org/linux/man-pages/man7/signal.7.html',
            },
          ],
        },
        {
          id: 'lx3-t2',
          name: 'Software and packages',
          concepts: [
            {
              id: 'lx3-t2-c0',
              title: 'Package managers: apt, dnf and pacman',
              summary:
                'Package managers install, update and remove software and resolve dependencies automatically. Each distribution family has its own.',
              explanation:
                'On Linux you normally install software through a package manager rather than downloading installers. The manager fetches packages from configured repositories, installs them in standard locations, and crucially resolves dependencies — pulling in the other libraries a program needs and tracking them so removal is clean. The command depends on the distribution family. Debian and Ubuntu use apt: apt update refreshes the list of available packages, apt install NAME installs, apt remove NAME removes, and apt upgrade updates installed packages. Fedora and Red Hat use dnf with similar verbs: dnf install, dnf remove, dnf upgrade. Arch uses pacman with terse flags: pacman -S installs, pacman -R removes, and pacman -Syu synchronises and upgrades everything. Because these tools manage dependencies and integrity, they are far safer than hand-installing, and they keep a database of exactly what is installed.',
              analogy:
                'A package manager is an app store with a smart assistant: ask for one program and it quietly installs every supporting library it needs, remembers them, and can cleanly uninstall the whole set later.',
              keyPoints: [
                'Package managers fetch from repositories and resolve dependencies automatically.',
                'Debian/Ubuntu: apt update, apt install, apt remove, apt upgrade.',
                'Fedora/Red Hat: dnf install, dnf remove, dnf upgrade.',
                'Arch: pacman -S install, pacman -R remove, pacman -Syu update.',
                'They keep a database of installed software for clean removal.',
              ],
              diagram: {
                type: 'mermaid',
                lines: [
                  'flowchart LR',
                  '  U[apt install pkg] --> R[Repository]',
                  '  R --> D[Resolve dependencies]',
                  '  D --> I[Install package and deps]',
                  '  I --> DB[Local package database]',
                ],
                caption: 'A package manager fetches from repositories, resolves dependencies, installs, and records what it did.',
              },
              code: {
                language: 'bash',
                lines: [
                  '# Debian / Ubuntu',
                  'sudo apt update',
                  'sudo apt install nginx',
                  '# Fedora / Red Hat',
                  'sudo dnf install nginx',
                  '# Arch',
                  'sudo pacman -S nginx',
                ],
                explanation:
                  'apt update first refreshes the catalog; then each family installs nginx with its own command. All resolve dependencies automatically.',
              },
              commonMistakes: [
                'Running apt install without first running apt update, so you fetch from a stale catalog and may miss the newest version or hit broken URLs.',
              ],
              exercises: [
                {
                  type: 'task',
                  prompt: 'On a Debian-based system, refresh the package catalog and then install the git package.',
                  solution: {
                    lines: ['sudo apt update', 'sudo apt install git'],
                    explanation:
                      'apt update refreshes the list of available packages, and apt install git fetches git and any dependencies.',
                  },
                },
                {
                  type: 'quiz',
                  prompt: 'What is the main advantage of installing through a package manager rather than downloading a program manually?',
                  hint: 'Think about what else a program needs.',
                  solution: {
                    explanation:
                      'It automatically resolves and installs dependencies, places files in standard locations, and tracks everything so updates and clean removal are easy.',
                  },
                },
                {
                  type: 'predict',
                  prompt: 'On Arch, what does pacman -Syu do?',
                  solution: {
                    explanation:
                      'It synchronises the package databases (S, y) and upgrades all installed packages to the latest versions (u) — a full system update.',
                  },
                },
              ],
              docs: 'https://wiki.debian.org/Apt',
            },
            {
              id: 'lx3-t2-c1',
              title: 'Repositories, updating and searching',
              summary:
                'Repositories are the servers your package manager downloads from. Keeping the index fresh and your packages updated is routine maintenance.',
              explanation:
                'A repository is a curated server of packages and an index describing them, signed cryptographically so your system can verify authenticity. Your distribution ships with default repositories, and you can add more for extra software. The package manager keeps a local copy of the index, which you refresh before installing so you see current versions: apt update on Debian, dnf check-update on Fedora. Upgrading then applies available updates — apt upgrade or apt full-upgrade, dnf upgrade, pacman -Syu — which is the single most important security habit, since most fixes arrive as package updates. You can also search and inspect: apt search KEYWORD or dnf search KEYWORD finds packages by name or description, and apt show NAME or dnf info NAME displays details. Regularly updating and knowing how to search means you can find and maintain software confidently across machines.',
              analogy:
                'A repository is a verified warehouse; updating the index is checking the latest catalogue, and upgrading is restocking your shelves with the newest, safest versions of everything you own.',
              keyPoints: [
                'Repositories are signed servers of packages with an index.',
                'Refresh the index before installing so you see current versions.',
                'Upgrading applies updates and is the key security habit.',
                'apt search / dnf search find packages by keyword.',
                'apt show / dnf info display details about a package.',
              ],
              code: {
                language: 'bash',
                lines: [
                  '# Refresh index, then upgrade everything (Debian)',
                  'sudo apt update && sudo apt upgrade',
                  '# Search for a package by keyword',
                  'apt search compression',
                  '# Show details about a package',
                  'apt show htop',
                  '# Fedora equivalent of a full update',
                  'sudo dnf upgrade',
                ],
                explanation:
                  'update refreshes the index and upgrade applies the updates; search and show help you discover and inspect packages before installing.',
              },
              commonMistakes: [
                'Adding untrusted third-party repositories without checking their signing keys, which can expose the system to malicious packages.',
              ],
              exercises: [
                {
                  type: 'task',
                  prompt: 'On Ubuntu, refresh the package index and apply all available updates in one line.',
                  solution: {
                    lines: ['sudo apt update && sudo apt upgrade'],
                    explanation:
                      'The && runs upgrade only if update succeeded, ensuring you upgrade against a fresh index.',
                  },
                },
                {
                  type: 'quiz',
                  prompt: 'Why are packages in official repositories cryptographically signed?',
                  hint: 'Think about trust and tampering.',
                  solution: {
                    explanation:
                      'Signatures let the package manager verify that a package genuinely came from the repository and was not tampered with in transit, protecting against malicious or corrupted downloads.',
                  },
                },
                {
                  type: 'predict',
                  prompt: 'You run apt upgrade but never ran apt update. What is the risk?',
                  solution: {
                    explanation:
                      'You are upgrading against a stale index, so you may not see the newest available versions and could fetch outdated package metadata. Always update before upgrade.',
                  },
                },
              ],
              docs: 'https://wiki.debian.org/SourcesList',
            },
            {
              id: 'lx3-t2-c2',
              title: 'Tarballs and building from source',
              summary:
                'Not all software comes packaged. Tarballs (.tar.gz) bundle files for distribution, and some programs are installed by compiling their source.',
              explanation:
                'Sometimes you receive software as a tarball, an archive created by tar and usually compressed with gzip (.tar.gz or .tgz) or xz (.tar.xz). tar both creates and extracts these: tar -xzf file.tar.gz extracts a gzipped archive (x extract, z gzip, f file), while tar -czf out.tar.gz dir/ creates one. A memorable mnemonic is x for extract and c for create, with v added for verbose listing. After extracting source code, the traditional build flow is ./configure to detect your system, make to compile, and sudo make install to copy the result into place, though many modern projects use cmake or language-specific tooling instead. Building from source gives the latest version and custom options but skips the dependency tracking and easy removal a package manager provides, so prefer packages when they exist and build from source only when necessary.',
              analogy:
                'A tarball is a vacuum-packed flat-pack: tar -x unpacks the box, and configure-make-install is assembling and bolting the furniture into your house — powerful, but without the tidy receipt a package manager would have kept.',
              keyPoints: [
                'A tarball bundles files with tar, often gzip or xz compressed.',
                'tar -xzf extracts a .tar.gz; tar -czf creates one.',
                'Mnemonic: x extract, c create, z gzip, v verbose, f file.',
                'Classic source build: ./configure, make, sudo make install.',
                'Building from source lacks package-manager tracking, so prefer packages when available.',
              ],
              code: {
                language: 'bash',
                lines: [
                  '# Extract a gzipped tarball',
                  'tar -xzf program-1.2.tar.gz',
                  '# List contents without extracting',
                  'tar -tzf program-1.2.tar.gz',
                  '# Create a compressed archive of a directory',
                  'tar -czf backup.tar.gz project/',
                  '# Classic build-from-source flow',
                  'cd program-1.2 && ./configure && make && sudo make install',
                ],
                explanation:
                  '-xzf extracts, -tzf lists, -czf creates a gzipped archive, and the configure/make/install trio compiles and installs source code.',
              },
              commonMistakes: [
                'Confusing tar -x (extract) with tar -c (create) and accidentally overwriting an archive instead of unpacking it.',
              ],
              exercises: [
                {
                  type: 'task',
                  prompt: 'Extract the contents of an archive named release.tar.gz into the current directory.',
                  solution: {
                    lines: ['tar -xzf release.tar.gz'],
                    explanation:
                      'x extracts, z handles gzip decompression, and f names the file; the archive is unpacked into the current directory.',
                  },
                },
                {
                  type: 'predict',
                  prompt: 'What does tar -czf logs.tar.gz /var/log do?',
                  solution: {
                    explanation:
                      'It creates (c) a new gzip-compressed (z) archive file (f) named logs.tar.gz containing everything under /var/log.',
                  },
                },
                {
                  type: 'quiz',
                  prompt: 'Why is installing from a package manager usually preferable to building from source?',
                  hint: 'Think about dependencies and removal.',
                  solution: {
                    explanation:
                      'Package managers resolve dependencies, verify signatures, and track files for clean updates and removal. Source builds give you none of that bookkeeping.',
                  },
                },
              ],
              docs: 'https://www.gnu.org/software/tar/manual/tar.html',
            },
          ],
        },
      ],
    },
    /* ─────────────── LEVEL 4 — SYSTEM ADMINISTRATION ─────────────── */
    {
      level: 4,
      name: 'System administration',
      focus: 'Managing services with systemd, networking, and disks and filesystems',
      accent: '#f59e0b',
      soft: '#fff4e0',
      topics: [
        {
          id: 'lx4-t0',
          name: 'Services and systemd',
          concepts: [
            {
              id: 'lx4-t0-c0',
              title: 'Managing services with systemctl',
              summary:
                'systemd is the init system on most modern distros, and systemctl is how you start, stop, enable and inspect services.',
              explanation:
                'systemd is the first process (PID 1) on most current distributions; it boots the system and manages background services, called daemons. You control it through systemctl. The most common verbs operate on a service by name: systemctl start NAME launches it now, systemctl stop NAME halts it, systemctl restart NAME stops and starts it (useful after a config change), and systemctl reload NAME re-reads configuration without a full restart where supported. There is a key distinction between running and enabled: start affects only the current session, while systemctl enable NAME makes the service start automatically at boot (and disable undoes that). systemctl status NAME shows whether it is active, its recent log lines, and its PID, making it the first command to run when diagnosing a service. Service names usually end in .service, though the suffix can often be omitted.',
              analogy:
                'systemctl is the control panel for the building\'s utilities: start and stop flip a system on or off right now, while enable decides whether it switches itself on automatically every morning when the building opens.',
              keyPoints: [
                'systemd is PID 1; systemctl manages its services (daemons).',
                'start, stop, restart and reload act on the running state now.',
                'enable makes a service start at boot; disable stops that.',
                'Running and enabled are independent states.',
                'systemctl status is the go-to command for diagnosing a service.',
              ],
              diagram: {
                type: 'mermaid',
                lines: [
                  'flowchart LR',
                  '  S[systemctl start] --> R[Running now]',
                  '  E[systemctl enable] --> B[Starts at boot]',
                  '  R --> ST[systemctl status]',
                  '  B --> ST',
                ],
                caption: 'start controls the current run; enable controls boot behaviour. They are separate decisions.',
              },
              code: {
                language: 'bash',
                lines: [
                  '# Start a service now',
                  'sudo systemctl start nginx',
                  '# Make it start at every boot',
                  'sudo systemctl enable nginx',
                  '# Apply a new config',
                  'sudo systemctl restart nginx',
                  '# Check whether it is healthy',
                  'systemctl status nginx',
                ],
                explanation:
                  'start runs it now, enable persists it across reboots, restart applies config changes, and status reports health and recent logs.',
              },
              commonMistakes: [
                'Running systemctl start but forgetting systemctl enable, so the service works now but does not come back after a reboot.',
              ],
              exercises: [
                {
                  type: 'task',
                  prompt: 'Make the ssh service both start immediately and come back automatically after a reboot.',
                  solution: {
                    lines: ['sudo systemctl enable --now ssh'],
                    explanation:
                      'enable --now both enables the unit for boot and starts it immediately, combining the two steps.',
                  },
                },
                {
                  type: 'quiz',
                  prompt: 'What is the difference between systemctl start and systemctl enable?',
                  hint: 'One is about now, one is about boot.',
                  solution: {
                    explanation:
                      'start runs the service in the current session; enable configures it to start automatically at boot. A service can be enabled but not currently running, or running but not enabled.',
                  },
                },
                {
                  type: 'predict',
                  prompt: 'You edit nginx config and run systemctl status nginx. Has your new config taken effect?',
                  solution: {
                    explanation:
                      'No. status only reports state; you must restart or reload the service for configuration changes to apply.',
                  },
                },
              ],
              docs: 'https://www.freedesktop.org/software/systemd/man/latest/systemctl.html',
            },
            {
              id: 'lx4-t0-c1',
              title: 'Units, targets and the unit file',
              summary:
                'systemd manages everything as units described by unit files. Targets group units to represent system states like multi-user or graphical.',
              explanation:
                'systemd models the system as a collection of units, each a resource it manages, described by a declarative unit file. The most common is the .service unit for a daemon, but there are also .socket, .timer, .mount and .target units. A service unit file has sections: [Unit] holds metadata and ordering directives like After and Requires, [Service] defines how to run it such as ExecStart and the Restart policy, and [Install] declares when it should be enabled, typically WantedBy a target. Targets replace the old runlevels: they are named groupings of units representing a system state, such as multi-user.target for a normal text-mode multi-user system or graphical.target for a desktop. Distribution-provided units live in /usr/lib/systemd/system, while local overrides go in /etc/systemd/system; after editing unit files you run systemctl daemon-reload so systemd re-reads them.',
              analogy:
                'Unit files are recipe cards and targets are full menus: a target says serve everything needed for the dinner service, pulling in all the individual dishes (units) required for that state.',
              keyPoints: [
                'Everything systemd manages is a unit with a unit file.',
                'A .service file has [Unit], [Service] and [Install] sections.',
                'Targets group units into system states, replacing runlevels.',
                'multi-user.target is text multi-user; graphical.target adds the desktop.',
                'Run systemctl daemon-reload after editing unit files.',
              ],
              code: {
                language: 'bash',
                lines: [
                  '# View a unit file',
                  'systemctl cat nginx.service',
                  '# List all loaded service units',
                  'systemctl list-units --type=service',
                  '# Show the default boot target',
                  'systemctl get-default',
                  '# Reload after editing unit files',
                  'sudo systemctl daemon-reload',
                ],
                explanation:
                  'cat shows a unit file, list-units enumerates services, get-default reveals the boot target, and daemon-reload re-reads changed unit files.',
              },
              commonMistakes: [
                'Editing a unit file and not running systemctl daemon-reload, so systemd keeps using the old definition.',
              ],
              exercises: [
                {
                  type: 'predict',
                  prompt: 'In a service unit file, what does the WantedBy=multi-user.target line in the [Install] section do?',
                  solution: {
                    explanation:
                      'It tells systemd that when the service is enabled, it should be started as part of reaching multi-user.target, i.e. on a normal boot.',
                  },
                },
                {
                  type: 'task',
                  prompt: 'Display the full unit file for the cron service.',
                  solution: {
                    lines: ['systemctl cat cron.service'],
                    explanation:
                      'systemctl cat prints the effective unit file, including any drop-in overrides, without you needing to know its path.',
                  },
                },
                {
                  type: 'quiz',
                  prompt: 'What modern systemd concept replaces the old SysV runlevels?',
                  hint: 'It is a kind of unit that groups others.',
                  solution: {
                    explanation:
                      'Targets. For example, multi-user.target corresponds roughly to runlevel 3 and graphical.target to runlevel 5.',
                  },
                },
              ],
              docs: 'https://www.freedesktop.org/software/systemd/man/latest/systemd.unit.html',
            },
            {
              id: 'lx4-t0-c2',
              title: 'Reading logs with journalctl',
              summary:
                'systemd collects logs into the journal, and journalctl queries them with powerful filters by unit, time and priority.',
              explanation:
                'systemd captures the output and logging of every service into a centralised, indexed store called the journal, queried with journalctl. Without arguments it shows all journal entries, oldest first, paged through less. The real power is filtering. journalctl -u NAME shows only one service\'s logs, which is the fastest way to see why a service failed. journalctl -f follows new entries live, like tail -f for the whole system. Time filters such as --since and --until accept human phrasing like --since "10 min ago" or --since today. journalctl -b limits output to the current boot, and -p err shows only error-priority and worse. journalctl -e jumps to the end. Because the journal is structured, these filters compose, so journalctl -u nginx --since today -p warning isolates exactly the warnings from nginx today. On many systems the journal is supplemented or mirrored by traditional text files under /var/log.',
              analogy:
                'The journal is a searchable database of everything the system has said, and journalctl is the query box: instead of scrolling through a giant logbook, you ask show me only what nginx said in the last hour at warning level.',
              keyPoints: [
                'systemd records service output in the centralised journal.',
                'journalctl -u NAME filters to a single service.',
                'journalctl -f follows new log entries live.',
                '--since and --until accept human time phrases.',
                'journalctl -b limits to the current boot; -p err filters by priority.',
              ],
              code: {
                language: 'bash',
                lines: [
                  '# Logs for one service',
                  'journalctl -u nginx',
                  '# Follow new log lines live',
                  'journalctl -f',
                  '# Errors since today for one unit',
                  'journalctl -u nginx -p err --since today',
                  '# Logs from the current boot only',
                  'journalctl -b',
                ],
                explanation:
                  '-u scopes to a service, -f follows live, -p filters by priority, --since filters by time, and -b limits to this boot.',
              },
              commonMistakes: [
                'Forgetting that the default journal may not persist across reboots unless /var/log/journal exists; without it, -b on a previous boot may show nothing.',
              ],
              exercises: [
                {
                  type: 'task',
                  prompt: 'Watch the live logs of the ssh service as they happen.',
                  solution: {
                    lines: ['journalctl -u ssh -f'],
                    explanation:
                      '-u ssh scopes to the ssh unit and -f follows, printing each new entry from that service as it is logged.',
                  },
                },
                {
                  type: 'predict',
                  prompt: 'What does journalctl -u nginx --since "1 hour ago" -p warning show?',
                  solution: {
                    explanation:
                      'Only nginx log entries from the last hour at warning priority or more severe, combining unit, time and priority filters.',
                  },
                },
                {
                  type: 'quiz',
                  prompt: 'Which journalctl option restricts output to only the current boot?',
                  hint: 'A single short letter.',
                  solution: {
                    explanation:
                      '-b. You can also pass an offset like -b -1 to view the previous boot if persistent journaling is enabled.',
                  },
                },
              ],
              docs: 'https://www.freedesktop.org/software/systemd/man/latest/journalctl.html',
            },
          ],
        },
        {
          id: 'lx4-t1',
          name: 'Networking on Linux',
          concepts: [
            {
              id: 'lx4-t1-c0',
              title: 'Inspecting interfaces and connections with ip and ss',
              summary:
                'The ip command manages network interfaces and addresses, while ss reports open sockets and listening ports. They replace older ifconfig and netstat.',
              explanation:
                'Modern Linux networking is inspected and configured with the ip command from the iproute2 package, which superseded the deprecated ifconfig and route. ip addr (or ip a) lists each interface with its IP addresses; ip link shows the link layer and lets you bring interfaces up or down with ip link set NAME up; and ip route shows the routing table, including the default gateway that traffic to the wider internet flows through. For connections and ports, ss (socket statistics) replaces netstat: ss -tlnp lists TCP (t) listening (l) sockets with numeric ports (n) and the owning process (p), which is exactly how you discover what is listening on a port and which program owns it. Together ip and ss answer the two core questions of host networking: what addresses and routes do I have, and what is talking on the network.',
              analogy:
                'ip is the building\'s wiring diagram and address book — which lines exist and what number each has — while ss is the switchboard log showing which extensions are currently open and waiting for calls.',
              keyPoints: [
                'ip addr shows interfaces and their IP addresses.',
                'ip link controls the link layer; ip link set NAME up enables an interface.',
                'ip route shows the routing table and default gateway.',
                'ss -tlnp lists listening TCP sockets and their owning processes.',
                'ip and ss replace the deprecated ifconfig and netstat.',
              ],
              code: {
                language: 'bash',
                lines: [
                  '# Show interfaces and IP addresses',
                  'ip addr',
                  '# Show the routing table and default gateway',
                  'ip route',
                  '# What is listening on TCP ports, with process names',
                  'ss -tlnp',
                  '# Bring an interface up',
                  'sudo ip link set eth0 up',
                ],
                explanation:
                  'ip addr and ip route reveal addresses and routing; ss -tlnp shows listening ports and owners; ip link set ... up enables an interface.',
              },
              commonMistakes: [
                'Reaching for ifconfig out of habit on a minimal modern system where it is not installed; use ip addr instead.',
              ],
              exercises: [
                {
                  type: 'task',
                  prompt: 'List all TCP ports the machine is listening on, along with the processes that own them.',
                  solution: {
                    lines: ['sudo ss -tlnp'],
                    explanation:
                      '-t limits to TCP, -l to listening sockets, -n keeps ports numeric, and -p shows the owning process; sudo is needed to see process names for all sockets.',
                  },
                },
                {
                  type: 'quiz',
                  prompt: 'Which command shows the default gateway your traffic uses to reach the internet?',
                  hint: 'It is about routes.',
                  solution: {
                    explanation:
                      'ip route. The line beginning with default shows the gateway address and the interface used for non-local traffic.',
                  },
                },
                {
                  type: 'predict',
                  prompt: 'You run ip addr and an interface shows state DOWN with no IP. What is likely wrong?',
                  solution: {
                    explanation:
                      'The interface is administratively or physically down, so it has no address. You may need ip link set NAME up and/or a working cable or DHCP lease.',
                  },
                },
              ],
              docs: 'https://man7.org/linux/man-pages/man8/ip.8.html',
            },
            {
              id: 'lx4-t1-c1',
              title: 'Testing connectivity with ping and traceroute',
              summary:
                'ping checks whether a host is reachable and how fast, while traceroute reveals the path packets take and where delays or failures occur.',
              explanation:
                'When connectivity breaks, two tools diagnose the network layer. ping sends ICMP echo requests to a host and reports replies with round-trip times, telling you both whether the host responds and how long it takes; it runs until you stop it with Ctrl+C, or use -c N to send a fixed count. A successful ping to an IP but a failure to ping a hostname points to a DNS problem rather than a connectivity one. traceroute (or tracepath) maps the route to a destination, listing each router (hop) along the way with its latency, so you can see exactly where packets stall or stop — invaluable for spotting a broken link or a slow intermediate network. A common diagnostic ladder is: ping your gateway, then ping a public IP like 8.8.8.8, then ping a hostname; each step that fails narrows the problem to local network, internet routing, or DNS respectively.',
              analogy:
                'ping is shouting hello across a canyon and timing the echo to confirm someone is there; traceroute is following the trail step by step to see which bridge along the route is out.',
              keyPoints: [
                'ping sends ICMP echoes and reports reachability and round-trip time.',
                'ping -c N sends a fixed number of probes instead of running forever.',
                'Pinging an IP but not a name suggests a DNS issue, not connectivity.',
                'traceroute lists each hop and its latency to the destination.',
                'A ping ladder (gateway, public IP, hostname) isolates where a problem lies.',
              ],
              code: {
                language: 'bash',
                lines: [
                  '# Send four pings then stop',
                  'ping -c 4 example.com',
                  '# Ping a public IP to test raw connectivity',
                  'ping -c 4 8.8.8.8',
                  '# Trace the path to a host',
                  'traceroute example.com',
                ],
                explanation:
                  'ping -c 4 tests reachability with a fixed count; pinging 8.8.8.8 versus a name separates connectivity from DNS; traceroute shows each hop on the way.',
              },
              commonMistakes: [
                'Concluding a host is down because ping fails, when many servers and firewalls simply block ICMP; test a real service or port too.',
              ],
              exercises: [
                {
                  type: 'task',
                  prompt: 'Send exactly five echo requests to the host 1.1.1.1 and then stop automatically.',
                  solution: {
                    lines: ['ping -c 5 1.1.1.1'],
                    explanation:
                      '-c 5 limits ping to five probes, after which it prints a summary and exits instead of running until interrupted.',
                  },
                },
                {
                  type: 'predict',
                  prompt: 'ping 8.8.8.8 works, but ping example.com fails with a resolution error. Where is the problem?',
                  solution: {
                    explanation:
                      'In DNS. Raw IP connectivity works, but the system cannot resolve the hostname to an address, pointing to a DNS configuration or server issue.',
                  },
                },
                {
                  type: 'quiz',
                  prompt: 'What does traceroute reveal that ping does not?',
                  hint: 'Think about the journey, not just the destination.',
                  solution: {
                    explanation:
                      'The sequence of routers (hops) packets pass through and the latency at each, so you can locate where along the path traffic slows or stops.',
                  },
                },
              ],
              docs: 'https://man7.org/linux/man-pages/man8/ping.8.html',
            },
            {
              id: 'lx4-t1-c2',
              title: 'Remote access and transfers with ssh, scp, curl and wget',
              summary:
                'ssh gives you an encrypted shell on a remote machine, scp copies files over that secure channel, and curl and wget fetch data over the network.',
              explanation:
                'ssh (secure shell) is how you log into and run commands on remote Linux machines over an encrypted connection: ssh user@host opens a remote shell, and ssh user@host "command" runs a single command and returns. Built on the same protocol, scp copies files securely between machines, with the remote side written as user@host:/path, so scp file.txt user@host:/tmp/ uploads and adding -r copies directories; rsync is a more efficient alternative for large or repeated transfers. For fetching data over HTTP and other protocols there are two staples. curl prints a URL\'s contents to stdout by default and is the Swiss-army knife for APIs, supporting headers, methods and data with options like -O to save to a file and -L to follow redirects. wget is geared toward downloading files and recursive mirroring, saving to disk by default and handling resumes well. Knowing these four lets you operate, move data to, and pull resources onto remote servers entirely from the command line.',
              analogy:
                'ssh is a secure phone line into another building, scp is a sealed courier sending packages down that same line, and curl and wget are two delivery services for fetching things from the wider web — curl the versatile errand-runner, wget the dedicated download truck.',
              keyPoints: [
                'ssh user@host opens an encrypted remote shell; append a command to run just that.',
                'scp copies over SSH; remote paths look like user@host:/path, and -r copies directories.',
                'curl fetches URLs to stdout; -O saves to a file and -L follows redirects.',
                'wget downloads files to disk by default and can mirror recursively.',
                'rsync is preferred for large or repeated transfers.',
              ],
              code: {
                language: 'bash',
                lines: [
                  '# Log into a remote server',
                  'ssh ana@server.example.com',
                  '# Run one command remotely and return',
                  'ssh ana@server.example.com "df -h"',
                  '# Copy a file to the server',
                  'scp report.pdf ana@server.example.com:/tmp/',
                  '# Fetch a URL and follow redirects, saving to a file',
                  'curl -L -O https://example.com/file.tar.gz',
                ],
                explanation:
                  'ssh opens a session or runs a remote command, scp uploads over the same secure channel, and curl downloads a file following any redirects.',
              },
              commonMistakes: [
                'Forgetting the colon in an scp remote path (user@host/path instead of user@host:/path), which scp then treats as a local filename.',
              ],
              exercises: [
                {
                  type: 'task',
                  prompt: 'Copy a local directory called site to /var/www on the remote host as user deploy.',
                  solution: {
                    lines: ['scp -r site deploy@host:/var/www'],
                    explanation:
                      '-r copies the directory recursively, and the remote path uses the user@host:/path form over the secure SSH channel.',
                  },
                },
                {
                  type: 'quiz',
                  prompt: 'What is the difference in default behaviour between curl and wget when you give them a URL?',
                  hint: 'Where does the output go?',
                  solution: {
                    explanation:
                      'curl prints the content to stdout by default, while wget saves it to a file on disk. curl needs -O (or redirection) to save, and wget excels at downloads and mirroring.',
                  },
                },
                {
                  type: 'predict',
                  prompt: 'What does ssh user@host "uptime" do, and do you end up in a remote shell?',
                  solution: {
                    explanation:
                      'It runs the uptime command on the remote host, prints the result, and returns immediately. You do not get an interactive shell because a command was specified.',
                  },
                },
              ],
              docs: 'https://man.openbsd.org/ssh',
            },
            {
              id: 'lx4-t1-c3',
              title: 'Name resolution: the hosts file and DNS',
              summary:
                'Turning a hostname into an IP address is name resolution. The local /etc/hosts file is checked first, then DNS servers configured for the system.',
              explanation:
                'Humans use names like example.com but the network needs IP addresses, so the system performs name resolution. It first consults the local static map in /etc/hosts, where each line pairs an IP with one or more names — useful for hard-coding a host or pointing a name at a test server. If a name is not found there, the resolver queries DNS (the Domain Name System), the distributed directory of the internet. Which DNS servers to use is configured in /etc/resolv.conf, though on many modern systems that file is managed automatically by systemd-resolved or NetworkManager rather than edited by hand. The order of these lookup sources is governed by /etc/nsswitch.conf. To query DNS directly and troubleshoot, use dig (detailed) or host (concise): dig example.com returns the address records and which server answered. Understanding this chain explains why a name might resolve on one machine but not another, or why an /etc/hosts entry can override real DNS.',
              analogy:
                '/etc/hosts is your personal speed-dial list checked first, and DNS is the global phone directory consulted when a name is not in your speed dial; resolv.conf is the directory service\'s phone number.',
              keyPoints: [
                'Name resolution turns hostnames into IP addresses.',
                '/etc/hosts is a local static map, consulted before DNS.',
                'DNS is the distributed internet directory queried when a name is not local.',
                '/etc/resolv.conf lists DNS servers, often managed automatically now.',
                'dig and host query DNS directly for troubleshooting.',
              ],
              diagram: {
                type: 'mermaid',
                lines: [
                  'flowchart TD',
                  '  N[Hostname lookup] --> H{In etc hosts}',
                  '  H -->|yes| IP[Use that IP]',
                  '  H -->|no| D[Query DNS servers]',
                  '  D --> IP',
                ],
                caption: 'Resolution checks the local hosts file first, then falls back to DNS.',
              },
              code: {
                language: 'bash',
                lines: [
                  '# View the local static name map',
                  'cat /etc/hosts',
                  '# Query DNS in detail',
                  'dig example.com',
                  '# A concise lookup',
                  'host example.com',
                  '# See which DNS servers are configured',
                  'cat /etc/resolv.conf',
                ],
                explanation:
                  '/etc/hosts is checked first; dig and host query DNS directly; /etc/resolv.conf lists the DNS servers the resolver uses.',
              },
              commonMistakes: [
                'Hard-coding an entry in /etc/hosts for testing and forgetting it, then being confused later when a name resolves to the wrong, stale IP.',
              ],
              exercises: [
                {
                  type: 'task',
                  prompt: 'Look up the IP address records for the domain wikipedia.org using a detailed DNS query tool.',
                  solution: {
                    lines: ['dig wikipedia.org'],
                    explanation:
                      'dig queries DNS and prints the answer section with the A/AAAA records and which server responded.',
                  },
                },
                {
                  type: 'predict',
                  prompt: 'You add 10.0.0.5 db.local to /etc/hosts. What happens when you ping db.local?',
                  solution: {
                    explanation:
                      'It resolves to 10.0.0.5, because /etc/hosts is consulted before DNS, so the static entry takes precedence over any DNS record.',
                  },
                },
                {
                  type: 'quiz',
                  prompt: 'Which file is checked first during hostname resolution, the hosts file or DNS?',
                  hint: 'Local before remote.',
                  solution: {
                    explanation:
                      'The local /etc/hosts file is normally checked before DNS, as configured by /etc/nsswitch.conf. This lets local entries override DNS.',
                  },
                },
              ],
              docs: 'https://man7.org/linux/man-pages/man5/hosts.5.html',
            },
          ],
        },
        {
          id: 'lx4-t2',
          name: 'Disks and filesystems',
          concepts: [
            {
              id: 'lx4-t2-c0',
              title: 'Checking space with df and du',
              summary:
                'df reports free and used space per filesystem, while du measures how much space specific files and directories consume.',
              explanation:
                'Two complementary tools answer where has my disk space gone. df (disk free) summarises each mounted filesystem: total size, used, available and percentage full, plus the mount point. df -h makes the figures human-readable in K, M and G, and it is the first command to run when a disk fills up because it tells you which filesystem is the problem. du (disk usage) drills into directories, totalling the size of their contents. du -sh DIR gives a single summarised, human-readable total for a directory, while du -h --max-depth=1 breaks a directory into its immediate children so you can find the heavy subdirectory. A classic investigation is df -h to see the full filesystem, then du -sh * in a suspect directory, repeatedly descending into the largest entry until you locate the culprit. Note the two can disagree because deleted-but-still-open files count in df but not du.',
              analogy:
                'df is checking the fuel gauge for each tank in the vehicle; du is opening a specific tank and weighing exactly what is inside, item by item.',
              keyPoints: [
                'df shows per-filesystem total, used, available and percent full.',
                'df -h is human-readable and the first stop when a disk fills.',
                'du measures the size of files and directories.',
                'du -sh DIR gives one summarised total; --max-depth=1 breaks it down.',
                'Investigate with df first, then du to descend into the heavy directory.',
              ],
              code: {
                language: 'bash',
                lines: [
                  '# Free space per filesystem, human-readable',
                  'df -h',
                  '# Total size of one directory',
                  'du -sh /var/log',
                  '# Size of each immediate subdirectory',
                  'du -h --max-depth=1 /var',
                  '# Find the biggest entries under home, sorted',
                  'du -h --max-depth=1 ~ | sort -h',
                ],
                explanation:
                  'df -h shows which filesystem is full; du -sh totals a directory; --max-depth=1 plus sort -h ranks subdirectories so you can drill into the largest.',
              },
              commonMistakes: [
                'Running du on huge trees without a depth limit and waiting forever; cap it with --max-depth or target a specific subtree.',
              ],
              exercises: [
                {
                  type: 'task',
                  prompt: 'Show the available and used space of every mounted filesystem in human-readable units.',
                  solution: {
                    lines: ['df -h'],
                    explanation:
                      'df lists each filesystem and -h prints sizes in K/M/G, including the use percentage and mount point.',
                  },
                },
                {
                  type: 'task',
                  prompt: 'Find which immediate subdirectory of /var is using the most space, largest last.',
                  solution: {
                    lines: ['du -h --max-depth=1 /var | sort -h'],
                    explanation:
                      '--max-depth=1 totals each direct child of /var, and sort -h orders the human-readable sizes so the biggest appears at the bottom.',
                  },
                },
                {
                  type: 'predict',
                  prompt: 'df says a filesystem is 95% full, but du -sh of every visible directory adds up to far less. What could explain the gap?',
                  solution: {
                    explanation:
                      'Likely files that were deleted while still open by a running process: the space is not freed until the process closes them, so df counts it but du, which walks the directory tree, does not see them.',
                  },
                },
              ],
              docs: 'https://www.gnu.org/software/coreutils/manual/html_node/df-invocation.html',
            },
            {
              id: 'lx4-t2-c1',
              title: 'Block devices and lsblk',
              summary:
                'Disks and partitions are block devices under /dev. lsblk presents them as a clear tree showing sizes, mount points and relationships.',
              explanation:
                'Storage hardware appears in Linux as block devices in /dev, named like sda for the first SATA/SCSI disk, sdb for the second, and nvme0n1 for an NVMe SSD, with partitions numbered such as sda1 and sda2. The clearest way to see them is lsblk, which prints a tree of devices and their partitions with each one\'s size, type and current mount point — far more readable than poking around /dev directly. For partitioning details you can use fdisk -l (or the newer parted), and blkid shows each device\'s filesystem type and UUID, a stable identifier used in configuration instead of the device name, which can change between boots. Understanding that a physical disk (sda) contains partitions (sda1) that hold filesystems, which are then mounted into the directory tree, is the mental model behind everything in this topic.',
              analogy:
                'A block device is a physical filing cabinet (the disk), partitions are its drawers, and lsblk is the floor plan showing every cabinet, its drawers, their sizes, and where each drawer is currently wheeled into the office (mounted).',
              keyPoints: [
                'Disks and partitions are block devices in /dev (sda, nvme0n1, sda1).',
                'lsblk shows a tree of devices, sizes, types and mount points.',
                'A disk holds partitions, which hold filesystems, which get mounted.',
                'blkid shows each device\'s filesystem type and UUID.',
                'UUIDs are stable identifiers, unlike device names that can change.',
              ],
              code: {
                language: 'bash',
                lines: [
                  '# Tree of disks, partitions and mount points',
                  'lsblk',
                  '# Include filesystem type and label',
                  'lsblk -f',
                  '# Show UUIDs and filesystem types',
                  'sudo blkid',
                ],
                explanation:
                  'lsblk gives the readable device tree, lsblk -f adds filesystem details, and blkid reveals the UUIDs used in stable configuration.',
              },
              commonMistakes: [
                'Assuming device names like /dev/sdb are stable across reboots; they can change, which is why fstab uses UUIDs.',
              ],
              exercises: [
                {
                  type: 'task',
                  prompt: 'Display all block devices as a tree, including each one\'s filesystem type and mount point.',
                  solution: {
                    lines: ['lsblk -f'],
                    explanation:
                      'lsblk shows the device tree and -f adds the filesystem type, label, UUID and mount point for each entry.',
                  },
                },
                {
                  type: 'quiz',
                  prompt: 'In the name /dev/sda2, what do sda and 2 refer to?',
                  hint: 'One is the disk, one is a slice of it.',
                  solution: {
                    explanation:
                      'sda is the whole disk (the first SATA/SCSI drive) and 2 is its second partition. The partition holds a filesystem that can be mounted.',
                  },
                },
                {
                  type: 'predict',
                  prompt: 'Why does /etc/fstab usually reference filesystems by UUID rather than by /dev/sdb1?',
                  solution: {
                    explanation:
                      'Because device names can change between boots (a disk may become sdc), whereas the UUID is fixed to the filesystem, so mounting by UUID is reliable.',
                  },
                },
              ],
              docs: 'https://man7.org/linux/man-pages/man8/lsblk.8.html',
            },
            {
              id: 'lx4-t2-c2',
              title: 'Mounting, fstab, partitions and filesystem types',
              summary:
                'Mounting attaches a filesystem into the directory tree. /etc/fstab makes mounts persistent, and the filesystem type determines features and limits.',
              explanation:
                'A partition\'s filesystem only becomes usable when it is mounted onto a directory (the mount point). mount /dev/sdb1 /mnt attaches it there temporarily, and umount /mnt detaches it; you must not unmount a filesystem that is in use. Manual mounts vanish on reboot, so for permanent mounts you add a line to /etc/fstab, which systemd reads at boot to mount everything automatically. Each fstab line has six fields: the device (best given as UUID=...), the mount point, the filesystem type, mount options like defaults or noatime, and two numeric fields for dump and fsck order. The filesystem type matters: ext4 is the reliable, general-purpose default on most Linux systems; xfs excels with large files and parallel I/O; btrfs and zfs add snapshots and checksumming; and vfat or exFAT are used for cross-platform removable media. A wrong fstab entry can prevent boot, so it is wise to test with mount -a after editing, which mounts everything in fstab and surfaces errors immediately.',
              analogy:
                'Mounting is plugging a drive into a specific socket (directory) in your house so its contents appear there; /etc/fstab is the wiring list that tells the house to plug all those drives into the same sockets automatically every time the power comes on.',
              keyPoints: [
                'Mounting attaches a filesystem to a directory; umount detaches it.',
                'Manual mounts are temporary; /etc/fstab makes them persistent at boot.',
                'An fstab line: device, mount point, type, options, dump, fsck order.',
                'ext4 is the general default; xfs, btrfs, zfs, vfat suit other needs.',
                'Test fstab edits with mount -a to catch errors before reboot.',
              ],
              diagram: {
                type: 'mermaid',
                lines: [
                  'flowchart TD',
                  '  D[Partition sdb1] --> FS[Filesystem ext4]',
                  '  FS --> M[mount onto a directory]',
                  '  M --> T[Appears in the tree]',
                  '  F[etc fstab] --> M',
                ],
                caption: 'A partition holds a filesystem that is mounted onto a directory; fstab automates that mounting at boot.',
              },
              code: {
                language: 'bash',
                lines: [
                  '# Mount a partition temporarily',
                  'sudo mount /dev/sdb1 /mnt/data',
                  '# Unmount it',
                  'sudo umount /mnt/data',
                  '# An example fstab line (device options dump fsck)',
                  '# UUID=abcd-1234 /mnt/data ext4 defaults 0 2',
                  '# Test all fstab entries safely',
                  'sudo mount -a',
                ],
                explanation:
                  'mount and umount attach and detach manually; an fstab line makes it persistent; mount -a validates fstab without rebooting.',
              },
              commonMistakes: [
                'Adding a faulty /etc/fstab entry and rebooting without testing, which can leave the system unable to boot; always run mount -a first.',
              ],
              exercises: [
                {
                  type: 'task',
                  prompt: 'After editing /etc/fstab, verify that every entry mounts correctly without rebooting.',
                  solution: {
                    lines: ['sudo mount -a'],
                    explanation:
                      'mount -a attempts to mount all filesystems listed in fstab (that are not already mounted), surfacing any errors immediately instead of at the next boot.',
                  },
                },
                {
                  type: 'quiz',
                  prompt: 'What does it mean to mount a filesystem?',
                  hint: 'It is about where the contents appear.',
                  solution: {
                    explanation:
                      'It attaches the filesystem to a directory (the mount point) so its files become accessible within the unified directory tree. Until mounted, the data is not reachable through the tree.',
                  },
                },
                {
                  type: 'predict',
                  prompt: 'You try umount /mnt/data while a shell is sitting in that directory. What happens?',
                  solution: {
                    explanation:
                      'It fails with a target is busy error, because the filesystem is in use. You must cd out (or stop the processes using it) before it can be unmounted.',
                  },
                },
              ],
              docs: 'https://man7.org/linux/man-pages/man5/fstab.5.html',
            },
          ],
        },
      ],
    },
    /* ─────────────── LEVEL 5 — SCRIPTING & HARDENING ─────────────── */
    {
      level: 5,
      name: 'Scripting and hardening',
      focus: 'Writing bash scripts, automating with schedules, and securing the system',
      accent: '#f59e0b',
      soft: '#fff4e0',
      topics: [
        {
          id: 'lx5-t0',
          name: 'Bash scripting',
          concepts: [
            {
              id: 'lx5-t0-c0',
              title: 'The shebang, running scripts and exit codes',
              summary:
                'A script is a text file of commands. The shebang line tells the system which interpreter to use, and every command returns an exit code signalling success or failure.',
              explanation:
                'A shell script is just a text file containing commands you could type by hand. The first line, the shebang, begins with #! followed by the interpreter path, conventionally #!/usr/bin/env bash, which finds bash via the PATH and makes the script portable. To run a script you make it executable with chmod +x script.sh and invoke it as ./script.sh, or you run it directly with bash script.sh without the executable bit. Every command sets an exit code (also called exit status) in the special variable $?: zero means success and any non-zero value means failure, with different numbers conveying different errors. This convention drives all control flow — conditionals and && / || chains test exit codes, not text. Scripts themselves return an exit code via exit N, and good scripts exit non-zero on failure so callers and automation can detect problems. Adding set -e makes a script abort on the first failing command, a common safety measure.',
              analogy:
                'The shebang is the label on a document saying open me with this program; the exit code is the thumbs-up or thumbs-down each command flashes when it finishes, which the script reads to decide what to do next.',
              keyPoints: [
                'A script is a text file of commands; the shebang picks the interpreter.',
                '#!/usr/bin/env bash is the portable shebang for bash scripts.',
                'Make it executable with chmod +x, then run ./script.sh.',
                'Exit code 0 means success; non-zero means failure, stored in $?.',
                'set -e aborts the script on the first command that fails.',
              ],
              code: {
                language: 'bash',
                lines: [
                  '#!/usr/bin/env bash',
                  'set -euo pipefail',
                  'echo "Starting backup"',
                  'cp -r /data /backup',
                  '# Inspect the exit code of the last command',
                  'echo "cp exited with $?"',
                  'exit 0',
                ],
                explanation:
                  'The shebang selects bash, set -euo pipefail enables strict error handling, $? reports the last exit code, and exit 0 signals overall success.',
              },
              commonMistakes: [
                'Forgetting chmod +x and then being told permission denied when running ./script.sh; either add the executable bit or run it as bash script.sh.',
              ],
              exercises: [
                {
                  type: 'task',
                  prompt: 'Make a file named deploy.sh executable and then run it from the current directory.',
                  solution: {
                    lines: ['chmod +x deploy.sh', './deploy.sh'],
                    explanation:
                      'chmod +x grants execute permission, and ./ tells the shell to run the script in the current directory.',
                  },
                },
                {
                  type: 'predict',
                  prompt: 'A command succeeds. What value does echo $? print immediately afterwards?',
                  solution: {
                    explanation:
                      '0. A zero exit code means success; only non-zero values indicate an error.',
                  },
                },
                {
                  type: 'quiz',
                  prompt: 'Why is #!/usr/bin/env bash often preferred over #!/bin/bash as a shebang?',
                  hint: 'Think about where bash lives on different systems.',
                  solution: {
                    explanation:
                      'env locates bash via the PATH, so the script works even when bash is installed in a non-standard location, improving portability across systems.',
                  },
                },
              ],
              docs: 'https://www.gnu.org/software/bash/manual/bash.html#Bash-Startup-Files',
            },
            {
              id: 'lx5-t0-c1',
              title: 'Variables, quoting and command substitution',
              summary:
                'Variables store values; quoting controls how the shell expands them. Command substitution captures a command\'s output into a value.',
              explanation:
                'You assign a variable with name=value and no spaces around the equals sign, and read it with a leading dollar, $name or the safer ${name}. Quoting is where most beginners stumble. Inside double quotes the shell still expands variables and command substitution, so echo "Hello $USER" works; inside single quotes nothing is expanded, so echo \'Hello $USER\' prints the literal text. You should almost always wrap variable references in double quotes — "$file" not $file — because an unquoted variable containing spaces or wildcards is split into multiple words or glob-expanded, a frequent source of bugs. Command substitution captures the output of a command into a value using $(command) (preferred) or backticks; for example today=$(date +%F) stores the current date. Environment variables like $HOME and $PATH are simply variables exported into the environment so child processes inherit them, done with export NAME=value.',
              analogy:
                'Double quotes are a window — you see through them and the value behind is filled in; single quotes are a solid wall that shows only the literal words painted on it.',
              keyPoints: [
                'Assign with name=value (no spaces); read with "$name" or "${name}".',
                'Double quotes expand variables; single quotes are fully literal.',
                'Always quote variable references to avoid word-splitting and globbing.',
                'Command substitution $(cmd) captures a command\'s output into a value.',
                'export makes a variable an environment variable inherited by child processes.',
              ],
              code: {
                language: 'bash',
                lines: [
                  'name="Ada Lovelace"',
                  '# Quoted: prints the full name correctly',
                  'echo "Hello, $name"',
                  '# Single quotes are literal',
                  'echo \'Literal $name here\'',
                  '# Command substitution captures output',
                  'today=$(date +%F)',
                  'echo "Today is $today"',
                ],
                explanation:
                  'Double quotes expand $name; single quotes print it literally; $(date +%F) captures the date into the today variable.',
              },
              commonMistakes: [
                'Writing name = value with spaces around =, which the shell reads as a command named name with arguments; assignment must have no spaces.',
                'Leaving a variable unquoted so a value with spaces splits into several arguments.',
              ],
              exercises: [
                {
                  type: 'task',
                  prompt: 'Store the current working directory in a variable called here and print a message using it.',
                  solution: {
                    lines: ['here=$(pwd)', 'echo "You are in $here"'],
                    explanation:
                      'Command substitution $(pwd) captures the directory, and the double-quoted echo expands $here safely.',
                  },
                },
                {
                  type: 'predict',
                  prompt: 'With file="my report.txt", what is the difference between rm $file and rm "$file"?',
                  solution: {
                    explanation:
                      'rm $file splits on the space into two arguments (my and report.txt) and tries to delete two files. rm "$file" passes the single name "my report.txt" correctly. Always quote.',
                  },
                },
                {
                  type: 'quiz',
                  prompt: 'What does echo \'$HOME\' print, in single quotes?',
                  hint: 'Single quotes suppress expansion.',
                  solution: {
                    explanation:
                      'The literal text $HOME, because single quotes prevent any expansion. With double quotes it would print your home directory path.',
                  },
                },
              ],
              docs: 'https://www.gnu.org/software/bash/manual/bash.html#Shell-Parameters',
            },
            {
              id: 'lx5-t0-c2',
              title: 'Arguments, conditionals and loops',
              summary:
                'Scripts receive arguments as $1, $2 and so on. Conditionals with if and test branch on results, and loops repeat work over lists.',
              explanation:
                'Positional parameters give a script its inputs: $1 is the first argument, $2 the second, $@ is all of them, and $# is the count. Conditionals use if combined with a test, written either as the test command [ ... ] or the bash-specific [[ ... ]], which is safer with strings. Common tests are -f to check a file exists, -d for a directory, -z for an empty string, and numeric comparisons -eq, -lt and -gt; string equality uses =. The structure is if [[ condition ]]; then ...; elif ...; else ...; fi. Loops repeat: a for loop iterates over a list, for f in *.log; do ...; done, processing each match; a while loop runs as long as a condition holds, often reading input line by line. The crucial habit is quoting variables inside tests and loops, and remembering that the spaces inside [ ... ] are required syntax, not optional formatting.',
              analogy:
                'Arguments are the ingredients handed to a recipe, conditionals are the if the oven is hot, otherwise wait decision points, and loops are the repeat for each tray instruction that does the same step to many items.',
              keyPoints: [
                'Arguments arrive as $1, $2, ...; $@ is all and $# is the count.',
                'if [[ condition ]]; then ...; fi branches on a test result.',
                'Tests: -f file exists, -d directory, -z empty string, -eq/-lt/-gt numeric.',
                'for iterates over a list; while loops while a condition holds.',
                'Spaces inside [ ... ] are mandatory, and quote your variables.',
              ],
              diagram: {
                type: 'mermaid',
                lines: [
                  'flowchart TD',
                  '  S[Start] --> C{File exists}',
                  '  C -->|yes| P[Process file]',
                  '  C -->|no| E[Print error]',
                  '  P --> L{More files}',
                  '  L -->|yes| P',
                  '  L -->|no| D[Done]',
                ],
                caption: 'A typical script flow: test a condition, then loop over items until none remain.',
              },
              code: {
                language: 'bash',
                lines: [
                  '#!/usr/bin/env bash',
                  'if [[ $# -lt 1 ]]; then',
                  '  echo "Usage: $0 DIRECTORY" >&2',
                  '  exit 1',
                  'fi',
                  'for f in "$1"/*.log; do',
                  '  [[ -f "$f" ]] && echo "Found log: $f"',
                  'done',
                ],
                explanation:
                  'It checks an argument was given ($# -lt 1), exits with usage if not, then loops over .log files in the given directory, printing each that exists.',
              },
              commonMistakes: [
                'Omitting the spaces inside the brackets, e.g. [[$x -eq 1]], which is a syntax error; the brackets are commands needing surrounding spaces.',
              ],
              exercises: [
                {
                  type: 'task',
                  prompt: 'Write a snippet that prints exists if a file named config.yml is present in the current directory, and missing otherwise.',
                  solution: {
                    lines: ['if [[ -f config.yml ]]; then', '  echo exists', 'else', '  echo missing', 'fi'],
                    explanation:
                      '-f tests whether config.yml is a regular file; the if/else prints the appropriate message based on the test result.',
                  },
                },
                {
                  type: 'predict',
                  prompt: 'A script is run as ./greet.sh Ada. What does echo "Hello $1" output?',
                  solution: {
                    explanation:
                      'Hello Ada. $1 is the first positional argument, which is Ada.',
                  },
                },
                {
                  type: 'quiz',
                  prompt: 'How do you loop over every .txt file in the current directory in bash?',
                  hint: 'A for loop with a glob.',
                  solution: {
                    explanation:
                      'for f in *.txt; do ...; done. The glob expands to the matching files and the loop runs once per file, with "$f" holding each name.',
                  },
                },
              ],
              docs: 'https://www.gnu.org/software/bash/manual/bash.html#Conditional-Constructs',
            },
            {
              id: 'lx5-t0-c3',
              title: 'Functions and reusable scripts',
              summary:
                'Functions group commands under a name so you can reuse logic, accept arguments, and keep scripts organised and testable.',
              explanation:
                'As scripts grow, functions let you name and reuse a block of commands. You define one with name() { ...; } and call it just like a command, name arg1 arg2. Inside the function, arguments are the same positional parameters $1, $2 and $@ as in the script itself, but scoped to that call. By default variables are global, so declare locals with local var=value to avoid clobbering the caller\'s variables — a discipline that prevents subtle bugs. A function returns an exit code with return N (0 for success), which the caller can test, while to return data you echo it and capture with command substitution, result=$(myfunc). Putting reusable functions near the top of a script, then driving them from a small main section at the bottom, keeps logic clear. You can also collect shared functions in a separate file and pull them in with source lib.sh (also written . lib.sh), which loads them into the current shell.',
              analogy:
                'A function is a labelled tool in your toolbox: define it once, then reach for it by name whenever you need that job done, instead of rebuilding the tool each time.',
              keyPoints: [
                'Define with name() { ...; } and call it like a command.',
                'Inside, $1, $2 and $@ are the function\'s own arguments.',
                'Use local to keep variables from leaking into the global scope.',
                'return N sets an exit code; echo plus $(...) returns data.',
                'source file.sh loads shared functions into the current shell.',
              ],
              code: {
                language: 'bash',
                lines: [
                  '#!/usr/bin/env bash',
                  'log() {',
                  '  local level="$1"; shift',
                  '  echo "[$level] $*"',
                  '}',
                  'backup() {',
                  '  local src="$1" dest="$2"',
                  '  cp -r "$src" "$dest" && log INFO "Backed up $src"',
                  '}',
                  'backup /data /backup',
                ],
                explanation:
                  'log and backup are reusable functions with local variables; shift drops the first argument so $* holds the rest, and backup calls log on success.',
              },
              commonMistakes: [
                'Forgetting local, so a variable set inside a function overwrites a same-named variable in the rest of the script.',
              ],
              exercises: [
                {
                  type: 'task',
                  prompt: 'Define a function called greet that takes a name argument and prints Hello followed by that name.',
                  solution: {
                    lines: ['greet() {', '  echo "Hello, $1"', '}', 'greet Ada'],
                    explanation:
                      'The function reads its first argument as $1; calling greet Ada prints Hello, Ada.',
                  },
                },
                {
                  type: 'quiz',
                  prompt: 'Why should you declare variables inside a function with local?',
                  hint: 'Think about variables outside the function with the same name.',
                  solution: {
                    explanation:
                      'Without local, the variable is global and can overwrite a same-named variable elsewhere in the script. local confines it to the function, preventing side effects.',
                  },
                },
                {
                  type: 'predict',
                  prompt: 'How do you capture the output that a function echoes into a variable?',
                  solution: {
                    explanation:
                      'With command substitution, e.g. result=$(myfunc). The function\'s stdout is captured into result, while return is used for an exit status, not data.',
                  },
                },
              ],
              docs: 'https://www.gnu.org/software/bash/manual/bash.html#Shell-Functions',
            },
          ],
        },
        {
          id: 'lx5-t1',
          name: 'Automation and scheduling',
          concepts: [
            {
              id: 'lx5-t1-c0',
              title: 'Scheduling jobs with cron and crontab',
              summary:
                'cron runs commands automatically on a schedule. Each user edits their list of scheduled jobs with crontab, using a five-field time syntax.',
              explanation:
                'cron is the classic time-based job scheduler: a daemon that wakes every minute and runs any jobs whose schedule matches. Each user has a crontab, a list of scheduled commands edited with crontab -e and viewed with crontab -l. A crontab line has five time fields followed by the command: minute, hour, day-of-month, month and day-of-week. An asterisk means every value, so 0 2 * * * means at 02:00 every day, and */15 * * * * means every 15 minutes. There are also system-wide crontabs in /etc/crontab and drop-in directories like /etc/cron.daily for packaged jobs. Two pitfalls catch everyone: cron runs with a minimal environment and a sparse PATH, so use absolute paths to commands and files; and cron does not show output on screen, so redirect both streams to a log file or you will never see errors. The site crontab.guru is a popular helper for getting the five fields right.',
              analogy:
                'cron is an alarm clock with many alarms: each crontab line is one alarm set for a recurring time, and when it goes off the assigned task runs automatically whether or not you are watching.',
              keyPoints: [
                'cron runs jobs on a schedule; crontab -e edits your jobs, crontab -l lists them.',
                'Five fields: minute, hour, day-of-month, month, day-of-week, then the command.',
                'An asterisk means every value; */N means every N units.',
                'cron has a minimal environment, so use absolute paths.',
                'Redirect output to a log file because cron does not print to a terminal.',
              ],
              code: {
                language: 'bash',
                lines: [
                  '# Edit your crontab',
                  'crontab -e',
                  '# Run a backup every day at 02:00, logging output',
                  '0 2 * * * /usr/local/bin/backup.sh >> /var/log/backup.log 2>&1',
                  '# Run a check every 15 minutes',
                  '*/15 * * * * /usr/local/bin/healthcheck.sh',
                  '# List your scheduled jobs',
                  'crontab -l',
                ],
                explanation:
                  'The first job runs daily at 2am with output appended to a log; the second runs every 15 minutes. Absolute paths and output redirection are essential in cron.',
              },
              commonMistakes: [
                'Using a relative path or a bare command name in a cron job and finding it fails silently because cron\'s PATH is minimal and its working directory is the home directory.',
              ],
              exercises: [
                {
                  type: 'task',
                  prompt: 'Write a crontab line that runs /opt/scripts/cleanup.sh every Sunday at 3:30 AM.',
                  solution: {
                    lines: ['30 3 * * 0 /opt/scripts/cleanup.sh'],
                    explanation:
                      'Minute 30, hour 3, any day-of-month, any month, day-of-week 0 (Sunday). The absolute path ensures cron can find the script.',
                  },
                },
                {
                  type: 'predict',
                  prompt: 'What schedule does the cron expression */10 * * * * represent?',
                  solution: {
                    explanation:
                      'Every 10 minutes, all day, every day. The */10 in the minute field means run when the minute is divisible by 10.',
                  },
                },
                {
                  type: 'quiz',
                  prompt: 'Your cron job works when you run it by hand but fails under cron. What is the most common cause?',
                  hint: 'Think about the environment cron provides.',
                  solution: {
                    explanation:
                      'cron runs with a minimal environment and PATH, so commands or files referenced by relative path or bare name are not found. Use absolute paths, and redirect output to a log to see the error.',
                  },
                },
              ],
              docs: 'https://man7.org/linux/man-pages/man5/crontab.5.html',
            },
            {
              id: 'lx5-t1-c1',
              title: 'systemd timers as a modern alternative',
              summary:
                'systemd timers schedule units to run on a calendar or interval. They integrate with the journal and offer features cron lacks.',
              explanation:
                'systemd provides its own scheduling through timer units, an increasingly common alternative to cron. A timer comes as a pair: a .service unit that defines what to run, and a matching .timer unit that defines when. The timer uses OnCalendar for wall-clock schedules with an expressive syntax (OnCalendar=daily, or *-*-* 02:00:00 for 2am), or OnBootSec and OnUnitActiveSec for relative intervals. You enable and start a timer with systemctl enable --now name.timer, and list active timers with systemctl list-timers. The advantages over cron are real: jobs and their output go to the journal so journalctl -u name.service shows exactly what happened, dependencies and resource limits from systemd apply, a Persistent=true setting can catch up missed runs after downtime, and randomized delays spread load. cron remains simpler for quick one-liners, but timers are the better fit when you are already managing services with systemd.',
              analogy:
                'If cron is a standalone kitchen timer, a systemd timer is one built into a smart oven: it not only rings on schedule but logs every cooking session, can resume a missed bake, and coordinates with the rest of the appliance.',
              keyPoints: [
                'A timer is a pair: a .service for what to run and a .timer for when.',
                'OnCalendar sets wall-clock schedules; OnBootSec and OnUnitActiveSec set intervals.',
                'Enable with systemctl enable --now name.timer; view with list-timers.',
                'Output goes to the journal, queryable with journalctl -u name.service.',
                'Persistent=true catches up runs missed during downtime.',
              ],
              code: {
                language: 'bash',
                lines: [
                  '# List all active timers and their next run',
                  'systemctl list-timers',
                  '# Enable and start a timer now',
                  'sudo systemctl enable --now backup.timer',
                  '# Inspect what the timer ran',
                  'journalctl -u backup.service',
                  '# Example timer directive: OnCalendar=*-*-* 02:00:00',
                ],
                explanation:
                  'list-timers shows scheduled timers, enable --now activates one, and journalctl -u inspects the service it triggered, all integrated with systemd.',
              },
              commonMistakes: [
                'Enabling the .service instead of the .timer; you must enable the .timer unit for the schedule to take effect.',
              ],
              exercises: [
                {
                  type: 'task',
                  prompt: 'Show all configured systemd timers and when each will next fire.',
                  solution: {
                    lines: ['systemctl list-timers'],
                    explanation:
                      'list-timers lists each active timer with its next and last trigger times and the unit it activates.',
                  },
                },
                {
                  type: 'quiz',
                  prompt: 'What two unit files make up a systemd timer, and what does each do?',
                  hint: 'One says when, one says what.',
                  solution: {
                    explanation:
                      'A .timer unit defines the schedule (when to run) and a .service unit defines the command to execute (what to run). The timer activates the service.',
                  },
                },
                {
                  type: 'predict',
                  prompt: 'A timer has Persistent=true and the machine was off when it was due. What happens at next boot?',
                  solution: {
                    explanation:
                      'systemd runs the missed job shortly after boot to catch up, rather than skipping it entirely as plain cron would.',
                  },
                },
              ],
              docs: 'https://www.freedesktop.org/software/systemd/man/latest/systemd.timer.html',
            },
            {
              id: 'lx5-t1-c2',
              title: 'Environment variables and log rotation',
              summary:
                'The environment carries configuration like PATH into programs, and logrotate keeps log files from filling the disk by rotating and compressing them.',
              explanation:
                'Programs read configuration from environment variables, a set of name-value pairs passed to every process. PATH lists the directories searched for commands, HOME points to your home directory, and many programs read their own variables. You set one for the current shell and its children with export NAME=value, and view all with env or printenv. To make a variable persistent for interactive shells you add the export line to a startup file such as ~/.bashrc (per-user) or /etc/environment (system-wide). Separately, busy systems generate large logs, and logrotate is the standard tool that prevents them from consuming the disk. Configured under /etc/logrotate.conf and /etc/logrotate.d/, it periodically rotates a log — renaming app.log to app.log.1, then .2, and so on — compresses old copies, deletes ones past a retention limit, and optionally signals the service to reopen its log file. It typically runs daily via cron or a systemd timer, so logs stay bounded automatically.',
              analogy:
                'Environment variables are notes pinned to every worker as they start a shift, telling them where the tools are (PATH) and where home is. logrotate is the office clerk who, each night, files away yesterday\'s ledger, shrinks the old ones into the archive, and shreds anything older than the retention policy.',
              keyPoints: [
                'Environment variables are name-value pairs inherited by child processes.',
                'PATH lists where commands are found; HOME is your home directory.',
                'export NAME=value sets one; persist it in ~/.bashrc or /etc/environment.',
                'logrotate rotates, compresses and prunes logs to bound disk use.',
                'It is configured in /etc/logrotate.d and runs on a schedule.',
              ],
              code: {
                language: 'bash',
                lines: [
                  '# Set and export a variable for child processes',
                  'export APP_ENV=production',
                  '# View all environment variables',
                  'printenv',
                  '# A logrotate snippet for an app log',
                  '# /var/log/myapp.log { daily rotate 7 compress missingok }',
                  '# Test a logrotate config without waiting',
                  'sudo logrotate -d /etc/logrotate.d/myapp',
                ],
                explanation:
                  'export shares a variable with child processes, printenv lists the environment, and logrotate -d does a dry run to validate a rotation config.',
              },
              commonMistakes: [
                'Setting a variable without export and wondering why a launched program does not see it; only exported variables are inherited by child processes.',
              ],
              exercises: [
                {
                  type: 'task',
                  prompt: 'Set an environment variable named LOG_LEVEL to debug so that programs you start from this shell inherit it.',
                  solution: {
                    lines: ['export LOG_LEVEL=debug'],
                    explanation:
                      'export marks the variable for inheritance, so any command launched from this shell sees LOG_LEVEL=debug.',
                  },
                },
                {
                  type: 'predict',
                  prompt: 'A logrotate config has rotate 7 and daily. How long is a given day\'s log kept?',
                  solution: {
                    explanation:
                      'About seven days. With daily rotation and rotate 7, seven rotated copies are kept before the oldest is deleted, so roughly a week of history is retained.',
                  },
                },
                {
                  type: 'quiz',
                  prompt: 'What is the purpose of the PATH environment variable?',
                  hint: 'It is about finding commands.',
                  solution: {
                    explanation:
                      'PATH is the colon-separated list of directories the shell searches, in order, to find an executable when you type a command name without a full path.',
                  },
                },
              ],
              docs: 'https://man7.org/linux/man-pages/man8/logrotate.8.html',
            },
          ],
        },
        {
          id: 'lx5-t2',
          name: 'Security and hardening',
          concepts: [
            {
              id: 'lx5-t2-c0',
              title: 'SSH key authentication',
              summary:
                'Key-based SSH authentication replaces passwords with a cryptographic key pair, which is both more secure and more convenient.',
              explanation:
                'Password logins over SSH are vulnerable to guessing and brute-force attacks, so the strong standard is public-key authentication. You generate a key pair with ssh-keygen, producing a private key kept secret on your machine (default ~/.ssh/id_ed25519) and a matching public key you can share freely. You install the public key on the server\'s ~/.ssh/authorized_keys, easiest with ssh-copy-id user@host. Thereafter the server challenges your client to prove it holds the private key, and login succeeds without sending a password. The ed25519 algorithm is the modern recommendation, fast and compact; RSA with at least 3072 bits is the older alternative. Protect the private key with a passphrase so a stolen key file is useless, and use ssh-agent to cache the unlocked key so you type the passphrase only once per session. Correct permissions matter: SSH refuses keys if ~/.ssh is group- or world-accessible, so the directory should be 700 and the private key 600.',
              analogy:
                'A password is a secret you shout across the room each time. A key pair is a tamper-proof lock you bolt to the server\'s door (the public key) that only your uniquely shaped private key can open, without ever transmitting the key itself.',
              keyPoints: [
                'Key auth uses a private key (secret) and a public key (shareable).',
                'ssh-keygen creates the pair; ssh-copy-id installs the public key on the server.',
                'The server verifies you hold the private key; no password crosses the network.',
                'Prefer ed25519; protect the private key with a passphrase and use ssh-agent.',
                'Permissions matter: ~/.ssh should be 700 and the private key 600.',
              ],
              diagram: {
                type: 'mermaid',
                lines: [
                  'flowchart LR',
                  '  C[Client holds private key] -->|connect| S[Server holds public key]',
                  '  S -->|challenge| C',
                  '  C -->|proves key| S',
                  '  S --> A[Access granted]',
                ],
                caption: 'The server challenges the client to prove it holds the private key matching the stored public key.',
              },
              code: {
                language: 'bash',
                lines: [
                  '# Generate a modern key pair',
                  'ssh-keygen -t ed25519 -C "ana@laptop"',
                  '# Copy the public key to a server',
                  'ssh-copy-id ana@server.example.com',
                  '# Log in with the key, no password',
                  'ssh ana@server.example.com',
                  '# Fix permissions if SSH complains',
                  'chmod 700 ~/.ssh && chmod 600 ~/.ssh/id_ed25519',
                ],
                explanation:
                  'ssh-keygen makes the pair, ssh-copy-id installs the public half on the server, and login then uses the key; tight permissions on ~/.ssh are required.',
              },
              commonMistakes: [
                'Copying the private key to the server instead of the public key; only the public key (.pub) goes into authorized_keys, never the private one.',
              ],
              exercises: [
                {
                  type: 'task',
                  prompt: 'Generate a new ed25519 SSH key pair labelled with your email comment.',
                  solution: {
                    lines: ['ssh-keygen -t ed25519 -C "hello@affsquad.com"'],
                    explanation:
                      '-t ed25519 selects the modern algorithm and -C adds a comment to help you identify the key later.',
                  },
                },
                {
                  type: 'quiz',
                  prompt: 'Which half of an SSH key pair goes onto the server, and which stays on your machine?',
                  hint: 'One is meant to be shared.',
                  solution: {
                    explanation:
                      'The public key goes into the server\'s authorized_keys; the private key stays secret on your client and must never be shared.',
                  },
                },
                {
                  type: 'predict',
                  prompt: 'SSH refuses your key and warns the private key file is too open. What is wrong?',
                  solution: {
                    explanation:
                      'The private key (or ~/.ssh) has permissions that allow group or others to read it. SSH ignores such keys for safety; set the key to 600 and ~/.ssh to 700.',
                  },
                },
              ],
              docs: 'https://man.openbsd.org/ssh-keygen',
            },
            {
              id: 'lx5-t2-c1',
              title: 'Hardening the SSH server and least privilege',
              summary:
                'Disabling root login and password authentication, plus following least privilege, dramatically reduces a server\'s attack surface.',
              explanation:
                'Once key authentication works, you should harden the SSH server itself, configured in /etc/ssh/sshd_config. The two highest-impact changes are PermitRootLogin no, which stops anyone logging in directly as root over SSH so an attacker must compromise a normal account first, and PasswordAuthentication no, which disables password logins entirely so brute-force guessing becomes pointless once keys are in place. Other useful measures include limiting who may connect with AllowUsers, and optionally changing the port to cut log noise (though this is obscurity, not real security). After editing, validate the config with sshd -t and apply it with systemctl reload ssh, keeping your current session open until you confirm a new login works so a mistake does not lock you out. Beyond SSH, the principle of least privilege underpins all hardening: give every user, service and process only the access it genuinely needs, run services as dedicated unprivileged accounts rather than root, and use sudo for specific tasks instead of permanent root power.',
              analogy:
                'Disabling root SSH login removes the master key from the front door so intruders must first pick a lesser lock; disabling passwords replaces guessable combinations with un-forgeable keys; least privilege gives every worker only the keys to the rooms they actually use.',
              keyPoints: [
                'Edit /etc/ssh/sshd_config to harden the SSH server.',
                'PermitRootLogin no blocks direct root logins over SSH.',
                'PasswordAuthentication no disables password logins once keys work.',
                'Validate with sshd -t and reload; keep a session open to avoid lockout.',
                'Least privilege: grant only the access each user or service truly needs.',
              ],
              code: {
                language: 'bash',
                lines: [
                  '# Key lines to set in /etc/ssh/sshd_config',
                  '# PermitRootLogin no',
                  '# PasswordAuthentication no',
                  '# Validate the configuration syntax',
                  'sudo sshd -t',
                  '# Apply without dropping existing sessions',
                  'sudo systemctl reload ssh',
                ],
                explanation:
                  'Set the two directives, run sshd -t to catch errors, then reload; test a fresh login before closing your current session to avoid locking yourself out.',
              },
              commonMistakes: [
                'Disabling password auth before confirming key login works, then closing the only session — locking yourself out of the server entirely.',
              ],
              exercises: [
                {
                  type: 'task',
                  prompt: 'Check the SSH server configuration for syntax errors before reloading it.',
                  solution: {
                    lines: ['sudo sshd -t'],
                    explanation:
                      'sshd -t performs a test-mode parse of the config and reports errors without applying changes or restarting the daemon.',
                  },
                },
                {
                  type: 'quiz',
                  prompt: 'Why disable direct root login over SSH?',
                  hint: 'root is a single, well-known, all-powerful target.',
                  solution: {
                    explanation:
                      'root is a universal, all-powerful account that attackers always target. Forcing logins through a normal user (then sudo) adds a barrier and improves auditability.',
                  },
                },
                {
                  type: 'predict',
                  prompt: 'You set PasswordAuthentication no but never installed your public key on the server, then reload sshd. What happens on your next login attempt?',
                  solution: {
                    explanation:
                      'You are locked out: passwords are refused and you have no key in authorized_keys. This is why you must verify key login works first and keep a session open while changing it.',
                  },
                },
              ],
              docs: 'https://man.openbsd.org/sshd_config',
            },
            {
              id: 'lx5-t2-c2',
              title: 'Firewalls with ufw, iptables and nftables',
              summary:
                'A firewall controls which network traffic is allowed in and out. ufw is a simple front end, while nftables (and legacy iptables) provide the underlying engine.',
              explanation:
                'A host firewall enforces rules about which connections may reach the machine, a core layer of defence. At the lowest level the Linux kernel filters packets through netfilter, which the modern nftables tool configures (and the older iptables, still common, configures the legacy path). Writing raw rules is powerful but fiddly, so most administrators use a friendlier front end. ufw (Uncomplicated Firewall), default on Ubuntu, makes the common cases easy: ufw enable turns it on with a sensible default-deny on incoming traffic, ufw allow 22/tcp permits SSH, and ufw allow 80,443/tcp opens a web server. firewalld is the comparable front end on Fedora and Red Hat, organising rules into zones. The guiding principle is default deny: block all incoming connections, then explicitly allow only the ports your services need — typically SSH plus whatever you are hosting. Always allow your SSH port before enabling the firewall, or you will cut off your own remote access.',
              analogy:
                'A firewall is a building\'s security desk with a default rule of nobody enters. You then add named exceptions for the specific doors (ports) that legitimate visitors use, and turn everyone else away at the perimeter.',
              keyPoints: [
                'A firewall filters incoming and outgoing network traffic.',
                'The kernel uses netfilter; nftables configures it, with legacy iptables still common.',
                'ufw is a simple front end (Ubuntu); firewalld uses zones (Red Hat/Fedora).',
                'Adopt default deny inbound, then allow only the ports you need.',
                'Allow SSH before enabling the firewall to avoid locking yourself out.',
              ],
              diagram: {
                type: 'mermaid',
                lines: [
                  'flowchart TD',
                  '  P[Incoming packet] --> R{Matches an allow rule}',
                  '  R -->|yes| A[Accept]',
                  '  R -->|no| D[Drop by default]',
                ],
                caption: 'With a default-deny policy, only packets matching an explicit allow rule are accepted.',
              },
              code: {
                language: 'bash',
                lines: [
                  '# Allow SSH first so you do not lock yourself out',
                  'sudo ufw allow 22/tcp',
                  '# Allow web traffic',
                  'sudo ufw allow 80,443/tcp',
                  '# Turn the firewall on (default-deny inbound)',
                  'sudo ufw enable',
                  '# Review the active rules',
                  'sudo ufw status verbose',
                ],
                explanation:
                  'Allow SSH and web ports first, then enable ufw, which defaults to denying other inbound traffic; ufw status shows the resulting rules.',
              },
              commonMistakes: [
                'Running ufw enable on a remote server before allowing the SSH port, instantly dropping your own connection and locking yourself out.',
              ],
              exercises: [
                {
                  type: 'task',
                  prompt: 'On an Ubuntu server, allow incoming SSH and then enable the firewall.',
                  solution: {
                    lines: ['sudo ufw allow 22/tcp', 'sudo ufw enable'],
                    explanation:
                      'Allowing port 22 first ensures your SSH session survives; ufw enable then activates the firewall with default-deny on other inbound traffic.',
                  },
                },
                {
                  type: 'quiz',
                  prompt: 'What does a default-deny inbound policy mean?',
                  hint: 'What happens to traffic with no matching rule?',
                  solution: {
                    explanation:
                      'All incoming connections are blocked unless a rule explicitly allows them. You open only the specific ports your services require, minimising exposure.',
                  },
                },
                {
                  type: 'predict',
                  prompt: 'What tool is the modern replacement for iptables as the userspace configuration tool for the kernel firewall?',
                  solution: {
                    explanation:
                      'nftables. It configures the same netfilter subsystem with a cleaner, unified syntax and is the current standard, though iptables remains widely seen.',
                  },
                },
              ],
              docs: 'https://help.ubuntu.com/community/UFW',
            },
            {
              id: 'lx5-t2-c3',
              title: 'Updates and intrusion mitigation with fail2ban',
              summary:
                'Applying security updates promptly is the single most effective defence, and fail2ban blocks hosts that repeatedly fail to authenticate.',
              explanation:
                'The most important security habit is unglamorous: keep software patched. Most breaches exploit known vulnerabilities for which fixes already exist, so applying updates regularly — apt upgrade, dnf upgrade, or unattended-upgrades for automatic security patches — closes those holes before attackers use them. On top of patching, fail2ban defends services exposed to the internet against brute-force attacks. It watches log files (for example SSH auth logs), and when it sees too many failed login attempts from one IP within a window, it temporarily bans that address by inserting a firewall rule, then lifts the ban after a configured time. It ships with ready-made jails for common services like sshd; you enable a jail and tune maxretry, findtime and bantime in /etc/fail2ban/jail.local. Layered together — prompt updates, key-only SSH with root login disabled, a default-deny firewall, least privilege, and fail2ban — these measures form a practical baseline that turns a default install into a reasonably hardened server.',
              analogy:
                'Applying updates is fixing the broken locks the manufacturer has already issued replacements for; fail2ban is a bouncer who notices someone trying key after key at the door and turns them away from the whole building for a while.',
              keyPoints: [
                'Prompt patching is the most effective single security measure.',
                'unattended-upgrades can apply security updates automatically.',
                'fail2ban watches logs and bans IPs after repeated auth failures.',
                'It uses per-service jails; tune maxretry, findtime and bantime.',
                'Layered defences (updates, key SSH, firewall, least privilege, fail2ban) form a baseline.',
              ],
              diagram: {
                type: 'mermaid',
                lines: [
                  'flowchart TD',
                  '  L[Auth log] --> F[fail2ban watches]',
                  '  F --> C{Too many failures}',
                  '  C -->|yes| B[Add firewall ban]',
                  '  C -->|no| W[Keep watching]',
                  '  B --> U[Unban after bantime]',
                ],
                caption: 'fail2ban scans logs and temporarily bans IPs that exceed the failure threshold.',
              },
              code: {
                language: 'bash',
                lines: [
                  '# Keep the system patched',
                  'sudo apt update && sudo apt upgrade',
                  '# Enable automatic security updates on Debian/Ubuntu',
                  'sudo apt install unattended-upgrades',
                  '# Check fail2ban status for the ssh jail',
                  'sudo fail2ban-client status sshd',
                  '# Tune settings in /etc/fail2ban/jail.local (maxretry, bantime)',
                ],
                explanation:
                  'Regular upgrades close known holes, unattended-upgrades automates security patches, and fail2ban-client status shows banned IPs for the sshd jail.',
              },
              commonMistakes: [
                'Relying on fail2ban or a firewall while leaving the system unpatched; no perimeter tool compensates for an unfixed, exploitable vulnerability.',
              ],
              exercises: [
                {
                  type: 'quiz',
                  prompt: 'What is the single most effective thing you can do to keep a server secure over time?',
                  hint: 'It involves software versions.',
                  solution: {
                    explanation:
                      'Apply security updates promptly. Most attacks exploit known, already-patched vulnerabilities, so keeping software current closes those openings.',
                  },
                },
                {
                  type: 'task',
                  prompt: 'Check how many IP addresses fail2ban has currently banned for the SSH service.',
                  solution: {
                    lines: ['sudo fail2ban-client status sshd'],
                    explanation:
                      'fail2ban-client status sshd reports the sshd jail\'s statistics, including currently banned IP addresses.',
                  },
                },
                {
                  type: 'predict',
                  prompt: 'fail2ban is set with maxretry 5 and bantime 600. An IP fails to log in six times. What happens?',
                  solution: {
                    explanation:
                      'After exceeding five failures, fail2ban adds a firewall rule banning that IP for 600 seconds (10 minutes), after which the ban is automatically lifted.',
                  },
                },
              ],
              docs: 'https://www.fail2ban.org/wiki/index.php/Main_Page',
            },
          ],
        },
      ],
    },
  ],
};

export default content;
