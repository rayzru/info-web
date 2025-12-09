-- Custom SQL migration file, put your code below! --

INSERT INTO "building" ("id", "number", "title", "liter", "active")
VALUES
    (gen_random_uuid(), 1, 'Строение 1', 'Литер 4, 5', true),
    (gen_random_uuid(), 2, 'Строение 2', 'Литер 2, 3', true),
    (gen_random_uuid(), 3, 'Строение 3', 'Литер 9', true),
    (gen_random_uuid(), 4, 'Строение 4', 'Литер 1', true),
    (gen_random_uuid(), 5, 'Строение 5', 'Литер 8', true),
    (gen_random_uuid(), 6, 'Строение 6', 'Литер 7', true),
    (gen_random_uuid(), 7, 'Строение 7', 'Литер 6', true);

-- Entrances for buildings 1, 2, 6, 7 (2 entrances each)
INSERT INTO "entrance" ("id", "building_id", "entrance_number")
SELECT gen_random_uuid(), "building"."id", entrance_number
FROM "building",
LATERAL (VALUES (1), (2)) AS e(entrance_number)
WHERE "building"."number" IN (1, 2, 6, 7);

-- Entrances for building 3 (4 entrances)
INSERT INTO "entrance" ("id", "building_id", "entrance_number")
SELECT gen_random_uuid(), "building"."id", entrance_number
FROM "building",
LATERAL (VALUES (1), (2), (3), (4)) AS e(entrance_number)
WHERE "building"."number" = 3;

-- Entrances for building 4 (1 entrance)
INSERT INTO "entrance" ("id", "building_id", "entrance_number")
SELECT gen_random_uuid(), "building"."id", 1
FROM "building"
WHERE "building"."number" = 4;

-- Entrances for building 5 (3 entrances)
INSERT INTO "entrance" ("id", "building_id", "entrance_number")
SELECT gen_random_uuid(), "building"."id", entrance_number
FROM "building",
LATERAL (VALUES (1), (2), (3)) AS e(entrance_number)
WHERE "building"."number" = 5;

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
            WHEN "building"."number" = 2 AND "entrance"."entrance_number" = 2 THEN 12
            WHEN "building"."number" = 3 THEN 12
            ELSE 24
        END
    ) AS floor_number
) AS floors
WHERE "building"."number" IN (1, 2, 3, 4, 5, 6, 7);


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


-- Building 3 entrance 1 (floor 2: 2 apartments, floors 3-12: 7 apartments, total 1-72)
WITH numbered_floors AS (
    SELECT
        "floor"."id" AS floor_id,
        "floor"."floor_number"
    FROM "floor"
    JOIN "entrance" ON "floor"."entrance_id" = "entrance"."id"
    JOIN "building" ON "entrance"."building_id" = "building"."id"
    WHERE "building"."number" = 3
    AND "entrance"."entrance_number" = 1
    AND "floor"."floor_number" >= 2
),
apartments AS (
    SELECT
        floor_id,
        floor_number,
        generate_series(1,
            CASE WHEN floor_number = 2 THEN 2 ELSE 7 END
        ) AS apartment_offset
    FROM numbered_floors
)
INSERT INTO "apartment" ("id", "floor_id", "number", "type")
SELECT
    gen_random_uuid(),
    floor_id,
    CASE
        WHEN floor_number = 2 THEN apartment_offset
        ELSE 2 + (floor_number - 3) * 7 + apartment_offset
    END::text,
    CASE apartment_offset
        WHEN 1 THEN '2k'::apartment_type
        WHEN 2 THEN '1k'::apartment_type
        WHEN 3 THEN '1k'::apartment_type
        WHEN 4 THEN '2k'::apartment_type
        WHEN 5 THEN '1k'::apartment_type
        WHEN 6 THEN '1k'::apartment_type
        WHEN 7 THEN '2k'::apartment_type
    END AS apartment_type
FROM apartments;

