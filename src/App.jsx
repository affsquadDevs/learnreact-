import { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import StudyTimerProvider from './context/StudyTimerProvider';
import Landing from './pages/Landing';
import Course from './pages/Course';
import Roadmap from './pages/Roadmap';
import NotFound from './pages/NotFound';
import { routeMeta } from './seo';

// Pages are imported eagerly so the server prerender (renderToString) produces the
// full HTML for each route synchronously. The router lives in the entry files
// (BrowserRouter on the client, StaticRouter on the server).
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
        <Route path="/course" element={<StudyTimerProvider><Course /></StudyTimerProvider>} />
        <Route path="/roadmap" element={<Roadmap />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}
