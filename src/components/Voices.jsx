import { motion } from 'framer-motion';
import { fadeUp, stagger, viewport } from '../lib/motion';
import styles from './Voices.module.css';

const stats = [
  { value: '2', label: 'courses (and growing)' },
  { value: '100+', label: 'hands-on lessons & quizzes' },
  { value: '100%', label: 'progress saved locally' },
  { value: '2k+', label: 'students in the community' },
];

const quotes = [
  {
    text: 'Finally a course where theory locks in with code right away. I got hooks in one evening.',
    name: 'Andrew K.',
    role: 'Frontend Junior',
    color: '#2d6bff',
  },
  {
    text: 'The progress dashboard keeps me coming back every day. Everything is structured, no fluff.',
    name: 'Maria S.',
    role: 'Designer → Developer',
    color: '#8b5cf6',
  },
  {
    text: 'I passed the AWS Cloud Practitioner exam using the course quizzes. The structure is exactly the “right way” I was missing.',
    name: 'Oleg V.',
    role: 'Self-taught dev',
    color: '#e8862a',
  },
];

export default function Voices() {
  return (
    <section className={styles.section} id="voices">
      <div className="container" style={{ textAlign: 'center', marginBottom: '46px' }}>
        <h2 className="section-title">Loved by developers learning the web</h2>
      </div>
      <motion.div
        className={`container ${styles.statsRow}`}
        variants={stagger(0.08)}
        initial="hidden"
        whileInView="show"
        viewport={viewport}
      >
        {stats.map((s) => (
          <motion.div key={s.label} className={styles.stat} variants={fadeUp}>
            <div className={styles.statValue}>{s.value}</div>
            <div className={styles.statLabel}>{s.label}</div>
          </motion.div>
        ))}
      </motion.div>

      <motion.div
        className={`container ${styles.quotes}`}
        variants={stagger(0.1)}
        initial="hidden"
        whileInView="show"
        viewport={viewport}
      >
        {quotes.map((q) => (
          <motion.figure key={q.name} className={styles.quote} variants={fadeUp}>
            <div className={styles.stars}>★★★★★</div>
            <blockquote>{q.text}</blockquote>
            <figcaption>
              <span className={styles.qAvatar} style={{ background: q.color }} />
              <span>
                <strong>{q.name}</strong>
                <em>{q.role}</em>
              </span>
            </figcaption>
          </motion.figure>
        ))}
      </motion.div>
    </section>
  );
}
