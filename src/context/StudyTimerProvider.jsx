import { useStudyTimer } from '../hooks/useStudyTimer';
import { StudyTimerContext } from './StudyTimerContext';

export default function StudyTimerProvider({ children }) {
  const timer = useStudyTimer();
  return (
    <StudyTimerContext.Provider value={timer}>
      {children}
    </StudyTimerContext.Provider>
  );
}
