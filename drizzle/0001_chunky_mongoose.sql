CREATE TYPE "public"."user_role" AS ENUM('Root', 'SuperAdmin', 'Admin', 'ApartmentOwner', 'ApartmentResident', 'ParkingOwner', 'ParkingResident', 'Editor', 'Moderator', 'Guest', 'BuildingChairman', 'ComplexChairman', 'ComplexRepresenative', 'StoreOwner', 'StoreRepresenative');--> statement-breakpoint
CREATE TYPE "public"."apartment_type" AS ENUM('studio', '1k', '2k', '3k');--> statement-breakpoint
CREATE TYPE "public"."parking_spot_type" AS ENUM('moto', 'standard', 'wide');--> statement-breakpoint
CREATE TYPE "public"."organization_type" AS ENUM('store', 'restaurant', 'service', 'other');--> statement-breakpoint
CREATE TABLE "sr2-community_user_role" (
	"user_id" varchar(255) NOT NULL,
	"role" "user_role" NOT NULL,
	CONSTRAINT "sr2-community_user_role_user_id_role_pk" PRIMARY KEY("user_id","role")
);
--> statement-breakpoint
CREATE TABLE "sr2-community_contact_group_tags" (
	"contact_group_id" varchar(36),
	"tag_id" varchar(36),
	CONSTRAINT "sr2-community_contact_group_tags_contact_group_id_tag_id_pk" PRIMARY KEY("contact_group_id","tag_id")
);
--> statement-breakpoint
CREATE TABLE "sr2-community_contact_groups" (
	"id" varchar(36) PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"type" text NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "sr2-community_properties" (
	"id" varchar(36) PRIMARY KEY NOT NULL,
	"group_id" varchar(36),
	"key" text NOT NULL,
	"value" text NOT NULL,
	"type" text NOT NULL,
	"order" integer DEFAULT 0
);
--> statement-breakpoint
CREATE TABLE "sr2-community_property_groups" (
	"id" varchar(36) PRIMARY KEY NOT NULL,
	"contact_group_id" varchar(36),
	"name" text NOT NULL,
	"order" integer DEFAULT 0
);
--> statement-breakpoint
CREATE TABLE "sr2-community_tags" (
	"id" varchar(36) PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	CONSTRAINT "sr2-community_tags_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "sr2-community_apartment" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"floor_id" varchar(255) NOT NULL,
	"number" varchar(10) NOT NULL,
	"type" "apartment_type" NOT NULL,
	"layout_code" varchar(255)
);
--> statement-breakpoint
CREATE TABLE "sr2-community_building" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"number" smallint,
	"title" varchar(255),
	"liter" varchar(255),
	"active" boolean
);
--> statement-breakpoint
CREATE TABLE "sr2-community_entrance" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"building_id" varchar(255) NOT NULL,
	"entrance_number" smallint NOT NULL
);
--> statement-breakpoint
CREATE TABLE "sr2-community_floor" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"entrance_id" varchar(255) NOT NULL,
	"floor_number" smallint NOT NULL
);
--> statement-breakpoint
CREATE TABLE "sr2-community_parking_floor" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"parking_id" varchar(255) NOT NULL,
	"floor_number" smallint NOT NULL
);
--> statement-breakpoint
CREATE TABLE "sr2-community_parking_spot" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"floor_id" varchar(255) NOT NULL,
	"number" varchar(10) NOT NULL,
	"type" "parking_spot_type" NOT NULL
);
--> statement-breakpoint
CREATE TABLE "sr2-community_parking" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"building_id" varchar(255) NOT NULL,
	"name" varchar(255) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "sr2-community_organization_tag" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"name" varchar(100) NOT NULL,
	CONSTRAINT "sr2-community_organization_tag_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "sr2-community_organization_to_tag" (
	"organization_id" varchar(255) NOT NULL,
	"tag_id" varchar(255) NOT NULL,
	CONSTRAINT "sr2-community_organization_to_tag_organization_id_tag_id_pk" PRIMARY KEY("organization_id","tag_id")
);
--> statement-breakpoint
CREATE TABLE "sr2-community_organization" (
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
ALTER TABLE "sr2-community_user_role" ADD CONSTRAINT "sr2-community_user_role_user_id_sr2-community_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."sr2-community_user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sr2-community_contact_group_tags" ADD CONSTRAINT "sr2-community_contact_group_tags_contact_group_id_sr2-community_contact_groups_id_fk" FOREIGN KEY ("contact_group_id") REFERENCES "public"."sr2-community_contact_groups"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sr2-community_contact_group_tags" ADD CONSTRAINT "sr2-community_contact_group_tags_tag_id_sr2-community_tags_id_fk" FOREIGN KEY ("tag_id") REFERENCES "public"."sr2-community_tags"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sr2-community_properties" ADD CONSTRAINT "sr2-community_properties_group_id_sr2-community_property_groups_id_fk" FOREIGN KEY ("group_id") REFERENCES "public"."sr2-community_property_groups"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sr2-community_property_groups" ADD CONSTRAINT "sr2-community_property_groups_contact_group_id_sr2-community_contact_groups_id_fk" FOREIGN KEY ("contact_group_id") REFERENCES "public"."sr2-community_contact_groups"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sr2-community_apartment" ADD CONSTRAINT "sr2-community_apartment_floor_id_sr2-community_floor_id_fk" FOREIGN KEY ("floor_id") REFERENCES "public"."sr2-community_floor"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sr2-community_entrance" ADD CONSTRAINT "sr2-community_entrance_building_id_sr2-community_building_id_fk" FOREIGN KEY ("building_id") REFERENCES "public"."sr2-community_building"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sr2-community_floor" ADD CONSTRAINT "sr2-community_floor_entrance_id_sr2-community_entrance_id_fk" FOREIGN KEY ("entrance_id") REFERENCES "public"."sr2-community_entrance"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sr2-community_parking_floor" ADD CONSTRAINT "sr2-community_parking_floor_parking_id_sr2-community_parking_id_fk" FOREIGN KEY ("parking_id") REFERENCES "public"."sr2-community_parking"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sr2-community_parking_spot" ADD CONSTRAINT "sr2-community_parking_spot_floor_id_sr2-community_parking_floor_id_fk" FOREIGN KEY ("floor_id") REFERENCES "public"."sr2-community_parking_floor"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sr2-community_parking" ADD CONSTRAINT "sr2-community_parking_building_id_sr2-community_building_id_fk" FOREIGN KEY ("building_id") REFERENCES "public"."sr2-community_building"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sr2-community_organization_to_tag" ADD CONSTRAINT "sr2-community_organization_to_tag_organization_id_sr2-community_organization_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."sr2-community_organization"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sr2-community_organization_to_tag" ADD CONSTRAINT "sr2-community_organization_to_tag_tag_id_sr2-community_organization_tag_id_fk" FOREIGN KEY ("tag_id") REFERENCES "public"."sr2-community_organization_tag"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sr2-community_organization" ADD CONSTRAINT "sr2-community_organization_building_id_sr2-community_building_id_fk" FOREIGN KEY ("building_id") REFERENCES "public"."sr2-community_building"("id") ON DELETE cascade ON UPDATE no action;