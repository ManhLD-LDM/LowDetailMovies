import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // Cho phép truy cập từ external hosts (port forwarding)
    port: 3000,
    allowedHosts: [
      '.ngrok-free.dev',
      '.ngrok-free.app', 
      '.ngrok.io',
      '.loca.lt',
      '.trycloudflare.com',
      '.devtunnels.ms',
      'ldmovies.mydrpet.io.vn',
      '.mydrpet.io.vn'
    ],
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false
      }
    }
  }
})
