import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Notification } from './notification.schema';
import { NotificationsGateway } from './notifications.gateway';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectModel(Notification.name)
    private notificationModel: Model<Notification>,
    private notificationsGateway: NotificationsGateway,
  ) {}

  async sendNotification(userId: string, message: string) {
    const notification = new this.notificationModel({ userId, message });
    await notification.save();
    this.notificationsGateway.notifyUser(userId, message);
  }

  async getNotifications(userId: string) {
    return this.notificationModel
      .find({ userId })
      .sort({ createdAt: -1 })
      .exec();
  }
}
