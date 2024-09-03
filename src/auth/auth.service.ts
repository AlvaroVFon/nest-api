import * as bcrypt from 'bcrypt';
import { Injectable, UnauthorizedException, HttpStatus } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private configService: ConfigService,
    private jwtService: JwtService,
  ) {}
  async signIn(email: string, password: string) {
    try {
      const user = await this.usersService.findOneByEmail(email);

      if (!(user instanceof User)) {
        return {
          statusCode: HttpStatus.NOT_FOUND,
          message: 'User not found',
        };
      }
      if (!(await bcrypt.compare(password, user.password))) {
        return new UnauthorizedException('Invalid credentials');
      }

      return this.jwtService.sign(
        { email: user.email, password: user.password },
        { secret: this.configService.get('JWT_SECRET') },
      );
    } catch (error) {
      console.log(error);
    }
  }

  async getUserFromToken(token: string) {
    try {
      const payload = await this.jwtService.verify(token, {
        secret: await this.configService.get('JWT_SECRET'),
      });

      const user = await this.usersService.findOneByEmail(payload.email);

      if (!(user instanceof User)) {
        return {
          statusCode: HttpStatus.NOT_FOUND,
          message: 'User not found',
        };
      }
      const { id, email, name, role_id, created_at } = user;
      return { id, email, name, role_id, created_at };
    } catch (error) {
      console.log(error);
    }
  }

  async signOut() {}
}
