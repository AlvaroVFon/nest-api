import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cart, CartItem } from './entities/cart.entity';
import { UsersService } from 'src/users/users.service';
import { ProductsService } from 'src/products/products.service';
import { CreateCartItemDto } from './dto/create-cart-item.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(Cart) private cartRepository: Repository<Cart>,
    @InjectRepository(CartItem)
    private cartItemRepository: Repository<CartItem>,
    private userService: UsersService,
    private productsService: ProductsService,
  ) {}

  async createCart(userId: number): Promise<Cart> {
    try {
      const user = await this.userService.findOne(userId);

      if (!user) {
        throw new NotFoundException('User not found');
      }

      const userCart = await this.cartRepository.findOne({
        where: { user },
        relations: ['items', 'items.product', 'user'],
      });

      if (userCart) {
        throw new Error('Cart already exists');
      }

      const cart = this.cartRepository.create({ user, items: null });

      return await this.cartRepository.save(cart);
    } catch (error) {
      throw error;
    }
  }

  async getCart(userId: number): Promise<Cart> {
    try {
      const user = await this.userService.findOne(userId);

      if (!user) {
        throw new NotFoundException('User not found');
      }

      const cart = await this.cartRepository.findOne({
        where: { user },
        relations: ['items', 'items.product', 'user', 'items.product.category'],
      });

      return cart;
    } catch (error) {
      throw error;
    }
  }

  async addItem(
    userId: number,
    createCartItemDto: CreateCartItemDto,
  ): Promise<CartItem> {
    try {
      let cart = await this.getCart(userId);

      if (!cart) {
        cart = await this.createCart(userId);
      }

      const { productId, quantity } = createCartItemDto;

      const product = await this.productsService.findOne(productId);

      if (!product) {
        throw new NotFoundException('Product not found');
      }

      let cartItem = cart.items?.find((item) => item.product.id === productId);

      if (cartItem) {
        if (cartItem.product.stock < cartItem.quantity + quantity) {
          throw new ConflictException('Not enough stock');
        } else {
          cartItem.quantity += quantity;
        }
      } else {
        if (product.stock < quantity) {
          throw new ConflictException('Not enough stock');
        }
        cartItem = this.cartItemRepository.create({ cart, product, quantity });
        cart.items?.push(cartItem);
      }

      await this.cartItemRepository.save(cartItem);
      await this.cartRepository.save(cart);

      return cartItem;
    } catch (error) {
      throw error;
    }
  }

  async removeItem(
    userId: number,
    updateCartItemDto: UpdateCartItemDto,
  ): Promise<CartItem> {
    try {
      const { cartItemId, quantity } = updateCartItemDto;

      const cart = await this.getCart(userId);

      if (!cart) {
        throw new NotFoundException('Cart not found');
      }

      const cartItem = cart.items?.find((item) => item.id === cartItemId);

      if (!cartItem) {
        throw new NotFoundException('Item not found');
      }

      if (cartItem.quantity <= quantity) {
        cart.items = cart.items?.filter((item) => item.id !== cartItemId);
        await this.cartItemRepository.remove(cartItem);
      } else {
        cartItem.quantity -= quantity;
        await this.cartItemRepository.save(cartItem);
      }

      await this.cartRepository.save(cart);

      return cartItem;
    } catch (error) {
      throw error;
    }
  }
  async clearCart(userId: number): Promise<Cart> {
    try {
      const cart = await this.getCart(userId);

      if (!cart) {
        throw new NotFoundException('Cart not found');
      }

      cart.items = null;

      await this.cartRepository.save(cart);

      return cart;
    } catch (error) {
      throw error;
    }
  }
}
