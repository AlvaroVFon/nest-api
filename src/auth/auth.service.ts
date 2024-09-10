import * as bcrypt from 'bcrypt';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { User } from 'src/users/entities/user.entity';
import { UserResponse } from 'src/users/dto/user.response.dto';
import { UserDto } from 'src/users/dto/user.dto';

@Injectable()
export class AuthService {
  JWT_SECRET = this.configService.get('JWT_SECRET');

  constructor(
    private usersService: UsersService,
    private configService: ConfigService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    try {
      const user = await this.usersService.findOneByEmail(email);

      if (!(user instanceof User)) {
        throw new UnauthorizedException('Invalid credentials');
      }

      if (!(await bcrypt.compare(password, user.password))) {
        throw new UnauthorizedException('Invalid credentials');
      }

      return UserResponse.toObject(user);
    } catch (error) {
      console.log(error);
    }
  }

  async signIn(user: User): Promise<{ token: string }> {
    const payload = { email: user.email, id: user.id };
    return {
      token: await this.jwtService.sign(payload, {
        secret: this.JWT_SECRET,
      }),
    };
  }

  async getUserFromToken(token: string): Promise<UserDto> {
    try {
      const payload = await this.jwtService.verify(token, {
        secret: await this.configService.get('JWT_SECRET'),
      });

      const user = await this.usersService.findOneByEmail(payload.email);

      if (!(user instanceof User)) {
        throw new UnauthorizedException('Invalid credentials');
      }
      return user;
    } catch (error) {
      console.log(error);
    }
  }
}
