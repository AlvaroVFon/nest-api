import * as bcrypt from 'bcrypt';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class AuthService {
  private JWT_SECRET = this.configService.get('JWT_SECRET');

  constructor(
    private usersService: UsersService,
    private configService: ConfigService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<User> {
    try {
      const user = await this.usersService.findOneByEmail(email);

      if (!user) {
        throw new UnauthorizedException('Invalid credentials');
      }

      if (!(await bcrypt.compare(password, user.password))) {
        throw new UnauthorizedException('Invalid credentials');
      }

      return user;
    } catch (error) {
      throw error;
    }
  }

  async signIn(user: User): Promise<{ token: string }> {
    const payload = { email: user.email, id: user.id };
    return {
      token: this.jwtService.sign(payload, {
        secret: this.JWT_SECRET,
      }),
    };
  }
}
