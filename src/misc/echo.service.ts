import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { z } from 'zod';

type EchoResult = BadRequestException | string;

@Injectable()
export class EchoService {
  private readonly logger = new Logger(EchoService.name);
  private readonly echoSchema = z.string().min(1);
  private readonly echoCache: Map<string, EchoResult> = new Map();

  async getEcho(message: string) {
    let result = this.getEchoFromCache(message);

    if (result !== null) {
      return {
        result,
      };
    }

    const parsedMessage = this.echoSchema.safeParse(message);

    if (!parsedMessage.success) {
      const exception = new BadRequestException('Invalid message');
      this.logger.log('Storing exception in cache');
      this.echoCache.set(message, exception);

      throw exception;
    }

    result = this.calculateEcho(parsedMessage.data);

    return {
      result,
    };
  }

  private calculateEcho(message: string) {
    this.logger.log(`Caching echo for message: ${message}`);
    this.echoCache.set(message, message);

    return message;
  }

  private getEchoFromCache(message: string) {
    if (this.echoCache.has(message)) {
      this.logger.log(`Cache hit for message: ${message}`);
      const result = this.echoCache.get(message);

      if (typeof result === 'string') {
        return result;
      }

      this.logger.log('Cache hit with exception');
      throw result;
    }

    this.logger.log(`Cache miss for message: ${message}`);

    return null;
  }
}
