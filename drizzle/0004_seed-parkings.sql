-- Добавляем парковки
INSERT INTO "sr2-community_parking" ("id", "building_id", "name")
SELECT
    gen_random_uuid(),
    b.id,
    'Подземная парковка ' || b."number"
FROM "sr2-community_building" b
WHERE b."number" IN (1, 2, 6, 7);

-- Добавляем этажи парковок (-1 этаж)
INSERT INTO "sr2-community_parking_floor" ("id", "parking_id", "floor_number")
SELECT
    gen_random_uuid(),
    p.id,
    -1
FROM "sr2-community_parking" p
JOIN "sr2-community_building" b ON p."building_id" = b."id"
WHERE b."number" IN (1, 2, 6, 7);

-- Добавляем паркоместа
WITH parking_data AS (
    SELECT
        pf.id AS floor_id,
        b."number" AS building_number,
        CASE b."number"
            WHEN 1 THEN 210
            WHEN 2 THEN 259
            WHEN 6 THEN 99
            WHEN 7 THEN 226
        END AS total_spots
    FROM "sr2-community_parking_floor" pf
    JOIN "sr2-community_parking" p ON pf."parking_id" = p."id"
    JOIN "sr2-community_building" b ON p."building_id" = b."id"
)
INSERT INTO "sr2-community_parking_spot" ("id", "floor_id", "number", "type")
SELECT
    gen_random_uuid(),
    floor_id,
    space_number::text,
    'standard'  -- Все места пока стандартные
FROM parking_data,
LATERAL generate_series(1, total_spots) AS space_number;
