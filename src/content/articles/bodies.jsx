/* eslint-disable react-refresh/only-export-components -- content registry: this module
   intentionally exports a keyed map of article body components, not a single component. */
// Article bodies, keyed by slug. Rendered inside PageShell on /blog/:slug.
// Metadata (title, description, date, etc.) lives in ./manifest.js.
import { Link } from 'react-router-dom';

function HowUseStateWorks() {
  return (
    <>
      <p>
        State is the data a component remembers between renders. In React function components, you
        add state with the <code>useState</code> hook. It looks simple — and it is — but a few details
        about <em>how</em> it works prevent most beginner bugs. (Not sure whether a value belongs in
        state at all? See <Link to="/blog/props-vs-state">props vs state</Link>.)
      </p>

      <h2>The basics</h2>
      <p>
        <code>useState</code> returns a pair: the current value and a function to update it. You
        typically destructure them:
      </p>
      <pre>{`import { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);

  return (
    <button onClick={() => setCount(count + 1)}>
      Clicked {count} times
    </button>
  );
}`}</pre>
      <p>
        The argument to <code>useState</code> (<code>0</code> here) is the <strong>initial</strong>{' '}
        value — it's only used on the first render. After that, React keeps track of the latest value
        for you.
      </p>

      <h2>Updating state triggers a re-render</h2>
      <p>
        Calling <code>setCount</code> does two things: it stores the new value, and it tells React to
        re-render the component. During the next render, <code>useState</code> hands you the updated
        value. This is the core loop of React: state changes in, new UI out.
      </p>
      <p>
        Crucially, you never mutate the variable directly (<code>count = count + 1</code> does
        nothing useful). You always call the setter so React knows something changed.
      </p>

      <h2>Updates are batched and "asynchronous"</h2>
      <p>
        The state variable does not change immediately after you call the setter. It updates on the
        next render. This trips people up:
      </p>
      <pre>{`function handleClick() {
  setCount(count + 1);
  setCount(count + 1);
  // count only increases by 1 — both calls read the same stale "count"
}`}</pre>
      <p>
        When the new value depends on the previous one, use the <strong>updater function</strong> form
        instead. React passes you the most recent value:
      </p>
      <pre>{`function handleClick() {
  setCount(prev => prev + 1);
  setCount(prev => prev + 1);
  // now count increases by 2
}`}</pre>

      <h2>Updating objects and arrays</h2>
      <p>
        React compares state by reference, so you must create a new object or array rather than
        mutating the existing one:
      </p>
      <pre>{`// wrong — mutates the same object, React may not re-render
user.name = 'Ada';
setUser(user);

// right — new object
setUser({ ...user, name: 'Ada' });`}</pre>

      <h2>Expensive initial values</h2>
      <p>
        If computing the initial value is costly, pass a function. React calls it only once instead of
        on every render:
      </p>
      <pre>{`const [data, setData] = useState(() => expensiveInit());`}</pre>

      <h2>Key takeaways</h2>
      <ul>
        <li>The argument to <code>useState</code> is only the initial value.</li>
        <li>Always update via the setter; never mutate state directly.</li>
        <li>Use the <code>prev =&gt;</code> updater form when the new value depends on the old one.</li>
        <li>Create new objects/arrays instead of mutating them.</li>
      </ul>
    </>
  );
}

