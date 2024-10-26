import { AmqpConnection, RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';
import { Injectable, Logger } from '@nestjs/common';
import {
  JobQueueSchema,
  JobQueueTask,
  MQ_CHANNEL,
  MQ_EXCHANGE,
  MQ_QUEUE,
  MQ_ROUTING_KEY,
} from './job-queue.constants';
import { MailerService } from '@nestjs-modules/mailer';
import { UsersService } from 'src/users/users.service';
import { NotificationCreatedEventSchema } from 'src/notifications/notification.mq';
import { UserRegisteredEventSchema } from 'src/users/user.mq';

@Injectable()
export class JobQueueService {
  private readonly logger = new Logger(JobQueueService.name);

  constructor(
    private readonly amqpConnection: AmqpConnection,
    private readonly mailerService: MailerService,
    private readonly usersService: UsersService,
  ) {}

  @RabbitSubscribe({
    exchange: MQ_EXCHANGE,
    routingKey: MQ_ROUTING_KEY,
    queue: MQ_QUEUE,
    queueOptions: {
      channel: MQ_CHANNEL,
    },
  })
  public async handleTaskMessage(msg: unknown) {
    this.logger.log(`Received message: ${JSON.stringify(msg)}`);

    const task = JobQueueSchema.parse(msg);

    switch (task.type) {
      case JobQueueTask.NOTIFICATION_CREATED:
        {
          const { payload } = NotificationCreatedEventSchema.parse(msg);
          const user = await this.usersService.findNotifiableUserById(
            payload.userId,
          );

          if (user) {
            this.logger.log(`Sending notification to user: ${user.email}`);
            await this.mailerService.sendMail({
              to: user.email,
              subject: 'New Notification',
              template: './notification',
              context: {
                message: payload.message,
              },
            });
          }
        }
        break;

      case JobQueueTask.USER_REGISTERED:
        {
          const { payload } = UserRegisteredEventSchema.parse(msg);

          this.logger.log(
            `Sending verification email to user: ${payload.email}`,
          );
          await this.mailerService.sendMail({
            to: payload.email,
            subject: 'Verify your email',
            template: './verify',
            context: {
              code: payload.code,
            },
          });
        }
        break;
    }
  }

  public async sendTaskMessage(msg: unknown) {
    this.logger.log(`Sending message: ${JSON.stringify(msg)}`);

    this.amqpConnection.publish(MQ_EXCHANGE, MQ_ROUTING_KEY, msg);
  }
}
