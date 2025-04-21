import { Controller, Get, Param, Res } from '@nestjs/common';
import { ImageService } from './image.service';
import { Response } from 'express';

@Controller('image')
export class ImageController {
  constructor(private readonly imageService: ImageService) {}

  @Get('random')
  async getRandomImage(@Res() response: Response) {
    const url = await this.imageService.getRandomImageUrl(
      this.imageService.getDefaultImageSize(),
    );
    response.redirect(url);
  }

  @Get('random/:size')
  async getRandomImageWithSize(
    @Res() response: Response,
    @Param('size') size: string,
  ) {
    const imageSize = this.imageService.parseImageSize(size, size);
    const url = await this.imageService.getRandomImageUrl(imageSize);
    response.redirect(url);
  }

  @Get('random/:width/:height')
  async getRandomImageWithWidthAndHeight(
    @Res() response: Response,
    @Param('width') width: string,
    @Param('height') height: string,
  ) {
    const imageSize = this.imageService.parseImageSize(width, height);
    const url = await this.imageService.getRandomImageUrl(imageSize);
    response.redirect(url);
  }
}
