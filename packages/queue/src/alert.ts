import { Queue, Worker } from "bullmq"
import type { QueueProcessor } from "./common"

const ALERT_QUEUE = 'alerts'

const alertQueue = new Queue(ALERT_QUEUE)

export type AlertJob = number
export type AlertJobProcessor<R = any> = QueueProcessor<AlertJob, R>
export const createAlertWorker = <R = any>(processor: AlertJobProcessor<R>) => new Worker(ALERT_QUEUE, processor)

export const addAlertJob = (data: AlertJob) => alertQueue.add('alert', data)

