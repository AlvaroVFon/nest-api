import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
    private usersService: UsersService,
  ) {}

  async getUserEmailByToken(token: string) {
    try {
      const payload = await this.jwtService.verify(token, {
        secret: this.configService.get('JWT_SECRET'),
      });
      console.log('-------------------->Payload', payload);
      return payload.email;
    } catch (error) {
      console.log(error);
      throw new UnauthorizedException('Unauthorized');
    }
  }

  async getRole(token: string) {
    try {
      const email = await this.getUserEmailByToken(token);
      const user = await this.usersService.findOneByEmail(email);

      if (user instanceof User) {
        return user.role_id;
      }
    } catch (error) {
      console.log(error);
    }
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const request = context.switchToHttp().getRequest<Request>();
      const token = request.headers['authorization']?.split(' ')[1];

      const role = await this.getRole(token);

      console.log('------------------------------------>', role);
      if (role !== 1) {
        return false;
      }

      return true;
    } catch (error) {
      console.log(error);
      throw new UnauthorizedException('Unauthorized');
    }
  }
}
