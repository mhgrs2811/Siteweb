const { defineConfig } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');
const prettierConfig = require('eslint-config-prettier/flat');
const i18next = require('eslint-plugin-i18next');

module.exports = defineConfig([
  {
    ignores: [
      'node_modules/**',
      'dist/**',
      '.expo/**',
      'coverage/**',
      'ios/**',
      'android/**',
      'public/**',
      '.preview/**',
      'scripts/**',
    ],
  },
  ...expoConfig,
  {
    // Product code: every user-facing string must go through i18n.
    files: ['src/**/*.{ts,tsx}'],
    plugins: { i18next },
    rules: {
      'i18next/no-literal-string': ['error', { mode: 'jsx-text-only' }],
    },
  },
  {
    files: ['**/*.test.{ts,tsx}', '**/__tests__/**/*.{ts,tsx}'],
    rules: {
      'i18next/no-literal-string': 'off',
    },
  },
  prettierConfig,
]);
