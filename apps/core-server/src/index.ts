import { createAlertWorker, createIncidentWorker } from "@incidents/queue"
import { alertJobProcessor } from "./processors/alert"
import { incidentJobProcessor } from "./processors/incident"

async function bootstrap() {
  const alertWorker = createAlertWorker(alertJobProcessor)
  const incidentWorker = createIncidentWorker(incidentJobProcessor)
}

bootstrap()

