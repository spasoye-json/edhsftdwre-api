import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { z } from 'zod';

type ImageSize = {
  width: number;
  height: number;
};

@Injectable()
export class ImageService {
  private readonly logger = new Logger(ImageService.name);
  private readonly imageSizeSchema = z.object({
    width: z.coerce.number().int().gt(0),
    height: z.coerce.number().int().gt(0),
  });

  getDefaultImageSize(): ImageSize {
    return { width: 640, height: 480 };
  }

  parseImageSize(width: string, height: string): ImageSize {
    const result = this.imageSizeSchema.safeParse({
      width,
      height,
    });

    if (!result.success) {
      this.logger.log('Invalid image size');

      throw new BadRequestException('Invalid image size');
    }

    const w = result.data.width;
    const h = result.data.height;

    return {
      width: w,
      height: h,
    };
  }

  async getRandomImageUrl(size: ImageSize) {
    this.logger.log('Fetching random image URL');
    return this.generateRandomImageUrl(size);
  }

  private generateRandomImageUrl(size: ImageSize) {
    this.logger.log(`Generating random image URL with size: ${size}`);
    return `https://picsum.photos/${size.width}/${size.height}`;
  }
}
