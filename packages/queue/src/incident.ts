import { Queue, Worker } from "bullmq"
import type { QueueProcessor } from "./common"

const INCIDENT_QUEUE = 'incidents'

export type IncidentJob = {
  id: number
  severity: string
  serviceId: string
}

const incidentQueue = new Queue(INCIDENT_QUEUE)

export type IncidentJobProcessor<R = any> = QueueProcessor<IncidentJob, R>

export const createIncidentWorker = <R = any>(processor:IncidentJobProcessor<R>) => new Worker(INCIDENT_QUEUE, processor)

export const addIncidentJob = (data: IncidentJob) => incidentQueue.add('incident', data)
