import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { componentTagger } from 'lovable-tagger'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [react(), mode === 'development' && componentTagger()].filter(Boolean),
  server: {
    host: '::',
    port: 8080
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          supabase: ['@supabase/supabase-js'],
          ui: ['lucide-react'],
          router: ['react-router-dom']
        }
      }
    },
    chunkSizeWarningLimit: 1000
  }
}))