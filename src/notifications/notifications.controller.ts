import { Controller, Post, Body, Param, Get, UseGuards } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { JobQueueService } from 'src/job-queue/job-queue.service';
import { createNotificationCreatedEvent } from './notification.mq';

@Controller('notifications')
export class NotificationsController {
  constructor(
    private readonly notificationsService: NotificationsService,
    private readonly jobQueueService: JobQueueService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get(':userId/notifications')
  async getNotifications(@Param('userId') userId: string) {
    return this.notificationsService.getNotifications(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':userId/send')
  async sendNotification(
    @Param('userId') userId: string,
    @Body('message') message: string,
  ) {
    const notification = await this.notificationsService.sendNotification(
      userId,
      message,
    );

    this.jobQueueService.sendTaskMessage(
      createNotificationCreatedEvent(notification),
    );

    return notification;
  }
}
