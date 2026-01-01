# Technical Specification: dev-automation Agent

## Metadata
- **Issue**: Internal - New Agent
- **Created**: 2025-12-14
- **Author**: Feature Planner Agent
- **Status**: Draft
- **Complexity**: Medium

## Executive Summary

Создание агента `dev-automation` для управления локальной средой разработки T3 Stack проекта и валидации UI изменений через Playwright MCP и Chrome DevTools MCP. Агент служит точкой входа и выхода для UI/UX разработки.

## Agent Definition

### Frontmatter
```yaml
---
name: dev-automation
description: Development environment automation agent. Manages Docker/PostgreSQL dev environment, validates UI changes with Playwright/Chrome DevTools MCP.
---
```

### Purpose

Управление локальной средой разработки и валидация UI/UX изменений:
- Проверка и управление Docker-контейнерами (PostgreSQL)
- Валидация UI изменений через Playwright MCP
- Мониторинг консоли и сети через Chrome DevTools MCP
- Точка входа/выхода для UI/UX feature development

## When to Use

**Use `@dev-automation` when**:
- Начало UI/UX разработки (проверка среды)
- Валидация UI изменений после реализации
- Проверка health/status среды разработки
- Визуальная регрессия или проверка изменений
- Мониторинг производительности (Core Web Vitals)

**Use `@e2e-test-specialist` instead when**:
- Нужны формальные E2E тест-сьюты
- CI/CD интеграция тестов
- Cross-browser тестирование

## Environment Configuration

### URLs

| Service | URL | Description |
|---------|-----|-------------|
| Frontend | http://localhost:3000 | Next.js development server |
| tRPC API | http://localhost:3000/api/trpc | tRPC endpoint |
| Drizzle Studio | http://localhost:4983 | Database UI (via `bun run db:studio`) |

### Docker Services

```yaml
PostgreSQL:
  Image: postgres:latest
  Port: 5432
  Database: sr2-community
  User: postgres
  Password: postgres
```

### Commands

```bash
# Docker
docker compose up -d      # Start PostgreSQL
docker compose down       # Stop PostgreSQL
docker compose logs -f    # View logs
docker compose ps         # Check status

# Database
bun run db:push          # Apply schema changes
bun run db:studio        # Open Drizzle Studio
bun run db:seed          # Seed test data
bun run db:reset:full    # Reset + push + seed

# Development
bun run dev              # Start Next.js dev server
bun run build            # Production build
bun run check            # Lint + typecheck
```

### Authentication

**Provider**: Yandex OAuth via NextAuth v5

**Development Mode**:
- Требуется настроенный Yandex OAuth app
- Или использовать тестовые данные из seed

**Test Accounts** (после `bun run db:seed`):
- Проверить seed.ts для актуальных тестовых пользователей

## MCP Integration

### Playwright MCP (UI Validation)

| Tool | Purpose | Priority |
|------|---------|----------|
| `browser_navigate` | Навигация к страницам | High |
| `browser_snapshot` | DOM queries (предпочтительно vs screenshots) | High |
| `browser_fill_form` | Batch заполнение форм | Medium |
| `browser_click` | Клики по элементам | High |
| `browser_wait_for` | Ожидание состояний | Medium |
| `browser_take_screenshot` | Визуальные доказательства (экономно) | Low |

### Chrome DevTools MCP (Analysis)

| Tool | Purpose | Priority |
|------|---------|----------|
| `list_console_messages` | Проверка JS ошибок | High |
| `list_network_requests` | Верификация tRPC вызовов | Medium |
| `take_screenshot` | Визуальная документация | Low |

## Workflow

### Pre-Development Check

```yaml
Steps:
  1. Verify Docker:
     - docker compose ps
     - Ensure PostgreSQL is running

  2. Start if needed:
     - docker compose up -d
     - Wait for healthy status

  3. Verify Database:
     - Check DATABASE_URL in .env
     - bun run db:push (if schema changes)

  4. Start Dev Server:
     - bun run dev
     - Verify http://localhost:3000

  5. Baseline State:
     - Navigate to target pages
     - Capture initial state if needed
```

### Post-Development Validation

```yaml
Steps:
  1. Navigate to changed pages:
     - browser_navigate({ url: "http://localhost:3000/..." })

  2. Verify functionality:
     - browser_snapshot for DOM validation
     - Test interactive elements

  3. Check for errors:
     - list_console_messages({ types: ["error", "warning"] })

  4. Verify tRPC calls:
     - list_network_requests
     - Check for failed requests

  5. Visual regression (if needed):
     - browser_take_screenshot for evidence
```

