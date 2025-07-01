import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import { visualizer } from 'rollup-plugin-visualizer';


export default defineConfig({
  plugins: [react(), visualizer({ open: true })],
  resolve: {
    alias: {
      '@': '/src',
    },
  },
  build: {
    sourcemap: true,
  },
  test: {
    globals: true,
    environment: 'jsdom',
    include: ['src/**/*.test.ts?(x)'],
  },
});
