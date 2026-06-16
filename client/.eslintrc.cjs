// Using eslint-config-react-app outside of react-scripts requires this patch so
// that the shared config's plugins resolve from this package.
require('@rushstack/eslint-patch/modern-module-resolution');

module.exports = {
  extends: 'react-app',
  ignorePatterns: ['build/', 'node_modules/'],
  overrides: [
    {
      // Vitest exposes `vi` (and jest-compatible globals) in test files.
      files: ['**/*.test.{js,jsx}', '**/__tests__/**'],
      globals: { vi: 'readonly' }
    }
  ]
};
