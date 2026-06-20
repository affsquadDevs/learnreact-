import { Link } from 'react-router-dom';
import styles from './NotFound.module.css';

export default function NotFound() {
  return (
    <main id="main" tabIndex={-1} className={styles.wrap}>
      {/* Title + robots noindex for this page are baked into dist/404.html by the
          prerender step, and Vercel serves it with a real 404 status. */}
      <div className={styles.inner}>
        <p className={styles.code}>404</p>
        <h1 className={styles.title}>Page not found</h1>
        <p className={styles.sub}>
          The page you’re looking for doesn’t exist or has moved.
        </p>
        <div className={styles.actions}>
          <Link className="btn btn-primary" to="/">Back to home</Link>
          <Link className="btn btn-ghost" to="/roadmap">View the roadmap</Link>
        </div>
      </div>
    </main>
  );
}
