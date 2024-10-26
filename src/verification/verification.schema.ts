import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { User } from 'src/users/user.schema';

@Schema({ collection: 'verification-codes', timestamps: true })
export class VerificationCode extends Document {
  @Prop({ required: true, unique: true })
  code: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  user: User;
}

export const VerificationCodeSchema =
  SchemaFactory.createForClass(VerificationCode);
