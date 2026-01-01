# Workflow Patterns

Git, development, and collaboration workflows for info-web T3 Stack project.

## Git Workflow

### Branch Naming
```
feature/[description]     # New features
fix/[description]         # Bug fixes
refactor/[description]    # Code refactoring
docs/[description]        # Documentation updates
```

### Commit Guidelines
- Clear messages describing what and why
- Atomic commits (one logical change each)
- Every commit must build and pass checks
- No time estimates in commit messages

### Branch Management
- Work on feature branches, not main/development
- Keep branches up to date with base
- Resolve conflicts carefully, test after
- Delete branches after merging

---

## Development Workflow

### Before Starting Work
1. Pull latest changes from development branch
2. Understand the requirement (ask if unclear)
3. Check existing patterns (look for similar implementations)
4. Plan approach (use specs for complex tasks)

### During Development
1. Make incremental changes
2. Test continuously (`bun run check`)
3. Follow established conventions
4. Document non-obvious decisions

### Before Completion
1. Run all checks: `bun run check`
2. Build successfully: `bun run build`
3. Self-review your changes
4. Update documentation if behavior changed
5. Clean up debug code, console logs

---

## Agent Collaboration Workflow

### Standard Feature Flow

```
feature-planner → feature-builder → code-reviewer → test-writer → done
                        ↓                   ↑
                  trpc-architect       (iterate until approved)
                  database-architect
```

### Detailed Sequence

1. **feature-planner** creates `/specs/[feature]_spec.md`
   - Analyzes requirements
   - Designs technical approach
   - Documents acceptance criteria

2. **feature-builder** implements spec
   - Calls **trpc-architect** for tRPC work
   - Calls **database-architect** for schema changes
   - Validates incrementally

3. **code-reviewer** reviews implementation
   - Checks code quality
   - Verifies patterns followed
   - Iterate until approved

4. **test-writer** handles tests
   - Unit tests (Jest + RTL)
   - Uses **test-analyzer** for >3 failures
   - Routes to **e2e-test-specialist** for E2E

5. Final **code-reviewer** audit

### Specialist Escalation

| Situation | Escalate To |
|-----------|-------------|
| Security, auth issues | security-expert |
| tRPC API design | trpc-architect |
| Database schema | database-architect |
| Performance issues | performance-profiler |
| Frontend complexity | frontend-developer |
| Complex bugs | debugger |

---

## Verification Requirements

### Before Recommending
- Verify links exist (use WebSearch/WebFetch)
- Verify packages are published
- State uncertainty if unverified: "I haven't verified this exists"

### Before Completing Work

**Must Pass**:
```bash
bun run check           # Lint + typecheck
bun run build           # Production build
```

**Individual Commands**:
```bash
bun run lint            # ESLint
bun run typecheck       # TypeScript
bun run format:check    # Prettier
```

---

## File Management

### Naming Conventions
- **Components**: PascalCase (`UserProfile.tsx`)
- **Utilities**: camelCase (`formatDate.ts`)
- **tRPC routers**: camelCase (`profile.ts`)
- **Database schemas**: camelCase (`users.ts`)
- **Specs**: kebab-case (`user-profile_spec.md`)

### Import Aliases
- `~/` maps to `src/`
- Example: `import { db } from "~/server/db"`

---

## Documentation Workflow

### Specification Files
- Location: `/specs/[feature-name]_spec.md`
- Naming: kebab-case from feature name
- Format: Use `.claude/templates/feature_spec.md`

### Agent Logs
- Location: `.claude/logs/[feature]_log_YYYYMMDD.jsonl`
- Format: JSONL (one JSON object per line)
- Content: Full prompts/responses, not summaries

---

## Environment Setup

### Prerequisites
1. Bun installed (1.3+)
2. Docker Desktop running
3. `.env` file configured

### First Time Setup
```bash
# 1. Install dependencies
bun install

# 2. Start database
docker compose up -d

# 3. Apply schema and seed
bun run db:reset:full

# 4. Start dev server
bun run dev
```

### Daily Workflow
```bash
# Start services
docker compose up -d
bun run dev

# Before committing
bun run check
```

---

## Quality Gates

### Code Quality
- [ ] TypeScript strict mode passes
- [ ] ESLint passes
- [ ] Prettier formatting correct
- [ ] No `any` types (use `unknown` if needed)

### Functionality
- [ ] Feature works as specified
- [ ] Edge cases handled
- [ ] Error states covered
- [ ] Loading states implemented

### Security
- [ ] Input validation (Zod)
- [ ] Protected procedures for auth routes
- [ ] No secrets in code
- [ ] No console.logs with sensitive data
