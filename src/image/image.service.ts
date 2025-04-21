import { Injectable, Logger } from '@nestjs/common';

// TODO: Make this a configurable value
const DEFAULT_SIZE = 200;

@Injectable()
export class ImageService {
  private readonly logger = new Logger(ImageService.name);

  async getRandomImageUrl() {
    this.logger.log('Fetching random image URL');
    return this.generateRandomImageUrl(DEFAULT_SIZE);
  }

  private generateRandomImageUrl(size: number) {
    this.logger.log(`Generating random image URL with size: ${size}`);
    return `https://picsum.photos/${size}`;
  }
}
