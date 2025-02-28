ALTER TABLE "sr2-community_building" ADD CONSTRAINT "sr2-community_building_number_unique" UNIQUE("number");--> statement-breakpoint
ALTER TABLE "sr2-community_building" ADD CONSTRAINT "sr2-community_building_title_unique" UNIQUE("title");--> statement-breakpoint
ALTER TABLE "sr2-community_entrance" ADD CONSTRAINT "building_id_entrance_number_idx" UNIQUE("building_id","entrance_number");--> statement-breakpoint
ALTER TABLE "sr2-community_floor" ADD CONSTRAINT "endtance_id_floor_number_idx" UNIQUE("floor_number","entrance_id");