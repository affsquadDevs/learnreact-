import { motion } from 'framer-motion';
import styles from './LessonContent.module.css';

/* Hand-drawn style decorative shapes (squiggles, blobs, dots, stars). */

const Squiggle = ({ color }) => (
  <svg viewBox="0 0 90 26" fill="none">
    <path
      d="M3 13c8-12 15 12 22 0s15 12 22 0 15 12 22 0"
      stroke={color}
      strokeWidth="4.5"
      strokeLinecap="round"
    />
  </svg>
);

const Blob = ({ color }) => (
  <svg viewBox="0 0 100 100" fill="none">
    <path
      d="M52 6c22-2 42 16 41 39 0 22-15 40-37 45C32 95 9 80 6 56 3 31 22 8 52 6Z"
      fill={color}
    />
  </svg>
);

const Dots = ({ color }) => (
  <svg viewBox="0 0 64 64" fill={color}>
    {[0, 1, 2].map((r) =>
      [0, 1, 2].map((c) => (
        <circle key={`${r}-${c}`} cx={10 + c * 22} cy={10 + r * 22} r="4.5" />
      ))
    )}
  </svg>
);

const Star = ({ color }) => (
  <svg viewBox="0 0 44 44" fill="none">
    <path
      d="M22 2c2 13 7 18 20 20-13 2-18 7-20 20-2-13-7-18-20-20 13-2 18-7 20-20Z"
      fill={color}
    />
  </svg>
);

const Zigzag = ({ color }) => (
  <svg viewBox="0 0 88 28" fill="none">
    <path
      d="M3 20 13 8l12 12L37 8l12 12L61 8l12 12 3-4"
      stroke={color}
      strokeWidth="4.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const Ring = ({ color }) => (
  <svg viewBox="0 0 60 60" fill="none">
    <circle cx="30" cy="30" r="23" stroke={color} strokeWidth="6.5" />
  </svg>
);

const Wave = ({ color }) => (
  <svg viewBox="0 0 96 32" fill="none">
    <path
      d="M4 22C20 4 32 4 48 18s28 14 44-6"
      stroke={color}
      strokeWidth="7"
      strokeLinecap="round"
    />
  </svg>
);

const Triangle = ({ color }) => (
  <svg viewBox="0 0 44 44" fill="none">
    <path d="M22 5 39 37H5L22 5Z" fill={color} />
  </svg>
);

const DOODLES = [
  { C: Squiggle, color: '#2d6bff', size: 78, pos: { top: '2%', left: '-2%' }, rot: -8, dur: 6 },
  { C: Blob, color: '#ffd23f', size: 64, pos: { top: '12%', right: '-1%' }, rot: 12, dur: 7.5 },
  { C: Dots, color: '#1ba85a', size: 54, pos: { top: '34%', left: '-3%' }, rot: 0, dur: 8 },
  { C: Star, color: '#8b5cf6', size: 40, pos: { top: '27%', right: '4%' }, rot: -6, dur: 5.5 },
  { C: Wave, color: '#ff5f57', size: 84, pos: { top: '52%', right: '-2%' }, rot: 8, dur: 6.5 },
  { C: Ring, color: '#61dafb', size: 50, pos: { top: '64%', left: '-2%' }, rot: 0, dur: 7 },
  { C: Zigzag, color: '#ff9f43', size: 76, pos: { top: '80%', right: '2%' }, rot: -10, dur: 6.8 },
  { C: Triangle, color: '#2d6bff', size: 36, pos: { top: '90%', left: '3%' }, rot: 14, dur: 5.8 },
  { C: Star, color: '#ffd23f', size: 30, pos: { top: '46%', left: '2%' }, rot: 10, dur: 6.2 },
];

export default function LessonDoodles() {
  return (
    <div className={styles.doodleLayer} aria-hidden="true">
      {DOODLES.map((d, i) => {
        const Shape = d.C;
        return (
          <motion.div
            key={i}
            className={styles.doodle}
            style={{ ...d.pos, width: d.size, height: d.size }}
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{
              opacity: 0.85,
              scale: 1,
              y: [0, -12, 0],
              rotate: [d.rot, d.rot + 6, d.rot],
            }}
            transition={{
              opacity: { duration: 0.6, delay: i * 0.05 },
              scale: { duration: 0.6, delay: i * 0.05, ease: [0.16, 1, 0.3, 1] },
              y: { duration: d.dur, repeat: Infinity, ease: 'easeInOut', delay: i * 0.2 },
              rotate: { duration: d.dur, repeat: Infinity, ease: 'easeInOut', delay: i * 0.2 },
            }}
          >
            <Shape color={d.color} />
          </motion.div>
        );
      })}
    </div>
  );
}
