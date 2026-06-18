import { Link } from 'react-router-dom';
import styles from './Logo.module.css';

export default function Logo({ to = '/' }) {
  return (
    <Link to={to} className={styles.logo} aria-label="ReactWay home">
      <span className={styles.mark}>
        <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
          <g fill="none" stroke="currentColor" strokeWidth="1.4">
            <ellipse cx="12" cy="12" rx="10" ry="4" />
            <ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(60 12 12)" />
            <ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(120 12 12)" />
          </g>
          <circle cx="12" cy="12" r="2.1" fill="currentColor" />
        </svg>
      </span>
      <span className={styles.word}>
        React<span className={styles.accent}>Way</span>
      </span>
    </Link>
  );
}
