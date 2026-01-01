# Info-Web Development

## Quick Navigation

- **[AGENT_LIST.md](AGENT_LIST.md)** – Available AI agents for development workflows
- **[MCP_GUIDE.md](MCP_GUIDE.md)** – MCP server setup (Playwright, Chrome DevTools, Codex, Figma)
- **[.claude/instructions/](.claude/instructions/)** – Workflow instructions

## Repository

| Area | Path | Stack |
|------|------|-------|
| App | `src/` | Next.js 16, React 19, tRPC 11, Drizzle |
| Pages | `src/app/` | App Router, route groups |
| Components | `src/components/` | Radix UI, Shadcn/ui |
| API | `src/server/api/` | tRPC routers |
| Database | `src/server/db/` | Drizzle ORM, PostgreSQL |
| Auth | `src/server/auth/` | NextAuth v5, Yandex OAuth |

## Quick Commands

```bash
# Development
bun run dev              # Start dev server (:3000)
bun run check            # Lint + typecheck
bun run build            # Production build

# Database
docker compose up -d     # Start PostgreSQL
bun run db:push          # Apply schema
bun run db:seed          # Seed data
bun run db:studio        # Drizzle Studio
```

## Pre-Production Context

- **Status**: Active development, NOT in production
- **Breaking changes**: Allowed - no backward compatibility required
- **Testing**: All changes must pass `bun run check`

---

## Critical Rules (Non-Negotiable)

### Verification Requirements

- **Verify links/packages exist** before recommending (use WebSearch/WebFetch)
- **State uncertainty** if unverified: "I haven't verified this exists"
- **No time estimates** unless explicitly asked

### Scope Discipline

- **Fix only what's requested** - no drive-by improvements
- **Check existing patterns** before creating new solutions
- **Follow T3 Stack conventions** - tRPC, Drizzle, NextAuth patterns

### Security

- **Use Zod validation** for all tRPC inputs
- **Use protectedProcedure** for authenticated routes
- **Never commit secrets** - use environment variables
- **Never log sensitive data** in plain text

---

## Required Reading (Before Implementation)

**YOU MUST read these files before coding any feature:**

```
.claude/context/repository-map.md     - Codebase structure & architecture
.claude/context/workflow-patterns.md  - Git, agents, verification workflows
.claude/context/common-pitfalls.md    - Anti-patterns to avoid
.claude/context/security-context.md   - Auth & security patterns
```

**Do not proceed with implementation without reading relevant context files.**

---

## Guidelines (Mandatory)

**YOU MUST consult `.claude/guidelines/` before implementing.**

**If a guideline conflicts with this file, the guideline wins.**

---

## Agents

See **[AGENT_LIST.md](AGENT_LIST.md)** for full catalog. All agents in `.claude/agents/`.

**Core Workflow**: feature-planner → feature-builder → code-reviewer → test-writer

---

## Before Completing Work

1. **Checks pass**: `bun run check`
2. **Build passes**: `bun run build`
3. **No console.logs** left in code
4. **Error states** handled
5. **Loading states** implemented

---

## Technology Stack

| Layer | Technology | Version |
|-------|------------|---------|
| Framework | Next.js | 16.0.10 |
| UI | React | 19.2.3 |
| API | tRPC | 11.7.2 |
| ORM | Drizzle | 0.45.1 |
| Auth | NextAuth | 5.0.0-beta.25 |
| Styling | TailwindCSS | 4.1.18 |
| Validation | Zod | 4.1.13 |
| Package Manager | Bun | 1.3+ |

---

## References

- [AGENT_LIST.md](AGENT_LIST.md) - Agent catalog
- [MCP_GUIDE.md](MCP_GUIDE.md) - MCP server setup
- [ARCHITECTURE.md](ARCHITECTURE.md) - System architecture
- [DATABASE.md](DATABASE.md) - Database documentation
