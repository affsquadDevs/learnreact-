import { useCallback, useEffect, useMemo, useState } from 'react';

/**
 * Persists course progress to localStorage, synced with roadmap concept progress.
 * Course-aware: pass the course object from the registry; each course has its own
 * store (its own storage keys, lessons, and concept maps).
 */
export function useProgress(course) {
  const { store, allLessons } = course;
  const lessonIds = useMemo(
    () => new Set(allLessons.map((lesson) => lesson.id)),
    [allLessons]
  );

  const [state, setState] = useState({ completed: {}, lastLesson: null });

  const refresh = useCallback(() => {
    setState(store.readSynced().course);
  }, [store]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- client-only load after mount for SSR-safe hydration
    refresh();
  }, [refresh]);

  useEffect(() => {
    const onStorage = (e) => {
      if (e.key === store.COURSE_KEY || e.key === store.ROADMAP_KEY) refresh();
    };
    const onSync = () => refresh();
    window.addEventListener('storage', onStorage);
    window.addEventListener(store.PROGRESS_EVENT, onSync);
    return () => {
      window.removeEventListener('storage', onStorage);
      window.removeEventListener(store.PROGRESS_EVENT, onSync);
    };
  }, [refresh, store]);

  const toggleLesson = useCallback(
    (lessonId) => {
      store.toggleLesson(lessonId);
      refresh();
    },
    [refresh, store]
  );

  const setLastLesson = useCallback(
    (lessonId) => {
      store.setLastLesson(lessonId);
      refresh();
    },
    [refresh, store]
  );

  const resetProgress = useCallback(() => {
    store.resetAll();
    refresh();
  }, [refresh, store]);

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
