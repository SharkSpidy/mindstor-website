import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

// three.js is large; keep it in its own chunk so the site shell can paint first.
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: { manualChunks: { three: ['three'] } },
    },
    chunkSizeWarningLimit: 800,
  },
  test: { environment: 'node', include: ['src/**/*.test.ts'] },
});
