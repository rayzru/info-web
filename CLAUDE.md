# Info-Web Development

## Quick Navigation

### Documentation
- **[docs/](docs/)** – Complete project documentation
  - [Architecture](docs/architecture/) – System design, [tech stack](docs/architecture/technology-stack.md), NFRs
  - [Development](docs/development/) – Setup, database, MCP servers
  - [Guides](docs/guides/) – Frontend, backend, testing patterns
  - [API](docs/api/) – API documentation

### AI Configuration
- **[.claude/](.claude/)** – Claude Code configuration
  - [Agents](.claude/agents/) – AI agents ([core](.claude/agents/core/), [specialists](.claude/agents/specialists/), [testing](.claude/agents/testing/))
  - [Skills](.claude/skills/) – Reusable skills
  - [Workflows](.claude/workflows/) – Standard workflows
  - [Guidelines](.claude/guidelines/) – Coding standards
  - [Plans](.claude/plans/) – Implementation plans

### Quick Links
- **[AGENT_LIST.md](AGENT_LIST.md)** – Agent catalog (quick reference)
- **[MCP_GUIDE.md](MCP_GUIDE.md)** – MCP server setup

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

# Git Flow Protection (First-time setup)
bash scripts/setup-git-hooks.sh   # Install Git hooks for branch protection
```

## Pre-Production Context

- **Status**: Active development, NOT in production
- **Breaking changes**: Allowed - no backward compatibility required
- **Testing**: All changes must pass `bun run check`

---

## Git Flow & Deployment

### Branch Strategy

```
feature/* → development → main (production)
    ↓           ↓            ↓
  Local      Beta        Production
```

**MANDATORY SEQUENCE**:
1. Create feature branch from `development`: `git checkout development && git checkout -b feature/my-feature`
2. Develop + commit changes
3. Push to remote: `git push origin feature/my-feature`
4. **Merge to development** (triggers beta deployment):
   - Sync with latest: `git checkout development && git pull origin development`
   - Merge feature: `git merge feature/my-feature --no-ff`
   - Push: `git push origin development`
5. **Deployment to beta happens automatically** via GitHub Actions
6. **After beta verification** → create PR: `development` → `main` (production)

### Deployment Triggers

| Branch | Environment | Trigger | Auto-Deploy |
|--------|------------|---------|-------------|
| `feature/*` | Local only | Manual | No |
| `development` | Beta | Push to `development` | ✅ Yes |
| `main` | Production | Push to `main` | ✅ Yes |

### When to Merge

**To Development (Beta)**:
- Feature is complete and tested locally
- `bun run check` passes
- `bun run build` passes
- Ready for beta testing

**To Main (Production)**:
- Feature verified on beta
- No critical issues reported
- User/stakeholder approval obtained
- Changeset created (if using Changesets)

### NEVER

- ❌ Direct merge: `feature/*` → `main` (skip development)
- ❌ Force push to `development` or `main`
- ❌ Merge without testing locally first
- ❌ Deploy to production without beta verification

### Monitoring Deployments

```bash
# Check recent deployments
gh run list --branch development --limit 5

# Watch active deployment
gh run watch <run-id>

# View deployment logs
gh run view <run-id> --log
```

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
.claude/context/architecture-context.md - System architecture, NFRs, technology stack
.claude/context/nfr-matrix.md          - NFR-based routing triggers (when to call specialists)
.claude/context/anti-patterns.md       - Anti-patterns to avoid (20+ examples)
.claude/context/repository-map.md      - Codebase structure & file organization
.claude/context/workflow-patterns.md   - Git, agents, verification workflows
.claude/context/common-pitfalls.md     - Common mistakes and solutions
.claude/context/security-context.md    - Auth & security patterns
```

**Do not proceed with implementation without reading relevant context files.**

### NFR-Based Routing (Use nfr-matrix.md)

**ALWAYS consult** [.claude/context/nfr-matrix.md](.claude/context/nfr-matrix.md) to determine when to route to specialists:

- **@security-expert**: PHI/PII access, auth changes, external APIs, admin operations
- **@architect**: Data model changes > 100k records, service boundaries, performance < 100ms p95
- **@frontend-developer**: UI components, accessibility (WCAG AA), client state
- **@test-writer**: Critical paths, new API endpoints, complex business logic

**Use objective triggers, not subjective judgment.**

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
