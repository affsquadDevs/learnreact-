import { useEffect } from 'react';
import { Routes, Route, Navigate, useLocation, useParams } from 'react-router-dom';
import StudyTimerProvider from './context/StudyTimerProvider';
import Landing from './pages/Landing';
import Courses from './pages/Courses';
import Course from './pages/Course';
import Roadmap from './pages/Roadmap';
import About from './pages/About';
import Contact from './pages/Contact';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';
import Blog from './pages/Blog';
import Article from './pages/Article';
import NotFound from './pages/NotFound';
import { routeMeta } from './seo';

// Pages are imported eagerly so the server prerender (renderToString) produces the
// full HTML for each route synchronously. The router lives in the entry files
// (BrowserRouter on the client, StaticRouter on the server).
// Remount Course/Roadmap when the course in the URL changes so per-course
// view state (active lesson, filters) resets cleanly between courses.
function CourseRoute() {
  const { courseId } = useParams();
  return (
    <StudyTimerProvider>
      <Course key={courseId || 'default'} />
    </StudyTimerProvider>
  );
}

function RoadmapRoute() {
  const { courseId } = useParams();
  return <Roadmap key={courseId || 'default'} />;
}

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
    // SPA focus management: move focus to the new page's main region.
    const main = document.getElementById('main');
    if (main) main.focus();
    // Keep the document title in sync on client-side navigation.
    const meta = routeMeta[pathname] || routeMeta[404];
    if (meta) document.title = meta.title;
  }, [pathname]);
  return null;
}

export default function App() {
  return (
    <>
      <a href="#main" className="skip-link">Skip to content</a>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/courses" element={<Courses />} />
        {/* Bare /course and /roadmap don't favour any single course — send to the catalog. */}
        <Route path="/course" element={<Navigate to="/courses" replace />} />
        <Route path="/course/:courseId" element={<CourseRoute />} />
        <Route path="/roadmap" element={<Navigate to="/courses" replace />} />
        <Route path="/roadmap/:courseId" element={<RoadmapRoute />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog/:slug" element={<Article />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}
