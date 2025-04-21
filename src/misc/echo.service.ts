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

    result = parsedMessage.data;

    this.logger.log(`Caching message: ${result}`);
    this.echoCache.set(message, result);

    return {
      result,
    };
  }

  private getEchoFromCache(message: string) {
    const cachedResult = this.echoCache.get(message);
    if (cachedResult) {
      this.logger.log(`Cache hit for message: ${message}`);
      return cachedResult;
    }
    this.logger.log(`Cache miss for message: ${message}`);
    return null;
  }
}
