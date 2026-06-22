import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Header from '../components/Header';
import Footer from '../components/Footer';
import TechLogo from '../components/TechLogo';
import { courses } from '../data/courses';
import { useProgress } from '../hooks/useProgress';
import { fadeUp, stagger, viewport, easeOut } from '../lib/motion';
import styles from './Courses.module.css';

const MotionLink = motion.create(Link);

// Display order for category sections; any unlisted category is appended after.
const CATEGORY_ORDER = ['Frontend', 'Backend', 'Cloud / DevOps', 'Languages', 'Fundamentals'];

function groupByCategory(list) {
  const map = new Map();
  for (const c of list) {
    if (!map.has(c.category)) map.set(c.category, []);
    map.get(c.category).push(c);
  }
  return [...map.entries()].sort(
    (a, b) => {
      const ia = CATEGORY_ORDER.indexOf(a[0]);
      const ib = CATEGORY_ORDER.indexOf(b[0]);
      return (ia === -1 ? 99 : ia) - (ib === -1 ? 99 : ib);
    }
  );
}

function CourseCard({ course }) {
  const { percent, completedCount, total } = useProgress(course);
  const started = completedCount > 0;

  return (
    <MotionLink
      to={`/course/${course.id}`}
      className={styles.card}
      variants={fadeUp}
      style={{ '--accent': course.accent, '--soft': course.soft }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2, ease: easeOut }}
    >
      <div className={styles.cardTop}>
        <span className={styles.badge}>
          <TechLogo name={course.icon} size={26} color={course.accent} />
        </span>
        <span className={styles.category}>{course.tech}</span>
      </div>

      <h3 className={styles.cardTitle}>{course.title}</h3>
      <p className={styles.cardSummary}>{course.summary}</p>

      <ul className={styles.metaList}>
        <li><strong>{course.meta.lessonsCount}</strong> lessons</li>
        <li><strong>{course.level}</strong></li>
        <li>{course.duration}</li>
      </ul>

      <div className={styles.track}>
        <motion.div
          className={styles.fill}
          initial={{ width: 0 }}
          whileInView={{ width: `${percent}%` }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, ease: easeOut, delay: 0.15 }}
        />
      </div>
      <span className={styles.progressLabel}>
        {started ? `${percent}% · ${completedCount}/${total} lessons` : 'Not started yet'}
      </span>

      <span className={styles.openBtn}>
        {started ? 'Continue course' : 'Start course'} →
      </span>
    </MotionLink>
  );
}

export default function Courses() {
  return (
    <>
      <Header />
      <main id="main" tabIndex={-1}>
        <section className={styles.hero}>
          <div className={`container ${styles.heroInner}`}>
            <motion.span className="eyebrow" variants={fadeUp} initial="hidden" animate="show">
              Web technology courses
            </motion.span>
            <motion.h1
              className={styles.heroTitle}
              variants={stagger(0.08)}
              initial="hidden"
              animate="show"
            >
              <motion.span variants={fadeUp}>Learn web technologies, the right way.</motion.span>
            </motion.h1>
            <motion.p className={styles.heroSub} variants={fadeUp} initial="hidden" animate="show">
              Structured, hands-on courses with quizzes, tasks, and built-in progress tracking —
              from front-end frameworks to the cloud. Pick a track and start where you left off.
            </motion.p>
          </div>
        </section>

        <section className={styles.gridSection}>
          <div className="container">
            {groupByCategory(courses).map(([category, list]) => (
              <div key={category} className={styles.categoryBlock}>
                <div className={styles.categoryHead}>
                  <h2 className={styles.categoryTitle}>{category}</h2>
                  <span className={styles.categoryCount}>
                    {list.length} course{list.length === 1 ? '' : 's'}
                  </span>
                </div>
                <motion.div
                  className={styles.grid}
                  variants={stagger(0.1)}
                  initial="hidden"
                  whileInView="show"
                  viewport={viewport}
                >
                  {list.map((course) => (
                    <CourseCard key={course.id} course={course} />
                  ))}
                </motion.div>
              </div>
            ))}

            <div className={styles.categoryBlock}>
              <div className={styles.categoryHead}>
                <h2 className={styles.categoryTitle}>More tracks</h2>
              </div>
              <motion.div
                className={styles.grid}
                variants={stagger(0.1)}
                initial="hidden"
                whileInView="show"
                viewport={viewport}
              >
                <motion.div className={`${styles.card} ${styles.soon}`} variants={fadeUp}>
                  <div className={styles.cardTop}>
                    <span className={styles.badge}>
                      <TechLogo name="code" size={24} color="var(--c-muted)" />
                    </span>
                    <span className={styles.category}>Coming soon</span>
                  </div>
                  <h3 className={styles.cardTitle}>More courses on the way</h3>
                  <p className={styles.cardSummary}>
                    TypeScript, Node.js, CSS &amp; the modern web platform, and more cloud
                    certifications are in the pipeline. Have a request?
                  </p>
                  <Link to="/contact" className={styles.openBtn}>Suggest a course →</Link>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
