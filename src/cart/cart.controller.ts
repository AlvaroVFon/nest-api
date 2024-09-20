import {
  Body,
  Controller,
  Post,
  Get,
  UseGuards,
  Req,
  Patch,
  Delete,
} from '@nestjs/common';
import { CreateCartItemDto } from './dto/create-cart-item.dto';
import { CartService } from './cart.service';
import { JwtAuthGuard } from 'src/auth/auth.guard';
import { Request } from 'express';
import { CartPublicDto } from './dto/cart.public.dto';
import { CartItemPublicDto } from './dto/cartItem.public.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';

@UseGuards(JwtAuthGuard)
@Controller('cart')
export class CartController {
  constructor(private cartService: CartService) {}

  @Get()
  async getCart(@Req() req: Request): Promise<CartPublicDto> {
    const user = req?.user;

    if (!user) {
      throw new Error('User not found');
    }

    const cart = await this.cartService.getCart(user.id);

    return CartPublicDto.fromSchema(cart);
  }

  @Post()
  async addItem(
    @Req() req: Request,
    @Body() createCartItemDto: CreateCartItemDto,
  ): Promise<CartItemPublicDto> {
    const user = req?.user;

    if (!user) {
      throw new Error('User not found');
    }

    const addItem = await this.cartService.addItem(user.id, createCartItemDto);

    return CartItemPublicDto.fromSchema(addItem);
  }

  @Patch('/remove')
  async removeItem(
    @Req() req: Request,
    @Body() updateCartItemDto: UpdateCartItemDto,
  ): Promise<CartItemPublicDto> {
    const user = req?.user;

    if (!user) {
      throw new Error('User not found');
    }

    const removeItem = await this.cartService.removeItem(
      user.id,
      updateCartItemDto,
    );

    return CartItemPublicDto.fromSchema(removeItem);
  }

  @Delete()
  async clearCart(@Req() req: Request): Promise<CartPublicDto> {
    const user = req?.user;

    if (!user) {
      throw new Error('User not found');
    }

    const clearCart = await this.cartService.clearCart(user.id);

    return CartPublicDto.fromSchema(clearCart);
  }
}
