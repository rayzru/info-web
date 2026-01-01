# Technical Specification: Agent System Migration

## Metadata
- **Issue**: Internal - Agent System Refactoring
- **Created**: 2025-12-14
- **Author**: Feature Planner Agent
- **Status**: Draft
- **Complexity**: High

## Executive Summary

Миграция системы агентов и документации Claude с текущей структуры на новую переработанную архитектуру из `__NEW/`. Новая система более лаконична, имеет четкое разделение контекста, использует стандартизированные шаблоны и добавляет агента для локальной разработки (`dev-automation`).

## Анализ различий

### Текущая структура (.claude/)

```
.claude/
├── agents/               # 26 агентов (избыточно)
├── guidelines/           # 4 файла
├── instructions/         # 5 файлов
└── (нет context/, templates/, logs/)
```

**Корневые файлы:**
- `CLAUDE.md` - 15KB, детальный, но избыточный
- `AGENT_LIST.md` - 18KB, описания агентов для T3 стека
- `MCP_GUIDE.md` - 20KB
- `ARCHITECTURE.md`, `DATABASE.md`, `TODO.md`

### Новая структура (__NEW/.claude/)

```
.claude/
├── agents/               # 15 агентов (оптимально)
├── context/              # 4 файла детального контекста
├── guidelines/           # 4 файла
├── instructions/         # 5 файлов
├── templates/            # 12 шаблонов
└── logs/                 # директория для логов
```

**Корневые файлы:**
- `CLAUDE.md` - 3KB, лаконичный entry point
- `AGENT_LIST.md` - 24KB, подробные workflow диаграммы

### Ключевые различия

| Аспект | Текущая | Новая |
|--------|---------|-------|
| CLAUDE.md | Всё в одном файле | Лаконичный entry point + context/ |
| Контекст | Нет отдельной папки | `.claude/context/` с 4 файлами |
| Шаблоны | Нет | `.claude/templates/` с 12 шаблонами |
| Логирование | Нет инфраструктуры | `.claude/logs/` + протокол |
| Агенты | 26 (избыточно) | 15 (оптимизировано) |
| Стек | T3 Stack (tRPC, Drizzle) | .NET/GraphQL + Next.js |

## Новый перечень агентов

### Workflow Agents (5)
1. **feature-planner** - Создание спецификаций из задач
2. **feature-builder** - Реализация по спецификациям
3. **code-reviewer** - Код-ревью
4. **review-comment-analyzer** - Анализ комментариев MR (опционально для GitHub workflow)
5. **review-fix-executor** - Исполнение фиксов по ревью (опционально)

### Architecture Agent (1)
6. **architect** - Системная архитектура и ADR

### Frontend Agents (2)
7. **frontend-developer** - React 19, Next.js 16, компоненты
8. **storybook-editor** - Компоненты и Storybook (адаптация ui-kit-specialist)

### Testing Agents (3)
9. **test-writer** - Unit/integration тесты (Jest, RTL)
10. **e2e-test-specialist** - Playwright E2E + accessibility
11. **test-analyzer** - Анализ падений тестов

### Backend Agents (2)
12. **trpc-architect** - tRPC API дизайн (вместо graphql-architect)
13. **database-architect** - Drizzle ORM схемы (вместо dotnet-specialist)

### Universal Agents (3)
14. **security-expert** - Безопасность и аудит
15. **performance-profiler** - Оптимизация производительности
16. **debugger** - Отладка и траблшутинг

### Development Environment Agent (1) - НОВЫЙ
17. **dev-automation** - Управление локальной средой и валидация UI

## Структура миграции

### Фаза 1: Создание инфраструктуры

```yaml
Создать директории:
  - .claude/context/
  - .claude/templates/
  - .claude/logs/

Создать context файлы:
  - .claude/context/repository-map.md      # Структура репозитория
  - .claude/context/workflow-patterns.md   # Git и workflow
  - .claude/context/common-pitfalls.md     # Анти-паттерны
  - .claude/context/security-context.md    # Безопасность (без HIPAA)
```

### Фаза 2: Переработка корневых документов

