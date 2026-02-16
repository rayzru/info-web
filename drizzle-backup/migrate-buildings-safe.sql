-- ============================================================================
-- БЕЗОПАСНАЯ миграция структуры ЖК с сохранением связей пользователей
-- Generated: 2026-01-28T13:06:59.741Z
-- ============================================================================
--
-- ВАЖНО:
-- 1. Сохраняются ID существующих квартир/парковок
-- 2. Связи user_apartment и user_parking_spot остаются неизменными
-- 3. Обновляются только свойства (тип, планировка)
--
-- ============================================================================

BEGIN;

-- ============================================================================
-- UPDATE Apartments (874)
-- КРИТИЧНО: Сохраняем ID для связей user_apartment
-- ============================================================================

-- Apartment #5: 1k → 2k
UPDATE "apartment" SET "type" = '2k', "layout_code" = NULL WHERE "id" = 'b10acd42-d2a8-43de-ad80-1bab385b22b5';
-- Apartment #7: 1k → 2k
UPDATE "apartment" SET "type" = '2k', "layout_code" = NULL WHERE "id" = '795f0ee6-7ec0-4df9-bc66-f63ae28578ba';
-- Apartment #11: 1k → 3k
UPDATE "apartment" SET "type" = '3k', "layout_code" = NULL WHERE "id" = '55fe2d50-26bc-4742-80ea-ab77c50150df';
-- Apartment #12: 1k → 2k
UPDATE "apartment" SET "type" = '2k', "layout_code" = NULL WHERE "id" = '3f5062f1-cb7b-4571-8597-d9352e3afdce';
-- Apartment #16: 1k → 2k
UPDATE "apartment" SET "type" = '2k', "layout_code" = NULL WHERE "id" = '9f0343f6-6c44-47c7-aa7c-7443b801ab27';
-- Apartment #17: 2k → 1k
UPDATE "apartment" SET "type" = '1k', "layout_code" = NULL WHERE "id" = 'a8a515e3-31f1-4744-8754-94da6397ded8';
-- Apartment #18: 1k → 2k
UPDATE "apartment" SET "type" = '2k', "layout_code" = NULL WHERE "id" = 'da049fd2-7e97-4058-8ddc-58496704dc90';
-- Apartment #20: 2k → 1k
UPDATE "apartment" SET "type" = '1k', "layout_code" = NULL WHERE "id" = '11cd9a1a-4c3c-4159-88dc-7f831123c341';
-- Apartment #22: 1k → 3k
UPDATE "apartment" SET "type" = '3k', "layout_code" = NULL WHERE "id" = '6b17af69-4ea1-4a72-b476-3b90ea62f5ab';
-- Apartment #24: 1k → 2k
UPDATE "apartment" SET "type" = '2k', "layout_code" = NULL WHERE "id" = 'b3177f6f-aa59-4383-aa0d-931fc7c887b4';
-- Apartment #27: 1k → 2k
UPDATE "apartment" SET "type" = '2k', "layout_code" = NULL WHERE "id" = 'abfe1842-df9e-4d3c-9be4-d98dd04aeadb';
-- Apartment #29: 1k → 2k
UPDATE "apartment" SET "type" = '2k', "layout_code" = NULL WHERE "id" = '21c4e07b-21e5-49c8-9c74-2dd63e72e625';
-- Apartment #31: 2k → 1k
UPDATE "apartment" SET "type" = '1k', "layout_code" = NULL WHERE "id" = '69934da0-b2c4-4edb-9d40-764ea030a6ef';
-- Apartment #33: 1k → 3k
UPDATE "apartment" SET "type" = '3k', "layout_code" = NULL WHERE "id" = 'ddeb5673-7ed6-4d73-ae58-7b68d857df59';
-- Apartment #34: 1k → 2k
UPDATE "apartment" SET "type" = '2k', "layout_code" = NULL WHERE "id" = 'd60fcead-d6c8-4d82-8a00-318a024dafaf';
-- Apartment #35: 1k → 2k
UPDATE "apartment" SET "type" = '2k', "layout_code" = NULL WHERE "id" = 'bbd0dab6-4cfb-4ced-ab6c-d4dcd48faa3d';
-- Apartment #37: 2k → 1k
UPDATE "apartment" SET "type" = '1k', "layout_code" = NULL WHERE "id" = '340f0ffd-017c-43f0-b00d-c94db0690f5b';
-- Apartment #40: 1k → 2k
UPDATE "apartment" SET "type" = '2k', "layout_code" = NULL WHERE "id" = 'c58b3eb1-0322-4a0a-8c2f-5936d56be7a4';
-- Apartment #41: 2k → 1k
UPDATE "apartment" SET "type" = '1k', "layout_code" = NULL WHERE "id" = 'b62d9686-1708-415c-96a5-d4ff866678b6';
-- Apartment #44: 2k → 3k
UPDATE "apartment" SET "type" = '3k', "layout_code" = NULL WHERE "id" = '03bbc08c-1e9a-49b1-b6bb-6f7d3c2455a9';
-- Apartment #45: 1k → 2k
UPDATE "apartment" SET "type" = '2k', "layout_code" = NULL WHERE "id" = 'cb416849-dc62-419f-b78f-26bec2d718f5';
-- Apartment #46: 1k → 2k
UPDATE "apartment" SET "type" = '2k', "layout_code" = NULL WHERE "id" = 'e9d85f76-1599-4eb1-99b0-d76ec8c87f5e';
-- Apartment #49: 1k → 2k
UPDATE "apartment" SET "type" = '2k', "layout_code" = NULL WHERE "id" = 'f410a7d6-c9e1-4c23-a6b5-c871f10aae4c';
-- Apartment #51: 1k → 2k
UPDATE "apartment" SET "type" = '2k', "layout_code" = NULL WHERE "id" = '940636e3-4afd-4017-8841-dcb423aa2033';
-- Apartment #55: 2k → 3k
UPDATE "apartment" SET "type" = '3k', "layout_code" = NULL WHERE "id" = '84a82f97-70c8-4dec-ae89-f4fefed11514';
-- Apartment #56: 1k → 2k
UPDATE "apartment" SET "type" = '2k', "layout_code" = NULL WHERE "id" = '95cd6831-21bc-41a7-b3e7-ce7cc82772e7';
-- Apartment #57: 1k → 2k
UPDATE "apartment" SET "type" = '2k', "layout_code" = NULL WHERE "id" = '37125bf2-27c6-4d60-b7a7-02502f985203';
-- Apartment #59: 2k → 1k
UPDATE "apartment" SET "type" = '1k', "layout_code" = NULL WHERE "id" = '79475a58-d7e2-47a1-8492-7aa3175647c4';
-- Apartment #60: 1k → 2k
UPDATE "apartment" SET "type" = '2k', "layout_code" = NULL WHERE "id" = 'da3964aa-adc5-41ff-beeb-2e3fca5d6d51';
-- Apartment #65: 2k → 1k
UPDATE "apartment" SET "type" = '1k', "layout_code" = NULL WHERE "id" = 'a0c3820b-2569-48fe-80ef-387262384181';
-- Apartment #66: 1k → 3k
UPDATE "apartment" SET "type" = '3k', "layout_code" = NULL WHERE "id" = '7afa13e9-6e0f-4805-94c8-43507135c9e8';
-- Apartment #67: 1k → 2k
UPDATE "apartment" SET "type" = '2k', "layout_code" = NULL WHERE "id" = 'cf3a4756-7441-41ff-9004-284adbb18cbf';
-- Apartment #68: 1k → 2k
UPDATE "apartment" SET "type" = '2k', "layout_code" = NULL WHERE "id" = '51a314e8-5614-4516-b20b-7fa75dd39f23';
-- Apartment #71: 1k → 2k
UPDATE "apartment" SET "type" = '2k', "layout_code" = NULL WHERE "id" = '1d4de826-f647-4366-b8b8-8210ef6f3f66';
-- Apartment #77: 1k → 3k
UPDATE "apartment" SET "type" = '3k', "layout_code" = NULL WHERE "id" = '82bb617d-58c0-4ca6-a7a4-b9f3120f0a76';
-- Apartment #78: 1k → 2k
UPDATE "apartment" SET "type" = '2k', "layout_code" = NULL WHERE "id" = 'f62d6f67-c702-409b-90fa-9811060f2314';
-- Apartment #79: 1k → 2k
UPDATE "apartment" SET "type" = '2k', "layout_code" = NULL WHERE "id" = '2f556ce8-c926-41bf-a2e6-1e75b0ac7b0a';
-- Apartment #80: 2k → 1k
UPDATE "apartment" SET "type" = '1k', "layout_code" = NULL WHERE "id" = '01e43cb1-7546-48f5-ab8a-b1c2db615061';
-- Apartment #82: 1k → 2k
UPDATE "apartment" SET "type" = '2k', "layout_code" = NULL WHERE "id" = 'cae4b08b-a927-45b0-96f8-5a4c1073f3e4';
-- Apartment #83: 2k → 1k
UPDATE "apartment" SET "type" = '1k', "layout_code" = NULL WHERE "id" = '81435567-51eb-468b-ab37-20982f0dace8';
-- Apartment #84: 1k → 2k
UPDATE "apartment" SET "type" = '2k', "layout_code" = NULL WHERE "id" = 'f10657bc-60e4-4744-8118-07cb15b54336';
-- Apartment #85: 2k → 1k
UPDATE "apartment" SET "type" = '1k', "layout_code" = NULL WHERE "id" = 'c03b0ece-b51b-434b-88dd-87c9810040d9';
-- Apartment #88: 1k → 3k
UPDATE "apartment" SET "type" = '3k', "layout_code" = NULL WHERE "id" = 'db01c715-dd60-45fd-9388-5b6514aaeb05';
-- Apartment #89: 1k → 2k
UPDATE "apartment" SET "type" = '2k', "layout_code" = NULL WHERE "id" = '39c1bf59-c179-4683-9220-2f30d661a169';
-- Apartment #90: 1k → 2k
UPDATE "apartment" SET "type" = '2k', "layout_code" = NULL WHERE "id" = 'd0f73766-f3ac-4531-9107-0e5645152150';
-- Apartment #93: 1k → 2k
UPDATE "apartment" SET "type" = '2k', "layout_code" = NULL WHERE "id" = '6a51b03e-e3c3-4905-8e1b-0f3f88f97080';
-- Apartment #98: 2k → 1k
UPDATE "apartment" SET "type" = '1k', "layout_code" = NULL WHERE "id" = 'e8a7b643-07c0-4c51-922a-aeed6fd47712';
-- Apartment #99: 1k → 3k
UPDATE "apartment" SET "type" = '3k', "layout_code" = NULL WHERE "id" = 'f93759e7-d467-4108-929e-df4496b9f777';
-- Apartment #100: 1k → 2k
UPDATE "apartment" SET "type" = '2k', "layout_code" = NULL WHERE "id" = '839859a5-69ff-4cb3-80d2-c96380da6166';
-- Apartment #101: 1k → 2k
UPDATE "apartment" SET "type" = '2k', "layout_code" = NULL WHERE "id" = 'b88410dc-22bf-448a-ae0c-ca38fb444353';
-- Apartment #103: 2k → 1k
UPDATE "apartment" SET "type" = '1k', "layout_code" = NULL WHERE "id" = '83fdb894-cb20-4bd3-8c14-63a32a15851a';
-- Apartment #104: 1k → 2k
UPDATE "apartment" SET "type" = '2k', "layout_code" = NULL WHERE "id" = 'f3310657-1026-44a8-bd61-0a4e7ae03efe';
-- Apartment #106: 1k → 2k
UPDATE "apartment" SET "type" = '2k', "layout_code" = NULL WHERE "id" = 'd96be98c-a945-4509-83b9-317d2be36b53';
-- Apartment #110: 2k → 3k
UPDATE "apartment" SET "type" = '3k', "layout_code" = NULL WHERE "id" = '414d36d0-47c4-4e9f-a95d-95e553cd96dd';
-- Apartment #111: 1k → 2k
UPDATE "apartment" SET "type" = '2k', "layout_code" = NULL WHERE "id" = '61001ff0-9dba-45b3-9607-1bb367c474c9';
-- Apartment #112: 1k → 2k
UPDATE "apartment" SET "type" = '2k', "layout_code" = NULL WHERE "id" = 'ffc24ab1-ee8b-4785-b28f-fe1f9320f30b';
-- Apartment #113: 2k → 1k
UPDATE "apartment" SET "type" = '1k', "layout_code" = NULL WHERE "id" = 'e3f53973-5be8-4e96-a8d5-4ccee4d5ad02';
-- Apartment #117: 1k → 2k
UPDATE "apartment" SET "type" = '2k', "layout_code" = NULL WHERE "id" = '19ffc391-17f6-4e06-9d4e-a6d2857044ae';
-- Apartment #121: 1k → 3k
UPDATE "apartment" SET "type" = '3k', "layout_code" = NULL WHERE "id" = '7759974f-2ec6-48b3-bc54-a15776270199';
-- Apartment #123: 1k → 2k
UPDATE "apartment" SET "type" = '2k', "layout_code" = NULL WHERE "id" = '5b2d3dec-bcf7-4049-9d5f-de7c2fef4d72';
-- Apartment #125: 2k → 1k
UPDATE "apartment" SET "type" = '1k', "layout_code" = NULL WHERE "id" = 'b175636a-c62c-4355-ba3d-c472327fc066';
-- Apartment #126: 1k → 2k
UPDATE "apartment" SET "type" = '2k', "layout_code" = NULL WHERE "id" = 'ba1ae3c9-fa96-4a84-9466-2ecbb93aa42d';
-- Apartment #132: 1k → 3k
UPDATE "apartment" SET "type" = '3k', "layout_code" = NULL WHERE "id" = 'd0fda2af-f3f3-48d2-b8f5-d312e2233a0b';
-- Apartment #139: 1k → 2k
UPDATE "apartment" SET "type" = '2k', "layout_code" = NULL WHERE "id" = '40f99731-e71b-4e35-9da1-623c0743b3ee';
-- Apartment #140: 2k → 1k
UPDATE "apartment" SET "type" = '1k', "layout_code" = NULL WHERE "id" = '24fc2bcc-c6a6-428d-ab06-b2d739e3e462';
-- Apartment #143: 1k → 3k
UPDATE "apartment" SET "type" = '3k', "layout_code" = NULL WHERE "id" = '9492cae1-db3e-4949-84bf-fb451141a97c';
-- Apartment #144: 1k → 2k
UPDATE "apartment" SET "type" = '2k', "layout_code" = NULL WHERE "id" = '02f33fb3-7fb3-43ee-9652-28428fab874a';
-- Apartment #148: 1k → 2k
UPDATE "apartment" SET "type" = '2k', "layout_code" = NULL WHERE "id" = '81ca5b95-c064-4f5f-b4a4-45e38dd5e359';
-- Apartment #149: 2k → 1k
UPDATE "apartment" SET "type" = '1k', "layout_code" = NULL WHERE "id" = '1effe1ba-d9e3-4f18-a626-deb63a7fdc3c';
-- Apartment #150: 1k → 2k
UPDATE "apartment" SET "type" = '2k', "layout_code" = NULL WHERE "id" = '4f6c122b-0380-48f3-9157-4928e11c2928';
-- Apartment #152: 2k → 1k
UPDATE "apartment" SET "type" = '1k', "layout_code" = NULL WHERE "id" = '70eb7da4-90e1-464c-b261-6ef7a794f171';
-- Apartment #154: 1k → 3k
UPDATE "apartment" SET "type" = '3k', "layout_code" = NULL WHERE "id" = '2c923845-26a5-45d7-8736-8ab2d540694a';
-- Apartment #155: 1k → 2k
UPDATE "apartment" SET "type" = '2k', "layout_code" = NULL WHERE "id" = '12bb2e7e-cb2a-4429-add1-36fe690a16f6';
-- Apartment #156: 1k → 2k
UPDATE "apartment" SET "type" = '2k', "layout_code" = NULL WHERE "id" = '18789c64-8c62-440a-99f4-7e8818cde465';
-- Apartment #157: 2k → 1k
UPDATE "apartment" SET "type" = '1k', "layout_code" = NULL WHERE "id" = '37b781ea-88e5-4b0d-953b-69fcb059ba01';
-- Apartment #159: 1k → 2k
UPDATE "apartment" SET "type" = '2k', "layout_code" = NULL WHERE "id" = 'd2b23a89-e9b8-42a2-ae6f-36a0959126c3';
-- Apartment #164: 2k → 1k
UPDATE "apartment" SET "type" = '1k', "layout_code" = NULL WHERE "id" = '10c55fd6-9171-48e0-ba5b-fee39b10e5ce';
-- Apartment #165: 1k → 3k
UPDATE "apartment" SET "type" = '3k', "layout_code" = NULL WHERE "id" = 'abec63c7-309e-490c-9b85-944ed7a56510';
-- Apartment #166: 1k → 2k
UPDATE "apartment" SET "type" = '2k', "layout_code" = NULL WHERE "id" = 'b4263b43-81fc-4657-9189-e34ab1ae7c6e';
-- Apartment #169: 2k → 1k
UPDATE "apartment" SET "type" = '1k', "layout_code" = NULL WHERE "id" = 'fa01bd1e-8d4b-40fc-8e33-0dc78e997d05';
-- Apartment #172: 1k → 2k
UPDATE "apartment" SET "type" = '2k', "layout_code" = NULL WHERE "id" = '775939a8-f84c-4d20-91dd-15c94c97a5ab';
-- Apartment #176: 1k → 3k
UPDATE "apartment" SET "type" = '3k', "layout_code" = NULL WHERE "id" = 'cbdddb9d-e019-44ba-aecd-70eb3845be96';
-- Apartment #177: 1k → 2k
UPDATE "apartment" SET "type" = '2k', "layout_code" = NULL WHERE "id" = 'e508a996-286b-47d9-a844-4890e1215de6';
-- Apartment #178: 1k → 2k
UPDATE "apartment" SET "type" = '2k', "layout_code" = NULL WHERE "id" = '32254c1a-b8d2-4f0e-a8ce-b2f78c14081f';
-- Apartment #179: 2k → 1k
UPDATE "apartment" SET "type" = '1k', "layout_code" = NULL WHERE "id" = '7ff4a564-c201-495f-b12b-170ba1621730';
-- Apartment #181: 1k → 2k
UPDATE "apartment" SET "type" = '2k', "layout_code" = NULL WHERE "id" = '419a5212-3639-4d67-a298-10779b701b57';
-- Apartment #182: 2k → 1k
UPDATE "apartment" SET "type" = '1k', "layout_code" = NULL WHERE "id" = '82c4bf13-458c-46ef-a4a5-a8bfda350d5e';
-- Apartment #183: 1k → 2k
UPDATE "apartment" SET "type" = '2k', "layout_code" = NULL WHERE "id" = '724dfbc2-9613-4321-8d7e-2ce2dc5a31ab';
-- Apartment #187: 2k → 3k
UPDATE "apartment" SET "type" = '3k', "layout_code" = NULL WHERE "id" = 'c94ac6f8-a57a-4fc6-9335-7327a9288007';
-- Apartment #188: 1k → 2k
UPDATE "apartment" SET "type" = '2k', "layout_code" = NULL WHERE "id" = '13df593c-ddec-429a-a922-84586cd9d14b';
-- Apartment #189: 1k → 2k
UPDATE "apartment" SET "type" = '2k', "layout_code" = NULL WHERE "id" = '75734301-0ff0-47fd-b794-28079bf8df17';
-- Apartment #192: 1k → 2k
UPDATE "apartment" SET "type" = '2k', "layout_code" = NULL WHERE "id" = '85a74141-958d-4364-befa-d00a4949025f';
-- Apartment #197: 2k → 1k
UPDATE "apartment" SET "type" = '1k', "layout_code" = NULL WHERE "id" = 'd39cf135-20a6-4f71-afcd-7f66f5cd64ed';
-- Apartment #198: 1k → 3k
UPDATE "apartment" SET "type" = '3k', "layout_code" = NULL WHERE "id" = 'b485fe82-7c80-471b-b664-23d6930aaf11';
-- Apartment #200: 1k → 2k
UPDATE "apartment" SET "type" = '2k', "layout_code" = NULL WHERE "id" = 'ba1bb719-06cc-4271-869f-178acf09f734';
-- Apartment #203: 1k → 2k
UPDATE "apartment" SET "type" = '2k', "layout_code" = NULL WHERE "id" = 'e459db2f-42c8-4265-a046-def1ae2e71d5';
-- Apartment #205: 1k → 2k
UPDATE "apartment" SET "type" = '2k', "layout_code" = NULL WHERE "id" = 'fc8f68ae-d20e-452a-9956-d4a4828ede5d';
-- Apartment #209: 2k → 3k
UPDATE "apartment" SET "type" = '3k', "layout_code" = NULL WHERE "id" = 'de3e7537-e109-4bc5-bab6-6549f187464d';
-- Apartment #210: 1k → 2k
UPDATE "apartment" SET "type" = '2k', "layout_code" = NULL WHERE "id" = 'b04b11c9-3587-4d41-97e8-e530d31e86d4';
-- Apartment #211: 1k → 2k
UPDATE "apartment" SET "type" = '2k', "layout_code" = NULL WHERE "id" = 'd3f50326-f803-4d23-b3fb-8d9c65e304ea';
-- Apartment #212: 2k → 1k
UPDATE "apartment" SET "type" = '1k', "layout_code" = NULL WHERE "id" = '1f1a0c39-ca1e-41f7-aa97-02972c643066';
-- Apartment #214: 1k → 2k
UPDATE "apartment" SET "type" = '2k', "layout_code" = NULL WHERE "id" = '4e7d3969-abdd-4d05-b00a-83e2a574b9ea';
-- Apartment #216: 1k → 2k
UPDATE "apartment" SET "type" = '2k', "layout_code" = NULL WHERE "id" = 'b9393650-b874-4927-bbb2-795ea8b55ee8';
-- Apartment #217: 2k → 1k
UPDATE "apartment" SET "type" = '1k', "layout_code" = NULL WHERE "id" = 'cdc299a5-08df-43cf-af5f-09c1bde8048d';
-- Apartment #220: 1k → 3k
UPDATE "apartment" SET "type" = '3k', "layout_code" = NULL WHERE "id" = 'eb913802-faa7-49c6-8404-a2b21bba0a34';
-- Apartment #222: 1k → 2k
UPDATE "apartment" SET "type" = '2k', "layout_code" = NULL WHERE "id" = '477bdf05-687a-44bf-9955-c27f63cd2165';
-- Apartment #225: 1k → 2k
UPDATE "apartment" SET "type" = '2k', "layout_code" = NULL WHERE "id" = '601f9dcf-3e4b-4618-8002-5ee4557eff4d';
-- Apartment #231: 1k → 3k
UPDATE "apartment" SET "type" = '3k', "layout_code" = NULL WHERE "id" = '80b689c2-5061-4dad-b8db-619363da3a8d';
-- Apartment #232: 1k → 2k
UPDATE "apartment" SET "type" = '2k', "layout_code" = NULL WHERE "id" = 'd924bbf2-a290-4104-b25c-dee1472debcd';
-- Apartment #238: 1k → 2k
UPDATE "apartment" SET "type" = '2k', "layout_code" = NULL WHERE "id" = 'ed67a403-d301-423d-b86c-8ddedc96bd7f';
-- Apartment #243: 1k → 2k
UPDATE "apartment" SET "type" = '2k', "layout_code" = NULL WHERE "id" = 'd1ad6eaa-8c12-4f84-90ee-e88f2f76cb31';
-- Apartment #244: 1k → 2k
UPDATE "apartment" SET "type" = '2k', "layout_code" = NULL WHERE "id" = '94906466-def8-4c69-a80b-ddb7abf7f63d';
-- Apartment #249: 1k → 2k
UPDATE "apartment" SET "type" = '2k', "layout_code" = NULL WHERE "id" = 'd51f36c2-86ed-435a-b0fd-70f7b2efa53d';
-- Apartment #255: 1k → 2k
UPDATE "apartment" SET "type" = '2k', "layout_code" = NULL WHERE "id" = '5d48e144-72f3-43ea-b0ab-3c95d0c85941';
-- Apartment #258: 1k → 2k
UPDATE "apartment" SET "type" = '2k', "layout_code" = NULL WHERE "id" = 'ffb95d29-7288-4186-b18c-f0b2b9dcc5c6';
-- Apartment #264: 1k → 3k
UPDATE "apartment" SET "type" = '3k', "layout_code" = NULL WHERE "id" = 'fa1b990c-9273-4573-afe8-ea93597a1575';
-- Apartment #276: 1k → 2k
UPDATE "apartment" SET "type" = '2k', "layout_code" = NULL WHERE "id" = '93ea0f8c-37aa-41e7-a6a5-05c0c4401172';
-- Apartment #342: 3k → 2k
UPDATE "apartment" SET "type" = '2k', "layout_code" = NULL WHERE "id" = '603b03e1-effc-4982-815c-67bdbba0c11f';
-- Apartment #344: 3k → 1k
UPDATE "apartment" SET "type" = '1k', "layout_code" = NULL WHERE "id" = '704c39ba-2e8b-4993-9b7b-9d9192c9e728';
-- Apartment #401: 1k → 2k
UPDATE "apartment" SET "type" = '2k', "layout_code" = NULL WHERE "id" = '0445aff8-015f-4704-9ce9-fbe3484d435a';
-- Apartment #421: studio → 1k
UPDATE "apartment" SET "type" = '1k', "layout_code" = NULL WHERE "id" = 'de27042d-627b-46b9-8acd-fd93668c354a';
-- Apartment #423: 1k → 2k
UPDATE "apartment" SET "type" = '2k', "layout_code" = NULL WHERE "id" = 'b523d33d-6505-4b0c-b85b-9998fa8e880e';
-- Apartment #441: 1k → 2k
UPDATE "apartment" SET "type" = '2k', "layout_code" = NULL WHERE "id" = '6ff1daea-5c03-42c6-abfb-3ef70416587d';
-- Apartment #450: studio → 1k
UPDATE "apartment" SET "type" = '1k', "layout_code" = NULL WHERE "id" = 'fb912e14-af04-426e-be9e-ea40b5de1275';
-- Apartment #452: 1k → 2k
UPDATE "apartment" SET "type" = '2k', "layout_code" = NULL WHERE "id" = '07b4038c-a985-4ef5-b982-78c64492fa07';
-- Apartment #453: 1k → 2k
UPDATE "apartment" SET "type" = '2k', "layout_code" = NULL WHERE "id" = '9f9b1235-b2fd-4ac6-81a7-784167983e89';
-- Apartment #463: 1k → 2k
UPDATE "apartment" SET "type" = '2k', "layout_code" = NULL WHERE "id" = 'bcf1539c-b309-4f34-ad71-26c6c8492943';
-- Apartment #464: 1k → 2k
UPDATE "apartment" SET "type" = '2k', "layout_code" = NULL WHERE "id" = '9aa46463-f904-4e55-8353-3bc9ec1bb0aa';
-- Apartment #475: 1k → 2k
UPDATE "apartment" SET "type" = '2k', "layout_code" = NULL WHERE "id" = 'f3ddb2af-c748-4dae-b901-82565648b0d8';
-- Apartment #5: 1k → 2k
UPDATE "apartment" SET "type" = '2k', "layout_code" = NULL WHERE "id" = 'b10acd42-d2a8-43de-ad80-1bab385b22b5';
-- Apartment #7: 1k → 2k
UPDATE "apartment" SET "type" = '2k', "layout_code" = NULL WHERE "id" = '795f0ee6-7ec0-4df9-bc66-f63ae28578ba';
-- Apartment #11: 1k → 3k
UPDATE "apartment" SET "type" = '3k', "layout_code" = NULL WHERE "id" = '55fe2d50-26bc-4742-80ea-ab77c50150df';
-- Apartment #12: 1k → 2k
UPDATE "apartment" SET "type" = '2k', "layout_code" = NULL WHERE "id" = '3f5062f1-cb7b-4571-8597-d9352e3afdce';
-- Apartment #16: 1k → 2k
UPDATE "apartment" SET "type" = '2k', "layout_code" = NULL WHERE "id" = '9f0343f6-6c44-47c7-aa7c-7443b801ab27';
-- Apartment #17: 2k → 1k
UPDATE "apartment" SET "type" = '1k', "layout_code" = NULL WHERE "id" = 'a8a515e3-31f1-4744-8754-94da6397ded8';
-- Apartment #18: 1k → 2k
UPDATE "apartment" SET "type" = '2k', "layout_code" = NULL WHERE "id" = 'da049fd2-7e97-4058-8ddc-58496704dc90';
-- Apartment #20: 2k → 1k
UPDATE "apartment" SET "type" = '1k', "layout_code" = NULL WHERE "id" = '11cd9a1a-4c3c-4159-88dc-7f831123c341';
-- Apartment #22: 1k → 3k
UPDATE "apartment" SET "type" = '3k', "layout_code" = NULL WHERE "id" = '6b17af69-4ea1-4a72-b476-3b90ea62f5ab';
-- Apartment #24: 1k → 2k
UPDATE "apartment" SET "type" = '2k', "layout_code" = NULL WHERE "id" = 'b3177f6f-aa59-4383-aa0d-931fc7c887b4';
-- Apartment #27: 1k → 2k
UPDATE "apartment" SET "type" = '2k', "layout_code" = NULL WHERE "id" = 'abfe1842-df9e-4d3c-9be4-d98dd04aeadb';
-- Apartment #29: 1k → 2k
UPDATE "apartment" SET "type" = '2k', "layout_code" = NULL WHERE "id" = '21c4e07b-21e5-49c8-9c74-2dd63e72e625';
-- Apartment #31: 2k → 1k
UPDATE "apartment" SET "type" = '1k', "layout_code" = NULL WHERE "id" = '69934da0-b2c4-4edb-9d40-764ea030a6ef';
-- Apartment #33: 1k → 3k
UPDATE "apartment" SET "type" = '3k', "layout_code" = NULL WHERE "id" = 'ddeb5673-7ed6-4d73-ae58-7b68d857df59';
-- Apartment #34: 1k → 2k
UPDATE "apartment" SET "type" = '2k', "layout_code" = NULL WHERE "id" = 'd60fcead-d6c8-4d82-8a00-318a024dafaf';
-- Apartment #35: 1k → 2k
UPDATE "apartment" SET "type" = '2k', "layout_code" = NULL WHERE "id" = 'bbd0dab6-4cfb-4ced-ab6c-d4dcd48faa3d';
-- Apartment #37: 2k → 1k
UPDATE "apartment" SET "type" = '1k', "layout_code" = NULL WHERE "id" = '340f0ffd-017c-43f0-b00d-c94db0690f5b';
-- Apartment #40: 1k → 2k
UPDATE "apartment" SET "type" = '2k', "layout_code" = NULL WHERE "id" = 'c58b3eb1-0322-4a0a-8c2f-5936d56be7a4';
-- Apartment #41: 2k → 1k
UPDATE "apartment" SET "type" = '1k', "layout_code" = NULL WHERE "id" = 'b62d9686-1708-415c-96a5-d4ff866678b6';
-- Apartment #44: 2k → 3k
UPDATE "apartment" SET "type" = '3k', "layout_code" = NULL WHERE "id" = '03bbc08c-1e9a-49b1-b6bb-6f7d3c2455a9';
-- Apartment #45: 1k → 2k
UPDATE "apartment" SET "type" = '2k', "layout_code" = NULL WHERE "id" = 'cb416849-dc62-419f-b78f-26bec2d718f5';
-- Apartment #46: 1k → 2k
UPDATE "apartment" SET "type" = '2k', "layout_code" = NULL WHERE "id" = 'e9d85f76-1599-4eb1-99b0-d76ec8c87f5e';
-- Apartment #49: 1k → 2k
UPDATE "apartment" SET "type" = '2k', "layout_code" = NULL WHERE "id" = 'f410a7d6-c9e1-4c23-a6b5-c871f10aae4c';
-- Apartment #51: 1k → 2k
UPDATE "apartment" SET "type" = '2k', "layout_code" = NULL WHERE "id" = '940636e3-4afd-4017-8841-dcb423aa2033';
-- Apartment #55: 2k → 3k
UPDATE "apartment" SET "type" = '3k', "layout_code" = NULL WHERE "id" = '84a82f97-70c8-4dec-ae89-f4fefed11514';
-- Apartment #56: 1k → 2k
UPDATE "apartment" SET "type" = '2k', "layout_code" = NULL WHERE "id" = '95cd6831-21bc-41a7-b3e7-ce7cc82772e7';
-- Apartment #57: 1k → 2k
UPDATE "apartment" SET "type" = '2k', "layout_code" = NULL WHERE "id" = '37125bf2-27c6-4d60-b7a7-02502f985203';
-- Apartment #59: 2k → 1k
UPDATE "apartment" SET "type" = '1k', "layout_code" = NULL WHERE "id" = '79475a58-d7e2-47a1-8492-7aa3175647c4';
-- Apartment #60: 1k → 2k
UPDATE "apartment" SET "type" = '2k', "layout_code" = NULL WHERE "id" = 'da3964aa-adc5-41ff-beeb-2e3fca5d6d51';
-- Apartment #65: 2k → 1k
UPDATE "apartment" SET "type" = '1k', "layout_code" = NULL WHERE "id" = 'a0c3820b-2569-48fe-80ef-387262384181';
-- Apartment #66: 1k → 3k
UPDATE "apartment" SET "type" = '3k', "layout_code" = NULL WHERE "id" = '7afa13e9-6e0f-4805-94c8-43507135c9e8';
-- Apartment #67: 1k → 2k
UPDATE "apartment" SET "type" = '2k', "layout_code" = NULL WHERE "id" = 'cf3a4756-7441-41ff-9004-284adbb18cbf';
-- Apartment #68: 1k → 2k
UPDATE "apartment" SET "type" = '2k', "layout_code" = NULL WHERE "id" = '51a314e8-5614-4516-b20b-7fa75dd39f23';
-- Apartment #71: 1k → 2k
UPDATE "apartment" SET "type" = '2k', "layout_code" = NULL WHERE "id" = '1d4de826-f647-4366-b8b8-8210ef6f3f66';
-- Apartment #77: 1k → 3k
UPDATE "apartment" SET "type" = '3k', "layout_code" = NULL WHERE "id" = '82bb617d-58c0-4ca6-a7a4-b9f3120f0a76';
-- Apartment #78: 1k → 2k
UPDATE "apartment" SET "type" = '2k', "layout_code" = NULL WHERE "id" = 'f62d6f67-c702-409b-90fa-9811060f2314';
-- Apartment #79: 1k → 2k
UPDATE "apartment" SET "type" = '2k', "layout_code" = NULL WHERE "id" = '2f556ce8-c926-41bf-a2e6-1e75b0ac7b0a';
-- Apartment #80: 2k → 1k
UPDATE "apartment" SET "type" = '1k', "layout_code" = NULL WHERE "id" = '01e43cb1-7546-48f5-ab8a-b1c2db615061';
-- Apartment #82: 1k → 2k
UPDATE "apartment" SET "type" = '2k', "layout_code" = NULL WHERE "id" = 'cae4b08b-a927-45b0-96f8-5a4c1073f3e4';
-- Apartment #83: 2k → 1k
UPDATE "apartment" SET "type" = '1k', "layout_code" = NULL WHERE "id" = '81435567-51eb-468b-ab37-20982f0dace8';
-- Apartment #84: 1k → 2k
UPDATE "apartment" SET "type" = '2k', "layout_code" = NULL WHERE "id" = 'f10657bc-60e4-4744-8118-07cb15b54336';
-- Apartment #85: 2k → 1k
UPDATE "apartment" SET "type" = '1k', "layout_code" = NULL WHERE "id" = 'c03b0ece-b51b-434b-88dd-87c9810040d9';
-- Apartment #88: 1k → 3k
UPDATE "apartment" SET "type" = '3k', "layout_code" = NULL WHERE "id" = 'db01c715-dd60-45fd-9388-5b6514aaeb05';
-- Apartment #89: 1k → 2k
UPDATE "apartment" SET "type" = '2k', "layout_code" = NULL WHERE "id" = '39c1bf59-c179-4683-9220-2f30d661a169';
-- Apartment #90: 1k → 2k
UPDATE "apartment" SET "type" = '2k', "layout_code" = NULL WHERE "id" = 'd0f73766-f3ac-4531-9107-0e5645152150';
-- Apartment #93: 1k → 2k
UPDATE "apartment" SET "type" = '2k', "layout_code" = NULL WHERE "id" = '6a51b03e-e3c3-4905-8e1b-0f3f88f97080';
-- Apartment #98: 2k → 1k
UPDATE "apartment" SET "type" = '1k', "layout_code" = NULL WHERE "id" = 'e8a7b643-07c0-4c51-922a-aeed6fd47712';
-- Apartment #99: 1k → 3k
UPDATE "apartment" SET "type" = '3k', "layout_code" = NULL WHERE "id" = 'f93759e7-d467-4108-929e-df4496b9f777';
-- Apartment #111: 1k → 2k
UPDATE "apartment" SET "type" = '2k', "layout_code" = NULL WHERE "id" = '61001ff0-9dba-45b3-9607-1bb367c474c9';
-- Apartment #112: 1k → 2k
UPDATE "apartment" SET "type" = '2k', "layout_code" = NULL WHERE "id" = 'ffc24ab1-ee8b-4785-b28f-fe1f9320f30b';
-- Apartment #113: 2k → 1k
UPDATE "apartment" SET "type" = '1k', "layout_code" = NULL WHERE "id" = 'e3f53973-5be8-4e96-a8d5-4ccee4d5ad02';
-- Apartment #117: 1k → 2k
UPDATE "apartment" SET "type" = '2k', "layout_code" = NULL WHERE "id" = '19ffc391-17f6-4e06-9d4e-a6d2857044ae';
-- Apartment #121: 1k → 3k
UPDATE "apartment" SET "type" = '3k', "layout_code" = NULL WHERE "id" = '7759974f-2ec6-48b3-bc54-a15776270199';
-- Apartment #123: 1k → 2k
UPDATE "apartment" SET "type" = '2k', "layout_code" = NULL WHERE "id" = '5b2d3dec-bcf7-4049-9d5f-de7c2fef4d72';
-- Apartment #125: 2k → 1k
UPDATE "apartment" SET "type" = '1k', "layout_code" = NULL WHERE "id" = 'b175636a-c62c-4355-ba3d-c472327fc066';
-- Apartment #126: 1k → 2k
UPDATE "apartment" SET "type" = '2k', "layout_code" = NULL WHERE "id" = 'ba1ae3c9-fa96-4a84-9466-2ecbb93aa42d';
-- Apartment #132: 1k → 3k
UPDATE "apartment" SET "type" = '3k', "layout_code" = NULL WHERE "id" = 'd0fda2af-f3f3-48d2-b8f5-d312e2233a0b';
-- Apartment #139: 1k → 2k
UPDATE "apartment" SET "type" = '2k', "layout_code" = NULL WHERE "id" = '40f99731-e71b-4e35-9da1-623c0743b3ee';
-- Apartment #140: 2k → 1k
UPDATE "apartment" SET "type" = '1k', "layout_code" = NULL WHERE "id" = '24fc2bcc-c6a6-428d-ab06-b2d739e3e462';
-- Apartment #143: 1k → 3k
UPDATE "apartment" SET "type" = '3k', "layout_code" = NULL WHERE "id" = '9492cae1-db3e-4949-84bf-fb451141a97c';
-- Apartment #144: 1k → 2k
UPDATE "apartment" SET "type" = '2k', "layout_code" = NULL WHERE "id" = '02f33fb3-7fb3-43ee-9652-28428fab874a';
-- Apartment #148: 1k → 2k
UPDATE "apartment" SET "type" = '2k', "layout_code" = NULL WHERE "id" = '81ca5b95-c064-4f5f-b4a4-45e38dd5e359';
-- Apartment #149: 2k → 1k
UPDATE "apartment" SET "type" = '1k', "layout_code" = NULL WHERE "id" = '1effe1ba-d9e3-4f18-a626-deb63a7fdc3c';
-- Apartment #150: 1k → 2k
UPDATE "apartment" SET "type" = '2k', "layout_code" = NULL WHERE "id" = '4f6c122b-0380-48f3-9157-4928e11c2928';
-- Apartment #152: 2k → 1k
UPDATE "apartment" SET "type" = '1k', "layout_code" = NULL WHERE "id" = '70eb7da4-90e1-464c-b261-6ef7a794f171';
-- Apartment #154: 1k → 3k
UPDATE "apartment" SET "type" = '3k', "layout_code" = NULL WHERE "id" = '2c923845-26a5-45d7-8736-8ab2d540694a';
-- Apartment #155: 1k → 2k
UPDATE "apartment" SET "type" = '2k', "layout_code" = NULL WHERE "id" = '12bb2e7e-cb2a-4429-add1-36fe690a16f6';
-- Apartment #156: 1k → 2k
UPDATE "apartment" SET "type" = '2k', "layout_code" = NULL WHERE "id" = '18789c64-8c62-440a-99f4-7e8818cde465';
-- Apartment #157: 2k → 1k
UPDATE "apartment" SET "type" = '1k', "layout_code" = NULL WHERE "id" = '37b781ea-88e5-4b0d-953b-69fcb059ba01';
-- Apartment #159: 1k → 2k
UPDATE "apartment" SET "type" = '2k', "layout_code" = NULL WHERE "id" = 'd2b23a89-e9b8-42a2-ae6f-36a0959126c3';
-- Apartment #164: 2k → 1k
UPDATE "apartment" SET "type" = '1k', "layout_code" = NULL WHERE "id" = '10c55fd6-9171-48e0-ba5b-fee39b10e5ce';
-- Apartment #165: 1k → 3k
UPDATE "apartment" SET "type" = '3k', "layout_code" = NULL WHERE "id" = 'abec63c7-309e-490c-9b85-944ed7a56510';
-- Apartment #166: 1k → 2k
UPDATE "apartment" SET "type" = '2k', "layout_code" = NULL WHERE "id" = 'b4263b43-81fc-4657-9189-e34ab1ae7c6e';
-- Apartment #169: 2k → 1k
UPDATE "apartment" SET "type" = '1k', "layout_code" = NULL WHERE "id" = 'fa01bd1e-8d4b-40fc-8e33-0dc78e997d05';
-- Apartment #172: 1k → 2k
UPDATE "apartment" SET "type" = '2k', "layout_code" = NULL WHERE "id" = '775939a8-f84c-4d20-91dd-15c94c97a5ab';
-- Apartment #176: 1k → 3k
UPDATE "apartment" SET "type" = '3k', "layout_code" = NULL WHERE "id" = 'cbdddb9d-e019-44ba-aecd-70eb3845be96';
-- Apartment #177: 1k → 2k
UPDATE "apartment" SET "type" = '2k', "layout_code" = NULL WHERE "id" = 'e508a996-286b-47d9-a844-4890e1215de6';
-- Apartment #178: 1k → 2k
UPDATE "apartment" SET "type" = '2k', "layout_code" = NULL WHERE "id" = '32254c1a-b8d2-4f0e-a8ce-b2f78c14081f';
-- Apartment #179: 2k → 1k
UPDATE "apartment" SET "type" = '1k', "layout_code" = NULL WHERE "id" = '7ff4a564-c201-495f-b12b-170ba1621730';
-- Apartment #181: 1k → 2k
UPDATE "apartment" SET "type" = '2k', "layout_code" = NULL WHERE "id" = '419a5212-3639-4d67-a298-10779b701b57';
-- Apartment #182: 2k → 1k
UPDATE "apartment" SET "type" = '1k', "layout_code" = NULL WHERE "id" = '82c4bf13-458c-46ef-a4a5-a8bfda350d5e';
-- Apartment #183: 1k → 2k
UPDATE "apartment" SET "type" = '2k', "layout_code" = NULL WHERE "id" = '724dfbc2-9613-4321-8d7e-2ce2dc5a31ab';
-- Apartment #187: 2k → 3k
UPDATE "apartment" SET "type" = '3k', "layout_code" = NULL WHERE "id" = 'c94ac6f8-a57a-4fc6-9335-7327a9288007';
-- Apartment #188: 1k → 2k
UPDATE "apartment" SET "type" = '2k', "layout_code" = NULL WHERE "id" = '13df593c-ddec-429a-a922-84586cd9d14b';
-- Apartment #189: 1k → 2k
UPDATE "apartment" SET "type" = '2k', "layout_code" = NULL WHERE "id" = '75734301-0ff0-47fd-b794-28079bf8df17';
-- Apartment #192: 1k → 2k
UPDATE "apartment" SET "type" = '2k', "layout_code" = NULL WHERE "id" = '85a74141-958d-4364-befa-d00a4949025f';
-- Apartment #197: 2k → 1k
UPDATE "apartment" SET "type" = '1k', "layout_code" = NULL WHERE "id" = 'd39cf135-20a6-4f71-afcd-7f66f5cd64ed';
-- Apartment #198: 1k → 3k
UPDATE "apartment" SET "type" = '3k', "layout_code" = NULL WHERE "id" = 'b485fe82-7c80-471b-b664-23d6930aaf11';
-- Apartment #200: 1k → 2k
UPDATE "apartment" SET "type" = '2k', "layout_code" = NULL WHERE "id" = 'ba1bb719-06cc-4271-869f-178acf09f734';
-- Apartment #203: 1k → 2k
UPDATE "apartment" SET "type" = '2k', "layout_code" = NULL WHERE "id" = 'e459db2f-42c8-4265-a046-def1ae2e71d5';
-- Apartment #205: 1k → 2k
UPDATE "apartment" SET "type" = '2k', "layout_code" = NULL WHERE "id" = 'fc8f68ae-d20e-452a-9956-d4a4828ede5d';
-- Apartment #209: 2k → 3k
UPDATE "apartment" SET "type" = '3k', "layout_code" = NULL WHERE "id" = 'de3e7537-e109-4bc5-bab6-6549f187464d';
-- Apartment #210: 1k → 2k
UPDATE "apartment" SET "type" = '2k', "layout_code" = NULL WHERE "id" = 'b04b11c9-3587-4d41-97e8-e530d31e86d4';
-- Apartment #211: 1k → 2k
UPDATE "apartment" SET "type" = '2k', "layout_code" = NULL WHERE "id" = 'd3f50326-f803-4d23-b3fb-8d9c65e304ea';
-- Apartment #212: 2k → 1k
UPDATE "apartment" SET "type" = '1k', "layout_code" = NULL WHERE "id" = '1f1a0c39-ca1e-41f7-aa97-02972c643066';
-- Apartment #214: 1k → 2k
UPDATE "apartment" SET "type" = '2k', "layout_code" = NULL WHERE "id" = '4e7d3969-abdd-4d05-b00a-83e2a574b9ea';
-- Apartment #216: 1k → 2k
UPDATE "apartment" SET "type" = '2k', "layout_code" = NULL WHERE "id" = 'b9393650-b874-4927-bbb2-795ea8b55ee8';
-- Apartment #217: 2k → 1k
UPDATE "apartment" SET "type" = '1k', "layout_code" = NULL WHERE "id" = 'cdc299a5-08df-43cf-af5f-09c1bde8048d';
-- Apartment #220: 1k → 3k
UPDATE "apartment" SET "type" = '3k', "layout_code" = NULL WHERE "id" = 'eb913802-faa7-49c6-8404-a2b21bba0a34';
-- Apartment #222: 1k → 2k
UPDATE "apartment" SET "type" = '2k', "layout_code" = NULL WHERE "id" = '477bdf05-687a-44bf-9955-c27f63cd2165';
-- Apartment #225: 1k → 2k
UPDATE "apartment" SET "type" = '2k', "layout_code" = NULL WHERE "id" = '601f9dcf-3e4b-4618-8002-5ee4557eff4d';
-- Apartment #231: 1k → 3k
UPDATE "apartment" SET "type" = '3k', "layout_code" = NULL WHERE "id" = '80b689c2-5061-4dad-b8db-619363da3a8d';
-- Apartment #232: 1k → 2k
UPDATE "apartment" SET "type" = '2k', "layout_code" = NULL WHERE "id" = 'd924bbf2-a290-4104-b25c-dee1472debcd';
-- Apartment #238: 1k → 2k
UPDATE "apartment" SET "type" = '2k', "layout_code" = NULL WHERE "id" = 'ed67a403-d301-423d-b86c-8ddedc96bd7f';
-- Apartment #243: 1k → 2k
UPDATE "apartment" SET "type" = '2k', "layout_code" = NULL WHERE "id" = 'd1ad6eaa-8c12-4f84-90ee-e88f2f76cb31';
-- Apartment #244: 1k → 2k
UPDATE "apartment" SET "type" = '2k', "layout_code" = NULL WHERE "id" = '94906466-def8-4c69-a80b-ddb7abf7f63d';
-- Apartment #249: 1k → 2k
UPDATE "apartment" SET "type" = '2k', "layout_code" = NULL WHERE "id" = 'd51f36c2-86ed-435a-b0fd-70f7b2efa53d';
-- Apartment #255: 1k → 2k
UPDATE "apartment" SET "type" = '2k', "layout_code" = NULL WHERE "id" = '5d48e144-72f3-43ea-b0ab-3c95d0c85941';
-- Apartment #258: 1k → 2k
UPDATE "apartment" SET "type" = '2k', "layout_code" = NULL WHERE "id" = 'ffb95d29-7288-4186-b18c-f0b2b9dcc5c6';
-- Apartment #264: 1k → 3k
UPDATE "apartment" SET "type" = '3k', "layout_code" = NULL WHERE "id" = 'fa1b990c-9273-4573-afe8-ea93597a1575';
-- Apartment #276: 1k → 2k
UPDATE "apartment" SET "type" = '2k', "layout_code" = NULL WHERE "id" = '93ea0f8c-37aa-41e7-a6a5-05c0c4401172';
-- Apartment #2: 2k → 1k
UPDATE "apartment" SET "type" = '1k', "layout_code" = NULL WHERE "id" = '919b437b-a4b9-4f0c-b1c7-409dc019aee5';
-- Apartment #3: 1k → 2k
UPDATE "apartment" SET "type" = '2k', "layout_code" = NULL WHERE "id" = '25234b7d-346f-4c5c-864f-2f9682ea26bf';
-- Apartment #343: 2k → 1k
UPDATE "apartment" SET "type" = '1k', "layout_code" = NULL WHERE "id" = 'ecac906c-3337-48b9-ae6c-07d0e090f492';
-- Apartment #345: 1k → 2k
UPDATE "apartment" SET "type" = '2k', "layout_code" = NULL WHERE "id" = 'cf58cdfc-d70f-4379-a5d4-c748d45bf2d5';
-- Apartment #347: 1k → 2k
UPDATE "apartment" SET "type" = '2k', "layout_code" = NULL WHERE "id" = '23b6acb2-dcc1-4f3e-aeb4-9ead88226c5a';
-- Apartment #6: 1k → 2k
UPDATE "apartment" SET "type" = '2k', "layout_code" = NULL WHERE "id" = '7098370c-7809-401d-9212-32acb6a5adf8';
-- Apartment #9: 1k → 2k
UPDATE "apartment" SET "type" = '2k', "layout_code" = NULL WHERE "id" = 'bc9f3b7f-2997-485f-93e3-e18ea01e7309';
-- Apartment #10: 1k → 2k
UPDATE "apartment" SET "type" = '2k', "layout_code" = NULL WHERE "id" = 'bd8df84a-0a78-4f26-8d19-76b09723030d';
-- Apartment #16: 1k → 2k
UPDATE "apartment" SET "type" = '2k', "layout_code" = NULL WHERE "id" = '9f0343f6-6c44-47c7-aa7c-7443b801ab27';
-- Apartment #24: 1k → 2k
UPDATE "apartment" SET "type" = '2k', "layout_code" = NULL WHERE "id" = 'b3177f6f-aa59-4383-aa0d-931fc7c887b4';
-- Apartment #27: 1k → 2k
UPDATE "apartment" SET "type" = '2k', "layout_code" = NULL WHERE "id" = 'abfe1842-df9e-4d3c-9be4-d98dd04aeadb';
-- Apartment #30: 1k → 2k
UPDATE "apartment" SET "type" = '2k', "layout_code" = NULL WHERE "id" = '748f11c3-1284-4f16-b7ab-02f6a45c6a18';
-- Apartment #34: 1k → 2k
UPDATE "apartment" SET "type" = '2k', "layout_code" = NULL WHERE "id" = 'd60fcead-d6c8-4d82-8a00-318a024dafaf';
-- Apartment #45: 1k → 2k
UPDATE "apartment" SET "type" = '2k', "layout_code" = NULL WHERE "id" = 'cb416849-dc62-419f-b78f-26bec2d718f5';
-- Apartment #48: 1k → 2k
UPDATE "apartment" SET "type" = '2k', "layout_code" = NULL WHERE "id" = '88c96304-055d-4118-b3e0-a05467aa4089';
-- Apartment #51: 1k → 2k
UPDATE "apartment" SET "type" = '2k', "layout_code" = NULL WHERE "id" = '940636e3-4afd-4017-8841-dcb423aa2033';
-- Apartment #52: 1k → 2k
UPDATE "apartment" SET "type" = '2k', "layout_code" = NULL WHERE "id" = '564dc3bf-1e5d-4be8-a22f-499d28679874';
-- Apartment #58: 1k → 2k
UPDATE "apartment" SET "type" = '2k', "layout_code" = NULL WHERE "id" = '1c2420cb-d873-4af4-a520-3801b1e90e72';
-- Apartment #66: 1k → 2k
UPDATE "apartment" SET "type" = '2k', "layout_code" = NULL WHERE "id" = '7afa13e9-6e0f-4805-94c8-43507135c9e8';
-- Apartment #69: 1k → 2k
UPDATE "apartment" SET "type" = '2k', "layout_code" = NULL WHERE "id" = 'f2621aaf-e364-4ab8-9a61-e87c4c434a5f';
-- Apartment #72: 1k → 2k
UPDATE "apartment" SET "type" = '2k', "layout_code" = NULL WHERE "id" = '0c4354bd-8b37-4c9b-bab8-27e3568eb5d1';
-- Apartment #75: 1k → 2k
UPDATE "apartment" SET "type" = '2k', "layout_code" = NULL WHERE "id" = '91d6cd1a-4e5c-4584-8a9b-4a9aa94f906c';
-- Apartment #78: 1k → 2k
UPDATE "apartment" SET "type" = '2k', "layout_code" = NULL WHERE "id" = 'f62d6f67-c702-409b-90fa-9811060f2314';
-- Apartment #88: 1k → 2k
UPDATE "apartment" SET "type" = '2k', "layout_code" = NULL WHERE "id" = 'db01c715-dd60-45fd-9388-5b6514aaeb05';
-- Apartment #90: 1k → 2k
UPDATE "apartment" SET "type" = '2k', "layout_code" = NULL WHERE "id" = 'd0f73766-f3ac-4531-9107-0e5645152150';
-- Apartment #93: 1k → 2k
UPDATE "apartment" SET "type" = '2k', "layout_code" = NULL WHERE "id" = '6a51b03e-e3c3-4905-8e1b-0f3f88f97080';
-- Apartment #100: 1k → 2k
UPDATE "apartment" SET "type" = '2k', "layout_code" = NULL WHERE "id" = '839859a5-69ff-4cb3-80d2-c96380da6166';
-- Apartment #105: 1k → 2k
UPDATE "apartment" SET "type" = '2k', "layout_code" = NULL WHERE "id" = '8ee5fd2b-6db2-4db4-b353-9928be3b9544';
-- Apartment #108: 1k → 2k
UPDATE "apartment" SET "type" = '2k', "layout_code" = NULL WHERE "id" = '8e51a523-5d9b-40cd-b97e-1e1bbc344cef';
-- Apartment #118: 1k → 2k
UPDATE "apartment" SET "type" = '2k', "layout_code" = NULL WHERE "id" = '55cafc1b-4114-46e0-86ff-c156c3763af1';
-- Apartment #120: 1k → 2k
UPDATE "apartment" SET "type" = '2k', "layout_code" = NULL WHERE "id" = 'aff26f2a-fd54-487e-8302-fd9641d0f08c';
-- Apartment #122: 2k → 1k
UPDATE "apartment" SET "type" = '1k', "layout_code" = NULL WHERE "id" = 'c0f917e8-07d1-40a2-b7df-6c9071b1c6a2';
-- Apartment #123: 1k → 2k
UPDATE "apartment" SET "type" = '2k', "layout_code" = NULL WHERE "id" = '5b2d3dec-bcf7-4049-9d5f-de7c2fef4d72';
-- Apartment #129: 1k → 2k
UPDATE "apartment" SET "type" = '2k', "layout_code" = NULL WHERE "id" = '9a0e9e7c-ab32-43c0-8589-b30c192aeea5';
-- Apartment #132: 1k → 2k
UPDATE "apartment" SET "type" = '2k', "layout_code" = NULL WHERE "id" = 'd0fda2af-f3f3-48d2-b8f5-d312e2233a0b';
-- Apartment #134: 2k → 1k
UPDATE "apartment" SET "type" = '1k', "layout_code" = NULL WHERE "id" = '5283faed-8484-402e-91f2-2832bb76acf2';
-- Apartment #136: 1k → 2k
UPDATE "apartment" SET "type" = '2k', "layout_code" = NULL WHERE "id" = '89bbcf0f-806e-4083-a436-4de0826ef780';
-- Apartment #141: 1k → 2k
UPDATE "apartment" SET "type" = '2k', "layout_code" = NULL WHERE "id" = 'a8a2da12-cb4e-4749-94eb-584dfc667ef1';
-- Apartment #144: 1k → 2k
UPDATE "apartment" SET "type" = '2k', "layout_code" = NULL WHERE "id" = '02f33fb3-7fb3-43ee-9652-28428fab874a';
-- Apartment #148: 1k → 2k
UPDATE "apartment" SET "type" = '2k', "layout_code" = NULL WHERE "id" = '81ca5b95-c064-4f5f-b4a4-45e38dd5e359';
-- Apartment #153: 1k → 2k
UPDATE "apartment" SET "type" = '2k', "layout_code" = NULL WHERE "id" = '0b7de984-deac-4fec-a334-4dc034bb2080';
-- Apartment #156: 1k → 2k
UPDATE "apartment" SET "type" = '2k', "layout_code" = NULL WHERE "id" = '18789c64-8c62-440a-99f4-7e8818cde465';
-- Apartment #160: 1k → 2k
UPDATE "apartment" SET "type" = '2k', "layout_code" = NULL WHERE "id" = '6d3bd2d0-02d5-43e9-9b10-b3601878d0cf';
-- Apartment #165: 1k → 2k
UPDATE "apartment" SET "type" = '2k', "layout_code" = NULL WHERE "id" = 'abec63c7-309e-490c-9b85-944ed7a56510';
-- Apartment #170: 2k → 1k
UPDATE "apartment" SET "type" = '1k', "layout_code" = NULL WHERE "id" = '28b00d5b-7935-42d1-a5e2-2a767cb54837';
-- Apartment #172: 1k → 2k
UPDATE "apartment" SET "type" = '2k', "layout_code" = NULL WHERE "id" = '775939a8-f84c-4d20-91dd-15c94c97a5ab';
-- Apartment #174: 1k → 2k
UPDATE "apartment" SET "type" = '2k', "layout_code" = NULL WHERE "id" = 'da56668e-56ea-4a98-a3e8-b331eae5bec9';
-- Apartment #177: 1k → 2k
UPDATE "apartment" SET "type" = '2k', "layout_code" = NULL WHERE "id" = 'e508a996-286b-47d9-a844-4890e1215de6';
-- Apartment #184: 1k → 2k
UPDATE "apartment" SET "type" = '2k', "layout_code" = NULL WHERE "id" = '8a0e2ca4-4b81-49f5-a7c2-0b7131a837ea';
-- Apartment #189: 1k → 2k
UPDATE "apartment" SET "type" = '2k', "layout_code" = NULL WHERE "id" = '75734301-0ff0-47fd-b794-28079bf8df17';
-- Apartment #192: 1k → 2k
UPDATE "apartment" SET "type" = '2k', "layout_code" = NULL WHERE "id" = '85a74141-958d-4364-befa-d00a4949025f';
-- Apartment #202: 1k → 2k
UPDATE "apartment" SET "type" = '2k', "layout_code" = NULL WHERE "id" = 'dbe1808e-4881-4b9b-96db-f3837b59bb3f';
-- Apartment #204: 1k → 2k
UPDATE "apartment" SET "type" = '2k', "layout_code" = NULL WHERE "id" = 'a286acfe-80a4-428b-a7e1-ca0da9369e74';
-- Apartment #207: 1k → 2k
UPDATE "apartment" SET "type" = '2k', "layout_code" = NULL WHERE "id" = '05f3cd6f-7a4b-4f26-a562-5bc2a11a69b3';
-- Apartment #214: 1k → 2k
UPDATE "apartment" SET "type" = '2k', "layout_code" = NULL WHERE "id" = '4e7d3969-abdd-4d05-b00a-83e2a574b9ea';
-- Apartment #1: 2k → studio
UPDATE "apartment" SET "type" = 'studio', "layout_code" = '1/1к' WHERE "id" = '2d907659-0831-4063-a909-8920dd570974';
-- Apartment #2: 2k → 1k
UPDATE "apartment" SET "type" = '1k', "layout_code" = NULL WHERE "id" = '919b437b-a4b9-4f0c-b1c7-409dc019aee5';
-- Apartment #5: 1k → studio
UPDATE "apartment" SET "type" = 'studio', "layout_code" = NULL WHERE "id" = 'b10acd42-d2a8-43de-ad80-1bab385b22b5';
-- Apartment #7: 1k → 3k
UPDATE "apartment" SET "type" = '3k', "layout_code" = '7/7к' WHERE "id" = '795f0ee6-7ec0-4df9-bc66-f63ae28578ba';
-- Apartment #8: 1k → studio
UPDATE "apartment" SET "type" = 'studio', "layout_code" = NULL WHERE "id" = '6093cffe-99df-4e8d-8e3d-07b00b478c7c';
-- Apartment #11: 1k → 2k
UPDATE "apartment" SET "type" = '2k', "layout_code" = '11/1к' WHERE "id" = '55fe2d50-26bc-4742-80ea-ab77c50150df';
-- Apartment #343: 2k → 1k
UPDATE "apartment" SET "type" = '1k', "layout_code" = NULL WHERE "id" = 'ecac906c-3337-48b9-ae6c-07d0e090f492';
-- Apartment #345: 1k → 2k
UPDATE "apartment" SET "type" = '2k', "layout_code" = NULL WHERE "id" = 'cf58cdfc-d70f-4379-a5d4-c748d45bf2d5';
-- Apartment #347: 1k → 2k
UPDATE "apartment" SET "type" = '2k', "layout_code" = NULL WHERE "id" = '23b6acb2-dcc1-4f3e-aeb4-9ead88226c5a';
-- Apartment #13: 2k → studio
UPDATE "apartment" SET "type" = 'studio', "layout_code" = '1/1к' WHERE "id" = '7ef13fd0-3f2e-46c8-8d4a-530302b889ac';
-- Apartment #17: 2k → studio
UPDATE "apartment" SET "type" = 'studio', "layout_code" = NULL WHERE "id" = 'a8a515e3-31f1-4744-8754-94da6397ded8';
-- Apartment #19: 1k → 3k
UPDATE "apartment" SET "type" = '3k', "layout_code" = '7/7к' WHERE "id" = '73792bd3-8287-44f8-8e99-f5e2b857100e';
-- Apartment #20: 2k → studio
UPDATE "apartment" SET "type" = 'studio', "layout_code" = NULL WHERE "id" = '11cd9a1a-4c3c-4159-88dc-7f831123c341';
-- Apartment #23: 2k → 2k
UPDATE "apartment" SET "type" = '2k', "layout_code" = '11/1к' WHERE "id" = '24c67cf9-d143-45f3-a93c-dad82248c1c3';
-- Apartment #25: 1k → studio
UPDATE "apartment" SET "type" = 'studio', "layout_code" = '1/1к' WHERE "id" = 'a75e35c4-51e7-4aa8-a536-6d606c7660e0';
-- Apartment #29: 1k → studio
UPDATE "apartment" SET "type" = 'studio', "layout_code" = NULL WHERE "id" = '21c4e07b-21e5-49c8-9c74-2dd63e72e625';
-- Apartment #31: 2k → 3k
UPDATE "apartment" SET "type" = '3k', "layout_code" = '7/7к' WHERE "id" = '69934da0-b2c4-4edb-9d40-764ea030a6ef';
-- Apartment #32: 1k → studio
UPDATE "apartment" SET "type" = 'studio', "layout_code" = NULL WHERE "id" = 'a1ba168d-5952-402f-8c0f-840eb4314e55';
-- Apartment #35: 1k → 2k
UPDATE "apartment" SET "type" = '2k', "layout_code" = '11/1к' WHERE "id" = 'bbd0dab6-4cfb-4ced-ab6c-d4dcd48faa3d';
-- Apartment #37: 2k → studio
UPDATE "apartment" SET "type" = 'studio', "layout_code" = '1/1к' WHERE "id" = '340f0ffd-017c-43f0-b00d-c94db0690f5b';
-- Apartment #38: 2k → 1k
UPDATE "apartment" SET "type" = '1k', "layout_code" = NULL WHERE "id" = '598b9014-5de4-47c2-ac8e-0b7237dccdb9';
-- Apartment #41: 2k → studio
UPDATE "apartment" SET "type" = 'studio', "layout_code" = NULL WHERE "id" = 'b62d9686-1708-415c-96a5-d4ff866678b6';
-- Apartment #43: 1k → 3k
UPDATE "apartment" SET "type" = '3k', "layout_code" = '7/7к' WHERE "id" = 'd3324ac7-7816-4de3-be79-6967336d382c';
-- Apartment #44: 2k → studio
UPDATE "apartment" SET "type" = 'studio', "layout_code" = NULL WHERE "id" = '03bbc08c-1e9a-49b1-b6bb-6f7d3c2455a9';
-- Apartment #47: 1k → 2k
UPDATE "apartment" SET "type" = '2k', "layout_code" = '11/1к' WHERE "id" = '12e24d8b-79fc-4295-bc3e-927580e87016';
-- Apartment #49: 1k → studio
UPDATE "apartment" SET "type" = 'studio', "layout_code" = '1/1к' WHERE "id" = 'f410a7d6-c9e1-4c23-a6b5-c871f10aae4c';
-- Apartment #53: 1k → studio
UPDATE "apartment" SET "type" = 'studio', "layout_code" = NULL WHERE "id" = 'b1c5b884-2826-4a3f-a1d4-c09b2011c8a6';
-- Apartment #55: 2k → 3k
UPDATE "apartment" SET "type" = '3k', "layout_code" = '7/7к' WHERE "id" = '84a82f97-70c8-4dec-ae89-f4fefed11514';
-- Apartment #56: 1k → studio
UPDATE "apartment" SET "type" = 'studio', "layout_code" = NULL WHERE "id" = '95cd6831-21bc-41a7-b3e7-ce7cc82772e7';
-- Apartment #59: 2k → 2k
UPDATE "apartment" SET "type" = '2k', "layout_code" = '11/1к' WHERE "id" = '79475a58-d7e2-47a1-8492-7aa3175647c4';
-- Apartment #61: 1k → studio
UPDATE "apartment" SET "type" = 'studio', "layout_code" = '1/1к' WHERE "id" = '3670d856-f7c2-47ba-9fd8-1eee4381af08';
-- Apartment #62: 2k → 1k
UPDATE "apartment" SET "type" = '1k', "layout_code" = NULL WHERE "id" = '93bee616-d463-4be3-8a3b-4c5ab53ce0e8';
-- Apartment #65: 2k → studio
UPDATE "apartment" SET "type" = 'studio', "layout_code" = NULL WHERE "id" = 'a0c3820b-2569-48fe-80ef-387262384181';
-- Apartment #67: 1k → 3k
UPDATE "apartment" SET "type" = '3k', "layout_code" = '7/7к' WHERE "id" = 'cf3a4756-7441-41ff-9004-284adbb18cbf';
-- Apartment #68: 1k → studio
UPDATE "apartment" SET "type" = 'studio', "layout_code" = NULL WHERE "id" = '51a314e8-5614-4516-b20b-7fa75dd39f23';
-- Apartment #71: 1k → 2k
UPDATE "apartment" SET "type" = '2k', "layout_code" = '11/1к' WHERE "id" = '1d4de826-f647-4366-b8b8-8210ef6f3f66';
-- Apartment #73: 2k → studio
UPDATE "apartment" SET "type" = 'studio', "layout_code" = '1/1к' WHERE "id" = 'c2b8c924-d04a-4a5b-b138-e286b10719ab';
-- Apartment #77: 1k → studio
UPDATE "apartment" SET "type" = 'studio', "layout_code" = NULL WHERE "id" = '82bb617d-58c0-4ca6-a7a4-b9f3120f0a76';
-- Apartment #79: 1k → 3k
UPDATE "apartment" SET "type" = '3k', "layout_code" = '7/7к' WHERE "id" = '2f556ce8-c926-41bf-a2e6-1e75b0ac7b0a';
-- Apartment #80: 2k → studio
UPDATE "apartment" SET "type" = 'studio', "layout_code" = NULL WHERE "id" = '01e43cb1-7546-48f5-ab8a-b1c2db615061';
-- Apartment #83: 2k → 2k
UPDATE "apartment" SET "type" = '2k', "layout_code" = '11/1к' WHERE "id" = '81435567-51eb-468b-ab37-20982f0dace8';
-- Apartment #85: 2k → studio
UPDATE "apartment" SET "type" = 'studio', "layout_code" = '1/1к' WHERE "id" = 'c03b0ece-b51b-434b-88dd-87c9810040d9';
-- Apartment #89: 1k → studio
UPDATE "apartment" SET "type" = 'studio', "layout_code" = NULL WHERE "id" = '39c1bf59-c179-4683-9220-2f30d661a169';
-- Apartment #91: 1k → 3k
UPDATE "apartment" SET "type" = '3k', "layout_code" = '7/7к' WHERE "id" = 'cf401c16-aa9d-43af-8a02-8ac3a32410eb';
-- Apartment #92: 1k → studio
UPDATE "apartment" SET "type" = 'studio', "layout_code" = NULL WHERE "id" = '1f01200b-7578-43e9-a8ec-62c2dd634180';
-- Apartment #95: 2k → 2k
UPDATE "apartment" SET "type" = '2k', "layout_code" = '11/1к' WHERE "id" = '96cd222d-fd2e-496a-ad08-a997073042c4';
-- Apartment #97: 1k → studio
UPDATE "apartment" SET "type" = 'studio', "layout_code" = '1/1к' WHERE "id" = '79c400da-9287-4188-ba9f-f45a197e3440';
-- Apartment #98: 2k → 1k
UPDATE "apartment" SET "type" = '1k', "layout_code" = NULL WHERE "id" = 'e8a7b643-07c0-4c51-922a-aeed6fd47712';
-- Apartment #101: 1k → studio
UPDATE "apartment" SET "type" = 'studio', "layout_code" = NULL WHERE "id" = 'b88410dc-22bf-448a-ae0c-ca38fb444353';
-- Apartment #103: 2k → 3k
UPDATE "apartment" SET "type" = '3k', "layout_code" = '7/7к' WHERE "id" = '83fdb894-cb20-4bd3-8c14-63a32a15851a';
-- Apartment #104: 1k → studio
UPDATE "apartment" SET "type" = 'studio', "layout_code" = NULL WHERE "id" = 'f3310657-1026-44a8-bd61-0a4e7ae03efe';
-- Apartment #107: 1k → 2k
UPDATE "apartment" SET "type" = '2k', "layout_code" = '11/1к' WHERE "id" = '23eead86-6c17-4d95-8d5a-8c3dd94088ec';
-- Apartment #109: 1k → studio
UPDATE "apartment" SET "type" = 'studio', "layout_code" = '1/1к' WHERE "id" = 'd6cd7f29-8bce-4ec6-a4a8-005d3d3b4f64';
-- Apartment #110: 2k → 1k
UPDATE "apartment" SET "type" = '1k', "layout_code" = NULL WHERE "id" = '414d36d0-47c4-4e9f-a95d-95e553cd96dd';
-- Apartment #113: 2k → studio
UPDATE "apartment" SET "type" = 'studio', "layout_code" = NULL WHERE "id" = 'e3f53973-5be8-4e96-a8d5-4ccee4d5ad02';
-- Apartment #115: 2k → 3k
UPDATE "apartment" SET "type" = '3k', "layout_code" = '7/7к' WHERE "id" = '04055360-6c70-4670-9dd0-b587903fab59';
-- Apartment #116: 1k → studio
UPDATE "apartment" SET "type" = 'studio', "layout_code" = NULL WHERE "id" = '6fb83236-7cd1-49ce-a3ec-f1222c283117';
-- Apartment #119: 1k → 2k
UPDATE "apartment" SET "type" = '2k', "layout_code" = '11/1к' WHERE "id" = '3def0c8a-9eea-4356-a454-c9b9a8d09853';
-- Apartment #121: 1k → studio
UPDATE "apartment" SET "type" = 'studio', "layout_code" = '1/1к' WHERE "id" = '7759974f-2ec6-48b3-bc54-a15776270199';
-- Apartment #122: 2k → 1k
UPDATE "apartment" SET "type" = '1k', "layout_code" = NULL WHERE "id" = 'c0f917e8-07d1-40a2-b7df-6c9071b1c6a2';
-- Apartment #125: 2k → studio
UPDATE "apartment" SET "type" = 'studio', "layout_code" = NULL WHERE "id" = 'b175636a-c62c-4355-ba3d-c472327fc066';
-- Apartment #127: 1k → 3k
UPDATE "apartment" SET "type" = '3k', "layout_code" = '7/7к' WHERE "id" = 'ee88f440-78be-406b-9a42-b0be5342b398';
-- Apartment #128: 2k → studio
UPDATE "apartment" SET "type" = 'studio', "layout_code" = NULL WHERE "id" = '4dd6282c-8c92-4bd1-8c94-aa2bb5288c31';
-- Apartment #131: 1k → 2k
UPDATE "apartment" SET "type" = '2k', "layout_code" = '11/1к' WHERE "id" = 'c0a39111-2e2c-44ec-8c26-dd6bd2fa8603';
-- Apartment #133: 2k → studio
UPDATE "apartment" SET "type" = 'studio', "layout_code" = '1/1к' WHERE "id" = '80ca8947-898c-4812-9713-7dd4dcb4011f';
-- Apartment #134: 2k → 1k
UPDATE "apartment" SET "type" = '1k', "layout_code" = NULL WHERE "id" = '5283faed-8484-402e-91f2-2832bb76acf2';
-- Apartment #137: 2k → studio
UPDATE "apartment" SET "type" = 'studio', "layout_code" = NULL WHERE "id" = '4150e35c-b795-45b6-b821-34251dc72f1a';
-- Apartment #139: 1k → 3k
UPDATE "apartment" SET "type" = '3k', "layout_code" = '7/7к' WHERE "id" = '40f99731-e71b-4e35-9da1-623c0743b3ee';
-- Apartment #140: 2k → studio
UPDATE "apartment" SET "type" = 'studio', "layout_code" = NULL WHERE "id" = '24fc2bcc-c6a6-428d-ab06-b2d739e3e462';
-- Apartment #143: 1k → 2k
UPDATE "apartment" SET "type" = '2k', "layout_code" = '11/1к' WHERE "id" = '9492cae1-db3e-4949-84bf-fb451141a97c';
-- Apartment #145: 2k → studio
UPDATE "apartment" SET "type" = 'studio', "layout_code" = '1/1к' WHERE "id" = '218977af-665a-4e9e-986b-9fd8e29404a4';
-- Apartment #149: 2k → studio
UPDATE "apartment" SET "type" = 'studio', "layout_code" = NULL WHERE "id" = '1effe1ba-d9e3-4f18-a626-deb63a7fdc3c';
-- Apartment #151: 1k → 3k
UPDATE "apartment" SET "type" = '3k', "layout_code" = '7/7к' WHERE "id" = 'e7136790-44a0-40bd-b203-919509c50eac';
-- Apartment #152: 2k → studio
UPDATE "apartment" SET "type" = 'studio', "layout_code" = NULL WHERE "id" = '70eb7da4-90e1-464c-b261-6ef7a794f171';
-- Apartment #155: 1k → 2k
UPDATE "apartment" SET "type" = '2k', "layout_code" = '11/1к' WHERE "id" = '12bb2e7e-cb2a-4429-add1-36fe690a16f6';
-- Apartment #157: 2k → studio
UPDATE "apartment" SET "type" = 'studio', "layout_code" = '1/1к' WHERE "id" = '37b781ea-88e5-4b0d-953b-69fcb059ba01';
-- Apartment #161: 2k → studio
UPDATE "apartment" SET "type" = 'studio', "layout_code" = NULL WHERE "id" = 'c85969f7-efc3-4a98-8604-79694770a66e';
-- Apartment #163: 1k → 3k
UPDATE "apartment" SET "type" = '3k', "layout_code" = '7/7к' WHERE "id" = '6bf8f38a-2030-4638-ae34-0f0111a78326';
-- Apartment #164: 2k → studio
UPDATE "apartment" SET "type" = 'studio', "layout_code" = NULL WHERE "id" = '10c55fd6-9171-48e0-ba5b-fee39b10e5ce';
-- Apartment #167: 2k → 2k
UPDATE "apartment" SET "type" = '2k', "layout_code" = '11/1к' WHERE "id" = '34af3bbe-51e9-4e80-a373-d8828dc35ec2';
-- Apartment #169: 2k → studio
UPDATE "apartment" SET "type" = 'studio', "layout_code" = '1/1к' WHERE "id" = 'fa01bd1e-8d4b-40fc-8e33-0dc78e997d05';
-- Apartment #170: 2k → 1k
UPDATE "apartment" SET "type" = '1k', "layout_code" = NULL WHERE "id" = '28b00d5b-7935-42d1-a5e2-2a767cb54837';
-- Apartment #173: 1k → studio
UPDATE "apartment" SET "type" = 'studio', "layout_code" = NULL WHERE "id" = '301da940-c0f8-4a92-be05-229f2a62f04c';
-- Apartment #175: 1k → 3k
UPDATE "apartment" SET "type" = '3k', "layout_code" = '7/7к' WHERE "id" = 'e3dc9e6e-c0d0-4a33-a036-96800df3f2bc';
-- Apartment #176: 1k → studio
UPDATE "apartment" SET "type" = 'studio', "layout_code" = NULL WHERE "id" = 'cbdddb9d-e019-44ba-aecd-70eb3845be96';
-- Apartment #179: 2k → 2k
UPDATE "apartment" SET "type" = '2k', "layout_code" = '11/1к' WHERE "id" = '7ff4a564-c201-495f-b12b-170ba1621730';
-- Apartment #181: 1k → studio
UPDATE "apartment" SET "type" = 'studio', "layout_code" = '1/1к' WHERE "id" = '419a5212-3639-4d67-a298-10779b701b57';
-- Apartment #182: 2k → 1k
UPDATE "apartment" SET "type" = '1k', "layout_code" = NULL WHERE "id" = '82c4bf13-458c-46ef-a4a5-a8bfda350d5e';
-- Apartment #185: 1k → studio
UPDATE "apartment" SET "type" = 'studio', "layout_code" = NULL WHERE "id" = '8664b9fa-efde-48e6-989a-c542583b8977';
-- Apartment #187: 2k → 3k
UPDATE "apartment" SET "type" = '3k', "layout_code" = '7/7к' WHERE "id" = 'c94ac6f8-a57a-4fc6-9335-7327a9288007';
-- Apartment #188: 1k → studio
UPDATE "apartment" SET "type" = 'studio', "layout_code" = NULL WHERE "id" = '13df593c-ddec-429a-a922-84586cd9d14b';
-- Apartment #191: 1k → 2k
UPDATE "apartment" SET "type" = '2k', "layout_code" = '11/1к' WHERE "id" = '657ec250-ab2e-4bf4-a4a3-e4ce2a5181e8';
-- Apartment #193: 1k → studio
UPDATE "apartment" SET "type" = 'studio', "layout_code" = '1/1к' WHERE "id" = 'c79eee85-6136-42c9-8723-3cc44d94da56';
-- Apartment #194: 2k → 1k
UPDATE "apartment" SET "type" = '1k', "layout_code" = NULL WHERE "id" = 'd0a457bc-5ecf-4e9b-84fa-1492853e2cd3';
-- Apartment #197: 2k → studio
UPDATE "apartment" SET "type" = 'studio', "layout_code" = NULL WHERE "id" = 'd39cf135-20a6-4f71-afcd-7f66f5cd64ed';
-- Apartment #199: 2k → 3k
UPDATE "apartment" SET "type" = '3k', "layout_code" = '7/7к' WHERE "id" = 'd88b95a0-42bd-4118-acd3-854b19f3e754';
-- Apartment #200: 1k → studio
UPDATE "apartment" SET "type" = 'studio', "layout_code" = NULL WHERE "id" = 'ba1bb719-06cc-4271-869f-178acf09f734';
-- Apartment #203: 1k → 2k
UPDATE "apartment" SET "type" = '2k', "layout_code" = '11/1к' WHERE "id" = 'e459db2f-42c8-4265-a046-def1ae2e71d5';
-- Apartment #205: 1k → studio
UPDATE "apartment" SET "type" = 'studio', "layout_code" = '1/1к' WHERE "id" = 'fc8f68ae-d20e-452a-9956-d4a4828ede5d';
-- Apartment #209: 2k → studio
UPDATE "apartment" SET "type" = 'studio', "layout_code" = NULL WHERE "id" = 'de3e7537-e109-4bc5-bab6-6549f187464d';
-- Apartment #211: 1k → 3k
UPDATE "apartment" SET "type" = '3k', "layout_code" = '7/7к' WHERE "id" = 'd3f50326-f803-4d23-b3fb-8d9c65e304ea';
-- Apartment #212: 2k → studio
UPDATE "apartment" SET "type" = 'studio', "layout_code" = NULL WHERE "id" = '1f1a0c39-ca1e-41f7-aa97-02972c643066';
-- Apartment #215: 1k → 2k
UPDATE "apartment" SET "type" = '2k', "layout_code" = '11/1к' WHERE "id" = '56859828-eb40-4f18-91bd-38d4e20a904f';
-- Apartment #217: 2k → studio
UPDATE "apartment" SET "type" = 'studio', "layout_code" = '1/1к' WHERE "id" = 'cdc299a5-08df-43cf-af5f-09c1bde8048d';
-- Apartment #221: 2k → studio
UPDATE "apartment" SET "type" = 'studio', "layout_code" = NULL WHERE "id" = '4904321c-a861-4996-b073-b961ee4fa7ea';
-- Apartment #223: 1k → 3k
UPDATE "apartment" SET "type" = '3k', "layout_code" = '7/7к' WHERE "id" = '1e8a5c89-f21a-46d4-b204-4ca87d6a14fd';
-- Apartment #224: 1k → studio
UPDATE "apartment" SET "type" = 'studio', "layout_code" = NULL WHERE "id" = '7172fbb9-0ecc-4c8e-8964-ded4578fce8b';
-- Apartment #227: 2k → 2k
UPDATE "apartment" SET "type" = '2k', "layout_code" = '11/1к' WHERE "id" = '1b763319-83e5-420f-a687-4ec114baa960';
-- Apartment #229: 1k → studio
UPDATE "apartment" SET "type" = 'studio', "layout_code" = '1/1к' WHERE "id" = 'da4e7564-5f16-4660-8a1f-2835a34ec13c';
-- Apartment #233: 2k → studio
UPDATE "apartment" SET "type" = 'studio', "layout_code" = NULL WHERE "id" = 'c89a365d-f718-4a0a-8de4-ac57984af4b2';
-- Apartment #235: 1k → 3k
UPDATE "apartment" SET "type" = '3k', "layout_code" = '7/7к' WHERE "id" = '15ca6eb5-8b72-4e6d-a428-03009b64cf3b';
-- Apartment #236: 2k → studio
UPDATE "apartment" SET "type" = 'studio', "layout_code" = NULL WHERE "id" = '84ba3765-4b79-4ddc-b76a-d5fe1fcce79a';
-- Apartment #239: 1k → 2k
UPDATE "apartment" SET "type" = '2k', "layout_code" = '11/1к' WHERE "id" = 'b721ab99-c07a-4d3b-9203-2f8b7f5e7518';
-- Apartment #241: 1k → studio
UPDATE "apartment" SET "type" = 'studio', "layout_code" = '1/1к' WHERE "id" = 'f96d71f5-6213-485a-b234-f7e6efaec9a1';
-- Apartment #242: 3k → 1k
UPDATE "apartment" SET "type" = '1k', "layout_code" = NULL WHERE "id" = 'bf0f7390-f106-4114-b996-76609f54341c';
-- Apartment #245: 1k → studio
UPDATE "apartment" SET "type" = 'studio', "layout_code" = NULL WHERE "id" = '6cb3de24-8ac1-4493-ab3e-f74dd61c3102';
-- Apartment #247: 2k → 3k
UPDATE "apartment" SET "type" = '3k', "layout_code" = '7/7к' WHERE "id" = '158c3a58-8102-495a-b656-4806622617c6';
-- Apartment #248: 1k → studio
UPDATE "apartment" SET "type" = 'studio', "layout_code" = NULL WHERE "id" = '4338f1b4-7e4b-4a31-87bd-0232a34bc9cb';
-- Apartment #251: 1k → 2k
UPDATE "apartment" SET "type" = '2k', "layout_code" = '11/1к' WHERE "id" = '4ef4cbcb-467b-4a4b-81b8-a94ca5f0e000';
-- Apartment #253: 3k → studio
UPDATE "apartment" SET "type" = 'studio', "layout_code" = '1/1к' WHERE "id" = '35cfe1cb-8d9f-403b-a511-e78632668f9f';
-- Apartment #254: 2k → 1k
UPDATE "apartment" SET "type" = '1k', "layout_code" = NULL WHERE "id" = '32c01541-769c-48b7-89d1-bb43e89feeb1';
-- Apartment #257: 1k → studio
UPDATE "apartment" SET "type" = 'studio', "layout_code" = NULL WHERE "id" = '653b1aa9-f351-4e63-af1d-73de20805d68';
-- Apartment #259: 1k → 3k
UPDATE "apartment" SET "type" = '3k', "layout_code" = '7/7к' WHERE "id" = 'a7c14609-ac4b-49d3-8d93-96373eba5c21';
-- Apartment #260: 2k → studio
UPDATE "apartment" SET "type" = 'studio', "layout_code" = NULL WHERE "id" = '7492c7e5-e939-4754-ad33-ab3d6fcf4a59';
-- Apartment #263: 1k → 2k
UPDATE "apartment" SET "type" = '2k', "layout_code" = '11/1к' WHERE "id" = '80e1f654-1a0e-41a3-8407-75b51f56a080';
-- Apartment #265: 2k → studio
UPDATE "apartment" SET "type" = 'studio', "layout_code" = '1/1к' WHERE "id" = 'f22df18a-f1cb-4625-9769-c6f41bb05e88';
-- Apartment #266: 2k → 1k
UPDATE "apartment" SET "type" = '1k', "layout_code" = NULL WHERE "id" = 'b48f0706-bfcc-4ace-9e8a-37d2f463d603';
-- Apartment #269: 2k → studio
UPDATE "apartment" SET "type" = 'studio', "layout_code" = NULL WHERE "id" = '129b0c5a-745e-4f5e-acc2-ed8e8910647e';
-- Apartment #271: 2k → 3k
UPDATE "apartment" SET "type" = '3k', "layout_code" = '7/7к' WHERE "id" = 'a6e7d199-032d-4785-adb1-e7fae51e553c';
-- Apartment #272: 1k → studio
UPDATE "apartment" SET "type" = 'studio', "layout_code" = NULL WHERE "id" = '0dd48b95-6878-480c-b058-0de33f1cd473';
-- Apartment #275: 3k → 2k
UPDATE "apartment" SET "type" = '2k', "layout_code" = '11/1к' WHERE "id" = 'bff9546a-6485-4f85-be3f-4f892a3ee628';
-- Apartment #277: 2k → 1k
UPDATE "apartment" SET "type" = '1k', "layout_code" = NULL WHERE "id" = '9001e983-913d-4619-81e7-3fad921b99a8';
-- Apartment #278: 1k → studio
UPDATE "apartment" SET "type" = 'studio', "layout_code" = NULL WHERE "id" = '18561553-e276-42b0-a790-70e02f952dd6';
-- Apartment #280: 2k → 1k
UPDATE "apartment" SET "type" = '1k', "layout_code" = NULL WHERE "id" = '2f1eeb56-91a6-4c0b-ab11-bd554615a6a8';
-- Apartment #282: 2k → 3k
UPDATE "apartment" SET "type" = '3k', "layout_code" = '6/6к' WHERE "id" = 'a7abdb56-38f6-4ba9-8136-8ed167a8bf61';
-- Apartment #283: 1k → 3k
UPDATE "apartment" SET "type" = '3k', "layout_code" = '7/7к' WHERE "id" = '61616800-d7e8-4139-91ea-7b284efa093d';
-- Apartment #284: 1k → 2k
UPDATE "apartment" SET "type" = '2k', "layout_code" = '8/8к' WHERE "id" = '41d89178-faec-47f6-af55-da3cef79fdde';
-- Apartment #285: 1k → studio
UPDATE "apartment" SET "type" = 'studio', "layout_code" = NULL WHERE "id" = '8dd558ed-9c8f-4888-bd6a-a7ff05abbdb5';
-- Apartment #286: 3k → 2k
UPDATE "apartment" SET "type" = '2k', "layout_code" = NULL WHERE "id" = 'c70d5b89-b4b4-4d41-bf2a-d57dd1eb181e';
-- Apartment #287: 2k → 1k
UPDATE "apartment" SET "type" = '1k', "layout_code" = NULL WHERE "id" = '61fb57ea-330a-4cee-af95-233606ff8279';
-- Apartment #288: 2k → 1k
UPDATE "apartment" SET "type" = '1k', "layout_code" = NULL WHERE "id" = '587df5ec-3dd9-4d68-9df0-27814d4ef0b7';
-- Apartment #289: 1k → studio
UPDATE "apartment" SET "type" = 'studio', "layout_code" = NULL WHERE "id" = '41b11f2d-9d29-4420-afbb-813e49429e3f';
-- Apartment #291: 2k → 1k
UPDATE "apartment" SET "type" = '1k', "layout_code" = NULL WHERE "id" = '729ac27e-92b3-4f0a-a6d3-51e22669737c';
-- Apartment #293: 2k → 3k
UPDATE "apartment" SET "type" = '3k', "layout_code" = '6/6к' WHERE "id" = '3b0ef1fb-79ea-47b1-869d-5393261def0e';
-- Apartment #294: 1k → 3k
UPDATE "apartment" SET "type" = '3k', "layout_code" = '7/7к' WHERE "id" = 'a709c5e1-370c-45cc-b577-08d61f89ab93';
-- Apartment #295: 1k → 2k
UPDATE "apartment" SET "type" = '2k', "layout_code" = '8/8к' WHERE "id" = 'b3ab53be-1a61-4f94-80f9-78b02023fb4f';
-- Apartment #296: 1k → studio
UPDATE "apartment" SET "type" = 'studio', "layout_code" = NULL WHERE "id" = '4625d4cd-8e94-4168-85dd-0ff1e9a22636';
-- Apartment #297: 3k → 2k
UPDATE "apartment" SET "type" = '2k', "layout_code" = NULL WHERE "id" = '55c47331-180e-40c2-890e-aabfcbb356d0';
-- Apartment #298: 2k → 1k
UPDATE "apartment" SET "type" = '1k', "layout_code" = NULL WHERE "id" = 'c9f51666-e418-4ef7-b5da-29a91027a2cf';
-- Apartment #299: 2k → 1k
UPDATE "apartment" SET "type" = '1k', "layout_code" = NULL WHERE "id" = '97e99302-2415-41e4-8972-a5ad7faa799d';
-- Apartment #300: 1k → studio
UPDATE "apartment" SET "type" = 'studio', "layout_code" = NULL WHERE "id" = 'c28822f7-4507-4cab-8e60-cdc099a0e753';
-- Apartment #302: 2k → 1k
UPDATE "apartment" SET "type" = '1k', "layout_code" = NULL WHERE "id" = '40ed23bf-c18e-42ab-9737-96c7114a9735';
-- Apartment #304: 2k → 3k
UPDATE "apartment" SET "type" = '3k', "layout_code" = '6/6к' WHERE "id" = '2d1bef2d-4637-4092-b559-3e4a6add92b6';
-- Apartment #305: 1k → 3k
UPDATE "apartment" SET "type" = '3k', "layout_code" = '7/7к' WHERE "id" = 'fd560625-9bf6-46b3-817f-a382064e6def';
-- Apartment #306: 1k → 2k
UPDATE "apartment" SET "type" = '2k', "layout_code" = '8/8к' WHERE "id" = 'f95443c8-418a-4162-a0b0-68091a5e9b7f';
-- Apartment #307: 1k → studio
UPDATE "apartment" SET "type" = 'studio', "layout_code" = NULL WHERE "id" = '7511fde2-849e-4120-98d1-82dce955cded';
-- Apartment #308: 3k → 2k
UPDATE "apartment" SET "type" = '2k', "layout_code" = NULL WHERE "id" = '7dc01ecb-ce6b-433b-a873-ede223c341a1';
-- Apartment #309: 2k → 1k
UPDATE "apartment" SET "type" = '1k', "layout_code" = NULL WHERE "id" = 'fa1e14a7-a395-4ba4-bf3d-73fc5e663c51';
-- Apartment #310: 2k → 1k
UPDATE "apartment" SET "type" = '1k', "layout_code" = NULL WHERE "id" = '8fc625bb-0e6d-4855-a321-2d1ce086ed2b';
-- Apartment #311: 1k → studio
UPDATE "apartment" SET "type" = 'studio', "layout_code" = NULL WHERE "id" = '7e8f3ad2-e6e5-40fe-9ef5-5096d3856ff3';
-- Apartment #313: 2k → 1k
UPDATE "apartment" SET "type" = '1k', "layout_code" = NULL WHERE "id" = '95e51618-5ee4-4d14-92d7-e3735aeb45bb';
-- Apartment #315: 2k → 3k
UPDATE "apartment" SET "type" = '3k', "layout_code" = '6/6к' WHERE "id" = 'a89caa9e-c331-4bbc-bdb4-6abf60fc63fc';
-- Apartment #316: 1k → 3k
UPDATE "apartment" SET "type" = '3k', "layout_code" = '7/7к' WHERE "id" = 'b542d787-2bcd-45db-8004-51c4cd80eeba';
-- Apartment #317: 1k → 2k
UPDATE "apartment" SET "type" = '2k', "layout_code" = '8/8к' WHERE "id" = 'a6db7706-35cb-45e7-bafe-c79043428eb3';
-- Apartment #318: 1k → studio
UPDATE "apartment" SET "type" = 'studio', "layout_code" = NULL WHERE "id" = '08c60293-92f0-446c-b67a-0ede96c6a4b3';
-- Apartment #319: 3k → 2k
UPDATE "apartment" SET "type" = '2k', "layout_code" = NULL WHERE "id" = 'c112ffd7-1c80-4a3f-8b06-1401c14c4acc';
-- Apartment #320: 2k → 1k
UPDATE "apartment" SET "type" = '1k', "layout_code" = NULL WHERE "id" = '26c85520-f992-4d98-8505-d100f6e4e202';
-- Apartment #321: 2k → 1k
UPDATE "apartment" SET "type" = '1k', "layout_code" = NULL WHERE "id" = '4c13064f-ff87-4825-a819-cf4cff7ba2ac';
-- Apartment #322: 1k → studio
UPDATE "apartment" SET "type" = 'studio', "layout_code" = NULL WHERE "id" = '59beefcc-9895-40c3-a4db-eb44118d57e2';
-- Apartment #324: 2k → 1k
UPDATE "apartment" SET "type" = '1k', "layout_code" = NULL WHERE "id" = '88d70c40-6206-428a-a6ce-f83a1812eeae';
-- Apartment #326: 2k → 3k
UPDATE "apartment" SET "type" = '3k', "layout_code" = '6/6к' WHERE "id" = '79b7c91b-15e5-4838-bec2-fb840b4e22a8';
-- Apartment #327: 1k → 3k
UPDATE "apartment" SET "type" = '3k', "layout_code" = '7/7к' WHERE "id" = 'dbd58951-03a1-43f4-9379-1eda2977f460';
-- Apartment #328: 1k → 2k
UPDATE "apartment" SET "type" = '2k', "layout_code" = '8/8к' WHERE "id" = 'f14261d7-794c-4357-a292-7b5c13fc68ee';
-- Apartment #329: 1k → studio
UPDATE "apartment" SET "type" = 'studio', "layout_code" = NULL WHERE "id" = '8151a019-7d0d-4438-a0b0-8d552f7cda57';
-- Apartment #330: 3k → 2k
UPDATE "apartment" SET "type" = '2k', "layout_code" = NULL WHERE "id" = 'e6f12fa8-04d3-443f-936a-ff888422773a';
-- Apartment #331: 2k → 1k
UPDATE "apartment" SET "type" = '1k', "layout_code" = NULL WHERE "id" = '0d9aceb9-4aed-486a-8f14-86625b77d701';
-- Apartment #332: 2k → 1k
UPDATE "apartment" SET "type" = '1k', "layout_code" = NULL WHERE "id" = '712c89ce-3890-416a-a59e-1b9f9cd260d5';
-- Apartment #333: 1k → studio
UPDATE "apartment" SET "type" = 'studio', "layout_code" = NULL WHERE "id" = 'ae649b13-b780-4251-ad8b-a2e07ae04e67';
-- Apartment #335: 2k → 1k
UPDATE "apartment" SET "type" = '1k', "layout_code" = NULL WHERE "id" = '4d8bc57a-fc6f-4827-94ea-f92e89f3b5f2';
-- Apartment #337: 2k → 3k
UPDATE "apartment" SET "type" = '3k', "layout_code" = '6/6к' WHERE "id" = '3818ec0a-cbfa-499c-93ad-2390ab11b103';
-- Apartment #338: 1k → 3k
UPDATE "apartment" SET "type" = '3k', "layout_code" = '7/7к' WHERE "id" = 'd586cd30-5822-4a10-a479-1ccff48f2334';
-- Apartment #339: 1k → 2k
UPDATE "apartment" SET "type" = '2k', "layout_code" = '8/8к' WHERE "id" = '71d5df98-7978-4a79-88c3-c5587736c751';
-- Apartment #340: 1k → studio
UPDATE "apartment" SET "type" = 'studio', "layout_code" = NULL WHERE "id" = '70899aa3-9911-4eb4-b45f-1e9b5b2455d7';
-- Apartment #341: 3k → 2k
UPDATE "apartment" SET "type" = '2k', "layout_code" = NULL WHERE "id" = '6346dbb8-9de1-4e36-93b0-4a463c1e0241';
-- Apartment #342: 3k → 1k
UPDATE "apartment" SET "type" = '1k', "layout_code" = NULL WHERE "id" = '603b03e1-effc-4982-815c-67bdbba0c11f';
-- Apartment #343: 2k → 1k
UPDATE "apartment" SET "type" = '1k', "layout_code" = NULL WHERE "id" = 'ecac906c-3337-48b9-ae6c-07d0e090f492';
-- Apartment #344: 3k → studio
UPDATE "apartment" SET "type" = 'studio', "layout_code" = NULL WHERE "id" = '704c39ba-2e8b-4993-9b7b-9d9192c9e728';
-- Apartment #346: 2k → 1k
UPDATE "apartment" SET "type" = '1k', "layout_code" = NULL WHERE "id" = 'eb908f17-3d54-4929-be4e-6ac5dc6d9497';
-- Apartment #348: 2k → 3k
UPDATE "apartment" SET "type" = '3k', "layout_code" = '6/6к' WHERE "id" = 'cf12f2b5-6b81-42a6-b1bf-134a7a6db01e';
-- Apartment #349: 1k → 3k
UPDATE "apartment" SET "type" = '3k', "layout_code" = '7/7к' WHERE "id" = 'd802d0ea-9fed-4b16-b29d-57f12d696e75';
-- Apartment #350: 1k → 2k
UPDATE "apartment" SET "type" = '2k', "layout_code" = '8/8к' WHERE "id" = '9365e986-f940-426d-a9a2-2ff26cb52b3a';
-- Apartment #351: 1k → studio
UPDATE "apartment" SET "type" = 'studio', "layout_code" = NULL WHERE "id" = '1fb90c54-cede-4ed9-ad68-f58939e6d669';
-- Apartment #352: 3k → 2k
UPDATE "apartment" SET "type" = '2k', "layout_code" = NULL WHERE "id" = '79786c06-b991-4407-acca-641306caa8e6';
-- Apartment #353: 2k → 1k
UPDATE "apartment" SET "type" = '1k', "layout_code" = NULL WHERE "id" = '193fc6af-1f11-4744-9414-505ce6c3c462';
-- Apartment #354: 2k → 1k
UPDATE "apartment" SET "type" = '1k', "layout_code" = NULL WHERE "id" = '0cc64145-142e-4a2f-98f3-d2119fffdb87';
-- Apartment #355: 1k → studio
UPDATE "apartment" SET "type" = 'studio', "layout_code" = NULL WHERE "id" = 'b64feefe-1ce1-4489-8b5e-8bd0ddeca2af';
-- Apartment #357: 2k → 1k
UPDATE "apartment" SET "type" = '1k', "layout_code" = NULL WHERE "id" = '3ef9a52e-2866-428b-9e2f-007906d9ef68';
-- Apartment #359: 2k → 3k
UPDATE "apartment" SET "type" = '3k', "layout_code" = '6/6к' WHERE "id" = '331413e8-43a8-43bd-b206-7a554d16fe3e';
-- Apartment #360: 1k → 3k
UPDATE "apartment" SET "type" = '3k', "layout_code" = '7/7к' WHERE "id" = '5ab89660-9e28-4f33-bb66-1c08a79d1d2e';
-- Apartment #361: 1k → 2k
UPDATE "apartment" SET "type" = '2k', "layout_code" = '8/8к' WHERE "id" = '2e6f4297-7427-461a-b855-463f52c7073d';
-- Apartment #362: 1k → studio
UPDATE "apartment" SET "type" = 'studio', "layout_code" = NULL WHERE "id" = '96b9822b-9c7c-43c1-87e0-1ac07f3ed672';
-- Apartment #363: 3k → 2k
UPDATE "apartment" SET "type" = '2k', "layout_code" = NULL WHERE "id" = 'd39887fd-6dab-4064-98dd-d6ad112599e6';
-- Apartment #364: 2k → 1k
UPDATE "apartment" SET "type" = '1k', "layout_code" = NULL WHERE "id" = '23103307-7332-47ce-86c7-295cbd029fe3';
-- Apartment #365: 2k → 1k
UPDATE "apartment" SET "type" = '1k', "layout_code" = NULL WHERE "id" = 'a53e0399-f593-451b-9509-99c72c5b9ab2';
-- Apartment #366: 1k → studio
UPDATE "apartment" SET "type" = 'studio', "layout_code" = NULL WHERE "id" = '1b14ea1e-e339-47e0-bb61-572dc4469856';
-- Apartment #368: 2k → 1k
UPDATE "apartment" SET "type" = '1k', "layout_code" = NULL WHERE "id" = 'd719b65f-a5c7-4ee3-90c9-bffdcfc0a398';
-- Apartment #370: 2k → 3k
UPDATE "apartment" SET "type" = '3k', "layout_code" = '6/6к' WHERE "id" = 'ea26ee06-94b3-4400-a6a3-6a90896d314e';
-- Apartment #371: 1k → 3k
UPDATE "apartment" SET "type" = '3k', "layout_code" = '7/7к' WHERE "id" = 'f8da29bc-3796-4d14-bc2b-7fc5109e3939';
-- Apartment #372: 1k → 2k
UPDATE "apartment" SET "type" = '2k', "layout_code" = '8/8к' WHERE "id" = 'ac106041-0e70-40d3-a2bd-d90fa421e758';
-- Apartment #373: 1k → studio
UPDATE "apartment" SET "type" = 'studio', "layout_code" = NULL WHERE "id" = '961b9db0-1343-465b-84c8-542620b4bc5d';
-- Apartment #374: 3k → 2k
UPDATE "apartment" SET "type" = '2k', "layout_code" = NULL WHERE "id" = 'f05b8b89-9e5b-494d-8d7f-9956e9a85e65';
-- Apartment #375: 2k → 1k
UPDATE "apartment" SET "type" = '1k', "layout_code" = NULL WHERE "id" = '5b4120df-be19-47d1-bd13-088f2972cad4';
-- Apartment #376: 2k → 1k
UPDATE "apartment" SET "type" = '1k', "layout_code" = NULL WHERE "id" = '5c5c9588-f52a-44ab-b013-f0ad179141c6';
-- Apartment #377: 1k → studio
UPDATE "apartment" SET "type" = 'studio', "layout_code" = NULL WHERE "id" = '0754d504-d497-4ed8-a7e5-894163b59dd1';
-- Apartment #379: 2k → 1k
UPDATE "apartment" SET "type" = '1k', "layout_code" = NULL WHERE "id" = 'a95eb379-59df-4f57-926d-2eee19cda85a';
-- Apartment #381: 2k → 3k
UPDATE "apartment" SET "type" = '3k', "layout_code" = '6/6к' WHERE "id" = '7486a432-e6ee-46ce-8b26-ffb6d52f5432';
-- Apartment #382: 1k → 3k
UPDATE "apartment" SET "type" = '3k', "layout_code" = '7/7к' WHERE "id" = '749ee937-e0c3-4d7d-9c3a-1ebdcd56f6b8';
-- Apartment #383: 1k → 2k
UPDATE "apartment" SET "type" = '2k', "layout_code" = '8/8к' WHERE "id" = 'b3e3365d-4450-4993-a8af-96cb2dde958e';
-- Apartment #384: 1k → studio
UPDATE "apartment" SET "type" = 'studio', "layout_code" = NULL WHERE "id" = 'be752869-9019-46f3-b0ab-f4b4cbb80038';
-- Apartment #385: 3k → 2k
UPDATE "apartment" SET "type" = '2k', "layout_code" = NULL WHERE "id" = '0c32e053-915f-4b97-9d7e-e1e4511be37f';
-- Apartment #386: 2k → 1k
UPDATE "apartment" SET "type" = '1k', "layout_code" = NULL WHERE "id" = '34d9c50f-7484-4ca3-af7b-040b4fd00240';
-- Apartment #387: 2k → 1k
UPDATE "apartment" SET "type" = '1k', "layout_code" = NULL WHERE "id" = 'ec1b165c-df2b-41fe-b6ed-aa95d85af935';
-- Apartment #388: 1k → studio
UPDATE "apartment" SET "type" = 'studio', "layout_code" = NULL WHERE "id" = 'ed557164-4387-4715-ad39-91b72391e983';
-- Apartment #390: 2k → 1k
UPDATE "apartment" SET "type" = '1k', "layout_code" = NULL WHERE "id" = '8f20b5bd-2497-4441-b4d3-a54a5bfcbbc2';
-- Apartment #392: 2k → 3k
UPDATE "apartment" SET "type" = '3k', "layout_code" = '6/6к' WHERE "id" = 'fcd261e2-00fa-483d-aace-fc1d76273524';
-- Apartment #393: 1k → 3k
UPDATE "apartment" SET "type" = '3k', "layout_code" = '7/7к' WHERE "id" = '1817230e-62c3-48f4-9039-10fc89d6774e';
-- Apartment #394: 1k → 2k
UPDATE "apartment" SET "type" = '2k', "layout_code" = '8/8к' WHERE "id" = 'e1364cb4-b82d-40af-99df-d0c84fc9f095';
-- Apartment #395: 1k → studio
UPDATE "apartment" SET "type" = 'studio', "layout_code" = NULL WHERE "id" = 'c2e3c388-675b-42c1-9b13-46f4dcf350ba';
-- Apartment #396: 3k → 2k
UPDATE "apartment" SET "type" = '2k', "layout_code" = NULL WHERE "id" = 'b08ec2d3-a09e-4065-82a0-074fbc3ed7e4';
-- Apartment #397: 2k → 1k
UPDATE "apartment" SET "type" = '1k', "layout_code" = NULL WHERE "id" = '9e53138d-e3ac-4761-8e01-8c5b7f76d591';
-- Apartment #398: 2k → 1k
UPDATE "apartment" SET "type" = '1k', "layout_code" = NULL WHERE "id" = 'fbf0010f-6d3c-4a8e-b303-19d3c0df04cd';
-- Apartment #399: 1k → studio
UPDATE "apartment" SET "type" = 'studio', "layout_code" = NULL WHERE "id" = 'e703c1c0-2cf3-4365-b62b-3d7e30ebcfbc';
-- Apartment #403: 2k → 3k
UPDATE "apartment" SET "type" = '3k', "layout_code" = '6/6к' WHERE "id" = '6b96530e-663a-4a70-80d4-00e2fed78dab';
-- Apartment #404: 1k → 3k
UPDATE "apartment" SET "type" = '3k', "layout_code" = '7/7к' WHERE "id" = '65369d0a-3de1-4759-8051-66324d60297f';
-- Apartment #405: 1k → 2k
UPDATE "apartment" SET "type" = '2k', "layout_code" = '8/8к' WHERE "id" = '34c7c54d-0f57-409a-ac26-c01d0da64650';
-- Apartment #406: 1k → studio
UPDATE "apartment" SET "type" = 'studio', "layout_code" = NULL WHERE "id" = 'ba3a8d1b-90d7-43c9-99a0-86037db3767f';
-- Apartment #407: 3k → 2k
UPDATE "apartment" SET "type" = '2k', "layout_code" = NULL WHERE "id" = 'd8d84269-d4cc-4ccf-a316-1a52f8a1abe9';
-- Apartment #408: 2k → 1k
UPDATE "apartment" SET "type" = '1k', "layout_code" = NULL WHERE "id" = 'cf3a8611-2309-489a-a18c-d7016ba6fa9f';
-- Apartment #409: 2k → 1k
UPDATE "apartment" SET "type" = '1k', "layout_code" = NULL WHERE "id" = 'db9a8eca-1d08-4bbe-84f3-4c930978dea6';
-- Apartment #410: 1k → studio
UPDATE "apartment" SET "type" = 'studio', "layout_code" = NULL WHERE "id" = '565568cd-1411-4765-bfdf-6df9271c162d';
-- Apartment #412: 2k → 1k
UPDATE "apartment" SET "type" = '1k', "layout_code" = NULL WHERE "id" = '2ab492f1-0357-4cd5-adac-7efb18020467';
-- Apartment #414: 2k → 3k
UPDATE "apartment" SET "type" = '3k', "layout_code" = '6/6к' WHERE "id" = '22a4b668-ec8d-4eb1-ad77-e6356a4fb77f';
-- Apartment #415: 1k → 3k
UPDATE "apartment" SET "type" = '3k', "layout_code" = '7/7к' WHERE "id" = '162b162f-65f1-44b8-a554-cb72595e52b1';
-- Apartment #416: 1k → 2k
UPDATE "apartment" SET "type" = '2k', "layout_code" = '8/8к' WHERE "id" = '6b3d6d1d-fc86-4c66-b284-99893d3219ee';
-- Apartment #417: 1k → studio
UPDATE "apartment" SET "type" = 'studio', "layout_code" = NULL WHERE "id" = '6cf33c90-a63b-456b-aace-1c13a51d0f1c';
-- Apartment #418: 3k → 2k
UPDATE "apartment" SET "type" = '2k', "layout_code" = NULL WHERE "id" = '50b61b4d-a418-4c2b-b3a5-4d972b40535a';
-- Apartment #419: 2k → 1k
UPDATE "apartment" SET "type" = '1k', "layout_code" = NULL WHERE "id" = '36c47590-b76c-49c8-a910-888c9a8417ac';
-- Apartment #420: 2k → 1k
UPDATE "apartment" SET "type" = '1k', "layout_code" = NULL WHERE "id" = '5a9732cf-91ca-482c-a1f5-4ff0faa7af86';
-- Apartment #425: 2k → 3k
UPDATE "apartment" SET "type" = '3k', "layout_code" = '6/6к' WHERE "id" = '149ccb7a-2db7-4efd-93f9-15183a3a7db7';
-- Apartment #426: 1k → 3k
UPDATE "apartment" SET "type" = '3k', "layout_code" = '7/7к' WHERE "id" = 'e6d88f12-0f5d-4145-ac9a-c247b88644c6';
-- Apartment #427: 1k → 2k
UPDATE "apartment" SET "type" = '2k', "layout_code" = '8/8к' WHERE "id" = 'b14af35d-4d7a-49b1-818a-143b5857c472';
-- Apartment #428: 1k → studio
UPDATE "apartment" SET "type" = 'studio', "layout_code" = NULL WHERE "id" = '31d176a8-3d30-4295-99bb-ea43dcec0e10';
-- Apartment #429: 3k → 2k
UPDATE "apartment" SET "type" = '2k', "layout_code" = NULL WHERE "id" = '92df7d46-5812-4b08-bdf6-20fa81c11716';
-- Apartment #430: 2k → 1k
UPDATE "apartment" SET "type" = '1k', "layout_code" = NULL WHERE "id" = '54cbc214-f79e-4d0f-b928-ec0f12ab0d66';
-- Apartment #431: 2k → 1k
UPDATE "apartment" SET "type" = '1k', "layout_code" = NULL WHERE "id" = 'b132a92c-ea82-44f3-9ed1-faa51aed28e8';
-- Apartment #432: 1k → studio
UPDATE "apartment" SET "type" = 'studio', "layout_code" = NULL WHERE "id" = 'adf7c75b-1f3f-49f5-9f00-8751368da2cf';
-- Apartment #434: 2k → 1k
UPDATE "apartment" SET "type" = '1k', "layout_code" = NULL WHERE "id" = 'f860e0e5-75bf-4306-b401-e21d35da095b';
-- Apartment #436: 2k → 3k
UPDATE "apartment" SET "type" = '3k', "layout_code" = '6/6к' WHERE "id" = 'a4fbe0ea-c6e9-4376-ae17-6e580b954cfd';
-- Apartment #437: 1k → 3k
UPDATE "apartment" SET "type" = '3k', "layout_code" = '7/7к' WHERE "id" = '5d0669e3-b4d4-45e3-894f-6fe0b38f4189';
-- Apartment #438: 1k → 2k
UPDATE "apartment" SET "type" = '2k', "layout_code" = '8/8к' WHERE "id" = '2aca30ab-392b-4733-a4a0-1ecf0f9cf087';
-- Apartment #439: 1k → studio
UPDATE "apartment" SET "type" = 'studio', "layout_code" = NULL WHERE "id" = '17c0745c-fc00-462d-bfaa-4291006bf466';
-- Apartment #440: 3k → 2k
UPDATE "apartment" SET "type" = '2k', "layout_code" = NULL WHERE "id" = '740bd5ac-7cab-4d64-a014-b3558344dd07';
-- Apartment #442: 2k → 1k
UPDATE "apartment" SET "type" = '1k', "layout_code" = NULL WHERE "id" = '5d2d63ed-443c-425e-8a60-9f788941ccde';
-- Apartment #443: 1k → studio
UPDATE "apartment" SET "type" = 'studio', "layout_code" = NULL WHERE "id" = '6b6e7039-a4f0-4434-9aa6-88ff022386d3';
-- Apartment #445: 2k → 1k
UPDATE "apartment" SET "type" = '1k', "layout_code" = NULL WHERE "id" = '50fcdbc3-840b-42c5-891a-4310d9414360';
-- Apartment #447: 2k → 3k
UPDATE "apartment" SET "type" = '3k', "layout_code" = '6/6к' WHERE "id" = '7e7662f3-3b99-4974-841d-c59117374e63';
-- Apartment #448: 1k → 3k
UPDATE "apartment" SET "type" = '3k', "layout_code" = '7/7к' WHERE "id" = 'f5d92aa7-b195-44c4-83d6-33e967591450';
-- Apartment #449: 1k → 2k
UPDATE "apartment" SET "type" = '2k', "layout_code" = '8/8к' WHERE "id" = '22566a6d-082f-4852-8af9-265cd173a3f3';
-- Apartment #451: 3k → 2k
UPDATE "apartment" SET "type" = '2k', "layout_code" = NULL WHERE "id" = '5ecb277f-0ce3-49eb-8125-9923e0d14f14';
-- Apartment #454: 1k → studio
UPDATE "apartment" SET "type" = 'studio', "layout_code" = NULL WHERE "id" = 'a65da75c-8c45-46b0-9188-8c40627926e8';
-- Apartment #456: 2k → 1k
UPDATE "apartment" SET "type" = '1k', "layout_code" = NULL WHERE "id" = '8ca957e9-5eb8-42a9-8b10-4be5ee9aeeb2';
-- Apartment #458: 2k → 3k
UPDATE "apartment" SET "type" = '3k', "layout_code" = '6/6к' WHERE "id" = '878b7b04-463f-49fe-ba0c-b6ff98a36323';
-- Apartment #459: 1k → 3k
UPDATE "apartment" SET "type" = '3k', "layout_code" = '7/7к' WHERE "id" = 'd2b8f6e1-6f4d-4b2e-95b4-1e9ef0d1b9a6';
-- Apartment #460: 1k → 2k
UPDATE "apartment" SET "type" = '2k', "layout_code" = '8/8к' WHERE "id" = 'ca0d9cc5-efdd-47ea-9c7c-386419a6296e';
-- Apartment #461: 1k → studio
UPDATE "apartment" SET "type" = 'studio', "layout_code" = NULL WHERE "id" = '19fdf826-b374-453d-b5d9-4b21249605f8';
-- Apartment #462: 3k → 2k
UPDATE "apartment" SET "type" = '2k', "layout_code" = NULL WHERE "id" = 'c5be9cb1-c17a-41f8-8fbc-bb7010985cd2';
-- Apartment #465: 1k → studio
UPDATE "apartment" SET "type" = 'studio', "layout_code" = NULL WHERE "id" = '4274184d-ac36-461b-a22b-b3ee655368e0';
-- Apartment #467: 2k → 1k
UPDATE "apartment" SET "type" = '1k', "layout_code" = NULL WHERE "id" = '78385f67-3e4f-4f38-af51-3e600114baf2';
-- Apartment #469: 2k → 3k
UPDATE "apartment" SET "type" = '3k', "layout_code" = '6/6к' WHERE "id" = '565de2e0-2ffe-40ee-bc56-ce8feedd528b';
-- Apartment #470: 1k → 3k
UPDATE "apartment" SET "type" = '3k', "layout_code" = '7/7к' WHERE "id" = 'cd97e1f2-eb3e-4a32-b06f-f24bb6d14748';
-- Apartment #471: 1k → 2k
UPDATE "apartment" SET "type" = '2k', "layout_code" = '8/8к' WHERE "id" = 'c83418ac-11dc-444f-89a7-288ba4d1f321';
-- Apartment #472: 1k → studio
UPDATE "apartment" SET "type" = 'studio', "layout_code" = NULL WHERE "id" = 'eec7b5bf-5c8c-4113-a6c2-19498abd0e88';
-- Apartment #473: 3k → 2k
UPDATE "apartment" SET "type" = '2k', "layout_code" = NULL WHERE "id" = 'fd70a2f8-1e14-4e51-9c88-030d1d3a5aaa';
-- Apartment #474: 2k → 1k
UPDATE "apartment" SET "type" = '1k', "layout_code" = NULL WHERE "id" = 'f177431b-d32a-44f4-8b4f-be3ff1fbc620';
-- Apartment #476: 1k → studio
UPDATE "apartment" SET "type" = 'studio', "layout_code" = NULL WHERE "id" = 'abf632d8-0b61-4825-8c28-b0601494c2e3';
-- Apartment #478: 2k → 1k
UPDATE "apartment" SET "type" = '1k', "layout_code" = NULL WHERE "id" = '8608bad2-ead4-4877-afe1-4ab8e7f55f34';
-- Apartment #480: 2k → 3k
UPDATE "apartment" SET "type" = '3k', "layout_code" = '6/6к' WHERE "id" = '0c4cb162-b1a2-4974-8e50-dbf031b6f166';
-- Apartment #481: 1k → 3k
UPDATE "apartment" SET "type" = '3k', "layout_code" = '7/7к' WHERE "id" = '86749d25-154c-4880-bf41-8501999fd9ff';
-- Apartment #482: 1k → 2k
UPDATE "apartment" SET "type" = '2k', "layout_code" = '8/8к' WHERE "id" = '8f313def-1bbf-4325-88e3-f053301af980';
-- Apartment #483: 1k → studio
UPDATE "apartment" SET "type" = 'studio', "layout_code" = NULL WHERE "id" = '83300a1e-2ea9-4c4e-8c55-fd8354441d80';
-- Apartment #484: 3k → 2k
UPDATE "apartment" SET "type" = '2k', "layout_code" = NULL WHERE "id" = '23d79634-5a97-4673-89c6-c8bf818fe8e2';
-- Apartment #1: 2k → studio
UPDATE "apartment" SET "type" = 'studio', "layout_code" = '1/1к' WHERE "id" = '2d907659-0831-4063-a909-8920dd570974';
-- Apartment #2: 2k → 1k
UPDATE "apartment" SET "type" = '1k', "layout_code" = NULL WHERE "id" = '919b437b-a4b9-4f0c-b1c7-409dc019aee5';
-- Apartment #5: 1k → studio
UPDATE "apartment" SET "type" = 'studio', "layout_code" = NULL WHERE "id" = 'b10acd42-d2a8-43de-ad80-1bab385b22b5';
-- Apartment #7: 1k → 3k
UPDATE "apartment" SET "type" = '3k', "layout_code" = '7/7к' WHERE "id" = '795f0ee6-7ec0-4df9-bc66-f63ae28578ba';
-- Apartment #8: 1k → studio
UPDATE "apartment" SET "type" = 'studio', "layout_code" = NULL WHERE "id" = '6093cffe-99df-4e8d-8e3d-07b00b478c7c';
-- Apartment #11: 1k → 2k
UPDATE "apartment" SET "type" = '2k', "layout_code" = '11/1к' WHERE "id" = '55fe2d50-26bc-4742-80ea-ab77c50150df';
-- Apartment #13: 2k → studio
UPDATE "apartment" SET "type" = 'studio', "layout_code" = '1/1к' WHERE "id" = '7ef13fd0-3f2e-46c8-8d4a-530302b889ac';
-- Apartment #17: 2k → studio
UPDATE "apartment" SET "type" = 'studio', "layout_code" = NULL WHERE "id" = 'a8a515e3-31f1-4744-8754-94da6397ded8';
-- Apartment #19: 1k → 3k
UPDATE "apartment" SET "type" = '3k', "layout_code" = '7/7к' WHERE "id" = '73792bd3-8287-44f8-8e99-f5e2b857100e';
-- Apartment #20: 2k → studio
UPDATE "apartment" SET "type" = 'studio', "layout_code" = NULL WHERE "id" = '11cd9a1a-4c3c-4159-88dc-7f831123c341';
-- Apartment #23: 2k → 2k
UPDATE "apartment" SET "type" = '2k', "layout_code" = '11/1к' WHERE "id" = '24c67cf9-d143-45f3-a93c-dad82248c1c3';
-- Apartment #25: 1k → studio
UPDATE "apartment" SET "type" = 'studio', "layout_code" = '1/1к' WHERE "id" = 'a75e35c4-51e7-4aa8-a536-6d606c7660e0';
-- Apartment #29: 1k → studio
UPDATE "apartment" SET "type" = 'studio', "layout_code" = NULL WHERE "id" = '21c4e07b-21e5-49c8-9c74-2dd63e72e625';
-- Apartment #31: 2k → 3k
UPDATE "apartment" SET "type" = '3k', "layout_code" = '7/7к' WHERE "id" = '69934da0-b2c4-4edb-9d40-764ea030a6ef';
-- Apartment #32: 1k → studio
UPDATE "apartment" SET "type" = 'studio', "layout_code" = NULL WHERE "id" = 'a1ba168d-5952-402f-8c0f-840eb4314e55';
-- Apartment #35: 1k → 2k
UPDATE "apartment" SET "type" = '2k', "layout_code" = '11/1к' WHERE "id" = 'bbd0dab6-4cfb-4ced-ab6c-d4dcd48faa3d';
-- Apartment #37: 2k → studio
UPDATE "apartment" SET "type" = 'studio', "layout_code" = '1/1к' WHERE "id" = '340f0ffd-017c-43f0-b00d-c94db0690f5b';
-- Apartment #38: 2k → 1k
UPDATE "apartment" SET "type" = '1k', "layout_code" = NULL WHERE "id" = '598b9014-5de4-47c2-ac8e-0b7237dccdb9';
-- Apartment #41: 2k → studio
UPDATE "apartment" SET "type" = 'studio', "layout_code" = NULL WHERE "id" = 'b62d9686-1708-415c-96a5-d4ff866678b6';
-- Apartment #43: 1k → 3k
UPDATE "apartment" SET "type" = '3k', "layout_code" = '7/7к' WHERE "id" = 'd3324ac7-7816-4de3-be79-6967336d382c';
-- Apartment #44: 2k → studio
UPDATE "apartment" SET "type" = 'studio', "layout_code" = NULL WHERE "id" = '03bbc08c-1e9a-49b1-b6bb-6f7d3c2455a9';
-- Apartment #47: 1k → 2k
UPDATE "apartment" SET "type" = '2k', "layout_code" = '11/1к' WHERE "id" = '12e24d8b-79fc-4295-bc3e-927580e87016';
-- Apartment #49: 1k → studio
UPDATE "apartment" SET "type" = 'studio', "layout_code" = '1/1к' WHERE "id" = 'f410a7d6-c9e1-4c23-a6b5-c871f10aae4c';
-- Apartment #53: 1k → studio
UPDATE "apartment" SET "type" = 'studio', "layout_code" = NULL WHERE "id" = 'b1c5b884-2826-4a3f-a1d4-c09b2011c8a6';
-- Apartment #55: 2k → 3k
UPDATE "apartment" SET "type" = '3k', "layout_code" = '7/7к' WHERE "id" = '84a82f97-70c8-4dec-ae89-f4fefed11514';
-- Apartment #56: 1k → studio
UPDATE "apartment" SET "type" = 'studio', "layout_code" = NULL WHERE "id" = '95cd6831-21bc-41a7-b3e7-ce7cc82772e7';
-- Apartment #59: 2k → 2k
UPDATE "apartment" SET "type" = '2k', "layout_code" = '11/1к' WHERE "id" = '79475a58-d7e2-47a1-8492-7aa3175647c4';
-- Apartment #61: 1k → studio
UPDATE "apartment" SET "type" = 'studio', "layout_code" = '1/1к' WHERE "id" = '3670d856-f7c2-47ba-9fd8-1eee4381af08';
-- Apartment #62: 2k → 1k
UPDATE "apartment" SET "type" = '1k', "layout_code" = NULL WHERE "id" = '93bee616-d463-4be3-8a3b-4c5ab53ce0e8';
-- Apartment #65: 2k → studio
UPDATE "apartment" SET "type" = 'studio', "layout_code" = NULL WHERE "id" = 'a0c3820b-2569-48fe-80ef-387262384181';
-- Apartment #67: 1k → 3k
UPDATE "apartment" SET "type" = '3k', "layout_code" = '7/7к' WHERE "id" = 'cf3a4756-7441-41ff-9004-284adbb18cbf';
-- Apartment #68: 1k → studio
UPDATE "apartment" SET "type" = 'studio', "layout_code" = NULL WHERE "id" = '51a314e8-5614-4516-b20b-7fa75dd39f23';
-- Apartment #71: 1k → 2k
UPDATE "apartment" SET "type" = '2k', "layout_code" = '11/1к' WHERE "id" = '1d4de826-f647-4366-b8b8-8210ef6f3f66';
-- Apartment #73: 2k → studio
UPDATE "apartment" SET "type" = 'studio', "layout_code" = '1/1к' WHERE "id" = 'c2b8c924-d04a-4a5b-b138-e286b10719ab';
-- Apartment #77: 1k → studio
UPDATE "apartment" SET "type" = 'studio', "layout_code" = NULL WHERE "id" = '82bb617d-58c0-4ca6-a7a4-b9f3120f0a76';
-- Apartment #79: 1k → 3k
UPDATE "apartment" SET "type" = '3k', "layout_code" = '7/7к' WHERE "id" = '2f556ce8-c926-41bf-a2e6-1e75b0ac7b0a';
-- Apartment #80: 2k → studio
UPDATE "apartment" SET "type" = 'studio', "layout_code" = NULL WHERE "id" = '01e43cb1-7546-48f5-ab8a-b1c2db615061';
-- Apartment #83: 2k → 2k
UPDATE "apartment" SET "type" = '2k', "layout_code" = '11/1к' WHERE "id" = '81435567-51eb-468b-ab37-20982f0dace8';
-- Apartment #85: 2k → studio
UPDATE "apartment" SET "type" = 'studio', "layout_code" = '1/1к' WHERE "id" = 'c03b0ece-b51b-434b-88dd-87c9810040d9';
-- Apartment #89: 1k → studio
UPDATE "apartment" SET "type" = 'studio', "layout_code" = NULL WHERE "id" = '39c1bf59-c179-4683-9220-2f30d661a169';
-- Apartment #91: 1k → 3k
UPDATE "apartment" SET "type" = '3k', "layout_code" = '7/7к' WHERE "id" = 'cf401c16-aa9d-43af-8a02-8ac3a32410eb';
-- Apartment #92: 1k → studio
UPDATE "apartment" SET "type" = 'studio', "layout_code" = NULL WHERE "id" = '1f01200b-7578-43e9-a8ec-62c2dd634180';
-- Apartment #95: 2k → 2k
UPDATE "apartment" SET "type" = '2k', "layout_code" = '11/1к' WHERE "id" = '96cd222d-fd2e-496a-ad08-a997073042c4';
-- Apartment #97: 1k → studio
UPDATE "apartment" SET "type" = 'studio', "layout_code" = '1/1к' WHERE "id" = '79c400da-9287-4188-ba9f-f45a197e3440';
-- Apartment #98: 2k → 1k
UPDATE "apartment" SET "type" = '1k', "layout_code" = NULL WHERE "id" = 'e8a7b643-07c0-4c51-922a-aeed6fd47712';
-- Apartment #101: 1k → studio
UPDATE "apartment" SET "type" = 'studio', "layout_code" = NULL WHERE "id" = 'b88410dc-22bf-448a-ae0c-ca38fb444353';
-- Apartment #103: 2k → 3k
UPDATE "apartment" SET "type" = '3k', "layout_code" = '7/7к' WHERE "id" = '83fdb894-cb20-4bd3-8c14-63a32a15851a';
-- Apartment #104: 1k → studio
UPDATE "apartment" SET "type" = 'studio', "layout_code" = NULL WHERE "id" = 'f3310657-1026-44a8-bd61-0a4e7ae03efe';
-- Apartment #107: 1k → 2k
UPDATE "apartment" SET "type" = '2k', "layout_code" = '11/1к' WHERE "id" = '23eead86-6c17-4d95-8d5a-8c3dd94088ec';
-- Apartment #109: 1k → studio
UPDATE "apartment" SET "type" = 'studio', "layout_code" = '1/1к' WHERE "id" = 'd6cd7f29-8bce-4ec6-a4a8-005d3d3b4f64';
-- Apartment #110: 2k → 1k
UPDATE "apartment" SET "type" = '1k', "layout_code" = NULL WHERE "id" = '414d36d0-47c4-4e9f-a95d-95e553cd96dd';
-- Apartment #113: 2k → studio
UPDATE "apartment" SET "type" = 'studio', "layout_code" = NULL WHERE "id" = 'e3f53973-5be8-4e96-a8d5-4ccee4d5ad02';
-- Apartment #115: 2k → 3k
UPDATE "apartment" SET "type" = '3k', "layout_code" = '7/7к' WHERE "id" = '04055360-6c70-4670-9dd0-b587903fab59';
-- Apartment #116: 1k → studio
UPDATE "apartment" SET "type" = 'studio', "layout_code" = NULL WHERE "id" = '6fb83236-7cd1-49ce-a3ec-f1222c283117';
-- Apartment #119: 1k → 2k
UPDATE "apartment" SET "type" = '2k', "layout_code" = '11/1к' WHERE "id" = '3def0c8a-9eea-4356-a454-c9b9a8d09853';
-- Apartment #121: 1k → studio
UPDATE "apartment" SET "type" = 'studio', "layout_code" = '1/1к' WHERE "id" = '7759974f-2ec6-48b3-bc54-a15776270199';
-- Apartment #122: 2k → 1k
UPDATE "apartment" SET "type" = '1k', "layout_code" = NULL WHERE "id" = 'c0f917e8-07d1-40a2-b7df-6c9071b1c6a2';
-- Apartment #125: 2k → studio
UPDATE "apartment" SET "type" = 'studio', "layout_code" = NULL WHERE "id" = 'b175636a-c62c-4355-ba3d-c472327fc066';
-- Apartment #127: 1k → 3k
UPDATE "apartment" SET "type" = '3k', "layout_code" = '7/7к' WHERE "id" = 'ee88f440-78be-406b-9a42-b0be5342b398';
-- Apartment #128: 2k → studio
UPDATE "apartment" SET "type" = 'studio', "layout_code" = NULL WHERE "id" = '4dd6282c-8c92-4bd1-8c94-aa2bb5288c31';
-- Apartment #131: 1k → 2k
UPDATE "apartment" SET "type" = '2k', "layout_code" = '11/1к' WHERE "id" = 'c0a39111-2e2c-44ec-8c26-dd6bd2fa8603';
-- Apartment #133: 2k → studio
UPDATE "apartment" SET "type" = 'studio', "layout_code" = '1/1к' WHERE "id" = '80ca8947-898c-4812-9713-7dd4dcb4011f';
-- Apartment #134: 2k → 1k
UPDATE "apartment" SET "type" = '1k', "layout_code" = NULL WHERE "id" = '5283faed-8484-402e-91f2-2832bb76acf2';
-- Apartment #137: 2k → studio
UPDATE "apartment" SET "type" = 'studio', "layout_code" = NULL WHERE "id" = '4150e35c-b795-45b6-b821-34251dc72f1a';
-- Apartment #139: 1k → 3k
UPDATE "apartment" SET "type" = '3k', "layout_code" = '7/7к' WHERE "id" = '40f99731-e71b-4e35-9da1-623c0743b3ee';
-- Apartment #140: 2k → studio
UPDATE "apartment" SET "type" = 'studio', "layout_code" = NULL WHERE "id" = '24fc2bcc-c6a6-428d-ab06-b2d739e3e462';
-- Apartment #143: 1k → 2k
UPDATE "apartment" SET "type" = '2k', "layout_code" = '11/1к' WHERE "id" = '9492cae1-db3e-4949-84bf-fb451141a97c';
-- Apartment #145: 2k → studio
UPDATE "apartment" SET "type" = 'studio', "layout_code" = '1/1к' WHERE "id" = '218977af-665a-4e9e-986b-9fd8e29404a4';
-- Apartment #149: 2k → studio
UPDATE "apartment" SET "type" = 'studio', "layout_code" = NULL WHERE "id" = '1effe1ba-d9e3-4f18-a626-deb63a7fdc3c';
-- Apartment #151: 1k → 3k
UPDATE "apartment" SET "type" = '3k', "layout_code" = '7/7к' WHERE "id" = 'e7136790-44a0-40bd-b203-919509c50eac';
-- Apartment #152: 2k → studio
UPDATE "apartment" SET "type" = 'studio', "layout_code" = NULL WHERE "id" = '70eb7da4-90e1-464c-b261-6ef7a794f171';
-- Apartment #155: 1k → 2k
UPDATE "apartment" SET "type" = '2k', "layout_code" = '11/1к' WHERE "id" = '12bb2e7e-cb2a-4429-add1-36fe690a16f6';
-- Apartment #157: 2k → studio
UPDATE "apartment" SET "type" = 'studio', "layout_code" = '1/1к' WHERE "id" = '37b781ea-88e5-4b0d-953b-69fcb059ba01';
-- Apartment #161: 2k → studio
UPDATE "apartment" SET "type" = 'studio', "layout_code" = NULL WHERE "id" = 'c85969f7-efc3-4a98-8604-79694770a66e';
-- Apartment #163: 1k → 3k
UPDATE "apartment" SET "type" = '3k', "layout_code" = '7/7к' WHERE "id" = '6bf8f38a-2030-4638-ae34-0f0111a78326';
-- Apartment #164: 2k → studio
UPDATE "apartment" SET "type" = 'studio', "layout_code" = NULL WHERE "id" = '10c55fd6-9171-48e0-ba5b-fee39b10e5ce';
-- Apartment #167: 2k → 2k
UPDATE "apartment" SET "type" = '2k', "layout_code" = '11/1к' WHERE "id" = '34af3bbe-51e9-4e80-a373-d8828dc35ec2';
-- Apartment #169: 2k → studio
UPDATE "apartment" SET "type" = 'studio', "layout_code" = '1/1к' WHERE "id" = 'fa01bd1e-8d4b-40fc-8e33-0dc78e997d05';
-- Apartment #170: 2k → 1k
UPDATE "apartment" SET "type" = '1k', "layout_code" = NULL WHERE "id" = '28b00d5b-7935-42d1-a5e2-2a767cb54837';
-- Apartment #173: 1k → studio
UPDATE "apartment" SET "type" = 'studio', "layout_code" = NULL WHERE "id" = '301da940-c0f8-4a92-be05-229f2a62f04c';
-- Apartment #175: 1k → 3k
UPDATE "apartment" SET "type" = '3k', "layout_code" = '7/7к' WHERE "id" = 'e3dc9e6e-c0d0-4a33-a036-96800df3f2bc';
-- Apartment #176: 1k → studio
UPDATE "apartment" SET "type" = 'studio', "layout_code" = NULL WHERE "id" = 'cbdddb9d-e019-44ba-aecd-70eb3845be96';
-- Apartment #179: 2k → 2k
UPDATE "apartment" SET "type" = '2k', "layout_code" = '11/1к' WHERE "id" = '7ff4a564-c201-495f-b12b-170ba1621730';
-- Apartment #181: 1k → studio
UPDATE "apartment" SET "type" = 'studio', "layout_code" = '1/1к' WHERE "id" = '419a5212-3639-4d67-a298-10779b701b57';
-- Apartment #182: 2k → 1k
UPDATE "apartment" SET "type" = '1k', "layout_code" = NULL WHERE "id" = '82c4bf13-458c-46ef-a4a5-a8bfda350d5e';
-- Apartment #185: 1k → studio
UPDATE "apartment" SET "type" = 'studio', "layout_code" = NULL WHERE "id" = '8664b9fa-efde-48e6-989a-c542583b8977';
-- Apartment #187: 2k → 3k
UPDATE "apartment" SET "type" = '3k', "layout_code" = '7/7к' WHERE "id" = 'c94ac6f8-a57a-4fc6-9335-7327a9288007';
-- Apartment #188: 1k → studio
UPDATE "apartment" SET "type" = 'studio', "layout_code" = NULL WHERE "id" = '13df593c-ddec-429a-a922-84586cd9d14b';
-- Apartment #191: 1k → 2k
UPDATE "apartment" SET "type" = '2k', "layout_code" = '11/1к' WHERE "id" = '657ec250-ab2e-4bf4-a4a3-e4ce2a5181e8';
-- Apartment #193: 1k → studio
UPDATE "apartment" SET "type" = 'studio', "layout_code" = '1/1к' WHERE "id" = 'c79eee85-6136-42c9-8723-3cc44d94da56';
-- Apartment #194: 2k → 1k
UPDATE "apartment" SET "type" = '1k', "layout_code" = NULL WHERE "id" = 'd0a457bc-5ecf-4e9b-84fa-1492853e2cd3';
-- Apartment #197: 2k → studio
UPDATE "apartment" SET "type" = 'studio', "layout_code" = NULL WHERE "id" = 'd39cf135-20a6-4f71-afcd-7f66f5cd64ed';
-- Apartment #199: 2k → 3k
UPDATE "apartment" SET "type" = '3k', "layout_code" = '7/7к' WHERE "id" = 'd88b95a0-42bd-4118-acd3-854b19f3e754';
-- Apartment #200: 1k → studio
UPDATE "apartment" SET "type" = 'studio', "layout_code" = NULL WHERE "id" = 'ba1bb719-06cc-4271-869f-178acf09f734';
-- Apartment #203: 1k → 2k
UPDATE "apartment" SET "type" = '2k', "layout_code" = '11/1к' WHERE "id" = 'e459db2f-42c8-4265-a046-def1ae2e71d5';
-- Apartment #205: 1k → studio
UPDATE "apartment" SET "type" = 'studio', "layout_code" = '1/1к' WHERE "id" = 'fc8f68ae-d20e-452a-9956-d4a4828ede5d';
-- Apartment #209: 2k → studio
UPDATE "apartment" SET "type" = 'studio', "layout_code" = NULL WHERE "id" = 'de3e7537-e109-4bc5-bab6-6549f187464d';
-- Apartment #211: 1k → 3k
UPDATE "apartment" SET "type" = '3k', "layout_code" = '7/7к' WHERE "id" = 'd3f50326-f803-4d23-b3fb-8d9c65e304ea';
-- Apartment #212: 2k → studio
UPDATE "apartment" SET "type" = 'studio', "layout_code" = NULL WHERE "id" = '1f1a0c39-ca1e-41f7-aa97-02972c643066';
-- Apartment #215: 1k → 2k
UPDATE "apartment" SET "type" = '2k', "layout_code" = '11/1к' WHERE "id" = '56859828-eb40-4f18-91bd-38d4e20a904f';
-- Apartment #217: 2k → studio
UPDATE "apartment" SET "type" = 'studio', "layout_code" = '1/1к' WHERE "id" = 'cdc299a5-08df-43cf-af5f-09c1bde8048d';
-- Apartment #221: 2k → studio
UPDATE "apartment" SET "type" = 'studio', "layout_code" = NULL WHERE "id" = '4904321c-a861-4996-b073-b961ee4fa7ea';
-- Apartment #223: 1k → 3k
UPDATE "apartment" SET "type" = '3k', "layout_code" = '7/7к' WHERE "id" = '1e8a5c89-f21a-46d4-b204-4ca87d6a14fd';
-- Apartment #224: 1k → studio
UPDATE "apartment" SET "type" = 'studio', "layout_code" = NULL WHERE "id" = '7172fbb9-0ecc-4c8e-8964-ded4578fce8b';
-- Apartment #227: 2k → 2k
UPDATE "apartment" SET "type" = '2k', "layout_code" = '11/1к' WHERE "id" = '1b763319-83e5-420f-a687-4ec114baa960';
-- Apartment #229: 1k → studio
UPDATE "apartment" SET "type" = 'studio', "layout_code" = '1/1к' WHERE "id" = 'da4e7564-5f16-4660-8a1f-2835a34ec13c';
-- Apartment #233: 2k → studio
UPDATE "apartment" SET "type" = 'studio', "layout_code" = NULL WHERE "id" = 'c89a365d-f718-4a0a-8de4-ac57984af4b2';
-- Apartment #235: 1k → 3k
UPDATE "apartment" SET "type" = '3k', "layout_code" = '7/7к' WHERE "id" = '15ca6eb5-8b72-4e6d-a428-03009b64cf3b';
-- Apartment #236: 2k → studio
UPDATE "apartment" SET "type" = 'studio', "layout_code" = NULL WHERE "id" = '84ba3765-4b79-4ddc-b76a-d5fe1fcce79a';
-- Apartment #239: 1k → 2k
UPDATE "apartment" SET "type" = '2k', "layout_code" = '11/1к' WHERE "id" = 'b721ab99-c07a-4d3b-9203-2f8b7f5e7518';
-- Apartment #241: 1k → studio
UPDATE "apartment" SET "type" = 'studio', "layout_code" = '1/1к' WHERE "id" = 'f96d71f5-6213-485a-b234-f7e6efaec9a1';
-- Apartment #242: 3k → 1k
UPDATE "apartment" SET "type" = '1k', "layout_code" = NULL WHERE "id" = 'bf0f7390-f106-4114-b996-76609f54341c';
-- Apartment #245: 1k → studio
UPDATE "apartment" SET "type" = 'studio', "layout_code" = NULL WHERE "id" = '6cb3de24-8ac1-4493-ab3e-f74dd61c3102';
-- Apartment #247: 2k → 3k
UPDATE "apartment" SET "type" = '3k', "layout_code" = '7/7к' WHERE "id" = '158c3a58-8102-495a-b656-4806622617c6';
-- Apartment #248: 1k → studio
UPDATE "apartment" SET "type" = 'studio', "layout_code" = NULL WHERE "id" = '4338f1b4-7e4b-4a31-87bd-0232a34bc9cb';
-- Apartment #251: 1k → 2k
UPDATE "apartment" SET "type" = '2k', "layout_code" = '11/1к' WHERE "id" = '4ef4cbcb-467b-4a4b-81b8-a94ca5f0e000';
-- Apartment #253: 3k → studio
UPDATE "apartment" SET "type" = 'studio', "layout_code" = '1/1к' WHERE "id" = '35cfe1cb-8d9f-403b-a511-e78632668f9f';
-- Apartment #254: 2k → 1k
UPDATE "apartment" SET "type" = '1k', "layout_code" = NULL WHERE "id" = '32c01541-769c-48b7-89d1-bb43e89feeb1';
-- Apartment #257: 1k → studio
UPDATE "apartment" SET "type" = 'studio', "layout_code" = NULL WHERE "id" = '653b1aa9-f351-4e63-af1d-73de20805d68';
-- Apartment #259: 1k → 3k
UPDATE "apartment" SET "type" = '3k', "layout_code" = '7/7к' WHERE "id" = 'a7c14609-ac4b-49d3-8d93-96373eba5c21';
-- Apartment #260: 2k → studio
UPDATE "apartment" SET "type" = 'studio', "layout_code" = NULL WHERE "id" = '7492c7e5-e939-4754-ad33-ab3d6fcf4a59';
-- Apartment #263: 1k → 2k
UPDATE "apartment" SET "type" = '2k', "layout_code" = '11/1к' WHERE "id" = '80e1f654-1a0e-41a3-8407-75b51f56a080';
-- Apartment #265: 2k → studio
UPDATE "apartment" SET "type" = 'studio', "layout_code" = '1/1к' WHERE "id" = 'f22df18a-f1cb-4625-9769-c6f41bb05e88';
-- Apartment #266: 2k → 1k
UPDATE "apartment" SET "type" = '1k', "layout_code" = NULL WHERE "id" = 'b48f0706-bfcc-4ace-9e8a-37d2f463d603';
-- Apartment #269: 2k → studio
UPDATE "apartment" SET "type" = 'studio', "layout_code" = NULL WHERE "id" = '129b0c5a-745e-4f5e-acc2-ed8e8910647e';
-- Apartment #271: 2k → 3k
UPDATE "apartment" SET "type" = '3k', "layout_code" = '7/7к' WHERE "id" = 'a6e7d199-032d-4785-adb1-e7fae51e553c';
-- Apartment #272: 1k → studio
UPDATE "apartment" SET "type" = 'studio', "layout_code" = NULL WHERE "id" = '0dd48b95-6878-480c-b058-0de33f1cd473';
-- Apartment #275: 3k → 2k
UPDATE "apartment" SET "type" = '2k', "layout_code" = '11/1к' WHERE "id" = 'bff9546a-6485-4f85-be3f-4f892a3ee628';
-- Apartment #277: 2k → 1k
UPDATE "apartment" SET "type" = '1k', "layout_code" = NULL WHERE "id" = '9001e983-913d-4619-81e7-3fad921b99a8';
-- Apartment #278: 1k → studio
UPDATE "apartment" SET "type" = 'studio', "layout_code" = NULL WHERE "id" = '18561553-e276-42b0-a790-70e02f952dd6';
-- Apartment #280: 2k → 1k
UPDATE "apartment" SET "type" = '1k', "layout_code" = NULL WHERE "id" = '2f1eeb56-91a6-4c0b-ab11-bd554615a6a8';
-- Apartment #282: 2k → 3k
UPDATE "apartment" SET "type" = '3k', "layout_code" = '6/6к' WHERE "id" = 'a7abdb56-38f6-4ba9-8136-8ed167a8bf61';
-- Apartment #283: 1k → 3k
UPDATE "apartment" SET "type" = '3k', "layout_code" = '7/7к' WHERE "id" = '61616800-d7e8-4139-91ea-7b284efa093d';
-- Apartment #284: 1k → 2k
UPDATE "apartment" SET "type" = '2k', "layout_code" = '8/8к' WHERE "id" = '41d89178-faec-47f6-af55-da3cef79fdde';
-- Apartment #285: 1k → studio
UPDATE "apartment" SET "type" = 'studio', "layout_code" = NULL WHERE "id" = '8dd558ed-9c8f-4888-bd6a-a7ff05abbdb5';
-- Apartment #286: 3k → 2k
UPDATE "apartment" SET "type" = '2k', "layout_code" = NULL WHERE "id" = 'c70d5b89-b4b4-4d41-bf2a-d57dd1eb181e';
-- Apartment #287: 2k → 1k
UPDATE "apartment" SET "type" = '1k', "layout_code" = NULL WHERE "id" = '61fb57ea-330a-4cee-af95-233606ff8279';
-- Apartment #288: 2k → 1k
UPDATE "apartment" SET "type" = '1k', "layout_code" = NULL WHERE "id" = '587df5ec-3dd9-4d68-9df0-27814d4ef0b7';
-- Apartment #289: 1k → studio
UPDATE "apartment" SET "type" = 'studio', "layout_code" = NULL WHERE "id" = '41b11f2d-9d29-4420-afbb-813e49429e3f';
-- Apartment #291: 2k → 1k
UPDATE "apartment" SET "type" = '1k', "layout_code" = NULL WHERE "id" = '729ac27e-92b3-4f0a-a6d3-51e22669737c';
-- Apartment #293: 2k → 3k
UPDATE "apartment" SET "type" = '3k', "layout_code" = '6/6к' WHERE "id" = '3b0ef1fb-79ea-47b1-869d-5393261def0e';
-- Apartment #294: 1k → 3k
UPDATE "apartment" SET "type" = '3k', "layout_code" = '7/7к' WHERE "id" = 'a709c5e1-370c-45cc-b577-08d61f89ab93';
-- Apartment #295: 1k → 2k
UPDATE "apartment" SET "type" = '2k', "layout_code" = '8/8к' WHERE "id" = 'b3ab53be-1a61-4f94-80f9-78b02023fb4f';
-- Apartment #296: 1k → studio
UPDATE "apartment" SET "type" = 'studio', "layout_code" = NULL WHERE "id" = '4625d4cd-8e94-4168-85dd-0ff1e9a22636';
-- Apartment #297: 3k → 2k
UPDATE "apartment" SET "type" = '2k', "layout_code" = NULL WHERE "id" = '55c47331-180e-40c2-890e-aabfcbb356d0';
-- Apartment #298: 2k → 1k
UPDATE "apartment" SET "type" = '1k', "layout_code" = NULL WHERE "id" = 'c9f51666-e418-4ef7-b5da-29a91027a2cf';
-- Apartment #299: 2k → 1k
UPDATE "apartment" SET "type" = '1k', "layout_code" = NULL WHERE "id" = '97e99302-2415-41e4-8972-a5ad7faa799d';
-- Apartment #300: 1k → studio
UPDATE "apartment" SET "type" = 'studio', "layout_code" = NULL WHERE "id" = 'c28822f7-4507-4cab-8e60-cdc099a0e753';
-- Apartment #302: 2k → 1k
UPDATE "apartment" SET "type" = '1k', "layout_code" = NULL WHERE "id" = '40ed23bf-c18e-42ab-9737-96c7114a9735';
-- Apartment #304: 2k → 3k
UPDATE "apartment" SET "type" = '3k', "layout_code" = '6/6к' WHERE "id" = '2d1bef2d-4637-4092-b559-3e4a6add92b6';
-- Apartment #305: 1k → 3k
UPDATE "apartment" SET "type" = '3k', "layout_code" = '7/7к' WHERE "id" = 'fd560625-9bf6-46b3-817f-a382064e6def';
-- Apartment #306: 1k → 2k
UPDATE "apartment" SET "type" = '2k', "layout_code" = '8/8к' WHERE "id" = 'f95443c8-418a-4162-a0b0-68091a5e9b7f';
-- Apartment #307: 1k → studio
UPDATE "apartment" SET "type" = 'studio', "layout_code" = NULL WHERE "id" = '7511fde2-849e-4120-98d1-82dce955cded';
-- Apartment #308: 3k → 2k
UPDATE "apartment" SET "type" = '2k', "layout_code" = NULL WHERE "id" = '7dc01ecb-ce6b-433b-a873-ede223c341a1';
-- Apartment #309: 2k → 1k
UPDATE "apartment" SET "type" = '1k', "layout_code" = NULL WHERE "id" = 'fa1e14a7-a395-4ba4-bf3d-73fc5e663c51';
-- Apartment #310: 2k → 1k
UPDATE "apartment" SET "type" = '1k', "layout_code" = NULL WHERE "id" = '8fc625bb-0e6d-4855-a321-2d1ce086ed2b';
-- Apartment #311: 1k → studio
UPDATE "apartment" SET "type" = 'studio', "layout_code" = NULL WHERE "id" = '7e8f3ad2-e6e5-40fe-9ef5-5096d3856ff3';
-- Apartment #313: 2k → 1k
UPDATE "apartment" SET "type" = '1k', "layout_code" = NULL WHERE "id" = '95e51618-5ee4-4d14-92d7-e3735aeb45bb';
-- Apartment #315: 2k → 3k
UPDATE "apartment" SET "type" = '3k', "layout_code" = '6/6к' WHERE "id" = 'a89caa9e-c331-4bbc-bdb4-6abf60fc63fc';
-- Apartment #316: 1k → 3k
UPDATE "apartment" SET "type" = '3k', "layout_code" = '7/7к' WHERE "id" = 'b542d787-2bcd-45db-8004-51c4cd80eeba';
-- Apartment #317: 1k → 2k
UPDATE "apartment" SET "type" = '2k', "layout_code" = '8/8к' WHERE "id" = 'a6db7706-35cb-45e7-bafe-c79043428eb3';
-- Apartment #318: 1k → studio
UPDATE "apartment" SET "type" = 'studio', "layout_code" = NULL WHERE "id" = '08c60293-92f0-446c-b67a-0ede96c6a4b3';
-- Apartment #319: 3k → 2k
UPDATE "apartment" SET "type" = '2k', "layout_code" = NULL WHERE "id" = 'c112ffd7-1c80-4a3f-8b06-1401c14c4acc';
-- Apartment #320: 2k → 1k
UPDATE "apartment" SET "type" = '1k', "layout_code" = NULL WHERE "id" = '26c85520-f992-4d98-8505-d100f6e4e202';
-- Apartment #321: 2k → 1k
UPDATE "apartment" SET "type" = '1k', "layout_code" = NULL WHERE "id" = '4c13064f-ff87-4825-a819-cf4cff7ba2ac';
-- Apartment #322: 1k → studio
UPDATE "apartment" SET "type" = 'studio', "layout_code" = NULL WHERE "id" = '59beefcc-9895-40c3-a4db-eb44118d57e2';
-- Apartment #324: 2k → 1k
UPDATE "apartment" SET "type" = '1k', "layout_code" = NULL WHERE "id" = '88d70c40-6206-428a-a6ce-f83a1812eeae';
-- Apartment #326: 2k → 3k
UPDATE "apartment" SET "type" = '3k', "layout_code" = '6/6к' WHERE "id" = '79b7c91b-15e5-4838-bec2-fb840b4e22a8';
-- Apartment #327: 1k → 3k
UPDATE "apartment" SET "type" = '3k', "layout_code" = '7/7к' WHERE "id" = 'dbd58951-03a1-43f4-9379-1eda2977f460';
-- Apartment #328: 1k → 2k
UPDATE "apartment" SET "type" = '2k', "layout_code" = '8/8к' WHERE "id" = 'f14261d7-794c-4357-a292-7b5c13fc68ee';
-- Apartment #329: 1k → studio
UPDATE "apartment" SET "type" = 'studio', "layout_code" = NULL WHERE "id" = '8151a019-7d0d-4438-a0b0-8d552f7cda57';
-- Apartment #330: 3k → 2k
UPDATE "apartment" SET "type" = '2k', "layout_code" = NULL WHERE "id" = 'e6f12fa8-04d3-443f-936a-ff888422773a';
-- Apartment #331: 2k → 1k
UPDATE "apartment" SET "type" = '1k', "layout_code" = NULL WHERE "id" = '0d9aceb9-4aed-486a-8f14-86625b77d701';
-- Apartment #332: 2k → 1k
UPDATE "apartment" SET "type" = '1k', "layout_code" = NULL WHERE "id" = '712c89ce-3890-416a-a59e-1b9f9cd260d5';
-- Apartment #333: 1k → studio
UPDATE "apartment" SET "type" = 'studio', "layout_code" = NULL WHERE "id" = 'ae649b13-b780-4251-ad8b-a2e07ae04e67';
-- Apartment #335: 2k → 1k
UPDATE "apartment" SET "type" = '1k', "layout_code" = NULL WHERE "id" = '4d8bc57a-fc6f-4827-94ea-f92e89f3b5f2';
-- Apartment #337: 2k → 3k
UPDATE "apartment" SET "type" = '3k', "layout_code" = '6/6к' WHERE "id" = '3818ec0a-cbfa-499c-93ad-2390ab11b103';
-- Apartment #338: 1k → 3k
UPDATE "apartment" SET "type" = '3k', "layout_code" = '7/7к' WHERE "id" = 'd586cd30-5822-4a10-a479-1ccff48f2334';
-- Apartment #339: 1k → 2k
UPDATE "apartment" SET "type" = '2k', "layout_code" = '8/8к' WHERE "id" = '71d5df98-7978-4a79-88c3-c5587736c751';
-- Apartment #340: 1k → studio
UPDATE "apartment" SET "type" = 'studio', "layout_code" = NULL WHERE "id" = '70899aa3-9911-4eb4-b45f-1e9b5b2455d7';
-- Apartment #341: 3k → 2k
UPDATE "apartment" SET "type" = '2k', "layout_code" = NULL WHERE "id" = '6346dbb8-9de1-4e36-93b0-4a463c1e0241';
-- Apartment #342: 3k → 1k
UPDATE "apartment" SET "type" = '1k', "layout_code" = NULL WHERE "id" = '603b03e1-effc-4982-815c-67bdbba0c11f';
-- Apartment #343: 2k → 1k
UPDATE "apartment" SET "type" = '1k', "layout_code" = NULL WHERE "id" = 'ecac906c-3337-48b9-ae6c-07d0e090f492';
-- Apartment #344: 3k → studio
UPDATE "apartment" SET "type" = 'studio', "layout_code" = NULL WHERE "id" = '704c39ba-2e8b-4993-9b7b-9d9192c9e728';
-- Apartment #346: 2k → 1k
UPDATE "apartment" SET "type" = '1k', "layout_code" = NULL WHERE "id" = 'eb908f17-3d54-4929-be4e-6ac5dc6d9497';
-- Apartment #348: 2k → 3k
UPDATE "apartment" SET "type" = '3k', "layout_code" = '6/6к' WHERE "id" = 'cf12f2b5-6b81-42a6-b1bf-134a7a6db01e';
-- Apartment #349: 1k → 3k
UPDATE "apartment" SET "type" = '3k', "layout_code" = '7/7к' WHERE "id" = 'd802d0ea-9fed-4b16-b29d-57f12d696e75';
-- Apartment #350: 1k → 2k
UPDATE "apartment" SET "type" = '2k', "layout_code" = '8/8к' WHERE "id" = '9365e986-f940-426d-a9a2-2ff26cb52b3a';
-- Apartment #351: 1k → studio
UPDATE "apartment" SET "type" = 'studio', "layout_code" = NULL WHERE "id" = '1fb90c54-cede-4ed9-ad68-f58939e6d669';
-- Apartment #352: 3k → 2k
UPDATE "apartment" SET "type" = '2k', "layout_code" = NULL WHERE "id" = '79786c06-b991-4407-acca-641306caa8e6';
-- Apartment #353: 2k → 1k
UPDATE "apartment" SET "type" = '1k', "layout_code" = NULL WHERE "id" = '193fc6af-1f11-4744-9414-505ce6c3c462';
-- Apartment #354: 2k → 1k
UPDATE "apartment" SET "type" = '1k', "layout_code" = NULL WHERE "id" = '0cc64145-142e-4a2f-98f3-d2119fffdb87';
-- Apartment #355: 1k → studio
UPDATE "apartment" SET "type" = 'studio', "layout_code" = NULL WHERE "id" = 'b64feefe-1ce1-4489-8b5e-8bd0ddeca2af';
-- Apartment #357: 2k → 1k
UPDATE "apartment" SET "type" = '1k', "layout_code" = NULL WHERE "id" = '3ef9a52e-2866-428b-9e2f-007906d9ef68';
-- Apartment #359: 2k → 3k
UPDATE "apartment" SET "type" = '3k', "layout_code" = '6/6к' WHERE "id" = '331413e8-43a8-43bd-b206-7a554d16fe3e';
-- Apartment #360: 1k → 3k
UPDATE "apartment" SET "type" = '3k', "layout_code" = '7/7к' WHERE "id" = '5ab89660-9e28-4f33-bb66-1c08a79d1d2e';
-- Apartment #361: 1k → 2k
UPDATE "apartment" SET "type" = '2k', "layout_code" = '8/8к' WHERE "id" = '2e6f4297-7427-461a-b855-463f52c7073d';
-- Apartment #362: 1k → studio
UPDATE "apartment" SET "type" = 'studio', "layout_code" = NULL WHERE "id" = '96b9822b-9c7c-43c1-87e0-1ac07f3ed672';
-- Apartment #363: 3k → 2k
UPDATE "apartment" SET "type" = '2k', "layout_code" = NULL WHERE "id" = 'd39887fd-6dab-4064-98dd-d6ad112599e6';
-- Apartment #364: 2k → 1k
UPDATE "apartment" SET "type" = '1k', "layout_code" = NULL WHERE "id" = '23103307-7332-47ce-86c7-295cbd029fe3';
-- Apartment #365: 2k → 1k
UPDATE "apartment" SET "type" = '1k', "layout_code" = NULL WHERE "id" = 'a53e0399-f593-451b-9509-99c72c5b9ab2';
-- Apartment #366: 1k → studio
UPDATE "apartment" SET "type" = 'studio', "layout_code" = NULL WHERE "id" = '1b14ea1e-e339-47e0-bb61-572dc4469856';
-- Apartment #368: 2k → 1k
UPDATE "apartment" SET "type" = '1k', "layout_code" = NULL WHERE "id" = 'd719b65f-a5c7-4ee3-90c9-bffdcfc0a398';
-- Apartment #370: 2k → 3k
UPDATE "apartment" SET "type" = '3k', "layout_code" = '6/6к' WHERE "id" = 'ea26ee06-94b3-4400-a6a3-6a90896d314e';
-- Apartment #371: 1k → 3k
UPDATE "apartment" SET "type" = '3k', "layout_code" = '7/7к' WHERE "id" = 'f8da29bc-3796-4d14-bc2b-7fc5109e3939';
-- Apartment #372: 1k → 2k
UPDATE "apartment" SET "type" = '2k', "layout_code" = '8/8к' WHERE "id" = 'ac106041-0e70-40d3-a2bd-d90fa421e758';
-- Apartment #373: 1k → studio
UPDATE "apartment" SET "type" = 'studio', "layout_code" = NULL WHERE "id" = '961b9db0-1343-465b-84c8-542620b4bc5d';
-- Apartment #374: 3k → 2k
UPDATE "apartment" SET "type" = '2k', "layout_code" = NULL WHERE "id" = 'f05b8b89-9e5b-494d-8d7f-9956e9a85e65';
-- Apartment #375: 2k → 1k
UPDATE "apartment" SET "type" = '1k', "layout_code" = NULL WHERE "id" = '5b4120df-be19-47d1-bd13-088f2972cad4';
-- Apartment #376: 2k → 1k
UPDATE "apartment" SET "type" = '1k', "layout_code" = NULL WHERE "id" = '5c5c9588-f52a-44ab-b013-f0ad179141c6';
-- Apartment #377: 1k → studio
UPDATE "apartment" SET "type" = 'studio', "layout_code" = NULL WHERE "id" = '0754d504-d497-4ed8-a7e5-894163b59dd1';
-- Apartment #379: 2k → 1k
UPDATE "apartment" SET "type" = '1k', "layout_code" = NULL WHERE "id" = 'a95eb379-59df-4f57-926d-2eee19cda85a';
-- Apartment #381: 2k → 3k
UPDATE "apartment" SET "type" = '3k', "layout_code" = '6/6к' WHERE "id" = '7486a432-e6ee-46ce-8b26-ffb6d52f5432';
-- Apartment #382: 1k → 3k
UPDATE "apartment" SET "type" = '3k', "layout_code" = '7/7к' WHERE "id" = '749ee937-e0c3-4d7d-9c3a-1ebdcd56f6b8';
-- Apartment #383: 1k → 2k
UPDATE "apartment" SET "type" = '2k', "layout_code" = '8/8к' WHERE "id" = 'b3e3365d-4450-4993-a8af-96cb2dde958e';
-- Apartment #384: 1k → studio
UPDATE "apartment" SET "type" = 'studio', "layout_code" = NULL WHERE "id" = 'be752869-9019-46f3-b0ab-f4b4cbb80038';
-- Apartment #385: 3k → 2k
UPDATE "apartment" SET "type" = '2k', "layout_code" = NULL WHERE "id" = '0c32e053-915f-4b97-9d7e-e1e4511be37f';
-- Apartment #386: 2k → 1k
UPDATE "apartment" SET "type" = '1k', "layout_code" = NULL WHERE "id" = '34d9c50f-7484-4ca3-af7b-040b4fd00240';
-- Apartment #387: 2k → 1k
UPDATE "apartment" SET "type" = '1k', "layout_code" = NULL WHERE "id" = 'ec1b165c-df2b-41fe-b6ed-aa95d85af935';
-- Apartment #388: 1k → studio
UPDATE "apartment" SET "type" = 'studio', "layout_code" = NULL WHERE "id" = 'ed557164-4387-4715-ad39-91b72391e983';
-- Apartment #390: 2k → 1k
UPDATE "apartment" SET "type" = '1k', "layout_code" = NULL WHERE "id" = '8f20b5bd-2497-4441-b4d3-a54a5bfcbbc2';
-- Apartment #392: 2k → 3k
UPDATE "apartment" SET "type" = '3k', "layout_code" = '6/6к' WHERE "id" = 'fcd261e2-00fa-483d-aace-fc1d76273524';
-- Apartment #393: 1k → 3k
UPDATE "apartment" SET "type" = '3k', "layout_code" = '7/7к' WHERE "id" = '1817230e-62c3-48f4-9039-10fc89d6774e';
-- Apartment #394: 1k → 2k
UPDATE "apartment" SET "type" = '2k', "layout_code" = '8/8к' WHERE "id" = 'e1364cb4-b82d-40af-99df-d0c84fc9f095';
-- Apartment #395: 1k → studio
UPDATE "apartment" SET "type" = 'studio', "layout_code" = NULL WHERE "id" = 'c2e3c388-675b-42c1-9b13-46f4dcf350ba';
-- Apartment #396: 3k → 2k
UPDATE "apartment" SET "type" = '2k', "layout_code" = NULL WHERE "id" = 'b08ec2d3-a09e-4065-82a0-074fbc3ed7e4';
-- Apartment #397: 2k → 1k
UPDATE "apartment" SET "type" = '1k', "layout_code" = NULL WHERE "id" = '9e53138d-e3ac-4761-8e01-8c5b7f76d591';
-- Apartment #398: 2k → 1k
UPDATE "apartment" SET "type" = '1k', "layout_code" = NULL WHERE "id" = 'fbf0010f-6d3c-4a8e-b303-19d3c0df04cd';
-- Apartment #399: 1k → studio
UPDATE "apartment" SET "type" = 'studio', "layout_code" = NULL WHERE "id" = 'e703c1c0-2cf3-4365-b62b-3d7e30ebcfbc';
-- Apartment #403: 2k → 3k
UPDATE "apartment" SET "type" = '3k', "layout_code" = '6/6к' WHERE "id" = '6b96530e-663a-4a70-80d4-00e2fed78dab';
-- Apartment #404: 1k → 3k
UPDATE "apartment" SET "type" = '3k', "layout_code" = '7/7к' WHERE "id" = '65369d0a-3de1-4759-8051-66324d60297f';
-- Apartment #405: 1k → 2k
UPDATE "apartment" SET "type" = '2k', "layout_code" = '8/8к' WHERE "id" = '34c7c54d-0f57-409a-ac26-c01d0da64650';
-- Apartment #406: 1k → studio
UPDATE "apartment" SET "type" = 'studio', "layout_code" = NULL WHERE "id" = 'ba3a8d1b-90d7-43c9-99a0-86037db3767f';
-- Apartment #407: 3k → 2k
UPDATE "apartment" SET "type" = '2k', "layout_code" = NULL WHERE "id" = 'd8d84269-d4cc-4ccf-a316-1a52f8a1abe9';
-- Apartment #408: 2k → 1k
UPDATE "apartment" SET "type" = '1k', "layout_code" = NULL WHERE "id" = 'cf3a8611-2309-489a-a18c-d7016ba6fa9f';
-- Apartment #409: 2k → 1k
UPDATE "apartment" SET "type" = '1k', "layout_code" = NULL WHERE "id" = 'db9a8eca-1d08-4bbe-84f3-4c930978dea6';
-- Apartment #410: 1k → studio
UPDATE "apartment" SET "type" = 'studio', "layout_code" = NULL WHERE "id" = '565568cd-1411-4765-bfdf-6df9271c162d';
-- Apartment #412: 2k → 1k
UPDATE "apartment" SET "type" = '1k', "layout_code" = NULL WHERE "id" = '2ab492f1-0357-4cd5-adac-7efb18020467';
-- Apartment #414: 2k → 3k
UPDATE "apartment" SET "type" = '3k', "layout_code" = '6/6к' WHERE "id" = '22a4b668-ec8d-4eb1-ad77-e6356a4fb77f';
-- Apartment #415: 1k → 3k
UPDATE "apartment" SET "type" = '3k', "layout_code" = '7/7к' WHERE "id" = '162b162f-65f1-44b8-a554-cb72595e52b1';
-- Apartment #416: 1k → 2k
UPDATE "apartment" SET "type" = '2k', "layout_code" = '8/8к' WHERE "id" = '6b3d6d1d-fc86-4c66-b284-99893d3219ee';
-- Apartment #417: 1k → studio
UPDATE "apartment" SET "type" = 'studio', "layout_code" = NULL WHERE "id" = '6cf33c90-a63b-456b-aace-1c13a51d0f1c';
-- Apartment #418: 3k → 2k
UPDATE "apartment" SET "type" = '2k', "layout_code" = NULL WHERE "id" = '50b61b4d-a418-4c2b-b3a5-4d972b40535a';
-- Apartment #419: 2k → 1k
UPDATE "apartment" SET "type" = '1k', "layout_code" = NULL WHERE "id" = '36c47590-b76c-49c8-a910-888c9a8417ac';
-- Apartment #420: 2k → 1k
UPDATE "apartment" SET "type" = '1k', "layout_code" = NULL WHERE "id" = '5a9732cf-91ca-482c-a1f5-4ff0faa7af86';
-- Apartment #425: 2k → 3k
UPDATE "apartment" SET "type" = '3k', "layout_code" = '6/6к' WHERE "id" = '149ccb7a-2db7-4efd-93f9-15183a3a7db7';
-- Apartment #426: 1k → 3k
UPDATE "apartment" SET "type" = '3k', "layout_code" = '7/7к' WHERE "id" = 'e6d88f12-0f5d-4145-ac9a-c247b88644c6';
-- Apartment #427: 1k → 2k
UPDATE "apartment" SET "type" = '2k', "layout_code" = '8/8к' WHERE "id" = 'b14af35d-4d7a-49b1-818a-143b5857c472';
-- Apartment #428: 1k → studio
UPDATE "apartment" SET "type" = 'studio', "layout_code" = NULL WHERE "id" = '31d176a8-3d30-4295-99bb-ea43dcec0e10';
-- Apartment #429: 3k → 2k
UPDATE "apartment" SET "type" = '2k', "layout_code" = NULL WHERE "id" = '92df7d46-5812-4b08-bdf6-20fa81c11716';
-- Apartment #430: 2k → 1k
UPDATE "apartment" SET "type" = '1k', "layout_code" = NULL WHERE "id" = '54cbc214-f79e-4d0f-b928-ec0f12ab0d66';
-- Apartment #431: 2k → 1k
UPDATE "apartment" SET "type" = '1k', "layout_code" = NULL WHERE "id" = 'b132a92c-ea82-44f3-9ed1-faa51aed28e8';
-- Apartment #432: 1k → studio
UPDATE "apartment" SET "type" = 'studio', "layout_code" = NULL WHERE "id" = 'adf7c75b-1f3f-49f5-9f00-8751368da2cf';
-- Apartment #434: 2k → 1k
UPDATE "apartment" SET "type" = '1k', "layout_code" = NULL WHERE "id" = 'f860e0e5-75bf-4306-b401-e21d35da095b';
-- Apartment #436: 2k → 3k
UPDATE "apartment" SET "type" = '3k', "layout_code" = '6/6к' WHERE "id" = 'a4fbe0ea-c6e9-4376-ae17-6e580b954cfd';
-- Apartment #437: 1k → 3k
UPDATE "apartment" SET "type" = '3k', "layout_code" = '7/7к' WHERE "id" = '5d0669e3-b4d4-45e3-894f-6fe0b38f4189';
-- Apartment #438: 1k → 2k
UPDATE "apartment" SET "type" = '2k', "layout_code" = '8/8к' WHERE "id" = '2aca30ab-392b-4733-a4a0-1ecf0f9cf087';
-- Apartment #439: 1k → studio
UPDATE "apartment" SET "type" = 'studio', "layout_code" = NULL WHERE "id" = '17c0745c-fc00-462d-bfaa-4291006bf466';
-- Apartment #440: 3k → 2k
UPDATE "apartment" SET "type" = '2k', "layout_code" = NULL WHERE "id" = '740bd5ac-7cab-4d64-a014-b3558344dd07';
-- Apartment #442: 2k → 1k
UPDATE "apartment" SET "type" = '1k', "layout_code" = NULL WHERE "id" = '5d2d63ed-443c-425e-8a60-9f788941ccde';
-- Apartment #443: 1k → studio
UPDATE "apartment" SET "type" = 'studio', "layout_code" = NULL WHERE "id" = '6b6e7039-a4f0-4434-9aa6-88ff022386d3';
-- Apartment #445: 2k → 1k
UPDATE "apartment" SET "type" = '1k', "layout_code" = NULL WHERE "id" = '50fcdbc3-840b-42c5-891a-4310d9414360';
-- Apartment #447: 2k → 3k
UPDATE "apartment" SET "type" = '3k', "layout_code" = '6/6к' WHERE "id" = '7e7662f3-3b99-4974-841d-c59117374e63';
-- Apartment #448: 1k → 3k
UPDATE "apartment" SET "type" = '3k', "layout_code" = '7/7к' WHERE "id" = 'f5d92aa7-b195-44c4-83d6-33e967591450';
-- Apartment #449: 1k → 2k
UPDATE "apartment" SET "type" = '2k', "layout_code" = '8/8к' WHERE "id" = '22566a6d-082f-4852-8af9-265cd173a3f3';
-- Apartment #451: 3k → 2k
UPDATE "apartment" SET "type" = '2k', "layout_code" = NULL WHERE "id" = '5ecb277f-0ce3-49eb-8125-9923e0d14f14';
-- Apartment #454: 1k → studio
UPDATE "apartment" SET "type" = 'studio', "layout_code" = NULL WHERE "id" = 'a65da75c-8c45-46b0-9188-8c40627926e8';
-- Apartment #456: 2k → 1k
UPDATE "apartment" SET "type" = '1k', "layout_code" = NULL WHERE "id" = '8ca957e9-5eb8-42a9-8b10-4be5ee9aeeb2';
-- Apartment #458: 2k → 3k
UPDATE "apartment" SET "type" = '3k', "layout_code" = '6/6к' WHERE "id" = '878b7b04-463f-49fe-ba0c-b6ff98a36323';
-- Apartment #459: 1k → 3k
UPDATE "apartment" SET "type" = '3k', "layout_code" = '7/7к' WHERE "id" = 'd2b8f6e1-6f4d-4b2e-95b4-1e9ef0d1b9a6';
-- Apartment #460: 1k → 2k
UPDATE "apartment" SET "type" = '2k', "layout_code" = '8/8к' WHERE "id" = 'ca0d9cc5-efdd-47ea-9c7c-386419a6296e';
-- Apartment #461: 1k → studio
UPDATE "apartment" SET "type" = 'studio', "layout_code" = NULL WHERE "id" = '19fdf826-b374-453d-b5d9-4b21249605f8';
-- Apartment #462: 3k → 2k
UPDATE "apartment" SET "type" = '2k', "layout_code" = NULL WHERE "id" = 'c5be9cb1-c17a-41f8-8fbc-bb7010985cd2';
-- Apartment #465: 1k → studio
UPDATE "apartment" SET "type" = 'studio', "layout_code" = NULL WHERE "id" = '4274184d-ac36-461b-a22b-b3ee655368e0';
-- Apartment #467: 2k → 1k
UPDATE "apartment" SET "type" = '1k', "layout_code" = NULL WHERE "id" = '78385f67-3e4f-4f38-af51-3e600114baf2';
-- Apartment #469: 2k → 3k
UPDATE "apartment" SET "type" = '3k', "layout_code" = '6/6к' WHERE "id" = '565de2e0-2ffe-40ee-bc56-ce8feedd528b';
-- Apartment #470: 1k → 3k
UPDATE "apartment" SET "type" = '3k', "layout_code" = '7/7к' WHERE "id" = 'cd97e1f2-eb3e-4a32-b06f-f24bb6d14748';
-- Apartment #471: 1k → 2k
UPDATE "apartment" SET "type" = '2k', "layout_code" = '8/8к' WHERE "id" = 'c83418ac-11dc-444f-89a7-288ba4d1f321';
-- Apartment #472: 1k → studio
UPDATE "apartment" SET "type" = 'studio', "layout_code" = NULL WHERE "id" = 'eec7b5bf-5c8c-4113-a6c2-19498abd0e88';
-- Apartment #473: 3k → 2k
UPDATE "apartment" SET "type" = '2k', "layout_code" = NULL WHERE "id" = 'fd70a2f8-1e14-4e51-9c88-030d1d3a5aaa';
-- Apartment #474: 2k → 1k
UPDATE "apartment" SET "type" = '1k', "layout_code" = NULL WHERE "id" = 'f177431b-d32a-44f4-8b4f-be3ff1fbc620';
-- Apartment #476: 1k → studio
UPDATE "apartment" SET "type" = 'studio', "layout_code" = NULL WHERE "id" = 'abf632d8-0b61-4825-8c28-b0601494c2e3';
-- Apartment #478: 2k → 1k
UPDATE "apartment" SET "type" = '1k', "layout_code" = NULL WHERE "id" = '8608bad2-ead4-4877-afe1-4ab8e7f55f34';
-- Apartment #480: 2k → 3k
UPDATE "apartment" SET "type" = '3k', "layout_code" = '6/6к' WHERE "id" = '0c4cb162-b1a2-4974-8e50-dbf031b6f166';
-- Apartment #481: 1k → 3k
UPDATE "apartment" SET "type" = '3k', "layout_code" = '7/7к' WHERE "id" = '86749d25-154c-4880-bf41-8501999fd9ff';
-- Apartment #482: 1k → 2k
UPDATE "apartment" SET "type" = '2k', "layout_code" = '8/8к' WHERE "id" = '8f313def-1bbf-4325-88e3-f053301af980';
-- Apartment #483: 1k → studio
UPDATE "apartment" SET "type" = 'studio', "layout_code" = NULL WHERE "id" = '83300a1e-2ea9-4c4e-8c55-fd8354441d80';
-- Apartment #484: 3k → 2k
UPDATE "apartment" SET "type" = '2k', "layout_code" = NULL WHERE "id" = '23d79634-5a97-4673-89c6-c8bf818fe8e2';

COMMIT;

-- ============================================================================
-- Summary:
-- Buildings updated: 0
-- Buildings inserted: 0
-- Apartments updated: 874 (ID preserved)
-- Apartments inserted: 0
-- Parking spots updated: 0 (ID preserved)
-- Parking spots inserted: 0
--
-- ✅ Связи user_apartment и user_parking_spot сохранены!
-- ============================================================================