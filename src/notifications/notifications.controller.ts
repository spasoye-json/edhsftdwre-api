import { Controller, Post, Body, Param, Get, UseGuards } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

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
    return this.notificationsService.sendNotification(userId, message);
  }
}
