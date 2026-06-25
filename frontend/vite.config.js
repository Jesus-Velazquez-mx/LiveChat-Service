import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Cada vez que React vea '/api', lo mandará a  Node.js
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      }
    }
  }
})