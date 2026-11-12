import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    open: false
  },
  test: {
    environment: 'jsdom',
    setupFiles: './src/test/setup.js',
    testTimeout: 15000,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      include: ['src/**/*.{js,jsx}'],
      exclude: ['src/test/**', 'src/main.jsx', '**/*.test.{js,jsx}']
    }
  }
});

