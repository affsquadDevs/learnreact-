import { useCallback, useEffect, useState } from 'react';
import { totalConcepts } from '../data/roadmap';
import {
  PROGRESS_EVENT,
  COURSE_KEY,
  ROADMAP_KEY,
  readSynced,
  resetAll,
  toggleConcept as storeToggleConcept,
  toggleTopic as storeToggleTopic,
} from '../lib/progressStore';

function loadRoadmapState() {
  return readSynced().roadmap;
}

/**
 * Tracks completed roadmap concepts in localStorage, synced with course lesson progress.
 */
export function useRoadmap() {
  const [state, setState] = useState({ done: {} });

  const refresh = useCallback(() => {
    setState(loadRoadmapState());
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- client-only load after mount for SSR-safe hydration
    refresh();
  }, [refresh]);

  useEffect(() => {
    const onStorage = (e) => {
      if (e.key === ROADMAP_KEY || e.key === COURSE_KEY) refresh();
    };
    const onSync = () => refresh();
    window.addEventListener('storage', onStorage);
    window.addEventListener(PROGRESS_EVENT, onSync);
    return () => {
      window.removeEventListener('storage', onStorage);
      window.removeEventListener(PROGRESS_EVENT, onSync);
    };
  }, [refresh]);

  const isDone = useCallback((id) => Boolean(state.done[id]), [state.done]);

  const toggleConcept = useCallback(
    (id) => {
      storeToggleConcept(id);
      refresh();
    },
    [refresh]
  );

  const toggleTopic = useCallback(
    (conceptIds) => {
      storeToggleTopic(conceptIds);
      refresh();
    },
    [refresh]
  );

  const resetRoadmap = useCallback(() => {
    resetAll();
    refresh();
  }, [refresh]);

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
