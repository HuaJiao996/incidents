CREATE TYPE "public"."alert_type" AS ENUM('trigger', 'resolve');--> statement-breakpoint
CREATE TYPE "public"."custom_field_type" AS ENUM('string', 'number', 'boolean', 'array', 'enum');--> statement-breakpoint
CREATE TABLE "incident_type_status_condition" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"incidentTypeId" uuid NOT NULL,
	"condition" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"status" "incident_status" NOT NULL,
	"order" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "global_custome_field" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"path" varchar(500) NOT NULL,
	"type" "custom_field_type" NOT NULL,
	"required" boolean DEFAULT false NOT NULL,
	"enumValues" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	"updatedby" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE "service_custome_field" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"serviceId" uuid NOT NULL,
	"path" varchar(500) NOT NULL,
	"type" "custom_field_type" NOT NULL,
	"required" boolean DEFAULT false NOT NULL,
	"enumValues" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	"updatedby" uuid NOT NULL
);
--> statement-breakpoint
ALTER TABLE "incident_type_action" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "incident_type_condition" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
DROP TABLE "incident_type_action" CASCADE;--> statement-breakpoint
DROP TABLE "incident_type_condition" CASCADE;--> statement-breakpoint
ALTER TABLE "alert" ALTER COLUMN "content" SET DATA TYPE varchar(5000);--> statement-breakpoint
ALTER TABLE "alert" ALTER COLUMN "content" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "incident_type" ADD COLUMN "condition" jsonb DEFAULT '{}'::jsonb NOT NULL;--> statement-breakpoint
ALTER TABLE "incident_type" ADD COLUMN "order" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "alert" ADD COLUMN "customFields" jsonb DEFAULT '{}'::jsonb NOT NULL;--> statement-breakpoint
ALTER TABLE "alert" ADD COLUMN "type" "alert_type";--> statement-breakpoint
ALTER TABLE "incident_type_status_condition" ADD CONSTRAINT "incident_type_status_condition_incidentTypeId_incident_type_id_fk" FOREIGN KEY ("incidentTypeId") REFERENCES "public"."incident_type"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "global_custome_field" ADD CONSTRAINT "global_custome_field_updatedby_user_id_fk" FOREIGN KEY ("updatedby") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "service_custome_field" ADD CONSTRAINT "service_custome_field_serviceId_service_id_fk" FOREIGN KEY ("serviceId") REFERENCES "public"."service"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "service_custome_field" ADD CONSTRAINT "service_custome_field_updatedby_user_id_fk" FOREIGN KEY ("updatedby") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
DROP TYPE "public"."incident_type_behavior";