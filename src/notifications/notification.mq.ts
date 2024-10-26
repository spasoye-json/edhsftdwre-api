import { Notification } from './notification.schema';

export function createNotificationCreatedEvent(notification: Notification) {
  return {
    type: 'NOTIFICATION_CREATED',
    payload: {
      id: notification.id.toString(),
      userId: notification.userId,
      message: notification.message,
    },
  };
}
