import { Controller, Get, Res } from '@nestjs/common';
import { ImageService } from './image.service';
import { Response } from 'express';

@Controller('image')
export class ImageController {
  constructor(private readonly imageService: ImageService) {}

  @Get('random')
  async getRandomImage(@Res() response: Response) {
    const url = await this.imageService.getRandomImageUrl();
    response.redirect(url);
  }
}
