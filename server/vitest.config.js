import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    testTimeout: 25000,
    hookTimeout: 25000,
    setupFiles: ['./tests/setup.js'],
    fileParallelism: false // Run test suites sequentially against test database
  }
});
