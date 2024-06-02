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
CREATE TABLE IF NOT EXISTS "account" (
	"userId" integer NOT NULL,
	"type" text NOT NULL,
	"provider" text NOT NULL,
	"providerAccountId" text NOT NULL,
	"refresh_token" text,
	"access_token" text,
	"expires_at" integer,
	"token_type" text,
	"scope" text,
	"id_token" text,
	"session_state" text,
	CONSTRAINT "account_provider_providerAccountId_pk" PRIMARY KEY("provider","providerAccountId")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "apartment_schemas" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text,
	"description" text,
	"building_id" integer
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "apartments" (
	"id" serial PRIMARY KEY NOT NULL,
	"number" smallint NOT NULL,
	"name" text,
	"floor_id" integer,
	"entrance_id" integer,
	"building_id" integer,
	"schema_id" integer
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "apartments_users" (
	"apartment_id" integer,
	"user_id" integer
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "buildings" (
	"id" serial PRIMARY KEY NOT NULL,
	"number" smallint NOT NULL,
	"name" text,
	"address" text,
	CONSTRAINT "buildings_number_unique" UNIQUE("number")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "entrances" (
	"id" serial PRIMARY KEY NOT NULL,
	"number" smallint NOT NULL,
	"name" text,
	"entrance_id" integer,
	"building_id" integer
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "parking" (
	"id" serial PRIMARY KEY NOT NULL,
	"variant" "variant",
	"level" "level",
	"parking_number" smallint NOT NULL,
	"building_id" integer,
	CONSTRAINT "parking_building_id_parking_number_unique" UNIQUE("building_id","parking_number")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "parking_offer" (
	"id" serial PRIMARY KEY NOT NULL,
	"parking_id" serial NOT NULL,
	"price" smallint,
	"user_id" integer,
	"phone_id" integer,
	"confirmed" boolean DEFAULT false,
	"visible" boolean DEFAULT false,
	"show_messengers" boolean DEFAULT false
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "parkings_users" (
	"parking_id" integer,
	"user_id" integer
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "phones" (
	"id" serial PRIMARY KEY NOT NULL,
	"label" text,
	"name" text NOT NULL,
	"user_id" integer,
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
	"user_id" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "roles" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"description" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "session" (
	"sessionToken" text PRIMARY KEY NOT NULL,
	"userId" integer NOT NULL,
	"expires" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	"emailVerified" timestamp,
	"name" text,
	"image" text,
	"password" text,
	"created_at" timestamp,
	"updated_at" timestamp,
	"verified_at" timestamp,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users_roles" (
	"role_id" integer NOT NULL,
	"user_id" integer NOT NULL,
	CONSTRAINT "users_roles_user_id_role_id_unique" UNIQUE("user_id","role_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "verificationToken" (
	"identifier" text NOT NULL,
	"token" text NOT NULL,
	"expires" timestamp NOT NULL,
	CONSTRAINT "verificationToken_identifier_token_pk" PRIMARY KEY("identifier","token")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "account" ADD CONSTRAINT "account_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
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
DO $$ BEGIN
 ALTER TABLE "session" ADD CONSTRAINT "session_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "users_roles" ADD CONSTRAINT "users_roles_role_id_roles_id_fk" FOREIGN KEY ("role_id") REFERENCES "public"."roles"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "users_roles" ADD CONSTRAINT "users_roles_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "email_idx" ON "users" ("email");