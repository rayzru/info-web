# Migration 0027: Add Building 4 Apartments

## Summary

This migration adds apartment data for Building 4 (Строение 4, Литер 1) using the same layout pattern as Building 2 entrance 1.

## Data Added

- **Total apartments**: 253
- **Entrance**: 1 (single entrance)
- **Floors**: 2-24 (23 floors)
- **Apartments per floor**: 11
- **Apartment numbering**: 1-253 (starting from floor 2)

## Apartment Pattern

Building 4 uses the **exact same layout as Building 2 entrance 1**:

### Floor Layout (11 apartments per floor, repeating pattern)
1. `2k` (двухкомнатная)
2. `2k` (двухкомнатная)
3. `1k` (однокомнатная)
4. `1k` (однокомнатная)
5. `2k` (двухкомнатная)
6. `1k` (однокомнатная)
7. `2k` (двухкомнатная)
8. `1k` (однокомнатная)
9. `1k` (однокомнатная)
10. `1k` (однокомнатная)
11. `3k` (трёхкомнатная)

### Floor Distribution

| Floors | Apartments per Floor | Apartment Range | Total |
|--------|---------------------|-----------------|-------|
| 2-24   | 11                  | 1-253          | 253   |

**Note**: Floor 1 is technical (no apartments)

### Apartment Distribution by Type

Based on the repeating pattern (11 apartments per floor × 23 floors):
- `1k` (однокомнатная): 6 per floor × 23 = **138 apartments**
- `2k` (двухкомнатная): 4 per floor × 23 = **92 apartments**
- `3k` (трёхкомнатная): 1 per floor × 23 = **23 apartments**
- **Total**: 253 apartments ✅

## Prerequisites

Before running this migration, ensure:
1. Building 4 exists in the `building` table (number = 4)
2. Building 4 has 1 entrance
3. Floors 1-24 are created for Building 4 entrance 1
4. **No apartments exist for Building 4** (this migration assumes empty state)

## Verification

After applying the migration, verify with this SQL:

```sql
-- Check total apartments for Building 4
SELECT
    b.number AS building,
    e.entrance_number AS entrance,
    COUNT(a.id) AS apartment_count,
    MIN(a.number::int) AS min_apt,
    MAX(a.number::int) AS max_apt
FROM building b
JOIN entrance e ON e.building_id = b.id
LEFT JOIN floor f ON f.entrance_id = e.id
LEFT JOIN apartment a ON a.floor_id = f.id
WHERE b.number = 4
GROUP BY b.number, e.entrance_number
ORDER BY e.entrance_number;
```

Expected result:
```
building | entrance | apartment_count | min_apt | max_apt
---------|----------|-----------------|---------|--------
4        | 1        | 253             | 1       | 253
```

### Verify apartment types distribution

```sql
SELECT
    a.type,
    COUNT(*) AS count
FROM apartment a
JOIN floor f ON a.floor_id = f.id
JOIN entrance e ON f.entrance_id = e.id
JOIN building b ON e.building_id = b.id
WHERE b.number = 4
GROUP BY a.type
ORDER BY a.type;
```

Expected result:
```
type   | count
-------|------
1k     | 138
2k     | 92
3k     | 23
```

### Verify specific floors

```sql
-- Check floor 2 (should have apartments 1-11)
SELECT
    f.floor_number,
    a.number,
    a.type
FROM apartment a
JOIN floor f ON a.floor_id = f.id
JOIN entrance e ON f.entrance_id = e.id
JOIN building b ON e.building_id = b.id
WHERE b.number = 4 AND f.floor_number = 2
ORDER BY a.number::int;
```

Expected: 11 apartments with pattern 2k, 2k, 1k, 1k, 2k, 1k, 2k, 1k, 1k, 1k, 3k

```sql
-- Check floor 24 (should have apartments 243-253)
SELECT
    f.floor_number,
    a.number,
    a.type
FROM apartment a
JOIN floor f ON a.floor_id = f.id
JOIN entrance e ON f.entrance_id = e.id
JOIN building b ON e.building_id = b.id
WHERE b.number = 4 AND f.floor_number = 24
ORDER BY a.number::int;
```

Expected: 11 apartments numbered 243-253 with same pattern

## Applying the Migration

### Option 1: Manual Application (Recommended for Beta/Prod)

```bash
# 1. Connect to database
psql $DATABASE_URL

# 2. Start transaction
BEGIN;

# 3. Apply migration
\i drizzle/0027_add_building4_apartments.sql

# 4. Verify results (run queries from Verification section above)

# 5. If results match expectations:
COMMIT;

# Or rollback if something is wrong:
# ROLLBACK;
```

### Option 2: Using Drizzle Kit

1. Add this migration to `drizzle/meta/_journal.json`:

```json
{
  "idx": 27,
  "version": "7",
  "when": <CURRENT_TIMESTAMP_MS>,
  "tag": "0027_add_building4_apartments",
  "breakpoints": true
}
```

2. Run migration:
```bash
bun run db:migrate
```

## Rollback

If you need to remove the apartments added by this migration:

```sql
BEGIN;

DELETE FROM apartment
WHERE floor_id IN (
  SELECT f.id
  FROM floor f
  JOIN entrance e ON f.entrance_id = e.id
  JOIN building b ON e.building_id = b.id
  WHERE b.number = 4
);

-- Verify deletion (should return 0)
SELECT COUNT(*) FROM apartment a
JOIN floor f ON a.floor_id = f.id
JOIN entrance e ON f.entrance_id = e.id
JOIN building b ON e.building_id = b.id
WHERE b.number = 4;

COMMIT;
```

## Source Information

- **Layout source**: Building 2 entrance 1 pattern
- **Apartments**: 253 total
- **Pattern**: 2k, 2k, 1k, 1k, 2k, 1k, 2k, 1k, 1k, 1k, 3k (11 per floor)
- **Floors**: 2-24 (floor 1 is technical)

## Related Files

- [0027_add_building4_apartments.sql](./0027_add_building4_apartments.sql) - Main migration file
- [0001_seed-data.sql](./0001_seed-data.sql) - Original seed with Building 2 pattern

## Notes

- Building 4 is the last building requiring apartment data
- After this migration, all 7 buildings will have complete apartment listings
- No new apartment types needed (uses existing: 1k, 2k, 3k)
