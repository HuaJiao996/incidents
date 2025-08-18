import type { Job } from "bullmq";

export type QueueProcessor<T = any, R = any> = (job: Job<T>) => Promise<R>
 