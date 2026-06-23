// AWS Certified Machine Learning Engineer - Associate — course content.
// Comprehensive coverage of the AWS Certified Machine Learning Engineer - Associate
// (MLA-C01) exam, organised into the four exam domains. The factual material
// (service names and what they do) is rewritten in our own words for self-study;
// diagrams are our own Mermaid creations. Not affiliated with or endorsed by AWS.
//
// Exam domains & weightings (MLA-C01):
//   1. Data Preparation for Machine Learning ........................... 28%
//   2. ML Model Development ............................................ 26%
//   3. Deployment and Orchestration of ML Workflows .................... 22%
//   4. ML Solution Monitoring, Maintenance, and Security ............... 24%

const content = {
  meta: {
    title: 'AWS Certified Machine Learning Engineer - Associate',
    description:
      'A complete, structured path to the AWS Certified Machine Learning Engineer - Associate (MLA-C01) exam: preparing and engineering data on AWS, developing and tuning models with Amazon SageMaker, deploying and orchestrating ML workflows with endpoints and pipelines, and monitoring, maintaining and securing ML solutions in production — with diagrams, quizzes and hands-on tasks.',
    schemaVersion: '1.0',
    status: 'complete',
  },
  levels: [
    /* ───────────── DOMAIN 1 — DATA PREPARATION FOR MACHINE LEARNING (28%) ───────────── */
    {
      level: 1,
      name: 'Data Preparation',
      focus: 'Ingesting, cleaning, transforming, engineering, splitting and storing data so it is ready to train ML models on AWS (Domain 1 · 28%)',
      accent: '#2d6bff',
      soft: '#eaf0ff',
      topics: [
        {
          id: 'mla1-t0',
          name: 'Ingesting & storing data for ML',
          concepts: [
            {
              id: 'mla1-t0-c0',
              services: [{ icon: 's3', label: 'Amazon S3' }, { icon: 'analytics', label: 'AWS Lake Formation' }],
              title: 'S3 data lakes and choosing data formats for ML',
              summary:
                'Amazon S3 is the central storage layer for almost every AWS ML workload. The format you store data in (CSV, Parquet, RecordIO, JSON Lines) and how you partition it materially affect training cost and speed.',
              explanation:
                "Most ML projects on AWS start by landing raw data in Amazon S3, which acts as a virtually unlimited, durable data lake that SageMaker, Glue, Athena and EMR all read from. How you store that data matters: row-based text formats like CSV and JSON Lines are simple and human-readable but slow and large for analytics, while columnar formats like Apache Parquet and ORC compress well and let engines read only the columns they need, cutting query and training cost. SageMaker built-in algorithms often prefer a compact binary protocol called RecordIO-protobuf for fast streaming. Partitioning data into S3 prefixes (for example by date, region or customer) lets query engines and training jobs skip irrelevant data. AWS Lake Formation sits on top of S3 to add fine-grained permissions, a central catalog and governed access to the lake.",
              analogy:
                'A CSV file is like a paper ledger you read line by line; Parquet is like a filing cabinet with a drawer per column, so you can pull just the "salary" drawer without touching the rest.',
              keyPoints: [
                'S3 is the default data lake and source/sink for SageMaker, Glue, Athena and EMR.',
                'Columnar (Parquet/ORC) compresses better and reads only needed columns — cheaper analytics and training.',
                'RecordIO-protobuf is the fast, compact format many SageMaker built-in algorithms favour.',
                'Partition data by S3 prefix (date/region) so jobs scan less and cost less.',
                'Lake Formation adds central catalog + fine-grained permissions over an S3 data lake.',
              ],
              commonMistakes: [
                'Training directly off huge uncompressed CSV files when Parquet or RecordIO would cut time and cost.',
                'Assuming Lake Formation stores data — the data still lives in S3; Lake Formation governs access to it.',
              ],
              diagram: {
                type: 'mermaid',
                lines: [
                  'flowchart LR',
                  '  SRC[Raw sources] --> S3[(S3 data lake)]',
                  '  S3 --> GL[Glue ETL]',
                  '  S3 --> AT[Athena SQL]',
                  '  S3 --> SM[SageMaker training]',
                  '  LF[Lake Formation] -.governs.-> S3',
                ],
                caption: 'S3 is the shared data lake; Glue, Athena and SageMaker all read from it while Lake Formation governs access.',
              },
              exercises: [
                {
                  type: 'quiz',
                  prompt:
                    'A team queries a few columns from a multi-terabyte dataset in S3 and wants to cut scan cost. Which storage format helps most?',
                  hint: 'Think about reading only the columns you need.',
                  solution: {
                    explanation:
                      'A columnar format such as Apache Parquet — engines read only the requested columns and benefit from strong compression, reducing data scanned and cost.',
                  },
                },
                {
                  type: 'quiz',
                  prompt: 'Which compact binary format do many Amazon SageMaker built-in algorithms read most efficiently?',
                  solution: { explanation: 'RecordIO-protobuf (the protobuf RecordIO format), used for fast streaming into training.' },
                },
                {
                  type: 'task',
                  prompt: 'Why does partitioning S3 data by date prefixes speed up training and queries?',
                  solution: {
                    explanation:
                      'Engines and training jobs can skip partitions outside the requested range, scanning far less data, which reduces both runtime and cost.',
                  },
                },
              ],
              docs: 'https://docs.aws.amazon.com/sagemaker/latest/dg/cdf-training.html',
            },
            {
              id: 'mla1-t0-c1',
              services: [{ icon: 'kinesis', label: 'Amazon Kinesis' }, { icon: 'glue', label: 'AWS Glue' }, { icon: 'analytics', label: 'Amazon MSK' }],
              title: 'Ingestion patterns: batch vs streaming',
              summary:
                'Data reaches the lake either in batches (files, database exports, ETL jobs) or as continuous streams (clickstreams, IoT, logs). The right ingestion service depends on latency and volume.',
              explanation:
                "Batch ingestion moves data in scheduled chunks: AWS Glue jobs, AWS Database Migration Service, S3 uploads, or EMR jobs land files on a cadence — ideal when freshness of minutes or hours is acceptable. Streaming ingestion handles continuous, high-velocity data. Amazon Kinesis Data Streams ingests records for custom real-time processing; Amazon Data Firehose (formerly Kinesis Data Firehose) is the easiest way to load streams into S3, Redshift or OpenSearch with optional buffering and format conversion to Parquet; Amazon Managed Streaming for Apache Kafka (MSK) runs Kafka for teams standardised on it. For ML, streaming feeds online feature pipelines and near-real-time inference, while batch feeds large offline training runs. Choosing wrongly — for example forcing a streaming workload through scheduled batch jobs — adds latency or cost.",
              keyPoints: [
                'Batch: Glue, DMS, S3 uploads, EMR — good when minute/hour freshness is fine.',
                'Kinesis Data Streams: ingest records for custom real-time processing.',
                'Data Firehose: easiest managed load of streams to S3/Redshift/OpenSearch, can convert to Parquet.',
                'Amazon MSK: managed Apache Kafka for Kafka-based pipelines.',
                'Streaming feeds online/near-real-time ML; batch feeds large offline training.',
              ],
              commonMistakes: [
                'Confusing Kinesis Data Streams (custom processing, you manage consumers) with Data Firehose (managed delivery to a destination).',
                'Building a custom batch job for a use case that really needs low-latency streaming ingestion.',
              ],
              exercises: [
                {
                  type: 'quiz',
                  prompt:
                    'You need to continuously load streaming clickstream data into S3 as Parquet with minimal code and no consumer to manage. Which service fits?',
                  solution: { explanation: 'Amazon Data Firehose — a fully managed delivery stream that buffers, converts to Parquet, and writes to S3.' },
                },
                {
                  type: 'quiz',
                  prompt: 'Which service ingests streaming records when you want to build your own real-time consumers and processing logic?',
                  solution: { explanation: 'Amazon Kinesis Data Streams.' },
                },
              ],
              docs: 'https://docs.aws.amazon.com/firehose/latest/dev/what-is-this-service.html',
            },
          ],
        },
        {
          id: 'mla1-t1',
          name: 'Transforming & cleaning data',
          concepts: [
            {
              id: 'mla1-t1-c0',
              services: [{ icon: 'analytics', label: 'Amazon SageMaker Data Wrangler' }, { icon: 'glue', label: 'AWS Glue' }],
              title: 'SageMaker Data Wrangler and Glue for transformation',
              summary:
                'SageMaker Data Wrangler offers a visual, low-code way to explore, clean and transform data and export a repeatable pipeline; AWS Glue is the serverless, code-driven ETL service for scaled transformations.',
              explanation:
                "Amazon SageMaker Data Wrangler provides a visual interface (in SageMaker Studio) to import data from S3, Athena, Redshift and more, then apply built-in transforms — handling missing values, encoding categoricals, scaling numerics, parsing dates — with a live preview and a built-in data-quality and insights report. When finished you export the flow as a SageMaker Processing job, a pipeline step, or Python code, so the same transforms run reproducibly on the full dataset. AWS Glue is serverless ETL: Glue jobs (PySpark or Python shell) handle large-scale transformations, the Glue Data Catalog stores table/schema metadata that Athena and other services share, and Glue crawlers infer schema automatically. Use Data Wrangler for interactive feature prep and exploration; use Glue for heavy, scheduled, code-based ETL across the data lake.",
              analogy:
                'Data Wrangler is a spreadsheet you click through to clean a sample, then it writes the macro; Glue is the industrial conveyor belt that runs that cleaning on millions of rows on a schedule.',
              keyPoints: [
                'Data Wrangler: visual, low-code import, transform, and data-quality insights in SageMaker Studio.',
                'Export a Data Wrangler flow as a Processing job, pipeline step or Python code for reproducibility.',
                'Glue: serverless PySpark/Python ETL for large-scale, scheduled transformations.',
                'Glue Data Catalog: central schema/metadata shared with Athena, Redshift Spectrum, EMR.',
                'Glue crawlers auto-discover schema and populate the catalog.',
              ],
              commonMistakes: [
                'Treating Data Wrangler as a production ETL engine — it is for interactive prep; export it to a Processing job to scale.',
                'Forgetting the Glue Data Catalog is what makes the same tables queryable from Athena and other engines.',
              ],
              diagram: {
                type: 'mermaid',
                lines: [
                  'flowchart LR',
                  '  S3[(S3 raw)] --> DW[Data Wrangler<br/>visual transforms]',
                  '  DW --> EX[Export flow]',
                  '  EX --> PROC[Processing job]',
                  '  PROC --> CLEAN[(S3 clean / features)]',
                ],
                caption: 'Explore and design transforms visually in Data Wrangler, then export to a Processing job that runs them at scale.',
              },
              exercises: [
                {
                  type: 'quiz',
                  prompt:
                    'A data scientist wants to visually clean a sample, see a data-quality report, then run the exact same transforms on the full dataset reproducibly. Which approach fits best?',
                  solution: {
                    explanation:
                      'Use SageMaker Data Wrangler to design the transforms interactively, then export the flow as a SageMaker Processing job to apply them at scale.',
                  },
                },
                {
                  type: 'quiz',
                  prompt: 'Which AWS component stores the table and schema metadata that lets Athena and EMR query the same S3 datasets?',
                  solution: { explanation: 'The AWS Glue Data Catalog.' },
                },
                {
                  type: 'task',
                  prompt: 'When would you choose AWS Glue over Data Wrangler for a transformation?',
                  solution: {
                    explanation:
                      'For large-scale, scheduled, code-driven ETL across the data lake (PySpark jobs), where you need automation and scale rather than interactive exploration.',
                  },
                },
              ],
              docs: 'https://docs.aws.amazon.com/sagemaker/latest/dg/data-wrangler.html',
            },
            {
              id: 'mla1-t1-c1',
              services: [{ icon: 'analytics', label: 'Amazon SageMaker Processing' }, { icon: 'athena', label: 'Amazon Athena' }],
              title: 'SageMaker Processing jobs and Athena for prep at scale',
              summary:
                'SageMaker Processing runs containerised data processing, feature engineering and evaluation on managed, ephemeral compute; Athena runs serverless SQL directly against S3 for ad-hoc exploration and aggregation.',
              explanation:
                "Amazon SageMaker Processing spins up managed compute, runs your processing container (built-in scikit-learn or Spark images, or your own), reads input from S3, writes output back to S3, and tears the cluster down — you pay only for the run. It is the standard way to run pre-processing, feature engineering, post-processing and model evaluation as a discrete, reproducible step, and it slots directly into SageMaker Pipelines. Amazon Athena is serverless SQL over data in S3 using the Glue Data Catalog; it is ideal for exploring data, computing aggregate features, sampling, and validating data quality without provisioning anything, paying per terabyte scanned. A common pattern: explore and shape data with Athena queries, then run heavier transforms and dataset creation in a Processing job.",
              keyPoints: [
                'Processing job: managed, ephemeral compute for prep, feature engineering and evaluation; pay per run.',
                'Built-in scikit-learn and Spark processing containers, or bring your own.',
                'Processing reads from S3, writes to S3, integrates as a SageMaker Pipelines step.',
                'Athena: serverless SQL over S3 via the Glue Data Catalog, pay per TB scanned.',
                'Use Athena to explore/aggregate; use Processing for repeatable, scaled transforms.',
              ],
              commonMistakes: [
                'Keeping a notebook or training instance running just to do one-off prep instead of a short-lived Processing job.',
                'Scanning entire uncompressed datasets in Athena instead of partitioning/columnar formats to limit cost.',
              ],
              exercises: [
                {
                  type: 'quiz',
                  prompt:
                    'You want a reusable, reproducible step that pre-processes a dataset on managed compute that disappears when done, and plugs into a pipeline. Which service?',
                  solution: { explanation: 'A SageMaker Processing job.' },
                },
                {
                  type: 'quiz',
                  prompt: 'Which service lets you run ad-hoc SQL exploration directly on S3 data with no servers to manage?',
                  solution: { explanation: 'Amazon Athena.' },
                },
              ],
              docs: 'https://docs.aws.amazon.com/sagemaker/latest/dg/processing-job.html',
            },
          ],
        },
        {
          id: 'mla1-t2',
          name: 'Feature engineering & the Feature Store',
          concepts: [
            {
              id: 'mla1-t2-c0',
              title: 'Feature engineering techniques',
              summary:
                'Raw columns rarely train well as-is. Encoding categoricals, scaling numerics, handling missing values and creating new derived features are core engineering steps that drive model quality.',
              explanation:
                "Feature engineering turns raw data into signals a model can learn from. Categorical variables must be encoded: one-hot encoding creates a binary column per category (good for low-cardinality), label/ordinal encoding maps categories to integers (only when order is meaningful), and target/binary encoding helps with high cardinality. Numeric features are usually scaled — standardisation (zero mean, unit variance) or min-max normalisation — so features with large ranges do not dominate distance- and gradient-based models. Missing values are imputed (mean, median, most-frequent) or flagged with an indicator column. You also create derived features: ratios, date parts (day of week, month), aggregations, and text features (TF-IDF, embeddings). Avoid data leakage — never engineer features using information that would not be available at prediction time, and fit scalers/encoders on the training split only.",
              analogy:
                'Feature engineering is like prepping ingredients before cooking: you do not throw whole vegetables in the pot — you wash, peel and chop so each ingredient contributes its flavour properly.',
              keyPoints: [
                'Encode categoricals: one-hot (low cardinality), ordinal (only if order matters), target encoding (high cardinality).',
                'Scale numerics: standardisation or min-max so large-range features do not dominate.',
                'Handle missing values: impute (mean/median/mode) or add a missing-indicator.',
                'Create derived features: ratios, date parts, aggregations, text vectors/embeddings.',
                'Prevent leakage: fit transforms on the training split only; never use future/label-derived info.',
              ],
              commonMistakes: [
                'Fitting a scaler or encoder on the full dataset before splitting — this leaks test statistics into training.',
                'One-hot encoding a very high-cardinality column, exploding dimensionality instead of using target/hashing encoding.',
              ],
              code: {
                language: 'python',
                lines: [
                  'from sklearn.preprocessing import StandardScaler, OneHotEncoder',
                  '# Fit ONLY on the training split to avoid leakage',
                  'scaler = StandardScaler().fit(X_train[numeric_cols])',
                  'X_train[numeric_cols] = scaler.transform(X_train[numeric_cols])',
                  'X_test[numeric_cols] = scaler.transform(X_test[numeric_cols])',
                ],
                explanation:
                  'The scaler is fit on training data only, then applied to both splits — preventing test-set statistics from leaking into the model.',
              },
              exercises: [
                {
                  type: 'quiz',
                  prompt:
                    'A column "city" has 5,000 distinct values. One-hot encoding produces too many columns. What encoding is more appropriate?',
                  hint: 'Think high cardinality.',
                  solution: {
                    explanation:
                      'A high-cardinality-friendly approach such as target encoding (or hashing/embedding) — one-hot would create thousands of sparse columns.',
                  },
                },
                {
                  type: 'predict',
                  prompt:
                    'You fit a StandardScaler on the entire dataset, then split into train/test. Why will your test metrics be optimistic?',
                  solution: {
                    explanation:
                      'The scaler used statistics (mean/variance) computed partly from the test rows, leaking information into training and inflating measured performance.',
                  },
                },
                {
                  type: 'task',
                  prompt: 'Give two reasons to scale numeric features before training a gradient-based or distance-based model.',
                  solution: {
                    explanation:
                      'It stops large-range features from dominating the loss/distance, and it helps gradient descent converge faster and more stably.',
                  },
                },
              ],
              docs: 'https://docs.aws.amazon.com/sagemaker/latest/dg/data-wrangler-transform.html',
            },
            {
              id: 'mla1-t2-c1',
              services: [{ icon: 'analytics', label: 'Amazon SageMaker Feature Store' }],
              title: 'SageMaker Feature Store: online & offline',
              summary:
                'Feature Store is a central repository for curated features, with an online store for low-latency inference lookups and an offline store for training, ensuring training and serving use identical feature definitions.',
              explanation:
                "Amazon SageMaker Feature Store solves a recurring ML problem: features computed for training drift from features computed at inference, causing training-serving skew. You define feature groups and ingest records; Feature Store keeps two synchronised stores. The online store is a low-latency key-value store for real-time inference — an endpoint looks up the latest feature values by record ID in milliseconds. The offline store persists full history in S3 (queryable via Athena) for building training datasets and point-in-time-correct joins. Because both serve the same feature definitions, the model trains and predicts on consistent features. Feature Store also supports feature reuse across teams and models, versioning, and time-travel queries to reconstruct the feature values as of a past timestamp.",
              keyPoints: [
                'Central, reusable store of curated features — eliminates training/serving skew.',
                'Online store: millisecond key-value lookups for real-time inference.',
                'Offline store: full history in S3, queried via Athena, for building training sets.',
                'Supports point-in-time-correct joins and time-travel to past feature values.',
                'Promotes feature reuse and consistency across teams and models.',
              ],
              commonMistakes: [
                'Recomputing features differently in training vs serving instead of reading both from Feature Store.',
                'Using the offline store for real-time inference lookups — that is what the low-latency online store is for.',
              ],
              diagram: {
                type: 'mermaid',
                lines: [
                  'flowchart LR',
                  '  ING[Ingest features] --> FS[Feature Store group]',
                  '  FS --> ON[Online store<br/>low-latency]',
                  '  FS --> OFF[Offline store<br/>S3 history]',
                  '  ON --> EP[Endpoint inference]',
                  '  OFF --> TR[Training dataset]',
                ],
                caption: 'A feature group writes to both an online store for inference and an offline store for training, keeping definitions consistent.',
              },
              exercises: [
                {
                  type: 'quiz',
                  prompt:
                    'A real-time endpoint must fetch the latest customer features within a few milliseconds at prediction time. Which Feature Store component serves this?',
                  solution: { explanation: 'The online store — a low-latency key-value store for real-time lookups.' },
                },
                {
                  type: 'quiz',
                  prompt: 'Which Feature Store component holds full feature history in S3 for building training datasets and time-travel queries?',
                  solution: { explanation: 'The offline store.' },
                },
                {
                  type: 'task',
                  prompt: 'Explain how Feature Store reduces training-serving skew.',
                  solution: {
                    explanation:
                      'Training and inference both read the same feature definitions and values from the same store (offline for training, online for serving), so the features are consistent rather than recomputed differently in each path.',
                  },
                },
              ],
              docs: 'https://docs.aws.amazon.com/sagemaker/latest/dg/feature-store.html',
            },
          ],
        },
        {
          id: 'mla1-t3',
          name: 'Splitting, balancing & data integrity',
          concepts: [
            {
              id: 'mla1-t3-c0',
              title: 'Train/validation/test splits and cross-validation',
              summary:
                'Splitting data correctly gives an honest estimate of how a model generalises. Training, validation and test sets each have a distinct role, and the splitting strategy must respect the data structure.',
              explanation:
                "You split data so the model is judged on data it has never seen. The training set fits model parameters; the validation set tunes hyperparameters and chooses between models; the held-out test set gives a final, unbiased performance estimate used only once. A typical split is roughly 70/15/15 or 80/10/10. The split strategy must match the data: for classification with imbalanced classes use stratified splitting so each split keeps the same class proportions; for time-series you must split chronologically (train on the past, test on the future) and never shuffle, or you leak future information. K-fold cross-validation rotates which fold is held out, averaging results for a more stable estimate when data is limited. Grouped data (multiple rows per customer) needs group-aware splitting so the same entity does not appear in both train and test.",
              analogy:
                'The test set is a sealed exam: the student (model) studies with the training set, practises with the validation set, and only opens the sealed exam once — peeking early invalidates the score.',
              keyPoints: [
                'Train = fit parameters; validation = tune hyperparameters/select model; test = final unbiased estimate.',
                'Use the test set only once, at the very end.',
                'Stratified split keeps class proportions for imbalanced classification.',
                'Time-series: split chronologically, never shuffle (avoid look-ahead leakage).',
                'K-fold cross-validation gives a stabler estimate when data is limited.',
              ],
              commonMistakes: [
                'Tuning hyperparameters against the test set, which contaminates the final estimate — use the validation set instead.',
                'Randomly shuffling time-series data, leaking future records into training.',
              ],
              diagram: {
                type: 'mermaid',
                lines: [
                  'flowchart LR',
                  '  D[(Full dataset)] --> TR[Train ~70%]',
                  '  D --> VA[Validation ~15%]',
                  '  D --> TE[Test ~15%]',
                  '  TR --> FIT[Fit params]',
                  '  VA --> TUNE[Tune / select]',
                  '  TE --> FINAL[Final score once]',
                ],
                caption: 'Each split has one job: train fits, validation tunes, test gives a single honest final score.',
              },
              exercises: [
                {
                  type: 'quiz',
                  prompt:
                    'You are predicting next month\'s sales from historical monthly data. How should you split train and test?',
                  solution: {
                    explanation:
                      'Chronologically — train on earlier periods and test on later periods, without shuffling, to avoid leaking future information.',
                  },
                },
                {
                  type: 'quiz',
                  prompt: 'For a fraud dataset with 1% positives, which splitting technique keeps the same class ratio in each split?',
                  solution: { explanation: 'Stratified splitting.' },
                },
                {
                  type: 'predict',
                  prompt: 'A team reports great accuracy but tuned every hyperparameter against the test set. What is wrong with their reported number?',
                  solution: {
                    explanation:
                      'The test set is no longer unbiased — it was used for model selection, so reported performance is optimistic; a fresh held-out set is needed.',
                  },
                },
              ],
              docs: 'https://docs.aws.amazon.com/machine-learning/latest/dg/splitting-the-data.html',
            },
            {
              id: 'mla1-t3-c1',
              title: 'Handling class imbalance and data quality',
              summary:
                'Imbalanced classes and dirty data quietly wreck model performance. Resampling, class weights and synthetic data address imbalance; deduplication, outlier handling and schema validation protect quality.',
              explanation:
                "When one class vastly outnumbers another (fraud, defects, rare disease), a naive model can score high accuracy by always predicting the majority while being useless. Techniques to address this include oversampling the minority class (including synthetic methods like SMOTE), undersampling the majority, and applying class weights so the loss penalises minority errors more. Crucially, you resample only the training set, never the test set, so evaluation reflects the true distribution — and you judge with metrics like precision, recall, F1 and AUC rather than raw accuracy. Data quality also matters: detect and handle outliers, remove duplicates, correct inconsistent units and categories, validate schema and ranges, and check for label noise. Tools like SageMaker Data Wrangler's data-quality report and Glue data-quality rules help catch these issues early before they propagate into the model.",
              keyPoints: [
                'Accuracy is misleading on imbalanced data — use precision, recall, F1, AUC.',
                'Fixes for imbalance: oversample minority (e.g. SMOTE), undersample majority, or class weights.',
                'Resample the training set only; keep test/validation at the real distribution.',
                'Data quality: dedupe, handle outliers, fix inconsistent units/categories, validate schema/ranges.',
                'Catch issues early with Data Wrangler quality reports and Glue Data Quality rules.',
              ],
              commonMistakes: [
                'Oversampling before splitting, so duplicated/synthetic minority rows appear in both train and test.',
                'Reporting accuracy on a 99/1 imbalanced problem where a do-nothing model already scores 99%.',
              ],
              exercises: [
                {
                  type: 'quiz',
                  prompt:
                    'A churn model on a 95/5 dataset reports 95% accuracy but never predicts churn. What went wrong and what metric should you use?',
                  solution: {
                    explanation:
                      'The model just predicts the majority class. Use recall, precision, F1 or AUC, and address the imbalance with resampling or class weights.',
                  },
                },
                {
                  type: 'quiz',
                  prompt: 'Should you apply SMOTE oversampling before or after the train/test split, and to which set?',
                  solution: {
                    explanation:
                      'After the split, and only to the training set — so synthetic rows never leak into the test set and evaluation stays honest.',
                  },
                },
              ],
              docs: 'https://docs.aws.amazon.com/glue/latest/dg/glue-data-quality.html',
            },
          ],
        },
      ],
    },

    /* ───────────────────── DOMAIN 2 — ML MODEL DEVELOPMENT (26%) ───────────────────── */
    {
      level: 2,
      name: 'Model Development',
      focus: 'Choosing approaches and algorithms, training and tuning models in SageMaker, evaluating them honestly, and detecting bias (Domain 2 · 26%)',
      accent: '#7c4ddb',
      soft: '#f1ebfd',
      topics: [
        {
          id: 'mla2-t0',
          name: 'Choosing an approach & algorithm',
          concepts: [
            {
              id: 'mla2-t0-c0',
              title: 'Problem framing: supervised, unsupervised, and beyond',
              summary:
                'Before any code, frame the problem: is it classification, regression, clustering, recommendation, forecasting, or something a foundation model handles? The framing drives algorithm choice and metrics.',
              explanation:
                "ML problems fall into recognisable shapes. Supervised learning uses labelled data: classification predicts a category (binary like fraud/not-fraud, or multiclass), and regression predicts a continuous number (price, demand). Unsupervised learning finds structure in unlabelled data: clustering groups similar records, anomaly detection flags outliers, and dimensionality reduction compresses features. Other shapes include recommendation (suggest items), forecasting (predict a time series), and natural-language or vision tasks increasingly served by pre-trained foundation models. Matching the shape to the right algorithm and metric is the first exam skill: a fraud problem is binary classification judged by recall/precision, a demand problem is regression or forecasting judged by RMSE/MAE, and grouping customers with no labels is clustering.",
              analogy:
                'Framing the problem is like choosing the right sport before training: you would not coach a sprinter the way you coach a marathoner — classification and regression need different drills and scoreboards.',
              keyPoints: [
                'Supervised + categorical target = classification (binary/multiclass).',
                'Supervised + numeric target = regression.',
                'No labels: clustering, anomaly detection, dimensionality reduction (unsupervised).',
                'Time series = forecasting; suggesting items = recommendation.',
                'Framing dictates both the algorithm and the evaluation metric.',
              ],
              commonMistakes: [
                'Treating a continuous-target problem as classification by bucketing it unnecessarily, losing information.',
                'Reaching for supervised learning when there are no labels — clustering or anomaly detection may fit.',
              ],
              exercises: [
                {
                  type: 'quiz',
                  prompt:
                    'A bank wants to predict the dollar amount a customer will spend next month. Is this classification or regression?',
                  solution: { explanation: 'Regression — the target is a continuous numeric value.' },
                },
                {
                  type: 'quiz',
                  prompt: 'You have unlabelled transaction data and want to group similar customers. Which learning type?',
                  solution: { explanation: 'Unsupervised learning — specifically clustering.' },
                },
              ],
              docs: 'https://docs.aws.amazon.com/sagemaker/latest/dg/algorithms-choose.html',
            },
            {
              id: 'mla2-t0-c1',
              services: [{ icon: 'analytics', label: 'Amazon SageMaker' }, { icon: 'analytics', label: 'SageMaker JumpStart' }],
              title: 'Built-in algorithms, JumpStart, BYO, and SageMaker Autopilot',
              summary:
                'SageMaker offers several build paths: optimised built-in algorithms, pre-trained models and solutions via JumpStart, bring-your-own framework/containers, and fully automated model building with Autopilot.',
              explanation:
                "SageMaker built-in algorithms are AWS-optimised implementations (XGBoost for tabular, Linear Learner, K-Means for clustering, Random Cut Forest for anomaly detection, BlazingText for text, Image Classification, DeepAR for forecasting, and more) — you supply data and hyperparameters, AWS supplies the algorithm container. SageMaker JumpStart provides a hub of pre-trained models, foundation models and end-to-end solution templates you can deploy or fine-tune in a few clicks, accelerating computer-vision and NLP/generative work. Bring-your-own gives full control: use a managed framework container (TensorFlow, PyTorch, scikit-learn) with your script, or build a fully custom Docker image pushed to Amazon ECR. SageMaker Autopilot (AutoML) automatically explores algorithms and hyperparameters on tabular data, producing ranked candidate models with explainability and the notebooks behind them. Pick built-in for common patterns, JumpStart to start from pre-trained models, BYO for custom needs, and Autopilot when you want AWS to search for you.",
              keyPoints: [
                'Built-in algorithms: optimised containers (XGBoost, Linear Learner, K-Means, RCF, DeepAR, BlazingText...).',
                'JumpStart: pre-trained/foundation models and solution templates to deploy or fine-tune quickly.',
                'BYO: framework containers (TensorFlow/PyTorch/scikit-learn) with your script, or custom image in ECR.',
                'Autopilot: AutoML that searches algorithms/hyperparameters on tabular data and ranks candidates.',
                'Choose by need: built-in (common), JumpStart (pre-trained), BYO (custom), Autopilot (automated search).',
              ],
              commonMistakes: [
                'Building a custom container for tabular classification when the built-in XGBoost would do it faster.',
                'Assuming JumpStart only deploys models — it can also fine-tune pre-trained and foundation models.',
              ],
              diagram: {
                type: 'mermaid',
                lines: [
                  'flowchart TB',
                  '  Q{Need?} --> A[Common tabular/text] --> BI[Built-in algorithm]',
                  '  Q --> B[Start from pre-trained] --> JS[JumpStart]',
                  '  Q --> C[Custom logic] --> BYO[Bring your own container]',
                  '  Q --> D[Let AWS search] --> AP[Autopilot AutoML]',
                ],
                caption: 'Four build paths in SageMaker, matched to whether you need common algorithms, pre-trained models, custom code, or automated search.',
              },
              exercises: [
                {
                  type: 'quiz',
                  prompt:
                    'A team wants a strong baseline tabular classifier without managing infrastructure or writing the algorithm. Which built-in algorithm is the common choice?',
                  solution: { explanation: 'SageMaker built-in XGBoost — a high-performing, optimised choice for tabular classification/regression.' },
                },
                {
                  type: 'quiz',
                  prompt: 'You want to deploy and fine-tune a pre-trained foundation model in a few clicks. Which SageMaker capability?',
                  solution: { explanation: 'SageMaker JumpStart.' },
                },
                {
                  type: 'quiz',
                  prompt: 'Which capability automatically searches algorithms and hyperparameters on tabular data and returns ranked, explainable candidate models?',
                  solution: { explanation: 'SageMaker Autopilot (AutoML).' },
                },
              ],
              docs: 'https://docs.aws.amazon.com/sagemaker/latest/dg/algos.html',
            },
          ],
        },
        {
          id: 'mla2-t1',
          name: 'Training models with SageMaker',
          concepts: [
            {
              id: 'mla2-t1-c0',
              services: [{ icon: 'analytics', label: 'Amazon SageMaker Training' }, { icon: 's3', label: 'Amazon S3' }, { icon: 'ecs', label: 'Amazon ECR' }],
              title: 'SageMaker training jobs, instances and input modes',
              summary:
                'A SageMaker training job provisions instances, pulls your algorithm container from ECR, streams data from S3, trains, writes the model artifact to S3, then tears everything down — you pay only for training time.',
              explanation:
                "When you start a training job you specify the algorithm container (built-in or your own in Amazon ECR), the instance type and count, hyperparameters, and the S3 input/output locations. SageMaker launches the cluster, runs training, saves the resulting model artifact (model.tar.gz) to S3, and shuts the instances down so you stop paying. Instance choice matters: CPU instances (the C/M families) for many tabular jobs, GPU instances (P/G families) for deep learning. Input modes control how data reaches the algorithm: File mode copies the whole dataset to the instance volume before training (simple, needs disk), while Pipe mode and Fast File mode stream data directly from S3, reducing startup time and disk for large datasets. For large models, distributed training spreads work across instances (data parallel or model parallel). Managed Spot training can cut cost up to ~90% for interruption-tolerant jobs, with checkpoints to S3 to resume.",
              keyPoints: [
                'Training job: pulls container from ECR, reads S3, trains, writes model.tar.gz to S3, then stops billing.',
                'CPU (C/M) for many tabular jobs; GPU (P/G) for deep learning.',
                'Input modes: File (copy all first) vs Pipe/Fast File (stream from S3) for large data.',
                'Distributed training (data/model parallel) scales big jobs across instances.',
                'Managed Spot training saves up to ~90%; checkpoint to S3 to survive interruptions.',
              ],
              commonMistakes: [
                'Using File mode for a huge dataset and running out of instance disk — stream with Pipe/Fast File mode instead.',
                'Forgetting that the model artifact lands in S3, not on a persistent server you must manage.',
              ],
              code: {
                language: 'python',
                lines: [
                  'from sagemaker.estimator import Estimator',
                  'est = Estimator(',
                  '    image_uri=xgboost_image,',
                  "    role=role, instance_count=1, instance_type='ml.m5.xlarge',",
                  "    output_path='s3://my-bucket/models/',",
                  '    use_spot_instances=True, max_wait=3600)',
                  "est.set_hyperparameters(objective='binary:logistic', num_round=200)",
                  "est.fit({'train': train_s3, 'validation': val_s3})",
                ],
                explanation:
                  'A SageMaker estimator launches an XGBoost training job on a managed instance, uses Spot for savings, trains from S3 inputs, and writes the model artifact back to S3.',
              },
              exercises: [
                {
                  type: 'quiz',
                  prompt:
                    'A training dataset is far larger than the instance disk. Which input mode avoids copying it all to the volume first?',
                  solution: { explanation: 'Pipe mode or Fast File mode — they stream data from S3 instead of copying the full dataset to the instance.' },
                },
                {
                  type: 'quiz',
                  prompt: 'A training job tolerates interruptions and you want to cut cost dramatically. What should you enable, and what protects progress?',
                  solution: {
                    explanation:
                      'Enable managed Spot training (up to ~90% savings) and configure checkpointing to S3 so an interrupted job can resume.',
                  },
                },
                {
                  type: 'task',
                  prompt: 'After a SageMaker training job finishes, where does the trained model artifact go?',
                  solution: { explanation: 'It is saved as model.tar.gz to the configured S3 output location, and the training instances are torn down.' },
                },
              ],
              docs: 'https://docs.aws.amazon.com/sagemaker/latest/dg/how-it-works-training.html',
            },
            {
              id: 'mla2-t1-c1',
              title: 'Overfitting, underfitting and regularization',
              summary:
                'A model that memorises training data overfits; one too simple to capture the pattern underfits. Recognising which is happening from the train/validation gap guides the fix.',
              explanation:
                "Overfitting means the model fits training data too closely, including its noise, so training error is low but validation/test error is high — a large gap between the two curves. Underfitting means the model is too simple (or undertrained) to capture the signal, so both training and validation error are high. You diagnose by comparing training vs validation metrics. To fight overfitting: add more/cleaner data, reduce model complexity, apply regularization (L1/L2 penalties, dropout in neural nets), use early stopping (halt when validation stops improving), and prune features. To fix underfitting: add capacity (more features, deeper/larger model, more rounds), train longer, or reduce excessive regularization. The bias-variance tradeoff frames this: high bias = underfit, high variance = overfit, and good models balance the two.",
              analogy:
                'Overfitting is a student who memorises the exact practice questions and fails the real exam; underfitting is one who barely studied and fails both — you want the student who learned the underlying concepts.',
              keyPoints: [
                'Overfit: low training error, high validation error (big gap) — model memorised noise.',
                'Underfit: high training AND validation error — model too simple/undertrained.',
                'Reduce overfit: more data, less complexity, L1/L2 regularization, dropout, early stopping.',
                'Reduce underfit: more capacity/features, train longer, less regularization.',
                'Bias-variance tradeoff: high bias = underfit, high variance = overfit.',
              ],
              commonMistakes: [
                'Adding model complexity to fix high validation error that is actually overfitting — it makes it worse.',
                'Ignoring early stopping and training far past the point validation loss starts rising.',
              ],
              diagram: {
                type: 'mermaid',
                lines: [
                  'flowchart LR',
                  '  G{Train vs Val} --> O[Low train, high val] --> OF[Overfit: regularize / more data / early stop]',
                  '  G --> U[High train and val] --> UF[Underfit: add capacity / train longer]',
                ],
                caption: 'Diagnose by the gap between training and validation error, then apply the matching remedy.',
              },
              exercises: [
                {
                  type: 'predict',
                  prompt:
                    'Training accuracy is 99% but validation accuracy is 72%. Is the model overfitting or underfitting, and name two fixes.',
                  solution: {
                    explanation:
                      'Overfitting (large train-validation gap). Fixes: add regularization (L1/L2, dropout), use early stopping, gather more data, or reduce model complexity.',
                  },
                },
                {
                  type: 'quiz',
                  prompt: 'Both training and validation error are high and similar. What is this, and what helps?',
                  solution: {
                    explanation:
                      'Underfitting — increase model capacity, add features, train longer, or reduce excessive regularization.',
                  },
                },
              ],
              docs: 'https://docs.aws.amazon.com/machine-learning/latest/dg/model-fit-underfitting-vs-overfitting.html',
            },
          ],
        },
        {
          id: 'mla2-t2',
          name: 'Hyperparameter tuning & experiments',
          concepts: [
            {
              id: 'mla2-t2-c0',
              services: [{ icon: 'analytics', label: 'SageMaker Automatic Model Tuning' }],
              title: 'Automatic Model Tuning (hyperparameter optimization)',
              summary:
                'Hyperparameters (learning rate, depth, regularization, rounds) are set before training and strongly affect quality. SageMaker Automatic Model Tuning searches them efficiently against an objective metric.',
              explanation:
                "Hyperparameters are the knobs you set before training — learning rate, tree depth, number of rounds, regularization strength, batch size — distinct from the parameters the model learns. SageMaker Automatic Model Tuning (also called hyperparameter optimization, HPO) runs many training jobs across ranges you define and finds the combination that optimises an objective metric (for example, maximise validation AUC or minimise validation RMSE). It supports several strategies: grid search (exhaustive over a grid), random search (sample combinations), Bayesian optimization (learns from prior trials to choose promising next ones — usually most efficient), and Hyperband (early-stops poor configurations to save budget). You bound the search by max jobs and parallelism, and warm start can reuse a previous tuning job's knowledge. Define realistic ranges, choose the right objective, and avoid tuning against the test set.",
              keyPoints: [
                'Hyperparameters are set before training (learning rate, depth, rounds); parameters are learned during it.',
                'Automatic Model Tuning (HPO) runs many jobs to optimise a chosen objective metric.',
                'Strategies: grid, random, Bayesian (learns from trials), Hyperband (early-stops weak runs).',
                'Bound the search with max jobs and parallel jobs; warm start reuses prior tuning knowledge.',
                'Tune against the validation metric, never the test set.',
              ],
              commonMistakes: [
                'Confusing hyperparameters (set before training) with model parameters/weights (learned during training).',
                'Running pure grid search over a large space when Bayesian or Hyperband would find good configs far cheaper.',
              ],
              diagram: {
                type: 'mermaid',
                lines: [
                  'flowchart LR',
                  '  R[Define ranges + objective] --> T[Tuning job]',
                  '  T --> J1[Job 1]',
                  '  T --> J2[Job 2]',
                  '  T --> J3[Job N]',
                  '  J1 --> B[Best hyperparameters]',
                  '  J2 --> B',
                  '  J3 --> B',
                ],
                caption: 'Automatic Model Tuning launches many training jobs over the search space and returns the best-performing hyperparameters.',
              },
              exercises: [
                {
                  type: 'quiz',
                  prompt:
                    'You want to efficiently find good hyperparameters by learning from earlier trials rather than searching blindly. Which tuning strategy?',
                  solution: { explanation: 'Bayesian optimization — it uses results from prior trials to pick promising next configurations.' },
                },
                {
                  type: 'quiz',
                  prompt: 'Is the learning rate a hyperparameter or a model parameter?',
                  solution: { explanation: 'A hyperparameter — it is set before training; weights/coefficients are the learned model parameters.' },
                },
                {
                  type: 'task',
                  prompt: 'Which metric should a tuning job optimise for an imbalanced fraud classifier, and which set should it be measured on?',
                  solution: {
                    explanation:
                      'An imbalance-aware objective such as validation AUC or F1, measured on the validation set — not accuracy and not the test set.',
                  },
                },
              ],
              docs: 'https://docs.aws.amazon.com/sagemaker/latest/dg/automatic-model-tuning.html',
            },
            {
              id: 'mla2-t2-c1',
              services: [{ icon: 'analytics', label: 'Amazon SageMaker Experiments' }],
              title: 'SageMaker Experiments and reproducibility',
              summary:
                'SageMaker Experiments tracks runs, parameters, metrics and artifacts so you can compare model variants, reproduce results, and choose the best candidate with confidence.',
              explanation:
                "As you iterate, you produce dozens of runs with different data, features and hyperparameters. SageMaker Experiments organises this: it logs each run's inputs (parameters, dataset versions), metrics, and output artifacts under experiments and trials, so you can compare runs side by side and identify what actually improved the model. This is the backbone of reproducibility and governance — you can answer which data and config produced a given model. Combined with lineage tracking, you get an auditable record from data to model. The discipline matters for the exam's emphasis on repeatable, well-governed ML: capture the random seed, dataset version, container image and hyperparameters so a result can be reproduced, and use Experiments to compare candidates objectively rather than by memory.",
              keyPoints: [
                'Experiments logs parameters, metrics and artifacts per run for side-by-side comparison.',
                'Organised as experiments and trials — track what changed and what improved.',
                'Underpins reproducibility and governance (which data + config produced a model).',
                'Pair with lineage tracking for an auditable data-to-model record.',
                'Capture seed, dataset version, container image and hyperparameters to reproduce results.',
              ],
              exercises: [
                {
                  type: 'quiz',
                  prompt:
                    'After 40 training runs with varied features and hyperparameters, how do you objectively compare them and find the best?',
                  solution: {
                    explanation:
                      'Use SageMaker Experiments to log and compare each run\'s parameters and metrics side by side, rather than relying on memory or scattered notes.',
                  },
                },
                {
                  type: 'task',
                  prompt: 'List three things you should record to reproduce a model result later.',
                  solution: {
                    explanation:
                      'Any three of: dataset version, hyperparameters, random seed, container/framework image, and the code commit — captured via Experiments and lineage tracking.',
                  },
                },
              ],
              docs: 'https://docs.aws.amazon.com/sagemaker/latest/dg/experiments.html',
            },
          ],
        },
        {
          id: 'mla2-t3',
          name: 'Evaluating models & detecting bias',
          concepts: [
            {
              id: 'mla2-t3-c0',
              title: 'Evaluation metrics for classification and regression',
              summary:
                'Choosing the right metric is as important as the model. Classification uses accuracy, precision, recall, F1, AUC and the confusion matrix; regression uses RMSE, MAE and R-squared.',
              explanation:
                "For classification, the confusion matrix counts true/false positives and negatives. Accuracy is correct predictions over total — fine for balanced classes, misleading otherwise. Precision is how many predicted positives are truly positive (penalises false positives — important when a false alarm is costly). Recall (sensitivity) is how many actual positives you caught (penalises false negatives — important when missing a positive is costly, e.g. disease or fraud). F1 is the harmonic mean of precision and recall, useful when you need balance. The ROC curve plots true-positive vs false-positive rate across thresholds, and AUC summarises it (1.0 perfect, 0.5 random) — threshold-independent and good for imbalanced data. For regression, RMSE (root mean squared error) penalises large errors heavily, MAE (mean absolute error) is more robust to outliers, and R-squared measures variance explained. Always pick the metric that reflects the business cost of each error type.",
              analogy:
                'Precision vs recall is a spam filter tradeoff: high precision means almost nothing in the inbox is spam (few false alarms); high recall means almost no spam slips through (few misses). You rarely maximise both at once.',
              keyPoints: [
                'Confusion matrix underlies classification metrics (TP, FP, TN, FN).',
                'Precision = trust of positive predictions (false positives hurt); Recall = coverage of actual positives (false negatives hurt).',
                'F1 balances precision and recall; AUC is threshold-independent and good for imbalance.',
                'Accuracy misleads on imbalanced classes.',
                'Regression: RMSE punishes big errors, MAE is outlier-robust, R-squared = variance explained.',
              ],
              commonMistakes: [
                'Optimising accuracy on imbalanced data instead of recall/precision/F1/AUC.',
                'Reporting precision when the business actually cares about catching every positive (recall), or vice versa.',
              ],
              code: {
                language: 'text',
                lines: [
                  'Precision = TP / (TP + FP)',
                  'Recall    = TP / (TP + FN)',
                  'F1        = 2 * (Precision * Recall) / (Precision + Recall)',
                ],
                explanation:
                  'Precision and recall are computed from the confusion matrix; F1 is their harmonic mean, balancing both.',
              },
              exercises: [
                {
                  type: 'quiz',
                  prompt:
                    'For a cancer-screening model, missing a true positive is far worse than a false alarm. Which metric should you prioritise?',
                  solution: { explanation: 'Recall (sensitivity) — it measures how many actual positives the model catches, penalising false negatives.' },
                },
                {
                  type: 'quiz',
                  prompt: 'Which threshold-independent metric is well suited to comparing classifiers on imbalanced data?',
                  solution: { explanation: 'AUC (area under the ROC curve).' },
                },
                {
                  type: 'predict',
                  prompt:
                    'Two regression models have similar MAE, but model A has much higher RMSE. What does that tell you?',
                  solution: {
                    explanation:
                      'Model A makes some large errors — RMSE squares errors so it is dominated by big misses, while MAE treats all errors linearly.',
                  },
                },
              ],
              docs: 'https://docs.aws.amazon.com/machine-learning/latest/dg/evaluating_models.html',
            },
            {
              id: 'mla2-t3-c1',
              services: [{ icon: 'analytics', label: 'Amazon SageMaker Clarify' }],
              title: 'Bias detection and explainability with SageMaker Clarify',
              summary:
                'SageMaker Clarify measures bias in data and models before and after training, and explains predictions with feature attributions, supporting fair and transparent ML.',
              explanation:
                "Amazon SageMaker Clarify helps you find and explain unfairness and opacity in models. It computes bias metrics on the dataset before training (pre-training bias — for example, class imbalance across a sensitive group like age or gender) and on the trained model's predictions (post-training bias — for example, differing error rates between groups). It reports metrics such as class imbalance, difference in positive proportions, and disparate impact so you can decide whether mitigation (rebalancing data, reweighting, post-processing) is needed. Clarify also provides explainability using SHAP feature attributions, showing which features most drove a prediction — both globally for the model and locally for individual predictions — which aids debugging, trust and compliance. It integrates as a Processing job and can run as part of pipelines, and Model Monitor can use it to watch for bias drift in production.",
              keyPoints: [
                'Clarify measures pre-training bias (in data) and post-training bias (in model predictions).',
                'Reports metrics like class imbalance, difference in positive proportions, disparate impact.',
                'Explainability via SHAP feature attributions — global and per-prediction.',
                'Runs as a Processing job and within SageMaker Pipelines.',
                'Supports ongoing bias-drift monitoring in production via Model Monitor.',
              ],
              commonMistakes: [
                'Checking bias only after deployment instead of before training, when the data imbalance can still be addressed.',
                'Assuming a high-accuracy model is automatically fair — accuracy says nothing about per-group error disparities.',
              ],
              diagram: {
                type: 'mermaid',
                lines: [
                  'flowchart LR',
                  '  D[(Dataset)] --> PRE[Clarify pre-training bias]',
                  '  PRE --> TR[Train]',
                  '  TR --> POST[Clarify post-training bias]',
                  '  TR --> EXP[SHAP explanations]',
                ],
                caption: 'Clarify checks bias in the data before training and in predictions after, and explains which features drive outputs.',
              },
              exercises: [
                {
                  type: 'quiz',
                  prompt:
                    'You need to know whether a trained model produces different error rates for different age groups, and which features drove a specific prediction. Which service provides both?',
                  solution: { explanation: 'Amazon SageMaker Clarify — post-training bias metrics plus SHAP-based feature attributions.' },
                },
                {
                  type: 'quiz',
                  prompt: 'When should you ideally first run a bias check on the data?',
                  solution: {
                    explanation:
                      'Before training (pre-training bias analysis), so data imbalance across sensitive groups can be addressed before it is baked into the model.',
                  },
                },
              ],
              docs: 'https://docs.aws.amazon.com/sagemaker/latest/dg/clarify-fairness-and-explainability.html',
            },
          ],
        },
      ],
    },

    /* ──────── DOMAIN 3 — DEPLOYMENT AND ORCHESTRATION OF ML WORKFLOWS (22%) ──────── */
    {
      level: 3,
      name: 'Deployment & Orchestration',
      focus: 'Serving models with the right endpoint type, managing model versions, and automating ML workflows with pipelines and CI/CD (Domain 3 · 22%)',
      accent: '#e8862a',
      soft: '#fff1e2',
      topics: [
        {
          id: 'mla3-t0',
          name: 'Choosing an inference option',
          concepts: [
            {
              id: 'mla3-t0-c0',
              services: [{ icon: 'analytics', label: 'SageMaker Endpoints' }],
              title: 'Real-time, serverless, asynchronous and batch inference',
              summary:
                'SageMaker offers four inference patterns. Choosing correctly — by latency need, payload size, traffic shape and cost — is a frequently tested decision.',
              explanation:
                "SageMaker provides four ways to serve predictions. Real-time endpoints keep instances always running behind an HTTPS endpoint for low-latency, synchronous, request-response inference — best for consistent, latency-sensitive traffic; you pay while the endpoint is up. Serverless inference scales compute automatically (including to zero between requests) so you pay per request — ideal for intermittent or unpredictable traffic that can tolerate occasional cold starts. Asynchronous inference queues requests and handles large payloads (up to GBs) and long processing times, returning results to S3 — good for big inputs or slow models without holding a connection open. Batch transform runs inference over a whole dataset in S3 at once, with no persistent endpoint — ideal for offline scoring of large volumes where you do not need real-time responses. Match the pattern: steady low-latency → real-time; spiky/intermittent → serverless; large payload or long-running → async; bulk offline → batch.",
              analogy:
                'Real-time is a staffed help desk always open; serverless is on-call staff who clock in only when someone walks up; async is a drop-box you check later; batch is processing the whole day\'s mail in one sitting.',
              keyPoints: [
                'Real-time endpoint: always-on, low-latency, synchronous; pay while running. Steady traffic.',
                'Serverless: auto-scales to zero, pay per request, tolerate cold starts. Intermittent traffic.',
                'Asynchronous: queues requests, large payloads/long runtimes, results to S3.',
                'Batch transform: score a whole S3 dataset at once, no persistent endpoint. Offline bulk.',
                'Choose by latency need, payload size, traffic shape and cost.',
              ],
              commonMistakes: [
                'Running an always-on real-time endpoint for traffic that arrives a few times a day — serverless would be far cheaper.',
                'Using a real-time endpoint for huge payloads or multi-minute inference instead of asynchronous inference.',
              ],
              diagram: {
                type: 'mermaid',
                lines: [
                  'flowchart TB',
                  '  Q{Inference need?} --> RT[Steady low-latency] --> A[Real-time endpoint]',
                  '  Q --> SP[Spiky / rare] --> B[Serverless]',
                  '  Q --> LG[Large payload / slow] --> C[Asynchronous]',
                  '  Q --> BK[Bulk offline] --> D[Batch transform]',
                ],
                caption: 'Match the inference option to latency, payload size, traffic shape and cost.',
              },
              exercises: [
                {
                  type: 'quiz',
                  prompt:
                    'A model is called a handful of times per day at unpredictable moments, and a brief cold start is acceptable. Which inference option minimises cost?',
                  solution: { explanation: 'Serverless inference — it scales to zero between requests so you pay only per request.' },
                },
                {
                  type: 'quiz',
                  prompt: 'You must score 50 million records overnight with no need for live responses. Which option fits?',
                  solution: { explanation: 'Batch transform — it processes a whole S3 dataset at once without a persistent endpoint.' },
                },
                {
                  type: 'quiz',
                  prompt: 'Inputs are large files and each prediction takes several minutes. Which option suits this best?',
                  solution: { explanation: 'Asynchronous inference — it queues requests, supports large payloads and long runtimes, and delivers results to S3.' },
                },
              ],
              docs: 'https://docs.aws.amazon.com/sagemaker/latest/dg/deploy-model.html',
            },
            {
              id: 'mla3-t0-c1',
              services: [{ icon: 'analytics', label: 'SageMaker Endpoints' }, { icon: 'autoscaling', label: 'Application Auto Scaling' }],
              title: 'Multi-model endpoints, multi-container, and autoscaling',
              summary:
                'To serve many models cost-effectively and handle variable load, SageMaker supports multi-model endpoints, multi-container endpoints, and automatic scaling of endpoint instances.',
              explanation:
                "When you have many models — for example one per customer or per region — hosting a separate endpoint for each is wasteful. A multi-model endpoint hosts thousands of models behind one endpoint, loading each model into memory on demand from S3 and evicting idle ones, so you share infrastructure and pay far less while still routing by model name. Multi-container endpoints host different containers behind one endpoint (for example a preprocessing container plus an inference container as an inference pipeline, or several distinct models invoked directly). For load that varies over the day, endpoint autoscaling (via Application Auto Scaling) adds or removes instances based on a target metric such as invocations per instance or CPU, keeping latency stable while controlling cost. Together these let you serve many models efficiently and elastically.",
              keyPoints: [
                'Multi-model endpoint: many models behind one endpoint, loaded from S3 on demand — big cost savings.',
                'Multi-container endpoint: multiple containers (inference pipeline or several models) on one endpoint.',
                'Inference pipeline: chain preprocessing + model + postprocessing containers in one endpoint.',
                'Endpoint autoscaling: Application Auto Scaling adds/removes instances on a target metric.',
                'Use these to serve many models and handle variable traffic affordably.',
              ],
              commonMistakes: [
                'Creating one dedicated endpoint per model when a multi-model endpoint would share infrastructure cheaply.',
                'Forgetting to configure autoscaling, leaving an endpoint over-provisioned for the average load.',
              ],
              exercises: [
                {
                  type: 'quiz',
                  prompt:
                    'A company has 2,000 similar models (one per store) called sporadically. How can they serve all of them without 2,000 separate endpoints?',
                  solution: {
                    explanation:
                      'Use a multi-model endpoint — it hosts many models behind one endpoint, loading each from S3 on demand and sharing infrastructure.',
                  },
                },
                {
                  type: 'quiz',
                  prompt: 'Endpoint latency spikes during peak hours but the endpoint is idle overnight. What keeps latency stable while controlling cost?',
                  solution: { explanation: 'Endpoint autoscaling via Application Auto Scaling, targeting a metric like invocations per instance.' },
                },
              ],
              docs: 'https://docs.aws.amazon.com/sagemaker/latest/dg/multi-model-endpoints.html',
            },
          ],
        },
        {
          id: 'mla3-t1',
          name: 'Safe deployment & model management',
          concepts: [
            {
              id: 'mla3-t1-c0',
              services: [{ icon: 'analytics', label: 'SageMaker Endpoints' }],
              title: 'Deployment strategies: A/B, canary, blue/green',
              summary:
                'New model versions are rolled out gradually to limit risk. Production variants enable A/B testing and canary/linear traffic shifting, with automatic rollback on failure.',
              explanation:
                "A real-time endpoint can host multiple production variants — different model versions on the same endpoint — and split traffic between them by weight. This enables A/B testing: send, say, 90% of traffic to the current model and 10% to a candidate, then compare live metrics before shifting more. SageMaker endpoint deployment guardrails support blue/green deployments with traffic-shifting modes: all-at-once, canary (route a small percentage to the new version first, then the rest if healthy), and linear (shift in equal increments). Combined with CloudWatch alarms, deployments can auto-rollback if error or latency alarms fire, so a bad model never fully takes over. The goal is to validate a new version on real traffic while limiting blast radius and enabling instant rollback.",
              keyPoints: [
                'Production variants: multiple model versions on one endpoint, split by traffic weight (A/B testing).',
                'Canary: send a small percentage to the new version first, then expand if healthy.',
                'Linear: shift traffic in equal increments over time.',
                'Blue/green deployment guardrails support auto-rollback on CloudWatch alarms.',
                'Goal: validate on live traffic with limited blast radius and fast rollback.',
              ],
              commonMistakes: [
                'Replacing a production model all-at-once with no canary/rollback, risking a full outage from a bad version.',
                'Comparing model variants offline only, never validating on a slice of real traffic.',
              ],
              diagram: {
                type: 'mermaid',
                lines: [
                  'flowchart LR',
                  '  T[Live traffic] --> EP[Endpoint]',
                  '  EP -->|90%| V1[Variant A current]',
                  '  EP -->|10%| V2[Variant B candidate]',
                  '  CW[CloudWatch alarm] -.rollback.-> EP',
                ],
                caption: 'Production variants split live traffic for A/B or canary testing; alarms can trigger automatic rollback.',
              },
              exercises: [
                {
                  type: 'quiz',
                  prompt:
                    'You want to send 10% of live traffic to a new model and 90% to the current one to compare metrics before fully switching. What enables this on one endpoint?',
                  solution: { explanation: 'Multiple production variants with weighted traffic splitting (A/B testing).' },
                },
                {
                  type: 'quiz',
                  prompt: 'Which deployment mode routes a small percentage to the new version first and rolls back automatically if alarms fire?',
                  solution: { explanation: 'A canary blue/green deployment with auto-rollback tied to CloudWatch alarms.' },
                },
              ],
              docs: 'https://docs.aws.amazon.com/sagemaker/latest/dg/deployment-guardrails.html',
            },
            {
              id: 'mla3-t1-c1',
              services: [{ icon: 'analytics', label: 'SageMaker Model Registry' }, { icon: 'ecs', label: 'Amazon ECR' }],
              title: 'Model Registry, model packages and containers in ECR',
              summary:
                'The SageMaker Model Registry catalogs versioned model packages with approval status for governed promotion to production, while inference containers live in Amazon ECR.',
              explanation:
                "The SageMaker Model Registry is where you register trained models as versioned model packages grouped into model package groups (one per model lineage). Each version records the model artifact location in S3, the inference container image, metadata and metrics. Crucially, each version carries an approval status (PendingManualApproval, Approved, Rejected) — a CI/CD pipeline or reviewer approves a version, and deployment automation then promotes the approved version to staging or production. This gives governance and traceability: you always know which version is live and how it was approved. The actual inference container images are stored in Amazon ECR (Elastic Container Registry); SageMaker pulls the image from ECR and the artifact from S3 to create the endpoint. Built-in algorithms supply AWS-managed images; bring-your-own models push a custom image to ECR.",
              keyPoints: [
                'Model Registry: versioned model packages grouped into model package groups.',
                'Each version stores artifact (S3), container image, metadata and metrics.',
                'Approval status (Pending/Approved/Rejected) governs promotion to production.',
                'CI/CD deploys the Approved version — full traceability of what is live.',
                'Inference container images live in Amazon ECR; artifacts in S3.',
              ],
              commonMistakes: [
                'Deploying models straight from a notebook with no registry, losing version history and approval governance.',
                'Confusing where things live: the container image is in ECR, the model artifact is in S3.',
              ],
              diagram: {
                type: 'mermaid',
                lines: [
                  'flowchart LR',
                  '  TR[Training job] --> REG[Model Registry version]',
                  '  REG --> AP{Approved?}',
                  '  AP -->|yes| DEP[Deploy endpoint]',
                  '  ECR[(ECR image)] --> DEP',
                  '  S3[(S3 artifact)] --> DEP',
                ],
                caption: 'Trained models are registered and approved before deployment; the endpoint pulls its image from ECR and artifact from S3.',
              },
              exercises: [
                {
                  type: 'quiz',
                  prompt:
                    'A governance policy requires a human to approve each model version before it can be deployed to production. Which SageMaker feature supports this?',
                  solution: {
                    explanation:
                      'The SageMaker Model Registry — model package versions carry an approval status, and only Approved versions are promoted by deployment automation.',
                  },
                },
                {
                  type: 'quiz',
                  prompt: 'Where does SageMaker pull the inference container image from when creating an endpoint?',
                  solution: { explanation: 'Amazon ECR (Elastic Container Registry); the model artifact comes from S3.' },
                },
              ],
              docs: 'https://docs.aws.amazon.com/sagemaker/latest/dg/model-registry.html',
            },
          ],
        },
        {
          id: 'mla3-t2',
          name: 'Orchestration, pipelines & CI/CD',
          concepts: [
            {
              id: 'mla3-t2-c0',
              services: [{ icon: 'analytics', label: 'Amazon SageMaker Pipelines' }, { icon: 'stepfunctions', label: 'AWS Step Functions' }],
              title: 'SageMaker Pipelines and Step Functions for MLOps',
              summary:
                'SageMaker Pipelines is the purpose-built CI/CD orchestrator for ML workflows; AWS Step Functions orchestrates broader, multi-service workflows that include ML steps.',
              explanation:
                "Amazon SageMaker Pipelines defines an ML workflow as a directed graph of steps — processing, training, tuning, evaluation, conditional gates, model registration and deployment — that run reproducibly and are tracked with lineage. It is purpose-built for MLOps: you parameterise the pipeline, reuse step outputs via caching, and trigger runs on a schedule or event. A common pattern: process data, train, evaluate, then a Condition step registers the model only if a metric (say accuracy) exceeds a threshold, after which an approval gate controls deployment. AWS Step Functions is a general workflow orchestrator (a state machine) that coordinates many AWS services; it suits ML workflows that must also call Lambda, Glue, EMR, or other services beyond SageMaker, or where you already standardise on Step Functions. Use SageMaker Pipelines for SageMaker-centric ML CI/CD, and Step Functions when the workflow spans many services.",
              keyPoints: [
                'SageMaker Pipelines: purpose-built ML workflow orchestration with built-in lineage tracking.',
                'Steps: processing, training, tuning, evaluation, condition, register, deploy.',
                'Condition steps gate registration/deployment on a metric threshold.',
                'Step caching reuses prior outputs to save time and cost.',
                'Step Functions: general multi-service orchestration; use when the flow spans beyond SageMaker.',
              ],
              commonMistakes: [
                'Wiring together ad-hoc scripts and notebooks instead of a defined, reproducible pipeline with lineage.',
                'Reaching for Step Functions for a purely SageMaker workflow that Pipelines handles natively with tracking.',
              ],
              diagram: {
                type: 'mermaid',
                lines: [
                  'flowchart LR',
                  '  P[Process] --> T[Train]',
                  '  T --> E[Evaluate]',
                  '  E --> C{Metric above threshold?}',
                  '  C -->|yes| R[Register model]',
                  '  C -->|no| X[Stop]',
                  '  R --> D[Deploy]',
                ],
                caption: 'A SageMaker pipeline: process, train, evaluate, then register and deploy only if the model clears a metric gate.',
              },
              exercises: [
                {
                  type: 'quiz',
                  prompt:
                    'You want an automated ML workflow that processes data, trains, evaluates, and registers the model only if accuracy beats a threshold, with full lineage. Which service is purpose-built for this?',
                  solution: { explanation: 'Amazon SageMaker Pipelines, using a Condition step to gate registration on the metric.' },
                },
                {
                  type: 'quiz',
                  prompt: 'Your ML workflow must also coordinate Lambda functions, a Glue job and an external system. Which orchestrator fits broad multi-service flows?',
                  solution: { explanation: 'AWS Step Functions.' },
                },
              ],
              docs: 'https://docs.aws.amazon.com/sagemaker/latest/dg/pipelines.html',
            },
            {
              id: 'mla3-t2-c1',
              services: [{ icon: 'analytics', label: 'AWS CodePipeline' }, { icon: 'cloudformation', label: 'AWS CloudFormation' }, { icon: 'eventbridge', label: 'Amazon EventBridge' }],
              title: 'CI/CD and infrastructure as code for ML',
              summary:
                'Production ML uses the same CI/CD discipline as software: CodePipeline/CodeBuild automate build-test-deploy, CloudFormation provisions infrastructure as code, and EventBridge triggers retraining on events.',
              explanation:
                "MLOps applies software CI/CD to models. AWS CodePipeline orchestrates the stages (source, build, test, deploy), AWS CodeBuild builds and tests containers and runs validation, and AWS CodeCommit or another repo hosts the code; SageMaker Projects can scaffold these MLOps templates for you, wiring a model-build pipeline (data → train → register) to a model-deploy pipeline (approved model → staging → production). Infrastructure is defined as code with AWS CloudFormation (or the CDK) so endpoints, roles and pipelines are reproducible and reviewable rather than click-built. Amazon EventBridge connects events to actions — for example, when a new model version is approved in the registry, or when Model Monitor detects drift, an EventBridge rule can trigger a deployment or a retraining pipeline. Together this gives automated, auditable, repeatable delivery of models.",
              keyPoints: [
                'CodePipeline/CodeBuild automate source-build-test-deploy for models.',
                'SageMaker Projects scaffold ready-made MLOps build and deploy pipelines.',
                'CloudFormation/CDK provision endpoints, roles and pipelines as reproducible infrastructure as code.',
                'EventBridge triggers actions on events (model approved, drift detected) — e.g. retraining.',
                'Result: automated, auditable, repeatable model delivery.',
              ],
              commonMistakes: [
                'Manually creating endpoints in the console instead of CloudFormation/CDK, making environments hard to reproduce.',
                'Having no automated trigger to retrain when drift is detected, leaving stale models in production.',
              ],
              exercises: [
                {
                  type: 'quiz',
                  prompt:
                    'When Model Monitor detects data drift, you want to automatically kick off a retraining pipeline. Which service routes that event to the action?',
                  solution: { explanation: 'Amazon EventBridge — a rule on the drift event triggers the retraining pipeline.' },
                },
                {
                  type: 'quiz',
                  prompt: 'Which service defines SageMaker endpoints, roles and pipelines as reproducible, version-controlled templates?',
                  solution: { explanation: 'AWS CloudFormation (infrastructure as code), or the AWS CDK.' },
                },
                {
                  type: 'task',
                  prompt: 'What does a SageMaker Projects MLOps template typically provide out of the box?',
                  solution: {
                    explanation:
                      'A model-build pipeline (data prep, train, evaluate, register) and a model-deploy pipeline (deploy the approved model to staging/production), wired with CodePipeline/CodeBuild and the Model Registry.',
                  },
                },
              ],
              docs: 'https://docs.aws.amazon.com/sagemaker/latest/dg/sagemaker-projects.html',
            },
          ],
        },
      ],
    },

    /* ──── DOMAIN 4 — ML SOLUTION MONITORING, MAINTENANCE, AND SECURITY (24%) ──── */
    {
      level: 4,
      name: 'Monitoring & Security',
      focus: 'Monitoring models and infrastructure, detecting drift and retraining, securing ML solutions with IAM/VPC/KMS, and optimising cost (Domain 4 · 24%)',
      accent: '#1ba85a',
      soft: '#e6f7ee',
      topics: [
        {
          id: 'mla4-t0',
          name: 'Monitoring models & infrastructure',
          concepts: [
            {
              id: 'mla4-t0-c0',
              services: [{ icon: 'analytics', label: 'Amazon SageMaker Model Monitor' }, { icon: 'analytics', label: 'Amazon SageMaker Clarify' }],
              title: 'Model Monitor and detecting drift',
              summary:
                'Models degrade as the world changes. SageMaker Model Monitor continuously compares live data and predictions against a baseline to detect data-quality, model-quality, bias and feature-attribution drift.',
              explanation:
                "A deployed model assumes the future looks like its training data; when it does not, performance silently decays. Amazon SageMaker Model Monitor captures real requests and responses from an endpoint and compares them against a baseline computed from training data, alerting via CloudWatch when things drift. It supports four monitor types: data-quality monitoring (input feature distributions and statistics shift — data drift), model-quality monitoring (predicted vs actual labels degrade once ground truth arrives — concept drift), bias drift (group fairness metrics shift, using Clarify), and feature-attribution drift (the importance of features changes, using Clarify). You first run a baseline job, then schedule monitoring jobs that emit metrics and violation reports. Detecting drift is the trigger for investigation and retraining — without monitoring, a model can fail in production unnoticed.",
              analogy:
                'Model Monitor is like a smoke detector for your model: it watches the air (incoming data) against a known-good baseline and sounds the alarm when something changes, before the fire (silent failure) spreads.',
              keyPoints: [
                'Captures live inputs/outputs and compares to a training-derived baseline.',
                'Data-quality monitor: input distribution shift (data drift).',
                'Model-quality monitor: predicted vs actual degrades (concept drift) once labels arrive.',
                'Bias-drift and feature-attribution-drift monitors use SageMaker Clarify.',
                'Emits CloudWatch metrics and violation reports — the trigger for retraining.',
              ],
              commonMistakes: [
                'Deploying with no monitoring and assuming a model that tested well stays accurate forever.',
                'Confusing data drift (inputs change) with concept drift (the input-to-label relationship changes).',
              ],
              diagram: {
                type: 'mermaid',
                lines: [
                  'flowchart LR',
                  '  BL[Baseline from training] --> MM[Model Monitor]',
                  '  EP[Endpoint capture] --> MM',
                  '  MM --> CW[CloudWatch metrics + alarms]',
                  '  CW --> ACT[Investigate / retrain]',
                ],
                caption: 'Model Monitor compares captured live data against a baseline and raises CloudWatch alarms when drift appears.',
              },
              exercises: [
                {
                  type: 'quiz',
                  prompt:
                    'After months in production, the distribution of incoming feature values has shifted from the training data. Which monitor type detects this?',
                  solution: { explanation: 'The data-quality monitor — it detects data drift in input feature distributions versus the baseline.' },
                },
                {
                  type: 'quiz',
                  prompt: 'Ground-truth labels arrive later and the model\'s predictions are increasingly wrong even though inputs look normal. Which monitor and which drift?',
                  solution: {
                    explanation:
                      'The model-quality monitor detects concept drift — the relationship between inputs and the correct label has changed.',
                  },
                },
                {
                  type: 'task',
                  prompt: 'What must you create before scheduling a monitoring job, and why?',
                  solution: {
                    explanation:
                      'A baseline (statistics/constraints computed from training data), because monitoring works by comparing live captured data against that known-good baseline.',
                  },
                },
              ],
              docs: 'https://docs.aws.amazon.com/sagemaker/latest/dg/model-monitor.html',
            },
            {
              id: 'mla4-t0-c1',
              services: [{ icon: 'cloudwatch', label: 'Amazon CloudWatch' }, { icon: 'cloudtrail', label: 'AWS CloudTrail' }],
              title: 'CloudWatch metrics/logs and CloudTrail auditing',
              summary:
                'CloudWatch monitors endpoint and pipeline health (latency, invocations, errors, instance metrics) and stores logs; CloudTrail audits the API calls made against SageMaker and other services.',
              explanation:
                "Operational monitoring of ML infrastructure relies on Amazon CloudWatch. SageMaker publishes endpoint metrics — invocations, model latency, overhead latency, 4xx/5xx errors — plus instance metrics like CPU, GPU, memory and disk utilisation, and training-job metrics, all viewable on dashboards with alarms that can trigger autoscaling or notifications. Container and job logs (training, processing, endpoints) stream to CloudWatch Logs for debugging. Distinct from this performance view, AWS CloudTrail records the API activity against your account — who created or deleted an endpoint, who started a training job, when and from where — which is essential for security auditing and governance. The exam mental model mirrors the rest of AWS: CloudWatch answers what is happening and how the system is performing, while CloudTrail answers who did what and when.",
              keyPoints: [
                'CloudWatch metrics: invocations, model/overhead latency, 4xx/5xx errors, CPU/GPU/memory/disk.',
                'CloudWatch alarms can trigger autoscaling or notifications; Logs hold container/job logs.',
                'CloudTrail records API calls (who created/deleted endpoints, started jobs) for audit.',
                'CloudWatch = performance/operations; CloudTrail = audit of API activity.',
                'Use both: health dashboards and alarms, plus an auditable activity trail.',
              ],
              commonMistakes: [
                'Mixing up CloudWatch (performance metrics/logs) with CloudTrail (API audit of who did what).',
                'Not setting alarms on endpoint latency/error metrics, so degradations go unnoticed.',
              ],
              exercises: [
                {
                  type: 'quiz',
                  prompt:
                    'You want an alarm when an endpoint\'s model latency or 5xx error rate exceeds a threshold. Which service provides these metrics and alarms?',
                  solution: { explanation: 'Amazon CloudWatch.' },
                },
                {
                  type: 'quiz',
                  prompt: 'A security review asks which IAM principal deleted a SageMaker endpoint last week. Which service has that record?',
                  solution: { explanation: 'AWS CloudTrail — it audits API activity (who, what, when, from where).' },
                },
              ],
              docs: 'https://docs.aws.amazon.com/sagemaker/latest/dg/monitoring-cloudwatch.html',
            },
          ],
        },
        {
          id: 'mla4-t1',
          name: 'Maintaining & retraining models',
          concepts: [
            {
              id: 'mla4-t1-c0',
              services: [{ icon: 'analytics', label: 'Amazon SageMaker Pipelines' }, { icon: 'eventbridge', label: 'Amazon EventBridge' }],
              title: 'Retraining strategies and closing the MLOps loop',
              summary:
                'Drift detection should trigger retraining. Models are retrained on schedules or on events, validated against the current model, and promoted only if better — closing the automated MLOps loop.',
              explanation:
                "Maintenance keeps a model accurate over its lifetime. Two retraining triggers are common: scheduled retraining (for example weekly on fresh data) for steadily evolving domains, and event-driven retraining triggered when Model Monitor detects drift or when model-quality metrics fall below a threshold. The automated loop ties everything together: Model Monitor raises a CloudWatch alarm or EventBridge event, which starts a SageMaker pipeline that prepares new data, trains a candidate, evaluates it, and registers it only if it beats the incumbent on the validation metric; an approval gate then promotes it, often via a canary deployment with rollback. This human- or rule-approved promotion prevents a worse model from going live. Keeping the data, features (via Feature Store), code and pipeline reproducible means each retrain is auditable and comparable, and lineage tracking records exactly what produced each deployed version.",
              keyPoints: [
                'Triggers: scheduled retraining (cadence) or event-driven (drift / metric breach).',
                'Drift event/alarm starts a pipeline: prep, train candidate, evaluate, conditionally register.',
                'Promote only if the candidate beats the current model on the validation metric.',
                'Use canary deployment with rollback when promoting the new version.',
                'Reproducible data/features/code + lineage make every retrain auditable.',
              ],
              commonMistakes: [
                'Auto-deploying every retrained model without comparing it to the incumbent, risking regressions.',
                'Retraining only on a fixed schedule and missing sudden drift between scheduled runs.',
              ],
              diagram: {
                type: 'mermaid',
                lines: [
                  'flowchart LR',
                  '  MON[Model Monitor drift] --> EVT[EventBridge / alarm]',
                  '  EVT --> PIPE[Retraining pipeline]',
                  '  PIPE --> EVAL{Beats current?}',
                  '  EVAL -->|yes| PROMO[Register + canary deploy]',
                  '  EVAL -->|no| KEEP[Keep current model]',
                ],
                caption: 'The MLOps loop: detected drift triggers retraining, and the new model is promoted only if it outperforms the current one.',
              },
              exercises: [
                {
                  type: 'quiz',
                  prompt:
                    'Your domain shifts unpredictably and you want retraining to start the moment drift is detected rather than waiting for a schedule. How do you wire this?',
                  solution: {
                    explanation:
                      'Have Model Monitor raise an event/alarm that EventBridge routes to trigger a SageMaker retraining pipeline (event-driven retraining).',
                  },
                },
                {
                  type: 'predict',
                  prompt:
                    'A pipeline retrains nightly and auto-deploys the new model without comparing it to the current one. What risk does this introduce?',
                  solution: {
                    explanation:
                      'A worse model could be promoted (a regression). The pipeline should evaluate the candidate against the incumbent and deploy only if it improves the metric, ideally via canary with rollback.',
                  },
                },
              ],
              docs: 'https://docs.aws.amazon.com/sagemaker/latest/dg/pipelines.html',
            },
          ],
        },
        {
          id: 'mla4-t2',
          name: 'Securing ML solutions',
          concepts: [
            {
              id: 'mla4-t2-c0',
              services: [{ icon: 'iam', label: 'AWS IAM' }],
              title: 'IAM, least privilege and execution roles for ML',
              summary:
                'IAM controls who and what can act in your ML environment. SageMaker uses execution roles to access S3, ECR and other services on your behalf, scoped with least privilege.',
              explanation:
                "IAM governs all access in an ML solution. Human users and CI/CD systems get IAM identities with policies, but the key ML concept is the SageMaker execution role: a role SageMaker assumes to read training data from S3, pull containers from ECR, write model artifacts and logs, and create endpoints — so no long-term credentials are embedded anywhere. You apply least privilege by scoping the role to only the specific buckets, key ARNs and actions it needs (for example read on the training bucket, write on the output prefix) rather than broad wildcards, and you separate roles by function (data prep vs training vs deployment). Resource policies and condition keys (such as restricting access to a specific VPC or requiring encryption) tighten this further. An explicit Deny always overrides an Allow, and roles deliver temporary credentials via STS — the preferred pattern over static keys.",
              keyPoints: [
                'SageMaker execution role: the role SageMaker assumes to reach S3, ECR, logs and endpoints — no stored keys.',
                'Apply least privilege: scope to specific buckets, key ARNs and actions, not broad wildcards.',
                'Separate roles by function (prep, train, deploy) to limit blast radius.',
                'Condition keys can require a VPC, encryption, or specific resources.',
                'Explicit Deny beats Allow; roles use temporary STS credentials over static keys.',
              ],
              commonMistakes: [
                'Granting the execution role s3:* on all buckets instead of read/write on only the needed prefixes.',
                'Embedding access keys in notebooks or containers instead of using the execution role.',
              ],
              code: {
                language: 'json',
                lines: [
                  '{',
                  '  "Version": "2012-10-17",',
                  '  "Statement": [{',
                  '    "Effect": "Allow",',
                  '    "Action": ["s3:GetObject"],',
                  '    "Resource": "arn:aws:s3:::ml-training-data/*"',
                  '  }]',
                  '}',
                ],
                explanation:
                  'A least-privilege policy fragment letting the execution role read only objects in the training-data bucket, not every bucket in the account.',
              },
              exercises: [
                {
                  type: 'quiz',
                  prompt:
                    'How should a SageMaker training job access the training bucket in S3 without storing long-term credentials?',
                  solution: { explanation: 'Through its SageMaker execution role, which SageMaker assumes to get temporary credentials via STS.' },
                },
                {
                  type: 'predict',
                  prompt:
                    'A role has an Allow for s3:GetObject from one policy and an explicit Deny for it from another. Can it read the object?',
                  solution: { explanation: 'No — an explicit Deny always overrides any Allow.' },
                },
              ],
              docs: 'https://docs.aws.amazon.com/sagemaker/latest/dg/security-iam.html',
            },
            {
              id: 'mla4-t2-c1',
              services: [{ icon: 'vpc', label: 'Amazon VPC' }, { icon: 'kms', label: 'AWS KMS' }],
              title: 'Network isolation (VPC) and encryption (KMS)',
              summary:
                'Sensitive ML workloads run in private VPCs with no internet exposure, reaching AWS services over VPC endpoints, and encrypt data at rest with KMS and in transit with TLS.',
              explanation:
                "Two pillars protect ML data and compute. Network isolation: you can launch SageMaker training jobs, processing jobs and endpoints inside a VPC with no internet access, so traffic to S3, ECR and other AWS services flows over VPC endpoints (PrivateLink) on the private AWS network rather than the public internet — combined with security groups, subnets and optionally no direct internet route, this keeps regulated data off the open network. Encryption: data at rest is encrypted with AWS KMS keys — S3 datasets, EBS volumes on instances, model artifacts, and notebook storage can all use customer-managed KMS keys, and KMS usage is logged via CloudTrail. Data in transit is protected by TLS. Inter-node training traffic can also be encrypted. Together, VPC isolation plus KMS encryption (plus IAM least privilege) form the core of a secure ML solution and satisfy common compliance requirements.",
              keyPoints: [
                'Run training/processing/endpoints in a VPC with no internet access for sensitive data.',
                'Reach S3/ECR and other services over VPC endpoints (PrivateLink), keeping traffic off the public internet.',
                'Encrypt at rest with AWS KMS: S3 data, EBS volumes, model artifacts, notebook storage.',
                'Encrypt in transit with TLS; optionally encrypt inter-node training traffic.',
                'KMS key usage is logged in CloudTrail; combine with IAM least privilege.',
              ],
              commonMistakes: [
                'Assuming a VPC alone encrypts data — network isolation and KMS encryption are separate controls you must both apply.',
                'Leaving training jobs with default internet access when handling regulated data instead of VPC-only with VPC endpoints.',
              ],
              diagram: {
                type: 'mermaid',
                lines: [
                  'flowchart LR',
                  '  EP[Endpoint / training in VPC] --> VE[VPC endpoint]',
                  '  VE --> S3[(S3 encrypted by KMS)]',
                  '  VE --> ECR[(ECR)]',
                  '  KMS[AWS KMS] -.encrypts.-> S3',
                ],
                caption: 'A VPC-isolated job reaches S3 and ECR over private VPC endpoints, with data encrypted at rest by KMS.',
              },
              exercises: [
                {
                  type: 'quiz',
                  prompt:
                    'Regulated training data must never traverse the public internet. How do you let a VPC-bound training job reach S3 privately?',
                  solution: { explanation: 'Run the job in a VPC with no internet access and use a VPC endpoint (PrivateLink) for S3, keeping traffic on the private AWS network.' },
                },
                {
                  type: 'quiz',
                  prompt: 'Which service encrypts S3 datasets, EBS volumes and model artifacts at rest with keys you control?',
                  solution: { explanation: 'AWS KMS (Key Management Service), using customer-managed keys.' },
                },
                {
                  type: 'task',
                  prompt: 'Name the three core controls that together secure an ML solution on AWS.',
                  solution: {
                    explanation:
                      'IAM least privilege (who/what can act), VPC network isolation (private connectivity), and KMS encryption (data at rest) plus TLS in transit.',
                  },
                },
              ],
              docs: 'https://docs.aws.amazon.com/sagemaker/latest/dg/infrastructure-security.html',
            },
          ],
        },
        {
          id: 'mla4-t3',
          name: 'Cost optimization for ML',
          concepts: [
            {
              id: 'mla4-t3-c0',
              services: [{ icon: 'analytics', label: 'Amazon SageMaker' }, { icon: 'costexplorer', label: 'AWS Cost Explorer' }],
              title: 'Optimising cost across the ML lifecycle',
              summary:
                'ML spend concentrates in training and always-on inference. Spot training, right-sizing, serverless and batch inference, multi-model endpoints and Savings Plans keep costs in check.',
              explanation:
                "Cost optimisation spans the whole lifecycle. In training, use managed Spot training (up to ~90% off) for interruption-tolerant jobs with checkpointing, right-size instances (do not pay for a GPU a tabular job will not use), use Automatic Model Tuning efficiently rather than brute-force grids, and stop idle notebook instances and Studio apps. In inference — usually the largest ongoing cost because endpoints run continuously — pick the cheapest pattern that meets the need: serverless for intermittent traffic, batch transform for offline scoring, asynchronous for sporadic large jobs, and multi-model endpoints to share infrastructure across many models; add autoscaling so you do not over-provision. SageMaker Savings Plans commit to a usage level for a discount on steady SageMaker compute. Track and attribute spend with AWS Cost Explorer and cost allocation tags, and set AWS Budgets alerts. The recurring exam theme: match compute to the workload and never leave resources running idle.",
              keyPoints: [
                'Training: managed Spot (up to ~90% off) with checkpoints; right-size instances; stop idle notebooks/apps.',
                'Inference: serverless (intermittent), batch (offline), async (sporadic large), multi-model (share infra).',
                'Add endpoint autoscaling so you pay for what load requires, not the peak.',
                'SageMaker Savings Plans discount steady SageMaker compute.',
                'Track with Cost Explorer + cost allocation tags; alert with AWS Budgets.',
              ],
              commonMistakes: [
                'Leaving a real-time endpoint or notebook running 24/7 for traffic that arrives occasionally.',
                'Using on-demand for long interruption-tolerant training instead of managed Spot with checkpointing.',
              ],
              diagram: {
                type: 'mermaid',
                lines: [
                  'flowchart TB',
                  '  TRAIN[Training] --> SPOT[Spot + right-size + stop idle]',
                  '  INFER[Inference] --> PICK[Serverless / batch / multi-model + autoscale]',
                  '  STEADY[Steady usage] --> SP[SageMaker Savings Plans]',
                  '  ALL[Track] --> CE[Cost Explorer + Budgets + tags]',
                ],
                caption: 'Cost levers differ by phase: Spot and right-sizing for training, the cheapest fitting pattern for inference, and Savings Plans for steady use.',
              },
              exercises: [
                {
                  type: 'quiz',
                  prompt:
                    'A real-time endpoint serves only a few hundred sporadic requests per day but runs 24/7. What change cuts cost most while keeping it serverless-friendly?',
                  solution: {
                    explanation:
                      'Switch to serverless inference, which scales to zero between requests so you pay per request instead of for an always-on instance.',
                  },
                },
                {
                  type: 'quiz',
                  prompt: 'A long deep-learning training job can be checkpointed and resumed. Which option reduces its cost the most?',
                  solution: { explanation: 'Managed Spot training (up to ~90% savings) with checkpointing to S3 so interruptions are recoverable.' },
                },
                {
                  type: 'task',
                  prompt: 'Name two ways to reduce the cost of serving many distinct models with variable traffic.',
                  solution: {
                    explanation:
                      'Use a multi-model endpoint to share infrastructure across models, and enable endpoint autoscaling so capacity tracks demand rather than peak.',
                  },
                },
              ],
              docs: 'https://docs.aws.amazon.com/sagemaker/latest/dg/managed-spot-training.html',
            },
          ],
        },
      ],
    },
  ],
};

export default content;
