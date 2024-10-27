import { BadRequestException, Injectable } from '@nestjs/common';
import { z } from 'zod';

@Injectable()
export class FizzBuzzService {
  private readonly fizzBuzzSchema = z.coerce.number();
  private readonly fizzBuzzCache: Map<string, string> = new Map();

  async getFizzBuzz(number: string) {
    // First, check if the number is already in the cache
    if (this.fizzBuzzCache.has(number)) {
      return {
        result: this.fizzBuzzCache.get(number),
      };
    }

    // If not, parse the number
    const numericResult = this.fizzBuzzSchema.safeParse(number);

    if (!numericResult.success) {
      throw new BadRequestException('Invalid number');
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

    // Cache the result
    this.fizzBuzzCache.set(number, result);

    return {
      result,
    };
  }
}
