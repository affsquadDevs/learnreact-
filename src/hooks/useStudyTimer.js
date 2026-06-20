import { useCallback, useEffect, useRef, useState } from 'react';

const STORAGE_KEY = 'reactway.studyTimer.v1';

function readStore() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { totalSeconds: 0, sessionSeconds: 0, isRunning: false, startedAt: null };
    const p = JSON.parse(raw);
    return {
      totalSeconds: p.totalSeconds ?? 0,
      sessionSeconds: p.sessionSeconds ?? 0,
      isRunning: Boolean(p.isRunning),
      startedAt: p.startedAt ?? null,
    };
  } catch {
    return { totalSeconds: 0, sessionSeconds: 0, isRunning: false, startedAt: null };
  }
}

function elapsedSince(iso) {
  if (!iso) return 0;
  return Math.max(0, Math.floor((Date.now() - new Date(iso).getTime()) / 1000));
}

export function formatStudyTime(totalSeconds) {
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;
  return [h, m, s].map((n) => String(n).padStart(2, '0')).join(':');
}

/**
 * Study timer with session + lifetime totals persisted in localStorage.
 */
export function useStudyTimer() {
  const [state, setState] = useState({ totalSeconds: 0, sessionSeconds: 0, isRunning: false, startedAt: null });
  const [, setTick] = useState(0);
  const firstPersist = useRef(true);

  // Load persisted timer on the client after mount (avoids hydration mismatch).
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

  // Re-render every second while the timer is running.
  useEffect(() => {
    if (!state.isRunning) return undefined;
    const id = setInterval(() => setTick((t) => t + 1), 1000);
    return () => clearInterval(id);
  }, [state.isRunning, state.startedAt]);

  const sessionSeconds = state.isRunning
    ? state.sessionSeconds + elapsedSince(state.startedAt)
    : state.sessionSeconds;

  const displaySeconds = state.totalSeconds + sessionSeconds;

  const start = useCallback(() => {
    setState((prev) => {
      if (prev.isRunning) return prev;
      return { ...prev, isRunning: true, startedAt: new Date().toISOString() };
    });
  }, []);

  const pause = useCallback(() => {
    setState((prev) => {
      if (!prev.isRunning) return prev;
      const added = elapsedSince(prev.startedAt);
      return {
        ...prev,
        isRunning: false,
        startedAt: null,
        sessionSeconds: prev.sessionSeconds + added,
      };
    });
  }, []);

  const stop = useCallback(() => {
    setState((prev) => {
      const added = prev.isRunning ? elapsedSince(prev.startedAt) : 0;
      const sessionTotal = prev.sessionSeconds + added;
      return {
        totalSeconds: prev.totalSeconds + sessionTotal,
        sessionSeconds: 0,
        isRunning: false,
        startedAt: null,
      };
    });
  }, []);

  const toggle = useCallback(() => {
    setState((prev) => {
      if (prev.isRunning) {
        const added = elapsedSince(prev.startedAt);
        return {
          ...prev,
          isRunning: false,
          startedAt: null,
          sessionSeconds: prev.sessionSeconds + added,
        };
      }
      return { ...prev, isRunning: true, startedAt: new Date().toISOString() };
    });
  }, []);

  return {
    displaySeconds,
    sessionSeconds,
    totalSeconds: state.totalSeconds,
    isRunning: state.isRunning,
    start,
    pause,
    stop,
    toggle,
    formatted: formatStudyTime(displaySeconds),
    sessionFormatted: formatStudyTime(sessionSeconds),
  };
}
