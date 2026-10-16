import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    reporters: ['verbose'],
    globals: false,
    setupFiles: ['/tests/setup.ts'],
    testTimeout: 10000, //ms
    hookTimeout: 10000, //ms

    // Prevent register and login files from
    // running concurrently against the same database.
    fileParallelism: false,
  },
});
