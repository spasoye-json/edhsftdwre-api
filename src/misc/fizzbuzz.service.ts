import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { z } from 'zod';

type FizzBuzzResult = BadRequestException | string;

@Injectable()
export class FizzBuzzService {
  private readonly logger = new Logger(FizzBuzzService.name);
  private readonly fizzBuzzSchema = z.coerce.number();
  private readonly fizzBuzzCache: Map<string, FizzBuzzResult> = new Map();

  async getFizzBuzz(number: string) {
    if (this.fizzBuzzCache.has(number)) {
      this.logger.log('Cache hit');
      const result = this.fizzBuzzCache.get(number);

      if (typeof result === 'string') {
        return {
          result,
        };
      }

      this.logger.log('Cache hit with exception');
      throw result;
    }

    this.logger.log('Cache miss');
    const numericResult = this.fizzBuzzSchema.safeParse(number);

    if (!numericResult.success) {
      const exception = new BadRequestException('Invalid number');
      this.logger.log('Storing exception in cache');
      this.fizzBuzzCache.set(number, exception);

      throw exception;
    }

    const { data: value } = numericResult;
    let response = '';

    if (value % 3 === 0) {
      response += 'Fizz';
    }
    if (value % 5 === 0) {
      response += 'Buzz';
    }

    const result = response || value.toString();

    this.logger.log('Storing result in cache');
    this.fizzBuzzCache.set(number, result);

    return {
      result,
    };
  }
}
