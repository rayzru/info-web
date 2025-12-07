CREATE TYPE "public"."claim_status" AS ENUM('pending', 'under_review', 'approved', 'rejected', 'documents_requested');--> statement-breakpoint
CREATE TYPE "public"."claim_type" AS ENUM('apartment', 'parking', 'commercial');--> statement-breakpoint
CREATE TYPE "public"."resolution_template" AS ENUM('approved_all_correct', 'approved_custom', 'rejected_no_documents', 'rejected_invalid_documents', 'rejected_no_reason', 'rejected_custom');--> statement-breakpoint
CREATE TYPE "public"."listing_property_type" AS ENUM('apartment', 'parking');--> statement-breakpoint
CREATE TYPE "public"."listing_status" AS ENUM('draft', 'pending_moderation', 'approved', 'rejected', 'archived');--> statement-breakpoint
CREATE TYPE "public"."listing_type" AS ENUM('rent', 'sale');--> statement-breakpoint
CREATE TYPE "public"."user_gender_enum" AS ENUM('Male', 'Female', 'Unspecified');--> statement-breakpoint
CREATE TYPE "public"."revocation_template" AS ENUM('community_rules_violation', 'role_owner_change', 'custom');--> statement-breakpoint
CREATE TABLE "claim_document" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"claim_id" varchar(255) NOT NULL,
	"document_type" varchar(100) NOT NULL,
	"file_url" varchar(500),
	"file_name" varchar(255),
	"file_size" varchar(20),
	"mime_type" varchar(100),
	"uploaded_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE "claim_history" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"claim_id" varchar(255) NOT NULL,
	"from_status" "claim_status",
	"to_status" "claim_status" NOT NULL,
	"resolution_template" "resolution_template",
	"resolution_text" text,
	"changed_by" varchar(255),
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE "property_claim" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"user_id" varchar(255) NOT NULL,
	"claim_type" "claim_type" NOT NULL,
	"claimed_role" "user_role_enum" NOT NULL,
	"apartment_id" varchar(255),
	"parking_spot_id" varchar(255),
	"organization_id" varchar(255),
	"status" "claim_status" DEFAULT 'pending' NOT NULL,
	"user_comment" text,
	"admin_comment" text,
	"reviewed_by" varchar(255),
	"reviewed_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE "listing_photo" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"listing_id" varchar(255) NOT NULL,
	"url" varchar(500) NOT NULL,
	"sort_order" smallint DEFAULT 0 NOT NULL,
	"is_main" boolean DEFAULT false NOT NULL,
	"alt_text" varchar(255),
	"uploaded_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE "listing" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"user_id" varchar(255) NOT NULL,
	"listing_type" "listing_type" NOT NULL,
	"property_type" "listing_property_type" NOT NULL,
	"apartment_id" varchar(255),
	"parking_spot_id" varchar(255),
	"title" varchar(255) NOT NULL,
	"description" text,
	"price" integer NOT NULL,
	"utilities_included" boolean DEFAULT true,
	"status" "listing_status" DEFAULT 'draft' NOT NULL,
	"moderated_by" varchar(255),
	"moderated_at" timestamp with time zone,
	"rejection_reason" text,
	"archived_reason" text,
	"archived_by" varchar(255),
	"archived_at" timestamp with time zone,
	"view_count" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"published_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "user_profile" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"user_id" varchar(255) NOT NULL,
	"first_name" varchar(255),
	"last_name" varchar(255),
	"middle_name" varchar(255),
	"display_name" varchar(255),
	"phone" varchar(20),
	"hide_phone" boolean DEFAULT false NOT NULL,
	"hide_name" boolean DEFAULT false NOT NULL,
	"hide_gender" boolean DEFAULT false NOT NULL,
	"hide_birthday" boolean DEFAULT false NOT NULL,
	"avatar" varchar(255),
	"date_of_birth" timestamp,
	"gender" "user_gender_enum"
);
--> statement-breakpoint
ALTER TABLE "user_apartment" ADD COLUMN "revoked_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "user_apartment" ADD COLUMN "revoked_by" varchar(255);--> statement-breakpoint
ALTER TABLE "user_apartment" ADD COLUMN "revocation_template" "revocation_template";--> statement-breakpoint
ALTER TABLE "user_apartment" ADD COLUMN "revocation_reason" text;--> statement-breakpoint
ALTER TABLE "user_apartment" ADD COLUMN "created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL;--> statement-breakpoint
ALTER TABLE "user_parking_spot" ADD COLUMN "revoked_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "user_parking_spot" ADD COLUMN "revoked_by" varchar(255);--> statement-breakpoint
ALTER TABLE "user_parking_spot" ADD COLUMN "revocation_template" "revocation_template";--> statement-breakpoint
ALTER TABLE "user_parking_spot" ADD COLUMN "revocation_reason" text;--> statement-breakpoint
ALTER TABLE "user_parking_spot" ADD COLUMN "created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL;--> statement-breakpoint
ALTER TABLE "claim_document" ADD CONSTRAINT "claim_document_claim_id_property_claim_id_fk" FOREIGN KEY ("claim_id") REFERENCES "public"."property_claim"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "claim_history" ADD CONSTRAINT "claim_history_claim_id_property_claim_id_fk" FOREIGN KEY ("claim_id") REFERENCES "public"."property_claim"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "claim_history" ADD CONSTRAINT "claim_history_changed_by_user_id_fk" FOREIGN KEY ("changed_by") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "property_claim" ADD CONSTRAINT "property_claim_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "property_claim" ADD CONSTRAINT "property_claim_apartment_id_apartment_id_fk" FOREIGN KEY ("apartment_id") REFERENCES "public"."apartment"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "property_claim" ADD CONSTRAINT "property_claim_parking_spot_id_parking_spot_id_fk" FOREIGN KEY ("parking_spot_id") REFERENCES "public"."parking_spot"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "property_claim" ADD CONSTRAINT "property_claim_organization_id_organization_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organization"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "property_claim" ADD CONSTRAINT "property_claim_reviewed_by_user_id_fk" FOREIGN KEY ("reviewed_by") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "listing_photo" ADD CONSTRAINT "listing_photo_listing_id_listing_id_fk" FOREIGN KEY ("listing_id") REFERENCES "public"."listing"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "listing" ADD CONSTRAINT "listing_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "listing" ADD CONSTRAINT "listing_apartment_id_apartment_id_fk" FOREIGN KEY ("apartment_id") REFERENCES "public"."apartment"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "listing" ADD CONSTRAINT "listing_parking_spot_id_parking_spot_id_fk" FOREIGN KEY ("parking_spot_id") REFERENCES "public"."parking_spot"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "listing" ADD CONSTRAINT "listing_moderated_by_user_id_fk" FOREIGN KEY ("moderated_by") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "listing" ADD CONSTRAINT "listing_archived_by_user_id_fk" FOREIGN KEY ("archived_by") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_profile" ADD CONSTRAINT "user_profile_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "claim_document_claim_idx" ON "claim_document" USING btree ("claim_id");--> statement-breakpoint
CREATE INDEX "claim_history_claim_idx" ON "claim_history" USING btree ("claim_id");--> statement-breakpoint
CREATE INDEX "claim_user_idx" ON "property_claim" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "claim_status_idx" ON "property_claim" USING btree ("status");--> statement-breakpoint
CREATE INDEX "listing_photo_listing_idx" ON "listing_photo" USING btree ("listing_id");--> statement-breakpoint
CREATE INDEX "listing_user_idx" ON "listing" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "listing_status_idx" ON "listing" USING btree ("status");--> statement-breakpoint
CREATE INDEX "listing_type_idx" ON "listing" USING btree ("listing_type");--> statement-breakpoint
CREATE INDEX "listing_property_type_idx" ON "listing" USING btree ("property_type");--> statement-breakpoint
ALTER TABLE "user_apartment" ADD CONSTRAINT "user_apartment_revoked_by_user_id_fk" FOREIGN KEY ("revoked_by") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_parking_spot" ADD CONSTRAINT "user_parking_spot_revoked_by_user_id_fk" FOREIGN KEY ("revoked_by") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "user_apartment_revoked_idx" ON "user_apartment" USING btree ("revoked_at");--> statement-breakpoint
CREATE INDEX "user_parking_spot_revoked_idx" ON "user_parking_spot" USING btree ("revoked_at");