-- Building 3 entrance 2 (floors 2-11: 5 apartments, floor 12: 2 apartments, apartments 73-124)
WITH numbered_floors AS (
    SELECT
        "floor"."id" AS floor_id,
        "floor"."floor_number"
    FROM "floor"
    JOIN "entrance" ON "floor"."entrance_id" = "entrance"."id"
    JOIN "building" ON "entrance"."building_id" = "building"."id"
    WHERE "building"."number" = 3
    AND "entrance"."entrance_number" = 2
    AND "floor"."floor_number" >= 2
),
apartments AS (
    SELECT
        floor_id,
        floor_number,
        generate_series(1,
            CASE WHEN floor_number = 12 THEN 2 ELSE 5 END
        ) AS apartment_offset
    FROM numbered_floors
)
INSERT INTO "apartment" ("id", "floor_id", "number", "type")
SELECT
    gen_random_uuid(),
    floor_id,
    (72 + (floor_number - 2) * 5 + apartment_offset)::text,
    CASE apartment_offset
        WHEN 1 THEN '2k'::apartment_type
        WHEN 2 THEN '1k'::apartment_type
        WHEN 3 THEN '2k'::apartment_type
        WHEN 4 THEN '1k'::apartment_type
        WHEN 5 THEN '1k'::apartment_type
    END AS apartment_type
FROM apartments;

-- Building 3 entrance 3 (floors 2-11: 4 apartments, floor 12: 2 apartments, apartments 125-166)
WITH numbered_floors AS (
    SELECT
        "floor"."id" AS floor_id,
        "floor"."floor_number"
    FROM "floor"
    JOIN "entrance" ON "floor"."entrance_id" = "entrance"."id"
    JOIN "building" ON "entrance"."building_id" = "building"."id"
    WHERE "building"."number" = 3
    AND "entrance"."entrance_number" = 3
    AND "floor"."floor_number" >= 2
),
apartments AS (
    SELECT
        floor_id,
        floor_number,
        generate_series(1,
            CASE WHEN floor_number = 12 THEN 2 ELSE 4 END
        ) AS apartment_offset
    FROM numbered_floors
)
INSERT INTO "apartment" ("id", "floor_id", "number", "type")
SELECT
    gen_random_uuid(),
    floor_id,
    (124 + (floor_number - 2) * 4 + apartment_offset)::text,
    CASE apartment_offset
        WHEN 1 THEN '2k'::apartment_type
        WHEN 2 THEN '1k'::apartment_type
        WHEN 3 THEN '1k'::apartment_type
        WHEN 4 THEN '2k'::apartment_type
    END AS apartment_type
FROM apartments;

-- Building 3 entrance 4 (floors 2-11: 5 apartments, floor 12: 2 apartments, apartments 167-218)
WITH numbered_floors AS (
    SELECT
        "floor"."id" AS floor_id,
        "floor"."floor_number"
    FROM "floor"
    JOIN "entrance" ON "floor"."entrance_id" = "entrance"."id"
    JOIN "building" ON "entrance"."building_id" = "building"."id"
    WHERE "building"."number" = 3
    AND "entrance"."entrance_number" = 4
    AND "floor"."floor_number" >= 2
),
apartments AS (
    SELECT
        floor_id,
        floor_number,
        generate_series(1,
            CASE WHEN floor_number = 12 THEN 2 ELSE 5 END
        ) AS apartment_offset
    FROM numbered_floors
)
INSERT INTO "apartment" ("id", "floor_id", "number", "type")
SELECT
    gen_random_uuid(),
    floor_id,
    (166 + (floor_number - 2) * 5 + apartment_offset)::text,
    CASE apartment_offset
        WHEN 1 THEN '2k'::apartment_type
        WHEN 2 THEN '1k'::apartment_type
        WHEN 3 THEN '2k'::apartment_type
        WHEN 4 THEN '1k'::apartment_type
        WHEN 5 THEN '1k'::apartment_type
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
    'Парковка (стр. ' || b."number" || ')'
FROM "building" b
WHERE b."number" IN (1, 2, 6, 7);

-- Добавляем этажи парковок
-- Строение 1: -1 (основной), -2 (только место 127)
-- Строение 2: -1 (только место 106), -2 (основной)
-- Строения 6, 7: только -1
INSERT INTO "parking_floor" ("id", "parking_id", "floor_number")
SELECT
    gen_random_uuid(),
    p.id,
    floor_num
