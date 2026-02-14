# 🗄️ Database Migrations Guide

## 📋 Overview

Этот проект использует **Drizzle ORM** для управления миграциями базы данных.

**Текущая структура БД**: 3 независимые базы данных
- **Local**: PostgreSQL Docker (`sr2-community`)
- **Beta**: PostgreSQL на сервере (`beta_sr2`)
- **Production**: PostgreSQL на сервере (`sr2`)

## 🔄 Workflow миграций

```
Local (разработка)
  ↓ создание миграции
  ↓ тестирование
  ↓ commit + push → development
  ↓
Beta (автодеплой)
  ↓ применение миграции
  ↓ тестирование
  ↓ merge → main
  ↓
Production (автодеплой)
  ↓ применение миграции
  ↓ verification
  ✓
```

## 🛠️ Создание миграции локально

### Шаг 1: Изменить схему

Отредактировать файлы в `src/server/db/schemas/`:

```typescript
// Example: добавить новое поле
export const users = createTable("user", {
  // ... existing fields
  newField: varchar("new_field", { length: 255 }),
});
```

### Шаг 2: Генерация миграции

```bash
bun run db:generate
```

Это создаст файл в `drizzle/XXXX_name.sql`

### Шаг 3: Проверка SQL

Открыть созданный SQL файл и проверить:
- ✅ Корректность SQL синтаксиса
- ✅ Нет DROP операций (если не намеренно)
- ✅ Правильные типы данных

### Шаг 4: Применение локально

```bash
bun run db:push
# или
bun run db:migrate
```

### Шаг 5: Тестирование

```bash
bun run dev
# Проверить что приложение работает
# Проверить что данные корректны
```

### Шаг 6: Commit

```bash
git add drizzle/
git add src/server/db/schemas/
git commit -m "feat(db): add new_field to users table"
```

## 🚀 Применение на серверах

### Автоматическое (через GitHub Actions)

После push в `development` или `main`:
1. ✅ GitHub Action собирает приложение
2. ✅ Деплоит на сервер
3. ⚠️ **ВАЖНО**: Миграции НЕ применяются автоматически (пока)

### Ручное применение

#### Production:

```bash
# 1. BACKUP БД!
ssh root@rayz.ru "pg_dump -U sr2_usr sr2 > /tmp/sr2_backup_$(date +%Y%m%d_%H%M%S).sql"

# 2. Скопировать миграцию
scp drizzle/XXXX_name.sql root@rayz.ru:/tmp/

# 3. Применить в транзакции
ssh root@rayz.ru "
psql postgresql://sr2_usr:password1234axdasdasWD@localhost:5432/sr2 << 'EOSQL'
BEGIN;
\i /tmp/XXXX_name.sql

-- Проверка
SELECT COUNT(*) FROM table_name;

-- Если ОК:
COMMIT;
-- Если НЕ ОК:
-- ROLLBACK;
EOSQL
"

# 4. Verify
ssh root@rayz.ru "
psql postgresql://sr2_usr:password1234axdasdasWD@localhost:5432/sr2 -c 'SELECT * FROM table_name LIMIT 5;'
"

# 5. Restart app
ssh root@rayz.ru "pm2 restart sr2"
```

#### Beta (то же самое, но другая БД):

```bash
# Если Beta использует отдельную БД:
ssh root@rayz.ru "
psql postgresql://beta_sr2_usr:password@localhost:5432/beta_sr2 \
  -f /tmp/XXXX_name.sql
"
ssh root@rayz.ru "pm2 restart sr2-beta"
```

## 📊 Проверка применения миграций

### Проверить количество записей

```bash
# Local
docker compose exec -T database psql -U postgres -d sr2-community -c \
  "SELECT COUNT(*) as total FROM apartment;"

# Production
ssh root@rayz.ru "
psql postgresql://sr2_usr:password1234axdasdasWD@localhost:5432/sr2 -c \
  'SELECT COUNT(*) as total FROM apartment;'
"

# Beta
ssh root@rayz.ru "
psql postgresql://beta_sr2_usr:password@localhost:5432/beta_sr2 -c \
  'SELECT COUNT(*) as total FROM apartment;'
"
```

### Проверить структуру таблицы

```bash
ssh root@rayz.ru "
psql postgresql://sr2_usr:password1234axdasdasWD@localhost:5432/sr2 -c \
  '\d+ table_name'
"
```

## 🔙 Откат миграции

### Если миграция еще не применена

Просто не применяйте её! Удалите SQL файл и измените схему обратно.

