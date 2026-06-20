import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { IconBulb, IconCheck } from '../icons';
import { easeOut } from '../../lib/motion';
import styles from './LessonContent.module.css';

const TYPE_LABEL = {
  task: 'Task',
  'fix-bug': 'Fix the bug',
  predict: 'Predict the output',
  quiz: 'Quiz',
};

export default function Exercise({ exercise, index, accent }) {
  const [showHint, setShowHint] = useState(false);
  const [showSolution, setShowSolution] = useState(false);
  const label = TYPE_LABEL[exercise.type] ?? 'Exercise';
  const solution = exercise.solution ?? {};

  return (
    <div className={styles.exercise}>
      <div className={styles.exerciseHead}>
        <span
          className={styles.exerciseType}
          style={{ background: `${accent}14`, color: accent }}
        >
          {label}
        </span>
        <span className={styles.exerciseNum}>Exercise {index + 1}</span>
      </div>

      <p className={styles.exercisePrompt}>{exercise.prompt}</p>

      {exercise.starter && (
        <pre className={styles.codeMini}>
          <code>{exercise.starter.join('\n')}</code>
        </pre>
      )}

      <div className={styles.exerciseActions}>
        {exercise.hint && (
          <button
            type="button"
            className={styles.ghostBtn}
            onClick={() => setShowHint((v) => !v)}
          >
            <IconBulb size={15} />
            {showHint ? 'Hide hint' : 'Show hint'}
          </button>
        )}
        <button
          type="button"
          className={styles.solveBtn}
          style={{ background: accent }}
          onClick={() => setShowSolution((v) => !v)}
        >
          <IconCheck size={15} />
          {showSolution ? 'Hide solution' : 'Reveal solution'}
        </button>
      </div>

      <AnimatePresence initial={false}>
        {showHint && exercise.hint && (
          <motion.div
            key="hint"
            className={styles.hint}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: easeOut }}
          >
            <strong>Hint.</strong> {exercise.hint}
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence initial={false}>
        {showSolution && (
          <motion.div
            key="solution"
            className={styles.solution}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.28, ease: easeOut }}
          >
            <span className={styles.solutionLabel}>Solution</span>
            {solution.lines && (
              <pre className={styles.codeMini}>
                <code>{solution.lines.join('\n')}</code>
              </pre>
            )}
            {solution.explanation && (
              <p className={styles.solutionText}>{solution.explanation}</p>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