FROM "parking" p
JOIN "building" b ON p."building_id" = b."id"
CROSS JOIN LATERAL (
    SELECT unnest(
        CASE b."number"
            WHEN 1 THEN ARRAY[-1, -2]
            WHEN 2 THEN ARRAY[-1, -2]
            ELSE ARRAY[-1]
        END
    ) AS floor_num
) AS floors;

-- Добавляем паркоместа для строений 6, 7 (все на -1 этаже)
WITH parking_data AS (
    SELECT
        pf.id AS floor_id,
        b."number" AS building_number,
        CASE b."number"
            WHEN 6 THEN 99
            WHEN 7 THEN 226
        END AS total_spots
    FROM "parking_floor" pf
    JOIN "parking" p ON pf."parking_id" = p."id"
    JOIN "building" b ON p."building_id" = b."id"
    WHERE b."number" IN (6, 7)
)
INSERT INTO "parking_spot" ("id", "floor_id", "number", "type")
SELECT
    gen_random_uuid(),
    floor_id,
    space_number::text,
    'standard'
FROM parking_data,
LATERAL generate_series(1, total_spots) AS space_number;

-- Строение 1: 83 места на -1, 127 мест на -2 (всего 210)
WITH floors_b1 AS (
    SELECT
        pf.id AS floor_id,
        pf.floor_number
    FROM "parking_floor" pf
    JOIN "parking" p ON pf."parking_id" = p."id"
    JOIN "building" b ON p."building_id" = b."id"
    WHERE b."number" = 1
)
INSERT INTO "parking_spot" ("id", "floor_id", "number", "type")
SELECT
    gen_random_uuid(),
    CASE
        WHEN spot_num <= 83 THEN (SELECT floor_id FROM floors_b1 WHERE floor_number = -1)
        ELSE (SELECT floor_id FROM floors_b1 WHERE floor_number = -2)
    END,
    spot_num::text,
    'standard'
FROM generate_series(1, 210) AS spot_num;

-- Строение 2: 106 мест на -1, 153 места на -2 (всего 259)
WITH floors_b2 AS (
    SELECT
        pf.id AS floor_id,
        pf.floor_number
    FROM "parking_floor" pf
    JOIN "parking" p ON pf."parking_id" = p."id"
    JOIN "building" b ON p."building_id" = b."id"
    WHERE b."number" = 2
)
INSERT INTO "parking_spot" ("id", "floor_id", "number", "type")
SELECT
    gen_random_uuid(),
    CASE
        WHEN spot_num <= 106 THEN (SELECT floor_id FROM floors_b2 WHERE floor_number = -1)
        ELSE (SELECT floor_id FROM floors_b2 WHERE floor_number = -2)
    END,
    spot_num::text,
    'standard'
FROM generate_series(1, 259) AS spot_num;

-- Admin user (Андрей Румм)
INSERT INTO "user" ("id", "name", "email", "email_verified", "image")
VALUES (
    'e435b74c-f942-40f3-9e9e-45cc95e8c2a0',
    'Андрей Румм',
    'andrew@rumm.im',
    NOW(),
    'https://avatars.yandex.net/get-yapic/58107/rotQReP1p5YJPfzPW26ejN6acA-1/islands-200'
);

-- Yandex OAuth account
INSERT INTO "account" ("user_id", "type", "provider", "provider_account_id", "refresh_token", "access_token", "expires_at", "token_type", "scope")
VALUES (
    'e435b74c-f942-40f3-9e9e-45cc95e8c2a0',
    'oauth',
    'yandex',
    '1130000019740226',
    '2:AAA:AAQDuqHF1kI:1:5s1Q3lzTxpNErOm9:W-RlcjFKWWHcI8rNHQZ03yKNAFCk8grv0d5f-7PPkEvQMG-DJDf1MR6_Owu8y24yyX1Zk13816vX:U6oUpIGHtjB4eTjCvWQmAg',
    'y0__xDCrJeOqveAAhjWmC8g0sacwRU3Uw2VavO7KoiOFwUQSHghFEbNAA',
    1796325489,
    'bearer',
    'login:email login:info login:avatar'
);

-- SuperAdmin role
INSERT INTO "user_role" ("user_id", "role")
VALUES ('e435b74c-f942-40f3-9e9e-45cc95e8c2a0', 'SuperAdmin');
