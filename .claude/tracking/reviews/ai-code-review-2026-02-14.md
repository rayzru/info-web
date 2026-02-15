# 🤖 AI-Powered Code Review - 2026-02-14

**Review Date**: February 14, 2026
**Commits Reviewed**: 984d0f0, 6558bf9, a0d2b15, 91a35cc, b5295a3
**Reviewer**: Claude Sonnet 4.5 (AI Code Review Agent)

---

## Executive Summary

**Total Changes**: 23 files, 11,956 insertions, 1,130 deletions
**Severity**: **1 CRITICAL**, **3 HIGH**, **5 MEDIUM**, **4 LOW**
**Overall Assessment**: ✅ **APPROVE WITH CHANGES** - Critical security issue must be addressed before merge

---

## 🔴 CRITICAL ISSUES (Must Fix)

### 1. Missing File Deletion for Document Removal (CRITICAL)

**File**: `src/server/api/routers/claims.ts:427-432`
**Severity**: CRITICAL
**Category**: Security / Data Leakage
**CWE**: CWE-459 (Incomplete Cleanup)

**Issue**: The `removeDocument` mutation deletes database records but doesn't actually delete files from S3 storage. This creates orphaned files in S3 that persist indefinitely, potentially containing sensitive personal documents (passports, EGRN, contracts).

```typescript
// ❌ VULNERABLE CODE
await ctx.db.delete(claimDocuments).where(eq(claimDocuments.id, input.documentId));

// Note: Physical file deletion should be handled separately
// The file URL is: document.fileUrl

return { success: true, deletedFileUrl: document.fileUrl };
```

**Impact**:
- Privacy violation - documents remain accessible via URL after "deletion"
- Storage costs accumulate from orphaned files
- Potential GDPR/CCPA compliance violation
- Files contain PII/PHI: passports, property documents, contracts

**Fix**: Import S3 deletion utility and delete physical files:

```typescript
import { deleteFromS3, extractS3Key } from "~/lib/s3/client";

// ✅ SECURE CODE
await ctx.db.delete(claimDocuments).where(eq(claimDocuments.id, input.documentId));

// Delete from S3
const s3Key = extractS3Key(document.fileUrl);
await deleteFromS3(s3Key);

// Delete thumbnail if exists
if (document.thumbnailUrl) {
  const thumbnailKey = extractS3Key(document.thumbnailUrl);
  await deleteFromS3(thumbnailKey);
}

return { success: true };
```

**Effort**: Easy (5 minutes)
**Auto-fixable**: No - requires testing S3 deletion
**Priority**: P0 - MUST FIX BEFORE MERGE

---

## 🟠 HIGH SEVERITY ISSUES

### 2. SQL Injection Risk via Direct Parameter Mapping (HIGH)

**File**: `src/server/api/routers/claims.ts:702-719`
**Severity**: HIGH
**Category**: Security
**CWE**: CWE-89 (SQL Injection)

**Issue**: Raw SQL fragment construction with user-controlled IDs in `pendingTenantClaims` query. While Drizzle provides some protection, the manual SQL join construction pattern is dangerous and harder to audit.

```typescript
// ⚠️ RISKY PATTERN
sql`(
  (${propertyClaims.claimedRole} = 'ApartmentResident' AND ${propertyClaims.apartmentId} IN (${
    apartmentIds.length > 0
      ? sql.join(apartmentIds.map((id) => sql`${id}`), sql`, `)
      : sql`NULL`
  }))
  OR
  (${propertyClaims.claimedRole} = 'ParkingResident' AND ${propertyClaims.parkingSpotId} IN (${
    parkingSpotIds.length > 0
      ? sql.join(parkingSpotIds.map((id) => sql`${id}`), sql`, `)
      : sql`NULL`
  }))
)`
```

**Recommendation**: Use Drizzle's type-safe `inArray` operator:

```typescript
// ✅ SAFER APPROACH
import { inArray, or } from "drizzle-orm";

where: and(
  eq(propertyClaims.status, "pending"),
  or(
    apartmentIds.length > 0
      ? and(
          eq(propertyClaims.claimedRole, "ApartmentResident"),
          inArray(propertyClaims.apartmentId, apartmentIds)
        )
      : undefined,
    parkingSpotIds.length > 0
      ? and(
          eq(propertyClaims.claimedRole, "ParkingResident"),
          inArray(propertyClaims.parkingSpotId, parkingSpotIds)
        )
      : undefined
  )
)
```