function UseEffectExplained() {
  return (
    <>
      <p>
        <code>useEffect</code> lets a component synchronise with something outside React — a network
        request, a subscription, a timer, the document title. It's one of the most useful hooks and
        one of the most misused. Here's a mental model that makes it predictable. (Its most common
        job — loading data — has its own guide:{' '}
        <Link to="/blog/fetching-data-in-react">fetching data in React</Link>.)
      </p>

      <h2>What an effect is</h2>
      <p>
        An effect runs <em>after</em> React has rendered and committed to the DOM. Think of it as
        "after the screen updates, also do this." That's why effects are the right place for side
        effects, not the render body.
      </p>
      <pre>{`import { useEffect, useState } from 'react';

function Title() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    document.title = 'Clicked ' + count + ' times';
  }, [count]);

  return <button onClick={() => setCount(count + 1)}>+1</button>;
}`}</pre>

      <h2>The dependency array controls when it runs</h2>
      <ul>
        <li><strong>No array</strong> — the effect runs after every render.</li>
        <li><strong>Empty array <code>[]</code></strong> — runs once, after the first render.</li>
        <li><strong>With values <code>[a, b]</code></strong> — runs after the first render and any
          render where <code>a</code> or <code>b</code> changed.</li>
      </ul>
      <p>
        The rule of thumb: every value from the component that the effect uses should be in the array.
        Leaving things out causes stale values; this is the source of most "why isn't my effect
        updating?" questions.
      </p>

      <h2>Cleanup</h2>
      <p>
        If your effect starts something ongoing, return a cleanup function. React runs it before the
        effect runs again and when the component unmounts. This prevents leaks and duplicate
        subscriptions:
      </p>
      <pre>{`useEffect(() => {
  const id = setInterval(tick, 1000);
  return () => clearInterval(id); // cleanup
}, []);`}</pre>

      <h2>The classic infinite loop</h2>
      <p>
        Setting state inside an effect that also depends on that state re-triggers itself forever:
      </p>
      <pre>{`// runs, sets count, which re-runs the effect, which sets count...
useEffect(() => {
  setCount(count + 1);
}, [count]);`}</pre>
      <p>
        Fix it by removing the dependency, moving the logic into an event handler, or guarding the
        update. In general, if something can be computed during render or handled in an event, it
        probably doesn't belong in an effect at all.
      </p>

      <h2>Key takeaways</h2>
      <ul>
        <li>Effects run after render — use them to sync with the outside world.</li>
        <li>List every reactive value the effect reads in the dependency array.</li>
        <li>Return a cleanup function for subscriptions, timers, and listeners.</li>
        <li>Prefer event handlers over effects when reacting to user actions.</li>
      </ul>
    </>
  );
}

function ThinkingInComponents() {
  return (
    <>
      <p>
        A React app is a tree of components. The hardest part isn't the syntax — it's deciding{' '}
        <em>where the boundaries go</em> and <em>where state lives</em>. Get those right and your app
        stays readable as it grows.
      </p>

      <h2>Split the UI into components</h2>
      <p>
        Start from the design and draw boxes around pieces that represent one thing: a search bar, a
        product row, a price tag. A good component does one job and has a name that describes it. If a
        component is doing three jobs, that's three components.
      </p>
      <pre>{`function ProductPage() {
  return (
    <>
      <SearchBar />
      <ProductTable />
    </>
  );
}`}</pre>

      <h2>Props flow down</h2>
      <p>
        Components receive data through props — read-only inputs passed from the parent. A child
        should never change its own props; it renders based on them. This one-way flow makes data easy
        to trace: to find where a value comes from, you look up the tree. (New to the props/state
        distinction? <Link to="/blog/props-vs-state">Props vs state</Link> covers it.)
      </p>
      <pre>{`function ProductRow({ name, price }) {
  return <tr><td>{name}</td><td>{price}</td></tr>;
}`}</pre>

      <h2>Decide where state lives</h2>
      <p>
        For each piece of state, ask: which components depend on it? Put the state in their closest
        common parent. If only one component needs it, keep it local. If two siblings need it, "lift"
        it to their parent and pass it down as props. This is called lifting state up.
      </p>
      <pre>{`function FilterableList() {
  const [query, setQuery] = useState('');
  return (
    <>
      <SearchBar query={query} onChange={setQuery} />
      <List query={query} />
    </>
  );
}`}</pre>

      <h2>Avoid premature abstraction</h2>
      <p>
        Don't split a component into ten tiny ones before you need to. Build it, let it grow a little,
        and extract a component when a clear, reusable piece emerges. The same applies to "shared"
        components — duplication is cheaper than the wrong abstraction.
      </p>

      <h2>Key takeaways</h2>
      <ul>
        <li>One component, one responsibility, one clear name.</li>
        <li>Data flows down through props; children never mutate props.</li>
        <li>Put state in the closest common parent of the components that use it.</li>
        <li>Extract components when a reusable piece is obvious — not before.</li>
      </ul>
    </>
  );
}

