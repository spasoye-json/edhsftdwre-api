import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import * as amqp from 'amqplib';

@Injectable()
export class JobQueueService implements OnModuleInit {
  private readonly logger: Logger = new Logger(JobQueueService.name);
  private connection: amqp.Connection;
  private channel: amqp.Channel;
  private readonly queue = 'job_queue';

  async onModuleInit() {
    await this.initialize();
  }

  async initialize() {
    this.connection = await amqp.connect('amqp://localhost');
    this.channel = await this.connection.createChannel();

    await this.channel.assertQueue(this.queue, { durable: true });
  }

  async addJob(job: Record<string, any>) {
    this.channel.sendToQueue(this.queue, Buffer.from(JSON.stringify(job)), {
      persistent: true,
    });
    this.logger.log(`Job added to queue: ${JSON.stringify(job)}`);
  }

  async startWorker(processJob: (job: Record<string, any>) => Promise<void>) {
    this.channel.consume(
      this.queue,
      async (msg) => {
        if (msg !== null) {
          const job = JSON.parse(msg.content.toString());
          try {
            await processJob(job);
            this.channel.ack(msg);
          } catch (error) {
            this.logger.error(`Failed to process job: ${error.message}`);
            this.channel.nack(msg);
          }
        }
      },
      { noAck: false },
    );
  }
}
