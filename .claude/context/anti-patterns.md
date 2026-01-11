# Anti-Patterns Library

**Version**: 1.0
**Last Updated**: 2026-01-09
**Purpose**: Catalog anti-patterns to avoid in code and agent instructions

## Overview

This document provides concrete examples of anti-patterns encountered in software development and AI agent infrastructure. Each pattern includes:
- **Problem**: What the anti-pattern is
- **Example**: Code or configuration demonstrating the issue
- **Impact**: Why this is problematic
- **Solution**: How to fix it

## Category 1: Wrong Abstractions

### Anti-Pattern 1.1: Interface Misuse

**Problem**: Creating interfaces but referencing concrete types, losing abstraction benefits

**Example**:
```typescript
// ❌ BAD: Created interface but still reference concrete types
interface IEmailService {
  send(to: string, subject: string, body: string): Promise<void>;
}

class NodemailerService implements IEmailService {
  async send(to: string, subject: string, body: string) {
    // Implementation
  }
}

// Anti-pattern: Direct dependency on concrete class
class UserService {
  private emailService: NodemailerService; // Should be IEmailService!

  constructor() {
    this.emailService = new NodemailerService();
  }
}
```

**Impact**:
- Tight coupling to implementation
- Cannot swap implementations for testing
- Interface serves no purpose
- Violates Dependency Inversion Principle

**Solution**:
```typescript
// ✅ GOOD: Reference interface, inject implementation
class UserService {
  private emailService: IEmailService; // Use interface

  constructor(emailService: IEmailService) {
    this.emailService = emailService; // Injected
  }
}

// Can now inject mock for testing
const mockEmailService = new MockEmailService();
const userService = new UserService(mockEmailService);
```

### Anti-Pattern 1.2: God Object

**Problem**: Single class/component doing too many unrelated things

**Example**:
```typescript
// ❌ BAD: UserManager does everything
class UserManager {
  createUser() { }
  deleteUser() { }
  sendEmail() { }
  validatePassword() { }
  generateReport() { }
  exportCSV() { }
  logActivity() { }
  checkPermissions() { }
}
```

**Impact**:
- Violates Single Responsibility Principle
- Hard to test
- Hard to maintain
- Unclear dependencies

**Solution**:
```typescript
// ✅ GOOD: Separate responsibilities
class UserRepository {
  create() { }
  delete() { }
}

class EmailService {
  send() { }
}

class PasswordValidator {
  validate() { }
}

class UserReportGenerator {
  generate() { }
}

class PermissionChecker {
  check() { }
}
```

### Anti-Pattern 1.3: Leaky Abstraction

**Problem**: Abstraction exposes implementation details

**Example**:
```typescript
// ❌ BAD: Abstraction leaks database details
interface IUserRepository {
  findById(id: string): Promise<DrizzleUser>; // Leaks Drizzle!
  findWithRelations(query: DrizzleQuery): Promise<DrizzleUser[]>; // Leaks Drizzle!
}
```

**Impact**:
- Cannot change ORM without breaking interface
- Consumers depend on implementation details
- Abstraction is useless

**Solution**:
```typescript
// ✅ GOOD: Domain types, not ORM types
interface IUserRepository {
  findById(id: string): Promise<User>; // Domain type
  findWithApartments(userId: string): Promise<User>; // Business method
}
```

## Category 2: Over-Engineering

### Anti-Pattern 2.1: Premature Optimization

**Problem**: Optimizing before measuring, adding complexity for hypothetical performance gains

**Example**:
```typescript
// ❌ BAD: Added complex caching for unproven bottleneck
class ListingService {
  private cache = new Map<string, Listing>();
  private cacheExpiry = new Map<string, number>();

  async getById(id: string) {
    // Check cache
    if (this.cache.has(id) && this.cacheExpiry.get(id)! > Date.now()) {
      return this.cache.get(id);
    }

    // Fetch from DB
    const listing = await db.query.listings.findFirst({ where: eq(listings.id, id) });

    // Update cache
    this.cache.set(id, listing);
    this.cacheExpiry.set(id, Date.now() + 60000);

    return listing;
  }
}
```

