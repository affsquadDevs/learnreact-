import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  IconAlert,
  IconBulb,
  IconChevron,
  IconCheck,
  IconCode,
  IconDumbbell,
  IconFlow,
  IconHelp,
  IconLink,
  IconList,
} from '../icons';
import { easeOut } from '../../lib/motion';
import Mermaid from '../Mermaid';
import Exercise from './Exercise';
import styles from './LessonContent.module.css';

function Section({ icon: Icon, title, accent, children }) {
  return (
    <div className={styles.section}>
      <h5 className={styles.sectionTitle}>
        <Icon size={16} style={{ color: accent }} />
        {title}
      </h5>
      {children}
    </div>
  );
}

export default function ConceptCard({ concept, index, accent, defaultOpen }) {
  const [open, setOpen] = useState(Boolean(defaultOpen));

  return (
    <div className={styles.item}>
      <span className={styles.rail}>
        <motion.button
          type="button"
          className={`${styles.node} ${open ? styles.nodeOn : ''}`}
          style={{ '--cl': accent }}
          onClick={() => setOpen((v) => !v)}
          whileHover={{ scale: 1.12 }}
          whileTap={{ scale: 0.92 }}
          aria-label={`Concept ${index + 1}`}
        >
          {String(index + 1).padStart(2, '0')}
        </motion.button>
      </span>

      <motion.article
        className={`${styles.concept} ${open ? styles.conceptOpen : ''}`}
        style={{ '--cl': accent }}
        whileHover={open ? undefined : { x: 4 }}
        transition={{ duration: 0.2, ease: easeOut }}
      >
        <button
          type="button"
          className={styles.conceptHead}
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
        >
          <span className={styles.conceptTitle}>{concept.title}</span>
          <motion.span
            className={styles.conceptChevron}
            animate={{ rotate: open ? 180 : 0, color: open ? accent : '#9aa1ad' }}
            transition={{ duration: 0.25, ease: easeOut }}
          >
            <IconChevron size={20} />
          </motion.span>
        </button>

        {!open && concept.summary && (
          <p className={styles.conceptPeek}>{concept.summary}</p>
        )}

        <AnimatePresence initial={false}>
          {open && (
            <motion.div
              className={styles.conceptBody}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: easeOut }}
            >
              <div className={styles.conceptInner}>
              {concept.summary && (
                <p className={styles.lead}>{concept.summary}</p>
              )}

              {concept.explanation && (
                <p className={styles.paragraph}>{concept.explanation}</p>
              )}

              {concept.analogy && (
                <div className={styles.callout} style={{ '--cl': accent }}>
                  <IconBulb size={18} className={styles.calloutIcon} />
                  <p>
                    <strong>Analogy. </strong>
                    {concept.analogy}
                  </p>
                </div>
              )}

              {concept.keyPoints?.length > 0 && (
                <Section icon={IconList} title="Key points" accent={accent}>
                  <ul className={styles.keyPoints}>
                    {concept.keyPoints.map((point) => (
                      <li key={point}>
                        <IconCheck size={14} style={{ color: accent }} />
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </Section>
              )}

              {concept.code && (
                <Section icon={IconCode} title="Example" accent={accent}>
                  <div className={styles.codeWrap}>
                    <div className={styles.codeBar}>
                      <span className={styles.dots}>
                        <i /><i /><i />
                      </span>
                      <span className={styles.codeLang}>{concept.code.language}</span>
                    </div>
                    <pre className={styles.code}>
                      <code>{concept.code.lines.join('\n')}</code>
                    </pre>
                  </div>
                  {concept.code.explanation && (
                    <p className={styles.caption}>{concept.code.explanation}</p>
                  )}
                </Section>
              )}

              {concept.diagram && (
                <Section icon={IconFlow} title="Diagram" accent={accent}>
                  <div className={styles.diagram}>
                    <Mermaid
                      code={concept.diagram.lines.join('\n')}
                      accent={accent}
                      className={styles.mermaid}
                    />
                  </div>
                  {concept.diagram.caption && (
                    <p className={styles.caption}>{concept.diagram.caption}</p>
                  )}
                </Section>
              )}

              {concept.commonMistakes?.length > 0 && (
                <div className={styles.mistakes}>
                  <h5 className={styles.mistakesTitle}>
                    <IconAlert size={16} />
                    Common mistakes
                  </h5>
                  <ul>
                    {concept.commonMistakes.map((m) => (
                      <li key={m}>{m}</li>
                    ))}
                  </ul>
                </div>
              )}

              {concept.exercises?.length > 0 && (
                <Section icon={IconDumbbell} title="Practice" accent={accent}>
                  <div className={styles.exercises}>
                    {concept.exercises.map((ex, i) => (
                      <Exercise key={i} exercise={ex} index={i} accent={accent} />
                    ))}
                  </div>
                </Section>
              )}

              {concept.checkYourself?.length > 0 && (
                <Section icon={IconHelp} title="Check yourself" accent={accent}>
                  <ul className={styles.checks}>
                    {concept.checkYourself.map((q) => (
                      <li key={q}>{q}</li>
                    ))}
                  </ul>
                </Section>
              )}

              {concept.docs && (
                <a
                  className={styles.docsLink}
                  href={concept.docs}
                  target="_blank"
                  rel="noreferrer"
                  style={{ color: accent }}
                >
                  <IconLink size={15} />
                  Read the official docs
                </a>
              )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.article>
    </div>
  );
}
