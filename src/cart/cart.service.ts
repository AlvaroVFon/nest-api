import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cart, CartItem } from './entities/cart.entity';
import { UsersService } from 'src/users/users.service';
import { ProductsService } from 'src/products/products.service';
import { CreateCartItemDto } from './dto/create-cart-item.dto';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(Cart) private cartRepository: Repository<Cart>,
    @InjectRepository(CartItem)
    private cartItemRepository: Repository<CartItem>,
    private userService: UsersService,
    private productsService: ProductsService,
  ) {}

  async getCartOrCreate(userId: number): Promise<Cart> {
    try {
      const user = await this.userService.findOne(userId);

      if (!user) {
        throw new NotFoundException('User not found');
      }

      let cart = await this.cartRepository.findOne({
        where: { user },
        relations: ['items', 'items.product'],
      });

      if (cart) {
        return cart;
      }

      cart = this.cartRepository.create({ user, items: [] });
      return await this.cartRepository.save(cart);
    } catch (error) {
      throw new Error(error);
    }
  }

  async getCart(userId: number): Promise<Cart> {
    const cart = await this.cartRepository.findOne({
      where: { user: { id: userId } },
      relations: ['items', 'items.product'],
    });

    if (!cart) {
      throw new NotFoundException('Cart not found');
    }

    return cart;
  }

  async addItem(
    userId: number,
    createCartItemDto: CreateCartItemDto,
  ): Promise<Cart> {
    const cart = await this.getCartOrCreate(userId);

    const { productId, quantity } = createCartItemDto;

    const product = await this.productsService.findOne(productId);

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    let cartItem = cart.items?.find((item) => item.product.id === productId);

    if (cartItem) {
      if (cartItem.product.stock < cartItem.quantity + quantity) {
        throw new Error('Not enough stock');
      } else {
        cartItem.quantity += quantity;
      }
    } else {
      if (product.stock < quantity) {
        throw new Error('Not enough stock');
      }
      cartItem = this.cartItemRepository.create({ cart, product, quantity });
      cart.items?.push(cartItem);
    }

    await this.cartItemRepository.save(cartItem);
    return this.cartRepository.save(cart);
  }

  async removeItem(userId: number, productId: number) {
    try {
      const cart = await this.getCart(userId);

      const cartItem = cart.items?.find(
        (item) => item.product.id === productId,
      );

      if (!cartItem) {
        throw new NotFoundException('Item not found');
      }

      return await this.cartItemRepository.remove(cartItem);
    } catch (error) {
      throw new Error(error);
    }
  }

  async clearCart(userId: number) {
    try {
      const cart = await this.getCart(userId);

      cart.items = [];

      return await this.cartRepository.save(cart);
    } catch (error) {
      throw new Error(error);
    }
  }
}
