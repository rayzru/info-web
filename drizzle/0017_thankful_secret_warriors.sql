CREATE TYPE "public"."publication_target_type_enum" AS ENUM('complex', 'uk', 'building', 'entrance', 'floor');--> statement-breakpoint
CREATE TABLE "publication_target" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"publication_id" uuid NOT NULL,
	"target_type" "publication_target_type_enum" NOT NULL,
	"target_id" varchar(255)
);
--> statement-breakpoint
ALTER TABLE "publication" ADD COLUMN "publish_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "publication" ADD COLUMN "publish_to_telegram" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "publication_target" ADD CONSTRAINT "publication_target_publication_id_publication_id_fk" FOREIGN KEY ("publication_id") REFERENCES "public"."publication"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "publication_target_pub_idx" ON "publication_target" USING btree ("publication_id");--> statement-breakpoint
CREATE INDEX "publication_target_type_idx" ON "publication_target" USING btree ("target_type");--> statement-breakpoint
CREATE INDEX "publication_target_id_idx" ON "publication_target" USING btree ("target_id");