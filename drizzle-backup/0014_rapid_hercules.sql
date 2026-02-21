ALTER TABLE "user_profile" ADD COLUMN "tagline" varchar(100);--> statement-breakpoint
ALTER TABLE "user_profile" ADD COLUMN "tagline_set_by_admin" boolean DEFAULT false NOT NULL;