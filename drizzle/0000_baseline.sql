CREATE TYPE "public"."analytics_device_type" AS ENUM('desktop', 'mobile', 'tablet', 'unknown');--> statement-breakpoint
CREATE TYPE "public"."analytics_event_type" AS ENUM('page_view', 'action', 'conversion');--> statement-breakpoint
CREATE TYPE "public"."audit_action_enum" AS ENUM('user_created', 'user_updated', 'user_deleted', 'user_restored', 'user_password_changed', 'user_password_reset_requested', 'user_email_verified', 'user_profile_updated', 'role_granted', 'role_revoked', 'user_blocked', 'user_unblocked', 'deletion_requested', 'deletion_approved', 'deletion_rejected', 'deletion_completed', 'claim_created', 'claim_status_changed', 'claim_approved', 'claim_rejected', 'claim_documents_requested', 'listing_created', 'listing_updated', 'listing_submitted', 'listing_approved', 'listing_rejected', 'listing_archived', 'listing_renewed', 'listing_deleted', 'publication_created', 'publication_updated', 'publication_submitted', 'publication_approved', 'publication_rejected', 'publication_archived', 'publication_published', 'publication_pinned', 'publication_unpinned', 'publication_moderation_vote', 'publication_deleted', 'news_created', 'news_updated', 'news_published', 'news_scheduled', 'news_archived', 'news_deleted', 'news_telegram_sent', 'feedback_created', 'feedback_status_changed', 'feedback_priority_changed', 'feedback_assigned', 'feedback_forwarded', 'feedback_responded', 'feedback_closed', 'feedback_reopened', 'directory_item_created', 'directory_item_updated', 'directory_item_deleted', 'directory_category_created', 'directory_category_updated', 'directory_category_deleted', 'building_created', 'building_updated', 'apartment_created', 'apartment_updated', 'parking_created', 'parking_updated', 'settings_updated', 'entity_viewed', 'entity_exported');--> statement-breakpoint
CREATE TYPE "public"."audit_entity_type_enum" AS ENUM('user', 'user_role', 'user_block', 'deletion_request', 'property_claim', 'listing', 'news', 'publication', 'feedback', 'directory_category', 'directory_item', 'directory_tag', 'building', 'apartment', 'parking', 'settings');--> statement-breakpoint
CREATE TYPE "public"."apartment_type" AS ENUM('studio', '1k', '2k', '3k', '4k');--> statement-breakpoint
CREATE TYPE "public"."channel_type" AS ENUM('telegram', 'max', 'whatsapp', 'vk', 'email', 'other');--> statement-breakpoint
CREATE TYPE "public"."claim_status" AS ENUM('pending', 'review', 'approved', 'rejected', 'documents_requested');--> statement-breakpoint
CREATE TYPE "public"."claim_type" AS ENUM('apartment', 'parking', 'commercial');--> statement-breakpoint
CREATE TYPE "public"."resolution_template" AS ENUM('approved_all_correct', 'approved_custom', 'rejected_no_documents', 'rejected_invalid_documents', 'rejected_no_reason', 'rejected_custom');--> statement-breakpoint
CREATE TYPE "public"."deletion_request_status" AS ENUM('pending', 'approved', 'rejected', 'completed');--> statement-breakpoint
CREATE TYPE "public"."directory_contact_type" AS ENUM('phone', 'email', 'address', 'telegram', 'whatsapp', 'website', 'vk', 'other');--> statement-breakpoint
CREATE TYPE "public"."directory_entry_type" AS ENUM('contact', 'organization', 'location', 'document');--> statement-breakpoint
CREATE TYPE "public"."directory_event_type" AS ENUM('search', 'tag_click', 'entry_view', 'entry_call', 'entry_link');--> statement-breakpoint
CREATE TYPE "public"."directory_scope" AS ENUM('core', 'commerce', 'city', 'promoted');--> statement-breakpoint
CREATE TYPE "public"."knowledge_base_status" AS ENUM('draft', 'published', 'archived');--> statement-breakpoint
CREATE TYPE "public"."feedback_history_action_enum" AS ENUM('created', 'status_changed', 'priority_changed', 'assigned', 'unassigned', 'forwarded', 'responded', 'note_added', 'closed', 'reopened', 'deleted');--> statement-breakpoint
CREATE TYPE "public"."feedback_priority_enum" AS ENUM('low', 'normal', 'high', 'urgent');--> statement-breakpoint
CREATE TYPE "public"."feedback_status_enum" AS ENUM('new', 'in_progress', 'forwarded', 'resolved', 'closed');--> statement-breakpoint
CREATE TYPE "public"."feedback_type_enum" AS ENUM('complaint', 'suggestion', 'request', 'question', 'other');--> statement-breakpoint
CREATE TYPE "public"."listing_archive_reason" AS ENUM('manual', 'expired', 'rights_revoked', 'admin');--> statement-breakpoint
CREATE TYPE "public"."listing_property_type" AS ENUM('apartment', 'parking');--> statement-breakpoint
CREATE TYPE "public"."listing_status" AS ENUM('draft', 'pending_moderation', 'approved', 'rejected', 'archived');--> statement-breakpoint
CREATE TYPE "public"."listing_type" AS ENUM('rent', 'sale');--> statement-breakpoint
CREATE TYPE "public"."media_type_enum" AS ENUM('image', 'document', 'video', 'other');--> statement-breakpoint
CREATE TYPE "public"."message_complaint_status" AS ENUM('pending', 'reviewed', 'resolved', 'dismissed');--> statement-breakpoint
CREATE TYPE "public"."message_complaint_type" AS ENUM('spam', 'harassment', 'fraud', 'inappropriate', 'other');--> statement-breakpoint
CREATE TYPE "public"."message_scope" AS ENUM('complex', 'building', 'entrance', 'floor', 'apartment', 'parking', 'parking_floor', 'parking_spot', 'uk', 'chairman');--> statement-breakpoint
CREATE TYPE "public"."message_status" AS ENUM('draft', 'pending', 'sent', 'delivered', 'rejected');--> statement-breakpoint
CREATE TYPE "public"."news_status_enum" AS ENUM('draft', 'scheduled', 'published', 'archived');--> statement-breakpoint
CREATE TYPE "public"."news_type_enum" AS ENUM('announcement', 'event', 'maintenance', 'update', 'community', 'urgent');--> statement-breakpoint
CREATE TYPE "public"."notification_category_enum" AS ENUM('claims', 'messages', 'system');--> statement-breakpoint
CREATE TYPE "public"."notification_type_enum" AS ENUM('claim_submitted', 'claim_approved', 'claim_rejected', 'claim_cancelled', 'claim_documents', 'tenant_claim', 'property_revoked', 'message', 'system', 'admin');--> statement-breakpoint
CREATE TYPE "public"."organization_type" AS ENUM('store', 'restaurant', 'service', 'other');--> statement-breakpoint
CREATE TYPE "public"."parking_spot_type" AS ENUM('moto', 'standard', 'wide');--> statement-breakpoint
CREATE TYPE "public"."attachment_type_enum" AS ENUM('document', 'image', 'archive', 'other');--> statement-breakpoint
CREATE TYPE "public"."event_recurrence_type_enum" AS ENUM('none', 'daily', 'weekly', 'monthly', 'yearly');--> statement-breakpoint
CREATE TYPE "public"."moderation_vote_enum" AS ENUM('approve', 'reject', 'request_changes');--> statement-breakpoint
CREATE TYPE "public"."publication_history_action_enum" AS ENUM('created', 'updated', 'submitted', 'approved', 'rejected', 'archived', 'published', 'pinned', 'unpinned', 'moderation_vote');--> statement-breakpoint
CREATE TYPE "public"."publication_status_enum" AS ENUM('draft', 'pending', 'published', 'rejected', 'archived');--> statement-breakpoint
CREATE TYPE "public"."publication_target_type_enum" AS ENUM('complex', 'uk', 'building', 'entrance', 'floor');--> statement-breakpoint
CREATE TYPE "public"."publication_type_enum" AS ENUM('announcement', 'event', 'help_request', 'lost_found', 'recommendation', 'question', 'discussion');--> statement-breakpoint
CREATE TYPE "public"."block_category_enum" AS ENUM('rules_violation', 'fraud', 'spam', 'abuse', 'other');--> statement-breakpoint
CREATE TYPE "public"."map_provider_enum" AS ENUM('yandex', '2gis', 'google', 'apple', 'osm');--> statement-breakpoint
CREATE TYPE "public"."rules_violation_enum" AS ENUM('3.1', '3.2', '3.3', '3.4', '3.5', '4.1', '4.2', '4.3', '5.1', '5.2');--> statement-breakpoint
CREATE TYPE "public"."user_gender_enum" AS ENUM('Male', 'Female', 'Unspecified');--> statement-breakpoint
CREATE TYPE "public"."user_role_enum" AS ENUM('Root', 'SuperAdmin', 'Admin', 'ApartmentOwner', 'ApartmentResident', 'ParkingOwner', 'ParkingResident', 'Editor', 'Moderator', 'Guest', 'BuildingChairman', 'ComplexChairman', 'ComplexRepresenative', 'StoreOwner', 'StoreRepresenative');--> statement-breakpoint
CREATE TYPE "public"."revocation_template" AS ENUM('community_rules_violation', 'role_owner_change', 'custom');--> statement-breakpoint
CREATE TYPE "public"."user_property_status" AS ENUM('pending', 'approved', 'rejected');--> statement-breakpoint
CREATE TABLE "analytics_conversion" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(100) NOT NULL,
	"description" varchar(500),
	"event_name" varchar(100) NOT NULL,
	"default_value" varchar(20),
	"is_active" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	CONSTRAINT "analytics_conversion_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "analytics_event" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"session_id" uuid NOT NULL,
	"user_id" varchar(255),
	"event_type" "analytics_event_type" NOT NULL,
	"event_name" varchar(100) NOT NULL,
	"event_category" varchar(50),
	"page_path" varchar(500) NOT NULL,
	"page_title" varchar(200),
	"referrer" varchar(1000),
	"properties" jsonb,
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"load_time_ms" varchar(10)
);
--> statement-breakpoint
CREATE TABLE "analytics_session" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" varchar(255),
	"started_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"last_activity_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"device_type" "analytics_device_type" DEFAULT 'unknown' NOT NULL,
	"browser" varchar(100),
	"os" varchar(100),
	"screen_resolution" varchar(20),
	"entry_page" varchar(500) NOT NULL,
	"referrer" varchar(1000),
	"utm_source" varchar(100),
	"utm_medium" varchar(100),
	"utm_campaign" varchar(100),
	"utm_term" varchar(100),
	"utm_content" varchar(100),
	"country" varchar(2),
	"city" varchar(100)
);
--> statement-breakpoint
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
CREATE TABLE "apartment" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"floor_id" varchar(255) NOT NULL,
	"number" varchar(10) NOT NULL,
	"type" "apartment_type" NOT NULL,
	"layout_code" varchar(255)
);
--> statement-breakpoint
CREATE TABLE "building_channel" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"building_id" varchar(255),
	"channel_type" "channel_type" NOT NULL,
	"channel_id" varchar(500) NOT NULL,
	"name" varchar(255),
	"is_active" integer DEFAULT 1 NOT NULL,
	"is_primary" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "building" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"number" smallint,
	"title" varchar(255),
	"liter" varchar(255),
	"active" boolean,
	CONSTRAINT "building_number_unique" UNIQUE("number"),
	CONSTRAINT "building_title_unique" UNIQUE("title")
);
--> statement-breakpoint
CREATE TABLE "entrance" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"building_id" varchar(255) NOT NULL,
	"entrance_number" smallint NOT NULL,
	CONSTRAINT "building_id_entrance_number_idx" UNIQUE("building_id","entrance_number")
);
--> statement-breakpoint
CREATE TABLE "floor" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"entrance_id" varchar(255) NOT NULL,
	"floor_number" smallint NOT NULL,
	CONSTRAINT "endtance_id_floor_number_idx" UNIQUE("floor_number","entrance_id")
);
--> statement-breakpoint
CREATE TABLE "claim_document" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"claim_id" varchar(255) NOT NULL,
	"document_type" varchar(100) NOT NULL,
	"file_url" varchar(500),
	"thumbnail_url" varchar(500),
	"file_name" varchar(255),
	"file_size" varchar(20),
	"mime_type" varchar(100),
	"scheduled_for_deletion" timestamp with time zone,
	"uploaded_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE "claim_history" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"claim_id" varchar(255) NOT NULL,
	"from_status" "claim_status",
	"to_status" "claim_status" NOT NULL,
	"resolution_template" "resolution_template",
	"resolution_text" text,
	"changed_by" varchar(255),
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE "property_claim" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"user_id" varchar(255) NOT NULL,
	"claim_type" "claim_type" NOT NULL,
	"claimed_role" "user_role_enum" NOT NULL,
	"apartment_id" varchar(255),
	"parking_spot_id" varchar(255),
	"organization_id" varchar(255),
	"status" "claim_status" DEFAULT 'pending' NOT NULL,
	"user_comment" text,
	"admin_comment" text,
	"reviewed_by" varchar(255),
	"reviewed_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE "contact_group_tags" (
	"contact_group_id" varchar(36) NOT NULL,
	"tag_id" varchar(36) NOT NULL,
	CONSTRAINT "contact_group_tags_contact_group_id_tag_id_pk" PRIMARY KEY("contact_group_id","tag_id")
);
--> statement-breakpoint
CREATE TABLE "contact_groups" (
	"id" varchar(36) PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"type" text NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "properties" (
	"id" varchar(36) PRIMARY KEY NOT NULL,
	"group_id" varchar(36),
	"key" text NOT NULL,
	"value" text NOT NULL,
	"type" text NOT NULL,
	"order" integer DEFAULT 0
);
--> statement-breakpoint
CREATE TABLE "property_groups" (
	"id" varchar(36) PRIMARY KEY NOT NULL,
	"contact_group_id" varchar(36),
	"name" text NOT NULL,
	"order" integer DEFAULT 0
);
--> statement-breakpoint
CREATE TABLE "tags" (
	"id" varchar(36) PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	CONSTRAINT "tags_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "deletion_request" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"user_id" varchar(255) NOT NULL,
	"status" "deletion_request_status" DEFAULT 'pending' NOT NULL,
	"reason" text,
	"admin_notes" text,
	"processed_by" varchar(255),
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"processed_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "directory_analytics" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"event_type" "directory_event_type" NOT NULL,
	"search_query" varchar(255),
	"tag_id" varchar(255),
	"entry_id" varchar(255),
	"contact_id" varchar(255),
	"user_id" varchar(255),
	"results_count" integer,
	"metadata" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "directory_contact_tag" (
	"contact_id" varchar(255) NOT NULL,
	"tag_id" varchar(255) NOT NULL,
	CONSTRAINT "directory_contact_tag_contact_id_tag_id_pk" PRIMARY KEY("contact_id","tag_id")
);
--> statement-breakpoint
CREATE TABLE "directory_contact" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"entry_id" varchar(255) NOT NULL,
	"type" "directory_contact_type" NOT NULL,
	"value" varchar(500) NOT NULL,
	"label" varchar(100),
	"subtitle" varchar(255),
	"is_primary" integer DEFAULT 0 NOT NULL,
	"order" integer DEFAULT 0,
	"has_whatsapp" integer DEFAULT 0 NOT NULL,
	"has_telegram" integer DEFAULT 0 NOT NULL,
	"is_24h" integer DEFAULT 0 NOT NULL,
	"schedule_note" varchar(255)
);
--> statement-breakpoint
CREATE TABLE "directory_entry" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"slug" varchar(255) NOT NULL,
	"type" "directory_entry_type" NOT NULL,
	"title" varchar(255) NOT NULL,
	"subtitle" varchar(255),
	"description" text,
	"content" text,
	"building_id" varchar(255),
	"floor_number" smallint,
	"icon" varchar(50),
	"order" integer DEFAULT 0,
	"is_active" integer DEFAULT 1 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "directory_entry_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "directory_entry_stats" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"entry_id" varchar(255) NOT NULL,
	"view_count" integer DEFAULT 0 NOT NULL,
	"call_count" integer DEFAULT 0 NOT NULL,
	"link_count" integer DEFAULT 0 NOT NULL,
	"last_viewed_at" timestamp,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "directory_entry_stats_entry_id_unique" UNIQUE("entry_id")
);
--> statement-breakpoint
CREATE TABLE "directory_entry_tag" (
	"entry_id" varchar(255) NOT NULL,
	"tag_id" varchar(255) NOT NULL,
	CONSTRAINT "directory_entry_tag_entry_id_tag_id_pk" PRIMARY KEY("entry_id","tag_id")
);
--> statement-breakpoint
CREATE TABLE "directory_schedule" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"entry_id" varchar(255) NOT NULL,
	"day_of_week" smallint NOT NULL,
	"open_time" time,
	"close_time" time,
	"note" varchar(255)
);
--> statement-breakpoint
CREATE TABLE "directory_tag_stats" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"tag_id" varchar(255) NOT NULL,
	"click_count" integer DEFAULT 0 NOT NULL,
	"view_count" integer DEFAULT 0 NOT NULL,
	"last_clicked_at" timestamp,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "directory_tag_stats_tag_id_unique" UNIQUE("tag_id")
);
--> statement-breakpoint
CREATE TABLE "directory_tag" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"name" varchar(100) NOT NULL,
	"slug" varchar(100) NOT NULL,
	"description" text,
	"parent_id" varchar(255),
	"scope" "directory_scope" DEFAULT 'core' NOT NULL,
	"synonyms" text,
	"icon" varchar(50),
	"order" integer DEFAULT 0,
	CONSTRAINT "directory_tag_name_unique" UNIQUE("name"),
	CONSTRAINT "directory_tag_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
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
	"is_deleted" boolean DEFAULT false NOT NULL,
	"deleted_at" timestamp with time zone,
	"deleted_by_id" varchar(255),
	"delete_reason" text,
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP
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
CREATE TABLE "listing_photo" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"listing_id" varchar(255) NOT NULL,
	"url" varchar(500) NOT NULL,
	"sort_order" smallint DEFAULT 0 NOT NULL,
	"is_main" boolean DEFAULT false NOT NULL,
	"alt_text" varchar(255),
	"uploaded_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE "listing" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"user_id" varchar(255) NOT NULL,
	"listing_type" "listing_type" NOT NULL,
	"property_type" "listing_property_type" NOT NULL,
	"apartment_id" varchar(255),
	"parking_spot_id" varchar(255),
	"title" varchar(255) NOT NULL,
	"description" text,
	"price" integer NOT NULL,
	"utilities_included" boolean DEFAULT true,
	"show_phone" boolean DEFAULT true NOT NULL,
	"show_telegram" boolean DEFAULT false NOT NULL,
	"show_max" boolean DEFAULT false NOT NULL,
	"show_whatsapp" boolean DEFAULT false NOT NULL,
	"status" "listing_status" DEFAULT 'draft' NOT NULL,
	"moderated_by" varchar(255),
	"moderated_at" timestamp with time zone,
	"rejection_reason" text,
	"is_stale" boolean DEFAULT false NOT NULL,
	"stale_at" timestamp with time zone,
	"archive_reason" "listing_archive_reason",
	"archived_comment" text,
	"archived_by" varchar(255),
	"archived_at" timestamp with time zone,
	"renewed_at" timestamp with time zone,
	"view_count" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"published_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "media" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"filename" varchar(255) NOT NULL,
	"original_filename" varchar(255) NOT NULL,
	"mime_type" varchar(100) NOT NULL,
	"size" integer NOT NULL,
	"path" varchar(500) NOT NULL,
	"url" varchar(500) NOT NULL,
	"width" integer,
	"height" integer,
	"type" "media_type_enum" DEFAULT 'image' NOT NULL,
	"alt" varchar(255),
	"title" varchar(255),
	"description" text,
	"uploaded_by" varchar(255) NOT NULL,
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
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
CREATE TABLE "message_attachment" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"message_id" varchar(255) NOT NULL,
	"file_type" varchar(50) NOT NULL,
	"file_name" varchar(255) NOT NULL,
	"file_url" varchar(500) NOT NULL,
	"file_size" integer,
	"mime_type" varchar(100),
	"width" integer,
	"height" integer,
	"thumbnail_url" varchar(500),
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "message_complaint" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"message_id" varchar(255) NOT NULL,
	"reporter_id" varchar(255) NOT NULL,
	"complaint_type" "message_complaint_type" NOT NULL,
	"description" text,
	"status" "message_complaint_status" DEFAULT 'pending' NOT NULL,
	"reviewed_by" varchar(255),
	"reviewed_at" timestamp,
	"review_comment" text,
	"action_taken" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "message_quota" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"user_id" varchar(255) NOT NULL,
	"daily_limit" integer DEFAULT 5 NOT NULL,
	"daily_used" integer DEFAULT 0 NOT NULL,
	"daily_reset_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"weekly_limit" integer DEFAULT 20 NOT NULL,
	"weekly_used" integer DEFAULT 0 NOT NULL,
	"weekly_reset_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"is_blocked" boolean DEFAULT false NOT NULL,
	"blocked_reason" text,
	"blocked_at" timestamp,
	"blocked_by" varchar(255),
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "message_quota_user_id_unique" UNIQUE("user_id")
);
--> statement-breakpoint
CREATE TABLE "message_recipient" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"message_id" varchar(255) NOT NULL,
	"recipient_id" varchar(255) NOT NULL,
	"is_read" boolean DEFAULT false NOT NULL,
	"read_at" timestamp,
	"is_archived" boolean DEFAULT false NOT NULL,
	"is_deleted" boolean DEFAULT false NOT NULL
);
--> statement-breakpoint
CREATE TABLE "message_thread" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"subject" varchar(255),
	"created_by" varchar(255) NOT NULL,
	"scope" "message_scope" NOT NULL,
	"building_id" varchar(255),
	"entrance_id" varchar(255),
	"floor_id" varchar(255),
	"apartment_id" varchar(255),
	"parking_id" varchar(255),
	"parking_floor_id" varchar(255),
	"parking_spot_id" varchar(255),
	"recipient_id" varchar(255),
	"is_archived" boolean DEFAULT false NOT NULL,
	"is_locked" boolean DEFAULT false NOT NULL,
	"last_message_at" timestamp DEFAULT now(),
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "message" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"thread_id" varchar(255) NOT NULL,
	"sender_id" varchar(255) NOT NULL,
	"content" text NOT NULL,
	"is_rich_text" boolean DEFAULT false NOT NULL,
	"status" "message_status" DEFAULT 'sent' NOT NULL,
	"moderated_by" varchar(255),
	"moderated_at" timestamp,
	"moderation_comment" text,
	"reply_to_id" varchar(255),
	"is_edited" boolean DEFAULT false NOT NULL,
	"is_deleted" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"edited_at" timestamp,
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "news" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" varchar(255) NOT NULL,
	"slug" varchar(255) NOT NULL,
	"excerpt" text,
	"cover_image" varchar(500),
	"content" jsonb NOT NULL,
	"type" "news_type_enum" DEFAULT 'announcement' NOT NULL,
	"status" "news_status_enum" DEFAULT 'draft' NOT NULL,
	"publish_at" timestamp with time zone,
	"is_pinned" boolean DEFAULT false NOT NULL,
	"is_highlighted" boolean DEFAULT false NOT NULL,
	"is_anonymous" boolean DEFAULT false NOT NULL,
	"author_id" varchar(255) NOT NULL,
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT "news_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "news_tag" (
	"news_id" uuid NOT NULL,
	"tag_id" varchar(255) NOT NULL,
	CONSTRAINT "news_tag_news_id_tag_id_pk" PRIMARY KEY("news_id","tag_id")
);
--> statement-breakpoint
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
CREATE TABLE "organization_tag" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"name" varchar(100) NOT NULL,
	CONSTRAINT "organization_tag_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "organization_to_tag" (
	"organization_id" varchar(255) NOT NULL,
	"tag_id" varchar(255) NOT NULL,
	CONSTRAINT "organization_to_tag_organization_id_tag_id_pk" PRIMARY KEY("organization_id","tag_id")
);
--> statement-breakpoint
CREATE TABLE "organization" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"building_id" varchar(255) NOT NULL,
	"floor_number" integer NOT NULL,
	"name" varchar(255) NOT NULL,
	"description" text,
	"logo" varchar(255),
	"schedule" jsonb NOT NULL,
	"type" "organization_type" NOT NULL
);
--> statement-breakpoint
CREATE TABLE "parking_floor" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"parking_id" varchar(255) NOT NULL,
	"floor_number" smallint NOT NULL
);
--> statement-breakpoint
CREATE TABLE "parking_spot" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"floor_id" varchar(255) NOT NULL,
	"number" varchar(10) NOT NULL,
	"type" "parking_spot_type" NOT NULL
);
--> statement-breakpoint
CREATE TABLE "parking" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"building_id" varchar(255) NOT NULL,
	"name" varchar(255) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "post" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(256),
	"created_by" varchar(255) NOT NULL,
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp with time zone
);
--> statement-breakpoint
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
CREATE TABLE "publication_tag" (
	"publication_id" uuid NOT NULL,
	"tag_id" varchar(255) NOT NULL,
	CONSTRAINT "publication_tag_publication_id_tag_id_pk" PRIMARY KEY("publication_id","tag_id")
);
--> statement-breakpoint
CREATE TABLE "publication_target" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"publication_id" uuid NOT NULL,
	"target_type" "publication_target_type_enum" NOT NULL,
	"target_id" varchar(255)
);
--> statement-breakpoint
CREATE TABLE "publication" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" varchar(255) NOT NULL,
	"content" jsonb NOT NULL,
	"cover_image" varchar(500),
	"type" "publication_type_enum" DEFAULT 'announcement' NOT NULL,
	"status" "publication_status_enum" DEFAULT 'draft' NOT NULL,
	"building_id" varchar(255),
	"publish_at" timestamp with time zone,
	"is_pinned" boolean DEFAULT false NOT NULL,
	"is_urgent" boolean DEFAULT false NOT NULL,
	"is_anonymous" boolean DEFAULT false NOT NULL,
	"publish_to_telegram" boolean DEFAULT false NOT NULL,
	"event_start_at" timestamp with time zone,
	"event_end_at" timestamp with time zone,
	"event_location" varchar(500),
	"event_latitude" text,
	"event_longitude" text,
	"event_max_attendees" integer,
	"event_external_url" varchar(500),
	"event_organizer" varchar(255),
	"event_organizer_phone" varchar(20),
	"event_recurrence_type" "event_recurrence_type_enum" DEFAULT 'none',
	"event_recurrence_interval" integer DEFAULT 1,
	"event_recurrence_day_of_week" integer,
	"event_recurrence_start_day" integer,
	"event_recurrence_end_day" integer,
	"event_recurrence_until" timestamp with time zone,
	"linked_article_id" uuid,
	"author_id" varchar(255) NOT NULL,
	"moderated_by" varchar(255),
	"moderated_at" timestamp with time zone,
	"moderation_comment" text,
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);
--> statement-breakpoint
CREATE TABLE "system_settings" (
	"key" varchar(100) PRIMARY KEY NOT NULL,
	"value" jsonb NOT NULL,
	"description" text,
	"updated_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
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
CREATE TABLE "account" (
	"user_id" varchar(255) NOT NULL,
	"type" varchar(255) NOT NULL,
	"provider" varchar(255) NOT NULL,
	"provider_account_id" varchar(255) NOT NULL,
	"refresh_token" text,
	"access_token" text,
	"expires_at" integer,
	"token_type" varchar(255),
	"scope" varchar(255),
	"id_token" text,
	"session_state" varchar(255),
	CONSTRAINT "account_provider_provider_account_id_pk" PRIMARY KEY("provider","provider_account_id")
);
--> statement-breakpoint
CREATE TABLE "email_verification_token" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"user_id" varchar(255) NOT NULL,
	"token" varchar(255) NOT NULL,
	"expires" timestamp with time zone NOT NULL,
	"used_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE "password_reset_token" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"user_id" varchar(255) NOT NULL,
	"token" varchar(255) NOT NULL,
	"expires" timestamp with time zone NOT NULL,
	"used_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE "session" (
	"session_token" varchar(255) PRIMARY KEY NOT NULL,
	"user_id" varchar(255) NOT NULL,
	"expires" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE "telegram_auth_token" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"code" varchar(6) NOT NULL,
	"telegram_id" varchar(50),
	"telegram_username" varchar(100),
	"telegram_first_name" varchar(255),
	"telegram_last_name" varchar(255),
	"verified" boolean DEFAULT false NOT NULL,
	"verified_at" timestamp with time zone,
	"expires" timestamp with time zone NOT NULL,
	"used_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user_block" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"user_id" varchar(255) NOT NULL,
	"blocked_by" varchar(255) NOT NULL,
	"category" "block_category_enum" NOT NULL,
	"violated_rules" text,
	"reason" text,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"unblocked_at" timestamp with time zone,
	"unblocked_by" varchar(255),
	"unblock_reason" text
);
--> statement-breakpoint
CREATE TABLE "user_interest_building" (
	"user_id" varchar(255) NOT NULL,
	"building_id" varchar(255) NOT NULL,
	"auto_added" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	CONSTRAINT "user_interest_building_user_id_building_id_pk" PRIMARY KEY("user_id","building_id")
);
--> statement-breakpoint
CREATE TABLE "user_profile" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"user_id" varchar(255) NOT NULL,
	"first_name" varchar(255),
	"last_name" varchar(255),
	"middle_name" varchar(255),
	"display_name" varchar(255),
	"tagline" varchar(100),
	"tagline_set_by_admin" boolean DEFAULT false NOT NULL,
	"phone" varchar(20),
	"hide_phone" boolean DEFAULT false NOT NULL,
	"hide_name" boolean DEFAULT false NOT NULL,
	"hide_gender" boolean DEFAULT false NOT NULL,
	"hide_birthday" boolean DEFAULT false NOT NULL,
	"avatar" varchar(255),
	"date_of_birth" timestamp,
	"gender" "user_gender_enum",
	"telegram_username" varchar(100),
	"telegram_id" varchar(50),
	"telegram_verified" boolean DEFAULT false NOT NULL,
	"telegram_verified_at" timestamp with time zone,
	"max_username" varchar(100),
	"whatsapp_phone" varchar(20),
	"hide_messengers" boolean DEFAULT false NOT NULL,
	"map_provider" "map_provider_enum" DEFAULT 'yandex'
);
--> statement-breakpoint
CREATE TABLE "user_role" (
	"user_id" varchar(255) NOT NULL,
	"role" "user_role_enum" NOT NULL,
	CONSTRAINT "user_role_user_id_role_pk" PRIMARY KEY("user_id","role")
);
--> statement-breakpoint
CREATE TABLE "user" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"name" varchar(255),
	"email" varchar(255) NOT NULL,
	"email_verified" timestamp with time zone,
	"image" varchar(255),
	"password_hash" varchar(255),
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"is_deleted" boolean DEFAULT false NOT NULL,
	"deleted_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "verification_token" (
	"identifier" varchar(255) NOT NULL,
	"token" varchar(255) NOT NULL,
	"expires" timestamp with time zone NOT NULL,
	CONSTRAINT "verification_token_identifier_token_pk" PRIMARY KEY("identifier","token")
);
--> statement-breakpoint
CREATE TABLE "user_apartment" (
	"user_id" varchar(255) NOT NULL,
	"apartment_id" varchar(255) NOT NULL,
	"status" "user_property_status" DEFAULT 'pending' NOT NULL,
	"role" "user_role_enum" NOT NULL,
	"revoked_at" timestamp with time zone,
	"revoked_by" varchar(255),
	"revocation_template" "revocation_template",
	"revocation_reason" text,
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	CONSTRAINT "user_apartment_user_id_apartment_id_pk" PRIMARY KEY("user_id","apartment_id")
);
--> statement-breakpoint
CREATE TABLE "user_parking_spot" (
	"user_id" varchar(255) NOT NULL,
	"parking_spot_id" varchar(255) NOT NULL,
	"status" "user_property_status" DEFAULT 'pending' NOT NULL,
	"role" "user_role_enum" NOT NULL,
	"revoked_at" timestamp with time zone,
	"revoked_by" varchar(255),
	"revocation_template" "revocation_template",
	"revocation_reason" text,
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	CONSTRAINT "user_parking_spot_user_id_parking_spot_id_pk" PRIMARY KEY("user_id","parking_spot_id")
);
--> statement-breakpoint
ALTER TABLE "analytics_event" ADD CONSTRAINT "analytics_event_session_id_analytics_session_id_fk" FOREIGN KEY ("session_id") REFERENCES "public"."analytics_session"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "analytics_event" ADD CONSTRAINT "analytics_event_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "analytics_session" ADD CONSTRAINT "analytics_session_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "audit_log" ADD CONSTRAINT "audit_log_actor_id_user_id_fk" FOREIGN KEY ("actor_id") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "apartment" ADD CONSTRAINT "apartment_floor_id_floor_id_fk" FOREIGN KEY ("floor_id") REFERENCES "public"."floor"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "building_channel" ADD CONSTRAINT "building_channel_building_id_building_id_fk" FOREIGN KEY ("building_id") REFERENCES "public"."building"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "entrance" ADD CONSTRAINT "entrance_building_id_building_id_fk" FOREIGN KEY ("building_id") REFERENCES "public"."building"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "floor" ADD CONSTRAINT "floor_entrance_id_entrance_id_fk" FOREIGN KEY ("entrance_id") REFERENCES "public"."entrance"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "claim_document" ADD CONSTRAINT "claim_document_claim_id_property_claim_id_fk" FOREIGN KEY ("claim_id") REFERENCES "public"."property_claim"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "claim_history" ADD CONSTRAINT "claim_history_claim_id_property_claim_id_fk" FOREIGN KEY ("claim_id") REFERENCES "public"."property_claim"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "claim_history" ADD CONSTRAINT "claim_history_changed_by_user_id_fk" FOREIGN KEY ("changed_by") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "property_claim" ADD CONSTRAINT "property_claim_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "property_claim" ADD CONSTRAINT "property_claim_apartment_id_apartment_id_fk" FOREIGN KEY ("apartment_id") REFERENCES "public"."apartment"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "property_claim" ADD CONSTRAINT "property_claim_parking_spot_id_parking_spot_id_fk" FOREIGN KEY ("parking_spot_id") REFERENCES "public"."parking_spot"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "property_claim" ADD CONSTRAINT "property_claim_organization_id_organization_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organization"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "property_claim" ADD CONSTRAINT "property_claim_reviewed_by_user_id_fk" FOREIGN KEY ("reviewed_by") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "contact_group_tags" ADD CONSTRAINT "contact_group_tags_contact_group_id_contact_groups_id_fk" FOREIGN KEY ("contact_group_id") REFERENCES "public"."contact_groups"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "contact_group_tags" ADD CONSTRAINT "contact_group_tags_tag_id_tags_id_fk" FOREIGN KEY ("tag_id") REFERENCES "public"."tags"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "properties" ADD CONSTRAINT "properties_group_id_property_groups_id_fk" FOREIGN KEY ("group_id") REFERENCES "public"."property_groups"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "property_groups" ADD CONSTRAINT "property_groups_contact_group_id_contact_groups_id_fk" FOREIGN KEY ("contact_group_id") REFERENCES "public"."contact_groups"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "deletion_request" ADD CONSTRAINT "deletion_request_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "deletion_request" ADD CONSTRAINT "deletion_request_processed_by_user_id_fk" FOREIGN KEY ("processed_by") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "directory_analytics" ADD CONSTRAINT "directory_analytics_tag_id_directory_tag_id_fk" FOREIGN KEY ("tag_id") REFERENCES "public"."directory_tag"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "directory_analytics" ADD CONSTRAINT "directory_analytics_entry_id_directory_entry_id_fk" FOREIGN KEY ("entry_id") REFERENCES "public"."directory_entry"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "directory_analytics" ADD CONSTRAINT "directory_analytics_contact_id_directory_contact_id_fk" FOREIGN KEY ("contact_id") REFERENCES "public"."directory_contact"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "directory_contact_tag" ADD CONSTRAINT "directory_contact_tag_contact_id_directory_contact_id_fk" FOREIGN KEY ("contact_id") REFERENCES "public"."directory_contact"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "directory_contact_tag" ADD CONSTRAINT "directory_contact_tag_tag_id_directory_tag_id_fk" FOREIGN KEY ("tag_id") REFERENCES "public"."directory_tag"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "directory_contact" ADD CONSTRAINT "directory_contact_entry_id_directory_entry_id_fk" FOREIGN KEY ("entry_id") REFERENCES "public"."directory_entry"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "directory_entry" ADD CONSTRAINT "directory_entry_building_id_building_id_fk" FOREIGN KEY ("building_id") REFERENCES "public"."building"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "directory_entry_stats" ADD CONSTRAINT "directory_entry_stats_entry_id_directory_entry_id_fk" FOREIGN KEY ("entry_id") REFERENCES "public"."directory_entry"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "directory_entry_tag" ADD CONSTRAINT "directory_entry_tag_entry_id_directory_entry_id_fk" FOREIGN KEY ("entry_id") REFERENCES "public"."directory_entry"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "directory_entry_tag" ADD CONSTRAINT "directory_entry_tag_tag_id_directory_tag_id_fk" FOREIGN KEY ("tag_id") REFERENCES "public"."directory_tag"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "directory_schedule" ADD CONSTRAINT "directory_schedule_entry_id_directory_entry_id_fk" FOREIGN KEY ("entry_id") REFERENCES "public"."directory_entry"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "directory_tag_stats" ADD CONSTRAINT "directory_tag_stats_tag_id_directory_tag_id_fk" FOREIGN KEY ("tag_id") REFERENCES "public"."directory_tag"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "knowledge_base_article_tag" ADD CONSTRAINT "knowledge_base_article_tag_article_id_knowledge_base_article_id_fk" FOREIGN KEY ("article_id") REFERENCES "public"."knowledge_base_article"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "knowledge_base_article_tag" ADD CONSTRAINT "knowledge_base_article_tag_tag_id_directory_tag_id_fk" FOREIGN KEY ("tag_id") REFERENCES "public"."directory_tag"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "knowledge_base_article" ADD CONSTRAINT "knowledge_base_article_building_id_building_id_fk" FOREIGN KEY ("building_id") REFERENCES "public"."building"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "knowledge_base_article" ADD CONSTRAINT "knowledge_base_article_author_id_user_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "feedback" ADD CONSTRAINT "feedback_submitted_by_user_id_user_id_fk" FOREIGN KEY ("submitted_by_user_id") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "feedback" ADD CONSTRAINT "feedback_assigned_to_id_user_id_fk" FOREIGN KEY ("assigned_to_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "feedback" ADD CONSTRAINT "feedback_responded_by_id_user_id_fk" FOREIGN KEY ("responded_by_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "feedback" ADD CONSTRAINT "feedback_deleted_by_id_user_id_fk" FOREIGN KEY ("deleted_by_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "feedback_history" ADD CONSTRAINT "feedback_history_feedback_id_feedback_id_fk" FOREIGN KEY ("feedback_id") REFERENCES "public"."feedback"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "feedback_history" ADD CONSTRAINT "feedback_history_assigned_to_id_user_id_fk" FOREIGN KEY ("assigned_to_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "feedback_history" ADD CONSTRAINT "feedback_history_changed_by_id_user_id_fk" FOREIGN KEY ("changed_by_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "listing_photo" ADD CONSTRAINT "listing_photo_listing_id_listing_id_fk" FOREIGN KEY ("listing_id") REFERENCES "public"."listing"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "listing" ADD CONSTRAINT "listing_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "listing" ADD CONSTRAINT "listing_apartment_id_apartment_id_fk" FOREIGN KEY ("apartment_id") REFERENCES "public"."apartment"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "listing" ADD CONSTRAINT "listing_parking_spot_id_parking_spot_id_fk" FOREIGN KEY ("parking_spot_id") REFERENCES "public"."parking_spot"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "listing" ADD CONSTRAINT "listing_moderated_by_user_id_fk" FOREIGN KEY ("moderated_by") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "listing" ADD CONSTRAINT "listing_archived_by_user_id_fk" FOREIGN KEY ("archived_by") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "media" ADD CONSTRAINT "media_uploaded_by_user_id_fk" FOREIGN KEY ("uploaded_by") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "info_media_to_tag" ADD CONSTRAINT "info_media_to_tag_media_id_media_id_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "info_media_to_tag" ADD CONSTRAINT "info_media_to_tag_tag_id_info_media_tag_id_fk" FOREIGN KEY ("tag_id") REFERENCES "public"."info_media_tag"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "message_attachment" ADD CONSTRAINT "message_attachment_message_id_message_id_fk" FOREIGN KEY ("message_id") REFERENCES "public"."message"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "message_complaint" ADD CONSTRAINT "message_complaint_message_id_message_id_fk" FOREIGN KEY ("message_id") REFERENCES "public"."message"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "message_complaint" ADD CONSTRAINT "message_complaint_reporter_id_user_id_fk" FOREIGN KEY ("reporter_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "message_complaint" ADD CONSTRAINT "message_complaint_reviewed_by_user_id_fk" FOREIGN KEY ("reviewed_by") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "message_quota" ADD CONSTRAINT "message_quota_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "message_quota" ADD CONSTRAINT "message_quota_blocked_by_user_id_fk" FOREIGN KEY ("blocked_by") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "message_recipient" ADD CONSTRAINT "message_recipient_message_id_message_id_fk" FOREIGN KEY ("message_id") REFERENCES "public"."message"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "message_recipient" ADD CONSTRAINT "message_recipient_recipient_id_user_id_fk" FOREIGN KEY ("recipient_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "message_thread" ADD CONSTRAINT "message_thread_created_by_user_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "message_thread" ADD CONSTRAINT "message_thread_building_id_building_id_fk" FOREIGN KEY ("building_id") REFERENCES "public"."building"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "message_thread" ADD CONSTRAINT "message_thread_entrance_id_entrance_id_fk" FOREIGN KEY ("entrance_id") REFERENCES "public"."entrance"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "message_thread" ADD CONSTRAINT "message_thread_floor_id_floor_id_fk" FOREIGN KEY ("floor_id") REFERENCES "public"."floor"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "message_thread" ADD CONSTRAINT "message_thread_apartment_id_apartment_id_fk" FOREIGN KEY ("apartment_id") REFERENCES "public"."apartment"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "message_thread" ADD CONSTRAINT "message_thread_parking_id_parking_id_fk" FOREIGN KEY ("parking_id") REFERENCES "public"."parking"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "message_thread" ADD CONSTRAINT "message_thread_parking_floor_id_parking_floor_id_fk" FOREIGN KEY ("parking_floor_id") REFERENCES "public"."parking_floor"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "message_thread" ADD CONSTRAINT "message_thread_parking_spot_id_parking_spot_id_fk" FOREIGN KEY ("parking_spot_id") REFERENCES "public"."parking_spot"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "message_thread" ADD CONSTRAINT "message_thread_recipient_id_user_id_fk" FOREIGN KEY ("recipient_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "message" ADD CONSTRAINT "message_thread_id_message_thread_id_fk" FOREIGN KEY ("thread_id") REFERENCES "public"."message_thread"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "message" ADD CONSTRAINT "message_sender_id_user_id_fk" FOREIGN KEY ("sender_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "message" ADD CONSTRAINT "message_moderated_by_user_id_fk" FOREIGN KEY ("moderated_by") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "news" ADD CONSTRAINT "news_author_id_user_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "news_tag" ADD CONSTRAINT "news_tag_news_id_news_id_fk" FOREIGN KEY ("news_id") REFERENCES "public"."news"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "news_tag" ADD CONSTRAINT "news_tag_tag_id_directory_tag_id_fk" FOREIGN KEY ("tag_id") REFERENCES "public"."directory_tag"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "notification" ADD CONSTRAINT "notification_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "notification" ADD CONSTRAINT "notification_from_user_id_user_id_fk" FOREIGN KEY ("from_user_id") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "organization_to_tag" ADD CONSTRAINT "organization_to_tag_organization_id_organization_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organization"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "organization_to_tag" ADD CONSTRAINT "organization_to_tag_tag_id_organization_tag_id_fk" FOREIGN KEY ("tag_id") REFERENCES "public"."organization_tag"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "organization" ADD CONSTRAINT "organization_building_id_building_id_fk" FOREIGN KEY ("building_id") REFERENCES "public"."building"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "parking_floor" ADD CONSTRAINT "parking_floor_parking_id_parking_id_fk" FOREIGN KEY ("parking_id") REFERENCES "public"."parking"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "parking_spot" ADD CONSTRAINT "parking_spot_floor_id_parking_floor_id_fk" FOREIGN KEY ("floor_id") REFERENCES "public"."parking_floor"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "parking" ADD CONSTRAINT "parking_building_id_building_id_fk" FOREIGN KEY ("building_id") REFERENCES "public"."building"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "post" ADD CONSTRAINT "post_created_by_user_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "publication_attachment" ADD CONSTRAINT "publication_attachment_publication_id_publication_id_fk" FOREIGN KEY ("publication_id") REFERENCES "public"."publication"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "publication_attachment" ADD CONSTRAINT "publication_attachment_uploaded_by_user_id_fk" FOREIGN KEY ("uploaded_by") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "publication_history" ADD CONSTRAINT "publication_history_publication_id_publication_id_fk" FOREIGN KEY ("publication_id") REFERENCES "public"."publication"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "publication_history" ADD CONSTRAINT "publication_history_changed_by_id_user_id_fk" FOREIGN KEY ("changed_by_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "publication_moderation_vote" ADD CONSTRAINT "publication_moderation_vote_publication_id_publication_id_fk" FOREIGN KEY ("publication_id") REFERENCES "public"."publication"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "publication_moderation_vote" ADD CONSTRAINT "publication_moderation_vote_moderator_id_user_id_fk" FOREIGN KEY ("moderator_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "publication_tag" ADD CONSTRAINT "publication_tag_publication_id_publication_id_fk" FOREIGN KEY ("publication_id") REFERENCES "public"."publication"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "publication_tag" ADD CONSTRAINT "publication_tag_tag_id_directory_tag_id_fk" FOREIGN KEY ("tag_id") REFERENCES "public"."directory_tag"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "publication_target" ADD CONSTRAINT "publication_target_publication_id_publication_id_fk" FOREIGN KEY ("publication_id") REFERENCES "public"."publication"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "publication" ADD CONSTRAINT "publication_building_id_building_id_fk" FOREIGN KEY ("building_id") REFERENCES "public"."building"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "publication" ADD CONSTRAINT "publication_author_id_user_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "publication" ADD CONSTRAINT "publication_moderated_by_user_id_fk" FOREIGN KEY ("moderated_by") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "info_news_to_tag" ADD CONSTRAINT "info_news_to_tag_news_id_news_id_fk" FOREIGN KEY ("news_id") REFERENCES "public"."news"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "info_news_to_tag" ADD CONSTRAINT "info_news_to_tag_tag_id_info_tag_id_fk" FOREIGN KEY ("tag_id") REFERENCES "public"."info_tag"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "info_publication_to_tag" ADD CONSTRAINT "info_publication_to_tag_publication_id_publication_id_fk" FOREIGN KEY ("publication_id") REFERENCES "public"."publication"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "info_publication_to_tag" ADD CONSTRAINT "info_publication_to_tag_tag_id_info_tag_id_fk" FOREIGN KEY ("tag_id") REFERENCES "public"."info_tag"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "account" ADD CONSTRAINT "account_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "email_verification_token" ADD CONSTRAINT "email_verification_token_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "password_reset_token" ADD CONSTRAINT "password_reset_token_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "session" ADD CONSTRAINT "session_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_block" ADD CONSTRAINT "user_block_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_block" ADD CONSTRAINT "user_block_blocked_by_user_id_fk" FOREIGN KEY ("blocked_by") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_block" ADD CONSTRAINT "user_block_unblocked_by_user_id_fk" FOREIGN KEY ("unblocked_by") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_interest_building" ADD CONSTRAINT "user_interest_building_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_interest_building" ADD CONSTRAINT "user_interest_building_building_id_building_id_fk" FOREIGN KEY ("building_id") REFERENCES "public"."building"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_profile" ADD CONSTRAINT "user_profile_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_role" ADD CONSTRAINT "user_role_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_apartment" ADD CONSTRAINT "user_apartment_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_apartment" ADD CONSTRAINT "user_apartment_apartment_id_apartment_id_fk" FOREIGN KEY ("apartment_id") REFERENCES "public"."apartment"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_apartment" ADD CONSTRAINT "user_apartment_revoked_by_user_id_fk" FOREIGN KEY ("revoked_by") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_parking_spot" ADD CONSTRAINT "user_parking_spot_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_parking_spot" ADD CONSTRAINT "user_parking_spot_parking_spot_id_parking_spot_id_fk" FOREIGN KEY ("parking_spot_id") REFERENCES "public"."parking_spot"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_parking_spot" ADD CONSTRAINT "user_parking_spot_revoked_by_user_id_fk" FOREIGN KEY ("revoked_by") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "analytics_conversion_event_name_idx" ON "analytics_conversion" USING btree ("event_name");--> statement-breakpoint
CREATE INDEX "analytics_event_session_id_idx" ON "analytics_event" USING btree ("session_id");--> statement-breakpoint
CREATE INDEX "analytics_event_user_id_idx" ON "analytics_event" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "analytics_event_type_idx" ON "analytics_event" USING btree ("event_type");--> statement-breakpoint
CREATE INDEX "analytics_event_name_idx" ON "analytics_event" USING btree ("event_name");--> statement-breakpoint
CREATE INDEX "analytics_event_page_path_idx" ON "analytics_event" USING btree ("page_path");--> statement-breakpoint
CREATE INDEX "analytics_event_created_at_idx" ON "analytics_event" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "analytics_event_type_created_at_idx" ON "analytics_event" USING btree ("event_type","created_at");--> statement-breakpoint
CREATE INDEX "analytics_session_user_id_idx" ON "analytics_session" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "analytics_session_started_at_idx" ON "analytics_session" USING btree ("started_at");--> statement-breakpoint
CREATE INDEX "analytics_session_device_type_idx" ON "analytics_session" USING btree ("device_type");--> statement-breakpoint
CREATE INDEX "audit_log_entity_idx" ON "audit_log" USING btree ("entity_type","entity_id");--> statement-breakpoint
CREATE INDEX "audit_log_action_idx" ON "audit_log" USING btree ("action");--> statement-breakpoint
CREATE INDEX "audit_log_actor_idx" ON "audit_log" USING btree ("actor_id");--> statement-breakpoint
CREATE INDEX "audit_log_created_at_idx" ON "audit_log" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "audit_log_entity_created_idx" ON "audit_log" USING btree ("entity_type","entity_id","created_at");--> statement-breakpoint
CREATE INDEX "building_channel_building_idx" ON "building_channel" USING btree ("building_id");--> statement-breakpoint
CREATE INDEX "building_channel_type_idx" ON "building_channel" USING btree ("channel_type");--> statement-breakpoint
CREATE INDEX "building_channel_active_idx" ON "building_channel" USING btree ("is_active");--> statement-breakpoint
CREATE INDEX "claim_document_claim_idx" ON "claim_document" USING btree ("claim_id");--> statement-breakpoint
CREATE INDEX "claim_document_scheduled_deletion_idx" ON "claim_document" USING btree ("scheduled_for_deletion");--> statement-breakpoint
CREATE INDEX "claim_history_claim_idx" ON "claim_history" USING btree ("claim_id");--> statement-breakpoint
CREATE INDEX "claim_user_idx" ON "property_claim" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "claim_status_idx" ON "property_claim" USING btree ("status");--> statement-breakpoint
CREATE INDEX "deletion_request_user_id_idx" ON "deletion_request" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "deletion_request_status_idx" ON "deletion_request" USING btree ("status");--> statement-breakpoint
CREATE INDEX "directory_analytics_event_type_idx" ON "directory_analytics" USING btree ("event_type");--> statement-breakpoint
CREATE INDEX "directory_analytics_tag_idx" ON "directory_analytics" USING btree ("tag_id");--> statement-breakpoint
CREATE INDEX "directory_analytics_entry_idx" ON "directory_analytics" USING btree ("entry_id");--> statement-breakpoint
CREATE INDEX "directory_analytics_user_idx" ON "directory_analytics" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "directory_analytics_created_idx" ON "directory_analytics" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "directory_contact_tag_contact_idx" ON "directory_contact_tag" USING btree ("contact_id");--> statement-breakpoint
CREATE INDEX "directory_contact_tag_tag_idx" ON "directory_contact_tag" USING btree ("tag_id");--> statement-breakpoint
CREATE INDEX "directory_contact_entry_idx" ON "directory_contact" USING btree ("entry_id");--> statement-breakpoint
CREATE INDEX "directory_contact_type_idx" ON "directory_contact" USING btree ("type");--> statement-breakpoint
CREATE INDEX "directory_entry_type_idx" ON "directory_entry" USING btree ("type");--> statement-breakpoint
CREATE INDEX "directory_entry_slug_idx" ON "directory_entry" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "directory_entry_building_idx" ON "directory_entry" USING btree ("building_id");--> statement-breakpoint
CREATE INDEX "directory_entry_stats_views_idx" ON "directory_entry_stats" USING btree ("view_count");--> statement-breakpoint
CREATE INDEX "directory_entry_stats_calls_idx" ON "directory_entry_stats" USING btree ("call_count");--> statement-breakpoint
CREATE INDEX "directory_entry_tag_entry_idx" ON "directory_entry_tag" USING btree ("entry_id");--> statement-breakpoint
CREATE INDEX "directory_entry_tag_tag_idx" ON "directory_entry_tag" USING btree ("tag_id");--> statement-breakpoint
CREATE INDEX "directory_schedule_entry_idx" ON "directory_schedule" USING btree ("entry_id");--> statement-breakpoint
CREATE INDEX "directory_tag_stats_clicks_idx" ON "directory_tag_stats" USING btree ("click_count");--> statement-breakpoint
CREATE INDEX "directory_tag_stats_views_idx" ON "directory_tag_stats" USING btree ("view_count");--> statement-breakpoint
CREATE INDEX "directory_tag_slug_idx" ON "directory_tag" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "directory_tag_parent_idx" ON "directory_tag" USING btree ("parent_id");--> statement-breakpoint
CREATE INDEX "directory_tag_scope_idx" ON "directory_tag" USING btree ("scope");--> statement-breakpoint
CREATE INDEX "kb_article_tag_article_idx" ON "knowledge_base_article_tag" USING btree ("article_id");--> statement-breakpoint
CREATE INDEX "kb_article_tag_tag_idx" ON "knowledge_base_article_tag" USING btree ("tag_id");--> statement-breakpoint
CREATE INDEX "kb_article_slug_idx" ON "knowledge_base_article" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "kb_article_status_idx" ON "knowledge_base_article" USING btree ("status");--> statement-breakpoint
CREATE INDEX "kb_article_building_idx" ON "knowledge_base_article" USING btree ("building_id");--> statement-breakpoint
CREATE INDEX "kb_article_author_idx" ON "knowledge_base_article" USING btree ("author_id");--> statement-breakpoint
CREATE INDEX "feedback_type_idx" ON "feedback" USING btree ("type");--> statement-breakpoint
CREATE INDEX "feedback_status_idx" ON "feedback" USING btree ("status");--> statement-breakpoint
CREATE INDEX "feedback_priority_idx" ON "feedback" USING btree ("priority");--> statement-breakpoint
CREATE INDEX "feedback_created_at_idx" ON "feedback" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "feedback_ip_idx" ON "feedback" USING btree ("ip_address");--> statement-breakpoint
CREATE INDEX "feedback_is_deleted_idx" ON "feedback" USING btree ("is_deleted");--> statement-breakpoint
CREATE INDEX "feedback_assigned_idx" ON "feedback" USING btree ("assigned_to_id");--> statement-breakpoint
CREATE INDEX "feedback_history_feedback_idx" ON "feedback_history" USING btree ("feedback_id");--> statement-breakpoint
CREATE INDEX "feedback_history_action_idx" ON "feedback_history" USING btree ("action");--> statement-breakpoint
CREATE INDEX "feedback_history_created_at_idx" ON "feedback_history" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "listing_photo_listing_idx" ON "listing_photo" USING btree ("listing_id");--> statement-breakpoint
CREATE INDEX "listing_user_idx" ON "listing" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "listing_status_idx" ON "listing" USING btree ("status");--> statement-breakpoint
CREATE INDEX "listing_type_idx" ON "listing" USING btree ("listing_type");--> statement-breakpoint
CREATE INDEX "listing_property_type_idx" ON "listing" USING btree ("property_type");--> statement-breakpoint
CREATE INDEX "media_uploaded_by_idx" ON "media" USING btree ("uploaded_by");--> statement-breakpoint
CREATE INDEX "media_type_idx" ON "media" USING btree ("type");--> statement-breakpoint
CREATE INDEX "media_created_at_idx" ON "media" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "media_mime_type_idx" ON "media" USING btree ("mime_type");--> statement-breakpoint
CREATE INDEX "media_tag_slug_idx" ON "info_media_tag" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "media_to_tag_media_idx" ON "info_media_to_tag" USING btree ("media_id");--> statement-breakpoint
CREATE INDEX "media_to_tag_tag_idx" ON "info_media_to_tag" USING btree ("tag_id");--> statement-breakpoint
CREATE INDEX "message_attachment_message_idx" ON "message_attachment" USING btree ("message_id");--> statement-breakpoint
CREATE INDEX "message_complaint_message_idx" ON "message_complaint" USING btree ("message_id");--> statement-breakpoint
CREATE INDEX "message_complaint_reporter_idx" ON "message_complaint" USING btree ("reporter_id");--> statement-breakpoint
CREATE INDEX "message_complaint_status_idx" ON "message_complaint" USING btree ("status");--> statement-breakpoint
CREATE INDEX "message_complaint_created_idx" ON "message_complaint" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "message_quota_user_idx" ON "message_quota" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "message_quota_blocked_idx" ON "message_quota" USING btree ("is_blocked");--> statement-breakpoint
CREATE INDEX "message_recipient_message_idx" ON "message_recipient" USING btree ("message_id");--> statement-breakpoint
CREATE INDEX "message_recipient_recipient_idx" ON "message_recipient" USING btree ("recipient_id");--> statement-breakpoint
CREATE INDEX "message_recipient_read_idx" ON "message_recipient" USING btree ("is_read");--> statement-breakpoint
CREATE INDEX "message_thread_created_by_idx" ON "message_thread" USING btree ("created_by");--> statement-breakpoint
CREATE INDEX "message_thread_scope_idx" ON "message_thread" USING btree ("scope");--> statement-breakpoint
CREATE INDEX "message_thread_building_idx" ON "message_thread" USING btree ("building_id");--> statement-breakpoint
CREATE INDEX "message_thread_apartment_idx" ON "message_thread" USING btree ("apartment_id");--> statement-breakpoint
CREATE INDEX "message_thread_parking_spot_idx" ON "message_thread" USING btree ("parking_spot_id");--> statement-breakpoint
CREATE INDEX "message_thread_recipient_idx" ON "message_thread" USING btree ("recipient_id");--> statement-breakpoint
CREATE INDEX "message_thread_last_message_idx" ON "message_thread" USING btree ("last_message_at");--> statement-breakpoint
CREATE INDEX "message_thread_idx" ON "message" USING btree ("thread_id");--> statement-breakpoint
CREATE INDEX "message_sender_idx" ON "message" USING btree ("sender_id");--> statement-breakpoint
CREATE INDEX "message_status_idx" ON "message" USING btree ("status");--> statement-breakpoint
CREATE INDEX "message_created_idx" ON "message" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "message_reply_idx" ON "message" USING btree ("reply_to_id");--> statement-breakpoint
CREATE INDEX "news_slug_idx" ON "news" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "news_status_idx" ON "news" USING btree ("status");--> statement-breakpoint
CREATE INDEX "news_type_idx" ON "news" USING btree ("type");--> statement-breakpoint
CREATE INDEX "news_publish_at_idx" ON "news" USING btree ("publish_at");--> statement-breakpoint
CREATE INDEX "news_author_idx" ON "news" USING btree ("author_id");--> statement-breakpoint
CREATE INDEX "news_tag_news_idx" ON "news_tag" USING btree ("news_id");--> statement-breakpoint
CREATE INDEX "news_tag_tag_idx" ON "news_tag" USING btree ("tag_id");--> statement-breakpoint
CREATE INDEX "notification_user_id_idx" ON "notification" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "notification_user_unread_idx" ON "notification" USING btree ("user_id","is_read");--> statement-breakpoint
CREATE INDEX "notification_created_at_idx" ON "notification" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "notification_entity_idx" ON "notification" USING btree ("entity_type","entity_id");--> statement-breakpoint
CREATE INDEX "created_by_idx" ON "post" USING btree ("created_by");--> statement-breakpoint
CREATE INDEX "name_idx" ON "post" USING btree ("name");--> statement-breakpoint
CREATE INDEX "publication_attachment_pub_idx" ON "publication_attachment" USING btree ("publication_id");--> statement-breakpoint
CREATE INDEX "publication_attachment_type_idx" ON "publication_attachment" USING btree ("file_type");--> statement-breakpoint
CREATE INDEX "publication_history_pub_idx" ON "publication_history" USING btree ("publication_id");--> statement-breakpoint
CREATE INDEX "publication_history_action_idx" ON "publication_history" USING btree ("action");--> statement-breakpoint
CREATE INDEX "publication_history_created_at_idx" ON "publication_history" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "pub_mod_vote_pub_idx" ON "publication_moderation_vote" USING btree ("publication_id");--> statement-breakpoint
CREATE INDEX "pub_mod_vote_mod_idx" ON "publication_moderation_vote" USING btree ("moderator_id");--> statement-breakpoint
CREATE INDEX "pub_mod_vote_vote_idx" ON "publication_moderation_vote" USING btree ("vote");--> statement-breakpoint
CREATE INDEX "publication_tag_pub_idx" ON "publication_tag" USING btree ("publication_id");--> statement-breakpoint
CREATE INDEX "publication_tag_tag_idx" ON "publication_tag" USING btree ("tag_id");--> statement-breakpoint
CREATE INDEX "publication_target_pub_idx" ON "publication_target" USING btree ("publication_id");--> statement-breakpoint
CREATE INDEX "publication_target_type_idx" ON "publication_target" USING btree ("target_type");--> statement-breakpoint
CREATE INDEX "publication_target_id_idx" ON "publication_target" USING btree ("target_id");--> statement-breakpoint
CREATE INDEX "publication_status_idx" ON "publication" USING btree ("status");--> statement-breakpoint
CREATE INDEX "publication_type_idx" ON "publication" USING btree ("type");--> statement-breakpoint
CREATE INDEX "publication_author_idx" ON "publication" USING btree ("author_id");--> statement-breakpoint
CREATE INDEX "publication_building_idx" ON "publication" USING btree ("building_id");--> statement-breakpoint
CREATE INDEX "publication_created_at_idx" ON "publication" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "info_news_to_tag_news_idx" ON "info_news_to_tag" USING btree ("news_id");--> statement-breakpoint
CREATE INDEX "info_news_to_tag_tag_idx" ON "info_news_to_tag" USING btree ("tag_id");--> statement-breakpoint
CREATE INDEX "info_publication_to_tag_publication_idx" ON "info_publication_to_tag" USING btree ("publication_id");--> statement-breakpoint
CREATE INDEX "info_publication_to_tag_tag_idx" ON "info_publication_to_tag" USING btree ("tag_id");--> statement-breakpoint
CREATE INDEX "info_tag_slug_idx" ON "info_tag" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "info_tag_usage_count_idx" ON "info_tag" USING btree ("usage_count");--> statement-breakpoint
CREATE INDEX "account_user_id_idx" ON "account" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "email_verification_token_idx" ON "email_verification_token" USING btree ("token");--> statement-breakpoint
CREATE INDEX "password_reset_token_idx" ON "password_reset_token" USING btree ("token");--> statement-breakpoint
CREATE INDEX "session_user_id_idx" ON "session" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "telegram_auth_token_code_idx" ON "telegram_auth_token" USING btree ("code");--> statement-breakpoint
CREATE INDEX "telegram_auth_token_telegram_id_idx" ON "telegram_auth_token" USING btree ("telegram_id");--> statement-breakpoint
CREATE INDEX "user_block_user_id_idx" ON "user_block" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "user_block_is_active_idx" ON "user_block" USING btree ("is_active");--> statement-breakpoint
CREATE INDEX "user_interest_building_user_idx" ON "user_interest_building" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "user_interest_building_building_idx" ON "user_interest_building" USING btree ("building_id");--> statement-breakpoint
CREATE INDEX "user_apartment_revoked_idx" ON "user_apartment" USING btree ("revoked_at");--> statement-breakpoint
CREATE INDEX "user_parking_spot_revoked_idx" ON "user_parking_spot" USING btree ("revoked_at");