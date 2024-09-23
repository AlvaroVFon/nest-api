import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { UsersModule } from './users/users.module';
import { RolesModule } from './roles/roles.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { NotFoundControllerController } from './not-found-controller/not-found-controller.controller';
import { CategoriesModule } from './categories/categories.module';
import { ProductsModule } from './products/products.module';
import { CartController } from './cart/cart.controller';
import { CartModule } from './cart/cart.module';
import { CartService } from './cart/cart.service';
import { ProductsService } from './products/products.service';
import { CategoriesService } from './categories/categories.service';
import { UsersService } from './users/users.service';
import { OrdersModule } from './orders/orders.module';
import { RolesService } from './roles/roles.service';
import { StripeService } from './stripe/stripe.service';
import { StripeModule } from './stripe/stripe.module';
import { StripeController } from './stripe/stripe.controller';
import { OrdersService } from './orders/orders.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT,
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
    }),

    UsersModule,
    RolesModule,
    AuthModule,
    CategoriesModule,
    ProductsModule,
    CartModule,
    OrdersModule,
    StripeModule,
  ],
  controllers: [
    AppController,
    NotFoundControllerController,
    CartController,
    StripeController,
  ],
  providers: [
    AppService,
    CartService,
    ProductsService,
    CategoriesService,
    UsersService,
    RolesService,
    StripeService,
    OrdersService,
  ],
})
export class AppModule {
  constructor(private dataSourde: DataSource) {}
}
