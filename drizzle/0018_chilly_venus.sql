CREATE TYPE "public"."knowledge_base_status" AS ENUM('draft', 'published', 'archived');--> statement-breakpoint
CREATE TABLE "knowledge_base_article_tag" (
	"article_id" varchar(255) NOT NULL,
	"tag_id" varchar(255) NOT NULL,
	CONSTRAINT "knowledge_base_article_tag_article_id_tag_id_pk" PRIMARY KEY("article_id","tag_id")
);
--> statement-breakpoint
CREATE TABLE "knowledge_base_article" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"slug" varchar(255) NOT NULL,
	"title" varchar(255) NOT NULL,
	"excerpt" text,
	"content" text,
	"status" "knowledge_base_status" DEFAULT 'draft' NOT NULL,
	"building_id" varchar(255),
	"icon" varchar(50),
	"author_id" varchar(255),
	"order" integer DEFAULT 0,
	"view_count" integer DEFAULT 0 NOT NULL,
	"helpful_count" integer DEFAULT 0 NOT NULL,
	"not_helpful_count" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"published_at" timestamp,
	CONSTRAINT "knowledge_base_article_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
ALTER TABLE "knowledge_base_article_tag" ADD CONSTRAINT "knowledge_base_article_tag_article_id_knowledge_base_article_id_fk" FOREIGN KEY ("article_id") REFERENCES "public"."knowledge_base_article"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "knowledge_base_article_tag" ADD CONSTRAINT "knowledge_base_article_tag_tag_id_directory_tag_id_fk" FOREIGN KEY ("tag_id") REFERENCES "public"."directory_tag"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "knowledge_base_article" ADD CONSTRAINT "knowledge_base_article_building_id_building_id_fk" FOREIGN KEY ("building_id") REFERENCES "public"."building"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "knowledge_base_article" ADD CONSTRAINT "knowledge_base_article_author_id_user_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "kb_article_tag_article_idx" ON "knowledge_base_article_tag" USING btree ("article_id");--> statement-breakpoint
CREATE INDEX "kb_article_tag_tag_idx" ON "knowledge_base_article_tag" USING btree ("tag_id");--> statement-breakpoint
CREATE INDEX "kb_article_slug_idx" ON "knowledge_base_article" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "kb_article_status_idx" ON "knowledge_base_article" USING btree ("status");--> statement-breakpoint
CREATE INDEX "kb_article_building_idx" ON "knowledge_base_article" USING btree ("building_id");--> statement-breakpoint
CREATE INDEX "kb_article_author_idx" ON "knowledge_base_article" USING btree ("author_id");