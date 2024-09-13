import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order, OrderItem, OrderStatus } from './entities/order.entity';
import { ProductsService } from 'src/products/products.service';
import { CartService } from 'src/cart/cart.service';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private orderRespository: Repository<Order>,
    @InjectRepository(OrderItem)
    private orderItemRespository: Repository<OrderItem>,
    private productsService: ProductsService,
    private cartService: CartService,
    private usersService: UsersService,
  ) {}

  async createOrder(userId: number): Promise<Order> {
    try {
      const user = await this.usersService.findOne(userId);

      if (!user) {
        throw new NotFoundException('User not found');
      }

      const { items } = await this.cartService.getCart(userId);

      if (!items.length) {
        throw new NotFoundException('Cart is empty');
      }

      items.forEach(async (item) => {
        const product = await this.productsService.findOne(item.product.id);

        if (!product) {
          throw new NotFoundException('Product not found');
        }

        if (product.stock < item.quantity) {
          throw new Error('Insufficient stock');
        }

        await this.productsService.update(product.id, {
          stock: product.stock - item.quantity,
        });

        this.orderItemRespository.create({
          product,
          quantity: item.quantity,
          price: product.price,
        });
      });

      const order = await this.orderRespository.save({
        user,
        items,
        total: items.reduce(
          (acc, item) => acc + item.product.price * item.quantity,
          0,
        ),
        status: OrderStatus.PENDING,
        createdAt: new Date(),
      });

      await this.cartService.clearCart(userId);

      return order;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async findOneByUser(userId: number): Promise<Order> {
    try {
      const user = await this.usersService.findOne(userId);

      if (!user) {
        throw new NotFoundException('User not found');
      }

      return await this.orderRespository.findOne({ where: { user } });
    } catch (error) {
      throw new Error(error.message);
    }
  }
}
