import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'node:path'

// base: './' makes the build portable — it works on GitHub Pages under any
// repository sub-path, on a custom domain, and from the local filesystem.
// Combined with HashRouter, no server-side SPA rewrite rules are needed.
export default defineConfig({
  base: './',
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    chunkSizeWarningLimit: 1200,
    rollupOptions: {
      output: {
        // Charting is the single heaviest dependency and is only needed on
        // profile/detail views — splitting it keeps the landing page light.
        manualChunks: {
          react: ['react', 'react-dom', 'react-router-dom'],
          charts: ['recharts'],
        },
      },
    },
  },
})
