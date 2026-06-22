import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import TechLogo from './TechLogo';
import { courses } from '../data/courses';
import { useProgress } from '../hooks/useProgress';
import { fadeUp, stagger, viewport, easeOut } from '../lib/motion';
import styles from './CurriculumPreview.module.css';

const MotionLink = motion.create(Link);

function CourseMiniCard({ course }) {
  const { percent, completedCount, total } = useProgress(course);
  const started = completedCount > 0;

  return (
    <MotionLink
      to={`/course/${course.id}`}
      className={styles.card}
      variants={fadeUp}
      style={{ '--accent': course.accent }}
    >
      <div className={styles.cardTop}>
        <span className={styles.icon}>
          <TechLogo name={course.icon} size={30} color={course.accent} />
        </span>
        <span className={styles.badge}>{course.category}</span>
      </div>
      <h3>{course.title}</h3>
      <p>{course.summary}</p>
      <div className={styles.track}>
        <motion.div
          className={styles.fill}
          initial={{ width: 0 }}
          whileInView={{ width: `${percent}%` }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, ease: easeOut, delay: 0.2 }}
        />
      </div>
      <span className={styles.pctLabel}>
        {started ? `${percent}% · ${completedCount}/${total} lessons` : `${total} lessons · not started`}
      </span>
    </MotionLink>
  );
}

export default function CurriculumPreview() {
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
          Our courses
        </motion.span>
        <motion.h2 className="section-title" variants={fadeUp}>
          Pick a track and start learning
        </motion.h2>
        <motion.p className="section-sub" variants={fadeUp}>
          Each course is a self-contained path with its own lessons, roadmap and progress —
          from frontend frameworks to the cloud. No single &ldquo;main&rdquo; one; choose what you need.
        </motion.p>
      </motion.div>

      <motion.div
        className={`container ${styles.grid}`}
        style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', maxWidth: 840 }}
        variants={stagger(0.1)}
        initial="hidden"
        whileInView="show"
        viewport={viewport}
      >
        {courses.map((c) => (
          <CourseMiniCard key={c.id} course={c} />
        ))}
      </motion.div>

      <div className={`container ${styles.ctaRow}`}>
        <Link className="btn btn-primary" to="/courses">
          Browse all courses
        </Link>
      </div>
    </section>
  );
}
