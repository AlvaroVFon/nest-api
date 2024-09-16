import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { Post } from '@nestjs/common';
import { Request } from 'express';
import { Order } from './entities/order.entity';
import { JwtAuthGuard } from 'src/auth/auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('orders')
export class OrdersController {
  constructor(private ordersService: OrdersService) {}

  @Post()
  async createOrder(@Req() req: Request) {
    const user = req.user;

    const order = await this.ordersService.createOrder(user.id);

    return order;
  }

  // FIXME: cambiar order por publicOrderDto
  @Get()
  async getOrderByUser(@Req() req: Request): Promise<Order[]> {
    const orders = await this.ordersService.findAllByUser(req.user.id);

    return orders;
  }
}
