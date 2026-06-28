// Static prerender step: renders each route to HTML and bakes per-route <head>
// metadata into dist/*.html, then generates the sitemap. Runs after the client
// build and the SSR build.
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { render } from './dist-ssr/entry-server.js';
import { SITE, routeMeta } from './src/seo.js';
import { articles } from './src/content/articles/manifest.js';

const template = readFileSync('dist/index.html', 'utf8');
const STATIC_DATE = '2026-06-20';

const ROUTES = [
  { url: '/', key: '/', out: 'dist/index.html', lastmod: STATIC_DATE },
  { url: '/courses', key: '/courses', out: 'dist/courses.html', lastmod: STATIC_DATE },
  { url: '/course', key: '/course', out: 'dist/course.html', lastmod: STATIC_DATE },
  { url: '/course/react', key: '/course/react', out: 'dist/course/react.html', lastmod: STATIC_DATE },
  { url: '/course/aws-cloud-practitioner', key: '/course/aws-cloud-practitioner', out: 'dist/course/aws-cloud-practitioner.html', lastmod: STATIC_DATE },
  { url: '/course/nestjs', key: '/course/nestjs', out: 'dist/course/nestjs.html', lastmod: STATIC_DATE },
  { url: '/roadmap', key: '/roadmap', out: 'dist/roadmap.html', lastmod: STATIC_DATE },
  { url: '/roadmap/react', key: '/roadmap/react', out: 'dist/roadmap/react.html', lastmod: STATIC_DATE },
  { url: '/roadmap/aws-cloud-practitioner', key: '/roadmap/aws-cloud-practitioner', out: 'dist/roadmap/aws-cloud-practitioner.html', lastmod: STATIC_DATE },
  { url: '/roadmap/nestjs', key: '/roadmap/nestjs', out: 'dist/roadmap/nestjs.html', lastmod: STATIC_DATE },
  // AWS certification courses (bulk). Each adds a /course/<id> and /roadmap/<id> page.
  // Keep in sync with the registry in src/data/courses/index.js and meta in src/seo.js.
  ...[
    'aws-ai-practitioner',
    'aws-solutions-architect-associate',
    'aws-developer-associate',
    'aws-cloudops-associate',
    'aws-data-engineer-associate',
    'aws-ml-engineer-associate',
    'aws-solutions-architect-professional',
    'aws-devops-engineer-professional',
    'aws-advanced-networking-specialty',
    'aws-security-specialty',
  ].flatMap((id) => [
    { url: `/course/${id}`, key: `/course/${id}`, out: `dist/course/${id}.html`, lastmod: STATIC_DATE },
    { url: `/roadmap/${id}`, key: `/roadmap/${id}`, out: `dist/roadmap/${id}.html`, lastmod: STATIC_DATE },
  ]),
  // Standalone tech courses (Docker, Kubernetes, DevOps, Networking, Linux, Git).
  // Keep in sync with the registry in src/data/courses/index.js and meta in src/seo.js.
  ...[
    'docker',
    'kubernetes',
    'devops',
    'networking',
    'linux',
    'git',
    'javascript',
    'typescript',
    'nodejs',
    'express',
  ].flatMap((id) => [
    { url: `/course/${id}`, key: `/course/${id}`, out: `dist/course/${id}.html`, lastmod: STATIC_DATE },
    { url: `/roadmap/${id}`, key: `/roadmap/${id}`, out: `dist/roadmap/${id}.html`, lastmod: STATIC_DATE },
  ]),
  { url: '/about', key: '/about', out: 'dist/about.html', lastmod: STATIC_DATE },
  { url: '/contact', key: '/contact', out: 'dist/contact.html', lastmod: STATIC_DATE },
  { url: '/privacy', key: '/privacy', out: 'dist/privacy.html', lastmod: STATIC_DATE },
  { url: '/terms', key: '/terms', out: 'dist/terms.html', lastmod: STATIC_DATE },
  { url: '/blog', key: '/blog', out: 'dist/blog.html', lastmod: STATIC_DATE },
  ...articles.map((a) => ({
    url: `/blog/${a.slug}`,
    key: `/blog/${a.slug}`,
    out: `dist/blog/${a.slug}.html`,
    lastmod: a.date,
  })),
  // Rendered via the catch-all route; Vercel serves dist/404.html with a 404 status.
  { url: '/__not_found__', key: 404, out: 'dist/404.html', lastmod: STATIC_DATE },
];

const esc = (s = '') =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

function headTags(meta, canonicalPath) {
  const tags = [
    `<meta name="description" content="${esc(meta.description)}" />`,
    `<meta property="og:title" content="${esc(meta.title)}" />`,
    `<meta property="og:description" content="${esc(meta.description)}" />`,
    `<meta name="twitter:title" content="${esc(meta.title)}" />`,
    `<meta name="twitter:description" content="${esc(meta.description)}" />`,
  ];
  if (meta.noindex) {
    tags.push('<meta name="robots" content="noindex, follow" />');
  } else {
    const canonical = `${SITE}${canonicalPath}`;
    tags.push(`<meta property="og:url" content="${canonical}" />`);
    tags.push(`<link rel="canonical" href="${canonical}" />`);
  }
  return tags.map((t) => `    ${t}`).join('\n');
}

mkdirSync('dist/blog', { recursive: true });
mkdirSync('dist/course', { recursive: true });
mkdirSync('dist/roadmap', { recursive: true });

for (const r of ROUTES) {
  const meta = routeMeta[r.key] || routeMeta[404];
  const appHtml = render(r.url);
  const html = template
    .replace(/<title>[\s\S]*?<\/title>/, `<title>${esc(meta.title)}</title>`)
    .replace('<div id="root"></div>', `<div id="root">${appHtml}</div>`)
    .replace('</head>', `${headTags(meta, r.url)}\n  </head>`);
  writeFileSync(r.out, html);
  console.log(`prerendered ${r.url} -> ${r.out}`);
}

// Generate sitemap.xml from indexable routes (excludes noindex pages like /course, and 404).
const indexable = ROUTES.filter((r) => r.key !== 404 && !(routeMeta[r.key] || {}).noindex);
const urls = indexable
  .map((r) => `  <url>\n    <loc>${SITE}${r.url}</loc>\n    <lastmod>${r.lastmod}</lastmod>\n  </url>`)
  .join('\n');
writeFileSync(
  'dist/sitemap.xml',
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`
);
console.log(`generated dist/sitemap.xml (${indexable.length} urls)`);
