CREATE TYPE "public"."apartment_type" AS ENUM('studio', '1k', '2k', '3k');--> statement-breakpoint
CREATE TYPE "public"."organization_type" AS ENUM('store', 'restaurant', 'service', 'other');--> statement-breakpoint
CREATE TYPE "public"."parking_spot_type" AS ENUM('moto', 'standard', 'wide');--> statement-breakpoint
CREATE TYPE "public"."user_role_enum" AS ENUM('Root', 'SuperAdmin', 'Admin', 'ApartmentOwner', 'ApartmentResident', 'ParkingOwner', 'ParkingResident', 'Editor', 'Moderator', 'Guest', 'BuildingChairman', 'ComplexChairman', 'ComplexRepresenative', 'StoreOwner', 'StoreRepresenative');--> statement-breakpoint
CREATE TYPE "public"."user_property_status" AS ENUM('pending', 'approved', 'rejected');--> statement-breakpoint
CREATE TABLE "apartment" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"floor_id" varchar(255) NOT NULL,
	"number" varchar(10) NOT NULL,
	"type" "apartment_type" NOT NULL,
	"layout_code" varchar(255)
);
--> statement-breakpoint
CREATE TABLE "building" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"number" smallint,
	"title" varchar(255),
	"liter" varchar(255),
	"active" boolean,
	CONSTRAINT "building_number_unique" UNIQUE("number"),
	CONSTRAINT "building_title_unique" UNIQUE("title")
);
--> statement-breakpoint
CREATE TABLE "entrance" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"building_id" varchar(255) NOT NULL,
	"entrance_number" smallint NOT NULL,
	CONSTRAINT "building_id_entrance_number_idx" UNIQUE("building_id","entrance_number")
);
--> statement-breakpoint
CREATE TABLE "floor" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"entrance_id" varchar(255) NOT NULL,
	"floor_number" smallint NOT NULL,
	CONSTRAINT "endtance_id_floor_number_idx" UNIQUE("floor_number","entrance_id")
);
--> statement-breakpoint
CREATE TABLE "contact_group_tags" (
	"contact_group_id" varchar(36),
	"tag_id" varchar(36),
	CONSTRAINT "contact_group_tags_contact_group_id_tag_id_pk" PRIMARY KEY("contact_group_id","tag_id")
);
--> statement-breakpoint
CREATE TABLE "contact_groups" (
	"id" varchar(36) PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"type" text NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "properties" (
	"id" varchar(36) PRIMARY KEY NOT NULL,
	"group_id" varchar(36),
	"key" text NOT NULL,
	"value" text NOT NULL,
	"type" text NOT NULL,
	"order" integer DEFAULT 0
);
--> statement-breakpoint
CREATE TABLE "property_groups" (
	"id" varchar(36) PRIMARY KEY NOT NULL,
	"contact_group_id" varchar(36),
	"name" text NOT NULL,
	"order" integer DEFAULT 0
);
--> statement-breakpoint
CREATE TABLE "tags" (
	"id" varchar(36) PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	CONSTRAINT "tags_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "organization_tag" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"name" varchar(100) NOT NULL,
	CONSTRAINT "organization_tag_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "organization_to_tag" (
	"organization_id" varchar(255) NOT NULL,
	"tag_id" varchar(255) NOT NULL,
	CONSTRAINT "organization_to_tag_organization_id_tag_id_pk" PRIMARY KEY("organization_id","tag_id")
);
--> statement-breakpoint
CREATE TABLE "organization" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"building_id" varchar(255) NOT NULL,
	"floor_number" integer NOT NULL,
	"name" varchar(255) NOT NULL,
	"description" text,
	"logo" varchar(255),
	"schedule" jsonb NOT NULL,
	"type" "organization_type" NOT NULL
);
--> statement-breakpoint
CREATE TABLE "parking_floor" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"parking_id" varchar(255) NOT NULL,
	"floor_number" smallint NOT NULL
);
--> statement-breakpoint
CREATE TABLE "parking_spot" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"floor_id" varchar(255) NOT NULL,
	"number" varchar(10) NOT NULL,
	"type" "parking_spot_type" NOT NULL
);
--> statement-breakpoint
CREATE TABLE "parking" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"building_id" varchar(255) NOT NULL,
	"name" varchar(255) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "post" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(256),
	"created_by" varchar(255) NOT NULL,
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "account" (
	"user_id" varchar(255) NOT NULL,
	"type" varchar(255) NOT NULL,
	"provider" varchar(255) NOT NULL,
	"provider_account_id" varchar(255) NOT NULL,
	"refresh_token" text,
	"access_token" text,
	"expires_at" integer,
	"token_type" varchar(255),
	"scope" varchar(255),
	"id_token" text,
	"session_state" varchar(255),
	CONSTRAINT "account_provider_provider_account_id_pk" PRIMARY KEY("provider","provider_account_id")
);
--> statement-breakpoint
CREATE TABLE "session" (
	"session_token" varchar(255) PRIMARY KEY NOT NULL,
	"user_id" varchar(255) NOT NULL,
	"expires" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user_role" (
	"user_id" varchar(255) NOT NULL,
	"role" "user_role_enum" NOT NULL,
	CONSTRAINT "user_role_user_id_role_pk" PRIMARY KEY("user_id","role")
);
--> statement-breakpoint
CREATE TABLE "user" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"name" varchar(255),
	"email" varchar(255) NOT NULL,
	"email_verified" timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
	"image" varchar(255)
);
--> statement-breakpoint
CREATE TABLE "verification_token" (
	"identifier" varchar(255) NOT NULL,
	"token" varchar(255) NOT NULL,
	"expires" timestamp with time zone NOT NULL,
	CONSTRAINT "verification_token_identifier_token_pk" PRIMARY KEY("identifier","token")
);
--> statement-breakpoint
CREATE TABLE "user_apartment" (
	"user_id" varchar(255) NOT NULL,
	"apartment_id" varchar(255) NOT NULL,
	"status" "user_property_status" DEFAULT 'pending' NOT NULL,
	"role" "user_role_enum" NOT NULL,
	CONSTRAINT "user_apartment_user_id_apartment_id_pk" PRIMARY KEY("user_id","apartment_id")
);
--> statement-breakpoint
CREATE TABLE "user_parking_spot" (
	"user_id" varchar(255) NOT NULL,
	"parking_spot_id" varchar(255) NOT NULL,
	"status" "user_property_status" DEFAULT 'pending' NOT NULL,
	"role" "user_role_enum" NOT NULL,
	CONSTRAINT "user_parking_spot_user_id_parking_spot_id_pk" PRIMARY KEY("user_id","parking_spot_id")
);
--> statement-breakpoint
ALTER TABLE "apartment" ADD CONSTRAINT "apartment_floor_id_floor_id_fk" FOREIGN KEY ("floor_id") REFERENCES "public"."floor"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "entrance" ADD CONSTRAINT "entrance_building_id_building_id_fk" FOREIGN KEY ("building_id") REFERENCES "public"."building"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "floor" ADD CONSTRAINT "floor_entrance_id_entrance_id_fk" FOREIGN KEY ("entrance_id") REFERENCES "public"."entrance"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "contact_group_tags" ADD CONSTRAINT "contact_group_tags_contact_group_id_contact_groups_id_fk" FOREIGN KEY ("contact_group_id") REFERENCES "public"."contact_groups"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "contact_group_tags" ADD CONSTRAINT "contact_group_tags_tag_id_tags_id_fk" FOREIGN KEY ("tag_id") REFERENCES "public"."tags"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "properties" ADD CONSTRAINT "properties_group_id_property_groups_id_fk" FOREIGN KEY ("group_id") REFERENCES "public"."property_groups"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "property_groups" ADD CONSTRAINT "property_groups_contact_group_id_contact_groups_id_fk" FOREIGN KEY ("contact_group_id") REFERENCES "public"."contact_groups"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "organization_to_tag" ADD CONSTRAINT "organization_to_tag_organization_id_organization_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organization"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "organization_to_tag" ADD CONSTRAINT "organization_to_tag_tag_id_organization_tag_id_fk" FOREIGN KEY ("tag_id") REFERENCES "public"."organization_tag"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "organization" ADD CONSTRAINT "organization_building_id_building_id_fk" FOREIGN KEY ("building_id") REFERENCES "public"."building"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "parking_floor" ADD CONSTRAINT "parking_floor_parking_id_parking_id_fk" FOREIGN KEY ("parking_id") REFERENCES "public"."parking"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "parking_spot" ADD CONSTRAINT "parking_spot_floor_id_parking_floor_id_fk" FOREIGN KEY ("floor_id") REFERENCES "public"."parking_floor"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "parking" ADD CONSTRAINT "parking_building_id_building_id_fk" FOREIGN KEY ("building_id") REFERENCES "public"."building"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "post" ADD CONSTRAINT "post_created_by_user_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "account" ADD CONSTRAINT "account_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "session" ADD CONSTRAINT "session_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_role" ADD CONSTRAINT "user_role_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_apartment" ADD CONSTRAINT "user_apartment_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_apartment" ADD CONSTRAINT "user_apartment_apartment_id_apartment_id_fk" FOREIGN KEY ("apartment_id") REFERENCES "public"."apartment"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_parking_spot" ADD CONSTRAINT "user_parking_spot_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_parking_spot" ADD CONSTRAINT "user_parking_spot_parking_spot_id_parking_spot_id_fk" FOREIGN KEY ("parking_spot_id") REFERENCES "public"."parking_spot"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "created_by_idx" ON "post" USING btree ("created_by");--> statement-breakpoint
CREATE INDEX "name_idx" ON "post" USING btree ("name");--> statement-breakpoint
CREATE INDEX "account_user_id_idx" ON "account" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "session_user_id_idx" ON "session" USING btree ("user_id");