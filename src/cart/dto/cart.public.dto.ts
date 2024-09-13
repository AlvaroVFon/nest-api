import { UserPublicDto } from 'src/users/dto/user.public.dto';
import { CartItemPublicDto } from './cartItem.public.dto';
import { Cart } from '../entities/cart.entity';

export class CartPublicDto {
  id: number;
  user?: UserPublicDto;
  items: CartItemPublicDto[];

  static fromSchema(cart: Cart): CartPublicDto {
    return {
      id: cart.id,
      items: cart.items.map((item) => CartItemPublicDto.fromSchema(item)),
    };
  }
}
