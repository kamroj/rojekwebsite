import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'

export default [
  { ignores: ['dist'] },

  // Entrypoints / non-component modules where React Fast Refresh rule is not useful.
  {
    files: ['src/main.jsx', 'src/context/ResourceCollectorContext.jsx'],
    rules: {
      'react-refresh/only-export-components': 'off',
    },
  },

  // Node/CommonJS files (Netlify Functions)
  {
    files: ['netlify/functions/**/*.{js,jsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: { ...globals.browser, ...globals.node, ...globals.commonjs },
      parserOptions: {
        ecmaVersion: 'latest',
        ecmaFeatures: { jsx: true },
        sourceType: 'script',
      },
    },
  },

  // Node/Esm config files (Vite config etc.)
  {
    files: ['vite.config.js', 'astro.config.mjs', '**/*.config.{js,mjs}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: { ...globals.node },
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
    },
  },

  {
    files: ['**/*.{js,jsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        ecmaVersion: 'latest',
        ecmaFeatures: { jsx: true },
        sourceType: 'module',
      },
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      ...js.configs.recommended.rules,
      ...reactHooks.configs.recommended.rules,
      'no-unused-vars': ['error', { varsIgnorePattern: '^[A-Z_]', argsIgnorePattern: '^_' }],
      // This repo uses Astro islands + utility modules and does not rely on classic Vite React Fast Refresh.
      // The rule generates false positives (contexts, entrypoints, helpers).
      'react-refresh/only-export-components': 'off',
    },
  },
]
