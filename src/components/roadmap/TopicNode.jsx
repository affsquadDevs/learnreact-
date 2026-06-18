import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { easeOut } from '../../lib/motion';
import styles from './TopicNode.module.css';

export default function TopicNode({ topic, accent, soft, side, roadmap }) {
  const { isDone, toggleConcept, toggleTopic } = roadmap;
  const [open, setOpen] = useState(false);

  const ids = topic.concepts.map((c) => c.id);
  const doneCount = ids.filter(isDone).length;
  const total = ids.length;
  const pct = Math.round((doneCount / total) * 100);
  const complete = doneCount === total;

  const status = complete ? 'complete' : doneCount > 0 ? 'progress' : 'idle';
  const ringColor = complete ? 'var(--c-green)' : accent;

  return (
    <motion.div
      className={`${styles.row} ${side === 'left' ? styles.left : styles.right}`}
      initial={{ opacity: 0, x: side === 'left' ? -40 : 40 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 0.55, ease: easeOut }}
    >
      {/* Node on the spine */}
      <span
        className={`${styles.node} ${styles[status]}`}
        style={{ '--accent': accent }}
      >
        <span className={styles.nodeInner}>
          {complete ? '✓' : doneCount > 0 ? '◔' : ''}
        </span>
        <span className={styles.connector} style={{ background: complete ? 'var(--c-green)' : accent }} />
      </span>

      {/* Topic card */}
      <div className={styles.card} style={{ '--accent': accent, '--soft': soft }}>
        <button className={styles.head} onClick={() => setOpen((v) => !v)} aria-expanded={open}>
          <div className={styles.headLeft}>
            <h4>{topic.name}</h4>
            <span className={styles.meta}>
              {doneCount}/{total} concepts · {pct}%
            </span>
          </div>

          <div className={styles.headRight}>
            <span className={styles.ring} style={{ '--ring': ringColor, '--pct': pct }}>
              <span>{pct}%</span>
            </span>
            <motion.span
              className={styles.chevron}
              animate={{ rotate: open ? 180 : 0 }}
              transition={{ duration: 0.25 }}
            >
              ⌄
            </motion.span>
          </div>
        </button>

        <div className={styles.track}>
          <motion.div
            className={styles.fill}
            style={{ background: complete ? 'var(--c-green)' : accent }}
            animate={{ width: `${pct}%` }}
            transition={{ duration: 0.5, ease: easeOut }}
          />
        </div>

        <AnimatePresence initial={false}>
          {open && (
            <motion.div
              className={styles.body}
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.32, ease: easeOut }}
            >
              <div className={styles.bodyInner}>
                <button
                  className={styles.markAll}
                  style={{ color: accent, background: soft }}
                  onClick={() => toggleTopic(ids)}
                >
                  {complete ? 'Clear all' : 'Mark all as learned'}
                </button>

                <ul className={styles.concepts}>
                  {topic.concepts.map((c, i) => {
                    const done = isDone(c.id);
                    return (
                      <motion.li
                        key={c.id}
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.03 }}
                      >
                        <button
                          className={`${styles.concept} ${done ? styles.conceptDone : ''}`}
                          onClick={() => toggleConcept(c.id)}
                        >
                          <span
                            className={styles.check}
                            style={done ? { background: accent, borderColor: accent } : undefined}
                          >
                            {done && (
                              <svg viewBox="0 0 24 24" width="12" height="12">
                                <path d="M5 12.5l4.2 4.3L19 7" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                              </svg>
                            )}
                          </span>
                          <span>{c.text}</span>
                        </button>
                      </motion.li>
                    );
                  })}
                </ul>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
