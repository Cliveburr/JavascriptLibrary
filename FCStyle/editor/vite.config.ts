import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': '/src'
    }
  },
  css: {
    preprocessorOptions: {
      scss: {
        // Remover o additionalData para evitar conflitos com @use/@import
        // O import será feito manualmente no arquivo SCSS
      }
    }
  }
})
