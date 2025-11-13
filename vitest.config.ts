/// <reference types="vitest" />

import { defineConfig } from 'vitest/config';

// Keep vitest config minimal and isolated from vite plugins to avoid
// type conflicts (vite plugins from different copies of vite can clash).
export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/setupTests.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
    },
  },
});