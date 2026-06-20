# SEO Audit — ReactWay (`learnreact-`)

**Repository:** `affsquadDevs/learnreact-`
**Audit date:** 2026-06-20
**Method:** Multi-agent audit across 10 SEO dimensions, every finding adversarially re-verified against source.
**Result:** 69 findings confirmed (0 false positives) — **9 critical, 22 high, 20 medium, 12 low, 6 info**.

---

## Overall verdict: 18 / 100 — Critically deficient (pre-foundational)

This is a well-engineered React **application** with effectively **zero SEO foundation**. One root cause cascades through nearly every dimension: the site is a fully **client-side-rendered (CSR) SPA**. `src/main.jsx` mounts into an empty `<div id="root">` in `index.html`; there is no SSR, SSG, or prerendering. The HTML served for *every* URL is a **0.64 kB shell** whose only machine-readable content is one static `<title>` and one `<meta name="description">` (`index.html:7-13`) — byte-identical across `/`, `/course`, and `/roadmap`.

Non-JS crawlers — Bing's inconsistent renderer, and the **non-rendering** GPTBot / ClaudeBot / PerplexityBot / Slack / LinkedIn / Facebook / X bots — receive a blank page: no content, no link previews, no AI-citation surface. Compounding this: the catch-all `path="*"` route renders `<Landing />` (`src/App.jsx:29`), so every nonexistent URL returns HTTP 200 with full homepage markup (soft-404 / infinite duplicate content); and `BrowserRouter` history mode with no server rewrite means direct hits to `/course` and `/roadmap` hard-404 on a static host.

The few positives — correct `<html lang="en">`, charset, viewport (`index.html:2-6`), content-hashed immutable assets, and an all-vector image set with no CLS risk — are foundational hygiene, not SEO wins.

### Measured build (production)

| Artifact | Raw | Gzip | Note |
|---|---|---|---|
| `dist/index.html` | 0.64 kB | 0.39 kB | **Empty `#root` shell** — all content is JS-injected |
| `dist/assets/index-*.js` | 421.58 kB | **132.52 kB** | **Single chunk, 461 modules — no code splitting** |
| `dist/assets/index-*.css` | 52.16 kB | 10.84 kB | One stylesheet |

---

## Scorecard by dimension

| Dimension | Score | Rationale |
|---|---|---|
| Rendering | **8** | CSR empty shell + catch-all soft-404 + history-mode deep-link 404 + no prerender/robots/sitemap. Almost every signal is JS-gated. |
| Metadata | **12** | Single static title/description shared by all 3 routes; no canonical, no robots meta, no head-management layer. Only lang/charset/viewport are correct. |
| Social | **5** | Zero Open Graph and zero Twitter Card tags; no `og:image` asset — every unfurl is bare on every platform. |
| Structured data | **0** | No JSON-LD of any kind. Forfeits all rich results for an education site. |
| Content | **25** | `/course` default view has no `<h1>`; broken heading order; thin placeholder lesson bodies; catch-all duplicates Landing. |
| Technical files | **5** | No robots.txt, sitemap.xml, SPA 404 fallback, or manifest; incomplete favicon set. |
| Images / media | **55** | Healthy vector-only architecture (no CLS/raster issues), but no social image and ~30 decorative SVGs leak into the a11y tree. |
| Linking | **18** | Primary CTAs are `<button onClick=navigate>` (no crawlable href); module cards are `div onClick`; all 12 footer links are `href="#"`; `/course` is a near-orphan. |
| Performance | **30** | One 132 kB-gzip chunk, no splitting; framer-motion on ~25 elements + 3 infinite loops on the LCP route; render-blocking Google Fonts `@import`. Asset hashing is correct. |
| Accessibility | **35** | No skip link, no SPA focus management, no focus indicators, `prefers-reduced-motion` ignored app-wide; several name/role/value gaps. |

---

## Top 5 highest-leverage fixes (impact ÷ effort)

