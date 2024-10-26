import { AmqpConnection, RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';
import { Injectable, Logger } from '@nestjs/common';
import {
  MQ_CHANNEL,
  MQ_EXCHANGE,
  MQ_QUEUE,
  MQ_ROUTING_KEY,
} from './job-queue.constants';

@Injectable()
export class JobQueueService {
  private readonly logger = new Logger(JobQueueService.name);

  constructor(private readonly amqpConnection: AmqpConnection) {}

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
  }

  public async sendTaskMessage(msg: unknown) {
    this.logger.log(`Sending message: ${JSON.stringify(msg)}`);

    this.amqpConnection.publish(MQ_EXCHANGE, MQ_ROUTING_KEY, msg);
  }
}
