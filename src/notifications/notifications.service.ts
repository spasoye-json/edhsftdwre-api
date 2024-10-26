import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Notification } from './notification.schema';
import { NotificationsGateway } from './notifications.gateway';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectModel(Notification.name)
    private readonly notificationModel: Model<Notification>,
    private readonly notificationsGateway: NotificationsGateway,
  ) {}

  async sendNotification(userId: string, message: string) {
    const notification = new this.notificationModel({ userId, message });

    return await notification.save();
  }

  async getNotifications(userId: string) {
    return this.notificationModel
      .find({ userId })
      .sort({ createdAt: -1 })
      .exec();
  }

  async processNotificationJob(userId: string, message: string) {
    const notification = new this.notificationModel({ userId, message });
    await notification.save();

    this.notificationsGateway.notifyUser(userId, message);
  }
}
