import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PaginationDto } from 'src/pagination/pagination.dto';
import { ProductPublicDTO } from './dto/product.public.dto';
import { ProductPublicResponseDto } from './dto/product.response.dto';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  async create(@Body() createProductDto: CreateProductDto) {
    return await this.productsService.create(createProductDto);
  }

  @Get()
  async findAll(
    @Query() pagination: PaginationDto,
  ): Promise<ProductPublicResponseDto> {
    const { data, total, page, totalPages } =
      await this.productsService.findAll(pagination);

    const products = data.map((product) => ProductPublicDTO.toObject(product));

    return {
      data: products,
      total,
      page,
      totalPages,
    };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.productsService.findOne(+id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    return await this.productsService.update(+id, updateProductDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.productsService.remove(+id);
  }

  @Patch(':id/restore')
  async restore(@Param('id') id: string) {
    return await this.productsService.restore(+id);
  }
}