1. **Add `robots.txt` + `sitemap.xml` + SPA 404 fallback** *(trivial)* — without these, crawlers can't discover `/course` or `/roadmap`, have no canonical inventory, and deep links hard-404. Three small static files. See Appendix A.
2. **Make `/course` crawlably linked from the homepage** *(small)* — the main conversion page has **no crawlable inbound link**; every homepage path is a `navigate()` button. Replace with `<Link to="/course">`.
3. **Add Open Graph + Twitter tags + a 1200×630 `og:image`** *(small)* — a course funnel lives on shared links; today every unfurl is image-less. Static tags in `index.html` work for all routes immediately. See Appendix B.
4. **Add Organization + WebSite + Course JSON-LD** *(trivial→small)* — zero structured data forfeits Course rich results and brand signals. Static JSON-LD in `index.html` is crawled most reliably. See Appendix C.
5. **Fix the catch-all soft-404 + add per-route head management** *(small→medium)* — replace `path="*" → <Landing/>` with a real `<NotFound/>` (noindex), and give each route a unique title/description/canonical.

---

## Phased remediation roadmap

### Phase 1 — Quick wins (< 1 day, no architecture change)
- Add `public/robots.txt` and `public/sitemap.xml` (Appendix A).
- Add SPA fallback rewrite (`_redirects` / `vercel.json` / `404.html`) and set Vite `base` if deploying to a subpath.
- Add OG + Twitter tags to `index.html` and ship `public/og-image.png` (1200×630) (Appendix B).
- Add static Organization + WebSite + Course JSON-LD to `index.html` (Appendix C).
- Convert "Go to course" CTAs and curriculum module cards to `<Link>` (Hero, CTA, CurriculumPreview, Header).
- Fix footer `href="#"` links → real targets or remove; make social `<span>`s real anchors with `rel="noopener noreferrer"`.
- Replace catch-all `<Landing/>` with a real `<NotFound/>` carrying `noindex`.
- Add a skip-to-content link and a global `prefers-reduced-motion` CSS guard (Appendix D).
- Add `aria-hidden="true"` to the shared `Svg` wrapper and decorative inline SVGs.
- Delete dead assets `public/icons.svg` and `src/assets/vite.svg`.
- Add an `<h1>` to the `/course` dashboard default view and a heading to the Voices section.

### Phase 2 — Structural (the core fix)
- **Introduce prerendering / SSG** for the 3 routes (`vite-react-ssg` or a prerender step). Single highest-leverage change — see below.
- Per-route head management (React 19 `<title>`/`<meta>` hoisting, or `react-helmet-async`): unique title/description/canonical/OG per route.
- Per-route JSON-LD baked into prerendered HTML: `Course`/`CourseInstance` + `ItemList` on `/course`, `ItemList` on `/roadmap`, `BreadcrumbList` on both.
- Bake static course/roadmap text from `src/data/*` into prerendered HTML so the curriculum is indexable.
- Route-based code splitting via `React.lazy()` for Course and Roadmap (Appendix E).

### Phase 3 — Polish & quality
- Expand thin `/course` lesson bodies with real keyword-bearing content.
- Self-host (or `preconnect` + async) Google Fonts; trim weight families; remove the render-blocking `@import`.
- Gate/limit the 3 infinite framer-motion loops; don't gate the hero LCP `<h1>` behind an entrance animation.
- Accessibility depth: SPA focus management, visible focus indicators, `aria-pressed`/`aria-controls` on toggles, mobile-nav `aria-controls`, contrast-token fixes, timer live-region, `<main>` + heading fix on `/roadmap`.
- Web app manifest + complete PNG/Apple-touch favicon set with theme color.
- Breadcrumb UI on `/course` and `/roadmap` matching the BreadcrumbList schema.
- Header "Course" nav item → point to `/course`, not the `#curriculum` anchor.

---

## The single most important architectural recommendation

