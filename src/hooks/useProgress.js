import { useCallback, useEffect, useState } from 'react';
import { allLessons } from '../data/course';
import {
  PROGRESS_EVENT,
  COURSE_KEY,
  ROADMAP_KEY,
  readSynced,
  resetAll,
  setLastLesson as storeSetLastLesson,
  toggleLesson as storeToggleLesson,
} from '../lib/progressStore';

const lessonIds = new Set(allLessons.map((lesson) => lesson.id));

function loadCourseState() {
  return readSynced().course;
}

/**
 * Persists course progress to localStorage, synced with roadmap concept progress.
 */
export function useProgress() {
  const [state, setState] = useState({ completed: {}, lastLesson: null });

  const refresh = useCallback(() => {
    setState(loadCourseState());
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- client-only load after mount for SSR-safe hydration
    refresh();
  }, [refresh]);

  useEffect(() => {
    const onStorage = (e) => {
      if (e.key === COURSE_KEY || e.key === ROADMAP_KEY) refresh();
    };
    const onSync = () => refresh();
    window.addEventListener('storage', onStorage);
    window.addEventListener(PROGRESS_EVENT, onSync);
    return () => {
      window.removeEventListener('storage', onStorage);
      window.removeEventListener(PROGRESS_EVENT, onSync);
    };
  }, [refresh]);

  const toggleLesson = useCallback(
    (lessonId) => {
      storeToggleLesson(lessonId);
      refresh();
    },
    [refresh]
  );

  const setLastLesson = useCallback(
    (lessonId) => {
      storeSetLastLesson(lessonId);
      refresh();
    },
    [refresh]
  );

  const resetProgress = useCallback(() => {
    resetAll();
    refresh();
  }, [refresh]);

  const completedCount = Object.keys(state.completed).filter((id) => lessonIds.has(id)).length;
  const total = allLessons.length;
  const percent = total ? Math.round((completedCount / total) * 100) : 0;

  const isCompleted = useCallback(
    (lessonId) => Boolean(state.completed[lessonId]),
    [state.completed]
  );

  return {
    completed: state.completed,
    lastLesson: state.lastLesson,
    completedCount,
    total,
    percent,
    isCompleted,
    toggleLesson,
    setLastLesson,
    resetProgress,
  };
}
