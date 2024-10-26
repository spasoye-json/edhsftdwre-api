import { Body, Controller, Post } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { VerificationService } from 'src/verification/verification.service';
import { VerifyDto } from './dto/verify.dto';
import {
  createUserRegisterEvent,
  createUserVerifiedEvent,
} from 'src/users/user.mq';
import { JobQueueService } from 'src/job-queue/job-queue.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
    private readonly verificationService: VerificationService,
    private readonly jobQueueService: JobQueueService,
  ) {}

  @Post('register')
  async register(@Body() body: LoginDto) {
    const user = await this.usersService.createUser(body);
    await this.verificationService.createVerificationCode(user);
    await this.jobQueueService.sendTaskMessage(createUserRegisterEvent(user));

    return user;
  }

  @Post('verify')
  async verify(@Body() { code }: VerifyDto) {
    const user = await this.verificationService.getUserByCode(code);

    const verifiedUser = await this.usersService.verifyUser(user);

    await this.jobQueueService.sendTaskMessage(
      createUserVerifiedEvent(verifiedUser),
    );
    await this.verificationService.removeVerificationCode(code);

    return verifiedUser;
  }

  @Post('login')
  async login(@Body() body: LoginDto) {
    const user = await this.authService.validateUser(body);
    return this.authService.login(user);
  }
}
