-- Custom SQL migration file, put your code below! --

WITH inserted_building AS (
  INSERT INTO "sr2-community_building" ("number", "title", "liter", "active")
  VALUES
  ( 1, 'Строение 1', 'Литер 4, 5', true),
  ( 2, 'Строение 2', 'Литер 2, 3', true),
  ( 6, 'Строение 6', 'Литер 7', true),
  ( 7, 'Строение 7', 'Литер 6', true),
  ( 3, 'Строение 3', 'Литер 9', false),
  ( 4, 'Строение 4', 'Литер 1', false),
  ( 5, 'Строение 5', 'Литер 8', false)
  RETURNING id
)

INSERT INTO "sr2-community_entrance" ("building_id", "entrance_number")
VALUES
((SELECT id FROM "sr2-community_building" WHERE "number" = 1), 1),
((SELECT id FROM "sr2-community_building" WHERE "number" = 1), 2),
((SELECT id FROM "sr2-community_building" WHERE "number" = 2), 1),
((SELECT id FROM "sr2-community_building" WHERE "number" = 2), 2),
((SELECT id FROM "sr2-community_building" WHERE "number" = 7), 1),
((SELECT id FROM "sr2-community_building" WHERE "number" = 7), 2),
((SELECT id FROM "sr2-community_building" WHERE "number" = 6), 1),
((SELECT id FROM "sr2-community_building" WHERE "number" = 6), 2),

INSERT INTO "sr2-community_floor" ("entrance_id", "floor_number")
VALUES
((SELECT id FROM "sr2-community_entrance" WHERE "entrance_number" = 1 AND "building_id" = (SELECT id FROM "sr2-community_building" WHERE "number" = 1)), 1),
((SELECT id FROM "sr2-community_entrance" WHERE "entrance_number" = 1 AND "building_id" = (SELECT id FROM "sr2-community_building" WHERE "number" = 1)), 2),
((SELECT id FROM "sr2-community_entrance" WHERE "entrance_number" = 2 AND "building_id" = (SELECT id FROM "sr2-community_building" WHERE "number" = 1)), 3),

