// Node.js — course content. Original explanations written for self-study; same schema as the other courses.
const content = {
  meta: {
    title: 'Node.js: Server-Side JavaScript from Fundamentals to Production',
    description:
      'Learn Node.js end to end: the V8 plus libuv runtime, the module systems, the event loop, core modules like fs and streams, building HTTP servers, async patterns and error handling, npm and the package ecosystem, and production concerns such as databases, scaling, testing and deployment. Every concept comes with original explanations, runnable code and hands-on exercises.',
    schemaVersion: '1.0',
    status: 'complete',
  },
  levels: [
    /* ───────────────────── LEVEL 1 — FUNDAMENTALS ───────────────────── */
    {
      level: 1,
      name: 'Fundamentals',
      focus: 'What Node.js is, how modules work, and how the event loop powers non-blocking I/O',
      accent: '#3c873a',
      soft: '#e7f3e7',
      topics: [
        {
          id: 'nd1-t0',
          name: 'What Node.js is',
          concepts: [
            {
              id: 'nd1-t0-c0',
              title: 'JavaScript outside the browser: V8 plus libuv',
              summary:
                'Node.js is a runtime that lets you run JavaScript on a server or your own machine. It pairs Google\'s V8 engine with a C library called libuv that provides the event loop and asynchronous I/O.',
              explanation:
                'A browser runs JavaScript so it can manipulate web pages; Node.js takes the same V8 engine that powers Chrome and embeds it in a standalone program so you can run JavaScript anywhere. But a language engine alone cannot read files or open network sockets — those abilities come from libuv, a C library that gives Node its event loop and a thread pool for blocking operations. On top of those two pieces, Node adds a standard library of core modules (fs, http, path, and many more) and global objects such as process and Buffer. The result is a complete platform for writing servers, command-line tools, build scripts and more. Crucially, there is no DOM and no window object in Node — instead you get APIs for the operating system, the file system and networking. Modern Node ships as an LTS (Long-Term Support) release, which is the version you should target for anything you intend to maintain.',
              analogy:
                'V8 is a powerful car engine. By itself it just spins. libuv is the chassis, wheels and steering that turn that engine into a vehicle you can actually drive on real roads.',
              keyPoints: [
                'Node.js = V8 (runs JavaScript) + libuv (event loop and async I/O) + a core standard library.',
                'There is no DOM or window; instead you get file system, OS and networking APIs.',
                'Global objects like process, Buffer and console replace browser globals.',
                'Use the current LTS release for production and learning.',
              ],
              diagram: {
                type: 'mermaid',
                lines: [
                  'flowchart LR',
                  '  JS[Your JavaScript] --> V8[V8 engine]',
                  '  V8 --> LIBUV[libuv event loop]',
                  '  LIBUV --> OS[Operating system]',
                ],
                caption: 'Your code runs in V8; libuv bridges it to the operating system for files, sockets and timers.',
              },
              exercises: [
                {
                  type: 'quiz',
                  prompt: 'Which two main components combine to form the Node.js runtime, and what does each provide?',
                  hint: 'One runs the language, the other talks to the operating system.',
                  solution: {
                    explanation:
                      'V8 executes the JavaScript code, and libuv provides the event loop, the thread pool and the asynchronous I/O that let Node talk to files, the network and timers.',
                  },
                },
                {
                  type: 'quiz',
                  prompt: 'Name one browser global that does NOT exist in Node.js and one Node global that does not exist in the browser.',
                  solution: {
                    explanation:
                      'window (or document) exists in the browser but not in Node; process exists in Node but not in a browser. Node also has Buffer and global instead of window.',
                  },
                },
                {
                  type: 'predict',
                  prompt: 'You paste document.querySelector(\'h1\') into a Node script and run it. What happens?',
                  solution: {
                    explanation:
                      'It throws a ReferenceError because document is not defined — there is no DOM in Node. The browser globals simply do not exist in the runtime.',
                  },
                },
              ],
              docs: 'https://nodejs.org/docs/latest/api/synopsis.html',
            },
            {
              id: 'nd1-t0-c1',
              title: 'Use cases: where Node shines and where it does not',
              summary:
                'Node excels at I/O-heavy, concurrent workloads like web servers and APIs, and at tooling. It is a weaker fit for heavy CPU-bound number crunching on the main thread.',
              explanation:
                'Because Node uses a single main thread with non-blocking I/O, it can hold thousands of open connections cheaply while it waits on databases, files and other services — exactly the shape of a typical web API, real-time chat server, proxy, or streaming service. It is also the de-facto platform for front-end tooling: bundlers, linters, test runners and package managers are all Node programs. Where Node struggles is sustained CPU-bound work such as image processing, video encoding or large cryptographic loops, because a long synchronous computation blocks the single thread and stalls every other request. The answer in those cases is not to abandon Node but to offload the work to worker threads, child processes or a native addon. Knowing the I/O-bound versus CPU-bound distinction is the single most useful instinct for deciding how to architect a Node application.',
              keyPoints: [
                'Great for I/O-bound and concurrent work: APIs, real-time apps, proxies, streaming.',
                'The standard runtime for developer tooling (bundlers, linters, test runners).',
                'Weak for long CPU-bound tasks on the main thread — they block everything.',
                'Offload heavy computation to worker threads or child processes.',
              ],
              exercises: [
                {
                  type: 'quiz',
                  prompt: 'Why is Node a good fit for a chat server but a poor fit for resizing thousands of images on the main thread?',
                  hint: 'Think I/O-bound versus CPU-bound and the single thread.',
                  solution: {
                    explanation:
                      'A chat server is I/O-bound — mostly waiting on the network — so non-blocking I/O lets one thread serve many connections. Image resizing is CPU-bound: a long synchronous computation occupies the single thread and blocks all other requests until it finishes.',
                  },
                },
                {
                  type: 'task',
                  prompt: 'List two strategies for running CPU-heavy work in a Node app without freezing request handling.',
                  solution: {
                    lines: [
                      '1. Move the work into a Worker thread (worker_threads).',
                      '2. Spawn a separate child process (child_process) or a native addon.',
                    ],
                    explanation:
                      'Both approaches run the heavy computation off the main event-loop thread so request handling stays responsive.',
                  },
                },
                {
                  type: 'predict',
                  prompt: 'An HTTP handler runs a 5-second synchronous for-loop. While it runs, a second request arrives. What does the second client experience?',
                  solution: {
                    explanation:
                      'The second request waits — it cannot be processed until the loop finishes, because the single main thread is busy. Throughput collapses under CPU-bound synchronous work.',
                  },
                },
              ],
              docs: 'https://nodejs.org/en/learn/getting-started/introduction-to-nodejs',
            },
            {
              id: 'nd1-t0-c2',
              title: 'Running code: the REPL and executing a script',
              summary:
                'Type node to open an interactive REPL for quick experiments, or run node app.js to execute a file. The current LTS also supports running TypeScript and watch mode.',
              explanation:
                'Running node with no arguments drops you into the REPL (Read-Eval-Print Loop), an interactive prompt where each line is evaluated immediately — perfect for testing an API or checking a value. To run a program, save it to a file and execute it with node followed by the filename, for example node app.js. You can pass arguments after the filename and read them through process.argv. During development, node --watch app.js automatically restarts the process when the file changes, removing the need for an external watcher. The REPL has handy features: the special variable _ holds the last result, pressing Tab autocompletes, and dot-commands such as .help, .load and .exit control the session. For a one-off snippet you can also use node -e to evaluate a string directly from the shell.',
              code: {
                language: 'bash',
                lines: [
                  '# Open the interactive REPL',
                  'node',
                  '',
                  '# Run a script file',
                  'node app.js',
                  '',
                  '# Re-run automatically on file changes',
                  'node --watch app.js',
                  '',
                  '# Evaluate a one-line expression without a file',
                  'node -e "console.log(2 + 2)"',
                ],
                explanation:
                  'node alone starts the REPL; node <file> runs a script; --watch restarts on change; -e evaluates an inline expression.',
              },
              keyPoints: [
                'node with no arguments opens the REPL for interactive experiments.',
                'node app.js executes a script file.',
                'node --watch app.js restarts the process automatically on file changes.',
                'In the REPL, _ holds the last result and Tab autocompletes.',
              ],
              exercises: [
                {
                  type: 'quiz',
                  prompt: 'What is the REPL and when would you reach for it instead of writing a file?',
                  hint: 'Read, Eval, Print, Loop.',
                  solution: {
                    explanation:
                      'The REPL is an interactive prompt that evaluates each line immediately. Use it for quick experiments — checking an API, testing an expression, or exploring a module — rather than for anything you want to keep.',
                  },
                },
                {
                  type: 'task',
                  prompt: 'Write the shell command that runs server.js and automatically restarts it whenever the file changes.',
                  solution: {
                    lines: ['node --watch server.js'],
                    explanation: 'The built-in --watch flag re-runs the process on file changes, so no external tool like nodemon is required.',
                  },
                },
                {
                  type: 'predict',
                  prompt: 'In the REPL you type 10 * 5 and press Enter, then on the next line you type _ + 1. What prints?',
                  solution: {
                    explanation:
                      'First 50 prints. Then _ + 1 evaluates to 51, because _ holds the value of the previous expression in the REPL.',
                  },
                },
              ],
              docs: 'https://nodejs.org/docs/latest/api/repl.html',
            },
          ],
        },
        {
          id: 'nd1-t1',
          name: 'Modules',
          concepts: [
            {
              id: 'nd1-t1-c0',
              title: 'CommonJS: require and module.exports',
              summary:
                'CommonJS is Node\'s original module system. You expose values with module.exports and pull them in with require, loading synchronously at runtime.',
              explanation:
                'Every CommonJS file is its own module with a private scope: variables you declare are not global, they belong to that file. To share something, you attach it to module.exports (or the shorthand exports), and another file pulls it in with require, which returns whatever module.exports held. require is synchronous and resolves the moment it is called, and Node caches each module after first load so repeated requires of the same path return the identical object rather than re-executing the file. A common pitfall is reassigning exports = something instead of module.exports = something — only module.exports is the real export, so reassigning the bare exports alias breaks the link. CommonJS remains the default for files with a .js extension when the nearest package.json has no type field, and it is still everywhere in the ecosystem, so you must be fluent in it even as ES modules grow.',
              code: {
                language: 'javascript',
                lines: [
                  '// math.js — define and export',
                  'function add(a, b) {',
                  '  return a + b;',
                  '}',
                  'module.exports = { add };',
                  '',
                  '// app.js — import and use',
                  'const { add } = require(\'./math\');',
                  'console.log(add(2, 3)); // 5',
                ],
                explanation:
                  'math.js attaches add to module.exports; app.js destructures it from the object require returns. The ./ prefix marks it as a local file.',
              },
              keyPoints: [
                'Each file is a private module; nothing leaks to the global scope by default.',
                'module.exports holds what is shared; require returns that value.',
                'require is synchronous and modules are cached after first load.',
                'Reassign module.exports, not the bare exports alias, to replace the export.',
              ],
              commonMistakes: [
                'Writing exports = myFunction instead of module.exports = myFunction — the bare alias does not change the real export.',
                'Forgetting the ./ prefix on a local file, so Node looks for a package in node_modules instead.',
              ],
              exercises: [
                {
                  type: 'quiz',
                  prompt: 'Why does require(\'./util\') return the same object every time you call it within a process?',
                  hint: 'Think about caching.',
                  solution: {
                    explanation:
                      'Node caches modules after the first require. Subsequent calls return the cached module.exports instead of re-executing the file, which is why module-level state is shared.',
                  },
                },
                {
                  type: 'task',
                  prompt: 'Export a single function greet(name) from greet.js as the entire module, then import it in app.js.',
                  solution: {
                    lines: [
                      '// greet.js',
                      'module.exports = function greet(name) {',
                      '  return \'Hello, \' + name;',
                      '};',
                      '',
                      '// app.js',
                      'const greet = require(\'./greet\');',
                      'console.log(greet(\'Ada\'));',
                    ],
                    explanation: 'Assigning a function directly to module.exports makes the function itself the module, so require returns it directly.',
                  },
                },
                {
                  type: 'predict',
                  prompt: 'In a CommonJS file you write exports = { add }; then another file does require on it and destructures add. What happens?',
                  solution: {
                    explanation:
                      'add is undefined. Reassigning the bare exports variable only points the local alias elsewhere; module.exports still references the original empty object that require returns.',
                  },
                },
              ],
              docs: 'https://nodejs.org/docs/latest/api/modules.html',
            },
            {
              id: 'nd1-t1-c1',
              title: 'ES modules in Node: import and export',
              summary:
                'ECMAScript modules use import and export and are the standard module syntax. Node treats .mjs files, or .js files when package.json has "type": "module", as ES modules.',
              explanation:
                'ES modules (ESM) are the language-standard module system shared with the browser. You expose values with export (named or default) and bring them in with import, which uses static syntax that tools can analyze before the code runs. Node decides a file is ESM in one of three ways: the .mjs extension, a nearest package.json containing "type": "module", or by being passed certain flags. ESM differs from CommonJS in important ways: imports are resolved before the module body executes, there is no require, module.exports, __dirname or __filename by default, and the top level can use await directly. To recover the directory and file path, you derive them from import.meta.url. You can still load a CommonJS module from ESM with import, and Node provides createRequire if you genuinely need require inside an ES module. New projects increasingly default to ESM, but mixing the two systems is common, so understanding both is essential.',
              code: {
                language: 'javascript',
                lines: [
                  '// math.mjs — named and default exports',
                  'export function add(a, b) {',
                  '  return a + b;',
                  '}',
                  'export default add;',
                  '',
                  '// app.mjs — import them',
                  'import add, { add as namedAdd } from \'./math.mjs\';',
                  'console.log(add(2, 3)); // 5',
                ],
                explanation:
                  'export marks shared values; import pulls them in. ESM imports must usually include the file extension for local files.',
              },
              keyPoints: [
                'ESM uses import/export; it is the language standard, shared with browsers.',
                'A file is ESM via .mjs, "type": "module" in package.json, or a flag.',
                'No require, module.exports, __dirname or __filename by default; use import.meta.url.',
                'Top-level await is allowed in ES modules.',
              ],
              commonMistakes: [
                'Omitting the file extension on local imports in ESM — Node requires it (e.g. \'./math.mjs\', not \'./math\').',
                'Expecting __dirname to exist in an ES module; derive it from import.meta.url instead.',
              ],
              exercises: [
                {
                  type: 'quiz',
                  prompt: 'Name two ways to make Node treat a file as an ES module.',
                  hint: 'One is an extension, one is a package.json field.',
                  solution: {
                    explanation:
                      'Use the .mjs extension, or set "type": "module" in the nearest package.json (so .js files are treated as ESM). A command-line flag is a third way.',
                  },
                },
                {
                  type: 'task',
                  prompt: 'In an ES module, compute the current directory path equivalent to __dirname.',
                  solution: {
                    lines: [
                      'import { fileURLToPath } from \'node:url\';',
                      'import { dirname } from \'node:path\';',
                      'const __filename = fileURLToPath(import.meta.url);',
                      'const __dirname = dirname(__filename);',
                    ],
                    explanation: 'import.meta.url gives the module URL; fileURLToPath converts it to a path, and dirname extracts the folder.',
                  },
                },
                {
                  type: 'predict',
                  prompt: 'A .js file in a project whose package.json has "type": "module" uses require(\'fs\'). What happens?',
                  solution: {
                    explanation:
                      'It throws a ReferenceError: require is not defined — the file is treated as an ES module, which has no require. You would import from \'node:fs\' instead, or use createRequire.',
                  },
                },
              ],
              docs: 'https://nodejs.org/docs/latest/api/esm.html',
            },
            {
              id: 'nd1-t1-c2',
              title: 'Module resolution: how Node finds what you import',
              summary:
                'When you import a name, Node decides whether it is a core module, a local file, or a package in node_modules, then resolves it following well-defined rules.',
              explanation:
                'Node classifies every specifier into three buckets. A built-in like \'fs\' or \'node:fs\' is a core module and loads immediately. A path starting with ./, ../ or / is a relative or absolute file; Node tries the exact path, then common extensions (.js, .json, and so on), then an index file if it is a directory. Anything else — a bare name like \'express\' — is a package: Node walks up the directory tree looking inside each node_modules folder until it finds a matching package or reaches the root. Once it finds the package, it reads that package\'s package.json to choose the entry point, honoring the modern "exports" field (which can map different entry points and condition on import versus require) or falling back to "main". The node: prefix is the recommended, unambiguous way to reference core modules and guards against a same-named package shadowing a builtin. Understanding this algorithm explains why imports sometimes resolve to an unexpected version and why deleting node_modules and reinstalling fixes mysterious problems.',
              diagram: {
                type: 'mermaid',
                lines: [
                  'flowchart TD',
                  '  S[Import specifier] --> B{Core module}',
                  '  B -->|yes| CORE[Load builtin]',
                  '  B -->|no| P{Starts with dot or slash}',
                  '  P -->|yes| FILE[Resolve local file or folder]',
                  '  P -->|no| NM[Search node_modules upward]',
                ],
                caption: 'Node resolves a specifier as a core module, a local path, or a package found in node_modules.',
              },
              keyPoints: [
                'Specifiers are core modules, relative/absolute paths, or bare package names.',
                'Bare names are searched in node_modules folders walking up the directory tree.',
                'A package\'s entry point comes from "exports" (modern) or "main" (legacy) in its package.json.',
                'Prefer the node: prefix for builtins to avoid ambiguity and shadowing.',
              ],
              exercises: [
                {
                  type: 'quiz',
                  prompt: 'How does Node resolve require(\'lodash\') versus require(\'./lodash\')?',
                  hint: 'One is a package, one is a file.',
                  solution: {
                    explanation:
                      '\'lodash\' is a bare name, so Node searches node_modules folders up the tree. \'./lodash\' is a relative path, so Node looks for that file (or folder) next to the current module and never consults node_modules.',
                  },
                },
                {
                  type: 'quiz',
                  prompt: 'What does the node: prefix (e.g. node:fs) accomplish?',
                  solution: {
                    explanation:
                      'It explicitly marks the import as a core module, so it cannot be shadowed by a package of the same name and the intent is unambiguous.',
                  },
                },
                {
                  type: 'predict',
                  prompt: 'You import \'utils\' (no ./) but the file utils.js sits right next to your script. What happens?',
                  solution: {
                    explanation:
                      'Node treats \'utils\' as a package name and searches node_modules, ignoring the local utils.js. It throws a module-not-found error unless a package named utils exists. You need \'./utils\'.',
                  },
                },
              ],
              docs: 'https://nodejs.org/docs/latest/api/packages.html',
            },
          ],
        },
        {
          id: 'nd1-t2',
          name: 'The event loop and non-blocking I/O',
          concepts: [
            {
              id: 'nd1-t2-c0',
              title: 'Single thread, non-blocking I/O',
              summary:
                'Node runs your JavaScript on one main thread but keeps it busy by never waiting on I/O. Slow operations are handed off and their results arrive later as callbacks.',
              explanation:
                'The defining feature of Node is that your JavaScript runs on a single thread, yet the runtime can juggle thousands of concurrent operations. The trick is that I/O is non-blocking: when you ask to read a file or query a network service, Node hands the request to libuv and immediately continues running other code instead of standing idle. When the operation finishes, libuv places a callback in a queue, and the event loop runs it once the main thread is free. This is why a synchronous, CPU-bound loop is so damaging — it monopolizes the one thread and prevents any queued callbacks from running. The mental model to internalize is: do not block the thread. Prefer the asynchronous form of every API, keep individual synchronous chunks small, and let Node interleave waiting work for you. This single-threaded-but-concurrent design is what makes Node memory-efficient under heavy connection counts compared to a thread-per-request model.',
              analogy:
                'A great waiter takes one table\'s order, hands it to the kitchen, and immediately serves another table instead of standing at the kitchen window waiting. One waiter (thread) serves many tables (connections) because none of the waiting blocks the others.',
              keyPoints: [
                'Your JavaScript runs on a single main thread.',
                'I/O is non-blocking: requests are handed off and resolved via callbacks later.',
                'Concurrency comes from interleaving waiting work, not from many JS threads.',
                'A blocking synchronous operation freezes the entire process.',
              ],
              exercises: [
                {
                  type: 'quiz',
                  prompt: 'How can a single-threaded runtime handle thousands of concurrent connections?',
                  hint: 'It is about what the thread does while waiting.',
                  solution: {
                    explanation:
                      'Because I/O is non-blocking. The thread never sits idle waiting on a file or socket — it hands off the operation and processes other work, running each callback when its result is ready.',
                  },
                },
                {
                  type: 'task',
                  prompt: 'State the one-sentence golden rule for keeping a Node server responsive.',
                  solution: {
                    lines: ['Never block the main thread; prefer asynchronous APIs and keep synchronous work small.'],
                    explanation: 'Blocking the single thread stalls every pending callback and request.',
                  },
                },
                {
                  type: 'predict',
                  prompt: 'Two requests arrive at once. Each handler does an async database read that takes 100ms. Roughly how long until both complete?',
                  solution: {
                    explanation:
                      'About 100ms total, not 200ms. The reads run concurrently because the thread is free to start the second while the first is in flight; both callbacks fire when their results return.',
                  },
                },
              ],
              docs: 'https://nodejs.org/en/learn/asynchronous-work/overview-of-blocking-vs-non-blocking',
            },
            {
              id: 'nd1-t2-c1',
              title: 'The event loop phases',
              summary:
                'The event loop cycles through ordered phases — timers, pending callbacks, poll, check and close — running queued callbacks. Microtasks run between phases.',
              explanation:
                'The event loop is not a single queue but a sequence of phases that libuv runs in a fixed order on each iteration (or tick). The phases that matter most are: timers, which runs callbacks scheduled by setTimeout and setInterval whose time has elapsed; poll, which retrieves new I/O events and runs their callbacks; and check, which runs setImmediate callbacks. Between operations, Node also drains two microtask queues: callbacks from process.nextTick run first, then resolved Promise callbacks, and both are emptied before the loop moves on. This ordering explains classic surprises: process.nextTick always runs before a Promise, both run before any timer, and setImmediate versus setTimeout(fn, 0) ordering depends on context. You rarely need to memorize every phase, but knowing that microtasks (nextTick and Promises) jump ahead of timers and I/O callbacks prevents real bugs and helps you reason about the order your asynchronous code executes.',
              diagram: {
                type: 'mermaid',
                lines: [
                  'flowchart LR',
                  '  TIMERS[Timers] --> PENDING[Pending callbacks]',
                  '  PENDING --> POLL[Poll for IO]',
                  '  POLL --> CHECK[Check setImmediate]',
                  '  CHECK --> CLOSE[Close callbacks]',
                  '  CLOSE --> TIMERS',
                ],
                caption: 'One tick of the event loop runs through ordered phases; microtasks drain between them.',
              },
              code: {
                language: 'javascript',
                lines: [
                  'console.log(\'1 sync\');',
                  'setTimeout(() => console.log(\'4 timeout\'), 0);',
                  'Promise.resolve().then(() => console.log(\'3 promise\'));',
                  'process.nextTick(() => console.log(\'2 nextTick\'));',
                  'console.log(\'1b sync\');',
                  '// Output order: 1 sync, 1b sync, 2 nextTick, 3 promise, 4 timeout',
                ],
                explanation:
                  'Synchronous code runs first, then process.nextTick, then resolved Promises (microtasks), and only then the timer callback.',
              },
              keyPoints: [
                'The loop runs ordered phases: timers, pending, poll, check, close.',
                'process.nextTick callbacks run before Promise microtasks.',
                'All microtasks drain before the loop advances to the next phase.',
                'Timers and I/O callbacks always run after the current microtasks are emptied.',
              ],
              commonMistakes: [
                'Assuming setTimeout(fn, 0) runs immediately — synchronous code and all microtasks run first.',
                'Overusing process.nextTick, which can starve the event loop if it recursively re-queues itself.',
              ],
              exercises: [
                {
                  type: 'quiz',
                  prompt: 'Which runs first when scheduled together: a process.nextTick callback or a resolved Promise .then callback?',
                  hint: 'nextTick has its own queue.',
                  solution: {
                    explanation:
                      'process.nextTick runs first. Its queue is drained before the Promise microtask queue on each turn.',
                  },
                },
                {
                  type: 'predict',
                  prompt: 'Predict the output order: console.log(\'A\'); setTimeout(()=>console.log(\'B\'),0); Promise.resolve().then(()=>console.log(\'C\'));',
                  solution: {
                    explanation:
                      'A, then C, then B. A is synchronous; C is a Promise microtask drained before timers; B is a timer callback that runs last.',
                  },
                },
                {
                  type: 'task',
                  prompt: 'Name the event-loop phase that runs setImmediate callbacks and the one that runs setTimeout callbacks.',
                  solution: {
                    lines: [
                      'setImmediate -> the check phase',
                      'setTimeout -> the timers phase',
                    ],
                    explanation: 'They live in different phases, which is why their relative order can vary depending on where they are scheduled.',
                  },
                },
              ],
              docs: 'https://nodejs.org/en/learn/asynchronous-work/event-loop-timers-and-nexttick',
            },
            {
              id: 'nd1-t2-c2',
              title: 'The libuv thread pool',
              summary:
                'Some operations are not natively asynchronous at the OS level, so libuv runs them on a small background thread pool — keeping the main thread free.',
              explanation:
                'Although Node\'s JavaScript runs on one thread, libuv maintains a small pool of background worker threads (four by default) to handle operations that the operating system cannot perform in a truly non-blocking way. File system calls, DNS lookups via dns.lookup, and CPU-bound crypto and zlib operations are dispatched to this pool; when a worker finishes, it queues the callback back on the main thread. This is why even \'asynchronous\' file reads have a hidden parallelism limit: launch more concurrent file operations than the pool size and the extras wait in line. You can grow the pool by setting the UV_THREADPOOL_SIZE environment variable before the process starts, which can speed up workloads that are heavy on those specific APIs. Importantly, network I/O does NOT use the thread pool — sockets are handled by efficient OS event notification (epoll, kqueue, IOCP) directly in the poll phase. Knowing which operations touch the pool helps you diagnose throughput limits that have nothing to do with your JavaScript.',
              keyPoints: [
                'libuv has a background thread pool (default size 4) for certain operations.',
                'File system, dns.lookup, and crypto/zlib work go through the pool.',
                'Network sockets do NOT use the pool — the OS notifies the poll phase directly.',
                'Set UV_THREADPOOL_SIZE before startup to enlarge the pool.',
              ],
              exercises: [
                {
                  type: 'quiz',
                  prompt: 'Do network sockets use the libuv thread pool? Explain.',
                  hint: 'Think about how the OS notifies about socket readiness.',
                  solution: {
                    explanation:
                      'No. Sockets use efficient OS-level event notification (epoll/kqueue/IOCP) handled in the poll phase. The thread pool is for file system, DNS lookup, and crypto/zlib-style work.',
                  },
                },
                {
                  type: 'task',
                  prompt: 'Set the libuv thread pool to 8 when starting app.js from the shell.',
                  solution: {
                    lines: ['UV_THREADPOOL_SIZE=8 node app.js'],
                    explanation: 'The environment variable must be set before the process starts because the pool is created during initialization.',
                  },
                },
                {
                  type: 'predict',
                  prompt: 'With the default pool size, you fire 8 simultaneous large file reads. How are they processed?',
                  solution: {
                    explanation:
                      'Four reads start immediately on the four pool threads; the remaining four wait until a thread frees up. The operations are async to your code but limited by the pool size.',
                  },
                },
              ],
              docs: 'https://nodejs.org/en/learn/asynchronous-work/dont-block-the-event-loop',
            },
          ],
        },
      ],
    },
    /* ───────────────────── LEVEL 2 — CORE MODULES ───────────────────── */
    {
      level: 2,
      name: 'Core modules',
      focus: 'The standard library: file system, events and streams, and the process and OS globals',
      accent: '#3c873a',
      soft: '#e7f3e7',
      topics: [
        {
          id: 'nd2-t0',
          name: 'The file system',
          concepts: [
            {
              id: 'nd2-t0-c0',
              title: 'fs flavors: callbacks, sync, and promises',
              summary:
                'The fs module offers three styles for almost every operation: callback-based, synchronous (blocking), and promise-based via fs/promises. Prefer the promise API.',
              explanation:
                'Node\'s file-system module exposes most operations in three forms. The classic callback form (fs.readFile) is asynchronous and takes an error-first callback. The synchronous form (fs.readFileSync) blocks the thread until the operation completes and either returns the result or throws — convenient for startup scripts but dangerous in a running server. The modern promise form lives under node:fs/promises (fs.promises.readFile) and integrates cleanly with async/await, which is what you should reach for in new code. Choosing among them is mostly about context: synchronous calls are acceptable during one-time startup (reading a config before the server listens), but inside request handlers you must use the async or promise variants so you never block the event loop. The promise API also gives you cleaner error handling with try/catch and avoids the nesting that callbacks encourage. Whichever flavor you pick, remember that file paths should be built with the path module rather than string concatenation so they work across operating systems.',
              code: {
                language: 'javascript',
                lines: [
                  '// Promise style (preferred) with async/await',
                  'import { readFile } from \'node:fs/promises\';',
                  'const text = await readFile(\'config.json\', \'utf8\');',
                  '',
                  '// Callback style',
                  'import { readFile as readFileCb } from \'node:fs\';',
                  'readFileCb(\'config.json\', \'utf8\', (err, data) => {',
                  '  if (err) throw err;',
                  '  console.log(data);',
                  '});',
                ],
                explanation:
                  'The promises API returns a value you can await; the callback API delivers the result to an error-first callback. Passing \'utf8\' returns a string instead of a Buffer.',
              },
              keyPoints: [
                'Three styles: callback (fs.readFile), sync (fs.readFileSync), promises (fs/promises).',
                'Prefer fs/promises with async/await in new code.',
                'Sync calls block the thread — fine at startup, harmful in request handlers.',
                'Pass an encoding like \'utf8\' to get a string instead of a Buffer.',
              ],
              commonMistakes: [
                'Using readFileSync inside an HTTP handler, blocking the event loop for every request.',
                'Forgetting the encoding argument and being surprised the result is a Buffer, not a string.',
              ],
              exercises: [
                {
                  type: 'quiz',
                  prompt: 'When is fs.readFileSync acceptable, and when is it dangerous?',
                  hint: 'Think about what is running at the time.',
                  solution: {
                    explanation:
                      'It is acceptable during one-time startup (e.g. reading config before the server listens). It is dangerous inside request handlers or any hot path because it blocks the single thread and stalls all other work.',
                  },
                },
                {
                  type: 'task',
                  prompt: 'Read the file notes.txt as a UTF-8 string using the promises API inside an async function.',
                  solution: {
                    lines: [
                      'import { readFile } from \'node:fs/promises\';',
                      'async function load() {',
                      '  const text = await readFile(\'notes.txt\', \'utf8\');',
                      '  return text;',
                      '}',
                    ],
                    explanation: 'fs/promises.readFile returns a promise; awaiting it yields the file contents as a string because of the \'utf8\' encoding.',
                  },
                },
                {
                  type: 'predict',
                  prompt: 'You call fs.readFile(\'data.bin\') with no encoding. What type is the data argument in the callback?',
                  solution: {
                    explanation:
                      'A Buffer. Without an encoding, fs returns raw bytes as a Buffer rather than decoding them into a string.',
                  },
                },
              ],
              docs: 'https://nodejs.org/docs/latest/api/fs.html',
            },
            {
              id: 'nd2-t0-c1',
              title: 'Reading, writing and working with directories',
              summary:
                'Beyond readFile/writeFile, fs lets you append, check existence, read directories, and create or remove folders, including recursive options.',
              explanation:
                'The everyday file operations are readFile and writeFile, where writeFile replaces a file\'s contents entirely (creating it if needed) and appendFile adds to the end. To work with folders, readdir lists a directory\'s entries, mkdir creates one (with { recursive: true } to make nested paths in a single call), and rm removes files or whole trees (with { recursive: true, force: true } to delete a folder and ignore missing ones). For metadata, stat returns information such as size and whether an entry is a file or directory. A modern pattern is to avoid the old fs.exists (which is deprecated and racy) and instead simply attempt the operation and catch the error, or use access if you must check first. When you need to process a file too large to hold in memory at once, switch from readFile to streams, covered later. Mastering these handful of functions covers the vast majority of real file-handling tasks.',
              code: {
                language: 'javascript',
                lines: [
                  'import { writeFile, appendFile, readdir, mkdir } from \'node:fs/promises\';',
                  '',
                  'await mkdir(\'logs\', { recursive: true });',
                  'await writeFile(\'logs/app.log\', \'started\\n\');',
                  'await appendFile(\'logs/app.log\', \'ready\\n\');',
                  '',
                  'const files = await readdir(\'logs\');',
                  'console.log(files); // [ \'app.log\' ]',
                ],
                explanation:
                  'mkdir with recursive creates the folder safely; writeFile overwrites, appendFile adds a line; readdir lists the directory contents.',
              },
              keyPoints: [
                'writeFile overwrites; appendFile adds to the end; both create the file if absent.',
                'readdir lists directory entries; mkdir creates folders ({ recursive: true } for nested).',
                'rm with { recursive: true, force: true } deletes a tree and ignores missing paths.',
                'Avoid the deprecated fs.exists; try the operation and catch, or use access.',
              ],
              exercises: [
                {
                  type: 'quiz',
                  prompt: 'What is the difference between writeFile and appendFile?',
                  hint: 'One replaces, one adds.',
                  solution: {
                    explanation:
                      'writeFile replaces the file\'s entire contents (creating it if it does not exist). appendFile keeps existing contents and adds the new data to the end.',
                  },
                },
                {
                  type: 'task',
                  prompt: 'Create a nested directory data/cache in one call, even if data does not yet exist.',
                  solution: {
                    lines: [
                      'import { mkdir } from \'node:fs/promises\';',
                      'await mkdir(\'data/cache\', { recursive: true });',
                    ],
                    explanation: 'The recursive option creates every missing segment of the path and does not error if the directory already exists.',
                  },
                },
                {
                  type: 'predict',
                  prompt: 'You call writeFile(\'out.txt\', \'B\') on a file that already contains \'AAAA\'. What does out.txt contain afterward?',
                  solution: {
                    explanation:
                      'It contains just \'B\'. writeFile truncates and replaces the whole file rather than appending.',
                  },
                },
              ],
              docs: 'https://nodejs.org/docs/latest/api/fs.html#promises-api',
            },
            {
              id: 'nd2-t0-c2',
              title: 'The path module: cross-platform paths',
              summary:
                'The path module builds, joins and parses file paths correctly on any operating system, handling separators and edge cases you should never code by hand.',
              explanation:
                'Hard-coding paths with string concatenation breaks across platforms — Windows uses backslashes, POSIX systems use forward slashes — and mishandles trailing separators and .. segments. The path module solves this. path.join intelligently joins segments with the correct separator and normalizes the result; path.resolve produces an absolute path by resolving segments from right to left against the current working directory; and path.basename, path.dirname and path.extname extract the filename, folder and extension respectively. path.parse returns all of those at once as an object. A frequent need is building a path relative to the current file rather than the process\'s working directory; for that you combine the module\'s directory (from __dirname in CommonJS or import.meta.url in ESM) with path.join. Using path consistently means your code runs unchanged on a developer\'s Mac and a Linux production server.',
              code: {
                language: 'javascript',
                lines: [
                  'import { join, resolve, basename, extname } from \'node:path\';',
                  '',
                  'join(\'src\', \'data\', \'file.json\'); // \'src/data/file.json\'',
                  'resolve(\'config.json\'); // absolute path from cwd',
                  'basename(\'/a/b/notes.txt\'); // \'notes.txt\'',
                  'extname(\'notes.txt\'); // \'.txt\'',
                ],
                explanation:
                  'join builds a normalized relative path with the correct separator; resolve produces an absolute path; basename and extname pull out the filename and extension.',
              },
              keyPoints: [
                'Never concatenate paths by hand — use path to stay cross-platform.',
                'path.join joins and normalizes; path.resolve makes an absolute path.',
                'basename, dirname, extname extract parts; path.parse returns them all.',
                'Combine __dirname (or import.meta.url) with join for paths relative to the file.',
              ],
              commonMistakes: [
                'Building paths with the + operator and a literal slash, which breaks on Windows.',
                'Confusing path.join (relative concatenation) with path.resolve (absolute from cwd).',
              ],
              exercises: [
                {
                  type: 'quiz',
                  prompt: 'Why use path.join instead of writing \'src\' + \'/\' + \'file.js\'?',
                  hint: 'Think about other operating systems.',
                  solution: {
                    explanation:
                      'path.join uses the correct separator for the current OS and normalizes the result (collapsing .. and duplicate slashes), so the same code works on Windows and POSIX systems. Manual concatenation hard-codes a separator and can break.',
                  },
                },
                {
                  type: 'task',
                  prompt: 'Build an absolute path to data.json that sits in the same folder as the current CommonJS module.',
                  solution: {
                    lines: [
                      'const path = require(\'node:path\');',
                      'const file = path.join(__dirname, \'data.json\');',
                    ],
                    explanation: '__dirname is the current module\'s directory; joining it with the filename yields a path that does not depend on where the process was launched.',
                  },
                },
                {
                  type: 'predict',
                  prompt: 'What does path.extname(\'archive.tar.gz\') return?',
                  solution: {
                    explanation:
                      'It returns \'.gz\'. extname returns only the portion from the last dot onward, not the full compound extension.',
                  },
                },
              ],
              docs: 'https://nodejs.org/docs/latest/api/path.html',
            },
          ],
        },
        {
          id: 'nd2-t1',
          name: 'Events and streams',
          concepts: [
            {
              id: 'nd2-t1-c0',
              title: 'EventEmitter: the pub/sub backbone',
              summary:
                'EventEmitter lets objects emit named events and other code subscribe to them. Many core Node APIs, including streams and servers, are built on it.',
              explanation:
                'The events module exports EventEmitter, the foundation of Node\'s evented design. An emitter can emit a named event with optional arguments, and any number of listeners registered with on are called synchronously, in registration order, whenever that event fires. once registers a listener that fires a single time and then removes itself, and removeListener (or off) detaches one. This publish/subscribe pattern decouples the producer of an event from its consumers — an HTTP server, a file stream and a child process all expose their lifecycle as events. Two details matter in practice: the special \'error\' event is treated specially, and if you emit \'error\' with no listener attached, Node throws and can crash the process, so always handle it. Also, emitters warn when more than ten listeners are added for one event, a guard against leaks; raise the limit deliberately with setMaxListeners if you genuinely need more. Building your own EventEmitter subclass is a clean way to model components that report progress or state changes.',
              code: {
                language: 'javascript',
                lines: [
                  'import { EventEmitter } from \'node:events\';',
                  '',
                  'const bus = new EventEmitter();',
                  'bus.on(\'order\', (id) => console.log(\'got order\', id));',
                  'bus.once(\'ready\', () => console.log(\'ready once\'));',
                  '',
                  'bus.emit(\'order\', 42); // got order 42',
                  'bus.emit(\'ready\'); // ready once',
                  'bus.emit(\'ready\'); // (nothing — once already fired)',
                ],
                explanation:
                  'on subscribes a recurring listener; once subscribes a one-time listener; emit fires the event and passes arguments to every listener synchronously.',
              },
              keyPoints: [
                'EventEmitter emits named events; listeners subscribe with on and once.',
                'Listeners run synchronously in the order they were registered.',
                'An emitted \'error\' event with no listener throws and can crash the process.',
                'A warning fires past ten listeners on one event; raise it with setMaxListeners.',
              ],
              commonMistakes: [
                'Forgetting to attach an \'error\' listener to an emitter, so an emitted error crashes the app.',
                'Adding listeners in a loop without removing them, triggering the max-listeners leak warning.',
              ],
              exercises: [
                {
                  type: 'quiz',
                  prompt: 'What happens if an EventEmitter emits an \'error\' event and nothing is listening for it?',
                  hint: 'error is a special event name.',
                  solution: {
                    explanation:
                      'Node throws the error, which becomes an uncaught exception and can crash the process. You should always register an \'error\' listener on emitters that can emit one.',
                  },
                },
                {
                  type: 'task',
                  prompt: 'Register a listener that reacts to the \'done\' event exactly once.',
                  solution: {
                    lines: ['emitter.once(\'done\', () => console.log(\'finished\'));'],
                    explanation: 'once auto-removes the listener after the first time the event fires, so it will not run again on later emits.',
                  },
                },
                {
                  type: 'predict',
                  prompt: 'You call emitter.on(\'tick\', f) then emit \'tick\' twice. How many times does f run?',
                  solution: {
                    explanation:
                      'Twice. A listener added with on runs every time the event is emitted, unlike once which runs only the first time.',
                  },
                },
              ],
              docs: 'https://nodejs.org/docs/latest/api/events.html',
            },
            {
              id: 'nd2-t1-c1',
              title: 'Streams and piping',
              summary:
                'Streams process data piece by piece instead of all at once. Readable, Writable, Duplex and Transform streams connect with pipe to move data efficiently.',
              explanation:
                'A stream lets you handle data in chunks as it arrives rather than buffering the whole thing in memory, which is essential for large files or network data. There are four types: Readable (a source you read from, like a file read stream or an HTTP request), Writable (a sink you write to, like a file write stream or an HTTP response), Duplex (both, like a TCP socket), and Transform (a Duplex that modifies data passing through, like gzip). The simplest way to connect them is pipe, which reads from a source and writes to a destination while automatically handling backpressure — pausing the source when the destination cannot keep up so memory stays bounded. The modern, safer alternative is the pipeline helper from node:stream, which wires streams together and propagates errors and cleanup correctly, something raw pipe does not do well. Streams power Node\'s ability to serve huge files with constant memory, and chaining a Readable through a Transform into a Writable is a remarkably expressive way to build data processing.',
              analogy:
                'readFile is filling a bucket from the tap and then carrying the whole bucket. A stream is a hose: water flows continuously from source to destination, and you never have to hold it all at once.',
              code: {
                language: 'javascript',
                lines: [
                  'import { createReadStream, createWriteStream } from \'node:fs\';',
                  'import { pipeline } from \'node:stream/promises\';',
                  'import { createGzip } from \'node:zlib\';',
                  '',
                  '// Stream-copy a file through gzip, with proper error handling',
                  'await pipeline(',
                  '  createReadStream(\'big.log\'),',
                  '  createGzip(),',
                  '  createWriteStream(\'big.log.gz\')',
                  ');',
                ],
                explanation:
                  'pipeline reads the source, pipes it through a gzip Transform, and writes the compressed output, handling backpressure and errors for the whole chain.',
              },
              keyPoints: [
                'Streams process data in chunks, keeping memory use low for large data.',
                'Four types: Readable, Writable, Duplex, Transform.',
                'pipe connects a Readable to a Writable and handles backpressure.',
                'Prefer pipeline for correct error propagation and cleanup across a chain.',
              ],
              commonMistakes: [
                'Using raw .pipe() without error handling, so a failure mid-chain leaks resources.',
                'Buffering a huge file with readFile when a stream would keep memory constant.',
              ],
              exercises: [
                {
                  type: 'quiz',
                  prompt: 'What problem does backpressure solve, and how does pipe address it?',
                  hint: 'Producer faster than consumer.',
                  solution: {
                    explanation:
                      'Backpressure prevents a fast source from overwhelming a slow destination and exhausting memory. pipe automatically pauses the readable when the writable\'s buffer fills and resumes it when the writable drains.',
                  },
                },
                {
                  type: 'quiz',
                  prompt: 'Why is stream.pipeline preferred over chaining .pipe() calls?',
                  solution: {
                    explanation:
                      'pipeline propagates errors from any stream in the chain to a single place and destroys/cleans up all the streams properly. Raw .pipe() does not forward errors or clean up downstream streams on failure.',
                  },
                },
                {
                  type: 'predict',
                  prompt: 'You serve a 2 GB file. One server uses readFile then res.end(data); another pipes a read stream to res. Which risks running out of memory?',
                  solution: {
                    explanation:
                      'The readFile version, because it loads the entire 2 GB into memory before sending. The streaming version sends chunks and keeps memory roughly constant.',
                  },
                },
              ],
              docs: 'https://nodejs.org/docs/latest/api/stream.html',
            },
            {
              id: 'nd2-t1-c2',
              title: 'Buffers and binary data',
              summary:
                'A Buffer is a fixed-length chunk of raw bytes outside V8\'s heap. Node uses Buffers for file and network data; you convert between Buffers and strings with encodings.',
              explanation:
                'JavaScript strings are great for text but awkward for raw bytes, so Node provides Buffer, a fixed-size sequence of bytes stored outside the normal V8 heap. Whenever you read a file without an encoding, receive network data, or work with binary protocols, you are handling Buffers. You create them safely with Buffer.from (from a string, array or another buffer) or Buffer.alloc (a zero-filled buffer of a given size); avoid the deprecated and unsafe Buffer.alloc-less constructor and the old new Buffer(). To turn bytes into text you call buf.toString(encoding) — \'utf8\' is the default and most common, while \'hex\' and \'base64\' are useful for encoding binary as text. Buffers are also why streaming works: each chunk a readable stream emits is a Buffer. Understanding that text is just bytes plus an encoding clears up many confusing bugs, such as a multi-byte UTF-8 character being split across two chunks. For typed numeric data shared with other code, Node also supports the standard TypedArray and ArrayBuffer APIs, which Buffer is built upon.',
              code: {
                language: 'javascript',
                lines: [
                  '// String <-> Buffer',
                  'const buf = Buffer.from(\'hi\', \'utf8\');',
                  'console.log(buf); // <Buffer 68 69>',
                  'console.log(buf.toString(\'hex\')); // \'6869\'',
                  'console.log(buf.length); // 2 (bytes)',
                  '',
                  '// Allocate a zero-filled buffer',
                  'const empty = Buffer.alloc(4); // <Buffer 00 00 00 00>',
                ],
                explanation:
                  'Buffer.from converts a string to bytes; toString converts back using an encoding; alloc creates a safely zero-filled buffer of a fixed size.',
              },
              keyPoints: [
                'A Buffer is a fixed-length sequence of raw bytes stored outside the V8 heap.',
                'Create with Buffer.from or Buffer.alloc; avoid the deprecated new Buffer().',
                'Convert to text with toString(encoding); \'utf8\' is the default.',
                'Stream chunks are Buffers; encodings like hex and base64 represent bytes as text.',
              ],
              commonMistakes: [
                'Using the deprecated new Buffer(size) constructor, which can expose uninitialized memory.',
                'Decoding a chunk in isolation when a multi-byte character is split across two stream chunks.',
              ],
              exercises: [
                {
                  type: 'quiz',
                  prompt: 'What is the difference between Buffer.alloc(8) and Buffer.from(\'8\')?',
                  hint: 'One is a size, one is content.',
                  solution: {
                    explanation:
                      'Buffer.alloc(8) creates an 8-byte zero-filled buffer. Buffer.from(\'8\') creates a 1-byte buffer containing the byte for the character \'8\' (0x38). One takes a length, the other takes content.',
                  },
                },
                {
                  type: 'task',
                  prompt: 'Encode the string \'node\' as base64.',
                  solution: {
                    lines: ['Buffer.from(\'node\', \'utf8\').toString(\'base64\'); // \'bm9kZQ==\''],
                    explanation: 'Convert the string to a Buffer, then call toString with the \'base64\' encoding.',
                  },
                },
                {
                  type: 'predict',
                  prompt: 'console.log(Buffer.from(\'A\').length) — what prints, and would \'\\u00e9\' (e-acute) differ?',
                  solution: {
                    explanation:
                      '1 prints, since \'A\' is one ASCII byte in UTF-8. \'\\u00e9\' would be 2, because that accented character takes two bytes in UTF-8 — buffer length counts bytes, not characters.',
                  },
                },
              ],
              docs: 'https://nodejs.org/docs/latest/api/buffer.html',
            },
          ],
        },
        {
          id: 'nd2-t2',
          name: 'Process, OS and globals',
          concepts: [
            {
              id: 'nd2-t2-c0',
              title: 'process.argv and process.env',
              summary:
                'process.argv exposes command-line arguments and process.env exposes environment variables — the two main channels for configuring a Node program from outside.',
              explanation:
                'The global process object represents the running Node instance and is your link to the outside world. process.argv is an array of command-line arguments: index 0 is the node executable, index 1 is the script path, and index 2 onward are the arguments the user passed — so you typically slice from index 2. For anything more than trivial flags, a parser library or the built-in util.parseArgs makes this far cleaner. process.env is an object of the environment variables visible to the process, the conventional way to inject configuration and secrets without hard-coding them; values are always strings, so a numeric or boolean setting must be parsed. Reading missing env vars yields undefined, so validate required configuration at startup and fail fast with a clear message. Keeping configuration in the environment rather than the source code is a cornerstone of the twelve-factor methodology and keeps secrets out of version control.',
              code: {
                language: 'javascript',
                lines: [
                  '// Run: node greet.js Ada Lovelace',
                  'const args = process.argv.slice(2);',
                  'console.log(args); // [ \'Ada\', \'Lovelace\' ]',
                  '',
                  '// Read configuration from the environment',
                  'const port = Number(process.env.PORT) || 3000;',
                  'console.log(\'listening on\', port);',
                ],
                explanation:
                  'slice(2) drops the node and script entries to leave the user arguments. process.env values are strings, so PORT is converted with Number and falls back to 3000.',
              },
              keyPoints: [
                'process.argv[0] is node, [1] is the script, [2+] are user arguments — slice(2).',
                'process.env holds environment variables; every value is a string.',
                'Parse numbers and booleans from env vars; reading a missing one gives undefined.',
                'Validate required configuration at startup and fail fast.',
              ],
              commonMistakes: [
                'Treating an env var like a number without converting it (e.g. comparing process.env.PORT to 3000).',
                'Forgetting to slice(2), so the node path and script path appear as arguments.',
              ],
              exercises: [
                {
                  type: 'quiz',
                  prompt: 'Why do you usually slice process.argv from index 2?',
                  hint: 'What are the first two entries?',
                  solution: {
                    explanation:
                      'Index 0 is the path to the node executable and index 1 is the path to the script being run. The actual user-supplied arguments begin at index 2.',
                  },
                },
                {
                  type: 'task',
                  prompt: 'Read a DATABASE_URL environment variable and throw a clear error if it is missing.',
                  solution: {
                    lines: [
                      'const url = process.env.DATABASE_URL;',
                      'if (!url) {',
                      '  throw new Error(\'DATABASE_URL is required\');',
                      '}',
                    ],
                    explanation: 'Validating required configuration up front makes failures obvious at startup instead of mysterious later.',
                  },
                },
                {
                  type: 'predict',
                  prompt: 'process.env.DEBUG is the string \'false\'. What does if (process.env.DEBUG) { ... } do?',
                  solution: {
                    explanation:
                      'The block runs. The string \'false\' is truthy — only an empty string is falsy. You must compare explicitly, e.g. process.env.DEBUG === \'true\'.',
                  },
                },
              ],
              docs: 'https://nodejs.org/docs/latest/api/process.html',
            },
            {
              id: 'nd2-t2-c1',
              title: 'Globals: __dirname, __filename and module paths',
              summary:
                'CommonJS modules get __dirname and __filename for the current folder and file. ES modules instead derive paths from import.meta.url.',
              explanation:
                'In CommonJS, every module is handed two convenient variables: __filename, the absolute path to the current file, and __dirname, the absolute path to its directory. They are invaluable for building paths relative to the code itself rather than to wherever the process happened to be launched (the current working directory, available as process.cwd()). The distinction matters because process.cwd() changes depending on where the user runs node from, while __dirname is stable. ES modules do not define __dirname or __filename; instead they expose import.meta.url, a file:// URL for the current module, which you convert to a path with fileURLToPath and then take its dirname. Other useful globals include console for logging, the timer functions, and globalThis as the universal global object. Knowing the difference between a path relative to the file and one relative to the working directory eliminates a whole class of \'works on my machine\' bugs.',
              code: {
                language: 'javascript',
                lines: [
                  '// CommonJS — built in',
                  'console.log(__dirname);  // folder of this file',
                  'console.log(__filename); // full path of this file',
                  'console.log(process.cwd()); // where node was launched',
                  '',
                  '// ESM equivalent',
                  'import { fileURLToPath } from \'node:url\';',
                  'const here = fileURLToPath(import.meta.url);',
                ],
                explanation:
                  '__dirname/__filename describe the file in CommonJS; process.cwd() is the launch directory. In ESM, import.meta.url plus fileURLToPath reconstructs the file path.',
              },
              keyPoints: [
                '__dirname and __filename give the current folder/file in CommonJS.',
                'ES modules use import.meta.url with fileURLToPath instead.',
                'process.cwd() is the launch directory and can differ from __dirname.',
                'Build file-relative paths from __dirname, not from cwd, for stability.',
              ],
              exercises: [
                {
                  type: 'quiz',
                  prompt: 'How does __dirname differ from process.cwd()?',
                  hint: 'One is about the file, one is about how node was started.',
                  solution: {
                    explanation:
                      '__dirname is the directory of the current source file and is stable. process.cwd() is the directory from which the node process was launched and changes depending on where the user ran the command.',
                  },
                },
                {
                  type: 'task',
                  prompt: 'Get the current file path in an ES module.',
                  solution: {
                    lines: [
                      'import { fileURLToPath } from \'node:url\';',
                      'const filePath = fileURLToPath(import.meta.url);',
                    ],
                    explanation: 'ESM has no __filename; import.meta.url is a file URL, and fileURLToPath converts it to a normal file system path.',
                  },
                },
                {
                  type: 'predict',
                  prompt: 'You reference __dirname in a file inside an ESM project ("type": "module"). What happens?',
                  solution: {
                    explanation:
                      'A ReferenceError: __dirname is not defined. ES modules do not provide __dirname; you must derive it from import.meta.url.',
                  },
                },
              ],
              docs: 'https://nodejs.org/docs/latest/api/modules.html#__dirname',
            },
            {
              id: 'nd2-t2-c2',
              title: 'The os module and exit codes',
              summary:
                'The os module reports system information like CPU count and memory. Exit codes communicate success or failure of a process to whatever launched it.',
              explanation:
                'The os module exposes information about the host operating system: os.cpus() returns details for each logical CPU (useful for sizing a cluster), os.totalmem() and os.freemem() report memory, os.hostname() and os.platform() identify the machine, and os.tmpdir() gives the temp directory. This information is commonly used to adapt behavior to the environment, such as spawning one worker per CPU. Separately, every process ends with a numeric exit code that signals its outcome to the shell or orchestrator: 0 means success, any non-zero value means failure. You set it by letting the program finish naturally (code 0), by calling process.exit(code) explicitly, or by setting process.exitCode and letting the event loop drain — the last of which is preferred because process.exit truncates pending async work like buffered log writes. Correct exit codes are essential for shell scripts, CI pipelines and process managers, which decide whether to retry or alert based on them. The \'exit\' event lets you run last-moment synchronous cleanup.',
              code: {
                language: 'javascript',
                lines: [
                  'import os from \'node:os\';',
                  '',
                  'console.log(\'cpus:\', os.cpus().length);',
                  'console.log(\'platform:\', os.platform());',
                  'console.log(\'free mem:\', os.freemem());',
                  '',
                  '// Signal failure without truncating pending work',
                  'process.exitCode = 1;',
                ],
                explanation:
                  'os reports CPU count, platform and free memory. Setting process.exitCode = 1 marks the run as failed while letting the event loop finish naturally.',
              },
              keyPoints: [
                'os reports CPUs, memory, platform, hostname and the temp directory.',
                'Exit code 0 means success; any non-zero code means failure.',
                'Prefer process.exitCode over process.exit() to avoid truncating async work.',
                'CI, shells and process managers act on the exit code.',
              ],
              commonMistakes: [
                'Calling process.exit(0) before async logs or writes flush, silently dropping output.',
                'Returning a non-zero exit code on success (or vice versa), confusing CI and scripts.',
              ],
              exercises: [
                {
                  type: 'quiz',
                  prompt: 'What does an exit code of 0 mean versus a non-zero code?',
                  hint: 'Think how a shell or CI interprets it.',
                  solution: {
                    explanation:
                      '0 indicates the process succeeded. Any non-zero code indicates failure, which is how shells, CI pipelines and process managers decide whether something went wrong.',
                  },
                },
                {
                  type: 'quiz',
                  prompt: 'Why is setting process.exitCode often safer than calling process.exit()?',
                  solution: {
                    explanation:
                      'process.exit() ends the process immediately and can truncate pending asynchronous work such as buffered writes or logs. Setting process.exitCode lets the event loop finish naturally and still reports the desired code.',
                  },
                },
                {
                  type: 'task',
                  prompt: 'Use the os module to print how many logical CPUs the machine has.',
                  solution: {
                    lines: [
                      'import os from \'node:os\';',
                      'console.log(os.cpus().length);',
                    ],
                    explanation: 'os.cpus() returns one entry per logical CPU, so its length is the CPU count — handy for deciding how many workers to spawn.',
                  },
                },
              ],
              docs: 'https://nodejs.org/docs/latest/api/os.html',
            },
          ],
        },
      ],
    },
    /* ──────────────── LEVEL 3 — BUILDING SERVERS AND ASYNC ──────────────── */
    {
      level: 3,
      name: 'Servers and async',
      focus: 'The http module, asynchronous patterns, and robust error handling',
      accent: '#3c873a',
      soft: '#e7f3e7',
      topics: [
        {
          id: 'nd3-t0',
          name: 'The http module',
          concepts: [
            {
              id: 'nd3-t0-c0',
              title: 'Creating an HTTP server',
              summary:
                'http.createServer takes a request handler and returns a server you start with listen. Every request invokes the handler with a request and a response object.',
              explanation:
                'Node can be a web server with no framework at all. http.createServer accepts a function that runs for every incoming request and receives two arguments: req (an IncomingMessage, a readable stream representing the request) and res (a ServerResponse, a writable stream you use to reply). You start accepting connections by calling server.listen(port), optionally with a callback that runs once the server is ready. The handler must always end the response — at minimum res.end() — or the client hangs waiting forever. This raw API is the foundation every framework (Express, Fastify, Koa) builds upon, so understanding it demystifies what those libraries do for you. Because the handler runs on the single event-loop thread, it must stay non-blocking; any slow work should be asynchronous. The same module also provides http.request and http.get for acting as a client, covered in the async patterns and production sections.',
              code: {
                language: 'javascript',
                lines: [
                  'import { createServer } from \'node:http\';',
                  '',
                  'const server = createServer((req, res) => {',
                  '  res.statusCode = 200;',
                  '  res.setHeader(\'Content-Type\', \'text/plain\');',
                  '  res.end(\'Hello from Node\');',
                  '});',
                  '',
                  'server.listen(3000, () => console.log(\'on 3000\'));',
                ],
                explanation:
                  'createServer registers a handler for every request; the handler sets a status and header, then ends the response with a body. listen starts accepting connections.',
              },
              diagram: {
                type: 'mermaid',
                lines: [
                  'flowchart LR',
                  '  CLIENT[Client] --> SERVER[http server]',
                  '  SERVER --> HANDLER[Request handler]',
                  '  HANDLER --> RES[Response]',
                  '  RES --> CLIENT',
                ],
                caption: 'Each request runs the handler, which writes a response back to the client.',
              },
              keyPoints: [
                'http.createServer(handler) returns a server; the handler runs per request.',
                'The handler gets req (readable) and res (writable) objects.',
                'Call server.listen(port) to start; always end the response.',
                'Frameworks like Express are built on top of this raw API.',
              ],
              commonMistakes: [
                'Never calling res.end(), leaving the client hanging until it times out.',
                'Doing blocking work inside the handler, stalling all concurrent requests.',
              ],
              exercises: [
                {
                  type: 'quiz',
                  prompt: 'What are the two arguments passed to an http request handler, and what is each for?',
                  hint: 'One is incoming, one is outgoing.',
                  solution: {
                    explanation:
                      'req (IncomingMessage), a readable stream with the request details, and res (ServerResponse), a writable stream you use to send the reply.',
                  },
                },
                {
                  type: 'task',
                  prompt: 'Write a minimal server that replies with the text \'ok\' on port 8080.',
                  solution: {
                    lines: [
                      'import { createServer } from \'node:http\';',
                      'createServer((req, res) => res.end(\'ok\')).listen(8080);',
                    ],
                    explanation: 'createServer with a handler that ends the response with \'ok\', started on port 8080 with listen.',
                  },
                },
                {
                  type: 'predict',
                  prompt: 'A handler sets a status and a header but never calls res.end(). What does the client experience?',
                  solution: {
                    explanation:
                      'The request hangs. The response is never finished, so the client waits until its own timeout. Every response must be ended.',
                  },
                },
              ],
              docs: 'https://nodejs.org/docs/latest/api/http.html#httpcreateserveroptions-requestlistener',
            },
            {
              id: 'nd3-t0-c1',
              title: 'The request and response objects',
              summary:
                'req exposes method, url and headers and streams the body; res lets you set the status code, headers and body. Reading the body means consuming the request stream.',
              explanation:
                'The req object tells you everything about the incoming request: req.method (GET, POST, etc.), req.url (the path and query string), and req.headers (a lowercased object). The request body is not handed to you as a string — req is a readable stream, so for a POST or PUT you collect the body by listening for \'data\' chunks and concatenating them on \'end\', or by using a stream utility. The res object is how you reply: set res.statusCode and add headers with res.setHeader (before writing the body), then send data with res.write and finish with res.end, or do both at once by passing the body to res.end. Once you write the first byte or call writeHead, headers are flushed and can no longer be changed. Parsing the URL into a path and query is commonly done with the WHATWG URL class. These primitives are exactly what middleware in higher-level frameworks wraps in friendlier helpers like req.body and res.json.',
              code: {
                language: 'javascript',
                lines: [
                  'const server = createServer((req, res) => {',
                  '  console.log(req.method, req.url);',
                  '  let body = \'\';',
                  '  req.on(\'data\', (chunk) => { body += chunk; });',
                  '  req.on(\'end\', () => {',
                  '    res.setHeader(\'Content-Type\', \'application/json\');',
                  '    res.end(JSON.stringify({ received: body }));',
                  '  });',
                  '});',
                ],
                explanation:
                  'req.method and req.url describe the request; the body is read by accumulating \'data\' chunks until \'end\'; the response sends JSON after setting the content type.',
              },
              keyPoints: [
                'req.method, req.url and req.headers describe the request.',
                'The body is a stream — accumulate \'data\' chunks and act on \'end\'.',
                'Set res.statusCode and headers before writing the body.',
                'res.end can take the body directly; once bytes are written, headers are locked.',
              ],
              commonMistakes: [
                'Trying to read req.body directly — there is no such property; you must consume the stream.',
                'Calling res.setHeader after the body has started, which throws because headers are already sent.',
              ],
              exercises: [
                {
                  type: 'quiz',
                  prompt: 'Why can you not simply read req.body in the raw http module?',
                  hint: 'req is a stream.',
                  solution: {
                    explanation:
                      'req is a readable stream, not a buffered object. You must consume the stream — collecting \'data\' chunks until the \'end\' event — to assemble the body yourself (or use a helper). Frameworks add a body-parsing layer for you.',
                  },
                },
                {
                  type: 'task',
                  prompt: 'Send a 404 response with a JSON body { error: \'not found\' }.',
                  solution: {
                    lines: [
                      'res.statusCode = 404;',
                      'res.setHeader(\'Content-Type\', \'application/json\');',
                      'res.end(JSON.stringify({ error: \'not found\' }));',
                    ],
                    explanation: 'Set the status and content type before ending the response with a serialized JSON body.',
                  },
                },
                {
                  type: 'predict',
                  prompt: 'A handler calls res.write(\'hi\') and then res.setHeader(\'X-Test\', \'1\'). What happens?',
                  solution: {
                    explanation:
                      'It throws an error. Once res.write sends the first bytes, the headers are already flushed and can no longer be set.',
                  },
                },
              ],
              docs: 'https://nodejs.org/docs/latest/api/http.html#class-httpincomingmessage',
            },
            {
              id: 'nd3-t0-c2',
              title: 'Basic routing and status codes',
              summary:
                'Routing means choosing a response based on the request method and URL. Status codes communicate the outcome: 2xx success, 4xx client error, 5xx server error.',
              explanation:
                'A router is just logic that branches on req.method and the request path to decide what to do. With the raw http module you typically parse the URL, then use a switch or a series of conditionals to match routes, returning a 404 for anything unmatched. Choosing the right HTTP status code is part of doing this well: 200 OK for a successful GET, 201 Created after a successful POST that creates a resource, 204 No Content when there is nothing to return, 400 Bad Request for malformed input, 401 Unauthorized and 403 Forbidden for authentication and authorization failures, 404 Not Found for missing resources, and 500 Internal Server Error for unexpected server-side failures. The first digit conveys the category: 2xx success, 3xx redirection, 4xx the client did something wrong, 5xx the server failed. Hand-rolling routing teaches the fundamentals, but for any real application a framework\'s router removes the tedium and edge cases. Always set an explicit, meaningful status code rather than letting everything default to 200.',
              code: {
                language: 'javascript',
                lines: [
                  'const server = createServer((req, res) => {',
                  '  const { method, url } = req;',
                  '  if (method === \'GET\' && url === \'/\') {',
                  '    res.statusCode = 200;',
                  '    res.end(\'home\');',
                  '  } else if (method === \'GET\' && url === \'/health\') {',
                  '    res.statusCode = 200;',
                  '    res.end(\'ok\');',
                  '  } else {',
                  '    res.statusCode = 404;',
                  '    res.end(\'not found\');',
                  '  }',
                  '});',
                ],
                explanation:
                  'The handler branches on method and url to route requests, returning an explicit 200 for known routes and a 404 fallback for everything else.',
              },
              keyPoints: [
                'Routing branches on req.method and the request path.',
                'Status categories: 2xx success, 3xx redirect, 4xx client error, 5xx server error.',
                'Use 201 for created, 204 for empty, 400 for bad input, 404 for missing, 500 for server faults.',
                'Always return an explicit, meaningful status; provide a 404 fallback.',
              ],
              exercises: [
                {
                  type: 'quiz',
                  prompt: 'What status code best fits each: a successful POST that creates a record, malformed JSON in the request, and an unexpected database crash?',
                  hint: 'Created, client error, server error.',
                  solution: {
                    explanation:
                      '201 Created for the successful creation, 400 Bad Request for malformed input, and 500 Internal Server Error for the unexpected server-side failure.',
                  },
                },
                {
                  type: 'quiz',
                  prompt: 'What does the first digit of an HTTP status code tell you?',
                  solution: {
                    explanation:
                      'The category: 1xx informational, 2xx success, 3xx redirection, 4xx client error, and 5xx server error.',
                  },
                },
                {
                  type: 'predict',
                  prompt: 'A request hits a path your router does not match, and you never set res.statusCode. What status does the client receive?',
                  solution: {
                    explanation:
                      '200 OK, because that is the default status. You should explicitly set 404 for unmatched routes so clients are not misled.',
                  },
                },
              ],
              docs: 'https://nodejs.org/docs/latest/api/http.html#responsestatuscode',
            },
          ],
        },
        {
          id: 'nd3-t1',
          name: 'Asynchronous patterns',
          concepts: [
            {
              id: 'nd3-t1-c0',
              title: 'Error-first callbacks',
              summary:
                'The classic Node async convention passes a callback whose first argument is an error (or null) and whose remaining arguments are the result.',
              explanation:
                'Before promises, Node standardized on the error-first callback (sometimes called the node-style callback). The rule is simple: an asynchronous function takes a callback as its last argument, and that callback is invoked with the error as its first parameter. On success the error is null and the result follows; on failure the error is an Error object and there is no meaningful result. You must check the error first and return early, because forgetting to handle it lets a failure pass silently and the code continue with undefined data. This convention is everywhere in the older core API and many libraries, so reading and writing it fluently is essential even as you migrate to promises. Its weakness is composition: chaining several callbacks leads to deep nesting (callback hell) and scattered error handling, which is exactly the problem promises and async/await were designed to fix. util.promisify can convert a well-behaved error-first function into one that returns a promise.',
              code: {
                language: 'javascript',
                lines: [
                  'import { readFile } from \'node:fs\';',
                  '',
                  'readFile(\'data.txt\', \'utf8\', (err, data) => {',
                  '  if (err) {',
                  '    console.error(\'failed:\', err.message);',
                  '    return;',
                  '  }',
                  '  console.log(data);',
                  '});',
                ],
                explanation:
                  'The callback checks err first and returns on failure; only when err is null does it use data. This early-return pattern is the heart of the convention.',
              },
              keyPoints: [
                'Callback signature: (err, result); err is null on success.',
                'Always check err first and return early on failure.',
                'It is the convention across the older core API and many libraries.',
                'Deep chaining causes callback hell — promises solve composition.',
              ],
              commonMistakes: [
                'Ignoring the err argument and using the result anyway, hiding failures.',
                'Forgetting to return after handling the error, so success code runs too.',
              ],
              exercises: [
                {
                  type: 'quiz',
                  prompt: 'In an error-first callback (err, data), what does it mean when err is null?',
                  hint: 'No news is good news.',
                  solution: {
                    explanation:
                      'It means the operation succeeded and data holds the result. A non-null err means it failed and data should not be trusted.',
                  },
                },
                {
                  type: 'task',
                  prompt: 'Write a function readConfig(cb) that reads config.json and calls back with (err, parsedObject).',
                  solution: {
                    lines: [
                      'import { readFile } from \'node:fs\';',
                      'function readConfig(cb) {',
                      '  readFile(\'config.json\', \'utf8\', (err, data) => {',
                      '    if (err) return cb(err);',
                      '    try { cb(null, JSON.parse(data)); }',
                      '    catch (e) { cb(e); }',
                      '  });',
                      '}',
                    ],
                    explanation: 'It forwards read errors via cb(err), and also catches JSON parse errors, only calling cb(null, result) on full success.',
                  },
                },
                {
                  type: 'predict',
                  prompt: 'A callback handles the error case but forgets to return, then runs code that uses data. What can go wrong?',
                  solution: {
                    explanation:
                      'When err is set, data is typically undefined, so the success code runs with bad data and may throw or behave incorrectly. Always return after handling the error.',
                  },
                },
              ],
              docs: 'https://nodejs.org/en/learn/asynchronous-work/javascript-asynchronous-programming-and-callbacks',
            },
            {
              id: 'nd3-t1-c1',
              title: 'Promises and async/await',
              summary:
                'Promises represent a future value and chain with then/catch. async/await is syntactic sugar that lets you write asynchronous code in a sequential, readable style.',
              explanation:
                'A promise is an object representing an operation that will complete later, ending in one of two states: fulfilled with a value or rejected with a reason. You consume it with then for success and catch for failure, and you can chain because each then returns a new promise. async/await builds on promises: marking a function async makes it return a promise, and await pauses inside it until a promise settles, yielding the value or throwing the rejection. This lets you write asynchronous logic that reads top-to-bottom like synchronous code, with ordinary try/catch for errors, which is far clearer than nested callbacks. For independent operations that can run at the same time, do not await them one by one — start them and combine with Promise.all (all must succeed) or Promise.allSettled (collect every outcome). Remember that await serializes, so awaiting in a loop runs operations one after another; if they are independent, build an array of promises and await them together for real concurrency.',
              code: {
                language: 'javascript',
                lines: [
                  'async function loadAll() {',
                  '  try {',
                  '    // Run both concurrently, then wait for both',
                  '    const [user, posts] = await Promise.all([',
                  '      fetchUser(),',
                  '      fetchPosts(),',
                  '    ]);',
                  '    return { user, posts };',
                  '  } catch (err) {',
                  '    console.error(\'load failed:\', err.message);',
                  '    throw err;',
                  '  }',
                  '}',
                ],
                explanation:
                  'Promise.all starts both requests concurrently and resolves with both results; try/catch handles any rejection. Awaiting them separately would run them one after the other.',
              },
              keyPoints: [
                'A promise is fulfilled with a value or rejected with a reason.',
                'async functions return promises; await unwraps them and throws on rejection.',
                'Use try/catch around await for error handling.',
                'Promise.all runs independent work concurrently; allSettled collects all outcomes.',
              ],
              commonMistakes: [
                'Awaiting independent operations sequentially in a loop instead of with Promise.all.',
                'Forgetting to await a promise, so errors go unhandled and timing is wrong.',
              ],
              exercises: [
                {
                  type: 'quiz',
                  prompt: 'What is the difference between awaiting two promises one after another versus Promise.all?',
                  hint: 'Sequential versus concurrent.',
                  solution: {
                    explanation:
                      'Awaiting them one after another runs them sequentially — the second starts only after the first finishes. Promise.all starts both immediately and waits for both, so independent work runs concurrently and finishes sooner.',
                  },
                },
                {
                  type: 'quiz',
                  prompt: 'How do Promise.all and Promise.allSettled differ when one promise rejects?',
                  solution: {
                    explanation:
                      'Promise.all rejects immediately as soon as any promise rejects, discarding the other results. Promise.allSettled always resolves with an array describing each outcome (fulfilled or rejected), so you can inspect every result.',
                  },
                },
                {
                  type: 'predict',
                  prompt: 'An async function does return fetchData(); (without await) inside a try/catch. Will the catch handle a rejection from fetchData?',
                  solution: {
                    explanation:
                      'Yes, in this case — returning a promise from an async function ties its rejection to the returned promise, and an awaiting caller will see it. But the local try/catch will NOT catch it, because nothing is awaited before returning.',
                  },
                },
              ],
              docs: 'https://nodejs.org/en/learn/asynchronous-work/discover-promises-in-nodejs',
            },
            {
              id: 'nd3-t1-c2',
              title: 'util.promisify and escaping callback hell',
              summary:
                'util.promisify converts an error-first callback function into one that returns a promise, so you can await legacy APIs and flatten nested callbacks.',
              explanation:
                'Plenty of older functions still use error-first callbacks, and you do not want that style infecting modern async/await code. util.promisify takes a function that follows the (err, result) convention and returns a new function that returns a promise instead, which you can then await. Many core modules also offer ready-made promise variants — fs/promises, timers/promises and dns/promises — so reach for those first and use promisify for third-party or custom callback functions. Promisifying is the key tactic for escaping callback hell: instead of nesting callbacks several levels deep, you await each step in sequence (or run independent ones with Promise.all), turning a sideways pyramid into a flat, readable list of statements with a single try/catch. Note that promisify expects the standard error-first signature; functions that call back with multiple result values or a non-standard shape may need a custom wrapper. The goal in every case is a flat control flow where errors propagate through normal throw/catch rather than scattered if (err) checks.',
              code: {
                language: 'javascript',
                lines: [
                  'import { promisify } from \'node:util\';',
                  'import { execFile } from \'node:child_process\';',
                  '',
                  'const run = promisify(execFile);',
                  '',
                  'async function gitVersion() {',
                  '  const { stdout } = await run(\'git\', [\'--version\']);',
                  '  return stdout.trim();',
                  '}',
                ],
                explanation:
                  'promisify wraps the callback-style execFile into run, which returns a promise. Now it can be awaited cleanly inside an async function with normal error handling.',
              },
              keyPoints: [
                'util.promisify turns an (err, result) callback function into a promise-returning one.',
                'Prefer built-in promise variants (fs/promises, timers/promises) when they exist.',
                'Promisifying flattens nested callbacks into sequential await statements.',
                'Non-standard callback signatures may need a hand-written promise wrapper.',
              ],
              exercises: [
                {
                  type: 'quiz',
                  prompt: 'What shape must a function have for util.promisify to work correctly?',
                  hint: 'Think about the callback convention.',
                  solution: {
                    explanation:
                      'It must follow the error-first callback convention: the callback is the last argument and is called as (err, result). Functions with non-standard callbacks need a custom wrapper.',
                  },
                },
                {
                  type: 'task',
                  prompt: 'Promisify the callback-style function setTimeout-equivalent so you can await a delay (use the built-in if you know it).',
                  solution: {
                    lines: [
                      'import { setTimeout as sleep } from \'node:timers/promises\';',
                      'await sleep(1000); // wait one second',
                    ],
                    explanation: 'node:timers/promises already provides a promise-based delay, which is cleaner than promisifying setTimeout yourself.',
                  },
                },
                {
                  type: 'predict',
                  prompt: 'You promisify a function whose callback is called as (result) with no error slot. What value does the resulting promise resolve to?',
                  solution: {
                    explanation:
                      'It resolves to undefined (and may misbehave), because promisify treats the first callback argument as the error. The actual result lands in the error position. Such functions need a custom wrapper or promisify.custom.',
                  },
                },
              ],
              docs: 'https://nodejs.org/docs/latest/api/util.html#utilpromisifyoriginal',
            },
          ],
        },
        {
          id: 'nd3-t2',
          name: 'Error handling',
          concepts: [
            {
              id: 'nd3-t2-c0',
              title: 'Synchronous vs asynchronous errors',
              summary:
                'try/catch catches synchronous throws and awaited rejections, but it cannot catch errors thrown later inside a callback or unawaited promise.',
              explanation:
                'Where an error happens determines how you must catch it. A synchronous throw and an error from an awaited promise are both caught by an enclosing try/catch, because await effectively turns a rejection into a throw at that point. But an error thrown inside a plain callback that runs later — say, in a setTimeout or an event handler — escapes any try/catch that was around the code which scheduled it, since that block has long since finished. Likewise, a rejected promise that you never await or attach a catch to becomes an unhandled rejection. The practical rules are: wrap awaited async work in try/catch, give every error-first callback an err check, attach catch to any promise you do not await, and handle the \'error\' event on emitters and streams. Mixing styles is where bugs hide, so keep a function consistently callback-based or promise-based. Understanding which mechanism applies to a given error is the single most important error-handling skill in Node.',
              code: {
                language: 'javascript',
                lines: [
                  '// Caught: synchronous throw and awaited rejection',
                  'try {',
                  '  const data = await readFilePromise(\'x\');',
                  '} catch (err) {',
                  '  console.error(\'handled\', err.message);',
                  '}',
                  '',
                  '// NOT caught by an outer try/catch:',
                  'try {',
                  '  setTimeout(() => { throw new Error(\'late\'); }, 10);',
                  '} catch (err) {',
                  '  // never runs — the throw happens after this block exits',
                  '}',
                ],
                explanation:
                  'The first try/catch works because await converts the rejection into a throw. The second cannot work because the callback runs after the try block has already finished.',
              },
              keyPoints: [
                'try/catch catches synchronous throws and awaited promise rejections.',
                'It cannot catch a throw inside a later callback or timer.',
                'Unawaited rejected promises become unhandled rejections.',
                'Match the mechanism to the error: try/catch, err checks, .catch, or \'error\' events.',
              ],
              commonMistakes: [
                'Wrapping a setTimeout or event registration in try/catch and expecting it to catch errors thrown later.',
                'Calling an async function without await or .catch, so its rejection goes unhandled.',
              ],
              exercises: [
                {
                  type: 'quiz',
                  prompt: 'Why can a try/catch around a setTimeout call not catch an error thrown inside the timer callback?',
                  hint: 'When does the callback actually run?',
                  solution: {
                    explanation:
                      'The callback runs later, on a future event-loop turn, long after the try block has finished executing. The try/catch only guards the synchronous code that scheduled the timer, not the callback itself.',
                  },
                },
                {
                  type: 'quiz',
                  prompt: 'How does await let try/catch handle a promise rejection?',
                  solution: {
                    explanation:
                      'await pauses the function until the promise settles; if it rejects, await throws the reason at that point in the function, so a surrounding try/catch can catch it like any synchronous throw.',
                  },
                },
                {
                  type: 'predict',
                  prompt: 'You call doAsync() (returns a promise that rejects) with no await and no .catch. What happens at runtime?',
                  solution: {
                    explanation:
                      'It produces an unhandled promise rejection. Node logs a warning and, in current versions, terminates the process by default unless you handle it.',
                  },
                },
              ],
              docs: 'https://nodejs.org/en/learn/asynchronous-work/error-handling-in-nodejs',
            },
            {
              id: 'nd3-t2-c1',
              title: 'uncaughtException and unhandledRejection',
              summary:
                'These process events are last-resort hooks for errors that escaped all other handling. Use them to log and shut down cleanly, not to keep running.',
              explanation:
                'When an error truly escapes every try/catch, callback check and stream handler, Node emits process-level events: uncaughtException for a synchronous error nobody caught, and unhandledRejection for a promise that rejected with no handler. It is tempting to listen for these and carry on, but that is a trap: after an uncaught exception the application is in an unknown, possibly corrupted state, so the correct response is to log the error with full detail, attempt minimal cleanup, and exit the process with a non-zero code, letting a process manager restart it fresh. Current Node already terminates on unhandled rejections by default, reinforcing that you should handle rejections at their source rather than rely on the global hook. Think of these listeners as a flight recorder and a controlled-crash mechanism, not as error recovery. Real resilience comes from handling errors where they occur and running under a supervisor (systemd, PM2, a container orchestrator) that restarts crashed processes.',
              code: {
                language: 'javascript',
                lines: [
                  'process.on(\'uncaughtException\', (err) => {',
                  '  console.error(\'uncaught:\', err);',
                  '  process.exitCode = 1;',
                  '  // do minimal sync cleanup, then let the process end',
                  '});',
                  '',
                  'process.on(\'unhandledRejection\', (reason) => {',
                  '  console.error(\'unhandled rejection:\', reason);',
                  '  process.exitCode = 1;',
                  '});',
                ],
                explanation:
                  'Both handlers log the failure and mark the process for a non-zero exit. They are a safety net for logging and controlled shutdown, not a way to keep serving.',
              },
              keyPoints: [
                'uncaughtException catches escaped synchronous errors; unhandledRejection catches unhandled promise rejections.',
                'After an uncaught error, treat the process as unhealthy and exit.',
                'Use these hooks to log and shut down, not to resume operation.',
                'Run under a supervisor that restarts crashed processes for true resilience.',
              ],
              commonMistakes: [
                'Swallowing uncaughtException and continuing to run with possibly corrupted state.',
                'Relying on the global hook instead of handling rejections where they originate.',
              ],
              exercises: [
                {
                  type: 'quiz',
                  prompt: 'Why is it dangerous to catch uncaughtException and keep the process running?',
                  hint: 'State after an uncaught error.',
                  solution: {
                    explanation:
                      'After an uncaught exception the application may be in an inconsistent or corrupted state, so continuing risks subtle data corruption and unpredictable behavior. The safe response is to log, clean up minimally, and exit so a supervisor can restart cleanly.',
                  },
                },
                {
                  type: 'quiz',
                  prompt: 'What is the recommended way to deal with promise rejections instead of relying on the unhandledRejection hook?',
                  solution: {
                    explanation:
                      'Handle them at the source with try/catch around awaited calls or .catch on promises. The global hook should only be a logging-and-shutdown safety net.',
                  },
                },
                {
                  type: 'predict',
                  prompt: 'In current Node with no unhandledRejection handler, a promise rejects unhandled. What happens to the process?',
                  solution: {
                    explanation:
                      'Node prints the rejection and terminates the process with a non-zero exit code by default. Unhandled rejections are treated as fatal.',
                  },
                },
              ],
              docs: 'https://nodejs.org/docs/latest/api/process.html#event-uncaughtexception',
            },
            {
              id: 'nd3-t2-c2',
              title: 'Graceful shutdown and operational errors',
              summary:
                'Distinguish programmer bugs from expected operational errors, and shut down gracefully on termination signals by finishing in-flight requests before exiting.',
              explanation:
                'Mature error handling separates two kinds of failure. Operational errors are expected runtime conditions — a failed network call, invalid user input, a missing file — that a healthy program should anticipate and handle, often by returning an appropriate response or retrying. Programmer errors are bugs, like calling a function with the wrong type or a typo that causes undefined access; these should not be papered over, because the right fix is to fix the code, and at runtime the safest reaction is usually to crash and restart. Alongside this, production services need graceful shutdown: when the orchestrator sends SIGTERM (or you press Ctrl+C for SIGINT), you should stop accepting new connections, let in-flight requests finish, close database pools, and then exit, rather than dropping live requests. Listening for these signals and calling server.close before exiting prevents the dropped requests and connection errors that abrupt termination causes during deploys and scale-downs. Together, the operational-versus-programmer distinction and graceful shutdown define production-grade reliability.',
              diagram: {
                type: 'mermaid',
                lines: [
                  'flowchart LR',
                  '  SIG[SIGTERM received] --> STOP[Stop accepting new connections]',
                  '  STOP --> DRAIN[Finish in-flight requests]',
                  '  DRAIN --> CLOSE[Close db and resources]',
                  '  CLOSE --> EXIT[Exit zero]',
                ],
                caption: 'Graceful shutdown drains in-flight work and closes resources before the process exits.',
              },
              code: {
                language: 'javascript',
                lines: [
                  'const server = createServer(handler);',
                  'server.listen(3000);',
                  '',
                  'function shutdown() {',
                  '  console.log(\'shutting down...\');',
                  '  server.close(() => {',
                  '    // close db pools, then exit',
                  '    process.exit(0);',
                  '  });',
                  '}',
                  '',
                  'process.on(\'SIGTERM\', shutdown);',
                  'process.on(\'SIGINT\', shutdown);',
                ],
                explanation:
                  'On SIGTERM or SIGINT, server.close stops accepting new connections and waits for active ones to finish before the process exits cleanly.',
              },
              keyPoints: [
                'Operational errors are expected and should be handled; programmer errors are bugs to fix.',
                'On SIGTERM/SIGINT, stop new connections and drain in-flight requests.',
                'server.close finishes active requests before exiting.',
                'Graceful shutdown prevents dropped requests during deploys and scaling.',
              ],
              exercises: [
                {
                  type: 'quiz',
                  prompt: 'Give an example of an operational error and an example of a programmer error, and how you should treat each.',
                  hint: 'Expected condition versus bug.',
                  solution: {
                    explanation:
                      'A failed network request or invalid user input is an operational error — handle it (respond, retry, validate). Calling undefined as a function or a typo is a programmer error — a bug to fix in code; at runtime the safest reaction is usually to crash and restart.',
                  },
                },
                {
                  type: 'quiz',
                  prompt: 'What does server.close() do during a graceful shutdown?',
                  solution: {
                    explanation:
                      'It stops the server from accepting new connections and waits for existing in-flight requests to finish, then fires its callback so you can release other resources and exit cleanly.',
                  },
                },
                {
                  type: 'predict',
                  prompt: 'During a deploy, the orchestrator sends SIGTERM and your process exits instantly with no handler. What might clients see?',
                  solution: {
                    explanation:
                      'In-flight requests are dropped, so clients may see connection resets or 502/504 errors. Handling SIGTERM and draining requests first avoids this.',
                  },
                },
              ],
              docs: 'https://nodejs.org/docs/latest/api/process.html#signal-events',
            },
          ],
        },
      ],
    },
    /* ──────────────── LEVEL 4 — NPM AND THE ECOSYSTEM ──────────────── */
    {
      level: 4,
      name: 'npm and the ecosystem',
      focus: 'package.json, installing and building packages, and configuration via the environment',
      accent: '#3c873a',
      soft: '#e7f3e7',
      topics: [
        {
          id: 'nd4-t0',
          name: 'npm and package.json',
          concepts: [
            {
              id: 'nd4-t0-c0',
              title: 'package.json and dependency types',
              summary:
                'package.json is the manifest of a Node project. It records metadata, scripts, and dependencies split into runtime dependencies and development-only devDependencies.',
              explanation:
                'Every Node project has a package.json at its root, created by npm init, describing the project and its dependencies. The dependencies field lists packages your code needs to run in production — a web framework, a database driver — while devDependencies lists tools only needed during development, such as test runners, linters and bundlers. The split matters because npm install --production (or NODE_ENV=production) can skip devDependencies, keeping deployments lean. There are also less common buckets: peerDependencies declare a package the host project must provide (common for plugins), and optionalDependencies may fail to install without breaking the project. Other key fields include name and version, main or exports for the entry point, type to choose CommonJS or ESM, and engines to declare the supported Node version. Running npm install <pkg> adds to dependencies, while npm install -D <pkg> adds to devDependencies. Keeping this file accurate is what makes a project reproducible by anyone who clones it.',
              code: {
                language: 'json',
                lines: [
                  '{',
                  '  "name": "my-app",',
                  '  "version": "1.0.0",',
                  '  "type": "module",',
                  '  "scripts": { "start": "node server.js", "test": "node --test" },',
                  '  "dependencies": { "express": "^4.19.2" },',
                  '  "devDependencies": { "eslint": "^9.0.0" }',
                  '}',
                ],
                explanation:
                  'express is a runtime dependency; eslint is a dev-only tool. The scripts, type and version fields configure how the project runs and resolves modules.',
              },
              keyPoints: [
                'package.json is the project manifest; npm init creates it.',
                'dependencies are needed at runtime; devDependencies only during development.',
                'npm install <pkg> adds a dependency; add -D for a devDependency.',
                'peerDependencies and engines declare host and Node version requirements.',
              ],
              commonMistakes: [
                'Putting a runtime package in devDependencies, so it is missing in production.',
                'Editing dependency versions by hand and forgetting to update the lockfile.',
              ],
              exercises: [
                {
                  type: 'quiz',
                  prompt: 'Why split dependencies from devDependencies?',
                  hint: 'Think about what production needs.',
                  solution: {
                    explanation:
                      'Runtime code needs dependencies in production, but tools like test runners and linters are only needed during development. Splitting them lets production installs skip devDependencies, reducing size and attack surface.',
                  },
                },
                {
                  type: 'task',
                  prompt: 'Write the npm command to add jest as a development-only dependency.',
                  solution: {
                    lines: ['npm install --save-dev jest'],
                    explanation: 'The --save-dev flag (or -D) records the package under devDependencies instead of dependencies.',
                  },
                },
                {
                  type: 'predict',
                  prompt: 'A library is listed under devDependencies but is imported by code that runs in production. What happens after a production-only install?',
                  solution: {
                    explanation:
                      'The import fails with a module-not-found error, because a production install omits devDependencies. The package belongs in dependencies.',
                  },
                },
              ],
              docs: 'https://docs.npmjs.com/cli/v10/configuring-npm/package-json',
            },
            {
              id: 'nd4-t0-c1',
              title: 'npm scripts',
              summary:
                'The scripts field defines named commands you run with npm run. Lifecycle names like start and test have shortcuts, and scripts can chain with pre/post hooks.',
              explanation:
                'The scripts object in package.json lets you give names to shell commands and run them with npm run <name>, which adds the project\'s local node_modules/.bin to the path so you can call installed tools by name without a full path. A few names are special lifecycle scripts: npm start runs the start script, npm test runs test, and these two can be invoked without the run keyword. npm also runs pre and post hooks automatically — defining prebuild makes it run before build, and postinstall runs after install — which is handy for setup and teardown steps. Scripts are the standard, framework-agnostic way teams expose common tasks (start, build, test, lint, format), so a newcomer can clone a repo and discover how to run everything just by reading package.json. You can pass extra arguments through to a script with a double dash, and compose scripts by calling other scripts. Keeping a consistent set of script names across projects greatly reduces friction.',
              code: {
                language: 'json',
                lines: [
                  '{',
                  '  "scripts": {',
                  '    "start": "node server.js",',
                  '    "dev": "node --watch server.js",',
                  '    "test": "node --test",',
                  '    "lint": "eslint .",',
                  '    "prebuild": "rm -rf dist",',
                  '    "build": "node build.js"',
                  '  }',
                  '}',
                ],
                explanation:
                  'npm run dev starts a watching server; npm test runs the built-in test runner; prebuild runs automatically before build to clean the output folder.',
              },
              keyPoints: [
                'Define commands under scripts; run them with npm run <name>.',
                'start and test are lifecycle scripts runnable without run.',
                'pre<name> and post<name> hooks run automatically around a script.',
                'Scripts add node_modules/.bin to PATH, so local tools are callable by name.',
              ],
              exercises: [
                {
                  type: 'quiz',
                  prompt: 'Which two script names can be run without typing run, and how?',
                  hint: 'They are lifecycle scripts.',
                  solution: {
                    explanation:
                      'start and test. You invoke them as npm start and npm test, whereas any other script needs npm run <name>.',
                  },
                },
                {
                  type: 'task',
                  prompt: 'Add a prestart script that prints \'booting\' before the start script runs.',
                  solution: {
                    lines: [
                      '"scripts": {',
                      '  "prestart": "echo booting",',
                      '  "start": "node server.js"',
                      '}',
                    ],
                    explanation: 'npm automatically runs prestart immediately before start because of the pre hook naming convention.',
                  },
                },
                {
                  type: 'predict',
                  prompt: 'You define a script "lint": "eslint ." but eslint is only installed locally, not globally. Does npm run lint work?',
                  solution: {
                    explanation:
                      'Yes. npm adds node_modules/.bin to the PATH for scripts, so the locally installed eslint binary is found even without a global install.',
                  },
                },
              ],
              docs: 'https://docs.npmjs.com/cli/v10/using-npm/scripts',
            },
            {
              id: 'nd4-t0-c2',
              title: 'Semantic versioning and the lockfile',
              summary:
                'SemVer expresses versions as MAJOR.MINOR.PATCH, and ranges like ^ and ~ control which updates are accepted. package-lock.json pins the exact installed tree.',
              explanation:
                'Semantic Versioning gives meaning to version numbers: MAJOR is bumped for breaking changes, MINOR for backward-compatible features, and PATCH for backward-compatible bug fixes. In package.json, a caret like ^1.4.2 allows any 1.x.y at or above 1.4.2 (no major bump), while a tilde like ~1.4.2 allows only 1.4.x patch updates, and an exact 1.4.2 pins precisely. These ranges describe what you are willing to accept, but a range alone is not reproducible — two installs days apart could resolve to different versions. That is why npm writes package-lock.json, which records the exact resolved version of every package in the entire dependency tree, including transitive dependencies, plus integrity hashes. You commit the lockfile so everyone, including CI and production, installs an identical tree; npm ci installs strictly from the lockfile and is the right command for automated and production installs. Updating dependencies deliberately with npm update or by editing ranges then regenerating the lockfile keeps you in control of when changes land.',
              code: {
                language: 'bash',
                lines: [
                  '# Caret: accept minor + patch within the same major',
                  '# "express": "^4.19.2"  -> 4.x.x, not 5.0.0',
                  '',
                  '# Tilde: accept only patch updates',
                  '# "express": "~4.19.2"  -> 4.19.x',
                  '',
                  '# Reproducible install straight from the lockfile',
                  'npm ci',
                ],
                explanation:
                  '^ allows minor and patch updates, ~ allows only patches. npm ci installs the exact tree recorded in package-lock.json, ideal for CI and production.',
              },
              keyPoints: [
                'SemVer is MAJOR.MINOR.PATCH: breaking, feature, fix.',
                '^ allows minor+patch within a major; ~ allows only patch; exact pins one version.',
                'package-lock.json pins the entire resolved tree with integrity hashes.',
                'Commit the lockfile; use npm ci for reproducible CI and production installs.',
              ],
              commonMistakes: [
                'Not committing package-lock.json, so installs drift and builds become non-reproducible.',
                'Using npm install in CI (which may update the lockfile) instead of npm ci.',
              ],
              exercises: [
                {
                  type: 'quiz',
                  prompt: 'Given "lodash": "^4.17.0", which of these can install: 4.20.1, 4.17.5, 5.0.0?',
                  hint: 'Caret stays within the major.',
                  solution: {
                    explanation:
                      '4.20.1 and 4.17.5 are allowed (same major, minor/patch updates). 5.0.0 is not, because the caret forbids a major version bump.',
                  },
                },
                {
                  type: 'quiz',
                  prompt: 'What is the difference between npm install and npm ci?',
                  solution: {
                    explanation:
                      'npm install resolves ranges and may update package-lock.json. npm ci installs strictly the exact versions in the existing lockfile (and errors if it is out of sync), giving fully reproducible installs for CI and production.',
                  },
                },
                {
                  type: 'predict',
                  prompt: 'A patch release 4.19.3 of a dependency introduces a bug. Your package.json has "^4.19.2" and you delete the lockfile then install. What might you get?',
                  solution: {
                    explanation:
                      'You may pull in 4.19.3 (or any newer 4.x), inheriting the bug, because without the lockfile npm resolves the range to the latest matching version. The committed lockfile would have kept you on the known-good version.',
                  },
                },
              ],
              docs: 'https://docs.npmjs.com/about-semantic-versioning',
            },
          ],
        },
        {
          id: 'nd4-t1',
          name: 'Using and building packages',
          concepts: [
            {
              id: 'nd4-t1-c0',
              title: 'Installing and using third-party packages',
              summary:
                'npm install downloads packages into node_modules and records them in package.json. You then import them by their bare name from your code.',
              explanation:
                'The npm registry hosts millions of reusable packages. npm install <name> downloads the package and its dependencies into node_modules and records the version range in package.json. From then on you import it by its bare name — Node\'s resolution algorithm finds it in node_modules — without any path. Because node_modules can be huge and is fully reconstructible from package.json plus the lockfile, you never commit it; you add it to .gitignore and let anyone run npm install to recreate it. Before adding a dependency it is worth weighing its cost: every package you pull in expands your install size, your maintenance surface and your security exposure through its own transitive dependencies, so prefer well-maintained, widely-used packages and consider whether a few lines of your own code would do. After installing, npm audit reports known vulnerabilities in your tree. Treating dependencies as a deliberate choice rather than a reflex keeps projects healthy over time.',
              code: {
                language: 'bash',
                lines: [
                  '# Install a package and record it in package.json',
                  'npm install express',
                  '',
                  '# Reconstruct node_modules on another machine',
                  'npm install',
                  '',
                  '# Check the dependency tree for known vulnerabilities',
                  'npm audit',
                ],
                explanation:
                  'Installing express adds it to dependencies and node_modules. A bare npm install rebuilds node_modules from the manifest and lockfile; npm audit scans for security issues.',
              },
              keyPoints: [
                'npm install <name> downloads into node_modules and updates package.json.',
                'Import installed packages by their bare name; no path needed.',
                'Never commit node_modules — it rebuilds from package.json and the lockfile.',
                'Every dependency adds size, maintenance and security surface; choose deliberately.',
              ],
              commonMistakes: [
                'Committing node_modules to git instead of adding it to .gitignore.',
                'Adding heavy dependencies for trivial tasks a few lines could solve.',
              ],
              exercises: [
                {
                  type: 'quiz',
                  prompt: 'Why is node_modules excluded from version control?',
                  hint: 'It can be regenerated.',
                  solution: {
                    explanation:
                      'It is large and fully reconstructible from package.json and package-lock.json by running npm install. Committing it bloats the repo without adding value.',
                  },
                },
                {
                  type: 'task',
                  prompt: 'After cloning a repo with a package.json and lockfile, what single command sets up dependencies reproducibly for CI?',
                  solution: {
                    lines: ['npm ci'],
                    explanation: 'npm ci installs the exact tree from the lockfile, which is the reproducible choice for CI and deployment.',
                  },
                },
                {
                  type: 'predict',
                  prompt: 'You delete node_modules but keep package.json and package-lock.json, then run npm install. What is the result?',
                  solution: {
                    explanation:
                      'node_modules is fully recreated with the versions recorded in the lockfile, so the project works again exactly as before.',
                  },
                },
              ],
              docs: 'https://docs.npmjs.com/cli/v10/commands/npm-install',
            },
            {
              id: 'nd4-t1-c1',
              title: 'Building your own module and using npx',
              summary:
                'A module is just a file (or folder) that exports something. npx runs package binaries without installing them globally, including project-local tools and one-off generators.',
              explanation:
                'You do not need to publish to the registry to create a module — any file that exports values is a reusable module you can import elsewhere in your project, and a folder with an index file or an exports entry in package.json becomes an importable package. To make a folder a self-contained package, give it its own package.json with name, version and an entry point (exports or main); keeping a clear public surface and small, focused modules makes code easy to reuse and test. npx, which ships with npm, runs a package\'s executable without a permanent global install: it prefers a binary already in your local node_modules and otherwise downloads the package temporarily, which is perfect for project-local tools and for one-shot scaffolding like create-* generators. This avoids cluttering your machine with global installs and guarantees you run the version pinned to the project. Designing your own modules with clean exports, and using npx to run tools, are everyday skills for a productive Node developer.',
              code: {
                language: 'bash',
                lines: [
                  '# Run a project-local tool without a global install',
                  'npx eslint .',
                  '',
                  '# Scaffold a project with a one-off generator',
                  'npx create-some-app my-app',
                  '',
                  '# Run a specific version on the fly',
                  'npx cowsay@latest hello',
                ],
                explanation:
                  'npx runs the local binary if present, otherwise fetches the package temporarily. This is ideal for project tools and one-time generators without polluting global installs.',
              },
              keyPoints: [
                'Any file or folder that exports values is a reusable module.',
                'A folder becomes a package with its own package.json (name, version, entry point).',
                'npx runs package executables without a global install.',
                'npx prefers a local binary, then downloads temporarily if needed.',
              ],
              exercises: [
                {
                  type: 'quiz',
                  prompt: 'What does npx do that npm install -g avoids?',
                  hint: 'Think about where the tool lives.',
                  solution: {
                    explanation:
                      'npx runs a package executable on demand — using the project-local copy or a temporary download — so you do not pollute your machine with a permanent global install and you always run the project-pinned version.',
                  },
                },
                {
                  type: 'task',
                  prompt: 'Turn a folder utils/ into an importable package by giving it the minimal required fields in package.json.',
                  solution: {
                    lines: [
                      '{',
                      '  "name": "utils",',
                      '  "version": "1.0.0",',
                      '  "exports": "./index.js"',
                      '}',
                    ],
                    explanation: 'A name, version and an entry point (exports or main) make the folder a self-contained package with a defined public surface.',
                  },
                },
                {
                  type: 'predict',
                  prompt: 'You run npx eslint . in a project where eslint is installed locally. Does npx download anything?',
                  solution: {
                    explanation:
                      'No. npx finds the locally installed eslint in node_modules/.bin and runs it directly without downloading.',
                  },
                },
              ],
              docs: 'https://docs.npmjs.com/cli/v10/commands/npx',
            },
            {
              id: 'nd4-t1-c2',
              title: 'Publishing basics',
              summary:
                'To publish, set name, version and the files to include, then run npm publish. Bump the version with SemVer for each release and guard what gets shipped.',
              explanation:
                'Sharing a package on the public registry takes a few deliberate steps. You need an npm account and to be logged in with npm login, a unique name (or a scoped name like @you/pkg), and a sensible version. Before publishing, control exactly what ends up in the tarball: list the included paths with the files field in package.json or a .npmignore file, so you ship the built code and docs but not tests, source maps or secrets. Running npm publish uploads the current version; the registry rejects re-publishing the same version, so every release must bump the version, which npm version patch|minor|major does for you while creating a git tag. Use npm publish --dry-run to preview the contents first, and a scoped package needs --access public to be public. Following SemVer faithfully is a contract with your users about what an upgrade will do. Even if you never publish publicly, understanding this flow clarifies how the packages you depend on are produced and versioned.',
              code: {
                language: 'bash',
                lines: [
                  '# Log in to the registry',
                  'npm login',
                  '',
                  '# Preview what would be published',
                  'npm publish --dry-run',
                  '',
                  '# Bump version (creates a git tag) then publish',
                  'npm version minor',
                  'npm publish',
                ],
                explanation:
                  'npm login authenticates; --dry-run shows the tarball contents; npm version bumps and tags; npm publish uploads the new version, which must differ from any already published.',
              },
              keyPoints: [
                'Need a logged-in account, a unique (or scoped) name, and a version.',
                'Control shipped contents with the files field or .npmignore.',
                'Each publish requires a new version; npm version bumps and tags it.',
                'Scoped public packages need npm publish --access public.',
              ],
              commonMistakes: [
                'Accidentally publishing secrets or huge test fixtures by not restricting files.',
                'Trying to re-publish the same version number, which the registry rejects.',
              ],
              exercises: [
                {
                  type: 'quiz',
                  prompt: 'Why must you bump the version before each npm publish?',
                  hint: 'The registry is immutable per version.',
                  solution: {
                    explanation:
                      'The registry treats each version as immutable and rejects re-publishing an existing version. A new release must carry a new SemVer version so consumers can install it distinctly.',
                  },
                },
                {
                  type: 'task',
                  prompt: 'Restrict a package to only ship the dist folder and README.',
                  solution: {
                    lines: [
                      '"files": ["dist", "README.md"]',
                    ],
                    explanation: 'The files field whitelists exactly what goes into the published tarball, excluding tests, source and other artifacts.',
                  },
                },
                {
                  type: 'predict',
                  prompt: 'You run npm publish on a scoped package @me/tool without --access public. What happens?',
                  solution: {
                    explanation:
                      'It attempts a private publish, which fails (or is restricted) unless you have a paid plan. Scoped packages default to private; you need --access public to publish them openly.',
                  },
                },
              ],
              docs: 'https://docs.npmjs.com/cli/v10/commands/npm-publish',
            },
          ],
        },
        {
          id: 'nd4-t2',
          name: 'Configuration and environment',
          concepts: [
            {
              id: 'nd4-t2-c0',
              title: 'Environment variables and secrets',
              summary:
                'Environment variables inject configuration and secrets at runtime without changing code, keeping sensitive values out of the source tree.',
              explanation:
                'Configuration that varies between machines or environments — ports, database URLs, API keys — should come from the environment, not be hard-coded. You read it through process.env, and you set it when launching the process, either inline in the shell, in your deployment platform\'s settings, or through an orchestrator\'s secret store. The cardinal rule is that secrets never belong in source control: committing an API key to git leaks it to everyone with repository access and to anyone who later clones the history. Because every env var is a string, you must coerce types and validate presence at startup, ideally with a small schema check that fails fast with a clear message if something required is missing or malformed. Centralizing this reading and validation into a single config module — rather than scattering process.env access throughout the codebase — makes the program\'s configuration surface explicit and easy to audit. This environment-driven approach is what lets the same build run unchanged across development, staging and production.',
              code: {
                language: 'javascript',
                lines: [
                  '// config.js — read and validate once, in one place',
                  'export const config = {',
                  '  port: Number(process.env.PORT) || 3000,',
                  '  databaseUrl: process.env.DATABASE_URL,',
                  '};',
                  '',
                  'if (!config.databaseUrl) {',
                  '  throw new Error(\'DATABASE_URL is required\');',
                  '}',
                ],
                explanation:
                  'A single config module reads process.env, coerces types, and validates required values up front so the rest of the code uses a clean, typed config object.',
              },
              keyPoints: [
                'Read configuration from process.env, not hard-coded constants.',
                'Never commit secrets to source control.',
                'Env vars are strings — coerce and validate them at startup.',
                'Centralize reading and validation in one config module.',
              ],
              commonMistakes: [
                'Committing a .env file or hard-coded API key to git.',
                'Scattering raw process.env reads throughout the code instead of one config module.',
              ],
              exercises: [
                {
                  type: 'quiz',
                  prompt: 'Why should secrets come from environment variables rather than being written in the code?',
                  hint: 'Think about git history.',
                  solution: {
                    explanation:
                      'Hard-coded secrets are committed to version control, exposing them to anyone with repo access now or in the future. Environment variables keep secrets out of the source tree and let different environments supply different values.',
                  },
                },
                {
                  type: 'task',
                  prompt: 'Read a required API_KEY and fail fast if it is absent.',
                  solution: {
                    lines: [
                      'const apiKey = process.env.API_KEY;',
                      'if (!apiKey) throw new Error(\'API_KEY is required\');',
                    ],
                    explanation: 'Validating at startup turns a missing secret into an immediate, clear failure instead of a confusing runtime error later.',
                  },
                },
                {
                  type: 'predict',
                  prompt: 'process.env.MAX_RETRIES is \'3\'. You write if (process.env.MAX_RETRIES > 5). What is compared?',
                  solution: {
                    explanation:
                      'Strings and numbers are compared with coercion, so \'3\' becomes 3 here and the result is false — but relying on this is fragile. Convert explicitly with Number(process.env.MAX_RETRIES).',
                  },
                },
              ],
              docs: 'https://nodejs.org/docs/latest/api/process.html#processenv',
            },
            {
              id: 'nd4-t2-c1',
              title: 'dotenv and .env files',
              summary:
                'In development, a .env file holds local environment variables. dotenv (or Node\'s built-in --env-file) loads them into process.env; the file is gitignored.',
              explanation:
                'Typing many environment variables on the command line is tedious during development, so the convention is a .env file in the project root with KEY=value lines. The dotenv package reads that file and populates process.env early in startup, and modern Node can do the same natively with the --env-file flag, removing the dependency entirely. Crucially, .env contains real local secrets, so it must be in .gitignore; instead you commit a .env.example listing the required keys with placeholder values, which documents what is needed without leaking anything. The .env approach is strictly a development convenience — in production you inject configuration through your platform\'s environment or secret manager rather than shipping a file. Values already present in the real environment usually take precedence and are not overwritten, so production settings win over any stray file. This pattern gives developers a frictionless local setup while keeping the production configuration path clean and secure.',
              code: {
                language: 'bash',
                lines: [
                  '# .env (gitignored)',
                  '# PORT=3000',
                  '# DATABASE_URL=postgres://localhost/dev',
                  '',
                  '# Built-in: no dependency needed',
                  'node --env-file=.env server.js',
                  '',
                  '# Or with the dotenv package, loaded in code:',
                  '# import \'dotenv/config\';',
                ],
                explanation:
                  'A .env file holds local key=value pairs. node --env-file loads them natively, or dotenv/config does the same; either way process.env is populated before your code runs.',
              },
              keyPoints: [
                'A .env file stores local KEY=value configuration.',
                'Load it with the dotenv package or Node\'s built-in --env-file flag.',
                'Add .env to .gitignore; commit a .env.example with placeholders.',
                '.env is for development; production injects config via the platform.',
              ],
              commonMistakes: [
                'Committing .env with real secrets instead of a placeholder .env.example.',
                'Relying on a .env file in production instead of platform-provided environment variables.',
              ],
              exercises: [
                {
                  type: 'quiz',
                  prompt: 'What should be committed to git: .env or .env.example, and why?',
                  hint: 'One has real secrets.',
                  solution: {
                    explanation:
                      '.env.example, with placeholder values, should be committed to document the required keys. The real .env holds actual secrets and must be gitignored.',
                  },
                },
                {
                  type: 'task',
                  prompt: 'Start server.js loading variables from a .env file using only built-in Node features.',
                  solution: {
                    lines: ['node --env-file=.env server.js'],
                    explanation: 'The native --env-file flag reads the file into process.env without needing the dotenv package.',
                  },
                },
                {
                  type: 'predict',
                  prompt: 'In production you set DATABASE_URL in the real environment AND ship a .env with a different value, loaded by dotenv. Which wins?',
                  solution: {
                    explanation:
                      'The real environment value typically wins — dotenv does not overwrite variables already set in process.env by default. Still, shipping a .env to production is discouraged.',
                  },
                },
              ],
              docs: 'https://nodejs.org/docs/latest/api/cli.html#--env-fileconfig',
            },
            {
              id: 'nd4-t2-c2',
              title: 'NODE_ENV and config patterns',
              summary:
                'NODE_ENV signals the runtime environment (development, production, test). Many tools optimize when it is production; use it deliberately and validate config.',
              explanation:
                'NODE_ENV is a widely-honored convention that names the current environment, most commonly development, production or test. Many libraries change behavior based on it: frameworks disable verbose error pages and enable caching when NODE_ENV is production, and npm install will skip devDependencies in that mode. You should set it explicitly per environment and never assume a default. Good config design layers on top of this: read all environment variables in one place, apply sensible defaults for development, require critical values in production, and validate the whole shape at startup so misconfiguration fails immediately rather than midway through serving traffic. Avoid scattering process.env.NODE_ENV checks everywhere; instead derive flags like isProduction once and pass a typed config object around. For larger apps, a small validation library can parse and type-check the environment into a structured config, catching mistakes like a missing URL or a non-numeric port before they cause obscure runtime failures. The combination of NODE_ENV plus centralized, validated configuration is the backbone of a well-behaved Node service.',
              code: {
                language: 'javascript',
                lines: [
                  'const env = process.env.NODE_ENV || \'development\';',
                  'const isProduction = env === \'production\';',
                  '',
                  'export const config = {',
                  '  env,',
                  '  isProduction,',
                  '  logLevel: isProduction ? \'info\' : \'debug\',',
                  '};',
                ],
                explanation:
                  'NODE_ENV is read once into a derived isProduction flag, which drives environment-specific settings like log level — keeping such checks out of the rest of the code.',
              },
              keyPoints: [
                'NODE_ENV names the environment: development, production or test.',
                'Many tools optimize (caching, fewer deps, terse errors) when it is production.',
                'Set NODE_ENV explicitly per environment; do not assume a default.',
                'Centralize and validate config; derive flags like isProduction once.',
              ],
              commonMistakes: [
                'Forgetting to set NODE_ENV=production in production, missing performance optimizations.',
                'Sprinkling NODE_ENV checks across the codebase instead of deriving config once.',
              ],
              exercises: [
                {
                  type: 'quiz',
                  prompt: 'Name two things that change when NODE_ENV is set to production.',
                  hint: 'Frameworks and npm both react to it.',
                  solution: {
                    explanation:
                      'Many frameworks enable caching and hide detailed error output, and npm install omits devDependencies. Logging is often made less verbose too.',
                  },
                },
                {
                  type: 'quiz',
                  prompt: 'Why validate the full configuration at startup rather than where each value is used?',
                  solution: {
                    explanation:
                      'Startup validation makes misconfiguration fail fast with a clear message, instead of causing an obscure error deep in request handling much later. It surfaces every problem at once, before serving traffic.',
                  },
                },
                {
                  type: 'predict',
                  prompt: 'You deploy without setting NODE_ENV. A framework checks process.env.NODE_ENV === \'production\'. How does it behave?',
                  solution: {
                    explanation:
                      'The check is false, so the framework runs in development mode — verbose errors, no production caching — which hurts performance and may leak internals. Always set NODE_ENV=production in production.',
                  },
                },
              ],
              docs: 'https://nodejs.org/en/learn/getting-started/nodejs-the-difference-between-development-and-production',
            },
          ],
        },
      ],
    },
    /* ──────────────── LEVEL 5 — PRODUCTION NODE ──────────────── */
    {
      level: 5,
      name: 'Production Node',
      focus: 'Data and external services, performance and scaling, and debugging, testing and deployment',
      accent: '#3c873a',
      soft: '#e7f3e7',
      topics: [
        {
          id: 'nd5-t0',
          name: 'Data and external services',
          concepts: [
            {
              id: 'nd5-t0-c0',
              title: 'Connecting to a database',
              summary:
                'Real apps persist data in a database accessed through a driver or ORM. Use a connection pool, parameterized queries, and async/await for clean, safe access.',
              explanation:
                'Most Node services talk to a database — PostgreSQL, MySQL, MongoDB, and others — through a client library: a low-level driver, a query builder, or an ORM that maps objects to tables. Two practices are non-negotiable. First, use a connection pool rather than opening a new connection per request: a pool keeps a set of reusable connections, dramatically reducing latency and protecting the database from connection storms under load. Second, never build SQL by concatenating user input — use parameterized queries (placeholders bound to values) so the driver safely escapes them, which prevents SQL injection. Wrap queries in async/await with try/catch, and always release pooled connections (or use the pool\'s query helper that does it for you) even when an error occurs, or the pool will leak and eventually exhaust. Configuration like the connection URL and pool size comes from environment variables, and you should close the pool during graceful shutdown. These habits turn a fragile prototype into a service that stays healthy under real traffic.',
              code: {
                language: 'javascript',
                lines: [
                  'import { Pool } from \'pg\';',
                  '',
                  'const pool = new Pool({ connectionString: process.env.DATABASE_URL });',
                  '',
                  'async function findUser(id) {',
                  '  // Parameterized query — never string-concatenate input',
                  '  const result = await pool.query(',
                  '    \'SELECT * FROM users WHERE id = $1\',',
                  '    [id]',
                  '  );',
                  '  return result.rows[0];',
                  '}',
                ],
                explanation:
                  'A pool reuses connections; pool.query runs a parameterized query where $1 is safely bound to id, preventing SQL injection, and returns the matching rows.',
              },
              keyPoints: [
                'Access databases via a driver, query builder, or ORM.',
                'Use a connection pool — never one connection per request.',
                'Use parameterized queries to prevent SQL injection.',
                'Wrap queries in try/catch and release/close connections on shutdown.',
              ],
              commonMistakes: [
                'Concatenating user input into SQL strings, opening an injection vulnerability.',
                'Opening a fresh connection per request instead of pooling, exhausting the database.',
              ],
              exercises: [
                {
                  type: 'quiz',
                  prompt: 'Why use parameterized queries instead of building SQL strings with user input?',
                  hint: 'Think about a malicious input value.',
                  solution: {
                    explanation:
                      'Parameterized queries send the SQL and the values separately, so the driver safely handles the values and they can never be interpreted as SQL. This prevents SQL injection, which string concatenation invites.',
                  },
                },
                {
                  type: 'quiz',
                  prompt: 'What problem does a connection pool solve compared to connecting per request?',
                  solution: {
                    explanation:
                      'Opening a connection is expensive and a flood of requests would overwhelm the database. A pool keeps a limited set of reusable connections, cutting latency and capping concurrent load on the database.',
                  },
                },
                {
                  type: 'predict',
                  prompt: 'Under heavy traffic, a service opens a new DB connection per request and never closes them. What eventually happens?',
                  solution: {
                    explanation:
                      'It exhausts the database\'s connection limit (and leaks resources), causing new requests to fail to connect. A pool with a bounded size and proper release prevents this.',
                  },
                },
              ],
              docs: 'https://nodejs.org/en/learn/getting-started/nodejs-with-postgresql',
            },
            {
              id: 'nd5-t0-c1',
              title: 'Making outbound HTTP requests',
              summary:
                'Node has a built-in global fetch for calling other services. Always set timeouts, check the response status, and handle network errors.',
              explanation:
                'Services frequently call other services, and modern Node provides the standard fetch API globally, so you no longer need a third-party HTTP client for most cases. fetch returns a promise resolving to a Response; you check response.ok (true for 2xx) and then read the body with response.json() or response.text(). A critical subtlety: fetch only rejects on network-level failures, not on HTTP error statuses, so a 404 or 500 still resolves successfully and you must inspect the status yourself. For robustness, always apply a timeout — using an AbortController with AbortSignal.timeout — because an unbounded outbound call can hang a request indefinitely and cascade failures. Wrap calls in try/catch to handle connection errors, and consider retries with backoff for transient failures and a circuit breaker for repeatedly failing dependencies. Treat every external call as something that can be slow or fail, and design the calling code to degrade gracefully rather than hang.',
              code: {
                language: 'javascript',
                lines: [
                  'async function getJson(url) {',
                  '  const res = await fetch(url, {',
                  '    signal: AbortSignal.timeout(5000),',
                  '  });',
                  '  if (!res.ok) {',
                  '    throw new Error(\'HTTP \' + res.status);',
                  '  }',
                  '  return res.json();',
                  '}',
                ],
                explanation:
                  'fetch is awaited with a 5-second timeout via AbortSignal; the code checks res.ok because fetch does not reject on HTTP errors, then parses the JSON body.',
              },
              keyPoints: [
                'fetch is built into modern Node; no library needed for most requests.',
                'fetch rejects only on network errors — check response.ok for HTTP status.',
                'Always set a timeout with AbortSignal.timeout to avoid hanging calls.',
                'Wrap in try/catch; consider retries with backoff for transient failures.',
              ],
              commonMistakes: [
                'Assuming fetch throws on a 404 or 500 — it does not; you must check res.ok.',
                'Omitting a timeout, letting a slow dependency hang the whole request.',
              ],
              exercises: [
                {
                  type: 'quiz',
                  prompt: 'Does fetch reject its promise when the server returns a 500 status?',
                  hint: 'fetch distinguishes network errors from HTTP errors.',
                  solution: {
                    explanation:
                      'No. fetch resolves successfully for any HTTP response, including 4xx and 5xx. It rejects only on network-level failures. You must check response.ok or response.status yourself.',
                  },
                },
                {
                  type: 'task',
                  prompt: 'Add a 3-second timeout to a fetch call.',
                  solution: {
                    lines: ['const res = await fetch(url, { signal: AbortSignal.timeout(3000) });'],
                    explanation: 'AbortSignal.timeout creates a signal that aborts the request after the given milliseconds, so the call cannot hang forever.',
                  },
                },
                {
                  type: 'predict',
                  prompt: 'You call await res.json() right after fetch without checking res.ok, and the server returned 404 with an HTML error page. What happens?',
                  solution: {
                    explanation:
                      'res.json() likely throws a parse error because the body is HTML, not JSON — and you never noticed it was a 404. Checking res.ok first would have surfaced the real problem.',
                  },
                },
              ],
              docs: 'https://nodejs.org/docs/latest/api/globals.html#fetch',
            },
            {
              id: 'nd5-t0-c2',
              title: 'Building a small REST API',
              summary:
                'A REST API maps HTTP methods and resource paths to operations on data. Combine routing, body parsing, status codes, and JSON responses into a coherent service.',
              explanation:
                'REST organizes an API around resources addressed by URLs and acted on with HTTP methods: GET to read, POST to create, PUT or PATCH to update, and DELETE to remove. A well-designed endpoint set is predictable — GET /users lists, GET /users/:id reads one, POST /users creates, and so on — and each returns the appropriate status code (200 read, 201 created, 204 deleted, 404 missing, 400 invalid). In practice you reach for a framework like Express or Fastify that bundles routing, body parsing and middleware, but the moving parts are exactly the http primitives from earlier: parse the path and method, read and validate the JSON body, perform the data operation, and respond with JSON and a status. Production APIs add input validation, consistent error responses, authentication, and middleware for cross-cutting concerns like logging and CORS. Keeping handlers thin — delegating real work to service and data layers — keeps the API testable and maintainable as it grows.',
              code: {
                language: 'javascript',
                lines: [
                  'import express from \'express\';',
                  '',
                  'const app = express();',
                  'app.use(express.json());',
                  '',
                  'app.get(\'/users/:id\', async (req, res) => {',
                  '  const user = await findUser(req.params.id);',
                  '  if (!user) return res.status(404).json({ error: \'not found\' });',
                  '  res.json(user);',
                  '});',
                  '',
                  'app.listen(3000);',
                ],
                explanation:
                  'express.json parses the body; the GET route reads a user by id from the path, returns 404 if missing, and otherwise responds with the user as JSON.',
              },
              diagram: {
                type: 'mermaid',
                lines: [
                  'flowchart LR',
                  '  GET[GET resource] --> READ[Read data]',
                  '  POST[POST resource] --> CREATE[Create data]',
                  '  PUT[PUT resource] --> UPDATE[Update data]',
                  '  DELETE[DELETE resource] --> REMOVE[Delete data]',
                ],
                caption: 'REST maps HTTP methods onto create, read, update and delete operations on resources.',
              },
              keyPoints: [
                'REST maps methods to operations: GET read, POST create, PUT/PATCH update, DELETE remove.',
                'Return appropriate status codes and JSON bodies.',
                'Frameworks bundle routing, body parsing and middleware over the http primitives.',
                'Validate input and keep handlers thin, delegating to service/data layers.',
              ],
              exercises: [
                {
                  type: 'quiz',
                  prompt: 'Which HTTP method and status code would you use to create a new resource successfully?',
                  hint: 'Create, then created.',
                  solution: {
                    explanation:
                      'POST to create, responding with 201 Created (often including the new resource or its location).',
                  },
                },
                {
                  type: 'task',
                  prompt: 'Write an Express route that responds to DELETE /items/:id and returns 204 on success.',
                  solution: {
                    lines: [
                      'app.delete(\'/items/:id\', async (req, res) => {',
                      '  await removeItem(req.params.id);',
                      '  res.status(204).end();',
                      '});',
                    ],
                    explanation: '204 No Content signals a successful deletion with no response body; end() finishes the response.',
                  },
                },
                {
                  type: 'predict',
                  prompt: 'A client POSTs JSON but the server never registered express.json() middleware. What is req.body?',
                  solution: {
                    explanation:
                      'undefined. Without a body-parsing middleware, Express does not populate req.body, so the handler sees no parsed data.',
                  },
                },
              ],
              docs: 'https://nodejs.org/en/learn/modules/anatomy-of-an-http-transaction',
            },
          ],
        },
        {
          id: 'nd5-t1',
          name: 'Performance and scaling',
          concepts: [
            {
              id: 'nd5-t1-c0',
              title: 'The cluster module',
              summary:
                'cluster forks the process into multiple workers that share a listening port, letting one Node app use all CPU cores for I/O-bound HTTP load.',
              explanation:
                'A single Node process uses one CPU core for JavaScript, so on a multi-core machine you leave capacity unused. The cluster module forks the process into a primary and several worker processes that all share the same server port; the operating system (or Node) load-balances incoming connections across the workers, multiplying throughput for I/O-bound HTTP servers. Each worker is a full, independent process with its own memory and event loop, so they do not share state directly — coordination happens through messages or an external store like Redis. A common pattern is to fork one worker per CPU core (using os.cpus().length) and have the primary restart any worker that dies, giving both scaling and resilience. In practice many teams delegate this to a process manager like PM2 or to a container orchestrator that runs multiple instances, which achieves the same effect without writing cluster code. Cluster helps with concurrency on one machine; it does not speed up a single CPU-bound request — for that you need worker threads.',
              code: {
                language: 'javascript',
                lines: [
                  'import cluster from \'node:cluster\';',
                  'import os from \'node:os\';',
                  '',
                  'if (cluster.isPrimary) {',
                  '  for (let i = 0; i < os.cpus().length; i++) cluster.fork();',
                  '  cluster.on(\'exit\', () => cluster.fork()); // restart dead workers',
                  '} else {',
                  '  createServer(handler).listen(3000); // each worker shares the port',
                  '}',
                ],
                explanation:
                  'The primary forks one worker per CPU and respawns any that exit; each worker runs its own server on the shared port, so the OS spreads connections across cores.',
              },
              keyPoints: [
                'cluster forks worker processes that share a listening port.',
                'It scales I/O-bound HTTP load across all CPU cores.',
                'Workers are separate processes with no shared memory; coordinate via messages or a store.',
                'Process managers and orchestrators often replace hand-written cluster code.',
              ],
              exercises: [
                {
                  type: 'quiz',
                  prompt: 'Why does a single Node process not fully use a multi-core machine, and how does cluster help?',
                  hint: 'One thread, many cores.',
                  solution: {
                    explanation:
                      'A single process runs JavaScript on one thread, using one core. cluster forks multiple worker processes that share the port, so incoming connections are spread across cores and total throughput increases.',
                  },
                },
                {
                  type: 'quiz',
                  prompt: 'Do clustered workers share memory, and how do they coordinate state?',
                  solution: {
                    explanation:
                      'No, each worker is a separate process with its own memory. They coordinate through inter-process messages or an external shared store such as Redis or a database.',
                  },
                },
                {
                  type: 'predict',
                  prompt: 'You cluster a server, but each request runs a 3-second CPU-bound computation. Does cluster make a single such request faster?',
                  solution: {
                    explanation:
                      'No. cluster increases concurrency across requests by using more processes, but a single CPU-bound request still occupies one core for 3 seconds. Speeding up one heavy computation needs worker threads or a different algorithm.',
                  },
                },
              ],
              docs: 'https://nodejs.org/docs/latest/api/cluster.html',
            },
            {
              id: 'nd5-t1-c1',
              title: 'Worker threads',
              summary:
                'worker_threads run JavaScript on real threads inside one process, ideal for offloading CPU-bound work without blocking the main event loop.',
              explanation:
                'When the bottleneck is CPU-bound computation — parsing huge data, image processing, cryptographic work — neither async I/O nor clustering helps a single task, because the work genuinely occupies a CPU. worker_threads lets you run JavaScript on additional threads within the same process, so you can move that heavy computation off the main thread and keep the event loop responsive to requests. Unlike cluster\'s separate processes, threads live in one process and can share memory efficiently through SharedArrayBuffer, while ordinary data is passed by structured-clone messaging via postMessage and the parentPort. The typical pattern is a worker pool: keep a fixed set of workers ready and dispatch tasks to them, avoiding the cost of spawning a thread per task. Use threads for CPU-bound work and stick to the normal async model for I/O-bound work, where threads add overhead without benefit. Choosing between cluster (scale I/O concurrency across cores via processes) and worker threads (offload CPU work within a process) is a key production design decision.',
              code: {
                language: 'javascript',
                lines: [
                  '// main.js',
                  'import { Worker } from \'node:worker_threads\';',
                  '',
                  'const worker = new Worker(\'./heavy.js\', { workerData: { n: 40 } });',
                  'worker.on(\'message\', (result) => console.log(\'result\', result));',
                  '',
                  '// heavy.js',
                  'import { parentPort, workerData } from \'node:worker_threads\';',
                  'parentPort.postMessage(fib(workerData.n)); // CPU-bound, off main thread',
                ],
                explanation:
                  'The main thread spawns a worker with input data and listens for its message; the worker performs the CPU-heavy fib computation and posts the result back without blocking the main event loop.',
              },
              keyPoints: [
                'worker_threads run JS on real threads inside one process.',
                'Use them for CPU-bound work to keep the main event loop free.',
                'Communicate via postMessage/parentPort; share memory with SharedArrayBuffer.',
                'A worker pool reuses threads instead of spawning one per task.',
              ],
              commonMistakes: [
                'Using worker threads for I/O-bound work, adding overhead with no benefit.',
                'Spawning a new worker per task instead of reusing a pool, paying startup cost repeatedly.',
              ],
              exercises: [
                {
                  type: 'quiz',
                  prompt: 'When should you reach for worker threads instead of the normal async model?',
                  hint: 'CPU-bound versus I/O-bound.',
                  solution: {
                    explanation:
                      'For CPU-bound work that would otherwise block the main thread. I/O-bound work is already handled efficiently by the async model, so threads only add overhead there.',
                  },
                },
                {
                  type: 'quiz',
                  prompt: 'How do worker threads differ from cluster workers in terms of process and memory?',
                  solution: {
                    explanation:
                      'cluster creates separate processes with isolated memory; worker_threads run threads inside a single process that can share memory via SharedArrayBuffer. Cluster scales I/O concurrency; threads offload CPU work.',
                  },
                },
                {
                  type: 'predict',
                  prompt: 'You move a heavy synchronous calculation into a worker thread. What happens to incoming HTTP requests during the calculation?',
                  solution: {
                    explanation:
                      'They keep being handled, because the calculation runs on a separate thread and no longer blocks the main event loop. Responsiveness is preserved.',
                  },
                },
              ],
              docs: 'https://nodejs.org/docs/latest/api/worker_threads.html',
            },
            {
              id: 'nd5-t1-c2',
              title: 'Child processes',
              summary:
                'child_process runs external commands or other programs as separate processes, useful for shelling out to system tools or running non-JavaScript work.',
              explanation:
                'Sometimes the right tool is an external program, and child_process lets Node spawn one. It offers several functions: spawn launches a command and streams its stdout/stderr, ideal for long-running output or large data; exec runs a command in a shell and buffers the full output into a callback, convenient for short commands but risky with large output or untrusted input; execFile runs a binary directly without a shell; and fork is a specialized spawn for launching another Node script with a built-in messaging channel. The crucial security rule is to avoid passing unsanitized user input to a shell — prefer spawn or execFile with an argument array so input cannot be interpreted as shell syntax, eliminating command injection. Child processes are fully independent OS processes with their own memory, communicating through standard streams or, for forked Node children, message passing. Use them to integrate with command-line tools (ffmpeg, git, image utilities) or to isolate work, while worker threads remain the better choice for CPU-bound JavaScript.',
              code: {
                language: 'javascript',
                lines: [
                  'import { spawn } from \'node:child_process\';',
                  '',
                  '// Pass arguments as an array — no shell, no injection',
                  'const child = spawn(\'git\', [\'log\', \'--oneline\', \'-5\']);',
                  '',
                  'child.stdout.on(\'data\', (chunk) => process.stdout.write(chunk));',
                  'child.on(\'close\', (code) => console.log(\'exited\', code));',
                ],
                explanation:
                  'spawn runs git with arguments passed as an array (no shell), streams its output as it arrives, and reports the exit code when the process closes.',
              },
              keyPoints: [
                'child_process runs external programs as separate OS processes.',
                'spawn streams output; exec buffers it; execFile skips the shell; fork runs a Node script with messaging.',
                'Prefer spawn/execFile with an argument array to avoid command injection.',
                'Use child processes for external tools; use worker threads for CPU-bound JS.',
              ],
              commonMistakes: [
                'Building a shell command string from user input with exec, enabling command injection.',
                'Using exec for a command with huge output and overflowing its buffer.',
              ],
              exercises: [
                {
                  type: 'quiz',
                  prompt: 'Why is spawn with an argument array safer than exec with an interpolated command string?',
                  hint: 'Shell interpretation.',
                  solution: {
                    explanation:
                      'spawn (and execFile) pass arguments directly to the program without a shell, so user input cannot be interpreted as shell metacharacters. exec runs a shell on a string, where interpolated input can inject arbitrary commands.',
                  },
                },
                {
                  type: 'quiz',
                  prompt: 'What is fork specialized for compared to spawn?',
                  solution: {
                    explanation:
                      'fork is for launching another Node.js script and sets up an IPC message channel between parent and child, so they can exchange messages with send/on(\'message\').',
                  },
                },
                {
                  type: 'predict',
                  prompt: 'You use exec to run a command that produces 200 MB of output. What is likely to go wrong?',
                  solution: {
                    explanation:
                      'exec buffers all output in memory and has a maxBuffer limit; the command will error out (ERR_CHILD_PROCESS_STDIO_MAXBUFFER) or consume excessive memory. spawn, which streams, is the right choice for large output.',
                  },
                },
              ],
              docs: 'https://nodejs.org/docs/latest/api/child_process.html',
            },
          ],
        },
        {
          id: 'nd5-t2',
          name: 'Debugging, testing and deployment',
          concepts: [
            {
              id: 'nd5-t2-c0',
              title: 'Debugging and logging',
              summary:
                'Use the built-in inspector for breakpoint debugging and structured logging for production observability — not scattered console.log statements.',
              explanation:
                'Node has a built-in debugger based on the Chrome DevTools protocol: running node --inspect (or --inspect-brk to pause on the first line) lets you attach DevTools or your editor to set breakpoints, step through code and inspect variables, which is far more powerful than print-style debugging. For production, console.log is inadequate because it is unstructured and synchronous to a terminal; instead use a logging library (such as pino or winston) that emits structured JSON with levels (info, warn, error), timestamps and request context, so logs can be searched and aggregated by your platform. Establish log levels and set them by environment via configuration, log errors with their stack and relevant context rather than just a message, and never log secrets or full request bodies that may contain personal data. Correlating logs with a request id makes tracing a single request across services possible. Good observability — structured logs, plus metrics and tracing in larger systems — is what lets you understand and fix problems in a running service.',
              code: {
                language: 'bash',
                lines: [
                  '# Start with the inspector and pause on the first line',
                  'node --inspect-brk server.js',
                  '',
                  '# Then attach Chrome DevTools (chrome://inspect) or your editor',
                  '',
                  '# Structured logging in code (pino example):',
                  '# logger.info({ userId, route }, \'request handled\');',
                ],
                explanation:
                  '--inspect-brk launches the debugger paused so you can attach and set breakpoints. A structured logger emits searchable JSON with context, unlike plain console.log.',
              },
              keyPoints: [
                'node --inspect / --inspect-brk enables breakpoint debugging via DevTools or an editor.',
                'Prefer structured JSON logging (pino, winston) over console.log in production.',
                'Use log levels, timestamps and request context; set the level by environment.',
                'Never log secrets or sensitive personal data.',
              ],
              commonMistakes: [
                'Leaving console.log debugging statements in production code with no levels or structure.',
                'Logging secrets, tokens or full request bodies that contain personal data.',
              ],
              exercises: [
                {
                  type: 'quiz',
                  prompt: 'What is the difference between node --inspect and node --inspect-brk?',
                  hint: 'One pauses immediately.',
                  solution: {
                    explanation:
                      '--inspect enables the debugger and lets the program run normally until a breakpoint. --inspect-brk additionally pauses execution on the first line so you can attach before any code runs.',
                  },
                },
                {
                  type: 'quiz',
                  prompt: 'Why prefer a structured logger over console.log in production?',
                  solution: {
                    explanation:
                      'Structured loggers emit machine-parseable JSON with levels, timestamps and context, so logs can be filtered, searched and aggregated by log platforms. console.log is unstructured and harder to operate against at scale.',
                  },
                },
                {
                  type: 'predict',
                  prompt: 'A team relies on console.log everywhere and logs the full request body, which sometimes includes passwords. What is the risk?',
                  solution: {
                    explanation:
                      'Sensitive data like passwords end up in log files and aggregation systems, a serious security and compliance leak. Logs should redact or omit secrets and personal data.',
                  },
                },
              ],
              docs: 'https://nodejs.org/en/learn/getting-started/debugging',
            },
            {
              id: 'nd5-t2-c1',
              title: 'The built-in test runner',
              summary:
                'Modern Node ships a test runner (node --test) with test, describe/it and an assert module, so you can write and run tests with zero dependencies.',
              explanation:
                'Recent Node versions include a built-in test runner, removing the need for an external framework for many projects. You write tests using the test function (or describe and it for grouping) imported from node:test, make assertions with the built-in node:assert module, and run everything with node --test, which discovers test files by convention and reports results. It supports asynchronous tests (return a promise or use async), subtests, before/after hooks, skipping and a watch mode for fast feedback during development. Good tests are small, isolated and deterministic: each verifies one behavior, does not depend on external state, and avoids real network or database calls by using mocks or test doubles where needed (node:test provides mocking helpers). Aim to test behavior and edge cases rather than implementation details, and keep tests fast so the whole suite runs on every change and in CI. Whether you use the built-in runner or a library like Jest or Vitest, a reliable test suite is the foundation that lets you change code with confidence.',
              code: {
                language: 'javascript',
                lines: [
                  'import { test } from \'node:test\';',
                  'import assert from \'node:assert/strict\';',
                  'import { add } from \'./math.js\';',
                  '',
                  'test(\'add sums two numbers\', () => {',
                  '  assert.equal(add(2, 3), 5);',
                  '});',
                  '',
                  'test(\'add handles negatives\', () => {',
                  '  assert.equal(add(-1, -1), -2);',
                  '});',
                ],
                explanation:
                  'Tests from node:test use the strict assert module to check results. Run them with node --test, which finds and executes test files and reports pass/fail.',
              },
              keyPoints: [
                'node --test runs the built-in test runner with no extra dependencies.',
                'Write tests with node:test (test, describe, it) and assert with node:assert.',
                'Supports async tests, hooks, mocking, skipping and watch mode.',
                'Keep tests small, isolated, deterministic and fast.',
              ],
              exercises: [
                {
                  type: 'quiz',
                  prompt: 'What command runs the built-in Node test runner, and what two core modules do you use to write tests?',
                  hint: 'No npm install required.',
                  solution: {
                    explanation:
                      'node --test runs the tests. You write them with the node:test module (test/describe/it) and assert with the node:assert module.',
                  },
                },
                {
                  type: 'task',
                  prompt: 'Write a test using the built-in runner that checks toUpper(\'hi\') equals \'HI\'.',
                  solution: {
                    lines: [
                      'import { test } from \'node:test\';',
                      'import assert from \'node:assert/strict\';',
                      'import { toUpper } from \'./str.js\';',
                      '',
                      'test(\'toUpper uppercases\', () => {',
                      '  assert.equal(toUpper(\'hi\'), \'HI\');',
                      '});',
                    ],
                    explanation: 'A single focused test imports the function, asserts the expected output, and runs under node --test.',
                  },
                },
                {
                  type: 'predict',
                  prompt: 'A test makes a real network call to a live third-party API. Why might it be flaky in CI?',
                  solution: {
                    explanation:
                      'It depends on external availability, network latency and changing data, so it can fail intermittently for reasons unrelated to your code. Such calls should be mocked to keep tests deterministic.',
                  },
                },
              ],
              docs: 'https://nodejs.org/docs/latest/api/test.html',
            },
            {
              id: 'nd5-t2-c2',
              title: 'Deployment and security fundamentals',
              summary:
                'Ship the LTS runtime with reproducible installs, run under a supervisor behind a reverse proxy, manage secrets safely, and follow basic security hygiene.',
              explanation:
                'Deploying Node well combines a handful of disciplines. Use a current LTS runtime and install dependencies reproducibly with npm ci from a committed lockfile, building once and promoting the same artifact (often a container image) through environments. Set NODE_ENV=production, supply configuration and secrets through the platform\'s environment or a secret manager, and never bake secrets into the image. Run the app under a supervisor or orchestrator (systemd, PM2, Kubernetes) that restarts crashed processes and supports graceful shutdown on SIGTERM, and typically place it behind a reverse proxy or load balancer that handles TLS, compression and request limits. On the security side, the fundamentals go a long way: keep dependencies patched and run npm audit, validate and sanitize all input, use parameterized queries, set safe HTTP headers (a library like helmet helps), enforce HTTPS, apply rate limiting, and run the process as a non-root, least-privilege user. Add a health-check endpoint so the orchestrator can detect and replace unhealthy instances. None of these steps is complex individually, but together they separate a hobby script from a service you can run in production.',
              diagram: {
                type: 'mermaid',
                lines: [
                  'flowchart LR',
                  '  CLIENT[Client] --> PROXY[Reverse proxy TLS]',
                  '  PROXY --> SUP[Supervisor]',
                  '  SUP --> APP[Node app]',
                  '  APP --> DB[Database]',
                ],
                caption: 'A production deployment runs the Node app under a supervisor behind a TLS-terminating reverse proxy.',
              },
              keyPoints: [
                'Use LTS, npm ci with a committed lockfile, and build-once promote-everywhere.',
                'Set NODE_ENV=production and supply secrets via the platform, not the image.',
                'Run under a supervisor with graceful shutdown, behind a reverse proxy for TLS.',
                'Security basics: patch deps, validate input, safe headers, HTTPS, rate limiting, non-root user.',
              ],
              commonMistakes: [
                'Baking secrets into a container image or committing them to the repo.',
                'Running the process as root and skipping dependency patching and input validation.',
              ],
              exercises: [
                {
                  type: 'quiz',
                  prompt: 'Why run a production Node service under a process supervisor or orchestrator behind a reverse proxy?',
                  hint: 'Crashes and TLS.',
                  solution: {
                    explanation:
                      'The supervisor restarts crashed processes and coordinates graceful shutdown, giving resilience. The reverse proxy terminates TLS and handles concerns like compression, request limits and load balancing, keeping the app focused on application logic.',
                  },
                },
                {
                  type: 'quiz',
                  prompt: 'List three basic security practices for a production Node app.',
                  solution: {
                    explanation:
                      'Examples: keep dependencies patched (npm audit), validate and sanitize all input, use parameterized queries, set safe HTTP headers, enforce HTTPS, apply rate limiting, and run as a non-root least-privilege user. Any three are valid.',
                  },
                },
                {
                  type: 'predict',
                  prompt: 'A deployment uses npm install (not npm ci) at deploy time with no committed lockfile. What reproducibility risk arises?',
                  solution: {
                    explanation:
                      'Different deploys can resolve dependency ranges to different versions, so production may run code that was never tested. Committing the lockfile and using npm ci pins the exact tested tree.',
                  },
                },
              ],
              docs: 'https://nodejs.org/en/learn/getting-started/security-best-practices',
            },
          ],
        },
      ],
    },
  ],
};

export default content;
