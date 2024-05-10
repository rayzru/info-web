DO $$ BEGIN
 CREATE TYPE "public"."level" AS ENUM('-1', '-2');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."variant" AS ENUM('standart', 'moto', 'large');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."user_roles" AS ENUM('guest', 'root', 'superadmin', 'admin', 'editor', 'moderator', 'building_chairman', 'building_initiative', 'owner', 'resident', 'service', 'represenative', 'administrative', 'system');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "apartment_schemas" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text,
	"description" text,
	"building_id" serial NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "apartments" (
	"id" serial PRIMARY KEY NOT NULL,
	"number" smallint NOT NULL,
	"name" text,
	"floor_id" serial NOT NULL,
	"entrance_id" serial NOT NULL,
	"building_id" serial NOT NULL,
	"schema_id" serial NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "apartments_users" (
	"apartment_id" serial NOT NULL,
	"user_id" serial NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "buildings" (
	"id" serial PRIMARY KEY NOT NULL,
	"number" smallint,
	"name" text,
	"address" text,
	CONSTRAINT "buildings_number_unique" UNIQUE("number")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "entrances" (
	"id" serial PRIMARY KEY NOT NULL,
	"number" smallint NOT NULL,
	"name" text,
	"entrance_id" serial NOT NULL,
	"building_id" serial NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "parking" (
	"id" serial PRIMARY KEY NOT NULL,
	"variant" "variant",
	"level" "level",
	"parking_number" smallint NOT NULL,
	"building_id" serial NOT NULL,
	CONSTRAINT "parking_building_id_parking_number_unique" UNIQUE("building_id","parking_number")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "parking_offer" (
	"id" serial PRIMARY KEY NOT NULL,
	"parking_id" serial NOT NULL,
	"price" smallint,
	"user_id" serial NOT NULL,
	"phone_id" serial NOT NULL,
	"confirmed" boolean DEFAULT false,
	"visible" boolean DEFAULT false,
	"show_messengers" boolean DEFAULT false
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "parkings_users" (
	"parking_id" serial NOT NULL,
	"user_id" serial NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "phones" (
	"id" serial PRIMARY KEY NOT NULL,
	"label" text,
	"name" text NOT NULL,
	"user_id" serial NOT NULL,
	CONSTRAINT "phones_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "profiles" (
	"id" serial PRIMARY KEY NOT NULL,
	"display_name" text,
	"name" text,
	"surname" text,
	"middlename" text,
	"phones" serial NOT NULL,
	"user_id" serial NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	"password" text NOT NULL,
	"role" "user_roles" DEFAULT 'guest' NOT NULL,
	"created_at" timestamp,
	"updated_at" timestamp,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "apartment_schemas" ADD CONSTRAINT "apartment_schemas_building_id_buildings_id_fk" FOREIGN KEY ("building_id") REFERENCES "public"."buildings"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "apartments" ADD CONSTRAINT "apartments_floor_id_entrances_id_fk" FOREIGN KEY ("floor_id") REFERENCES "public"."entrances"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "apartments" ADD CONSTRAINT "apartments_entrance_id_entrances_id_fk" FOREIGN KEY ("entrance_id") REFERENCES "public"."entrances"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "apartments" ADD CONSTRAINT "apartments_building_id_buildings_id_fk" FOREIGN KEY ("building_id") REFERENCES "public"."buildings"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "apartments" ADD CONSTRAINT "apartments_schema_id_apartment_schemas_id_fk" FOREIGN KEY ("schema_id") REFERENCES "public"."apartment_schemas"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "apartments_users" ADD CONSTRAINT "apartments_users_apartment_id_apartments_id_fk" FOREIGN KEY ("apartment_id") REFERENCES "public"."apartments"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "apartments_users" ADD CONSTRAINT "apartments_users_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "entrances" ADD CONSTRAINT "entrances_entrance_id_entrances_id_fk" FOREIGN KEY ("entrance_id") REFERENCES "public"."entrances"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "entrances" ADD CONSTRAINT "entrances_building_id_buildings_id_fk" FOREIGN KEY ("building_id") REFERENCES "public"."buildings"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "parking" ADD CONSTRAINT "parking_building_id_buildings_id_fk" FOREIGN KEY ("building_id") REFERENCES "public"."buildings"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "parking_offer" ADD CONSTRAINT "parking_offer_parking_id_parking_id_fk" FOREIGN KEY ("parking_id") REFERENCES "public"."parking"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "parking_offer" ADD CONSTRAINT "parking_offer_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "parking_offer" ADD CONSTRAINT "parking_offer_phone_id_phones_id_fk" FOREIGN KEY ("phone_id") REFERENCES "public"."phones"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "parkings_users" ADD CONSTRAINT "parkings_users_parking_id_parking_id_fk" FOREIGN KEY ("parking_id") REFERENCES "public"."parking"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "parkings_users" ADD CONSTRAINT "parkings_users_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "phones" ADD CONSTRAINT "phones_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "profiles" ADD CONSTRAINT "profiles_phones_phones_id_fk" FOREIGN KEY ("phones") REFERENCES "public"."phones"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "profiles" ADD CONSTRAINT "profiles_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "email_idx" ON "users" ("email");