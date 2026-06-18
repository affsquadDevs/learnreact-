import { motion } from 'framer-motion';
import { useStudyTimerContext } from '../context/StudyTimerContext';
import { IconPause, IconPlay, IconStop } from './icons';
import styles from './StudyTimer.module.css';

export default function StudyTimer() {
  const { formatted, sessionFormatted, isRunning, toggle, stop } = useStudyTimerContext();

  return (
    <div className={`${styles.timer} ${isRunning ? styles.running : ''}`}>
      <div className={styles.label}>
        <span className={styles.dot} />
        Study time
      </div>
      <div className={styles.display}>
        <motion.span
          key={formatted}
          className={styles.time}
          initial={{ opacity: 0.6, y: 2 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.15 }}
        >
          {formatted}
        </motion.span>
        {sessionFormatted !== '00:00:00' && (
          <span className={styles.session}>+{sessionFormatted} session</span>
        )}
      </div>
      <div className={styles.controls}>
        <motion.button
          type="button"
          className={styles.pauseBtn}
          onClick={toggle}
          whileTap={{ scale: 0.88 }}
          aria-label={isRunning ? 'Pause timer' : 'Start timer'}
          title={isRunning ? 'Pause' : 'Start'}
        >
          {isRunning ? <IconPause size={14} /> : <IconPlay size={14} />}
        </motion.button>
        <motion.button
          type="button"
          className={styles.stopBtn}
          onClick={stop}
          whileTap={{ scale: 0.88 }}
          aria-label="Stop and save session"
          title="Stop & save"
        >
          <IconStop size={13} />
        </motion.button>
      </div>
    </div>
  );
}
