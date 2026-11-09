import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import Sitemap from 'vite-plugin-sitemap'; // 1. Import the sitemap plugin

// three.js is large; keep it in its own chunk so the site shell can paint first.
export default defineConfig({
  plugins: [
    react(),
    // 2. Add the Sitemap plugin with your production URL
    Sitemap({ hostname: 'https://www.mindstor.in' }) 
  ],
  build: {
    rollupOptions: {
      output: { manualChunks: { three: ['three'] } },
    },
    chunkSizeWarningLimit: 800,
  },
  test: { environment: 'node', include: ['src/**/*.test.ts'] },
});