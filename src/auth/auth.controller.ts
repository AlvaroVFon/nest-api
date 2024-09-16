import { Body, Controller, Get, Post, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Request } from 'express';
// import { UserPublicDto } from 'src/users/dto/user.public.dto';

// import { User } from 'src/users/entities/user.entity';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signin')
  async signIn(
    @Body() { email, password }: { email: string; password: string },
  ): Promise<{ token: string }> {
    const response = await this.authService.validateUser(email, password);

    return this.authService.signIn(response);
  }

  @Get('me')
  async getUserInfo(@Req() req: Request) {
    return req.user;
  }
}