```yaml
CLAUDE.md:
  Текущий размер: 15KB
  Целевой размер: 3-4KB
  Содержание:
    - Quick Navigation (ссылки)
    - Repository Overview (краткая структура)
    - Technology Stack (T3 Stack)
    - Critical Rules (5-7 правил)
    - Required Reading (ссылки на context/)
    - Before Completing Work (чеклист)
    - References (ссылки)

AGENT_LIST.md:
  Адаптировать из __NEW:
    - Quick Decision Guide
    - Новый перечень агентов
    - Workflow Decision Trees
    - MCP интеграция
```

### Фаза 3: Миграция агентов

```yaml
Удалить (избыточные):
  - test-coordinator.md    # Функции распределены между test-writer и e2e-test-specialist
  - prompt-engineer.md     # Не используется
  - local-dev-support.md   # Заменяется на dev-automation
  - component-standardization.md  # Объединить с storybook-editor
  - design-system-coordinator.md  # Объединить с frontend-developer
  - review-precommit.md    # Функции в code-reviewer
  - graphql-architect.md   # Заменить на trpc-architect
  - dotnet-specialist.md   # Заменить на database-architect

Адаптировать из __NEW (новый формат):
  - feature-planner.md     # С YAML frontmatter, компактный
  - feature-builder.md     # Новый формат
  - frontend-developer.md  # Адаптировать под T3 стек
  - architect.md           # Новый формат
  - code-reviewer.md       # Новый формат
  - test-writer.md         # Новый формат
  - e2e-test-specialist.md # Новый формат
  - test-analyzer.md       # Новый формат
  - security-expert.md     # Новый формат
  - performance-profiler.md # Новый формат

Создать новые:
  - dev-automation.md      # Из предоставленного шаблона
  - trpc-architect.md      # На основе graphql-architect
  - database-architect.md  # На основе dotnet-specialist
  - storybook-editor.md    # Адаптация ui-kit-specialist
  - debugger.md            # Сохранить текущий
```

### Фаза 4: Создание шаблонов

```yaml
Шаблоны из __NEW (адаптировать):
  - feature_spec.md              # Шаблон спецификации
  - implementation_tracking.md   # Трекинг реализации
  - codex_validation.md          # Валидация через Codex
  - code_review_report.md        # Отчет код-ревью
  - test_documentation.md        # Документация тестов
  - test_failure_analysis.md     # Анализ падений

Новые шаблоны для T3:
  - trpc_spec.md                 # tRPC контракты
  - drizzle_schema_spec.md       # Drizzle схемы
```

### Фаза 5: Адаптация dev-automation

```yaml
Адаптации для T3 Stack:
  URLs:
    - Frontend: http://localhost:3000
    - tRPC: http://localhost:3000/api/trpc
    - Storybook: http://localhost:6006

  Docker:
    - PostgreSQL через docker-compose.yml
    - Команды: docker compose up -d

  Тестовые данные:
    - NextAuth с Yandex OAuth
    - Тестовые пользователи из seed

  MCP Tools:
    - Playwright MCP (UI валидация)
    - Chrome DevTools MCP (анализ)
```

## Детальная спецификация компонентов

### Component: CLAUDE.md (переработанный)

**Purpose**: Главный entry point для агентов с минимальным, но достаточным контекстом.

**Structure**:
```yaml
Sections:
  Quick Navigation:
    - Ссылки на AGENT_LIST, MCP_GUIDE
    - Ссылки на .claude/instructions/

  Repository Overview:
    - Краткая структура (tree diagram)
    - Описание директорий

  Technology Stack:
    - T3 Stack компоненты
    - Версии пакетов
    - Package manager (Bun)

  Critical Rules:
    - Verify links before recommending
    - No time estimates
    - Fix only what's requested
    - Follow established patterns
    - Project status (development)

  Required Reading:
    - Ссылки на .claude/context/*
    - Обязательное чтение перед реализацией

  Before Completing Work:
    - Build проверки
    - Test проверки
    - Lint проверки

  References:
    - Ссылки на дополнительные документы
```

### Component: context/repository-map.md

**Purpose**: Детальная структура репозитория.

