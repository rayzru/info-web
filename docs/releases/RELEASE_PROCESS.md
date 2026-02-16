# Release Process

Автоматизированный процесс управления версиями и релизами с использованием [Changesets](https://github.com/changesets/changesets).

---

## Быстрый старт

### 1. Добавить изменения в changelog

```bash
# Создать новый changeset (интерактивно)
bun run changeset

# Или добавить вручную
bun run changeset:add
```

Выберите тип изменения:
- **patch** (0.4.4 → 0.4.5) - исправления багов, мелкие улучшения
- **minor** (0.4.4 → 0.5.0) - новые функции, обратно совместимые
- **major** (0.4.4 → 1.0.0) - breaking changes

Опишите изменения в деталях.

### 2. Накопить changesets

Можно сделать несколько changesets в разных PR/коммитах:

```bash
# Feature 1
bun run changeset
git add .changeset/feature-1.md
git commit -m "feat: add feature 1"

# Feature 2
bun run changeset
git add .changeset/feature-2.md
git commit -m "feat: add feature 2"
```

### 3. Создать релиз

Когда готовы выпустить версию:

```bash
# Обновить версию и CHANGELOG
bun run version

# Проверить изменения
git diff

# Закоммитить
git add .
git commit -m "chore(release): version packages"

# Отправить в main
git push origin main
```

### 4. Автоматический деплой

После push в `main`:
1. GitHub Actions создаст релиз
2. Обновится production (`sr2.ru`)
3. Версия синхронизируется везде:
   - ✅ package.json
   - ✅ CHANGELOG.md
   - ✅ Git tag
   - ✅ GitHub Release
   - ✅ Футер сайта

---

## Структура Changeset

Файлы в `.changeset/*.md`:

```markdown
---
"sr2-t3": patch
---

Краткое описание изменения

Подробности:
- Что сделано
- Зачем
- Как это влияет на пользователей
```

---

## Примеры

### Patch (0.4.4 → 0.4.5)

```bash
bun run changeset
```

```markdown
---
"sr2-t3": patch
---

Fix: Login redirect after logout

- Исправлено перенаправление на /login после logout
- Убрана ошибка "session not found" в консоли
```

### Minor (0.4.4 → 0.5.0)

```markdown
---
"sr2-t3": minor
---

Feature: Email notifications

- Добавлены email-уведомления для изменения статуса заявок
- Настроена очередь для отправки писем
- Добавлены шаблоны писем на русском языке
```

### Major (0.4.4 → 1.0.0)

```markdown
---
"sr2-t3": major
---

BREAKING: Migrate to NextAuth v6

- Обновлен NextAuth v5 → v6
- Изменен API сессий (новый формат токенов)
- Требуется миграция БД: `bun run db:migrate`
- Все пользователи должны пере-авторизоваться
```

---

## Workflow

### Ветки

```
feature/* → development (beta) → main (production)
    ↓           ↓                   ↓
changeset    version            release
```

### Процесс

1. **Feature branch**
   ```bash
   git checkout -b feat/my-feature
   # Разработка
   bun run changeset  # Создать changeset
   git add .
   git commit -m "feat: my feature"
   git push
   ```

2. **Merge в development**
   ```bash
   # PR в development → merge
   # Автоматический деплой на beta.sr2.ru
   # Тестирование на beta
   ```

3. **Подготовка релиза**
   ```bash
   git checkout development
   bun run version  # Обновить версию
   git add .
   git commit -m "chore(release): version packages"
   git push
   ```

4. **Production release**
   ```bash
   # PR из development в main → merge
   # GitHub Actions:
   # - Создаст GitHub Release
   # - Задеплоит на sr2.ru
   # - Версия синхронизирована везде
   ```

---

## Команды

```bash
# Создать changeset
bun run changeset

# Добавить changeset (алиас)
bun run changeset:add

# Проверить статус
bun run changeset:status

# Обновить версию (применить changesets)
bun run version

# Проверить и собрать проект
bun run check  # lint + typecheck
bun run build  # production build

# Полный цикл (используется в CI)
bun run release  # check + build + publish
```

---

## GitHub Actions

### `.github/workflows/release.yml`

Автоматизирует релиз при push в `main`:

```yaml
on:
  push:
    branches: [main]

jobs:
  release:
    steps:
      - Checkout
      - Setup Bun
      - Install dependencies
      - Create Release PR or Publish
      - Create GitHub Release with CHANGELOG
```

### Что делает workflow:

1. **Проверяет changesets**
   - Если есть `.changeset/*.md` файлы → создает PR "Version Packages"
   - Если нет changesets, но есть изменения версии → публикует релиз

2. **Создает GitHub Release**
   - Tag: `v0.4.4`
   - Release notes из CHANGELOG.md

3. **Деплоит на production**
   - Срабатывает `deploy-production.yml`
   - Использует версию из package.json

---

## Проверка версии

### Локально

```bash
cat package.json | jq -r '.version'
# 0.4.4
```

### На сайте

Футер сайта: `v0.4.4`

```bash
curl -s https://sr2.ru | grep -o 'v[0-9]\+\.[0-9]\+\.[0-9]\+'
# v0.4.4
```

### Git tags

```bash
git tag --sort=-version:refname | head -5
# v0.4.4
# v0.4.3
# v0.4.2
```

### GitHub Releases

```bash
gh release list --limit 5
# v0.4.4   Latest   2026-02-15
```

---

## Semantic Versioning

Версии следуют [SemVer](https://semver.org/):

```
MAJOR.MINOR.PATCH
  1  .  0  .  0

MAJOR - breaking changes (несовместимые изменения API)
MINOR - новые функции (обратно совместимые)
PATCH - исправления (обратно совместимые)
```

### До версии 1.0.0

Проект в активной разработке (0.x.x):
- **MINOR** - новые функции и небольшие breaking changes
- **PATCH** - исправления и улучшения

После 1.0.0 - строгий SemVer.

---

## Troubleshooting

### Changesets не применяются

```bash
# Проверить статус
bun run changeset:status

# Убедиться что changesets есть
ls -la .changeset/*.md

# Попробовать снова
bun run version
```

### Версия не синхронизирована

```bash
# Проверить package.json
cat package.json | jq -r '.version'

# Проверить git tag
git describe --tags --abbrev=0

# Проверить GitHub
gh release list --limit 1

# Если рассинхронизация - создать changeset вручную
bun run changeset
bun run version
git push --tags
```

### GitHub Release не создался

```bash
# Проверить workflow
gh run list --workflow=release.yml --limit 5

# Посмотреть логи
gh run view <run-id> --log

# Создать вручную
gh release create v0.4.4 --title "v0.4.4" --notes "$(cat CHANGELOG.md | sed -n '/## 0.4.4/,/## 0.4.3/p' | head -n -1)"
```

---

## Best Practices

### 1. Один changeset = одна фича/багфикс

```bash
# ❌ Плохо
feat: add email + fix login + update UI

# ✅ Хорошо
feat: add email notifications
fix: login redirect
feat: update UI design
```

### 2. Описывайте изменения для пользователей

```markdown
# ❌ Плохо
---
"sr2-t3": patch
---
Updated auth service

# ✅ Хорошо
---
"sr2-t3": patch
---
Fix: Session expires after page refresh

- Исправлено автоматическое разлогинивание при обновлении страницы
- Сессия теперь сохраняется 30 дней
- Пользователи больше не теряют доступ к личному кабинету
```

### 3. Группируйте релизы

Не выпускайте версию после каждого коммита. Накопите изменения:

```bash
# День 1
feat: feature A → changeset

# День 2
feat: feature B → changeset
fix: bug C → changeset

# День 3
bun run version  # → v0.4.5 с тремя изменениями
```

### 4. Используйте draft releases для больших изменений

```bash
# В .changeset/config.json (временно)
{
  "commit": false  # Ручной контроль
}

# После проверки
bun run version
git add .
git commit -m "chore(release): version packages"
```

---

## См. также

- [Changesets Documentation](https://github.com/changesets/changesets)
- [Semantic Versioning](https://semver.org/)
- [CHANGELOG.md](../../CHANGELOG.md)
- [DEPLOYMENT_WORKFLOW.md](../DEPLOYMENT_WORKFLOW.md)

---

**Последнее обновление:** 15 февраля 2026
