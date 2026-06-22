// Original, hand-drawn SVG glyphs representing AWS services, rendered as a
// coloured rounded tile. These are our own simplified marks (not AWS's official
// trademarked icons) used to illustrate the Cloud Practitioner lessons. Colours
// follow AWS's service-category families. Add a service by adding an entry to
// SERVICES; unknown ids fall back to their category glyph, then to a cloud.

const CAT = {
  compute: '#ED7100',
  storage: '#1B9E4B',
  database: '#2E73B8',
  networking: '#8C4FFF',
  security: '#DD344C',
  management: '#E7157B',
  integration: '#C925D1',
  analytics: '#7C4DFF',
  billing: '#1BA85A',
  general: '#5A6B86',
};

const S = { fill: 'none', stroke: '#fff', strokeWidth: 1.7, strokeLinecap: 'round', strokeLinejoin: 'round' };
const W = { fill: '#fff' };

// Reusable primitives ------------------------------------------------------
const cylinder = (
  <g {...S}>
    <ellipse cx="12" cy="7" rx="6" ry="2.4" />
    <path d="M6 7v10c0 1.3 2.7 2.4 6 2.4s6-1.1 6-2.4V7" />
  </g>
);
const shield = (extra) => (
  <g {...S}>
    <path d="M12 3 5 6v5c0 4 3 6.5 7 8 4-1.5 7-4 7-8V6z" />
    {extra}
  </g>
);
const gear = (
  <g {...S}>
    <circle cx="12" cy="12" r="3" />
    <path d="M12 4.5v2M12 17.5v2M4.5 12h2M17.5 12h2M6.7 6.7l1.4 1.4M15.9 15.9l1.4 1.4M17.3 6.7l-1.4 1.4M8.1 15.9l-1.4 1.4" />
  </g>
);

