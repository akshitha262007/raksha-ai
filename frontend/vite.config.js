import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Vite configuration with backend proxy mapping & SPA fallback
export default defineConfig({
  appType: 'spa',
  plugins: [react()],
  server: {
    host: true, // Binds to 0.0.0.0 for all IPv4 and IPv6 interfaces
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:8000',
        changeOrigin: true,
        secure: false
      }
    }
  }
})