**Impact**:
- Added 20+ lines of cache management code
- No proof this query is slow
- Complexity without benefit
- Cache invalidation bugs

**Solution**:
```typescript
// ✅ GOOD: Start simple, measure first
class ListingService {
  async getById(id: string) {
    return db.query.listings.findFirst({ where: eq(listings.id, id) });
  }
}

// THEN: If slow (measured with profiler), add caching
// ONLY after proving it's a bottleneck
```

### Anti-Pattern 2.2: Premature Abstraction

**Problem**: Creating abstractions for patterns that appear only once or twice

**Example**:
```typescript
// ❌ BAD: Created "reusable" utility used once
function formatUserDisplayName(firstName: string | null, lastName: string | null, email: string): string {
  if (firstName && lastName) return `${firstName} ${lastName}`;
  if (firstName) return firstName;
  if (lastName) return lastName;
  return email;
}

// Used in exactly ONE place
const displayName = formatUserDisplayName(user.firstName, user.lastName, user.email);
```

**Impact**:
- Utility function for single use case
- Premature abstraction
- Harder to understand inline

**Solution**:
```typescript
// ✅ GOOD: Inline until pattern repeats 3+ times
const displayName = user.firstName && user.lastName
  ? `${user.firstName} ${user.lastName}`
  : user.firstName || user.lastName || user.email;

// ONLY extract when pattern appears 3+ times
```

### Anti-Pattern 2.3: Feature Flag Overload

**Problem**: Adding feature flags for everything "just in case"

**Example**:
```typescript
// ❌ BAD: Feature flag for simple UI change
const showNewButton = await checkFeatureFlag('show_copy_button');

if (showNewButton) {
  return <Button>Copy</Button>;
}
return null;
```

**Impact**:
- Complexity without value
- Technical debt (flags never removed)
- Slower development
- Configuration bloat

**Solution**:
```typescript
// ✅ GOOD: Just ship the button
return <Button>Copy</Button>;

// Use feature flags ONLY for:
// - Gradual rollouts (high risk features)
// - A/B testing (measured experiments)
// - Business toggles (permanent configuration)
```

## Category 3: Code Duplication

### Anti-Pattern 3.1: Copy-Paste Programming

**Problem**: Duplicating code instead of extracting shared logic

**Example**:
```typescript
// ❌ BAD: Duplicated validation logic
async function createListing(data: any) {
  if (!data.title || data.title.length < 3) throw new Error('Title too short');
  if (!data.description || data.description.length < 10) throw new Error('Description too short');
  if (!data.price || data.price <= 0) throw new Error('Invalid price');
  // ... create listing
}

async function updateListing(id: string, data: any) {
  if (!data.title || data.title.length < 3) throw new Error('Title too short');
  if (!data.description || data.description.length < 10) throw new Error('Description too short');
  if (!data.price || data.price <= 0) throw new Error('Invalid price');
  // ... update listing
}
```

**Impact**:
- Duplicate validation logic
- Bugs fixed in one place but not other
- Harder to maintain
- Violates DRY principle

**Solution**:
```typescript
// ✅ GOOD: Extract shared validation
const listingSchema = z.object({
  title: z.string().min(3),
  description: z.string().min(10),
  price: z.number().positive(),
});

async function createListing(data: unknown) {
  const validated = listingSchema.parse(data); // Single source of truth
  // ... create listing
}

async function updateListing(id: string, data: unknown) {
  const validated = listingSchema.parse(data); // Same validation
  // ... update listing
}
```

### Anti-Pattern 3.2: Reinventing the Wheel

**Problem**: Writing custom utilities when standard libraries exist

**Example**:
```typescript
// ❌ BAD: Custom date formatting when libraries exist
function formatDate(date: Date): string {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
}
```

**Impact**:
- Reinventing standard functionality
- More code to maintain
- Likely has bugs (timezone, locale)
- Wastes development time

