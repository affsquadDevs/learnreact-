import { Link } from 'react-router-dom';
import Logo from './Logo';
import styles from './Footer.module.css';

const cols = [
  {
    title: 'Courses',
    links: [
      { label: 'All courses', to: '/courses' },
      { label: 'React', to: '/course/react' },
      { label: 'AWS Cloud Practitioner', to: '/course/aws-cloud-practitioner' },
      { label: 'AWS roadmap', to: '/roadmap/aws-cloud-practitioner' },
    ],
  },
  {
    title: 'Explore',
    links: [
      { label: 'Curriculum', href: '#curriculum' },
      { label: 'Features', href: '#features' },
      { label: 'How it works', href: '#how' },
      { label: 'Articles', to: '/blog' },
    ],
  },
  {
    title: 'Resources',
    links: [
      { label: 'React docs', href: 'https://react.dev', external: true },
      { label: 'AWS docs', href: 'https://docs.aws.amazon.com', external: true },
    ],
  },
];

// TODO: swap these for DevWay's real social profile URLs.
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
          <Logo onDark />
          <p>Learn web development in a structured way, across frontend, backend and the cloud — with practice and progress tracking.</p>
          <div className={styles.socials}>
            {socials.map((s) => (
              <a
                key={s.label}
                href={s.href}
                aria-label={`DevWay on ${s.label}`}
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
        <span>© {new Date().getFullYear()} DevWay. All rights reserved.</span>
        <nav className={styles.legalNav} aria-label="Legal">
          <Link to="/about">About</Link>
          <Link to="/contact">Contact</Link>
          <Link to="/privacy">Privacy Policy</Link>
          <Link to="/terms">Terms</Link>
        </nav>
        <span className={styles.made}>Built with React</span>
      </div>
    </footer>
  );
}
