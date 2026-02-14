-- Migration: Add apartments for Building 5 (Строение 5)
-- Based on PDF: "45-5 стояки поквартирно (2).pdf"
-- Apartment types confirmed from building floor plans
-- Date: 2026-02-14
--
-- Building 5 Structure:
-- - Entrance 1: 20 floors, 222 apartments (1-222)
--   - Floors 1-18: 12 apartments each (типовая планировка)
--   - Floor 20: 6 apartments (special layout with 1k, 3k, 4k types)
-- - Entrance 2: 24 floors, 253 apartments (223-475)
--   - Floor 1: technical (no apartments)
--   - Floors 2-24: 11 apartments each (типовая планировка)
-- - Entrance 3: 24 floors, 253 apartments (476-728)
--   - Floor 1: technical (no apartments)
--   - Floors 2-24: 11 apartments each (типовая планировка)
-- Total: 728 apartments
--
-- ✅ All apartment types confirmed from floor plans!
-- PREREQUISITE: Run 0025b_add_4k_apartment_type.sql first to add '4k' type

-- ============================================================
-- Entrance 1: Floors 1-18 (12 apartments each, apartments 1-216)
-- Layout pattern (repeats every 12 apartments):
--   1: 1k, 2: 2k, 3: 1k, 4: 1k, 5: 1k, 6: studio,
--   7: 1k, 8: 3k, 9: studio, 10: 1k, 11: 1k, 12: 2k
-- ============================================================

WITH numbered_floors AS (
    SELECT
        "floor"."id" AS floor_id,
        "floor"."floor_number"
    FROM "floor"
    JOIN "entrance" ON "floor"."entrance_id" = "entrance"."id"
    JOIN "building" ON "entrance"."building_id" = "building"."id"
    WHERE "building"."number" = 5
    AND "entrance"."entrance_number" = 1
    AND "floor"."floor_number" BETWEEN 1 AND 18
),
apartments AS (
    SELECT
        floor_id,
        floor_number,
        generate_series(1, 12) AS apartment_offset
    FROM numbered_floors
)
INSERT INTO "apartment" ("id", "floor_id", "number", "type")
SELECT
    gen_random_uuid(),
    floor_id,
    ((floor_number - 1) * 12 + apartment_offset)::text,
    CASE apartment_offset
        WHEN 1 THEN '1k'::apartment_type
        WHEN 2 THEN '2k'::apartment_type
        WHEN 3 THEN '1k'::apartment_type
        WHEN 4 THEN '1k'::apartment_type
        WHEN 5 THEN '1k'::apartment_type
        WHEN 6 THEN 'studio'::apartment_type
        WHEN 7 THEN '1k'::apartment_type
        WHEN 8 THEN '3k'::apartment_type
        WHEN 9 THEN 'studio'::apartment_type
        WHEN 10 THEN '1k'::apartment_type
        WHEN 11 THEN '1k'::apartment_type
        WHEN 12 THEN '2k'::apartment_type
    END AS apartment_type
FROM apartments;

-- ============================================================
-- Entrance 1: Floor 20 (6 apartments, apartments 217-222)
-- Special layout with reduced apartment count
-- Layout (confirmed from building plans):
--   - 217: 3k (трёхкомнатная)
--   - 218: 4k (четырёхкомнатная)
--   - 219: 3k (трёхкомнатная)
--   - 220: 1k (однокомнатная)
--   - 221: 4k (четырёхкомнатная)
--   - 222: 4k (четырёхкомнатная)
-- PREREQUISITE: Run 0025b_add_4k_apartment_type.sql first to add '4k' type
-- ============================================================

WITH numbered_floors AS (
    SELECT
        "floor"."id" AS floor_id,
        "floor"."floor_number"
    FROM "floor"
    JOIN "entrance" ON "floor"."entrance_id" = "entrance"."id"
    JOIN "building" ON "entrance"."building_id" = "building"."id"
    WHERE "building"."number" = 5
    AND "entrance"."entrance_number" = 1
    AND "floor"."floor_number" = 20
),
apartments AS (
    SELECT
        floor_id,
        floor_number,
        generate_series(1, 6) AS apartment_offset
    FROM numbered_floors
)
INSERT INTO "apartment" ("id", "floor_id", "number", "type")
SELECT
    gen_random_uuid(),
    floor_id,
    (216 + apartment_offset)::text,  -- 217-222
    CASE apartment_offset
        WHEN 1 THEN '3k'::apartment_type  -- 217: 3-комнатная
        WHEN 2 THEN '4k'::apartment_type  -- 218: 4-комнатная
        WHEN 3 THEN '3k'::apartment_type  -- 219: 3-комнатная
        WHEN 4 THEN '1k'::apartment_type  -- 220: 1-комнатная
        WHEN 5 THEN '4k'::apartment_type  -- 221: 4-комнатная
        WHEN 6 THEN '4k'::apartment_type  -- 222: 4-комнатная
    END AS apartment_type