**Solution**:
```typescript
// ✅ GOOD: Use standard library or well-tested utility
import { format } from 'date-fns';

const formatted = format(date, 'MMM d, yyyy');

// Or native Intl API
const formatted = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: 'numeric',
  year: 'numeric'
}).format(date);
```

### Anti-Pattern 3.3: Generating Duplicate Code (AI Agents)

**Problem**: AI agents generating new code without checking if similar functionality exists

**Example**:
```typescript
// ❌ BAD: Agent generates NEW utility without checking
// File: src/utils/stringHelpers.ts (newly generated)
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
}

// But this ALREADY EXISTS:
// File: src/lib/utils.ts (existing)
export function truncate(str: string, length: number): string {
  return str.length > length ? str.substring(0, length) + '...' : str;
}
```

**Impact**:
- Code duplication
- Inconsistent implementations
- Maintenance burden (bug fixes in multiple places)
- Codebase bloat

**Solution**:
```typescript
// ✅ GOOD: Agent searches BEFORE generating
// 1. Agent runs: grep -r "truncate\|truncateText" src/
// 2. Finds existing truncate() in src/lib/utils.ts
// 3. Reuses existing function instead of creating new

import { truncate } from '@/lib/utils';

const short = truncate(longText, 50);
```

## Category 4: Architecture Violations

### Anti-Pattern 4.1: Business Logic in UI Components

**Problem**: Complex business logic embedded in React components instead of API layer

**Example**:
```tsx
// ❌ BAD: Business logic in component
function ListingCard({ listing }: { listing: Listing }) {
  const canEdit = listing.userId === session?.user?.id
    || session?.user?.roles.includes('Admin')
    || session?.user?.roles.includes('Moderator')
    || (listing.status === 'draft' && /* complex logic */);

  const isExpired = listing.expiresAt
    && new Date(listing.expiresAt) < new Date()
    && listing.status !== 'archived';

  // ... 50 more lines of business logic
}
```

**Impact**:
- Business logic not reusable
- Cannot test without rendering component
- Violates separation of concerns
- Logic duplicated across components

**Solution**:
```tsx
// ✅ GOOD: Business logic in tRPC router or domain layer
// File: src/server/api/routers/listings.ts
export const listingsRouter = createTRPCRouter({
  canEdit: protectedProcedure
    .input(z.object({ listingId: z.string() }))
    .query(async ({ ctx, input }) => {
      const listing = await ctx.db.query.listings.findFirst({ /* ... */ });
      return canEditListing(listing, ctx.session.user); // Domain logic
    }),
});

// File: src/components/ListingCard.tsx
function ListingCard({ listing }: { listing: Listing }) {
  const { data: canEdit } = api.listings.canEdit.useQuery({ listingId: listing.id });
  // Simple UI logic only
}
```

### Anti-Pattern 4.2: Direct Database Access in Frontend

**Problem**: Frontend code directly accessing database instead of using API layer

**Example**:
```tsx
// ❌ BAD: Direct database import in client component
'use client';
import { db } from '~/server/db'; // Should NOT be imported in client!

export function UserProfile() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      const result = await db.query.users.findFirst({ /* ... */ }); // WRONG!
      setUser(result);
    };
    fetchUser();
  }, []);
}
```

**Impact**:
- Breaks client/server boundary
- Exposes database credentials to browser
- No authorization checks
- Violates architecture boundaries

**Solution**:
```tsx
// ✅ GOOD: Use tRPC API layer
'use client';

export function UserProfile() {
  const { data: user } = api.profile.getCurrent.useQuery(); // Use tRPC
  // tRPC enforces auth, validation, and proper boundaries
}
```

### Anti-Pattern 4.3: Multi-Tenant Data Leakage

**Problem**: Missing tenant isolation filters, exposing cross-tenant data

**Example**:
```typescript
// ❌ BAD: Missing building filter (multi-tenant isolation)
export const getApartments = async () => {
  return db.query.apartments.findMany(); // Returns ALL apartments (all buildings)!
};

// User from Building 1 sees apartments from Buildings 2, 3, 4...
```

