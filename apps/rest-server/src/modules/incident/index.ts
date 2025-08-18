import { findAllIncidentQuerySchema } from "./model";
import { findAllIncidents } from "./service";
import { withAuthElysia } from "@/utils";

export const incidentModule = withAuthElysia({ prefix: '/incident' })
  .get('/', ({ query }) => findAllIncidents(query), {
    auth: {
      incident: ['read']
    },
    query: findAllIncidentQuerySchema,
  })