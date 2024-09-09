import {
  Body,
  Controller,
  Req,
  Post,
  UnauthorizedException,
  NotFoundException,
  Get,
  Param,
  Delete,
} from '@nestjs/common';
import { CreateCartItemDto } from './dto/create-cart-item.dto';
import { CartService } from './cart.service';
import { ProductsService } from 'src/products/products.service';
import { UsersService } from 'src/users/users.service';
import { AuthService } from 'src/auth/auth.service';
import { Request } from 'express';
import { Cart } from './entities/cart.entity';

@Controller('cart')
export class CartController {
  constructor(
    private cartService: CartService,
    private productService: ProductsService,
    private userService: UsersService,
    private authService: AuthService,
  ) {}
  @Post()
  async addItem(
    @Req() request: Request,
    @Body() createCartItemDto: CreateCartItemDto,
  ) {
    try {
      const token = request.headers['authorization'].split(' ')[1];

      if (!token) {
        throw new UnauthorizedException('Unauthorized');
      }

      const userFromToken = await this.authService.getUserFromToken(token);

      if (!userFromToken) {
        throw new UnauthorizedException('Invalid token');
      }

      const user = await this.userService.findOneByEmail(userFromToken.email);

      if (!user) {
        throw new NotFoundException('User not found');
      }

      return await this.cartService.addItem(user.id, createCartItemDto);
    } catch (error) {
      throw new Error(error);
    }
  }
  @Get()
  async getCarts(@Req() request: Request): Promise<Cart> {
    try {
      const token = request.headers['authorization'].split(' ')[1];

      if (!token) {
        throw new UnauthorizedException('Unauthorized');
      }

      const userFromToken = await this.authService.getUserFromToken(token);

      if (!userFromToken) {
        throw new UnauthorizedException('Invalid token');
      }

      const user = await this.userService.findOneByEmail(userFromToken.email);

      if (!user) {
        throw new NotFoundException('User not found');
      }

      return await this.cartService.getCart(user.id);
    } catch (error) {
      throw new Error(error);
    }
  }
  @Delete(':id')
  async removeItem(@Req() request: Request, @Param('id') id: number) {
    try {
      const token = request.headers['authorization'].split(' ')[1];

      if (!token) {
        throw new UnauthorizedException('Unauthorized');
      }

      const userFromToken = await this.authService.getUserFromToken(token);

      if (!userFromToken) {
        throw new UnauthorizedException('Invalid token');
      }

      const user = await this.userService.findOneByEmail(userFromToken.email);

      if (!user) {
        throw new NotFoundException('User not found');
      }

      const product = await this.productService.findOne(id);

      return await this.cartService.removeItem(user.id, product.id);
    } catch (error) {
      throw new Error(error);
    }
  }
}
