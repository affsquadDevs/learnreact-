import { useCallback, useEffect, useRef, useState } from 'react';
import { allLessons } from '../data/course';

const STORAGE_KEY = 'reactway.progress.v1';

function readStore() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { completed: {}, lastLesson: null };
    const parsed = JSON.parse(raw);
    return {
      completed: parsed.completed ?? {},
      lastLesson: parsed.lastLesson ?? null,
    };
  } catch {
    return { completed: {}, lastLesson: null };
  }
}

/**
 * Persists course progress to localStorage and keeps tabs in sync.
 */
export function useProgress() {
  const [state, setState] = useState({ completed: {}, lastLesson: null });
  const firstPersist = useRef(true);

  // Load persisted progress on the client after mount, so SSR/first render matches
  // the prerendered HTML (no hydration mismatch) and localStorage isn't read during render.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- intentional one-time client load of persisted state for SSR-safe hydration
    setState(readStore());
  }, []);

  useEffect(() => {
    if (firstPersist.current) {
      firstPersist.current = false;
      return;
    }
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      /* storage unavailable — ignore */
    }
  }, [state]);

  // Sync progress across open tabs.
  useEffect(() => {
    const onStorage = (e) => {
      if (e.key === STORAGE_KEY) setState(readStore());
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const toggleLesson = useCallback((lessonId) => {
    setState((prev) => {
      const completed = { ...prev.completed };
      if (completed[lessonId]) delete completed[lessonId];
      else completed[lessonId] = Date.now();
      return { ...prev, completed };
    });
  }, []);

  const setLastLesson = useCallback((lessonId) => {
    setState((prev) =>
      prev.lastLesson === lessonId ? prev : { ...prev, lastLesson: lessonId }
    );
  }, []);

  const resetProgress = useCallback(() => {
    setState({ completed: {}, lastLesson: null });
  }, []);

  const completedCount = Object.keys(state.completed).length;
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
