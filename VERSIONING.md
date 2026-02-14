# 📦 Версионирование проекта

Проект использует [Changesets](https://github.com/changesets/changesets) для управления версиями и changelog.

## 🎯 Основные концепции

### Semantic Versioning (semver)

Формат версии: `MAJOR.MINOR.PATCH` (например, `1.2.3`)

- **MAJOR** (1.0.0) - Breaking changes (несовместимые изменения API)
- **MINOR** (0.1.0) - Новые фичи (обратно совместимые)
- **PATCH** (0.0.1) - Багфиксы и мелкие изменения

## 🚀 Рабочий процесс

### 1. Во время разработки

Когда вы работаете над фичей или багфиксом:

```bash
# Работаете в своей ветке
git checkout -b feature/new-feature

# Делаете коммиты как обычно
git add .
git commit -m "feat: add new feature"
```

### 2. Перед созданием PR

Добавьте changeset, описывающий ваши изменения:

```bash
bun run changeset:add
```

Вам будет задано несколько вопросов:
1. **Тип изменения** (major/minor/patch)
2. **Описание изменения** (для changelog)

Пример:
```bash
? What kind of change is this for sr2-t3?
  ○ major (breaking changes)
  ● minor (new features)
  ○ patch (bug fixes)

? Please enter a summary for this change:
Added apartment data for Building 4 and Building 5
```

Это создаст файл в `.changeset/` с описанием изменения.

### 3. Коммит changeset

```bash
git add .changeset/
git commit -m "chore: add changeset for building migrations"
git push origin feature/new-feature
```

### 4. Создание релиза

Когда готовы сделать релиз (обычно из `main` или `develop`):

```bash
# 1. Применить все changesets и обновить версию
bun run version

# Это:
# - Обновит package.json с новой версией
# - Создаст/обновит CHANGELOG.md
# - Удалит примененные changeset файлы
# - Обновит package-lock.json/bun.lockb

# 2. Закоммитить изменения версии
git add .
git commit -m "chore: version packages"

# 3. Создать git tag
git tag v$(node -p "require('./package.json').version")

# 4. Запушить изменения и теги
git push origin main --follow-tags
```

## 📝 Команды

| Команда | Описание |
|---------|----------|
| `bun run changeset:add` | Создать новый changeset |
| `bun run changeset:status` | Посмотреть статус changeset'ов |
| `bun run version` | Применить changesets и обновить версию |
| `bun run changeset` | Прямой доступ к CLI changesets |

## 📋 Примеры changesets

### Новая фича (minor)

```markdown
---
"sr2-t3": minor
---

Added user profile settings page with avatar upload functionality
```

### Багфикс (patch)

```markdown
---
"sr2-t3": patch
---

Fixed authentication redirect loop on login page
```

### Breaking change (major)

```markdown
---
"sr2-t3": major
---

BREAKING CHANGE: Changed API response format for /api/users endpoint.
Clients need to update to use the new structure.
```

### Множественные изменения

```markdown
---
"sr2-t3": minor
---

Multiple improvements:

- Added dark mode support
- Implemented real-time notifications
- Improved loading states across the app
```

## 🏷️ Git Tags

После выполнения `bun run version`, создайте git tag:

```bash
# Текущая версия из package.json
VERSION=$(node -p "require('./package.json').version")

# Создать аннотированный тег
git tag -a "v${VERSION}" -m "Release v${VERSION}"

# Запушить тег
git push origin "v${VERSION}"

# Или запушить все теги
git push --follow-tags
```

## 📊 Просмотр истории версий

### CHANGELOG.md

После каждого релиза файл `CHANGELOG.md` автоматически обновляется со всеми изменениями.

### Git tags

```bash
# Посмотреть все теги
git tag -l

# Посмотреть теги с сообщениями
git tag -l -n

# Посмотреть изменения между версиями
git log v1.0.0..v1.1.0 --oneline
```

## 🔄 Workflow для команды

### Feature branches

```bash
1. git checkout -b feature/my-feature
2. # Разработка...
3. bun run changeset:add
4. git add .changeset/
5. git commit -m "chore: add changeset"
6. # Create PR
```

### Develop branch

```bash
1. Merge PR в develop
2. Changesets накапливаются
3. Тестирование на dev окружении
```

### Release (main)

```bash
1. git checkout main
2. git merge develop
3. bun run version
4. git add .
5. git commit -m "chore: release v$(node -p "require('./package.json').version")"
6. git tag v$(node -p "require('./package.json').version")
7. git push origin main --follow-tags
```

## 🎨 Структура .changeset/

```
.changeset/
├── README.md                    # Документация changesets
├── config.json                  # Конфигурация
└── my-feature-name.md          # Changeset файл (создается автоматически)
```

## ⚙️ Конфигурация

Файл `.changeset/config.json`:

```json
{
  "$schema": "https://unpkg.com/@changesets/config@3.1.2/schema.json",
  "changelog": "@changesets/cli/changelog",
  "commit": true,                    // Авто-коммит после version
  "baseBranch": "main",              // Основная ветка
  "access": "private"                // Приватный пакет
}
```

## 📖 Чтение CHANGELOG

CHANGELOG генерируется автоматически в формате:

```markdown
# sr2-t3

## 0.2.0

### Minor Changes

- abc1234: Added apartment data for Buildings 4 and 5
- def5678: Implemented user notifications system

### Patch Changes

- ghi9012: Fixed login redirect issue

## 0.1.0

### Minor Changes

- Initial release
```

## 🚨 Важные заметки

1. **Всегда создавайте changeset** при внесении изменений, которые должны попасть в релиз
2. **Не редактируйте CHANGELOG.md вручную** - он генерируется автоматически
3. **Используйте семантическое версионирование** правильно
4. **Changesets помогают командной разработке** - они показывают какие изменения будут в следующем релизе

## 🔗 Полезные ссылки

- [Changesets documentation](https://github.com/changesets/changesets)
- [Semantic Versioning](https://semver.org/)
- [Conventional Commits](https://www.conventionalcommits.org/)

---

**Текущая версия**: `0.1.0`
**Дата**: 2026-02-14
