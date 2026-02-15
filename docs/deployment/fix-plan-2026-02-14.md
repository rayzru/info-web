# 🚨 План исправления деплоев и синхронизации БД

**Дата**: 2026-02-14
**Статус**: КРИТИЧНО - требуется немедленное исправление

## 📊 Текущая ситуация

### Проблема 1: Ошибки деплоя - отсутствуют S3 переменные

**Симптомы**:
```
Error: Invalid environment variables
- S3_URL: expected string, received undefined
- S3_ACCESS_KEY: expected string, received undefined
- S3_SECRET_KEY: expected string, received undefined
- S3_BUCKET: expected string, received undefined
- S3_REGION: expected string, received undefined
```

**Причина**: В `.github/workflows/deploy.yml` и `deploy-production.yml` не добавлены S3 переменные окружения

**Влияние**: Приложение запускается, но при попытке загрузить медиа (аватары, изображения) возникают ошибки

### Проблема 2: БД не синхронизирована между окружениями

**Текущее состояние**:

| Окружение | Квартир в БД | Миграции | Статус |
|-----------|--------------|----------|--------|
| Local | 3085 ✅ | Все применены (0025b, 0026, 0027) | Актуально |
| Beta | ❓ (не проверено) | ❓ | Неизвестно |
| Production | 2104 ❌ | Старые (без Buildings 4 & 5) | Устарело |

**Проблема**:
- Миграции Buildings 4 & 5 (981 квартир) не применены на Beta и Production
- Нет автоматической синхронизации миграций при деплое

## 🎯 План исправления

### Этап 1: Исправление S3 переменных в workflows ⚡ СРОЧНО

**Задача**: Добавить S3 переменные в deploy workflows

**Файлы**:
- `.github/workflows/deploy.yml` (Beta)
- `.github/workflows/deploy-production.yml` (Production)

**Что добавить**:
```yaml
# В секцию env файла .env (строки 137-164)
# S3 Storage
S3_URL="$S3_URL"
S3_ACCESS_KEY="$S3_ACCESS_KEY"
S3_SECRET_KEY="$S3_SECRET_KEY"
S3_BUCKET="$S3_BUCKET"
S3_REGION="$S3_REGION"
S3_PUBLIC_URL="$S3_PUBLIC_URL"

# SMTP (if not already there)
SMTP_HOST="$SMTP_HOST"
SMTP_PORT="$SMTP_PORT"
SMTP_SECURE="$SMTP_SECURE"
SMTP_USER="$SMTP_USER"
SMTP_PASSWORD="$SMTP_PASSWORD"
SMTP_FROM_NAME="$SMTP_FROM_NAME"
SMTP_FROM_EMAIL="$SMTP_FROM_EMAIL"
SMTP_REPLY_TO="$SMTP_REPLY_TO"
```

**И в секцию env variables (строки 194-220)**:
```yaml
S3_URL: ${{ secrets.S3_URL }}
S3_ACCESS_KEY: ${{ secrets.S3_ACCESS_KEY }}
S3_SECRET_KEY: ${{ secrets.S3_SECRET_KEY }}
S3_BUCKET: ${{ secrets.S3_BUCKET }}
S3_REGION: ${{ secrets.S3_REGION }}
S3_PUBLIC_URL: ${{ secrets.S3_PUBLIC_URL }}
SMTP_HOST: ${{ secrets.SMTP_HOST }}
SMTP_PORT: ${{ secrets.SMTP_PORT }}
SMTP_SECURE: ${{ secrets.SMTP_SECURE }}
SMTP_USER: ${{ secrets.SMTP_USER }}
SMTP_PASSWORD: ${{ secrets.SMTP_PASSWORD }}
SMTP_FROM_NAME: ${{ secrets.SMTP_FROM_NAME }}
SMTP_FROM_EMAIL: ${{ secrets.SMTP_FROM_EMAIL }}
SMTP_REPLY_TO: ${{ secrets.SMTP_REPLY_TO }}
```

**Priority**: 🔴 КРИТИЧНО

---

### Этап 2: Синхронизация БД миграций 🗄️

**Задача**: Применить миграции Buildings 4 & 5 на Beta и Production

#### 2.1. Проверка текущих миграций

```bash
# На Beta
ssh root@rayz.ru "cd /var/www/sr2/data/www/beta.sr2.ru/current && \
  psql \$DATABASE_URL -c 'SELECT COUNT(*) FROM apartment;'"

# На Production
ssh root@rayz.ru "cd /var/www/sr2/data/www/sr2.ru/current && \
  psql \$DATABASE_URL -c 'SELECT COUNT(*) FROM apartment;'"
```

