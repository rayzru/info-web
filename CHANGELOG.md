# sr2-t3

## 0.3.0

### Minor Changes

- 2471cda: Add invisible anti-bot protection for registration

  **Multi-layered bot detection:**
  - Honeypot field - hidden input that bots auto-fill but humans don't see
  - Time token validation - ensures minimum 3 seconds spent on form
  - Browser fingerprinting - basic client environment validation
  - Rate limiting - max 5 registration attempts per IP per 15 minutes

  **Implementation:**
  - Client-side: Hidden honeypot field, auto-generated tokens
  - Server-side: Triple validation (honeypot + time + fingerprint)
  - All protections are invisible to legitimate users
  - Generic error messages prevent bot adaptation
  - In-memory rate limiting (consider Redis for production scale)

  **Security notes:**
  - No third-party dependencies (Cloudflare/Google blocked in Russia)
  - All validations fail silently with generic messages
  - Rate limiting uses IP from x-forwarded-for header

- 2471cda: Add build version badge in footer
  - Display build version badge next to theme picker in footer
  - Version is baked during build from package.json
  - Production shows "v0.2.3", beta shows "v0.2.3-beta"
  - Small monospace badge with muted style

### Patch Changes

- b22f20e: ## Critical deployment fix: S3 and SMTP environment variables

  Fixed production and beta deployment failures caused by missing environment variables.

  ### Fixed Issues
  - Runtime errors for S3 storage configuration (avatars, media uploads)
  - Missing SMTP configuration for email functionality
  - Applications started but failed on media/email operations

  ### Changes
  - Added S3\_\* environment variables to both Beta and Production workflows
  - Added SMTP\_\* environment variables for email sending
  - Created comprehensive deployment troubleshooting documentation
  - Created database migration workflow documentation

  ### Impact
  - ✅ Media uploads now work correctly
  - ✅ Email sending functionality restored
  - ✅ Deployments complete without runtime errors
  - ✅ Better documentation for future deployments

- 12ef49f: feat: добавлена загрузка подтверждающих документов к заявкам на недвижимость

  ## Новые функции
  - **Шаг 5 в PropertyWizard**: Пользователи могут загружать до 10 документов (PDF, JPEG, PNG, макс. 10MB каждый) при подаче заявки на недвижимость
  - **Типы документов**: ЕГРН выписка, Договор аренды/купли-продажи, Паспорт/ID, Другое
  - **Уведомление о конфиденциальности**: Четкая информация о временном хранении документов и соответствии требованиям защиты персональных данных
  - **Встроенный просмотр в админке**: Администраторы могут просматривать PDF и изображения прямо в браузере с возможностью скачивания
  - **Автоматическое удаление**: Документы помечаются для удаления через 60 дней после одобрения/отклонения заявки
  - **Cron-job очистки**: GitHub Actions workflow для ежедневной очистки устаревших документов

  ## Технические изменения

  ### База данных
  - Добавлено поле `scheduledForDeletion` (timestamp) в таблицу `claim_documents`
  - Добавлено поле `thumbnailUrl` в таблицу `claim_documents`
  - Добавлен индекс на `scheduledForDeletion` для эффективных cron-запросов

  ### Frontend
  - **Новый компонент**: `DocumentsForm` для загрузки документов с drag-and-drop
  - **Новый компонент**: `DocumentViewerDialog` для просмотра PDF и изображений
  - **Обновлен**: `PropertyWizard` с добавлением шага 5 для документов
  - **Обновлена**: Админ-панель заявок с встроенным просмотром документов

  ### Backend
  - **Обновлен**: `claims.admin.review` - автоматическая пометка документов на удаление при одобрении/отклонении
  - **Новый скрипт**: `cleanup-claim-documents.ts` для очистки устаревших документов

  ### DevOps
  - **Новый workflow**: `.github/workflows/cleanup-documents.yml` для ежедневной очистки (3:00 UTC)

  ### Константы
  - Увеличен `MAX_DOCUMENT_SIZE` с 5MB до 10MB
  - Добавлен `DOCUMENT_TYPES` с типизацией TypeScript

  ## Compliance & Privacy
  - Документы хранятся только на время рассмотрения заявки
  - Автоматическое удаление после принятия решения (одобрения/отклонения)
  - Система соответствует требованиям защиты персональных данных
  - Пользователи информированы о политике хранения данных и причинах запроса документов

## 0.2.0

### Minor Changes

- # Database Migrations: Buildings 4 & 5

  ## New Features

  ### Building Apartment Data
  - Added apartment data for Building 4 (253 apartments)
    - Single entrance with 24 floors
    - Apartments starting from floor 2
    - Layout identical to Building 2, entrance 1
  - Added apartment data for Building 5 (728 apartments)
    - 3 entrances with varying floor counts
    - Entrance 1: 222 apartments (floors 1-18, 20)
    - Entrance 2: 253 apartments (floors 2-24)
    - Entrance 3: 253 apartments (floors 2-24)
    - Special floor 20 layout with 6 apartments

  ### New Apartment Type
  - Added `4k` (4-room) apartment type to database schema
    - Required for Building 5, floor 20 (apartments 218, 221, 222)
    - Updated TypeScript schema and PostgreSQL enum

  ### Database
  - Migration 0025b: Add `4k` apartment type enum value
  - Migration 0026: Add Building 5 apartments (728 total)
  - Migration 0027: Add Building 4 apartments (253 total)

  ### Documentation
  - Comprehensive migration guides with verification queries
  - Detailed floor plan analysis
  - Rollback instructions for all migrations

  ## Database Statistics

  Total apartments across all 7 buildings: **3,085**

  By apartment type:
  - Studio: 358 apartments
  - 1k (1-room): 1,663 apartments
  - 2k (2-room): 733 apartments
  - 3k (3-room): 328 apartments
  - 4k (4-room): 3 apartments ⚡ NEW

  ## Files Added

  ### Migrations
  - `drizzle/0025b_add_4k_apartment_type.sql`
  - `drizzle/0026_add_building5_apartments.sql`
  - `drizzle/0027_add_building4_apartments.sql`

  ### Documentation
  - `drizzle/0025b_README.md`
  - `drizzle/0026_README.md`
  - `drizzle/0027_README.md`
  - `drizzle/building5-apartments-analysis.md`
  - `BUILDING4_MIGRATION_SUMMARY.md`
  - `BUILDING5_MIGRATION_SUMMARY.md`
  - `MIGRATIONS_COMPLETE_SUMMARY.md`

  ### Schema Updates
  - Updated `src/server/db/schemas/buildings.ts` with `4k` apartment type
