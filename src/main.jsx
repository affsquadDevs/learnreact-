import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { MotionConfig } from 'framer-motion'
import './index.css'
import App from './App.jsx'

const app = (
  <StrictMode>
    <MotionConfig reducedMotion="user">
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </MotionConfig>
  </StrictMode>
)

const root = document.getElementById('root')
// Prerendered HTML present → hydrate; empty shell (dev) → client render.
if (root.firstChild) {
  hydrateRoot(root, app)
} else {
  createRoot(root).render(app)
}
