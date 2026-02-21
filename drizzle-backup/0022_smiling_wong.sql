CREATE TYPE "public"."audit_action_enum" AS ENUM('user_created', 'user_updated', 'user_deleted', 'user_restored', 'user_password_changed', 'user_password_reset_requested', 'user_email_verified', 'user_profile_updated', 'role_granted', 'role_revoked', 'user_blocked', 'user_unblocked', 'deletion_requested', 'deletion_approved', 'deletion_rejected', 'deletion_completed', 'claim_created', 'claim_status_changed', 'claim_approved', 'claim_rejected', 'claim_documents_requested', 'listing_created', 'listing_updated', 'listing_submitted', 'listing_approved', 'listing_rejected', 'listing_archived', 'listing_renewed', 'listing_deleted', 'publication_created', 'publication_updated', 'publication_submitted', 'publication_approved', 'publication_rejected', 'publication_archived', 'publication_published', 'publication_pinned', 'publication_unpinned', 'publication_moderation_vote', 'publication_deleted', 'news_created', 'news_updated', 'news_published', 'news_scheduled', 'news_archived', 'news_deleted', 'news_telegram_sent', 'feedback_created', 'feedback_status_changed', 'feedback_priority_changed', 'feedback_assigned', 'feedback_forwarded', 'feedback_responded', 'feedback_closed', 'feedback_reopened', 'directory_item_created', 'directory_item_updated', 'directory_item_deleted', 'directory_category_created', 'directory_category_updated', 'directory_category_deleted', 'building_created', 'building_updated', 'apartment_created', 'apartment_updated', 'parking_created', 'parking_updated', 'settings_updated', 'entity_viewed', 'entity_exported');--> statement-breakpoint
CREATE TYPE "public"."audit_entity_type_enum" AS ENUM('user', 'user_role', 'user_block', 'deletion_request', 'property_claim', 'listing', 'news', 'publication', 'feedback', 'directory_category', 'directory_item', 'directory_tag', 'building', 'apartment', 'parking', 'settings');--> statement-breakpoint
CREATE TYPE "public"."feedback_history_action_enum" AS ENUM('created', 'status_changed', 'priority_changed', 'assigned', 'unassigned', 'forwarded', 'responded', 'note_added', 'closed', 'reopened');--> statement-breakpoint
CREATE TYPE "public"."publication_history_action_enum" AS ENUM('created', 'updated', 'submitted', 'approved', 'rejected', 'archived', 'published', 'pinned', 'unpinned', 'moderation_vote');--> statement-breakpoint
CREATE TABLE "audit_log" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"entity_type" "audit_entity_type_enum" NOT NULL,
	"entity_id" varchar(255) NOT NULL,
	"action" "audit_action_enum" NOT NULL,
	"actor_id" varchar(255),
	"previous_state" jsonb,
	"new_state" jsonb,
	"changed_fields" jsonb,
	"description" text NOT NULL,
	"metadata" jsonb,
	"ip_address" varchar(45),
	"user_agent" text,
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE "feedback_history" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"feedback_id" uuid NOT NULL,
	"action" "feedback_history_action_enum" NOT NULL,
	"from_status" "feedback_status_enum",
	"to_status" "feedback_status_enum",
	"from_priority" "feedback_priority_enum",
	"to_priority" "feedback_priority_enum",
	"assigned_to_id" varchar(255),
	"forwarded_to" varchar(500),
	"response" text,
	"internal_note" text,
	"changed_by_id" varchar(255),
	"description" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE "publication_history" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"publication_id" uuid NOT NULL,
	"action" "publication_history_action_enum" NOT NULL,
	"from_status" "publication_status_enum",
	"to_status" "publication_status_enum",
	"moderation_comment" text,
	"changed_by_id" varchar(255) NOT NULL,
	"description" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
ALTER TABLE "feedback" ADD COLUMN "is_deleted" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "feedback" ADD COLUMN "deleted_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "feedback" ADD COLUMN "deleted_by_id" varchar(255);--> statement-breakpoint
ALTER TABLE "feedback" ADD COLUMN "delete_reason" text;--> statement-breakpoint
ALTER TABLE "audit_log" ADD CONSTRAINT "audit_log_actor_id_user_id_fk" FOREIGN KEY ("actor_id") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "feedback_history" ADD CONSTRAINT "feedback_history_feedback_id_feedback_id_fk" FOREIGN KEY ("feedback_id") REFERENCES "public"."feedback"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "feedback_history" ADD CONSTRAINT "feedback_history_assigned_to_id_user_id_fk" FOREIGN KEY ("assigned_to_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "feedback_history" ADD CONSTRAINT "feedback_history_changed_by_id_user_id_fk" FOREIGN KEY ("changed_by_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "publication_history" ADD CONSTRAINT "publication_history_publication_id_publication_id_fk" FOREIGN KEY ("publication_id") REFERENCES "public"."publication"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "publication_history" ADD CONSTRAINT "publication_history_changed_by_id_user_id_fk" FOREIGN KEY ("changed_by_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "audit_log_entity_idx" ON "audit_log" USING btree ("entity_type","entity_id");--> statement-breakpoint
CREATE INDEX "audit_log_action_idx" ON "audit_log" USING btree ("action");--> statement-breakpoint
CREATE INDEX "audit_log_actor_idx" ON "audit_log" USING btree ("actor_id");--> statement-breakpoint
CREATE INDEX "audit_log_created_at_idx" ON "audit_log" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "audit_log_entity_created_idx" ON "audit_log" USING btree ("entity_type","entity_id","created_at");--> statement-breakpoint
CREATE INDEX "feedback_history_feedback_idx" ON "feedback_history" USING btree ("feedback_id");--> statement-breakpoint
CREATE INDEX "feedback_history_action_idx" ON "feedback_history" USING btree ("action");--> statement-breakpoint
CREATE INDEX "feedback_history_created_at_idx" ON "feedback_history" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "publication_history_pub_idx" ON "publication_history" USING btree ("publication_id");--> statement-breakpoint
CREATE INDEX "publication_history_action_idx" ON "publication_history" USING btree ("action");--> statement-breakpoint
CREATE INDEX "publication_history_created_at_idx" ON "publication_history" USING btree ("created_at");--> statement-breakpoint
ALTER TABLE "feedback" ADD CONSTRAINT "feedback_deleted_by_id_user_id_fk" FOREIGN KEY ("deleted_by_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "feedback_is_deleted_idx" ON "feedback" USING btree ("is_deleted");--> statement-breakpoint
CREATE INDEX "feedback_assigned_idx" ON "feedback" USING btree ("assigned_to_id");