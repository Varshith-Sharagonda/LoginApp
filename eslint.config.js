export default [
  {
    files: ['**/*.js'],
    rules: {
      semi: 'error',
      quotes: ['error', 'single'],
      'no-console': ['warn', { allow: ['error'] }],
      'no-debugger': 'warn',
      'no-alert': 'warn',
      'no-unused-vars': 'warn',
      'prefer-const': 'error',
    },
  },
];