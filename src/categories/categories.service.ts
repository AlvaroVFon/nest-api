import {
  BadRequestException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { IsNull, Not, Repository } from 'typeorm';
import { PaginationDto } from 'src/pagination/pagination.dto';
import { CategoryResponse } from './dto/category.response.dto';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
  ) {}

  async create(
    createCategoryDto: CreateCategoryDto,
  ): Promise<CategoryResponse> {
    try {
      const category = await this.categoryRepository.findOne({
        where: { name: createCategoryDto.name },
      });

      if (category) {
        throw new BadRequestException('Category already exists');
      }
      const createdCategory =
        await this.categoryRepository.save(createCategoryDto);

      return {
        status: HttpStatus.CREATED,
        message: 'Category created successfully',
        data: [createdCategory],
      };
    } catch (error) {
      throw error;
    }
  }

  async findAll(pagination: PaginationDto): Promise<CategoryResponse> {
    const { page = 1, limit = 3 } = pagination;

    const skip = (page - 1) * limit;

    try {
      const [categories, total] = await this.categoryRepository.findAndCount({
        skip,
        take: limit,
        order: { id: 'ASC' },
      });

      const totalPages = Math.ceil(total / limit);

      if (page > totalPages && totalPages > 0) {
        throw new NotFoundException('Page not found');
      }

      return {
        status: HttpStatus.OK,
        message: 'Categories retrieved successfully',
        data: categories,
        total,
        page,
        totalPages,
      };
    } catch (error) {
      throw error;
    }
  }

  async findOne(id: number): Promise<Category> {
    try {
      return await this.categoryRepository.findOne({ where: { id } });
    } catch (error) {
      throw error;
    }
  }

  async update(
    id: number,
    updateCategoryDto: UpdateCategoryDto,
  ): Promise<CategoryResponse> {
    try {
      const category = await this.categoryRepository.findOne({
        where: { name: updateCategoryDto.name },
      });

      if (category && category.id !== id) {
        throw new BadRequestException('Category name already exists');
      }

      const categoryExists = await this.categoryRepository.findOne({
        where: { id },
      });

      if (!categoryExists) {
        throw new NotFoundException('Category not found');
      }

      updateCategoryDto.updated_at = new Date();

      await this.categoryRepository.update(id, updateCategoryDto);

      const updatedCategory = await this.categoryRepository.findOne({
        where: { id },
      });

      return {
        status: HttpStatus.OK,
        message: 'Category updated successfully',
        data: [updatedCategory],
      };
    } catch (error) {
      throw error;
    }
  }

  async remove(id: number): Promise<CategoryResponse> {
    try {
      const category = await this.categoryRepository.findOne({ where: { id } });

      if (!category) {
        throw new NotFoundException('Category not found');
      }

      await this.categoryRepository.softDelete(id);

      return {
        status: HttpStatus.OK,
        message: 'Category deleted successfully',
        data: [category],
      };
    } catch (error) {
      throw error;
    }
  }

  async restore(id: number): Promise<CategoryResponse> {
    try {
      const category = await this.categoryRepository.findOne({
        where: { id, deleted_at: Not(IsNull()) },
        withDeleted: true,
      });

      if (!category) {
        throw new NotFoundException('Category not found');
      }

      await this.categoryRepository.restore(id);

      return {
        status: HttpStatus.OK,
        message: 'Category restored successfully',
        data: [category],
      };
    } catch (error) {
      throw error;
    }
  }
}
