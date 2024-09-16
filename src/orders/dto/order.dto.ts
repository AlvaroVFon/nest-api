import { Order, OrderItem, OrderStatus } from '../entities/order.entity';
import { User } from 'src/users/entities/user.entity';

export class OrderDto {
  user: User;
  items: OrderItem[];
  total: number;
  status: OrderStatus;
  createdAt: Date;

  static fromSchema(order: Order): OrderDto {
    return {
      user: order.user,
      items: order.items,
      total: order.total,
      status: order.status,
      createdAt: order.createdAt,
    };
  }
}
