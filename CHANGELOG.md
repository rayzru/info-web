# sr2-t3

## 0.2.0

### Minor Changes

- # Database Migrations: Buildings 4 & 5

  ## New Features

  ### Building Apartment Data
  - Added apartment data for Building 4 (253 apartments)
    - Single entrance with 24 floors
    - Apartments starting from floor 2
    - Layout identical to Building 2, entrance 1
  - Added apartment data for Building 5 (728 apartments)
    - 3 entrances with varying floor counts
    - Entrance 1: 222 apartments (floors 1-18, 20)
    - Entrance 2: 253 apartments (floors 2-24)
    - Entrance 3: 253 apartments (floors 2-24)
    - Special floor 20 layout with 6 apartments

  ### New Apartment Type
  - Added `4k` (4-room) apartment type to database schema
    - Required for Building 5, floor 20 (apartments 218, 221, 222)
    - Updated TypeScript schema and PostgreSQL enum

  ### Database
  - Migration 0025b: Add `4k` apartment type enum value
  - Migration 0026: Add Building 5 apartments (728 total)
  - Migration 0027: Add Building 4 apartments (253 total)

  ### Documentation
  - Comprehensive migration guides with verification queries
  - Detailed floor plan analysis
  - Rollback instructions for all migrations

  ## Database Statistics

  Total apartments across all 7 buildings: **3,085**

  By apartment type:
  - Studio: 358 apartments
  - 1k (1-room): 1,663 apartments
  - 2k (2-room): 733 apartments
  - 3k (3-room): 328 apartments
  - 4k (4-room): 3 apartments ⚡ NEW

  ## Files Added

  ### Migrations
  - `drizzle/0025b_add_4k_apartment_type.sql`
  - `drizzle/0026_add_building5_apartments.sql`
  - `drizzle/0027_add_building4_apartments.sql`

  ### Documentation
  - `drizzle/0025b_README.md`
  - `drizzle/0026_README.md`
  - `drizzle/0027_README.md`
  - `drizzle/building5-apartments-analysis.md`
  - `BUILDING4_MIGRATION_SUMMARY.md`
  - `BUILDING5_MIGRATION_SUMMARY.md`
  - `MIGRATIONS_COMPLETE_SUMMARY.md`

  ### Schema Updates
  - Updated `src/server/db/schemas/buildings.ts` with `4k` apartment type
