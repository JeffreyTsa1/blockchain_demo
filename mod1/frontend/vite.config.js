import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0', // listen on all interfaces
    port: 5173,       // optional, but consistent with previous
    allowedHosts: ['ec2-13-59-79-136.us-east-2.compute.amazonaws.com'],
  },
})