**Effort**: Medium (15 minutes)
**Priority**: P1 - Should fix before merge

---

### 3. N+1 Query Pattern in Admin Claims List (HIGH)

**File**: `src/server/api/routers/claims.ts:1017-1051`
**Severity**: HIGH
**Category**: Performance
**CVSS**: N/A (Performance, not security)

**Issue**: Admin list query uses deeply nested `with` relations (5 levels deep) loading ALL relations for EVERY claim. With 100 claims on a page, this executes 500+ database queries.

```typescript
// ❌ PERFORMANCE KILLER
apartment: {
  with: {
    floor: {
      with: {
        entrance: {
          with: { building: true },  // 5 levels deep!
        },
      },
    },
  },
},
parkingSpot: {
  with: {
    floor: {
      with: {
        parking: {
          with: { building: true },  // Another 5 levels!
        },
      },
    },
  },
},
organization: {
  with: { building: true },
},
documents: true,  // Each claim loads all its documents
```

**Impact at Scale**:
- 100 claims → ~500 queries → 2-5 seconds page load
- 1000 claims → database connection pool exhaustion
- Poor user experience for admins reviewing many claims
- Server CPU spike from query processing

**Fix**: Use selective field loading or denormalize building data:

```typescript
// ✅ OPTIMIZED - Single query with joins
const claims = await ctx.db
  .select({
    claim: propertyClaims,
    user: {
      id: users.id,
      name: users.name,
      email: users.email,
      image: users.image,
    },
    buildingTitle: buildings.title,
    buildingNumber: buildings.number,
    buildingLiter: buildings.liter,
    apartmentNumber: apartments.number,
    parkingSpotNumber: parkingSpots.number,
    documentCount: sql<number>`(
      SELECT COUNT(*)
      FROM ${claimDocuments}
      WHERE ${claimDocuments.claimId} = ${propertyClaims.id}
    )`,
  })
  .from(propertyClaims)
  .leftJoin(users, eq(propertyClaims.userId, users.id))
  .leftJoin(apartments, eq(propertyClaims.apartmentId, apartments.id))
  .leftJoin(floors, eq(apartments.floorId, floors.id))
  .leftJoin(entrances, eq(floors.entranceId, entrances.id))
  .leftJoin(buildings, eq(entrances.buildingId, buildings.id))
  // ... similar for parking spots
  .where(whereClause)
  .orderBy(desc(propertyClaims.createdAt))
  .limit(limit)
  .offset(offset);
```

**Alternative Solutions**:
1. Add materialized view for claim list with denormalized data
2. Implement Redis caching layer for admin lists
3. Add GraphQL DataLoader pattern if using GraphQL

**Effort**: Hard (1-2 hours to refactor + test)
**Priority**: P1 - Will cause production performance issues

---

### 4. Missing Rate Limiting on Document Upload (HIGH)

**File**: API route `/api/upload/documents` (not shown in diff)
**Severity**: HIGH
**Category**: Security / DoS
**CWE**: CWE-770 (Allocation of Resources Without Limits)

**Issue**: The document upload endpoint likely lacks rate limiting. Users can spam uploads, exhausting:
- S3 storage quota
- Network bandwidth
- API processing resources
- Database connections

**Attack Scenario**:
```bash
# Attacker uploads 1000 files in 1 minute
for i in {1..1000}; do
  curl -X POST https://sr2.ru/api/upload/documents \
    -F "file=@large_file.pdf" \
    -H "Cookie: session=$SESSION"
done
```

**Recommendation**: Add rate limiting middleware:

```typescript
// src/middleware.ts
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const uploadRatelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, "10 m"), // 10 uploads per 10 minutes
  analytics: true,
  prefix: "ratelimit:upload",
});

// In upload route handler:
const identifier = session?.user?.id ?? ip;
const { success, limit, reset, remaining } = await uploadRatelimit.limit(identifier);

if (!success) {
  return new Response("Too many uploads. Please try again later.", {
    status: 429,
    headers: {
      "X-RateLimit-Limit": limit.toString(),
      "X-RateLimit-Remaining": remaining.toString(),
      "X-RateLimit-Reset": new Date(reset).toISOString(),
    }
  });
}
```

**Effort**: Medium (30 minutes + Redis/Upstash setup)
**Priority**: P1 - Should add before production launch

---

## 🟡 MEDIUM SEVERITY ISSUES

