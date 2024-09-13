import { UserDto } from 'src/users/dto/user.dto';
import { Cart } from '../entities/cart.entity';
import { CartItemDto } from './cartItem.dto';

export class CartDto {
  id: number;
  user: UserDto;
  items: CartItemDto[];

  static fromSchema(cart: Cart): CartDto {
    return {
      id: cart.id,
      user: UserDto.fromSchema(cart.user),
      items: cart.items,
    };
  }
}
