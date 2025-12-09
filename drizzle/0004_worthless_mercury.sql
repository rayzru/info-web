CREATE TYPE "public"."notification_category_enum" AS ENUM('claims', 'messages', 'system');--> statement-breakpoint
CREATE TYPE "public"."notification_type_enum" AS ENUM('claim_submitted', 'claim_approved', 'claim_rejected', 'claim_cancelled', 'claim_documents', 'tenant_claim', 'property_revoked', 'message', 'system', 'admin');--> statement-breakpoint
CREATE TABLE "notification" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"user_id" varchar(255) NOT NULL,
	"from_user_id" varchar(255),
	"type" "notification_type_enum" NOT NULL,
	"category" "notification_category_enum" NOT NULL,
	"title" varchar(255) NOT NULL,
	"message" text,
	"entity_type" varchar(50),
	"entity_id" varchar(255),
	"action_url" varchar(500),
	"is_read" boolean DEFAULT false NOT NULL,
	"read_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
ALTER TABLE "notification" ADD CONSTRAINT "notification_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "notification" ADD CONSTRAINT "notification_from_user_id_user_id_fk" FOREIGN KEY ("from_user_id") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "notification_user_id_idx" ON "notification" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "notification_user_unread_idx" ON "notification" USING btree ("user_id","is_read");--> statement-breakpoint
CREATE INDEX "notification_created_at_idx" ON "notification" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "notification_entity_idx" ON "notification" USING btree ("entity_type","entity_id");