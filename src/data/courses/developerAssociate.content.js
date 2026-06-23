// AWS Certified Developer – Associate — course content.
// Comprehensive, developer-focused coverage of the AWS Certified Developer –
// Associate (DVA-C02) exam, organised into the four official exam domains. The
// factual material (service names and what they do) is rewritten in our own
// words for self-study; diagrams and code snippets are our own creations.
// Not affiliated with or endorsed by AWS.
//
// Exam domains & weightings (DVA-C02):
//   1. Development with AWS Services ........ 32%
//   2. Security ............................. 26%
//   3. Deployment ........................... 24%
//   4. Troubleshooting and Optimization ..... 18%

const content = {
  meta: {
    title: 'AWS Certified Developer – Associate',
    description:
      'A complete, hands-on path to the AWS Certified Developer – Associate (DVA-C02) exam: building event-driven and serverless applications (Lambda, API Gateway, DynamoDB, S3, SQS/SNS/EventBridge/Step Functions, ECS/Fargate), securing them with IAM, Cognito, KMS and Secrets Manager, deploying with CodePipeline, CloudFormation and SAM, and troubleshooting and optimising with CloudWatch, X-Ray, caching and retry strategies — with code, diagrams, quizzes and tasks.',
    schemaVersion: '1.0',
    status: 'complete',
  },
  levels: [
    /* ─────────────── DOMAIN 1 — DEVELOPMENT WITH AWS SERVICES (32%) ─────────────── */
    {
      level: 1,
      name: 'Development with AWS Services',
      focus: 'Writing application code for AWS: Lambda, API Gateway, DynamoDB, S3, decoupling with SQS/SNS/EventBridge/Step Functions, and the SDK & CLI (Domain 1 · 32%)',
      accent: '#2d6bff',
      soft: '#eaf0ff',
      topics: [
        {
          id: 'dva1-t0',
          name: 'AWS Lambda',
          concepts: [
            {
              id: 'dva1-t0-c0',
              services: [{ icon: 'lambda', label: 'AWS Lambda' }],
              title: 'Lambda fundamentals: handler, event, context, lifecycle',
              summary:
                'Lambda runs your function code in response to an event, with no servers to manage. You write a handler that receives an event object and a context object, and you pay per request plus per millisecond of execution.',
              explanation:
                'AWS Lambda is the core serverless compute service on the exam. You upload code (a deployment package), choose a runtime (Node.js, Python, Java, Go, Ruby, .NET, or a custom runtime), and Lambda invokes a single entry point called the handler whenever an event arrives. The handler receives two arguments: the event (a JSON payload describing what triggered the function — for example an S3 PutObject record or an API Gateway request) and the context (metadata such as the request id, the function name, and getRemainingTimeInMillis()). Behind the scenes Lambda manages an execution environment: on the first invocation it does a cold start (download code, start the runtime, run any initialisation code outside the handler), then keeps the environment warm to reuse for later invocations. Anything you create outside the handler — database clients, SDK clients, cached configuration — persists across warm invocations, which is the single most important performance pattern. You configure memory from 128 MB to 10240 MB; CPU and network scale proportionally with memory, so raising memory often makes a function both faster and (sometimes) cheaper. The maximum timeout is 15 minutes.',
              analogy:
                'Lambda is like a vending machine for code: you do not own or run the machine, you just drop in an event and it dispenses a result. You pay only for each item dispensed, never for the machine sitting idle.',
              keyPoints: [
                'The handler is the entry point; it receives the event (trigger payload) and context (runtime metadata).',
                'Code outside the handler runs once per cold start and is reused on warm invocations — initialise SDK clients there.',
                'Memory ranges 128 MB–10240 MB; CPU/network scale with memory. Max timeout is 15 minutes.',
                'You pay per request and per GB-second of duration; idle time costs nothing.',
                'Lambda scales horizontally automatically — one environment per concurrent invocation.',
              ],
              commonMistakes: [
                'Creating database/SDK clients inside the handler, so they are rebuilt on every invocation instead of reused across warm invocations.',
                'Expecting a function to run longer than 15 minutes — long jobs belong in Fargate, Step Functions, or Batch.',
              ],
              code: {
                language: 'json',
                lines: [
                  "exports.handler = async (event, context) => {",
                  "  // event = the trigger payload, context = runtime metadata",
                  "  console.log('request id', context.awsRequestId);",
                  "  const name = event.queryStringParameters?.name || 'world';",
                  "  return {",
                  "    statusCode: 200,",
                  "    body: JSON.stringify({ message: `hello ${name}` }),",
                  "  };",
                  "};",
                ],
                explanation:
                  'A minimal Node.js handler. It reads from the event, logs the request id from context, and returns the response shape API Gateway expects (statusCode + body).',
              },
              diagram: {
                type: 'mermaid',
                lines: [
                  'flowchart LR',
                  '  E[Event source] --> L[Lambda service]',
                  '  L --> ENV[Execution environment]',
                  '  ENV --> H[Your handler]',
                  '  ENV -.cold start.-> INIT[Init code outside handler]',
                  '  INIT --> H',
                ],
                caption: 'On a cold start Lambda runs init code outside the handler once, then reuses the warm environment for later invocations.',
              },
              exercises: [
                {
                  type: 'quiz',
                  prompt:
                    'A function opens a new database connection inside the handler on every invocation and is slow under load. What is the fix?',
                  hint: 'Where does code that survives warm invocations live?',
                  solution: {
                    explanation:
                      'Move the connection (or connection pool) creation outside the handler, in the initialisation code. It then runs once per cold start and is reused across warm invocations, cutting per-request latency.',
                  },
                },
                {
                  type: 'quiz',
                  prompt: 'A job needs to run for 40 minutes. Is Lambda a good fit, and why or why not?',
                  solution: {
                    explanation:
                      'No — Lambda has a hard 15-minute timeout. Use AWS Fargate, AWS Batch, or break the work into a Step Functions workflow of shorter Lambda steps.',
                  },
                },
                {
                  type: 'predict',
                  prompt:
                    'You raise a function from 128 MB to 512 MB. The function is CPU-bound. What likely happens to its duration and to the per-invocation cost?',
                  solution: {
                    explanation:
                      'CPU scales with memory, so a CPU-bound function usually runs several times faster. Because you are billed for GB-seconds, a 4x faster run at 4x memory can cost about the same or even less — and latency improves.',
                  },
                },
              ],
              docs: 'https://docs.aws.amazon.com/lambda/latest/dg/welcome.html',
            },
            {
              id: 'dva1-t0-c1',
              services: [{ icon: 'lambda', label: 'AWS Lambda' }, { icon: 's3', label: 'Amazon S3' }, { icon: 'sqs', label: 'Amazon SQS' }, { icon: 'dynamodb', label: 'DynamoDB' }],
              title: 'Event sources and invocation models',
              summary:
                'Lambda can be invoked synchronously, asynchronously, or by polling an event source. The model determines retry behaviour, where errors go, and how concurrency works.',
              explanation:
                'There are three invocation models, and the exam loves to test which one applies. Synchronous invocation: the caller waits for the response and handles errors itself — used by API Gateway, Application Load Balancer, and the SDK Invoke call with RequestResponse. There is no built-in retry; the client must retry. Asynchronous invocation: the caller hands the event to Lambda and returns immediately; Lambda queues the event and retries automatically (up to two more times on error) — used by S3 events, SNS, and EventBridge. Failed async events can be sent to a dead-letter queue (DLQ) or to a destination (an SQS queue, SNS topic, another Lambda, or EventBridge) on success or failure. Poll-based / event source mapping: Lambda itself polls the source and invokes your function in batches — used by SQS, Kinesis Data Streams, DynamoDB Streams, and Amazon MQ. For stream sources (Kinesis, DynamoDB Streams) ordering is preserved per shard and a poison-pill batch can block the shard unless you configure bisect-on-error or a failure destination. For SQS, partial batch failures can be reported so only the failed messages return to the queue.',
              keyPoints: [
                'Synchronous (API Gateway, ALB, Invoke RequestResponse): caller waits, caller retries; no automatic retry.',
                'Asynchronous (S3, SNS, EventBridge): event is queued, Lambda retries twice, failures go to a DLQ or destination.',
                'Poll-based / event source mapping (SQS, Kinesis, DynamoDB Streams): Lambda polls and invokes in batches.',
                'Stream sources keep order per shard; a failing record can block the shard unless you set a failure destination or bisect-on-error.',
                'Use ReportBatchItemFailures with SQS so only failed messages return to the queue, not the whole batch.',
              ],
              commonMistakes: [
                'Assuming synchronous invocations are automatically retried by Lambda — they are not; the client must retry.',
                'Forgetting that one bad record in a Kinesis/DynamoDB Streams batch can stall the whole shard.',
              ],
              diagram: {
                type: 'mermaid',
                lines: [
                  'flowchart TB',
                  '  subgraph Sync [Synchronous]',
                  '    AG[API Gateway / ALB] --> L1[Lambda]',
                  '  end',
                  '  subgraph Async [Asynchronous]',
                  '    S3E[S3 / SNS / EventBridge] --> L2[Lambda]',
                  '    L2 -.on failure.-> DLQ[[DLQ]]',
                  '  end',
                  '  subgraph Poll [Event source mapping]',
                  '    Q[SQS / Kinesis / DDB Streams] --> ESM[Lambda polls in batches] --> L3[Lambda]',
                  '  end',
                ],
                caption: 'Three invocation models: synchronous callers wait; asynchronous events are queued and retried; poll-based sources are read in batches by Lambda.',
              },
              exercises: [
                {
                  type: 'quiz',
                  prompt:
                    'An S3 PutObject event triggers a Lambda that throws an error. What happens to the event, and how do you capture failures?',
                  solution: {
                    explanation:
                      'S3 invokes Lambda asynchronously, so Lambda automatically retries up to two more times. Persistent failures can be routed to a dead-letter queue (SQS/SNS) or to an on-failure destination.',
                  },
                },
                {
                  type: 'quiz',
                  prompt:
                    'A Lambda reads from an SQS queue. One message in a batch keeps failing and the whole batch keeps coming back. How do you avoid reprocessing the good messages?',
                  hint: 'There is a function response setting for this.',
                  solution: {
                    explanation:
                      'Enable ReportBatchItemFailures and return the list of failed message ids. Only those messages return to the queue; successfully processed ones are deleted.',
                  },
                },
                {
                  type: 'quiz',
                  prompt: 'Which invocation model does API Gateway use, and who is responsible for retrying on error?',
                  solution: {
                    explanation:
                      'Synchronous (RequestResponse). API Gateway / the client is responsible for retries — Lambda does not retry synchronous invocations.',
                  },
                },
              ],
              docs: 'https://docs.aws.amazon.com/lambda/latest/dg/lambda-invocation.html',
            },
            {
              id: 'dva1-t0-c2',
              services: [{ icon: 'lambda', label: 'AWS Lambda' }],
              title: 'Packaging, layers, and environment variables',
              summary:
                'You deploy Lambda code as a zip archive or a container image, share common dependencies through layers, and pass configuration through environment variables that can be encrypted with KMS.',
              explanation:
                'A Lambda deployment package is either a .zip archive (up to 50 MB zipped for direct upload, 250 MB unzipped including layers) or a container image (up to 10 GB) from Amazon ECR. Container images suit large dependencies or teams already using Docker. Layers let you package libraries, a custom runtime, or shared code separately and attach them to many functions; a function can use up to five layers, and they are extracted into /opt. Layers reduce package size and centralise common dependencies, but they count toward the 250 MB unzipped limit. Environment variables hold configuration (an endpoint URL, a table name, a feature flag) so you do not hard-code values; they are key/value pairs available to the runtime. Lambda encrypts environment variables at rest, and you can use a customer-managed KMS key and even encrypt sensitive values so they are only decrypted in code. Reserved environment variable names (like AWS_REGION) are set by the runtime. Best practice: keep secrets in Secrets Manager or Parameter Store and read them at init time rather than baking them into variables.',
              keyPoints: [
                'Package as a .zip (50 MB zipped / 250 MB unzipped incl. layers) or a container image (up to 10 GB) from ECR.',
                'Layers package shared libraries/runtimes; up to five per function, mounted at /opt.',
                'Environment variables externalise configuration; they are encrypted at rest and can use a KMS key.',
                'Do not store real secrets in plain environment variables — use Secrets Manager / Parameter Store.',
                'The /tmp directory gives 512 MB–10 GB of ephemeral scratch space, reused across warm invocations.',
              ],
              commonMistakes: [
                'Putting database passwords directly in environment variables instead of fetching them from Secrets Manager.',
                'Exceeding the 250 MB unzipped limit because large layers count toward it — switch to a container image.',
              ],
              code: {
                language: 'bash',
                lines: [
                  '# Publish a shared dependencies layer, then attach it to a function',
                  'aws lambda publish-layer-version \\',
                  '  --layer-name common-deps \\',
                  '  --zip-file fileb://layer.zip \\',
                  '  --compatible-runtimes nodejs20.x',
                  '',
                  'aws lambda update-function-configuration \\',
                  '  --function-name orders-api \\',
                  '  --layers arn:aws:lambda:eu-west-1:111122223333:layer:common-deps:3 \\',
                  '  --environment "Variables={TABLE_NAME=orders,LOG_LEVEL=info}"',
                ],
                explanation:
                  'Publishing a layer and attaching it to a function alongside two environment variables. Layer ARNs include a version number, so updates are explicit and immutable.',
              },
              exercises: [
                {
                  type: 'quiz',
                  prompt:
                    'Five functions all bundle the same 40 MB of shared libraries, bloating each package. How do you share the libraries cleanly?',
                  solution: {
                    explanation:
                      'Publish the libraries as a Lambda layer and attach it to all five functions. The shared code is mounted at /opt and the function packages shrink.',
                  },
                },
                {
                  type: 'quiz',
                  prompt: 'Your dependencies plus model files total 2 GB. Which packaging option must you use?',
                  solution: {
                    explanation:
                      'A container image (up to 10 GB) from Amazon ECR. The .zip path is capped at 250 MB unzipped including layers.',
                  },
                },
                {
                  type: 'task',
                  prompt: 'Why should a table name be an environment variable rather than hard-coded in the handler?',
                  solution: {
                    explanation:
                      'It lets the same code run in dev/test/prod with different table names without redeploying, and keeps configuration out of source control.',
                  },
                },
              ],
              docs: 'https://docs.aws.amazon.com/lambda/latest/dg/configuration-layers.html',
            },
            {
              id: 'dva1-t0-c3',
              services: [{ icon: 'lambda', label: 'AWS Lambda' }],
              title: 'Concurrency, versions, and aliases',
              summary:
                'Concurrency controls how many invocations run at once; reserved and provisioned concurrency tune throughput and cold starts. Versions and aliases let you publish immutable snapshots and shift traffic safely.',
              explanation:
                'By default an account shares a pool of concurrent executions (1000 in a Region, raisable). Reserved concurrency caps a function at a maximum number of simultaneous executions — protecting downstream resources and guaranteeing that function a slice of the pool; setting it also prevents that function from starving others. Provisioned concurrency keeps a set number of execution environments initialised and warm, eliminating cold starts for latency-sensitive functions (you pay for it whether used or not). When concurrency is exhausted, synchronous callers get throttled (429 TooManyRequests) and asynchronous events are retried. Versions are immutable, numbered snapshots of code plus configuration; $LATEST is the mutable working copy. An alias is a named pointer to a version (for example prod -> version 7) that can also split traffic between two versions by weight — the basis for canary and linear deployments. Application Auto Scaling can scale provisioned concurrency on a schedule or by utilisation.',
              keyPoints: [
                'Default account concurrency is a shared pool (1000 per Region by default, can be increased).',
                'Reserved concurrency caps and guarantees a function\'s share; provisioned concurrency pre-warms environments to kill cold starts.',
                'Throttling: synchronous callers get 429 errors; asynchronous events are retried.',
                'Versions are immutable snapshots; $LATEST is mutable. Aliases are named pointers to versions.',
                'Weighted aliases shift a percentage of traffic between two versions — enabling canary/linear rollouts.',
              ],
              commonMistakes: [
                'Confusing reserved concurrency (a cap/guarantee on count) with provisioned concurrency (pre-warmed environments).',
                'Pointing an event source at $LATEST in production instead of a stable alias, so untested changes go live instantly.',
              ],
              diagram: {
                type: 'mermaid',
                lines: [
                  'flowchart LR',
                  '  C[Client] --> A[Alias: prod]',
                  '  A -->|90%| V7[Version 7]',
                  '  A -->|10%| V8[Version 8 canary]',
                ],
                caption: 'A weighted alias splits traffic 90/10 between two versions, letting you canary a new version before full rollout.',
              },
              exercises: [
                {
                  type: 'quiz',
                  prompt:
                    'A latency-sensitive API function suffers cold starts at peak. Which concurrency feature removes the cold starts?',
                  solution: {
                    explanation:
                      'Provisioned concurrency keeps a defined number of environments initialised and warm, so requests skip the cold start.',
                  },
                },
                {
                  type: 'quiz',
                  prompt:
                    'A function writes to a small RDS database and you must ensure it never runs more than 20 invocations at once. What do you set?',
                  solution: {
                    explanation:
                      'Reserved concurrency of 20 — it caps simultaneous executions so the function cannot overwhelm the database (and guarantees it that slice of the pool).',
                  },
                },
                {
                  type: 'predict',
                  prompt:
                    'An alias points 90% to version 5 and 10% to version 6. You invoke it many times. Roughly how does traffic split?',
                  solution: {
                    explanation:
                      'About 90% of invocations execute version 5 and 10% execute version 6. This weighted routing is how Lambda canary deployments work.',
                  },
                },
              ],
              docs: 'https://docs.aws.amazon.com/lambda/latest/dg/configuration-concurrency.html',
            },
          ],
        },
        {
          id: 'dva1-t1',
          name: 'Amazon API Gateway',
          concepts: [
            {
              id: 'dva1-t1-c0',
              services: [{ icon: 'apigateway', label: 'API Gateway' }, { icon: 'lambda', label: 'AWS Lambda' }],
              title: 'REST vs HTTP vs WebSocket APIs and integrations',
              summary:
                'API Gateway is the managed front door for your APIs. It offers REST APIs (rich features), HTTP APIs (cheaper, faster, simpler), and WebSocket APIs (two-way), and integrates with Lambda, HTTP endpoints, and other AWS services.',
              explanation:
                'Amazon API Gateway publishes, secures, and operates APIs at scale. REST APIs are the feature-rich option: request/response transformation with mapping templates, request validation, API keys and usage plans, caching, and many authorizer types. HTTP APIs are a newer, lower-cost, lower-latency option for simple Lambda or HTTP proxy backends with JWT authorizers — choose them unless you need a REST-only feature. WebSocket APIs maintain persistent two-way connections for chat or live dashboards. The most common pattern is Lambda proxy integration, where API Gateway passes the whole request to Lambda as an event and expects a response with statusCode, headers, and body — minimal configuration. Non-proxy integrations use mapping templates (Velocity / VTL) to transform requests and responses. API Gateway can also integrate directly with AWS services (for example putting a message on SQS) without any Lambda. Stages (for example dev, prod) are named deployments, each with its own settings, throttling, and stage variables.',
              keyPoints: [
                'REST APIs: full features (mapping templates, request validation, API keys/usage plans, caching).',
                'HTTP APIs: cheaper, faster, simpler — JWT authorizers, Lambda/HTTP proxy; prefer unless you need REST-only features.',
                'WebSocket APIs: persistent two-way connections (chat, live updates).',
                'Lambda proxy integration passes the whole request as the event and expects {statusCode, headers, body}.',
                'Stages are named deployments (dev/prod) with their own throttling, caching, and stage variables.',
              ],
              commonMistakes: [
                'Reaching for REST APIs by default when an HTTP API would be cheaper and faster for a simple Lambda backend.',
                'Returning a bare object from a proxy-integrated Lambda instead of the {statusCode, body} shape, causing 502 errors.',
              ],
              code: {
                language: 'json',
                lines: [
                  '{',
                  '  "statusCode": 200,',
                  '  "headers": { "Content-Type": "application/json" },',
                  '  "body": "{\\"id\\":\\"abc\\",\\"status\\":\\"created\\"}"',
                  '}',
                ],
                explanation:
                  'The exact response shape a Lambda proxy integration must return. body is a JSON string, not an object; statusCode is required.',
              },
              exercises: [
                {
                  type: 'quiz',
                  prompt:
                    'You need a low-cost, low-latency API that simply forwards requests to a Lambda and validates JWTs. Which API Gateway type?',
                  solution: {
                    explanation:
                      'An HTTP API — it is cheaper and faster than a REST API and supports JWT authorizers and Lambda proxy integration out of the box.',
                  },
                },
                {
                  type: 'quiz',
                  prompt: 'A real-time chat app needs the server to push messages to clients. Which API Gateway type supports this?',
                  solution: { explanation: 'A WebSocket API — it maintains persistent two-way connections.' },
                },
                {
                  type: 'predict',
                  prompt:
                    'A proxy-integrated Lambda returns { message: "ok" } directly. What does the client receive?',
                  solution: {
                    explanation:
                      'A 502 Bad Gateway. Proxy integrations require { statusCode, headers, body } where body is a string. The malformed response is rejected by API Gateway.',
                  },
                },
              ],
              docs: 'https://docs.aws.amazon.com/apigateway/latest/developerguide/welcome.html',
            },
            {
              id: 'dva1-t1-c1',
              services: [{ icon: 'apigateway', label: 'API Gateway' }],
              title: 'Authorization, throttling, caching, and CORS',
              summary:
                'API Gateway controls access with IAM, Cognito, or Lambda authorizers; protects backends with throttling and usage plans; speeds reads with caching; and must be configured for cross-origin browser calls (CORS).',
              explanation:
                'API Gateway supports several authorization methods. IAM authorization signs requests with SigV4 — used for service-to-service or AWS-credentialed callers. Cognito user pool authorizers validate a JWT issued by a Cognito user pool. Lambda authorizers (formerly custom authorizers) run your own function to evaluate a token or request and return an IAM policy; results can be cached by the token to avoid running it every call. For metering and monetisation, API keys plus usage plans enforce per-client rate and quota limits. Throttling protects backends: there is an account-level steady-state rate and burst limit, plus per-method limits, returning 429 Too Many Requests when exceeded. Caching (REST APIs) stores responses for a TTL keyed by request parameters, cutting backend calls and latency — you can invalidate the cache per key. CORS matters for browser clients: the browser sends an OPTIONS preflight, and your API must return the right Access-Control-Allow-* headers, which you enable per resource.',
              keyPoints: [
                'Authorization: IAM (SigV4), Cognito user pool (JWT), or Lambda authorizer (custom logic returning an IAM policy).',
                'Lambda authorizer results can be cached by token to reduce invocations.',
                'API keys + usage plans enforce per-client rate limits and quotas.',
                'Throttling returns HTTP 429; configure account-level and per-method rate/burst limits.',
                'Caching (REST APIs) serves responses for a TTL; CORS must be enabled for cross-origin browser calls.',
              ],
              commonMistakes: [
                'Treating API keys as authentication — they identify and meter callers but are not a security control on their own.',
                'Forgetting CORS, so the browser blocks the call after a failed OPTIONS preflight even though the API works in curl/Postman.',
              ],
              diagram: {
                type: 'mermaid',
                lines: [
                  'flowchart LR',
                  '  C[Client + JWT] --> A[API Gateway]',
                  '  A --> AUTH{Authorizer}',
                  '  AUTH -->|allow| B[Backend Lambda]',
                  '  AUTH -->|deny 403| X[Rejected]',
                  '  A -.429.-> T[Throttled]',
                ],
                caption: 'API Gateway evaluates an authorizer before reaching the backend and throttles callers that exceed rate limits.',
              },
              exercises: [
                {
                  type: 'quiz',
                  prompt:
                    'You issue JWTs from a Cognito user pool and want API Gateway to validate them with no custom code. Which authorizer?',
                  solution: { explanation: 'A Cognito user pool authorizer — it validates the JWT against the pool automatically.' },
                },
                {
                  type: 'quiz',
                  prompt:
                    'A browser app calls your API and works in Postman but fails in the browser with a CORS error. What did you forget?',
                  solution: {
                    explanation:
                      'CORS configuration — the API must answer the OPTIONS preflight and return Access-Control-Allow-Origin/Methods/Headers. Postman does not enforce CORS, so it appeared to work.',
                  },
                },
                {
                  type: 'quiz',
                  prompt: 'You must limit each customer to 10,000 requests per day. Which API Gateway feature?',
                  solution: { explanation: 'API keys combined with a usage plan that sets the per-client quota and rate limits.' },
                },
              ],
              docs: 'https://docs.aws.amazon.com/apigateway/latest/developerguide/apigateway-control-access-to-api.html',
            },
          ],
        },
        {
          id: 'dva1-t2',
          name: 'Amazon DynamoDB',
          concepts: [
            {
              id: 'dva1-t2-c0',
              services: [{ icon: 'dynamodb', label: 'DynamoDB' }],
              title: 'Tables, keys, and single-table data modeling',
              summary:
                'DynamoDB is a serverless NoSQL key-value/document store. Every item is addressed by a primary key — either a partition key alone or a partition key plus sort key — and good modeling means designing keys around your access patterns.',
              explanation:
                'Amazon DynamoDB stores items (rows) in tables, where each item is a set of attributes. The primary key uniquely identifies each item and decides how data is distributed. A simple primary key is just a partition key (hash key); DynamoDB hashes it to choose a physical partition. A composite primary key adds a sort key (range key), so many items can share a partition key and be ordered/queried by the sort key — this is what enables one-to-many relationships and range queries. Unlike relational databases, you do NOT model around normalised tables and joins; you model around access patterns, often collapsing many entity types into one table (single-table design) using carefully crafted key prefixes (for example USER#123 as partition key and ORDER#2024-01 as sort key). The two read operations are GetItem (one item by full key) and Query (items sharing a partition key, optionally filtered by sort-key conditions); Scan reads the whole table and should be avoided at scale. Reads are eventually consistent by default but can be strongly consistent on demand (at higher cost and not available on global secondary indexes).',
              analogy:
                'Think of the partition key as the aisle in a warehouse and the sort key as the shelf position. GetItem walks to one exact spot; Query walks one aisle and scans its shelves in order; Scan walks every aisle in the building.',
              keyPoints: [
                'Primary key is either partition key only, or partition key + sort key (composite).',
                'Model around access patterns, not normalised tables — single-table design uses key prefixes for many entity types.',
                'GetItem = one item by full key; Query = items sharing a partition key; Scan = full table (avoid at scale).',
                'Reads are eventually consistent by default; request strong consistency when you must read your own writes.',
                'Strongly consistent reads are not available on global secondary indexes.',
              ],
              commonMistakes: [
                'Using Scan with a filter expression for routine queries — it still reads the whole table and burns capacity.',
                'Choosing a low-cardinality partition key (like a status flag), creating a hot partition and throttling.',
              ],
              code: {
                language: 'json',
                lines: [
                  '{',
                  '  "PK": "USER#123",',
                  '  "SK": "ORDER#2024-06-01#A17",',
                  '  "type": "Order",',
                  '  "total": 42.50,',
                  '  "status": "shipped"',
                  '}',
                ],
                explanation:
                  'A single-table item. PK groups all of a user\'s data in one partition; SK orders and filters it (here, an order). A Query on PK = USER#123 with SK begins_with ORDER# returns just that user\'s orders.',
              },
              exercises: [
                {
                  type: 'quiz',
                  prompt:
                    'You frequently fetch all orders for a given customer, ordered by date. How should you design the key?',
                  hint: 'What groups items together, and what orders them?',
                  solution: {
                    explanation:
                      'Use the customer id as the partition key and an order date (or ORDER#date) as the sort key. A single Query on the partition key returns all the customer\'s orders, already sorted by the sort key.',
                  },
                },
                {
                  type: 'quiz',
                  prompt: 'Your code uses Scan with a filter to find items by status and it is slow and expensive. Why?',
                  solution: {
                    explanation:
                      'Scan reads every item in the table and the filter is applied after the read, so you pay for the whole table. Add a global secondary index on status and Query it instead.',
                  },
                },
                {
                  type: 'predict',
                  prompt:
                    'You write an item then immediately GetItem with default settings and do not see the new value. Why might that be?',
                  solution: {
                    explanation:
                      'Default reads are eventually consistent and may briefly return stale data. Request a strongly consistent read to guarantee you see the latest write.',
                  },
                },
              ],
              docs: 'https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/HowItWorks.CoreComponents.html',
            },
            {
              id: 'dva1-t2-c1',
              services: [{ icon: 'dynamodb', label: 'DynamoDB' }],
              title: 'Secondary indexes: LSI vs GSI',
              summary:
                'Indexes let you query by attributes other than the table\'s primary key. Local secondary indexes share the partition key but add an alternate sort key; global secondary indexes use a completely different key and have their own capacity.',
              explanation:
                'A Local Secondary Index (LSI) has the same partition key as the base table but a different sort key, giving an alternative ordering within each partition. LSIs must be created at table creation time, support strongly consistent reads, and share the table\'s throughput. A Global Secondary Index (GSI) has its own partition key and (optionally) sort key — completely independent of the table key — so you can query by any attribute. GSIs can be created or deleted at any time, have their own provisioned/on-demand capacity separate from the table, and are eventually consistent only (no strongly consistent reads). Both index types let you project attributes: KEYS_ONLY (just the keys), INCLUDE (keys plus chosen attributes), or ALL (the whole item) — projecting fewer attributes costs less storage but may force a second read to fetch missing fields. The common exam decision: need a new sort order on the existing partition key and strong consistency, decided up front -> LSI; need to query on a totally different attribute, added later, with its own capacity -> GSI.',
              keyPoints: [
                'LSI: same partition key, different sort key; created at table creation; supports strong consistency; shares table throughput.',
                'GSI: different partition (and optional sort) key; create/delete anytime; own capacity; eventually consistent only.',
                'Projections: KEYS_ONLY, INCLUDE, or ALL — fewer projected attributes cost less but may need a follow-up read.',
                'Use a GSI to query by an attribute that is not the table key (for example by email or status).',
                'A GSI that is under-provisioned can throttle and back-pressure writes to the base table.',
              ],
              commonMistakes: [
                'Trying to add an LSI after the table exists — LSIs can only be defined at creation time.',
                'Expecting strongly consistent reads from a GSI — GSIs are eventually consistent only.',
              ],
              diagram: {
                type: 'mermaid',
                lines: [
                  'flowchart TB',
                  '  T[Base table<br/>PK=userId SK=date] --> LSI[LSI<br/>PK=userId SK=status]',
                  '  T --> GSI[GSI<br/>PK=email SK=date]',
                  '  LSI -.same PK, strong reads.-> T',
                  '  GSI -.new PK, own capacity.-> T',
                ],
                caption: 'An LSI reuses the partition key with a new sort key; a GSI introduces an entirely new key with its own throughput.',
              },
              exercises: [
                {
                  type: 'quiz',
                  prompt:
                    'A live table needs a new query by an attribute that is not the primary key. Which index type can you add now, and what consistency does it offer?',
                  solution: {
                    explanation:
                      'A global secondary index (GSI) — it can be added to an existing table, has its own capacity, and is eventually consistent only.',
                  },
                },
                {
                  type: 'quiz',
                  prompt:
                    'You need an alternate sort order within each partition and require strongly consistent reads. Which index, and what is the catch?',
                  solution: {
                    explanation:
                      'A local secondary index (LSI). The catch is it must be created when the table is created — you cannot add it later.',
                  },
                },
                {
                  type: 'quiz',
                  prompt: 'Why might a GSI with KEYS_ONLY projection force a second request?',
                  solution: {
                    explanation:
                      'KEYS_ONLY stores only the key attributes, so to read other fields you must do a follow-up GetItem on the base table. Use INCLUDE or ALL to project the attributes you read often.',
                  },
                },
              ],
              docs: 'https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/SecondaryIndexes.html',
            },
            {
              id: 'dva1-t2-c2',
              services: [{ icon: 'dynamodb', label: 'DynamoDB' }, { icon: 'elasticache', label: 'DynamoDB DAX' }],
              title: 'Capacity modes, DAX caching, and DynamoDB Streams',
              summary:
                'DynamoDB capacity is provisioned (with auto scaling and burst) or on-demand. DAX is an in-memory cache for microsecond reads, and Streams emit an ordered change log you can process with Lambda.',
              explanation:
                'Throughput is measured in capacity units. One read capacity unit (RCU) is one strongly consistent read per second of up to 4 KB (two eventually consistent reads); one write capacity unit (WCU) is one write per second of up to 1 KB. In provisioned mode you set RCUs/WCUs (optionally with auto scaling) and benefit from burst capacity; exceeding capacity causes ProvisionedThroughputExceededException, which the SDK retries with exponential backoff. On-demand mode requires no capacity planning and bills per request — ideal for spiky or unknown traffic. DAX (DynamoDB Accelerator) is a fully managed, write-through, in-memory cache that sits in front of the table, turning millisecond reads into microsecond reads for read-heavy, eventually-consistent workloads — it caches GetItem/Query/Scan results but is not for strongly consistent reads. DynamoDB Streams capture an ordered, time-ordered sequence of item-level changes (24-hour retention). You can configure the view type (KEYS_ONLY, NEW_IMAGE, OLD_IMAGE, NEW_AND_OLD_IMAGES) and trigger a Lambda via an event source mapping to build real-time reactions, aggregations, or replication. Global tables use Streams under the hood for multi-region, multi-active replication.',
              keyPoints: [
                '1 RCU = one 4 KB strongly consistent read/s (or two eventually consistent); 1 WCU = one 1 KB write/s.',
                'Provisioned mode: set capacity (+ auto scaling, burst); on-demand mode: no planning, pay per request.',
                'Throttling raises ProvisionedThroughputExceededException; the SDK retries with exponential backoff.',
                'DAX: write-through microsecond read cache for read-heavy, eventually-consistent workloads (not for strong reads).',
                'Streams: 24h ordered change log; choose NEW/OLD image; trigger Lambda; powers global tables.',
              ],
              commonMistakes: [
                'Adding DAX to fix strongly consistent read latency — DAX serves cached, eventually-consistent reads.',
                'Forgetting Streams retain records for only 24 hours, so a slow/failed consumer can lose data.',
              ],
              code: {
                language: 'json',
                lines: [
                  '{',
                  '  "eventName": "INSERT",',
                  '  "dynamodb": {',
                  '    "Keys": { "PK": { "S": "USER#123" } },',
                  '    "NewImage": { "status": { "S": "active" } }',
                  '  }',
                  '}',
                ],
                explanation:
                  'A simplified DynamoDB Streams record delivered to a Lambda. eventName is INSERT/MODIFY/REMOVE; NewImage appears because the stream view type includes NEW_IMAGE.',
              },
              exercises: [
                {
                  type: 'quiz',
                  prompt:
                    'Traffic is unpredictable with sudden spikes and you do not want to manage capacity. Which capacity mode?',
                  solution: { explanation: 'On-demand mode — it scales automatically and bills per request, with no capacity planning.' },
                },
                {
                  type: 'quiz',
                  prompt:
                    'A read-heavy app does the same GetItem millions of times and needs microsecond latency. What do you add?',
                  solution: { explanation: 'DynamoDB Accelerator (DAX), an in-memory cache in front of the table.' },
                },
                {
                  type: 'task',
                  prompt: 'How would you fire a Lambda every time an item is created or updated in a table?',
                  solution: {
                    explanation:
                      'Enable DynamoDB Streams on the table (with NEW_IMAGE or NEW_AND_OLD_IMAGES) and create an event source mapping so Lambda processes the change records.',
                  },
                },
              ],
              docs: 'https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/HowItWorks.ReadWriteCapacityMode.html',
            },
          ],
        },
        {
          id: 'dva1-t3',
          name: 'Amazon S3 for developers',
          concepts: [
            {
              id: 'dva1-t3-c0',
              services: [{ icon: 's3', label: 'Amazon S3' }],
              title: 'Working with S3 from the SDK: presigned URLs and multipart upload',
              summary:
                'Developers use the SDK to read and write objects, generate presigned URLs that grant temporary direct access without sharing credentials, and use multipart upload for large objects.',
              explanation:
                'S3 stores objects in buckets and you interact with them via PutObject, GetObject, DeleteObject, and ListObjectsV2. A presigned URL is the developer\'s key tool for letting a client upload or download an object directly to/from S3 without your servers proxying the bytes and without sharing AWS credentials: you sign a URL with your own permissions and an expiry, and the holder can perform exactly that one operation (a GET to download, or a PUT to upload) until it expires. This offloads bandwidth from your application and is the standard pattern for user file uploads from a browser or mobile app. For large objects, multipart upload splits the object into parts uploaded in parallel (and retried independently), then completes into one object — recommended above 100 MB and required above 5 GB in a single PUT. S3 also supports strong read-after-write consistency for new objects, server-side encryption, and object versioning. Transfer Acceleration routes uploads through CloudFront edge locations for faster long-distance transfers.',
              keyPoints: [
                'Core operations: PutObject, GetObject, DeleteObject, ListObjectsV2.',
                'Presigned URL: time-limited, signed link letting a client GET or PUT one object directly, no shared credentials.',
                'Multipart upload: parallel parts for large objects; recommended >100 MB, required >5 GB single-PUT.',
                'S3 provides strong read-after-write consistency for new objects.',
                'Transfer Acceleration uses CloudFront edges to speed up distant uploads.',
              ],
              commonMistakes: [
                'Proxying user uploads through your Lambda/EC2 instead of issuing a presigned PUT URL straight to S3.',
                'Generating a presigned URL with a longer expiry than the credentials\' own lifetime (it stops working when the credentials expire).',
              ],
              code: {
                language: 'json',
                lines: [
                  "const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');",
                  "const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');",
                  '',
                  "const s3 = new S3Client({});",
                  "const cmd = new PutObjectCommand({ Bucket: 'uploads', Key: 'photo.jpg' });",
                  "const url = await getSignedUrl(s3, cmd, { expiresIn: 300 });",
                  "// client can now PUT the file directly to `url` for 5 minutes",
                ],
                explanation:
                  'Generating a presigned PUT URL with the AWS SDK for JavaScript v3. The client uploads directly to S3 using the URL for 300 seconds — no AWS credentials leave the server.',
              },
              diagram: {
                type: 'mermaid',
                lines: [
                  'flowchart LR',
                  '  C[Browser] -->|1 ask for URL| API[Your API]',
                  '  API -->|2 presigned PUT URL| C',
                  '  C -->|3 upload bytes direct| S3[(S3 bucket)]',
                ],
                caption: 'The app signs a URL; the browser uploads directly to S3, so application servers never handle the file bytes.',
              },
              exercises: [
                {
                  type: 'quiz',
                  prompt:
                    'Users must upload large images from the browser without your servers handling the bytes or exposing AWS keys. What do you use?',
                  solution: {
                    explanation:
                      'A presigned PUT URL — the app signs a short-lived URL and the browser uploads directly to S3.',
                  },
                },
                {
                  type: 'quiz',
                  prompt: 'You must upload a 20 GB file reliably. What S3 feature is appropriate?',
                  solution: {
                    explanation:
                      'Multipart upload — single-PUT is capped at 5 GB, and multipart uploads parts in parallel with independent retries.',
                  },
                },
                {
                  type: 'predict',
                  prompt:
                    'A Lambda using a 1-hour IAM role session signs a presigned URL valid for 6 hours. Will the URL work for the full 6 hours?',
                  solution: {
                    explanation:
                      'No. The URL is only valid while the signing credentials are valid. When the 1-hour role session expires, the URL stops working even though its own expiry is later.',
                  },
                },
              ],
              docs: 'https://docs.aws.amazon.com/AmazonS3/latest/userguide/PresignedUrlUploadObject.html',
            },
            {
              id: 'dva1-t3-c1',
              services: [{ icon: 's3', label: 'Amazon S3' }, { icon: 'lambda', label: 'AWS Lambda' }, { icon: 'eventbridge', label: 'EventBridge' }],
              title: 'S3 event notifications',
              summary:
                'S3 can emit events when objects are created, removed, or restored, delivering them to Lambda, SQS, SNS, or EventBridge to drive event-driven processing.',
              explanation:
                'S3 event notifications let an object operation trigger downstream processing — the classic example is generating a thumbnail when an image is uploaded. You configure notifications on the bucket, choosing event types (s3:ObjectCreated:*, s3:ObjectRemoved:*, s3:ObjectRestore:*, and more) and optional prefix/suffix filters (for example only objects under uploads/ that end in .jpg). Destinations are Lambda (invoked asynchronously), an SQS queue, an SNS topic, or Amazon EventBridge. EventBridge is the most flexible destination: it receives every S3 event when enabled and lets you write rich rules and fan out to many targets, with better filtering than native notifications. Native notifications can deliver to only one destination per event-type/prefix combination historically, so EventBridge is preferred when several consumers need the same events. Because the Lambda is invoked asynchronously, it gets automatic retries and can use a DLQ for failures.',
              keyPoints: [
                'Event types include ObjectCreated, ObjectRemoved, and ObjectRestore; filter by prefix and suffix.',
                'Destinations: Lambda (async), SQS, SNS, or EventBridge.',
                'EventBridge gives the richest filtering and easy fan-out to multiple targets.',
                'Lambda from S3 is asynchronous: automatic retries plus optional DLQ for failures.',
                'A common use case: image upload triggers a Lambda that creates a thumbnail.',
              ],
              commonMistakes: [
                'Expecting strict ordering or exactly-once delivery from S3 notifications — they are at-least-once and may be out of order.',
                'Configuring overlapping native notifications that conflict, instead of routing through EventBridge for multiple consumers.',
              ],
              diagram: {
                type: 'mermaid',
                lines: [
                  'flowchart LR',
                  '  U[Upload image] --> S3[(S3 bucket)]',
                  '  S3 -->|ObjectCreated| EB[EventBridge]',
                  '  EB --> L1[Thumbnail Lambda]',
                  '  EB --> L2[Indexing Lambda]',
                ],
                caption: 'An object upload emits an event that EventBridge fans out to multiple Lambda consumers.',
              },
              exercises: [
                {
                  type: 'quiz',
                  prompt:
                    'When a .jpg lands in the uploads/ prefix, you must generate a thumbnail. How do you wire this up?',
                  solution: {
                    explanation:
                      'Configure an S3 event notification for s3:ObjectCreated:* with prefix uploads/ and suffix .jpg, targeting a thumbnail-generating Lambda (or via EventBridge).',
                  },
                },
                {
                  type: 'quiz',
                  prompt: 'Three different teams each need to react to every new object in a bucket. Which destination is cleanest?',
                  solution: {
                    explanation:
                      'EventBridge — enable S3 events to EventBridge and let each team add its own rule/target, rather than fighting over single-destination native notifications.',
                  },
                },
              ],
              docs: 'https://docs.aws.amazon.com/AmazonS3/latest/userguide/NotificationHowTo.html',
            },
          ],
        },
        {
          id: 'dva1-t4',
          name: 'Decoupling & orchestration',
          concepts: [
            {
              id: 'dva1-t4-c0',
              services: [{ icon: 'sqs', label: 'Amazon SQS' }, { icon: 'sns', label: 'Amazon SNS' }],
              title: 'SQS and SNS: queues, fan-out, and the fan-out pattern',
              summary:
                'SQS is a pull-based message queue that buffers and decouples components; SNS is a push-based pub/sub topic that fans messages out to many subscribers. Combining them gives the durable fan-out pattern.',
              explanation:
                'Amazon SQS holds messages until a consumer polls and processes them. Standard queues give nearly unlimited throughput, at-least-once delivery, and best-effort ordering; FIFO queues guarantee exact ordering and exactly-once processing within a message group, at lower throughput. Key SQS mechanics for the exam: a visibility timeout hides a message from other consumers while one consumer works on it (extend it for long jobs, or the message reappears and is processed twice); long polling (WaitTimeSeconds up to 20) reduces empty receives and cost versus short polling; a message can be retained up to 14 days; and a dead-letter queue captures messages that exceed maxReceiveCount so poison messages stop blocking the queue. Amazon SNS is pub/sub: publishers send to a topic and every subscriber (Lambda, SQS, HTTP/S, email, SMS, mobile push) receives a copy. The fan-out pattern subscribes multiple SQS queues to one SNS topic so a single published event is durably buffered for several independent consumers — each queue absorbs spikes and can be processed at its own pace. SNS also supports message filtering so each subscriber only receives the messages matching its filter policy.',
              keyPoints: [
                'SQS Standard: high throughput, at-least-once, best-effort order; FIFO: exact order + exactly-once per group.',
                'Visibility timeout hides an in-flight message; too short causes duplicate processing.',
                'Long polling (WaitTimeSeconds up to 20) reduces empty receives and cost.',
                'Dead-letter queue captures messages exceeding maxReceiveCount so poison messages do not block the queue.',
                'Fan-out: one SNS topic to many SQS queues durably delivers an event to several consumers; SNS filter policies scope deliveries.',
              ],
              commonMistakes: [
                'Setting a visibility timeout shorter than the processing time, causing the same message to be handled twice.',
                'Using SNS alone for fan-out to consumers that may be down — without an SQS buffer, those messages can be lost.',
              ],
              diagram: {
                type: 'mermaid',
                lines: [
                  'flowchart LR',
                  '  P[Publisher] --> T[(SNS topic)]',
                  '  T --> Q1[[SQS queue A]]',
                  '  T --> Q2[[SQS queue B]]',
                  '  Q1 --> C1[Consumer A]',
                  '  Q2 --> C2[Consumer B]',
                ],
                caption: 'The fan-out pattern: SNS pushes one event to several SQS queues, each durably buffering it for an independent consumer.',
              },
              exercises: [
                {
                  type: 'quiz',
                  prompt:
                    'Messages are occasionally processed twice. Each takes about 90 seconds but the visibility timeout is 30 seconds. What is the cause and fix?',
                  solution: {
                    explanation:
                      'The message becomes visible again before processing finishes, so another consumer picks it up. Raise the visibility timeout above the processing time (or extend it via ChangeMessageVisibility).',
                  },
                },
                {
                  type: 'quiz',
                  prompt:
                    'A single order event must reach an inventory service, a billing service, and an analytics service, each buffered independently. What pattern?',
                  solution: {
                    explanation:
                      'Fan-out: publish to an SNS topic with three SQS queues subscribed (one per service), so each consumer processes at its own pace with its own buffer.',
                  },
                },
                {
                  type: 'quiz',
                  prompt: 'You need strict ordering and no duplicates for financial transactions. Which queue type?',
                  solution: { explanation: 'An SQS FIFO queue — exact ordering and exactly-once processing within a message group.' },
                },
              ],
              docs: 'https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/welcome.html',
            },
            {
              id: 'dva1-t4-c1',
              services: [{ icon: 'eventbridge', label: 'EventBridge' }, { icon: 'stepfunctions', label: 'Step Functions' }],
              title: 'EventBridge and Step Functions',
              summary:
                'EventBridge routes events from AWS services, SaaS apps, and your own code to targets by rule. Step Functions orchestrates multi-step workflows as a state machine with built-in retries and error handling.',
              explanation:
                'Amazon EventBridge is a serverless event bus. Events (JSON) arrive on a bus (the default bus for AWS service events, or custom/partner buses), and rules match events by pattern and route them to targets such as Lambda, SQS, SNS, Step Functions, or another bus. EventBridge adds a schema registry and the EventBridge Scheduler for cron/rate-based invocations — increasingly the recommended way to run scheduled Lambdas. Compared with CloudWatch Events (its predecessor) it adds SaaS integration and richer filtering. AWS Step Functions coordinates multiple steps into a workflow defined in Amazon States Language (JSON). Each state can be a Task (do work, often a Lambda), Choice (branch), Parallel, Map (fan out over a list), Wait, Pass, Succeed, or Fail. Step Functions provides built-in retry (with backoff) and catch error handling per state, removing the need to code orchestration logic by hand. There are two workflow types: Standard (long-running up to one year, exactly-once, full execution history — for durable business processes) and Express (high-volume, short-lived up to five minutes, at-least-once — for event processing and streaming). Use EventBridge to route and trigger; use Step Functions to sequence and recover.',
              keyPoints: [
                'EventBridge: event bus that matches events with rules and routes to targets (Lambda, SQS, SNS, Step Functions).',
                'EventBridge Scheduler is the modern way to run cron/rate-scheduled tasks.',
                'Step Functions: orchestrate workflows in Amazon States Language with Task, Choice, Parallel, Map, Wait states.',
                'Built-in per-state Retry (with backoff) and Catch handle errors without custom code.',
                'Standard workflows: long-running, exactly-once; Express workflows: high-volume, short, at-least-once.',
              ],
              commonMistakes: [
                'Hand-coding retries and branching inside one giant Lambda when Step Functions provides them declaratively.',
                'Using Standard workflows for very high-volume short events where Express would be far cheaper.',
              ],
              code: {
                language: 'json',
                lines: [
                  '{',
                  '  "StartAt": "Validate",',
                  '  "States": {',
                  '    "Validate": {',
                  '      "Type": "Task",',
                  '      "Resource": "arn:aws:lambda:...:function:validate",',
                  '      "Retry": [{ "ErrorEquals": ["States.TaskFailed"], "MaxAttempts": 3, "BackoffRate": 2 }],',
                  '      "Next": "Charge"',
                  '    },',
                  '    "Charge": { "Type": "Task", "Resource": "arn:aws:lambda:...:function:charge", "End": true }',
                  '  }',
                  '}',
                ],
                explanation:
                  'A Step Functions state machine: the Validate task retries up to three times with exponential backoff before moving to Charge — orchestration logic without custom code.',
              },
              exercises: [
                {
                  type: 'quiz',
                  prompt:
                    'You must run a Lambda every day at 02:00 UTC. What is the recommended serverless way to schedule it?',
                  solution: {
                    explanation:
                      'An EventBridge Scheduler (or EventBridge rule) with a cron expression targeting the Lambda.',
                  },
                },
                {
                  type: 'quiz',
                  prompt:
                    'An order process has validate, charge, ship, and notify steps with retries and branching. Which service orchestrates this cleanly?',
                  solution: {
                    explanation:
                      'AWS Step Functions — model each step as a state with built-in Retry/Catch and Choice branching, rather than coding it inside one Lambda.',
                  },
                },
                {
                  type: 'quiz',
                  prompt: 'You process millions of short-lived events per day and need the cheapest Step Functions option. Which workflow type?',
                  solution: { explanation: 'Express workflows — built for high-volume, short (up to 5 minute) executions at lower cost.' },
                },
              ],
              docs: 'https://docs.aws.amazon.com/step-functions/latest/dg/welcome.html',
            },
          ],
        },
        {
          id: 'dva1-t5',
          name: 'The AWS SDK & CLI',
          concepts: [
            {
              id: 'dva1-t5-c0',
              services: [{ icon: 'iam', label: 'AWS SDK & CLI' }],
              title: 'SDK basics: credentials chain, retries, and pagination',
              summary:
                'The AWS SDK and CLI find credentials through a defined provider chain, retry throttled and transient errors with exponential backoff, and page through large result sets.',
              explanation:
                'Every SDK call must be authenticated. The SDK resolves credentials through a default provider chain, checked in order: explicit credentials in code, environment variables (AWS_ACCESS_KEY_ID / AWS_SECRET_ACCESS_KEY / AWS_SESSION_TOKEN), the shared credentials/config files (~/.aws/credentials, profiles), and finally the IAM role of the compute environment (EC2 instance profile, ECS task role, or Lambda execution role). The strong best practice is to use roles, not long-lived keys, so credentials are temporary and rotated automatically. The SDK also handles transient failures: it automatically retries throttling (for example DynamoDB ProvisionedThroughputExceededException, S3 503 SlowDown) and 5xx errors using exponential backoff with jitter, up to a configurable max attempts. List operations are paginated — a response may include a continuation/next token (NextToken, LastEvaluatedKey for DynamoDB, ContinuationToken for S3) that you must pass back to get the next page; SDK paginators automate this. Region must be set (via config, environment, or code). Understanding this chain explains many "credentials not found" and "access denied" issues on the exam.',
              keyPoints: [
                'Credential provider chain: explicit code -> env vars -> shared config/profile -> instance/task/execution role.',
                'Prefer IAM roles over long-lived access keys — temporary, auto-rotated credentials.',
                'SDK auto-retries throttling and 5xx errors with exponential backoff + jitter.',
                'List APIs paginate: pass the next/continuation token (or use SDK paginators) to read all results.',
                'A Region must be configured or the call fails.',
              ],
              commonMistakes: [
                'Hard-coding access keys in code or env vars on EC2/Lambda instead of attaching a role.',
                'Reading only the first page of a List/Query result and missing items behind a continuation token.',
              ],
              code: {
                language: 'bash',
                lines: [
                  '# The CLI uses the same provider chain. A named profile overrides the default.',
                  'aws s3 ls --profile dev --region eu-west-1',
                  '',
                  '# Auto-pagination is on by default in the CLI; disable for one big page:',
                  'aws dynamodb scan --table-name orders --no-paginate',
                ],
                explanation:
                  'The CLI resolves credentials through the same chain as the SDK and paginates automatically. A profile or explicit region overrides the defaults.',
              },
              exercises: [
                {
                  type: 'quiz',
                  prompt:
                    'A Lambda gets AccessDenied calling DynamoDB. No keys are set in code or env. Where do its credentials come from, and where do you fix permissions?',
                  solution: {
                    explanation:
                      'From the Lambda execution role (last link in the provider chain). Fix the IAM policy attached to that execution role to allow the DynamoDB action.',
                  },
                },
                {
                  type: 'quiz',
                  prompt: 'Your code lists 5,000 objects but only sees 1,000. Why, and how do you read them all?',
                  solution: {
                    explanation:
                      'S3 ListObjectsV2 returns up to 1,000 keys per page. Pass the returned continuation token (or use a paginator) to fetch subsequent pages until IsTruncated is false.',
                  },
                },
                {
                  type: 'predict',
                  prompt:
                    'A DynamoDB write occasionally returns ProvisionedThroughputExceededException, yet your code has no retry logic and mostly still succeeds. Why?',
                  solution: {
                    explanation:
                      'The SDK automatically retries throttling errors with exponential backoff, so most are transparently retried before surfacing to your code.',
                  },
                },
              ],
              docs: 'https://docs.aws.amazon.com/sdkref/latest/guide/standardized-credentials.html',
            },
          ],
        },
        {
          id: 'dva1-t6',
          name: 'Containers for developers',
          concepts: [
            {
              id: 'dva1-t6-c0',
              services: [{ icon: 'ecs', label: 'Amazon ECS' }, { icon: 'fargate', label: 'AWS Fargate' }, { icon: 'beanstalk', label: 'Elastic Beanstalk' }],
              title: 'ECS, ECR, Fargate, and Elastic Beanstalk',
              summary:
                'ECR stores container images; ECS runs containers on either EC2 or serverless Fargate using task definitions; Elastic Beanstalk deploys and scales your application code without managing the orchestration yourself.',
              explanation:
                'Amazon ECR (Elastic Container Registry) is a private Docker image registry — you build an image, push it to ECR, and reference it from a task. Amazon ECS (Elastic Container Service) runs and orchestrates containers. A task definition is the blueprint (image, CPU/memory, ports, environment variables, the task role) and a service keeps a desired number of tasks running, often behind a load balancer. ECS has two launch types: EC2 (you manage the cluster of instances) and Fargate (serverless — AWS runs the containers; you just specify CPU/memory). For permissions, give the task an ECS task role (so the application code gets temporary credentials) and an execution role (so ECS can pull the image and write logs). AWS Elastic Beanstalk is a higher-level PaaS: you upload code (or a Docker image) and Beanstalk provisions the EC2/ELB/Auto Scaling, deploys it, and manages capacity and health — while you keep full access to the underlying resources. It is ideal when a team wants standard web-app deployment without hand-building infrastructure, and it supports several deployment policies covered in the Deployment domain.',
              keyPoints: [
                'ECR: private container image registry; push images and reference them from tasks.',
                'ECS task definition: image, CPU/memory, ports, env vars, task role; a service maintains desired task count.',
                'Launch types: EC2 (you manage instances) vs Fargate (serverless containers).',
                'Task role = credentials for your app code; execution role = lets ECS pull images and write logs.',
                'Elastic Beanstalk: PaaS that provisions and manages the stack from your uploaded code.',
              ],
              commonMistakes: [
                'Confusing the ECS task role (used by app code) with the execution role (used by the ECS agent to pull images/log).',
                'Choosing the EC2 launch type and managing instances when Fargate would remove that operational burden.',
              ],
              diagram: {
                type: 'mermaid',
                lines: [
                  'flowchart LR',
                  '  D[docker build] --> ECR[(Amazon ECR)]',
                  '  ECR --> TD[ECS task definition]',
                  '  TD --> SVC[ECS service on Fargate]',
                  '  ELB[Load balancer] --> SVC',
                ],
                caption: 'Build an image, push to ECR, reference it in a task definition, and run it as an ECS service on Fargate behind a load balancer.',
              },
              exercises: [
                {
                  type: 'quiz',
                  prompt:
                    'A team wants to run containers without managing any EC2 instances or clusters. Which ECS launch type?',
                  solution: { explanation: 'AWS Fargate — serverless containers; you specify CPU/memory and AWS runs them.' },
                },
                {
                  type: 'quiz',
                  prompt:
                    'Container code calls DynamoDB and gets AccessDenied. Which role do you adjust — the task role or the execution role?',
                  solution: {
                    explanation:
                      'The task role — it provides the credentials the application code uses. The execution role only lets ECS pull the image and push logs.',
                  },
                },
                {
                  type: 'quiz',
                  prompt: 'A developer wants to deploy a web app and let AWS handle the EC2, load balancer, and scaling. Which service?',
                  solution: { explanation: 'AWS Elastic Beanstalk.' },
                },
              ],
              docs: 'https://docs.aws.amazon.com/AmazonECS/latest/developerguide/Welcome.html',
            },
          ],
        },
      ],
    },

    /* ───────────────────────────── DOMAIN 2 — SECURITY (26%) ───────────────────────────── */
    {
      level: 2,
      name: 'Security',
      focus: 'Securing applications: IAM for apps, Cognito and JWTs, and encryption with KMS, Secrets Manager and Parameter Store (Domain 2 · 26%)',
      accent: '#7c4ddb',
      soft: '#f1ebfd',
      topics: [
        {
          id: 'dva2-t0',
          name: 'IAM for applications',
          concepts: [
            {
              id: 'dva2-t0-c0',
              services: [{ icon: 'iam', label: 'AWS IAM' }],
              title: 'Roles, policies, and least privilege for app code',
              summary:
                'Application code should get permissions from an IAM role, never from embedded keys. Policies are JSON documents that allow or deny actions on resources, and least privilege means granting only what the code needs.',
              explanation:
                'IAM decides who can do what. For application code the golden rule is: attach a role, do not embed keys. An EC2 instance gets an instance profile, an ECS task gets a task role, and a Lambda gets an execution role — in each case the SDK transparently obtains temporary credentials. A policy is a JSON document with statements, each having an Effect (Allow or Deny), an Action (like dynamodb:PutItem), a Resource (an ARN), and optional Condition keys. Evaluation logic to memorise: by default everything is implicitly denied; an explicit Allow grants access; and an explicit Deny always overrides any Allow. Identity-based policies attach to users/groups/roles; resource-based policies attach to a resource (an S3 bucket policy, an SQS queue policy, a Lambda resource policy) and name a principal — they are how you let another account or service invoke your resource. Conditions add fine-grained control (for example aws:SourceIp, or dynamodb:LeadingKeys to restrict a user to their own DynamoDB partition). Least privilege means starting from nothing and adding only the specific actions and resources required, scoping Resource ARNs rather than using "*".',
              keyPoints: [
                'App code gets credentials from a role: EC2 instance profile, ECS task role, Lambda execution role.',
                'Policy statement = Effect + Action + Resource (+ Condition); default is implicit deny.',
                'Explicit Deny always overrides an Allow.',
                'Identity-based policies attach to identities; resource-based policies attach to resources and name a principal.',
                'Least privilege: scope Actions and Resource ARNs tightly; avoid "*".',
              ],
              commonMistakes: [
                'Granting Action "*" or Resource "*" for convenience instead of the specific actions/ARNs needed.',
                'Forgetting a resource-based policy when one account or service must invoke another\'s resource (identity policy alone is not enough cross-account).',
              ],
              code: {
                language: 'json',
                lines: [
                  '{',
                  '  "Version": "2012-10-17",',
                  '  "Statement": [{',
                  '    "Effect": "Allow",',
                  '    "Action": ["dynamodb:GetItem", "dynamodb:PutItem"],',
                  '    "Resource": "arn:aws:dynamodb:eu-west-1:111122223333:table/orders"',
                  '  }]',
                  '}',
                ],
                explanation:
                  'A least-privilege Lambda execution-role policy allowing only get/put on one specific DynamoDB table — not the whole account.',
              },
              exercises: [
                {
                  type: 'quiz',
                  prompt:
                    'A Lambda needs to read one S3 bucket. A developer attaches AmazonS3FullAccess. What is wrong and what should they do?',
                  solution: {
                    explanation:
                      'It violates least privilege. Grant only s3:GetObject on that bucket\'s ARN (arn:aws:s3:::bucket/*) in the execution role instead of full S3 access.',
                  },
                },
                {
                  type: 'predict',
                  prompt:
                    'A role has an Allow for s3:GetObject and a separate explicit Deny for the same action. Can it read the object?',
                  solution: { explanation: 'No — an explicit Deny always overrides any Allow.' },
                },
                {
                  type: 'quiz',
                  prompt:
                    'Account A\'s Lambda must read Account B\'s S3 bucket. The Lambda\'s role allows s3:GetObject but it still fails. What is missing?',
                  solution: {
                    explanation:
                      'A resource-based policy (bucket policy) in Account B that allows Account A\'s role as a principal. Cross-account access needs permission on both sides.',
                  },
                },
              ],
              docs: 'https://docs.aws.amazon.com/IAM/latest/UserGuide/access_policies.html',
            },
            {
              id: 'dva2-t0-c1',
              services: [{ icon: 'iam', label: 'AWS STS' }],
              title: 'STS, AssumeRole, and cross-account access',
              summary:
                'AWS STS issues temporary, expiring credentials. Calling AssumeRole returns a short-lived access key, secret, and session token — the mechanism behind roles, cross-account access, and federation.',
              explanation:
                'AWS Security Token Service (STS) is the engine that issues temporary credentials. When code or a service assumes a role, STS returns three things: an access key id, a secret access key, and a session token, all valid for a configurable duration (minutes to a few hours). Those credentials cannot be used after they expire, which is why role-based access is far safer than long-lived keys. AssumeRole is the core call: the caller must have permission to assume the target role (an identity policy or the role\'s trust policy must allow it), and the target role\'s trust policy must name the caller as a trusted principal — both sides must agree. This is exactly how cross-account access works: Account B creates a role trusting Account A, and Account A\'s principal calls AssumeRole on it. Related calls include AssumeRoleWithWebIdentity (for OIDC/social or Cognito identity-pool federation) and AssumeRoleWithSAML (for enterprise SSO). The temporary credentials\' permissions are the intersection of the role\'s permissions and any session policy you pass. For the exam, remember that a role has both a permissions policy (what it can do) and a trust policy (who can assume it).',
              keyPoints: [
                'STS returns temporary credentials: access key id + secret + session token, with an expiry.',
                'AssumeRole needs two-sided agreement: caller is allowed to assume, and the role\'s trust policy trusts the caller.',
                'A role has a permissions policy (what it can do) and a trust policy (who can assume it).',
                'Cross-account: Account B\'s role trusts Account A; Account A assumes it for temporary access.',
                'AssumeRoleWithWebIdentity (OIDC/Cognito) and AssumeRoleWithSAML (enterprise SSO) handle federation.',
              ],
              commonMistakes: [
                'Setting only the permissions policy and forgetting the trust policy, so AssumeRole is denied.',
                'Trying to use temporary credentials after expiry instead of re-assuming the role.',
              ],
              diagram: {
                type: 'mermaid',
                lines: [
                  'flowchart LR',
                  '  A[Account A principal] -->|AssumeRole| STS[AWS STS]',
                  '  STS -->|temp credentials| A',
                  '  A -->|use temp creds| R[Role in Account B]',
                  '  R -.trust policy trusts A.-> A',
                ],
                caption: 'Cross-account access via STS: the role in Account B trusts Account A, which assumes it to receive temporary credentials.',
              },
              exercises: [
                {
                  type: 'quiz',
                  prompt: 'Which API call returns the temporary credentials used when assuming a role?',
                  solution: { explanation: 'sts:AssumeRole (or AssumeRoleWithWebIdentity / AssumeRoleWithSAML for federation).' },
                },
                {
                  type: 'quiz',
                  prompt:
                    'You configured a role in Account B with the right permissions, but Account A still cannot assume it. What is likely missing?',
                  solution: {
                    explanation:
                      'The role\'s trust policy does not list Account A as a trusted principal. Both the permission to assume and the trust policy must allow it.',
                  },
                },
                {
                  type: 'quiz',
                  prompt: 'Why are STS temporary credentials preferable to long-lived access keys for an EC2 app?',
                  solution: {
                    explanation:
                      'They expire automatically and are rotated by the role, so there is no long-lived secret to leak or manually rotate.',
                  },
                },
              ],
              docs: 'https://docs.aws.amazon.com/STS/latest/APIReference/welcome.html',
            },
          ],
        },
        {
          id: 'dva2-t1',
          name: 'Amazon Cognito',
          concepts: [
            {
              id: 'dva2-t1-c0',
              services: [{ icon: 'cognito', label: 'Amazon Cognito' }],
              title: 'User pools, identity pools, and JWTs',
              summary:
                'Cognito user pools are a user directory that authenticates sign-ins and issues JWTs; identity pools exchange a verified identity for temporary AWS credentials so the app can call AWS services directly.',
              explanation:
                'Amazon Cognito provides identity for application end users — the two halves are easy to confuse, and the exam tests the distinction. A user pool is a managed user directory: it handles sign-up, sign-in, password policies, MFA, and federation with social/enterprise identity providers, and on successful authentication it issues three JWTs — an ID token (claims about the user), an access token (authorize API calls), and a refresh token (get new tokens without re-login). API Gateway can validate these tokens directly with a Cognito authorizer. An identity pool (federated identities) does something different: it takes a verified identity (a Cognito user-pool token, a Google/Facebook token, or a SAML assertion) and, via STS, returns temporary AWS credentials mapped to an IAM role — letting the app call AWS services such as S3 or DynamoDB directly. The common full pattern: the user authenticates in the user pool (gets JWTs), then exchanges that token at the identity pool for AWS credentials. Identity pools support authenticated and unauthenticated (guest) roles. So: user pool = who the user is and a JWT; identity pool = temporary AWS credentials to call services.',
              analogy:
                'A user pool is the bouncer who checks your ID and stamps your hand (the JWT). The identity pool is the coat-check that takes the stamp and hands you a temporary locker key (AWS credentials) to access services inside.',
              keyPoints: [
                'User pool: user directory; handles sign-up/sign-in/MFA; issues ID, access, and refresh JWTs.',
                'API Gateway can validate user-pool JWTs with a Cognito authorizer.',
                'Identity pool: exchanges a verified identity for temporary AWS credentials (via STS) mapped to an IAM role.',
                'Typical flow: authenticate in user pool -> exchange token at identity pool -> call AWS services.',
                'Identity pools support authenticated and unauthenticated (guest) roles.',
              ],
              commonMistakes: [
                'Thinking a user pool grants AWS resource access — it authenticates and issues JWTs; identity pools grant AWS credentials.',
                'Sending a JWT directly to S3/DynamoDB — those need real AWS credentials from an identity pool, not a JWT.',
              ],
              diagram: {
                type: 'mermaid',
                lines: [
                  'flowchart LR',
                  '  U[User] -->|sign in| UP[User pool]',
                  '  UP -->|JWT id/access tokens| U',
                  '  U -->|exchange JWT| IP[Identity pool]',
                  '  IP -->|temporary AWS creds| U',
                  '  U -->|call with creds| S3[(S3 / DynamoDB)]',
                ],
                caption: 'User pool authenticates and issues JWTs; the identity pool swaps the token for temporary AWS credentials to call services.',
              },
              exercises: [
                {
                  type: 'quiz',
                  prompt:
                    'Your mobile app must let users sign in and then upload files directly to S3 using temporary AWS credentials. Which Cognito components, and in what order?',
                  solution: {
                    explanation:
                      'Authenticate in a user pool to get a JWT, then exchange that token at an identity pool for temporary AWS credentials mapped to a role that allows the S3 upload.',
                  },
                },
                {
                  type: 'quiz',
                  prompt: 'Which Cognito token does API Gateway validate to authorize an API call?',
                  solution: { explanation: 'A user-pool JWT (the ID or access token) via a Cognito user pool authorizer.' },
                },
                {
                  type: 'quiz',
                  prompt: 'You need to give anonymous guests limited read access to an S3 bucket. Which feature?',
                  solution: {
                    explanation:
                      'An identity pool with an unauthenticated (guest) role granting the limited S3 read permissions.',
                  },
                },
              ],
              docs: 'https://docs.aws.amazon.com/cognito/latest/developerguide/what-is-amazon-cognito.html',
            },
          ],
        },
        {
          id: 'dva2-t2',
          name: 'Encryption & secrets',
          concepts: [
            {
              id: 'dva2-t2-c0',
              services: [{ icon: 'kms', label: 'AWS KMS' }],
              title: 'KMS: keys, envelope encryption, and policies',
              summary:
                'AWS KMS manages encryption keys and integrates with most AWS services. It uses envelope encryption — a data key encrypts your data, and the KMS key encrypts the data key — and access is governed by a key policy.',
              explanation:
                'AWS Key Management Service (KMS) creates and controls cryptographic keys. A KMS key (formerly customer master key) can be AWS-managed (created and rotated by a service for you) or customer-managed (you control rotation, policy, and deletion). KMS keys never leave KMS unencrypted; instead KMS performs envelope encryption: when you encrypt a large object you call GenerateDataKey, which returns a plaintext data key and an encrypted copy of it. You encrypt the data locally with the plaintext data key, discard the plaintext, and store the encrypted data key alongside the ciphertext. To decrypt, you send the encrypted data key to KMS, which returns the plaintext data key to decrypt locally. This is efficient because only the small data key crosses the network, not your whole payload. Access to a KMS key is controlled by its key policy (mandatory, attached to the key) and optionally IAM policies and grants — without a key policy that allows access, even an admin cannot use the key. There is a request quota on Encrypt/Decrypt/GenerateDataKey, which is one reason envelope encryption (caching a data key) scales better than calling Encrypt for every record. Most AWS services offer one-click encryption backed by KMS, and all key usage is logged to CloudTrail.',
              keyPoints: [
                'KMS keys are AWS-managed or customer-managed; key material never leaves KMS in plaintext.',
                'Envelope encryption: GenerateDataKey returns a plaintext + encrypted data key; encrypt data locally with the plaintext key, store the encrypted one.',
                'Decrypt by sending the encrypted data key to KMS to recover the plaintext data key.',
                'Access requires the key policy (mandatory) to allow it — IAM alone is not enough.',
                'KMS API has request quotas; key usage is logged to CloudTrail.',
              ],
              commonMistakes: [
                'Assuming IAM permissions alone grant KMS access — the key policy must also allow the principal.',
                'Calling Encrypt/Decrypt on KMS for every record and hitting throttling instead of using envelope encryption with a cached data key.',
              ],
              diagram: {
                type: 'mermaid',
                lines: [
                  'flowchart LR',
                  '  APP[App] -->|GenerateDataKey| KMS[AWS KMS]',
                  '  KMS -->|plaintext + encrypted data key| APP',
                  '  APP -->|encrypt locally| DATA[(Ciphertext + encrypted data key)]',
                ],
                caption: 'Envelope encryption: KMS issues a data key; the app encrypts data locally and stores the encrypted data key with the ciphertext.',
              },
              exercises: [
                {
                  type: 'quiz',
                  prompt:
                    'You must encrypt many large files efficiently with KMS without sending each file to KMS. What technique?',
                  solution: {
                    explanation:
                      'Envelope encryption — call GenerateDataKey, encrypt the files locally with the plaintext data key, store the encrypted data key, and discard the plaintext key.',
                  },
                },
                {
                  type: 'quiz',
                  prompt:
                    'An IAM user has kms:Decrypt in their IAM policy but still gets AccessDenied using a key. Why?',
                  solution: {
                    explanation:
                      'The KMS key policy does not grant the user access. KMS requires the key policy to allow the principal, not just IAM.',
                  },
                },
                {
                  type: 'predict',
                  prompt:
                    'Under very high load, code calling kms:Encrypt directly per record starts failing intermittently. What is happening?',
                  solution: {
                    explanation:
                      'KMS request throttling — the per-second API quota is exceeded. Switch to envelope encryption and reuse/cache a data key to drastically cut KMS calls.',
                  },
                },
              ],
              docs: 'https://docs.aws.amazon.com/kms/latest/developerguide/concepts.html',
            },
            {
              id: 'dva2-t2-c1',
              services: [{ icon: 'secretsmanager', label: 'Secrets Manager' }, { icon: 'systemsmanager', label: 'Parameter Store' }],
              title: 'Secrets Manager vs Parameter Store',
              summary:
                'Both store configuration and secrets, but Secrets Manager adds built-in automatic rotation and is purpose-built for credentials, while Systems Manager Parameter Store is a cheaper, simpler hierarchical store for config and secrets.',
              explanation:
                'AWS Secrets Manager stores secrets such as database credentials, API keys, and tokens; encrypts them with KMS; controls access with IAM; and — its headline feature — can automatically rotate them on a schedule using a Lambda (with built-in rotation for RDS and other databases). It is the right choice when you need managed rotation and cross-account secret sharing, and it costs per secret per month plus per API call. AWS Systems Manager Parameter Store stores configuration data and secrets as parameters in a hierarchy (for example /myapp/prod/db-url). Standard parameters are free; SecureString parameters are encrypted with KMS. Parameter Store has no built-in rotation but is cheaper and integrates broadly. The decision rule: need automatic rotation of credentials -> Secrets Manager; need cheap, simple, hierarchical config (and possibly a few secrets) -> Parameter Store. In code you read either at Lambda init time so the value is fetched once per cold start rather than on every invocation. Both are far safer than putting secrets in plain Lambda environment variables.',
              keyPoints: [
                'Secrets Manager: KMS-encrypted secrets with built-in automatic rotation (native for RDS); cross-account sharing; paid per secret.',
                'Parameter Store: hierarchical config + secrets; standard params free; SecureString encrypts with KMS; no native rotation.',
                'Choose Secrets Manager for managed rotation; Parameter Store for cheap, simple config storage.',
                'Read secrets at Lambda init (once per cold start), not on every invocation.',
                'Both beat storing secrets in plain environment variables.',
              ],
              commonMistakes: [
                'Choosing Secrets Manager only to store static config that never rotates, paying for rotation you do not use.',
                'Storing a SecureString parameter but forgetting to grant the consumer kms:Decrypt on the key.',
              ],
              code: {
                language: 'bash',
                lines: [
                  '# Store a secret with rotation candidate (Secrets Manager)',
                  'aws secretsmanager create-secret --name prod/db --secret-string \'{"user":"app","pass":"s3cr3t"}\'',
                  '',
                  '# Store a cheap encrypted config value (Parameter Store SecureString)',
                  'aws ssm put-parameter --name /myapp/prod/api-url --type SecureString --value https://api.example.com',
                ],
                explanation:
                  'Secrets Manager for a rotatable database credential; Parameter Store SecureString for a cheaper encrypted config value.',
              },
              exercises: [
                {
                  type: 'quiz',
                  prompt:
                    'A team must store an RDS password that is automatically rotated every 30 days with no custom code. Which service?',
                  solution: { explanation: 'AWS Secrets Manager — it offers built-in automatic rotation for RDS credentials.' },
                },
                {
                  type: 'quiz',
                  prompt: 'You need cheap, hierarchical storage for many non-rotating config values, a few encrypted. Which service?',
                  solution: {
                    explanation:
                      'Systems Manager Parameter Store — standard parameters are free and SecureString encrypts the sensitive ones with KMS.',
                  },
                },
                {
                  type: 'task',
                  prompt: 'Why read a secret in the Lambda init code rather than inside the handler?',
                  solution: {
                    explanation:
                      'Init code runs once per cold start, so the secret is fetched once and reused across warm invocations — reducing latency and API calls.',
                  },
                },
              ],
              docs: 'https://docs.aws.amazon.com/secretsmanager/latest/userguide/intro.html',
            },
          ],
        },
      ],
    },

    /* ──────────────────────────── DOMAIN 3 — DEPLOYMENT (24%) ──────────────────────────── */
    {
      level: 3,
      name: 'Deployment',
      focus: 'Shipping code: CloudFormation and SAM, the CI/CD pipeline (CodeCommit/Build/Deploy/Pipeline), and deployment strategies (Domain 3 · 24%)',
      accent: '#e8862a',
      soft: '#fff1e2',
      topics: [
        {
          id: 'dva3-t0',
          name: 'Infrastructure as code',
          concepts: [
            {
              id: 'dva3-t0-c0',
              services: [{ icon: 'cloudformation', label: 'CloudFormation' }],
              title: 'CloudFormation: templates, stacks, and change sets',
              summary:
                'CloudFormation provisions AWS resources from a declarative JSON/YAML template. A stack is the set of resources from a template, and change sets preview what an update will do before you apply it.',
              explanation:
                'AWS CloudFormation is the foundational infrastructure-as-code service. You write a template in JSON or YAML describing the resources you want; CloudFormation creates and manages them as a stack, handling order and dependencies automatically. Template sections you should know: Resources (required — what to create), Parameters (inputs at deploy time), Mappings (lookup tables, for example AMI per Region), Conditions (create resources only when criteria are met), Outputs (values to export, like an endpoint URL), and intrinsic functions such as Ref (reference a parameter/resource), Fn::GetAtt (read an attribute), Fn::Sub (string substitution), and Fn::ImportValue (consume another stack\'s export). Because creation is declarative and ordered, you get repeatable, version-controlled infrastructure across accounts and Regions. When you change a template, a change set shows exactly which resources will be added, modified, or replaced before you execute — vital because some updates require replacement (and data loss). If a create/update fails, CloudFormation rolls back to the last good state by default. Nested stacks and StackSets (deploy across many accounts/Regions) help at scale, and DeletionPolicy / drift detection protect and audit live resources.',
              keyPoints: [
                'Template (JSON/YAML) declares resources; CloudFormation builds them as a stack, resolving dependencies.',
                'Sections: Resources (required), Parameters, Mappings, Conditions, Outputs.',
                'Intrinsic functions: Ref, Fn::GetAtt, Fn::Sub, Fn::ImportValue.',
                'Change sets preview adds/modifies/replacements before you execute an update.',
                'Failed updates roll back by default; StackSets deploy across accounts/Regions.',
              ],
              commonMistakes: [
                'Applying an update without a change set and unexpectedly triggering a replacement that recreates (and wipes) a resource.',
                'Hard-coding values that should be Parameters, making the template non-reusable across environments.',
              ],
              code: {
                language: 'json',
                lines: [
                  'Resources:',
                  '  AppBucket:',
                  '    Type: AWS::S3::Bucket',
                  '    Properties:',
                  '      BucketName: !Sub ${AWS::StackName}-uploads',
                  'Outputs:',
                  '  BucketName:',
                  '    Value: !Ref AppBucket',
                ],
                explanation:
                  'A minimal YAML template creating an S3 bucket whose name is derived from the stack name with Fn::Sub, and exporting the name as an output.',
              },
              exercises: [
                {
                  type: 'quiz',
                  prompt:
                    'Before applying a template update to production, you want to see exactly which resources will change or be replaced. What do you create?',
                  solution: { explanation: 'A change set — it previews the additions, modifications, and replacements before you execute.' },
                },
                {
                  type: 'quiz',
                  prompt: 'A stack update fails partway through. What does CloudFormation do by default?',
                  solution: { explanation: 'It automatically rolls back to the previous stable state.' },
                },
                {
                  type: 'task',
                  prompt: 'How do you pass an environment-specific value (like an instance size) into a template at deploy time?',
                  solution: {
                    explanation:
                      'Define it under Parameters and reference it with Ref, supplying the value when you create or update the stack.',
                  },
                },
              ],
              docs: 'https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/Welcome.html',
            },
            {
              id: 'dva3-t0-c1',
              services: [{ icon: 'cloudformation', label: 'AWS SAM' }, { icon: 'lambda', label: 'AWS Lambda' }],
              title: 'AWS SAM for serverless applications',
              summary:
                'The AWS Serverless Application Model is a CloudFormation extension with concise syntax for serverless resources, plus a CLI to build, test locally, package, and deploy functions and APIs.',
              explanation:
                'AWS SAM (Serverless Application Model) sits on top of CloudFormation and makes serverless apps far less verbose. A SAM template starts with Transform: AWS::Serverless-2016-10-31, which tells CloudFormation to expand SAM\'s shorthand resource types — AWS::Serverless::Function, AWS::Serverless::Api, AWS::Serverless::SimpleTable, AWS::Serverless::StateMachine — into the full CloudFormation resources at deploy time. A single Function resource can declare its handler, runtime, environment variables, policies, and Events (an API route, an S3 trigger, a schedule) in a few lines. The SAM CLI completes the developer loop: sam build compiles dependencies, sam local invoke / sam local start-api run functions and APIs locally in Docker for testing, sam package uploads artifacts to S3 (or ECR), and sam deploy creates/updates the stack — usually via a change set under the hood. SAM also has first-class support for safe deployments: AutoPublishAlias and DeploymentPreference integrate with CodeDeploy to do canary or linear traffic shifting on a Lambda alias automatically. Because SAM is just CloudFormation, anything CloudFormation can do works alongside it.',
              keyPoints: [
                'SAM is a CloudFormation transform (Transform: AWS::Serverless-2016-10-31) with concise serverless types.',
                'AWS::Serverless::Function declares handler, runtime, env vars, policies, and Events in a few lines.',
                'SAM CLI: sam build, sam local invoke/start-api (local Docker testing), sam package, sam deploy.',
                'DeploymentPreference + AutoPublishAlias drive CodeDeploy canary/linear Lambda rollouts.',
                'SAM expands into standard CloudFormation, so the two interoperate fully.',
              ],
              commonMistakes: [
                'Omitting the Transform line, so CloudFormation does not recognise the AWS::Serverless::* resource types.',
                'Thinking SAM is a separate engine — it is CloudFormation with macros, deployed the same way.',
              ],
              code: {
                language: 'json',
                lines: [
                  'Transform: AWS::Serverless-2016-10-31',
                  'Resources:',
                  '  OrdersFn:',
                  '    Type: AWS::Serverless::Function',
                  '    Properties:',
                  '      Handler: app.handler',
                  '      Runtime: nodejs20.x',
                  '      Events:',
                  '        Api:',
                  '          Type: Api',
                  '          Properties: { Path: /orders, Method: post }',
                ],
                explanation:
                  'A SAM function with an API event. SAM expands this into a Lambda function plus an API Gateway route and the required permissions.',
              },
              exercises: [
                {
                  type: 'quiz',
                  prompt:
                    'Which single template line tells CloudFormation to interpret AWS::Serverless::Function shorthand?',
                  solution: { explanation: 'Transform: AWS::Serverless-2016-10-31.' },
                },
                {
                  type: 'quiz',
                  prompt: 'How do you run and test a SAM Lambda locally before deploying?',
                  solution: { explanation: 'Use the SAM CLI: sam local invoke (single function) or sam local start-api (the API), which run it in Docker.' },
                },
                {
                  type: 'quiz',
                  prompt: 'Which command uploads your build artifacts and then creates/updates the stack?',
                  solution: { explanation: 'sam deploy (often preceded by sam build and sam package).' },
                },
              ],
              docs: 'https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/what-is-sam.html',
            },
          ],
        },
        {
          id: 'dva3-t1',
          name: 'CI/CD pipeline',
          concepts: [
            {
              id: 'dva3-t1-c0',
              services: [{ icon: 'systemsmanager', label: 'CodeCommit' }, { icon: 'cloudformation', label: 'CodeBuild' }],
              title: 'CodeCommit and CodeBuild',
              summary:
                'CodeCommit is a managed Git repository; CodeBuild is a managed build service that compiles code, runs tests, and produces artifacts following instructions in a buildspec file.',
              explanation:
                'The AWS developer tools form a CI/CD chain. AWS CodeCommit is a fully managed, private Git repository — push/pull with standard Git, secured by IAM, with encryption at rest. (Note: AWS now steers new customers toward third-party Git like GitHub, but CodeCommit still appears on the exam as the AWS-native source.) AWS CodeBuild is a fully managed build server: it provisions a build environment on demand, fetches your source, and runs the phases defined in a buildspec.yml file — typically install (set up runtime), pre_build (login to ECR, install deps), build (compile, run unit tests), and post_build (package, push image) — then emits artifacts to S3 and logs to CloudWatch. CodeBuild scales automatically so you do not maintain build servers, and it bills per build minute. The buildspec also defines artifacts (what files to keep) and can cache dependencies to speed builds. Environment variables (including secrets pulled from Secrets Manager/Parameter Store) configure the build. Together CodeCommit triggers a build in CodeBuild, which produces the artifact that later stages deploy.',
              keyPoints: [
                'CodeCommit: managed private Git repo, IAM-secured, encrypted at rest.',
                'CodeBuild: managed, auto-scaling build service billed per build minute.',
                'buildspec.yml phases: install, pre_build, build, post_build; plus artifacts and cache.',
                'CodeBuild logs to CloudWatch and outputs artifacts to S3.',
                'Build env vars can pull secrets from Secrets Manager / Parameter Store.',
              ],
              commonMistakes: [
                'Putting build secrets directly in the buildspec instead of referencing Secrets Manager / Parameter Store.',
                'Expecting CodeBuild to deploy — it builds and tests; deployment is CodeDeploy/CloudFormation\'s job.',
              ],
              code: {
                language: 'json',
                lines: [
                  'version: 0.2',
                  'phases:',
                  '  install:',
                  '    runtime-versions: { nodejs: 20 }',
                  '  build:',
                  '    commands:',
                  '      - npm ci',
                  '      - npm test',
                  '      - npm run build',
                  'artifacts:',
                  '  files: [ "**/*" ]',
                  '  base-directory: dist',
                ],
                explanation:
                  'A buildspec.yml: install Node 20, run install/test/build commands, then package everything under dist as the build artifact.',
              },
              exercises: [
                {
                  type: 'quiz',
                  prompt: 'Which file tells CodeBuild what commands to run during the build, and where does it look for it?',
                  solution: { explanation: 'buildspec.yml, located in the root of the source by default (the location can be overridden).' },
                },
                {
                  type: 'quiz',
                  prompt: 'A build needs a database password. How should you supply it securely?',
                  solution: {
                    explanation:
                      'Reference it from Secrets Manager or Parameter Store via the build environment variables, not in plaintext in the buildspec.',
                  },
                },
                {
                  type: 'task',
                  prompt: 'Where do CodeBuild logs and output artifacts go?',
                  solution: { explanation: 'Logs go to Amazon CloudWatch Logs; artifacts are written to Amazon S3.' },
                },
              ],
              docs: 'https://docs.aws.amazon.com/codebuild/latest/userguide/welcome.html',
            },
            {
              id: 'dva3-t1-c1',
              services: [{ icon: 'systemsmanager', label: 'CodeDeploy' }, { icon: 'systemsmanager', label: 'CodePipeline' }],
              title: 'CodeDeploy and CodePipeline',
              summary:
                'CodeDeploy automates deployments to EC2/on-prem, Lambda, and ECS using an appspec file and lifecycle hooks; CodePipeline is the orchestrator that connects source, build, and deploy stages into an automated release pipeline.',
              explanation:
                'AWS CodeDeploy automates pushing a new version of an application to compute targets. It works in three flavours: EC2/on-premises (in-place or blue/green using deployment groups and an agent), AWS Lambda (shifting traffic on an alias), and Amazon ECS (blue/green task sets). The appspec file (appspec.yml for EC2/ECS, JSON for Lambda) defines what to deploy and the lifecycle hooks — scripts that run at defined stages such as BeforeInstall, AfterInstall, ApplicationStart, and ValidateService — letting you run validations and halt/roll back on failure. Deployment configurations control the pace (all-at-once, canary, linear), and CodeDeploy can automatically roll back on alarm or failed hook. AWS CodePipeline is the orchestrator that ties everything together: it models a release as ordered stages (for example Source -> Build -> Deploy), each with actions, and runs automatically whenever the source changes. A pipeline integrates CodeCommit/GitHub/S3 (source), CodeBuild (build/test), manual approval actions, and CodeDeploy/CloudFormation/ECS (deploy). Stages pass artifacts along, and a failed stage stops the pipeline. Together: CodePipeline orchestrates; CodeBuild builds; CodeDeploy deploys with controlled rollout and rollback.',
              keyPoints: [
                'CodeDeploy targets: EC2/on-prem, Lambda, and ECS; supports in-place and blue/green.',
                'appspec file + lifecycle hooks (BeforeInstall, AfterInstall, ValidateService) run validation and enable rollback.',
                'Deployment configs set pace: all-at-once, canary, linear; auto-rollback on alarm or failed hook.',
                'CodePipeline orchestrates ordered stages (Source -> Build -> Deploy) and runs on source change.',
                'Pipelines pass artifacts between stages; a failed stage stops the pipeline; manual approval actions are supported.',
              ],
              commonMistakes: [
                'Confusing CodeBuild (build/test) with CodeDeploy (push to targets) and CodePipeline (orchestrate the whole flow).',
                'Forgetting that CodeDeploy on EC2 needs the CodeDeploy agent installed on the instances.',
              ],
              diagram: {
                type: 'mermaid',
                lines: [
                  'flowchart LR',
                  '  SRC[Source<br/>CodeCommit/GitHub] --> B[Build<br/>CodeBuild]',
                  '  B --> AP[Manual approval]',
                  '  AP --> DEP[Deploy<br/>CodeDeploy/CloudFormation]',
                ],
                caption: 'A CodePipeline release: source change triggers a build, an optional approval gate, then a controlled deployment.',
              },
              exercises: [
                {
                  type: 'quiz',
                  prompt:
                    'Which service orchestrates source, build, and deploy stages into one automated release that runs on every commit?',
                  solution: { explanation: 'AWS CodePipeline.' },
                },
                {
                  type: 'quiz',
                  prompt:
                    'You need to run a validation script after installing a new version on EC2 and roll back if it fails. Which CodeDeploy feature?',
                  solution: {
                    explanation:
                      'Lifecycle hooks defined in the appspec file (for example AfterInstall / ValidateService), combined with automatic rollback on a failed hook.',
                  },
                },
                {
                  type: 'quiz',
                  prompt: 'CodeDeploy to EC2 fails to start on the instances. What is a likely prerequisite you missed?',
                  solution: { explanation: 'The CodeDeploy agent is not installed/running on the EC2 instances.' },
                },
              ],
              docs: 'https://docs.aws.amazon.com/codedeploy/latest/userguide/welcome.html',
            },
          ],
        },
        {
          id: 'dva3-t2',
          name: 'Deployment strategies',
          concepts: [
            {
              id: 'dva3-t2-c0',
              services: [{ icon: 'lambda', label: 'AWS Lambda' }, { icon: 'beanstalk', label: 'Elastic Beanstalk' }],
              title: 'Blue/green, canary, linear, rolling, and all-at-once',
              summary:
                'Deployment strategies trade speed against risk. Blue/green swaps to a parallel environment; canary and linear shift traffic gradually; rolling replaces instances in batches; all-at-once is fastest but riskiest.',
              explanation:
                'The exam expects you to match a strategy to a requirement. All-at-once deploys the new version to everything simultaneously — fastest and cheapest, but it causes downtime and a full-blast blast radius if the version is bad. Rolling updates a subset (a batch) of instances at a time, keeping the rest serving the old version; rolling with additional batch adds temporary extra capacity so you never drop below full capacity during the update. Blue/green stands up a complete new (green) environment alongside the old (blue), tests it, then switches traffic over (for example by swapping a Route 53 record, an Elastic Beanstalk environment URL, or a Lambda alias); rollback is instant because blue is still running, at the cost of running two environments briefly. Canary shifts a small percentage of traffic to the new version first (for example 10%), watches metrics/alarms, then promotes the rest if healthy. Linear shifts traffic in equal increments on a schedule (for example +10% every minute). For Lambda and ECS, CodeDeploy implements canary and linear by adjusting a weighted alias or task set, with automatic rollback on a CloudWatch alarm. Elastic Beanstalk offers all-at-once, rolling, rolling with additional batch, and immutable (blue/green-style) policies. Choose blue/green or canary when you need fast, low-risk rollback; choose all-at-once only when brief downtime is acceptable.',
              keyPoints: [
                'All-at-once: fastest, cheapest, but downtime and full blast radius on failure.',
                'Rolling / rolling with additional batch: update in batches; the extra batch avoids capacity loss.',
                'Blue/green: parallel new environment, switch traffic over, instant rollback (two environments briefly).',
                'Canary: small traffic percentage first, then promote; linear: equal increments on a schedule.',
                'CodeDeploy automates canary/linear for Lambda/ECS with auto-rollback on a CloudWatch alarm.',
              ],
              commonMistakes: [
                'Confusing canary (small % first, then jump) with linear (equal steps over time).',
                'Choosing all-at-once for a workload that cannot tolerate any downtime.',
              ],
              diagram: {
                type: 'mermaid',
                lines: [
                  'flowchart LR',
                  '  V1[Version 1<br/>100%] -->|canary| C[10% to V2]',
                  '  C -->|healthy| P[Promote V2<br/>100%]',
                  '  C -->|alarm| RB[Rollback to V1]',
                ],
                caption: 'A canary deployment shifts a small slice to the new version, then promotes it or rolls back based on alarms.',
              },
              exercises: [
                {
                  type: 'quiz',
                  prompt:
                    'You need to deploy with zero downtime and be able to roll back instantly by flipping traffic back. Which strategy?',
                  solution: {
                    explanation:
                      'Blue/green — a parallel new environment receives traffic on cutover, and rollback is instant because the old environment is still running.',
                  },
                },
                {
                  type: 'quiz',
                  prompt:
                    'You want 10% of users on the new Lambda version, monitored for errors, then the rest if healthy. Which strategy, and what triggers rollback?',
                  solution: {
                    explanation:
                      'A canary deployment via CodeDeploy on the Lambda alias; a CloudWatch alarm during the canary triggers automatic rollback.',
                  },
                },
                {
                  type: 'quiz',
                  prompt: 'Which Elastic Beanstalk policy adds temporary extra instances so capacity never drops during the deploy?',
                  solution: { explanation: 'Rolling with additional batch.' },
                },
              ],
              docs: 'https://docs.aws.amazon.com/codedeploy/latest/userguide/deployment-configurations.html',
            },
          ],
        },
      ],
    },

    /* ─────────────── DOMAIN 4 — TROUBLESHOOTING AND OPTIMIZATION (18%) ─────────────── */
    {
      level: 4,
      name: 'Troubleshooting & Optimization',
      focus: 'Finding and fixing problems and making apps faster and cheaper: CloudWatch, X-Ray, logs, caching, and retries with backoff (Domain 4 · 18%)',
      accent: '#1ba85a',
      soft: '#e6f7ee',
      topics: [
        {
          id: 'dva4-t0',
          name: 'Observability',
          concepts: [
            {
              id: 'dva4-t0-c0',
              services: [{ icon: 'cloudwatch', label: 'CloudWatch' }],
              title: 'CloudWatch metrics, logs, alarms, and custom metrics',
              summary:
                'CloudWatch collects metrics, stores logs, and fires alarms. Developers emit custom metrics and structured logs, set alarms on thresholds, and use Logs Insights to query at scale.',
              explanation:
                'Amazon CloudWatch is the primary monitoring service for troubleshooting. Metrics are time-ordered data points (CPU, invocations, errors, latency); AWS services publish standard metrics, and you publish custom metrics with PutMetricData, optionally at high resolution (down to one second) and with dimensions to slice the data. The Embedded Metric Format (EMF) lets a Lambda emit metrics simply by logging a specially structured JSON line. CloudWatch Logs collects application and service logs into log groups and log streams — Lambda automatically sends stdout/stderr there (the function\'s execution role needs logs:CreateLogStream and logs:PutLogEvents). Logs Insights runs queries across log groups to find errors or patterns quickly. CloudWatch Alarms watch a metric against a threshold over evaluation periods and move between OK / ALARM / INSUFFICIENT_DATA, triggering actions: notify via SNS, trigger Auto Scaling, or drive a CodeDeploy rollback. A metric filter turns matching log patterns (for example the word ERROR) into a metric you can alarm on. For the exam: metrics tell you what is happening, logs tell you why, and alarms turn a threshold breach into an automated action.',
              keyPoints: [
                'Metrics: standard (published by services) and custom (PutMetricData) with dimensions; EMF emits metrics from logs.',
                'CloudWatch Logs: log groups/streams; Lambda auto-logs if its role has logs permissions.',
                'Logs Insights queries log groups to find errors and patterns fast.',
                'Alarms compare a metric to a threshold and act (SNS notify, Auto Scaling, CodeDeploy rollback).',
                'Metric filters convert matching log lines (e.g. ERROR) into alarmable metrics.',
              ],
              commonMistakes: [
                'A Lambda produces no logs because its execution role lacks logs:CreateLogStream / logs:PutLogEvents.',
                'Expecting a memory metric for EC2 by default — that needs the CloudWatch agent (memory is not a default EC2 metric).',
              ],
              code: {
                language: 'bash',
                lines: [
                  '# Publish a custom business metric',
                  'aws cloudwatch put-metric-data \\',
                  '  --namespace MyApp \\',
                  '  --metric-name OrdersProcessed \\',
                  '  --value 1 \\',
                  '  --dimensions Environment=prod',
                ],
                explanation:
                  'Emitting a custom metric with a dimension. You can then graph OrdersProcessed and alarm on it per environment.',
              },
              exercises: [
                {
                  type: 'quiz',
                  prompt: 'A new Lambda produces no CloudWatch logs at all. What is the most likely cause?',
                  solution: {
                    explanation:
                      'Its execution role lacks CloudWatch Logs permissions (logs:CreateLogGroup/CreateLogStream/PutLogEvents). Without them Lambda cannot write logs.',
                  },
                },
                {
                  type: 'quiz',
                  prompt: 'You want an alert whenever your application logs the word ERROR more than 5 times in a minute. How?',
                  solution: {
                    explanation:
                      'Create a CloudWatch Logs metric filter matching ERROR, then a CloudWatch alarm on that metric with a threshold of 5 over one minute, notifying via SNS.',
                  },
                },
                {
                  type: 'task',
                  prompt: 'How do you track a business KPI like orders-per-minute in CloudWatch?',
                  solution: {
                    explanation:
                      'Publish a custom metric with PutMetricData (or via EMF in logs), then dashboard and alarm on it.',
                  },
                },
              ],
              docs: 'https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/WhatIsCloudWatch.html',
            },
            {
              id: 'dva4-t0-c1',
              services: [{ icon: 'cloudwatch', label: 'AWS X-Ray' }],
              title: 'AWS X-Ray distributed tracing',
              summary:
                'X-Ray traces a request as it flows through a distributed application, building a service map and timing each segment so you can find bottlenecks, errors, and high-latency dependencies.',
              explanation:
                'AWS X-Ray is the go-to tool when a request crosses several services (API Gateway -> Lambda -> DynamoDB -> downstream API) and you need to know where the time or errors go. X-Ray records traces composed of segments (the work done by one service) and subsegments (calls within it, like a DynamoDB query or HTTP request), then assembles a service map showing each node\'s latency, error, and fault rates. To enable it: turn on active tracing for the Lambda/API Gateway, and instrument the code with the X-Ray SDK (or the newer OpenTelemetry-based ADOT) — wrapping the AWS SDK so calls appear as subsegments automatically, and adding custom subsegments for your own code. Lambda needs the AWSXRayDaemonWriteAccess managed policy in its execution role to send trace data. You can add annotations (indexed key/value pairs you can filter and search on) and metadata (non-indexed extra detail). Sampling rules limit how many requests are traced to control cost. The result is a visual breakdown that turns vague "the API is slow sometimes" reports into "the third-party call in subsegment X takes 800 ms on cold paths." For the exam: X-Ray = end-to-end request tracing and bottleneck/error analysis across services.',
              keyPoints: [
                'X-Ray traces a request across services as segments and subsegments, drawing a service map.',
                'Enable active tracing on Lambda/API Gateway and instrument with the X-Ray SDK (or ADOT/OpenTelemetry).',
                'Lambda needs AWSXRayDaemonWriteAccess in its execution role to send traces.',
                'Annotations are indexed/filterable; metadata is extra non-indexed detail.',
                'Sampling rules cap how many requests are traced to control cost.',
              ],
              commonMistakes: [
                'Enabling active tracing but never instrumenting the SDK, so downstream calls do not appear as subsegments.',
                'Forgetting the X-Ray write permission on the Lambda role, so no traces show up.',
              ],
              diagram: {
                type: 'mermaid',
                lines: [
                  'flowchart LR',
                  '  AG[API Gateway] --> L[Lambda]',
                  '  L --> DDB[(DynamoDB)]',
                  '  L --> EXT[External API]',
                  '  X[X-Ray service map] -.traces.-> AG',
                  '  X -.traces.-> L',
                ],
                caption: 'X-Ray stitches the request path into one trace and service map, exposing which hop adds latency or errors.',
              },
              exercises: [
                {
                  type: 'quiz',
                  prompt:
                    'A request passes through API Gateway, Lambda, and DynamoDB and is intermittently slow. Which service pinpoints the slow hop?',
                  solution: {
                    explanation:
                      'AWS X-Ray — its trace and service map show the latency of each segment/subsegment so you can see which dependency is slow.',
                  },
                },
                {
                  type: 'quiz',
                  prompt: 'You enabled X-Ray active tracing on a Lambda but see no traces. What permission is likely missing?',
                  solution: {
                    explanation:
                      'The execution role lacks AWSXRayDaemonWriteAccess (xray:PutTraceSegments / PutTelemetryRecords), so it cannot send trace data.',
                  },
                },
                {
                  type: 'quiz',
                  prompt: 'What is the difference between an X-Ray annotation and metadata?',
                  solution: {
                    explanation:
                      'Annotations are indexed key/value pairs you can filter and search traces by; metadata is extra contextual data that is not indexed/searchable.',
                  },
                },
              ],
              docs: 'https://docs.aws.amazon.com/xray/latest/devguide/aws-xray.html',
            },
          ],
        },
        {
          id: 'dva4-t1',
          name: 'Resilience & retries',
          concepts: [
            {
              id: 'dva4-t1-c0',
              services: [{ icon: 'dynamodb', label: 'DynamoDB' }, { icon: 's3', label: 'Amazon S3' }],
              title: 'Throttling, exponential backoff, and idempotency',
              summary:
                'AWS APIs throttle when you exceed limits, returning retryable errors. The correct response is to retry with exponential backoff and jitter, and to design operations to be idempotent so retries are safe.',
              explanation:
                'When you exceed a service limit you get a throttling error — for example DynamoDB ProvisionedThroughputExceededException, KMS ThrottlingException, or S3 503 SlowDown — and many transient failures return 5xx. The wrong fix is to retry immediately in a tight loop, which makes the overload worse. The right fix is exponential backoff: wait progressively longer between retries (for example 100 ms, 200 ms, 400 ms, 800 ms), and add jitter (randomness) so many clients do not retry in lockstep and create a thundering herd. The AWS SDKs implement this automatically for retryable errors up to a configurable max attempts, which is why you often do not see throttling in normal code — but for custom retry loops or non-SDK calls you must implement it yourself. Because a request might be retried after it actually succeeded (you just did not get the response), operations should be idempotent — safe to apply more than once. DynamoDB conditional writes, S3 PUT (same key overwrites), SQS deduplication ids on FIFO queues, and client request tokens are common ways to achieve idempotency. For the exam: throttling/5xx -> retry with exponential backoff and jitter, and make writes idempotent.',
              keyPoints: [
                'Throttling errors (DynamoDB ProvisionedThroughputExceeded, KMS ThrottlingException, S3 503 SlowDown) are retryable.',
                'Retry with exponential backoff (increasing waits) plus jitter (randomness) to avoid a thundering herd.',
                'AWS SDKs auto-retry retryable errors with backoff up to a max-attempts setting.',
                'Make operations idempotent so a retried-after-success request causes no harm.',
                'Idempotency tools: conditional writes, FIFO deduplication ids, client request tokens.',
              ],
              commonMistakes: [
                'Retrying immediately in a tight loop on throttling, which amplifies the overload.',
                'Assuming a retried write is safe without idempotency, causing duplicates (for example double-charging).',
              ],
              code: {
                language: 'json',
                lines: [
                  "let delay = 100; // ms",
                  "for (let attempt = 0; attempt < 5; attempt++) {",
                  "  try { return await callAws(); }",
                  "  catch (e) {",
                  "    if (!isRetryable(e) || attempt === 4) throw e;",
                  "    const jitter = Math.random() * delay;",
                  "    await sleep(delay + jitter);",
                  "    delay *= 2; // exponential",
                  "  }",
                  "}",
                ],
                explanation:
                  'A manual retry loop with exponential backoff and jitter — doubling the base delay each attempt and adding randomness so clients do not retry in sync.',
              },
              exercises: [
                {
                  type: 'quiz',
                  prompt:
                    'A batch job hammers DynamoDB and gets ProvisionedThroughputExceededException. What is the correct retry behaviour?',
                  solution: {
                    explanation:
                      'Retry with exponential backoff and jitter (the SDK does this automatically). Also consider raising capacity or switching to on-demand. Do not retry immediately in a tight loop.',
                  },
                },
                {
                  type: 'predict',
                  prompt:
                    'Thousands of clients all retry a throttled request at exactly the same fixed interval. What problem does this cause and what fixes it?',
                  solution: {
                    explanation:
                      'A thundering herd / synchronised retry storm that keeps the service overloaded. Adding jitter (randomised backoff) spreads the retries out.',
                  },
                },
                {
                  type: 'quiz',
                  prompt: 'Why must a payment write be idempotent if it can be retried?',
                  solution: {
                    explanation:
                      'A request can be retried after it already succeeded (the response was lost). Without idempotency (e.g. a conditional write or client token) the customer would be charged twice.',
                  },
                },
              ],
              docs: 'https://docs.aws.amazon.com/general/latest/gr/api-retries.html',
            },
          ],
        },
        {
          id: 'dva4-t2',
          name: 'Performance & cost optimization',
          concepts: [
            {
              id: 'dva4-t2-c0',
              services: [{ icon: 'cloudfront', label: 'CloudFront' }, { icon: 'elasticache', label: 'ElastiCache' }, { icon: 'apigateway', label: 'API Gateway' }],
              title: 'Caching layers: CloudFront, ElastiCache, DAX, API Gateway',
              summary:
                'Caching cuts latency, load, and cost by serving repeated requests from memory or the edge instead of hitting the origin every time. Different layers cache at different points.',
              explanation:
                'Caching is the most common optimization lever on the exam, and each layer caches in a different place. CloudFront caches static and dynamic content at edge locations close to users, cutting latency and origin load for web assets, APIs, and media — set cache behaviours and TTLs per path, and use cache invalidation to push updates. Amazon ElastiCache (Redis or Memcached) is an in-memory data store you put in front of a database to cache expensive query results or hold session state, giving sub-millisecond reads; the cache-aside (lazy loading) pattern reads the cache first and only hits the database on a miss, while write-through updates the cache on every write to keep it fresh. DynamoDB DAX is a specialised in-memory cache specifically for DynamoDB read traffic. API Gateway caching stores endpoint responses for a TTL keyed by request parameters, reducing backend invocations. The trade-off everywhere is freshness vs hit rate: a longer TTL means fewer origin calls but staler data. Cost benefit: caching reduces read capacity, Lambda invocations, and data transfer, so it optimises both performance and spend. Pick the layer by where the repeated work is: edge/global -> CloudFront; database query/session -> ElastiCache; DynamoDB reads -> DAX; API responses -> API Gateway cache.',
              keyPoints: [
                'CloudFront: edge cache for content/APIs near users; per-path TTLs and invalidation.',
                'ElastiCache (Redis/Memcached): in-memory cache for query results and sessions; cache-aside vs write-through.',
                'DAX: in-memory cache dedicated to DynamoDB reads.',
                'API Gateway caching: store endpoint responses for a TTL keyed by request parameters.',
                'Trade-off: longer TTL = higher hit rate but staler data; caching cuts both latency and cost.',
              ],
              commonMistakes: [
                'Using ElastiCache when the need is specifically DynamoDB read caching (DAX is the purpose-built fit).',
                'Setting a long TTL on data that must be fresh, then serving stale responses.',
              ],
              diagram: {
                type: 'mermaid',
                lines: [
                  'flowchart LR',
                  '  U[User] --> CF[CloudFront edge]',
                  '  CF --> AG[API Gateway cache]',
                  '  AG --> L[Lambda]',
                  '  L --> EC[ElastiCache] --> DB[(Database)]',
                ],
                caption: 'Multiple cache layers: edge (CloudFront), API responses (API Gateway), and database results (ElastiCache) each absorb repeated work.',
              },
              exercises: [
                {
                  type: 'quiz',
                  prompt:
                    'A global audience loads the same images and JSON repeatedly, with high latency from one Region. Which caching layer helps most?',
                  solution: { explanation: 'Amazon CloudFront — it caches content at edge locations close to users worldwide.' },
                },
                {
                  type: 'quiz',
                  prompt:
                    'An app repeatedly runs the same expensive SQL query against RDS. How do you cut database load with sub-millisecond reads?',
                  solution: {
                    explanation:
                      'Put Amazon ElastiCache (Redis/Memcached) in front using a cache-aside pattern, so repeated query results are served from memory.',
                  },
                },
                {
                  type: 'predict',
                  prompt:
                    'You raise an API Gateway cache TTL from 5 seconds to 1 hour. What improves and what risk increases?',
                  solution: {
                    explanation:
                      'Hit rate and backend savings improve (fewer Lambda/origin calls), but the risk of serving stale data for up to an hour increases.',
                  },
                },
              ],
              docs: 'https://docs.aws.amazon.com/AmazonElastiCache/latest/red-ug/WhatIs.html',
            },
            {
              id: 'dva4-t2-c1',
              services: [{ icon: 'lambda', label: 'AWS Lambda' }],
              title: 'Optimizing Lambda performance and cost',
              summary:
                'Tune Lambda by right-sizing memory (which also sets CPU), reusing connections across warm invocations, reducing cold starts, and minimising package size and dependencies.',
              explanation:
                'Lambda optimization is a frequent exam theme. Because CPU and network scale with memory, the most important tuning is right-sizing memory: a function that seems slow at 128 MB may finish several times faster at 512 MB or 1024 MB and cost the same or less, since billing is per GB-second — the AWS Lambda Power Tuning tool finds the sweet spot empirically. Reuse across warm invocations is the second lever: create SDK clients, database connection pools, and cached configuration outside the handler so they persist between invocations rather than being rebuilt each time. To reduce cold starts: keep the deployment package small (fewer/leaner dependencies, tree-shaking), choose a faster-initialising runtime where it matters, use provisioned concurrency for latency-critical paths, and prefer SnapStart for Java to snapshot an initialised environment. Avoid putting a Lambda in a VPC unless it must reach private resources, since VPC networking adds setup work (modern Hyperplane ENIs have reduced but not eliminated this). For cost: shorter duration and lower memory (when not CPU-bound) reduce GB-seconds, batching event-source records cuts invocation count, and removing idle provisioned concurrency saves money. Watch the Duration, Throttles, ConcurrentExecutions, and Errors metrics to guide tuning.',
              keyPoints: [
                'Right-size memory — CPU/network scale with it; more memory can be faster and cheaper for CPU-bound work.',
                'Reuse SDK clients/DB connections outside the handler across warm invocations.',
                'Cut cold starts: smaller package, provisioned concurrency, SnapStart (Java).',
                'Only put a Lambda in a VPC if it must reach private resources.',
                'Reduce cost via shorter duration, batching records, and removing idle provisioned concurrency.',
              ],
              commonMistakes: [
                'Leaving memory at 128 MB for a CPU-bound function and assuming low memory is always cheapest.',
                'Putting a function in a VPC needlessly, adding networking overhead with no benefit.',
              ],
              exercises: [
                {
                  type: 'quiz',
                  prompt:
                    'A CPU-bound function at 128 MB is too slow. Counterintuitively, how can raising memory both speed it up and not raise cost much?',
                  solution: {
                    explanation:
                      'More memory gives proportionally more CPU, so it finishes much faster. Since you are billed for GB-seconds, a 4x faster run at 4x memory can cost about the same while cutting latency.',
                  },
                },
                {
                  type: 'quiz',
                  prompt: 'A function rebuilds its database connection on every request and is slow under load. The fix?',
                  solution: {
                    explanation:
                      'Create the connection (pool) outside the handler so it is established once per cold start and reused across warm invocations.',
                  },
                },
                {
                  type: 'quiz',
                  prompt: 'A latency-critical, Java-based Lambda has long cold starts. Name two ways to reduce them.',
                  solution: {
                    explanation:
                      'Enable provisioned concurrency to keep environments warm, and/or use SnapStart for Java to restore from a pre-initialised snapshot. Shrinking the package also helps.',
                  },
                },
              ],
              docs: 'https://docs.aws.amazon.com/lambda/latest/dg/best-practices.html',
            },
          ],
        },
      ],
    },
  ],
};

export default content;
