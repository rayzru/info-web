CREATE TYPE "public"."channel_type" AS ENUM('telegram', 'max', 'whatsapp', 'vk', 'email', 'other');--> statement-breakpoint
CREATE TYPE "public"."directory_contact_type" AS ENUM('phone', 'email', 'address', 'telegram', 'whatsapp', 'website', 'vk', 'other');--> statement-breakpoint
CREATE TYPE "public"."directory_entry_type" AS ENUM('contact', 'organization', 'location', 'document');--> statement-breakpoint
CREATE TYPE "public"."directory_event_type" AS ENUM('search', 'tag_click', 'entry_view', 'entry_call', 'entry_link');--> statement-breakpoint
CREATE TYPE "public"."directory_scope" AS ENUM('core', 'commerce', 'city', 'promoted');--> statement-breakpoint
CREATE TABLE "building_channel" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"building_id" varchar(255),
	"channel_type" "channel_type" NOT NULL,
	"channel_id" varchar(500) NOT NULL,
	"name" varchar(255),
	"is_active" integer DEFAULT 1 NOT NULL,
	"is_primary" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "directory_analytics" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"event_type" "directory_event_type" NOT NULL,
	"search_query" varchar(255),
	"tag_id" varchar(255),
	"entry_id" varchar(255),
	"contact_id" varchar(255),
	"user_id" varchar(255),
	"results_count" integer,
	"metadata" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "directory_contact_tag" (
	"contact_id" varchar(255) NOT NULL,
	"tag_id" varchar(255) NOT NULL,
	CONSTRAINT "directory_contact_tag_contact_id_tag_id_pk" PRIMARY KEY("contact_id","tag_id")
);
--> statement-breakpoint
CREATE TABLE "directory_contact" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"entry_id" varchar(255) NOT NULL,
	"type" "directory_contact_type" NOT NULL,
	"value" varchar(500) NOT NULL,
	"label" varchar(100),
	"subtitle" varchar(255),
	"is_primary" integer DEFAULT 0 NOT NULL,
	"order" integer DEFAULT 0,
	"has_whatsapp" integer DEFAULT 0 NOT NULL,
	"has_telegram" integer DEFAULT 0 NOT NULL,
	"is_24h" integer DEFAULT 0 NOT NULL,
	"schedule_note" varchar(255)
);
--> statement-breakpoint
CREATE TABLE "directory_entry" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"slug" varchar(255) NOT NULL,
	"type" "directory_entry_type" NOT NULL,
	"title" varchar(255) NOT NULL,
	"subtitle" varchar(255),
	"description" text,
	"content" text,
	"building_id" varchar(255),
	"floor_number" smallint,
	"icon" varchar(50),
	"order" integer DEFAULT 0,
	"is_active" integer DEFAULT 1 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "directory_entry_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "directory_entry_stats" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"entry_id" varchar(255) NOT NULL,
	"view_count" integer DEFAULT 0 NOT NULL,
	"call_count" integer DEFAULT 0 NOT NULL,
	"link_count" integer DEFAULT 0 NOT NULL,
	"last_viewed_at" timestamp,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "directory_entry_stats_entry_id_unique" UNIQUE("entry_id")
);
--> statement-breakpoint
CREATE TABLE "directory_entry_tag" (
	"entry_id" varchar(255) NOT NULL,
	"tag_id" varchar(255) NOT NULL,
	CONSTRAINT "directory_entry_tag_entry_id_tag_id_pk" PRIMARY KEY("entry_id","tag_id")
);
--> statement-breakpoint
CREATE TABLE "directory_schedule" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"entry_id" varchar(255) NOT NULL,
	"day_of_week" smallint NOT NULL,
	"open_time" time,
	"close_time" time,
	"note" varchar(255)
);
--> statement-breakpoint
CREATE TABLE "directory_tag_stats" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"tag_id" varchar(255) NOT NULL,
	"click_count" integer DEFAULT 0 NOT NULL,
	"view_count" integer DEFAULT 0 NOT NULL,
	"last_clicked_at" timestamp,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "directory_tag_stats_tag_id_unique" UNIQUE("tag_id")
);
--> statement-breakpoint
CREATE TABLE "directory_tag" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"name" varchar(100) NOT NULL,
	"slug" varchar(100) NOT NULL,
	"description" text,
	"parent_id" varchar(255),
	"scope" "directory_scope" DEFAULT 'core' NOT NULL,
	"synonyms" text,
	"icon" varchar(50),
	"order" integer DEFAULT 0,
	CONSTRAINT "directory_tag_name_unique" UNIQUE("name"),
	CONSTRAINT "directory_tag_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
