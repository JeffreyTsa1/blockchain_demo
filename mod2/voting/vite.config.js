import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0', // allow external access
    port: 5173,
    allowedHosts: ['ec2-52-15-98-51.us-east-2.compute.amazonaws.com'],
  },
})