**Adopt static prerendering (SSG) for the three known routes — convert the build from a pure CSR SPA into a prerendered SPA.**

Every critical finding traces to one fact: `index.html` ships an empty `#root` and all content, metadata, structured data, and links materialize only after a 132 kB JS bundle executes. That is the root cause behind the empty-shell rendering, the JS-gated course/roadmap content, the render-wave indexing lag, *and* the reason any client-side per-route meta/OG/JSON-LD is invisible to the non-rendering bots that matter most.

Because this site has exactly **three fixed routes** driven by static local data (`src/data/course.js`, `src/data/roadmap.js`), SSG is unusually cheap and clean here — no dynamic routes to enumerate. `vite-react-ssg` (or a puppeteer prerender step) emits `/index.html`, `/course/index.html`, and `/roadmap/index.html`, each with fully-rendered content, route-specific head tags, and JSON-LD baked in. This single change simultaneously gives every bot real content, eliminates the deep-link 404, enables differentiated previews and reliable structured data, and removes render-budget risk — while keeping client interactivity (StudyTimer, progress tracking) intact via hydration.

---

## Full findings by dimension

Severity legend: 🔴 critical · 🟠 high · 🟡 medium · 🔵 low · ⚪ info

### Rendering & crawlability

| # | Sev | Finding | Evidence | Fix |
|---|---|---|---|---|
| 1 | 🔴 | CSR ships an empty `#root` shell — no indexable HTML for any route | `index.html:14` empty `#root`; `src/main.jsx:6`; all body strings live only in `index-*.js` | Prerender all 3 routes so served HTML contains real content |
| 2 | 🔴 | No prerendering / SSG configured (root cause) | `vite.config.js` = `plugins:[react()]` only; no per-route HTML in `dist/` | Adopt `vite-react-ssg` / react-snap / Astro migration |
| 3 | 🟠 | Catch-all route renders Landing → soft 404 on every nonexistent URL | `src/App.jsx:29` `<Route path="*" element={<Landing/>}>` | Real `<NotFound/>` + host 404 status |
| 4 | 🟠 | BrowserRouter history mode, no server SPA fallback → deep links hard-404 | `src/App.jsx:23`; no `_redirects`/`404.html`/`vercel.json` | Host rewrite to `/index.html` (Appendix A) |
| 5 | 🟠 | No robots.txt and no sitemap.xml | `public/` has only favicon.svg + icons.svg | Add both (Appendix A) |
| 6 | 🟡 | No indexability controls (robots meta / X-Robots-Tag) | No `<meta robots>`/canonical anywhere | Per-route robots meta + noindex on 404 |
| 7 | 🔵 | Interactive/static content (course, roadmap data) fully gated behind JS | `dist/index.html` empty; titles from `src/data/*` render only client-side | Prerender static portions; hydrate only widgets |

### Metadata (`<head>`)

| # | Sev | Finding | Evidence | Fix |
|---|---|---|---|---|
| 8 | 🔴 | Identical static title + description across all routes | `index.html:8-11`; no `document.title`/helmet in `src/` | Unique per-route title (~55c) + description (~155c) |
| 9 | 🟠 | No canonical tag anywhere (amplified by soft-404) | grep `canonical` = 0 matches | Self-referencing `<link rel=canonical>` per route |
| 10 | 🟠 | No head-management approach (structural blocker) | no helmet dep; plain `<Route>` | `react-helmet-async` or React 19 hoisting + SSG |
| 11 | 🟡 | No robots meta tag / no crawl directives | no `<meta robots>` | `index,follow` default; `noindex` on 404 |
| 12 | ⚪ | `<html lang>`, charset, viewport present and correct | `index.html:2,4,6` | No change |

### Social (Open Graph / Twitter)

