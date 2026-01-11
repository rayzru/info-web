# Frontend Development Guidelines

Guidelines for React 19 + Next.js 16 frontend development in the info-web T3 Stack project.

## Technology Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| Next.js | 16.0.10 | App Router, RSC, API routes |
| React | 19.2.3 | Server/Client Components |
| TypeScript | 5.9.3 | Strict mode |
| TailwindCSS | 4.1.18 | Utility-first styling |
| Radix UI | various | Accessible primitives |
| tRPC | 11.7.2 | Type-safe API |
| Zod | 4.1.13 | Runtime validation |

---

## Component Patterns

### Server Components (Default)

Use Server Components by default. They:
- Render on the server
- Don't ship JS to the client
- Can directly access database/APIs
- Cannot use hooks or browser APIs

```typescript
// src/app/page.tsx
import { api } from "~/trpc/server";

export default async function Page() {
  const data = await api.myRouter.getData();
  return <div>{data.name}</div>;
}
```

### Client Components (When Needed)

Add `"use client"` directive when you need:
- Event handlers (onClick, onChange, etc.)
- React hooks (useState, useEffect, etc.)
- Browser APIs (window, document, etc.)

```typescript
// src/components/interactive.tsx
"use client";

import { useState } from "react";

export function Counter() {
  const [count, setCount] = useState(0);
  return (
    <button onClick={() => setCount(c => c + 1)}>
      Count: {count}
    </button>
  );
}
```

### Composition Pattern

Keep Client Components small. Pass Server Components as children:

```typescript
// ClientWrapper.tsx
"use client";
export function ClientWrapper({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  return <div onClick={() => setOpen(!open)}>{children}</div>;
}

// page.tsx (Server Component)
export default function Page() {
  return (
    <ClientWrapper>
      <ServerComponent />  {/* This stays on server */}
    </ClientWrapper>
  );
}
```

---

## tRPC Integration

### Server-Side (RSC)

```typescript
// In Server Components
import { api } from "~/trpc/server";

export default async function Page() {
  const posts = await api.post.getAll();
  return <PostList posts={posts} />;
}
```

### Client-Side (Client Components)

```typescript
// In Client Components
"use client";
import { api } from "~/trpc/react";

export function PostForm() {
  const utils = api.useUtils();

  const { data, isLoading } = api.post.getAll.useQuery();

  const createPost = api.post.create.useMutation({
    onSuccess: () => {
      utils.post.getAll.invalidate();
    },
  });

  if (isLoading) return <Loading />;
  return <form onSubmit={...}>...</form>;
}
```

---

## Styling with Tailwind

### Class Organization

Order classes logically:
1. Layout (flex, grid, position)
2. Sizing (w-, h-, p-, m-)
3. Typography (text-, font-)
4. Colors (bg-, text-, border-)
5. Effects (shadow, opacity)
6. States (hover:, focus:, dark:)

```tsx
<div className="flex items-center justify-between w-full p-4 text-sm text-gray-700 bg-white border rounded-lg hover:bg-gray-50">
```

### Responsive Design

Use mobile-first approach:

```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
```

### Dark Mode

Use `dark:` prefix (if implemented):

```tsx
<div className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
```

---

## State Management

### Component State

Use `useState` for local component state:

```typescript
const [isOpen, setIsOpen] = useState(false);
```

### Server State

Use tRPC (React Query) for server data - no Redux needed:

```typescript
const { data, isLoading, error } = api.user.getProfile.useQuery();
```

### Form State

Use controlled components or form libraries:

```typescript
const [formData, setFormData] = useState({ name: "", email: "" });

<input
  value={formData.name}
  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
/>
```

---

## Error Handling

### Error Boundaries

Create error.tsx for route segments:

```typescript
// src/app/error.tsx
"use client";

export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <div>
      <h2>Something went wrong!</h2>
      <button onClick={() => reset()}>Try again</button>
    </div>
  );
}
```

### Loading States

Create loading.tsx for Suspense:

```typescript
// src/app/loading.tsx
export default function Loading() {
  return <div>Loading...</div>;
}
```

### tRPC Errors

Handle in components:

```typescript
const { data, error, isError } = api.user.getProfile.useQuery();

if (isError) {
  return <ErrorMessage message={error.message} />;
}
```

---

## Accessibility

### WCAG 2.1 AA Compliance

1. **Semantic HTML**: Use proper elements (button, nav, main, etc.)
2. **Labels**: All form inputs must have labels
3. **Alt text**: All images must have alt attributes
4. **Focus**: Visible focus indicators
5. **Contrast**: 4.5:1 for normal text, 3:1 for large text

### Radix UI

Use Radix primitives for accessible components:

```typescript
import * as Dialog from "@radix-ui/react-dialog";

<Dialog.Root>
  <Dialog.Trigger>Open</Dialog.Trigger>
  <Dialog.Portal>
    <Dialog.Overlay />
    <Dialog.Content>
      <Dialog.Title>Dialog Title</Dialog.Title>
      <Dialog.Description>Description</Dialog.Description>
      <Dialog.Close>Close</Dialog.Close>
    </Dialog.Content>
  </Dialog.Portal>
</Dialog.Root>
```

---

## Performance

### Code Splitting

Use dynamic imports for heavy components:

```typescript
import dynamic from "next/dynamic";

const HeavyComponent = dynamic(() => import("./HeavyComponent"), {
  loading: () => <Loading />,
});
```

### Images

Use next/image for optimization:

```typescript
import Image from "next/image";

<Image
  src="/image.jpg"
  alt="Description"
  width={500}
  height={300}
  priority  // for above-fold images
/>
```

### Fonts

Use next/font:

```typescript
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

<body className={inter.className}>
```

---

## Testing

### Component Tests (Jest + RTL)

```typescript
import { render, screen } from "@testing-library/react";
import { UserCard } from "./user-card";

test("renders user name", () => {
  render(<UserCard name="John" />);
  expect(screen.getByText("John")).toBeInTheDocument();
});
```

### E2E Tests (Playwright)

```typescript
import { test, expect } from "@playwright/test";

test("user can navigate", async ({ page }) => {
  await page.goto("/");
  await page.click('[data-testid="nav-profile"]');
  await expect(page).toHaveURL(/profile/);
});
```

**For complete E2E testing guide**, see [PLAYWRIGHT_TESTING_GUIDE.md](PLAYWRIGHT_TESTING_GUIDE.md).

---

## File Organization

```
src/
├── app/                    # Next.js App Router
│   ├── (main)/            # Route group
│   │   ├── page.tsx       # Server Component
│   │   ├── loading.tsx    # Loading state
│   │   └── error.tsx      # Error boundary
│   └── layout.tsx         # Root layout
│
├── components/            # Shared components
│   ├── ui/               # Shadcn/ui primitives
│   └── [feature]/        # Feature-specific
│
└── lib/                   # Utilities
```

---

## Checklist

Before completing frontend work:

- [ ] Server Components used by default
- [ ] Client Components minimized
- [ ] tRPC patterns followed
- [ ] Loading states implemented
- [ ] Error states handled
- [ ] Accessibility verified
- [ ] TypeScript strict mode passes
- [ ] No console.logs in code

---

## Related Documentation

**Testing**:
- [PLAYWRIGHT_TESTING_GUIDE.md](PLAYWRIGHT_TESTING_GUIDE.md) - Complete E2E testing guide
- [VALIDATION_PATTERNS.md](VALIDATION_PATTERNS.md) - When to validate frontend changes

**Architecture & Patterns**:
- [architecture-context.md](../context/architecture-context.md) - System architecture overview
- [nfr-matrix.md](../context/nfr-matrix.md) - NFR-based routing triggers
- [anti-patterns.md](../context/anti-patterns.md) - Anti-patterns to avoid

**Agent Collaboration**:
- [agent-collaboration-graph.md](../context/agent-collaboration-graph.md) - When to route to other agents