### Если миграция уже применена

#### Вариант 1: Rollback SQL

Создать обратную миграцию вручную:

```sql
-- drizzle/YYYY_rollback_XXXX.sql
ALTER TABLE users DROP COLUMN new_field;
```

#### Вариант 2: Restore из backup

```bash
# Восстановить из backup
ssh root@rayz.ru "
psql -U sr2_usr sr2 < /tmp/sr2_backup_20260214_100000.sql
"
```

## ⚠️ Критические правила

### ✅ DO:
- ✅ Всегда делать backup перед применением на production
- ✅ Тестировать миграции на local
- ✅ Проверять миграции на Beta перед production
- ✅ Использовать транзакции (BEGIN/COMMIT)
- ✅ Проверять результаты после применения

### ❌ DON'T:
- ❌ Не применять миграции напрямую на production без backup
- ❌ Не делать DROP операции без подтверждения
- ❌ Не применять миграции во время активного использования (делать в maintenance window)
- ❌ Не забывать про индексы при добавлении больших таблиц
- ❌ Не применять миграции которые не тестировались

## 📋 Checklist перед применением на Production

**Перед применением ЛЮБОЙ миграции на Production**:

- [ ] Миграция протестирована локально
- [ ] Миграция применена и проверена на Beta
- [ ] Создан backup production БД
- [ ] Пользователи предупреждены (если downtime)
- [ ] Миграция написана с использованием транзакций
- [ ] Есть план отката (rollback SQL или backup restore)
- [ ] Проверены зависимости (foreign keys, indexes)
- [ ] Оценено время выполнения (для больших таблиц)
- [ ] PM2 готов к рестарту приложения
- [ ] Есть план мониторинга после применения

## 🔧 Полезные команды

### Drizzle

```bash
# Генерация миграции
bun run db:generate

# Применение миграций
bun run db:migrate

# Push схемы (без миграций)
bun run db:push

# Drizzle Studio (GUI)
bun run db:studio
```

### PostgreSQL

```bash
# Подключение к БД
psql postgresql://user:password@host:5432/database

# Список таблиц
\dt

# Описание таблицы
\d+ table_name

# Выполнить SQL файл
\i /path/to/file.sql

# Выполнить SQL команду
\c database_name
SELECT * FROM table_name LIMIT 10;
```

### Backup & Restore

```bash
# Backup
pg_dump -U user database > backup.sql

# Backup с сжатием
pg_dump -U user database | gzip > backup.sql.gz

# Restore
psql -U user database < backup.sql

# Restore из gz
gunzip -c backup.sql.gz | psql -U user database
```

## 🚨 Troubleshooting

### Миграция не применяется

```bash
# Проверить последнюю примененную миграцию
psql $DATABASE_URL -c "SELECT * FROM __drizzle_migrations ORDER BY id DESC LIMIT 5;"

# Проверить логи
pm2 logs sr2 --lines 100 | grep -i "migration"
```

### Конфликт миграций

```bash
# Откатить последнюю миграцию
# Внимание: делать только если вы уверены!
psql $DATABASE_URL << 'EOSQL'
BEGIN;
-- ваш rollback SQL
COMMIT;
EOSQL

# Удалить запись о миграции
psql $DATABASE_URL -c "DELETE FROM __drizzle_migrations WHERE name = 'XXXX_name';"
```

### БД не отвечает

```bash
# Проверить статус PostgreSQL
ssh root@rayz.ru "systemctl status postgresql"

# Проверить соединения
ssh root@rayz.ru "psql -U postgres -c 'SELECT count(*) FROM pg_stat_activity;'"

# Перезапустить PostgreSQL (осторожно!)
ssh root@rayz.ru "systemctl restart postgresql"
```

## 📚 Примеры миграций

### Добавление поля

```sql
ALTER TABLE users ADD COLUMN phone VARCHAR(20);
```

### Создание таблицы

```sql
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id),
  message TEXT NOT NULL,
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
```

### Изменение типа поля

```sql
ALTER TABLE users ALTER COLUMN email TYPE VARCHAR(255);
```

### Добавление индекса

```sql
CREATE INDEX idx_users_email ON users(email);
```

---

**Related**:
- [DEPLOYMENT_FIX_PLAN.md](../DEPLOYMENT_FIX_PLAN.md)
- [DEPLOYMENT_FLOW.md](DEPLOYMENT_FLOW.md)
- [ENVIRONMENTS.md](ENVIRONMENTS.md)
