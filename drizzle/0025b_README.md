# Migration 0025b: Add 4k Apartment Type

## Summary

This migration adds the `4k` (четырёхкомнатная, 4-room) apartment type to the `apartment_type` PostgreSQL enum.

## Why This Migration?

Building 5, floor 20 has three 4-room apartments (кв. 218, 221, 222). The existing enum only supported:
- `studio` - студия
- `1k` - однокомнатная (1-room)
- `2k` - двухкомнатная (2-room)
- `3k` - трёхкомнатная (3-room)

The `4k` type is now added to support 4-room apartments.

## What Changed

### Database Schema
```sql
ALTER TYPE apartment_type ADD VALUE IF NOT EXISTS '4k';
```

### TypeScript Schema
File: `src/server/db/schemas/buildings.ts`

```typescript
// Before:
export const apartmentTypeEnum = pgEnum("apartment_type", ["studio", "1k", "2k", "3k"]);

// After:
export const apartmentTypeEnum = pgEnum("apartment_type", ["studio", "1k", "2k", "3k", "4k"]);
```

## Applying the Migration

### Option 1: Manual Application (Recommended)

```bash
# Connect to database
psql <DATABASE_URL>

# Run migration
\i drizzle/0025b_add_4k_apartment_type.sql

# Verify
SELECT enumlabel FROM pg_enum
WHERE enumtypid = 'apartment_type'::regtype
ORDER BY enumsortorder;
```

Expected output:
```
 enumlabel
-----------
 studio
 1k
 2k
 3k
 4k
```

### Option 2: Using Drizzle Kit

**Important:** This migration cannot be run inside a transaction because PostgreSQL doesn't support adding enum values in transactions.

```bash
# Apply directly (outside transaction)
psql <DATABASE_URL> -f drizzle/0025b_add_4k_apartment_type.sql
```

## Important Notes

1. **Cannot be rolled back** - PostgreSQL doesn't support removing enum values
2. **Must run before 0026** - Building 5 apartments migration requires this type
3. **Thread-safe** - Uses `IF NOT EXISTS` to prevent errors if already applied
4. **No downtime** - Adding enum values is safe for existing data

## Dependencies

- **Required by**: Migration 0026 (Building 5 apartments)
- **Requires**: PostgreSQL with apartment_type enum already defined

## Verification

After applying, verify the new type works:

```sql
-- Create test apartment with 4k type
BEGIN;

-- This should work without errors
INSERT INTO apartment (id, floor_id, number, type)
VALUES (
  gen_random_uuid(),
  (SELECT id FROM floor LIMIT 1),  -- Any floor ID
  'TEST-4K',
  '4k'::apartment_type
);

-- Clean up
ROLLBACK;
```

## Related Files

- SQL Migration: [0025b_add_4k_apartment_type.sql](./0025b_add_4k_apartment_type.sql)
- TypeScript Schema: [src/server/db/schemas/buildings.ts](../src/server/db/schemas/buildings.ts)
- Uses this type: [0026_add_building5_apartments.sql](./0026_add_building5_apartments.sql)
