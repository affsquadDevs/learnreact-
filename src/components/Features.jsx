import { motion } from 'framer-motion';
import { fadeUp, stagger, viewport } from '../lib/motion';
import styles from './Features.module.css';

export default function Features() {
  return (
    <section className={styles.section} id="features">
      <motion.div
        className={`container ${styles.head}`}
        variants={stagger(0.1)}
        initial="hidden"
        whileInView="show"
        viewport={viewport}
      >
        <motion.h2 className="section-title" variants={fadeUp}>
          Keep all your learning in one place
        </motion.h2>
        <motion.p className="section-sub" variants={fadeUp}>
          Forget scattered tutorials and chaotic playlists.
        </motion.p>
      </motion.div>

      <motion.div
        className={`container ${styles.grid}`}
        variants={stagger(0.1)}
        initial="hidden"
        whileInView="show"
        viewport={viewport}
      >
        {/* Card 1 */}
        <motion.article className={`${styles.card} ${styles.big}`} variants={fadeUp}>
          <div className={styles.visual}>
            <div className={styles.miniPanel}>
              <span className={styles.miniLabel}>Course team</span>
              <div className={styles.member}><span className={styles.avA} /> Mentor</div>
              <div className={styles.member}><span className={styles.avB} /> Alex P.</div>
              <div className={styles.member}><span className={styles.avC} /> Jane F.</div>
            </div>
          </div>
          <h3>Never learn alone</h3>
          <p>Break down tough topics with the community, ask questions and get feedback.</p>
        </motion.article>

        {/* Card 2 */}
        <motion.article className={`${styles.card} ${styles.big}`} variants={fadeUp}>
          <div className={styles.visual}>
            <div className={styles.barsWrap}>
              {[42, 70, 55].map((h, i) => (
                <motion.span
                  key={i}
                  className={styles.bar}
                  initial={{ height: 0 }}
                  whileInView={{ height: h }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.7, delay: 0.2 + i * 0.1 }}
                />
              ))}
            </div>
            <div className={styles.schedule}>
              <div className={styles.schTitle}>Weekly schedule</div>
              {['Mon · useState', 'Wed · useEffect', 'Fri · Routing'].map((s) => (
                <div key={s} className={styles.schRow}>🗓 {s}</div>
              ))}
            </div>
          </div>
          <h3>Time management tools</h3>
          <p>Timers, reminders and a schedule help you learn consistently.</p>
        </motion.article>

        {/* Card 3 */}
        <motion.article className={`${styles.card} ${styles.wide}`} variants={fadeUp}>
          <div className={styles.visualRow}>
            <div className={styles.timeline}>
              <div className={styles.tlTitle}>Course roadmap</div>
              <div className={styles.tlBar}>
                <span style={{ background: '#ff9f43', left: '4%', width: '40%' }}>Foundations</span>
                <span style={{ background: '#2d6bff', left: '48%', width: '46%' }}>State & Hooks</span>
              </div>
              <div className={styles.tlCards}>
                <div className={styles.tlCard}>
                  <span className={styles.tag} style={{ background: '#eaf0ff', color: '#2d6bff' }}>To do</span>
                  Custom hooks
                </div>
                <div className={styles.tlCard}>
                  <span className={styles.tag} style={{ background: '#e3f8ff', color: '#0bbfe6' }}>In progress</span>
                  Working with APIs
                </div>
              </div>
            </div>
          </div>
          <h3>Advanced progress tracking</h3>
          <p>Get a bird’s-eye view of your entire learning journey.</p>
        </motion.article>

        {/* Card 4 */}
        <motion.article className={`${styles.card} ${styles.dashed}`} variants={fadeUp}>
          <div className={styles.customWrap}>
            <span className={styles.chip}>Themes</span>
            <motion.span
              className={styles.timerChip}
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
            >
              04:21 ❚❚ ■
            </motion.span>
            <span className={styles.chip}>Widgets</span>
            <span className={styles.chip}>Lesson view</span>
          </div>
          <h3>Customizable workspace</h3>
          <p>Tailor your learning space — themes, widgets and layout.</p>
        </motion.article>
      </motion.div>
    </section>
  );
}
