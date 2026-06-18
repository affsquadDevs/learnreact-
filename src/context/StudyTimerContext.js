import { createContext, useContext } from 'react';

export const StudyTimerContext = createContext(null);

export function useStudyTimerContext() {
  const ctx = useContext(StudyTimerContext);
  if (!ctx) throw new Error('useStudyTimerContext must be used within StudyTimerProvider');
  return ctx;
}
