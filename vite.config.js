import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        content: 'src/content/index.jsx',
      },
      output: {
        // 'iife' is the magic word here for Chrome Content Scripts
        format: 'iife', 
        entryFileNames: 'assets/[name].js',
      },
    },
  },
})