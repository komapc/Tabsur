/// <reference types="vitest/config" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // Keep build output in `build/` so Docker/nginx/server.js stay unchanged.
  build: { outDir: 'build' },
  server: { port: 3000, open: false },
  // Keep CRA-style env var names working (read via import.meta.env.REACT_APP_*).
  envPrefix: ['VITE_', 'REACT_APP_'],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/setupTests.js',
    css: false,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'lcov'],
      reportsDirectory: './coverage'
    },
    // react-geocode's `main` is a UMD bundle with no ESM named exports; Node's
    // resolution (used by Vitest for externalized deps) picks it and yields an
    // empty module. Inline it so Vitest transforms it via Vite's `module` field.
    server: { deps: { inline: ['react-geocode'] } }
  }
});
