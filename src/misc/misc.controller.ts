import { Controller, Get, Param } from '@nestjs/common';
import { FizzBuzzService } from './fizzbuzz.service';
import { FibonacciService } from './fibonacci.service';
import { EchoService } from './echo.service';
import { IsEvenService } from './is-even.service';
import { IsOddService } from './is-odd.service';
import { PalindromeService } from './palindrome.service';

@Controller('misc')
export class MiscController {
  constructor(
    private readonly fizzBuzzService: FizzBuzzService,
    private readonly fibonacciService: FibonacciService,
    private readonly echoService: EchoService,
    private readonly isEvenService: IsEvenService,
    private readonly isOddService: IsOddService,
    private readonly palindromeService: PalindromeService,
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

  @Get('is-even/:number')
  async getIsEven(@Param('number') number: string) {
    return this.isEvenService.getIsEven(number);
  }

  @Get('is-odd/:number')
  async getIsOdd(@Param('number') number: string) {
    return this.isOddService.getIsOdd(number);
  }

  @Get('palindrome/:message')
  async getPalindrome(@Param('message') message: string) {
    return this.palindromeService.getPalindrome(message);
  }
}
