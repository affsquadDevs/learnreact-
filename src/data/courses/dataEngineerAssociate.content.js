// AWS Certified Data Engineer – Associate — course content.
// Comprehensive coverage of the AWS Certified Data Engineer – Associate (DEA-C01) exam,
// organised into the four official exam domains. The factual material (service names and
// what they do) is rewritten in our own words for self-study; diagrams are our own
// Mermaid creations. Not affiliated with or endorsed by AWS.
//
// Exam domains & weightings (DEA-C01):
//   1. Data Ingestion and Transformation ... 34%
//   2. Data Store Management ............... 26%
//   3. Data Operations and Support ......... 22%
//   4. Data Security and Governance ........ 18%

const content = {
  meta: {
    title: 'AWS Certified Data Engineer – Associate',
    description:
      'A complete, structured path to the AWS Certified Data Engineer – Associate (DEA-C01) exam: ingesting and transforming data with Kinesis, MSK, Glue, EMR and Step Functions; managing data stores including S3 data lakes, Redshift, RDS/Aurora and DynamoDB with partitioning and columnar file formats; operating and monitoring pipelines with CloudWatch, Athena and QuickSight; and securing and governing data with KMS, IAM, Lake Formation and Macie — with diagrams, SQL/JSON snippets, quizzes and hands-on tasks.',
    schemaVersion: '1.0',
    status: 'complete',
  },
  levels: [
    /* ──────────────── DOMAIN 1 — DATA INGESTION AND TRANSFORMATION (34%) ──────────────── */
    {
      level: 1,
      name: 'Ingestion & Transformation',
      focus: 'How data enters AWS in batch and streams, and how it is cleaned, reshaped and orchestrated into analytics-ready form (Domain 1 · 34%)',
      accent: '#2d6bff',
      soft: '#eaf0ff',
      topics: [
        {
          id: 'dea1-t0',
          name: 'Streaming ingestion',
          concepts: [
            {
              id: 'dea1-t0-c0',
              services: [{ icon: 'kinesis', label: 'Kinesis Data Streams' }],
              title: 'Amazon Kinesis Data Streams: shards, partition keys and ordering',
              summary:
                'Kinesis Data Streams is a durable, real-time streaming service that ingests records from many producers and stores them for a configurable retention window so multiple consumers can read them in order, per shard.',
              explanation:
                "Amazon Kinesis Data Streams captures gigabytes of streaming data per second from sources such as clickstreams, IoT sensors and application logs. A stream is made of shards; each shard supports about 1 MB/s or 1,000 records/s of writes and 2 MB/s of reads. Every record carries a partition key that a hash maps to a specific shard, so all records with the same partition key land on the same shard and are read in the order they were written — ordering is guaranteed per shard, not across the whole stream. Records are retained for 24 hours by default and up to 365 days, so several independent consumers can replay the same data. Capacity comes in two modes: provisioned (you choose the shard count and can resize by splitting or merging shards) and on-demand (Kinesis scales shards automatically based on throughput). For consumers, standard fan-out shares the 2 MB/s read budget across all consumers on a shard, while enhanced fan-out gives each registered consumer its own dedicated 2 MB/s pipe with lower latency.",
              analogy:
                'Think of a stream as a row of conveyor belts (shards). The partition key decides which belt each parcel rides; parcels on the same belt stay in order, but two belts move independently. Add belts to carry more parcels.',
              keyPoints: [
                'A stream = one or more shards; each shard ~1 MB/s or 1,000 records/s in, 2 MB/s out.',
                'Partition key hashes a record to a shard; same key → same shard → ordered reads per shard.',
                'Retention 24h by default, extendable to 365 days, enabling replay by multiple consumers.',
                'Provisioned mode (you size shards) vs on-demand mode (auto-scales to throughput).',
                'Enhanced fan-out gives each consumer a dedicated 2 MB/s read pipe at lower latency.',
                'A hot partition key sends too much traffic to one shard — pick a high-cardinality key.',
              ],
              commonMistakes: [
                'Expecting global ordering across the whole stream — ordering is only guaranteed within a single shard.',
                'Using a low-cardinality partition key (e.g. a constant), creating a hot shard that throttles writes.',
                'Confusing Data Streams (you build/manage consumers, replayable) with Firehose (fully managed delivery, no replay).',
              ],
              code: {
                language: 'bash',
                lines: [
                  'aws kinesis put-record \\',
                  '  --stream-name clickstream \\',
                  '  --partition-key user-8821 \\',
                  '  --data "$(echo \'{"event":"add_to_cart"}\' | base64)"',
                ],
                explanation:
                  'Writing one record with partition key "user-8821" routes it (and every other record for that user) to the same shard, keeping that user\'s events in order.',
              },
              diagram: {
                type: 'mermaid',
                lines: [
                  'flowchart LR',
                  '  P[Producers<br/>apps, IoT] --> S[(Kinesis Data Stream)]',
                  '  S --> SH1[Shard 1]',
                  '  S --> SH2[Shard 2]',
                  '  SH1 --> C1[Consumer A]',
                  '  SH2 --> C2[Consumer B]',
                ],
                caption: 'Producers write records keyed to shards; multiple consumers read the same shards independently and can replay within the retention window.',
              },
              exercises: [
                {
                  type: 'quiz',
                  prompt:
                    'A retail app must keep all events for a given customer in the order they occurred while scaling to thousands of customers. What should you use as the partition key?',
                  hint: 'Ordering is per shard, and you want even spread.',
                  solution: {
                    explanation:
                      'Use the customer ID as the partition key: all of one customer\'s events hash to the same shard (in order), while high cardinality spreads customers across shards to avoid a hot shard.',
                  },
                },
                {
                  type: 'quiz',
                  prompt: 'Three teams each need to consume the full stream at low latency without stealing each other\'s read throughput. What feature helps?',
                  solution: {
                    explanation: 'Enhanced fan-out — each registered consumer gets its own dedicated 2 MB/s-per-shard read pipe instead of sharing the standard read budget.',
                  },
                },
                {
                  type: 'predict',
                  prompt: 'A producer sends 5 MB/s to a stream with two shards in provisioned mode. What happens?',
                  solution: {
                    explanation: 'Writes are throttled (ProvisionedThroughputExceeded): two shards allow ~2 MB/s total. Split shards to add capacity or switch to on-demand mode.',
                  },
                },
              ],
              docs: 'https://docs.aws.amazon.com/streams/latest/dev/introduction.html',
            },
            {
              id: 'dea1-t0-c1',
              services: [{ icon: 'kinesis', label: 'Data Firehose' }, { icon: 's3', label: 'Amazon S3' }],
              title: 'Amazon Data Firehose: fully managed delivery to data stores',
              summary:
                'Data Firehose (formerly Kinesis Data Firehose) is a fully managed delivery stream that buffers incoming records and writes them to destinations like S3, Redshift, OpenSearch or Splunk — with optional format conversion and transformation, and no shards to manage.',
              explanation:
                "Amazon Data Firehose is the near-real-time, zero-administration way to land streaming data in a store. You do not manage shards or write consumer code: Firehose buffers records by size (e.g. 5 MB) or time (e.g. 60 seconds), whichever comes first, then delivers a batch to the destination. It can invoke a Lambda function to transform records in flight (e.g. enrich, filter, redact), convert JSON into columnar Parquet or ORC on the way to S3 (using a Glue Data Catalog table for the schema), compress (GZIP, Snappy), and encrypt. Failed or malformed records can be routed to an S3 error prefix. Because buffering adds latency (seconds to minutes), Firehose is for delivery and light transformation, not sub-second processing. A common pattern is Kinesis Data Streams (or direct PUT) → Firehose → S3 data lake in Parquet, partitioned by date.",
              analogy:
                'Firehose is a managed courier: parcels pile up until the box is full or a timer rings, then the whole box is shipped to the warehouse — you never touch a truck or driver.',
              keyPoints: [
                'Fully managed, near-real-time delivery — no shards, no consumer code to run.',
                'Buffers by size OR time and delivers a batch when either threshold is hit.',
                'Destinations: S3, Redshift (via S3 + COPY), OpenSearch, Splunk, HTTP endpoints.',
                'Optional Lambda transform, JSON→Parquet/ORC conversion (needs a Glue table), compression, encryption.',
                'Buffering adds latency — use it for delivery, not sub-second stream processing.',
                'Failed records can be delivered to an S3 error/backup prefix.',
              ],
              commonMistakes: [
                'Picking Firehose when you need millisecond latency or to replay data — that is Kinesis Data Streams.',
                'Forgetting that Parquet/ORC conversion in Firehose requires a Glue Data Catalog table for the schema.',
              ],
              diagram: {
                type: 'mermaid',
                lines: [
                  'flowchart LR',
                  '  Src[Producers / Data Stream] --> FH[Data Firehose<br/>buffer + transform]',
                  '  FH -->|Lambda transform| FH',
                  '  FH --> S3[(S3 data lake<br/>Parquet by date)]',
                  '  FH -.errors.-> ERR[(S3 error prefix)]',
                ],
                caption: 'Firehose buffers, optionally transforms and converts to Parquet, then delivers batches to S3, routing failures to an error prefix.',
              },
              exercises: [
                {
                  type: 'quiz',
                  prompt:
                    'You need to land streaming JSON logs in an S3 data lake as compressed Parquet, partitioned by day, with minimal operational effort. Which service and what extra setup?',
                  solution: {
                    explanation:
                      'Amazon Data Firehose with record format conversion to Parquet enabled, pointing at a Glue Data Catalog table for the schema, and dynamic partitioning (or a date prefix) for the by-day layout.',
                  },
                },
                {
                  type: 'quiz',
                  prompt: 'A team wants to redact email addresses from each record before it lands in S3 through Firehose. How?',
                  solution: {
                    explanation: 'Attach a Lambda transformation function to the Firehose delivery stream; it processes each batch in flight and returns the redacted records.',
                  },
                },
                {
                  type: 'predict',
                  prompt: 'Buffer is set to 128 MB or 900 seconds. Traffic is light. How fresh is data in S3?',
                  solution: {
                    explanation: 'Up to ~15 minutes stale — the 900-second timer fires before 128 MB accumulates. Lower the buffer interval for fresher data at the cost of more, smaller files.',
                  },
                },
              ],
              docs: 'https://docs.aws.amazon.com/firehose/latest/dev/what-is-this-service.html',
            },
            {
              id: 'dea1-t0-c2',
              services: [{ icon: 'analytics', label: 'Amazon MSK' }, { icon: 'analytics', label: 'Apache Kafka' }],
              title: 'Amazon MSK and managed Apache Kafka',
              summary:
                'Amazon Managed Streaming for Apache Kafka (MSK) runs Apache Kafka clusters for you, giving an open-source, partition-based streaming platform with topics, consumer groups and replication — ideal when you already use Kafka or need its ecosystem.',
              explanation:
                "Amazon MSK provisions, configures and maintains Apache Kafka clusters, handling broker health, patching and replication so you keep the open-source API and tooling without the operational burden. Kafka organises data into topics, each split into partitions (Kafka's unit of parallelism and ordering, similar to a Kinesis shard); consumers join consumer groups so each partition is read by exactly one consumer in the group, scaling horizontally. Replication across brokers (and AZs) provides durability. MSK comes in two flavours: provisioned (you choose broker instance types and counts) and MSK Serverless (capacity scales automatically, you pay per throughput). MSK Connect runs Kafka Connect connectors (e.g. to sink into S3) as a managed service. Choose MSK over Kinesis when you need the Kafka ecosystem (existing Kafka apps, Kafka Connect, exactly-once semantics, very high partition counts); choose Kinesis for tight, low-effort AWS-native integration.",
              keyPoints: [
                'MSK = managed Apache Kafka: AWS runs the brokers; you keep the open-source Kafka API.',
                'Topics split into partitions — the unit of ordering and parallelism (like Kinesis shards).',
                'Consumer groups let many consumers split a topic; one partition per consumer in a group.',
                'Provisioned (size brokers) vs MSK Serverless (auto-scaling, pay per throughput).',
                'MSK Connect runs managed Kafka Connect connectors (e.g. S3 sink).',
                'Pick MSK for the Kafka ecosystem/migration; Kinesis for low-effort AWS-native streaming.',
              ],
              commonMistakes: [
                'Assuming MSK is serverless by default — provisioned MSK requires you to size and pay for brokers continuously.',
                'Treating Kafka partitions as cross-topic ordered — ordering is guaranteed only within a partition.',
              ],
              diagram: {
                type: 'mermaid',
                lines: [
                  'flowchart LR',
                  '  Prod[Producers] --> T[Topic: orders]',
                  '  T --> P0[Partition 0]',
                  '  T --> P1[Partition 1]',
                  '  P0 --> CG1[Consumer 1]',
                  '  P1 --> CG2[Consumer 2]',
                ],
                caption: 'A Kafka topic is split into partitions; a consumer group assigns each partition to one consumer for parallel, ordered reads.',
              },
              exercises: [
                {
                  type: 'quiz',
                  prompt:
                    'A company is migrating an on-premises platform that already uses Apache Kafka producers, consumers and Kafka Connect. Which AWS service minimises code changes?',
                  solution: {
                    explanation: 'Amazon MSK — it runs Apache Kafka with the same API and supports Kafka Connect (via MSK Connect), so existing Kafka clients work largely unchanged.',
                  },
                },
                {
                  type: 'quiz',
                  prompt: 'A team wants Kafka but does not want to size or manage brokers and prefers pay-per-throughput. What fits?',
                  solution: { explanation: 'MSK Serverless — capacity scales automatically and you pay for throughput and storage rather than fixed brokers.' },
                },
              ],
              docs: 'https://docs.aws.amazon.com/msk/latest/developerguide/what-is-msk.html',
            },
          ],
        },
        {
          id: 'dea1-t1',
          name: 'Batch ingestion & migration',
          concepts: [
            {
              id: 'dea1-t1-c0',
              services: [{ icon: 'database', label: 'AWS DMS' }],
              title: 'AWS Database Migration Service: full load and change data capture',
              summary:
                'AWS DMS migrates and replicates relational and other databases into AWS with minimal downtime, supporting a one-time full load followed by ongoing change data capture (CDC) to keep a target continuously in sync.',
              explanation:
                "AWS Database Migration Service (DMS) moves data from a source database to a target while the source stays operational. A replication instance reads from the source endpoint and writes to the target endpoint; tasks define what to migrate. The classic pattern is full load + CDC: DMS first copies existing rows, then switches to change data capture, reading the source's transaction log to replicate inserts, updates and deletes continuously — so you can cut over with little downtime. DMS supports homogeneous moves (Oracle→Oracle) and heterogeneous ones (Oracle→Aurora PostgreSQL), where the AWS Schema Conversion Tool (SCT) converts schema and code. For data engineering, DMS commonly streams CDC from operational databases into an S3 data lake (writing CSV or Parquet) or into Kinesis/Redshift, feeding analytics from transactional systems without hammering them. DMS Serverless removes the need to provision the replication instance.",
              analogy:
                'DMS is like moving house while still living there: first the movers copy everything that exists (full load), then they keep forwarding any new mail and furniture changes (CDC) until you officially switch addresses.',
              keyPoints: [
                'DMS migrates/replicates databases with minimal downtime via a replication instance + endpoints.',
                'Full load copies existing data; CDC then replays ongoing inserts/updates/deletes from the transaction log.',
                'Homogeneous (same engine) and heterogeneous (different engine) migrations; SCT converts schema/code.',
                'Targets include RDS/Aurora, Redshift, S3 (CSV/Parquet), DynamoDB and Kinesis.',
                'Common data-lake pattern: CDC from an OLTP source into S3 or Kinesis for analytics.',
                'DMS Serverless auto-provisions and scales the replication capacity.',
              ],
              commonMistakes: [
                'Thinking DMS converts schema by itself — heterogeneous migrations need the Schema Conversion Tool (SCT).',
                'Forgetting to enable supplemental logging / binlog on the source so CDC can read changes.',
              ],
              diagram: {
                type: 'mermaid',
                lines: [
                  'flowchart LR',
                  '  Src[(Source DB<br/>on-prem Oracle)] --> RI[DMS replication instance]',
                  '  RI -->|full load| Tgt[(Aurora PostgreSQL)]',
                  '  RI -->|CDC stream| Lake[(S3 data lake)]',
                ],
                caption: 'DMS performs a full load to the target, then continuous CDC, and can also fan changes into an S3 data lake for analytics.',
              },
              exercises: [
                {
                  type: 'quiz',
                  prompt:
                    'You must migrate an on-prem Oracle database to Aurora PostgreSQL with almost no downtime and convert stored procedures. Which tools and approach?',
                  hint: 'Different engines and a need for ongoing sync.',
                  solution: {
                    explanation:
                      'Use the Schema Conversion Tool to convert the Oracle schema/PL-SQL to PostgreSQL, then run a DMS task with full load + CDC so the target stays in sync until cutover.',
                  },
                },
                {
                  type: 'quiz',
                  prompt: 'A data lake must reflect changes from a transactional MySQL database in near real time without overloading it. What enables this in DMS?',
                  solution: {
                    explanation: 'Change data capture (CDC) reading the MySQL binlog, delivering inserts/updates/deletes to an S3 target — minimal load on the source.',
                  },
                },
              ],
              docs: 'https://docs.aws.amazon.com/dms/latest/userguide/Welcome.html',
            },
            {
              id: 'dea1-t1-c1',
              services: [{ icon: 'lambda', label: 'AWS Lambda' }, { icon: 'integration', label: 'Amazon AppFlow' }],
              title: 'Event-driven and SaaS ingestion: Lambda and AppFlow',
              summary:
                'Lambda runs short, event-triggered code to ingest or react to data (e.g. on an S3 upload), while Amazon AppFlow is a no-code connector that moves data between SaaS applications and AWS on a schedule or event.',
              explanation:
                "Not all ingestion is a stream or a database. AWS Lambda lets you run code in response to events with no servers to manage: an object landing in S3, a message on a queue, an API call or a schedule. In data pipelines, Lambda is ideal for lightweight ingestion and glue logic — validating a file on arrival, kicking off a Glue job or Step Functions workflow, writing small records to DynamoDB, or transforming records inside Firehose. It is not meant for long-running heavy transforms (15-minute max, memory-bound); reach for Glue or EMR there. Amazon AppFlow is a fully managed integration service that moves data between SaaS apps (Salesforce, Slack, Google Analytics, ServiceNow, Zendesk and many more) and AWS targets like S3 and Redshift without writing connector code. Flows can run on a schedule, on an event, or on demand, and can filter, mask and map fields in transit. Use AppFlow to pull CRM or marketing data into a data lake; use Lambda for custom, code-driven, event-based ingestion and orchestration triggers.",
              keyPoints: [
                'Lambda: serverless, event-driven code (S3 upload, queue, schedule, API) — great for light ingestion + triggering pipelines.',
                'Lambda limits: 15-minute max runtime, memory-bound — not for heavy/long ETL (use Glue/EMR).',
                'AppFlow: no-code, managed connectors between SaaS apps and AWS (S3, Redshift).',
                'AppFlow flows run on schedule, on event, or on demand, with field mapping, filtering and masking.',
                'Pattern: AppFlow pulls SaaS data → S3; Lambda reacts to the arrival to start downstream jobs.',
              ],
              commonMistakes: [
                'Using Lambda for a multi-gigabyte transform that exceeds the 15-minute limit — offload to Glue or EMR.',
                'Hand-coding a Salesforce integration when AppFlow already provides a managed, no-code connector.',
              ],
              code: {
                language: 'python',
                lines: [
                  'def handler(event, context):',
                  '    for record in event["Records"]:',
                  '        bucket = record["s3"]["bucket"]["name"]',
                  '        key = record["s3"]["object"]["key"]',
                  '        # validate then start a Glue job for the new file',
                  '        glue.start_job_run(JobName="ingest-curate",',
                  '                           Arguments={"--input": f"s3://{bucket}/{key}"})',
                ],
                explanation:
                  'An S3-triggered Lambda that validates each newly uploaded object and starts a Glue job to process it — a common event-driven ingestion trigger.',
              },
              exercises: [
                {
                  type: 'quiz',
                  prompt:
                    'Marketing wants daily Salesforce opportunity data copied into the S3 data lake with no custom code. Which service?',
                  solution: { explanation: 'Amazon AppFlow — a scheduled flow with the Salesforce connector writing to S3, with optional field mapping and masking.' },
                },
                {
                  type: 'quiz',
                  prompt: 'Every time a CSV lands in a raw S3 prefix, a Glue crawler and ETL job should start automatically. What is the simplest trigger?',
                  solution: { explanation: 'An S3 event notification invoking a Lambda function (or an EventBridge rule) that starts the crawler/job.' },
                },
              ],
              docs: 'https://docs.aws.amazon.com/appflow/latest/userguide/what-is-appflow.html',
            },
          ],
        },
        {
          id: 'dea1-t2',
          name: 'ETL with AWS Glue',
          concepts: [
            {
              id: 'dea1-t2-c0',
              services: [{ icon: 'glue', label: 'AWS Glue' }],
              title: 'Glue crawlers and the Glue Data Catalog',
              summary:
                'The AWS Glue Data Catalog is a central metadata store (databases and tables describing where data lives, its schema and partitions). Glue crawlers scan data in S3 (and other stores), infer schema and populate or update the catalog automatically.',
              explanation:
                "The Glue Data Catalog is the single source of truth about your data: it holds logical databases, each containing tables that record a dataset's location (e.g. an S3 prefix), columns and types, file format, compression and partition keys. It is Hive-metastore-compatible, so Athena, Redshift Spectrum, EMR and Glue jobs all read the same definitions — define a table once, query it everywhere. Glue crawlers automate cataloguing: a crawler points at a data store, uses built-in or custom classifiers to detect the format (CSV, JSON, Parquet, ORC, Avro) and schema, infers partitions from the folder structure (e.g. year=/month=/day=), and writes or updates the table. You run crawlers on a schedule or trigger them when new data arrives, so the catalog tracks schema and partition changes. You can also create or edit tables directly without a crawler when you already know the schema, which avoids surprises from incorrect inference.",
              analogy:
                'The Data Catalog is the library card catalogue — it does not hold the books (data) but tells every reader (Athena, Redshift, EMR) the title, shelf and chapters. A crawler is the librarian who walks the shelves and updates the cards.',
              keyPoints: [
                'Data Catalog = central metadata: databases → tables with location, schema, format and partitions.',
                'Hive-metastore compatible — shared by Athena, Redshift Spectrum, EMR and Glue.',
                'Crawlers infer format and schema via classifiers and detect partitions from folder structure.',
                'Run crawlers on a schedule or on new-data events to keep schema/partitions current.',
                'You can define/edit tables manually when the schema is known, avoiding bad inference.',
                'The catalog stores metadata only — the actual data stays in S3 (or other stores).',
              ],
              commonMistakes: [
                'Believing the Data Catalog stores the data — it stores only metadata; data remains in S3.',
                'Relying on crawler inference for messy CSV and getting wrong types — use a custom classifier or define the table by hand.',
                'Forgetting to re-crawl (or use partition projection) after adding new date partitions, so new data is invisible to queries.',
              ],
              diagram: {
                type: 'mermaid',
                lines: [
                  'flowchart LR',
                  '  S3[(S3 raw data)] --> CR[Glue crawler]',
                  '  CR --> DC[(Glue Data Catalog<br/>db.table + partitions)]',
                  '  DC --> AT[Athena]',
                  '  DC --> RS[Redshift Spectrum]',
                  '  DC --> GJ[Glue / EMR jobs]',
                ],
                caption: 'A crawler infers schema from S3 and writes it to the Data Catalog, which Athena, Redshift Spectrum and Glue/EMR all share.',
              },
              exercises: [
                {
                  type: 'quiz',
                  prompt:
                    'New daily folders year=2026/month=06/day=23/ keep appearing in S3 but Athena does not see the latest data. What is likely missing?',
                  hint: 'Athena reads partitions from the catalog.',
                  solution: {
                    explanation:
                      'New partitions are not registered. Re-run the Glue crawler on a schedule, run MSCK REPAIR TABLE / ALTER TABLE ADD PARTITION, or enable partition projection so Athena discovers the new date partitions.',
                  },
                },
                {
                  type: 'quiz',
                  prompt: 'Why can you define a Glue table once and query it from Athena, Redshift Spectrum and EMR?',
                  solution: {
                    explanation: 'The Glue Data Catalog is a shared, Hive-metastore-compatible metadata store, so all three engines read the same table definitions.',
                  },
                },
                {
                  type: 'task',
                  prompt: 'A crawler infers a numeric ID column as a string because some files quote it. How do you fix the catalog schema reliably?',
                  solution: {
                    explanation: 'Use a custom classifier with the correct types, or edit/define the table schema manually instead of trusting inference, then re-crawl with the classifier applied.',
                  },
                },
              ],
              docs: 'https://docs.aws.amazon.com/glue/latest/dg/components-overview.html',
            },
            {
              id: 'dea1-t2-c1',
              services: [{ icon: 'glue', label: 'AWS Glue' }, { icon: 'analytics', label: 'Apache Spark' }],
              title: 'Glue ETL jobs: Spark, DynamicFrames, bookmarks and job types',
              summary:
                'Glue ETL jobs run serverless Apache Spark (or Python shell) to transform data at scale. DynamicFrames handle messy, schema-flexible data, job bookmarks process only new data, and you pay per DPU-hour.',
              explanation:
                "AWS Glue runs ETL as serverless jobs — you do not manage a cluster; Glue provisions workers (DPUs, data processing units) for the run and bills per DPU-second. Spark and Streaming-Spark jobs handle large distributed transforms; Python shell jobs suit small, single-node tasks. Glue extends Spark DataFrames with DynamicFrames, which tolerate inconsistent or evolving schemas (multiple types per field via choice types, resolve/drop options) — handy for raw, semi-structured data before you settle on a clean schema. Job bookmarks track what has already been processed (by file or key/timestamp) so a rerun only handles new data, avoiding reprocessing and duplicates. Glue Studio gives a visual job builder, and Glue interactive sessions let you develop in notebooks. A typical job reads from a catalog table, applies mappings (ApplyMapping, Filter, Join), and writes back to S3 as partitioned Parquet, optionally updating the catalog. Glue version and worker type (Standard, G.1X, G.2X) tune memory and cost.",
              keyPoints: [
                'Serverless Spark — no clusters; billed per DPU-second; choose Spark, Streaming or Python shell.',
                'DynamicFrames tolerate inconsistent/evolving schemas (choice types, resolveChoice) better than plain DataFrames.',
                'Job bookmarks process only new data on reruns, preventing reprocessing and duplicates.',
                'Glue Studio (visual) and interactive sessions/notebooks speed development.',
                'Common output: partitioned, compressed Parquet to S3, with the Data Catalog updated.',
                'Tune worker type (G.1X/G.2X) and worker count for memory-heavy or large jobs.',
              ],
              commonMistakes: [
                'Leaving bookmarks disabled and reprocessing the entire dataset every run, raising cost and duplicating output.',
                'Using a Python shell job for a multi-terabyte transform — that needs a distributed Spark job.',
                'Writing many tiny files to S3 instead of coalescing/repartitioning, hurting downstream query performance.',
              ],
              code: {
                language: 'python',
                lines: [
                  'dyf = glueContext.create_dynamic_frame.from_catalog(',
                  '    database="raw", table_name="events",',
                  '    transformation_ctx="src")  # ctx enables bookmarking',
                  'mapped = dyf.apply_mapping([',
                  '    ("user_id", "string", "user_id", "string"),',
                  '    ("ts", "string", "event_time", "timestamp")])',
                  'glueContext.write_dynamic_frame.from_options(',
                  '    mapped, connection_type="s3",',
                  '    connection_options={"path": "s3://lake/curated/events/",',
                  '                        "partitionKeys": ["event_date"]},',
                  '    format="parquet")',
                ],
                explanation:
                  'A Glue Spark job reads a catalog table as a DynamicFrame (with a bookmark context), remaps columns, and writes partitioned Parquet to the curated zone.',
              },
              exercises: [
                {
                  type: 'quiz',
                  prompt:
                    'A daily Glue job keeps reprocessing all historical files, inflating cost and creating duplicate output. What should you enable?',
                  solution: {
                    explanation: 'Job bookmarks — Glue tracks already-processed data so each run only handles newly arrived files.',
                  },
                },
                {
                  type: 'quiz',
                  prompt: 'Raw JSON has a field that is sometimes a number and sometimes a string, breaking a plain Spark DataFrame. What Glue feature helps?',
                  solution: {
                    explanation: 'A DynamicFrame with a choice type, resolved via resolveChoice (cast, make_struct or project) before writing a clean schema.',
                  },
                },
                {
                  type: 'task',
                  prompt: 'Why prefer writing partitioned Parquet over many small JSON files from a Glue job?',
                  solution: {
                    explanation: 'Parquet is columnar and compressed (less scanned, cheaper Athena queries), and partitioning plus larger files reduces per-file overhead and improves parallel reads.',
                  },
                },
              ],
              docs: 'https://docs.aws.amazon.com/glue/latest/dg/author-job.html',
            },
          ],
        },
        {
          id: 'dea1-t3',
          name: 'Big-data transformation & query',
          concepts: [
            {
              id: 'dea1-t3-c0',
              services: [{ icon: 'emr', label: 'Amazon EMR' }, { icon: 'analytics', label: 'Apache Spark' }],
              title: 'Amazon EMR: managed Spark, Hadoop and Hive clusters',
              summary:
                'Amazon EMR runs open-source big-data frameworks (Spark, Hadoop, Hive, Presto, HBase, Flink) on managed clusters, giving fine-grained control over instances and configuration for large-scale ETL, machine learning and ad hoc processing.',
              explanation:
                "Amazon EMR (Elastic MapReduce) provisions clusters of EC2 instances pre-installed with big-data software. A cluster has a primary node (coordination), core nodes (compute + HDFS storage) and optional task nodes (compute only, often Spot for cheap, interruptible capacity). EMR decouples compute from storage by reading and writing directly to S3 through EMRFS, so clusters can be transient — spin up, run the job, terminate — instead of holding data on HDFS forever. Use EMR when you need framework-level control (specific Spark/Hadoop versions, custom libraries, bootstrap actions, very large jobs) that serverless Glue does not give. Variants: EMR on EC2 (full control), EMR Serverless (no cluster to size — you submit Spark/Hive jobs and pay per use), and EMR on EKS (run Spark on a Kubernetes cluster). Cost levers include right-sizing, Spot task nodes, instance fleets and managed scaling. EMR is the heavyweight choice for large, complex or framework-specific workloads; Glue is the lower-effort serverless ETL choice.",
              keyPoints: [
                'EMR runs Spark, Hadoop, Hive, Presto, HBase, Flink on managed EC2 clusters.',
                'Node roles: primary (coordinate), core (compute + HDFS), task (compute only, often Spot).',
                'EMRFS reads/writes S3 directly, enabling transient clusters (compute decoupled from storage).',
                'Variants: EMR on EC2 (control), EMR Serverless (no sizing), EMR on EKS (Spark on Kubernetes).',
                'Cost: Spot task nodes, managed scaling and instance fleets cut spend on flexible jobs.',
                'Choose EMR for framework control / very large jobs; Glue for low-effort serverless ETL.',
              ],
              commonMistakes: [
                'Keeping a large EMR cluster running 24/7 for occasional jobs — use transient clusters or EMR Serverless.',
                'Putting critical data only on HDFS (core nodes) — store durable data in S3 via EMRFS so transient clusters can come and go.',
                'Running core nodes on Spot — losing them harms HDFS; use Spot for task nodes instead.',
              ],
              diagram: {
                type: 'mermaid',
                lines: [
                  'flowchart TB',
                  '  P[Primary node] --> C1[Core node + HDFS]',
                  '  P --> C2[Core node + HDFS]',
                  '  P --> T1[Task node - Spot]',
                  '  C1 --> S3[(S3 via EMRFS)]',
                  '  C2 --> S3',
                ],
                caption: 'An EMR cluster: primary coordinates core and task nodes; durable data lives in S3 via EMRFS so the cluster can be transient.',
              },
              exercises: [
                {
                  type: 'quiz',
                  prompt:
                    'A nightly Spark job needs a specific Spark version and custom libraries, runs for two hours, then is not needed. What is the most cost-effective EMR setup?',
                  hint: 'Compute decoupled from storage; pay only while running.',
                  solution: {
                    explanation:
                      'A transient EMR cluster (or EMR Serverless) reading/writing S3 via EMRFS, with Spot task nodes; it launches, runs the job, and terminates so you pay only for the two hours.',
                  },
                },
                {
                  type: 'quiz',
                  prompt: 'Which node type is safe to run on Spot Instances in EMR, and which is not?',
                  solution: {
                    explanation: 'Task nodes (compute only) are safe for Spot; core nodes hold HDFS data, so losing them risks data and should stay On-Demand/Reserved.',
                  },
                },
                {
                  type: 'task',
                  prompt: 'When would you choose Glue over EMR for an ETL job?',
                  solution: {
                    explanation: 'When you want serverless, low-operations ETL with the Data Catalog, bookmarks and visual authoring and do not need specific framework versions or fine-grained cluster control.',
                  },
                },
              ],
              docs: 'https://docs.aws.amazon.com/emr/latest/ManagementGuide/emr-what-is-emr.html',
            },
            {
              id: 'dea1-t3-c1',
              services: [{ icon: 'athena', label: 'Amazon Athena' }],
              title: 'Amazon Athena for transformation: CTAS and partitioning',
              summary:
                'Athena runs serverless SQL over S3 and is not only for reads: CREATE TABLE AS SELECT (CTAS) and INSERT INTO let you transform raw data into partitioned, columnar (Parquet) tables, making Athena a lightweight, SQL-driven ETL tool.',
              explanation:
                "Amazon Athena is a serverless query engine (based on Trino/Presto) that runs ANSI SQL directly against data in S3, charging per terabyte scanned. Beyond ad hoc analysis it can transform data: CREATE TABLE AS SELECT (CTAS) reads a query result and writes a brand-new S3 dataset in a chosen format (commonly Parquet), with compression and partitioning — turning slow, expensive raw CSV/JSON scans into cheap, partitioned columnar tables. INSERT INTO appends results to an existing table, useful for incremental builds. Because cost is driven by bytes scanned, the big wins are converting to columnar formats, compressing, and partitioning so queries prune to only relevant files. Athena also supports a results-reuse cache and workgroups for cost controls (per-query data limits, separate result locations). It is ideal for SQL-centric, on-demand transformations and curated-layer builds without managing any infrastructure; for complex, code-heavy or very large transforms, Glue/EMR remain the heavyweight options.",
              keyPoints: [
                'Serverless SQL over S3 (Trino/Presto engine); billed per TB scanned.',
                'CTAS writes a new partitioned, columnar (Parquet) dataset from a SELECT — SQL-driven ETL.',
                'INSERT INTO appends to an existing table for incremental builds.',
                'Reduce cost by converting to Parquet/ORC, compressing, and partitioning to prune scans.',
                'Workgroups enforce per-query data limits and isolate result locations and costs.',
                'Great for SQL transforms and curated layers; use Glue/EMR for code-heavy or huge jobs.',
              ],
              commonMistakes: [
                'Running SELECT * on uncompressed CSV and paying to scan everything — convert to partitioned Parquet first.',
                'Forgetting CTAS has a partition limit per query — bulk-create partitions in batches if needed.',
              ],
              code: {
                language: 'sql',
                lines: [
                  'CREATE TABLE curated.events_parquet',
                  'WITH (',
                  "  format = 'PARQUET',",
                  "  parquet_compression = 'SNAPPY',",
                  "  partitioned_by = ARRAY['event_date'],",
                  "  external_location = 's3://lake/curated/events/'",
                  ') AS',
                  'SELECT user_id, event_type, event_date',
                  'FROM raw.events',
                  "WHERE event_date >= DATE '2026-06-01';",
                ],
                explanation:
                  'A CTAS statement transforms raw events into a Snappy-compressed, date-partitioned Parquet table in the curated S3 zone — cheaper and faster to query thereafter.',
              },
              exercises: [
                {
                  type: 'quiz',
                  prompt:
                    'Analysts complain Athena queries on raw JSON logs are slow and expensive. Using only Athena, how do you cut cost and latency?',
                  solution: {
                    explanation:
                      'Use CTAS to write the data as partitioned, Snappy-compressed Parquet, then query the new table — columnar format and partition pruning scan far fewer bytes.',
                  },
                },
                {
                  type: 'quiz',
                  prompt: 'What single factor most directly drives Athena query cost?',
                  solution: { explanation: 'The amount of data scanned (bytes) per query — minimised by columnar formats, compression and partition pruning.' },
                },
                {
                  type: 'predict',
                  prompt: 'A query filters on event_date but the table is not partitioned by it. Does Athena prune?',
                  solution: {
                    explanation: 'No — without partitioning on event_date, Athena scans all files and filters afterwards, scanning (and billing) far more data.',
                  },
                },
              ],
              docs: 'https://docs.aws.amazon.com/athena/latest/ug/ctas.html',
            },
          ],
        },
        {
          id: 'dea1-t4',
          name: 'Pipeline orchestration',
          concepts: [
            {
              id: 'dea1-t4-c0',
              services: [{ icon: 'stepfunctions', label: 'Step Functions' }, { icon: 'eventbridge', label: 'EventBridge' }],
              title: 'Orchestrating pipelines with Step Functions and EventBridge',
              summary:
                'Step Functions sequences pipeline steps as a visual state machine with built-in retries, error handling and parallelism, while EventBridge triggers and schedules pipelines based on events and cron rules.',
              explanation:
                "Data pipelines are rarely a single job; they are a sequence — crawl, then run a Glue job, then load Redshift, then refresh a dashboard — with dependencies, retries and branching. AWS Step Functions models this as a state machine written in Amazon States Language (JSON): each state is a task (e.g. start a Glue job, run a Lambda, call Athena), and the machine handles Retry/Catch on failures, Choice branching, Parallel and Map (fan-out over many items), and Wait. It integrates directly with Glue, Lambda, EMR, Athena, SNS and more, and can wait for a job to finish (.sync) before moving on — so you avoid hand-built polling. Standard workflows are durable and long-running; Express workflows are high-volume and short-lived. Amazon EventBridge is the trigger layer: scheduled rules (cron) start pipelines at set times, and event rules react to events (a file arrival via S3→EventBridge, a job state change) to start a state machine. Together they give reliable, observable, event-driven orchestration without standing up a scheduler server.",
              analogy:
                'Step Functions is the conductor with the score — it tells each musician (job) when to play, what to do if one falters (retry) and when to start the next movement. EventBridge is the cue to begin the concert (a schedule or an event).',
              keyPoints: [
                'Step Functions = visual state machine (Amazon States Language) sequencing pipeline tasks.',
                'Built-in Retry/Catch, Choice branching, Parallel and Map fan-out, and Wait — no custom polling.',
                'Native integrations with Glue, Lambda, EMR, Athena, SNS; .sync waits for completion.',
                'Standard (durable, long-running) vs Express (high-volume, short-lived) workflows.',
                'EventBridge schedules pipelines (cron) and reacts to events (S3 arrival, job state change).',
                'Together: reliable, observable, event-driven orchestration with no scheduler server.',
              ],
              commonMistakes: [
                'Chaining jobs with sleeping Lambdas instead of using .sync integrations and Step Functions retries.',
                'Using Express workflows for a multi-hour ETL run — they are for short, high-volume executions; use Standard.',
              ],
              diagram: {
                type: 'mermaid',
                lines: [
                  'flowchart LR',
                  '  EB[EventBridge<br/>schedule / S3 event] --> SF[Step Functions]',
                  '  SF --> CR[Run crawler]',
                  '  CR --> GJ[Run Glue job]',
                  '  GJ --> LD[Load Redshift]',
                  '  GJ -.on error.-> SNS[Notify SNS]',
                ],
                caption: 'EventBridge starts a Step Functions workflow that crawls, transforms and loads, with error notifications via SNS.',
              },
              exercises: [
                {
                  type: 'quiz',
                  prompt:
                    'A pipeline must run a crawler, then a Glue job only if the crawler succeeds, retry transient failures, and alert on permanent failure. What orchestrates this best?',
                  solution: {
                    explanation: 'AWS Step Functions — a state machine with .sync task states, Retry on transient errors, Choice/sequencing for the dependency, and a Catch that publishes to SNS.',
                  },
                },
                {
                  type: 'quiz',
                  prompt: 'How would you start that pipeline automatically every night at 02:00 UTC?',
                  solution: { explanation: 'An EventBridge scheduled rule (cron) that targets the Step Functions state machine.' },
                },
                {
                  type: 'predict',
                  prompt: 'You need to process 10,000 files in parallel through the same steps. Which Step Functions feature?',
                  solution: { explanation: 'The Map state (distributed map) fans the workflow out across all items, running the same steps in parallel.' },
                },
              ],
              docs: 'https://docs.aws.amazon.com/step-functions/latest/dg/welcome.html',
            },
            {
              id: 'dea1-t4-c1',
              services: [{ icon: 'analytics', label: 'Amazon MWAA' }, { icon: 'analytics', label: 'Apache Airflow' }],
              title: 'Amazon MWAA (Managed Workflows for Apache Airflow)',
              summary:
                'Amazon MWAA runs managed Apache Airflow, where pipelines are defined as Python DAGs. It suits complex, code-defined data workflows with many dependencies, parameterisation and a rich operator/provider ecosystem.',
              explanation:
                "Amazon Managed Workflows for Apache Airflow (MWAA) provisions and maintains an Apache Airflow environment — scheduler, workers and web UI — so you write workflows as DAGs (directed acyclic graphs) in Python and let AWS handle the infrastructure, scaling, patching and security integration. Airflow excels at complex orchestration: dynamic, parameterised pipelines, rich scheduling with backfills and catchup, dependency graphs across hundreds of tasks, and a large library of operators/providers to call Glue, EMR, Redshift, Athena, S3 and external systems. DAG files live in S3, and MWAA scales workers to demand. Choose MWAA when teams already know Airflow, need its Python expressiveness and ecosystem, or must orchestrate heterogeneous systems beyond AWS; choose Step Functions for serverless, pay-per-transition orchestration tightly integrated with AWS services and minimal operational footprint. Both are valid; the exam tests when each is the better fit.",
              keyPoints: [
                'MWAA = managed Apache Airflow: AWS runs the scheduler/workers/UI; you write Python DAGs.',
                'Strong at complex, dynamic, parameterised pipelines with backfills, catchup and many dependencies.',
                'Large operator/provider ecosystem to call Glue, EMR, Redshift, Athena, S3 and non-AWS systems.',
                'DAGs stored in S3; environment scales workers to demand.',
                'Choose MWAA for Airflow familiarity, Python expressiveness, hybrid/heterogeneous orchestration.',
                'Choose Step Functions for serverless, low-ops, pay-per-transition AWS-native orchestration.',
              ],
              commonMistakes: [
                'Picking MWAA for a simple two-step AWS-only pipeline where Step Functions is cheaper and lower-effort.',
                'Forgetting MWAA runs an always-on environment (cost) versus Step Functions\' pay-per-use model.',
              ],
              exercises: [
                {
                  type: 'quiz',
                  prompt:
                    'A data team already maintains hundreds of Airflow DAGs on-premises with custom operators and needs to keep that approach with less operational overhead. Which AWS service?',
                  solution: { explanation: 'Amazon MWAA — managed Apache Airflow, so existing Python DAGs and operators move over with AWS running the infrastructure.' },
                },
                {
                  type: 'quiz',
                  prompt: 'A new, AWS-only pipeline has three serverless steps and the team wants the lowest operational footprint and pay-per-use pricing. Step Functions or MWAA?',
                  solution: { explanation: 'Step Functions — serverless, deeply integrated with AWS services, and billed per state transition with no always-on environment.' },
                },
              ],
              docs: 'https://docs.aws.amazon.com/mwaa/latest/userguide/what-is-mwaa.html',
            },
          ],
        },
      ],
    },

    /* ──────────────────── DOMAIN 2 — DATA STORE MANAGEMENT (26%) ──────────────────── */
    {
      level: 2,
      name: 'Data Store Management',
      focus: 'Choosing and operating the right store — S3 data lakes, Redshift, RDS/Aurora, DynamoDB — with partitioning, file formats and lifecycle (Domain 2 · 26%)',
      accent: '#7c4ddb',
      soft: '#f1ebfd',
      topics: [
        {
          id: 'dea2-t0',
          name: 'S3 data lakes',
          concepts: [
            {
              id: 'dea2-t0-c0',
              services: [{ icon: 's3', label: 'Amazon S3' }],
              title: 'S3 as a data lake: zones, storage classes and lifecycle',
              summary:
                'Amazon S3 is the foundation of most AWS data lakes: virtually unlimited, durable object storage that decouples storage from compute. Layered zones (raw, cleaned, curated) and lifecycle rules manage data through its life and cost.',
              explanation:
                "A data lake stores raw and processed data of any structure in one place, cheaply and durably, while many engines (Athena, Redshift Spectrum, EMR, Glue) read it directly. S3 fits this because it offers 11 nines of durability, scales without limit, and separates storage from compute so you size and pay for each independently. A common layout uses zones (often as bucket prefixes): a raw/landing zone holds untouched ingested data, a cleaned/standardised zone holds validated and de-duplicated data, and a curated/conformed zone holds analytics-ready, partitioned columnar tables. Storage classes match cost to access: S3 Standard for hot data, Intelligent-Tiering to auto-move objects by usage, Standard-IA/One Zone-IA for infrequent access, and Glacier tiers for archives. Lifecycle rules transition objects between classes as they age and expire or delete old data automatically, while object versioning and S3 Object Lock protect against accidental or malicious deletion. Keeping data in open formats (Parquet) and a documented zone structure avoids the data-lake-turned-swamp problem.",
              analogy:
                'A data lake is a vast warehouse: the loading dock (raw zone) takes deliveries as-is, the sorting floor (cleaned zone) checks and labels them, and the showroom (curated zone) displays finished, well-organised goods ready for customers (analysts).',
              keyPoints: [
                'S3 = durable (11 nines), unlimited object storage; decouples storage from compute.',
                'Zone the lake: raw/landing → cleaned/standardised → curated/conformed (usually prefixes).',
                'Storage classes: Standard, Intelligent-Tiering, Standard-IA/One Zone-IA, Glacier (archive).',
                'Lifecycle rules transition classes by age and expire/delete old data automatically.',
                'Versioning and Object Lock guard against accidental/malicious deletion.',
                'Use open columnar formats (Parquet) and clear structure to avoid a data swamp.',
              ],
              commonMistakes: [
                'Leaving cold archive data in S3 Standard instead of transitioning to Glacier via lifecycle rules.',
                'Dumping everything into one undocumented prefix — the lake becomes an unqueryable swamp.',
                'Relying on S3 Standard for a single AZ — note One Zone-IA stores in one AZ only (cheaper, less resilient).',
              ],
              diagram: {
                type: 'mermaid',
                lines: [
                  'flowchart LR',
                  '  In[Ingestion] --> Raw[Raw zone<br/>as-is]',
                  '  Raw --> Clean[Cleaned zone<br/>validated]',
                  '  Clean --> Cur[Curated zone<br/>Parquet, partitioned]',
                  '  Cur --> Q[Athena / Redshift / EMR]',
                  '  Raw -.lifecycle.-> Glacier[(Glacier archive)]',
                ],
                caption: 'Data flows through raw, cleaned and curated zones; lifecycle rules archive cold data to Glacier.',
              },
              exercises: [
                {
                  type: 'quiz',
                  prompt:
                    'Raw landing data must be kept for seven years for compliance but is almost never read after 30 days. How do you minimise storage cost automatically?',
                  solution: {
                    explanation:
                      'Add an S3 lifecycle rule that transitions objects to a Glacier class (e.g. Glacier Deep Archive) after 30 days and expires them after seven years.',
                  },
                },
                {
                  type: 'quiz',
                  prompt: 'Why is S3 a better data-lake foundation than putting all data on an EMR HDFS cluster?',
                  solution: {
                    explanation: 'S3 decouples storage from compute (durable, unlimited, independently scaled and cheap), so clusters can be transient and many engines query the same data; HDFS ties storage to running nodes.',
                  },
                },
                {
                  type: 'task',
                  prompt: 'Name the three typical zones of a data lake and what each holds.',
                  solution: {
                    explanation: 'Raw/landing (untouched ingested data), cleaned/standardised (validated, de-duplicated data), curated/conformed (analytics-ready, partitioned columnar tables).',
                  },
                },
              ],
              docs: 'https://docs.aws.amazon.com/AmazonS3/latest/userguide/object-lifecycle-mgmt.html',
            },
            {
              id: 'dea2-t0-c1',
              services: [{ icon: 'analytics', label: 'Apache Parquet' }, { icon: 's3', label: 'Amazon S3' }],
              title: 'File formats, compression and partitioning',
              summary:
                'How you store data in the lake hugely affects cost and speed. Columnar formats (Parquet, ORC) with compression scan far less data than row formats (CSV, JSON), and partitioning lets engines skip irrelevant files entirely.',
              explanation:
                "Format choice is a core data-engineering decision. Row formats like CSV and JSON store whole records together and are simple but force engines to read every column of every row. Columnar formats like Apache Parquet and ORC store values by column, so a query touching three of fifty columns reads only those columns, and they compress well because similar values sit together — dramatically cutting bytes scanned (and Athena cost). Avro is row-based but compact with a strong schema, popular for streaming/serialisation. Compression (Snappy for speed, GZIP/ZSTD for ratio) shrinks files further; splittable compression (e.g. Snappy on Parquet, bzip2) lets engines parallelise reads, whereas non-splittable GZIP on a giant CSV forces a single reader. Partitioning physically organises data into folders by a key (commonly date: year=/month=/day=) so a filtered query prunes to only the relevant partitions — partition pruning is one of the biggest performance wins. Aim for moderate file sizes (roughly 128 MB–1 GB): too many tiny files add overhead and slow queries; merge them in compaction jobs.",
              keyPoints: [
                'Columnar (Parquet/ORC) reads only needed columns and compresses well — best for analytics.',
                'Row formats (CSV/JSON) are simple but scan everything; Avro is compact row-based for streaming.',
                'Compression: Snappy (fast, splittable on Parquet) vs GZIP/ZSTD (higher ratio).',
                'Partition by a high-value filter key (often date) so engines prune irrelevant files.',
                'Avoid the small-files problem — aim for ~128 MB–1 GB files; compact tiny files.',
                'Less data scanned = faster queries and lower Athena/Spectrum cost.',
              ],
              commonMistakes: [
                'Querying huge GZIP-compressed CSV and getting single-threaded, slow scans — non-splittable compression blocks parallelism.',
                'Over-partitioning (e.g. by a high-cardinality ID) creating millions of tiny partitions and files, which hurts performance.',
                'Storing analytics data as JSON and paying to scan every field on every query.',
              ],
              diagram: {
                type: 'mermaid',
                lines: [
                  'flowchart LR',
                  '  Q[Query: 3 of 50 cols<br/>WHERE date = today] --> P{Storage?}',
                  '  P --> CSV[Row CSV<br/>scan all cols, all dates]',
                  '  P --> PAR[Parquet + partitions<br/>scan 3 cols, 1 partition]',
                  '  PAR --> Cheap[Far less scanned = cheaper, faster]',
                ],
                caption: 'Columnar Parquet plus date partitioning lets a query read only the needed columns and partitions, scanning a fraction of the data.',
              },
              exercises: [
                {
                  type: 'quiz',
                  prompt:
                    'Athena costs are high because queries select a few columns from wide JSON logs but scan the whole files. What format change helps most?',
                  solution: {
                    explanation: 'Convert to columnar Parquet (with Snappy compression): queries then read only the selected columns and far fewer bytes, cutting cost and latency.',
                  },
                },
                {
                  type: 'quiz',
                  prompt: 'Why does partitioning a table by event_date speed up date-filtered queries?',
                  solution: { explanation: 'Partition pruning — the engine reads only the folders matching the filter and skips all other partitions/files.' },
                },
                {
                  type: 'predict',
                  prompt: 'A pipeline writes one 5 KB Parquet file per record, producing millions of files. What problem arises?',
                  solution: {
                    explanation: 'The small-files problem: huge per-file overhead, slow listing and reads, and poor parallelism. Compact into larger files (~128 MB–1 GB).',
                  },
                },
              ],
              docs: 'https://docs.aws.amazon.com/athena/latest/ug/columnar-storage.html',
            },
          ],
        },
        {
          id: 'dea2-t1',
          name: 'Lake Formation & governed lakes',
          concepts: [
            {
              id: 'dea2-t1-c0',
              services: [{ icon: 'security', label: 'AWS Lake Formation' }, { icon: 'glue', label: 'Glue Data Catalog' }],
              title: 'AWS Lake Formation: building and governing a data lake',
              summary:
                'AWS Lake Formation simplifies building a secure data lake on S3, layering fine-grained, catalog-based permissions (database, table, column, row and cell level) on top of the Glue Data Catalog so you grant access centrally instead of writing complex S3/IAM policies.',
              explanation:
                "AWS Lake Formation sits on top of S3 and the Glue Data Catalog to make a data lake easier to set up and govern. It helps register S3 locations, run blueprints and crawlers to ingest and catalogue data, and — most importantly for the exam — provides fine-grained access control using simple grant/revoke on catalog resources rather than sprawling S3 bucket policies and IAM. You grant principals permissions on databases, tables, specific columns, and even rows and cells (via data filters), and Lake Formation enforces them consistently across integrated engines like Athena, Redshift Spectrum, EMR and Glue. Tag-based access control (LF-Tags) lets you attach tags to catalog resources and grant on tags, scaling permissions across thousands of tables. Lake Formation can replace or complement IAM for data access: instead of saying which S3 prefixes a role can read, you say which tables and columns a user may query. It centralises governance, supports cross-account data sharing, and underpins data mesh patterns.",
              analogy:
                'If S3 is the warehouse and the Glue Catalog is the index of what is on each shelf, Lake Formation is the front desk that checks each visitor\'s pass and lets them into only the rooms, aisles — even the specific bins — they are allowed to see.',
              keyPoints: [
                'Lake Formation builds and governs an S3 data lake on top of the Glue Data Catalog.',
                'Fine-grained permissions: database, table, column, row and cell level via simple grant/revoke.',
                'Enforced consistently across Athena, Redshift Spectrum, EMR and Glue.',
                'LF-Tags (tag-based access control) scale permissions across many tables.',
                'Replaces complex S3/IAM data policies with catalog-level grants; supports cross-account sharing.',
                'Foundation for data mesh and centralised lake governance.',
              ],
              commonMistakes: [
                'Trying to enforce column- or row-level access with S3 bucket policies — that needs Lake Formation fine-grained permissions.',
                'Forgetting that, once Lake Formation manages a location, queries need Lake Formation grants, not just IAM S3 access.',
              ],
              diagram: {
                type: 'mermaid',
                lines: [
                  'flowchart TB',
                  '  S3[(S3 data lake)] --> LF[Lake Formation<br/>register + permissions]',
                  '  DC[(Glue Data Catalog)] --> LF',
                  '  LF -->|grant table/column/row| U1[Analyst: sales only]',
                  '  LF -->|grant via LF-Tags| U2[Engineer: all PII-free]',
                ],
                caption: 'Lake Formation governs catalog access at table, column and row level for principals querying the S3 lake.',
              },
              exercises: [
                {
                  type: 'quiz',
                  prompt:
                    'Analysts may query a customer table but must not see the ssn or email columns. What is the cleanest way to enforce this?',
                  hint: 'Think catalog-level, not S3 policies.',
                  solution: {
                    explanation:
                      'Use AWS Lake Formation column-level permissions: grant SELECT on the table excluding the ssn and email columns, enforced across Athena and other engines.',
                  },
                },
                {
                  type: 'quiz',
                  prompt: 'You manage thousands of tables and want to grant access by data classification rather than table by table. What feature?',
                  solution: { explanation: 'LF-Tags (tag-based access control) — tag catalog resources and grant permissions on the tags.' },
                },
                {
                  type: 'predict',
                  prompt: 'After registering a bucket with Lake Formation, a role with full S3 IAM read access suddenly cannot query the table. Why?',
                  solution: {
                    explanation: 'Lake Formation now governs access; the role needs Lake Formation grants on the database/table in addition to (or instead of) raw S3 IAM permissions.',
                  },
                },
              ],
              docs: 'https://docs.aws.amazon.com/lake-formation/latest/dg/what-is-lake-formation.html',
            },
          ],
        },
        {
          id: 'dea2-t2',
          name: 'Data warehousing with Redshift',
          concepts: [
            {
              id: 'dea2-t2-c0',
              services: [{ icon: 'redshift', label: 'Amazon Redshift' }],
              title: 'Amazon Redshift architecture: columnar MPP, distribution and sort keys',
              summary:
                'Redshift is a petabyte-scale columnar, massively parallel processing (MPP) data warehouse for analytics. Distribution keys control how rows spread across compute nodes, and sort keys order data on disk — both decisive for query performance.',
              explanation:
                "Amazon Redshift is built for OLAP analytics over very large datasets, not transactional workloads. It stores data column-by-column (great compression, scans only needed columns) and runs queries in parallel across slices on multiple compute nodes (MPP), coordinated by a leader node. Two physical design choices dominate performance. The distribution style decides how a table's rows are spread across nodes: KEY distribution co-locates rows sharing a join key (so joins happen locally without shuffling), ALL replicates a small table to every node (fast joins to dimensions), and EVEN spreads rows round-robin (when no obvious key). Picking a distribution key that matches join keys avoids costly data movement; a poor choice causes skew (uneven node load). The sort key orders rows on disk so range-restricted scans skip blocks via zone maps — a compound sort key suits queries that filter on the leading columns, an interleaved sort key gives more even weight to several filter columns. RA3 nodes with managed storage separate compute from storage (scale independently, pay for what you store), and Redshift Serverless removes cluster sizing entirely.",
              keyPoints: [
                'Redshift = columnar MPP data warehouse for OLAP analytics (not OLTP).',
                'Leader node plans; compute nodes/slices run queries in parallel.',
                'Distribution style: KEY (co-locate join keys), ALL (replicate small tables), EVEN (round-robin).',
                'Good distribution key matches joins to avoid shuffles; bad choice causes skew.',
                'Sort key orders data so zone maps skip blocks on range filters (compound vs interleaved).',
                'RA3 + managed storage separate compute/storage; Redshift Serverless removes sizing.',
              ],
              commonMistakes: [
                'Using Redshift for high-frequency transactional writes — it is for analytics (OLAP), not OLTP.',
                'Choosing a distribution key that does not match join columns, forcing expensive data redistribution.',
                'Setting a distribution key on a low-cardinality column, causing heavy data skew on a few nodes.',
              ],
              diagram: {
                type: 'mermaid',
                lines: [
                  'flowchart TB',
                  '  L[Leader node<br/>plan + aggregate] --> N1[Compute node 1<br/>slices]',
                  '  L --> N2[Compute node 2<br/>slices]',
                  '  N1 --> S3[(Managed storage / RA3)]',
                  '  N2 --> S3',
                ],
                caption: 'Redshift MPP: the leader node distributes work to compute nodes that scan columnar data in parallel; RA3 uses managed storage.',
              },
              exercises: [
                {
                  type: 'quiz',
                  prompt:
                    'A large fact table is always joined to a customer dimension on customer_id, and the join is slow due to data movement. What distribution choice helps?',
                  solution: {
                    explanation: 'Set the distribution key to customer_id on the fact table (and align the dimension), so matching rows co-locate on the same node and the join runs locally without redistribution.',
                  },
                },
                {
                  type: 'quiz',
                  prompt: 'A small dimension table is joined to many large tables. What distribution style avoids shuffling it repeatedly?',
                  solution: { explanation: 'ALL distribution — replicate the small table to every node so joins are local.' },
                },
                {
                  type: 'task',
                  prompt: 'Queries mostly filter on order_date. What design speeds these scans?',
                  solution: {
                    explanation: 'Use order_date as a (leading) sort key so zone maps let Redshift skip blocks outside the date range, reading far fewer blocks.',
                  },
                },
              ],
              docs: 'https://docs.aws.amazon.com/redshift/latest/dg/c_high_level_system_architecture.html',
            },
            {
              id: 'dea2-t2-c1',
              services: [{ icon: 'redshift', label: 'Amazon Redshift' }, { icon: 's3', label: 'Amazon S3' }],
              title: 'Loading and querying Redshift: COPY, Spectrum and workload management',
              summary:
                'The COPY command bulk-loads data from S3 into Redshift in parallel, Redshift Spectrum queries data in S3 without loading it, and workload management (WLM) plus features like concurrency scaling and materialized views tune performance.',
              explanation:
                "Getting data into and out of Redshift efficiently matters as much as schema design. COPY is the right way to load — it ingests files from S3 (or DynamoDB, EMR) in parallel across slices, far faster than row-by-row INSERTs; splitting input into multiple files (ideally a multiple of the slice count) and using compressed columnar inputs maximises throughput. Redshift Spectrum lets you run SQL over data still sitting in S3 (using external tables defined in the Glue Data Catalog), so you can join warehouse tables to vast lake data without loading it — pay per TB scanned, and partition the S3 data to prune. For concurrency, workload management (WLM, often automatic) allocates memory and queues to queries; concurrency scaling spins up transient capacity during spikes; materialized views precompute and incrementally refresh expensive aggregations; and Redshift maintenance (VACUUM to reclaim space and re-sort, ANALYZE to update statistics) keeps performance healthy, though RA3/serverless automate much of this. A frequent pattern: land raw data in S3, transform with Glue, COPY curated data into Redshift, and use Spectrum for cold/archival data.",
              keyPoints: [
                'COPY bulk-loads from S3 in parallel across slices — far faster than INSERTs.',
                'Split input into multiple (ideally slice-count-multiple) compressed files for max load throughput.',
                'Redshift Spectrum queries S3 data via external (Glue catalog) tables without loading; partition to prune.',
                'WLM/automatic WLM manages query queues and memory; concurrency scaling absorbs spikes.',
                'Materialized views precompute expensive aggregations; VACUUM/ANALYZE maintain performance.',
                'Pattern: S3 raw → Glue transform → COPY curated to Redshift → Spectrum for cold data.',
              ],
              commonMistakes: [
                'Loading with single-row INSERTs instead of COPY, which is slow and inefficient at scale.',
                'Querying everything in Redshift Spectrum without partitioning the S3 data, scanning (and paying for) too much.',
                'Neglecting VACUUM/ANALYZE on older clusters, leading to bloated, poorly sorted tables and stale stats.',
              ],
              code: {
                language: 'sql',
                lines: [
                  'COPY curated.sales',
                  "FROM 's3://lake/curated/sales/'",
                  "IAM_ROLE 'arn:aws:iam::123456789012:role/RedshiftLoad'",
                  'FORMAT AS PARQUET;',
                  '-- Query cold data still in S3 without loading it:',
                  'SELECT region, SUM(amount)',
                  'FROM spectrum.sales_archive  -- external Glue table',
                  "WHERE sale_year = '2019'",
                  'GROUP BY region;',
                ],
                explanation:
                  'COPY bulk-loads Parquet from S3 using an IAM role; a Redshift Spectrum external table then queries archived S3 data in place without loading it.',
              },
              exercises: [
                {
                  type: 'quiz',
                  prompt:
                    'A nightly job loads 200 GB into Redshift but is slow. It uses many individual INSERT statements. What should it use instead?',
                  solution: { explanation: 'The COPY command from S3, which loads files in parallel across all slices, dramatically faster than INSERTs.' },
                },
                {
                  type: 'quiz',
                  prompt: 'Analysts occasionally join recent warehouse data to several years of cold history kept in S3, which is too big to load. What lets them query it in place?',
                  solution: { explanation: 'Redshift Spectrum — external tables over the S3 data (defined in the Glue Data Catalog), partitioned to limit data scanned.' },
                },
                {
                  type: 'predict',
                  prompt: 'During business hours, a burst of dashboard queries queues up and slows down. Which feature can absorb the spike automatically?',
                  solution: { explanation: 'Concurrency scaling — Redshift adds transient cluster capacity to handle the burst, then removes it.' },
                },
              ],
              docs: 'https://docs.aws.amazon.com/redshift/latest/dg/r_COPY.html',
            },
          ],
        },
        {
          id: 'dea2-t3',
          name: 'Operational data stores',
          concepts: [
            {
              id: 'dea2-t3-c0',
              services: [{ icon: 'rds', label: 'Amazon RDS' }, { icon: 'aurora', label: 'Amazon Aurora' }],
              title: 'RDS and Aurora for transactional sources',
              summary:
                'RDS and Aurora are managed relational (OLTP) databases that often serve as the operational source for data pipelines. Multi-AZ provides high availability, read replicas scale reads, and CDC feeds analytics downstream.',
              explanation:
                "Amazon RDS manages relational engines (MySQL, PostgreSQL, MariaDB, Oracle, SQL Server), handling provisioning, patching, backups and failover, while Amazon Aurora is AWS's MySQL- and PostgreSQL-compatible engine built for higher throughput and availability with storage automatically replicated across AZs. For a data engineer, these are usually the transactional sources feeding the lake/warehouse rather than the analytics store. Key operational features: Multi-AZ deployments keep a synchronous standby for automatic failover (high availability); read replicas use asynchronous replication to offload read traffic and analytics queries from the primary; automated backups and snapshots enable point-in-time recovery. To bring this OLTP data into analytics without overloading the source, you use DMS CDC (reading the binlog/WAL) or Aurora's integrations — including zero-ETL integrations that automatically replicate Aurora data into Redshift for near-real-time analytics without building pipelines. Run analytics off replicas or replicated copies, never against the production primary, to protect transactional performance.",
              keyPoints: [
                'RDS/Aurora = managed relational OLTP — typically the source feeding analytics, not the analytics store.',
                'Multi-AZ = synchronous standby for automatic failover (high availability).',
                'Read replicas = async copies to offload reads/analytics from the primary.',
                'Backups/snapshots provide point-in-time recovery.',
                'Move data to analytics via DMS CDC or Aurora zero-ETL integration with Redshift.',
                'Run analytics on replicas/replicated copies, never the production primary.',
              ],
              commonMistakes: [
                'Running heavy analytics directly on the production OLTP primary, degrading transactional performance.',
                'Confusing Multi-AZ (HA/failover) with read replicas (read scaling) — they solve different problems.',
                'Treating RDS as an analytics warehouse instead of using Redshift for large OLAP workloads.',
              ],
              diagram: {
                type: 'mermaid',
                lines: [
                  'flowchart LR',
                  '  App[App writes] --> Pri[(RDS/Aurora primary)]',
                  '  Pri -->|sync| Sb[(Multi-AZ standby)]',
                  '  Pri -->|async| RR[(Read replica)]',
                  '  Pri -->|CDC / zero-ETL| Ana[(S3 lake / Redshift)]',
                ],
                caption: 'A relational source: synchronous standby for failover, async read replica for reads, and CDC/zero-ETL feeding analytics.',
              },
              exercises: [
                {
                  type: 'quiz',
                  prompt:
                    'Analysts run heavy reporting queries that slow the production Aurora database. How do you offload them with minimal impact?',
                  solution: {
                    explanation: 'Direct reporting queries to an Aurora read replica (async copy), or replicate to Redshift via zero-ETL/CDC, keeping the primary free for transactions.',
                  },
                },
                {
                  type: 'quiz',
                  prompt: 'A team wants near-real-time analytics on Aurora data in Redshift without building and maintaining an ETL pipeline. What enables this?',
                  solution: { explanation: 'Aurora zero-ETL integration with Amazon Redshift, which automatically replicates data for analytics.' },
                },
              ],
              docs: 'https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/Welcome.html',
            },
            {
              id: 'dea2-t3-c1',
              services: [{ icon: 'dynamodb', label: 'Amazon DynamoDB' }],
              title: 'DynamoDB for high-scale key-value data and streams',
              summary:
                'DynamoDB is a serverless NoSQL key-value/document database with single-digit-millisecond latency at any scale. Its keys, indexes and DynamoDB Streams matter for data engineers integrating it into pipelines.',
              explanation:
                "Amazon DynamoDB stores items in tables identified by a primary key: either a partition key alone, or a partition key plus a sort key (composite). The partition key is hashed to place items across partitions, so a well-distributed, high-cardinality partition key avoids hot partitions and throttling; the sort key enables range queries within a partition. Access patterns drive the design — you model the table around the queries you must serve, not normalised relations. Secondary indexes broaden access: a Global Secondary Index (GSI) allows querying on different attributes with its own throughput, while a Local Secondary Index (LSI) adds alternate sort keys within the same partition key. Capacity is on-demand (auto-scales, pay per request) or provisioned (set read/write capacity units, optionally with auto scaling). For pipelines, DynamoDB Streams capture an ordered log of item-level changes (insert/modify/remove) that can trigger Lambda or feed Kinesis — enabling CDC-style ingestion of operational NoSQL data into a lake or warehouse. You can also export tables to S3 for analytics without consuming table capacity.",
              keyPoints: [
                'Serverless NoSQL: single-digit-ms latency at any scale; primary key = partition key (+ optional sort key).',
                'High-cardinality partition key avoids hot partitions and throttling; design around access patterns.',
                'GSI = query on other attributes (own throughput); LSI = alternate sort key, same partition key.',
                'Capacity: on-demand (pay per request) vs provisioned (RCU/WCU, with auto scaling).',
                'DynamoDB Streams = ordered change log triggering Lambda/Kinesis (CDC into the lake).',
                'Export to S3 for analytics without consuming table read capacity.',
              ],
              commonMistakes: [
                'Choosing a low-cardinality partition key, creating a hot partition that throttles despite available capacity.',
                'Treating DynamoDB like a relational DB with ad hoc joins — model around known access patterns instead.',
                'Running heavy analytical scans against the live table instead of exporting to S3 or using streams.',
              ],
              code: {
                language: 'json',
                lines: [
                  '{',
                  '  "TableName": "Orders",',
                  '  "KeySchema": [',
                  '    { "AttributeName": "customerId", "KeyType": "HASH" },',
                  '    { "AttributeName": "orderId", "KeyType": "RANGE" }',
                  '  ],',
                  '  "StreamSpecification": {',
                  '    "StreamEnabled": true,',
                  '    "StreamViewType": "NEW_AND_OLD_IMAGES"',
                  '  }',
                  '}',
                ],
                explanation:
                  'A DynamoDB table keyed by customerId (partition) + orderId (sort), with Streams enabled so item changes can trigger downstream ingestion via Lambda or Kinesis.',
              },
              exercises: [
                {
                  type: 'quiz',
                  prompt:
                    'You need every change to a DynamoDB orders table reflected in the S3 data lake in near real time. What feature provides the change feed?',
                  solution: {
                    explanation: 'DynamoDB Streams — an ordered item-level change log that triggers a Lambda function (or feeds Kinesis/Firehose) to land changes in S3.',
                  },
                },
                {
                  type: 'quiz',
                  prompt: 'A table experiences throttling even though provisioned capacity looks high. The partition key is "country" and most traffic is one country. What is wrong?',
                  solution: {
                    explanation: 'A hot partition: low-cardinality partition key concentrates traffic on one partition. Choose a higher-cardinality key (or add a suffix) to spread load.',
                  },
                },
                {
                  type: 'task',
                  prompt: 'How can you run large analytical queries over DynamoDB data without hurting the table\'s production traffic?',
                  solution: {
                    explanation: 'Use the DynamoDB export-to-S3 feature (no table read capacity consumed) and query the export with Athena, or analyse a stream-fed copy in the lake.',
                  },
                },
              ],
              docs: 'https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/Introduction.html',
            },
          ],
        },
      ],
    },

    /* ─────────────────── DOMAIN 3 — DATA OPERATIONS AND SUPPORT (22%) ─────────────────── */
    {
      level: 3,
      name: 'Operations & Support',
      focus: 'Monitoring, troubleshooting, automating and serving pipelines and data — CloudWatch, data quality, Athena and QuickSight (Domain 3 · 22%)',
      accent: '#e8862a',
      soft: '#fff1e2',
      topics: [
        {
          id: 'dea3-t0',
          name: 'Monitoring & logging',
          concepts: [
            {
              id: 'dea3-t0-c0',
              services: [{ icon: 'cloudwatch', label: 'Amazon CloudWatch' }, { icon: 'cloudtrail', label: 'AWS CloudTrail' }],
              title: 'Monitoring pipelines with CloudWatch, logs, metrics and alarms',
              summary:
                'CloudWatch collects metrics, logs and events from data services so you can build dashboards, set alarms on failures or lag, and trigger automated responses; CloudTrail records the API calls behind pipeline changes for auditing.',
              explanation:
                "Operating data pipelines means knowing when jobs fail, lag or run hot. Amazon CloudWatch is the central observability service: it ingests metrics from Glue (job run status, DPU usage), Kinesis (IteratorAgeMilliseconds, incoming/outgoing bytes), Firehose (delivery success), Redshift (query duration, CPU), Lambda (errors, duration, throttles) and more. CloudWatch Logs centralises log output (e.g. Glue/EMR/Lambda logs), and Logs Insights runs queries over them to find errors. CloudWatch Alarms watch a metric against a threshold and act — notify via SNS, or trigger automation — for example alarm when a Kinesis consumer's iterator age grows (it is falling behind) or a Glue job's failure count rises. CloudWatch dashboards visualise pipeline health at a glance, and EventBridge can react to service events (a Glue job state change, a Step Functions failure). Separately, AWS CloudTrail logs the API activity — who changed a crawler, who deleted a table — for governance and forensics, distinct from CloudWatch's performance focus. Together they answer both what is happening (CloudWatch) and who did what (CloudTrail).",
              keyPoints: [
                'CloudWatch ingests metrics/logs from Glue, Kinesis, Firehose, Redshift, Lambda, EMR, etc.',
                'CloudWatch Logs centralises logs; Logs Insights queries them to find errors.',
                'Alarms watch a metric vs threshold and notify (SNS) or trigger automation.',
                'Key streaming metric: Kinesis IteratorAgeMilliseconds rising = consumer falling behind.',
                'EventBridge reacts to service events (job state changes, workflow failures).',
                'CloudTrail = audit of API calls (who/what/when); CloudWatch = performance/operational signals.',
              ],
              commonMistakes: [
                'Confusing CloudWatch (metrics/monitoring) with CloudTrail (API audit log).',
                'Not alarming on Kinesis iterator age, so consumers silently fall behind and data goes stale.',
                'Relying on success logs only — alarm on failures and SLA breaches, not just look at dashboards.',
              ],
              diagram: {
                type: 'mermaid',
                lines: [
                  'flowchart LR',
                  '  Svc[Glue / Kinesis / Lambda] --> CW[CloudWatch metrics + logs]',
                  '  CW --> AL[Alarm: lag / errors]',
                  '  AL --> SNS[SNS notify on-call]',
                  '  API[Console / API actions] --> CT[CloudTrail audit log]',
                ],
                caption: 'CloudWatch monitors pipeline health and alarms to SNS; CloudTrail separately records who performed which API actions.',
              },
              exercises: [
                {
                  type: 'quiz',
                  prompt:
                    'A streaming consumer is processing data hours late. Which CloudWatch metric reveals it is falling behind, and what should you do?',
                  hint: 'It measures how old the records being read are.',
                  solution: {
                    explanation:
                      'A rising IteratorAgeMilliseconds on the Kinesis stream shows the consumer is lagging. Alarm on it via SNS and scale out consumers/shards (or enable enhanced fan-out) to catch up.',
                  },
                },
                {
                  type: 'quiz',
                  prompt: 'An auditor asks who deleted a Glue table last Tuesday. Which service holds that answer?',
                  solution: { explanation: 'AWS CloudTrail — it records the API call, the identity, the time and the source.' },
                },
                {
                  type: 'task',
                  prompt: 'How do you get paged automatically when a nightly Glue job fails?',
                  solution: {
                    explanation: 'Create a CloudWatch alarm on the job\'s failure metric (or an EventBridge rule on the Glue job state change) targeting an SNS topic subscribed by the on-call channel.',
                  },
                },
              ],
              docs: 'https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/WhatIsCloudWatch.html',
            },
          ],
        },
        {
          id: 'dea3-t1',
          name: 'Data quality & troubleshooting',
          concepts: [
            {
              id: 'dea3-t1-c0',
              services: [{ icon: 'glue', label: 'Glue Data Quality' }],
              title: 'Data quality with Glue Data Quality and validation',
              summary:
                'Data quality means the data is accurate, complete, consistent and timely. AWS Glue Data Quality lets you define and measure rules (completeness, uniqueness, freshness, ranges) on catalog tables or in ETL jobs, catching bad data before it reaches consumers.',
              explanation:
                "Garbage in, garbage out: a pipeline that loads silently broken data is worse than one that fails loudly. Data quality is usually measured along dimensions — completeness (no missing required values), uniqueness (no unexpected duplicates), validity (values match a type/format/range), consistency (matches other sources), accuracy and timeliness/freshness. AWS Glue Data Quality (built on the open-source Deequ engine) lets you define rules in a simple rule language (DQDL) and run them either as a step inside a Glue ETL job or against a Data Catalog table on a schedule. It can recommend rules by profiling the data, then evaluate them and emit results and metrics to CloudWatch and to S3; you can fail or branch the pipeline when quality drops below a threshold, and route bad rows to a quarantine location for investigation. Building quality checks into the pipeline — validate on ingest, assert row counts and key uniqueness after a load, alarm on anomalies — prevents corrupt data from corrupting dashboards and models, and makes troubleshooting (missing partitions, schema drift, duplicate loads) far faster.",
              keyPoints: [
                'Quality dimensions: completeness, uniqueness, validity, consistency, accuracy, timeliness.',
                'Glue Data Quality (Deequ-based) defines rules in DQDL on catalog tables or inside ETL jobs.',
                'Can profile data to recommend rules, then evaluate and emit metrics to CloudWatch/S3.',
                'Fail or branch the pipeline below a quality threshold; quarantine bad rows.',
                'Validate on ingest and after loads (row counts, key uniqueness, ranges) to stop GIGO.',
                'Good checks speed troubleshooting of schema drift, missing partitions and duplicate loads.',
              ],
              commonMistakes: [
                'Loading data with no validation, so downstream dashboards and models silently use corrupt data.',
                'Only checking that a job "succeeded" without asserting row counts, freshness or uniqueness.',
              ],
              code: {
                language: 'text',
                lines: [
                  'Rules = [',
                  '  IsComplete "order_id",',
                  '  IsUnique "order_id",',
                  '  ColumnValues "amount" >= 0,',
                  '  ColumnValues "status" in ["NEW","PAID","SHIPPED"],',
                  '  Completeness "customer_id" > 0.99',
                  ']',
                ],
                explanation:
                  'A Glue Data Quality (DQDL) ruleset asserting that order_id is present and unique, amounts are non-negative, status is from an allowed set, and customer_id is almost always populated.',
              },
              exercises: [
                {
                  type: 'quiz',
                  prompt:
                    'A daily load occasionally duplicates rows, breaking revenue reports. How do you catch this in the pipeline before publishing?',
                  solution: {
                    explanation: 'Add a Glue Data Quality rule asserting uniqueness on the primary key (and expected row counts); fail or quarantine the load when the rule is violated.',
                  },
                },
                {
                  type: 'quiz',
                  prompt: 'Name three data-quality dimensions you might enforce on an incoming dataset.',
                  solution: { explanation: 'Any three of: completeness, uniqueness, validity, consistency, accuracy, timeliness/freshness.' },
                },
                {
                  type: 'predict',
                  prompt: 'A source upstream adds a new column and drops another (schema drift). What symptoms appear, and how do quality/catalog checks help?',
                  solution: {
                    explanation: 'Jobs may fail or null out columns. A crawler/quality check detects the schema change and completeness drop, letting you branch or alert rather than silently corrupt outputs.',
                  },
                },
              ],
              docs: 'https://docs.aws.amazon.com/glue/latest/dg/glue-data-quality.html',
            },
          ],
        },
        {
          id: 'dea3-t2',
          name: 'Serving & analysing data',
          concepts: [
            {
              id: 'dea3-t2-c0',
              services: [{ icon: 'athena', label: 'Amazon Athena' }],
              title: 'Serving ad hoc queries with Athena and federated query',
              summary:
                'Athena serves serverless, pay-per-scan SQL over the data lake for analysts and applications, supports views and prepared statements, and can federate queries to other data sources via connectors.',
              explanation:
                "On the serving side, Athena is the low-friction way to let analysts and applications query the lake with standard SQL and no infrastructure. You point it at Glue Data Catalog tables over S3 and run queries, paying per TB scanned; results land in an S3 results location. Operationally, workgroups separate teams, enforce per-query data scan limits (a guardrail against runaway cost), and route results and cost reporting; you can also set query result reuse to serve cached results cheaply. Views and named/prepared queries package common logic for reuse. Athena Federated Query uses Lambda-based connectors to run SQL across other sources — DynamoDB, RDS/JDBC databases, Redshift, OpenSearch — joining lake data with operational data without first centralising it. Performance and cost on the lake come back to the same levers: columnar Parquet, compression and partition pruning. Athena suits interactive, on-demand analytics and serving query results to BI tools and apps; sustained, high-concurrency dashboards over a warehouse are usually better served by Redshift.",
              keyPoints: [
                'Athena = serverless SQL over S3 (and beyond), billed per TB scanned; results stored in S3.',
                'Workgroups isolate teams, cap per-query data scanned, and manage result locations/cost.',
                'Query result reuse caches results to serve repeated queries cheaply.',
                'Views and prepared/named queries package reusable logic.',
                'Federated Query uses Lambda connectors to query DynamoDB, RDS, Redshift, OpenSearch, etc.',
                'Best for interactive/ad hoc serving; high-concurrency dashboards favour Redshift.',
              ],
              commonMistakes: [
                'Letting any query scan unlimited data — set workgroup per-query data limits to control cost.',
                'Using Athena as a high-concurrency BI backend for hundreds of constant dashboard users — consider Redshift.',
              ],
              diagram: {
                type: 'mermaid',
                lines: [
                  'flowchart LR',
                  '  An[Analyst / BI tool] --> AT[Athena<br/>workgroup limits]',
                  '  AT --> S3[(S3 lake via Glue catalog)]',
                  '  AT -->|federated connector| DDB[(DynamoDB)]',
                  '  AT -->|federated connector| RDS[(RDS)]',
                ],
                caption: 'Athena serves SQL over the S3 lake and can federate to operational stores like DynamoDB and RDS via Lambda connectors.',
              },
              exercises: [
                {
                  type: 'quiz',
                  prompt:
                    'You want to stop any single Athena query from accidentally scanning more than 1 TB and racking up cost. What enforces this?',
                  solution: { explanation: 'A workgroup with a per-query data usage control limit, which cancels queries that exceed the scan threshold.' },
                },
                {
                  type: 'quiz',
                  prompt: 'A report must join data in the S3 lake with live records in a DynamoDB table without building a pipeline to copy DynamoDB. What Athena feature?',
                  solution: { explanation: 'Athena Federated Query with the DynamoDB connector (a Lambda-based data source connector) to query both in one SQL statement.' },
                },
              ],
              docs: 'https://docs.aws.amazon.com/athena/latest/ug/what-is.html',
            },
            {
              id: 'dea3-t2-c1',
              services: [{ icon: 'quicksight', label: 'Amazon QuickSight' }],
              title: 'Visualising data with Amazon QuickSight and SPICE',
              summary:
                'Amazon QuickSight is a serverless business-intelligence service for interactive dashboards. Its in-memory SPICE engine accelerates queries, and it connects to Athena, Redshift, RDS, S3 and more for the serving layer of a data pipeline.',
              explanation:
                "The last mile of many pipelines is a dashboard, and Amazon QuickSight provides managed, scalable BI without servers. It connects to AWS data sources — Athena (lake), Redshift (warehouse), RDS/Aurora, S3, OpenSearch — and to some external databases, then builds analyses, visuals and dashboards shared with readers. Performance comes from SPICE (Super-fast, Parallel, In-memory Calculation Engine): you import a dataset into SPICE so visuals query a fast in-memory cache rather than hitting the source on every interaction, and you refresh SPICE on a schedule; alternatively, direct query reads the source live for always-fresh but heavier queries. QuickSight scales to many readers with pay-per-session pricing, supports row-level and column-level security to restrict what each user sees, and offers ML-powered insights and anomaly detection (QuickSight Q for natural-language questions). For a data engineer, the relevant decisions are: choose SPICE vs direct query based on freshness and source-load trade-offs, set refresh schedules aligned to pipeline completion, and apply row-level security so the same dashboard shows each team only its data.",
              keyPoints: [
                'QuickSight = serverless BI for interactive dashboards across Athena, Redshift, RDS, S3, etc.',
                'SPICE = in-memory engine; import data for fast visuals, refresh on a schedule.',
                'Direct query reads the source live — fresher but heavier on the source.',
                'Pay-per-session scaling; row-level and column-level security restrict per-user visibility.',
                'ML insights / anomaly detection and QuickSight Q (natural-language questions).',
                'Engineer choices: SPICE vs direct query, refresh timing after pipeline runs, row-level security.',
              ],
              commonMistakes: [
                'Using direct query against a busy source for a popular dashboard, overloading it — import to SPICE instead.',
                'Forgetting to refresh SPICE after the pipeline loads new data, so dashboards show stale numbers.',
                'Building separate dashboards per team instead of one dashboard with row-level security.',
              ],
              diagram: {
                type: 'mermaid',
                lines: [
                  'flowchart LR',
                  '  Src[Athena / Redshift / RDS] --> SP[SPICE in-memory]',
                  '  SP --> DB[QuickSight dashboards]',
                  '  Src -.direct query.-> DB',
                  '  DB --> R[Readers<br/>row-level security]',
                ],
                caption: 'QuickSight queries data either via the fast SPICE cache or by direct query, serving dashboards with per-user row-level security.',
              },
              exercises: [
                {
                  type: 'quiz',
                  prompt:
                    'A QuickSight dashboard used by hundreds of people is slow and hammering the Redshift cluster on every click. What change helps most?',
                  solution: {
                    explanation: 'Import the dataset into SPICE so visuals read the in-memory cache instead of querying Redshift on each interaction, and refresh SPICE on a schedule after loads.',
                  },
                },
                {
                  type: 'quiz',
                  prompt: 'Each regional manager must see only their own region in the same shared dashboard. What feature enforces this?',
                  solution: { explanation: 'Row-level security in QuickSight, mapping users/groups to the rows they are permitted to see.' },
                },
                {
                  type: 'predict',
                  prompt: 'SPICE is refreshed at 01:00 but the ETL load finishes at 02:30. What do users see in the morning?',
                  solution: {
                    explanation: 'Stale data — the refresh ran before the load. Schedule the SPICE refresh to trigger after the pipeline completes (e.g. via the orchestration workflow).',
                  },
                },
              ],
              docs: 'https://docs.aws.amazon.com/quicksight/latest/user/welcome.html',
            },
          ],
        },
        {
          id: 'dea3-t3',
          name: 'Automation & cost optimisation',
          concepts: [
            {
              id: 'dea3-t3-c0',
              services: [{ icon: 'cloudformation', label: 'CloudFormation' }, { icon: 'systemsmanager', label: 'Systems Manager' }],
              title: 'Automating and optimising data pipelines',
              summary:
                'Reliable data operations rely on infrastructure as code (CloudFormation/CDK), parameterisation (Systems Manager Parameter Store), and continuous cost optimisation across compute, scanning and storage.',
              explanation:
                "Operating pipelines at scale means treating them as code and watching their cost. Infrastructure as code with AWS CloudFormation (or the CDK) defines crawlers, jobs, streams, roles, Redshift clusters and workflows in templates so environments are reproducible, versioned and reviewable, and changes deploy consistently across dev/test/prod and Regions. AWS Systems Manager Parameter Store (and Secrets Manager for credentials) externalises configuration — bucket names, thresholds, connection strings — so jobs are parameterised rather than hard-coded. On cost: data pipelines bleak money in predictable places, so the levers map to each service. For querying, reduce bytes scanned (Parquet, compression, partition pruning) and cap scans with Athena workgroups. For compute, prefer serverless (Glue/EMR Serverless) for spiky work, use Spot for EMR task nodes, run transient clusters, and right-size DPUs/instances. For storage, apply S3 lifecycle rules to tier/expire data and avoid the small-files problem with compaction. For Redshift, use RA3/serverless, concurrency scaling for spikes, reservations for steady use, and pause/resume where supported. Tagging resources by pipeline/team feeds Cost Explorer and budgets so you can attribute and alert on spend.",
              keyPoints: [
                'Infrastructure as code (CloudFormation/CDK) makes pipelines reproducible, versioned and reviewable.',
                'Parameter Store / Secrets Manager externalise config and credentials — no hard-coding.',
                'Query cost: Parquet + compression + partition pruning; cap scans with Athena workgroups.',
                'Compute cost: serverless for spiky work, Spot task nodes, transient EMR clusters, right-sizing.',
                'Storage cost: S3 lifecycle tiering/expiry and file compaction (small-files problem).',
                'Redshift cost: RA3/serverless, concurrency scaling, reservations, pause/resume; tag for Cost Explorer.',
              ],
              commonMistakes: [
                'Building pipelines by hand in the console so environments drift and cannot be reproduced.',
                'Leaving idle EMR clusters or oversized Glue jobs running, paying for unused capacity.',
                'Ignoring the small-files problem and uncompressed data, inflating both scan and storage cost.',
              ],
              diagram: {
                type: 'mermaid',
                lines: [
                  'flowchart LR',
                  '  IaC[CloudFormation/CDK] --> Env[Reproducible pipeline]',
                  '  PS[Parameter Store / Secrets] --> Env',
                  '  Env --> Opt{Cost levers}',
                  '  Opt --> A[Less scanned<br/>Parquet/partitions]',
                  '  Opt --> B[Serverless/Spot<br/>right-size]',
                  '  Opt --> C[Lifecycle<br/>+ compaction]',
                ],
                caption: 'Pipelines defined as code and externally configured, then continuously optimised across scan, compute and storage cost.',
              },
              exercises: [
                {
                  type: 'quiz',
                  prompt:
                    'A team must stand up identical dev, test and prod data pipelines and track every change. What practice and service?',
                  solution: { explanation: 'Infrastructure as code with AWS CloudFormation (or CDK) — versioned templates deploy consistent, reviewable environments.' },
                },
                {
                  type: 'quiz',
                  prompt: 'A nightly EMR job runs for one hour but the cluster runs 24/7. How do you cut cost without losing function?',
                  solution: {
                    explanation: 'Use a transient cluster (or EMR Serverless) that launches, runs the job and terminates, with Spot task nodes — paying only for the hour of compute.',
                  },
                },
                {
                  type: 'task',
                  prompt: 'List two storage-side and two query-side cost levers for a data lake.',
                  solution: {
                    explanation: 'Storage: S3 lifecycle tiering/expiry and compacting small files. Query: columnar Parquet with compression and partition pruning (plus Athena workgroup scan limits).',
                  },
                },
              ],
              docs: 'https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/Welcome.html',
            },
          ],
        },
      ],
    },

    /* ──────────────────── DOMAIN 4 — DATA SECURITY AND GOVERNANCE (18%) ──────────────────── */
    {
      level: 4,
      name: 'Security & Governance',
      focus: 'Encrypting, controlling access to, classifying and governing data — KMS, IAM, Lake Formation, Macie and lineage (Domain 4 · 18%)',
      accent: '#1ba85a',
      soft: '#e6f7ee',
      topics: [
        {
          id: 'dea4-t0',
          name: 'Encryption & key management',
          concepts: [
            {
              id: 'dea4-t0-c0',
              services: [{ icon: 'kms', label: 'AWS KMS' }, { icon: 's3', label: 'Amazon S3' }],
              title: 'Encrypting data at rest and in transit with KMS',
              summary:
                'Encryption protects data at rest (stored) and in transit (moving). AWS KMS centrally manages encryption keys that integrate with S3, Redshift, RDS, DynamoDB, Glue and more, and TLS protects data in transit.',
              explanation:
                "Securing a data platform starts with encryption everywhere. Data at rest is encrypted in the stores: S3 supports SSE-S3 (S3-managed keys), SSE-KMS (keys in AWS KMS, with auditable usage) and SSE-C (customer-provided keys); Redshift, RDS/Aurora, DynamoDB, EBS and Glue all integrate with KMS for at-rest encryption. Data in transit is protected with TLS/HTTPS between clients and services and between pipeline stages. AWS KMS (Key Management Service) is the hub: it creates and controls symmetric and asymmetric keys, enforces who can use each key through key policies and IAM, and logs every key use to CloudTrail for audit. KMS uses envelope encryption — a data key encrypts the data and is itself encrypted by a KMS key — so large datasets are encrypted efficiently. AWS-managed keys are simplest; customer-managed keys (CMKs) give control over rotation, policies and cross-account sharing. For stricter requirements, AWS CloudHSM provides dedicated hardware security modules. A common baseline: enforce SSE-KMS on lake buckets (and block unencrypted uploads), encrypt Redshift/RDS/DynamoDB with CMKs, and require TLS in transit.",
              keyPoints: [
                'Encrypt at rest (stored) and in transit (TLS/HTTPS) across the whole platform.',
                'S3 options: SSE-S3, SSE-KMS (audited), SSE-C; Redshift/RDS/DynamoDB/EBS/Glue integrate with KMS.',
                'KMS centrally manages keys; key policies + IAM control usage; CloudTrail logs every use.',
                'Envelope encryption: a data key encrypts data and is itself encrypted by a KMS key.',
                'AWS-managed keys (simple) vs customer-managed keys/CMKs (rotation, policy, cross-account control).',
                'CloudHSM for dedicated hardware key storage when required.',
              ],
              commonMistakes: [
                'Encrypting at rest but leaving data unencrypted in transit (no TLS) between stages.',
                'Confusing SSE-S3 (S3-managed keys, no per-key audit) with SSE-KMS (KMS-managed, audited, policy-controlled).',
                'Granting broad kms:Decrypt to everyone instead of scoping key policies to the principals that need it.',
              ],
              code: {
                language: 'json',
                lines: [
                  '{',
                  '  "Version": "2012-10-17",',
                  '  "Statement": [{',
                  '    "Sid": "DenyUnencryptedUploads",',
                  '    "Effect": "Deny",',
                  '    "Principal": "*",',
                  '    "Action": "s3:PutObject",',
                  '    "Resource": "arn:aws:s3:::lake-curated/*",',
                  '    "Condition": {',
                  '      "StringNotEquals": { "s3:x-amz-server-side-encryption": "aws:kms" }',
                  '    }',
                  '  }]',
                  '}',
                ],
                explanation:
                  'An S3 bucket policy that denies any upload not encrypted with SSE-KMS, enforcing at-rest encryption on the curated lake zone.',
              },
              diagram: {
                type: 'mermaid',
                lines: [
                  'flowchart LR',
                  '  Data[Plaintext data] --> DK[Data key encrypts data]',
                  '  KMS[KMS key] --> DK',
                  '  DK --> Store[(Encrypted in S3/Redshift/RDS)]',
                  '  KMS --> CT[CloudTrail logs key use]',
                ],
                caption: 'Envelope encryption: a KMS key wraps the data key that encrypts the data; every key use is logged to CloudTrail.',
              },
              exercises: [
                {
                  type: 'quiz',
                  prompt:
                    'Compliance requires that every object written to the lake bucket is encrypted with a KMS key whose usage is auditable. What two controls achieve this?',
                  solution: {
                    explanation: 'Enable default SSE-KMS encryption with a customer-managed key on the bucket, and add a bucket policy that denies PutObject without aws:kms encryption; KMS key use is logged to CloudTrail.',
                  },
                },
                {
                  type: 'quiz',
                  prompt: 'What does envelope encryption let KMS do efficiently for large datasets?',
                  solution: {
                    explanation: 'Encrypt large data with a fast data key while only the small data key is encrypted by the KMS key, avoiding sending bulk data to KMS.',
                  },
                },
                {
                  type: 'predict',
                  prompt: 'A Glue job fails to read an S3 object encrypted with a customer-managed KMS key. The role has full S3 access. What is missing?',
                  solution: {
                    explanation: 'The KMS key policy/IAM does not grant the Glue role kms:Decrypt on that key; S3 access alone cannot decrypt SSE-KMS objects.',
                  },
                },
              ],
              docs: 'https://docs.aws.amazon.com/kms/latest/developerguide/overview.html',
            },
          ],
        },
        {
          id: 'dea4-t1',
          name: 'Access control',
          concepts: [
            {
              id: 'dea4-t1-c0',
              services: [{ icon: 'iam', label: 'AWS IAM' }, { icon: 'security', label: 'Lake Formation' }],
              title: 'IAM and Lake Formation for least-privilege data access',
              summary:
                'IAM controls who can call which AWS APIs on which resources (the coarse layer), while Lake Formation adds fine-grained, catalog-level permissions on databases, tables, columns and rows — together enforcing least privilege over data.',
              explanation:
                "Access control on a data platform layers two complementary systems. AWS IAM governs identity and API-level authorization: users, groups and (preferably) roles with JSON policies that allow or deny actions (s3:GetObject, glue:GetTable, redshift:GetClusterCredentials) on resources, with explicit Deny always winning and least privilege as the rule. Pipeline components use IAM roles for temporary credentials — a Glue job role, a Firehose delivery role, an EMR instance role — never embedded keys. But IAM alone is coarse for analytical data: it grants access to whole buckets or tables, not specific columns or rows. AWS Lake Formation closes that gap with fine-grained permissions on Glue Data Catalog resources — grant SELECT on a table excluding sensitive columns, restrict rows with data filters, and scale grants with LF-Tags — enforced uniformly across Athena, Redshift Spectrum, EMR and Glue. The exam-relevant decision: use IAM for service/API-level and broad access, and Lake Formation when you need column-, row- or cell-level control over catalogued lake data. Combine them with KMS key policies for a complete least-privilege posture, and prefer roles and federation over long-lived users.",
              keyPoints: [
                'IAM = identity + API-level authorization via JSON policies; explicit Deny wins; least privilege.',
                'Pipeline components assume IAM roles for temporary credentials — never embed access keys.',
                'IAM is coarse for analytics (whole buckets/tables); it cannot do column/row-level on catalog data.',
                'Lake Formation adds fine-grained table/column/row/cell permissions, enforced across engines.',
                'LF-Tags scale fine-grained grants across many tables by classification.',
                'Use IAM for broad/service access, Lake Formation for column/row control; combine with KMS policies.',
              ],
              commonMistakes: [
                'Trying to hide a column with an IAM/S3 policy — column-level control needs Lake Formation.',
                'Embedding long-lived access keys in jobs instead of attaching IAM roles.',
                'Granting "*" actions/resources instead of scoping to least privilege.',
              ],
              diagram: {
                type: 'mermaid',
                lines: [
                  'flowchart TB',
                  '  U[User / role] --> IAM[IAM: can I call the API?]',
                  '  IAM --> LF[Lake Formation: which tables/columns/rows?]',
                  '  LF --> Q[Athena / Redshift Spectrum / EMR / Glue]',
                ],
                caption: 'A request passes IAM API-level authorization, then Lake Formation fine-grained data permissions, before the engine returns only allowed columns and rows.',
              },
              exercises: [
                {
                  type: 'quiz',
                  prompt:
                    'Analysts in the EU may query only EU customer rows and must not see the salary column. Which service provides this, and how?',
                  hint: 'Row and column level over catalog tables.',
                  solution: {
                    explanation:
                      'AWS Lake Formation: a row-level data filter restricting to EU rows plus a column-level grant excluding salary, enforced across Athena/Spectrum/EMR — IAM alone cannot do this.',
                  },
                },
                {
                  type: 'quiz',
                  prompt: 'A Glue job needs to read one S3 prefix and write another. What is the secure way to give it access?',
                  solution: { explanation: 'Attach a least-privilege IAM role scoped to those prefixes (and the KMS key); the job assumes the role for temporary credentials — no embedded keys.' },
                },
                {
                  type: 'predict',
                  prompt: 'A policy attached to a role allows s3:* but another attached policy explicitly denies s3:DeleteObject. Can the role delete objects?',
                  solution: { explanation: 'No — an explicit Deny always overrides any Allow in IAM.' },
                },
              ],
              docs: 'https://docs.aws.amazon.com/lake-formation/latest/dg/security-data-access.html',
            },
          ],
        },
        {
          id: 'dea4-t2',
          name: 'Classification, PII & compliance',
          concepts: [
            {
              id: 'dea4-t2-c0',
              services: [{ icon: 'macie', label: 'Amazon Macie' }, { icon: 'glue', label: 'AWS Glue' }],
              title: 'Discovering and protecting PII with Macie and data masking',
              summary:
                'Amazon Macie uses machine learning to discover and classify sensitive data such as PII in S3, while masking, tokenisation and column-level controls protect it. Together they support privacy and compliance obligations.',
              explanation:
                "Handling personal data (PII) such as names, emails, government IDs and payment details brings legal obligations (GDPR, HIPAA, PCI DSS) and the need to know where sensitive data lives. Amazon Macie continuously discovers and classifies data in Amazon S3, using ML and pattern matching to flag PII and other sensitive types, and reports findings (with severity) and public/unencrypted bucket risks so you can act. Once sensitive data is located, you protect it: redact or mask fields during transformation (e.g. a Glue/Lambda step that hashes or nulls emails before data reaches the curated zone), tokenise high-sensitivity values so analysts work with surrogates, and restrict access with Lake Formation column- and row-level permissions so only authorised users see raw PII. Encryption (KMS) and least-privilege IAM round out the controls. The data-engineering pattern is: classify with Macie to know your exposure, minimise and mask PII as early as possible in the pipeline, encrypt everywhere, and grant least privilege — so analytics can run on de-identified data while raw PII stays tightly controlled and auditable.",
              keyPoints: [
                'Macie uses ML/pattern matching to discover and classify PII and sensitive data in S3, with severity findings.',
                'Macie also flags risky buckets (public, unencrypted) to reduce exposure.',
                'Protect PII by masking/redaction, tokenisation and hashing during transformation (Glue/Lambda).',
                'Restrict raw PII with Lake Formation column/row-level permissions; encrypt with KMS.',
                'Minimise and mask PII early so downstream analytics use de-identified data.',
                'Supports compliance regimes like GDPR, HIPAA and PCI DSS.',
              ],
              commonMistakes: [
                'Assuming you know where PII is without scanning — use Macie to actually locate it.',
                'Masking PII only at the dashboard layer while raw PII spreads through the lake — mask early in the pipeline.',
                'Relying on obscurity instead of column-level access controls plus encryption for sensitive fields.',
              ],
              diagram: {
                type: 'mermaid',
                lines: [
                  'flowchart LR',
                  '  S3[(S3 data)] --> M[Macie: classify PII]',
                  '  M --> F[Findings + risk]',
                  '  Raw[Raw with PII] --> Mask[Glue/Lambda mask + tokenise]',
                  '  Mask --> Cur[(Curated: de-identified)]',
                  '  Cur --> LF[Lake Formation column/row control]',
                ],
                caption: 'Macie discovers PII; transformation masks/tokenises it early, and Lake Formation controls who can see any remaining sensitive columns.',
              },
              exercises: [
                {
                  type: 'quiz',
                  prompt:
                    'Leadership asks which S3 buckets contain unprotected customer PII and how exposed they are. Which service answers this?',
                  solution: { explanation: 'Amazon Macie — it scans S3, classifies PII, and reports findings including public/unencrypted bucket risk.' },
                },
                {
                  type: 'quiz',
                  prompt: 'Analytics needs customer behaviour data but analysts must never see real email addresses. What pipeline approach fits?',
                  solution: {
                    explanation: 'Mask/tokenise or hash the email column during transformation (Glue/Lambda) so the curated dataset is de-identified, and restrict any raw column with Lake Formation.',
                  },
                },
                {
                  type: 'task',
                  prompt: 'Outline a layered approach to protecting PII in a data lake.',
                  solution: {
                    explanation: 'Discover/classify with Macie, mask/tokenise PII early in transformation, encrypt at rest (KMS) and in transit (TLS), and enforce least-privilege column/row access with Lake Formation and IAM.',
                  },
                },
              ],
              docs: 'https://docs.aws.amazon.com/macie/latest/user/what-is-macie.html',
            },
          ],
        },
        {
          id: 'dea4-t3',
          name: 'Auditing, lineage & governance',
          concepts: [
            {
              id: 'dea4-t3-c0',
              services: [{ icon: 'cloudtrail', label: 'AWS CloudTrail' }, { icon: 'config', label: 'AWS Config' }],
              title: 'Auditing, data lineage and governance',
              summary:
                'Governance proves who did what (CloudTrail), tracks resource configuration and compliance (AWS Config), and traces how data moved and transformed (data lineage) — the accountability layer over the platform.',
              explanation:
                "Governance is about accountability and traceability. AWS CloudTrail records API activity across the account — who created a crawler, ran a Glue job, queried Athena or changed a Lake Formation grant — to S3 for auditing and forensics; it is the authoritative answer to who did what, when and from where. AWS Config records the configuration of resources over time and evaluates them against rules, flagging non-compliant settings (e.g. an unencrypted S3 bucket or a publicly accessible store) and showing how configuration changed — useful for continuous compliance. Data lineage describes the journey of data: which sources fed which transformations and which outputs, so you can answer where a number came from, assess the blast radius of a schema change, and satisfy regulators. AWS supports lineage through metadata in the Glue Data Catalog, orchestration definitions (Step Functions/MWAA show the flow), and dedicated catalog/governance tooling such as Amazon DataZone for cataloguing, discovering and sharing data with business context across an organisation. Combined with encryption and fine-grained access, these services let you demonstrate that data is handled correctly, trace incidents, and prove compliance — the governance backbone the exam expects you to recognise.",
              keyPoints: [
                'CloudTrail = audit log of API activity (who/what/when/where) → S3 for forensics and compliance.',
                'AWS Config = resource configuration history + rule evaluation for non-compliant settings.',
                'Data lineage traces sources → transformations → outputs (impact analysis, provenance).',
                'Lineage comes from Glue Catalog metadata and orchestration (Step Functions/MWAA) flows.',
                'Amazon DataZone catalogs, discovers and governs data with business context across the org.',
                'Together with encryption + fine-grained access, they form the governance/accountability layer.',
              ],
              commonMistakes: [
                'Confusing CloudTrail (who did what — audit) with AWS Config (what a resource\'s configuration is and how it changed).',
                'Treating governance as one-time setup rather than continuous auditing, lineage and compliance checks.',
              ],
              diagram: {
                type: 'mermaid',
                lines: [
                  'flowchart LR',
                  '  Act[API actions] --> CT[CloudTrail audit]',
                  '  Res[Resources] --> CFG[AWS Config rules]',
                  '  Src[Sources] --> Tr[Transforms] --> Out[Outputs]',
                  '  Tr -.lineage.-> Cat[Glue Catalog / DataZone]',
                ],
                caption: 'CloudTrail audits actions, Config evaluates resource compliance, and lineage records how data flows from sources through transforms to outputs.',
              },
              exercises: [
                {
                  type: 'quiz',
                  prompt:
                    'A regulator asks you to prove which user changed a Lake Formation permission and when. Which service holds the record?',
                  solution: { explanation: 'AWS CloudTrail — it logs the API call, identity, timestamp and source IP for the permission change.' },
                },
                {
                  type: 'quiz',
                  prompt: 'You must continuously detect any S3 bucket in the lake that becomes unencrypted or publicly accessible. Which service evaluates this?',
                  solution: { explanation: 'AWS Config with managed rules that flag unencrypted/public buckets as non-compliant and track configuration changes.' },
                },
                {
                  type: 'predict',
                  prompt: 'A reported metric looks wrong and you need to find every upstream source and transform that produced it. What governance capability do you rely on?',
                  solution: {
                    explanation: 'Data lineage — tracing the dataset back through its transformations to source data (via Glue Catalog metadata, orchestration definitions, and tools like DataZone).',
                  },
                },
              ],
              docs: 'https://docs.aws.amazon.com/awscloudtrail/latest/userguide/cloudtrail-user-guide.html',
            },
          ],
        },
      ],
    },
  ],
};

export default content;
