import { Controller, Get, Param } from '@nestjs/common';
import { FizzBuzzService } from './fizzbuzz.service';
import { FibonacciService } from './fibonacci.service';
import { EchoService } from './echo.service';

@Controller('misc')
export class MiscController {
  constructor(
    private readonly fizzBuzzService: FizzBuzzService,
    private readonly fibonacciService: FibonacciService,
    private readonly echoService: EchoService,
  ) {}

  @Get('fizzbuzz/:number')
  async getFizzBuzz(@Param('number') number: string) {
    return this.fizzBuzzService.getFizzBuzz(number);
  }

  @Get('fibonacci/:number')
  async getFibonacci(@Param('number') number: string) {
    return this.fibonacciService.getFibonacci(number);
  }

  @Get('echo/:message')
  async getEcho(@Param('message') message: string) {
    return this.echoService.getEcho(message);
  }
}
