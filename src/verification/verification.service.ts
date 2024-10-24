import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { VerificationCode } from './verification.schema';
import { Model } from 'mongoose';
import { User } from 'src/users/user.schema';
import { randomUUID } from 'crypto';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class VerificationService {
  private readonly logger = new Logger(VerificationService.name);

  constructor(
    @InjectModel(VerificationCode.name)
    private verificationCodeModel: Model<VerificationCode>,
  ) {}

  async createVerificationCode(user: User) {
    const code = await this.verificationCodeModel.create({
      user,
      code: randomUUID(),
    });

    return await code.save();
  }

  async removeVerificationCode(code: string) {
    return await this.verificationCodeModel
      .deleteOne({
        code,
      })
      .exec();
  }

  async getUserByCode(code: string) {
    const verificationCode = await this.verificationCodeModel
      .findOne({ code })
      .exec();

    if (!verificationCode || !verificationCode.user) {
      throw new BadRequestException('Invalid verification code');
    }

    return verificationCode.user;
  }

  @Cron('45 * * * * *')
  async clearOldCodes() {
    this.logger.log('Clearing old verification codes');

    const now = new Date();
    now.setMinutes(now.getMinutes() - 30);

    const result = await this.verificationCodeModel
      .deleteMany({ createdAt: { $lt: now } })
      .exec();

    this.logger.log(`Cleared ${result.deletedCount} codes`);
  }
}
