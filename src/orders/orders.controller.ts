import { Controller, NotFoundException, Req } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { AuthService } from 'src/auth/auth.service';
import { Post } from '@nestjs/common';
import { Request } from 'express';

@Controller('orders')
export class OrdersController {
  constructor(
    private ordersService: OrdersService,
    private authService: AuthService,
  ) {}

  @Post()
  async createOrder(@Req() request: Request) {
    const token = request.headers.authorization.split(' ')[1];

    const user = await this.authService.getUserFromToken(token);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return await this.ordersService.createOrder(user.id);
  }
}
