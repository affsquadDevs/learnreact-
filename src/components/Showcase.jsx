import { motion } from 'framer-motion';
import { fadeUp, stagger, viewport, easeOut } from '../lib/motion';
import styles from './Showcase.module.css';

const topCols = [
  {
    title: 'Learn in order',
    text: 'A clear path from fundamentals to advanced patterns — no gaps, no jumps.',
  },
  {
    title: 'Practice right away',
    text: 'Every module ends with a task that locks in the theory with real code.',
  },
  {
    title: 'See your progress',
    text: 'The dashboard shows what’s done and what’s worth revisiting right now.',
  },
];

export default function Showcase() {
  return (
    <section className={styles.section} id="how">
      <motion.div
        className={`container ${styles.cols}`}
        variants={stagger(0.12)}
        initial="hidden"
        whileInView="show"
        viewport={viewport}
      >
        {topCols.map((c) => (
          <motion.div key={c.title} className={styles.col} variants={fadeUp}>
            <h2>{c.title}</h2>
            <p>{c.text}</p>
          </motion.div>
        ))}
      </motion.div>

      <motion.div
        className={`container ${styles.stageWrap}`}
        initial={{ opacity: 0, y: 60 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={viewport}
        transition={{ duration: 0.7, ease: easeOut }}
      >
        <div className={styles.stage}>
          <div className={styles.app}>
            {/* Sidebar */}
            <aside className={styles.sidebar}>
              <div className={styles.brandRow}>
                <span className={styles.brandMark} />
                ReactWay
              </div>
              <button className={styles.createBtn}>+ Create</button>
              <span className={styles.navLabel}>Learning</span>
              <ul>
                <li className={styles.active}>🏠 Dashboard</li>
                <li>📘 My lessons <em>22</em></li>
                <li>📥 Tasks <em>5</em></li>
                <li>📊 Reports</li>
                <li>🎯 Goals <em>8</em></li>
              </ul>
              <span className={styles.navLabel}>Modules</span>
              <ul>
                <li>🔵 Foundations</li>
                <li>🟣 State & Hooks</li>
                <li>🟠 Production</li>
              </ul>
            </aside>

            {/* Main */}
            <div className={styles.main}>
              <div className={styles.topbar}>
                <span className={styles.dateChip}>📅 Today, June 18</span>
                <div className={styles.topRight}>
                  <span className={styles.iconBtn}>🔍</span>
                  <span className={styles.iconBtn}>🔔</span>
                  <span className={styles.userChip}>
                    <span className={styles.userAvatar} /> Alex
                  </span>
                </div>
              </div>

              <p className={styles.greeting}>
                Good morning, <strong>Alex</strong>
              </p>

              <div className={styles.cardsGrid}>
                <div className={styles.todo}>
                  <div className={styles.cardHead}>📝 Today’s plan</div>
                  <ul className={styles.todoList}>
                    <li className={styles.done}>Review useState and events</li>
                    <li className={styles.done}>Finish the useEffect lesson</li>
                    <li>Do the custom hooks exercise</li>
                    <li>Start the routing module</li>
                  </ul>
                </div>

                <div className={styles.timer}>
                  <div className={styles.cardHead}>Study time</div>
                  <div className={styles.timerValue}>04:21:58</div>
                  <div className={styles.timerCtrl}>
                    <span className={styles.pauseBtn}>❚❚</span>
                    <span className={styles.stopBtn}>■</span>
                  </div>
                </div>

                <div className={styles.activity}>
                  <div className={styles.cardHead}>
                    Activity <em>weekly</em>
                  </div>
                  <div className={styles.ringWrap}>
                    <svg viewBox="0 0 120 120" className={styles.ring} aria-hidden="true">
                      <circle cx="60" cy="60" r="50" className={styles.ringBg} />
                      <motion.circle
                        cx="60" cy="60" r="50"
                        className={styles.ringFg}
                        style={{ stroke: '#2d6bff' }}
                        strokeDasharray="314"
                        initial={{ strokeDashoffset: 314 }}
                        whileInView={{ strokeDashoffset: 80 }}
                        viewport={{ once: true }}
                        transition={{ duration: 1.3, ease: easeOut, delay: 0.3 }}
                      />
                      <motion.circle
                        cx="60" cy="60" r="38"
                        className={styles.ringFg}
                        style={{ stroke: '#ff9f43' }}
                        strokeDasharray="239"
                        initial={{ strokeDashoffset: 239 }}
                        whileInView={{ strokeDashoffset: 120 }}
                        viewport={{ once: true }}
                        transition={{ duration: 1.3, ease: easeOut, delay: 0.45 }}
                      />
                    </svg>
                    <div className={styles.ringStats}>
                      <span><i style={{ background: '#2d6bff' }} /> 29/40 hours</span>
                      <span><i style={{ background: '#ff9f43' }} /> 8/12 lessons</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className={styles.assigned}>
                <div className={styles.cardHead}>Upcoming modules</div>
                <div className={styles.tabs}>
                  <span className={styles.tabActive}>Upcoming</span>
                  <span>Overdue</span>
                  <span>Completed</span>
                </div>
                {[
                  { c: '#2d6bff', t: 'State & Interactivity', p: 60 },
                  { c: '#8b5cf6', t: 'Effects & Data', p: 27 },
                  { c: '#ff9f43', t: 'Production Patterns', p: 95 },
                ].map((r) => (
                  <div key={r.t} className={styles.assignedRow}>
                    <span className={styles.rowDot} style={{ background: r.c }} />
                    <span className={styles.rowTitle}>{r.t}</span>
                    <div className={styles.rowTrack}>
                      <motion.div
                        className={styles.rowFill}
                        style={{ background: r.c }}
                        initial={{ width: 0 }}
                        whileInView={{ width: `${r.p}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, ease: easeOut, delay: 0.3 }}
                      />
                    </div>
                    <span className={styles.rowPct}>{r.p}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <motion.div
            className={styles.floatBadge}
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          >
            ✓
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
