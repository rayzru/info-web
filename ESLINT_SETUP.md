# ESLint + Prettier Setup ✅

## Quick Start

```bash
# Проверка кода
bun run lint

# Автофикс
bun run lint:fix

# Полная проверка (lint + typecheck)
bun run check

# Форматирование Prettier
bun run format:write
```

## IDE Setup (VSCode)

1. Установите расширения (автоматически рекомендуются):
   - ESLint
   - Prettier
   - Tailwind CSS IntelliSense

2. Перезагрузите VSCode: `Cmd/Ctrl + Shift + P` → "Reload Window"

3. Проверка:
   - Откройте любой `.ts` файл
   - Должны видеть подчёркивания ESLint
   - При сохранении файл форматируется автоматически

## Конфигурация

- `eslint.config.js` - ESLint 10 flat config
- `prettier.config.js` - Prettier settings
- `.vscode/settings.json` - IDE integration
- `ESLINT_MIGRATION.md` - Полная документация

## Версии

- ESLint: 10.0.0
- TypeScript ESLint: 8.55.0
- Prettier: 3.8.1
- Next.js ESLint: 16.1.6

## Статус

✅ Миграция на ESLint 10 завершена
✅ `bun run lint` работает
✅ Prettier интегрирован
✅ IDE поддержка настроена

Детали: см. `ESLINT_MIGRATION.md`
