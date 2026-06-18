// Course curriculum for "The Right Way to Learn React".
// Lesson content is intentionally left as a reusable template for now.

export const courseMeta = {
  title: 'The Right Way to Learn React',
  subtitle:
    'A structured, project-driven path from JSX fundamentals to production-grade apps.',
  level: 'Beginner → Advanced',
  duration: '~28 hours',
  lessonsCount: 0, // computed below
};

export const modules = [
  {
    id: 'foundations',
    title: 'Foundations',
    summary: 'How React thinks: components, JSX and the render model.',
    accent: '#2d6bff',
    lessons: [
      {
        id: 'why-react',
        title: 'Why React exists',
        duration: '12 min',
        type: 'Reading',
      },
      {
        id: 'jsx-basics',
        title: 'JSX, elements & the virtual DOM',
        duration: '18 min',
        type: 'Lesson',
      },
      {
        id: 'first-component',
        title: 'Your first component',
        duration: '22 min',
        type: 'Hands-on',
      },
    ],
  },
  {
    id: 'state',
    title: 'State & Interactivity',
    summary: 'Make the UI react to data with hooks and events.',
    accent: '#61dafb',
    lessons: [
      {
        id: 'usestate',
        title: 'Thinking in state with useState',
        duration: '20 min',
        type: 'Lesson',
      },
      {
        id: 'events',
        title: 'Events & controlled inputs',
        duration: '16 min',
        type: 'Hands-on',
      },
      {
        id: 'lifting-state',
        title: 'Lifting state up',
        duration: '24 min',
        type: 'Lesson',
      },
    ],
  },
  {
    id: 'effects',
    title: 'Effects & Data',
    summary: 'Talk to the outside world the right way.',
    accent: '#8b5cf6',
    lessons: [
      {
        id: 'useeffect',
        title: 'useEffect without the footguns',
        duration: '26 min',
        type: 'Lesson',
      },
      {
        id: 'fetching',
        title: 'Fetching & caching data',
        duration: '30 min',
        type: 'Hands-on',
      },
      {
        id: 'custom-hooks',
        title: 'Writing custom hooks',
        duration: '22 min',
        type: 'Lesson',
      },
    ],
  },
  {
    id: 'production',
    title: 'Production Patterns',
    summary: 'Routing, performance and shipping with confidence.',
    accent: '#ff9f43',
    lessons: [
      {
        id: 'routing',
        title: 'Client-side routing',
        duration: '20 min',
        type: 'Lesson',
      },
      {
        id: 'performance',
        title: 'Performance & memoization',
        duration: '28 min',
        type: 'Lesson',
      },
      {
        id: 'capstone',
        title: 'Capstone: ship a real app',
        duration: '90 min',
        type: 'Project',
      },
    ],
  },
];

export const allLessons = modules.flatMap((m) =>
  m.lessons.map((l) => ({ ...l, moduleId: m.id, moduleTitle: m.title, accent: m.accent }))
);

courseMeta.lessonsCount = allLessons.length;
