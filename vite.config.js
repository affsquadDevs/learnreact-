import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        // Split the large animation lib into its own long-cached chunk so it
        // doesn't bloat the per-route chunks.
        manualChunks(id) {
          if (/node_modules[\\/](framer-motion|motion|motion-dom|motion-utils)[\\/]/.test(id)) {
            return 'framer-motion';
          }
        },
      },
    },
  },
})
