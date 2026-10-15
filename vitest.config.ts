import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    reporters: ['verbose'],
    globals: false,
    setupFiles: ['/tests/setup.ts'],
    testTimeout: 10000, //ms
    hookTimeout: 10000, //ms
  },
});
