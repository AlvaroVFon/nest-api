import { Order } from '../entities/order.entity';
import { OrderItemPublicDto } from './orderItem.public.dto';

export class OrderPublicDto {
  id: number;
  total: number;
  status: string;
  createdAt: Date;
  checkoutSessionId?: string;
  items: OrderItemPublicDto[];

  static fromSchema(order: Order): OrderPublicDto {
    return {
      id: order.id,
      total: order.total,
      status: order.status,
      createdAt: order.createdAt,
      checkoutSessionId: order?.checkoutSessionId,
      items: order.items.map((item) => OrderItemPublicDto.fromSchema(item)),
    };
  }
}
