import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    // Target modern browsers only - eliminates legacy JS polyfills
    target: ['chrome90', 'firefox90', 'safari14', 'edge90'],
    minify: 'terser',
    cssMinify: true,
    rollupOptions: {
      output: {
        manualChunks(id) {
          // React core - cached forever
          if (id.includes('node_modules/react-dom') || id.includes('node_modules/react/')) {
            return 'react';
          }
          // Shared page utilities
          if (id.includes('src/pages/shared')) {
            return 'shared';
          }
          // Font files
          if (id.includes('@fontsource')) {
            return 'fonts';
          }
          // Heavy pages get their own chunks
          if (id.includes('src/pages/Portal')) return 'page-portal';
          if (id.includes('src/pages/Compare')) return 'page-compare';
          if (id.includes('src/pages/Profile')) return 'page-profile';
          if (id.includes('src/pages/Legal') || id.includes('src/pages/LegalHub')) return 'page-legal';
          if (id.includes('src/pages/')) return 'page-other';
        },
        entryFileNames:  'assets/[name]-[hash].js',
        chunkFileNames:  'assets/[name]-[hash].js',
        assetFileNames:  'assets/[name]-[hash][extname]',
      },
    },
    chunkSizeWarningLimit: 600,
  },
})