ALTER TABLE "claim_history" ALTER COLUMN "from_status" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "claim_history" ALTER COLUMN "to_status" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "property_claim" ALTER COLUMN "status" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "property_claim" ALTER COLUMN "status" SET DEFAULT 'pending'::text;--> statement-breakpoint
DROP TYPE "public"."claim_status";--> statement-breakpoint
CREATE TYPE "public"."claim_status" AS ENUM('pending', 'review', 'approved', 'rejected', 'documents_requested');--> statement-breakpoint
ALTER TABLE "claim_history" ALTER COLUMN "from_status" SET DATA TYPE "public"."claim_status" USING "from_status"::"public"."claim_status";--> statement-breakpoint
ALTER TABLE "claim_history" ALTER COLUMN "to_status" SET DATA TYPE "public"."claim_status" USING "to_status"::"public"."claim_status";--> statement-breakpoint
ALTER TABLE "property_claim" ALTER COLUMN "status" SET DEFAULT 'pending'::"public"."claim_status";--> statement-breakpoint
ALTER TABLE "property_claim" ALTER COLUMN "status" SET DATA TYPE "public"."claim_status" USING "status"::"public"."claim_status";--> statement-breakpoint
ALTER TABLE "building_channel" ADD CONSTRAINT "building_channel_building_id_building_id_fk" FOREIGN KEY ("building_id") REFERENCES "public"."building"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "directory_analytics" ADD CONSTRAINT "directory_analytics_tag_id_directory_tag_id_fk" FOREIGN KEY ("tag_id") REFERENCES "public"."directory_tag"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "directory_analytics" ADD CONSTRAINT "directory_analytics_entry_id_directory_entry_id_fk" FOREIGN KEY ("entry_id") REFERENCES "public"."directory_entry"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "directory_analytics" ADD CONSTRAINT "directory_analytics_contact_id_directory_contact_id_fk" FOREIGN KEY ("contact_id") REFERENCES "public"."directory_contact"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "directory_contact_tag" ADD CONSTRAINT "directory_contact_tag_contact_id_directory_contact_id_fk" FOREIGN KEY ("contact_id") REFERENCES "public"."directory_contact"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "directory_contact_tag" ADD CONSTRAINT "directory_contact_tag_tag_id_directory_tag_id_fk" FOREIGN KEY ("tag_id") REFERENCES "public"."directory_tag"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "directory_contact" ADD CONSTRAINT "directory_contact_entry_id_directory_entry_id_fk" FOREIGN KEY ("entry_id") REFERENCES "public"."directory_entry"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "directory_entry" ADD CONSTRAINT "directory_entry_building_id_building_id_fk" FOREIGN KEY ("building_id") REFERENCES "public"."building"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "directory_entry_stats" ADD CONSTRAINT "directory_entry_stats_entry_id_directory_entry_id_fk" FOREIGN KEY ("entry_id") REFERENCES "public"."directory_entry"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "directory_entry_tag" ADD CONSTRAINT "directory_entry_tag_entry_id_directory_entry_id_fk" FOREIGN KEY ("entry_id") REFERENCES "public"."directory_entry"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "directory_entry_tag" ADD CONSTRAINT "directory_entry_tag_tag_id_directory_tag_id_fk" FOREIGN KEY ("tag_id") REFERENCES "public"."directory_tag"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "directory_schedule" ADD CONSTRAINT "directory_schedule_entry_id_directory_entry_id_fk" FOREIGN KEY ("entry_id") REFERENCES "public"."directory_entry"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "directory_tag_stats" ADD CONSTRAINT "directory_tag_stats_tag_id_directory_tag_id_fk" FOREIGN KEY ("tag_id") REFERENCES "public"."directory_tag"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "building_channel_building_idx" ON "building_channel" USING btree ("building_id");--> statement-breakpoint
CREATE INDEX "building_channel_type_idx" ON "building_channel" USING btree ("channel_type");--> statement-breakpoint
CREATE INDEX "building_channel_active_idx" ON "building_channel" USING btree ("is_active");--> statement-breakpoint
CREATE INDEX "directory_analytics_event_type_idx" ON "directory_analytics" USING btree ("event_type");--> statement-breakpoint
CREATE INDEX "directory_analytics_tag_idx" ON "directory_analytics" USING btree ("tag_id");--> statement-breakpoint
CREATE INDEX "directory_analytics_entry_idx" ON "directory_analytics" USING btree ("entry_id");--> statement-breakpoint
CREATE INDEX "directory_analytics_user_idx" ON "directory_analytics" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "directory_analytics_created_idx" ON "directory_analytics" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "directory_contact_tag_contact_idx" ON "directory_contact_tag" USING btree ("contact_id");--> statement-breakpoint
CREATE INDEX "directory_contact_tag_tag_idx" ON "directory_contact_tag" USING btree ("tag_id");--> statement-breakpoint
CREATE INDEX "directory_contact_entry_idx" ON "directory_contact" USING btree ("entry_id");--> statement-breakpoint
CREATE INDEX "directory_contact_type_idx" ON "directory_contact" USING btree ("type");--> statement-breakpoint
CREATE INDEX "directory_entry_type_idx" ON "directory_entry" USING btree ("type");--> statement-breakpoint
CREATE INDEX "directory_entry_slug_idx" ON "directory_entry" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "directory_entry_building_idx" ON "directory_entry" USING btree ("building_id");--> statement-breakpoint
CREATE INDEX "directory_entry_stats_views_idx" ON "directory_entry_stats" USING btree ("view_count");--> statement-breakpoint
CREATE INDEX "directory_entry_stats_calls_idx" ON "directory_entry_stats" USING btree ("call_count");--> statement-breakpoint
CREATE INDEX "directory_entry_tag_entry_idx" ON "directory_entry_tag" USING btree ("entry_id");--> statement-breakpoint
CREATE INDEX "directory_entry_tag_tag_idx" ON "directory_entry_tag" USING btree ("tag_id");--> statement-breakpoint
CREATE INDEX "directory_schedule_entry_idx" ON "directory_schedule" USING btree ("entry_id");--> statement-breakpoint
CREATE INDEX "directory_tag_stats_clicks_idx" ON "directory_tag_stats" USING btree ("click_count");--> statement-breakpoint
CREATE INDEX "directory_tag_stats_views_idx" ON "directory_tag_stats" USING btree ("view_count");--> statement-breakpoint
CREATE INDEX "directory_tag_slug_idx" ON "directory_tag" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "directory_tag_parent_idx" ON "directory_tag" USING btree ("parent_id");--> statement-breakpoint
CREATE INDEX "directory_tag_scope_idx" ON "directory_tag" USING btree ("scope");