module.exports = {
  env: {
    node: true,
    es2021: true,
    jest: true
  },
  extends: [
    'eslint:recommended'
  ],
  parserOptions: {
    ecmaVersion: 12,
    sourceType: 'module'
  },
  rules: {
    // Warnings for code quality
    'no-unused-vars': ['warn', {
      argsIgnorePattern: '^_',
      varsIgnorePattern: '^_',
      ignoreRestSiblings: true
    }],
    'no-console': 'off', // Allow console.log in server code
    'prefer-const': 'warn',
    'no-var': 'error',

    // Style consistency
    'indent': ['error', 2],
    'linebreak-style': ['error', 'unix'],
    'quotes': ['error', 'single', { allowTemplateLiterals: true }],
    'semi': ['error', 'always'],

    // Best practices
    'eqeqeq': ['error', 'always'],
    'no-trailing-spaces': 'error',
    'no-multiple-empty-lines': ['error', { max: 2 }],
    'comma-dangle': ['error', 'never'],
    'object-curly-spacing': ['error', 'always'],
    'array-bracket-spacing': ['error', 'never'],

    // Security
    'no-eval': 'error',
    'no-implied-eval': 'error'
  },
  ignorePatterns: [
    'node_modules/',
    'client/',
    'build/',
    'dist/',
    '*.min.js'
  ]
};