| # | Sev | Finding | Evidence | Fix |
|---|---|---|---|---|
| 13 | 🟠 | No Open Graph tags — bare previews on every platform | grep `og:` = 0 | Add OG block (Appendix B) |
| 14 | 🟡 | No Twitter Card tags | grep `twitter:` = 0 | Add `summary_large_image` block |
| 15 | 🟡 | Missing `og:image` (1200×630) asset | `public/` has no PNG | Create `public/og-image.png` |
| 16 | 🟡 | Per-route OG impossible without head-management/SSG | single static `index.html` | Static now; per-route via SSG |

### Structured data (Schema.org JSON-LD)

| # | Sev | Finding | Evidence | Fix |
|---|---|---|---|---|
| 17 | 🔴 | No structured data of any kind | no `ld+json` in repo | Add JSON-LD (Appendix C) |
| 18 | 🔴 | Missing Course / CourseInstance schema (highest value) | `src/data/course.js:4-11` has real values, unused | Course JSON-LD on `/course` |
| 19 | 🟠 | Missing Organization schema (publisher ReactWay) | brand named, no Organization node | Org JSON-LD in `index.html` |
| 20 | 🟡 | Missing WebSite schema (+ optional SearchAction) | none | WebSite JSON-LD (SearchAction only if real search) |
| 21 | 🟡 | Missing ItemList for curriculum / roadmap levels | `course.js` 4 modules, `roadmap.js` 4 levels | ItemList per page |
| 22 | 🔵 | Missing BreadcrumbList for `/course` and `/roadmap` | `Course.jsx:402` is an in-app label, not schema | BreadcrumbList per route |
| 23 | ⚪ | FAQPage deliberately NOT recommended (no qualifying Q&A) | "FAQ" is only a footer label | Do not add until real Q&A exists |
| 24 | 🟠 | CSR caveat: client-injected JSON-LD crawled less reliably | CSR confirmed | Static site-wide schema now; per-route via SSG |

### Content & semantic HTML

| # | Sev | Finding | Evidence | Fix |
|---|---|---|---|---|
| 25 | 🔴 | Default `/course` view renders ZERO `<h1>` | `Course.jsx:230` first heading is "Good morning, Alex"; h1 only in lesson sub-view (`:416`) | Always-present route `<h1>`; demote lesson h1→h2 |
| 26 | 🟠 | Catch-all duplicates Landing h1/content for every unknown URL | `src/App.jsx:29` | `<NotFound/>` with own h1 |
| 27 | 🟠 | Thin/placeholder content on `/course` (lesson bodies are templates) | `Course.jsx:449-453`; `course.js:2` comment | Add real per-lesson `description`/`objectives`/`keywords` |
| 28 | 🟡 | Landing heading order skips levels (h1→h4→h3→h2…→h5) | Showcase `h4`/`h3`, Features `h2`, Footer `h5` | Mock UI should use `<p>`, not headings |
| 29 | 🟡 | Voices (stats + testimonials) section has no heading | `Voices.jsx:35` no h2/h3 | Add a section `<h2>` |
| 30 | 🟡 | Roadmap missing `<main>` and skips h3 (h2→h4) | `Roadmap.jsx:23`; `TopicNode.jsx:42` `<h4>` | Wrap in `<main>`; topic `<h4>`→`<h3>` |
| 31 | 🟡 | Footer uses dead placeholder link text (`href="#"`) | `Footer.jsx:38` — 12 dead anchors | Wire to real routes/anchors |
| 32 | 🔵 | `<nav>`/`<section>`s lack accessible names | `Header.jsx:37`; section components | `aria-label`/`aria-labelledby` |
| 33 | 🔵 | Primary CTAs are buttons, not crawlable `<a href>` | Hero/Header/CTA `navigate()` | Use `<Link>` |
| 34 | ⚪ | No meaningful text trapped in images/SVG (healthy) | no `<img>`, no text-in-SVG | Keep convention |

### Technical SEO files & deploy

