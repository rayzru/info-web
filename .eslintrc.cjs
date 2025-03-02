/** @type {import("@typescript-eslint/utils/ts-eslint").ClassicConfig.Config} */
const config = {
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: true,
  },
  plugins: ["@typescript-eslint", "drizzle", "simple-import-sort", "import-x"],
  ignorePatterns: ["**/_legacy?/**/*"],
  extends: [
    "next/core-web-vitals",
    "plugin:@typescript-eslint/recommended-type-checked",
    "plugin:@typescript-eslint/stylistic-type-checked",
  ],
  rules: {
    "@typescript-eslint/array-type": "off",
    "@typescript-eslint/consistent-type-definitions": "off",
    "@typescript-eslint/consistent-type-imports": [
      "warn",
      {
        prefer: "type-imports",
        fixStyle: "inline-type-imports",
      },
    ],
    "@typescript-eslint/no-unused-vars": [
      "warn",
      {
        argsIgnorePattern: "^_",
      },
    ],
    "@typescript-eslint/require-await": "off",
    "@typescript-eslint/no-misused-promises": [
      "error",
      {
        checksVoidReturn: {
          attributes: false,
        },
      },
    ],
    "drizzle/enforce-delete-with-where": [
      "error",
      {
        drizzleObjectName: ["db", "ctx.db"],
      },
    ],
    "drizzle/enforce-update-with-where": [
      "error",
      {
        drizzleObjectName: ["db", "ctx.db"],
      },
    ],

    "import-x/no-unresolved": "off",
    "import-x/named": "error",
    "import-x/namespace": "error",
    "import-x/default": "error",
    "import-x/export": "error",
    "import/newline-after-import": "error",
    "import-x/no-named-as-default": "warn",
    "import-x/no-named-as-default-member": "warn",
    "import-x/no-duplicates": "warn",
    "simple-import-sort/exports": "warn",
    "simple-import-sort/imports": [
      "warn",
      {
        groups: [
          ["^\\u0000"],
          ["^(bun|node)"],
          ["^react|react-dom"],
          ["^@?\\w"],
          ["^(@|@sr2)(/.*|$)"],
          [
            "^\\./(?=.*/)(?!/?$)",
            "^\\.(?!/?$)",
            "^\\./?$",
            "^\\.\\.(?!/?$)",
            "^\\.\\./?$",
          ],
          ["^.+\\.(s|p)?css$"],
        ],
      },
    ],
  },
};
module.exports = config;
