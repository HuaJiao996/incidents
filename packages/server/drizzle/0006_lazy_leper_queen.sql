CREATE TABLE "child_incident" (
	"id" uuid PRIMARY KEY NOT NULL,
	"parent_id" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE "incident_type_group" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"incident_type_id" uuid NOT NULL,
	"group_name" varchar(500) NOT NULL,
	"condition" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"order" integer NOT NULL
);
--> statement-breakpoint
ALTER TABLE "incident" ADD COLUMN "incident_type_group_id" uuid;--> statement-breakpoint
ALTER TABLE "incident_type_status_condition" ADD COLUMN "group_id" uuid;--> statement-breakpoint
ALTER TABLE "child_incident" ADD CONSTRAINT "child_incident_id_incident_id_fk" FOREIGN KEY ("id") REFERENCES "public"."incident"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "child_incident" ADD CONSTRAINT "child_incident_parent_id_incident_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."incident"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "incident_type_group" ADD CONSTRAINT "incident_type_group_incident_type_id_incident_type_id_fk" FOREIGN KEY ("incident_type_id") REFERENCES "public"."incident_type"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "incident" ADD CONSTRAINT "incident_incident_type_group_id_incident_type_id_fk" FOREIGN KEY ("incident_type_group_id") REFERENCES "public"."incident_type"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "incident_type_status_condition" ADD CONSTRAINT "incident_type_status_condition_group_id_incident_type_group_id_fk" FOREIGN KEY ("group_id") REFERENCES "public"."incident_type_group"("id") ON DELETE no action ON UPDATE no action;