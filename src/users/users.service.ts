import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './user.schema';
import { hash } from 'bcryptjs';
import { LoginDto } from 'src/auth/dto/login.dto';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

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

  async verifyUser(userId: string) {
    return await this.userModel
      .findOneAndUpdate(
        {
          _id: userId,
          verified: false,
        },
        { verified: true },
      )
      .exec();
  }
}
