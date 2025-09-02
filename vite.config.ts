import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig(() => ({
  plugins: [react()],
  server: {
    host: '0.0.0.0',  // Listen on all interfaces
    port: 8080,
    strictPort: false,
    open: false,
    cors: true
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // Core vendor libraries
          if (id.includes('node_modules/react') || 
              id.includes('node_modules/react-dom')) {
            return 'vendor-react';
          }
          
          // Three.js and 3D libraries (large)
          if (id.includes('three') || 
              id.includes('@react-three')) {
            return 'vendor-3d';
          }
          
          // Supabase and backend
          if (id.includes('@supabase')) {
            return 'vendor-supabase';
          }
          
          // UI libraries
          if (id.includes('lucide-react') || 
              id.includes('tailwind')) {
            return 'vendor-ui';
          }
          
          // Router
          if (id.includes('react-router-dom')) {
            return 'vendor-router';
          }
          
          // Validation libraries
          if (id.includes('zod')) {
            return 'vendor-validation';
          }
          
          // AI components (separate chunk)
          if (id.includes('/components/AI') || 
              id.includes('/components/Innovation') ||
              id.includes('/components/Citation3D') ||
              id.includes('/components/Blockchain')) {
            return 'features-ai';
          }
          
          // Network features
          if (id.includes('/components/Network') || 
              id.includes('/components/Chat') ||
              id.includes('/components/Contact')) {
            return 'features-network';
          }
          
          // CMS features
          if (id.includes('/components/CMS') || 
              id.includes('/components/Studio')) {
            return 'features-cms';
          }
        }
      }
    },
    chunkSizeWarningLimit: 500, // Reduced from 1000
    sourcemap: false, // Disable sourcemaps in production for smaller builds
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true, // Remove console logs in production
        drop_debugger: true
      }
    }
  }
}))