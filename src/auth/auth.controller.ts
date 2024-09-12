import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Post,
  Request,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserDto } from 'src/users/dto/user.dto';
import { UserPublicDto } from 'src/users/dto/user.public.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signin')
  async signIn(
    @Body() { email, password }: { email: string; password: string },
  ): Promise<{ token: string }> {
    const response = await this.authService.validateUser(email, password);

    if (response instanceof Error) {
      throw response;
    }

    return this.authService.signIn(response);
  }

  @Get('me')
  async getUserInfo(@Request() req): Promise<UserPublicDto> {
    const token = req.headers.authorization.split(' ')[1];

    const user = await this.authService.getUserFromToken(token);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return UserDto.fromSchematoPublic(user);
  }
}