| # | Sev | Finding | Evidence | Fix |
|---|---|---|---|---|
| 35 | 🔴 | No SPA fallback (404) + no Vite `base` | history-mode routes; no fallback files | Host rewrite / `404.html`; set `base` if subpath |
| 36 | 🟠 | robots.txt + sitemap.xml missing | `public/` listing | Add both (Appendix A) |
| 37 | 🟡 | Incomplete favicon set | `index.html:5` SVG only; no apple-touch/PNG/theme-color | Add PNGs + `theme-color` |
| 38 | 🔵 | No web app manifest | no `<link rel=manifest>` | Add `site.webmanifest` |

### Images & media

| # | Sev | Finding | Evidence | Fix |
|---|---|---|---|---|
| 39 | 🟠 | No social-share image (and no `og:image` asset) | grep `og:`/`twitter:` = 0; no PNG | Create 1200×630 PNG (Appendix B) |
| 40 | 🟡 | Shared icon `Svg` wrapper applies no `aria-hidden` — ~30 icons leak | `icons.jsx:10-16`; play/pause/stop raw `<svg>` | Default `aria-hidden`, opt-in `title` |
| 41 | 🔵 | Decorative inline SVGs in Hero/Showcase/Course/TopicNode lack `aria-hidden` | Hero `:33,:100,:124`; Showcase `:112`; Course `:307`; TopicNode `:108` | Add `aria-hidden="true"` |
| 42 | ⚪ | Logo SVG correctly hidden + labelled | `Logo.jsx:6,8` | No change |
| 43 | 🔵 | Dead asset `public/icons.svg` never referenced | grep `<use`/`icons.svg` = 0 | Delete or wire to footer socials |
| 44 | 🔵 | Dead asset `src/assets/vite.svg` (scaffold leftover) | no references | Delete |
| 45 | ⚪ | All art is vector with explicit dims — no CLS/format issues | no `<img>`; SVGs sized | Guardrail for future raster |

### Internal linking & navigation

| # | Sev | Finding | Evidence | Fix |
|---|---|---|---|---|
| 46 | 🔴 | Primary "Go to course" CTA uses `navigate()` buttons — no crawlable href | Hero `:122`, CTA `:26`, Header `:52,:84`, CurriculumPreview `:48,:73`; only crawlable link is `Roadmap.jsx:44` | Replace with `<Link to="/course">` |
| 47 | 🟠 | Curriculum module cards navigate via `div onClick` | `CurriculumPreview.jsx:44-50` | Wrap cards in `<Link>` |
| 48 | 🟠 | Entire footer is non-functional placeholder links | `Footer.jsx:38` 12× `href="#"` | Real `<Link>`s incl. `/course`, `/roadmap` |
| 49 | 🟠 | `/course` crawlable inbound link footprint dangerously thin (near-orphan) | single crawlable link, on `/roadmap` | Fix CTAs + footer + sitemap |
| 50 | 🟡 | Header "Course" nav links to `#curriculum`, not `/course` | `Header.jsx:8,44` | Point nav item to `/course` |
| 51 | 🟡 | Social/external links are `<span>`, not anchors (no href/rel) | `Footer.jsx:27-29` | Real `<a rel="noopener noreferrer">` |
| 52 | 🔵 | No breadcrumbs on `/course` and `/roadmap` | `Course.jsx:117-118`; `Roadmap.jsx:44-45` | Breadcrumb nav + BreadcrumbList |

### Performance & Core Web Vitals

