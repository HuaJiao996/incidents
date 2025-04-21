ALTER TABLE "global_custome_field" RENAME TO "global_custom_field";--> statement-breakpoint
ALTER TABLE "service_custome_field" RENAME TO "service_custom_field";--> statement-breakpoint
ALTER TABLE "incident" RENAME COLUMN "resilved_reason" TO "resolved_reason";--> statement-breakpoint
ALTER TABLE "service_custom_field" DROP CONSTRAINT "service_custome_field_service_id_service_id_fk";
--> statement-breakpoint
ALTER TABLE "service_custom_field" ADD CONSTRAINT "service_custom_field_service_id_service_id_fk" FOREIGN KEY ("service_id") REFERENCES "public"."service"("id") ON DELETE no action ON UPDATE no action;