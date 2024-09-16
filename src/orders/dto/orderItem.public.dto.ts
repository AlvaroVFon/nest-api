import { ProductPublicDTO as ProductPublicDto } from 'src/products/dto/product.public.dto';
import { OrderItem } from '../entities/order.entity';

export class OrderItemPublicDto {
  id: number;
  product: ProductPublicDto;
  quantity: number;
  price: number;

  static fromSchema(orderItem: OrderItem): OrderItemPublicDto {
    return {
      id: orderItem.id,
      quantity: orderItem.quantity,
      price: orderItem.price,
      product: ProductPublicDto.fromSchemaWithOutCategory(orderItem.product),
    };
  }
}
