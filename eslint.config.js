import path from "node:path";
import { fileURLToPath } from "node:url";

import js from "@eslint/js";
import nextPlugin from "@next/eslint-plugin-next";
import typescriptEslint from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import drizzlePlugin from "eslint-plugin-drizzle";
import importXPlugin from "eslint-plugin-import-x";
import prettierConfig from "eslint-config-prettier";
import prettierPlugin from "eslint-plugin-prettier";
import reactHooksPlugin from "eslint-plugin-react-hooks";
import simpleImportSort from "eslint-plugin-simple-import-sort";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default [
  // ============================================================================
  // Базовая рекомендуемая конфигурация JavaScript
  // ============================================================================
  js.configs.recommended,

  // ============================================================================
  // Игнорируемые директории и файлы
  // ============================================================================
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
      "**/.serwist/**",
      "**/public/**",
      "**/*.config.js",
      "**/*.config.ts",
      "**/*.config.mjs",
      "**/*.config.cjs",
      "**/scripts/**",
      "**/test-smtp-local.ts",
      "**/next-env.d.ts",
    ],
  },

  // ============================================================================
  // Основная конфигурация для всех TypeScript файлов
  // ============================================================================
  {
    files: ["**/*.{js,mjs,cjs,ts,jsx,tsx}"],

    plugins: {
      "@typescript-eslint": typescriptEslint,
      "@next/next": nextPlugin,
      "react-hooks": reactHooksPlugin,
      drizzle: drizzlePlugin,
      "simple-import-sort": simpleImportSort,
      "import-x": importXPlugin,
      prettier: prettierPlugin,
    },

    languageOptions: {
      parser: tsParser,
      ecmaVersion: "latest",
      sourceType: "module",
      parserOptions: {
        // Используем projectService для автоматического обнаружения tsconfig
        projectService: {
          allowDefaultProject: [
            "*.config.{js,ts,mjs,cjs}",
            "*.d.ts",
          ],
        },
        tsconfigRootDir: __dirname,
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: {
        // Глобальные переменные для React
        React: "readonly",
        JSX: "readonly",
        // Node.js globals
        NodeJS: "readonly",
        // Browser globals
        window: "readonly",
        document: "readonly",
        navigator: "readonly",
        console: "readonly",
        // Bun globals
        Bun: "readonly",
      },
    },

    settings: {
      next: {
        rootDir: __dirname,
      },
      "import-x/resolver": {
        typescript: {
          alwaysTryTypes: true,
          project: "./tsconfig.json",
        },
        node: true,
      },
    },

    rules: {
      // ============================================================================
      // JavaScript базовые правила
      // ============================================================================
      "no-unused-vars": "off", // Обрабатывается @typescript-eslint/no-unused-vars
      "no-undef": "off", // Обрабатывается TypeScript
      "no-console": "off", // Разрешаем console.log в development

      // ============================================================================
      // TypeScript правила
      // ============================================================================
      ...typescriptEslint.configs["recommended-type-checked"].rules,
      ...typescriptEslint.configs["stylistic-type-checked"].rules,

      "@typescript-eslint/array-type": "off",
      "@typescript-eslint/consistent-type-definitions": "off",
      "@typescript-eslint/consistent-generic-constructors": "off",
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
          caughtErrorsIgnorePattern: "^_",
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
      "@typescript-eslint/no-empty-object-type": "off",
      "@typescript-eslint/no-unsafe-function-type": "off",
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/no-floating-promises": "warn",
      "@typescript-eslint/no-unsafe-assignment": "warn",
      "@typescript-eslint/no-unsafe-member-access": "warn",
      "@typescript-eslint/no-unsafe-call": "warn",
      "@typescript-eslint/no-unsafe-return": "warn",
      "@typescript-eslint/no-unsafe-argument": "warn",
      "@typescript-eslint/prefer-nullish-coalescing": "warn",
      "@typescript-eslint/no-base-to-string": "warn",
      "@typescript-eslint/restrict-template-expressions": "warn",

      // JavaScript base rules
      "no-useless-assignment": "warn",
      "no-case-declarations": "warn",

      // ============================================================================
      // React Hooks правила
      // ============================================================================
      ...reactHooksPlugin.configs.recommended.rules,
      "react-hooks/set-state-in-effect": "warn",
      "react-hooks/purity": "warn",
      "react-hooks/static-components": "warn",
      "react-hooks/immutability": "warn",
      "react-hooks/refs": "warn",
      "react-hooks/preserve-manual-memoization": "warn",

      // Preserve caught errors
      "preserve-caught-error": "warn",

      // ============================================================================
      // Next.js правила
      // ============================================================================
      ...nextPlugin.configs.recommended.rules,
      ...nextPlugin.configs["core-web-vitals"].rules,

      // ============================================================================
      // Drizzle ORM правила
      // ============================================================================
      "drizzle/enforce-delete-with-where": [
        "warn",
        {
          drizzleObjectName: ["db", "ctx.db"],
        },
      ],
      "drizzle/enforce-update-with-where": [
        "warn",
        {
          drizzleObjectName: ["db", "ctx.db"],
        },
      ],

      // ============================================================================
      // Import правила
      // ============================================================================
      "import-x/no-unresolved": "off", // TypeScript handles this better
      "import-x/named": "error",
      "import-x/namespace": "error",
      "import-x/default": "error",
      "import-x/export": "error",
      "import-x/newline-after-import": "error",
      "import-x/no-named-as-default": "warn",
      "import-x/no-named-as-default-member": "warn",
      "import-x/no-duplicates": "warn",
      "import-x/first": "error",
      "import-x/no-mutable-exports": "error",

      // ============================================================================
      // Import сортировка (simple-import-sort)
      // ============================================================================
      "simple-import-sort/exports": "warn",
      "simple-import-sort/imports": [
        "warn",
        {
          groups: [
            // Side effect imports (должны быть первыми)
            ["^\\u0000"],
            // Node.js builtins с префиксом node:
            ["^node:"],
            // Bun builtins
            ["^bun:"],
            // React и React DOM
            ["^react$", "^react-dom$"],
            // External packages (начинаются с буквы или @)
            ["^@?\\w"],
            // Internal packages (используют алиас ~)
            ["^~(/.*|$)"],
            // Относительные импорты (../ и ./)
            [
              "^\\.\\.(?!/?$)",
              "^\\.\\./?$",
              "^\\./(?=.*/)(?!/?$)",
              "^\\.(?!/?$)",
              "^\\./?$",
            ],
            // Стили (должны быть последними)
            ["^.+\\.(s?css|pcss)$"],
          ],
        },
      ],

      // ============================================================================
      // Prettier интеграция
      // ============================================================================
      "prettier/prettier": [
        "warn",
        {
          endOfLine: "auto",
        },
      ],
    },
  },

  // ============================================================================
  // Отключение конфликтующих с Prettier правил
  // ============================================================================
  prettierConfig,

  // ============================================================================
  // Специальные правила для конфигурационных файлов
  // ============================================================================
  {
    files: [
      "**/*.config.{js,ts,mjs,cjs}",
      "**/drizzle.config.ts",
      "**/*.d.ts",
      "src/env.js",
    ],
    rules: {
      "@typescript-eslint/no-var-requires": "off",
      "import-x/no-default-export": "off",
      "@typescript-eslint/no-unsafe-assignment": "off",
      "@typescript-eslint/no-unsafe-member-access": "off",
      "@typescript-eslint/no-unsafe-call": "off",
      "@typescript-eslint/no-unsafe-return": "off",
    },
  },

  // ============================================================================
  // Правила для серверных файлов (API routes, server actions)
  // ============================================================================
  {
    files: [
      "src/app/api/**/*.{ts,tsx}",
      "src/server/**/*.{ts,tsx}",
      "**/route.{ts,tsx}",
      "**/actions.{ts,tsx}",
    ],
    rules: {
      "no-console": "warn", // Предупреждать о console.log на сервере
    },
  },

  // ============================================================================
  // Правила для тестовых файлов
  // ============================================================================
  {
    files: [
      "**/__tests__/**/*.{ts,tsx}",
      "**/*.test.{ts,tsx}",
      "**/*.spec.{ts,tsx}",
    ],
    rules: {
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-unsafe-assignment": "off",
      "@typescript-eslint/no-unsafe-member-access": "off",
      "@typescript-eslint/no-unsafe-call": "off",
    },
  },
];