// Service glyphs -----------------------------------------------------------
const SERVICES = {
  // Compute
  ec2: { cat: 'compute', g: <g {...S}><rect x="6" y="6" width="12" height="12" rx="1.5" /><path d="M9 3v3M15 3v3M9 18v3M15 18v3M3 9h3M3 15h3M18 9h3M18 15h3" /><rect x="9.5" y="9.5" width="5" height="5" rx="1" /></g> },
  lambda: { cat: 'compute', g: <g {...S}><path d="M7 5h4l6 14M7 19l5-9" /></g> },
  ecs: { cat: 'compute', g: <g {...S}><rect x="4" y="4" width="7" height="7" rx="1" /><rect x="13" y="4" width="7" height="7" rx="1" /><rect x="8.5" y="13" width="7" height="7" rx="1" /></g> },
  fargate: { cat: 'compute', g: <g {...S}><path d="M12 3 20 7.5v9L12 21 4 16.5v-9z" /><path d="M12 3v18M4 7.5l8 4.5 8-4.5" /></g> },
  beanstalk: { cat: 'compute', g: <g {...S}><path d="M12 21v-7" /><path d="M12 14c-4 0-6-2.5-6-6 3.5 0 6 1.5 6 6z" /><path d="M12 12c0-3 2-5 5-5 0 3.5-1.5 5-5 5z" fill="rgba(255,255,255,0.25)" /></g> },
  autoscaling: { cat: 'compute', g: <g {...S}><path d="M5 9a7 7 0 0 1 12-3" /><path d="M17 4v3h-3" /><path d="M19 15a7 7 0 0 1-12 3" /><path d="M7 20v-3h3" /></g> },
  elb: { cat: 'networking', g: <g {...S}><circle cx="12" cy="5" r="2" /><circle cx="5" cy="19" r="2" /><circle cx="12" cy="19" r="2" /><circle cx="19" cy="19" r="2" /><path d="M12 7v4M12 11H5v6M12 11v6M12 11h7v6" /></g> },

  // Storage
  s3: { cat: 'storage', g: <g {...S}><path d="M6 7h12l-1.2 11.2a1 1 0 0 1-1 .8H8.2a1 1 0 0 1-1-.8z" /><ellipse cx="12" cy="7" rx="6" ry="2" /></g> },
  ebs: { cat: 'storage', g: <g {...S}><rect x="4" y="6" width="16" height="12" rx="2" /><circle cx="12" cy="12" r="3" /><circle cx="12" cy="12" r="0.6" {...W} stroke="none" /></g> },
  efs: { cat: 'storage', g: <g {...S}><path d="M5 8h5l1.5 2H19v8.5a.5.5 0 0 1-.5.5h-13a.5.5 0 0 1-.5-.5z" /><path d="M5 8V6.5A.5.5 0 0 1 5.5 6H9l1.5 2" /></g> },
  storagegateway: { cat: 'storage', g: <g {...S}><rect x="3.5" y="10" width="7" height="9" rx="1" /><path d="M13 7h6M13 7l2.5-2.5M13 7l2.5 2.5" /><path d="M19 13h-6M19 13l-2.5-2.5M19 13l-2.5 2.5" /></g> },
  snowball: { cat: 'storage', g: <g {...S}><path d="M12 3 20 7.5v9L12 21 4 16.5v-9z" /><path d="M12 3v18M4 7.5l8 4.5 8-4.5" /></g> },
  backup: { cat: 'storage', g: shield(<path d="M9 11.5l2 2 4-4" {...S} />) },

  // Database
  rds: { cat: 'database', g: cylinder },
  aurora: { cat: 'database', g: <g {...S}><ellipse cx="12" cy="7" rx="6" ry="2.4" /><path d="M6 7v10c0 1.3 2.7 2.4 6 2.4s6-1.1 6-2.4V7" /><path d="M9 13c1.5 1.5 4.5 1.5 6 0" /></g> },
  dynamodb: { cat: 'database', g: <g {...S}><ellipse cx="12" cy="7" rx="6" ry="2.4" /><path d="M6 7v10c0 1.3 2.7 2.4 6 2.4s6-1.1 6-2.4V7" /><path d="M13 10l-3 4h3l-1 3" /></g> },
  elasticache: { cat: 'database', g: <g {...S}><rect x="4" y="7" width="16" height="10" rx="1.5" /><path d="M8 7v10M12 7v10M16 7v10" /><path d="M12 4l-1.5 2.5h3z" {...W} stroke="none" /></g> },
  redshift: { cat: 'database', g: <g {...S}><ellipse cx="12" cy="7" rx="6" ry="2.4" /><path d="M6 7v10c0 1.3 2.7 2.4 6 2.4s6-1.1 6-2.4V7" /><path d="M9.5 16v-2M12 16v-4M14.5 16v-3" /></g> },

  // Networking
  vpc: { cat: 'networking', g: <g {...S}><rect x="3.5" y="5" width="17" height="14" rx="2" strokeDasharray="3 2.4" /><circle cx="8" cy="12" r="1.6" /><circle cx="16" cy="9" r="1.6" /><circle cx="15" cy="15" r="1.6" /><path d="M9.4 11.2 14.6 9.6M9.3 12.7l4.3 2" /></g> },
  route53: { cat: 'networking', g: <g {...S}><circle cx="12" cy="12" r="8" /><path d="M4 12h16M12 4c2.5 2.2 2.5 13.8 0 16M12 4c-2.5 2.2-2.5 13.8 0 16" /></g> },
  cloudfront: { cat: 'networking', g: <g {...S}><circle cx="12" cy="12" r="8" /><path d="M12 4v16M4 12h16" /><circle cx="12" cy="12" r="3" {...W} stroke="none" /></g> },
  directconnect: { cat: 'networking', g: <g {...S}><path d="M3 12h6M15 12h6" /><rect x="9" y="9.5" width="6" height="5" rx="1" /><path d="M6 9v6M18 9v6" /></g> },
  globalaccelerator: { cat: 'networking', g: <g {...S}><circle cx="12" cy="12" r="8" /><path d="M8 13l4-7 4 7-4-2z" {...W} stroke="none" /></g> },

  // Security
  iam: { cat: 'security', g: <g {...S}><circle cx="12" cy="8.5" r="3" /><path d="M5.5 19a6.5 6.5 0 0 1 13 0" /></g> },
  kms: { cat: 'security', g: <g {...S}><circle cx="8.5" cy="9" r="3.2" /><path d="M11 11l7 7M16 16l1.5-1.5M14 14l1.5-1.5" /></g> },
  shield: { cat: 'security', g: shield() },
  waf: { cat: 'security', g: shield(<g {...S}><path d="M8.5 9h7M8.5 12h7M10 9v3M13.5 9v3" /></g>) },
  guardduty: { cat: 'security', g: <g {...S}><path d="M3 12s3.5-6 9-6 9 6 9 6-3.5 6-9 6-9-6-9-6z" /><circle cx="12" cy="12" r="2.4" /></g> },
  inspector: { cat: 'security', g: <g {...S}><circle cx="10.5" cy="10.5" r="5" /><path d="m14.5 14.5 4 4" /><path d="M8.5 10.5l1.6 1.6 3-3.2" /></g> },
  macie: { cat: 'security', g: <g {...S}><rect x="5" y="4" width="11" height="14" rx="1.5" /><path d="M8 8h5M8 11h5" /><circle cx="15" cy="15" r="3.2" /><path d="m17.3 17.3 1.7 1.7" /></g> },
  secretsmanager: { cat: 'security', g: <g {...S}><circle cx="9" cy="9" r="3" /><path d="M11 11l7 7" /><circle cx="9" cy="9" r="0.6" {...W} stroke="none" /><path d="M15 15l1.5-1.5" /></g> },
  artifact: { cat: 'security', g: <g {...S}><path d="M6 3.5h8l4 4V18a1.5 1.5 0 0 1-1.5 1.5h-9A1.5 1.5 0 0 1 6 18z" /><path d="M14 3.5V8h4" /><circle cx="11" cy="13" r="2" /><path d="M9.5 14.5 8.5 18l2.5-1.4L13.5 18l-1-3.5" /></g> },

  // Management & governance
  organizations: { cat: 'management', g: <g {...S}><rect x="9.5" y="3.5" width="5" height="4" rx="1" /><rect x="3.5" y="16" width="5" height="4" rx="1" /><rect x="9.5" y="16" width="5" height="4" rx="1" /><rect x="15.5" y="16" width="5" height="4" rx="1" /><path d="M12 7.5V12M6 16v-2.5h12V16M12 13.5V16" /></g> },
  cloudformation: { cat: 'management', g: <g {...S}><rect x="4" y="4" width="7" height="7" rx="1" /><rect x="13" y="4" width="7" height="7" rx="1" /><rect x="4" y="13" width="7" height="7" rx="1" /><rect x="13" y="13" width="7" height="7" rx="1" /></g> },
  cloudwatch: { cat: 'management', g: <g {...S}><circle cx="12" cy="12" r="8" /><path d="M12 7.5V12l3 2" /></g> },
  cloudtrail: { cat: 'management', g: <g {...S}><path d="M5 6h14M5 10h14M5 14h9" /><path d="M14.5 17.5l2 2 3.5-3.5" /></g> },
  config: { cat: 'management', g: gear },
  systemsmanager: { cat: 'management', g: gear },
  trustedadvisor: { cat: 'management', g: <g {...S}><circle cx="12" cy="12" r="8" /><path d="m8.5 12 2.5 2.5 4.5-5" /></g> },
  controltower: { cat: 'management', g: <g {...S}><path d="M7 9h10v10H7z" /><path d="M9 9V6h6v3M9.5 13h5M9.5 16h5" /></g> },
  config_health: { cat: 'management', g: gear },

  // Integration
  sqs: { cat: 'integration', g: <g {...S}><rect x="4" y="8" width="4.5" height="8" rx="1" /><rect x="9.75" y="8" width="4.5" height="8" rx="1" /><rect x="15.5" y="8" width="4.5" height="8" rx="1" /></g> },
  sns: { cat: 'integration', g: <g {...S}><path d="M5 14V10l9-5v14z" /><path d="M14 8c2 0 3.5 1.6 3.5 4S16 16 14 16" /></g> },
  stepfunctions: { cat: 'integration', g: <g {...S}><circle cx="6" cy="6.5" r="2.2" /><circle cx="18" cy="12" r="2.2" /><circle cx="6" cy="17.5" r="2.2" /><path d="M8 7.2 16 11M16 13 8 16.8" /></g> },
  eventbridge: { cat: 'integration', g: <g {...S}><circle cx="5" cy="12" r="2" /><circle cx="19" cy="12" r="2" /><circle cx="12" cy="6" r="2" /><circle cx="12" cy="18" r="2" /><path d="M7 12h10M12 8v8M6.5 10.5 10.5 7M13.5 7l4 3.5M6.5 13.5 10.5 17M13.5 17l4-3.5" /></g> },
  apigateway: { cat: 'integration', g: <g {...S}><path d="M9 5 4 12l5 7M15 5l5 7-5 7" /></g> },

  // Analytics
  athena: { cat: 'analytics', g: <g {...S}><circle cx="10.5" cy="10.5" r="5" /><path d="m14.5 14.5 4 4" /><path d="M8.5 10.5h4M10.5 8.5v4" /></g> },
  glue: { cat: 'analytics', g: <g {...S}><path d="M9 4.5h3.5a2.5 2.5 0 0 1 0 5H12v2a2.5 2.5 0 0 1-5 0V9.5H4.5a2.5 2.5 0 0 1 0-5H9z" /></g> },
  emr: { cat: 'analytics', g: <g {...S}><circle cx="6" cy="7" r="2" /><circle cx="18" cy="7" r="2" /><circle cx="12" cy="17" r="2" /><path d="M8 7h8M6 9v3l5 3M18 9v3l-5 3" /></g> },
  kinesis: { cat: 'analytics', g: <g {...S}><path d="M4 8c2.5-2 5.5-2 8 0s5.5 2 8 0M4 12c2.5-2 5.5-2 8 0s5.5 2 8 0M4 16c2.5-2 5.5-2 8 0s5.5 2 8 0" /></g> },
  quicksight: { cat: 'analytics', g: <g {...S}><path d="M5 19V5" /><path d="M5 19h14" /><path d="M9 19v-5M13 19v-9M17 19v-6" /></g> },

  // Billing & support
  budgets: { cat: 'billing', g: <g {...S}><circle cx="12" cy="12" r="8" /><path d="M12 8v8M14 9.5c-.5-.8-1.4-1-2-1-1.2 0-2 .7-2 1.6 0 2 4 1.2 4 3.2 0 1-.9 1.7-2 1.7-.8 0-1.6-.3-2-1" /></g> },
  costexplorer: { cat: 'billing', g: <g {...S}><circle cx="12" cy="12" r="8" /><path d="M12 12V4a8 8 0 0 1 8 8z" {...W} stroke="none" /><path d="M12 12 6 17" /></g> },
  pricingcalculator: { cat: 'billing', g: <g {...S}><rect x="6" y="3.5" width="12" height="17" rx="2" /><rect x="8.5" y="6" width="7" height="3" rx="0.7" /><path d="M9 12.5h.01M12 12.5h.01M15 12.5h.01M9 16h.01M12 16h.01M15 16h.01" /></g> },
  support: { cat: 'billing', g: <g {...S}><path d="M5 13a7 7 0 0 1 14 0" /><rect x="3.5" y="13" width="3.5" height="5" rx="1.4" /><rect x="17" y="13" width="3.5" height="5" rx="1.4" /><path d="M19 18c0 2-2 3-4 3" /></g> },
};

