import { Link } from 'react-router-dom';
import PageShell from '../components/PageShell';

export default function About() {
  return (
    <PageShell
      title="About ReactWay"
      lead="ReactWay is a structured, hands-on way to learn React — from your first component to production-ready apps."
    >
      <h2>Our mission</h2>
      <p>
        Learning React can feel scattered: dozens of tutorials, conflicting advice, and no clear
        order to follow. ReactWay exists to fix that. We organise modern React into a single,
        deliberate path so you always know what to learn next and why it matters.
      </p>

      <h2>What ReactWay offers</h2>
      <ul>
        <li>
          <strong>A structured course</strong> — modules that build on each other, from JSX and
          components to state, effects, data and production patterns. See the{' '}
          <Link to="/course">course</Link>.
        </li>
        <li>
          <strong>A learning roadmap</strong> — a clear, ordered map of core React concepts grouped
          from Trainee to Senior level. Explore the <Link to="/roadmap">roadmap</Link>.
        </li>
        <li>
          <strong>Progress tracking</strong> — your completed lessons and roadmap concepts are saved
          in your browser so you can pick up exactly where you left off.
        </li>
      </ul>

      <h2>Our approach</h2>
      <p>
        We believe you learn React best by building with it. Every concept is paired with practical
        context, and the roadmap keeps the bigger picture in view so individual lessons never feel
        isolated. We focus on core React (the <code>react</code> and <code>react-dom</code>
        libraries) first, so the fundamentals are rock solid before you reach for the wider
        ecosystem.
      </p>

      <h2>Who it's for</h2>
      <p>
        ReactWay is built for developers who want a dependable, end-to-end path: beginners taking
        their first steps, and self-taught or career-switching developers who want to fill the gaps
        and learn React the right way.
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
