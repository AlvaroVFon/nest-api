import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { Post } from '@nestjs/common';
import { Request } from 'express';
import { JwtAuthGuard } from 'src/auth/auth.guard';
import { OrderPublicDto } from './dto/order.public.dto';

@UseGuards(JwtAuthGuard)
@Controller('orders')
export class OrdersController {
  constructor(private ordersService: OrdersService) {}

  @Post()
  async createOrder(@Req() req: Request): Promise<OrderPublicDto> {
    const user = req?.user;

    const order = await this.ordersService.createOrder(user?.id);

    return OrderPublicDto.fromSchema(order);
  }

  // FIXME: cambiar order por publicOrderDto
  @Get()
  async getOrderByUser(@Req() req: Request): Promise<OrderPublicDto[]> {
    const user = req?.user;

    const orders = await this.ordersService.findAllByUser(user.id);

    return orders.map((order) => OrderPublicDto.fromSchema(order));
  }
}
