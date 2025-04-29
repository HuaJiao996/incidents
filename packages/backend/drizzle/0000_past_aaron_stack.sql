CREATE TYPE "public"."alert_type" AS ENUM('trigger', 'resolve');--> statement-breakpoint
CREATE TYPE "public"."incident_status" AS ENUM('triggered', 'acknowledged', 'resolved');--> statement-breakpoint
CREATE TYPE "public"."custom_field_type" AS ENUM('string', 'number', 'boolean', 'array', 'enum');--> statement-breakpoint
CREATE TABLE "alert" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" varchar(500) NOT NULL,
	"content" varchar(5000) NOT NULL,
	"custom_fields" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"type" "alert_type",
	"service_id" uuid,
	"incident_id" uuid,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "child_incident" (
	"id" uuid PRIMARY KEY NOT NULL,
	"parent_id" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE "incident" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" varchar(500) NOT NULL,
	"description" varchar(5000) NOT NULL,
	"incident_type_id" uuid NOT NULL,
	"incident_type_group_id" uuid,
	"status" "incident_status" DEFAULT 'triggered',
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"assignee_id" uuid,
	"resolved_at" timestamp DEFAULT now(),
	"resolved_by_id" uuid,
	"resolved_reason" varchar(500)
);
--> statement-breakpoint
CREATE TABLE "global_custom_field" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"path" varchar(500) NOT NULL,
	"type" "custom_field_type" NOT NULL,
	"required" boolean DEFAULT false NOT NULL,
	"enum_values" jsonb DEFAULT '[]'::jsonb NOT NULL
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
CREATE TABLE "incident_type" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(500) NOT NULL,
	"service_id" uuid NOT NULL,
	"condition" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"order" integer NOT NULL,
	"title" varchar(500) NOT NULL,
	"description" varchar(5000) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "incident_type_status_condition" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"incident_type_id" uuid NOT NULL,
	"condition" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"status" "incident_status" NOT NULL,
	"order" integer NOT NULL,
	"group_id" uuid
);
--> statement-breakpoint
CREATE TABLE "service_custom_field" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"service_id" uuid NOT NULL,
	"path" varchar(500) NOT NULL,
	"type" "custom_field_type" NOT NULL,
	"required" boolean DEFAULT false NOT NULL,
	"enum_values" jsonb DEFAULT '[]'::jsonb NOT NULL
);
--> statement-breakpoint
CREATE TABLE "service_route" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"service_id" uuid NOT NULL,
	"order" integer NOT NULL,
	"condition" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"description" varchar(5000) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "service" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(500) NOT NULL,
	"description" varchar(1000),
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "service_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "team_member" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"team_id" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE "team" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(500) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(500) NOT NULL,
	"email" varchar(500) NOT NULL
);
--> statement-breakpoint
ALTER TABLE "alert" ADD CONSTRAINT "alert_service_id_service_id_fk" FOREIGN KEY ("service_id") REFERENCES "public"."service"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "alert" ADD CONSTRAINT "alert_incident_id_incident_id_fk" FOREIGN KEY ("incident_id") REFERENCES "public"."incident"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "child_incident" ADD CONSTRAINT "child_incident_id_incident_id_fk" FOREIGN KEY ("id") REFERENCES "public"."incident"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "child_incident" ADD CONSTRAINT "child_incident_parent_id_incident_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."incident"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "incident" ADD CONSTRAINT "incident_incident_type_id_incident_type_id_fk" FOREIGN KEY ("incident_type_id") REFERENCES "public"."incident_type"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "incident" ADD CONSTRAINT "incident_incident_type_group_id_incident_type_id_fk" FOREIGN KEY ("incident_type_group_id") REFERENCES "public"."incident_type"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "incident" ADD CONSTRAINT "incident_assignee_id_user_id_fk" FOREIGN KEY ("assignee_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "incident" ADD CONSTRAINT "incident_resolved_by_id_user_id_fk" FOREIGN KEY ("resolved_by_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "incident_type_group" ADD CONSTRAINT "incident_type_group_incident_type_id_incident_type_id_fk" FOREIGN KEY ("incident_type_id") REFERENCES "public"."incident_type"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "incident_type" ADD CONSTRAINT "incident_type_service_id_service_id_fk" FOREIGN KEY ("service_id") REFERENCES "public"."service"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "incident_type_status_condition" ADD CONSTRAINT "incident_type_status_condition_incident_type_id_incident_type_id_fk" FOREIGN KEY ("incident_type_id") REFERENCES "public"."incident_type"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "incident_type_status_condition" ADD CONSTRAINT "incident_type_status_condition_group_id_incident_type_group_id_fk" FOREIGN KEY ("group_id") REFERENCES "public"."incident_type_group"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "service_custom_field" ADD CONSTRAINT "service_custom_field_service_id_service_id_fk" FOREIGN KEY ("service_id") REFERENCES "public"."service"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "service_route" ADD CONSTRAINT "service_route_service_id_service_id_fk" FOREIGN KEY ("service_id") REFERENCES "public"."service"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "team_member" ADD CONSTRAINT "team_member_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "team_member" ADD CONSTRAINT "team_member_team_id_team_id_fk" FOREIGN KEY ("team_id") REFERENCES "public"."team"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "incident_type_status_condition_incident_type_id_group_id_idx" ON "incident_type_status_condition" USING btree ("incident_type_id","group_id");