**Content**:
```yaml
Sections:
  Overview:
    - Полное дерево директорий
    - Описание каждой папки

  Architecture:
    - T3 Stack layers
    - Диаграмма зависимостей

  Key Directories:
    - src/app/ - Next.js pages
    - src/components/ - React components
    - src/server/ - tRPC routers
    - src/server/db/ - Drizzle schema

  Pre-Production Context:
    - Breaking changes allowed
    - No backward compatibility required
```

### Component: context/workflow-patterns.md

**Purpose**: Git и development workflows.

**Content**:
```yaml
Sections:
  Git Workflow:
    - Branch naming (feature/, fix/)
    - Commit guidelines
    - No time estimates rule

  Development Workflow:
    - Before starting work
    - During development
    - Before completion

  Agent Collaboration:
    - Standard feature flow
    - Specialist escalation

  Verification Requirements:
    - Build commands
    - Test commands
    - Lint commands
```

### Component: context/common-pitfalls.md

**Purpose**: Анти-паттерны и ошибки.

**Content**:
```yaml
Sections:
  Universal Anti-Patterns:
    - Development mistakes
    - Communication mistakes

  Frontend Anti-Patterns:
    - Next.js 16 specific
    - React 19 specific
    - tRPC client mistakes

  Backend Anti-Patterns:
    - Drizzle ORM mistakes
    - tRPC router mistakes

  Security Anti-Patterns:
    - Input validation
    - Auth mistakes

  Testing Anti-Patterns:
    - Jest/RTL mistakes
    - Playwright mistakes
```

### Component: context/security-context.md

**Purpose**: Безопасность без HIPAA (не healthcare).

**Content**:
```yaml
Sections:
  Authentication:
    - NextAuth v5 patterns
    - Yandex OAuth
    - Session management

  Authorization:
    - Protected procedures
    - Role-based access

  Input Validation:
    - Zod schemas
    - Sanitization

  Data Protection:
    - Parameterized queries (Drizzle)
    - No secrets in code
```

### Component: dev-automation.md

**Purpose**: Управление локальной средой и UI валидация.

**Adaptations for T3 Stack**:
```yaml
URLs:
  Frontend: http://localhost:3000
  tRPC Playground: /api/trpc (no playground, use Postman/Insomnia)
  Storybook: http://localhost:6006

Docker Commands:
  Start: docker compose up -d
  Stop: docker compose down
  Logs: docker compose logs -f

Database:
  Type: PostgreSQL
  Connection: via DATABASE_URL env
  Migrations: bun run db:push
  Seeds: bun run db:seed

Authentication:
  Provider: Yandex OAuth (NextAuth v5)
  Test mode: Use dev bypass or test accounts

MCP Tools:
  Playwright MCP:
    - browser_navigate
    - browser_snapshot
    - browser_click
    - browser_fill_form
    - browser_wait_for

  Chrome DevTools MCP:
    - list_console_messages
    - list_network_requests
    - take_screenshot

Validation Workflow:
  Pre-development:
    1. docker compose up -d
    2. bun run db:push
    3. bun run dev
    4. Verify localhost:3000

  Post-development:
    1. Navigate to changed pages
    2. browser_snapshot for DOM validation
    3. Check console for errors
    4. Verify tRPC calls
```

## Implementation Guidance

### Development Phases

**Phase 1: Infrastructure (Foundation)**
1. Создать `.claude/context/` директорию
2. Создать `.claude/templates/` директорию
3. Создать `.claude/logs/` директорию
4. Создать 4 context файла

**Phase 2: Root Documents (Core)**
1. Переработать CLAUDE.md (сократить до 3-4KB)
2. Переработать AGENT_LIST.md (новый формат агентов)
3. Обновить ссылки и навигацию

**Phase 3: Agent Migration (Bulk)**
1. Удалить избыточных агентов
2. Адаптировать существующих в новый формат
3. Создать новых агентов
4. Обновить все cross-references

**Phase 4: Templates (Polish)**
1. Создать шаблоны спецификаций
2. Создать шаблоны отчетов
3. Создать шаблоны для T3-специфичных задач

