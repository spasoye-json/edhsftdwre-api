import { Module } from '@nestjs/common';
import { MiscController } from './misc.controller';
import { FizzBuzzService } from './fizzbuzz.service';
import { FibonacciService } from './fibonacci.service';
import { EchoService } from './echo.service';

@Module({
  controllers: [MiscController],
  providers: [FizzBuzzService, FibonacciService, EchoService],
})
export class MiscModule {}
