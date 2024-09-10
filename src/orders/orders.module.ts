import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order, OrderItem } from './entities/order.entity';
import { ProductsModule } from 'src/products/products.module';
import { ProductsService } from 'src/products/products.service';
import { CategoriesModule } from 'src/categories/categories.module';
import { CartService } from 'src/cart/cart.service';
import { UsersService } from 'src/users/users.service';
import { CartModule } from 'src/cart/cart.module';
import { UsersModule } from 'src/users/users.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Order, OrderItem]),
    ProductsModule,
    CategoriesModule,
    CartModule,
    UsersModule,
    AuthModule,
  ],
  providers: [OrdersService, ProductsService, CartService, UsersService],
  controllers: [OrdersController],
  exports: [TypeOrmModule],
})
export class OrdersModule {}
