// Shared framer-motion variants for consistent, production-feel motion.

export const easeOut = [0.22, 1, 0.36, 1];

export const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: easeOut },
  },
};

export const stagger = (gap = 0.08, delay = 0) => ({
  hidden: {},
  show: {
    transition: { staggerChildren: gap, delayChildren: delay },
  },
});

export const scaleIn = {
  hidden: { opacity: 0, scale: 0.94 },
  show: { opacity: 1, scale: 1, transition: { duration: 0.55, ease: easeOut } },
};

// Standard viewport trigger for scroll-reveal sections.
export const viewport = { once: true, amount: 0.25 };
