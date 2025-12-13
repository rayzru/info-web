CREATE TYPE "public"."news_status_enum" AS ENUM('draft', 'scheduled', 'published', 'archived');--> statement-breakpoint
CREATE TYPE "public"."news_type_enum" AS ENUM('announcement', 'event', 'maintenance', 'update', 'community', 'urgent');--> statement-breakpoint
CREATE TABLE "news" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" varchar(255) NOT NULL,
	"slug" varchar(255) NOT NULL,
	"excerpt" text,
	"cover_image" varchar(500),
	"content" jsonb NOT NULL,
	"type" "news_type_enum" DEFAULT 'announcement' NOT NULL,
	"status" "news_status_enum" DEFAULT 'draft' NOT NULL,
	"publish_at" timestamp with time zone,
	"is_pinned" boolean DEFAULT false NOT NULL,
	"is_highlighted" boolean DEFAULT false NOT NULL,
	"author_id" varchar(255) NOT NULL,
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT "news_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
ALTER TABLE "contact_group_tags" ALTER COLUMN "contact_group_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "contact_group_tags" ALTER COLUMN "tag_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "news" ADD CONSTRAINT "news_author_id_user_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "news_slug_idx" ON "news" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "news_status_idx" ON "news" USING btree ("status");--> statement-breakpoint
CREATE INDEX "news_type_idx" ON "news" USING btree ("type");--> statement-breakpoint
CREATE INDEX "news_publish_at_idx" ON "news" USING btree ("publish_at");--> statement-breakpoint
CREATE INDEX "news_author_idx" ON "news" USING btree ("author_id");