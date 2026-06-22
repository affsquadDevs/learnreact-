import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import Logo from './Logo';
import styles from './Header.module.css';

const navLinks = [
  { label: 'Courses', to: '/courses' },
  { label: 'Articles', to: '/blog' },
  { label: 'Curriculum', href: '#curriculum' },
  { label: 'Features', href: '#features' },
  { label: 'How it works', href: '#how' },
  { label: 'Reviews', href: '#voices' },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();

  const isActive = (to) =>
    to === '/' ? pathname === '/' : pathname === to || pathname.startsWith(`${to}/`);

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
              <Link
                key={l.label}
                to={l.to}
                className={`${styles.link} ${isActive(l.to) ? styles.linkActive : ''}`}
                aria-current={isActive(l.to) ? 'page' : undefined}
              >
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
          <Link className="btn btn-dark" to="/courses">
            Browse courses
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
              <Link
                key={l.label}
                to={l.to}
                onClick={() => setOpen(false)}
                aria-current={isActive(l.to) ? 'page' : undefined}
                style={isActive(l.to) ? { color: 'var(--c-blue)', fontWeight: 600 } : undefined}
              >
                {l.label}
              </Link>
            ) : (
              <a key={l.label} href={l.href} onClick={() => setOpen(false)}>
                {l.label}
              </a>
            )
          )}
          <Link className="btn btn-dark" to="/courses" onClick={() => setOpen(false)}>
            Browse courses
          </Link>
        </motion.div>
      )}
    </motion.header>
  );
}
