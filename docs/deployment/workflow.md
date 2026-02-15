# Deployment Workflow

Этот документ описывает процесс деплоя и работы с ветками в проекте.

## Структура веток

```
feature/* → development → main
  (PR)        (PR)
   ↓           ↓
  CI        Beta      Production
```

### Protected Branches

**Обе ветки `main` и `development` защищены:**
- ✅ Требуется Pull Request для любых изменений
- ✅ Запрещен force push
- ✅ Запрещено удаление веток
- ✅ Enforce для администраторов

## Workflow процесс

### 1. Feature Development (Feature Branches)

```bash
# Создаем feature branch из development
git checkout development
git pull origin development
git checkout -b feature/my-feature

# Работаем над фичей
git add .
git commit -m "feat: implement my feature"
git push origin feature/my-feature
```

**Автоматически запускается**:
- Lint и typecheck
- Build test
- ❌ НЕ деплоится никуда

**Создаем PR в `development`**:
```bash
gh pr create --base development --title "feat: My Feature" --body "Description"
```

### 2. Beta Deployment (Development Branch)

После мерджа PR в `development`:

**Автоматически запускается**:
- ✅ Deploy на **beta.sr2.ru**
- Build version: `X.Y.Z-beta`

```bash
# Проверить деплой
curl -I https://beta.sr2.ru
```

### 3. Production Deployment (Main Branch)

Когда готовы к релизу:

```bash
# Создаем PR из development в main
gh pr create --base main --head development --title "Release v0.X.0" --body "Release notes"

# После мерджа PR
```

**Автоматически запускается**:
- ✅ Deploy на **sr2.ru**
- Build version: `X.Y.Z`

## Branch Protection Rules

### Что НЕЛЬЗЯ делать

❌ **Прямой push в `main`**:
```bash
git push origin main
# remote: error: GH006: Protected branch update failed
```

❌ **Прямой push в `development`**:
```bash
git push origin development
# remote: error: GH006: Protected branch update failed
```

❌ **Force push в protected branches**:
```bash
git push --force origin main
# remote: error: GH006: Cannot force-push to this branch
```

❌ **Мердж НЕ из development в main**:
- Можно мерджить только `development → main`
- Любые другие бранчи в `main` - запрещены

### Что МОЖНО делать

✅ **Создавать feature branches**:
```bash
git checkout -b feature/anything
git push origin feature/anything
```

✅ **Создавать PR в development**:
```bash
gh pr create --base development
```

✅ **Создавать PR из development в main**:
```bash
gh pr create --base main --head development
```

✅ **Мерджить PR через GitHub UI**:
- Требуется 0 reviewers (можно мерджить сразу)
- Все проверки должны пройти (CI)

## CI/CD Pipelines

### Feature Branch CI (`.github/workflows/feature-branch.yml`)

**Триггеры**:
- Push в любой branch кроме `main` и `development`
- Pull Request в `development` или `main`

**Jobs**:
1. `lint-and-typecheck`: Проверка кода (lint может fail, но typecheck обязателен)
2. `build-test`: Тестовый build

### Beta Deployment (`.github/workflows/deploy.yml`)

**Триггеры**:
- Push в `development` (через merge PR)
- Manual dispatch

**Target**: beta.sr2.ru

### Production Deployment (`.github/workflows/deploy-production.yml`)

**Триггеры**:
- Push в `main` (через merge PR)
- Manual dispatch

**Target**: sr2.ru

## Примеры сценариев

### Новая фича

```bash
# 1. Создать feature branch
git checkout development
git pull
git checkout -b feature/add-dark-mode

# 2. Разработка
git add .
git commit -m "feat: add dark mode toggle"
git push origin feature/add-dark-mode

# 3. Создать PR в development
gh pr create --base development --title "feat: Add dark mode" --web

# 4. После мерджа - автоматически деплоится на beta.sr2.ru
# Тестируем на бете

# 5. Когда готовы к релизу - создаем PR development → main
gh pr create --base main --head development --title "Release v0.4.0" --web

# 6. После мерджа - автоматически деплоится на sr2.ru
```

### Hotfix на production

```bash
# 1. Создать hotfix branch из main (!)
git checkout main
git pull
git checkout -b hotfix/critical-bug

# 2. Исправление
git add .
git commit -m "fix: critical security issue"
git push origin hotfix/critical-bug

# 3. Создать PR напрямую в main (исключение для hotfix)
gh pr create --base main --title "fix: Critical security issue" --web

# 4. После мерджа:
# - Деплоится на production
# - Синхронизировать обратно в development:
git checkout development
git pull origin main
git push origin development
```

## Emergency Procedures

### Откат деплоя

```bash
# 1. Найти предыдущий успешный коммит
git log --oneline -10

# 2. Создать revert коммит
git checkout main
git revert <commit-hash>
git push origin revert-branch

# 3. Создать PR и мерджить
gh pr create --base main --head revert-branch
```

### Временное отключение branch protection

**Только для экстренных случаев (как очистка git истории)**:

```bash
# Отключить
gh api repos/rayzru/sr2.ru/branches/main/protection -X DELETE

# Выполнить операцию
git push --force origin main

# ОБЯЗАТЕЛЬНО восстановить защиту
gh api repos/rayzru/sr2.ru/branches/main/protection -X PUT --input protection.json
```

## Monitoring

### Проверить статус деплоя

```bash
# Последние runs
gh run list --limit 5

# Конкретный run
gh run view <run-id>

# Watch текущего деплоя
gh run watch
```

### Проверить защиту веток

```bash
# Main
gh api repos/rayzru/sr2.ru/branches/main/protection | jq '{
  required_pr: .required_pull_request_reviews,
  force_push: .allow_force_pushes.enabled,
  deletions: .allow_deletions.enabled
}'

# Development
gh api repos/rayzru/sr2.ru/branches/development/protection | jq '.required_pull_request_reviews'
```

## Troubleshooting

### "Protected branch update failed"

**Причина**: Пытаетесь пушить напрямую в protected branch

**Решение**: Создайте PR
```bash
git checkout -b fix-branch
git push origin fix-branch
gh pr create --base development
```

### CI failing на feature branch

**Причина**: Lint или typecheck errors

**Решение**:
```bash
# Локально
bun run check  # lint + typecheck
bun run build  # проверить build

# Исправить ошибки и push
git add .
git commit -m "fix: resolve linting errors"
git push
```

### Деплой не запустился после merge

**Проверить**:
```bash
gh run list --branch development --limit 3
gh run list --branch main --limit 3
```

**Ручной запуск**:
```bash
gh workflow run deploy.yml  # Beta
gh workflow run deploy-production.yml  # Production
```

## Best Practices

1. ✅ **Всегда создавайте feature branch из `development`**
2. ✅ **Тестируйте на beta перед production**
3. ✅ **Используйте Conventional Commits** (feat:, fix:, docs:, etc.)
4. ✅ **Один PR = одна фича/фикс**
5. ✅ **Мерджите development → main только для релизов**
6. ❌ **Никогда не пушьте напрямую в main/development**
7. ❌ **Никогда не используйте force push на protected branches**

## Links

- Production: https://sr2.ru
- Beta: https://beta.sr2.ru
- GitHub Actions: https://github.com/rayzru/sr2.ru/actions
- Branch Protection: https://github.com/rayzru/sr2.ru/settings/branches
