CREATE TYPE "public"."feedback_priority_enum" AS ENUM('low', 'normal', 'high', 'urgent');--> statement-breakpoint
CREATE TYPE "public"."feedback_status_enum" AS ENUM('new', 'in_progress', 'forwarded', 'resolved', 'closed');--> statement-breakpoint
CREATE TYPE "public"."feedback_type_enum" AS ENUM('complaint', 'suggestion', 'request', 'question', 'other');--> statement-breakpoint
CREATE TABLE "feedback" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"type" "feedback_type_enum" DEFAULT 'suggestion' NOT NULL,
	"title" varchar(255),
	"content" text NOT NULL,
	"status" "feedback_status_enum" DEFAULT 'new' NOT NULL,
	"priority" "feedback_priority_enum" DEFAULT 'normal' NOT NULL,
	"contact_name" varchar(255),
	"contact_email" varchar(255),
	"contact_phone" varchar(20),
	"attachments" jsonb DEFAULT '[]'::jsonb,
	"photos" jsonb DEFAULT '[]'::jsonb,
	"submitted_by_user_id" varchar(255),
	"ip_address" varchar(45),
	"user_agent" text,
	"is_anonymous" boolean DEFAULT true NOT NULL,
	"assigned_to_id" varchar(255),
	"forwarded_to" varchar(500),
	"internal_note" text,
	"response" text,
	"responded_at" timestamp with time zone,
	"responded_by_id" varchar(255),
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);
--> statement-breakpoint
ALTER TABLE "feedback" ADD CONSTRAINT "feedback_submitted_by_user_id_user_id_fk" FOREIGN KEY ("submitted_by_user_id") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "feedback" ADD CONSTRAINT "feedback_assigned_to_id_user_id_fk" FOREIGN KEY ("assigned_to_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "feedback" ADD CONSTRAINT "feedback_responded_by_id_user_id_fk" FOREIGN KEY ("responded_by_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "feedback_type_idx" ON "feedback" USING btree ("type");--> statement-breakpoint
CREATE INDEX "feedback_status_idx" ON "feedback" USING btree ("status");--> statement-breakpoint
CREATE INDEX "feedback_priority_idx" ON "feedback" USING btree ("priority");--> statement-breakpoint
CREATE INDEX "feedback_created_at_idx" ON "feedback" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "feedback_ip_idx" ON "feedback" USING btree ("ip_address");