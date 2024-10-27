import { Controller, Get, Param } from '@nestjs/common';
import { MiscService } from './misc.service';

@Controller('misc')
export class MiscController {
  constructor(private readonly miscService: MiscService) {}

  @Get('fizzbuzz/:number')
  async getFizzBuzz(@Param('number') number: string) {
    return this.miscService.getFizzBuzz(number);
  }
}
