ALTER TABLE "comment" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "incident_action" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "service_team" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "service_user" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
DROP TABLE "comment" CASCADE;--> statement-breakpoint
DROP TABLE "incident_action" CASCADE;--> statement-breakpoint
DROP TABLE "service_team" CASCADE;--> statement-breakpoint
DROP TABLE "service_user" CASCADE;--> statement-breakpoint
ALTER TABLE "incident" DROP CONSTRAINT "incident_parent_id_incident_id_fk";
--> statement-breakpoint
ALTER TABLE "incident" ALTER COLUMN "assignee_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "incident" ALTER COLUMN "resolved_at" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "incident" ALTER COLUMN "resolved_by_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "incident" ALTER COLUMN "resilved_reason" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "incident" DROP COLUMN "parent_id";--> statement-breakpoint
DROP TYPE "public"."incident_action_status";