function ListsAndKeys() {
  return (
    <>
      <p>
        Rendering a list in React means mapping an array to elements. It's a one-liner — but the{' '}
        <code>key</code> prop React asks for is more important than it looks. (Showing a list only
        sometimes? Pair this with <Link to="/blog/conditional-rendering">conditional rendering</Link>.)
      </p>

      <h2>Rendering a list</h2>
      <pre>{`function TodoList({ todos }) {
  return (
    <ul>
      {todos.map(todo => (
        <li key={todo.id}>{todo.text}</li>
      ))}
    </ul>
  );
}`}</pre>

      <h2>Why keys exist</h2>
      <p>
        When the list changes, React needs to figure out which items were added, removed, or
        reordered so it can update the DOM efficiently. The <code>key</code> is the stable identity
        React uses to match an item across renders. Without good keys, React can update the wrong DOM
        nodes — losing input focus, mixing up component state, or re-rendering more than necessary.
      </p>

      <h2>Don't use the array index</h2>
      <p>
        It's tempting to write <code>key=&#123;index&#125;</code>, and it works until the list
        reorders or items are inserted/removed. Then the index no longer points to the same logical
        item, and React reuses the wrong element. Use a stable id from your data instead:
      </p>
      <pre>{`// risky if the list can change order or length
{items.map((item, index) => <Row key={index} ... />)}

// stable
{items.map(item => <Row key={item.id} ... />)}`}</pre>

      <h2>Rules for keys</h2>
      <ul>
        <li>Keys must be <strong>unique among siblings</strong> (not globally).</li>
        <li>Keys should be <strong>stable</strong> — the same item gets the same key every render.</li>
        <li>Keys go on the element returned directly by <code>map</code>, not on a child inside it.</li>
        <li>Keys are a hint for React; they aren't passed to your component as a prop.</li>
      </ul>

      <h2>Key takeaways</h2>
      <ul>
        <li>Keys give list items a stable identity across renders.</li>
        <li>Prefer a real id; avoid the array index for dynamic lists.</li>
        <li>Bad keys cause subtle bugs with focus and component state.</li>
      </ul>
    </>
  );
}

function ControlledVsUncontrolled() {
  return (
    <>
      <p>
        React forms confuse a lot of people, and it usually comes down to one distinction: is the
        input <strong>controlled</strong> or <strong>uncontrolled</strong>? Once that clicks, forms
        get simple.
      </p>

      <h2>Controlled inputs</h2>
      <p>
        A controlled input's value comes from React state. You set <code>value</code> and update state
        in <code>onChange</code>. React is the single source of truth:
      </p>
      <pre>{`function NameField() {
  const [name, setName] = useState('');
  return (
    <input
      value={name}
      onChange={e => setName(e.target.value)}
    />
  );
}`}</pre>
      <p>
        Because the value lives in state, you can validate as the user types, format input, disable a
        submit button, or reset the field — all with normal React code.
      </p>

      <h2>Uncontrolled inputs</h2>
      <p>
        An uncontrolled input keeps its own value in the DOM, like a plain HTML form. You read it when
        you need it, usually with a ref:
      </p>
      <pre>{`function NameField() {
  const inputRef = useRef(null);
  function handleSubmit() {
    console.log(inputRef.current.value);
  }
  return <input ref={inputRef} defaultValue="" />;
}`}</pre>
      <p>
        Note <code>defaultValue</code> instead of <code>value</code> — it sets the initial value
        without taking control of it.
      </p>

      <h2>Which should you use?</h2>
      <ul>
        <li><strong>Controlled</strong> — the default choice. Use it when you need live validation,
          conditional UI, or to transform the value as it changes.</li>
        <li><strong>Uncontrolled</strong> — fine for simple forms where you only read values on
          submit, or when integrating non-React widgets. It's also handy for file inputs, which are
          always uncontrolled.</li>
      </ul>

      <h2>Key takeaways</h2>
      <ul>
        <li>Controlled = value in React state (<code>value</code> + <code>onChange</code>).</li>
        <li>Uncontrolled = value in the DOM (<code>defaultValue</code> + a ref).</li>
        <li>Reach for controlled inputs by default; uncontrolled for simple or non-React cases.</li>
      </ul>
    </>
  );
}

