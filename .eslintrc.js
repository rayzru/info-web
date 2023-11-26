module.exports = {
  extends: [
    'next/core-web-vitals',
    'prettier',
    'plugin:react-hooks/recommended',
    'eslint:recommended',
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
    'simple-import-sort/exports': 'error',
    'sort-imports': 'off',
    'import/order': 'off',
    'import/no-duplicates': 'error',
    'no-duplicate-imports': 'error',
  },
  plugins: ['import', 'simple-import-sort', 'react', 'react-hooks', 'sonarjs'],
};
