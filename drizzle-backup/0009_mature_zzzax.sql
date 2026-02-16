CREATE TYPE "public"."media_type_enum" AS ENUM('image', 'document', 'video', 'other');--> statement-breakpoint
CREATE TABLE "media" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"filename" varchar(255) NOT NULL,
	"original_filename" varchar(255) NOT NULL,
	"mime_type" varchar(100) NOT NULL,
	"size" integer NOT NULL,
	"path" varchar(500) NOT NULL,
	"url" varchar(500) NOT NULL,
	"width" integer,
	"height" integer,
	"type" "media_type_enum" DEFAULT 'image' NOT NULL,
	"alt" varchar(255),
	"title" varchar(255),
	"description" text,
	"uploaded_by" varchar(255) NOT NULL,
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
ALTER TABLE "media" ADD CONSTRAINT "media_uploaded_by_user_id_fk" FOREIGN KEY ("uploaded_by") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "media_uploaded_by_idx" ON "media" USING btree ("uploaded_by");--> statement-breakpoint
CREATE INDEX "media_type_idx" ON "media" USING btree ("type");--> statement-breakpoint
CREATE INDEX "media_created_at_idx" ON "media" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "media_mime_type_idx" ON "media" USING btree ("mime_type");