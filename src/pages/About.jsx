import { Link } from 'react-router-dom';
import PageShell from '../components/PageShell';

export default function About() {
  return (
    <PageShell
      title="About DevWay"
      lead="DevWay is a structured, hands-on way to learn web development — across frontend, backend and the cloud, from your first lesson to production-ready skills."
    >
      <h2>Our mission</h2>
      <p>
        Learning to build for the web can feel scattered: dozens of tutorials, conflicting advice,
        and no clear order to follow. DevWay exists to fix that. We organise each technology into a
        single, deliberate path so you always know what to learn next and why it matters.
      </p>

      <h2>What DevWay offers</h2>
      <ul>
        <li>
          <strong>Structured courses</strong> — lessons that build on each other, each with quizzes
          and hands-on tasks. Browse all <Link to="/courses">courses</Link>, including React and the
          AWS Cloud Practitioner certification.
        </li>
        <li>
          <strong>Learning roadmaps</strong> — a clear, ordered map of concepts for each course, so
          the bigger picture is always in view. Explore a <Link to="/roadmap">roadmap</Link>.
        </li>
        <li>
          <strong>Progress tracking</strong> — your completed lessons and roadmap concepts are saved
          in your browser, per course, so you can pick up exactly where you left off.
        </li>
      </ul>

      <h2>Our approach</h2>
      <p>
        We believe you learn best by building. Every concept is paired with practical context,
        worked examples, and exercises, and each roadmap keeps the bigger picture in view so
        individual lessons never feel isolated. We focus on solid fundamentals first, before the
        wider ecosystem.
      </p>

      <h2>Who it's for</h2>
      <p>
        DevWay is built for developers who want a dependable, end-to-end path: beginners taking
        their first steps, and self-taught or career-switching developers who want to fill the gaps
        and learn web development the right way.
      </p>

      <h2>Get in touch</h2>
      <p>
        Questions, feedback or suggestions? We'd love to hear from you — visit our{' '}
        <Link to="/contact">contact page</Link> or email{' '}
        <a href="mailto:hello@learn-react.com">hello@learn-react.com</a>.
      </p>
    </PageShell>
  );
}