| # | Sev | Finding | Evidence | Fix |
|---|---|---|---|---|
| 53 | 🔴 | No route-based code splitting — whole app + framer-motion in one 132 kB chunk | `App.jsx:9-11` static imports; no lazy/Suspense | `React.lazy()` routes + manualChunks (Appendix E) |
| 54 | 🟠 | framer-motion on ~25 elements on LCP route, no reduced-motion in JS | Hero 25 motion els; only `Logo.module.css:38` honors RM | `<MotionConfig reducedMotion="user">` |
| 55 | 🟠 | 3 infinite (`repeat:Infinity`) loops run forever on landing | Hero `:14`, Features `:102`, Showcase `:178` | Gate by viewport/reduced-motion; prefer CSS keyframes |
| 56 | 🟠 | Render-blocking Google Fonts `@import` delays LCP | `src/index.css:1` | `preconnect` + async `<link>` or self-host (Appendix D) |
| 57 | 🟡 | LCP hero `<h1>` gated behind JS entrance animation (opacity 0→1) | `Hero.jsx:110` `fadeUp`; `motion.js:5-12` | Render h1 static; animate secondary only |
| 58 | 🔵 | Some bars animate `width`/`height` (paint+layout, not compositor) | Hero `:68`, Features `:53`, Showcase `:163` | Prefer `transform: scaleX()`; no CLS (tracks reserve space) |
| 59 | ⚪ | Asset hashing / immutable caching correct; no raster — strength | Vite default hashing | Keep; set `Cache-Control: immutable` on `/assets/*` |

### Accessibility (SEO/UX overlap)

| # | Sev | Finding | Evidence | Fix |
|---|---|---|---|---|
| 60 | 🟠 | No skip-to-content link on any page | grep `skip` = 0 | Add skip link + `id="main"` (Appendix D) |
| 61 | 🟠 | No focus management on client-side route change | `App.jsx:13-19` only `scrollTo` | Move focus to `#main`/heading; aria-live |
| 62 | 🟠 | `prefers-reduced-motion` ignored across nearly all animation | only `Logo.module.css:38` | Global CSS guard + `useReducedMotion()` (Appendix D) |
| 63 | 🟠 | No visible focus indicator anywhere | `grep :focus src/` = 0; button/a resets strip affordance | Global `:focus-visible` outline (Appendix D) |
| 64 | 🟡 | Toggle/progress widgets lack state semantics | `TopicNode.jsx:40,99`; `Course.jsx:422` | `aria-pressed`/`aria-controls` + sr-only status |
| 65 | 🟡 | Mobile nav toggle missing `aria-controls`; menu not a labelled region | `Header.jsx:57-64,67-88` | `aria-controls` + `<nav id aria-label>` |
| 66 | 🟡 | Low-contrast muted token likely fails AA | `--c-muted-2 #9aa1ad` ≈ 2.5:1 (`index.css:20`) | Darken to `#6b7280`+ (note: `--c-muted #6b7280` already passes) |
| 67 | 🟡 | Course dashboard has no h1; landmark structure thin | `Course.jsx:53,230,416` | One h1 per route; wrap sidebar in `<nav>` |
| 68 | 🔵 | Decorative/placeholder controls focusable with no state | `Course.jsx:206-211,341-345,433-442` | `disabled`/`aria-disabled` or real roles |
| 69 | 🔵 | Live-updating timer not announced; status by color/text only | `StudyTimer.jsx:15-28`; `Course.jsx:271-273` | aria-live on state transitions (not per-second) |

---

## Appendix A — robots.txt, sitemap.xml, SPA fallback

**`public/robots.txt`**
```
User-agent: *
Allow: /
Sitemap: https://YOUR_DOMAIN/sitemap.xml
```

**`public/sitemap.xml`**
```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>https://YOUR_DOMAIN/</loc><changefreq>weekly</changefreq><priority>1.0</priority></url>
  <url><loc>https://YOUR_DOMAIN/course</loc><changefreq>weekly</changefreq><priority>0.9</priority></url>
  <url><loc>https://YOUR_DOMAIN/roadmap</loc><changefreq>monthly</changefreq><priority>0.8</priority></url>
</urlset>
```

**SPA fallback** — pick the one matching your host:
- Netlify — `public/_redirects`: `/*  /index.html  200`
- Vercel — `vercel.json`: `{ "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }] }`
- nginx: `location / { try_files $uri $uri/ /index.html; }`
- GitHub Pages: postbuild `cp dist/index.html dist/404.html`

