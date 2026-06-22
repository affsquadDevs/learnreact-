import { useCallback, useEffect, useState } from 'react';

/**
 * Tracks completed roadmap concepts in localStorage, synced with course lesson
 * progress. Course-aware: pass the course object from the registry.
 */
export function useRoadmap(course) {
  const { store, totalConcepts } = course;

  const [state, setState] = useState({ done: {} });

  const refresh = useCallback(() => {
    setState(store.readSynced().roadmap);
  }, [store]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- client-only load after mount for SSR-safe hydration
    refresh();
  }, [refresh]);

  useEffect(() => {
    const onStorage = (e) => {
      if (e.key === store.ROADMAP_KEY || e.key === store.COURSE_KEY) refresh();
    };
    const onSync = () => refresh();
    window.addEventListener('storage', onStorage);
    window.addEventListener(store.PROGRESS_EVENT, onSync);
    return () => {
      window.removeEventListener('storage', onStorage);
      window.removeEventListener(store.PROGRESS_EVENT, onSync);
    };
  }, [refresh, store]);

  const isDone = useCallback((id) => Boolean(state.done[id]), [state.done]);

  const toggleConcept = useCallback(
    (id) => {
      store.toggleConcept(id);
      refresh();
    },
    [refresh, store]
  );

  const toggleTopic = useCallback(
    (conceptIds) => {
      store.toggleTopic(conceptIds);
      refresh();
    },
    [refresh, store]
  );

  const resetRoadmap = useCallback(() => {
    store.resetAll();
    refresh();
  }, [refresh, store]);

  const completedCount = Object.keys(state.done).length;
  const percent = totalConcepts
    ? Math.round((completedCount / totalConcepts) * 100)
    : 0;

  return {
    isDone,
    toggleConcept,
    toggleTopic,
    resetRoadmap,
    completedCount,
    total: totalConcepts,
    percent,
  };
}
