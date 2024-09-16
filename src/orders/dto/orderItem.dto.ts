import { ProductDto } from 'src/products/dto/product.dto';
import { OrderItem } from '../entities/order.entity';

export class OrderItemDto {
  product: ProductDto;
  quantity: number;
  price: number;

  static fromSchema(orderItem: OrderItem): OrderItemDto {
    return {
      product: ProductDto.fromSchema(orderItem.product),
      quantity: orderItem.quantity,
      price: orderItem.price,
    };
  }
}
