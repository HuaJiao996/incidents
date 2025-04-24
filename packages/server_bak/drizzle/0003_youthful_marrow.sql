ALTER TABLE "alert" RENAME COLUMN "customFields" TO "custom_fields";--> statement-breakpoint
ALTER TABLE "alert" RENAME COLUMN "serviceId" TO "service_id";--> statement-breakpoint
ALTER TABLE "alert" RENAME COLUMN "incidentId" TO "incident_id";--> statement-breakpoint
ALTER TABLE "alert" RENAME COLUMN "createdAt" TO "created_at";--> statement-breakpoint
ALTER TABLE "alert" RENAME COLUMN "updatedAt" TO "updated_at";--> statement-breakpoint
ALTER TABLE "comment" RENAME COLUMN "incidentId" TO "incident_id";--> statement-breakpoint
ALTER TABLE "comment" RENAME COLUMN "createdAt" TO "created_at";--> statement-breakpoint
ALTER TABLE "comment" RENAME COLUMN "updatedAt" TO "updated_at";--> statement-breakpoint
ALTER TABLE "comment" RENAME COLUMN "commenterId" TO "commenter_id";--> statement-breakpoint
ALTER TABLE "global_custome_field" RENAME COLUMN "enumValues" TO "enum_values";--> statement-breakpoint
ALTER TABLE "incident" RENAME COLUMN "incidentTypeId" TO "incident_type_id";--> statement-breakpoint
ALTER TABLE "incident" RENAME COLUMN "createdAt" TO "created_at";--> statement-breakpoint
ALTER TABLE "incident" RENAME COLUMN "updatedAt" TO "updated_at";--> statement-breakpoint
ALTER TABLE "incident" RENAME COLUMN "assigneeId" TO "assignee_id";--> statement-breakpoint
ALTER TABLE "incident" RENAME COLUMN "resolvedAt" TO "resolved_at";--> statement-breakpoint
ALTER TABLE "incident" RENAME COLUMN "resolvedById" TO "resolved_by_id";--> statement-breakpoint
ALTER TABLE "incident" RENAME COLUMN "resilvedReason" TO "resilved_reason";--> statement-breakpoint
ALTER TABLE "incident_action" RENAME COLUMN "incidentId" TO "incident_id";--> statement-breakpoint
ALTER TABLE "incident_action" RENAME COLUMN "createdAt" TO "created_at";--> statement-breakpoint
ALTER TABLE "incident_action" RENAME COLUMN "updatedAt" TO "updated_at";--> statement-breakpoint
ALTER TABLE "incident_action" RENAME COLUMN "targertUrl" TO "targert_url";--> statement-breakpoint
ALTER TABLE "incident_type" RENAME COLUMN "serviceId" TO "service_id";--> statement-breakpoint
ALTER TABLE "incident_type_status_condition" RENAME COLUMN "incidentTypeId" TO "incident_type_id";--> statement-breakpoint
ALTER TABLE "service" RENAME COLUMN "createdAt" TO "created_at";--> statement-breakpoint
ALTER TABLE "service" RENAME COLUMN "updatedAt" TO "updated_at";--> statement-breakpoint
ALTER TABLE "service_custome_field" RENAME COLUMN "serviceId" TO "service_id";--> statement-breakpoint
ALTER TABLE "service_custome_field" RENAME COLUMN "enumValues" TO "enum_values";--> statement-breakpoint
ALTER TABLE "service_route" RENAME COLUMN "serviceId" TO "service_id";--> statement-breakpoint
ALTER TABLE "service_route" RENAME COLUMN "createdAt" TO "created_at";--> statement-breakpoint
ALTER TABLE "service_route" RENAME COLUMN "updatedAt" TO "updated_at";--> statement-breakpoint
ALTER TABLE "service_team" RENAME COLUMN "serviceId" TO "service_id";--> statement-breakpoint
ALTER TABLE "service_team" RENAME COLUMN "teamId" TO "team_id";--> statement-breakpoint
ALTER TABLE "service_user" RENAME COLUMN "serviceId" TO "service_id";--> statement-breakpoint
ALTER TABLE "service_user" RENAME COLUMN "userId" TO "user_id";--> statement-breakpoint
ALTER TABLE "team" RENAME COLUMN "createdAt" TO "created_at";--> statement-breakpoint
ALTER TABLE "team_member" RENAME COLUMN "userId" TO "user_id";--> statement-breakpoint
ALTER TABLE "team_member" RENAME COLUMN "teamId" TO "team_id";--> statement-breakpoint
ALTER TABLE "alert" DROP CONSTRAINT "alert_serviceId_service_id_fk";
--> statement-breakpoint
ALTER TABLE "alert" DROP CONSTRAINT "alert_incidentId_incident_id_fk";
--> statement-breakpoint
ALTER TABLE "comment" DROP CONSTRAINT "comment_incidentId_incident_id_fk";
--> statement-breakpoint
ALTER TABLE "comment" DROP CONSTRAINT "comment_commenterId_user_id_fk";
--> statement-breakpoint
ALTER TABLE "incident" DROP CONSTRAINT "incident_incidentTypeId_incident_type_id_fk";
--> statement-breakpoint
ALTER TABLE "incident" DROP CONSTRAINT "incident_assigneeId_user_id_fk";
--> statement-breakpoint
ALTER TABLE "incident" DROP CONSTRAINT "incident_resolvedById_user_id_fk";
--> statement-breakpoint
ALTER TABLE "incident_action" DROP CONSTRAINT "incident_action_incidentId_incident_id_fk";
--> statement-breakpoint
ALTER TABLE "incident_type" DROP CONSTRAINT "incident_type_serviceId_service_id_fk";
--> statement-breakpoint
ALTER TABLE "incident_type_status_condition" DROP CONSTRAINT "incident_type_status_condition_incidentTypeId_incident_type_id_fk";
--> statement-breakpoint
ALTER TABLE "service_custome_field" DROP CONSTRAINT "service_custome_field_serviceId_service_id_fk";
--> statement-breakpoint
ALTER TABLE "service_route" DROP CONSTRAINT "service_route_serviceId_service_id_fk";
--> statement-breakpoint
ALTER TABLE "service_team" DROP CONSTRAINT "service_team_serviceId_service_id_fk";
--> statement-breakpoint
ALTER TABLE "service_team" DROP CONSTRAINT "service_team_teamId_team_id_fk";
--> statement-breakpoint
ALTER TABLE "service_user" DROP CONSTRAINT "service_user_serviceId_service_id_fk";
--> statement-breakpoint
ALTER TABLE "service_user" DROP CONSTRAINT "service_user_userId_user_id_fk";
--> statement-breakpoint
ALTER TABLE "team_member" DROP CONSTRAINT "team_member_userId_user_id_fk";
--> statement-breakpoint
ALTER TABLE "team_member" DROP CONSTRAINT "team_member_teamId_team_id_fk";
--> statement-breakpoint
ALTER TABLE "alert" ADD CONSTRAINT "alert_service_id_service_id_fk" FOREIGN KEY ("service_id") REFERENCES "public"."service"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "alert" ADD CONSTRAINT "alert_incident_id_incident_id_fk" FOREIGN KEY ("incident_id") REFERENCES "public"."incident"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "comment" ADD CONSTRAINT "comment_incident_id_incident_id_fk" FOREIGN KEY ("incident_id") REFERENCES "public"."incident"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "comment" ADD CONSTRAINT "comment_commenter_id_user_id_fk" FOREIGN KEY ("commenter_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "incident" ADD CONSTRAINT "incident_incident_type_id_incident_type_id_fk" FOREIGN KEY ("incident_type_id") REFERENCES "public"."incident_type"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "incident" ADD CONSTRAINT "incident_assignee_id_user_id_fk" FOREIGN KEY ("assignee_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "incident" ADD CONSTRAINT "incident_resolved_by_id_user_id_fk" FOREIGN KEY ("resolved_by_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "incident_action" ADD CONSTRAINT "incident_action_incident_id_incident_id_fk" FOREIGN KEY ("incident_id") REFERENCES "public"."incident"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "incident_type" ADD CONSTRAINT "incident_type_service_id_service_id_fk" FOREIGN KEY ("service_id") REFERENCES "public"."service"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "incident_type_status_condition" ADD CONSTRAINT "incident_type_status_condition_incident_type_id_incident_type_id_fk" FOREIGN KEY ("incident_type_id") REFERENCES "public"."incident_type"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "service_custome_field" ADD CONSTRAINT "service_custome_field_service_id_service_id_fk" FOREIGN KEY ("service_id") REFERENCES "public"."service"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "service_route" ADD CONSTRAINT "service_route_service_id_service_id_fk" FOREIGN KEY ("service_id") REFERENCES "public"."service"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "service_team" ADD CONSTRAINT "service_team_service_id_service_id_fk" FOREIGN KEY ("service_id") REFERENCES "public"."service"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "service_team" ADD CONSTRAINT "service_team_team_id_team_id_fk" FOREIGN KEY ("team_id") REFERENCES "public"."team"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "service_user" ADD CONSTRAINT "service_user_service_id_service_id_fk" FOREIGN KEY ("service_id") REFERENCES "public"."service"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "service_user" ADD CONSTRAINT "service_user_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "team_member" ADD CONSTRAINT "team_member_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "team_member" ADD CONSTRAINT "team_member_team_id_team_id_fk" FOREIGN KEY ("team_id") REFERENCES "public"."team"("id") ON DELETE no action ON UPDATE no action;