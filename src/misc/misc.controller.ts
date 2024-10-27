import { Controller, Get, Param } from '@nestjs/common';
import { FizzBuzzService } from './fizzbuzz.service';

@Controller('misc')
export class MiscController {
  constructor(private readonly fizzBuzzService: FizzBuzzService) {}

  @Get('fizzbuzz/:number')
  async getFizzBuzz(@Param('number') number: string) {
    return this.fizzBuzzService.getFizzBuzz(number);
  }
}
