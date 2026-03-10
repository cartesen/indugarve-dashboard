import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  base: './',
  plugins: [react()],
})
jsexport default defineConfig({
  plugins: [react()],
  base: '/indugarve-dashboard/',  // ← dein Repository-Name
})