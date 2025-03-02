-- Custom SQL migration file, put your code below! --

INSERT INTO "sr2-community_building" ("id", "number", "title", "liter", "active")
VALUES
    (gen_random_uuid(), 1, 'Строение 1', 'Литер 4, 5', true),
    (gen_random_uuid(), 2, 'Строение 2', 'Литер 2, 3', true),
    (gen_random_uuid(), 3, 'Строение 3', 'Литер 9', false),
    (gen_random_uuid(), 4, 'Строение 4', 'Литер 1', false),
    (gen_random_uuid(), 5, 'Строение 5', 'Литер 8', false),
    (gen_random_uuid(), 6, 'Строение 6', 'Литер 7', true),
    (gen_random_uuid(), 7, 'Строение 7', 'Литер 6', true);

-- Building 1 and 2

INSERT INTO "sr2-community_entrance" ("id", "building_id", "entrance_number")
SELECT gen_random_uuid(), "sr2-community_building"."id", entrance_number
FROM "sr2-community_building",
LATERAL (VALUES (1), (2)) AS e(entrance_number);

INSERT INTO "sr2-community_floor" ("id", "entrance_id", "floor_number")
SELECT
    gen_random_uuid(),
    "sr2-community_entrance"."id",
    floor_number
FROM "sr2-community_entrance"
JOIN "sr2-community_building" ON "sr2-community_entrance"."building_id" = "sr2-community_building"."id"
CROSS JOIN LATERAL (
    SELECT generate_series(1,
        CASE
            WHEN "sr2-community_building"."number" = 2 AND "sr2-community_entrance"."entrance_number" IN (1, 2)
            THEN 12
            ELSE 24
        END
    ) AS floor_number
) AS floors
WHERE "sr2-community_building"."number" IN (1, 2, 6, 7);


-- Building 1 and 2

WITH numbered_floors AS (
    SELECT
        "sr2-community_floor"."id" AS floor_id,
        "sr2-community_floor"."floor_number",
        "sr2-community_entrance"."entrance_number",
        "sr2-community_building"."number" AS building_number
    FROM "sr2-community_floor"
    JOIN "sr2-community_entrance" ON "sr2-community_floor"."entrance_id" = "sr2-community_entrance"."id"
    JOIN "sr2-community_building" ON "sr2-community_entrance"."building_id" = "sr2-community_building"."id"
    WHERE "sr2-community_building"."number" IN (1, 2)
    AND "sr2-community_floor"."floor_number" >= 3
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
INSERT INTO "sr2-community_apartment" ("id", "floor_id", "number", "type")
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
        "sr2-community_floor"."id" AS floor_id,
        "sr2-community_floor"."floor_number",
        "sr2-community_entrance"."entrance_number",
        "sr2-community_building"."number" AS building_number
    FROM "sr2-community_floor"
    JOIN "sr2-community_entrance" ON "sr2-community_floor"."entrance_id" = "sr2-community_entrance"."id"
    JOIN "sr2-community_building" ON "sr2-community_entrance"."building_id" = "sr2-community_building"."id"
    WHERE "sr2-community_building"."number" IN (6, 7)
    AND "sr2-community_floor"."floor_number" BETWEEN 2 AND 24
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
INSERT INTO "sr2-community_apartment" ("id", "floor_id", "number", "type")
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

