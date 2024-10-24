import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { VerificationCode } from './verification.schema';
import { Model } from 'mongoose';
import { User } from 'src/users/user.schema';
import { randomUUID } from 'crypto';

@Injectable()
export class VerificationService {
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
}
