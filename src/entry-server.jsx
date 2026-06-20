import { StrictMode } from 'react'
import { renderToString } from 'react-dom/server'
import { StaticRouter } from 'react-router'
import { MotionConfig } from 'framer-motion'
import App from './App.jsx'

// Rendered at build time by prerender.mjs for each route.
// reducedMotion="user" matches the client entry so server/client initial markup
// is identical (no hydration mismatch); the entrance animations play after hydrate.
export function render(url) {
  return renderToString(
    <StrictMode>
      <MotionConfig reducedMotion="user">
        <StaticRouter location={url}>
          <App />
        </StaticRouter>
      </MotionConfig>
    </StrictMode>
  )
}
