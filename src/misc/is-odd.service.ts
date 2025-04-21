import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { z } from 'zod';

type IsOddResult = BadRequestException | boolean;

@Injectable()
export class IsOddService {
  private readonly logger = new Logger(IsOddService.name);
  private readonly isOddSchema = z.coerce.number().int();
  private readonly isOddCache: Map<string, IsOddResult> = new Map();

  constructor() {
    this.isOddCache.set('0', new BadRequestException('Invalid number'));
  }

  async getIsOdd(number: string) {
    let result = this.getIsOddFromCache(number);

    if (result !== null) {
      return {
        result,
      };
    }

    const numericResult = this.isOddSchema.safeParse(number);

    if (!numericResult.success) {
      const exception = new BadRequestException('Invalid number');
      this.logger.log('Storing exception in cache');
      this.isOddCache.set(number, exception);

      throw exception;
    }

    result = this.calculateIsOddNumber(numericResult.data);

    return {
      result,
    };
  }

  private calculateIsOddNumber(n: number) {
    const result = n % 2 !== 0;
    this.logger.log(`Caching odd number result for ${n}: ${result}`);
    this.isOddCache.set(n.toString(), result);
    return result;
  }

  private getIsOddFromCache(n: string) {
    if (this.isOddCache.has(n)) {
      this.logger.log(`Cache hit for ${n}`);
      const result = this.isOddCache.get(n);

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
