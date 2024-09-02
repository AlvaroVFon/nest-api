import { Body, Controller, Get, Post, Request } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signin')
  signIn(@Body() { email, password }: { email: string; password: string }) {
    return this.authService.signIn(email, password);
  }

  @Get('me')
  getUserInfo(@Request() req) {
    const token = req.headers.authorization.split(' ')[1];
    return this.authService.getUserFromToken(token);
  }
}
