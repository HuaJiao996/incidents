ALTER TABLE "incident_type" DROP CONSTRAINT "incident_type_updatedby_user_id_fk";
--> statement-breakpoint
ALTER TABLE "incident_type" DROP CONSTRAINT "incident_type_createdby_user_id_fk";
--> statement-breakpoint
ALTER TABLE "global_custome_field" DROP CONSTRAINT "global_custome_field_updatedby_user_id_fk";
--> statement-breakpoint
ALTER TABLE "service_custome_field" DROP CONSTRAINT "service_custome_field_updatedby_user_id_fk";
--> statement-breakpoint
ALTER TABLE "service_route" DROP CONSTRAINT "service_route_createdby_user_id_fk";
--> statement-breakpoint
ALTER TABLE "service_route" DROP CONSTRAINT "service_route_updatedby_user_id_fk";
--> statement-breakpoint
ALTER TABLE "incident_type" DROP COLUMN "createdAt";--> statement-breakpoint
ALTER TABLE "incident_type" DROP COLUMN "updatedAt";--> statement-breakpoint
ALTER TABLE "incident_type" DROP COLUMN "updatedby";--> statement-breakpoint
ALTER TABLE "incident_type" DROP COLUMN "createdby";--> statement-breakpoint
ALTER TABLE "global_custome_field" DROP COLUMN "createdAt";--> statement-breakpoint
ALTER TABLE "global_custome_field" DROP COLUMN "updatedAt";--> statement-breakpoint
ALTER TABLE "global_custome_field" DROP COLUMN "updatedby";--> statement-breakpoint
ALTER TABLE "service_custome_field" DROP COLUMN "createdAt";--> statement-breakpoint
ALTER TABLE "service_custome_field" DROP COLUMN "updatedAt";--> statement-breakpoint
ALTER TABLE "service_custome_field" DROP COLUMN "updatedby";--> statement-breakpoint
ALTER TABLE "service_route" DROP COLUMN "createdby";--> statement-breakpoint
ALTER TABLE "service_route" DROP COLUMN "updatedby";