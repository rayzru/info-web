module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: 'tsconfig.json',
  },
  plugins: ['react', 'react-hooks', 'simple-import-sort', 'import'],
  extends: [
    'next/core-web-vitals',
    'plugin:react-hooks/recommended',
    'eslint:recommended',
    // 'plugin:@typescript-eslint/recommended-type-checked',
    // 'plugin:@typescript-eslint/stylistic-type-checked',
    'plugin:import/recommended',
    'plugin:import/typescript',
  ],
  rules: {
    indent: ['error', 2, { SwitchCase: 1 }],
    quotes: ['error', 'single', { avoidEscape: true }],
    'quote-props': ['error', 'as-needed'],
    'simple-import-sort/imports': [
      'error',
      {
        groups: [
          ['^react', '^@?\\w'],
          ['^@(/.*|$)'],
          [
            '^\\.\\.(?!/?$)',
            '^\\.\\./?$',
            '^\\./(?=.*/)(?!/?$)',
            '^\\.(?!/?$)',
            '^\\./?$',
          ],
          ['^\\u0000'],
          ['^.+\\.s?css$'],
        ],
      },
    ],
    'max-len': ['error', { code: 140 }],
    'simple-import-sort/exports': 'error',
    'sort-imports': 'off',
    'import/order': 'off',
    'import/first': 'error',
    'import/newline-after-import': 'error',
    'import/no-duplicates': 'error',
    'no-duplicate-imports': 'error',
  },
};
