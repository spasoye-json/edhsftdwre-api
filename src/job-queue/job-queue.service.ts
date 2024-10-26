import { RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class JobQueueService {
  private readonly logger = new Logger(JobQueueService.name);

  @RabbitSubscribe({
    exchange: 'tasks.exchange',
    routingKey: 'tasks',
    queue: 'tasks.queue',
    queueOptions: {
      channel: 'tasks.channel',
    },
  })
  public async handleTaskMessage(msg: unknown) {
    this.logger.log(`Received message: ${JSON.stringify(msg)}`);
  }
}
