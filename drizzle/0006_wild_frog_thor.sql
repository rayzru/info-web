CREATE TYPE "public"."listing_archive_reason" AS ENUM('manual', 'expired', 'rights_revoked', 'admin');--> statement-breakpoint
CREATE TYPE "public"."block_category_enum" AS ENUM('rules_violation', 'fraud', 'spam', 'abuse', 'other');--> statement-breakpoint
CREATE TYPE "public"."map_provider_enum" AS ENUM('yandex', '2gis', 'google', 'apple', 'osm');--> statement-breakpoint
CREATE TYPE "public"."rules_violation_enum" AS ENUM('3.1', '3.2', '3.3', '3.4', '3.5', '4.1', '4.2', '4.3', '5.1', '5.2');--> statement-breakpoint
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
ALTER TABLE "listing" RENAME COLUMN "archived_reason" TO "archive_reason";--> statement-breakpoint
ALTER TABLE "listing" ADD COLUMN "show_phone" boolean DEFAULT true NOT NULL;--> statement-breakpoint
ALTER TABLE "listing" ADD COLUMN "show_telegram" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "listing" ADD COLUMN "show_max" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "listing" ADD COLUMN "show_whatsapp" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "listing" ADD COLUMN "is_stale" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "listing" ADD COLUMN "stale_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "listing" ADD COLUMN "archived_comment" text;--> statement-breakpoint
ALTER TABLE "listing" ADD COLUMN "renewed_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "user_profile" ADD COLUMN "telegram_username" varchar(100);--> statement-breakpoint
ALTER TABLE "user_profile" ADD COLUMN "telegram_id" varchar(50);--> statement-breakpoint
ALTER TABLE "user_profile" ADD COLUMN "telegram_verified" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "user_profile" ADD COLUMN "telegram_verified_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "user_profile" ADD COLUMN "max_username" varchar(100);--> statement-breakpoint
ALTER TABLE "user_profile" ADD COLUMN "whatsapp_phone" varchar(20);--> statement-breakpoint
ALTER TABLE "user_profile" ADD COLUMN "hide_messengers" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "user_profile" ADD COLUMN "map_provider" "map_provider_enum" DEFAULT 'yandex';--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "password_hash" varchar(255);--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL;--> statement-breakpoint
ALTER TABLE "email_verification_token" ADD CONSTRAINT "email_verification_token_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "password_reset_token" ADD CONSTRAINT "password_reset_token_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_block" ADD CONSTRAINT "user_block_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_block" ADD CONSTRAINT "user_block_blocked_by_user_id_fk" FOREIGN KEY ("blocked_by") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_block" ADD CONSTRAINT "user_block_unblocked_by_user_id_fk" FOREIGN KEY ("unblocked_by") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "email_verification_token_idx" ON "email_verification_token" USING btree ("token");--> statement-breakpoint
CREATE INDEX "password_reset_token_idx" ON "password_reset_token" USING btree ("token");--> statement-breakpoint
CREATE INDEX "telegram_auth_token_code_idx" ON "telegram_auth_token" USING btree ("code");--> statement-breakpoint
CREATE INDEX "telegram_auth_token_telegram_id_idx" ON "telegram_auth_token" USING btree ("telegram_id");--> statement-breakpoint
CREATE INDEX "user_block_user_id_idx" ON "user_block" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "user_block_is_active_idx" ON "user_block" USING btree ("is_active");