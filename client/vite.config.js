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
    // Inline deps that Node's ESM resolver (used by Vitest for externalized
    // node_modules) can't load, but Vite/Rolldown can:
    //  - react-geocode: `main` is a UMD bundle with no ESM named exports.
    //  - @mui/*: their ESM does directory imports (e.g. Transition.mjs ->
    //    react-transition-group/TransitionGroupContext) that strict Node ESM
    //    rejects. Inlining lets Vite resolve them.
    server: { deps: { inline: ['react-geocode', /@mui\//, 'react-transition-group'] } }
  }
});
