CREATE TABLE "user_interest_building" (
	"user_id" varchar(255) NOT NULL,
	"building_id" varchar(255) NOT NULL,
	"auto_added" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	CONSTRAINT "user_interest_building_user_id_building_id_pk" PRIMARY KEY("user_id","building_id")
);
--> statement-breakpoint
ALTER TABLE "user_interest_building" ADD CONSTRAINT "user_interest_building_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_interest_building" ADD CONSTRAINT "user_interest_building_building_id_building_id_fk" FOREIGN KEY ("building_id") REFERENCES "public"."building"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "user_interest_building_user_idx" ON "user_interest_building" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "user_interest_building_building_idx" ON "user_interest_building" USING btree ("building_id");