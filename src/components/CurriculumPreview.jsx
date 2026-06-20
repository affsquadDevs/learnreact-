import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { modules } from '../data/course';
import { useProgress } from '../hooks/useProgress';
import { fadeUp, stagger, viewport, easeOut } from '../lib/motion';
import styles from './CurriculumPreview.module.css';

const MotionLink = motion.create(Link);

export default function CurriculumPreview() {
  const { isCompleted, percent, completedCount, total } = useProgress();

  return (
    <section className={styles.section} id="curriculum">
      <motion.div
        className={`container ${styles.head}`}
        variants={stagger(0.1)}
        initial="hidden"
        whileInView="show"
        viewport={viewport}
      >
        <motion.span className="eyebrow" variants={fadeUp}>
          Course curriculum
        </motion.span>
        <motion.h2 className="section-title" variants={fadeUp}>
          Four modules. One right path.
        </motion.h2>
        <motion.p className="section-sub" variants={fadeUp}>
          From your first component to a production app. You’re already at{' '}
          <strong>{percent}%</strong> ({completedCount}/{total}).
        </motion.p>
      </motion.div>

      <motion.div
        className={`container ${styles.grid}`}
        variants={stagger(0.1)}
        initial="hidden"
        whileInView="show"
        viewport={viewport}
      >
        {modules.map((m, i) => {
          const done = m.lessons.filter((l) => isCompleted(l.id)).length;
          const pct = Math.round((done / m.lessons.length) * 100);
          return (
            <MotionLink
              key={m.id}
              to="/course"
              className={styles.card}
              variants={fadeUp}
              style={{ '--accent': m.accent }}
            >
              <div className={styles.cardTop}>
                <span className={styles.num}>{String(i + 1).padStart(2, '0')}</span>
                <span className={styles.badge}>{m.lessons.length} lessons</span>
              </div>
              <h3>{m.title}</h3>
              <p>{m.summary}</p>
              <div className={styles.track}>
                <motion.div
                  className={styles.fill}
                  initial={{ width: 0 }}
                  whileInView={{ width: `${pct}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.9, ease: easeOut, delay: 0.2 }}
                />
              </div>
              <span className={styles.pctLabel}>{pct}% complete</span>
            </MotionLink>
          );
        })}
      </motion.div>

      <div className={`container ${styles.ctaRow}`}>
        <Link className="btn btn-primary" to="/course">
          Open the course
        </Link>
        <Link className="btn btn-ghost" to="/roadmap">
          Explore the roadmap
        </Link>
      </div>
    </section>
  );
}
