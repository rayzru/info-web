-- Add media tags tables

-- Media tags table
CREATE TABLE IF NOT EXISTS "info_media_tag" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(50) NOT NULL UNIQUE,
	"slug" varchar(50) NOT NULL UNIQUE,
	"color" varchar(7),
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Media to tags junction table
CREATE TABLE IF NOT EXISTS "info_media_to_tag" (
	"media_id" uuid NOT NULL,
	"tag_id" uuid NOT NULL,
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	CONSTRAINT "info_media_to_tag_media_id_tag_id_pk" PRIMARY KEY("media_id","tag_id")
);

-- Indexes
CREATE INDEX IF NOT EXISTS "media_tag_slug_idx" ON "info_media_tag" USING btree ("slug");
CREATE INDEX IF NOT EXISTS "media_to_tag_media_idx" ON "info_media_to_tag" USING btree ("media_id");
CREATE INDEX IF NOT EXISTS "media_to_tag_tag_idx" ON "info_media_to_tag" USING btree ("tag_id");

-- Foreign keys
ALTER TABLE "info_media_to_tag" ADD CONSTRAINT "info_media_to_tag_media_id_media_id_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "info_media_to_tag" ADD CONSTRAINT "info_media_to_tag_tag_id_info_media_tag_id_fk" FOREIGN KEY ("tag_id") REFERENCES "public"."info_media_tag"("id") ON DELETE cascade ON UPDATE no action;