const CATEGORY_FALLBACK = {
  compute: 'ec2', storage: 's3', database: 'rds', networking: 'vpc',
  security: 'shield', management: 'cloudformation', integration: 'sqs',
  analytics: 'quicksight', billing: 'budgets',
};

const cloud = <g {...S}><path d="M7 18h9a4 4 0 0 0 .6-7.95A5.5 5.5 0 0 0 5.6 11 3.5 3.5 0 0 0 7 18Z" /></g>;

// Service ids that ship as official AWS architecture SVGs under /public/aws-icons.
// These are AWS's own service icons, used here to illustrate the course.
const OFFICIAL = new Set([
  'ec2', 'lambda', 'ecs', 'fargate', 'beanstalk', 'autoscaling', 'elb',
  's3', 'ebs', 'efs', 'storagegateway', 'snowball', 'backup',
  'rds', 'aurora', 'dynamodb', 'elasticache', 'redshift',
  'vpc', 'route53', 'cloudfront', 'directconnect', 'globalaccelerator',
  'iam', 'kms', 'shield', 'waf', 'guardduty', 'inspector', 'macie', 'secretsmanager', 'artifact',
  'organizations', 'cloudformation', 'cloudwatch', 'cloudtrail', 'config', 'systemsmanager', 'trustedadvisor',
  'sqs', 'sns', 'stepfunctions', 'eventbridge',
  'athena', 'glue', 'emr', 'kinesis', 'budgets', 'costexplorer', 'support', 'cognito',
]);

export default function AwsIcon({ name, size = 40, radius = 9 }) {
  // Prefer the official AWS SVG when we have it.
  if (OFFICIAL.has(name)) {
    return (
      <img
        src={`/aws-icons/${name}.svg`}
        width={size}
        height={size}
        alt=""
        loading="lazy"
        decoding="async"
        style={{ display: 'block' }}
      />
    );
  }

  // Fallback: our own drawn glyph (for the few services without an official asset).
  let entry = SERVICES[name];
  if (!entry) {
    const fbId = CATEGORY_FALLBACK[name];
    entry = fbId ? SERVICES[fbId] : null;
  }
  const color = entry ? CAT[entry.cat] : CAT.general;
  const glyph = entry ? entry.g : cloud;

  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" role="img">
      <rect width="24" height="24" rx={radius} fill={color} />
      <g transform="translate(0.6 0.6) scale(0.95)" style={{ transformOrigin: 'center' }}>
        {glyph}
      </g>
    </svg>
  );
}
