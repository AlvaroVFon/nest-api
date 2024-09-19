import { Module } from '@nestjs/common';
import { StripeService } from './stripe.service';
import { StripeController } from './stripe.controller';
import { OrdersService } from 'src/orders/orders.service';
import { OrdersModule } from 'src/orders/orders.module';
import { CartModule } from 'src/cart/cart.module';
import { UsersModule } from 'src/users/users.module';
import { CartService } from 'src/cart/cart.service';
import { UsersService } from 'src/users/users.service';
import { ProductsService } from 'src/products/products.service';
import { RolesService } from 'src/roles/roles.service';
import { CategoriesService } from 'src/categories/categories.service';
import { CategoriesModule } from 'src/categories/categories.module';
import { RolesModule } from 'src/roles/roles.module';
import { ProductsModule } from 'src/products/products.module';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    OrdersModule,
    CartModule,
    UsersModule,
    CategoriesModule,
    RolesModule,
    ProductsModule,
    ConfigModule,
  ],
  providers: [
    StripeService,
    OrdersService,
    CartService,
    UsersService,
    ProductsService,
    RolesService,
    CategoriesService,
    ConfigService,
  ],
  controllers: [StripeController],
})
export class StripeModule {}