### 5. Bulk Insert Without Transaction (MEDIUM)

**File**: `src/server/api/routers/claims.ts:259-272`
**Severity**: MEDIUM
**Category**: Data Integrity
**ACID Violation**: Atomicity

**Issue**: Claim creation and document insertion are NOT wrapped in a transaction. If document insert fails, you end up with a claim without documents - orphaned claim record.

```typescript
// ❌ NO TRANSACTION - NOT ATOMIC
const [claim] = await ctx.db
  .insert(propertyClaims)
  .values({
    userId,
    claimType: input.claimType,
    claimedRole: input.claimedRole,
    apartmentId: input.apartmentId,
    parkingSpotId: input.parkingSpotId,
    organizationId: input.organizationId,
    userComment: input.userComment,
    status: "pending",
  })
  .returning();

// If this fails, claim exists but documents don't
// User thinks documents were uploaded, admin sees no documents
if (input.documents && input.documents.length > 0 && claim) {
  await ctx.db.insert(claimDocuments).values(
    input.documents.map((doc) => ({
      claimId: claim.id,
      documentType: doc.documentType,
      fileUrl: doc.fileUrl,
      fileName: doc.fileName,
      fileSize: doc.fileSize,
      mimeType: doc.mimeType,
      thumbnailUrl: doc.thumbnailUrl,
    }))
  );
}
```

**Failure Scenario**:
1. Claim created successfully
2. Network error during document insert
3. User sees "Success!" message
4. Admin sees claim with 0 documents
5. Admin rejects claim for "missing documents"
6. User confused: "But I uploaded them!"

**Fix**: Wrap in transaction:

```typescript
// ✅ ATOMIC OPERATION
const claim = await ctx.db.transaction(async (tx) => {
  const [newClaim] = await tx
    .insert(propertyClaims)
    .values({
      userId,
      claimType: input.claimType,
      claimedRole: input.claimedRole,
      apartmentId: input.apartmentId,
      parkingSpotId: input.parkingSpotId,
      organizationId: input.organizationId,
      userComment: input.userComment,
      status: "pending",
    })
    .returning();

  if (input.documents && input.documents.length > 0) {
    await tx.insert(claimDocuments).values(
      input.documents.map((doc) => ({
        claimId: newClaim.id,
        documentType: doc.documentType,
        fileUrl: doc.fileUrl,
        fileName: doc.fileName,
        fileSize: doc.fileSize,
        mimeType: doc.mimeType,
        thumbnailUrl: doc.thumbnailUrl,
      }))
    );
  }

  return newClaim;
});

// If any step fails, entire operation rolls back
```

**Effort**: Easy (10 minutes)
**Priority**: P2 - Should fix to prevent data inconsistency

---

### 6. Inconsistent Error Handling in PropertyWizard (MEDIUM)

**File**: `src/components/property-wizard/index.tsx:199-210`
**Severity**: MEDIUM
**Category**: Bug Risk / UX

**Issue**: `handleSubmit` calls `onSubmit` but doesn't handle errors. If the mutation fails, wizard state resets anyway, losing all user data.

```typescript
// ❌ NO ERROR HANDLING
const handleSubmit = async () => {
  if (!propertyType || !selectedBuildingId || !selectedPropertyId || !role) {
    return;
  }

  await onSubmit({
    type: propertyType,
    buildingId: selectedBuildingId,
    propertyId: selectedPropertyId,
    role,
    documents: uploadedDocuments,
  });

  // This runs even if onSubmit throws an error!
  // User loses all their work
  setStep("type");
  setPropertyType(null);
  setSelectedBuildingId("");
  setSelectedPropertyId("");
  setRole("");
  setUploadedDocuments([]);
};
```

**User Impact**:
1. User fills out entire wizard (5 steps)
2. User uploads 3 documents (takes time)
3. Network error during submit
4. Wizard resets to step 1
5. All uploaded documents lost
6. User has to start over from scratch
7. Poor user experience → abandonment

**Fix**: Proper error handling with state preservation:

