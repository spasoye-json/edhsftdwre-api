import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import { Module } from '@nestjs/common';
import { MQ_CHANNEL, MQ_EXCHANGE } from './job-queue.constants';
import { JobQueueService } from './job-queue.service';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [
    RabbitMQModule.forRoot(RabbitMQModule, {
      uri: 'amqp://localhost:5672',
      exchanges: [
        {
          name: MQ_EXCHANGE,
          type: 'direct',
        },
      ],
      channels: {
        [MQ_CHANNEL]: {
          default: true,
        },
      },
    }),
    UsersModule,
  ],
  providers: [JobQueueService],
  exports: [JobQueueService],
})
export class JobQueueModule {}
