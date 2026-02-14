-- Migration: Add Building 4 Apartments
-- Building 4 has same layout as Building 2 entrance 1
-- 253 apartments total, starting from floor 2 (floors 2-24)
-- Pattern: 2k, 2k, 1k, 1k, 2k, 1k, 2k, 1k, 1k, 1k, 3k (11 apartments per floor)

-- Building 4 (floors 2-24: 11 apartments each, apartments 1-253)
WITH numbered_floors AS (
    SELECT
        "floor"."id" AS floor_id,
        "floor"."floor_number"
    FROM "floor"
    JOIN "entrance" ON "floor"."entrance_id" = "entrance"."id"
    JOIN "building" ON "entrance"."building_id" = "building"."id"
    WHERE "building"."number" = 4
    AND "entrance"."entrance_number" = 1
    AND "floor"."floor_number" >= 2
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
    -- Start numbering from 1: (floor_2 - 2) * 11 + offset = 0 * 11 + 1 = 1
    -- Floor 2: 1-11, Floor 3: 12-22, ..., Floor 24: 243-253
    ((floor_number - 2) * 11 + apartment_offset)::text AS apartment_number,
    CASE apartment_offset
        WHEN 1 THEN '2k'::apartment_type
        WHEN 2 THEN '2k'::apartment_type
        WHEN 3 THEN '1k'::apartment_type
        WHEN 4 THEN '1k'::apartment_type
        WHEN 5 THEN '2k'::apartment_type
        WHEN 6 THEN '1k'::apartment_type
        WHEN 7 THEN '2k'::apartment_type
        WHEN 8 THEN '1k'::apartment_type
        WHEN 9 THEN '1k'::apartment_type
        WHEN 10 THEN '1k'::apartment_type
        WHEN 11 THEN '3k'::apartment_type
    END AS apartment_type
FROM apartments;
