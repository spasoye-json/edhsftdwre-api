import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './user.schema';
import { hash } from 'bcryptjs';
import { LoginDto } from 'src/auth/dto/login.dto';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class UsersService {
  private readonly logger: Logger = new Logger(UsersService.name);

  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  async createUser(body: LoginDto) {
    const { email } = body;
    const password = await hash(body.password, 10);
    const user = new this.userModel({
      email,
      password,
    });
    return await user.save();
  }

  async findByEmail(email: string) {
    return await this.userModel.findOne({ email }).exec();
  }

  async findById(userId: string) {
    return await this.userModel.findById(userId).exec();
  }

  async verifyUser({ _id }: User) {
    const user = await this.findById(_id.toString());

    if (user.verified) {
      throw new BadRequestException('User is already verified');
    }

    user.verified = true;
    return await user.save();
  }

  async findNotifiableUserById(userId: string) {
    return await this.userModel
      .findOne({
        _id: userId,
        verified: true,
        'preferences.emailNotifications': true,
      })
      .exec();
  }

  @Cron('45 * * * * *')
  async clearOldUsers() {
    this.logger.log('Clearing old unverified users');

    const now = new Date();
    now.setMinutes(now.getMinutes() - 30);
    const results = await this.userModel
      .deleteMany({ createdAt: { $lt: now }, verified: false })
      .exec();

    this.logger.log(`Cleared ${results.deletedCount} users`);
  }
}
