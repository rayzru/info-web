---
"info-web": minor
---

## DevOps: Complete Deployment Workflow

Настроен полный workflow для безопасного деплоя через Pull Requests.

### Структура деплоя

```
feature/* → development (beta) → main (production)
    ↓           ↓                   ↓
   CI        Beta Deploy        Prod Deploy
```

### Branch Protection

**Main и Development - полностью защищены**:
- ✅ Требуется Pull Request для любых изменений
- ✅ Запрещен force push
- ✅ Запрещено удаление веток
- ✅ Enforce для администраторов

**Правила мерджа**:
- Feature branches → **только** в `development`
- `development` → **только** в `main`
- Любые другие мерджи в `main` - **запрещены**

### CI/CD Pipelines

**Feature Branch CI** (`.github/workflows/feature-branch.yml`):
- Запускается на push в feature branches
- Запускается на PR в development/main
- Проверяет: lint, typecheck, build

**Beta Deployment** (development branch):
- Автоматический деплой на `beta.sr2.ru`
- Build version: `X.Y.Z-beta`

**Production Deployment** (main branch):
- Автоматический деплой на `sr2.ru`
- Build version: `X.Y.Z`
- Только через PR из `development`

### Workflow процесс

1. Создать feature branch из `development`
2. Разработка и push
3. Создать PR в `development`
4. Merge → автоматический деплой на beta
5. Тестирование на beta
6. Создать PR из `development` в `main`
7. Merge → автоматический деплой на production

### Документация

Полная документация в `DEPLOYMENT_WORKFLOW.md`:
- Примеры команд
- Best practices
- Troubleshooting
- Emergency procedures

**Breaking Change**: Теперь невозможен прямой push в `main` и `development`. Все изменения только через PR.