function CustomHooks() {
  return (
    <>
      <p>
        When two components need the same stateful logic, copying it around gets messy fast. A{' '}
        <strong>custom hook</strong> is React's built-in way to extract and reuse that logic — no new
        library, no special API.
      </p>

      <h2>A custom hook is just a function</h2>
      <p>
        It's a function whose name starts with <code>use</code> and that calls other hooks. Here's one
        that tracks a value in <code>localStorage</code>:
      </p>
      <pre>{`function useLocalStorage(key, initial) {
  const [value, setValue] = useState(() => {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : initial;
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue];
}`}</pre>
      <p>Now any component can use it like a built-in hook:</p>
      <pre>{`function Settings() {
  const [theme, setTheme] = useLocalStorage('theme', 'light');
  return <button onClick={() => setTheme('dark')}>{theme}</button>;
}`}</pre>

      <h2>Hooks share logic, not state</h2>
      <p>
        A common misconception: two components using the same custom hook do <em>not</em> share state.
        Each call gets its own independent state. The hook shares the <em>behaviour</em>, not the data.
        If you need shared data, lift it up or use context.
      </p>

      <h2>Follow the rules of hooks</h2>
      <ul>
        <li>Only call hooks at the top level — never inside loops, conditions, or nested functions.</li>
        <li>Only call hooks from React components or other hooks.</li>
        <li>Start the name with <code>use</code> so the linter can check those rules.</li>
      </ul>

      <h2>When to extract one</h2>
      <p>
        Extract a hook when you notice the same <code>useState</code> + <code>useEffect</code> pattern
        in more than one place, or when a component's logic is large enough that naming a piece of it
        improves readability — for example <code>useFetch</code>, <code>useDebounce</code>, or{' '}
        <code>useMediaQuery</code>.
      </p>

      <h2>Key takeaways</h2>
      <ul>
        <li>A custom hook is a <code>use</code>-prefixed function that calls other hooks.</li>
        <li>It reuses logic; each component still gets its own state.</li>
        <li>Follow the rules of hooks so React can track them correctly.</li>
      </ul>
    </>
  );
}

function ReactRerenders() {
  return (
    <>
      <p>
        "Why did my component re-render?" is one of the most common React questions. A solid mental
        model makes the answer obvious and makes performance work far less mysterious.
      </p>

      <h2>What triggers a re-render</h2>
      <p>A component re-renders when:</p>
      <ul>
        <li>its <strong>state</strong> changes (a setter is called),</li>
        <li>its <strong>parent</strong> re-renders, or</li>
        <li>a <strong>context</strong> it consumes changes.</li>
      </ul>
      <p>
        That second one surprises people: by default, when a component re-renders, <em>all</em> of its
        children re-render too — whether or not their props changed.
      </p>

      <h2>Re-render does not mean DOM update</h2>
      <p>
        "Re-render" means React calls your component function again to compute the new UI. It then
        compares the result to the previous one and only touches the real DOM where something actually
        changed. So a re-render is usually cheap — the expensive part is touching the DOM, which React
        minimises for you.
      </p>

      <h2>Keeping re-renders from cascading</h2>
      <p>
        Most apps never need optimisation. When a re-render is genuinely expensive, you have options:
      </p>
      <pre>{`// Skip re-rendering when props are unchanged
const Row = React.memo(function Row({ item }) {
  return <li>{item.name}</li>;
});`}</pre>
      <p>
        <code>React.memo</code> lets a component skip re-rendering if its props are the same as last
        time. For it to help, the props must actually be stable — which is where{' '}
        <code>useMemo</code> and <code>useCallback</code> come in for objects and functions.
      </p>

      <h2>Structure beats memoization</h2>
      <p>
        Often the cleanest fix is moving state down (so fewer components depend on it) or passing
        children through as a prop so they aren't re-created. Reach for structural fixes before
        sprinkling memoization everywhere.
      </p>

      <h2>Key takeaways</h2>
      <ul>
        <li>State change, parent re-render, or context change cause re-renders.</li>
        <li>Children re-render with their parent by default.</li>
        <li>Re-rendering is cheap; DOM updates are what React minimises.</li>
        <li>Fix expensive trees with structure first, memoization second.</li>
      </ul>
    </>
  );
}

