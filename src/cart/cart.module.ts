import { Module } from '@nestjs/common';
import { CartController } from './cart.controller';
import { CartService } from './cart.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cart, CartItem } from './entities/cart.entity';
import { UsersModule } from 'src/users/users.module';
import { ProductsModule } from 'src/products/products.module';
import { CategoriesModule } from 'src/categories/categories.module';
import { ProductsService } from 'src/products/products.service';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Cart, CartItem]),
    UsersModule,
    ProductsModule,
    CategoriesModule,
    AuthModule,
  ],
  controllers: [CartController],
  providers: [CartService, ProductsService],
  exports: [TypeOrmModule],
})
export class CartModule {}
