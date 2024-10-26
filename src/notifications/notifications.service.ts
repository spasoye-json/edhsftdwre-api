import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Notification } from './notification.schema';
import { NotificationsGateway } from './notifications.gateway';
import { JobQueueService } from 'src/job-queue/job-queue.service';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectModel(Notification.name)
    private notificationModel: Model<Notification>,
    private notificationsGateway: NotificationsGateway,
    private jobQueueService: JobQueueService,
  ) {}

  async sendNotification(userId: string, message: string) {
    await this.jobQueueService.addJob({
      type: 'sendNotification',
      userId,
      message,
    });
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
