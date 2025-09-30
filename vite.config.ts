
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // IMPORTANT: set base to '/ipss-self-check/' for GitHub Pages
  base: '/ipss-self-check/'
})
