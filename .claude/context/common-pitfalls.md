# Common Pitfalls

Anti-patterns and mistakes to avoid in info-web T3 Stack development.

## Universal Anti-Patterns

### Development

| Don't | Do Instead |
|-------|------------|
| Make "drive-by" improvements | Fix only what's requested |
| Assume existing code is wrong | Understand context first |
| Copy code without understanding | Analyze before copying |
| Ignore existing patterns | Follow established conventions |
| Optimize without profiling | Measure, then optimize |
| Add dependencies carelessly | Consider bundle size, maintenance |
| Leave TODOs untracked | Document and track TODOs |
| Commit broken/untested code | Test before every commit |

### Communication

| Don't | Do Instead |
|-------|------------|
| Make changes without explaining | Explain what and why |
| Assume requirements | Ask for clarification |
| Hide errors or problems | Report issues early |
| Over-engineer simple solutions | Keep it simple |
| Under-engineer complex problems | Design appropriately |
| Add time estimates | Focus on what, not when |

---

## Next.js 16 Anti-Patterns

### Server vs Client Components

| Don't | Do Instead |
|-------|------------|
| Use "use client" everywhere | Default to Server Components |
| Fetch data in Client Components | Fetch in Server Components |
| Import server code in Client | Use proper boundaries |
| Mix Server/Client patterns | Clear separation |

### App Router

| Don't | Do Instead |
|-------|------------|
| Use pages/ directory patterns | Use app/ router patterns |
| Skip loading.tsx files | Add loading states |
| Skip error.tsx files | Add error boundaries |
| Forget about metadata | Export metadata properly |

---

## React 19 Anti-Patterns

### Components

| Don't | Do Instead |
|-------|------------|
| Use class components | Use function components |
| Overuse useEffect | Use Server Components for data |
| Create deeply nested state | Flatten state, use context wisely |
| Skip memoization blindly | Profile first, then memoize |

### Hooks

| Don't | Do Instead |
|-------|------------|
| Call hooks conditionally | Always call at top level |
| Create infinite loops | Check dependencies carefully |
| Use stale closures | Use refs for latest values |
| Forget cleanup in useEffect | Always return cleanup function |

---

## tRPC Anti-Patterns

### Routers

| Don't | Do Instead |
|-------|------------|
| Create REST-like endpoints | Design procedures semantically |
| Skip input validation | Always use Zod schemas |
| Return raw database objects | Map to DTOs/view models |
| Mix public/protected logic | Use procedure types correctly |

### Client

| Don't | Do Instead |
|-------|------------|
| Fetch in useEffect | Use tRPC hooks directly |
| Ignore loading states | Handle isLoading, isError |
| Skip optimistic updates | Implement for better UX |
| Forget invalidation | Invalidate after mutations |

---

## Drizzle ORM Anti-Patterns

### Schema

| Don't | Do Instead |
|-------|------------|
| Use raw SQL strings | Use Drizzle query builder |
| Skip foreign keys | Define proper relations |
| Forget indexes | Add indexes for common queries |
| Use nullable by default | Be explicit about nullability |

### Queries

| Don't | Do Instead |
|-------|------------|
| Select all columns always | Select only needed columns |
| N+1 queries | Use joins or `with` relations |
| Skip pagination | Always paginate large sets |
| Trust user input | Validate before querying |

---

## Security Anti-Patterns

| Don't | Do Instead |
|-------|------------|
| Trust client input | Validate with Zod |
| Skip auth checks | Use protectedProcedure |
| Log sensitive data | Sanitize logs |
| Hardcode secrets | Use environment variables |
| Expose internal errors | Return safe error messages |
| Skip CSRF protection | Use built-in Next.js protection |

---

## Testing Anti-Patterns

### Unit Tests (Jest + RTL)

| Don't | Do Instead |
|-------|------------|
| Test implementation details | Test behavior |
| Use arbitrary timeouts | Use proper async utilities |
| Mock everything | Mock external dependencies only |
| Skip edge cases | Cover error states |

### E2E Tests (Playwright)

| Don't | Do Instead |
|-------|------------|
| Use hardcoded waits | Use proper waitFor |
| Test text content only | Use data-testid selectors |
| Skip mobile testing | Test responsive behavior |
| Ignore flaky tests | Fix or quarantine them |

---

## TypeScript Anti-Patterns

| Don't | Do Instead |
|-------|------------|
| Use `any` type | Use `unknown` or proper types |
| Ignore type errors | Fix or document with comment |
| Over-type simple objects | Let inference work |
| Under-type complex APIs | Be explicit at boundaries |
| Use type assertions (`as`) | Use type guards |

---

## Performance Anti-Patterns

| Don't | Do Instead |
|-------|------------|
| Import entire libraries | Import specific functions |
| Skip dynamic imports | Lazy load heavy components |
| Render large lists directly | Use virtualization |
| Bundle fonts incorrectly | Use next/font |
| Skip image optimization | Use next/image |

---

## Agent Usage Anti-Patterns

| Don't | Do Instead |
|-------|------------|
| Skip specialized agents | Use appropriate agent for task |
| Implement without spec | Use feature-planner first |
| Skip code review | Always get review before merge |
| Ignore test failures | Fix or analyze with test-analyzer |
| Over-log agent work | Log only critical tasks per MINIMAL_LOGGING.md |

---

## Quick Checklist

Before completing any work, verify:

- [ ] No drive-by improvements (only requested changes)
- [ ] Follows existing patterns
- [ ] `bun run check` passes
- [ ] `bun run build` passes
- [ ] No security issues
- [ ] Proper error handling
- [ ] Loading states implemented
- [ ] TypeScript strict mode passes
