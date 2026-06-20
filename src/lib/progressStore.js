import { allLessons } from '../data/course';
import { levels } from '../data/roadmap';

export const COURSE_KEY = 'reactway.progress.v1';
export const ROADMAP_KEY = 'reactway.roadmap.v1';
export const PROGRESS_EVENT = 'reactway:progress';

const lessonIds = new Set(allLessons.map((l) => l.id));

/** topicId -> concept ids */
export const topicConceptIds = Object.fromEntries(
  levels.flatMap((lvl) =>
    lvl.topics.map((topic) => [topic.id, topic.concepts.map((c) => c.id)])
  )
);

/** conceptId -> topicId */
export const conceptTopicId = Object.fromEntries(
  levels.flatMap((lvl) =>
    lvl.topics.flatMap((topic) => topic.concepts.map((c) => [c.id, topic.id]))
  )
);

function readRawCourse() {
  try {
    const raw = localStorage.getItem(COURSE_KEY);
    if (!raw) return { completed: {}, lastLesson: null };
    const parsed = JSON.parse(raw);
    const completed = Object.fromEntries(
      Object.entries(parsed.completed ?? {}).filter(([id]) => lessonIds.has(id))
    );
    return {
      completed,
      lastLesson: lessonIds.has(parsed.lastLesson) ? parsed.lastLesson : null,
    };
  } catch {
    return { completed: {}, lastLesson: null };
  }
}

function readRawRoadmap() {
  try {
    const raw = localStorage.getItem(ROADMAP_KEY);
    if (!raw) return { done: {} };
    const parsed = JSON.parse(raw);
    return { done: parsed.done ?? {} };
  } catch {
    return { done: {} };
  }
}

/** Align lesson flags with per-concept completion (handles legacy split stores). */
export function reconcile(course, roadmap) {
  const completed = { ...course.completed };
  const done = { ...roadmap.done };

  for (const topicId of lessonIds) {
    const conceptIds = topicConceptIds[topicId] ?? [];
    if (!conceptIds.length) continue;

    const allDone = conceptIds.every((id) => done[id]);
    const lessonDone = Boolean(completed[topicId]);

    if (lessonDone && !allDone) {
      const ts = completed[topicId];
      conceptIds.forEach((id) => {
        if (!done[id]) done[id] = ts || Date.now();
      });
    } else if (allDone) {
      const ts = Math.max(...conceptIds.map((id) => done[id] || 0));
      completed[topicId] = ts || Date.now();
    }
  }

  return {
    course: { ...course, completed },
    roadmap: { done },
  };
}

export function readSynced() {
  return reconcile(readRawCourse(), readRawRoadmap());
}

export function writeSynced(course, roadmap) {
  try {
    localStorage.setItem(COURSE_KEY, JSON.stringify(course));
    localStorage.setItem(ROADMAP_KEY, JSON.stringify(roadmap));
    window.dispatchEvent(new CustomEvent(PROGRESS_EVENT));
  } catch {
    /* storage unavailable */
  }
}

export function toggleLesson(lessonId) {
  const { course, roadmap } = readSynced();
  const conceptIds = topicConceptIds[lessonId] ?? [];
  const ts = Date.now();
  const marking = !course.completed[lessonId];

  if (marking) {
    course.completed[lessonId] = ts;
    conceptIds.forEach((id) => {
      roadmap.done[id] = ts;
    });
  } else {
    delete course.completed[lessonId];
    conceptIds.forEach((id) => {
      delete roadmap.done[id];
    });
  }

  writeSynced(course, roadmap);
  return readSynced();
}

export function toggleConcept(conceptId) {
  const { course, roadmap } = readSynced();
  const topicId = conceptTopicId[conceptId];
  const ts = Date.now();

  if (roadmap.done[conceptId]) delete roadmap.done[conceptId];
  else roadmap.done[conceptId] = ts;

  if (topicId) {
    const ids = topicConceptIds[topicId] ?? [];
    const allDone = ids.length > 0 && ids.every((id) => roadmap.done[id]);
    if (allDone) course.completed[topicId] = ts;
    else delete course.completed[topicId];
  }

  writeSynced(course, roadmap);
  return readSynced();
}

export function toggleTopic(conceptIds) {
  const { course, roadmap } = readSynced();
  const topicId = conceptIds[0] ? conceptTopicId[conceptIds[0]] : null;
  const ts = Date.now();
  const allDone = conceptIds.every((id) => roadmap.done[id]);

  if (allDone) {
    conceptIds.forEach((id) => delete roadmap.done[id]);
    if (topicId) delete course.completed[topicId];
  } else {
    conceptIds.forEach((id) => {
      roadmap.done[id] = ts;
    });
    if (topicId) course.completed[topicId] = ts;
  }

  writeSynced(course, roadmap);
  return readSynced();
}

export function setLastLesson(lessonId) {
  const { course, roadmap } = readSynced();
  if (course.lastLesson === lessonId) return { course, roadmap };
  course.lastLesson = lessonId;
  writeSynced(course, roadmap);
  return { course, roadmap };
}

export function resetAll() {
  const empty = { course: { completed: {}, lastLesson: null }, roadmap: { done: {} } };
  writeSynced(empty.course, empty.roadmap);
  return empty;
}
