import { BadRequestException, Injectable } from '@nestjs/common';
import { z } from 'zod';

@Injectable()
export class MiscService {
  async getFizzBuzz(number: string) {
    const result = z.coerce.number().safeParse(number);

    if (!result.success) {
      throw new BadRequestException('Invalid number');
    }

    const { data: value } = result;

    let response = '';

    if (value % 3 === 0) {
      response += 'Fizz';
    }
    if (value % 5 === 0) {
      response += 'Buzz';
    }

    return {
      result: response || value.toString(),
    };
  }
}
