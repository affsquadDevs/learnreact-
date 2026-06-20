import { Link } from 'react-router-dom';
import Logo from './Logo';
import Footer from './Footer';
import styles from './PageShell.module.css';

// Shared layout for static content pages (About, Contact, Privacy, Terms).
export default function PageShell({ title, lead, updated, children }) {
  return (
    <>
      <header className={styles.bar}>
        <div className={`container ${styles.barInner}`}>
          <Logo />
          <nav className={styles.nav} aria-label="Primary">
            <Link to="/">Home</Link>
            <Link to="/course">Course</Link>
            <Link to="/roadmap">Roadmap</Link>
            <Link to="/blog">Articles</Link>
          </nav>
        </div>
      </header>

      <main id="main" tabIndex={-1} className={styles.main}>
        <article className={`container ${styles.article}`}>
          <h1>{title}</h1>
          {lead ? <p className={styles.lead}>{lead}</p> : null}
          {updated ? <p className={styles.updated}>Last updated: {updated}</p> : null}
          {children}
        </article>
      </main>

      <Footer />
    </>
  );
}
