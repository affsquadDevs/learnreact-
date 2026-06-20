// Course curriculum for "The Right Way to Learn React".
// It mirrors the roadmap: each roadmap level becomes a course module,
// and each roadmap topic becomes a lesson shell.

import { levels } from './roadmap';

export const courseMeta = {
  title: 'The Right Way to Learn React',
  subtitle:
    'A structured map of core React concepts, from fundamentals to modern internals.',
  level: 'Beginner → Advanced',
  duration: '~40 hours',
  lessonsCount: 0, // computed below
};

export const modules = levels.map((level) => ({
  id: `level-${level.level}`,
  title: `${level.name}: ${level.focus}`,
  shortTitle: level.name,
  summary: level.focus,
  accent: level.accent,
  lessons: level.topics.map((topic) => ({
    id: topic.id,
    title: topic.name,
    duration: `${Math.max(15, topic.concepts.length * 8)} min`,
    type: `Level ${level.level}`,
    summary: `A high-level lesson shell for ${topic.name.toLowerCase()}.`,
    concepts: topic.concepts,
  })),
}));

export const allLessons = modules.flatMap((m) =>
  m.lessons.map((l) => ({
    ...l,
    moduleId: m.id,
    moduleTitle: m.title,
    moduleShortTitle: m.shortTitle,
    accent: m.accent,
  }))
);

courseMeta.lessonsCount = allLessons.length;