**Impact**:
- **CRITICAL SECURITY ISSUE**: Cross-tenant data exposure
- Privacy violation
- Regulatory compliance failure
- Data breach

**Solution**:
```typescript
// ✅ GOOD: Always filter by tenant (building)
export const getApartments = async (buildingId: string) => {
  return db.query.apartments.findMany({
    where: eq(apartments.buildingId, buildingId), // Tenant isolation
  });
};

// Better: Use middleware to auto-inject tenant filter
```

### Anti-Pattern 4.4: Mixing Sync and Async Inappropriately

**Problem**: Using async patterns for operations that should be sync, or vice versa

**Example**:
```typescript
// ❌ BAD: Blocking user request to send email
export const createUser = async (data: CreateUserInput) => {
  const user = await db.insert(users).values(data).returning();

  // Anti-pattern: Blocking request to send welcome email
  await sendWelcomeEmail(user.email); // Blocks response for 2-5 seconds!

  return user;
};
```

**Impact**:
- Slow response times (2-5s for email delivery)
- Poor user experience
- Timeout risks
- Wasted server resources

**Solution**:
```typescript
// ✅ GOOD: Fire and forget for non-critical operations
export const createUser = async (data: CreateUserInput) => {
  const user = await db.insert(users).values(data).returning();

  // Non-blocking: send email in background
  notifyAsync({
    type: 'user.registered',
    userId: user.id,
    email: user.email
  }); // Returns immediately

  return user; // Fast response (~100ms instead of 3s)
};
```

## Category 5: Security Anti-Patterns

### Anti-Pattern 5.1: SQL Injection via String Concatenation

**Problem**: Building SQL queries with string concatenation instead of parameterized queries

**Example**:
```typescript
// ❌ BAD: SQL injection vulnerability
export const searchUsers = async (searchTerm: string) => {
  return db.execute(sql`
    SELECT * FROM users WHERE name LIKE '%${searchTerm}%'
  `); // Vulnerable to: searchTerm = "'; DROP TABLE users; --"
};
```

**Impact**:
- **CRITICAL**: SQL injection vulnerability
- Data breach potential
- Database destruction risk
- Regulatory violation

**Solution**:
```typescript
// ✅ GOOD: Parameterized query (Drizzle protects automatically)
export const searchUsers = async (searchTerm: string) => {
  return db.query.users.findMany({
    where: like(users.name, `%${searchTerm}%`), // Safe: Drizzle escapes
  });
};

// Or with sql tag (parameterized):
return db.execute(sql`
  SELECT * FROM users WHERE name LIKE ${'%' + searchTerm + '%'}
`); // Safe: Drizzle uses prepared statement
```

### Anti-Pattern 5.2: Exposing Sensitive Data in API Responses

**Problem**: Returning password hashes, tokens, or internal IDs in API responses

**Example**:
```typescript
// ❌ BAD: Exposing password hash to client
export const getCurrentUser = async (userId: string) => {
  return db.query.users.findFirst({
    where: eq(users.id, userId),
    // Returns ALL fields including passwordHash!
  });
};
```

**Impact**:
- Exposes password hashes (crackable)
- Leaks internal implementation details
- Privacy violation
- Security risk

**Solution**:
```typescript
// ✅ GOOD: Explicit field selection, exclude sensitive data
export const getCurrentUser = async (userId: string) => {
  return db.query.users.findFirst({
    where: eq(users.id, userId),
    columns: {
      id: true,
      email: true,
      name: true,
      // passwordHash: false (explicitly excluded)
    },
  });
};
```

### Anti-Pattern 5.3: Missing Authorization Checks

**Problem**: Validating authentication but not authorization (who can do what)

**Example**:
```typescript
// ❌ BAD: Checks if user is logged in, but not if they OWN the listing
export const deleteListing = protectedProcedure
  .input(z.object({ id: z.string() }))
  .mutation(async ({ ctx, input }) => {
    // Missing ownership check!
    return ctx.db.delete(listings).where(eq(listings.id, input.id));
    // Any logged-in user can delete ANY listing!
  });
```

