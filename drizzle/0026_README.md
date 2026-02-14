# Migration 0026: Add Building 5 Apartments

## Summary

This migration adds apartment data for Building 5 (Строение 5, ул. Ларина, 45) based on the PDF document "45-5 стояки поквартирно (2).pdf".

## Data Added

- **Total apartments**: 728
- **Entrance 1**: 222 apartments (1-222)
  - Floors 1-18: 12 apartments each (apartments 1-216)
  - Floor 20: 6 apartments (217-222) - special layout
- **Entrance 2**: 253 apartments (223-475)
  - Floor 1: technical (no apartments)
  - Floors 2-24: 11 apartments each
- **Entrance 3**: 253 apartments (476-728)
  - Floor 1: technical (no apartments)
  - Floors 2-24: 11 apartments each

## Important Notes

### Apartment Types

**✅ ALL apartment types confirmed from building floor plans!**

#### Entrance 1 (12 apartments per floor, floors 1-18)
Repeating pattern:
1. `1k`, 2. `2k`, 3. `1k`, 4. `1k`, 5. `1k`, 6. `studio`, 7. `1k`, 8. `3k`, 9. `studio`, 10. `1k`, 11. `1k`, 12. `2k`

#### Entrance 1, Floor 20 (6 apartments, special layout)
- Apartment 217: `3k` (трёхкомнатная)
- Apartment 218: `4k` (четырёхкомнатная) ⚡
- Apartment 219: `3k` (трёхкомнатная)
- Apartment 220: `1k` (однокомнатная)
- Apartment 221: `4k` (четырёхкомнатная) ⚡
- Apartment 222: `4k` (четырёхкомнатная) ⚡

#### Entrance 2 (11 apartments per floor, floors 2-24)
Repeating pattern:
1. `1k`, 2. `1k`, 3. `1k`, 4. `1k`, 5. `studio`, 6. `1k`, 7. `1k`, 8. `3k`, 9. `studio`, 10. `1k`, 11. `2k`

#### Entrance 3 (11 apartments per floor, floors 2-24)
Repeating pattern:
1. `1k`, 2. `studio`, 3. `1k`, 4. `1k`, 5. `1k`, 6. `1k`, 7. `2k`, 8. `2k`, 9. `studio`, 10. `3k`, 11. `3k`

Available apartment types:
- `studio` - студия
- `1k` - однокомнатная
- `2k` - двухкомнатная
- `3k` - трёхкомнатная
- `4k` - четырёхкомнатная ⚡ **NEW!** Added in migration 0025b (required for floor 20)

### Prerequisites

Before running this migration, ensure:
1. **Run migration 0025b first** to add `4k` apartment type to the enum
2. Building 5 exists in the `building` table (number = 5)
3. Building 5 has 3 entrances
4. Floors are created for each entrance:
   - Entrance 1: 20 floors
   - Entrance 2: 24 floors
   - Entrance 3: 24 floors
5. **No apartments exist for Building 5** (this migration assumes empty state)

### Verification

After applying the migration, verify with this SQL:

```sql
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
WHERE b.number = 5
GROUP BY b.number, e.entrance_number
ORDER BY e.entrance_number;
```

Expected results:
```
building | entrance | apartment_count | min_apt | max_apt
---------|----------|-----------------|---------|--------
5        | 1        | 222             | 1       | 222
5        | 2        | 253             | 223     | 475
5        | 3        | 253             | 476     | 728
```

## Applying the Migration

### Option 1: Manual Application (Recommended for Beta/Prod)

```bash
# 1. Connect to database
psql <DATABASE_URL>

# 2. Start transaction
BEGIN;

# 3. Apply migration
\i drizzle/0026_add_building5_apartments.sql

# 4. Verify results
SELECT
    b.number, e.entrance_number,
    COUNT(a.id) AS apt_count,
    MIN(a.number::int) AS min_apt,
    MAX(a.number::int) AS max_apt
FROM building b
JOIN entrance e ON e.building_id = b.id
LEFT JOIN floor f ON f.entrance_id = e.id
LEFT JOIN apartment a ON a.floor_id = f.id
WHERE b.number = 5
GROUP BY b.number, e.entrance_number
ORDER BY e.entrance_number;

# 5. If results match expectations:
COMMIT;

# Or rollback if something is wrong:
# ROLLBACK;
```

### Option 2: Using Drizzle Kit

1. Add this migration to `drizzle/meta/_journal.json`:

```json
{
  "idx": 26,
  "version": "7",
  "when": <CURRENT_TIMESTAMP_MS>,
  "tag": "0026_add_building5_apartments",
  "breakpoints": true
}
```

2. Run migration:
```bash
bun run db:migrate
```

### Option 3: Test Script (Local Only)

```bash
# Test migration without committing changes
bun run scripts/test-building5-migration-simple.ts
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
  WHERE b.number = 5
);

-- Verify deletion
SELECT COUNT(*) FROM apartment a
JOIN floor f ON a.floor_id = f.id
JOIN entrance e ON f.entrance_id = e.id
JOIN building b ON e.building_id = b.id
WHERE b.number = 5;
-- Should return 0

COMMIT;
```

## Next Steps

1. ✅ ~~Obtain building floor plans~~ - DONE! All types confirmed
2. ✅ ~~Update apartment types~~ - DONE! All 728 apartments have correct types
3. **Optional: Add layout codes**:
   - Set `layout_code` field for each apartment type variant
   - Example: '2k-01', '2k-02', '1k-01', etc.
4. **Apply migration** to dev/beta/prod environments

## Files

- [0026_add_building5_apartments.sql](./0026_add_building5_apartments.sql) - Main migration file
- [building5-apartments-analysis.md](./building5-apartments-analysis.md) - Detailed analysis of PDF data
- [../scripts/test-building5-migration-simple.ts](../scripts/test-building5-migration-simple.ts) - Test script

## Related Documents

- Source: `45-5 стояки поквартирно (2).pdf`
- Analysis: `drizzle/building5-apartments-analysis.md`
