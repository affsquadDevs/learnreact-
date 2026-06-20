import { useCallback, useEffect, useRef, useState } from 'react';
import { totalConcepts } from '../data/roadmap';

const STORAGE_KEY = 'reactway.roadmap.v1';

function readStore() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { done: {} };
    const parsed = JSON.parse(raw);
    return { done: parsed.done ?? {} };
  } catch {
    return { done: {} };
  }
}

/**
 * Tracks completed roadmap concepts in localStorage (per concept id).
 */
export function useRoadmap() {
  const [state, setState] = useState({ done: {} });
  const firstPersist = useRef(true);

  // Load persisted roadmap progress on the client after mount (avoids hydration mismatch).
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
      /* ignore */
    }
  }, [state]);

  useEffect(() => {
    const onStorage = (e) => {
      if (e.key === STORAGE_KEY) setState(readStore());
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const isDone = useCallback((id) => Boolean(state.done[id]), [state.done]);

  const toggleConcept = useCallback((id) => {
    setState((prev) => {
      const done = { ...prev.done };
      if (done[id]) delete done[id];
      else done[id] = Date.now();
      return { done };
    });
  }, []);

  // Mark every concept in a topic done (or clear them all if already complete).
  const toggleTopic = useCallback((conceptIds) => {
    setState((prev) => {
      const done = { ...prev.done };
      const allDone = conceptIds.every((id) => done[id]);
      conceptIds.forEach((id) => {
        if (allDone) delete done[id];
        else done[id] = Date.now();
      });
      return { done };
    });
  }, []);

  const resetRoadmap = useCallback(() => setState({ done: {} }), []);

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
