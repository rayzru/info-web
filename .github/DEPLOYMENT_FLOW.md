# 🚀 Deployment Flow Diagram

## 📊 Визуальная схема деплоя

```
┌─────────────────────────────────────────────────────────────────┐
│                     DEVELOPMENT WORKFLOW                        │
└─────────────────────────────────────────────────────────────────┘

┌──────────────┐
│   Feature    │
│   Branch     │  git checkout -b feature/my-feature
│ (локально)   │  bun run dev
└──────┬───────┘
       │
       │ PR → development
       ▼
┌──────────────┐       Автоматически        ┌──────────────┐
│ development  │ ───────деплой────────────► │     BETA     │
│   (ветка)    │    deploy.yml              │ beta.sr2.ru  │
└──────┬───────┘                            └──────────────┘
       │                                            │
       │ Тестирование на Beta ✓                    │
       │ QA проверка ✓                             │
       │                                            │
       │ git merge development                     │
       │ bun run version                           │
       │ git tag v0.3.0                            │
       ▼                                            │
┌──────────────┐       Автоматически        ┌──────────────┐
│     main     │ ───────деплой────────────► │  PRODUCTION  │
│   (ветка)    │  deploy-production.yml     │   sr2.ru     │
└──────────────┘                            └──────────────┘
```

## 🔄 Детальный процесс

### 1. Локальная разработка

```bash
# Создать feature branch
git checkout -b feature/new-feature

# Разработка
bun run dev  # localhost:3000

# Тестирование
bun run check
bun run build

# Создать changeset (для будущего релиза)
bun run changeset:add

# Commit
git add .
git commit -m "feat: new feature"
git push origin feature/new-feature
```

### 2. Деплой на Beta

```bash
# Create PR: feature/new-feature → development
# После merge:

git checkout development
git pull origin development
# 🤖 GitHub Action автоматически деплоит на beta.sr2.ru

# Проверка на beta.sr2.ru
# - Авторизация работает?
# - Новая фича работает?
# - Нет ошибок?
```

**GitHub Action выполняет**:
1. ✅ Checkout code
2. ✅ Install dependencies
3. ✅ Build application
4. ✅ Deploy to beta server via SSH
5. ✅ Restart PM2 (sr2-beta)
6. ✅ Keep 5 latest releases

### 3. Релиз в Production

```bash
# Анализ изменений между development и main
bun run release:analyze development main
bun run release:summarize development main

# Review RELEASE_SUMMARY.md

# Merge в main
git checkout main
git merge development

# Создание версии
bun run version  # Обновляет package.json, CHANGELOG.md

# Создание тега
git tag -a "v0.3.0" -m "Release v0.3.0"

# Push
git push origin main --follow-tags

# 🤖 GitHub Action автоматически деплоит на sr2.ru

# Создание GitHub релиза
bun run release:github
```

**GitHub Action выполняет**:
1. ✅ Checkout code
2. ✅ Install dependencies
3. ✅ Build application
4. ✅ Deploy to production server via SSH
5. ✅ Restart PM2 (sr2)
6. ✅ Keep 5 latest releases

## 📂 Структура релизов на сервере

```
/app/releases/
├── 2026-02-14T10-30-00Z/  # Старый релиз
├── 2026-02-14T11-00-00Z/  # Старый релиз
├── 2026-02-14T12-00-00Z/  # Старый релиз
├── 2026-02-14T13-00-00Z/  # Предыдущий релиз
├── 2026-02-14T14-00-00Z/  # Текущий релиз
│   ├── .next/
│   ├── .env
│   ├── server.js
│   └── ecosystem.config.cjs
└── current -> 2026-02-14T14-00-00Z/  # Symlink на текущий
```

**PM2 использует**: `current/ecosystem.config.cjs`

## 🔥 Горячие команды

### Проверка статуса

```bash
# Локально
git status
git log --oneline -10

# На Beta сервере
ssh user@beta.sr2.ru
pm2 status sr2-beta
pm2 logs sr2-beta --lines 50

# На Production сервере
ssh user@sr2.ru
pm2 status sr2
pm2 logs sr2 --lines 50
```

### Откат (Rollback)

```bash
# На сервере
cd /app
ls -la releases/  # Найти предыдущий релиз
rm current
ln -s releases/2026-02-14T13-00-00Z current
pm2 restart sr2
```

## 🎯 Checklist перед деплоем

### Beta
- [ ] Код прошел review
- [ ] Локальные тесты проходят
- [ ] Changeset создан (если feature)
- [ ] Merged в development
- [ ] ✨ Автоматический деплой на beta.sr2.ru

### Production
- [ ] Протестировано на Beta
- [ ] `bun run release:analyze development main`
- [ ] `bun run release:summarize development main`
- [ ] `bun run version` выполнен
- [ ] Git tag создан
- [ ] Backup БД (если нужно)
- [ ] ✨ Автоматический деплой на sr2.ru
- [ ] GitHub релиз создан

## 🚨 Troubleshooting

### Деплой завис

```bash
# Проверить GitHub Actions
# https://github.com/rayzru/info-web/actions

# Проверить SSH соединение
ssh user@beta.sr2.ru "echo OK"

# Проверить PM2 на сервере
ssh user@beta.sr2.ru "pm2 status"
```

### Сайт не открывается после деплоя

```bash
# Проверить PM2 логи
ssh user@sr2.ru "pm2 logs sr2 --lines 100"

# Проверить .env файл
ssh user@sr2.ru "cat /app/current/.env | grep DATABASE_URL"

# Перезапустить PM2
ssh user@sr2.ru "pm2 restart sr2"
```

### База данных не работает

```bash
# Проверить соединение с БД
ssh user@sr2.ru "psql \$DATABASE_URL -c 'SELECT 1'"

# Проверить миграции
ssh user@sr2.ru "cd /app/current && bun run db:migrate"
```

## 📚 Документация

- [ENVIRONMENTS.md](ENVIRONMENTS.md) - Описание окружений
- [CLEANUP_PREVIEW.md](CLEANUP_PREVIEW.md) - Удаление Preview
- [../VERSIONING.md](../VERSIONING.md) - Версионирование
- [../RELEASE_GUIDE.md](../RELEASE_GUIDE.md) - Гайд по релизам

---

**Текущие окружения**:
- ✅ Local: localhost:3000
- ✅ Beta: beta.sr2.ru (branch: development)
- ✅ Production: sr2.ru (branch: main)
- ❌ Preview: **не используется, можно удалить**
