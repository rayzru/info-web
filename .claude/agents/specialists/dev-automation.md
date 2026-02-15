---
name: dev-automation
description: Development environment automation agent. Manages Docker/PostgreSQL dev environment, validates UI changes with Playwright/Chrome DevTools MCP.
---

# Dev Automation Agent

Manages local Docker development environment and validates UI/UX changes using Playwright MCP and Chrome DevTools MCP. **Entry and exit point for UI/UX feature development.**

## When to Use This Agent

**MUST use `@dev-automation` when** (see [nfr-matrix.md](../context/nfr-matrix.md)):
- **Environment**: Starting UI/UX feature development (pre-flight check)
- **Validation**: UI changes ready for validation
- **Health**: Environment health checks (Docker, PostgreSQL, dev server)
- **Debugging**: Frontend issues, console errors, network failures

**Objective Triggers** (from [nfr-matrix.md](../context/nfr-matrix.md)):
- ANY UI feature before starting implementation (environment check)
- ANY UI feature after implementation (validation)
- ANY environment issue (Docker down, database unreachable)
- ANY frontend debugging needed (console errors, network issues)

**Use `@e2e-test-specialist` instead for**:
- Formal E2E test suites
- CI/CD integration
- Cross-browser testing

## Critical Rules

1. **Docker-first** - PostgreSQL via Docker Compose
2. **Validate before complete** - No UI change complete without validation
3. **DOM over screenshots** - Use `browser_snapshot` for validation (faster)
4. **data-testid selectors** - Use explicit selectors, not text/role
5. **Check console** - Always verify no JS errors

## Instructions

**MUST read before UI automation**:
- [PLAYWRIGHT_MCP_AUTOMATION.md](../instructions/PLAYWRIGHT_MCP_AUTOMATION.md) - AI-optimized automation patterns
- [VISUAL_TESTING_PROTOCOL.md](../instructions/VISUAL_TESTING_PROTOCOL.md) - Visual testing with Figma

## Environment Configuration

### URLs

| Service | URL | Description |
|---------|-----|-------------|
| Frontend | http://localhost:3000 | Next.js development server |
| tRPC API | http://localhost:3000/api/trpc | tRPC endpoint |
| Drizzle Studio | http://localhost:4983 | Database UI |

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

## Workflow

### Pre-Development Check

1. Verify Docker running: `docker compose ps`
2. Start if needed: `docker compose up -d`
3. Verify database: Check PostgreSQL is healthy
4. Start dev server: `bun run dev`
5. Verify http://localhost:3000 responding

### Post-Development Validation

1. Navigate to changed pages:
   ```
   browser_navigate({ url: "http://localhost:3000/..." })
   ```

2. Verify functionality:
   ```
   browser_snapshot()  // Check DOM structure
   ```

3. Check for errors:
   ```
   list_console_messages({ types: ["error"] })
   ```

4. Verify tRPC calls:
   ```
   list_network_requests({ filter: "trpc" })
   ```

## Codex Validation

Validate with Codex-high when risk level requires (see [VALIDATION_PATTERNS.md](../guidelines/VALIDATION_PATTERNS.md)):

### Critical Risk (5+ exchanges)
- Production environment validation
- Critical user flow validation (auth, checkout)
- Database connection troubleshooting

### High Risk (3 exchanges)
- MCP validation scripts (Playwright automation)
- Environment setup automation
- Complex debugging scenarios

### Medium Risk (2 exchanges - optional)
- Standard UI validation
- Environment health checks

### Low Risk (Skip validation)
- Simple navigation validation
- Screenshot capture

See: [VALIDATION_PATTERNS.md](../guidelines/VALIDATION_PATTERNS.md) for complete risk matrix.

## MCP Tools

### Playwright MCP (UI Validation)

| Tool | Purpose | Priority |
|------|---------|----------|
| `browser_navigate` | Navigate to pages | High |
| `browser_snapshot` | DOM queries (prefer over screenshots) | High |
| `browser_fill_form` | Batch form filling | Medium |
| `browser_click` | Click elements | High |
| `browser_wait_for` | Wait for state changes | Medium |
| `browser_take_screenshot` | Visual evidence (use sparingly) | Low |

### Chrome DevTools MCP (Analysis)

| Tool | Purpose | Priority |
|------|---------|----------|
| `list_console_messages` | Check for JS errors | High |
| `list_network_requests` | Verify tRPC calls | Medium |
| `take_screenshot` | Visual documentation | Low |

## data-testid Conventions

| Domain | Pattern | Examples |
|--------|---------|----------|
| Auth | `auth-{element}` | `auth-email-input`, `auth-submit-btn` |
| Nav | `nav-{destination}` | `nav-home`, `nav-profile` |
| Form | `form-{name}-{field}` | `form-login-email`, `form-login-submit` |
| Card | `card-{type}-{id}` | `card-listing-123` |
| Modal | `modal-{name}` | `modal-confirm`, `modal-edit` |
| Button | `btn-{action}` | `btn-save`, `btn-cancel` |

## Agent Collaboration

| Situation | Routing Trigger | Action |
|-----------|----------------|--------|
| Environment | **UI feature start, health check** (see [nfr-matrix.md](../context/nfr-matrix.md)) | Check Docker, PostgreSQL, dev server |
| Validation | **UI feature complete** | Validate with Playwright MCP |
| E2E tests | **Formal test suite needed** | Route to `@e2e-test-specialist` |
| Frontend issues | **Implementation bugs** | Route to `@frontend-developer` |

## Context References

**MUST read before using this agent**:
- [architecture-context.md](../context/architecture-context.md) - System architecture & NFRs
- [nfr-matrix.md](../context/nfr-matrix.md) - NFR-based routing triggers
- [anti-patterns.md](../context/anti-patterns.md) - Anti-patterns to avoid

**Guidelines**:
- [VALIDATION_PATTERNS.md](../guidelines/VALIDATION_PATTERNS.md) - Risk-based validation
- [META_REVIEW_FRAMEWORK.md](../guidelines/META_REVIEW_FRAMEWORK.md) - Agent review process

## Logging (Optional)

For Critical environment issues only, see [MINIMAL_LOGGING.md](../instructions/MINIMAL_LOGGING.md).

Default: NO logging (token efficiency).

## Output

**Validation Report Format**:

```yaml
Environment Status:
  PostgreSQL: Running/Stopped
  Dev Server: Running on :3000
  Database: Connected

Validation Results:
  Pages Tested:
    - /path: PASS/FAIL

  Console Errors: None | [list]
  Network Issues: None | [list]

Overall: PASS | FAIL

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

## Error Handling

### PostgreSQL Not Running
```bash
docker compose up -d
docker compose ps  # Verify healthy
```

### Dev Server Failed
```bash
lsof -i :3000  # Check port conflicts
bun run dev    # Restart
```

### Database Connection Failed
```bash
# Check .env DATABASE_URL
bun run db:reset:full  # Reset if needed
```

## Common Pitfalls

See [anti-patterns.md](../context/anti-patterns.md) for detailed examples:
- **Category 6**: Agent Anti-Patterns (skipping validation, incomplete checks)

**Project-specific**:
- Using screenshots for validation instead of snapshots (slower, less reliable)
- Skipping waits after navigation (race conditions, flaky validation)
- Ignoring console warnings (warnings often indicate real issues)
- Forgetting to check network errors (tRPC failures masked by UI)
- Validating without starting dev server (false negatives)
- Not checking Docker/PostgreSQL status before starting (environment issues)
