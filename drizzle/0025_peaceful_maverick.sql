ALTER TYPE "public"."apartment_type" ADD VALUE '4k';--> statement-breakpoint
CREATE TABLE "info_media_tag" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(50) NOT NULL,
	"slug" varchar(50) NOT NULL,
	"color" varchar(7),
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	CONSTRAINT "info_media_tag_name_unique" UNIQUE("name"),
	CONSTRAINT "info_media_tag_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "info_media_to_tag" (
	"media_id" uuid NOT NULL,
	"tag_id" uuid NOT NULL,
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	CONSTRAINT "info_media_to_tag_media_id_tag_id_pk" PRIMARY KEY("media_id","tag_id")
);
--> statement-breakpoint
CREATE TABLE "info_news_to_tag" (
	"news_id" uuid NOT NULL,
	"tag_id" uuid NOT NULL,
	"assigned_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	CONSTRAINT "info_news_to_tag_news_id_tag_id_pk" PRIMARY KEY("news_id","tag_id")
);
--> statement-breakpoint
CREATE TABLE "info_publication_to_tag" (
	"publication_id" uuid NOT NULL,
	"tag_id" uuid NOT NULL,
	"assigned_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	CONSTRAINT "info_publication_to_tag_publication_id_tag_id_pk" PRIMARY KEY("publication_id","tag_id")
);
--> statement-breakpoint
CREATE TABLE "info_tag" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(100) NOT NULL,
	"slug" varchar(100) NOT NULL,
	"color" varchar(7),
	"usage_count" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	CONSTRAINT "info_tag_name_unique" UNIQUE("name"),
	CONSTRAINT "info_tag_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
ALTER TABLE "claim_document" ADD COLUMN "thumbnail_url" varchar(500);--> statement-breakpoint
ALTER TABLE "claim_document" ADD COLUMN "scheduled_for_deletion" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "info_media_to_tag" ADD CONSTRAINT "info_media_to_tag_media_id_media_id_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "info_media_to_tag" ADD CONSTRAINT "info_media_to_tag_tag_id_info_media_tag_id_fk" FOREIGN KEY ("tag_id") REFERENCES "public"."info_media_tag"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "info_news_to_tag" ADD CONSTRAINT "info_news_to_tag_news_id_news_id_fk" FOREIGN KEY ("news_id") REFERENCES "public"."news"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "info_news_to_tag" ADD CONSTRAINT "info_news_to_tag_tag_id_info_tag_id_fk" FOREIGN KEY ("tag_id") REFERENCES "public"."info_tag"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "info_publication_to_tag" ADD CONSTRAINT "info_publication_to_tag_publication_id_publication_id_fk" FOREIGN KEY ("publication_id") REFERENCES "public"."publication"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "info_publication_to_tag" ADD CONSTRAINT "info_publication_to_tag_tag_id_info_tag_id_fk" FOREIGN KEY ("tag_id") REFERENCES "public"."info_tag"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "media_tag_slug_idx" ON "info_media_tag" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "media_to_tag_media_idx" ON "info_media_to_tag" USING btree ("media_id");--> statement-breakpoint
CREATE INDEX "media_to_tag_tag_idx" ON "info_media_to_tag" USING btree ("tag_id");--> statement-breakpoint
CREATE INDEX "info_news_to_tag_news_idx" ON "info_news_to_tag" USING btree ("news_id");--> statement-breakpoint
CREATE INDEX "info_news_to_tag_tag_idx" ON "info_news_to_tag" USING btree ("tag_id");--> statement-breakpoint
CREATE INDEX "info_publication_to_tag_publication_idx" ON "info_publication_to_tag" USING btree ("publication_id");--> statement-breakpoint
CREATE INDEX "info_publication_to_tag_tag_idx" ON "info_publication_to_tag" USING btree ("tag_id");--> statement-breakpoint
CREATE INDEX "info_tag_slug_idx" ON "info_tag" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "info_tag_usage_count_idx" ON "info_tag" USING btree ("usage_count");--> statement-breakpoint
CREATE INDEX "claim_document_scheduled_deletion_idx" ON "claim_document" USING btree ("scheduled_for_deletion");