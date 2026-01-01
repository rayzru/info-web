# Repository Map

Detailed structure of the info-web T3 Stack repository.

## Overview

```
info-web/
├── CLAUDE.md               # Entry point (read first)
├── AGENT_LIST.md           # Agent catalog
├── MCP_GUIDE.md            # MCP server setup
│
├── .claude/                # AI configuration
│   ├── agents/             # Development workflow agents
│   ├── context/            # Detailed context files (this directory)
│   ├── guidelines/         # Domain-specific mandatory patterns
│   ├── instructions/       # Shared instructions and workflows
│   ├── templates/          # Spec and doc templates
│   └── logs/               # Agent execution logs
│
├── src/                    # Application source code
│   ├── app/                # Next.js App Router pages
│   │   ├── (admin)/        # Admin routes group
│   │   ├── (main)/         # Main public routes group
│   │   ├── api/            # API routes (tRPC, auth, etc.)
│   │   └── maintenance/    # Maintenance page
│   │
│   ├── components/         # React components
│   │   ├── admin/          # Admin-specific components
│   │   └── ui/             # Shadcn/ui components
│   │
│   ├── server/             # Server-side code
│   │   ├── api/            # tRPC routers
│   │   │   └── routers/    # Individual routers
│   │   ├── auth/           # NextAuth configuration
│   │   ├── db/             # Drizzle ORM
│   │   │   └── schemas/    # Table definitions
│   │   └── lib/            # Server utilities
│   │
│   ├── lib/                # Shared utilities
│   └── styles/             # Global styles
│
├── public/                 # Static assets
│   └── avatars/            # User avatars
│
├── drizzle/                # Database migrations
├── specs/                  # Feature specifications
└── docker-compose.yml      # PostgreSQL container
```

---

## Architecture (T3 Stack)

```
┌─────────────────────────────────────────────────────┐
│                    Client (Browser)                  │
│              React 19 + Next.js 16 App Router        │
└─────────────────────┬───────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────┐
│                   Next.js Server                     │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐ │
│  │   Pages     │  │  API Routes │  │  Middleware │ │
│  │ (App Router)│  │   (tRPC)    │  │  (Auth)     │ │
│  └─────────────┘  └──────┬──────┘  └─────────────┘ │
└──────────────────────────┼──────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────┐
│                    tRPC Layer                        │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐ │
│  │  Routers    │  │ Procedures  │  │    Zod      │ │
│  │ (API logic) │  │ (pub/prot)  │  │ (validation)│ │
│  └─────────────┘  └──────┬──────┘  └─────────────┘ │
└──────────────────────────┼──────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────┐
│                  Drizzle ORM                         │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐ │
│  │   Schema    │  │   Queries   │  │ Migrations  │ │
│  │ (types)     │  │ (type-safe) │  │ (drizzle-kit│ │
│  └─────────────┘  └──────┬──────┘  └─────────────┘ │
└──────────────────────────┼──────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────┐
│                   PostgreSQL                         │
│              (Docker container)                      │
└─────────────────────────────────────────────────────┘
```

---

## Key Directories

| Directory | Purpose |
|-----------|---------|
| `src/app/` | Next.js App Router pages, layouts, route groups |
| `src/components/` | React components (UI and feature-specific) |
| `src/components/ui/` | Shadcn/ui primitives |
| `src/server/api/routers/` | tRPC routers (business logic) |
| `src/server/db/` | Drizzle ORM schema and connection |
| `src/server/db/schemas/` | Table definitions split by domain |
| `src/server/auth/` | NextAuth v5 configuration |
| `src/lib/` | Shared utilities and helpers |
| `drizzle/` | SQL migrations (auto-generated) |
| `specs/` | Feature specifications |

---

## Technology Stack

| Layer | Technology | Version |
|-------|------------|---------|
| Framework | Next.js | 16.0.10 |
| UI Library | React | 19.2.3 |
| Language | TypeScript | 5.9.3 |
| API | tRPC | 11.7.2 |
| ORM | Drizzle | 0.45.1 |
| Database | PostgreSQL | latest |
| Auth | NextAuth | 5.0.0-beta.25 |
| Styling | TailwindCSS | 4.1.18 |
| UI Components | Radix UI | various |
| Validation | Zod | 4.1.13 |
| Package Manager | Bun | 1.3+ |

---

## Route Groups

### (main) - Public Routes
- `/` - Home page
- `/info/` - Information pages
- `/community/` - Community features
- `/events/` - Events listing
- `/my/` - User cabinet (authenticated)

### (admin) - Admin Routes
- `/admin/` - Admin dashboard
- `/admin/news/` - News management
- `/admin/events/` - Events management
- `/admin/users/` - User management
- `/admin/feedback/` - Feedback management
- `/admin/logs/` - Audit logs

---

## Database Schemas

Located in `src/server/db/schemas/`:

| File | Tables |
|------|--------|
| `users.ts` | users, accounts, sessions, verificationTokens |
| `directory.ts` | directory entries, categories |
| `settings.ts` | application settings |
| `publications.ts` | news, articles |
| `feedback.ts` | user feedback |
| `audit-log.ts` | audit trail |
| `messages.ts` | user messages |

---

## Pre-Production Context

**Status**: Active development, NOT in production

This means:
- Breaking API changes are OK
- No backward compatibility required
- Schema evolution is free
- Aggressive refactoring encouraged

---

## Quick Commands

```bash
# Development
bun run dev              # Start dev server (port 3000)
bun run build            # Production build
bun run check            # Lint + typecheck

# Database
docker compose up -d     # Start PostgreSQL
bun run db:push          # Apply schema
bun run db:seed          # Seed data
bun run db:studio        # Open Drizzle Studio
bun run db:reset:full    # Full reset + seed

# Quality
bun run lint             # ESLint
bun run typecheck        # TypeScript check
bun run format:check     # Prettier check
```
