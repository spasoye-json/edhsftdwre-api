import { z } from 'zod';

export const MQ_EXCHANGE = 'tasks.exchange';
export const MQ_ROUTING_KEY = 'tasks';
export const MQ_QUEUE = 'tasks.queue';
export const MQ_CHANNEL = 'tasks.channel';

export enum JobQueueTask {
  // Notification
  NOTIFICATION_CREATED = 'NOTIFICATION_CREATED',
  // User
  USER_REGISTERED = 'USER_REGISTERED',
  // Verification
  USER_VERIFIED = 'USER_VERIFIED',
}

export const JobQueueSchema = z.object({
  type: z.nativeEnum(JobQueueTask),
});