> A 200-fallback fixes *loading* but not *crawlability of empty HTML* — combine with prerendering (Phase 2).

## Appendix B — Open Graph + Twitter (add to `index.html` `<head>`, absolute URLs)

```html
<meta property="og:type" content="website" />
<meta property="og:site_name" content="ReactWay" />
<meta property="og:title" content="ReactWay · The Right Way to Learn React" />
<meta property="og:description" content="A structured, hands-on React course with progress tracking." />
<meta property="og:url" content="https://YOUR_DOMAIN/" />
<meta property="og:image" content="https://YOUR_DOMAIN/og-image.png" />
<meta property="og:image:width" content="1200" />
<meta property="og:image:height" content="630" />
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="ReactWay · The Right Way to Learn React" />
<meta name="twitter:description" content="A structured, hands-on React course with progress tracking." />
<meta name="twitter:image" content="https://YOUR_DOMAIN/og-image.png" />
```
Ship `public/og-image.png` (1200×630 PNG; SVG is not supported by OG crawlers).

## Appendix C — JSON-LD (static, site-wide; add to `index.html` `<head>`)

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "ReactWay",
  "url": "https://YOUR_DOMAIN/",
  "logo": "https://YOUR_DOMAIN/favicon.svg",
  "description": "ReactWay — The Right Way to Learn React."
}
</script>
<script type="application/ld+json">
{ "@context": "https://schema.org", "@type": "WebSite", "name": "ReactWay", "url": "https://YOUR_DOMAIN/" }
</script>
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Course",
  "name": "The Right Way to Learn React",
  "description": "A structured, project-driven path from JSX fundamentals to production-grade apps.",
  "provider": { "@type": "Organization", "name": "ReactWay", "sameAs": "https://YOUR_DOMAIN/" },
  "educationalLevel": "Beginner to Advanced",
  "hasCourseInstance": { "@type": "CourseInstance", "courseMode": "online", "courseWorkload": "PT28H" }
}
</script>
```
Do **not** add FAQPage — no qualifying visible Q&A exists. Add `offers` to Course only when real pricing exists.

## Appendix D — Accessibility & fonts quick wins (`src/index.css`)

```css
/* Replace the @import on line 1 — move font loading to index.html with preconnect + async <link>, or self-host. */

/* Visible focus + reduced motion + skip link */
:where(a, button, [tabindex]):focus-visible {
  outline: 3px solid var(--c-blue);
  outline-offset: 2px;
  border-radius: 6px;
}
.skip-link { position: absolute; left: -9999px; top: 0; background: #fff; color: var(--c-ink); padding: 10px 16px; border-radius: 8px; z-index: 1000; }
.skip-link:focus { left: 8px; top: 8px; outline: 3px solid var(--c-blue); }
@media (prefers-reduced-motion: reduce) {
  html { scroll-behavior: auto; }
  *, *::before, *::after { animation-duration: .001ms !important; animation-iteration-count: 1 !important; transition-duration: .001ms !important; }
}
```
And wrap the app once: `import { MotionConfig } from 'framer-motion'` → `<MotionConfig reducedMotion="user"><App/></MotionConfig>`.

## Appendix E — Route code splitting (`src/App.jsx` + `vite.config.js`)

```jsx
import { lazy, Suspense } from 'react';
const Landing = lazy(() => import('./pages/Landing'));
const Course  = lazy(() => import('./pages/Course'));
const Roadmap = lazy(() => import('./pages/Roadmap'));

<Suspense fallback={null}>
  <Routes>{/* ...same routes... */}</Routes>
</Suspense>
```
```js
// vite.config.js
export default defineConfig({
  plugins: [react()],
  build: { rollupOptions: { output: { manualChunks: { 'framer-motion': ['framer-motion'] } } } },
});
```

---

*Audit performed via a 10-dimension multi-agent sweep with per-finding adversarial verification against source. All 69 findings were confirmed against the actual code; 0 false positives.*
