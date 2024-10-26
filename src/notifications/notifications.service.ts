import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Notification } from './notification.schema';
import { NotificationsGateway } from './notifications.gateway';
import { UsersService } from 'src/users/users.service';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectModel(Notification.name)
    private readonly notificationModel: Model<Notification>,
    private readonly usersService: UsersService,
    private readonly notificationsGateway: NotificationsGateway,
    private readonly mailerService: MailerService,
  ) {}

  async sendNotification(userId: string, message: string) {
    const notification = new this.notificationModel({ userId, message });

    const user = await this.usersService.findNotifiableUserById(userId);

    if (user) {
      await this.mailerService.sendMail({
        to: user.email,
        subject: 'New Notification',
        template: './notification',
        context: {
          message,
        },
      });
    }

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
