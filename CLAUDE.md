# CLAUDE.md - T3 Stack Development Guidelines

## Quick Navigation

### Quick References
- **[AGENT_LIST.md](AGENT_LIST.md)** – Available AI agents for development workflows
- **[MCP_GUIDE.md](MCP_GUIDE.md)** – MCP server setup (Playwright, Context7, Codex, Figma, etc.)
- **[.claude/instructions/](.claude/instructions/)** – Workflow instructions (Playwright automation, Markdown workflows)

**⚠️ This file contains COMMON RULES that apply to ALL development work.**

## Repository Overview

```
info-web/
├── CLAUDE.md               # 📍 You are here - Development guidelines
├── .claude/                # 🤖 AI configuration
│   ├── agents/            # Development workflow agents
│   ├── contexts/          # Context files
│   ├── guidelines/        # Domain-specific guidelines
│   └── instructions/      # Shared workflows
│
├── src/                    # 🔧 Application source code
│   ├── app/               # Next.js App Router pages
│   ├── components/        # React components
│   ├── server/            # tRPC routers & server logic
│   ├── styles/            # Global styles
│   └── env.js             # Environment variable validation
│
├── specs/                  # 📋 Feature specifications
├── public/                 # Static assets
├── drizzle/               # Database migrations
├── .github/workflows/     # CI/CD pipelines
└── docker-compose.yml     # PostgreSQL container
```

## Technology Stack

### Core Framework (T3 Stack)
- **Next.js 16.0.1**: App Router, React Server Components, API routes
- **React 19.2.0**: Server Components, Suspense, concurrent features
- **TypeScript 5.9.3**: Strict mode enabled
- **tRPC 11.7.1**: Type-safe API layer with React Query integration
- **Drizzle ORM 0.44.7**: Type-safe PostgreSQL ORM
- **NextAuth 5.0.0-beta.25**: Authentication with Yandex OAuth

### Styling & UI
- **TailwindCSS 4.1.17**: Utility-first CSS framework
- **Radix UI**: Accessible component primitives
- **Geist Font**: Modern typography

### Validation & Type Safety
- **Zod**: Runtime type validation
- **@t3-oss/env-nextjs**: Type-safe environment variables

### Development Tools
- **Bun 1.3+**: Package manager and runtime
- **ESLint 9**: Flat config with comprehensive rules
- **Prettier**: Code formatting
- **Docker**: PostgreSQL database containerization

### Testing
- **Jest**: Unit and integration testing
- **React Testing Library**: Component testing
- **Playwright**: E2E and accessibility testing

## Critical Development Rules

### MANDATORY: Verify Before Recommending
- **NEVER provide links without verification** - Always test links exist first
- **ALWAYS verify npm packages** before suggesting installation
- **USE WebFetch or WebSearch** to confirm URLs are valid
- **If uncertain about a link**, explicitly state: "I haven't verified this link exists"

### MANDATORY: No Time Estimates Unless Requested
- **NEVER add time estimates** unless explicitly asked
- **AVOID phrases like** "this will take 2-3 hours"
- **FOCUS on the work**, not the duration

### MANDATORY: Fix Only What's Requested
- **NEVER make unauthorized "improvements"**
- **NEVER assume code needs optimization** without explicit permission
- **ALWAYS explain WHY** before suggesting any changes
- **ALWAYS get explicit approval** before implementing suggestions

### MANDATORY: Follow Established Patterns
- **ALWAYS consult documentation** before creating solutions
- **NEVER reinvent patterns** that already exist
- **APPLY the documented patterns** from T3 Stack conventions
- **USE tRPC procedures** instead of REST endpoints
- **LEVERAGE Drizzle** for all database operations

### Project Status
- **Development Phase**: Active development, not in production
- **Breaking Changes**: Allowed - no backward compatibility required yet
- **Testing**: All changes must be tested before deployment
- **Documentation**: Update docs for any significant API changes

## Code Standards

