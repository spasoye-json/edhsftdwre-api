import { Module } from '@nestjs/common';
import { NotificationsGateway } from './notifications.gateway';
import { NotificationsService } from './notifications.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Notification, NotificationSchema } from './notification.schema';
import { NotificationsController } from './notifications.controller';
import { JobQueueModule } from 'src/job-queue/job-queue.module';

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
export class NotificationsModule {}
