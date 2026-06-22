import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { viewport, easeOut } from '../lib/motion';
import styles from './CTA.module.css';

export default function CTA() {
  return (
    <section className={styles.section}>
      <motion.div
        className={`container ${styles.box}`}
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={viewport}
        transition={{ duration: 0.6, ease: easeOut }}
      >
        <div className={styles.grid} aria-hidden="true" />
        <h2 className={styles.title}>
          Ready to learn web dev
          <br /> the right way?
        </h2>
        <p className={styles.sub}>
          Pick a course and start your first lesson today. Your progress is saved automatically.
        </p>
        <div className={styles.actions}>
          <Link className={styles.primary} to="/courses">
            Browse courses
          </Link>
          <a href="#curriculum" className={styles.ghost}>
            View curriculum
          </a>
        </div>
      </motion.div>
    </section>
  );
}
