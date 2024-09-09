import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { CategoriesService } from 'src/categories/categories.service';
import { Category } from 'src/categories/entities/category.entity';
import { ProductDto } from './dto/product.dto';
import { PaginationDto } from 'src/pagination/pagination.dto';
import { ProductResponseDto } from './dto/product.response.dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product) private productRepository: Repository<Product>,
    private categoryService: CategoriesService,
  ) {}
  async create(createProductDto: CreateProductDto) {
    const category = await this.categoryService.findOne(
      createProductDto.categoryId,
    );

    if (!(category instanceof Category)) {
      throw new NotFoundException('Category not found');
    }

    createProductDto.createdAt = new Date();

    const product: ProductDto = ProductDto.fromRequest(
      createProductDto,
      category,
    );

    return await this.productRepository.save(product);
  }

  async findAll(pagination: PaginationDto): Promise<ProductResponseDto> {
    try {
      const { page = 1, limit = 3 } = pagination;

      const skip = (page - 1) * limit;

      const [products, total] = await this.productRepository.findAndCount({
        relations: ['category'],
        take: limit,
        skip,
      });

      const totalPages = Math.ceil(total / limit);

      if (page > totalPages) {
        throw new NotFoundException('Page not found');
      }

      return {
        data: products,
        total,
        page,
        totalPages,
      };
    } catch (error) {
      throw new Error(error);
    }
  }

  async findOne(id: number): Promise<Product> {
    try {
      const product = await this.productRepository.findOne({
        where: { id },
        relations: ['category'],
      });

      if (!(product instanceof Product)) {
        throw new NotFoundException('Product not found');
      }

      return product;
    } catch (error) {
      throw new Error(error);
    }
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    try {
      const product = await this.productRepository.findOne({ where: { id } });

      if (!(product instanceof Product)) {
        throw new NotFoundException('Product not found');
      }

      const category = await this.categoryService.findOne(
        updateProductDto.categoryId,
      );

      if (!(category instanceof Category)) {
        throw new NotFoundException('Category not found');
      }

      updateProductDto.updatedAt = new Date();

      const productUpdated: ProductDto = ProductDto.fromRequest(
        updateProductDto,
        category,
      );

      const updatedProduct = await this.productRepository.update(
        id,
        productUpdated,
      );

      if (updatedProduct.affected === 1) {
        return {
          message: 'Product updated successfully',
          product: await this.findOne(id),
        };
      }
    } catch (error) {
      throw new Error(error);
    }
  }

  async remove(id: number) {
    try {
      const product = await this.productRepository.findOne({ where: { id } });

      if (!(product instanceof Product)) {
        throw new NotFoundException('Product not found');
      }

      await this.productRepository.softDelete(id);

      return {
        message: 'Product removed successfully',
      };
    } catch (error) {
      throw new Error(error);
    }
  }

  async restore(id: number) {
    try {
      const product = await this.productRepository.findOne({
        where: { id },
        withDeleted: true,
      });

      if (!(product instanceof Product)) {
        throw new NotFoundException('Product not found');
      }

      await this.productRepository.restore(id);

      return {
        message: 'Product restored successfully',
      };
    } catch (error) {
      throw new Error(error);
    }
  }
}
