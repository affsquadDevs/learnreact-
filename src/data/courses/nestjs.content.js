// NestJS Essentials — course content.
// A structured backend course covering NestJS from fundamentals to production:
// modules, controllers, providers, dependency injection, the request lifecycle,
// validation, persistence, auth, testing, and going beyond REST. Explanations
// and code examples are original, written for self-study. Same content schema as
// the other courses so the lesson components render it as-is.

const content = {
  meta: {
    title: 'NestJS Essentials',
    description:
      'Build robust, scalable Node.js back ends with NestJS: modules, controllers, providers, dependency injection, the request lifecycle, validation, databases, authentication, testing and more — with TypeScript code and hands-on tasks.',
    schemaVersion: '1.0',
    status: 'complete',
  },
  levels: [
    /* ───────────────────── LEVEL 1 — FUNDAMENTALS ───────────────────── */
    {
      level: 1,
      name: 'Fundamentals',
      focus: 'The core building blocks: modules, controllers, providers and dependency injection',
      accent: '#e0234e',
      soft: '#fde8ec',
      topics: [
        {
          id: 'n1-t0',
          name: 'Getting started',
          concepts: [
            {
              id: 'n1-t0-c0',
              title: 'What NestJS is and why it exists',
              summary:
                'NestJS is a progressive Node.js framework for building server-side applications. It is TypeScript-first and gives your back end a clear, opinionated architecture out of the box.',
              explanation:
                'Plain Express gives you a router and nothing else — every team invents its own folder structure, its own way to wire dependencies, and its own conventions. NestJS solves that by providing an opinionated, modular architecture (heavily inspired by Angular) on top of a battle-tested HTTP layer. By default it runs on Express, but it abstracts the HTTP platform so you can switch to Fastify for more performance. It embraces TypeScript, decorators and dependency injection, which makes large codebases consistent, testable and easy to navigate. You spend time on business logic instead of reinventing structure.',
              analogy:
                'Express is a pile of LEGO bricks with no instructions. NestJS is the same bricks plus a blueprint and labelled boxes — everyone on the team builds the same way.',
              keyPoints: [
                'Progressive Node.js framework for scalable server-side apps.',
                'TypeScript-first; built around decorators and dependency injection.',
                'Platform-agnostic HTTP layer — Express by default, Fastify optional.',
                'Opinionated, modular architecture inspired by Angular.',
              ],
              diagram: {
                type: 'mermaid',
                lines: [
                  'flowchart LR',
                  '  R[HTTP request] --> C[Controller]',
                  '  C --> S[Service / Provider]',
                  '  S --> D[(Database)]',
                  '  C -. grouped by .- M[Module]',
                ],
                caption: 'A NestJS app is organised into modules; controllers handle requests and delegate to providers (services).',
              },
              exercises: [
                {
                  type: 'quiz',
                  prompt: 'What does NestJS add on top of a plain Express server?',
                  hint: 'Think structure, not just routing.',
                  solution: {
                    explanation:
                      'An opinionated, modular architecture with TypeScript, decorators and built-in dependency injection — so structure and wiring are consistent instead of hand-rolled.',
                  },
                },
                {
                  type: 'quiz',
                  prompt: 'Which HTTP platform does NestJS use by default, and what is the common high-performance alternative?',
                  solution: { explanation: 'Express by default; Fastify is the common alternative (the HTTP layer is abstracted, so you can swap it).' },
                },
              ],
              docs: 'https://docs.nestjs.com/first-steps',
            },
            {
              id: 'n1-t0-c1',
              title: 'The Nest CLI, project structure and bootstrapping',
              summary:
                'The Nest CLI scaffolds projects and generates building blocks. Every app boots from main.ts, which creates the application from the root module.',
              explanation:
                'You start a project with `nest new` and generate building blocks with `nest generate` (alias `nest g`) — e.g. `nest g module users`, `nest g controller users`, `nest g service users`. The entry point is main.ts: it calls NestFactory.create() with the root AppModule and starts listening on a port. A conventional feature lives in three files: a module that wires things together, a controller for the HTTP routes, and a service for the logic. Keeping that shape consistent is what makes Nest projects predictable.',
              keyPoints: [
                '`nest new` scaffolds a project; `nest g <schematic> <name>` generates modules/controllers/services.',
                'main.ts is the entry point: NestFactory.create(AppModule) then app.listen(port).',
                'A feature = module + controller + service, by convention.',
              ],
              code: {
                language: 'typescript',
                lines: [
                  "// main.ts — the application entry point",
                  "import { NestFactory } from '@nestjs/core';",
                  "import { AppModule } from './app.module';",
                  '',
                  'async function bootstrap() {',
                  '  const app = await NestFactory.create(AppModule);',
                  '  await app.listen(3000);',
                  '}',
                  'bootstrap();',
                ],
                explanation:
                  'NestFactory.create builds the application from the root module and wires up the dependency-injection container; app.listen starts the HTTP server.',
              },
              exercises: [
                {
                  type: 'task',
                  prompt: 'Write the CLI commands to generate a "users" module, controller and service.',
                  solution: {
                    lines: [
                      'nest g module users',
                      'nest g controller users',
                      'nest g service users',
                    ],
                    explanation: 'Each command scaffolds the file and registers it in the appropriate module automatically.',
                  },
                },
                {
                  type: 'quiz',
                  prompt: 'Which file is the entry point of a NestJS application and what does it create the app from?',
                  solution: { explanation: 'main.ts — it creates the app from the root module (AppModule) via NestFactory.create().' },
                },
              ],
              docs: 'https://docs.nestjs.com/cli/overview',
            },
          ],
        },
        {
          id: 'n1-t1',
          name: 'Modules, controllers, providers',
          concepts: [
            {
              id: 'n1-t1-c0',
              title: 'Modules: organising the application',
              summary:
                'A module is a class annotated with @Module that groups related controllers and providers. Every app has at least one root module, and features are split into their own modules.',
              explanation:
                'The @Module decorator takes metadata with four arrays: controllers (the route handlers in this module), providers (services that can be injected here), imports (other modules whose exported providers you want to use), and exports (the providers this module makes available to others). Modules give you encapsulation: a provider is only injectable inside its module unless the module exports it and another module imports it. Structuring an app as a tree of feature modules keeps boundaries clear and the DI graph manageable.',
              keyPoints: [
                '@Module metadata: controllers, providers, imports, exports.',
                'Root module (AppModule) bootstraps the app; features get their own modules.',
                'Encapsulation: providers are private to a module unless exported and imported.',
              ],
              code: {
                language: 'typescript',
                lines: [
                  "import { Module } from '@nestjs/common';",
                  "import { UsersController } from './users.controller';",
                  "import { UsersService } from './users.service';",
                  '',
                  '@Module({',
                  '  controllers: [UsersController],',
                  '  providers: [UsersService],',
                  '  exports: [UsersService], // let other modules inject UsersService',
                  '})',
                  'export class UsersModule {}',
                ],
                explanation:
                  'UsersModule registers its controller and service. Exporting UsersService lets any module that imports UsersModule inject it.',
              },
              commonMistakes: [
                'Forgetting to add a provider to the module\'s providers array (Nest then can\'t inject it).',
                'Trying to inject a provider from another module without exporting it there and importing the module here.',
              ],
              exercises: [
                {
                  type: 'quiz',
                  prompt: 'A service in OrdersModule needs UsersService from UsersModule. What two things make that possible?',
                  solution: {
                    explanation: 'UsersModule must export UsersService, and OrdersModule must import UsersModule. Then UsersService is injectable in OrdersModule.',
                  },
                },
                {
                  type: 'predict',
                  prompt: 'A provider is listed in a module\'s providers but NOT in exports. Can another module inject it?',
                  solution: { explanation: 'No. Without exporting it, the provider is encapsulated and only injectable within its own module.' },
                },
              ],
              docs: 'https://docs.nestjs.com/modules',
            },
            {
              id: 'n1-t1-c1',
              title: 'Controllers: handling requests',
              summary:
                'A controller is a class annotated with @Controller that defines route handlers. Its job is to receive requests and return responses — not to hold business logic.',
              explanation:
                'You annotate a class with @Controller(\'users\') to set a route prefix, then annotate methods with HTTP decorators (@Get, @Post, etc.) to define endpoints. Parameter decorators pull data from the request: @Param for path params, @Query for the query string, @Body for the parsed request body. A controller should stay thin: validate/shape the request, call a service, and return the result. Pushing logic into services keeps controllers readable and testable.',
              keyPoints: [
                '@Controller(prefix) groups routes; method decorators (@Get/@Post/…) define endpoints.',
                '@Param, @Query, @Body extract request data.',
                'Keep controllers thin — delegate logic to services.',
              ],
              code: {
                language: 'typescript',
                lines: [
                  "import { Controller, Get, Post, Param, Body } from '@nestjs/common';",
                  "import { UsersService } from './users.service';",
                  "import { CreateUserDto } from './dto/create-user.dto';",
                  '',
                  "@Controller('users')",
                  'export class UsersController {',
                  '  constructor(private readonly users: UsersService) {}',
                  '',
                  '  @Get(":id")',
                  '  findOne(@Param("id") id: string) {',
                  '    return this.users.findOne(id);',
                  '  }',
                  '',
                  '  @Post()',
                  '  create(@Body() dto: CreateUserDto) {',
                  '    return this.users.create(dto);',
                  '  }',
                  '}',
                ],
                explanation:
                  'GET /users/:id and POST /users. The controller injects UsersService and delegates to it; @Param and @Body pull data from the request.',
              },
              exercises: [
                {
                  type: 'task',
                  prompt: 'Add a handler for GET /users that returns this.users.findAll().',
                  solution: {
                    lines: [
                      '@Get()',
                      'findAll() {',
                      '  return this.users.findAll();',
                      '}',
                    ],
                    explanation: 'No path argument on @Get() means it maps to the controller prefix itself (GET /users).',
                  },
                },
              ],
              docs: 'https://docs.nestjs.com/controllers',
            },
            {
              id: 'n1-t1-c2',
              title: 'Providers and services',
              summary:
                'A provider is any class Nest can inject; the most common kind is a service annotated with @Injectable that holds business logic.',
              explanation:
                'Marking a class with @Injectable() tells Nest it can be managed by the DI container and injected elsewhere. Services are where your real work lives: talking to the database, calling other APIs, enforcing rules. Because services are injected (not instantiated by hand), they are easy to replace with mocks in tests. The separation is deliberate: controllers handle HTTP, services handle logic, modules wire them together.',
              keyPoints: [
                '@Injectable() marks a class as a provider the DI container can manage.',
                'Services hold business logic and dependencies (DB, other services).',
                'Injection makes services trivially mockable in tests.',
              ],
              code: {
                language: 'typescript',
                lines: [
                  "import { Injectable, NotFoundException } from '@nestjs/common';",
                  '',
                  '@Injectable()',
                  'export class UsersService {',
                  '  private readonly users = new Map<string, { id: string; name: string }>();',
                  '',
                  '  findOne(id: string) {',
                  '    const user = this.users.get(id);',
                  '    if (!user) throw new NotFoundException("User not found");',
                  '    return user;',
                  '  }',
                  '}',
                ],
                explanation:
                  'A simple injectable service. Throwing NotFoundException makes Nest respond with HTTP 404 automatically.',
              },
              exercises: [
                {
                  type: 'quiz',
                  prompt: 'What decorator marks a class as a provider that Nest can inject, and where do you usually put business logic?',
                  solution: { explanation: '@Injectable(); business logic goes in services (providers), not controllers.' },
                },
              ],
              docs: 'https://docs.nestjs.com/providers',
            },
          ],
        },
        {
          id: 'n1-t2',
          name: 'Dependency Injection',
          concepts: [
            {
              id: 'n1-t2-c0',
              title: 'Dependency injection and the IoC container',
              summary:
                'NestJS resolves your classes\' dependencies for you. You declare what you need in the constructor; the framework creates and supplies it.',
              explanation:
                'Inversion of Control (IoC) means a class does not create its own dependencies — the framework does. In Nest, you type a constructor parameter (e.g. `private readonly users: UsersService`) and the DI container looks up a provider registered under that token, instantiates it once (by default a singleton), and injects it. This decouples classes from concrete construction, so you can swap real implementations for test doubles without touching the consumer. The container builds the whole dependency graph at startup.',
              analogy:
                'You don\'t build your own car engine every time you drive. You ask for "a car"; the factory wires the engine in. DI is that factory for your classes.',
              keyPoints: [
                'IoC: the framework creates and supplies dependencies, not your class.',
                'Constructor injection by token (usually the class type); providers are singletons by default.',
                'Decoupling makes code testable — inject mocks instead of real services.',
              ],
              diagram: {
                type: 'mermaid',
                lines: [
                  'flowchart LR',
                  '  Ct[DI container] -->|creates| S[UsersService]',
                  '  Ct -->|injects S into| C[UsersController]',
                  '  C -. asks for UsersService .-> Ct',
                ],
                caption: 'The container resolves the dependency graph: the controller asks for a service; the container creates it and injects it.',
              },
              exercises: [
                {
                  type: 'quiz',
                  prompt: 'By default, how many instances of a given provider does Nest create per application?',
                  solution: { explanation: 'One — providers are singletons by default (DEFAULT scope), shared across the app.' },
                },
                {
                  type: 'predict',
                  prompt: 'You add `private readonly mailer: MailService` to a controller constructor but never register MailService anywhere. What happens at startup?',
                  solution: { explanation: 'Nest throws a dependency-resolution error — it can\'t find a provider for the MailService token, so the app fails to bootstrap.' },
                },
              ],
              docs: 'https://docs.nestjs.com/fundamentals/custom-providers',
            },
            {
              id: 'n1-t2-c1',
              title: 'Custom providers and injection scopes',
              summary:
                'Providers can be defined with useClass, useValue or useFactory, and can live at singleton, request or transient scope.',
              explanation:
                'Beyond `providers: [UsersService]`, you can register providers explicitly with a token and a strategy: useClass (swap an implementation), useValue (inject a constant or mock), or useFactory (build it dynamically, possibly with injected dependencies). You can inject by a custom token using @Inject(TOKEN). Scopes control lifetime: DEFAULT (singleton, shared), REQUEST (a new instance per incoming request — useful for request-specific state but slower), and TRANSIENT (a fresh instance for each consumer). Default singleton scope is best unless you specifically need per-request state.',
              keyPoints: [
                'useClass / useValue / useFactory let you control how a provider is built.',
                '@Inject(TOKEN) injects a provider registered under a custom token.',
                'Scopes: DEFAULT (singleton), REQUEST (per request), TRANSIENT (per consumer).',
                'Prefer singleton scope; use REQUEST only when you truly need request-bound state.',
              ],
              code: {
                language: 'typescript',
                lines: [
                  '@Module({',
                  '  providers: [',
                  '    // swap the concrete implementation behind a token',
                  '    { provide: PaymentGateway, useClass: StripeGateway },',
                  '    // inject a constant value',
                  "    { provide: 'API_KEY', useValue: process.env.API_KEY },",
                  '    // build dynamically with dependencies',
                  '    {',
                  '      provide: HttpClient,',
                  '      useFactory: (cfg: ConfigService) => new HttpClient(cfg.get("baseUrl")),',
                  '      inject: [ConfigService],',
                  '    },',
                  '  ],',
                  '})',
                  'export class PaymentsModule {}',
                ],
                explanation:
                  'Three custom-provider styles: useClass swaps implementations, useValue injects a constant, useFactory builds the provider using other injected providers.',
              },
              exercises: [
                {
                  type: 'quiz',
                  prompt: 'Which provider strategy would you use to inject a mock object (a plain value) in a test module?',
                  solution: { explanation: 'useValue — provide the token with a fixed mock object as its value.' },
                },
                {
                  type: 'quiz',
                  prompt: 'Which injection scope creates a new provider instance for every incoming HTTP request?',
                  solution: { explanation: 'REQUEST scope.' },
                },
              ],
              docs: 'https://docs.nestjs.com/fundamentals/injection-scopes',
            },
          ],
        },
      ],
    },

    /* ───────────────────── LEVEL 2 — HTTP APIs ───────────────────── */
    {
      level: 2,
      name: 'Building APIs',
      focus: 'Routing, validation, and the full request lifecycle: middleware, guards, interceptors, filters',
      accent: '#7048e8',
      soft: '#efeafd',
      topics: [
        {
          id: 'n2-t0',
          name: 'Routing & request data',
          concepts: [
            {
              id: 'n2-t0-c0',
              title: 'Routes, HTTP methods and reading request data',
              summary:
                'Method decorators map handlers to HTTP verbs and paths; parameter decorators extract path params, query strings, bodies and headers.',
              explanation:
                'Inside a controller, @Get, @Post, @Put, @Patch and @Delete map a method to an HTTP verb; an optional path string adds a sub-route and supports route parameters like \':id\'. To read data, use @Param(name) for path segments, @Query(name) for query-string values, @Body() for the parsed JSON body, and @Headers(name) for headers. Handlers can be async and return a value, a Promise, or an RxJS Observable — Nest serialises whatever you return into the response body.',
              keyPoints: [
                '@Get/@Post/@Put/@Patch/@Delete bind a handler to a verb (+ optional path).',
                '@Param / @Query / @Body / @Headers pull data from the request.',
                'Return a value, Promise or Observable — Nest serialises the response.',
              ],
              code: {
                language: 'typescript',
                lines: [
                  "@Controller('articles')",
                  'export class ArticlesController {',
                  '  @Get()',
                  '  list(@Query("page") page = "1") {',
                  '    return this.articles.list(Number(page));',
                  '  }',
                  '',
                  '  @Get(":id")',
                  '  get(@Param("id") id: string) {',
                  '    return this.articles.get(id);',
                  '  }',
                  '',
                  '  @Patch(":id")',
                  '  update(@Param("id") id: string, @Body() dto: UpdateArticleDto) {',
                  '    return this.articles.update(id, dto);',
                  '  }',
                  '}',
                ],
                explanation:
                  'GET /articles?page=2, GET /articles/:id and PATCH /articles/:id, each reading the data it needs via parameter decorators.',
              },
              exercises: [
                {
                  type: 'quiz',
                  prompt: 'Which decorator reads a value from the query string, and which reads a path parameter?',
                  solution: { explanation: '@Query() reads from the query string; @Param() reads a path parameter (e.g. :id).' },
                },
              ],
              docs: 'https://docs.nestjs.com/controllers#request-object',
            },
            {
              id: 'n2-t0-c1',
              title: 'Status codes, headers and async handlers',
              summary:
                'Customise responses with @HttpCode, @Header and @Redirect; return Promises or Observables for asynchronous work.',
              explanation:
                'By default Nest sends 200 for most handlers and 201 for @Post. Override it with @HttpCode(204). Set response headers with @Header(\'Cache-Control\', \'no-store\') and redirect with @Redirect(url, 302). For async work just return a Promise (or an Observable) — Nest awaits it before responding. Prefer throwing the built-in HTTP exceptions (e.g. NotFoundException, BadRequestException) over manually setting error status codes; they produce consistent error responses.',
              keyPoints: [
                'Default status: 200 (201 for POST). Override with @HttpCode(n).',
                '@Header(name, value) sets a response header; @Redirect(url, code) redirects.',
                'Return Promises/Observables for async handlers; Nest awaits them.',
              ],
              exercises: [
                {
                  type: 'task',
                  prompt: 'A DELETE handler should return HTTP 204 (No Content). What decorator do you add?',
                  solution: {
                    lines: ['@Delete(":id")', '@HttpCode(204)', 'remove(@Param("id") id: string) {', '  return this.articles.remove(id);', '}'],
                    explanation: '@HttpCode(204) overrides the default status for that handler.',
                  },
                },
              ],
              docs: 'https://docs.nestjs.com/controllers#status-code',
            },
          ],
        },
        {
          id: 'n2-t1',
          name: 'Validation with DTOs & Pipes',
          concepts: [
            {
              id: 'n2-t1-c0',
              title: 'DTOs and the global ValidationPipe',
              summary:
                'A DTO (Data Transfer Object) is a class describing the shape of incoming data; the ValidationPipe validates and transforms it using class-validator decorators.',
              explanation:
                'Define a DTO class and annotate its fields with class-validator decorators (@IsString, @IsEmail, @Min, @IsOptional, etc.). Enable validation globally with app.useGlobalPipes(new ValidationPipe()). When a request hits a handler whose @Body() is typed as that DTO, the pipe validates the payload and rejects invalid requests with a 400 and helpful messages. Two important options: `whitelist: true` strips properties that aren\'t in the DTO, and `transform: true` converts the plain payload into a real DTO instance (and coerces types). DTOs must be classes, not interfaces, because decorators and validation rely on runtime metadata.',
              keyPoints: [
                'DTO = a class describing expected input, decorated with class-validator rules.',
                'Register ValidationPipe globally to validate every @Body automatically.',
                'whitelist strips unknown properties; transform converts payloads into DTO instances.',
                'DTOs must be classes (interfaces vanish at runtime — no metadata to validate).',
              ],
              code: {
                language: 'typescript',
                lines: [
                  "import { IsEmail, IsString, MinLength } from 'class-validator';",
                  '',
                  'export class CreateUserDto {',
                  '  @IsString()',
                  '  @MinLength(2)',
                  '  name: string;',
                  '',
                  '  @IsEmail()',
                  '  email: string;',
                  '}',
                  '',
                  '// main.ts',
                  'app.useGlobalPipes(',
                  '  new ValidationPipe({ whitelist: true, transform: true }),',
                  ');',
                ],
                explanation:
                  'Requests to a handler using CreateUserDto are validated automatically; invalid bodies get a 400 with messages, and unknown fields are stripped.',
              },
              commonMistakes: [
                'Declaring a DTO as an interface — validation needs a class with runtime metadata.',
                'Forgetting to register ValidationPipe, so decorators never run and bad data slips through.',
              ],
              exercises: [
                {
                  type: 'quiz',
                  prompt: 'Why must a DTO used for validation be a class rather than a TypeScript interface?',
                  solution: {
                    explanation: 'Interfaces are erased at compile time, leaving no runtime metadata. class-validator/ValidationPipe rely on decorators and metadata that only exist on classes.',
                  },
                },
                {
                  type: 'quiz',
                  prompt: 'Which ValidationPipe option strips properties that are not declared in the DTO?',
                  solution: { explanation: 'whitelist: true.' },
                },
              ],
              docs: 'https://docs.nestjs.com/techniques/validation',
            },
            {
              id: 'n2-t1-c1',
              title: 'Pipes: transformation and validation',
              summary:
                'A pipe transforms or validates a handler argument before it reaches the method. Nest ships several, and you can write your own.',
              explanation:
                'A pipe runs on the arguments bound by parameter decorators. Built-in pipes like ParseIntPipe, ParseUUIDPipe and ParseBoolPipe convert and validate single values — e.g. @Param(\'id\', ParseIntPipe) guarantees `id` is a number or returns a 400. A custom pipe implements PipeTransform and a transform(value, metadata) method; throw a BadRequestException to reject. Pipes are great for narrow, reusable input handling, while the ValidationPipe handles whole DTOs.',
              keyPoints: [
                'Pipes run before the handler to transform/validate a specific argument.',
                'Built-ins: ParseIntPipe, ParseUUIDPipe, ParseBoolPipe, etc.',
                'Custom pipe = implement PipeTransform.transform(); throw to reject.',
              ],
              code: {
                language: 'typescript',
                lines: [
                  "@Get(':id')",
                  'findOne(@Param("id", ParseIntPipe) id: number) {',
                  '  // id is guaranteed to be a number here, or the request 400s',
                  '  return this.users.findOne(id);',
                  '}',
                ],
                explanation:
                  'ParseIntPipe converts the path param to a number and rejects non-numeric input with a 400 before the handler runs.',
              },
              exercises: [
                {
                  type: 'predict',
                  prompt: 'A route uses @Param("id", ParseIntPipe). A client requests /users/abc. What is the response?',
                  solution: { explanation: 'HTTP 400 Bad Request — ParseIntPipe fails to convert "abc" to a number and rejects before the handler runs.' },
                },
              ],
              docs: 'https://docs.nestjs.com/pipes',
            },
          ],
        },
        {
          id: 'n2-t2',
          name: 'The request lifecycle',
          concepts: [
            {
              id: 'n2-t2-c0',
              title: 'Middleware and the request lifecycle order',
              summary:
                'A request passes through middleware, then guards, then interceptors, then pipes, reaches the handler, and the response flows back through interceptors — with exception filters catching errors.',
              explanation:
                'Knowing the order is essential. For each request Nest runs: (1) Middleware — runs first, like Express middleware, good for logging or attaching request context. (2) Guards — decide whether the request may proceed (authentication/authorization). (3) Interceptors (before) — wrap the handler. (4) Pipes — transform/validate the handler arguments. (5) the Route handler (controller → service). Then (6) Interceptors (after) can transform the response, and (7) Exception filters catch any error thrown anywhere and shape the error response. Middleware is configured in a module\'s configure() method; the rest can be bound at method, controller or global level.',
              keyPoints: [
                'Order: Middleware → Guards → Interceptors(pre) → Pipes → Handler → Interceptors(post) → Filters (on error).',
                'Middleware is configured via a module implementing NestModule.configure().',
                'Guards, interceptors, pipes and filters can be applied per-method, per-controller or globally.',
              ],
              diagram: {
                type: 'mermaid',
                lines: [
                  'flowchart LR',
                  '  Req[Request] --> MW[Middleware]',
                  '  MW --> G[Guards]',
                  '  G --> Ip[Interceptors pre]',
                  '  Ip --> P[Pipes]',
                  '  P --> H[Handler]',
                  '  H --> Ipost[Interceptors post]',
                  '  Ipost --> Res[Response]',
                  '  H -. throws .-> F[Exception filters]',
                  '  F --> Res',
                ],
                caption: 'The NestJS request lifecycle. Errors thrown anywhere are caught by exception filters and turned into a response.',
              },
              exercises: [
                {
                  type: 'quiz',
                  prompt: 'In the NestJS request lifecycle, do guards run before or after pipes?',
                  solution: { explanation: 'Before. Order is Middleware → Guards → Interceptors → Pipes → Handler, so guards run before pipes.' },
                },
                {
                  type: 'quiz',
                  prompt: 'Where is middleware configured?',
                  solution: { explanation: 'In a module that implements NestModule, inside its configure(consumer) method (using consumer.apply(...).forRoutes(...)).' },
                },
              ],
              docs: 'https://docs.nestjs.com/middleware',
            },
            {
              id: 'n2-t2-c1',
              title: 'Guards: authentication & authorization',
              summary:
                'A guard implements CanActivate and returns true/false to allow or deny a request. Guards are the place for auth checks.',
              explanation:
                'A guard is an @Injectable class implementing CanActivate, whose canActivate(context) returns a boolean (or a Promise/Observable of one). Returning false (or throwing) blocks the request — typically with a 403/401. Guards have access to the ExecutionContext, so they can read the request, the handler and its metadata. Apply a guard with @UseGuards(AuthGuard) on a method or controller, or globally with app.useGlobalGuards(). Guards run after middleware but before interceptors and pipes, which is exactly where access control belongs.',
              keyPoints: [
                'Guard = @Injectable implementing CanActivate; return true to allow, false/throw to deny.',
                'Apply with @UseGuards() (method/controller) or useGlobalGuards() (app-wide).',
                'Guards are the right layer for authentication and authorization.',
              ],
              code: {
                language: 'typescript',
                lines: [
                  "import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';",
                  '',
                  '@Injectable()',
                  'export class ApiKeyGuard implements CanActivate {',
                  '  canActivate(context: ExecutionContext): boolean {',
                  '    const req = context.switchToHttp().getRequest();',
                  '    if (req.headers["x-api-key"] !== process.env.API_KEY) {',
                  '      throw new UnauthorizedException();',
                  '    }',
                  '    return true;',
                  '  }',
                  '}',
                ],
                explanation:
                  'The guard reads the request from the ExecutionContext and allows it only when a valid API key header is present.',
              },
              exercises: [
                {
                  type: 'quiz',
                  prompt: 'What interface does a guard implement, and what does returning false do?',
                  solution: { explanation: 'CanActivate; returning false denies the request (Nest responds with a 403 Forbidden by default).' },
                },
              ],
              docs: 'https://docs.nestjs.com/guards',
            },
            {
              id: 'n2-t2-c2',
              title: 'Interceptors and exception filters',
              summary:
                'Interceptors wrap handler execution to transform input/output or add behaviour; exception filters catch thrown errors and shape the error response.',
              explanation:
                'An interceptor implements NestInterceptor and can run logic before and after the handler — perfect for logging, transforming the response shape, caching, or adding timeouts. It uses RxJS: you return next.handle().pipe(...) and operate on the response stream. Exception filters implement ExceptionFilter and are decorated with @Catch(SomeException); they take over how errors become responses. Nest already maps its built-in HttpExceptions (NotFoundException, BadRequestException, etc.) to proper status codes, so you usually only write a filter to customise the error body or handle a specific exception type.',
              keyPoints: [
                'Interceptor (NestInterceptor): wrap the handler — transform responses, log, cache, time out (RxJS-based).',
                'Exception filter (@Catch): converts thrown errors into HTTP responses.',
                'Throw built-in HttpExceptions for correct status codes without a custom filter.',
              ],
              code: {
                language: 'typescript',
                lines: [
                  "import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';",
                  "import { map } from 'rxjs';",
                  '',
                  '@Injectable()',
                  'export class WrapResponseInterceptor implements NestInterceptor {',
                  '  intercept(ctx: ExecutionContext, next: CallHandler) {',
                  '    return next.handle().pipe(map((data) => ({ data })));',
                  '  }',
                  '}',
                ],
                explanation:
                  'This interceptor wraps every response as { data: ... } by operating on the response stream after the handler runs.',
              },
              exercises: [
                {
                  type: 'quiz',
                  prompt: 'You want every successful response wrapped in a consistent envelope like { data: ... }. Guard, pipe, interceptor or filter?',
                  solution: { explanation: 'An interceptor — it can transform the response after the handler returns.' },
                },
                {
                  type: 'quiz',
                  prompt: 'Throwing `new NotFoundException()` from a service produces which HTTP status by default?',
                  solution: { explanation: '404 Not Found — Nest maps built-in HttpExceptions to their status codes automatically.' },
                },
              ],
              docs: 'https://docs.nestjs.com/interceptors',
            },
          ],
        },
      ],
    },

    /* ───────────────────── LEVEL 3 — DATA & CONFIG ───────────────────── */
    {
      level: 3,
      name: 'Data & Architecture',
      focus: 'Persistence, configuration, and structuring a growing application into modules',
      accent: '#1098ad',
      soft: '#e3f6f9',
      topics: [
        {
          id: 'n3-t0',
          name: 'Databases',
          concepts: [
            {
              id: 'n3-t0-c0',
              title: 'Connecting a database with TypeORM',
              summary:
                'NestJS integrates ORMs via dedicated modules. With @nestjs/typeorm you configure the connection once and define entities that map to tables.',
              explanation:
                'TypeOrmModule.forRoot() configures the database connection at the root (host, credentials, entities, synchronize). Each feature module then calls TypeOrmModule.forFeature([Entity]) to register the repositories it needs. An entity is a class decorated with @Entity whose properties map to columns via @Column, @PrimaryGeneratedColumn, etc. In development you might use synchronize:true to auto-create tables, but in production you use migrations instead, because synchronize can drop data.',
              keyPoints: [
                'TypeOrmModule.forRoot(): one-time connection config at the app root.',
                'TypeOrmModule.forFeature([Entity]): register repositories per feature module.',
                'Entities are classes with @Entity / @Column / @PrimaryGeneratedColumn.',
                'Use migrations in production; never rely on synchronize:true there.',
              ],
              code: {
                language: 'typescript',
                lines: [
                  "@Entity()",
                  'export class User {',
                  '  @PrimaryGeneratedColumn("uuid")',
                  '  id: string;',
                  '',
                  '  @Column()',
                  '  name: string;',
                  '',
                  '  @Column({ unique: true })',
                  '  email: string;',
                  '}',
                ],
                explanation:
                  'A User entity maps to a users table: an auto-generated UUID primary key plus name and a unique email column.',
              },
              commonMistakes: [
                'Leaving synchronize:true on in production — schema changes can silently drop columns/data.',
              ],
              exercises: [
                {
                  type: 'quiz',
                  prompt: 'Which method registers the entities/repositories a specific feature module needs?',
                  solution: { explanation: 'TypeOrmModule.forFeature([Entity]) inside that feature module.' },
                },
                {
                  type: 'quiz',
                  prompt: 'Why should synchronize:true be avoided in production?',
                  solution: { explanation: 'It auto-syncs the schema to your entities and can drop columns/tables and lose data. Use migrations instead.' },
                },
              ],
              docs: 'https://docs.nestjs.com/techniques/database',
            },
            {
              id: 'n3-t0-c1',
              title: 'Repositories and CRUD in services',
              summary:
                'Inject a repository into a service with @InjectRepository and use it to query and persist entities.',
              explanation:
                'A repository is TypeORM\'s data-access object for one entity. You inject it into a service with @InjectRepository(User) and get methods like find, findOne, create, save, update and delete. The service stays the single place that talks to the database, so controllers and the rest of the app remain persistence-agnostic. Returning entities directly is fine for simple apps; for public APIs, map entities to response DTOs to control exactly what you expose.',
              keyPoints: [
                '@InjectRepository(Entity) injects the entity\'s repository.',
                'Repository methods: find, findOne, create, save, update, delete.',
                'Keep all DB access inside services; consider mapping entities to response DTOs.',
              ],
              code: {
                language: 'typescript',
                lines: [
                  '@Injectable()',
                  'export class UsersService {',
                  '  constructor(',
                  '    @InjectRepository(User) private readonly repo: Repository<User>,',
                  '  ) {}',
                  '',
                  '  create(dto: CreateUserDto) {',
                  '    const user = this.repo.create(dto);',
                  '    return this.repo.save(user);',
                  '  }',
                  '',
                  '  findAll() {',
                  '    return this.repo.find();',
                  '  }',
                  '}',
                ],
                explanation:
                  'The service injects the User repository and uses it to create/persist and list users; create() builds an instance, save() writes it.',
              },
              exercises: [
                {
                  type: 'task',
                  prompt: 'Add a findOne(id) method that returns a single user by id using the repository.',
                  solution: {
                    lines: ['findOne(id: string) {', '  return this.repo.findOne({ where: { id } });', '}'],
                    explanation: 'Repository.findOne accepts options including a where clause to match by id.',
                  },
                },
              ],
              docs: 'https://docs.nestjs.com/techniques/database#repository-pattern',
            },
            {
              id: 'n3-t0-c2',
              title: 'Other data options: Prisma and Mongoose',
              summary:
                'TypeORM is not the only choice. Prisma is a popular type-safe ORM, and Mongoose is the standard for MongoDB.',
              explanation:
                'NestJS is database-agnostic. Prisma pairs a schema file with a generated, fully type-safe client; you typically wrap PrismaClient in an injectable PrismaService and inject it where needed. For MongoDB, @nestjs/mongoose mirrors the TypeORM approach: MongooseModule.forRoot() for the connection and forFeature() to register schemas, with documents defined via @Schema/@Prop. The pattern is always the same — a module configures the connection, and services inject the data-access object — so switching ORMs changes the implementation, not the architecture.',
              keyPoints: [
                'Prisma: schema-driven, type-safe client; wrap it in an injectable PrismaService.',
                'Mongoose (@nestjs/mongoose): forRoot()/forFeature(), schemas via @Schema/@Prop for MongoDB.',
                'The integration pattern (module configures connection, services inject access) is consistent across ORMs.',
              ],
              exercises: [
                {
                  type: 'quiz',
                  prompt: 'Which library would you reach for to model data in a MongoDB database with NestJS?',
                  solution: { explanation: 'Mongoose, via the @nestjs/mongoose integration.' },
                },
              ],
              docs: 'https://docs.nestjs.com/recipes/prisma',
            },
          ],
        },
        {
          id: 'n3-t1',
          name: 'Configuration',
          concepts: [
            {
              id: 'n3-t1-c0',
              title: 'Configuration and environment variables',
              summary:
                'The ConfigModule loads environment variables and exposes them through an injectable ConfigService — and can validate them at startup.',
              explanation:
                'Hard-coding secrets and URLs is a mistake. @nestjs/config\'s ConfigModule.forRoot() loads .env files and process env, and you read values via the injected ConfigService (cfg.get(\'DATABASE_URL\')). Register it with isGlobal:true so you don\'t re-import it everywhere. Crucially, supply a validationSchema (e.g. with Joi) so the app fails fast at boot if a required variable is missing or malformed — far better than discovering it at runtime in production.',
              keyPoints: [
                'ConfigModule.forRoot({ isGlobal: true }) loads .env / env vars app-wide.',
                'Read values via the injected ConfigService.get(key).',
                'Validate config at startup (e.g. Joi schema) so the app fails fast on bad/missing vars.',
                'Never commit secrets; keep them in environment variables.',
              ],
              code: {
                language: 'typescript',
                lines: [
                  '@Module({',
                  '  imports: [',
                  '    ConfigModule.forRoot({',
                  '      isGlobal: true,',
                  '      validationSchema: Joi.object({',
                  '        PORT: Joi.number().default(3000),',
                  '        DATABASE_URL: Joi.string().required(),',
                  '      }),',
                  '    }),',
                  '  ],',
                  '})',
                  'export class AppModule {}',
                ],
                explanation:
                  'ConfigModule is global and validates env vars at boot: a missing DATABASE_URL stops the app from starting.',
              },
              commonMistakes: [
                'Reading process.env directly all over the codebase instead of going through ConfigService.',
                'No validation schema — the app boots with bad config and fails later in production.',
              ],
              exercises: [
                {
                  type: 'quiz',
                  prompt: 'Why provide a validation schema to ConfigModule?',
                  solution: { explanation: 'So the app validates required env vars at startup and fails fast if any are missing or invalid, instead of crashing later at runtime.' },
                },
              ],
              docs: 'https://docs.nestjs.com/techniques/configuration',
            },
          ],
        },
        {
          id: 'n3-t2',
          name: 'Modular architecture',
          concepts: [
            {
              id: 'n3-t2-c0',
              title: 'Feature modules and global modules',
              summary:
                'Organise the app as feature modules; mark cross-cutting modules @Global so their exports are available everywhere without re-importing.',
              explanation:
                'As an app grows, split it into feature modules (UsersModule, OrdersModule, AuthModule), each owning its controllers, services and data access. A shared module can export common providers for others to import. For truly cross-cutting concerns used everywhere (config, logging, a database wrapper), mark the module with @Global() so its exported providers are available app-wide without importing the module in every feature. Use @Global sparingly — overusing it hides dependencies and undermines the clarity that modules give you.',
              keyPoints: [
                'Split the app into feature modules with clear ownership.',
                'Shared modules export common providers for others to import.',
                '@Global() makes a module\'s exports available everywhere — use sparingly.',
              ],
              exercises: [
                {
                  type: 'quiz',
                  prompt: 'What does marking a module with @Global() change?',
                  solution: { explanation: 'Its exported providers become available throughout the app without each feature module importing it explicitly.' },
                },
              ],
              docs: 'https://docs.nestjs.com/modules#global-modules',
            },
            {
              id: 'n3-t2-c1',
              title: 'Dynamic modules and the forRoot pattern',
              summary:
                'A dynamic module is configured at import time via a static method (commonly forRoot/forFeature) that returns module metadata.',
              explanation:
                'You\'ve seen ConfigModule.forRoot() and TypeOrmModule.forFeature() — these are dynamic modules. Instead of importing a fixed module, you call a static method that accepts options and returns a DynamicModule object (with module, providers, exports). This lets a reusable module be configured differently per app (different connection, different options) while still wiring everything through DI. It\'s the standard way library authors expose configurable modules.',
              keyPoints: [
                'Dynamic module: a static method (forRoot/forFeature) returns DynamicModule metadata.',
                'Lets one reusable module be configured per app via options.',
                'The pattern behind ConfigModule.forRoot(), TypeOrmModule.forFeature(), JwtModule.register(), etc.',
              ],
              code: {
                language: 'typescript',
                lines: [
                  '@Module({})',
                  'export class StorageModule {',
                  '  static forRoot(options: StorageOptions): DynamicModule {',
                  '    return {',
                  '      module: StorageModule,',
                  '      providers: [',
                  "        { provide: 'STORAGE_OPTIONS', useValue: options },",
                  '        StorageService,',
                  '      ],',
                  '      exports: [StorageService],',
                  '    };',
                  '  }',
                  '}',
                ],
                explanation:
                  'StorageModule.forRoot(options) returns a configured module: the options are provided via DI and StorageService is exported for consumers.',
              },
              exercises: [
                {
                  type: 'quiz',
                  prompt: 'What kind of module is being used when you write `JwtModule.register({ secret })` in an imports array?',
                  solution: { explanation: 'A dynamic module — register/forRoot is a static method returning configured module metadata.' },
                },
              ],
              docs: 'https://docs.nestjs.com/fundamentals/dynamic-modules',
            },
          ],
        },
      ],
    },

    /* ───────────────────── LEVEL 4 — ADVANCED & PRODUCTION ───────────────────── */
    {
      level: 4,
      name: 'Advanced & Production',
      focus: 'Authentication, testing, going beyond REST, and shipping to production',
      accent: '#2f9e44',
      soft: '#e6f5ec',
      topics: [
        {
          id: 'n4-t0',
          name: 'Authentication & authorization',
          concepts: [
            {
              id: 'n4-t0-c0',
              title: 'Authentication with Passport and JWT',
              summary:
                'NestJS integrates Passport for authentication. A common setup validates credentials, issues a JWT, and protects routes with a JWT guard.',
              explanation:
                'Authentication answers "who are you?". The @nestjs/passport + @nestjs/jwt packages provide a clean flow: an AuthService verifies the user\'s credentials and uses JwtService to sign a token; the client sends that token as a Bearer header on later requests; a JwtStrategy validates the token and attaches the user to the request; and a guard (AuthGuard(\'jwt\')) protects routes. JwtModule.register() configures the secret and expiry. Store secrets in env vars (via ConfigService), never in code.',
              keyPoints: [
                'Authentication = verifying identity (who you are).',
                '@nestjs/passport + @nestjs/jwt: validate credentials → sign a JWT → client sends it as a Bearer token.',
                'A JwtStrategy validates tokens; AuthGuard("jwt") protects routes.',
                'Keep the JWT secret in environment variables, not in source.',
              ],
              code: {
                language: 'typescript',
                lines: [
                  '@Injectable()',
                  'export class AuthService {',
                  '  constructor(private readonly jwt: JwtService, private readonly users: UsersService) {}',
                  '',
                  '  async login(email: string, password: string) {',
                  '    const user = await this.users.verify(email, password);',
                  '    if (!user) throw new UnauthorizedException();',
                  '    return { access_token: await this.jwt.signAsync({ sub: user.id, email }) };',
                  '  }',
                  '}',
                ],
                explanation:
                  'On valid credentials the service signs a JWT containing the user id (sub) and returns it; invalid credentials throw 401.',
              },
              exercises: [
                {
                  type: 'quiz',
                  prompt: 'After issuing a JWT, how does a client typically prove its identity on later requests, and what protects the route?',
                  solution: { explanation: 'It sends the token in an Authorization: Bearer <token> header; an AuthGuard("jwt") + JwtStrategy validate it and attach the user to the request.' },
                },
              ],
              docs: 'https://docs.nestjs.com/security/authentication',
            },
            {
              id: 'n4-t0-c1',
              title: 'Role-based authorization with metadata and Reflector',
              summary:
                'Authorization decides "what can you do?". A custom @Roles decorator attaches metadata that a guard reads via Reflector to allow or deny.',
              explanation:
                'Authorization is separate from authentication. A common pattern: create a @Roles(\'admin\') decorator using SetMetadata, then a RolesGuard that uses the Reflector to read that metadata for the current handler and compares it against the authenticated user\'s roles (set earlier by the auth guard). If the user lacks the required role, the guard denies the request. This keeps access rules declarative — you annotate handlers with the roles they require, and one guard enforces them everywhere.',
              keyPoints: [
                'Authorization = what an authenticated user is allowed to do.',
                'Custom @Roles() decorator attaches metadata via SetMetadata.',
                'A RolesGuard reads it with Reflector and checks the user\'s roles.',
                'Declarative: annotate handlers; one guard enforces the rules.',
              ],
              code: {
                language: 'typescript',
                lines: [
                  "export const Roles = (...roles: string[]) => SetMetadata('roles', roles);",
                  '',
                  '@Injectable()',
                  'export class RolesGuard implements CanActivate {',
                  '  constructor(private reflector: Reflector) {}',
                  '  canActivate(ctx: ExecutionContext): boolean {',
                  "    const required = this.reflector.get<string[]>('roles', ctx.getHandler());",
                  '    if (!required) return true;',
                  '    const { user } = ctx.switchToHttp().getRequest();',
                  '    return required.some((r) => user.roles?.includes(r));',
                  '  }',
                  '}',
                ],
                explanation:
                  'The guard reads the @Roles metadata for the handler and allows the request only if the user has one of the required roles.',
              },
              exercises: [
                {
                  type: 'quiz',
                  prompt: 'What does a RolesGuard use to read the roles metadata attached to a handler?',
                  solution: { explanation: 'The Reflector — reflector.get("roles", context.getHandler()).' },
                },
                {
                  type: 'quiz',
                  prompt: 'Authentication vs authorization — which one is "what are you allowed to do"?',
                  solution: { explanation: 'Authorization. Authentication is "who are you"; authorization is "what may you do".' },
                },
              ],
              docs: 'https://docs.nestjs.com/security/authorization',
            },
          ],
        },
        {
          id: 'n4-t1',
          name: 'Testing',
          concepts: [
            {
              id: 'n4-t1-c0',
              title: 'Unit testing with the Nest testing module',
              summary:
                'Test.createTestingModule builds an isolated DI container for tests, letting you provide mocks for a class\'s dependencies.',
              explanation:
                'Because everything is injected, units are easy to isolate. Test.createTestingModule({...}) creates a testing module where you register the class under test and replace its dependencies with mocks (commonly via { provide: Dep, useValue: mock }). You compile it, resolve the instance with module.get(), and assert behaviour with Jest (Nest\'s default test runner). This tests your service/controller logic without a database or HTTP server.',
              keyPoints: [
                'Test.createTestingModule builds an isolated DI container for the unit.',
                'Replace dependencies with mocks via useValue.',
                'Resolve with module.get(Class); assert with Jest.',
                'No real DB/HTTP needed for unit tests.',
              ],
              code: {
                language: 'typescript',
                lines: [
                  "describe('UsersService', () => {",
                  '  let service: UsersService;',
                  '  const repo = { find: jest.fn().mockResolvedValue([]) };',
                  '',
                  '  beforeEach(async () => {',
                  '    const moduleRef = await Test.createTestingModule({',
                  '      providers: [',
                  '        UsersService,',
                  '        { provide: getRepositoryToken(User), useValue: repo },',
                  '      ],',
                  '    }).compile();',
                  '    service = moduleRef.get(UsersService);',
                  '  });',
                  '',
                  "  it('returns all users', async () => {",
                  '    expect(await service.findAll()).toEqual([]);',
                  '  });',
                  '});',
                ],
                explanation:
                  'The repository is replaced with a mock, so UsersService is tested in isolation without touching a real database.',
              },
              exercises: [
                {
                  type: 'quiz',
                  prompt: 'How do you replace a real dependency (like a repository) with a mock in a Nest testing module?',
                  solution: { explanation: 'Register it with { provide: Token, useValue: mockObject } in the testing module\'s providers.' },
                },
              ],
              docs: 'https://docs.nestjs.com/fundamentals/testing',
            },
            {
              id: 'n4-t1-c1',
              title: 'End-to-end testing',
              summary:
                'E2E tests boot the whole application and fire real HTTP requests at it (commonly with supertest) to verify behaviour through every layer.',
              explanation:
                'Unit tests check pieces in isolation; e2e tests verify the system as a whole. You create the full app from AppModule in a testing module, call app.init(), then use supertest against app.getHttpServer() to make requests and assert on status codes and response bodies. E2E tests exercise the real request lifecycle — guards, pipes, interceptors, filters and the database (often a test database) — giving confidence that the wired-up app behaves correctly.',
              keyPoints: [
                'E2E boots the real app (AppModule) and sends real HTTP requests.',
                'supertest against app.getHttpServer() asserts status + body.',
                'Exercises the full lifecycle: guards, pipes, interceptors, filters, DB.',
              ],
              code: {
                language: 'typescript',
                lines: [
                  "it('/users (GET)', () => {",
                  '  return request(app.getHttpServer())',
                  "    .get('/users')",
                  '    .expect(200)',
                  '    .expect((res) => expect(Array.isArray(res.body)).toBe(true));',
                  '});',
                ],
                explanation:
                  'A supertest request hits the running app and asserts a 200 with an array body — verifying the whole stack end to end.',
              },
              exercises: [
                {
                  type: 'quiz',
                  prompt: 'What is the main difference between a unit test and an e2e test in NestJS?',
                  solution: { explanation: 'A unit test isolates one class with mocked dependencies; an e2e test boots the whole app and sends real HTTP requests through the full request lifecycle.' },
                },
              ],
              docs: 'https://docs.nestjs.com/fundamentals/testing#end-to-end-testing',
            },
          ],
        },
        {
          id: 'n4-t2',
          name: 'Beyond REST',
          concepts: [
            {
              id: 'n4-t2-c0',
              title: 'API documentation with OpenAPI (Swagger)',
              summary:
                'The @nestjs/swagger package generates an interactive OpenAPI spec from your controllers, DTOs and decorators.',
              explanation:
                'Good APIs are documented. @nestjs/swagger inspects your routes and DTOs to build an OpenAPI (Swagger) document and serves an interactive UI. You set it up in main.ts with DocumentBuilder and SwaggerModule.setup(\'docs\', app, document), and enrich it with decorators like @ApiTags, @ApiProperty (on DTO fields) and @ApiResponse. Because it reads the same DTOs your validation uses, the docs stay close to the real contract.',
              keyPoints: [
                '@nestjs/swagger generates an OpenAPI spec + interactive UI from your code.',
                'Set up with DocumentBuilder + SwaggerModule.setup() in main.ts.',
                'Enrich with @ApiTags, @ApiProperty, @ApiResponse.',
              ],
              exercises: [
                {
                  type: 'quiz',
                  prompt: 'Which official package generates interactive OpenAPI/Swagger docs for a NestJS API?',
                  solution: { explanation: '@nestjs/swagger.' },
                },
              ],
              docs: 'https://docs.nestjs.com/openapi/introduction',
            },
            {
              id: 'n4-t2-c1',
              title: 'GraphQL, WebSockets and microservices',
              summary:
                'NestJS is transport-agnostic: the same modules/providers power REST, GraphQL APIs, real-time WebSocket gateways, and microservices.',
              explanation:
                'Your business logic (services) doesn\'t change with the transport. For GraphQL, @nestjs/graphql supports a code-first approach where resolvers (@Resolver, @Query, @Mutation) replace controllers. For real-time, WebSocket gateways (@WebSocketGateway, @SubscribeMessage) handle bidirectional events. For distributed systems, Nest microservices communicate over transports like TCP, Redis, NATS, RabbitMQ or Kafka, using message patterns (@MessagePattern) and event patterns (@EventPattern) instead of HTTP routes. The architecture — modules, DI, providers — stays identical; only the entry layer changes.',
              keyPoints: [
                'GraphQL (@nestjs/graphql): resolvers with @Query/@Mutation (code-first or schema-first).',
                'WebSockets: gateways with @WebSocketGateway / @SubscribeMessage for real-time events.',
                'Microservices: transports (TCP, Redis, NATS, RabbitMQ, Kafka) with @MessagePattern / @EventPattern.',
                'Same modules/providers/DI across all transports — only the entry layer changes.',
              ],
              exercises: [
                {
                  type: 'quiz',
                  prompt: 'In a NestJS microservice, what replaces an HTTP route decorator for handling an incoming message?',
                  solution: { explanation: '@MessagePattern (for request-response) or @EventPattern (for fire-and-forget events).' },
                },
                {
                  type: 'quiz',
                  prompt: 'In a code-first GraphQL setup, what plays the role that controllers play in REST?',
                  solution: { explanation: 'Resolvers (classes with @Resolver, using @Query and @Mutation handlers).' },
                },
              ],
              docs: 'https://docs.nestjs.com/microservices/basics',
            },
          ],
        },
        {
          id: 'n4-t3',
          name: 'Cross-cutting & deployment',
          concepts: [
            {
              id: 'n4-t3-c0',
              title: 'Cross-cutting concerns: caching, scheduling, queues, logging',
              summary:
                'NestJS ships modules for common production needs: caching, scheduled tasks, background queues, and structured logging.',
              explanation:
                'Real apps need more than request handling. CacheModule adds response/data caching (in-memory or Redis). @nestjs/schedule lets you run jobs on a cron with @Cron, or on intervals/timeouts. For heavy or asynchronous work, offload to a background queue (e.g. BullMQ via @nestjs/bullmq) so requests stay fast and work is retried on failure. Nest has a built-in Logger you can inject and customise, or replace with a structured logger (e.g. Pino) for production-grade logs. Reach for these instead of hand-rolling cross-cutting infrastructure.',
              keyPoints: [
                'CacheModule: in-memory or Redis caching.',
                '@nestjs/schedule: @Cron jobs, intervals and timeouts.',
                'Queues (BullMQ): offload heavy/async work with retries.',
                'Built-in Logger (or Pino) for structured logging.',
              ],
              exercises: [
                {
                  type: 'quiz',
                  prompt: 'You need to run a cleanup job every night at 2am. Which NestJS package and decorator fit?',
                  solution: { explanation: '@nestjs/schedule with the @Cron() decorator.' },
                },
                {
                  type: 'quiz',
                  prompt: 'A request triggers slow work (e.g. sending many emails). What keeps the request fast and makes the work retryable?',
                  solution: { explanation: 'Offload it to a background queue (e.g. BullMQ via @nestjs/bullmq) and process it asynchronously.' },
                },
              ],
              docs: 'https://docs.nestjs.com/techniques/caching',
            },
            {
              id: 'n4-t3-c1',
              title: 'Production hardening and deployment',
              summary:
                'Before shipping: build to JavaScript, externalise config, secure HTTP, enable CORS sensibly, version the API, and expose health checks.',
              explanation:
                'For production you compile the app (nest build) and run the compiled output with NODE_ENV=production. Externalise all config via environment variables (validated by ConfigModule). Add security headers (e.g. helmet), configure CORS to allow only the origins you trust, and consider rate limiting (@nestjs/throttler). Version your API (URI or header versioning) so you can evolve it without breaking clients. Expose a health-check endpoint (@nestjs/terminus) so orchestrators can tell whether the app and its dependencies are healthy. Finally, handle shutdown gracefully so in-flight requests finish.',
              keyPoints: [
                'Build with nest build; run compiled JS with NODE_ENV=production.',
                'Security: helmet headers, strict CORS, rate limiting (@nestjs/throttler).',
                'API versioning to evolve without breaking clients.',
                'Health checks (@nestjs/terminus) and graceful shutdown.',
              ],
              exercises: [
                {
                  type: 'quiz',
                  prompt: 'Which NestJS package provides readiness/liveness health-check endpoints for orchestrators?',
                  solution: { explanation: '@nestjs/terminus.' },
                },
                {
                  type: 'task',
                  prompt: 'Name two HTTP-security measures you should enable before exposing a NestJS API publicly.',
                  solution: {
                    explanation: 'Security headers via helmet and a restrictive CORS policy (and ideally rate limiting via @nestjs/throttler).',
                  },
                },
              ],
              docs: 'https://docs.nestjs.com/techniques/security',
            },
          ],
        },
      ],
    },
  ],
};

export default content;
