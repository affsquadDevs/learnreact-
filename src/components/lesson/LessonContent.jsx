import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import ConceptCard from './ConceptCard';
import LessonDoodles from './LessonDoodles';
import { IconSparkle } from '../icons';
import { getTopicConcepts } from '../../data/courseContent';
import { easeOut } from '../../lib/motion';
import styles from './LessonContent.module.css';

export default function LessonContent({ topicId, accent }) {
  const concepts = useMemo(() => getTopicConcepts(topicId), [topicId]);
  const [allOpen, setAllOpen] = useState(false);

  if (!concepts) return null;

  return (
    <div className={styles.wrap} style={{ '--cl': accent }}>
      <LessonDoodles />
      <div className={styles.toolbar}>
        <span className={styles.count}>
          <IconSparkle size={15} style={{ color: accent }} />
          {concepts.length} concept{concepts.length === 1 ? '' : 's'} to explore
        </span>
        <button
          type="button"
          className={styles.expandAll}
          onClick={() => setAllOpen((v) => !v)}
        >
          {allOpen ? 'Collapse all' : 'Expand all'}
        </button>
      </div>

      <motion.div
        className={styles.list}
        initial="hidden"
        animate="show"
        variants={{
          hidden: {},
          show: { transition: { staggerChildren: 0.06 } },
        }}
      >
        {concepts.map((concept, i) => (
          <motion.div
            key={concept.id}
            variants={{
              hidden: { opacity: 0, y: 14 },
              show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: easeOut } },
            }}
          >
            <ConceptCard
              concept={concept}
              index={i}
              accent={accent}
              defaultOpen={allOpen || i === 0}
              key={`${concept.id}-${allOpen}`}
            />
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
