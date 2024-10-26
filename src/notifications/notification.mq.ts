import {
  JobQueueSchema,
  JobQueueTask,
} from 'src/job-queue/job-queue.constants';
import { Notification } from './notification.schema';
import { z } from 'zod';

export const NotificationCreatedEventSchema = JobQueueSchema.extend({
  payload: z.object({
    id: z.string(),
    userId: z.string(),
    message: z.string(),
  }),
});

export function createNotificationCreatedEvent(
  notification: Notification,
): z.infer<typeof NotificationCreatedEventSchema> {
  return {
    type: JobQueueTask.NOTIFICATION_CREATED,
    payload: {
      id: notification.id.toString(),
      userId: notification.userId,
      message: notification.message,
    },
  };
}
