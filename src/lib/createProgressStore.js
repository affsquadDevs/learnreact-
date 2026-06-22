// Generic, per-course progress store. Each course gets its own localStorage keys
// and sync event, so progress for React, AWS, etc. never collide. This is the
// course-agnostic version of the original single-course progressStore.
//
// A store keeps two synced maps:
//   course  -> { completed: { [lessonId]: ts }, lastLesson }
//   roadmap -> { done: { [conceptId]: ts } }
// A lesson (topic) counts as completed when all of its concepts are done.

export function createProgressStore({
  courseKey,
  roadmapKey,
  eventName,
  lessonIds, // Set of topic ids
  topicConceptIds, // topicId -> [conceptId]
  conceptTopicId, // conceptId -> topicId
}) {
  function now() {
    return Date.now();
  }

  function readRawCourse() {
    try {
      const raw = localStorage.getItem(courseKey);
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
      const raw = localStorage.getItem(roadmapKey);
      if (!raw) return { done: {} };
      const parsed = JSON.parse(raw);
      return { done: parsed.done ?? {} };
    } catch {
      return { done: {} };
    }
  }

  // Align lesson flags with per-concept completion (handles legacy split stores).
  function reconcile(course, roadmap) {
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
          if (!done[id]) done[id] = ts || now();
        });
      } else if (allDone) {
        const ts = Math.max(...conceptIds.map((id) => done[id] || 0));
        completed[topicId] = ts || now();
      }
    }

    return { course: { ...course, completed }, roadmap: { done } };
  }

  function readSynced() {
    return reconcile(readRawCourse(), readRawRoadmap());
  }

  function writeSynced(course, roadmap) {
    try {
      localStorage.setItem(courseKey, JSON.stringify(course));
      localStorage.setItem(roadmapKey, JSON.stringify(roadmap));
      window.dispatchEvent(new CustomEvent(eventName));
    } catch {
      /* storage unavailable */
    }
  }

  function toggleLesson(lessonId) {
    const { course, roadmap } = readSynced();
    const conceptIds = topicConceptIds[lessonId] ?? [];
    const ts = now();
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

  function toggleConcept(conceptId) {
    const { course, roadmap } = readSynced();
    const topicId = conceptTopicId[conceptId];
    const ts = now();

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

  function toggleTopic(conceptIds) {
    const { course, roadmap } = readSynced();
    const topicId = conceptIds[0] ? conceptTopicId[conceptIds[0]] : null;
    const ts = now();
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

  function setLastLesson(lessonId) {
    const { course, roadmap } = readSynced();
    if (course.lastLesson === lessonId) return { course, roadmap };
    course.lastLesson = lessonId;
    writeSynced(course, roadmap);
    return { course, roadmap };
  }

  function resetAll() {
    const empty = {
      course: { completed: {}, lastLesson: null },
      roadmap: { done: {} },
    };
    writeSynced(empty.course, empty.roadmap);
    return empty;
  }

  return {
    COURSE_KEY: courseKey,
    ROADMAP_KEY: roadmapKey,
    PROGRESS_EVENT: eventName,
    readSynced,
    toggleLesson,
    toggleConcept,
    toggleTopic,
    setLastLesson,
    resetAll,
  };
}
