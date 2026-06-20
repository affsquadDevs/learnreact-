import { Link } from 'react-router-dom';
import PageShell from '../components/PageShell';
import { articles, categories, categoryMeta, formatArticleDate } from '../content/articles/manifest';
import styles from './Blog.module.css';

export default function Blog() {
  return (
    <PageShell
      title="React Articles & Guides"
      lead="Practical guides across getting started, core React, careers, and how React is used in the real world."
    >
      {categories.map((cat) => {
        const posts = articles
          .filter((a) => a.category === cat)
          .sort((a, b) => (a.date < b.date ? 1 : -1));
        if (!posts.length) return null;
        return (
          <section key={cat} className={styles.pillar}>
            <h2 className={styles.pillarTitle}>{cat}</h2>
            {categoryMeta[cat] ? <p className={styles.pillarLead}>{categoryMeta[cat]}</p> : null}
            <ul className={styles.postList}>
              {posts.map((a) => (
                <li key={a.slug} className={styles.post}>
                  <h3 className={styles.postTitle}>
                    <Link to={`/blog/${a.slug}`}>{a.title}</Link>
                  </h3>
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
          </section>
        );
      })}
    </PageShell>
  );
}
