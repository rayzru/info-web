# Technology Stack

**Last Updated**: 2026-02-15
**Project**: info-web (Residential Complex Management System)

---

## Overview

This document is the **Single Source of Truth (SSOT)** for all package versions used in the project. All other documentation should reference this file instead of duplicating version information.

---

## Core Framework

| Package | Current Version | Category | Notes |
|---------|----------------|----------|-------|
| **Next.js** | ^16.1.6 | Framework | App Router, Server Components, Turbopack |
| **React** | ^19.2.4 | UI Library | Server Components, Suspense, React 19 |
| **TypeScript** | ^5.9.3 | Language | Strict mode enabled |

### Package Manager

| Tool | Version | Notes |
|------|---------|-------|
| **Bun** | 1.3+ | Runtime + Package Manager |

---

## API & Data Layer

| Package | Current Version | Category | Notes |
|---------|----------------|----------|-------|
| **tRPC** | ^11.10.0 | API | Type-safe API (`@trpc/server`, `@trpc/client`, `@trpc/react-query`) |
| **React Query** | ^5.x | Data Fetching | Via tRPC integration |
| **Zod** | ^4.1.13 | Validation | Runtime validation + type inference |
| **Drizzle ORM** | ^0.45.1 | ORM | Type-safe SQL query builder |
| **Drizzle Kit** | ^0.31.9 | Migrations | Schema management |
| **PostgreSQL** | Latest | Database | Primary database (Docker) |
| **postgres.js** | Latest | Client | PostgreSQL driver for Drizzle |

---

## Authentication

| Package | Current Version | Category | Notes |
|---------|----------------|----------|-------|
| **NextAuth.js** | ^5.0.0-beta.25 | Auth Framework | Auth.js v5 (beta) |
| **@auth/drizzle-adapter** | ^1.11.1 | Database Adapter | Drizzle adapter for NextAuth |
| **bcryptjs** | Latest | Password Hashing | Secure password storage |

### OAuth Providers (8)

- Yandex (Primary)
- VK
- Google
- Mail.ru
- Одноклассники (Custom)
- Sber (Custom)
- Tinkoff (Custom)
- Telegram (Bot)

---

## UI & Styling

| Package | Current Version | Category | Notes |
|---------|----------------|----------|-------|
| **TailwindCSS** | ^4.1.18 | CSS Framework | Utility-first CSS |
| **Radix UI** | Various | Primitives | Accessible component primitives (30+ components) |
| **Shadcn/ui** | Latest | Component Library | Built on Radix UI |
| **Lucide React** | Latest | Icons | Icon library |

### Radix UI Components Used

- accordion, avatar, button, card, checkbox
- command, dialog, dropdown-menu, form, input
- label, menubar, navigation-menu, popover
- radio-group, scroll-area, select, separator
- sheet, tabs, textarea, toast (sonner), tooltip
- breadcrumb, badge, calendar

---

## State Management

| Package | Current Version | Category | Notes |
|---------|----------------|----------|-------|
| **Zustand** | ^5.x | Global State | Theme, lightweight state |
| **React Query** | ^5.x | Server State | Via tRPC integration |

---

## Development Tools

| Package | Current Version | Category | Notes |
|---------|----------------|----------|-------|
| **ESLint** | ^9.x | Linting | Code quality |
| **Prettier** | ^3.x | Formatting | Code formatting |
| **TypeScript ESLint** | ^8.x | TypeScript Linting | Type-aware rules |

---

## Email & Notifications

| Package | Current Version | Category | Notes |
|---------|----------------|----------|-------|
| **Nodemailer** | Latest | Email | SMTP email sending |
| **MJML** | Latest | Email Templates | Responsive email templates |

---

## Infrastructure

| Technology | Version | Category | Notes |
|-----------|---------|----------|-------|
| **Docker** | Latest | Containerization | PostgreSQL container |
| **PM2** | Latest | Process Manager | Production deployment |

---

## Version Update Policy

### When to Update This File

Update this file when:
1. **Package upgraded**: After running `bun update`
2. **New package added**: After `bun add <package>`
3. **Breaking changes**: Major version bumps
4. **Monthly review**: First week of each month

### How to Check for Updates

```bash
# Check for outdated packages
bun outdated

# Update specific package
bun update <package-name>

# Update all packages (careful!)
bun update

# After updates, update this file
```

### Version Ranges

- `^X.Y.Z` - Allow minor and patch updates (recommended)
- `~X.Y.Z` - Allow only patch updates
- `X.Y.Z` - Exact version (use for critical packages)

---

## Migration Notes

### Recent Updates

#### 2026-02-15

**Updated packages**:
- Next.js: 16.0.10 → 16.1.6
- React: 19.2.3 → 19.2.4
- tRPC: 11.7.2 → 11.10.0

**Breaking changes**: None (minor/patch updates)

**Action required**: None

---

## References in Documentation

Other documentation files should reference this file instead of duplicating version information:

**✅ Good**:
```markdown
See [technology-stack.md](../../docs/architecture/technology-stack.md) for current versions.

**Quick Reference** (as of 2026-02-15):
- Next.js 16, React 19, tRPC 11
```

**❌ Bad** (don't duplicate):
```markdown
## Technology Stack

| Package | Version |
|---------|---------|
| Next.js | 16.1.6 |
| React | 19.2.4 |
```

---

## Version History

| Date | Package | Old Version | New Version | Notes |
|------|---------|-------------|-------------|-------|
| 2026-02-15 | Next.js | 16.0.10 | 16.1.6 | Minor update |
| 2026-02-15 | React | 19.2.3 | 19.2.4 | Patch update |
| 2026-02-15 | tRPC | 11.7.2 | 11.10.0 | Minor update |
| 2026-02-15 | Drizzle Kit | 0.31.9 | 0.31.9 | No change |

---

## Related Documentation

- [overview.md](./overview.md) - Architecture overview
- [data-flow.md](./data-flow.md) - Data flow patterns
- [nfr-requirements.md](./nfr-requirements.md) - Non-functional requirements

---

**Maintainer**: Development Team
**Review Frequency**: Monthly (first week)
**Next Review**: 2026-03-01
