import { ProductDto } from 'src/products/dto/product.dto';
import { CartItem } from '../entities/cart.entity';

export class CartItemDto {
  id: number;
  product: ProductDto;
  quantity: number;

  static fromSchema(item: CartItem): CartItemDto {
    return {
      id: item.id,
      quantity: item.quantity,
      product: ProductDto.fromSchema(item.product),
    };
  }
}
