import { Module, OnModuleInit } from '@nestjs/common';
import { NotificationsGateway } from './notifications.gateway';
import { NotificationsService } from './notifications.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Notification, NotificationSchema } from './notification.schema';
import { NotificationsController } from './notifications.controller';
import { JobQueueModule } from 'src/job-queue/job-queue.module';
import { JobQueueService } from 'src/job-queue/job-queue.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Notification.name, schema: NotificationSchema },
    ]),
    JobQueueModule,
  ],
  providers: [NotificationsGateway, NotificationsService],
  controllers: [NotificationsController],
})
export class NotificationsModule implements OnModuleInit {
  constructor(
    private notificationsService: NotificationsService,
    private jobQueueService: JobQueueService,
  ) {}

  async onModuleInit() {
    await this.jobQueueService.startWorker(async (job) => {
      if (job.type === 'sendNotification') {
        const { userId, message } = job;
        await this.notificationsService.processNotificationJob(userId, message);
      }
    });
  }
}
