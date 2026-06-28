// TypeScript — course content. Original explanations written for self-study; same schema as the other courses.
const content = {
  meta: {
    title: 'TypeScript: Typed JavaScript at Scale',
    description:
      'Learn TypeScript from the ground up: why static typing matters, the type system from primitives to advanced conditional and mapped types, classes and OOP, generics and the utility types, and the real-world tooling (tsconfig, declaration files, Node and React) you need to ship typed code with confidence.',
    schemaVersion: '1.0',
    status: 'complete',
  },
  levels: [
    /* ───────────────────── LEVEL 1 — FUNDAMENTALS ───────────────────── */
    {
      level: 1,
      name: 'Fundamentals',
      focus: 'Why TypeScript exists, the basic types, and typing functions',
      accent: '#3178c6',
      soft: '#e6effa',
      topics: [
        {
          id: 'ts1-t0',
          name: 'Why TypeScript',
          concepts: [
            {
              id: 'ts1-t0-c0',
              title: 'TypeScript is a typed superset of JavaScript',
              summary:
                'TypeScript adds an optional static type layer on top of JavaScript. Every valid JavaScript program is already valid TypeScript, so you adopt it gradually.',
              explanation:
                'TypeScript was created by Microsoft to make large JavaScript codebases maintainable. It is a strict syntactical superset of JavaScript: any .js file is also a valid .ts file, which means you can rename files and add types incrementally rather than rewriting everything. The extra syntax is type annotations and a handful of constructs (interfaces, enums, generics) that describe the shape of your data. None of these types exist at runtime — they are checked by the compiler and then erased, so the JavaScript you ship behaves exactly as it would have without TypeScript. The payoff is that whole classes of bugs (passing a string where a number is expected, calling a method that does not exist) are caught while you type instead of in production.',
              analogy:
                'JavaScript is a recipe written in plain prose. TypeScript is the same recipe with the ingredients and measurements labelled, so you notice before cooking that you grabbed salt instead of sugar.',
              keyPoints: [
                'Every valid JavaScript program is valid TypeScript — adoption is incremental.',
                'Types are checked at compile time and erased; they do not exist at runtime.',
                'It targets correctness and maintainability in large codebases.',
                'Created and maintained by Microsoft; the type layer is optional and additive.',
              ],
              diagram: {
                type: 'mermaid',
                lines: [
                  'flowchart LR',
                  '  JS[JavaScript] --> TS[TypeScript adds types]',
                  '  TS --> Check[Type checker]',
                  '  Check --> Plain[Plain JavaScript]',
                ],
                caption: 'TypeScript layers static types over JavaScript; the checker validates them and emits ordinary JavaScript.',
              },
              code: {
                language: 'typescript',
                lines: [
                  'function greet(name: string): string {',
                  "  return 'Hello, ' + name;",
                  '}',
                  '',
                  "greet('Ada');",
                  'greet(42); // Error: number is not assignable to string',
                ],
                explanation:
                  'The annotations name: string and the return type are TypeScript-only; they catch the bad call to greet(42) before the code ever runs.',
              },
              exercises: [
                {
                  type: 'quiz',
                  prompt: 'Is a valid JavaScript file also a valid TypeScript file?',
                  hint: 'Think about what superset means.',
                  solution: {
                    explanation:
                      'Yes. TypeScript is a syntactical superset of JavaScript, so any .js content is valid TypeScript; you simply add types where you want them.',
                  },
                },
                {
                  type: 'predict',
                  prompt: 'At runtime, can you inspect the type annotation string from let x: string = "hi"?',
                  solution: {
                    explanation:
                      'No. Type annotations are erased during compilation, so at runtime there is no trace of : string — only the plain JavaScript value remains.',
                  },
                },
                {
                  type: 'task',
                  prompt: 'Write a one-line statement that the type checker would reject because of a type mismatch.',
                  solution: {
                    lines: ['const age: number = "thirty";'],
                    explanation: 'Assigning a string literal to a variable annotated as number is a compile-time error.',
                  },
                },
              ],
              docs: 'https://www.typescriptlang.org/docs/handbook/typescript-from-scratch.html',
            },
            {
              id: 'ts1-t0-c1',
              title: 'Static typing and the problems it solves',
              summary:
                'Static typing means types are known and checked before the program runs. It turns silent runtime failures into explicit, early errors.',
              explanation:
                'JavaScript is dynamically typed: a variable can hold a number now and a string later, and mistakes only surface when the offending line actually executes — often in front of a user. Static typing flips this around by analysing the code without running it, so the editor underlines the bug the moment you write it. Beyond catching errors, types act as always-correct documentation: a function signature tells you exactly what to pass and what you get back. They also power tooling — autocomplete, safe renames, jump-to-definition, and refactors that the editor can verify across thousands of files. Importantly, TypeScript is structurally typed: compatibility is decided by an object\'s shape, not by an explicit name or declared class. This makes the type system flexible while still strict about what operations are valid.',
              analogy:
                'Dynamic typing is testing whether a bridge holds by driving a truck across it. Static typing is an engineer checking the blueprints first.',
              keyPoints: [
                'Static = checked before execution; dynamic = checked while running.',
                'Catches type mismatches early and serves as living documentation.',
                'Enables editor features: autocomplete, safe rename, go-to-definition.',
                'TypeScript uses structural typing — shape compatibility, not nominal names.',
              ],
              code: {
                language: 'typescript',
                lines: [
                  'type Point = { x: number; y: number };',
                  '',
                  'function length(p: Point): number {',
                  '  return Math.sqrt(p.x * p.x + p.y * p.y);',
                  '}',
                  '',
                  'const here = { x: 3, y: 4, label: "origin" };',
                  'length(here); // OK: shape includes x and y (structural typing)',
                ],
                explanation:
                  'here is accepted because it structurally satisfies Point — it has x and y of type number — even though it was never declared as a Point.',
              },
              commonMistakes: [
                'Assuming TypeScript checks types at runtime — it does not; it checks at compile time.',
                'Expecting nominal typing (matching by class name) when TypeScript matches by structure.',
              ],
              exercises: [
                {
                  type: 'quiz',
                  prompt: 'What is the difference between static and dynamic typing?',
                  solution: {
                    explanation:
                      'Static typing checks types before the program runs (at compile time); dynamic typing checks them as the code executes at runtime.',
                  },
                },
                {
                  type: 'predict',
                  prompt: 'Given Point = { x: number; y: number }, will an object { x: 1, y: 2, z: 3 } stored in a variable be accepted where a Point is expected?',
                  hint: 'Consider structural typing and excess property checks.',
                  solution: {
                    explanation:
                      'Yes, when passed via a variable. Structural typing accepts it because it has the required x and y. (A direct object literal would trigger an excess-property check on z.)',
                  },
                },
                {
                  type: 'task',
                  prompt: 'Name two editor features that static types make reliable.',
                  solution: {
                    explanation: 'Examples: accurate autocomplete, safe project-wide rename, go-to-definition, and verified refactors.',
                  },
                },
              ],
              docs: 'https://www.typescriptlang.org/docs/handbook/2/basic-types.html',
            },
            {
              id: 'ts1-t0-c2',
              title: 'The compile step: tsc and type erasure',
              summary:
                'The TypeScript compiler (tsc) checks your types and transpiles .ts files into plain .js. Type checking and code emission are two separate jobs.',
              explanation:
                'Browsers and Node cannot run TypeScript directly, so a build step converts it. The official compiler is tsc, installed from the typescript npm package. When you run it, tsc does two things: it type-checks the program and it emits JavaScript at the target syntax level you choose. These steps are decoupled — by default tsc still emits JavaScript even when there are type errors, because the types are advisory unless you turn on noEmitOnError. During emission all type annotations are stripped out (type erasure), leaving runnable JavaScript. Many projects pair tsc with a faster bundler such as esbuild, swc, or Vite for the actual transform and use tsc only as a type checker via tsc --noEmit. A tsconfig.json file configures all of this in one place.',
              analogy:
                'tsc is like a translator who first proofreads your annotated draft for mistakes, then hands over a clean copy with all the editing notes removed.',
              keyPoints: [
                'tsc both type-checks and transpiles TypeScript to JavaScript.',
                'Annotations are erased on emit — the output is plain JavaScript.',
                'By default tsc emits even with errors; noEmitOnError changes that.',
                'tsc --noEmit type-checks only; tsconfig.json holds the settings.',
              ],
              diagram: {
                type: 'mermaid',
                lines: [
                  'flowchart LR',
                  '  Src[app.ts] --> Tsc[tsc compiler]',
                  '  Tsc --> Check[Type check]',
                  '  Tsc --> Emit[Emit JS]',
                  '  Emit --> Out[app.js]',
                ],
                caption: 'tsc performs two distinct jobs on each source file: it checks the types and it emits JavaScript.',
              },
              code: {
                language: 'typescript',
                lines: [
                  '// Install and run the compiler',
                  '// npm install --save-dev typescript',
                  '// npx tsc app.ts        -> produces app.js',
                  '// npx tsc --noEmit      -> type-check only, no output files',
                  '// npx tsc --init        -> create a tsconfig.json',
                ],
                explanation:
                  'tsc app.ts compiles a single file; with a tsconfig.json present, running tsc compiles the whole project according to its settings.',
              },
              exercises: [
                {
                  type: 'quiz',
                  prompt: 'What are the two separate jobs the tsc compiler performs?',
                  solution: {
                    explanation: 'It type-checks the program and it emits (transpiles) JavaScript. The two jobs are independent of each other.',
                  },
                },
                {
                  type: 'predict',
                  prompt: 'If app.ts has a type error and noEmitOnError is off, will tsc still create app.js?',
                  hint: 'Type checking and emit are decoupled by default.',
                  solution: {
                    explanation: 'Yes. By default tsc reports the error but still emits app.js. Set noEmitOnError to true to block emission on errors.',
                  },
                },
                {
                  type: 'task',
                  prompt: 'Write the command that type-checks a project without producing any output files.',
                  solution: {
                    lines: ['npx tsc --noEmit'],
                    explanation: 'The --noEmit flag runs the checker only, which is the common pattern when a separate bundler does the transpilation.',
                  },
                },
              ],
              docs: 'https://www.typescriptlang.org/docs/handbook/compiler-options.html',
            },
          ],
        },
        {
          id: 'ts1-t1',
          name: 'Basic types',
          concepts: [
            {
              id: 'ts1-t1-c0',
              title: 'Primitives, annotations and inference',
              summary:
                'The core primitive types are string, number and boolean. You can annotate variables explicitly, but TypeScript also infers types automatically.',
              explanation:
                'TypeScript\'s lowercase primitive types — string, number, boolean — describe the everyday JavaScript values, plus null, undefined, bigint and symbol. You attach a type with a colon after the name, as in let count: number. However, you rarely need to annotate everything: when you initialise a variable, TypeScript infers its type from the value, so const name = "Ada" is already typed as string. A subtle but important detail is const versus let: const name = "Ada" infers the narrow literal type "Ada" because the binding can never change, while let name = "Ada" infers the wider string. Good style is to let inference do the work for local variables and reserve explicit annotations for function parameters, public APIs, and places where you want a wider or more specific type than what was inferred.',
              analogy:
                'Inference is like a good sommelier who tastes a wine and names the grape without reading the label — you only spell it out when you want to be unmistakable.',
              keyPoints: [
                'Primitive types are lowercase: string, number, boolean (also null, undefined, bigint, symbol).',
                'Annotate with a colon: let total: number = 0.',
                'Inference types most local variables from their initial value.',
                'const infers a literal type; let infers the wider primitive type.',
              ],
              code: {
                language: 'typescript',
                lines: [
                  "let title: string = 'Intro';   // explicit annotation",
                  'let count = 0;                 // inferred as number',
                  'let active = true;             // inferred as boolean',
                  '',
                  "const role = 'admin';          // inferred as the literal 'admin'",
                  "let mode = 'admin';            // inferred as the wider string",
                ],
                explanation:
                  'count and active need no annotation because inference reads the initial value; role narrows to a literal type only because it is const.',
              },
              commonMistakes: [
                'Annotating every local variable when inference already gives the right type.',
                'Using the wrapper types String, Number, Boolean (capitalised) instead of the lowercase primitives.',
              ],
              exercises: [
                {
                  type: 'predict',
                  prompt: 'What type is inferred for const x = 10 versus let y = 10?',
                  solution: {
                    explanation: 'const x is inferred as the literal type 10; let y is inferred as the wider number, because y can be reassigned.',
                  },
                },
                {
                  type: 'quiz',
                  prompt: 'Why are lowercase string/number/boolean preferred over String/Number/Boolean?',
                  hint: 'One pair is the primitive, the other is the object wrapper.',
                  solution: {
                    explanation: 'Lowercase names are the primitive types you actually use; the capitalised ones are the rarely needed object wrapper types and should be avoided.',
                  },
                },
                {
                  type: 'task',
                  prompt: 'Declare a constant for a maximum retry count of 3 and let inference type it.',
                  solution: {
                    lines: ['const MAX_RETRIES = 3;'],
                    explanation: 'Inference gives it the literal type 3; no annotation is necessary.',
                  },
                },
              ],
              docs: 'https://www.typescriptlang.org/docs/handbook/2/everyday-types.html',
            },
            {
              id: 'ts1-t1-c1',
              title: 'Arrays and tuples',
              summary:
                'Arrays hold many values of one type; tuples are fixed-length arrays where each position has its own type.',
              explanation:
                'You type an array two equivalent ways: number[] or Array<number>. The square-bracket form is the common convention. An array type says nothing about length — only that every element is of the given type. When you need a fixed-length collection where position matters, you use a tuple: [string, number] means exactly a string followed by a number, and TypeScript tracks the type at each index. Tuples are how React\'s useState return value is typed, for example. You can give tuple elements labels for readability ([name: string, age: number]) and use a rest element to express a fixed start followed by variadic items ([string, ...number[]]). Be aware that arrays inferred from a literal default to the wide array type, so use a tuple annotation or a const assertion when you specifically need the tuple shape.',
              analogy:
                'An array is a shelf that holds any number of identical books. A tuple is a fixed display case with a labelled slot for each different item.',
              keyPoints: [
                'Array types: number[] or Array<number> — length is unconstrained.',
                'Tuples have a fixed length and a type per position: [string, number].',
                'Tuple elements can be labelled and can include a rest element.',
                'Inference defaults to arrays; ask for a tuple explicitly or with as const.',
              ],
              code: {
                language: 'typescript',
                lines: [
                  'const scores: number[] = [90, 85, 100];',
                  "const names: Array<string> = ['Ada', 'Linus'];",
                  '',
                  "const pair: [string, number] = ['age', 42];",
                  'pair[0].toUpperCase(); // index 0 is string',
                  'pair[1].toFixed(2);    // index 1 is number',
                  '',
                  "type Labeled = [name: string, ...rest: number[]];",
                ],
                explanation:
                  'scores and names are homogeneous arrays; pair is a tuple where each index has a distinct, known type. Labeled shows labels plus a rest element.',
              },
              exercises: [
                {
                  type: 'quiz',
                  prompt: 'What is the key difference between number[] and a tuple like [number, number]?',
                  solution: {
                    explanation: 'number[] is any-length array of numbers; [number, number] is a fixed length of exactly two numbers, with a type known at each position.',
                  },
                },
                {
                  type: 'predict',
                  prompt: 'For const t: [string, number] = ["x", 1], what type does t[1] have?',
                  solution: { explanation: 'number — the tuple tracks the type at each index, and index 1 was declared as number.' },
                },
                {
                  type: 'task',
                  prompt: 'Declare a tuple type for an RGB colour: three numbers.',
                  solution: {
                    lines: ['type RGB = [number, number, number];'],
                    explanation: 'A fixed-length tuple of three numbers precisely models a red/green/blue triple.',
                  },
                },
              ],
              docs: 'https://www.typescriptlang.org/docs/handbook/2/objects.html#tuple-types',
            },
            {
              id: 'ts1-t1-c2',
              title: 'any, unknown and never',
              summary:
                'any disables type checking; unknown is the safe top type you must narrow before use; never is the bottom type for values that cannot exist.',
              explanation:
                'These three special types sit at the edges of the type system. any opts a value out of all checking — anything is assignable to it and you can do anything with it — which is convenient but defeats the point of TypeScript, so it should be a last resort. unknown is the type-safe counterpart: any value is assignable to unknown, but you cannot use an unknown value until you narrow it (with a typeof check, a type guard, etc.), making it the correct type for genuinely untyped input like JSON.parse results. never is the opposite extreme: it is the type with no values, used for functions that never return (they throw or loop forever) and as the type of a variable in a branch the compiler has proven is impossible — which is the basis of exhaustiveness checking in switch statements. Reaching for unknown over any is one of the highest-value habits in idiomatic TypeScript.',
              analogy:
                'any is a blank cheque anyone can cash. unknown is a sealed parcel you must open and inspect before you trust the contents. never is an empty box that, by definition, can never contain anything.',
              keyPoints: [
                'any turns off type checking for that value — use sparingly.',
                'unknown accepts any value but forbids use until you narrow it.',
                'Prefer unknown over any for untrusted or untyped input.',
                'never has no values: non-returning functions and impossible branches.',
              ],
              code: {
                language: 'typescript',
                lines: [
                  'let a: any = 5;',
                  'a.foo.bar();          // allowed (no checking) — dangerous',
                  '',
                  'let u: unknown = JSON.parse("{}");',
                  '// u.trim();          // Error: must narrow first',
                  "if (typeof u === 'string') {",
                  '  u.trim();           // OK here: narrowed to string',
                  '}',
                  '',
                  'function fail(msg: string): never {',
                  '  throw new Error(msg);',
                  '}',
                ],
                explanation:
                  'any lets the unsafe call through; unknown forces the typeof guard before use; fail returns never because it always throws.',
              },
              commonMistakes: [
                'Defaulting to any to silence errors instead of modelling the real type or using unknown.',
                'Trying to operate on an unknown value without first narrowing it.',
              ],
              exercises: [
                {
                  type: 'quiz',
                  prompt: 'Why is unknown safer than any for the result of JSON.parse?',
                  solution: {
                    explanation: 'unknown forces you to check the value before using it, so you cannot accidentally call methods that may not exist; any would allow any operation with no checks.',
                  },
                },
                {
                  type: 'predict',
                  prompt: 'Does the line let s: string = someUnknownValue compile?',
                  hint: 'Which direction of assignment does unknown allow?',
                  solution: {
                    explanation: 'No. You can assign anything to unknown, but you cannot assign an unknown directly to string without narrowing first.',
                  },
                },
                {
                  type: 'task',
                  prompt: 'Write a function signature for a function that always throws and therefore never returns.',
                  solution: {
                    lines: ['function panic(message: string): never;'],
                    explanation: 'A function that always throws (or loops forever) has the return type never.',
                  },
                },
              ],
              docs: 'https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#any',
            },
          ],
        },
        {
          id: 'ts1-t2',
          name: 'Functions',
          concepts: [
            {
              id: 'ts1-t2-c0',
              title: 'Parameter types, return types and void',
              summary:
                'You annotate each parameter and, optionally, the return type. void describes a function whose return value is meant to be ignored.',
              explanation:
                'A typed function annotates each parameter and can declare its return type after the parameter list. In practice you almost always type the parameters but let TypeScript infer the return type, since it can compute it from the body — an explicit return annotation is useful mainly to lock in an intended contract or to catch accidental drift. The void type means the function does not return a useful value; it is the inferred type of a function that has no return statement. A pragmatic quirk: a function typed to return void can still return a value, and that value is simply ignored — this is what lets you pass, say, array.push (which returns a number) as a void callback to forEach without complaint. Use void for callbacks and side-effecting functions, and undefined only when you specifically require the literal undefined to be returned.',
              analogy:
                'Annotating parameters is labelling the inputs of a machine; the return type is the label on its output chute. void means the chute is there for show — whatever falls out is discarded.',
              keyPoints: [
                'Annotate each parameter; the return type is usually inferred.',
                'An explicit return type documents and enforces the intended contract.',
                'void means no useful return value; it is inferred when there is no return.',
                'A void-returning function type accepts callbacks that do return a value (ignored).',
              ],
              code: {
                language: 'typescript',
                lines: [
                  'function add(a: number, b: number): number {',
                  '  return a + b;',
                  '}',
                  '',
                  'function log(message: string): void {',
                  '  console.log(message);',
                  '}',
                  '',
                  'const nums: number[] = [];',
                  '[1, 2].forEach((n) => nums.push(n)); // push returns number; ok as void callback',
                ],
                explanation:
                  'add returns number; log returns void. The forEach callback returns push\'s number, which is harmlessly ignored because the expected callback type is void.',
              },
              exercises: [
                {
                  type: 'quiz',
                  prompt: 'When is it worth writing an explicit return type instead of relying on inference?',
                  solution: {
                    explanation: 'When you want to lock in an intended contract for a public API or catch accidental changes to what the function returns; otherwise inference is usually enough.',
                  },
                },
                {
                  type: 'predict',
                  prompt: 'Can a function with return type void contain return someValue?',
                  hint: 'Think about the void-callback rule.',
                  solution: {
                    explanation: 'Yes for a function typed as returning void via a function type: the returned value is allowed but ignored. This is what makes array.push usable as a forEach callback.',
                  },
                },
                {
                  type: 'task',
                  prompt: 'Write a function multiply that takes two numbers and returns their product, with an explicit return type.',
                  solution: {
                    lines: ['function multiply(a: number, b: number): number {', '  return a * b;', '}'],
                    explanation: 'Both parameters and the return type are number.',
                  },
                },
              ],
              docs: 'https://www.typescriptlang.org/docs/handbook/2/functions.html',
            },
            {
              id: 'ts1-t2-c1',
              title: 'Optional, default and rest parameters',
              summary:
                'A trailing ? makes a parameter optional, = gives it a default, and ... collects the rest into an array.',
              explanation:
                'TypeScript mirrors JavaScript\'s flexible argument handling with type-safe versions of each form. Marking a parameter with ? makes it optional, which adds undefined to its type and requires it to come after all required parameters. A default value with = also makes a parameter optional from the caller\'s side, but inside the body the parameter is its base type (never undefined) because the default fills in. Rest parameters use ... and must be the last parameter; their type is an array, so ...nums: number[] gathers any number of trailing arguments into a number[]. You cannot combine ? and a default on the same parameter, because a default already makes it optional. Choosing among them is about intent: ? for truly absent values you will handle, defaults for sensible fallbacks, and rest for variadic APIs.',
              analogy:
                'Optional is a guest who may or may not show up; a default is a stand-in who appears if the guest does not; rest parameters are an open-ended guest list that scoops up everyone who arrives.',
              keyPoints: [
                'name?: T makes a parameter optional; its type becomes T | undefined.',
                'name: T = value gives a default; inside the body it is just T.',
                'Optional parameters must follow required ones; rest must be last.',
                'A rest parameter is typed as an array: ...args: number[].',
              ],
              code: {
                language: 'typescript',
                lines: [
                  'function greet(name: string, title?: string): string {',
                  "  return title ? title + ' ' + name : name;",
                  '}',
                  '',
                  'function connect(host: string, port: number = 443): string {',
                  "  return host + ':' + port;",
                  '}',
                  '',
                  'function sum(...nums: number[]): number {',
                  '  return nums.reduce((a, b) => a + b, 0);',
                  '}',
                ],
                explanation:
                  'title is optional (string | undefined); port defaults to 443 so it is just number inside; nums collects all trailing arguments into number[].',
              },
              commonMistakes: [
                'Placing an optional or rest parameter before a required one.',
                'Combining a ? marker with a default value on the same parameter.',
              ],
              exercises: [
                {
                  type: 'predict',
                  prompt: 'Inside a body, what is the type of a parameter declared count: number = 0 when the caller omits it?',
                  solution: {
                    explanation: 'It is number (the default 0 fills in). A default makes it optional for the caller but never undefined inside the body.',
                  },
                },
                {
                  type: 'quiz',
                  prompt: 'Where must a rest parameter appear in the parameter list, and what is its type?',
                  solution: { explanation: 'It must be the last parameter, and its type is an array of the element type, e.g. ...args: string[].' },
                },
                {
                  type: 'task',
                  prompt: 'Write a function join that takes a separator string and any number of string parts, returning them joined.',
                  solution: {
                    lines: ['function join(sep: string, ...parts: string[]): string {', '  return parts.join(sep);', '}'],
                    explanation: 'The rest parameter parts gathers every trailing string argument into a string[].',
                  },
                },
              ],
              docs: 'https://www.typescriptlang.org/docs/handbook/2/functions.html#optional-parameters',
            },
            {
              id: 'ts1-t2-c2',
              title: 'Function type expressions',
              summary:
                'A function type expression describes the shape of a function as a value: its parameters and return type.',
              explanation:
                'Functions are first-class values, so you need a way to type a variable, parameter, or property that holds a function. The arrow-style function type expression does this: (a: number, b: number) => number describes any function taking two numbers and returning a number. The parameter names in the type are for documentation only — what matters is their position and type. This is essential for typing callbacks: a higher-order function declares the exact callback it expects, and TypeScript checks every function you pass against it. A subtle rule is parameter bivariance for callbacks and the fact that a function with fewer parameters is assignable where more are expected (extra arguments are simply ignored), which is why (x) => x works as an array map callback even though map passes three arguments. For object-like call/construct signatures or overloads you use an interface or type instead, but the arrow expression covers the everyday case.',
              analogy:
                'A function type expression is a job description: it lists what inputs the role requires and what it must produce, so any candidate function that fits the description can be hired.',
              keyPoints: [
                'Syntax: (param: Type) => ReturnType describes a function value.',
                'Parameter names in the type are documentation only; types and order matter.',
                'Used to type callbacks and higher-order function parameters.',
                'A function may accept fewer parameters than required; extras are ignored.',
              ],
              code: {
                language: 'typescript',
                lines: [
                  'type BinaryOp = (a: number, b: number) => number;',
                  '',
                  'const add: BinaryOp = (a, b) => a + b;',
                  'const mul: BinaryOp = (a, b) => a * b;',
                  '',
                  'function apply(op: BinaryOp, x: number, y: number): number {',
                  '  return op(x, y);',
                  '}',
                  '',
                  'apply(add, 2, 3); // 5',
                ],
                explanation:
                  'BinaryOp is a function type expression; add and mul are checked against it, and apply accepts any value of that function type as its op argument.',
              },
              exercises: [
                {
                  type: 'quiz',
                  prompt: 'In the type (id: string) => boolean, do the parameter names carry any meaning?',
                  solution: {
                    explanation: 'No. Names in a function type are documentation only; compatibility is decided by parameter types and order plus the return type.',
                  },
                },
                {
                  type: 'task',
                  prompt: 'Write a type alias Predicate for a function that takes a number and returns a boolean.',
                  solution: {
                    lines: ['type Predicate = (n: number) => boolean;'],
                    explanation: 'This describes any function value accepting one number and returning a boolean, ideal for filter callbacks.',
                  },
                },
                {
                  type: 'predict',
                  prompt: 'Will a callback (x) => x * 2 be accepted where the expected type is (value: number, index: number) => number?',
                  hint: 'Functions may ignore trailing parameters.',
                  solution: {
                    explanation: 'Yes. A function that uses fewer parameters is assignable where more are expected; the unused index argument is simply ignored.',
                  },
                },
              ],
              docs: 'https://www.typescriptlang.org/docs/handbook/2/functions.html#function-type-expressions',
            },
          ],
        },
      ],
    },
    /* ──────────────── LEVEL 2 — OBJECT AND COMPOSITE TYPES ──────────────── */
    {
      level: 2,
      name: 'Object and composite types',
      focus: 'Objects, interfaces, unions, literals, narrowing, enums and intersections',
      accent: '#3178c6',
      soft: '#e6effa',
      topics: [
        {
          id: 'ts2-t0',
          name: 'Objects and interfaces',
          concepts: [
            {
              id: 'ts2-t0-c0',
              title: 'Object types and interfaces',
              summary:
                'You describe the shape of an object with an inline object type or a named interface listing each property and its type.',
              explanation:
                'The heart of modelling data in TypeScript is describing object shapes. You can write an anonymous object type inline — { id: number; name: string } — or give it a name with an interface for reuse and clearer error messages. An interface lists each property with its type, and any object you assign must structurally provide at least those properties. There is one twist called the excess property check: when you assign an object literal directly, TypeScript flags properties that are not part of the target type, to catch typos like emial. The same object stored in a variable first would be accepted, because the check only fires on fresh literals. Interfaces are the idiomatic choice for the public shape of objects and class contracts, and they can be reopened (declaration merging) — a feature libraries use to let you augment their types.',
              analogy:
                'An interface is a form with named blanks. To submit it you must fill in at least the required blanks with the right kind of answer; scribbling an extra unlisted field on a fresh form gets it rejected.',
              keyPoints: [
                'Object types describe the properties an object must have, by structure.',
                'interface names a reusable object shape; great for public APIs and class contracts.',
                'Excess property checks flag unknown properties on object literals.',
                'Interfaces support declaration merging, so they can be augmented.',
              ],
              code: {
                language: 'typescript',
                lines: [
                  'interface User {',
                  '  id: number;',
                  '  name: string;',
                  '}',
                  '',
                  'const u: User = { id: 1, name: "Ada" };',
                  '',
                  '// Excess property check on a literal:',
                  '// const bad: User = { id: 1, name: "Ada", admin: true }; // Error',
                ],
                explanation:
                  'User describes the required shape; the literal assigned to bad fails because admin is not declared on User.',
              },
              exercises: [
                {
                  type: 'quiz',
                  prompt: 'What triggers an excess property check?',
                  hint: 'It is about fresh object literals.',
                  solution: {
                    explanation: 'Assigning an object literal directly to a typed target; extra properties not in the target type are flagged. Storing the object in a variable first bypasses the check.',
                  },
                },
                {
                  type: 'task',
                  prompt: 'Write an interface Product with a numeric id and a string title.',
                  solution: {
                    lines: ['interface Product {', '  id: number;', '  title: string;', '}'],
                    explanation: 'Each property is listed with its type; objects must structurally provide them.',
                  },
                },
                {
                  type: 'predict',
                  prompt: 'Does declaring interface Box twice with different properties cause an error?',
                  solution: {
                    explanation: 'No — interfaces merge. The two declarations combine into one Box with all properties, which is declaration merging.',
                  },
                },
              ],
              docs: 'https://www.typescriptlang.org/docs/handbook/2/objects.html',
            },
            {
              id: 'ts2-t0-c1',
              title: 'interface vs type alias',
              summary:
                'Both name a type. Interfaces are best for object shapes and can be merged; type aliases can name any type and are needed for unions and primitives.',
              explanation:
                'interface and type overlap heavily for object shapes — you can usually swap one for the other. The differences guide which to reach for. An interface can only describe object-like shapes, but it can be extended with extends and reopened via declaration merging, which is why it is the convention for public object and class APIs. A type alias is more general: it can name a union, an intersection, a primitive, a tuple, a mapped type, or a conditional type — things an interface cannot express — but it cannot be reopened. A common, reasonable rule of thumb is to use interface for object shapes you might extend and type for everything else (unions, function types, complex computed types). They are not mutually exclusive: a type alias can include object members, and an interface can extend a type alias that resolves to an object.',
              analogy:
                'An interface is a blueprint you can amend and that others can add wings to. A type alias is a nickname you give to any shape, including ones a blueprint cannot draw, but the nickname is fixed once defined.',
              keyPoints: [
                'Both can model object shapes and are often interchangeable.',
                'interface supports declaration merging; type alias does not.',
                'type can name unions, intersections, primitives, tuples and computed types.',
                'Rule of thumb: interface for extendable object shapes, type for everything else.',
              ],
              code: {
                language: 'typescript',
                lines: [
                  'interface Animal { name: string }',
                  'interface Dog extends Animal { breed: string }',
                  '',
                  'type ID = string | number;        // only a type alias can do this',
                  'type Pair = [number, number];     // tuple alias',
                  'type Handler = (e: Event) => void; // function type alias',
                ],
                explanation:
                  'Dog extends an interface; ID, Pair and Handler show union, tuple and function types that require a type alias, not an interface.',
              },
              commonMistakes: [
                'Trying to declare a union with interface — only type can alias a union.',
                'Expecting a type alias to merge across multiple declarations the way interfaces do.',
              ],
              exercises: [
                {
                  type: 'quiz',
                  prompt: 'Name one thing a type alias can do that an interface cannot.',
                  solution: {
                    explanation: 'A type alias can name a union, an intersection, a primitive, a tuple, or a conditional/mapped type; an interface can only describe object shapes.',
                  },
                },
                {
                  type: 'quiz',
                  prompt: 'Which of the two supports declaration merging?',
                  solution: { explanation: 'interface supports declaration merging; type aliases do not.' },
                },
                {
                  type: 'task',
                  prompt: 'Use a type alias to name a union of "light" and "dark".',
                  solution: {
                    lines: ["type Theme = 'light' | 'dark';"],
                    explanation: 'Unions of literal types require a type alias; an interface cannot express this.',
                  },
                },
              ],
              docs: 'https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#differences-between-type-aliases-and-interfaces',
            },
            {
              id: 'ts2-t0-c2',
              title: 'Optional, readonly and index signatures',
              summary:
                'A ? marks a property optional, readonly forbids reassignment after creation, and an index signature types arbitrary keys.',
              explanation:
                'Property modifiers refine an object shape. Marking a property with ? makes it optional, so its type becomes T | undefined and callers may omit it. The readonly modifier allows a property to be set once at creation but blocks later assignment; it is a compile-time guard only, so it does not deep-freeze nested objects. When the set of keys is not known ahead of time — like a dictionary keyed by arbitrary strings — you use an index signature: { [key: string]: number } means any string key maps to a number. Index signatures coexist with declared properties as long as the declared ones are compatible with the index type. With the strict flag noUncheckedIndexedAccess, reads through an index signature include undefined, nudging you to handle missing keys, which models real dictionaries far more safely.',
              analogy:
                'Optional is a blank you may leave empty; readonly is written in permanent ink; an index signature is a rule that says any drawer in the cabinet, whatever its label, holds the same kind of item.',
              keyPoints: [
                'name?: T makes a property optional (its type includes undefined).',
                'readonly allows initial assignment but blocks later writes (compile-time only).',
                'Index signature [key: string]: T types objects with arbitrary keys.',
                'noUncheckedIndexedAccess adds undefined to index-signature reads.',
              ],
              code: {
                language: 'typescript',
                lines: [
                  'interface Config {',
                  '  readonly id: number;',
                  '  name?: string;',
                  '  [setting: string]: unknown;',
                  '}',
                  '',
                  'const c: Config = { id: 1 };',
                  '// c.id = 2;          // Error: id is readonly',
                  "c.theme = 'dark';     // OK via the index signature",
                ],
                explanation:
                  'id is readonly, name is optional, and the index signature lets you assign any additional string-keyed setting.',
              },
              exercises: [
                {
                  type: 'predict',
                  prompt: 'Does readonly prevent mutating a nested object property?',
                  hint: 'Think shallow vs deep.',
                  solution: {
                    explanation: 'No. readonly only blocks reassigning that property itself; a nested object it points to can still be mutated. It is a shallow, compile-time guard.',
                  },
                },
                {
                  type: 'quiz',
                  prompt: 'How do you type an object whose keys are arbitrary strings mapping to numbers?',
                  solution: { explanation: 'With an index signature: { [key: string]: number }.' },
                },
                {
                  type: 'task',
                  prompt: 'Write an interface Settings with a readonly version number and an optional locale string.',
                  solution: {
                    lines: ['interface Settings {', '  readonly version: number;', '  locale?: string;', '}'],
                    explanation: 'version cannot be reassigned after creation; locale may be omitted.',
                  },
                },
              ],
              docs: 'https://www.typescriptlang.org/docs/handbook/2/objects.html#index-signatures',
            },
          ],
        },
        {
          id: 'ts2-t1',
          name: 'Unions, literals and narrowing',
          concepts: [
            {
              id: 'ts2-t1-c0',
              title: 'Union types',
              summary:
                'A union type allows a value to be one of several types, written with the | operator.',
              explanation:
                'A union expresses that a value can be one of several types: string | number means the value is a string or a number. Unions are everywhere — function parameters that accept multiple forms, values that may be null, results that succeed or fail. The catch is that on a union you may only access members common to all members of the union; to use a member specific to one branch you must first narrow the union to that branch. This is enforced because the compiler cannot know which member you have until you check. Unions combine naturally with literal types and with null/undefined, and they are the foundation for discriminated unions. They model the real world more honestly than forcing everything into one type or falling back to any.',
              analogy:
                'A union is a mystery box labelled either a key or a coin. You can only do what works for both until you look inside and find out which one you actually have.',
              keyPoints: [
                'A | B means the value is type A or type B.',
                'Only members common to every branch are accessible without narrowing.',
                'Unions model optional, nullable and multi-form values cleanly.',
                'They underpin discriminated unions and exhaustiveness checks.',
              ],
              code: {
                language: 'typescript',
                lines: [
                  'function format(id: string | number): string {',
                  "  if (typeof id === 'number') {",
                  '    return id.toFixed(0); // here id is number',
                  '  }',
                  '  return id.trim();       // here id is string',
                  '}',
                ],
                explanation:
                  'id is a union; the typeof check narrows it so each branch can safely use number-only or string-only methods.',
              },
              commonMistakes: [
                'Calling a method that exists on only one union member without narrowing first.',
                'Reaching for any when a precise union would describe the value.',
              ],
              exercises: [
                {
                  type: 'quiz',
                  prompt: 'Why can you not call .toFixed() directly on a value of type string | number?',
                  solution: {
                    explanation: 'Because .toFixed exists only on number, not string; on a union you may only use members common to all branches until you narrow to the number branch.',
                  },
                },
                {
                  type: 'task',
                  prompt: 'Write the type for a value that may be a Date or null.',
                  solution: {
                    lines: ['type MaybeDate = Date | null;'],
                    explanation: 'The union Date | null allows either a Date instance or null.',
                  },
                },
                {
                  type: 'predict',
                  prompt: 'On parameter x: boolean | string, is x.length accessible before any narrowing?',
                  solution: {
                    explanation: 'No. length exists on string but not boolean, so it is not a common member; you must narrow to string first.',
                  },
                },
              ],
              docs: 'https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#union-types',
            },
            {
              id: 'ts2-t1-c1',
              title: 'Literal types',
              summary:
                'A literal type is a single specific value used as a type, like the string "GET" or the number 200.',
              explanation:
                'Beyond the broad primitives, TypeScript lets a specific value be its own type: "GET" is a type inhabited only by that exact string. On their own literal types are narrow, but combined into a union they become powerful: "GET" | "POST" | "PUT" describes the allowed HTTP methods far more precisely than string, so a typo like "POTS" is a compile error and autocomplete suggests the valid options. Literal types appear automatically: a const initialised with a string gets the literal type, while a let gets the widened primitive. When you build an object whose string values should stay literal, an as const assertion freezes them as literals instead of widening to string. Literal unions are the idiomatic way to model finite sets of options, statuses, and modes without resorting to enums.',
              analogy:
                'A primitive type is the category fruit; a literal union is the specific menu apple, banana, cherry — the kitchen only accepts what is on the menu.',
              keyPoints: [
                'A literal type allows exactly one value, e.g. the string "on".',
                'Unions of literals model finite option sets precisely.',
                'const infers literal types; let widens to the primitive.',
                'as const keeps object/array values as literals instead of widening.',
              ],
              code: {
                language: 'typescript',
                lines: [
                  "type Method = 'GET' | 'POST' | 'PUT' | 'DELETE';",
                  '',
                  'function request(url: string, method: Method): void {',
                  '  // ...',
                  '}',
                  '',
                  "request('/users', 'GET');   // OK",
                  "// request('/users', 'POTS'); // Error: not a valid Method",
                ],
                explanation:
                  'Method is a union of string literals; only the four listed values are accepted, and the typo POTS is rejected at compile time.',
              },
              exercises: [
                {
                  type: 'task',
                  prompt: 'Write a literal union type Direction for north, south, east and west.',
                  solution: {
                    lines: ["type Direction = 'north' | 'south' | 'east' | 'west';"],
                    explanation: 'Each member is a string literal type; only these four values are allowed.',
                  },
                },
                {
                  type: 'predict',
                  prompt: 'What type does TypeScript infer for let status = "active"?',
                  hint: 'const vs let widening.',
                  solution: {
                    explanation: 'string — let widens the literal. With const it would infer the literal type "active".',
                  },
                },
                {
                  type: 'quiz',
                  prompt: 'Why prefer a literal union over a plain string for an HTTP method parameter?',
                  solution: {
                    explanation: 'It restricts the value to valid options, catches typos at compile time, and gives autocomplete of the allowed values.',
                  },
                },
              ],
              docs: 'https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#literal-types',
            },
            {
              id: 'ts2-t1-c2',
              title: 'Narrowing and discriminated unions',
              summary:
                'Narrowing uses runtime checks to refine a union to a more specific type. A discriminated union adds a shared tag field that makes narrowing exhaustive and clean.',
              explanation:
                'The compiler performs control-flow analysis: inside an if (typeof x === "string") block it knows x is a string. The common narrowing tools are typeof for primitives, instanceof for class instances, the in operator for property presence, and plain truthiness checks for null/undefined. The cleanest pattern for objects is a discriminated (tagged) union: each member shares a common literal property — often called kind or type — whose distinct value identifies the variant. Switching on that discriminant narrows each case to its full member type, so you can safely access variant-specific fields. Pairing this with a default branch that assigns the value to a never variable gives compile-time exhaustiveness: if you later add a variant and forget a case, the never assignment errors. This pattern turns sprawling, error-prone conditionals into provably complete handling of every shape.',
              analogy:
                'A discriminated union is a set of parcels each stamped with a content label. You read the label first, and only then open the parcel knowing exactly what is inside.',
              keyPoints: [
                'Narrowing tools: typeof, instanceof, the in operator, truthiness checks.',
                'A discriminated union shares a literal tag field across members.',
                'switch on the discriminant narrows each branch to its full type.',
                'Assigning the value to never in the default branch enforces exhaustiveness.',
              ],
              diagram: {
                type: 'mermaid',
                lines: [
                  'flowchart TD',
                  '  Shape[Shape union] --> Kind{kind}',
                  '  Kind --> Circle[Circle radius]',
                  '  Kind --> Square[Square side]',
                ],
                caption: 'A discriminated union switches on a shared tag (kind) to reach each fully-typed variant.',
              },
              code: {
                language: 'typescript',
                lines: [
                  "type Shape =",
                  "  | { kind: 'circle'; radius: number }",
                  "  | { kind: 'square'; side: number };",
                  '',
                  'function area(s: Shape): number {',
                  '  switch (s.kind) {',
                  "    case 'circle': return Math.PI * s.radius ** 2;",
                  "    case 'square': return s.side ** 2;",
                  '    default:',
                  '      const _exhaustive: never = s;',
                  '      return _exhaustive;',
                  '  }',
                  '}',
                ],
                explanation:
                  'Switching on kind narrows each case to the matching member; the never assignment in default makes adding a new shape a compile error until handled.',
              },
              commonMistakes: [
                'Using a non-literal discriminant, which prevents the union from narrowing.',
                'Forgetting the never default, so missing cases slip through silently.',
              ],
              exercises: [
                {
                  type: 'quiz',
                  prompt: 'What property must the members of a discriminated union share?',
                  solution: {
                    explanation: 'A common property with a distinct literal type (the discriminant or tag), e.g. kind: "circle" vs kind: "square".',
                  },
                },
                {
                  type: 'predict',
                  prompt: 'In a switch over a discriminated union, what happens if you add a new variant but forget its case, with a never assignment in default?',
                  solution: {
                    explanation: 'The new variant flows to default and is not assignable to never, so the compiler reports an error — enforcing exhaustive handling.',
                  },
                },
                {
                  type: 'task',
                  prompt: 'Write a guard that narrows value: unknown to string before calling toUpperCase.',
                  solution: {
                    lines: ["if (typeof value === 'string') {", '  value.toUpperCase();', '}'],
                    explanation: 'The typeof check narrows value to string within the block, making string methods safe to call.',
                  },
                },
              ],
              docs: 'https://www.typescriptlang.org/docs/handbook/2/narrowing.html',
            },
          ],
        },
        {
          id: 'ts2-t2',
          name: 'Aliases, enums and intersections',
          concepts: [
            {
              id: 'ts2-t2-c0',
              title: 'Type aliases',
              summary:
                'A type alias gives a name to any type, making complex types reusable and readable.',
              explanation:
                'A type alias introduced with the type keyword binds a name to any type expression — a primitive, an object shape, a union, a tuple, a function type, or a generic computed type. Aliases do not create new distinct types; they are just names, so two aliases for the same structure are interchangeable. Their value is readability and reuse: instead of repeating { id: number; name: string } everywhere, you name it User once. Aliases can be generic, taking type parameters like type Result<T> = { ok: true; value: T } | { ok: false; error: string }, which is how you build reusable shapes. Because they can name unions and computed types, aliases are the workhorse of advanced TypeScript. The main thing they cannot do, compared with interfaces, is merge across declarations.',
              analogy:
                'A type alias is a contact name in your phone: dialing the name or the full number reaches the same person, but the name is far easier to remember and reuse.',
              keyPoints: [
                'type Name = ... names any type, including unions and computed types.',
                'Aliases are names, not new distinct types — same structure is interchangeable.',
                'They can be generic: type Box<T> = { value: T }.',
                'Unlike interfaces, aliases cannot be reopened or merged.',
              ],
              code: {
                language: 'typescript',
                lines: [
                  'type UserId = string;',
                  'type Point = { x: number; y: number };',
                  'type Result<T> =',
                  '  | { ok: true; value: T }',
                  '  | { ok: false; error: string };',
                  '',
                  'const ok: Result<number> = { ok: true, value: 42 };',
                ],
                explanation:
                  'UserId, Point and the generic Result alias name reusable shapes; Result<number> specialises the generic alias for a numeric payload.',
              },
              exercises: [
                {
                  type: 'task',
                  prompt: 'Create a generic type alias Box that wraps a value of type T.',
                  solution: {
                    lines: ['type Box<T> = { value: T };'],
                    explanation: 'The type parameter T lets Box describe a wrapper around any value type.',
                  },
                },
                {
                  type: 'quiz',
                  prompt: 'Do two type aliases with identical structure produce incompatible types?',
                  solution: {
                    explanation: 'No. Aliases are just names; structurally identical aliases are fully interchangeable because TypeScript is structurally typed.',
                  },
                },
                {
                  type: 'predict',
                  prompt: 'Can you declare type Foo twice in the same scope to add members?',
                  solution: {
                    explanation: 'No — that is a duplicate identifier error. Type aliases do not merge; only interfaces support declaration merging.',
                  },
                },
              ],
              docs: 'https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#type-aliases',
            },
            {
              id: 'ts2-t2-c1',
              title: 'Enums vs const objects',
              summary:
                'Enums are a named set of constants. Modern code often prefers a const object with as const plus a literal union for lighter, safer output.',
              explanation:
                'An enum defines a set of named constants — enum Direction { Up, Down } — and by default assigns numeric values starting at 0; string enums assign explicit string values. Unlike most TypeScript constructs, a regular enum emits real JavaScript (an object) at runtime, so it is not purely erased. This, plus quirks like reverse mappings for numeric enums and the loose assignability of numeric enums, has led much of the community toward an alternative: a plain object frozen with as const, paired with a union type derived from its values. That pattern produces no extra runtime code beyond the object you wrote, gives you literal-typed values, and reads naturally. const enum is another option that inlines values for zero runtime cost, but it has caveats under isolatedModules and certain bundlers. Knowing both lets you pick: enums when you want a familiar named grouping, const-object unions when you want minimal, predictable output.',
              analogy:
                'An enum is a pre-printed catalogue that ships as a physical booklet. A const-object union is a sticky note listing the same items — same information, but nothing extra gets manufactured.',
              keyPoints: [
                'enum names a set of constants; numeric by default, or string-valued.',
                'Regular enums emit a runtime object — they are not fully erased.',
                'A const object + as const + value union is a popular lightweight alternative.',
                'const enum inlines values but has bundler/isolatedModules caveats.',
              ],
              code: {
                language: 'typescript',
                lines: [
                  '// Enum',
                  "enum Status { Active = 'ACTIVE', Inactive = 'INACTIVE' }",
                  '',
                  '// const-object alternative',
                  'const Role = {',
                  "  Admin: 'admin',",
                  "  User: 'user',",
                  '} as const;',
                  'type Role = (typeof Role)[keyof typeof Role]; // "admin" | "user"',
                ],
                explanation:
                  'Status is a string enum; Role uses as const plus an indexed-access type to derive the union "admin" | "user" with no extra runtime construct.',
              },
              commonMistakes: [
                'Relying on numeric enum reverse mappings without realising they bloat output.',
                'Using const enum across module boundaries where isolatedModules forbids it.',
              ],
              exercises: [
                {
                  type: 'quiz',
                  prompt: 'How does a regular enum differ from most TypeScript type constructs at runtime?',
                  solution: {
                    explanation: 'A regular enum emits a real JavaScript object at runtime, whereas most type constructs are erased entirely during compilation.',
                  },
                },
                {
                  type: 'task',
                  prompt: 'Define a const object Color with red and blue, plus a union type derived from its values.',
                  solution: {
                    lines: ["const Color = { Red: 'red', Blue: 'blue' } as const;", 'type Color = (typeof Color)[keyof typeof Color];'],
                    explanation: 'as const keeps the values as literals, and the indexed-access type extracts "red" | "blue".',
                  },
                },
                {
                  type: 'predict',
                  prompt: 'Does a const-object-plus-union pattern add runtime code beyond the object itself?',
                  solution: {
                    explanation: 'No. The type is erased and only the const object remains, which is why this pattern is favoured for minimal output.',
                  },
                },
              ],
              docs: 'https://www.typescriptlang.org/docs/handbook/enums.html',
            },
            {
              id: 'ts2-t2-c2',
              title: 'Intersections and const assertions',
              summary:
                'An intersection (&) combines several types into one that has all their members. as const freezes a value to its most specific, readonly literal type.',
              explanation:
                'Where a union means one-of, an intersection means all-of: A & B is a type that has every member of both A and B simultaneously. Intersections are ideal for composing object types — merging a base shape with extra capabilities, or combining mixins. If you intersect object types with conflicting primitive properties (the same key as both string and number), the result for that key is never, since no value can be both. The const assertion as const is a separate but related tool: applied to a literal value it makes the value deeply readonly and infers the narrowest possible types — string literals instead of string, tuples instead of arrays, and readonly properties. This is invaluable for configuration objects, action constants, and deriving precise union types from data. Together, intersections compose shapes and const assertions lock down values, two everyday techniques for precise modelling.',
              analogy:
                'An intersection is a job that requires being both a pilot and a doctor — the candidate must hold all qualifications. as const is laminating a document so its exact wording can never be edited.',
              keyPoints: [
                'A & B has all members of both A and B (all-of, not one-of).',
                'Conflicting primitive keys in an intersection resolve to never.',
                'as const makes a value deeply readonly with the narrowest literal types.',
                'as const turns arrays into readonly tuples and strings into literals.',
              ],
              code: {
                language: 'typescript',
                lines: [
                  'type Identified = { id: number };',
                  'type Timestamped = { createdAt: Date };',
                  'type Entity = Identified & Timestamped; // has id and createdAt',
                  '',
                  "const config = { retries: 3, mode: 'fast' } as const;",
                  '// config.retries is 3 (literal), config.mode is "fast", both readonly',
                ],
                explanation:
                  'Entity combines both object types via &; as const narrows config to literal, readonly property types.',
              },
              exercises: [
                {
                  type: 'quiz',
                  prompt: 'What is the difference in meaning between A | B and A & B?',
                  solution: {
                    explanation: 'A | B is one-of: the value is A or B. A & B is all-of: the value must satisfy both A and B at once.',
                  },
                },
                {
                  type: 'predict',
                  prompt: 'What type does as const give the array [1, 2] in const t = [1, 2] as const?',
                  solution: {
                    explanation: 'A readonly tuple readonly [1, 2] — the elements are literal types and the tuple is readonly.',
                  },
                },
                {
                  type: 'task',
                  prompt: 'Write an intersection type combining { name: string } and { age: number }.',
                  solution: {
                    lines: ['type Person = { name: string } & { age: number };'],
                    explanation: 'The intersection requires both name and age, producing a type with all members.',
                  },
                },
              ],
              docs: 'https://www.typescriptlang.org/docs/handbook/2/objects.html#intersection-types',
            },
          ],
        },
      ],
    },
    /* ──────────────── LEVEL 3 — GENERICS AND ADVANCED TYPES ──────────────── */
    {
      level: 3,
      name: 'Generics and advanced types',
      focus: 'Generics, the built-in utility types, and the type-level toolkit',
      accent: '#3178c6',
      soft: '#e6effa',
      topics: [
        {
          id: 'ts3-t0',
          name: 'Generics',
          concepts: [
            {
              id: 'ts3-t0-c0',
              title: 'Generic functions and type parameters',
              summary:
                'Generics let a function work over many types while preserving the relationship between input and output types.',
              explanation:
                'Sometimes a function should work with any type but still keep the types connected — an identity function that returns whatever you pass in should return the same type, not any. Generics solve this with a type parameter, written in angle brackets: function identity<T>(value: T): T. T is a placeholder bound when the function is called, so identity("hi") returns string and identity(5) returns number. The compiler usually infers T from the arguments, so you rarely pass it explicitly. Generics keep code both reusable and type-safe, which is why every collection method and most library APIs are generic. You can name parameters anything, but T, U, K and V are conventions. The crucial benefit over any is that the relationships are preserved: the output type tracks the input type instead of collapsing to an untyped value.',
              analogy:
                'A generic is a vending machine slot sized to a placeholder: put in a can and a can comes out; put in a bottle and a bottle comes out — the machine adapts while guaranteeing you get back the same kind of thing.',
              keyPoints: [
                'A type parameter <T> is a placeholder bound when the function is called.',
                'Generics preserve the input/output type relationship — better than any.',
                'T is usually inferred from arguments; explicit <T> is rarely needed.',
                'Conventional names: T, U for types; K for keys; V for values.',
              ],
              code: {
                language: 'typescript',
                lines: [
                  'function first<T>(arr: T[]): T | undefined {',
                  '  return arr[0];',
                  '}',
                  '',
                  "const s = first(['a', 'b']); // s: string | undefined",
                  'const n = first([1, 2, 3]);   // n: number | undefined',
                ],
                explanation:
                  'T is inferred from the array element type, so first returns the correctly typed element for each call without any explicit type argument.',
              },
              exercises: [
                {
                  type: 'quiz',
                  prompt: 'What advantage does a generic function have over one typed with any?',
                  solution: {
                    explanation: 'A generic preserves the relationship between input and output types, so callers keep precise types; any discards type information entirely.',
                  },
                },
                {
                  type: 'task',
                  prompt: 'Write a generic identity function that returns its argument unchanged.',
                  solution: {
                    lines: ['function identity<T>(value: T): T {', '  return value;', '}'],
                    explanation: 'The type parameter T ties the return type to the argument type for every call.',
                  },
                },
                {
                  type: 'predict',
                  prompt: 'For first<T>(arr: T[]): T, what is the return type of first([true, false])?',
                  solution: {
                    explanation: 'boolean (T is inferred as boolean from the array element type). With the | undefined variant it would be boolean | undefined.',
                  },
                },
              ],
              docs: 'https://www.typescriptlang.org/docs/handbook/2/generics.html',
            },
            {
              id: 'ts3-t0-c1',
              title: 'Generic constraints with extends',
              summary:
                'A constraint limits what a type parameter can be, using extends, so you can safely use members of the constrained shape.',
              explanation:
                'A bare type parameter T could be anything, so inside the function you cannot assume it has any particular property. A constraint fixes this: <T extends { length: number }> says T must at least have a numeric length, so accessing value.length is now safe for every allowed T. Constraints commonly combine with keyof to write key-safe accessors: <T, K extends keyof T> guarantees K is a real key of T, letting obj[key] return the precisely typed property. Constraints narrow what callers may pass while widening what you can do inside the body. You can also give a type parameter a default like <T = string>. A modern refinement is const type parameters — <const T> — which makes inference keep literal types instead of widening, useful for helper functions that should preserve exact values passed in.',
              analogy:
                'A constraint is a height requirement for a ride: it restricts who may enter, but in return the operator can safely assume everyone aboard meets the minimum.',
              keyPoints: [
                'T extends Shape requires T to satisfy Shape, enabling safe member access.',
                'K extends keyof T makes a key parameter provably valid for T.',
                'Type parameters can have defaults: <T = string>.',
                'const type parameters (<const T>) preserve literal types in inference.',
              ],
              code: {
                language: 'typescript',
                lines: [
                  'function longest<T extends { length: number }>(a: T, b: T): T {',
                  '  return a.length >= b.length ? a : b;',
                  '}',
                  '',
                  'function getProp<T, K extends keyof T>(obj: T, key: K): T[K] {',
                  '  return obj[key];',
                  '}',
                  '',
                  "const name = getProp({ id: 1, name: 'Ada' }, 'name'); // string",
                ],
                explanation:
                  'longest constrains T to anything with length; getProp constrains K to a real key of T, so obj[key] is the precisely typed property T[K].',
              },
              commonMistakes: [
                'Accessing a property on an unconstrained T and expecting it to type-check.',
                'Forgetting K extends keyof T, which lets invalid keys slip through.',
              ],
              exercises: [
                {
                  type: 'quiz',
                  prompt: 'Why does <T extends { length: number }> let you safely read value.length?',
                  solution: {
                    explanation: 'The constraint guarantees every allowed T has a numeric length property, so accessing it is type-safe inside the function.',
                  },
                },
                {
                  type: 'task',
                  prompt: 'Write a signature for a function pluck that takes an object and a valid key of it, returning the property value.',
                  solution: {
                    lines: ['function pluck<T, K extends keyof T>(obj: T, key: K): T[K];'],
                    explanation: 'K extends keyof T restricts key to real keys, and the return type T[K] is the precise property type.',
                  },
                },
                {
                  type: 'predict',
                  prompt: 'Does getProp({ a: 1 }, "b") compile when K extends keyof T?',
                  solution: {
                    explanation: 'No. "b" is not a key of { a: 1 }, so it violates K extends keyof T and the compiler reports an error.',
                  },
                },
              ],
              docs: 'https://www.typescriptlang.org/docs/handbook/2/generics.html#generic-constraints',
            },
            {
              id: 'ts3-t0-c2',
              title: 'Generic interfaces and classes',
              summary:
                'Interfaces and classes can take type parameters too, producing reusable, type-safe containers and data structures.',
              explanation:
                'Generics are not limited to functions. A generic interface like interface Box<T> { value: T } describes a container parameterised by the type it holds, so Box<number> and Box<string> are distinct, fully-typed shapes. A generic class such as class Stack<T> applies the type parameter across all its fields and methods, so push only accepts T and pop returns T | undefined — the entire data structure stays consistent. This is exactly how built-in types like Array<T>, Map<K, V>, Promise<T>, and Set<T> work. You can constrain class and interface type parameters the same way as functions, and you can supply defaults. Generic classes are the standard way to build reusable typed collections, repositories, and result wrappers without duplicating code for each element type.',
              analogy:
                'A generic class is a shipping container blueprint: the same design holds books, clothes, or machinery, and the manifest always states exactly what kind of cargo is inside.',
              keyPoints: [
                'interface Box<T> parameterises a shape by the type it contains.',
                'class Stack<T> applies T across all fields and methods consistently.',
                'Built-ins like Array<T>, Map<K,V>, Promise<T> are generic.',
                'Class/interface type parameters can be constrained and defaulted.',
              ],
              code: {
                language: 'typescript',
                lines: [
                  'class Stack<T> {',
                  '  private items: T[] = [];',
                  '  push(item: T): void { this.items.push(item); }',
                  '  pop(): T | undefined { return this.items.pop(); }',
                  '  get size(): number { return this.items.length; }',
                  '}',
                  '',
                  'const s = new Stack<number>();',
                  's.push(1);',
                  'const top = s.pop(); // number | undefined',
                ],
                explanation:
                  'Stack<T> keeps the element type consistent: push requires a number and pop returns number | undefined for Stack<number>.',
              },
              exercises: [
                {
                  type: 'task',
                  prompt: 'Write a generic interface Container holding a single value of type T.',
                  solution: {
                    lines: ['interface Container<T> {', '  value: T;', '}'],
                    explanation: 'The type parameter T lets Container hold a value of any specified type.',
                  },
                },
                {
                  type: 'quiz',
                  prompt: 'Name three built-in TypeScript types that are generic.',
                  solution: { explanation: 'Examples include Array<T>, Map<K, V>, Set<T>, Promise<T>, and Record<K, V>.' },
                },
                {
                  type: 'predict',
                  prompt: 'For const s = new Stack<string>(), what is the return type of s.pop()?',
                  solution: {
                    explanation: 'string | undefined — pop may return an element of type string or undefined when the stack is empty.',
                  },
                },
              ],
              docs: 'https://www.typescriptlang.org/docs/handbook/2/generics.html#generic-classes',
            },
          ],
        },
        {
          id: 'ts3-t1',
          name: 'Utility types',
          concepts: [
            {
              id: 'ts3-t1-c0',
              title: 'Partial, Required and Readonly',
              summary:
                'These mapped utility types flip a type\'s modifiers: Partial makes all properties optional, Required makes them mandatory, Readonly makes them immutable.',
              explanation:
                'TypeScript ships a set of built-in utility types that transform existing types so you do not rewrite shapes by hand. Partial<T> takes a type and makes every property optional — perfect for update functions that accept a subset of fields. Required<T> does the reverse, stripping the ? from every property so all become mandatory. Readonly<T> marks every property readonly, giving an immutable view of the same shape, which pairs well with defensive APIs. These are implemented internally as mapped types, so they apply across all keys automatically and stay in sync as the source type changes. Using them keeps a single source of truth: change the base interface and every derived shape updates. They are among the most-used utilities in everyday TypeScript, especially Partial for patch/update payloads.',
              analogy:
                'These utilities are filters over a form template: Partial makes every blank optional, Required marks every blank mandatory, and Readonly stamps the whole form do-not-edit.',
              keyPoints: [
                'Partial<T> makes all properties of T optional.',
                'Required<T> makes all properties of T mandatory.',
                'Readonly<T> makes all properties of T readonly.',
                'They are mapped types — derived shapes stay in sync with the source.',
              ],
              code: {
                language: 'typescript',
                lines: [
                  'interface User { id: number; name: string; email: string }',
                  '',
                  'type UserPatch = Partial<User>;   // all optional',
                  'type StrictUser = Required<User>; // all required',
                  'type FrozenUser = Readonly<User>; // all readonly',
                  '',
                  'function update(id: number, patch: Partial<User>): void {}',
                ],
                explanation:
                  'UserPatch lets callers send any subset of fields; Readonly<User> prevents mutation; update accepts a partial payload.',
              },
              exercises: [
                {
                  type: 'quiz',
                  prompt: 'Which utility type makes every property of a type optional?',
                  solution: { explanation: 'Partial<T> — it adds the ? modifier to every property of T.' },
                },
                {
                  type: 'task',
                  prompt: 'Given interface Post { title: string; body: string }, write the type for a patch where both fields are optional.',
                  solution: {
                    lines: ['type PostPatch = Partial<Post>;'],
                    explanation: 'Partial<Post> produces { title?: string; body?: string }.',
                  },
                },
                {
                  type: 'predict',
                  prompt: 'What does Readonly<{ x: number }> allow and forbid?',
                  solution: {
                    explanation: 'It allows reading x but forbids assigning to x after creation, because the property becomes readonly.',
                  },
                },
              ],
              docs: 'https://www.typescriptlang.org/docs/handbook/utility-types.html#partialtype',
            },
            {
              id: 'ts3-t1-c1',
              title: 'Pick, Omit and Record',
              summary:
                'Pick selects a subset of properties, Omit removes some, and Record builds an object type from a set of keys to a value type.',
              explanation:
                'These utilities reshape and construct object types. Pick<T, K> creates a type with only the named keys K from T — handy for exposing a slim view of a larger model. Omit<T, K> is the complement, producing T without the named keys, which is the cleaner choice when you want most of a type minus a few fields (for example, a creation payload that omits the server-generated id). Record<K, V> builds an object type whose keys are the union K and whose values are all V — the precise way to type dictionaries and lookup tables, like Record<string, number> or Record<"red" | "green", string>. Pick and Omit are duals: Pick keeps what you list, Omit drops what you list. Combined with Partial and the others, they let you derive every view of a domain model from one canonical interface.',
              analogy:
                'Pick is ordering only certain dishes off a menu; Omit is ordering everything except a couple; Record is a labelled spice rack where every named slot holds the same kind of jar.',
              keyPoints: [
                'Pick<T, K> keeps only the listed keys K of T.',
                'Omit<T, K> keeps everything except the listed keys K.',
                'Record<K, V> maps each key in K to a value of type V.',
                'Pick and Omit are complements; use whichever names fewer keys.',
              ],
              code: {
                language: 'typescript',
                lines: [
                  'interface User { id: number; name: string; password: string }',
                  '',
                  "type PublicUser = Omit<User, 'password'>;     // id, name",
                  "type Credentials = Pick<User, 'name' | 'password'>;",
                  '',
                  "type Scores = Record<string, number>;          // dictionary",
                  "type Flags = Record<'a' | 'b', boolean>;       // { a: boolean; b: boolean }",
                ],
                explanation:
                  'Omit drops password for a safe public shape; Pick selects login fields; Record builds a string-keyed dictionary and a fixed-key flag object.',
              },
              commonMistakes: [
                'Listing keys in Omit/Pick that do not exist on the source type (caught by the compiler).',
                'Reaching for an index signature when Record<K, V> reads more clearly.',
              ],
              exercises: [
                {
                  type: 'quiz',
                  prompt: 'What is the relationship between Pick and Omit?',
                  solution: {
                    explanation: 'They are complements: Pick keeps only the keys you name, while Omit keeps everything except the keys you name.',
                  },
                },
                {
                  type: 'task',
                  prompt: 'Write a type for a dictionary mapping string keys to User objects, given a User type.',
                  solution: {
                    lines: ['type UserMap = Record<string, User>;'],
                    explanation: 'Record<string, User> types an object whose every string key maps to a User.',
                  },
                },
                {
                  type: 'predict',
                  prompt: 'What keys does Omit<{ a: 1; b: 2; c: 3 }, "b"> have?',
                  solution: { explanation: 'a and c — Omit removes only the listed key b, leaving the rest.' },
                },
              ],
              docs: 'https://www.typescriptlang.org/docs/handbook/utility-types.html#picktype-keys',
            },
            {
              id: 'ts3-t1-c2',
              title: 'ReturnType and Parameters',
              summary:
                'ReturnType extracts the return type of a function type, and Parameters extracts its parameter types as a tuple.',
              explanation:
                'These utilities operate on function types and are built on conditional types with infer. ReturnType<F> yields whatever a function type F returns, so you can name a function\'s result without duplicating it — especially useful with typeof to derive a type from an existing function. Parameters<F> gives a tuple of the function\'s parameter types, handy for wrapping or forwarding arguments. Related members of the family include InstanceType<C> for the instance type of a constructor, Awaited<T> for the resolved value of a Promise, and ConstructorParameters<C> for a constructor\'s arguments. Deriving types from values this way keeps everything in sync: when the function signature changes, every derived type updates automatically, eliminating a whole category of drift between code and its type annotations.',
              analogy:
                'ReturnType and Parameters are like reading a machine\'s spec sheet: one tells you exactly what comes out, the other lists exactly what you must feed in — without dismantling the machine.',
              keyPoints: [
                'ReturnType<F> is the return type of function type F.',
                'Parameters<F> is a tuple of F\'s parameter types.',
                'Combine with typeof to derive types from existing functions.',
                'Related: Awaited<T>, InstanceType<C>, ConstructorParameters<C>.',
              ],
              code: {
                language: 'typescript',
                lines: [
                  'function makeUser(name: string, age: number) {',
                  '  return { name, age, active: true };',
                  '}',
                  '',
                  'type User = ReturnType<typeof makeUser>; // { name: string; age: number; active: boolean }',
                  'type Args = Parameters<typeof makeUser>;  // [string, number]',
                  'type Resolved = Awaited<Promise<number>>; // number',
                ],
                explanation:
                  'User is derived from makeUser\'s inferred return shape; Args is its parameter tuple; Awaited unwraps a Promise to its resolved value.',
              },
              exercises: [
                {
                  type: 'quiz',
                  prompt: 'What does Parameters<F> produce for a function type F?',
                  solution: { explanation: 'A tuple type of F\'s parameter types, e.g. [string, number] for (a: string, b: number) => void.' },
                },
                {
                  type: 'task',
                  prompt: 'Write a type alias Result equal to the return type of a function named load (use typeof).',
                  solution: {
                    lines: ['type Result = ReturnType<typeof load>;'],
                    explanation: 'typeof load gives load\'s function type, and ReturnType extracts what it returns.',
                  },
                },
                {
                  type: 'predict',
                  prompt: 'What is Awaited<Promise<Promise<string>>>?',
                  hint: 'Awaited unwraps nested promises.',
                  solution: { explanation: 'string — Awaited recursively unwraps nested Promises to the final resolved value type.' },
                },
              ],
              docs: 'https://www.typescriptlang.org/docs/handbook/utility-types.html#returntypetype',
            },
          ],
        },
        {
          id: 'ts3-t2',
          name: 'Advanced type tools',
          concepts: [
            {
              id: 'ts3-t2-c0',
              title: 'keyof, typeof and indexed access',
              summary:
                'keyof gives the union of a type\'s keys, typeof captures the type of a value, and T[K] reads the type of a property.',
              explanation:
                'These three operators let you compute types from other types and from values. keyof T produces a union of T\'s property names as literal types — keyof { a: 1; b: 2 } is "a" | "b" — which is the basis for key-safe generics. The type-level typeof, used in a type position, takes a runtime value or function and gives its inferred type, so you can derive a type from a const object or an existing function rather than redeclaring it. Indexed access types use bracket notation at the type level: T["name"] is the type of the name property, and T[keyof T] is the union of all property value types. These compose powerfully — (typeof config)[keyof typeof config] derives the union of a config object\'s value types. Mastering them is the gateway to mapped and conditional types.',
              analogy:
                'keyof reads the labels on every drawer; type-level typeof photographs an actual object to record its shape; indexed access opens a specific drawer to see what kind of thing it holds.',
              keyPoints: [
                'keyof T is the union of T\'s keys as literal types.',
                'typeof value (in a type position) gives the inferred type of a value.',
                'Indexed access T[K] reads the type of property K.',
                'T[keyof T] yields the union of all property value types.',
              ],
              code: {
                language: 'typescript',
                lines: [
                  'interface User { id: number; name: string }',
                  '',
                  "type UserKeys = keyof User;       // 'id' | 'name'",
                  "type NameType = User['name'];     // string",
                  'type ValueTypes = User[keyof User]; // number | string',
                  '',
                  'const config = { retries: 3, debug: false };',
                  'type Config = typeof config;       // { retries: number; debug: boolean }',
                ],
                explanation:
                  'keyof lists the keys; indexed access reads a property type or the union of all value types; typeof captures the config object\'s type.',
              },
              exercises: [
                {
                  type: 'predict',
                  prompt: 'What is keyof { x: number; y: number }?',
                  solution: { explanation: 'The union "x" | "y" — keyof produces the keys as a union of string literal types.' },
                },
                {
                  type: 'task',
                  prompt: 'Given interface T { a: string; b: number }, write the indexed access type for property b.',
                  solution: {
                    lines: ["type B = T['b'];"],
                    explanation: 'Indexed access T["b"] yields number, the type of the b property.',
                  },
                },
                {
                  type: 'quiz',
                  prompt: 'How do you derive a type from an existing runtime const object without rewriting it?',
                  solution: {
                    explanation: 'Use the type-level typeof in a type position: type C = typeof myObject captures its inferred shape.',
                  },
                },
              ],
              docs: 'https://www.typescriptlang.org/docs/handbook/2/keyof-types.html',
            },
            {
              id: 'ts3-t2-c1',
              title: 'Conditional types',
              summary:
                'A conditional type chooses one of two types based on a relationship test, written T extends U ? X : Y.',
              explanation:
                'Conditional types add branching to the type level. The form T extends U ? X : Y resolves to X if T is assignable to U, otherwise Y — letting types react to other types. They become far more powerful with the infer keyword, which captures a piece of a matched type into a new type variable; this is how the standard library implements utilities such as ReturnType (infer the return position) and Awaited (infer a Promise\'s payload). A subtle and important behaviour is distribution: when the checked type is a naked type parameter that happens to be a union, the conditional applies to each member separately and the results are unioned back together. You can switch this off by wrapping both sides in tuples, as in [T] extends [U]. Conditional types power the most expressive parts of TypeScript libraries, transforming types in ways simple aliases cannot.',
              analogy:
                'A conditional type is a type-level if statement: it inspects a type, asks does it fit this mould, and hands back one answer or another accordingly.',
              keyPoints: [
                'T extends U ? X : Y picks X when T is assignable to U, else Y.',
                'infer captures part of a matched type into a new variable.',
                'Conditionals over a naked union type parameter distribute per member.',
                'Wrap in tuples ([T] extends [U]) to prevent distribution.',
              ],
              code: {
                language: 'typescript',
                lines: [
                  'type IsString<T> = T extends string ? true : false;',
                  "type A = IsString<'hi'>; // true",
                  'type B = IsString<42>;   // false',
                  '',
                  'type Unwrap<T> = T extends Promise<infer R> ? R : T;',
                  'type C = Unwrap<Promise<number>>; // number',
                  'type D = Unwrap<string>;          // string',
                ],
                explanation:
                  'IsString branches on assignability; Unwrap uses infer R to extract a Promise\'s resolved type, falling back to T when it is not a Promise.',
              },
              commonMistakes: [
                'Forgetting distribution over unions, leading to surprising per-member results.',
                'Expecting infer to work outside the extends clause of a conditional type.',
              ],
              exercises: [
                {
                  type: 'predict',
                  prompt: 'What does type X = number extends string ? "yes" : "no" resolve to?',
                  solution: { explanation: '"no" — number is not assignable to string, so the false branch is chosen.' },
                },
                {
                  type: 'task',
                  prompt: 'Write a conditional type ElementType that extracts T from an array type T[] (else returns T).',
                  solution: {
                    lines: ['type ElementType<A> = A extends (infer T)[] ? T : A;'],
                    explanation: 'infer T captures the array element type; non-array inputs fall through to A.',
                  },
                },
                {
                  type: 'quiz',
                  prompt: 'What does the infer keyword do in a conditional type?',
                  solution: {
                    explanation: 'It declares a type variable that captures a portion of the matched type within the extends clause, making it available in the true branch.',
                  },
                },
              ],
              docs: 'https://www.typescriptlang.org/docs/handbook/2/conditional-types.html',
            },
            {
              id: 'ts3-t2-c2',
              title: 'Mapped types',
              summary:
                'A mapped type builds a new object type by transforming each key of an existing one, the mechanism behind Partial, Readonly and friends.',
              explanation:
                'A mapped type iterates over the keys of a type and produces a new property for each, using the syntax { [K in keyof T]: ... }. You can transform the value type, and you can add or remove modifiers with the + and - prefixes: { readonly [K in keyof T]: T[K] } is essentially Readonly, and { [K in keyof T]-?: T[K] } strips optionality like Required. This is exactly how the built-in utility types are defined. Two further features make mapped types expressive: key remapping with the as clause lets you rename or filter keys (for example, dropping keys whose value is a function), and combining them with template literal types lets you build keys like getName from name. Mapped types are the tool for systematic, whole-type transformations — derive event handlers from a props type, make every field nullable, and so on — all staying in sync with the source.',
              analogy:
                'A mapped type is an assembly line that takes each item off a conveyor, applies the same modification, and places the transformed item onto a new belt.',
              keyPoints: [
                'Syntax: { [K in keyof T]: NewType } iterates over every key.',
                'Modifiers: +/- with readonly and ? add or remove those traits.',
                'Key remapping with as renames or filters keys.',
                'Mapped types implement Partial, Readonly, Required and similar utilities.',
              ],
              diagram: {
                type: 'mermaid',
                lines: [
                  'flowchart LR',
                  '  T[Source type] --> Map[Map over keys]',
                  '  Map --> Transform[Transform each property]',
                  '  Transform --> New[New type]',
                ],
                caption: 'A mapped type walks each key of a source type and emits a transformed property into a new type.',
              },
              code: {
                language: 'typescript',
                lines: [
                  'type MyPartial<T> = { [K in keyof T]?: T[K] };',
                  'type MyReadonly<T> = { readonly [K in keyof T]: T[K] };',
                  'type Nullable<T> = { [K in keyof T]: T[K] | null };',
                  '',
                  '// Key remapping with as (filter out function-typed keys):',
                  'type DataOnly<T> = {',
                  '  [K in keyof T as T[K] extends Function ? never : K]: T[K];',
                  '};',
                ],
                explanation:
                  'MyPartial and MyReadonly reimplement the built-ins; Nullable widens every value with null; DataOnly remaps keys with as, dropping method-typed keys by mapping them to never.',
              },
              exercises: [
                {
                  type: 'quiz',
                  prompt: 'How would you remove the optional modifier from every property using a mapped type?',
                  solution: {
                    explanation: 'Use the -? modifier: { [K in keyof T]-?: T[K] }, which is how Required is implemented.',
                  },
                },
                {
                  type: 'task',
                  prompt: 'Write a mapped type Stringify that makes every property of T a string.',
                  solution: {
                    lines: ['type Stringify<T> = { [K in keyof T]: string };'],
                    explanation: 'The mapped type iterates each key and sets the value type to string regardless of the original.',
                  },
                },
                {
                  type: 'predict',
                  prompt: 'What feature lets a mapped type rename keys, e.g. name into getName?',
                  solution: {
                    explanation: 'Key remapping via the as clause, often combined with template literal types to construct the new key names.',
                  },
                },
              ],
              docs: 'https://www.typescriptlang.org/docs/handbook/2/mapped-types.html',
            },
          ],
        },
      ],
    },
    /* ──────────────── LEVEL 4 — CLASSES AND OOP ──────────────── */
    {
      level: 4,
      name: 'Classes and OOP',
      focus: 'Classes, inheritance, contracts, and type guards',
      accent: '#3178c6',
      soft: '#e6effa',
      topics: [
        {
          id: 'ts4-t0',
          name: 'Classes',
          concepts: [
            {
              id: 'ts4-t0-c0',
              title: 'Fields, constructors and parameter properties',
              summary:
                'TypeScript classes type their fields and constructors, and parameter properties let you declare and assign a field in one step.',
              explanation:
                'A TypeScript class declares typed fields and a typed constructor. Under strictPropertyInitialization (part of strict mode), every non-optional field must be assigned either at its declaration or in the constructor, or the compiler complains — preventing accidentally undefined members. The constructor receives typed parameters and wires up the instance. A convenient shorthand unique to TypeScript is the parameter property: prefixing a constructor parameter with an access modifier (public, private, etc.) or readonly automatically declares a field of that name and assigns the argument to it, eliminating the repetitive this.x = x boilerplate. If a field genuinely cannot be initialised before use but you know it will be, the definite assignment assertion name!: T tells the compiler to trust you. These rules push you toward objects that are fully initialised and well-typed from construction.',
              analogy:
                'Parameter properties are like a form that files itself: instead of writing the applicant\'s name on the form and then in the ledger, signing once does both.',
              keyPoints: [
                'Class fields are typed; strict mode requires they be initialised.',
                'The constructor takes typed parameters and sets up the instance.',
                'Parameter properties (public/private/readonly on a parameter) declare and assign a field at once.',
                'name!: T is a definite assignment assertion for deferred initialisation.',
              ],
              code: {
                language: 'typescript',
                lines: [
                  'class Point {',
                  '  // parameter properties: declare + assign in one step',
                  '  constructor(public x: number, public y: number) {}',
                  '  distance(): number {',
                  '    return Math.sqrt(this.x ** 2 + this.y ** 2);',
                  '  }',
                  '}',
                  '',
                  'const p = new Point(3, 4);',
                  'p.distance(); // 5',
                ],
                explanation:
                  'public x and public y in the constructor create and assign the x and y fields automatically, avoiding explicit this.x = x lines.',
              },
              commonMistakes: [
                'Leaving a non-optional field uninitialised under strictPropertyInitialization.',
                'Overusing the definite assignment ! when proper initialisation would be safer.',
              ],
              exercises: [
                {
                  type: 'quiz',
                  prompt: 'What does prefixing a constructor parameter with public do?',
                  solution: {
                    explanation: 'It creates a parameter property: a public field of that name is declared and the argument is assigned to it automatically.',
                  },
                },
                {
                  type: 'task',
                  prompt: 'Write a class User with a readonly id and a name, using parameter properties.',
                  solution: {
                    lines: ['class User {', '  constructor(public readonly id: number, public name: string) {}', '}'],
                    explanation: 'The constructor parameters declare and assign id (readonly) and name in one step.',
                  },
                },
                {
                  type: 'predict',
                  prompt: 'Under strict mode, does a class with field name: string and no initialiser and no assignment in the constructor compile?',
                  solution: {
                    explanation: 'No. strictPropertyInitialization requires name to be assigned at declaration or in the constructor, otherwise it is an error.',
                  },
                },
              ],
              docs: 'https://www.typescriptlang.org/docs/handbook/2/classes.html#parameter-properties',
            },
            {
              id: 'ts4-t0-c1',
              title: 'Access modifiers and readonly',
              summary:
                'public, private and protected control visibility; readonly prevents reassignment. These are compile-time rules, distinct from JavaScript\'s # private fields.',
              explanation:
                'TypeScript offers three access modifiers. public (the default) means accessible anywhere; private restricts a member to the declaring class; protected allows access within the class and its subclasses. These are enforced by the compiler only — at runtime a TypeScript private field is still an ordinary property, so it can be reached via dynamic access. For genuine runtime privacy, JavaScript\'s native #name private fields are the better choice and they are also enforced by TypeScript. readonly is orthogonal to visibility: it permits assignment only at declaration or in the constructor and blocks writes afterwards, which is ideal for identifiers and configuration that should never change post-construction. Combining modifiers — private readonly, protected readonly — is common. Choosing the tightest visibility that still works keeps a class\'s surface small and its invariants protected.',
              analogy:
                'Access modifiers are like office doors: public is the lobby anyone enters, protected is a staff-and-trainees area, and private is your locked personal office. readonly is a display case inside any of them — visible, but not to be rearranged.',
              keyPoints: [
                'public (default), private (class only), protected (class plus subclasses).',
                'TypeScript modifiers are compile-time only; #fields are runtime-private.',
                'readonly blocks reassignment after construction; it is about mutability, not visibility.',
                'Modifiers combine, e.g. private readonly.',
              ],
              code: {
                language: 'typescript',
                lines: [
                  'class Account {',
                  '  private balance = 0;',
                  '  readonly owner: string;',
                  '  #pin: string; // truly private at runtime',
                  '',
                  '  constructor(owner: string, pin: string) {',
                  '    this.owner = owner;',
                  '    this.#pin = pin;',
                  '  }',
                  '  deposit(amount: number): void { this.balance += amount; }',
                  '}',
                ],
                explanation:
                  'balance is private (compile-time), owner is readonly, and #pin is a runtime-private field; only deposit can change the balance from outside.',
              },
              commonMistakes: [
                'Believing TypeScript private gives runtime privacy — it does not; use #fields for that.',
                'Confusing readonly (immutability) with private (visibility).',
              ],
              exercises: [
                {
                  type: 'quiz',
                  prompt: 'What is the difference between protected and private?',
                  solution: {
                    explanation: 'private is accessible only within the declaring class; protected is also accessible within subclasses.',
                  },
                },
                {
                  type: 'predict',
                  prompt: 'Is a TypeScript private field actually hidden at runtime?',
                  solution: {
                    explanation: 'No. It is compile-time only and remains a normal property at runtime. Use a #field for true runtime privacy.',
                  },
                },
                {
                  type: 'task',
                  prompt: 'Declare a class field that is visible to subclasses but not outside, and cannot be reassigned.',
                  solution: {
                    lines: ['protected readonly createdAt: Date = new Date();'],
                    explanation: 'protected limits visibility to the class and subclasses; readonly blocks reassignment after initialisation.',
                  },
                },
              ],
              docs: 'https://www.typescriptlang.org/docs/handbook/2/classes.html#member-visibility',
            },
          ],
        },
        {
          id: 'ts4-t1',
          name: 'Inheritance and contracts',
          concepts: [
            {
              id: 'ts4-t1-c0',
              title: 'extends and implements',
              summary:
                'extends inherits behaviour from a base class; implements checks a class against an interface contract without inheriting anything.',
              explanation:
                'These two keywords look similar but do different jobs. extends creates a subclass that inherits the fields and methods of a base class; the subclass can override methods and must call super() in its constructor before using this. A class can extend only one class. implements, by contrast, declares that a class conforms to one or more interfaces: the compiler verifies the class provides every member the interface requires, but no implementation is inherited — interfaces have none. You can combine them: a class may extend one base and implement several interfaces. A key point is that implements is purely a check; it does not change the class\'s type or add members, so forgetting a required property surfaces as an error on the class declaration. Use extends for genuine is-a relationships with shared code, and implements to guarantee a class satisfies a contract.',
              analogy:
                'extends is inheriting your family\'s recipes and using them. implements is signing a quality certificate promising your dish meets a published standard — you still cook it yourself.',
              keyPoints: [
                'extends inherits implementation; a class extends at most one class.',
                'implements only checks conformance to an interface; nothing is inherited.',
                'A class can extend one base and implement many interfaces.',
                'Subclass constructors must call super() before using this.',
              ],
              code: {
                language: 'typescript',
                lines: [
                  'interface Serializable { toJSON(): string }',
                  '',
                  'class Animal {',
                  '  constructor(public name: string) {}',
                  "  speak(): string { return this.name + ' makes a sound'; }",
                  '}',
                  '',
                  'class Dog extends Animal implements Serializable {',
                  "  speak(): string { return this.name + ' barks'; } // override",
                  '  toJSON(): string { return JSON.stringify({ name: this.name }); }',
                  '}',
                ],
                explanation:
                  'Dog extends Animal (inheriting and overriding speak) and implements Serializable (the compiler checks it provides toJSON).',
              },
              commonMistakes: [
                'Expecting implements to provide method bodies — interfaces have none.',
                'Using this in a subclass constructor before calling super().',
              ],
              exercises: [
                {
                  type: 'quiz',
                  prompt: 'What is the core difference between extends and implements?',
                  solution: {
                    explanation: 'extends inherits implementation from a base class; implements only verifies that a class satisfies an interface, inheriting no code.',
                  },
                },
                {
                  type: 'predict',
                  prompt: 'Can a single class implement multiple interfaces?',
                  solution: { explanation: 'Yes. A class may implement any number of interfaces (while extending at most one class).' },
                },
                {
                  type: 'task',
                  prompt: 'Write a class Circle that implements an interface Shape requiring an area(): number method.',
                  solution: {
                    lines: ['class Circle implements Shape {', '  constructor(private r: number) {}', '  area(): number { return Math.PI * this.r ** 2; }', '}'],
                    explanation: 'implements Shape forces Circle to provide an area method matching the interface.',
                  },
                },
              ],
              docs: 'https://www.typescriptlang.org/docs/handbook/2/classes.html#implements-clauses',
            },
            {
              id: 'ts4-t1-c1',
              title: 'Abstract classes and interfaces as contracts',
              summary:
                'An abstract class provides shared implementation plus required abstract members subclasses must fill in. Interfaces define contracts with no implementation at all.',
              explanation:
                'An abstract class is a base that cannot be instantiated directly; it exists to be extended. It can mix concrete members (shared code) with abstract members — methods or properties declared without a body that every concrete subclass must implement. This is the template method pattern: the base defines the algorithm and shared behaviour while delegating specific steps to subclasses. Interfaces serve a related but distinct role: they are pure contracts with no runtime presence and no implementation, used to describe shapes that anything (a class, an object literal, a function) can satisfy structurally. Choosing between them comes down to whether you need to share code. If you want common behaviour plus required overrides and an is-a hierarchy, use an abstract class; if you only need to specify a shape that many unrelated implementers must meet, use an interface. Interfaces also support multiple conformance, while abstract inheritance is single.',
              analogy:
                'An abstract class is a partly-built house with some rooms finished and others left as marked, mandatory extensions. An interface is the building code: a list of requirements with no bricks of its own.',
              keyPoints: [
                'Abstract classes cannot be instantiated; they are meant to be extended.',
                'They mix concrete (shared) members with abstract members subclasses must implement.',
                'Interfaces are pure contracts: no implementation, erased at runtime.',
                'Abstract class for shared code and an is-a hierarchy; interface for a shape many types satisfy.',
              ],
              diagram: {
                type: 'mermaid',
                lines: [
                  'flowchart TD',
                  '  Abs[Abstract Shape] --> Circle[Circle]',
                  '  Abs --> Square[Square]',
                  '  Abs -. defines .- Area[abstract area]',
                ],
                caption: 'An abstract base supplies shared code and declares abstract members that each concrete subclass must implement.',
              },
              code: {
                language: 'typescript',
                lines: [
                  'abstract class Shape {',
                  '  abstract area(): number;            // must be implemented',
                  "  describe(): string {                // shared concrete method",
                  "    return 'area is ' + this.area();",
                  '  }',
                  '}',
                  '',
                  'class Square extends Shape {',
                  '  constructor(private side: number) { super(); }',
                  '  area(): number { return this.side ** 2; }',
                  '}',
                  '',
                  '// new Shape(); // Error: cannot instantiate an abstract class',
                ],
                explanation:
                  'Shape supplies the shared describe method and an abstract area; Square provides the concrete area. Shape itself cannot be instantiated.',
              },
              exercises: [
                {
                  type: 'quiz',
                  prompt: 'When should you choose an abstract class over an interface?',
                  solution: {
                    explanation: 'When you need to share concrete implementation across subclasses (plus require certain overrides) and model an is-a hierarchy; interfaces carry no implementation.',
                  },
                },
                {
                  type: 'predict',
                  prompt: 'Can you write new on an abstract class directly?',
                  solution: {
                    explanation: 'No. Abstract classes cannot be instantiated; you must extend them with a concrete subclass and instantiate that.',
                  },
                },
                {
                  type: 'task',
                  prompt: 'Declare an abstract class Repository with an abstract findById(id: number): unknown method.',
                  solution: {
                    lines: ['abstract class Repository {', '  abstract findById(id: number): unknown;', '}'],
                    explanation: 'The abstract method has no body and must be implemented by every concrete subclass.',
                  },
                },
              ],
              docs: 'https://www.typescriptlang.org/docs/handbook/2/classes.html#abstract-classes-and-members',
            },
          ],
        },
        {
          id: 'ts4-t2',
          name: 'Type guards and assertions',
          concepts: [
            {
              id: 'ts4-t2-c0',
              title: 'Built-in guards: typeof, instanceof and in',
              summary:
                'typeof narrows primitives, instanceof narrows class instances, and the in operator narrows by checking for a property.',
              explanation:
                'These three operators are the everyday tools for narrowing a broad type to a specific one based on a runtime check. typeof tests primitive tags — "string", "number", "boolean", "function", "object", "undefined", "symbol", "bigint" — and is the right tool when a union mixes primitives. instanceof checks whether a value was constructed by a particular class (or subclass), narrowing it to that class type; it relies on the prototype chain, so it works for class instances but not plain interfaces. The in operator checks whether a property exists on a value, which is perfect for distinguishing object shapes that lack a shared discriminant: if ("swim" in pet) narrows pet to the variant that has a swim method. The compiler\'s control-flow analysis applies each of these so that within the guarded block the value has the narrowed type, and code outside reverts to the broader union.',
              analogy:
                'These guards are three kinds of inspection at a checkpoint: typeof reads the document category, instanceof checks which factory stamped the item, and in checks whether a particular feature is present.',
              keyPoints: [
                'typeof narrows primitives via their runtime type tag.',
                'instanceof narrows to a class using the prototype chain.',
                'The in operator narrows by testing whether a property exists.',
                'Narrowing applies only inside the guarded block.',
              ],
              code: {
                language: 'typescript',
                lines: [
                  'class Dog { bark() {} }',
                  'class Cat { meow() {} }',
                  '',
                  'function speak(pet: Dog | Cat): void {',
                  '  if (pet instanceof Dog) {',
                  '    pet.bark();   // narrowed to Dog',
                  '  } else {',
                  '    pet.meow();   // narrowed to Cat',
                  '  }',
                  '}',
                  '',
                  'function pad(x: string | number) {',
                  "  return typeof x === 'number' ? x.toFixed(2) : x.trim();",
                  '}',
                ],
                explanation:
                  'instanceof narrows pet to Dog or Cat in each branch; typeof narrows x to number or string so the right method is available.',
              },
              commonMistakes: [
                'Using instanceof on values typed only by an interface — there is no constructor to check.',
                'Relying on typeof to distinguish two object shapes — it only reports "object" for both.',
              ],
              exercises: [
                {
                  type: 'quiz',
                  prompt: 'Which guard would you use to distinguish two object shapes that have no shared discriminant property?',
                  solution: {
                    explanation: 'The in operator, by testing for a property unique to one shape, e.g. if ("fly" in animal).',
                  },
                },
                {
                  type: 'predict',
                  prompt: 'What does typeof report for both a plain object and an array?',
                  solution: {
                    explanation: '"object" for both — typeof cannot distinguish them; use Array.isArray or instanceof for arrays.',
                  },
                },
                {
                  type: 'task',
                  prompt: 'Write a check that narrows value: Date | string to Date using instanceof.',
                  solution: {
                    lines: ['if (value instanceof Date) {', '  value.getTime();', '}'],
                    explanation: 'instanceof Date narrows value to Date inside the block, exposing Date methods.',
                  },
                },
              ],
              docs: 'https://www.typescriptlang.org/docs/handbook/2/narrowing.html#instanceof-narrowing',
            },
            {
              id: 'ts4-t2-c1',
              title: 'Custom type predicates and assertion functions',
              summary:
                'A type predicate (arg is T) teaches the compiler your own narrowing function; an assertion function (asserts ...) narrows by throwing if a condition fails.',
              explanation:
                'When narrowing logic is non-trivial, you encapsulate it in a function whose return type is a type predicate: function isString(x: unknown): x is string. When such a function returns true, the compiler narrows the argument to string at the call site — your function becomes a custom, reusable guard. This is how you safely validate unknown data, like API responses. A related construct is the assertion function, declared with an asserts clause: function assert(cond: unknown): asserts cond throws when the condition is falsy, and afterwards the compiler treats the condition as guaranteed true (asserts x is Foo can even narrow a specific value). These mirror Node\'s assert and let you write a check once, then proceed with the narrowed type. The responsibility is on you to implement the check correctly — the compiler trusts the predicate or assertion you declare, so a wrong implementation creates an unsound lie about the type.',
              analogy:
                'A type predicate is a trusted inspector who stamps verified on a parcel so everyone downstream treats it as the declared contents. An assertion function is a bouncer who simply refuses entry unless the condition holds.',
              keyPoints: [
                'A predicate return type arg is T turns a function into a custom guard.',
                'When it returns true, the compiler narrows the argument to T.',
                'Assertion functions use asserts and throw when the condition is false.',
                'The compiler trusts your declaration — an incorrect check is unsound.',
              ],
              code: {
                language: 'typescript',
                lines: [
                  'function isString(x: unknown): x is string {',
                  "  return typeof x === 'string';",
                  '}',
                  '',
                  'function assertDefined<T>(v: T): asserts v is NonNullable<T> {',
                  "  if (v == null) throw new Error('Expected a value');",
                  '}',
                  '',
                  'const data: unknown = getData();',
                  'if (isString(data)) data.toUpperCase(); // narrowed to string',
                ],
                explanation:
                  'isString is a custom guard that narrows data to string; assertDefined throws on null/undefined so afterwards the value is known to be non-nullable.',
              },
              commonMistakes: [
                'Writing a predicate whose body does not actually verify the claimed type, lying to the compiler.',
                'Returning boolean instead of a predicate type, which gives no narrowing benefit.',
              ],
              exercises: [
                {
                  type: 'quiz',
                  prompt: 'What return type turns a regular boolean-returning function into a custom type guard?',
                  solution: {
                    explanation: 'A type predicate of the form parameterName is Type, e.g. x is string, instead of plain boolean.',
                  },
                },
                {
                  type: 'task',
                  prompt: 'Write a type guard isNumber that narrows an unknown value to number.',
                  solution: {
                    lines: ['function isNumber(x: unknown): x is number {', "  return typeof x === 'number';", '}'],
                    explanation: 'The x is number return type lets callers narrow the value to number when the function returns true.',
                  },
                },
                {
                  type: 'predict',
                  prompt: 'After calling an assertion function assert(x is Cat) that does not throw, what type does x have?',
                  solution: {
                    explanation: 'Cat — the asserts clause guarantees the condition held, so the compiler narrows x to Cat for the rest of the scope.',
                  },
                },
              ],
              docs: 'https://www.typescriptlang.org/docs/handbook/2/narrowing.html#using-type-predicates',
            },
            {
              id: 'ts4-t2-c2',
              title: 'Type assertions and the non-null assertion',
              summary:
                'A type assertion (as) tells the compiler to treat a value as a given type; the non-null assertion (!) removes null and undefined. Both override the checker, so use them sparingly.',
              explanation:
                'Sometimes you know more about a value\'s type than the compiler can infer. A type assertion, written value as Type (or the older <Type>value), overrides the inferred type without any runtime check or conversion — it is purely a compile-time claim, so an incorrect assertion can hide real bugs. TypeScript only allows assertions between types that overlap; to force an unrelated cast you must go through unknown (value as unknown as Other), which is a deliberate red flag. The non-null assertion operator, a trailing !, is a focused assertion that strips null and undefined from a value\'s type — element!.focus() says trust me, this is not null. It too performs no runtime check, so if you are wrong you get a runtime error the compiler would otherwise have warned about. Prefer real narrowing (guards, checks) over assertions; reach for as and ! only when you genuinely have knowledge the type system lacks, such as DOM lookups or well-validated data.',
              analogy:
                'A type assertion is overriding a label by hand — fast, but if you mislabel a bottle the contents do not change to match. The non-null assertion is crossing out maybe empty on a box without looking inside.',
              keyPoints: [
                'value as Type is a compile-time claim with no runtime effect or check.',
                'Assertions are allowed only between overlapping types; force via as unknown as T.',
                'The non-null assertion ! removes null and undefined from a type.',
                'Both bypass safety — prefer real narrowing and use them sparingly.',
              ],
              code: {
                language: 'typescript',
                lines: [
                  "const el = document.getElementById('app') as HTMLDivElement;",
                  'el.style.color = "red"; // asserted to be a div, not null',
                  '',
                  'function len(s: string | null) {',
                  '  return s!.length; // non-null assertion: trust s is not null',
                  '}',
                  '',
                  '// Forced (unsafe) cast through unknown:',
                  'const n = ("5" as unknown) as number;',
                ],
                explanation:
                  'as HTMLDivElement and s! are compile-time claims with no runtime check; the double cast through unknown forces an unrelated, unsafe conversion.',
              },
              commonMistakes: [
                'Using as to silence an error when the value really is the other type — masking a genuine bug.',
                'Sprinkling ! everywhere instead of properly checking for null/undefined.',
              ],
              exercises: [
                {
                  type: 'quiz',
                  prompt: 'Does a type assertion (as) perform any runtime conversion or check?',
                  solution: {
                    explanation: 'No. It is purely a compile-time instruction to the type checker; the runtime value is unchanged and unverified.',
                  },
                },
                {
                  type: 'predict',
                  prompt: 'What does the trailing ! in user!.name do to the type of user?',
                  solution: {
                    explanation: 'It removes null and undefined from user\'s type for that access, asserting (without checking) that user is present.',
                  },
                },
                {
                  type: 'task',
                  prompt: 'Write a forced cast of the value x to type Foo when the types do not overlap.',
                  solution: {
                    lines: ['const f = x as unknown as Foo;'],
                    explanation: 'Routing through unknown is required to assert between unrelated types, and it deliberately signals an unsafe cast.',
                  },
                },
              ],
              docs: 'https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#type-assertions',
            },
          ],
        },
      ],
    },
    /* ──────────────── LEVEL 5 — TOOLING AND REAL-WORLD TS ──────────────── */
    {
      level: 5,
      name: 'Tooling and real-world TS',
      focus: 'The compiler config, modules and declaration files, and TypeScript in production',
      accent: '#3178c6',
      soft: '#e6effa',
      topics: [
        {
          id: 'ts5-t0',
          name: 'The compiler and tsconfig',
          concepts: [
            {
              id: 'ts5-t0-c0',
              title: 'tsconfig.json and the strict family',
              summary:
                'tsconfig.json configures the project for tsc and editors. The strict flag enables a bundle of checks that make TypeScript genuinely safe.',
              explanation:
                'A tsconfig.json at a project\'s root tells tsc (and your editor\'s language server) how to compile: which files to include, the output target, module format, and dozens of checker behaviours under compilerOptions. The single most important setting is strict: true, which switches on a family of stricter checks at once — notably strictNullChecks (null and undefined are not silently assignable everywhere), noImplicitAny (variables and parameters that would otherwise be any must be typed), strictFunctionTypes, strictPropertyInitialization, and more. Enabling strict from day one is the recommended default; new projects scaffolded by tsc --init turn it on. Beyond strict there are useful extras like noUncheckedIndexedAccess (adds undefined to index reads) and exactOptionalPropertyTypes. You can also extend a shared base config and use project references to split large codebases. Treat tsconfig as the contract for how strict and how modern your codebase is.',
              analogy:
                'tsconfig.json is the settings panel of a power tool: strict mode is the safety guard you should leave on, and the other flags fine-tune how cautious the tool is.',
              keyPoints: [
                'tsconfig.json configures compilation and powers editor type-checking.',
                'strict: true enables strictNullChecks, noImplicitAny and the rest at once.',
                'Recommended on for all new projects; tsc --init enables it.',
                'Extra flags like noUncheckedIndexedAccess tighten safety further.',
              ],
              code: {
                language: 'json',
                lines: [
                  '{',
                  '  "compilerOptions": {',
                  '    "strict": true,',
                  '    "target": "ES2022",',
                  '    "module": "NodeNext",',
                  '    "noUncheckedIndexedAccess": true,',
                  '    "outDir": "dist"',
                  '  },',
                  '  "include": ["src"]',
                  '}',
                ],
                explanation:
                  'This config turns on strict mode plus stricter index access, targets modern JavaScript, and compiles the src folder into dist.',
              },
              commonMistakes: [
                'Leaving strict off, which silently allows implicit any and unchecked nulls.',
                'Editing settings and forgetting that the editor reads the same tsconfig as tsc.',
              ],
              exercises: [
                {
                  type: 'quiz',
                  prompt: 'Which single tsconfig option enables strictNullChecks and noImplicitAny together?',
                  solution: { explanation: 'strict: true — it is an umbrella flag that turns on the whole strict family of checks.' },
                },
                {
                  type: 'predict',
                  prompt: 'With strictNullChecks on, does let s: string = null compile?',
                  solution: {
                    explanation: 'No. null is not assignable to string under strictNullChecks; you would need string | null.',
                  },
                },
                {
                  type: 'task',
                  prompt: 'Write the minimal compilerOptions snippet to enable strict mode and output to a dist folder.',
                  solution: {
                    lines: ['"compilerOptions": {', '  "strict": true,', '  "outDir": "dist"', '}'],
                    explanation: 'strict enables the safety checks and outDir directs emitted JavaScript into dist.',
                  },
                },
              ],
              docs: 'https://www.typescriptlang.org/tsconfig',
            },
            {
              id: 'ts5-t0-c1',
              title: 'target, module, lib and source maps',
              summary:
                'target sets the JavaScript syntax level to emit, module the module system, lib the available built-in APIs, and sourceMap links output back to your TypeScript.',
              explanation:
                'Several compiler options control what JavaScript tsc produces and what it assumes about the environment. target chooses the ECMAScript syntax level of the output (for example ES2022); features newer than the target are down-levelled, while older targets produce more compatible but more verbose code. module selects the module system for emitted code — NodeNext or ESNext for modern ES modules, CommonJS for classic Node. lib declares which built-in type definitions are available, such as DOM for browser APIs or ES2022 for newer JavaScript methods; if you set target you usually get a matching default lib, but you override it when, say, a Node project should not include DOM. sourceMap (and inlineSourceMap) emit .map files so debuggers and stack traces point back to your original .ts lines instead of compiled output. Getting these right means your code runs in the intended environment and is debuggable.',
              analogy:
                'target is which dialect to translate into, module is the filing system the translation uses, lib is the dictionary of words you are allowed to assume, and source maps are the translator\'s footnotes pointing back to the original sentence.',
              keyPoints: [
                'target sets the emitted ECMAScript syntax level; newer features are down-levelled.',
                'module selects the output module system (NodeNext, ESNext, CommonJS).',
                'lib declares available built-in APIs, e.g. DOM or ES2022.',
                'sourceMap emits .map files so debugging maps back to the .ts source.',
              ],
              code: {
                language: 'json',
                lines: [
                  '{',
                  '  "compilerOptions": {',
                  '    "target": "ES2022",',
                  '    "module": "NodeNext",',
                  '    "lib": ["ES2022"],',
                  '    "sourceMap": true',
                  '  }',
                  '}',
                ],
                explanation:
                  'Targets ES2022 syntax and modules, includes only the ES2022 lib (no DOM, suiting a Node project), and emits source maps for debugging.',
              },
              exercises: [
                {
                  type: 'quiz',
                  prompt: 'What does the lib option control, and when would you omit DOM from it?',
                  solution: {
                    explanation: 'lib declares which built-in type definitions are available; you omit DOM for a pure Node project that should not see browser APIs like document.',
                  },
                },
                {
                  type: 'predict',
                  prompt: 'If target is set to a very old version, what happens to modern syntax like optional chaining?',
                  solution: {
                    explanation: 'It is down-levelled into equivalent older JavaScript so it runs on the older target, producing more verbose output.',
                  },
                },
                {
                  type: 'task',
                  prompt: 'Name the compiler option that makes debuggers map compiled JavaScript back to your TypeScript lines.',
                  solution: {
                    lines: ['"sourceMap": true'],
                    explanation: 'sourceMap emits .map files that connect the emitted JavaScript to the original source.',
                  },
                },
              ],
              docs: 'https://www.typescriptlang.org/tsconfig#target',
            },
          ],
        },
        {
          id: 'ts5-t1',
          name: 'Modules and declaration files',
          concepts: [
            {
              id: 'ts5-t1-c0',
              title: 'ES modules and import type',
              summary:
                'TypeScript uses standard ES module import/export syntax and adds type-only imports to keep types out of the emitted JavaScript.',
              explanation:
                'A TypeScript file with a top-level import or export is a module, with its own scope; files without them are treated as global scripts. You use the same import and export syntax as modern JavaScript, including named and default exports and re-exports. Because TypeScript erases types, importing something used only as a type can be expressed with import type { User } from "./user", which guarantees the import is removed from the output and never causes a runtime side effect — important under isolatedModules and for tree-shaking. You can also inline it: import { type User, createUser } from "./user". Module resolution is governed by the module and moduleResolution options; NodeNext follows Node\'s ESM rules, which require explicit file extensions in relative import paths. Understanding the script-vs-module distinction and type-only imports prevents subtle build issues and keeps emitted bundles lean.',
              analogy:
                'A regular import is shipping an actual part into your factory; import type is requesting only the blueprint — useful for planning, but nothing physical arrives on the loading dock.',
              keyPoints: [
                'A file with top-level import/export is a module with its own scope.',
                'TypeScript uses standard ES module syntax: named, default, re-exports.',
                'import type imports something used only as a type and is fully erased.',
                'Resolution depends on module/moduleResolution; NodeNext needs file extensions.',
              ],
              code: {
                language: 'typescript',
                lines: [
                  '// user.ts',
                  'export interface User { id: number; name: string }',
                  'export function createUser(name: string): User {',
                  '  return { id: Date.now(), name };',
                  '}',
                  '',
                  '// main.ts',
                  "import { createUser, type User } from './user.js';",
                  "const u: User = createUser('Ada');",
                ],
                explanation:
                  'User is imported as a type (erased at runtime) while createUser is a real value import; the .js extension suits NodeNext module resolution.',
              },
              commonMistakes: [
                'Omitting file extensions in relative imports under NodeNext module resolution.',
                'Importing a type as a value, which can leave an unnecessary runtime import.',
              ],
              exercises: [
                {
                  type: 'quiz',
                  prompt: 'What distinguishes a TypeScript module from a global script file?',
                  solution: {
                    explanation: 'A module has at least one top-level import or export and its own scope; a file with neither is treated as a global script.',
                  },
                },
                {
                  type: 'predict',
                  prompt: 'Does import type { Foo } from "./foo" leave any code in the compiled JavaScript?',
                  solution: {
                    explanation: 'No. A type-only import is fully erased during compilation, so it produces no runtime import or side effect.',
                  },
                },
                {
                  type: 'task',
                  prompt: 'Write an import that brings in createUser as a value and User as a type from "./user.js".',
                  solution: {
                    lines: ["import { createUser, type User } from './user.js';"],
                    explanation: 'The inline type modifier marks User as type-only while createUser remains a real value import.',
                  },
                },
              ],
              docs: 'https://www.typescriptlang.org/docs/handbook/2/modules.html',
            },
            {
              id: 'ts5-t1-c1',
              title: 'Declaration files, @types and ambient declarations',
              summary:
                'A .d.ts file describes the types of JavaScript code without implementation. DefinitelyTyped supplies @types packages for untyped libraries.',
              explanation:
                'Declaration files (.d.ts) contain only type information — no runnable code. They let TypeScript understand JavaScript libraries that were written without types: the library ships its compiled JavaScript plus a .d.ts describing its API. When tsc compiles your library with declaration: true, it generates these files automatically so consumers get types. For popular libraries that do not bundle their own types, the community maintains DefinitelyTyped, a huge repository published as @types/* packages; installing @types/node or @types/lodash adds the missing types. Ambient declarations, written with declare, describe things that exist at runtime but have no TypeScript source — declare global to augment global scope, declare module "name" to type an untyped module, or to teach TypeScript about non-code imports. Together these mechanisms let a typed codebase interoperate with the entire untyped JavaScript ecosystem.',
              analogy:
                'A .d.ts file is the table of contents and index for a book whose pages are written in another language — it tells you what is inside and how to use it without translating every page.',
              keyPoints: [
                'A .d.ts file holds types only, no implementation.',
                'declaration: true makes tsc emit .d.ts files for your library\'s consumers.',
                'DefinitelyTyped provides @types/* packages for untyped libraries.',
                'declare creates ambient declarations for globals and untyped modules.',
              ],
              code: {
                language: 'typescript',
                lines: [
                  '// types.d.ts — describe an untyped module and a global',
                  "declare module 'legacy-lib' {",
                  '  export function doThing(x: number): string;',
                  '}',
                  '',
                  'declare global {',
                  '  interface Window { appVersion: string }',
                  '}',
                  'export {};',
                ],
                explanation:
                  'declare module gives types to an untyped package; declare global adds appVersion to Window. The trailing export {} keeps the file a module.',
              },
              commonMistakes: [
                'Installing a library but forgetting its @types package, leaving it typed as any.',
                'Adding declare global without keeping the file a module, polluting scope unexpectedly.',
              ],
              exercises: [
                {
                  type: 'quiz',
                  prompt: 'What is DefinitelyTyped and how do you consume it?',
                  solution: {
                    explanation: 'It is a community repository of declaration files for untyped libraries, published as @types/* packages you install with npm, e.g. @types/node.',
                  },
                },
                {
                  type: 'predict',
                  prompt: 'Does a .d.ts file produce any JavaScript when compiled?',
                  solution: { explanation: 'No. Declaration files contain only types and emit no runtime code.' },
                },
                {
                  type: 'task',
                  prompt: 'Write the compiler option that makes tsc emit .d.ts files for a library.',
                  solution: {
                    lines: ['"declaration": true'],
                    explanation: 'With declaration: true, tsc generates declaration files alongside the emitted JavaScript so consumers get types.',
                  },
                },
              ],
              docs: 'https://www.typescriptlang.org/docs/handbook/declaration-files/introduction.html',
            },
          ],
        },
        {
          id: 'ts5-t2',
          name: 'TypeScript in practice',
          concepts: [
            {
              id: 'ts5-t2-c0',
              title: 'TypeScript with Node and React',
              summary:
                'TypeScript shines in real apps: typed Node back ends with @types/node, and React components with typed props and hooks via JSX.',
              explanation:
                'In a Node project you install typescript and @types/node, set module to NodeNext, and either compile with tsc or run sources directly with a runtime like tsx or ts-node; many teams use tsc --noEmit for checking and a bundler for the build. In React, you write components in .tsx files and type their props with an interface or type, while hooks are generic so they infer or accept types: useState<number>(0) types the state, and event handlers receive typed React events. The jsx compiler option (react-jsx for the modern transform) tells TypeScript how to emit JSX. Typed props turn a component\'s contract into something the editor checks and autocompletes for every call site, catching missing or wrong props before runtime. Across both, the workflow is the same: model your data with types, let inference cover the rest, and treat tsc as a gate in CI so type errors never reach production.',
              analogy:
                'Adding types to Node and React is like fitting your kitchen with measuring cups and labelled containers: the cooking is the same, but mistakes get caught at prep time instead of at the table.',
              keyPoints: [
                'Node: install @types/node, set module NodeNext, run with tsc/tsx or ts-node.',
                'React: .tsx files, props typed via interface/type, hooks are generic.',
                'useState<T>() and typed event handlers give checked, autocompleted components.',
                'The jsx option (react-jsx) controls how JSX is emitted.',
              ],
              code: {
                language: 'typescript',
                lines: [
                  "import { useState } from 'react';",
                  '',
                  'interface CounterProps {',
                  '  start?: number;',
                  '  label: string;',
                  '}',
                  '',
                  'function Counter({ start = 0, label }: CounterProps) {',
                  '  const [count, setCount] = useState<number>(start);',
                  '  return <button onClick={() => setCount(count + 1)}>{label}: {count}</button>;',
                  '}',
                ],
                explanation:
                  'CounterProps types the component contract; useState<number> types the state; the typed onClick handler and props are all checked by the compiler.',
              },
              exercises: [
                {
                  type: 'quiz',
                  prompt: 'Which package provides Node.js built-in API types, and how is React state typed?',
                  solution: {
                    explanation: '@types/node provides Node API types; React state is typed via the generic useState, e.g. useState<number>(0).',
                  },
                },
                {
                  type: 'task',
                  prompt: 'Write a props type for a Greeting component with a required name string and an optional times number.',
                  solution: {
                    lines: ['interface GreetingProps {', '  name: string;', '  times?: number;', '}'],
                    explanation: 'name is required and times optional; using this as the props type lets the compiler check every usage.',
                  },
                },
                {
                  type: 'predict',
                  prompt: 'What file extension do you use for React components written in TypeScript with JSX?',
                  solution: { explanation: '.tsx — the x signals JSX support, just as .jsx does for plain JavaScript React files.' },
                },
              ],
              docs: 'https://www.typescriptlang.org/docs/handbook/react.html',
            },
            {
              id: 'ts5-t2-c1',
              title: 'Migrating JavaScript and best practices',
              summary:
                'You migrate incrementally with allowJs and checkJs, tighten strictness over time, and follow a handful of idioms that keep typed code clean.',
              explanation:
                'You do not rewrite a JavaScript codebase overnight. The migration path is gradual: add a tscontig with allowJs so .js and .ts coexist, optionally turn on checkJs (or per-file // @ts-check) to type-check JavaScript using JSDoc, then rename files to .ts one module at a time and replace any with real types. Loosening flags temporarily (for example leaving strict off, then enabling it later) lets the team make steady progress. The everyday best practices are well established: prefer unknown over any for untrusted input; let inference work and annotate boundaries (function signatures, exported APIs); model finite options with literal unions and use discriminated unions for variant data; reach for the utility types instead of rewriting shapes; use the satisfies operator to validate a value against a type while keeping its narrow inferred type; and keep strict mode on. Avoid the escape hatches — any, as, and ! — except where you truly have knowledge the compiler lacks.',
              analogy:
                'Migrating to TypeScript is like renovating a house while living in it: you do one room at a time, keep the rest livable, and gradually raise the whole place to code.',
              keyPoints: [
                'Migrate gradually: allowJs, checkJs/@ts-check with JSDoc, then rename to .ts.',
                'Prefer unknown over any; annotate boundaries and let inference do the rest.',
                'Use literal/discriminated unions and the utility types over hand-written shapes.',
                'Use satisfies to check a value against a type without widening it; keep strict on.',
              ],
              code: {
                language: 'typescript',
                lines: [
                  'type Color = { r: number; g: number; b: number };',
                  '',
                  '// satisfies checks the shape but keeps the narrow inferred type',
                  'const palette = {',
                  '  primary: { r: 49, g: 120, b: 198 },',
                  '  accent: { r: 230, g: 239, b: 250 },',
                  '} satisfies Record<string, Color>;',
                  '',
                  'palette.primary.r; // still narrowly typed, and validated as Color',
                ],
                explanation:
                  'satisfies verifies palette against Record<string, Color> yet preserves the exact keys and types, unlike a plain annotation which would widen them.',
              },
              commonMistakes: [
                'Attempting a big-bang rewrite instead of an incremental allowJs migration.',
                'Reaching for any to finish faster, which spreads untyped values through the codebase.',
              ],
              exercises: [
                {
                  type: 'quiz',
                  prompt: 'Which compiler option lets JavaScript and TypeScript files coexist during a migration?',
                  solution: {
                    explanation: 'allowJs — it lets .js files live alongside .ts files; checkJs additionally type-checks the JavaScript.',
                  },
                },
                {
                  type: 'predict',
                  prompt: 'How does satisfies differ from a plain type annotation on a const object?',
                  solution: {
                    explanation: 'satisfies validates the value against the type but keeps the narrow inferred type; an annotation would widen the value to the declared type.',
                  },
                },
                {
                  type: 'task',
                  prompt: 'State two best practices for writing maintainable TypeScript.',
                  solution: {
                    explanation: 'Examples: keep strict mode on; prefer unknown over any; annotate function/API boundaries and let inference handle locals; use utility types and discriminated unions; avoid as and ! unless necessary.',
                  },
                },
              ],
              docs: 'https://www.typescriptlang.org/docs/handbook/migrating-from-javascript.html',
            },
          ],
        },
      ],
    },
  ],
};

export default content;
