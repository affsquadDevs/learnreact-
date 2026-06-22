import { Link, useParams } from 'react-router-dom';
import PageShell from '../components/PageShell';
import NotFound from './NotFound';
import { getArticle, formatArticleDate } from '../content/articles/manifest';
import { bodies } from '../content/articles/bodies';
import { SITE } from '../seo';
import styles from './Blog.module.css';

export default function Article() {
  const { slug } = useParams();
  const meta = getArticle(slug);
  const Body = bodies[slug];

  if (!meta || !Body) return <NotFound />;

  const url = `${SITE}/blog/${slug}`;
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: meta.title,
    description: meta.description,
    datePublished: meta.date,
    dateModified: meta.date,
    author: { '@type': 'Organization', name: 'DevWay', url: `${SITE}/` },
    publisher: {
      '@type': 'Organization',
      name: 'DevWay',
      logo: { '@type': 'ImageObject', url: `${SITE}/favicon.svg` },
    },
    mainEntityOfPage: url,
  };

  return (
    <PageShell title={meta.title}>
      <p className={styles.articleMeta}>
        {formatArticleDate(meta.date)} · {meta.readingMins} min read
      </p>
      <p className={styles.backLink}>
        <Link to="/blog">← All articles</Link>
      </p>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Body />
      <hr className={styles.rule} />
      <p>
        Want the structured path? Explore the <Link to="/roadmap">React roadmap</Link> or browse more{' '}
        <Link to="/blog">articles</Link>.
      </p>
    </PageShell>
  );
}
