import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import Logo from '../components/Logo';
import StudyTimer from '../components/StudyTimer';
import {
  IconArrowLeft,
  IconArrowRight,
  IconBell,
  IconBook,
  IconCalendar,
  IconChart,
  IconCheck,
  IconClock,
  IconHome,
  IconInbox,
  IconPause,
  IconPlay,
  IconSearch,
  IconStop,
  IconTarget,
} from '../components/icons';
import { modules, allLessons, courseMeta } from '../data/course';
import { useProgress } from '../hooks/useProgress';
import { useStudyTimerContext } from '../context/StudyTimerContext';
import { easeOut } from '../lib/motion';
import styles from './Course.module.css';

const WEEKLY_GOAL_HOURS = 40;

function todayLabel() {
  return new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });
}

export default function Course() {
  const progress = useProgress();
  const timer = useStudyTimerContext();
  const {
    isCompleted,
    toggleLesson,
    setLastLesson,
    resetProgress,
    percent,
    completedCount,
    total,
    lastLesson,
  } = progress;

  const [view, setView] = useState('dashboard');
  const [activeNav, setActiveNav] = useState('lessons');
  const [moduleFilter, setModuleFilter] = useState('all');
  const [activeId, setActiveId] = useState(() => lastLesson ?? allLessons[0].id);

  const activeLesson = useMemo(
    () => allLessons.find((l) => l.id === activeId) ?? allLessons[0],
    [activeId]
  );

  const activeIndex = allLessons.findIndex((l) => l.id === activeLesson.id);
  const prev = allLessons[activeIndex - 1];
  const next = allLessons[activeIndex + 1];

  const pendingLessons = allLessons.filter((l) => !isCompleted(l.id)).slice(0, 4);
  const recentDone = allLessons.filter((l) => isCompleted(l.id)).slice(-2);
  const studyHours = Math.floor(timer.totalSeconds / 3600);
  const weeklyPct = Math.min(100, Math.round((studyHours / WEEKLY_GOAL_HOURS) * 100));

  useEffect(() => {
    if (view === 'lesson') setLastLesson(activeLesson.id);
  }, [activeLesson.id, setLastLesson, view]);

  const moduleStatus = (m) => {
    const done = m.lessons.filter((l) => isCompleted(l.id)).length;
    if (done === m.lessons.length) return 'completed';
    if (done > 0) return 'progress';
    return 'upcoming';
  };

  const filteredModules =
    moduleFilter === 'all'
      ? modules
      : modules.filter((m) => moduleStatus(m) === moduleFilter);

  const openLesson = (id) => {
    setActiveId(id);
    setView('lesson');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const goDashboard = (nav, filter) => {
    setView('dashboard');
    setActiveNav(nav);
    setModuleFilter(filter);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleReset = () => {
    if (window.confirm('Reset all course progress? This action cannot be undone.')) {
      resetProgress();
    }
  };

  const navItems = [
    { id: 'lessons', label: 'My lessons', Icon: IconBook, count: total, filter: 'all' },
    { id: 'tasks', label: 'Tasks', Icon: IconInbox, count: Math.max(0, total - completedCount), filter: 'progress' },
    { id: 'reports', label: 'Reports', Icon: IconChart, filter: 'all' },
    { id: 'goals', label: 'Goals', Icon: IconTarget, count: modules.length, filter: 'upcoming' },
  ];

  const moduleTabs = [
    { id: 'all', label: 'All' },
    { id: 'progress', label: 'In progress' },
    { id: 'upcoming', label: 'Upcoming' },
    { id: 'completed', label: 'Completed' },
  ];

  return (
    <div className={styles.page}>
      <header className={styles.topbar}>
        <div className={styles.topInner}>
          <div className={styles.topLeft}>
            <Logo />
            <span className={styles.divider} />
            <span className={styles.courseTag}>{courseMeta.title}</span>
          </div>
          <div className={styles.topRight}>
            <StudyTimer />
            <div className={styles.progressMini}>
              <div className={styles.miniTrack}>
                <motion.div
                  className={styles.miniFill}
                  animate={{ width: `${percent}%` }}
                  transition={{ duration: 0.5, ease: easeOut }}
                />
              </div>
              <span>{completedCount}/{total}</span>
            </div>
            <button type="button" className={styles.resetBtn} onClick={handleReset}>
              Reset
            </button>
            <Link to="/roadmap" className={styles.roadmapLink}>Roadmap</Link>
            <Link to="/" className={styles.homeLink}>Home</Link>
          </div>
        </div>
      </header>

      <div className={styles.shell}>
        {/* Sidebar */}
        <aside className={styles.sidebar}>
          <button
            type="button"
            className={`${styles.dashBtn} ${view === 'dashboard' ? styles.dashActive : ''}`}
            onClick={() => goDashboard('lessons', 'all')}
          >
            <IconHome size={18} />
            Dashboard
          </button>

          <span className={styles.navLabel}>Learning</span>
          <ul className={styles.navList}>
            {navItems.map((item) => (
              <li key={item.id}>
                <button
                  type="button"
                  className={`${styles.navBtn} ${
                    view === 'dashboard' && activeNav === item.id ? styles.navActive : ''
                  }`}
                  onClick={() => goDashboard(item.id, item.filter)}
                >
                  <item.Icon size={18} className={styles.navIcon} />
                  <span>{item.label}</span>
                  {item.count != null && <em>{item.count}</em>}
                </button>
              </li>
            ))}
          </ul>

          <span className={styles.navLabel}>Modules</span>
          {modules.map((m) => {
            const done = m.lessons.filter((l) => isCompleted(l.id)).length;
            return (
              <div key={m.id} className={styles.moduleBlock}>
                <div className={styles.moduleTitle}>
                  <span className={styles.moduleDot} style={{ background: m.accent }} />
                  {m.shortTitle ?? m.title}
                  <em>{done}/{m.lessons.length}</em>
                </div>
                <ul className={styles.lessonList}>
                  {m.lessons.map((l) => {
                    const completed = isCompleted(l.id);
                    const active = view === 'lesson' && l.id === activeLesson.id;
                    return (
                      <li key={l.id}>
                        <button
                          type="button"
                          className={`${styles.lessonItem} ${active ? styles.lessonItemActive : ''}`}
                          onClick={() => openLesson(l.id)}
                        >
                          {active && (
                            <motion.span
                              layoutId="lessonActiveBar"
                              className={styles.activeBar}
                              style={{ background: m.accent }}
                              transition={{ duration: 0.3, ease: easeOut }}
                            />
                          )}
                          <span
                            className={`${styles.check} ${completed ? styles.checkOn : ''}`}
                            style={completed ? { background: m.accent, borderColor: m.accent } : undefined}
                          >
                            {completed && <IconCheck size={12} />}
                          </span>
                          {l.title}
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>
            );
          })}
        </aside>

        {/* Main */}
        <main className={styles.main}>
          <div className={styles.mainTop}>
            <span className={styles.dateChip}>
              <IconCalendar size={15} />
              {todayLabel()}
            </span>
            <div className={styles.mainTopRight}>
              <button type="button" className={styles.iconBtn} aria-label="Search">
                <IconSearch size={17} />
              </button>
              <button type="button" className={styles.iconBtn} aria-label="Notifications">
                <IconBell size={17} />
              </button>
              <span className={styles.userChip}>
                <span className={styles.userAvatar}>A</span>
                Alex
              </span>
            </div>
          </div>

          <AnimatePresence mode="wait">
            {view === 'dashboard' ? (
              <motion.div
                key="dashboard"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.3, ease: easeOut }}
              >
                <div className={styles.greetingRow}>
                  <div>
                    <h2 className={styles.greeting}>
                      Good morning, <strong>Alex</strong>
                    </h2>
                    <p className={styles.greetingSub}>
                      You&apos;ve completed {percent}% of the course. Keep the momentum going.
                    </p>
                  </div>
                </div>

                <div className={styles.widgets}>
                  <section className={styles.widget}>
                    <div className={styles.widgetHead}>
                      <h3>Today&apos;s plan</h3>
                    </div>
                    <ul className={styles.planList}>
                      {pendingLessons.length === 0 ? (
                        <li className={styles.planDone}>All lessons complete — great job!</li>
                      ) : (
                        pendingLessons.map((l) => (
                          <li key={l.id}>
                            <button type="button" onClick={() => openLesson(l.id)}>
                              <span className={styles.planBox} />
                              {l.title}
                            </button>
                          </li>
                        ))
                      )}
                      {recentDone.map((l) => (
                        <li key={l.id} className={styles.planDone}>
                          <span className={styles.planBox}>
                            <IconCheck size={11} />
                          </span>
                          {l.title}
                        </li>
                      ))}
                    </ul>
                  </section>

                  <section className={`${styles.widget} ${styles.timerWidget}`}>
                    <div className={styles.widgetHead}>
                      <h3>Study time</h3>
                      <span className={`${styles.liveTag} ${timer.isRunning ? styles.liveOn : ''}`}>
                        {timer.isRunning ? 'Live' : 'Paused'}
                      </span>
                    </div>
                    <div className={styles.bigTimer}>{timer.formatted}</div>
                    <div className={styles.timerCtrl}>
                      <motion.button
                        type="button"
                        className={styles.pauseBtn}
                        onClick={timer.toggle}
                        whileTap={{ scale: 0.9 }}
                        aria-label={timer.isRunning ? 'Pause' : 'Start'}
                      >
                        {timer.isRunning ? <IconPause size={18} /> : <IconPlay size={18} />}
                      </motion.button>
                      <motion.button
                        type="button"
                        className={styles.stopBtn}
                        onClick={timer.stop}
                        whileTap={{ scale: 0.9 }}
                        aria-label="Stop and save"
                      >
                        <IconStop size={16} />
                      </motion.button>
                    </div>
                    <p className={styles.timerHint}>
                      {timer.isRunning ? 'Tracking your session…' : 'Press play to track your session'}
                    </p>
                  </section>

                  <section className={styles.widget}>
                    <div className={styles.widgetHead}>
                      <h3>Activity</h3>
                      <span className={styles.weekTag}>This week</span>
                    </div>
                    <div className={styles.activityRow}>
                      <svg viewBox="0 0 120 120" className={styles.ring}>
                        <circle cx="60" cy="60" r="50" className={styles.ringBg} />
                        <circle cx="60" cy="60" r="38" className={styles.ringBg} />
                        <motion.circle
                          cx="60" cy="60" r="50"
                          className={styles.ringFg}
                          style={{ stroke: 'var(--c-blue)' }}
                          strokeDasharray="314"
                          initial={{ strokeDashoffset: 314 }}
                          animate={{ strokeDashoffset: 314 - (314 * percent) / 100 }}
                          transition={{ duration: 1, ease: easeOut }}
                        />
                        <motion.circle
                          cx="60" cy="60" r="38"
                          className={styles.ringFg}
                          style={{ stroke: 'var(--c-orange)' }}
                          strokeDasharray="239"
                          initial={{ strokeDashoffset: 239 }}
                          animate={{ strokeDashoffset: 239 - (239 * weeklyPct) / 100 }}
                          transition={{ duration: 1, ease: easeOut, delay: 0.2 }}
                        />
                      </svg>
                      <div className={styles.ringStats}>
                        <span><i style={{ background: 'var(--c-blue)' }} /> {completedCount}/{total} lessons</span>
                        <span><i style={{ background: 'var(--c-orange)' }} /> {studyHours}/{WEEKLY_GOAL_HOURS} hours</span>
                      </div>
                    </div>
                  </section>
                </div>

                <section className={styles.assigned}>
                  <div className={styles.widgetHead}>
                    <h3>Your modules</h3>
                  </div>
                  <div className={styles.tabs}>
                    {moduleTabs.map((t) => (
                      <button
                        key={t.id}
                        type="button"
                        className={moduleFilter === t.id ? styles.tabActive : ''}
                        onClick={() => setModuleFilter(t.id)}
                      >
                        {t.label}
                      </button>
                    ))}
                  </div>
                  {filteredModules.length === 0 ? (
                    <p className={styles.emptyRow}>No modules in this group yet.</p>
                  ) : (
                    filteredModules.map((m) => {
                      const done = m.lessons.filter((l) => isCompleted(l.id)).length;
                      const pct = Math.round((done / m.lessons.length) * 100);
                      return (
                        <button
                          key={m.id}
                          type="button"
                          className={styles.moduleRow}
                          onClick={() => openLesson(m.lessons[0].id)}
                        >
                          <span className={styles.rowDot} style={{ background: m.accent }} />
                          <span className={styles.rowTitle}>{m.title}</span>
                          <div className={styles.rowTrack}>
                            <motion.div
                              className={styles.rowFill}
                              style={{ background: m.accent }}
                              initial={{ width: 0 }}
                              animate={{ width: `${pct}%` }}
                              transition={{ duration: 0.8, ease: easeOut }}
                            />
                          </div>
                          <span className={styles.rowPct}>{pct}%</span>
                        </button>
                      );
                    })
                  )}
                </section>

                <motion.div
                  className={styles.continueBar}
                  whileHover={{ y: -2 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className={styles.continueLeft}>
                    <span className={styles.continueLabel}>Continue learning</span>
                    <strong>{activeLesson.title}</strong>
                  </div>
                  <motion.button
                    type="button"
                    className={styles.continueBtn}
                    onClick={() => openLesson(activeLesson.id)}
                    whileTap={{ scale: 0.97 }}
                  >
                    Open lesson
                    <IconArrowRight size={17} />
                  </motion.button>
                </motion.div>
              </motion.div>
            ) : (
              <motion.div
                key={activeLesson.id}
                className={styles.lessonView}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.32, ease: easeOut }}
              >
                <button type="button" className={styles.backDash} onClick={() => setView('dashboard')}>
                  <IconArrowLeft size={16} />
                  Back to dashboard
                </button>

                <div className={styles.breadcrumb}>
                  <span style={{ color: activeLesson.accent }}>{activeLesson.moduleTitle}</span>
                  <span className={styles.crumbSep}>/</span>
                  <span>Lesson {activeIndex + 1}</span>
                </div>

                <div className={styles.lessonHeader}>
                  <div>
                    <span
                      className={styles.typePill}
                      style={{ background: `${activeLesson.accent}14`, color: activeLesson.accent }}
                    >
                      {activeLesson.type} · {activeLesson.concepts?.length ?? 0} concepts
                    </span>
                    <h1>{activeLesson.title}</h1>
                    <span className={styles.lessonSub}>
                      <IconClock size={15} />
                      {activeLesson.duration}
                    </span>
                  </div>
                  <motion.button
                    type="button"
                    className={`${styles.completeBtn} ${isCompleted(activeLesson.id) ? styles.completed : ''}`}
                    onClick={() => toggleLesson(activeLesson.id)}
                    whileTap={{ scale: 0.96 }}
                  >
                    {isCompleted(activeLesson.id) ? <IconCheck size={16} /> : null}
                    {isCompleted(activeLesson.id) ? 'Completed' : 'Mark as complete'}
                  </motion.button>
                </div>

                <div className={styles.player} style={{ '--accent': activeLesson.accent }}>
                  <motion.button
                    type="button"
                    className={styles.playBtn}
                    whileHover={{ scale: 1.08 }}
                    whileTap={{ scale: 0.95 }}
                    aria-label="Play lesson"
                  >
                    <IconPlay size={22} />
                  </motion.button>
                  <span className={styles.playerHint}>The lesson video will appear here</span>
                </div>

                <div className={styles.lessonGrid}>
                  <section className={styles.block}>
                    <h4>Lesson overview</h4>
                    <p className={styles.placeholder}>
                      This lesson is a high-level shell for the <strong>{activeLesson.title}</strong> topic.
                      Full explanations, examples and exercises will be added later. For now,
                      use this page to understand what belongs in this topic and track progress.
                    </p>
                  </section>

                  <section className={styles.block}>
                    <h4>Topic map</h4>
                    <ul className={styles.bullets}>
                      {(activeLesson.concepts ?? []).map((concept) => (
                        <li key={concept.id}>{concept.text}</li>
                      ))}
                    </ul>
                  </section>
                </div>

                <section className={styles.block}>
                  <h4>Practice placeholder</h4>
                  <pre className={styles.code}>
                    <span className={styles.codeBar}>
                      <i /><i /><i />
                    </span>
{`// Practice content will be added here.
// Topic: ${activeLesson.title}
// Concepts: ${activeLesson.concepts?.length ?? 0}`}
                  </pre>
                </section>

                <div className={styles.nav}>
                  <button
                    type="button"
                    className={styles.navPrev}
                    disabled={!prev}
                    onClick={() => prev && openLesson(prev.id)}
                  >
                    <IconArrowLeft size={16} />
                    <span>
                      <em>Previous</em>
                      {prev ? prev.title : 'Start of course'}
                    </span>
                  </button>
                  <button
                    type="button"
                    className={styles.navNext}
                    disabled={!next}
                    onClick={() => next && openLesson(next.id)}
                  >
                    <span>
                      <em>Next</em>
                      {next ? next.title : 'Course complete'}
                    </span>
                    <IconArrowRight size={16} />
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