## Data-testid Conventions

Для селекторов в T3 Stack проекте:

| Domain | Pattern | Examples |
|--------|---------|----------|
| Auth | `auth-{element}` | `auth-email-input`, `auth-submit-btn` |
| Nav | `nav-{destination}` | `nav-home`, `nav-profile` |
| Form | `form-{name}-{field}` | `form-login-email`, `form-login-submit` |
| Card | `card-{type}-{id}` | `card-listing-123` |
| Modal | `modal-{name}` | `modal-confirm`, `modal-edit` |
| Button | `btn-{action}` | `btn-save`, `btn-cancel` |

## Quick Patterns

### Navigation Check
```javascript
// Navigate and verify
browser_navigate({ url: "http://localhost:3000/my" })
browser_wait_for({ time: 2 })
browser_snapshot() // Check DOM structure
```

### Form Validation
```javascript
// Fill and submit form
browser_fill_form({ fields: [
  { name: "Email", type: "textbox", ref: "form-login-email", value: "test@example.com" },
  { name: "Password", type: "textbox", ref: "form-login-password", value: "password123" }
]})
browser_click({ element: "Submit", ref: "btn-submit" })
browser_wait_for({ time: 2 })
```

### Error Check
```javascript
// Check for console errors
list_console_messages({ types: ["error"] })
// Verify no unexpected errors
```

### tRPC Call Verification
```javascript
// Check network requests
list_network_requests({ filter: "trpc" })
// Verify mutations completed
```

## Agent Collaboration

| Situation | Action |
|-----------|--------|
| Feature ready to validate | `@dev-automation` validates UI |
| Formal E2E tests needed | Route to `@e2e-test-specialist` |
| Frontend implementation issues | Route to `@frontend-developer` |
| Performance regressions | Route to `@performance-profiler` |
| tRPC API issues | Route to `@trpc-architect` |

## Critical Rules

1. **Docker-first** - PostgreSQL через Docker Compose
2. **Validate before complete** - Никакое UI изменение не complete без валидации
3. **DOM over screenshots** - `browser_snapshot` для валидации (быстрее)
4. **data-testid selectors** - Явные селекторы, не text/role
5. **Check console** - Всегда проверять ошибки консоли

## Output

**Validation Report Format**:
```yaml
Environment Status:
  - PostgreSQL: Running/Stopped
  - Dev Server: Running on :3000
  - Database: Connected/Disconnected

Validation Results:
  Pages Tested:
    - /path: PASS/FAIL

  Console Errors: None / [list]

  Network Issues: None / [list]

  Visual Changes: Captured / None needed

Overall: PASS / FAIL

Issues Found:
  - [issue description]

Recommendations:
  - [action item]
```

## Success Criteria

- [ ] Environment healthy and accessible
- [ ] Dev server responding on :3000
- [ ] Database connected
- [ ] Changed pages render correctly
- [ ] No console errors introduced
- [ ] tRPC calls succeed
- [ ] Forms work as expected

## Common Pitfalls

- **Don't** use screenshots for validation (use snapshots)
- **Don't** skip waiting after navigation
- **Don't** ignore console warnings
- **Don't** forget to check network errors
- **Don't** validate without starting dev server
- **Don't** assume database is seeded

## Error Handling

### PostgreSQL Not Running
```bash
# Fix
docker compose up -d
docker compose ps  # Verify healthy
```

### Dev Server Failed
```bash
# Check for port conflicts
lsof -i :3000
# Restart
bun run dev
```

### Database Connection Failed
```bash
# Check .env
# Verify DATABASE_URL format
# Reset if needed
bun run db:reset:full
```

### tRPC Errors
```bash
# Check types
bun run typecheck
# Regenerate if needed
bun run build  # Will fail if types broken
```

## Logging

**File**: `.claude/logs/dev-automation_YYYYMMDD.jsonl`

**Format**:
```json
{
  "timestamp": "ISO8601",
  "action": "environment_check|validation|error",
  "details": { ... }
}
```

## References

- `.claude/instructions/PLAYWRIGHT_MCP_AUTOMATION.md` - Full Playwright guide
- `docker-compose.yml` - Docker configuration
- `package.json` - Available scripts
- `.env.example` - Environment variables
