CREATE TYPE "public"."analytics_device_type" AS ENUM('desktop', 'mobile', 'tablet', 'unknown');--> statement-breakpoint
CREATE TYPE "public"."analytics_event_type" AS ENUM('page_view', 'action', 'conversion');--> statement-breakpoint
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
ALTER TABLE "user" ALTER COLUMN "email_verified" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "analytics_event" ADD CONSTRAINT "analytics_event_session_id_analytics_session_id_fk" FOREIGN KEY ("session_id") REFERENCES "public"."analytics_session"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "analytics_event" ADD CONSTRAINT "analytics_event_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "analytics_session" ADD CONSTRAINT "analytics_session_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
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
CREATE INDEX "analytics_session_device_type_idx" ON "analytics_session" USING btree ("device_type");