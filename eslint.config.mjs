import * as path from 'path';
import eslint from '@eslint/js';
import reactPlugin from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import tseslint from 'typescript-eslint';
import importPlugin from 'eslint-plugin-import';
import pluginI18nJson from 'eslint-plugin-i18n-json';
import pluginUnicorn from 'eslint-plugin-unicorn';
import pluginUnusedImports from 'eslint-plugin-unused-imports';

export default tseslint.config(
  eslint.configs.recommended,
  tseslint.configs.recommendedTypeChecked,
  {
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  reactPlugin.configs.flat.recommended,
  reactPlugin.configs.flat['jsx-runtime'],
  {
    ignores: [
      'node_modules',
      '__tests__',
      '.vscode',
      'android',
      'coverage',
      'ios',
      '.expo',
      '.expo-shared',
      'docs',
      'cli',
    ],
  },
  {
    settings: {
      react: {
        version: 'detect',
      },
    },
    plugins: {
      'react-hooks': reactHooks,
      import: importPlugin,
      unicorn: pluginUnicorn,
      'unused-imports': pluginUnusedImports,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'no-console': 'warn', // eslint rule
      'react/jsx-no-useless-fragment': 'error', // React rule
      'react-hooks/exhaustive-deps': 'off', // hooks rule
      '@typescript-eslint/no-unused-vars': 'off', // typescript rule
      '@typescript-eslint/no-unsafe-return': 'off',
      'react/prop-types': 'off',
      'import/order': [
        'error',
        {
          groups: [
            'builtin', // React is treated as a built-in module
            'external', // External npm modules
            'internal', // Internal project modules (like @assets)
            ['parent', 'sibling', 'index'], // Parent, sibling, and index files
            'object', // Imports with object destructuring
            'type', // Type-only imports
          ],
          pathGroups: [
            {
              pattern: 'react',
              group: 'builtin',
              position: 'before', // Ensure React is always first
            },
            {
              pattern: 'react-native',
              group: 'builtin', // React Native imports are treated as external
              position: 'after', // After React but before other external imports
            },
            {
              pattern: '@assets/*',
              group: 'internal', // Treat @assets as internal
              position: 'after', // After external modules
            },
          ],
          pathGroupsExcludedImportTypes: ['react'],
          'newlines-between': 'never', // No newlines between groups
          alphabetize: {
            order: 'asc', // Sort imports alphabetically within groups
            caseInsensitive: true, // Case-insensitive alphabetization
          },
        },
      ],
      'unicorn/filename-case': [
        'off',
        {
          case: 'kebabCase',
          ignore: ['/android', '/ios'],
        },
      ],
      'max-params': ['error', 10],
      'max-lines-per-function': ['error', 1000],
      'react/display-name': 'off',
      'react/react-in-jsx-scope': 'off',
      'react/destructuring-assignment': 'off',
      'react/require-default-props': 'off',
      '@typescript-eslint/comma-dangle': 'off',
      'import/prefer-default-export': 'off',
      'import/no-cycle': ['error', { maxDepth: '∞' }],
      'unused-imports/no-unused-imports': 'error',
      '@typescript-eslint/no-require-imports': 'error',
      'unused-imports/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
        },
      ],
      'react/jsx-uses-react': 'error',
      'react/jsx-uses-vars': 'error',
    },
  },

  {
    files: ['**/*.test.tsx'],
    rules: {
      '@typescript-eslint/no-unused-expressions': 'off',
    },
  },
  {
    files: ['src/translations/*.json'],
    plugins: [pluginI18nJson],
    rules: {
      'i18n-json/valid-message-syntax': [
        'error',
        {
          syntax: path.resolve('./scripts/i18next-syntax-validation.js'),
        },
      ],
      'i18n-json/valid-json': 'error',
      'i18n-json/sorted-keys': [
        'error',
        {
          order: 'asc',
          indentSpaces: 2,
        },
      ],
      'i18n-json/identical-keys': [
        'error',
        {
          filePath: path.resolve('./src/translations/en.json'),
        },
      ],
      'prettier/prettier': [
        'off',
        {
          singleQuote: true,
          endOfLine: 'auto',
        },
      ],
    },
  }
);
