import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  HttpException,
  NotFoundException,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PaginationDto } from 'src/pagination/pagination.dto';
import { ProductResponseDto } from './dto/product.response.dto';
import { ProductPublicDTO } from './dto/product.public.dto';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  async create(
    @Body() createProductDto: CreateProductDto,
  ): Promise<ProductResponseDto> {
    const response = await this.productsService.create(createProductDto);

    if (response instanceof HttpException) {
      throw response;
    }

    return ProductResponseDto.toPublic(response);
  }

  @Get()
  async findAll(
    @Query() pagination: PaginationDto,
  ): Promise<ProductResponseDto> {
    const products = await this.productsService.findAll(pagination);

    if (products instanceof HttpException) {
      throw products;
    }

    return ProductResponseDto.toPublic(products);
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<ProductPublicDTO> {
    const product = await this.productsService.findOne(+id);

    if (!product) {
      throw new NotFoundException('Product not found');
    }
    return product;
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
  ): Promise<ProductResponseDto> {
    const response = await this.productsService.update(+id, updateProductDto);

    if (response instanceof HttpException) {
      throw response;
    }

    return ProductResponseDto.toPublic(response);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<ProductResponseDto> {
    const response = await this.productsService.remove(+id);

    if (response instanceof HttpException) {
      throw response;
    }

    return ProductResponseDto.toPublic(response);
  }

  @Patch(':id/restore')
  async restore(@Param('id') id: string): Promise<ProductResponseDto> {
    const response = await this.productsService.restore(+id);

    if (response instanceof HttpException) {
      throw response;
    }

    return ProductResponseDto.toPublic(response);
  }
}
