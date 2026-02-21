CREATE TYPE "public"."event_recurrence_type_enum" AS ENUM('none', 'daily', 'weekly', 'monthly', 'yearly');--> statement-breakpoint
ALTER TABLE "publication" ADD COLUMN "event_recurrence_type" "event_recurrence_type_enum" DEFAULT 'none';--> statement-breakpoint
ALTER TABLE "publication" ADD COLUMN "event_recurrence_interval" integer DEFAULT 1;--> statement-breakpoint
ALTER TABLE "publication" ADD COLUMN "event_recurrence_day_of_week" integer;--> statement-breakpoint
ALTER TABLE "publication" ADD COLUMN "event_recurrence_start_day" integer;--> statement-breakpoint
ALTER TABLE "publication" ADD COLUMN "event_recurrence_end_day" integer;--> statement-breakpoint
ALTER TABLE "publication" ADD COLUMN "event_recurrence_until" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "publication" ADD COLUMN "linked_article_id" uuid;