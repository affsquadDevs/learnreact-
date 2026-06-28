// JavaScript — course content. Original explanations written for self-study; same schema as the other courses.
const content = {
  meta: {
    title: 'JavaScript: The Language from Fundamentals to Mastery',
    description:
      'A complete, hands-on path through JavaScript the language: from what it is and how it runs, through variables, control flow, functions, scope and closures, into objects, arrays and built-ins, modern syntax and the asynchronous model, finishing with the DOM, error handling, prototypes and classes. Every concept comes with runnable code, diagrams, common mistakes and exercises.',
    schemaVersion: '1.0',
    status: 'complete',
  },
  levels: [
    /* ───────────────────── LEVEL 1 — FUNDAMENTALS ───────────────────── */
    {
      level: 1,
      name: 'Fundamentals',
      focus: 'What JavaScript is, where it runs, and the core building blocks of values and control flow',
      accent: '#eab308',
      soft: '#fef9c3',
      topics: [
        {
          id: 'js1-t0',
          name: 'What JavaScript is and running it',
          concepts: [
            {
              id: 'js1-t0-c0',
              title: 'What JavaScript is and a short history',
              summary:
                'JavaScript is a high-level, dynamically typed programming language originally created to make web pages interactive, now used everywhere from browsers to servers.',
              explanation:
                'JavaScript was created by Brendan Eich at Netscape in 1995, famously in about ten days, to add interactivity to web pages. Despite the name it has no real relationship to Java; the name was a marketing decision. The language was standardised as ECMAScript, and the modern era began with ES2015 (also called ES6), which added classes, modules, arrow functions, let and const, promises and much more. Today the standard evolves yearly, so we speak of ES2015 through the latest annual edition. JavaScript is high-level (it manages memory for you), dynamically typed (a variable can hold any type and change type), and multi-paradigm (you can write procedural, functional and object-oriented code). It is the only language that runs natively in every web browser, which is why it became one of the most widely used languages in the world.',
              analogy:
                'JavaScript is like the universal electrical outlet of the web: every browser ships with a socket for it, so anything you build plugs in everywhere without extra adapters.',
              keyPoints: [
                'Created in 1995 by Brendan Eich; unrelated to Java despite the name.',
                'Standardised as ECMAScript; ES2015 (ES6) began the modern era and the standard now updates yearly.',
                'High-level, dynamically typed and multi-paradigm.',
                'The only language that runs natively in all web browsers.',
              ],
              code: {
                language: 'javascript',
                lines: [
                  '// JavaScript is dynamically typed: a variable can change type',
                  'let value = 42;        // a number',
                  'value = \'forty-two\';   // now a string, no error',
                  'console.log(value);    // forty-two',
                ],
                explanation:
                  'The same variable holds a number and then a string. A statically typed language would reject the reassignment; JavaScript allows it.',
              },
              exercises: [
                {
                  type: 'quiz',
                  prompt: 'Is JavaScript the same thing as Java? Explain in one sentence.',
                  hint: 'Think about the origin of the name.',
                  solution: {
                    explanation:
                      'No. They are entirely separate languages; JavaScript was named after Java for marketing reasons in the 1990s but shares almost nothing with it.',
                  },
                },
                {
                  type: 'quiz',
                  prompt: 'What does it mean that JavaScript is dynamically typed?',
                  solution: {
                    explanation:
                      'The type is associated with the value at runtime, not with the variable, so a single variable can hold values of different types over time without a compile-time error.',
                  },
                },
                {
                  type: 'predict',
                  prompt: 'What is the official standard that defines the JavaScript language called, and roughly how often does a new edition appear?',
                  solution: {
                    explanation:
                      'It is called ECMAScript, defined by TC39, and a new edition is published every year (ES2015, ES2016, and so on).',
                  },
                },
              ],
              docs: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/About_JavaScript',
            },
            {
              id: 'js1-t0-c1',
              title: 'Engines, V8, browser versus Node',
              summary:
                'A JavaScript engine compiles and runs your code; V8 powers Chrome and Node.js, letting the same language run in the browser and on the server.',
              explanation:
                'JavaScript source code is executed by an engine, a program that reads your text, compiles it to fast machine code and runs it. The most famous engine is V8, built by Google for Chrome; other browsers ship their own (SpiderMonkey in Firefox, JavaScriptCore in Safari). Modern engines use just-in-time (JIT) compilation: they start interpreting quickly, then optimise hot code paths into machine code as the program runs. Node.js takes the V8 engine out of the browser and embeds it in a standalone runtime, adding APIs for files, networking and the operating system. This is why the same language runs in two very different environments. The key difference is the surrounding APIs: a browser gives you the DOM, window and fetch, while Node gives you modules like fs and http. The core language is identical; only the host objects differ.',
              analogy:
                'The engine is like a car engine and the environment is the vehicle around it: the same V8 engine can sit inside a browser (a sports car for the web) or inside Node (a delivery truck for servers).',
              keyPoints: [
                'An engine compiles and executes JavaScript; V8 is the best-known one.',
                'Engines use JIT compilation: interpret fast, then optimise hot code.',
                'Node.js embeds V8 outside the browser to run JS on servers.',
                'The core language is the same everywhere; the host APIs (DOM vs fs) differ.',
              ],
              diagram: {
                type: 'mermaid',
                lines: [
                  'flowchart TD',
                  '  V8[V8 engine] --> Browser[Browser runtime]',
                  '  V8 --> Node[Node runtime]',
                  '  Browser --> DOM[DOM and window APIs]',
                  '  Node --> FS[File and network APIs]',
                ],
                caption: 'The same V8 engine powers both the browser and Node; each adds its own host APIs.',
              },
              code: {
                language: 'javascript',
                lines: [
                  '// Same language, different host APIs',
                  '// In a browser:',
                  'document.title = \'Hello\';   // DOM is available',
                  '// In Node.js:',
                  'const fs = require(\'fs\');    // file system is available',
                ],
                explanation:
                  'document exists only in the browser; the fs module exists only in Node. The language syntax is identical in both.',
              },
              commonMistakes: [
                'Assuming the DOM (document, window) exists in Node — it does not unless you add a library that emulates it.',
              ],
              exercises: [
                {
                  type: 'quiz',
                  prompt: 'What is a JavaScript engine and what does JIT compilation give it?',
                  hint: 'Think about speed and how code is turned into machine instructions.',
                  solution: {
                    explanation:
                      'An engine reads and executes JS source. JIT compilation lets it start quickly by interpreting, then compile frequently-run code into optimised machine code for speed.',
                  },
                },
                {
                  type: 'predict',
                  prompt: 'Would document.querySelector work in a plain Node.js script? Why or why not?',
                  solution: {
                    explanation:
                      'No. document is part of the browser DOM API, which Node does not provide by default; Node exposes server APIs like fs and http instead.',
                  },
                },
                {
                  type: 'task',
                  prompt: 'Write one line that uses a browser-only API and one line that uses a Node-only API.',
                  solution: {
                    lines: ['window.alert(\'hi\');', 'const os = require(\'os\');'],
                    explanation:
                      'window.alert belongs to the browser; the os module belongs to Node. Each only works in its own environment.',
                  },
                },
              ],
              docs: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Introduction',
            },
            {
              id: 'js1-t0-c2',
              title: 'Running code and console.log',
              summary:
                'You can run JavaScript in the browser console, in an HTML script tag, or with Node, and console.log is your everyday tool for inspecting values.',
              explanation:
                'There are several easy ways to run JavaScript. In a browser, open the developer tools and type directly into the Console, or load a file with a script tag in HTML. With Node installed, save a file like app.js and run node app.js in a terminal. The single most useful debugging tool is console.log, which prints values to the console so you can see what your program is doing. It accepts multiple arguments and joins them with spaces, and it can print any type, including objects and arrays which it formats helpfully. There are related methods for clarity: console.error and console.warn produce error and warning styling, console.table renders arrays of objects as a grid, and console.dir shows an object as an interactive tree. Logging is not a substitute for a debugger, but it is fast, universal and the first thing every developer reaches for.',
              analogy:
                'console.log is like a doctor placing a stethoscope on different parts of your program: you listen at a spot to hear what value is flowing through it at that moment.',
              keyPoints: [
                'Run JS in the browser console, via a script tag, or with node file.js.',
                'console.log prints values and accepts multiple comma-separated arguments.',
                'It can print any type and formats objects and arrays readably.',
                'Related helpers: console.error, console.warn, console.table, console.dir.',
              ],
              code: {
                language: 'javascript',
                lines: [
                  'const user = { name: \'Ada\', age: 36 };',
                  'console.log(\'User:\', user);          // labels then prints the object',
                  'console.log(1, \'two\', [3, 4]);       // mixes types, joined by spaces',
                  'console.error(\'Something failed\');   // shown as an error',
                ],
                explanation:
                  'console.log takes several arguments at once. Passing a label before a value makes logs far easier to read.',
              },
              commonMistakes: [
                'Forgetting that console.log returns undefined, so you cannot use its return value.',
                'Logging an object and expecting a snapshot — in some consoles the object is shown live and may reflect later mutations.',
              ],
              exercises: [
                {
                  type: 'task',
                  prompt: 'Log the label Total followed by the value of the variable sum on a single line.',
                  solution: {
                    lines: ['const sum = 10;', 'console.log(\'Total\', sum);'],
                    explanation:
                      'Pass the label and the value as two arguments; console.log joins them with a space, printing Total 10.',
                  },
                },
                {
                  type: 'quiz',
                  prompt: 'Name three ways to run a piece of JavaScript code.',
                  solution: {
                    explanation:
                      'The browser developer console, an HTML page with a script tag, and Node.js via the command node file.js.',
                  },
                },
                {
                  type: 'predict',
                  prompt: 'What does the expression console.log(\'a\') itself evaluate to (its return value)?',
                  solution: {
                    explanation:
                      'It evaluates to undefined. console.log performs a side effect (printing) but returns no useful value.',
                  },
                },
              ],
              docs: 'https://developer.mozilla.org/en-US/docs/Web/API/console/log_static',
            },
          ],
        },
        {
          id: 'js1-t1',
          name: 'Variables and types',
          concepts: [
            {
              id: 'js1-t1-c0',
              title: 'Declaring variables with let, const and var',
              summary:
                'Use const by default, let when you must reassign, and avoid var; they differ in scope and reassignment rules.',
              explanation:
                'A variable is a named container for a value. Modern JavaScript offers three keywords to declare one. const creates a binding that cannot be reassigned, so it is the safest default and signals intent that the value will not change. let creates a binding you can reassign later, used for counters and values that genuinely vary. var is the old keyword from before ES2015; it still works but behaves differently and should be avoided in new code. The crucial differences are scope and reassignment: let and const are block-scoped (they exist only inside the nearest curly braces), while var is function-scoped and ignores blocks. Note that const prevents reassignment of the binding, not mutation of the value: you can still push to a const array or change a property of a const object. Choosing const first and only switching to let when needed makes code easier to reason about because fewer things can change.',
              analogy:
                'const is a labelled box you seal shut; let is a box you can empty and refill; var is an old box that leaks out of the room it was meant to stay in.',
              keyPoints: [
                'Prefer const; use let only when you must reassign; avoid var.',
                'let and const are block-scoped; var is function-scoped.',
                'const blocks reassignment of the binding, not mutation of the value.',
                'Declaring with no keyword in strict mode throws an error.',
              ],
              code: {
                language: 'javascript',
                lines: [
                  'const pi = 3.14159;',
                  '// pi = 3; would throw: Assignment to constant variable',
                  'let count = 0;',
                  'count = count + 1;           // fine, let allows reassignment',
                  'const list = [1, 2];',
                  'list.push(3);                // allowed: we mutate, not reassign',
                  'console.log(list);           // [1, 2, 3]',
                ],
                explanation:
                  'Reassigning a const throws, but mutating the contents of a const array is allowed because the binding still points to the same array.',
              },
              commonMistakes: [
                'Believing const makes objects or arrays immutable — it only freezes the binding, not the contents.',
                'Using var out of habit and being surprised by its function scope and hoisting behaviour.',
              ],
              exercises: [
                {
                  type: 'predict',
                  prompt: 'What happens when you run: const x = 1; x = 2; ?',
                  solution: {
                    explanation:
                      'It throws a TypeError: Assignment to constant variable, because const bindings cannot be reassigned.',
                  },
                },
                {
                  type: 'predict',
                  prompt: 'Does const arr = []; arr.push(5); throw an error?',
                  hint: 'Distinguish reassigning the binding from mutating the value.',
                  solution: {
                    explanation:
                      'No. push mutates the array that arr points to; it does not reassign arr, so const is not violated.',
                  },
                },
                {
                  type: 'task',
                  prompt: 'Declare a constant named MAX equal to 100 and a reassignable counter starting at 0.',
                  solution: {
                    lines: ['const MAX = 100;', 'let counter = 0;'],
                    explanation:
                      'MAX never changes so it is const; counter is expected to change so it is let.',
                  },
                },
              ],
              docs: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/const',
            },
            {
              id: 'js1-t1-c1',
              title: 'Primitive types and typeof',
              summary:
                'JavaScript has seven primitive types plus objects; typeof returns a string naming the type of a value.',
              explanation:
                'Values in JavaScript are either primitives or objects. The primitive types are string, number, boolean, undefined, null, bigint and symbol. Primitives are immutable and compared by value. Everything else — arrays, functions, plain objects, dates — is an object, compared by reference. The number type covers both integers and decimals using floating-point, so 1 and 1.5 are both numbers; bigint exists for integers larger than number can safely represent. The typeof operator returns a lowercase string describing a value, such as the string number or the string boolean, which is handy for quick checks. One famous quirk is that typeof null returns object, a long-standing bug kept for backward compatibility. typeof a function returns function even though functions are technically objects, which is a convenient special case.',
              analogy:
                'Primitives are like coins of fixed denominations you compare by their stamped value, while objects are like wallets you compare by which exact wallet you are pointing at.',
              keyPoints: [
                'Primitive types: string, number, boolean, undefined, null, bigint, symbol.',
                'Primitives are immutable and compared by value; objects are compared by reference.',
                'typeof returns a string naming the type.',
                'typeof null is object (a historical quirk); typeof a function is function.',
              ],
              code: {
                language: 'javascript',
                lines: [
                  'console.log(typeof \'hi\');     // string',
                  'console.log(typeof 42);        // number',
                  'console.log(typeof true);      // boolean',
                  'console.log(typeof undefined); // undefined',
                  'console.log(typeof null);      // object  (a known quirk)',
                  'console.log(typeof function(){}); // function',
                ],
                explanation:
                  'typeof reports each value type as a string. Note the surprising result for null, which historically reports object.',
              },
              commonMistakes: [
                'Using typeof to test for null — it returns object, so use value === null instead.',
                'Assuming arrays report array from typeof — they report object; use Array.isArray instead.',
              ],
              exercises: [
                {
                  type: 'quiz',
                  prompt: 'List the seven primitive types in JavaScript.',
                  hint: 'Two of them represent the absence of a value.',
                  solution: {
                    explanation:
                      'string, number, boolean, undefined, null, bigint and symbol.',
                  },
                },
                {
                  type: 'predict',
                  prompt: 'What does typeof null return, and what is the correct way to test for null?',
                  solution: {
                    explanation:
                      'typeof null returns the string object due to a historical bug. To test for null, compare directly: value === null.',
                  },
                },
                {
                  type: 'predict',
                  prompt: 'What does typeof [1, 2, 3] return?',
                  solution: {
                    explanation:
                      'It returns object, because arrays are objects. To detect an array use Array.isArray([1, 2, 3]).',
                  },
                },
              ],
              docs: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/typeof',
            },
            {
              id: 'js1-t1-c2',
              title: 'null versus undefined and type coercion',
              summary:
                'undefined means a value was never set, null means an intentional empty value, and coercion is JavaScript automatically converting between types.',
              explanation:
                'undefined and null both represent absence, but with different intent. undefined is what you get from a variable that was declared but not assigned, a missing function argument, or an object property that does not exist; the engine produces it for you. null is a value you assign deliberately to say there is intentionally nothing here. Type coercion is JavaScript converting a value from one type to another, either implicitly (when you mix types in an operation) or explicitly (when you call Number, String or Boolean). Implicit coercion causes classic surprises: the plus operator with a string converts the other operand to a string and concatenates, while other arithmetic operators convert to numbers. Because implicit coercion is unpredictable, prefer explicit conversion and the strict equality operator === which never coerces. Understanding coercion turns confusing bugs into predictable rules.',
              analogy:
                'undefined is an empty seat nobody was assigned to; null is a seat marked reserved-for-no-one on purpose. Coercion is like a translator who quietly rewords things between languages, sometimes changing the meaning.',
              keyPoints: [
                'undefined: value never set; produced by the engine.',
                'null: an intentional empty value you assign yourself.',
                'Coercion converts types implicitly (in mixed operations) or explicitly (Number, String, Boolean).',
                'The plus operator with a string concatenates; prefer === to avoid coercion in comparisons.',
              ],
              code: {
                language: 'javascript',
                lines: [
                  'let a;',
                  'console.log(a);            // undefined (never assigned)',
                  'let b = null;              // intentional empty',
                  'console.log(\'5\' + 1);      // \'51\'  string concatenation',
                  'console.log(\'5\' - 1);      // 4     numeric coercion',
                  'console.log(Number(\'42\')); // 42    explicit conversion',
                ],
                explanation:
                  'The plus operator turns the number into a string and joins them, while minus forces both into numbers. Explicit Number conversion is predictable.',
              },
              commonMistakes: [
                'Relying on implicit coercion in arithmetic, producing results like \'51\' instead of 6.',
                'Treating null and undefined as identical — they differ in intent and are not strictly equal.',
              ],
              exercises: [
                {
                  type: 'predict',
                  prompt: 'What is the result and type of \'10\' + 5 versus \'10\' - 5?',
                  solution: {
                    explanation:
                      'The plus gives the string 105 because the number is coerced to a string and concatenated; the minus gives the number 5 because both operands are coerced to numbers.',
                  },
                },
                {
                  type: 'quiz',
                  prompt: 'When would a variable naturally be undefined versus null?',
                  solution: {
                    explanation:
                      'It is undefined when declared but never assigned, or when a property or argument is missing. It is null only when you deliberately assign null to signal an empty value.',
                  },
                },
                {
                  type: 'task',
                  prompt: 'Convert the string \'3.5\' to a number explicitly and store it in a constant n.',
                  solution: {
                    lines: ['const n = Number(\'3.5\');'],
                    explanation:
                      'Number performs an explicit, predictable conversion, giving the number 3.5 rather than relying on coercion.',
                  },
                },
              ],
              docs: 'https://developer.mozilla.org/en-US/docs/Glossary/Type_coercion',
            },
          ],
        },
        {
          id: 'js1-t2',
          name: 'Operators and control flow',
          concepts: [
            {
              id: 'js1-t2-c0',
              title: 'Arithmetic, comparison and logical operators',
              summary:
                'Operators combine values: arithmetic does maths, comparison returns booleans, and logical operators combine or invert truth values.',
              explanation:
                'Operators are the verbs of expressions. Arithmetic operators (plus, minus, star, slash, percent for remainder, and double-star for exponent) perform calculations. Comparison operators return a boolean: use triple-equals === and !== for strict equality, which compares without type coercion, and avoid double-equals == which coerces and causes surprises. Relational operators less-than, greater-than and their or-equal forms compare ordering. Logical operators combine booleans: && is logical AND (true only if both sides are truthy), || is logical OR (true if either side is truthy), and ! negates. Importantly, && and || are short-circuiting and return one of their operands rather than a strict boolean, which makes them useful for defaults and guards. The nullish coalescing operator ?? is a newer addition that only falls back when the left side is null or undefined.',
              analogy:
                'Logical operators are like a relay race: && only passes the baton if the first runner succeeds, while || hands the baton to the second runner only if the first drops it.',
              keyPoints: [
                'Arithmetic: plus minus star slash, percent for remainder, double-star for power.',
                'Use === and !== (strict, no coercion); avoid == and !=.',
                '&& AND, || OR, ! NOT; && and || short-circuit and return an operand.',
                '?? falls back only on null or undefined, unlike ||.',
              ],
              code: {
                language: 'javascript',
                lines: [
                  'console.log(7 % 3);        // 1  remainder',
                  'console.log(2 ** 10);      // 1024 exponent',
                  'console.log(1 === \'1\');    // false strict, no coercion',
                  'console.log(true && \'go\'); // \'go\' returns second operand',
                  'console.log(0 || \'fallback\'); // \'fallback\' since 0 is falsy',
                  'console.log(0 ?? \'fallback\'); // 0 since 0 is not null/undefined',
                ],
                explanation:
                  'Strict equality avoids coercion. && and || return an operand, and ?? differs from || by only reacting to null or undefined.',
              },
              commonMistakes: [
                'Using == instead of ===, which can make 0 == \'\' or null == undefined behave unexpectedly.',
                'Reaching for || to set defaults when 0 or empty string are valid values — use ?? instead.',
              ],
              exercises: [
                {
                  type: 'predict',
                  prompt: 'What do 0 || \'x\' and 0 ?? \'x\' each evaluate to?',
                  solution: {
                    explanation:
                      '0 || \'x\' is \'x\' because 0 is falsy. 0 ?? \'x\' is 0 because ?? only falls back on null or undefined, and 0 is neither.',
                  },
                },
                {
                  type: 'quiz',
                  prompt: 'Why should you prefer === over ==?',
                  solution: {
                    explanation:
                      '=== compares value and type without coercion, giving predictable results, while == coerces operands and produces surprising matches.',
                  },
                },
                {
                  type: 'predict',
                  prompt: 'What does the expression true && \'hello\' return?',
                  solution: {
                    explanation:
                      'It returns the string hello. && returns the second operand when the first is truthy.',
                  },
                },
              ],
              docs: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators',
            },
            {
              id: 'js1-t2-c1',
              title: 'Truthy, falsy, if/else, switch and ternary',
              summary:
                'Every value is either truthy or falsy in a boolean context; if/else, switch and the ternary operator branch on those conditions.',
              explanation:
                'When a value is used where a boolean is expected, JavaScript treats it as truthy or falsy. There are exactly eight falsy values: false, 0, minus 0, 0n (bigint zero), empty string, null, undefined and NaN. Everything else, including empty arrays and empty objects, is truthy, which surprises many beginners. Control flow uses these truthiness rules. The if statement runs a block when its condition is truthy, with optional else if and else branches. The switch statement compares one value against several case labels using strict equality, falling through unless you break, and it is cleaner than a long chain of if/else when matching a single value against many options. The ternary operator condition ? a : b is a compact expression that evaluates to one of two values, perfect for short either-or choices inside expressions where a full if would not fit.',
              analogy:
                'Truthiness is like airport security deciding go or stop on each value; if/else is a fork in the road, switch is a multi-platform train station, and the ternary is a quick coin flip written on one line.',
              keyPoints: [
                'Eight falsy values: false, 0, -0, 0n, empty string, null, undefined, NaN.',
                'Empty arrays and objects are truthy, not falsy.',
                'switch matches with === and falls through unless you break.',
                'The ternary condition ? a : b is an expression returning one of two values.',
              ],
              code: {
                language: 'javascript',
                lines: [
                  'if ([]) console.log(\'arrays are truthy\'); // prints',
                  'const role = \'admin\';',
                  'switch (role) {',
                  '  case \'admin\': console.log(\'full access\'); break;',
                  '  case \'guest\': console.log(\'limited\'); break;',
                  '  default: console.log(\'unknown\');',
                  '}',
                  'const label = role === \'admin\' ? \'Boss\' : \'User\';',
                ],
                explanation:
                  'An empty array is truthy. The switch matches role strictly and breaks to avoid fall-through. The ternary picks one of two labels in a single expression.',
              },
              commonMistakes: [
                'Forgetting break in a switch, causing unintended fall-through to later cases.',
                'Assuming an empty array or object is falsy — both are truthy.',
              ],
              exercises: [
                {
                  type: 'predict',
                  prompt: 'Does if ([]) {} run its block? Why?',
                  solution: {
                    explanation:
                      'Yes. An empty array is an object and all objects are truthy, so the condition passes even though the array has no elements.',
                  },
                },
                {
                  type: 'task',
                  prompt: 'Rewrite this as a ternary: let msg; if (age >= 18) msg = \'adult\'; else msg = \'minor\';',
                  solution: {
                    lines: ['const msg = age >= 18 ? \'adult\' : \'minor\';'],
                    explanation:
                      'The ternary evaluates the condition and returns one of the two strings, replacing the four-line if/else with one expression.',
                  },
                },
                {
                  type: 'quiz',
                  prompt: 'Name four of the falsy values in JavaScript.',
                  solution: {
                    explanation:
                      'Any four of: false, 0, -0, 0n, the empty string, null, undefined, and NaN.',
                  },
                },
              ],
              docs: 'https://developer.mozilla.org/en-US/docs/Glossary/Truthy',
            },
            {
              id: 'js1-t2-c2',
              title: 'Loops: for, while, for-of and for-in',
              summary:
                'Loops repeat code; for and while are general counters, for-of iterates values of iterables, and for-in iterates the keys of an object.',
              explanation:
                'Loops let you run a block repeatedly. The classic for loop has three parts in its header: an initialiser, a condition checked before each pass, and an update run after each pass, making it ideal when you need an index. The while loop repeats as long as a condition is truthy, and do-while runs the body at least once before checking. ES2015 added for-of, which iterates over the values of an iterable such as an array, string, Map or Set, and is the cleanest choice when you only need each element. for-in is older and different: it iterates over the enumerable keys (property names) of an object, which makes it right for plain objects but a poor fit for arrays because it yields string indices and can include inherited keys. You can control any loop with break to exit early and continue to skip to the next iteration.',
              analogy:
                'for-of walks down a buffet line tasting each dish (the values), while for-in reads the labels on the dishes (the keys). The classic for loop is counting steps as you walk.',
              keyPoints: [
                'for: initialiser, condition, update; best when you need an index.',
                'while runs while truthy; do-while runs the body at least once.',
                'for-of iterates the values of iterables (arrays, strings, Maps, Sets).',
                'for-in iterates the keys of an object; avoid it for arrays.',
              ],
              diagram: {
                type: 'mermaid',
                lines: [
                  'flowchart TD',
                  '  Init[Initialise i] --> Cond{Condition true}',
                  '  Cond -->|yes| Body[Run body]',
                  '  Body --> Update[Update i]',
                  '  Update --> Cond',
                  '  Cond -->|no| End[Exit loop]',
                ],
                caption: 'The classic for loop checks the condition, runs the body, updates, and repeats until the condition is false.',
              },
              code: {
                language: 'javascript',
                lines: [
                  'for (let i = 0; i < 3; i++) console.log(i);   // 0 1 2',
                  'const colors = [\'red\', \'green\'];',
                  'for (const c of colors) console.log(c);       // red green',
                  'const user = { name: \'Ada\', age: 36 };',
                  'for (const key in user) console.log(key);     // name age',
                ],
                explanation:
                  'for uses an index, for-of gives you each value directly, and for-in gives you each property name of the object.',
              },
              commonMistakes: [
                'Using for-in on arrays, which yields string indices and may include extra inherited keys.',
                'Writing a while loop whose condition never becomes false, creating an infinite loop.',
              ],
              exercises: [
                {
                  type: 'predict',
                  prompt: 'For const arr = [10, 20]; what does for (const x of arr) log versus for (const x in arr)?',
                  solution: {
                    explanation:
                      'for-of logs the values 10 and 20. for-in logs the keys, the string indices 0 and 1. Use for-of for array values.',
                  },
                },
                {
                  type: 'task',
                  prompt: 'Use a for-of loop to log every character of the string \'hi\'.',
                  solution: {
                    lines: ['for (const ch of \'hi\') console.log(ch);'],
                    explanation:
                      'Strings are iterable, so for-of yields each character: h then i.',
                  },
                },
                {
                  type: 'quiz',
                  prompt: 'Which loop guarantees its body runs at least once even if the condition is false at the start?',
                  solution: {
                    explanation:
                      'The do-while loop, because it checks the condition after running the body.',
                  },
                },
              ],
              docs: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/for...of',
            },
          ],
        },
      ],
    },
    /* ───────────────────── LEVEL 2 — FUNCTIONS AND SCOPE ───────────────────── */
    {
      level: 2,
      name: 'Functions and scope',
      focus: 'Defining reusable behaviour and understanding where variables live and how closures capture them',
      accent: '#eab308',
      soft: '#fef9c3',
      topics: [
        {
          id: 'js2-t0',
          name: 'Functions',
          concepts: [
            {
              id: 'js2-t0-c0',
              title: 'Function declarations versus expressions',
              summary:
                'A function declaration is a named statement hoisted to the top of its scope; a function expression assigns a function to a variable and is not hoisted as callable.',
              explanation:
                'Functions are reusable blocks of behaviour. A function declaration starts with the function keyword followed by a name, and is hoisted: the whole function is available before the line where it appears in the source. A function expression instead creates a function as a value and assigns it to a variable; because only the variable declaration is hoisted (and with let/const it is not even initialised), you cannot call it before that line. Function expressions can be anonymous or named, and naming them improves stack traces. Both kinds are first-class values: you can store them in variables, pass them as arguments and return them from other functions, which is the foundation of callbacks and functional programming. Choosing between them is partly style, but expressions assigned to const are popular because they make hoisting behaviour predictable and prevent accidental redeclaration.',
              analogy:
                'A declaration is like a recipe printed in the cookbook from the start so anyone can flip to it anytime; an expression is a recipe you only receive at the moment someone hands you the card.',
              keyPoints: [
                'Declarations are hoisted and callable before their line; expressions are not.',
                'Both are first-class values: store, pass and return them.',
                'Naming a function expression improves stack traces.',
                'const function expressions avoid accidental redeclaration and surprises.',
              ],
              code: {
                language: 'javascript',
                lines: [
                  'sayHi();                       // works: declaration is hoisted',
                  'function sayHi() { console.log(\'hi\'); }',
                  '',
                  '// greet();                    // would throw: not yet initialised',
                  'const greet = function () { console.log(\'hello\'); };',
                  'greet();                       // works after this line',
                ],
                explanation:
                  'The declaration sayHi can be called above its definition; the expression greet can only be called after its assignment runs.',
              },
              commonMistakes: [
                'Calling a const or let function expression before its line, causing a ReferenceError from the temporal dead zone.',
              ],
              exercises: [
                {
                  type: 'predict',
                  prompt: 'Will calling a function declared as function f(){} on the line above its definition work? What about a const f = function(){}?',
                  solution: {
                    explanation:
                      'The declaration works because it is hoisted. The const expression throws a ReferenceError because the binding exists but is uninitialised until its line runs.',
                  },
                },
                {
                  type: 'task',
                  prompt: 'Write a function expression assigned to a const named double that returns its argument times two.',
                  solution: {
                    lines: ['const double = function (n) { return n * 2; };'],
                    explanation:
                      'The function is a value assigned to a const, so it can only be used after this line executes.',
                  },
                },
                {
                  type: 'quiz',
                  prompt: 'What does first-class function mean in JavaScript?',
                  solution: {
                    explanation:
                      'Functions are values: they can be stored in variables, passed as arguments, and returned from other functions, just like numbers or strings.',
                  },
                },
              ],
              docs: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions',
            },
            {
              id: 'js2-t0-c1',
              title: 'Arrow functions',
              summary:
                'Arrow functions are a concise syntax for function expressions that do not bind their own this, arguments or new.',
              explanation:
                'Arrow functions, added in ES2015, give a shorter way to write function expressions. The syntax replaces the function keyword with a fat arrow: parameters in parentheses, the arrow, then a body. If the body is a single expression you can omit the braces and the return keyword, and the expression becomes the return value, which makes them ideal for callbacks. With exactly one parameter the parentheses are optional. The deeper difference is that arrow functions do not have their own this, arguments object, or prototype: they inherit this lexically from the surrounding scope. This makes them excellent inside methods and callbacks where you want to keep the outer this, but it means they are unsuitable as object methods that rely on this or as constructors. A subtle trap is returning an object literal: you must wrap it in parentheses so the braces are not read as a function body.',
              analogy:
                'An arrow function is like a sticky note that always uses the address of the desk it was written at; it never gets its own new address (this) no matter where you move it.',
              keyPoints: [
                'Concise: omit braces and return for a single-expression body.',
                'One parameter lets you drop the parentheses.',
                'They inherit this lexically and have no own this, arguments or prototype.',
                'Wrap a returned object literal in parentheses: n => ({ value: n }).',
              ],
              code: {
                language: 'javascript',
                lines: [
                  'const square = n => n * n;            // implicit return',
                  'const add = (a, b) => a + b;          // two params',
                  'const makePoint = n => ({ x: n });    // return object: wrap in ()',
                  'console.log(square(5));               // 25',
                  '[1, 2, 3].map(n => n * 10);           // [10, 20, 30]',
                ],
                explanation:
                  'A single-expression arrow returns it automatically. Returning an object literal needs parentheses so the braces are not treated as a body.',
              },
              commonMistakes: [
                'Using an arrow function as an object method that needs this — arrow this is the outer scope, not the object.',
                'Forgetting the parentheses when returning an object literal, which silently returns undefined.',
              ],
              exercises: [
                {
                  type: 'task',
                  prompt: 'Write an arrow function triple that returns its argument times three using an implicit return.',
                  solution: {
                    lines: ['const triple = n => n * 3;'],
                    explanation:
                      'With one parameter and a single expression, you can omit both the parentheses and the return keyword.',
                  },
                },
                {
                  type: 'predict',
                  prompt: 'What does const f = n => { value: n }; return when called as f(5)?',
                  solution: {
                    explanation:
                      'It returns undefined. The braces are read as a function body, value: is treated as a label, and nothing is returned. You must write n => ({ value: n }).',
                  },
                },
                {
                  type: 'quiz',
                  prompt: 'Name two things arrow functions do not have that regular functions do.',
                  solution: {
                    explanation:
                      'Arrow functions have no own this binding and no own arguments object (they also have no prototype and cannot be used with new).',
                  },
                },
              ],
              docs: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions',
            },
            {
              id: 'js2-t0-c2',
              title: 'Parameters, defaults, rest and return values',
              summary:
                'Functions accept parameters that can have default values, gather extra arguments with rest syntax, and send a value back with return.',
              explanation:
                'Parameters are the named inputs in a function definition; arguments are the actual values passed when calling it. ES2015 added default parameters, so you can write a parameter equals a value to supply a fallback used only when the argument is undefined. Rest parameters, written with three dots before the last parameter name, collect any remaining arguments into a real array, replacing the old arguments object and working with array methods directly. Every function returns a value: if you write return followed by an expression, that value is sent back; if you omit return or write a bare return, the function returns undefined. Because the return statement ends the function immediately, code after it does not run. A function with too few arguments simply gets undefined for the missing ones rather than throwing, so defaults are a clean way to handle that.',
              analogy:
                'Default parameters are a vending machine that gives a standard snack when you press no button; rest parameters are a basket that scoops up everything you did not name individually.',
              keyPoints: [
                'Defaults (param = value) apply only when the argument is undefined.',
                'Rest (...args) collects remaining arguments into a real array.',
                'return sends a value back and ends the function immediately.',
                'Missing arguments are undefined, not an error.',
              ],
              code: {
                language: 'javascript',
                lines: [
                  'function greet(name = \'friend\') { return \'Hi \' + name; }',
                  'console.log(greet());          // Hi friend (default used)',
                  'console.log(greet(\'Ada\'));     // Hi Ada',
                  '',
                  'function sum(...nums) { return nums.reduce((a, b) => a + b, 0); }',
                  'console.log(sum(1, 2, 3, 4));   // 10',
                ],
                explanation:
                  'The default fills in when no name is passed. The rest parameter gathers all arguments into an array so reduce can total them.',
              },
              commonMistakes: [
                'Putting the rest parameter anywhere but last — it must be the final parameter.',
                'Expecting a default to apply when null is passed — it only applies to undefined.',
              ],
              exercises: [
                {
                  type: 'predict',
                  prompt: 'Given function f(x = 10) { return x; }, what do f() and f(null) return?',
                  solution: {
                    explanation:
                      'f() returns 10 because the argument is undefined so the default applies. f(null) returns null because null is a real value and defaults only fill in for undefined.',
                  },
                },
                {
                  type: 'task',
                  prompt: 'Write a function max that takes any number of numbers and returns the largest using a rest parameter.',
                  solution: {
                    lines: ['function max(...nums) { return Math.max(...nums); }'],
                    explanation:
                      'The rest parameter collects all arguments into an array, then the spread passes them to Math.max.',
                  },
                },
                {
                  type: 'predict',
                  prompt: 'What does a function return if it has no return statement?',
                  solution: {
                    explanation:
                      'It returns undefined. Reaching the end of the body without a return yields undefined.',
                  },
                },
              ],
              docs: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Default_parameters',
            },
          ],
        },
        {
          id: 'js2-t1',
          name: 'Scope, hoisting and closures',
          concepts: [
            {
              id: 'js2-t1-c0',
              title: 'Scope: global, function and block',
              summary:
                'Scope determines where a variable is visible; JavaScript has global scope, function scope, and block scope for let and const.',
              explanation:
                'Scope is the region of code where a name is accessible. The global scope is the outermost level, where variables are visible everywhere, but polluting it causes name clashes and is discouraged. Function scope means variables declared inside a function exist only within that function; var uses function scope. Block scope, introduced for let and const in ES2015, means a variable declared inside a pair of curly braces (an if, a loop, or a bare block) is visible only inside those braces. Scopes nest: inner scopes can read variables from outer scopes, but not the other way around, forming a chain the engine searches outward until it finds the name or fails with a ReferenceError. Preferring let and const over var gives you tight block scoping, which prevents leaks like a loop counter remaining visible after the loop ends.',
              analogy:
                'Scopes are like nested rooms with one-way windows: you can see out into the larger rooms around you, but people in the hallway cannot see the items inside your private room.',
              keyPoints: [
                'Global scope is visible everywhere; keep it clean.',
                'Function scope: var lives for the whole function.',
                'Block scope: let and const live only inside their braces.',
                'Inner scopes can read outer variables; the chain is searched outward.',
              ],
              code: {
                language: 'javascript',
                lines: [
                  'let outer = \'global\';',
                  'function demo() {',
                  '  let inside = \'function\';',
                  '  if (true) { let block = \'block\'; console.log(block); }',
                  '  // console.log(block); // ReferenceError: block-scoped',
                  '  console.log(outer, inside);  // can read outer',
                  '}',
                  'demo();',
                ],
                explanation:
                  'block exists only inside the if. The function can read the global outer because inner scopes see outer variables.',
              },
              commonMistakes: [
                'Accidentally creating a global variable by assigning without let, const or var (in non-strict mode).',
                'Expecting a let declared inside a block to be visible after the block ends.',
              ],
              exercises: [
                {
                  type: 'predict',
                  prompt: 'After if (true) { let x = 1; }, can you read x outside the if?',
                  solution: {
                    explanation:
                      'No. let is block-scoped, so x exists only inside the if block and accessing it outside throws a ReferenceError.',
                  },
                },
                {
                  type: 'quiz',
                  prompt: 'Can an inner function read a variable from the function that contains it?',
                  solution: {
                    explanation:
                      'Yes. Scopes nest and inner scopes can read variables from any enclosing outer scope via the scope chain.',
                  },
                },
                {
                  type: 'predict',
                  prompt: 'What scope does a var declared inside a for loop body belong to?',
                  solution: {
                    explanation:
                      'Function scope. A var ignores the block and is visible throughout the entire enclosing function, unlike let.',
                  },
                },
              ],
              docs: 'https://developer.mozilla.org/en-US/docs/Glossary/Scope',
            },
            {
              id: 'js2-t1-c1',
              title: 'Hoisting and the temporal dead zone',
              summary:
                'Hoisting moves declarations to the top of their scope during compilation; var initialises to undefined, while let and const stay in a temporal dead zone until their line.',
              explanation:
                'Before running code, the engine scans each scope and registers its declarations, an effect called hoisting. Function declarations are hoisted completely, so you can call them above their definition. var declarations are hoisted too, but only the name is set up and initialised to undefined, which is why reading a var before its assignment gives undefined rather than an error. let and const are also hoisted in the sense that the engine knows about them, but they are not initialised; from the start of the block until the declaration line they sit in the temporal dead zone (TDZ), and touching them there throws a ReferenceError. This design makes let and const safer because it catches use-before-declaration as a clear error instead of silently yielding undefined. Understanding hoisting explains many otherwise mysterious results when variables appear to exist but hold nothing.',
              analogy:
                'Hoisting is like a guest list posted before a party: function declarations arrive fully ready, var guests are on the list but standing empty-handed (undefined), and let/const guests are on the list but barred from the room (the TDZ) until their official entry time.',
              keyPoints: [
                'Function declarations are hoisted fully and callable early.',
                'var is hoisted and initialised to undefined before its line.',
                'let and const are hoisted but uninitialised: the temporal dead zone.',
                'Accessing a let or const in its TDZ throws a ReferenceError.',
              ],
              code: {
                language: 'javascript',
                lines: [
                  'console.log(a);   // undefined: var hoisted, not yet assigned',
                  'var a = 1;',
                  '',
                  'console.log(b);   // ReferenceError: b is in the TDZ',
                  'let b = 2;',
                ],
                explanation:
                  'Reading var a before assignment gives undefined. Reading let b before its line throws, because it is in the temporal dead zone.',
              },
              commonMistakes: [
                'Assuming let and const are not hoisted at all — they are, but remain uninitialised in the TDZ.',
                'Relying on reading a var before assignment and getting undefined instead of an error to catch bugs.',
              ],
              exercises: [
                {
                  type: 'predict',
                  prompt: 'What does console.log(x); var x = 5; print, and why?',
                  solution: {
                    explanation:
                      'It prints undefined. The var declaration is hoisted and initialised to undefined, but the assignment of 5 has not run yet.',
                  },
                },
                {
                  type: 'predict',
                  prompt: 'What happens with console.log(y); let y = 5;?',
                  solution: {
                    explanation:
                      'It throws a ReferenceError because y is in the temporal dead zone until its declaration line executes.',
                  },
                },
                {
                  type: 'quiz',
                  prompt: 'Why are function declarations callable before they appear in the source?',
                  solution: {
                    explanation:
                      'Because function declarations are hoisted in full, the entire function body is available throughout the scope from the start.',
                  },
                },
              ],
              docs: 'https://developer.mozilla.org/en-US/docs/Glossary/Hoisting',
            },
            {
              id: 'js2-t1-c2',
              title: 'Lexical scope, closures and IIFEs',
              summary:
                'A closure is a function that remembers the variables of the scope where it was defined, even after that scope has finished running.',
              explanation:
                'JavaScript uses lexical (static) scope, meaning a function determines what variables it can see from where it is written in the source, not from where it is called. A closure is the natural consequence: when a function is created it keeps a reference to its surrounding variables, and it can still read and update them later even after the outer function has returned. Closures power many patterns: private state that cannot be touched from outside, function factories that build customised functions, and callbacks that remember context. A classic use is a counter where the count variable is hidden inside an outer function and only reachable through the returned inner function. The Immediately Invoked Function Expression (IIFE) wraps code in a function that runs at once, historically used to create a private scope before modules existed and to avoid polluting the global namespace.',
              analogy:
                'A closure is like a backpack the function carries: when it leaves the room where it was created, it packs the variables it needs and keeps using them wherever it goes.',
              keyPoints: [
                'Lexical scope: visibility is decided by where code is written, not called.',
                'A closure remembers its outer variables even after the outer function returns.',
                'Closures enable private state and function factories.',
                'An IIFE runs immediately and creates a private scope.',
              ],
              diagram: {
                type: 'mermaid',
                lines: [
                  'flowchart LR',
                  '  Outer[makeCounter scope] --> Count[count variable]',
                  '  Inner[returned function] --> Count',
                  '  Inner --> Result[reads and updates count]',
                ],
                caption: 'The returned inner function keeps a live reference to the count variable from its defining scope.',
              },
              code: {
                language: 'javascript',
                lines: [
                  'function makeCounter() {',
                  '  let count = 0;             // private to the closure',
                  '  return () => ++count;      // closes over count',
                  '}',
                  'const next = makeCounter();',
                  'console.log(next());          // 1',
                  'console.log(next());          // 2',
                  'const value = (() => 42)();   // IIFE runs immediately',
                ],
                explanation:
                  'next keeps count alive between calls because of the closure. The IIFE executes at once and returns 42.',
              },
              commonMistakes: [
                'Using var in a loop with closures and capturing the same final value; use let to get a fresh binding per iteration.',
              ],
              exercises: [
                {
                  type: 'predict',
                  prompt: 'Using the makeCounter above, what do two consecutive calls to next() return?',
                  solution: {
                    explanation:
                      'They return 1 then 2. The closure keeps the same count variable alive, incrementing it on each call.',
                  },
                },
                {
                  type: 'task',
                  prompt: 'Write a function makeAdder(x) that returns a function adding x to its argument.',
                  solution: {
                    lines: ['function makeAdder(x) { return y => x + y; }', 'const add5 = makeAdder(5);'],
                    explanation:
                      'The returned arrow closes over x, so add5 always adds 5. This is a function factory built with a closure.',
                  },
                },
                {
                  type: 'quiz',
                  prompt: 'What is an IIFE and why was it historically useful?',
                  solution: {
                    explanation:
                      'An Immediately Invoked Function Expression runs as soon as it is defined; it was used to create a private scope and avoid polluting the global namespace before modules existed.',
                  },
                },
              ],
              docs: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Closures',
            },
          ],
        },
        {
          id: 'js2-t2',
          name: 'The this keyword',
          concepts: [
            {
              id: 'js2-t2-c0',
              title: 'How this is determined',
              summary:
                'In a regular function this depends on how the function is called, not where it is defined, which is the source of most this confusion.',
              explanation:
                'The value of this in a regular function is set fresh on every call and depends entirely on the call site. When a function is called as a method on an object (object.method()), this is that object. When called as a plain function (just functionName()), this is undefined in strict mode or the global object in sloppy mode. When called with new, this is the brand new object being constructed. When called as an event handler in the browser, this is usually the element. Because the same function can be called in different ways, the same code can see different this values, which trips up many developers. The reliable mental model is to look at the left of the dot at the call: whatever is there is usually this. Arrow functions break this rule deliberately by not having their own this, which we cover separately.',
              analogy:
                'this is like the word here in a phone call: its meaning depends on who is speaking and from where at the moment of the call, not on where the sentence was originally written.',
              keyPoints: [
                'this is bound at call time, based on how the function is called.',
                'Method call object.fn(): this is the object before the dot.',
                'Plain call fn(): this is undefined (strict) or the global object (sloppy).',
                'new Fn(): this is the newly created object.',
              ],
              code: {
                language: 'javascript',
                lines: [
                  'const user = {',
                  '  name: \'Ada\',',
                  '  greet() { return \'Hi \' + this.name; },',
                  '};',
                  'console.log(user.greet());      // Hi Ada (this is user)',
                  'const fn = user.greet;',
                  'console.log(fn());              // Hi undefined: lost the object',
                ],
                explanation:
                  'Called as user.greet() this is user. Extracting the method and calling it plainly loses the binding, so this.name is undefined.',
              },
              commonMistakes: [
                'Extracting a method into a variable and calling it, which detaches this from the object.',
                'Assuming this is decided by where a function is written rather than how it is called.',
              ],
              exercises: [
                {
                  type: 'predict',
                  prompt: 'Given the user object above, why does const f = user.greet; f(); produce Hi undefined?',
                  solution: {
                    explanation:
                      'Calling f() is a plain function call with nothing before a dot, so this is not user (it is undefined in strict mode), making this.name undefined.',
                  },
                },
                {
                  type: 'quiz',
                  prompt: 'What is this inside a function called with new?',
                  solution: {
                    explanation:
                      'It is the brand new object being constructed by the new call.',
                  },
                },
                {
                  type: 'predict',
                  prompt: 'In strict mode, what is this inside a plain function call like doThing()?',
                  solution: {
                    explanation:
                      'It is undefined. Plain calls do not set this to the global object in strict mode.',
                  },
                },
              ],
              docs: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this',
            },
            {
              id: 'js2-t2-c1',
              title: 'call, apply and bind',
              summary:
                'call, apply and bind let you set this explicitly; call and apply invoke immediately, while bind returns a new function with this fixed.',
              explanation:
                'Sometimes you need to control this yourself. Every function has three methods for this. call invokes the function immediately with a chosen this as the first argument, followed by the regular arguments listed individually. apply is identical except it takes the arguments as a single array, which is handy when you already have an array. bind does not call the function; instead it returns a new function with this permanently fixed to the value you provide, plus any arguments you pre-supply, which is perfect for passing a method as a callback without losing its object. A bound function cannot have its this changed again, even by another bind or by call. These tools were essential before arrow functions for keeping the right this in callbacks, and bind in particular remains common for event handlers and partial application.',
              analogy:
                'call and apply are like handing a chef the kitchen to cook in right now (apply hands them a tray of ingredients, call hands them one by one); bind is writing a contract that fixes which kitchen the chef will always use, to be cooked later.',
              keyPoints: [
                'call(thisArg, a, b): invoke now with arguments listed individually.',
                'apply(thisArg, [a, b]): invoke now with arguments as an array.',
                'bind(thisArg, ...args): return a new function with this fixed.',
                'A bound function cannot have its this rebound later.',
              ],
              code: {
                language: 'javascript',
                lines: [
                  'function intro(greeting) { return greeting + \', \' + this.name; }',
                  'const ada = { name: \'Ada\' };',
                  'console.log(intro.call(ada, \'Hi\'));     // Hi, Ada',
                  'console.log(intro.apply(ada, [\'Hey\'])); // Hey, Ada',
                  'const adaIntro = intro.bind(ada);',
                  'console.log(adaIntro(\'Hello\'));         // Hello, Ada',
                ],
                explanation:
                  'call and apply run immediately with this set to ada, differing only in how arguments are passed. bind returns a reusable function with this fixed to ada.',
              },
              commonMistakes: [
                'Confusing call and apply — call takes a list of arguments, apply takes an array.',
                'Forgetting that bind returns a new function and does not call the original.',
              ],
              exercises: [
                {
                  type: 'quiz',
                  prompt: 'What is the difference between call and apply?',
                  solution: {
                    explanation:
                      'Both invoke the function immediately with a chosen this, but call passes arguments individually while apply passes them as a single array.',
                  },
                },
                {
                  type: 'task',
                  prompt: 'Create a function logName bound so that this is the object { name: \'Sam\' }.',
                  solution: {
                    lines: ['function logName() { console.log(this.name); }', 'const logSam = logName.bind({ name: \'Sam\' });'],
                    explanation:
                      'bind returns a new function whose this is permanently the supplied object, so logSam() logs Sam.',
                  },
                },
                {
                  type: 'predict',
                  prompt: 'Does fn.bind(obj) run fn immediately?',
                  solution: {
                    explanation:
                      'No. bind returns a new function with this fixed; you must call that returned function to actually run it.',
                  },
                },
              ],
              docs: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/bind',
            },
            {
              id: 'js2-t2-c2',
              title: 'Arrow versus regular this',
              summary:
                'Arrow functions have no own this and inherit it from the enclosing scope, which makes them ideal inside methods and callbacks but wrong as object methods.',
              explanation:
                'The single most useful fact about arrow functions is that they do not create their own this. Instead they capture this lexically from the surrounding scope at the time they are defined, and that binding never changes, even if you use call, apply or bind on them. This solves a classic problem: inside a method, a regular callback (such as in setTimeout or array methods before arrow functions) would lose this, so developers used the const self equals this hack or bind. An arrow function inside the method simply reuses the method this automatically. The flip side is that an arrow function should not be used as a top-level object method that needs this to refer to the object, because it will instead point to whatever this was in the outer scope, often the global object or undefined. Knowing when to reach for an arrow versus a regular function is one of the clearest marks of comfort with the language.',
              analogy:
                'A regular function is a chameleon that takes on the colour of whoever calls it; an arrow function is painted once at birth with its surroundings colour and never changes.',
              keyPoints: [
                'Arrows inherit this from the enclosing scope and cannot be rebound.',
                'Great for callbacks inside methods: they keep the method this.',
                'Bad as object methods that need this to be the object.',
                'call, apply and bind cannot change an arrow function this.',
              ],
              code: {
                language: 'javascript',
                lines: [
                  'const timer = {',
                  '  seconds: 0,',
                  '  start() {',
                  '    setInterval(() => { this.seconds++; }, 1000); // arrow keeps timer this',
                  '  },',
                  '  badMethod: () => { return this; }, // arrow: this is NOT timer',
                  '};',
                ],
                explanation:
                  'The arrow inside start keeps this as the timer object. badMethod as a top-level arrow does not see timer, because it captures the outer this.',
              },
              commonMistakes: [
                'Defining an object method as an arrow function and expecting this to be the object.',
                'Trying to bind an arrow function to change its this, which has no effect.',
              ],
              exercises: [
                {
                  type: 'predict',
                  prompt: 'In the timer object, would using a regular function instead of an arrow in setInterval keep this.seconds working?',
                  solution: {
                    explanation:
                      'No. A regular function callback would be called plainly, so this would not be timer and this.seconds would fail. The arrow keeps the method this.',
                  },
                },
                {
                  type: 'quiz',
                  prompt: 'Can you change an arrow function this using bind?',
                  solution: {
                    explanation:
                      'No. Arrow functions capture this lexically and ignore bind, call and apply for the purpose of this.',
                  },
                },
                {
                  type: 'predict',
                  prompt: 'Why is const obj = { name: \'A\', get: () => this.name }; obj.get() not returning A?',
                  solution: {
                    explanation:
                      'Because the arrow has no own this; it uses the surrounding scope this (not obj), so this.name is not the object name.',
                  },
                },
              ],
              docs: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions#cannot_be_used_as_methods',
            },
          ],
        },
      ],
    },
    /* ───────────────────── LEVEL 3 — DATA AND BUILT-INS ───────────────────── */
    {
      level: 3,
      name: 'Data and built-ins',
      focus: 'Working with objects, arrays, strings, numbers and JSON using the language built-in tools',
      accent: '#eab308',
      soft: '#fef9c3',
      topics: [
        {
          id: 'js3-t0',
          name: 'Objects',
          concepts: [
            {
              id: 'js3-t0-c0',
              title: 'Object literals, properties and methods',
              summary:
                'Objects group related data and behaviour as key-value pairs; values that are functions are called methods.',
              explanation:
                'An object is a collection of properties, each a key (a string or symbol) paired with a value. The object literal syntax uses curly braces with comma-separated key colon value pairs, and it is the most common way to model a thing with named attributes. A property whose value is a function is called a method, and ES2015 added a concise method syntax that drops the colon and function keyword. Objects are mutable: you can add, change and delete properties after creation. ES2015 also added shorthand property names, so when a variable name matches the intended key you can list it once, and computed property names, where you put an expression in square brackets as the key. Objects are reference types: copying an object variable copies the reference, so two variables can point to the same underlying object and changes through one are visible through the other.',
              analogy:
                'An object is like a labelled drawer unit: each drawer has a name (key) and holds something (value), and some drawers hold tools that do work (methods).',
              keyPoints: [
                'Object literals use key colon value pairs inside braces.',
                'A function-valued property is a method; concise syntax omits function.',
                'Shorthand uses a variable as both key and value; computed keys use [expr].',
                'Objects are reference types: assignment copies the reference, not the object.',
              ],
              code: {
                language: 'javascript',
                lines: [
                  'const name = \'Ada\';',
                  'const user = {',
                  '  name,                       // shorthand for name: name',
                  '  age: 36,',
                  '  greet() { return \'Hi \' + this.name; }, // method',
                  '  [\'dynamic\' + 1]: true,      // computed key -> dynamic1',
                  '};',
                  'console.log(user.greet());     // Hi Ada',
                ],
                explanation:
                  'Shorthand sets name from the variable, the method uses concise syntax, and the computed key builds a property name from an expression.',
              },
              commonMistakes: [
                'Assuming const obj makes properties unchangeable — you can still add and modify them.',
                'Copying an object with assignment and being surprised both variables change together.',
              ],
              exercises: [
                {
                  type: 'task',
                  prompt: 'Create an object book with a title property and a describe method that returns the title.',
                  solution: {
                    lines: ['const book = { title: \'JS\', describe() { return this.title; } };'],
                    explanation:
                      'describe uses concise method syntax and this.title to read the property of the same object.',
                  },
                },
                {
                  type: 'predict',
                  prompt: 'After const a = { n: 1 }; const b = a; b.n = 9; what is a.n?',
                  solution: {
                    explanation:
                      'a.n is 9. b holds the same reference as a, so mutating through b changes the single shared object.',
                  },
                },
                {
                  type: 'quiz',
                  prompt: 'What is property shorthand and when can you use it?',
                  solution: {
                    explanation:
                      'When a variable name equals the desired key, you can write just the name once instead of key: name, and the engine uses the variable value.',
                  },
                },
              ],
              docs: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Working_with_objects',
            },
            {
              id: 'js3-t0-c1',
              title: 'Dot versus bracket access',
              summary:
                'Use dot notation for fixed, valid property names and bracket notation for dynamic keys or names that are not valid identifiers.',
              explanation:
                'There are two ways to read and write a property. Dot notation, object.key, is concise and the default choice when you know the property name and it is a valid identifier (letters, digits, underscore, dollar, not starting with a digit). Bracket notation, object[expression], evaluates the expression to a string and uses that as the key, which is essential in two cases: when the key is held in a variable and only known at runtime, and when the key contains characters that are illegal in dot notation, such as spaces or hyphens. Bracket access is what makes objects usable as flexible lookup tables. A common beginner error is writing object.someVariable expecting it to use the variable value, but dot notation always uses the literal text after the dot as the key; to use a variable as the key you must use brackets. Accessing a missing property with either notation yields undefined rather than an error.',
              analogy:
                'Dot notation is asking for a drawer by its printed label; bracket notation is handing over a slip of paper with the label written on it, so the label can be decided on the spot.',
              keyPoints: [
                'Dot notation needs a fixed, valid identifier name.',
                'Bracket notation evaluates an expression to get the key.',
                'Use brackets for variable keys and names with spaces or hyphens.',
                'A missing property returns undefined, not an error.',
              ],
              code: {
                language: 'javascript',
                lines: [
                  'const user = { firstName: \'Ada\', \'fav color\': \'blue\' };',
                  'console.log(user.firstName);     // Ada (dot)',
                  'console.log(user[\'fav color\']);  // blue (needs brackets)',
                  'const key = \'firstName\';',
                  'console.log(user[key]);          // Ada (variable key)',
                  'console.log(user.key);           // undefined: literal key key',
                ],
                explanation:
                  'Brackets are required for the spaced key and for using a variable as the key. user.key looks for a property literally named key.',
              },
              commonMistakes: [
                'Writing object.variableName expecting the variable value to be used as the key — that needs brackets.',
              ],
              exercises: [
                {
                  type: 'predict',
                  prompt: 'Given const k = \'age\'; const o = { age: 30 }; what do o[k] and o.k return?',
                  solution: {
                    explanation:
                      'o[k] returns 30 because k evaluates to age. o.k returns undefined because there is no property literally named k.',
                  },
                },
                {
                  type: 'task',
                  prompt: 'Read a property whose name is the string \'data-id\' from an object el.',
                  solution: {
                    lines: ['const value = el[\'data-id\'];'],
                    explanation:
                      'The hyphen makes data-id an invalid identifier for dot notation, so bracket access is required.',
                  },
                },
                {
                  type: 'quiz',
                  prompt: 'When must you use bracket notation instead of dot notation?',
                  solution: {
                    explanation:
                      'When the key is in a variable or only known at runtime, or when the key is not a valid identifier (contains spaces, hyphens, or starts with a digit).',
                  },
                },
              ],
              docs: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Property_accessors',
            },
            {
              id: 'js3-t0-c2',
              title: 'Destructuring, spread and Object methods',
              summary:
                'Destructuring pulls properties into variables, spread copies and merges objects, and Object methods like keys, values and entries inspect them.',
              explanation:
                'Object destructuring lets you extract properties into variables in one statement, with support for renaming, default values and nested patterns, making function arguments and config handling far cleaner. The spread syntax, three dots before an object, copies the enumerable properties of one object into a new literal, which is the standard way to make a shallow copy or merge objects, with later properties overriding earlier ones. Note that this copy is shallow: nested objects are still shared by reference. The Object constructor provides useful static methods: Object.keys returns an array of the property names, Object.values returns the values, and Object.entries returns an array of key-value pairs, all perfect for iterating. Object.assign performs a similar merge into a target, and Object.freeze makes an object read-only at the top level. Together these tools let you work with objects immutably and inspect their structure without manual loops.',
              analogy:
                'Destructuring is unpacking specific items from a box into labelled spots on your desk; spread is photocopying the contents of one box into a fresh box and adding extra pages on top.',
              keyPoints: [
                'Destructuring extracts properties, supporting rename, defaults and nesting.',
                'Spread { ...obj } makes a shallow copy or merges objects.',
                'Object.keys, Object.values and Object.entries return arrays for iteration.',
                'Spread and Object.assign copies are shallow: nested objects stay shared.',
              ],
              code: {
                language: 'javascript',
                lines: [
                  'const user = { name: \'Ada\', age: 36, city: \'London\' };',
                  'const { name, age: years } = user;     // rename age to years',
                  'console.log(name, years);              // Ada 36',
                  'const updated = { ...user, age: 37 };  // copy then override',
                  'console.log(Object.keys(user));        // [name, age, city]',
                  'console.log(Object.entries(updated));  // [[name, Ada], ...]',
                ],
                explanation:
                  'Destructuring pulls out name and renames age. Spread copies user into a new object with age overridden. Object.keys and entries expose the structure as arrays.',
              },
              commonMistakes: [
                'Believing spread is a deep copy — nested objects and arrays are still shared by reference.',
                'Forgetting that property order in the spread matters: later keys override earlier ones.',
              ],
              exercises: [
                {
                  type: 'task',
                  prompt: 'Destructure title and an author defaulting to \'Unknown\' from an object book.',
                  solution: {
                    lines: ['const { title, author = \'Unknown\' } = book;'],
                    explanation:
                      'author uses a default applied only when the property is undefined, giving Unknown when missing.',
                  },
                },
                {
                  type: 'predict',
                  prompt: 'What does { ...{ a: 1, b: 2 }, b: 9 } evaluate to?',
                  solution: {
                    explanation:
                      'It is { a: 1, b: 9 }. The spread copies a and b, then the later b: 9 overrides the spread b.',
                  },
                },
                {
                  type: 'quiz',
                  prompt: 'Which Object method gives you an array of [key, value] pairs?',
                  solution: {
                    explanation:
                      'Object.entries returns an array of [key, value] pairs, useful for iterating over an object with for-of.',
                  },
                },
              ],
              docs: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment',
            },
          ],
        },
        {
          id: 'js3-t1',
          name: 'Arrays',
          concepts: [
            {
              id: 'js3-t1-c0',
              title: 'Creating arrays and mutating versus non-mutating methods',
              summary:
                'Arrays are ordered, zero-indexed lists; some methods change the original array while others return a new one without touching it.',
              explanation:
                'An array is an ordered collection accessed by numeric index starting at zero, created most often with a literal in square brackets. The length property tells you how many elements it holds. A crucial distinction is between mutating methods, which change the array in place, and non-mutating methods, which leave the original untouched and return something new. Mutating methods include push and pop (end), shift and unshift (start), splice (insert or remove anywhere), sort and reverse. Non-mutating methods include slice (a copy of a range), concat (joining), and the iteration methods like map and filter that return new arrays. Modern code favours non-mutating approaches because they avoid surprising side effects, especially when arrays are shared. ES2023 even added immutable versions like toSorted and toReversed. Knowing which category a method belongs to prevents the common bug of accidentally modifying data you meant to leave alone.',
              analogy:
                'Mutating methods are like editing the original document; non-mutating methods are like printing a revised copy and leaving the original in the drawer untouched.',
              keyPoints: [
                'Arrays are ordered and zero-indexed; length counts the elements.',
                'Mutating: push, pop, shift, unshift, splice, sort, reverse.',
                'Non-mutating: slice, concat, map, filter, and the new toSorted/toReversed.',
                'Prefer non-mutating methods to avoid surprising side effects.',
              ],
              code: {
                language: 'javascript',
                lines: [
                  'const nums = [3, 1, 2];',
                  'const sorted = [...nums].sort();   // copy first, then sort',
                  'console.log(nums);                 // [3, 1, 2] unchanged',
                  'console.log(sorted);               // [1, 2, 3]',
                  'nums.push(4);                      // mutates nums',
                  'console.log(nums);                 // [3, 1, 2, 4]',
                ],
                explanation:
                  'sort mutates, so we spread into a copy first to protect the original. push mutates nums directly, adding to the end.',
              },
              commonMistakes: [
                'Calling sort or reverse and being surprised the original array changed.',
                'Forgetting array indices start at zero, so the first element is index 0.',
              ],
              exercises: [
                {
                  type: 'predict',
                  prompt: 'After const a = [1, 2, 3]; const b = a.slice(0, 2); does a change?',
                  solution: {
                    explanation:
                      'No. slice is non-mutating; it returns a new array [1, 2] and leaves a as [1, 2, 3].',
                  },
                },
                {
                  type: 'quiz',
                  prompt: 'Name two mutating and two non-mutating array methods.',
                  solution: {
                    explanation:
                      'Mutating examples: push, splice (also pop, sort, reverse). Non-mutating examples: slice, map (also filter, concat).',
                  },
                },
                {
                  type: 'task',
                  prompt: 'Sort the array scores without mutating it, storing the result in ranked.',
                  solution: {
                    lines: ['const ranked = [...scores].sort((a, b) => a - b);'],
                    explanation:
                      'Spreading into a new array first keeps scores intact, since sort mutates whatever array it is called on.',
                  },
                },
              ],
              docs: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array',
            },
            {
              id: 'js3-t1-c1',
              title: 'map, filter, reduce and forEach',
              summary:
                'These higher-order methods transform, select, aggregate and iterate over arrays without manual loops.',
              explanation:
                'The iteration methods are the heart of modern array work because they express intent clearly. map takes a function and returns a new array of the same length where each element is the result of that function, ideal for transforming data. filter returns a new array containing only the elements for which the function returns truthy, ideal for selecting a subset. reduce is the most general: it walks the array carrying an accumulator, combining elements into a single result such as a sum, a count, or even a new object, taking a reducer function and an initial value. forEach simply runs a function for each element for its side effects and returns undefined, so it is for doing rather than producing. Because map and filter return new arrays they chain naturally: you can filter then map then reduce in a readable pipeline. These methods skip the manual index bookkeeping of for loops and make the transformation obvious at a glance.',
              analogy:
                'map is a factory line restamping every item; filter is a sieve keeping only items that pass; reduce is a funnel collapsing many items into one; forEach is a worker visiting each item to do a chore.',
              keyPoints: [
                'map returns a new array of transformed elements, same length.',
                'filter returns a new array of elements that pass a test.',
                'reduce folds the array into a single value with an accumulator.',
                'forEach runs a function per element for side effects and returns undefined.',
              ],
              diagram: {
                type: 'mermaid',
                lines: [
                  'flowchart LR',
                  '  Source[Array] --> Filter[filter keeps some]',
                  '  Filter --> Map[map transforms each]',
                  '  Map --> Reduce[reduce folds to one]',
                ],
                caption: 'A typical pipeline: filter a subset, map to transform, then reduce to a single value.',
              },
              code: {
                language: 'javascript',
                lines: [
                  'const nums = [1, 2, 3, 4];',
                  'const doubled = nums.map(n => n * 2);          // [2, 4, 6, 8]',
                  'const evens = nums.filter(n => n % 2 === 0);   // [2, 4]',
                  'const total = nums.reduce((sum, n) => sum + n, 0); // 10',
                  'nums.forEach(n => console.log(n));             // logs each',
                ],
                explanation:
                  'map transforms, filter selects, reduce sums starting from 0, and forEach just visits each element for logging.',
              },
              commonMistakes: [
                'Using map when you only need side effects (use forEach) or forEach when you need a result (use map).',
                'Forgetting reduce needs an initial value to be safe with empty arrays.',
              ],
              exercises: [
                {
                  type: 'task',
                  prompt: 'From the array prices, produce a new array of prices increased by 10 percent.',
                  solution: {
                    lines: ['const raised = prices.map(p => p * 1.1);'],
                    explanation:
                      'map applies the transformation to each element and returns a new array of the same length.',
                  },
                },
                {
                  type: 'predict',
                  prompt: 'What does [1, 2, 3].reduce((a, b) => a + b, 0) return?',
                  solution: {
                    explanation:
                      'It returns 6. reduce starts at 0 and adds each element, accumulating 0 + 1 + 2 + 3.',
                  },
                },
                {
                  type: 'quiz',
                  prompt: 'Why does forEach return undefined instead of a new array?',
                  solution: {
                    explanation:
                      'forEach is designed for side effects, running a function per element, not for producing a value; use map when you want a transformed array.',
                  },
                },
              ],
              docs: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reduce',
            },
            {
              id: 'js3-t1-c2',
              title: 'find, some, every and sort',
              summary:
                'find locates the first matching element, some and every test conditions across the array, and sort orders elements with a comparator.',
              explanation:
                'Beyond transforming arrays, you often need to search or test them. find returns the first element for which the callback is truthy, or undefined if none match, and findIndex returns its index instead. some returns true if at least one element passes the test, short-circuiting as soon as it finds one, while every returns true only if all elements pass, short-circuiting on the first failure; both are clean ways to ask a yes-or-no question about a collection. includes checks for a specific value directly. sort orders the array in place and, importantly, by default it converts elements to strings and sorts lexicographically, which famously orders numbers wrongly (10 before 2). To sort numbers you must pass a comparator function returning a negative, zero or positive number to indicate order; a - b gives ascending. Because sort mutates, copy the array first if you need to keep the original.',
              analogy:
                'find is searching a crowd for the first person wearing red; some asks is anyone wearing red; every asks is everyone wearing red; sort is lining the crowd up by a rule you define.',
              keyPoints: [
                'find returns the first matching element (or undefined); findIndex returns its index.',
                'some is true if any element passes; every is true only if all pass.',
                'sort defaults to string order; pass a comparator for numbers.',
                'sort mutates in place, so copy first to preserve the original.',
              ],
              code: {
                language: 'javascript',
                lines: [
                  'const nums = [10, 2, 33, 4];',
                  'console.log(nums.find(n => n > 30));    // 33',
                  'console.log(nums.some(n => n > 30));    // true',
                  'console.log(nums.every(n => n > 0));    // true',
                  'console.log([...nums].sort());          // [10, 2, 33, 4] string order',
                  'console.log([...nums].sort((a, b) => a - b)); // [2, 4, 10, 33]',
                ],
                explanation:
                  'find returns the first match. some and every answer yes-or-no. The default sort uses string order, so a numeric comparator is needed for correct number sorting.',
              },
              commonMistakes: [
                'Calling sort on numbers without a comparator and getting lexicographic order like 1, 10, 2.',
                'Expecting find to return all matches — it returns only the first; use filter for all.',
              ],
              exercises: [
                {
                  type: 'predict',
                  prompt: 'What does [1, 10, 2, 20].sort() produce and why?',
                  solution: {
                    explanation:
                      'It produces [1, 10, 2, 20] in string order because the default sort compares elements as strings, so 10 comes before 2. Use sort((a, b) => a - b) for numeric order.',
                  },
                },
                {
                  type: 'task',
                  prompt: 'Find the first user in users whose age is over 18.',
                  solution: {
                    lines: ['const adult = users.find(u => u.age > 18);'],
                    explanation:
                      'find returns the first element passing the test, or undefined if none match.',
                  },
                },
                {
                  type: 'quiz',
                  prompt: 'What is the difference between some and every?',
                  solution: {
                    explanation:
                      'some returns true if at least one element passes the test; every returns true only when all elements pass.',
                  },
                },
              ],
              docs: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort',
            },
          ],
        },
        {
          id: 'js3-t2',
          name: 'Strings, numbers and JSON',
          concepts: [
            {
              id: 'js3-t2-c0',
              title: 'Template literals and string methods',
              summary:
                'Template literals embed expressions and span multiple lines, and strings come with many methods for searching and transforming text.',
              explanation:
                'Template literals use backticks instead of quotes and bring two big advantages: interpolation, where you embed any expression inside a dollar-sign and braces placeholder, and multi-line strings without escape characters. They make building messages from variables far cleaner than the old plus concatenation. Strings are immutable, so every method returns a new string rather than changing the original. Common methods include length (a property), toUpperCase and toLowerCase, trim to remove surrounding whitespace, slice and substring to extract parts, indexOf and includes to search, replace and replaceAll to substitute, split to break a string into an array, and padStart for formatting. Because strings are primitives but have methods, the engine temporarily wraps them in an object so the methods work. Mastering these methods covers the vast majority of everyday text manipulation.',
              analogy:
                'A template literal is a fill-in-the-blanks form: you write the fixed text once and drop variable values into the labelled blanks instead of gluing pieces together by hand.',
              keyPoints: [
                'Template literals use backticks and ${expression} for interpolation.',
                'They allow multi-line strings without escape characters.',
                'Strings are immutable; methods return new strings.',
                'Key methods: trim, slice, includes, replaceAll, split, toUpperCase.',
              ],
              code: {
                language: 'javascript',
                lines: [
                  'const name = \'Ada\';',
                  'const msg = `Hello, ${name}! You have ${2 + 3} messages.`;',
                  'console.log(msg);             // Hello, Ada! You have 5 messages.',
                  'console.log(\'  hi  \'.trim()); // hi',
                  'console.log(\'a,b,c\'.split(\',\')); // [a, b, c]',
                  'console.log(\'hello\'.includes(\'ell\')); // true',
                ],
                explanation:
                  'The template literal interpolates the name and the result of 2 + 3. trim, split and includes show common immutable string operations.',
              },
              commonMistakes: [
                'Trying to mutate a string in place with index assignment, which silently does nothing.',
                'Using plus concatenation for complex messages where a template literal is far clearer.',
              ],
              exercises: [
                {
                  type: 'task',
                  prompt: 'Build a greeting string using a template literal that says Hi followed by the variable user.',
                  solution: {
                    lines: ['const greeting = `Hi ${user}`;'],
                    explanation:
                      'Backticks allow embedding the user variable directly inside the string with the dollar-brace placeholder.',
                  },
                },
                {
                  type: 'predict',
                  prompt: 'What does \'Hello\'.toUpperCase() return, and does it change the original string?',
                  solution: {
                    explanation:
                      'It returns the new string HELLO. The original is unchanged because strings are immutable and the method returns a fresh string.',
                  },
                },
                {
                  type: 'quiz',
                  prompt: 'Name two advantages template literals have over the plus operator.',
                  solution: {
                    explanation:
                      'They allow inline expression interpolation with ${} and support multi-line strings without escape sequences.',
                  },
                },
              ],
              docs: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals',
            },
            {
              id: 'js3-t2-c1',
              title: 'Numbers and the Math object',
              summary:
                'JavaScript numbers are floating-point, which causes rounding quirks, and the Math object provides constants and functions for calculations.',
              explanation:
                'JavaScript has a single number type based on the IEEE 754 double-precision floating-point format, so integers and decimals share it. This means some decimals cannot be represented exactly, which is why 0.1 plus 0.2 is not exactly 0.3, a classic surprise to handle by rounding for display. Useful number tools include Number.isInteger, Number.isNaN to safely check for NaN, parseInt and parseFloat to read numbers from strings, and toFixed to format a number with a set number of decimals as a string. The special values Infinity and NaN (not a number) arise from operations like division by zero or invalid maths, and NaN is famously not equal to itself, so you must use Number.isNaN to detect it. The Math object is a namespace of static helpers: Math.round, Math.floor, Math.ceil, Math.abs, Math.max, Math.min, Math.random for a value in zero to one, and Math.pow or the exponent operator for powers.',
              analogy:
                'Floating-point numbers are like measuring with a ruler that has very fine but still limited marks: most lengths fit perfectly, but a few fall between the marks and get rounded to the nearest tick.',
              keyPoints: [
                'All numbers are double-precision floats; 0.1 + 0.2 is not exactly 0.3.',
                'NaN is not equal to itself; use Number.isNaN to detect it.',
                'parseInt and parseFloat read numbers from strings; toFixed formats decimals.',
                'Math provides round, floor, ceil, abs, max, min, random and more.',
              ],
              code: {
                language: 'javascript',
                lines: [
                  'console.log(0.1 + 0.2);            // 0.30000000000000004',
                  'console.log((0.1 + 0.2).toFixed(2)); // 0.30 (string)',
                  'console.log(Number.isNaN(NaN));    // true',
                  'console.log(Math.max(3, 7, 2));    // 7',
                  'console.log(Math.floor(4.9));      // 4',
                  'console.log(parseInt(\'42px\', 10)); // 42',
                ],
                explanation:
                  'Floating-point gives an imprecise sum; toFixed formats it. Number.isNaN safely detects NaN, and Math plus parseInt cover common numeric tasks.',
              },
              commonMistakes: [
                'Comparing floating-point results for exact equality instead of rounding or using a small tolerance.',
                'Using the global isNaN, which coerces, instead of the stricter Number.isNaN.',
              ],
              exercises: [
                {
                  type: 'predict',
                  prompt: 'Why does 0.1 + 0.2 === 0.3 evaluate to false?',
                  solution: {
                    explanation:
                      'Floating-point cannot represent 0.1 and 0.2 exactly, so their sum is 0.30000000000000004, which is not strictly equal to 0.3.',
                  },
                },
                {
                  type: 'task',
                  prompt: 'Round the number 7.345 down to the nearest whole number.',
                  solution: {
                    lines: ['const result = Math.floor(7.345);'],
                    explanation:
                      'Math.floor rounds toward negative infinity, giving 7.',
                  },
                },
                {
                  type: 'quiz',
                  prompt: 'How do you reliably test whether a value is NaN?',
                  solution: {
                    explanation:
                      'Use Number.isNaN(value). Direct comparison fails because NaN is not equal to itself, and the global isNaN coerces non-numbers.',
                  },
                },
              ],
              docs: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math',
            },
            {
              id: 'js3-t2-c2',
              title: 'JSON and Date basics',
              summary:
                'JSON is a text format for exchanging data, with parse and stringify to convert between text and objects; Date represents points in time.',
              explanation:
                'JSON (JavaScript Object Notation) is a lightweight, language-independent text format for structured data, widely used by APIs. It looks like a subset of JavaScript object and array literals but with strict rules: keys must be double-quoted strings, and only strings, numbers, booleans, null, arrays and objects are allowed, so functions, undefined and dates are not represented. JSON.stringify converts a JavaScript value to a JSON string, optionally with indentation for readability, and JSON.parse turns a JSON string back into a value. Round-tripping through JSON is also a quick way to deep-clone plain data, though it drops functions and converts dates to strings. The Date object represents a moment in time as milliseconds since the Unix epoch; you create one with new Date, read parts with methods like getFullYear and getTime, and format it for display, though many real projects use a dedicated library or the newer Temporal API for complex date work.',
              analogy:
                'JSON is like flat-pack furniture: a complex object is disassembled into a portable text package (stringify), shipped across the network, then reassembled into a live object on the other side (parse).',
              keyPoints: [
                'JSON keys are double-quoted; only strings, numbers, booleans, null, arrays, objects allowed.',
                'JSON.stringify turns a value into JSON text; JSON.parse turns text back into a value.',
                'Functions, undefined and dates are not preserved by JSON.',
                'Date stores time as milliseconds since the Unix epoch; read parts with getter methods.',
              ],
              code: {
                language: 'javascript',
                lines: [
                  'const user = { name: \'Ada\', active: true };',
                  'const text = JSON.stringify(user);   // {"name":"Ada","active":true}',
                  'const back = JSON.parse(text);       // object again',
                  'console.log(back.name);              // Ada',
                  'const now = new Date();',
                  'console.log(now.getFullYear());      // e.g. 2026',
                ],
                explanation:
                  'stringify serialises the object to text and parse reconstructs it. A Date object exposes parts of the time via getter methods.',
              },
              commonMistakes: [
                'Expecting JSON to preserve functions or Date objects — functions are dropped and dates become strings.',
                'Forgetting JSON requires double quotes on keys, so single-quoted keys are invalid JSON.',
              ],
              exercises: [
                {
                  type: 'task',
                  prompt: 'Convert the object config to a JSON string and back into an object copy.',
                  solution: {
                    lines: ['const text = JSON.stringify(config);', 'const copy = JSON.parse(text);'],
                    explanation:
                      'stringify serialises config to JSON text; parse rebuilds a separate object, giving a deep clone of the plain data.',
                  },
                },
                {
                  type: 'predict',
                  prompt: 'What happens to a function property when you call JSON.stringify on an object?',
                  solution: {
                    explanation:
                      'It is dropped. JSON cannot represent functions, so function-valued properties are omitted from the output.',
                  },
                },
                {
                  type: 'quiz',
                  prompt: 'What does a Date object internally store to represent a moment in time?',
                  solution: {
                    explanation:
                      'The number of milliseconds elapsed since the Unix epoch, midnight UTC on 1 January 1970.',
                  },
                },
              ],
              docs: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON',
            },
          ],
        },
      ],
    },
    /* ───────────────────── LEVEL 4 — MODERN AND ASYNCHRONOUS JS ───────────────────── */
    {
      level: 4,
      name: 'Modern and asynchronous JS',
      focus: 'Modern syntax features and how JavaScript handles work that takes time without blocking',
      accent: '#eab308',
      soft: '#fef9c3',
      topics: [
        {
          id: 'js4-t0',
          name: 'Modern syntax',
          concepts: [
            {
              id: 'js4-t0-c0',
              title: 'Destructuring and spread/rest recap in context',
              summary:
                'Destructuring and the three-dot syntax apply to both arrays and function arguments, making data flow concise and expressive.',
              explanation:
                'Modern JavaScript leans heavily on destructuring and the three-dot syntax across many situations. Array destructuring assigns elements by position into variables, supports skipping with empty slots, and combines with a rest element to capture the remaining items as an array. Object destructuring works by key and is especially powerful in function parameters, letting a function declare exactly which properties it needs from an options object, complete with defaults. The three dots act as spread when expanding an array or object into a new one, and as rest when collecting leftovers in a destructuring pattern or function parameter list; which role it plays depends on position. A neat trick is swapping two variables in one line with array destructuring. These features reduce boilerplate dramatically and are everywhere in modern codebases, frameworks and tutorials, so fluency with them is essential to reading real code.',
              analogy:
                'Destructuring is unpacking a delivery box straight onto labelled shelves; the three dots are either pouring a box out into a bigger box (spread) or sweeping all the leftovers into one bin (rest).',
              keyPoints: [
                'Array destructuring assigns by position; object destructuring by key.',
                'Destructuring in function parameters declares needed properties with defaults.',
                'Spread expands into a new array or object; rest collects leftovers.',
                'Swap variables in one line: [a, b] = [b, a].',
              ],
              code: {
                language: 'javascript',
                lines: [
                  'const [first, ...others] = [1, 2, 3, 4];',
                  'console.log(first, others);        // 1 [2, 3, 4]',
                  'function draw({ x = 0, y = 0 } = {}) { return x + y; }',
                  'console.log(draw({ x: 5 }));        // 5 (y defaults to 0)',
                  'let a = 1, b = 2;',
                  '[a, b] = [b, a];                    // swap',
                  'console.log(a, b);                  // 2 1',
                ],
                explanation:
                  'Rest captures the tail of the array. The function destructures its options with defaults. Array destructuring swaps a and b in one statement.',
              },
              commonMistakes: [
                'Forgetting the default empty object on a destructured parameter, causing a crash when called with no argument.',
                'Mixing up spread and rest position — rest must be last in a pattern or parameter list.',
              ],
              exercises: [
                {
                  type: 'task',
                  prompt: 'Destructure the first two elements of arr into a and b, collecting the rest into more.',
                  solution: {
                    lines: ['const [a, b, ...more] = arr;'],
                    explanation:
                      'a and b take the first two by position, and the rest element gathers any remaining items into the array more.',
                  },
                },
                {
                  type: 'predict',
                  prompt: 'What does function f({ n = 1 } = {}) {} do when called as f()?',
                  solution: {
                    explanation:
                      'It works without error: the default empty object lets destructuring proceed and n defaults to 1.',
                  },
                },
                {
                  type: 'quiz',
                  prompt: 'How do the three dots differ between spread and rest?',
                  solution: {
                    explanation:
                      'Spread expands an existing iterable or object into a new one; rest collects multiple remaining values into a single array or object in a pattern or parameter list.',
                  },
                },
              ],
              docs: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax',
            },
            {
              id: 'js4-t0-c1',
              title: 'Optional chaining and nullish coalescing',
              summary:
                'Optional chaining safely accesses deep properties that might not exist, and nullish coalescing supplies a fallback only for null or undefined.',
              explanation:
                'Two ES2020 operators make handling missing data far cleaner. Optional chaining, written with a question mark before a dot or bracket or call, short-circuits and returns undefined the moment any link in the chain is null or undefined, instead of throwing the dreaded cannot read property of undefined error. It works for property access, array indexing and method calls, so you can safely reach into objects whose shape is uncertain, such as API responses. Nullish coalescing, the double question mark, returns its right side only when the left side is null or undefined, unlike the logical OR which also falls back on any falsy value like 0 or empty string. Combining the two is a common pattern: optional-chain into a possibly-missing value, then nullish-coalesce a sensible default. These operators replace long defensive checks and accidental bugs where 0 or an empty string were wrongly treated as missing.',
              analogy:
                'Optional chaining is a careful explorer who turns back safely the instant a bridge is missing rather than falling; nullish coalescing is a backup plan triggered only when there is genuinely nothing there, not merely something small.',
              keyPoints: [
                'obj?.prop returns undefined if obj is null or undefined instead of throwing.',
                'Optional chaining works with ?.[index] and ?.() for calls too.',
                '?? falls back only on null or undefined, not on 0 or empty string.',
                'Combine them: data?.value ?? defaultValue.',
              ],
              code: {
                language: 'javascript',
                lines: [
                  'const user = { profile: { name: \'Ada\' } };',
                  'console.log(user.profile?.name);        // Ada',
                  'console.log(user.account?.balance);     // undefined, no crash',
                  'const count = 0;',
                  'console.log(count ?? 10);               // 0 (kept)',
                  'console.log(count || 10);               // 10 (0 is falsy)',
                ],
                explanation:
                  'Optional chaining returns undefined for the missing account instead of throwing. ?? keeps the valid 0, while || wrongly replaces it.',
              },
              commonMistakes: [
                'Reaching for || to set defaults when 0 or empty string are valid, accidentally discarding them; use ??.',
                'Overusing optional chaining to silence errors that actually indicate a real bug.',
              ],
              exercises: [
                {
                  type: 'predict',
                  prompt: 'What does const x = 0; x || 5 return versus x ?? 5?',
                  solution: {
                    explanation:
                      'x || 5 returns 5 because 0 is falsy. x ?? 5 returns 0 because 0 is neither null nor undefined.',
                  },
                },
                {
                  type: 'task',
                  prompt: 'Safely read response.data.items, defaulting to an empty array if anything is missing.',
                  solution: {
                    lines: ['const items = response?.data?.items ?? [];'],
                    explanation:
                      'Optional chaining stops safely at any missing link, and ?? supplies the empty array only when the result is null or undefined.',
                  },
                },
                {
                  type: 'quiz',
                  prompt: 'When does optional chaining short-circuit?',
                  solution: {
                    explanation:
                      'As soon as the value to its left is null or undefined; the rest of the chain is skipped and the whole expression evaluates to undefined.',
                  },
                },
              ],
              docs: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Optional_chaining',
            },
            {
              id: 'js4-t0-c2',
              title: 'Modules: import and export',
              summary:
                'ES modules split code across files using export to expose values and import to bring them in, with named and default exports.',
              explanation:
                'ES modules (ESM) are the standard way to organise JavaScript across multiple files. Each module file has its own scope, so its top-level variables are private unless you explicitly export them. There are two export styles: named exports, where you export specific bindings by name and import them by the same name in curly braces, and a single default export per module, imported with any name you choose and no braces. You can mix them, rename on import with the as keyword, and import everything as a namespace object. Imports are static and hoisted, so the engine resolves the module graph before running code, which enables tooling and tree-shaking to remove unused exports. In the browser you opt in with a script tag marked type equals module, and in Node modern files use ESM too. The older CommonJS system with require and module.exports still appears in Node, but ESM is the forward-looking standard.',
              analogy:
                'A module is a shop: most of its back room is private, but the items it puts in the front window (exports) can be picked up by other shops (imports). The default export is the shop signature product on the main display.',
              keyPoints: [
                'Each module has private scope; only exports are visible elsewhere.',
                'Named exports import by name in braces; one default export imports without braces.',
                'Rename with as; import everything as a namespace with import * as.',
                'Imports are static and hoisted, enabling tooling and tree-shaking.',
              ],
              diagram: {
                type: 'mermaid',
                lines: [
                  'flowchart LR',
                  '  Math[math module] -->|export add| App[app module]',
                  '  Util[util module] -->|default export| App',
                  '  App --> Run[runs the program]',
                ],
                caption: 'Modules expose exports that other modules import, forming a dependency graph resolved before execution.',
              },
              code: {
                language: 'javascript',
                lines: [
                  '// file: math.js',
                  'export const add = (a, b) => a + b;     // named export',
                  'export default function square(n) { return n * n; } // default',
                  '',
                  '// file: app.js',
                  'import square, { add } from \'./math.js\';',
                  'console.log(add(2, 3), square(4));       // 5 16',
                ],
                explanation:
                  'math.js exposes a named add and a default square. app.js imports the default without braces and the named export inside braces.',
              },
              commonMistakes: [
                'Forgetting curly braces on named imports or adding them to a default import.',
                'Expecting module top-level variables to be global — they are private to the module.',
              ],
              exercises: [
                {
                  type: 'task',
                  prompt: 'Export a named constant PI and a default function area from a module.',
                  solution: {
                    lines: ['export const PI = 3.14159;', 'export default function area(r) { return PI * r * r; }'],
                    explanation:
                      'PI is a named export usable with braces; area is the default export importable with any name and no braces.',
                  },
                },
                {
                  type: 'predict',
                  prompt: 'What is wrong with import { square } from \'./math.js\'; if square is the default export?',
                  solution: {
                    explanation:
                      'Default exports are imported without braces, like import square from \'./math.js\'. Using braces tries to import a named export called square, which does not exist.',
                  },
                },
                {
                  type: 'quiz',
                  prompt: 'How many default exports can a single module have?',
                  solution: {
                    explanation:
                      'Exactly one. A module may have many named exports but at most one default export.',
                  },
                },
              ],
              docs: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules',
            },
          ],
        },
        {
          id: 'js4-t1',
          name: 'Asynchronous foundations',
          concepts: [
            {
              id: 'js4-t1-c0',
              title: 'The call stack and the event loop',
              summary:
                'JavaScript runs on a single thread using a call stack, and the event loop coordinates pending tasks so long operations do not block.',
              explanation:
                'JavaScript executes on a single thread, meaning it can do only one thing at a time. Function calls are tracked on the call stack: calling a function pushes a frame, returning pops it. If a slow synchronous operation sits on the stack, nothing else can run and the page freezes, which is why blocking work is avoided. Asynchronous operations like timers, network requests and events are handed off to the host environment (the browser or Node), which performs them outside the main thread and, when done, queues a callback. The event loop is the coordinator: whenever the call stack is empty, it takes the next queued callback and pushes it onto the stack to run. There are two queues with different priorities: the microtask queue (used by promises) is fully drained before the next macrotask (used by setTimeout and events). Understanding this model explains why asynchronous code runs later, in a predictable order, without true parallelism in your own code.',
              analogy:
                'The call stack is a single chef working one order at a time; slow tasks are sent to assistants (the environment), and the event loop is the expediter who, the moment the chef is free, hands over the next finished ticket from the queue.',
              keyPoints: [
                'JavaScript is single-threaded with one call stack.',
                'Blocking the stack with slow synchronous work freezes everything.',
                'The environment handles async work and queues callbacks when done.',
                'The event loop runs queued callbacks when the stack is empty; microtasks before macrotasks.',
              ],
              diagram: {
                type: 'mermaid',
                lines: [
                  'flowchart LR',
                  '  Stack[Call stack] --> Env[Web APIs run async]',
                  '  Env --> Queue[Callback queues]',
                  '  Queue --> Loop[Event loop]',
                  '  Loop --> Stack',
                ],
                caption: 'Async work runs in the environment, queues a callback, and the event loop returns it to the stack when it is empty.',
              },
              code: {
                language: 'javascript',
                lines: [
                  'console.log(\'1 start\');',
                  'setTimeout(() => console.log(\'3 timeout\'), 0);',
                  'Promise.resolve().then(() => console.log(\'2 microtask\'));',
                  'console.log(\'1 end\');',
                  '// Output order: 1 start, 1 end, 2 microtask, 3 timeout',
                ],
                explanation:
                  'Synchronous logs run first. The promise microtask runs before the setTimeout macrotask, even with a zero delay, because microtasks have priority.',
              },
              commonMistakes: [
                'Assuming setTimeout with 0 runs immediately — it waits until the stack clears and after all microtasks.',
                'Blocking the single thread with a long loop, freezing the UI.',
              ],
              exercises: [
                {
                  type: 'predict',
                  prompt: 'In the code above, why does 2 microtask print before 3 timeout despite the timeout being scheduled first?',
                  solution: {
                    explanation:
                      'The microtask queue (promises) is fully drained before the next macrotask (setTimeout), so the resolved promise callback runs first.',
                  },
                },
                {
                  type: 'quiz',
                  prompt: 'Why does a long synchronous loop freeze a web page?',
                  solution: {
                    explanation:
                      'JavaScript is single-threaded; while the loop occupies the call stack, the event loop cannot run any other callbacks, so rendering and input handling stall.',
                  },
                },
                {
                  type: 'predict',
                  prompt: 'When does the event loop move a queued callback onto the call stack?',
                  solution: {
                    explanation:
                      'Only when the call stack is empty, meaning the current synchronous code has finished running.',
                  },
                },
              ],
              docs: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Execution_model',
            },
            {
              id: 'js4-t1-c1',
              title: 'Callbacks and callback hell',
              summary:
                'A callback is a function passed to be called later, the original way to handle async work, but deep nesting becomes hard to read.',
              explanation:
                'A callback is simply a function you pass to another function so it can be invoked later, often when an asynchronous operation finishes. This was the original asynchronous pattern: functions like setTimeout and old network APIs take a callback to run on completion. A common convention in Node is the error-first callback, where the first parameter is an error (or null) and the second is the result, so you check the error before using the data. The problem appears when one async step depends on the previous one, leading to callbacks nested inside callbacks inside callbacks, an awkward rightward-drifting pyramid nicknamed callback hell. Beyond being hard to read, this style scatters error handling and makes it easy to forget a case. These pain points motivated promises and then async/await, which flatten the same logic into readable sequences. Callbacks are still everywhere for event handlers and array methods, but for sequencing async work the newer tools are preferred.',
              analogy:
                'A callback is leaving your phone number so someone calls you back when the result is ready; callback hell is a chain of people who each can only call the next person, producing a tangled relay that is hard to follow.',
              keyPoints: [
                'A callback is a function passed to be invoked later.',
                'Node convention: error-first callbacks (err, result).',
                'Chaining dependent async steps with callbacks causes deep nesting (callback hell).',
                'Promises and async/await were created to flatten this pattern.',
              ],
              code: {
                language: 'javascript',
                lines: [
                  'function getData(cb) {',
                  '  setTimeout(() => cb(null, \'result\'), 100); // err-first callback',
                  '}',
                  'getData((err, data) => {',
                  '  if (err) return console.error(err);',
                  '  console.log(data);   // result',
                  '});',
                ],
                explanation:
                  'getData accepts a callback and calls it later with an error-first signature. The caller checks err before using data.',
              },
              commonMistakes: [
                'Forgetting to handle the error argument in an error-first callback.',
                'Nesting many dependent callbacks instead of switching to promises or async/await.',
              ],
              exercises: [
                {
                  type: 'quiz',
                  prompt: 'What is the error-first callback convention?',
                  solution: {
                    explanation:
                      'The callback receives the error as its first argument (null if none) and the result as the second, so callers check for an error before using the data.',
                  },
                },
                {
                  type: 'task',
                  prompt: 'Call setTimeout to log Done after 500 milliseconds using a callback.',
                  solution: {
                    lines: ['setTimeout(() => console.log(\'Done\'), 500);'],
                    explanation:
                      'setTimeout takes a callback and a delay; the arrow function is the callback invoked after the delay.',
                  },
                },
                {
                  type: 'predict',
                  prompt: 'Why is deeply nested callback code called callback hell?',
                  solution: {
                    explanation:
                      'Each dependent async step nests inside the previous callback, drifting the code rightward into a hard-to-read pyramid with scattered error handling.',
                  },
                },
              ],
              docs: 'https://developer.mozilla.org/en-US/docs/Glossary/Callback_function',
            },
            {
              id: 'js4-t1-c2',
              title: 'Promises and then/catch/finally',
              summary:
                'A promise is an object representing a future value that will resolve or reject, with then, catch and finally to handle outcomes.',
              explanation:
                'A promise is an object that represents the eventual result of an asynchronous operation. It is in one of three states: pending while the work is in progress, fulfilled when it succeeds with a value, or rejected when it fails with a reason, and once settled it never changes again. You attach handlers with then, which runs when the promise fulfils and receives the value, and catch, which runs when it rejects and receives the error. finally runs either way and is good for cleanup. The real power is chaining: returning a value or another promise from a then produces a new promise, so you can sequence asynchronous steps in a flat chain rather than a nested pyramid, with a single catch at the end handling any error along the way. Promise.all waits for several promises in parallel and fails fast if any reject, while Promise.allSettled waits for all regardless of outcome, and Promise.race settles with the first to finish. Promise handlers always run as microtasks.',
              analogy:
                'A promise is a restaurant buzzer: you get it immediately (pending), and later it either lights up to say your food is ready (fulfilled) or flashes that the kitchen failed (rejected); then and catch are what you decide to do in each case.',
              keyPoints: [
                'A promise is pending, then settles as fulfilled or rejected, permanently.',
                'then handles success, catch handles failure, finally runs either way.',
                'Returning from then chains flat sequences with one catch at the end.',
                'Promise.all runs in parallel and fails fast; allSettled waits for all.',
              ],
              diagram: {
                type: 'mermaid',
                lines: [
                  'flowchart LR',
                  '  Pending[Pending] --> Fulfilled[Fulfilled then]',
                  '  Pending --> Rejected[Rejected catch]',
                  '  Fulfilled --> Finally[finally cleanup]',
                  '  Rejected --> Finally',
                ],
                caption: 'A promise starts pending and settles once into fulfilled or rejected; finally runs in both cases.',
              },
              code: {
                language: 'javascript',
                lines: [
                  'const p = new Promise((resolve, reject) => {',
                  '  setTimeout(() => resolve(42), 100);',
                  '});',
                  'p.then(value => value + 1)        // chains: 43',
                  '  .then(value => console.log(value))',
                  '  .catch(err => console.error(err))',
                  '  .finally(() => console.log(\'done\'));',
                ],
                explanation:
                  'The executor resolves with 42. Each then transforms and passes the value along; catch handles any rejection and finally always runs.',
              },
              commonMistakes: [
                'Forgetting to return a promise inside then, breaking the chain order.',
                'Omitting catch, leaving rejections unhandled.',
              ],
              exercises: [
                {
                  type: 'quiz',
                  prompt: 'What are the three states of a promise, and can a settled promise change state again?',
                  solution: {
                    explanation:
                      'Pending, fulfilled and rejected. Once a promise settles to fulfilled or rejected it is permanent and cannot change.',
                  },
                },
                {
                  type: 'predict',
                  prompt: 'What is the difference between Promise.all and Promise.allSettled when one promise rejects?',
                  solution: {
                    explanation:
                      'Promise.all rejects immediately as soon as any input rejects. Promise.allSettled waits for all and reports each result, fulfilled or rejected, without failing fast.',
                  },
                },
                {
                  type: 'task',
                  prompt: 'Attach a then to log the value and a catch to log errors on a promise named load.',
                  solution: {
                    lines: ['load.then(value => console.log(value)).catch(err => console.error(err));'],
                    explanation:
                      'then handles the fulfilled value and catch handles any rejection in the chain.',
                  },
                },
              ],
              docs: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise',
            },
          ],
        },
        {
          id: 'js4-t2',
          name: 'async/await and fetch',
          concepts: [
            {
              id: 'js4-t2-c0',
              title: 'async functions and await',
              summary:
                'async functions let you write asynchronous code that reads like synchronous code, using await to pause for a promise to settle.',
              explanation:
                'The async and await keywords are syntactic sugar over promises that make asynchronous code read top to bottom like ordinary code. Marking a function async makes it always return a promise: any value you return becomes the fulfilment value, and any thrown error becomes a rejection. Inside an async function you can use await before a promise, which pauses that function until the promise settles and then evaluates to the fulfilled value, or throws if it rejected. Crucially, await does not block the whole thread; it only suspends the current async function while letting the event loop keep running everything else. This flattens promise chains into sequential statements that are far easier to read and reason about. You can still run independent operations in parallel by starting them first and awaiting Promise.all, rather than awaiting each in turn, which avoids needlessly serialising work that could overlap.',
              analogy:
                'await is like ordering coffee and stepping aside to let the next customer order while you wait for your name to be called; you pause your own task without holding up the whole queue.',
              keyPoints: [
                'An async function always returns a promise.',
                'await pauses the async function until a promise settles, yielding its value.',
                'await suspends only the current function, not the whole thread.',
                'Run independent work in parallel by awaiting Promise.all, not one by one.',
              ],
              code: {
                language: 'javascript',
                lines: [
                  'function wait(ms) { return new Promise(r => setTimeout(r, ms)); }',
                  'async function run() {',
                  '  console.log(\'before\');',
                  '  await wait(100);          // pause here, not blocking',
                  '  console.log(\'after\');',
                  '  return \'done\';            // becomes the resolved value',
                  '}',
                  'run().then(v => console.log(v)); // before, after, done',
                ],
                explanation:
                  'await pauses run until the promise settles, then continues. The returned string becomes the resolved value of the promise run returns.',
              },
              commonMistakes: [
                'Awaiting independent operations one by one, serialising work that could run in parallel with Promise.all.',
                'Forgetting that an async function returns a promise, so its result must be awaited or chained with then.',
              ],
              exercises: [
                {
                  type: 'predict',
                  prompt: 'What does an async function return if its body executes return 5?',
                  solution: {
                    explanation:
                      'It returns a promise that fulfils with the value 5, not the raw number 5, because async functions always return promises.',
                  },
                },
                {
                  type: 'task',
                  prompt: 'Rewrite to run two independent fetches in parallel: const a = await getA(); const b = await getB();',
                  solution: {
                    lines: ['const [a, b] = await Promise.all([getA(), getB()]);'],
                    explanation:
                      'Starting both calls and awaiting Promise.all lets them overlap instead of waiting for getA to finish before getB starts.',
                  },
                },
                {
                  type: 'quiz',
                  prompt: 'Does await block the entire thread while it waits?',
                  solution: {
                    explanation:
                      'No. It only suspends the current async function; the event loop continues handling other tasks meanwhile.',
                  },
                },
              ],
              docs: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function',
            },
            {
              id: 'js4-t2-c1',
              title: 'try/catch with await',
              summary:
                'Wrap awaited calls in try/catch to handle rejected promises with the same familiar error handling as synchronous code.',
              explanation:
                'Because await throws when its promise rejects, you handle async errors with the ordinary try/catch statement, which is one of the biggest readability wins over raw promise chains. You put the awaited operations inside a try block, and any rejection along the way jumps to the catch block where you receive the error, just like a synchronous throw. A finally block runs regardless of success or failure, perfect for cleanup such as hiding a loading spinner. This unifies synchronous and asynchronous error handling under one mental model. Be careful with loops: a try/catch around an await inside a loop lets you decide whether one failure stops the loop or merely skips one iteration. Also remember that if you forget to await a promise inside a try, its rejection will not be caught there because the function moves on before the promise settles. Clean async code pairs every await that can fail with appropriate error handling.',
              analogy:
                'try/catch with await is like a safety net under a tightrope walker: whether they cross successfully or slip, the net (catch) is there for failures and the finally is the crew that always cleans up the stage afterwards.',
              keyPoints: [
                'await throws on rejection, so try/catch handles async errors naturally.',
                'finally runs on both success and failure, ideal for cleanup.',
                'Inside loops, decide whether a caught error stops the loop or skips one pass.',
                'A forgotten await means its rejection will not be caught by the surrounding try.',
              ],
              code: {
                language: 'javascript',
                lines: [
                  'async function load() {',
                  '  try {',
                  '    const data = await fetchData();   // may reject',
                  '    return data;',
                  '  } catch (err) {',
                  '    console.error(\'Failed:\', err.message);',
                  '    return null;',
                  '  } finally {',
                  '    console.log(\'attempt finished\');',
                  '  }',
                  '}',
                ],
                explanation:
                  'If fetchData rejects, await throws and control jumps to catch. The finally block runs whether or not an error occurred.',
              },
              commonMistakes: [
                'Forgetting await inside a try, so the rejection escapes the catch.',
                'Catching errors and swallowing them silently without logging or rethrowing.',
              ],
              exercises: [
                {
                  type: 'task',
                  prompt: 'Wrap const user = await getUser(); in a try/catch that logs the error.',
                  solution: {
                    lines: ['try {', '  const user = await getUser();', '} catch (err) {', '  console.error(err);', '}'],
                    explanation:
                      'Because await throws on rejection, the catch block receives and logs the error just like synchronous code.',
                  },
                },
                {
                  type: 'predict',
                  prompt: 'If you write doAsync(); without await inside a try block and it rejects, will the catch run?',
                  solution: {
                    explanation:
                      'No. Without await the function does not pause, so the rejection happens later as an unhandled rejection and the surrounding catch never sees it.',
                  },
                },
                {
                  type: 'quiz',
                  prompt: 'What is a good use for the finally block when loading data?',
                  solution: {
                    explanation:
                      'Cleanup that must happen either way, such as hiding a loading spinner or closing a connection, since finally runs on both success and failure.',
                  },
                },
              ],
              docs: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/await',
            },
            {
              id: 'js4-t2-c2',
              title: 'The fetch API and handling responses',
              summary:
                'fetch makes network requests and returns a promise for a Response; you check ok, then parse the body with methods like json.',
              explanation:
                'fetch is the modern browser API for making HTTP requests, and it is also available in recent Node versions. It returns a promise that resolves to a Response object as soon as the server responds with headers, before the body has arrived. A crucial gotcha is that fetch only rejects on network failure, not on HTTP error statuses: a 404 or 500 still fulfils, so you must check the response ok property (true for status codes in the 200s) and handle errors yourself. The body is read with another promise-returning method, most commonly json to parse JSON, or text for plain text, and these can only be read once. To send data you pass an options object with method, headers and a body, typically a JSON string. Combined with async/await and try/catch, a typical request awaits fetch, checks ok and throws if not, then awaits json. Always handle both network errors and bad statuses for robust code.',
              analogy:
                'fetch is like sending a courier: the promise resolving means the courier reached the building (you got a response), but you still must open the envelope to check it is not a rejection letter (a 404) before reading the contents (json).',
              keyPoints: [
                'fetch returns a promise resolving to a Response when headers arrive.',
                'It does not reject on HTTP errors; check response.ok yourself.',
                'Read the body with response.json or response.text, only once.',
                'Send data with an options object: method, headers, and a body string.',
              ],
              diagram: {
                type: 'mermaid',
                lines: [
                  'flowchart LR',
                  '  Call[fetch url] --> Resp[Response object]',
                  '  Resp --> Check{response ok}',
                  '  Check -->|yes| Parse[await json]',
                  '  Check -->|no| Throw[throw error]',
                ],
                caption: 'After fetch resolves, check ok before parsing the body; a bad status does not reject automatically.',
              },
              code: {
                language: 'javascript',
                lines: [
                  'async function getUser(id) {',
                  '  const res = await fetch(`/api/users/${id}`);',
                  '  if (!res.ok) throw new Error(`HTTP ${res.status}`);',
                  '  const user = await res.json();   // parse body',
                  '  return user;',
                  '}',
                ],
                explanation:
                  'The function awaits the response, throws on a non-ok status (since fetch does not), then awaits json to parse the body into an object.',
              },
              commonMistakes: [
                'Assuming fetch rejects on a 404 or 500 — it does not; you must check response.ok.',
                'Calling res.json and res.text on the same response — the body can only be read once.',
              ],
              exercises: [
                {
                  type: 'predict',
                  prompt: 'If a server returns a 500 status, does the fetch promise reject?',
                  solution: {
                    explanation:
                      'No. fetch only rejects on network failures. A 500 still fulfils with a Response whose ok is false, so you must check it yourself.',
                  },
                },
                {
                  type: 'task',
                  prompt: 'Write an async one-liner sequence that fetches \'/data\' and parses the JSON into a variable result.',
                  solution: {
                    lines: ['const res = await fetch(\'/data\');', 'const result = await res.json();'],
                    explanation:
                      'Await the fetch for the Response, then await json to read and parse the body into an object.',
                  },
                },
                {
                  type: 'quiz',
                  prompt: 'Why can you only read a Response body once?',
                  solution: {
                    explanation:
                      'The body is a stream that is consumed when read, so calling json or text a second time fails because the stream is already used.',
                  },
                },
              ],
              docs: 'https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch',
            },
          ],
        },
      ],
    },
    /* ───────────────────── LEVEL 5 — THE BROWSER AND OOP ───────────────────── */
    {
      level: 5,
      name: 'The browser and OOP',
      focus: 'Manipulating the page, handling errors and debugging, and modelling data with prototypes and classes',
      accent: '#eab308',
      soft: '#fef9c3',
      topics: [
        {
          id: 'js5-t0',
          name: 'The DOM and events',
          concepts: [
            {
              id: 'js5-t0-c0',
              title: 'Selecting and manipulating elements',
              summary:
                'The DOM is a live tree of objects representing the page; you select elements and change their content, attributes and styles.',
              explanation:
                'When a browser loads HTML it builds the Document Object Model (DOM), a tree of node objects that your JavaScript can read and change, and changes are reflected on screen immediately. The modern way to select elements is querySelector, which returns the first element matching a CSS selector, and querySelectorAll, which returns a static NodeList of all matches; the older getElementById and getElementsByClassName still exist. Once you have an element you can change its visible text with textContent, its HTML with innerHTML (used carefully because it can introduce security risks with untrusted data), its attributes with getAttribute and setAttribute or direct properties, and its styling either via the style property for inline styles or, preferably, by toggling classes with classList. The classList object offers add, remove, toggle and contains, which keeps styling in CSS where it belongs. Reading and writing the DOM is the foundation of all interactive web pages built without a framework.',
              analogy:
                'The DOM is like a live model of a building made of labelled blocks; querySelector finds a specific block, and you can repaint it, relabel it or swap its contents while everyone watching sees the change at once.',
              keyPoints: [
                'The DOM is a live tree of objects; editing it updates the page instantly.',
                'querySelector returns the first match; querySelectorAll returns all as a NodeList.',
                'Change content with textContent (safe) or innerHTML (careful with untrusted data).',
                'Prefer classList add/remove/toggle over setting inline styles directly.',
              ],
              code: {
                language: 'javascript',
                lines: [
                  'const title = document.querySelector(\'#title\');',
                  'title.textContent = \'Updated heading\';',
                  'title.classList.add(\'active\');',
                  'const items = document.querySelectorAll(\'.item\');',
                  'items.forEach(el => el.classList.toggle(\'done\'));',
                ],
                explanation:
                  'querySelector finds the title by id and changes its text and class. querySelectorAll returns every .item so we can toggle a class on each.',
              },
              commonMistakes: [
                'Using innerHTML with untrusted user input, opening a cross-site scripting (XSS) hole; prefer textContent.',
                'Expecting querySelectorAll to return a live array — it returns a static NodeList; convert with Array.from for array methods.',
              ],
              exercises: [
                {
                  type: 'task',
                  prompt: 'Select the element with id main and set its text to Hello.',
                  solution: {
                    lines: ['document.querySelector(\'#main\').textContent = \'Hello\';'],
                    explanation:
                      'querySelector with a CSS id selector finds the element, and textContent safely sets its visible text.',
                  },
                },
                {
                  type: 'quiz',
                  prompt: 'Why prefer textContent over innerHTML for inserting plain user text?',
                  solution: {
                    explanation:
                      'textContent treats the value as plain text, while innerHTML parses it as HTML, so untrusted input in innerHTML can inject and run malicious scripts (XSS).',
                  },
                },
                {
                  type: 'predict',
                  prompt: 'Does querySelectorAll return a live collection that updates as the DOM changes?',
                  solution: {
                    explanation:
                      'No. It returns a static NodeList captured at call time; later DOM changes are not reflected in it.',
                  },
                },
              ],
              docs: 'https://developer.mozilla.org/en-US/docs/Web/API/Document_object_model/Introduction',
            },
            {
              id: 'js5-t0-c1',
              title: 'Creating and removing nodes',
              summary:
                'Build new elements with createElement, configure them, then attach them to the page with append, and remove them with remove.',
              explanation:
                'Beyond editing existing elements, you can build the page dynamically. document.createElement makes a new, detached element that exists only in memory until you insert it. You configure it by setting textContent, attributes and classes, then attach it to the tree with methods like append (adds at the end, accepting multiple nodes or strings), prepend (adds at the start), or before and after relative to a sibling. The older appendChild still works for a single node. To remove an element, call its remove method, which is far cleaner than the old parent.removeChild approach. When adding many elements in a loop, performance improves if you build them into a DocumentFragment first and insert the fragment once, so the browser reflows the layout a single time rather than on every insertion. Cloning with cloneNode duplicates an element. These operations let you render lists, modals and any content from data entirely in JavaScript.',
              analogy:
                'createElement is carving a new block off to the side; appending is fitting it into the live building; a DocumentFragment is a tray where you assemble many blocks before sliding them all into place at once.',
              keyPoints: [
                'createElement makes a detached element you configure before inserting.',
                'append, prepend, before and after place nodes; remove deletes one.',
                'append accepts multiple nodes and strings; appendChild takes a single node.',
                'Batch many insertions with a DocumentFragment to reduce reflows.',
              ],
              code: {
                language: 'javascript',
                lines: [
                  'const li = document.createElement(\'li\');',
                  'li.textContent = \'New item\';',
                  'li.classList.add(\'item\');',
                  'document.querySelector(\'#list\').append(li);',
                  '// later, remove it:',
                  'li.remove();',
                ],
                explanation:
                  'We create a list item, set its text and class, append it to the list, and later remove it directly with its own remove method.',
              },
              commonMistakes: [
                'Forgetting that a created element is detached until you append it, so it is invisible until inserted.',
                'Inserting many nodes one at a time in a tight loop instead of batching with a fragment.',
              ],
              exercises: [
                {
                  type: 'task',
                  prompt: 'Create a paragraph with the text Hi and append it to the body.',
                  solution: {
                    lines: ['const p = document.createElement(\'p\');', 'p.textContent = \'Hi\';', 'document.body.append(p);'],
                    explanation:
                      'createElement makes the paragraph, textContent sets its text, and append attaches it to the body so it appears.',
                  },
                },
                {
                  type: 'predict',
                  prompt: 'After const el = document.createElement(\'div\'); does the div appear on the page?',
                  solution: {
                    explanation:
                      'No. It is created in memory but detached; it only appears once you insert it into the DOM with append or a similar method.',
                  },
                },
                {
                  type: 'quiz',
                  prompt: 'Why use a DocumentFragment when adding many elements?',
                  solution: {
                    explanation:
                      'Building nodes into a fragment and inserting it once lets the browser reflow and repaint a single time instead of on every individual insertion, improving performance.',
                  },
                },
              ],
              docs: 'https://developer.mozilla.org/en-US/docs/Web/API/Document/createElement',
            },
            {
              id: 'js5-t0-c2',
              title: 'Event listeners, bubbling and delegation',
              summary:
                'addEventListener responds to user actions; events bubble up the tree, which event delegation exploits to handle many elements with one listener.',
              explanation:
                'Interactivity comes from events. addEventListener attaches a handler to an element for an event type like click, input or submit, and you can attach many handlers and later detach with removeEventListener. The handler receives an event object describing what happened, with properties like target (the element that triggered it) and methods like preventDefault to stop default behaviour (such as a form submitting and reloading the page) and stopPropagation to halt further travel. Most events bubble: after firing on the target they travel upward through each ancestor, so a click on a button also reaches its parent and the document. Event delegation uses this deliberately: instead of attaching a listener to every item in a list, you attach one listener to the parent and inspect event.target to find which child was clicked. This is efficient, uses less memory, and automatically works for elements added later. Understanding bubbling and delegation is key to clean, scalable event handling.',
              analogy:
                'Bubbling is like a sound rising from a room up through each floor of a building; delegation is putting one receptionist on the ground floor to handle everyone instead of a guard at every single door.',
              keyPoints: [
                'addEventListener attaches handlers; removeEventListener detaches them.',
                'The event object has target, and preventDefault and stopPropagation methods.',
                'Most events bubble from the target up through its ancestors.',
                'Delegation: one listener on a parent handles many children via event.target.',
              ],
              diagram: {
                type: 'mermaid',
                lines: [
                  'flowchart TD',
                  '  Button[Clicked button] --> List[Parent list]',
                  '  List --> Body[Body]',
                  '  Body --> Doc[Document]',
                ],
                caption: 'A click bubbles from the target up through each ancestor, which delegation uses to catch events on a parent.',
              },
              code: {
                language: 'javascript',
                lines: [
                  'const list = document.querySelector(\'#list\');',
                  'list.addEventListener(\'click\', (event) => {',
                  '  if (event.target.matches(\'li\')) {',
                  '    console.log(\'Clicked item:\', event.target.textContent);',
                  '  }',
                  '});',
                ],
                explanation:
                  'One listener on the list catches clicks bubbling up from any li. event.target identifies the actual clicked item, so new items work automatically.',
              },
              commonMistakes: [
                'Attaching a separate listener to every item instead of delegating to a shared parent.',
                'Forgetting preventDefault on a form submit, causing an unwanted page reload.',
              ],
              exercises: [
                {
                  type: 'task',
                  prompt: 'Add a click listener to the button with id save that logs Saved.',
                  solution: {
                    lines: ['document.querySelector(\'#save\').addEventListener(\'click\', () => console.log(\'Saved\'));'],
                    explanation:
                      'addEventListener registers the arrow function to run on each click of the save button.',
                  },
                },
                {
                  type: 'quiz',
                  prompt: 'What is event delegation and why is it useful?',
                  solution: {
                    explanation:
                      'Attaching one listener to a parent and using event.target to identify the clicked child. It uses less memory, simplifies code, and automatically handles elements added later.',
                  },
                },
                {
                  type: 'predict',
                  prompt: 'If you click a button inside a div that both have click listeners, which fires first and why?',
                  solution: {
                    explanation:
                      'The button listener fires first, then the event bubbles up and the div listener fires, because events bubble from the target upward through ancestors.',
                  },
                },
              ],
              docs: 'https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener',
            },
          ],
        },
        {
          id: 'js5-t1',
          name: 'Errors, debugging and patterns',
          concepts: [
            {
              id: 'js5-t1-c0',
              title: 'Error types and the Error object',
              summary:
                'JavaScript has built-in error types, all based on the Error object, which carries a name, message and stack trace.',
              explanation:
                'When something goes wrong, JavaScript creates an error object describing the problem. The base type is Error, and several subtypes signal specific failures: TypeError when a value is the wrong type or you call something that is not a function, ReferenceError when you use a variable that does not exist, SyntaxError when code cannot be parsed, and RangeError for values outside an allowed range. Every error object has a name (like TypeError), a message describing what happened, and a stack property showing where it occurred, which is invaluable for debugging. You can create your own with new Error and a message, and for richer programs you can define custom error classes by extending Error, which lets you catch specific categories with instanceof. Reading the error name and message is usually the fastest route to diagnosing a bug, and the stack trace points you to the exact line and call path.',
              analogy:
                'Error types are like different warning lights on a car dashboard: each one (low fuel, engine, brakes) tells you the category of problem at a glance, and the message and stack are the detailed diagnostic readout.',
              keyPoints: [
                'All errors derive from the Error object with name, message and stack.',
                'TypeError, ReferenceError, SyntaxError and RangeError signal specific failures.',
                'Create one with new Error(message); throw it to raise it.',
                'Define custom errors by extending Error and detect them with instanceof.',
              ],
              code: {
                language: 'javascript',
                lines: [
                  'try {',
                  '  null.foo;                     // reading a property of null',
                  '} catch (err) {',
                  '  console.log(err.name);        // TypeError',
                  '  console.log(err.message);     // Cannot read properties of null',
                  '}',
                  'const custom = new Error(\'Something went wrong\');',
                ],
                explanation:
                  'Accessing a property of null throws a TypeError; the caught error exposes its name and message. You can also construct your own Error.',
              },
              commonMistakes: [
                'Throwing a string instead of an Error object, losing the stack trace and standard properties.',
                'Catching errors broadly without checking their type, hiding bugs you did not intend to handle.',
              ],
              exercises: [
                {
                  type: 'predict',
                  prompt: 'What error type results from calling a number as if it were a function, like (5)()?',
                  solution: {
                    explanation:
                      'A TypeError, because 5 is not a function and cannot be invoked.',
                  },
                },
                {
                  type: 'quiz',
                  prompt: 'What three standard properties does an Error object provide?',
                  solution: {
                    explanation:
                      'name (the error type), message (a description), and stack (the call trace showing where it occurred).',
                  },
                },
                {
                  type: 'task',
                  prompt: 'Create and store an Error with the message Invalid input.',
                  solution: {
                    lines: ['const err = new Error(\'Invalid input\');'],
                    explanation:
                      'new Error builds an error object whose message is the given text; you can then throw it or inspect it.',
                  },
                },
              ],
              docs: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error',
            },
            {
              id: 'js5-t1-c1',
              title: 'try/catch/finally and throwing',
              summary:
                'try runs risky code, catch handles any error, finally always runs, and throw raises an error to signal failure.',
              explanation:
                'The try/catch/finally statement is how synchronous code handles errors. Code in the try block runs normally until something throws; at that moment execution jumps to the catch block, which receives the error object, skipping the rest of the try. The finally block, if present, runs no matter what, whether the try succeeded, threw, or even returned, making it the right place for cleanup like closing resources. You raise an error yourself with the throw statement, which can throw any value but should throw an Error object so the stack trace and standard fields are preserved. Throwing is how functions signal that they cannot continue, letting callers decide how to respond. A key design principle is to catch errors only where you can meaningfully handle them and let others propagate up; swallowing every error or catching too broadly hides real bugs. Remember try/catch is synchronous; for promises use catch or await inside try.',
              analogy:
                'try/catch is a tightrope act with a safety net: throw is the walker deliberately jumping to the net when the rope is unsafe, catch is the net catching them, and finally is the crew that clears the stage whether the act succeeded or not.',
              keyPoints: [
                'try runs code; an error jumps execution to catch with the error object.',
                'finally always runs, even after a return or a throw; use it for cleanup.',
                'throw raises an error; prefer throwing an Error object.',
                'Catch only where you can handle it; let other errors propagate.',
              ],
              code: {
                language: 'javascript',
                lines: [
                  'function parsePositive(text) {',
                  '  const n = Number(text);',
                  '  if (Number.isNaN(n) || n < 0) throw new Error(\'Not a positive number\');',
                  '  return n;',
                  '}',
                  'try {',
                  '  console.log(parsePositive(\'-3\'));',
                  '} catch (err) {',
                  '  console.error(err.message);   // Not a positive number',
                  '}',
                ],
                explanation:
                  'parsePositive throws when the input is invalid. The caller wraps the call in try/catch and handles the thrown error gracefully.',
              },
              commonMistakes: [
                'Wrapping huge blocks in try/catch so it is unclear which line can fail.',
                'Returning inside try and forgetting that finally still runs and can override the return.',
              ],
              exercises: [
                {
                  type: 'predict',
                  prompt: 'Does the finally block run if the try block executes a return statement?',
                  solution: {
                    explanation:
                      'Yes. finally runs after the try, even when the try returns or throws, which is why it is ideal for cleanup.',
                  },
                },
                {
                  type: 'task',
                  prompt: 'Throw an Error with the message Out of range when n is greater than 100.',
                  solution: {
                    lines: ['if (n > 100) throw new Error(\'Out of range\');'],
                    explanation:
                      'throw raises the error, stopping the function and jumping to the nearest enclosing catch.',
                  },
                },
                {
                  type: 'quiz',
                  prompt: 'Why should you throw an Error object rather than a plain string?',
                  solution: {
                    explanation:
                      'An Error object carries a name, message and stack trace, which are essential for debugging; a thrown string loses all of that.',
                  },
                },
              ],
              docs: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/try...catch',
            },
            {
              id: 'js5-t1-c2',
              title: 'Debugging techniques and common pitfalls',
              summary:
                'Use console methods, breakpoints and the debugger statement to inspect running code, and learn the classic JavaScript gotchas.',
              explanation:
                'Effective debugging combines several tools. console.log is fast for printing values, while console.table, console.dir and grouping help with structured data, and console.trace prints a stack trace at a point. For deeper inspection, browser developer tools let you set breakpoints to pause execution and step through code line by line, inspecting variables in scope; the debugger statement in your code triggers a pause when dev tools are open. Beyond tools, knowing the language pitfalls saves hours. The classic is using == instead of ===: double-equals coerces types, so 0 equals an empty string and null loosely equals undefined, producing surprising matches, while triple-equals compares without coercion and is almost always what you want. Other common traps include floating-point imprecision, this changing with the call site, accidental globals from missing declarations, mutating shared arrays or objects unexpectedly, and off-by-one errors with zero-based indices. Recognising these patterns turns mysterious bugs into familiar, quickly-fixed cases.',
              analogy:
                'Debugging tools are like a mechanic putting a car on a lift and freezing the engine mid-run to inspect each moving part; knowing the common pitfalls is the experience that tells the mechanic which part usually fails first.',
              keyPoints: [
                'console.log, console.table and console.trace inspect values and call paths.',
                'Breakpoints and the debugger statement pause execution to step through code.',
                'Prefer === over == to avoid surprising coercion (0 == empty string is true).',
                'Watch for floating-point, shifting this, accidental globals and off-by-one errors.',
              ],
              code: {
                language: 'javascript',
                lines: [
                  'console.log(0 == \'\');        // true: == coerces (pitfall)',
                  'console.log(0 === \'\');       // false: === is strict (preferred)',
                  'console.log(null == undefined);  // true: a == surprise',
                  'function buggy() { debugger; return 42; } // pauses in dev tools',
                ],
                explanation:
                  'The == operator coerces, making unrelated values appear equal; === avoids this. The debugger statement pauses execution when dev tools are open.',
              },
              commonMistakes: [
                'Relying on == comparisons, which coerce and create false matches.',
                'Leaving debugger statements or noisy console.log calls in production code.',
              ],
              exercises: [
                {
                  type: 'predict',
                  prompt: 'What do 0 == \'\' and 0 === \'\' each evaluate to?',
                  solution: {
                    explanation:
                      '0 == \'\' is true because == coerces the empty string to the number 0. 0 === \'\' is false because === compares type and value with no coercion.',
                  },
                },
                {
                  type: 'quiz',
                  prompt: 'What does the debugger statement do?',
                  solution: {
                    explanation:
                      'When developer tools are open, it pauses execution at that line so you can inspect variables and step through the code.',
                  },
                },
                {
                  type: 'quiz',
                  prompt: 'Name three common JavaScript pitfalls a debugger helps you investigate.',
                  solution: {
                    explanation:
                      'Examples include == versus === coercion surprises, a shifting this value depending on call site, floating-point imprecision, accidental globals, and off-by-one index errors.',
                  },
                },
              ],
              docs: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Strict_equality',
            },
          ],
        },
        {
          id: 'js5-t2',
          name: 'Prototypes and classes',
          concepts: [
            {
              id: 'js5-t2-c0',
              title: 'Prototypal inheritance and the prototype chain',
              summary:
                'Objects inherit from other objects through a prototype link, and property lookups walk this chain until found or exhausted.',
              explanation:
                'JavaScript inheritance is prototype-based, which is different from the class-based model of many other languages. Every object has an internal link to another object called its prototype, accessible via Object.getPrototypeOf. When you read a property, the engine first checks the object itself, and if it is not there it follows the prototype link to the prototype, then that object prototype, and so on up the prototype chain until it finds the property or reaches null at the top. This is how all objects share methods: array methods like map live on Array.prototype, and every array delegates to it rather than holding its own copy. Functions used as constructors have a prototype property whose members become shared by all instances created with new. This delegation saves memory and enables inheritance: you create a chain where specialised objects fall back to more general ones. Classes, covered next, are a cleaner syntax over this very mechanism rather than a separate system.',
              analogy:
                'The prototype chain is like asking a question up a chain of mentors: if you do not know the answer you ask your mentor, who asks their mentor, until someone answers or you reach the top with no one left to ask.',
              keyPoints: [
                'Every object links to a prototype; lookups walk the chain until found or null.',
                'Shared methods live on a prototype, so instances delegate instead of copying.',
                'Array and Object methods live on Array.prototype and Object.prototype.',
                'Constructor functions share members via their prototype property.',
              ],
              diagram: {
                type: 'mermaid',
                lines: [
                  'flowchart LR',
                  '  Instance[arr instance] --> ArrayProto[Array prototype]',
                  '  ArrayProto --> ObjectProto[Object prototype]',
                  '  ObjectProto --> Null[null end of chain]',
                ],
                caption: 'A property lookup walks from the instance up the prototype chain until found or it reaches null.',
              },
              code: {
                language: 'javascript',
                lines: [
                  'const animal = { eats: true };',
                  'const dog = Object.create(animal);   // dog prototype is animal',
                  'dog.barks = true;',
                  'console.log(dog.barks);              // true (own property)',
                  'console.log(dog.eats);              // true (from prototype)',
                  'console.log(Object.getPrototypeOf(dog) === animal); // true',
                ],
                explanation:
                  'dog has its own barks but inherits eats from its prototype animal via the chain, found when dog itself lacks the property.',
              },
              commonMistakes: [
                'Confusing an object own properties with inherited ones; use hasOwnProperty to distinguish them.',
                'Modifying built-in prototypes like Array.prototype, which can break other code.',
              ],
              exercises: [
                {
                  type: 'predict',
                  prompt: 'If dog is created with Object.create(animal) and animal has eats: true, what does dog.eats return?',
                  solution: {
                    explanation:
                      'It returns true. dog has no own eats property, so the lookup follows the prototype chain to animal and finds it.',
                  },
                },
                {
                  type: 'quiz',
                  prompt: 'Where do array methods like map and filter actually live?',
                  solution: {
                    explanation:
                      'On Array.prototype. Every array delegates to it through the prototype chain instead of holding its own copies.',
                  },
                },
                {
                  type: 'predict',
                  prompt: 'What is at the very top of a normal prototype chain?',
                  solution: {
                    explanation:
                      'null. The chain typically ends at Object.prototype, whose prototype is null, stopping the lookup.',
                  },
                },
              ],
              docs: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Inheritance_and_the_prototype_chain',
            },
            {
              id: 'js5-t2-c1',
              title: 'Class syntax',
              summary:
                'The class keyword provides clean syntax for creating objects with shared methods, built on top of prototypes.',
              explanation:
                'ES2015 classes give a familiar, readable syntax for the prototype mechanism. You declare a class with the class keyword and a constructor method that runs when you create an instance with new, setting up the instance properties via this. Methods written inside the class body are placed on the prototype, so all instances share them rather than each getting a copy. You create instances with new, which builds a fresh object, links it to the class prototype, runs the constructor, and returns the object. Modern classes also support field declarations directly in the body, static methods and properties that belong to the class itself rather than instances (called via the class name), and truly private members prefixed with a hash that cannot be accessed from outside. Despite the syntax, classes are not a new object system: they are sugar over constructor functions and prototypes, so understanding prototypes makes classes far less mysterious. They are the standard way to model entities with shared behaviour in modern JavaScript.',
              analogy:
                'A class is a blueprint and new is the factory: the blueprint describes how every product is assembled (constructor) and which shared tools they all use (prototype methods), while new stamps out each individual product.',
              keyPoints: [
                'class with a constructor sets up instance properties via this.',
                'Methods in the body live on the prototype, shared by all instances.',
                'new builds an instance, links the prototype, and runs the constructor.',
                'Supports fields, static members, and private members prefixed with #.',
              ],
              code: {
                language: 'javascript',
                lines: [
                  'class Counter {',
                  '  #count = 0;                    // private field',
                  '  increment() { this.#count++; return this.#count; }',
                  '  static create() { return new Counter(); } // static method',
                  '}',
                  'const c = Counter.create();',
                  'console.log(c.increment());      // 1',
                  'console.log(c.increment());      // 2',
                ],
                explanation:
                  'The private #count is hidden from outside. increment lives on the prototype and is shared, while the static create is called on the class itself.',
              },
              commonMistakes: [
                'Forgetting new when instantiating a class, which throws in modern JavaScript.',
                'Trying to access a private # field from outside the class, which is a syntax error.',
              ],
              exercises: [
                {
                  type: 'task',
                  prompt: 'Write a class Point with a constructor taking x and y and storing them on the instance.',
                  solution: {
                    lines: ['class Point {', '  constructor(x, y) { this.x = x; this.y = y; }', '}'],
                    explanation:
                      'The constructor runs on new and assigns x and y to the new instance through this.',
                  },
                },
                {
                  type: 'predict',
                  prompt: 'Where do methods defined inside a class body live: on each instance or on the prototype?',
                  solution: {
                    explanation:
                      'On the prototype. All instances share the same method through the prototype chain rather than each holding its own copy.',
                  },
                },
                {
                  type: 'quiz',
                  prompt: 'How do you declare a private field in a modern class, and can it be read from outside?',
                  solution: {
                    explanation:
                      'Prefix the field name with a hash, like #count. It is truly private and cannot be accessed from outside the class.',
                  },
                },
              ],
              docs: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes',
            },
            {
              id: 'js5-t2-c2',
              title: 'extends, super, getters and setters',
              summary:
                'extends creates a subclass, super calls the parent constructor or methods, and getters and setters define computed properties.',
              explanation:
                'Classes support inheritance with the extends keyword, which makes one class a subclass of another, linking their prototypes so the child inherits the parent methods. Inside a subclass constructor you must call super with the parent constructor arguments before using this, because super runs the parent setup that initialises the instance. You can also call super.methodName to invoke a parent method from an overriding child method, which is how you extend rather than fully replace behaviour. Separately, getters and setters let a method look like a property: a get accessor runs when you read the property name, and a set accessor runs when you assign to it, which is perfect for computed or validated values without changing how callers use the object. Together these features let you model hierarchies of related types with shared and specialised behaviour, and expose clean property-like interfaces, all while resting on the same prototype chain underneath. This rounds out a practical object-oriented toolkit in JavaScript.',
              analogy:
                'extends is a child inheriting traits from a parent; super is the child phoning the parent to do the part only the parent knows how to do; getters and setters are a polite receptionist who computes or checks something whenever you ask for or change a value.',
              keyPoints: [
                'extends makes a subclass that inherits the parent methods.',
                'Call super(...) in a subclass constructor before using this.',
                'super.method() invokes a parent method from an override.',
                'get and set make accessors that behave like a property on read or write.',
              ],
              code: {
                language: 'javascript',
                lines: [
                  'class Animal {',
                  '  constructor(name) { this.name = name; }',
                  '  speak() { return this.name + \' makes a sound\'; }',
                  '}',
                  'class Dog extends Animal {',
                  '  speak() { return super.speak() + \' (woof)\'; }',
                  '  get label() { return \'Dog: \' + this.name; }',
                  '}',
                  'const d = new Dog(\'Rex\');',
                  'console.log(d.speak());   // Rex makes a sound (woof)',
                  'console.log(d.label);     // Dog: Rex (getter, no parentheses)',
                ],
                explanation:
                  'Dog extends Animal and overrides speak, calling super.speak to reuse the parent. The getter label is read like a property without parentheses.',
              },
              commonMistakes: [
                'Using this in a subclass constructor before calling super, which throws a ReferenceError.',
                'Calling a getter with parentheses; it is accessed like a property, not invoked.',
              ],
              exercises: [
                {
                  type: 'predict',
                  prompt: 'What happens if a subclass constructor uses this before calling super()?',
                  solution: {
                    explanation:
                      'It throws a ReferenceError. super() must run first because it initialises the instance that this refers to.',
                  },
                },
                {
                  type: 'task',
                  prompt: 'Add a getter named area to a class Square with a side property that returns side times side.',
                  solution: {
                    lines: ['get area() { return this.side * this.side; }'],
                    explanation:
                      'A getter is accessed like a property, so square.area returns the computed value without parentheses.',
                  },
                },
                {
                  type: 'quiz',
                  prompt: 'What does super.method() do inside an overriding method?',
                  solution: {
                    explanation:
                      'It calls the parent class version of that method, letting the child extend the parent behaviour instead of fully replacing it.',
                  },
                },
              ],
              docs: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes/extends',
            },
          ],
        },
      ],
    },
  ],
};

export default content;
