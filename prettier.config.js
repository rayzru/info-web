/** @type {import('prettier').Config & import('prettier-plugin-tailwindcss').PluginOptions} */
export default {
  // Плагины
  plugins: ["prettier-plugin-tailwindcss"],

  // Основные настройки форматирования
  semi: true,
  singleQuote: false,
  tabWidth: 2,
  useTabs: false,
  trailingComma: "es5",
  printWidth: 100,
  endOfLine: "auto",
  arrowParens: "always",
  bracketSpacing: true,
  bracketSameLine: false,

  // Специфичные для TypeScript/React
  jsxSingleQuote: false,

  // Tailwind CSS - сортировка классов
  tailwindConfig: "./tailwind.config.ts",
  tailwindFunctions: ["cn", "cva"],
};