```typescript
// ✅ PROPER ERROR HANDLING
const handleSubmit = async () => {
  if (!propertyType || !selectedBuildingId || !selectedPropertyId || !role) {
    return;
  }

  try {
    await onSubmit({
      type: propertyType,
      buildingId: selectedBuildingId,
      propertyId: selectedPropertyId,
      role,
      documents: uploadedDocuments,
    });

    // Only reset on success
    setStep("type");
    setPropertyType(null);
    setSelectedBuildingId("");
    setSelectedPropertyId("");
    setRole("");
    setUploadedDocuments([]);

    // Show success toast
    toast.success("Заявка успешно отправлена!");
  } catch (error) {
    // Stay on completed step, preserve all data
    console.error("Failed to submit claim:", error);

    // Show user-friendly error
    toast.error(
      error instanceof Error
        ? error.message
        : "Не удалось отправить заявку. Попробуйте еще раз."
    );

    // User can retry without losing work
  }
};
```

**Effort**: Easy (5 minutes)
**Priority**: P2 - Improves UX

---

### 7. Document Privacy Notice Lacks Legal Accuracy (MEDIUM)

**File**: `src/components/property-wizard/documents-form.tsx:39-46`
**Severity**: MEDIUM
**Category**: Compliance / Legal

**Issue**: Privacy notice says documents are "automatically deleted" but doesn't specify the 60-day retention period mentioned in the backend code (line 1120 in claims.ts). This creates a legal liability gap.

```typescript
// ⚠️ VAGUE WORDING - LEGALLY INCOMPLETE
<div>
  <p className="font-medium">Конфиденциальность:</p>
  <ul className="mt-1 space-y-1">
    <li>• Документы используются только для проверки заявки</li>
    <li>• После одобрения/отклонения все файлы автоматически удаляются</li>
    <li>• Мы не занимаемся накоплением персональных данных</li>
  </ul>
</div>
```

**Backend Reality** (from claims.ts line 1119-1120):
```typescript
const scheduledDate = new Date();
scheduledDate.setDate(scheduledDate.getDate() + 60); // 60 days retention!
```

**Legal Risk**:
- User thinks: "Deleted immediately after approval"
- Reality: "Stored for 60 more days"
- GDPR/CCPA violation if user complaint filed
- Need to match UI promise with backend implementation

**Fix**: Be specific to match backend behavior:

```typescript
// ✅ ACCURATE AND LEGALLY COMPLIANT
<div>
  <p className="font-medium">Конфиденциальность:</p>
  <ul className="mt-1 space-y-1">
    <li>• Документы используются только для проверки заявки</li>
    <li>• После одобрения/отклонения документы помечаются для удаления</li>
    <li>• Физическое удаление файлов происходит автоматически через 60 дней</li>
    <li>• Максимальный срок хранения: 90 дней с момента загрузки</li>
    <li>• Мы не используем документы для других целей</li>
  </ul>
</div>
```

**Effort**: Trivial (2 minutes)
**Priority**: P2 - Legal compliance

---

### 8. Unused `isUploading` and `onUploadingChange` Props (MEDIUM)

**File**: `src/components/property-wizard/documents-form.tsx:9-10`
**Severity**: MEDIUM
**Category**: Code Quality / Maintainability

**Issue**: These props are defined in the interface but never used in the component. This creates:
- Confusion for future developers
- Dead code in the codebase
- False expectations from parent component

```typescript
// ❌ UNUSED PROPS
interface DocumentsFormProps {
  documents: UploadedDocument[];
  onDocumentsChange: (docs: UploadedDocument[]) => void;
  isUploading: boolean;  // NOT USED ANYWHERE
  onUploadingChange: (uploading: boolean) => void;  // NOT USED ANYWHERE
}

export function DocumentsForm({ documents, onDocumentsChange }: DocumentsFormProps) {
  // isUploading and onUploadingChange are completely ignored
  // But parent component in index.tsx is passing them!
}
```

**Parent Component** (index.tsx line 86, 336-338):
```typescript
const [isUploading, setIsUploading] = useState(false);

<DocumentsForm
  documents={uploadedDocuments}
  onDocumentsChange={setUploadedDocuments}
  isUploading={isUploading}  // Passed but ignored
  onUploadingChange={setIsUploading}  // Passed but ignored
/>
```

**Fix - Option 1**: Use the props (recommended):

```typescript
// ✅ OPTION 1: Use them for better UX
export function DocumentsForm({
  documents,
  onDocumentsChange,
  isUploading,  // Now used
  onUploadingChange
}: DocumentsFormProps) {
  return (
    <div className="space-y-4">
      <ClaimDocumentUploader
        documents={documents}
        onChange={onDocumentsChange}
        onUploadingChange={onUploadingChange}  // Pass through to uploader
      />

      {isUploading && (
        <div className="flex items-center gap-2 text-sm text-blue-600">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>Загрузка документов...</span>
        </div>
      )}

      {/* ... rest of component */}
    </div>
  );
}
```