**Impact**:
- **CRITICAL**: Unauthorized access
- Users can delete others' data
- Privilege escalation
- Data integrity violation

**Solution**:
```typescript
// ✅ GOOD: Verify ownership BEFORE allowing mutation
export const deleteListing = protectedProcedure
  .input(z.object({ id: z.string() }))
  .mutation(async ({ ctx, input }) => {
    const listing = await ctx.db.query.listings.findFirst({
      where: eq(listings.id, input.id),
    });

    if (!listing) throw new TRPCError({ code: 'NOT_FOUND' });

    // Authorization check: user must own listing OR be admin
    if (listing.userId !== ctx.session.user.id && !ctx.session.user.roles.includes('Admin')) {
      throw new TRPCError({ code: 'FORBIDDEN' });
    }

    return ctx.db.delete(listings).where(eq(listings.id, input.id));
  });
```

## Category 6: Agent Instruction Anti-Patterns

### Anti-Pattern 6.1: Vague Instructions

**Problem**: Agent instructions without clear criteria or measurable outcomes

**Example**:
```markdown
❌ BAD Agent Instruction:
"Consider using best practices for performance optimization when implementing features."
```

**Impact**:
- No actionable guidance
- Agent doesn't know WHEN to optimize
- No success criteria
- Inconsistent application

**Solution**:
```markdown
✅ GOOD Agent Instruction:
"Optimize performance when:
- Expected traffic > 1000 req/s (see nfr-matrix.md)
- Latency requirement < 100ms p95
- Query complexity > 3 joins

Performance checklist:
- [ ] Database queries use indexes
- [ ] No N+1 queries
- [ ] Pagination for > 100 records
- [ ] Measured with profiler before/after"
```

### Anti-Pattern 6.2: Duplicate Content Across Agent Instructions

**Problem**: Copying guidelines into agent instructions instead of referencing

**Example**:
```markdown
❌ BAD: Copying FRONTEND_GUIDELINES.md content into frontend-developer agent
[Entire 964-word guideline copied into agent instruction]
```

**Impact**:
- Token waste (duplicate content)
- Maintenance burden (update in multiple places)
- Inconsistency when guidelines change
- Violates DRY principle

**Solution**:
```markdown
✅ GOOD: Reference guideline
"Follow FRONTEND_GUIDELINES.md for:
- Component structure
- Naming conventions
- Accessibility patterns
- Testing requirements"
```

### Anti-Pattern 6.3: Missing Routing Triggers

**Problem**: Agent doesn't know when to route to specialists

**Example**:
```markdown
❌ BAD Agent Instruction:
"Implement features as requested by user."
```

**Impact**:
- Agent implements security-critical features without security review
- No collaboration with specialists
- Quality issues
- Security vulnerabilities

**Solution**:
```markdown
✅ GOOD Agent Instruction:
"Route to specialists when:
- @security-expert: PHI/PII access, auth changes, admin operations (see nfr-matrix.md)
- @architect: Data model changes > 100k records, service boundaries
- @frontend-developer: UI components, accessibility requirements
- @test-writer: Critical path changes, new API endpoints"
```

## Summary

Use this anti-patterns library when:
- **Code Review**: Check for these patterns
- **Implementation**: Avoid these pitfalls
- **Refactoring**: Identify areas to improve
- **Agent Instructions**: Reference relevant anti-patterns

**Remember**: These anti-patterns are based on real issues. Learn from them to build better systems.

## Related Documentation

- [architecture-context.md](./architecture-context.md) - System architecture
- [nfr-matrix.md](./nfr-matrix.md) - NFR-based routing triggers
- [/CLAUDE.md](../CLAUDE.md) - AI agent guidelines

---

**Version Control**: Update this document when:
- New anti-patterns are discovered
- Patterns are resolved in codebase
- New categories emerge
- Impact severity changes
