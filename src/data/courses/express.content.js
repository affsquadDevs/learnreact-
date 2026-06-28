// Express — course content. Original explanations written for self-study; same schema as the other courses.
const content = {
  meta: {
    title: 'Express: Building Web APIs and Apps with Node.js',
    description:
      'Learn Express.js from the ground up: serving HTTP with Node, routing, the middleware pipeline, building RESTful APIs, authentication, templating and file uploads, and finally hardening and deploying an app for production. Original explanations, heavy code examples and hands-on exercises throughout.',
    schemaVersion: '1.0',
    status: 'complete',
  },
  levels: [
    /* ───────────────────── LEVEL 1 — FUNDAMENTALS ───────────────────── */
    {
      level: 1,
      name: 'Fundamentals',
      focus: 'Serving HTTP, routing requests, and reading and writing the request and response',
      accent: '#1f2937',
      soft: '#eef1f5',
      topics: [
        {
          id: 'ex1-t0',
          name: 'What Express is',
          concepts: [
            {
              id: 'ex1-t0-c0',
              title: 'Express: a minimal web framework over Node http',
              summary:
                'Express is a small, unopinionated web framework that sits on top of Node\'s built-in http module. It gives you routing and middleware so you do not hand-write low-level request handling.',
              explanation:
                'Node ships with a core http module that can create a server, but it is very low level: you get a single callback for every request and you must inspect the URL and method yourself, parse bodies by hand, and write status codes and headers manually. Express wraps that http server with two big ideas — routing (mapping a method and path to a handler) and middleware (a pipeline of functions that each request flows through). It stays deliberately unopinionated: it does not dictate your folder structure, ORM, or template engine, so you assemble the pieces you need. Because it is thin, the mental model is small, and almost the entire Node ecosystem of middleware plugs straight in. That balance of small core plus huge ecosystem is why Express has been the default Node web framework for over a decade.',
              analogy:
                'Node\'s http module is a bare engine and chassis. Express is the dashboard, steering wheel and pedals bolted on so you can actually drive without touching the wiring.',
              keyPoints: [
                'Express is a thin layer over Node\'s core http module.',
                'Its two core ideas are routing and middleware.',
                'It is unopinionated: you choose the database, structure and view engine.',
                'A massive ecosystem of compatible middleware exists.',
              ],
              diagram: {
                type: 'mermaid',
                lines: [
                  'flowchart LR',
                  '  Client[Client] --> Node[Node http server]',
                  '  Node --> Express[Express app]',
                  '  Express --> MW[Middleware]',
                  '  MW --> Route[Route handler]',
                ],
                caption: 'Express wraps the Node http server and adds a middleware and routing layer.',
              },
              exercises: [
                {
                  type: 'quiz',
                  prompt: 'What two core capabilities does Express add on top of Node\'s http module?',
                  hint: 'One maps URLs to code, the other is a pipeline.',
                  solution: {
                    explanation:
                      'Routing (mapping an HTTP method and path to a handler) and middleware (a chain of functions every request passes through).',
                  },
                },
                {
                  type: 'quiz',
                  prompt: 'Why is Express described as unopinionated?',
                  solution: {
                    explanation:
                      'It does not force a folder layout, database, or view engine on you. It provides routing and middleware and lets you assemble the rest.',
                  },
                },
                {
                  type: 'predict',
                  prompt: 'If Express is so thin, why does it have such a large ecosystem of plugins?',
                  solution: {
                    explanation:
                      'Because the core stays small and middleware follows a simple (req, res, next) contract, thousands of community packages plug in without friction.',
                  },
                },
              ],
              docs: 'https://expressjs.com/en/starter/installing.html',
            },
            {
              id: 'ex1-t0-c1',
              title: 'Installing Express and a hello-world server',
              summary:
                'You add Express to a Node project with npm, then create an app, define one route, and start listening. A few lines give you a working HTTP server.',
              explanation:
                'Start by initialising a project with npm init so you have a package.json, then install Express with npm install express. In your entry file you require express, call it to create an app object, and register a handler for GET / that sends a response. Finally you call app.listen with a port and a callback that fires once the server is accepting connections. That is the whole hello-world: Express handles parsing the request line, matching the route, and writing a sensible default Content-Type and status code. From here every feature is just more routes and more middleware added to the same app object.',
              keyPoints: [
                'npm init creates package.json; npm install express adds the dependency.',
                'require(\'express\')() returns an application object.',
                'app.get(path, handler) registers a route.',
                'app.listen(port, callback) starts the server.',
              ],
              code: {
                language: 'javascript',
                lines: [
                  'const express = require(\'express\');',
                  'const app = express();',
                  '',
                  'app.get(\'/\', (req, res) => {',
                  '  res.send(\'Hello, world!\');',
                  '});',
                  '',
                  'app.listen(3000, () => {',
                  '  console.log(\'Server running on http://localhost:3000\');',
                  '});',
                ],
                explanation:
                  'express() creates the app, app.get registers a handler for the root path, and app.listen binds the server to port 3000.',
              },
              commonMistakes: [
                'Forgetting to call app.listen, so the process exits without serving anything.',
                'Never sending a response (no res.send/json/end), leaving the request hanging until it times out.',
              ],
              exercises: [
                {
                  type: 'task',
                  prompt: 'Write the npm commands to start a project and install Express.',
                  solution: {
                    lines: ['npm init -y', 'npm install express'],
                    explanation: 'npm init -y scaffolds package.json with defaults; npm install express adds Express to dependencies.',
                  },
                },
                {
                  type: 'task',
                  prompt: 'Write a minimal Express server that responds with "OK" on GET /health and listens on port 4000.',
                  solution: {
                    lines: [
                      'const express = require(\'express\');',
                      'const app = express();',
                      'app.get(\'/health\', (req, res) => res.send(\'OK\'));',
                      'app.listen(4000);',
                    ],
                    explanation: 'A single GET route for /health and app.listen(4000) starts the server.',
                  },
                },
                {
                  type: 'predict',
                  prompt: 'What happens if a route handler never calls res.send or any response method?',
                  solution: {
                    explanation:
                      'The client never receives a response and the request hangs until it eventually times out. Every path through a handler must end the response.',
                  },
                },
              ],
              docs: 'https://expressjs.com/en/starter/hello-world.html',
            },
            {
              id: 'ex1-t0-c2',
              title: 'app.listen and the application lifecycle',
              summary:
                'app.listen binds the server to a port and returns the underlying Node http.Server. Reading the port from the environment makes the app portable.',
              explanation:
                'app.listen(port, callback) is what actually starts the HTTP server; until you call it, your app has routes defined but accepts no connections. It returns the underlying Node http.Server instance, which you should capture in a variable because you will need it later for graceful shutdown and for tools like supertest. The callback (or a listening event) fires once the server is ready, which is the right place to log a startup message. In production you read the port from process.env.PORT rather than hard-coding it, since hosting platforms assign the port for you. You can call listen multiple times on different servers, but a single app typically listens once. Understanding that listen is the boundary between configuration (defining routes and middleware) and runtime (serving requests) clarifies how an Express process starts up.',
              keyPoints: [
                'app.listen starts the server; without it nothing is served.',
                'It returns the Node http.Server — capture it for shutdown and tests.',
                'Read the port from process.env.PORT for portability.',
                'The callback fires once the server is accepting connections.',
              ],
              code: {
                language: 'javascript',
                lines: [
                  'const port = process.env.PORT || 3000;',
                  'const server = app.listen(port, () => {',
                  '  console.log(\'Listening on port \' + port);',
                  '});',
                  'module.exports = server;',
                ],
                explanation:
                  'The port comes from the environment with a fallback; the returned server is stored so it can be closed cleanly or imported by tests.',
              },
              exercises: [
                {
                  type: 'quiz',
                  prompt: 'What does app.listen return, and why would you keep that value?',
                  solution: {
                    explanation: 'The underlying Node http.Server. You keep it to call server.close() for graceful shutdown and to hand it to tools like supertest.',
                  },
                },
                {
                  type: 'task',
                  prompt: 'Start the server on the environment port, defaulting to 8080.',
                  solution: {
                    lines: ['app.listen(process.env.PORT || 8080);'],
                    explanation: 'Reading PORT from the environment lets the host assign a port while keeping a sensible local default.',
                  },
                },
                {
                  type: 'predict',
                  prompt: 'You hard-code app.listen(3000) but the platform sets PORT=8000. What happens?',
                  solution: {
                    explanation: 'The app listens on 3000, not the port the platform routes traffic to, so the platform cannot reach it. Read process.env.PORT instead.',
                  },
                },
              ],
              docs: 'https://expressjs.com/en/4x/api.html#app.listen',
            },
          ],
        },
        {
          id: 'ex1-t1',
          name: 'Routing',
          concepts: [
            {
              id: 'ex1-t1-c0',
              title: 'Route methods and paths',
              summary:
                'A route is the combination of an HTTP method and a path. Express exposes app.get, app.post, app.put, app.delete and more, each taking a path and a handler.',
              explanation:
                'Routing decides which handler runs for a given request. Express mirrors the HTTP verbs as methods on the app: app.get for reads, app.post for creates, app.put and app.patch for updates, and app.delete for removals. Each takes a path string and one or more handler functions. The path can be a literal like /users, can contain parameters, and can even use patterns. app.all matches every method for a path, and app.use without a method matches all methods and is the basis of middleware. Routes are matched top to bottom in the order you register them, and the first matching route that sends a response wins, so order can matter when paths overlap.',
              analogy:
                'Think of routes as a switchboard: the operator looks at who is calling (the method) and which extension they dialled (the path), then connects them to the right desk (the handler).',
              keyPoints: [
                'A route = HTTP method + path + handler.',
                'app.get/post/put/patch/delete map to HTTP verbs.',
                'Routes are matched in registration order, top to bottom.',
                'app.all matches any method; app.use matches all methods as middleware.',
              ],
              code: {
                language: 'javascript',
                lines: [
                  'app.get(\'/users\', (req, res) => res.send(\'list users\'));',
                  'app.post(\'/users\', (req, res) => res.send(\'create user\'));',
                  'app.put(\'/users/:id\', (req, res) => res.send(\'replace user\'));',
                  'app.delete(\'/users/:id\', (req, res) => res.send(\'delete user\'));',
                ],
                explanation:
                  'The same /users resource gets different behaviour depending on the HTTP verb, which is the foundation of REST.',
              },
              exercises: [
                {
                  type: 'quiz',
                  prompt: 'In what order does Express try to match routes?',
                  hint: 'It is not by specificity.',
                  solution: { explanation: 'In the order they were registered, from top to bottom. The first matching route that responds wins.' },
                },
                {
                  type: 'task',
                  prompt: 'Add a route that updates part of a product with PATCH at /products/:id.',
                  solution: {
                    lines: ['app.patch(\'/products/:id\', (req, res) => res.send(\'partial update\'));'],
                    explanation: 'app.patch maps to the HTTP PATCH verb, used for partial updates.',
                  },
                },
                {
                  type: 'predict',
                  prompt: 'You register app.get(\'/users/new\') AFTER app.get(\'/users/:id\'). What might go wrong?',
                  solution: {
                    explanation:
                      'The /:id route can match /users/new first, treating "new" as an id. Put the more specific literal route before the parameter route.',
                  },
                },
              ],
              docs: 'https://expressjs.com/en/guide/routing.html',
            },
            {
              id: 'ex1-t1-c1',
              title: 'Route parameters and query strings',
              summary:
                'Named segments like /users/:id become req.params; the part after ? in a URL becomes req.query. They are how routes receive dynamic input.',
              explanation:
                'A route path can contain named parameters introduced by a colon, such as /users/:id. When the route matches, Express fills req.params with an object whose keys are the parameter names, so req.params.id holds the matched segment. You can have several parameters in one path, like /users/:userId/posts/:postId. Separately, anything after the question mark in a URL is the query string; Express parses it into req.query, so /search?q=express&page=2 yields req.query.q and req.query.page. Both params and query values arrive as strings, so you must convert numbers yourself. Parameters identify a specific resource, while query strings usually carry filters, sorting and pagination.',
              keyPoints: [
                'req.params holds named route segments (\':id\' becomes req.params.id).',
                'req.query holds the parsed query string after the \'?\'.',
                'All param and query values are strings — convert types yourself.',
                'Use params to identify a resource, query for filters and pagination.',
              ],
              code: {
                language: 'javascript',
                lines: [
                  'app.get(\'/users/:id\', (req, res) => {',
                  '  res.send(\'user id is \' + req.params.id);',
                  '});',
                  '',
                  'app.get(\'/search\', (req, res) => {',
                  '  const page = Number(req.query.page) || 1;',
                  '  res.json({ term: req.query.q, page });',
                  '});',
                ],
                explanation:
                  'req.params.id comes from the :id segment; req.query.q and req.query.page come from the URL after the question mark.',
              },
              commonMistakes: [
                'Assuming req.query.page is a number — it is a string until you convert it.',
                'Confusing req.params (path segments) with req.query (the query string).',
              ],
              exercises: [
                {
                  type: 'quiz',
                  prompt: 'For the request GET /books/42?lang=en, what are req.params.id and req.query.lang for route /books/:id?',
                  solution: { explanation: 'req.params.id is the string "42" and req.query.lang is the string "en".' },
                },
                {
                  type: 'task',
                  prompt: 'Write a route /posts/:year/:month that returns both values as JSON.',
                  solution: {
                    lines: [
                      'app.get(\'/posts/:year/:month\', (req, res) => {',
                      '  res.json({ year: req.params.year, month: req.params.month });',
                      '});',
                    ],
                    explanation: 'Multiple colon-prefixed segments each become keys on req.params.',
                  },
                },
                {
                  type: 'predict',
                  prompt: 'A handler does if (req.query.active) to test a boolean filter. The URL has ?active=false. What happens?',
                  solution: {
                    explanation:
                      'The string "false" is truthy, so the condition passes. Compare against the string explicitly, e.g. req.query.active === \'true\'.',
                  },
                },
              ],
              docs: 'https://expressjs.com/en/guide/routing.html#route-parameters',
            },
            {
              id: 'ex1-t1-c2',
              title: 'The Router: modular route groups',
              summary:
                'express.Router() creates a mini-app you can attach to a path prefix. It lets you split routes into files and mount them with app.use.',
              explanation:
                'As an app grows, putting every route on the main app object becomes unwieldy. express.Router() returns a self-contained routing object that has the same .get/.post/.use methods as the app. You define a group of related routes on a router — say all /users routes — and then mount it with app.use(\'/users\', usersRouter). Paths inside the router are relative to that mount point, so router.get(\'/:id\') responds at /users/:id. Routers can have their own middleware that only runs for their routes, and they can be nested. This is the standard way to keep an Express codebase organised: one router per resource, each in its own file, exported and mounted in the main app.',
              analogy:
                'A Router is like a department in a company. The mailroom (the main app) routes anything addressed to "Sales" to the Sales department, which then sorts it among its own desks.',
              keyPoints: [
                'express.Router() creates a modular, mountable group of routes.',
                'app.use(\'/prefix\', router) mounts it under a path prefix.',
                'Paths inside the router are relative to the mount point.',
                'Routers can carry their own middleware and live in separate files.',
              ],
              code: {
                language: 'javascript',
                lines: [
                  '// users.routes.js',
                  'const express = require(\'express\');',
                  'const router = express.Router();',
                  '',
                  'router.get(\'/\', (req, res) => res.send(\'all users\'));',
                  'router.get(\'/:id\', (req, res) => res.send(\'user \' + req.params.id));',
                  '',
                  'module.exports = router;',
                  '',
                  '// app.js',
                  'const usersRouter = require(\'./users.routes\');',
                  'app.use(\'/users\', usersRouter);',
                ],
                explanation:
                  'router.get(\'/\') responds at /users and router.get(\'/:id\') at /users/:id because the router is mounted under /users.',
              },
              exercises: [
                {
                  type: 'quiz',
                  prompt: 'If a router is mounted with app.use(\'/api\', router) and defines router.get(\'/health\'), what URL does it serve?',
                  solution: { explanation: 'GET /api/health — the router path is relative to the /api mount point.' },
                },
                {
                  type: 'task',
                  prompt: 'Create a router for /products with a GET / route and export it.',
                  solution: {
                    lines: [
                      'const router = require(\'express\').Router();',
                      'router.get(\'/\', (req, res) => res.send(\'all products\'));',
                      'module.exports = router;',
                    ],
                    explanation: 'Define routes on a Router and export it so the main app can mount it under /products.',
                  },
                },
                {
                  type: 'predict',
                  prompt: 'You add router.use(logger) at the top of a router. Which requests does logger run for?',
                  solution: {
                    explanation: 'Only requests handled by that router (those under its mount prefix), not the whole app.',
                  },
                },
              ],
              docs: 'https://expressjs.com/en/guide/routing.html#express-router',
            },
          ],
        },
        {
          id: 'ex1-t2',
          name: 'Request and response',
          concepts: [
            {
              id: 'ex1-t2-c0',
              title: 'The req object: params, query, body and headers',
              summary:
                'The request object exposes everything the client sent: route params, query string, parsed body, headers, method and URL.',
              explanation:
                'Every handler receives a req object that represents the incoming HTTP request. The most-used properties are req.params (named route segments), req.query (the parsed query string), and req.body (the parsed request body, available only after a body-parsing middleware like express.json runs). You also get req.headers as an object and the convenience method req.get(\'Header-Name\') for a single header (case-insensitive). req.method and req.path/req.url tell you what was requested, req.ip gives the client address, and req.cookies appears when cookie-parser is used. Knowing where each piece of input lives is half of writing correct handlers — for example, body data simply will not appear unless you have registered the right parser middleware first.',
              keyPoints: [
                'req.params, req.query and req.body carry the three main input sources.',
                'req.body is empty until a body parser (express.json/urlencoded) runs.',
                'req.headers and req.get(\'name\') read headers (case-insensitive).',
                'req.method, req.path and req.ip describe the request itself.',
              ],
              code: {
                language: 'javascript',
                lines: [
                  'app.use(express.json());',
                  '',
                  'app.post(\'/users/:id\', (req, res) => {',
                  '  console.log(req.params.id);',
                  '  console.log(req.query.verbose);',
                  '  console.log(req.body.name);',
                  '  console.log(req.get(\'content-type\'));',
                  '  res.send(\'received\');',
                  '});',
                ],
                explanation:
                  'express.json() populates req.body; params, query and headers are read directly from the request object.',
              },
              commonMistakes: [
                'Reading req.body without registering express.json() or express.urlencoded() first — it will be undefined.',
                'Treating header names as case-sensitive; HTTP headers are case-insensitive, so use req.get().',
              ],
              exercises: [
                {
                  type: 'quiz',
                  prompt: 'Why might req.body be undefined inside a POST handler?',
                  hint: 'It involves middleware.',
                  solution: {
                    explanation: 'Because no body-parsing middleware (such as express.json() or express.urlencoded()) ran before the handler.',
                  },
                },
                {
                  type: 'task',
                  prompt: 'Write a line that reads the Authorization header from req in a case-insensitive way.',
                  solution: {
                    lines: ['const auth = req.get(\'authorization\');'],
                    explanation: 'req.get looks up headers case-insensitively, unlike directly indexing req.headers with a specific case.',
                  },
                },
                {
                  type: 'predict',
                  prompt: 'A JSON POST sends {"qty": 5} but the handler logs typeof req.body.qty. What is logged?',
                  solution: {
                    explanation: '"number" — express.json parses JSON, so numbers stay numbers (unlike query/param strings).',
                  },
                },
              ],
              docs: 'https://expressjs.com/en/4x/api.html#req',
            },
            {
              id: 'ex1-t2-c1',
              title: 'The res object: send, json, status, redirect and end',
              summary:
                'The response object writes data back to the client. res.send and res.json write a body, res.status sets the code, and res.redirect/end finish the response.',
              explanation:
                'The res object is how you reply. res.send accepts a string, buffer, or object and sets a sensible Content-Type automatically; res.json serialises an object to JSON and sets application/json explicitly, which is what you want for APIs. res.status(code) sets the HTTP status and returns res so you can chain, as in res.status(201).json(data). res.redirect(url) sends a 302 (or a code you specify) with a Location header, and res.end() closes the response without a body. A crucial rule: you can only send one response per request. Once any of these methods has flushed headers, calling another throws an "ERR_HTTP_HEADERS_SENT" error, so each code path must end in exactly one response.',
              analogy:
                'res is like sealing and posting a single envelope. You can stamp it (status), put a letter inside (send/json) or redirect it elsewhere — but once it is in the postbox, you cannot send a second one for the same request.',
              keyPoints: [
                'res.send guesses the Content-Type; res.json always sends JSON.',
                'res.status(code) sets the code and is chainable.',
                'res.redirect(url) sends a redirect with a Location header.',
                'You may send only one response per request, or you get headers-sent errors.',
              ],
              code: {
                language: 'javascript',
                lines: [
                  'app.post(\'/users\', (req, res) => {',
                  '  const user = createUser(req.body);',
                  '  res.status(201).json(user);',
                  '});',
                  '',
                  'app.get(\'/old\', (req, res) => {',
                  '  res.redirect(301, \'/new\');',
                  '});',
                ],
                explanation:
                  'res.status(201).json(user) returns the created resource with a 201; res.redirect(301, ...) issues a permanent redirect.',
              },
              commonMistakes: [
                'Calling res.send twice (or res.json after res.send) — only one response is allowed per request.',
                'Forgetting to return after res.send in a branch, so code keeps running and tries to respond again.',
              ],
              exercises: [
                {
                  type: 'quiz',
                  prompt: 'What is the difference between res.send({...}) and res.json({...})?',
                  solution: {
                    explanation:
                      'Both can send an object as JSON, but res.json always sets Content-Type to application/json and is the explicit, intent-revealing choice for APIs.',
                  },
                },
                {
                  type: 'task',
                  prompt: 'Respond with HTTP 404 and a JSON body { error: \'Not found\' }.',
                  solution: {
                    lines: ['res.status(404).json({ error: \'Not found\' });'],
                    explanation: 'res.status sets the code, and chaining .json sends the body with the correct content type.',
                  },
                },
                {
                  type: 'predict',
                  prompt: 'A handler runs res.send(\'a\'); res.send(\'b\'); with no return between. What happens?',
                  solution: {
                    explanation:
                      'The first send works; the second throws ERR_HTTP_HEADERS_SENT because the response was already sent. Always return after responding.',
                  },
                },
              ],
              docs: 'https://expressjs.com/en/4x/api.html#res',
            },
          ],
        },
      ],
    },
    /* ───────────────────── LEVEL 2 — MIDDLEWARE ───────────────────── */
    {
      level: 2,
      name: 'Middleware',
      focus: 'The request pipeline: writing, ordering and composing middleware, including error handling',
      accent: '#1f2937',
      soft: '#eef1f5',
      topics: [
        {
          id: 'ex2-t0',
          name: 'Middleware fundamentals',
          concepts: [
            {
              id: 'ex2-t0-c0',
              title: 'The request pipeline and the (req, res, next) signature',
              summary:
                'Middleware are functions that run in sequence for each request. They receive req, res and next, and either respond or call next() to pass control along.',
              explanation:
                'In Express almost everything is middleware — even your route handlers. A middleware function has the signature (req, res, next): it can read or modify req and res, end the request by sending a response, or call next() to hand control to the next function in the chain. Express keeps an ordered stack of middleware and route handlers; each incoming request flows through that stack from top to bottom. A function that does not respond must call next(), or the request stalls forever. Middleware is where you put cross-cutting concerns: logging, authentication, body parsing, setting common headers, attaching data to req. Understanding that each request is a journey through this pipeline is the single most important mental model in Express.',
              analogy:
                'A request is a passenger going through airport security: check-in, ID check, bag scan, gate. Each station (middleware) either lets the passenger continue (next) or stops them (a response).',
              keyPoints: [
                'Middleware signature is (req, res, next).',
                'Each request flows through the middleware stack in order.',
                'Call next() to continue, or send a response to stop the chain.',
                'Route handlers are themselves middleware that usually end the request.',
              ],
              diagram: {
                type: 'mermaid',
                lines: [
                  'flowchart LR',
                  '  Req[Request] --> M1[Logger]',
                  '  M1 --> M2[Auth]',
                  '  M2 --> M3[Body parser]',
                  '  M3 --> Handler[Route handler]',
                  '  Handler --> Res[Response]',
                ],
                caption: 'A request passes through each middleware in order before a handler sends the response.',
              },
              code: {
                language: 'javascript',
                lines: [
                  'function logger(req, res, next) {',
                  '  console.log(req.method, req.url);',
                  '  next();',
                  '}',
                  '',
                  'app.use(logger);',
                ],
                explanation:
                  'logger reads the request, logs it, then calls next() so the request continues to later middleware and routes.',
              },
              exercises: [
                {
                  type: 'quiz',
                  prompt: 'What are the three parameters of a standard middleware function?',
                  hint: 'Two are familiar; the third advances the chain.',
                  solution: { explanation: 'req, res and next. Calling next() passes control to the next middleware.' },
                },
                {
                  type: 'task',
                  prompt: 'Write middleware that attaches req.requestTime = Date.now() and then continues.',
                  solution: {
                    lines: [
                      'app.use((req, res, next) => {',
                      '  req.requestTime = Date.now();',
                      '  next();',
                      '});',
                    ],
                    explanation: 'Middleware can add properties to req for later handlers, then must call next() to continue.',
                  },
                },
                {
                  type: 'predict',
                  prompt: 'A middleware does some work but never calls next() and never sends a response. What does the client see?',
                  solution: {
                    explanation: 'Nothing — the request hangs in the pipeline until it times out, because control is never passed on and no response is sent.',
                  },
                },
              ],
              docs: 'https://expressjs.com/en/guide/using-middleware.html',
            },
            {
              id: 'ex2-t0-c1',
              title: 'Order matters and scoping middleware',
              summary:
                'Express runs middleware in the order it is registered. You can apply middleware globally, to a path prefix, or to a single route.',
              explanation:
                'Because the pipeline is ordered, where you place app.use matters. A body parser must come before the routes that read req.body; an authentication check must run before the protected routes it guards. app.use(fn) applies the middleware to every request, while app.use(\'/admin\', fn) scopes it to paths starting with /admin. You can also pass middleware directly to a route as extra arguments before the handler, like app.get(\'/secret\', requireAuth, handler), so it runs only for that route. Multiple middleware can be passed at once, and they execute left to right. This positional, compositional design is powerful but unforgiving: a parser or guard registered after the route it should protect simply will not run for it.',
              keyPoints: [
                'Middleware runs in registration order, top to bottom.',
                'app.use(fn) is global; app.use(\'/path\', fn) is path-scoped.',
                'Pass middleware as route arguments to scope it to one route.',
                'Parsers and guards must be registered before the routes that need them.',
              ],
              code: {
                language: 'javascript',
                lines: [
                  'app.use(express.json());            // global, runs first',
                  'app.use(\'/admin\', requireAdmin);   // only /admin paths',
                  '',
                  'app.get(\'/secret\', requireAuth, (req, res) => {',
                  '  res.send(\'top secret\');',
                  '});',
                ],
                explanation:
                  'express.json runs for all requests, requireAdmin only for /admin, and requireAuth only for the /secret route.',
              },
              commonMistakes: [
                'Registering express.json() after a route, so that route never sees req.body.',
                'Placing an auth guard below the routes it is meant to protect.',
              ],
              exercises: [
                {
                  type: 'quiz',
                  prompt: 'How do you make a middleware run only for routes under /api?',
                  solution: { explanation: 'Mount it with a path prefix: app.use(\'/api\', middleware). It only runs for requests whose path starts with /api.' },
                },
                {
                  type: 'task',
                  prompt: 'Attach a checkToken middleware to only the GET /profile route.',
                  solution: {
                    lines: ['app.get(\'/profile\', checkToken, (req, res) => res.send(\'profile\'));'],
                    explanation: 'Passing middleware as an argument before the handler scopes it to that single route.',
                  },
                },
                {
                  type: 'predict',
                  prompt: 'app.get(\'/data\', handler) is registered, then app.use(express.json()) afterward. Does the handler see req.body?',
                  solution: {
                    explanation: 'No. The route was registered before the parser, so for that route req.body is not populated. Order matters.',
                  },
                },
              ],
              docs: 'https://expressjs.com/en/guide/using-middleware.html#middleware.application',
            },
          ],
        },
        {
          id: 'ex2-t1',
          name: 'Built-in and third-party middleware',
          concepts: [
            {
              id: 'ex2-t1-c0',
              title: 'Parsing bodies: express.json and express.urlencoded',
              summary:
                'These built-in middlewares read the request body and populate req.body — JSON for APIs and URL-encoded for HTML form posts.',
              explanation:
                'HTTP bodies arrive as raw bytes; something must parse them. Since Express 4.16, two parsers ship in the box. express.json() reads requests with Content-Type application/json and puts the parsed object on req.body, which is what almost every JSON API needs. express.urlencoded({ extended: true }) parses application/x-www-form-urlencoded bodies — the format that classic HTML forms submit — with extended:true allowing rich nested objects via the qs library. Register the parser you need before your routes. You can also limit body size with the limit option to defend against huge payloads. If a request arrives with no matching content type, the parser simply leaves req.body as an empty object rather than throwing.',
              keyPoints: [
                'express.json() parses application/json into req.body.',
                'express.urlencoded({ extended: true }) parses HTML form posts.',
                'Both are built in since Express 4.16 — no separate body-parser package needed.',
                'Use the limit option to cap body size and resist abuse.',
              ],
              code: {
                language: 'javascript',
                lines: [
                  'app.use(express.json({ limit: \'1mb\' }));',
                  'app.use(express.urlencoded({ extended: true }));',
                  '',
                  'app.post(\'/login\', (req, res) => {',
                  '  res.send(\'hello \' + req.body.username);',
                  '});',
                ],
                explanation:
                  'With both parsers registered, req.body is filled whether the client sends JSON or a URL-encoded form.',
              },
              commonMistakes: [
                'Using extended: false then wondering why nested form fields collapse — extended: true supports nesting.',
                'Sending JSON but the client omits the application/json header, so express.json skips it and req.body stays empty.',
              ],
              exercises: [
                {
                  type: 'quiz',
                  prompt: 'Which middleware parses a classic HTML form submission?',
                  solution: { explanation: 'express.urlencoded(), because HTML forms post as application/x-www-form-urlencoded.' },
                },
                {
                  type: 'task',
                  prompt: 'Enable JSON body parsing with a 500kb size limit.',
                  solution: {
                    lines: ['app.use(express.json({ limit: \'500kb\' }));'],
                    explanation: 'The limit option caps the accepted body size, returning a 413 error if exceeded.',
                  },
                },
                {
                  type: 'predict',
                  prompt: 'A client POSTs JSON but forgets the Content-Type header. What is req.body in the handler?',
                  solution: {
                    explanation: 'An empty object — express.json only parses requests whose content type is application/json, so it skips this one.',
                  },
                },
              ],
              docs: 'https://expressjs.com/en/4x/api.html#express.json',
            },
            {
              id: 'ex2-t1-c1',
              title: 'Serving files with express.static',
              summary:
                'express.static turns a folder into a web-accessible directory, serving CSS, images, JavaScript and other static assets directly.',
              explanation:
                'Many apps need to serve files that are not generated per-request: stylesheets, client-side scripts, images, fonts. express.static(rootFolder) is built-in middleware that maps URL paths to files in that folder. With app.use(express.static(\'public\')), a request for /logo.png returns public/logo.png. You can also mount it under a virtual prefix, like app.use(\'/assets\', express.static(\'public\')), so the same file is served at /assets/logo.png while the folder name stays hidden. The middleware sets sensible caching and content-type headers automatically and returns 404 by falling through to the next middleware if no file matches. For production you often serve static files via a CDN or reverse proxy instead, but express.static is perfect for development and small apps.',
              analogy:
                'express.static is like opening a shop window onto a storeroom: anything you place in that one room becomes visible and grabbable from the street, but the rest of the building stays private.',
              keyPoints: [
                'express.static(folder) serves files from that folder over HTTP.',
                'Mount under a prefix to add a virtual path: app.use(\'/assets\', express.static(\'public\')).',
                'It sets content-type and caching headers automatically.',
                'If no file matches, it falls through to the next middleware.',
              ],
              code: {
                language: 'javascript',
                lines: [
                  'const path = require(\'path\');',
                  'app.use(express.static(path.join(__dirname, \'public\')));',
                  'app.use(\'/assets\', express.static(path.join(__dirname, \'uploads\')));',
                ],
                explanation:
                  'Files in public are served at the root; files in uploads are served under the /assets prefix.',
              },
              exercises: [
                {
                  type: 'quiz',
                  prompt: 'With app.use(express.static(\'public\')), what file does a request for /style.css return?',
                  solution: { explanation: 'public/style.css — express.static maps the URL path onto the folder.' },
                },
                {
                  type: 'task',
                  prompt: 'Serve a folder named "images" under the URL prefix /img.',
                  solution: {
                    lines: ['app.use(\'/img\', express.static(\'images\'));'],
                    explanation: 'Mounting with a prefix exposes images/* at /img/* without revealing the folder name.',
                  },
                },
                {
                  type: 'predict',
                  prompt: 'A request hits /missing.png and no such file exists in the static folder. What happens next?',
                  solution: {
                    explanation: 'express.static does not match, so it calls next() and the request continues to later middleware (often a 404 handler).',
                  },
                },
              ],
              docs: 'https://expressjs.com/en/starter/static-files.html',
            },
            {
              id: 'ex2-t1-c2',
              title: 'Popular third-party middleware: morgan, cors, helmet',
              summary:
                'The ecosystem provides drop-in middleware: morgan for request logging, cors to allow cross-origin requests, and helmet to set protective headers.',
              explanation:
                'Because middleware follows a simple contract, the npm ecosystem covers most common needs. morgan is a request logger: app.use(morgan(\'dev\')) prints a concise coloured line for each request, which is invaluable in development. cors enables Cross-Origin Resource Sharing so browsers on other domains can call your API; app.use(cors()) allows all origins, but in production you pass options to whitelist specific origins and methods. helmet sets a bundle of security-related HTTP headers (like Content-Security-Policy and X-Frame-Options) with one line, mitigating several common attacks. You install each with npm, require it, and register it with app.use, usually near the top of the stack so it applies to everything. These three are so common they appear in almost every real Express app.',
              keyPoints: [
                'morgan logs each request; morgan(\'dev\') is a compact dev format.',
                'cors enables cross-origin browser requests; lock down origins in production.',
                'helmet sets protective HTTP headers in one line.',
                'Install with npm, require, then register with app.use near the top.',
              ],
              code: {
                language: 'javascript',
                lines: [
                  'const morgan = require(\'morgan\');',
                  'const cors = require(\'cors\');',
                  'const helmet = require(\'helmet\');',
                  '',
                  'app.use(helmet());',
                  'app.use(cors({ origin: \'https://myapp.com\' }));',
                  'app.use(morgan(\'dev\'));',
                ],
                explanation:
                  'helmet hardens headers, cors restricts cross-origin access to one origin, and morgan logs each request.',
              },
              commonMistakes: [
                'Shipping cors() with no options to production, allowing every origin to call your API.',
                'Registering morgan after the routes, so requests that respond early are not logged.',
              ],
              exercises: [
                {
                  type: 'quiz',
                  prompt: 'Which middleware would you add so a React app on a different domain can call your API from the browser?',
                  solution: { explanation: 'cors — it sets the Access-Control headers browsers require for cross-origin requests.' },
                },
                {
                  type: 'task',
                  prompt: 'Register helmet and a dev-format morgan logger.',
                  solution: {
                    lines: ['app.use(helmet());', 'app.use(morgan(\'dev\'));'],
                    explanation: 'helmet adds security headers; morgan(\'dev\') logs a concise line per request.',
                  },
                },
                {
                  type: 'predict',
                  prompt: 'Your browser console shows "blocked by CORS policy" when calling your API. What is missing on the server?',
                  solution: {
                    explanation: 'The cors middleware (or correct CORS configuration). The server is not sending the Access-Control-Allow-Origin header the browser requires.',
                  },
                },
              ],
              docs: 'https://expressjs.com/en/resources/middleware.html',
            },
          ],
        },
        {
          id: 'ex2-t2',
          name: 'Error-handling middleware',
          concepts: [
            {
              id: 'ex2-t2-c0',
              title: 'The four-argument error handler',
              summary:
                'Express recognises error-handling middleware by its four parameters: (err, req, res, next). It runs only when an error is passed along.',
              explanation:
                'Express distinguishes error-handling middleware purely by arity: a function with four parameters, (err, req, res, next), is treated as an error handler. It is not invoked in the normal flow; instead it runs only when an earlier middleware or route calls next(err) with an argument, or when a synchronous handler throws. You register error handlers with app.use just like normal middleware, but they must come last, after all routes, so they form a safety net. Inside, you typically log the error, choose an appropriate status code, and send a clean response — never leaking stack traces to clients in production. Centralising error handling here means individual handlers do not each need their own try/catch-and-respond logic; they just forward the error.',
              analogy:
                'The error handler is the hospital at the end of the road. Normal traffic drives past it, but anyone who crashes (next(err)) gets routed there for treatment.',
              keyPoints: [
                'Four parameters (err, req, res, next) mark a middleware as an error handler.',
                'It runs only when next(err) is called or a sync handler throws.',
                'Register it last, after all routes, with app.use.',
                'Log the error, set a status, and send a safe response.',
              ],
              code: {
                language: 'javascript',
                lines: [
                  '// must be registered AFTER all routes',
                  'app.use((err, req, res, next) => {',
                  '  console.error(err.stack);',
                  '  const status = err.status || 500;',
                  '  res.status(status).json({ error: err.message });',
                  '});',
                ],
                explanation:
                  'The four-argument signature tells Express this is the error handler; it sends a JSON error with an appropriate status.',
              },
              commonMistakes: [
                'Omitting the fourth parameter, so Express treats it as a normal middleware and never sends errors there.',
                'Registering the error handler before the routes, so it never catches their errors.',
              ],
              exercises: [
                {
                  type: 'quiz',
                  prompt: 'How does Express know a middleware is an error handler?',
                  hint: 'Count the parameters.',
                  solution: { explanation: 'By its arity — it has exactly four parameters: (err, req, res, next).' },
                },
                {
                  type: 'task',
                  prompt: 'Write an error handler that responds with status 500 and the message in JSON.',
                  solution: {
                    lines: [
                      'app.use((err, req, res, next) => {',
                      '  res.status(500).json({ error: err.message });',
                      '});',
                    ],
                    explanation: 'The four-parameter signature makes this an error handler; it returns the error message with a 500.',
                  },
                },
                {
                  type: 'predict',
                  prompt: 'You define the error handler as (err, req, res) with only three params. Does it catch errors?',
                  solution: {
                    explanation: 'No. With three parameters Express treats it as a regular middleware, so errors are not routed to it.',
                  },
                },
              ],
              docs: 'https://expressjs.com/en/guide/error-handling.html',
            },
            {
              id: 'ex2-t2-c1',
              title: 'Passing errors with next and a 404 catch-all',
              summary:
                'Forward errors by calling next(err); add a catch-all middleware after your routes to return a clean 404 for unmatched paths.',
              explanation:
                'Within a handler you signal a problem by calling next(err) with an Error object, which skips remaining normal middleware and jumps straight to the error handler. In synchronous code a plain throw is caught automatically and has the same effect, but in async code you must catch and forward yourself (covered later). Separately, a request that matches no route does not error — it just falls through the whole stack. To handle that, place a middleware with no path after all routes that sends a 404; because nothing matched before it, every unmatched request lands there. The usual ordering is: middleware, then routes, then the 404 catch-all, then the four-argument error handler last of all.',
              keyPoints: [
                'next(err) forwards an error to the error-handling middleware.',
                'Synchronous throws are caught by Express automatically.',
                'An unmatched route falls through — add a 404 catch-all to handle it.',
                'Order: middleware then routes then 404 then error handler.',
              ],
              diagram: {
                type: 'mermaid',
                lines: [
                  'flowchart TD',
                  '  Req[Request] --> Routes[Routes]',
                  '  Routes -->|no match| NotFound[404 catch all]',
                  '  Routes -->|next err| ErrHandler[Error handler]',
                  '  NotFound --> ErrHandler',
                ],
                caption: 'Unmatched requests hit the 404 catch-all; errors are forwarded to the error handler.',
              },
              code: {
                language: 'javascript',
                lines: [
                  'app.get(\'/users/:id\', (req, res, next) => {',
                  '  const user = findUser(req.params.id);',
                  '  if (!user) return next(new Error(\'User not found\'));',
                  '  res.json(user);',
                  '});',
                  '',
                  '// 404 catch-all after all routes',
                  'app.use((req, res) => {',
                  '  res.status(404).json({ error: \'Not found\' });',
                  '});',
                ],
                explanation:
                  'next(new Error(...)) jumps to the error handler; the path-less app.use at the end catches any request no route matched.',
              },
              commonMistakes: [
                'Putting the 404 handler before the routes, so it matches everything and real routes never run.',
                'Calling next(err) then continuing to also send a response, causing a headers-sent error.',
              ],
              exercises: [
                {
                  type: 'quiz',
                  prompt: 'Where in the middleware stack does the 404 catch-all belong?',
                  solution: { explanation: 'After all routes (and before the error handler), so it only runs when nothing else matched.' },
                },
                {
                  type: 'task',
                  prompt: 'In a handler, forward an error to the error handler when a value is missing.',
                  solution: {
                    lines: ['if (!value) return next(new Error(\'Missing value\'));'],
                    explanation: 'next(new Error(...)) skips normal middleware and routes the error to the error handler; return prevents further code running.',
                  },
                },
                {
                  type: 'predict',
                  prompt: 'A request hits a path no route matches and there is no 404 handler. What does the client get?',
                  solution: {
                    explanation: 'Express\'s default 404 response — a plain "Cannot GET /path" message — rather than your custom JSON error.',
                  },
                },
              ],
              docs: 'https://expressjs.com/en/guide/error-handling.html#the-default-error-handler',
            },
          ],
        },
      ],
    },
    /* ───────────────────── LEVEL 3 — BUILDING REST APIs ───────────────────── */
    {
      level: 3,
      name: 'Building REST APIs',
      focus: 'RESTful design, working with data and databases, and structuring a real application',
      accent: '#1f2937',
      soft: '#eef1f5',
      topics: [
        {
          id: 'ex3-t0',
          name: 'RESTful design',
          concepts: [
            {
              id: 'ex3-t0-c0',
              title: 'Resources, HTTP verbs and status codes',
              summary:
                'REST models your domain as resources addressed by URLs, manipulated with HTTP verbs, and reports outcomes with standard status codes.',
              explanation:
                'A RESTful API exposes nouns (resources) at URLs and uses HTTP verbs as the actions on them. Conventionally, a collection lives at /articles and a single item at /articles/:id. GET reads (a list or one item), POST creates a new item in a collection, PUT replaces an item, PATCH partially updates it, and DELETE removes it. The verb carries the intent, so the URL stays a clean noun rather than /getArticle or /deleteArticle. Outcomes are reported with status codes: 200 OK, 201 Created (with a Location header for the new resource), 204 No Content for a successful delete, 400 Bad Request for invalid input, 401 and 403 for auth problems, 404 Not Found, and 500 for server errors. Using these consistently makes your API predictable to any client.',
              analogy:
                'A REST API is like a well-organised library. The shelves (URLs) hold books (resources); checking out, returning or reshelving are the verbs; and the librarian\'s reply ("found it", "no such book", "you are not a member") are the status codes.',
              keyPoints: [
                'URLs name resources (nouns); verbs express the action.',
                'GET reads, POST creates, PUT replaces, PATCH updates, DELETE removes.',
                'Collections at /things, single items at /things/:id.',
                'Use status codes: 200, 201, 204, 400, 401, 403, 404, 500.',
              ],
              diagram: {
                type: 'mermaid',
                lines: [
                  'flowchart LR',
                  '  Get[GET list] --> Coll[Collection]',
                  '  Post[POST create] --> Coll',
                  '  Put[PUT replace] --> Item[Single item]',
                  '  Del[DELETE remove] --> Item',
                ],
                caption: 'Verbs act on collections and single items to form a RESTful interface.',
              },
              exercises: [
                {
                  type: 'quiz',
                  prompt: 'What status code best fits a successful POST that created a new resource?',
                  solution: { explanation: '201 Created, ideally with a Location header pointing to the new resource.' },
                },
                {
                  type: 'quiz',
                  prompt: 'Why is /articles/:id with DELETE preferred over /deleteArticle/:id with GET?',
                  solution: {
                    explanation:
                      'REST keeps URLs as nouns and uses the verb for intent. DELETE also signals a non-idempotent destructive action that GET should never perform.',
                  },
                },
                {
                  type: 'predict',
                  prompt: 'A client requests an item that does not exist. Which status should the API return?',
                  solution: { explanation: '404 Not Found, so the client knows the resource is absent rather than a server failure.' },
                },
              ],
              docs: 'https://expressjs.com/en/guide/routing.html#route-methods',
            },
            {
              id: 'ex3-t0-c1',
              title: 'Organising routes with Router and route files',
              summary:
                'Group each resource\'s routes in its own Router file and mount them under a base path, keeping the main app file small and clear.',
              explanation:
                'As an API grows past a handful of routes, defining everything in one file becomes a maintenance burden. The standard pattern is one router file per resource: routes/articles.js holds all the article routes on an express.Router(), routes/users.js holds the user routes, and so on. The main app file requires each router and mounts it under a base path, such as app.use(\'/api/articles\', articlesRouter). Inside each router the paths are relative, so router.get(\'/\') is the list and router.get(\'/:id\') is one item. This keeps related code together, makes paths easy to reason about, and lets you attach router-level middleware (like authentication) to an entire resource at once. It is the backbone of a clean Express project layout.',
              keyPoints: [
                'One Router file per resource keeps code grouped.',
                'Mount each router under a base path with app.use.',
                'Router paths are relative to the mount point.',
                'Attach router-level middleware to protect a whole resource.',
              ],
              code: {
                language: 'javascript',
                lines: [
                  '// routes/articles.js',
                  'const router = require(\'express\').Router();',
                  'router.get(\'/\', listArticles);',
                  'router.post(\'/\', createArticle);',
                  'router.get(\'/:id\', getArticle);',
                  'router.delete(\'/:id\', deleteArticle);',
                  'module.exports = router;',
                  '',
                  '// app.js',
                  'app.use(\'/api/articles\', require(\'./routes/articles\'));',
                ],
                explanation:
                  'All article routes live in one router file, mounted under /api/articles so the paths stay relative and tidy.',
              },
              exercises: [
                {
                  type: 'quiz',
                  prompt: 'Where does router.get(\'/:id\') respond if the router is mounted at /api/articles?',
                  solution: { explanation: 'At GET /api/articles/:id — the router path is relative to its mount point.' },
                },
                {
                  type: 'task',
                  prompt: 'Mount a comments router (in ./routes/comments) under /api/comments.',
                  solution: {
                    lines: ['app.use(\'/api/comments\', require(\'./routes/comments\'));'],
                    explanation: 'Requiring and mounting the router file keeps the main app file small and the routes grouped by resource.',
                  },
                },
                {
                  type: 'predict',
                  prompt: 'You add router.use(requireAuth) at the top of the articles router. Which routes are protected?',
                  solution: { explanation: 'Every route in that router (all /api/articles paths), since router-level middleware runs before each of its routes.' },
                },
              ],
              docs: 'https://expressjs.com/en/guide/routing.html#express-router',
            },
            {
              id: 'ex3-t0-c2',
              title: 'Versioning and consistent responses',
              summary:
                'Stable APIs version their routes and return consistent response shapes, so clients can evolve without breaking.',
              explanation:
                'Once an API has clients, its contract must stay stable. A common technique is URL versioning: mount the whole router under a version prefix like /api/v1, so a future /api/v2 can change behaviour while v1 keeps working. Equally important is response consistency — decide on a shape and use it everywhere. Many APIs wrap results in an envelope such as { data, error } or always return resources with the same field names and date formats, and always report errors with the same { error, message } structure and the right status code. Consistency lets clients write one parsing path instead of special-casing each endpoint. Document the contract (often with OpenAPI) so consumers know exactly what to expect. Versioning plus consistent, well-documented responses is what turns a collection of routes into a dependable API.',
              keyPoints: [
                'Version routes (e.g. /api/v1) so the contract can evolve safely.',
                'Return a consistent response shape across all endpoints.',
                'Report errors with a uniform structure and correct status code.',
                'Document the contract, for example with OpenAPI.',
              ],
              code: {
                language: 'javascript',
                lines: [
                  'app.use(\'/api/v1\', require(\'./routes/v1\'));',
                  '',
                  '// consistent success and error shapes',
                  'res.json({ data: user });',
                  'res.status(404).json({ error: \'NOT_FOUND\', message: \'User not found\' });',
                ],
                explanation:
                  'Mounting under /api/v1 isolates the version; success and error responses follow a single predictable shape.',
              },
              exercises: [
                {
                  type: 'quiz',
                  prompt: 'Why mount an API under a version prefix like /api/v1?',
                  solution: {
                    explanation: 'So you can introduce breaking changes under /api/v2 later while existing clients keep using v1 unchanged.',
                  },
                },
                {
                  type: 'task',
                  prompt: 'Mount a v1 router under /api/v1.',
                  solution: {
                    lines: ['app.use(\'/api/v1\', require(\'./routes/v1\'));'],
                    explanation: 'All v1 routes live under the prefix, leaving room for a separate v2 later.',
                  },
                },
                {
                  type: 'predict',
                  prompt: 'Some endpoints return the resource directly and others wrap it in { data }. What pain does that cause clients?',
                  solution: {
                    explanation: 'Clients must special-case each endpoint\'s shape instead of using one parser, making the API error-prone and harder to consume.',
                  },
                },
              ],
              docs: 'https://expressjs.com/en/guide/routing.html',
            },
          ],
        },
        {
          id: 'ex3-t1',
          name: 'Working with data',
          concepts: [
            {
              id: 'ex3-t1-c0',
              title: 'Parsing and validating request bodies',
              summary:
                'Never trust client input. After parsing the body, validate it — checking required fields, types and ranges — before using it.',
              explanation:
                'Once express.json fills req.body, you still must validate it, because clients can send anything. Validation means confirming required fields exist, are the right type, fall within allowed ranges, and match expected formats (like a valid email). You can do this by hand for simple cases, returning a 400 with a helpful message when something is wrong, but for real APIs a schema library such as Joi, Zod, or express-validator is far cleaner and less error-prone. Validate at the edge — in middleware or at the top of the handler — so invalid data never reaches your business logic or database. Good validation also improves security by rejecting malformed or malicious payloads early and returns clear, structured errors that clients can act on.',
              analogy:
                'Validation is the bouncer at the door. Everyone gets checked against the guest list before they are allowed inside; troublemakers are turned away at the entrance, not after they have wrecked the party.',
              keyPoints: [
                'Validate every body field: presence, type, range and format.',
                'Reject invalid input with 400 and a clear message.',
                'Use a schema library (Joi, Zod, express-validator) for real APIs.',
                'Validate at the edge so bad data never reaches your logic.',
              ],
              code: {
                language: 'javascript',
                lines: [
                  'app.post(\'/users\', (req, res) => {',
                  '  const { email, age } = req.body;',
                  '  if (!email || typeof email !== \'string\') {',
                  '    return res.status(400).json({ error: \'email is required\' });',
                  '  }',
                  '  if (age !== undefined && (typeof age !== \'number\' || age < 0)) {',
                  '    return res.status(400).json({ error: \'age must be a non-negative number\' });',
                  '  }',
                  '  res.status(201).json({ email, age });',
                  '});',
                ],
                explanation:
                  'Each field is checked before use; failures return a 400 with a specific message and stop further processing.',
              },
              commonMistakes: [
                'Trusting req.body fields without checking type — e.g. assuming age is a number.',
                'Validating after the database write instead of before, so bad data is already persisted.',
              ],
              exercises: [
                {
                  type: 'quiz',
                  prompt: 'What status code should an API return when request-body validation fails?',
                  solution: { explanation: '400 Bad Request, ideally with a message describing which field was invalid.' },
                },
                {
                  type: 'task',
                  prompt: 'Reject the request with 400 if req.body.name is missing.',
                  solution: {
                    lines: ['if (!req.body.name) return res.status(400).json({ error: \'name is required\' });'],
                    explanation: 'A guard at the top of the handler rejects invalid input before any further processing.',
                  },
                },
                {
                  type: 'predict',
                  prompt: 'Why is validating with a schema library often safer than manual if-checks?',
                  solution: {
                    explanation: 'A schema declares the whole shape in one place, covers types/formats/ranges consistently, and is harder to forget a field in than scattered manual checks.',
                  },
                },
              ],
              docs: 'https://expressjs.com/en/resources/middleware/cors.html',
            },
            {
              id: 'ex3-t1-c1',
              title: 'Async route handlers and awaiting',
              summary:
                'Database and network calls are asynchronous, so handlers become async functions that await. You must forward any rejected promise to the error handler.',
              explanation:
                'Real handlers talk to databases and external services, which are asynchronous, so you write them as async functions and await the calls. The catch is that Express 4 does not automatically catch rejected promises: if an awaited call throws and you do not handle it, the request hangs because next(err) is never called. The classic fix is a try/catch in each handler that forwards the error with next(err). To avoid repeating that everywhere, teams wrap handlers in an asyncHandler helper that catches rejections and calls next, or they use the express-async-errors package. Express 5 improves this by automatically forwarding rejected promises from async handlers to the error handler, removing much of the boilerplate. Either way, the rule is: a rejected promise in a handler must reach your error-handling middleware.',
              keyPoints: [
                'Handlers that hit a database are async and use await.',
                'In Express 4, unhandled promise rejections do not reach the error handler.',
                'Wrap handlers in try/catch or an asyncHandler helper, or use express-async-errors.',
                'Express 5 auto-forwards rejected promises to the error handler.',
              ],
              code: {
                language: 'javascript',
                lines: [
                  '// asyncHandler wraps a handler and forwards rejections',
                  'const asyncHandler = (fn) => (req, res, next) =>',
                  '  Promise.resolve(fn(req, res, next)).catch(next);',
                  '',
                  'app.get(\'/users/:id\', asyncHandler(async (req, res) => {',
                  '  const user = await db.findUser(req.params.id);',
                  '  if (!user) return res.status(404).json({ error: \'Not found\' });',
                  '  res.json(user);',
                  '}));',
                ],
                explanation:
                  'asyncHandler runs the async function and routes any rejection to next, so errors reach the error-handling middleware.',
              },
              commonMistakes: [
                'Using async handlers in Express 4 without try/catch or a wrapper, so rejections silently hang the request.',
                'Forgetting to await a database call, so the handler responds before the data arrives.',
              ],
              exercises: [
                {
                  type: 'quiz',
                  prompt: 'In Express 4, what happens if an async handler\'s awaited call rejects and you do nothing?',
                  hint: 'Think about who calls next(err).',
                  solution: {
                    explanation: 'The rejection is not caught, next(err) is never called, and the request hangs until it times out.',
                  },
                },
                {
                  type: 'task',
                  prompt: 'Wrap an async handler so any thrown error is forwarded to next.',
                  solution: {
                    lines: [
                      'const asyncHandler = (fn) => (req, res, next) =>',
                      '  Promise.resolve(fn(req, res, next)).catch(next);',
                    ],
                    explanation: 'Promise.resolve(...).catch(next) ensures both sync throws and rejected promises reach the error handler.',
                  },
                },
                {
                  type: 'predict',
                  prompt: 'A handler does const user = db.findUser(id) without await, then res.json(user). What is sent?',
                  solution: {
                    explanation: 'A pending Promise is serialised, not the user data, because the result was not awaited. The response is sent before the query resolves.',
                  },
                },
              ],
              docs: 'https://expressjs.com/en/guide/error-handling.html#catching-errors',
            },
            {
              id: 'ex3-t1-c2',
              title: 'Connecting to a database',
              summary:
                'Express is database-agnostic. You connect once at startup using a driver or ORM, then call it from your handlers, usually through a data layer.',
              explanation:
                'Express does not include a database; you pick one and its Node client. Common choices are the official drivers (like pg for PostgreSQL or the MongoDB driver) or higher-level libraries such as Mongoose for MongoDB and Prisma or Sequelize for SQL. You establish the connection or pool once when the app boots, not per request, so connections are reused efficiently. Configuration like the connection string comes from environment variables, never hard-coded. Handlers then perform queries through that client, ideally via a separate data-access or model layer rather than writing raw queries inline, which keeps routes thin and makes the data logic testable and swappable. Always handle the case where a query returns nothing and convert database errors into appropriate HTTP responses.',
              keyPoints: [
                'Express is database-agnostic — choose a driver or ORM.',
                'Connect or create a pool once at startup and reuse it.',
                'Read the connection string from environment variables.',
                'Query through a data layer to keep handlers thin and testable.',
              ],
              code: {
                language: 'javascript',
                lines: [
                  'const { Pool } = require(\'pg\');',
                  'const pool = new Pool({ connectionString: process.env.DATABASE_URL });',
                  '',
                  'app.get(\'/products\', asyncHandler(async (req, res) => {',
                  '  const result = await pool.query(\'SELECT * FROM products\');',
                  '  res.json(result.rows);',
                  '}));',
                ],
                explanation:
                  'A single pool is created at startup from an env var; handlers borrow connections from it for each query.',
              },
              commonMistakes: [
                'Opening a new connection on every request instead of reusing a pool.',
                'Hard-coding credentials in the source instead of reading them from environment variables.',
              ],
              exercises: [
                {
                  type: 'quiz',
                  prompt: 'Why create a connection pool once at startup rather than per request?',
                  solution: {
                    explanation: 'Opening connections is expensive; a pool reuses a managed set of connections across requests, improving performance and avoiding exhaustion.',
                  },
                },
                {
                  type: 'task',
                  prompt: 'Read a Mongo connection string from an environment variable into a constant.',
                  solution: {
                    lines: ['const uri = process.env.MONGODB_URI;'],
                    explanation: 'Configuration like connection strings belongs in environment variables, kept out of source control.',
                  },
                },
                {
                  type: 'predict',
                  prompt: 'A query for one user by id returns no rows but the handler does res.json(rows[0]). What is sent?',
                  solution: {
                    explanation: 'undefined (serialised as nothing), instead of a proper 404. Always check for empty results and respond with 404.',
                  },
                },
              ],
              docs: 'https://expressjs.com/en/guide/database-integration.html',
            },
          ],
        },
        {
          id: 'ex3-t2',
          name: 'Structuring an application',
          concepts: [
            {
              id: 'ex3-t2-c0',
              title: 'Controllers and services',
              summary:
                'Split responsibilities: routers map URLs, controllers handle the HTTP request and response, and services hold business logic and data access.',
              explanation:
                'A maintainable Express app separates concerns into layers. The router only maps paths and verbs to controller functions. A controller is the glue for one endpoint: it reads input from req, calls into the service layer, and shapes the res. The service layer holds the actual business logic and talks to the database, with no knowledge of req or res. This separation means your core logic is plain functions you can unit-test without spinning up HTTP, and you can reuse a service from multiple controllers or from a background job. Keeping controllers thin — input in, service call, response out — is the hallmark of a clean Express codebase. The opposite, fat handlers that mix validation, business rules and SQL in one function, becomes very hard to test and change.',
              analogy:
                'Think of a restaurant: the menu (router) lists dishes, the waiter (controller) takes the order and brings the plate, and the kitchen (service) actually cooks. The kitchen never speaks to the customer directly.',
              keyPoints: [
                'Router maps URLs; controller handles req/res; service holds logic.',
                'Services know nothing about HTTP, so they are easy to unit-test.',
                'Thin controllers: read input, call service, send response.',
                'Reuse services across controllers and background jobs.',
              ],
              diagram: {
                type: 'mermaid',
                lines: [
                  'flowchart LR',
                  '  Router[Router] --> Controller[Controller]',
                  '  Controller --> Service[Service]',
                  '  Service --> DB[(Database)]',
                ],
                caption: 'Each layer has one job: routing, HTTP handling, business logic, persistence.',
              },
              code: {
                language: 'javascript',
                lines: [
                  '// user.service.js — no req/res here',
                  'async function getUser(id) {',
                  '  return db.findUser(id);',
                  '}',
                  '',
                  '// user.controller.js',
                  'async function show(req, res) {',
                  '  const user = await getUser(req.params.id);',
                  '  if (!user) return res.status(404).json({ error: \'Not found\' });',
                  '  res.json(user);',
                  '}',
                ],
                explanation:
                  'The service is pure logic; the controller adapts it to HTTP. The service can be tested without any Express machinery.',
              },
              exercises: [
                {
                  type: 'quiz',
                  prompt: 'Which layer should never reference req or res, and why?',
                  solution: {
                    explanation: 'The service layer — keeping it HTTP-agnostic makes the business logic reusable and unit-testable without an HTTP server.',
                  },
                },
                {
                  type: 'task',
                  prompt: 'Write a thin controller that calls a getProducts() service and returns the result as JSON.',
                  solution: {
                    lines: [
                      'async function list(req, res) {',
                      '  const products = await getProducts();',
                      '  res.json(products);',
                      '}',
                    ],
                    explanation: 'The controller only adapts the service output to an HTTP response, keeping the logic in the service.',
                  },
                },
                {
                  type: 'predict',
                  prompt: 'What problems appear when validation, business rules and SQL are all crammed into one route handler?',
                  solution: {
                    explanation: 'It becomes hard to test (HTTP required), hard to reuse, and hard to change without risking unrelated behaviour. Separation avoids this.',
                  },
                },
              ],
              docs: 'https://expressjs.com/en/guide/routing.html#route-handlers',
            },
            {
              id: 'ex3-t2-c1',
              title: 'Configuration and environment variables',
              summary:
                'Keep configuration out of code. Read settings like ports, secrets and connection strings from environment variables, often loaded with dotenv in development.',
              explanation:
                'The twelve-factor principle of storing config in the environment applies squarely to Express. Anything that varies between environments — the port, database URL, API keys, secrets, log level — should come from process.env rather than being hard-coded, so the same image runs in dev, staging and production with different values. In development the dotenv package loads a .env file into process.env, but that file must never be committed; you commit a .env.example documenting the keys instead. It is good practice to validate required variables at startup and fail fast with a clear message if one is missing, rather than discovering it mid-request. Centralising this in one config module that reads and validates env vars keeps the rest of the code clean.',
              keyPoints: [
                'Store config (port, URLs, secrets) in environment variables.',
                'Use dotenv to load a .env file in development; never commit it.',
                'Commit a .env.example documenting required keys.',
                'Validate required vars at startup and fail fast if missing.',
              ],
              code: {
                language: 'javascript',
                lines: [
                  'require(\'dotenv\').config();',
                  '',
                  'const config = {',
                  '  port: process.env.PORT || 3000,',
                  '  databaseUrl: process.env.DATABASE_URL,',
                  '  jwtSecret: process.env.JWT_SECRET,',
                  '};',
                  '',
                  'if (!config.databaseUrl) throw new Error(\'DATABASE_URL is required\');',
                  'module.exports = config;',
                ],
                explanation:
                  'dotenv loads .env into process.env; a config module reads and validates the values, failing fast if a required one is missing.',
              },
              commonMistakes: [
                'Committing a .env file with real secrets to version control.',
                'Discovering a missing variable only when a request fails, instead of validating at startup.',
              ],
              exercises: [
                {
                  type: 'quiz',
                  prompt: 'Why should secrets live in environment variables instead of the source code?',
                  solution: {
                    explanation: 'So the same code runs across environments with different values and secrets are not exposed in version control.',
                  },
                },
                {
                  type: 'task',
                  prompt: 'Read a PORT from the environment, defaulting to 3000.',
                  solution: {
                    lines: ['const port = process.env.PORT || 3000;'],
                    explanation: 'process.env values are strings or undefined; the || provides a sensible default when unset.',
                  },
                },
                {
                  type: 'predict',
                  prompt: 'JWT_SECRET is undefined in production but the app uses it to sign tokens. What is the risk?',
                  solution: {
                    explanation: 'Signing with undefined either throws or produces insecure tokens. Validating required env vars at startup catches this before serving traffic.',
                  },
                },
              ],
              docs: 'https://expressjs.com/en/advanced/best-practice-performance.html',
            },
          ],
        },
      ],
    },
    /* ───────────────────── LEVEL 4 — AUTH, VIEWS AND UPLOADS ───────────────────── */
    {
      level: 4,
      name: 'Auth, views and uploads',
      focus: 'Authentication and sessions, templating and static assets, and handling forms, uploads and cookies',
      accent: '#1f2937',
      soft: '#eef1f5',
      topics: [
        {
          id: 'ex4-t0',
          name: 'Authentication and sessions',
          concepts: [
            {
              id: 'ex4-t0-c0',
              title: 'Sessions versus JWT',
              summary:
                'Two common approaches to remembering a logged-in user: server-side sessions backed by a cookie, or stateless JSON Web Tokens carried by the client.',
              explanation:
                'HTTP is stateless, so after a user logs in you need a way to recognise them on the next request. With session-based auth, the server stores session data (often in memory, Redis, or a database) and sends the client a cookie containing only an opaque session id; each request returns that cookie, and the server looks up the session. With token-based auth, the server signs a JSON Web Token containing the user\'s identity and sends it to the client, which stores it and sends it back (usually in an Authorization header); the server verifies the signature without any server-side storage. Sessions are easy to revoke and keep secrets on the server but require shared session storage to scale horizontally. JWTs are stateless and scale trivially but are harder to revoke before they expire. Many apps combine them — a short-lived JWT plus a server-stored refresh token.',
              analogy:
                'A session cookie is a coat-check ticket: the venue keeps your coat and the ticket is just a number. A JWT is a sealed festival wristband: it carries your access rights itself, and any guard can verify the seal without phoning the office.',
              keyPoints: [
                'Sessions store state on the server; the cookie holds only a session id.',
                'JWTs are stateless: the signed token itself carries the identity.',
                'Sessions are easy to revoke but need shared storage to scale.',
                'JWTs scale easily but are hard to revoke before expiry.',
              ],
              diagram: {
                type: 'mermaid',
                lines: [
                  'flowchart LR',
                  '  Login[Login] --> Server[Server]',
                  '  Server -->|session id cookie| SessionStore[Session store]',
                  '  Server -->|signed token| Client[Client holds JWT]',
                ],
                caption: 'Sessions keep state server-side behind a cookie id; JWTs hand a signed token to the client.',
              },
              exercises: [
                {
                  type: 'quiz',
                  prompt: 'What does the cookie contain in a server-side session scheme?',
                  solution: { explanation: 'Only an opaque session id; the actual session data is stored on the server and looked up by that id.' },
                },
                {
                  type: 'quiz',
                  prompt: 'Why are JWTs harder to revoke than sessions?',
                  solution: {
                    explanation: 'They are stateless and self-contained, so until the token expires the server has no record to delete; revocation needs an extra blocklist or short lifetimes.',
                  },
                },
                {
                  type: 'predict',
                  prompt: 'You scale to three Express instances behind a load balancer using in-memory sessions. What breaks?',
                  solution: {
                    explanation: 'A user\'s session lives on only one instance, so requests routed to another instance appear logged out. Use a shared store like Redis.',
                  },
                },
              ],
              docs: 'https://expressjs.com/en/resources/middleware/session.html',
            },
            {
              id: 'ex4-t0-c1',
              title: 'Cookies and an overview of Passport',
              summary:
                'Cookies carry the session id or token between requests. Passport is a flexible authentication middleware with strategies for many login methods.',
              explanation:
                'Cookies are small key-value pairs the server sets via the Set-Cookie header and the browser returns on every subsequent request, which is how a session id travels back and forth automatically. For auth cookies you set important flags: httpOnly so JavaScript cannot read them (defends against XSS theft), secure so they are only sent over HTTPS, and sameSite to limit cross-site sending (defends against CSRF). Building all the login flows by hand is tedious, so Passport is the de facto middleware: it defines pluggable strategies — passport-local for username and password, passport-jwt for tokens, and dozens of OAuth strategies for Google, GitHub and so on. You configure a strategy, call passport.authenticate(...) as middleware on login routes, and Passport handles verifying credentials and attaching req.user. It is unopinionated about sessions versus tokens, so it fits either model.',
              keyPoints: [
                'Cookies carry the session id or token automatically on each request.',
                'Set httpOnly, secure and sameSite flags on auth cookies.',
                'Passport provides pluggable strategies for many login methods.',
                'passport.authenticate is middleware that verifies and attaches req.user.',
              ],
              code: {
                language: 'javascript',
                lines: [
                  'res.cookie(\'sid\', sessionId, {',
                  '  httpOnly: true,',
                  '  secure: true,',
                  '  sameSite: \'lax\',',
                  '  maxAge: 1000 * 60 * 60,',
                  '});',
                  '',
                  '// Passport on a login route',
                  'app.post(\'/login\', passport.authenticate(\'local\'), (req, res) => {',
                  '  res.json({ user: req.user });',
                  '});',
                ],
                explanation:
                  'The cookie is hardened with security flags; passport.authenticate(\'local\') verifies credentials and sets req.user before the handler runs.',
              },
              commonMistakes: [
                'Omitting httpOnly, letting client-side scripts read the auth cookie.',
                'Setting secure: true in development over plain HTTP, so the cookie is never sent.',
              ],
              exercises: [
                {
                  type: 'quiz',
                  prompt: 'Which cookie flag prevents client-side JavaScript from reading the cookie?',
                  hint: 'It mitigates XSS token theft.',
                  solution: { explanation: 'httpOnly — the cookie is sent with requests but is invisible to document.cookie in the browser.' },
                },
                {
                  type: 'task',
                  prompt: 'Set a cookie named token with httpOnly and secure flags.',
                  solution: {
                    lines: ['res.cookie(\'token\', value, { httpOnly: true, secure: true });'],
                    explanation: 'httpOnly hides it from scripts and secure restricts it to HTTPS connections.',
                  },
                },
                {
                  type: 'predict',
                  prompt: 'A login route uses passport.authenticate(\'local\') and succeeds. What is available in the handler afterwards?',
                  solution: { explanation: 'req.user, populated by Passport with the authenticated user, so the handler can respond with their details.' },
                },
              ],
              docs: 'https://expressjs.com/en/resources/middleware/cookie-parser.html',
            },
            {
              id: 'ex4-t0-c2',
              title: 'Protecting routes with middleware',
              summary:
                'Guard private routes with authentication middleware that checks for a valid session or token and rejects unauthenticated requests with 401.',
              explanation:
                'Authorisation is naturally expressed as middleware. You write a function like requireAuth that inspects the request — checking for a valid session, or verifying a JWT from the Authorization header — and either attaches the user to req and calls next(), or responds 401 Unauthorized and stops. You then place this middleware before any protected route or apply it to a whole router so every route under it is guarded. Distinguish authentication (who are you) from authorisation (are you allowed); a second middleware can check roles or ownership and return 403 Forbidden when the user is known but not permitted. Because guards are just middleware, you compose them: requireAuth then requireAdmin. Keeping this logic in dedicated middleware keeps handlers focused on their actual job and ensures protection is applied consistently.',
              keyPoints: [
                'Auth checks are middleware that either call next() or respond 401.',
                'Apply the guard per route or to a whole router.',
                '401 means not authenticated; 403 means authenticated but not allowed.',
                'Compose guards: authentication first, then role or ownership checks.',
              ],
              code: {
                language: 'javascript',
                lines: [
                  'function requireAuth(req, res, next) {',
                  '  const token = (req.get(\'authorization\') || \'\').replace(\'Bearer \', \'\');',
                  '  try {',
                  '    req.user = jwt.verify(token, process.env.JWT_SECRET);',
                  '    next();',
                  '  } catch {',
                  '    res.status(401).json({ error: \'Unauthorized\' });',
                  '  }',
                  '}',
                  '',
                  'app.get(\'/me\', requireAuth, (req, res) => res.json(req.user));',
                ],
                explanation:
                  'requireAuth verifies the token, attaches req.user and continues, or rejects with 401 if verification fails.',
              },
              commonMistakes: [
                'Returning 403 for an unauthenticated user when 401 is correct (no valid credentials).',
                'Forgetting to return/stop after sending 401, so the handler still runs.',
              ],
              exercises: [
                {
                  type: 'quiz',
                  prompt: 'What is the difference between a 401 and a 403 response?',
                  solution: {
                    explanation: '401 Unauthorized means the request lacks valid authentication; 403 Forbidden means the user is authenticated but not permitted to do this.',
                  },
                },
                {
                  type: 'task',
                  prompt: 'Apply requireAuth to every route in an admin router.',
                  solution: {
                    lines: ['adminRouter.use(requireAuth);'],
                    explanation: 'router-level middleware runs before each route in the router, guarding the entire resource at once.',
                  },
                },
                {
                  type: 'predict',
                  prompt: 'requireAuth sends res.status(401)... but forgets to return, then calls next(). What goes wrong?',
                  solution: {
                    explanation: 'After responding it still proceeds to the protected handler, which tries to send again and triggers a headers-sent error. Return after responding.',
                  },
                },
              ],
              docs: 'https://expressjs.com/en/guide/using-middleware.html#middleware.router',
            },
          ],
        },
        {
          id: 'ex4-t1',
          name: 'Templating and static assets',
          concepts: [
            {
              id: 'ex4-t1-c0',
              title: 'View engines and res.render',
              summary:
                'For server-rendered HTML, register a view engine like EJS or Pug, set the views folder, and call res.render to produce a page from a template and data.',
              explanation:
                'Not every Express app is a JSON API; some render HTML on the server. A view engine turns a template plus data into an HTML string. You install an engine such as EJS or Pug, tell Express which to use with app.set(\'view engine\', \'ejs\'), and where templates live with app.set(\'views\', ...). In a handler, res.render(\'profile\', { user }) finds views/profile.ejs, injects the user object, and sends the resulting HTML. Templates support loops, conditionals and partials so you can compose shared layout fragments. EJS uses HTML with embedded JavaScript tags, while Pug uses a terse indentation-based syntax; both are widely used. Server rendering is great for content sites and traditional multi-page apps, and the same Express app can mix rendered pages with JSON endpoints.',
              analogy:
                'A view engine is a mail-merge machine: you feed it a template letter with blanks and a list of names, and it stamps out a personalised letter for each.',
              keyPoints: [
                'app.set(\'view engine\', \'ejs\') registers the engine.',
                'app.set(\'views\', folder) sets where templates live.',
                'res.render(template, data) produces and sends HTML.',
                'Templates support loops, conditionals and reusable partials.',
              ],
              code: {
                language: 'javascript',
                lines: [
                  'app.set(\'view engine\', \'ejs\');',
                  'app.set(\'views\', \'./views\');',
                  '',
                  'app.get(\'/profile\', (req, res) => {',
                  '  res.render(\'profile\', { user: { name: \'Ada\' } });',
                  '});',
                ],
                explanation:
                  'Express renders views/profile.ejs with the supplied data object and sends the generated HTML to the client.',
              },
              exercises: [
                {
                  type: 'quiz',
                  prompt: 'Which method renders a template with data and sends the resulting HTML?',
                  solution: { explanation: 'res.render(templateName, dataObject), using the configured view engine and views folder.' },
                },
                {
                  type: 'task',
                  prompt: 'Configure Pug as the view engine.',
                  solution: {
                    lines: ['app.set(\'view engine\', \'pug\');'],
                    explanation: 'After installing pug, this tells Express to use it for files rendered with res.render.',
                  },
                },
                {
                  type: 'predict',
                  prompt: 'You call res.render(\'home\') but no view engine has been set. What happens?',
                  solution: {
                    explanation: 'Express cannot determine how to compile the template and throws an error rather than sending a page.',
                  },
                },
              ],
              docs: 'https://expressjs.com/en/guide/using-template-engines.html',
            },
            {
              id: 'ex4-t1-c1',
              title: 'Serving static assets alongside views',
              summary:
                'Server-rendered pages reference CSS, scripts and images served by express.static, keeping dynamic HTML and static files cleanly separated.',
              explanation:
                'A rendered page is only HTML; its stylesheets, client scripts, images and fonts are static files. You serve those with express.static pointed at a public folder, so the HTML can link to /css/style.css and /js/app.js and the browser fetches them directly. Keep templates in the views folder and static assets in a separate public folder so responsibilities stay clear: views are compiled per request, static files are streamed as-is with caching headers. Reference assets with absolute paths from the static root so they resolve regardless of the current page URL. In larger apps you may add a build step that bundles and fingerprints assets, but the serving mechanism in Express is still express.static. This combination — render the HTML, serve the assets — is the classic server-rendered Express setup.',
              keyPoints: [
                'Static assets (CSS, JS, images) are served by express.static.',
                'Keep views and public assets in separate folders.',
                'Reference assets with absolute paths from the static root.',
                'Views are compiled per request; static files stream with caching.',
              ],
              code: {
                language: 'javascript',
                lines: [
                  'app.set(\'view engine\', \'ejs\');',
                  'app.use(express.static(\'public\'));',
                  '',
                  '// in views/layout.ejs:',
                  '// <link rel="stylesheet" href="/css/style.css">',
                ],
                explanation:
                  'The rendered HTML links to /css/style.css, which express.static serves from public/css/style.css.',
              },
              commonMistakes: [
                'Putting CSS inside the views folder, where express.static will not serve it.',
                'Linking assets with relative paths that break on nested routes; use absolute paths from the static root.',
              ],
              exercises: [
                {
                  type: 'quiz',
                  prompt: 'Where should the CSS and client JavaScript for a rendered page live?',
                  solution: { explanation: 'In the public (static) folder served by express.static, separate from the views folder that holds templates.' },
                },
                {
                  type: 'task',
                  prompt: 'Serve a public folder so /css/style.css resolves.',
                  solution: {
                    lines: ['app.use(express.static(\'public\'));'],
                    explanation: 'A request for /css/style.css then maps to public/css/style.css.',
                  },
                },
                {
                  type: 'predict',
                  prompt: 'A page at /users/42 links its stylesheet as href="css/style.css". Why might it 404?',
                  solution: {
                    explanation: 'The relative path resolves to /users/css/style.css. Use an absolute path /css/style.css so it always resolves from the root.',
                  },
                },
              ],
              docs: 'https://expressjs.com/en/starter/static-files.html',
            },
            {
              id: 'ex4-t1-c2',
              title: 'Layouts, partials and passing data to views',
              summary:
                'Templates reuse shared fragments through partials and layouts, and receive page-specific data from the object passed to res.render.',
              explanation:
                'Real sites share a header, navigation and footer across pages, so view engines support composition. Partials are reusable fragments you include into a page (for example a _header partial pulled into many templates), while a layout is an outer shell that wraps each page\'s unique content. The exact mechanism varies — Pug has extends and block, EJS commonly uses includes or the express-ejs-layouts package — but the goal is the same: write shared markup once. Data flows in through the object you pass to res.render, whose keys become variables available inside the template, so res.render(\'page\', { title, items }) exposes title and items. You can also set app.locals for values available to every view (like the site name) and res.locals for per-request values (like the current user) set in middleware. Together these keep templates DRY and data-driven.',
              keyPoints: [
                'Partials and layouts let templates share common markup.',
                'res.render data keys become variables inside the template.',
                'app.locals holds values available to every view.',
                'res.locals holds per-request values, often set in middleware.',
              ],
              code: {
                language: 'javascript',
                lines: [
                  'app.locals.siteName = \'My Site\';',
                  '',
                  'app.use((req, res, next) => {',
                  '  res.locals.currentUser = req.user;',
                  '  next();',
                  '});',
                  '',
                  'app.get(\'/\', (req, res) => res.render(\'home\', { title: \'Home\' }));',
                ],
                explanation:
                  'siteName is global to all views, currentUser is set per request, and title is passed to the specific home template.',
              },
              exercises: [
                {
                  type: 'quiz',
                  prompt: 'How does data passed to res.render become usable inside a template?',
                  solution: { explanation: 'The keys of the data object become variables of the same name available within the template.' },
                },
                {
                  type: 'task',
                  prompt: 'Make currentUser available to every view for each request.',
                  solution: {
                    lines: [
                      'app.use((req, res, next) => {',
                      '  res.locals.currentUser = req.user;',
                      '  next();',
                      '});',
                    ],
                    explanation: 'res.locals is merged into every res.render of that request, so all views can read currentUser.',
                  },
                },
                {
                  type: 'predict',
                  prompt: 'What is the difference between app.locals and res.locals?',
                  solution: {
                    explanation: 'app.locals is shared across all requests (app-wide constants); res.locals is scoped to a single request, ideal for per-request data like the logged-in user.',
                  },
                },
              ],
              docs: 'https://expressjs.com/en/4x/api.html#app.locals',
            },
          ],
        },
        {
          id: 'ex4-t2',
          name: 'Forms, file uploads and cookies',
          concepts: [
            {
              id: 'ex4-t2-c0',
              title: 'Handling form submissions',
              summary:
                'HTML forms POST URL-encoded data; parse it with express.urlencoded, then validate and process the fields in your handler.',
              explanation:
                'A traditional HTML form with method="post" submits its fields as application/x-www-form-urlencoded. To read them you register express.urlencoded({ extended: true }), after which the fields appear on req.body keyed by the input name attributes. Your handler then validates the input (the same rules as any other body) and acts on it — creating a record, logging the user in, and so on. The common pattern after a successful POST is the Post-Redirect-Get idiom: respond with a redirect to a GET page rather than rendering directly, so refreshing the result page does not resubmit the form. For multi-value fields like checkboxes, a field may arrive as an array. Forms that upload files need a different encoding, multipart/form-data, which urlencoded cannot parse and which the next concept covers.',
              keyPoints: [
                'HTML forms post as application/x-www-form-urlencoded.',
                'express.urlencoded fills req.body with the form fields by input name.',
                'Use Post-Redirect-Get to avoid resubmission on refresh.',
                'File uploads use multipart/form-data, not urlencoded.',
              ],
              code: {
                language: 'javascript',
                lines: [
                  'app.use(express.urlencoded({ extended: true }));',
                  '',
                  'app.post(\'/contact\', (req, res) => {',
                  '  const { name, message } = req.body;',
                  '  if (!name || !message) return res.status(400).send(\'Missing fields\');',
                  '  saveMessage(name, message);',
                  '  res.redirect(\'/thanks\');',
                  '});',
                ],
                explanation:
                  'urlencoded parses the form into req.body; after validating and saving, the handler redirects to a GET page (Post-Redirect-Get).',
              },
              commonMistakes: [
                'Trying to read form fields without express.urlencoded registered.',
                'Rendering the result directly after a POST, so a refresh resubmits the form.',
              ],
              exercises: [
                {
                  type: 'quiz',
                  prompt: 'What content type does a standard HTML form (without file inputs) submit, and which middleware parses it?',
                  solution: { explanation: 'application/x-www-form-urlencoded, parsed by express.urlencoded().' },
                },
                {
                  type: 'task',
                  prompt: 'After saving a form, redirect to /success instead of rendering directly.',
                  solution: {
                    lines: ['res.redirect(\'/success\');'],
                    explanation: 'Post-Redirect-Get sends the browser to a GET page so refreshing it does not resubmit the form.',
                  },
                },
                {
                  type: 'predict',
                  prompt: 'A form has a file input but the server uses only express.urlencoded. What happens to req.body and the file?',
                  solution: {
                    explanation: 'The body is multipart/form-data, which urlencoded cannot parse, so req.body is empty and the file is not available. You need multer.',
                  },
                },
              ],
              docs: 'https://expressjs.com/en/4x/api.html#express.urlencoded',
            },
            {
              id: 'ex4-t2-c1',
              title: 'File uploads with multer',
              summary:
                'multer is middleware for multipart/form-data that parses uploaded files, exposing them on req.file or req.files and the text fields on req.body.',
              explanation:
                'File uploads arrive as multipart/form-data, which the built-in parsers do not handle. multer is the standard middleware for it. You configure storage — diskStorage to write files to a folder, or memoryStorage to keep them as a buffer — then add multer middleware to the upload route. upload.single(\'avatar\') handles one file from the field named avatar and puts its metadata on req.file; upload.array(\'photos\') handles many on req.files. Text fields submitted alongside still appear on req.body. Crucially you should constrain uploads: set fileSize limits, filter by mimetype with fileFilter, and never trust the original filename — generate your own to avoid path traversal and collisions. For real apps, files often go to object storage like S3 rather than local disk, but multer still does the parsing.',
              analogy:
                'multer is the parcel-sorting room: it opens the mixed package (text plus files), files the documents in req.body and sets the parcels aside in req.file for you to store.',
              keyPoints: [
                'multer parses multipart/form-data uploads.',
                'upload.single sets req.file; upload.array sets req.files.',
                'Text fields still land on req.body.',
                'Limit file size and type, and generate safe filenames.',
              ],
              code: {
                language: 'javascript',
                lines: [
                  'const multer = require(\'multer\');',
                  'const upload = multer({',
                  '  dest: \'uploads/\',',
                  '  limits: { fileSize: 2 * 1024 * 1024 },',
                  '});',
                  '',
                  'app.post(\'/avatar\', upload.single(\'avatar\'), (req, res) => {',
                  '  res.json({ saved: req.file.filename });',
                  '});',
                ],
                explanation:
                  'upload.single parses the avatar field, enforces a 2MB limit, writes the file to uploads/, and exposes it on req.file.',
              },
              commonMistakes: [
                'Saving files under the client-supplied original name, enabling path traversal or overwrites.',
                'Allowing unlimited file sizes or any mimetype, opening the door to abuse.',
              ],
              exercises: [
                {
                  type: 'quiz',
                  prompt: 'After upload.single(\'avatar\'), where is the uploaded file\'s metadata available?',
                  solution: { explanation: 'On req.file. (upload.array would populate req.file s as req.files.)' },
                },
                {
                  type: 'task',
                  prompt: 'Limit multer uploads to 5 megabytes.',
                  solution: {
                    lines: ['const upload = multer({ limits: { fileSize: 5 * 1024 * 1024 } });'],
                    explanation: 'The limits.fileSize option rejects files larger than the specified number of bytes.',
                  },
                },
                {
                  type: 'predict',
                  prompt: 'Why is storing an upload under req.file.originalname directly a security risk?',
                  solution: {
                    explanation: 'The client controls that name; values like ../../etc/file enable path traversal, and duplicates overwrite each other. Generate a safe unique name instead.',
                  },
                },
              ],
              docs: 'https://expressjs.com/en/resources/middleware/multer.html',
            },
            {
              id: 'ex4-t2-c2',
              title: 'Reading and setting cookies',
              summary:
                'res.cookie sets a cookie and res.clearCookie removes it; cookie-parser populates req.cookies so you can read what the client sent back.',
              explanation:
                'Cookies are how small bits of state travel with each request. To set one you call res.cookie(name, value, options), where options include the security flags and expiry (maxAge or expires). To read cookies the client returns, install the cookie-parser middleware, which populates req.cookies with a parsed object; without it you would have to parse the raw Cookie header yourself. To remove a cookie you call res.clearCookie(name) with the same path and domain it was set with. For values that must not be tampered with you can sign cookies (cookie-parser supports a secret), which detects modification, though it does not encrypt the contents. Cookies are ideal for session ids and small preferences, but keep them small and never store sensitive data in plain readable cookies.',
              keyPoints: [
                'res.cookie(name, value, options) sets a cookie with flags and expiry.',
                'cookie-parser populates req.cookies for reading.',
                'res.clearCookie(name) removes a cookie.',
                'Signed cookies detect tampering but do not encrypt the value.',
              ],
              code: {
                language: 'javascript',
                lines: [
                  'const cookieParser = require(\'cookie-parser\');',
                  'app.use(cookieParser());',
                  '',
                  'app.get(\'/set\', (req, res) => {',
                  '  res.cookie(\'theme\', \'dark\', { maxAge: 86400000, httpOnly: true });',
                  '  res.send(\'cookie set\');',
                  '});',
                  '',
                  'app.get(\'/read\', (req, res) => {',
                  '  res.send(\'theme is \' + req.cookies.theme);',
                  '});',
                ],
                explanation:
                  'res.cookie sets a one-day theme cookie; cookie-parser makes the returned value readable via req.cookies.theme.',
              },
              commonMistakes: [
                'Reading req.cookies without registering cookie-parser, so it is undefined.',
                'Calling res.clearCookie with different options than it was set with, so it is not removed.',
              ],
              exercises: [
                {
                  type: 'quiz',
                  prompt: 'Which middleware do you need to read incoming cookies via req.cookies?',
                  solution: { explanation: 'cookie-parser — it parses the Cookie header into the req.cookies object.' },
                },
                {
                  type: 'task',
                  prompt: 'Set a cookie named lang to en that expires in one hour.',
                  solution: {
                    lines: ['res.cookie(\'lang\', \'en\', { maxAge: 3600000 });'],
                    explanation: 'maxAge is in milliseconds, so 3600000 is one hour.',
                  },
                },
                {
                  type: 'predict',
                  prompt: 'Does signing a cookie hide its contents from the user?',
                  solution: {
                    explanation: 'No. Signing only detects tampering; the value is still readable. Use a server-side session or encryption if the contents must be secret.',
                  },
                },
              ],
              docs: 'https://expressjs.com/en/resources/middleware/cookie-parser.html',
            },
          ],
        },
      ],
    },
    /* ───────────────────── LEVEL 5 — PRODUCTION EXPRESS ───────────────────── */
    {
      level: 5,
      name: 'Production Express',
      focus: 'Security, performance and reliability, and testing and deployment',
      accent: '#1f2937',
      soft: '#eef1f5',
      topics: [
        {
          id: 'ex5-t0',
          name: 'Security',
          concepts: [
            {
              id: 'ex5-t0-c0',
              title: 'Hardening with helmet and CORS configuration',
              summary:
                'helmet sets protective HTTP headers in one line; CORS should be configured to allow only the origins you trust rather than everything.',
              explanation:
                'Production Express apps need defence in depth. helmet bundles a dozen security headers — Content-Security-Policy, X-Content-Type-Options, Strict-Transport-Security and more — that mitigate clickjacking, MIME sniffing and other attacks; you enable it with app.use(helmet()) and tune individual headers as needed. CORS controls which web origins may call your API from a browser: the default cors() allows every origin, which is rarely what you want in production, so you pass an options object listing the specific origins, methods and headers you permit, and whether credentials (cookies) are allowed. Be precise — a wildcard origin combined with credentials is both insecure and disallowed by browsers. Set these near the top of the middleware stack so they apply to all responses. Together, helmet and a tight CORS policy remove a large class of common browser-side vulnerabilities.',
              keyPoints: [
                'helmet() adds protective security headers in one line.',
                'Configure CORS to allow only trusted origins, not the default wildcard.',
                'A wildcard origin with credentials is insecure and browser-rejected.',
                'Register security middleware early so it covers every response.',
              ],
              code: {
                language: 'javascript',
                lines: [
                  'const helmet = require(\'helmet\');',
                  'const cors = require(\'cors\');',
                  '',
                  'app.use(helmet());',
                  'app.use(cors({',
                  '  origin: [\'https://app.example.com\'],',
                  '  methods: [\'GET\', \'POST\'],',
                  '  credentials: true,',
                  '}));',
                ],
                explanation:
                  'helmet hardens response headers; cors restricts cross-origin access to one explicit origin while allowing credentials.',
              },
              commonMistakes: [
                'Leaving cors() wide open in production, exposing the API to every site.',
                'Combining origin: \'*\' with credentials: true, which browsers reject.',
              ],
              exercises: [
                {
                  type: 'quiz',
                  prompt: 'Why is the default cors() risky in production?',
                  solution: { explanation: 'It allows every origin to call your API from the browser; production should whitelist only trusted origins.' },
                },
                {
                  type: 'task',
                  prompt: 'Restrict CORS to a single origin https://example.com.',
                  solution: {
                    lines: ['app.use(cors({ origin: \'https://example.com\' }));'],
                    explanation: 'Passing an explicit origin limits which site can make cross-origin requests.',
                  },
                },
                {
                  type: 'predict',
                  prompt: 'You set origin: \'*\' and credentials: true. What does the browser do with credentialed requests?',
                  solution: {
                    explanation: 'It blocks them — the CORS spec forbids a wildcard origin together with credentials. You must name the exact origin.',
                  },
                },
              ],
              docs: 'https://expressjs.com/en/advanced/best-practice-security.html',
            },
            {
              id: 'ex5-t0-c1',
              title: 'Rate limiting and input sanitization',
              summary:
                'Rate limiting throttles abusive clients; sanitizing and validating input defends against injection, XSS and oversized payloads.',
              explanation:
                'Two more pillars of security are throttling and input hygiene. A rate limiter such as express-rate-limit caps how many requests an IP can make in a window, returning 429 Too Many Requests when exceeded, which blunts brute-force login attempts and denial-of-service abuse. On input, always validate (as covered earlier) and sanitize: escape or strip dangerous content so user data cannot become executable. For SQL, use parameterised queries rather than string concatenation to prevent SQL injection; for NoSQL, reject operator objects in user input to prevent NoSQL injection; for rendered HTML, escape user content to prevent stored XSS. Cap body sizes with the parser limit option so a giant payload cannot exhaust memory. Never trust anything the client sends — treat all input as hostile until validated. These habits, combined with helmet and CORS, cover the bulk of the OWASP top risks for an API.',
              analogy:
                'Rate limiting is a turnstile that only lets so many people through per minute; input sanitization is the metal detector that strips anything dangerous before it gets in.',
              keyPoints: [
                'Rate limiting caps requests per client and returns 429 when exceeded.',
                'Use parameterised queries to prevent SQL injection.',
                'Escape user content in rendered HTML to prevent XSS.',
                'Cap body size and treat all input as untrusted.',
              ],
              code: {
                language: 'javascript',
                lines: [
                  'const rateLimit = require(\'express-rate-limit\');',
                  '',
                  'const limiter = rateLimit({',
                  '  windowMs: 15 * 60 * 1000,',
                  '  max: 100,',
                  '});',
                  'app.use(\'/api\', limiter);',
                  '',
                  '// parameterised query prevents SQL injection',
                  'db.query(\'SELECT * FROM users WHERE id = $1\', [req.params.id]);',
                ],
                explanation:
                  'The limiter allows 100 requests per IP per 15 minutes for /api; the parameterised query keeps user input out of the SQL string.',
              },
              commonMistakes: [
                'Building SQL by concatenating req.body values, opening a SQL-injection hole.',
                'Rendering user-supplied HTML without escaping, enabling stored XSS.',
              ],
              exercises: [
                {
                  type: 'quiz',
                  prompt: 'What status code does a rate limiter return when a client exceeds the limit?',
                  solution: { explanation: '429 Too Many Requests.' },
                },
                {
                  type: 'task',
                  prompt: 'Write a parameterised SQL query that selects a user by an id from req.params.',
                  solution: {
                    lines: ['db.query(\'SELECT * FROM users WHERE id = $1\', [req.params.id]);'],
                    explanation: 'Passing the value as a parameter keeps it out of the SQL text, preventing injection.',
                  },
                },
                {
                  type: 'predict',
                  prompt: 'A login route has no rate limit. How might an attacker exploit that?',
                  solution: {
                    explanation: 'They can brute-force passwords with unlimited attempts. A rate limiter throttles attempts per IP and slows or blocks the attack.',
                  },
                },
              ],
              docs: 'https://expressjs.com/en/advanced/best-practice-security.html#use-rate-limiting',
            },
            {
              id: 'ex5-t0-c2',
              title: 'Common web vulnerabilities and defenses',
              summary:
                'Know the main attack classes — XSS, CSRF, injection and insecure dependencies — and the standard Express defenses for each.',
              explanation:
                'Beyond individual tools, it helps to map threats to defenses. Cross-site scripting (XSS) injects malicious scripts into pages; defend by escaping user content in views and setting a Content-Security-Policy via helmet. Cross-site request forgery (CSRF) tricks a logged-in user\'s browser into making unwanted state-changing requests; defend with sameSite cookies and CSRF tokens for cookie-based session apps. Injection (SQL, NoSQL, command) happens when untrusted input becomes part of a query or command; defend with parameterised queries and strict input validation. Broken authentication is mitigated by hashing passwords with bcrypt or argon2, never storing them in plain text, and rate-limiting login. Finally, vulnerable dependencies are a real risk, so run npm audit and keep packages updated. No single switch makes an app secure; security is the sum of these layered, deliberate choices.',
              keyPoints: [
                'XSS: escape output and set a Content-Security-Policy.',
                'CSRF: use sameSite cookies and CSRF tokens for session apps.',
                'Injection: parameterise queries and validate input.',
                'Hash passwords (bcrypt/argon2) and run npm audit on dependencies.',
              ],
              diagram: {
                type: 'mermaid',
                lines: [
                  'flowchart TD',
                  '  XSS[XSS] --> Escape[Escape output and CSP]',
                  '  CSRF[CSRF] --> Tokens[SameSite and CSRF tokens]',
                  '  Inject[Injection] --> Params[Parameterised queries]',
                  '  Deps[Vulnerable deps] --> Audit[npm audit and updates]',
                ],
                caption: 'Each common vulnerability class has a standard defense in an Express app.',
              },
              code: {
                language: 'javascript',
                lines: [
                  'const bcrypt = require(\'bcrypt\');',
                  '',
                  '// store only a hash, never the plain password',
                  'const hash = await bcrypt.hash(password, 12);',
                  '',
                  '// verify on login',
                  'const ok = await bcrypt.compare(attempt, hash);',
                ],
                explanation:
                  'Passwords are hashed with bcrypt before storage and compared on login, so a database leak does not expose plain passwords.',
              },
              commonMistakes: [
                'Storing passwords in plain text or with fast unsalted hashes like MD5.',
                'Ignoring npm audit warnings and shipping known-vulnerable dependencies.',
              ],
              exercises: [
                {
                  type: 'quiz',
                  prompt: 'What is the standard defense against SQL injection?',
                  solution: { explanation: 'Parameterised (prepared) queries that keep untrusted input out of the SQL text, combined with input validation.' },
                },
                {
                  type: 'task',
                  prompt: 'Hash a password with bcrypt using a cost factor of 12.',
                  solution: {
                    lines: ['const hash = await bcrypt.hash(password, 12);'],
                    explanation: 'bcrypt salts and slows hashing; the cost factor makes brute-forcing leaked hashes expensive.',
                  },
                },
                {
                  type: 'predict',
                  prompt: 'A cookie-session app has no CSRF protection. How could an attacker abuse it?',
                  solution: {
                    explanation: 'A malicious site can trigger the victim\'s browser to send authenticated state-changing requests. SameSite cookies and CSRF tokens block this.',
                  },
                },
              ],
              docs: 'https://expressjs.com/en/advanced/best-practice-security.html',
            },
          ],
        },
        {
          id: 'ex5-t1',
          name: 'Performance and reliability',
          concepts: [
            {
              id: 'ex5-t1-c0',
              title: 'Compression and structured logging',
              summary:
                'The compression middleware gzips responses to save bandwidth; structured logging emits machine-readable logs you can search and alert on.',
              explanation:
                'For performance, the compression middleware transparently gzips or brotli-compresses responses, dramatically shrinking JSON and HTML payloads at the cost of a little CPU; you add it with app.use(compression()) high in the stack. In many production setups the reverse proxy handles compression instead, so you choose one layer to do it. For observability, move beyond console.log to structured logging with a library like pino or winston: logs become JSON objects with consistent fields (level, timestamp, request id, message) that log aggregators can parse, filter and alert on. Attach a request id to each request and include it in every log line so you can trace one request end to end. In development a pretty, human-readable format is fine, but production logs should be structured and shipped to a central system. Good logging is what lets you understand and debug a live system.',
              keyPoints: [
                'compression() gzips responses to reduce bandwidth.',
                'Compress at the app or the reverse proxy, not both.',
                'Use structured JSON logging (pino, winston) in production.',
                'Attach a request id to trace a request across log lines.',
              ],
              code: {
                language: 'javascript',
                lines: [
                  'const compression = require(\'compression\');',
                  'const pino = require(\'pino\')();',
                  '',
                  'app.use(compression());',
                  '',
                  'app.use((req, res, next) => {',
                  '  pino.info({ method: req.method, url: req.url }, \'request\');',
                  '  next();',
                  '});',
                ],
                explanation:
                  'compression shrinks responses; the pino logger emits a structured JSON line per request for aggregation.',
              },
              commonMistakes: [
                'Compressing in both Express and the reverse proxy, wasting CPU.',
                'Relying on console.log in production, producing unstructured logs that are hard to query.',
              ],
              exercises: [
                {
                  type: 'quiz',
                  prompt: 'What is the main benefit of the compression middleware?',
                  solution: { explanation: 'It compresses (gzips) responses, reducing the bytes sent over the network at a small CPU cost.' },
                },
                {
                  type: 'task',
                  prompt: 'Enable gzip compression for all responses.',
                  solution: {
                    lines: ['app.use(compression());'],
                    explanation: 'Registered early in the stack, it compresses outgoing responses automatically.',
                  },
                },
                {
                  type: 'predict',
                  prompt: 'Why is JSON structured logging easier to operate at scale than plain console.log strings?',
                  solution: {
                    explanation: 'Aggregators can parse consistent fields to filter, search and alert; freeform strings must be regex-scraped and are error-prone.',
                  },
                },
              ],
              docs: 'https://expressjs.com/en/advanced/best-practice-performance.html#use-gzip-compression',
            },
            {
              id: 'ex5-t1-c1',
              title: 'Graceful shutdown and reverse proxies',
              summary:
                'Handle termination signals to drain in-flight requests before exiting, and run Express behind a reverse proxy with trust proxy set correctly.',
              explanation:
                'A reliable service shuts down cleanly. When the platform sends SIGTERM (during a deploy or scale-down), you should stop accepting new connections, let in-flight requests finish, close database connections, then exit — rather than dropping live requests. You do this by capturing the server returned from app.listen and calling server.close() inside a SIGTERM handler. In production Express almost always runs behind a reverse proxy such as Nginx or a cloud load balancer that terminates TLS and forwards requests. Because of that, the client\'s real IP and protocol arrive in X-Forwarded-* headers; you must call app.set(\'trust proxy\', ...) so Express reads req.ip and req.protocol from those headers correctly, which matters for rate limiting, logging and secure-cookie decisions. Getting shutdown and proxy settings right is the difference between a fragile and a production-grade deployment.',
              keyPoints: [
                'Listen for SIGTERM and call server.close() to drain requests before exit.',
                'Close database and other connections during shutdown.',
                'Production Express runs behind a reverse proxy or load balancer.',
                'Set trust proxy so req.ip and req.protocol use X-Forwarded headers.',
              ],
              diagram: {
                type: 'mermaid',
                lines: [
                  'flowchart LR',
                  '  Client[Client] --> Proxy[Reverse proxy]',
                  '  Proxy --> App[Express app]',
                  '  Signal[SIGTERM] --> App',
                  '  App --> Drain[Drain then exit]',
                ],
                caption: 'Express sits behind a proxy; on SIGTERM it drains in-flight requests before exiting.',
              },
              code: {
                language: 'javascript',
                lines: [
                  'app.set(\'trust proxy\', 1);',
                  'const server = app.listen(process.env.PORT || 3000);',
                  '',
                  'process.on(\'SIGTERM\', () => {',
                  '  server.close(() => {',
                  '    db.end();',
                  '    process.exit(0);',
                  '  });',
                  '});',
                ],
                explanation:
                  'trust proxy makes Express read forwarded headers; the SIGTERM handler stops new connections, lets active ones finish, closes the db and exits.',
              },
              commonMistakes: [
                'Calling process.exit immediately on SIGTERM, killing in-flight requests.',
                'Forgetting trust proxy behind a load balancer, so req.ip is the proxy and secure cookies misbehave.',
              ],
              exercises: [
                {
                  type: 'quiz',
                  prompt: 'Which signal should trigger a graceful shutdown, and what method drains in-flight requests?',
                  solution: { explanation: 'SIGTERM; server.close() stops accepting new connections and lets active requests finish before the callback fires.' },
                },
                {
                  type: 'task',
                  prompt: 'Tell Express to trust the first reverse proxy in front of it.',
                  solution: {
                    lines: ['app.set(\'trust proxy\', 1);'],
                    explanation: 'This makes Express read the client IP and protocol from X-Forwarded-* headers set by the proxy.',
                  },
                },
                {
                  type: 'predict',
                  prompt: 'Behind a load balancer without trust proxy, what value does req.ip return and why does it matter?',
                  solution: {
                    explanation: 'It returns the proxy\'s IP, not the client\'s, so per-IP rate limiting and logging are wrong. trust proxy fixes the source IP.',
                  },
                },
              ],
              docs: 'https://expressjs.com/en/guide/behind-proxies.html',
            },
          ],
        },
        {
          id: 'ex5-t2',
          name: 'Testing and deployment',
          concepts: [
            {
              id: 'ex5-t2-c0',
              title: 'Testing routes with supertest',
              summary:
                'supertest sends HTTP requests to your Express app in memory, letting a test runner assert on status codes and response bodies.',
              explanation:
                'You test an Express app by exercising its routes. supertest takes your app object and makes real HTTP requests against it without binding a port, returning a promise you can await and assert on. The key enabler is structuring your code so the app is exported separately from the listen call — module app.js exports the app, and server.js requires it and calls listen — so tests can import the app directly. With a runner like Jest, Vitest or node:test, you write tests that POST a body and expect a 201, or GET a missing resource and expect a 404, checking response.body too. Integration tests like these cover routing, middleware and handlers together, which is where most real bugs hide; pure unit tests of services complement them. Run the suite in CI on every push so regressions are caught before deploy.',
              keyPoints: [
                'supertest makes in-memory HTTP requests to the app — no port needed.',
                'Export the app separately from app.listen so tests can import it.',
                'Assert on status codes and response bodies.',
                'Integration tests exercise routing, middleware and handlers together.',
              ],
              code: {
                language: 'javascript',
                lines: [
                  'const request = require(\'supertest\');',
                  'const app = require(\'../app\');',
                  '',
                  'test(\'GET /health returns 200\', async () => {',
                  '  const res = await request(app).get(\'/health\');',
                  '  expect(res.status).toBe(200);',
                  '  expect(res.body.status).toBe(\'ok\');',
                  '});',
                ],
                explanation:
                  'supertest drives the imported app directly; the test awaits the response and asserts on its status and body.',
              },
              commonMistakes: [
                'Calling app.listen inside app.js, so importing it for tests starts a real server and leaks ports.',
                'Testing only happy paths and ignoring error and validation responses.',
              ],
              exercises: [
                {
                  type: 'quiz',
                  prompt: 'Why should the app be exported separately from app.listen?',
                  solution: {
                    explanation: 'So supertest (and tests) can import the app and make in-memory requests without starting a real listening server.',
                  },
                },
                {
                  type: 'task',
                  prompt: 'Write a supertest assertion that a POST /users returns 201.',
                  solution: {
                    lines: [
                      'const res = await request(app).post(\'/users\').send({ name: \'Ada\' });',
                      'expect(res.status).toBe(201);',
                    ],
                    explanation: 'request(app).post(...).send(body) issues the request; you then assert on res.status.',
                  },
                },
                {
                  type: 'predict',
                  prompt: 'Your test imports app.js which calls app.listen(3000). Two test files import it. What problem appears?',
                  solution: {
                    explanation: 'Both try to bind port 3000, causing an EADDRINUSE error. Export the app and listen only in a separate entry file.',
                  },
                },
              ],
              docs: 'https://expressjs.com/en/advanced/best-practice-performance.html#do-perform-logging-correctly',
            },
            {
              id: 'ex5-t2-c1',
              title: 'Deployment basics and process managers',
              summary:
                'Set NODE_ENV to production, run the app with a process manager or container that restarts on crashes, and use multiple instances to use all CPU cores.',
              explanation:
                'Deploying Express means running it reliably and using the hardware well. Set NODE_ENV=production, which makes Express and many libraries enable caching and skip verbose error output. Because Node is single-threaded, one process uses one CPU core, so you run several instances behind the load balancer — either with Node\'s cluster module, a process manager like PM2, or by running multiple container replicas in Kubernetes or a PaaS. A process manager also restarts the app if it crashes and can do zero-downtime reloads on deploy. Keep configuration in environment variables (per the earlier topic) so the same artifact runs everywhere. Health-check endpoints let the orchestrator know an instance is ready and alive. Combined with the graceful shutdown and logging from the previous topic, this gives you a deployment that survives crashes, deploys cleanly and scales across cores.',
              analogy:
                'Running one bare node process in production is like a shop with a single till and no manager. A process manager is the supervisor who reopens a till the moment one breaks and staffs every till to serve the queue.',
              keyPoints: [
                'Set NODE_ENV=production to enable optimisations.',
                'Run multiple instances (cluster, PM2 or replicas) to use all cores.',
                'A process manager restarts on crash and enables zero-downtime reloads.',
                'Expose a health-check endpoint for the orchestrator.',
              ],
              code: {
                language: 'javascript',
                lines: [
                  '// health endpoint for the orchestrator',
                  'app.get(\'/health\', (req, res) => res.json({ status: \'ok\' }));',
                  '',
                  '// run in production with PM2 across all cores:',
                  '// NODE_ENV=production pm2 start server.js -i max',
                ],
                explanation:
                  'A health endpoint lets the platform check readiness; PM2 with -i max forks one instance per CPU core and restarts crashes.',
              },
              commonMistakes: [
                'Leaving NODE_ENV unset, missing production optimisations and leaking error details.',
                'Running a single node process, so only one CPU core is used and a crash takes the app down.',
              ],
              exercises: [
                {
                  type: 'quiz',
                  prompt: 'Why run multiple Express instances on one machine?',
                  solution: {
                    explanation: 'Node is single-threaded, so one process uses one core. Multiple instances behind a balancer use all cores and add redundancy.',
                  },
                },
                {
                  type: 'task',
                  prompt: 'Add a simple health-check route that returns JSON status ok.',
                  solution: {
                    lines: ['app.get(\'/health\', (req, res) => res.json({ status: \'ok\' }));'],
                    explanation: 'Orchestrators poll this endpoint to decide if an instance is healthy and should receive traffic.',
                  },
                },
                {
                  type: 'predict',
                  prompt: 'You deploy without setting NODE_ENV=production. What changes in behaviour?',
                  solution: {
                    explanation: 'Express and libraries skip production optimisations (like view caching) and may return verbose error output, hurting performance and leaking details.',
                  },
                },
              ],
              docs: 'https://expressjs.com/en/advanced/best-practice-performance.html#set-node_env-to-production',
            },
            {
              id: 'ex5-t2-c2',
              title: 'Test environments and continuous integration',
              summary:
                'Run tests against an isolated test configuration and database, and wire the suite into CI so every change is validated automatically.',
              explanation:
                'Reliable tests need isolation. Use a dedicated test environment — a separate .env.test or NODE_ENV=test config — that points at a throwaway test database rather than development or production data, so tests can create and delete records freely. Reset state between tests (truncate tables or use transactions that roll back) to keep them independent and repeatable. For code that calls slow or external services, you mock those boundaries so tests stay fast and deterministic, while still keeping integration tests that exercise the real database for the critical paths. Finally, run the whole suite in continuous integration on every push and pull request, ideally also running lint and npm audit, so regressions and vulnerabilities are caught before merging. A green pipeline gives you the confidence to deploy frequently. Good test hygiene plus CI is what makes an Express codebase safe to change quickly.',
              keyPoints: [
                'Use a separate test config and a throwaway test database.',
                'Reset state between tests so they stay independent.',
                'Mock external services for speed; keep real-db integration tests for key paths.',
                'Run the suite, lint and audit in CI on every change.',
              ],
              code: {
                language: 'javascript',
                lines: [
                  '// package.json scripts',
                  '// "test": "NODE_ENV=test node --test"',
                  '',
                  'beforeEach(async () => {',
                  '  await db.query(\'TRUNCATE users RESTART IDENTITY CASCADE\');',
                  '});',
                ],
                explanation:
                  'Tests run with NODE_ENV=test against a test database; truncating before each test keeps cases isolated and repeatable.',
              },
              commonMistakes: [
                'Running tests against the development or production database, corrupting real data.',
                'Sharing state between tests so they pass or fail depending on order.',
              ],
              exercises: [
                {
                  type: 'quiz',
                  prompt: 'Why should tests use a separate test database?',
                  solution: {
                    explanation: 'So tests can freely create and delete data without corrupting development or production data, and so results are repeatable.',
                  },
                },
                {
                  type: 'task',
                  prompt: 'Reset the users table before each test so cases stay isolated.',
                  solution: {
                    lines: [
                      'beforeEach(async () => {',
                      '  await db.query(\'TRUNCATE users RESTART IDENTITY CASCADE\');',
                      '});',
                    ],
                    explanation: 'Clearing state before each test removes ordering dependencies between tests.',
                  },
                },
                {
                  type: 'predict',
                  prompt: 'Tests pass locally but fail intermittently in CI depending on order. What is the likely cause?',
                  solution: {
                    explanation: 'Shared, un-reset state between tests creates ordering dependencies. Isolate each test by resetting the database (or using rolled-back transactions).',
                  },
                },
              ],
              docs: 'https://expressjs.com/en/advanced/best-practice-performance.html',
            },
          ],
        },
      ],
    },
  ],
};

export default content;
