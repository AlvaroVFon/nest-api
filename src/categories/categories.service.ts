import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { Repository } from 'typeorm';
import { PaginationDto } from 'src/pagination/pagination.dto';
import { CategoryResponse } from './dto/category.response.dto';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
  ) {}

  async create(createCategoryDto: CreateCategoryDto) {
    try {
      createCategoryDto.created_at = new Date();
      return await this.categoryRepository.save(createCategoryDto);
    } catch (error) {
      throw new Error(error);
    }
  }

  async findAll(pagination: PaginationDto) {
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

      const publicCategories = categories.map((category) =>
        CategoryResponse.toObject(category),
      );

      return {
        data: publicCategories,
        total,
        page,
        totalPages,
      };
    } catch (error) {
      throw new Error(error);
    }
  }

  async findOne(id: number): Promise<Category> {
    try {
      const category = await this.categoryRepository.findOne({ where: { id } });

      if (!(category instanceof Category)) {
        throw new NotFoundException('Category not found');
      }

      return category;
    } catch (error) {
      throw new Error(error);
    }
  }

  async update(id: number, updateCategoryDto: UpdateCategoryDto) {
    try {
      const category = await this.categoryRepository.findOne({ where: { id } });

      if (!(category instanceof Category)) {
        throw new NotFoundException('Category not found');
      }

      updateCategoryDto.updated_at = new Date();

      return await this.categoryRepository.update(id, updateCategoryDto);
    } catch (error) {
      throw new Error(error);
    }
  }

  async remove(id: number) {
    try {
      const category = await this.categoryRepository.findOne({ where: { id } });

      if (!(category instanceof Category)) {
        throw new NotFoundException('Category not found');
      }

      const deletedCategory = await this.categoryRepository.softDelete(id);

      if (deletedCategory.affected === 0) {
        throw new NotFoundException('Category not found');
      }

      return {
        message: 'Category deleted successfully',
        category,
      };
    } catch (error) {
      throw new Error(error);
    }
  }

  async restore(id: number) {
    try {
      const category = await this.categoryRepository.findOne({
        where: { id },
        withDeleted: true,
      });

      if (!(category instanceof Category)) {
        throw new NotFoundException('Category not found');
      }

      if (category.deleted_at === null) {
        throw new NotFoundException('Category not deleted');
      }

      const restoredCategory = await this.categoryRepository.restore(id);

      if (restoredCategory.affected === 0) {
        throw new NotFoundException('Category not found');
      }

      return {
        message: 'Category restored successfully',
        category,
      };
    } catch (error) {
      throw new Error(error);
    }
  }
}
