import {
  Body,
  Controller,
  Post,
  Get,
  UseGuards,
  Req,
  BadRequestException,
  HttpException,
  NotFoundException,
  Patch,
  Delete,
} from '@nestjs/common';
import { CreateCartItemDto } from './dto/create-cart-item.dto';
import { CartService } from './cart.service';
import { ProductsService } from 'src/products/products.service';
import { AuthService } from 'src/auth/auth.service';
import { JwtAuthGuard } from 'src/auth/auth.guard';
import { Request } from 'express';
import { CartPublicDto } from './dto/cart.public.dto';
import { CartItemPublicDto } from './dto/cartItem.public.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';

@UseGuards(JwtAuthGuard)
@Controller('cart')
export class CartController {
  constructor(
    private cartService: CartService,
    private productService: ProductsService,
    private authService: AuthService,
  ) {}

  //FIXME: when first add a item responses one thing and when add same item responses another thing
  @Get()
  async getCart(@Req() request: Request): Promise<CartPublicDto> {
    const token = request.headers['authorization'].split(' ')[1];

    if (!token) {
      throw new BadRequestException('Token not found');
    }

    const user = await this.authService.getUserFromToken(token);

    if (!user) {
      throw new BadRequestException('Invalid token');
    }

    const cart = await this.cartService.getCart(user.id);

    if (!cart) {
      throw new NotFoundException('Cart not found');
    }

    return CartPublicDto.fromSchema(cart);
  }

  @Post()
  async addItem(
    @Req() request: Request,
    @Body() createCartItemDto: CreateCartItemDto,
  ): Promise<CartItemPublicDto> {
    const token = request.headers['authorization'].split(' ')[1];

    if (!token) {
      throw new BadRequestException('Token not found');
    }

    const user = await this.authService.getUserFromToken(token);

    if (!user) {
      throw new BadRequestException('Invalid token');
    }

    const product = await this.productService.findOne(
      createCartItemDto.productId,
    );

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    const addItem = await this.cartService.addItem(user.id, createCartItemDto);

    if (addItem instanceof HttpException) {
      throw addItem;
    }

    return CartItemPublicDto.fromSchema(addItem);
  }

  @Patch('/remove')
  async removeItem(
    @Req() request: Request,
    @Body() updateCartItemDto: UpdateCartItemDto,
  ): Promise<any> {
    const token = request.headers['authorization'].split(' ')[1];

    if (!token) {
      throw new BadRequestException('Token not found');
    }

    const user = await this.authService.getUserFromToken(token);

    if (!user) {
      throw new BadRequestException('Invalid token');
    }

    const removeItem = await this.cartService.removeItem(
      user.id,
      updateCartItemDto,
    );

    console.log(removeItem instanceof HttpException);

    if (removeItem instanceof HttpException) {
      throw removeItem;
    }

    return CartItemPublicDto.fromSchema(removeItem);
  }

  @Delete()
  async clearCart(@Req() request: Request): Promise<CartPublicDto> {
    const token = request.headers['authorization'].split(' ')[1];

    if (!token) {
      throw new BadRequestException('Token not found');
    }

    const user = await this.authService.getUserFromToken(token);

    if (!user) {
      throw new BadRequestException('Invalid token');
    }

    const clearCart = await this.cartService.clearCart(user.id);

    if (clearCart instanceof HttpException) {
      throw clearCart;
    }

    return CartPublicDto.fromSchema(clearCart);
  }
}
