import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
// BASE_PATH serves the site from a sub-folder, e.g. '/aeraa-portfolio/' on GitHub Pages
// (set by .github/workflows/deploy.yml). Defaults to the site root.
export default defineConfig({
  base: process.env.BASE_PATH || '/',
  plugins: [react()],
})
