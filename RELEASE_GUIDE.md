# 🚀 Быстрый гайд по релизам

## 📝 TL;DR

```bash
# 1. Создать changeset после разработки фичи
bun run changeset:add

# 2. Перед релизом - обновить версию
bun run version

# 3. Создать тег
git tag -a "v$(node -p "require('./package.json').version")" -m "Release v$(node -p "require('./package.json').version")"

# 4. Запушить всё
git push origin main --follow-tags
```

---

## 🎯 Рабочий процесс

### 1️⃣ Разработка фичи

```bash
# Создать ветку
git checkout -b feature/my-feature

# Разработка...
git add .
git commit -m "feat: add new feature"

# Создать changeset
bun run changeset:add
# Выбрать: minor (новая фича) или patch (багфикс)
# Описать изменения

# Закоммитить changeset
git add .changeset/
git commit -m "chore: add changeset"

# Создать PR
git push origin feature/my-feature
```

### 2️⃣ Merge в develop

После ревью:
```bash
# Merge PR в develop
# Changesets накапливаются в .changeset/
```

### 3️⃣ Создание релиза

```bash
# 1. Переключиться на main
git checkout main
git pull origin main

# 2. Merge develop
git merge develop

# 3. Применить changesets и обновить версию
bun run version
# Это создаст:
# - Обновленный package.json с новой версией
# - CHANGELOG.md с описанием всех изменений
# - Удалит примененные changesets

# 4. Закоммитить (если еще не закоммичено)
git add .
git commit -m "chore: release v$(node -p "require('./package.json').version")"

# 5. Создать git tag
git tag -a "v$(node -p "require('./package.json').version")" \
  -m "Release v$(node -p "require('./package.json').version")"

# 6. Запушить main и теги
git push origin main --follow-tags
```

### 4️⃣ После релиза

Changelog автоматически обновлен - можно использовать его для:
- Release notes на GitHub
- Описания обновлений на сайте
- Коммуникации с пользователями

---

## 📋 Типы изменений

| Тип | Версия | Когда использовать |
|-----|--------|-------------------|
| **major** | 1.0.0 → 2.0.0 | Breaking changes (редко) |
| **minor** | 0.1.0 → 0.2.0 | Новые фичи |
| **patch** | 0.1.0 → 0.1.1 | Багфиксы, мелкие улучшения |

---

## 🎨 Примеры описаний changesets

### ✅ Хорошие описания

```markdown
Added apartment data for Buildings 4 and 5 with comprehensive documentation
```

```markdown
Fixed authentication redirect loop that occurred after password reset
```

```markdown
Improved loading performance by implementing React.lazy for heavy components
```

### ❌ Плохие описания

```markdown
updated files
```

```markdown
fix
```

```markdown
changes
```

---

## 📦 Структура после релиза

```
project/
├── CHANGELOG.md          # ← История всех релизов
├── package.json          # ← version: "0.2.0"
├── .changeset/
│   ├── config.json
│   └── README.md
└── VERSIONING.md         # ← Полная документация
```

---

## 🔍 Полезные команды

```bash
# Посмотреть статус changesets
bun run changeset:status

# Посмотреть текущую версию
node -p "require('./package.json').version"

# Посмотреть все теги
git tag -l

# Посмотреть изменения между версиями
git log v0.1.0..v0.2.0 --oneline

# Посмотреть последний релиз
git describe --tags --abbrev=0
```

---

## 📚 Детальная документация

См. [VERSIONING.md](./VERSIONING.md) для полной документации.

---

**Текущая версия**: `0.2.0`
**Последний релиз**: `v0.2.0` - Database migrations for Buildings 4 & 5