#### 2.2. Backup БД ПЕРЕД миграцией

```bash
# Production backup
ssh root@rayz.ru "pg_dump -U sr2_usr sr2 > /tmp/sr2_backup_$(date +%Y%m%d_%H%M%S).sql"

# Beta backup (если используется отдельная БД)
ssh root@rayz.ru "pg_dump -U beta_sr2_usr beta_sr2 > /tmp/beta_sr2_backup_$(date +%Y%m%d_%H%M%S).sql"
```

#### 2.3. Копирование миграций на сервер

```bash
# Скопировать миграции
scp drizzle/0025b_add_4k_apartment_type.sql root@rayz.ru:/tmp/
scp drizzle/0026_add_building5_apartments.sql root@rayz.ru:/tmp/
scp drizzle/0027_add_building4_apartments.sql root@rayz.ru:/tmp/
```

#### 2.4. Применение миграций

**На Production**:
```bash
ssh root@rayz.ru "
# 1. Add 4k apartment type
psql postgresql://sr2_usr:password1234axdasdasWD@localhost:5432/sr2 \
  -f /tmp/0025b_add_4k_apartment_type.sql

# 2. Add Building 5 apartments
psql postgresql://sr2_usr:password1234axdasdasWD@localhost:5432/sr2 -c 'BEGIN;'
psql postgresql://sr2_usr:password1234axdasdasWD@localhost:5432/sr2 \
  -f /tmp/0026_add_building5_apartments.sql

# Verify
psql postgresql://sr2_usr:password1234axdasdasWD@localhost:5432/sr2 -c \
  'SELECT COUNT(*) FROM apartment WHERE floor_id IN (
     SELECT f.id FROM floor f
     JOIN entrance e ON f.entrance_id = e.id
     JOIN building b ON e.building_id = b.id
     WHERE b.number = 5
   );'

# If OK:
psql postgresql://sr2_usr:password1234axdasdasWD@localhost:5432/sr2 -c 'COMMIT;'

# 3. Add Building 4 apartments
psql postgresql://sr2_usr:password1234axdasdasWD@localhost:5432/sr2 -c 'BEGIN;'
psql postgresql://sr2_usr:password1234axdasdasWD@localhost:5432/sr2 \
  -f /tmp/0027_add_building4_apartments.sql

# Verify
psql postgresql://sr2_usr:password1234axdasdasWD@localhost:5432/sr2 -c \
  'SELECT COUNT(*) FROM apartment WHERE floor_id IN (
     SELECT f.id FROM floor f
     JOIN entrance e ON f.entrance_id = e.id
     JOIN building b ON e.building_id = b.id
     WHERE b.number = 4
   );'

# If OK:
psql postgresql://sr2_usr:password1234axdasdasWD@localhost:5432/sr2 -c 'COMMIT;'

# Final verification
psql postgresql://sr2_usr:password1234axdasdasWD@localhost:5432/sr2 -c \
  'SELECT COUNT(*) FROM apartment;'
# Should return 3085
"
```

**Priority**: 🔴 КРИТИЧНО

---

### Этап 3: Автоматизация миграций в deploy workflow 🤖

**Задача**: Добавить автоматический запуск миграций при деплое

**Где**: В `.github/workflows/deploy.yml` и `deploy-production.yml`

**Что добавить** (после upload release, перед restart PM2):

```yaml
- name: Run database migrations
  run: |
    echo "=== Running database migrations ==="
    ssh "$USER@$HOST" "
      cd $TARGET/current

      # Check if drizzle-kit is available
      if [ -f node_modules/.bin/drizzle-kit ]; then
        echo 'Running drizzle migrations...'
        bun run db:migrate
      else
        echo 'Warning: drizzle-kit not found, skipping migrations'
      fi

      # Verify migration success
      echo 'Checking apartment count...'
      psql \$DATABASE_URL -c 'SELECT COUNT(*) as total FROM apartment;'
    "
  env:
    USER: ${{ secrets.SSH_USER }}
    HOST: ${{ secrets.SSH_HOST }}
    TARGET: ${{ secrets.SSH_TARGET_DIR }}
```

**Priority**: 🟡 ВАЖНО (после Этапа 2)

---

### Этап 4: Стратегия синхронизации БД между окружениями 📋

