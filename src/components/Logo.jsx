import { Link } from 'react-router-dom';
import styles from './Logo.module.css';

export default function Logo({ to = '/', onDark = false }) {
  return (
    <Link
      to={to}
      className={`${styles.logo}${onDark ? ` ${styles.onDark}` : ''}`}
      aria-label="DevWay home"
    >
      <span className={styles.mark}>
        <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
          <g fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3.5 17.5 9 12l3.2 3.2L20 6.5" />
            <path d="M15 6.5h5v5" />
          </g>
        </svg>
      </span>
      <span className={styles.word}>
        Dev<span className={styles.accent}>Way</span>
      </span>
    </Link>
  );
}
