CREATE TYPE "public"."message_complaint_status" AS ENUM('pending', 'reviewed', 'resolved', 'dismissed');--> statement-breakpoint
CREATE TYPE "public"."message_complaint_type" AS ENUM('spam', 'harassment', 'fraud', 'inappropriate', 'other');--> statement-breakpoint
CREATE TYPE "public"."message_scope" AS ENUM('complex', 'building', 'entrance', 'floor', 'apartment', 'parking', 'parking_floor', 'parking_spot', 'uk', 'chairman');--> statement-breakpoint
CREATE TYPE "public"."message_status" AS ENUM('draft', 'pending', 'sent', 'delivered', 'rejected');--> statement-breakpoint
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
CREATE INDEX "message_reply_idx" ON "message" USING btree ("reply_to_id");