function UseMemoUseCallback() {
  return (
    <>
      <p>
        <code>useMemo</code> and <code>useCallback</code> are caching tools. They can speed up a slow
        component — or just add noise to a fast one. Knowing the difference keeps your code both fast
        and readable.
      </p>

      <h2>What they do</h2>
      <p>
        <code>useMemo</code> caches a computed <em>value</em>; <code>useCallback</code> caches a{' '}
        <em>function</em>. Both recompute only when their dependencies change:
      </p>
      <pre>{`const sorted = useMemo(
  () => items.slice().sort(compare),
  [items]
);

const handleClick = useCallback(
  () => doSomething(id),
  [id]
);`}</pre>
      <p>
        (<code>useCallback(fn, deps)</code> is just <code>useMemo(() =&gt; fn, deps)</code> with nicer
        ergonomics.)
      </p>

      <h2>When memoization helps</h2>
      <ul>
        <li>The calculation is genuinely expensive (sorting/filtering large lists, heavy math).</li>
        <li>You pass an object or function to a <code>React.memo</code> child and need its reference
          to stay stable so the child can skip re-rendering.</li>
        <li>A value is a dependency of another hook (like <code>useEffect</code>) and you need it to
          stay referentially stable.</li>
      </ul>

      <h2>When to skip it</h2>
      <p>
        For cheap calculations, memoization can cost more than it saves: it adds a dependency array to
        maintain, a cache to store, and code to read. Wrapping every value "just in case" is a common
        anti-pattern. Measure first — most components are fast enough without it.
      </p>
      <pre>{`// Pointless — the work is trivial
const doubled = useMemo(() => count * 2, [count]);

// Just write:
const doubled = count * 2;`}</pre>

      <h2>Key takeaways</h2>
      <ul>
        <li><code>useMemo</code> caches a value; <code>useCallback</code> caches a function.</li>
        <li>Use them for expensive work or to keep references stable for memoized children/effects.</li>
        <li>Don't memoize trivial values — it adds complexity without benefit.</li>
        <li>Profile before optimising; correctness and readability come first.</li>
      </ul>
    </>
  );
}

