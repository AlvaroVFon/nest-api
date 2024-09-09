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

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'db',
      port: 5432,
      username: 'postgres',
      password: 'postgres',
      database: 'postgres',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
    }),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    UsersModule,
    RolesModule,
    AuthModule,
    CategoriesModule,
    ProductsModule,
    CartModule,
  ],
  controllers: [AppController, NotFoundControllerController, CartController],
  providers: [
    AppService,
    CartService,
    ProductsService,
    CategoriesService,
    UsersService,
  ],
})
export class AppModule {
  constructor(private dataSourde: DataSource) {}
}
