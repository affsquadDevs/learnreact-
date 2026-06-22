// Turns a course content document (the courseContent.json shape) into everything
// the UI needs: roadmap levels, course modules, a flat lesson list, content lookup
// maps, and a per-course progress store. Both the React course and the AWS course
// (and any future course) are built with this single factory.

import { createProgressStore } from '../../lib/createProgressStore';

// Ensure every level/topic/concept has a stable id and that each concept has a
// `text` field (used by the roadmap), defaulting to its title.
function normalizeLevels(rawLevels) {
  return rawLevels.map((lvl) => ({
    level: lvl.level,
    name: lvl.name,
    focus: lvl.focus,
    accent: lvl.accent,
    soft: lvl.soft,
    topics: lvl.topics.map((topic, ti) => {
      const topicId = topic.id ?? `l${lvl.level}-t${ti}`;
      return {
        id: topicId,
        name: topic.name,
        concepts: topic.concepts.map((c, ci) => ({
          ...c,
          id: c.id ?? `${topicId}-c${ci}`,
          text: c.text ?? c.title,
        })),
      };
    }),
  }));
}

/**
 * @param {object} descriptor  Static metadata + storage keys for the course.
 * @param {object} content     The content document ({ meta, levels }).
 */
export function createCourse(descriptor, content) {
  const levels = normalizeLevels(content.levels);

  const modules = levels.map((level) => ({
    id: `level-${level.level}`,
    title: `${level.name}: ${level.focus}`,
    shortTitle: level.name,
    summary: level.focus,
    accent: level.accent,
    soft: level.soft,
    lessons: level.topics.map((topic) => ({
      id: topic.id,
      title: topic.name,
      duration: `${Math.max(15, topic.concepts.length * 8)} min`,
      type: `Level ${level.level}`,
      summary: `Lesson on ${topic.name.toLowerCase()}.`,
      concepts: topic.concepts,
    })),
  }));

  const allLessons = modules.flatMap((m) =>
    m.lessons.map((l) => ({
      ...l,
      moduleId: m.id,
      moduleTitle: m.title,
      moduleShortTitle: m.shortTitle,
      accent: m.accent,
    }))
  );

  const topicContent = {};
  const conceptById = {};
  for (const level of levels) {
    for (const topic of level.topics) {
      topicContent[topic.id] = topic.concepts;
      for (const concept of topic.concepts) conceptById[concept.id] = concept;
    }
  }

  const allConceptIds = levels.flatMap((l) =>
    l.topics.flatMap((t) => t.concepts.map((c) => c.id))
  );
  const totalConcepts = allConceptIds.length;

  const topicConceptIds = Object.fromEntries(
    levels.flatMap((lvl) => lvl.topics.map((t) => [t.id, t.concepts.map((c) => c.id)]))
  );
  const conceptTopicId = Object.fromEntries(
    levels.flatMap((lvl) => lvl.topics.flatMap((t) => t.concepts.map((c) => [c.id, t.id])))
  );
  const lessonIds = new Set(allLessons.map((l) => l.id));

  // A topic is "rich" when at least one concept has real teaching content.
  const richTopics = new Set(
    levels
      .flatMap((l) => l.topics)
      .filter((t) => t.concepts.some((c) => c.explanation || c.exercises?.length))
      .map((t) => t.id)
  );

  const store = createProgressStore({
    courseKey: descriptor.courseKey,
    roadmapKey: descriptor.roadmapKey,
    eventName: descriptor.eventName ?? `reactway:progress:${descriptor.id}`,
    lessonIds,
    topicConceptIds,
    conceptTopicId,
  });

  return {
    ...descriptor,
    levels,
    modules,
    allLessons,
    topicContent,
    conceptById,
    allConceptIds,
    totalConcepts,
    topicConceptIds,
    conceptTopicId,
    store,
    meta: {
      title: descriptor.title,
      subtitle: descriptor.subtitle,
      level: descriptor.level,
      duration: descriptor.duration,
      lessonsCount: allLessons.length,
    },
    roadmapMeta: {
      title: descriptor.roadmapTitle ?? `${descriptor.title} Roadmap`,
      description: descriptor.roadmapDescription ?? descriptor.subtitle,
    },
    getTopicConcepts: (id) => topicContent[id] ?? null,
    hasContent: (id) => richTopics.has(id),
  };
}
