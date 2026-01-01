# Code Review: [Feature Name]

## Summary

- **Status**: Approved | Changes Required
- **Reviewed**: [Date]
- **Files Reviewed**: [N]
- **Critical Issues**: [N]
- **Important Issues**: [N]
- **Suggestions**: [N]

---

## Review Scope

- **Spec**: `/specs/[feature-name]_spec.md`
- **Implementation**: `/specs/[feature-name]_implementation.md`
- **Branch**: [branch name]

---

## Critical Issues (Must Fix)

### Issue 1: [Title]

- **File**: `src/path/to/file.ts:42`
- **Issue**: [Clear description of the problem]
- **Impact**: [Why this is critical]
- **Fix**: [Suggested approach]

```typescript
// Current (problematic)
const data = input as any;

// Suggested
const data = mySchema.parse(input);
```

---

## Important Issues (Should Fix)

### Issue 1: [Title]

- **File**: `src/path/to/file.ts:100`
- **Issue**: [Description]
- **Suggestion**: [Approach]

---

## Suggestions (Nice to Have)

- [ ] [Suggestion 1]
- [ ] [Suggestion 2]
- [ ] [Suggestion 3]

---

## Guidelines Compliance

| Guideline | Status | Notes |
|-----------|--------|-------|
| TypeScript strict | ✅/❌ | [Details] |
| tRPC patterns | ✅/❌ | [Details] |
| Component patterns | ✅/❌ | [Details] |
| Security | ✅/❌ | [Details] |
| Performance | ✅/❌ | [Details] |

---

## Checklist

### Code Quality
- [ ] TypeScript strict mode compliance
- [ ] No `any` types
- [ ] Proper error handling
- [ ] Loading states implemented
- [ ] No console.logs

### T3 Stack Patterns
- [ ] tRPC procedures use Zod validation
- [ ] Protected procedures for auth routes
- [ ] Drizzle queries type-safe
- [ ] Server Components used appropriately

### Security
- [ ] Input validation with Zod
- [ ] No secrets in code
- [ ] Authorization checks in place

### Performance
- [ ] No N+1 queries
- [ ] Proper pagination
- [ ] Bundle impact acceptable

---

## Approval

- [ ] All critical issues resolved
- [ ] All important issues addressed or justified
- [ ] Code ready for merge

**Reviewer**: [Name/Agent]
**Date**: [Date]
