-- Custom SQL migration file, put your code below! --

INSERT INTO "building" ("id", "number", "title", "liter", "active")
VALUES
    (gen_random_uuid(), 1, 'Строение 1', 'Литер 4, 5', true),
    (gen_random_uuid(), 2, 'Строение 2', 'Литер 2, 3', true),
    (gen_random_uuid(), 3, 'Строение 3', 'Литер 9', false),
    (gen_random_uuid(), 4, 'Строение 4', 'Литер 1', false),
    (gen_random_uuid(), 5, 'Строение 5', 'Литер 8', false),
    (gen_random_uuid(), 6, 'Строение 6', 'Литер 7', true),
    (gen_random_uuid(), 7, 'Строение 7', 'Литер 6', true);

-- Building 1 and 2

INSERT INTO "entrance" ("id", "building_id", "entrance_number")
SELECT gen_random_uuid(), "building"."id", entrance_number
FROM "building",
LATERAL (VALUES (1), (2)) AS e(entrance_number);

INSERT INTO "floor" ("id", "entrance_id", "floor_number")
SELECT
    gen_random_uuid(),
    "entrance"."id",
    floor_number
FROM "entrance"
JOIN "building" ON "entrance"."building_id" = "building"."id"
CROSS JOIN LATERAL (
    SELECT generate_series(1,
        CASE
            WHEN "building"."number" = 2 AND "entrance"."entrance_number" IN (1, 2)
            THEN 12
            ELSE 24
        END
    ) AS floor_number
) AS floors
WHERE "building"."number" IN (1, 2, 6, 7);


-- Building 1 and 2

WITH numbered_floors AS (
    SELECT
        "floor"."id" AS floor_id,
        "floor"."floor_number",
        "entrance"."entrance_number",
        "building"."number" AS building_number
    FROM "floor"
    JOIN "entrance" ON "floor"."entrance_id" = "entrance"."id"
    JOIN "building" ON "entrance"."building_id" = "building"."id"
    WHERE "building"."number" IN (1, 2)
    AND "floor"."floor_number" >= 3
),
apartments AS (
    SELECT
        floor_id,
        floor_number,
        entrance_number,
        building_number,
        generate_series(1, 11) AS apartment_offset
    FROM numbered_floors
)
INSERT INTO "apartment" ("id", "floor_id", "number", "type")
SELECT
    gen_random_uuid(),
    floor_id,
    (floor_number - 3) * 11 + apartment_offset +
    CASE
        WHEN entrance_number = 2 THEN 242
        ELSE 0
    END AS apartment_number,
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


-- Building 6 and 7

WITH numbered_floors AS (
    SELECT
        "floor"."id" AS floor_id,
        "floor"."floor_number",
        "entrance"."entrance_number",
        "building"."number" AS building_number
    FROM "floor"
    JOIN "entrance" ON "floor"."entrance_id" = "entrance"."id"
    JOIN "building" ON "entrance"."building_id" = "building"."id"
    WHERE "building"."number" IN (6, 7)
    AND "floor"."floor_number" BETWEEN 2 AND 24
),
apartments AS (
    SELECT
        floor_id,
        floor_number,
        entrance_number,
        building_number,
        generate_series(1,
            CASE WHEN entrance_number = 1 THEN 12 ELSE 11 END
        ) AS apartment_offset
    FROM numbered_floors
)
INSERT INTO "apartment" ("id", "floor_id", "number", "type")
SELECT
    gen_random_uuid(),
    floor_id,
    (floor_number - 2) * 12 + apartment_offset +
    CASE
        WHEN entrance_number = 2 THEN 400
        ELSE 0
    END AS apartment_number,
    CASE
        WHEN entrance_number = 1 THEN
            CASE apartment_offset
                WHEN 1 THEN '3k'::apartment_type
                WHEN 2 THEN 'studio'::apartment_type
                WHEN 3 THEN '1k'::apartment_type
                WHEN 4 THEN '1k'::apartment_type
                WHEN 5 THEN '2k'::apartment_type
                WHEN 6 THEN '1k'::apartment_type
                WHEN 7 THEN '2k'::apartment_type
                WHEN 8 THEN '1k'::apartment_type
                WHEN 9 THEN '1k'::apartment_type
                WHEN 10 THEN '1k'::apartment_type
                WHEN 11 THEN 'studio'::apartment_type
                WHEN 12 THEN '1k'::apartment_type
            END
        ELSE
            CASE apartment_offset
                WHEN 1 THEN '1k'::apartment_type
                WHEN 2 THEN 'studio'::apartment_type
                WHEN 3 THEN '1k'::apartment_type
                WHEN 4 THEN '1k'::apartment_type
                WHEN 5 THEN '1k'::apartment_type
                WHEN 6 THEN '3k'::apartment_type
                WHEN 7 THEN '3k'::apartment_type
                WHEN 8 THEN '2k'::apartment_type
                WHEN 9 THEN 'studio'::apartment_type
                WHEN 10 THEN '2k'::apartment_type
                WHEN 11 THEN '1k'::apartment_type
            END
    END AS apartment_type
FROM apartments;


-- Добавляем парковки
INSERT INTO "parking" ("id", "building_id", "name")
SELECT
    gen_random_uuid(),
    b.id,
    'Подземная парковка ' || b."number"
FROM "building" b
WHERE b."number" IN (1, 2, 6, 7);

-- Добавляем этажи парковок (-1 этаж)
INSERT INTO "parking_floor" ("id", "parking_id", "floor_number")
SELECT
    gen_random_uuid(),
    p.id,
    -1
FROM "parking" p
JOIN "building" b ON p."building_id" = b."id"
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
    FROM "parking_floor" pf
    JOIN "parking" p ON pf."parking_id" = p."id"
    JOIN "building" b ON p."building_id" = b."id"
)
INSERT INTO "parking_spot" ("id", "floor_id", "number", "type")
SELECT
    gen_random_uuid(),
    floor_id,
    space_number::text,
    'standard'  -- Все места пока стандартные
FROM parking_data,
LATERAL generate_series(1, total_spots) AS space_number;