function PropsVsState() {
  return (
    <>
      <p>
        If you're new to React, "props vs state" is probably the first thing that genuinely trips you
        up. The good news: the difference is simple once it clicks, and almost every confusing bug in
        this area comes from blurring the line between the two.
      </p>

      <h2>Props: data passed in</h2>
      <p>
        Props are the values a component receives from its parent. Think of them like arguments to a
        function — the component reads them, but it never changes them. They flow <em>down</em> the
        tree, from parent to child.
      </p>
      <pre>{`function Greeting({ name }) {
  return <h1>Hi, {name}!</h1>;
}

// the parent decides what "name" is
<Greeting name="Ada" />`}</pre>
      <p>
        Because props are read-only, a component can't reach up and change what its parent handed it.
        That one-way flow is exactly what makes React apps easy to follow — there's more on it in{' '}
        <Link to="/blog/thinking-in-components">thinking in components</Link>.
      </p>

      <h2>State: data the component owns</h2>
      <p>
        State is data a component creates and controls itself — and, crucially, can change over time.
        When state changes, the component re-renders. You add it with <code>useState</code>:
      </p>
      <pre>{`function Counter() {
  const [count, setCount] = useState(0);
  return <button onClick={() => setCount(count + 1)}>{count}</button>;
}`}</pre>
      <p>
        Here <code>count</code> belongs to <code>Counter</code> — nobody passed it in. For the full
        picture of how those updates actually work, see{' '}
        <Link to="/blog/how-usestate-works">how useState works</Link>.
      </p>

      <h2>A rule of thumb</h2>
      <ul>
        <li>Will the value change while the component is on screen? If not, it's probably a prop (or
          just a constant).</li>
        <li>Does the component itself need to change it in response to an event? That's state.</li>
        <li>Do several components need the same value? Lift the state to their closest shared parent
          and pass it down as props.</li>
      </ul>

      <h2>The classic mistake: copying props into state</h2>
      <p>It's tempting to take a prop and stash it in state "so I can use it":</p>
      <pre>{`// usually wrong — now there are two sources of truth
function Profile({ user }) {
  const [name, setName] = useState(user.name);
  // if the parent later changes user.name, this copy won't notice
}`}</pre>
      <p>
        Now you have two copies of the same data that can drift apart. Unless you specifically want a
        local, editable draft — like a form field, which is its own topic in{' '}
        <Link to="/blog/controlled-vs-uncontrolled-inputs">controlled vs uncontrolled inputs</Link> —
        just read the prop directly. And remember: changing state re-renders the component, which is
        worth understanding in <Link to="/blog/react-rerenders">when and why components update</Link>.
      </p>

      <h2>Key takeaways</h2>
      <ul>
        <li>Props are passed in and read-only; state is owned and changeable.</li>
        <li>Changing state re-renders the component; you can't change props.</li>
        <li>Don't copy props into state unless you truly need a separate local value.</li>
      </ul>
    </>
  );
}

function ConditionalRendering() {
  return (
    <>
      <p>
        Real interfaces are full of "if this, then show that" — a spinner while data loads, an error
        message when something breaks, a different button when you're logged in. React has no special
        template syntax for this; you just use plain JavaScript. Here are the patterns worth knowing,
        and the one gotcha that catches almost everyone.
      </p>

      <h2>Return early with an if</h2>
      <p>
        When a whole component should render something completely different, an early{' '}
        <code>return</code> is the cleanest option:
      </p>
      <pre>{`function Profile({ user }) {
  if (!user) {
    return <p>Please log in.</p>;
  }
  return <h1>Welcome back, {user.name}</h1>;
}`}</pre>

      <h2>Ternaries for either/or</h2>
      <p>
        You can't use <code>if</code> inside JSX, but you can use a ternary. It's perfect for "show A
        or B":
      </p>
      <pre>{`<button>{loading ? 'Saving…' : 'Save'}</button>`}</pre>

      <h2>&& for "show it, or show nothing"</h2>
      <p>
        To render something only when a condition is true, <code>&&</code> reads nicely:
      </p>
      <pre>{`{error && <p className="error">{error}</p>}`}</pre>

      <h2>The famous 0 gotcha</h2>
      <p>
        Here's the bug everyone hits eventually. With <code>&&</code>, if the left side is the number{' '}
        <code>0</code>, React prints <code>0</code> on the page instead of rendering nothing:
      </p>
      <pre>{`// if items.length is 0, this shows "0" on screen!
{items.length && <List items={items} />}

// fix: give && a real boolean
{items.length > 0 && <List items={items} />}`}</pre>
      <p>
        The rule: only put genuine booleans on the left of <code>&&</code>. A length or a count is a
        number, and a <code>0</code> will happily leak onto the page.
      </p>

      <h2>Choosing between them</h2>
      <ul>
        <li>Whole-component branches → early <code>return</code>.</li>
        <li>Either/or inside JSX → ternary.</li>
        <li>Show-or-nothing → <code>&&</code> (with a real boolean).</li>
      </ul>
      <p>
        Conditional rendering shows up constantly alongside lists — for example, showing an "empty"
        message when there's nothing to map over, so it's worth reading{' '}
        <Link to="/blog/lists-and-keys">lists and keys</Link> too. And if you're unsure where the
        condition's data should live, <Link to="/blog/props-vs-state">props vs state</Link> has the
        answer.
      </p>

      <h2>Key takeaways</h2>
      <ul>
        <li>It's just JavaScript: <code>if</code>, the ternary, and <code>&&</code>.</li>
        <li>Early <code>return</code> for whole-component branches; ternary for either/or.</li>
        <li>Guard <code>&&</code> with a real boolean so a <code>0</code> doesn't render.</li>
      </ul>
    </>
  );
}

