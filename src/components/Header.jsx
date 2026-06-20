import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Logo from './Logo';
import styles from './Header.module.css';

const navLinks = [
  { label: 'Course', to: '/course' },
  { label: 'Roadmap', to: '/roadmap' },
  { label: 'Curriculum', href: '#curriculum' },
  { label: 'Features', href: '#features' },
  { label: 'How it works', href: '#how' },
  { label: 'Reviews', href: '#voices' },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <motion.header
      className={`${styles.header} ${scrolled ? styles.scrolled : ''}`}
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className={`container ${styles.inner}`}>
        <Logo />

        <nav className={styles.nav}>
          {navLinks.map((l) =>
            l.to ? (
              <Link key={l.label} to={l.to} className={styles.link}>
                {l.label}
              </Link>
            ) : (
              <a key={l.label} href={l.href} className={styles.link}>
                {l.label}
              </a>
            )
          )}
        </nav>

        <div className={styles.actions}>
          <Link className="btn btn-dark" to="/course">
            Go to course
          </Link>
        </div>

        <button
          className={styles.burger}
          onClick={() => setOpen((v) => !v)}
          aria-label="Menu"
          aria-expanded={open}
        >
          <span /><span /><span />
        </button>
      </div>

      {open && (
        <motion.div
          className={styles.mobileMenu}
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {navLinks.map((l) =>
            l.to ? (
              <Link key={l.label} to={l.to} onClick={() => setOpen(false)}>
                {l.label}
              </Link>
            ) : (
              <a key={l.label} href={l.href} onClick={() => setOpen(false)}>
                {l.label}
              </a>
            )
          )}
          <Link className="btn btn-dark" to="/course" onClick={() => setOpen(false)}>
            Go to course
          </Link>
        </motion.div>
      )}
    </motion.header>
  );
}
