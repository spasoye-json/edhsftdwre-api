import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { z } from 'zod';

type IsEvenResult = BadRequestException | boolean;

@Injectable()
export class IsEvenService {
  private readonly logger = new Logger(IsEvenService.name);
  private readonly isEvenSchema = z.coerce.number().int();
  private readonly isEvenCache: Map<string, IsEvenResult> = new Map();

  constructor() {
    this.isEvenCache.set('0', new BadRequestException('Invalid number'));
  }

  async getIsEven(number: string) {
    let result = this.getIsEvenFromCache(number);

    if (result !== null) {
      return {
        result,
      };
    }

    const numericResult = this.isEvenSchema.safeParse(number);

    if (!numericResult.success) {
      const exception = new BadRequestException('Invalid number');
      this.logger.log('Storing exception in cache');
      this.isEvenCache.set(number, exception);

      throw exception;
    }

    result = this.calculateIsEvenNumber(numericResult.data);

    return {
      result,
    };
  }

  private calculateIsEvenNumber(n: number) {
    const result = n % 2 === 0;
    this.logger.log(`Caching even number result for ${n}: ${result}`);
    this.isEvenCache.set(n.toString(), result);
    return result;
  }

  private getIsEvenFromCache(n: string) {
    if (this.isEvenCache.has(n)) {
      this.logger.log(`Cache hit for ${n}`);
      const result = this.isEvenCache.get(n);

      if (typeof result === 'boolean') {
        return result;
      }

      this.logger.log('Cache hit with exception');
      throw result;
    }

    this.logger.log(`Cache miss for ${n}`);

    return null;
  }
}
