import path from "node:path";
import { fileURLToPath } from "node:url";

import js from "@eslint/js";
import nextPlugin from "@next/eslint-plugin-next";
import typescriptEslint from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import drizzlePlugin from "eslint-plugin-drizzle";
import importXPlugin from "eslint-plugin-import-x";
import reactPlugin from "eslint-plugin-react";
import reactHooksPlugin from "eslint-plugin-react-hooks";
import simpleImportSort from "eslint-plugin-simple-import-sort";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default [
  js.configs.recommended,
  {
    ignores: [
      "**/node_modules/**",
      "**/.next/**",
      "**/out/**",
      "**/build/**",
      "**/dist/**",
      "**/.cache/**",
      "**/coverage/**",
      "**/drizzle/**",
    ],
  },
  {
    files: ["**/*.{js,mjs,cjs,ts,jsx,tsx}"],

    plugins: {
      "@typescript-eslint": typescriptEslint,
      "@next/next": nextPlugin,
      react: reactPlugin,
      "react-hooks": reactHooksPlugin,
      drizzle: drizzlePlugin,
      "simple-import-sort": simpleImportSort,
      "import-x": importXPlugin,
    },

    languageOptions: {
      parser: tsParser,
      ecmaVersion: "latest",
      sourceType: "module",
      parserOptions: {
        project: "./tsconfig.json",
        tsconfigRootDir: __dirname,
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: {
        React: "readonly",
        JSX: "readonly",
      },
    },

    settings: {
      react: {
        version: "detect",
      },
      next: {
        rootDir: __dirname,
      },
    },

    rules: {
      // JavaScript base rules
      "no-unused-vars": "off", // Handled by TypeScript
      "no-undef": "off", // Handled by TypeScript

      // TypeScript rules
      ...typescriptEslint.configs["recommended-type-checked"].rules,
      ...typescriptEslint.configs["stylistic-type-checked"].rules,
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
          varsIgnorePattern: "^_",
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

      // React rules
      ...reactPlugin.configs.recommended.rules,
      ...reactPlugin.configs["jsx-runtime"].rules,
      "react/prop-types": "off",
      "react/react-in-jsx-scope": "off",

      // React Hooks rules
      ...reactHooksPlugin.configs.recommended.rules,

      // Next.js rules
      ...nextPlugin.configs.recommended.rules,
      ...nextPlugin.configs["core-web-vitals"].rules,

      // Drizzle rules
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

      // Import rules
      "import-x/no-unresolved": "off",
      "import-x/named": "error",
      "import-x/namespace": "error",
      "import-x/default": "error",
      "import-x/export": "error",
      "import-x/newline-after-import": "error",
      "import-x/no-named-as-default": "warn",
      "import-x/no-named-as-default-member": "warn",
      "import-x/no-duplicates": "warn",

      // Import sorting
      "simple-import-sort/exports": "warn",
      "simple-import-sort/imports": [
        "warn",
        {
          groups: [
            // Side effect imports
            ["^\\u0000"],
            // Node.js builtins
            ["^(bun|node)"],
            // React
            ["^react", "^react-dom"],
            // External packages
            ["^@?\\w"],
            // Internal packages (using ~ alias)
            ["^~(/.*|$)"],
            // Relative imports
            [
              "^\\./(?=.*/)(?!/?$)",
              "^\\.(?!/?$)",
              "^\\./?$",
              "^\\.\\.(?!/?$)",
              "^\\.\\./?$",
            ],
            // Style imports
            ["^.+\\.(s|p)?css$"],
          ],
        },
      ],
    },
  },
  {
    files: ["**/*.config.{js,ts,mjs,cjs}"],
    rules: {
      "@typescript-eslint/no-var-requires": "off",
      "import-x/no-default-export": "off",
    },
  },
];
