CREATE TABLE "news_tag" (
	"news_id" uuid NOT NULL,
	"tag_id" varchar(255) NOT NULL,
	CONSTRAINT "news_tag_news_id_tag_id_pk" PRIMARY KEY("news_id","tag_id")
);
--> statement-breakpoint
ALTER TABLE "news_tag" ADD CONSTRAINT "news_tag_news_id_news_id_fk" FOREIGN KEY ("news_id") REFERENCES "public"."news"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "news_tag" ADD CONSTRAINT "news_tag_tag_id_directory_tag_id_fk" FOREIGN KEY ("tag_id") REFERENCES "public"."directory_tag"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "news_tag_news_idx" ON "news_tag" USING btree ("news_id");--> statement-breakpoint
CREATE INDEX "news_tag_tag_idx" ON "news_tag" USING btree ("tag_id");