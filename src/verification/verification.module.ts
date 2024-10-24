import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  VerificationCode,
  VerificationCodeSchema,
} from './verification.schema';
import { VerificationService } from './verification.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: VerificationCode.name,
        schema: VerificationCodeSchema,
      },
    ]),
  ],
  providers: [VerificationService],
  exports: [VerificationService],
})
export class VerificationModule {}
