import {
  BadRequestException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Not, Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { CategoriesService } from 'src/categories/categories.service';
import { ProductDto } from './dto/product.dto';
import { PaginationDto } from 'src/pagination/pagination.dto';
import { ProductResponseDto } from './dto/product.response.dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product) private productRepository: Repository<Product>,
    private categoryService: CategoriesService,
  ) {}
  async create(
    createProductDto: CreateProductDto,
  ): Promise<ProductResponseDto> {
    try {
      const existingProduct = await this.productRepository.findOne({
        where: { name: createProductDto.name },
      });

      if (existingProduct) {
        throw new BadRequestException('Product already exists');
      }

      const category = await this.categoryService.findOne(
        createProductDto.categoryId,
      );

      if (!category) {
        throw new NotFoundException('Category not found');
      }

      createProductDto.createdAt = new Date();

      const product: ProductDto = ProductDto.fromRequest(
        createProductDto,
        category,
      );

      await this.productRepository.save(product);

      return {
        status: HttpStatus.CREATED,
        message: 'Product created successfully',
        data: [product],
      };
    } catch (error) {
      throw error;
    }
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

      const totalPages =
        Math.ceil(total / limit) === 0 ? 1 : Math.ceil(total / limit);

      if (page > totalPages && page > 1) {
        throw new NotFoundException('Page not found');
      }

      return {
        status: HttpStatus.OK,
        message: 'Products found successfully',
        data: products,
        total,
        page,
        totalPages,
      };
    } catch (error) {
      throw error;
    }
  }

  async findOne(id: number): Promise<Product> {
    try {
      const product = await this.productRepository.findOne({
        where: { id },
        relations: ['category'],
      });
      return product;
    } catch (error) {
      throw new Error(error);
    }
  }

  async update(
    id: number,
    updateProductDto: UpdateProductDto,
  ): Promise<ProductResponseDto> {
    try {
      if (updateProductDto.name) {
        const existingProduct = await this.productRepository.findOne({
          where: { name: updateProductDto.name },
        });

        if (existingProduct && existingProduct.id !== id) {
          throw new BadRequestException('Product already exists');
        }
      }

      const product = await this.productRepository.findOne({ where: { id } });

      if (!product) {
        throw new NotFoundException('Product not found');
      }

      const category = await this.categoryService.findOne(
        updateProductDto.categoryId,
      );

      if (!category) {
        throw new NotFoundException('The category does not exist');
      }

      updateProductDto.updatedAt = new Date();

      const productUpdated: ProductDto = ProductDto.fromRequest(
        updateProductDto,
        category,
      );

      await this.productRepository.update(id, productUpdated);

      return {
        status: HttpStatus.OK,
        message: 'Product updated successfully',
        data: [productUpdated],
      };
    } catch (error) {
      throw error;
    }
  }

  async remove(id: number): Promise<ProductResponseDto> {
    try {
      const product = await this.productRepository.findOne({ where: { id } });

      if (!product) {
        throw new NotFoundException('Product not found');
      }

      await this.productRepository.softDelete(id);

      return {
        status: HttpStatus.OK,
        message: 'Product removed successfully',
        data: [product],
      };
    } catch (error) {
      throw error;
    }
  }

  async restore(id: number): Promise<ProductResponseDto> {
    try {
      const product = await this.productRepository.findOne({
        where: { id, deletedAt: Not(IsNull()) },
        withDeleted: true,
      });

      if (!product) {
        throw new NotFoundException('Product not found');
      }

      await this.productRepository.restore(id);

      return {
        status: HttpStatus.OK,
        message: 'Product restored successfully',
        data: [product],
      };
    } catch (error) {
      throw error;
    }
  }
}
