import react from '@vitejs/plugin-react'
import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  // Published to https://shoqqan.github.io/kbtu-react-course/week-4/
  base: '/kbtu-react-course/week-4/',
  resolve: {
    // Keep these in sync with "paths" in tsconfig.app.json.
    alias: {
      '@app': fileURLToPath(new URL('./src/app', import.meta.url)),
      '@widgets': fileURLToPath(new URL('./src/widgets', import.meta.url)),
      '@features': fileURLToPath(new URL('./src/features', import.meta.url)),
      '@entities': fileURLToPath(new URL('./src/entities', import.meta.url)),
      '@shared': fileURLToPath(new URL('./src/shared', import.meta.url)),
    },
  },
  // No React Compiler on purpose: we want plain React re-render behaviour
  // so the console.log traces show exactly what the defense talks about.
  plugins: [react()],
})
