import * as bcrypt from 'bcrypt';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private configService: ConfigService,
    private jwtService: JwtService,
  ) {}
  async signIn(email: string, password: string) {
    const user = await this.usersService.findOneByEmail(email);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (!(await bcrypt.compare(password, user.password))) {
      return new UnauthorizedException('Invalid credentials');
    }

    return this.jwtService.sign(
      { email: user.email, password: user.password },
      { secret: this.configService.get('JWT_SECRET') },
    );
  }

  async getUserFromToken(token: string) {
    const payload = this.jwtService.verify(token, {
      secret: this.configService.get('JWT_SECRET'),
    });

    const { id, email, name, role_id, created_at } =
      await this.usersService.findOneByEmail(payload.email);

    return { id, email, name, role_id, created_at };
  }

  async signOut() {}
}