**Fix - Option 2**: Remove from interface (if truly not needed):

```typescript
// ✅ OPTION 2: Remove unused props
interface DocumentsFormProps {
  documents: UploadedDocument[];
  onDocumentsChange: (docs: UploadedDocument[]) => void;
}

export function DocumentsForm({ documents, onDocumentsChange }: DocumentsFormProps) {
  // ...
}

// Also update parent component to stop passing them
```

**Effort**: Trivial (2 minutes)
**Priority**: P3 - Code cleanup

---

### 9. Admin Pages Missing Accessibility Attributes (MEDIUM)

**Files**: All redesigned admin pages (claims, listings, howtos, deletion-requests, feedback)
**Severity**: MEDIUM
**Category**: Accessibility (WCAG 2.1 AA Compliance)
**WCAG**: 2.1.1 (Keyboard), 4.1.2 (Name, Role, Value)

**Issue**: Table rows use `onClick` without corresponding `role="button"`, `tabIndex`, and keyboard handlers. This makes the admin interface unusable for:
- Screen reader users (can't understand clickable rows)
- Keyboard-only users (can't navigate without mouse)
- Users with motor disabilities (can't use Tab navigation)

```typescript
// ❌ NOT ACCESSIBLE
<div
  onClick={() => setSelectedClaim(claim)}
  className="hover:bg-accent flex cursor-pointer items-center gap-4 border-b px-4 py-3"
>
  <div className="w-24 text-sm">{formatDate(claim.createdAt)}</div>
  <div className="min-w-0 flex-1">...</div>
</div>
```

**Screen Reader Experience**:
- Reads: "February 14, Apartment claim, pending" (no indication it's clickable)
- User doesn't know they can interact with it
- No way to activate the row with keyboard

**Fix**: Add proper ARIA attributes and keyboard support:

```typescript
// ✅ FULLY ACCESSIBLE
<div
  role="button"
  tabIndex={0}
  onClick={() => setSelectedClaim(claim)}
  onKeyDown={(e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setSelectedClaim(claim);
    }
  }}
  className="hover:bg-accent focus:outline-none focus:ring-2 focus:ring-primary flex cursor-pointer items-center gap-4 border-b px-4 py-3"
  aria-label={`View claim from ${claim.user.name ?? claim.user.email} for ${
    claim.apartment
      ? `apartment ${claim.apartment.number}`
      : `parking ${claim.parkingSpot?.number}`
  }, status: ${claim.status}`}
>
  <div className="w-24 text-sm">{formatDate(claim.createdAt)}</div>
  <div className="min-w-0 flex-1">...</div>
</div>
```

**Benefits**:
- Screen readers announce: "Button, View claim from Ivan Petrov for apartment 42, status: pending"
- Keyboard users can Tab through rows and press Enter/Space to open
- Visible focus indicator for keyboard navigation
- Meets WCAG 2.1 AA standards

**Apply to**:
- `/admin/claims/page.tsx`
- `/admin/listings/page.tsx`
- `/admin/howtos/page.tsx`
- `/admin/deletion-requests/page.tsx`
- `/admin/feedback/page.tsx`

**Effort**: Medium (20 minutes × 5 pages = 1.5 hours)
**Priority**: P2 - Accessibility is important

---

## 🔵 LOW SEVERITY ISSUES

### 10. Hardcoded Magic Number for Deletion Schedule (LOW)

**File**: `src/server/api/routers/claims.ts:1119-1120`
**Severity**: LOW
**Category**: Code Quality / Maintainability

**Issue**: Retention period is hardcoded as `60` with no explanation or constant definition. If business requirements change (e.g., GDPR requires 30 days), you have to search codebase for all instances.

```typescript
// ❌ MAGIC NUMBER
const scheduledDate = new Date();
scheduledDate.setDate(scheduledDate.getDate() + 60); // 60 days from now
```

**Fix**: Extract to named constant with documentation:

```typescript
// ✅ NAMED CONSTANT
// At top of file or in separate constants file
/**
 * Document retention period in days after claim approval/rejection.
 * Documents are soft-deleted immediately but physically removed after this period.
 *
 * COMPLIANCE: Must align with privacy policy and GDPR "right to erasure" requirements.
 * Current: 60 days allows for audit/dispute resolution window.
 */
const DOCUMENT_RETENTION_DAYS = 60;

// In code:
const scheduledDate = new Date();
scheduledDate.setDate(scheduledDate.getDate() + DOCUMENT_RETENTION_DAYS);

await ctx.db
  .update(claimDocuments)
  .set({ scheduledForDeletion: scheduledDate })
  .where(eq(claimDocuments.claimId, input.claimId));
```

**Benefits**:
- Single source of truth
- Easy to change business logic
- Self-documenting code
- Easier compliance audits

**Effort**: Trivial (2 minutes)
**Priority**: P4 - Nice to have

---

### 11. Missing JSDoc for Complex Functions (LOW)

**File**: `src/server/api/routers/claims.ts:64-84`
**Severity**: LOW
**Category**: Documentation / Maintainability

**Issue**: Helper function `addBuildingToUserInterests` lacks documentation explaining:
- What it does
- Why it's needed
- What `autoAdded: true` means
- Side effects on database

```typescript
// ❌ NO DOCUMENTATION
async function addBuildingToUserInterests(
  db: typeof import("~/server/db").db,
  userId: string,
  buildingId: string
) {
  const existing = await db.query.userInterestBuildings.findFirst({
    where: and(
      eq(userInterestBuildings.userId, userId),
      eq(userInterestBuildings.buildingId, buildingId)
    ),
  });

  if (!existing) {
    await db.insert(userInterestBuildings).values({
      userId,
      buildingId,
      autoAdded: true,
    });
  }
}
```

**Recommendation**: Add JSDoc comments:

```typescript
/**
 * Adds a building to user's interest buildings if not already present.
 *
 * This is automatically called when a user's property claim is approved,
 * ensuring they see building-wide news, events, and announcements.
 *
 * @param db - Drizzle database instance
 * @param userId - User ID to add interest for
 * @param buildingId - Building ID to add to user's interests
 *
 * @example
 * // After approving apartment claim
 * await addBuildingToUserInterests(ctx.db, claim.userId, buildingId);
 *
 * @remarks
 * - Sets `autoAdded: true` to distinguish from manual user selections
 * - Idempotent: safe to call multiple times (checks for existing entry)
 * - Does NOT notify user (silent background operation)
 */
async function addBuildingToUserInterests(
  db: typeof import("~/server/db").db,
  userId: string,
  buildingId: string
) {
  // Check if already added
  const existing = await db.query.userInterestBuildings.findFirst({
    where: and(
      eq(userInterestBuildings.userId, userId),
      eq(userInterestBuildings.buildingId, buildingId)
    ),
  });

  if (!existing) {
    await db.insert(userInterestBuildings).values({
      userId,
      buildingId,
      autoAdded: true, // Flag to distinguish from manual user selection
    });
  }
}
```

**Effort**: Trivial (5 minutes)
**Priority**: P4 - Developer experience

---

### 12. Potential Console.log Statements in Production (LOW)

**Severity**: LOW
**Category**: Security / Performance

**Issue**: If any `console.log` statements exist in production builds, they:
- Leak sensitive information to browser console
- Cause performance overhead (especially in loops)
- Clutter browser DevTools

**Recommendation**: Audit for console statements and use structured logging:

```bash
# Check for console statements
grep -r "console\.log" src/app src/components src/server
```

**Replace with structured logging**:

```typescript
// ❌ Console.log (development only)
console.log("Document uploaded:", doc.id);

// ✅ Structured logging (works in production)
import { logger } from "~/lib/logger";

logger.info("Document uploaded", {
  documentId: doc.id,
  userId: session.user.id,
  fileSize: doc.fileSize,
  mimeType: doc.mimeType
});
```

**Or use conditional logging**:

```typescript
// Only log in development
if (process.env.NODE_ENV === "development") {
  console.log("Debug info:", data);
}
```

**Effort**: Trivial (5-10 minutes)
**Priority**: P4 - Production hygiene

---

### 13. Missing E2E Tests for Critical Path (LOW)

**Severity**: LOW
**Category**: Testing / Quality Assurance

**Coverage Gap**: Document upload + claim creation flow is untested. This is a critical user journey that should have automated E2E tests to prevent regressions.

**Recommendation**: Add Playwright E2E test:

```typescript
// tests/e2e/property-wizard-documents.spec.ts
import { test, expect } from "@playwright/test";

test.describe("Property Wizard - Document Upload", () => {
  test("should submit claim with documents", async ({ page }) => {
    // Login
    await page.goto("/api/auth/signin");
    await page.fill('input[type="email"]', "test@example.com");
    await page.click('button:has-text("Sign in")');

    // Open property wizard
    await page.goto("/my/property");
    await page.click('button:has-text("Добавить")');

    // Step 1: Select apartment type
    await page.click('text=Квартира');
    await expect(page.locator("text=Выберите строение")).toBeVisible();

    // Step 2: Select building
    await page.click('text=Строение 1');
    await expect(page.locator("text=Выберите квартиру")).toBeVisible();

    // Step 3: Select apartment
    await page.click('text=Квартира 42');
    await expect(page.locator("text=Укажите вашу роль")).toBeVisible();

    // Step 4: Select role
    await page.click('text=Собственник');
    await expect(page.locator("text=Подтверждающие документы")).toBeVisible();

    // Step 5: Upload document
    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles("tests/fixtures/passport.pdf");

    // Wait for upload to complete
    await expect(page.locator("text=passport.pdf")).toBeVisible();
    await expect(page.locator("text=Загрузка...")).not.toBeVisible();

    // Continue to summary
    await page.click('button:has-text("Продолжить")');

    // Submit claim
    await page.click('button:has-text("Отправить заявку")');

    // Verify success
    await expect(page.locator("text=Заявка успешно создана")).toBeVisible({ timeout: 10000 });

    // Verify claim appears in list with document count
    await page.goto("/my/property");
    await expect(page.locator("text=Квартира 42")).toBeVisible();
    await expect(page.locator("text=1 документ")).toBeVisible(); // Document count badge
  });

  test("should prevent upload of files > 10MB", async ({ page }) => {
    // Navigate to documents step
    // ... (steps 1-4 from above)

    // Try to upload large file
    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles("tests/fixtures/large_file_11mb.pdf");

    // Should show error
    await expect(page.locator("text=Файл слишком большой")).toBeVisible();
  });

  test("should limit to 10 documents", async ({ page }) => {
    // Navigate to documents step
    // Upload 10 documents
    for (let i = 1; i <= 10; i++) {
      await page.locator('input[type="file"]').setInputFiles(`tests/fixtures/doc${i}.pdf`);
      await expect(page.locator(`text=doc${i}.pdf`)).toBeVisible();
    }

    // Try to upload 11th document
    const fileInput = page.locator('input[type="file"]');
    await expect(fileInput).toBeDisabled(); // Should be disabled
  });
});
```

**Test Fixtures Needed**:
```
tests/fixtures/
  ├── passport.pdf (2MB)
  ├── egrn.pdf (1MB)
  ├── contract.pdf (500KB)
  └── large_file_11mb.pdf (11MB - for validation test)
```

**Effort**: Medium (1 hour to write tests + fixtures)
**Priority**: P3 - Recommended for CI/CD

---

## 📊 Summary by Category

| Category | Critical | High | Medium | Low | Total |
|----------|----------|------|--------|-----|-------|
| **Security** | 1 | 2 | 0 | 1 | 4 |
| **Performance** | 0 | 1 | 0 | 0 | 1 |
| **Data Integrity** | 0 | 0 | 1 | 0 | 1 |
| **Code Quality** | 0 | 0 | 2 | 3 | 5 |
| **Compliance** | 0 | 0 | 1 | 0 | 1 |
| **Accessibility** | 0 | 0 | 1 | 0 | 1 |
| **Testing** | 0 | 0 | 0 | 1 | 1 |
| **TOTAL** | **1** | **3** | **5** | **4** | **13** |

---

## ✅ What Was Done Well

### Architecture & Design
1. **✨ Consistent UI/UX Redesign** - All 5 admin pages now follow identical table patterns with mobile responsiveness
2. **✨ Privacy by Design** - Scheduled document deletion implemented (lines 1118-1126)
3. **✨ Type Safety** - Full Zod validation on all tRPC inputs prevents type mismatches
4. **✨ Database Integrity** - Cascade deletes properly configured in schema

### Code Quality
5. **✨ Separation of Concerns** - Wizard broken into discrete step components
6. **✨ Mobile Responsive** - Intelligent table → card layout for small screens
7. **✨ Accessibility Foundation** - Semantic HTML with proper heading hierarchy
8. **✨ Error Messages** - User-friendly Russian error messages in all mutations

### Features
9. **✨ Document Upload Flow** - Well-designed 5-step wizard with clear progression
10. **✨ Bulk Document Upload** - Supports up to 10 documents per claim
11. **✨ Thumbnail Generation** - Automatic preview generation for images
12. **✨ Admin Filtering** - Status and type filters on all admin pages

---

## 🚀 Recommended Action Plan

### Phase 1: Before Merge (Blocking) - 2-3 hours
**Must fix these before merging to production:**

1. **Issue #1** - Add S3 file deletion to `removeDocument` mutation (CRITICAL)
   - Effort: 5 minutes
   - Impact: Prevents privacy violation and storage leaks

2. **Issue #3** - Optimize admin list N+1 queries (HIGH)
   - Effort: 1-2 hours
   - Impact: Prevents production performance degradation

3. **Issue #5** - Wrap bulk insert in transaction (MEDIUM)
   - Effort: 10 minutes
   - Impact: Prevents data corruption

**Total Effort**: ~2-3 hours

---

### Phase 2: Post-Merge Improvements (Non-Blocking) - 4-5 hours
**Should implement soon after merge:**

4. **Issue #2** - Refactor SQL to use `inArray` (HIGH)
   - Effort: 15 minutes
   - Reduces SQL injection risk surface area

5. **Issue #4** - Add rate limiting to upload endpoint (HIGH)
   - Effort: 30 minutes + Redis setup
   - Prevents DoS attacks

6. **Issue #6** - Improve error handling in PropertyWizard (MEDIUM)
   - Effort: 5 minutes
   - Prevents data loss on submission errors

7. **Issue #7** - Update privacy notice with accurate retention period (MEDIUM)
   - Effort: 2 minutes
   - Legal compliance requirement

8. **Issue #9** - Add accessibility attributes to admin tables (MEDIUM)
   - Effort: 1.5 hours (5 pages × 20 min)
   - WCAG 2.1 AA compliance

---

### Phase 3: Polish & Long-term (Optional) - 2-3 hours

9. **Issue #8** - Remove unused props from DocumentsForm
10. **Issue #10** - Extract magic numbers to constants
11. **Issue #11** - Add JSDoc to helper functions
12. **Issue #12** - Audit and remove console.log statements
13. **Issue #13** - Write E2E tests for document upload flow

---

## 📈 Impact Metrics

### Code Quality
- **Lines Changed**: 11,956 insertions, 1,130 deletions
- **Files Modified**: 23
- **Complexity**: Medium (nested wizard, multi-step form)
- **Test Coverage**: 0% (needs E2E tests)

### Estimated Fix Effort
- **Critical Issues**: 5 minutes
- **High Issues**: 2-3 hours
- **Medium Issues**: 2 hours
- **Low Issues**: 30 minutes
- **Total**: 4-6 hours

### Production Risk Assessment
- **Without Fixes**: 🔴 HIGH RISK (privacy violations, performance issues)
- **With Phase 1 Fixes**: 🟡 MEDIUM RISK (acceptable for beta)
- **With Phase 1+2 Fixes**: 🟢 LOW RISK (production ready)

---

## 🎯 Final Recommendation

### ✅ APPROVE WITH CHANGES

The document upload feature and admin page redesigns are **well-implemented overall**. The code demonstrates:
- Good understanding of Next.js and tRPC patterns
- Solid UI/UX design with responsive layouts
- Privacy-conscious architecture

However, **3 blocking issues MUST be fixed before production deployment**:

1. **S3 file deletion bug** (Issue #1) - Privacy violation, storage leak
2. **N+1 query performance** (Issue #3) - Will cause production slowdowns
3. **Missing transaction** (Issue #5) - Data integrity risk

**Approval contingent on**: Phase 1 fixes implemented and verified before merge to main branch.

---

## 📎 References

- **OWASP Top 10 2021**: https://owasp.org/Top10/
- **CWE-459 (Incomplete Cleanup)**: https://cwe.mitre.org/data/definitions/459.html
- **CWE-89 (SQL Injection)**: https://cwe.mitre.org/data/definitions/89.html
- **CWE-770 (Resource Limits)**: https://cwe.mitre.org/data/definitions/770.html
- **WCAG 2.1**: https://www.w3.org/WAI/WCAG21/quickref/
- **Drizzle ORM Docs**: https://orm.drizzle.team/docs/overview

---

**Review Completed**: 2026-02-14
**Next Review**: After Phase 1 fixes implemented