FROM apartments;

-- ============================================================
-- Entrance 2: Floors 2-24 (11 apartments each, apartments 223-475)
-- Floor 1 is technical (no apartments)
-- Layout pattern (repeats every 11 apartments):
--   1: 1k, 2: 1k, 3: 1k, 4: 1k, 5: studio, 6: 1k,
--   7: 1k, 8: 3k, 9: studio, 10: 1k, 11: 2k
-- ============================================================

WITH numbered_floors AS (
    SELECT
        "floor"."id" AS floor_id,
        "floor"."floor_number"
    FROM "floor"
    JOIN "entrance" ON "floor"."entrance_id" = "entrance"."id"
    JOIN "building" ON "entrance"."building_id" = "building"."id"
    WHERE "building"."number" = 5
    AND "entrance"."entrance_number" = 2
    AND "floor"."floor_number" BETWEEN 2 AND 24
),
apartments AS (
    SELECT
        floor_id,
        floor_number,
        generate_series(1, 11) AS apartment_offset
    FROM numbered_floors
)
INSERT INTO "apartment" ("id", "floor_id", "number", "type")
SELECT
    gen_random_uuid(),
    floor_id,
    (222 + (floor_number - 2) * 11 + apartment_offset)::text,  -- 223-475
    CASE apartment_offset
        WHEN 1 THEN '1k'::apartment_type
        WHEN 2 THEN '1k'::apartment_type
        WHEN 3 THEN '1k'::apartment_type
        WHEN 4 THEN '1k'::apartment_type
        WHEN 5 THEN 'studio'::apartment_type
        WHEN 6 THEN '1k'::apartment_type
        WHEN 7 THEN '1k'::apartment_type
        WHEN 8 THEN '3k'::apartment_type
        WHEN 9 THEN 'studio'::apartment_type
        WHEN 10 THEN '1k'::apartment_type
        WHEN 11 THEN '2k'::apartment_type
    END AS apartment_type
FROM apartments;

-- ============================================================
-- Entrance 3: Floors 2-24 (11 apartments each, apartments 476-728)
-- Floor 1 is technical (no apartments)
-- Layout pattern (repeats every 11 apartments):
--   1: 1k, 2: studio, 3: 1k, 4: 1k, 5: 1k, 6: 1k,
--   7: 2k, 8: 2k, 9: studio, 10: 3k, 11: 3k
-- ============================================================

WITH numbered_floors AS (
    SELECT
        "floor"."id" AS floor_id,
        "floor"."floor_number"
    FROM "floor"
    JOIN "entrance" ON "floor"."entrance_id" = "entrance"."id"
    JOIN "building" ON "entrance"."building_id" = "building"."id"
    WHERE "building"."number" = 5
    AND "entrance"."entrance_number" = 3
    AND "floor"."floor_number" BETWEEN 2 AND 24
),
apartments AS (
    SELECT
        floor_id,
        floor_number,
        generate_series(1, 11) AS apartment_offset
    FROM numbered_floors
)
INSERT INTO "apartment" ("id", "floor_id", "number", "type")
SELECT
    gen_random_uuid(),
    floor_id,
    (475 + (floor_number - 2) * 11 + apartment_offset)::text,  -- 476-728
    CASE apartment_offset
        WHEN 1 THEN '1k'::apartment_type
        WHEN 2 THEN 'studio'::apartment_type
        WHEN 3 THEN '1k'::apartment_type
        WHEN 4 THEN '1k'::apartment_type
        WHEN 5 THEN '1k'::apartment_type
        WHEN 6 THEN '1k'::apartment_type
        WHEN 7 THEN '2k'::apartment_type
        WHEN 8 THEN '2k'::apartment_type
        WHEN 9 THEN 'studio'::apartment_type
        WHEN 10 THEN '3k'::apartment_type
        WHEN 11 THEN '3k'::apartment_type
    END AS apartment_type
FROM apartments;

-- ============================================================
-- Verification Query (optional - for manual testing)
-- ============================================================
-- SELECT
--     b.number AS building,
--     e.entrance_number AS entrance,
--     COUNT(a.id) AS apartment_count,
--     MIN(a.number::int) AS min_apt,
--     MAX(a.number::int) AS max_apt
-- FROM building b
-- JOIN entrance e ON e.building_id = b.id
-- LEFT JOIN floor f ON f.entrance_id = e.id
-- LEFT JOIN apartment a ON a.floor_id = f.id
-- WHERE b.number = 5
-- GROUP BY b.number, e.entrance_number
-- ORDER BY e.entrance_number;
--
-- Expected results:
-- Building 5, Entrance 1: 222 apartments (1-222)
-- Building 5, Entrance 2: 253 apartments (223-475)
-- Building 5, Entrance 3: 253 apartments (476-728)
-- Total: 728 apartments
