import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  // The site is published to https://shoqqan.github.io/kbtu-react-course/
  base: '/kbtu-react-course/',
  plugins: [
    react(),
    babel({ presets: [reactCompilerPreset()] })
  ],
})
