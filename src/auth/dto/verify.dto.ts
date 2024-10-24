import { IsUUID } from 'class-validator';

export class VerifyDto {
  @IsUUID()
  code: string;
}
