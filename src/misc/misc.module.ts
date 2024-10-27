import { Module } from '@nestjs/common';
import { MiscController } from './misc.controller';
import { FizzBuzzService } from './fizzbuzz.service';

@Module({
  controllers: [MiscController],
  providers: [FizzBuzzService],
})
export class MiscModule {}
