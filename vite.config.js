import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 8082,
    proxy: {
      '/api': {
        target: 'http://localhost:3000/' //, secure: false, rewrite: (path) => path.replace(/^\/api/, ''),
      },
    }
  }
})
