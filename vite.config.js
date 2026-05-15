import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    // Increase chunk size warning limit
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        // Manual chunk splitting for optimal caching
        manualChunks: {
          // React core — cached separately, changes rarely
          'react-vendor': ['react', 'react-dom'],
          // Router — separate chunk
          'router-vendor': ['react-router-dom'],
          // Firebase — heavy, changes rarely
          'firebase-vendor': ['firebase/app', 'firebase/auth', 'firebase/firestore'],
          // Helmet — separate utility chunk
          'helmet-vendor': ['react-helmet-async'],
          // Framer Motion — animation library
          'framer-motion-vendor': ['framer-motion'],
        },
      },
    },
    // Enable minification
    minify: 'esbuild',
    // Generate source maps only in dev
    sourcemap: false,
    // CSS code splitting — each route gets only its CSS
    cssCodeSplit: true,
  },
  // Optimize dev server
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom'],
  },
})