**Phase 5: Validation**
1. Self-review всех документов
2. Проверка консистентности ссылок
3. Проверка формата агентов
4. Тестирование workflow

## Формат агента (новый стандарт)

```yaml
---
name: agent-name
description: Brief description in one line
---

# Agent Name

One-line purpose statement.

## When to Use This Agent

**Use when**:
- Condition 1
- Condition 2

**Use [other-agent] instead when**:
- Condition

## Critical Rules

1. Rule one
2. Rule two
3. Rule three

## Workflow

### Phase 1: Setup
Steps...

### Phase 2: Execution
Steps...

## Agent Collaboration

| Situation | Action |
|-----------|--------|
| X needed | Route to @agent |

## Guidelines Reference

**MUST consult** `.claude/guidelines/`

## Logging

**File**: `.claude/logs/[feature]_log_YYYYMMDD.jsonl`

## Output

Description of what agent produces.

## Success Criteria

- [ ] Criterion 1
- [ ] Criterion 2

## Common Pitfalls

- Don't X
- Don't Y
```

## Risks and Mitigations

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| Broken agent references | High | Medium | Grep for @agent mentions, update all |
| Lost functionality | Medium | Low | Compare agent lists before/after |
| Inconsistent format | Medium | Medium | Self-review each file |
| Missing templates | Low | Low | Create on demand |

## Self-Review Checklist

После каждой фазы проверить:

- [ ] Все ссылки валидны
- [ ] Форматирование консистентно
- [ ] Нет дублирования информации
- [ ] Агенты используют новый формат
- [ ] Templates referenced корректно
- [ ] T3 Stack терминология везде
- [ ] Нет упоминаний GraphQL/HotChocolate/.NET
- [ ] Версии пакетов актуальны

## Self-Review Notes

### Консистентность

**Проверено**:
- [x] T3 Stack терминология используется везде
- [x] Нет упоминаний .NET/GraphQL/HotChocolate (это другой проект)
- [x] Версии пакетов актуальны (Next.js 16, React 19, tRPC 11, Drizzle 0.45)
- [x] Новый формат агентов с YAML frontmatter определен
- [x] Context файлы адаптированы для T3 стека

**Исправления при реализации**:
1. Убрать любые упоминания GitLab (проект использует GitHub или без CI)
2. Убрать ссылки на fx-issues репозиторий
3. Адаптировать feature-planner для работы без GitLab MCP
4. Проверить что Storybook настроен в проекте (если нет - убрать storybook-editor)

### Потенциальные проблемы

1. **Codex MCP** - проверить доступность в текущей конфигурации
2. **Playwright MCP** - проверить установку
3. **Chrome DevTools MCP** - проверить установку
4. **Storybook** - не обнаружен в package.json, возможно не нужен

### Рекомендации

1. Начать с минимального набора агентов (10-12)
2. Добавлять по мере необходимости
3. Приоритет: feature-planner, feature-builder, code-reviewer, frontend-developer, dev-automation

## Next Steps

1. Утвердить план миграции
2. Начать с Phase 1 (Infrastructure)
3. Последовательно выполнять фазы
4. Self-review после каждой фазы
5. Финальная валидация всей структуры

## Appendix: Final Agent List (Revised)

После self-review, рекомендуемый минимальный набор:

### Core (5 агентов) - Обязательные
1. **feature-planner** - Планирование фич (без GitLab, с локальными задачами)
2. **feature-builder** - Реализация по спецификациям
3. **code-reviewer** - Код-ревью
4. **frontend-developer** - React/Next.js разработка
5. **dev-automation** - Локальная среда и UI валидация

### Testing (3 агента) - По необходимости
6. **test-writer** - Unit/integration тесты
7. **e2e-test-specialist** - Playwright E2E
8. **test-analyzer** - Анализ падений

### Backend (2 агента) - По необходимости
9. **trpc-architect** - tRPC API дизайн
10. **database-architect** - Drizzle схемы

### Universal (3 агента) - По необходимости
11. **architect** - Системная архитектура
12. **security-expert** - Безопасность
13. **debugger** - Отладка

### Отложенные (добавить позже если нужно)
- performance-profiler
- storybook-editor (если добавится Storybook)
