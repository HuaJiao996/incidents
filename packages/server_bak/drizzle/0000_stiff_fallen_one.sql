CREATE TYPE "public"."incident_type_behavior" AS ENUM('trigger', 'acknowledge', 'resolve', 'assign', 'comment');--> statement-breakpoint
CREATE TYPE "public"."incident_action_status" AS ENUM('none', 'triggered', 'sucess', 'failed');--> statement-breakpoint
CREATE TYPE "public"."incident_status" AS ENUM('triggered', 'acknowledged', 'resolved');--> statement-breakpoint
CREATE TABLE "incident_type" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(500) NOT NULL,
	"serviceId" uuid NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"title" varchar(500) NOT NULL,
	"description" varchar(5000) NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	"updatedby" uuid NOT NULL,
	"createdby" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE "incident_type_action" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"incidentTypeId" uuid NOT NULL,
	"targetUrl" varchar(500) NOT NULL,
	"headers" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"inupt" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "incident_type_condition" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"incidentTypeId" uuid NOT NULL,
	"condition" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"targetBehavior" "incident_type_behavior" DEFAULT 'trigger',
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	"updatedby" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE "alert" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" varchar(500) NOT NULL,
	"content" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"serviceId" uuid,
	"incidentId" uuid,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "comment" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"content" varchar(500) NOT NULL,
	"incidentId" uuid NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	"commenterId" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE "incident" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" varchar(500) NOT NULL,
	"description" varchar(5000) NOT NULL,
	"incidentTypeId" uuid NOT NULL,
	"status" "incident_status" DEFAULT 'triggered',
	"detail" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	"assigneeId" uuid NOT NULL,
	"resolvedAt" timestamp DEFAULT now() NOT NULL,
	"resolvedById" uuid NOT NULL,
	"resilvedReason" varchar(500) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "incident_action" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"incidentId" uuid NOT NULL,
	"status" "incident_action_status" DEFAULT 'none',
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	"targertUrl" varchar(500) NOT NULL,
	"headers" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"input" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"output" jsonb DEFAULT '{}'::jsonb NOT NULL
);
--> statement-breakpoint
CREATE TABLE "service" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(500) NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "service_route" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"serviceId" uuid NOT NULL,
	"order" integer NOT NULL,
	"condition" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"description" varchar(5000) NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	"createdby" uuid NOT NULL,
	"updatedby" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE "service_team" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"serviceId" uuid NOT NULL,
	"teamId" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE "service_user" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"serviceId" uuid NOT NULL,
	"userId" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE "team" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(500) NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "team_member" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"userId" uuid NOT NULL,
	"teamId" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(500) NOT NULL,
	"email" varchar(500) NOT NULL
);
--> statement-breakpoint
ALTER TABLE "incident_type" ADD CONSTRAINT "incident_type_serviceId_service_id_fk" FOREIGN KEY ("serviceId") REFERENCES "public"."service"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "incident_type" ADD CONSTRAINT "incident_type_updatedby_user_id_fk" FOREIGN KEY ("updatedby") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "incident_type" ADD CONSTRAINT "incident_type_createdby_user_id_fk" FOREIGN KEY ("createdby") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "incident_type_action" ADD CONSTRAINT "incident_type_action_incidentTypeId_incident_type_id_fk" FOREIGN KEY ("incidentTypeId") REFERENCES "public"."incident_type"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "incident_type_condition" ADD CONSTRAINT "incident_type_condition_incidentTypeId_incident_type_id_fk" FOREIGN KEY ("incidentTypeId") REFERENCES "public"."incident_type"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "incident_type_condition" ADD CONSTRAINT "incident_type_condition_updatedby_user_id_fk" FOREIGN KEY ("updatedby") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "alert" ADD CONSTRAINT "alert_serviceId_service_id_fk" FOREIGN KEY ("serviceId") REFERENCES "public"."service"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "alert" ADD CONSTRAINT "alert_incidentId_incident_id_fk" FOREIGN KEY ("incidentId") REFERENCES "public"."incident"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "comment" ADD CONSTRAINT "comment_incidentId_incident_id_fk" FOREIGN KEY ("incidentId") REFERENCES "public"."incident"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "comment" ADD CONSTRAINT "comment_commenterId_user_id_fk" FOREIGN KEY ("commenterId") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "incident" ADD CONSTRAINT "incident_incidentTypeId_incident_type_id_fk" FOREIGN KEY ("incidentTypeId") REFERENCES "public"."incident_type"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "incident" ADD CONSTRAINT "incident_assigneeId_user_id_fk" FOREIGN KEY ("assigneeId") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "incident" ADD CONSTRAINT "incident_resolvedById_user_id_fk" FOREIGN KEY ("resolvedById") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "incident_action" ADD CONSTRAINT "incident_action_incidentId_incident_id_fk" FOREIGN KEY ("incidentId") REFERENCES "public"."incident"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "service_route" ADD CONSTRAINT "service_route_serviceId_service_id_fk" FOREIGN KEY ("serviceId") REFERENCES "public"."service"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "service_route" ADD CONSTRAINT "service_route_createdby_user_id_fk" FOREIGN KEY ("createdby") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "service_route" ADD CONSTRAINT "service_route_updatedby_user_id_fk" FOREIGN KEY ("updatedby") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "service_team" ADD CONSTRAINT "service_team_serviceId_service_id_fk" FOREIGN KEY ("serviceId") REFERENCES "public"."service"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "service_team" ADD CONSTRAINT "service_team_teamId_team_id_fk" FOREIGN KEY ("teamId") REFERENCES "public"."team"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "service_user" ADD CONSTRAINT "service_user_serviceId_service_id_fk" FOREIGN KEY ("serviceId") REFERENCES "public"."service"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "service_user" ADD CONSTRAINT "service_user_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "team_member" ADD CONSTRAINT "team_member_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "team_member" ADD CONSTRAINT "team_member_teamId_team_id_fk" FOREIGN KEY ("teamId") REFERENCES "public"."team"("id") ON DELETE no action ON UPDATE no action;