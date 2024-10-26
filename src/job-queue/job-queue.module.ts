import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import { Module } from '@nestjs/common';

@Module({
  imports: [
    RabbitMQModule.forRoot(RabbitMQModule, {
      uri: 'amqp://localhost:5672',
      exchanges: [
        {
          name: 'tasks.exchange',
          type: 'direct',
        },
      ],
      channels: {
        'tasks.channel': {
          default: true,
        },
      },
    }),
  ],
  providers: [],
  exports: [],
})
export class JobQueueModule {}
