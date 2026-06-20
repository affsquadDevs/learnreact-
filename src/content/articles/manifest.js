// Article metadata — plain JS so it can be imported by the prerender script (Node)
// and by src/seo.js for per-route <head>, as well as by the React pages.
// Article bodies live in ./bodies.jsx, keyed by slug.
export const articles = [
  {
    slug: 'how-usestate-works',
    title: 'How useState Works in React (with Examples)',
    description:
      'A clear, practical explanation of the useState hook: how state updates trigger re-renders, why updates are asynchronous, and how to update state correctly.',
    excerpt:
      'State is what makes a React component interactive. Here is exactly how useState works — and the update patterns that save you from subtle bugs.',
    date: '2026-05-12',
    readingMins: 7,
    tags: ['Hooks', 'State', 'Fundamentals'],
  },
  {
    slug: 'useeffect-explained',
    title: 'useEffect Explained: Dependencies, Cleanup, and Pitfalls',
    description:
      'Understand the useEffect hook end to end: when effects run, how the dependency array works, why cleanup matters, and the mistakes that cause infinite loops.',
    excerpt:
      'Effects let your components talk to the outside world. Master the dependency array and cleanup, and most useEffect bugs disappear.',
    date: '2026-05-19',
    readingMins: 9,
    tags: ['Hooks', 'Effects', 'Fundamentals'],
  },
  {
    slug: 'thinking-in-components',
    title: 'Thinking in Components: How to Structure a React App',
    description:
      'How to break a UI into components, decide where state should live, and pass data with props so your React app stays readable as it grows.',
    excerpt:
      'Good React apps are mostly good component boundaries. Here is a practical way to split a UI and decide where state belongs.',
    date: '2026-05-26',
    readingMins: 8,
    tags: ['Components', 'Architecture'],
  },
  {
    slug: 'lists-and-keys',
    title: 'Lists and Keys in React: Why Keys Matter',
    description:
      'Rendering lists in React, why each item needs a stable key, what goes wrong when you use the array index, and how keys affect reconciliation.',
    excerpt:
      'Keys are how React tracks list items across renders. Choose them well and you avoid a whole class of confusing UI bugs.',
    date: '2026-06-02',
    readingMins: 6,
    tags: ['Rendering', 'Lists', 'Fundamentals'],
  },
  {
    slug: 'controlled-vs-uncontrolled-inputs',
    title: 'Controlled vs Uncontrolled Inputs in React',
    description:
      'The difference between controlled and uncontrolled form inputs in React, when to use each, and how to build forms that stay predictable.',
    excerpt:
      'Forms trip up a lot of React developers. Understanding controlled vs uncontrolled inputs makes them simple again.',
    date: '2026-06-06',
    readingMins: 7,
    tags: ['Forms', 'State'],
  },
  {
    slug: 'custom-hooks',
    title: 'Custom Hooks: Reuse Logic the React Way',
    description:
      'How to extract stateful logic into custom hooks, the rules of hooks they must follow, and patterns for building reusable, testable hooks.',
    excerpt:
      'When two components share logic, a custom hook is usually the answer. Here is how to write ones that are clean and reusable.',
    date: '2026-06-11',
    readingMins: 8,
    tags: ['Hooks', 'Patterns'],
  },
  {
    slug: 'react-rerenders',
    title: 'React Re-Renders: When and Why Components Update',
    description:
      'A mental model for React rendering: what triggers a re-render, how re-renders cascade to children, and how to reason about performance.',
    excerpt:
      'Half of React performance is just knowing when a component re-renders. This builds the mental model you need.',
    date: '2026-06-15',
    readingMins: 9,
    tags: ['Rendering', 'Performance'],
  },
  {
    slug: 'usememo-usecallback',
    title: 'useMemo and useCallback: When Memoization Actually Helps',
    description:
      'What useMemo and useCallback really do, when memoization improves performance, and when it just adds complexity for no gain.',
    excerpt:
      'Memoization is often cargo-culted. Here is when useMemo and useCallback genuinely help — and when to skip them.',
    date: '2026-06-18',
    readingMins: 8,
    tags: ['Hooks', 'Performance'],
  },
  {
    slug: 'props-vs-state',
    title: "Props vs State in React: What's the Difference?",
    description:
      'Props and state both hold data, but they do very different jobs. A plain-English guide to which is which, when to use each, and the mistake to avoid.',
    excerpt:
      'Props or state? It is the question every React beginner trips over — and the answer is simpler than it looks once you know what each one is for.',
    date: '2026-06-19',
    readingMins: 6,
    tags: ['Fundamentals', 'Props', 'State'],
  },
  {
    slug: 'conditional-rendering',
    title: 'Conditional Rendering in React: Clean Patterns (and Pitfalls)',
    description:
      'Show, hide, and swap UI based on state using if, ternaries, and the && operator — plus the famous gotcha that renders a stray 0 on your page.',
    excerpt:
      'Most UIs change based on what is happening. Here are the clean ways to render conditionally in React — and the one bug that catches almost everyone.',
    date: '2026-06-20',
    readingMins: 6,
    tags: ['Rendering', 'Patterns'],
  },
  {
    slug: 'fetching-data-in-react',
    title: 'Fetching Data in React with useEffect',
    description:
      'A practical walkthrough of loading data in React: useEffect + fetch, handling loading and error states, avoiding race conditions, and when to use a library.',
    excerpt:
      'Loading data is one of the first real-world things you will do in React. Here is a clean, honest pattern — including the bits quick tutorials skip.',
    date: '2026-06-20',
    readingMins: 8,
    tags: ['Effects', 'Data', 'Patterns'],
  },
];

export const getArticle = (slug) => articles.find((a) => a.slug === slug);

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

// Deterministic date formatting (no locale/timezone dependence) so server-prerendered
// and client-hydrated markup match exactly.
export function formatArticleDate(iso) {
  const [y, m, d] = iso.split('-');
  return `${MONTHS[Number(m) - 1]} ${Number(d)}, ${y}`;
}
