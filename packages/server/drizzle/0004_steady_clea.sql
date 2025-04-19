ALTER TABLE "incident" ALTER COLUMN "assignee_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "incident" ALTER COLUMN "resolved_at" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "incident" ALTER COLUMN "resolved_by_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "incident" ALTER COLUMN "resilved_reason" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "incident" ADD COLUMN "parent_id" uuid;--> statement-breakpoint
ALTER TABLE "incident" ADD CONSTRAINT "incident_parent_id_incident_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."incident"("id") ON DELETE no action ON UPDATE no action;