### Universal Principles
- **Readability over cleverness** - Code is read more than written
- **Consistency with T3 Stack patterns** - Follow framework conventions
- **Type safety first** - Leverage TypeScript and Zod
- **Small, focused functions** - Each function should do one thing well
- **DRY (Don't Repeat Yourself)** - But not at the expense of clarity

### TypeScript Guidelines
- **Strict mode enabled** - No type assertions unless absolutely necessary
- **Use `type` for object shapes** - Use `interface` for extensible contracts
- **Infer types when possible** - Let TypeScript do the work
- **Avoid `any`** - Use `unknown` if type is truly unknown
- **Use Zod for validation** - Runtime type safety at boundaries

### Next.js 16 Patterns

#### Server Components (Default)
```typescript
// src/app/page.tsx
export default async function Page() {
  const data = await api.myRouter.getData();
  return <div>{data.name}</div>;
}
```

#### Client Components (When Needed)
```typescript
// src/components/interactive.tsx
"use client";

export function InteractiveComponent() {
  const [state, setState] = useState("");
  return <button onClick={() => setState("clicked")}>Click me</button>;
}
```

#### Server Actions
```typescript
// src/app/actions.ts
"use server";

export async function submitForm(formData: FormData) {
  // Server-side validation and processing
  return { success: true };
}
```

### tRPC Patterns

#### Protected Procedure
```typescript
// src/server/api/routers/property.ts
export const propertyRouter = createTRPCRouter({
  register: protectedProcedure
    .input(z.object({
      buildingId: z.string(),
      number: z.number(),
      type: z.enum(["apartment", "parking"]),
    }))
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.insert(properties).values({
        ...input,
        userId: ctx.session.user.id,
      });
    }),
});
```

#### Client Usage (Server Component)
```typescript
// src/app/properties/page.tsx
export default async function PropertiesPage() {
  const properties = await api.property.getAll();
  return <PropertyList properties={properties} />;
}
```

#### Client Usage (Client Component)
```typescript
// src/components/property-form.tsx
"use client";

export function PropertyForm() {
  const utils = api.useUtils();
  const register = api.property.register.useMutation({
    onSuccess: () => utils.property.getAll.invalidate(),
  });

  return <form onSubmit={...}>...</form>;
}
```

### Drizzle ORM Patterns

#### Schema Definition
```typescript
// src/server/db/schema.ts
export const properties = pgTable("property", {
  id: uuid("id").defaultRandom().primaryKey(),
  buildingId: uuid("building_id").references(() => buildings.id),
  number: integer("number").notNull(),
  type: text("type", { enum: ["apartment", "parking"] }).notNull(),
  userId: varchar("user_id", { length: 255 }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
```

#### Query Patterns
```typescript
// Type-safe queries
const property = await db.query.properties.findFirst({
  where: eq(properties.id, id),
  with: { building: true },
});

// Joins with relations
const properties = await db.query.properties.findMany({
  with: {
    building: true,
    user: true,
  },
});
```

### NextAuth v5 Patterns

#### Configuration
```typescript
// src/server/auth/config.ts
export const authConfig = {
  providers: [
    YandexProvider({
      clientId: env.YANDEX_CLIENT_ID,
      clientSecret: env.YANDEX_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    session: ({ session, user }) => ({
      ...session,
      user: {
        ...session.user,
        id: user.id,
      },
    }),
  },
} satisfies NextAuthConfig;
```

#### Usage in Server Components
```typescript
// src/app/dashboard/page.tsx
import { auth } from "~/server/auth";

export default async function Dashboard() {
  const session = await auth();
  if (!session) redirect("/login");
  return <div>Welcome {session.user.name}</div>;
}
```

#### Usage in Client Components
```typescript
// src/components/user-menu.tsx
"use client";
import { useSession } from "next-auth/react";

export function UserMenu() {
  const { data: session } = useSession();
  return <div>{session?.user?.name}</div>;
}
```

## Security Requirements

### Authentication & Authorization
- **Use NextAuth v5** for all authentication
- **Validate sessions** on server-side before data access
- **Never trust client data** - validate on server
- **Use protected procedures** in tRPC for authenticated routes

### Input Validation
- **Zod schemas required** for all tRPC inputs
- **Sanitize user input** before display
- **Parameterized queries only** (Drizzle handles this)
- **Validate file uploads** - check type, size, content

### Environment Variables
- **Never commit secrets** to git
- **Use .env.local** for local development
- **Validate with Zod** in `src/env.js`
- **Required vars**: Check `.env.example` for template

### Common Security Pitfalls
- ❌ SQL injection - Use Drizzle, never string concatenation
- ❌ XSS - React escapes by default, but sanitize user HTML
- ❌ CSRF - Next.js protects API routes automatically
- ❌ Session hijacking - Use HTTPS, secure cookies (handled by NextAuth)

## Testing Philosophy

### Test Coverage Targets
- **Unit/Integration**: 80% coverage minimum
- **Critical flows**: 100% coverage (auth, property registration)
- **E2E tests**: All user journeys tested

### Testing Patterns

#### Component Tests (Jest + RTL)
```typescript
// src/components/__tests__/property-form.test.tsx
import { render, screen } from "@testing-library/react";
import { PropertyForm } from "../property-form";

test("renders property form", () => {
  render(<PropertyForm />);
  expect(screen.getByLabelText(/building/i)).toBeInTheDocument();
});
```

#### tRPC Procedure Tests
```typescript
// src/server/api/routers/__tests__/property.test.ts
import { createCaller } from "../_app";

test("registers property", async () => {
  const caller = createCaller(mockContext);
  const result = await caller.property.register({
    buildingId: "123",
    number: 42,
    type: "apartment",
  });
  expect(result.id).toBeDefined();
});
```

#### E2E Tests (Playwright)
```typescript
// tests/e2e/property-registration.spec.ts
import { test, expect } from "@playwright/test";

test("user can register property", async ({ page }) => {
  await page.goto("/properties/add");
  await page.fill('input[name="number"]', "42");
  await page.click('button[type="submit"]');
  await expect(page.getByText("Success")).toBeVisible();
});
```

## Workflow Requirements

### Before Starting Work
1. **Understand the requirement** - Ask for clarification if needed
2. **Check existing patterns** - Look for similar implementations
3. **Plan the approach** - Use feature-planner agent for complex work
4. **Verify environment** - Ensure database is running, env vars set

### During Development
1. **Use TypeScript strict mode** - Fix all type errors
2. **Validate with Zod** - All external inputs must be validated
3. **Test continuously** - Run tests after changes
4. **Follow conventions** - Use established patterns

### Before Completion
1. **Run all tests** - `bun test`
2. **Check build** - `bun run build`
3. **Run linter** - `bunx eslint .`
4. **Review changes** - Self-review before marking complete
5. **Update documentation** - If behavior changes

## Git Workflow

### Branch Strategy
- **main**: Production-ready code
- **feature/[name]**: New features
- **fix/[name]**: Bug fixes

### Commit Guidelines
- **Clear messages** - Describe what and why
- **Atomic commits** - One logical change per commit
- **Reference issues** - Include ticket numbers when applicable
- **No broken commits** - Every commit should build

### Commit Message Format
```
feat: add property registration form

- Implement form validation with Zod
- Add tRPC mutation for property creation
- Include unit tests for form component
```

## Performance Considerations

### Next.js 16 Optimizations
- **Server Components by default** - Use client components sparingly
- **Dynamic imports** - Code split heavy components
- **Image optimization** - Use `next/image` for all images
- **Font optimization** - Use `next/font` for web fonts

### tRPC Optimizations
- **Batch requests** - Enable batching for multiple queries
- **Cache strategies** - Use React Query staleTime appropriately
- **Prefetch data** - Use `prefetch` for predictable navigation

### Database Optimizations
- **Index properly** - Add indexes for common queries
- **Limit queries** - Use pagination for large datasets
- **Select only needed fields** - Don't fetch entire tables
- **Use database-level joins** - Better than N+1 queries

## Common Pitfalls to Avoid

### Development Anti-patterns
- ❌ Using `any` type - Defeats TypeScript purpose
- ❌ Client components everywhere - Impacts performance
- ❌ Ignoring tRPC - Don't create REST endpoints
- ❌ Bypassing Drizzle - Don't use raw SQL
- ❌ Skipping validation - Always use Zod at boundaries
- ❌ Not testing - Write tests as you code

### Next.js 16 Specific
- ❌ Mixing Server/Client patterns incorrectly
- ❌ Not handling async Server Components properly
- ❌ Forgetting `"use client"` directive when needed
- ❌ Importing server code in client components

### React 19 Specific
- ❌ Not understanding Server Components vs Client Components
- ❌ Misusing Suspense boundaries
- ❌ Incorrect data fetching patterns

## Agent Usage Guidelines

See **[AGENT_LIST.md](AGENT_LIST.md)** for detailed agent information.

### Quick Agent Reference
- **New feature**: `feature-planner` → `feature-builder`
- **Code review**: `code-reviewer`
- **Testing**: `test-coordinator` → routes to specialists
- **Frontend work**: `frontend-developer`
- **tRPC design**: `trpc-architect`
- **Database schema**: `database-architect`
- **Debugging**: `debugger`
- **Security**: `security-expert`

## MCP Tool Integration

See **[MCP_GUIDE.md](MCP_GUIDE.md)** for setup instructions.

### Available MCP Tools
- **Playwright MCP**: Browser automation and E2E testing
- **Chrome DevTools MCP**: Performance profiling and debugging
- **Figma MCP**: Design-to-code translation
- **Codex MCP**: Architecture validation (High/Medium)
- **Context7 MCP**: Library documentation lookup
- **Gemini MCP**: Document processing
- **Mermaid MCPs**: Diagram creation and validation

## Getting Help

### Documentation Resources
- **T3 Stack**: https://create.t3.gg/
- **Next.js 16**: https://nextjs.org/docs
- **tRPC**: https://trpc.io/docs
- **Drizzle**: https://orm.drizzle.team/docs/overview
- **NextAuth**: https://next-auth.js.org/
- **TailwindCSS**: https://tailwindcss.com/docs

### Common Questions
- **Environment setup**: Check `.env.example` and `docker-compose.yml`
- **Database migrations**: Use `bun run db:generate` and `bun run db:push`
- **Type errors**: Run `bunx tsc --noEmit` for details
- **Build failures**: Check `bun run build` output
- **Testing**: See test files for examples

## Project-Specific Conventions

### Naming Conventions
- **Components**: PascalCase (`PropertyForm.tsx`)
- **Utils**: camelCase (`formatDate.ts`)
- **Constants**: UPPER_SNAKE_CASE (`MAX_UPLOAD_SIZE`)
- **Database tables**: snake_case (`user_properties`)

### File Organization
- **Components**: `/src/components/[name].tsx`
- **tRPC routers**: `/src/server/api/routers/[name].ts`
- **Database schemas**: `/src/server/db/schema.ts`
- **Utilities**: `/src/lib/[category]/[name].ts`

### Import Aliases
- **~/** - Maps to `/src/`
- Example: `import { db } from "~/server/db"`

---

*For questions or issues, refer to documentation links above or consult the development team*
