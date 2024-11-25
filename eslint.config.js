import js from '@eslint/js';
import prettier from 'eslint-plugin-prettier';

export default [
  js.configs.recommended,
  {
    files: ['src/**/*.js'],
    languageOptions: {
      sourceType: 'module',
      ecmaVersion: 'latest',
      globals: {
        window: 'readonly',
        document: 'readonly',
      },
    },
    plugins: {
      prettier: prettier,
    },
    rules: {
      'no-unused-vars': 'warn',
      'no-console': 'warn',
      'prettier/prettier': 'warn',
    },
    ignores: ['node_modules/**', 'dist/**', 'coverage/**', '*.config.js'],
  },
];
