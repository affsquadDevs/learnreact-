// Static prerender step: renders each route to HTML and bakes per-route <head>
// metadata into dist/*.html. Runs after `vite build` (client) and the SSR build.
import { readFileSync, writeFileSync } from 'node:fs';
import { render } from './dist-ssr/entry-server.js';
import { SITE, routeMeta } from './src/seo.js';

const template = readFileSync('dist/index.html', 'utf8');

const ROUTES = [
  { url: '/', key: '/', out: 'dist/index.html' },
  { url: '/course', key: '/course', out: 'dist/course.html' },
  { url: '/roadmap', key: '/roadmap', out: 'dist/roadmap.html' },
  // Rendered via the catch-all route; Vercel serves dist/404.html with a 404 status.
  { url: '/__not_found__', key: 404, out: 'dist/404.html' },
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
