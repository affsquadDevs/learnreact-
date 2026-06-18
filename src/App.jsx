import { useEffect } from 'react';
import {
  BrowserRouter,
  Routes,
  Route,
  useLocation,
} from 'react-router-dom';
import StudyTimerProvider from './context/StudyTimerProvider';
import Landing from './pages/Landing';
import Course from './pages/Course';
import Roadmap from './pages/Roadmap';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/course" element={<StudyTimerProvider><Course /></StudyTimerProvider>} />
        <Route path="/roadmap" element={<Roadmap />} />
        <Route path="*" element={<Landing />} />
      </Routes>
    </BrowserRouter>
  );
}
