import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { fadeUp, stagger, easeOut } from '../lib/motion';
import styles from './Hero.module.css';

// Continuous float + fade-in entrance. `rot` keeps any base rotation intact
// since framer-motion fully manages the transform property.
const floatProps = (i, rot = 0) => ({
  initial: { opacity: 0, scale: 0.85, rotate: rot, y: 0 },
  animate: { opacity: 1, scale: 1, rotate: rot, y: [0, -14, 0] },
  transition: {
    opacity: { duration: 0.6, delay: 0.3 + i * 0.1 },
    scale: { duration: 0.6, delay: 0.3 + i * 0.1, ease: easeOut },
    y: { duration: 5 + i, repeat: Infinity, ease: 'easeInOut', delay: i * 0.3 },
  },
});

export default function Hero() {
  return (
    <section className={styles.hero}>
      <div className={styles.grid} aria-hidden="true" />
      <div className={styles.glow} aria-hidden="true" />

      {/* Floating decorative cards */}
      <motion.div className={`${styles.card} ${styles.note}`} {...floatProps(1, -6)}>
        <span className={styles.pin} />
        Capture key ideas, track progress and finish modules without the chaos.
      </motion.div>

      <motion.div className={`${styles.card} ${styles.check}`} {...floatProps(2)}>
        <svg viewBox="0 0 24 24" width="26" height="26" aria-hidden="true">
          <path
            d="M5 12.5l4.2 4.3L19 7"
            fill="none"
            stroke="#fff"
            strokeWidth="2.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </motion.div>

      <motion.div className={`${styles.card} ${styles.code}`} {...floatProps(1.5)}>
        <div className={styles.codeBar}>
          <span /><span /><span />
          <em>App.jsx</em>
        </div>
        <pre>
{`function App() {
  const [ok, set] =
    useState(true);
  return <Course />;
}`}
        </pre>
      </motion.div>

      <motion.div className={`${styles.card} ${styles.progress}`} {...floatProps(2.4)}>
        <div className={styles.progressTop}>
          <span className={styles.progressDot} />
          Your progress
        </div>
        <div className={styles.progressBarTrack}>
          <motion.div
            className={styles.progressBarFill}
            initial={{ width: 0 }}
            whileInView={{ width: '68%' }}
            transition={{ duration: 1.2, ease: easeOut, delay: 0.4 }}
            viewport={{ once: true }}
          />
        </div>
        <div className={styles.progressMeta}>
          <strong>8/12</strong> lessons completed
        </div>
      </motion.div>

      <motion.div className={`${styles.card} ${styles.integrations}`} {...floatProps(1.2)}>
        <div className={styles.intTitle}>Modern stack</div>
        <div className={styles.intRow}>
          <span style={{ background: '#61dafb22', color: '#0bbfe6' }}>JSX</span>
          <span style={{ background: '#8b5cf622', color: '#7c4ddb' }}>Hooks</span>
          <span style={{ background: '#ff9f4322', color: '#e8862a' }}>Router</span>
          <span style={{ background: '#2fcc7122', color: '#1ba85a' }}>Vite</span>
        </div>
      </motion.div>

      {/* Center content */}
      <motion.div
        className={`container ${styles.center}`}
        variants={stagger(0.1, 0.1)}
        initial="hidden"
        animate="show"
      >
        <motion.span className="eyebrow" variants={fadeUp}>
          <span className={styles.liveDot} /> The Right Way to Learn React
        </motion.span>

        <motion.div className={styles.logoMark} variants={fadeUp}>
          <svg viewBox="0 0 24 24" width="44" height="44" aria-hidden="true">
            <g fill="none" stroke="#2d6bff" strokeWidth="1.3">
              <ellipse cx="12" cy="12" rx="10" ry="3.8" />
              <ellipse cx="12" cy="12" rx="10" ry="3.8" transform="rotate(60 12 12)" />
              <ellipse cx="12" cy="12" rx="10" ry="3.8" transform="rotate(120 12 12)" />
            </g>
            <circle cx="12" cy="12" r="2" fill="#2d6bff" />
          </svg>
        </motion.div>

        <motion.h1 className={styles.title} variants={fadeUp}>
          Learn React
          <br />
          <span className={styles.titleMuted}>the right way</span>
        </motion.h1>

        <motion.p className={styles.sub} variants={fadeUp}>
          A structured, hands-on course from JSX fundamentals to production apps.
          Think, plan and track your learning all in one place.
        </motion.p>

        <motion.div className={styles.ctaRow} variants={fadeUp}>
          <Link className="btn btn-primary" to="/course">
            Go to course
            <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
              <path
                d="M5 12h14m-6-6l6 6-6 6"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </Link>
          <a href="#how" className="btn btn-ghost">
            How it works
          </a>
        </motion.div>

        <motion.div className={styles.trust} variants={fadeUp}>
          <div className={styles.avatars}>
            {['#2d6bff', '#61dafb', '#8b5cf6', '#ff9f43'].map((c) => (
              <span key={c} style={{ background: c }} />
            ))}
          </div>
          <span>2,000+ developers already learning</span>
        </motion.div>
      </motion.div>
    </section>
  );
}
