CREATE TYPE "public"."publication_status_enum" AS ENUM('draft', 'pending', 'published', 'rejected', 'archived');--> statement-breakpoint
CREATE TYPE "public"."publication_type_enum" AS ENUM('announcement', 'event', 'help_request', 'lost_found', 'recommendation', 'question', 'discussion');--> statement-breakpoint
CREATE TABLE "publication_tag" (
	"publication_id" uuid NOT NULL,
	"tag_id" varchar(255) NOT NULL,
	CONSTRAINT "publication_tag_publication_id_tag_id_pk" PRIMARY KEY("publication_id","tag_id")
);
--> statement-breakpoint
CREATE TABLE "publication" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" varchar(255) NOT NULL,
	"content" jsonb NOT NULL,
	"cover_image" varchar(500),
	"type" "publication_type_enum" DEFAULT 'announcement' NOT NULL,
	"status" "publication_status_enum" DEFAULT 'draft' NOT NULL,
	"building_id" varchar(255),
	"is_pinned" boolean DEFAULT false NOT NULL,
	"is_urgent" boolean DEFAULT false NOT NULL,
	"author_id" varchar(255) NOT NULL,
	"moderated_by" varchar(255),
	"moderated_at" timestamp with time zone,
	"moderation_comment" text,
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);
--> statement-breakpoint
ALTER TABLE "publication_tag" ADD CONSTRAINT "publication_tag_publication_id_publication_id_fk" FOREIGN KEY ("publication_id") REFERENCES "public"."publication"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "publication_tag" ADD CONSTRAINT "publication_tag_tag_id_directory_tag_id_fk" FOREIGN KEY ("tag_id") REFERENCES "public"."directory_tag"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "publication" ADD CONSTRAINT "publication_building_id_building_id_fk" FOREIGN KEY ("building_id") REFERENCES "public"."building"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "publication" ADD CONSTRAINT "publication_author_id_user_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "publication" ADD CONSTRAINT "publication_moderated_by_user_id_fk" FOREIGN KEY ("moderated_by") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "publication_tag_pub_idx" ON "publication_tag" USING btree ("publication_id");--> statement-breakpoint
CREATE INDEX "publication_tag_tag_idx" ON "publication_tag" USING btree ("tag_id");--> statement-breakpoint
CREATE INDEX "publication_status_idx" ON "publication" USING btree ("status");--> statement-breakpoint
CREATE INDEX "publication_type_idx" ON "publication" USING btree ("type");--> statement-breakpoint
CREATE INDEX "publication_author_idx" ON "publication" USING btree ("author_id");--> statement-breakpoint
CREATE INDEX "publication_building_idx" ON "publication" USING btree ("building_id");--> statement-breakpoint
CREATE INDEX "publication_created_at_idx" ON "publication" USING btree ("created_at");