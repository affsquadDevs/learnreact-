import { Link } from 'react-router-dom';
import PageShell from '../components/PageShell';
import { articles, formatArticleDate } from '../content/articles/manifest';
import styles from './Blog.module.css';

const sorted = [...articles].sort((a, b) => (a.date < b.date ? 1 : -1));

export default function Blog() {
  return (
    <PageShell
      title="React Articles & Guides"
      lead="In-depth, practical guides to core React concepts — hooks, rendering, components, forms, and performance."
    >
      <ul className={styles.postList}>
        {sorted.map((a) => (
          <li key={a.slug} className={styles.post}>
            <h2 className={styles.postTitle}>
              <Link to={`/blog/${a.slug}`}>{a.title}</Link>
            </h2>
            <div className={styles.postMeta}>
              <span>{formatArticleDate(a.date)}</span>
              <span>·</span>
              <span>{a.readingMins} min read</span>
              <span className={styles.tags}>
                {a.tags.map((t) => (
                  <span key={t} className={styles.tag}>{t}</span>
                ))}
              </span>
            </div>
            <p className={styles.postExcerpt}>{a.excerpt}</p>
            <Link className={styles.readMore} to={`/blog/${a.slug}`}>Read article →</Link>
          </li>
        ))}
      </ul>
    </PageShell>
  );
}
