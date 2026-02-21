CREATE TYPE "public"."moderation_vote_enum" AS ENUM('approve', 'reject', 'request_changes');--> statement-breakpoint
CREATE TABLE "publication_moderation_vote" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"publication_id" uuid NOT NULL,
	"moderator_id" varchar(255) NOT NULL,
	"vote" "moderation_vote_enum" NOT NULL,
	"comment" text,
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);
--> statement-breakpoint
ALTER TABLE "publication_moderation_vote" ADD CONSTRAINT "publication_moderation_vote_publication_id_publication_id_fk" FOREIGN KEY ("publication_id") REFERENCES "public"."publication"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "publication_moderation_vote" ADD CONSTRAINT "publication_moderation_vote_moderator_id_user_id_fk" FOREIGN KEY ("moderator_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "pub_mod_vote_pub_idx" ON "publication_moderation_vote" USING btree ("publication_id");--> statement-breakpoint
CREATE INDEX "pub_mod_vote_mod_idx" ON "publication_moderation_vote" USING btree ("moderator_id");--> statement-breakpoint
CREATE INDEX "pub_mod_vote_vote_idx" ON "publication_moderation_vote" USING btree ("vote");