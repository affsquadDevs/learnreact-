import Logo from './Logo';
import styles from './Footer.module.css';

const cols = [
  {
    title: 'Course',
    links: ['Curriculum', 'Modules', 'Practice', 'Certificate'],
  },
  {
    title: 'Resources',
    links: ['Documentation', 'Blog', 'Community', 'FAQ'],
  },
  {
    title: 'Company',
    links: ['About', 'Contact', 'Careers', 'Press'],
  },
];

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.inner}`}>
        <div className={styles.brandCol}>
          <Logo />
          <p>Learn React in a structured way, with practice and progress tracking.</p>
          <div className={styles.socials}>
            {['Gh', 'X', 'in', 'Yt'].map((s) => (
              <span key={s}>{s}</span>
            ))}
          </div>
        </div>

        {cols.map((c) => (
          <div key={c.title} className={styles.col}>
            <h5>{c.title}</h5>
            <ul>
              {c.links.map((l) => (
                <li key={l}><a href="#">{l}</a></li>
              ))}
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
