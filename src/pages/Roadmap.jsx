import { Link, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import Logo from '../components/Logo';
import TechLogo from '../components/TechLogo';
import TopicNode from '../components/roadmap/TopicNode';
import { getCourse, courses } from '../data/courses';
import { useRoadmap } from '../hooks/useRoadmap';
import { easeOut, fadeUp, stagger, viewport } from '../lib/motion';
import styles from './Roadmap.module.css';

export default function Roadmap() {
  const { courseId } = useParams();
  const course = getCourse(courseId);
  const { levels, roadmapMeta } = course;
  const themeVars = { '--rm': course.accent, '--rm-soft': course.soft };

  const roadmap = useRoadmap(course);
  const { percent, completedCount, total, resetRoadmap, isDone } = roadmap;

  const handleReset = () => {
    if (window.confirm('Reset all roadmap progress? This action cannot be undone.')) {
      resetRoadmap();
    }
  };

  let topicCounter = 0;

  return (
    <div className={styles.page} style={themeVars}>
      {/* Top bar */}
      <header className={styles.topbar}>
        <div className={`container ${styles.topInner}`}>
          <div className={styles.topLeft}>
            <Logo />
            <span className={styles.divider} />
            <span className={styles.tag}>Roadmap</span>
          </div>
          <div className={styles.topRight}>
            <div className={styles.progressMini}>
              <div className={styles.miniTrack}>
                <motion.div
                  className={styles.miniFill}
                  animate={{ width: `${percent}%` }}
                  transition={{ duration: 0.5, ease: easeOut }}
                />
              </div>
              <span>{completedCount}/{total} · {percent}%</span>
            </div>
            <button className={styles.resetBtn} onClick={handleReset}>Reset</button>
            <Link to={`/course/${course.id}`} className={styles.linkBtn}>Course</Link>
            <Link to="/courses" className={styles.linkBtn}>Courses</Link>
            <Link to="/" className={styles.homeLink}>← Home</Link>
          </div>
        </div>
      </header>

      <main id="main" tabIndex={-1}>
        <nav aria-label="Breadcrumb" className="container" style={{ paddingTop: '16px' }}>
          <ol
            style={{
              display: 'flex',
              gap: '8px',
              alignItems: 'center',
              listStyle: 'none',
              margin: 0,
              padding: 0,
              fontSize: '13.5px',
            }}
          >
            <li><Link to="/" style={{ color: 'var(--c-muted)' }}>Home</Link></li>
            <li aria-hidden="true" style={{ color: 'var(--c-muted-2)' }}>/</li>
            <li aria-current="page" style={{ color: 'var(--c-ink)', fontWeight: 600 }}>Roadmap</li>
          </ol>
        </nav>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'BreadcrumbList',
              itemListElement: [
                { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://learn-react.com/' },
                { '@type': 'ListItem', position: 2, name: 'Roadmap', item: 'https://learn-react.com/roadmap' },
              ],
            }),
          }}
        />

      {/* Hero */}
      <section className={styles.hero}>
        <div className={styles.heroGrid} aria-hidden="true" />
        <div className={`container ${styles.heroInner}`}>
          <motion.div
            className={styles.heroText}
            variants={stagger(0.1)}
            initial="hidden"
            animate="show"
          >
            <motion.div className={styles.switcher} variants={fadeUp} role="tablist" aria-label="Choose a roadmap">
              {courses.map((c) => {
                const on = c.id === course.id;
                return (
                  <Link
                    key={c.id}
                    to={`/roadmap/${c.id}`}
                    role="tab"
                    aria-selected={on}
                    className={`${styles.switchPill} ${on ? styles.switchActive : ''}`}
                    style={{ '--p': c.accent }}
                  >
                    <TechLogo name={c.icon} size={17} color={on ? '#fff' : c.accent} />
                    {c.tech}
                  </Link>
                );
              })}
            </motion.div>
            <motion.div className={styles.heroHead} variants={fadeUp}>
              <span className={styles.heroBadge}>
                <TechLogo name={course.icon} size={26} color="#fff" />
              </span>
              <span className={`eyebrow ${styles.heroEyebrow}`}>
                {course.tech} · {course.category}
              </span>
            </motion.div>
            <motion.h1 variants={fadeUp}>{roadmapMeta.title}</motion.h1>
            <motion.p variants={fadeUp}>{roadmapMeta.description}</motion.p>
            <motion.div className={styles.legend} variants={fadeUp}>
              <span><i className={styles.lIdle} /> Not started</span>
              <span><i className={styles.lProg} /> In progress</span>
              <span><i className={styles.lDone} /> Completed</span>
            </motion.div>
          </motion.div>

          <motion.div
            className={styles.heroRing}
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: easeOut, delay: 0.2 }}
          >
            <div
              className={styles.bigRing}
              style={{ '--pct': percent }}
            >
              <div className={styles.bigRingInner}>
                <strong>{percent}%</strong>
                <span>{completedCount}/{total}</span>
              </div>
            </div>
            <p>concepts mastered</p>
          </motion.div>
        </div>
      </section>

      {/* The map */}
      <section className={styles.mapSection}>
        <div className="container">
          <div className={styles.road}>
            <div className={styles.spineTrack} aria-hidden="true" />
            <motion.div
              className={styles.spineFill}
              aria-hidden="true"
              initial={{ height: 0 }}
              animate={{ height: `${percent}%` }}
              transition={{ duration: 1, ease: easeOut }}
            />

            {levels.map((lvl) => {
              const lvlIds = lvl.topics.flatMap((t) => t.concepts.map((c) => c.id));
              const lvlDone = lvlIds.filter(isDone).length;
              const lvlPct = Math.round((lvlDone / lvlIds.length) * 100);
              const lvlComplete = lvlDone === lvlIds.length;

              return (
                <div key={lvl.level} className={styles.level}>
                  <motion.div
                    className={styles.levelMarker}
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={viewport}
                    transition={{ duration: 0.5, ease: easeOut }}
                  >
                    <span
                      className={`${styles.levelBadge} ${lvlComplete ? styles.levelBadgeDone : ''}`}
                      style={{ '--accent': lvl.accent }}
                    >
                      {lvl.level}
                    </span>
                    <div className={styles.levelInfo}>
                      <div className={styles.levelTop}>
                        <h2>{lvl.name}</h2>
                        <span
                          className={styles.levelPill}
                          style={{ background: lvl.soft, color: lvl.accent }}
                        >
                          {lvlPct}% · {lvlDone}/{lvlIds.length}
                        </span>
                      </div>
                      <p>{lvl.focus}</p>
                    </div>
                  </motion.div>

                  {lvl.topics.map((topic) => {
                    const side = topicCounter++ % 2 === 0 ? 'right' : 'left';
                    return (
                      <TopicNode
                        key={topic.id}
                        topic={topic}
                        accent={lvl.accent}
                        soft={lvl.soft}
                        side={side}
                        roadmap={roadmap}
                      />
                    );
                  })}
                </div>
              );
            })}

            {/* Finish flag */}
            <motion.div
              className={styles.finish}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={viewport}
              transition={{ duration: 0.5, ease: easeOut }}
            >
              <span className={percent === 100 ? styles.finishDone : ''}>
                {percent === 100 ? '🏆' : '🏁'}
              </span>
              <p>{percent === 100 ? `${course.tech} mastered!` : 'Finish line'}</p>
            </motion.div>
          </div>
        </div>
      </section>
      </main>
    </div>
  );
}
