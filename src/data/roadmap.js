// React Library Concepts Roadmap (core react + react-dom only).
// Each level/topic/concept gets a stable id used for localStorage progress.

export const roadmapMeta = {
  title: 'React Library Concepts Roadmap',
  description:
    'Core React only (react + react-dom). Excludes ecosystem tooling such as React Router, Redux/Zustand, TanStack Query, TypeScript, testing libraries, Tailwind, Next.js, and bundlers. These surround React but are not React itself.',
};

const rawLevels = [
  {
    level: 1,
    name: 'Trainee',
    focus: 'React basics',
    accent: '#2d6bff',
    soft: '#eaf0ff',
    topics: [
      {
        name: 'Foundations',
        concepts: [
          'What React is: declarative UI and the component model',
          'JSX: expressions in {}, attributes, single root element, self-closing tags',
          'Rendering the root: createRoot and root.render',
          'StrictMode: what it does and why it double-invokes in development',
        ],
      },
      {
        name: 'Components and data',
        concepts: [
          'Function components and composition',
          'Props: passing, reading, destructuring, and default values',
          'Props are read-only (immutability)',
          'The children prop',
        ],
      },
      {
        name: 'Rendering markup',
        concepts: [
          'Conditional rendering: if, ternary, &&, early return, returning null',
          'Rendering lists with .map()',
          'Keys and why they matter',
          'Fragment and the <>...</> shorthand',
        ],
      },
      {
        name: 'Interactivity',
        concepts: [
          'State with useState; state as a snapshot',
          'Updating state with an updater function',
          'Immutability of objects and arrays in state',
          'Events: onClick, onChange, the event object, passing handlers',
          'Controlled forms: value + onChange and handling submit',
        ],
      },
    ],
  },
  {
    level: 2,
    name: 'Junior',
    focus: 'Hooks and component behavior',
    accent: '#7c4ddb',
    soft: '#f1ebfd',
    topics: [
      {
        name: 'State and rendering, deeper',
        concepts: [
          'useState in depth: functional updates, lazy initialization, multiple states',
          'Mental model: trigger to render to commit (render phases)',
          'How React queues state updates',
        ],
      },
      {
        name: 'Effects',
        concepts: [
          'useEffect: synchronizing with external systems',
          'The dependency array',
          'Cleanup functions and effect timing',
          'Pitfalls: extra or missing dependencies, infinite loops',
          'When you do NOT need an effect (derived state, event handling)',
        ],
      },
      {
        name: 'Refs and the DOM',
        concepts: [
          'useRef: referencing a DOM node',
          'useRef: storing a mutable value without re-rendering',
          'Working with the DOM via a ref and managing focus',
          'forwardRef (and ref-as-prop in React 19)',
        ],
      },
      {
        name: 'State across components',
        concepts: [
          'Lifting state up',
          'useContext and Context: createContext, Provider, consuming',
          'Context vs prop drilling',
          'useReducer: reducer, dispatch, and when it beats useState',
          'Controlled vs uncontrolled components',
          'Resetting component state with key',
        ],
      },
      {
        name: 'Custom hooks',
        concepts: [
          'Extracting logic into use... hooks',
          'Rules of Hooks: top level only, React functions only',
        ],
      },
    ],
  },
  {
    level: 3,
    name: 'Mid',
    focus: 'Performance, patterns, and more hooks',
    accent: '#e8862a',
    soft: '#fff1e2',
    topics: [
      {
        name: 'Re-renders and memoization',
        concepts: [
          'What triggers a re-render (props, state, context)',
          'React.memo',
          'useMemo for memoizing computations',
          'useCallback for memoizing function identity',
          'Referential equality and why it breaks memoization',
        ],
      },
      {
        name: 'More hooks',
        concepts: [
          'useId: stable unique ids (SSR-safe)',
          'useLayoutEffect vs useEffect: the timing difference',
          'useImperativeHandle: customizing what a ref exposes',
          'useDebugValue: labeling custom hooks in DevTools',
        ],
      },
      {
        name: 'Built-in React capabilities',
        concepts: [
          'Error boundaries: getDerivedStateFromError and componentDidCatch',
          'Portals with createPortal (modals, tooltips outside the parent tree)',
          'lazy + Suspense for component-level code splitting',
          'Suspense: fallback UI and what it suspends on',
          'Profiler: measuring render performance',
        ],
      },
      {
        name: 'Component patterns',
        concepts: [
          'Composition over inheritance',
          'Render props',
          'Higher-Order Components (HOC)',
          'Compound components',
          'Provider pattern',
        ],
      },
    ],
  },
  {
    level: 4,
    name: 'Senior',
    focus: 'Internals, concurrency, and modern React',
    accent: '#1ba85a',
    soft: '#e4f7ec',
    topics: [
      {
        name: 'Internals',
        concepts: [
          'Virtual DOM',
          'Reconciliation and the diffing algorithm',
          'Fiber architecture',
          'Render phase vs commit phase (deep)',
          'Bailout: how React skips a re-render',
          'Automatic batching (React 18)',
        ],
      },
      {
        name: 'Concurrent React',
        concepts: [
          'useTransition and startTransition for non-urgent updates',
          'useDeferredValue for deferring a displayed value',
          'How concurrency makes renders interruptible',
        ],
      },
      {
        name: 'Suspense, advanced',
        concepts: [
          'Suspense for data fetching',
          'Streaming SSR via Suspense',
          'Strategy for placing Suspense boundaries',
        ],
      },
      {
        name: 'External state and library-author hooks',
        concepts: [
          'useSyncExternalStore: subscribing to an external store without tearing',
          'useInsertionEffect: injecting styles (CSS-in-JS)',
          'flushSync: forcing a synchronous DOM update',
        ],
      },
      {
        name: 'Server-side React',
        concepts: [
          'SSR and hydration: renderToString, renderToPipeableStream, hydrateRoot',
          'Selective hydration',
          'React Server Components: server vs client components, "use client" and "use server"',
          'The serialization boundary and cache() for server data',
        ],
      },
      {
        name: 'React 19+',
        concepts: [
          'Actions and form actions',
          'useActionState',
          'useFormStatus',
          'useOptimistic',
          'The use() hook for reading a promise or context',
          'ref as a prop (no forwardRef needed)',
          'Document metadata: <title> and <meta> directly in components',
          'Preloading resources: preload, preinit, preconnect',
          '<Context> used directly as a provider',
          'React Compiler: auto-memoization that removes the need for useMemo/useCallback',
          'New and experimental: useEffectEvent, <Activity>',
        ],
      },
      {
        name: 'Legacy (for older codebases)',
        concepts: [
          'Class components: render(), this.state, this.setState',
          'Lifecycle methods: componentDidMount, componentDidUpdate, componentWillUnmount',
          'PureComponent and shouldComponentUpdate',
          'Old refs (string and callback) and legacy context',
          'Why hooks replaced all of these',
        ],
      },
    ],
  },
];

export const levels = rawLevels.map((lvl) => ({
  ...lvl,
  topics: lvl.topics.map((topic, ti) => {
    const topicId = `l${lvl.level}-t${ti}`;
    return {
      ...topic,
      id: topicId,
      concepts: topic.concepts.map((text, ci) => ({
        id: `${topicId}-c${ci}`,
        text,
      })),
    };
  }),
}));

export const allConceptIds = levels.flatMap((l) =>
  l.topics.flatMap((t) => t.concepts.map((c) => c.id))
);

export const totalConcepts = allConceptIds.length;
