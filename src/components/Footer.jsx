import { Link } from 'react-router-dom';
import Logo from './Logo';
import styles from './Footer.module.css';

const cols = [
  {
    title: 'Course',
    links: [
      { label: 'Curriculum', href: '#curriculum' },
      { label: 'All modules', to: '/course' },
      { label: 'Roadmap', to: '/roadmap' },
    ],
  },
  {
    title: 'Explore',
    links: [
      { label: 'Features', href: '#features' },
      { label: 'How it works', href: '#how' },
      { label: 'Reviews', href: '#voices' },
    ],
  },
  {
    title: 'React',
    links: [
      { label: 'React docs', href: 'https://react.dev', external: true },
      { label: 'React Router', href: 'https://reactrouter.com', external: true },
    ],
  },
];

// TODO: swap these for ReactWay's real social profile URLs.
const socials = [
  { label: 'GitHub', short: 'Gh', href: 'https://github.com' },
  { label: 'X (Twitter)', short: 'X', href: 'https://x.com' },
  { label: 'LinkedIn', short: 'in', href: 'https://linkedin.com' },
  { label: 'YouTube', short: 'Yt', href: 'https://youtube.com' },
];

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.inner}`}>
        <div className={styles.brandCol}>
          <Logo />
          <p>Learn React in a structured way, with practice and progress tracking.</p>
          <div className={styles.socials}>
            {socials.map((s) => (
              <a
                key={s.label}
                href={s.href}
                aria-label={`ReactWay on ${s.label}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                {s.short}
              </a>
            ))}
          </div>
        </div>

        {cols.map((c) => (
          <div key={c.title} className={styles.col}>
            <h5>{c.title}</h5>
            <ul>
              {c.links.map((l) =>
                l.to ? (
                  <li key={l.label}>
                    <Link to={l.to}>{l.label}</Link>
                  </li>
                ) : l.external ? (
                  <li key={l.label}>
                    <a href={l.href} target="_blank" rel="noopener noreferrer">
                      {l.label}
                    </a>
                  </li>
                ) : (
                  <li key={l.label}>
                    <a href={l.href}>{l.label}</a>
                  </li>
                )
              )}
            </ul>
          </div>
        ))}
      </div>

      <div className={`container ${styles.bottom}`}>
        <span>© {new Date().getFullYear()} ReactWay. All rights reserved.</span>
        <span className={styles.made}>Built with React ⚛</span>
      </div>
    </footer>
  );
}
