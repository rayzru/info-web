CREATE TYPE "public"."attachment_type_enum" AS ENUM('document', 'image', 'archive', 'other');--> statement-breakpoint
CREATE TABLE "publication_attachment" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"publication_id" uuid NOT NULL,
	"file_name" varchar(255) NOT NULL,
	"file_type" "attachment_type_enum" NOT NULL,
	"mime_type" varchar(100) NOT NULL,
	"file_size" integer NOT NULL,
	"url" varchar(500) NOT NULL,
	"description" varchar(255),
	"sort_order" integer DEFAULT 0 NOT NULL,
	"uploaded_by" varchar(255) NOT NULL,
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
ALTER TABLE "publication" ADD COLUMN "event_start_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "publication" ADD COLUMN "event_end_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "publication" ADD COLUMN "event_location" varchar(500);--> statement-breakpoint
ALTER TABLE "publication" ADD COLUMN "event_latitude" text;--> statement-breakpoint
ALTER TABLE "publication" ADD COLUMN "event_longitude" text;--> statement-breakpoint
ALTER TABLE "publication" ADD COLUMN "event_max_attendees" integer;--> statement-breakpoint
ALTER TABLE "publication" ADD COLUMN "event_external_url" varchar(500);--> statement-breakpoint
ALTER TABLE "publication" ADD COLUMN "event_organizer" varchar(255);--> statement-breakpoint
ALTER TABLE "publication" ADD COLUMN "event_organizer_phone" varchar(20);--> statement-breakpoint
ALTER TABLE "publication_attachment" ADD CONSTRAINT "publication_attachment_publication_id_publication_id_fk" FOREIGN KEY ("publication_id") REFERENCES "public"."publication"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "publication_attachment" ADD CONSTRAINT "publication_attachment_uploaded_by_user_id_fk" FOREIGN KEY ("uploaded_by") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "publication_attachment_pub_idx" ON "publication_attachment" USING btree ("publication_id");--> statement-breakpoint
CREATE INDEX "publication_attachment_type_idx" ON "publication_attachment" USING btree ("file_type");