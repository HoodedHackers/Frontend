import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    include: ['./src/Tests/*.test.jsx'],
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/Tests/setupTests.js',
    css: true,
  },
})
