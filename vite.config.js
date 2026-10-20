import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Set base to '/portofolioMIKI/' for GitHub Pages deployment
// Change to '/' if deploying to Netlify/Vercel root
export default defineConfig({
  plugins: [react()],
  base: '/portofolioMIKI/',
})
