import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

type UserPreferences = {
  emailNotifications: boolean;
};

@Schema({ collection: 'users', timestamps: true })
export class User extends Document {
  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({
    type: Object,
    raw: {
      emailNotifications: { type: Boolean },
    },
    required: true,
    default: { emailNotifications: true },
  })
  preferences: UserPreferences;

  @Prop({ required: true, default: false })
  verified: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);
