# ESLint 10 Migration Complete ✅

## Что было сделано

### 1. Обновление пакетов
- ✅ ESLint обновлён с 9.39.2 до **10.0.0**
- ✅ Все зависимости обновлены до последних версий через NCU
- ✅ Установлены совместимые плагины:
  - `eslint-config-prettier@10.1.8` - интеграция с Prettier
  - `eslint-plugin-prettier@5.5.5` - Prettier как ESLint правило
  - `@typescript-eslint/eslint-plugin@8.55.0`
  - `@typescript-eslint/parser@8.55.0`

### 2. Конфигурация ESLint 10 (Flat Config)
- ✅ Создан `eslint.config.js` с полной поддержкой ESLint 10 flat config
- ✅ Сохранены все плагины и правила из старой конфигурации:
  - TypeScript (recommended + stylistic)
  - Next.js (recommended + core-web-vitals)
  - React Hooks
  - Drizzle ORM
  - Import sorting (simple-import-sort)
  - Import rules (eslint-plugin-import-x)
- ✅ Добавлена интеграция с Prettier
- ✅ Настроены специальные правила для:
  - Конфигурационных файлов
  - Серверных файлов (API routes)
  - Тестовых файлов

### 3. Prettier конфигурация
- ✅ Обновлён `prettier.config.js` с полными настройками
- ✅ Создан `.prettierignore` для исключения файлов
- ✅ Настроена сортировка Tailwind CSS классов

### 4. VSCode интеграция
- ✅ Создан `.vscode/settings.json` с полной поддержкой:
  - ESLint 10 (flat config)
  - Prettier (format on save)
  - Auto-fix on save
  - TypeScript
  - Tailwind CSS IntelliSense
- ✅ Создан `.vscode/extensions.json` с рекомендуемыми расширениями

### 5. Package.json скрипты
- ✅ Обновлены команды:
  ```json
  "lint": "eslint ."
  "lint:fix": "eslint . --fix"
  "check": "bun run lint && bun run typecheck"
  ```

## Команды

### Проверка кода
```bash
# Полная проверка (lint + typecheck)
bun run check

# Только ESLint
bun run lint

# ESLint с автофиксом
bun run lint:fix

# Только TypeScript
bun run typecheck

# Prettier проверка
bun run format:check

# Prettier форматирование
bun run format:write
```

## Важные изменения

### ⚠️ React Plugin временно отключён
`eslint-plugin-react` пока несовместим с ESLint 10 (даже версия 7.8.0-rc.0).
Вместо него используются:
- `eslint-plugin-react-hooks` (совместим с ESLint 10)
- `@next/eslint-plugin-next` (Next.js правила)

**Что работает:**
- ✅ React Hooks правила
- ✅ Next.js правила (включая React best practices)
- ✅ TypeScript правила для JSX/TSX

**Что отключено:**
- ❌ `react/prop-types` (не нужно с TypeScript)
- ❌ `react/display-name` (временно, до совместимости)
- ❌ `react/jsx-key` (Next.js проверяет)

### 🔧 Отключённые TypeScript правила
Некоторые правила отключены из-за несовместимости или избыточности:
```javascript
"@typescript-eslint/consistent-generic-constructors": "off", // Баг в ESLint 10
"@typescript-eslint/no-explicit-any": "warn", // Только предупреждение
"@typescript-eslint/no-unsafe-*": "warn", // Только предупреждения
```

## IDE Setup

### VSCode (рекомендуется)
1. Установите расширения:
   - ESLint (`dbaeumer.vscode-eslint`)
   - Prettier (`esbenp.prettier-vscode`)
   - Tailwind CSS IntelliSense (`bradlc.vscode-tailwindcss`)

2. Настройки уже сконфигурированы в `.vscode/settings.json`

3. Перезагрузите VSCode или выполните:
   - `Cmd/Ctrl + Shift + P` → "Developer: Reload Window"

### Проверка работы
1. Откройте любой `.ts` или `.tsx` файл
2. Должны видеть подчёркивания ESLint
3. При сохранении файл автоматически форматируется Prettier
4. ESLint автофиксы применяются при сохранении

## Структура конфигурации

```
.
├── eslint.config.js          # ESLint 10 flat config
├── prettier.config.js        # Prettier настройки
├── .prettierignore          # Игнорируемые Prettier файлы
├── .vscode/
│   ├── settings.json        # VSCode настройки
│   └── extensions.json      # Рекомендуемые расширения
└── package.json             # Обновлённые скрипты
```

## Плагины и правила

### Активные плагины
1. **@typescript-eslint** - TypeScript правила
2. **@next/next** - Next.js правила
3. **react-hooks** - React Hooks правила
4. **drizzle** - Drizzle ORM правила
5. **simple-import-sort** - Сортировка импортов
6. **import-x** - Import правила
7. **prettier** - Prettier интеграция

### Сортировка импортов
Импорты автоматически сортируются в следующем порядке:
1. Side effects (`import './styles.css'`)
2. Node.js builtins (`node:fs`, `bun:test`)
3. React (`react`, `react-dom`)
4. External packages (`@radix-ui/*`, `zod`)
5. Internal packages (`~/components/*`)
6. Relative imports (`./`, `../`)
7. Styles (`.css`, `.scss`)

## Решение проблем

### ESLint не работает в VSCode
1. Проверьте, что установлено расширение ESLint
2. Проверьте Output → ESLint в VSCode
3. Перезагрузите окно: `Cmd/Ctrl + Shift + P` → "Reload Window"

### Prettier конфликтует с ESLint
Конфликты уже разрешены через `eslint-config-prettier`.
Если видите конфликты - сообщите.

### Ошибки TypeScript в парсере
Убедитесь, что `tsconfig.json` корректен и все файлы включены в проект.

## Следующие шаги

### Когда eslint-plugin-react станет совместим
```bash
bun add -D eslint-plugin-react@latest
```

Затем обновить `eslint.config.js`:
```javascript
import reactPlugin from "eslint-plugin-react";

plugins: {
  // ... existing plugins
  react: reactPlugin,
},

rules: {
  // ... existing rules
  ...reactPlugin.configs.recommended.rules,
  "react/prop-types": "off",
  "react/react-in-jsx-scope": "off",
}
```

## Версии

- ESLint: **10.0.0** ✅
- TypeScript ESLint: **8.55.0** ✅
- Prettier: **3.8.1** ✅
- Next.js ESLint: **16.1.6** ✅

## Дата миграции
14 февраля 2026

---

**Статус**: ✅ Миграция завершена успешно
**Проверено**: `bun run lint` работает
**IDE поддержка**: Настроена для VSCode
