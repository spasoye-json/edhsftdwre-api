import { Body, Controller, Post } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { VerificationService } from 'src/verification/verification.service';
import { VerifyDto } from './dto/verify.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
    private readonly verificationService: VerificationService,
  ) {}

  @Post('register')
  async register(@Body() body: LoginDto) {
    const user = await this.usersService.createUser(body);
    await this.verificationService.createVerificationCode(user);

    return user;
  }

  @Post('verify')
  async verify(@Body() body: VerifyDto) {
    const user = await this.verificationService.getUserByCode(body.code);

    return await this.usersService.verifyUser(user);
  }

  @Post('login')
  async login(@Body() body: LoginDto) {
    const user = await this.authService.validateUser(body);
    return this.authService.login(user);
  }
}
