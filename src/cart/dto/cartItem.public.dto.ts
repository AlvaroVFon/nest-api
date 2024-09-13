import { ProductPublicDTO } from 'src/products/dto/product.public.dto';
import { CartItem } from '../entities/cart.entity';

export class CartItemPublicDto {
  id: number;
  product: ProductPublicDTO;
  quantity: number;

  static fromSchema(item: CartItem): CartItemPublicDto {
    return {
      id: item.id,
      quantity: item.quantity,
      product: ProductPublicDTO.fromSchemaWithOutCategory(item.product),
    };
  }
}
