# Security Context

Security requirements for info-web T3 Stack project.

## Authentication

### NextAuth v5

**Provider**: Yandex OAuth

**Configuration**: `src/server/auth/config.ts`

**Key Patterns**:
```yaml
Session Strategy: JWT (default) or Database
Callbacks:
  - session: Enrich session with user data
  - jwt: Store additional claims
  - signIn: Validate sign-in attempts
```

### Session Management

| Aspect | Approach |
|--------|----------|
| Storage | JWT in HTTP-only cookie |
| Expiration | Configurable (default 30 days) |
| Refresh | Automatic via NextAuth |
| Invalidation | Sign out clears session |

### Protected Routes

**Server Components**:
```typescript
import { auth } from "~/server/auth";

export default async function Page() {
  const session = await auth();
  if (!session) redirect("/api/auth/signin");
  // ... protected content
}
```

**Client Components**:
```typescript
"use client";
import { useSession } from "next-auth/react";

export function Component() {
  const { data: session, status } = useSession();
  if (status === "loading") return <Loading />;
  if (!session) return <Unauthorized />;
  // ... protected content
}
```

---

## Authorization

### tRPC Procedures

| Type | Use Case |
|------|----------|
| `publicProcedure` | Public endpoints (no auth) |
| `protectedProcedure` | Authenticated users only |

**Pattern**:
```typescript
// Public - anyone can access
export const publicRouter = createTRPCRouter({
  getPublicData: publicProcedure
    .query(async ({ ctx }) => {
      // No session required
    }),
});

// Protected - requires authentication
export const protectedRouter = createTRPCRouter({
  getUserData: protectedProcedure
    .query(async ({ ctx }) => {
      // ctx.session is guaranteed
      const userId = ctx.session.user.id;
    }),
});
```

### Role-Based Access

**Implementation**: `src/server/auth/rbac.ts`

**Pattern**:
```yaml
Roles:
  - user: Basic authenticated user
  - admin: Administrative access
  - moderator: Content moderation

Check Pattern:
  1. Verify session exists
  2. Check user role in session
  3. Return 403 if unauthorized
```

---

## Input Validation

### Zod Schemas

**ALWAYS validate tRPC inputs**:

```typescript
export const userRouter = createTRPCRouter({
  updateProfile: protectedProcedure
    .input(z.object({
      name: z.string().min(1).max(100),
      email: z.string().email(),
      bio: z.string().max(500).optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      // input is validated and typed
    }),
});
```

### Validation Rules

| Field Type | Validations |
|------------|-------------|
| Strings | min/max length, pattern, trim |
| Numbers | min/max, integer, positive |
| Emails | z.string().email() |
| URLs | z.string().url() |
| UUIDs | z.string().uuid() |
| Enums | z.enum([...]) |

---

## Data Protection

### Database Security

**Drizzle ORM provides**:
- Parameterized queries (SQL injection protection)
- Type-safe queries (prevents malformed queries)

**DO NOT**:
- Use raw SQL with string concatenation
- Trust user input in queries
- Expose database errors to clients

### Sensitive Data

| Data Type | Handling |
|-----------|----------|
| Passwords | Hash with bcrypt (never store plain) |
| Tokens | Store hashed, compare with timing-safe |
| Personal data | Minimize storage, encrypt at rest |
| API keys | Environment variables only |

---

## Environment Variables

### Required Variables

```env
# Database
DATABASE_URL="postgresql://..."

# Auth
AUTH_SECRET="..."
AUTH_YANDEX_ID="..."
AUTH_YANDEX_SECRET="..."

# App
NEXTAUTH_URL="http://localhost:3000"
```

### Security Rules

| Rule | Implementation |
|------|----------------|
| Never commit .env | .gitignore includes .env* |
| Use .env.example | Template without values |
| Validate at startup | @t3-oss/env-nextjs |
| Rotate secrets | Regular rotation schedule |

---

## Error Handling

### Safe Error Messages

**DO**:
- Return generic messages to clients
- Log detailed errors server-side
- Include correlation IDs for debugging

**DON'T**:
- Expose stack traces
- Reveal database structure
- Show internal paths

**Pattern**:
```typescript
try {
  // operation
} catch (error) {
  console.error("Operation failed:", error);
  throw new TRPCError({
    code: "INTERNAL_SERVER_ERROR",
    message: "An unexpected error occurred",
  });
}
```

---

## Common Security Checks

### Before Deployment

- [ ] All routes properly protected
- [ ] No secrets in code or logs
- [ ] Input validation on all endpoints
- [ ] Error messages are safe
- [ ] HTTPS enforced (production)
- [ ] CORS configured correctly
- [ ] Rate limiting considered

### Code Review Security Checklist

- [ ] No SQL injection vectors
- [ ] No XSS vulnerabilities
- [ ] Auth checks in place
- [ ] Sensitive data handled properly
- [ ] No hardcoded credentials
- [ ] Proper error handling

---

## Quick Reference

| Security Concern | Solution |
|-----------------|----------|
| Authentication | NextAuth v5 + Yandex OAuth |
| Authorization | protectedProcedure + RBAC |
| Input validation | Zod schemas |
| SQL injection | Drizzle ORM (parameterized) |
| XSS | React auto-escaping |
| CSRF | Next.js built-in protection |
| Secrets | Environment variables |
| Passwords | bcrypt hashing |
