---
"sr2-t3": minor
---

feat(logging): add centralized pino logger

**Centralized Logger:**
- Pino-based structured logging
- Pretty output in development
- JSON format in production
- Specialized loggers for modules (auth, email, telegram, s3, http, db, cron)

**Console.log Replacement:**
- Replaced 240+ console.log/error/warn calls
- Telegram notifications now use telegramLogger
- Email service uses emailLogger
- Auth operations use authLogger
- S3 operations use s3Logger
- tRPC procedures use httpLogger

**Logger Features:**
- Automatic context inclusion (module, env, service)
- Error serialization with stack traces
- ISO timestamps
- Helper functions: logError(), logSuccess(), logWarning()

This improves observability, enables structured log aggregation, and makes debugging easier in production.