**Вариант 1: Отдельные БД для каждого окружения** (РЕКОМЕНДУЕТСЯ)

Плюсы:
- ✅ Полная изоляция данных
- ✅ Безопасное тестирование на Beta
- ✅ Можно откатить Beta без влияния на Production

Минусы:
- ❌ Нужно синхронизировать структуру
- ❌ Тестовые данные отличаются от production

**Реализация**:
```
Local:      PostgreSQL Docker (sr2-community)
Beta:       PostgreSQL на сервере (beta_sr2)
Production: PostgreSQL на сервере (sr2)
```

**Процесс синхронизации**:
```
Local (разработка)
  ↓ git push → development
Beta (автодеплой + auto-migrate)
  ↓ тестирование ✓
  ↓ git push → main
Production (автодеплой + auto-migrate)
```

**Вариант 2: Shared БД между Beta и Production** (НЕ РЕКОМЕНДУЕТСЯ)

Плюсы:
- ✅ Одинаковые данные
- ✅ Не нужно синхронизировать

Минусы:
- ❌ Риск повредить production данные при тестировании на Beta
- ❌ Нельзя откатить Beta отдельно

---

### Этап 5: Документация процесса миграций 📚

**Создать файл**: `.github/DATABASE_MIGRATIONS.md`

Содержание:
- Как создавать миграции локально
- Как тестировать миграции
- Как проверять применение миграций на серверах
- Как откатывать миграции
- Checklist перед применением на production

---

## 🚀 Порядок выполнения

### Немедленно (сегодня):

1. ✅ Зафиксировать текущие проблемы (done)
2. 🔴 Исправить S3 переменные в workflows
3. 🔴 Создать backup production БД
4. 🔴 Применить миграции Buildings 4 & 5 вручную на production
5. 🔴 Проверить работу сайта после миграций

### Завтра:

6. 🟡 Добавить автоматические миграции в deploy workflows
7. 🟡 Создать документацию по миграциям
8. 🟡 Протестировать весь процесс на Beta

### На неделе:

9. 🟢 Настроить отдельные БД для Beta (если еще не настроено)
10. 🟢 Создать скрипт для синхронизации структуры БД между окружениями

---

## 📝 Checklist для массивного апдейта

Перед применением больших изменений:

### Local:
- [ ] Все миграции применены (`bun run db:migrate`)
- [ ] Приложение работает (`bun run dev`)
- [ ] Тесты проходят (`bun run check`)
- [ ] Changeset создан (`bun run changeset:add`)

### Development branch:
- [ ] Push в development
- [ ] Проверить GitHub Actions (должен пройти успешно)
- [ ] Проверить Beta deployment
- [ ] Проверить Beta сайт работает
- [ ] Проверить Beta БД (количество записей)

### Main branch (Production):
- [ ] **BACKUP БД!** (`pg_dump`)
- [ ] Merge development → main
- [ ] Версия обновлена (`bun run version`)
- [ ] Git tag создан
- [ ] Push в main
- [ ] Проверить GitHub Actions
- [ ] Проверить Production deployment
- [ ] Проверить Production сайт работает
- [ ] Проверить Production БД (количество записей)
- [ ] GitHub релиз создан

---

## 🔧 Полезные команды

### Проверка БД на серверах:

```bash
# Production - количество квартир
ssh root@rayz.ru "psql postgresql://sr2_usr:password1234axdasdasWD@localhost:5432/sr2 -c 'SELECT COUNT(*) FROM apartment;'"

# Production - по зданиям
ssh root@rayz.ru "psql postgresql://sr2_usr:password1234axdasdasWD@localhost:5432/sr2 -c 'SELECT b.number, COUNT(a.id) FROM building b LEFT JOIN entrance e ON e.building_id = b.id LEFT JOIN floor f ON f.entrance_id = e.id LEFT JOIN apartment a ON a.floor_id = f.id GROUP BY b.number ORDER BY b.number;'"
```

### Проверка PM2:

```bash
ssh root@rayz.ru "pm2 status"
ssh root@rayz.ru "pm2 logs sr2 --lines 50 --nostream"
ssh root@rayz.ru "pm2 logs sr2-beta --lines 50 --nostream"
```

### Restart приложений:

```bash
ssh root@rayz.ru "pm2 restart sr2"
ssh root@rayz.ru "pm2 restart sr2-beta"
```

---

**Next Steps**: Начать с Этапа 1 - исправление S3 переменных