function FetchingData() {
  return (
    <>
      <p>
        Sooner or later your app needs data from somewhere — a list of posts, a user profile, search
        results. In React, the basic tool for this is <code>useEffect</code> plus the browser's{' '}
        <code>fetch</code>. The happy path is short; the honest version handles a few things the quick
        tutorials skip.
      </p>

      <h2>The basic pattern</h2>
      <p>
        Fetch inside an effect so it runs after render, and keep three pieces of state: the data, a
        loading flag, and any error.
      </p>
      <pre>{`function User({ id }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    fetch('/api/users/' + id)
      .then(res => res.json())
      .then(data => setUser(data))
      .catch(err => setError(err))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <p>Loading…</p>;
  if (error) return <p>Something went wrong.</p>;
  return <h1>{user.name}</h1>;
}`}</pre>
      <p>
        Those three states are exactly what your UI needs to decide what to show. Rendering one of
        three outcomes is a job for{' '}
        <Link to="/blog/conditional-rendering">conditional rendering</Link>.
      </p>

      <h2>Why <code>id</code> is in the dependency array</h2>
      <p>
        The effect lists <code>[id]</code> as its dependency, so it re-fetches whenever{' '}
        <code>id</code> changes. Forgetting this is a classic bug — the data loads once and never
        updates when the prop changes. If the dependency array still feels fuzzy, the{' '}
        <Link to="/blog/useeffect-explained">useEffect guide</Link> breaks it down.
      </p>

      <h2>The race condition nobody mentions</h2>
      <p>
        If <code>id</code> changes quickly, two requests can be in flight at once — and the slower one
        might resolve last and overwrite the newer data. Guard against it with a cleanup flag:
      </p>
      <pre>{`useEffect(() => {
  let active = true;
  fetch('/api/users/' + id)
    .then(res => res.json())
    .then(data => {
      if (active) setUser(data);
    });
  return () => {
    active = false; // ignore a stale request's result
  };
}, [id]);`}</pre>

      <h2>When to reach for a library</h2>
      <p>
        Once you need caching, refetching, or the same data in several components, hand-rolled effects
        get repetitive fast. That's the moment to consider a data library like TanStack Query or SWR —
        or, at the very least, to wrap your fetch logic in a reusable{' '}
        <Link to="/blog/custom-hooks">custom hook</Link> such as <code>useUser(id)</code>.
      </p>

      <h2>Key takeaways</h2>
      <ul>
        <li>Track three things: the data, a loading flag, and an error.</li>
        <li>Put every value the request depends on (like <code>id</code>) in the dependency array.</li>
        <li>Use a cleanup flag to ignore stale responses and dodge race conditions.</li>
        <li>Reach for a data library once you need caching and refetching.</li>
      </ul>
    </>
  );
}

export const bodies = {
  'how-usestate-works': HowUseStateWorks,
  'useeffect-explained': UseEffectExplained,
  'thinking-in-components': ThinkingInComponents,
  'lists-and-keys': ListsAndKeys,
  'controlled-vs-uncontrolled-inputs': ControlledVsUncontrolled,
  'custom-hooks': CustomHooks,
  'react-rerenders': ReactRerenders,
  'usememo-usecallback': UseMemoUseCallback,
  'props-vs-state': PropsVsState,
  'conditional-rendering': ConditionalRendering,
  'fetching-data-in-react': FetchingData,
};
